/**
 * Disparo 1:1 pela API oficial. TRAVAS (todas precisam passar):
 *  1. env WPP_OFICIAL_DISPARO === "sim"   (Vercel)
 *  2. wpp_oficial_config.ligado = true    (banco; nasce false)
 *  3. chamada explícita com confirmar=true e a lista exata de transações aprovada pelo Red
 * `planejar` nunca envia. Idempotência: reserva (template, chave) antes de enviar; duplicata é ignorada.
 * Fora: opt-out (SAIR), reembolso/chargeback, sem telefone, sem token, estourou o teto diário.
 */
import { enviarTemplateComBotao, normalizarDestinoOficial } from "./whatsapp-oficial";
import { TEMPLATES, montarEnvio } from "./wpp-oficial-templates";

const URL = "https://supabase.redpro.com.br";
const h = () => { const k = process.env.SUPABASE_SERVICE_KEY!; return { apikey: k, Authorization: `Bearer ${k}`, "Content-Type": "application/json" }; };
const get = async (q: string) => { const r = await fetch(`${URL}/rest/v1/${q}`, { headers: h(), cache: "no-store" }); if (!r.ok) throw new Error(`${q.split("?")[0]} ${r.status}`); return r.json(); };

export type Pedido = {
    id: string;                 // A1, A2, B1…
    janela: string;             // momento ("noite1", "24h"…): entra na chave de idempotência
    extra: string[];            // variáveis do corpo depois do nome (data, hora, preço…)
    botaoValor?: string;        // sala/caminho (ex.: "noite1", "imersao/manual")
    transacoes?: string[];      // lista exata aprovada; vazio = todos os elegíveis (só no plano)
    excluirTransacoes?: string[]; // ex.: quem já comprou a Formação (obrigatório nos C*)
};

export type Linha = { transacao: string; nome: string; telefone: string; ok: boolean; motivo?: string };

export async function planejar(p: Pedido): Promise<{ linhas: Linha[]; jaEnviados: number; cabeBemNoTeto: boolean; teto: number; hoje: number }> {
    const t = TEMPLATES[p.id];
    if (!t) throw new Error(`template ${p.id} desconhecido`);
    if (t.formacao && !p.excluirTransacoes) throw new Error("template da Formação exige excluirTransacoes (cruzar com a Hotmart antes)");

    const insc = await get("imersao_inscritos?select=transacao,nome,whatsapp,token&order=criado_em.asc&limit=5000");
    const ruins = await get("hotmart_compras?produto_id=eq.8852419&evento=in.(PURCHASE_REFUNDED,PURCHASE_CHARGEBACK,PURCHASE_CANCELED)&select=transacao&limit=5000");
    const barrados = new Set<string>(ruins.map((x: { transacao: string }) => x.transacao));
    const optout = new Set<string>((await get("wpp_oficial_optout?select=telefone")).map((x: { telefone: string }) => x.telefone));
    const feitos = new Set<string>((await get(`wpp_oficial_envios?template=eq.${t.nome}&status=neq.falhou&select=chave&limit=10000`)).map((x: { chave: string }) => x.chave));
    const excl = new Set(p.excluirTransacoes || []);
    const quer = p.transacoes?.length ? new Set(p.transacoes) : null;

    const linhas: Linha[] = [];
    for (const i of insc) {
        if (quer && !quer.has(i.transacao)) continue;
        const tel = normalizarDestinoOficial(i.whatsapp || "");
        const base = { transacao: i.transacao, nome: i.nome, telefone: tel };
        let motivo: string | undefined;
        if (barrados.has(i.transacao)) motivo = "reembolso/chargeback/cancelado";
        else if (!tel || tel.length < 12) motivo = "telefone inválido";
        else if (!i.token) motivo = "sem token de grupo";
        else if (t.marketing && optout.has(tel)) motivo = "pediu SAIR";
        else if (excl.has(i.transacao)) motivo = "excluído (já comprou)";
        else if (feitos.has(`${i.transacao}:${p.janela}`)) motivo = "já enviado neste momento";
        else { try { montarEnvio(p.id, i.nome, i.token, p.extra, p.botaoValor); } catch (e) { motivo = String(e instanceof Error ? e.message : e); } }
        linhas.push({ ...base, ok: !motivo, motivo });
    }
    const cfg = (await get("wpp_oficial_config?select=limite_diario&id=eq.1"))[0];
    const teto = cfg?.limite_diario ?? 250;
    const inicio = new Date(); inicio.setUTCHours(3, 0, 0, 0); if (inicio > new Date()) inicio.setUTCDate(inicio.getUTCDate() - 1); // 00h BRT
    const hoje = (await get(`wpp_oficial_envios?criado_em=gte.${inicio.toISOString()}&status=neq.falhou&select=telefone&limit=10000`)).length;
    const aEnviar = linhas.filter((l) => l.ok).length;
    return { linhas, jaEnviados: feitos.size, cabeBemNoTeto: hoje + aEnviar <= teto, teto, hoje };
}

export async function disparar(p: Pedido & { transacoes: string[] }, confirmar: boolean) {
    if (!confirmar) return { enviados: 0, motivo: "confirmar=false: nada enviado" };
    if (process.env.WPP_OFICIAL_DISPARO !== "sim") return { enviados: 0, motivo: "WPP_OFICIAL_DISPARO não é 'sim' (trava da Vercel)" };
    if (!p.transacoes.length) return { enviados: 0, motivo: "sem lista exata de transações" };
    const cfg = (await get("wpp_oficial_config?select=ligado&id=eq.1"))[0];
    if (!cfg?.ligado) return { enviados: 0, motivo: "wpp_oficial_config.ligado = false" };

    const plano = await planejar(p);
    if (!plano.cabeBemNoTeto) return { enviados: 0, motivo: `estoura o teto diário (${plano.hoje}+${plano.linhas.filter((l) => l.ok).length} > ${plano.teto})` };
    const insc: { transacao: string; nome: string; token: string }[] = await get(`imersao_inscritos?transacao=in.(${p.transacoes.join(",")})&select=transacao,nome,token`);
    const porTx = new Map(insc.map((i) => [i.transacao, i]));
    const t = TEMPLATES[p.id];
    const res: { transacao: string; ok: boolean; erro?: string }[] = [];

    for (const l of plano.linhas.filter((x) => x.ok)) {
        const i = porTx.get(l.transacao)!;
        const chave = `${l.transacao}:${p.janela}`;
        const rsv = await fetch(`${URL}/rest/v1/wpp_oficial_envios?on_conflict=template,chave`, {
            method: "POST", headers: { ...h(), Prefer: "resolution=ignore-duplicates,return=representation" },
            body: JSON.stringify({ template: t.nome, chave, transacao: l.transacao, telefone: l.telefone }),
        });
        const linhasRsv = rsv.ok ? await rsv.json() : [];
        if (!linhasRsv.length) { res.push({ transacao: l.transacao, ok: false, erro: "duplicata ignorada" }); continue; }
        const m = montarEnvio(p.id, i.nome, i.token, p.extra, p.botaoValor);
        const r = await enviarTemplateComBotao(l.telefone, m.template, m.variaveis, m.botaoUrl);
        await fetch(`${URL}/rest/v1/wpp_oficial_envios?id=eq.${linhasRsv[0].id}`, {
            method: "PATCH", headers: h(),
            body: JSON.stringify(r.ok ? { status: "enviado", wamid: r.wamid, atualizado_em: new Date().toISOString() } : { status: "falhou", erro: r.erro, atualizado_em: new Date().toISOString() }),
        });
        res.push({ transacao: l.transacao, ok: r.ok, erro: r.ok ? undefined : r.erro });
        await new Promise((ok) => setTimeout(ok, 1200)); // ritmo baixo
    }
    return { enviados: res.filter((x) => x.ok).length, resultado: res };
}

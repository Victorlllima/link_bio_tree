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
    const res: { transacao: string; ok: boolean; erro?: string }[] = [];

    for (const l of plano.linhas.filter((x) => x.ok)) {
        const i = porTx.get(l.transacao)!;
        const r = await enviarUm({ id: p.id, janela: p.janela, transacao: l.transacao, nome: i.nome, telefone: l.telefone, token: i.token, extra: p.extra, botaoValor: p.botaoValor });
        res.push({ transacao: l.transacao, ok: r.ok, erro: r.ok ? undefined : r.erro });
        await new Promise((ok) => setTimeout(ok, 1200)); // ritmo baixo
    }
    return { enviados: res.filter((x) => x.ok).length, resultado: res };
}

/** Núcleo idempotente: reserva (template, chave) ANTES de enviar; se já existe, não envia. Falha vira status 'falhou' (retentável). */
export async function enviarUm(a: { id: string; janela: string; transacao: string; nome: string; telefone: string; token: string; extra: string[]; botaoValor?: string }): Promise<{ ok: true; wamid: string } | { ok: false; erro: string }> {
    const t = TEMPLATES[a.id];
    const chave = `${a.transacao}:${a.janela}`;
    // falhas anteriores liberam a chave para nova tentativa; enviado/entregue/lido/reservado bloqueiam
    await fetch(`${URL}/rest/v1/wpp_oficial_envios?template=eq.${t.nome}&chave=eq.${encodeURIComponent(chave)}&status=eq.falhou`, { method: "DELETE", headers: h() });
    const rsv = await fetch(`${URL}/rest/v1/wpp_oficial_envios?on_conflict=template,chave`, {
        method: "POST", headers: { ...h(), Prefer: "resolution=ignore-duplicates,return=representation" },
        body: JSON.stringify({ template: t.nome, chave, transacao: a.transacao, telefone: a.telefone }),
    });
    const linhas = rsv.ok ? await rsv.json() : [];
    if (!linhas.length) return { ok: false, erro: "duplicata ignorada" };
    let r: Awaited<ReturnType<typeof enviarTemplateComBotao>>;
    try {
        const m = montarEnvio(a.id, a.nome, a.token, a.extra, a.botaoValor);
        r = await enviarTemplateComBotao(a.telefone, m.template, m.variaveis, m.botaoUrl);
    } catch (e) { r = { ok: false, erro: String(e instanceof Error ? e.message : e) }; }
    await fetch(`${URL}/rest/v1/wpp_oficial_envios?id=eq.${linhas[0].id}`, {
        method: "PATCH", headers: h(),
        body: JSON.stringify(r.ok ? { status: "enviado", wamid: r.wamid, atualizado_em: new Date().toISOString() } : { status: "falhou", erro: r.erro, atualizado_em: new Date().toISOString() }),
    });
    return r;
}

/** Próxima noite da Imersão, em texto, pelo relógio de Brasília. null = as duas noites já passaram (A1 não faz mais sentido). */
export function proximaNoite(agora = new Date()): { data: string; hora: string } | null {
    const fim1 = Date.parse("2026-11-25T22:30:00-03:00"), fim2 = Date.parse("2026-11-26T22:30:00-03:00");
    const t = agora.getTime();
    if (t < fim1) return { data: "quarta, 25/11", hora: "19h" };
    if (t < fim2) return { data: "quinta, 26/11", hora: "19h" };
    return null;
}

/**
 * Gatilho do webhook da Hotmart: A1 (confirmação) para UMA compra. Nunca lança erro (não pode quebrar o webhook).
 * Mesmas travas do disparo em lote: env, wpp_oficial_config.ligado, reembolso, teto diário. Idempotente por transação.
 */
export async function enviarA1DaCompra(c: { transacao: string; nome: string; fone: string; token: string }): Promise<{ enviado: boolean; motivo: string }> {
    try {
        if (process.env.WPP_OFICIAL_DISPARO !== "sim") return { enviado: false, motivo: "env WPP_OFICIAL_DISPARO desligada" };
        const cfg = (await get("wpp_oficial_config?select=ligado,limite_diario&id=eq.1"))[0];
        if (!cfg?.ligado) return { enviado: false, motivo: "wpp_oficial_config.ligado = false" };
        const noite = proximaNoite();
        if (!noite) return { enviado: false, motivo: "noites já passaram" };
        const tel = normalizarDestinoOficial(c.fone || "");
        if (!tel || tel.length < 12) return { enviado: false, motivo: "telefone inválido" };
        if (!c.token) return { enviado: false, motivo: "sem token do grupo" };
        const ruim = await get(`hotmart_compras?transacao=eq.${encodeURIComponent(c.transacao)}&evento=in.(PURCHASE_REFUNDED,PURCHASE_CHARGEBACK,PURCHASE_CANCELED)&select=evento&limit=1`);
        if (ruim.length) return { enviado: false, motivo: "reembolsada/cancelada" };
        const inicio = new Date(); inicio.setUTCHours(3, 0, 0, 0); if (inicio > new Date()) inicio.setUTCDate(inicio.getUTCDate() - 1);
        const hoje = (await get(`wpp_oficial_envios?criado_em=gte.${inicio.toISOString()}&status=neq.falhou&select=id&limit=10000`)).length;
        if (hoje >= (cfg.limite_diario ?? 250)) return { enviado: false, motivo: "teto diário" };
        const r = await enviarUm({ id: "A1", janela: "confirmacao", transacao: c.transacao, nome: c.nome, telefone: tel, token: c.token, extra: [noite.data, noite.hora] });
        return r.ok ? { enviado: true, motivo: r.wamid } : { enviado: false, motivo: r.erro };
    } catch (e) {
        return { enviado: false, motivo: `erro: ${String(e instanceof Error ? e.message : e)}` };
    }
}

/**
 * Catálogo dos 12 templates da API oficial (mapa RIGEL→ION, 13/11/2026).
 * Nome, categoria, idioma, número de variáveis do corpo e tipo de botão têm de bater com o cadastro na Meta.
 * Data, hora e link sempre variável. Quem usa: wpp-oficial-campanha.ts.
 */
export type Botao = "token-grupo" | "sala" | "caminho" | "estatico" | "nenhum";
export type Contexto = { nome: string; token: string; variaveis: string[]; botaoUrl?: string };

export type TemplateDef = {
    nome: string;
    categoria: "UTILITY" | "MARKETING";
    nVars: number;          // variáveis do CORPO ({{1}}…)
    botao: Botao;
    marketing: boolean;     // marketing exige respeitar o opt-out (SAIR)
    formacao?: boolean;     // exige cruzar com quem já comprou a Formação
};

export const TEMPLATES: Record<string, TemplateDef> = {
    A1: { nome: "imersao_confirmacao_v2", categoria: "UTILITY", nVars: 3, botao: "token-grupo", marketing: false },
    A2: { nome: "imersao_falta_grupo_v1", categoria: "UTILITY", nVars: 2, botao: "token-grupo", marketing: false },
    B1: { nome: "imersao_vespera_v2", categoria: "MARKETING", nVars: 3, botao: "token-grupo", marketing: true },
    B2: { nome: "imersao_dia_d_v2", categoria: "MARKETING", nVars: 3, botao: "token-grupo", marketing: true },
    B3: { nome: "imersao_ao_vivo_v2", categoria: "MARKETING", nVars: 2, botao: "sala", marketing: true },
    B4: { nome: "imersao_manual_vps_v1", categoria: "UTILITY", nVars: 2, botao: "caminho", marketing: false },
    B5: { nome: "imersao_gravacao_v1", categoria: "UTILITY", nVars: 2, botao: "caminho", marketing: false },
    C1: { nome: "formacao_carrinho_aberto_v1", categoria: "MARKETING", nVars: 4, botao: "estatico", marketing: true, formacao: true },
    C2: { nome: "formacao_ao_vivo_acaba_v1", categoria: "MARKETING", nVars: 4, botao: "estatico", marketing: true, formacao: true },
    C3: { nome: "formacao_fechamento_v1", categoria: "MARKETING", nVars: 3, botao: "estatico", marketing: true, formacao: true },
    // C4, D1 e D2: acrescentar aqui quando o mapa fechar nome e variáveis (o arquivo do RIGEL é a fonte).
};

/** Monta variáveis do corpo e o texto do botão. `extra` traz os valores do momento (data, hora, preço…), nunca fixos em código. */
export function montarEnvio(id: string, nome: string, token: string, extra: string[], botaoValor?: string) {
    const t = TEMPLATES[id];
    if (!t) throw new Error(`template ${id} não está no catálogo`);
    const primeiro = (nome || "").trim().split(/\s+/)[0] || "";
    if (!primeiro) throw new Error("comprador sem nome");
    // A2 = {{1}} nome, {{2}} datas. A1/B1/B2 = nome, data, hora. B3/B4/B5/C* = nome + extras.
    const variaveis = [primeiro, ...extra];
    if (variaveis.length !== t.nVars) throw new Error(`${t.nome} pede ${t.nVars} variáveis, vieram ${variaveis.length}`);
    if (variaveis.some((v) => !v || !v.trim())) throw new Error("variável vazia");
    const botaoUrl = t.botao === "token-grupo" ? token : t.botao === "sala" || t.botao === "caminho" ? botaoValor : undefined;
    if ((t.botao === "sala" || t.botao === "caminho") && !botaoUrl) throw new Error(`${t.nome} precisa do valor do botão`);
    if (t.botao === "token-grupo" && !token) throw new Error("comprador sem token de grupo");
    return { template: t.nome, variaveis, botaoUrl };
}

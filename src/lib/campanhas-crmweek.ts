/**
 * Campanhas de disparo 1:1 em massa do Desafio CRM.
 *
 * Cada campanha é um texto que muda por pessoa (anti-ban) e recebe o link da
 * aula por env var — porque o link do YouTube não-listado muda a cada ciclo e
 * não deve ser hardcoded.
 *
 * ⚠️ Estes são disparos 1:1 no PRIVADO, complementares ao grupo. Regra do Red:
 * usar só nos marcos críticos (aula 1, aula 4/ficha, carrinho), onde a leitura
 * do grupo não basta. A fila (wpp-fila.ts) garante o ritmo humano.
 */

import { montarMensagem, saudacaoVariada } from "./wpp-humanizar";
import type { ItemFila } from "./wpp-fila";

/** Link da aula por campanha, lido de env (WPP_LINK_<sufixo maiúsculo>). */
function linkDaCampanha(campanha: string): string {
    const chave = "WPP_LINK_" + campanha.toUpperCase().replace(/[^A-Z0-9]/g, "_");
    return process.env[chave] || "[LINK-PENDENTE]";
}

type Render = (item: ItemFila, link: string) => string;

const CAMPANHAS: Record<string, Render> = {
    // Marco 1 — a aula 1 entrou no ar.
    "crmweek-c1-aula1": (item, link) =>
        montarMensagem(
            [
                `${saudacaoVariada(item.nome, item.telefone)} 🧩`,
                "",
                [
                    "A *Aula 1* do Desafio acabou de entrar no ar.",
                    "Acabei de liberar a *Aula 1* do Desafio.",
                    "A *Aula 1* já tá no ar.",
                ],
                "",
                "*O sistema que empresa paga caro, construído em 5 minutos na sua frente.*",
                "",
                link,
                "",
                [
                    "Abre agora, com o computador do lado. Hoje já sai coisa da sua tela.",
                    "Assiste já, computador do lado. Desde hoje é mão na massa.",
                    "Bora começar. Deixa o computador do lado que hoje você já constrói.",
                ],
            ],
            item.telefone,
        ),

    // Marco crítico — abre a ficha de interesse na aula 4.
    "crmweek-c1-ficha": (item) =>
        montarMensagem(
            [
                `${saudacaoVariada(item.nome, item.telefone)}`,
                "",
                [
                    "Abriu a *ficha de interesse* do Desafio, e ela é só pra quem tá levando a sério.",
                    "A *ficha de interesse* acabou de abrir. É pra quem quer o próximo passo.",
                ],
                "",
                "Quem preenche entra *10 minutos antes* na segunda, com uma condição que não volta.",
                "",
                "https://www.redpro.com.br/crm-week-status",
                "",
                ["Leva 2 minutos.", "É rápido, 2 minutos.", "Dois minutos e tá feito."],
            ],
            item.telefone,
        ),

    // Recuperação de abandono de checkout do INGRESSO (R$44). Disparo único,
    // ~2h após o evento PURCHASE_OUT_OF_SHOPPING_CART da Hotmart. 1-a-1 no
    // privado, nunca broadcast (regra Tabari). Checkout fixo (não muda por
    // ciclo, ao contrário do link de aula) — nunca propagar `bid=` (Mission Control).
    "crmweek-c1-abandono": (item) => {
        const link = "https://pay.hotmart.com/R106737413U?checkoutMode=10";
        return montarMensagem(
            [
                `${saudacaoVariada(item.nome, item.telefone)}`,
                "",
                [
                    "Vi que você chegou até o pagamento do *Desafio: Seu CRM em 5 Dias* e não finalizou.",
                    "Percebi que você tava fechando a vaga no *Desafio: Seu CRM em 5 Dias* e travou no pagamento.",
                    "Vi que sua inscrição no *Desafio: Seu CRM em 5 Dias* ficou parada no checkout.",
                ],
                "",
                [
                    "Deu algum problema no cartão ou foi só o corre do dia?",
                    "Foi erro no pagamento ou só ficou pra depois?",
                    "Travou em alguma etapa ou foi mais falta de tempo mesmo?",
                ],
                "",
                "Se for técnico, me chama aqui que eu resolvo com você agora. Se só sumiu a aba, o link tá aqui de novo:",
                "",
                link,
                "",
                [
                    "As aulas começam segunda, 7h. Ainda dá tempo.",
                    "Começa segunda, 7h da manhã. Cabe.",
                ],
            ],
            item.telefone,
        );
    },

    // Carrinho — inscrições abertas.
    "crmweek-c1-carrinho": (item, link) =>
        montarMensagem(
            [
                `${saudacaoVariada(item.nome, item.telefone)}`,
                "",
                [
                    "As inscrições da *Formação S.H.A.R.K.* abriram.",
                    "Abriu a inscrição da *Formação S.H.A.R.K.*",
                ],
                "",
                "Você construiu o CRM em 5 dias. Agora é a parte de transformar isso em cliente pagante.",
                "",
                link,
                "",
                ["Fecha hoje às 21h. Sem prorrogar.", "Encerra hoje 21h.", "Vai até as 21h de hoje, só."],
            ],
            item.telefone,
        ),
};

/** Renderiza a mensagem de uma campanha para um destinatário. */
export function renderCampanha(campanha: string, item: ItemFila): string {
    const fn = CAMPANHAS[campanha];
    if (!fn) return `[campanha desconhecida: ${campanha}]`;
    return fn(item, linkDaCampanha(campanha));
}

export const CAMPANHAS_DISPONIVEIS = Object.keys(CAMPANHAS);

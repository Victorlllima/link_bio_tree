import { NextResponse } from "next/server";
import { loteVigente, dadosDoLote, listaLotes, pctVendido, EVENTO, LOTES } from "@/components/imersao/lote";
import { checkoutUrl } from "@/components/imersao/checkout";
import { lerImersaoConfig, contarVendidosPorLote } from "@/lib/imersao-config";

/* Lote vigente da Imersão para o agente SDR de WhatsApp (Ana).
   Mesma fonte da página /imersao (lote.ts + imersao_config + vendas reais), então o preço que a Ana
   fala é sempre o da página. O campo `texto` já vem pronto para entrar no prompt do agente.
   Só dados públicos (preço, datas, link de compra): sem autenticação. */
export const revalidate = 60;

export async function GET() {
    const [cfg, vendidos] = await Promise.all([lerImersaoConfig(60), contarVendidosPorLote(60)]);
    const { lote, encerrado } = loteVigente(new Date(), {
        loteForcado: cfg.loteForcado,
        encerrado: cfg.encerrado,
        vendidos,
        limite: cfg.limiteLote,
    });
    const d = dadosDoLote(lote, pctVendido(lote, vendidos, cfg.limiteLote));
    const link = checkoutUrl(lote);
    const texto = encerrado
        ? "As vendas do ingresso da Imersão estão ENCERRADAS. Não ofereça ingresso nem passe link; se perguntarem, diga que vai confirmar com o time e transfira."
        : [
              `Ingresso da Imersão em vigor agora: ${d.rotulo}, ${d.preco} (vale até ${d.ate}).`,
              d.proximoPreco ? `Próximo lote: ${d.proximoPreco} a partir de ${d.proximoA}, ou antes se o lote esgotar.` : "Este é o último lote.",
              d.vendidoPct != null && d.vendidoPct > 0 ? `Lote ${d.vendidoPct}% vendido.` : "",
              `Link de compra deste lote: ${link}`,
              `Evento ao vivo: ${EVENTO.extenso}, ${EVENTO.horario}.`,
          ].filter(Boolean).join("\n");
    return NextResponse.json(
        { encerrado, lote: d, checkout: link, lotes: listaLotes(), total_lotes: LOTES.length, texto },
        { headers: { "Cache-Control": "public, s-maxage=60" } },
    );
}

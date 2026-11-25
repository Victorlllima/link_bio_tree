import { cookies } from "next/headers";
import { BASE, COOKIE_PEDIDO, brl, buscarPedido } from "@/lib/demo-loja/loja";
import { Rodape, Topo } from "../ui";

export const dynamic = "force-dynamic";

export default async function Confirmado() {
  const codigo = (await cookies()).get(COOKIE_PEDIDO)?.value ?? "";
  const p = await buscarPedido(codigo);
  return (
    <>
      <Topo qtd={0} />
      <main className="rc-corpo">
        {!p ? (
          <div className="rc-card">
            <h1>Nenhum pedido recente</h1>
            <a href={BASE} className="rc-link">
              Voltar à loja
            </a>
          </div>
        ) : (
          <div className="rc-card rc-confirmado">
            <p className="rc-ok-selo">Pagamento aprovado</p>
            <h1 id="pedido">Pedido confirmado #{p.codigo}</h1>
            <dl className="rc-dl">
              <dt>Produto</dt>
              <dd>
                {p.qtd}× {p.produto}
              </dd>
              <dt>Total</dt>
              <dd id="total">{brl.format(Number(p.total))}</dd>
              <dt>Pagamento</dt>
              <dd>
                {p.bandeira} final {p.final4}
              </dd>
              <dt>Entregar para</dt>
              <dd>{p.cliente}</dd>
              <dt>Endereço</dt>
              <dd>{p.endereco}</dd>
            </dl>
            <p className="rc-muted">Loja de demonstração: nenhuma cobrança real foi feita.</p>
          </div>
        )}
      </main>
      <Rodape />
    </>
  );
}

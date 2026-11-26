import { cookies } from "next/headers";
import { ACAO, COOKIE_CARRINHO, PRODUTO, brl, lerQtd } from "@/lib/demo-loja/loja";
import { Console, Rodape, Topo } from "./ui";

export const dynamic = "force-dynamic";

export default async function Produto() {
  const qtd = lerQtd((await cookies()).get(COOKIE_CARRINHO)?.value);
  const desconto = Math.round((1 - PRODUTO.preco / PRODUTO.precoDe) * 100);
  return (
    <>
      <Topo qtd={qtd} />
      <main className="rc-produto" itemScope itemType="https://schema.org/Product">
        <div className="rc-foto">
          <Console />
        </div>
        <div className="rc-info">
          <p className="rc-rotulo">Games · Consoles</p>
          <h1 itemProp="name" id="produto-nome">
            {PRODUTO.nome}
          </h1>
          <p className="rc-muted">{PRODUTO.subtitulo}</p>
          <div className="rc-precos" itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <meta itemProp="priceCurrency" content="BRL" />
            <meta itemProp="price" content={PRODUTO.preco.toFixed(2)} />
            <p className="rc-de">
              de <s>{brl.format(PRODUTO.precoDe)}</s> <span className="rc-off">-{desconto}%</span>
            </p>
            <p className="rc-por" id="preco">
              {brl.format(PRODUTO.preco)}
            </p>
            <p className="rc-muted">à vista no cartão · frete grátis · entrega em 2 dias úteis</p>
          </div>
          <form method="post" action={ACAO} className="rc-acoes">
            <button type="submit" name="acao" value="comprar" id="comprar">
              Comprar
            </button>
            <button type="submit" name="acao" value="adicionar" className="rc-btn-sec" id="adicionar">
              Adicionar ao carrinho
            </button>
          </form>
          <ul className="rc-lista">
            <li>Garantia de 12 meses</li>
            <li>Em estoque</li>
            <li>Vendido e entregue por RedPro Commerce</li>
          </ul>
        </div>
      </main>
      <Rodape />
    </>
  );
}

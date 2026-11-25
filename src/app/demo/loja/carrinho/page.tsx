import { cookies } from "next/headers";
import { ACAO, BASE, COOKIE_CARRINHO, MAX_QTD, PRODUTO, brl, lerQtd } from "@/lib/demo-loja/loja";
import { Rodape, Topo } from "../ui";

export const dynamic = "force-dynamic";

export default async function Carrinho() {
  const qtd = lerQtd((await cookies()).get(COOKIE_CARRINHO)?.value);
  return (
    <>
      <Topo qtd={qtd} />
      <main className="rc-corpo">
        <h1>Carrinho</h1>
        {qtd === 0 ? (
          <div className="rc-card">
            <p className="rc-vazio">Seu carrinho está vazio.</p>
            <a href={BASE} className="rc-link">
              Ver o PlayStation 5
            </a>
          </div>
        ) : (
          <div className="rc-card">
            <div className="rc-linha">
              <div>
                <strong>{PRODUTO.nome}</strong>
                <p className="rc-muted">{brl.format(PRODUTO.preco)} cada</p>
              </div>
              <form method="post" action={ACAO} className="rc-qtd">
                <input type="hidden" name="acao" value="quantidade" />
                <label htmlFor="qtd">Qtd.</label>
                <select id="qtd" name="qtd" defaultValue={String(qtd)}>
                  {Array.from({ length: MAX_QTD + 1 }, (_, i) => (
                    <option key={i} value={i}>
                      {i === 0 ? "Remover" : i}
                    </option>
                  ))}
                </select>
                <button type="submit" className="rc-btn-sec">
                  Atualizar
                </button>
              </form>
            </div>
            <div className="rc-total">
              <span>Total</span>
              <strong id="total">{brl.format(qtd * PRODUTO.preco)}</strong>
            </div>
            <a href={`${BASE}/checkout`} className="rc-botao" id="ir-checkout">
              Finalizar compra
            </a>
          </div>
        )}
      </main>
      <Rodape />
    </>
  );
}

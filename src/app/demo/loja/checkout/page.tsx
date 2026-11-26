import { cookies } from "next/headers";
import { ACAO, BASE, COOKIE_CARRINHO, PRODUTO, brl, lerQtd } from "@/lib/demo-loja/loja";
import { Rodape, Topo } from "../ui";

export const dynamic = "force-dynamic";

const ERROS: Record<string, string> = {
  cartao: "Loja de demonstração: use o cartão de teste",
  recusado: "Pagamento recusado pelo emissor. Tente outro cartão.",
  validade: "Validade do cartão inválida ou vencida.",
  cvc: "Código de segurança (CVV) inválido.",
  campos: "Preencha nome e endereço completos.",
  banco: "Não consegui registrar o pedido agora. Tente de novo.",
};

export default async function Checkout({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  const qtd = lerQtd((await cookies()).get(COOKIE_CARRINHO)?.value);
  const msg = erro ? ERROS[erro] : undefined;

  if (qtd === 0) {
    return (
      <>
        <Topo qtd={0} />
        <main className="rc-corpo">
          <h1>Checkout</h1>
          <div className="rc-card">
            <p className="rc-vazio">Seu carrinho está vazio.</p>
            <a href={BASE} className="rc-link">
              Ver o PlayStation 5
            </a>
          </div>
        </main>
        <Rodape />
      </>
    );
  }

  return (
    <>
      <Topo qtd={qtd} />
      <main className="rc-corpo">
        <h1>Checkout</h1>
        <div className="rc-resumo">
          <span>
            {qtd}× {PRODUTO.nome}
          </span>
          <strong id="total">{brl.format(qtd * PRODUTO.preco)}</strong>
        </div>
        {msg && (
          <p className="rc-erro" role="alert" id="erro">
            {msg}
          </p>
        )}
        <form method="post" action={ACAO} className="rc-card rc-form" id="form-checkout" name="checkout" autoComplete="on">
          <input type="hidden" name="acao" value="finalizar" />
          <fieldset>
            <legend>Entrega</legend>
            <div className="rc-grade">
              <div className="rc-largo">
                <label htmlFor="name">Nome completo</label>
                <input id="name" name="name" autoComplete="name" required maxLength={120} />
              </div>
              <div>
                <label htmlFor="email">E-mail</label>
                <input id="email" name="email" type="email" autoComplete="email" maxLength={200} />
              </div>
              <div>
                <label htmlFor="tel">Telefone</label>
                <input id="tel" name="tel" type="tel" autoComplete="tel" maxLength={30} />
              </div>
              <div>
                <label htmlFor="postal-code">CEP</label>
                <input id="postal-code" name="postal-code" autoComplete="postal-code" inputMode="numeric" required maxLength={12} />
              </div>
              <div className="rc-largo">
                <label htmlFor="street-address">Endereço (rua, número e complemento)</label>
                <input id="street-address" name="street-address" autoComplete="street-address" required maxLength={200} />
              </div>
              <div>
                <label htmlFor="address-level2">Cidade</label>
                <input id="address-level2" name="address-level2" autoComplete="address-level2" required maxLength={80} />
              </div>
              <div>
                <label htmlFor="address-level1">Estado (UF)</label>
                <input id="address-level1" name="address-level1" autoComplete="address-level1" required maxLength={30} />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Pagamento</legend>
            <div className="rc-grade">
              <div className="rc-largo">
                <label htmlFor="cc-name">Nome impresso no cartão</label>
                <input id="cc-name" name="cc-name" autoComplete="cc-name" required maxLength={120} />
              </div>
              <div className="rc-largo">
                <label htmlFor="cc-number">Número do cartão</label>
                <input id="cc-number" name="cc-number" autoComplete="cc-number" inputMode="numeric" required maxLength={23} />
              </div>
              <div>
                <label htmlFor="cc-exp-month">Mês de validade (MM)</label>
                <input id="cc-exp-month" name="cc-exp-month" autoComplete="cc-exp-month" inputMode="numeric" required maxLength={2} placeholder="12" />
              </div>
              <div>
                <label htmlFor="cc-exp-year">Ano de validade (AAAA)</label>
                <input id="cc-exp-year" name="cc-exp-year" autoComplete="cc-exp-year" inputMode="numeric" required maxLength={4} placeholder="2030" />
              </div>
              <div>
                <label htmlFor="cc-csc">CVV</label>
                <input id="cc-csc" name="cc-csc" autoComplete="cc-csc" inputMode="numeric" required maxLength={4} />
              </div>
            </div>
          </fieldset>
          <button type="submit" id="finalizar">
            Pagar {brl.format(qtd * PRODUTO.preco)}
          </button>
        </form>
      </main>
      <Rodape />
    </>
  );
}

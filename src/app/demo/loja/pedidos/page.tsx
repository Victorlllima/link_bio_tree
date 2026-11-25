import { cookies } from "next/headers";
import { loginConfigurado, sessaoValida } from "@/lib/demo-cotacoes/auth";
import { ACAO, COOKIE_ADM, brl, listarPedidos } from "@/lib/demo-loja/loja";
import { Rodape, Topo } from "../ui";

export const dynamic = "force-dynamic";

const quando = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export default async function Pedidos({ searchParams }: { searchParams: Promise<{ erro?: string; limpo?: string }> }) {
  const sp = await searchParams;
  const jar = await cookies();

  if (!sessaoValida(jar.get(COOKIE_ADM)?.value)) {
    return (
      <>
        <Topo qtd={0} />
        <main className="rc-corpo rc-estreito">
          <h1>Pedidos da loja</h1>
          <p className="rc-muted">Área restrita. Entre com o e-mail e a senha de teste do painel de cotações.</p>
          <form method="post" action={ACAO} className="rc-card rc-form" id="form-login" name="login">
            <input type="hidden" name="acao" value="entrar" />
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required />
            <label htmlFor="senha">Senha</label>
            <input id="senha" name="senha" type="password" autoComplete="current-password" required />
            <button type="submit" id="entrar">
              Entrar
            </button>
          </form>
          {sp.erro === "login" && (
            <p className="rc-erro" role="alert">
              E-mail ou senha incorretos.
            </p>
          )}
          {!loginConfigurado() && <p className="rc-erro">A demonstração ainda não foi liberada.</p>}
        </main>
        <Rodape />
      </>
    );
  }

  const { itens, erro } = await listarPedidos();
  return (
    <>
      <Topo qtd={0} />
      <main className="rc-corpo">
        <div className="rc-lista-topo">
          <h1>
            Pedidos <span className="rc-badge">{itens.length}</span>
          </h1>
          <div className="rc-botoes">
            <form method="post" action={ACAO}>
              <input type="hidden" name="acao" value="limpar" />
              <button type="submit" className="rc-btn-sec" id="limpar-pedidos">
                Limpar pedidos
              </button>
            </form>
            <form method="post" action={ACAO}>
              <input type="hidden" name="acao" value="sair" />
              <button type="submit" className="rc-btn-sec" id="sair">
                Sair
              </button>
            </form>
          </div>
        </div>
        {sp.limpo === "1" && <p className="rc-ok">Pedidos limpos.</p>}
        {(erro || sp.erro === "banco") && <p className="rc-erro">{erro ?? "Banco fora do ar"}</p>}
        {itens.length === 0 ? (
          <p className="rc-vazio">Nenhum pedido ainda.</p>
        ) : (
          <ol className="rc-itens">
            {itens.map((p) => (
              <li key={p.id} className="rc-item">
                <div className="rc-linha">
                  <strong>#{p.codigo}</strong>
                  <span className="rc-valor">{brl.format(Number(p.total))}</span>
                </div>
                <p>
                  {p.qtd}× {p.produto} · {p.bandeira} final {p.final4}
                </p>
                <p className="rc-muted">
                  {p.cliente} · {p.endereco}
                </p>
                <time dateTime={p.criado_em} className="rc-data">
                  {quando.format(new Date(p.criado_em))}
                </time>
              </li>
            ))}
          </ol>
        )}
      </main>
      <Rodape />
    </>
  );
}

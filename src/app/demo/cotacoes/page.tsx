import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { COOKIE, loginConfigurado, sessaoValida } from "@/lib/demo-cotacoes/auth";
import { listar } from "@/lib/demo-cotacoes/store";
import "./cotacoes.css";

/* /demo/cotacoes · página de DEMONSTRAÇÃO da noite 1 da Imersão (Rigel/Red, 23/11/2026).
   O Hermes entra com a senha de teste do cofre e registra a melhor oferta.
   Sem o cookie, o servidor só devolve a tela de login. noindex, fora de menu e sitemap.
   Sem JavaScript no cliente: formulários HTML simples, fáceis para o agente preencher. */

// mesma configuração da /quero-saber (o Space_Grotesk quebrou o next/font no build da Vercel)
const sans = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--dc-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--dc-mono" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Painel de cotações | RedPro AI Academy",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const ACAO = "/demo/cotacoes/acao";
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const quando = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

type SP = { erro?: string; ok?: string; limpo?: string };

function Login({ erro, fechado }: { erro: boolean; fechado: boolean }) {
  return (
    <main className="dc-login">
      <div className="dc-login-card">
        <p className="dc-rotulo">RedPro AI Academy · Demonstração</p>
        <h1>Painel de cotações</h1>
        <p className="dc-muted">Entre com o e-mail e a senha de teste.</p>
        <form method="post" action={ACAO} className="dc-form" id="form-login" name="login">
          <input type="hidden" name="acao" value="entrar" />
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required />
          <label htmlFor="senha">Senha</label>
          <input id="senha" name="senha" type="password" autoComplete="current-password" required />
          <button type="submit" id="entrar">
            Entrar
          </button>
        </form>
        {erro && (
          <p className="dc-erro" role="alert">
            E-mail ou senha incorretos.
          </p>
        )}
        {fechado && <p className="dc-erro">A demonstração ainda não foi liberada.</p>}
      </div>
    </main>
  );
}

export default async function DemoCotacoes({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const jar = await cookies();

  if (!sessaoValida(jar.get(COOKIE)?.value)) {
    return (
      <div className={`dc ${sans.variable} ${mono.variable}`}>
        <Login erro={sp.erro === "login"} fechado={!loginConfigurado()} />
      </div>
    );
  }

  const { itens, erro } = await listar();

  return (
    <div className={`dc ${sans.variable} ${mono.variable}`}>
      <header className="dc-topo">
        <div>
          <p className="dc-rotulo">RedPro AI Academy · Demonstração</p>
          <h1>Painel de cotações</h1>
        </div>
        <form method="post" action={ACAO}>
          <input type="hidden" name="acao" value="sair" />
          <button type="submit" className="dc-btn-sec" id="sair">
            Sair
          </button>
        </form>
      </header>

      <main className="dc-corpo">
        <section id="registrar" className="dc-card">
          <h2>Registrar cotação</h2>
          {sp.erro === "campos" && (
            <p className="dc-erro" role="alert">
              Preencha Produto, Loja e um Preço válido (ex.: 3799,90).
            </p>
          )}
          {sp.erro === "banco" && (
            <p className="dc-erro" role="alert">
              Não consegui salvar agora. Tente de novo.
            </p>
          )}
          <form method="post" action={ACAO} className="dc-form dc-grade" id="form-cotacao" name="cotacao">
            <input type="hidden" name="acao" value="salvar" />
            <div>
              <label htmlFor="produto">Produto</label>
              <input id="produto" name="produto" required maxLength={120} placeholder="PlayStation 5" />
            </div>
            <div>
              <label htmlFor="loja">Loja</label>
              <input id="loja" name="loja" required maxLength={80} placeholder="Amazon" />
            </div>
            <div>
              <label htmlFor="preco">Preço (R$)</label>
              <input id="preco" name="preco" required inputMode="decimal" maxLength={30} placeholder="3799,90" />
            </div>
            <div>
              <label htmlFor="link">Link da oferta</label>
              <input id="link" name="link" type="url" maxLength={500} placeholder="https://..." />
            </div>
            <div className="dc-largo">
              <label htmlFor="observacao">Observação</label>
              <textarea id="observacao" name="observacao" rows={3} maxLength={500} placeholder="Frete grátis, entrega em 2 dias" />
            </div>
            <div className="dc-largo">
              <button type="submit" id="salvar">
                Salvar cotação
              </button>
            </div>
          </form>
        </section>

        <section id="lista" className="dc-lista">
          <div className="dc-lista-topo">
            <h2>
              Cotações registradas <span className="dc-conta">{itens.length}</span>
            </h2>
            <form method="post" action={ACAO}>
              <input type="hidden" name="acao" value="limpar" />
              <button type="submit" className="dc-btn-sec" id="limpar-lista">
                Limpar lista
              </button>
            </form>
          </div>
          {sp.ok === "1" && <p className="dc-ok">Cotação salva.</p>}
          {sp.limpo === "1" && <p className="dc-ok">Lista limpa.</p>}
          {erro && <p className="dc-erro">{erro}</p>}
          {itens.length === 0 ? (
            <p className="dc-vazio">Nenhuma cotação ainda.</p>
          ) : (
            <ol className="dc-itens">
              {itens.map((c, i) => (
                <li key={c.id} className={i === 0 && sp.ok === "1" ? "dc-item dc-novo" : "dc-item"}>
                  <div className="dc-item-topo">
                    <strong>{c.produto}</strong>
                    <span className="dc-preco">{brl.format(Number(c.preco))}</span>
                  </div>
                  <p className="dc-loja">{c.loja}</p>
                  {c.observacao && <p className="dc-obs">{c.observacao}</p>}
                  <div className="dc-item-rodape">
                    <time dateTime={c.criado_em}>{quando.format(new Date(c.criado_em))}</time>
                    {c.link && (
                      <a href={c.link} target="_blank" rel="noopener noreferrer nofollow">
                        Ver oferta ↗
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>
      <footer className="dc-rodape">Página de demonstração da Imersão Arquiteto de Agentes. Dados de teste.</footer>
    </div>
  );
}

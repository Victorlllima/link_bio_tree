import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Fragment, type ReactNode } from "react";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { COOKIE, chaveInstalar, cookieValido, senhaConfigurada } from "@/lib/configurar-vps/auth";
import { LEGENDAS, lerManual, type Bloco } from "@/lib/configurar-vps/manual";
import { Abas, BotaoCopiar } from "./cliente";
import "./configurar-vps.css";

/* /configurar-vps · Manual da VPS do aluno da Imersão (Rigel, 23/11/2026).
   Protegida de verdade: sem o cookie da senha, o servidor só devolve a tela de senha
   (o manual não vai no HTML). Prints saem por /configurar-vps/print/NN, também atrás do cookie.
   Texto: privado/configurar-vps/manual.md, gerado por scripts/sync-configurar-vps.py. */

// Instrument Sans: o Space_Grotesk quebrou o next/font no build da Vercel (demo/cotacoes, 23/11)
const sans = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--cv-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--cv-mono" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manual da VPS | RedPro AI Academy",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const LINK_HOSTINGER = process.env.IMERSAO_HOSTINGER_URL ?? "";
const URL_INSTALAR = "https://redpro.com.br/instalar";

/* ---------- texto curto: **negrito**, `código`, [link](url) ---------- */
function inline(s: string, chave: string): ReactNode[] {
  const partes: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let ult = 0;
  let k = 0;
  for (const m of s.matchAll(re)) {
    if (m.index! > ult) partes.push(s.slice(ult, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) partes.push(<strong key={k++}>{inline(tok.slice(2, -2), chave)}</strong>);
    else if (tok.startsWith("`")) partes.push(<code key={k++}>{comChave(tok.slice(1, -1), chave)}</code>);
    else {
      const [, txt, href] = tok.match(/\[([^\]]+)\]\(([^)]+)\)/)!;
      partes.push(
        <a key={k++} href={href} target="_blank" rel="noopener noreferrer">
          {txt}
        </a>,
      );
    }
    ult = m.index! + tok.length;
  }
  if (ult < s.length) partes.push(s.slice(ult));
  return partes;
}

// O comando de instalação ganha a chave do aluno (só depois da senha)
function comChave(texto: string, chave: string): string {
  if (!chave) return texto;
  return texto
    .replaceAll(`${URL_INSTALAR} `, `"${URL_INSTALAR}?k=${chave}" `)
    .replaceAll("COLE_AQUI_O_LINK_DO_PASSO_4.2", `${URL_INSTALAR}?k=${chave}`)
    .replaceAll("?k=CHAVE", `?k=${chave}`);
}

function Codigo({ codigo, pedido, ficha, soul, chave }: { codigo: string; pedido: boolean; ficha?: boolean; soul?: boolean; chave: string }) {
  const c = comChave(codigo, chave);
  const tipo = soul ? "soul" : ficha ? "ficha" : pedido ? "pedido" : "cmd";
  return (
    <div className={tipo === "cmd" ? "cv-code" : "cv-code cv-pedido"}>
      <div className="cv-code-topo">
        <span>{tipo === "soul" ? "SOUL.md" : tipo === "ficha" ? "Ficha da minha VPS" : tipo === "pedido" ? "Pedido para o agente" : "Terminal"}</span>
        <BotaoCopiar texto={c} rotulo={tipo === "soul" ? "Copiar modelo" : tipo === "ficha" ? "Copiar ficha" : tipo === "pedido" ? "Copiar pedido" : "Copiar"} />
      </div>
      <pre>
        <code>{c}</code>
      </pre>
    </div>
  );
}

// Dentro de uma aba: comando longo entre crases vira bloco com botão de copiar
function PainelAba({ texto, chave }: { texto: string; chave: string }) {
  texto = texto.charAt(0).toUpperCase() + texto.slice(1);
  const cmd = texto.match(/`([^`]{18,})`/);
  if (!cmd) return <p>{inline(texto, chave)}</p>;
  const resto = texto.replace(cmd[0], "").replace(/^[\s:,]+/, "").trim();
  return (
    <>
      <Codigo codigo={cmd[1]} pedido={false} chave={chave} />
      {resto && <p className="cv-nota">{inline(resto, chave)}</p>}
    </>
  );
}

function Prints({ nums }: { nums: string[] }) {
  return (
    <div className={nums.length > 1 ? "cv-prints cv-prints-2" : "cv-prints"}>
      {nums.map((n) => (
        <figure key={n}>
          <a href={`/configurar-vps/print/${n}`} target="_blank" rel="noopener">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/configurar-vps/print/${n}`} alt={LEGENDAS[n] ?? `Print ${n}`} loading="lazy" />
          </a>
          <figcaption>
            <span>Print {n}</span> {LEGENDAS[n]}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function renderBloco(b: Bloco, i: number, chave: string): ReactNode {
  switch (b.t) {
    case "h1":
      return (
        <div key={i} className="cv-divisor" id={b.id}>
          <span>{b.rotulo}</span>
          <h2>{b.texto}</h2>
        </div>
      );
    case "passo":
      return (
        <h2 key={i} id={b.id} className="cv-passo">
          <span className="cv-passo-num">{b.num.padStart(2, "0")}</span>
          <span>{b.texto}</span>
        </h2>
      );
    case "h2":
      return (
        <h2 key={i} id={b.id} className="cv-h2">
          {inline(b.texto, chave)}
        </h2>
      );
    case "h3":
      return (
        <h3 key={i} id={b.id} className="cv-h3">
          {inline(b.texto, chave)}
        </h3>
      );
    case "sub":
      return (
        <p key={i} className="cv-sub">
          {inline(b.texto, chave)}
        </p>
      );
    case "p":
      return <p key={i}>{inline(b.texto, chave)}</p>;
    case "resultado":
      return (
        <p key={i} className="cv-resultado">
          <span>Resultado</span>
          {inline(b.texto, chave)}
        </p>
      );
    case "ok":
      return (
        <p key={i} className="cv-ok">
          <span>Deu certo se</span>
          {inline(b.texto, chave)}
        </p>
      );
    case "botao":
      return (
        <p key={i} className="cv-botao-wrap">
          <a className="cv-botao" href={b.href} target="_blank" rel="noopener noreferrer">
            {b.texto} <span aria-hidden="true">↗</span>
          </a>
        </p>
      );
    case "guarde":
      return (
        <p key={i} className="cv-guarde">
          <span>📌 Guarde isto agora</span>
          {inline(b.texto, chave)}
        </p>
      );
    case "alerta":
      return (
        <p key={i} className="cv-alerta">
          {inline(b.texto, chave)}
        </p>
      );
    case "lista": {
      const Tag = b.ordenada ? "ol" : "ul";
      return (
        <Tag key={i}>
          {b.itens.map((it, j) => (
            <li key={j}>{inline(it, chave)}</li>
          ))}
        </Tag>
      );
    }
    case "abas":
      return (
        <Abas
          key={i}
          grupo={b.grupo}
          rotulos={b.abas.map((a) => a.rotulo)}
          paineis={b.abas.map((a, j) => (
            <PainelAba key={j} texto={a.texto} chave={chave} />
          ))}
        />
      );
    case "codigo":
      return <Codigo key={i} codigo={b.codigo} pedido={b.pedido} ficha={b.ficha} soul={b.soul} chave={chave} />;
    case "tabela":
      return (
        <div key={i} className="cv-tabela">
          {b.linhas.map((l, j) => {
            const cmd = l[1]?.match(/^`([^`]+)`$/)?.[1];
            return (
              <div key={j} className="cv-tabela-linha">
                <div className="cv-tabela-para">{inline(l[0], chave)}</div>
                {cmd ? (
                  <div className="cv-tabela-cmd">
                    <code>{cmd}</code>
                    <BotaoCopiar texto={cmd} mini />
                  </div>
                ) : (
                  <div>{inline(l[1] ?? "", chave)}</div>
                )}
              </div>
            );
          })}
        </div>
      );
    case "prints":
      return <Prints key={i} nums={b.nums} />;
    case "hr":
      return <hr key={i} />;
  }
}

type ItemIndice = { id: string; texto: string; num?: string };
function ListaIndice({ passos, outros }: { passos: ItemIndice[]; outros: ItemIndice[] }) {
  return (
    <>
      <ol>
        {passos.map((p) => (
          <li key={p.id}>
            <a href={`#${p.id}`}>
              <span>{p.num!.padStart(2, "0")}</span>
              {p.texto}
            </a>
          </li>
        ))}
      </ol>
      <ul>
        {outros.map((p) => (
          <li key={p.id}>
            <a href={`#${p.id}`}>{p.texto}</a>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------- tela de senha ---------- */
function TelaSenha({ erro, semSenha }: { erro: boolean; semSenha: boolean }) {
  return (
    <main className="cv-gate">
      <div className="cv-gate-card">
        <p className="cv-rotulo">RedPro AI Academy · Manual da VPS</p>
        <h1>Configure a sua VPS</h1>
        <p className="cv-gate-txt">Digite a senha que o Red passou na aula.</p>
        <form method="post" action="/configurar-vps/entrar" className="cv-gate-form">
          <label htmlFor="senha" className="cv-sr">
            Senha da aula
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            autoComplete="current-password"
            autoCapitalize="none"
            spellCheck={false}
            required
            placeholder="Senha da aula"
            autoFocus
          />
          <button type="submit">Entrar no manual</button>
        </form>
        {erro && <p className="cv-gate-erro">Senha errada. Confira a que o Red passou na aula.</p>}
        {semSenha && <p className="cv-gate-erro">O manual ainda não foi liberado.</p>}
        <p className="cv-gate-rodape">A senha fica salva neste navegador por 60 dias.</p>
      </div>
    </main>
  );
}

export default async function ConfigurarVps({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const sp = await searchParams;
  const jar = await cookies();
  const liberado = cookieValido(jar.get(COOKIE)?.value);

  if (!liberado) {
    return (
      <div className={`cv ${sans.variable} ${mono.variable}`}>
        <TelaSenha erro={sp.erro === "1"} semSenha={!senhaConfigurada()} />
      </div>
    );
  }

  const chave = chaveInstalar();
  const { blocos, indice } = lerManual(LINK_HOSTINGER);
  const passos = indice.filter((x) => x.num);
  const outros = indice.filter((x) => !x.num);

  return (
    <div className={`cv ${sans.variable} ${mono.variable}`}>
      <header className="cv-hero">
        <p className="cv-rotulo">RedPro AI Academy · Manual da VPS</p>
        <h1>
          Seus 3 agentes ligados <em>24 horas</em>
        </h1>
        <p className="cv-hero-txt">
          Do zero até os três respondendo no Telegram, com o seu computador desligado. Siga na ordem e confira o
          &quot;Deu certo se&quot; de cada passo antes de seguir.
        </p>
      </header>

      <div className="cv-corpo">
        <nav className="cv-indice" aria-label="Passos">
          <details className="cv-indice-cel">
            <summary>Ver todos os passos</summary>
            <ListaIndice passos={passos} outros={outros} />
          </details>
          <div className="cv-indice-desk">
            <div>
              <span className="cv-indice-titulo">Passos</span>
              <ListaIndice passos={passos} outros={outros} />
            </div>
          </div>
        </nav>

        <article className="cv-manual">
          {blocos.map((b, i) => (
            <Fragment key={i}>{renderBloco(b, i, chave)}</Fragment>
          ))}
          <p className="cv-fim">RedPro AI Academy</p>
        </article>
      </div>
    </div>
  );
}

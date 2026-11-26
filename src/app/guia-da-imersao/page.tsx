import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Fragment, type ReactNode } from "react";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { COOKIE, chaveInstalar, cookieValido, senhaConfigurada } from "@/lib/configurar-vps/auth";
import { lerGuia, type Bloco, type Dia } from "@/lib/guia/guia";
import { Abas, AncoraNoForm, BotaoCopiar, IrParaAncora } from "./cliente";
import "./configurar-vps.css";
import "./guia.css";

/* /guia-da-imersao · Guia da Imersão Arquiteto de Agentes, Dia 1 e Dia 2 (Rigel, pedido do Red, 26/11/2026).
   Mesma senha e mesmo cookie de 60 dias da antiga /configurar-vps (que agora redireciona para #dia-2).
   Sem o cookie, o servidor só devolve a tela de senha: o guia não vai no HTML.
   Texto: privado/guia-da-imersao/guia.md, gerado por scripts/sync-guia-da-imersao.py (prints só de guia-prints/). */

const sans = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--cv-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--cv-mono" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guia da Imersão | RedPro AI Academy",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const URL_INSTALAR = "https://redpro.com.br/instalar";

function inline(s: string, chave: string): ReactNode[] {
  const partes: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)*]+)/g;
  let ult = 0;
  let k = 0;
  for (const m of s.matchAll(re)) {
    if (m.index! > ult) partes.push(s.slice(ult, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) partes.push(<strong key={k++}>{inline(tok.slice(2, -2), chave)}</strong>);
    else if (tok.startsWith("`")) partes.push(<code key={k++}>{comChave(tok.slice(1, -1), chave)}</code>);
    else if (tok.startsWith("[")) {
      const [, txt, href] = tok.match(/\[([^\]]+)\]\(([^)]+)\)/)!;
      partes.push(
        <a key={k++} href={href} target="_blank" rel="noopener noreferrer">
          {txt}
        </a>,
      );
    } else {
      const url = tok.replace(/[.,;:]+$/, "");
      partes.push(
        <a key={k++} href={url} target="_blank" rel="noopener noreferrer" className={/REFERRALCODE=/.test(url) ? "gi-link-afiliado" : undefined}>
          {url}
        </a>,
      );
      if (url.length < tok.length) partes.push(tok.slice(url.length));
    }
    ult = m.index! + tok.length;
  }
  if (ult < s.length) partes.push(s.slice(ult));
  return partes;
}

// O comando de instalação ganha a chave da turma (só depois da senha). COLE_AQUI_O_LINK_DA_SECAO_5 fica como está.
function comChave(texto: string, chave: string): string {
  if (!chave) return texto;
  return texto.replaceAll(`${URL_INSTALAR} `, `"${URL_INSTALAR}?k=${chave}" `).replaceAll("?k=CHAVE_DA_TURMA", `?k=${chave}`).replaceAll("?k=CHAVE\"", `?k=${chave}"`);
}

function Codigo({ codigo, soul, chave, leitura }: { codigo: string; soul: boolean; chave: string; leitura?: boolean }) {
  const c = comChave(codigo, chave);
  if (leitura)
    return (
      <div className="cv-code gi-leitura">
        <div className="cv-code-topo">
          <span>Só para ler</span>
        </div>
        <pre>
          <code>{c}</code>
        </pre>
      </div>
    );
  const pedido = !soul && /^(Entre|Leia|Quero|Crie|Faça|Você|Me )/.test(codigo);
  const instalar = c.includes(`${URL_INSTALAR}?k=`) && !pedido;
  const rotulo = soul ? "SOUL.md" : pedido ? "Pedido para o agente" : instalar ? "Comando de instalação da sua turma" : "Copie e cole";
  return (
    <div className={instalar ? "cv-code gi-instalar" : pedido || soul ? "cv-code cv-pedido" : "cv-code"}>
      <div className="cv-code-topo">
        <span>{rotulo}</span>
        <BotaoCopiar texto={c} rotulo={soul ? "Copiar modelo" : pedido ? "Copiar pedido" : "Copiar"} />
      </div>
      <pre>
        <code>{c}</code>
      </pre>
    </div>
  );
}

function PainelAba({ texto, chave }: { texto: string; chave: string }) {
  texto = texto.charAt(0).toUpperCase() + texto.slice(1);
  const cmd = texto.match(/`([^`]{18,})`/);
  if (!cmd) return <p>{inline(texto, chave)}</p>;
  const resto = texto.replace(cmd[0], "").replace(/^[\s:,]+/, "").trim();
  return (
    <>
      <Codigo codigo={cmd[1]} soul={false} chave={chave} />
      {resto && <p className="cv-nota">{inline(resto, chave)}</p>}
    </>
  );
}

function renderBloco(b: Bloco, i: number, chave: string): ReactNode {
  switch (b.t) {
    case "dia":
      return (
        <div key={i} className="cv-divisor gi-dia" id={b.id}>
          <span>Dia {b.num}</span>
          <h2>{b.texto}</h2>
        </div>
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
    case "citacao":
      return (
        <blockquote key={i} className="gi-citacao">
          {b.linhas.map((l, j) => (
            <p key={j}>{inline(l, chave)}</p>
          ))}
        </blockquote>
      );
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
      const caixas = b.itens.every((it) => it.marcar);
      return (
        <Tag key={i} className={caixas ? "gi-caixas" : undefined}>
          {b.itens.map((it, j) => (
            <li key={j}>
              {inline(it.texto, chave)}
              {it.sub && (
                <ul>
                  {it.sub.map((s, k) => (
                    <li key={k}>{inline(s, chave)}</li>
                  ))}
                </ul>
              )}
            </li>
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
      return <Codigo key={i} codigo={b.codigo} soul={b.soul} leitura={b.leitura} chave={chave} />;
    case "tabela": {
      const doisComCmd = b.cab.length === 2 && b.linhas.every((l) => /^`[^`]+`$/.test(l[1] ?? ""));
      if (doisComCmd)
        return (
          <div key={i} className="cv-tabela">
            {b.linhas.map((l, j) => {
              const cmd = l[1].slice(1, -1);
              return (
                <div key={j} className="cv-tabela-linha">
                  <div className="cv-tabela-para">{inline(l[0], chave)}</div>
                  <div className="cv-tabela-cmd">
                    <code>{cmd}</code>
                    <BotaoCopiar texto={cmd} mini />
                  </div>
                </div>
              );
            })}
          </div>
        );
      return (
        <div key={i} className="gi-tabela">
          <table>
            <thead>
              <tr>
                {b.cab.map((c, j) => (
                  <th key={j}>{inline(c, chave)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.linhas.map((l, j) => (
                <tr key={j}>
                  {l.map((c, k) => (
                    <td key={k} data-rotulo={b.cab[k].replace(/\*\*/g, "").trim()}>
                      {inline(c, chave)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case "print":
      return (
        <figure key={i} className="gi-print">
          <a href={`/guia-da-imersao/print/${b.num}`} target="_blank" rel="noopener">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/guia-da-imersao/print/${b.num}`} alt={b.legenda} loading="lazy" />
          </a>
          <figcaption>
            <span>Print {b.num}</span> {b.legenda}
          </figcaption>
        </figure>
      );
    case "hr":
      return <hr key={i} />;
  }
}

// Texto curto dos botões do topo (Rigel, pedido do Red, 26/11). O título do dia no guia não muda.
const BOTAO_DIA: Record<string, string> = { "1": "Raio-X do Hermes", "2": "VPS e Squad" };

function Sumario({ dia }: { dia: Dia }) {
  return (
    <details className="gi-sumario">
      <summary>Sumário do Dia {dia.num}</summary>
      <ol>
        {dia.secoes.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`}>{s.texto}</a>
          </li>
        ))}
      </ol>
    </details>
  );
}

function TelaSenha({ erro, semSenha }: { erro: boolean; semSenha: boolean }) {
  return (
    <main className="cv-gate">
      <div className="cv-gate-card">
        <p className="cv-rotulo">RedPro AI Academy · Guia da Imersão</p>
        <h1>Guia da Imersão</h1>
        <p className="cv-gate-txt">Digite a senha que o Red passou na aula.</p>
        <form method="post" action="/guia-da-imersao/entrar" className="cv-gate-form">
          <input type="hidden" name="ancora" id="gi-ancora" defaultValue="" />
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
          <button type="submit">Entrar no guia</button>
        </form>
        <AncoraNoForm />
        {erro && <p className="cv-gate-erro">Senha errada. Confira a que o Red passou na aula.</p>}
        {semSenha && <p className="cv-gate-erro">O guia ainda não foi liberado.</p>}
        <p className="cv-gate-rodape">A senha fica salva neste navegador por 60 dias.</p>
      </div>
    </main>
  );
}

export default async function GuiaDaImersao({ searchParams }: { searchParams: Promise<{ erro?: string; a?: string }> }) {
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
  const { blocos, dias } = lerGuia();
  // sumário clicável logo depois do título de cada dia
  const sumarioDe = new Map(dias.map((d) => [d.id, d]));

  return (
    <div className={`cv ${sans.variable} ${mono.variable}`}>
      <IrParaAncora />
      <header className="cv-hero gi-hero" id="topo">
        <p className="cv-rotulo">RedPro AI Academy</p>
        <h1>
          Guia da Imersão <em>Arquiteto de Agentes</em>
        </h1>
        <nav className="gi-dias" aria-label="Dias da Imersão">
          {dias.map((d) => (
            <a key={d.id} href={`#${d.id}`} className="gi-dia-botao">
              Dia {d.num} · {BOTAO_DIA[d.num] ?? d.texto}
            </a>
          ))}
        </nav>
      </header>

      <article className="cv-manual gi-manual">
        {blocos.map((b, i) => (
          <Fragment key={i}>
            {renderBloco(b, i, chave)}
            {b.t === "dia" && sumarioDe.get(b.id) && <Sumario dia={sumarioDe.get(b.id)!} />}
          </Fragment>
        ))}
        <p className="cv-fim">RedPro AI Academy</p>
      </article>
      <a href="#topo" className="gi-topo" aria-label="Voltar ao topo">
        ↑ Dias
      </a>
    </div>
  );
}

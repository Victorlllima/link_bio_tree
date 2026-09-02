/* ============================================================================
 *  LP C · DOCUMENTO TÉCNICO
 * ----------------------------------------------------------------------------
 *  ÂNGULO: o insider. A copy diz "eu li o que a comunidade internacional
 *  discute e a conversa não existe em português". Quem fala assim não entrega
 *  uma página de venda, entrega um relatório. Então esta é a única das cinco
 *  que não parece uma landing page: é um documento impresso, com seção
 *  numerada, figura numerada e nota de margem.
 *
 *  PALETA   papel #F7F7F3 (frio, nunca creme) · segundo papel #EDEDE6 ·
 *           tinta #16171A · tinta fraca #55585F · régua #C6C6BE ·
 *           marca #8C2F2F (carmim de anotação, só em § figura e CTA)
 *  TIPO     Source Serif 4 400/600/700 no corpo E no display, porque serifa de
 *           texto é o que um paper usa, e serifa de display seria capa de
 *           revista + IBM Plex Mono nas etiquetas, figuras e tabela
 *  RITMO    medida de 68 caracteres, entrelinha 1.66, margem larga. Duas
 *           colunas só a partir de 1000px, e só onde o conteúdo é lista.
 *  CTA      retângulo carmim, versalete, raio 2px. Discreto de propósito.
 *
 *  DESTAQUE ÚNICO: a Figura 1, o repositório, em largura total entre duas
 *  réguas duplas. É o argumento do insider virado imagem, e é a única coisa da
 *  página que rompe a coluna de texto.
 *
 *  MOVIMENTO: nenhum. Sem observer, sem transição, sem plugin. Documento não
 *  se mexe, e a sobriedade aqui é o que vende.
 * ==========================================================================*/

import { IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import { checkoutUrl } from "./checkout";
import { ImgReal, inline, legendaImg, PAPEL_IMG, Pixel } from "./comum";
import { compartilhado, type Img, type No, type Variante } from "./conteudo";

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--c-serif",
  display: "swap",
});
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--c-mono", display: "swap" });

const CSS = `
.c{
  --papel:#F7F7F3; --papel2:#EDEDE6; --tinta:#16171A; --tinta2:#55585F;
  --regra:#C6C6BE; --marca:#8C2F2F;
  --serif:var(--c-serif),Georgia,"Times New Roman",serif;
  --mono:var(--c-mono),ui-monospace,monospace;
  background:var(--papel);color:var(--tinta);font-family:var(--serif);
  -webkit-font-smoothing:antialiased;
  /* segura a barra horizontal do full-bleed da Figura 1 no mobile */
  overflow-x:hidden;
}
.c-wrap{max-width:1120px;margin:0 auto;padding:0 22px 100px;}
.c-col{max-width:68ch;}

/* ---------- cabeçalho do documento ---------- */
.c-cab{border-bottom:3px double var(--tinta);padding:44px 0 18px;margin-bottom:36px;}
.c-selo{font-family:var(--mono);font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:var(--marca);margin:0 0 22px;}
.c-h1{
  font-family:var(--serif);font-weight:700;
  font-size:clamp(1.9rem,5.4vw,3.05rem);line-height:1.12;letter-spacing:-.02em;
  margin:0 0 18px;max-width:20ch;
}
.c-h1 b{font-weight:700;color:var(--marca);}
.c-deck{font-size:1.14rem;line-height:1.6;color:var(--tinta2);margin:0 0 26px;max-width:56ch;font-style:italic;}
.c-ficha{
  display:grid;gap:16px 40px;font-family:var(--mono);font-size:.76rem;
  margin:0 0 30px;padding:16px 0;border-top:1px solid var(--regra);border-bottom:1px solid var(--regra);
}
@media(min-width:700px){.c-ficha{grid-template-columns:repeat(3,max-content);}}
.c-ficha dt{font-size:.64rem;letter-spacing:.18em;text-transform:uppercase;color:var(--marca);margin-bottom:5px;}
.c-ficha dd{margin:0;color:var(--tinta);line-height:1.5;}

/* ---------- seção numerada ---------- */
.c-sec{padding:36px 0 0;}
.c-sec-cab{display:flex;gap:14px;align-items:baseline;margin:0 0 16px;border-top:1px solid var(--regra);padding-top:22px;}
.c-n{font-family:var(--mono);font-size:.78rem;color:var(--marca);white-space:nowrap;padding-top:.18rem;}
.c-sec-tit{
  font-family:var(--serif);font-weight:600;font-size:clamp(1.2rem,3vw,1.55rem);
  line-height:1.25;letter-spacing:-.015em;margin:0;
}
.c-p{font-size:1.09rem;line-height:1.68;margin:0 0 1.05em;}
.c-p b{font-weight:700;}
.c-forte{font-size:1.16rem;line-height:1.5;font-weight:700;margin:0 0 1.05em;}
.c-cita{
  margin:1.4em 0;padding:0 0 0 22px;border-left:3px solid var(--marca);
  font-style:italic;font-size:1.08rem;line-height:1.62;color:var(--tinta2);
}
.c-cita::before{content:"“";}
.c-cita::after{content:"”";}

/* ---------- figura numerada: o destaque ---------- */
.c-fig{margin:34px 0;border-top:3px double var(--tinta);border-bottom:1px solid var(--regra);padding:20px 0 16px;}
.c-fig-caixa{
  border:1px solid var(--regra);background:var(--papel2);padding:22px;
  min-height:140px;display:flex;align-items:center;
}
.c-fig[data-f="celular"] .c-fig-caixa{min-height:230px;max-width:300px;}
.c-fig[data-f="quadrado"] .c-fig-caixa{min-height:200px;max-width:300px;}
.c-fig-txt{margin:0;font-size:.95rem;line-height:1.55;color:var(--tinta2);font-family:var(--mono);}
.c-fig-leg{
  font-family:var(--mono);font-size:.74rem;line-height:1.6;color:var(--tinta2);
  margin:12px 0 0;display:flex;gap:10px;
}
.c-fig-num{color:var(--marca);white-space:nowrap;}
.c-fig-papel{margin-left:auto;text-transform:uppercase;letter-spacing:.12em;font-size:.66rem;color:#8B8B82;}
/* a Figura 1 rompe a coluna: é o repositório, o argumento inteiro do insider.
   Ela avança para a margem direita, que num documento é onde vive a figura
   grande. O limite de 300px mantém tudo dentro do .c-wrap, sem rolagem. */
.c-fig-mestra .c-fig-caixa{min-height:230px;}
@media(min-width:1100px){.c-fig-mestra{margin-right:calc(-1 * min(300px,22vw));}}

/* ---------- retrato do autor ---------- */
.c-autor{display:grid;gap:20px;align-items:start;margin:0 0 34px;}
@media(min-width:820px){.c-autor{grid-template-columns:230px minmax(0,1fr);gap:34px;}}
.c-autor-caixa{border:1px solid var(--regra);background:var(--papel2);padding:16px;min-height:190px;display:flex;align-items:center;}
.c-autor-txt{font-family:var(--mono);font-size:.82rem;line-height:1.5;color:var(--tinta2);margin:0;}
.c-autor-leg{font-family:var(--mono);font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:var(--marca);margin:10px 0 0;}
/* imagens prontas */
.c-fig-foto,.c-autor-foto{display:block;border:1px solid var(--regra);background:var(--papel2);}
/* o retrato do autor é 1:1 e a coluna tem 230px: sem teto ele estica a linha
   inteira do grid no desktop e o texto ao lado desalinha do topo. */
.c-autor-foto{max-width:230px;}
/* A Figura 1 é o print do GitHub: wide, e com texto de interface pequeno.
   Em telas estreitas a coluna do documento (medida de leitura) o espremeria a
   ponto de ninguém ler "MIT" nem a data do commit — que é exatamente a prova.
   Então no mobile ela rompe a coluna e ocupa a largura da viewport inteira.
   O full-bleed é feito com margem negativa até a borda da viewport. Usa-se
   dvw em vez de vw porque vw ignora a barra de rolagem e estouraria a
   largura; o overflow-x hidden no .c é a rede de segurança. */
@media(max-width:700px){
  .c-fig-mestra{margin-left:calc(50% - 50dvw);margin-right:calc(50% - 50dvw);width:100dvw;}
  /* a foto vai de borda a borda; só a legenda volta pra margem do texto */
  .c-fig-mestra .c-fig-leg{padding-left:22px;padding-right:22px;}
}

/* ---------- tabela dos dias ---------- */
.c-tab{width:100%;border-collapse:collapse;margin:20px 0 0;font-size:1rem;}
.c-tab caption{text-align:left;font-family:var(--mono);font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--marca);padding-bottom:12px;}
.c-tab th{
  text-align:left;font-family:var(--mono);font-weight:500;font-size:.72rem;letter-spacing:.12em;
  text-transform:uppercase;color:var(--tinta2);border-bottom:1px solid var(--tinta);padding:0 12px 8px 0;
}
.c-tab td{border-bottom:1px solid var(--regra);padding:12px 12px 12px 0;line-height:1.5;vertical-align:top;}
.c-tab td:first-child{font-family:var(--mono);font-size:.86rem;white-space:nowrap;color:var(--marca);width:1%;}

/* ---------- duas colunas onde o conteúdo é lista ---------- */
.c-duas{columns:1;}
@media(min-width:1000px){.c-duas{columns:2;column-gap:52px;column-rule:1px solid var(--regra);}}
.c-duas>*{break-inside:avoid;}

/* ---------- quadro de termos (a oferta) ---------- */
.c-quadro{border:1px solid var(--tinta);padding:0;margin:26px 0 0;background:#fff;}
.c-quadro-cab{border-bottom:1px solid var(--tinta);padding:16px 22px;font-family:var(--mono);font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--marca);}
.c-quadro-corpo{padding:26px 22px;}
.c-produto{font-family:var(--serif);font-weight:700;font-size:1.4rem;line-height:1.25;margin:0 0 4px;letter-spacing:-.015em;}
.c-preco{font-family:var(--mono);font-weight:500;font-size:clamp(2.4rem,9vw,3.2rem);line-height:1;margin:14px 0 20px;color:var(--marca);}
.c-inclui{list-style:none;margin:0 0 24px;padding:0;}
.c-inclui li{font-size:1.02rem;line-height:1.5;padding:10px 0;border-top:1px solid var(--regra);display:flex;gap:12px;}
.c-inclui li::before{content:"·";color:var(--marca);font-family:var(--mono);}
.c-nota{font-family:var(--mono);font-size:.78rem;line-height:1.7;color:var(--tinta2);margin:14px 0 0;}

/* ---------- bumps ---------- */
.c-bump{border-top:1px solid var(--regra);padding:16px 0;}
.c-bump-cab{display:flex;justify-content:space-between;gap:16px;align-items:baseline;}
.c-bump-nome{font-weight:600;font-size:1.06rem;}
.c-bump-preco{font-family:var(--mono);font-size:.92rem;color:var(--marca);}
.c-bump-txt{font-size:.99rem;line-height:1.6;color:var(--tinta2);margin:6px 0 0;}

/* ---------- faq / rodapé ---------- */
.c-faq details{border-top:1px solid var(--regra);}
.c-faq details:last-child{border-bottom:1px solid var(--regra);}
.c-faq summary{cursor:pointer;list-style:none;padding:15px 26px 15px 0;position:relative;font-weight:600;font-size:1.04rem;}
.c-faq summary::-webkit-details-marker{display:none;}
.c-faq summary::after{content:"+";position:absolute;right:2px;top:14px;color:var(--marca);font-family:var(--mono);}
.c-faq details[open] summary::after{content:"–";}
.c-faq-r{padding:0 0 16px;font-size:1.02rem;line-height:1.66;color:var(--tinta2);}
.c-rodape{margin-top:60px;padding-top:20px;border-top:3px double var(--tinta);font-family:var(--mono);font-size:.72rem;line-height:1.9;color:var(--tinta2);}
.c-rodape a{color:var(--marca);}

/* ---------- CTA ---------- */
.c-cta{
  display:inline-block;background:var(--marca);color:#F7F7F3;text-decoration:none;
  font-family:var(--serif);font-weight:600;font-size:.98rem;letter-spacing:.06em;
  padding:15px 26px;border-radius:2px;border:1px solid var(--marca);
  transition:background .18s ease,color .18s ease;
}
.c-cta:hover{background:transparent;color:var(--marca);}
.c-cta:focus-visible{outline:2px solid var(--tinta);outline-offset:3px;}
.c-cta-linha{margin:26px 0 0;}

@media (prefers-reduced-motion: reduce){
  .c *,.c *::before,.c *::after{transition-duration:.01ms !important;animation-duration:.01ms !important;}
}
`;

/* ---------- numeração de figura ------------------------------------------
   Percorre o conteúdo na ordem em que ele aparece e guarda o número de cada
   imagem. A capa (o retrato do autor) fica fora da contagem: num documento o
   retrato não é figura, é crédito. */

function mapaDeFiguras(v: Variante): Map<Img, number> {
  const m = new Map<Img, number>();
  let n = 0;
  const varrer = (nos: readonly No[]) => {
    for (const no of nos) if (no.t === "img") m.set(no as unknown as Img, ++n);
  };
  v.antes.forEach((b) => varrer(b.nos));
  v.entre.forEach((b) => varrer(b.nos));
  varrer(v.prova.nos);
  varrer(v.praQuemNaoE.nos);
  varrer(v.fecho.nos);
  return m;
}

function Figura({ img, n, mestra = false }: { img: Img; n: number; mestra?: boolean }) {
  return (
    <figure className={`c-fig${mestra ? " c-fig-mestra" : ""}`} data-f={img.formato}>
      {img.src ? (
        <ImgReal
          img={img}
          classe="c-fig-foto"
          sizes={mestra ? "(max-width:700px) 100vw, (max-width:1100px) 90vw, 940px" : "(max-width:700px) 92vw, 640px"}
        />
      ) : (
        <div className="c-fig-caixa">
          <p className="c-fig-txt">{img.c}</p>
        </div>
      )}
      <figcaption className="c-fig-leg">
        <span className="c-fig-num">Figura {n}.</span>
        <span>{PAPEL_IMG[img.tipo]}</span>
        <span className="c-fig-papel">{legendaImg(img)}</span>
      </figcaption>
    </figure>
  );
}

function Nos({ nos, k, figs }: { nos: readonly No[]; k: string; figs: Map<Img, number> }) {
  return (
    <>
      {nos.map((n, i) => {
        const kk = `${k}-${i}`;
        if (n.t === "img") {
          const img = n as unknown as Img;
          const num = figs.get(img) ?? 1;
          return <Figura key={kk} img={img} n={num} mestra={num === 1} />;
        }
        if (n.t === "cita")
          return (
            <blockquote key={kk} className="c-cita">
              {inline(n.c, kk)}
            </blockquote>
          );
        if (n.t === "forte")
          return (
            <p key={kk} className="c-forte">
              {inline(n.c, kk)}
            </p>
          );
        return (
          <p key={kk} className="c-p">
            {inline(n.c, kk)}
          </p>
        );
      })}
    </>
  );
}

/* ========================================================================= */

export function LpC({ v }: { v: Variante }) {
  const url = checkoutUrl(v.id);
  const figs = mapaDeFiguras(v);

  // §1 em diante, na ordem de leitura. A numeração vale a pena aqui porque o
  // conteúdo É uma sequência argumentativa, e o leitor pode voltar a uma seção.
  let s = 0;
  const secao = (titulo: string) => ({ n: `§${++s}`, titulo });

  const secoes = v.antes.map((b) => ({ ...secao(b.tag), bloco: b }));
  const semana = secao("o que você sai com");
  const entre = v.entre.map((b) => ({ ...secao(b.tag), bloco: b }));
  const prova = secao(v.prova.tag);
  const naoE = secao(v.praQuemNaoE.tag);
  const oferta = secao("os termos");
  const complementos = secao("complementos opcionais");
  const escasso = secao("o que é escasso");
  const garantia = secao("garantia");
  const faq = secao("perguntas");

  return (
    <div className={`c ${serif.variable} ${mono.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Pixel v={v.id} />

      <main className="c-wrap">
        <header className="c-cab">
          <p className="c-selo">Hermes Week · relatório de campo · RedPro AI Academy</p>
          <h1 className="c-h1">{inline(v.hero.h1, "h1")}</h1>
          <p className="c-deck">{v.hero.deck}</p>
          {/* Ficha do documento sem rótulo-dois-pontos: o rótulo fica acima,
              em versalete, e o dado embaixo. É como uma ficha catalográfica
              resolve isso, e é o que a regra de voz permite. */}
          <dl className="c-ficha">
            <div>
              <dt>Evento</dt>
              <dd>segunda a sexta, 20h</dd>
            </div>
            <div>
              <dt>Formato</dt>
              <dd>5 encontros, mais a sessão de dúvidas de sábado</dd>
            </div>
            <div>
              <dt>Devolução</dt>
              <dd>7 dias</dd>
            </div>
          </dl>
          <div className="c-cta-linha">
            <a className="c-cta hw-acao" href={url}>
              {compartilhado.ctaTopo}
            </a>
          </div>
        </header>

        <div className="c-autor">
          <div>
            {v.hero.foto.src ? (
              <ImgReal
                img={v.hero.foto}
                classe="c-autor-foto"
                sizes="(max-width:820px) 60vw, 230px"
                prioridade
              />
            ) : (
              <div className="c-autor-caixa">
                <p className="c-autor-txt">{v.hero.foto.c}</p>
              </div>
            )}
            <p className="c-autor-leg">
              {legendaImg(v.hero.foto)} · {PAPEL_IMG[v.hero.foto.tipo]}
            </p>
          </div>
          <div className="c-col">
            {/* Única linha de texto que a IRIS escreveu nesta página, e ela é
                estrutural: diz o que o documento faz, sem afirmar nada novo
                sobre o produto. Toda afirmação vem da copy aprovada. */}
            <p className="c-p">
              Este documento descreve o que a Hermes Week entrega, em que ordem, e o que ela não
              promete.
            </p>
          </div>
        </div>

        {secoes.map((sec, i) => (
          <section className="c-sec" key={`s${i}`}>
            <div className="c-sec-cab">
              <span className="c-n">{sec.n}</span>
              <h2 className="c-sec-tit">{sec.titulo}</h2>
            </div>
            <div className="c-col">
              <Nos nos={sec.bloco.nos} k={`s${i}`} figs={figs} />
            </div>
          </section>
        ))}

        <section className="c-sec">
          <div className="c-sec-cab">
            <span className="c-n">{semana.n}</span>
            <h2 className="c-sec-tit">{semana.titulo}</h2>
          </div>
          <div className="c-col">
            <p className="c-p">{v.saiCom.intro}</p>
            <table className="c-tab">
              <caption>Saída por dia</caption>
              <thead>
                <tr>
                  <th scope="col">Dia</th>
                  <th scope="col">Você sai com</th>
                </tr>
              </thead>
              <tbody>
                {compartilhado.dias.map((d) => (
                  <tr key={d.dia}>
                    <td>{d.dia}</td>
                    <td>{d.saida}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="c-p" style={{ marginTop: 22 }}>
              {v.saiCom.sabado}
            </p>
            {v.saiCom.extra ? <p className="c-p">{inline(v.saiCom.extra, "extra")}</p> : null}
            <div className="c-cta-linha">
              <a className="c-cta hw-acao" href={url}>
                {compartilhado.ctaTopo}
              </a>
            </div>
          </div>
        </section>

        {entre.map((sec, i) => (
          <section className="c-sec" key={`e${i}`}>
            <div className="c-sec-cab">
              <span className="c-n">{sec.n}</span>
              <h2 className="c-sec-tit">{sec.titulo}</h2>
            </div>
            <div className="c-col">
              <Nos nos={sec.bloco.nos} k={`e${i}`} figs={figs} />
            </div>
          </section>
        ))}

        <section className="c-sec">
          <div className="c-sec-cab">
            <span className="c-n">{prova.n}</span>
            <h2 className="c-sec-tit">{prova.titulo}</h2>
          </div>
          <div className="c-col">
            <Nos nos={v.prova.nos} k="prova" figs={figs} />
          </div>
        </section>

        <section className="c-sec">
          <div className="c-sec-cab">
            <span className="c-n">{naoE.n}</span>
            <h2 className="c-sec-tit">{naoE.titulo}</h2>
          </div>
          <div className="c-col">
            <Nos nos={v.praQuemNaoE.nos} k="pq" figs={figs} />
          </div>
        </section>

        <section className="c-sec">
          <div className="c-sec-cab">
            <span className="c-n">{oferta.n}</span>
            <h2 className="c-sec-tit">{oferta.titulo}</h2>
          </div>
          <div className="c-col">
            <div className="c-quadro">
              <div className="c-quadro-cab">{compartilhado.evento}</div>
              <div className="c-quadro-corpo">
                <h3 className="c-produto">{compartilhado.produto}</h3>
                <p className="c-preco">{compartilhado.preco}</p>
                <ul className="c-inclui">
                  {v.oferta.linhas.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
                <a className="c-cta hw-acao" href={url}>
                  {compartilhado.ctaOferta}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="c-sec">
          <div className="c-sec-cab">
            <span className="c-n">{complementos.n}</span>
            <h2 className="c-sec-tit">{complementos.titulo}</h2>
          </div>
          <div className="c-col">
            {v.bumps.intro ? <p className="c-p">{v.bumps.intro}</p> : null}
            {v.bumps.itens.map((b) => (
              <div className="c-bump" key={b.nome}>
                <div className="c-bump-cab">
                  <span className="c-bump-nome">{b.nome}</span>
                  <span className="c-bump-preco">{b.preco}</span>
                </div>
                <p className="c-bump-txt">{inline(b.texto, `bp-${b.nome}`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="c-sec">
          <div className="c-sec-cab">
            <span className="c-n">{escasso.n}</span>
            <h2 className="c-sec-tit">{escasso.titulo}</h2>
          </div>
          <div className="c-col c-duas">
            <Nos nos={v.escassez.nos} k="esc" figs={figs} />
          </div>
        </section>

        <section className="c-sec">
          <div className="c-sec-cab">
            <span className="c-n">{garantia.n}</span>
            <h2 className="c-sec-tit">{garantia.titulo}</h2>
          </div>
          <div className="c-col">
            <p className="c-forte">{inline(v.garantia, "gar")}</p>
          </div>
        </section>

        <section className="c-sec">
          <div className="c-sec-cab">
            <span className="c-n">{faq.n}</span>
            <h2 className="c-sec-tit">{faq.titulo}</h2>
          </div>
          <div className="c-col c-faq">
            {v.faq.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <div className="c-faq-r">{f.a}</div>
              </details>
            ))}
          </div>
        </section>

        <section className="c-sec">
          <div className="c-sec-cab">
            <span className="c-n">fecho</span>
            <h2 className="c-sec-tit">a janela</h2>
          </div>
          <div className="c-col">
            <Nos nos={v.fecho.nos} k="fecho" figs={figs} />
            <div className="c-cta-linha">
              <a className="c-cta hw-acao" href={url}>
                {compartilhado.ctaTopo}
              </a>
            </div>
          </div>
        </section>

        <footer className="c-rodape">
          <div>{compartilhado.eventoCurto}</div>
          <div>
            {compartilhado.rodape.razao} · {compartilhado.rodape.cnpj} ·{" "}
            <a href={`mailto:${compartilhado.rodape.suporte}`}>{compartilhado.rodape.suporte}</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

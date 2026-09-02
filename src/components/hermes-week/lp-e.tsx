/* ============================================================================
 *  LP E · CLARO E AREJADO
 * ----------------------------------------------------------------------------
 *  ÂNGULO: o desejo. É a única variação que abre por desejo, e o desejo aqui é
 *  o feriado. Então a página descansa: fundo quente, respiro de 120px entre as
 *  seções, medida curta, foto do Red grande e fora do ambiente de trabalho, e
 *  uma serifa em peso 300 em corpo enorme, que é o oposto da serifa pesada de
 *  alto contraste que todo mundo usa quando quer parecer editorial.
 *
 *  PALETA   leite #FCFAF6 (branco quente) · campo #E4EADF (sálvia lavada, em
 *           faixas inteiras, nunca como detalhe) · tinta #22261F ·
 *           tinta fraca #6A7065 · oliva #46543F (marca e CTA)
 *  TIPO     Fraunces 300 em tamanhos grandes, com itálico em uma frase por
 *           seção + Plus Jakarta Sans 300/500 no corpo e nas etiquetas
 *  RITMO    o mais espaçoso das cinco. Seção de 96px no celular e 140px no
 *           desktop, coluna de 60ch, imagem grande com legenda pequena embaixo.
 *  CTA      pílula oliva sólida, generosa, com micro elevação no hover.
 *
 *  DESTAQUE ÚNICO: o parallax lento das duas fotos grandes do Red (abertura e
 *  fecho). Nada mais se move.
 *
 *  Origem das técnicas: locomotive-scroll (data-scroll-speed 0.5, lerp 0.1,
 *  desligado abaixo de 768px) sem o runtime, que faz scroll hijacking e custa
 *  banda em tráfego pago. O `lottie-animations` foi substituído por um SVG
 *  inline e estático: para um ornamento de 96px, carregar player de Lottie e
 *  baixar JSON é despesa sem retorno, e o próprio plugin diz para não usar
 *  Lottie onde CSS ou SVG resolvem.
 * ==========================================================================*/

import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { checkoutUrl } from "./checkout";
import { ImgReal, inline, legendaImg, PAPEL_IMG, Pixel } from "./comum";
import { compartilhado, type Bloco, type Img, type No, type Variante } from "./conteudo";
import { Paralaxe } from "./movimento";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--e-display",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  variable: "--e-ui",
  display: "swap",
});

const CSS = `
.e{
  --leite:#FCFAF6; --campo:#E4EADF; --tinta:#22261F; --tinta2:#6A7065;
  --oliva:#46543F; --linha:rgba(34,38,31,.13);
  --display:var(--e-display),Georgia,serif;
  --ui:var(--e-ui),system-ui,sans-serif;
  background:var(--leite);color:var(--tinta);font-family:var(--ui);font-weight:300;
  -webkit-font-smoothing:antialiased;overflow-x:hidden;
}
.e-faixa{padding:96px 0;}
@media(min-width:900px){.e-faixa{padding:140px 0;}}
.e-faixa[data-campo="sim"]{background:var(--campo);}
.e-in{max-width:1080px;margin:0 auto;padding:0 22px;}
.e-col{max-width:60ch;}
.e-rot{
  font-family:var(--ui);font-weight:500;font-size:.68rem;letter-spacing:.24em;
  text-transform:uppercase;color:var(--oliva);margin:0 0 26px;
}

/* ---------- hero ---------- */
.e-hero{padding:70px 0 0;}
.e-h1{
  font-family:var(--display);font-weight:300;font-optical-sizing:auto;
  font-size:clamp(2.35rem,7.4vw,4.6rem);line-height:1.06;letter-spacing:-.022em;
  margin:0 0 26px;max-width:17ch;
}
.e-h1 b{font-weight:600;font-style:italic;color:var(--oliva);}
.e-deck{font-size:1.14rem;line-height:1.72;color:var(--tinta2);max-width:44ch;margin:0 0 36px;}
.e-fatos{display:flex;flex-wrap:wrap;gap:10px 28px;margin:30px 0 0;padding:0;list-style:none;font-size:.8rem;letter-spacing:.04em;color:var(--tinta2);}
.e-fatos li{display:flex;align-items:center;gap:8px;}
.e-fatos li::before{content:"";width:5px;height:5px;border-radius:50%;background:var(--oliva);}

/* ---------- texto ---------- */
.e-h2{
  font-family:var(--display);font-weight:300;
  font-size:clamp(1.75rem,4.6vw,2.9rem);line-height:1.12;letter-spacing:-.02em;margin:0 0 30px;max-width:19ch;
}
.e-p{font-size:1.09rem;line-height:1.82;margin:0 0 1.25em;color:#33372E;}
.e-p b{font-weight:500;color:var(--tinta);}
.e-forte{
  font-family:var(--display);font-weight:300;font-size:clamp(1.5rem,4vw,2.3rem);
  line-height:1.22;letter-spacing:-.018em;margin:0 0 .7em;
}
.e-forte b{font-weight:600;font-style:italic;color:var(--oliva);}
.e-cita{
  font-family:var(--display);font-weight:300;font-style:italic;
  font-size:clamp(1.25rem,3.4vw,1.85rem);line-height:1.4;letter-spacing:-.012em;
  color:var(--oliva);margin:0 0 44px;padding:0;max-width:24ch;
}
.e-citas{display:grid;gap:8px;margin-top:40px;}
@media(min-width:820px){.e-citas{grid-template-columns:repeat(3,minmax(0,1fr));gap:44px;}}

/* ---------- foto grande, com parallax ---------- */
.e-palco{position:relative;margin:52px 0 0;overflow:hidden;border-radius:4px;}
.e-foto{
  background:var(--campo);border:1px solid var(--linha);
  display:flex;align-items:center;justify-content:center;padding:34px;
  min-height:300px;
}
.e-faixa[data-campo="sim"] .e-foto{background:#DAE2D4;}
@media(min-width:900px){.e-foto{min-height:440px;}}
.e-foto[data-f="celular"]{min-height:340px;max-width:280px;padding:22px;}
.e-foto[data-f="wide"]{min-height:260px;}
.e-foto[data-f="quadrado"]{min-height:280px;max-width:330px;}
.e-foto-txt{
  font-size:.95rem;line-height:1.65;color:var(--tinta2);max-width:38ch;margin:0;text-align:center;
}
.e-leg{
  display:flex;flex-wrap:wrap;gap:6px 14px;margin:14px 0 0;font-size:.7rem;letter-spacing:.16em;
  text-transform:uppercase;color:var(--tinta2);
}
.e-leg b{color:var(--oliva);font-weight:500;}
.e-menor{max-width:340px;}

/* ---------- foto pronta ----------
   O .e-palco tem overflow:hidden e o parallax translada o que está dentro.
   Com uma CAIXA de cor isso é invisível; com uma FOTO, deslocá-la para cima
   descobriria uma faixa vazia na base. Por isso a foto que anda entra em
   moldura de proporção fixa, preenchida com object-fit:cover e 12% de folga
   vertical: o parallax come a folga em vez de descobrir buraco.
   O parallax já se desliga sozinho abaixo de 768px e sob prefers-reduced-motion
   (ver movimento.tsx) — nesses casos a folga simplesmente não aparece. */
.e-moldura{position:relative;overflow:hidden;background:var(--campo);border:1px solid var(--linha);}
.e-moldura[data-f="wide"]{aspect-ratio:16/9;}
.e-moldura[data-f="retrato"]{aspect-ratio:3/4;max-width:340px;}
.e-moldura[data-f="quadrado"]{aspect-ratio:1/1;max-width:330px;}
.e-moldura[data-f="celular"]{aspect-ratio:9/16;max-width:280px;}
.e-moldura img{position:absolute;inset:-6% 0;width:100%;height:112%;object-fit:cover;display:block;}
/* parada (sem parallax) a folga é desnecessária: a foto ocupa a moldura inteira */
.e-parada img{inset:0;height:100%;}

/* ---------- ornamento (o lugar onde ia um lottie) ---------- */
.e-sol{display:block;width:88px;height:88px;margin:0 0 34px;color:var(--oliva);opacity:.75;}

/* ---------- os dias ---------- */
.e-dias{margin:44px 0 0;}
.e-dia{
  display:grid;grid-template-columns:1fr;gap:6px;padding:26px 0;border-top:1px solid var(--linha);
}
@media(min-width:760px){.e-dia{grid-template-columns:180px minmax(0,1fr);gap:36px;align-items:baseline;}}
.e-dia:last-child{border-bottom:1px solid var(--linha);}
.e-dia dt{font-family:var(--display);font-weight:400;font-size:1.3rem;letter-spacing:-.015em;color:var(--oliva);}
.e-dia dd{margin:0;font-size:1.05rem;line-height:1.7;color:#33372E;}

/* ---------- oferta ---------- */
.e-oferta{display:grid;gap:38px;align-items:center;}
@media(min-width:900px){.e-oferta{grid-template-columns:minmax(0,1fr) 330px;gap:64px;}}
.e-produto{font-family:var(--display);font-weight:300;font-size:clamp(1.8rem,5vw,2.7rem);line-height:1.1;letter-spacing:-.02em;margin:0;}
.e-preco{font-family:var(--display);font-weight:600;font-size:clamp(3.4rem,14vw,5.4rem);line-height:1;letter-spacing:-.04em;color:var(--oliva);margin:18px 0 26px;}
.e-inclui{list-style:none;margin:0 0 36px;padding:0;}
.e-inclui li{font-size:1.04rem;line-height:1.6;padding:14px 0;border-top:1px solid var(--linha);color:#33372E;}

/* ---------- bumps ---------- */
.e-bumps{display:grid;gap:34px;margin-top:44px;}
@media(min-width:860px){.e-bumps{grid-template-columns:repeat(3,minmax(0,1fr));gap:44px;}}
.e-bump-nome{font-family:var(--display);font-weight:400;font-size:1.32rem;letter-spacing:-.015em;margin:0 0 4px;}
.e-bump-preco{font-size:.82rem;letter-spacing:.14em;text-transform:uppercase;color:var(--oliva);margin:0 0 14px;font-weight:500;}
.e-bump-txt{font-size:1rem;line-height:1.7;color:var(--tinta2);margin:0;}

/* ---------- garantia / faq / rodapé ---------- */
.e-garantia{font-family:var(--display);font-weight:300;font-size:clamp(1.6rem,4.6vw,2.5rem);line-height:1.25;letter-spacing:-.02em;margin:0;max-width:22ch;}
.e-garantia b{font-weight:600;color:var(--oliva);}
.e-faq{margin-top:36px;}
.e-faq details{border-top:1px solid var(--linha);}
.e-faq details:last-child{border-bottom:1px solid var(--linha);}
.e-faq summary{
  cursor:pointer;list-style:none;padding:24px 34px 24px 0;position:relative;
  font-family:var(--display);font-weight:400;font-size:1.16rem;letter-spacing:-.012em;
}
.e-faq summary::-webkit-details-marker{display:none;}
.e-faq summary::after{content:"+";position:absolute;right:4px;top:22px;color:var(--oliva);font-family:var(--ui);font-weight:300;font-size:1.3rem;}
.e-faq details[open] summary::after{content:"–";}
.e-faq-r{padding:0 0 26px;font-size:1.04rem;line-height:1.78;color:var(--tinta2);max-width:58ch;}
.e-rodape{padding:44px 0 60px;border-top:1px solid var(--linha);font-size:.78rem;line-height:2;color:var(--tinta2);letter-spacing:.03em;}
.e-rodape a{color:var(--oliva);}

/* ---------- CTA ---------- */
.e-cta{
  display:inline-block;background:var(--oliva);color:#FCFAF6;text-decoration:none;
  font-family:var(--ui);font-weight:500;font-size:.95rem;letter-spacing:.03em;
  padding:21px 36px;border-radius:999px;border:1px solid var(--oliva);
  transition:transform .22s cubic-bezier(.4,0,.2,1),box-shadow .22s ease,background .22s ease;
}
.e-cta:hover{transform:translateY(-3px);background:#3A462F;box-shadow:0 16px 34px -20px rgba(34,38,31,.8);}
.e-cta:focus-visible{outline:2px solid var(--tinta);outline-offset:4px;}
.e-cta-linha{margin:44px 0 0;}

@media (prefers-reduced-motion: reduce){
  .e *,.e *::before,.e *::after{transition-duration:.01ms !important;animation-duration:.01ms !important;}
}
`;

/* Ornamento: um sol de traço fino. Entra onde a copy fala de recuperar a
   terça-feira. Estático de propósito, ver o cabeçalho do arquivo. */
function Sol() {
  return (
    <svg className="e-sol" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <circle cx="48" cy="48" r="17" stroke="currentColor" strokeWidth="1.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((g) => (
        <line
          key={g}
          x1="48"
          y1="20"
          x2="48"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          transform={`rotate(${g} 48 48)`}
        />
      ))}
    </svg>
  );
}

function Foto({
  img,
  menor = false,
  comParalaxe = false,
  prioridade = false,
}: {
  img: Img;
  menor?: boolean;
  comParalaxe?: boolean;
  prioridade?: boolean;
}) {
  const corpo = img.src ? (
    <div className={`e-moldura${comParalaxe ? "" : " e-parada"}`} data-f={img.formato}>
      <ImgReal
        img={img}
        sizes={menor ? "(max-width:900px) 88vw, 340px" : "(max-width:900px) 92vw, 760px"}
        prioridade={prioridade}
        preenche
      />
    </div>
  ) : (
    <div className="e-foto" data-f={img.formato}>
      <p className="e-foto-txt">{img.c}</p>
    </div>
  );
  return (
    <figure className={`e-palco${menor ? " e-menor" : ""}`} style={{ margin: menor ? "34px 0 0" : undefined }}>
      {comParalaxe ? <Paralaxe velocidade={0.62}>{corpo}</Paralaxe> : corpo}
      <figcaption className="e-leg">
        <b>{legendaImg(img)}</b>
        <span>{PAPEL_IMG[img.tipo]}</span>
      </figcaption>
    </figure>
  );
}

function Nos({ nos, k }: { nos: readonly No[]; k: string }) {
  return (
    <>
      {nos.map((n, i) => {
        const kk = `${k}-${i}`;
        if (n.t === "img") return <Foto key={kk} img={n} menor />;
        if (n.t === "cita")
          return (
            <blockquote key={kk} className="e-cita">
              {inline(n.c, kk)}
            </blockquote>
          );
        if (n.t === "forte")
          return (
            <p key={kk} className="e-forte">
              {inline(n.c, kk)}
            </p>
          );
        return (
          <p key={kk} className="e-p">
            {inline(n.c, kk)}
          </p>
        );
      })}
    </>
  );
}

/** A dobra das citações vira três colunas de aspas grandes na faixa sálvia. */
function Celebram({ b }: { b: Bloco }) {
  const citas = b.nos.filter((n) => n.t === "cita");
  const texto = b.nos.filter((n) => n.t !== "cita");
  return (
    <>
      <Sol />
      <div className="e-col">
        <Nos nos={texto.slice(0, 2)} k="cel-a" />
      </div>
      <div className="e-citas">
        {citas.map((c, i) => (
          <blockquote className="e-cita" key={i}>
            {inline(c.c, `cit${i}`)}
          </blockquote>
        ))}
      </div>
      <div className="e-col">
        <Nos nos={texto.slice(2)} k="cel-b" />
      </div>
    </>
  );
}

/* ========================================================================= */

export function LpE({ v }: { v: Variante }) {
  const url = checkoutUrl(v.id);
  const celebram = v.antes.find((b) => b.tag === "o que essas pessoas celebram");

  // Faixas sálvia alternadas: a cena, as citações, a oferta e o fecho. O resto
  // fica no leite, para o campo de cor não virar listra.
  return (
    <div className={`e ${fraunces.variable} ${jakarta.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Pixel v={v.id} />

      <main>
        <header className="e-hero">
          <div className="e-in">
            <p className="e-rot">{compartilhado.evento}</p>
            <h1 className="e-h1">{inline(v.hero.h1, "h1")}</h1>
            <p className="e-deck">{v.hero.deck}</p>
            <a className="e-cta hw-acao" href={url}>
              {compartilhado.ctaTopo}
            </a>
            <ul className="e-fatos">
              <li>5 aulas gravadas</li>
              <li>segunda a sexta</li>
              <li>garantia de 7 dias</li>
            </ul>
            {/* o único momento de movimento da página */}
            <Foto img={v.hero.foto} comParalaxe />
          </div>
        </header>

        {v.antes.map((b, i) => {
          const eCelebram = b === celebram;
          const campo = eCelebram || i === 0;
          return (
            <section className="e-faixa" data-campo={campo ? "sim" : "nao"} key={`a${i}`}>
              <div className="e-in">
                <p className="e-rot">{b.tag}</p>
                {eCelebram ? (
                  <Celebram b={b} />
                ) : (
                  <div className="e-col">
                    <Nos nos={b.nos} k={`a${i}`} />
                  </div>
                )}
              </div>
            </section>
          );
        })}

        <section className="e-faixa">
          <div className="e-in">
            <p className="e-rot">a semana</p>
            <h2 className="e-h2">{v.saiCom.intro}</h2>
            <dl className="e-dias">
              {compartilhado.dias.map((d) => (
                <div className="e-dia" key={d.dia}>
                  <dt>{d.dia}</dt>
                  <dd>{d.saida}</dd>
                </div>
              ))}
            </dl>
            <div className="e-col" style={{ marginTop: 34 }}>
              <p className="e-p">{v.saiCom.sabado}</p>
              {v.saiCom.extra ? <p className="e-forte">{inline(v.saiCom.extra, "extra")}</p> : null}
            </div>
            <div className="e-cta-linha">
              <a className="e-cta hw-acao" href={url}>
                {compartilhado.ctaTopo}
              </a>
            </div>
          </div>
        </section>

        {v.entre.map((b, i) => (
          <section className="e-faixa" data-campo="sim" key={`e${i}`}>
            <div className="e-in">
              <p className="e-rot">{b.tag}</p>
              <div className="e-col">
                <Nos nos={b.nos} k={`en${i}`} />
              </div>
            </div>
          </section>
        ))}

        <section className="e-faixa">
          <div className="e-in">
            <p className="e-rot">{v.prova.tag}</p>
            <div className="e-col">
              <Nos nos={v.prova.nos} k="prova" />
            </div>
          </div>
        </section>

        <section className="e-faixa">
          <div className="e-in">
            <p className="e-rot">{v.praQuemNaoE.tag}</p>
            <div className="e-col">
              <Nos nos={v.praQuemNaoE.nos} k="pq" />
            </div>
          </div>
        </section>

        <section className="e-faixa" data-campo="sim">
          <div className="e-in">
            <p className="e-rot">a oferta</p>
            <div className="e-oferta">
              <div>
                <h2 className="e-produto">{compartilhado.produto}</h2>
                <p className="e-preco">{compartilhado.preco}</p>
                <ul className="e-inclui">
                  {v.oferta.linhas.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
                <a className="e-cta hw-acao" href={url}>
                  {compartilhado.ctaOferta}
                </a>
              </div>
              {v.oferta.foto ? <Foto img={v.oferta.foto} /> : null}
            </div>
          </div>
        </section>

        <section className="e-faixa">
          <div className="e-in">
            <p className="e-rot">os três complementos</p>
            {v.bumps.intro ? (
              <div className="e-col">
                <p className="e-p">{v.bumps.intro}</p>
              </div>
            ) : null}
            <div className="e-bumps">
              {v.bumps.itens.map((b) => (
                <div key={b.nome}>
                  <h3 className="e-bump-nome">{b.nome}</h3>
                  <p className="e-bump-preco">{b.preco}</p>
                  <p className="e-bump-txt">{inline(b.texto, `bp-${b.nome}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="e-faixa">
          <div className="e-in">
            <p className="e-rot">o que é escasso aqui</p>
            <div className="e-col">
              <Nos nos={v.escassez.nos} k="esc" />
            </div>
          </div>
        </section>

        <section className="e-faixa">
          <div className="e-in">
            <p className="e-rot">garantia</p>
            <p className="e-garantia">{inline(v.garantia, "gar")}</p>
          </div>
        </section>

        <section className="e-faixa">
          <div className="e-in">
            <p className="e-rot">o que você vai perguntar</p>
            <div className="e-faq">
              {v.faq.map((f, i) => (
                <details key={i}>
                  <summary>{f.q}</summary>
                  <div className="e-faq-r">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="e-faixa" data-campo="sim">
          <div className="e-in">
            <div className="e-col">
              <Nos nos={v.fecho.nos} k="fecho" />
            </div>
            {v.fecho.foto ? <Foto img={v.fecho.foto} comParalaxe /> : null}
            <div className="e-cta-linha">
              <a className="e-cta hw-acao" href={url}>
                {compartilhado.ctaTopo}
              </a>
            </div>
          </div>
        </section>

        <footer className="e-rodape">
          <div className="e-in">
            <div>{compartilhado.eventoCurto}</div>
            <div>
              {compartilhado.rodape.razao} · {compartilhado.rodape.cnpj} ·{" "}
              <a href={`mailto:${compartilhado.rodape.suporte}`}>{compartilhado.rodape.suporte}</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* ============================================================================
 *  LP B · BENTO
 * ----------------------------------------------------------------------------
 *  ÂNGULO: o inventário. A copy diz "você tem quatro e nenhum trabalha", então
 *  aqui O LAYOUT É O ARGUMENTO: uma grade com quatro células apagadas, todas
 *  do mesmo tamanho e todas com a etiqueta "aguarda", e uma quinta célula
 *  maior, acesa, com a etiqueta "age". Dá pra entender a página inteira sem
 *  ler uma linha, e é a única das cinco de que isso é verdade.
 *
 *  PALETA   vazio #0A0A0E · célula #15151C · morta #101015 · tinta #EFEFF4 ·
 *           fraca #8A8A99 · viva #4D7CFF (azul elétrico, só na célula que age)
 *  TIPO     Sora 800 (display largo, cara de produto) + Manrope 400/600 (UI) +
 *           Space Mono (etiquetas de célula e preço)
 *  RITMO    grade. 12 colunas em desktop, raio 18px, gap 14px, célula com
 *           respiro grande por dentro. É a única das cinco com canto redondo.
 *  CTA      pílula sólida azul, peso 700, com seta.
 *
 *  DESTAQUE ÚNICO: a grade acendendo em stagger de 100ms quando entra na tela,
 *  as quatro apagadas primeiro e a quinta por último, com o halo. Nenhum outro
 *  elemento da página se move.
 *
 *  Origem das técnicas: modern-web-design (grade assimétrica, 12 colunas, gap,
 *  headline em clamp) e gsap-scrolltrigger (stagger 100ms, ease padrão,
 *  gatilho a 80% da tela). Sem os runtimes: ver `movimento.tsx`.
 * ==========================================================================*/

import { Manrope, Sora, Space_Mono } from "next/font/google";
import { checkoutUrl } from "./checkout";
import { ImgReal, inline, legendaImg, PAPEL_IMG, Pixel } from "./comum";
import { compartilhado, type Bloco, type Img, type No, type Variante } from "./conteudo";
import { Revela } from "./movimento";

const display = Sora({ subsets: ["latin"], weight: ["600", "800"], variable: "--b-display", display: "swap" });
const ui = Manrope({ subsets: ["latin"], weight: ["400", "600"], variable: "--b-ui", display: "swap" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--b-mono", display: "swap" });

/* Os quatro nomes saem da própria copy da dobra 2. Não é lista inventada. */
const APAGADOS = ["ChatGPT", "Claude", "Gemini", "Perplexity"] as const;

const CSS = `
.b{
  --vazio:#0A0A0E; --celula:#15151C; --morta:#101015; --borda:#222230;
  --tinta:#EFEFF4; --fraca:#8A8A99; --apaga:#4A4A57; --viva:#4D7CFF;
  --display:var(--b-display),system-ui,sans-serif;
  --ui:var(--b-ui),system-ui,sans-serif;
  --mono:var(--b-mono),ui-monospace,monospace;
  background:var(--vazio);color:var(--tinta);font-family:var(--ui);
  -webkit-font-smoothing:antialiased;
}
.b-wrap{max-width:1080px;margin:0 auto;padding:0 16px 90px;}
@media(min-width:720px){.b-wrap{padding:0 28px 110px;}}

/* ---------- célula, a unidade da página ---------- */
.b-cel{background:var(--celula);border:1px solid var(--borda);border-radius:18px;padding:22px;}
@media(min-width:720px){.b-cel{padding:28px;}}
.b-grade{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;}
@media(min-width:820px){.b-grade{grid-template-columns:repeat(12,minmax(0,1fr));}}
.b-sec{padding:52px 0 0;}
.b-sec-tit{
  font-family:var(--display);font-weight:800;font-size:clamp(1.5rem,4.2vw,2.15rem);
  line-height:1.1;letter-spacing:-.035em;margin:0 0 20px;color:#fff;
}
.b-rot{font-family:var(--mono);font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;color:var(--fraca);margin:0 0 14px;}

/* ---------- hero ---------- */
.b-hero{padding:52px 0 8px;}
.b-eyebrow{font-family:var(--mono);font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;color:var(--viva);margin:0 0 22px;}
.b-h1{
  font-family:var(--display);font-weight:800;
  font-size:clamp(2rem,6.6vw,3.6rem);line-height:1.04;letter-spacing:-.045em;
  margin:0 0 20px;color:#fff;max-width:16ch;
}
@media(min-width:720px){.b-h1{max-width:20ch;}}
.b-h1 b{color:var(--viva);font-weight:800;}
.b-deck{font-size:1.08rem;line-height:1.6;color:var(--fraca);margin:0 0 28px;max-width:46ch;}
.b-fatos{display:flex;flex-wrap:wrap;gap:8px;margin:22px 0 0;padding:0;list-style:none;}
.b-fatos li{font-family:var(--mono);font-size:.68rem;letter-spacing:.08em;color:var(--fraca);border:1px solid var(--borda);border-radius:999px;padding:7px 12px;}

/* ---------- texto ---------- */
.b-p{font-size:1.02rem;line-height:1.7;margin:0 0 1em;color:#D5D5DE;}
.b-p b{color:#fff;font-weight:600;}
.b-forte{font-family:var(--display);font-weight:600;font-size:1.18rem;line-height:1.4;letter-spacing:-.02em;color:#fff;margin:0 0 1em;}
.b-cita{margin:0 0 1.1em;padding:16px 18px;border-radius:12px;background:var(--morta);border:1px solid var(--borda);font-size:1rem;line-height:1.62;color:var(--fraca);font-style:italic;}
.b-col{max-width:62ch;}

/* ---------- A GRADE DO INVENTÁRIO: o argumento ---------- */
.b-inv{margin-top:8px;}
.b-chat{
  grid-column:span 1;background:var(--morta);border:1px solid #1B1B24;border-radius:18px;
  padding:20px 18px;min-height:132px;display:flex;flex-direction:column;justify-content:space-between;
}
@media(min-width:820px){.b-chat{grid-column:span 3;min-height:168px;}}
.b-chat-nome{font-family:var(--display);font-weight:600;font-size:1.02rem;color:var(--apaga);letter-spacing:-.02em;}
.b-chat-est{font-family:var(--mono);font-size:.66rem;letter-spacing:.16em;text-transform:uppercase;color:#3A3A46;}
.b-chat-barra{height:2px;background:#1E1E28;margin:16px 0;border-radius:2px;}
.b-vivo{
  grid-column:span 2;background:var(--celula);border:1px solid rgba(77,124,255,.55);border-radius:18px;
  padding:22px;box-shadow:0 0 0 1px rgba(77,124,255,.12),0 18px 60px -28px rgba(77,124,255,.75);
}
@media(min-width:820px){.b-vivo{grid-column:span 12;display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:28px;align-items:center;}}
/* o nome ocupa o lugar que seria de um parágrafo: a escala é o argumento */
.b-vivo-nome{font-family:var(--display);font-weight:800;font-size:clamp(2.1rem,7.4vw,3.5rem);line-height:1;letter-spacing:-.05em;color:#fff;margin:10px 0 0;}
.b-vivo-est{font-family:var(--mono);font-size:.66rem;letter-spacing:.16em;text-transform:uppercase;color:var(--viva);}
.b-vivo-txt{font-size:1rem;line-height:1.62;color:var(--fraca);margin:12px 0 0;max-width:46ch;}
.b-pulso{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--viva);margin-right:8px;vertical-align:middle;}

/* stagger: quatro apagadas, depois a que age */
.b-inv .b-chat,.b-inv .b-vivo{transition:opacity .6s cubic-bezier(.4,0,.2,1),transform .6s cubic-bezier(.4,0,.2,1),box-shadow .6s ease;}
.b-inv[data-rv="arm"] .b-chat,.b-inv[data-rv="arm"] .b-vivo{opacity:0;transform:translateY(14px);}
.b-inv[data-rv="arm"] .b-vivo{box-shadow:none;}
.b-inv[data-rv="on"] .b-chat,.b-inv[data-rv="on"] .b-vivo{opacity:1;transform:none;}
.b-inv[data-rv="on"] .b-chat:nth-child(1){transition-delay:0ms;}
.b-inv[data-rv="on"] .b-chat:nth-child(2){transition-delay:100ms;}
.b-inv[data-rv="on"] .b-chat:nth-child(3){transition-delay:200ms;}
.b-inv[data-rv="on"] .b-chat:nth-child(4){transition-delay:300ms;}
.b-inv[data-rv="on"] .b-vivo{transition-delay:480ms;}

/* ---------- diferenças / dias / bumps: a mesma célula, papéis diferentes -- */
.b-item{grid-column:span 2;}
@media(min-width:820px){.b-item{grid-column:span 4;}}
.b-item-tit{font-family:var(--display);font-weight:600;font-size:1.02rem;letter-spacing:-.02em;color:#fff;margin:0 0 8px;}
.b-item-txt{font-size:.96rem;line-height:1.6;color:var(--fraca);margin:0;}
.b-dia{grid-column:span 2;}
@media(min-width:820px){.b-dia{grid-column:span 4;}.b-dia:nth-child(4),.b-dia:nth-child(5){grid-column:span 6;}}
.b-dia-n{font-family:var(--mono);font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;color:var(--viva);margin:0 0 10px;}
.b-dia-t{font-size:1rem;line-height:1.55;color:#D5D5DE;margin:0;}

/* ---------- placeholder de imagem ---------- */
.b-img{margin:0;border-radius:14px;border:1px solid var(--borda);background:var(--morta);padding:14px;}
.b-img-cab{display:flex;justify-content:space-between;gap:10px;font-family:var(--mono);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--viva);margin-bottom:10px;}
.b-img-papel{color:var(--apaga);}
.b-img-caixa{display:flex;align-items:center;min-height:120px;border:1px dashed #2A2A38;border-radius:10px;padding:14px;background:#0C0C11;}
.b-img[data-f="celular"] .b-img-caixa{min-height:190px;}
.b-img[data-f="wide"] .b-img-caixa{min-height:140px;}
.b-img[data-f="retrato"] .b-img-caixa{min-height:200px;}
.b-img-txt{margin:0;font-size:.84rem;line-height:1.5;color:var(--fraca);}
.b-solta{margin:22px 0;max-width:420px;}
/* pronta: a caixa tracejada era o vazio; com a foto entra o raio de canto do bento */
.b-img-foto{display:block;border-radius:10px;border:1px solid #2A2A38;background:#0C0C11;}

/* ---------- oferta ---------- */
.b-oferta{
  grid-column:span 2;background:linear-gradient(160deg,#141a2e 0%,#15151C 62%);
  border:1px solid rgba(77,124,255,.4);border-radius:22px;padding:28px 22px;
}
@media(min-width:820px){.b-oferta{grid-column:span 12;padding:38px;}}
.b-produto{font-family:var(--display);font-weight:800;font-size:clamp(1.35rem,4vw,2rem);letter-spacing:-.035em;color:#fff;margin:0 0 4px;}
.b-preco{font-family:var(--display);font-weight:800;font-size:clamp(3rem,13vw,4.6rem);line-height:1;letter-spacing:-.055em;color:var(--viva);margin:14px 0 22px;}
.b-inclui{list-style:none;margin:0 0 28px;padding:0;display:grid;gap:10px;}
@media(min-width:720px){.b-inclui{grid-template-columns:1fr 1fr;gap:12px 24px;}}
.b-inclui li{font-size:.98rem;line-height:1.5;color:#D5D5DE;padding-left:18px;position:relative;}
.b-inclui li::before{content:"";position:absolute;left:0;top:.55em;width:7px;height:7px;border-radius:50%;background:var(--viva);}

/* ---------- garantia / faq / rodapé ---------- */
.b-garantia{font-size:1.08rem;line-height:1.6;color:#fff;margin:0;}
.b-garantia b{color:var(--viva);}
.b-faq{display:grid;gap:10px;}
.b-faq details{background:var(--celula);border:1px solid var(--borda);border-radius:14px;padding:0 18px;}
.b-faq summary{cursor:pointer;list-style:none;padding:16px 30px 16px 0;position:relative;font-family:var(--display);font-weight:600;font-size:.98rem;color:#fff;letter-spacing:-.01em;}
.b-faq summary::-webkit-details-marker{display:none;}
.b-faq summary::after{content:"+";position:absolute;right:2px;top:15px;color:var(--viva);font-family:var(--mono);}
.b-faq details[open] summary::after{content:"–";}
.b-faq-r{padding:0 0 18px;font-size:.96rem;line-height:1.68;color:var(--fraca);}
.b-fecho{padding:60px 0 0;}
.b-rodape{margin-top:56px;padding-top:20px;border-top:1px solid var(--borda);font-family:var(--mono);font-size:.68rem;line-height:1.9;color:var(--apaga);}
.b-rodape a{color:var(--fraca);}

/* ---------- CTA ---------- */
.b-cta{
  display:inline-flex;align-items:center;gap:10px;font-family:var(--display);font-weight:700;
  font-size:.94rem;letter-spacing:-.01em;color:#fff;text-decoration:none;background:var(--viva);
  border-radius:999px;padding:17px 28px;border:none;
  transition:transform .2s cubic-bezier(.4,0,.2,1),box-shadow .2s ease,background .2s ease;
  box-shadow:0 14px 40px -18px rgba(77,124,255,.9);
}
.b-cta::after{content:"→";font-family:var(--mono);}
.b-cta:hover{transform:translateY(-2px);background:#5F89FF;}
.b-cta:focus-visible{outline:2px solid #fff;outline-offset:3px;}

@media (prefers-reduced-motion: reduce){
  .b *,.b *::before,.b *::after{transition-duration:.01ms !important;animation-duration:.01ms !important;}
}
`;

/* ---------- pedaços ------------------------------------------------------ */

function Foto({
  img,
  solta = false,
  prioridade = false,
}: {
  img: Img;
  solta?: boolean;
  prioridade?: boolean;
}) {
  return (
    <figure className={`b-img${solta ? " b-solta" : ""}`} data-f={img.formato}>
      <figcaption className="b-img-cab">
        <span>{legendaImg(img)}</span>
        <span className="b-img-papel">{PAPEL_IMG[img.tipo]}</span>
      </figcaption>
      {img.src ? (
        <ImgReal
          img={img}
          classe="b-img-foto"
          sizes={img.formato === "wide" ? "(max-width:820px) 90vw, 680px" : "(max-width:820px) 86vw, 400px"}
          prioridade={prioridade}
        />
      ) : (
        <div className="b-img-caixa">
          <p className="b-img-txt">{img.c}</p>
        </div>
      )}
    </figure>
  );
}

function Nos({ nos, k }: { nos: readonly No[]; k: string }) {
  return (
    <>
      {nos.map((n, i) => {
        const kk = `${k}-${i}`;
        if (n.t === "img") return <Foto key={kk} img={n} solta />;
        if (n.t === "cita")
          return (
            <blockquote key={kk} className="b-cita">
              {inline(n.c, kk)}
            </blockquote>
          );
        if (n.t === "forte")
          return (
            <p key={kk} className="b-forte">
              {inline(n.c, kk)}
            </p>
          );
        return (
          <p key={kk} className="b-p">
            {inline(n.c, kk)}
          </p>
        );
      })}
    </>
  );
}

/** As cinco diferenças viram cinco células: cada nó começa com um **título**. */
function Diferencas({ b }: { b: Bloco }) {
  return (
    <div className="b-grade">
      {b.nos.map((n, i) => {
        if (n.t !== "p") return null;
        const m = n.c.match(/^\*\*([^*]+)\*\*\s*([\s\S]*)$/);
        return (
          <div className="b-cel b-item" key={i}>
            <h3 className="b-item-tit">{m ? m[1] : `Diferença ${i + 1}`}</h3>
            <p className="b-item-txt">{inline(m ? (m[2] as string) : n.c, `d${i}`)}</p>
          </div>
        );
      })}
    </div>
  );
}

function Cta({ href, texto }: { href: string; texto: string }) {
  return (
    <a className="b-cta hw-acao" href={href}>
      {texto}
    </a>
  );
}

/* ========================================================================= */

export function LpB({ v }: { v: Variante }) {
  const url = checkoutUrl(v.id);

  const inventario = v.antes.find((b) => b.tag === "o inventário");
  const diferencas = v.antes.find((b) => b.tag === "as cinco diferenças");
  const resto = v.antes.filter((b) => b !== inventario && b !== diferencas);

  // A célula que age recebe o print do Telegram. Ele está na dobra do
  // inventário e sai do fluxo do texto de propósito: dentro da grade ele é
  // argumento, no meio do parágrafo seria só ilustração.
  const printVivo = inventario?.nos.find((n) => n.t === "img" && n.tipo === "ALFRED");

  return (
    <div className={`b ${display.variable} ${ui.variable} ${mono.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Pixel v={v.id} />

      <main className="b-wrap">
        <header className="b-hero">
          <p className="b-eyebrow">{compartilhado.evento}</p>
          <h1 className="b-h1">{inline(v.hero.h1, "h1")}</h1>
          <p className="b-deck">{v.hero.deck}</p>
          <Cta href={url} texto={compartilhado.ctaTopo} />
          <ul className="b-fatos">
            <li>5 encontros</li>
            <li>segunda a sexta</li>
            <li>garantia de 7 dias</li>
          </ul>
          <div style={{ marginTop: 30, maxWidth: 420 }}>
            <Foto img={v.hero.foto} prioridade />
          </div>
        </header>

        {/* ---------- o inventário: a grade que É o argumento ---------- */}
        {inventario ? (
          <section className="b-sec">
            <div className="b-col">
              <Nos nos={inventario.nos.filter((n) => n !== printVivo)} k="inv" />
            </div>
            <Revela className="b-grade b-inv" como="grade" limiar={0.15}>
              {APAGADOS.map((nome) => (
                <div className="b-chat" key={nome}>
                  <div>
                    <div className="b-chat-nome">{nome}</div>
                    <div className="b-chat-barra" aria-hidden="true" />
                  </div>
                  <div className="b-chat-est">aguarda</div>
                </div>
              ))}
              <div className="b-vivo">
                <div>
                  <div className="b-vivo-est">
                    <span className="b-pulso" aria-hidden="true" />
                    age
                  </div>
                  {/* Sem frase aqui de propósito. O contraste entre quatro
                      "aguarda" e um "age" já é o argumento inteiro, e escrever
                      uma explicação seria a IRIS inventando copy nova numa
                      página cuja copy está aprovada. */}
                  <h2 className="b-vivo-nome">Alfred</h2>
                </div>
                {printVivo && printVivo.t === "img" ? <Foto img={printVivo} /> : null}
              </div>
            </Revela>
          </section>
        ) : null}

        {/* ---------- as dobras de texto ---------- */}
        {resto.map((b, i) => (
          <section className="b-sec" key={`r${i}`}>
            <p className="b-rot">{b.tag}</p>
            <div className="b-col">
              <Nos nos={b.nos} k={`r${i}`} />
            </div>
          </section>
        ))}

        {/* ---------- as cinco diferenças em cinco células ---------- */}
        {diferencas ? (
          <section className="b-sec">
            <h2 className="b-sec-tit">As cinco diferenças que importam</h2>
            <Diferencas b={diferencas} />
          </section>
        ) : null}

        {/* ---------- a semana ---------- */}
        <section className="b-sec">
          <h2 className="b-sec-tit">{v.saiCom.intro}</h2>
          <div className="b-grade">
            {compartilhado.dias.map((d) => (
              <div className="b-cel b-dia" key={d.dia}>
                <p className="b-dia-n">{d.dia}</p>
                <p className="b-dia-t">{d.saida}</p>
              </div>
            ))}
          </div>
          <p className="b-p" style={{ marginTop: 22 }}>
            {v.saiCom.sabado}
          </p>
          {v.saiCom.extra ? <p className="b-p">{inline(v.saiCom.extra, "extra")}</p> : null}
          <Cta href={url} texto={compartilhado.ctaTopo} />
        </section>

        {v.entre.map((b, i) => (
          <section className="b-sec" key={`e${i}`}>
            <p className="b-rot">{b.tag}</p>
            <div className="b-col">
              <Nos nos={b.nos} k={`e${i}`} />
            </div>
          </section>
        ))}

        <section className="b-sec">
          <p className="b-rot">{v.prova.tag}</p>
          <div className="b-cel">
            <div className="b-col">
              <Nos nos={v.prova.nos} k="prova" />
            </div>
          </div>
        </section>

        <section className="b-sec">
          <p className="b-rot">{v.praQuemNaoE.tag}</p>
          <div className="b-col">
            <Nos nos={v.praQuemNaoE.nos} k="pq" />
          </div>
        </section>

        {/* ---------- oferta ---------- */}
        <section className="b-sec">
          <div className="b-grade">
            <div className="b-oferta">
              <h2 className="b-produto">{compartilhado.produto}</h2>
              <p className="b-preco">{compartilhado.preco}</p>
              <ul className="b-inclui">
                {v.oferta.linhas.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
              <Cta href={url} texto={compartilhado.ctaOferta} />
            </div>
          </div>
        </section>

        <section className="b-sec">
          <h2 className="b-sec-tit">Os três complementos</h2>
          {v.bumps.intro ? <p className="b-p">{v.bumps.intro}</p> : null}
          <div className="b-grade">
            {v.bumps.itens.map((b) => (
              <div className="b-cel b-item" key={b.nome}>
                <h3 className="b-item-tit">{b.nome}</h3>
                <p className="b-dia-n" style={{ marginTop: 6 }}>
                  {b.preco}
                </p>
                <p className="b-item-txt">{inline(b.texto, `bp-${b.nome}`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="b-sec">
          <h2 className="b-sec-tit">O que é escasso aqui</h2>
          <div className="b-cel">
            <div className="b-col">
              <Nos nos={v.escassez.nos} k="esc" />
            </div>
          </div>
        </section>

        <section className="b-sec">
          <h2 className="b-sec-tit">Garantia</h2>
          <div className="b-cel">
            <p className="b-garantia">{inline(v.garantia, "gar")}</p>
          </div>
        </section>

        <section className="b-sec">
          <h2 className="b-sec-tit">O que você vai perguntar</h2>
          <div className="b-faq">
            {v.faq.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <div className="b-faq-r">{f.a}</div>
              </details>
            ))}
          </div>
        </section>

        <section className="b-fecho">
          <div className="b-col">
            <Nos nos={v.fecho.nos} k="fecho" />
          </div>
          {v.fecho.foto ? (
            <div style={{ maxWidth: 420, margin: "24px 0" }}>
              <Foto img={v.fecho.foto} />
            </div>
          ) : null}
          <Cta href={url} texto={compartilhado.ctaTopo} />
        </section>

        <footer className="b-rodape">
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

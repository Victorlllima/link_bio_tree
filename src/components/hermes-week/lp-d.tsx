/* ============================================================================
 *  LP D · ESCADA (brutalist)
 * ----------------------------------------------------------------------------
 *  ÂNGULO: a provocação. A copy diz "você parou no degrau 1". Então a página
 *  inteira é uma escada: cada degrau é uma faixa que entra mais recuada que a
 *  anterior, com o número em corpo gigante, e o degrau 3 é o único vermelho,
 *  porque é pra lá que a semana leva. O ritmo da escada contamina o resto: as
 *  seções seguintes também avançam, nunca respiram, e vão encaixando até o
 *  preço.
 *
 *  PALETA   osso #E8E6DF · tinta #0A0A0A · bloco invertido #0A0A0A ·
 *           cinza #4A4A46 · sinal #FF3B10 (só no degrau 3, no preço e no CTA)
 *  TIPO     Archivo Black (um peso só, gigante, caixa alta, tracking negativo)
 *           contra Space Grotesk 300. O contraste é 900 vs 300, sem meio-termo.
 *  RITMO    brutal. Borda de 3px, zero raio, sombra dura deslocada 8px, blocos
 *           encostados sem margem entre si.
 *  CTA      bloco preto de largura total com sombra vermelha dura. No hover
 *           inverte para vermelho.
 *
 *  DESTAQUE ÚNICO: os quatro degraus entrando pela esquerda em stagger de
 *  100ms, cada um mais recuado. Nada mais na página se move.
 *
 *  Origem das técnicas: scroll-reveal-libraries (fade-left, stagger, once) e
 *  gsap-scrolltrigger (gatilho a 80% da tela, ease padrão). Sem runtime: o
 *  padrão dos dois é IntersectionObserver + classe + transition, e é isso que
 *  está em `movimento.tsx`.
 * ==========================================================================*/

import { Archivo_Black, Space_Grotesk } from "next/font/google";
import { checkoutUrl } from "./checkout";
import { ImgReal, inline, legendaImg, PAPEL_IMG, Pixel } from "./comum";
import { compartilhado, type Bloco, type Img, type No, type Variante } from "./conteudo";
import { Revela } from "./movimento";

const black = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--d-black", display: "swap" });
const grot = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  variable: "--d-grot",
  display: "swap",
});

const CSS = `
.d{
  --osso:#E8E6DF; --tinta:#0A0A0A; --cinza:#4A4A46; --sinal:#FF3B10; --osso2:#DCDAD1;
  --black:var(--d-black),Impact,sans-serif;
  --grot:var(--d-grot),system-ui,sans-serif;
  background:var(--osso);color:var(--tinta);font-family:var(--grot);font-weight:300;
  -webkit-font-smoothing:antialiased;
}
.d-wrap{max-width:1120px;margin:0 auto;padding:0 14px 0;}
@media(min-width:760px){.d-wrap{padding:0 26px 0;}}
.d-col{max-width:66ch;}

/* ---------- hero ---------- */
.d-hero{padding:44px 0 40px;}
.d-eyebrow{
  display:inline-block;font-family:var(--grot);font-weight:700;font-size:.7rem;
  letter-spacing:.18em;text-transform:uppercase;background:var(--tinta);color:var(--osso);
  padding:8px 12px;margin:0 0 26px;
}
.d-h1{
  font-family:var(--black);font-weight:400;text-transform:uppercase;
  font-size:clamp(2.05rem,8.6vw,5rem);line-height:.93;letter-spacing:-.045em;
  margin:0 0 22px;
}
.d-h1 b{font-weight:400;color:var(--sinal);}
.d-deck{font-size:1.14rem;line-height:1.55;font-weight:300;max-width:44ch;margin:0 0 30px;}
.d-fatos{
  display:flex;flex-wrap:wrap;gap:0;margin:26px 0 0;padding:0;list-style:none;
  border-top:3px solid var(--tinta);border-bottom:3px solid var(--tinta);
}
.d-fatos li{
  font-family:var(--grot);font-weight:700;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;
  padding:11px 16px 11px 0;
}
.d-fatos li+li{border-left:3px solid var(--tinta);padding-left:16px;}

/* ---------- seção ---------- */
.d-sec{padding:44px 0;border-top:3px solid var(--tinta);}
.d-sec-tit{
  font-family:var(--black);font-weight:400;text-transform:uppercase;
  font-size:clamp(1.5rem,5.4vw,2.6rem);line-height:1;letter-spacing:-.04em;margin:0 0 24px;
}
.d-rot{
  font-family:var(--grot);font-weight:700;font-size:.68rem;letter-spacing:.2em;
  text-transform:uppercase;color:var(--cinza);margin:0 0 16px;
}
.d-p{font-size:1.06rem;line-height:1.62;margin:0 0 1em;font-weight:300;}
.d-p b{font-weight:700;}
.d-forte{
  font-family:var(--black);font-weight:400;text-transform:uppercase;
  font-size:clamp(1.15rem,3.6vw,1.7rem);line-height:1.08;letter-spacing:-.03em;margin:1.1em 0;
}
.d-cita{
  margin:1.3em 0;padding:20px;background:var(--tinta);color:var(--osso);
  font-size:1.02rem;line-height:1.55;font-weight:300;
  box-shadow:8px 8px 0 var(--sinal);
}

/* ---------- A ESCADA ---------- */
.d-escada{margin:26px 0 0;}
.d-degrau{
  border:3px solid var(--tinta);background:var(--osso);padding:18px;margin:0 0 -3px 0;
  display:grid;grid-template-columns:auto minmax(0,1fr);gap:14px;align-items:start;
  transition:opacity .7s cubic-bezier(.4,0,.2,1),transform .7s cubic-bezier(.4,0,.2,1);
}
@media(min-width:700px){
  .d-degrau{padding:22px 26px;gap:24px;}
  .d-degrau[data-n="2"]{margin-left:54px;}
  .d-degrau[data-n="3"]{margin-left:108px;}
  .d-degrau[data-n="4"]{margin-left:162px;}
}
@media(max-width:699px){
  .d-degrau[data-n="2"]{margin-left:14px;}
  .d-degrau[data-n="3"]{margin-left:28px;}
  .d-degrau[data-n="4"]{margin-left:42px;}
}
.d-degrau-n{
  font-family:var(--black);font-weight:400;font-size:clamp(2.2rem,9vw,3.6rem);line-height:.82;
  letter-spacing:-.06em;color:var(--osso2);
}
.d-degrau-t{font-family:var(--black);font-weight:400;text-transform:uppercase;font-size:1.02rem;letter-spacing:-.02em;margin:0 0 6px;}
.d-degrau-x{font-size:.99rem;line-height:1.55;margin:0;font-weight:300;}
.d-degrau[data-aqui="sim"]{background:var(--sinal);color:#fff;box-shadow:10px 10px 0 var(--tinta);position:relative;z-index:2;}
.d-degrau[data-aqui="sim"] .d-degrau-n{color:rgba(255,255,255,.5);}
.d-marca{
  display:inline-block;font-family:var(--grot);font-weight:700;font-size:.64rem;letter-spacing:.18em;
  text-transform:uppercase;background:var(--tinta);color:#fff;padding:5px 9px;margin:10px 0 0;
}
.d-escada[data-rv="arm"] .d-degrau{opacity:0;transform:translateX(-26px);}
.d-escada[data-rv="on"] .d-degrau{opacity:1;transform:none;}
.d-escada[data-rv="on"] .d-degrau:nth-child(1){transition-delay:0ms;}
.d-escada[data-rv="on"] .d-degrau:nth-child(2){transition-delay:100ms;}
.d-escada[data-rv="on"] .d-degrau:nth-child(3){transition-delay:200ms;}
.d-escada[data-rv="on"] .d-degrau:nth-child(4){transition-delay:300ms;}

/* ---------- imagem ---------- */
.d-img{margin:26px 0;border:3px solid var(--tinta);background:var(--osso2);padding:0;}
.d-img[data-f="celular"]{max-width:280px;}
.d-img[data-f="retrato"]{max-width:340px;}
.d-img[data-f="quadrado"]{max-width:320px;}
.d-img-cab{
  display:flex;justify-content:space-between;gap:12px;background:var(--tinta);color:var(--osso);
  font-family:var(--grot);font-weight:700;font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;
  padding:8px 12px;
}
.d-img-papel{color:var(--sinal);}
.d-img-caixa{padding:16px;min-height:130px;display:flex;align-items:center;}
.d-img[data-f="celular"] .d-img-caixa{min-height:200px;}
.d-img[data-f="retrato"] .d-img-caixa{min-height:190px;}
.d-img-txt{margin:0;font-size:.9rem;line-height:1.5;font-weight:300;}
/* a moldura de 3px da .d-img já é a borda da foto: entra colada, sem padding */
.d-img-foto{display:block;}

/* ---------- os dias ---------- */
.d-dias{margin:22px 0 0;border-top:3px solid var(--tinta);}
.d-dia{display:grid;grid-template-columns:110px minmax(0,1fr);gap:12px;padding:14px 0;border-bottom:3px solid var(--tinta);}
.d-dia dt{font-family:var(--black);font-weight:400;text-transform:uppercase;font-size:.86rem;letter-spacing:-.01em;}
.d-dia dd{margin:0;font-size:1rem;line-height:1.5;font-weight:300;}

/* ---------- oferta ---------- */
.d-oferta{background:var(--tinta);color:var(--osso);padding:32px 20px;margin:0;box-shadow:12px 12px 0 var(--sinal);}
@media(min-width:760px){.d-oferta{padding:44px 40px;}}
.d-produto{font-family:var(--black);font-weight:400;text-transform:uppercase;font-size:clamp(1.4rem,5vw,2.2rem);line-height:1;letter-spacing:-.04em;margin:0;}
.d-preco{font-family:var(--black);font-weight:400;font-size:clamp(4rem,20vw,8rem);line-height:.86;letter-spacing:-.07em;color:var(--sinal);margin:14px 0 22px;}
.d-inclui{list-style:none;margin:0 0 30px;padding:0;}
.d-inclui li{font-size:1.02rem;line-height:1.45;padding:12px 0;border-top:1px solid #333;font-weight:300;}
.d-oferta .d-cta{background:var(--sinal);color:var(--tinta);box-shadow:8px 8px 0 var(--osso);}
.d-oferta .d-cta:hover{background:var(--osso);color:var(--tinta);}

/* ---------- bumps ---------- */
.d-bumps{display:grid;gap:0;}
.d-bump{border:3px solid var(--tinta);margin-bottom:-3px;padding:18px;}
.d-bump-cab{display:flex;justify-content:space-between;gap:14px;align-items:baseline;margin-bottom:8px;}
.d-bump-nome{font-family:var(--black);font-weight:400;text-transform:uppercase;font-size:.96rem;letter-spacing:-.02em;}
.d-bump-preco{font-family:var(--black);font-weight:400;font-size:1.1rem;color:var(--sinal);}
.d-bump-txt{font-size:.96rem;line-height:1.55;margin:0;font-weight:300;}

/* ---------- garantia / faq / rodapé ---------- */
.d-garantia{font-family:var(--black);font-weight:400;text-transform:uppercase;font-size:clamp(1.2rem,4.4vw,1.9rem);line-height:1.05;letter-spacing:-.035em;margin:0;}
.d-garantia b{color:var(--sinal);font-weight:400;}
.d-faq details{border-top:3px solid var(--tinta);}
.d-faq details:last-child{border-bottom:3px solid var(--tinta);}
.d-faq summary{cursor:pointer;list-style:none;padding:16px 30px 16px 0;position:relative;font-family:var(--black);font-weight:400;text-transform:uppercase;font-size:.9rem;letter-spacing:-.015em;}
.d-faq summary::-webkit-details-marker{display:none;}
.d-faq summary::after{content:"+";position:absolute;right:0;top:14px;color:var(--sinal);font-family:var(--black);}
.d-faq details[open] summary::after{content:"–";}
.d-faq-r{padding:0 0 18px;font-size:1rem;line-height:1.62;font-weight:300;}
.d-rodape{background:var(--tinta);color:var(--osso);margin-top:0;padding:26px 14px 34px;font-family:var(--grot);font-weight:300;font-size:.74rem;line-height:1.9;}
@media(min-width:760px){.d-rodape{padding:26px 26px 40px;}}
.d-rodape-in{max-width:1120px;margin:0 auto;}
.d-rodape a{color:var(--sinal);}

/* ---------- CTA ---------- */
.d-cta{
  display:block;width:100%;text-align:center;background:var(--tinta);color:var(--osso);
  font-family:var(--black);font-weight:400;text-transform:uppercase;font-size:clamp(.92rem,3.4vw,1.14rem);
  letter-spacing:-.015em;text-decoration:none;padding:22px 18px;border:none;
  box-shadow:8px 8px 0 var(--sinal);
  transition:background .16s ease,color .16s ease,box-shadow .16s ease,transform .16s ease;
}
.d-cta:hover{background:var(--sinal);color:var(--tinta);box-shadow:8px 8px 0 var(--tinta);transform:translate(-2px,-2px);}
.d-cta:focus-visible{outline:3px solid var(--sinal);outline-offset:4px;}
.d-cta-linha{margin:30px 0 0;}

@media (prefers-reduced-motion: reduce){
  .d *,.d *::before,.d *::after{transition-duration:.01ms !important;animation-duration:.01ms !important;}
}
`;

/* ---------- pedaços ------------------------------------------------------ */

function Foto({ img, prioridade = false }: { img: Img; prioridade?: boolean }) {
  return (
    <figure className="d-img" data-f={img.formato}>
      <figcaption className="d-img-cab">
        <span>{legendaImg(img)}</span>
        <span className="d-img-papel">{PAPEL_IMG[img.tipo]}</span>
      </figcaption>
      {img.src ? (
        <ImgReal
          img={img}
          classe="d-img-foto"
          sizes={img.formato === "wide" ? "(max-width:780px) 92vw, 700px" : "(max-width:780px) 86vw, 340px"}
          prioridade={prioridade}
        />
      ) : (
        <div className="d-img-caixa">
          <p className="d-img-txt">{img.c}</p>
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
        if (n.t === "img") return <Foto key={kk} img={n} />;
        if (n.t === "cita")
          return (
            <blockquote key={kk} className="d-cita">
              {inline(n.c, kk)}
            </blockquote>
          );
        if (n.t === "forte")
          return (
            <p key={kk} className="d-forte">
              {inline(n.c, kk)}
            </p>
          );
        return (
          <p key={kk} className="d-p">
            {inline(n.c, kk)}
          </p>
        );
      })}
    </>
  );
}

/** A dobra da escada vira escada de verdade. Os quatro degraus saem da copy:
 *  cada um é um parágrafo que começa com "**Degrau N: nome.**". */
function Escada({ b }: { b: Bloco }) {
  const degraus: { n: string; titulo: string; texto: string }[] = [];
  const soltos: No[] = [];

  for (const no of b.nos) {
    const m = no.t === "p" ? no.c.match(/^\*\*Degrau (\d): ([^*]+?)\.\*\*\s*([\s\S]*)$/) : null;
    if (m) degraus.push({ n: m[1] as string, titulo: m[2] as string, texto: m[3] as string });
    else soltos.push(no);
  }

  const antes = soltos.slice(0, 1);
  const depois = soltos.slice(1);

  return (
    <>
      <div className="d-col">
        <Nos nos={antes} k="esc-a" />
      </div>
      <Revela className="d-escada" como="escada" limiar={0.12}>
        {degraus.map((d) => (
          <div className="d-degrau" data-n={d.n} data-aqui={d.n === "3" ? "sim" : "nao"} key={d.n}>
            <span className="d-degrau-n" aria-hidden="true">
              {d.n}
            </span>
            <div>
              <h3 className="d-degrau-t">{d.titulo}</h3>
              <p className="d-degrau-x">{d.texto}</p>
              {d.n === "3" ? <span className="d-marca">nessa semana você vai pra cá</span> : null}
            </div>
          </div>
        ))}
      </Revela>
      <div className="d-col" style={{ marginTop: 30 }}>
        <Nos nos={depois} k="esc-d" />
      </div>
    </>
  );
}

/* ========================================================================= */

export function LpD({ v }: { v: Variante }) {
  const url = checkoutUrl(v.id);
  const escada = v.antes.find((b) => b.tag === "a escada");
  const resto = v.antes.filter((b) => b !== escada);

  return (
    <div className={`d ${black.variable} ${grot.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Pixel v={v.id} />

      <main className="d-wrap">
        <header className="d-hero">
          <p className="d-eyebrow">{compartilhado.evento}</p>
          <h1 className="d-h1">{inline(v.hero.h1, "h1")}</h1>
          <p className="d-deck">{v.hero.deck}</p>
          <a className="d-cta hw-acao" href={url}>
            {compartilhado.ctaTopo}
          </a>
          <ul className="d-fatos">
            <li>5 aulas gravadas</li>
            <li>segunda a sexta</li>
            <li>garantia de 7 dias</li>
          </ul>
          <Foto img={v.hero.foto} prioridade />
        </header>

        {escada ? (
          <section className="d-sec">
            <h2 className="d-sec-tit">A escada</h2>
            <Escada b={escada} />
          </section>
        ) : null}

        {resto.map((b, i) => (
          <section className="d-sec" key={`r${i}`}>
            <p className="d-rot">{b.tag}</p>
            <div className="d-col">
              <Nos nos={b.nos} k={`r${i}`} />
            </div>
          </section>
        ))}

        <section className="d-sec">
          <h2 className="d-sec-tit">O que você sai com</h2>
          <div className="d-col">
            <p className="d-p">{v.saiCom.intro}</p>
          </div>
          <dl className="d-dias">
            {compartilhado.dias.map((d) => (
              <div className="d-dia" key={d.dia}>
                <dt>{d.dia}</dt>
                <dd>{d.saida}</dd>
              </div>
            ))}
          </dl>
          <div className="d-col" style={{ marginTop: 22 }}>
            <p className="d-p">{v.saiCom.sabado}</p>
            {v.saiCom.extra ? <p className="d-p">{inline(v.saiCom.extra, "extra")}</p> : null}
          </div>
          <div className="d-cta-linha">
            <a className="d-cta hw-acao" href={url}>
              {compartilhado.ctaTopo}
            </a>
          </div>
        </section>

        {v.entre.map((b, i) => (
          <section className="d-sec" key={`e${i}`}>
            <p className="d-rot">{b.tag}</p>
            <div className="d-col">
              <Nos nos={b.nos} k={`e${i}`} />
            </div>
          </section>
        ))}

        <section className="d-sec">
          <h2 className="d-sec-tit">A prova</h2>
          <div className="d-col">
            <Nos nos={v.prova.nos} k="prova" />
          </div>
        </section>

        <section className="d-sec">
          <h2 className="d-sec-tit">Pra quem não é</h2>
          <div className="d-col">
            <Nos nos={v.praQuemNaoE.nos} k="pq" />
          </div>
        </section>

        <section className="d-sec">
          <div className="d-oferta">
            <h2 className="d-produto">{compartilhado.produto}</h2>
            <p className="d-preco">{compartilhado.preco}</p>
            <ul className="d-inclui">
              {v.oferta.linhas.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
            <a className="d-cta hw-acao" href={url}>
              {compartilhado.ctaOferta}
            </a>
          </div>
        </section>

        <section className="d-sec">
          <h2 className="d-sec-tit">Os três complementos</h2>
          {v.bumps.intro ? (
            <div className="d-col">
              <p className="d-p">{v.bumps.intro}</p>
            </div>
          ) : null}
          <div className="d-bumps">
            {v.bumps.itens.map((b) => (
              <div className="d-bump" key={b.nome}>
                <div className="d-bump-cab">
                  <span className="d-bump-nome">{b.nome}</span>
                  <span className="d-bump-preco">{b.preco}</span>
                </div>
                <p className="d-bump-txt">{inline(b.texto, `bp-${b.nome}`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="d-sec">
          <h2 className="d-sec-tit">O que é escasso aqui</h2>
          <div className="d-col">
            <Nos nos={v.escassez.nos} k="esc" />
          </div>
        </section>

        <section className="d-sec">
          <h2 className="d-sec-tit">Garantia</h2>
          <p className="d-garantia">{inline(v.garantia, "gar")}</p>
        </section>

        <section className="d-sec">
          <h2 className="d-sec-tit">O que você vai perguntar</h2>
          <div className="d-faq">
            {v.faq.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <div className="d-faq-r">{f.a}</div>
              </details>
            ))}
          </div>
        </section>

        <section className="d-sec">
          <div className="d-col">
            <Nos nos={v.fecho.nos} k="fecho" />
          </div>
          {v.fecho.foto ? <Foto img={v.fecho.foto} /> : null}
          <div className="d-cta-linha">
            <a className="d-cta hw-acao" href={url}>
              {compartilhado.ctaTopo}
            </a>
          </div>
        </section>
      </main>

      <footer className="d-rodape">
        <div className="d-rodape-in">
          <div>{compartilhado.eventoCurto}</div>
          <div>
            {compartilhado.rodape.razao} · {compartilhado.rodape.cnpj} ·{" "}
            <a href={`mailto:${compartilhado.rodape.suporte}`}>{compartilhado.rodape.suporte}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

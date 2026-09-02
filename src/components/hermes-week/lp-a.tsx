/* ============================================================================
 *  LP A · MADRUGADA
 * ----------------------------------------------------------------------------
 *  ÂNGULO: a cena. A copy começa "ontem à noite, antes de dormir" e termina
 *  "segunda que vem às 20h". A página faz o mesmo trajeto: entra preta de
 *  madrugada e sai num azul de amanhecer. Esse gradiente é a assinatura, e ele
 *  não custa um byte de JS.
 *
 *  PALETA   noite #05070B · painel #0B1017 · linha #1A2331 · tinta #C7D2DF ·
 *           apagado #5E7183 · menta #93E7BC (o único acento)
 *  TIPO     JetBrains Mono dominante, inclusive na headline (é a página com
 *           cara de terminal) + IBM Plex Sans só no texto corrido, porque mono
 *           em parágrafo longo cansa
 *  RITMO    coluna estreita (600px), calha de log à esquerda com a etiqueta
 *           funcional de cada dobra, hairlines frias separando
 *  CTA      retângulo de borda menta com prompt ">" na frente. Zero raio.
 *
 *  DESTAQUE ÚNICO: o painel agent.log imprimindo as linhas ao entrar na tela.
 *  É o último argumento antes do preço, então puxar o olho pra ele empurra pro
 *  CTA seguinte. Fora disso, só as capturas entram com um fade discreto.
 * ==========================================================================*/

import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { checkoutUrl } from "./checkout";
import { ImgReal, inline, legendaImg, PAPEL_IMG, Pixel } from "./comum";
import { compartilhado, type Bloco, type Img, type No, type Variante } from "./conteudo";
import { Revela } from "./movimento";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--a-mono", display: "swap" });
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "600"], variable: "--a-sans", display: "swap" });

const CSS = `
.a{
  --noite:#05070B; --painel:#0B1017; --linha:#1A2331; --tinta:#C7D2DF;
  --apagado:#5E7183; --menta:#93E7BC; --menta-fraca:rgba(147,231,188,.14);
  --mono:var(--a-mono),ui-monospace,"SFMono-Regular",Menlo,monospace;
  --sans:var(--a-sans),system-ui,sans-serif;
  background:var(--noite); color:var(--tinta); font-family:var(--sans);
  -webkit-font-smoothing:antialiased;
}
/* o trajeto da noite para a manhã. fixo, sem JS, sem custo */
.a-ceu{
  background:linear-gradient(180deg,#05070B 0%,#05070B 44%,#070D15 60%,#0C1825 76%,#152232 89%,#1C2B3B 100%);
}
.a-wrap{max-width:1000px;margin:0 auto;padding:0 20px 96px;}
.a-col{max-width:600px;}

/* ---------- hero ---------- */
.a-hero{padding:64px 0 40px;max-width:640px;}
.a-eyebrow{font-family:var(--mono);font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--menta);margin:0 0 26px;}
.a-h1{
  font-family:var(--mono);font-weight:700;
  font-size:clamp(1.85rem,6.2vw,3.15rem);line-height:1.1;letter-spacing:-.035em;
  color:#EAF1F8;margin:0 0 22px;
}
.a-h1 b{color:var(--menta);font-weight:700;}
.a-deck{font-size:1.06rem;line-height:1.62;color:var(--apagado);margin:0 0 32px;max-width:34em;}
.a-fatos{display:flex;flex-wrap:wrap;gap:6px 18px;font-family:var(--mono);font-size:.72rem;color:var(--apagado);margin:22px 0 0;list-style:none;padding:0;}
.a-fatos li::before{content:"· ";color:var(--menta);}

/* ---------- calha de log ---------- */
.a-bloco{display:grid;grid-template-columns:1fr;gap:10px;padding:38px 0;border-top:1px solid var(--linha);}
.a-tag{font-family:var(--mono);font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;color:var(--apagado);}
@media(min-width:900px){
  .a-bloco{grid-template-columns:168px minmax(0,1fr);gap:32px;}
  .a-tag{text-align:right;padding-top:.42rem;}
}
.a-p{font-size:1.0625rem;line-height:1.74;margin:0 0 1.05em;}
.a-p b{color:#EAF1F8;font-weight:600;}
.a-forte{font-family:var(--mono);font-weight:700;font-size:1.08rem;line-height:1.5;color:#EAF1F8;margin:0 0 1.05em;letter-spacing:-.01em;}
.a-cita{
  margin:0 0 1.2em;padding:2px 0 2px 18px;border-left:2px solid var(--menta-fraca);
  font-style:italic;color:var(--apagado);font-size:1.02rem;line-height:1.66;
}

/* ---------- placeholder de imagem ---------- */
.a-img{margin:26px 0;border:1px dashed #2A3949;background:rgba(147,231,188,.02);padding:16px;}
.a-img[data-f="celular"]{max-width:290px;}
.a-img[data-f="retrato"]{max-width:360px;}
.a-img[data-f="quadrado"]{max-width:320px;}
.a-img-cab{display:flex;justify-content:space-between;gap:12px;font-family:var(--mono);font-size:.64rem;letter-spacing:.14em;text-transform:uppercase;color:var(--menta);margin-bottom:10px;}
.a-img-papel{color:var(--apagado);}
.a-img-caixa{
  display:flex;align-items:center;min-height:112px;padding:14px;
  border:1px solid var(--linha);background:#080D14;
}
.a-img[data-f="celular"] .a-img-caixa{min-height:210px;}
.a-img[data-f="retrato"] .a-img-caixa{min-height:200px;}
.a-img[data-f="wide"] .a-img-caixa{min-height:150px;}
.a-img-txt{font-size:.86rem;line-height:1.55;color:var(--apagado);margin:0;}
/* pronta: some a moldura tracejada (que sinaliza buraco) e entra a borda de verdade */
.a-img[data-pronta="sim"]{border:1px solid var(--linha);background:#080D14;}
.a-img[data-pronta="sim"][data-f="retrato"]{max-width:340px;}
.a-img[data-pronta="sim"][data-f="quadrado"]{max-width:340px;}
.a-img-foto{display:block;border:1px solid var(--linha);background:#080D14;}
.a-fade{opacity:1;transform:none;transition:opacity .6s cubic-bezier(.4,0,.2,1),transform .6s cubic-bezier(.4,0,.2,1);}
.a-fade[data-rv="arm"]{opacity:0;transform:translateY(8px);}
.a-fade[data-rv="on"]{opacity:1;transform:none;}

/* ---------- a semana ---------- */
.a-sec{padding:44px 0;border-top:1px solid var(--linha);}
.a-tit{font-family:var(--mono);font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--menta);margin:0 0 22px;font-weight:400;}
.a-dias{margin:22px 0 0;}
.a-dia{display:grid;grid-template-columns:88px minmax(0,1fr);gap:14px;padding:13px 0;border-top:1px solid var(--linha);}
.a-dia:last-child{border-bottom:1px solid var(--linha);}
.a-dia dt{font-family:var(--mono);font-size:.78rem;color:var(--menta);padding-top:.1rem;}
.a-dia dd{margin:0;font-size:.98rem;line-height:1.6;}

/* ---------- o destaque: o log imprimindo ---------- */
.a-log{border:1px solid #22303F;background:#080D14;padding:0;margin:8px 0 0;}
.a-log-barra{
  display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid #22303F;
  font-family:var(--mono);font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--apagado);
}
.a-log-pt{width:7px;height:7px;background:var(--menta);display:inline-block;}
.a-log-corpo{padding:20px 18px 8px;}
.a-log-corpo .a-p:last-child,.a-log-corpo .a-forte:last-child{margin-bottom:1em;}
.a-log-corpo>*{transition:opacity .5s cubic-bezier(.4,0,.2,1),transform .5s cubic-bezier(.4,0,.2,1);}
.a-log[data-rv="arm"] .a-log-corpo>*{opacity:0;transform:translateY(6px);}
.a-log[data-rv="on"] .a-log-corpo>*{opacity:1;transform:none;}
.a-log[data-rv="on"] .a-log-corpo>*:nth-child(1){transition-delay:0ms;}
.a-log[data-rv="on"] .a-log-corpo>*:nth-child(2){transition-delay:110ms;}
.a-log[data-rv="on"] .a-log-corpo>*:nth-child(3){transition-delay:220ms;}
.a-log[data-rv="on"] .a-log-corpo>*:nth-child(4){transition-delay:330ms;}
.a-log[data-rv="on"] .a-log-corpo>*:nth-child(5){transition-delay:440ms;}
.a-log[data-rv="on"] .a-log-corpo>*:nth-child(6){transition-delay:550ms;}
.a-log[data-rv="on"] .a-log-corpo>*:nth-child(7){transition-delay:660ms;}

/* ---------- oferta ---------- */
.a-oferta{border:1px solid var(--menta);padding:30px 22px;margin:44px 0 0;background:rgba(147,231,188,.03);}
.a-produto{font-family:var(--mono);font-weight:700;font-size:1.22rem;line-height:1.3;color:#EAF1F8;margin:0 0 6px;letter-spacing:-.02em;}
.a-preco{font-family:var(--mono);font-weight:700;font-size:clamp(2.6rem,11vw,3.6rem);line-height:1;color:var(--menta);margin:10px 0 20px;letter-spacing:-.04em;}
.a-inclui{list-style:none;margin:0 0 26px;padding:0;}
.a-inclui li{font-size:.98rem;line-height:1.6;padding:9px 0 9px 20px;border-top:1px solid var(--linha);position:relative;}
.a-inclui li::before{content:"·";position:absolute;left:4px;color:var(--menta);}

/* ---------- bumps ---------- */
.a-bump{border-top:1px solid var(--linha);padding:18px 0;}
.a-bump-cab{display:flex;justify-content:space-between;align-items:baseline;gap:14px;margin-bottom:7px;}
.a-bump-nome{font-family:var(--mono);font-size:.94rem;color:#EAF1F8;}
.a-bump-preco{font-family:var(--mono);font-size:.94rem;color:var(--menta);font-variant-numeric:tabular-nums;}
.a-bump-txt{font-size:.94rem;line-height:1.62;color:var(--apagado);margin:0;}
.a-bump-txt b{color:var(--tinta);font-weight:600;}

/* ---------- garantia / faq ---------- */
.a-garantia{font-family:var(--mono);font-size:1.02rem;line-height:1.6;color:#EAF1F8;margin:0;}
.a-garantia b{color:var(--menta);}
.a-faq details{border-top:1px solid var(--linha);}
.a-faq details:last-child{border-bottom:1px solid var(--linha);}
.a-faq summary{
  cursor:pointer;list-style:none;padding:16px 26px 16px 0;position:relative;
  font-family:var(--mono);font-size:.95rem;color:#EAF1F8;
}
.a-faq summary::-webkit-details-marker{display:none;}
.a-faq summary::after{content:"+";position:absolute;right:2px;top:15px;color:var(--menta);}
.a-faq details[open] summary::after{content:"–";}
.a-faq-r{padding:0 0 18px;font-size:.98rem;line-height:1.7;color:var(--apagado);}

/* ---------- fecho e rodapé ---------- */
.a-fecho{padding:56px 0 0;border-top:1px solid var(--linha);}
.a-rodape{margin-top:64px;padding-top:22px;border-top:1px solid var(--linha);font-family:var(--mono);font-size:.7rem;line-height:1.9;color:var(--apagado);}
.a-rodape a{color:var(--menta);}

/* ---------- CTA ---------- */
.a-cta{
  display:inline-block;font-family:var(--mono);font-size:.82rem;font-weight:700;
  letter-spacing:.14em;text-transform:uppercase;color:var(--menta);text-decoration:none;
  border:1px solid var(--menta);padding:17px 24px;background:transparent;
  transition:background .2s ease,color .2s ease;
}
.a-cta::before{content:"> ";color:var(--apagado);}
.a-cta:hover{background:var(--menta);color:#05070B;}
.a-cta:hover::before{color:#05070B;}
.a-cta:focus-visible{outline:2px solid var(--menta);outline-offset:3px;}

@media (prefers-reduced-motion: reduce){
  .a *,.a *::before,.a *::after{transition-duration:.01ms !important;animation-duration:.01ms !important;}
}
`;

/* ---------- pedaços ------------------------------------------------------ */

function Foto({ img, prioridade = false }: { img: Img; prioridade?: boolean }) {
  const pronta = Boolean(img.src);
  return (
    <Revela className="a-fade" como="foto">
      <figure className="a-img" data-f={img.formato} data-pronta={pronta ? "sim" : "nao"}>
        <figcaption className="a-img-cab">
          <span>{legendaImg(img)}</span>
          <span className="a-img-papel">{PAPEL_IMG[img.tipo]}</span>
        </figcaption>
        {pronta ? (
          <ImgReal
            img={img}
            classe="a-img-foto"
            sizes={img.formato === "wide" ? "(max-width:760px) 92vw, 720px" : "(max-width:760px) 88vw, 340px"}
            prioridade={prioridade}
          />
        ) : (
          <div className="a-img-caixa">
            <p className="a-img-txt">{img.c}</p>
          </div>
        )}
      </figure>
    </Revela>
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
            <blockquote key={kk} className="a-cita">
              {inline(n.c, kk)}
            </blockquote>
          );
        if (n.t === "forte")
          return (
            <p key={kk} className="a-forte">
              {inline(n.c, kk)}
            </p>
          );
        return (
          <p key={kk} className="a-p">
            {inline(n.c, kk)}
          </p>
        );
      })}
    </>
  );
}

function BlocoLog({ b, k }: { b: Bloco; k: string }) {
  return (
    <section className="a-bloco">
      <span className="a-tag">{b.tag}</span>
      <div className="a-col">
        <Nos nos={b.nos} k={k} />
      </div>
    </section>
  );
}

function Cta({ href }: { href: string }) {
  return (
    <a className="a-cta hw-acao" href={href}>
      {compartilhado.ctaTopo}
    </a>
  );
}

/* ========================================================================= */

export function LpA({ v }: { v: Variante }) {
  const url = checkoutUrl(v.id);

  return (
    <div className={`a ${mono.variable} ${sans.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Pixel v={v.id} />

      <div className="a-ceu">
        <main className="a-wrap">
          <header className="a-hero">
            <p className="a-eyebrow">{compartilhado.evento}</p>
            <h1 className="a-h1">{inline(v.hero.h1, "h1")}</h1>
            <p className="a-deck">{v.hero.deck}</p>
            <Cta href={url} />
            <ul className="a-fatos">
              <li>5 encontros</li>
              <li>segunda a sexta</li>
              <li>garantia de 7 dias</li>
            </ul>
            <Foto img={v.hero.foto} prioridade />
          </header>

          {v.antes.map((b, i) => (
            <BlocoLog key={`a${i}`} b={b} k={`a${i}`} />
          ))}

          <section className="a-bloco">
            <span className="a-tag">a entrega</span>
            <div className="a-col">
              <p className="a-forte">{v.saiCom.intro}</p>
              <dl className="a-dias">
                {compartilhado.dias.map((d) => (
                  <div className="a-dia" key={d.dia}>
                    <dt>{d.dia}</dt>
                    <dd>{d.saida}</dd>
                  </div>
                ))}
              </dl>
              <p className="a-p" style={{ marginTop: 22 }}>
                {v.saiCom.sabado}
              </p>
              {v.saiCom.extra ? <p className="a-p">{inline(v.saiCom.extra, "extra")}</p> : null}
              <Cta href={url} />
            </div>
          </section>

          {v.entre.map((b, i) => (
            <BlocoLog key={`e${i}`} b={b} k={`e${i}`} />
          ))}

          {/* o único momento de destaque da página */}
          <section className="a-bloco">
            <span className="a-tag">{v.prova.tag}</span>
            <div className="a-col">
              <Revela className="a-log" como="log" limiar={0.25}>
                <div className="a-log-barra">
                  <span className="a-log-pt" aria-hidden="true" />
                  agent.log
                </div>
                <div className="a-log-corpo">
                  <Nos nos={v.prova.nos} k="prova" />
                </div>
              </Revela>
            </div>
          </section>

          <BlocoLog b={v.praQuemNaoE} k="pq" />

          <section className="a-sec">
            <div className="a-col">
              <div className="a-oferta">
                <h2 className="a-produto">{compartilhado.produto}</h2>
                <p className="a-preco">{compartilhado.preco}</p>
                <ul className="a-inclui">
                  {v.oferta.linhas.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
                <a className="a-cta hw-acao" href={url}>
                  {compartilhado.ctaOferta}
                </a>
              </div>
            </div>
          </section>

          <section className="a-sec">
            <div className="a-col">
              <h2 className="a-tit">os três complementos</h2>
              {v.bumps.intro ? <p className="a-p">{v.bumps.intro}</p> : null}
              {v.bumps.itens.map((b) => (
                <div className="a-bump" key={b.nome}>
                  <div className="a-bump-cab">
                    <span className="a-bump-nome">{b.nome}</span>
                    <span className="a-bump-preco">{b.preco}</span>
                  </div>
                  <p className="a-bump-txt">{inline(b.texto, `b-${b.nome}`)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="a-sec">
            <div className="a-col">
              <h2 className="a-tit">o que é escasso aqui</h2>
              <Nos nos={v.escassez.nos} k="esc" />
            </div>
          </section>

          <section className="a-sec">
            <div className="a-col">
              <h2 className="a-tit">garantia</h2>
              <p className="a-garantia">{inline(v.garantia, "gar")}</p>
            </div>
          </section>

          <section className="a-sec">
            <div className="a-col">
              <h2 className="a-tit">o que você vai perguntar</h2>
              <div className="a-faq">
                {v.faq.map((f, i) => (
                  <details key={i}>
                    <summary>{f.q}</summary>
                    <div className="a-faq-r">{f.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="a-fecho">
            <div className="a-col">
              <Nos nos={v.fecho.nos} k="fecho" />
              {v.fecho.foto ? <Foto img={v.fecho.foto} /> : null}
              <Cta href={url} />
            </div>
          </section>

          <footer className="a-rodape">
            <div>{compartilhado.eventoCurto}</div>
            <div>
              {compartilhado.rodape.razao} · {compartilhado.rodape.cnpj} ·{" "}
              <a href={`mailto:${compartilhado.rodape.suporte}`}>{compartilhado.rodape.suporte}</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

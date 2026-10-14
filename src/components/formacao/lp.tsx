"use client";

/* ============================================================================
 *  /formacao · LP da Formação Arquiteto de Agentes
 * ----------------------------------------------------------------------------
 *  O hero é um voo por scroll (método do Bart Slodyczka, o mesmo da GenixTech):
 *  1.201 quadros WebP desenhados num canvas preso à tela, mapeados da rolagem
 *  pela linha do tempo de `conteudo.ts`. Todo texto legível é DOM por cima.
 *
 *  · Desktop pede só /voo/d (1280x720). Celular em retrato pede só /voo/m, o
 *    mesmo master recortado em 9:16. Nunca os dois.
 *  · Carregamento perto da posição da rolagem, 6 pedidos por vez, cache com
 *    teto e descarte do que está longe. Ninguém baixa os 1.201 de uma vez.
 *  · No celular, o recorte corta as placas e o título final (são mais largos
 *    que a tela). Por isso o celular repete os dois em texto.
 *  · prefers-reduced-motion: sem sequência; pôster parado e a grade estática.
 * ==========================================================================*/

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  CHECKOUT_FORMACAO,
  DURACAO,
  FPS,
  MODULOS,
  PRECO_FORMACAO,
  SUPORTE,
  TOTAL_AULAS,
  TOTAL_QUADROS,
  TRECHOS,
  type Trecho,
} from "./conteudo";
import { calcularCarrinho, dataCurta, type Carrinho } from "./carrinho";


const VERSAO = "1";
const CACHE_MAX = 360;
const CONCORRENCIA = 6;

const css = `
.fm{--bg:#070809;--fg:#eef0f3;--muted:#a3a9b3;--line:rgba(255,255,255,.13);--glass:rgba(8,10,14,.6);
  --champ:#e9d3a2;background:var(--bg);color:var(--fg);font-family:var(--fm-sans),system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;min-height:100vh}
.fm a{color:inherit}
.fm-mono{font-family:var(--fm-mono),ui-monospace,monospace}
.fm-eyebrow{font-family:var(--fm-mono),monospace;font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted)}
.fm-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:46px;padding:0 20px;border-radius:999px;
  background:var(--champ);color:#14110b!important;font-weight:600;font-size:15px;text-decoration:none;border:0;cursor:pointer;
  transition:transform .15s,filter .15s}
.fm-btn:hover{filter:brightness(1.06)} .fm-btn:active{transform:scale(.98)}
.fm-btn:focus-visible,.fm a:focus-visible,.fm input:focus-visible,.fm summary:focus-visible{outline:2px solid var(--champ);outline-offset:3px}
.fm-btn-sm{min-height:38px;padding:0 15px;font-size:14px}

/* cabeçalho: vidro sobre o voo, sólido depois */
.fm-top{position:fixed;inset:0 0 auto 0;z-index:40;display:flex;align-items:center;justify-content:space-between;gap:12px;
  padding:calc(env(safe-area-inset-top,0px) + 10px) clamp(16px,4vw,40px) 12px;
  background:linear-gradient(to bottom,rgba(7,8,9,.72),rgba(7,8,9,0));border-bottom:1px solid transparent;
  transition:background .3s,border-color .3s,backdrop-filter .3s}
.fm-top.solid{background:rgba(7,8,9,.93);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-bottom-color:var(--line)}
.fm-top img{height:34px;width:auto}
.fm-top-dir{display:flex;align-items:center;gap:14px}
.fm-top-gar{font-size:13px;color:var(--muted)}
@media (max-width:640px){.fm-top-gar{display:none}.fm-top img{height:28px}}

/* voo */
.fm-voo{position:relative}
.fm-palco{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;background:#000}
.fm-palco canvas,.fm-palco .fm-poster{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.fm-scrim{position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(to top,rgba(0,0,0,.74) 0%,rgba(0,0,0,.22) 42%,rgba(0,0,0,0) 66%)}
.fm-hero{position:absolute;left:clamp(16px,5vw,64px);right:16px;bottom:calc(env(safe-area-inset-bottom,0px) + 30px);max-width:640px;
  display:flex;flex-direction:column;gap:14px;transition:opacity .35s}
.fm-h1{margin:0;font-size:clamp(30px,5.4vw,56px);line-height:1.06;font-weight:600;letter-spacing:-.015em;text-wrap:balance}
.fm-deck{margin:0;font-size:clamp(16px,1.6vw,19px);line-height:1.5;color:#d6dae0;max-width:520px}
.fm-status{font-size:14px;color:var(--champ)}
.fm-hero-acoes{display:flex;flex-wrap:wrap;align-items:center;gap:10px 18px}
.fm-pular{font-size:14px;color:var(--muted);text-decoration:underline;text-underline-offset:3px}

.fm-painel{--c:#5fd3e6;position:absolute;left:12px;right:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 14px);
  background:var(--glass);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);
  border:1px solid var(--line);border-top:3px solid var(--c);border-radius:12px;padding:clamp(14px,2.4vh,20px) 18px clamp(12px,1.9vh,16px);max-height:calc(100svh - 84px);overflow:hidden;
  display:flex;flex-direction:column;gap:12px;opacity:0;transform:translateY(8px);transition:opacity .35s,transform .35s;pointer-events:none}
.fm-painel.on{opacity:1;transform:none}
.fm-ph{display:flex;justify-content:space-between;gap:12px;font-family:var(--fm-mono),monospace;font-size:clamp(12px,1.7vh,14px);letter-spacing:.09em;text-transform:uppercase;color:var(--c)}
.fm-painel h2{margin:0;font-size:clamp(19px,3.2vh,25px);line-height:1.2;font-weight:600;text-wrap:balance}
.fm-painel ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:clamp(4px,0.8vh,7px);font-size:clamp(15px,2.35vh,19px);line-height:1.32}
.fm-painel li{display:grid;grid-template-columns:2.1em 1fr;gap:6px;opacity:0;transition:opacity .25s}
.fm-painel li.on{opacity:1} .fm-painel li.off{display:none}
.fm-painel li b{font-family:var(--fm-mono),monospace;font-weight:500;color:var(--c);font-variant-numeric:tabular-nums}
.fm-painel li.dig span::after{content:"▍";color:var(--c);margin-left:2px}
.fm-pg{font-family:var(--fm-mono),monospace;font-size:14px;color:var(--muted)}
@media (min-width:900px){
  .fm-painel{left:auto;right:4vw;bottom:auto;top:50%;transform:translateY(-46%);width:min(900px,60vw);max-height:calc(100vh - 96px);
    padding:clamp(20px,3vh,32px) clamp(24px,2.6vw,40px);gap:clamp(10px,1.6vh,16px)}
  .fm-painel.on{transform:translateY(-50%)}
  .fm-ph{font-size:clamp(13px,1.7vh,16px)}
  .fm-painel h2{font-size:clamp(24px,3.6vh,36px)}
  .fm-painel ol{font-size:clamp(16px,2.55vh,27px);gap:clamp(4px,0.8vh,9px)}
  .fm-pg{font-size:15px}
}
.fm-placa{position:absolute;left:16px;right:16px;top:calc(env(safe-area-inset-top,0px) + 76px);text-align:center;
  font-size:20px;font-weight:500;color:var(--c,#fff);text-shadow:0 0 18px var(--c,#fff);opacity:0;transition:opacity .3s;pointer-events:none}
.fm-placa.on{opacity:1}
.fm-fim{position:absolute;left:16px;right:16px;bottom:calc(env(safe-area-inset-bottom,0px) + 28px);display:flex;flex-direction:column;
  align-items:center;gap:12px;text-align:center;opacity:0;transition:opacity .4s;pointer-events:none}
.fm-fim.on{opacity:1;pointer-events:auto}
.fm-fim-tit{display:none}
.fm-carregando{position:absolute;right:16px;bottom:12px;font-family:var(--fm-mono),monospace;font-size:11px;color:var(--muted)}
@media (min-width:768px){.fm-placa{display:none}}
@media (max-width:767px){.fm-fim-tit{display:block;margin:0 0 6px;font-size:30px;line-height:1.1;font-weight:600;text-shadow:0 0 24px rgba(255,255,255,.35)}
  .fm-fim-tit small{display:block;margin-top:6px;font-size:15px;font-weight:400;color:#d6dae0}
  .fm-fim{top:calc(env(safe-area-inset-top,0px) + 90px);bottom:auto}}

/* resto da página */
.fm-sec{max-width:760px;margin:0 auto;padding:clamp(56px,9vw,96px) clamp(16px,4vw,24px) 0;display:flex;flex-direction:column;gap:16px}
.fm-h2{margin:0;font-size:clamp(26px,3.6vw,38px);line-height:1.12;font-weight:600;letter-spacing:-.01em;text-wrap:balance}
.fm-p{margin:0;font-size:17px;line-height:1.65;color:#cfd3d9;max-width:62ch}
.fm-grade{display:flex;flex-direction:column;border-top:1px solid var(--line)}
.fm-grade details{border-bottom:1px solid var(--line)}
.fm-grade summary{list-style:none;cursor:pointer;display:grid;grid-template-columns:auto 1fr auto;align-items:baseline;gap:14px;padding:16px 2px}
.fm-grade summary::-webkit-details-marker{display:none}
.fm-grade .n{font-family:var(--fm-mono),monospace;font-size:12px;color:var(--c)}
.fm-grade .t{font-size:17px;font-weight:500}
.fm-grade .q{font-family:var(--fm-mono),monospace;font-size:12px;color:var(--muted)}
.fm-grade ol{margin:0 0 18px;padding:0 0 0 26px;display:flex;flex-direction:column;gap:6px;color:#cfd3d9;font-size:15px;line-height:1.45}
.fm-red{display:grid;grid-template-columns:minmax(0,220px) minmax(0,1fr);gap:28px;align-items:center}
.fm-red img{width:100%;height:auto;border-radius:8px}
@media (max-width:640px){.fm-red{grid-template-columns:1fr}.fm-red img{max-width:240px}}
.fm-oferta{border:1px solid var(--line);border-radius:12px;padding:clamp(20px,4vw,32px);display:flex;flex-direction:column;gap:18px;
  background:linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,0))}
.fm-oferta ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px;font-size:16px;color:#d6dae0}
.fm-oferta li{display:grid;grid-template-columns:18px 1fr;gap:8px}
.fm-oferta li::before{content:"";width:7px;height:7px;margin-top:9px;border-radius:2px;background:var(--champ)}
.fm-preco{font-size:clamp(34px,5vw,46px);font-weight:600;font-variant-numeric:tabular-nums}
.fm-gar{font-size:15px;color:var(--muted)}
.fm-form{display:grid;gap:10px}
.fm-form input{width:100%;min-height:46px;padding:0 14px;border-radius:8px;border:1px solid var(--line);background:#0e1013;color:var(--fg);font-size:16px}
.fm-form .ok{color:var(--champ)} .fm-form .erro{color:#ff9a8a}
.fm-faq{display:flex;flex-direction:column;gap:22px}
.fm-faq h3{margin:0 0 6px;font-size:17px;font-weight:600}
.fm-rodape{max-width:760px;margin:0 auto;padding:72px 16px 48px;display:flex;flex-wrap:wrap;gap:8px 20px;font-size:13px;color:var(--muted)}
@media (prefers-reduced-motion:reduce){.fm *{transition:none!important}}
`;

/* ---------- pixel: ViewContent no load, InitiateCheckout no clique -------- */
const pixel = `
(function(){
  var base={content_name:'Formação Arquiteto de Agentes',content_ids:['formacao-arquiteto-de-agentes'],
    content_type:'product',value:${PRECO_FORMACAO},currency:'BRL'};
  var t=0;(function v(){if(typeof fbq!=='undefined'){fbq('track','ViewContent',base);return;}if(++t<20)setTimeout(v,250);})();
  function ligar(){
    var q=new URLSearchParams(location.search);var c=q.get('utm_content')||q.get('sck');
    var bs=document.querySelectorAll('.fm-acao');
    for(var i=0;i<bs.length;i++){
      var h=bs[i].getAttribute('href');
      if(c&&h&&h.indexOf('hotmart')>-1&&h.indexOf('sck=')===-1)bs[i].setAttribute('href',h+'&sck='+('fm-'+c).replace(/[^A-Za-z0-9_-]/g,'').slice(0,100));
      bs[i].addEventListener('click',function(){if(typeof fbq!=='undefined')fbq('track','InitiateCheckout',base);});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ligar);else ligar();
})();`;

const totalVh = (trs: Trecho[]) => trs.reduce((s, x) => s + x.vh, 0);
const urlQuadro = (seq: string, i: number) =>
  `/formacao/voo/${seq}/${String(i + 1).padStart(4, "0")}.webp?v=${VERSAO}`;

export function LpFormacao({ dataInicio, inicial, fontes }: { dataInicio: string; inicial: Carrinho; fontes: string }) {
  const [carrinho, setCarrinho] = useState<Carrinho>(inicial);
  const reduzido = useSyncExternalStore(
    (cb) => {
      const mq = matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  /* a janela muda de estado sozinha às 7h e às 21h, sem recarregar */
  useEffect(() => {
    const at = () => setCarrinho(calcularCarrinho(dataInicio));
    const t0 = setTimeout(at, 0); // a página vem do cache (ISR): confere a hora real já
    const id = setInterval(at, 30_000);
    return () => {
      clearTimeout(t0);
      clearInterval(id);
    };
  }, [dataInicio]);

  const quando = dataCurta(carrinho.abre);
  const ctaHref = carrinho.aberto ? `${CHECKOUT_FORMACAO}?checkoutMode=10&src=lp-formacao` : "#inscricao";
  const ctaTexto = carrinho.aberto ? "Quero entrar na Formação" : "Avise-me quando abrir";
  const status = carrinho.aberto
    ? "Inscrições abertas hoje até as 21h."
    : `Próximas inscrições na ${quando}, das 7h às 21h.`;

  return (
    <div className={`fm ${fontes}`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Topo ctaHref={ctaHref} ctaTexto={ctaTexto} />
      <Voo reduzido={reduzido} status={status} ctaHref={ctaHref} ctaTexto={ctaTexto} />

      <section className="fm-sec" aria-labelledby="pq">
        <span className="fm-eyebrow">Para quem é</span>
        <h2 id="pq" className="fm-h2">Para quem já tem um agente rodando</h2>
        <p className="fm-p">
          Você instalou um agente. Ele responde no Telegram, faz uma tarefa ou outra e para quando o computador
          desliga.
        </p>
        <p className="fm-p">
          Na Formação ele sai da sua máquina e ganha companhia. Cada agente fica com uma função, um confere o
          trabalho do outro, e você sabe quanto isso custa por mês antes de ligar.
        </p>
        <p className="fm-p">
          Se você nunca instalou um agente, comece pela <a href="/hermes-week">Hermes Week</a>. Em cinco encontros
          você sai com o seu instalado e respondendo.
        </p>
      </section>

      <section className="fm-sec" id="grade" aria-labelledby="gr">
        <span className="fm-eyebrow">
          {MODULOS.length} módulos · {TOTAL_AULAS} aulas
        </span>
        <h2 id="gr" className="fm-h2">As {TOTAL_AULAS} aulas</h2>
        <p className="fm-p">A mesma lista das salas do voo, módulo por módulo.</p>
        <div className="fm-grade">
          {MODULOS.map((m) => (
            <details key={m.n} style={{ ["--c" as string]: m.cor }}>
              <summary>
                <span className="n">Módulo {m.n}</span>
                <span className="t">{m.nome}</span>
                <span className="q">{m.aulas.length} aulas</span>
              </summary>
              <ol>
                {m.aulas.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ol>
            </details>
          ))}
        </div>
      </section>

      <section className="fm-sec" aria-labelledby="qe">
        <span className="fm-eyebrow">Quem dá as aulas</span>
        <div className="fm-red">
          <img src="/hermes-week/red-oferta.webp" alt="Red, fundador da RedPro AI Academy" width={1200} height={1200} loading="lazy" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
            <h2 id="qe" className="fm-h2">Red</h2>
            <p className="fm-p">
              Fundador da RedPro AI Academy e Arquiteto de Soluções Agênticas. É quem dá as aulas da Hermes Week e da
              Formação.
            </p>
          </div>
        </div>
      </section>

      <section className="fm-sec" id="inscricao" aria-labelledby="of">
        <div className="fm-oferta">
          <span className="fm-eyebrow">Inscrição</span>
          <h2 id="of" className="fm-h2">Formação Arquiteto de Agentes</h2>
          <ul>
            <li>{MODULOS.length} módulos e {TOTAL_AULAS} aulas</li>
            <li>Acesso pela área de membros da RedPro AI Academy, na Hotmart</li>
            <li>Suporte por e-mail em {SUPORTE}</li>
          </ul>
          <div className="fm-preco">R$ {PRECO_FORMACAO.toLocaleString("pt-BR")}</div>
          {carrinho.aberto ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
              <a className="fm-btn fm-acao" href={ctaHref}>
                {ctaTexto}
              </a>
              <span className="fm-status">As inscrições fecham hoje às 21h.</span>
            </div>
          ) : (
            <ListaEspera quando={quando} />
          )}
          <p className="fm-gar">7 dias de garantia. Pediu, devolvo. Sem pergunta.</p>
        </div>
      </section>

      <section className="fm-sec" aria-labelledby="fq">
        <h2 id="fq" className="fm-h2">Perguntas</h2>
        <div className="fm-faq">
          <div>
            <h3>Preciso ter feito a Hermes Week?</h3>
            <p className="fm-p">
              Ajuda bastante. A Formação parte de quem já tem um agente instalado. Se esse não é o seu caso, a{" "}
              <a href="/hermes-week">Hermes Week</a> é o caminho mais curto até lá.
            </p>
          </div>
          <div>
            <h3>Vou ter algum gasto além do curso?</h3>
            <p className="fm-p">
              Vai. No módulo 2 o agente vai para um servidor (VPS), que tem mensalidade própria, e os modelos de IA
              cobram pelo uso. Uma aula do módulo 2 mostra qual servidor comprar sem pagar mais do que precisa, e a
              última do módulo 4 mostra quanto o squad custa rodando.
            </p>
          </div>
          <div>
            <h3>E se eu entrar e não gostar?</h3>
            <p className="fm-p">Você tem 7 dias. Pediu, devolvo. Sem pergunta.</p>
          </div>
          <div>
            <h3>Quando abrem as inscrições?</h3>
            <p className="fm-p">
              Na segunda depois de cada Hermes Week, das 7h às 21h. A próxima é {quando}.
            </p>
          </div>
        </div>
      </section>

      <footer className="fm-rodape">
        <span>RedPro AI Academy</span>
        <a href="/privacidade">Privacidade</a>
        <a href="/termos">Termos</a>
        <span>{SUPORTE}</span>
      </footer>
      <script dangerouslySetInnerHTML={{ __html: pixel }} />
    </div>
  );
}

function Topo({ ctaHref, ctaTexto }: { ctaHref: string; ctaTexto: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    const voo = document.getElementById("voo");
    if (!el || !voo) return;
    const at = () => {
      const fim = voo.getBoundingClientRect().bottom;
      el.classList.toggle("solid", fim <= el.offsetHeight);
    };
    at();
    addEventListener("scroll", at, { passive: true });
    addEventListener("resize", at);
    return () => {
      removeEventListener("scroll", at);
      removeEventListener("resize", at);
    };
  }, []);
  return (
    <header className="fm-top" ref={ref}>
      <a href="#voo" aria-label="RedPro AI Academy, início">
        <img src="/logo-academy.png" alt="RedPro AI Academy" />
      </a>
      <div className="fm-top-dir">
        <span className="fm-top-gar">Garantia de 7 dias</span>
        <a className="fm-btn fm-btn-sm fm-acao" href={ctaHref}>
          {ctaTexto}
        </a>
      </div>
    </header>
  );
}

function Voo(props: { reduzido: boolean; status: string; ctaHref: string; ctaTexto: string }) {
  const { reduzido, status, ctaHref, ctaTexto } = props;
  const secRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const painelRef = useRef<HTMLElement>(null);
  const placaRef = useRef<HTMLDivElement>(null);
  const fimRef = useRef<HTMLDivElement>(null);
  const carregandoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduzido) return;
    const sec = secRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const celular = matchMedia("(max-width: 767px) and (orientation: portrait)").matches;
    const seq = celular ? "m" : "d";
    /* no celular os trechos sem painel encurtam: o polegar cansa antes */
    const trechos = TRECHOS.map((t) => (celular && t.modulo === undefined ? { ...t, vh: Math.round(t.vh * 0.8) } : t));
    sec.style.height = `calc(${totalVh(trechos)}vh + 100vh)`;

    const cache = new Map<number, HTMLImageElement>();
    const pendentes = new Map<number, HTMLImageElement>();
    let alvo = 0;
    let desenhado = -1;
    let modAtual = -1;
    let raf = 0;
    let vivo = true;

    function dimensionar() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      desenhado = -1;
    }

    function carregar(i: number) {
      if (cache.has(i) || pendentes.has(i) || i < 0 || i >= TOTAL_QUADROS) return;
      const img = new Image();
      img.decoding = "async";
      pendentes.set(i, img);
      img.onload = () => {
        pendentes.delete(i);
        if (!vivo) return;
        cache.set(i, img);
        if (cache.size > CACHE_MAX) {
          let pior = -1, dist = -1;
          for (const k of cache.keys()) {
            const d = Math.abs(k - alvo) - (k % 24 === 0 ? 400 : 0);
            if (d > dist) { dist = d; pior = k; }
          }
          if (pior >= 0) cache.delete(pior);
        }
        if (i === 0) carregandoRef.current?.setAttribute("hidden", "");
        bombear();
      };
      img.onerror = () => { pendentes.delete(i); bombear(); };
      img.src = urlQuadro(seq, i);
    }

    /* fila: primeiro em volta do quadro atual (mais à frente que atrás),
       depois uma passada rala no voo todo para nunca faltar quadro vizinho */
    function bombear() {
      for (const [k, img] of pendentes) {
        if (Math.abs(k - alvo) > 260 && k % 24 !== 0) { img.src = ""; pendentes.delete(k); }
      }
      const fila: number[] = [];
      for (let d = 0; d < 150 && fila.length < 40; d++) {
        for (const k of [alvo + d, alvo - Math.floor(d / 3)]) if (!cache.has(k) && !pendentes.has(k)) fila.push(k);
      }
      for (let k = 0; k < TOTAL_QUADROS && fila.length < 60; k += 24) if (!cache.has(k) && !pendentes.has(k)) fila.push(k);
      for (const k of fila) {
        if (pendentes.size >= CONCORRENCIA) break;
        carregar(k);
      }
    }

    function desenhar(i: number) {
      let img = cache.get(i);
      if (!img) {
        for (let d = 1; d < 400 && !img; d++) img = cache.get(i - d) || cache.get(i + d);
      }
      if (!img) return;
      const cw = canvas.width, ch = canvas.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      desenhado = cache.has(i) ? i : -1;
    }

    function montarPainel(k: number) {
      const m = MODULOS[k];
      const el = painelRef.current!;
      el.style.setProperty("--c", m.cor);
      el.querySelector("[data-n]")!.textContent = `Módulo ${m.n}`;
      el.querySelector("[data-q]")!.textContent = `${m.aulas.length} aulas`;
      el.querySelector("h2")!.textContent = m.nome;
      el.querySelector("ol")!.innerHTML = m.aulas
        .map((a, j) => `<li><b>${String(j + 1).padStart(2, "0")}</b><span>${a.replace(/</g, "&lt;")}</span></li>`)
        .join("");
      modAtual = k;
    }

    function atualizar() {
      const r = sec.getBoundingClientRect();
      const vh = innerHeight / 100;
      const y = Math.max(0, -r.top) / vh;
      let acc = 0, tr = trechos[trechos.length - 1], p = 1, idx = trechos.length - 1;
      for (let j = 0; j < trechos.length; j++) {
        if (y < acc + trechos[j].vh) { tr = trechos[j]; p = (y - acc) / trechos[j].vh; idx = j; break; }
        acc += trechos[j].vh;
      }
      p = Math.min(1, Math.max(0, p));
      const t = Math.min(DURACAO - 0.05, tr.t0 + (tr.t1 - tr.t0) * p);
      alvo = Math.min(TOTAL_QUADROS - 1, Math.round(t * FPS));

      if (heroRef.current) heroRef.current.style.opacity = String(tr.tipo === "hero" ? 1 : idx === 1 ? Math.max(0, 1 - p * 3) : 0);

      const painel = painelRef.current!;
      if (tr.modulo !== undefined) {
        if (tr.modulo !== modAtual) montarPainel(tr.modulo);
        painel.classList.add("on");
        const itens = Array.from(painel.querySelectorAll("li"));
        const n = itens.length;
        const dividir = innerWidth < 900 && n > 8;
        const metade = Math.ceil(n / 2);
        let de = 0, ate = n, mostra: number;
        const pg = painel.querySelector<HTMLElement>("[data-pg]")!;
        if (dividir) {
          if (p < 0.5) { ate = metade; mostra = Math.floor(Math.min(1, p / 0.32) * metade); }
          else { de = metade; mostra = metade + Math.floor(Math.min(1, (p - 0.5) / 0.32) * (n - metade)); }
          pg.hidden = false;
          pg.textContent = p < 0.5 ? `1 de 2 · aulas 1 a ${metade}` : `2 de 2 · aulas ${metade + 1} a ${n}`;
        } else {
          mostra = Math.floor(Math.min(1, p / 0.6) * n);
          pg.hidden = true;
        }
        const ultimo = Math.max(mostra, de + 1);
        itens.forEach((li, k) => {
          li.classList.toggle("off", k < de || k >= ate);
          li.classList.toggle("on", k < ultimo);
          li.classList.toggle("dig", k === ultimo - 1 && mostra < ate);
        });
      } else painel.classList.remove("on");

      const placa = placaRef.current!;
      if (tr.placa !== undefined && p > 0.25) {
        const m = MODULOS[tr.placa];
        placa.textContent = m.fachada;
        placa.style.setProperty("--c", m.cor);
        placa.classList.add("on");
      } else placa.classList.remove("on");

      fimRef.current?.classList.toggle("on", tr.tipo === "fim" && (idx === trechos.length - 1 || p > 0.6));
      bombear();
    }

    function quadro() {
      if (alvo !== desenhado) desenhar(alvo);
      raf = requestAnimationFrame(quadro);
    }

    dimensionar();
    carregar(0);
    atualizar();
    raf = requestAnimationFrame(quadro);
    const onResize = () => { dimensionar(); atualizar(); };
    addEventListener("scroll", atualizar, { passive: true });
    addEventListener("resize", onResize);
    addEventListener("orientationchange", onResize);
    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      removeEventListener("scroll", atualizar);
      removeEventListener("resize", onResize);
      removeEventListener("orientationchange", onResize);
      for (const img of pendentes.values()) img.src = "";
      cache.clear();
    };
  }, [reduzido]);

  return (
    <section
      id="voo"
      ref={secRef}
      className="fm-voo"
      style={{ height: reduzido ? "100svh" : `calc(${totalVh(TRECHOS)}vh + 100vh)` }}
      aria-label="Voo pelo laboratório da Formação"
    >
      <div className="fm-palco">
        {/* pôster: primeiro quadro, aparece antes de qualquer script */}
        <img className="fm-poster" src={urlQuadro("d", 0)} alt="" aria-hidden="true" />
        {!reduzido && <canvas ref={canvasRef} aria-hidden="true" />}
        <div className="fm-scrim" />
        {!reduzido && (
          <div className="fm-carregando" ref={carregandoRef}>
            carregando o voo…
          </div>
        )}

        <div className="fm-hero" ref={heroRef}>
          <span className="fm-eyebrow">Formação Arquiteto de Agentes</span>
          <h1 className="fm-h1">Um time de agentes rodando 24 horas, fora do seu computador</h1>
          <p className="fm-deck">
            Sete módulos e {TOTAL_AULAS} aulas. Role a tela para entrar no laboratório e ver cada uma.
          </p>
          <span className="fm-status">{status}</span>
          <div className="fm-hero-acoes">
            <a className="fm-btn fm-acao" href={ctaHref}>
              {ctaTexto}
            </a>
            <a className="fm-pular" href="#grade">
              pular o tour
            </a>
          </div>
        </div>

        <section className="fm-painel" ref={painelRef} aria-live="polite">
          <div className="fm-ph">
            <span data-n>Módulo 1</span>
            <span data-q />
          </div>
          <h2 />
          <ol />
          <span className="fm-pg" data-pg hidden />
        </section>

        <div className="fm-placa" ref={placaRef} aria-hidden="true" />

        <div className="fm-fim" ref={fimRef}>
          <p className="fm-fim-tit">
            RedPro AI Academy
            <small>Formação Arquiteto de Agentes</small>
          </p>
          <a className="fm-btn fm-acao" href={ctaHref}>
            {ctaTexto}
          </a>
        </div>
      </div>
    </section>
  );
}

function ListaEspera({ quando }: { quando: string }) {
  const [estado, setEstado] = useState<"livre" | "enviando" | "ok" | "erro">("livre");
  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setEstado("enviando");
    try {
      const r = await fetch("/api/formacao-lista-espera", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: f.get("nome"), email: f.get("email"), whatsapp: f.get("whatsapp"), origem: location.search }),
      });
      setEstado(r.ok ? "ok" : "erro");
    } catch {
      setEstado("erro");
    }
  }
  if (estado === "ok") return <p className="fm-p fm-form"><span className="ok">Pronto, seu nome está na lista de espera.</span></p>;
  return (
    <form className="fm-form" onSubmit={enviar}>
      <p className="fm-p">
        As inscrições abrem na {quando}, das 7h às 21h. Deixe seu contato para entrar na lista de espera.
      </p>
      <label className="fm-eyebrow" htmlFor="fm-nome">Nome</label>
      <input id="fm-nome" name="nome" required autoComplete="name" />
      <label className="fm-eyebrow" htmlFor="fm-email">E-mail</label>
      <input id="fm-email" name="email" type="email" required autoComplete="email" />
      <label className="fm-eyebrow" htmlFor="fm-wpp">WhatsApp (opcional)</label>
      <input id="fm-wpp" name="whatsapp" type="tel" autoComplete="tel" />
      <button className="fm-btn" type="submit" disabled={estado === "enviando"} style={{ justifySelf: "start" }}>
        {estado === "enviando" ? "Enviando…" : "Entrar na lista de espera"}
      </button>
      {estado === "erro" && <span className="erro">Não consegui salvar agora. Tente de novo em alguns segundos.</span>}
    </form>
  );
}

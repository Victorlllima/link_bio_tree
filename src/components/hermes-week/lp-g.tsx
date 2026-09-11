"use client";

/* ============================================================================
 *  LP G · PAINEL (preto piano, vidro, champanhe)
 * ----------------------------------------------------------------------------
 *  Pedido do Red em 11/09/2026, depois de dar nota 10 para a copy da D e
 *  nota 1 para o design dela: "design mais moderno, black piano,
 *  glassmorphism, elegante". A COPY É A MESMA DA D, transcrita de
 *  `conteudo.ts`, sem uma palavra nova. O que muda aqui é só o desenho.
 *
 *  ---------------------------------------------------------------------------
 *  A TESE
 *  ---------------------------------------------------------------------------
 *  A copy vende uma máquina que trabalha enquanto você dorme. Então a página
 *  não é "landing premium com vidro": é o PAINEL FRONTAL de um instrumento
 *  caro que roda sem ninguém olhando. Laca preta, marcação em champanhe,
 *  tampa de vidro por cima. O vocabulário vem de amplificador valvulado,
 *  mostrador de relógio e painel Braun, que é o mundo material mais próximo
 *  do que a copy descreve: algo que você possui, que fica ligado, e que tem
 *  um mostrador dizendo o que está acontecendo.
 *
 *  Isso decide tudo o mais: raio pequeno (4px, hardware, não bolha), filete
 *  em vez de sombra, brilho ESPECULAR em vez de glow, e o número grande
 *  aparecendo só onde ele é mostrador de verdade.
 *
 *  ---------------------------------------------------------------------------
 *  O ELEMENTO ASSINATURA · o seletor de degrau
 *  ---------------------------------------------------------------------------
 *  A copy diz que existem quatro degraus e que a semana leva do 1 ao 3. Isso
 *  é uma sequência real, então numerar aqui carrega informação em vez de
 *  decorar (que é a única condição em que numeração 01/02/03 se justifica).
 *  O bloco vira um seletor de quatro posições com a posição 3 acesa, como
 *  chave rotativa de equipamento. É o único momento de destaque da página, e
 *  o argumento central dela cabe inteiro naquele objeto.
 *
 *  ---------------------------------------------------------------------------
 *  LISTA DE PROIBIÇÕES (pesquisa de AI slop de design, 11/09/2026)
 *  ---------------------------------------------------------------------------
 *  Levantada a pedido do Red em fontes de 2026 sobre o que hoje denuncia
 *  página gerada por IA. Nenhum destes entra aqui:
 *
 *    · Inter, Space Grotesk, Instrument Serif e Geist como display
 *    · gradiente roxo-azul, lavanda "vibecode", verde esmeralda de fallback
 *    · GLOW colorido atrás de hero, card ou botão, e box-shadow colorido
 *    · hero centralizado com sans genérica
 *    · selo/pílula logo acima do H1
 *    · três cards idênticos com ícone no topo
 *    · raio uniforme 16px / rounded-2xl
 *    · faixa colorida de 3-4px na borda do card
 *    · banda de estatísticas
 *    · eyebrow em caixa alta com pontinho decorativo e linha
 *    · corpo em monoespaçada
 *    · corpo em cinza médio reprovando no WCAG AA
 *    · emoji como ícone de interface
 *    · bento grid por falta de ideia melhor
 *    · a ordem hero → 3 cards → depoimento → preço → rodapé
 *
 *  O risco desta paleta é conhecido e está declarado: champanhe sobre escuro
 *  é vizinho do "wash âmbar e creme", que é justamente um dos sinais da
 *  lista. O que separa os dois é o tratamento. Aqui o champanhe só aparece em
 *  FILETE, em TIPO e em uma única área cheia (o botão). Nunca como névoa,
 *  nunca como brilho difuso atrás de coisa nenhuma.
 *
 *  ---------------------------------------------------------------------------
 *  VIDRO COM PARCIMÔNIA
 *  ---------------------------------------------------------------------------
 *  A pesquisa é unânime: em 2026 o vidro funciona como camada secundária e
 *  falha como tema global. Então ele aparece em três lugares, e só: o
 *  mostrador da data no hero, o seletor de degrau e o cartão do preço. O
 *  resto da página é laca plana com filete. Onde tem vidro, a borda de cima
 *  recebe um `inset 0 1px 0` claro, que é como vidro real pega luz, e é o
 *  substituto honesto do glow proibido.
 *
 *  ---------------------------------------------------------------------------
 *  TIPO
 *  ---------------------------------------------------------------------------
 *  Bodoni Moda (didone, contraste extremo de haste) só no H1 e nos títulos
 *  grandes, nunca abaixo de ~22px, porque didone em corpo pequeno no celular
 *  quebra. Schibsted Grotesk em todo o resto, com numeral tabular para data,
 *  preço e as posições do seletor. Duas famílias, não três.
 * ==========================================================================*/

import { useEffect, useRef, useState } from "react";
import { Bodoni_Moda, Schibsted_Grotesk } from "next/font/google";
import { checkoutUrl } from "./checkout";
import { ImgReal, inline, legendaImg, MOSTRAR_PLACEHOLDER, PAPEL_IMG, Pixel } from "./comum";
import { compartilhado, type Bloco, type Img, type No, type Variante } from "./conteudo";
import type { CicloFormatado } from "@/lib/ciclo-atual";
import { Revela } from "./movimento";

const display = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--g-display",
  display: "swap",
});
const ui = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--g-ui",
  display: "swap",
});

const CSS = `
.g{
  --laca:#060607; --laca2:#0B0B0D; --laca3:#101013;
  --champ:#E8D5B7; --champ-dim:rgba(232,213,183,.58);
  --filete:rgba(232,213,183,.16); --filete2:rgba(255,255,255,.07);
  --texto:#EFECE6; --texto2:#9E9A93;
  --display:var(--g-display); --ui:var(--g-ui);

  background:var(--laca); color:var(--texto);
  font-family:var(--ui); font-weight:400;
  -webkit-font-smoothing:antialiased;
  position:relative; overflow-x:hidden;
}

/* A laca. Um reflexo especular ACROMÁTICO, branco a 1,8%, vindo do alto e
   levemente fora do eixo. Não é gradiente decorativo: é como superfície
   laqueada devolve a luz do ambiente, e é o que separa preto-piano de
   preto-chapado. Zero croma, então não vira o "gradiente" da lista. */
.g::before{
  content:""; position:fixed; inset:0; pointer-events:none; z-index:0;
  background:
    radial-gradient(120% 70% at 78% -10%, rgba(255,255,255,.038), transparent 60%),
    radial-gradient(90% 50% at 8% 0%, rgba(255,255,255,.016), transparent 55%);
}
.g > *{position:relative; z-index:1;}

.g-wrap{max-width:1080px; margin:0 auto; padding:0 20px;}
@media(min-width:820px){.g-wrap{padding:0 40px;}}
.g-col{max-width:64ch;}

/* ---------- tipo ---------- */
.g-h1{
  font-family:var(--display); font-weight:400; font-optical-sizing:auto;
  font-size:clamp(2.35rem,8.4vw,4.6rem); line-height:1.02; letter-spacing:-.018em;
  margin:0 0 30px; text-wrap:balance;
}
.g-h1 b{font-weight:400; font-style:italic; color:var(--champ);}
.g-h2{
  font-family:var(--display); font-weight:400;
  font-size:clamp(1.75rem,5.2vw,2.7rem); line-height:1.1; letter-spacing:-.015em;
  margin:0 0 22px; text-wrap:balance;
}
.g-h2 b{font-weight:400; font-style:italic; color:var(--champ);}
.g-p{font-size:1.05rem; line-height:1.68; margin:0 0 1.05em; color:var(--texto);}
.g-p b{font-weight:600; color:#fff;}
.g-forte{
  font-family:var(--display); font-weight:400; font-size:clamp(1.3rem,3.9vw,1.85rem);
  line-height:1.3; margin:1.5em 0; color:var(--texto);
}
.g-forte b{font-weight:400; font-style:italic; color:var(--champ);}
.g-cita{
  margin:1.8em 0; padding:0 0 0 22px; border-left:1px solid var(--filete);
  font-family:var(--display); font-style:italic; font-weight:400;
  font-size:clamp(1.14rem,3.4vw,1.5rem); line-height:1.42; color:var(--texto);
}

/* Rótulo de seção. Sem pontinho, sem linha decorativa, sem caixa alta gritada:
   versalete discreto no champanhe apagado. A lista de proibições chama o
   contrário de "eyebrow chrome". */
.g-rot{
  font-size:.735rem; letter-spacing:.16em; text-transform:uppercase;
  color:var(--champ-dim); font-weight:600; margin:0 0 14px;
}

/* ---------- seções ---------- */
.g-sec{padding:66px 0; border-top:1px solid var(--filete2);}
@media(min-width:820px){.g-sec{padding:92px 0;}}

/* ---------- vidro (só 3 lugares na página inteira) ---------- */
.g-vidro{
  background:linear-gradient(180deg, rgba(255,255,255,.058), rgba(255,255,255,.021));
  backdrop-filter:blur(22px) saturate(118%);
  -webkit-backdrop-filter:blur(22px) saturate(118%);
  border:1px solid rgba(255,255,255,.085);
  border-radius:4px;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.14);
}

/* ---------- hero ---------- */
.g-hero{padding:52px 0 8px;}
@media(min-width:900px){
  .g-hero{
    padding:74px 0 18px;
    display:grid; grid-template-columns:1.32fr .68fr; gap:56px; align-items:start;
  }
}
.g-marca{
  font-size:.76rem; letter-spacing:.2em; text-transform:uppercase;
  color:var(--champ-dim); font-weight:600; margin:0 0 34px;
}
.g-deck{
  font-size:1.14rem; line-height:1.6; color:var(--texto); margin:0 0 34px;
  max-width:46ch;
}

/* O mostrador da data. Cumpre a regra do Tabari de data em destaque na 1ª
   dobra, mas como janela de data de relógio: placa de vidro, filete, numeral
   tabular grande. No desktop ele sobe pra coluna da direita. */
.g-mostrador{padding:20px 22px 18px; margin:0 0 32px;}
.g-mostrador-rot{
  font-size:.7rem; letter-spacing:.17em; text-transform:uppercase;
  color:var(--champ-dim); font-weight:600; margin:0 0 9px;
}
.g-mostrador-data{
  font-family:var(--display); font-weight:500;
  font-size:clamp(2.05rem,7.4vw,3.05rem); line-height:1; letter-spacing:-.02em;
  color:var(--champ); margin:0;
}
.g-mostrador-pe{
  font-size:.9rem; line-height:1.5; color:var(--texto2); margin:12px 0 0;
  padding-top:12px; border-top:1px solid var(--filete2);
}

/* ---------- CTA ---------- */
/* Área cheia de champanhe é o ÚNICO lugar da página onde a cor ocupa massa.
   Sem sombra colorida e sem glow: a elevação vem do filete interno claro,
   que é o que uma tecla de metal escovado faz com a luz. */
.g-cta{
  display:flex; align-items:center; justify-content:center; gap:12px;
  width:100%; min-height:60px; padding:19px 26px;
  background:var(--champ); color:#0A0A0A;
  font-family:var(--ui); font-weight:700; font-size:.97rem; letter-spacing:.012em;
  text-decoration:none; border-radius:4px; border:1px solid #F2E4CC;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.55);
  transition:background .18s ease, transform .18s ease;
}
.g-cta:hover{background:#F2E4CC; transform:translateY(-1px);}
.g-cta:focus-visible{outline:2px solid var(--champ); outline-offset:3px;}
.g-cta svg{flex:0 0 auto;}

/* A garantia mora colada no CTA, mesma coluna. Regra inegociável do Tabari:
   isolada no rodapé ela não trabalha. */
.g-garantia-cta{
  font-size:.9rem; line-height:1.55; color:var(--texto2); margin:14px 0 0;
  max-width:42ch;
}
.g-garantia-cta b{color:var(--texto); font-weight:600;}

.g-fatos{
  list-style:none; margin:30px 0 0; padding:16px 0 0;
  border-top:1px solid var(--filete2);
  display:flex; flex-wrap:wrap; gap:8px 20px;
  font-size:.83rem; letter-spacing:.05em; text-transform:uppercase;
  color:var(--texto2); font-weight:500;
}

/* ---------- assinatura · o seletor de degrau ---------- */
.g-seletor{margin:38px 0 0; padding:8px; display:grid; gap:6px;}
@media(min-width:780px){.g-seletor{grid-template-columns:repeat(4,1fr);}}
.g-pos{
  position:relative; padding:22px 20px 20px; border-radius:3px;
  border:1px solid var(--filete2); background:rgba(255,255,255,.012);
  transition:border-color .3s ease, background .3s ease;
}
.g-pos-n{
  font-family:var(--ui); font-weight:700; font-size:.76rem; letter-spacing:.14em;
  color:var(--texto2); display:block; margin:0 0 12px;
}
.g-pos-t{
  font-family:var(--display); font-weight:400; font-size:1.32rem; line-height:1.1;
  margin:0 0 10px; color:var(--texto);
}
.g-pos-x{font-size:.94rem; line-height:1.55; color:var(--texto2); margin:0;}
/* A posição acesa. O contorno acende e a marcação vira champanhe: é o clique
   da chave. Nada de preenchimento nem de brilho atrás. */
.g-pos[data-on="sim"]{
  border-color:rgba(232,213,183,.42); background:rgba(232,213,183,.045);
}
.g-pos[data-on="sim"] .g-pos-n,
.g-pos[data-on="sim"] .g-pos-t{color:var(--champ);}
.g-pos[data-on="sim"] .g-pos-x{color:var(--texto);}
.g-pos-marca{
  display:inline-block; margin:14px 0 0; padding:5px 10px; border-radius:2px;
  border:1px solid rgba(232,213,183,.34); color:var(--champ);
  font-size:.7rem; letter-spacing:.11em; text-transform:uppercase; font-weight:600;
}
/* o traço do mostrador, só no desktop, ligando as quatro posições */
@media(min-width:780px){
  .g-pos::after{
    content:""; position:absolute; left:20px; right:20px; bottom:-7px; height:1px;
    background:var(--filete2);
  }
  .g-pos[data-on="sim"]::after{background:rgba(232,213,183,.42);}
}

/* ---------- os cinco dias ---------- */
.g-dias{margin:30px 0 0; border-top:1px solid var(--filete2);}
.g-dia{
  display:grid; gap:4px 22px; padding:20px 0;
  border-bottom:1px solid var(--filete2);
}
@media(min-width:720px){.g-dia{grid-template-columns:172px 1fr; align-items:baseline;}}
.g-dia dt{
  font-weight:600; font-size:.88rem; letter-spacing:.07em; text-transform:uppercase;
  color:var(--champ-dim); margin:0;
  /* a única coluna de números que precisa alinhar. Fora daqui o tnum é
     proibido nesta página: nesta fonte ele dá largura de dígito à vírgula e
     ao ponto, e texto corrido abre um vão antes de toda pontuação. */
  font-variant-numeric:tabular-nums;
}
.g-dia dd{margin:0; font-size:1.03rem; line-height:1.55; color:var(--texto);}

/* ---------- qualificação dupla ---------- */
.g-dupla{display:grid; gap:16px; margin:26px 0 0;}
@media(min-width:820px){.g-dupla{grid-template-columns:1fr 1fr; gap:20px;}}
.g-meia{padding:26px 24px; border-radius:4px; border:1px solid var(--filete2);}
.g-meia[data-lado="sim"]{border-color:rgba(232,213,183,.3); background:rgba(232,213,183,.035);}
.g-meia-t{
  font-family:var(--display); font-weight:400; font-size:1.34rem; line-height:1.1;
  margin:0 0 16px;
}
.g-meia[data-lado="sim"] .g-meia-t{color:var(--champ);}
.g-meia .g-p{font-size:.97rem; line-height:1.58; margin:0 0 .9em;}
.g-meia .g-p:last-child{margin-bottom:0;}

/* ---------- oferta ---------- */
.g-oferta{padding:34px 26px; margin:8px 0 0;}
@media(min-width:720px){.g-oferta{padding:44px 40px;}}
.g-oferta-nome{
  font-family:var(--display); font-weight:400; font-size:clamp(1.4rem,4.2vw,1.95rem);
  line-height:1.15; margin:0 0 20px; color:var(--texto);
}
.g-preco{
  font-family:var(--display); font-weight:500; font-size:clamp(3.4rem,13vw,5.2rem);
  /* tracking quase neutro: a -.03em o cifrão do didone encosta na perna do R */
  line-height:.9; letter-spacing:-.005em; color:var(--champ); margin:0 0 26px;
}
.g-inclui{list-style:none; margin:0 0 30px; padding:0;}
.g-inclui li{
  padding:14px 0 14px 22px; border-top:1px solid var(--filete2); position:relative;
  font-size:1rem; line-height:1.55;
}
.g-inclui li:last-child{border-bottom:1px solid var(--filete2);}
/* marcador de filete, não ícone de biblioteca e muito menos emoji */
.g-inclui li::before{
  content:""; position:absolute; left:0; top:23px; width:10px; height:1px;
  background:var(--champ);
}

/* ---------- complementos ---------- */
.g-bumps{display:grid; gap:14px; margin:26px 0 0;}
.g-bump{padding:24px; border:1px solid var(--filete2); border-radius:4px;}
.g-bump-cab{display:flex; justify-content:space-between; gap:16px; align-items:baseline; margin:0 0 10px;}
.g-bump-nome{font-family:var(--display); font-weight:400; font-size:1.2rem; line-height:1.1;}
.g-bump-preco{font-weight:700; font-size:1.02rem; color:var(--champ); white-space:nowrap;}
.g-bump-txt{font-size:.97rem; line-height:1.58; color:var(--texto2); margin:0;}
.g-bump-txt b{color:var(--texto); font-weight:600;}

/* ---------- faq ---------- */
.g-faq{margin:26px 0 0;}
.g-faq details{border-top:1px solid var(--filete2);}
.g-faq details:last-child{border-bottom:1px solid var(--filete2);}
.g-faq summary{
  cursor:pointer; list-style:none; padding:20px 40px 20px 0; position:relative;
  font-size:1.04rem; font-weight:600; color:var(--texto);
}
.g-faq summary::-webkit-details-marker{display:none;}
/* o marcador é um sinal de mais em filete, girando pra menos quando abre */
.g-faq summary::after,
.g-faq summary::before{
  content:""; position:absolute; right:4px; background:var(--champ);
  transition:transform .22s ease, opacity .22s ease;
}
.g-faq summary::after{top:29px; width:13px; height:1px;}
.g-faq summary::before{top:23px; right:10px; width:1px; height:13px;}
.g-faq details[open] summary::before{transform:rotate(90deg); opacity:0;}
.g-faq-r{padding:0 0 22px; font-size:1rem; line-height:1.65; color:var(--texto2); max-width:62ch;}

/* ---------- imagens ---------- */
.g-img{margin:32px 0; border:1px solid var(--filete2); border-radius:4px; overflow:hidden; background:var(--laca2);}
.g-img img{display:block; width:100%; height:auto;}
.g-img-cab{
  display:flex; justify-content:space-between; gap:12px;
  padding:11px 14px; border-bottom:1px solid var(--filete2);
  font-size:.68rem; letter-spacing:.13em; text-transform:uppercase; color:var(--texto2);
}
.g-img-caixa{padding:34px 22px; min-height:190px; display:flex; align-items:center;}
.g-img-txt{font-size:.93rem; line-height:1.6; color:var(--texto2); margin:0;}
.g-retrato{max-width:340px;}

/* ---------- fecho e rodapé ---------- */
.g-humano{font-size:.9rem; line-height:1.6; color:var(--texto2); margin:16px 0 0; max-width:46ch;}
.g-humano a{color:var(--champ); text-decoration:underline; text-underline-offset:3px;}
.g-rodape{
  border-top:1px solid var(--filete2); margin-top:8px;
  padding:34px 0 46px; font-size:.79rem; line-height:1.9; color:var(--texto2);
}
.g-rodape a{color:var(--champ-dim);}

/* ---------- barra fixa do celular ---------- */
/* Aparece depois que o hero sai de cena. Vidro, porque é camada secundária
   sobre o conteúdo, que é exatamente o caso de uso que a pesquisa aprova. */
.g-barra{
  position:fixed; left:0; right:0; bottom:0; z-index:40;
  padding:11px 16px calc(11px + env(safe-area-inset-bottom));
  background:rgba(6,6,7,.82);
  backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
  border-top:1px solid var(--filete);
  transform:translateY(102%); transition:transform .3s cubic-bezier(.4,0,.2,1);
}
.g-barra[data-on="sim"]{transform:translateY(0);}
.g-barra .g-cta{min-height:54px; padding:16px 22px;}
@media(min-width:900px){.g-barra{display:none;}}

@media (prefers-reduced-motion: reduce){
  .g *,.g *::before,.g *::after{transition-duration:.01ms !important; animation-duration:.01ms !important;}
  .g-barra{transition:none;}
}
`;

/* ---------- peças ---------- */

function Seta() {
  return (
    <svg width="13" height="11" viewBox="0 0 13 11" fill="none" aria-hidden="true">
      <path
        d="M7.5 1.5L11.5 5.5L7.5 9.5M11.5 5.5H1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Cta({ href, texto }: { href: string; texto: string }) {
  return (
    <a className="g-cta hw-acao" href={href}>
      {texto}
      <Seta />
    </a>
  );
}

function Foto({ img, retrato = false, prioridade = false }: { img: Img; retrato?: boolean; prioridade?: boolean }) {
  // buraco sem foto não vai ao ar: ver MOSTRAR_PLACEHOLDER em comum.tsx
  if (!img.src && !MOSTRAR_PLACEHOLDER) return null;
  return (
    <figure className={`g-img${retrato ? " g-retrato" : ""}`}>
      {img.src ? null : (
        <figcaption className="g-img-cab">
          <span>{legendaImg(img)}</span>
          <span>{PAPEL_IMG[img.tipo]}</span>
        </figcaption>
      )}
      {img.src ? (
        <ImgReal
          img={img}
          sizes={img.formato === "wide" ? "(max-width:900px) 92vw, 700px" : "(max-width:900px) 86vw, 340px"}
          prioridade={prioridade}
        />
      ) : (
        <div className="g-img-caixa">
          <p className="g-img-txt">{img.c}</p>
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
            <blockquote key={kk} className="g-cita">
              {inline(n.c, kk)}
            </blockquote>
          );
        if (n.t === "forte")
          return (
            <p key={kk} className="g-forte">
              {inline(n.c, kk)}
            </p>
          );
        return (
          <p key={kk} className="g-p">
            {inline(n.c, kk)}
          </p>
        );
      })}
    </>
  );
}

/* O seletor de quatro posições. Mesma leitura de `**Degrau N: nome.** texto`
   que a LP D faz, porque a copy é a mesma e o parser não pode divergir. */
function Seletor({ b }: { b: Bloco }) {
  const pos: { n: string; titulo: string; texto: string }[] = [];
  const soltos: No[] = [];

  for (const no of b.nos) {
    const m = no.t === "p" ? no.c.match(/^\*\*Degrau (\d): ([^*]+?)\.\*\*\s*([\s\S]*)$/) : null;
    if (m) pos.push({ n: m[1] as string, titulo: m[2] as string, texto: m[3] as string });
    else soltos.push(no);
  }

  return (
    <>
      <div className="g-col">
        <Nos nos={soltos.slice(0, 1)} k="sel-a" />
      </div>
      <Revela className="g-seletor g-vidro" como="grade" limiar={0.14}>
        {pos.map((p) => (
          <div className="g-pos" data-on={p.n === "3" ? "sim" : "nao"} key={p.n}>
            <span className="g-pos-n">{`0${p.n}`}</span>
            <h3 className="g-pos-t">{p.titulo}</h3>
            <p className="g-pos-x">{p.texto}</p>
            {p.n === "3" ? <span className="g-pos-marca">a semana leva pra cá</span> : null}
          </div>
        ))}
      </Revela>
      <div className="g-col" style={{ marginTop: 34 }}>
        <Nos nos={soltos.slice(1)} k="sel-d" />
      </div>
    </>
  );
}

/* A barra só aparece depois que o hero passou. Comparação direta de scrollY
   com a altura do hero, e não IntersectionObserver, pelo mesmo motivo apurado
   na LP F em 02/09: o observer não reentrega o estado quando a barra some e
   volta na mesma rolagem. */
function useBarra(hero: React.RefObject<HTMLElement | null>) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let raf = 0;
    const medir = () => {
      raf = 0;
      const el = hero.current;
      if (!el) return;
      setOn(window.scrollY > el.offsetTop + el.offsetHeight - 40);
    };
    const aoRolar = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, [hero]);
  return on;
}

/* ========================================================================= */

export function LpG({ v, ciclo }: { v: Variante; ciclo: CicloFormatado }) {
  const url = checkoutUrl("G");
  const hero = useRef<HTMLElement>(null);
  const barra = useBarra(hero);

  const escada = v.antes.find((b) => b.tag === "a escada");
  const resto = v.antes.filter((b) => b !== escada);

  return (
    <div className={`g ${display.variable} ${ui.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Pixel v="G" />

      <main className="g-wrap">
        {/* ---------- hero, assimétrico de propósito ---------- */}
        <header className="g-hero" ref={hero}>
          <div>
            <p className="g-marca">{compartilhado.evento}</p>
            <h1 className="g-h1">{inline(v.hero.h1, "h1")}</h1>
            <p className="g-deck">{v.hero.deck}</p>
            <Cta href={url} texto={compartilhado.ctaTopo} />
            <p className="g-garantia-cta">{inline(`Garantia de ${v.garantia}`, "gar-hero")}</p>
            <ul className="g-fatos">
              <li>5 encontros</li>
              <li>segunda a sexta</li>
              <li>20h</li>
            </ul>
          </div>

          <div>
            <div className="g-mostrador g-vidro">
              <p className="g-mostrador-rot">as cinco noites</p>
              <p className="g-mostrador-data">{ciclo.faixa}</p>
              <p className="g-mostrador-pe">{`Começa segunda, ${ciclo.inicioExtenso}, às 20h.`}</p>
            </div>
            <Foto img={v.hero.foto} retrato prioridade />
          </div>
        </header>

        {/* ---------- a escada, com o elemento assinatura ---------- */}
        {escada ? (
          <section className="g-sec">
            <p className="g-rot">{escada.tag}</p>
            <Seletor b={escada} />
          </section>
        ) : null}

        {resto.map((b, i) => (
          <section className="g-sec" key={`r${i}`}>
            <p className="g-rot">{b.tag}</p>
            <div className="g-col">
              <Nos nos={b.nos} k={`r${i}`} />
            </div>
          </section>
        ))}

        {/* ---------- os cinco dias ---------- */}
        <section className="g-sec">
          <p className="g-rot">o que você sai com</p>
          <h2 className="g-h2">{v.saiCom.intro}</h2>
          <dl className="g-dias">
            {compartilhado.dias.map((d, i) => (
              <div className="g-dia" key={d.dia}>
                <dt>{`${d.dia} ${ciclo.aulas[i]}`}</dt>
                <dd>{d.saida}</dd>
              </div>
            ))}
          </dl>
          <div className="g-col" style={{ marginTop: 26 }}>
            <p className="g-p">{v.saiCom.sabado}</p>
            {v.saiCom.extra ? <p className="g-p">{inline(v.saiCom.extra, "extra")}</p> : null}
          </div>
          <div style={{ marginTop: 32, maxWidth: 460 }}>
            <Cta href={url} texto={compartilhado.ctaTopo} />
          </div>
        </section>

        {v.entre.map((b, i) => (
          <section className="g-sec" key={`e${i}`}>
            <p className="g-rot">{b.tag}</p>
            <div className="g-col">
              <Nos nos={b.nos} k={`e${i}`} />
            </div>
          </section>
        ))}

        {/* Autoridade antes da prova: log de estranho não é prova. */}
        {v.autoridade ? (
          <section className="g-sec">
            <p className="g-rot">{v.autoridade.tag}</p>
            <div className="g-col">
              <Nos nos={v.autoridade.nos} k="aut" />
            </div>
          </section>
        ) : null}

        <section className="g-sec">
          <p className="g-rot">{v.prova.tag}</p>
          <div className="g-col">
            <Nos nos={v.prova.nos} k="prova" />
          </div>
        </section>

        <section className="g-sec">
          <p className="g-rot">quem se encaixa</p>
          <h2 className="g-h2">Pra quem é, e pra quem <b>não é</b></h2>
          {v.praQuemE ? (
            <div className="g-dupla">
              <div className="g-meia" data-lado="sim">
                <p className="g-meia-t">{v.praQuemE.tag}</p>
                <Nos nos={v.praQuemE.nos} k="pqe" />
              </div>
              <div className="g-meia" data-lado="nao">
                <p className="g-meia-t">{v.praQuemNaoE.tag}</p>
                <Nos nos={v.praQuemNaoE.nos} k="pqn" />
              </div>
            </div>
          ) : (
            <div className="g-col">
              <Nos nos={v.praQuemNaoE.nos} k="pqn" />
            </div>
          )}
        </section>

        {/* ---------- a oferta ---------- */}
        <section className="g-sec">
          <p className="g-rot">os termos</p>
          <div className="g-oferta g-vidro">
            <h2 className="g-oferta-nome">{compartilhado.produto}</h2>
            <p className="g-preco">{compartilhado.preco}</p>
            <ul className="g-inclui">
              {v.oferta.linhas.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
            <Cta href={url} texto={compartilhado.ctaOferta} />
            <p className="g-garantia-cta">{inline(`Garantia de ${v.garantia}`, "gar-of")}</p>
          </div>
        </section>

        <section className="g-sec">
          <p className="g-rot">complementos opcionais</p>
          <h2 className="g-h2">Os três complementos</h2>
          {v.bumps.intro ? (
            <div className="g-col">
              <p className="g-p">{v.bumps.intro}</p>
            </div>
          ) : null}
          <div className="g-bumps">
            {v.bumps.itens.map((b) => (
              <div className="g-bump" key={b.nome}>
                <div className="g-bump-cab">
                  <span className="g-bump-nome">{b.nome}</span>
                  <span className="g-bump-preco">{b.preco}</span>
                </div>
                <p className="g-bump-txt">{inline(b.texto, `bp-${b.nome}`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="g-sec">
          <p className="g-rot">{v.escassez.tag}</p>
          <div className="g-col">
            <Nos nos={v.escassez.nos} k="esc" />
          </div>
        </section>

        <section className="g-sec">
          <p className="g-rot">garantia</p>
          <h2 className="g-h2">{inline(v.garantia, "gar")}</h2>
        </section>

        <section className="g-sec">
          <p className="g-rot">perguntas</p>
          <h2 className="g-h2">O que você vai perguntar</h2>
          <div className="g-faq">
            {v.faq.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <div className="g-faq-r">{f.a}</div>
              </details>
            ))}
          </div>
        </section>

        <section className="g-sec">
          <div className="g-col">
            <Nos nos={v.fecho.nos} k="fecho" />
          </div>
          {v.fecho.foto ? <Foto img={v.fecho.foto} /> : null}
          <div style={{ marginTop: 32, maxWidth: 460 }}>
            <Cta href={url} texto={compartilhado.ctaTopo} />
            <p className="g-humano">
              Ficou com dúvida que a página não respondeu? Escreve pra{" "}
              <a href={`mailto:${compartilhado.rodape.suporte}`}>{compartilhado.rodape.suporte}</a>{" "}
              que quem responde sou eu.
            </p>
          </div>
        </section>

        <footer className="g-rodape">
          <div>{compartilhado.eventoCurto}</div>
          <div>
            {compartilhado.rodape.razao} · {compartilhado.rodape.cnpj} ·{" "}
            <a href={`mailto:${compartilhado.rodape.suporte}`}>{compartilhado.rodape.suporte}</a>
          </div>
        </footer>
      </main>

      <div className="g-barra" data-on={barra ? "sim" : "nao"} aria-hidden={!barra}>
        <a className="g-cta hw-acao" href={url} tabIndex={barra ? 0 : -1}>
          {compartilhado.ctaTopo}
          <Seta />
        </a>
      </div>
    </div>
  );
}

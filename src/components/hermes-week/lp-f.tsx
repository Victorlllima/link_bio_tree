"use client";

/* ============================================================================
 *  LP F · CINEMÁTICA (skill cine-scroll)
 * ----------------------------------------------------------------------------
 *  ÂNGULO: a jornada. As outras cinco argumentam; esta mostra. A primeira
 *  metade da página é um filme de 5 cenas conduzido pela rolagem, e a segunda
 *  é a oferta inteira em HTML normal. A costura entre as duas é o CTA, que
 *  fica alcançável a partir da cena 3 e não só no fim.
 *
 *  PIPELINE REAL (skill cine-scroll, passos 3 a 6):
 *    1. roteiro aprovado          → HERMES/05-paginas/lp-F-cinematica-ROTEIRO.md
 *    2. 5 imagens-chave 16:9      → fal-ai/nano-banana/edit, a partir da foto
 *                                   de referência do Red (identidade preservada)
 *    3. 4 vídeos de transição     → fal-ai/kling-video, com image_url +
 *                                   tail_image_url (dois keyframes de verdade,
 *                                   por isso a emenda não salta)
 *    4. quadros                   → ffmpeg 8.0, sequência contínua numerada
 *    5. scrub em canvas           → este arquivo
 *
 *  O QUE MUDOU EM RELAÇÃO AO TEMPLATE DA SKILL, E POR QUÊ
 *  O template original pré-carrega os N quadros ANTES de mostrar qualquer
 *  coisa, atrás de um spinner. Numa página que recebe anúncio pago em celular
 *  isso é uma tela de carregando por vários segundos antes do primeiro pixel,
 *  e o visitante do tráfego frio some ali. Aqui:
 *
 *    · a cena 1 é <img> comum com fetchPriority="high" e pinta imediatamente,
 *      antes de um único quadro de scrub existir;
 *    · os quadros entram DEPOIS, em segundo plano, e o canvas só assume
 *      quando termina (troca invisível, a imagem por baixo é o mesmo frame);
 *    · em celular os quadros nem são baixados. O visitante recebe as 5 cenas
 *      estáticas, que é o mesmo conteúdo, sem 8 MB de sequência.
 *
 *  Isso mantém o efeito onde ele compensa (desktop, tela grande, banda boa) e
 *  não cobra o preço dele de quem não vai ver benefício nenhum.
 *
 *  PALETA   breu #060607 · âmbar #E8A34A (a cor do agente, e só dele) ·
 *           azul frio #6C87A6 (o mundo sem ele) · osso #F2EFE9
 *  TIPO     Bricolage Grotesque 200/800 nas cenas (contraste de peso extremo,
 *           que é o oposto do 400/600 de template) + Plus Jakarta Sans no corpo
 *  DESTAQUE ÚNICO: o scrub. Nada mais na página se move, por regra do arsenal.
 * ==========================================================================*/

import { useEffect, useRef, useState } from "react";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { checkoutUrl } from "./checkout";
import { Pixel } from "./comum";
import { CENAS, DUPLA, OFERTA } from "./lp-f-cenas";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "400", "800"],
  variable: "--f-display",
  display: "swap",
});
const ui = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  variable: "--f-ui",
  display: "swap",
});

/* Saída real do scripts/extrair-frames.sh da skill: 4 transicoes x 61 quadros
   (5,1s a 12fps, largura 1280, qualidade 7) = 244 quadros, 6,0 MB.
   Se for 0, o scrub nem tenta rodar e a pagina vive no modo estatico. */
const TOTAL_FRAMES = 244;
const FRAME_PATH = "/hermes-week/f/frames/scene-%04d.jpg";
const PX_POR_QUADRO = 24;

const CHECKOUT = checkoutUrl("F");

const CSS = `
.f{
  --breu:#060607; --carvao:#101013; --ambar:#E8A34A; --ambar-fraco:rgba(232,163,74,.12);
  --frio:#6C87A6; --osso:#F2EFE9; --osso2:#9A968F; --linha:rgba(242,239,233,.11);
  --display:var(--f-display),"Segoe UI",sans-serif;
  --ui:var(--f-ui),system-ui,sans-serif;
  background:var(--breu);color:var(--osso);font-family:var(--ui);font-weight:300;
  -webkit-font-smoothing:antialiased;overflow-x:clip;
}
.f *{box-sizing:border-box;}

/* ============ PARTE 1 · O FILME ============================================
   No modo estático (padrão, e único modo no celular e sob reduced-motion)
   cada cena é uma section de 100vh com a imagem-chave e o texto por cima.
   No modo cinema o canvas fixo assume e estas sections viram só a trilha de
   altura que dá comprimento ao scroll. */

.f-filme{position:relative;}

.f-cena{
  position:relative;min-height:100svh;display:flex;align-items:flex-end;
  padding:0 0 12vh;overflow:hidden;
}
.f-cena-img{
  position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  /* o breu por baixo evita o flash branco antes da imagem pintar */
  background:var(--breu);
}
.f-cena::after{
  content:"";position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(6,6,7,.62) 0%,rgba(6,6,7,.12) 34%,rgba(6,6,7,.86) 100%);
}
.f-cena-txt{position:relative;z-index:2;width:100%;max-width:1180px;margin:0 auto;padding:0 24px;}

.f-hora{
  display:inline-flex;align-items:center;gap:10px;
  font-family:var(--ui);font-weight:500;font-size:.7rem;letter-spacing:.26em;
  color:var(--ambar);margin:0 0 20px;
}
.f-hora::before{content:"";width:26px;height:1px;background:var(--ambar);}

.f-titulo{
  font-family:var(--display);font-weight:200;
  font-size:clamp(2.1rem,6.4vw,4.3rem);line-height:1.02;letter-spacing:-.035em;
  margin:0;max-width:17ch;text-wrap:balance;
}
.f-titulo b{font-weight:800;color:var(--ambar);}

/* CTA que viaja com a cena, a partir da 3 */
.f-cena-cta{
  display:inline-flex;align-items:center;gap:12px;margin-top:34px;
  background:var(--ambar);color:#1A1206;text-decoration:none;
  font-family:var(--ui);font-weight:700;font-size:.94rem;letter-spacing:.02em;
  padding:17px 30px;border-radius:2px;
}
.f-cena-cta:hover{background:#F2B667;}

/* ---- modo cinema: canvas fixo por cima da trilha ---- */
.f-palco{position:fixed;inset:0;z-index:1;display:none;}
.f-tela{width:100%;height:100%;display:block;}
.f-veu{
  position:fixed;inset:0;z-index:2;display:none;pointer-events:none;
  background:linear-gradient(180deg,rgba(6,6,7,.6) 0%,rgba(6,6,7,.1) 34%,rgba(6,6,7,.85) 100%);
}
.f-camada{
  position:fixed;inset:0;z-index:3;display:none;pointer-events:none;
  align-items:flex-end;padding:0 0 12vh;
}
.f-camada .f-cena-txt{pointer-events:none;}
.f-camada .f-cena-cta{pointer-events:auto;}
.f-ov{
  position:absolute;left:0;right:0;bottom:12vh;opacity:0;transform:translateY(16px);
  transition:opacity .45s ease,transform .45s ease;
}
.f-ov[data-on="1"]{opacity:1;transform:none;}

.f.cinema .f-palco,
.f.cinema .f-veu{display:block;}
.f.cinema .f-camada{display:flex;}
/* o filme acabou: o canvas fixo solta a tela e a oferta assume. Sem isto o
   palco continua grudado no viewport por baixo das 6 seções seguintes. */
.f.cinema.fim .f-palco,
.f.cinema.fim .f-veu,
.f.cinema.fim .f-camada{display:none;}
/* as sections viram trilha invisível: guardam a altura, somem da vista */
.f.cinema .f-cena{visibility:hidden;}

/* dica de rolagem, só na primeira cena */
.f-dica{
  position:absolute;right:24px;bottom:12vh;z-index:3;display:flex;align-items:center;gap:10px;
  font-size:.66rem;letter-spacing:.22em;text-transform:uppercase;color:var(--osso2);
}
.f-dica i{display:block;width:1px;height:30px;background:currentColor;animation:f-desce 1.9s ease-in-out infinite;}
/* no celular a dica colide com a headline da cena 1. Some: quem está no
   telefone já sabe rolar, e o texto vale mais que o enfeite. */
@media(max-width:640px){.f-dica{display:none;}}
@keyframes f-desce{0%,100%{transform:scaleY(.4);opacity:.35;}50%{transform:scaleY(1);opacity:1;}}

/* ============ PARTE 2 · A OFERTA ========================================= */
.f-of{position:relative;z-index:5;background:var(--breu);}
.f-faixa{padding:88px 0;border-top:1px solid var(--linha);}
@media(min-width:900px){.f-faixa{padding:118px 0;}}
.f-in{max-width:1080px;margin:0 auto;padding:0 24px;}
.f-col{max-width:62ch;}
.f-rot{
  font-family:var(--ui);font-weight:500;font-size:.66rem;letter-spacing:.26em;
  text-transform:uppercase;color:var(--ambar);margin:0 0 24px;
}
.f-h2{
  font-family:var(--display);font-weight:200;font-size:clamp(1.85rem,4.4vw,3rem);
  line-height:1.08;letter-spacing:-.03em;margin:0 0 26px;max-width:20ch;
  text-wrap:balance;
}
/* headline longa (a da escassez) precisa de mais linha antes de quebrar feio */
.f-h2.larga{max-width:26ch;}
.f-h2 b{font-weight:800;color:var(--ambar);}
.f-p{font-size:1.03rem;line-height:1.78;color:var(--osso2);margin:0 0 18px;}
.f-p b{color:var(--osso);font-weight:500;}

/* dias */
.f-dias{list-style:none;margin:0;padding:0;border-top:1px solid var(--linha);}
.f-dia{display:grid;grid-template-columns:1fr;gap:6px;padding:20px 0;border-bottom:1px solid var(--linha);}
@media(min-width:760px){.f-dia{grid-template-columns:150px 1fr;gap:28px;align-items:baseline;}}
.f-dia dt{font-family:var(--display);font-weight:800;font-size:.86rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ambar);}
.f-dia dd{margin:0;font-size:1rem;line-height:1.65;color:var(--osso2);}

/* prova */
.f-provas{display:grid;gap:26px;margin:34px 0 0;}
.f-prova{border-left:2px solid var(--ambar);padding:4px 0 4px 22px;}
.f-prova-n{font-family:var(--display);font-weight:800;font-size:2.6rem;line-height:1;color:var(--ambar);display:block;margin:0 0 10px;}
.f-prova-t{font-size:.95rem;line-height:1.66;color:var(--osso2);margin:0;}

/* ---- o vídeo da triagem -------------------------------------------------
   Duas colunas a partir de 900px: a gravação vertical à esquerda, o texto e
   os três números à direita. Abaixo disso o vídeo vem primeiro e o texto
   desce, que é a ordem natural do DOM (nenhum order invertido no CSS: leitor
   de tela e olho recebem a mesma sequência).
   A moldura é uma borda de 1px e um raio pequeno. Sem notch, sem botão de
   home, sem brilho de vidro: mockup de celular desenhado vira ilustração, e
   ilustração enfraquece a coisa que é justamente uma tela de verdade. */
.f-tv{display:grid;gap:34px;margin:36px 0 0;align-items:start;}
@media(min-width:900px){
  .f-tv{grid-template-columns:minmax(0,300px) minmax(0,1fr);gap:52px;}
}
.f-tv-figura{width:100%;max-width:320px;margin:0 auto;}
@media(min-width:900px){.f-tv-figura{max-width:300px;margin:0;}}
.f-tv-caixa{
  position:relative;
  border:1px solid var(--linha);border-radius:10px;overflow:hidden;
  background:var(--carvao);
  box-shadow:0 24px 60px rgba(0,0,0,.5);
}
/* O vídeo entra INTEIRO: aspect-ratio nativo, sem cover e sem max-height.
   Corte de topo aqui apaga o cabeçalho do Telegram, que é metade da prova
   (é ele que diz de onde a tela saiu). A altura vem da largura da coluna. */
.f-tv-caixa video{
  display:block;width:100%;height:auto;aspect-ratio:640/1250;background:var(--breu);
}
/* carimbo de data: FORA da moldura, logo abaixo. Dentro ele cai em cima da
   barra de digitar do Telegram e some. Contraste baixo de propósito: é
   rodapé da prova, não manchete. */
.f-tv-hora{
  margin:12px 0 0;text-align:center;
  font-family:var(--ui);font-weight:500;font-size:.64rem;letter-spacing:.2em;
  text-transform:uppercase;color:var(--osso2);
}
@media(min-width:900px){.f-tv-hora{text-align:left;}}
/* botão de play do modo reduced-motion: só aparece quando o React decide que
   não vai dar autoplay. Fora disso ele nem entra no DOM. */
.f-tv-play{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  border:0;background:rgba(6,6,7,.34);cursor:pointer;color:var(--osso);
  font:500 .72rem/1 var(--ui);letter-spacing:.2em;text-transform:uppercase;
}
.f-tv-play span{
  display:flex;align-items:center;gap:10px;
  background:var(--ambar);color:#1A1206;padding:13px 20px;border-radius:3px;
}
.f-tv-texto .f-p:last-of-type{margin-bottom:0;}
.f-tv .f-provas{margin-top:30px;gap:24px;}

/* bumps */
.f-bumps{display:grid;gap:1px;background:var(--linha);border:1px solid var(--linha);margin:32px 0 0;}
.f-bump{background:var(--breu);padding:26px 24px;}
.f-bump h3{font-family:var(--display);font-weight:800;font-size:1.02rem;margin:0 0 4px;color:var(--osso);}
.f-bump span{display:block;font-family:var(--display);font-weight:200;font-size:1.5rem;color:var(--ambar);margin:0 0 12px;}
.f-bump p{font-size:.92rem;line-height:1.64;color:var(--osso2);margin:0;}
/* a primeira linha do bump é o problema que o leitor reconhece. Ela vem em
   osso cheio pra ser lida antes do parágrafo explicativo, que é secundário. */
.f-bump-dor{color:var(--osso);font-weight:500;margin:0 0 10px;}

/* ---- Hermes x Alfred ----------------------------------------------------
   Dois cartões deliberadamente IDÊNTICOS em estrutura: mesmo tamanho de
   moldura, mesma altura de imagem, mesma lista. A simetria é o argumento —
   se um cartão fosse maior, o leitor leria "dois produtos" em vez de "o mesmo
   programa em dois momentos". */
.f-dupla{display:grid;gap:22px;margin:34px 0 0;}
@media(min-width:760px){.f-dupla{grid-template-columns:1fr 1fr;gap:26px;}}
.f-lado{border:1px solid var(--linha);background:var(--carvao);padding:28px 24px;display:flex;flex-direction:column;}
/* Os dois assets têm naturezas diferentes: o Hermes é a marca da NOUS RESEARCH,
   line-art preto sobre FUNDO BRANCO; o Alfred é PNG recortado, sem fundo. Solto
   no breu, o Hermes vira um retângulo branco gritando ao lado de uma figura
   flutuando, e a assimetria destrói o argumento de que são o mesmo Agente.
   A solução é dar a AMBOS a mesma placa: mesmo tamanho, mesmo raio, mesma
   borda. O Hermes preenche a placa (o branco dele passa a ser a placa), e o
   Alfred recebe a mesma placa em tom claro para os dois pesarem igual. */
.f-lado-fig{
  height:150px;display:flex;align-items:center;justify-content:center;margin:0 0 22px;
}
.f-lado-plaqueta{
  width:150px;height:150px;border-radius:3px;overflow:hidden;
  display:flex;align-items:center;justify-content:center;
  background:var(--osso);border:1px solid var(--linha);
}
.f-lado-plaqueta img{
  width:100%;height:100%;display:block;object-fit:contain;
}
.f-lado-nome{font-family:var(--display);font-weight:800;font-size:1.5rem;color:var(--ambar);margin:0 0 4px;letter-spacing:-.01em;}
.f-lado-estado{
  font-family:var(--ui);font-weight:500;font-size:.66rem;letter-spacing:.2em;
  text-transform:uppercase;color:var(--osso2);margin:0 0 18px;
}
.f-lado ul{list-style:none;margin:0;padding:0;border-top:1px solid var(--linha);}
.f-lado li{
  font-size:.93rem;line-height:1.6;color:var(--osso2);
  padding:12px 0 12px 18px;border-bottom:1px solid var(--linha);position:relative;
}
.f-lado li::before{
  content:"";position:absolute;left:0;top:1.15em;width:7px;height:1px;background:var(--ambar);
}
.f-dupla-fecho{
  font-family:var(--display);font-weight:200;font-size:clamp(1.4rem,3.4vw,2.1rem);
  line-height:1.16;letter-spacing:-.025em;color:var(--osso);margin:38px 0 0;max-width:22ch;
}
.f-dupla-fecho b{font-weight:800;color:var(--ambar);}

/* faq */
.f-faq{border-top:1px solid var(--linha);margin:30px 0 0;}
.f-faq details{border-bottom:1px solid var(--linha);}
.f-faq summary{
  cursor:pointer;list-style:none;padding:20px 34px 20px 0;position:relative;
  font-family:var(--display);font-weight:400;font-size:1.02rem;color:var(--osso);
}
.f-faq summary::-webkit-details-marker{display:none;}
.f-faq summary::after{
  content:"+";position:absolute;right:4px;top:50%;transform:translateY(-50%);
  color:var(--ambar);font-size:1.3rem;font-weight:200;
}
.f-faq details[open] summary::after{content:"–";}
.f-faq p{margin:0 0 22px;font-size:.97rem;line-height:1.72;color:var(--osso2);max-width:62ch;}

/* oferta / cta grande */
.f-caixa{border:1px solid var(--linha);background:var(--carvao);padding:36px 26px;}
@media(min-width:760px){.f-caixa{padding:48px 44px;}}
.f-preco{font-family:var(--display);font-weight:200;font-size:clamp(3rem,10vw,5.4rem);line-height:.94;letter-spacing:-.045em;color:var(--osso);margin:0 0 8px;}
.f-preco b{font-weight:800;color:var(--ambar);}
.f-cta{
  display:inline-flex;align-items:center;justify-content:center;gap:12px;width:100%;
  background:var(--ambar);color:#1A1206;text-decoration:none;text-align:center;
  font-family:var(--ui);font-weight:700;font-size:1.02rem;letter-spacing:.02em;
  padding:20px 30px;border-radius:2px;margin:26px 0 0;
}
.f-cta:hover{background:#F2B667;}
.f-nota{font-size:.82rem;line-height:1.6;color:var(--osso2);margin:16px 0 0;}

.f-rodape{padding:52px 0 68px;border-top:1px solid var(--linha);}
.f-rodape p{font-size:.8rem;line-height:1.8;color:var(--osso2);margin:0;}

@media(prefers-reduced-motion:reduce){
  .f-dica i{animation:none;}
  .f-ov{transition:none;}
}

/* ============ CELULAR · O FILME VIRA SEQUÊNCIA DE MOMENTOS ==================
   Abaixo de 900px o scrub não roda (o gate no JS corta antes de baixar quadro),
   e o desenho de desktop não sobrevive à queda: as cenas eram 100svh com a
   imagem em cover por baixo do texto, e isso no telefone dá dois problemas
   medidos em 02/09, em 390x844:

     1. CORREDOR VAZIO. A trilha guardava 4.220px de altura só pra dar percurso
        ao canvas. Sem canvas, são 5 telas de rolagem em cima de nada.
     2. ENQUADRAMENTO. As cenas são 1920x1080 e foram compostas em 16:9, com a
        informação nas laterais. Em cover num viewport de 375 de largura sobra
        25% do quadro: 563px cortados de cada lado. O que resta é uma tira do
        meio que não conta a cena.

   O desenho daqui não é o de desktop encolhido. É o formato que o público do
   Red já consome no telefone: imagem, hora, uma frase. A imagem ganha uma
   caixa 3:2, que preserva 84% da largura do quadro (contra 25%) sem esticar
   nada, e o texto desce pra baixo dela em vez de ficar por cima. Cena fica em
   torno de 60vh, então a de baixo aparece na borda e convida a rolar. */
@media(max-width:900px){
  /* a trilha não reserva mais altura de canvas: o height inline só entra no
     modo cinema, e aqui ele nunca liga */
  .f-cena{
    min-height:0;display:block;padding:0 0 34px;overflow:visible;
  }
  /* o véu de gradiente existia pra dar leitura ao texto POR CIMA da foto.
     Com o texto embaixo ele só escurece a imagem de graça. */
  .f-cena::after{content:none;}

  .f-cena-img{
    position:relative;inset:auto;
    width:100%;height:auto;aspect-ratio:3/2;object-fit:cover;
    /* o centro-alto do quadro é onde estão o Red e as telas nas 5 cenas;
       ancorar em 50% do topo perde a bancada, ancorar no fundo perde o rosto */
    object-position:50% 42%;
    display:block;
  }
  .f-cena-txt{padding:22px 22px 0;max-width:none;}

  .f-hora{font-size:.66rem;margin:0 0 12px;}
  .f-hora::before{width:18px;}

  .f-titulo{
    font-size:clamp(1.55rem,7.2vw,2.15rem);line-height:1.1;letter-spacing:-.028em;
    max-width:none;
  }

  .f-cena-cta{
    margin-top:22px;width:100%;justify-content:center;
    font-size:.9rem;padding:16px 22px;
  }

  /* a primeira cena ganha uma respiração acima: é a primeira coisa da página */
  .f-cena:first-child{padding-top:14px;}
  /* linha de corte entre as cenas: sem o gradiente, elas encostavam uma na
     outra sem nada dizendo onde uma acaba */
  .f-cena + .f-cena{border-top:1px solid var(--linha);padding-top:30px;}

  /* entrada leve: a cena sobe 14px quando entra na tela. Só isso. */
  .f-cena[data-rv="arm"]{opacity:0;transform:translateY(14px);}
  .f-cena[data-rv="on"]{
    opacity:1;transform:none;
    transition:opacity .6s cubic-bezier(.4,0,.2,1),transform .6s cubic-bezier(.4,0,.2,1);
  }

  .f-faixa{padding:62px 0;}
  .f-in{padding:0 22px;}
  .f-caixa{padding:30px 22px;}
  .f-bump{padding:22px 20px;}

  /* ---- CTA fixo no rodapé -----------------------------------------------
     Medido antes da correção: o primeiro botão de compra ficava em 2.374px,
     quase 3 telas abaixo do topo, e o de fechamento em 13.347px. Num tráfego
     que chega de Instagram e sai na primeira dúvida, a oferta precisa estar
     a um toque de distância o tempo todo. A barra entra depois da primeira
     cena (o React liga o data-barra) pra não cobrir a abertura. */
  .f-barra{
    position:fixed;left:0;right:0;bottom:0;z-index:40;
    display:flex;align-items:center;gap:14px;
    padding:12px 16px calc(12px + env(safe-area-inset-bottom,0px));
    background:rgba(6,6,7,.93);
    -webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);
    border-top:1px solid var(--linha);
    transform:translateY(102%);transition:transform .34s cubic-bezier(.4,0,.2,1);
  }
  .f-barra[data-on="1"]{transform:none;}
  .f-barra-preco{
    font-family:var(--display);font-weight:800;font-size:1.32rem;
    color:var(--osso);line-height:1;flex:0 0 auto;
  }
  .f-barra-preco small{
    display:block;font-family:var(--ui);font-weight:500;font-size:.58rem;
    letter-spacing:.18em;text-transform:uppercase;color:var(--osso2);
    margin-top:5px;
  }
  .f-barra a{
    flex:1;display:flex;align-items:center;justify-content:center;
    background:var(--ambar);color:#1A1206;text-decoration:none;
    font-family:var(--ui);font-weight:700;font-size:.88rem;letter-spacing:.01em;
    padding:15px 12px;border-radius:2px;
  }
  /* o rodapé precisa caber acima da barra, senão o CNPJ fica embaixo dela */
  .f-rodape{padding-bottom:calc(68px + 78px);}
}

/* a barra é só de celular: acima de 900px o CTA da cena já viaja com o filme */
@media(min-width:901px){.f-barra{display:none;}}

@media(prefers-reduced-motion:reduce){
  .f-cena[data-rv="arm"]{opacity:1;transform:none;}
  .f-barra{transition:none;}
}
`;

/* ===========================================================================
 *  VÍDEO DA PROVA  ·  carregamento sob demanda
 * ---------------------------------------------------------------------------
 *  O arquivo tem 1,28 MB. Numa página que recebe tráfego pago em celular, um
 *  <video preload="auto"> no meio do documento compete por banda com a cena 1
 *  e com os quadros do scrub, que é justamente o que a Parte 1 desta página
 *  foi desenhada pra evitar.
 *
 *  A solução tem duas camadas, e nenhuma delas depende de JS pra página fazer
 *  sentido:
 *
 *   1. o <source> não nasce no HTML. O elemento renderiza só com o poster até
 *      o IntersectionObserver dizer que a seção chegou perto do viewport
 *      (rootMargin 200px: começa a baixar um pouco ANTES de aparecer, pra não
 *      mostrar um retângulo vazio pro visitante). Sem o source, o navegador
 *      não pede byte nenhum do mp4, e `preload="metadata"` só vale depois.
 *
 *   2. play/pause acompanham a visibilidade. Saiu da tela, pausa. Um vídeo em
 *      loop decodificando fora de vista queima bateria de graça no celular.
 *
 *  prefers-reduced-motion: nada de autoplay. Mostra o poster e um botão de
 *  play explícito. Quem pediu menos movimento decide se quer o movimento.
 * ======================================================================== */
function VideoProva() {
  const { video } = OFERTA;
  const caixa = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  // só vira true quando a seção se aproxima: é o gatilho do download
  const [carregar, setCarregar] = useState(false);
  // null = ainda não sabemos (SSR). Evita renderizar o botão de play e depois
  // arrancá-lo, ou o contrário, no primeiro quadro do cliente.
  const [reduzido, setReduzido] = useState<boolean | null>(null);
  const [tocando, setTocando] = useState(false);

  useEffect(() => {
    const menos =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduzido(menos);

    const el = caixa.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setCarregar(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entradas) => {
        const dentro = Boolean(entradas[0]?.isIntersecting);
        // Sob movimento reduzido o <source> NÃO entra aqui. Testado em
        // 02/09: com o source no DOM, preload="metadata" já dispara uma
        // requisição do mp4 mesmo sem tocar nada. Quem pediu menos movimento
        // não deve pagar banda por um vídeo que não vai rodar sozinho; o
        // download começa no clique do botão.
        if (dentro && !menos) setCarregar(true);

        const v = vid.current;
        if (!v || menos) return;
        if (dentro) {
          // play() rejeita em alguns navegadores se a aba está oculta ou se a
          // política de autoplay mudou. Sem catch isso vira unhandled rejection
          // no console, e o console limpo é parte da entrega.
          void v.play().then(
            () => setTocando(true),
            () => setTocando(false),
          );
        } else {
          v.pause();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const autoplay = reduzido === false;

  return (
    <div className="f-tv-figura" ref={caixa}>
      <div className="f-tv-caixa">
      <video
        ref={vid}
        muted
        playsInline
        loop
        autoPlay={autoplay}
        preload="metadata"
        poster={video.poster}
        width={video.largura}
        height={video.altura}
        aria-label={video.aria}
        onPlay={() => setTocando(true)}
        onPause={() => setTocando(false)}
      >
        {carregar ? <source src={video.src} type="video/mp4" /> : null}
      </video>

      {reduzido === true && !tocando ? (
        <button
          type="button"
          className="f-tv-play"
          onClick={() => {
            const v = vid.current;
            if (!v) return;
            // Não espera o React commitar o <source> pra depois dar play: em
            // modo concorrente esse commit pode cair depois do rAF e o play()
            // rodaria num elemento ainda sem fonte. Aponta a src direto no
            // elemento (o <source> que o React insere logo em seguida é o
            // mesmo arquivo, então não há segunda requisição) e toca.
            setCarregar(true);
            if (!v.currentSrc) v.src = video.src;
            void v.play().then(
              () => setTocando(true),
              () => setTocando(false),
            );
          }}
        >
          <span aria-hidden="true">
            <svg width="11" height="13" viewBox="0 0 11 13" fill="currentColor" aria-hidden="true">
              <path d="M0 0v13l11-6.5z" />
            </svg>
            Assistir
          </span>
        </button>
        ) : null}
      </div>

      <p className="f-tv-hora">{video.carimbo}</p>
    </div>
  );
}

/* ===========================================================================
 *  CELULAR  ·  revelação das cenas + barra de compra
 * ---------------------------------------------------------------------------
 *  Um único efeito, e só abaixo de 900px, porque acima disso quem conduz a
 *  Parte 1 é o scrub e duas coisas disputando a rolagem é exatamente o que o
 *  arsenal proíbe.
 *
 *   · REVELAÇÃO: mesma primitiva do movimento.tsx (IntersectionObserver com
 *     gatilho equivalente a "top 80%", once: true). Marca data-rv no próprio
 *     elemento e deixa o CSS decidir o que isso significa. O estado escondido
 *     só é aplicado DEPOIS de montar: sem JS a página fica completa.
 *
 *   · BARRA: liga quando a primeira cena sai da tela. Antes disso ela taparia
 *     a abertura, que é o único momento em que a página tem uma tela inteira
 *     pra causar. Depois, fica.
 * ======================================================================== */
function useMobile(raiz: React.RefObject<HTMLDivElement | null>) {
  const [barra, setBarra] = useState(false);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (!window.matchMedia("(max-width: 900px)").matches) return;

    const menos = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const limpar: Array<() => void> = [];

    if (!menos) {
      const cenas = Array.from(el.querySelectorAll<HTMLElement>(".f-cena"));
      // a cena 1 já está na tela ao carregar: revelá-la seria um flash
      for (const c of cenas.slice(1)) c.setAttribute("data-rv", "arm");

      const obs = new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) {
            if (!e.isIntersecting) continue;
            (e.target as HTMLElement).setAttribute("data-rv", "on");
            obs.unobserve(e.target); // once: true
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -12% 0px" },
      );
      for (const c of cenas.slice(1)) obs.observe(c);
      limpar.push(() => {
        obs.disconnect();
        for (const c of cenas) c.removeAttribute("data-rv");
      });
    }

    /* A barra segue a POSIÇÃO da rolagem, não a visibilidade da primeira cena.
       Com IntersectionObserver na cena 1 ela ficava presa em aberto ao voltar
       pro topo (testado em 02/09): a cena tem 419px, cabe inteira na tela junto
       com parte da cena 2, e o observer não reentrega o estado de forma
       confiável depois que a revelação mexe no transform do vizinho.
       Comparar scrollY com a altura da primeira cena é determinístico: some
       enquanto a abertura está em cena, aparece depois dela, sempre. */
    const primeira = el.querySelector<HTMLElement>(".f-cena");
    if (primeira) {
      let pedido = 0;
      const medir = () => {
        pedido = 0;
        // -80px: a barra entra um pouco antes do fim da cena 1, senão ela
        // aparece exatamente quando o título sai e o movimento chama atenção
        // pro lugar errado
        setBarra(window.scrollY > primeira.offsetHeight - 80);
      };
      const agendar = () => {
        if (!pedido) pedido = requestAnimationFrame(medir);
      };
      medir();
      addEventListener("scroll", agendar, { passive: true });
      addEventListener("resize", agendar);
      limpar.push(() => {
        removeEventListener("scroll", agendar);
        removeEventListener("resize", agendar);
        if (pedido) cancelAnimationFrame(pedido);
      });
    }

    return () => {
      for (const f of limpar) f();
    };
  }, [raiz]);

  return barra;
}

export function LpF() {
  const raiz = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const trilha = useRef<HTMLDivElement>(null);
  const [cinema, setCinema] = useState(false);
  // true quando a rolagem passou do fim da trilha: o palco solta a tela
  const [fim, setFim] = useState(false);
  const barra = useMobile(raiz);

  useEffect(() => {
    /* ------------------------------------------------------------------
       Portões antes de baixar um único quadro. Qualquer um que falhe
       mantém a página no modo estático, que é completo e legível.
       ------------------------------------------------------------------ */
    if (TOTAL_FRAMES <= 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 900px)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // conexão ruim ou economia de dados: não cobra 8 MB de quem não pediu
    const con = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (con?.saveData) return;
    if (con?.effectiveType && !/4g/.test(con.effectiveType)) return;

    const el = raiz.current;
    const cv = canvas.current;
    const tr = trilha.current;
    if (!el || !cv || !tr) return;
    const ctx = cv.getContext("2d", { alpha: false });
    if (!ctx) return;

    let vivo = true;
    let raf = 0;
    const quadros: HTMLImageElement[] = [];
    let atual = 0;
    let alvo = 0;
    let ultimo = -1;

    const caminho = (i: number) =>
      FRAME_PATH.replace("%04d", String(i + 1).padStart(4, "0"));

    function dimensionar() {
      if (!cv || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(innerWidth * dpr);
      cv.height = Math.round(innerHeight * dpr);
      cv.style.width = innerWidth + "px";
      cv.style.height = innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function desenhar(i: number) {
      if (!ctx) return;
      const img = quadros[Math.max(0, Math.min(TOTAL_FRAMES - 1, i))];
      if (!img || !img.complete || !img.naturalWidth) return;
      const lw = innerWidth;
      const lh = innerHeight;

      /* MODO DE ENQUADRAMENTO — teste sem custo, troque ?fit= na URL
         cover   = preenche a tela cortando as laterais (o que estava)
         contain = mostra o frame inteiro, sem corte e sem esticar
         nativo  = desenha 1:1 no tamanho real do frame, centralizado */
      const modo = new URLSearchParams(location.search).get("fit") || "contain";

      ctx.clearRect(0, 0, lw, lh);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      if (modo === "nativo") {
        const dw = Math.min(iw, lw);
        const dh = dw * (ih / iw);
        ctx.drawImage(img, 0, 0, iw, ih, (lw - dw) / 2, (lh - dh) / 2, dw, dh);
        return;
      }

      if (modo === "contain") {
        const esc = Math.min(lw / iw, lh / ih);
        const dw = iw * esc;
        const dh = ih * esc;
        ctx.drawImage(img, 0, 0, iw, ih, (lw - dw) / 2, (lh - dh) / 2, dw, dh);
        return;
      }

      const rt = lw / lh;
      const ri = iw / ih;
      let sx: number, sy: number, sw: number, sh: number;
      if (ri > rt) {
        sh = ih;
        sw = sh * rt;
        sx = (iw - sw) / 2;
        sy = 0;
      } else {
        sw = iw;
        sh = sw / rt;
        sx = 0;
        sy = (ih - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, lw, lh);
    }

    /* overlays: mostra o item cuja faixa contém o progresso atual.
       ------------------------------------------------------------------
       Dois defeitos foram corrigidos aqui em 02/09, os dois medidos no ar:

       1. A CENA 5 NUNCA APARECIA. A faixa dela é 93→100 e o teste era
          `pct < ate`. No fim da trilha pct chega a 100 exatos, 100 < 100 é
          falso, e o último texto da página, que é justamente o nome do
          evento, ficava invisível. A última faixa agora fecha em <=.

       2. BURACOS ENTRE AS CENAS. As faixas do roteiro têm intervalos de
          propósito (20→23, 44→48, 69→73, 90→93): é o miolo da transição,
          onde o vídeo está passando de uma cena pra outra. Só que ali
          nenhum overlay ficava ligado e a tela passava alguns instantes
          sem texto nenhum. Agora, quando o progresso cai num buraco, vale
          a última faixa que começou. O texto sai de cena junto com a
          imagem dele, não antes.
       ------------------------------------------------------------------ */
    const ovs = Array.from(el.querySelectorAll<HTMLElement>("[data-ov]"));
    const ultimo_i = ovs.length - 1;
    function overlays(pct: number) {
      let ativo = -1;
      for (let i = 0; i < ovs.length; i++) {
        const de = Number(ovs[i].dataset.de);
        const ate = Number(ovs[i].dataset.ate);
        const dentro = i === ultimo_i ? pct >= de && pct <= ate : pct >= de && pct < ate;
        if (dentro) {
          ativo = i;
          break;
        }
        // caiu depois do fim desta faixa: ela é a candidata a "última que
        // começou", até que a próxima assuma
        if (pct >= de) ativo = i;
      }
      for (let i = 0; i < ovs.length; i++) {
        ovs[i].dataset.on = i === ativo ? "1" : "0";
      }
    }

    function calcular() {
      if (!tr) return;
      const total = tr.offsetHeight - innerHeight;
      /* O progresso satura ANTES do fim da trilha, e isso é de propósito.
         ------------------------------------------------------------------
         Medido em 02/09, 1440x900: com o alvo mapeado linearmente até o
         último pixel da trilha, as cenas 4 e 5 nunca chegavam a ser lidas.
         Dois motivos somados:

           · o `atual` é suavizado com lerp 0.1, então ele CHEGA no alvo
             sempre um pouco depois. No fim da trilha o alvo já é 1, mas o
             desenhado ainda está por volta de 0,8;
           · o `fim` disparava no mesmo pixel em que o alvo chegava a 1 e
             escondia a camada de texto. O overlay da cena 5 tinha, na
             prática, zero pixel de rolagem pra aparecer.

         A correção dá uma cauda de 12% da trilha: o filme termina (alvo = 1)
         faltando ainda 12% pra rolar, e é essa sobra que o lerp usa pra
         alcançar e a cena 5 usa pra ser lida antes do palco soltar a tela. */
      const CAUDA = 0.12;
      const util = total * (1 - CAUDA);
      alvo = util <= 0 ? 0 : Math.max(0, Math.min(1, window.scrollY / util));
      // passou do fim da trilha: libera o palco pra oferta ocupar a tela
      setFim(window.scrollY >= total);
    }

    /* A suavização é por TEMPO, não por quadro.
       ---------------------------------------------------------------------
       Era `atual += (alvo - atual) * 0.1` a cada requestAnimationFrame, o que
       só converge rápido se o rAF estiver rodando a 60fps. Não é o caso aqui:
       cada quadro do loop decodifica e desenha um JPEG de 1280px no canvas, e
       isso derruba a taxa muito abaixo de 60. Medido na build de produção em
       02/09: parado no fim da trilha, com o alvo já em 1, o filme levava mais
       de 8 SEGUNDOS pra arrastar da cena 2 até a 4, e parava ali. Na prática
       as cenas 4 e 5 não eram alcançáveis rolando normal, que é o mesmo
       sintoma que parecia "imagem que não carrega".

       Com o passo corrigido pelo delta de tempo, a resposta é a mesma em
       qualquer taxa de quadros: o valor cobre ~90% da distância em 0,25s,
       independente de o rAF estar entregando 60fps ou 15. */
    const RESPOSTA = 0.25; // segundos para cobrir ~90% da distância
    let tAnterior = 0;

    function loop(t: number) {
      if (!vivo) return;
      const dt = tAnterior ? Math.min((t - tAnterior) / 1000, 0.1) : 1 / 60;
      tAnterior = t;

      // fator exponencial: equivalente ao lerp, mas ancorado no relógio
      const k = 1 - Math.exp(-dt / (RESPOSTA / 2.3));
      atual += (alvo - atual) * k;
      if (Math.abs(alvo - atual) < 0.0004) atual = alvo;

      const i = Math.round(atual * (TOTAL_FRAMES - 1));
      if (i !== ultimo) {
        desenhar(i);
        ultimo = i;
      }
      overlays(atual * 100);
      raf = requestAnimationFrame(loop);
    }

    /* Baixa os quadros em segundo plano. A página já está pintada e usável
       enquanto isso: nada aqui bloqueia a primeira cena. */
    let prontos = 0;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = img.onerror = () => {
        if (!vivo) return;
        if (++prontos === TOTAL_FRAMES) {
          dimensionar();
          calcular();
          desenhar(0);
          overlays(0);
          setCinema(true);
          raf = requestAnimationFrame(loop);
        }
      };
      img.src = caminho(i);
      quadros[i] = img;
    }

    const aoRolar = () => calcular();
    const aoRedimensionar = () => {
      // saiu da faixa de desktop no meio do caminho: devolve o estático
      if (window.matchMedia("(max-width: 900px)").matches) {
        setCinema(false);
        return;
      }
      dimensionar();
      calcular();
      ultimo = -1;
    };
    addEventListener("scroll", aoRolar, { passive: true });
    addEventListener("resize", aoRedimensionar);

    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      removeEventListener("scroll", aoRolar);
      removeEventListener("resize", aoRedimensionar);
    };
  }, []);

  const alturaTrilha =
    TOTAL_FRAMES > 0 ? TOTAL_FRAMES * PX_POR_QUADRO : undefined;

  return (
    <div
      ref={raiz}
      className={`f ${display.variable} ${ui.variable}${cinema ? " cinema" : ""}${
        fim ? " fim" : ""
      }`}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Pixel v="F" />

      {/* ============ PARTE 1 · O FILME ============ */}
      <div
        className="f-filme"
        ref={trilha}
        style={cinema && alturaTrilha ? { height: alturaTrilha } : undefined}
      >
        {CENAS.map((c) => (
          <section className="f-cena" key={c.n} aria-label={`Cena ${c.n}`}>
            <img
              className="f-cena-img"
              src={c.img}
              alt={c.alt}
              width={1920}
              height={1080}
              /* a cena 1 é a primeira pintura da página e vem com prioridade;
                 as outras podem esperar a rolagem */
              loading={c.n === 1 ? "eager" : "lazy"}
              fetchPriority={c.n === 1 ? "high" : "low"}
              decoding={c.n === 1 ? "sync" : "async"}
            />
            <div className="f-cena-txt">
              <p className="f-hora">{c.hora}</p>
              <h1 className="f-titulo" style={c.n > 1 ? { fontSize: undefined } : undefined}>
                {c.titulo}
              </h1>
              {c.n >= 3 && (
                <a className="f-cena-cta hw-acao" href={CHECKOUT}>
                  {OFERTA.ctaTopo}
                </a>
              )}
            </div>
            {c.n === 1 && (
              <div className="f-dica" aria-hidden="true">
                <span>role</span>
                <i />
              </div>
            )}
          </section>
        ))}
      </div>

      {/* canvas do scrub, só existe no modo cinema */}
      <div className="f-palco" aria-hidden="true">
        <canvas className="f-tela" ref={canvas} />
      </div>
      <div className="f-veu" aria-hidden="true" />
      <div className="f-camada" aria-hidden={!cinema}>
        <div style={{ width: "100%" }}>
          {CENAS.map((c) => (
            <div
              className="f-ov"
              key={c.n}
              data-ov=""
              data-de={c.de}
              data-ate={c.ate}
              data-on="0"
            >
              <div className="f-cena-txt">
                <p className="f-hora">{c.hora}</p>
                <p className="f-titulo">{c.titulo}</p>
                {c.n >= 3 && (
                  <a className="f-cena-cta hw-acao" href={CHECKOUT}>
                    {OFERTA.ctaTopo}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ PARTE 2 · A OFERTA ============ */}
      <div className="f-of">
        <section className="f-faixa">
          <div className="f-in f-col">
            <p className="f-rot">O que aconteceu ali</p>
            <h2 className="f-h2">
              A diferença entre uma IA que responde e uma que <b>trabalha sem você mandar</b>
            </h2>
            <p className="f-p">
              Um Hermes Agent trabalha enquanto você não está olhando. Tem um processo rodando, tem
              um lugar onde ele mora, tem log do que ele fez ontem.
            </p>
            <p className="f-p">
              Você programa a tarefa, fecha tudo, vai dormir, e quando volta ela está feita. Com
              chat isso não acontece, porque se você fecha a aba a conversa morreu no meio do
              caminho. <b>O trabalho de lembrar sai de você.</b>
            </p>
          </div>
        </section>

        {/* Hermes × Alfred. Vem logo depois da seção que explica o que é um
            agente, porque é aqui que o leitor acabou de ouvir os dois nomes
            (Hermes no título do evento, Alfred na prova) e precisa saber que
            são a mesma coisa em momentos diferentes. */}
        <section className="f-faixa">
          <div className="f-in">
            <div className="f-col">
              <p className="f-rot">{DUPLA.rotulo}</p>
              <h2 className="f-h2">
                O mesmo Agente, em <b>dois momentos</b>
              </h2>
              <p className="f-p">{DUPLA.intro}</p>
            </div>

            <div className="f-dupla">
              {DUPLA.lados.map((l) => (
                <div className="f-lado" key={l.chave}>
                  <div className="f-lado-fig">
                    <div className="f-lado-plaqueta">
                      <img
                        src={l.img}
                        alt={l.alt}
                        width={l.chave === "hermes" ? 720 : 683}
                        height={720}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                  <p className="f-lado-nome">{l.nome}</p>
                  <p className="f-lado-estado">{l.estado}</p>
                  <ul>
                    {l.linhas.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="f-dupla-fecho">
              O seu vai ter o <b>nome que você quiser</b>.
            </p>
          </div>
        </section>

        <section className="f-faixa">
          <div className="f-in">
            <div className="f-col">
              <p className="f-rot">Os cinco dias</p>
              <h2 className="f-h2">
                Cinco aulas, uma por dia, das <b>20h às 20h50</b>
              </h2>
            </div>
            <dl className="f-dias">
              {OFERTA.dias.map((d) => (
                <div className="f-dia" key={d.dia}>
                  <dt>{d.dia}</dt>
                  <dd>{d.saida}</dd>
                </div>
              ))}
            </dl>
            <p className="f-p" style={{ marginTop: 26 }}>
              {OFERTA.sabado}
            </p>
          </div>
        </section>

        <section className="f-faixa">
          <div className="f-in">
            <div className="f-col">
              <p className="f-rot">A prova</p>
              <h2 className="f-h2">
                Enquanto você ainda não entrou na Hermes Week, deixa eu te mostrar o{" "}
                <b>Alfred</b> trabalhando
              </h2>
              <p className="f-p">
                Não tenho depoimento de aluno porque o primeiro ciclo é esse. O que eu tenho é o
                meu rodando todo dia.
              </p>
            </div>

            {/* O vídeo carrega o argumento sozinho: 25 e-mails entraram, 3
                saíram com nome e horário, e ele para antes de responder por
                mim. A copy aqui só diz onde olhar. Explicar o que o vídeo
                mostra seria pedir pro visitante ler em vez de assistir. */}
            <div className="f-tv">
              <VideoProva />

              <div className="f-tv-texto">
                <p className="f-p">
                  Hoje de manhã pedi pra ele olhar minha caixa de entrada. Eram{" "}
                  <b>25 e-mails</b>. Repare no que ele decidiu que eu precisava ver.
                </p>

                <div className="f-provas">
                  {OFERTA.prova.map((p) => (
                    <div className="f-prova" key={p.numero}>
                      <span className="f-prova-n">{p.numero}</span>
                      <p className="f-prova-t">{p.texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="f-faixa">
          <div className="f-in f-col">
            <p className="f-rot">Pra quem não é</p>
            <h2 className="f-h2">
              Se você só usa IA duas vezes por semana, <b>não compra</b>
            </h2>
            <p className="f-p">
              Um agente compensa quando a memória tem tempo de acumular. Se você não usa todo dia,
              vai demorar muito mais pra ele te devolver algo relevante.
            </p>
            <p className="f-p">
              Isso é pra quem já usa IA o suficiente pra ter percebido que ela devia estar fazendo
              mais.
            </p>
          </div>
        </section>

        <section className="f-faixa">
          <div className="f-in">
            <div className="f-caixa">
              <p className="f-rot">{OFERTA.produto}</p>
              <p className="f-preco">
                <b>{OFERTA.preco}</b>
              </p>
              <p className="f-p" style={{ margin: "18px 0 0", maxWidth: "46ch" }}>
                Cinco aulas, uma por dia, 20h. Sessão de dúvidas ao vivo no sábado, 10h. As aulas
                ficam disponíveis por um ano.
              </p>
              <a className="f-cta hw-acao" href={CHECKOUT}>
                {OFERTA.ctaOferta}
              </a>
              <p className="f-nota">Garantia de {OFERTA.garantia}</p>
            </div>

            <div style={{ marginTop: 44 }}>
              <p className="f-rot">No checkout você pode adicionar</p>
              <div className="f-bumps">
                {OFERTA.bumps.map((b) => (
                  <div className="f-bump" key={b.nome}>
                    <h3>{b.nome}</h3>
                    <span>{b.preco}</span>
                    <p className="f-bump-dor">{b.problema}</p>
                    <p>{b.texto}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="f-faixa">
          <div className="f-in f-col">
            <p className="f-rot">O que é escasso aqui</p>
            <h2 className="f-h2 larga">
              Nada de <b>contador na tela</b> pra fazer você achar que as vagas estão acabando
            </h2>
            <p className="f-p">
              O que pode acabar aqui é esse preço. <b>Esse preço é de quem entra no começo.</b> A
              cada ciclo o material fica melhor, o grupo fica maior, e o preço acompanha.
            </p>
            <p className="f-p">
              <b>A auditoria tem dez vagas de verdade</b>, porque quem lê sou eu.
            </p>
            <p className="f-p">
              O que não é escasso: as aulas. Elas ficam no ar por um ano.
            </p>
          </div>
        </section>

        <section className="f-faixa">
          <div className="f-in f-col">
            <p className="f-rot">O que você vai perguntar</p>
            <div className="f-faq">
              {OFERTA.faq.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="f-faixa">
          <div className="f-in f-col">
            <h2 className="f-h2">
              Quem tem uma que trabalha não sabe mais programar que você. Tem uma{" "}
              <b>instalação bem feita</b>
            </h2>
            <p className="f-p">Segunda que vem, às 20h, a gente começa.</p>
            <a className="f-cta hw-acao" href={CHECKOUT} style={{ maxWidth: 460 }}>
              {OFERTA.ctaTopo}
            </a>
          </div>
        </section>

        <footer className="f-rodape">
          <div className="f-in">
            <p>
              {OFERTA.evento}
              <br />
              {OFERTA.rodape.razao} · {OFERTA.rodape.cnpj} · {OFERTA.rodape.suporte}
            </p>
          </div>
        </footer>
      </div>

      {/* barra de compra do celular. Fora do .f-of pra não herdar o z-index
          da oferta, e depois do rodapé pra ser o último foco do teclado. */}
      <div className="f-barra" data-on={barra ? "1" : "0"} aria-hidden={!barra}>
        <p className="f-barra-preco">
          {OFERTA.preco}
          <small>Hermes Week</small>
        </p>
        <a className="hw-acao" href={CHECKOUT} tabIndex={barra ? 0 : -1}>
          Quero meu agente
        </a>
      </div>
    </div>
  );
}

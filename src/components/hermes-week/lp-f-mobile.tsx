"use client";

/* ============================================================================
 *  LP F · CELULAR
 * ----------------------------------------------------------------------------
 *  POR QUE ESTE ARQUIVO EXISTE
 *
 *  A LP F é um filme conduzido pela rolagem. No desktop isso funciona: o canvas
 *  fixo troca 244 quadros enquanto a página rola, e o visitante vê UMA cena se
 *  transformando na seguinte. É contínuo, e a continuidade é o argumento.
 *
 *  No celular o scrub não roda (custa 6 MB e o toque não tem a resolução de
 *  rolagem que o scrub precisa). A primeira tentativa foi empilhar as 5 cenas
 *  verticalmente com a imagem e o texto embaixo. As métricas aprovaram: 13,5
 *  telas, zero rolagem horizontal, 84% do quadro preservado.
 *
 *  E estava errado. Empilhado vertical, cada cena vira um cartão isolado, e
 *  cinco cartões isolados um embaixo do outro são um ÁLBUM DE FOTOS, não um
 *  filme. O que se perdeu na tradução não foi qualidade de imagem: foi a
 *  RELAÇÃO entre as cenas. Nenhuma métrica de altura, rolagem ou carregamento
 *  captura isso, e foi por isso que elas passaram enquanto a página reprovava.
 *
 *  A TRADUÇÃO CORRETA
 *
 *  Um filme no celular não é rolagem vertical. É o gesto que o público do Red
 *  já faz cem vezes por dia: DESLIZAR PRO LADO. Stories, carrossel do
 *  Instagram, feed do TikTok. O dedo deslizando é o equivalente tátil do corte
 *  de cena.
 *
 *  Então as 5 cenas ocupam UMA tela e viram um carrossel horizontal com
 *  scroll-snap nativo. O que amarra a narrativa é o HORÁRIO: 03h47 → 03h51 →
 *  05h20 → 06h05 → 09h30. Ele fica grande, em âmbar, no alto de cada slide, e
 *  é o que faz o visitante entender em três segundos que isso é uma noite
 *  contada, não cinco fotos avulsas. A barra de progresso reforça: são 5
 *  momentos de uma coisa só, e você está no 2º.
 *
 *  O QUE DIZ QUE DÁ PRA DESLIZAR, SEM ESCREVER "DESLIZE"
 *    · o slide seguinte espia 26px na borda direita (peek)
 *    · os 5 pontinhos embaixo, com o ativo alongado
 *    · o contador "1 / 5" ao lado do horário
 *  Três sinais redundantes. Instrução escrita seria admitir que o desenho falhou.
 *
 *  IMAGENS: recortadas em RETRATO, com o foco escolhido cena a cena
 *
 *  A versão anterior manteve o 16:9 do arquivo intacto, argumentando que
 *  cortá-lo devolveria o problema da versão empilhada. Medido em produção
 *  (390x844): quadro de 324x182, proporção 1.778 contra 1.778 do arquivo.
 *  Geometricamente perfeito, e reprovado assim mesmo, porque o problema nunca
 *  foi distorção. 182px de altura numa tela de 844 são 21% do celular: uma
 *  tirinha. As cenas são noturnas e cheias de detalhe em sombra, e nessa
 *  altura o rosto, a luz da tela e o clima viram uma mancha escura. O H2 da
 *  oferta, logo abaixo, era fisicamente maior que a foto. Numa página cujo
 *  argumento é "isto é um filme", o filme era a menor coisa da tela.
 *
 *  O 16:9 estava certo pro empilhado e errado aqui. No carrossel a imagem já
 *  tem a largura inteira do slide: o que falta não é proporção, é ALTURA.
 *
 *  Então o quadro vira retrato (4:5, com piso de 4:3 em tela baixa) e o corte
 *  é escolhido POR CENA, porque o assunto está num lugar diferente em cada
 *  uma. Centro puro funcionaria em 1, 3 e 4 e quebraria as outras duas: na 2
 *  cortaria o terminal âmbar (que é o ponto da cena) e na 5 partiria o homem
 *  no meio. Ver FOCO, logo abaixo.
 *
 *  O que se perde: as bordas laterais, que em todas as cinco são parede vazia
 *  ou sombra. O que se ganha: 405px de imagem em vez de 182, o dobro de
 *  presença, e a cena vira o assunto do slide em vez da ilustração dele.
 *  Zero geração de imagem nova.
 *
 *  A OFERTA vem depois, em HTML normal, com a MESMA copy da LP F importada de
 *  lp-f-cenas.ts. Nada aqui é reescrito: muda o desenho, não o texto.
 * ==========================================================================*/

import { useEffect, useRef, useState } from "react";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { checkoutUrl } from "./checkout";
import { Pixel } from "./comum";
import { CENAS, DUPLA, OFERTA } from "./lp-f-cenas";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "400", "800"],
  variable: "--m-display",
  display: "swap",
});
const ui = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  variable: "--m-ui",
  display: "swap",
});

const CHECKOUT = checkoutUrl("F");

/* ---------------------------------------------------------------------------
 *  FOCO · onde o corte retrato tem que cair, cena por cena
 * ---------------------------------------------------------------------------
 *  Os arquivos são 16:9 e o quadro do celular é retrato, então cover descarta
 *  as laterais. Qual lateral ele descarta é decisão de enquadramento, não
 *  default: em quatro das cinco cenas o assunto está fora do centro, e em duas
 *  o centro puro estraga a imagem.
 *
 *  Mora aqui e não em lp-f-cenas.ts de propósito: o arquivo de cenas é o
 *  contrato de copy compartilhado com o desktop, onde o quadro é 16:9 inteiro
 *  e não há corte nenhum. Isto é decisão de layout do celular.
 *
 *  Conferido cena a cena em 390x844 antes de fechar o valor.
 * ------------------------------------------------------------------------ */
const FOCO: Record<number, string> = {
  /* homem à esquerda, notebook à direita. Levemente à esquerda pra manter o
     rosto respirando sem jogar o notebook pra fora. */
  1: "46% 52%",
  /* o assunto são DOIS polos: o terminal âmbar na esquerda e o homem na
     direita. Centro puro reduzia o terminal a uma tira na borda, e o terminal
     é o que a cena está contando. */
  2: "38% 46%",
  /* monitores à esquerda, homem à direita, janela no meio. Cabe quase inteira. */
  3: "54% 48%",
  /* cadeira vazia: quem carrega a cena é a tela acesa, à esquerda. */
  4: "32% 50%",
  /* ele de pé contra a janela, à direita. No centro, o corte partia o corpo
     ao meio e cortava a caneca. */
  5: "64% 42%",
};

const CSS = `
.m{
  --breu:#060607; --carvao:#101013; --ambar:#E8A34A; --ambar-fraco:rgba(232,163,74,.12);
  --frio:#6C87A6; --osso:#F2EFE9; --osso2:#9A968F; --linha:rgba(242,239,233,.11);
  --display:var(--m-display),"Segoe UI",sans-serif;
  --ui:var(--m-ui),system-ui,sans-serif;
  background:var(--breu);color:var(--osso);font-family:var(--ui);font-weight:300;
  -webkit-font-smoothing:antialiased;overflow-x:clip;
}
.m *{box-sizing:border-box;}

/* ============ PARTE 1 · O FILME EM CARROSSEL ==============================
   Uma tela. Não cinco. */

/* O bloco do filme ocupa a tela, e o QUADRO fica com a folga.
   ---------------------------------------------------------------------------
   Histórico, porque este bloco já errou nos dois sentidos:

   1. min-height:100svh com quadro 16:9 → o conteúdo dava 357px, a pista
      esticava pra 744 e sobravam ~390px de breu entre o botão e a régua.
      Vazio desse tamanho não lê como respiro, lê como imagem que não carregou.
   2. sem altura nenhuma → some o vazio, mas o bloco inteiro fecha em 459px de
      844 e a imagem cai pra 21% da tela. Foi a versão reprovada: a metade de
      baixo da primeira tela virava parágrafo da oferta, e o filme, miniatura.

   O erro comum às duas foi tratar o quadro como tamanho fixo e deixar a folga
   cair no lugar errado (vazio no rodapé numa; oferta invadindo a dobra na
   outra). Reservar a tela com min-height:100svh não resolve: só transfere o
   buraco pra dentro do slide, porque a tela é mais alta que o conteúdo e
   alguém tem que ficar com a diferença.

   A saída é o quadro definir o tamanho do bloco, em vez do bloco definir o do
   quadro. Sem altura forçada: o quadro sai em 4:5 (a proporção que faz a cena
   ter presença), o texto vem colado embaixo, e o bloco fecha onde o conteúdo
   fecha. Em 390x844 isso dá ~700px, ou seja 83% da tela: o filme domina a
   abertura, e a oferta aparece só espiando no rodapé, dizendo que a página
   continua. Sem buraco em lugar nenhum, porque não há folga pra distribuir. */
.m-filme{
  position:relative;
  display:flex;flex-direction:column;
  padding:calc(18px + env(safe-area-inset-top,0px)) 0 20px;
}

/* cabeçalho mínimo: a marca e o preço. Sem menu, sem nada clicável além do
   preço, porque a página é de venda única. */
.m-topo{
  display:flex;align-items:baseline;justify-content:space-between;
  padding:0 20px 16px;flex:0 0 auto;
}
.m-marca{
  font-family:var(--display);font-weight:800;font-size:.82rem;letter-spacing:.02em;
  color:var(--osso);margin:0;
}
.m-marca b{color:var(--ambar);font-weight:800;}
.m-topo-preco{
  font-family:var(--ui);font-weight:500;font-size:.6rem;letter-spacing:.2em;
  text-transform:uppercase;color:var(--osso2);margin:0;
}

/* ---- a pista ----------------------------------------------------------
   scroll-snap nativo. Sem biblioteca, sem JS pra mover: o dedo empurra e o
   navegador encaixa. O JS aqui só LÊ a posição pra atualizar os pontinhos. */
.m-pista{
  flex:0 0 auto;
  display:flex;gap:0;
  /* stretch explícito: é o que iguala a altura dos 5 slides (ver .m-slide) */
  align-items:stretch;
  overflow-x:auto;overflow-y:hidden;
  scroll-snap-type:x mandatory;
  -webkit-overflow-scrolling:touch;
  scrollbar-width:none;
  /* a rolagem lateral aqui é intencional e não vaza pro documento */
  overscroll-behavior-x:contain;
}
.m-pista::-webkit-scrollbar{display:none;}

.m-slide{
  scroll-snap-align:center;
  scroll-snap-stop:always;
  flex:0 0 auto;
  /* 26px de sobra à direita = o próximo slide espia. É o que diz "tem mais". */
  width:calc(100vw - 46px);
  padding:0 0 0 20px;
  display:flex;flex-direction:column;
  /* o slide OCUPA a pista inteira. Sem isto o conteúdo fica grudado no topo e
     sobra um vazio de ~390px até a régua, que foi o que apareceu no primeiro
     teste em 390x844: o quadro e o texto no alto, e meia tela de breu embaixo.
     Vazio grande num carrossel não lê como respiro, lê como erro de carga.

     Com a pista medindo a tela, o stretch iguala todos os slides. Sem isso a
     régua subiria e desceria a cada deslizada, e o CTA mudaria de lugar entre
     um slide e outro, que é o tipo de instabilidade que faz o dedo errar o
     botão. As frases têm 2 e 3 linhas: quem absorve a diferença é o quadro,
     que encolhe alguns pixels no slide de frase mais longa. */
  align-self:stretch;
  /* referência de largura pros limites do .m-quadro. inline-size só mede a
     largura, então não cria dependência circular com a altura que o quadro
     está justamente calculando. */
  container-type:inline-size;
}
/* o último precisa de respiro à direita, senão encosta na borda ao encaixar */
.m-slide:last-child{padding-right:20px;width:calc(100vw - 26px);}

/* ---- o quadro ---------------------------------------------------------
   RETRATO, e é ele quem come a folga vertical do slide.

   flex:1 1 auto com aspect-ratio 4/5 significa: a proporção é o ALVO, e a
   altura real sai do que sobrar na pista depois do texto. Os dois limites
   impedem que isso degenere:
     · min-height 4/3 da largura → em tela baixa (360x740) o quadro para de
       encolher antes de virar tirinha de novo. É o piso do problema que
       estamos consertando.
     · max-height 5/4 da largura → teto em 4:5. Sem teto o quadro comia a tela
       inteira: medido em 581px de altura sobre 324 de largura, proporção 0.56,
       mais estreito que 9:16. O rosto ficava enorme e a tela do notebook (o
       brilho azul que motiva a cena) era espremida pro canto. Deixava de ser
       fotograma e virava recorte de retrato.
   Entre os dois, o quadro respira com o aparelho em vez de brigar com ele.

   A sobra que o teto deixa NÃO cai no chão: quem a distribui é o .m-texto
   (ver abaixo). Deixá-la no rodapé foi o erro das duas tentativas anteriores,
   e produziu 380px de breu entre o CTA e a régua nas duas.

   Borda de 1px porque no breu uma imagem sem moldura não tem onde terminar. */
.m-quadro{
  position:relative;width:100%;
  /* 4:5 é o alvo, e o segundo termo do min() é o freio de tela baixa: num
     360x740 o 4:5 puro daria 368px e, somado ao texto e à régua, empurraria a
     régua pra fora da tela. 52svh mantém a proporção entre ~4:5 e ~4:3
     conforme o aparelho, sem nunca voltar pra tirinha. */
  height:min(calc((100cqw - 20px) * 1.25), 52svh);
  min-height:calc((100cqw - 20px) * 0.75);
  flex:0 0 auto;
  border:1px solid var(--linha);border-radius:3px;overflow:hidden;
  background:var(--carvao);
}
/* cover corta as laterais do 16:9, e QUAL lateral ele corta é escolha: o
   object-position sai do FOCO, cena a cena (ver o mapa no topo do arquivo).
   Sem isso o centro cortaria o terminal da cena 2 e partiria o homem na 5. */
.m-quadro img{
  width:100%;height:100%;display:block;object-fit:cover;
  object-position:var(--foco,50% 50%);
  background:var(--breu);
}
/* Vinheta de baixo: liga o quadro ao texto, pra imagem não terminar num
   corte duro contra o breu. Mais curta e mais fraca que a anterior (38%/.72),
   que existia pra dar assento ao "1 / 5" no canto. Aquele contador saiu: com
   a hora, o "Cena 1 de 5" ao lado dela e os cinco pontinhos, eram QUATRO
   marcadores da mesma posição na mesma tela. Agora a vinheta só assenta a
   imagem, e come menos do rosto na cena 1. */
.m-quadro::after{
  content:"";position:absolute;inset:auto 0 0 0;height:24%;
  background:linear-gradient(180deg,rgba(6,6,7,0) 0%,rgba(6,6,7,.55) 100%);
  pointer-events:none;
}

/* ---- o texto ocupa o que sobra ---------------------------------------
   O bloco cresce até o fim do slide e distribui: hora e frase logo abaixo da
   imagem, CTA colado no rodapé do slide. É o que fecha o vazio sem inventar
   enfeite pra preencher. */
/* O texto mede o que precisa e para. Nada de margin-top:auto aqui.
   ---------------------------------------------------------------------------
   Tentei empurrar o CTA pro rodapé do slide com margin-top:auto, achando que
   assim a folga viraria respiro. Virou buraco: 400px entre a frase e o botão,
   o mesmo vazio de antes mudado de lugar. Num slide de carrossel a leitura é
   de cima pra baixo em bloco único (imagem, hora, frase, botão); espalhar
   esses quatro pela tela quebra a leitura e faz o dedo procurar o botão.

   A hora e a frase ficam coladas na imagem, e o CTA logo abaixo delas: é o
   horário que faz as cinco cenas lerem como uma noite só, e ele só funciona
   como legenda se estiver junto do fotograma. */
.m-texto{
  flex:0 0 auto;display:flex;flex-direction:column;
  padding-bottom:2px;
}
.m-texto-topo{flex:0 0 auto;}
.m-texto-fim{flex:0 0 auto;padding-top:18px;}

/* CTA dentro do slide: a oferta a um toque desde o primeiro quadro da página.
   Contorno, não preenchido: o botão sólido é o da barra fixa e o da oferta, e
   dois âmbares cheios na mesma tela brigam. Aqui ele convida sem gritar. */
.m-slide-cta{
  display:flex;align-items:center;justify-content:center;gap:9px;width:100%;
  border:1px solid var(--ambar);color:var(--ambar);text-decoration:none;
  font-family:var(--ui);font-weight:700;font-size:.84rem;letter-spacing:.02em;
  padding:13px 16px;border-radius:2px;background:var(--ambar-fraco);
}
.m-slide-cta svg{flex:0 0 auto;}

/* ---- o horário: o eixo que faz disso uma história -----------------------
   Grande, âmbar, no alto do texto. Sem ele, cinco imagens. Com ele, uma noite. */
.m-hora{
  display:flex;align-items:baseline;gap:12px;margin:14px 0 8px;
}
.m-hora b{
  font-family:var(--display);font-weight:800;font-size:1.62rem;line-height:1;
  color:var(--ambar);letter-spacing:-.02em;
}
.m-hora span{
  font-family:var(--ui);font-weight:500;font-size:.58rem;letter-spacing:.22em;
  text-transform:uppercase;color:var(--osso2);
}

.m-frase{
  font-family:var(--display);font-weight:200;
  font-size:clamp(1.35rem,5.6vw,1.9rem);line-height:1.12;letter-spacing:-.03em;
  color:var(--osso);margin:0;text-wrap:balance;
}
.m-frase b{font-weight:800;color:var(--ambar);}

/* ---- a régua de progresso --------------------------------------------
   Cinco traços. O ativo cresce e vira âmbar. Diz duas coisas ao mesmo tempo:
   onde você está, e que são cinco partes de uma coisa só. */
.m-regua{
  flex:0 0 auto;display:flex;align-items:center;justify-content:center;gap:7px;
  padding:20px 20px 0;
}
.m-regua i{
  display:block;width:6px;height:6px;border-radius:99px;
  background:rgba(242,239,233,.2);
  transition:width .3s cubic-bezier(.4,0,.2,1),background .3s ease;
}
.m-regua i[data-on="1"]{width:24px;background:var(--ambar);}

/* ============ PARTE 2 · A OFERTA ========================================= */
/* A reserva pra barra fixa fica no FIM DA PÁGINA, não só no rodapé.
   Medido em 02/09, 390x844: com o padding só no .m-rodape, a barra cobria o
   fecho do bloco Hermes x Alfred ("O seu vai ter o nome que você quiser")
   sempre que a rolagem parava naquele ponto. A barra é fixa: ela pode cobrir
   qualquer coisa, então quem reserva o espaço é o documento inteiro. */
.m-of{
  position:relative;background:var(--breu);
  padding-bottom:calc(74px + env(safe-area-inset-bottom,0px));
}
.m-faixa{padding:56px 0;border-top:1px solid var(--linha);}
.m-in{max-width:640px;margin:0 auto;padding:0 20px;}
.m-rot{
  font-family:var(--ui);font-weight:500;font-size:.62rem;letter-spacing:.24em;
  text-transform:uppercase;color:var(--ambar);margin:0 0 18px;
}
.m-h2{
  font-family:var(--display);font-weight:200;font-size:clamp(1.62rem,6.4vw,2.15rem);
  line-height:1.1;letter-spacing:-.03em;margin:0 0 20px;text-wrap:balance;
}
.m-h2 b{font-weight:800;color:var(--ambar);}
.m-p{font-size:1rem;line-height:1.72;color:var(--osso2);margin:0 0 16px;}
.m-p b{color:var(--osso);font-weight:500;}
.m-p:last-child{margin-bottom:0;}

/* dias */
.m-dias{list-style:none;margin:26px 0 0;padding:0;border-top:1px solid var(--linha);}
.m-dia{padding:16px 0;border-bottom:1px solid var(--linha);}
.m-dia dt{
  font-family:var(--display);font-weight:800;font-size:.76rem;letter-spacing:.08em;
  text-transform:uppercase;color:var(--ambar);margin:0 0 5px;
}
.m-dia dd{margin:0;font-size:.97rem;line-height:1.6;color:var(--osso2);}

/* prova */
.m-provas{display:grid;gap:22px;margin:28px 0 0;}
.m-prova{border-left:2px solid var(--ambar);padding:2px 0 2px 18px;}
.m-prova-n{
  font-family:var(--display);font-weight:800;font-size:2.15rem;line-height:1;
  color:var(--ambar);display:block;margin:0 0 8px;
}
.m-prova-t{font-size:.92rem;line-height:1.62;color:var(--osso2);margin:0;}

/* vídeo da prova */
.m-tv{margin:28px 0 0;}
.m-tv-caixa{
  position:relative;width:100%;max-width:300px;margin:0 auto;
  border:1px solid var(--linha);border-radius:10px;overflow:hidden;
  background:var(--carvao);box-shadow:0 20px 50px rgba(0,0,0,.5);
}
.m-tv-caixa video{
  display:block;width:100%;height:auto;aspect-ratio:640/1250;background:var(--breu);
}
.m-tv-hora{
  margin:11px 0 0;text-align:center;
  font-family:var(--ui);font-weight:500;font-size:.6rem;letter-spacing:.2em;
  text-transform:uppercase;color:var(--osso2);
}
.m-tv-play{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  border:0;background:rgba(6,6,7,.34);cursor:pointer;color:var(--osso);
  font:500 .7rem/1 var(--ui);letter-spacing:.2em;text-transform:uppercase;
}
.m-tv-play span{
  display:flex;align-items:center;gap:10px;
  background:var(--ambar);color:#1A1206;padding:12px 18px;border-radius:3px;
}

/* Hermes x Alfred: um embaixo do outro, mas com a MESMA estrutura, porque a
   simetria é o argumento (são o mesmo Agente em dois momentos). */
.m-dupla{display:grid;gap:16px;margin:26px 0 0;}
.m-lado{
  border:1px solid var(--linha);background:var(--carvao);padding:22px 20px;
  display:flex;flex-direction:column;
}
.m-lado-fig{display:flex;justify-content:flex-start;margin:0 0 18px;}
.m-lado-plaqueta{
  width:104px;height:104px;border-radius:3px;overflow:hidden;
  display:flex;align-items:center;justify-content:center;
  background:var(--osso);border:1px solid var(--linha);flex:0 0 auto;
}
.m-lado-plaqueta img{width:100%;height:100%;display:block;object-fit:contain;}
.m-lado-nome{
  font-family:var(--display);font-weight:800;font-size:1.3rem;color:var(--ambar);
  margin:0 0 3px;letter-spacing:-.01em;
}
.m-lado-estado{
  font-family:var(--ui);font-weight:500;font-size:.6rem;letter-spacing:.2em;
  text-transform:uppercase;color:var(--osso2);margin:0 0 15px;
}
.m-lado ul{list-style:none;margin:0;padding:0;border-top:1px solid var(--linha);}
.m-lado li{
  font-size:.9rem;line-height:1.55;color:var(--osso2);
  padding:11px 0 11px 16px;border-bottom:1px solid var(--linha);position:relative;
}
.m-lado li::before{
  content:"";position:absolute;left:0;top:1.1em;width:7px;height:1px;background:var(--ambar);
}
.m-dupla-fecho{
  font-family:var(--display);font-weight:200;font-size:1.42rem;line-height:1.18;
  letter-spacing:-.025em;color:var(--osso);margin:28px 0 0;
}
.m-dupla-fecho b{font-weight:800;color:var(--ambar);}

/* bumps */
.m-bumps{
  display:grid;gap:1px;background:var(--linha);
  border:1px solid var(--linha);margin:24px 0 0;
}
.m-bump{background:var(--breu);padding:22px 20px;}
.m-bump h3{font-family:var(--display);font-weight:800;font-size:1rem;margin:0 0 3px;color:var(--osso);}
.m-bump span{
  display:block;font-family:var(--display);font-weight:200;font-size:1.4rem;
  color:var(--ambar);margin:0 0 11px;
}
.m-bump-dor{color:var(--osso);font-weight:500;font-size:.92rem;line-height:1.55;margin:0 0 9px;}
.m-bump p:last-child{font-size:.9rem;line-height:1.6;color:var(--osso2);margin:0;}

/* faq */
.m-faq{border-top:1px solid var(--linha);margin:24px 0 0;}
.m-faq details{border-bottom:1px solid var(--linha);}
.m-faq summary{
  cursor:pointer;list-style:none;padding:18px 32px 18px 0;position:relative;
  font-family:var(--display);font-weight:400;font-size:.98rem;color:var(--osso);
}
.m-faq summary::-webkit-details-marker{display:none;}
.m-faq summary::after{
  content:"+";position:absolute;right:2px;top:50%;transform:translateY(-50%);
  color:var(--ambar);font-size:1.28rem;font-weight:200;
}
.m-faq details[open] summary::after{content:"–";}
.m-faq p{margin:0 0 20px;font-size:.94rem;line-height:1.7;color:var(--osso2);}

/* oferta */
.m-caixa{border:1px solid var(--linha);background:var(--carvao);padding:28px 22px;}
.m-preco{
  font-family:var(--display);font-weight:200;font-size:clamp(3.1rem,17vw,4.4rem);
  line-height:.94;letter-spacing:-.045em;color:var(--osso);margin:0 0 6px;
}
.m-preco b{font-weight:800;color:var(--ambar);}
.m-cta{
  display:flex;align-items:center;justify-content:center;gap:10px;width:100%;
  background:var(--ambar);color:#1A1206;text-decoration:none;text-align:center;
  font-family:var(--ui);font-weight:700;font-size:.96rem;letter-spacing:.01em;
  padding:18px 20px;border-radius:2px;margin:22px 0 0;
}
.m-nota{font-size:.8rem;line-height:1.6;color:var(--osso2);margin:14px 0 0;}

.m-rodape{
  padding:44px 0 56px;border-top:1px solid var(--linha);
}
.m-rodape p{font-size:.78rem;line-height:1.8;color:var(--osso2);margin:0;}

/* ---- barra de compra fixa --------------------------------------------
   Igual à da LP F, e pelo mesmo motivo: quem chega de anúncio sai na primeira
   dúvida, e a oferta tem que estar a um toque o tempo todo. Entra depois do
   carrossel, pra não cobrir a abertura. */
.m-barra{
  position:fixed;left:0;right:0;bottom:0;z-index:40;
  display:flex;align-items:center;gap:12px;
  padding:11px 14px calc(11px + env(safe-area-inset-bottom,0px));
  background:rgba(6,6,7,.93);
  -webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);
  border-top:1px solid var(--linha);
  transform:translateY(102%);transition:transform .34s cubic-bezier(.4,0,.2,1);
}
.m-barra[data-on="1"]{transform:none;}
.m-barra-preco{
  font-family:var(--display);font-weight:800;font-size:1.28rem;
  color:var(--osso);line-height:1;flex:0 0 auto;margin:0;
}
.m-barra-preco small{
  display:block;font-family:var(--ui);font-weight:500;font-size:.56rem;
  letter-spacing:.18em;text-transform:uppercase;color:var(--osso2);margin-top:4px;
}
.m-barra a{
  flex:1;display:flex;align-items:center;justify-content:center;
  background:var(--ambar);color:#1A1206;text-decoration:none;
  font-family:var(--ui);font-weight:700;font-size:.86rem;
  padding:14px 10px;border-radius:2px;
}

/* tablet retrato: a mesma página, com mais respiro e o carrossel mostrando
   um pedaço maior do próximo */
@media(min-width:680px){
  .m-slide{width:min(560px,calc(100vw - 96px));padding-left:28px;}
  .m-slide:last-child{width:min(560px,calc(100vw - 68px));padding-right:28px;}
  /* No tablet o slide chega a 560 de largura, e 4/5 disso daria 700px de
     altura: o quadro sozinho passaria da dobra. Aqui a largura já é
     suficiente pro assunto aparecer, então o retrato afrouxa pra 1:1 e o
     piso volta pro 16:9, que é a proporção nativa do arquivo. */
  .m-quadro{
    height:min(calc((100cqw - 28px) * 1), 56svh);
    min-height:calc((100cqw - 28px) * 0.5625);
  }
  .m-topo{padding:0 28px 20px;}
  .m-in{padding:0 28px;}
  .m-dupla{grid-template-columns:1fr 1fr;}
  .m-faixa{padding:72px 0;}
}

@media(prefers-reduced-motion:reduce){
  .m-regua i{transition:none;}
  .m-barra{transition:none;}
  .m-pista{scroll-behavior:auto;}
}
`;

/* ===========================================================================
 *  O VÍDEO DA PROVA · carregamento sob demanda
 * ---------------------------------------------------------------------------
 *  Mesma mecânica da LP F, e pelo mesmo motivo, que no celular pesa ainda
 *  mais: 1,28 MB não sai da rede antes do IntersectionObserver dizer que a
 *  seção chegou perto. Sem <source> no DOM o navegador não pede byte nenhum.
 *  Saiu da tela, pausa (vídeo em loop fora de vista queima bateria).
 *  prefers-reduced-motion: poster + botão, quem pediu menos movimento decide.
 * ======================================================================== */
function VideoProva() {
  const { video } = OFERTA;
  const caixa = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [carregar, setCarregar] = useState(false);
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
        if (dentro && !menos) setCarregar(true);

        const v = vid.current;
        if (!v || menos) return;
        if (dentro) {
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
    <div className="m-tv" ref={caixa}>
      <div className="m-tv-caixa">
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
            className="m-tv-play"
            onClick={() => {
              const v = vid.current;
              if (!v) return;
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
      <p className="m-tv-hora">{video.carimbo}</p>
    </div>
  );
}

/* ===========================================================================
 *  O CARROSSEL
 * ---------------------------------------------------------------------------
 *  O movimento é 100% do navegador (scroll-snap). O JS aqui faz UMA coisa:
 *  ler qual slide está no centro pra acender o traço certo na régua.
 *
 *  A leitura é por posição de rolagem, não por IntersectionObserver. Motivo
 *  aprendido na LP F: com dois slides parcialmente visíveis ao mesmo tempo
 *  (é o peek de 26px, ele é de propósito), o observer entrega dois "dentro"
 *  e o ativo pisca. Dividir scrollLeft pela largura do slide é determinístico
 *  e responde no mesmo quadro em que o dedo solta.
 * ======================================================================== */
function Carrossel() {
  const pista = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);

  useEffect(() => {
    const el = pista.current;
    if (!el) return;

    let pedido = 0;
    const medir = () => {
      pedido = 0;
      const slides = el.children;
      if (!slides.length) return;
      // largura de um passo = largura do primeiro slide (todos iguais, exceto
      // o último, que só tem padding a mais e não muda o passo)
      const passo = (slides[0] as HTMLElement).offsetWidth;
      if (passo <= 0) return;
      const i = Math.round(el.scrollLeft / passo);
      setAtivo(Math.max(0, Math.min(CENAS.length - 1, i)));
    };
    const agendar = () => {
      if (!pedido) pedido = requestAnimationFrame(medir);
    };

    medir();
    el.addEventListener("scroll", agendar, { passive: true });
    addEventListener("resize", agendar);
    return () => {
      el.removeEventListener("scroll", agendar);
      removeEventListener("resize", agendar);
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, []);

  return (
    <>
      <div className="m-pista" ref={pista}>
        {CENAS.map((c, i) => (
          <section className="m-slide" key={c.n} aria-label={`Cena ${c.n} de ${CENAS.length}`}>
            <div className="m-quadro">
              <img
                src={c.img}
                alt={c.alt}
                width={1920}
                height={1080}
                /* o corte retrato descarta as laterais do 16:9; o FOCO diz
                   quais, cena a cena (mapa no topo do arquivo) */
                style={{ "--foco": FOCO[c.n] } as React.CSSProperties}
                /* as duas primeiras já estão em cena (a 2ª espia na borda);
                   as outras esperam o dedo */
                loading={i < 2 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "low"}
                decoding={i === 0 ? "sync" : "async"}
              />
            </div>

            <div className="m-texto">
              <div className="m-texto-topo">
                <p className="m-hora">
                  <b>{c.hora}</b>
                  <span>
                    Cena {c.n} de {CENAS.length}
                  </span>
                </p>

                {/* o h1 é o da primeira cena: é a manchete real da página. As
                    outras são parágrafos, senão a página teria 5 h1. */}
                {i === 0 ? (
                  <h1 className="m-frase">{c.titulo}</h1>
                ) : (
                  <p className="m-frase">{c.titulo}</p>
                )}
              </div>

              <div className="m-texto-fim">
                <a className="m-slide-cta hw-acao" href={CHECKOUT}>
                  {OFERTA.ctaTopo}
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                    <path
                      d="M7 1l4 4-4 4M11 5H1"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="m-regua" aria-hidden="true">
        {CENAS.map((c, i) => (
          <i key={c.n} data-on={i === ativo ? "1" : "0"} />
        ))}
      </div>
    </>
  );
}

/* ===========================================================================
 *  A BARRA FIXA
 * ---------------------------------------------------------------------------
 *  Aparece quando a rolagem VERTICAL passa do carrossel. Comparação direta de
 *  scrollY com a altura do bloco, e não IntersectionObserver, pelo mesmo
 *  motivo apurado na LP F em 02/09: o observer não reentrega o estado de forma
 *  confiável ao voltar pro topo. Comparar número com número sempre reentrega.
 * ======================================================================== */
function useBarra(alvo: React.RefObject<HTMLDivElement | null>) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = alvo.current;
    if (!el) return;
    let pedido = 0;
    const medir = () => {
      pedido = 0;
      setOn(window.scrollY > el.offsetHeight - 120);
    };
    const agendar = () => {
      if (!pedido) pedido = requestAnimationFrame(medir);
    };
    medir();
    addEventListener("scroll", agendar, { passive: true });
    addEventListener("resize", agendar);
    return () => {
      removeEventListener("scroll", agendar);
      removeEventListener("resize", agendar);
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, [alvo]);

  return on;
}

export function LpFMobile() {
  const filme = useRef<HTMLDivElement>(null);
  const barra = useBarra(filme);

  return (
    <div className={`m ${display.variable} ${ui.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Pixel v="F" />

      {/* ============ PARTE 1 · O FILME ============ */}
      <div className="m-filme" ref={filme}>
        <div className="m-topo">
          <p className="m-marca">
            Hermes <b>Week</b>
          </p>
          <p className="m-topo-preco">Seg a sex, 20h</p>
        </div>
        <Carrossel />
      </div>

      {/* ============ PARTE 2 · A OFERTA ============ */}
      <div className="m-of">
        <section className="m-faixa">
          <div className="m-in">
            <p className="m-rot">O que aconteceu ali</p>
            <h2 className="m-h2">
              A diferença entre uma IA que responde e uma que <b>trabalha sem você mandar</b>
            </h2>
            <p className="m-p">
              Um Hermes Agent trabalha enquanto você não está olhando. Tem um processo rodando, tem
              um lugar onde ele mora, tem log do que ele fez ontem.
            </p>
            <p className="m-p">
              Você programa a tarefa, fecha tudo, vai dormir, e quando volta ela está feita. Com
              chat isso não acontece, porque se você fecha a aba a conversa morreu no meio do
              caminho. <b>O trabalho de lembrar sai de você.</b>
            </p>
          </div>
        </section>

        <section className="m-faixa">
          <div className="m-in">
            <p className="m-rot">{DUPLA.rotulo}</p>
            <h2 className="m-h2">
              O mesmo Agente, em <b>dois momentos</b>
            </h2>
            <p className="m-p">{DUPLA.intro}</p>

            <div className="m-dupla">
              {DUPLA.lados.map((l) => (
                <div className="m-lado" key={l.chave}>
                  <div className="m-lado-fig">
                    <div className="m-lado-plaqueta">
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
                  <p className="m-lado-nome">{l.nome}</p>
                  <p className="m-lado-estado">{l.estado}</p>
                  <ul>
                    {l.linhas.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="m-dupla-fecho">
              O seu vai ter o <b>nome que você quiser</b>.
            </p>
          </div>
        </section>

        <section className="m-faixa">
          <div className="m-in">
            <p className="m-rot">Os cinco dias</p>
            <h2 className="m-h2">
              Cinco aulas, uma por dia, das <b>20h às 20h50</b>
            </h2>
            <dl className="m-dias">
              {OFERTA.dias.map((d) => (
                <div className="m-dia" key={d.dia}>
                  <dt>{d.dia}</dt>
                  <dd>{d.saida}</dd>
                </div>
              ))}
            </dl>
            <p className="m-p" style={{ marginTop: 22 }}>
              {OFERTA.sabado}
            </p>
          </div>
        </section>

        <section className="m-faixa">
          <div className="m-in">
            <p className="m-rot">A prova</p>
            <h2 className="m-h2">
              Enquanto você ainda não entrou na Hermes Week, deixa eu te mostrar o <b>Alfred</b>{" "}
              trabalhando
            </h2>
            <p className="m-p">
              Não tenho depoimento de aluno porque o primeiro ciclo é esse. O que eu tenho é o meu
              rodando todo dia.
            </p>

            <VideoProva />

            <p className="m-p" style={{ marginTop: 26 }}>
              Hoje de manhã pedi pra ele olhar minha caixa de entrada. Eram <b>25 e-mails</b>.
              Repare no que ele decidiu que eu precisava ver.
            </p>

            <div className="m-provas">
              {OFERTA.prova.map((p) => (
                <div className="m-prova" key={p.numero}>
                  <span className="m-prova-n">{p.numero}</span>
                  <p className="m-prova-t">{p.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="m-faixa">
          <div className="m-in">
            <p className="m-rot">Pra quem não é</p>
            <h2 className="m-h2">
              Se você só usa IA duas vezes por semana, <b>não compra</b>
            </h2>
            <p className="m-p">
              Um agente compensa quando a memória tem tempo de acumular. Se você não usa todo dia,
              vai demorar muito mais pra ele te devolver algo relevante.
            </p>
            <p className="m-p">
              Isso é pra quem já usa IA o suficiente pra ter percebido que ela devia estar fazendo
              mais.
            </p>
          </div>
        </section>

        <section className="m-faixa">
          <div className="m-in">
            <div className="m-caixa">
              <p className="m-rot">{OFERTA.produto}</p>
              <p className="m-preco">
                <b>{OFERTA.preco}</b>
              </p>
              <p className="m-p" style={{ margin: "16px 0 0" }}>
                Cinco aulas, uma por dia, 20h. Sessão de dúvidas ao vivo no sábado, 10h. As aulas
                ficam disponíveis por um ano.
              </p>
              <a className="m-cta hw-acao" href={CHECKOUT}>
                {OFERTA.ctaOferta}
              </a>
              <p className="m-nota">Garantia de {OFERTA.garantia}</p>
            </div>

            <div style={{ marginTop: 36 }}>
              <p className="m-rot" style={{ marginTop: 0 }}>
                No checkout você pode adicionar
              </p>
              <div className="m-bumps">
                {OFERTA.bumps.map((b) => (
                  <div className="m-bump" key={b.nome}>
                    <h3>{b.nome}</h3>
                    <span>{b.preco}</span>
                    <p className="m-bump-dor">{b.problema}</p>
                    <p>{b.texto}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="m-faixa">
          <div className="m-in">
            <p className="m-rot">O que é escasso aqui</p>
            <h2 className="m-h2">
              Nada de <b>contador na tela</b> pra fazer você achar que as vagas estão acabando
            </h2>
            <p className="m-p">
              O que pode acabar aqui é esse preço. <b>Esse preço é de quem entra no começo.</b> A
              cada ciclo o material fica melhor, o grupo fica maior, e o preço acompanha.
            </p>
            <p className="m-p">
              <b>A auditoria tem dez vagas de verdade</b>, porque quem lê sou eu.
            </p>
            <p className="m-p">O que não é escasso: as aulas. Elas ficam no ar por um ano.</p>
          </div>
        </section>

        <section className="m-faixa">
          <div className="m-in">
            <p className="m-rot">O que você vai perguntar</p>
            <div className="m-faq">
              {OFERTA.faq.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="m-faixa">
          <div className="m-in">
            <h2 className="m-h2">
              Quem tem uma que trabalha não sabe mais programar que você. Tem uma{" "}
              <b>instalação bem feita</b>
            </h2>
            <p className="m-p">Segunda que vem, às 20h, a gente começa.</p>
            <a className="m-cta hw-acao" href={CHECKOUT}>
              {OFERTA.ctaTopo}
            </a>
          </div>
        </section>

        <footer className="m-rodape">
          <div className="m-in">
            <p>
              {OFERTA.evento}
              <br />
              {OFERTA.rodape.razao} · {OFERTA.rodape.cnpj} · {OFERTA.rodape.suporte}
            </p>
          </div>
        </footer>
      </div>

      <div className="m-barra" data-on={barra ? "1" : "0"} aria-hidden={!barra}>
        <p className="m-barra-preco">
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

/* ============================================================================
 *  O POUCO QUE AS CINCO PÁGINAS COMPARTILHAM
 * ----------------------------------------------------------------------------
 *  Só entra aqui o que NÃO pode divergir entre as variações sem quebrar o teste
 *  ou a medição: o parser de marcação da copy, o script do pixel e o contrato
 *  do placeholder de imagem.
 *
 *  ⚠️ CSS NÃO ENTRA AQUI. Cada variação tem paleta, tipografia, ritmo e CTA
 *  próprios, e o único jeito de garantir isso é não existir folha comum. Se um
 *  dia aparecer um `estilos-compartilhados.ts`, as cinco voltam a parecer a
 *  mesma página com o texto trocado, que foi exatamente o que o Red reprovou.
 * ==========================================================================*/

import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import { PRECO, type VarianteId } from "./checkout";
import type { Img, ImgTipo } from "./conteudo";

/* ---------- marcação inline da copy: **negrito** e *itálico* ------------- */

/* A crase virou marcação em 13/09/2026. Sem ela, `prompt-size` e
   `skill_manage` saíam com a crase impressa na tela — e saíam mesmo, tanto na
   LP G quanto na E. O público desta página escreve `cron` e `harness`, então
   nome de comando formatado como comando é vocabulário, não enfeite. */
export function inline(txt: string, k: string): ReactNode {
  return txt
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
    .filter(Boolean)
    .map((p, i) => {
      const kk = `${k}-${i}`;
      if (p.startsWith("**") && p.endsWith("**")) return <b key={kk}>{p.slice(2, -2)}</b>;
      if (p.startsWith("`") && p.endsWith("`") && p.length > 2)
        return <code key={kk}>{p.slice(1, -1)}</code>;
      if (p.startsWith("*") && p.endsWith("*") && p.length > 2) return <em key={kk}>{p.slice(1, -1)}</em>;
      return <Fragment key={kk}>{p}</Fragment>;
    });
}

/* ---------- o que cada tipo de imagem existe para fazer -------------------
   Aparece escrito dentro do próprio placeholder. É a instrução de produção
   para o Red e para a LUA: sem isso o bloco vira um retângulo cinza mudo. */

export const PAPEL_IMG: Record<ImgTipo, string> = {
  RED: "foto do Red",
  ALFRED: "prova · print do agente",
  HERMES: "captura técnica",
};

/* ---------- o buraco só aparece para quem produz -------------------------
   A caixa de placeholder existe para o Red e para a LUA: ela diz, na tela,
   qual captura ainda falta. Em produção ela não tem esse leitor — tem o
   visitante que veio de um anúncio pago, e para ele a caixa é uma página
   inacabada no exato ponto em que a página pede confiança. O caso concreto
   que obrigou esta regra (IRIS, 11/09/2026): as quatro LPs que recebiam
   tráfego exibiam, DENTRO da seção "a prova", o texto "conversa do Telegram
   com o Alfred [...] Mascarar nomes e assuntos sensíveis". Instrução de
   bastidor, impressa no lugar da prova.

   Some em produção, continua em dev. O que não muda é a pendência: enquanto
   `IMG_TELEGRAM` não tiver `src`, a seção da prova roda sem imagem. */
export const MOSTRAR_PLACEHOLDER = process.env.NODE_ENV !== "production";

export function legendaImg(img: Img): string {
  return `${img.tipo} · ${img.formato}`;
}

/* ---------- alt --------------------------------------------------------
   A descrição `c` é instrução de PRODUÇÃO ("mascarar nomes sensíveis",
   "sem sorriso posado"), não descrição de conteúdo — jogá-la no alt entrega
   ao leitor de tela a nota de bastidor em vez da imagem. Daí um alt próprio,
   escrito para quem não vê a página. */

const ALT: Record<string, string> = {
  "/hermes-week/repo-github.webp":
    "Página do repositório hermes-agent da Nous Research no GitHub, com licença MIT, mais de 240 mil estrelas e o último commit recente.",
  "/hermes-week/red-oferta.webp":
    "Red de jaqueta escura, braços cruzados, olhando para a câmera, com monitores desfocados ao fundo.",
  "/hermes-week/alfred-telegram.webp":
    "Conversa no Telegram com o bot Alfred. O Red pede pra ele olhar o e-mail e dizer o que precisa de atenção; o Alfred responde que vai buscar os não lidos, roda um comando no terminal e devolve uma lista dos 25 e-mails não lidos, triada, com os três itens que pedem decisão dele naquele dia e o horário de cada um.",
  "/hermes-week/red-manha.webp":
    "Red de camiseta na bancada de trabalho pela manhã, luz de janela, olhando a tela do notebook, com uma xícara de café ao lado.",
};

export function altImg(img: Img): string {
  if (!img.src) return "";
  if (ALT[img.src]) return ALT[img.src];
  if (img.src.startsWith("/hermes-week/log-")) {
    return "Saída do terminal com o registro do agente filtrado por skill_manage, mostrando a contagem de 184 habilidades criadas por ele mesmo.";
  }
  return img.c;
}

/* ---------- a imagem, ou o buraco onde ela vai ---------------------------
   Contrato único das cinco páginas: com `src` sai a foto, sem `src` sai a
   caixa com a descrição dentro. Cada layout passa a própria `classe` e
   continua desenhando a moldura, a legenda e o ritmo do seu jeito — o que se
   compartilha aqui é só a decisão pronta/não-pronta e a reserva de espaço.

   `aspectRatio` a partir de w/h é o que impede o layout shift: o navegador
   conhece a altura da caixa antes do primeiro byte da imagem chegar, do mesmo
   jeito que conhecia pelo min-height do placeholder. `sizes` existe para o
   Next não servir 1600px de largura para um celular de 390px em tráfego pago. */

export function ImgReal({
  img,
  classe,
  sizes,
  prioridade = false,
  preenche = false,
}: {
  img: Img;
  classe?: string;
  sizes: string;
  prioridade?: boolean;
  /** true quando quem chama já tem uma moldura de proporção fixa e posiciona a
      imagem pelo CSS (é o caso da LP E, que corta com object-fit dentro do
      palco do parallax). Aí o estilo inline daqui atrapalharia, e sai. */
  preenche?: boolean;
}) {
  if (!img.src || !img.w || !img.h) return null;
  return (
    <Image
      className={classe}
      src={img.src}
      alt={altImg(img)}
      width={img.w}
      height={img.h}
      sizes={sizes}
      priority={prioridade}
      style={preenche ? undefined : { width: "100%", height: "auto", aspectRatio: `${img.w} / ${img.h}` }}
    />
  );
}

/* ---------- pixel ---------------------------------------------------------
   ViewContent no load e InitiateCheckout no clique, os dois carregando a
   variante. Sem o content_category o relatório da Meta junta as cinco num
   balde só e o teste não responde nada. A classe `hw-acao` é o contrato: todo
   CTA das cinco páginas a carrega, qualquer que seja o estilo visual dele. */

export function pixelScript(v: VarianteId): string {
  return `
    (function () {
      var VAR = ${JSON.stringify(v)};
      var base = { content_name: 'Hermes Week', content_ids: ['hermes-week-' + VAR],
                   content_type: 'product', value: ${PRECO}, currency: 'BRL',
                   content_category: 'variante-' + VAR };
      var t = 0;
      (function view() {
        if (typeof fbq !== 'undefined') { fbq('track', 'ViewContent', base); return; }
        if (++t < 20) setTimeout(view, 250);
      })();
      /* Atribuicao por criativo: a Meta injeta utm_content={{ad.id}} no clique.
         A pagina e renderizada no servidor, entao o href sai fixo — aqui no
         cliente carimbamos o sck, que e o campo que a Hotmart devolve no
         relatorio de vendas. Sem isso da pra saber a variante de LP, mas nao
         qual dos anuncios vendeu. */
      function marcarOrigem() {
        var q = new URLSearchParams(location.search);
        var c = q.get('utm_content') || q.get('sck') || q.get('fbclid');
        if (!c) return;
        var sck = (VAR + '-' + c).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 100);
        var bs = document.querySelectorAll('.hw-acao');
        for (var i = 0; i < bs.length; i++) {
          var h = bs[i].getAttribute('href');
          if (!h || h.indexOf('hotmart') === -1 || h.indexOf('sck=') !== -1) continue;
          bs[i].setAttribute('href', h + '&sck=' + sck);
        }
      }
      function ligar() {
        marcarOrigem();
        var bs = document.querySelectorAll('.hw-acao');
        for (var i = 0; i < bs.length; i++) {
          bs[i].addEventListener('click', function () {
            if (typeof fbq !== 'undefined') fbq('track', 'InitiateCheckout', base);
          });
        }
      }
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ligar);
      else ligar();
    })();
  `;
}

export function Pixel({ v }: { v: VarianteId }) {
  return <script dangerouslySetInnerHTML={{ __html: pixelScript(v) }} />;
}

/* Gera o preview estático da LP F a partir da FONTE viva:
   - o CSS sai do const CSS do lp-f.tsx
   - os dados saem do lp-f-cenas.ts
   Assim o preview não pode divergir do componente por descuido de cópia. */
const fs = require("fs");
const path = require("path");

const COMP = "c:/Users/RedPro/Desktop/Projetos/Vibecoding/link_bio_tree/src/components/hermes-week";
const OUT = "c:/Users/RedPro/Desktop/Projetos/Vibecoding/Starlight/HERMES/05-paginas/preview-html/LP-F-cinematica.html";

const tsx = fs.readFileSync(path.join(COMP, "lp-f.tsx"), "utf8");
const CSS = tsx.match(/const CSS = `([\s\S]*?)`;/)[1];

/* lê os dados do .ts sem compilar: troca os export const por atribuição */
const cenasSrc = fs
  .readFileSync(path.join(COMP, "lp-f-cenas.ts"), "utf8")
  .replace(/export type Cena = \{[\s\S]*?^\};/m, "")
  .replace(/export const CENAS: Cena\[\] =/, "const CENAS =")
  .replace(/export const OFERTA =/, "const OFERTA =")
  .replace(/export const DUPLA =/, "const DUPLA =")
  .replace(/ as const;/g, ";");
const mod = new Function(cenasSrc + "\nreturn {CENAS,OFERTA,DUPLA};")();
const { CENAS, OFERTA, DUPLA } = mod;

const CHECKOUT = "https://pay.hotmart.com/PRODUTO-PENDENTE?checkoutMode=10&v=F&src=hw-F";
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// no preview as imagens vivem em assets-f/, não em /hermes-week/
const asset = (p) => "assets-f/" + p.split("/").pop();

const cta = (cls) =>
  `<a class="${cls} hw-acao" href="${CHECKOUT}">${esc(OFERTA.ctaTopo)}</a>`;

const cenas = CENAS.map(
  (c, i) => `  <section class="f-cena" aria-label="Cena ${c.n}">
    <img class="f-cena-img" src="${asset(c.img)}" alt="${esc(c.alt)}" width="1920" height="1080" ${
      i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'
    }>
    <div class="f-cena-txt">
      <p class="f-hora">${esc(c.hora)}</p>
      <${i === 0 ? "h1" : "h2"} class="f-titulo">${esc(c.titulo)}</${i === 0 ? "h1" : "h2"}>
      ${c.n >= 3 ? cta("f-cena-cta") : ""}
    </div>
    ${i === 0 ? '<div class="f-dica" aria-hidden="true"><span>role</span><i></i></div>' : ""}
  </section>`
).join("\n");

const lados = DUPLA.lados
  .map(
    (l) => `        <div class="f-lado">
          <div class="f-lado-fig"><div class="f-lado-plaqueta"><img src="${asset(l.img)}" alt="${esc(
      l.alt
    )}" width="${
      l.chave === "hermes" ? 720 : 683
    }" height="720" loading="lazy" decoding="async"></div></div>
          <p class="f-lado-nome">${esc(l.nome)}</p>
          <p class="f-lado-estado">${esc(l.estado)}</p>
          <ul>${l.linhas.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        </div>`
  )
  .join("\n");

const dias = OFERTA.dias
  .map((d) => `<div class="f-dia"><dt>${esc(d.dia)}</dt><dd>${esc(d.saida)}</dd></div>`)
  .join("\n");

const provas = OFERTA.prova
  .map(
    (p) =>
      `<div class="f-prova"><span class="f-prova-n">${esc(p.numero)}</span><p class="f-prova-t">${esc(
        p.texto
      )}</p></div>`
  )
  .join("\n");

const bumps = OFERTA.bumps
  .map(
    (b) =>
      `<div class="f-bump"><h3>${esc(b.nome)}</h3><span>${esc(
        b.preco
      )}</span><p class="f-bump-dor">${esc(b.problema)}</p><p>${esc(b.texto)}</p></div>`
  )
  .join("\n");

const faq = OFERTA.faq
  .map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`)
  .join("\n");

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>LP F · Hermes Week · cinemática</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200;12..96,400;12..96,800&family=Plus+Jakarta+Sans:wght@300;500;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;}
:root{--f-display:'Bricolage Grotesque';--f-ui:'Plus Jakarta Sans';}
body{background:#060607;}
${CSS}
/* aviso do preview, não existe na página de produção */
.f-aviso{position:fixed;left:12px;bottom:12px;z-index:99;background:rgba(232,163,74,.94);color:#1A1206;
  font:500 11px/1.5 'Plus Jakarta Sans',sans-serif;padding:9px 13px;border-radius:3px;max-width:330px;}
</style>
</head>
<body>
<div class="f">
  <div class="f-filme">
${cenas}
  </div>

  <div class="f-of">
    <section class="f-faixa"><div class="f-in f-col">
      <p class="f-rot">O que aconteceu ali</p>
      <h2 class="f-h2">A diferença entre uma IA que responde e uma que <b>trabalha sem você mandar</b></h2>
      <p class="f-p">Um Hermes Agent trabalha enquanto você não está olhando. Tem um processo rodando, tem um lugar onde ele mora, tem log do que ele fez ontem.</p>
      <p class="f-p">Você programa a tarefa, fecha tudo, vai dormir, e quando volta ela está feita. Com chat isso não acontece, porque se você fecha a aba a conversa morreu no meio do caminho. <b>O trabalho de lembrar sai de você.</b></p>
    </div></section>

    <section class="f-faixa"><div class="f-in">
      <div class="f-col">
        <p class="f-rot">${esc(DUPLA.rotulo)}</p>
        <h2 class="f-h2">O mesmo programa, em <b>dois momentos</b></h2>
        <p class="f-p">${esc(DUPLA.intro)}</p>
      </div>
      <div class="f-dupla">
${lados}
      </div>
      <p class="f-dupla-fecho">O seu vai ter o <b>nome que você quiser</b>.</p>
    </div></section>

    <section class="f-faixa"><div class="f-in">
      <div class="f-col"><p class="f-rot">Os cinco dias</p>
      <h2 class="f-h2">Cinco aulas, uma por dia, das <b>20h às 20h50</b></h2></div>
      <dl class="f-dias">${dias}</dl>
      <p class="f-p" style="margin-top:26px">${esc(OFERTA.sabado)}</p>
    </div></section>

    <section class="f-faixa"><div class="f-in">
      <div class="f-col"><p class="f-rot">A prova</p>
      <h2 class="f-h2">A Hermes Week ainda não aconteceu. Te mostro o <b>Alfred</b></h2></div>
      <div class="f-tv">
        <div class="f-tv-figura">
          <div class="f-tv-caixa">
            <video muted playsinline loop autoplay preload="metadata" poster="${asset(
              OFERTA.video.poster
            )}" width="${OFERTA.video.largura}" height="${OFERTA.video.altura}" aria-label="${esc(
  OFERTA.video.aria
)}">
              <source src="${asset(OFERTA.video.src)}" type="video/mp4">
            </video>
          </div>
          <p class="f-tv-hora">${esc(OFERTA.video.carimbo)}</p>
        </div>
        <div class="f-tv-texto">
          <p class="f-p">Pedi pra ele dar uma olhada na minha caixa de entrada hoje de manhã. Eram <b>25 e-mails</b>. Repare no que ele decidiu que eu precisava ver.</p>
          <p class="f-p">Não tem depoimento porque o primeiro ciclo é esse. O que existe é o meu rodando.</p>
          <div class="f-provas">${provas}</div>
        </div>
      </div>
    </div></section>

    <section class="f-faixa"><div class="f-in f-col">
      <p class="f-rot">Pra quem não é</p>
      <h2 class="f-h2">Se você usa IA duas vezes por semana, <b>não compra</b></h2>
      <p class="f-p">Um agente compensa quando a memória tem tempo de acumular. Se você não usa todo dia, vai demorar muito mais pra ele te devolver algo relevante.</p>
      <p class="f-p">Isso é pra quem já usa IA o suficiente pra ter percebido que ela devia estar fazendo mais.</p>
    </div></section>

    <section class="f-faixa"><div class="f-in">
      <div class="f-caixa">
        <p class="f-rot">${esc(OFERTA.produto)}</p>
        <p class="f-preco"><b>${esc(OFERTA.preco)}</b></p>
        <p class="f-p" style="margin:18px 0 0;max-width:46ch">Cinco aulas, uma por dia, 20h. Sessão de dúvidas ao vivo no sábado, 10h. As aulas ficam disponíveis por um ano.</p>
        <a class="f-cta hw-acao" href="${CHECKOUT}">${esc(OFERTA.ctaOferta)}</a>
        <p class="f-nota">Garantia de ${esc(OFERTA.garantia)}</p>
      </div>
      <div style="margin-top:44px">
        <p class="f-rot">No checkout você pode adicionar</p>
        <div class="f-bumps">${bumps}</div>
      </div>
    </div></section>

    <section class="f-faixa"><div class="f-in f-col">
      <p class="f-rot">O que é escasso aqui</p>
      <h2 class="f-h2 larga">Nada de <b>contador na tela</b> pra fazer você achar que as vagas estão acabando</h2>
      <p class="f-p">O que pode acabar aqui é esse preço. <b>Esse preço é de quem entra no começo.</b> A cada ciclo o material fica melhor, o grupo fica maior, e o preço acompanha.</p>
      <p class="f-p"><b>A auditoria tem dez vagas de verdade</b>, porque quem lê sou eu.</p>
      <p class="f-p">O que não é escasso: as aulas. Elas ficam no ar por um ano.</p>
    </div></section>

    <section class="f-faixa"><div class="f-in f-col">
      <p class="f-rot">O que você vai perguntar</p>
      <div class="f-faq">${faq}</div>
    </div></section>

    <section class="f-faixa"><div class="f-in f-col">
      <h2 class="f-h2">Quem tem uma que trabalha não sabe mais programar que você. Tem uma <b>instalação bem feita</b></h2>
      <p class="f-p">Segunda que vem, às 20h, a gente começa.</p>
      <a class="f-cta hw-acao" href="${CHECKOUT}" style="max-width:460px">${esc(OFERTA.ctaTopo)}</a>
    </div></section>

    <footer class="f-rodape"><div class="f-in">
      <p>${esc(OFERTA.evento)}<br>${esc(OFERTA.rodape.razao)} · ${esc(OFERTA.rodape.cnpj)} · ${esc(
  OFERTA.rodape.suporte
)}</p>
    </div></footer>
  </div>
</div>
<div class="f-aviso">Preview estático. O scrub em canvas (5 cenas viradas por rolagem) só roda no Next, em desktop e sem reduced-motion. Aqui você vê o fallback, que é o mesmo conteúdo.</div>
</body>
</html>
`;

fs.writeFileSync(OUT, html, "utf8");
console.log("preview escrito:", OUT, html.length, "chars");

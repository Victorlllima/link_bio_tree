import type { Metadata } from "next";

// Checkout do ingresso — público frio (tráfego pago) R$44.
// O aluno IAA vem por outra oferta (R$35), via e-mail D5 → mesmo destino, checkout diferente.
const CHECKOUT_URL = "https://pay.hotmart.com/R106737413U?checkoutMode=10";

export const metadata: Metadata = {
  title: "Desafio: Construindo um CRM em 5 Dias · RedPro AI Academy",
  description:
    "Em 5 dias você constrói do zero um CRM completo, publicado na internet, com seu link. Sem escrever uma linha de código.",
};

const html = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200;400;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

<style>
  .dc-root, .dc-root *, .dc-root *::before, .dc-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .dc-root {
    --laranja: #F97316;
    --laranja-esc: #C2500E;
    --glow: rgba(249,115,22,.16);
    --preto: #080808;
    --sup: #111111;
    --card: #141414;
    --linha: #1F1F1F;
    --mid: #8A8A8A;
    --soft: #B8B8B8;
    --branco: #F5F5F5;
    --verde: #4ADE80;
    background: var(--preto);
    color: var(--branco);
    font-family: 'Bricolage Grotesque', system-ui, sans-serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  .dc-root .wrap { max-width: 860px; margin: 0 auto; padding: 0 22px; }
  .dc-root .mono { font-family: 'JetBrains Mono', monospace; }

  /* ---------- HERO ---------- */
  .dc-root .hero {
    text-align: center; padding: 72px 0 56px;
    background: radial-gradient(ellipse at 50% 0%, var(--glow), transparent 60%);
  }
  .dc-root .eyebrow {
    display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 12.5px;
    letter-spacing: .18em; text-transform: uppercase; color: var(--laranja);
    border: 1px solid rgba(249,115,22,.35); border-radius: 30px; padding: 7px 16px; margin-bottom: 26px;
  }
  .dc-root h1 {
    font-weight: 900; font-size: clamp(34px, 7vw, 62px); line-height: 1.02;
    letter-spacing: -.03em; margin-bottom: 22px;
  }
  .dc-root h1 em { font-style: normal; color: var(--laranja); }
  .dc-root .sub { font-size: clamp(16px, 2.4vw, 20px); color: var(--soft); max-width: 620px; margin: 0 auto 34px; }
  .dc-root .sub strong { color: var(--branco); font-weight: 700; }

  .dc-root .btn {
    display: inline-block; background: var(--laranja); color: var(--preto);
    font-weight: 800; font-size: 17px; padding: 17px 38px; border-radius: 12px;
    text-decoration: none; transition: transform .15s, box-shadow .15s;
    box-shadow: 0 8px 30px rgba(249,115,22,.28);
  }
  .dc-root .btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(249,115,22,.4); }
  .dc-root .btn-sub { display: block; margin-top: 12px; font-size: 13px; color: var(--mid); font-family: 'JetBrains Mono', monospace; }

  /* ---------- SEÇÃO GENÉRICA ---------- */
  .dc-root section { padding: 56px 0; }
  .dc-root .sec-tit {
    font-weight: 800; font-size: clamp(26px, 4.5vw, 38px); line-height: 1.1;
    letter-spacing: -.02em; text-align: center; margin-bottom: 14px;
  }
  .dc-root .sec-tit em { font-style: normal; color: var(--laranja); }
  .dc-root .sec-intro { text-align: center; color: var(--soft); max-width: 600px; margin: 0 auto 40px; font-size: 16.5px; }

  /* ---------- DOR ---------- */
  .dc-root .dor { background: var(--sup); border-top: 1px solid var(--linha); border-bottom: 1px solid var(--linha); }
  .dc-root .dor-list { display: flex; flex-direction: column; gap: 14px; max-width: 620px; margin: 0 auto; }
  .dc-root .dor-item {
    display: flex; gap: 14px; align-items: flex-start; background: var(--card);
    border: 1px solid var(--linha); border-radius: 12px; padding: 18px 20px;
  }
  .dc-root .dor-x { color: #ef4444; font-size: 18px; flex-shrink: 0; margin-top: 1px; }
  .dc-root .dor-item p { color: var(--soft); font-size: 15.5px; }
  .dc-root .dor-item strong { color: var(--branco); }

  /* ---------- O QUE VOCÊ SAI TENDO ---------- */
  .dc-root .entrega-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
  .dc-root .ent-card { background: var(--card); border: 1px solid var(--linha); border-radius: 14px; padding: 24px; }
  .dc-root .ent-card .num {
    width: 40px; height: 40px; border-radius: 10px; background: rgba(249,115,22,.12);
    border: 1px solid rgba(249,115,22,.3); color: var(--laranja); font-weight: 900; font-size: 17px;
    display: flex; align-items: center; justify-content: center; margin-bottom: 14px; font-family: 'JetBrains Mono', monospace;
  }
  .dc-root .ent-card h3 { font-size: 18px; font-weight: 800; margin-bottom: 7px; }
  .dc-root .ent-card p { color: var(--soft); font-size: 14.5px; }

  /* ---------- CRONOGRAMA ---------- */
  .dc-root .crono { background: var(--sup); border-top: 1px solid var(--linha); border-bottom: 1px solid var(--linha); }
  .dc-root .crono-list { display: flex; flex-direction: column; gap: 12px; max-width: 640px; margin: 0 auto; }
  .dc-root .crono-item { display: flex; gap: 18px; align-items: center; background: var(--card); border: 1px solid var(--linha); border-radius: 12px; padding: 18px 22px; }
  .dc-root .crono-dia { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--laranja); font-weight: 700; white-space: nowrap; min-width: 66px; }
  .dc-root .crono-item p { font-size: 15.5px; }
  .dc-root .crono-item strong { font-weight: 700; }

  /* ---------- OFERTA / PREÇO ---------- */
  .dc-root .oferta { text-align: center; }
  .dc-root .preco-card {
    max-width: 460px; margin: 0 auto; background: var(--card);
    border: 1px solid rgba(249,115,22,.4); border-radius: 20px; padding: 40px 32px;
    box-shadow: 0 0 60px rgba(249,115,22,.1);
  }
  .dc-root .preco-de { color: var(--mid); font-size: 17px; text-decoration: line-through; margin-bottom: 4px; }
  .dc-root .preco-num { font-weight: 900; font-size: 60px; line-height: 1; letter-spacing: -.03em; margin-bottom: 6px; }
  .dc-root .preco-num .cifra { font-size: 30px; vertical-align: super; color: var(--laranja); }
  .dc-root .preco-obs { color: var(--soft); font-size: 14px; margin-bottom: 28px; }
  .dc-root .preco-obs strong { color: var(--branco); }

  /* ---------- PARA QUEM ---------- */
  .dc-root .quem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 720px; margin: 0 auto; }
  .dc-root .quem-col { background: var(--card); border: 1px solid var(--linha); border-radius: 14px; padding: 24px; }
  .dc-root .quem-col h3 { font-size: 16px; font-weight: 800; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .dc-root .quem-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .dc-root .quem-col li { font-size: 14.5px; color: var(--soft); display: flex; gap: 9px; align-items: flex-start; }
  .dc-root .quem-sim li::before { content: "✓"; color: var(--verde); font-weight: 800; flex-shrink: 0; }
  .dc-root .quem-nao li::before { content: "✕"; color: #ef4444; font-weight: 800; flex-shrink: 0; }

  /* ---------- FAQ ---------- */
  .dc-root .faq-list { max-width: 640px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
  .dc-root .faq-item { background: var(--card); border: 1px solid var(--linha); border-radius: 12px; padding: 20px 22px; }
  .dc-root .faq-item h4 { font-size: 16px; font-weight: 800; margin-bottom: 8px; }
  .dc-root .faq-item p { color: var(--soft); font-size: 14.5px; }

  /* ---------- CTA FINAL ---------- */
  .dc-root .cta-final { text-align: center; background: radial-gradient(ellipse at 50% 100%, var(--glow), transparent 60%); }
  .dc-root .cta-final h2 { font-weight: 900; font-size: clamp(28px, 5vw, 44px); letter-spacing: -.02em; margin-bottom: 18px; }
  .dc-root .cta-final h2 em { font-style: normal; color: var(--laranja); }

  .dc-root .foot { text-align: center; padding: 40px 0; border-top: 1px solid var(--linha); color: var(--mid); font-size: 12.5px; font-family: 'JetBrains Mono', monospace; }

  @media (max-width: 560px) {
    .dc-root .quem-grid { grid-template-columns: 1fr; }
    .dc-root .crono-item { flex-direction: column; align-items: flex-start; gap: 6px; }
  }
</style>

<div class="dc-root">

  <!-- HERO -->
  <div class="hero">
    <div class="wrap">
      <span class="eyebrow">Começa 27 de julho · 5 dias · 7h da manhã</span>
      <h1>Construa um <em>CRM completo</em> em 5 dias. Sem escrever código.</h1>
      <p class="sub">De segunda a sexta, você constrói do zero um sistema de verdade... e publica na internet com <strong>o seu link</strong>. O tipo de sistema que empresa paga caro pra ter.</p>
      <a href="${CHECKOUT_URL}" class="btn dc-cta" data-cta="hero">Garantir minha vaga — R$44</a>
      <span class="btn-sub">acesso às aulas por 1 ano</span>
    </div>
  </div>

  <!-- DOR -->
  <section class="dor">
    <div class="wrap">
      <h2 class="sec-tit">Você já sabe usar IA. <em>Mas isso não paga suas contas.</em></h2>
      <p class="sec-intro">Usar ChatGPT no dia a dia é uma coisa. Construir algo que a empresa dos outros precisa e paga pra ter é outra. E é essa segunda que vira renda.</p>
      <div class="dor-list">
        <div class="dor-item"><span class="dor-x">✕</span><p>Você mexe com IA, mas continua no mesmo lugar, porque não tem <strong>uma coisa concreta</strong> pra entregar.</p></div>
        <div class="dor-item"><span class="dor-x">✕</span><p>Acha que precisa <strong>saber programar</strong> pra construir sistema. Não precisa. A ferramenta constrói.</p></div>
        <div class="dor-item"><span class="dor-x">✕</span><p>Coleciona curso de IA, mas empresa <strong>não olha certificado</strong>. Olha se você resolve.</p></div>
      </div>
    </div>
  </section>

  <!-- O QUE VOCÊ SAI TENDO -->
  <section>
    <div class="wrap">
      <h2 class="sec-tit">O que você <em>sai construindo</em></h2>
      <p class="sec-intro">Não é teoria sobre IA. Em 5 dias você sai com um sistema real, no ar, feito por você.</p>
      <div class="entrega-grid">
        <div class="ent-card"><div class="num">1</div><h3>Um CRM publicado</h3><p>Sistema completo na internet, com seu link. Cadastro de cliente, funil de vendas, painel do dono.</p></div>
        <div class="ent-card"><div class="num">2</div><h3>Sem uma linha de código</h3><p>Você descreve o que precisa em português. A ferramenta constrói. O trabalho pesado deixa de ser seu.</p></div>
        <div class="ent-card"><div class="num">3</div><h3>Uma prova de que resolve</h3><p>Um sistema pronto que você mostra pra qualquer empresa: "construí isso. Faço um pro seu negócio".</p></div>
        <div class="ent-card"><div class="num">4</div><h3>Acesso por 1 ano</h3><p>As aulas ficam com você por 12 meses. Constrói junto, revisita quando quiser, adapta pro seu nicho.</p></div>
      </div>
    </div>
  </section>

  <!-- CRONOGRAMA -->
  <section class="crono">
    <div class="wrap">
      <h2 class="sec-tit">Os <em>5 dias</em></h2>
      <p class="sec-intro">De <strong style="color:var(--branco)">27 a 31 de julho</strong>, segunda a sexta, sempre às 7h da manhã. Uma etapa por dia, construindo em cima da anterior.</p>
      <div class="crono-list">
        <div class="crono-item"><span class="crono-dia">SEG · 7h</span><p><strong>O começo.</strong> O sistema que empresa paga caro, montado em minutos na sua frente.</p></div>
        <div class="crono-item"><span class="crono-dia">TER · 7h</span><p><strong>Um prompt, um CRM.</strong> E a armadilha que ninguém te conta.</p></div>
        <div class="crono-item"><span class="crono-dia">QUA · 7h</span><p><strong>Os dados.</strong> Onde empresa de verdade guarda, e por que o seu sistema trava sozinho sem isso.</p></div>
        <div class="crono-item"><span class="crono-dia">QUI · 7h</span><p><strong>O CRM ganha vida.</strong> A parte que muda tudo.</p></div>
        <div class="crono-item"><span class="crono-dia">SEX · 7h</span><p><strong>O link no ar.</strong> O sistema publicado, pronto pra você mostrar pro mundo.</p></div>
      </div>
    </div>
  </section>

  <!-- OFERTA -->
  <section class="oferta">
    <div class="wrap">
      <h2 class="sec-tit">Sua <em>vaga</em> no desafio</h2>
      <p class="sec-intro">Um sistema desses, sob medida, é vendido no mercado por até R$5.000. A vaga pra aprender a construir um custa menos que um almoço.</p>
      <div class="preco-card">
        <div class="preco-de">de R$97</div>
        <div class="preco-num"><span class="cifra">R$</span>44</div>
        <p class="preco-obs">pagamento único · <strong>acesso por 1 ano</strong></p>
        <a href="${CHECKOUT_URL}" class="btn dc-cta" data-cta="preco" style="width:100%">Quero construir meu CRM</a>
      </div>
    </div>
  </section>

  <!-- PARA QUEM -->
  <section>
    <div class="wrap">
      <h2 class="sec-tit">É pra você <em>se</em>...</h2>
      <div class="quem-grid" style="margin-top:32px">
        <div class="quem-col quem-sim">
          <h3>✅ É pra você</h3>
          <ul>
            <li>Quer uma nova fonte de renda com IA, sem depender de programar</li>
            <li>Já mexe com IA mas não tem o que entregar pra empresa</li>
            <li>Cansou de curso teórico que não vira nada concreto</li>
            <li>Topa sentar 5 manhãs e sair com um sistema no ar</li>
          </ul>
        </div>
        <div class="quem-col quem-nao">
          <h3>🚫 Não é pra você</h3>
          <ul>
            <li>Procura fórmula mágica de dinheiro rápido sem fazer nada</li>
            <li>Não vai reservar as manhãs pra construir junto</li>
            <li>Quer só mais um certificado pra pendurar na parede</li>
            <li>Acha que dá pra virar prestador sem ter uma prova pra mostrar</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="crono">
    <div class="wrap">
      <h2 class="sec-tit">Perguntas <em>rápidas</em></h2>
      <div class="faq-list" style="margin-top:32px">
        <div class="faq-item"><h4>Preciso saber programar?</h4><p>Não. A maior parte do trabalho é conversar com a IA sobre o que o sistema precisa fazer. Se você usa WhatsApp, você acompanha.</p></div>
        <div class="faq-item"><h4>E se eu não conseguir assistir num dia?</h4><p>As aulas ficam gravadas por 1 ano. Mas se organize pra acompanhar no horário, é assim que você constrói junto em vez de só assistir.</p></div>
        <div class="faq-item"><h4>O que eu preciso ter?</h4><p>Um computador e vontade de construir. As ferramentas que a gente usa têm plano gratuito pra começar.</p></div>
        <div class="faq-item"><h4>Serve pro meu nicho?</h4><p>Serve. Você constrói um CRM base e adapta pra clínica, imobiliária, comércio, o que for. A lógica é a mesma.</p></div>
      </div>
    </div>
  </section>

  <!-- CTA FINAL -->
  <section class="cta-final">
    <div class="wrap">
      <h2>5 dias pra construir o que você <em>adia há um ano.</em></h2>
      <p class="sub" style="margin-bottom:32px">Dia 27 você começa do zero. Dia 31 você tem um CRM no ar, com seu link. Bora.</p>
      <a href="${CHECKOUT_URL}" class="btn dc-cta" data-cta="cta-final">Garantir minha vaga — R$44</a>
      <span class="btn-sub">acesso por 1 ano · pagamento único</span>
    </div>
  </section>

  <div class="foot">RedPro AI Academy · Desafio Construindo um CRM em 5 Dias</div>

</div>
`;

export default function DesafioCrmPage() {
  const pixelViewContent = `
    (function () {
      var t = 0;
      function fire() {
        if (typeof fbq !== 'undefined') {
          fbq('track', 'ViewContent', { content_name: 'Desafio CRM 5 Dias', content_ids: ['ingresso-desafio'], content_type: 'product', value: 44.00, currency: 'BRL' });
          return;
        }
        if (++t < 20) setTimeout(fire, 250);
      }
      fire();
    })();
  `;
  const pixelInitiateCheckout = `
    (function () {
      function lig() {
        document.querySelectorAll('.dc-cta').forEach(function (b) {
          b.addEventListener('click', function () {
            if (typeof fbq !== 'undefined') {
              fbq('track', 'InitiateCheckout', { content_name: 'Desafio CRM 5 Dias', content_ids: ['ingresso-desafio'], content_type: 'product', value: 44.00, currency: 'BRL' });
            }
          });
        });
      }
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', lig); else lig();
    })();
  `;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: pixelViewContent }} />
      <script dangerouslySetInnerHTML={{ __html: pixelInitiateCheckout }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}

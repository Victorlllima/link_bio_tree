import type { Metadata } from "next";

// ⚠️ PLACEHOLDER: substituir pelo checkout real da Formação S.H.A.R.K. quando a Gleyce criar o produto no Hotmart.
const CHECKOUT_URL = "#checkout-formacao-a-criar";

export const metadata: Metadata = {
  title: "Formação S.H.A.R.K. — RedPro AI Academy",
  description:
    "Você já sabe construir. Agora aprenda a cobrar, prospectar e entregar — os 5 agentes que transformam um sistema em cliente pagante recorrente.",
  openGraph: {
    type: "website",
    url: "https://redpro.com.br/formacao-shark",
    title: "Formação S.H.A.R.K. — RedPro AI Academy",
    description:
      "Você já sabe construir. Agora aprenda a transformar isso em renda. O método completo dos 5 agentes.",
    locale: "pt_BR",
  },
};

const html = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200;400;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

<style>
  .fs-root, .fs-root *, .fs-root *::before, .fs-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .fs-root {
    --laranja: #F97316;
    --laranja-dim: #C2500E;
    --laranja-glow: rgba(249,115,22,.18);
    --preto: #080808;
    --grafite: #111111;
    --card: #141414;
    --linha: #1F1F1F;
    --texto-mid: #8A8A8A;
    --texto-soft: #B8B8B8;
    --branco: #F5F5F5;
    --verde: #4ADE80;

    background: var(--preto);
    color: var(--branco);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 16px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
  }

  .fs-root .container { max-width: 920px; margin: 0 auto; padding: 0 24px; }
  .fs-root .narrow { max-width: 680px; margin: 0 auto; }
  .fs-root section { padding: 72px 0; border-bottom: 1px solid var(--linha); }
  .fs-root .section-label {
    font-size: 12px; font-weight: 700; letter-spacing: .28em; text-transform: uppercase;
    color: var(--laranja); display: block; text-align: center; margin-bottom: 20px;
    border-bottom: 1px solid var(--laranja-dim); padding-bottom: 8px; width: fit-content; margin-left: auto; margin-right: auto;
  }
  .fs-root h1, .fs-root h2 {
    font-family: 'Bricolage Grotesque', sans-serif; font-weight: 900;
    line-height: 1.05; letter-spacing: -.03em; text-align: center; color: var(--branco);
  }
  .fs-root h1 { font-size: clamp(34px, 6vw, 60px); }
  .fs-root h2 { font-size: clamp(26px, 4vw, 40px); margin-bottom: 12px; }
  .fs-root h1 em, .fs-root h2 em { font-style: normal; color: var(--laranja); }
  .fs-root p { color: var(--texto-soft); text-align: center; }
  .fs-root .lead { font-size: 18px; margin-top: 16px; }

  /* HERO */
  .fs-root .hero { padding: 96px 0 80px; text-align: center; background: radial-gradient(ellipse at top, var(--laranja-glow), transparent 60%); }
  .fs-root .kicker { font-size: 13px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--laranja); margin-bottom: 24px; }

  /* botão */
  .fs-root .btn {
    display: inline-block; background: var(--laranja); color: var(--preto);
    font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 17px;
    padding: 18px 40px; border-radius: 10px; text-decoration: none; border: none; cursor: pointer;
    transition: transform .15s, box-shadow .15s;
  }
  .fs-root .btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px var(--laranja-glow); }
  .fs-root .btn-wrap { text-align: center; margin-top: 32px; }

  /* placeholder visual */
  .fs-root .ph {
    border: 1px dashed var(--laranja-dim); border-radius: 10px; padding: 22px;
    color: var(--texto-mid); font-size: 13px; text-align: center; background: rgba(249,115,22,.04);
    margin: 12px 0;
  }
  .fs-root .ph strong { color: var(--laranja); }

  /* depoimentos */
  .fs-root .depo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 8px; }
  .fs-root .depo { background: var(--card); border: 1px solid var(--linha); border-radius: 12px; padding: 22px; }
  .fs-root .depo .nome { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; color: var(--branco); margin-top: 12px; text-align: left; }
  .fs-root .depo p { text-align: left; font-size: 14px; color: var(--texto-soft); }

  /* tabuleiro / 5 agentes */
  .fs-root .agentes { display: grid; gap: 14px; margin-top: 8px; }
  .fs-root .agente { display: flex; gap: 16px; align-items: flex-start; background: var(--card); border: 1px solid var(--linha); border-left: 3px solid var(--laranja); border-radius: 10px; padding: 20px 22px; }
  .fs-root .agente .n { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 900; font-size: 22px; color: var(--laranja); min-width: 90px; }
  .fs-root .agente .d { text-align: left; }
  .fs-root .agente .d strong { color: var(--branco); display: block; margin-bottom: 4px; font-family: 'Bricolage Grotesque', sans-serif; }
  .fs-root .agente .d span { font-size: 14px; color: var(--texto-soft); }

  /* preço */
  .fs-root .preco-card { max-width: 460px; margin: 0 auto; background: var(--card); border: 1px solid var(--linha); border-radius: 18px; padding: 40px 32px; text-align: center; }
  .fs-root .preco-de { font-size: 20px; color: var(--texto-mid); text-decoration: line-through; text-decoration-color: var(--laranja); display: block; margin-bottom: 4px; }
  .fs-root .preco-parcela { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 900; font-size: 52px; color: var(--branco); line-height: 1; letter-spacing: -.03em; }
  .fs-root .preco-parcela .moeda { font-size: 24px; font-weight: 200; color: var(--laranja); vertical-align: 18px; margin-right: 2px; }
  .fs-root .preco-vista { font-size: 14px; color: var(--texto-mid); margin-top: 10px; }

  /* garantia */
  .fs-root .garantia-box { background: rgba(74,222,128,.06); border: 1px solid rgba(74,222,128,.25); border-radius: 12px; padding: 24px; margin-top: 20px; }
  .fs-root .garantia-box strong { color: var(--verde); }
  .fs-root .garantia-box p { text-align: left; font-size: 14px; }

  /* bônus */
  .fs-root .bonus { display: grid; gap: 12px; margin-top: 8px; }
  .fs-root .bonus-item { background: var(--card); border: 1px solid var(--linha); border-radius: 10px; padding: 18px 20px; text-align: left; }
  .fs-root .bonus-item .tag { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--laranja); }
  .fs-root .bonus-item .txt { color: var(--texto-soft); font-size: 14px; margin-top: 4px; }

  /* listas para-quem / recebe */
  .fs-root .lista { max-width: 640px; margin: 8px auto 0; display: grid; gap: 10px; }
  .fs-root .lista li { list-style: none; padding-left: 30px; position: relative; text-align: left; color: var(--texto-soft); font-size: 15px; }
  .fs-root .lista li::before { content: "→"; position: absolute; left: 0; color: var(--laranja); font-weight: 700; }
  .fs-root .lista.nao li::before { content: "✕"; color: var(--texto-mid); }

  /* faq */
  .fs-root .faq { max-width: 700px; margin: 0 auto; display: grid; gap: 12px; }
  .fs-root .faq-item { background: var(--card); border: 1px solid var(--linha); border-radius: 10px; padding: 20px 22px; }
  .fs-root .faq-item .q { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; color: var(--branco); text-align: left; }
  .fs-root .faq-item .a { color: var(--texto-soft); font-size: 14px; margin-top: 6px; text-align: left; }

  .fs-root .fim { text-align: center; padding: 88px 0; background: radial-gradient(ellipse at bottom, var(--laranja-glow), transparent 60%); }
</style>

<div class="fs-root">

  <!-- HERO -->
  <section class="hero">
    <div class="container">
      <div class="kicker">Formação S.H.A.R.K.</div>
      <h1>Você acabou de publicar um sistema que empresa paga caro pra ter.<br><em>Agora aprenda a fazer isso virar renda.</em></h1>
      <p class="lead">No evento você provou que constrói. A Formação te dá a sequência completa pra virar quem o mercado paga: cobrar, prospectar e entregar.</p>
      <div class="btn-wrap"><a href="${CHECKOUT_URL}" class="btn" data-cta="hero">Quero a Formação completa</a></div>
    </div>
  </section>

  <!-- DEPOIMENTOS IMEDIATOS -->
  <section>
    <div class="container">
      <span class="section-label">Quem já fez</span>
      <div class="depo-grid">
        <div class="depo">
          <p>[AGUARDANDO DEPOIMENTO REAL: resultado específico + prazo + o que destravou]</p>
          <div class="nome">Neto</div>
        </div>
        <div class="depo">
          <p>[AGUARDANDO DEPOIMENTO REAL: resultado específico + prazo + o que destravou]</p>
          <div class="nome">Wilson</div>
        </div>
      </div>
    </div>
  </section>

  <!-- A PONTE -->
  <section>
    <div class="container narrow">
      <span class="section-label">A ponte</span>
      <h2>Construir foi o começo. <em>Cobrar é o método.</em></h2>
      <p class="lead">No evento você construiu e publicou um CRM. Isso prova capacidade. Não prova que você sabe cobrar, prospectar e entregar pra cliente de verdade. É exatamente esse gap que a Formação fecha.</p>
    </div>
  </section>

  <!-- MECANISMO — O TABULEIRO -->
  <section>
    <div class="container">
      <span class="section-label">O Tabuleiro</span>
      <h2>Os <em>5 agentes</em> que viram cliente pagante</h2>
      <div class="agentes narrow" style="max-width:720px;margin-top:24px">
        <div class="agente"><div class="n">Shiva</div><div class="d"><strong>Diagnóstico</strong><span>Enxergar a dor certa da empresa — a que ela paga pra resolver.</span></div></div>
        <div class="agente"><div class="n">Hades</div><div class="d"><strong>Proposta &amp; cobrança</strong><span>Precificar e cobrar sem medo. O elo onde a maioria trava.</span></div></div>
        <div class="agente"><div class="n">Atlas</div><div class="d"><strong>Execução</strong><span>Construir o sistema sob medida — o que você já aprendeu no evento.</span></div></div>
        <div class="agente"><div class="n">Ravena</div><div class="d"><strong>Automação</strong><span>Fazer o sistema operar sozinho, sem depender de você o tempo todo.</span></div></div>
        <div class="agente"><div class="n">Kerberos</div><div class="d"><strong>Retenção</strong><span>Reter o cliente e virar recorrência — não um projeto único.</span></div></div>
      </div>
    </div>
  </section>

  <!-- ANCORAGEM PRÉ-PREÇO -->
  <section>
    <div class="container narrow">
      <span class="section-label">O valor real</span>
      <h2>Um projeto de automação fecha por <em>R$3 a 5 mil</em>.</h2>
      <p class="lead">Programa desse tipo, no mercado, sai na casa dos R$2.000. A Formação custa menos que um único projeto que você vai fechar depois dela.</p>
    </div>
  </section>

  <!-- O QUE RECEBE -->
  <section>
    <div class="container">
      <span class="section-label">O que você recebe</span>
      <h2>Ao fim de cada fase, uma <em>capacidade nova</em></h2>
      <ul class="lista">
        <li>Diagnosticar uma empresa e achar a dor que ela paga pra resolver</li>
        <li>Precificar e cobrar um projeto de IA sem se subvalorizar</li>
        <li>Construir o sistema sob medida (o CRM foi só o primeiro)</li>
        <li>Automatizar a operação pra rodar sem você</li>
        <li>Reter o cliente e transformar em receita recorrente</li>
        <li><strong style="color:var(--branco)">1 ano completo</strong> de acesso ao conteúdo e às atualizações</li>
      </ul>
    </div>
  </section>

  <!-- PROVA SOCIAL REFORÇO -->
  <section>
    <div class="container">
      <span class="section-label">Mais resultados</span>
      <div class="depo-grid">
        <div class="depo"><p>[AGUARDANDO DEPOIMENTO REAL]</p><div class="nome">Marcos Flávio</div></div>
        <div class="depo"><p>[AGUARDANDO DEPOIMENTO REAL]</p><div class="nome">Rafael</div></div>
        <div class="depo"><p>[AGUARDANDO DEPOIMENTO REAL]</p><div class="nome">Henrique</div></div>
      </div>
    </div>
  </section>

  <!-- OFERTA + PREÇO -->
  <section id="preco">
    <div class="container">
      <span class="section-label">A oferta</span>
      <div class="preco-card">
        <span class="preco-de">de R$2.000</span>
        <div class="preco-parcela"><span class="moeda">12x R$</span>83<span style="font-size:28px">,17</span></div>
        <p class="preco-vista">ou R$998 à vista · 1 ano de acesso</p>
        <div class="btn-wrap" style="margin-top:24px"><a href="${CHECKOUT_URL}" class="btn" id="btn-checkout" data-cta="preco">Entrar na Formação</a></div>

        <div class="garantia-box">
          <p><strong>Garantia dupla — 6 meses de risco meu, não seu.</strong></p>
          <p style="margin-top:10px"><strong style="color:var(--branco)">7 dias incondicional:</strong> não gostou, devolvo tudo, sem justificar.</p>
          <p style="margin-top:8px"><strong style="color:var(--branco)">90+90 dias condicional:</strong> aplique o método por 90 dias provando que fez a parte. Se não fechou o 1º cliente, faço uma consultoria individual com você + plano pros próximos 90 dias. Se ainda assim não fechar, devolução integral.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- BÔNUS -->
  <section>
    <div class="container narrow">
      <span class="section-label">Bônus por velocidade</span>
      <h2>Quem age rápido, <em>leva mais</em></h2>
      <div class="bonus">
        <div class="bonus-item"><span class="tag">★ 5 primeiros</span><div class="txt">Call individual de 10-15min comigo + plano de ação personalizado pro seu caso.</div></div>
        <div class="bonus-item"><span class="tag">1ª hora</span><div class="txt">Banco de scripts de prospecção por nicho + mapa dos nichos que mais contratam IA + template de proposta comercial.</div></div>
        <div class="bonus-item"><span class="tag">Só no D1 (até 21h)</span><div class="txt">Condição de preço de lançamento — não volta depois que o carrinho fecha.</div></div>
      </div>
    </div>
  </section>

  <!-- PARA QUEM É / NÃO É -->
  <section>
    <div class="container narrow">
      <span class="section-label">Para quem é</span>
      <h2>Isso é <em>pra você</em> se…</h2>
      <ul class="lista">
        <li>Você construiu o CRM no evento e quer que isso vire uma segunda fonte de renda</li>
        <li>Você quer prestar serviço de IA pra empresas, sem virar programador</li>
        <li>Você trava na hora de cobrar e não sabe como abordar cliente</li>
      </ul>
      <h2 style="margin-top:40px">Não é pra você se…</h2>
      <ul class="lista nao">
        <li>Você quer só "brincar com IA" e não pretende cobrar por isso</li>
        <li>Você espera resultado sem aplicar o método</li>
      </ul>
    </div>
  </section>

  <!-- AUTORIDADE DO RED (depois do preço/garantia) -->
  <section>
    <div class="container narrow">
      <span class="section-label">Quem te ensina</span>
      <h2>Red — <em>RedPro AI Academy</em></h2>
      <div class="ph"><strong>[FOTO PROFISSIONAL DO RED]</strong> — a foto do expert entra aqui (gerar via LUA/LoRA)</div>
      <p class="lead">Criador do Método S.H.A.R.K.. Opera a própria RedPro com o mesmo método que ensina — não é teoria, é o que ele roda todo dia. Ensina profissionais em transição a virarem prestadores de IA usando o sistema construído como prova viva de que o caminho funciona.</p>
    </div>
  </section>

  <!-- FAQ -->
  <section>
    <div class="container">
      <span class="section-label">Perguntas</span>
      <div class="faq">
        <div class="faq-item"><div class="q">R$998 é caro?</div><div class="a">Um único projeto de IA fecha por R$3-5 mil. A Formação custa menos que um projeto — e é ela que te ensina a fechar o primeiro. Com a garantia de 6 meses, o risco é meu.</div></div>
        <div class="faq-item"><div class="q">E se eu não souber programar?</div><div class="a">Ninguém programa. Você descreve o que a empresa precisa e a IA constrói. Você provou isso no evento inteiro.</div></div>
        <div class="faq-item"><div class="q">Quanto tempo até o primeiro cliente?</div><div class="a">Depende de você aplicar. Por isso a garantia condicional: se você aplicar por 90 dias e não fechar, eu entro junto.</div></div>
        <div class="faq-item"><div class="q">Tem suporte?</div><div class="a">Sim — 1 ano de acesso ao conteúdo e às atualizações, mais os bônus de acompanhamento pra quem entra cedo.</div></div>
        <div class="faq-item"><div class="q">Serve se eu tenho CLT?</div><div class="a">Serve — é feito pra quem quer uma segunda fonte de renda no próprio ritmo, sem largar o emprego de imediato.</div></div>
        <div class="faq-item"><div class="q">Como funciona a garantia condicional?</div><div class="a">Você aplica o método por 90 dias provando que fez sua parte. Se não fechou o 1º cliente, consultoria individual comigo + plano pros próximos 90 dias. Se mesmo assim não fechar, devolvo tudo.</div></div>
      </div>
    </div>
  </section>

  <!-- CTA FINAL -->
  <section class="fim">
    <div class="container narrow">
      <h2>Você já provou que constrói.<br><em>Agora escolhe se vira quem o mercado paga.</em></h2>
      <p class="lead">O carrinho abre segunda 3/ago às 6h50 e fecha 21h do mesmo dia. Depois disso, a condição de lançamento não volta.</p>
      <div class="btn-wrap"><a href="${CHECKOUT_URL}" class="btn" data-cta="cta-final">Entrar na Formação S.H.A.R.K.</a></div>
    </div>
  </section>

</div>
`;

export default function FormacaoSharkPage() {
  const pixelViewContent = `
    if (typeof fbq !== 'undefined') {
      fbq('track', 'ViewContent', {
        content_name: 'Formacao SHARK',
        content_type: 'product',
        value: 998.00,
        currency: 'BRL'
      });
    }
  `;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: pixelViewContent }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}

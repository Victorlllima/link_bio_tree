/* ============================================================================
 *  /app-mockup — demo navegável (N1) do app RedPro AI Academy
 * ----------------------------------------------------------------------------
 *  HTML estático, sem build do Next: mesmo motivo do /hermes-week (route.ts
 *  em vez de page.tsx) — documento independente do React, servido pronto.
 *  Fonte editável: Vibecoding/redpro-academy-app/mockup/index.html.
 *  Imagens em public/app-mockup-assets/ (cópia dos assets do mockup).
 * ==========================================================================*/

const HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex,nofollow">
<title>RedPro AI Academy — Demo N1</title>
<style>
  :root {
    --bg: #0a0a0a;
    --bg-card: #161616;
    --bg-card-2: #1e1e1e;
    --orange: #ff6a00;
    --orange-soft: #ff6a0022;
    --text: #f5f5f5;
    --text-dim: #9a9a9a;
    --locked: #3a3a3a;
    --green: #2ecc71;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #000;
    color: var(--text);
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: center;
    padding: 32px 16px;
  }
  .meta {
    width: 100%;
    text-align: center;
    color: var(--text-dim);
    font-size: 13px;
    margin-bottom: -8px;
  }
  .phone {
    width: 390px;
    height: 844px;
    background: var(--bg);
    border-radius: 40px;
    border: 1px solid #2a2a2a;
    overflow: hidden;
    position: relative;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
  }
  .screen { display: none; flex: 1; overflow-y: auto; padding-bottom: 90px; }
  .screen.active { display: flex; flex-direction: column; }

  .statusbar {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    flex-shrink: 0;
  }

  .topbar {
    padding: 4px 20px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .topbar .brand { font-weight: 800; font-size: 15px; letter-spacing: -0.2px; line-height: 1.2; }
  .topbar .brand span { color: var(--orange); }
  .topbar .back { color: var(--text-dim); font-size: 13px; cursor: pointer; background: none; border: none; font-family: inherit; padding: 0; }
  .badge-tier {
    font-size: 10px;
    font-weight: 700;
    padding: 4px 9px;
    border-radius: 20px;
    background: var(--orange-soft);
    color: var(--orange);
    border: 1px solid var(--orange);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .tabbar {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 86px;
    background: #0d0d0dee;
    backdrop-filter: blur(10px);
    border-top: 1px solid #2a2a2a;
    display: flex;
    padding-bottom: 20px;
  }
  .tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    color: var(--text-dim);
    font-size: 9.5px;
    cursor: pointer;
    background: none;
    border: none;
    font-family: inherit;
    padding: 0 2px;
  }
  .tab.active { color: var(--orange); }
  .tab .icon { font-size: 18px; }

  .onboard {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 32px;
    text-align: center;
    gap: 20px;
  }
  .onboard .logo { font-size: 26px; font-weight: 900; line-height: 1.2; }
  .onboard .logo span { color: var(--orange); }
  .onboard p { color: var(--text-dim); font-size: 14px; line-height: 1.5; margin: 0; }
  .onboard input {
    width: 100%;
    padding: 14px 16px;
    border-radius: 12px;
    border: 1px solid #333;
    background: var(--bg-card);
    color: var(--text);
    font-size: 14px;
  }
  .btn-primary {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: var(--orange);
    color: #000;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
  }
  .btn-secondary {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: 1px solid var(--orange);
    background: transparent;
    color: var(--orange);
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
  }

  .section { padding: 0 20px 24px; }
  .section h2 { font-size: 15px; margin: 0 0 12px; color: var(--text-dim); font-weight: 600; }

  .xp-card {
    margin: 0 20px 20px;
    background: linear-gradient(135deg, var(--bg-card), var(--bg-card-2));
    border: 1px solid #2a2a2a;
    border-radius: 18px;
    padding: 18px;
  }
  .xp-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .xp-level { font-weight: 800; font-size: 16px; }
  .xp-streak { font-size: 13px; color: var(--orange); font-weight: 700; }
  .xp-bar-bg { height: 8px; background: #2a2a2a; border-radius: 10px; overflow: hidden; }
  .xp-bar-fill { height: 100%; width: 62%; background: var(--orange); border-radius: 10px; }
  .xp-foot { display: flex; justify-content: space-between; margin-top: 6px; font-size: 11px; color: var(--text-dim); }

  .badges-row { display: flex; gap: 10px; overflow-x: auto; padding: 0 20px 22px; }
  .badge { min-width: 64px; text-align: center; flex-shrink: 0; }
  .badge .circle {
    width: 52px; height: 52px;
    border-radius: 50%;
    background: var(--bg-card-2);
    border: 1px solid #333;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    margin: 0 auto 6px;
  }
  .badge.locked .circle { opacity: 0.35; filter: grayscale(1); }
  .badge span { font-size: 10px; color: var(--text-dim); }

  .item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    border-bottom: 1px solid #1a1a1a;
  }
  .item .ico {
    width: 42px; height: 42px;
    border-radius: 12px;
    background: var(--bg-card-2);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    font-weight: 700;
    color: var(--text-dim);
    flex-shrink: 0;
  }
  .item .info { flex: 1; min-width: 0; }
  .item .info .t { font-size: 13.5px; font-weight: 600; line-height: 1.3; }
  .item .info .s { font-size: 11.5px; color: var(--text-dim); margin-top: 2px; }
  .item .lock { font-size: 16px; color: var(--locked); flex-shrink: 0; }
  .item.locked .info .t { color: var(--text-dim); }
  .item .check { color: var(--green); font-size: 16px; flex-shrink: 0; }

  .pill {
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 10px;
    background: var(--orange-soft);
    color: var(--orange);
    font-weight: 700;
    margin-left: 6px;
  }
  .pill.gray { background: #2a2a2a; color: var(--text-dim); }
  .pill.blue { background: #1a2a3a; color: #6ab4ff; }

  .notif { padding: 14px 20px; border-bottom: 1px solid #1a1a1a; display: flex; gap: 12px; }
  .notif .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--orange); margin-top: 5px; flex-shrink: 0; }
  .notif.read .dot { background: transparent; }
  .notif .body .t { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
  .notif .body .s { font-size: 12px; color: var(--text-dim); line-height: 1.4; }
  .notif .time { font-size: 11px; color: #555; white-space: nowrap; }

  .store-grid { padding: 0 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .store-card { background: var(--bg-card); border: 1px solid #2a2a2a; border-radius: 14px; padding: 12px; }
  .store-card .thumb { height: 90px; border-radius: 10px; background: var(--bg-card-2); overflow: hidden; margin-bottom: 8px; }
  .store-card .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .store-card .t { font-size: 12px; font-weight: 700; line-height: 1.3; margin-bottom: 4px; }
  .store-card .price { font-size: 13px; color: var(--orange); font-weight: 800; }
  .store-card .buy {
    margin-top: 8px;
    width: 100%;
    padding: 8px;
    border-radius: 8px;
    border: none;
    background: #262626;
    color: var(--text);
    font-size: 11px;
    font-weight: 700;
  }

  .profile-head { display: flex; flex-direction: column; align-items: center; padding: 24px 20px; gap: 8px; }
  .avatar { width: 72px; height: 72px; border-radius: 50%; background: var(--orange-soft); border: 2px solid var(--orange); display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800; color: var(--orange); overflow: hidden; }
  .avatar img { width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: 50%; }
  .profile-name { font-weight: 800; font-size: 17px; }
  .profile-tier { font-size: 12px; color: var(--text-dim); }

  .upsell-banner {
    margin: 0 20px 20px;
    padding: 16px;
    border-radius: 14px;
    border: 1px dashed var(--orange);
    background: var(--orange-soft);
    font-size: 12px;
    line-height: 1.5;
  }
  .upsell-banner b { color: var(--orange); }

  .label-note { font-size: 11px; color: #555; text-align: center; padding: 10px 20px 0; }

  .mentoria-hero {
    margin: 0 20px 18px;
    padding: 20px;
    border-radius: 16px;
    background: linear-gradient(135deg, var(--bg-card), var(--bg-card-2));
    border: 1px solid #2a2a2a;
  }
  .mentoria-hero h3 { margin: 0 0 8px; font-size: 17px; }
  .mentoria-hero p { margin: 0; font-size: 13px; color: var(--text-dim); line-height: 1.5; }
  .mentoria-list { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 10px; }
  .mentoria-list .row { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; line-height: 1.4; }
  .mentoria-list .row .ck { color: var(--orange); flex-shrink: 0; }
  .mentoria-cta { padding: 0 20px; }

  .onboard .logo-img { width: 150px; height: auto; }

  .free-card {
    margin: 0 20px 18px;
    background: var(--bg-card);
    border: 1px solid #2a2a2a;
    border-radius: 16px;
    padding: 16px;
  }
  .free-card .t { font-weight: 800; font-size: 14px; margin-bottom: 2px; }
  .free-card .s { font-size: 11.5px; color: var(--text-dim); margin-bottom: 12px; }
  .free-days { display: flex; flex-direction: column; gap: 8px; }
  .free-day { display: flex; gap: 10px; align-items: flex-start; font-size: 12px; }
  .free-day .n { color: var(--orange); font-weight: 800; flex-shrink: 0; }
  .free-day .d { color: var(--text-dim); line-height: 1.35; }
</style>
</head>
<body>

<div class="meta">RedPro AI Academy — Demo N1 (navegável, sem backend) · toque nas abas inferiores · toque no selo "ACESSO: ..." na tela Início pra simular tier (recurso só da demo, não existe no app real)</div>

<div class="phone">
  <div class="statusbar">
    <span>9:41</span>
    <span>●●● 5G 🔋</span>
  </div>

  <div class="screen active" id="screen-onboard">
    <div class="onboard">
      <img class="logo-img" src="/app-mockup-assets/logo-redpro.png" alt="RedPro AI Academy">
      <p>Entra com o e-mail que você usou na compra. A gente já libera o que é seu.</p>
      <input type="email" placeholder="seu@email.com" value="aluno@exemplo.com">
      <button class="btn-primary" onclick="goTo('home')">Entrar</button>
    </div>
  </div>

  <div class="screen" id="screen-home">
    <div class="topbar">
      <div class="brand">RedPro AI <span>Academy</span></div>
      <div class="badge-tier" id="tier-label" onclick="toggleTier()" style="cursor:pointer;">ACESSO: HERMES WEEK</div>
    </div>

    <div class="xp-card">
      <div class="xp-top">
        <div class="xp-level">Nível 4 · Operador</div>
        <div class="xp-streak">🔥 6 dias</div>
      </div>
      <div class="xp-bar-bg"><div class="xp-bar-fill"></div></div>
      <div class="xp-foot"><span>620 XP</span><span>1000 XP p/ nível 5</span></div>
    </div>

    <div class="section" style="padding-bottom:0;"><h2>Conquistas</h2></div>
    <div class="badges-row">
      <div class="badge"><div class="circle">🏗️</div><span>1º Agente</span></div>
      <div class="badge"><div class="circle">🔥</div><span>Streak 5d</span></div>
      <div class="badge"><div class="circle">📦</div><span>1ª Entrega</span></div>
      <div class="badge locked"><div class="circle">🤖</div><span>5 Agentes</span></div>
      <div class="badge locked"><div class="circle">👑</div><span>Squad</span></div>
    </div>

    <div class="section"><h2>Continue de onde parou</h2></div>
    <div class="item">
      <div class="ico">▶</div>
      <div class="info">
        <div class="t">Aula 3 — Automação de navegador</div>
        <div class="s">Hermes Week · 68% concluído</div>
      </div>
    </div>
    <div class="item locked" id="home-locked-item">
      <div class="ico">🔒</div>
      <div class="info">
        <div class="t">Módulo 2 — De um agente a um squad</div>
        <div class="s">Exclusivo Formação Arquiteto de Agentes</div>
      </div>
      <div class="lock">🔒</div>
    </div>

    <div class="upsell-banner" id="upsell-home">
      <b>Você tá só vendo a ponta.</b> Quem está na Formação Arquiteto de Agentes já desbloqueou operar fora da própria máquina, orquestrar squad e automatizar o próprio negócio. <u>Ver Formação Arquiteto de Agentes →</u>
    </div>
  </div>

  <div class="screen" id="screen-trilha">
    <div class="topbar"><div class="brand">Sua <span>Trilha</span></div></div>

    <div class="section" style="padding-bottom:0;"><h2>Hermes Week <span class="pill">liberado</span></h2></div>
    <div class="item"><div class="ico">1</div><div class="info"><div class="t">Instalação e interface</div><div class="s">Instalar o Hermes, plugar um cérebro e responder pelo Telegram</div></div><div class="check">✓</div></div>
    <div class="item"><div class="ico">2</div><div class="info"><div class="t">Configurações: o motor, a alma, a memória e o cérebro</div><div class="s">Gateway, SOUL.md e as quatro camadas de memória</div></div><div class="check">✓</div></div>
    <div class="item"><div class="ico">3</div><div class="info"><div class="t">Automação de navegador</div><div class="s">68% concluído</div></div></div>
    <div class="item"><div class="ico">4</div><div class="info"><div class="t">Plugins e personalização</div><div class="s">Libera em 24/09 às 20h</div></div></div>
    <div class="item"><div class="ico">5</div><div class="info"><div class="t">MCP, HUD e rotinas</div><div class="s">Ferramentas externas e automação agendada</div></div></div>
    <div class="item"><div class="ico">★</div><div class="info"><div class="t">Aula bônus · De um agente a um squad</div><div class="s">Domingo às 20h — encontro de fechamento da semana</div></div></div>

    <div class="section" style="padding-bottom:0; padding-top:10px;"><h2>Formação Arquiteto de Agentes <span class="pill gray" id="formacao-pill">bloqueado</span></h2></div>
    <div class="item locked formacao-item"><div class="ico">1</div><div class="info"><div class="t">Seu agente fora da sua máquina</div><div class="s">VPS, blindagem e gateway que nunca cai</div></div><div class="lock">🔒</div></div>
    <div class="item locked formacao-item"><div class="ico">2</div><div class="info"><div class="t">De um agente a um squad</div><div class="s">Memória organizada, skills próprias, tarefas agendadas</div></div><div class="lock">🔒</div></div>
    <div class="item locked formacao-item"><div class="ico">3</div><div class="info"><div class="t">Gerenciando seu negócio</div><div class="s">Um chefe de gabinete digital pro financeiro e operação</div></div><div class="lock">🔒</div></div>
    <div class="item locked formacao-item"><div class="ico">4</div><div class="info"><div class="t">Seu esquadrão de desenvolvimento</div><div class="s">Delegação real entre agentes, perfis e kanban</div></div><div class="lock">🔒</div></div>
    <div class="item locked formacao-item"><div class="ico">5</div><div class="info"><div class="t">Sua equipe de Marketing e Conteúdo</div><div class="s">Produção de conteúdo e tráfego pago automatizado</div></div><div class="lock">🔒</div></div>
    <div class="item locked formacao-item"><div class="ico">6</div><div class="info"><div class="t">Projetos prontos pra você copiar</div><div class="s">Automações plugáveis: briefing, triagem de e-mail e mais</div></div><div class="lock">🔒</div></div>
  </div>

  <div class="screen" id="screen-gratis">
    <div class="topbar"><div class="brand">Materiais <span>Grátis</span></div></div>
    <div class="label-note" style="text-align:left; padding:0 20px 14px;">Tudo aberto, sem precisar ter comprado nada — mesmo catálogo do RedVault</div>

    <div class="free-card">
      <div class="t">Soluções Agênticas em 5 Dias</div>
      <div class="s">Curso gratuito por e-mail</div>
      <div class="free-days">
        <div class="free-day"><span class="n">1</span><span class="d">O funcionário que você nunca vai demitir</span></div>
        <div class="free-day"><span class="n">2</span><span class="d">As 4 peças + escreve a 1ª instrução</span></div>
        <div class="free-day"><span class="n">3</span><span class="d">Monta o agente num Project e testa</span></div>
        <div class="free-day"><span class="n">4</span><span class="d">Cowork: seu agente ganha mãos</span></div>
        <div class="free-day"><span class="n">5</span><span class="d">De um agente a um time (a profissão)</span></div>
      </div>
    </div>

    <div class="section" style="padding-bottom:0;"><h2>Skills</h2></div>
    <div class="item"><div class="ico">⬇</div><div class="info"><div class="t">Auditoria de Segurança</div><div class="s">Skill pra instalar no seu Claude Code</div></div><span class="pill blue">skill</span></div>
    <div class="item"><div class="ico">⬇</div><div class="info"><div class="t">Raio-X de Custo</div><div class="s">Skill pra instalar no seu Claude Code</div></div><span class="pill blue">skill</span></div>
    <div class="item"><div class="ico">⬇</div><div class="info"><div class="t">Teste de Carga</div><div class="s">Skill pra instalar no seu Claude Code</div></div><span class="pill blue">skill</span></div>
    <div class="item"><div class="ico">⬇</div><div class="info"><div class="t">Mapa do Sistema</div><div class="s">Skill pra instalar no seu Claude Code</div></div><span class="pill blue">skill</span></div>
    <div class="item"><div class="ico">⬇</div><div class="info"><div class="t">Checklist de Deploy</div><div class="s">Skill pra instalar no seu Claude Code</div></div><span class="pill blue">skill</span></div>
    <div class="item"><div class="ico">⬇</div><div class="info"><div class="t">Auditoria de Reversibilidade</div><div class="s">Skill pra instalar no seu Claude Code</div></div><span class="pill blue">skill</span></div>

    <div class="section" style="padding-bottom:0; padding-top:10px;"><h2>Guias</h2></div>
    <div class="item"><div class="ico">📄</div><div class="info"><div class="t">Caveman Mode</div><div class="s">Guia em PDF</div></div><span class="pill gray">guia</span></div>
    <div class="item"><div class="ico">📄</div><div class="info"><div class="t">Migrar do ChatGPT pro Claude</div><div class="s">Guia em PDF</div></div><span class="pill gray">guia</span></div>
  </div>

  <div class="screen" id="screen-loja">
    <div class="topbar"><div class="brand">Loja <span>RedPro AI</span></div></div>
    <div class="label-note" style="text-align:left; padding:0 20px 14px;">Compra direto no app (Apple/Google Pay) · produtos principais continuam na Hotmart</div>
    <div class="store-grid">
      <div class="store-card">
        <div class="thumb"><img src="/app-mockup-assets/plugins.jpg" alt="100 plugins do Hermes analisados"></div>
        <div class="t">Os 100 melhores plugins do Hermes analisados</div>
        <div class="price">R$ 27</div>
        <button class="buy">Comprar</button>
      </div>
      <div class="store-card">
        <div class="thumb"><img src="/app-mockup-assets/casos.jpg" alt="50 casos de uso do Hermes"></div>
        <div class="t">50 casos de uso pra extrair o máximo do Hermes</div>
        <div class="price">R$ 37</div>
        <button class="buy">Comprar</button>
      </div>
      <div class="store-card">
        <div class="thumb"><img src="/app-mockup-assets/cerebro.jpg" alt="Segundo cérebro com o Hermes"></div>
        <div class="t">Construa seu segundo cérebro com o Hermes</div>
        <div class="price">R$ 47</div>
        <button class="buy">Comprar</button>
      </div>
    </div>
    <div class="label-note">Preços sujeitos à margem pós-taxa Apple/Google</div>
  </div>

  <div class="screen" id="screen-notif">
    <div class="topbar"><div class="brand">Notificações</div></div>
    <div class="notif">
      <div class="dot"></div>
      <div class="body"><div class="t">Aula 4 libera hoje às 20h</div><div class="s">Plugins e personalização — hoje a gente constrói um plugin ao vivo. Não perde.</div></div>
      <div class="time">agora</div>
    </div>
    <div class="notif">
      <div class="dot"></div>
      <div class="body"><div class="t">🔥 Seu streak tá em risco</div><div class="s">Faltam 3h pra você perder os 6 dias seguidos.</div></div>
      <div class="time">2h</div>
    </div>
    <div class="notif read">
      <div class="dot"></div>
      <div class="body"><div class="t">Live de hoje às 15h</div><div class="s">Captação — convide quem ainda não entrou.</div></div>
      <div class="time">1d</div>
    </div>
    <div class="notif read">
      <div class="dot"></div>
      <div class="body"><div class="t">Nova conquista: 1ª Entrega 📦</div><div class="s">Você completou sua primeira tarefa prática.</div></div>
      <div class="time">2d</div>
    </div>
  </div>

  <div class="screen" id="screen-perfil">
    <div class="topbar"><div class="brand">Perfil</div></div>
    <div class="profile-head">
      <div class="avatar"><img src="/app-mockup-assets/foto-red.png" alt="RedPro"></div>
      <div class="profile-name">RedPro</div>
      <div class="profile-tier" id="profile-tier-label">Acesso: Hermes Week · desde 21/09/2026</div>
    </div>
    <div class="item"><div class="ico">🔔</div><div class="info"><div class="t">Preferências de notificação</div><div class="s">Tudo · só aulas · só avisos críticos</div></div></div>
    <div class="item"><div class="ico">🏆</div><div class="info"><div class="t">Minhas conquistas</div><div class="s">3 de 12 desbloqueadas</div></div></div>
    <div class="item"><div class="ico">🧾</div><div class="info"><div class="t">Minhas compras</div><div class="s">Hotmart + loja do app</div></div></div>
    <div class="item" onclick="goTo('mentoria')" style="cursor:pointer;"><div class="ico">🎯</div><div class="info"><div class="t">Mentoria 1:1</div><div class="s">Acompanhamento individual com o time</div></div></div>
    <div class="item" onclick="goTo('onboard')" style="cursor:pointer;"><div class="ico">↩</div><div class="info"><div class="t">Sair</div></div></div>
  </div>

  <div class="screen" id="screen-mentoria">
    <div class="topbar">
      <button class="back" onclick="goTo('perfil')">← Voltar</button>
      <div class="brand">Mentoria <span>1:1</span></div>
      <div style="width:40px;"></div>
    </div>
    <div class="mentoria-hero">
      <h3>Acompanhamento individual com o time RedPro</h3>
      <p>Pra quem já passou pela Hermes Week ou pela Formação Arquiteto de Agentes e quer alguém olhando o seu caso específico — não é mais um curso, é acompanhamento.</p>
    </div>
    <div class="mentoria-list">
      <div class="row"><span class="ck">✓</span><span>Encontros individuais com o time</span></div>
      <div class="row"><span class="ck">✓</span><span>Olhar direcionado pra sua operação, não conteúdo genérico</span></div>
      <div class="row"><span class="ck">✓</span><span>Vagas limitadas</span></div>
    </div>
    <div class="mentoria-cta">
      <button class="btn-secondary">Falar com a equipe</button>
    </div>
    <div class="label-note">Vagas e condições sob consulta — sem oferta aberta neste momento</div>
  </div>

  <div class="tabbar" id="tabbar">
    <button class="tab active" data-tab="home" onclick="goTo('home')"><span class="icon">🏠</span>Início</button>
    <button class="tab" data-tab="trilha" onclick="goTo('trilha')"><span class="icon">📚</span>Trilha</button>
    <button class="tab" data-tab="gratis" onclick="goTo('gratis')"><span class="icon">🎁</span>Grátis</button>
    <button class="tab" data-tab="loja" onclick="goTo('loja')"><span class="icon">🛍️</span>Loja</button>
    <button class="tab" data-tab="notif" onclick="goTo('notif')"><span class="icon">🔔</span>Avisos</button>
    <button class="tab" data-tab="perfil" onclick="goTo('perfil')"><span class="icon">👤</span>Perfil</button>
  </div>
</div>

<script>
let tier = 'week';

function goTo(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  document.getElementById('tabbar').style.display = (name === 'onboard') ? 'none' : 'flex';
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
}

function toggleTier() {
  tier = (tier === 'week') ? 'formacao' : 'week';
  render();
}

function render() {
  const isFormacao = tier === 'formacao';
  document.getElementById('tier-label').textContent = isFormacao ? 'FORMAÇÃO ARQUITETO DE AGENTES' : 'ACESSO: HERMES WEEK';
  document.getElementById('profile-tier-label').textContent = isFormacao
    ? 'Formação Arquiteto de Agentes · desde 27/09/2026'
    : 'Acesso: Hermes Week · desde 21/09/2026';

  document.getElementById('upsell-home').style.display = isFormacao ? 'none' : 'block';
  document.getElementById('home-locked-item').style.display = isFormacao ? 'none' : 'flex';

  const pill = document.getElementById('formacao-pill');
  pill.textContent = isFormacao ? 'liberado' : 'bloqueado';
  pill.classList.toggle('gray', !isFormacao);

  document.querySelectorAll('.formacao-item').forEach(el => {
    el.classList.toggle('locked', !isFormacao);
    el.querySelector('.lock').style.display = isFormacao ? 'none' : 'block';
    el.querySelector('.check') && (el.querySelector('.check').style.display = isFormacao ? 'block' : 'none');
  });
}

render();
</script>

</body>
</html>`;

export async function GET() {
  return new Response(HTML, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

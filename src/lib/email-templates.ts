export function emailNewsletter() {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Bem-vindo à Newsletter REDSHIFT.</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:'DM Sans',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

      <!-- HEADER -->
      <tr><td style="background:#111113;border:1px solid #1f1f23;border-bottom:none;border-radius:16px 16px 0 0;padding:28px 36px;">
        <span style="font-family:Arial,sans-serif;font-weight:900;font-size:20px;color:#fff;letter-spacing:-0.02em;">
          <span style="color:#f97316;">Red</span>Pro AI Academy
        </span>
      </td></tr>

      <!-- BODY -->
      <tr><td style="background:#09090b;border:1px solid #1f1f23;border-top:none;border-bottom:none;padding:40px 36px;">
        <p style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#f97316;margin:0 0 18px;">Newsletter · REDSHIFT</p>
        <h1 style="font-family:Arial,sans-serif;font-weight:900;font-size:28px;line-height:1.1;letter-spacing:-0.02em;color:#fff;margin:0 0 24px;">Você acabou de entrar<br/>numa frequência diferente.</h1>
        <p style="font-size:15px;line-height:1.75;color:#a1a1aa;font-weight:300;margin:0 0 16px;">Toda semana você vai receber conteúdo sobre IA que foi escrito por um humano — que usa IA para construir coisas reais, não para parecer inteligente.</p>
        <p style="font-size:15px;line-height:1.75;color:#a1a1aa;font-weight:300;margin:0 0 16px;">Sem hype. Sem tutorial de ChatGPT. Sem <em>"10 prompts que vão mudar sua vida"</em>.</p>
        <p style="font-size:15px;line-height:1.75;color:#a1a1aa;font-weight:300;margin:0 0 32px;">Só o que está funcionando agora, no mundo real, em negócios reais.</p>
        <p style="font-size:15px;line-height:1.75;color:#a1a1aa;font-weight:300;margin:0 0 8px;">Até a próxima edição.</p>

        <!-- SIGNATURE -->
        <table cellpadding="0" cellspacing="0" style="margin-top:32px;border-top:1px solid #1f1f23;padding-top:24px;width:100%;">
          <tr><td>
            <p style="font-size:14px;color:#71717a;margin:0 0 6px;font-weight:300;">Com atenção,</p>
            <p style="font-family:Arial,sans-serif;font-weight:900;font-size:22px;color:#fff;margin:0;letter-spacing:-0.02em;">— <span style="color:#f97316;">Red</span></p>
          </td></tr>
        </table>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="background:#0a0a0c;border:1px solid #1f1f23;border-top:none;border-radius:0 0 16px 16px;padding:20px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td><p style="font-family:'Courier New',monospace;font-size:11px;color:#3f3f46;margin:0;">© 2026 RedPro AI Academy</p></td>
            <td align="right"><a href="https://www.redpro.com.br/newsletter" style="font-family:'Courier New',monospace;font-size:11px;color:#52525b;text-decoration:none;">Cancelar inscrição</a></td>
          </tr>
        </table>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export function emailContato(name: string) {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Mensagem recebida.</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:'DM Sans',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

      <tr><td style="background:#111113;border:1px solid #1f1f23;border-bottom:none;border-radius:16px 16px 0 0;padding:28px 36px;">
        <span style="font-family:Arial,sans-serif;font-weight:900;font-size:20px;color:#fff;letter-spacing:-0.02em;">
          <span style="color:#f97316;">Red</span>Pro AI Academy
        </span>
      </td></tr>

      <tr><td style="background:#09090b;border:1px solid #1f1f23;border-top:none;border-bottom:none;padding:40px 36px;">
        <p style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#f97316;margin:0 0 18px;">Contato · RedPro</p>
        <h1 style="font-family:Arial,sans-serif;font-weight:900;font-size:28px;line-height:1.1;letter-spacing:-0.02em;color:#fff;margin:0 0 24px;">Sua mensagem chegou${name ? `, ${name.split(' ')[0]}` : ''}.</h1>
        <p style="font-size:15px;line-height:1.75;color:#a1a1aa;font-weight:300;margin:0 0 24px;">Recebi sua mensagem e vou responder em até <strong style="color:#fafafa;font-weight:500;">24 horas</strong>.</p>

        <!-- HIGHLIGHT BOX -->
        <table cellpadding="0" cellspacing="0" style="background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.18);border-radius:10px;padding:16px 20px;width:100%;margin-bottom:32px;">
          <tr><td>
            <p style="font-size:14px;line-height:1.7;color:#a1a1aa;margin:0;">Se for urgente, me chama direto no WhatsApp:<br/>
            <a href="https://wa.me/5561992978796" style="color:#f97316;text-decoration:none;font-weight:500;">+55 61 99297-8796</a></p>
          </td></tr>
        </table>

        <table cellpadding="0" cellspacing="0" style="margin-top:32px;border-top:1px solid #1f1f23;padding-top:24px;width:100%;">
          <tr><td>
            <p style="font-size:14px;color:#71717a;margin:0 0 6px;font-weight:300;">Com atenção,</p>
            <p style="font-family:Arial,sans-serif;font-weight:900;font-size:22px;color:#fff;margin:0;letter-spacing:-0.02em;">— <span style="color:#f97316;">Red</span></p>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="background:#0a0a0c;border:1px solid #1f1f23;border-top:none;border-radius:0 0 16px 16px;padding:20px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td><p style="font-family:'Courier New',monospace;font-size:11px;color:#3f3f46;margin:0;">© 2026 RedPro AI Academy</p></td>
            <td align="right"><a href="https://www.redpro.com.br" style="font-family:'Courier New',monospace;font-size:11px;color:#52525b;text-decoration:none;">redpro.com.br</a></td>
          </tr>
        </table>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export function emailMentoria(name: string) {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Aplicação recebida — próximos passos.</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:'DM Sans',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

      <tr><td style="background:#111113;border:1px solid #1f1f23;border-bottom:none;border-radius:16px 16px 0 0;padding:28px 36px;">
        <span style="font-family:Arial,sans-serif;font-weight:900;font-size:20px;color:#fff;letter-spacing:-0.02em;">
          <span style="color:#f97316;">Red</span>Pro AI Academy
        </span>
      </td></tr>

      <tr><td style="background:#09090b;border:1px solid #1f1f23;border-top:none;border-bottom:none;padding:40px 36px;">
        <p style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#f97316;margin:0 0 18px;">Mentoria · RedPro</p>
        <h1 style="font-family:Arial,sans-serif;font-weight:900;font-size:28px;line-height:1.1;letter-spacing:-0.02em;color:#fff;margin:0 0 24px;">Aplicação recebida${name ? `, ${name.split(' ')[0]}` : ''}.</h1>
        <p style="font-size:15px;line-height:1.75;color:#a1a1aa;font-weight:300;margin:0 0 24px;">Analiso cada perfil manualmente antes de agendar uma conversa. Se houver fit, você recebe meu contato em até <strong style="color:#fafafa;font-weight:500;">24 horas</strong> com os próximos passos.</p>

        <table cellpadding="0" cellspacing="0" style="background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.18);border-radius:10px;padding:16px 20px;width:100%;margin-bottom:32px;">
          <tr><td>
            <p style="font-size:14px;line-height:1.7;color:#a1a1aa;margin:0;">Sem retorno nesse prazo? Me chama no WhatsApp:<br/>
            <a href="https://wa.me/5561992978796" style="color:#f97316;text-decoration:none;font-weight:500;">+55 61 99297-8796</a></p>
          </td></tr>
        </table>

        <table cellpadding="0" cellspacing="0" style="margin-top:32px;border-top:1px solid #1f1f23;padding-top:24px;width:100%;">
          <tr><td>
            <p style="font-size:14px;color:#71717a;margin:0 0 6px;font-weight:300;">Com atenção,</p>
            <p style="font-family:Arial,sans-serif;font-weight:900;font-size:22px;color:#fff;margin:0;letter-spacing:-0.02em;">— <span style="color:#f97316;">Red</span></p>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="background:#0a0a0c;border:1px solid #1f1f23;border-top:none;border-radius:0 0 16px 16px;padding:20px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td><p style="font-family:'Courier New',monospace;font-size:11px;color:#3f3f46;margin:0;">© 2026 RedPro AI Academy</p></td>
            <td align="right"><a href="https://www.redpro.com.br/mentoria" style="font-family:'Courier New',monospace;font-size:11px;color:#52525b;text-decoration:none;">redpro.com.br/mentoria</a></td>
          </tr>
        </table>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export function emailSharkListaEspera(nome: string) {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Você está na lista — Formação S.H.A.R.K.</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:'DM Sans',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

      <!-- HEADER -->
      <tr><td style="background:#111113;border:1px solid #1f1f23;border-bottom:none;border-radius:16px 16px 0 0;padding:28px 36px;">
        <span style="font-family:Arial,sans-serif;font-weight:900;font-size:20px;color:#fff;letter-spacing:-0.02em;">
          <span style="color:#f97316;">Red</span>Pro AI Academy
        </span>
      </td></tr>

      <!-- BODY -->
      <tr><td style="background:#09090b;border:1px solid #1f1f23;border-top:none;border-bottom:none;padding:40px 36px;">
        <p style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#f97316;margin:0 0 18px;">Formação S.H.A.R.K. · Lista de Espera</p>
        <h1 style="font-family:Arial,sans-serif;font-weight:900;font-size:28px;line-height:1.1;letter-spacing:-0.02em;color:#fff;margin:0 0 24px;">Você está na lista.</h1>
        <p style="font-size:15px;line-height:1.75;color:#a1a1aa;font-weight:300;margin:0 0 16px;">Oi ${nome}, obrigado por entrar na lista de espera da Formação S.H.A.R.K.</p>
        <p style="font-size:15px;line-height:1.75;color:#a1a1aa;font-weight:300;margin:0 0 16px;">O carrinho abre em <strong style="color:#fafafa;font-weight:500;">23 de julho</strong>. Você vai ser avisado em primeira mão com condição especial para quem estava esperando.</p>
        <p style="font-size:15px;line-height:1.75;color:#a1a1aa;font-weight:300;margin:0 0 32px;">Enquanto isso, acompanhe o <strong style="color:#fafafa;font-weight:500;">@redpro.ia</strong> no Instagram para não perder nenhuma atualização.</p>

        <!-- CTA -->
        <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
          <tr><td style="background:#f97316;border-radius:8px;">
            <a href="https://instagram.com/redpro.ia" style="display:inline-block;padding:14px 28px;font-family:Arial,sans-serif;font-weight:700;font-size:14px;color:#fff;text-decoration:none;letter-spacing:0.01em;">Seguir @redpro.ia</a>
          </td></tr>
        </table>

        <!-- SIGNATURE -->
        <table cellpadding="0" cellspacing="0" style="margin-top:32px;border-top:1px solid #1f1f23;padding-top:24px;width:100%;">
          <tr><td>
            <p style="font-size:14px;color:#71717a;margin:0 0 6px;font-weight:300;">Com atenção,</p>
            <p style="font-family:Arial,sans-serif;font-weight:900;font-size:22px;color:#fff;margin:0;letter-spacing:-0.02em;">— <span style="color:#f97316;">Red</span></p>
            <p style="font-size:13px;color:#52525b;margin:6px 0 0;font-weight:300;">RedPro AI Academy</p>
          </td></tr>
        </table>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="background:#0a0a0c;border:1px solid #1f1f23;border-top:none;border-radius:0 0 16px 16px;padding:20px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td><p style="font-family:'Courier New',monospace;font-size:11px;color:#3f3f46;margin:0;">© 2026 RedPro AI Academy</p></td>
            <td align="right"><a href="https://www.redpro.com.br" style="font-family:'Courier New',monospace;font-size:11px;color:#52525b;text-decoration:none;">redpro.com.br</a></td>
          </tr>
        </table>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export function emailInCompany(name: string, company: string) {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Solicitação In Company recebida.</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:'DM Sans',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

      <tr><td style="background:#111113;border:1px solid #1f1f23;border-bottom:none;border-radius:16px 16px 0 0;padding:28px 36px;">
        <span style="font-family:Arial,sans-serif;font-weight:900;font-size:20px;color:#fff;letter-spacing:-0.02em;">
          <span style="color:#f97316;">Red</span>Pro AI Academy
        </span>
      </td></tr>

      <tr><td style="background:#09090b;border:1px solid #1f1f23;border-top:none;border-bottom:none;padding:40px 36px;">
        <p style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#f97316;margin:0 0 18px;">In Company · RedPro</p>
        <h1 style="font-family:Arial,sans-serif;font-weight:900;font-size:28px;line-height:1.1;letter-spacing:-0.02em;color:#fff;margin:0 0 24px;">Solicitação recebida.</h1>
        <p style="font-size:15px;line-height:1.75;color:#a1a1aa;font-weight:300;margin:0 0 16px;">Recebi a solicitação da <strong style="color:#fafafa;font-weight:500;">${company}</strong>.</p>
        <p style="font-size:15px;line-height:1.75;color:#a1a1aa;font-weight:300;margin:0 0 24px;">Nossa equipe vai analisar o contexto e preparar uma proposta personalizada. Você tem retorno em até <strong style="color:#fafafa;font-weight:500;">48 horas</strong> no email que informou.</p>

        <table cellpadding="0" cellspacing="0" style="background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.18);border-radius:10px;padding:16px 20px;width:100%;margin-bottom:32px;">
          <tr><td>
            <p style="font-size:14px;line-height:1.7;color:#a1a1aa;margin:0;">Qualquer dúvida antes disso:<br/>
            <a href="mailto:solutions@redpro.com.br" style="color:#f97316;text-decoration:none;font-weight:500;">solutions@redpro.com.br</a></p>
          </td></tr>
        </table>

        <table cellpadding="0" cellspacing="0" style="margin-top:32px;border-top:1px solid #1f1f23;padding-top:24px;width:100%;">
          <tr><td>
            <p style="font-size:14px;color:#71717a;margin:0 0 6px;font-weight:300;">Com atenção,</p>
            <p style="font-family:Arial,sans-serif;font-weight:900;font-size:22px;color:#fff;margin:0;letter-spacing:-0.02em;">— Equipe <span style="color:#f97316;">RedPro</span></p>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="background:#0a0a0c;border:1px solid #1f1f23;border-top:none;border-radius:0 0 16px 16px;padding:20px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td><p style="font-family:'Courier New',monospace;font-size:11px;color:#3f3f46;margin:0;">© 2026 RedPro AI Academy</p></td>
            <td align="right"><a href="https://www.redpro.com.br/in-company" style="font-family:'Courier New',monospace;font-size:11px;color:#52525b;text-decoration:none;">redpro.com.br/in-company</a></td>
          </tr>
        </table>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

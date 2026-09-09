// Notificação interna do site: vai para o Telegram do Red, não por e-mail.
//
// Por quê: em 09/09/2026 os avisos internos foram testados um a um com envio real e
// nenhum endereço @redpro.com.br recebe. `suporte@` e `red@` deram hard bounce e
// `contato@` já estava na lista de supressão do Resend por bounces anteriores. O MX
// aponta certo para a Hostinger, então o problema é caixa, não DNS. Enquanto isso,
// todo formulário do site notificava para o vazio.
//
// O e-mail que vai para o LEAD continua saindo pelo Resend normalmente. O que mudou
// foi só o aviso que chega no Red.

type Campos = Record<string, string | number | null | undefined>;

export async function avisarRed(
  titulo: string,
  campos: Campos,
  rodape?: string
): Promise<{ ok: boolean; motivo?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return { ok: false, motivo: "sem credencial do Telegram" };

  const linhas = Object.entries(campos)
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(([k, v]) => `${k}: ${v}`);

  const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const texto = [titulo, "", ...linhas, rodape ? `\n${rodape}` : "", `\n${agora}`]
    .filter(Boolean)
    .join("\n");

  try {
    // sem parse_mode: nome e e-mail de lead vêm com _ * ` e quebrariam o Markdown
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text: texto }),
    });
    if (!r.ok) return { ok: false, motivo: `telegram ${r.status}` };
    return { ok: true };
  } catch {
    return { ok: false, motivo: "falha de rede" };
  }
}

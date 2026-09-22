import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/soul/gerar
 *
 * Gerador de SOUL on-demand — produto bump 2 (ID 8551609, "50 casos de uso do Hermes").
 *
 * FLUXO:
 *   1. Recebe { email, nome, contexto } do cliente
 *   2. Gate: verifica compra aprovada do produto 8551609 no Supabase
 *   3. Chama Claude claude-opus-4-5 com o prompt de geração de SOUL
 *   4. Retorna o SOUL em texto puro para o cliente renderizar
 *
 * CUSTO: ~R$0,23/geração com claude-opus-4-5 (~3k tokens entrada + ~800 saída)
 *
 * FALHA:
 *   - Supabase offline → nega acesso (fail-safe)
 *   - Anthropic offline → 503 com mensagem ao usuário
 *   - E-mail sem compra → 403
 *   - Rate limit: 1 geração por e-mail a cada 5 minutos (em memória, suficiente por ora)
 *
 * ENV necessárias (todas já existem na Vercel):
 *   SUPABASE_SERVICE_KEY
 *   ANTHROPIC_API_KEY  ← nova, adicionar na Vercel
 */

export const dynamic = "force-dynamic";

// Limite de tamanho da requisição para evitar prompt injection via contexto gigante
const MAX_CONTEXTO = 2000;

const SUPABASE_URL = "https://supabase.redpro.com.br";
const PRODUTO_50_CASOS = "8551609";

// Rate limit em memória: e-mail → timestamp da última geração
const ultimaGeracao = new Map<string, number>();
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutos

// ─────────────────────────────────────────────────────────────────────────────
// Gate de acesso
// ─────────────────────────────────────────────────────────────────────────────
async function temAcesso(email: string): Promise<boolean> {
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!key) return false;
  try {
    const url =
      `${SUPABASE_URL}/rest/v1/hotmart_compras` +
      `?email=eq.${encodeURIComponent(email)}` +
      `&produto_id=eq.${encodeURIComponent(PRODUTO_50_CASOS)}` +
      `&evento=eq.PURCHASE_APPROVED` +
      `&select=id&limit=1`;
    const res = await fetch(url, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const rows = (await res.json()) as unknown[];
    return rows.length > 0;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Prompt de geração do SOUL
// ─────────────────────────────────────────────────────────────────────────────
function buildPrompt(nome: string, contexto: string): string {
  return `Você é um especialista em sistemas agênticos com IA, especificamente no ecossistema Hermes (um agente pessoal de automações). Sua tarefa é gerar um SOUL personalizado para o usuário.

O SOUL é um bloco de configuração em texto que define a identidade, o tom, o foco e as instruções de comportamento de um agente de IA. Ele vai dentro do sistema do Hermes e molda como o agente se comporta, prioriza tarefas e se comunica.

Dados do usuário:
- Nome: ${nome}
- Contexto/objetivo (o que o usuário descreveu de si mesmo): ${contexto}

Gere um SOUL completo para este usuário. O SOUL deve:

1. Ter um NOME de agente (pode ser algo como "Copiloto do [Área de atuação]" ou um nome criativo)
2. Ter uma IDENTIDADE clara — quem é esse agente, o que ele representa
3. Ter um TOM de comunicação definido — como o agente fala com o usuário
4. Ter FOCO PRINCIPAL — qual o principal trabalho do agente com este usuário
5. Ter 3 a 5 PRINCÍPIOS de operação (como o agente toma decisões, o que ele prioriza)
6. Ter uma seção de COMPORTAMENTO EM FALHAS — o que o agente faz quando algo dá errado
7. Ter um BLOCO DE SKILLS PRIORITÁRIAS sugeridas (lista de 3-5 nomes de skills Hermes que fazem sentido para o contexto do usuário)

Formato de saída:
- Texto estruturado com títulos em CAPS LOCK seguidos de dois pontos
- Tom direto, sem floreios
- Em português brasileiro, linguagem moderna (como o próprio Hermes fala)
- Total de 400 a 600 palavras
- NÃO use markdown (sem #, **, _, etc) — apenas texto puro com quebras de linha

Comece com: "SOUL — [Nome do Agente]" na primeira linha.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Chamada à API da Anthropic (fetch nativo — sem SDK)
// ─────────────────────────────────────────────────────────────────────────────
async function gerarSoul(nome: string, contexto: string): Promise<{ ok: true; soul: string } | { ok: false; erro: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { ok: false, erro: "ANTHROPIC_API_KEY não configurada" };

  const prompt = buildPrompt(nome, contexto);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!res.ok) {
      const erroTexto = await res.text();
      console.error("[soul/gerar] Anthropic erro:", res.status, erroTexto);
      return { ok: false, erro: `Anthropic ${res.status}` };
    }

    const data = await res.json() as {
      content: Array<{ type: string; text: string }>;
    };

    const texto = data.content?.find((b) => b.type === "text")?.text ?? "";
    if (!texto) return { ok: false, erro: "resposta vazia da IA" };

    return { ok: true, soul: texto };
  } catch (e) {
    console.error("[soul/gerar] exception:", e);
    return { ok: false, erro: String(e) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler principal
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let email: string, nome: string, contexto: string;

  try {
    const body = await req.json();
    email = String(body.email ?? "").trim().toLowerCase();
    nome = String(body.nome ?? "").trim().slice(0, 100);
    contexto = String(body.contexto ?? "").trim().slice(0, MAX_CONTEXTO);
  } catch {
    return NextResponse.json({ erro: "json inválido" }, { status: 400 });
  }

  if (!email || !/.+@.+\..+/.test(email)) {
    return NextResponse.json({ erro: "e-mail inválido" }, { status: 400 });
  }
  if (!nome) {
    return NextResponse.json({ erro: "nome é obrigatório" }, { status: 400 });
  }
  if (!contexto || contexto.length < 20) {
    return NextResponse.json({ erro: "descreva um pouco mais o seu contexto (mínimo 20 caracteres)" }, { status: 400 });
  }

  // Rate limit
  const agora = Date.now();
  const ultima = ultimaGeracao.get(email);
  if (ultima && agora - ultima < COOLDOWN_MS) {
    const restante = Math.ceil((COOLDOWN_MS - (agora - ultima)) / 1000);
    return NextResponse.json(
      { erro: `Aguarda ${restante}s antes de gerar novamente.` },
      { status: 429 }
    );
  }

  // Gate de acesso
  const acesso = await temAcesso(email);
  if (!acesso) {
    return NextResponse.json(
      { erro: "acesso não encontrado — confirma que você usou o e-mail da compra do produto '50 casos de uso do Hermes'." },
      { status: 403 }
    );
  }

  // Marca o timestamp antes de chamar a IA (protege contra double-submit)
  ultimaGeracao.set(email, agora);

  const resultado = await gerarSoul(nome, contexto);

  if (!resultado.ok) {
    // Libera o cooldown se a IA falhou (não deve punir o usuário por erro de infra)
    ultimaGeracao.delete(email);
    console.error("[soul/gerar] falha na geração:", resultado.erro);
    return NextResponse.json(
      { erro: "Eita, a IA não respondeu agora. Tenta de novo em instantes." },
      { status: 503 }
    );
  }

  return NextResponse.json({ soul: resultado.soul });
}

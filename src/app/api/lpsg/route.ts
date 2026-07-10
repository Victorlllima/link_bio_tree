import { NextResponse } from "next/server";

const SUPABASE_URL = "https://supabase.redpro.com.br";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const LPSG_PASSWORD = process.env.LPSG_PASSWORD || "lpsg2026";

const headers = {
  "Content-Type": "application/json",
  apikey: SUPABASE_SERVICE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
};

function authed(req: Request): boolean {
  const cookie = req.headers.get("cookie") || "";
  return cookie.includes(`lpsg_auth=${LPSG_PASSWORD}`);
}

// GET → estado atual de todas as tarefas (responsavel + done por task_id)
export async function GET(req: Request) {
  if (!authed(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/lpsg_checklist?select=task_id,responsavel,done`,
      { headers, cache: "no-store" }
    );
    if (!res.ok) {
      const err = await res.text();
      console.error("[LPSG] Erro ao ler estado:", err);
      return NextResponse.json({ items: [] }, { status: 200 });
    }
    const items = await res.json();
    return NextResponse.json({ items }, { status: 200 });
  } catch (err) {
    console.error("[LPSG] Erro interno GET:", err);
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}

// POST → upsert do estado de uma tarefa. Body: { task_id, responsavel?, done? }
export async function POST(req: Request) {
  if (!authed(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { task_id } = body;
    if (!task_id) {
      return NextResponse.json({ success: false, error: "task_id ausente" }, { status: 400 });
    }

    const patch: Record<string, unknown> = { task_id };
    if ("responsavel" in body) patch.responsavel = body.responsavel;
    if ("done" in body) patch.done = body.done;
    patch.updated_at = new Date().toISOString();

    // upsert via Prefer: resolution=merge-duplicates (task_id é unique)
    const res = await fetch(`${SUPABASE_URL}/rest/v1/lpsg_checklist`, {
      method: "POST",
      headers: {
        ...headers,
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(patch),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[LPSG] Erro ao salvar:", err);
      return NextResponse.json({ success: false }, { status: 500 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[LPSG] Erro interno POST:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

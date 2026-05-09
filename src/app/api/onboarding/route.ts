import { NextResponse } from "next/server";

const SUPABASE_URL = "https://supabase.redpro.com.br";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const res = await fetch(`${SUPABASE_URL}/rest/v1/academy_matriculas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        email: data.email,
        whatsapp: data.whatsapp,
        instagram: data.instagram,
        segmento: data.segmento,
        produto_servico: data.produto_servico,
        faturamento: data.faturamento,
        tempo_mercado: data.tempo_mercado,
        maior_obstaculo: data.maior_obstaculo,
        ja_tentou_ia: data.ja_tentou_ia,
        objetivo: data.objetivo,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[ACADEMY] Erro ao salvar matrícula:", err);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    console.log("[ACADEMY] Matrícula salva:", data.email);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[ACADEMY] Erro interno:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

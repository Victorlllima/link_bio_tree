import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("[ACADEMY] Nova matrícula:", {
      email: data.email,
      instagram: data.instagram,
      segmento: data.segmento,
      ts: new Date().toISOString(),
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

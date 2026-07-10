import { NextResponse } from "next/server";

const LPSG_PASSWORD = process.env.LPSG_PASSWORD || "lpsg2026";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (password !== LPSG_PASSWORD) {
      return NextResponse.json({ success: false }, { status: 401 });
    }
    const res = NextResponse.json({ success: true }, { status: 200 });
    // cookie de sessão — 30 dias, httpOnly não (precisa ser lido pelo fetch client-side via cookie header do próprio browser)
    res.cookies.set("lpsg_auth", LPSG_PASSWORD, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
    return res;
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

import { readFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { COOKIE, cookieValido } from "@/lib/configurar-vps/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Prints do guia (só a versão borrada de guia-prints/): ficam em privado/ e só saem com o cookie da senha.
export async function GET(_req: Request, { params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const jar = await cookies();
  if (!cookieValido(jar.get(COOKIE)?.value)) return new Response("Não autorizado", { status: 401 });
  if (!/^\d{2}[a-z]?$/.test(n)) return new Response("Não encontrado", { status: 404 });
  try {
    const arq = await readFile(path.join(process.cwd(), "privado", "guia-da-imersao", "prints", `${n}.webp`));
    return new Response(new Uint8Array(arq), {
      headers: { "Content-Type": "image/webp", "Cache-Control": "private, max-age=3600", "X-Robots-Tag": "noindex, nofollow" },
    });
  } catch {
    return new Response("Não encontrado", { status: 404 });
  }
}

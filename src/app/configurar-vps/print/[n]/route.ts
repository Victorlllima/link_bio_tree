import { readFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { COOKIE, cookieValido } from "@/lib/configurar-vps/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Prints do manual: ficam em privado/ (fora do public) e só saem com o cookie da senha.
export async function GET(_req: Request, { params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const jar = await cookies();
  if (!cookieValido(jar.get(COOKIE)?.value)) return new Response("Não autorizado", { status: 401 });
  if (!/^\d{2}$/.test(n)) return new Response("Não encontrado", { status: 404 });

  try {
    const arq = await readFile(path.join(process.cwd(), "privado", "configurar-vps", "prints", `${n}.webp`));
    return new Response(new Uint8Array(arq), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "private, max-age=3600",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch {
    return new Response("Não encontrado", { status: 404 });
  }
}

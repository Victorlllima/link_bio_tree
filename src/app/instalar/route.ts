import { NextRequest, NextResponse } from "next/server";
import { abrirArquivoInstalador, CABECALHOS_INSTALADOR, chaveValida, MARCADOR_CHAVE } from "@/lib/instalador";

/* /instalar?k=CHAVE · configurar-vps.sh da Imersão com a chave embutida (o script usa a mesma chave
   para baixar o pacote em /instalar/arquivo/<nome>). Sem chave ou chave errada: 404. */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const k = req.nextUrl.searchParams.get("k");
    if (!chaveValida(k)) return new NextResponse("Not found\n", { status: 404, headers: CABECALHOS_INSTALADOR });
    try {
        const script = (await abrirArquivoInstalador("configurar-vps.sh")).toString("utf8").replaceAll(MARCADOR_CHAVE, k!);
        return new NextResponse(script, {
            headers: { ...CABECALHOS_INSTALADOR, "Content-Type": "text/x-shellscript; charset=utf-8" },
        });
    } catch (e) {
        console.error("[instalar] falha ao abrir o configurar-vps.sh", e);
        return new NextResponse("Erro no servidor. Tente de novo em alguns minutos.\n", { status: 500, headers: CABECALHOS_INSTALADOR });
    }
}

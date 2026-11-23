import { NextRequest, NextResponse } from "next/server";
import { abrirArquivoInstalador, CABECALHOS_INSTALADOR, chaveValida, ehArquivoInstalador } from "@/lib/instalador";

/* /instalar/arquivo/<nome>?k=CHAVE · arquivos do instalador (o pacote dos 3 agentes).
   O configurar-vps.sh confere o SHA256 depois de baixar. Nome fora da lista, sem chave ou chave errada: 404. */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: Promise<{ nome: string }> }) {
    const { nome } = await ctx.params;
    const k = req.nextUrl.searchParams.get("k");
    if (!chaveValida(k) || !ehArquivoInstalador(nome)) {
        return new NextResponse("Not found\n", { status: 404, headers: CABECALHOS_INSTALADOR });
    }
    try {
        const dados = await abrirArquivoInstalador(nome);
        return new NextResponse(new Uint8Array(dados), {
            headers: {
                ...CABECALHOS_INSTALADOR,
                "Content-Type": "application/octet-stream",
                "Content-Disposition": `attachment; filename="${nome}"`,
            },
        });
    } catch (e) {
        console.error(`[instalar] falha ao abrir ${nome}`, e);
        return new NextResponse("Erro no servidor. Tente de novo em alguns minutos.\n", { status: 500, headers: CABECALHOS_INSTALADOR });
    }
}

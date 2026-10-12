import { lerCicloAtual } from "@/lib/ciclo-atual";
import MatriculaClient from "./matricula-client";

/* Ficha de matrícula da Hermes Week. O formulário é um componente de cliente (matricula-client.tsx); esta
   página existe só para ler o link do grupo do ciclo vigente no Supabase (`ciclo_atual`), do mesmo jeito que a
   página de obrigado. 60 s de cache: a virada de segunda 20h aparece aqui em até 1 minuto, sem deploy. */
export default async function HermesWeekMatriculaPage() {
    const { linkGrupo } = await lerCicloAtual({ revalidar: 60 });
    return <MatriculaClient grupoUrl={linkGrupo} />;
}

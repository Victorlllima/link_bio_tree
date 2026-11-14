import type { Metadata } from "next";

/* /imersao/manual  ·  Manual da VPS (QG 2.6, 12/11). Esqueleto da IRIS.
   Texto dos passos e roteiro dos vídeos: LYRA. Instalador e suporte por IA: ION. Prints e vídeo: pendentes.
   Nada aqui vai ao aluno sem o ok do Red. Modelado (não copiado) do manual da Funnel Labs. */

export const metadata: Metadata = {
  title: "Manual da VPS | Imersão Arquiteto de Agentes",
  robots: { index: false, follow: false },
};

type Passo = { n: number; titulo: string; texto: string };

// Placeholders: LYRA substitui título e texto; cada passo ganha um print numerado em /public/imersao/manual/passo-N.webp
const PASSOS: Passo[] = [
  { n: 1, titulo: "Comprar a VPS na Hostinger", texto: "A definir pela LYRA (cupom REDPRO, plano, sistema Ubuntu 24.04)." },
  { n: 2, titulo: "Entrar na VPS", texto: "A definir pela LYRA." },
  { n: 3, titulo: "Colar a linha de instalação", texto: "A definir pela LYRA e pela ION (instalar.redpro.com.br)." },
  { n: 4, titulo: "Conectar o cérebro do agente", texto: "A definir pela LYRA." },
  { n: 5, titulo: "Conferir que o agente respondeu", texto: "A definir pela LYRA." },
];

const PROBLEMAS: { p: string; r: string }[] = [
  { p: "A definir (lista da LYRA e da AMANDA)", r: "A definir." },
];

const VIDEO_ID = process.env.IMERSAO_MANUAL_VIDEO_ID ?? ""; // YouTube não listado; vazio = bloco some
const SUPORTE_URL = process.env.IMERSAO_MANUAL_SUPORTE_URL ?? ""; // endpoint do suporte por IA (ION); vazio = botão some

export default function ManualVps() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px", fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
      <h1>Manual da VPS</h1>
      <p>Passo a passo para comprar a sua VPS e instalar o seu agente. Siga na ordem.</p>

      {VIDEO_ID && (
        <div style={{ position: "relative", paddingTop: "56.25%", margin: "24px 0" }}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`}
            title="Passo a passo completo"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      )}

      <ol style={{ paddingLeft: 0, listStyle: "none" }}>
        {PASSOS.map((p) => (
          <li key={p.n} id={`passo-${p.n}`} style={{ margin: "28px 0" }}>
            <h2>
              {p.n}. {p.titulo}
            </h2>
            <p>{p.texto}</p>
            {/* print numerado: <img src={`/imersao/manual/passo-${p.n}.webp`} alt="..." width={720} height={405} loading="lazy" /> */}
          </li>
        ))}
      </ol>

      <h2>Problemas comuns</h2>
      {PROBLEMAS.map((x) => (
        <details key={x.p} style={{ margin: "8px 0" }}>
          <summary>{x.p}</summary>
          <p>{x.r}</p>
        </details>
      ))}

      {SUPORTE_URL && (
        <p>
          <a href={SUPORTE_URL}>Travou? Fale com o suporte</a>
        </p>
      )}
    </main>
  );
}

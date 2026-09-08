import type { Metadata } from "next";

// Página de onboarding pós-compra: não deve ser indexada nem aparecer em busca.
export const metadata: Metadata = {
  title: "Ficha de matrícula — Hermes Week",
  robots: { index: false, follow: false },
  description: "Me conta em que pé você está pra eu ajustar as aulas da Hermes Week.",
};

export default function MatriculaLayout({ children }: { children: React.ReactNode }) {
  return children;
}

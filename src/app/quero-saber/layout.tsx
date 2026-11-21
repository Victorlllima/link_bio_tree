import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quero saber | RedPro AI Academy",
  description: "Deixe seu nome e eu te aviso primeiro.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./loja.css";

/* /demo/loja · RedPro Commerce, loja de DEMONSTRAÇÃO da noite 1 (Rigel/Red, 25/11/2026).
   noindex, fora de menu e sitemap. HTML simples, funciona sem JavaScript. */

const sans = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--rc-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--rc-mono" });

export const metadata: Metadata = {
  title: "RedPro Commerce | Loja de demonstração",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function LojaLayout({ children }: { children: React.ReactNode }) {
  return <div className={`rc ${sans.variable} ${mono.variable}`}>{children}</div>;
}

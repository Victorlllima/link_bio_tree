import type { Metadata } from "next";
import LpsgPainel from "./LpsgPainel";

export const metadata: Metadata = {
  title: "LPSG — Acompanhamento do Lançamento",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LpsgPainel />;
}

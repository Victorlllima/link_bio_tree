import type { Metadata } from "next";
import Painel from "./Painel";

export const metadata: Metadata = {
  title: "Hermes Week · Painel",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700&family=Instrument+Sans:wght@400;500;600;700&display=swap"
      />
      <Painel />
    </>
  );
}

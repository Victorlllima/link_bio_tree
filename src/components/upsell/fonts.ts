import localFont from "next/font/local";

// Fontes do funil EA² servidas daqui (variáveis, latin), sem next/font/google:
// a busca no Google Fonts falha de vez em quando no build da Vercel ("reading '1'").
export const sans = localFont({ src: "./fonts/instrument-sans-latin-wght-normal.woff2", weight: "400 700", display: "swap" });
export const mono = localFont({ src: "./fonts/jetbrains-mono-latin-wght-normal.woff2", weight: "100 800", display: "swap" });

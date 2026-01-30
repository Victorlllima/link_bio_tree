import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RedPro | Seu Hub de Desenvolvimento e Negócios Digitais",
  description: "Descubra projetos prontos, contrate desenvolvedores certificados e aprenda a criar aplicações com IA. RedPro - Transformando ideias em realidade.",
  keywords: "desenvolvimento, programação, vibe coding, método shark, cursos, projetos prontos, desenvolvedores",
  authors: [{ name: "RedPro" }],
  openGraph: {
    type: "website",
    url: "https://redpro.com.br",
    title: "RedPro | Seu Hub de Desenvolvimento e Negócios Digitais",
    description: "Descubra projetos prontos, contrate desenvolvedores certificados e aprenda a criar aplicações com IA.",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "RedPro | Seu Hub de Desenvolvimento e Negócios Digitais",
    description: "Descubra projetos prontos, contrate desenvolvedores certificados e aprenda a criar aplicações com IA.",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦈</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}

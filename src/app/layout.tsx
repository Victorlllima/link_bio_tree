import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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
      <head>
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1543917230170877');
          fbq('track', 'PageView');
        `}</Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{display:"none"}}
            src="https://www.facebook.com/tr?id=1543917230170877&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}

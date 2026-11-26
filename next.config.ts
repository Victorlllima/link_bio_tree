import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Guias de bônus do EA² (22/11): PDFs privados que só saem anexados ao e-mail do webhook da Hotmart.
  outputFileTracingIncludes: {
    "/api/webhooks/hotmart": ["./privado/guias-ea2/**"],
    // Guia da Imersão (ION, 26/11; substitui o Manual da VPS da /configurar-vps): texto e prints só depois da senha
    "/guia-da-imersao": ["./privado/guia-da-imersao/guia.md"],
    "/guia-da-imersao/print/[n]": ["./privado/guia-da-imersao/prints/**"],
    // Instalador da Imersão (ION, 23/11): configurar-vps.sh e pacote cifrados, servidos só com a chave da aula
    "/instalar": ["./privado/instalador/**"],
    "/instalar/arquivo/[nome]": ["./privado/instalador/**"],
  },
  async headers() {
    return [{ source: "/configurar-vps/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
            { source: "/configurar-vps", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
            { source: "/guia-da-imersao/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
            { source: "/guia-da-imersao", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  /* ==========================================================================
   *  HERMES WEEK · as variações A-E passam a cair na G  (Red, 13/09/2026)
   * --------------------------------------------------------------------------
   *  Os 17 anúncios da campanha apontam para /hermes-week/a até /e, que servem
   *  a copy de 01/09. Aquele eixo foi revogado pelo Red em 03/09 e a página
   *  nova é a /g. O Red mandou todo o tráfego pago para ela.
   *
   *  POR QUE REDIRECT E NÃO TROCAR O DESTINO NO ANÚNCIO. O criativo da Meta é
   *  imutável: mudar a URL exige criar criativo novo e reapontar o anúncio, o
   *  que zera a prova social dos 17 e devolve cada um à fase de aprendizagem.
   *  O redirect não encosta na conta de anúncios, mantém o relatório por
   *  anúncio funcionando, deixa o utm_content chegar no checkout igual, e some
   *  apagando estas linhas.
   *
   *  TEMPORÁRIO de propósito (307, não 308): variação de teste vira e mexe
   *  muda de papel, e 308 fica cacheado no navegador de quem já clicou.
   *
   *  ⚠️ A RAIZ E A /f NÃO ENTRAM. A raiz recebe o orgânico e o link da bio;
   *  desde 30/09/2026 ela serve a variação H (landing 3D, app/hermes-week/
   *  route.ts) e a LP cinemática (F) segue em /f. A instrução do Red foi
   *  sobre os anúncios.
   * ======================================================================== */
  async redirects() {
    return [
      ...["a", "b", "c", "d", "e"].map((v) => ({
        source: `/hermes-week/${v}`,
        destination: "/hermes-week/g",
        permanent: false,
      })),
      // Guia da Imersão (ION, 26/11): o endereço com acento cai no sem acento
      { source: "/guia-da-imers%C3%A3o", destination: "/guia-da-imersao", permanent: true },
      { source: "/guia-da-imersão", destination: "/guia-da-imersao", permanent: true },
      // /instalar deixou de ser público (23/11): agora é a rota src/app/instalar (só com a chave da aula).
    ];
  },
};

export default nextConfig;

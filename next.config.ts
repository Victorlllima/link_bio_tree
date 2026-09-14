import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
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
   *  ⚠️ A RAIZ E A /f NÃO ENTRAM. Elas servem a LP cinemática, que recebe o
   *  orgânico e o link da bio. A instrução do Red foi sobre os anúncios.
   * ======================================================================== */
  async redirects() {
    return ["a", "b", "c", "d", "e"].map((v) => ({
      source: `/hermes-week/${v}`,
      destination: "/hermes-week/g",
      permanent: false,
    }));
  },
};

export default nextConfig;

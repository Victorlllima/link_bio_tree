import type { Metadata } from "next";
import { mono, sans } from "@/components/upsell/fonts";
import styles from "@/components/upsell/oferta.module.css";
import OfertaFA2 from "@/components/upsell/OfertaFA2";
import { ViewOferta } from "@/components/upsell/Track";
import { LINK_ACEITAR_1, URL_OBRIGADO } from "@/components/upsell/config";

export const metadata: Metadata = {
  title: "Formação Arquiteto de Agentes | RedPro AI Academy",
  robots: { index: false, follow: false },
};

// UPSELL 1 do EA²: FA², Formação Arquiteto de Agentes (nome de volta, Red 26/11; de 22/11 a 26/11 foi "Mentoria Empresa Agêntica").
// URL e nome="formacao" mantidos (redirect da Hotmart e eventos). Mesma oferta visual do obrigado do EA² (OfertaFA2),
// com o recusar que leva ao obrigado. Conteúdo: FA2-DEFINICAO.md e MENTORIA-24-AULAS.md (imersao-arquiteto-qg/03-baldan).
export default function Page() {
  return (
    <main className={`${styles.root} ${sans.className}`}>
      <ViewOferta nome="formacao" />
      <div className={styles.shade} />
      <div className={styles.wrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.logo} src="/upsell/logo.png" alt="RedPro AI Academy" />
        <span className={`${styles.tag} ${mono.className}`}>
          <i className={styles.led} />
          Sua vaga no EA² está garantida
        </span>
        <h1 className={styles.h1}>Antes de entrar, uma condição que só aparece agora.</h1>
        <OfertaFA2 checkout={LINK_ACEITAR_1} recusar={{ href: URL_OBRIGADO, texto: "Não, obrigado. Ir para a confirmação do EA²" }} />
        <div className={`${styles.sig} ${mono.className}`}>@redpro.ia</div>
      </div>
    </main>
  );
}

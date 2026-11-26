import type { Metadata } from "next";
import { mono, sans } from "@/components/upsell/fonts";
import styles from "@/components/upsell/oferta.module.css";
import { MENTORIA } from "@/components/upsell/config";


export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Confirmado | RedPro AI Academy",
  robots: { index: false, follow: false },
};

// Obrigado FINAL da FA², Formação Arquiteto de Agentes (Red via Rigel, 26/11): só a confirmação da vaga,
// sem oferta. Sem tracking aqui: a Purchase vem do webhook da Hotmart.
export default function Page() {
  return (
    <main className={`${styles.root} ${sans.className}`}>
      <div className={styles.shade} />
      <div className={styles.wrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.logo} src="/upsell/logo.png" alt="RedPro AI Academy" />
        <span className={`${styles.tag} ${mono.className}`}>
          <i className={styles.led} />
          Confirmado
        </span>
        <h1 className={styles.h1}>Sua vaga na {MENTORIA.nome} está garantida.</h1>
        <p className={styles.lead}>O acesso chega no e-mail usado na compra. Se não aparecer em alguns minutos, olhe a caixa de spam.</p>
        <p className={styles.datas}>Os encontros ao vivo comigo são às terças, 15h, a partir de 01/12. A gravação de cada encontro sai em até 48 horas na área de membros.</p>

        <div className={`${styles.sig} ${mono.className}`}>@redpro.ia</div>
      </div>
    </main>
  );
}

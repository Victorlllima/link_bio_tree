import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import styles from "@/components/upsell/oferta.module.css";

const sans = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Confirmado | RedPro AI Academy",
  robots: { index: false, follow: false },
};

// Obrigado do EA². Também é o destino final de quem aceita o upsell 2:
// a ION encaminha com ?aceitou=consultoria (só leitura, sem tracking aqui).
// Purchase NÃO sai do navegador: vem do webhook da Hotmart.
export default async function Page({ searchParams }: { searchParams: Promise<{ aceitou?: string }> }) {
  const { aceitou } = await searchParams;
  const consultoria = aceitou === "consultoria";
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
        <h1 className={styles.h1}>Sua vaga no EA² está garantida.</h1>
        <p className={styles.lead}>O acesso chega no e-mail usado na compra. Se não aparecer em alguns minutos, olhe a caixa de spam.</p>
        <p className={styles.datas}>Datas do 1º ciclo: Aula 3 em 17/12 e Aula 4 em 07/01 (pausa de fim de ano). A gravação de cada aula sai no mesmo dia.</p>
        {consultoria && (
          <p className={styles.lead}>Sobre a consultoria com implementação: nossa equipe fala com você em breve para combinar os próximos passos.</p>
        )}
        <div className={`${styles.sig} ${mono.className}`}>@redpro.ia</div>
      </div>
    </main>
  );
}

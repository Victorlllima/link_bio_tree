import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import styles from "@/components/upsell/oferta.module.css";
import { LINK_MENSALIDADE, OFERTA_2, PRECOS_CONFIRMADOS } from "@/components/upsell/config";

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
      {consultoria && !PRECOS_CONFIRMADOS && <div className={styles.rascunho}>Rascunho: preço e links ainda não confirmados</div>}
      <div className={styles.shade} />
      <div className={styles.wrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.logo} src="/upsell/logo.png" alt="RedPro AI Academy" />
        <span className={`${styles.tag} ${mono.className}`}>
          <i className={styles.led} />
          Confirmado
        </span>
        <h1 className={styles.h1}>Sua vaga no EA² está garantida.</h1>
        {consultoria && (
          <section className={styles.passo2}>
            <span className={`${styles.tag} ${mono.className}`}>
              <i className={styles.led} />
              Passo 2 de 2
            </span>
            <h2 className={styles.passo2Titulo}>Ative a mensalidade do Sua empresa no automático</h2>
            <p>A entrada de {OFERTA_2.implementacao} está paga. Falta ativar a mensalidade: são {OFERTA_2.meses} cobranças de {OFERTA_2.mensal}, uma por mês, e ela encerra sozinha depois da {OFERTA_2.meses}ª.</p>
            <a className={styles.btn} href={LINK_MENSALIDADE}>Ativar a mensalidade</a>
            <p className={styles.passo2Nota}>Depois disso, nossa equipe fala com você para combinar os próximos passos.</p>
          </section>
        )}
        <p className={styles.lead}>O acesso chega no e-mail usado na compra. Se não aparecer em alguns minutos, olhe a caixa de spam.</p>
        <p className={styles.datas}>Datas do 1º ciclo: Aula 3 em 17/12 e Aula 4 em 07/01 (pausa de fim de ano). A gravação de cada aula sai no mesmo dia.</p>

        <div className={`${styles.sig} ${mono.className}`}>@redpro.ia</div>
      </div>
    </main>
  );
}

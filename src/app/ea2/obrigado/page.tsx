import type { Metadata } from "next";
import { mono, sans } from "@/components/upsell/fonts";
import styles from "@/components/upsell/oferta.module.css";
import { LINK_MENSALIDADE, OFERTA_2, PRECOS_CONFIRMADOS, linkCheckoutMentoria } from "@/components/upsell/config";
import OfertaFA2 from "@/components/upsell/OfertaFA2";


export const metadata: Metadata = {
  title: "Confirmado | RedPro AI Academy",
  robots: { index: false, follow: false },
};

// Obrigado do EA². Também é o destino final de quem aceita o upsell 2:
// a ION encaminha com ?aceitou=consultoria (só leitura, sem tracking aqui).
// Purchase NÃO sai do navegador: vem do webhook da Hotmart.
// Abaixo da confirmação: upgrade para a FA² (R$ 4.750, one-time offer) para quem acabou de comprar o EA² (OfertaFA2).
// Some para quem chega com qualquer ?aceitou= (mentoria ou consultoria: já aceitou um upsell).
// O bloco serve a quem pagou no Pix ou boleto ou recusou o upsell de 1 clique (Rigel, 26/11).
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
        <h1 className={styles.h1}>Sua vaga no EA² · Estudos Avançados em Agentes está garantida.</h1>
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
        <p className={styles.lead}>O acesso vai chegar no e-mail usado na compra. Se não aparecer em alguns minutos, dá uma olhada na caixa de spam.</p>
        <p className={styles.datas}>Nossas aulas serão ao vivo às quintas, 15h.<br />1º ciclo: 03/12, 10/12, 17/12 e 07/01 (sem aula em 24/12 e 31/12).</p>

        {!aceitou && <OfertaFA2 checkout={linkCheckoutMentoria()} />}

        <div className={`${styles.sig} ${mono.className}`}>@redpro.ia</div>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import { mono, sans } from "@/components/upsell/fonts";
import styles from "@/components/upsell/oferta.module.css";
import { LINK_MENSALIDADE, MENTORIA, OFERTA_1, OFERTA_2, PRECOS_CONFIRMADOS, linkCheckoutMentoria } from "@/components/upsell/config";


export const metadata: Metadata = {
  title: "Confirmado | RedPro AI Academy",
  robots: { index: false, follow: false },
};

// Obrigado do EA². Também é o destino final de quem aceita o upsell 2:
// a ION encaminha com ?aceitou=consultoria (só leitura, sem tracking aqui).
// Purchase NÃO sai do navegador: vem do webhook da Hotmart.
// Abaixo da confirmação: oferta da Mentoria Empresa Agêntica (R$ 4.750) para quem acabou de comprar o EA².
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

        {!aceitou && (
          <section className={styles.oferta} aria-labelledby="oferta-mentoria">
            <span className={`${styles.tag} ${mono.className}`}>
              <i className={styles.led} />
              Oferta exclusiva para quem acabou de entrar
            </span>
            <h2 id="oferta-mentoria" className={styles.ofertaTitulo}>Quer continuar com a {MENTORIA.nome}?</h2>
            <p className={styles.ofertaLead}>{MENTORIA.promessa} Esta condição aparece só aqui, para quem acabou de comprar o EA². Se não for para você, sua vaga no EA² continua garantida.</p>
            <ul className={styles.itens}>
              {MENTORIA.itens.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <div className={styles.preco}>
              <span className={`${styles.pl} ${mono.className}`}>Para você, agora</span>
              <strong className={styles.pv}>R$ 4.750</strong>
              <span className={styles.pd}>EA² + Mentoria por {OFERTA_1.preco} no total. Você já pagou R$ 1.250 no EA².</span>
              <span className={styles.ancora}>{OFERTA_1.ancora}</span>
            </div>
            <div className={styles.garantia}>
              <span className={`${styles.pl} ${mono.className}`}>Garantia</span>
              <p>{MENTORIA.garantia}</p>
            </div>
            <a className={styles.btn} href={linkCheckoutMentoria()}>Sim, quero a Mentoria</a>
            <p className={styles.aviso}>O resultado depende da sua execução e da sua aplicação.</p>
          </section>
        )}

        <div className={`${styles.sig} ${mono.className}`}>@redpro.ia</div>
      </div>
    </main>
  );
}

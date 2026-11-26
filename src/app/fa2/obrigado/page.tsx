import type { Metadata } from "next";
import { mono, sans } from "@/components/upsell/fonts";
import styles from "@/components/upsell/oferta.module.css";
import { MENTORIA, linkAgendaCall } from "@/components/upsell/config";


export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Confirmado | RedPro AI Academy",
  robots: { index: false, follow: false },
};

// Obrigado da Mentoria Empresa Agêntica (ex-FA²). Abaixo: a consultoria "Sua empresa no automático",
// SEM preço, só com o botão da agenda (FA2_LINK_AGENDA, link do Rigel). Sem tracking aqui:
// a Purchase vem do webhook da Hotmart.
export default function Page() {
  const agenda = linkAgendaCall();
  return (
    <main className={`${styles.root} ${sans.className}`}>
      {!agenda && <div className={styles.rascunho}>Rascunho: link da agenda ainda não configurado</div>}
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
        <p className={styles.datas}>Os encontros ao vivo comigo são às terças, 15h, a partir de 01/12. A gravação de cada encontro sai no mesmo dia.</p>

        <section className={styles.agenda} aria-labelledby="consultoria">
          <span className={`${styles.tag} ${mono.className}`}>
            <i className={styles.led} />
            Se preferir que a gente faça
          </span>
          <h2 id="consultoria" className={styles.ofertaTitulo}>Sua empresa no automático</h2>
          <p>Eu e o Genix Lab implantamos os Squads na sua empresa e acompanhamos a operação por 6 meses. Você não precisa montar nada sozinho.</p>
          <ul className={styles.itens}>
            <li>Implantação dos 2 Squads, marketing e desenvolvimento, feita por mim e pelo Genix Lab</li>
            <li>6 meses de operação acompanhada</li>
            <li>Genix OS ativo durante todo o contrato</li>
          </ul>
          <p>O formato depende da sua empresa. Por isso a gente conversa antes, numa call.</p>
          <a className={styles.btn} href={agenda || "#"} aria-disabled={!agenda}>Agendar uma call</a>
        </section>

        <div className={`${styles.sig} ${mono.className}`}>@redpro.ia</div>
      </div>
    </main>
  );
}

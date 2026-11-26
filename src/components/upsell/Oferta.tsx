import { mono, sans } from "@/components/upsell/fonts";
import styles from "./oferta.module.css";
import { PRECOS_CONFIRMADOS } from "./config";
import { Recusar, ViewOferta } from "./Track";


type Props = {
  nome: "formacao" | "implementacao";
  etapa: string;
  titulo: string;
  lead: string;
  itens: string[];
  precoLabel: string;
  preco: string;
  precoDetalhe?: string;
  nota?: string;
  garantia?: string;
  ancora?: string;
  aceitarTexto: string;
  aceitarHref: string;
  recusarTexto: string;
  recusarHref: string;
  aviso: string;
};

export default function Oferta(p: Props) {
  return (
    <main className={`${styles.root} ${sans.className}`}>
      <ViewOferta nome={p.nome} />
      <div className={styles.shade} />
      {!PRECOS_CONFIRMADOS && (
        <div className={styles.rascunho}>Rascunho: preço e links ainda não confirmados</div>
      )}
      <div className={styles.wrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.logo} src="/upsell/logo.png" alt="RedPro AI Academy" />
        <span className={`${styles.tag} ${mono.className}`}>
          <i className={styles.led} />
          {p.etapa}
        </span>
        <h1 className={styles.h1}>{p.titulo}</h1>
        <p className={styles.lead}>{p.lead}</p>

        <ul className={styles.itens}>
          {p.itens.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <section className={styles.preco}>
          <span className={`${styles.pl} ${mono.className}`}>{p.precoLabel}</span>
          <strong className={styles.pv}>{p.preco}</strong>
          {p.precoDetalhe && <span className={styles.pd}>{p.precoDetalhe}</span>}
          {p.ancora && <span className={styles.ancora}>{p.ancora}</span>}
          {p.nota && <span className={styles.nota}>{p.nota}</span>}
        </section>

        {p.garantia && (
          <section className={styles.garantia}>
            <span className={`${styles.pl} ${mono.className}`}>Garantia</span>
            <p>{p.garantia}</p>
          </section>
        )}

        <a className={styles.btn} href={p.aceitarHref}>
          {p.aceitarTexto}
        </a>
        <Recusar nome={p.nome} className={styles.recusar} href={p.recusarHref}>
          {p.recusarTexto}
        </Recusar>

        <p className={styles.aviso}>{p.aviso}</p>
        <div className={`${styles.sig} ${mono.className}`}>@redpro.ia</div>
      </div>
    </main>
  );
}

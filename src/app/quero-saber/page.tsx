"use client";

import { useState } from "react";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import styles from "./quero-saber.module.css";

const sans = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

// QUERO SABER: aparece por QR no slide 39 (ponte do fim da noite 1 da Imersão).
// ID Cromo fosco. Sem preço, sem nome de produto, sem promessa.
// Grava em `quero_saber` pela /api/quero-saber.

const OPCOES = [
  { v: "squad", t: "Os 3 agentes trabalhando juntos (Squad orquestrado)" },
  { v: "video", t: "Edição de vídeo com agentes" },
  { v: "outro", t: "Outro" },
];

export default function QueroSaber() {
  const [f, setF] = useState({ nome: "", email: "", whatsapp: "", interesse: "", site: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [erro, setErro] = useState("");
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setErro("");
    const q = new URLSearchParams(window.location.search);
    const origem = ["utm_source", "utm_medium", "utm_campaign"]
      .map((k) => (q.get(k) ? `${k}=${q.get(k)}` : ""))
      .filter(Boolean)
      .join("&");
    try {
      const r = await fetch("/api/quero-saber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, origem }),
      });
      if (!r.ok) throw new Error(String(r.status));
      setDone(true);
    } catch {
      setErro("Não consegui salvar agora. Confira os dados e tente de novo.");
    }
    setSending(false);
  }

  return (
    <main className={`${styles.root} ${sans.className}`}>
      <div className={styles.shade} />
      <div className={styles.wrap}>
        <img src="/quero-saber/logo.png" alt="RedPro AI Academy" className={styles.logo} />
        {done ? (
          <section aria-live="polite">
            <span className={`${styles.tag} ${mono.className}`}><i className={styles.led} />Anotado</span>
            <h1 className={styles.h1}>Recebi.</h1>
            <p className={styles.lead}>Você está na lista. Eu te aviso primeiro, depois da noite 2.</p>
          </section>
        ) : (
          <>
            <span className={`${styles.tag} ${mono.className}`}><i className={styles.led} />Quero saber</span>
            <h1 className={styles.h1}>Quer saber como continuar comigo?</h1>
            <p className={styles.lead}>
              Amanhã, no fim da noite 2, eu mostro como continuar comigo. Deixe seu nome e eu te aviso primeiro.
            </p>
            <form onSubmit={submit} className={styles.form} noValidate={false}>
              <label className={mono.className}>Nome
                <input required autoComplete="name" value={f.nome} onChange={(e) => set("nome", e.target.value)} />
              </label>
              <label className={mono.className}>E-mail usado na compra do ingresso
                <input required type="email" autoComplete="email" inputMode="email" value={f.email} onChange={(e) => set("email", e.target.value)} />
              </label>
              <label className={mono.className}>WhatsApp
                <input required type="tel" autoComplete="tel" inputMode="tel" placeholder="(00) 00000-0000" value={f.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
              </label>
              <fieldset className={styles.fs}>
                <legend className={mono.className}>O que você mais quer depois da Imersão? (opcional)</legend>
                {OPCOES.map((o) => (
                  <label key={o.v} className={styles.opt}>
                    <input type="radio" name="interesse" checked={f.interesse === o.v} onChange={() => set("interesse", o.v)} />
                    <span>{o.t}</span>
                  </label>
                ))}
              </fieldset>
              <input className={styles.hp} tabIndex={-1} autoComplete="off" aria-hidden="true" name="site" value={f.site} onChange={(e) => set("site", e.target.value)} />
              {erro && <p className={styles.erro} role="alert">{erro}</p>}
              <button className={`${styles.btn} ${mono.className}`} disabled={sending}>
                {sending ? "Enviando..." : "Quero saber"}
              </button>
              <p className={styles.priv}>
                Uso seu nome, e-mail e WhatsApp só para te avisar sobre isto e para a equipe da RedPro falar com você. Para sair da lista, é só pedir no suporte. <a href="/privacidade">Política de privacidade</a>.
              </p>
            </form>
          </>
        )}
        <p className={`${styles.sig} ${mono.className}`}>@redpro.ia</p>
      </div>
    </main>
  );
}

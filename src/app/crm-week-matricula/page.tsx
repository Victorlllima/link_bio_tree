"use client";

import { useState } from "react";

// FICHA DE MATRÍCULA — passo 2 da mensageria de boas-vindas do Tabari
// ("1. confirma e-mail · 2. FICHA · 3. grupo backup").
// Preenchida por quem JÁ comprou o ingresso, ANTES do evento começar.
// Função: onboarding + contexto pro Red adaptar os exemplos das aulas.
// NÃO confundir com /crm-week-status (ficha de INTERESSE, abre na aula 4 e qualifica MQL).

type Form = {
  nome: string; email: string; whatsapp: string;
  ocupacao: string; nivel_ia: string; ja_construiu: string;
  nicho: string; objetivo: string; maior_duvida: string;
};

const INITIAL: Form = {
  nome: "", email: "", whatsapp: "",
  ocupacao: "", nivel_ia: "", ja_construiu: "",
  nicho: "", objetivo: "", maior_duvida: "",
};

export default function CrmWeekMatriculaPage() {
  const [form, setForm] = useState<Form>(INITIAL);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const valido =
    form.nome && form.email && form.whatsapp &&
    form.ocupacao && form.nivel_ia && form.objetivo;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || sending) return;
    setSending(true);
    try {
      await fetch("/api/crm-week-matricula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setDone(true);
    } catch {
      setDone(true); // não trava o aluno; a notificação é interna
    }
    setSending(false);
  }

  return (
    <div style={S.root}>
      <div style={S.wrap}>
        {done ? (
          <div style={S.doneBox}>
            <div style={S.check}>✓</div>
            <h1 style={S.h1}>Matrícula confirmada.</h1>
            <p style={S.lead}>
              Recebi suas respostas — elas me ajudam a adaptar os exemplos das aulas pra sua realidade.
              <br /><br />
              Agora <strong style={{ color: "#F97316" }}>entra no grupo do WhatsApp</strong>, se ainda não entrou. É por lá que saem todos os links.
              <br /><br />
              Te espero segunda, 7h. Bora construir o seu.
            </p>
          </div>
        ) : (
          <>
            <div style={S.kicker}>Ficha de matrícula · Desafio CRM em 5 dias</div>
            <h1 style={S.h1}>Antes de começar, <span style={{ color: "#F97316" }}>me conta de você</span></h1>
            <p style={S.lead}>
              Leva menos de 3 minutos. Quanto mais honesto você for, mais as aulas vão parecer feitas pra
              você — é com essas respostas que eu adapto os exemplos pra realidade de quem está aqui.
            </p>

            <form onSubmit={submit} style={S.form}>
              <div style={S.secTit}>Seus dados</div>

              <Field label="Seu nome">
                <input style={S.input} value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Felipe Silva" />
              </Field>
              <Field label="Seu melhor e-mail">
                <input style={S.input} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="voce@email.com" />
              </Field>
              <Field label="WhatsApp (com DDD)">
                <input style={S.input} value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="(61) 99999-9999" />
              </Field>

              <div style={S.secTit}>Seu contexto</div>

              <Field label="O que você faz hoje?">
                <select style={S.select} value={form.ocupacao} onChange={(e) => set("ocupacao", e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="clt">Sou contratado (CLT)</option>
                  <option value="autonomo">Trabalho por conta / freelancer</option>
                  <option value="empresa">Tenho minha própria empresa</option>
                  <option value="entre-empregos">Estou entre empregos</option>
                  <option value="estudante">Estudante</option>
                </select>
              </Field>

              <Field label="Como você se vê com IA hoje?">
                <select style={S.select} value={form.nivel_ia} onChange={(e) => set("nivel_ia", e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="nunca">Nunca usei quase nada</option>
                  <option value="basico">Uso ChatGPT no dia a dia, sem ir além</option>
                  <option value="intermediario">Já testei automações e ferramentas</option>
                  <option value="avancado">Já entreguei algo com IA pra alguém</option>
                </select>
              </Field>

              <Field label="Você já tentou construir um sistema (site, app, automação)?">
                <select style={S.select} value={form.ja_construiu} onChange={(e) => set("ja_construiu", e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="nunca">Nunca tentei</option>
                  <option value="tentei-travei">Tentei e travei no meio</option>
                  <option value="terminei">Já terminei alguma coisa</option>
                </select>
              </Field>

              <Field label="Tem algum tipo de negócio em mente pro seu CRM? (opcional)">
                <input style={S.input} value={form.nicho} onChange={(e) => set("nicho", e.target.value)} placeholder="Ex: clínica, imobiliária, loja, escritório…" />
              </Field>

              <Field label="O que te fez entrar nesse desafio?">
                <select style={S.select} value={form.objetivo} onChange={(e) => set("objetivo", e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="nova-renda">Quero uma nova fonte de renda com IA</option>
                  <option value="atender-empresas">Quero atender empresas e cobrar por isso</option>
                  <option value="minha-empresa">Quero usar no meu próprio negócio</option>
                  <option value="carreira">Quero mudar de carreira</option>
                  <option value="aprender">Quero aprender e ver onde chego</option>
                </select>
              </Field>

              <Field label="Qual sua maior dúvida ou medo antes de começar? (opcional)">
                <textarea style={S.textarea} rows={3} value={form.maior_duvida} onChange={(e) => set("maior_duvida", e.target.value)} placeholder="Ex: será que dou conta sem saber programar? e se eu travar no meio?" />
              </Field>

              <button type="submit" disabled={!valido || sending} style={{ ...S.btn, opacity: valido && !sending ? 1 : 0.5, cursor: valido && !sending ? "pointer" : "not-allowed" }}>
                {sending ? "Enviando…" : "Confirmar minha matrícula"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={S.field}>
      <span style={S.fieldLabel}>{label}</span>
      {children}
    </label>
  );
}

const S: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh", background: "#080808", color: "#F5F5F5", fontFamily: "'JetBrains Mono', ui-monospace, monospace", padding: "48px 20px", display: "flex", justifyContent: "center" },
  wrap: { maxWidth: 560, width: "100%" },
  kicker: { fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F97316", marginBottom: 18 },
  h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 900, fontSize: "clamp(28px, 5vw, 42px)", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 12 },
  lead: { color: "#B8B8B8", fontSize: 16, lineHeight: 1.6, marginBottom: 36 },
  form: { display: "flex", flexDirection: "column", gap: 20 },
  secTit: { fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#8A8A8A", marginTop: 12, paddingBottom: 6, borderBottom: "1px solid #1F1F1F" },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  fieldLabel: { fontSize: 14, fontWeight: 500, color: "#F5F5F5" },
  input: { background: "#141414", border: "1px solid #1F1F1F", borderRadius: 10, padding: "13px 15px", color: "#F5F5F5", fontSize: 15, fontFamily: "inherit", outline: "none" },
  select: { background: "#141414", border: "1px solid #1F1F1F", borderRadius: 10, padding: "13px 15px", color: "#F5F5F5", fontSize: 15, fontFamily: "inherit", outline: "none", appearance: "none" },
  textarea: { background: "#141414", border: "1px solid #1F1F1F", borderRadius: 10, padding: "13px 15px", color: "#F5F5F5", fontSize: 15, fontFamily: "inherit", outline: "none", resize: "vertical" },
  btn: { background: "#F97316", color: "#080808", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 17, padding: "17px", borderRadius: 10, border: "none", marginTop: 8 },
  doneBox: { textAlign: "center", paddingTop: 60 },
  check: { width: 72, height: 72, margin: "0 auto 24px", borderRadius: "50%", background: "rgba(74,222,128,.12)", border: "2px solid #4ADE80", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: "#4ADE80" },
};

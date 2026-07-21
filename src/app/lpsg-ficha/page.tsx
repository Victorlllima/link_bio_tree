"use client";

import { useState } from "react";

// FICHA DE INTERESSE — abre na AULA 4 (quinta), padrão Tabari: "pré-pitch sem preço + ficha de
// interesse (4 perguntas MQL)". Quem preenche entra no carrinho às 6h50 (10min antes dos demais).
// Benchmark Tabari: ~25% da base da aula 4 preenche; efeito = +30% de presença no pitch de domingo.
// NÃO confundir com /crm-week-matricula (onboarding de quem comprou o ingresso, antes do evento).

type Form = {
  nome: string; email: string; whatsapp: string;
  execucao: string; intencao: string; quando: string; trava: string;
};

const INITIAL: Form = {
  nome: "", email: "", whatsapp: "",
  execucao: "", intencao: "", quando: "", trava: "",
};

export default function LpsgFichaPage() {
  const [form, setForm] = useState<Form>(INITIAL);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const valido = form.nome && form.email && form.whatsapp && form.execucao && form.intencao && form.quando;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || sending) return;
    setSending(true);
    try {
      await fetch("/api/lpsg-ficha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setDone(true);
    } catch {
      setDone(true); // não trava o usuário; a notificação é interna
    }
    setSending(false);
  }

  return (
    <div style={S.root}>
      <div style={S.wrap}>
        {done ? (
          <div style={S.doneBox}>
            <div style={S.check}>✓</div>
            <h1 style={S.h1}>Recebi sua ficha.</h1>
            <p style={S.lead}>
              Segunda, 3/ago às 6h50, quem preencheu a ficha entra no carrinho <strong style={{ color: "#F97316" }}>10 minutos antes</strong>, com um bônus único. Fica de olho no grupo.
            </p>
          </div>
        ) : (
          <>
            <div style={S.kicker}>Ficha de interesse · Formação S.H.A.R.K.</div>
            <h1 style={S.h1}>Você quer o <span style={{ color: "#F97316" }}>próximo nível</span>?</h1>
            <p style={S.lead}>
              Preencher a ficha te dá a <strong style={{ color: "#fff" }}>janela exclusiva das 6h50</strong> na abertura do carrinho (10min antes de todo mundo, com bônus único). Leva 1 minuto.
            </p>

            <form onSubmit={submit} style={S.form}>
              <Field label="Seu nome">
                <input style={S.input} value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Felipe Silva" />
              </Field>
              <Field label="Seu melhor e-mail">
                <input style={S.input} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="voce@email.com" />
              </Field>
              <Field label="WhatsApp (com DDD)">
                <input style={S.input} value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="(61) 99999-9999" />
              </Field>

              <Field label="1. Até aqui, o quanto você construiu junto?">
                <select style={S.select} value={form.execucao} onChange={(e) => set("execucao", e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="no-ar">Meu CRM já está no ar, com link</option>
                  <option value="construindo">Estou construindo, acompanhando as aulas</option>
                  <option value="assistindo">Estou só assistindo por enquanto</option>
                  <option value="atrasado">Ainda não comecei, estou atrasado</option>
                </select>
              </Field>

              <Field label="2. Depois do desafio, o que você quer fazer com isso?">
                <select style={S.select} value={form.intencao} onChange={(e) => set("intencao", e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="viver-disso">Quero viver disso — construir e cobrar de empresas</option>
                  <option value="renda-extra">Quero uma renda extra por fora do meu trabalho</option>
                  <option value="minha-empresa">Quero usar no meu próprio negócio</option>
                  <option value="nao-sei">Ainda não sei, quero entender melhor</option>
                </select>
              </Field>

              <Field label="3. Quando você quer começar de verdade?">
                <select style={S.select} value={form.quando} onChange={(e) => set("quando", e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="agora">Agora — quero o próximo passo essa semana</option>
                  <option value="mes">Nos próximos 30 dias</option>
                  <option value="trimestre">Nos próximos 3 meses</option>
                  <option value="sem-pressa">Sem pressa, quando der</option>
                </select>
              </Field>

              <Field label="4. O que ainda te trava pra dar esse passo?">
                <textarea style={S.textarea} rows={3} value={form.trava} onChange={(e) => set("trava", e.target.value)} placeholder="Ex: não sei quanto cobrar, tenho medo de travar sozinho, não sei onde achar cliente…" />
              </Field>

              <button type="submit" disabled={!valido || sending} style={{ ...S.btn, opacity: valido && !sending ? 1 : 0.5, cursor: valido && !sending ? "pointer" : "not-allowed" }}>
                {sending ? "Enviando…" : "Garantir minha janela das 6h50"}
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
  field: { display: "flex", flexDirection: "column", gap: 8 },
  fieldLabel: { fontSize: 14, fontWeight: 500, color: "#F5F5F5" },
  input: { background: "#141414", border: "1px solid #1F1F1F", borderRadius: 10, padding: "13px 15px", color: "#F5F5F5", fontSize: 15, fontFamily: "inherit", outline: "none" },
  select: { background: "#141414", border: "1px solid #1F1F1F", borderRadius: 10, padding: "13px 15px", color: "#F5F5F5", fontSize: 15, fontFamily: "inherit", outline: "none", appearance: "none" },
  textarea: { background: "#141414", border: "1px solid #1F1F1F", borderRadius: 10, padding: "13px 15px", color: "#F5F5F5", fontSize: 15, fontFamily: "inherit", outline: "none", resize: "vertical" },
  btn: { background: "#F97316", color: "#080808", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 17, padding: "17px", borderRadius: 10, border: "none", marginTop: 8 },
  doneBox: { textAlign: "center", paddingTop: 60 },
  check: { width: 72, height: 72, margin: "0 auto 24px", borderRadius: "50%", background: "rgba(74,222,128,.12)", border: "2px solid #4ADE80", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: "#4ADE80" },
};

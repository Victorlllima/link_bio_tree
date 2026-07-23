"use client";

import { useState } from "react";

// ⚠️ SEMANAL: trocar o link do grupo a cada ciclo (mesmo link da página de obrigado).
const GRUPO_URL = "https://chat.whatsapp.com/I3AcP8IpTtsG2y3gC7O0bS";

// FICHA DE MATRÍCULA — passo 2 da mensageria de boas-vindas do Tabari
// ("1. confirma e-mail · 2. FICHA · 3. grupo backup").
// Preenchida por quem JÁ comprou o ingresso, ANTES do evento começar.
// Função: onboarding + contexto pro Red adaptar os exemplos das aulas.
// NÃO confundir com /crm-week-status (ficha de INTERESSE, abre na aula 4 e qualifica MQL).

type Form = {
  nome: string; email: string; ddi: string; whatsapp: string;
  ocupacao: string; nivel_ia: string; ja_construiu: string;
  nicho: string; objetivo: string; maior_duvida: string;
};

// DDIs mais comuns pro público do Red (Brasil default + países com brasileiros no exterior).
const DDIS = [
  { code: "+55", label: "🇧🇷 +55" },
  { code: "+351", label: "🇵🇹 +351" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+34", label: "🇪🇸 +34" },
  { code: "+353", label: "🇮🇪 +353" },
  { code: "+61", label: "🇦🇺 +61" },
  { code: "+49", label: "🇩🇪 +49" },
  { code: "+33", label: "🇫🇷 +33" },
  { code: "+39", label: "🇮🇹 +39" },
  { code: "+81", label: "🇯🇵 +81" },
];

const INITIAL: Form = {
  nome: "", email: "", ddi: "+55", whatsapp: "",
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
      // Grava o WhatsApp já com o DDI na frente (ex: "+55 (61) 99999-9999").
      const payload = { ...form, whatsapp: `${form.ddi} ${form.whatsapp}`.trim() };
      await fetch("/api/crm-week-matricula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
            <img src="/logo-academy.png" alt="RedPro AI Academy" style={S.logoDone} />
            <div style={S.check}>✓</div>
            <h1 style={S.h1}>Matrícula confirmada.</h1>
            <p style={S.lead}>
              Recebi suas respostas, Shark. Elas vão me ajudar a adaptar os exemplos das aulas pra sua realidade.
              <br /><br />
              Agora sua <strong style={{ color: "#F97316" }}>primeira missão</strong> é entrar no nosso grupo do WhatsApp. É por lá que eu vou te mandar todos os links e avisos das nossas aulas.
              <br /><br />
              Te espero segunda, 7h. Bora construir seu CRM!
            </p>
            <a href={GRUPO_URL} style={S.btnWpp} target="_blank" rel="noopener noreferrer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Entrar no grupo do WhatsApp
            </a>
          </div>
        ) : (
          <>
            <img src="/logo-academy.png" alt="RedPro AI Academy" style={S.logo} />
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
                <div style={{ display: "flex", gap: 8 }}>
                  <select style={{ ...S.select, width: 118, flexShrink: 0 }} value={form.ddi} onChange={(e) => set("ddi", e.target.value)}>
                    {DDIS.map((d) => (<option key={d.code} value={d.code}>{d.label}</option>))}
                  </select>
                  <input style={{ ...S.input, flex: 1 }} value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="(61) 99999-9999" inputMode="tel" />
                </div>
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
  doneBox: { textAlign: "center", paddingTop: 40 },
  logo: { height: 204, display: "block", margin: "0 auto 26px" },
  logoDone: { height: 40, display: "block", margin: "0 auto 28px" },
  check: { width: 72, height: 72, margin: "0 auto 24px", borderRadius: "50%", background: "rgba(74,222,128,.12)", border: "2px solid #4ADE80", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: "#4ADE80" },
  btnWpp: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#25D366", color: "#0a0a0a", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 17, padding: "16px 30px", borderRadius: 12, textDecoration: "none", marginTop: 34, boxShadow: "0 8px 30px rgba(37,211,102,.28)" },
};

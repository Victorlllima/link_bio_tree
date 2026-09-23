"use client";

import { useState } from "react";

// FICHA DE INTERESSE — HERMES WEEK. Abre na AULA 4 (quinta, 20h), padrão Tabari:
// "pré-pitch sem preço + ficha de interesse". Quem preenche entra na inscrição às 6h50
// (10 min antes) e leva o squad pronto para importar (bônus travado com o Red em 23/09).
//
// Adaptada de /crm-week-status (mesmo motor: mesma API, mesma tabela, mesmo painel /lpsg).
// A 4ª pergunta é nova e é a do Tabari: disposição a pagar no VALOR ANCORADO (R$1.397),
// que é o dobro do preço real de R$697. Ele mede a divisão ideal 20% sim / 20% não /
// 60% preciso de mais informação, e calibra o pitch de domingo com isso.
//
// ⚠️ O valor NUNCA é falado na câmera (decisão do Red, 23/09). Ele só existe escrito aqui.

type Form = {
  nome: string; email: string; whatsapp: string;
  execucao: string; intencao: string; quando: string; valor: string; trava: string;
};

const INITIAL: Form = {
  nome: "", email: "", whatsapp: "",
  execucao: "", intencao: "", quando: "", valor: "", trava: "",
};

export default function HermesWeekInteressePage() {
  const [form, setForm] = useState<Form>(INITIAL);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const valido = form.nome && form.email && form.whatsapp && form.execucao && form.intencao && form.quando && form.valor;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || sending) return;
    setSending(true);
    try {
      await fetch("/api/hermes-week-interesse", {
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
            <img src="/logo-academy.png" alt="RedPro AI Academy" style={S.logoDone} />
            <div style={S.check}>✓</div>
            <h1 style={S.h1}>Recebi.</h1>
            <p style={S.lead}>
              Dois lembretes e acabou.
            </p>
            <p style={S.lead}>
              <strong style={{ color: "#fff" }}>Domingo, 20h</strong>, a aula final. É onde eu mostro o que
              existe depois de um agente só, e onde eu conto o que vai junto para quem preencheu esta ficha.
            </p>
            <p style={S.lead}>
              <strong style={{ color: "#fff" }}>Segunda, 6h50</strong>, o link chega no seu WhatsApp,
              dez minutos antes de ir para o grupo. É o mesmo número que te mandou as mensagens da semana.
            </p>
          </div>
        ) : (
          <>
            <img src="/logo-academy.png" alt="RedPro AI Academy" style={S.logo} />
            <div style={S.kicker}>Hermes Week</div>
            <h1 style={S.h1}>Você quer <span style={{ color: "#F97316" }}>continuar</span> depois de sexta?</h1>
            <p style={S.lead}>
              Domingo, às 20h, eu mostro o que eu faço quando um agente só não dá mais conta. Na segunda de
              manhã abre a inscrição para quem quiser seguir comigo depois da semana.
            </p>
            <p style={S.lead}>
              Esta ficha serve para eu montar a aula de domingo sabendo quem está do outro lado. Leva dois
              minutos e não te compromete com nada.
            </p>

            <div style={S.box}>
              <div style={S.boxTitle}>O que preencher te dá</div>
              <p style={S.boxItem}>
                <strong style={{ color: "#fff" }}>1. O link chega às 6h50, no seu WhatsApp.</strong> Dez
                minutos antes de ir para o grupo. Eu vou ser honesto sobre o tamanho disso: não tem vaga
                limitada e o preço é o mesmo o dia inteiro. Os dez minutos servem para você ler a página com
                calma e decidir antes de o seu dia começar, sem caçar mensagem em grupo às sete da manhã.
              </p>
              <p style={S.boxItem}>
                <strong style={{ color: "#fff" }}>2. Um material pronto que só vai para quem preencheu.</strong>{" "}
                Não é PDF nem planilha. É uma coisa que você importa e usa no primeiro dia. Eu mostro o que é
                no domingo, às 20h, na aula.
              </p>
            </div>

            <form onSubmit={submit} style={S.form}>
              <Field label="Seu nome">
                <input style={S.input} value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Victor Lima" />
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
                  <option value="no-ar">Meu agente está de pé e eu já uso no dia a dia</option>
                  <option value="construindo">Instalei e estou construindo junto com as aulas</option>
                  <option value="assistindo">Estou só assistindo por enquanto</option>
                  <option value="atrasado">Ainda não instalei</option>
                </select>
              </Field>

              <Field label="2. Depois desta semana, o que você quer fazer com o seu agente?">
                <select style={S.select} value={form.intencao} onChange={(e) => set("intencao", e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="viver-disso">Montar isso para outras empresas e cobrar por isso</option>
                  <option value="minha-empresa">Ter um time de agentes trabalhando no meu negócio</option>
                  <option value="renda-extra">Tirar trabalho repetitivo das minhas costas</option>
                  <option value="nao-sei">Ainda não sei, quero entender melhor</option>
                </select>
              </Field>

              <Field label="3. Quando você quer dar esse passo?">
                <select style={S.select} value={form.quando} onChange={(e) => set("quando", e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="agora">Agora, nesta semana</option>
                  <option value="mes">Nos próximos 30 dias</option>
                  <option value="trimestre">Nos próximos 3 meses</option>
                  <option value="sem-pressa">Sem pressa, quando der</option>
                </select>
              </Field>

              <Field label="4. Se em 30 dias você tivesse um time de agentes trabalhando com o seu computador desligado, quanto isso valeria para você?">
                <select style={S.select} value={form.valor} onChange={(e) => set("valor", e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="sim">Valeria R$1.397, e eu investiria</option>
                  <option value="talvez">Preciso ver o que tem dentro antes de dizer</option>
                  <option value="nao">Não investiria esse valor</option>
                </select>
              </Field>

              <Field label="5. O que ainda te impede de dar esse passo?">
                <textarea style={S.textarea} rows={3} value={form.trava} onChange={(e) => set("trava", e.target.value)} placeholder="Ex: o custo me assusta, não sei se aguento manter, já apanhei de agente que parou de funcionar…" />
              </Field>

              <button type="submit" disabled={!valido || sending} style={{ ...S.btn, opacity: valido && !sending ? 1 : 0.5, cursor: valido && !sending ? "pointer" : "not-allowed" }}>
                {sending ? "Enviando…" : "Enviar minha ficha"}
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
  logo: { height: 92, display: "block", margin: "0 auto 22px" },
  logoDone: { height: 64, display: "block", margin: "0 auto 20px" },
  box: { background: "#101010", border: "1px solid #1F1F1F", borderRadius: 12, padding: "20px 20px 6px", marginBottom: 34 },
  boxTitle: { fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#F97316", marginBottom: 14 },
  boxItem: { color: "#B8B8B8", fontSize: 14.5, lineHeight: 1.6, marginBottom: 16 },
  doneBox: { textAlign: "center", paddingTop: 40 },
  check: { width: 72, height: 72, margin: "0 auto 24px", borderRadius: "50%", background: "rgba(74,222,128,.12)", border: "2px solid #4ADE80", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: "#4ADE80" },
};

"use client";

import { useEffect, useState } from "react";

/* ============================================================================
 *  /hermes-week/matricula  ·  FICHA DE MATRÍCULA da Hermes Week
 * ----------------------------------------------------------------------------
 *  Passo 2 da mensageria de boas-vindas do Tabari: "1. confirma e-mail ·
 *  2. FICHA · 3. grupo". Preenchida por quem JÁ comprou o ingresso.
 *
 *  Aqui NÃO se qualifica ninguém. É onboarding e contexto pro Red adaptar os
 *  exemplos das aulas. A qualificação MQL é a ficha de INTERESSE, que abre na
 *  Aula 4 e ainda não existe.
 *
 *  ⚠️ As perguntas foram escritas pro ICP do Hermes (`HERMES/00-fundacao/avatar.md`),
 *  NÃO pro Felipe, descartado como ICP deste projeto pelo Red em 03/09/2026.
 *  Esse público já montou agente e já apanhou: vocabulário técnico, sem
 *  explicar o que é agente, sem "você não precisa programar". Por isso as
 *  perguntas são sobre sistema operacional, o que ele já tentou, onde travou e
 *  qual conta de IA ele paga — e não sobre ocupação ou nível de conhecimento.
 *
 *  As quatro obrigatórias existem por um motivo operacional cada uma:
 *   - sistema      → a Aula 1 tem um passo a mais no Windows (ver mensageria)
 *   - ja_tentou    → a maioria vem do OpenClaw; muda o exemplo de migração
 *   - onde_travou  → nomeia a dor real do avatar (imposto de manutenção)
 *   - gasto_mes    → a dor nº 1 do avatar é a conta no fim do mês (Aula 2)
 *
 *  Reformulada em 21/09/2026 (Red): nome e e-mail chegam prontos pela URL,
 *  entraram profissão, gasto por mês e tempo perdido por semana (mapeiam o ICP
 *  e alimentam a copy), "onde travou" virou "onde empacou" (regra de voz de
 *  11/09) e a pergunta de dúvida/receio saiu daqui: ela pertence à ficha de
 *  INTERESSE, que abre na Aula 4 e qualifica de verdade.
 * ==========================================================================*/

// O link do grupo NÃO mora mais aqui (12/10/2026): chega por prop, lido de `ciclo_atual` (Supabase) pelo
// page.tsx. Antes era uma constante cravada que a virada de segunda precisava editar e publicar à mão;
// com a virada rodando na VPS, isso deixava o comprador novo caindo no grupo da turma em aula.

type Form = {
  nome: string; email: string; ddi: string; whatsapp: string;
  profissao: string; sistema: string; ja_tentou: string; onde_travou: string;
  gasto_mes: string; tempo_perdido: string; o_que_quer: string;
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
  profissao: "", sistema: "", ja_tentou: "", onde_travou: "",
  gasto_mes: "", tempo_perdido: "", o_que_quer: "",
};

export default function HermesWeekMatriculaPage({ grupoUrl }: { grupoUrl: string }) {
  const [form, setForm] = useState<Form>(INITIAL);

  /* Nome e e-mail chegam prontos pela URL (?nome=&email=), montada pelo webhook
     de compra e pelas mensagens da Julia. Dois campos a menos para digitar é a
     diferença entre a pessoa preencher e deixar pra depois (2 de 8 no ciclo 1). */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const nome = q.get("nome") || q.get("n") || "";
    const email = q.get("email") || q.get("e") || "";
    if (nome || email) {
      setForm((f) => ({ ...f, nome: nome || f.nome, email: email || f.email }));
    }
  }, []);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [aviso, setAviso] = useState("");

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  /* Obrigatórios: o que identifica a pessoa e o que muda a aula. Profissão,
     gasto e tempo perdido entram como opcionais de propósito: são o que mapeia
     o ICP, mas não valem travar o envio de quem quer só confirmar a matrícula. */
  const valido =
    form.nome && form.email && form.whatsapp &&
    form.sistema && form.ja_tentou && form.onde_travou &&
    form.o_que_quer.trim().length > 3;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    if (!valido) { // o navegador já barra os vazios; isto cobre o resto e fala em voz alta o que falta
      const falta = [
        !form.nome && "seu nome", !form.email && "o e-mail da compra", !form.whatsapp && "o WhatsApp",
        !form.sistema && "onde o agente vai rodar", !form.ja_tentou && "o que você já tentou", !form.onde_travou && "onde você empacou",
        form.o_que_quer.trim().length <= 3 && "o que você quer que ele faça",
      ].filter(Boolean);
      setAviso(`Falta preencher: ${falta.join(", ")}.`);
      return;
    }
    setAviso("");
    setSending(true);
    try {
      // Grava o WhatsApp já com o DDI na frente (ex: "+55 (61) 99999-9999").
      const payload = { ...form, whatsapp: `${form.ddi} ${form.whatsapp}`.trim() };
      await fetch("/api/hermes-week-matricula", {
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
    <main className="hw-ficha" style={S.root}>
      <style>{CSS}</style>
      <div style={S.wrap}>
        {done ? (
          <div style={S.doneBox}>
            <img src="/logo-academy.png" alt="RedPro AI Academy" style={S.logoDone} />
            <div style={S.check} aria-hidden="true">✓</div>
            <h1 style={S.h1}>Matrícula confirmada.</h1>
            <p style={S.lead}>
              Anotado. Vou usar suas respostas pra ajustar os exemplos das aulas, principalmente
              a parte da instalação, que muda de acordo com o sistema.
              <br /><br />
              Agora falta <strong style={{ color: "#E8A33D" }}>uma coisa só</strong>: entrar no grupo.
              É por lá que chegam os links de cada aula. Quem não entra no grupo não recebe os links.
            </p>
            <a href={grupoUrl} style={S.btnWpp} target="_blank" rel="noopener noreferrer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Entrar no grupo do WhatsApp
            </a>
          </div>
        ) : (
          <>
            <img src="/logo-academy.png" alt="RedPro AI Academy" style={S.logo} />
            <div style={S.kicker}>Ficha de matrícula · Hermes Week 🌀</div>
            <h1 style={S.h1}>Antes da Aula 1, <span style={{ color: "#E8A33D" }}>me conta onde você está</span></h1>
            <p style={S.lead}>
              Leva menos de 2 minutos. Não é formulário de cadastro: é com isso que eu ajusto a
              instalação, os exemplos e o ritmo das cinco aulas. Quanto mais honesto, melhor a
              semana funciona pra você.
            </p>

            <form onSubmit={submit} style={S.form} aria-describedby="hw-aviso-obrig">
              <p id="hw-aviso-obrig" style={S.obrig}>Campos com <strong>*</strong> são obrigatórios.</p>
              <div style={S.secTit}>Seus dados</div>

              <Field label="Seu nome" req>
                <input style={S.input} required autoComplete="name" value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Como você quer ser chamado" />
              </Field>

              <Field label="O e-mail que você usou na compra" req>
                <input style={S.input} required autoComplete="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="voce@email.com" />
              </Field>

              <Field label="WhatsApp (com DDD)" req>
                <div style={{ display: "flex", gap: 8 }}>
                  <select style={{ ...S.select, width: 124 }} aria-label="País do WhatsApp (DDI)" value={form.ddi} onChange={(e) => set("ddi", e.target.value)}>
                    {DDIS.map((d) => (<option key={d.code} value={d.code}>{d.label}</option>))}
                  </select>
                  <input style={{ ...S.input, flex: 1, minWidth: 0 }} required aria-label="Número de WhatsApp com DDD" autoComplete="tel-national" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="(61) 99999-9999" inputMode="tel" />
                </div>
              </Field>

              <Field label="O que você faz?">
                <input style={S.input} value={form.profissao} onChange={(e) => set("profissao", e.target.value)} placeholder="Ex: analista de TI numa transportadora · consultor de automação · dono de clínica" />
              </Field>

              <div style={S.secTit}>Sua máquina</div>

              <Field label="Onde o agente vai rodar?" req>
                <select style={S.select} required value={form.sistema} onChange={(e) => set("sistema", e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="windows">Windows</option>
                  <option value="mac">macOS</option>
                  <option value="linux">Linux</option>
                  <option value="outro">Outro, ou ainda não decidi</option>
                </select>
              </Field>

              <Field label="Quanto você gasta por mês com IA hoje?">
                <select style={S.select} value={form.gasto_mes} onChange={(e) => set("gasto_mes", e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="nada">Nada ainda</option>
                  <option value="ate_120">Até R$ 120, uma assinatura</option>
                  <option value="120_400">Entre R$ 120 e R$ 400</option>
                  <option value="400_1000">Entre R$ 400 e R$ 1.000</option>
                  <option value="mais_1000">Mais de R$ 1.000</option>
                  <option value="token_sem_saber">Pago por token e não sei quanto dá no fim do mês</option>
                </select>
              </Field>

              <div style={S.secTit}>Onde você está</div>

              <Field label="O que você já tentou antes?" req>
                <select style={S.select} required value={form.ja_tentou} onChange={(e) => set("ja_tentou", e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="nunca">Nunca montei um agente</option>
                  <option value="openclaw">Já mexi com OpenClaw</option>
                  <option value="hermes">Já mexi com Hermes</option>
                  <option value="claude_code">Já mexi com Claude Code, Codex ou Antigravity</option>
                  <option value="nocode">Já mexi com n8n ou outro no-code</option>
                </select>
              </Field>

              <Field label="E onde você empacou?" req>
                <select style={S.select} required value={form.onde_travou} onChange={(e) => set("onde_travou", e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="instalacao">Na instalação, nunca saiu do lugar</option>
                  <option value="parou">Funcionou, depois parou e eu não soube por quê</option>
                  <option value="custo">Parei pelo custo, gastava token demais</option>
                  <option value="sem_uso">Subiu, mas eu não soube o que fazer com ele</option>
                  <option value="nao_empacou">Ainda não empaquei em nada</option>
                </select>
              </Field>

              <Field label="Quanto tempo por semana você perde na tarefa que quer automatizar?">
                <select style={S.select} value={form.tempo_perdido} onChange={(e) => set("tempo_perdido", e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="ate_1h">Até 1 hora</option>
                  <option value="1_3h">De 1 a 3 horas</option>
                  <option value="3_8h">De 3 a 8 horas</option>
                  <option value="mais_8h">Mais de 8 horas</option>
                  <option value="nao_medi">Nunca medi</option>
                </select>
              </Field>

              <Field label="O que você quer que ele faça por você?" req>
                <textarea style={S.textarea} rows={4} required minLength={4} value={form.o_que_quer} onChange={(e) => set("o_que_quer", e.target.value)} placeholder="Uma tarefa concreta, do seu dia. Ex: separar o que importa dos meus e-mails toda manhã e me mandar no Telegram." />
              </Field>

              <div role="status" aria-live="polite" style={aviso ? S.aviso : S.avisoVazio}>{aviso}</div>
              <button type="submit" disabled={sending} aria-disabled={sending} style={{ ...S.btn, opacity: sending ? 0.7 : 1 }}>
                {sending ? "Enviando..." : "Confirmar matrícula"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

function Field({ label, children, req }: { label: string; children: React.ReactNode; req?: boolean }) {
  return (
    <label style={S.field}>
      <span style={S.fieldLabel}>{label}{req && <span style={{ color: "#E8A33D" }} aria-hidden="true"> *</span>}{req && <span style={S.somenteLeitor}> (obrigatório)</span>}</span>
      {children}
    </label>
  );
}

/* Acessibilidade (26/10/2026): um aluno com deficiência visual não achava os campos (borda 1,1:1 no fundo).
   Campos com borda clara (>= 3:1), foco visível, seta nos seletores, placeholder legível. */
const SETA = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23F5F5F5' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")";
const CSS = `
.hw-ficha input:focus-visible, .hw-ficha select:focus-visible, .hw-ficha textarea:focus-visible, .hw-ficha button:focus-visible, .hw-ficha a:focus-visible { outline: 3px solid #E8A33D; outline-offset: 3px; }
.hw-ficha input::placeholder, .hw-ficha textarea::placeholder { color: #A8A8A8; opacity: 1; }
.hw-ficha input:invalid:not(:placeholder-shown), .hw-ficha textarea:invalid:not(:placeholder-shown) { border-color: #FF8A80; }
.hw-ficha button:not(:disabled):hover { filter: brightness(1.08); }
`;
const CAMPO = { background: "#1C1C1C", border: "2px solid #9A9A9A", borderRadius: 10, padding: "14px 16px", color: "#FFFFFF", fontSize: 16, fontFamily: "inherit" } as const;

// Paleta âmbar da Hermes Week (#E8A33D), a mesma de /hermes-week/obrigado.
const S: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh", background: "#0A0A0C", color: "#F5F5F5", fontFamily: "'JetBrains Mono', ui-monospace, monospace", padding: "48px 20px", display: "flex", justifyContent: "center" },
  wrap: { maxWidth: 560, width: "100%" },
  kicker: { fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E8A33D", marginBottom: 18 },
  h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 900, fontSize: "clamp(28px, 5vw, 42px)", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 12 },
  lead: { color: "#D0D0D0", fontSize: 17, lineHeight: 1.6, marginBottom: 36 },
  form: { display: "flex", flexDirection: "column", gap: 20 },
  secTit: { fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9C9C9", marginTop: 12, paddingBottom: 6, borderBottom: "2px solid #6F6F6F" },
  obrig: { fontSize: 14, color: "#C9C9C9", margin: 0 },
  aviso: { background: "#3A1414", border: "2px solid #FF8A80", color: "#FFFFFF", borderRadius: 10, padding: "12px 14px", fontSize: 15, lineHeight: 1.5 },
  avisoVazio: { minHeight: 0 },
  somenteLeitor: { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  fieldLabel: { fontSize: 16, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.4 },
  input: { ...CAMPO },
  select: { ...CAMPO, appearance: "none", WebkitAppearance: "none", backgroundImage: SETA, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 44 },
  textarea: { ...CAMPO, resize: "vertical", minHeight: 96 },
  btn: { background: "#E8A33D", color: "#0A0A0C", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 17, padding: "17px", borderRadius: 10, border: "none", marginTop: 8 },
  doneBox: { textAlign: "center", paddingTop: 40 },
  logo: { height: 204, display: "block", margin: "0 auto 26px" },
  logoDone: { height: 40, display: "block", margin: "0 auto 28px" },
  check: { width: 72, height: 72, margin: "0 auto 24px", borderRadius: "50%", background: "rgba(74,222,128,.12)", border: "2px solid #4ADE80", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: "#4ADE80" },
  btnWpp: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#25D366", color: "#0a0a0a", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 17, padding: "16px 30px", borderRadius: 12, textDecoration: "none", marginTop: 34, boxShadow: "0 8px 30px rgba(37,211,102,.28)" },
};

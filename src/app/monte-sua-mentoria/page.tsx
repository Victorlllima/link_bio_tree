"use client";

import { useState, useRef } from "react";

// CATÁLOGO SELF-SERVICE — o visitante marca os módulos que quer aprender, o total soma
// em tempo real e ele envia um pedido. O Red recebe por e-mail (Resend) + Telegram e
// entra em contato pra fechar. Venda de módulos avulsos reais.
//
// Título de cada módulo = o PROBLEMA que ele resolve (não a ferramenta).
// Soma de todos os 12 = R$ 2.997 (conferido).

type Modulo = { id: string; titulo: string; itens: string[]; preco: number };
type Secao = { nome: string; modulos: Modulo[] };

const SECOES: Secao[] = [
  {
    nome: "Fundação",
    modulos: [
      {
        id: "m01",
        titulo: "Entender onde está o dinheiro com IA e montar minha base",
        itens: [
          "Mapa do mercado e onde as empresas pagam",
          "Montar meu ambiente de trabalho do zero",
          "Sair do 'não sei por onde começar'",
        ],
        preco: 197,
      },
      {
        id: "m02",
        titulo: "Ter minha própria equipe de IA construindo pra mim",
        itens: [
          "Uma equipe que trabalha sozinha",
          "Dar ordens em português, sem código",
          "Do zero a um projeto completo",
        ],
        preco: 247,
      },
      {
        id: "m03",
        titulo: "Comandar a equipe pra fazer o trabalho complexo sozinha",
        itens: [
          "Automatizar tarefas e relatórios repetidos",
          "Resolver problemas dentro de sistemas que já uso",
          "Conectar ferramentas que não se falam",
        ],
        preco: 247,
      },
    ],
  },
  {
    nome: "Colocar no ar",
    modulos: [
      {
        id: "m04",
        titulo: "Construir um sistema e colocar no ar pra um cliente",
        itens: [
          "Um app ou site do zero",
          "Guardar os dados com segurança",
          "Publicar na internet com link",
        ],
        preco: 407,
      },
      {
        id: "m05",
        titulo: "Manter o que construí rodando sem quebrar",
        itens: [
          "Sistema que não cai",
          "Ser avisado quando dá problema",
          "Uma equipe que cuida sozinha",
        ],
        preco: 197,
      },
    ],
  },
  {
    nome: "O arsenal que você vende",
    modulos: [
      {
        id: "m06",
        titulo: "Um atendente de IA no WhatsApp que responde e agenda sozinho",
        itens: [
          "Responde cliente 24 horas",
          "Qualifica e marca na agenda",
          "Sem contratar ninguém",
        ],
        preco: 447,
      },
      {
        id: "m07",
        titulo: "Um atendente de voz que fala com o cliente por telefone",
        itens: [
          "Voz natural em tempo real",
          "Atende a ligação sozinho",
          "Marca compromisso na agenda",
        ],
        preco: 297,
      },
      {
        id: "m08",
        titulo: "Criar imagens profissionais da minha marca ou do cliente",
        itens: [
          "Qualidade de estúdio",
          "Minha cara e marca sempre iguais",
          "Sem contratar fotógrafo",
        ],
        preco: 197,
      },
      {
        id: "m09",
        titulo: "Clonar minha voz e criar um avatar que fala por mim",
        itens: [
          "Minha voz clonada",
          "Um avatar que apresenta",
          "Gravar conteúdo sem aparecer",
        ],
        preco: 197,
      },
      {
        id: "m10",
        titulo: "Produzir vídeos e anúncios sem gravar nem editar na mão",
        itens: [
          "Do roteiro ao vídeo pronto",
          "Reels e anúncios",
          "Sem estúdio e sem edição manual",
        ],
        preco: 197,
      },
    ],
  },
  {
    nome: "Transformar em renda",
    modulos: [
      {
        id: "m11",
        titulo: "Empacotar tudo isso num serviço e saber quanto cobrar",
        itens: [
          "Escolher o nicho certo",
          "Montar a oferta",
          "Precificar sem medo de errar",
        ],
        preco: 147,
      },
      {
        id: "m12",
        titulo: "Achar cliente, fechar a venda e virar renda recorrente",
        itens: [
          "Como prospectar de verdade",
          "Conduzir e fechar a venda",
          "Cliente que paga todo mês",
        ],
        preco: 220,
      },
    ],
  },
];

const TODOS = SECOES.flatMap((s) => s.modulos);
const TOTAL_CHEIO = TODOS.reduce((acc, m) => acc + m.preco, 0); // 2997

const fmt = (n: number) => n.toLocaleString("pt-BR");

type Form = { nome: string; email: string; ddi: string; whatsapp: string; sugestao: string };
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
const INITIAL: Form = { nome: "", email: "", ddi: "+55", whatsapp: "", sugestao: "" };

export default function MonteSuaMentoriaPage() {
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<Form>(INITIAL);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const toggle = (id: string) => setSel((s) => ({ ...s, [id]: !s[id] }));

  const escolhidos = TODOS.filter((m) => sel[m.id]);
  const total = escolhidos.reduce((acc, m) => acc + m.preco, 0);
  const qtd = escolhidos.length;
  const tudoMarcado = qtd === TODOS.length;

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const validoForm = form.nome.trim().length >= 2 && emailOk && form.whatsapp.trim().length >= 6;

  function irProFormulario() {
    if (qtd === 0) return;
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validoForm || qtd === 0 || sending) return;
    setSending(true);
    try {
      const payload = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        whatsapp: `${form.ddi} ${form.whatsapp}`.trim(),
        modulos: escolhidos.map((m) => m.titulo),
        modulos_ids: escolhidos.map((m) => m.id),
        total,
        sugestao: form.sugestao.trim(),
      };
      await fetch("/api/monte-sua-mentoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setDone(true);
    } catch {
      setDone(true); // não trava o lead; a notificação é interna
    }
    setSending(false);
  }

  if (done) {
    return (
      <div style={S.root}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <div style={S.doneWrap}>
          <img src="/logo-academy.png" alt="RedPro AI Academy" style={S.logoDone} />
          <div style={S.check}>✓</div>
          <h1 style={S.h1}>Pedido recebido.</h1>
          <p style={S.lead}>
            Recebi sua seleção — <strong style={{ color: "#F97316" }}>{qtd} {qtd === 1 ? "módulo" : "módulos"}</strong>, total de <strong style={{ color: "#F97316" }}>R$ {fmt(total)}</strong>.
            <br /><br />
            Eu mesmo entro em contato pelo seu WhatsApp pra alinhar os detalhes e liberar seu acesso. Fica de olho.
          </p>
          <div style={S.resumoDone}>
            {escolhidos.map((m) => (
              <div key={m.id} style={S.resumoDoneItem}>
                <span style={{ color: "#4ADE80", flexShrink: 0 }}>✓</span>
                <span style={{ flex: 1 }}>{m.titulo}</span>
                <span style={S.mono}>R$ {fmt(m.preco)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.root}>
      {/* Fontes Academy — a página é client component e não herda os <link> das páginas HTML */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
        rel="stylesheet"
      />

      {/* GLOW de fundo */}
      <div style={S.glow} aria-hidden="true" />

      <div style={S.wrap}>
        {/* HERO */}
        <header style={S.hero}>
          <img src="/logo-academy.png" alt="RedPro AI Academy" style={S.logo} />
          <div style={S.eyebrow}>Monte sua mentoria · módulos avulsos</div>
          <h1 style={S.h1}>
            Escolha só o que você <span style={{ color: "#F97316" }}>precisa aprender</span>
          </h1>
          <p style={S.lead}>
            Marque os módulos que fazem sentido pra você. O preço soma na hora. No fim, deixa seu
            contato — eu entro em contato pra liberar seu acesso.
          </p>
          <p style={S.leadMono}>
            {TODOS.length} módulos · leve tudo por <strong style={{ color: "#F5F5F5" }}>R$ {fmt(TOTAL_CHEIO)}</strong>
          </p>
        </header>

        {/* CATÁLOGO */}
        <main style={S.catalogo}>
          {SECOES.map((secao) => (
            <section key={secao.nome} style={S.secao}>
              <div style={S.secaoTit}>{secao.nome}</div>
              <div style={S.cards}>
                {secao.modulos.map((m) => {
                  const on = !!sel[m.id];
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggle(m.id)}
                      style={{ ...S.card, ...(on ? S.cardOn : null) }}
                      aria-pressed={on}
                    >
                      <span style={{ ...S.checkbox, ...(on ? S.checkboxOn : null) }}>
                        {on ? "✓" : ""}
                      </span>
                      <span style={S.cardBody}>
                        <span style={{ ...S.cardTitulo, ...(on ? { color: "#F5F5F5" } : null) }}>
                          {m.titulo}
                        </span>
                        <span style={S.itens}>
                          {m.itens.map((it, i) => (
                            <span key={i} style={S.item}>
                              <span style={S.itemDot}>—</span> {it}
                            </span>
                          ))}
                        </span>
                      </span>
                      <span style={{ ...S.preco, ...(on ? { color: "#F97316" } : null) }}>
                        <span style={S.precoCifra}>R$</span> {fmt(m.preco)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </main>

        {/* FORMULÁRIO */}
        <div ref={formRef} style={S.formSection}>
          {qtd === 0 ? (
            <div style={S.formVazio}>
              <p style={S.formVazioTxt}>
                Marque pelo menos um módulo acima pra liberar seu pedido.
              </p>
            </div>
          ) : (
            <>
              <div style={S.secaoTit}>Seu contato</div>
              <p style={S.formIntro}>
                Você selecionou <strong style={{ color: "#F97316" }}>{qtd} {qtd === 1 ? "módulo" : "módulos"}</strong> · total <strong style={{ color: "#F97316" }}>R$ {fmt(total)}</strong>. Deixa seus dados e eu entro em contato.
              </p>
              <form onSubmit={submit} style={S.form}>
                <label style={S.field}>
                  <span style={S.fieldLabel}>Seu nome</span>
                  <input style={S.input} value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Felipe Silva" />
                </label>
                <label style={S.field}>
                  <span style={S.fieldLabel}>Seu melhor e-mail</span>
                  <input style={S.input} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="voce@email.com" />
                </label>
                <label style={S.field}>
                  <span style={S.fieldLabel}>WhatsApp (com DDD)</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <select style={{ ...S.select, width: 118, flexShrink: 0 }} value={form.ddi} onChange={(e) => set("ddi", e.target.value)}>
                      {DDIS.map((d) => (<option key={d.code} value={d.code}>{d.label}</option>))}
                    </select>
                    <input style={{ ...S.input, flex: 1 }} value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="(61) 99999-9999" inputMode="tel" />
                  </div>
                </label>
                <label style={S.field}>
                  <span style={S.fieldLabel}>Quer aprender algo que não está aqui? <span style={{ color: "#8A8A8A", fontWeight: 400 }}>(opcional)</span></span>
                  <textarea
                    style={{ ...S.input, minHeight: 88, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }}
                    value={form.sugestao}
                    onChange={(e) => set("sugestao", e.target.value)}
                    placeholder="Ex: quero um agente que responde e-mail sozinho, integração com meu ERP, um site de agendamento…"
                  />
                </label>
                <button
                  type="submit"
                  disabled={!validoForm || sending}
                  style={{ ...S.btn, opacity: validoForm && !sending ? 1 : 0.5, cursor: validoForm && !sending ? "pointer" : "not-allowed" }}
                >
                  {sending ? "Enviando…" : `Enviar meu pedido — R$ ${fmt(total)}`}
                </button>
              </form>
            </>
          )}
        </div>

        <footer style={S.foot}>RedPro AI Academy · Monte sua mentoria</footer>
      </div>

      {/* CARRINHO STICKY */}
      <div style={{ ...S.cart, ...(qtd > 0 ? S.cartOn : S.cartOff) }}>
        <div style={S.cartInner}>
          <div style={S.cartInfo}>
            <div style={S.cartQtd}>
              {qtd} {qtd === 1 ? "módulo" : "módulos"}{tudoMarcado ? " · tudo" : ""}
            </div>
            <div style={S.cartTotal}>
              <span style={S.cartCifra}>R$</span> {fmt(total)}
            </div>
          </div>
          <button
            type="button"
            onClick={irProFormulario}
            disabled={qtd === 0}
            style={{ ...S.cartBtn, opacity: qtd > 0 ? 1 : 0.5, cursor: qtd > 0 ? "pointer" : "not-allowed" }}
          >
            Finalizar →
          </button>
        </div>
      </div>
    </div>
  );
}

const FONTS =
  "'Bricolage Grotesque', system-ui, -apple-system, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const S: Record<string, React.CSSProperties> = {
  root: {
    position: "relative",
    minHeight: "100vh",
    background: "#080808",
    color: "#F5F5F5",
    fontFamily: FONTS,
    padding: "44px 20px 140px",
    display: "flex",
    justifyContent: "center",
    WebkitFontSmoothing: "antialiased",
    overflowX: "hidden",
  },
  glow: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "min(900px, 120vw)",
    height: 520,
    background: "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,.16), transparent 62%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  wrap: { position: "relative", zIndex: 1, maxWidth: 660, width: "100%" },

  // HERO
  hero: { textAlign: "center", paddingBottom: 20 },
  logo: { height: 168, display: "block", margin: "0 auto 22px" },
  eyebrow: {
    display: "inline-block",
    fontFamily: MONO,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#F97316",
    border: "1px solid rgba(249,115,22,.35)",
    borderRadius: 30,
    padding: "7px 16px",
    marginBottom: 22,
  },
  h1: {
    fontWeight: 900,
    fontSize: "clamp(30px, 6vw, 50px)",
    lineHeight: 1.03,
    letterSpacing: "-0.03em",
    marginBottom: 16,
  },
  lead: { color: "#B8B8B8", fontSize: 16.5, lineHeight: 1.6, maxWidth: 520, margin: "0 auto 14px" },
  leadMono: { fontFamily: MONO, fontSize: 13, color: "#8A8A8A", letterSpacing: "0.02em" },

  // CATÁLOGO
  catalogo: { marginTop: 34, display: "flex", flexDirection: "column", gap: 34 },
  secao: { display: "flex", flexDirection: "column", gap: 14 },
  secaoTit: {
    fontFamily: MONO,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#F97316",
    paddingBottom: 8,
    borderBottom: "1px solid #1F1F1F",
  },
  cards: { display: "flex", flexDirection: "column", gap: 12 },
  card: {
    display: "flex",
    gap: 14,
    alignItems: "flex-start",
    textAlign: "left",
    width: "100%",
    background: "#141414",
    border: "1px solid #1F1F1F",
    borderRadius: 14,
    padding: "18px 18px",
    color: "#F5F5F5",
    fontFamily: FONTS,
    transition: "border-color .15s, box-shadow .15s, background .15s",
  },
  cardOn: {
    border: "1px solid rgba(249,115,22,.55)",
    background: "#161006",
    boxShadow: "0 0 0 1px rgba(249,115,22,.25), 0 8px 30px rgba(249,115,22,.1)",
  },
  checkbox: {
    width: 26,
    height: 26,
    flexShrink: 0,
    borderRadius: 7,
    border: "1.5px solid #333",
    background: "#0d0d0d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    fontWeight: 900,
    color: "#080808",
    marginTop: 2,
    transition: "background .15s, border-color .15s",
  },
  checkboxOn: { background: "#F97316", borderColor: "#F97316", color: "#080808" },
  cardBody: { display: "flex", flexDirection: "column", gap: 10, flex: 1, minWidth: 0 },
  cardTitulo: { fontSize: 16.5, fontWeight: 800, lineHeight: 1.25, color: "#E8E8E8", letterSpacing: "-0.01em" },
  itens: { display: "flex", flexDirection: "column", gap: 4 },
  item: { fontSize: 13.5, color: "#8A8A8A", lineHeight: 1.4 },
  itemDot: { color: "#F97316", marginRight: 2 },
  preco: {
    fontFamily: MONO,
    fontSize: 17,
    fontWeight: 700,
    color: "#B8B8B8",
    whiteSpace: "nowrap",
    flexShrink: 0,
    marginTop: 2,
  },
  precoCifra: { fontSize: 12, verticalAlign: "top" },

  // FORM
  formSection: { marginTop: 40, display: "flex", flexDirection: "column", gap: 16, scrollMarginTop: 20 },
  formVazio: {
    background: "#111111",
    border: "1px dashed #1F1F1F",
    borderRadius: 14,
    padding: "28px 22px",
    textAlign: "center",
  },
  formVazioTxt: { color: "#8A8A8A", fontSize: 15, fontFamily: MONO },
  formIntro: { color: "#B8B8B8", fontSize: 15, lineHeight: 1.55 },
  form: { display: "flex", flexDirection: "column", gap: 18, marginTop: 4 },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  fieldLabel: { fontSize: 14, fontWeight: 500, color: "#F5F5F5" },
  input: {
    background: "#141414",
    border: "1px solid #1F1F1F",
    borderRadius: 10,
    padding: "13px 15px",
    color: "#F5F5F5",
    fontSize: 15,
    fontFamily: MONO,
    outline: "none",
  },
  select: {
    background: "#141414",
    border: "1px solid #1F1F1F",
    borderRadius: 10,
    padding: "13px 15px",
    color: "#F5F5F5",
    fontSize: 15,
    fontFamily: MONO,
    outline: "none",
    appearance: "none",
  },
  btn: {
    background: "#F97316",
    color: "#080808",
    fontFamily: FONTS,
    fontWeight: 800,
    fontSize: 17,
    padding: "17px",
    borderRadius: 12,
    border: "none",
    marginTop: 6,
    boxShadow: "0 8px 30px rgba(249,115,22,.28)",
  },

  // CARRINHO STICKY
  cart: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    display: "flex",
    justifyContent: "center",
    padding: "12px 16px calc(12px + env(safe-area-inset-bottom, 0px))",
    background: "rgba(8,8,8,0.82)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderTop: "1px solid #1F1F1F",
    transition: "transform .28s ease, opacity .28s ease",
  },
  cartOn: { transform: "translateY(0)", opacity: 1 },
  cartOff: { transform: "translateY(120%)", opacity: 0, pointerEvents: "none" },
  cartInner: {
    width: "100%",
    maxWidth: 660,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  cartInfo: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0 },
  cartQtd: { fontFamily: MONO, fontSize: 11.5, color: "#8A8A8A", letterSpacing: "0.06em", textTransform: "uppercase" },
  cartTotal: { fontFamily: FONTS, fontWeight: 900, fontSize: 26, letterSpacing: "-0.02em", color: "#F5F5F5", lineHeight: 1 },
  cartCifra: { fontSize: 15, color: "#F97316", verticalAlign: "super", fontWeight: 800 },
  cartBtn: {
    background: "#F97316",
    color: "#080808",
    fontFamily: FONTS,
    fontWeight: 800,
    fontSize: 16,
    padding: "14px 26px",
    borderRadius: 11,
    border: "none",
    whiteSpace: "nowrap",
    boxShadow: "0 8px 26px rgba(249,115,22,.32)",
  },

  // DONE
  doneWrap: { position: "relative", zIndex: 1, maxWidth: 560, width: "100%", textAlign: "center", paddingTop: 24 },
  logoDone: { height: 40, display: "block", margin: "0 auto 28px" },
  check: {
    width: 72,
    height: 72,
    margin: "0 auto 24px",
    borderRadius: "50%",
    background: "rgba(74,222,128,.12)",
    border: "2px solid #4ADE80",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 36,
    color: "#4ADE80",
  },
  resumoDone: {
    marginTop: 30,
    textAlign: "left",
    background: "#111111",
    border: "1px solid #1F1F1F",
    borderRadius: 14,
    padding: "8px 18px",
    display: "flex",
    flexDirection: "column",
  },
  resumoDoneItem: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: "13px 0",
    borderBottom: "1px solid #191919",
    fontSize: 14.5,
    color: "#B8B8B8",
  },
  mono: { fontFamily: MONO, fontSize: 14, color: "#8A8A8A", whiteSpace: "nowrap" },

  foot: {
    textAlign: "center",
    marginTop: 48,
    paddingTop: 28,
    borderTop: "1px solid #1F1F1F",
    color: "#8A8A8A",
    fontSize: 12,
    fontFamily: MONO,
    letterSpacing: "0.04em",
  },
};

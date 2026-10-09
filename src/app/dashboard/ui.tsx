"use client";

import { useState, type ReactNode } from "react";
import { Info, AlertTriangle, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { REGUAS, avaliar, type Cor, type Regua } from "./metas";
import type { Leitura } from "./tipos";

// ---------- formatação ----------
export const fN = (n: number | null | undefined, casas = 0) =>
  n === null || n === undefined || !Number.isFinite(n)
    ? "—"
    : n.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
export const fR = (n: number | null | undefined, casas = 2) => (n === null || n === undefined || !Number.isFinite(n) ? "—" : `R$ ${fN(n, casas)}`);
export const fP = (n: number | null | undefined, casas = 1) => (n === null || n === undefined || !Number.isFinite(n) ? "—" : `${fN(n, casas)}%`);
export const fX = (n: number | null | undefined) => (n === null || n === undefined || !Number.isFinite(n) ? "—" : `${fN(n, 2)}x`);

export function fmtRegua(r: Regua, v: number | null | undefined) {
  if (r.unidade === "R$") return fR(v);
  if (r.unidade === "%") return fP(v);
  if (r.unidade === "x") return fX(v);
  if (r.unidade === "min") return v === null || v === undefined ? "—" : `${fN(v)} min`;
  return fN(v);
}
function fmtLimite(r: Regua, v: number) {
  if (r.unidade === "R$") return `R$${fN(v, v % 1 ? 2 : 0)}`;
  if (r.unidade === "%") return `${fN(v, v % 1 ? 1 : 0)}%`;
  if (r.unidade === "x") return `${fN(v, 2)}x`;
  return fN(v);
}
export function metaTexto(r: Regua) {
  const p: string[] = [];
  if (r.maiorMelhor) {
    if (r.min !== undefined) p.push(`mín ${fmtLimite(r, r.min)}`);
    if (r.ideal !== undefined) p.push(`meta ${fmtLimite(r, r.ideal)}`);
  } else {
    if (r.ideal !== undefined) p.push(`ideal ≤ ${fmtLimite(r, r.ideal)}`);
    if (r.max !== undefined) p.push(`teto ${fmtLimite(r, r.max)}`);
  }
  return p.join(" · ");
}

const ORIGEM = { tabari: "Tabari", squad: "Squad Turbo", red: "Decisão do Red" };

// ---------- ponto de semáforo ----------
export function Ponto({ cor }: { cor: Cor }) {
  return <span className={`pontinho ${cor}`} />;
}

// ---------- KPI ----------
export function Kpi({
  icone,
  tom = "menta",
  rotulo,
  valor,
  sub,
  regua,
  valorNum,
  spark,
}: {
  icone: ReactNode;
  tom?: "menta" | "azul" | "ambar" | "verm" | "roxo";
  rotulo: string;
  valor: string;
  sub?: ReactNode;
  regua?: string;
  valorNum?: number | null;
  spark?: number[];
}) {
  const r = regua ? REGUAS[regua] : undefined;
  const cor = r ? avaliar(r, valorNum) : "neutro";
  const [aberto, setAberto] = useState(false);
  return (
    <div className="card kpi">
      <div className={`kpi-ico bg-${tom}`}>{icone}</div>
      {spark && spark.length > 1 ? <Spark valores={spark} tom={tom} /> : r ? <span className="ponto"><Ponto cor={cor} /></span> : null}
      <div className="kpi-rot">
        {rotulo}
        {r && (
          <button className="info-btn" onClick={() => setAberto(!aberto)} aria-label="Ver a régua">
            <Info size={13} />
          </button>
        )}
      </div>
      <div className={`kpi-val num ${r ? `cor-${cor}` : ""}`}>{valor}</div>
      <div className="kpi-sub">
        {sub}
        {r && !aberto && <div>{metaTexto(r)}</div>}
      </div>
      {r && aberto && <ReguaDica r={r} />}
    </div>
  );
}

export function ReguaDica({ r }: { r: Regua }) {
  return (
    <div className="dica">
      <b>{metaTexto(r)}</b> · {r.texto}
      <div style={{ marginTop: 4, color: "var(--grayLight)" }}>
        {ORIGEM[r.origem]} · {r.fonte}
      </div>
    </div>
  );
}

// ---------- linha de régua (meta vs realizado) ----------
export function LinhaRegua({ chave, valor, sub, nome }: { chave: string; valor: number | null | undefined; sub?: ReactNode; nome?: string }) {
  const r = REGUAS[chave];
  const cor = avaliar(r, valor);
  const [aberto, setAberto] = useState(false);
  // escala do trilho: até 1,5x a meta (ou o teto, quando menor é melhor)
  const alvo = r.maiorMelhor ? (r.ideal ?? r.min ?? 1) : (r.max ?? r.ideal ?? 1);
  const escala = alvo * 1.5;
  const w = valor === null || valor === undefined ? 0 : Math.min(100, (valor / escala) * 100);
  const corBarra = cor === "verde" ? "var(--menta)" : cor === "amarelo" ? "var(--ambar)" : cor === "vermelho" ? "var(--verm)" : "var(--grayLight)";
  return (
    <div className="regua-linha">
      <div className="regua-top">
        <div className="regua-nome">
          <Ponto cor={cor} />
          {nome || r.nome}
          <button className="info-btn" onClick={() => setAberto(!aberto)} aria-label="Ver a régua">
            <Info size={13} />
          </button>
        </div>
        <div className={`regua-val num cor-${cor}`}>{fmtRegua(r, valor)}</div>
      </div>
      <div className="trilho">
        <i style={{ width: `${w}%`, background: corBarra }} />
        <span className="marca-meta" style={{ left: `${(alvo / escala) * 100}%` }} />
      </div>
      <div className="regua-pe">
        <span>{sub}</span>
        <span>{metaTexto(r)}</span>
      </div>
      {aberto && <ReguaDica r={r} />}
    </div>
  );
}

// ---------- bloco ----------
export function Bloco({ titulo, sub, acao, children, className = "" }: { titulo: string; sub?: string; acao?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`card ${className}`}>
      <div className="bloco-cab">
        <div>
          <h3>{titulo}</h3>
          {sub && <p>{sub}</p>}
        </div>
        {acao}
      </div>
      <div className="bloco-corpo">{children}</div>
    </div>
  );
}

// ---------- alerta ----------
const NIVEL = {
  ruim: { rot: "Problema", cls: "verm", ico: XCircle },
  atencao: { rot: "Atenção", cls: "ambar", ico: AlertTriangle },
  bom: { rot: "Bom", cls: "menta", ico: CheckCircle2 },
  info: { rot: "Leitura", cls: "azul", ico: Lightbulb },
};
export function Alerta({ a }: { a: Leitura }) {
  const n = NIVEL[a.nivel];
  const Ico = n.ico;
  return (
    <div className="alerta">
      <div className={`ico bg-${n.cls}`}>
        <Ico size={17} />
      </div>
      <div>
        <div className={`tipo t-${n.cls}`}>
          {n.rot} · {a.area}
        </div>
        <h4>{a.titulo}</h4>
        <p>{a.texto}</p>
        {a.acao && <div className="acao">→ {a.acao}</div>}
      </div>
    </div>
  );
}

// ---------- funil ----------
export function Funil({ etapas }: { etapas: { nome: string; valor: number | null; sub?: string; regua?: string; taxa?: number | null }[] }) {
  const max = Math.max(1, ...etapas.map((e) => e.valor || 0));
  return (
    <div className="funil">
      {etapas.map((e, i) => (
        <div key={e.nome}>
          {i > 0 && (
            <div className="passagem">
              ↓ {e.taxa !== undefined && e.taxa !== null ? fP(e.taxa) : "—"} passam
              {e.regua && <Ponto cor={avaliar(REGUAS[e.regua], e.taxa)} />}
              {e.regua && <span style={{ color: "var(--grayLight)" }}>({metaTexto(REGUAS[e.regua])})</span>}
            </div>
          )}
          <div className="etapaF">
            <i style={{ width: `${Math.max(2, ((e.valor || 0) / max) * 100)}%` }} />
            <div>
              <b>{e.nome}</b>
              {e.sub && <small>{e.sub}</small>}
            </div>
            <div className="dir">
              <b className="num">{e.valor === null ? "—" : fN(e.valor)}</b>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- gráficos SVG ----------
const COR_TOM: Record<string, string> = { menta: "#2EE6A6", azul: "#4A9BFF", ambar: "#F5A623", verm: "#FF5F52", roxo: "#A78BFA" };

export function Spark({ valores, tom = "menta" }: { valores: number[]; tom?: string }) {
  const w = 112,
    h = 42;
  const max = Math.max(...valores, 1);
  const pts = valores.map((v, i) => `${(i / (valores.length - 1)) * w},${h - (v / max) * (h - 4) - 2}`);
  const c = COR_TOM[tom] || COR_TOM.menta;
  const id = `sp${tom}${valores.length}`;
  return (
    <svg className="spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={c} stopOpacity="0.28" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts.join(" ")} ${w},${h}`} fill={`url(#${id})`} />
      <polyline points={pts.join(" ")} fill="none" stroke={c} strokeWidth="1.6" />
    </svg>
  );
}

export function Area({
  pontos,
  tom = "menta",
  fmt = (n: number) => fN(n),
  barras,
}: {
  pontos: { x: string; y: number }[];
  tom?: string;
  fmt?: (n: number) => string;
  barras?: { x: string; y: number }[];
}) {
  const [sel, setSel] = useState<number | null>(null);
  if (!pontos.length) return <div className="vazio">Sem dados no período.</div>;
  const W = 720,
    H = 220,
    pl = 52,
    pb = 24,
    pt = 10;
  const max = Math.max(...pontos.map((p) => p.y), ...(barras || []).map((b) => b.y), 1) * 1.1;
  const maxB = barras ? Math.max(...barras.map((b) => b.y), 1) * 1.15 : 1;
  const n = pontos.length;
  const X = (i: number) => pl + (n === 1 ? (W - pl) / 2 : (i / (n - 1)) * (W - pl - 6));
  const Y = (v: number) => pt + (H - pt - pb) * (1 - v / max);
  const YB = (v: number) => pt + (H - pt - pb) * (1 - v / maxB);
  const c = COR_TOM[tom] || COR_TOM.menta;
  const linha = pontos.map((p, i) => `${X(i)},${Y(p.y)}`).join(" ");
  const id = `ar${tom}`;
  const passo = Math.max(1, Math.ceil(n / 8));
  return (
    <svg className="graf" viewBox={`0 0 ${W} ${H}`} onMouseLeave={() => setSel(null)}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={c} stopOpacity="0.3" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line x1={pl} x2={W} y1={Y(max * f)} y2={Y(max * f)} stroke="rgba(255,255,255,.06)" />
          <text x={pl - 8} y={Y(max * f) + 3} textAnchor="end">
            {fmt(max * f)}
          </text>
        </g>
      ))}
      {barras?.map((b, i) => {
        const bw = Math.max(4, ((W - pl) / n) * 0.45);
        return <rect key={i} x={X(i) - bw / 2} y={YB(b.y)} width={bw} height={H - pb - YB(b.y)} rx="3" fill="#4A9BFF" opacity="0.55" />;
      })}
      <polygon points={`${X(0)},${H - pb} ${linha} ${X(n - 1)},${H - pb}`} fill={`url(#${id})`} />
      <polyline points={linha} fill="none" stroke={c} strokeWidth="2" />
      {pontos.map((p, i) => (
        <g key={i}>
          {i % passo === 0 && (
            <text x={X(i)} y={H - 6} textAnchor="middle">
              {p.x}
            </text>
          )}
          <rect x={X(i) - (W - pl) / n / 2} y={0} width={(W - pl) / n} height={H} fill="transparent" onMouseEnter={() => setSel(i)} />
        </g>
      ))}
      {sel !== null && (
        <g>
          <line x1={X(sel)} x2={X(sel)} y1={pt} y2={H - pb} stroke={c} strokeDasharray="3 3" opacity="0.6" />
          <circle cx={X(sel)} cy={Y(pontos[sel].y)} r="4" fill={c} />
          <rect x={Math.min(X(sel) + 8, W - 150)} y={pt} width="142" height={barras ? 46 : 32} rx="8" fill="#161D1A" stroke="rgba(255,255,255,.12)" />
          <text x={Math.min(X(sel) + 18, W - 140)} y={pt + 14} style={{ fill: "#8B968F" }}>
            {pontos[sel].x}
          </text>
          <text x={Math.min(X(sel) + 18, W - 140)} y={pt + 27} style={{ fill: "#E9EFEC", fontWeight: 700, fontSize: 11 }}>
            {fmt(pontos[sel].y)}
          </text>
          {barras && (
            <text x={Math.min(X(sel) + 18, W - 140)} y={pt + 40} style={{ fill: "#4A9BFF", fontSize: 11 }}>
              {fN(barras[sel]?.y)} ingressos
            </text>
          )}
        </g>
      )}
    </svg>
  );
}

export function Barras({ itens, tom = "menta", fmt = (n: number) => fN(n), destaque }: { itens: { x: string; y: number; meta?: number | null }[]; tom?: string; fmt?: (n: number) => string; destaque?: (i: number) => boolean }) {
  if (!itens.length) return <div className="vazio">Sem dados.</div>;
  const W = 720,
    H = 200,
    pb = 24,
    pt = 16;
  const max = Math.max(...itens.map((i) => Math.max(i.y, i.meta || 0)), 1) * 1.15;
  const bw = ((W - 10) / itens.length) * 0.6;
  const X = (i: number) => 5 + ((W - 10) / itens.length) * (i + 0.5);
  const Y = (v: number) => pt + (H - pt - pb) * (1 - v / max);
  const c = COR_TOM[tom] || COR_TOM.menta;
  return (
    <svg className="graf" viewBox={`0 0 ${W} ${H}`}>
      {itens.map((it, i) => (
        <g key={i}>
          <rect x={X(i) - bw / 2} y={Y(it.y)} width={bw} height={Math.max(0, H - pb - Y(it.y))} rx="4" fill={c} opacity={destaque && !destaque(i) ? 0.35 : 0.85} />
          {it.meta !== undefined && it.meta !== null && <line x1={X(i) - bw / 2 - 4} x2={X(i) + bw / 2 + 4} y1={Y(it.meta)} y2={Y(it.meta)} stroke="#E9EFEC" strokeWidth="2" strokeDasharray="4 3" opacity="0.7" />}
          <text x={X(i)} y={Y(it.y) - 5} textAnchor="middle" style={{ fill: "#E9EFEC", fontSize: 11 }}>
            {it.y ? fmt(it.y) : ""}
          </text>
          {(itens.length <= 14 || i % 2 === 0) && (
            <text x={X(i)} y={H - 6} textAnchor="middle">
              {it.x}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

export function Calor({ matriz }: { matriz: number[][] }) {
  const dias = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  const max = Math.max(1, ...matriz.flat());
  const cor = (v: number) => {
    if (!v) return "var(--elevado)";
    const t = v / max;
    return `rgba(46,230,166,${0.18 + t * 0.82})`;
  };
  return (
    <div>
      <div className="calor">
        <span />
        {Array.from({ length: 24 }, (_, h) => (
          <span key={h} style={{ textAlign: "center" }}>
            {h % 3 === 0 ? h : ""}
          </span>
        ))}
        {matriz.map((linha, d) => (
          <FragmentoLinha key={d} rot={dias[d]} linha={linha} cor={cor} />
        ))}
      </div>
      <div className="legenda">
        <span>
          menos <i style={{ background: "linear-gradient(90deg,#161D1A,#1b7a5c,#2EE6A6)", width: 80 }} /> mais vendas
        </span>
      </div>
    </div>
  );
}
function FragmentoLinha({ rot, linha, cor }: { rot: string; linha: number[]; cor: (v: number) => string }) {
  return (
    <>
      <span style={{ alignSelf: "center" }}>{rot}</span>
      {linha.map((v, h) => (
        <div key={h} className="c" title={`${rot} ${h}h: ${v} venda${v === 1 ? "" : "s"}`} style={{ background: cor(v) }} />
      ))}
    </>
  );
}

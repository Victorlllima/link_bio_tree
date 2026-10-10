"use client";

import { useState, type ReactNode } from "react";
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
    if (r.min !== undefined) p.push(`mínimo ${fmtLimite(r, r.min)}`);
    if (r.ideal !== undefined && r.ideal !== r.min) p.push(`meta ${fmtLimite(r, r.ideal)}`);
  } else {
    if (r.ideal !== undefined) p.push(`ideal até ${fmtLimite(r, r.ideal)}`);
    if (r.max !== undefined) p.push(`teto ${fmtLimite(r, r.max)}`);
  }
  return p.join(" · ");
}

const ORIGEM = { metodo: "Do método", squad: "Referência complementar", red: "Decisão do Red" };

export function Ponto({ cor }: { cor: Cor }) {
  return <i className={`dot ${cor}`} aria-hidden />;
}

export function ReguaDica({ r }: { r: Regua }) {
  return (
    <div className="dica">
      <b>{metaTexto(r) || "Sem número em nenhuma fonte"}</b> · {r.texto}
      <span className="fonte">
        {ORIGEM[r.origem]} · {r.fonte}
      </span>
    </div>
  );
}

// ---------- indicador ----------
export function Kpi({
  rotulo,
  valor,
  sub,
  regua,
  valorNum,
  spark,
  semCard,
}: {
  rotulo: string;
  valor: string;
  sub?: ReactNode;
  regua?: string;
  valorNum?: number | null;
  spark?: number[];
  semCard?: boolean;
}) {
  const r = regua ? REGUAS[regua] : undefined;
  const cor = r ? avaliar(r, valorNum) : "neutro";
  const [aberto, setAberto] = useState(false);
  const corpo = (
    <div className="stat">
      <div className="topo">
        <span className="rot">
          {rotulo}
          {r && (
            <button className="info-b" onClick={() => setAberto(!aberto)} aria-label={`Ver a régua de ${rotulo}`}>
              i
            </button>
          )}
        </span>
        {r && <Ponto cor={cor} />}
      </div>
      <div className={`v num ${r && cor !== "verde" ? `c-${cor}` : ""}`}>{valor}</div>
      <div className="s">
        {sub}
        {r && !aberto && <div className="meta-linha">{metaTexto(r)}</div>}
      </div>
      {spark && spark.length > 1 && <Spark valores={spark} />}
      {r && aberto && <ReguaDica r={r} />}
    </div>
  );
  return semCard ? corpo : <div className="card">{corpo}</div>;
}

// ---------- régua (meta x realizado) ----------
export function LinhaRegua({ chave, valor, sub, nome }: { chave: string; valor: number | null | undefined; sub?: ReactNode; nome?: string }) {
  const r = REGUAS[chave];
  const cor = avaliar(r, valor);
  const [aberto, setAberto] = useState(false);
  const alvo = r.maiorMelhor ? (r.ideal ?? r.min ?? 1) : (r.max ?? r.ideal ?? 1);
  const escala = alvo * 1.5;
  const w = valor === null || valor === undefined ? 0 : Math.max(0, Math.min(100, (valor / escala) * 100));
  const corBarra = cor === "verde" ? "var(--ok)" : cor === "amarelo" ? "var(--warn)" : cor === "vermelho" ? "var(--bad)" : "var(--ivory3)";
  return (
    <div className="regua">
      <div className="regua-top">
        <div className="regua-nome">
          <Ponto cor={cor} />
          {nome || r.nome}
          <button className="info-b" onClick={() => setAberto(!aberto)} aria-label={`Ver a régua de ${nome || r.nome}`}>
            i
          </button>
        </div>
        <div className={`regua-val num ${cor === "verde" ? "" : `c-${cor}`}`}>{fmtRegua(r, valor)}</div>
      </div>
      <div className="trilho">
        <i style={{ width: `${w}%`, background: corBarra }} />
        <b style={{ left: `${(alvo / escala) * 100}%` }} />
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

// ---------- leitura ----------
const NIVEL = { ruim: "Problema", atencao: "Atenção", bom: "Em ordem", info: "Observação" };
export function Alerta({ a }: { a: Leitura }) {
  return (
    <div className={`leit ${a.nivel}`}>
      <div className="tipo">
        {NIVEL[a.nivel]} · {a.area}
      </div>
      <h4>{a.titulo}</h4>
      <p>{a.texto}</p>
      {a.acao && <div className="acao">{a.acao}</div>}
    </div>
  );
}

// ---------- funil (livro-razão) ----------
export function Funil({ etapas }: { etapas: { nome: string; valor: number | null; sub?: string; regua?: string; taxa?: number | null }[] }) {
  const max = Math.max(1, ...etapas.map((e) => e.valor || 0));
  // escala logarítmica: com impressões na casa dos milhares e vendas na casa das dezenas,
  // a escala linear apagaria todas as etapas depois da primeira
  const larg = (v: number) => (v > 0 ? Math.max(2, (Math.log10(v + 1) / Math.log10(max + 1)) * 100) : 0);
  return (
    <div>
      {etapas.map((e, i) => (
        <div key={e.nome}>
          {i > 0 && e.taxa !== undefined && (
            <div className="razao-passa">
              {e.taxa === null ? "sem taxa" : `${fP(e.taxa)} seguem`}
              {e.regua && <Ponto cor={avaliar(REGUAS[e.regua], e.taxa)} />}
              {e.regua && <span>{metaTexto(REGUAS[e.regua])}</span>}
            </div>
          )}
          <div className="razao-linha">
            <div className="razao-nome">
              <b>{e.nome}</b>
              {e.sub && <small>{e.sub}</small>}
            </div>
            <div className="razao-barra">
              <i style={{ width: `${larg(e.valor || 0)}%` }} />
            </div>
            <div className="razao-val num">{e.valor === null ? "—" : fN(e.valor)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- gráficos ----------
const CHAMP = "#cdb68a";
const CHAMP_C = "#e4cd97";

export function Spark({ valores }: { valores: number[] }) {
  const w = 96,
    h = 34;
  const max = Math.max(...valores, 1);
  const pts = valores.map((v, i) => `${(i / (valores.length - 1)) * w},${h - (v / max) * (h - 4) - 2}`);
  return (
    <svg className="spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <polyline points={pts.join(" ")} fill="none" stroke={CHAMP} strokeWidth="1" opacity="0.85" />
    </svg>
  );
}

export function Area({
  pontos,
  fmt = (n: number) => fN(n),
  barras,
}: {
  pontos: { x: string; y: number }[];
  fmt?: (n: number) => string;
  barras?: { x: string; y: number }[];
}) {
  const [sel, setSel] = useState<number | null>(null);
  if (!pontos.length) return <div className="vazio">Sem dados no período.</div>;
  const W = 760,
    H = 240,
    pl = 54,
    pb = 26,
    pt = 12;
  const max = Math.max(...pontos.map((p) => p.y), 1) * 1.12;
  const maxB = barras ? Math.max(...barras.map((b) => b.y), 1) * 1.2 : 1;
  const n = pontos.length;
  const X = (i: number) => pl + (n === 1 ? (W - pl) / 2 : (i / (n - 1)) * (W - pl - 8));
  const Y = (v: number) => pt + (H - pt - pb) * (1 - v / max);
  const YB = (v: number) => pt + (H - pt - pb) * (1 - v / maxB);
  const linha = pontos.map((p, i) => `${X(i)},${Y(p.y)}`).join(" ");
  const passo = Math.max(1, Math.ceil(n / 9));
  const tx = sel !== null ? Math.min(X(sel) + 12, W - 160) : 0;
  return (
    <svg className="graf" viewBox={`0 0 ${W} ${H}`} onMouseLeave={() => setSel(null)}>
      <defs>
        <linearGradient id="hwArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={CHAMP} stopOpacity="0.22" />
          <stop offset="1" stopColor={CHAMP} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line x1={pl} x2={W} y1={Y(max * f)} y2={Y(max * f)} stroke="rgba(236,230,216,.07)" />
          <text x={pl - 10} y={Y(max * f) + 3} textAnchor="end">
            {fmt(max * f)}
          </text>
        </g>
      ))}
      {barras?.map((b, i) => {
        const bw = Math.max(3, ((W - pl) / n) * 0.34);
        return <rect key={i} x={X(i) - bw / 2} y={YB(b.y)} width={bw} height={Math.max(0, H - pb - YB(b.y))} fill="#ece6d8" opacity="0.5" />;
      })}
      <polygon points={`${X(0)},${H - pb} ${linha} ${X(n - 1)},${H - pb}`} fill="url(#hwArea)" />
      <polyline points={linha} fill="none" stroke={CHAMP} strokeWidth="1.5" />
      {pontos.map((p, i) => (
        <g key={i}>
          {i % passo === 0 && (
            <text x={X(i)} y={H - 7} textAnchor="middle">
              {p.x}
            </text>
          )}
          <rect x={X(i) - (W - pl) / n / 2} y={0} width={(W - pl) / n} height={H} fill="transparent" onMouseEnter={() => setSel(i)} />
        </g>
      ))}
      {sel !== null && (
        <g>
          <line x1={X(sel)} x2={X(sel)} y1={pt} y2={H - pb} stroke={CHAMP_C} strokeDasharray="2 4" opacity="0.6" />
          <circle cx={X(sel)} cy={Y(pontos[sel].y)} r="3.5" fill={CHAMP_C} />
          <rect x={tx} y={pt} width="148" height={barras ? 54 : 40} fill="#101012" stroke="rgba(236,230,216,.18)" />
          <text x={tx + 12} y={pt + 16} style={{ fill: "#6d685d", fontSize: 9, letterSpacing: "0.12em" }}>
            {pontos[sel].x}
          </text>
          <text x={tx + 12} y={pt + 32} style={{ fill: "#ece6d8", fontSize: 14, fontFamily: "Bodoni Moda, serif" }}>
            {fmt(pontos[sel].y)}
          </text>
          {barras && (
            <text x={tx + 12} y={pt + 47} style={{ fill: "#a6a092", fontSize: 10 }}>
              {fN(barras[sel]?.y)} ingressos
            </text>
          )}
        </g>
      )}
    </svg>
  );
}

export function Barras({ itens, fmt = (n: number) => fN(n), destaque }: { itens: { x: string; y: number; meta?: number | null }[]; fmt?: (n: number) => string; destaque?: (i: number) => boolean }) {
  if (!itens.length) return <div className="vazio">Sem dados.</div>;
  const W = 760,
    H = 210,
    pb = 26,
    pt = 22;
  const max = Math.max(...itens.map((i) => Math.max(i.y, i.meta || 0)), 1) * 1.15;
  const bw = Math.min(44, ((W - 10) / itens.length) * 0.5);
  const X = (i: number) => 5 + ((W - 10) / itens.length) * (i + 0.5);
  const Y = (v: number) => pt + (H - pt - pb) * (1 - v / max);
  return (
    <svg className="graf" viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="hwBar" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ece6d8" stopOpacity="0.92" />
          <stop offset="1" stopColor="#ece6d8" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id="hwBarB" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#e4cd97" />
          <stop offset="1" stopColor="#a98e57" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <line x1="0" x2={W} y1={H - pb} y2={H - pb} stroke="rgba(236,230,216,.12)" />
      {itens.map((it, i) => (
        <g key={i}>
          <rect x={X(i) - bw / 2} y={Y(it.y)} width={bw} height={Math.max(0, H - pb - Y(it.y))} fill={destaque && destaque(i) ? "url(#hwBarB)" : "url(#hwBar)"} opacity={destaque && !destaque(i) ? 0.55 : 1} />
          {it.meta !== undefined && it.meta !== null && (
            <line x1={X(i) - bw / 2 - 6} x2={X(i) + bw / 2 + 6} y1={Y(it.meta)} y2={Y(it.meta)} stroke="#e4cd97" strokeWidth="1.2" strokeDasharray="3 3" />
          )}
          <text x={X(i)} y={Y(it.y) - 7} textAnchor="middle" style={{ fill: "#ece6d8", fontSize: 12, fontFamily: "Bodoni Moda, serif" }}>
            {it.y ? fmt(it.y) : ""}
          </text>
          {(itens.length <= 14 || i % 2 === 0) && (
            <text x={X(i)} y={H - 8} textAnchor="middle">
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
  const cor = (v: number) => (v ? `rgba(228,205,151,${0.2 + (v / max) * 0.8})` : "rgba(236,230,216,.04)");
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
          <Linha key={d} rot={dias[d]} linha={linha} cor={cor} />
        ))}
      </div>
      <div className="legenda">
        <span>
          <i style={{ background: "linear-gradient(90deg, rgba(228,205,151,.2), #e4cd97)", width: 70 }} />
          menos vendas, mais vendas
        </span>
      </div>
    </div>
  );
}
function Linha({ rot, linha, cor }: { rot: string; linha: number[]; cor: (v: number) => string }) {
  return (
    <>
      <span style={{ alignSelf: "center" }}>{rot}</span>
      {linha.map((v, h) => (
        <div key={h} className="c" title={`${rot} ${h}h: ${v} venda${v === 1 ? "" : "s"}`} style={{ background: cor(v) }} />
      ))}
    </>
  );
}

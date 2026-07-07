import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RedPro AI Solutions — Pitch Deck",
  description: "Apresentação de portfólio da RedPro AI Solutions",
  robots: { index: false, follow: false },
};

const html = `<title>RedPro AI Solutions — Pitch Deck</title>
<style>
:root {
  --bg-base: #0a0a08;
  --bg-vignette: radial-gradient(ellipse 120% 90% at 75% 15%, rgba(249,115,22,0.10), transparent 55%),
                 radial-gradient(ellipse 100% 80% at 10% 100%, rgba(249,115,22,0.05), transparent 60%);
  --surface: #141210;
  --surface-raised: #1a1815;
  --border: rgba(232,228,216,0.09);
  --border-strong: rgba(249,115,22,0.35);
  --text-primary: #f2efe6;
  --text-secondary: #9a9488;
  --text-muted: #5f5a50;
  --accent: #f97316;
  --accent-dim: rgba(249,115,22,0.12);
  --accent-soft: #fbb27a;
  --serif: Georgia, 'Iowan Old Style', 'Palatino Linotype', serif;
  --sans: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --mono: Consolas, 'SF Mono', 'Cascadia Code', monospace;
}

:root[data-theme="light"] {
  --bg-base: #f5f2ea;
  --bg-vignette: radial-gradient(ellipse 120% 90% at 75% 15%, rgba(249,115,22,0.08), transparent 55%),
                 radial-gradient(ellipse 100% 80% at 10% 100%, rgba(249,115,22,0.04), transparent 60%);
  --surface: #ffffff;
  --surface-raised: #fbf9f4;
  --border: rgba(20,18,16,0.09);
  --border-strong: rgba(234,88,12,0.4);
  --text-primary: #171410;
  --text-secondary: #6b6459;
  --text-muted: #a39c8d;
  --accent: #ea580c;
  --accent-dim: rgba(234,88,12,0.08);
  --accent-soft: #c2410c;
}

:root[data-theme="light"] .demo-overlay { background: rgba(30,26,20,0.55); }

@media (prefers-color-scheme: light) {
  .demo-overlay { background: rgba(30,26,20,0.55); }
  :root:not([data-theme="dark"]) {
    --bg-base: #f5f2ea;
    --bg-vignette: radial-gradient(ellipse 120% 90% at 75% 15%, rgba(249,115,22,0.08), transparent 55%),
                   radial-gradient(ellipse 100% 80% at 10% 100%, rgba(249,115,22,0.04), transparent 60%);
    --surface: #ffffff;
    --surface-raised: #fbf9f4;
    --border: rgba(20,18,16,0.09);
    --border-strong: rgba(234,88,12,0.4);
    --text-primary: #171410;
    --text-secondary: #6b6459;
    --text-muted: #a39c8d;
    --accent: #ea580c;
    --accent-soft: #c2410c;
  }
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--sans);
  overflow: hidden;
}

.deck-shell {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-vignette), var(--bg-base);
}

.stage {
  position: relative;
  width: min(94vw, 177.77vh);
  height: min(94vw * 0.5625, 90vh);
  aspect-ratio: 16 / 9;
  background: var(--bg-vignette), var(--bg-base);
  border: 1px solid var(--border);
  box-shadow: 0 40px 100px -30px rgba(0,0,0,0.6);
  overflow: hidden;
}

.slide {
  position: absolute;
  inset: 0;
  padding: clamp(28px, 5vw, 76px);
  display: none;
  flex-direction: column;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.slide.active {
  display: flex;
  opacity: 1;
}

.eyebrow {
  font-family: var(--mono);
  font-size: clamp(10px, 1.1vw, 13px);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: clamp(18px, 3vw, 32px);
}

.eyebrow::before {
  content: '';
  width: 22px;
  height: 1px;
  background: var(--accent);
}

.eyebrow .sep {
  color: var(--text-muted);
}

h1.headline {
  font-family: var(--serif);
  font-weight: 600;
  font-size: clamp(30px, 4.6vw, 62px);
  line-height: 1.06;
  letter-spacing: -0.01em;
  text-wrap: balance;
  margin: 0 0 clamp(14px, 2.2vw, 22px) 0;
  max-width: 15ch;
}

h1.headline em {
  font-style: italic;
  color: var(--accent);
}

.subhead {
  font-size: clamp(14px, 1.5vw, 19px);
  color: var(--text-secondary);
  max-width: 46ch;
  line-height: 1.55;
  margin: 0;
}

.slide-body {
  flex: 1;
  display: flex;
  align-items: center;
  margin-top: clamp(14px, 2.5vw, 24px);
}

.slide-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-family: var(--mono);
  font-size: clamp(9px, 0.9vw, 11px);
  color: var(--text-muted);
  letter-spacing: 0.04em;
  padding-top: clamp(10px, 2vw, 18px);
  border-top: 1px solid var(--border);
}

/* ===== SLIDE 1 — Cover ===== */
#slide-1 {
  justify-content: center;
  align-items: flex-start;
}

.cover-mark {
  font-family: var(--mono);
  font-size: clamp(11px, 1.1vw, 13px);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: clamp(24px, 5vw, 48px);
}

.cover-mark strong { color: var(--accent); }

h1.cover-title {
  font-family: var(--serif);
  font-weight: 300;
  font-size: clamp(38px, 6.6vw, 92px);
  line-height: 1.02;
  letter-spacing: -0.02em;
  margin: 0;
}

h1.cover-title strong {
  font-weight: 700;
  color: var(--accent);
}

.cover-sub {
  margin-top: clamp(20px, 3vw, 34px);
  font-size: clamp(16px, 1.8vw, 22px);
  color: var(--text-secondary);
  max-width: 34ch;
  line-height: 1.5;
  border-left: 2px solid var(--border-strong);
  padding-left: clamp(14px, 2vw, 20px);
}

.cover-footer-list {
  margin-top: auto;
  display: flex;
  gap: clamp(24px, 4vw, 56px);
  font-family: var(--mono);
  font-size: clamp(10px, 1vw, 12px);
  color: var(--text-muted);
  letter-spacing: 0.03em;
}

.cover-footer-list span strong { color: var(--text-secondary); display: block; font-size: 1.15em; margin-bottom: 2px;}

/* ===== SLIDE 2 — Problem ===== */
.problem-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: clamp(24px, 4vw, 56px);
  width: 100%;
  align-items: center;
}

.pain-list {
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 1.6vw, 16px);
}

.pain-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 2px solid var(--border-strong);
  padding: clamp(14px, 1.8vw, 20px) clamp(16px, 2vw, 22px);
  font-size: clamp(13px, 1.3vw, 16px);
  color: var(--text-primary);
  line-height: 1.45;
}

.problem-close {
  font-family: var(--serif);
  font-style: italic;
  font-size: clamp(18px, 2vw, 25px);
  line-height: 1.4;
  color: var(--accent-soft);
  max-width: 20ch;
}

/* ===== SLIDE 3 — Method ===== */
.method-track {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
}

.method-row {
  display: grid;
  grid-template-columns: clamp(50px, 5vw, 70px) 1fr;
  gap: clamp(14px, 2vw, 24px);
  padding: clamp(12px, 1.8vw, 20px) 0;
  border-bottom: 1px solid var(--border);
  align-items: baseline;
}

.method-row:last-child { border-bottom: none; }

.method-num {
  font-family: var(--mono);
  font-size: clamp(20px, 2.4vw, 30px);
  color: var(--accent);
  font-weight: 500;
}

.method-name {
  font-family: var(--serif);
  font-weight: 600;
  font-size: clamp(16px, 1.7vw, 21px);
  margin-bottom: 4px;
}

.method-desc {
  font-size: clamp(12.5px, 1.2vw, 14.5px);
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 62ch;
}

.method-close {
  margin-top: clamp(16px, 2.4vw, 26px);
  font-size: clamp(13px, 1.3vw, 15.5px);
  color: var(--text-secondary);
}

.method-close strong { color: var(--text-primary); }

/* ===== SLIDE 4 — Catalog ===== */
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(12px, 1.6vw, 18px);
  width: 100%;
}

.catalog-card {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: clamp(16px, 1.8vw, 22px);
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  width: 100%;
  font-family: inherit;
  transition: border-color 0.2s, transform 0.2s, background 0.2s;
}

.catalog-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 2px;
  height: 100%;
  background: var(--border-strong);
}

.catalog-card:hover, .catalog-card:focus-visible {
  border-color: var(--border-strong);
  background: var(--surface-raised);
  transform: translateY(-2px);
}

.catalog-card:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.catalog-num {
  font-family: var(--mono);
  font-size: clamp(10px, 0.95vw, 12px);
  color: var(--accent);
  letter-spacing: 0.08em;
}

.catalog-name {
  font-family: var(--serif);
  font-weight: 600;
  font-size: clamp(15px, 1.6vw, 19px);
  color: var(--text-primary);
}

.catalog-desc {
  font-size: clamp(11.5px, 1.05vw, 13.5px);
  color: var(--text-secondary);
  line-height: 1.55;
}

.card-cta {
  margin-top: auto;
  padding-top: 10px;
  font-family: var(--mono);
  font-size: clamp(9.5px, 0.85vw, 11px);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent-soft);
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-cta .arrow-ico { transition: transform 0.2s; }
.catalog-card:hover .card-cta .arrow-ico,
.proof-card:hover .card-cta .arrow-ico { transform: translateX(3px); }

/* ===== SLIDE 5 — Not niched ===== */
.reframe-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(28px, 4vw, 60px);
  width: 100%;
  align-items: start;
}

.sector-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(8px, 1vw, 12px);
  margin-top: clamp(4px, 1vw, 10px);
}

.sector-chip {
  font-family: var(--mono);
  font-size: clamp(11px, 1.05vw, 13px);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  padding: 6px 14px;
  border-radius: 100px;
}

.equation {
  font-family: var(--mono);
  font-size: clamp(13px, 1.3vw, 16px);
  color: var(--text-primary);
  background: var(--surface);
  border: 1px solid var(--border);
  padding: clamp(14px, 2vw, 20px);
  margin-top: clamp(16px, 2.4vw, 24px);
  line-height: 1.8;
}

.equation .op { color: var(--accent); }

.reframe-right p {
  font-size: clamp(13px, 1.35vw, 16px);
  color: var(--text-secondary);
  line-height: 1.6;
}

.reframe-right .highlight {
  font-family: var(--serif);
  font-style: italic;
  color: var(--accent-soft);
  font-size: clamp(17px, 1.8vw, 22px);
  line-height: 1.45;
  display: block;
  margin-top: clamp(12px, 2vw, 18px);
}

/* ===== SLIDE 6 — Client proof ===== */
.client-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(12px, 1.6vw, 20px);
  width: 100%;
}

.client-card {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: clamp(18px, 2vw, 24px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  text-align: left;
  width: 100%;
  font-family: inherit;
  transition: border-color 0.2s, transform 0.2s, background 0.2s;
}

.client-card:hover, .client-card:focus-visible {
  border-color: var(--border-strong);
  background: var(--surface-raised);
  transform: translateY(-2px);
}

.client-card:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.client-logo-wrap {
  height: clamp(38px, 4.5vw, 52px);
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.client-logo {
  max-height: 100%;
  max-width: 70%;
  object-fit: contain;
  object-position: left center;
}

.client-name {
  font-family: var(--serif);
  font-weight: 600;
  font-size: clamp(15px, 1.6vw, 19px);
  color: var(--text-primary);
  line-height: 1.2;
}

.client-who {
  font-family: var(--mono);
  font-size: clamp(10px, 0.9vw, 11.5px);
  color: var(--text-muted);
  line-height: 1.4;
  font-style: italic;
}

.client-desc {
  font-size: clamp(11.5px, 1.05vw, 13.5px);
  color: var(--text-secondary);
  line-height: 1.55;
}

/* ===== SLIDE 7 — Close ===== */
#slide-7 {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.close-title {
  font-family: var(--serif);
  font-weight: 300;
  font-size: clamp(38px, 6vw, 76px);
  line-height: 1;
}

.close-title strong { font-weight: 700; color: var(--accent); }

.close-tagline {
  margin-top: clamp(16px, 2.4vw, 26px);
  font-size: clamp(14px, 1.5vw, 18px);
  color: var(--text-secondary);
  max-width: 40ch;
  line-height: 1.6;
}

.close-cta {
  margin-top: clamp(24px, 3.6vw, 40px);
  font-family: var(--mono);
  font-size: clamp(11px, 1.1vw, 13px);
  letter-spacing: 0.06em;
  color: var(--accent-soft);
  border: 1px solid var(--border-strong);
  padding: 12px 24px;
  display: inline-block;
}

.close-contact {
  margin-top: clamp(28px, 4vw, 44px);
  font-family: var(--mono);
  font-size: clamp(10px, 0.95vw, 12px);
  color: var(--text-muted);
}

/* ===== Demo Overlay ===== */
.demo-overlay {
  position: absolute;
  inset: 0;
  background: rgba(6,5,4,0.72);
  backdrop-filter: blur(6px);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.demo-overlay.open {
  display: flex;
  opacity: 1;
}

.demo-panel {
  width: min(92%, 900px);
  height: min(88%, 620px);
  background: var(--bg-base);
  border: 1px solid var(--border-strong);
  box-shadow: 0 40px 120px -20px rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  transform: scale(0.96) translateY(8px);
  transition: transform 0.25s ease;
  overflow: hidden;
}

.demo-overlay.open .demo-panel {
  transform: scale(1) translateY(0);
}

.demo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px clamp(18px, 3vw, 28px);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.demo-header-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.demo-header-tag {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
}

.demo-header-title {
  font-family: var(--serif);
  font-weight: 600;
  font-size: clamp(15px, 1.7vw, 19px);
  color: var(--text-primary);
}

.demo-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
  transition: border-color 0.2s, color 0.2s;
}

.demo-close:hover { border-color: var(--border-strong); color: var(--accent); }
.demo-close:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.demo-body {
  flex: 1;
  overflow-y: auto;
  padding: clamp(18px, 3vw, 28px);
  position: relative;
}

.demo-body::-webkit-scrollbar { width: 8px; }
.demo-body::-webkit-scrollbar-thumb { background: var(--border-strong); }

.demo-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 18px;
}

.demo-status .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  animation: pulse-dot 1.4s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

/* Generic step-fade for simulated events */
.demo-step {
  opacity: 0;
  transform: translateY(6px);
  animation: step-in 0.45s ease forwards;
}

@keyframes step-in {
  to { opacity: 1; transform: translateY(0); }
}

/* Chat bubble pattern (secretária IA, triagem) */
.demo-chat {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 68ch;
}

.chat-bubble {
  padding: 11px 15px;
  border-radius: 4px;
  font-size: 13.5px;
  line-height: 1.55;
  max-width: 78%;
}

.chat-bubble.in {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-primary);
  align-self: flex-start;
  border-top-left-radius: 0;
}

.chat-bubble.out {
  background: var(--accent-dim);
  border: 1px solid var(--border-strong);
  color: var(--text-primary);
  align-self: flex-end;
  border-top-right-radius: 0;
}

.chat-bubble .chat-tag {
  display: block;
  font-family: var(--mono);
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 5px;
}

/* Data card pattern (relatórios, financeiro) */
.demo-datagrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 18px;
}

.data-tile {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 14px 16px;
}

.data-tile-label {
  font-family: var(--mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.data-tile-value {
  font-family: var(--mono);
  font-size: clamp(18px, 2vw, 24px);
  font-weight: 500;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.data-tile-delta {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* Task/log list pattern (transcrição, ERP) */
.demo-log {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.log-row {
  display: grid;
  grid-template-columns: 90px 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 10px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  font-size: 12.5px;
}

.log-time {
  font-family: var(--mono);
  color: var(--text-muted);
  font-size: 11px;
}

.log-text { color: var(--text-primary); line-height: 1.4; }
.log-text b { color: var(--accent-soft); }

.log-badge {
  font-family: var(--mono);
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 9px;
  border: 1px solid var(--border-strong);
  color: var(--accent-soft);
  white-space: nowrap;
}

/* Before/after pattern (processos internos) */
.before-after {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: clamp(12px, 2vw, 22px);
  align-items: stretch;
}

.ba-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ba-col-tag {
  font-family: var(--mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.ba-before .ba-col-tag { color: var(--text-muted); }
.ba-after .ba-col-tag { color: var(--accent); }

.ba-scene {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.ba-after .ba-scene { border-color: var(--border-strong); }

.ba-line {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-primary);
}

.ba-line b { color: var(--accent-soft); }

.ba-time {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px dashed var(--border);
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--text-secondary);
}

.ba-arrow {
  display: flex;
  align-items: center;
  color: var(--accent);
  font-size: 22px;
}

@media (max-width: 720px) {
  .before-after { grid-template-columns: 1fr; }
  .ba-arrow { transform: rotate(90deg); justify-content: center; }
}

/* Document scan pattern (triagem) */
.doc-flow {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.doc-flow .stage-box {
  padding: 8px 14px;
  border: 1px solid var(--border);
  background: var(--surface);
}

.doc-flow .stage-box.active {
  border-color: var(--border-strong);
  color: var(--accent-soft);
}

.doc-flow .arrow-ico { color: var(--accent); }

/* Demo tabs (multi-agent demos) */
.demo-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--border);
}

.demo-tab {
  font-family: var(--mono);
  font-size: 11.5px;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 8px 4px 10px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.demo-tab.active {
  color: var(--accent-soft);
  border-bottom-color: var(--accent);
}

.demo-tab-panel { display: none; }
.demo-tab-panel.active { display: block; }

/* Demo external links (ICC) */
.demo-links {
  display: flex;
  gap: 10px;
  margin-top: 18px;
  flex-wrap: wrap;
}

.demo-link-btn {
  font-family: var(--mono);
  font-size: 11.5px;
  letter-spacing: 0.03em;
  color: var(--accent-soft);
  text-decoration: none;
  border: 1px solid var(--border-strong);
  padding: 9px 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s, color 0.2s;
}

.demo-link-btn:hover {
  background: var(--accent-dim);
  color: var(--text-primary);
}

.demo-link-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

/* Kanban card mockup (RE/MAX demo) */
.kanban-mini {
  --kb-bg: #191815;
  --kb-card: #322C25;
  --kb-border: #4A4238;
  --kb-gold: #D4934A;
  background: var(--kb-bg);
  border: 1px solid var(--kb-border);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.kanban-mini-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--kb-gold);
}

.kanban-stages {
  display: flex;
  gap: 8px;
  font-family: var(--mono);
  font-size: 9.5px;
  color: #8a8276;
  flex-wrap: wrap;
}

.kanban-stages span {
  padding: 4px 8px;
  border: 1px solid var(--kb-border);
}

.kanban-stages span.current {
  border-color: var(--kb-gold);
  color: var(--kb-gold);
}

.kanban-card {
  background: #262019;
  border: 1px solid var(--kb-border);
  border-left: 3px solid var(--kb-gold);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kanban-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kanban-card-name {
  font-family: var(--serif);
  font-weight: 600;
  font-size: 15px;
  color: #f2ece0;
}

.kanban-card-badge {
  font-family: var(--mono);
  font-size: 9px;
  text-transform: uppercase;
  color: #25D366;
  border: 1px solid #25D36655;
  padding: 2px 7px;
}

.kanban-card-value {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--kb-gold);
  font-variant-numeric: tabular-nums;
}

.kanban-card-summary {
  font-size: 11.5px;
  line-height: 1.55;
  color: #b8b0a2;
  background: #1f1a14;
  border: 1px dashed var(--kb-border);
  padding: 10px 12px;
  white-space: pre-line;
}

/* ===== Nav ===== */
.nav-controls {
  position: absolute;
  bottom: clamp(10px, 2vh, 20px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 14px;
  z-index: 10;
  font-family: var(--mono);
}

.nav-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: border-color 0.2s, background 0.2s;
}

.nav-btn:hover { border-color: var(--border-strong); background: var(--accent-dim); }
.nav-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.nav-dots {
  display: flex;
  gap: 7px;
}

.nav-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
  cursor: pointer;
  border: none;
  padding: 0;
  transition: background 0.2s, transform 0.2s;
}

.nav-dot.active {
  background: var(--accent);
  transform: scale(1.5);
}

.nav-dot:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

.slide-counter {
  font-size: 11px;
  color: var(--text-muted);
  min-width: 42px;
  text-align: center;
}

@media (prefers-reduced-motion: reduce) {
  .slide { transition: none; }
  .nav-dot { transition: none; }
}

@media (max-width: 720px) {
  .problem-grid, .reframe-layout { grid-template-columns: 1fr; }
  .catalog-grid, .client-grid { grid-template-columns: 1fr; }
  .cover-footer-list { flex-wrap: wrap; gap: 16px; }
}
</style>

<div class="deck-shell">
  <div class="stage" id="stage">

    <!-- SLIDE 1 -->
    <section class="slide active" id="slide-1">
      <div class="cover-mark">Apresentação de Portfólio · <strong>RedPro AI Solutions</strong></div>
      <h1 class="cover-title">Inteligência<br>aplicada à<br><strong>operação.</strong></h1>
      <p class="cover-sub">Não vendemos ferramenta. Entregamos resultado medido — em qualquer operação que tenha processo manual, dado espalhado ou decisão lenta.</p>
      <div class="cover-footer-list">
        <span><strong>RedPro AI Solutions</strong>Automação &amp; IA aplicada</span>
        <span><strong>Ana Clara &amp; Victor Lima</strong>Fundadores</span>
      </div>
    </section>

    <!-- SLIDE 2 -->
    <section class="slide" id="slide-2">
      <div class="eyebrow">01 <span class="sep">/</span> O problema</div>
      <h1 class="headline">Toda empresa sabe que precisa de IA. Quase nenhuma sabe <em>implementar.</em></h1>
      <div class="slide-body">
        <div class="problem-grid">
          <div class="pain-list">
            <div class="pain-item">Processos manuais consumindo horas de gente qualificada</div>
            <div class="pain-item">Dados espalhados em planilhas, WhatsApp e sistemas que não conversam</div>
            <div class="pain-item">Decisões lentas porque a informação não chega rápido pra quem decide</div>
          </div>
          <div class="problem-close">"O problema não é falta de vontade — é falta de quem saiba traduzir IA em processo real."</div>
        </div>
      </div>
      <div class="slide-footer"><span>RedPro AI Solutions</span><span>02 / 07</span></div>
    </section>

    <!-- SLIDE 3 -->
    <section class="slide" id="slide-3">
      <div class="eyebrow">02 <span class="sep">/</span> Como trabalhamos</div>
      <h1 class="headline">Um processo, não um projeto solto.</h1>
      <div class="slide-body">
        <div class="method-track" style="width:100%">
          <div class="method-row">
            <div class="method-num">01</div>
            <div>
              <div class="method-name">Diagnóstico</div>
              <div class="method-desc">Mapeamos a operação real antes de propor qualquer solução. Sem diagnóstico não existe automação — só ferramenta jogada em cima do problema.</div>
            </div>
          </div>
          <div class="method-row">
            <div class="method-num">02</div>
            <div>
              <div class="method-name">Arquitetura</div>
              <div class="method-desc">Desenhamos a solução sob medida: qual processo automatizar primeiro, qual IA resolve, qual é o retorno esperado.</div>
            </div>
          </div>
          <div class="method-row">
            <div class="method-num">03</div>
            <div>
              <div class="method-name">Execução</div>
              <div class="method-desc">Construímos e implementamos rápido, com entregas visíveis — não um projeto de 6 meses sem checkpoint.</div>
            </div>
          </div>
          <div class="method-row">
            <div class="method-num">04</div>
            <div>
              <div class="method-name">Validação &amp; segurança</div>
              <div class="method-desc">Testamos, garantimos que funciona no mundo real, e protegemos os dados do cliente antes de ir para produção.</div>
            </div>
          </div>
        </div>
      </div>
      <div class="slide-footer"><span>RedPro AI Solutions</span><span>03 / 07</span></div>
    </section>

    <!-- SLIDE 4 -->
    <section class="slide" id="slide-4">
      <div class="eyebrow">03 <span class="sep">/</span> Catálogo de serviços</div>
      <h1 class="headline">O que colocamos à disposição do seu negócio.</h1>
      <div class="slide-body">
        <div class="catalog-grid">
          <button class="catalog-card" data-demo="atendimento">
            <div class="catalog-num">01</div>
            <div class="catalog-name">Automação de atendimento</div>
            <div class="catalog-desc">WhatsApp, chatbot e IA conversacional — qualificação de leads, suporte e triagem automatizados, sem perder o tom humano.</div>
            <div class="card-cta">Ver demonstração <span class="arrow-ico">→</span></div>
          </button>
          <button class="catalog-card" data-demo="processos">
            <div class="catalog-num">02</div>
            <div class="catalog-name">Automação de processos internos</div>
            <div class="catalog-desc">Integração de sistemas e planilhas, eliminação de tarefas manuais repetitivas no backoffice — financeiro, operações, dados.</div>
            <div class="card-cta">Ver demonstração <span class="arrow-ico">→</span></div>
          </button>
          <button class="catalog-card" data-demo="agentes">
            <div class="catalog-num">03</div>
            <div class="catalog-name">Agentes de IA sob medida</div>
            <div class="catalog-desc">Agentes customizados pra tarefas específicas do negócio: análise, geração de conteúdo, apoio à decisão.</div>
            <div class="card-cta">Ver demonstração <span class="arrow-ico">→</span></div>
          </button>
          <button class="catalog-card" data-demo="diagnostico">
            <div class="catalog-num">04</div>
            <div class="catalog-name">Diagnóstico de maturidade em IA</div>
            <div class="catalog-desc">Avaliação de onde a empresa está hoje e roadmap priorizado de adoção de IA — antes de qualquer investimento em execução.</div>
            <div class="card-cta">Ver demonstração <span class="arrow-ico">→</span></div>
          </button>
        </div>
      </div>
      <div class="slide-footer"><span>RedPro AI Solutions</span><span>04 / 07</span></div>
    </section>

    <!-- SLIDE 5 -->
    <section class="slide" id="slide-5">
      <div class="eyebrow">04 <span class="sep">/</span> Posicionamento</div>
      <h1 class="headline">Não escolhemos um setor. Escolhemos um <em>tipo de problema.</em></h1>
      <div class="slide-body">
        <div class="reframe-layout">
          <div class="reframe-left">
            <div class="sector-cloud">
              <span class="sector-chip">Clínicas</span>
              <span class="sector-chip">E-commerce</span>
              <span class="sector-chip">Indústria</span>
              <span class="sector-chip">Advocacia</span>
              <span class="sector-chip">Distribuidoras</span>
              <span class="sector-chip">Serviços</span>
            </div>
            <div class="equation">processo manual <span class="op">+</span> dado espalhado <span class="op">+</span> decisão lenta <span class="op">=</span> mesma dor, qualquer setor</div>
          </div>
          <div class="reframe-right">
            <p>A IA resolve essa estrutura, não o setor. Por isso atendemos qualquer área com o mesmo nível de profundidade: o método é setor-agnóstico — o diagnóstico é que é específico de cada cliente.</p>
            <span class="highlight">Qualquer empresa que tenha esse tipo de dor, nós conseguimos atender.</span>
          </div>
        </div>
      </div>
      <div class="slide-footer"><span>RedPro AI Solutions</span><span>05 / 07</span></div>
    </section>

    <!-- SLIDE 6 -->
    <section class="slide" id="slide-6">
      <div class="eyebrow">05 <span class="sep">/</span> Prova em produção</div>
      <h1 class="headline" style="max-width:24ch">O que está rodando nos nossos clientes.</h1>
      <div class="slide-body">
        <div class="client-grid">
          <button class="client-card" data-demo="icc">
            <div class="client-logo-wrap"><img class="client-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAApkAAADCCAYAAAACedlPAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAC3GSURBVHgB7d0HmCRV1YDhuwsSVkCSRJFFchCEJUvwBwRJkiVIDoKABEEyKhlE4pIzAis5CQooWTIiQdKSMy5BwIDE/s9XM7XW9Mwu3T01Pd0z3/s89+mJ3VXV1bdOnZtSkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJUj8Ykppj1iiTJEmSJPUHYr53oryVmqQZQebQKH+MskySJElSfzkiykFRKqkJJkzNMUGUiZIkSZL6ywSpiYYmSZIkqWTNymQWkaIdE+XjJEmSpL5A1nKKKJOlftIfQebnUX4Z5YIkSZKkvkCAeUiUrVPzBnp30R9BJshi/jtJkiSpL5DJ/DT1I/tkSpIkqXQGmZIkSSqdQaYkSZJKZ5ApSZKk0hlkSpIkqXQGmZIkSSqdQaYkSZJKZ5ApSZKk0hlkSpIkqXQGmZIkSSqdQaYkSZJKZ5ApSZKk0k2Y2teQKFN3PkqS1I5I9rwX5eMkDTDtHGROOHTo0KMrlcrMSZKk9jQkrmO/iMd7kjTAtHOQyd3fikOGDPl6kiSpTUWQeWySBiD7ZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSjdhklpEpVL5wr8ZMmRIkjR41VJP5KwvpP5lkFmDoUOHpi9/+ctdKiwqun/+85+pt3ieKaecskvF+cknn6T//Oc/Ta0gJ5100vSlL32py88+/PDDbFv6Evs90UQTpemmmy7bhuHDh6eZZ545+xk+//zz9Oabb6bXXnst/fvf/04ffPBBev/997NtK/v49HQM+gv7zTnAY704X4cNG5Y95npzvk4wwQTZ+d8qOC6ffvppXf8zrmPyr3/9q66gpTc4t9iG4ut99tln2f7Uuw18PiaZZJLUCth29oF96WtTTTVVVl9SFlhggTTTTDOl6aefPqsLKJzjr776anrllVfSs88+m23Xu+++m9UdBpxS8xlkfgEq0HnnnTdtv/32XS60VFo777xzl4tWI8/9la98JZ1wwgljK2h+9vLLL6cTTzwxvffee6kZCK723HPPNNtss4292P33v/9Nl156abr99ttTX+B1pphiivTd7343Lbroomm55ZZLX/3qV9Nkk02WJp544rHHlb/76KOPssI2vfDCC+mxxx5Lf/nLX9KDDz6YXUjyC0xvTD755GnHHXdMc889d9OCjvHhHDj66KOzi2Q92PYFF1wwbb755tm5BY7NG2+8kQ466KDsONZzrHi+pZdeOm288cbZ+9LfCAovueSSdPfdd9f8P+zD17/+9fTjH/84TTvttGN/TvBxzDHHZMemrwOQ/DhutdVWXT7rjzzySDr77LPrep8J+tdYY4208sort8RN0T/+8Y90xhlnpKeeeqpX9WFPOEbsI+f0UkstlZZccsn0rW99K6uL+cxyTuY3pLyHHFvqCc5zbkj//ve/p/vuuy/df//96ZZbbklvvfVWKfWFpNZBrXNblEpnIQWxdeq9iaNCeylKpS9LVEaVlVZaqRIBX6UoKrBsf3r73DPMMEOlWlSUlfPPP78SQVif7lteIjtQeeihh7psQ1zMKxFE98nrRbaysvfee1ceeOCBbF8bwf9FdrMyatSoylprrVWJ4CE7no1uU2REKrfeemulVfB+RHa3oXNqzTXXrET2t8vzjR49uhIX5bqPEX+/zTbbdDv/+0sECdn21LsPiyyySOW5557r8lyR8apENqxX50092xA3ql1eP7LUlZtuuqnu9zkymJWjjjqqEje6lVbAcfzOd77T6/qwuswyyyyVuFmq3HHHHZUxY8ZUeiMy35Unn3yyEsFwZfHFF69EYNrn73k9JY7d95JUviminBaFJrE8BjskStPussxk1oAmy+pmy75sGopKJ33ve99LETyl3/72tw01mdYj6uAemx/L3kf2Iyr4LGu64oorpqmnnjo1imNEU9n666+fZUGvuOKKdMEFF2QZTtSbqeAYNKO5r1a9ec/ZlzLPV56r0gLZ3Vwj+zKuY9LM/ap+fV6b7iiNbAPb3tf1Qj3K3BY+29QTtBTx2ab7TG+R/Z1nnnnSrLPOmuKGI1188cXpnHPOybKwZjWlvmOQ2aLoo3jkkUdmzTs33nhj21eENGutt956KTIwWXA4Llx06XOZBxL8H01j42oW5OdchHbZZZe06aabZk2PZ555ZoqsVaoXF6JW0UpNekOHts4kFByTVtqe/sIxaJXzo6xzlWCbuuHAAw/Mbh6nmWaa8f49/S+pK/K+y2wDdQX9Xumz2dN5QtegESNGZE3ukfFPI0eOTNddd13d3Ugk1cYgs4XNOOOM6Wc/+1n629/+lg18addKkIvHsssum/bbb79xBpj053riiSey4JBO+/Sr4v/o6E/AzYAg/nfhhRfOLhQ9ITO60047ZQMC9tprrxTNYzVniQhqGTBAH896M0v8Pf1JubAV36O33347K/UGrzwHx6BVMqv0bXvxxRfrHvzDcWFwCudx8Sbh448/zgZzcWGvF0EF2zPYvfPOO+n555+ve/BPpbMfOAHchBP+r/rnvaCOaeSc4xzn89obbNdcc82Vdtttt7TZZptlgWJP2E5aK/icUmfwOeFcYrv53FBXcL7xXGQuyVrS97san8llllkmu0Hl3LzqqqsMNKU+YJDZwqjwll9++XT88cdnA49o2mk37ANBH01T1c1eZC1vvfXWNGrUqHTzzTdnAzDGdZEb2jnCnwsHgeaGG26YZSOqm9y5OK266qpZsLrPPvtko9BrwSCQn/70pw2N2OVizWtts802XQLKK6+8Mhts00iGlGPTKu/3H/7wh3TPPffUfQEmu/TNb34znXXWWV3ee4L5n/zkJ9mgl3qzkgQjHBceB2tAQJBOtp6uNI28J2uvvXZ2XhYzhdyQcf4yUKaR94Sgt9H3g88Pg6IYPDTHHHN0ex729+mnn84GIlJfPProozXNlMDNKM9H15y8vih+vtnP2WefPZ122mlZwHnAAQdkgy0NNKXyGGS2OAIUgqYtt9wyHXvssW1XAdLcTTN2dYBJ1uD6669P++67b5Yly6dKGtcFrtI53QwjyrnIcLFhZDojhueff/4ux+X111/P+lxxcaoVwS0ZmUaQCWHbqtGMx7Y0+p61wnvNNjCTAqVevGdML1Pd35fvCUp6k50f7IEAGV1KvXhPuKGqvpnjs8K5Slawme8J20P/SwK8Oeecs9vvqSe4CT3//PPTQw89NPZzVksTPdlVWoGeeeaZrL6glYMuO9U3pmQ6N9pooywzyg0R/2eg2RQcZKasKFb6VBa1V9ytgSxCceqNdtyHPmOQ2QbIzv385z/P7t7PPffclhqgMj5cQBZbbLEsi1DE9p966qlZNoXMQS39y4q/JyCluYyLB9lC+m8xmIhpasiGkiW766676uor1puLyrheJ/95u1+werP947ppGCjHpr+U/Z7wfNzQNvM9oX5g2jQyifPNN1+33//5z39Ov/71r7M+k9QZ9fZDzf+WAJobU6Yoo882fd3JXBa7CxB4HnrooVl294gjjujz+YEHGU646aN8Lco8URaNMjzen8njccrUEWxWOh/pd/F+nBt/j8eHojwRZXSUN6PU37+mXGwv+zA8yrxRFop9YL+YK64YZHKB/iD2gTkIn4rySJSno7wa5Z00yBhktqA8a1TsA8f8kYy2ZH7Axx9/vC0uzlwUmAPza1/72tifcWGhKfu4447LMjGNDuLIL4Y073HhIFjddddds+CS+fAcHCK1NgI7ugHRBaa6PiMopA83c1zSxN/bz3M+hyb9OenawuCi1VdfvcvfkNFkHlPqDwJc9Rpv6mxRvh3v34pR94+I94GJagksx9svKf6OQG3N+J934/HR+P7OOA+ui6+fSc03WZQFYx/YnqXj6693BsgEl+OMoZi2LB64mBNw/j2+vyP24Q/x/f1R2q/vW4O8ErcYgjCaEffee+80ZsyYsT+nkqV/GxO30/TcSlPKjAsDDFZaaaUuFwiav+hPxmTjZQTKPAfPeeGFF2bdCsiONtKMKKl5qL8IIskuVvdZpg/wJptsku68884so1jWDTXPQ8DKxOzbbbdduvzyy7t1qaE15LDDDkuzzDJLW9SxLYrZ8QnGjo1jfnPU/+fH11vE1wvE4wzpCwLMTpwUU8X/zB5lHZ4rnufWeDwvyiKpOQmyWaJs2bkPBIf7xNfLRRkeX09TwzZw4hKgzhT/s3A87hrPc218fVN8vV2UGdMgYJDZoriDZ8WX6r5wSyyxRNaPkcxmq6OTPc1hRTT5M+Cj7Ewsz0c/PzvuS62N4O0b3/hGFkhW12PcYNP1hYFIfTVNE8/JDfz++++fbrrppm6/p48o21ZsTlfNCCJ3iGN8Qbx/O3YGZGW9iTPHc/4wnvOc+HqLKH211i3bu0i8zpnxesfH4+KpY1LzMkwUz7doPO/h8XhC6mh2H9AMMlsUHdzJ+LGEXhFN6CwZyJ14q99pM+inevoQgsy+mADZPn5Se6Df4+67755mmGGGLj+n68vBBx+cTWXW13Ubzz969Ois6ZwBP8XXY5lKMqxMf6SakXlcMurfURFAHRWP30gdGc2yTRjPvVC8xsj4+ujUkVEsE6PCCADJOK6SOprE+8K08fwbRLk0vl42dRy/Ackgs4UxHyB9F++9994uP+fun0qQKTnarUmHkdj5WsOSBhfqK+qt1VZbrdvvrr322mzlrmZNNM/rMNcoI9erp0Ri3tt1113Xuqo2vFnLx3t2cpTlU23N4b01abx/W0U5LL7+airH9PF8+0TZLfaj98tM1SBeZ54oBMvLpgHKILNF5Vk57uqZWLx6BRuam0466aSsn2arov9T9Uh4Jiyfdtpp7e8kDVLbbrttl8GAoPmaG2q6vDQT/bmZsYN5eotohWFgEN19rKvGiz4FK8e16uwopH6bGVMQzG4fQeEe8Thp6h0yi+fF426pOUFyjszsErEPp8TX86UByCCzDdA/k+UYiyukEIDSd4j+mdxtt2JFyPYWBy+Byptpjay4pcGHJnL6lRdXgKIuYB5Lmq/7o7sLddRll12WzWtbNPfcc6eFFlooabzou3h4Z9/L/kL/zFVT403OZEV3in34bnz9pdQ/5oht+FkqLyvbMgwy2wAjLC+44IJszrjiaEg6pq+zzjrZ1Eat2KxDv1JW6ihiO7fYYgtHb0qDDAHkCiuskH32i1566aVs9aJ8/fH+QCazehla6leazJklQz2aNd6v46J8K/WvGWIbDorHb6TGbBzvOxnM/uwXSXD7wwg0N0sDjEFmG6DiJbg8/fTTu42GJDNIJ3qCzVYL2ljSkeUIq7eLKZhOOeUUm6KkQYTZJpg3t3rKIroEsZpPfwWYvC43xMyPWb0G+1JLLZX1z7Se6obYgZHei6bG4ogP45g+FuXy+JrR4mdHuSi+vyN1zC1Zl9gOmprXS/VnIple6KAoU6bGvBXbzPRG56WOfTg7vr82Hp9L9WPbmdpoujSAOEdDG3nllVeyaTdmnXXWLn0xZ5pppmy1CiprllFrFWQm/vjHP2bbVNxeOtzT8X/GGWfMVjKiO0A7rssuqXYEa0suuWS3n99www1N74tZjRtiFnJgCVzWPM+RxaTuqu4Tr2ygD1m3eprQPo/yZvzflZ999hmB2ONRxkRQVlx39ivx/cJxjVgpdTSDf62G5/1HPOdjcfPyZDzv56l2k8Xr7BuP9Q7y+W+83sPxWmfF13+N8kRsc/HuZOL4fpbYHgbzbB1fMwXSFx0nBi+8GOX61LEkZb4KUtszk9lGuOOm39IvfvGL9NZbb3X5HZMIM7lx9bQg/YntZV3ySy+9tNvvCDRHjBiRrdYzcuTItPLKK2fTHZExMGsgDTwEbNxYVnv44Ye7ZRCbjbqKQJLR5kX0HWVFIufM7GKiqL/Xi2M2W53/93T8z44RnO0dX/8xyuupY53vIlbSuC0SFIdH2T11BHHjuiDwc6L/w+M5N+kMXOtZc5ntXzfVP4/nifFam6eO7CVLX1afvAyeeDb+5sIo23T+3Yfjeb734rhcE/u7bZRf8n0aIAEm/OS0kbzZnKk+CCpZg5cmKFAZrrfeetnk7azd3d+Vdo7tPf7449P888+fbV+xwz8IijfeeOPsdzSZ3XHHHdmUTWRlyW68++67WdDp/JdS++IzPPvss3dZKhd8vpkfsxU+4/QN5ab429/+9tif0R1pjjnmcJnarobH+7VuvF+1ZjE/i7+9JwKunVPHOt61YBTW5RF0PRzH/uL4ekThdwRxL0b5TfyeDAaBZt1BWTwvmdJ6mqY/iHJQvOaxNf79J1FGx9/vFa9Fqp5+n3manO19P47LLXFcTk4dS03+Kw1ABpltiGZoJmlnlOaGG244tgLkbnvNNdfMgrTzzjuv2/RB/YXAl0mPCRqZRL6nQUr8jKY05tDbcsstswvPs88+m601/Oqrr2YTJnMRYMlIAmiDTqm90K2HoK3ojTfeaJllYKmn3n777S4/o56ZfPLJu/UjHeS+37kGea2V8BtxLdov1R5gFj0b17sD4hrH6jiMGOMNujzej9988sknT6SOpuVGTB6B8kaxH7W+sQSFp8e2nJHq937830mxzbzmTqljLfN7Yp8uiOPCIIu30wBmkNmGqPgIwg455JCs4l5++eXH/o5+T/TbJDCjr1MrBGNsAwEigSaVOP2eyGr0hMwsZbrppsv6QjGgidH1L7zwQtYnlf6bTHdCAMr3Nq1L7YHWl+ogk3qMQTetgLqEoJeb82JQOdVUU2X9NJniyJvbNHEERwz2qXWADdm846PclRp3S5SRDO6J9+bK1NGc/mnqHVYnYrWgWt/QV+I1j0qNZxtfJ2MZx26aeB4GN/0uvn8tDQIGmW2Kyo7pgeifyfRGxWlBqMwZCPTMM89k/YxaoWIk20qmgCb+G2+8Me2www5ZsxSTMpPFHN820sQ+11xzZWXppZdOW2+9dRa0MqiIQp8uVuzwAiC1rmHDhnVrdmYuXW4iWwUDgGgpKgaZtBDZJ3OsmSIYH15HXftUHE8Cw3oG5FT7OJ7j/NQREH6Qem9IZ6Bca3M/2876zu+m3nkm9oNMJstL9TZIbht2NGlj3HkzIvKYY45J77333tifUwEwifABBxyQpp9++tQq8j6lTGtEszkZTeb+JDtJU3otzftkFPIJndk/ugXQ55MJ3m3SklrXuFodWunmsKdtsbWki5mizFjj33Lg7o7yRuo9ArMyAkwMizJXqj3+eT3Oi9tS7wfjcIFjGpVBE2DC27M2RoVIYHbOOedk/YbIauZ33ARcG2ywQdaxnmbqTz9tnfOabAbZC4LLRx99NJ111llZUMwcegsvvHCWsSSQZF9oOh/fRYi5NsnckhW9+uqrs6U26SpgVlNqfdRTrTSopqd6I1/iV9n7NU0E3VPV+OekqB/rfGwlk8U+zFTrexp/+2RkIB9KaohBZpvLJxI+9dRTs0CLqYDySpvmKVbXYcT29ddf3zIDgZB/wBnEk4/qvOaaa9LUU0+drcs+77zzZv02yVgSRJKRZd3znrKV/IzAlDXe55xzzizYZm5OLwxS62D5Rloyik3P9L2ebLLJWmY2DLanuo6hlYWuPspWxJk61b4yzr8iOGPi5t40lfcFOgZPVusfx3XkjQg0nci5QQaZAwDBFM3lBx98cJbRLE7BQWBG0EWH9vvvv78lA69ipoBJ2RlRznRGZDGZW4+LEKPOKezbAgsskP28p35Sa6yxRpYFZYQ6fVINNKXWQAsDQSY3vzkGKlJnVY/q7g/0/Z5mmmm6ZVbp703Li3VJGhLBFnPm1XogCC4/TK2HE3DaOv7+raSG2SdzgKDfEH0djzjiiKyJPEeFSVP0gQcemFXora4YcJLdyKcyuuyyy7JR85tttlmWnR01alR67bXug/O4ULAUHF0EuHhJ49PM/nY9vdZgClxosajOWHJDSGDXCmgtYcnbIoJL6qBWagVqI0NS/ROdN0O929Rqmdi2YpA5gHDBomn8hBNOSB988EGXn3/nO99Je++9d1sGXmw/wTKFbMjvf//7tOeee2aTuLOaEFOLVGPZylVWWcVO+8r0dB5wQ5IvZtAMPWXeCboGwznKZ5jPbvXysTRNs1BD9SIN/YHleocPH97lZwSZdL0xyBxQ6CNaz/yazaskBiCDzAEk75958sknp4suuqjL71hpY/vtt0/rr79+W69ekWc6aV678847s9WN2N/qDAl9q9hXR5wLfC6qb0aY/5DzpBk4D6edtmsLHYPx6MZCE/JgQAsLrRLVVlhhhaxbT3+iTpxvvvm6LXvJRPFMkca0RspW7mHm/FrvirhzqKdZullowq+njyVNgF5IGmSQOcAQgFGZM60PfTCLCDQZHEO/xnbPnuTZTdZwP/zww9Pvfve7br+fe+65s0FEZjMHN84F5j+sDjKZn7VZTbVMQl49nRiBC+dvK8380JdoXWE1surPIzNKEOD15+eUjDYtH9UtPY888kh2I2B/zEy2FGKqfQoe1jhfILVenFFXkMlI9Hj4elJDDDIHICpEMga77757NoCmiNHXzKvJaOyBEHyxr2Qbzj777PTmm292+R2rIbFqkES2kICumJHiJoXPQzOaapk1gWbh6m1iuVQC4MGAYPr222/PBtIUURexHG5/BXLUg9QT3HwXzwW296qrrurWxD+YffbZZ2PieNU6EGaS+NvFUx0juZuENcNfqvWP428XjJaIRZMaYpA5gD344IPZZOfV/TMZCLTvvvu2TIf7MjzxxBNZB/0iJm4n0JSYgoZzhBVmipixoK8/BwQxBJmsblVEFw8C38GE94BZH4o3uGSUmXqtetBNs/D6a6+9drfuDCxly2DKNm4qJ2pnup5hnWXi1PuBOEys/nqtfxzXm6XjYd7UO2wzS9p9I3XsQ2/Rwfb5VPuAnq/E+bpc6n2T+aRRRkQZVCNSDTIHMDqtM0E5c2gWl25jAAKDZnbZZZeW6HDfW3lf1OoLNvvJ9EcSAR1Z/er+jzTVMuCjrwOJxRdfvFv/T4KtnvooDmRMtXb55Zd3ufEF05JtvvnmWZeeZltxxRXTuuuu26X/NgN9br755uz9adOmcpp3V4ls/SFRTowyMsqh/CzK11Lj3ojj8USqvV/mDPG6O8fjFKlx08RzHBivexmP8f0cqZfBcnzeb46HWidn5bV+GGWR1PjrDo3z6/9i+y+I/Tg7rk3fS4Mk2DTIHMCoHLm4EmQyIrt4IeXu/Uc/+lFaZ511+nwgULOa5avXQLYvpooIGKqz3UzrxcCTvgwkCF4IZIr9/Tg3//rXv/Y4DddA96c//Sk99thj3X6+0UYbpeWWW66pn1vm291mm23SLLPM0uXnNJFzg16d+W4DZPpGxPl8UpQz42sCvM07y47xs1OjnBhfk2Fs5KSPy8jnN6X65r/8bpQNUu1rhRdNGJ+fteNxndhugrxdO7d/4yg0QTSaXRydOrKZtZ5sw+J1908dy2rWi+M8Zxy3PeJx7nie78fXJ8R19xfxPd0JGjkubcMgc4Dj4vnyyy9n0xcxyXmxAmcgwmGHHZYWWWSRPsnk8FoMeFhmmWWyjGlfXjx4fpokiwiwB+NFXD1jKhqm+CqiSwXBDU21fXF+8pw0yS+//PJdbuboR3z33XdnGbPBNKiEfWUpWfpQV98Uks089NBDsxW+mtFETd209dZbp9VXXz37Osd7ct5552X9R9tNBGSbx3l2RRznNaOQsaSJluYq5s8iUBoehYDtwvh+3dRYDMB65PUEaNPFNh2WOrKB9aSqJ4392TA+Q4ek/41Snyy2fdV4vjPj8Tfx/VqpYxWien0U59ixqY5gmdeNMjK+HJ5qD9A5vvPF/x0TZYXO7znZWDt9j9iPUVH2jq8H7OABg8xBgv5Fxx57bLdMDv3ECED7YgoRLqqswHPaaadlWVOC2r66kDP1CFPSFDHA4JVXXkkSCGoIMouLFYCBJzTVlt21gvOS/p5MHVbdVD569Oj0wAMPpMGI94FlbukzXj3/JIEmc+D2VV2R46aUKc54b4oBJrgZOf/889sxizljHLN9Uw0joSPgmS3KQamxzBx9Ha5KtTc3Y/rOTODuqaOP5rjmnhzS+bsZ4/rxo9gfmvhn6OHvCJhXIXiLr4+IslTn/9Vzx3ZL/P9f6/j7ieLvV49ycnxNczcB87gyqcRWNF38X/z9UVFWGsff0c90z/j9KfG4Sep4PwbUXadB5iBA9oCRkvSFOuqoo7pM5UKz+UorrZRmm222VCZek+wNmVKmJ+F1mSQ+f52yLiD583DBoG9dEYF19TROGrw4J2+66aZsMEcxuCHIYL5V+uVxPpVxbvIcfLZ22mmnLFNazGLSf/jiiy/OWhgG49Q4+Ty3TD329NNPd/kd/ai33XbbdNxxx2WD9soONHk+pivaYIMN0tFHH53NLlDEOuVkU5988sl2e2++FOfYNvFIJVjThsf+zR//s1mqv7n2P5EFPD+O5b31/FO83uzxegfH4yXxeHTqCNSYcmH2zjJPlGXjd/vH31wcX/M3w8fzlBOQmSUYjXJJfL9jqm+p7FdiH8iG1pM2J9Bcjb6VUc6OskP8jJHncxX2g8E9G8XvTotyIYFpGveAJd6rKeJvluH5InNLF4fWX5qvDq5dPohwYWWFnEUXXTS78BU7unNBLBPTtbBmel6J0yy51lprZRkdJk9nXksC395eRNiHESNGZPtTzEjkWSsC6sF4IVfPCG4uueSStMQSS3QZTcx5SUafVWnuuuuuXk+QTv9Lbnx23XXXLoNZON/JYNLfbzCvh81+0xzNfL4ElMVjRBBIX3GOFYFgvuJOGceK94WlabmpqJ63lKmkWMTixhtvzJrr2+y9IYu5ZGxzXYmj+J9l4uHUVN8KOHghgqKz4v8XS/VNURSbOISm4Tk7gy+yov9OHU3vZCJpjpohfjcs1YdZ9Jkbq56lmehfelW81g5RFkr1Jd3oD7pelBXjf2kaYT9IfbMfNFvQNEgzfj0xFvvPB2FAzWlmJnMQodJkYuH99tsvu5D2JdYPJ5gtIghkecuzzjornXjiiWnppZfOftZI9ij/H6Y+IWidY445uvz++eefT1dccYUBprrgnGHuQzKJxUnQyTTOO++86ZxzzskyaQwIqfe8zP+e4GX//ffPuqfQhaN4DjKX68iRI9OLL7446M9NMrrnnntuOv3007M+qkUEmptsskl2Q7DVVltla5w3mmXmf8iQLrnkkllrCq0qLNRQRMA/atSo9Ktf/SrbrjZ8b4iYG2n65k6rkb5Sn0fgf3U8nhvlPw38/ySdTfYLMc1RlG9HYcASzcf1BpgElpdHuTLVv874W3F+MDjqqVQ/AshpY5vnirJo5z4s0/n9dKn+JB4TPdP8/880gJjJHGSoPOmneNBBB6UzzzwzWxGnLzCanf6e9MVkBG+x0uYCvuWWW2YBJxeR2267LVtZg0xCvpbzuCp5fk5/Kvq6MWJ3n3326dbkxQWD5x1s08OoNsyZyblP/z/OwSJGGRMgkom/8sors8E5BKNkNns6J/NzlZaAYcOGZYPcNt1007Taaqt1m46H85LglgyeNz8dn2UylKecckr2/c4775x9tovHhv6y1FV06bnwwgvTfffdlwWk43o/cnlgyU0s3Wi4GSVY5fmq+2DyvjDi/cgjj2z31X0a3fBG/+/DyAQyNRJZvQ1T/y29+Ey0aB0X2/JOasyD9JuMc+b01H/rlDMK7uz4PLTfaLMvYJA5COVNVQceeGA66aSTug2YKQPNjlwcGElKMyRN2kVclKnw2YYdd9wxCzIJCmnipq8a8+kRdOajTLlgcBEnA8Fz0d9zwQUXzDIeRVx8GFRAptSmcvWEc4ImWBYkIHPJOZX3meR3ZM122GGHrN8e/TeZaojM/5gxY7IsV54BJSCi+ZWR6csuu2y2yAEZ/J4GEHEuX3bZZenggw/OgiTPyw4cB1odqCs4Ltttt123SesZ1PeDH/wgGwXOXKcE/gSbzDOar0lPPZH3t6Se4MaW+oFVfOgawc10sXtQjvk6GelOhrPN+8h+nurP4uGzVF8TcxFp5Wfi2P8yjtuUUVZM5UyWXo934vUPjvJgatzHEdz9JuoAMsG7pI6m92b6JM7d30VhtPsHaYAxyBykqJRpTiZjw3rmBHFlyrMUXFgffvjhbAAQ8xEyzVB1RU5Wkt+RVWKSeC7iFEaH5/026dPJxYOLCBf36mwEyEhce+21WXcARhB7Idf40DeSJlmWWeWmpToI4bxkdgTWtCb7yfnMY55t53yk8Nkha9nTZ4i/I8CkiwhNsQaY3XE8+KzT/5KAnuPEDWj1/L0cY4J5gkZuJgku6WNLywzfU6fRt5abhCmmmCKrM7iZ7el94W+fe+65bOYL5hFmJHmbvy9MG/Ji6pgwvGYsrxjnaG/XzXwmnoMR0owcZz7OZgWaL8Vr/jw11kzeDXNXRh3wdOwLo8cZfNOM+Ih+nFfFax4cj++mAcggc5CiQqVipuP9PPPMkw3K6elOv7evka+jznx0XKzpcM+8gTSZV+OiUpywmmxErQgqr7vuuqypk7kxvZDrixAAkkGnDyY3Wowur55qCNzU5FN81bsEJaOnyZaeccYZWdbM87Jn+cIRfIZpBWGC9A033DA73tXHjMCRQsaY94vZK+rBROt00aF5nBvgATIA683YB1axYeLymsdaRGB1YypnoMmT8Vx7RR3+cnyuNo1tmTv1HTKvo+P1WP3n2tTR1FyGD+NGkqmZPo7t36ZzYFJfTpRO38uLYj+YB7TmpTrbjUFmDQh+qiuhvqyUmlXh8TosxUiTNX3RFltssW6/L+t1yADRx+3WW2/N+qttscUWWXMWTfVkGhp5LTJLXJhYPYRmf5rJ+ytT1OoXqf7cvmZ+durFtjAIZ7fddsv6EfNIszfnZSMrYRG4cvNG0zqBDIN/CDQ5T1tlv5tdn9Uq3wYCvz322CPdcMMNWT1BKweZyd60ttAiQtP6vffemwX9d955ZzYIK78RHgA+jWDlos5pjL6VvjjQ/DzO1TvjkcE7jTaXV3svtoFph26O7dgnnv/bqWO0eFkDjOmnQubv6jgXfhWfM5aN6ovJVP8Q235HnBd7po6Viuj0TwamrBOFfXg8yhlxvBiw1Ghf0rZgkFkDmlK4uy6OgCzONdkbNNvQF6g4apLKrzjytS9xwWFOuAMOOCDLatL8By6KBIZlySty+loyTQgZC1Yaos8UnfoJcslukjEa38WdwJKmNS7i9Pe85pprsv5yBArF12km3juyVDTb5a/PY/X6zM3Ce/f666+PnYaHbeGc6o9lNskSMZgC+es38/yuBceH7eSc5FxiFPL3v//97KYrn+S/uu9vNd5rMmT0L2TN61tuuWXsWumtFshQd3F+FOswFmloxio7tcjfD24a6TvOYCrqiVVXXTV7P8hu1jLlGnUFdTbnG31rmTaKCeDzBSn6ejndfvB+vIcHxfFjne9Fx/eH8Vm8J8pe8eV7qVwEUPfEsd8yHhlpvWXntjCheqNZQU7Mt2N7/xzv2dWMao/PVV+OwOb1/tmZYWS99M3itZftnHqJ0XyNfJip/LigPhflqnhugvtH0iDQjJqPT/ItUZbv/J67ph9FOSf1zsTx5rP+6BeubtBbNJcNHz68S6VEhcyqHb25eHDRpYmagQfFCp6gloqQvlzNkF/8Wc4tDzJB5Vw9tUjZr8n+0+zFnIXf/OY308ILL5w1kxNs5k3nedN+HsgxaIOLBtvGz8Y3Gr0ZeH2a7bj45fvF9rB9XMybuW15/1UGT+TdH/Ljx+T0zZz/L19WlBuIYhaKAIKbBG4WWi2LlE+TQ1BJH0CmNWKgGZ9RboIIOPNjSBDD5N3cONGXkIn/+cwQ5OerxbTi/vF5I1grdo9he7nZbbVlLvPPNttKf+7ZZ589W9+cGSX4vFHYn/zvyFbyfvC+kBig3y3ZS96T/KavFTOXcU6tGg83pN4jkJszjtehcUxYFztf35uKiWvve2Qwo7D6zgupIzvYl6aI6+cccV6tFsd9sXhd5pqbuXM7h3aW/A1hGz8vbOtbnX1GH4pr73VxY/pQ6hgY0+y7IZbmnCSO6VqxLUsRbMbjbOxb6ji2xX1I6X/7wT4QDLO28d/i/+6IevDW+KyxDF1ZTfxfhG38VeqIufJtZBWln6e+yQJ3Y5BZo56yQGVVVuPKMDW7MuzLfaz3tQno8+xRHiRVT1vSahfDnvRXZrUn/XW8Wm17alW93XzPjU8xyCR4KWqHpteB8n6QzSTwLAaZtL7kM1MUtfq+lRhk5uj0/q2oR2k6nyV1XOsZCc4SS/elxua27C2ygMOjzBoB21fjPZuic9vygUIEZmNSR7M7c0bST5FA+K3UpICoRmwzccfMsR9fif0gS0swn59kVAqvxz6wL6TNX4rycmpeYFnU70GmzeU1Ggh9ML9IK/Xb40Je3SWhlftPtVo/w1bSDoFXT3rabjJlX/Q3rW6gvB/cdJI5rvXvBxmaoG6PepRVN/KUNQme/uynQnMxfREfjxs03hzKl1LXPptsX54FbFWvdJbUuR95VjaXb3/r9AnqRwaZakmD/AKhFuQ52Vp8P2ryaWrNYKfSWT5K7W0g7EOfcllJSZIklc4gU5IkSaUzyJQkSVLpDDIlSZJUOoNMSZIklc4gU5IkSaUzyJQkSVLpDDIlSZJUOoNMSZIklc4gU5IkSaUzyJQkSVLpDDIlSZJUOoNMSZIklc4gU5IkSaUzyJQkSVLpDDIlSZJUOoNMSZIklc4gU5IkSaUzyJQkSVLpDDIlSZJUOoNMSZIklc4gU5IkSaUzyJQkSVLpDDIlSZJUOoNMSZIklc4gU5IkSaUzyJQkSVLpDDIlSZJUOoNMSZIklc4gU5IkSaUzyJQkSVLpDDIlSZJUOoNMSZIklc4gU5IkSaUzyJQkSVLpDDIlSZJUuglTe/soyodJkqT2NCTK50kagNo5yPx0yJAhR1QqlSmTJEntiRbF55M0ALVzkPlZODdJkiSp5dgnU5IkSaUzyJQkSVLpDDIlSZJUOoNMSZIklc4gU5IkSaUzyJQkSVLpDDIlSZJUOoNMSZIklc4gU5IkSaUzyJQkSVLpDDIlSZJUOoNMSZIklc4gU5IkSaWbMPWPlaNMlCRJktQXJo4yb+pH/RFkThBlw84iSZKkAcjmckmSJJWuWZnMSmeRJEnSINCsIPO2KO8nSZIk9ZenUxMNSc3x5dTRF1OSJEn94+Mo/02SJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEnSIPL/tpTRoFuD8XYAAAAASUVORK5CYII=" alt="Logo Instituto.cc"></div>
            <div class="client-name">Instituto.cc</div>
            <div class="client-who">Instituto de palestras e desenvolvimento de lideranças.</div>
            <div class="client-desc">Diagnóstico estratégico via QR Code em palestras — IA gera análise personalizada na hora e qualifica o lead automaticamente.</div>
            <div class="card-cta">Ver demonstração <span class="arrow-ico">→</span></div>
          </button>
          <button class="client-card" data-demo="icc-cbf">
            <div class="client-logo-wrap"><img class="client-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAApkAAADCCAYAAAACedlPAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAC3GSURBVHgB7d0HmCRV1YDhuwsSVkCSRJFFchCEJUvwBwRJkiVIDoKABEEyKhlE4pIzAis5CQooWTIiQdKSMy5BwIDE/s9XM7XW9Mwu3T01Pd0z3/s89+mJ3VXV1bdOnZtSkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJUj8Ykppj1iiTJEmSJPUHYr53oryVmqQZQebQKH+MskySJElSfzkiykFRKqkJJkzNMUGUiZIkSZL6ywSpiYYmSZIkqWTNymQWkaIdE+XjJEmSpL5A1nKKKJOlftIfQebnUX4Z5YIkSZKkvkCAeUiUrVPzBnp30R9BJshi/jtJkiSpL5DJ/DT1I/tkSpIkqXQGmZIkSSqdQaYkSZJKZ5ApSZKk0hlkSpIkqXQGmZIkSSqdQaYkSZJKZ5ApSZKk0hlkSpIkqXQGmZIkSSqdQaYkSZJKZ5ApSZKk0k2Y2teQKFN3PkqS1I5I9rwX5eMkDTDtHGROOHTo0KMrlcrMSZKk9jQkrmO/iMd7kjTAtHOQyd3fikOGDPl6kiSpTUWQeWySBiD7ZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSmeQKUmSpNIZZEqSJKl0BpmSJEkqnUGmJEmSSjdhklpEpVL5wr8ZMmRIkjR41VJP5KwvpP5lkFmDoUOHpi9/+ctdKiwqun/+85+pt3ieKaecskvF+cknn6T//Oc/Ta0gJ5100vSlL32py88+/PDDbFv6Evs90UQTpemmmy7bhuHDh6eZZ545+xk+//zz9Oabb6bXXnst/fvf/04ffPBBev/997NtK/v49HQM+gv7zTnAY704X4cNG5Y95npzvk4wwQTZ+d8qOC6ffvppXf8zrmPyr3/9q66gpTc4t9iG4ut99tln2f7Uuw18PiaZZJLUCth29oF96WtTTTVVVl9SFlhggTTTTDOl6aefPqsLKJzjr776anrllVfSs88+m23Xu+++m9UdBpxS8xlkfgEq0HnnnTdtv/32XS60VFo777xzl4tWI8/9la98JZ1wwgljK2h+9vLLL6cTTzwxvffee6kZCK723HPPNNtss4292P33v/9Nl156abr99ttTX+B1pphiivTd7343Lbroomm55ZZLX/3qV9Nkk02WJp544rHHlb/76KOPssI2vfDCC+mxxx5Lf/nLX9KDDz6YXUjyC0xvTD755GnHHXdMc889d9OCjvHhHDj66KOzi2Q92PYFF1wwbb755tm5BY7NG2+8kQ466KDsONZzrHi+pZdeOm288cbZ+9LfCAovueSSdPfdd9f8P+zD17/+9fTjH/84TTvttGN/TvBxzDHHZMemrwOQ/DhutdVWXT7rjzzySDr77LPrep8J+tdYY4208sort8RN0T/+8Y90xhlnpKeeeqpX9WFPOEbsI+f0UkstlZZccsn0rW99K6uL+cxyTuY3pLyHHFvqCc5zbkj//ve/p/vuuy/df//96ZZbbklvvfVWKfWFpNZBrXNblEpnIQWxdeq9iaNCeylKpS9LVEaVlVZaqRIBX6UoKrBsf3r73DPMMEOlWlSUlfPPP78SQVif7lteIjtQeeihh7psQ1zMKxFE98nrRbaysvfee1ceeOCBbF8bwf9FdrMyatSoylprrVWJ4CE7no1uU2REKrfeemulVfB+RHa3oXNqzTXXrET2t8vzjR49uhIX5bqPEX+/zTbbdDv/+0sECdn21LsPiyyySOW5557r8lyR8apENqxX50092xA3ql1eP7LUlZtuuqnu9zkymJWjjjqqEje6lVbAcfzOd77T6/qwuswyyyyVuFmq3HHHHZUxY8ZUeiMy35Unn3yyEsFwZfHFF69EYNrn73k9JY7d95JUviminBaFJrE8BjskStPussxk1oAmy+pmy75sGopKJ33ve99LETyl3/72tw01mdYj6uAemx/L3kf2Iyr4LGu64oorpqmn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" alt="Logo Instituto.cc"></div>
            <div class="client-name">Instituto.cc · CBF Base Manager</div>
            <div class="client-who">Mesmo cliente do Instituto.cc — projeto encomendado para apoiar a Seleção Brasileira na Copa 2026.</div>
            <div class="client-desc">Plataforma de gestão da Base da Seleção: chat com IA que consulta o manual operacional do hotel em tempo real, dashboard de progresso por ambiente e agente de WhatsApp integrado.</div>
            <div class="card-cta">Ver demonstração <span class="arrow-ico">→</span></div>
          </button>
          <button class="client-card" data-demo="mpf">
            <div class="client-logo-wrap"><img class="client-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA1IAAAGICAMAAAB8wiFVAAAFyGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTEwLTI2VDE3OjA1OjI0LTAzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0xMC0yNlQxNzowODozMS0wMzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0xMC0yNlQxNzowODozMS0wMzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODNjNjMyZmUtYmYzNC03ZTQ4LWE3ZTctODJlYjBlZTNjMjc5IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6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" alt="Logo Bioete"></div>
            <div class="client-name">Grupo MPF · Bioete</div>
            <div class="client-who">Fabricante de micro-estações ecológicas de tratamento de esgoto, sediada na Bahia.</div>
            <div class="client-desc">Agente comercial qualifica leads de tráfego no WhatsApp e a secretária de backoffice cuida da operação inteira sozinha.</div>
            <div class="card-cta">Ver demonstração <span class="arrow-ico">→</span></div>
          </button>
          <button class="client-card" data-demo="remax">
            <div class="client-logo-wrap"><img class="client-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAokAAADGCAYAAAC+RhqxAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEsGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI2LTAxLTA2PC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPjNlMzBhMjM1LWJhNDktNDA5NC1hNzNmLTljNjQwZDBlMjA2ZDwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5EZXNpZ24gc2VtIG5vbWUgLSAxPC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8L2RjOnRpdGxlPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlv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" alt="Logo Max Lima RE/MAX"></div>
            <div class="client-name">Max Lima · RE/MAX</div>
            <div class="client-who">Corretor de imóveis parceiro RE/MAX.</div>
            <div class="client-desc">Agente atende o lead no WhatsApp, qualifica o imóvel de interesse e já cria o card no CRM com histórico e resumo prontos.</div>
            <div class="card-cta">Ver demonstração <span class="arrow-ico">→</span></div>
          </button>
        </div>
      </div>
      <div class="slide-footer"><span>RedPro AI Solutions</span><span>06 / 07</span></div>
    </section>

    <!-- SLIDE 7 -->
    <section class="slide" id="slide-7">
      <div class="close-title">RedPro <strong>AI Solutions</strong></div>
      <div class="close-tagline">Automação e IA aplicada, com método e prova real — pronta pra qualquer operação que precise sair do manual.</div>
      <div class="close-cta">Vamos conversar sobre o seu negócio</div>
      <div class="close-contact">Ana Clara &amp; Victor Lima · RedPro AI Solutions</div>
    </section>

    <!-- ===== DEMO OVERLAYS ===== -->

    <!-- DEMO: Automação de atendimento -->
    <div class="demo-overlay" id="demo-atendimento" data-demo-panel>
      <div class="demo-panel">
        <div class="demo-header">
          <div class="demo-header-label">
            <span class="demo-header-tag">Catálogo · 01</span>
            <span class="demo-header-title">Automação de atendimento — WhatsApp</span>
          </div>
          <button class="demo-close" data-close-demo aria-label="Fechar demonstração">×</button>
        </div>
        <div class="demo-body">
          <div class="demo-status"><span class="dot"></span> IA respondendo em tempo real</div>
          <div class="demo-chat" data-sequence>
            <div class="chat-bubble in"><span class="chat-tag">Cliente · 09:14</span>Oi, vi o anúncio de vocês. Quanto custa a consulta particular?</div>
            <div class="chat-bubble out"><span class="chat-tag">IA RedPro · 09:14</span>A consulta particular sai R$ 280. Você prefere encaixar essa semana ou na próxima?</div>
            <div class="chat-bubble in"><span class="chat-tag">Cliente · 09:15</span>Essa semana, se tiver. De preferência à tarde.</div>
            <div class="chat-bubble out"><span class="chat-tag">IA RedPro · 09:15</span>Tenho quinta às 15h20 ou sexta às 16h. Qual fica melhor?</div>
            <div class="chat-bubble in"><span class="chat-tag">Cliente · 09:16</span>Quinta às 15h20, por favor.</div>
            <div class="chat-bubble out"><span class="chat-tag">IA RedPro · 09:16</span>Agendado! Já lancei no seu CRM e mandei a confirmação por SMS. Até quinta 👋</div>
          </div>
        </div>
      </div>
    </div>

    <!-- DEMO: Automação de processos internos -->
    <div class="demo-overlay" id="demo-processos" data-demo-panel>
      <div class="demo-panel">
        <div class="demo-header">
          <div class="demo-header-label">
            <span class="demo-header-tag">Catálogo · 02</span>
            <span class="demo-header-title">Automação de processos internos — Backoffice</span>
          </div>
          <button class="demo-close" data-close-demo aria-label="Fechar demonstração">×</button>
        </div>
        <div class="demo-body">
          <div class="demo-status"><span class="dot"></span> Aquilo que alguém faria manualmente todo santo dia</div>
          <div class="before-after" data-sequence>
            <div class="ba-col ba-before">
              <div class="ba-col-tag">Antes</div>
              <div class="ba-scene">
                <div class="ba-line">📋 Vendedora confere pedido na planilha</div>
                <div class="ba-line">🔍 Procura o mesmo pedido no sistema financeiro</div>
                <div class="ba-line">😩 Percebe que um pedido de <b>R$ 3.400</b> nunca foi baixado</div>
                <div class="ba-line">📞 Liga pro financeiro pra avisar e corrigir</div>
                <div class="ba-time">≈ 40 min perdidos, todo dia</div>
              </div>
            </div>
            <div class="ba-arrow">→</div>
            <div class="ba-col ba-after">
              <div class="ba-col-tag">Com automação</div>
              <div class="ba-scene">
                <div class="ba-line">🤖 IA compara planilha, ERP e extrato sozinha</div>
                <div class="ba-line">⚠️ Encontra o pedido <b>#4471</b> sem baixa — R$ 3.400</div>
                <div class="ba-line">✅ Corrige o lançamento automaticamente</div>
                <div class="ba-line">💬 Avisa o financeiro só se precisar de decisão humana</div>
                <div class="ba-time">≈ 20 segundos, sem ninguém tocar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DEMO: Agentes de IA sob medida -->
    <div class="demo-overlay" id="demo-agentes" data-demo-panel>
      <div class="demo-panel">
        <div class="demo-header">
          <div class="demo-header-label">
            <span class="demo-header-tag">Catálogo · 03</span>
            <span class="demo-header-title">Agente de IA sob medida — Seu especialista particular</span>
          </div>
          <button class="demo-close" data-close-demo aria-label="Fechar demonstração">×</button>
        </div>
        <div class="demo-body">
          <div class="demo-status"><span class="dot"></span> Um agente treinado só pra decisões do seu negócio</div>
          <div class="demo-chat" data-sequence>
            <div class="chat-bubble in"><span class="chat-tag">Sócio · 14:02</span>Chegou o contrato novo do fornecedor. Tem alguma pegadinha aí que eu deveria saber antes de assinar?</div>
            <div class="chat-bubble out"><span class="chat-tag">Agente RedPro · 14:02</span>Tem uma, sim: o preço reajusta todo ano automaticamente e não tem limite máximo de aumento.</div>
            <div class="chat-bubble out"><span class="chat-tag">Agente RedPro · 14:03</span>E outra: se <b>você</b> quiser sair do contrato antes do prazo, paga multa. Se o fornecedor quiser sair, não paga nada.</div>
            <div class="chat-bubble in"><span class="chat-tag">Sócio · 14:03</span>Isso não pode. Dá pra já deixar isso mais justo?</div>
            <div class="chat-bubble out"><span class="chat-tag">Agente RedPro · 14:03</span>Já deixei pronto: reajuste com teto de 8% ao ano e multa valendo pros dois lados. Te mandei por e-mail pra revisar.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- DEMO: Diagnóstico de maturidade em IA -->
    <div class="demo-overlay" id="demo-diagnostico" data-demo-panel>
      <div class="demo-panel">
        <div class="demo-header">
          <div class="demo-header-label">
            <span class="demo-header-tag">Catálogo · 04</span>
            <span class="demo-header-title">Diagnóstico de maturidade em IA</span>
          </div>
          <button class="demo-close" data-close-demo aria-label="Fechar demonstração">×</button>
        </div>
        <div class="demo-body">
          <div class="demo-status"><span class="dot"></span> Roadmap gerado a partir do diagnóstico</div>
          <div class="demo-datagrid" data-sequence>
            <div class="data-tile"><div class="data-tile-label">Maturidade atual</div><div class="data-tile-value">22%</div><div class="data-tile-delta">Nível: Inicial</div></div>
            <div class="data-tile"><div class="data-tile-label">Processos automatizáveis</div><div class="data-tile-value">7</div><div class="data-tile-delta">de 12 mapeados</div></div>
            <div class="data-tile"><div class="data-tile-label">Ganho estimado</div><div class="data-tile-value">18h</div><div class="data-tile-delta">economizadas/semana</div></div>
          </div>
          <div class="demo-log">
            <div class="log-row demo-step" style="animation-delay:.1s"><span class="log-time">Fase 1</span><span class="log-text">Atendimento — <b>maior ganho</b>, menor complexidade</span><span class="log-badge">Prioridade alta</span></div>
            <div class="log-row demo-step" style="animation-delay:.3s"><span class="log-time">Fase 2</span><span class="log-text">Backoffice financeiro — conciliação e relatórios</span><span class="log-badge">Prioridade média</span></div>
            <div class="log-row demo-step" style="animation-delay:.5s"><span class="log-time">Fase 3</span><span class="log-text">Agentes internos — análise e apoio à decisão</span><span class="log-badge">Prioridade baixa</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- DEMO: ICC — Diagnóstico Estratégico -->
    <div class="demo-overlay" id="demo-icc" data-demo-panel>
      <div class="demo-panel">
        <div class="demo-header">
          <div class="demo-header-label">
            <span class="demo-header-tag">Cliente · Instituto.cc</span>
            <span class="demo-header-title">Diagnóstico estratégico via QR Code, ao vivo no evento</span>
          </div>
          <button class="demo-close" data-close-demo aria-label="Fechar demonstração">×</button>
        </div>
        <div class="demo-body">
          <div class="demo-status"><span class="dot"></span> Participante escaneou o QR Code no stand</div>
          <div class="doc-flow">
            <span class="stage-box active">QR Code no stand</span>
            <span class="arrow-ico">→</span>
            <span class="stage-box active">Formulário de 14 perguntas</span>
            <span class="arrow-ico">→</span>
            <span class="stage-box active">IA gera diagnóstico</span>
            <span class="arrow-ico">→</span>
            <span class="stage-box active">Email + lead qualificado</span>
          </div>
          <div class="demo-datagrid" data-sequence>
            <div class="data-tile"><div class="data-tile-label">Maturidade estratégica</div><div class="data-tile-value">61%</div><div class="data-tile-delta">Nível: Em desenvolvimento</div></div>
            <div class="data-tile"><div class="data-tile-label">Área mais crítica</div><div class="data-tile-value">Gestão</div><div class="data-tile-delta">de Pessoas</div></div>
            <div class="data-tile"><div class="data-tile-label">Tempo até o diagnóstico</div><div class="data-tile-value">8s</div><div class="data-tile-delta">do envio ao e-mail</div></div>
          </div>
          <div class="demo-chat" data-sequence>
            <div class="chat-bubble in"><span class="chat-tag">Participante · formulário</span>"Meu maior problema hoje é que a equipe não bate meta e eu não sei se é processo ou é gente."</div>
            <div class="chat-bubble out"><span class="chat-tag">Diagnóstico gerado por IA</span>Seu ponto de atenção é gestão de pessoas, não processo — os dados mostram clareza operacional acima da média, mas baixo alinhamento de metas. Recomendação prioritária: reunião individual de metas antes de qualquer nova ferramenta.</div>
            <div class="chat-bubble out"><span class="chat-tag">Sistema</span>Diagnóstico enviado por e-mail ao participante. Lead registrado no painel do Instituto.cc com score de prioridade para follow-up no stand.</div>
          </div>
          <div class="demo-links">
            <a class="demo-link-btn" href="https://diagnostico-icc.redpro.com.br/diagnostico" target="_blank" rel="noopener noreferrer">Abrir diagnóstico ao vivo <span class="arrow-ico">↗</span></a>
            <a class="demo-link-btn" href="https://mail.google.com/mail/u/0/#search/icc/FMfcgzQgMLzQNqjxqJpxMCBCRwwZxVrW" target="_blank" rel="noopener noreferrer">Ver resultado real (e-mail) <span class="arrow-ico">↗</span></a>
          </div>
        </div>
      </div>
    </div>

    <!-- DEMO: Instituto.cc — CBF Base Manager -->
    <div class="demo-overlay" id="demo-icc-cbf" data-demo-panel>
      <div class="demo-panel">
        <div class="demo-header">
          <div class="demo-header-label">
            <span class="demo-header-tag">Cliente · Instituto.cc</span>
            <span class="demo-header-title">CBF Base Manager — gestão operacional da Base na Copa 2026</span>
          </div>
          <button class="demo-close" data-close-demo aria-label="Fechar demonstração">×</button>
        </div>
        <div class="demo-body">
          <div class="demo-status"><span class="dot"></span> Gestão operacional da Base da Seleção — Copa 2026</div>
          <div class="client-desc" style="margin-bottom:16px; max-width:60ch;">Plataforma para a Base da Seleção Brasileira na Copa do Mundo 2026 (The Ridge Hotel, New Jersey): chat com IA para consultar o manual operacional do hotel em tempo real, dashboard de progresso de preparação por ambiente e agente de WhatsApp integrado — tudo pra coordenadores e diretores acompanharem a operação sem precisar procurar manual nenhum.</div>
          <div class="demo-log" data-sequence>
            <div class="log-row"><span class="log-time">Chat</span><span class="log-text">"Qual o protocolo de acesso ao <b>cluster de Imprensa</b>?"</span><span class="log-badge">Pergunta</span></div>
            <div class="log-row"><span class="log-time">IA</span><span class="log-text">Resposta gerada a partir do manual operacional (97 trechos indexados) — <b>3 segundos</b></span><span class="log-badge">Respondido</span></div>
            <div class="log-row"><span class="log-time">Roadmap</span><span class="log-text">42 ambientes mapeados em <b>7 clusters</b> — progresso de preparação em tempo real</span><span class="log-badge">Dashboard</span></div>
            <div class="log-row"><span class="log-time">WhatsApp</span><span class="log-text">Mesmo agente responde direto no grupo da coordenação, sem abrir sistema</span><span class="log-badge">Integrado</span></div>
          </div>
          <div class="demo-links">
            <a class="demo-link-btn" href="https://cbfmanager.redpro.com.br/" target="_blank" rel="noopener noreferrer">Abrir CBF Base Manager <span class="arrow-ico">↗</span></a>
          </div>
        </div>
      </div>
    </div>

    <!-- DEMO: Grupo MPF — Agente comercial + Secretária de backoffice -->
    <div class="demo-overlay" id="demo-mpf" data-demo-panel>
      <div class="demo-panel">
        <div class="demo-header">
          <div class="demo-header-label">
            <span class="demo-header-tag">Cliente · Grupo MPF · Bioete</span>
            <span class="demo-header-title">Dois agentes, uma operação: venda e backoffice no automático</span>
          </div>
          <button class="demo-close" data-close-demo aria-label="Fechar demonstração">×</button>
        </div>
        <div class="demo-body">
          <div class="demo-status"><span class="dot"></span> 2 agentes rodando na mesma operação</div>
          <div class="demo-tabs">
            <button class="demo-tab active" data-tab="mpf-comercial">Agente Comercial</button>
            <button class="demo-tab" data-tab="mpf-bia">Secretária de Backoffice</button>
          </div>
          <div class="demo-tab-panel active" id="mpf-comercial">
            <div class="demo-chat" data-sequence data-tabgroup="mpf">
              <div class="chat-bubble in"><span class="chat-tag">Lead (tráfego pago) · 10:02</span>Vi o anúncio de vocês. Minha fossa entupiu de novo, queria entender essa solução ecológica.</div>
              <div class="chat-bubble out"><span class="chat-tag">Agente Comercial · 10:02</span>Entendo — isso é bem comum com fossa convencional. Me conta, é pra uma residência ou um comércio? E mais ou menos quantas pessoas usam o sistema por dia?</div>
              <div class="chat-bubble in"><span class="chat-tag">Lead · 10:03</span>É uma pousada, umas 12 pessoas por dia.</div>
              <div class="chat-bubble out"><span class="chat-tag">Agente Comercial · 10:03</span>Perfeito, pra esse volume o modelo indicado é o Bioete 1850L — funciona por gravidade, sem energia elétrica, sem cheiro. Quer que eu te mande o material técnico com as dimensões?</div>
              <div class="chat-bubble in"><span class="chat-tag">Lead · 10:04</span>Quero sim, e o valor?</div>
              <div class="chat-bubble out"><span class="chat-tag">Agente Comercial · 10:04</span>R$ 6.199 à vista com 5% de desconto, ou 4x sem juros. Posso já te gerar um orçamento em PDF personalizado?</div>
            </div>
          </div>
          <div class="demo-tab-panel" id="mpf-bia">
            <div class="demo-log" data-sequence data-tabgroup="mpf">
              <div class="log-row"><span class="log-time">10:05</span><span class="log-text">Secretária recebeu pedido do Agente Comercial: <b>gerar orçamento Bioete 1850L</b> para a pousada</span><span class="log-badge">Recebido</span></div>
              <div class="log-row"><span class="log-time">10:05</span><span class="log-text">PDF de proposta comercial gerado e enviado ao lead pelo WhatsApp</span><span class="log-badge">Gerado</span></div>
              <div class="log-row"><span class="log-time">10:05</span><span class="log-text">Card movido no CRM: <b>Lead → Orçamento</b>, PDF anexado automaticamente</span><span class="log-badge">CRM atualizado</span></div>
              <div class="log-row"><span class="log-time">14:30</span><span class="log-text">Check-in automático: lembrete "ligar pra pousada" marcado como concluído</span><span class="log-badge">Rotina</span></div>
              <div class="log-row"><span class="log-time">16:12</span><span class="log-text">Venda confirmada — pedido lançado direto no ERP financeiro</span><span class="log-badge">Concluído</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DEMO: RE/MAX Max Lima — Agente + CRM -->
    <div class="demo-overlay" id="demo-remax" data-demo-panel>
      <div class="demo-panel">
        <div class="demo-header">
          <div class="demo-header-label">
            <span class="demo-header-tag">Cliente · Max Lima · RE/MAX</span>
            <span class="demo-header-title">Do lead no WhatsApp ao card no CRM, sem o corretor tocar</span>
          </div>
          <button class="demo-close" data-close-demo aria-label="Fechar demonstração">×</button>
        </div>
        <div class="demo-body">
          <div class="demo-status"><span class="dot"></span> Lead qualificado, card criado automaticamente</div>
          <div class="demo-chat" data-sequence>
            <div class="chat-bubble in"><span class="chat-tag">Lead · WhatsApp · 19:41</span>Boa noite, vi um apartamento de vocês no Lago Norte. Ainda tá disponível?</div>
            <div class="chat-bubble out"><span class="chat-tag">Assistente do Max · 19:41</span>Boa noite! Deixa eu confirmar: você procura pra comprar ou alugar? E quantos quartos você precisa?</div>
            <div class="chat-bubble in"><span class="chat-tag">Lead · 19:42</span>Comprar, 3 quartos, até uns 900 mil.</div>
            <div class="chat-bubble out"><span class="chat-tag">Assistente do Max · 19:42</span>Encontrei 2 opções no Lago Norte dentro desse perfil. Pra te mandar os detalhes certinhos, qual seu nome e um WhatsApp de contato?</div>
            <div class="chat-bubble in"><span class="chat-tag">Lead · 19:43</span>Estevão Passarinho, esse número mesmo.</div>
          </div>
          <div class="kanban-mini demo-step" style="animation-delay:.9s">
            <div class="kanban-mini-header"><span>CRM · Board Max Lima</span><span>criado automaticamente</span></div>
            <div class="kanban-stages">
              <span class="current">Novo Lead</span><span>Em Qualificação</span><span>Agendado</span><span>Follow-up</span><span>Fechamento</span>
            </div>
            <div class="kanban-card">
              <div class="kanban-card-top">
                <span class="kanban-card-name">Estevão Passarinho (Casa Lago Norte)</span>
                <span class="kanban-card-badge">whatsapp</span>
              </div>
              <div class="kanban-card-value">R$ 900.000 · Compra · 3 quartos</div>
              <div class="kanban-card-summary">📌 RESUMO DA CONVERSA - 07/07/2026 [19:43]
--------------------------------------------------
Lead veio de anúncio, interesse em imóvel Lago Norte. Comprar, 3 quartos, orçamento até R$ 900 mil. 2 opções compatíveis já localizadas na base. Aguardando retorno do corretor.</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="nav-controls">
      <button class="nav-btn" id="prevBtn" aria-label="Slide anterior">‹</button>
      <div class="nav-dots" id="navDots"></div>
      <button class="nav-btn" id="nextBtn" aria-label="Próximo slide">›</button>
      <span class="slide-counter" id="counter">1 / 7</span>
    </div>

  </div>
</div>

<script>
  var total = 7;
  var current = 1;
  var activeOverlay = null;
  var dotsEl = document.getElementById('navDots');

  for (var i = 1; i <= total; i++) {
    var dot = document.createElement('button');
    dot.className = 'nav-dot' + (i === 1 ? ' active' : '');
    dot.setAttribute('aria-label', 'Ir para slide ' + i);
    dot.addEventListener('click', (function(idx) { return function() { goTo(idx); }; })(i));
    dotsEl.appendChild(dot);
  }

  function goTo(n) {
    if (n < 1 || n > total) return;
    document.getElementById('slide-' + current).classList.remove('active');
    dotsEl.children[current - 1].classList.remove('active');
    current = n;
    document.getElementById('slide-' + current).classList.add('active');
    dotsEl.children[current - 1].classList.add('active');
    document.getElementById('counter').textContent = current + ' / ' + total;
  }

  function animateSteps(items, startDelay) {
    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove('demo-step');
      items[i].style.opacity = '0';
      void items[i].offsetWidth;
      items[i].classList.add('demo-step');
      items[i].style.animationDelay = (startDelay + i * 0.55) + 's';
    }
  }

  function playSequence(scope) {
    scope.querySelectorAll('[data-sequence]').forEach(function(seqContainer) {
      animateSteps(seqContainer.children, 0);
    });
    scope.querySelectorAll('.demo-step').forEach(function(el) {
      if (el.parentElement && el.parentElement.hasAttribute('data-sequence')) return;
      el.classList.remove('demo-step');
      el.style.opacity = '0';
      void el.offsetWidth;
      el.classList.add('demo-step');
    });
  }

  function openDemo(name) {
    var overlay = document.getElementById('demo-' + name);
    if (!overlay) return;
    activeOverlay = overlay;
    overlay.classList.add('open');
    var firstTab = overlay.querySelector('.demo-tab');
    if (firstTab) activateTab(overlay, firstTab.getAttribute('data-tab'));
    playSequence(overlay.querySelector('.demo-panel'));
  }

  function activateTab(overlay, tabName) {
    overlay.querySelectorAll('.demo-tab').forEach(function(t) {
      t.classList.toggle('active', t.getAttribute('data-tab') === tabName);
    });
    overlay.querySelectorAll('.demo-tab-panel').forEach(function(p) {
      p.classList.toggle('active', p.id === tabName);
    });
    var activePanel = overlay.querySelector('.demo-tab-panel.active');
    if (activePanel) playSequence(activePanel);
  }

  function closeDemo() {
    if (!activeOverlay) return;
    activeOverlay.classList.remove('open');
    activeOverlay = null;
  }

  document.getElementById('prevBtn').addEventListener('click', function() { goTo(current - 1); });
  document.getElementById('nextBtn').addEventListener('click', function() { goTo(current + 1); });

  var touchStartX = 0;
  document.getElementById('stage').addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  });
  document.getElementById('stage').addEventListener('touchend', function(e) {
    var diff = e.changedTouches[0].screenX - touchStartX;
    if (diff < -50) goTo(current + 1);
    if (diff > 50) goTo(current - 1);
  });

  document.querySelectorAll('[data-demo]').forEach(function(card) {
    card.addEventListener('click', function() {
      openDemo(card.getAttribute('data-demo'));
    });
  });

  document.querySelectorAll('[data-close-demo]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeDemo();
    });
  });

  document.querySelectorAll('.demo-tab').forEach(function(tab) {
    tab.addEventListener('click', function(e) {
      e.stopPropagation();
      var overlay = tab.closest('.demo-overlay');
      activateTab(overlay, tab.getAttribute('data-tab'));
    });
  });

  document.querySelectorAll('.demo-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeDemo();
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && activeOverlay) { closeDemo(); return; }
    if (activeOverlay) return;
    if (e.key === 'ArrowRight' || e.key === ' ') { goTo(current + 1); }
    if (e.key === 'ArrowLeft') { goTo(current - 1); }
  });
</script>
`;

export default function PitchDeckPage() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

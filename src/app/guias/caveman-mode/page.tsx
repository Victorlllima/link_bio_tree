"use client";

import Image from "next/image";
import { useState } from "react";

const skillOptions = [
  { name: "caveman", recommended: true, desc: "O skill principal. Ativa o modo ultra-direto no Claude Code. Comece por aqui." },
  { name: "caveman-compress", recommended: false, desc: "Comprime seu arquivo CLAUDE.md em caveman-speak — reduz tokens de leitura em ~46% por sessão." },
  { name: "caveman-help", recommended: false, desc: "Adiciona o comando /caveman-help com referência rápida de todos os comandos disponíveis." },
  { name: "caveman-review", recommended: false, desc: "Ativa modo comprimido para code review — respostas de revisão em formato telegráfico." },
  { name: "compress", recommended: false, desc: "Ferramenta standalone de compressão de arquivos de memória. Independente do modo caveman." },
];

const steps = [
  {
    num: "01",
    title: "Instale o skill via terminal",
    command: "# Windows (CMD ou PowerShell):\nnpx skills add JuliusBrussee/caveman --copy\n\n# Mac / Linux:\nnpx skills add JuliusBrussee/caveman",
    note: "Rode esse comando uma vez. A flag --copy é obrigatória no Windows — sem ela falha por limitação de symlinks.",
  },
  {
    num: "02",
    title: "Ative o modo no início da sessão",
    command: "/caveman",
    note: "Digite isso no chat do Claude Code quando quiser ativar. Você também pode escrever \"caveman mode\" ou \"less tokens please\" em português mesmo.",
  },
  {
    num: "03",
    title: "Continue trabalhando normalmente",
    command: "// Claude vai responder direto. Sem introduções. Sem conclusões.\n// O código continua igual — só o texto ao redor é comprimido.",
    note: "Você pede o código, ele entrega o código. Sem \"Claro! Vou te explicar como resolver isso da melhor forma...\"",
  },
  {
    num: "04",
    title: "Desative quando precisar de contexto",
    command: "stop caveman",
    note: "Se estiver aprendendo algo novo ou precisar de explicações detalhadas, desative. Caveman é para quem já sabe o que está fazendo.",
  },
];

const levels = [
  { cmd: "/caveman lite", label: "Lite", desc: "Remove fluff mas mantém gramática completa. Bom pra começar." },
  { cmd: "/caveman", label: "Full", desc: "Modo padrão. Fragmentos diretos, sem artigos. Corta ~65% dos tokens." },
  { cmd: "/caveman ultra", label: "Ultra", desc: "Máxima compressão. Telegráfico puro. Para sessões longas e intensas." },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={`text-xs font-bold px-3 py-1 rounded-md border transition-all ${
        copied
          ? "bg-green-600 border-green-600 text-white"
          : "bg-[#1a1a1a] border-[#333] text-[#888] hover:border-[#f97316] hover:bg-[#f97316] hover:text-black"
      }`}
    >
      {copied ? "Copiado!" : "Copiar"}
    </button>
  );
}

export default function CavemanModePage() {
  const installCmd = "npx skills add JuliusBrussee/caveman --copy";
  const [copiedInstall, setCopiedInstall] = useState(false);

  function copyInstall() {
    navigator.clipboard.writeText(installCmd);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  }

  return (
    <div className="bg-[#080808] min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/logo-ai-academy.png"
              alt="RedPro AI Academy"
              width={180}
              height={60}
              priority
            />
          </div>
          <span className="inline-block bg-[#f97316] text-black text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            🪨 Guia Prático
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4">
            Como ativar o<br />
            <span className="text-[#f97316]">Caveman Mode no Claude Code</span>
          </h1>
          <p className="text-[#888] text-sm font-light max-w-md mx-auto leading-relaxed">
            O skill que corta até 75% dos tokens de output — instalação em 30 segundos, resultado imediato.
          </p>
        </div>

        {/* CONTEXTO */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-white font-black text-sm mb-1">Por que isso funciona?</p>
              <p className="text-[#888] text-sm leading-relaxed">
                Toda vez que o Claude responde com <span className="text-[#ccc] font-mono">"Claro! Vou te explicar como..."</span> ou <span className="text-[#ccc] font-mono">"Espero que isso ajude!"</span>, ele está queimando tokens com palavras que você não precisa. O Caveman Mode ensina a IA a ir direto ao ponto — como um desenvolvedor sênior que fala com você, não com você.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "Tokens cortados", value: "−75%" },
              { label: "Velocidade", value: "+rápido" },
              { label: "Precisão do código", value: "100%" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#080808] border border-[#2a2a2a] rounded-xl p-3 text-center">
                <div className="text-[#f97316] font-black text-xl font-mono">{stat.value}</div>
                <div className="text-[#555] text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* STEPS */}
        <div className="flex flex-col gap-4 mb-10">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 relative overflow-hidden hover:border-[#f97316] transition-colors"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f97316] rounded-l-2xl" />
              <div className="text-[#f97316] text-xs font-black tracking-widest uppercase mb-2 font-mono">
                {step.num} / 04
              </div>
              <div className="text-white text-lg font-black tracking-tight mb-3">
                {step.title}
              </div>
              <div className="bg-[#080808] border border-[#333] rounded-xl p-4 text-[#ccc] text-sm font-mono leading-relaxed mb-3 relative">
                <div className="absolute top-3 right-3">
                  <CopyButton text={step.command} />
                </div>
                <pre className="pr-16 whitespace-pre-wrap break-all">{step.command}</pre>
              </div>
              <p className="text-[#888] text-xs leading-relaxed border-l-2 border-[#333] pl-3">
                {step.note}
              </p>
            </div>
          ))}
        </div>

        {/* SELEÇÃO DE SKILLS */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🎛️</span>
            <h2 className="text-white text-lg font-black tracking-tight">O que aparece na tela de instalação</h2>
          </div>
          <p className="text-[#888] text-sm leading-relaxed mb-5">
            Ao rodar o comando, uma tela interativa aparece com 6 skills para instalar. Use <kbd className="bg-[#333] text-[#ccc] px-1.5 py-0.5 rounded text-xs font-mono">espaço</kbd> para marcar ou desmarcar cada um e <kbd className="bg-[#333] text-[#ccc] px-1.5 py-0.5 rounded text-xs font-mono">Enter</kbd> para confirmar. Pode instalar quantos quiser.
          </p>
          <div className="flex flex-col gap-3">
            {skillOptions.map((skill) => (
              <div key={skill.name} className={`flex items-start gap-3 rounded-xl p-4 border ${skill.recommended ? "bg-[#f97316]/5 border-[#f97316]/30" : "bg-[#080808] border-[#2a2a2a]"}`}>
                <div className="shrink-0 mt-0.5">
                  <span className={`font-mono text-xs px-2 py-0.5 rounded border ${skill.recommended ? "bg-[#f97316] text-black border-[#f97316] font-black" : "bg-[#1a1a1a] text-[#555] border-[#333]"}`}>
                    {skill.recommended ? "[•]" : "[ ]"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-black font-mono">{skill.name}</span>
                    {skill.recommended && (
                      <span className="text-[#f97316] text-xs font-black uppercase tracking-widest">recomendado</span>
                    )}
                  </div>
                  <p className="text-[#888] text-xs leading-relaxed">{skill.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[#555] text-xs mt-4 border-l-2 border-[#333] pl-3">
            Para começar: marque só o <span className="text-[#ccc] font-mono">caveman</span>. Adicione os outros depois conforme precisar.
          </p>
        </div>

        {/* TELA 2 — SELEÇÃO DE AGENTE */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🤖</span>
            <h2 className="text-white text-lg font-black tracking-tight">Tela 2 — Escolha o agente</h2>
          </div>
          <p className="text-[#888] text-sm leading-relaxed mb-4">
            Depois de escolher os skills, o instalador pergunta em qual agente instalar. Use <kbd className="bg-[#333] text-[#ccc] px-1.5 py-0.5 rounded text-xs font-mono">↑↓</kbd> para navegar, <kbd className="bg-[#333] text-[#ccc] px-1.5 py-0.5 rounded text-xs font-mono">espaço</kbd> para selecionar e <kbd className="bg-[#333] text-[#ccc] px-1.5 py-0.5 rounded text-xs font-mono">Enter</kbd> para confirmar.
          </p>
          <div className="bg-[#080808] border border-[#333] rounded-xl p-4 font-mono text-xs mb-4">
            <div className="text-[#555] mb-2">— Universal (.agents/skills) — always included —</div>
            <div className="flex flex-col gap-1 mb-3">
              {["Amp", "Antigravity", "Cline", "Codex", "Cursor", "Gemini CLI", "GitHub Copilot"].map((a) => (
                <div key={a} className="flex items-center gap-2">
                  <span className="text-green-500">•</span>
                  <span className="text-[#ccc]">{a}</span>
                </div>
              ))}
            </div>
            <div className="text-[#555] mb-2">— Additional agents —</div>
            <div className="flex flex-col gap-1">
              {[
                { name: "Claude Code", path: "(.claude/skills)", highlight: true },
                { name: "OpenClaw", path: "(skills)" },
                { name: "IBM Bob", path: "(.bob/skills)" },
                { name: "Cursor", path: "(.codebuddy/skills)" },
              ].map((a) => (
                <div key={a.name} className={`flex items-center gap-2 px-2 py-0.5 rounded ${a.highlight ? "bg-[#f97316]/10" : ""}`}>
                  <span className={a.highlight ? "text-[#f97316]" : "text-[#555]"}>○</span>
                  <span className={a.highlight ? "text-[#f97316] font-black" : "text-[#ccc]"}>{a.name}</span>
                  <span className="text-[#555]">{a.path}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[#888] text-xs border-l-2 border-[#f97316] pl-3">
            Selecione <span className="text-white font-black">Claude Code</span> — é o agente que você usa. Os da lista Universal são instalados automaticamente em todos.
          </p>
        </div>

        {/* TELA 3 — LOCAL OU GLOBAL */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📍</span>
            <h2 className="text-white text-lg font-black tracking-tight">Tela 3 — Local ou Global?</h2>
          </div>
          <p className="text-[#888] text-sm leading-relaxed mb-4">
            Por último, o instalador pergunta onde instalar o skill:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div className="bg-[#080808] border border-[#333] rounded-xl p-4">
              <div className="text-[#555] text-xs font-black uppercase tracking-widest mb-2">Local</div>
              <p className="text-[#888] text-xs leading-relaxed">Instala só no projeto atual. O skill some quando você mudar de pasta.</p>
              <div className="mt-2 text-[#555] text-xs font-mono">.claude/skills/</div>
            </div>
            <div className="bg-[#080808] border border-[#f97316]/40 rounded-xl p-4">
              <div className="text-[#f97316] text-xs font-black uppercase tracking-widest mb-2">Global ← escolha esse</div>
              <p className="text-[#888] text-xs leading-relaxed">Instala para todos os projetos. O skill fica disponível em qualquer sessão do Claude Code.</p>
              <div className="mt-2 text-[#f97316] text-xs font-mono">~/.claude/skills/</div>
            </div>
          </div>
          <p className="text-[#555] text-xs border-l-2 border-[#333] pl-3">
            Escolha <span className="text-white font-bold">Global</span> — você vai querer o Caveman disponível em todos os seus projetos, não só no atual.
          </p>
        </div>

        {/* INSTALL CTA */}
        <button
          onClick={copyInstall}
          className="w-full bg-[#f97316] hover:opacity-90 text-black font-black text-sm py-4 rounded-xl transition-all mb-10"
        >
          {copiedInstall ? "Copiado! ✓" : "🪨 Copiar comando de instalação"}
        </button>

        {/* NÍVEIS */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 mb-8">
          <h2 className="text-white text-lg font-black tracking-tight mb-5">
            3 níveis de intensidade
          </h2>
          <div className="flex flex-col gap-3">
            {levels.map((lvl, i) => (
              <div key={i} className="flex items-start gap-4 bg-[#080808] border border-[#2a2a2a] rounded-xl p-4">
                <div className="shrink-0">
                  <span className="bg-[#f97316] text-black text-xs font-black px-2 py-0.5 rounded font-mono">{lvl.label}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <code className="text-[#f97316] text-xs font-mono block mb-1">{lvl.cmd}</code>
                  <p className="text-[#888] text-xs leading-relaxed">{lvl.desc}</p>
                </div>
                <CopyButton text={lvl.cmd} />
              </div>
            ))}
          </div>
        </div>

        {/* ALERTA */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-6 mb-10">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-white font-black text-sm mb-2">Isso não é para iniciantes</p>
              <p className="text-[#888] text-sm leading-relaxed">
                Os tokens que o Caveman corta são exatamente os que ensinam quem está aprendendo. Se você ainda está construindo sua base de conhecimento, mantenha o modo normal. Ative o Caveman quando você souber o que quer e só precisar que o Claude execute.
              </p>
            </div>
          </div>
        </div>

        {/* ANTES x DEPOIS */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 mb-10">
          <h2 className="text-white text-lg font-black tracking-tight mb-5">
            Antes × Depois
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[#080808] border border-[#333] rounded-xl p-4">
              <div className="text-[#555] text-xs font-black uppercase tracking-widest mb-3">Modo Normal</div>
              <p className="text-[#888] text-xs font-mono leading-relaxed">
                "Claro! Analisei seu banco no Supabase. Para buscar os usuários de forma otimizada, a melhor abordagem é usar este código SQL..."
              </p>
              <div className="mt-3 text-[#555] text-xs">35 tokens de introdução</div>
            </div>
            <div className="bg-[#080808] border border-[#f97316] rounded-xl p-4">
              <div className="text-[#f97316] text-xs font-black uppercase tracking-widest mb-3">🪨 Caveman Mode</div>
              <p className="text-[#ccc] text-xs font-mono leading-relaxed">
                "Busca Supabase:"<br />
                <span className="text-[#888]">[código direto]</span>
              </p>
              <div className="mt-3 text-[#f97316] text-xs font-bold">6 tokens. Mesmo resultado.</div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center">
          <p className="text-[#888] text-xs">Feito por <span className="text-[#f97316] font-bold">@redpro.ia</span></p>
          <p className="text-[#888] text-xs">RedPro AI Academy — Método S.H.A.R.K.</p>
        </div>

      </div>
    </div>
  );
}

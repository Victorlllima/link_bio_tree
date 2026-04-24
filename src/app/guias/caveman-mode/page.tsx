"use client";

import Image from "next/image";
import { useState } from "react";

const steps = [
  {
    num: "01",
    title: "Instale o skill via terminal",
    command: "claude plugin marketplace add JuliusBrussee/caveman && claude plugin install caveman@caveman",
    note: "Rode esse comando uma vez. O skill fica instalado para sempre no seu Claude Code — não precisa repetir.",
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
  const installCmd = "claude plugin marketplace add JuliusBrussee/caveman && claude plugin install caveman@caveman";
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

"use client";

import Image from "next/image";
import { useState } from "react";

const instructions = [
  {
    num: "01",
    title: "Sócio Estratégico",
    body: "Sempre responda como um sócio estratégico de negócios. Tom casual, direto, sem jargão técnico. Quando eu trouxer um problema, dê solução prática primeiro, contexto depois.",
    why: "Elimina as respostas longas e teóricas. Claude vai direto ao que você precisa fazer — sem enrolação.",
  },
  {
    num: "02",
    title: "Copy Conversacional",
    body: "Quando eu pedir copy, siga o estilo conversacional: primeira pessoa, exemplo concreto antes de teoria, quebras de linha generosas, sem floreio corporativo.",
    why: "Todo copy que Claude gerar já vai no seu tom — sem precisar pedir pra reescrever 3 vezes.",
  },
  {
    num: "03",
    title: "Decisão Direta",
    body: 'Nunca me dê lista de opções quando eu pedir uma decisão. Me dê sua recomendação direta com o porquê em uma linha. Se precisar de mais contexto, pergunta antes de responder.',
    why: "Chega de Claude devolver 5 opções quando você perguntou qual é a melhor. Ele decide. Você age.",
  },
  {
    num: "04",
    title: "Voz do Red",
    body: "Meu tom de voz pessoal: direto, primeira pessoa, sem promessas exageradas, entrega antes de pedir. Quando eu pedir pra escrever como eu, use: \"bora\", \"olha\", \"cara\", \"sem enrolação\", \"fica tranquilo\".",
    why: "Claude escreve como você, não como um robô corporativo. Qualquer post, email ou copy já sai no seu estilo.",
  },
  {
    num: "05",
    title: "Resumo Primeiro",
    body: "Se eu mandar um texto longo, resuma em até 3 bullets antes de responder. Se for código ou processo, explica passo a passo como se eu nunca tivesse visto antes.",
    why: "Você nunca vai se perder num wall of text de novo. Claude contextualiza antes de aprofundar.",
  },
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

export default function CustomInstructionsPage() {
  const allText = instructions
    .map((i, idx) => `${idx + 1}. ${i.body}`)
    .join("\n\n");

  const [copiedAll, setCopiedAll] = useState(false);

  function copyAll() {
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
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
            RedPro AI Academy
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4">
            5 Instruções Customizadas<br />
            <span className="text-[#f97316]">que mudam o seu negócio com Claude</span>
          </h1>
          <p className="text-[#888] text-sm font-light max-w-md mx-auto leading-relaxed">
            Configure uma vez. Nunca mais repita a mesma instrução. Seu Claude vai trabalhar do jeito que você precisa — sempre.
          </p>
        </div>

        {/* CARDS */}
        <div className="flex flex-col gap-4 mb-10">
          {instructions.map((inst) => (
            <div
              key={inst.num}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 relative overflow-hidden hover:border-[#f97316] transition-colors"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f97316] rounded-l-2xl" />
              <div className="text-[#f97316] text-xs font-black tracking-widest uppercase mb-2 font-mono">
                {inst.num} / 05
              </div>
              <div className="text-white text-lg font-black tracking-tight mb-3">
                {inst.title}
              </div>
              <div className="bg-[#080808] border border-[#333] rounded-xl p-4 text-[#ccc] text-sm font-mono leading-relaxed mb-3 relative">
                <div className="absolute top-3 right-3">
                  <CopyButton text={inst.body} />
                </div>
                <span className="pr-16">{inst.body}</span>
              </div>
              <p className="text-[#888] text-xs leading-relaxed border-l-2 border-[#333] pl-3">
                <span className="text-white font-bold">Por que usar:</span> {inst.why}
              </p>
            </div>
          ))}
        </div>

        {/* COPY ALL */}
        <button
          onClick={copyAll}
          className="w-full bg-[#f97316] hover:opacity-90 text-black font-black text-sm py-4 rounded-xl transition-all mb-10"
        >
          {copiedAll ? "Copiado! ✓" : "Copiar todas as 5 instruções de uma vez"}
        </button>

        {/* HOW TO */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 mb-10">
          <h2 className="text-white text-lg font-black tracking-tight mb-5">
            Como configurar em 2 minutos
          </h2>
          <div className="flex flex-col gap-4">
            {[
              "Acesse claude.ai e clique no seu avatar no canto superior direito",
              <>Clique em <strong className="text-white">Configurações</strong> → <strong className="text-white">Geral</strong></>,
              <>Role até <strong className="text-white">"Quais preferências pessoais o Claude deve considerar nas respostas?"</strong> — cole as instruções aqui</>,
              <>Clique em <strong className="text-white">Salvar</strong>. Pronto. Claude lembra pra sempre.</>,
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 bg-[#f97316] text-black text-xs font-black rounded-full flex items-center justify-center">
                  {i + 1}
                </div>
                <p className="text-[#ccc] text-sm leading-relaxed pt-1">{step}</p>
              </div>
            ))}
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

"use client";

import Image from "next/image";

export default function Dica065PromptsClaude() {
  return (
    <>
      <div className="bg-neutral-100 min-h-screen py-12 px-4">
        <div id="documento" className="max-w-5xl mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl">

          {/* CAPA */}
          <div className="relative bg-[#080808] px-16 pb-12 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#f97316] opacity-[0.08]" />
            <div className="absolute -bottom-10 left-[40%] w-44 h-44 rounded-full bg-[#f97316] opacity-[0.05]" />

            <div className="relative z-10 flex justify-center">
              <Image
                src="/images/logo-ai-academy.png"
                alt="RedPro AI Academy"
                width={420}
                height={280}
                className="-mt-14 -mb-10"
                priority
              />
            </div>

            <div className="relative z-10">
              <span className="inline-block bg-[#f97316] text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded mb-5">
                Dica 06/100
              </span>
              <h1 className="text-4xl font-extrabold text-white leading-tight max-w-xl mb-4">
                5 Prompts do Claude que{" "}
                <span className="text-[#f97316]">Ensinam Qualquer Coisa</span>{" "}
                do Zero ao Avançado
              </h1>
              <p className="text-neutral-400 text-base leading-relaxed max-w-lg">
                Sem pagar curso. Sem depender de professor. O Claude vira o melhor professor que você já teve — se você souber como perguntar.
              </p>
            </div>
          </div>

          {/* CORPO */}
          <div className="px-16 py-14">

            {/* INTRO */}
            <p className="text-[17px] text-neutral-500 leading-relaxed border-l-[3px] border-[#f97316] pl-5 mb-12">
              Você tem um negócio rodando e sempre aparece aquela skill que precisaria aprender — copy, tráfego, gestão, automação. Mas não tem tempo nem dinheiro pra ficar pagando curso atrás de curso. Esses 5 prompts fazem o Claude virar um professor personalizado, de graça, no seu ritmo.
            </p>

            {/* PROMPTS */}
            <div className="flex flex-col gap-12 mb-14">

              <Step number="01" title="Roadmap Completo do Zero ao Avançado">
                <p className="text-[15px] text-neutral-500 leading-relaxed mb-5">
                  Antes de aprender qualquer coisa, você precisa saber o caminho. Este prompt gera um mapa completo de aprendizado com apenas recursos gratuitos da internet.
                </p>
                <PromptBox label="Prompt 01 — Cole direto no Claude">
                  <QuoteBox>
                    "Quero aprender [SKILL] do zero ao avançado. Crie um roadmap completo com:<br /><br />
                    → Os conceitos fundamentais que eu preciso dominar primeiro<br />
                    → A sequência lógica de aprendizado (do básico ao avançado)<br />
                    → Apenas recursos gratuitos disponíveis na internet para cada etapa<br />
                    → Quanto tempo estimado para cada fase<br />
                    → Como saber que estou pronto para avançar para a próxima etapa<br /><br />
                    Seja específico para alguém que tem [X horas por semana] disponíveis."
                  </QuoteBox>
                </PromptBox>
                <Highlight icon="💡">
                  Substitua [SKILL] por qualquer coisa: copywriting, tráfego pago, gestão financeira, automação com IA. O mapa muda completamente para cada contexto.
                </Highlight>
              </Step>

              <Step number="02" title="Explicação em 4 Níveis de Profundidade">
                <p className="text-[15px] text-neutral-500 leading-relaxed mb-5">
                  Quando um conceito parece complicado demais, este prompt faz o Claude explicar do jeito mais simples possível — e vai aumentando a complexidade até você entender de verdade.
                </p>
                <PromptBox label="Prompt 02 — Cole direto no Claude">
                  <QuoteBox>
                    "Explique [CONCEITO] em 4 níveis diferentes:<br /><br />
                    → Nível 1 — Como se eu tivesse 10 anos (sem jargão, analogia simples)<br />
                    → Nível 2 — Como se eu fosse um iniciante no assunto<br />
                    → Nível 3 — Como se eu fosse um profissional do setor<br />
                    → Nível 4 — Como se eu fosse um especialista que quer ir fundo<br /><br />
                    Para cada nível, use uma analogia diferente com situações do dia a dia de um empreendedor."
                  </QuoteBox>
                </PromptBox>
              </Step>

              <Step number="03" title="Plano de 30 Dias — Meia Hora por Dia">
                <p className="text-[15px] text-neutral-500 leading-relaxed mb-5">
                  O problema não é falta de conteúdo. É falta de estrutura. Este prompt cria um plano diário realista para aprender qualquer skill sem tirar tempo do seu negócio.
                </p>
                <PromptBox label="Prompt 03 — Cole direto no Claude">
                  <QuoteBox>
                    "Crie um plano de aprendizado de 30 dias para [SKILL] com as seguintes restrições:<br /><br />
                    → Máximo 30 minutos por dia<br />
                    → Apenas recursos gratuitos<br />
                    → Foco em aplicação prática, não teoria<br />
                    → Cada semana deve ter um entregável concreto que eu consiga usar no meu negócio<br /><br />
                    Quero sair do zero e conseguir [RESULTADO ESPECÍFICO] ao final dos 30 dias."
                  </QuoteBox>
                </PromptBox>
                <Highlight icon="🎯">
                  Substitua [RESULTADO ESPECÍFICO] pelo que você quer conseguir fazer. Ex: "escrever minha própria copy de anúncio" ou "configurar meu primeiro agente de atendimento".
                </Highlight>
              </Step>

              <Step number="04" title="Diagnóstico de Pontos Cegos">
                <p className="text-[15px] text-neutral-500 leading-relaxed mb-5">
                  O que está te travando sem você perceber. Este prompt faz o Claude agir como um mentor que identifica os gaps que você nem sabe que tem.
                </p>
                <PromptBox label="Prompt 04 — Cole direto no Claude">
                  <QuoteBox>
                    "Sou empreendedor e quero melhorar em [SKILL]. Atualmente faço [DESCREVA O QUE VOCÊ FAZ HOJE].<br /><br />
                    Aja como um mentor experiente e me diga:<br />
                    → Quais são os 3 erros mais comuns que iniciantes cometem nessa área?<br />
                    → O que eu provavelmente estou fazendo errado sem perceber?<br />
                    → Qual é o conceito que a maioria ignora mas faz toda a diferença?<br />
                    → Se você pudesse me dar uma única mudança para implementar essa semana, qual seria?"
                  </QuoteBox>
                </PromptBox>
              </Step>

              <Step number="05" title="Projetos Práticos para Aprender Fazendo">
                <p className="text-[15px] text-neutral-500 leading-relaxed mb-5">
                  Leitura não ensina. Projeto ensina. Este prompt gera desafios práticos progressivos para você aprender aplicando diretamente no seu negócio.
                </p>
                <PromptBox label="Prompt 05 — Cole direto no Claude">
                  <QuoteBox>
                    "Quero aprender [SKILL] na prática, não lendo teoria. Crie 5 projetos progressivos para eu executar:<br /><br />
                    → Projeto 1: Nível iniciante — posso completar em 1 hora<br />
                    → Projeto 2: Nível básico — 2 a 3 horas<br />
                    → Projeto 3: Nível intermediário — meio dia<br />
                    → Projeto 4: Nível avançado — 1 a 2 dias<br />
                    → Projeto 5: Nível profissional — 1 semana<br /><br />
                    Cada projeto deve ter: objetivo claro, entregável concreto e como avaliar se ficou bom. Tudo aplicável a um negócio que fatura entre R$5k e R$50k por mês."
                  </QuoteBox>
                </PromptBox>
              </Step>

            </div>

            {/* TABELA RESUMO */}
            <div className="mb-14">
              <p className="text-xl font-extrabold text-[#080808] mb-5">Resumo dos 5 prompts</p>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#080808] text-white">
                    <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase">Prompt</th>
                    <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase">Para que serve</th>
                    <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase">Quando usar</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["01", "Roadmap completo", "Antes de começar a aprender qualquer coisa"],
                    ["02", "4 níveis de explicação", "Quando um conceito parece complicado demais"],
                    ["03", "Plano de 30 dias", "Quando precisa de estrutura e consistência"],
                    ["04", "Diagnóstico de pontos cegos", "Quando sente que algo não está funcionando"],
                    ["05", "Projetos práticos", "Quando quer aprender fazendo, não lendo"],
                  ].map(([num, uso, quando], i) => (
                    <tr key={i} className={i % 2 === 1 ? "bg-neutral-50" : "bg-white"}>
                      <td className="px-4 py-3 font-mono font-bold text-[#f97316] border-b border-neutral-100">{num}</td>
                      <td className="px-4 py-3 text-neutral-600 border-b border-neutral-100">{uso}</td>
                      <td className="px-4 py-3 text-neutral-600 border-b border-neutral-100">{quando}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CTA */}
            <div className="relative bg-[#080808] rounded-2xl px-12 py-10 overflow-hidden">
              <div className="absolute -top-14 -right-14 w-56 h-56 rounded-full bg-[#f97316] opacity-[0.07]" />
              <p className="text-xs font-bold tracking-widest uppercase text-[#f97316] mb-3">Próximo passo</p>
              <h3 className="text-2xl font-extrabold text-white leading-snug max-w-md mb-6 relative z-10">
                Aprenda a construir agentes de IA que trabalham pelo seu negócio 24/7
              </h3>
              <a
                href="https://www.instagram.com/redpro.ia"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-block bg-[#f97316] hover:opacity-85 transition-opacity text-white font-bold text-[15px] px-7 py-3 rounded-lg"
              >
                Segue @redpro.ia no Instagram →
              </a>
            </div>

          </div>

          {/* RODAPÉ */}
          <div className="flex items-center justify-between px-16 py-6 border-t border-neutral-100">
            <span className="text-xs text-neutral-400">
              © 2026 <strong className="text-[#f97316]">RedPro AI Academy</strong> — redpro.com.br
            </span>
            <span className="text-xs text-neutral-400">Dica 06/100</span>
          </div>

        </div>
      </div>
    </>
  );
}

/* ── COMPONENTES AUXILIARES ── */

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[48px_1fr] gap-x-6">
      <div className="w-12 h-12 rounded-xl bg-[#080808] text-[#f97316] font-mono font-bold text-lg flex items-center justify-center mt-0.5 flex-shrink-0">
        {number}
      </div>
      <div>
        <h2 className="text-[22px] font-extrabold text-[#080808] mb-3 leading-snug">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function PromptBox({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-neutral-50 border border-neutral-200 border-l-[3px] border-l-[#f97316] rounded-lg p-5 ${className}`}>
      <p className="font-mono text-[10px] font-bold tracking-widest uppercase text-[#f97316] mb-3">{label}</p>
      {children}
    </div>
  );
}

function QuoteBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-md p-4 font-mono text-[13px] text-neutral-700 leading-relaxed">
      {children}
    </div>
  );
}

function Highlight({ icon, children, className = "" }: { icon: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex gap-3 items-start bg-orange-50 border border-orange-100 rounded-xl p-5 mt-4 ${className}`}>
      <span className="text-xl flex-shrink-0 leading-snug">{icon}</span>
      <p className="text-[14px] text-neutral-700 leading-relaxed">{children}</p>
    </div>
  );
}

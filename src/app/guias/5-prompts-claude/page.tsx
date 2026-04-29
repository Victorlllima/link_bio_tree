"use client";

import Image from "next/image";
import { useState } from "react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 hover:text-[#f97316] transition-colors cursor-pointer"
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-green-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span className="text-green-500">Copiado!</span>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          Copiar
        </>
      )}
    </button>
  );
}

export default function Guia5PromptsClaude() {
  return (
    <>
      <div className="bg-neutral-100 min-h-screen py-12 px-4">
        <div id="documento" className="max-w-5xl mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl">

          {/* CAPA */}
          <div className="relative bg-[#080808] px-6 sm:px-16 pb-12 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#f97316] opacity-[0.08]" />
            <div className="absolute -bottom-10 left-[40%] w-44 h-44 rounded-full bg-[#f97316] opacity-[0.05]" />

            <div className="relative z-10 flex justify-center">
              <Image
                src="/images/logo-ai-academy.png"
                alt="RedPro AI Academy"
                width={420}
                height={280}
                className="-mt-8 sm:-mt-14 -mb-6 sm:-mb-10 w-48 sm:w-auto"
                priority
              />
            </div>

            <div className="relative z-10">
              <span className="inline-block bg-[#f97316] text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded mb-5">
                Guia Prático
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight max-w-2xl mb-4">
                5 Prompts que fazem o Claude te ensinar{" "}
                <span className="text-[#f97316]">qualquer coisa — de graça</span>
              </h1>
              <p className="text-neutral-400 text-base leading-relaxed max-w-lg">
                Não é curso. Não é mentoria. É o Claude configurado para ser o melhor professor que você nunca pagou.
              </p>
            </div>
          </div>

          {/* CORPO */}
          <div className="px-5 sm:px-16 py-8 sm:py-14">

            {/* INTRO */}
            <p className="text-[17px] text-neutral-500 leading-relaxed border-l-[3px] border-[#f97316] pl-5 mb-10">
              A maioria das pessoas abre o Claude e digita <em>"me explica X"</em>. Recebe uma resposta genérica. Fecha. Aprende nada. O problema não é o Claude — é o prompt. Estes 5 prompts transformam o Claude num sistema de aprendizado estruturado, progressivo e adaptado ao jeito que o seu cérebro funciona de verdade.
            </p>

            {/* PROMPTS */}
            <div className="flex flex-col gap-14">

              {/* PROMPT 1 */}
              <PromptSection
                number="01"
                title="O Roadmap Real"
                description="Em vez de te dar o caminho certo, o Claude revela os 3 erros que vão te travar — e constrói o roadmap a partir deles. Você aprende mais rápido porque já sabe onde vai errar antes de errar."
                badge="Ponto de partida"
                badgeColor="orange"
              >
                <PromptBox label="Cole no Claude">
                  <QuoteBox copyText={`Quero aprender [tema]. Mas antes de me dar um roadmap, faz o seguinte:

1. Me diz os 3 erros mais comuns que pessoas cometem ao aprender [tema] — os que travam o progresso por semanas.

2. Para cada erro, explica:
   — Por que esse erro acontece (qual é a lógica falsa por trás)
   — Qual é o sinal de que estou caindo nele
   — Como corrijo antes de perder tempo

3. Só depois de cobrir os 3 erros, me dá um roadmap de aprendizado estruturado que já leva esses armadilhas em consideração.

Meu nível atual: [iniciante / intermediário / avançado]
Meu objetivo: [o que quero ser capaz de fazer ao final]`}>{`Quero aprender [tema]. Mas antes de me dar um roadmap, faz o seguinte:

1. Me diz os 3 erros mais comuns que pessoas cometem ao aprender [tema] — os que travam o progresso por semanas.

2. Para cada erro, explica:
   — Por que esse erro acontece (qual é a lógica falsa por trás)
   — Qual é o sinal de que estou caindo nele
   — Como corrijo antes de perder tempo

3. Só depois de cobrir os 3 erros, me dá um roadmap de aprendizado estruturado que já leva essas armadilhas em consideração.

Meu nível atual: [iniciante / intermediário / avançado]
Meu objetivo: [o que quero ser capaz de fazer ao final]`}</QuoteBox>
                </PromptBox>
                <HowTo>
                  Substitua <strong>[tema]</strong>, <strong>[nível]</strong> e <strong>[objetivo]</strong> antes de colar. O Claude vai mapear as armadilhas do seu caminho específico — não um caminho genérico.
                </HowTo>
              </PromptSection>

              {/* PROMPT 2 */}
              <PromptSection
                number="02"
                title="O Mesmo Assunto em 4 Camadas de Realidade"
                description="O mesmo conceito explicado em 4 profundidades diferentes. Você escolhe onde a compreensão travou e sobe uma camada por vez — sem pular etapas, sem se perder no jargão."
              >
                <PromptBox label="Cole no Claude">
                  <QuoteBox copyText={`Explica o conceito de [tema/conceito] em 4 camadas de profundidade:

Camada 1 — Analogia do dia a dia
Explica como se fosse algo que eu vejo ou faço todos os dias. Sem termos técnicos. Uma frase de impacto + 2 parágrafos curtos.

Camada 2 — O mecanismo real
Como funciona de verdade, por baixo da analogia. Introduz os termos corretos, mas ainda conectado ao que eu já entendo.

Camada 3 — O contexto profissional
Como alguém que trabalha com isso pensa sobre o conceito. Quais decisões ele toma em função disso. O que muda quando você entende profundamente.

Camada 4 — As bordas e exceções
Onde o conceito quebra. Os casos em que ele não se aplica. O que os especialistas debatem sobre ele até hoje.

Começa pela Camada 1 e aguarda minha confirmação para avançar para a próxima.`}>{`Explica o conceito de [tema/conceito] em 4 camadas de profundidade:

Camada 1 — Analogia do dia a dia
Explica como se fosse algo que eu vejo ou faço todos os dias. Sem termos técnicos. Uma frase de impacto + 2 parágrafos curtos.

Camada 2 — O mecanismo real
Como funciona de verdade, por baixo da analogia. Introduz os termos corretos, mas ainda conectado ao que eu já entendo.

Camada 3 — O contexto profissional
Como alguém que trabalha com isso pensa sobre o conceito. Quais decisões ele toma em função disso. O que muda quando você entende profundamente.

Camada 4 — As bordas e exceções
Onde o conceito quebra. Os casos em que ele não se aplica. O que os especialistas debatem sobre ele até hoje.

Começa pela Camada 1 e aguarda minha confirmação para avançar para a próxima.`}</QuoteBox>
                </PromptBox>
                <HowTo>
                  O Claude vai entregar uma camada por vez e esperar você pedir a próxima. Isso força o processamento real — ao invés de você ler tudo de uma vez e reter nada.
                </HowTo>
              </PromptSection>

              {/* PROMPT 3 */}
              <PromptSection
                number="03"
                title="O Plano de 30 Dias que Respeita o Cérebro"
                description="A ciência do aprendizado diz: prática espaçada, não maratona. Este prompt gera um plano de 30 dias calibrado para como a memória de longo prazo realmente se forma — com revisões programadas e carga progressiva."
                badge="30 dias"
                badgeColor="blue"
              >
                <PromptBox label="Cole no Claude">
                  <QuoteBox copyText={`Cria um plano de aprendizado de 30 dias para eu dominar [tema].

Parâmetros obrigatórios do plano:

1. Blocos de estudo de no máximo 25 minutos por dia (princípio Pomodoro adaptado para retenção)

2. Revisão espaçada: os conceitos da semana 1 devem reaparecer na semana 3. Os da semana 2, na semana 4.

3. Carga progressiva: começa simples, aumenta complexidade gradualmente — nunca mais de 1 conceito novo por dia

4. Alternância de modalidades: um dia leitura/teoria, próximo dia prática/aplicação, terceiro dia revisão/teste

5. Ao final de cada semana: um mini-projeto de 1 hora que use tudo o que foi aprendido naquela semana

6. Indicador de progresso semanal: como eu sei que realmente aprendi o que era pra aprender

Meu contexto: [descreva quanto tempo por dia tem disponível e qual é o objetivo final]`}>{`Cria um plano de aprendizado de 30 dias para eu dominar [tema].

Parâmetros obrigatórios do plano:

1. Blocos de estudo de no máximo 25 minutos por dia (princípio Pomodoro adaptado para retenção)

2. Revisão espaçada: os conceitos da semana 1 devem reaparecer na semana 3. Os da semana 2, na semana 4.

3. Carga progressiva: começa simples, aumenta complexidade gradualmente — nunca mais de 1 conceito novo por dia

4. Alternância de modalidades: um dia leitura/teoria, próximo dia prática/aplicação, terceiro dia revisão/teste

5. Ao final de cada semana: um mini-projeto de 1 hora que use tudo o que foi aprendido naquela semana

6. Indicador de progresso semanal: como eu sei que realmente aprendi o que era pra aprender

Meu contexto: [descreva quanto tempo por dia tem disponível e qual é o objetivo final]`}</QuoteBox>
                </PromptBox>
                <HowTo>
                  A revisão espaçada é o mecanismo mais comprovado pela neurociência para reter informação. Este plano força isso — diferente de cursos que ensinam tudo na sequência e você esquece em 3 dias.
                </HowTo>
              </PromptSection>

              {/* PROMPT 4 */}
              <PromptSection
                number="04"
                title="O Diagnóstico do que Está Me Travando"
                description="Você descreve onde está emperrado. O Claude identifica se o bloqueio é técnico, conceitual ou psicológico — e prescreve o próximo passo específico para desbloquear. Não conselhos genéricos."
              >
                <PromptBox label="Cole no Claude">
                  <QuoteBox copyText={`Estou aprendendo [tema] e estou emperrado num ponto específico. Preciso que você diagnostique o que está me travando antes de dar qualquer conselho.

O que está acontecendo: [descreva exatamente onde você para, o que você tenta fazer e o que acontece]

Quero que você analise meu bloqueio em 3 categorias:

Categoria A — Bloqueio Técnico
Há alguma lacuna de conhecimento ou habilidade técnica que eu preciso preencher antes de conseguir avançar? Se sim, qual é a lacuna exata e o que eu preciso aprender primeiro?

Categoria B — Bloqueio Conceitual
Há alguma ideia que eu entendi errado ou que ainda não ficou clara o suficiente para eu conseguir aplicar? Se sim, qual é o conceito e como você me explicaria de forma que faça sentido agora?

Categoria C — Bloqueio de Método
Estou tentando aprender da forma errada para esse tipo de conteúdo? Há uma sequência, abordagem ou ferramenta diferente que funcionaria melhor para o que estou tentando fazer?

Após o diagnóstico, me dá apenas 1 próximo passo — o mais importante para destravar o progresso agora.`}>{`Estou aprendendo [tema] e estou emperrado num ponto específico. Preciso que você diagnostique o que está me travando antes de dar qualquer conselho.

O que está acontecendo: [descreva exatamente onde você para, o que você tenta fazer e o que acontece]

Quero que você analise meu bloqueio em 3 categorias:

Categoria A — Bloqueio Técnico
Há alguma lacuna de conhecimento ou habilidade técnica que eu preciso preencher antes de conseguir avançar? Se sim, qual é a lacuna exata e o que eu preciso aprender primeiro?

Categoria B — Bloqueio Conceitual
Há alguma ideia que eu entendi errado ou que ainda não ficou clara o suficiente para eu conseguir aplicar? Se sim, qual é o conceito e como você me explicaria de forma que faça sentido agora?

Categoria C — Bloqueio de Método
Estou tentando aprender da forma errada para esse tipo de conteúdo? Há uma sequência, abordagem ou ferramenta diferente que funcionaria melhor para o que estou tentando fazer?

Após o diagnóstico, me dá apenas 1 próximo passo — o mais importante para destravar o progresso agora.`}</QuoteBox>
                </PromptBox>
                <HowTo>
                  A maioria das pessoas trava por razões diferentes do que imagina. Quem acha que não entende o conceito muitas vezes está usando o método errado. O diagnóstico por categoria resolve isso.
                </HowTo>
              </PromptSection>

              {/* PROMPT 5 */}
              <PromptSection
                number="05"
                title="Projetos que Ensinam pelo Fracasso Controlado"
                description="O Claude cria mini-projetos com armadilhas intencionais. Você tenta. Erra. Descobre o erro. Aprende o conceito na prática — sem precisar de professor, sem precisar de sala de aula."
                badge="Aprenda errando"
                badgeColor="orange"
              >
                <PromptBox label="Cole no Claude">
                  <QuoteBox copyText={`Quero aprender [tema] através de projetos práticos que me façam errar de propósito.

Cria para mim uma sequência de 3 mini-projetos com estas características:

Mini-projeto 1 — Fundação
Um projeto simples, mas com uma armadilha oculta: algo que parece certo mas não funciona se eu não entender o conceito X. Não me conte qual é a armadilha agora.

Mini-projeto 2 — Complicação
Um projeto intermediário que combina dois conceitos. A armadilha aqui é que a solução óbvia funciona, mas existe uma solução mais elegante que só vejo se entender o conceito Y.

Mini-projeto 3 — Integração
Um projeto que parece simples mas exige que eu conecte tudo. Se eu pular etapas ou não entender o fundamento, não vou conseguir terminar.

Para cada projeto:
— Enunciado claro do que tenho que fazer
— Critério de sucesso (como saber se fiz certo)
— Só revela as armadilhas após eu dizer que terminei ou que desisti

Começa pelo Mini-projeto 1.`}>{`Quero aprender [tema] através de projetos práticos que me façam errar de propósito.

Cria para mim uma sequência de 3 mini-projetos com estas características:

Mini-projeto 1 — Fundação
Um projeto simples, mas com uma armadilha oculta: algo que parece certo mas não funciona se eu não entender o conceito X. Não me conte qual é a armadilha agora.

Mini-projeto 2 — Complicação
Um projeto intermediário que combina dois conceitos. A armadilha aqui é que a solução óbvia funciona, mas existe uma solução mais elegante que só vejo se entender o conceito Y.

Mini-projeto 3 — Integração
Um projeto que parece simples mas exige que eu conecte tudo. Se eu pular etapas ou não entender o fundamento, não vou conseguir terminar.

Para cada projeto:
— Enunciado claro do que tenho que fazer
— Critério de sucesso (como saber se fiz certo)
— Só revela as armadilhas após eu dizer que terminei ou que desisti

Começa pelo Mini-projeto 1.`}</QuoteBox>
                </PromptBox>
                <HowTo>
                  O erro controlado é um mecanismo pedagógico real chamado "desejável dificuldade". Quando você tenta antes de saber a resposta, o aprendizado é até 40% mais duradouro do que ler a teoria primeiro.
                </HowTo>
              </PromptSection>

            </div>

            {/* COMO USAR */}
            <div className="mt-14 mb-14 bg-[#080808] rounded-2xl p-8">
              <p className="text-xs font-bold tracking-widest uppercase text-[#f97316] mb-3">Como usar estes prompts</p>
              <h3 className="text-xl font-extrabold text-white mb-5">A sequência que funciona</h3>
              <div className="flex flex-col gap-3">
                {[
                  "Comece pelo Prompt 01 — ele mapeia as armadilhas antes de você cair nelas",
                  "Use o Prompt 03 para criar seu plano de 30 dias personalizado",
                  "Quando travar, use o Prompt 04 para diagnóstico antes de desistir",
                  "Use o Prompt 02 sempre que um conceito específico não fizer sentido",
                  "Use o Prompt 05 quando quiser transformar teoria em habilidade real",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-md bg-[#f97316] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-neutral-300 text-[14px] leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TABELA RESUMO */}
            <div className="mb-14">
              <p className="text-xl font-extrabold text-[#080808] mb-5">Resumo dos 5 prompts</p>
              <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#080808] text-white">
                      <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase">Prompt</th>
                      <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase">Nome</th>
                      <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase">Quando usar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["01", "O Roadmap Real", "No começo — antes de sair estudando no escuro"],
                      ["02", "4 Camadas de Realidade", "Quando um conceito não está claro"],
                      ["03", "Plano de 30 Dias", "Quando quer estrutura e consistência"],
                      ["04", "Diagnóstico do Bloqueio", "Quando travou e não sabe por quê"],
                      ["05", "Projetos com Armadilhas", "Quando quer transformar teoria em habilidade"],
                    ].map(([num, name, when], i) => (
                      <tr key={i} className={i % 2 === 1 ? "bg-neutral-50" : "bg-white"}>
                        <td className="px-4 py-3 font-mono font-bold text-[#f97316] border-b border-neutral-100">{num}</td>
                        <td className="px-4 py-3 text-neutral-800 font-semibold border-b border-neutral-100">{name}</td>
                        <td className="px-4 py-3 text-neutral-500 border-b border-neutral-100">{when}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA */}
            <div className="relative bg-[#080808] rounded-2xl px-6 sm:px-12 py-8 sm:py-10 overflow-hidden">
              <div className="absolute -top-14 -right-14 w-56 h-56 rounded-full bg-[#f97316] opacity-[0.07]" />
              <p className="text-xs font-bold tracking-widest uppercase text-[#f97316] mb-3">Próximo passo</p>
              <h3 className="text-2xl font-extrabold text-white leading-snug max-w-md mb-6 relative z-10">
                Aprenda a construir agentes de IA que trabalham por você 24/7
              </h3>
              <a
                href="https://redpro.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-block w-full sm:w-auto text-center bg-[#f97316] hover:opacity-85 transition-opacity text-white font-bold text-[15px] px-7 py-3 rounded-lg"
              >
                Conheça a RedPro AI Academy →
              </a>
            </div>

          </div>

          {/* RODAPÉ */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 px-5 sm:px-16 py-5 sm:py-6 border-t border-neutral-100">
            <span className="text-xs text-neutral-400">
              © 2026 <strong className="text-[#f97316]">RedPro AI Academy</strong> — redpro.com.br
            </span>
            <span className="text-xs text-neutral-400">Guia Prático</span>
          </div>

        </div>
      </div>
    </>
  );
}

/* ── COMPONENTES AUXILIARES ── */

function PromptSection({
  number, title, description, badge, badgeColor = "orange", children,
}: {
  number: string;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: "orange" | "blue";
  children: React.ReactNode;
}) {
  const badgeClass = badgeColor === "blue"
    ? "bg-blue-100 text-blue-700"
    : "bg-orange-100 text-[#f97316]";

  return (
    <div className="grid grid-cols-[40px_1fr] sm:grid-cols-[48px_1fr] gap-x-4 sm:gap-x-6">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#080808] text-[#f97316] font-mono font-bold text-base sm:text-lg flex items-center justify-center mt-0.5 flex-shrink-0">
        {number}
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h2 className="text-lg sm:text-[22px] font-extrabold text-[#080808] leading-snug">{title}</h2>
          {badge && (
            <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded ${badgeClass}`}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-[15px] text-neutral-500 leading-relaxed mb-4">{description}</p>
        {children}
      </div>
    </div>
  );
}

function PromptBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-neutral-50 border border-neutral-200 border-l-[3px] border-l-[#f97316] rounded-lg p-5 mb-3">
      <p className="font-mono text-[10px] font-bold tracking-widest uppercase text-[#f97316] mb-3">{label}</p>
      {children}
    </div>
  );
}

function QuoteBox({ children, copyText }: { children: React.ReactNode; copyText?: string }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-md overflow-hidden">
      {copyText && (
        <div className="flex justify-end px-4 py-2 border-b border-neutral-100 bg-neutral-50">
          <CopyButton text={copyText} />
        </div>
      )}
      <div className="p-4 font-mono text-[13px] text-neutral-700 leading-relaxed whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
}

function HowTo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-start bg-orange-50 border border-orange-100 rounded-xl p-4">
      <span className="text-lg flex-shrink-0">💡</span>
      <p className="text-[13px] text-neutral-700 leading-relaxed">{children}</p>
    </div>
  );
}

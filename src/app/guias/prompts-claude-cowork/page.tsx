"use client";

import Image from "next/image";
import { useState } from "react"; // usado pelo CopyButton

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

export default function GuiaPromptsClaudeCowork() {
  return (
    <>
      {/* DOCUMENTO */}
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
                Guia Prático
              </span>
              <h1 className="text-4xl font-extrabold text-white leading-tight max-w-2xl mb-4">
                5 Prompts Prontos para Automatizar sua Rotina com{" "}
                <span className="text-[#f97316]">Claude Cowork</span>
              </h1>
              <p className="text-neutral-400 text-base leading-relaxed max-w-lg">
                Descreva o que você quer. Saia da frente do computador. Volte com o trabalho feito.
              </p>
            </div>
          </div>

          {/* CORPO */}
          <div className="px-16 py-14">

            {/* INTRO */}
            <p className="text-[17px] text-neutral-500 leading-relaxed border-l-[3px] border-[#f97316] pl-5 mb-6">
              O <strong className="text-neutral-800">Claude Cowork</strong> é a versão do Claude que trabalha <strong className="text-neutral-800">por você</strong> — não só responde perguntas. Disponível no <strong className="text-neutral-800">Claude Desktop</strong> (Mac e Windows), ele acessa seus arquivos locais, executa tarefas em múltiplos passos e pode rodar automaticamente em horários programados.
            </p>

            <div className="flex gap-4 bg-neutral-50 border border-neutral-200 rounded-xl p-5 mb-4">
              <span className="text-xl flex-shrink-0">📌</span>
              <p className="text-[14px] text-neutral-600 leading-relaxed">
                <strong className="text-neutral-800">Disponível nos planos:</strong> Pro, Max, Team e Enterprise. Para agendar tarefas automáticas, o computador precisa estar ligado e o Claude Desktop aberto.
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 bg-[#080808] border border-white/10 rounded-xl px-6 py-4 mb-12">
              <div className="flex items-center gap-3">
                <span className="text-xl">⬇️</span>
                <p className="text-[14px] text-neutral-300 leading-relaxed">
                  Ainda não tem o Claude Desktop?{" "}
                  <strong className="text-white">Baixe gratuitamente para Mac e Windows.</strong>
                </p>
              </div>
              <a
                href="https://claude.com/download"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 bg-[#f97316] hover:opacity-85 transition-opacity text-white font-bold text-[13px] px-5 py-2.5 rounded-lg"
              >
                Baixar Claude Desktop →
              </a>
            </div>

            {/* PROMPTS */}
            <div className="flex flex-col gap-14">

              {/* PROMPT 1 */}
              <PromptSection
                number="01"
                title="O Briefing Matinal"
                description="Configure uma vez. Todo dia útil às 8h o Claude entrega um resumo do que importa — sem você abrir um único app."
                badge="Agendável"
                badgeColor="orange"
              >
                <PromptBox label="Cole no Claude Cowork">
                  <QuoteBox copyText={`Todo dia útil às 8h, execute esta tarefa:\n\nVerifique meu Gmail em busca de e-mails não lidos das últimas 24 horas e identifique tudo que é urgente ou precisa de resposta.\n\nEm seguida, verifique meu Google Agenda com os eventos de hoje e qualquer conflito de horário.\n\nCompile tudo em um documento chamado "Briefing Diário — [data].md" e salve na minha Área de Trabalho.\n\nFormato:\n- Seção 1: E-mails Urgentes\n- Seção 2: Agenda de Hoje\n- Seção 3: Prioridades do Dia\n\nExecute automaticamente todo dia útil.`}>{`Todo dia útil às 8h, execute esta tarefa:

Verifique meu Gmail em busca de e-mails não lidos das últimas 24 horas e identifique tudo que é urgente ou precisa de resposta.

Em seguida, verifique meu Google Agenda com os eventos de hoje e qualquer conflito de horário.

Compile tudo em um documento chamado "Briefing Diário — [data].md" e salve na minha Área de Trabalho.

Formato:
- Seção 1: E-mails Urgentes
- Seção 2: Agenda de Hoje
- Seção 3: Prioridades do Dia

Execute automaticamente todo dia útil.`}</QuoteBox>
                </PromptBox>
                <HowTo>
                  No Claude Desktop, clique em <strong>Programado</strong> na barra lateral → <strong>+ Nova tarefa</strong> → cole o prompt → defina o horário. Veja o passo a passo completo abaixo.
                </HowTo>
              </PromptSection>

              {/* PROMPT 2 */}
              <PromptSection
                number="02"
                title="O Organizador de Arquivos"
                description="Chega de pasta bagunçada. Cole o prompt, o Claude organiza tudo — renomeia, separa em subpastas e deleta lixo. Sem você mover um arquivo."
              >
                <PromptBox label="Cole no Claude Cowork">
                  <QuoteBox copyText={`Vou te dar acesso a uma pasta na minha Área de Trabalho chamada [NOME DA PASTA].\n\nPercorra todos os arquivos e faça o seguinte:\n\n1. Renomeie cada arquivo com este padrão:\n   [AAAA-MM-DD] — [Nome do Projeto] — [Tipo de Arquivo]\n\n2. Organize em subpastas por categoria:\n   Imagens / Documentos / Planilhas / Vídeos / Outros\n\n3. Delete arquivos duplicados e arquivos menores que 1KB que provavelmente são lixo\n\n4. Ao terminar, salve dentro da pasta um arquivo chamado "Relatório de Organização.txt" listando tudo que foi alterado`}>{`Vou te dar acesso a uma pasta na minha Área de Trabalho chamada [NOME DA PASTA].

Percorra todos os arquivos e faça o seguinte:

1. Renomeie cada arquivo com este padrão:
   [AAAA-MM-DD] — [Nome do Projeto] — [Tipo de Arquivo]

2. Organize em subpastas por categoria:
   Imagens / Documentos / Planilhas / Vídeos / Outros

3. Delete arquivos duplicados e arquivos menores que 1KB que provavelmente são lixo

4. Ao terminar, salve dentro da pasta um arquivo chamado "Relatório de Organização.txt" listando tudo que foi alterado`}</QuoteBox>
                </PromptBox>
                <HowTo>
                  Substitua <strong>[NOME DA PASTA]</strong> pelo nome real da pasta antes de colar. O Cowork lê e escreve diretamente no seu sistema de arquivos — sem upload, sem download.
                </HowTo>
              </PromptSection>

              {/* PROMPT 3 */}
              <PromptSection
                number="03"
                title="A Tarefa do Celular para o Desktop"
                description="Mandou do celular, já está pronto quando você sentar na mesa. Use o app mobile do Claude para delegar — o Cowork executa no Desktop enquanto você está em trânsito."
                badge="Mobile"
                badgeColor="blue"
              >
                <PromptBox label="Salve nas suas notas do celular">
                  <QuoteBox copyText={`Estou te enviando uma tarefa pelo celular.\n\nO que preciso: [descreva a tarefa — ex: "Pega o briefing do cliente chamado ProjetoX.pdf na minha pasta Downloads e transforma em um plano de projeto completo com etapas, prazos e responsáveis"]\n\nQuando terminar:\n- Salve o arquivo na minha Área de Trabalho dentro de uma pasta chamada "Pronto para Enviar"\n- Dê um nome claro para eu saber o que é quando chegar na mesa\n- Me avise quando estiver concluído`}>{`Estou te enviando uma tarefa pelo celular.

O que preciso: [descreva a tarefa — ex: "Pega o briefing do cliente chamado ProjetoX.pdf na minha pasta Downloads e transforma em um plano de projeto completo com etapas, prazos e responsáveis"]

Quando terminar:
- Salve o arquivo na minha Área de Trabalho dentro de uma pasta chamada "Pronto para Enviar"
- Dê um nome claro para eu saber o que é quando chegar na mesa
- Me avise quando estiver concluído`}</QuoteBox>
                </PromptBox>
                <HowTo>
                  Salve esse prompt nas notas do celular. Quando surgir uma tarefa, substitua o campo entre colchetes e envie pelo app mobile do Claude.
                </HowTo>
              </PromptSection>

              {/* PROMPT 4 */}
              <PromptSection
                number="04"
                title="O Relatório Semanal Automático"
                description="Configure uma vez. Toda sexta o relatório da semana já está pronto com os dados preenchidos e uma análise escrita pelo Claude."
                badge="Agendável"
                badgeColor="orange"
              >
                <PromptBox label="Cole no Claude Cowork">
                  <QuoteBox copyText={`Toda sexta-feira às 9h, execute esta tarefa:\n\n1. Abra minha planilha de métricas salva em [CAMINHO DO ARQUIVO]\n\n2. Extraia os números desta semana para:\n   [especifique as métricas — ex: "visualizações, seguidores, faturamento, leads"]\n\n3. Abra meu template de relatório salvo em [CAMINHO DO TEMPLATE]\n\n4. Preencha o template com os dados desta semana\n\n5. Adicione um parágrafo de análise: o que os números significam e o que focar na próxima semana\n\n6. Salve na pasta "Relatórios" com o nome:\n   "Relatório Semanal — [data].docx"\n\nExecute automaticamente toda sexta-feira.`}>{`Toda sexta-feira às 9h, execute esta tarefa:

1. Abra minha planilha de métricas salva em [CAMINHO DO ARQUIVO]

2. Extraia os números desta semana para:
   [especifique as métricas — ex: "visualizações, seguidores, faturamento, leads"]

3. Abra meu template de relatório salvo em [CAMINHO DO TEMPLATE]

4. Preencha o template com os dados desta semana

5. Adicione um parágrafo de análise: o que os números significam e o que focar na próxima semana

6. Salve na pasta "Relatórios" com o nome:
   "Relatório Semanal — [data].docx"

Execute automaticamente toda sexta-feira.`}</QuoteBox>
                </PromptBox>
                <HowTo>
                  Substitua os campos entre colchetes pelos caminhos reais dos seus arquivos antes de agendar. Clique em <strong>Programado</strong> na barra lateral → <strong>+ Nova tarefa</strong>.
                </HowTo>
              </PromptSection>

              {/* PROMPT 5 */}
              <PromptSection
                number="05"
                title="O Pipeline Pesquisa → Entregável"
                description="Faz a pesquisa na web e entrega uma apresentação pronta. Sem você abrir um único site, copiar nada ou montar slide algum."
              >
                <PromptBox label="Cole no Claude Cowork">
                  <QuoteBox copyText={`Pesquise a fundo a seguinte questão:\n[insira sua pergunta — ex: "Quais são as 5 estratégias de monetização de newsletter que estão funcionando em 2026?"]\n\nPassos:\n1. Pesquise na web por informações atuais sobre o tema\n2. Analise e filtre o que é mais relevante e confiável\n3. Compile em uma apresentação profissional com os slides:\n   - Slide de título\n   - Resumo executivo\n   - Um slide por achado principal com dados de apoio\n   - Slide de recomendações\n\n4. Salve na minha Área de Trabalho como:\n   "[Tema] — Relatório de Pesquisa.pptx"\n\nDeixe limpo, profissional e pronto para apresentar.`}>{`Pesquise a fundo a seguinte questão:
[insira sua pergunta — ex: "Quais são as 5 estratégias de monetização de newsletter que estão funcionando em 2026?"]

Passos:
1. Pesquise na web por informações atuais sobre o tema
2. Analise e filtre o que é mais relevante e confiável
3. Compile em uma apresentação profissional com os slides:
   - Slide de título
   - Resumo executivo
   - Um slide por achado principal com dados de apoio
   - Slide de recomendações

4. Salve na minha Área de Trabalho como:
   "[Tema] — Relatório de Pesquisa.pptx"

Deixe limpo, profissional e pronto para apresentar.`}</QuoteBox>
                </PromptBox>
                <HowTo>
                  Substitua o campo entre colchetes pela sua pergunta real. O Cowork pesquisa, sintetiza e cria o arquivo no seu computador — tudo em uma instrução.
                </HowTo>
              </PromptSection>

            </div>

            {/* COMO AGENDAR */}
            <div className="mt-14 mb-14 bg-[#080808] rounded-2xl p-8">
              <p className="text-xs font-bold tracking-widest uppercase text-[#f97316] mb-3">Para os Prompts 01 e 04</p>
              <h3 className="text-xl font-extrabold text-white mb-5">Como configurar tarefas agendadas</h3>
              <div className="flex flex-col gap-3">
                {[
                  "Abra o Claude Desktop",
                  "Clique em Programado na barra lateral esquerda",
                  "Clique em + Nova tarefa",
                  "Cole o prompt e defina a cadência (diária, semanal, mensal)",
                  "Pronto — o Claude executa sozinho no horário definido",
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
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#080808] text-white">
                    <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase">Prompt</th>
                    <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase">O que faz</th>
                    <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase">Quando usar</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["01", "Briefing Matinal", "Resume e-mails + agenda automaticamente", "Todo dia útil às 8h"],
                    ["02", "Organizador de Arquivos", "Renomeia, organiza e limpa pastas", "Pasta bagunçada"],
                    ["03", "Tarefa do Celular", "Executa no desktop via app mobile", "Fora de casa"],
                    ["04", "Relatório Semanal", "Preenche métricas e gera análise", "Toda sexta-feira"],
                    ["05", "Pesquisa → Apresentação", "Pesquisa na web e entrega arquivo pronto", "Antes de reuniões"],
                  ].map(([num, name, desc, when], i) => (
                    <tr key={i} className={i % 2 === 1 ? "bg-neutral-50" : "bg-white"}>
                      <td className="px-4 py-3 font-mono font-bold text-[#f97316] border-b border-neutral-100">{num}</td>
                      <td className="px-4 py-3 text-neutral-800 font-semibold border-b border-neutral-100">{name}</td>
                      <td className="px-4 py-3 text-neutral-500 border-b border-neutral-100">{desc}</td>
                      <td className="px-4 py-3 text-neutral-500 border-b border-neutral-100">{when}</td>
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
                Aprenda a construir agentes de IA que trabalham por você 24/7
              </h3>
              <a
                href="https://redpro.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-block bg-[#f97316] hover:opacity-85 transition-opacity text-white font-bold text-[15px] px-7 py-3 rounded-lg"
              >
                Conheça a RedPro AI Academy →
              </a>
            </div>

          </div>

          {/* RODAPÉ */}
          <div className="flex items-center justify-between px-16 py-6 border-t border-neutral-100">
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
    <div className="grid grid-cols-[48px_1fr] gap-x-6">
      <div className="w-12 h-12 rounded-xl bg-[#080808] text-[#f97316] font-mono font-bold text-lg flex items-center justify-center mt-0.5 flex-shrink-0">
        {number}
      </div>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-[22px] font-extrabold text-[#080808] leading-snug">{title}</h2>
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

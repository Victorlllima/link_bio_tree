"use client";

import Image from "next/image";
import { useState } from "react";

export default function GuiaPromptsClaudeCowork() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    const { default: html2pdf } = await import("html2pdf.js");
    const element = document.getElementById("documento");
    const options = {
      margin: 0,
      filename: "RedPro-Guia-5-Prompts-Claude-Cowork.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(element).save().then(() => {
      setDownloading(false);
    });
  };

  return (
    <>
      {/* BARRA DE DOWNLOAD */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3 bg-[#080808] border-b border-white/10">
        <span className="text-sm text-neutral-400 hidden sm:block">
          Guia RedPro — 5 Prompts Prontos para Automatizar sua Rotina com Claude Cowork
        </span>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 bg-[#f97316] hover:opacity-85 transition-opacity text-white font-bold text-sm px-5 py-2.5 rounded-lg disabled:opacity-60 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          {downloading ? "Gerando..." : "Baixar PDF"}
        </button>
      </div>

      {/* DOCUMENTO */}
      <div className="bg-neutral-100 min-h-screen pt-20 pb-16 px-4">
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
                Descreva o que você quer. Saia da frente. Volte com o trabalho feito.
              </p>
            </div>
          </div>

          {/* CORPO */}
          <div className="px-16 py-14">

            {/* INTRO */}
            <p className="text-[17px] text-neutral-500 leading-relaxed border-l-[3px] border-[#f97316] pl-5 mb-6">
              O <strong className="text-neutral-800">Claude Cowork</strong> é a versão do Claude que trabalha <strong className="text-neutral-800">por você</strong> — não só responde perguntas. Disponível no <strong className="text-neutral-800">Claude Desktop</strong> (Mac e Windows), ele acessa seus arquivos locais, executa tarefas em múltiplos passos e pode rodar automaticamente em horários programados.
            </p>

            <div className="flex gap-4 bg-neutral-50 border border-neutral-200 rounded-xl p-5 mb-12">
              <span className="text-xl flex-shrink-0">📌</span>
              <p className="text-[14px] text-neutral-600 leading-relaxed">
                <strong className="text-neutral-800">Disponível nos planos:</strong> Pro, Max, Team e Enterprise. Para agendar tarefas automáticas, o computador precisa estar ligado e o Claude Desktop aberto.
              </p>
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
                  <QuoteBox>{`Todo dia útil às 8h, execute esta tarefa:

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
                  No Claude Desktop, clique em <strong>Scheduled</strong> na barra lateral → <strong>New Scheduled Task</strong> → cole o prompt → defina o horário.
                </HowTo>
              </PromptSection>

              {/* PROMPT 2 */}
              <PromptSection
                number="02"
                title="O Organizador de Arquivos"
                description="Chega de pasta bagunçada. Cole o prompt, o Claude organiza tudo — renomeia, separa em subpastas e deleta lixo. Sem você mover um arquivo."
              >
                <PromptBox label="Cole no Claude Cowork">
                  <QuoteBox>{`Vou te dar acesso a uma pasta na minha Área de Trabalho chamada [NOME DA PASTA].

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
                  <QuoteBox>{`Estou te enviando uma tarefa pelo celular.

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
                  <QuoteBox>{`Toda sexta-feira às 9h, execute esta tarefa:

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
                  Substitua os campos entre colchetes pelos caminhos reais dos seus arquivos antes de agendar.
                </HowTo>
              </PromptSection>

              {/* PROMPT 5 */}
              <PromptSection
                number="05"
                title="O Pipeline Pesquisa → Entregável"
                description="Faz a pesquisa na web e entrega uma apresentação pronta. Sem você abrir um único site, copiar nada ou montar slide algum."
              >
                <PromptBox label="Cole no Claude Cowork">
                  <QuoteBox>{`Pesquise a fundo a seguinte questão:
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
                  "Clique em Scheduled na barra lateral esquerda",
                  "Clique em New Scheduled Task",
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

function QuoteBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-md p-4 font-mono text-[13px] text-neutral-700 leading-relaxed whitespace-pre-wrap">
      {children}
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

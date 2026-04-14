"use client";

import Image from "next/image";
import { useState } from "react";

export default function GuiaMigrarChatGPTClaude() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    const { default: html2pdf } = await import("html2pdf.js");
    const element = document.getElementById("documento");
    const options = {
      margin: 0,
      filename: "RedPro-Guia-01-Migrar-ChatGPT-Claude.pdf",
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
          Guia RedPro — Como Migrar do ChatGPT para o Claude
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
            {/* Círculos decorativos */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#f97316] opacity-[0.08]" />
            <div className="absolute -bottom-10 left-[40%] w-44 h-44 rounded-full bg-[#f97316] opacity-[0.05]" />

            {/* Logo */}
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

            {/* Tag + Título */}
            <div className="relative z-10">
              <span className="inline-block bg-[#f97316] text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded mb-5">
                Guia Prático
              </span>
              <h1 className="text-4xl font-extrabold text-white leading-tight max-w-xl mb-4">
                Como Migrar do{" "}
                <span className="text-[#f97316]">ChatGPT</span>{" "}
                para o Claude
              </h1>
              <p className="text-neutral-400 text-base leading-relaxed max-w-lg">
                Não perca seu histórico nem suas preferências. Faça a troca em 3 passos — e chegue lá sem começar do zero.
              </p>
            </div>
          </div>

          {/* CORPO */}
          <div className="px-16 py-14">

            {/* INTRO */}
            <p className="text-[17px] text-neutral-500 leading-relaxed border-l-[3px] border-[#f97316] pl-5 mb-12">
              Você já usou o ChatGPT por meses. Tem preferências, jeitos de trabalhar, contextos importantes acumulados. A boa notícia: você não precisa começar do zero. O Claude tem uma funcionalidade de{" "}
              <strong className="text-neutral-800">Importação de Memória</strong> — e em 3 passos você traz tudo que importa para cá.
            </p>

            {/* STEPS */}
            <div className="flex flex-col gap-12 mb-14">

              {/* PASSO 01 */}
              <Step number="01" title="Crie sua Identidade Digital">
                <p className="text-[15px] text-neutral-500 leading-relaxed mb-5">
                  Você tem duas formas de fazer isso. Escolha a que preferir — ou faça as duas para um resultado mais completo.
                </p>

                <PromptBox label="Forma 1 — Exportação completa (recomendada para quem usa o ChatGPT há muito tempo)">
                  <SubLabel>1a. Gere sua Identidade Digital</SubLabel>
                  <p className="text-[13px] text-neutral-600 leading-relaxed mb-3">
                    Abra uma conversa nova no ChatGPT e cole o prompt abaixo. Ele vai varrer sua memória, instruções personalizadas e histórico recente para gerar um documento limpo sobre você.
                  </p>
                  <QuoteBox>
                    "Estou migrando meu contexto para o Claude. Por favor, escaneie sua Memória, Instruções Personalizadas e histórico recente para gerar um resumo abrangente de 'Identidade Digital'. Inclua:<br /><br />
                    → <strong>Perfil do usuário:</strong> minha formação profissional e objetivos atuais<br />
                    → <strong>Estilo de comunicação:</strong> meu tom preferido e formatação<br />
                    → <strong>Preferências técnicas:</strong> ferramentas que uso e estilos de trabalho<br />
                    → <strong>Conhecimentos-chave:</strong> fatos que você 'lembrou' sobre meu negócio ou vida<br /><br />
                    Formate como um documento Markdown limpo e disponibilize para download como id_digital.md"
                  </QuoteBox>

                  <SubLabel className="mt-4">1b. Exporte seu histórico completo</SubLabel>
                  <p className="text-[13px] text-neutral-600 leading-relaxed mb-2">
                    Para levar também suas conversas antigas:
                  </p>
                  <StepList items={[
                    <span key="1">No ChatGPT: <strong>Configurações → Controlar Dados → Exportar Dados → Confirmar exportação</strong></span>,
                    "Aguarde o e-mail da OpenAI e baixe o arquivo .zip",
                    <span key="2">Extraia e localize o arquivo <strong>conversations.json</strong></span>,
                  ]} />

                  <SubLabel className="mt-4">1c. Transplante completo para o Claude</SubLabel>
                  <p className="text-[13px] text-neutral-600 leading-relaxed mb-3">
                    No Claude, crie um novo Projeto chamado <strong>"Meu Contexto"</strong>. Faça upload dos dois arquivos: <strong>id_digital.md</strong> e <strong>conversations.json</strong>. Depois cole esse prompt:
                  </p>
                  <QuoteBox>
                    "Estou migrando meu workspace do ChatGPT para o Claude. Fiz upload de dois arquivos:<br /><br />
                    → <strong>id_digital.md:</strong> meu perfil e guia de estilo<br />
                    → <strong>conversations.json:</strong> meu histórico completo<br /><br />
                    Sua tarefa: use o id_digital como 'Instruções de Sistema' para saber como falar comigo. Indexe o conversations.json para entender meus projetos e soluções técnicas anteriores. Depois me dê um breve resumo de quem sou como usuário e liste 3 'Insights-Chave' que você extraiu para confirmar que absorveu os dados com sucesso."
                  </QuoteBox>
                </PromptBox>

                <PromptBox label="Forma 2 — Import oficial do Claude (mais rápida)" className="mt-4">
                  <p className="text-[13px] text-neutral-600 leading-relaxed mb-3">
                    O Claude tem uma página oficial de importação que gera o prompt certo automaticamente — compatível com ChatGPT, Gemini e Grok:
                  </p>
                  <StepList items={[
                    <span key="1">Acesse <strong>claude.com/import-memory</strong></span>,
                    "Copie o prompt gerado pelo Claude",
                    "Cole no ChatGPT (ou Gemini / Grok) e copie o resultado",
                    "Volte ao Claude e cole o resultado nas configurações de memória",
                    "Pronto — o Claude atualiza a memória automaticamente",
                  ]} />
                </PromptBox>
              </Step>

              {/* PASSO 02 */}
              <Step number="02" title="Ative a Memória no Claude">
                <p className="text-[15px] text-neutral-500 leading-relaxed mb-4">
                  Antes de importar, certifique-se que a memória está ativa. O caminho correto é:
                </p>
                <StepList items={[
                  <span key="1">Acesse <strong>claude.ai</strong></span>,
                  <span key="2">Vá em <strong>Configurações → Capacidades → Memória</strong></span>,
                  <span key="3">Ative <strong>"Pesquisar e referenciar conversas"</strong> e <strong>"Gerar memória do histórico de conversas"</strong></span>,
                  <span key="4">Para importar de outra IA: clique em <strong>"Iniciar Importação"</strong> na seção "Importar memória de outros provedores de IA"</span>,
                ]} />
                <Highlight icon="💡">
                  O Claude agora sabe como você trabalha — sem você precisar explicar tudo de novo em cada nova conversa. A memória fica disponível em todos os chats e projetos.
                </Highlight>
              </Step>

              {/* PASSO 03 */}
              <Step number="03" title="Explore os cursos oficiais da Anthropic e instale Skills">
                <p className="text-[15px] text-neutral-500 leading-relaxed mb-4">
                  A Anthropic tem uma plataforma gratuita de aprendizado em <strong>anthropic.skilljar.com</strong>. Use o Claude para extrair o que é mais relevante para você e já instalar as Skills certas.
                </p>
                <StepList items={[
                  <span key="1">Acesse <strong>anthropic.skilljar.com</strong></span>,
                  "Copie a URL da plataforma",
                  <span key="2">Abra o <strong>Claude Code</strong> e cole a URL com o seguinte pedido:</span>,
                ]} />
                <PromptBox label="Cole no Claude Code" className="mt-3">
                  <QuoteBox>
                    "Analise os cursos disponíveis em anthropic.skilljar.com. Com base no que você sabe sobre mim e meu contexto, extraia e resuma os conteúdos mais relevantes. Em seguida, instale as Claude Skills que fazem mais sentido para o meu perfil."
                  </QuoteBox>
                </PromptBox>
                <Highlight icon="🎓" className="mt-4">
                  <strong>Por que isso funciona:</strong> o Claude já tem sua Identidade Digital importada. Ele usa esse contexto para filtrar os cursos e instalar apenas as Skills que realmente fazem sentido para você.
                </Highlight>
              </Step>

            </div>

            {/* BÔNUS */}
            <div className="grid grid-cols-[48px_1fr] gap-x-6 mb-14">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#f97316] font-bold text-xl flex items-center justify-center mt-0.5">★</div>
              <div>
                <h2 className="text-[22px] font-extrabold text-[#080808] mb-3">Bônus: Rode os dois em paralelo por uma semana</h2>
                <p className="text-[15px] text-neutral-500 leading-relaxed mb-2">
                  Não abandone o ChatGPT de uma vez. Use o Claude para as mesmas tarefas durante 7 dias. Compare os resultados, ajuste conforme precisar.
                </p>
                <p className="text-[15px] text-neutral-500 leading-relaxed">
                  Depois disso, você vai saber exatamente o que funciona melhor para você — e a troca vai acontecer de forma natural.
                </p>
              </div>
            </div>

            {/* TABELA RESUMO */}
            <div className="mb-14">
              <p className="text-xl font-extrabold text-[#080808] mb-5">Resumo dos 3 passos</p>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#080808] text-white">
                    <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase">Passo</th>
                    <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase">O que fazer</th>
                    <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase">Onde</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["01", "Criar sua Identidade Digital", "ChatGPT (prompt manual) ou claude.com/import-memory"],
                    ["02", "Ativar e importar memória", "claude.ai → Configurações → Capacidades → Memória"],
                    ["03", "Explorar cursos + instalar Skills", "anthropic.skilljar.com + Claude Code"],
                    ["★", "Rodar os dois em paralelo", "7 dias — sem pressa"],
                  ].map(([step, action, where], i) => (
                    <tr key={i} className={i % 2 === 1 ? "bg-neutral-50" : "bg-white"}>
                      <td className="px-4 py-3 font-mono font-bold text-[#f97316] border-b border-neutral-100">{step}</td>
                      <td className="px-4 py-3 text-neutral-600 border-b border-neutral-100">{action}</td>
                      <td className="px-4 py-3 text-neutral-600 border-b border-neutral-100">{where}</td>
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

function SubLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[13px] font-bold text-[#080808] mb-2 ${className}`}>{children}</p>
  );
}

function StepList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2 my-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-[15px] text-neutral-500 leading-relaxed">
          <span className="text-[#f97316] font-bold flex-shrink-0 mt-0.5">→</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
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

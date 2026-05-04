import Image from "next/image";

export const metadata = {
  title: "Dica 02/100 — Agente de SDR no WhatsApp com NexSeven | RedPro AI Academy",
  description: "Como montar um agente que qualifica lead 24x7, filtra quem tem fit e só empurra pro closer quem passou no critério.",
};

export default function Dica02AgenteSdrNexSeven() {
  return (
    <div className="bg-neutral-100 min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl">

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
            <h1 className="text-4xl font-extrabold text-white leading-tight max-w-xl mb-4">
              Dica 02/100 —{" "}
              <span className="text-[#f97316]">Agente de SDR</span>{" "}
              no WhatsApp com NexSeven
            </h1>
            <p className="text-neutral-400 text-base leading-relaxed max-w-lg">
              Como montar um agente que qualifica lead 24x7, filtra quem tem fit e só empurra pro closer quem passou no critério.
            </p>
          </div>
        </div>

        {/* CORPO */}
        <div className="px-16 py-14">

          {/* INTRO */}
          <p className="text-[17px] text-neutral-500 leading-relaxed mb-12 border-l-[3px] border-[#f97316] pl-5">
            Passei a última semana testando o NexSeven no meu próprio negócio. Conectei um número de WhatsApp, configurei o agente com o método BANT e deixei ele receber os leads do meu tráfego pago. Em 7 dias, o agente fez mais de 40 conversas, qualificou 12 leads com fit real e agendou 9 reuniões — sem eu tocar em nada. Pipeline mais curto, reunião com quem importa. Abaixo está exatamente o que fiz, passo a passo.
          </p>

          {/* STEPS */}
          <div className="flex flex-col gap-12 mb-12">

            {/* PASSO 1 */}
            <div className="grid grid-cols-[48px_1fr] gap-x-6">
              <div className="w-12 h-12 rounded-xl bg-[#080808] text-[#f97316] font-mono font-bold text-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                01
              </div>
              <div>
                <h2 className="text-[22px] font-extrabold text-neutral-900 mb-3 leading-snug">
                  Crie sua conta e escolha como conectar o WhatsApp
                </h2>
                <p className="text-[15px] text-neutral-500 leading-relaxed mb-4">
                  Acesse{" "}
                  <a href="https://nexseven.com.br/" target="_blank" rel="noopener noreferrer" className="text-[#f97316] font-bold hover:underline">
                    nexseven.com.br
                  </a>
                  , crie sua conta e avance até a tela de conexão do WhatsApp. O NexSeven oferece duas opções — cada uma com um propósito diferente:
                </p>

                <div className="bg-neutral-100 border border-neutral-200 border-l-[3px] border-l-[#f97316] rounded-lg px-6 py-5 mb-4">
                  <p className="font-mono text-[10px] font-bold tracking-widest uppercase text-[#f97316] mb-2">Opção A — QR Code (Evolution API)</p>
                  <p className="font-mono text-[13px] text-neutral-700 leading-relaxed">
                    Escaneie o QR Code com qualquer chip. Conecta em segundos, sem burocracia.<br /><br />
                    Ideal para: primeiro contato com lead frio (cold outreach). É o único método que permite enviar mensagem livre, sem template aprovado.<br /><br />
                    Atenção: método não-oficial (usa WhatsApp Web por baixo). Risco baixo se usado com moderação, mas existe. Use um número dedicado ao negócio — nunca o seu pessoal.
                  </p>
                </div>

                <div className="bg-neutral-100 border border-neutral-200 border-l-[3px] border-l-[#f97316] rounded-lg px-6 py-5 mb-4">
                  <p className="font-mono text-[10px] font-bold tracking-widest uppercase text-[#f97316] mb-2">Opção B — Meta Oficial (WhatsApp Business API)</p>
                  <p className="font-mono text-[13px] text-neutral-700 leading-relaxed">
                    Login com conta do Facebook Business. Setup mais trabalhoso, mas é o caminho oficial da Meta.<br /><br />
                    Ideal para: campanhas em massa, follow-up de CRM, agendamentos e atendimento recorrente. Risco zero de ban.<br /><br />
                    Requer: criar um App no Meta for Developers, obter o Phone Number ID e o Access Token.
                  </p>
                </div>

                <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl px-6 py-5 mb-4 flex gap-3 items-start">
                  <span className="text-xl flex-shrink-0 leading-relaxed">⚡</span>
                  <p className="text-[14px] text-neutral-700 leading-relaxed">
                    <strong className="text-neutral-900">Para SDR, o fluxo ideal é os dois juntos:</strong> QR Code para entrar no lead frio → quando ele responde (janela de 24h aberta) → continua via Meta Oficial. O NexSeven detecta automaticamente qual usar em cada momento.
                  </p>
                </div>

                <ul className="flex flex-col gap-2 mt-4">
                  {[
                    <>Para começar rápido: escolha <strong>QR Code</strong>, escaneie com o chip do negócio e avance</>,
                    <>Para produção completa: configure os dois em <strong>Configurações → WhatsApp</strong></>,
                    "Use sempre um número separado — nunca o chip pessoal",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[15px] text-neutral-500 leading-relaxed">
                      <span className="text-[#f97316] font-bold flex-shrink-0 mt-0.5">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* PASSO 2 */}
            <div className="grid grid-cols-[48px_1fr] gap-x-6">
              <div className="w-12 h-12 rounded-xl bg-[#080808] text-[#f97316] font-mono font-bold text-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                02
              </div>
              <div>
                <h2 className="text-[22px] font-extrabold text-neutral-900 mb-3 leading-snug">Configure o agente NexPro</h2>
                <p className="text-[15px] text-neutral-500 leading-relaxed mb-3">
                  No menu lateral, vá em <strong>Configurações → Agente IA</strong>. Escolha a categoria <strong>NexPro</strong> — ela combina qualificação BANT com agendamento automático.
                </p>
                <ul className="flex flex-col gap-2 mb-4">
                  {[
                    <>Categoria: <strong>NexPro</strong> (qualificação + agendamento)</>,
                    "Nome do agente: escolha algo natural, como o nome do negócio",
                    <>Ative <strong>Transferência para humano</strong> — quando o lead pedir para falar com alguém, o agente transfere e explica o motivo</>,
                    <>Temperatura: mantenha em <strong>0.4</strong> (mais consistente, menos criativo)</>,
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[15px] text-neutral-500 leading-relaxed">
                      <span className="text-[#f97316] font-bold flex-shrink-0 mt-0.5">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[15px] text-neutral-500 leading-relaxed mb-3">
                  Cole o system prompt abaixo no campo <strong>Instruções do Agente</strong>. Adapte os campos entre colchetes para o seu negócio:
                </p>
                <div className="bg-neutral-100 border border-neutral-200 border-l-[3px] border-l-[#f97316] rounded-lg px-6 py-5">
                  <p className="font-mono text-[10px] font-bold tracking-widest uppercase text-[#f97316] mb-2">System Prompt — Agente SDR</p>
                  <p className="font-mono text-[13px] text-neutral-700 leading-relaxed whitespace-pre-line">
{`Você é [NOME DO AGENTE], assistente de pré-vendas da [NOME DA EMPRESA].

Seu objetivo é qualificar o lead usando o método BANT antes de qualquer reunião.

Fluxo obrigatório (máx 6 mensagens até qualificar):
1. Apresente-se e pergunte qual problema o lead quer resolver
2. Need: "Qual é o principal desafio que você enfrenta hoje com [área do negócio]?"
3. Budget: "Você já tem um investimento planejado para resolver isso?"
4. Authority: "Você é quem toma essa decisão ou tem mais alguém envolvido?"
5. Timeline: "Em quanto tempo você precisa disso funcionando?"

Se o lead passar nos 4 critérios: use create_appointment para agendar reunião.
Se não tiver perfil: agradeça, informe que vai entrar em contato quando tiver uma solução adequada.

Tom: direto, profissional, sem enrolação. Máximo 2 parágrafos por mensagem.`}
                  </p>
                </div>
              </div>
            </div>

            {/* PASSO 3 */}
            <div className="grid grid-cols-[48px_1fr] gap-x-6">
              <div className="w-12 h-12 rounded-xl bg-[#080808] text-[#f97316] font-mono font-bold text-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                03
              </div>
              <div>
                <h2 className="text-[22px] font-extrabold text-neutral-900 mb-3 leading-snug">Configure a base de conhecimento</h2>
                <p className="text-[15px] text-neutral-500 leading-relaxed mb-3">
                  Vá em <strong>Conhecimento</strong> no menu lateral. Faça upload de um documento (Google Doc exportado como PDF) com:
                </p>
                <ul className="flex flex-col gap-2 mb-4">
                  {[
                    <><strong>O que a empresa faz</strong> — descrição em 3 linhas, sem jargão</>,
                    <><strong>Perfil de cliente ideal</strong> — segmento, tamanho, dores principais</>,
                    <><strong>Critérios de qualificação</strong> — o que define um lead com fit</>,
                    <><strong>Objeções comuns</strong> — "é caro", "não tenho tempo", "vou pensar" — e como o agente deve responder</>,
                    <><strong>O que NÃO fazer</strong> — tópicos sensíveis, promessas que não pode fazer</>,
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[15px] text-neutral-500 leading-relaxed">
                      <span className="text-[#f97316] font-bold flex-shrink-0 mt-0.5">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl px-6 py-5 flex gap-3 items-start">
                  <span className="text-xl flex-shrink-0 leading-relaxed">📄</span>
                  <p className="text-[14px] text-neutral-700 leading-relaxed">
                    <strong className="text-neutral-900">Quanto mais específico o documento, melhor o agente.</strong> Um documento genérico gera resposta genérica. Coloque exemplos reais de conversa com clientes — o agente aprende o tom certo.
                  </p>
                </div>
              </div>
            </div>

            {/* PASSO 4 */}
            <div className="grid grid-cols-[48px_1fr] gap-x-6">
              <div className="w-12 h-12 rounded-xl bg-[#080808] text-[#f97316] font-mono font-bold text-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                04
              </div>
              <div>
                <h2 className="text-[22px] font-extrabold text-neutral-900 mb-3 leading-snug">Configure o agendamento automático</h2>
                <p className="text-[15px] text-neutral-500 leading-relaxed mb-3">
                  Vá em <strong>Configurações → Agenda</strong> e conecte seu Google Calendar.
                </p>
                <ul className="flex flex-col gap-2 mb-4">
                  {[
                    <>Clique em <strong>Conectar Google Calendar</strong> e autorize o acesso</>,
                    "Defina os horários disponíveis para reunião (ex: seg a sex, 9h–18h)",
                    "Configure o tempo de buffer entre reuniões (recomendado: 15 min)",
                    <>Ative o <strong>lembrete automático</strong> — o agente envia mensagem no WhatsApp 30 min antes da reunião</>,
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[15px] text-neutral-500 leading-relaxed">
                      <span className="text-[#f97316] font-bold flex-shrink-0 mt-0.5">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl px-6 py-5 flex gap-3 items-start">
                  <span className="text-xl flex-shrink-0 leading-relaxed">⚡</span>
                  <p className="text-[14px] text-neutral-700 leading-relaxed">
                    Com isso configurado, o fluxo completo fica: <strong className="text-neutral-900">lead entra → agente qualifica → agenda reunião → manda lembrete</strong>. Tudo sem você tocar em nada.
                  </p>
                </div>
              </div>
            </div>

            {/* PASSO 5 */}
            <div className="grid grid-cols-[48px_1fr] gap-x-6">
              <div className="w-12 h-12 rounded-xl bg-[#080808] text-[#f97316] font-mono font-bold text-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                05
              </div>
              <div>
                <h2 className="text-[22px] font-extrabold text-neutral-900 mb-3 leading-snug">Teste antes de ligar para tráfego</h2>
                <p className="text-[15px] text-neutral-500 leading-relaxed mb-3">
                  Antes de jogar lead real no agente, simule uma conversa completa. Mande mensagem no número conectado fingindo ser um lead — com perfil bom e com perfil ruim.
                </p>
                <ul className="flex flex-col gap-2 mb-4">
                  {[
                    "Teste com lead qualificado: responda sim para os 4 critérios BANT e veja se o agente agenda",
                    "Teste com lead sem fit: responda que não tem budget ou não é o decisor — veja se o agente encerra com elegância",
                    "Teste a transferência: peça para falar com um humano e veja se o agente passa corretamente",
                    "Verifique o CRM: após cada conversa, confirme que o lead foi salvo com as informações corretas",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[15px] text-neutral-500 leading-relaxed">
                      <span className="text-[#f97316] font-bold flex-shrink-0 mt-0.5">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[15px] text-neutral-500 leading-relaxed">
                  Só depois desse teste ligue o tráfego pago ou comece a divulgar o número.
                </p>
              </div>
            </div>

          </div>

          {/* TABELA RESUMO */}
          <div className="mt-12">
            <p className="text-[20px] font-extrabold text-neutral-900 mb-5">Resumo da configuração</p>
            <div className="overflow-x-auto">
              <table className="w-full text-[14px] border-collapse">
                <thead>
                  <tr className="bg-[#080808] text-white">
                    <th className="px-4 py-3 text-left font-bold text-[12px] tracking-widest uppercase">Passo</th>
                    <th className="px-4 py-3 text-left font-bold text-[12px] tracking-widest uppercase">O que fazer</th>
                    <th className="px-4 py-3 text-left font-bold text-[12px] tracking-widest uppercase">Onde no NexSeven</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["01", "Criar conta e escolher QR Code ou Meta Oficial", "Onboarding → Conectar WhatsApp"],
                    ["02", "Configurar agente NexPro com system prompt BANT", "Configurações → Agente IA"],
                    ["03", "Subir documento com perfil de cliente e objeções", "Conhecimento → Upload"],
                    ["04", "Conectar Google Calendar e definir horários", "Configurações → Agenda"],
                    ["05", "Testar com lead bom e lead ruim antes de ligar tráfego", "Inbox → conversa manual"],
                  ].map(([step, action, where], i) => (
                    <tr key={i} className={i % 2 === 1 ? "bg-neutral-50" : ""}>
                      <td className="px-4 py-3 font-mono font-bold text-[#f97316] border-b border-neutral-200 whitespace-nowrap">{step}</td>
                      <td className="px-4 py-3 text-neutral-500 border-b border-neutral-200">{action}</td>
                      <td className="px-4 py-3 text-neutral-500 border-b border-neutral-200">{where}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div className="relative mt-14 bg-[#080808] rounded-2xl px-12 py-10 overflow-hidden flex flex-col gap-4">
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#f97316] opacity-[0.07]" />
            <p className="text-[13px] font-bold tracking-widest uppercase text-[#f97316] relative z-10">
              Quer que eu monte pra você?
            </p>
            <h3 className="text-[26px] font-extrabold text-white leading-snug max-w-sm relative z-10">
              Se você prefere chegar com o agente pronto, sem configurar nada, me chama no WhatsApp.
            </h3>
            <a
              href="https://wa.me/5561992978796?text=Oi%20Red%2C%20vi%20o%20guia%20do%20agente%20SDR%20e%20quero%20que%20voc%C3%AA%20monte%20pra%20mim."
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-block bg-[#f97316] text-white font-bold text-[15px] px-7 py-3 rounded-lg mt-1 hover:opacity-85 transition-opacity"
            >
              Falar com o Red no WhatsApp →
            </a>
          </div>

        </div>

        {/* FOOTER */}
        <div className="px-16 py-6 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-[12px] text-neutral-400">
            © 2026 <strong className="text-[#f97316]">RedPro AI Academy</strong> — redpro.com.br
          </span>
          <span className="text-[12px] text-neutral-400">Dica 02/100</span>
        </div>

      </div>
    </div>
  );
}

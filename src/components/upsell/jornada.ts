// Jornada da FA² (Formação Arquiteto de Agentes): 6 meses, uma área da empresa por mês, 4 aulas por mês.
// Fonte: imersao-arquiteto-qg/03-baldan/MENTORIA-24-AULAS.md (v2, Rigel, 22/11; itens da FHT aprovados em 23/11).
// Texto reescrito para quem está comprando. Rascunho até o ok do Red (nada vai a aluno sem ele).

export type Aula = { n: number; titulo: string; texto: string };
export type Mes = { mes: number; area: string; curto: string; entrega: string; marco?: string; aulas: Aula[] };

export const FORMATO = [
  {
    quando: "Aulas 1, 2 e 3",
    titulo: "Construção ao vivo",
    texto: "Eu mostro na tela, o agente executa e você replica na sua empresa durante a aula.",
    passos: ["Explicação curta", "Exemplo real", "Exercício com tempo", "Correção ao vivo"],
  },
  {
    quando: "Aula 4",
    titulo: "Entrega e hot seat",
    texto: "Você mostra o que ficou pronto no mês. Eu corrijo ao vivo, na frente da turma, e você sai com o próximo passo.",
    passos: ["Entra quem executou", "Correção do seu caso", "Plano do mês seguinte"],
  },
];

export const ENTRADA = [
  "Mensagem com todos os acessos",
  "Raio-X do seu negócio",
  "Diagnóstico e plano dos 6 meses",
  "Apresentação na comunidade",
  "Aula inaugural gravada",
  "Calendário dos próximos 100 dias",
];

export const JORNADA: Mes[] = [
  {
    mes: 1,
    area: "Processos e painel do dono",
    curto: "Processos",
    entrega: "O mapa da sua empresa, 3 processos prontos para virar agente e o seu painel no ar.",
    aulas: [
      { n: 1, titulo: "O mapa da empresa", texto: "Um agente entrevista você e desenha quem faz o quê e onde se perde tempo e dinheiro." },
      { n: 2, titulo: "Processos que o agente segue", texto: "Cada processo vira um passo a passo com entrada, saída e quem aprova. Você escolhe o que vira agente primeiro." },
      { n: 3, titulo: "O painel do dono", texto: "O Genix OS com os números de cada área e um relatório diário no seu celular." },
      { n: 4, titulo: "Entrega e hot seat", texto: "Você mostra o mapa, os processos e o painel, e sai com o plano dos 6 meses." },
    ],
  },
  {
    mes: 2,
    area: "Marketing completo",
    curto: "Marketing",
    entrega: "O seu departamento de marketing de agentes trabalhando toda semana.",
    marco: "Seu primeiro Squad trabalhando",
    aulas: [
      { n: 5, titulo: "Chefe de Marketing e pesquisa", texto: "O agente que coordena o marketing e os agentes que estudam concorrentes, público e provas." },
      { n: 6, titulo: "Criação e vídeo", texto: "Copy, criativos, páginas, roteiro, edição e um conteúdo virando vários." },
      { n: 7, titulo: "Publicação, anúncios e a semana", texto: "Redes, e-mail, direct e tráfego, com uma revisão semanal guiada pelos números." },
      { n: 8, titulo: "Entrega e hot seat", texto: "Os números do marketing aparecem no seu painel." },
    ],
  },
  {
    mes: 3,
    area: "Vendas e pós-venda",
    curto: "Vendas",
    entrega: "O funil comercial inteiro, do primeiro contato ao cliente que indica, medido no painel.",
    aulas: [
      { n: 9, titulo: "Funil comercial", texto: "Etapas, CRM, atendimento e qualificação no WhatsApp." },
      { n: 10, titulo: "Vendedor com copiloto", texto: "Proposta, follow-up, objeções e agenda. O agente prepara e a pessoa fecha." },
      { n: 11, titulo: "Pós-venda", texto: "Boas-vindas, suporte com uma assistente de IA da sua empresa, reativação e indicação." },
      { n: 12, titulo: "Entrega e hot seat", texto: "As vendas e o pós-venda no seu painel." },
    ],
  },
  {
    mes: 4,
    area: "Administrativo",
    curto: "Administrativo",
    entrega: "Financeiro, administrativo e pessoas rodando com agente e aprovação humana.",
    aulas: [
      { n: 13, titulo: "Financeiro", texto: "Contas a pagar e a receber, conciliação, cobrança e fluxo de caixa no painel." },
      { n: 14, titulo: "Administrativo e fiscal", texto: "Notas, documentos, e-mails, agenda e compras." },
      { n: 15, titulo: "Pessoas", texto: "Recrutamento, integração de funcionário e rotina da equipe." },
      { n: 16, titulo: "Entrega e hot seat", texto: "O administrativo no seu painel." },
    ],
  },
  {
    mes: 5,
    area: "Jurídico e contratos",
    curto: "Jurídico",
    entrega: "Contratos gerados e revisados por agente, com alerta de prazo. Quem valida é o seu advogado.",
    aulas: [
      { n: 17, titulo: "Contratos", texto: "Modelos, contrato gerado a partir da proposta e assinatura eletrônica." },
      { n: 18, titulo: "Revisão e riscos", texto: "Um agente revisor de cláusulas, prazos e vencimentos." },
      { n: 19, titulo: "LGPD e uso de IA", texto: "Dados de cliente com agentes, termos, privacidade e permissões." },
      { n: 20, titulo: "Entrega e hot seat", texto: "Contratos e prazos no seu painel." },
    ],
  },
  {
    mes: 6,
    area: "Memória da empresa e formatura",
    curto: "Memória",
    entrega: "Uma base com tudo da empresa, consultada pelos agentes e pela equipe, e o plano dos próximos 6 meses.",
    aulas: [
      { n: 21, titulo: "A memória da empresa", texto: "Processos, documentos, reuniões e atendimentos numa base só." },
      { n: 22, titulo: "Agentes que consultam a base", texto: "Respostas para a equipe e os clientes, treinamento interno e uma base que se atualiza sozinha." },
      { n: 23, titulo: "Revisão da operação", texto: "Custo do time de agentes, segurança e o próximo Squad." },
      { n: 24, titulo: "Formatura", texto: "O antes e o depois da sua empresa, lado a lado no painel." },
    ],
  },
];

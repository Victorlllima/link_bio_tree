// Os sete módulos do De Um Agente a Um Squad, na ordem de liberação (um por semana).
// Nomenclatura técnica (Red, 24/09/2026): a versão anterior estava mastigada demais para o
// público, que é analista de TI, consultor e gente que já montou agente e já apanhou.
// Conteúdo: HERMES/2-PRODUTO/duaaus/roteiro-m1..m7.md no repo Starlight.

export interface Modulo {
    n: number;
    titulo: string;
    subtitulo: string;
    resumo: string;
    aulas: string[];
    duracao: string;
}

export const MODULOS: Modulo[] = [
    {
        n: 1,
        titulo: "Deploy e persistência",
        subtitulo: "Hermes fora da máquina local",
        resumo:
            "Migrar o gateway para uma VPS ou para a nuvem da Nous, garantir que ele suba sozinho depois de qualquer reboot e provar a persistência com a máquina local desligada.",
        duracao: "44 min",
        aulas: [
            "O limite do agente local",
            "Arquitetura: onde o gateway roda",
            "Hermes Cloud: provisionamento em um clique",
            "VPS própria: provisionamento assistido pelo agente",
            "Desktop conectado a um gateway remoto",
            "Migração de perfil: exportar, importar, clonar",
            "Validação: persistência com a máquina local desligada",
            "Reboot, linger e recuperação automática",
        ],
    },
    {
        n: 2,
        titulo: "Perfis e isolamento",
        subtitulo: "Fronteiras de memória e identidade",
        resumo:
            "Profile como unidade de isolamento: memória, skills, modelo e bot próprios. O critério para separar contextos em vez de empilhar tudo numa instância só.",
        duracao: "41 min",
        aulas: [
            "O custo de um contexto único",
            "Profile: memória, skills, modelo e gateway próprios",
            "Um profile com vários canais × um profile por canal",
            "Provisionamento de profiles e clonagem",
            "Bot Mode: identidade e voz por agente",
            "Um bot por profile: token, allowlist e pareamento",
            "Roteamento de modelo por profile",
            "Critério de separação: sessão, projeto ou profile",
        ],
    },
    {
        n: 3,
        titulo: "Delegação e orquestração",
        subtitulo: "Execução paralela com coordenador",
        resumo:
            "Decompor uma tarefa em subtarefas, despachar para agentes trabalhadores com briefing fechado e acompanhar a execução num quadro compartilhado.",
        duracao: "43 min",
        aulas: [
            "Gargalo de execução serial",
            "Sessão, subagente e profile: três granularidades",
            "delegate_task: briefing, escopo e critério de pronto",
            "Kanban multiagente: colunas, cartões e responsáveis",
            "Decomposição automática e cadeia de dependências",
            "Intervenção: reatribuir, bloquear, encerrar",
            "Bots em máquinas distintas no mesmo grupo",
            "Economia da delegação: coordenador caro, executor barato",
        ],
    },
    {
        n: 4,
        titulo: "Operação de frota",
        subtitulo: "Multi-gateway e observabilidade",
        resumo:
            "A partir do terceiro agente o problema deixa de ser capacidade e passa a ser operação: saber onde cada um roda, atualizar todos e diagnosticar o que caiu.",
        duracao: "39 min",
        aulas: [
            "Frota: o que muda a partir do terceiro agente",
            "Seletor de gateway e contexto de execução",
            "Edição remota de configuração",
            "Atualização coordenada da frota",
            "Credenciais por agente: escopo e rotação",
            "Diagnóstico: log, health check e fila de tarefas",
            "Rotina de verificação diária",
        ],
    },
    {
        n: 5,
        titulo: "Cockpit de construção",
        subtitulo: "Do texto ao artefato executável",
        resumo:
            "Ambiente de build dentro do Desktop: o agente escreve, abre o preview, interage com o que construiu e fecha o ciclo de correção antes de devolver.",
        duracao: "40 min",
        aulas: [
            "Do texto ao artefato executável",
            "Layout de trabalho: editor, preview e execução",
            "Projeto, workspace e permissão de escrita",
            "Especificação: escopo, stack e critério de aceite",
            "Verificação por navegador dirigido pelo agente",
            "Ciclo de correção autônoma",
            "Feedback visual: apontar na própria interface",
            "Limites: o que não compensa construir assim",
        ],
    },
    {
        n: 6,
        titulo: "Versionamento e merge",
        subtitulo: "Git operado em linguagem natural",
        resumo:
            "Histórico, reversão e worktrees para rodar três abordagens em paralelo sem uma contaminar a outra. Review antes do merge, tudo pedido em português.",
        duracao: "44 min",
        aulas: [
            "Regressão: o custo de não versionar",
            "Modelo mental de git para quem não programa",
            "Repositório, commit e histórico",
            "Reversão: checkpoint e restore",
            "Worktrees: execução paralela isolada",
            "Três abordagens simultâneas, um vencedor",
            "Code review assistido",
            "Pull request e merge em linguagem natural",
        ],
    },
    {
        n: 7,
        titulo: "Autonomia controlada",
        subtitulo: "Política de aprovação e auditoria",
        resumo:
            "Definir o que executa sem confirmação e o que continua passando por você, operar com sessões autenticadas e auditar a trilha de execução depois.",
        duracao: "44 min",
        aulas: [
            "Os dois extremos de confiança",
            "Modos de aprovação e suas consequências",
            "Política: o que roda sem confirmação",
            "Perfil real: sessões autenticadas e superfície de risco",
            "HUD: leitura e escrita na tela ativa",
            "Execução longa sem supervisão",
            "Auditoria: trilha de execução",
            "Arquitetura final: um squad em operação",
        ],
    },
];

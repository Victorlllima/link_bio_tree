// Os sete módulos do De Um Agente a Um Squad, na ordem em que são liberados.
// Um por semana (decisão do Red, 24/09/2026 — substitui "os sete de uma vez" de 08/09).
// As aulas vêm dos roteiros em HERMES/2-PRODUTO/duaaus/roteiro-m1..m7.md do repo Starlight.

export interface Modulo {
    n: number;
    titulo: string;
    teto: string;
    resumo: string;
    aulas: string[];
    duracao: string;
}

export const MODULOS: Modulo[] = [
    {
        n: 1,
        titulo: "O agente fora da sua máquina",
        teto: "Ele só existe enquanto o seu computador está ligado",
        resumo:
            "Seu agente muda de casa. Você desliga o notebook, viaja, formata, e ele continua trabalhando e respondendo.",
        duracao: "44 min",
        aulas: [
            "O \"tá aí?\" sem resposta",
            "O motor muda de endereço",
            "Hermes Cloud: o agente na nuvem em um clique",
            "Servidor próprio: o agente prepara a casa nova",
            "Ligando a janela no servidor",
            "Levar o seu agente ou começar limpo",
            "A prova: desliga o computador",
            "O que muda quando ele mora lá",
        ],
    },
    {
        n: 2,
        titulo: "Perfis e Bot Mode: o seu time com cara",
        teto: "É um agente só, e tudo se mistura dentro dele",
        resumo:
            "Cada agente com a própria memória, o próprio modelo e o próprio contato no Telegram. Parede de verdade entre um assunto e outro.",
        duracao: "41 min",
        aulas: [
            "Tudo numa cabeça só",
            "Um perfil é um agente inteiro",
            "A confusão que mais faz estrago",
            "Criando o time",
            "Bot Mode: o seu time com cara",
            "Cada um com o seu Telegram",
            "Cada um no seu modelo",
            "Quando não criar mais um",
        ],
    },
    {
        n: 3,
        titulo: "O time trabalhando",
        teto: "Ele faz uma coisa por vez, e quem liga uma etapa na outra é você",
        resumo:
            "Uma tarefa grande entra e se divide sozinha. Cada pedaço vai para o agente certo, um espera o outro quando depende dele, e você acompanha num quadro.",
        duracao: "43 min",
        aulas: [
            "O mesmo nome nos três cartões",
            "Três jeitos de dividir trabalho",
            "Subagentes: os ajudantes que nascem sem saber nada",
            "Ligando o quadro do time",
            "A tarefa se divide sozinha",
            "Quando o quadro precisa de você",
            "A sala dos bots, em máquinas diferentes",
            "A regra de bolso",
        ],
    },
    {
        n: 4,
        titulo: "Operar a frota",
        teto: "Agora são vários, e você não sabe quem está fazendo o quê",
        resumo:
            "Saber em qual máquina você está, editar qualquer agente sem trocar de tela, atualizar todos de uma vez e achar o problema quando um cai de madrugada.",
        duracao: "39 min",
        aulas: [
            "Você virou gerente de frota",
            "Em qual máquina eu estou?",
            "Editar qualquer agente sem trocar de máquina",
            "Todos atualizados em um clique",
            "A chave de cada um",
            "Onde olhar quando algo cai",
            "O ritual de cinco minutos",
        ],
    },
    {
        n: 5,
        titulo: "Cockpit de construção",
        teto: "O time entrega texto, e você ainda precisa transformar em coisa que funciona",
        resumo:
            "O agente constrói, abre, clica no que construiu e acha o próprio erro antes de te mostrar.",
        duracao: "40 min",
        aulas: [
            "O time que só entrega texto",
            "Montando o cockpit",
            "Onde o código mora",
            "O pedido",
            "O preview: ele abre e clica",
            "O momento: ele acha o próprio erro",
            "Você também aponta",
            "O que construir assim, e o que não",
        ],
    },
    {
        n: 6,
        titulo: "Do código ao merge",
        teto: "A mudança de hoje estraga o que funcionava ontem",
        resumo:
            "Guardar versão, voltar atrás quando quebra, e três tentativas correndo em paralelo sem uma atrapalhar a outra.",
        duracao: "44 min",
        aulas: [
            "A mudança que estraga o que funcionava",
            "Git em uma analogia",
            "Ligando o git e salvando versões",
            "Voltar atrás",
            "Worktrees: três mesas",
            "O momento: três versões em paralelo",
            "Revisar antes de aceitar",
            "PR e merge, pedidos em português",
        ],
    },
    {
        n: 7,
        titulo: "Autonomia com controle",
        teto: "É você quem aprova cada passo, e isso não escala",
        resumo:
            "O que eles fazem sozinhos e o que continua passando por você. A parte que separa quem delega de quem entregou a máquina.",
        duracao: "44 min",
        aulas: [
            "Os dois jeitos errados de confiar",
            "Os três modos de aprovação",
            "O seu critério: o que ele faz sozinho",
            "O navegador com os seus logins",
            "HUD: ele lê e escreve na sua tela",
            "O momento: a tarefa longa",
            "Onde conferir o que ele fez",
            "A jornada: de um agente a um squad",
        ],
    },
];

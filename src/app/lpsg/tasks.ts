// Fonte única de verdade das tarefas do 1º ciclo LPSG.
// O banco guarda APENAS o estado (responsável + done) por task_id.
// Editar a lista aqui não exige migração — só manter os ids estáveis.

export type Responsavel = "victor" | "gleyce" | "ambos" | null;

export interface TutorialPasso {
  titulo: string;
  passos: string[];
}

export interface Task {
  id: string;
  label: string;
  detalhe?: string;
  sugestao: Exclude<Responsavel, null>;
  frente: string;
  ordem?: number; // prioridade dentro da frente (menor = mais prioritário)
  pendencia?: boolean; // marca visual de pendência crítica
  tutorial?: TutorialPasso; // passo a passo (modal) — usado na frente Hotmart
  recorrencia?: "unica" | "semanal"; // "unica" = feito uma vez, serve pra todos os ciclos (ex. template de mensagem). "semanal" = repete a cada novo ciclo do LPSG (ex. criar grupo novo). Sem o campo = tarefa do 1º ciclo, não recorrente por natureza.
}

export interface Frente {
  id: string;
  titulo: string;
  // 3 níveis do método
  estrategico: string;
  tatico: string;
}

export const FRENTES: Frente[] = [
  {
    id: "setup",
    titulo: "🔑 Setup / Pré-requisitos (Método Tabari)",
    estrategico:
      "Etapa 0 do ebook LPSG (Turbo Academy). São as contas e dados técnicos que precisam existir antes de qualquer execução — sem isso, tudo trava no meio. Feito uma vez, serve para todos os ciclos. Boa parte da nossa infra já existe (Meta, Hotmart, ManyChat); esta frente garante que nada foi esquecido e que os 5 dados críticos estão anotados.",
    tatico:
      "Contas + os 5 dados críticos do ebook (Pixel ID, CAPI Token, Phone Number ID, Product ID + Offer Key, HOTTOK). Adaptado ao nosso stack: sem n8n no 1º ciclo (usamos ManyChat + webhooks); captação via grupo de WhatsApp em vez de 5 páginas.",
  },
  {
    id: "grupo",
    titulo: "💬 Grupo de Aquecimento (WhatsApp)",
    estrategico:
      "É o elo que falta entre o IAA e o LPSG — e hoje é o bloqueio mais urgente de todo o cronograma. A Aula 12 do IAA já manda o aluno entrar num grupo que não existe. Pelo método Tabari, esse grupo funciona como o Turbo Express: entrada gratuita e orgânica (quem termina o IAA), e é DENTRO dele — não numa página — que a oferta do ingresso R$44 é revelada, ancorada e vendida, com escassez real ao longo dos dias de aquecimento. ⚠️ Como o LPSG roda toda semana e o WhatsApp tem limite de 1.000 membros por grupo, o grupo NÃO é permanente — ele se recria a cada ciclo. Misturar coortes quebraria a mecânica de escassez (não dá pra dizer 'só restam 2 vagas' pra quem já viu essa mensagem há 3 semanas).",
    tatico:
      "5 tarefas de TEMPLATE (fazer uma vez, reusar sempre) + 4 tarefas de OPERAÇÃO SEMANAL (repetem a cada novo ciclo). Para o 1º ciclo, as duas rodam juntas agora. A partir do 2º ciclo, só a operação semanal se repete — os templates já estão prontos.",
  },
  {
    id: "gravacao",
    titulo: "🎬 Gravação",
    estrategico:
      "É o segundo bloqueio real do cronograma. Nenhuma outra frente entrega valor sem as gravações prontas. Prioridade absoluta e em ordem: a captação (aula 12 do IAA + criativos) vem antes das aulas do evento, porque é o que enche a lista.",
    tatico:
      "4 entregas, todas do Victor, em ordem de prioridade: (1) regravar a aula 12 do IAA para apontar pro grupo de aquecimento (não pro evento direto — depende da frente Grupo estar pronta), (2) criativos do curso de entrada para o tráfego, (3) as 5 aulas do evento — que já incluem a construção do CRM ao vivo, (4) o roteiro do pitch de domingo que vende a Formação.",
  },
  {
    id: "hotmart",
    titulo: "🛒 Hotmart / Comercial",
    estrategico:
      "É o terceiro dominó da operação. Criar os produtos no Hotmart destrava e-mails, checkout e automações. Se atrasa, tudo atrasa. Cada tarefa tem um tutorial passo a passo para a Gleyce executar sem erro.",
    tatico:
      "6 tarefas operacionais da Gleyce + 1 pendência do Victor (prova social). Ordem importa: reprecificar e criar o ingresso antes das páginas; criar a Formação antes do carrinho de 3/ago.",
  },
  {
    id: "paginas",
    titulo: "📄 Páginas e Automação",
    estrategico:
      "Toda a comunicação com o inscrito, do cadastro ao carrinho. Os rascunhos já estão prontos — o trabalho é montar e programar, não criar do zero.",
    tatico:
      "Frente conduzida pelo Victor. Dependem do Hotmart (precisam dos IDs dos produtos) para ligar checkout e automações.",
  },
  {
    id: "trafego",
    titulo: "📣 Tráfego e Captação",
    estrategico:
      "Enche a lista antes do evento — meta de 30% de presença na Aula 1. Pelo método Tabari o LPSG é lançamento PAGO: o ingresso recebe tráfego pago (ROAS piso 1,25, o lucro vem no pitch de domingo). ⚠️ Não ligar o tráfego do IAA antes do grupo de aquecimento estar pronto — cada novo aluno bate na Aula 12 em poucos minutos.",
    tatico:
      "Frente conduzida pelo Victor. Começa com a lista do IAA + orgânico e liga tráfego pago leve assim que os criativos E o grupo de aquecimento ficarem prontos.",
  },
  {
    id: "gestao",
    titulo: "📋 Gestão de Projeto",
    estrategico:
      "O chapéu da Gleyce. Garante que a ordem certa seja seguida (Grupo → Hotmart) e que nenhum bloqueio passe despercebido.",
    tatico:
      "Coordenação contínua até o evento. Cobra prazos, mantém o cronograma vivo e reporta status.",
  },
  {
    id: "dashboard",
    titulo: "📊 Dashboard & Métricas",
    estrategico:
      "Ebook Fase 8: painel ao vivo de métricas do lançamento. Você olha e sabe em 3 segundos se está ganhando, estável ou se precisa agir. No nosso caso, o painel de acompanhamento (este) + as métricas de venda do Hotmart/Meta.",
    tatico:
      "Conferir os números durante o evento e o carrinho. Documentar os resultados do 1º ciclo para recalibrar os benchmarks Tabari depois de 4-6 ciclos.",
  },
  {
    id: "cs",
    titulo: "🤝 Pós-venda (Customer Success)",
    estrategico:
      "Ebook Etapa 6: aluno satisfeito vira prova social real pro próximo ciclo. O pós-venda não é caridade — alimenta o lançamento seguinte. O ciclo fecha aqui e recomeça melhor. Roda DEPOIS das primeiras vendas.",
    tatico:
      "Onboarding 90 dias + pesquisa NPS + captura de prova social. A prova bruta vira estudo de caso narrativo e volta pras páginas e criativos do próximo ciclo.",
  },
];

export const TASKS: Task[] = [
  { id: "set-contas-infra", frente: "setup", ordem: 1, sugestao: "gleyce", recorrencia: "unica", label: "Conferir as contas de infra (Meta, Hotmart, ManyChat, Vercel, domínio)", detalhe: "Etapa 0 do ebook. Boa parte já existe. Confirmar acesso ativo a: Meta Business + Ad Account, Hotmart Pro, ManyChat Pro, Vercel, domínio + Cloudflare. Sem n8n no 1º ciclo (adaptação nossa)." },
  { id: "set-google-sa", frente: "setup", ordem: 2, sugestao: "victor", recorrencia: "unica", label: "Google + Service Account (Sheets/Drive/Calendar do CS)", detalhe: "Necessário para CRM em planilha, Drive do lançamento e Calendar do pós-venda. O JSON da Service Account fica em pasta criptografada." },
  { id: "set-waba", frente: "setup", ordem: 3, sugestao: "victor", recorrencia: "unica", label: "WABA (WhatsApp Business API) — número dedicado da mensageria", detalhe: "Já temos WABA (+55 61 9108-9602). Confirmar que está ativa e anotar o Phone Number ID." },
  { id: "set-dados-criticos", frente: "setup", ordem: 4, sugestao: "victor", pendencia: true, recorrencia: "unica", label: "Anotar os 5 dados críticos do ebook em local seguro (vault)", detalhe: "PENDÊNCIA: (1) Pixel ID (Meta), (2) CAPI Token (System User, sem expiração), (3) Phone Number ID (WABA), (4) Product ID + Offer Key dos 2 produtos Hotmart (ingresso + Formação), (5) HOTTOK (valida o webhook do onboarding). Tokens no gerenciador de senhas, nunca em texto puro." },
  { id: "set-pixel-capi", frente: "setup", ordem: 5, sugestao: "victor", recorrencia: "unica", label: "Confirmar Pixel + CAPI ativos (rastreamento server-side)", detalhe: "Pixel Vibecoding 1543917230170877. CAPI já ativa (Purchase + ViewContent + InitiateCheckout). Validar que os eventos estão chegando antes de ligar tráfego." },
  { id: "grp-tpl-boasvindas", frente: "grupo", ordem: 1, sugestao: "victor", recorrencia: "unica", label: "[TEMPLATE] Mensagem de boas-vindas automática do grupo", detalhe: "Dispara quando a pessoa entra. Confirma que ela está no lugar certo e adianta o cronograma (silêncio até o Dia 1). Escrever uma vez, reusar toda semana." },
  { id: "grp-tpl-dia1a3", frente: "grupo", ordem: 2, sugestao: "victor", recorrencia: "unica", label: "[TEMPLATE] Mensageria dos dias de silêncio/aquecimento (D1-D3)", detalhe: "Padrão Tabari: grupo fica quieto entre a entrada e o início oficial — só 1-2 toques de lembrete leve, sem revelar oferta ainda. Escrever uma vez, reusar toda semana." },
  { id: "grp-tpl-revelacao", frente: "grupo", ordem: 3, sugestao: "victor", recorrencia: "unica", label: "[TEMPLATE] Sequência de revelação do ingresso (R$44) dentro do grupo", detalhe: "Ancoragem de valor → até 3 bônus escalonados por tempo → preço revelado só em parcelado → link direto do checkout. Escrever uma vez, reusar toda semana (só o link do checkout muda por ciclo)." },
  { id: "grp-tpl-escassez", frente: "grupo", ordem: 4, sugestao: "victor", recorrencia: "unica", label: "[TEMPLATE] Mensagens de escassez do dia de abertura do ingresso", detalhe: "Padrão Tabari: % de vagas preenchidas ao longo do dia (ex. 73%→89%→95%→'últimas vagas'), fecha à noite. Escrever uma vez, reusar toda semana." },
  { id: "grp-tpl-evento", frente: "grupo", ordem: 5, sugestao: "victor", recorrencia: "unica", label: "[TEMPLATE] Notificações do grupo durante o evento (Aulas 1-6)", detalhe: "'Estamos AO VIVO AGORA' 10min antes de cada aula + link do YouTube + recap na manhã seguinte para quem perdeu. Escrever uma vez, reusar toda semana (só o link do vídeo muda)." },
  { id: "grp-op-criar", frente: "grupo", ordem: 6, sugestao: "victor", pendencia: true, recorrencia: "semanal", label: "[CICLO] Criar o grupo de WhatsApp da semana", detalhe: "Grupo novo a cada ciclo — não reaproveitar (limite de 1.000 membros do WhatsApp + escassez perde efeito com coortes misturadas). Nome padrão Tabari: 'Super Oferta — Como Construir um CRM Customizado [semana X]'. PENDÊNCIA CRÍTICA no 1º ciclo — ainda não existe e a Aula 12 do IAA já está no ar apontando pra cá." },
  { id: "grp-op-config", frente: "grupo", ordem: 7, sugestao: "victor", recorrencia: "semanal", label: "[CICLO] Configurar o grupo da semana: capa, descrição, admins", detalhe: "3-5 admins (Victor + backup). Descrição curta com o cronograma do aquecimento — sem data fixa, por dia da semana." },
  { id: "grp-op-link", frente: "grupo", ordem: 8, sugestao: "victor", recorrencia: "semanal", label: "[CICLO] Gerar o novo link de convite e atualizar em todo lugar que aponta pra ele", detalhe: "Precisa ser trocado toda semana em: tela final da Aula 12 (ou automação), página de obrigado do IAA, ManyChat. Esquecer de atualizar um desses = aluno entrando no grupo da semana errada/fechado." },
  { id: "grp-op-automacao", frente: "grupo", ordem: 9, sugestao: "victor", recorrencia: "semanal", label: "[CICLO] Apontar a automação de entrada pro link novo da semana", detalhe: "ManyChat ou link direto na tela final da Aula 12 — sem esse passo, a entrada fica manual e não escala com o tráfego. No 1º ciclo, monta a automação; nos seguintes, só troca a variável do link." },
  { id: "grav-aula12", frente: "gravacao", ordem: 1, sugestao: "victor", recorrencia: "unica", label: "Regravar a aula 12 do IAA (Introdução à Automação)", detalhe: "Nova ponte final aponta pro grupo de aquecimento (link só entra depois de grp-op-link estar pronto), não pro S.H.A.R.K. genérico" },
  { id: "grav-criativos", frente: "gravacao", ordem: 2, sugestao: "victor", recorrencia: "unica", label: "Produzir criativos do curso de entrada (IAA)", detalhe: "Reel 'quanto cobrar' + UGC casual — desbloqueia o tráfego" },
  { id: "grav-5aulas", frente: "gravacao", ordem: 3, sugestao: "victor", recorrencia: "unica", label: "Gravar as 5 aulas do evento (LPSG CRM) — 📅 13-19/jul", detalhe: "CRM ao vivo com Claude Code, 40-50min cada. Janela de gravação: 13 a 19/jul (antes do evento em 27/jul). Gravado uma vez — as aulas são reusadas em todos os ciclos (o L do LPSG é 'Gravado')." },
  { id: "grav-formacao", frente: "gravacao", ordem: 4, sugestao: "victor", recorrencia: "unica", label: "Gravar toda a Formação S.H.A.R.K. — 📅 20-24/jul", detalhe: "O conteúdo do produto principal (o curso que o aluno acessa após comprar no carrinho de 3/ago). Janela de gravação: 20 a 24/jul, logo após as aulas do LPSG. Os 5 agentes S.H.A.R.K. (Shiva/Hades/Atlas/Ravena/Kerberos) — o método completo pra virar prestador de IA." },
  { id: "grav-pitch", frente: "gravacao", ordem: 5, sugestao: "victor", recorrencia: "unica", label: "Escrever o pitch de domingo (Aula 6)", detalhe: "Vende a Formação S.H.A.R.K. R$998" },
  { id: "grav-aula4-avisos", frente: "gravacao", ordem: 6, sugestao: "victor", recorrencia: "unica", label: "Garantir os 3 avisos obrigatórios na Aula 4 (pré-pitch)", detalhe: "Coreografia sagrada do ebook Tabari. A Aula 4 (qui 30/jul) é 100% produto, cria desejo, SEM preço/bônus. Deve conter: (1) apresenta o produto + abre a ficha de interesse; (2) avisa que segunda quem preencheu a ficha entra 6h50 com bônus único, geral às 7h; (3) avisa que domingo 20h tem a revelação de preço e bônus. Preço/bônus SÓ no domingo." },
  { id: "grav-foto-expert", frente: "gravacao", ordem: 7, sugestao: "victor", recorrencia: "unica", label: "Produzir a foto profissional do expert (para as páginas)", detalhe: "Ebook Fase 5: a página de venda precisa da foto profissional do Red. Usar os estilos aprovados de foto (LUA/LoRA)." },
  { id: "grav-depoimentos", frente: "gravacao", ordem: 8, sugestao: "victor", pendencia: true, recorrencia: "unica", label: "Colher 6 depoimentos reais como estudo de caso (nome+idade+contexto+obstáculo+resultado)", detalhe: "Ebook Fase 5: depoimento solto não converte — cada um vira estudo de caso narrativo. São os 5 nomes travados (Neto, Wilson, Marcos Flávio, Rafael, Henrique) + 1. Com autorização de uso. PENDÊNCIA — só o Victor tem os casos." },
  { id: "hot-ingresso", frente: "hotmart", ordem: 1, sugestao: "gleyce", recorrencia: "unica", label: "Criar produto 'Ingresso do evento' R$44", detalhe: "Produto próprio no Hotmart — criado uma vez, o mesmo checkout serve todos os ciclos", tutorial: {
      titulo: "Criar o produto do Ingresso R$44",
      passos: [
        "Entrar em app.hotmart.com → Produtos → Novo Produto.",
        "Tipo: 'Curso Online / Área de Membros' (as aulas gravadas ficam aqui).",
        "Nome do produto: 'Ingresso — Como Construir um CRM Customizado em 5 Dias'.",
        "Definir preço: R$44 à vista. Em Precificação e Ofertas, criar a oferta principal.",
        "Imagem do produto: 600×600px, PNG/JPG, máx 5MB.",
        "Preencher 'Descrição para compradores' e 'Perfil para compradores' (esse é o campo do checkout — não deixar Lorem ipsum).",
        "Salvar e publicar. Anotar o ID numérico do produto e o código de checkout (aparece ao lado do nome).",
      ],
    } },
  { id: "hot-reprecificar", frente: "hotmart", ordem: 2, sugestao: "gleyce", pendencia: true, recorrencia: "unica", label: "Reajustar preços do IAA e dos bumps", detalhe: "IAA R$97→R$17 · Bump 1 R$37→R$26 · Bump 2 R$27→R$35 (soma 8). ⚠️ A PÁGINA do IAA (redpro.com.br/introducao-a-automacao) JÁ mostra R$17 — o checkout T106558618V precisa acompanhar.", tutorial: {
      titulo: "Reajustar preços (clube da soma 8)",
      passos: [
        "Produtos → Sou Produtor(a) → 'Introdução à Automação' (ID 8039631) → Precificação e Ofertas.",
        "Editar a oferta principal: trocar R$97 por R$17.",
        "Abrir o Bump 1 'Kit Captação — Seus 5 Primeiros Clientes' (ID 8052251): trocar R$37 por R$26.",
        "Abrir o Bump 2 'Quanto Cobrar — Manual de Precificação' (ID 8052292): trocar R$27 por R$35.",
        "Salvar cada um. ⚠️ Preço em produção — confirmar com o Victor antes de aplicar (approval gate).",
      ],
    } },
  { id: "hot-retificar-cfb", frente: "hotmart", ordem: 3, sugestao: "gleyce", pendencia: true, recorrencia: "unica", label: "Retificar preço do Claude for Business (upsell): R$47 → R$62", detalhe: "⚠️ A PÁGINA do CFB (redpro.com.br/claude-for-business) JÁ mostra R$62 (ancorado em R$179). O checkout V105607171C ainda cobra R$47 — reprecificar a oferta pra R$62 (6+2=8, soma 8) no Hotmart antes de divulgar." },
  { id: "hot-capas", frente: "hotmart", ordem: 4, sugestao: "gleyce", recorrencia: "unica", label: "Trocar as capas dos bumps após reajustar", tutorial: {
      titulo: "Trocar as capas dos bumps",
      passos: [
        "Gerar as novas capas com os preços atualizados (script bumps/capas/gerar-curso.js, se disponível — senão pedir ao Victor).",
        "Produtos → cada bump → Página do Produto → Imagem do produto → substituir (600×600px).",
        "Salvar e conferir no checkout se a capa nova aparece.",
      ],
    } },
  { id: "hot-imagens-produtos", frente: "hotmart", ordem: 5, sugestao: "ambos", pendencia: true, recorrencia: "unica", label: "Colocar/melhorar as imagens de TODOS os produtos (600×600)", detalhe: "Padronizar as capas de produto no Hotmart com a ID visual RedPro (laranja/preto). ✅ Capa do Ingresso pronta em 10-assets/capas-hotmart/ingresso-crm-5-dias-600x600.png. Faltam: IAA, os 2 bumps, CFB, Formação. Compor via HTML/CSS (texto nítido, não IA generativa). PENDÊNCIA." },
  { id: "hot-formacao", frente: "hotmart", ordem: 6, sugestao: "gleyce", recorrencia: "unica", label: "Criar produto Formação S.H.A.R.K. R$998", detalhe: "12x R$83,17 · carrinho abre 3/ago", tutorial: {
      titulo: "Criar o produto da Formação S.H.A.R.K.",
      passos: [
        "Produtos → Novo Produto → tipo 'Curso Online / Área de Membros'.",
        "Nome: 'Formação S.H.A.R.K.'.",
        "Precificação: R$998 à vista + parcelamento em 12x de R$83,17 (Parcelado com taxas, até 12x).",
        "Configurar 'Parcelado' para exibir 12x como padrão no checkout (parâmetro ?split=12).",
        "Garantia: configurar 7 dias (a garantia condicional de 90+90 dias é tratada por fora, no atendimento).",
        "NÃO abrir o carrinho ainda — deixar pronto para ativar em 3/ago às 6h50.",
        "Anotar o ID do produto e o código de checkout.",
      ],
    } },
  { id: "hot-coparticipacao-gleyce", frente: "hotmart", ordem: 7, sugestao: "gleyce", recorrencia: "unica", label: "Alterar a coparticipação da Gleyce para 20% na Formação S.H.A.R.K.", detalhe: "Configurar a divisão de comissão (coprodução) da Formação S.H.A.R.K. com 20% para a Gleyce. Fazer depois que o produto hot-formacao estiver criado.", tutorial: {
      titulo: "Configurar coprodução 20% na Formação",
      passos: [
        "Produtos → 'Formação S.H.A.R.K.' → menu lateral → Coprodução (ou Colaboradores).",
        "Adicionar/editar a Gleyce como coprodutora.",
        "Definir a porcentagem de comissão: 20%.",
        "Definir a vigência do contrato de coprodução (data de início e, se aplicável, término).",
        "Enviar o convite — a Gleyce precisa aceitar na conta Hotmart dela.",
        "Confirmar que o split aparece corretamente antes de abrir o carrinho em 3/ago.",
      ],
    } },
  { id: "hot-checkout", frente: "hotmart", ordem: 8, sugestao: "gleyce", recorrencia: "unica", label: "Configurar checkout do ingresso + área de entrega", detalhe: "Onde as aulas gravadas ficam disponíveis", tutorial: {
      titulo: "Checkout do ingresso + área de membros",
      passos: [
        "Produtos → Área de Membros → área do 'Ingresso' → Conteúdo → Criar módulo (uma aula por dia do evento).",
        "Fazer upload das 5 aulas gravadas (mp4, máx 20GB cada) conforme o Victor entregar.",
        "Ferramentas → Aparência da Página de Pagamento → produto Ingresso → configurar Página de Obrigado (redireciona pro grupo de WhatsApp).",
        "Testar o fluxo com cupom de ~99% (deixa em R$1,00) — comprar e conferir se o acesso libera.",
      ],
    } },
  { id: "hot-limpar", frente: "hotmart", ordem: 9, sugestao: "gleyce", recorrencia: "unica", label: "Limpar o Hotmart deixando só a RedPro AI Academy", tutorial: {
      titulo: "Limpar o Club",
      passos: [
        "Produtos → Área de Membros: revisar quais áreas/produtos ainda estão ativos.",
        "Arquivar ou remover o que não pertence à RedPro AI Academy (produtos de teste, versões antigas).",
        "Confirmar com o Victor antes de remover qualquer produto com vendas.",
      ],
    } },
  { id: "hot-provasocial", frente: "hotmart", ordem: 10, sugestao: "victor", pendencia: true, recorrencia: "unica", label: "Fornecer prova social real (nome + resultado)", detalhe: "Depoimentos para os e-mails e o carrinho — só o Victor tem os casos. PENDÊNCIA." },
  { id: "pag-ingresso", frente: "paginas", ordem: 1, sugestao: "victor", recorrencia: "unica", label: "Página de checkout do ingresso (sem página de venda tradicional)", detalhe: "Método Tabari: o ingresso é vendido DENTRO do grupo (ver grp-tpl-revelacao), a página aqui é só o checkout do Hotmart pra onde o link do grupo aponta — sem formulário/pop-up/narrativa de venda extra" },
  { id: "pag-formacao", frente: "paginas", ordem: 2, sugestao: "victor", recorrencia: "unica", label: "✅ Página de venda da Formação S.H.A.R.K.", detalhe: "CODADA e no ar: redpro.com.br/formacao-shark (15 dobras). Para o carrinho de 3/ago. ⚠️ Placeholders aguardando dado real: checkout Hotmart da Formação, foto do expert (LUA), depoimentos (Neto/Wilson/Marcos Flávio/Rafael/Henrique)." },
  { id: "pag-obrigado", frente: "paginas", ordem: 3, sugestao: "victor", recorrencia: "unica", label: "✅ Página de obrigado do ingresso (pós-compra)", detalhe: "CODADA e no ar: redpro.com.br/lpsg-obrigado. Reforça que a pessoa já está no grupo. ⚠️ Placeholder: link do grupo de WhatsApp (grp-op-link) + micro-instrução (checklist PDF ambiente pronto)." },
  { id: "aut-liberacao", frente: "paginas", ordem: 4, sugestao: "victor", recorrencia: "unica", label: "Automação que libera o acesso às aulas do evento pós-compra do ingresso", detalhe: "Distinta da entrada no grupo (que já é automática via grp-op-automacao) — essa é só a liberação da área de membros" },
  { id: "aut-ficha", frente: "paginas", ordem: 5, sugestao: "victor", recorrencia: "unica", label: "✅ Ficha de interesse (abre na aula de quinta, 30/jul)", detalhe: "CODADA, funcional e no ar: redpro.com.br/lpsg-ficha. 9 campos + qualificação automática HOT/WARM/COLD → notifica no Telegram do Red. Abre na Aula 4 (30/jul), dá a janela das 6h50. Sem pendência — funciona de verdade." },
  { id: "aut-emails", frente: "paginas", ordem: 6, sugestao: "victor", recorrencia: "unica", label: "Programar a sequência de e-mails", detalhe: "12 e-mails já escritos" },
  { id: "aut-lista", frente: "paginas", ordem: 7, sugestao: "victor", recorrencia: "unica", label: "Criar a lista de e-mail dos inscritos" },
  { id: "aut-recuperacao", frente: "paginas", ordem: 8, sugestao: "victor", recorrencia: "unica", label: "Automação de recuperação de carrinho abandonado", detalhe: "3 mensagens prontas. Ebook: a recuperação dos indecisos é 1 a 1 pelo time de vendas, não disparo em massa." },
  { id: "aut-plataforma", frente: "paginas", ordem: 9, sugestao: "victor", recorrencia: "unica", label: "Definir a plataforma onde as aulas gravadas vão rodar" },
  { id: "aut-templates-meta", frente: "paginas", ordem: 10, sugestao: "victor", pendencia: true, recorrencia: "unica", label: "Submeter os templates de WhatsApp na Meta (leva 1-3 dias úteis)", detalhe: "Ebook Fase 2: a aprovação dos templates leva de 1 a 3 dias úteis — fazer CEDO, senão trava a mensageria do evento. PENDÊNCIA de prazo." },
  { id: "aut-cap44", frente: "paginas", ordem: 11, sugestao: "victor", recorrencia: "semanal", label: "Aplicar o cap 4+4 na mensageria do evento", detalhe: "Regra inegociável do ebook: no máximo 4 mensagens na API + 4 no grupo por dia. Sem repescagem, sem trocar o nome do grupo. Vale a cada ciclo." },
  { id: "aut-disparos-d1", frente: "paginas", ordem: 12, sugestao: "victor", recorrencia: "semanal", label: "Programar os 5 disparos do D1 do carrinho (6h50→7h→8h→10h→19h)", detalhe: "Ebook Etapa 5: 85-90% das vendas saem no D1. 5 disparos: 6h50 (ficha entra 10min antes, bônus único) → 7h (abre geral) → 8h → 10h → 19h. De terça a sexta: ZERO mensagem (silêncio proposital). ⚠️ No nosso 1º ciclo o carrinho fecha 21h do mesmo dia (D1), então ajustar os horários da tarde/noite ao nosso fechamento." },
  { id: "traf-anuncios", frente: "trafego", ordem: 1, sugestao: "victor", recorrencia: "unica", label: "Montar os anúncios de venda do ingresso", detalhe: "5 variações, máx. 60% de texto na imagem — usados como reforço fora do grupo (Stories/Reels), a venda em si acontece dentro do grupo (grp-tpl-revelacao)" },
  { id: "traf-curso", frente: "trafego", ordem: 2, sugestao: "victor", pendencia: true, recorrencia: "unica", label: "Subir o tráfego do curso de entrada (IAA)", detalhe: "⚠️ BLOQUEADO até toda a frente Grupo estar pronta (templates escritos + grp-op-criar → grp-op-automacao do ciclo atual) — cada real gasto aqui manda gente pra Aula 12, que aponta pro grupo. Assim que os 2 criativos ficarem prontos E o grupo existir. Liga uma vez e roda perpétuo." },
  { id: "traf-ingresso", frente: "trafego", ordem: 3, sugestao: "victor", recorrencia: "semanal", label: "Ligar tráfego pago do ingresso R$44", detalhe: "Método Tabari: ROAS piso 1,25 · começa com lista IAA + orgânico, liga pago com os criativos. Reativado/ajustado a cada ciclo." },
  { id: "traf-meta", frente: "trafego", ordem: 4, sugestao: "victor", recorrencia: "semanal", label: "Configurar meta de lista do ciclo", detalhe: "Referência: 30% de presença na Aula 1. Definida a cada semana." },
  { id: "ges-cronograma", frente: "gestao", ordem: 1, sugestao: "gleyce", recorrencia: "semanal", label: "Manter o cronograma vivo e cobrar cada prazo" },
  { id: "ges-ordem", frente: "gestao", ordem: 2, sugestao: "gleyce", recorrencia: "semanal", label: "Garantir a ordem certa: Grupo → Hotmart → Páginas", detalhe: "O grupo bloqueia o tráfego do IAA, que já está rodando — é a prioridade nº 1 antes de qualquer outra coisa" },
  { id: "ges-status", frente: "gestao", ordem: 3, sugestao: "gleyce", recorrencia: "semanal", label: "Relatório de status diário até o evento" },
  { id: "dash-metricas", frente: "dashboard", ordem: 1, sugestao: "gleyce", recorrencia: "semanal", label: "Conferir as métricas do evento e do carrinho", detalhe: "Presença por aula, queda entre aulas, ficha de interesse (%), conversão no carrinho, ROAS do ingresso. Fonte: Hotmart + Meta. Comparar com os benchmarks Tabari." },
  { id: "dash-documentar", frente: "dashboard", ordem: 2, sugestao: "gleyce", recorrencia: "semanal", label: "Documentar os números do 1º ciclo (fecha o carrinho → registra)", detalhe: "Ebook: ao fechar o carrinho, documentar os resultados. Serve para recalibrar os benchmarks depois de 4-6 ciclos e comparar ciclo a ciclo." },
  { id: "cs-onboarding", frente: "cs", ordem: 1, sugestao: "gleyce", recorrencia: "unica", label: "Montar o onboarding de 90 dias da Formação S.H.A.R.K.", detalhe: "Ebook Etapa 6: boas-vindas, primeiros passos, marcos de progresso para a pessoa não sumir. Feito uma vez, reusado a cada turma." },
  { id: "cs-nps", frente: "cs", ordem: 2, sugestao: "gleyce", recorrencia: "semanal", label: "Rodar a pesquisa NPS e captar depoimentos no momento certo", detalhe: "Mede satisfação e capta prova social. Repete a cada turma/ciclo." },
  { id: "cs-provasocial", frente: "cs", ordem: 3, sugestao: "victor", recorrencia: "semanal", label: "Transformar depoimento bruto em estudo de caso narrativo", detalhe: "Ebook: a prova social volta pras páginas e criativos do próximo ciclo. É o que faz cada lançamento começar melhor que o anterior." },
];

// Fases do método Tabari com as datas reais do 1º ciclo.
export interface Fase {
  num: string;
  titulo: string;
  data: string;
  descricao: string;
  cor: string;
}

export const FASES_TABARI: Fase[] = [
  {
    num: "1",
    titulo: "Captação (Curso de Entrada)",
    data: "Agora → contínuo",
    descricao: "Curso de R$17 com tráfego pago traz leads a custo quase zero. Na Aula 12, o aluno entra direto no grupo de WhatsApp de aquecimento — gratuito, sem comprar nada ainda.",
    cor: "#f97316",
  },
  {
    num: "2",
    titulo: "Aquecimento no Grupo de WhatsApp",
    data: "13 → 26/jul",
    descricao: "É dentro do grupo — não numa página — que a oferta do ingresso R$44 é revelada e vendida, com ancoragem e escassez real (padrão Turbo Express). Conteúdo orgânico + e-mails reforçam por fora. Meta: 30% de presença na 1ª aula do evento.",
    cor: "#fb923c",
  },
  {
    num: "3",
    titulo: "Evento 5+1 (Aulas 1-5)",
    data: "27 → 31/jul · 7h",
    descricao: "5 dias entregando valor real: a pessoa constrói um CRM funcional. Marcos de vitória na quarta e na sexta.",
    cor: "#f59e0b",
  },
  {
    num: "4",
    titulo: "Pitch de Domingo (Aula 6)",
    data: "2/ago · 20h",
    descricao: "A oferta da Formação S.H.A.R.K. R$998. Ancoragem, bônus escalonados, escassez real.",
    cor: "#ef4444",
  },
  {
    num: "5",
    titulo: "Abertura do Carrinho",
    data: "3/ago · 6h50",
    descricao: "Carrinho abre com janela curta. Prova social intercalada + recuperação de abandono até fechar.",
    cor: "#dc2626",
  },
];

// ===================== DRIVE DE CONTEÚDO =====================
// Repositório do material do lançamento. `url` vazio = ainda não subiu (aparece como "adicionar link").
// Basta colar o link do Google Drive / arquivo em cada item.

export type DriveTipo = "doc" | "pdf" | "html" | "img" | "planilha" | "video" | "pasta" | "link";

export interface DriveItem {
  nome: string;
  descricao: string;
  tipo: DriveTipo;
  url: string; // vazio = pendente de upload
}

export interface DriveCategoria {
  id: string;
  titulo: string;
  emoji: string;
  itens: DriveItem[];
}

export const DRIVE: DriveCategoria[] = [
  {
    id: "pesquisa-briefing",
    titulo: "Pesquisa & Briefing",
    emoji: "🧠",
    itens: [
      { nome: "Pesquisa de Mercado", descricao: "Público, dores, concorrentes, gap e linguagem do avatar", tipo: "doc", url: "https://docs.google.com/document/d/1FWQNU7oS9I_tqwGWVcri-Vzh_Gn1vK07VfErL-ReAq8/edit" },
      { nome: "Briefing Completo (13 seções)", descricao: "Big Idea, promessa, mecanismos, avatar, dores, desejos, objeções", tipo: "doc", url: "https://docs.google.com/document/d/1CKUdPkiJlgqLtefNuCq-Fxj0bm4tXwhM3c7R6056NfA/edit" },
      { nome: "Briefing Estratégico (10 seções)", descricao: "Documento de validação com o expert — oferta, funil, metas, cronograma", tipo: "doc", url: "" },
    ],
  },
  {
    id: "marca",
    titulo: "Marca & Identidade",
    emoji: "🎨",
    itens: [
      { nome: "Brandbook do Evento", descricao: "Paleta, tipografia serifada, moodboard, logo selo (Construa · Publique · Venda)", tipo: "html", url: "" },
      { nome: "Logos RedPro AI Academy", descricao: "Versões vermelha e preta da marca-mãe (PNG)", tipo: "pasta", url: "" },
      { nome: "Selo do Evento (PNG transparente)", descricao: "Lockup selo/emblema para peças", tipo: "img", url: "" },
      { nome: "Moodboard — imagens de ambiente", descricao: "6 imagens na paleta laranja/preto para peças", tipo: "pasta", url: "" },
    ],
  },
  {
    id: "estrutura",
    titulo: "Estrutura do Lançamento",
    emoji: "🗺️",
    itens: [
      { nome: "Estrutura do Lançamento", descricao: "Nome do evento, 5 aulas, pitch e calendário", tipo: "doc", url: "https://docs.google.com/document/d/1mW7UnoyKQhOdZlXkuWRAoEuJDvr08gy_SOfU4Id9s1M/edit" },
      { nome: "Estrutura das 5 Aulas (v3)", descricao: "Roteiro psicológico + técnico, aula por aula", tipo: "doc", url: "" },
      { nome: "Pitch de Domingo (14 partes)", descricao: "Roteiro completo da Aula 6", tipo: "doc", url: "" },
    ],
  },
  {
    id: "peças",
    titulo: "Peças de Campanha",
    emoji: "✍️",
    itens: [
      { nome: "Mensageria WhatsApp", descricao: "Todas as mensagens do grupo, sábado → D1", tipo: "doc", url: "" },
      { nome: "Sequência de E-mails", descricao: "12 e-mails do lançamento (canal secundário)", tipo: "doc", url: "" },
      { nome: "Estrutura das Páginas", descricao: "Ingresso, Formação e Obrigado — dobra a dobra", tipo: "doc", url: "" },
      { nome: "Criativos de Venda do Ingresso", descricao: "5 ângulos de criativo (3 vídeos + 2 estáticos)", tipo: "doc", url: "" },
    ],
  },
];

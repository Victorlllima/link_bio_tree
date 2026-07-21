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
  { id: "set-contas-infra", frente: "setup", ordem: 1, sugestao: "gleyce", recorrencia: "unica", label: "✅ Conferir as contas de infra (Meta, Hotmart, ManyChat, Vercel, domínio)", detalhe: "✅ VALIDADO 14/07 — **Meta** (Claude via API): Business \"RedPro I.A.\" 2135318333489982, conta de anúncios 961901509283620 ACTIVE com cartão Visa ····3979, página FB 454223454436730, Instagram 17841464699013492, Pixel Vibecoding recebendo eventos. **Hotmart**: credenciais no vault starlight (email/password/JWT/webhook token) + produtos criados (8124888 ingresso, Formação). **ManyChat**: API key no vault global. **Vercel + domínio**: redpro.com.br no ar (deploys de hoje ok). Sem n8n no 1º ciclo." },
  { id: "set-google-sa", frente: "setup", ordem: 2, sugestao: "victor", pendencia: true, recorrencia: "unica", label: "Google + Service Account (Sheets/Drive/Calendar do CS)", detalhe: "Necessário para CRM em planilha, Drive do lançamento e Calendar do pós-venda. O JSON da Service Account fica em pasta criptografada. ⚠️ PENDENTE — não há Service Account do Starlight no vault (auditoria Claude 14/07). Só é necessário quando montar o CS/pós-venda; não bloqueia o tráfego nem o evento." },
  { id: "set-waba", frente: "setup", ordem: 3, sugestao: "victor", pendencia: true, recorrencia: "unica", label: "WABA (WhatsApp Business API) — número dedicado da mensageria", detalhe: "Já temos WABA (+55 61 9108-9602). ⚠️ FALTA: o **Phone Number ID** não está em nenhum vault (auditoria Claude 14/07). Pegar no Meta Business → WhatsApp Manager → API Setup e salvar no vault `starlight` como `waba_phone_number_id`. É um dos 5 dados críticos do ebook Tabari." },
  { id: "set-dados-criticos", frente: "setup", ordem: 4, sugestao: "victor", pendencia: true, recorrencia: "unica", label: "Anotar os 5 dados críticos do ebook em local seguro (vault)", detalhe: "AUDITORIA Claude 14/07 — **✅ 3 de 5 já no vault:** (1) Pixel ID `1543917230170877` em `global/meta_pixel_id` ✅ · (2) CAPI Token em `global/meta_capi_access_token` ✅ · (5) HOTTOK em `starlight/hotmart_webhook_token` ✅. **🔴 FALTAM 2:** (3) **Phone Number ID (WABA)** — ver set-waba · (4) **Product ID + Offer Key** dos 2 produtos Hotmart (Ingresso 8124888/R106737413U e Formação) — os IDs estão documentados em `hotmart_doc.md` mas NÃO no vault. Salvar em `starlight` como `hotmart_ingresso_product_id`, `hotmart_ingresso_offer_key`, idem Formação." },
  { id: "set-pixel-capi", frente: "setup", ordem: 5, sugestao: "victor", recorrencia: "unica", label: "✅ Confirmar Pixel + CAPI ativos (rastreamento server-side)", detalhe: "✅ VALIDADO AO VIVO (Claude 14/07, via Meta API): Pixel [Vibecoding] 1543917230170877 recebendo eventos reais — PageView diário + InitiateCheckout (3 em 13/07, 3 em 14/07) + CAPI server-side (courseAccess/lessonAccess da Hotmart). Único pixel vivo do business (os outros 5 estão mortos). ⚠️ Purchase ainda não disparou (sem venda). Pixel liberado pra conta 961901509283620 (Red fez o vínculo em 14/07)." },
  { id: "grp-tpl-boasvindas", frente: "grupo", ordem: 1, sugestao: "victor", recorrencia: "unica", label: "✅ [TEMPLATE] Mensagem de boas-vindas automática do grupo", detalhe: "Dispara quando a pessoa entra. Confirma que ela está no lugar certo e adianta o cronograma (silêncio até o Dia 1). Escrever uma vez, reusar toda semana." },
  { id: "grp-tpl-dia1a3", frente: "grupo", ordem: 2, sugestao: "victor", recorrencia: "unica", label: "✅ [TEMPLATE] Mensageria dos dias de silêncio/aquecimento (D1-D3)", detalhe: "Padrão Tabari: grupo fica quieto entre a entrada e o início oficial — só 1-2 toques de lembrete leve, sem revelar oferta ainda. Escrever uma vez, reusar toda semana." },
  { id: "grp-tpl-revelacao", frente: "grupo", ordem: 3, sugestao: "victor", recorrencia: "unica", label: "✅ [TEMPLATE] Sequência de aquecimento + venda do ingresso (R$44) dentro do grupo", detalhe: "✅ ESCRITA em 06-mensageria-wpp/aquecimento-grupo-venda-ingresso.md (5 toques: boas-vindas → o que constrói → abre oferta+preço → escassez+objeção → última chamada). Recorrência: TEXTO escrito 1× só, mas DISPARADO a cada ciclo (só link do checkout + datas mudam). Ancoragem → preço R$44 → link direto do checkout." },
  { id: "grp-tpl-escassez", frente: "grupo", ordem: 4, sugestao: "victor", recorrencia: "unica", label: "✅ [TEMPLATE] Mensagens de escassez do dia de abertura do ingresso", detalhe: "Padrão Tabari: % de vagas preenchidas ao longo do dia (ex. 73%→89%→95%→'últimas vagas'), fecha à noite. Escrever uma vez, reusar toda semana." },
  { id: "grp-tpl-evento", frente: "grupo", ordem: 5, sugestao: "victor", recorrencia: "unica", label: "✅ [TEMPLATE] Notificações do grupo durante o evento (Aulas 1-6)", detalhe: "'Estamos AO VIVO AGORA' 10min antes de cada aula + link do YouTube + recap na manhã seguinte para quem perdeu. Escrever uma vez, reusar toda semana (só o link do vídeo muda)." },
  { id: "grp-op-criar", frente: "grupo", ordem: 6, sugestao: "victor", recorrencia: "semanal", label: "✅ [CICLO] Criar o grupo de WhatsApp da semana", detalhe: "Grupo novo a cada ciclo — não reaproveitar (limite de 1.000 membros do WhatsApp + escassez perde efeito com coortes misturadas). Nome VISÍVEL (todos os leads veem): 'Como Construir um CRM Customizado' — SEM número de semana/ciclo (tem que parecer evento único). ('Super Oferta' é nome do Turbo Express, outro modelo — não usar no LPSG.) Diferenciar coortes só na sua lista interna, nunca no nome. Nasce FECHADO pra mensagens (só admins postam) até o momento certo. ✅ CRIADO no 1º ciclo (Red confirmou 14/07)." },
  { id: "grp-op-config", frente: "grupo", ordem: 7, sugestao: "victor", recorrencia: "semanal", label: "✅ [CICLO] Configurar o grupo da semana: capa, descrição, admins", detalhe: "✅ FEITO (Red 14/07): admins + grupo fechado + capa. Descrição pronta em 06-mensageria-wpp/descricao-do-grupo.md." },
  { id: "grp-op-link", frente: "grupo", ordem: 8, sugestao: "victor", pendencia: true, recorrencia: "semanal", label: "[CICLO] Gerar o novo link de convite e atualizar em todo lugar que aponta pra ele", detalhe: "Link deste ciclo: chat.whatsapp.com/IsvZFOVIYKmDss3tSRwrKx. ✅ Ligado na página de obrigado + ✅ na tela final da Aula 12 do IAA (Red 14/07). FALTA: ligar no ManyChat (grp-op-automacao)." },
  { id: "grp-op-automacao", frente: "grupo", ordem: 9, sugestao: "victor", recorrencia: "semanal", label: "[CICLO] Apontar a automação de entrada pro link novo da semana", detalhe: "ManyChat ou link direto na tela final da Aula 12 — sem esse passo, a entrada fica manual e não escala com o tráfego. No 1º ciclo, monta a automação; nos seguintes, só troca a variável do link." },
  { id: "grav-aula12", frente: "gravacao", ordem: 1, sugestao: "victor", recorrencia: "unica", label: "✅ Regravar a aula 12 do IAA (Introdução à Automação)", detalhe: "✅ FEITO (Red 14/07): ponte final aponta pro grupo de aquecimento com o link." },
  { id: "grav-criativos", frente: "gravacao", ordem: 2, sugestao: "victor", recorrencia: "unica", label: "✅ Produzir criativos do curso de entrada (IAA)", detalhe: "✅ FEITO 14/07 — 14 criativos no ar (11 imagens + 3 vídeos), acima do mínimo Tabari (10 img + 2-5 vid). Inclui os 2 \"Dedo no Criativo\" (Red + produto + preço + POV 1ª pessoa), gerados via skill criador-criativos do Squad Turbo. Arquivos em 09-criativos-trafego/_UPLOAD-META-IAA/." },
  { id: "grav-5aulas", frente: "gravacao", ordem: 3, sugestao: "victor", recorrencia: "unica", label: "Gravar as 5 aulas do evento (LPSG CRM) — 📅 13-19/jul", detalhe: "CRM ao vivo com Claude Code, 40-50min cada. Janela de gravação: 13 a 19/jul (antes do evento em 27/jul). Gravado uma vez — as aulas são reusadas em todos os ciclos (o L do LPSG é 'Gravado')." },
  { id: "grav-formacao", frente: "gravacao", ordem: 4, sugestao: "victor", recorrencia: "unica", label: "Gravar toda a Formação S.H.A.R.K. — 📅 20-24/jul", detalhe: "O conteúdo do produto principal (o curso que o aluno acessa após comprar no carrinho de 3/ago). Janela de gravação: 20 a 24/jul, logo após as aulas do LPSG. Os 5 agentes S.H.A.R.K. (Shiva/Hades/Atlas/Ravena/Kerberos) — o método completo pra virar prestador de IA." },
  { id: "grav-pitch", frente: "gravacao", ordem: 5, sugestao: "victor", recorrencia: "unica", label: "✅ Escrever o pitch de domingo (Aula 6)", detalhe: "PRONTO: pitch de domingo em 14 partes escrito em 05-pitch/pitch-domingo-v2-14partes.md. Vende a Formação S.H.A.R.K. R$998. Falta: Red grava a Aula 6 no dia." },
  { id: "grav-aula4-avisos", frente: "gravacao", ordem: 6, sugestao: "victor", recorrencia: "unica", label: "Garantir os 3 avisos obrigatórios na Aula 4 (pré-pitch)", detalhe: "Coreografia sagrada do ebook Tabari. A Aula 4 (qui 30/jul) é 100% produto, cria desejo, SEM preço/bônus. Deve conter: (1) apresenta o produto + abre a ficha de interesse; (2) avisa que segunda quem preencheu a ficha entra 6h50 com bônus único, geral às 7h; (3) avisa que domingo 20h tem a revelação de preço e bônus. Preço/bônus SÓ no domingo." },
  { id: "grav-boasvindas", frente: "gravacao", ordem: 7, sugestao: "victor", pendencia: true, recorrencia: "unica", label: "Gravar o vídeo de boas-vindas do Ingresso (área de membros)", detalhe: "~3-4min, frente à câmera, sem logo nos 3 primeiros seg. Roteiro pronto em 04-conteudo-aulas/onboarding-area-de-membros.md. Vai na aula \"Comece por aqui\" da área de membros do Ingresso (8124888). PENDÊNCIA — só o Red grava." },
  { id: "grav-youtube", frente: "gravacao", ordem: 8, sugestao: "victor", pendencia: true, recorrencia: "unica", label: "Configurar a transmissão das aulas no YouTube (não-listado)", detalhe: "⚠️ NOVO (descoberto em 14/07 na MECANICA-DEFINITIVA): as aulas do LPSG NÃO rodam no grupo — rodam no YOUTUBE como \"não listado\", transmitidas \"como se fosse ao vivo\" (Tabari usa StreamYard/OneStream). Nova playlist a cada ciclo. Os links chegam pelo WhatsApp. As dúvidas vão nos COMENTÁRIOS do vídeo, não no chat nem no grupo. Precisa: canal configurado + ferramenta de transmissão de gravado." },
  { id: "grav-foto-expert", frente: "gravacao", ordem: 9, sugestao: "victor", recorrencia: "unica", label: "✅ Produzir a foto profissional do expert (para as páginas)", detalhe: "✅ FEITO 14/07: LoRA do Red funcionando (imagem do jornal + os 2 criativos \"Dedo no Criativo\"). Element \"Red-RedPro\" salvo no Higgsfield pra reuso. Estilos aprovados em uso." },
  { id: "grav-depoimentos", frente: "gravacao", ordem: 10, sugestao: "victor", pendencia: true, recorrencia: "unica", label: "Colher 6 depoimentos reais como estudo de caso (nome+idade+contexto+obstáculo+resultado)", detalhe: "Ebook Fase 5: depoimento solto não converte — cada um vira estudo de caso narrativo. São os 5 nomes travados (Neto, Wilson, Marcos Flávio, Rafael, Henrique) + 1. Com autorização de uso. PENDÊNCIA — só o Victor tem os casos." },
  { id: "hot-checkout-35", frente: "hotmart", ordem: 1, sugestao: "victor", pendencia: true, recorrencia: "unica", label: "Criar oferta R$35 do ingresso no Hotmart (aluno IAA)", detalhe: "⚠️ NOVO 20/07: o ingresso tem 2 preços — R$44 (público frio, tráfego) e R$35 (aluno IAA, via e-mail D5 + LP do Desafio). Criar oferta/link de pagamento separado no mesmo produto Ingresso (8124888) com preço R$35. É pra onde a LP do Desafio aponta. Soma 8 (3+5=8)." },
  { id: "hot-email-d5", frente: "hotmart", ordem: 2, sugestao: "victor", pendencia: true, recorrencia: "unica", label: "Configurar o disparo do e-mail D5 (compra IAA → +5 dias)", detalhe: "⚠️ NOVO 20/07: e-mail pronto em 07-emails/email-d5-iaa-para-desafio.md. Disparar automático 5 dias após a compra do IAA (webhook Hotmart → Resend, ou automação de e-mail da Hotmart). Puxa o aluno pro Desafio com desconto R$35." },
  { id: "hot-ingresso", frente: "hotmart", ordem: 3, sugestao: "gleyce", recorrencia: "unica", label: "✅ Criar produto 'Ingresso do evento' R$44", detalhe: "CRIADO (ID 8124888 · checkout R106737413U · oferta x041eoi2 · R$44). Capa aplicada, descrição/perfil preenchidos. ⚠️ Falta pra PUBLICAR: (1) forma de pagamento → PAGAMENTO ÚNICO à vista; (2) área de membros: 1 aula \"Comece por aqui\" (vídeo de boas-vindas do Red + texto de onboarding — pronto em 04-conteudo-aulas/onboarding-area-de-membros.md, regra Tabari: só isso na Hotmart, aulas vão pro WhatsApp). Checkout já na mensageria.", tutorial: {
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
  { id: "hot-reprecificar", frente: "hotmart", ordem: 4, sugestao: "gleyce", recorrencia: "unica", label: "✅ Reajustar preços do IAA e dos bumps", detalhe: "IAA R$97→R$17 · Bump 1 R$37→R$26 · Bump 2 R$27→R$35 (soma 8). FEITO 14/07: checkout T106558618V reprecificado para R$17 (alinhado com a página).", tutorial: {
      titulo: "Reajustar preços (clube da soma 8)",
      passos: [
        "Produtos → Sou Produtor(a) → 'Introdução à Automação' (ID 8039631) → Precificação e Ofertas.",
        "Editar a oferta principal: trocar R$97 por R$17.",
        "Abrir o Bump 1 'Kit Captação — Seus 5 Primeiros Clientes' (ID 8052251): trocar R$37 por R$26.",
        "Abrir o Bump 2 'Quanto Cobrar — Manual de Precificação' (ID 8052292): trocar R$27 por R$35.",
        "Salvar cada um. ⚠️ Preço em produção — confirmar com o Victor antes de aplicar (approval gate).",
      ],
    } },
  { id: "hot-retificar-cfb", frente: "hotmart", ordem: 5, sugestao: "gleyce", recorrencia: "unica", label: "✅ Retificar preço do Claude for Business (upsell): R$47 → R$62", detalhe: "FEITO 14/07: checkout V105607171C reprecificado para R$62 (alinhado com a página, soma 8)." },
  { id: "hot-capas", frente: "hotmart", ordem: 6, sugestao: "gleyce", recorrencia: "unica", label: "Trocar as capas dos bumps após reajustar", tutorial: {
      titulo: "Trocar as capas dos bumps",
      passos: [
        "Gerar as novas capas com os preços atualizados (script bumps/capas/gerar-curso.js, se disponível — senão pedir ao Victor).",
        "Produtos → cada bump → Página do Produto → Imagem do produto → substituir (600×600px).",
        "Salvar e conferir no checkout se a capa nova aparece.",
      ],
    } },
  { id: "hot-imagens-produtos", frente: "hotmart", ordem: 7, sugestao: "ambos", pendencia: true, recorrencia: "unica", label: "Colocar/melhorar as imagens de TODOS os produtos (600×600)", detalhe: "Padronizar as capas de produto no Hotmart com a ID visual RedPro (laranja/preto). ✅ Capa do Ingresso pronta em 10-assets/capas-hotmart/ingresso-crm-5-dias-600x600.png. Faltam: IAA, os 2 bumps, CFB, Formação. Compor via HTML/CSS (texto nítido, não IA generativa). PENDÊNCIA." },
  { id: "hot-formacao", frente: "hotmart", ordem: 8, sugestao: "gleyce", recorrencia: "unica", label: "✅ Criar produto Formação S.H.A.R.K. R$998", detalhe: "CRIADO (ID 8125084 · checkout D106737858J · oferta jos48auw · R$998). Capa + descrição aplicadas. Checkout ligado na página /formacao-shark. ⚠️ Falta: (1) resolver parcela (checkout cobra 12x R$103,22 COM taxa, página diz R$103,22); (2) montar área de membros; (3) NÃO abrir carrinho até 3/ago. Coprodução Gleyce 20% pendente (hot-coparticipacao-gleyce).", tutorial: {
      titulo: "Criar o produto da Formação S.H.A.R.K.",
      passos: [
        "Produtos → Novo Produto → tipo 'Curso Online / Área de Membros'.",
        "Nome: 'Formação S.H.A.R.K.'.",
        "Precificação: R$998 à vista + parcelamento em 12x de R$103,22 (Parcelado com taxas, até 12x).",
        "Configurar 'Parcelado' para exibir 12x como padrão no checkout (parâmetro ?split=12).",
        "Garantia: configurar 7 dias (a garantia condicional de 90+90 dias é tratada por fora, no atendimento).",
        "NÃO abrir o carrinho ainda — deixar pronto para ativar em 3/ago às 6h50.",
        "Anotar o ID do produto e o código de checkout.",
      ],
    } },
  { id: "hot-coparticipacao-gleyce", frente: "hotmart", ordem: 9, sugestao: "gleyce", recorrencia: "unica", label: "✅ Alterar a coparticipação da Gleyce para 20% na Formação S.H.A.R.K.", detalhe: "Configurar a divisão de comissão (coprodução) da Formação S.H.A.R.K. com 20% para a Gleyce. Fazer depois que o produto hot-formacao estiver criado.", tutorial: {
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
  { id: "hot-checkout", frente: "hotmart", ordem: 10, sugestao: "gleyce", recorrencia: "unica", label: "Configurar checkout do ingresso + área de entrega", detalhe: "Onde as aulas gravadas ficam disponíveis", tutorial: {
      titulo: "Checkout do ingresso + área de membros",
      passos: [
        "Produtos → Área de Membros → área do 'Ingresso' → Conteúdo → Criar módulo (uma aula por dia do evento).",
        "Fazer upload das 5 aulas gravadas (mp4, máx 20GB cada) conforme o Victor entregar.",
        "Ferramentas → Aparência da Página de Pagamento → produto Ingresso → configurar Página de Obrigado (redireciona pro grupo de WhatsApp).",
        "Testar o fluxo com cupom de ~99% (deixa em R$1,00) — comprar e conferir se o acesso libera.",
      ],
    } },
  { id: "hot-areamembros-ingresso", frente: "hotmart", ordem: 11, sugestao: "ambos", pendencia: true, recorrencia: "unica", label: "Montar a área de membros do Ingresso (\"Comece por aqui\")", detalhe: "1 aula só: subir o vídeo de boas-vindas (grav-boasvindas) + colar o TEXTO de onboarding embaixo (pronto em 04-conteudo-aulas/onboarding-area-de-membros.md). Regra Tabari: só isso na Hotmart, as aulas do evento vão pelo WhatsApp. Necessário pra publicar. PENDÊNCIA." },
  { id: "hot-limpar", frente: "hotmart", ordem: 12, sugestao: "gleyce", recorrencia: "unica", label: "Limpar o Hotmart deixando só a RedPro AI Academy", tutorial: {
      titulo: "Limpar o Club",
      passos: [
        "Produtos → Área de Membros: revisar quais áreas/produtos ainda estão ativos.",
        "Arquivar ou remover o que não pertence à RedPro AI Academy (produtos de teste, versões antigas).",
        "Confirmar com o Victor antes de remover qualquer produto com vendas.",
      ],
    } },
  { id: "hot-provasocial", frente: "hotmart", ordem: 13, sugestao: "victor", pendencia: true, recorrencia: "unica", label: "Fornecer prova social real (nome + resultado)", detalhe: "Depoimentos para os e-mails e o carrinho — só o Victor tem os casos. PENDÊNCIA." },
  { id: "pag-ingresso", frente: "paginas", ordem: 1, sugestao: "victor", recorrencia: "unica", label: "Página de checkout do ingresso (público frio, R$44)", detalhe: "Método Tabari: pro tráfego pago do ingresso, o link do grupo aponta pro checkout Hotmart R$44 direto. Sem narrativa extra. (DISTINTO da LP do Desafio pro aluno IAA — ver pag-lp-desafio.)" },
  { id: "pag-ficha-matricula", frente: "paginas", ordem: 2, sugestao: "victor", recorrencia: "unica", label: "✅ Ficha de MATRÍCULA (redpro.com.br/crm-week-matricula)", detalhe: "✅ CRIADA 21/07 (Claude): passo 2 da mensageria Tabari (\"confirma e-mail · FICHA · grupo\"). Onboarding de quem comprou o ingresso — dados + ocupação + nível de IA + objetivo. Notifica no Telegram. É o link que vai na área de membros." },
  { id: "pag-lp-desafio", frente: "paginas", ordem: 3, sugestao: "victor", pendencia: true, recorrencia: "unica", label: "✅ LP de venda do Desafio \"Construindo um CRM em 5 Dias\" (aluno IAA, R$35)", detalhe: "✅ CODADA 20/07 (Claude): landing page de venda pro comprador do IAA, checkout R$35. É pra onde o e-mail D5 leva. Mudança de mecânica registrada (o aluno IAA compra por LP, não pelo grupo). ⚠️ Placeholder: checkout R$35 do Hotmart (hot-checkout-35) + data do próximo desafio." },
  { id: "pag-obrigado-desafio", frente: "paginas", ordem: 4, sugestao: "victor", pendencia: true, recorrencia: "semanal", label: "✅ Página de obrigado EXCLUSIVA da LP do Desafio (link do grupo, muda toda semana)", detalhe: "✅ CODADA 20/07 (Claude): obrigado própria da LP do Desafio, separada da lpsg-obrigado. Tem o link do grupo do ciclo. ⚠️ SEMANAL: trocar o link do grupo a cada novo desafio." },
  { id: "pag-formacao", frente: "paginas", ordem: 5, sugestao: "victor", recorrencia: "unica", label: "✅ Página de venda da Formação S.H.A.R.K.", detalhe: "CODADA e no ar: redpro.com.br/formacao-shark (15 dobras). Para o carrinho de 3/ago. ⚠️ Placeholders aguardando dado real: checkout Hotmart da Formação, foto do expert (LUA), depoimentos (Neto/Wilson/Marcos Flávio/Rafael/Henrique)." },
  { id: "pag-obrigado", frente: "paginas", ordem: 6, sugestao: "victor", recorrencia: "unica", label: "✅ Página de obrigado do ingresso (pós-compra)", detalhe: "CODADA e no ar: redpro.com.br/lpsg-obrigado. Reforça que a pessoa já está no grupo. ⚠️ Placeholder: link do grupo de WhatsApp (grp-op-link) + micro-instrução (checklist PDF ambiente pronto)." },
  { id: "aut-liberacao", frente: "paginas", ordem: 7, sugestao: "victor", recorrencia: "unica", label: "✅ Automação que libera o acesso às aulas do evento pós-compra do ingresso", detalhe: "✅ DOCUMENTADO 19/07 (Claude): fluxo em 04-conteudo-aulas/automacao-liberacao-acesso-ingresso.md (a Hotmart libera o Club nativamente pós-compra). Falta: Red confirmar a config no painel Hotmart." },
  { id: "aut-ficha", frente: "paginas", ordem: 8, sugestao: "victor", recorrencia: "unica", label: "✅ Ficha de interesse (abre na aula de quinta, 30/jul)", detalhe: "CODADA, funcional e no ar: redpro.com.br/lpsg-ficha. 9 campos + qualificação automática HOT/WARM/COLD → notifica no Telegram do Red. Abre na Aula 4 (30/jul), dá a janela das 6h50. Sem pendência — funciona de verdade." },
  { id: "aut-emails", frente: "paginas", ordem: 9, sugestao: "victor", pendencia: true, recorrencia: "unica", label: "Programar a sequência de e-mails", detalhe: "✅ CONTEÚDO PRONTO: 12 e-mails escritos em 07-emails/. Falta PROGRAMAR no Resend (config externa). PENDÊNCIA de execução." },
  { id: "aut-lista", frente: "paginas", ordem: 10, sugestao: "victor", recorrencia: "unica", label: "Criar a lista de e-mail dos inscritos" },
  { id: "aut-recuperacao", frente: "paginas", ordem: 11, sugestao: "victor", recorrencia: "unica", label: "✅ Automação de recuperação de carrinho abandonado", detalhe: "✅ CONTEÚDO PRONTO 19/07 (Claude): as 3 mensagens 1-a-1 escritas em 06-mensageria-wpp/recuperacao-carrinho-abandonado-D1.md (voz do Red, fechamento 21h, placeholders p/ nome/depoimento). Regra Tabari: recuperação é 1-a-1 no privado, NÃO broadcast. Falta: Red/vendedor disparar no D1 pra quem abandonou." },
  { id: "aut-plataforma", frente: "paginas", ordem: 12, sugestao: "victor", recorrencia: "unica", label: "✅ Definir a plataforma onde as aulas gravadas vão rodar", detalhe: "✅ DECIDIDO 19/07 (Claude): YouTube não-listado (transmite gravado como ao vivo, StreamYard/OneStream). Doc em 03-estrutura-lancamento/DECISAO-PLATAFORMA-AULAS.md. Decisão fechada, execução = tarefa grav-youtube (Red)." },
  { id: "aut-templates-meta", frente: "paginas", ordem: 13, sugestao: "victor", pendencia: true, recorrencia: "unica", label: "Submeter os templates de WhatsApp na Meta (leva 1-3 dias úteis)", detalhe: "Ebook Fase 2: a aprovação dos templates leva de 1 a 3 dias úteis — fazer CEDO, senão trava a mensageria do evento. PENDÊNCIA de prazo." },
  { id: "aut-cap44", frente: "paginas", ordem: 14, sugestao: "victor", recorrencia: "semanal", label: "✅ Aplicar o cap 4+4 na mensageria do evento", detalhe: "✅ DOCUMENTADO 19/07 (Claude): regra em 06-mensageria-wpp/regra-cap-4mais4-mensageria.md (máx 4 API + 4 grupo/dia, como contar, exemplo de dia). Consultar antes de cada disparo." },
  { id: "aut-disparos-d1", frente: "paginas", ordem: 15, sugestao: "victor", recorrencia: "semanal", label: "✅ Programar os 5 disparos do D1 do carrinho (6h50→7h→8h→10h→19h)", detalhe: "✅ CONTEÚDO PRONTO 19/07 (Claude): os 5 disparos escritos em 06-mensageria-wpp/d1-carrinho-5-disparos-formacao-shark.md, ajustados ao fechamento 21h do 1º ciclo. Falta: programar/disparar no dia (config Resend/grupo)." },
  { id: "traf-anuncios", frente: "trafego", ordem: 1, sugestao: "victor", recorrencia: "unica", label: "✅ Montar os anúncios de venda do ingresso", detalhe: "ROTEIROS PRONTOS: matriz de 15 criativos (5 estáticos + 5 vídeos + 5 carrosséis) em 09-criativos-trafego/. Nota: esta tarefa é dos criativos do INGRESSO (R$44). Os criativos do IAA (R$17) já estão no ar — ver grav-criativos + traf-curso." },
  { id: "traf-curso", frente: "trafego", ordem: 2, sugestao: "victor", recorrencia: "unica", label: "✅ Subir o tráfego do curso de entrada (IAA)", detalhe: "✅ NO AR 14/07 — campanha `[ASC+] IAA - Introducao Automacao - Perpetuo` (ID 120248864364630175) na conta 961901509283620. R$100/dia · início agendado 15/07 05h · 14 anúncios ativos · objetivo Vendas/evento Compra · Advantage+ Brasil 25-55 · sem data de término · sem cap de custo · FB+Instagram · zero erros. Padrão Tabari 100%. Perpétuo — liga uma vez e roda." },
  { id: "traf-ingresso", frente: "trafego", ordem: 3, sugestao: "victor", recorrencia: "semanal", label: "Ligar tráfego pago do ingresso R$44", detalhe: "Método Tabari: ROAS piso 1,25 · começa com lista IAA + orgânico, liga pago com os criativos. Reativado/ajustado a cada ciclo." },
  { id: "traf-meta", frente: "trafego", ordem: 4, sugestao: "victor", recorrencia: "semanal", label: "Configurar meta de lista do ciclo", detalhe: "Referência: 30% de presença na Aula 1. Definida a cada semana." },
  { id: "traf-nao-mexer", frente: "trafego", ordem: 5, sugestao: "victor", pendencia: true, recorrencia: "unica", label: "[7 DIAS] NÃO mexer na campanha do IAA até 22/jul", detalhe: "Regra dura Tabari: a campanha precisa de no mínimo 7 dias pra pegar inteligência. Meta leva ~48h só pra sair do aprendizado. Mexer antes disso mata o aprendizado. Só monitorar. Vence 22/07." },
  { id: "traf-monitorar", frente: "trafego", ordem: 6, sugestao: "victor", recorrencia: "semanal", label: "[CICLO] Monitorar a campanha do IAA e matar criativo ruim", detalhe: "Regras Tabari: CTR < 1% → pausa o anúncio. ROAS piso 1.1 (1.2+ é bom). ROAS ≥ 1.8-2 → DUPLICA a campanha e escala na cópia (NUNCA mexe no original — perde a inteligência). O que otimizar primeiro: sempre criativo. Volume mínimo antes de julgar: 5.000 impressões." },
  { id: "traf-oxigenar", frente: "trafego", ordem: 7, sugestao: "victor", recorrencia: "semanal", label: "[CICLO] Oxigenar criativos — 5-10 hooks novos por semana", detalhe: "Regra Tabari: hooks saturam rápido, bodys duram meses. Trocar só os 3-15s iniciais de um criativo validado é muito mais barato que criar do zero (caso citado: trocar o hook levou um criativo de ROAS 0,5 → 1,2). Meta de produção: 50 criativos/semana entre vídeo e imagem." },
  { id: "traf-limite-conta", frente: "trafego", ordem: 8, sugestao: "victor", recorrencia: "unica", label: "✅ Conferir limite de gasto e cartão da conta de anúncios", detalhe: "✅ FEITO 14/07: Visa ····3979 cadastrada · limite diário da Meta R$542,89 (5x folga sobre os R$100/dia) · SEM \"limite de gasto da conta\" (o teto acumulado que o Tabari manda não usar). Conta ACTIVE, moeda BRL." },
  { id: "traf-pixel-checkout", frente: "trafego", ordem: 9, sugestao: "victor", recorrencia: "unica", label: "✅ Pixel no CHECKOUT da Hotmart (fecha o buraco do funil)", detalhe: "✅ CONCLUÍDO (Red 14/07): \"Página de pagamento e de produto Hotmart\" → Pixel 1543917230170877 · Evento via Web ✅ · CAPI (token validado) ✅ · aplicado aos produtos (IAA, Ingresso, CFB, Formação). É daqui que vêm os eventos Purchase. Funil 100% rastreado ponta a ponta: PageView → ViewContent → InitiateCheckout → checkout → Purchase.", tutorial: {
      titulo: "**Problema:** hoje o funil é cego no checkout. Rastreamos até o clique no botão (`InitiateCheckout`), mas quando o lead vai pro `pay.hotmart.com` perdemos visibilidade. Não sabemos se ele abandonou, errou o cartão ou desistiu.",
      passos: [

      ],
    } },
  { id: "traf-pixel-valores", frente: "trafego", ordem: 10, sugestao: "victor", recorrencia: "unica", label: "✅ Corrigir os valores dos eventos do Pixel", detalhe: "✅ FEITO 14/07 (Claude) — bugs encontrados numa auditoria do funil: (1) a página do IAA disparava `value: 97.00` mas o produto custa R$17 → a Meta otimizaria o ROAS por um ticket inexistente; (2) o CFB disparava 47.00 em vez de 62.00 e NÃO tinha InitiateCheckout; (3) o ViewContent rodava antes do fbq carregar (só 7 eventos para 233 PageViews). Tudo corrigido e deployado (commit 568ca28)." },
  { id: "ges-cronograma", frente: "gestao", ordem: 1, sugestao: "gleyce", recorrencia: "semanal", label: "Manter o cronograma vivo e cobrar cada prazo" },
  { id: "ges-ordem", frente: "gestao", ordem: 2, sugestao: "gleyce", recorrencia: "semanal", label: "✅ Garantir a ordem certa: Grupo → Hotmart → Páginas", detalhe: "✅ DESBLOQUEADO 14/07: o grupo existe, está configurado e a Aula 12 aponta pra ele. O tráfego do IAA foi liberado e está agendado pra 15/07 05h." },
  { id: "ges-mecanica", frente: "gestao", ordem: 3, sugestao: "victor", recorrencia: "unica", label: "✅ Documentar a mecânica DEFINITIVA do LPSG (Tabari à risca)", detalhe: "✅ FEITO 14/07 — `MECANICA-DEFINITIVA-LPSG.md` (fonte da verdade, vence conflitos). Extraída LITERALMENTE das transcrições do Tabari. Correções críticas: (1) ingresso é compra CONSCIENTE, não \"grátis pro IAA\"; (2) aulas rodam no YOUTUBE não-listado, não no grupo; (3) dúvidas nos comentários do YT; (4) o grupo tem 2 PAPÉIS — aquece+vende o ingresso (pré-compra) e depois vira canal de avisos; (5) IAA é funil separado que faz UPSELL do ingresso. Adaptação RedPro registrada (base vem do IAA, não de tráfego frio)." },
  { id: "ges-status", frente: "gestao", ordem: 4, sugestao: "gleyce", recorrencia: "semanal", label: "✅ Relatório de status diário até o evento", detalhe: "✅ CRIADO 19/07 (Claude): RELATORIO-STATUS.md na raiz do hub (visão 10s + tráfego + gargalo + próximas ações por responsável). Atualizar a cada run." },
  { id: "dash-metricas", frente: "dashboard", ordem: 1, sugestao: "gleyce", recorrencia: "semanal", label: "Conferir as métricas do evento e do carrinho", detalhe: "Presença por aula, queda entre aulas, ficha de interesse (%), conversão no carrinho, ROAS do ingresso. Fonte: Hotmart + Meta. Comparar com os benchmarks Tabari." },
  { id: "dash-documentar", frente: "dashboard", ordem: 2, sugestao: "gleyce", recorrencia: "semanal", label: "✅ Documentar os números do 1º ciclo (fecha o carrinho → registra)", detalhe: "✅ TEMPLATE PRONTO 19/07 (Claude): 03-estrutura-lancamento/template-documentacao-resultados.md (todas as métricas Tabari + consolidado ciclo a ciclo). Preencher ao fechar o carrinho." },
  { id: "cs-onboarding", frente: "cs", ordem: 1, sugestao: "gleyce", recorrencia: "unica", label: "✅ Montar o onboarding de 90 dias da Formação S.H.A.R.K.", detalhe: "✅ ESCRITO 19/07 (Claude): onboarding completo em 12-pos-venda/onboarding-90-dias-formacao.md (boas-vindas dia 0, primeiros passos semana 1, marcos nos 90 dias, pontos anti-evasão). Falta: montar na plataforma quando a Formação for gravada." },
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

/**
 * Gera os PDFs explicativos das skills do RedReply.
 *
 * Cada PDF: capa com logo + o que a skill faz + o que ela verifica + como instalar +
 * link para baixar o .md. É o que a automação entrega no DM.
 *
 * Uso:  node scripts/gerar-pdf-skills.mjs
 * Saída: public/redreply/pdfs/<slug>.pdf
 */

import { chromium } from "playwright";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const RAIZ = process.cwd();
const SAIDA = path.join(RAIZ, "public", "redreply", "pdfs");
const LOGO = path.join(RAIZ, "public", "logo-academy.png");
const BASE = "https://redpro.com.br/redreply/skills";

const LARANJA = "#f97316";
const PRETO = "#080808";

const SKILLS = [
    {
        slug: "auditoria-seguranca",
        titulo: "Auditoria de Segurança",
        keyword: "BLINDAR",
        subtitulo: "O que a IA não checou por você",
        abre: "Você pediu um sistema. Ela entregou um sistema que funciona. Funcionar e estar seguro são duas coisas diferentes, e ninguém verificou a segunda.",
        dado: "Numa auditoria de 1.400+ aplicações construídas com IA: 65% tinham falha de segurança, 58% pelo menos uma crítica, e 88% dos apps com Supabase estavam com Row Level Security inteiramente desabilitado.",
        classificacao: "Segurança aberta é FALHA, não dívida: está errada desde o primeiro dia e custa o mesmo para arrumar hoje ou daqui a um ano.",
        comoFunciona: "A skill lê o projeto inteiro antes de procurar qualquer coisa. Primeiro identifica a stack, o banco, o framework e como a autenticação foi montada — sem isso ela procuraria padrão que não existe ali. Depois varre o código atrás de 12 pontos específicos e entrega um laudo com arquivo, linha e o comando de correção. Ela não corrige nada sozinha: algumas mudanças quebram funcionalidade, e essa decisão é de quem opera.",
        blocos: [
            {
                titulo: "Crítico",
                intro: "Corrija antes de qualquer pessoa usar o sistema. Cada um destes já é explorável hoje, sem nenhuma habilidade técnica do outro lado.",
                itens: [
                    ["Row Level Security desligado",
                     "Procura tabelas criadas sem ENABLE ROW LEVEL SECURITY nas migrations e cruza com o que o código do browser lê direto do banco. No Supabase, tabela sem RLS aparece marcada como Unrestricted no painel.",
                     "qualquer visitante abre o DevTools, copia a requisição e lê a tabela inteira. Não precisa invadir nada — a API devolve o dado para quem pedir."],
                    ["Chave de API no frontend",
                     "Varre src, app, components e pages atrás de sk-, service_role, STRIPE_SECRET e afins. Em Next.js verifica também as variáveis NEXT_PUBLIC_, que vão para o bundle mesmo quando o nome sugere segredo.",
                     "a chave fica no JavaScript que todo visitante baixa. Qualquer um extrai e usa no seu crédito, e você descobre pela fatura."],
                    ["Segredo commitado no repositório",
                     "Confere se .env está no .gitignore e roda git log no arquivo. Se houver commit, o segredo está no histórico — e apagar o arquivo agora não remove o que já foi versionado.",
                     "quem clonar o repositório tem suas credenciais, hoje e sempre. A correção não é apagar o arquivo: é revogar todas as chaves expostas."],
                    ["Rota de API sem autenticação",
                     "Lista cada rota em app/api, pages/api e routes e verifica se há checagem de sessão antes da lógica. Dá atenção especial às que escrevem, deletam ou cobram.",
                     "chamam a rota direto, sem passar pela sua interface. Toda validação que você fez no formulário deixa de existir."],
                ],
            },
            {
                titulo: "Alto",
                intro: "Corrija antes de colocar em produção. Exigem um pouco mais de intenção para explorar, mas nenhum deles é difícil.",
                itens: [
                    ["CORS liberado para qualquer origem",
                     "Procura Access-Control-Allow-Origin com asterisco e chamadas de cors() sem configuração de domínio.",
                     "qualquer site consegue chamar sua API usando a sessão do seu usuário logado, sem ele perceber."],
                    ["Sem rate limit em rota cara",
                     "Identifica rotas que chamam LLM, enviam e-mail, processam pagamento ou fazem upload, e verifica se existe teto por IP ou por sessão.",
                     "um script simples roda sua cota de API até o teto em uma madrugada. Aconteceu no próprio site da RedPro: 5 rotas disparavam 2 e-mails por chamada, sem limite."],
                    ["Webhook sem verificação de assinatura",
                     "Localiza handlers de webhook (Stripe, Hotmart, Meta) e confere se validam o header de assinatura antes de processar o evento.",
                     "qualquer pessoa forja um evento de pagamento aprovado e libera acesso sem pagar."],
                    ["Erro devolvendo stack trace",
                     "Procura blocos catch que retornam error.message, error.stack ou o objeto de erro inteiro para o cliente.",
                     "você entrega caminho de arquivo, estrutura de pastas e às vezes nome de variável de ambiente. É mapa da casa para quem quer entrar."],
                ],
            },
            {
                titulo: "Médio",
                intro: "Corrija em breve. Não são urgência hoje, mas cada um já custou caro para alguém.",
                itens: [
                    ["Input do usuário indo direto para query",
                     "Procura concatenação de string em SQL, operador $where em Mongo e template literal montando query.",
                     "injeção — o usuário escreve comando no campo de texto e o banco executa."],
                    ["Upload sem validar tipo e tamanho",
                     "Verifica se os handlers de upload checam MIME type e impõem limite de bytes.",
                     "arquivo executável disfarçado, ou disco cheio por upload de 2GB."],
                    ["Headers de segurança ausentes",
                     "Confere Content-Security-Policy, X-Frame-Options e Strict-Transport-Security. Em Next.js, olha a função headers() do next.config.",
                     "seu site pode ser embutido em iframe de terceiro para capturar cliques do usuário."],
                    ["Dependência com CVE conhecido",
                     "Roda npm audit ou pip-audit e reporta apenas severidade alta ou crítica que já tenha correção publicada.",
                     "falha pública, com exploração documentada e disponível para qualquer um."],
                ],
            },
        ],
    },
    {
        slug: "raio-x-custo",
        titulo: "Raio-X de Custo",
        keyword: "FATURA",
        subtitulo: "A fatura que ninguém abriu",
        abre: "Você sabe quanto custou construir. Sabe quanto custa manter? A maioria descobre quando a fatura chega.",
        dado: "Sistema com dívida técnica custa em média 300% mais para manter em 18 meses.",
        classificacao: "Custo não medido é DÍVIDA: cresce todo mês que ninguém olha, e fica mais caro de corrigir com o tempo.",
        comoFunciona: "A skill mapeia tudo que custa por uso no projeto — chamadas de LLM, embeddings, storage, serviços de terceiro — e registra o que dispara cada uma. Depois verifica 8 pontos onde o dinheiro costuma vazar e estima o custo por request, por usuário e por mês. Toda estimativa vem com a premissa declarada: número sem premissa é chute, e ela não faz isso.",
        blocos: [
            {
                titulo: "Crítico",
                intro: "São os três que transformam um erro pequeno em fatura grande. Nenhum aparece até o fechamento do mês.",
                itens: [
                    ["Chamada de LLM sem max_tokens",
                     "Procura messages.create, chat.completions e generateText sem teto de tokens na resposta.",
                     "a resposta que devia ter 200 tokens pode sair com 4.000 — vinte vezes o previsto, na mesma chamada."],
                    ["Retry sem limite ou sem backoff",
                     "Localiza blocos de retry, loops while e catch que refazem a chamada, e verifica se há teto de tentativas e espera crescente entre elas.",
                     "cada tentativa é cobrada como chamada nova. Um erro que persiste vira loop pago rodando sozinho."],
                    ["Rota cara sem autenticação e sem rate limit",
                     "Cruza as rotas públicas com as que chamam serviço pago.",
                     "um script roda sua cota inteira numa madrugada, e você descobre quando o serviço para de responder."],
                ],
            },
            {
                titulo: "Alto",
                intro: "Estes não quebram nada. Só cobram mais do que precisavam, todo dia, em silêncio.",
                itens: [
                    ["Contexto reenviado inteiro a cada mensagem",
                     "Verifica se o histórico de conversa cresce sem corte, sem janela deslizante nem resumo do que ficou para trás.",
                     "a mensagem número 20 custa vinte vezes a primeira. O custo cresce dentro da mesma sessão, sem ninguém mexer em nada."],
                    ["Sem cache em pergunta repetida",
                     "Procura se existe cache por hash da entrada, ou prompt caching quando o provedor oferece.",
                     "em FAQ e busca costuma ser a maior fatia da fatura: você paga de novo pela resposta que já tinha."],
                    ["Modelo grande em tarefa pequena",
                     "Identifica onde o modelo mais caro é usado para classificar, extrair campo ou decidir sim/não.",
                     "até dez vezes o necessário. O modelo pequeno resolve tarefa mecânica pelo mesmo resultado."],
                ],
            },
            {
                titulo: "Médio",
                intro: "Pouco por vez, muito no acumulado — e o segundo é o que impede você de enxergar todos os outros.",
                itens: [
                    ["Embedding recalculado sem necessidade",
                     "Verifica se a reindexação processa o corpus inteiro quando só uma parte mudou.",
                     "você paga para reprocessar o que já estava indexado, toda vez que qualquer coisa muda."],
                    ["Sem registro de consumo por request",
                     "Confere se input_tokens e output_tokens são registrados a cada chamada.",
                     "você não descobre o vazamento. Descobre a fatura — e sem log não dá para saber de onde veio."],
                ],
            },
        ],
    },
    {
        slug: "teste-de-carga",
        titulo: "Teste de Carga",
        keyword: "AGUENTA",
        subtitulo: "Funciona hoje, e amanhã?",
        abre: "Todo sistema funciona com um usuário. A pergunta é o que acontece na segunda-feira de manhã, quando chegam todos de uma vez.",
        dado: "De ~10.000 startups que subiram app feito com IA, mais de 8.000 precisaram de resgate ou reconstrução — entre US$50 mil e US$500 mil.",
        classificacao: "Arquitetura que não escala é DÍVIDA: o custo de refazer sobe a cada feature nova construída em cima.",
        comoFunciona: "A skill começa mapeando os caminhos quentes — as rotas e queries que rodam com mais frequência. Sem isso ela otimizaria o que ninguém usa. Depois verifica 10 pontos que separam o que funciona com dez usuários do que aguenta mil, e estima o ponto de ruptura. Ela distingue lento de quebrado: query de 200ms é lenta; query que varre um milhão de linhas a cada request é ruptura chegando.",
        blocos: [
            {
                titulo: "Quebra primeiro",
                intro: "Estes três aparecem antes de todos os outros, e sempre pelo mesmo motivo: funcionam bem enquanto a tabela é pequena.",
                itens: [
                    ["Query sem índice em coluna de filtro",
                     "Cruza as colunas usadas em WHERE, eq e filter com os índices declarados nas migrations.",
                     "com 100 registros responde em 5ms. Com 100.000, em 4 segundos — o banco varre a tabela inteira a cada chamada."],
                    ["N+1 — query dentro de loop",
                     "Procura for, map e forEach com await de banco no corpo do loop.",
                     "listar 50 itens dispara 51 queries. Com 500 itens, 501. O tempo cresce em linha reta com o volume."],
                    ["Sem paginação",
                     "Localiza SELECT * e chamadas .select() sem limit nem range.",
                     "o payload cresce junto com a tabela até estourar a memória do processo."],
                ],
            },
            {
                titulo: "Quebra depois",
                intro: "Estes só aparecem sob concorrência — quando várias pessoas usam ao mesmo tempo, não quando você testa sozinho.",
                itens: [
                    ["Operação pesada dentro do request",
                     "Identifica envio de e-mail, geração de PDF, chamada de LLM e upload acontecendo antes de responder ao usuário.",
                     "o usuário espera. Sob concorrência os requests empilham e começam a estourar timeout em cascata."],
                    ["Sem fila para trabalho assíncrono",
                     "Verifica se webhooks processam tudo de forma síncrona em vez de gravar, responder 200 e processar depois.",
                     "um pico de eventos derruba o endpoint, e você perde evento sem nem saber que perdeu."],
                    ["Conexão de banco criada por request",
                     "Procura new Client() dentro do handler em vez de pooler reaproveitado.",
                     "em serverless o pool esgota rápido e o banco passa a recusar conexão nova."],
                    ["Sem timeout em chamada externa",
                     "Confere se as chamadas fetch têm AbortSignal.timeout configurado.",
                     "o serviço de terceiro fica lento e o seu sistema trava junto. No site da RedPro são 66 chamadas externas, nenhuma com timeout."],
                ],
            },
            {
                titulo: "Degrada",
                intro: "Não quebram — só deixam tudo mais lento e mais caro do que precisava ser.",
                itens: [
                    ["Sem cache no que muda pouco",
                     "Identifica configuração, catálogo e dado calculado sendo recalculados a cada request.",
                     "processamento repetido para produzir sempre o mesmo resultado."],
                    ["Arquivo servido pela aplicação",
                     "Verifica se imagem e PDF passam pelo runtime em vez de CDN.",
                     "cada download ocupa um processo que devia estar respondendo request de verdade."],
                    ["Log de tudo em produção",
                     "Localiza console.log em caminho quente.",
                     "custo de I/O em toda chamada, e storage de log enchendo sem ninguém olhar."],
                ],
            },
        ],
    },
    {
        slug: "mapa-do-sistema",
        titulo: "Mapa do Sistema",
        keyword: "ENTENDER",
        subtitulo: "O que você tem nas mãos",
        abre: "Você pediu. Ela construiu. Funciona. Se alguém perguntar como funciona por dentro, você responde ou muda de assunto?",
        dado: "A IA pode fazer no seu lugar. Ela só não pode saber no seu lugar.",
        classificacao: "Código que você não entende é DÍVIDA: cada semana rodando, ele fica mais caro de decifrar.",
        comoFunciona: "A skill lê o projeto inteiro e escreve um mapa em português, para quem não programa. Não usa jargão: em vez de middleware de autenticação, escreve o porteiro que confere se você está logado antes de deixar passar. Ela marca o que é suposição e diz o que não dá para saber só pelo código — mapa com invenção é pior que mapa incompleto.",
        blocos: [
            {
                titulo: "O que o mapa responde",
                intro: "A base: o que existe, por onde entra e onde o dado para.",
                itens: [
                    ["O que este sistema faz",
                     "Uma frase sem jargão, mais quem usa, onde roda e do que depende para funcionar.",
                     "sem isso, toda decisão sobre o sistema é chute."],
                    ["Por onde entra a requisição",
                     "Cada página que o usuário abre, cada rota de API e quem a chama, cada webhook e quem dispara, cada job agendado e com que frequência.",
                     "porta de entrada esquecida é a que ninguém protege."],
                    ["Onde o dado mora",
                     "Quais tabelas existem, o que cada uma guarda, e quais são lidas direto pelo browser — que é onde mora o risco.",
                     "você não protege o que não sabe que está exposto."],
                    ["O que depende do quê",
                     "A cadeia inteira, das partes do sistema até os serviços externos, marcando onde uma queda derruba o resto.",
                     "dependência invisível é a que te acorda de madrugada."],
                ],
            },
            {
                titulo: "A parte mais útil",
                intro: "Esta seção é o que separa ter um sistema de saber o que se tem. É a que ninguém escreve.",
                itens: [
                    ["O que quebra se você mexer",
                     "Para cada peça principal: o que para de funcionar se ela sair.",
                     "sem isso, toda alteração é feita no escuro e o medo trava a evolução."],
                    ["O que acontece se um serviço externo cair",
                     "Quais dependências de terceiro derrubam o sistema junto e quais ele sobrevive.",
                     "você descobre no dia em que cair, com cliente esperando."],
                    ["O que muda junto",
                     "Se alterar esta peça, o que mais precisa mudar na mesma hora.",
                     "mudança parcial deixa o sistema num estado que ninguém previu."],
                ],
            },
            {
                titulo: "As zonas cegas",
                intro: "O que a skill assume não saber. Reconhecer o limite é parte do mapa.",
                itens: [
                    ["O que não dá para saber pelo código",
                     "Variáveis de ambiente cujo valor não aparece, serviços chamados sem documentação, decisões que só quem escreveu explicaria.",
                     "é onde mora o risco que nenhuma auditoria automática pega."],
                    ["Código possivelmente morto",
                     "Arquivos que nada importa nem chama.",
                     "dívida silenciosa: ninguém sabe se pode apagar, então fica — e toda vez que você mexe no projeto, decide de novo."],
                ],
            },
        ],
    },
    {
        slug: "checklist-deploy",
        titulo: "Checklist de Deploy",
        keyword: "SUBIR",
        subtitulo: "Antes de colocar o nome na conta",
        abre: "A IA construiu. Você vai assinar embaixo. Quando aquilo cair com cliente dentro, ninguém vai perguntar qual modelo você usou.",
        dado: "A pergunta que define metade deste checklist: se isso cair às três da manhã, alguém fica sabendo?",
        classificacao: "Ausência conta como achado. Não ter backup não é passou — é vermelho.",
        comoFunciona: "A skill verifica o que acontece quando dá errado, não o que acontece quando dá certo. Antes de checar qualquer coisa, ela pergunta onde o sistema vai rodar e quem opera depois — se não é você, metade dos itens muda de peso. O veredito é binário: qualquer item vermelho aberto significa não entregue ainda. Não existe quase pronto.",
        blocos: [
            {
                titulo: "Bloqueia a entrega",
                intro: "Enquanto um destes estiver aberto, o sistema não vai para o cliente. Não é recomendação.",
                itens: [
                    ["Erro sem tratamento em caminho crítico",
                     "Procura await sem try/catch em pagamento, gravação e envio.",
                     "o usuário vê tela branca e você descobre por reclamação, não por alerta."],
                    ["Erro devolvendo detalhe interno",
                     "Localiza catch que retorna a mensagem ou o objeto de erro cru para o cliente.",
                     "você entrega estrutura interna, caminho de arquivo e às vezes credencial."],
                    ["Sem backup do banco",
                     "Verifica se existe rotina de backup e se a restauração já foi testada alguma vez.",
                     "backup que nunca foi restaurado não é backup, é esperança com nome técnico."],
                    ["Variável de ambiente faltando em produção",
                     "Compara o que o código usa com o que está declarado no ambiente de destino.",
                     "funciona local e quebra no deploy, normalmente na frente do cliente."],
                ],
            },
            {
                titulo: "Corrija antes",
                intro: "Não impedem a entrega, mas definem se você vai conseguir operar o que entregou.",
                itens: [
                    ["Sem log estruturado",
                     "console.log solto não permite investigar incidente depois.",
                     "o sistema cai e você não sabe por onde começar a olhar."],
                    ["Sem monitoramento ou alerta",
                     "Verifica se existe health check e algum aviso quando o erro aparece.",
                     "você descobre pela mensagem do cliente, horas depois."],
                    ["Sem plano de rollback",
                     "Confere se dá para voltar à versão anterior rápido.",
                     "um deploy ruim vira madrugada de conserto em vez de dois minutos."],
                    ["Migration sem caminho de volta",
                     "Alteração de schema sem DOWN e sem backup prévio.",
                     "migration errada em produção não desfaz sozinha."],
                    ["Serviço externo sem plano B",
                     "Identifica dependências de terceiro sem tratamento para indisponibilidade.",
                     "a queda dele vira a sua queda, e a explicação para o cliente é sua."],
                ],
            },
            {
                titulo: "Verifique",
                intro: "Detalhes que não derrubam nada, mas aparecem na primeira impressão de quem recebe.",
                itens: [
                    ["Sem página de erro própria",
                     "404 e 500 mostrando a tela padrão do framework.",
                     "o cliente vê tela de desenvolvedor no site que ele pagou."],
                    ["Timezone e formato de data",
                     "Servidor em UTC entregando horário para cliente que espera fuso local.",
                     "relatório com data errada, agendamento na hora errada."],
                    ["Documentação mínima de operação",
                     "Como subir, como reiniciar, onde estão os logs, quem chamar.",
                     "se quem opera depois não é você, isto deixa de ser opcional."],
                ],
            },
        ],
    },
];

function escapar(t) {
    return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function montarHtml(skill, logoDataUri) {
    const blocos = skill.blocos
        .map(
            (b) => `
      <section class="secao">
        <h2>${escapar(b.titulo)}</h2>
        <p class="intro">${escapar(b.intro)}</p>
        ${b.itens
            .map(
                ([termo, desc, custo]) => `
          <div class="item">
            <div class="termo">${escapar(termo)}</div>
            <div class="desc">${escapar(desc)}</div>
            <div class="custo"><b>Custa:</b> ${escapar(custo)}</div>
          </div>`,
            )
            .join("")}
      </section>`,
        )
        .join("");

    return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Space Grotesk',system-ui,sans-serif; color:#f5f5f5; background:${PRETO}; }

  .capa { height:297mm; padding:18mm 20mm; display:flex; flex-direction:column;
          background:linear-gradient(160deg,#0d0d0d 0%,${PRETO} 55%,#140b04 100%); }
  .logo { height:78mm; width:auto; object-fit:contain; align-self:center;
          margin-bottom:auto; }
  .tag { display:inline-block; align-self:flex-start; background:${LARANJA}; color:${PRETO};
         font-size:9pt; font-weight:700; letter-spacing:.14em; padding:2.5mm 5mm;
         border-radius:2mm; margin-bottom:7mm; }
  h1 { font-size:34pt; font-weight:700; line-height:1.03; letter-spacing:-.02em; margin-bottom:4mm; }
  .sub { font-size:14pt; color:${LARANJA}; font-weight:600; margin-bottom:9mm; }
  .abre { font-size:11.5pt; line-height:1.65; color:#c4c4c4; margin-bottom:8mm; max-width:135mm; }
  .dado { border-left:3px solid ${LARANJA}; padding:5mm 6mm; background:rgba(249,115,22,.07);
          font-size:10pt; line-height:1.6; color:#e8e8e8; margin-bottom:6mm; }
  .classif { font-size:9.5pt; line-height:1.6; color:#9a9a9a; font-style:italic; }
  .kw { margin-top:auto; padding-top:8mm; border-top:1px solid rgba(255,255,255,.1);
        font-size:10pt; color:#8a8a8a; }
  .kw b { color:${LARANJA}; font-family:'JetBrains Mono',monospace; font-size:12pt; letter-spacing:.06em; }

  .miolo { padding:14mm 20mm 16mm; background:${PRETO}; }
  .miolo > h2:first-of-type { margin-top:0; }
  .funciona { margin-bottom:9mm; padding:6mm 6.5mm; background:rgba(255,255,255,.035);
              border-radius:3mm; border:1px solid rgba(255,255,255,.07); }
  .funciona h2 { font-size:12.5pt; color:${LARANJA}; margin-bottom:3mm; }
  .funciona p { font-size:10pt; color:#c8c8c8; line-height:1.72; }

  .secao { margin-bottom:8mm; }
  .secao > h2 { font-size:14pt; font-weight:700; color:${LARANJA}; margin-bottom:2mm; }
  .secao > .intro { font-size:10pt; color:#b0b0b0; line-height:1.65; margin-bottom:5mm;
                    padding-bottom:4mm; border-bottom:1px solid rgba(249,115,22,.22); }
  .item { padding:4mm 0 4.5mm; border-bottom:1px solid rgba(255,255,255,.06); break-inside:avoid; }
  .item:last-child { border-bottom:none; }
  .termo { font-family:'JetBrains Mono',monospace; font-size:10.5pt; font-weight:500;
           color:#f5f5f5; margin-bottom:2mm; }
  .desc { font-size:9.5pt; color:#b8b8b8; line-height:1.68; margin-bottom:2mm; }
  .custo { font-size:9.5pt; color:#e0e0e0; line-height:1.6; padding-left:4mm;
           border-left:2px solid ${LARANJA}; }
  .custo b { color:${LARANJA}; font-weight:600; }

  .como { margin-top:7mm; padding:6mm; border:1px solid rgba(249,115,22,.3); border-radius:3mm;
          background:rgba(249,115,22,.05); break-inside:avoid; }
  .como h3 { font-size:12pt; color:${LARANJA}; margin-bottom:4mm; }
  .passo { font-size:9.5pt; color:#d0d0d0; line-height:1.55; margin-bottom:2mm; }
  .passo b { color:#f5f5f5; }
  .link { display:block; margin-top:5mm; padding:4mm 5mm; background:${LARANJA}; color:${PRETO};
          font-family:'JetBrains Mono',monospace; font-size:9.5pt; font-weight:500;
          border-radius:2mm; text-decoration:none; word-break:break-all; }
  .fim { break-inside:avoid; page-break-inside:avoid; }
  .rodape { margin-top:6mm; padding-top:4mm; border-top:1px solid rgba(255,255,255,.1);
            font-size:9pt; color:#6a6a6a; display:flex; justify-content:space-between; }
  .rodape b { color:${LARANJA}; }
</style></head><body>

<div class="capa">
  <img class="logo" src="${logoDataUri}" alt="RedPro AI Academy">
  <span class="tag">SKILL PARA CLAUDE CODE</span>
  <h1>${escapar(skill.titulo)}</h1>
  <div class="sub">${escapar(skill.subtitulo)}</div>
  <p class="abre">${escapar(skill.abre)}</p>
  <div class="dado">${escapar(skill.dado)}</div>
  <p class="classif">${escapar(skill.classificacao)}</p>
  <div class="kw">Palavra-chave desta skill: <b>${escapar(skill.keyword)}</b></div>
</div>

<div class="miolo">
  <div class="funciona">
    <h2>Como a skill trabalha</h2>
    <p>${escapar(skill.comoFunciona)}</p>
  </div>

  ${blocos}

  <div class="fim">
  <div class="como">
    <h3>Como usar</h3>
    <div class="passo"><b>1.</b> Baixe o arquivo da skill no link abaixo.</div>
    <div class="passo"><b>2.</b> Mande o arquivo para o seu Claude Code e diga: <i>"instala essa skill pra mim"</i>. Ele resolve o resto.</div>
    <div class="passo"><b>3.</b> Dentro da pasta do seu projeto, peça: <i>"${escapar(skill.titulo.toLowerCase())} nesse projeto"</i>.</div>
    <div class="passo"><b>4.</b> Leia o laudo. Cada ponto aberto tem arquivo, linha e o que fazer.</div>
    <a class="link" href="${BASE}/${skill.slug}.md">${BASE}/${skill.slug}.md</a>
  </div>

  <div class="rodape">
    <span>RedPro AI Academy · @redpro.ia</span>
    <span><b>A conta chega.</b></span>
  </div>
  </div>
</div>

</body></html>`;
}

async function main() {
    if (!existsSync(LOGO)) {
        console.error("Logo não encontrada em", LOGO);
        process.exit(1);
    }
    await mkdir(SAIDA, { recursive: true });

    const logoDataUri = `data:image/png;base64,${(await readFile(LOGO)).toString("base64")}`;
    const navegador = await chromium.launch();
    const pagina = await navegador.newPage();

    for (const skill of SKILLS) {
        const html = montarHtml(skill, logoDataUri);
        await pagina.setContent(html, { waitUntil: "networkidle" });
        const destino = path.join(SAIDA, `${skill.slug}.pdf`);
        await pagina.pdf({ path: destino, format: "A4", printBackground: true });
        console.log(`  ${skill.slug}.pdf  (${skill.keyword})`);
    }

    await navegador.close();
    console.log(`\n${SKILLS.length} PDFs em public/redreply/pdfs/`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

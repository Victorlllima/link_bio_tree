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
        blocos: [
            {
                titulo: "Crítico — antes de qualquer pessoa usar",
                itens: [
                    ["Row Level Security desligado", "qualquer visitante abre o DevTools e lê sua tabela inteira"],
                    ["Chave de API no frontend", "a chave está no bundle; qualquer um extrai e usa no seu crédito"],
                    ["Segredo commitado no repositório", "quem clonar tem suas credenciais, mesmo que você apague o arquivo hoje"],
                    ["Rota de API sem autenticação", "chamam a rota direto, sem passar pela sua interface"],
                ],
            },
            {
                titulo: "Alto — antes de produção",
                itens: [
                    ["CORS liberado para qualquer origem", "qualquer site chama sua API com a sessão do seu usuário"],
                    ["Sem rate limit em rota cara", "um script roda sua fatura até o teto em minutos"],
                    ["Webhook sem verificação de assinatura", "qualquer um forja um evento de pagamento aprovado"],
                    ["Erro devolvendo stack trace", "você entrega estrutura interna e às vezes credencial"],
                ],
            },
            {
                titulo: "Médio — corrigir em breve",
                itens: [
                    ["Input indo direto para query", "injeção de SQL ou de operador"],
                    ["Upload sem validar tipo e tamanho", "arquivo malicioso ou disco cheio"],
                    ["Headers de segurança ausentes", "clickjacking e downgrade de conexão"],
                    ["Dependência com CVE conhecido", "falha pública, exploração conhecida"],
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
        blocos: [
            {
                titulo: "Crítico",
                itens: [
                    ["Chamada de LLM sem max_tokens", "a resposta que devia ter 200 tokens sai com 4.000"],
                    ["Retry sem limite ou sem backoff", "cada tentativa é cobrada como chamada nova"],
                    ["Rota cara sem autenticação e sem rate limit", "um script roda sua cota numa madrugada"],
                ],
            },
            {
                titulo: "Alto",
                itens: [
                    ["Contexto reenviado inteiro a cada mensagem", "a conversa nº 20 custa 20x a nº 1"],
                    ["Sem cache em pergunta repetida", "em FAQ, costuma ser a maior fatia da fatura"],
                    ["Modelo grande em tarefa pequena", "até 10x o necessário para classificar ou extrair"],
                ],
            },
            {
                titulo: "Médio",
                itens: [
                    ["Embedding recalculado sem necessidade", "pouco por vez, muito no acumulado"],
                    ["Sem registro de consumo por request", "você não descobre o vazamento, descobre a fatura"],
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
        blocos: [
            {
                titulo: "Quebra primeiro",
                itens: [
                    ["Query sem índice em coluna de filtro", "100 registros = 5ms. 100.000 = 4 segundos"],
                    ["N+1 — query dentro de loop", "listar 50 itens dispara 51 queries"],
                    ["Sem paginação", "o payload estoura a memória quando a tabela cresce"],
                ],
            },
            {
                titulo: "Quebra depois",
                itens: [
                    ["Operação pesada dentro do request", "sob concorrência os requests empilham e estouram timeout"],
                    ["Sem fila para trabalho assíncrono", "um pico de eventos derruba o endpoint"],
                    ["Conexão de banco criada por request", "em serverless o pool esgota rápido"],
                    ["Sem timeout em chamada externa", "o terceiro fica lento e seu sistema trava junto"],
                ],
            },
            {
                titulo: "Degrada",
                itens: [
                    ["Sem cache no que muda pouco", "recalcula a cada request o que é sempre igual"],
                    ["Arquivo servido pela aplicação", "imagem passando pelo runtime em vez de CDN"],
                    ["Log de tudo em produção", "custa I/O e enche o storage"],
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
        blocos: [
            {
                titulo: "O que o mapa responde",
                itens: [
                    ["O que este sistema faz", "em uma frase, sem jargão"],
                    ["Por onde entra a requisição", "cada página, rota, webhook e job agendado"],
                    ["Onde o dado mora", "quais tabelas são lidas pelo browser e quais só pelo servidor"],
                    ["O que depende do quê", "a cadeia inteira, até os serviços externos"],
                ],
            },
            {
                titulo: "A parte mais útil",
                itens: [
                    ["O que quebra se você mexer", "cada peça, e o que ela derruba junto"],
                    ["O que acontece se um serviço externo cair", "o sistema continua de pé ou não"],
                    ["O que muda junto", "se alterar isto, o que mais precisa mudar"],
                ],
            },
            {
                titulo: "As zonas cegas",
                itens: [
                    ["O que não dá para saber pelo código", "variáveis, decisões e serviços sem documentação"],
                    ["Código possivelmente morto", "arquivos que nada chama — ninguém sabe se pode apagar"],
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
        classificacao: "Ausência conta como achado. Não ter backup não é 'passou' — é vermelho.",
        blocos: [
            {
                titulo: "Bloqueia a entrega",
                itens: [
                    ["Erro sem tratamento em caminho crítico", "o usuário vê tela branca e você descobre por reclamação"],
                    ["Erro devolvendo detalhe interno", "você entrega caminho de arquivo e estrutura"],
                    ["Sem backup do banco", "backup que nunca foi restaurado não é backup, é esperança"],
                    ["Variável de ambiente faltando em produção", "funciona local, quebra na frente do cliente"],
                ],
            },
            {
                titulo: "Corrija antes",
                itens: [
                    ["Sem log estruturado", "o sistema cai e você não sabe por onde olhar"],
                    ["Sem monitoramento ou alerta", "você descobre pela mensagem do cliente"],
                    ["Sem plano de rollback", "deploy ruim vira madrugada de conserto"],
                    ["Migration sem caminho de volta", "não desfaz sozinha em produção"],
                    ["Serviço externo sem plano B", "a queda dele vira a sua queda"],
                ],
            },
            {
                titulo: "Verifique",
                itens: [
                    ["Sem página de erro própria", "tela padrão do framework na cara do cliente"],
                    ["Timezone e formato de data", "servidor em UTC, cliente esperando horário local"],
                    ["Documentação mínima de operação", "se quem opera depois não é você, deixa de ser opcional"],
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
      <section class="bloco">
        <h2>${escapar(b.titulo)}</h2>
        ${b.itens
            .map(
                ([termo, custo]) => `
          <div class="item">
            <div class="termo">${escapar(termo)}</div>
            <div class="custo">${escapar(custo)}</div>
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
  .logo { height:26mm; width:auto; object-fit:contain; object-position:left center;
          align-self:flex-start; margin-bottom:auto; }
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
  .bloco { margin-bottom:6.5mm; break-inside:avoid; }
  .bloco h2 { font-size:13pt; font-weight:700; color:${LARANJA}; margin-bottom:4mm;
              padding-bottom:2mm; border-bottom:1px solid rgba(249,115,22,.25); }
  .item { display:flex; gap:5mm; padding:2.2mm 0; border-bottom:1px solid rgba(255,255,255,.055);
          break-inside:avoid; }
  .termo { flex:0 0 62mm; font-family:'JetBrains Mono',monospace; font-size:9.5pt;
           font-weight:500; color:#f5f5f5; line-height:1.45; }
  .custo { flex:1; font-size:9.5pt; color:#a8a8a8; line-height:1.55; }

  .como { margin-top:7mm; padding:6mm; border:1px solid rgba(249,115,22,.3); border-radius:3mm;
          background:rgba(249,115,22,.05); break-inside:avoid; }
  .como h3 { font-size:12pt; color:${LARANJA}; margin-bottom:4mm; }
  .passo { font-size:9.5pt; color:#d0d0d0; line-height:1.55; margin-bottom:2mm; }
  .passo b { color:#f5f5f5; }
  .link { display:block; margin-top:5mm; padding:4mm 5mm; background:${LARANJA}; color:${PRETO};
          font-family:'JetBrains Mono',monospace; font-size:9.5pt; font-weight:500;
          border-radius:2mm; text-decoration:none; word-break:break-all; }
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
  ${blocos}

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

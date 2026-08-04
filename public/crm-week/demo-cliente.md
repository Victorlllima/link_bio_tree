---
name: demo-cliente
description: |
  Transforma o seu CRM numa demonstração personalizada pra qualquer empresa, a partir do site dela.
  Você cola o link, a skill lê a página e adapta tudo: nome, ramo, etapas do funil, campos e dados
  de exemplo daquele mercado. Se você quiser logo e cores exatas da marca, ela te oferece dois
  caminhos a mais. Você chega na reunião com o sistema já com a cara do cliente.
  Use quando disser "/demo-cliente", "prepara uma demo pra esse cliente", "adapta meu CRM pra essa empresa",
  ou colar o link do site de uma empresa pedindo uma demonstração.
---

# Demo Cliente — o CRM com a cara da empresa, antes da reunião

Esta skill pega o CRM que você construiu e cria uma **versão de demonstração** para uma empresa específica, a partir do site dela. O objetivo é um só: **você entrar na reunião com o sistema já parecendo o sistema dele.**

O empresário abre o link, vê o próprio logo, as próprias cores e um funil que faz sentido pro negócio dele. A conversa deixa de ser "eu posso construir um sistema pra você" e passa a ser "olha o seu sistema".

---

## ⚖️ Princípios (os mesmos do Método)

1. **O aluno não faz trabalho técnico.** Ele cola um link. Todo o resto é o Claude.
2. **Nunca trava por falta de informação.** Se o site não tiver algo, usa o que tem, avisa o que faltou e segue.
3. **Isto é uma DEMONSTRAÇÃO, não o sistema final.** Os dados são fictícios e existem pra mostrar o sistema cheio. Sempre deixar isso claro pro aluno.

---

## O que esta skill FAZ

| Extrai do site | Aplica no CRM | Caminho 1 (grátis) | Caminho 2/3 (completo) |
|---|---|---|---|
| Nome da empresa | Nome do sistema, título da aba, header | ✅ | ✅ |
| Nicho / o que vende | **Etapas do funil daquele ramo** | ✅ | ✅ |
| Produtos e serviços | Campos do cadastro e segmentos | ✅ | ✅ |
| Cidade / região | Dados de exemplo coerentes | ✅ | ✅ |
| Tom da marca | Textos do sistema | ✅ | ✅ |
| **Cores da marca** | Cor de destaque | ⚠️ inferida do ramo | ✅ exatas, do CSS |
| **Logo** | Marca no topo | ❌ aluno envia o arquivo | ✅ baixado do site |

## O que esta skill NÃO FAZ

- ❌ Não mexe no CRM original do aluno — **sempre trabalha numa cópia**
- ❌ Não conecta banco novo nem publica (isso é decisão dele, depois)
- ❌ Não usa dados reais de ninguém — tudo fictício, sempre

---

# COMO CONDUZIR

## Passo 1 — Pedir a entrada (aceita qualquer uma)

Pergunte de forma simples e aceite **qualquer** um destes:

> "Me manda o site da empresa que você vai apresentar. Se ela não tiver site, manda o Instagram. Se não tiver nenhum dos dois, me conta em uma frase o que ela faz e onde fica."

**Ordem de preferência:** site → Instagram → descrição em texto.

⚠️ **Nunca exija o site.** Muita PME brasileira não tem, ou tem um site abandonado. A skill funciona nos três casos — só a riqueza do resultado muda.

## Passo 1.5 — Escolher COMO ler o site (explique ao aluno e deixe ele decidir)

Existem três caminhos, e eles entregam coisas diferentes. **Explique em linguagem simples e deixe o aluno escolher** — não decida por ele:

> "Antes de eu ler o site dele, você escolhe como. Tem três jeitos:
>
> **1. Rápido e grátis** — eu leio o texto do site. Pego o nome, o que ele vende, o ramo, a cidade. **Não pego o logo nem as cores exatas** — as cores eu escolho combinando com o ramo dele. Funciona bem e não custa nada.
>
> **2. Completo com Apify** — um serviço que abre o site de verdade e me traz tudo: logo, cores exatas, imagens. O resultado fica bem mais parecido com a marca dele. **Tem plano grátis de 5 dólares por mês**, que dá pra várias demonstrações. Se você quiser mais, o plano pago é 29 dólares mensais. Precisa criar conta e me passar uma chave — mesmo processo do Supabase.
>
> **3. Completo sem custo, mas com instalação** — o Chrome DevTools, que abre o site no navegador aqui do seu computador e lê tudo. É grátis, mas exige uma instalação a mais na sua máquina.
>
> Pro seu primeiro cliente, eu sugiro começar pelo **1**. Se a demonstração for pra um cliente grande e você quiser caprichar na identidade visual, aí vale o **2** ou o **3**."

**Regra de execução:**

| Caminho | Ferramenta | Entrega | Custo |
|---|---|---|---|
| 1 — padrão | `WebFetch` | nome, nicho, serviços, cidade, tom. Cores inferidas do ramo. Sem logo. | grátis |
| 2 — completo | **Apify** (`mcp__apify__*`) | + logo real, cores exatas do CSS, imagens | free tier US$5/mês · pago US$29/mês |
| 3 — fallback | **Chrome DevTools MCP** | igual ao 2, rodando local | grátis, exige instalar o MCP |

- **Sempre comece oferecendo os três.** O aluno decide.
- Se ele escolher 2 ou 3 e a ferramenta **não estiver disponível**, avise e **caia pro caminho 1** — nunca trave: *"o Apify não tá configurado aqui. Quer configurar agora, ou eu sigo pelo caminho rápido e você me manda o logo depois?"*
- Se ele escolher 2, oriente: criar conta grátis no Apify, copiar o token, colar aqui. É o mesmo fluxo do Supabase da Aula 3.

## Passo 2 — Ler a página e extrair

Use a ferramenta do caminho escolhido no passo anterior. Extraia, na ordem de importância:

1. **Nome da empresa** — do título da página, do logo ou do rodapé
2. **O que ela vende** — produtos, serviços, o texto principal da home
3. **Nicho** — classifique num ramo conhecido (clínica, imobiliária, advocacia, varejo, indústria, agência, educação, alimentação, serviços)
4. **Cores da marca** — cor dominante do site (fora branco/preto/cinza)
5. **Logo** — URL da imagem, se houver
6. **Cidade / região** — do rodapé ou da página de contato
7. **Tom da marca** — formal, técnico, acolhedor, popular

**Se a leitura falhar** (site fora do ar, bloqueio, timeout, página vazia): diga o que aconteceu e ofereça as alternativas. Nunca invente o conteúdo de um site que você não conseguiu ler.

> ⚠️ **Isso acontece de verdade, e mais do que parece.** Em teste (04/08) um site de PME brasileira recusou a conexão na primeira tentativa. Site de empresa pequena cai, bloqueia robô, ou está mal configurado. **Tente uma segunda vez** antes de desistir — e, se falhar de novo, siga para o Instagram ou peça a descrição. Fala sugerida:
>
> *"O site dele não abriu pra mim agora (acontece bastante com site de empresa pequena). Me manda o Instagram dela, ou me conta em uma frase o que ela faz e onde fica — eu monto igual."*

## Passo 3 — Inferir o funil daquele ramo

A partir do nicho, monte as etapas que fazem sentido pra **como aquele negócio vende**. Não use o funil genérico se der pra fazer melhor.

Referências por ramo (adapte, não copie mecanicamente):

| Ramo | Etapas típicas |
|---|---|
| Clínica / estética / odonto | Interessado · Avaliação agendada · Avaliação feita · Orçamento enviado · Em tratamento · Concluído · Perdido |
| Imobiliária | Novo interessado · Visita agendada · Visita feita · Proposta · Documentação · Fechado · Perdido |
| Advocacia | Consulta solicitada · Consulta feita · Análise do caso · Proposta de honorários · Contrato assinado · Perdido |
| Varejo / loja | Novo contato · Interesse identificado · Orçamento · Negociação · Venda fechada · Perdido |
| Indústria / B2B | Lead · Qualificação técnica · Visita/diagnóstico · Proposta · Negociação · Fechado · Perdido |
| Agência / serviços | Lead · Reunião de diagnóstico · Proposta · Negociação · Contrato · Em execução · Perdido |
| Educação / cursos | Interessado · Contato feito · Aula experimental · Proposta · Matriculado · Perdido |
| Alimentação / eventos | Solicitação · Degustação/orçamento · Proposta · Negociação · Contratado · Perdido |

Ajuste os **campos do cadastro** ao ramo também. Exemplos: clínica → procedimento de interesse e data da última consulta · imobiliária → tipo de imóvel, faixa de valor, bairro · indústria → volume/capacidade e prazo.

E ajuste os **segmentos** (as etiquetas coloridas) pro que aquele negócio realmente atende.

## Passo 4 — Montar a demonstração

Trabalhe **numa cópia** do CRM do aluno. Nunca altere o original.

Aplique:
- Nome do sistema e título da aba
- Logo no topo (se conseguiu baixar)
- Cor de destaque da marca, **mantendo a base escura premium** — a identidade do sistema continua sendo a mesma, só o acento muda
- Etapas do funil inferidas
- Campos e segmentos do ramo
- **15 a 20 contatos fictícios coerentes com o ramo e a região** — nomes brasileiros plausíveis, empresas do setor, valores compatíveis com o ticket daquele mercado, espalhados pelas etapas do funil
- Alguns agendamentos fictícios, com datas a partir de hoje

⚠️ **Sobre a cor:** se a cor da marca for muito clara ou saturada demais pro fundo escuro, ajuste o tom em vez de aplicar cru. O sistema tem que continuar bonito — uma demo feia derruba a venda.

## Passo 5 — Entregar com o aviso do funil

Ao terminar, entregue o link e diga, **em uma linha**, qual funil você montou:

> "Pronto. [Nome da empresa], com o logo e as cores do site dela. Montei o funil típico de [ramo]: [etapa 1] → [etapa 2] → [etapa 3] → ... Se o processo dele for diferente, me fala que eu ajusto em segundos."

Isso não é pergunta e não trava nada — é proteção. **O dono do negócio conhece o próprio funil.** Se estiver diferente, é melhor o aluno descobrir agora do que na frente do cliente.

Se algo não deu pra extrair, avise junto, de forma prática:

> "Não achei o logo no site (deve estar em formato que não dá pra baixar). Me manda o arquivo que eu coloco, ou a gente vai só com o nome, que também fica bom."

## Passo 6 — O lembrete que evita vergonha

Sempre feche com isto:

> "Lembra: esses contatos são inventados, estão aí só pra mostrar o sistema cheio. Se ele fechar contigo, o primeiro passo é limpar tudo — é só me pedir 'limpa os dados de exemplo'."

---

## Se o aluno pedir algo fora do escopo

- **"Publica essa demo pra eu mandar o link"** → "Dá pra fazer. Você já tem a chave da Vercel, é só me pedir pra publicar essa cópia num link separado."
- **"Faz o mesmo pra outros cinco clientes"** → "Manda os links, um de cada vez. Cada um vira uma cópia própria."
- **"Usa os dados reais que eu tenho da empresa"** → "Pra demonstração é melhor não. Dado real de cliente exige cuidado com privacidade, e pra mostrar o sistema o fictício funciona igual. Depois que ele fechar, aí sim a gente coloca o dado real."
- **"Muda tudo pra ficar igual ao site dele"** → "O logo e as cores eu trago. Mas o sistema mantém a estrutura premium — é ela que faz parecer um produto caro. Copiar o layout do site deixaria com cara de site, não de sistema."

---

## ⚠️ Antes de mostrar pro cliente — checklist do aluno

Diga isso ao aluno na entrega:

1. Abre o sistema e **navega nas quatro telas** antes da reunião
2. Confere se o **nome da empresa está certo** em todo lugar
3. Olha as **etapas do funil** — fazem sentido pro negócio dele?
4. Vê no **celular** também (o empresário vai abrir no celular)
5. Se algo estiver estranho, me fala — conserto em segundos

---

*Skill demo-cliente · bônus da CRM Week · depende do CRM construído nas Aulas 2-5.*

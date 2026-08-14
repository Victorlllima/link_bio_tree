---
name: otimiza-pagina
description: >
  Guia o aluno, um item de cada vez, a criar e otimizar os 20 itens essenciais que
  toda página web precisa ter ANTES de ir pra produção — página 404, CTA acima da
  dobra, meta tags, sitemap, prova social, schema, analytics e o resto. O aluno diz
  qual página é (o site que ele construiu), e a skill audita o que já existe, mostra
  o que falta, e implementa cada item pendente com explicação simples. Feita pra
  quem não programa. Use quando o aluno disser "/otimiza-pagina", "otimiza minha
  página pra produção", "meu site tá pronto pra publicar?", "quero os 20 itens da
  página", ou colar esta skill no Claude Code dele.
---

# Os 20 itens que sua página precisa ter antes de ir pra produção

Você (Claude Code) vai levar o aluno a deixar a página dele **pronta pra produção** —
com os 20 itens que separam um site amador de um site profissional que **converte,
aparece no Google e passa confiança**.

**O aluno não é programador.** Você faz o trabalho técnico; ele toma as decisões
(qual o telefone, quais os depoimentos reais, qual o endereço). Explique cada item
em português simples, **um de cada vez**, e só passa pro próximo quando o atual
estiver feito. Nunca despeje 20 tarefas de uma vez — isso trava o aluno.

> ⚠️ **Regra de ouro desta skill:** nada de inventar. Avaliação real, depoimento real,
> endereço real, foto real do time. Se o aluno não tiver um dado (ex: ainda não tem
> depoimento), você marca como "pendente do aluno" e segue — nunca preenche com dado
> falso. Uma avaliação inventada é pior que avaliação nenhuma.

---

## PASSO 0 — Descobrir a página e o que já existe

Antes de qualquer item, você precisa entender **o que já está feito** pra não refazer
trabalho nem pular o que falta.

**0.1.** Pergunte ao aluno, em uma mensagem só:
> "Me diz três coisas rápidas:
> 1. Qual a **pasta do projeto** da sua página? (ou me leva até ela)
> 2. Qual a **tecnologia**? (Next.js, HTML puro, React, WordPress, outra — se não
>    souber, tudo bem, eu descubro)
> 3. Qual o **assunto** da página? (ex: minha empresa de bolos, meu CRM, minha
>    consultoria) — pra eu adaptar os textos e exemplos pra você."

**0.2.** Com a resposta, faça você mesmo uma **auditoria** da página. Leia os arquivos
e detecte quais dos 20 itens **já existem** e quais **faltam**. Monte uma checklist
visual e mostre pro aluno, tipo:

```
✅ já tem   |  ❌ falta   |  ⚠️ existe mas dá pra melhorar

FUNDAÇÃO
  [❌] 1. Página 404 personalizada
  [✅] 2. CTA acima da dobra
  [⚠️] 3. Links internos (tem, mas poucos)
  ...
```

**0.3.** Diga ao aluno:
> "Vou passar item por item, do mais importante pro menos. Em cada um eu te explico
> o que é, por que importa, e já faço. Você só me dá os dados que só você tem
> (telefone, depoimentos, etc). Bora?"

Depois, ataque **só os itens `❌` e `⚠️`**, na ordem dos blocos abaixo. Item que já
está `✅` bom, você só confirma e pula.

---

## Como conduzir CADA item (o formato fixo)

Pra todo item, siga sempre esta mesma estrutura de 4 partes — é o que deixa didático:

```
📌 ITEM N — [nome]
O que é:      (1 frase, linguagem de leigo)
Por que importa: (o que o aluno GANHA com isso — em dinheiro, confiança ou visita)
O que eu preciso de você: (só se precisar de um dado dele; senão, "nada, eu faço")
→ [você implementa e mostra o resultado]
✅ Feito. Próximo?
```

Nunca pule o "por que importa" — é o que faz o aluno entender, não só obedecer.

---

# BLOCO 1 — FUNDAÇÃO E EXPERIÊNCIA (itens 1-5)

## 📌 ITEM 1 — Página 404 personalizada
**O que é:** a tela que aparece quando alguém digita um endereço errado do seu site.
**Por que importa:** sem ela, o visitante vê uma tela feia de erro e vai embora. Com
ela, você traz a pessoa de volta ("Ops, essa página não existe — volta pro início").
**O que preciso de você:** nada. Eu crio.
→ Crie a página 404 no padrão da tecnologia dele (`app/not-found.tsx` no Next.js,
`404.html` em HTML puro, etc), com: mensagem amigável, botão "Voltar pro início",
e o visual da marca dele. Testa que funciona.

## 📌 ITEM 2 — CTA acima da dobra
**O que é:** um botão de ação (ex: "Fale comigo", "Comprar", "Começar agora") que
aparece **sem precisar rolar a tela** — na primeira coisa que a pessoa vê.
**Por que importa:** a maioria não rola a página. Se o botão de ação só aparece lá
embaixo, você perde a venda de quem decidiu rápido.
**O que preciso de você:** qual a ação principal da página? (o que você quer que a
pessoa FAÇA — comprar, agendar, chamar no WhatsApp?)
→ Garanta um CTA claro, com destaque de cor, visível na primeira tela (sem rolar).

## 📌 ITEM 3 — Links internos
**O que é:** links que ligam uma página do seu site a outra (ex: do topo pro rodapé,
da home pra página de contato).
**Por que importa:** ajudam o visitante a navegar E ajudam o Google a entender e
rankear seu site.
**O que preciso de você:** nada, eu mapeio as páginas e ligo.
→ Adicione navegação coerente: menu, links no rodapé, e "próximos passos" no fim das
seções.

## 📌 ITEM 4 — Página de Obrigado
**O que é:** a página que aparece **depois** que a pessoa faz a ação (comprou,
preencheu formulário, chamou no WhatsApp).
**Por que importa:** é onde você confirma ("deu certo!"), dá o próximo passo, e — no
seu caso de lançamento — é onde dispara o rastreamento de conversão pro tráfego.
**O que preciso de você:** o que deve acontecer depois? (ex: "entra no grupo",
"aguarde meu contato")
→ Crie a página de obrigado com confirmação + próximo passo claro.

## 📌 ITEM 5 — Mapa do site (sitemap)
**O que é:** um arquivo (`sitemap.xml`) que lista todas as páginas do seu site pro
Google.
**Por que importa:** é como entregar ao Google um índice do seu site — ele acha e
mostra suas páginas mais rápido.
**O que preciso de você:** nada.
→ Gere o `sitemap.xml` (automático no Next.js via `sitemap.ts`; manual em HTML).
Liste todas as páginas reais.

---

# BLOCO 2 — CONVERSÃO E CONFIANÇA (itens 6-10)

## 📌 ITEM 6 — Cases de sucesso
**O que é:** exemplos reais de gente que teve resultado com o que você oferece.
**Por que importa:** ninguém quer ser o primeiro. Ver que "funcionou pra outro"
derruba a desconfiança.
**O que preciso de você:** você tem casos reais? Me manda (nome, o que a pessoa
conseguiu). **Se ainda não tiver, marco como pendente — NÃO invento.**
→ Se tiver, monte uma seção de cases. Se não, deixe a estrutura pronta e uma nota:
"⚠️ pendente: adicionar quando tiver o primeiro case real".

## 📌 ITEM 7 — 5 perguntas frequentes (FAQ)
**O que é:** as 5 dúvidas mais comuns de quem visita, já respondidas na página.
**Por que importa:** derruba objeção antes da pessoa desistir, e ainda ajuda no
Google (que adora FAQ).
**O que preciso de você:** quais as 5 perguntas que mais te fazem? Se não souber, eu
sugiro 5 pro seu ramo e você ajusta.
→ Crie a seção FAQ (visual sanfona/accordion se a tech permitir).

## 📌 ITEM 8 — Promessa de tempo de resposta
**O que é:** dizer em quanto tempo você responde (ex: "respondo em até 1 hora no
horário comercial").
**Por que importa:** tira a insegurança do "será que alguém vê isso?". Dá conforto
pra pessoa agir.
**O que preciso de você:** qual seu tempo real de resposta? (seja honesto — promessa
que não cumpre queima)
→ Adicione perto dos pontos de contato (CTA, formulário, WhatsApp).

## 📌 ITEM 9 — CTA fixo no mobile
**O que é:** um botão de ação que **fica grudado** na parte de baixo da tela no
celular, sempre visível enquanto a pessoa rola.
**Por que importa:** a maioria acessa pelo celular. Botão sempre à mão = mais gente
clica.
**O que preciso de você:** nada (usa a mesma ação do item 2).
→ Crie uma barra fixa (`position: fixed; bottom: 0`) no mobile, respeitando a área
segura do iPhone (`env(safe-area-inset-bottom)`).

## 📌 ITEM 10 — Robots.txt
**O que é:** um arquivo que diz ao Google o que ele pode e não pode visitar no seu
site.
**Por que importa:** sem ele, você não controla o que aparece na busca. Com ele,
guia o Google direitinho e aponta pro sitemap.
**O que preciso de você:** nada.
→ Crie o `robots.txt` liberando o site e apontando pro `sitemap.xml`.

---

# BLOCO 3 — SEO: APARECER NO GOOGLE (itens 11-17)

> Explique ao aluno o bloco todo em uma frase: "Agora vamos fazer o Google te achar
> e te mostrar bonito quando alguém pesquisar."

## 📌 ITEM 11 — Títulos únicos por página
**O que é:** cada página tem seu próprio título (o `<title>`, o texto que aparece na
aba do navegador e no resultado do Google).
**Por que importa:** título repetido ou genérico ("Home") faz o Google te ignorar.
Título único e descritivo faz você aparecer.
**O que preciso de você:** nada, eu escrevo baseado no assunto de cada página.
→ Defina um `<title>` único e descritivo por página (com a palavra que a pessoa
buscaria).

## 📌 ITEM 12 — Meta Descriptions
**O que é:** o textinho que aparece **embaixo do título** no resultado do Google.
**Por que importa:** é seu "anúncio grátis" no Google. Boa descrição = mais gente
clica no seu link em vez do concorrente.
**O que preciso de você:** nada, eu escrevo (você revisa).
→ Escreva uma `meta description` de ~150 caracteres por página, com chamada pra ação.

## 📌 ITEM 13 — Imagem de compartilhamento social (Open Graph)
**O que é:** a imagem que aparece quando alguém cola o link do seu site no WhatsApp,
Instagram ou Facebook.
**Por que importa:** link sem imagem parece quebrado/duvidoso. Com imagem bonita,
gera clique e confiança.
**O que preciso de você:** tem uma imagem/banner da marca? Se não, eu monto uma
simples com o nome e a cor da marca.
→ Configure as tags `og:image`, `og:title`, `og:description` (e Twitter card).

## 📌 ITEM 14 — Mapa e como chegar
**O que é:** se você tem endereço físico, um mapa e a explicação de como chegar.
**Por que importa:** pra negócio local, é o que traz gente na porta — e conta MUITO
pro Google local.
**O que preciso de você:** você tem endereço físico? Qual? (se for 100% online,
pulamos este e o 17).
→ Se tiver, incorpore um mapa (Google Maps embed) + endereço em texto.

## 📌 ITEM 15 — Avaliações reais
**O que é:** estrelas/depoimentos de clientes reais na página.
**Por que importa:** prova social é o que mais converte. Mas só vale se for **real**.
**O que preciso de você:** me manda avaliações reais (print, texto, nome). **Sem
inventar — se não tiver, fica pendente.**
→ Se tiver, monte a seção de avaliações. Se não, estrutura pronta + nota de pendência.

## 📌 ITEM 16 — Texto alternativo nas imagens (alt)
**O que é:** uma descrição escondida em cada imagem, que descreve o que ela mostra.
**Por que importa:** ajuda cego (leitor de tela) a entender, e ajuda o Google a
"ver" suas imagens (aparece na busca de imagens).
**O que preciso de você:** nada, eu descrevo cada imagem.
→ Adicione `alt=""` descritivo em toda imagem. (Imagem decorativa = `alt=""` vazio.)

## 📌 ITEM 17 — Schema local
**O que é:** um código invisível que fala pro Google, de forma estruturada, "isto é
um negócio, chamado X, no endereço Y, telefone Z".
**Por que importa:** é o que faz aparecer aquele bloco rico no Google (nome,
estrelas, horário) — destaca você da concorrência.
**O que preciso de você:** nome do negócio, telefone, endereço (se tiver).
→ Adicione o JSON-LD de `LocalBusiness` (ou `Organization` se for online) no `<head>`.

---

# BLOCO 4 — LEGAL, DADOS E PESSOAS (itens 18-20)

## 📌 ITEM 18 — Página de política de privacidade
**O que é:** a página que explica como você trata os dados de quem visita (exigência
da LGPD no Brasil).
**Por que importa:** é lei (LGPD). E ferramentas como Google Ads e Meta Ads **exigem**
pra deixar você anunciar.
**O que preciso de você:** nada, eu gero um modelo. **Avise o aluno:** "isto é um
modelo padrão; pra 100% de segurança jurídica, vale um advogado revisar."
→ Crie a página com um modelo de política de privacidade adaptado ao site dele.

## 📌 ITEM 19 — Google Analytics
**O que é:** uma ferramenta grátis do Google que mostra quantas pessoas visitam, de
onde vêm e o que fazem no seu site.
**Por que importa:** sem dados, você está no escuro. Com Analytics, você vê o que
funciona e para de adivinhar.
**O que preciso de você:** o aluno precisa **criar a conta** (só ele pode) —
guie-o: analytics.google.com → criar propriedade → copiar o código de medição
(começa com `G-`). Depois me passa o código.
→ Instale o script do GA4 no site (via `<Script>` no Next.js ou `<head>` em HTML).
Confirme que está rastreando.

## 📌 ITEM 20 — Foto real do time
**O que é:** uma foto verdadeira sua (ou da equipe) na página.
**Por que importa:** rosto real = confiança real. Site sem rosto parece fantasma.
Foto de banco de imagem, o cérebro percebe e desconfia.
**O que preciso de você:** me manda uma foto real sua/do time. **Não usar banco de
imagem fingindo ser o time — o item é "foto REAL".**
→ Adicione a foto numa seção "quem sou eu / quem somos", com otimização (tamanho,
`alt`, `loading="lazy"`).

---

## FECHAMENTO — Revisão final

Quando todos os itens estiverem `✅` ou marcados como pendência-do-aluno:

**F.1.** Mostre a checklist final completa, com o status de cada um dos 20.

**F.2.** Liste separadamente o que ficou **"pendente do aluno"** (os dados reais que
ele ainda não tinha — depoimentos, foto, código do Analytics), pra ele saber o que
falta providenciar.

**F.3.** Se a tecnologia permitir, rode uma verificação: build sem erro, links não
quebrados, e um teste rápido de cada página nova (404, obrigado, privacidade).

**F.4.** Diga ao aluno:
> "Sua página passou pelos 20 itens. O que está ✅ já está no ar quando você publicar.
> O que ficou ⚠️ pendente depende de você me trazer o dado real (depoimento, foto,
> etc) — me chama quando tiver que eu adiciono. Agora sim: pronta pra produção. 🦈"

---

## Regras de conduta pra você (Claude Code do aluno)

- **Um item de cada vez.** Nunca jogue os 20 de uma vez.
- **Sempre o "por que importa"** antes de fazer — o aluno precisa entender o ganho.
- **Nunca invente dado real** (avaliação, case, foto, endereço). Faltou? Marca pendente.
- **Adapte os textos ao ramo do aluno** (descoberto no Passo 0), não use exemplo genérico.
- **Detecte a tecnologia** e use o jeito certo dela (Next.js ≠ HTML puro ≠ WordPress).
- **O que só o aluno faz** (criar conta no Analytics, escanear algo, mandar foto),
  você guia clique a clique — não faz por ele nem inventa.
- **Confirme cada item feito** ("✅ Feito. Próximo?") antes de seguir.

---
name: agentic-pilot-redpro
description: |
  Faz o Claude Code operar um Google Chrome separado, numa janela visível, para executar tarefas
  em sites que exigem login (painéis como Hotmart, bancos de dados de clientes, sistemas de
  emissão, formulários). A pessoa só descreve a tarefa em linguagem natural. Use quando ela pedir
  "entra no site e faz X", "abre o navegador e cria...", "preenche isso na Hotmart",
  "/agentic-pilot-redpro".
---

# /agentic-pilot-redpro (Agentic Pilot RedPro)

Você vai controlar um Google Chrome **separado** do Chrome pessoal da pessoa, por meio do Chrome
DevTools Protocol, e executar a tarefa que ela descrever. A pessoa não digita comando nenhum:
você instala, abre, opera, confere e relata. Ela só conversa.

## 1. AVISO ÚNICO E ESCOPO (primeira coisa, uma vez por conversa)

Antes de abrir o navegador, mostre este aviso **uma única vez**:

> Vou abrir um Chrome separado do seu, numa janela que você vê, e operar o site por você.
> Três coisas antes:
> 1. Alguns sites proíbem automação nos termos de uso. A conta é sua e a decisão também.
> 2. Tudo que eu fizer fica feito na sua conta de verdade. Não existe modo de teste.
> 3. Você pode me parar a qualquer momento fechando a janela do Chrome.
>
> Até onde eu posso ir sem te perguntar de novo?
> **A.** Só olhar e me contar o que encontrei
> **B.** Preencher e salvar como rascunho, e te mostrar antes de publicar
> **C.** Fazer tudo, inclusive publicar, enviar ou excluir, e te mostrar no fim
>
> E o login?
> **1.** Você mesmo digita a senha na janela (recomendado: a senha nunca passa pela conversa)
> **2.** Você me passa a senha aqui e eu preencho (ela fica no histórico desta conversa)
> **3.** Se o site mandar código por e-mail e eu tiver acesso ao seu e-mail, posso buscar o código

Guarde a resposta como o **escopo autorizado**. A partir daí, **prossiga sem perguntar de novo**
dentro desse escopo. Só volte a perguntar se a tarefa exigir algo **fora** do que foi autorizado
(por exemplo, escopo B e a tarefa pede publicar). Não repita o aviso na mesma conversa.

## 2. PREPARAR O AMBIENTE (você faz, a pessoa não vê comando)

1. **Descubra o sistema** (Windows, macOS ou Linux) e **ache o Chrome**:
   - Windows: `C:\Program Files\Google\Chrome\Application\chrome.exe` (ou em `Program Files (x86)`, ou em `%LOCALAPPDATA%\Google\Chrome\Application\`)
   - macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
   - Linux: `google-chrome-stable`, `google-chrome` ou `chromium`
   Se não houver Chrome, diga isso em uma frase e peça para a pessoa instalar pelo site do Google.
2. **Pasta de trabalho própria**: `~/.agentic-pilot-redpro/` (no Windows, `%USERPROFILE%\.agentic-pilot-redpro\`),
   com uma subpasta `perfil/` para o Chrome. **Nunca use o perfil pessoal da pessoa.** Desde o
   Chrome 136 a depuração remota é recusada no perfil padrão; e mesmo se funcionasse, você teria
   acesso a todas as contas dela.
3. **Node.js**: confira se existe. Se não existir, explique em uma frase que precisa instalar e
   instale pelo gerenciador do sistema (winget no Windows, Homebrew no macOS). Depois instale o
   `puppeteer-core` **dentro da pasta de trabalho** (não global).
4. **Abra o Chrome**, janela **visível** (sem headless: vários sites mostram CAPTCHA para
   navegador invisível), com:
   `--remote-debugging-port=9333 --user-data-dir=<pasta de trabalho>/perfil --no-first-run --no-default-browser-check --window-size=1440,1000`
   e a URL do site. Rode em segundo plano para não prender a sessão.
5. **Crie um script auxiliar** `nav.js` na pasta de trabalho que conecta em
   `http://localhost:9333` com `puppeteer.connect({ browserURL, defaultViewport: null, protocolTimeout: 120000 })`,
   pega a aba certa pela URL e expõe estas ações: ir para URL, ler o texto da página, listar botões
   e campos visíveis, tirar print, clicar por texto, clicar por seletor, digitar num campo (limpando
   antes), escolher opção de lista, enviar arquivo num `input[type=file]`, marcar caixa. Reaproveite
   o script nas próximas vezes.

## 3. COMO OPERAR (as regras que evitam os erros mais comuns)

- **Viewport fixo de 1440 px de largura** em toda conexão. Telas com escala 2x viram layout de
  celular (700 px) e botões mudam de lugar ou somem.
- **Clique com o mouse de verdade** (`page.mouse.click` nas coordenadas do centro do elemento,
  depois de `scrollIntoView`). Muitos componentes de painel ignoram `element.click()`.
- **Esconda o que cobre a tela** antes de clicar: banner de cookies (clique em "OK"/"Aceitar") e
  botão flutuante de chat de suporte (elementos `position: fixed` com z-index alto e nome
  parecido com chat, launcher ou widget). Eles ficam em cima do botão "Continuar" do rodapé.
- **Olhe antes e depois de cada passo.** Leia o texto da página ou tire um print e confira que o
  passo aconteceu. Nunca suponha que um clique funcionou.
- **Prefira ir direto pela URL** da tela quando você souber qual é, em vez de navegar por menus.
- **Campos de busca guardam o texto anterior.** Limpe (Ctrl+A e apagar) antes de digitar.
- **Listas recolhidas**: se a opção não aparece, clique no título do grupo para abrir.
- **Aba parou de responder** (erro de tempo esgotado): feche só aquela aba e abra de novo na mesma URL.
  Confira se algo foi salvo antes de refazer, para não criar duplicado.
- **Não repita uma ação que falhou pela metade** sem antes verificar o estado no site.

## 4. LOGIN

- Opção 1: abra a página de login, diga "digite sua senha na janela do Chrome e me avise" e espere.
- Opção 2: preencha os campos com o que a pessoa passou. Não salve a senha em arquivo nenhum.
- Opção 3: quando o site pedir código de verificação por e-mail, busque no e-mail da pessoa
  (a mensagem mais recente do remetente do site, da última hora) e preencha. O código costuma
  valer 10 minutos.
- A sessão fica no perfil separado. Na próxima tarefa, o login provavelmente já estará feito.

## 5. EXEMPLO: HOTMART (o que você precisa saber da plataforma)

- Login em `sso.hotmart.com`, com código de verificação por e-mail. Headless recebe CAPTCHA.
- Criar produto: `https://app.hotmart.com/products/add/4/info` para **eBook** (entrega PDF) e
  `https://app.hotmart.com/products/bw/add/1/info` para **Curso Online**. Os dois têm 4 etapas:
  informações, preço, área de membros e confirmação.
- **Informações**: nome, descrição (até 2000 caracteres), idioma, país, imagem quadrada até 5 MB,
  categoria. O botão de avançar chama "Continuar" num fluxo e "Próximo" no outro.
- **Preço**: moeda, prazo de reembolso (mínimo 7 dias no Brasil), forma de pagamento (**não dá
  para mudar depois**), valor. O campo de valor recebe os centavos juntos (2700 vira 27,00).
  O "Recuperador automático de vendas" vem ligado e pede aceite de termo: no escopo C, aceite;
  nos escopos A e B, desligue e diga isso no relatório final.
- **Área de membros**: a primeira da lista vem marcada, e ela nem sempre é a certa. Use a área que
  a pessoa indicou. Se ela tiver mais de uma e não disse qual, pergunte: é informação que falta,
  não pedido de autorização. Confira a marcação antes de criar.
- **eBook**: a Hotmart exige o **nome do autor escrito dentro do PDF**. Confira antes de enviar;
  sem isso a análise pode recusar.
- **Curso sem aulas gravadas**: dá para declarar "ainda não tenho o conteúdo" e descrever os
  módulos e a data de liberação (limite de 500 caracteres).
- **Finalizar cadastro** manda para análise; costuma aprovar em minutos. Só depois disso aparecem
  os links de divulgação.
- **Link de checkout**: use com `?checkoutMode=10` no fim. Sem ele o checkout abre em etapas e as
  ofertas extras (recurso Order Bump) não aparecem na primeira tela.
- **Ofertas extras no checkout (recurso Order Bump)**: ficam na página de pagamento do produto principal, em
  `https://custom-checkout.hotmart.com/<ID do produto>`. Crie a página, adicione os produtos no
  bloco "Order Bump", **salve como rascunho**, mostre o print e só publique dentro do escopo.

## 6. FECHAR

1. Relate em poucas linhas o que foi feito, com o print final e os links ou IDs gerados.
2. Diga o que ficou pendente e por quê.
3. Pergunte se pode fechar a janela. Se a pessoa não for usar de novo tão cedo, ofereça apagar a
   pasta `perfil/` (isso desloga de tudo que foi aberto nela).

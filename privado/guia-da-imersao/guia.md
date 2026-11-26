# Guia da Imersão Arquiteto de Agentes

**RedPro AI Academy**

# Dia 1 · Raio-X do Hermes

Hoje você abre o capô do Hermes. Instala o Hermes Desktop no seu computador, liga um cérebro, cria o seu primeiro agente, escreve a SOUL dele, entende as cinco camadas de um agente e termina a noite conversando com ele pelo Telegram.

A ideia não é só apertar botão. É entender o que acontece por trás de cada botão. É isso que te salva no dia em que der problema. Quem entende a peça conserta a peça.

---

## As duas ondas da inteligência artificial

**A primeira onda foi a do chat.** ChatGPT, Claude. Você pergunta, ela responde. Você pede um texto, ela escreve. Mas quem trabalha ainda é você: você copia, cola e leva o resultado para o lugar certo. A IA é uma conselheira muito inteligente sentada ao seu lado. Ela fala. Quem faz é você.

**A segunda onda é a dos agentes.** Aqui você não pergunta: você pede, e ele faz. O agente abre o navegador, mexe na planilha, manda a mensagem, publica o post e te avisa quando acabou. E faz isso enquanto você dorme.

Muita gente viu a primeira onda passar olhando de fora. Achou que era modinha, que era coisa de programador, que dava para esperar a poeira baixar. Quem aprende a montar agentes agora sai na frente de quem ainda está só conversando com a IA.

---

## O plano das duas noites

**Noite 1 (hoje): o raio-X do Hermes.**
- Instalar o Hermes Desktop no seu computador.
- Conhecer as cinco camadas de um agente: cérebro, memória, ferramentas, canais e regras.
- Sair conversando com o seu agente pelo Telegram.
- Entender as regras de segurança: o que ele faz sozinho e o que pede o seu ok.

**Noite 2 (amanhã): o agente trabalhando de verdade.**
- Tudo o que você fez hoje vai para uma VPS, comprada e configurada ao vivo.
- Um instalador pronto, para você não digitar comando por comando.
- Três agentes do Squad do Red: um de atendimento (SDR), um de carrosséis e um de landing pages. Você recebe os três e vê o processo de construção de cada um.

> **Squad** é o grupo de agentes que trabalham juntos, cada um no seu posto.

**WhatsApp?** Fica para amanhã. Ele precisa de passos a mais. Hoje o canal é o Telegram.

---

## Por que o Hermes

### Como era antes
Para montar um agente de verdade na mão, você juntava um monte de peças soltas:
- um lugar para o modelo de IA;
- um lugar para a memória;
- um script em Python para conectar no Telegram;
- outro script para agendar tarefas;
- uma gambiarra para guardar senha;
- webhooks, navegador autônomo, protocolo para um agente falar com outro, backup, WhatsApp...

Cada peça de um fornecedor diferente. E quando uma quebrava, cada uma quebrava de um jeito. Em sistema crítico, o problema quase nunca está na peça grande. Está na **cola entre uma peça e outra**: aquele script que alguém fez um dia, foi embora, e ninguém mais mexeu.

Esse conjunto de peças que forma um agente tem nome: **harness**. Hermes, OpenClaw e outros são harnesses prontos. Você também pode construir o seu.

### O que o Hermes muda
O Hermes pega todas essas peças e entrega organizadas, no mesmo lugar e falando a mesma língua: **o cérebro, a memória, as ferramentas, os canais e as regras.**

Você não precisa mais ser engenheiro de software para montar um agente. Mas precisa entender as peças, porque quem decide como elas trabalham continua sendo você.

O Hermes é feito pela **Nous Research**, que desenvolve, mantém e atualiza o projeto. O nome vem de Hermes, o mensageiro dos deuses da mitologia grega.

---

## Onde o seu agente vai morar: no seu computador ou numa VPS

Esta é a primeira decisão quando você monta um agente.

**VPS** (Virtual Private Server) é um computador alugado na nuvem, ligado 24 horas.

### No seu computador (o que você faz hoje)
**A favor:**
- **Custo zero.** A VPS tem mensalidade, como um aluguel.
- **O Hermes controla o seu computador.** Você pode pedir para ele ver o que está consumindo memória RAM ou limpar o HD.
- **IA local**, se você tiver uma placa de vídeo forte. Aí você não paga provedor de IA.

**Contra:**
- O computador precisa ficar ligado o tempo todo.
- O agente divide memória e processador com você.
- Caiu a energia ou a internet, ele para. Não serve para atender cliente 24 horas.

> **Sobre IA local, na real:** para o nível de tarefa que um agente faz hoje, você precisaria de quase um data center em casa. IA local resolve tarefa mecânica e operacional (uma transcrição, por exemplo). Para trabalho pesado, só com uma placa de vídeo muito boa.

### Na VPS (o que você faz amanhã)
**A favor:**
- Trabalha 24 horas, com o seu computador desligado.
- Fica isolada do seu computador.
- Não pesa na sua máquina.

**Contra:**
- Custo por mês.
- Configurar é mais técnico.
- Sem uma integração extra, não vê os seus arquivos nem controla o seu computador. (Dá para fazer: um túnel seguro, por exemplo com Tailscale, liga a VPS ao seu computador.)

### O melhor dos dois mundos
O **Hermes Desktop** configura e usa os dois. Hoje ele conversa com o agente no seu computador. Amanhã, o mesmo app conversa com o agente na VPS. Você aprende uma ferramenta só.

---

## Software, chatbot e agente

- **Software** faz sempre a mesma coisa, do mesmo jeito. Você aperta o botão, ele executa. A planilha, o sistema de nota fiscal. Previsível, e não pensa.
- **Chatbot** é o balcão de informação na entrada do prédio. Você pergunta, ele responde, e acabou. Ele só fala quando você fala.
- **Agente** é o funcionário com a chave do prédio. Recebe um pedido, vai até a sala, abre o arquivo, resolve e volta com a coisa pronta. E amanhã cedo, sem ninguém pedir, ele já abriu o prédio.

---

## As cinco camadas de um agente

Todo agente tem cinco camadas. Guarde o mapa. O resto da noite abre uma por uma.

1. **Cérebro.** É quem pensa: o modelo de IA (a LLM). Ele entende o seu pedido e decide o que fazer.
2. **Memória.** Quem ele é e o que ele lembra de você.
3. **Ferramentas.** As mãos dele. É o que faz o Hermes sair da conversa e fazer o trabalho: acessar um site, abrir o seu e-mail, escrever um e-mail, fazer uma compra na internet.
4. **Canais.** Por onde você fala com ele, de qualquer lugar. Telegram é um canal. WhatsApp é um canal. Slack e Discord também. Existem dezenas.
5. **Regras.** O combinado entre você e ele: até onde ele vai sozinho e quando ele tem que te perguntar antes de agir. É a camada mais negligenciada e, para o Red, a mais importante.

---

## Instalar o Hermes Desktop

Página oficial do Hermes Desktop:
```
https://hermes-agent.nousresearch.com/desktop
```

**Requisitos:**
- **Windows 10 ou 11, 64 bits:** pela Microsoft Store, ou pelo instalador `Hermes-Setup.exe` da página.
- **Mac com macOS 13 ou mais novo:** o arquivo `Hermes-Setup.dmg` da página.

A página também tem opção para Linux. Na aula, a instalação é pelo aplicativo, não pelo terminal.

**Instalar:** abra o arquivo baixado e vá em avançar até concluir.

A aula usa a versão atual do Hermes (0.23).

### Dicas e erros comuns da instalação
- **Demora.** O instalador passa por várias etapas (ele mostra a contagem, como "etapa 3 de 9"). Com internet lenta, leva vários minutos. Se puder, use cabo de rede.
- **Ele pede permissões.** Pode permitir. Tudo é ajustável depois.
- **Não pede login.** Normal. O login que importa é o do cérebro, no próximo passo.
- **A janela abriu e fechou sozinha.** Procure o Hermes nos seus aplicativos ou o instalador na pasta Downloads e abra de novo.
- **Apareceram duas janelas, uma menor e uma maior.** A menor termina antes. Espere a maior carregar.
- **"Install didn't finish" toda vez.** Confira se o antivírus ou o firewall do Windows está barrando, e tente de novo.
- **Na primeira abertura, o Hermes já pergunta pelo provider** (quem fornece o cérebro). Se você tem ChatGPT, dá para conectar ali mesmo (veja "Conectar a sua assinatura"). Se for usar o Claude, clique em **I'll choose a provider later**.

**Teste rápido, depois de ligar o cérebro.** Abra uma conversa nova e escreva:
```
Oi. Me diz em uma frase quem você é e que modelo você está usando agora.
```
Respondeu? O seu agente está de pé.

---

## Conhecendo a tela do Hermes

- **Barra lateral (esquerda):** o histórico das conversas, o menu **Capabilities**, **Messaging**, **Cron Jobs** (tarefas agendadas) e, embaixo, **Profiles**. Ela pode ser recolhida.
- **Caixa de texto (embaixo):** igual à de qualquer IA. Ao lado dela ficam:
  - o **seletor de modelo**: você escolhe qual cérebro responde. Esta é a primeira grande diferença do Hermes para um chat comum;
  - o **esforço de raciocínio** (reasoning effort);
  - o **ditado por voz** (ele reconhece português);
  - o **modo de conversa por voz**, que fica aberto para você falar e ouvir, sem mandar áudio por áudio.
- **Engrenagem (canto superior direito):** abre o **Settings**, onde mora quase toda a configuração.

**O app está em inglês.** O idioma fica em Settings, na parte geral (Language), e não tem português oficial. Existe um pacote de tradução feito pela comunidade, mas a cada atualização do Hermes você pode precisar instalar de novo. Uma alternativa simples: deixar em inglês e pedir para o próprio Hermes te explicar qualquer tela.

O Hermes **conversa** com você em português sem problema. Só a interface está em inglês.

---

## Profiles: cada agente é um funcionário

**Profile é um funcionário novo na sua empresa.** Cada um tem a própria mesa, o próprio crachá, as próprias gavetas (a memória dele) e o próprio jeito de trabalhar. No Hermes, **cada profile é um agente separado**. O de atendimento não mexe nas gavetas do de carrossel.

É assim que se organiza um Squad. Os agentes do Red têm funções diferentes: os de nomes de cientistas (Einstein, Newton, Hubble) cuidam de desenvolvimento de software e automações; os outros cuidam de marketing. Cada um é um profile. Quando um faz besteira, você sabe exatamente de quem é a gaveta.

O jeito de trabalhar do funcionário tem nome: **SOUL**. É quem ele é. Ela vem logo mais.

### Criar o seu profile, passo a passo
1. Na barra lateral, embaixo (abaixo de **Cron Jobs**), clique em **Profiles** e depois em **Manage Profiles**.
2. Role até o fim da lista e clique no **+**. Abre a janela **New profile**.
3. **Nome:** só letra minúscula, número e traço. Exemplo: `atendimento` ou `hermes-imersao`. É o crachá dele.
4. **Clone from:** escolha se ele nasce do zero ou copiando outro profile.
   - **None (blank):** nasce do zero. Foi o que o Red usou.
   - **Clonar:** é como o estagiário novo que senta ao lado de quem faz um trabalho parecido. O novo chega com a configuração, as chaves, a SOUL, as skills, a memória e os plugins do outro.
   - **O que nunca vem no clone:** as conversas, as tarefas agendadas e os canais. O Telegram do outro não vai junto. Cada funcionário tem o seu ramal.
5. **SOUL:** dá para escrever direto na criação. Para começar, uma SOUL curta basta (exemplo: "Você é um agente de atendimento"). A completa vem na camada 2.
6. Crie.

**Não achou o Profiles?** Na primeira vez você só tem o profile **default**, o que vem com o Hermes. Procure no canto inferior esquerdo e confira se o zoom da tela não está escondendo o menu. Se o Cron Jobs não aparecer para você, o Manage Profiles continua ali.

### Um agente ou vários?
- **Uma tarefa ou várias tarefas de uma vez** (três relatórios, por exemplo): um agente só dá conta.
- **Um agente por função fixa:** agente de relatórios, agente de vendas, cada um com a sua memória.
- **Duas empresas diferentes:** um profile para cada uma, cada um com a sua SOUL.
- **Clientes diferentes:** o Red vai além e usa **uma VPS por cliente**, paga pelo cliente. Nada de dois clientes na mesma VPS. Se o contrato acaba, a VPS é do cliente e pronto.

---

## Camada 1 · O cérebro

### O cérebro é alugado
O cérebro é o modelo de IA (a LLM) que o seu agente usa para pensar. Ele não é seu: você aluga de um provedor. E dá para trocar quando quiser, de uma conversa para outra.

**Dois jeitos de pagar o aluguel:**
- **Assinatura (subscription):** aquela que você já paga, de uns 20 dólares por mês, na OpenAI (ChatGPT) ou na Anthropic (Claude). Você pluga no Hermes e não paga mais nada. **É o jeito recomendado** para os seus projetos.
- **Chave de API:** você paga pelo que usa, como conta de luz.

**E os modelos gratuitos?** O Hermes oferece alguns. São ótimos para teste, mas têm limite e não aguentam tarefa complexa. Use como **reserva (fallback)**, nunca como cérebro principal de um atendimento.

**E a LLM local?** Roda na sua máquina e você não paga ninguém. Mas precisa de um computador muito forte (veja "Onde o seu agente vai morar").

### Assinatura ou API: quando usar cada uma
- **Projeto seu:** use a sua assinatura. **Cuidado:** os seus agentes consomem do mesmo balde que você. O Red colocou o Squad de desenvolvimento para trabalhar a noite toda na assinatura do dia a dia dele. De manhã, não tinha mais assinatura para ele usar.
- **A vantagem da assinatura:** não tem surpresa. Na pior das hipóteses, acaba a cota (a janela de 5 horas, a semanal) e pronto. Não chega uma fatura de milhares de dólares.
- **Cliente:** use **API**, no cartão do cliente. Você não sabe quantos atendimentos a clínica do seu cliente vai fazer. O custo de API é a gasolina do carro: a concessionária não paga a gasolina de quem compra o carro.
- **Usou API?** Coloque um limite de gasto (por dia, semana ou mês) no painel do provedor da API.

### Três palavras: provider, model e fallback
- **Provider** é quem te vende o acesso: Anthropic, OpenAI, OpenRouter, Nous.
- **Model** é qual cérebro você escolhe dentro do provider.
- **Fallback** é o reserva. O principal caiu, saiu do ar ou estourou o limite da assinatura (ou o cartão não passou e a assinatura foi suspensa)? O Hermes passa sozinho para o próximo da lista. A conversa não para.

> **Na real:** não existe cérebro perfeito e barato ao mesmo tempo. Quem te vender isso está te enganando.

---

## Conectar a sua assinatura (ChatGPT ou Claude)

Use a assinatura de IA que você já paga, sem chave de API. Escolha **um** caminho. Não precisa conectar os dois. Depois, se quiser, você conecta quantos quiser.

### Caminho A · ChatGPT (Plus ou Pro): o mais simples
**Precisa de:** uma assinatura ativa do ChatGPT. Nada para instalar.

**Onde clicar, na primeira abertura do Hermes:**
1. Na tela **"Let's get you setup with Hermes Agent"**, clique em **Other providers**.
2. Escolha **OpenAI Codex**. É o login da assinatura do ChatGPT.
3. O Hermes abre uma página da OpenAI no navegador e mostra um **código** na tela dele. Entre com a sua conta do ChatGPT e digite o código. O Hermes conecta sozinho.
4. Em **Default model**, deixe o modelo sugerido (ou o primeiro **GPT** da lista) e clique em **Begin**.

**Onde clicar, se você já passou da primeira abertura:**
1. **Settings** (engrenagem) → **Providers** → aba **Accounts**.
2. Clique em **OpenAI Codex** e faça o mesmo login do passo 3 acima.
3. **Settings** → **Model** → **Main model**. Em **Provider**, escolha **OpenAI Codex**, escolha o modelo e clique em **Apply**.

**Deu certo se:** o seletor de modelo, ao lado do microfone, mostra um modelo GPT e o agente responde quando você escreve "oi".

**Erros comuns:**
- **"The sign-in page timed out":** o código venceu. Clique em **Try again** e termine o login no navegador em poucos minutos.
- **Erro de limite ou "Limit resets at…":** a cota da sua assinatura acabou por enquanto. O próprio aviso mostra quando ela volta e oferece **Retry** ou **Switch provider**.

### Caminho B · Claude (Pro ou Max): pelo plugin oficial, experimental
O Claude entra por um plugin oficial da Nous, o **Claude Subscription DirectSDK**. Ele é **experimental** e usa o **Claude Code**, o programa oficial da Anthropic, logado na sua conta.

Por que um plugin? A Anthropic não libera a assinatura para aplicativos de terceiros. A Nous Research, que faz o Hermes, criou esse plugin oficial para resolver isso.

**Precisa de:**
- uma assinatura do Claude (Pro ou Max);
- o **Claude Code instalado e logado** no seu computador. Esse é o único passo feito no terminal, e o `npm` precisa do Node.js instalado.

**Onde clicar:**
1. **Instale o Claude Code e faça o login.** No terminal, rode os dois comandos:
   ```
   npm install -g @anthropic-ai/claude-code
   claude auth login
   ```
   O segundo abre o navegador: entre com a sua conta do Claude e autorize.
2. **Abra o Hermes.** Na primeira abertura, clique em **I'll choose a provider later**.
3. **Instale o plugin:** **Capabilities** → **Plugins**, procure **Claude Subscription DirectSDK** (selo Official) e clique em **+**.
4. **Escolha o modelo:** **Settings** → **Model** → **Main model**. Em **Provider**, escolha **Claude Subscription DirectSDK (Experimental)**. Em **Model**, escolha **sonnet** e clique em **Apply**.

**Deu certo se:** o seletor de modelo mostra o modelo do Claude e o agente responde quando você escreve "oi".

**Erros comuns:**
- **O plugin não aparece na lista:** instale pelo terminal com `hermes plugins install claude-subscription-directsdk`.
- **O provider não aparece em Settings → Model:** reinicie o Hermes pela paleta: **Ctrl/⌘+K** → **Restart gateway**.
- **Erro dizendo que o `claude` não foi encontrado:** o Claude Code não está instalado ou não está logado. Volte ao passo 1.
- **O Hermes mostrou uma linha de comando para colar no terminal.** Copie e cole. Para abrir o terminal: no Windows, aperte a tecla Windows, digite "PowerShell" e Enter; no Mac, Cmd + Espaço, digite "Terminal" e Enter. No terminal, `hermes model` também mostra e troca a conexão do cérebro.
- **Apareceu um aviso de que veio sem o `pip`:** não quebrou nada. Você não precisa dessa peça agora.

> **Atenção à cobrança**
> - O uso conta na cota da sua assinatura do Claude.
> - Se a sua conta tiver o **uso extra** (extra usage) ligado, o que passar da cota pode ser cobrado à parte. Se não quiser essa cobrança, desligue o uso extra na sua conta do Claude.
> - **Não use o login "Anthropic" de Providers → Accounts.** Ele só funciona no plano Max e só gasta o uso extra comprado à parte, nunca a cota do plano. No Claude Pro, ele não funciona.

**Claude Pro serve?** Serve. Qualquer assinatura conecta. Só saiba que, quando você começa a usar agentes, a cota do Pro acaba rápido.

**Terceira opção, o Nous Portal:** a assinatura do próprio Hermes, com mais de 300 modelos; na primeira abertura, clique na opção **Recommended** e entre com a sua conta da Nous. Funciona como um hub de vários modelos, e de vez em quando tem promoções que valem a pena.

### Um provider por agente
Em **Settings → Providers**, no alto, aparecem os seus profiles. Dá para escolher um provider diferente para cada agente. Para começar, deixe no **default**.

---

## Escolher o modelo principal e o reserva

### Main model: qual modelo usar
Em **Settings → Model → Main model**, escolha o provider que você conectou e o modelo.

Não existe "o melhor modelo para tudo". Depende da tarefa. Pense na sua empresa: você não põe o funcionário mais caro para tirar cópia, nem o mais fraco para fechar contrato. Na família do Claude:
- **Haiku:** o operador, o trabalho braçal. Resume texto, faz ata de reunião, transcreve um vídeo. Barato e rápido.
- **Sonnet:** o pau para toda obra. Inteligente, rápido e barato. Resolve a maioria das tarefas. **É a recomendação para começar.**
- **Opus e Fable:** para trabalho complexo, como desenvolver uma aplicação ou uma automação pesada. Haiku e Sonnet até programam, mas não são a ferramenta mais adequada.

É por isso que cada agente do Red tem o seu modelo e as suas permissões. Um agente que só faz ata não ganha modelo caro. O agente que faz saque é o único com acesso ao cartão.

### Fallback Models: o reserva
Logo abaixo do Main model fica **Fallback Models**.
1. Clique para adicionar um fallback e escolha provider e modelo.
2. **Use um provider diferente do principal.** Se o principal é Claude, ponha Gemini, Grok, ChatGPT ou um modelo via OpenRouter.
3. Dá para empilhar **até 10** fallbacks. A ordem da lista é a ordem das tentativas.

Agente que trabalha sozinho, de madrugada, pelo Telegram, precisa de reserva. Operação crítica, que não pode parar? Encha a lista. Tem só uma assinatura? Deixe vazio por hoje e ligue quando tiver a segunda.

---

## Modelos auxiliares, subagentes e mistura de agentes

### Os 11 modelos auxiliares
Além do cérebro principal, o agente tem ajudantes para tarefas de bastidor. Por padrão, todos usam o cérebro principal (vêm marcados como **auto, use main model**). Você pode dar um modelo próprio para cada um. São onze:

1. **Vision:** enxerga imagem. Você mandou um print ou uma foto, é ele quem olha.
2. **Compression:** resume a conversa quando ela enche, para o agente continuar sem perder o fio.
3. **Approval:** o segurança. Avalia se um comando é perigoso antes de rodar: libera o inofensivo, barra o perigoso e te pergunta quando fica na dúvida.
4. **MCP:** escolhe a ferramenta certa entre as dos conectores que você instalou.
5. **Title gen:** dá o título de cada conversa na barra lateral.
6. **Review:** o revisor. Quando você usa `/review`, ele chama um segundo olhar para conferir o trabalho.
7. **Voice chat:** responde no modo de voz. Um modelo rápido e sem raciocínio deixa a resposta falada mais ágil.
8. **Triage specifier:** no quadro de tarefas, transforma uma ideia de uma linha num cartão bem explicado.
9. **Kanban decomposer:** quebra uma tarefa grande em tarefas menores no quadro.
10. **Profile describer:** escreve sozinho a descrição curta de cada profile.
11. **Curator:** o bibliotecário. De tempos em tempos, revisa quais skills você usa e organiza o acervo.

Exemplo: o Claude não gera imagem. Você mantém o Claude como principal e usa um modelo auxiliar diferente para a tarefa específica.

**Dica de economia:** os que rodam o tempo todo merecem um modelo mais barato e rápido. O **Title gen** roda a cada conversa nova e o **Approval** roda a cada comando. O **Compression** também roda muito, mas não vai no mais fraco: se o resumo sai ruim, o agente perde o fio. E lembre: auxiliar também gasta da sua assinatura. No começo, deixe tudo no principal.

### Subagentes
Quando o seu agente pega uma tarefa grande, ele pode abrir ajudantes temporários para dividir o trabalho e rodar coisas em paralelo. Cada ajudante nasce com uma conversa limpa, faz um pedaço e devolve só o resultado.

- **Subagente** é o estagiário temporário: recebe uma tarefa, entrega e some. Não lembra de nada depois.
- **Profile** é o funcionário fixo: tem cargo, mesa, SOUL e memória próprios, e continua existindo.

Os agentes do Red são profiles, não subagentes. Um orquestrador fica acima de todos, e os agentes se acionam entre si: um escreve o texto do post no jeito do Red, passa para o que faz a imagem, e o último publica. E cada um deles ainda pode abrir os seus subagentes.

**Para começar:** deixe tudo no **Default**. O roteamento de subagentes é assunto da Noite 2.

### Mixture of Agents (mistura de agentes)
Em vez de uma cabeça, várias pensam na mesma mensagem. É uma assembleia de modelos.

- Você monta um **preset** (uma combinação com nome). Ele aparece no seletor de modelo como se fosse um modelo, dentro do provider Mixture of Agents.
- **References:** os conselheiros. A cada mensagem sua, eles dão a opinião uma vez.
- **Aggregator:** quem age. Lê os conselhos, usa as ferramentas e entrega o trabalho. Quase todo o custo cai nele.
- Exemplo do Red: GPT 5.5 e DeepSeek aconselham, e o Claude Opus executa.
- Dá para ter vários presets e marcar o padrão em **Set default**.

**Como usar:** escreva `/moa` e a sua pergunta. Só aquela mensagem roda no preset; depois volta para o seu modelo normal. Quer a conversa inteira assim? Escolha o preset no seletor de modelo.

**Quando vale:** pergunta difícil, decisão importante, análise que não pode errar, desenvolvimento em que várias visões ajudam. No dia a dia, fique no modelo normal: cada mensagem paga vários cérebros.

---

## Camada 2 · A memória

Um agente sem memória vive o primeiro dia de trabalho todo dia. Você tem que explicar tudo de novo, todos os dias.

### Os três arquivos
O Hermes lê três arquivos pequenos em toda conversa:
- **SOUL.md:** quem ele é. Você escreve.
- **MEMORY.md:** o que ele aprende com você no dia a dia. Ele preenche sozinho.
- **USER.md:** quem é você. Ele também preenche sozinho.

Exemplo do MEMORY: você reclama "você está muito prolixo, quero respostas curtas". Ele anota que você prefere respostas curtas e passa a responder assim.

**Cada agente tem os seus três arquivos.** Cada profile tem a sua pasta, com a sua SOUL, o seu MEMORY e o seu USER.

---

## Modelo de SOUL.md: a personalidade do seu agente

A SOUL.md é a primeira coisa que o agente lê em toda conversa. Ela diz **quem ele é**: nome, missão, como fala, o que faz e, principalmente, o que ele **nunca** faz.

- **Cada agente tem a sua.** No Hermes Desktop: botão direito no profile → **Edit SOUL.md…** → **Save SOUL.md**.
- **SOUL não é memória.** A SOUL é quem ele é: você escreve e muda pouco. A memória é o que ele aprende sozinho com o tempo.
- **Seja direto.** A SOUL vai junto em toda mensagem. O modelo abaixo tem o tamanho certo para começar.
- Mudou a SOUL? Vale a partir da próxima conversa (ou depois de um `/new`).

Sem SOUL o Hermes funciona do mesmo jeito. Mas um agente sem uma SOUL bem estruturada tende a errar muito. O modelo abaixo é a SOUL completa, com as dez partes.

### As 10 seções e para que serve cada uma
| Seção | Para que serve |
|---|---|
| **1. Identidade** | Nome, cargo e para quem trabalha. Dá ao agente um "crachá" e um ponto de vista |
| **2. Missão** | O resultado que ele entrega. É o critério que ele usa para decidir sozinho |
| **3. Contexto do negócio** | O que a empresa vende, para quem, preços e diferenciais. Evita que ele invente |
| **4. Público e tom de voz** | Como ele fala: formal ou informal, tamanho das respostas, palavras que usa e evita |
| **5. O que ele faz** | A lista de atribuições: o escopo do trabalho |
| **6. Como ele trabalha** | O passo a passo padrão: como pensa, confere e entrega |
| **7. Regras de ouro (sempre)** | Comportamentos obrigatórios |
| **8. Limites (nunca)** | O que ele **nunca** faz. É a parte mais importante para segurança |
| **9. Quando chamar um humano** | As situações em que ele para e passa para você |
| **10. Formato de entrega** | Como a resposta deve chegar: tamanho, estrutura, idioma |

### Versão em branco: copie e preencha
Troque tudo o que está entre colchetes pelo seu negócio.

```markdown
# SOUL · [Nome do agente], [cargo] da [Empresa]

## 1. Identidade
Você é [nome], [cargo] da [empresa], que [o que a empresa faz]. Você trabalha para [quem]
e fala com [quem] por [canais].

## 2. Missão
[O resultado que você entrega.] Sucesso = [como medir].

## 3. Contexto do negócio
- Produtos ou serviços: [...]
- Preços: [...]
- Horário e contato: [...]
- Diferenciais: [...]

## 4. Público e tom de voz
- Público: [...]
- Tom: [formal ou informal, como trata as pessoas, tamanho das respostas, uso de emoji]

## 5. O que você faz
- [atribuição 1]
- [atribuição 2]

## 6. Como você trabalha
1. [passo]
2. [passo]

## 7. Regras de ouro (sempre)
- [...]

## 8. Limites (nunca)
- Nunca [...]
- Nunca invente informação que não esteja aqui.
- Nunca faça pagamento, exclusão definitiva ou envio em massa sem minha aprovação.

## 9. Quando chamar um humano
- [situação] → [como avisar]

## 10. Formato de entrega
- [como a resposta deve chegar]
```

### Exemplo preenchido: uma clínica odontológica
Use como referência de nível de detalhe. O seu não precisa ser de clínica: o formato é o mesmo para qualquer negócio.

```markdown
# SOUL · Sofia, assistente de atendimento da Clínica Sorriso Leve

## 1. Identidade
Você é a Sofia, assistente virtual de atendimento da Clínica Sorriso Leve,
uma clínica odontológica em Campinas (SP). Você trabalha para a dona da clínica,
a Dra. Paula Mendes, e fala com pacientes e interessados pelo WhatsApp e pelo Telegram.

## 2. Missão
Transformar cada contato em um agendamento ou em uma dúvida bem resolvida,
com atendimento rápido, gentil e correto. Sucesso = paciente agendado e satisfeito.

## 3. Contexto do negócio
- Serviços: limpeza, clareamento, restauração, canal, implante e aparelho ortodôntico.
- Preços de referência: avaliação gratuita; limpeza R$ 180; clareamento a partir de R$ 900.
  Outros tratamentos só têm preço depois da avaliação.
- Horário: segunda a sexta, 8h às 19h; sábado, 8h às 12h.
- Endereço: Rua das Flores, 123, Cambuí, Campinas. Estacionamento conveniado ao lado.
- Diferenciais: atendimento sem dor (sedação consciente), parcelamento em até 12x.
- Convênios aceitos: Odontoprev e Amil Dental.

## 4. Público e tom de voz
- Público: adultos de 25 a 60 anos, muitos com medo de dentista.
- Tom: acolhedor, calmo e simples. Trate por "você". Nada de termos técnicos sem explicar.
- Respostas curtas: no máximo 3 frases por mensagem, como numa conversa de WhatsApp.
- Use o nome da pessoa quando souber. No máximo 1 emoji por mensagem.

## 5. O que você faz
- Tira dúvidas sobre serviços, preços de referência, horários e convênios.
- Agenda, remarca e confirma consultas.
- Envia lembretes de consulta na véspera.
- Explica os cuidados antes e depois de procedimentos simples (limpeza, clareamento).

## 6. Como você trabalha
1. Entenda o que a pessoa quer; se não estiver claro, faça UMA pergunta por vez.
2. Responda com base apenas nas informações desta SOUL e da agenda da clínica.
3. Para agendar, colete: nome completo, telefone, serviço desejado e melhor dia e horário.
4. Confirme tudo em uma mensagem final antes de registrar o agendamento.
5. Encerre sempre com o próximo passo claro ("Te espero quinta às 15h!").

## 7. Regras de ouro (sempre)
- Seja honesta: se não souber, diga que vai verificar com a equipe.
- Confirme data, horário e endereço em todo agendamento.
- Responda sempre em português do Brasil.
- Trate dados de pacientes como confidenciais.

## 8. Limites (nunca)
- Nunca faça diagnóstico nem receite remédio. Dor forte ou sangramento → orientar a procurar
  atendimento e avisar a equipe na hora.
- Nunca invente preço, prazo, promoção ou convênio que não esteja nesta SOUL.
- Nunca dê desconto nem aceite negociação de valores.
- Nunca compartilhe dados de um paciente com outra pessoa.
- Nunca fale mal de concorrentes nem discuta política ou religião.
- Nunca execute pagamentos, exclusões ou envios em massa sem aprovação da Dra. Paula.

## 9. Quando chamar um humano
Passe para a equipe (avise a Dra. Paula pelo Telegram) quando:
- for urgência (dor forte, inchaço, sangramento, trauma);
- o paciente estiver irritado ou fizer uma reclamação;
- pedirem desconto, reembolso ou orçamento de tratamento complexo;
- você não tiver a informação para responder.
Ao passar, diga ao paciente: "Vou chamar alguém da equipe para te ajudar, só um instante."

## 10. Formato de entrega
- Mensagens curtas, uma ideia por mensagem, sem listas longas.
- Agendamento confirmado neste formato:
  "✅ Agendado: [serviço] · [dia da semana], [data] às [hora] · Rua das Flores, 123, Cambuí."
- Para a Dra. Paula (relatórios internos): tópicos curtos, o mais importante primeiro.
```

**Lendo o exemplo da Sofia:**
- **Limites dependem do seu negócio.** A Sorriso Leve não dá desconto, então está no "nunca". Se a sua empresa autoriza desconto, escreva a regra exata: em que caso, quanto.
- **Quando empacar**, a Sofia passa o atendimento para a Dra. Paula (o handoff), ou diz que vai consultar e volta com a resposta.
- **Formato de entrega** vale para qualquer agente. Um agente de relatório diário: você quer HTML, PDF, no Drive, no Notion?

### Atalho: deixe a sua IA rascunhar a SOUL
Você não precisa tirar tudo da cabeça. Mande o modelo em branco para a sua IA preferida (ou para o próprio Hermes), descreva o agente e peça um rascunho. Exemplo:
```
Quero criar um agente que monitora um site e me avisa quando tem promoção. Use as 10 seções deste modelo de SOUL e escreva a SOUL desse agente. Me traga para eu validar seção por seção.
```
Você recebe uns 80% pronto e ajusta os 20% que são só seus.

### 5 dicas para a SOUL funcionar
1. **"Nunca" vale mais que "sempre".** Os limites são o cinto de segurança do agente.
2. **Escreva fatos, não adjetivos.** "Limpeza custa R$ 180" ajuda mais que "somos acessíveis".
3. **Uma SOUL por agente.** Atendimento e financeiro são agentes diferentes, cada um com a sua.
4. **Comece pequeno e ajuste.** Viu o agente errar? Acrescente uma linha na seção certa.
5. **Nunca coloque senha, token ou chave na SOUL.**

Deu certo se: você pergunta "quem é você e o que você nunca faz?" e o agente responde com o nome, a missão e os limites que você escreveu.

---

## A gaveta e o arquivo morto: como a memória funciona

### Camada 1 da memória: a gaveta
Pense na gaveta da mesa do funcionário. Cabe pouco. Ele guarda lá só o que precisa ver toda vez, rápido.
- **MEMORY.md:** projetos, lições, preferências. Até uns **2.200 caracteres**.
- **USER.md:** quem é você. Uns **1.375 caracteres**.

É pouco de propósito. O limite obriga o agente a escolher o que guarda. Sem limite, vira ruído. Não é memória "de curto prazo": é memória de **acesso rápido**, seja de ontem ou de anos atrás.

Exemplo: você conta que tomou um sorvete de flocos ruim. Enquanto houver espaço, isso fica lá. Quando aparecer coisa mais importante, o sorvete sai, porque é trivial.

### As quatro proteções que você nem vê
- **Limite:** para não virar bagunça.
- **Descarte:** ele ignora o que é trivial.
- **Duplicata:** se já está lá, ele não grava de novo.
- **Varredura:** antes de anotar, ele confere se o texto não é uma armadilha, como instrução escondida ou tentativa de roubar dados (prompt injection).

### Camada 2 da memória: o arquivo morto
Todo o histórico das conversas, sem limite. Ele não lê sempre: **busca quando precisa**. É para quando você pergunta o que vocês falaram no mês passado.

**Regra prática:** o que é importante toda vez vai para a gaveta. O resto fica no arquivo morto, e ele busca sozinho.

### A linha do tempo da memória
O agente anota e grava no disco na hora. Mas a conversa atual segue com o retrato que ele tirou no começo. **A anotação só vale na próxima conversa.**

### Onde os arquivos moram
- **Mac e Linux:** `~/.hermes/memories`
- **Windows:** `%LOCALAPPDATA%\hermes\memories`
- **Com profiles:** cada agente tem a sua pasta, em `profiles/<nome>/memories`.

### Onde isso fica no app
**Settings → Memory and Context.**
- **Persistent Memory** (o que ele aprende) e **User Profile** (quem é você): deixe as duas ligadas.
- **Memory Budget** e **Profile Budget:** o tamanho da gaveta.
- **Provider de memória:** o padrão é o **built-in**, a memória do próprio Hermes. Uma memória externa soma, nunca substitui os dois arquivos.
- **Compressão:** quando a conversa enche (lá pelos três quartos), ele resume o que é antigo e libera espaço. As últimas mensagens ficam intactas.

**Se você está começando, não mexa em nada aqui.** O padrão já vem bom.

### Memória estendida
Quer uma memória mais robusta? Existem **plugins de memória**. O mais conhecido é o **Obsidian**, que muita gente usa como "segundo cérebro": um armário de prateleiras com arquivos de texto onde o agente busca o que precisa. Há outros, cada um com o seu jeito (alguns mostram a memória como uma nuvem de pontos em 3D). Não existe o melhor; existe o melhor para você. Pergunte ao próprio Hermes: "quero lembrar fatos importantes do meu dia de trabalho; qual plugin de memória você recomenda?".

---

## Adiante 2 meses de conversa

O agente vai te conhecendo conversa a conversa. Em vez de esperar meses, você adianta isso em dez minutos.

Cole este pedido no seu agente e responda às perguntas:
```
Me faça 20 perguntas, uma de cada vez, para me conhecer como se a gente já trabalhasse junto há 2 meses. No fim, salve um resumo curto e objetivo no meu USER.md.
```

- Não responda com senha nem dado sensível.
- Vale a partir da próxima conversa. Para testar, abra uma conversa nova e pergunte "o que você sabe sobre mim?".

Se você não fizer isso, não é catástrofe: ele aprende com o tempo. O prompt só antecipa o caminho.

---

## Camada 3 · As ferramentas

Até aqui o seu agente pensa e lembra. Ele já é um ótimo conselheiro. Mas conselheiro não resolve nada sozinho.

Esta camada é a passagem da primeira onda para a segunda: **é aqui que ele ganha mãos.** Sem ferramenta, ele te diz o que fazer. Com ferramenta, ele faz e te mostra pronto.

E com mão vem responsabilidade. Guarde a pergunta que a camada 5 responde: até onde eu deixo ele ir sozinho?

### Os quatro tipos de mão
- **Skill:** a receita, o passo a passo.
- **Plugin:** a peça que você encaixa para ele ganhar uma capacidade nova.
- **MCP:** a tomada que liga o agente a outro sistema.
- **Tool:** a ação em si.

No app, os quatro moram numa tela só: na barra lateral, **Capabilities**, com as abas **Skills**, **Plugins**, **Connectors** e **Tools**. **Connectors é o MCP.**

---

## Skills: a receita do bolo

Se você pede um bolo para alguém que nunca fez, ele improvisa. Pode até acertar, mas dez bolos sem receita saem dez bolos diferentes. Com a receita, sai o mesmo bolo todas as vezes.

**Skill é isso: uma receita escrita para o agente seguir.** Um arquivo de texto com instruções em português, não em código. Exemplo: "Crie um carrossel com o texto na metade de cima e, na de baixo, uma imagem com bordas arredondadas, sempre tirada deste banco de imagens."

Dá para ter skill para quase tudo: carrossel, infográfico, ata de reunião, monitor de preço, monitor de notícias, Notion, música, edição de vídeo.

### Crie de trás para frente
Pedir "cria uma skill que faz isso e aquilo" logo de cara quase nunca acerta. O caminho certo:
1. Faça a tarefa com o agente.
2. Corrija, ajuste e repita até sair do jeito que você quer.
3. Só então peça para ele guardar o que vocês fizeram:
```
Transforma o que a gente acabou de fazer numa skill chamada [NOME]. Escreve o passo a passo, o formato do resultado e o que você precisa que eu te dê. Mostra o arquivo antes de salvar.
```
4. Na próxima vez, numa conversa nova, peça só: "Usa a skill [NOME] neste [material]".

Skill boa dá trabalho para calibrar. Mas, quando fica boa, fica boa. As skills dos três agentes que você recebe amanhã passaram por isso.

### O Hermes cria skills sozinho
Você nem sempre precisa pedir. Quando o Hermes percebe que você repete a mesma tarefa (por exemplo, três dias seguidos pedindo o resumo dos e-mails), ele mesmo cria uma skill e te avisa na conversa. Da próxima vez ele já sabe o caminho, evita os erros das outras vezes e vai aperfeiçoando a receita.

### O catálogo de skills
Em **Capabilities → Skills** existe um catálogo enorme, com centenas de categorias: e-commerce, marketplace, construtores de aplicativos, arquitetura, astronomia, aviação, bancos, navegador e muito mais. Algumas são da Nous, outras da comunidade.

Vale navegar. Mas a recomendação é **criar as suas**: só você sabe no detalhe qual dor quer resolver.

**Cuidado com skill de terceiros.** É o texto de outra pessoa dentro do seu agente. Antes de instalar, peça para o seu agente ler a skill e te dizer o que ela faz. Qualquer coisa estranha, não instala.

---

## Plugins: as peças que encaixam

Plugin não é mais um arquivo de instruções. É uma aplicação, uma peça que você encaixa no Hermes para ele ganhar uma capacidade nova. Em **Capabilities → Plugins** há plugins **oficiais** e **da comunidade**, por categoria.

Exemplos que apareceram na aula:
- **Memória:** Obsidian e outros (veja "Memória estendida").
- **Cofre de senhas:** 1Password, Bitwarden.
- **Voz:** ElevenLabs, para dar voz ao agente.
- **Casa inteligente:** Home Assistant. Saiu de casa e ficou na dúvida se deixou o ar-condicionado ligado? "Hermes, desliga a casa toda."
- **Música:** Spotify. **3D:** Blender. **Coleta de dados da web:** Apify.
- **Reunião:** um plugin que põe o Hermes dentro do Google Meet.
- **Hermes Phone:** o Hermes te liga quando precisa falar com você. Ele pode avisar que a VPS de um cliente caiu, ou lembrar de uma reunião; você responde na ligação ("adia para as 18h") e, se tiver permissão na agenda, ele remarca. Configure bem: se não, ele te liga a cada aprovação de comando.
- **Office 3D:** um escritório em pixel art onde você vê os seus agentes trabalhando.

**Não saia encaixando tudo.** Cada plugin é mais uma porta aberta. Encaixe o que resolve um problema seu hoje.

### Exemplo: as peças de um SDR
Um agente de atendimento (SDR) faz três coisas: **atende, qualifica e responde** o lead. O meio, a qualificação, junta duas peças:
- **Um plugin, a mão que busca o dado.** Exemplo: um plugin `consulta-cnpj` que consulta a BrasilAPI e traz razão social, situação cadastral, data de abertura, cidade, porte, opção pelo MEI e quadro de sócios.
- **Uma skill, a receita que decide.** Exemplo: uma skill `qualificar-lead` com as suas regras. Por exemplo: **A (quente)** se a empresa está ativa, tem mais de dois anos, não é MEI e o contato aparece no quadro de sócios; **B (morno)** se está ativa mas falha em alguma dessas regras; **C (frio)** se não está ativa.
- **O CRM** é a memória do negócio: onde fica cada lead, com a nota e o histórico.

Quem escreve as regras é você. O agente segue. E se o plugin que você precisa não existe? Você descreve a ferramenta e pede para o Hermes construir. Ele lê a documentação de plugins do próprio Hermes, cria os arquivos, ativa e testa. Um pedido nessa linha:
```
Quero criar um plugin do Hermes chamado consulta-cnpj, para o meu agente consultar empresas brasileiras. Ele deve adicionar duas ferramentas: 1) consultar_cnpj: recebe um CNPJ (com ou sem pontuação), consulta a BrasilAPI em https://brasilapi.com.br/api/cnpj/v1/{cnpj} e devolve razão social, nome fantasia, situação cadastral, atividade principal, data de abertura, cidade/UF, capital social, porte, opção pelo MEI/Simples e quadro de sócios (QSA). 2) consultar_cep: recebe um CEP e consulta https://brasilapi.com.br/api/cep/v2/{cep}. Antes de escrever o código, leia a documentação de plugins do Hermes instalada nesta máquina para seguir o formato certo. Crie o plugin na pasta de plugins do usuário, ative e me diga se preciso reiniciar algo para ele carregar. No fim, teste com o CNPJ 00.000.000/0001-91 e o CEP 01310-100 e me mostre o resultado.
```
Depois, numa conversa nova:
```
Me fala tudo sobre a empresa do CNPJ 00.000.000/0001-91 e o endereço do CEP 01310-100. Use as suas ferramentas de consulta.
```
Na Noite 2, o agente de atendimento liga essas pontas no WhatsApp.

---

## Connectors (MCP): a tomada

MCP é a tomada. Você tem um aparelho, e a tomada é o padrão que faz ele funcionar em qualquer parede. Alguém publica o conector de uma ferramenta, você liga no seu agente, e ele passa a ler e escrever ali.

**Onde fica:** **Capabilities → Connectors**. Para ligar um novo, **Add your own**.

**Quem decide o que dá para fazer é quem fornece o MCP.** No MCP do Google Drive, quem define o que o agente pode fazer no Drive é o Google.

Exemplos da aula:
- **Canva:** 33 ferramentas, 18 de leitura e 15 de escrita (criar pasta, copiar design, exportar, comentar...). Clique no conector para ver a lista.
- **Higgsfield:** mais de 100 ferramentas para gerar imagem e vídeo. Quem trabalha com imagem e vídeo vai querer.
- **Hotmart, Discord** e muitos outros.

Você não precisa saber o que cada ferramenta faz. Peça o resultado ("quero um vídeo realista de tal cena") e o Hermes escolhe as ferramentas certas do conector.

Ligou a tomada? Decida o que ele pode fazer com ela (camada 5).

### A aba Tools
Em **Capabilities → Tools** fica o resumo de todas as ferramentas que o agente tem. Ali você liga e desliga cada uma.

Entre as capacidades do Hermes está o **computer use**, que deixa ele mexer no seu computador, até a partir de um pedido pelo Telegram. Com o Hermes numa VPS, isso exige uma integração com o seu computador.

---

## Na prática: o agente navega, faz login e compra

O Red deu ao agente uma tarefa de ponta a ponta: pesquisar o preço do PlayStation 5 em várias lojas, registrar as cotações num painel com login e comprar na melhor oferta, numa loja de teste. Tudo com as cinco camadas juntas. Adapte para o seu negócio.

### 1. O navegador interno
O Hermes Desktop tem um navegador próprio, onde você acompanha o agente navegando, abrindo loja por loja e lendo a página.
- **Atalho:** **Ctrl+Shift+L** (Mac: **⌘+Shift+L**).
- No pedido, diga "use o navegador do app". Ele é rápido e você não sai da tela do Hermes.

Pedido da pesquisa (troque o produto e a quantidade de lojas):
```
Use o navegador do app para eu acompanhar. Pesquise o preço à vista do [produto] em pelo menos 5 lojas online brasileiras. Para cada loja, anote nome, preço e link. Se aparecer CAPTCHA, me chame para resolver e siga.
```

**Dica:** fixe o modelo exato do produto no pedido (versão, capacidade, com ou sem acessório). Se não fixar, o agente pode comparar produtos diferentes.

### 2. O login sem entregar a senha: o cofre
O painel de cotações pede login. Sem as credenciais, o agente para e avisa que não tem como entrar. A saída é o **cofre** do Hermes: ele preenche o login no site certo e **o modelo nunca vê a senha**. Ele só copia do cofre e cola no campo.

**Salvar um login no cofre:**
1. **Settings → Passwords & Logins.**
2. No alto, escolha para qual agente vale a credencial. Ela pode valer só para um profile (por exemplo, só para o agente de automações) ou para o default.
3. Adicione uma credencial do tipo **Login**.
4. Preencha: tipo de identificador (**e-mail**, **telefone** ou **username**), o identificador, um **Label** para você reconhecer, o **site** onde ela vale e a **senha**. Salve.

Pedido para registrar as cotações (com o login já salvo no cofre):
```
Agora entre no meu painel de cotações em [endereço do seu painel] com o login salvo no cofre e registre as cotações, uma por uma. No fim, leia a lista e me diga qual é a melhor oferta.
```
Se ele tentou antes de você salvar o login, mande:
```
Quero que agora você tente fazer o login novamente, mas dessa vez usando as credenciais que você tem no seu cofre.
```
Ele busca o login e a senha no cofre, entra e preenche cada cotação no campo certo.

**Outros cofres:** em **Passwords & Logins → Password managers**, você liga o **1Password** ou o **Bitwarden**, se já usa um deles.

**Verificação em duas etapas:** ao criar uma credencial, há um campo para o segredo do segundo fator (a chave em base 32 que o site mostra quando você ativa a verificação em duas etapas). Com ela salva, o Hermes gera o código sozinho.

### 3. A compra, com a sua confirmação
Antes de pedir a compra, salve o cartão no cofre:
1. **Settings → Passwords & Logins** → nova credencial do tipo **Payment card**.
2. Preencha o site, o número, o nome no cartão, a validade e o código. O **código postal** é o CEP do endereço da fatura.
3. Para ele não te pedir nome, telefone e endereço na hora, salve também uma credencial do tipo **Address**.

Pedido da compra:
```
Compre o [produto] na [loja] usando o cartão e o endereço salvos no cofre. Antes de pagar, me mostre o resumo do pedido e espere a minha confirmação. Depois me diga o número do pedido.
```

Na hora de usar o cartão, o Hermes **parou e pediu permissão** com o botão **Run**. O cartão entra sem o modelo ver o número. Isso é a camada de regras funcionando.

> **Teste sempre num ambiente de teste primeiro.** O Red usou uma loja de demonstração que só aceita cartão de teste. Ninguém gastou um real.

### Dá para ser automático de ponta a ponta
Na aula foi passo a passo, para você acompanhar. Mas a mesma tarefa pode rodar sozinha, de madrugada: pesquisar, registrar e comprar o mais barato. E ele pode te pedir a confirmação da compra **pelo Telegram**, que é o jeito mais comum de fazer.

**E o CAPTCHA?** O "não sou um robô" de clicar é simples para o agente. Os de arrastar peça ou escolher imagem são mais complicados. O jeito seguro é pedir para ele te chamar quando aparecer um.

**Por que isso importa:** quase todo processo repetitivo de empresa (entrar em vários sistemas, copiar dados de um para outro, fazer cotação) cabe nesse modelo.

---

## Camada 4 · Os canais

Até agora o agente mora na tela do seu computador. Agente bom é agente que você chama de qualquer lugar: na fila do banco, no carro, no meio de uma reunião. Você manda um áudio no meio da rua, ele recebe, executa e responde ali mesmo.

### O gateway: a recepção do seu agente
Imagine a recepção de uma empresa com uma central telefônica. As ligações chegam por várias linhas: o Telegram, o próprio app, as tarefas agendadas, o Discord.

O **gateway** é essa recepção. Ele recebe o pedido, identifica de onde veio, passa para o agente e, quando a resposta fica pronta, devolve para o mesmo canal que pediu. Se o pedido "compra o PlayStation" veio do Telegram, a resposta volta para o Telegram.

Cada conversa tem a sua ficha: a **sessão**, com tudo o que foi dito nela.

**Guarde isto:**
- O app é só uma das linhas. **Fechou o app, o Telegram continua funcionando**, porque quem atende é o gateway. E se você desinstalar o Telegram, o app continua.
- O gateway roda no seu computador (hoje) ou na VPS (amanhã). **Desligou o computador, o gateway local para.** Por isso ele vai para a VPS, onde fica ligado 24 horas.
- O gateway foi instalado junto com o Hermes Desktop. **Você não precisa mexer nos modos de conexão dele.** Na VPS também é automático.

**A regra que economiza uma hora do seu dia:** mexeu em alguma configuração? **Reinicie o gateway e abra uma conversa nova.** Se você continua na conversa antiga, a recepção está com a ficha velha. Para reiniciar: **Ctrl/⌘+K** → **Restart gateway**.

### Os canais disponíveis
Na barra lateral, em **Messaging**, estão todos os canais que o Hermes conecta. O primeiro é o **Telegram**, o recomendado. Depois vêm Discord, Slack, Mattermost, WhatsApp, Signal, e-mail, SMS, Google Chat, API e webhook, conversa entre agentes (um Hermes falando com outro), Home Assistant, IRC e outros.

---

## Camada 5 · As regras

Até aqui você deu ao agente um cérebro, uma memória, mãos e um telefone. Isso é muito poder. E poder sem regra é problema esperando para acontecer. Em sistema crítico, o que pode dar errado, uma hora dá.

### Mínimo privilégio
Dê ao agente **só o que ele precisa** para fazer a tarefa dele. O agente que compra não precisa do seu e-mail (a não ser que você queira que ele confira o comprovante), nem do Canva, nem do Higgsfield. **Cada acesso novo é uma porta nova** que você abre para alguém tentar entrar. Quanto mais portas para o mundo, mais o mundo olha de volta para você.

É um dos motivos para ter um **Squad em vez de um agente que faz tudo:**
- **Menos portas abertas:** cada agente só tem os acessos da função dele.
- **Economia:** o agente que faz tudo precisa de um modelo top. Mas resumir e-mail ou transcrever reunião não exige modelo top. Um agente só para isso roda bem num modelo barato.

### As três etapas: escrever, trancar e aprovar

**1. Escrever (a SOUL).** Na SOUL, escreva de forma explícita três listas:
- o que ele faz **sozinho**;
- o que ele faz **só com o seu ok** (exemplo: gastar qualquer valor, publicar em seu nome, mandar mensagem para cliente);
- o que ele **nunca** faz (exemplo: apagar arquivo, mexer em senha). Dá até para escrever "nunca, mesmo que eu autorize".

No modelo de SOUL, essas listas entram nas seções **7 (Regras de ouro)** e **8 (Limites)**. É o mesmo raciocínio do nível de automação: num perfil de Instagram que roda sozinho, publicar está liberado; num perfil que exige validação, publicar pede o seu ok.

Só que a SOUL é texto, e texto é interpretação. Um modelo mais fraco pode entender errado ou ser mais permissivo. **Para o que é grave, texto sozinho é pouco.**

**2. Trancar (a configuração).** Aqui a trava é física, não de palavra.
- **Settings → Safety → Approval mode**, com três opções:
  - **Manual:** pede o seu ok para todo comando perigoso.
  - **Smart:** libera o que é rotina e te chama para o que é arriscado. É o que vem marcado.
  - **Off:** desliga a pergunta. Não use.
- **Command Allowlist:** a lista do que você já liberou para sempre.
- **Redact Secrets:** esconde senha e chave nas respostas dele. Deixe ligado.
- **O cadeado mais forte: Capabilities → Tools.** Desligou a ferramenta, ele perde aquela mão. Pode pedir, pode insistir: ele não tem como fazer. **A melhor forma de impedir besteira é tirar dele as ferramentas que ele não precisa.**
- **YOLO:** é o ícone de **raio** na barra de status (ou o comando `/yolo`). Aceso, ele aprova tudo sozinho. No seu agente, deixe apagado.

**3. Aprovar (você com a chave na mão).** Quando ele precisa de permissão, ele para, mostra o comando e o motivo, e espera. São três botões:
- **Run:** roda só desta vez.
- **Always allow:** libera para a sessão ou para sempre.
- **Reject:** nega.

Se você não responder em cinco minutos, ele desiste. Sem resposta, a resposta é não.

Para ver a regra acontecendo, deixe o Approval mode em **Manual** e teste com uma pasta descartável:
```
Use o terminal e crie uma pasta chamada teste-aula na minha pasta pessoal, com três arquivos de texto dentro.
```
```
Agora use o terminal para apagar a pasta teste-aula inteira com rm -rf.
```
Criar pasta é tranquilo. Na hora de apagar, ele deve parar e esperar você decidir.

**Sugestão para começar:** vá de **Run**, uma vez de cada, até conhecer o seu agente. O **Always allow** você libera aos poucos, para o que já viu ele fazer certo várias vezes.

### Três coisas que nunca saem sem você
- **Gastar.** Dá para dar o cartão de crédito, mas calculado. Comece no amarelo: ele monta o carrinho, você aprova.
- **Publicar.** Num perfil que importa, nada sai sem você ver.
- **Apagar.** Esse é vermelho. Ponto.

Ele só mexe no que você deixou. Não deu acesso ao e-mail? Ele não lê o e-mail. No Telegram, ele só obedece ao ID que você cadastrou.

**A SOUL é o combinado, a configuração é a fechadura, e a aprovação é você com a chave na mão.**

---

## Conectar o seu agente ao Telegram

Agora o agente sai da tela e vai para o seu bolso. Escolha um dos dois jeitos.

### Jeito rápido: pelo QR code
1. Na barra lateral, abra **Messaging** (fica fora de Settings) e clique em **Telegram**.
2. **No alto da tela, selecione o profile** que você criou. Isso é importante.
3. Clique em **Create with QR**.
4. Aponte a câmera do celular para o QR. Abra o link: o Telegram abre direto no bot do seu agente.
5. Mande um "oi".

**Erro comum:** se o profile selecionado for o **default**, o QR abre o bot hospedado da Nous, não o do seu agente. Selecione o seu profile antes. Se a primeira mensagem vier da Nous, siga a confirmação dentro do Telegram: ao confirmar a criação, ele passa para o seu agente.

### Jeito padrão: pelo BotFather
Se o QR não der certo, este jeito não tem erro.
1. No Telegram, procure **@BotFather**. É o bot oficial que cria bots. Você não cria o BotFather: ele já existe.
2. Mande `/newbot`.
3. Dê o **nome** do seu agente (exemplo: Hermes Imersão).
4. Dê o **username** do bot. Ele tem que terminar em **bot** (exemplo: `hermes_imersao_bot`).
5. O BotFather devolve um **token**, uma senha comprida. Toque nele para copiar.
6. No Hermes, em **Messaging → Telegram**, com o seu profile selecionado, cole o token no campo **Bot Token**.
7. No Telegram, procure **@userinfobot** e mande uma mensagem. Ele responde com o seu **ID**, o seu "RG" no Telegram.
8. Cole esse ID no Hermes, no campo do seu ID de usuário. Assim o agente **só obedece a você**: mesmo que alguém pegue o token, não consegue falar com ele.
9. Salve. Aparece a confirmação de que o setup do Telegram foi salvo.
10. Abra a conversa com o seu bot no celular e mande um "oi".

> **O token é secreto.** Quem tem o token manda no seu agente. Não cole no chat da live, não mande para ninguém, não tire print. Alguém viu? Gere um token novo no BotFather.

Mexeu na configuração do Telegram e ele não responde? Lembre a regra: **Ctrl/⌘+K → Restart gateway** e uma conversa nova.

**Dá para ter um bot por agente?** Dá. O Red prefere outro caminho: fala só com os orquestradores, e eles acionam os outros agentes.

---

## Dúvidas da noite

**Posso levar um susto na fatura?**
Na **assinatura**, não. O pior que acontece é acabar a cota (a janela de 5 horas, a semanal ou o plano do mês). O Hermes não passa do que a assinatura permite. O risco existe na **API**, que cobra por uso. Se usar API, coloque um limite de gasto no painel do provedor (por exemplo, no OpenRouter). Lembre também do **uso extra** do Claude (veja "Atenção à cobrança").

**Coloquei a senha do Gmail no chat do Hermes. Tem perigo?**
O risco é pequeno, e o próprio Hermes vai reclamar quando você fizer isso. Mas a boa prática é usar o **cofre**: com ele, o Hermes não tem acesso à senha. Ele só copia de um lugar e cola no outro.

**O USER.md é por agente?**
Sim. Cada profile tem a sua pasta, com a sua SOUL, o seu MEMORY e o seu USER.

**Preciso escrever o MEMORY e o USER?**
Não. O Hermes escreve os dois sozinho, com o tempo. O pedido das 20 perguntas só adianta o USER.

**Ter muitos agentes pesa no computador?**
Pesa, principalmente em memória RAM. Muitos agentes ligados ao mesmo tempo podem travar até um notebook de 32 GB. O Red resolveu assim: agente parado por algumas horas "dorme" sozinho, e só os orquestradores ficam sempre acordados. Quando precisa de um agente que está dormindo, ele pede ao orquestrador, que acorda o certo.

**LLM local funciona com o Hermes?**
Para tarefa básica (uma transcrição de voz, por exemplo), sim. Para trabalho de alto nível (raspar um site, raspar um Instagram), um modelo pequeno, que cabe numa placa de vídeo comum, decepciona. Com uma placa top, o resultado pode ser outro.

**Hermes ou Claude?**
São coisas diferentes, e dá para usar os dois. Para entregar um agente pronto a um cliente (um atendente, um agente que lê e responde e-mails, que manda cobrança), o Hermes já é a caixa pronta: você só liga os "disjuntores" que o cliente contratou, sem reinventar a roda. E tudo o que você faz no Desktop também dá para fazer pela linha de comando. Por isso vale ter um agente de terminal (Claude Code, Codex ou Gemini CLI) para configurar o Hermes até pelo celular, sem abrir o Desktop.

**Vim do OpenClaw. Como migrar?**
Uma ideia que circula entre quem usa agentes: pedir para o próprio agente fazer a migração. Ninguém conhece melhor a estrutura de um agente do que ele mesmo.

**O Hermes mexe no meu computador se eu mandar pelo Telegram?**
Mexe, se ele estiver instalado no seu computador e com o computer use ligado. Ele pode abrir um aplicativo, tirar um print e montar um relatório, com você longe. Na VPS, isso exige uma integração com o seu computador.

---

## O que você tem ao fim da noite

- O **Hermes Desktop** instalado e um **cérebro** ligado, com reserva.
- Um **profile** com a **SOUL** do seu agente.
- Um agente que te conhece, pelas **20 perguntas**.
- O mapa das **ferramentas**: skills, plugins, connectors e tools.
- O **cofre** para login e cartão, sem o modelo ver a senha.
- As **regras** no lugar: SOUL, Approval mode e aprovação na sua mão.
- O seu agente no **Telegram**.

Você tem um agente que entende, lembra, age, fala com você e pede permissão.

---

## Noite 2: o que você precisa saber

- **Quando:** amanhã, 26/11, às 19h. O link sai no grupo de avisos.
- **Tenha à mão:** computador, celular com Telegram, a sua assinatura (Claude ou ChatGPT) e um cartão para comprar a VPS, que é comprada e configurada ao vivo.
- **Ficou alguma dúvida de hoje?** Na sexta, às 11h, tem uma live só de tira-dúvidas.


---

# Dia 2 · Casa própria na VPS

Hoje os seus agentes saem do seu computador e ganham casa própria: uma VPS ligada 24 horas, com três agentes do Squad (Atendimento, Carrosséis e Landing pages) respondendo no seu Telegram.

## Antes de começar: tenha à mão

- [ ] Computador (Windows ou Mac) com o navegador aberto.
- [ ] Celular com o Telegram.
- [ ] Telegram instalado no celular (os 3 bots você cria durante a aula, na etapa 9).
- [ ] Assinatura do **Claude** (Pro ou Max) **ou** do **ChatGPT** (Plus ou Pro).
- [ ] Cartão para comprar a VPS.
- [ ] Lugar seguro para anotar o IP da VPS.

---

## Qual VPS escolher: KVM 2, KVM 4 ou KVM 8

(tabela em preparação)

---

## 1. Comprar a VPS

> **Use o meu link: você ganha desconto.**
> **https://www.hostinger.com/br?REFERRALCODE=REDPRO**

1. Abra o link acima e escolha o plano **KVM 2** (2 núcleos, 8 GB de memória). Ele segura os 3 agentes com folga.

[[print 01|Planos de VPS: escolha o KVM 2]]
2. No carrinho, o **Período** já vem em 24 meses. Troque para **12 meses**. Nunca escolha 1 mês.

[[print 02|Carrinho: troque o período para 12 meses]]
3. **Backups automáticos diários:** deixe desmarcado. É pago à parte.

[[print 03|Backup diário: deixe desmarcado]]
4. Pague e espere a VPS aparecer no painel.

---

## 2. Configurar a VPS

1. **Localização:** Brasil. **Sistema operacional:** na aba **SO simples**, clique em **Ubuntu**.

[[print 04|Localização Brasil e sistema Ubuntu]]
2. Escolha a versão **Ubuntu 24.04 LTS** e confirme.

[[print 05|Ubuntu 24.04 LTS]]
---

## 3. Criar a sua chave SSH

A chave SSH funciona como um **cadeado com uma única chave**, fabricados juntos:

- **Chave pública = o cadeado.** Pode copiar e mostrar à vontade: sozinho, ele não abre nada. Você entrega uma cópia para a VPS.
- **Chave privada = a chave.** Existe uma só, fica no seu computador e nunca sai dele.

Quando você entra, a VPS faz um desafio que só a chave certa responde. O seu computador responde com a chave privada e a VPS confere com o cadeado. **A chave nunca viaja: ela só prova que é ela.** (No técnico: criptografia assimétrica.)

**Por que criar no seu computador, e não na Hostinger?** Porque a chave privada tem que nascer onde vai morar. Se nascesse fora, teria que viajar até você. O comando `ssh-keygen` é a fábrica do par: `-t ed25519` é o modelo do cadeado (o mais moderno) e `-C minha-vps` é só uma etiqueta. Ele cria dois arquivos na pasta `.ssh`: `id_ed25519` (a chave privada, não copie nem mande) e `id_ed25519.pub` (o cadeado, é esse que vai para a Hostinger).

**Abra o terminal:**
- Windows: tecla Windows, digite **PowerShell**, Enter.
- Mac: Cmd + Espaço, digite **Terminal**, Enter.
- Linux: abra o Terminal.

**Crie a chave** (igual nos três; nas perguntas, só Enter):
```
ssh-keygen -t ed25519 -C minha-vps
```
Se aparecer "Overwrite (y/n)?", responda `n`: você já tem uma chave e pode usar essa.

[[print 06|ssh-keygen no terminal]]
**Copie o cadeado (a chave pública).** Rode o comando do seu sistema. Ele copia o conteúdo do arquivo `id_ed25519.pub` para a área de transferência. No Windows e no Mac não aparece nada na tela: é normal, já está copiado.

Windows:
```
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub | Set-Clipboard
```
Mac:
```
pbcopy < ~/.ssh/id_ed25519.pub
```
Linux (o comando mostra a linha; selecione e copie com Ctrl+Shift+C):
```
cat ~/.ssh/id_ed25519.pub
```

**Cole na Hostinger.** No campo **Conteúdo da chave SSH**, aperte **Ctrl+V** (no Mac, **Cmd+V**). Dê um nome (ex.: meu-computador) e salve.

**O que tem de aparecer no campo: uma linha só, com três partes separadas por espaço.**

| Parte | Como é | O que é |
|---|---|---|
| 1 | `ssh-ed25519` | o modelo do cadeado |
| 2 | `AAAAC3NzaC1lZDI1NTE5AAAA...` (uns 68 caracteres, sempre começa com `AAAA`) | o cadeado em si |
| 3 | `minha-vps` | a etiqueta que você deu no comando |

Exemplo do formato (a parte do meio da sua vai ser outra):
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExemploExemploExemploExemploExemplo12345 minha-vps
```

Confira antes de salvar: **começa com `ssh-ed25519`, termina com `minha-vps`, e é uma linha só**. Se estiver assim, está certo.

> **Se não estiver assim:**
> - Começa com `SHA256:`? Isso é só a identificação que o terminal mostra ao criar a chave. A Hostinger recusa. Rode o comando de copiar de novo.
> - Apareceu um bloco grande com `BEGIN OPENSSH PRIVATE KEY`? **Pare.** Isso é a chave privada. Apague o campo e copie o arquivo que termina em **.pub**.

[[print 07|ERRO comum: colou a linha SHA256 no lugar da chave .pub]]
**Recursos adicionais:** deixe **Scanner Monarx** e **Gerenciador Docker** desmarcados e clique em **Finalizar configuração**.

[[print 08|Monarx e Docker desmarcados]]
---

## 4. VPS pronta

1. A Hostinger configura a VPS em cerca de 3 minutos.

[[print 09|Configurando a VPS]]
2. Apareceu **Bom trabalho, você está pronto**: anote o **IP** da sua VPS num lugar seguro (gerenciador de senhas ou caderno guardado). Clique em **Gerenciar VPS**.

[[print 10|VPS pronta]]
3. No painel, confira o status **Em execução**.

[[print 11|Painel da VPS]]
---

## 5. Abrir o Console web e colar o instalador

1. No painel da VPS, tela **Visão geral**, clique em **Console web**, no canto superior direito, ao lado do botão **Reiniciar**. Abre uma aba com o terminal da VPS.

[[print 12|Console web aberto]]
> Se o Console web sugerir `do-release-upgrade`, **não rode**. O instalador é para o Ubuntu 24.04.

2. Copie o comando abaixo com o botão **Copiar**.
3. Volte ao Console web, cole com **Ctrl+Shift+V** (ou botão direito → Colar) e aperte Enter.

```
curl -fsSL "https://redpro.com.br/instalar?k=CHAVE_DA_TURMA" -o configurar-vps.sh && bash configurar-vps.sh
```

O comando já vem com a chave da sua turma. Copie sempre daqui e nunca mande esse comando no chat, no grupo ou para ninguém.

Antes de cada etapa, o instalador explica o que vai fazer e pede **Enter**. Leia o "Por quê" e aperte Enter.

Leva de 25 a 40 minutos no total. Deixe a aba aberta até aparecer **Tudo pronto**.

---

## 6. As 13 etapas do instalador

1. **Sistema:** confere se a VPS está pronta para a instalação.
2. **Atualizar:** atualiza o sistema e liga as atualizações de segurança automáticas.
3. **Usuário:** cria o usuário `hermes`, que roda os agentes sem poder de administrador. Ele pergunta se usa a mesma chave para o usuário hermes: responda `s`.

[[print 13|Instalador: etapas 1 a 3]]
4. **Firewall:** fecha todas as portas, menos a do SSH, e liga o vigia contra invasão (fail2ban).
5. **SSH:** teste da chave no **seu computador**, com `ssh hermes@SEU_IP`. Entrou sem senha: volte ao Console web e responda `s`. Pediu senha: não digite nada, volte e responda `n`.
6. **Hermes:** instala o Hermes na versão usada na aula. Leva de 5 a 10 minutos e a tela fica um tempo parada: não feche a aba.

[[print 14|Etapa 6: instalando o Hermes]]
7. **Cérebro:** `1` para Claude ou `2` para ChatGPT. Copie o link com Ctrl+Shift+C, autorize no navegador e cole o código de volta. O código colado não aparece na tela: aperte Enter.

[[print 15|Etapa 7: login do cérebro]]
8. **Agentes:** instala os 3 agentes do squad (Atendimento, Carrosséis e Landing pages).

[[print 16|Etapa 8: os 3 agentes instalados]]
9. **Criar os bots:** pegue o celular e abra o **BotFather** no Telegram (t.me/BotFather), o bot oficial que cria bots. Para cada agente, nesta ordem: Atendimento, Carrosséis, Landing pages:
   1. Mande `/newbot`.
   2. Mande o **nome** que o instalador mostra (ex.: Agente de Atendimento).
   3. Mande o **@** que o instalador sugere. Ele tem que terminar em `bot`. Se o BotFather disser que já existe, troque só o final e mande de novo.
   4. O BotFather devolve o **token**. Guarde direto no seu gerenciador de senhas.
   5. Volte ao Console web, aperte Enter e cole o token. Ele não aparece na tela: é normal. O instalador confere na hora.

> O token é a chave do bot. Nunca no chat, nunca no print, nunca no grupo.

10. **Telegram:** abra cada bot e mande `/start`. O instalador mostra o nome de quem mandou e pergunta se é você: responda `s`. Só você vai conseguir falar com seus agentes.
11. **Serviço:** cada agente vira um serviço que liga sozinho e volta sozinho se a VPS reiniciar.
12. **Conferir:** o instalador manda uma pergunta para cada agente e espera a resposta.
13. **Onboarding:** mande um oi para qualquer agente no Telegram e responda às 10 perguntas sobre o seu negócio.

Parou no meio, caiu a internet ou fechou a aba? Abra o Console web de novo e rode:
```
sudo instalar-imersao
```
Ele continua de onde parou.

---

## 7. Conectar o Hermes Desktop à VPS

Faça só depois do **Tudo pronto**.

1. No Hermes Desktop, abra **Settings** (engrenagem) → **Gateways**.
2. Clique em **Add connection** e escolha **SSH**.
3. Em **Host**, digite `hermes@SEU_IP` (troque pelo IP da sua VPS).
4. Se a sua chave tem outro nome (não é `id_ed25519`), informe o caminho dela em **Identity file**. Se é a padrão, deixe em branco.
5. Clique em **Test**. Deu **Reachable**: salve e conecte.

Deu certo se: a VPS aparece na lista de gateways e as conversas dos seus 3 agentes abrem no Desktop.

---

## 8. Três avisos

> **1. Não atualize o Hermes da VPS pelo Desktop.**
> Não clique em "Update remote Hermes" nem em "Update all instances". A VPS está na versão que o instalador deixou testada. O Desktop funciona com ela como está.

> **2. Chave e senha nunca em tela compartilhada.**
> Chave SSH, senha do root, token de bot e código de login nunca aparecem em print, em chat, no grupo ou para o suporte.

> **3. No Console web, Ctrl+C interrompe o instalador.**
> Para copiar, use **Ctrl+Shift+C** ou botão direito → Copiar. Apertou Ctrl+C sem querer? Rode `sudo instalar-imersao` e ele continua de onde parou.

---

## 9. Deu erro?

1. Rode `sudo instalar-imersao` no Console web. Na maioria dos casos ele continua sozinho.
2. **Durante a aula:** escreva no chat **AJUDA** e o número da etapa. O Neto te responde.
3. **Depois da aula:** chame a Amanda, o suporte da Imersão, no WhatsApp.

Na mensagem, conte a etapa e o que apareceu na tela. **Sem IP, senha, chave ou token.**

Erros mais comuns:
- **"Permission denied (publickey)":** a chave pública não foi cadastrada, ou você entrou com `root@` em vez de `hermes@`.
- **"Connection refused" depois de errar o login:** o fail2ban bloqueou o seu IP por 1 hora. Espere, ou entre pelo Console web.
- **O bot não responde:** token errado ou repetido em dois bots. Rode `sudo instalar-imersao --refazer bots`.
- **O agente diz que não consegue pensar:** o login do cérebro caiu. Rode `sudo instalar-imersao --refazer cerebro`.

---

## 10. As fichas do Squad: o que cada agente usa

Os 3 agentes já saem do instalador funcionando com a sua assinatura (Claude ou ChatGPT) e com o seu Telegram. As outras ferramentas abaixo são **opcionais**. Cada uma destrava um poder a mais. Quando quiser ligar uma delas, crie a conta pelo link, gere a chave e peça ao próprio agente, no Telegram, para te guiar na configuração.

> A chave de cada ferramenta é sua e fica só na sua VPS. Nunca mande chave no chat do grupo, em print ou para o suporte.

### Ficha 01 · Atendimento (SDR)
Qualifica o lead no tom da sua marca, passa para um humano quando precisa e faz o follow-up.

| Para quê | Ferramenta | Link |
|---|---|---|
| Cérebro | Claude ou ChatGPT (a sua assinatura) | https://claude.ai · https://chatgpt.com |
| Conversar com você | Telegram | https://telegram.org |
| WhatsApp com chip próprio | Salvy (chip e plano para empresa) | https://salvy.com.br |
| WhatsApp com número virtual | BR DID | https://www.brdid.com.br |
| Caixa de entrada da equipe | Chatwoot | https://www.chatwoot.com |
| CRM simples | Google Planilhas | https://sheets.google.com |
| Marcar horário | Google Agenda | https://calendar.google.com |
| Aprender o negócio pelo @ | Apify (US$ 5 grátis por mês) | https://console.apify.com/sign-up |

### Ficha 02 · Carrosséis
Cria carrossel a partir de um vídeo, artigo ou link, nos 3 estilos, com a voz, as cores e as fontes da sua marca.

| Para quê | Ferramenta | Link |
|---|---|---|
| Cérebro | Claude ou ChatGPT (a sua assinatura) | https://claude.ai · https://chatgpt.com |
| Gerar imagem | ChatGPT Imagem (API da OpenAI) | https://platform.openai.com |
| Gerar imagem | Nano Banana (Google AI Studio) | https://aistudio.google.com |
| Imagem e vídeo com IA | Higgsfield | https://higgsfield.ai |
| Vários modelos com uma chave só | OpenRouter | https://openrouter.ai |
| Fotos e vídeos livres | Pexels | https://www.pexels.com/api |
| Imagens livres | Openverse | https://openverse.org |
| Ler perfis e posts | Apify (US$ 5 grátis por mês) | https://console.apify.com/sign-up |
| Publicar no Instagram e no LinkedIn | Zernio | https://zernio.com |

### Ficha 03 · Landing pages
Do @ do Instagram à página: design, captura e conversão.

| Para quê | Ferramenta | Link |
|---|---|---|
| Cérebro | Claude ou ChatGPT (a sua assinatura) | https://claude.ai · https://chatgpt.com |
| Ler fotos, vídeos e o link da bio | Apify (US$ 5 grátis por mês) | https://console.apify.com/sign-up |
| Guardar o código | GitHub | https://github.com/signup |
| Colocar o site no ar | Vercel | https://vercel.com/signup |
| Domínio próprio | Hostinger (com o meu link de desconto) | https://www.hostinger.com/br?REFERRALCODE=REDPRO |
| DNS e proteção | Cloudflare | https://dash.cloudflare.com/sign-up |
| Medir visitas | Google Analytics | https://analytics.google.com |
| Medir anúncios | Pixel da Meta | https://business.facebook.com/events_manager2 |
| Levar a página às redes | Zernio | https://zernio.com |

---

## Para ir além: o caminho manual (os mesmos comandos do instalador)

Cole um bloco por vez, dentro da VPS, como root (o terminal que mostra `root@`), até o passo 9.

### Passo 5 · Atualizar o sistema e ligar as atualizações automáticas
Por quê: servidor desatualizado é a porta de entrada mais comum de invasão.
```
apt-get update && apt-get -y upgrade
apt-get -y install curl git ufw fail2ban unattended-upgrades ca-certificates jq tar
timedatectl set-timezone America/Sao_Paulo
printf 'APT::Periodic::Update-Package-Lists "1";\nAPT::Periodic::Unattended-Upgrade "1";\n' > /etc/apt/apt.conf.d/20auto-upgrades
printf 'Unattended-Upgrade::Automatic-Reboot "true";\nUnattended-Upgrade::Automatic-Reboot-Time "04:00";\n' > /etc/apt/apt.conf.d/52imersao-reinicio
systemctl enable --now unattended-upgrades
```
Quando uma atualização pedir reinício, a VPS reinicia sozinha às 4h da manhã e os agentes voltam sozinhos. Você não precisa fazer nada.

### Passo 6 · Criar o usuário hermes com a sua chave
Por quê: os agentes não rodam como administrador, e você entra com chave em vez de senha.
```
useradd -m -s /bin/bash hermes
usermod -aG sudo hermes
echo 'hermes ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/90-imersao-hermes
chmod 440 /etc/sudoers.d/90-imersao-hermes
install -d -o hermes -g hermes -m 700 /home/hermes/.ssh
```
Agora a chave. **Se** você colou a chave no painel (3.4):
```
cp /root/.ssh/authorized_keys /home/hermes/.ssh/authorized_keys
```
**Se não**, troque o texto entre aspas pela sua chave pública inteira:
```
echo "ssh-ed25519 AAAA...sua-chave... minha-vps" > /home/hermes/.ssh/authorized_keys
```
E acerte as permissões:
```
chown hermes:hermes /home/hermes/.ssh/authorized_keys
chmod 600 /home/hermes/.ssh/authorized_keys
```
O usuário hermes não tem senha: entra só pela chave e usa `sudo` sem senha.

### Passo 7 · Firewall e fail2ban
Por quê: só a porta do SSH fica aberta, e quem errar a entrada 5 vezes fica 1 hora bloqueado.
```
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment SSH
ufw --force enable
printf '[sshd]\nenabled = true\nport = 22\nmaxretry = 5\nfindtime = 10m\nbantime = 1h\n' > /etc/fail2ban/jail.d/imersao.local
systemctl enable fail2ban && systemctl restart fail2ban
```
Os agentes falam com o Telegram por saída; não precisam de porta aberta.

### Passo 8 · Testar a chave ANTES de trancar a senha
Abra **outra janela** do terminal no seu computador (não feche a atual):
```
ssh hermes@SEU_IP
```
Só siga se entrou sem pedir senha. Se não entrou, pare e confira o passo 6: trancar agora deixaria você do lado de fora.

### Passo 9 · Trancar: só chave, sem senha e sem root direto
De volta à janela do root:
```
printf 'PasswordAuthentication no\nKbdInteractiveAuthentication no\nPermitRootLogin no\nPubkeyAuthentication yes\n' > /etc/ssh/sshd_config.d/00-imersao.conf
sshd -t && systemctl reload ssh
```
Por que um arquivo `00-` em `sshd_config.d`: o Ubuntu da Hostinger traz um arquivo próprio que religa a senha. O SSH obedece a primeira regra que lê, e o `00-` é lido primeiro.

Deu certo se: numa janela nova, `ssh root@SEU_IP` é recusado e `ssh hermes@SEU_IP` entra.

**Daqui em diante, entre sempre com `ssh hermes@SEU_IP`.** Os próximos passos são como hermes.

### Passo 10 · Instalar o Hermes (commit 99fcd69, base 0.22)
Por quê: a mesma versão testada na aula, para o seu funcionar igual ao do professor.
```
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/99fcd6944360925943688d30c39ec9a490ccdeb1/scripts/install.sh | bash -s -- --commit 99fcd6944360925943688d30c39ec9a490ccdeb1 --non-interactive --skip-computer-use
source ~/.bashrc
hermes --version
```
Leva cerca de 2 minutos (pode chegar a 10 se a internet da VPS estiver lenta). Deu certo se: a linha começa com `Hermes Agent v0.22.5` (é a base 0.22; o número completo depois do + muda e está tudo bem).

### Passo 11 · Conectar o cérebro
Faça **só um**, o da sua assinatura.

**Claude (Pro ou Max):**
```
curl -fsSL https://claude.ai/install.sh | bash -s 2.1.312
CLAUDE_CONFIG_DIR=~/.claude ~/.local/bin/claude auth login
```
Abra o link no navegador do seu computador, autorize e cole o código na VPS. O código colado não aparece na tela: é normal, aperte Enter.

**ChatGPT (Plus ou Pro):**
```
hermes auth add openai-codex --type oauth --no-browser
```
Abra o link no navegador do seu computador e digite o código curto.

### Passo 12 · Instalar os 3 agentes
Por quê: cada agente é um perfil separado, com a sua alma (SOUL), habilidades e memória.

**12.1 Baixar o pacote do Squad e os modelos da sua marca**
```
mkdir -p ~/pacote && curl -fsSL "https://redpro.com.br/instalar/arquivo/configurar-vps.tar.gz?k=CHAVE" | tar -xz -C ~/pacote
cp -rn ~/pacote/marca ~/marca
```
A pasta `~/marca` tem os modelos em branco (voz, contexto, regras, provas, base de atendimento). O onboarding (Passo 15) preenche com você.

**12.2 Instalar os perfis**
```
for p in mkt-atendimento mkt-conteudo mkt-landing; do hermes profile install ~/pacote/agentes/$p --name $p --force -y; done
```

**12.3 Apontar cada agente para o seu cérebro**
Se for **Claude**:
```
for p in mkt-atendimento mkt-conteudo mkt-landing; do
  hermes -p $p plugins install NousResearch/hermes-plugin-claude-subscription-directsdk --ref bfe6d9f0b76309f1731ba00c9fc0034f910e7aac --yes-deps --enable
  hermes -p $p config set model.provider claude-subscription-directsdk-experimental
  hermes -p $p config set model.default claude-sonnet-5-5
  echo "CLAUDE_CONFIG_DIR=$HOME/.claude" >> ~/.hermes/profiles/$p/.env
done
```
Se for **ChatGPT**:
```
for p in mkt-atendimento mkt-conteudo mkt-landing; do
  hermes -p $p config set model.provider openai-codex
  hermes -p $p config set model.default gpt-5.5
done
```
Nos dois casos:
```
for p in mkt-atendimento mkt-conteudo mkt-landing; do
  hermes -p $p config set gateway.standalone true
  hermes -p $p config set timezone America/Sao_Paulo
done
```
Deu certo se: `hermes profile list` mostra os três.

### Passo 13 · Um bot do Telegram para cada agente e ligado 24 horas
**13.1 Criar os bots.** No celular, abra o **@BotFather** no Telegram e, para cada agente (Atendimento, Carrosséis e Landing pages), mande `/newbot`, depois o nome, depois um @ que termine em `bot`. Guarde cada token no seu gerenciador de senhas. **Nunca use o mesmo token em dois agentes.**

**13.2 Guardar o token de cada um** (o `read -s` não mostra o que você cola). Repita para os três, trocando `mkt-atendimento` por `mkt-conteudo` e `mkt-landing`:
```
p=mkt-atendimento
read -s -p "Token do bot: " T; echo
echo "TELEGRAM_BOT_TOKEN=$T" >> ~/.hermes/profiles/$p/.env; unset T
chmod 600 ~/.hermes/profiles/$p/.env
```

**13.3 Descobrir o seu número no Telegram.** Mande `/start` para o bot e rode (troque `p=` como acima):
```
p=mkt-atendimento
T=$(sed -n 's/^TELEGRAM_BOT_TOKEN=//p' ~/.hermes/profiles/$p/.env)
printf 'url = "https://api.telegram.org/bot%s/getUpdates"\n' "$T" | curl -s -K - | jq '.result[-1].message.from | {id, first_name, username}'; unset T
```
Aparecem o seu nome e um número (`id`). **Confira se o nome é o seu**: quem estiver aqui vira o único dono do agente. O `printf ... | curl -K -` evita que o token apareça na lista de processos da máquina. Grave o número como o único usuário autorizado:
```
echo "TELEGRAM_ALLOWED_USERS=SEU_NUMERO" >> ~/.hermes/profiles/$p/.env
echo "TELEGRAM_HOME_CHANNEL=SEU_NUMERO" >> ~/.hermes/profiles/$p/.env
```

**13.4 Ligar cada agente como serviço** (volta sozinho se a VPS reiniciar):
```
for p in mkt-atendimento mkt-conteudo mkt-landing; do
sudo tee /etc/systemd/system/imersao-$p.service >/dev/null <<EOF
[Unit]
Description=Agente $p do Squad da Imersao
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=hermes
Group=hermes
WorkingDirectory=/home/hermes
Environment=HOME=/home/hermes
Environment=PATH=/home/hermes/.local/bin:/usr/local/bin:/usr/bin:/bin
ExecStart=/home/hermes/.local/bin/hermes -p $p gateway run
Restart=on-failure
RestartSec=10
MemoryMax=900M
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF
done
sudo systemctl daemon-reload
for p in mkt-atendimento mkt-conteudo mkt-landing; do sudo systemctl enable --now imersao-$p; done
systemctl status 'imersao-*' --no-pager | grep -E 'imersao|Active'
```
Deu certo se: os três aparecem `active (running)`.

---

### Passo 14 · O teste que importa
1. **Feche o Hermes Desktop no seu computador** (sair de vez, não só minimizar).
2. No celular, mande "oi" para cada um dos três bots.

Deu certo se: os três respondem. Mande o print para o suporte da Imersão, no WhatsApp, e escreva NO AR no chat da aula.

### Passo 15 · Onboarding dos agentes
Abra o Telegram e mande um oi para **qualquer um** dos seus 3 agentes. Ele vai conversar com você e aprender sobre o seu negócio. Leva uns 10 minutos.

São 10 perguntas, uma por vez, cada uma com um exemplo de resposta (pode responder por áudio). Ele grava tudo na pasta `~/marca` e os outros dois agentes já ficam sabendo: ninguém repete as perguntas. Não mande senha nem token nessa conversa.

Deu certo se: ele termina com "Pronto! Os seus 3 agentes já sabem tudo do seu negócio." Quer refazer? Diga "refazer onboarding" para qualquer um deles.

### Opcional: o mesmo instalador, pedido a um agente de terminal (no lugar da seção 5)
Se você usa um agente de IA no terminal do seu computador (Claude Code ou Codex), pode pedir a ele para rodar o instalador por você. Ele faz tudo o que não precisa de você e, no fim, te mostra os comandos dos passos que só você pode fazer.

**O que fica com você, e por quê:** entrar com a sua assinatura (Claude ou ChatGPT), criar os bots no BotFather e colar o token de cada um e testar a sua chave antes de trancar a senha. Login, token e senha nunca vão para o chat de um agente. Esses passos você roda no **seu** terminal, com o comando que o instalador te entrega.

Antes, entre uma vez na VPS pelo seu terminal (`ssh root@SEU_IP`, responda `yes`) uma vez no seu terminal, para o seu computador já conhecer a VPS.

**1. Abra o agente no terminal do seu computador:**
- Claude Code: digite `claude` e Enter.
- Codex: digite `codex` e Enter.

**2. Cole o pedido** (é o mesmo para os dois). Troque `SEU_IP` pelo IP, `COLE_AQUI_O_LINK_DA_SECAO_5` pelo endereço `https://redpro.com.br/instalar?k=...` do comando da seção 5, e `claude` por `chatgpt` se a sua assinatura for do ChatGPT:
```
Entre na minha VPS com "ssh root@SEU_IP" e rode o instalador da Imersão em modo agente, em segundo plano, guardando a saída num arquivo:
ssh root@SEU_IP 'curl -fsSL "COLE_AQUI_O_LINK_DA_SECAO_5" -o configurar-vps.sh && nohup bash configurar-vps.sh --agente --cerebro claude > instalar-agente.log 2>&1 &'
Ele leva de 15 a 25 minutos. Acompanhe com: ssh root@SEU_IP 'tail -n 40 instalar-agente.log'
Pare de acompanhar quando aparecer a linha PENDENTES_DA_PESSOA. Se aparecer uma linha com ✖, me mostre o erro.
Não me peça senha, token nem código de login no chat. No fim, me mostre os comandos que o instalador listou para eu rodar no meu terminal.
```

**3. Aprove os comandos.** Os três agentes pedem a sua permissão antes de rodar um comando no seu computador: leia e aprove o `ssh`. No Codex, se ele disser que não tem acesso à rede, aprove o acesso quando ele pedir.

**4. Rode no SEU terminal o que ele listar.** O instalador termina com um bloco "Para a pessoa fazer no PRÓPRIO terminal". O jeito mais simples é um comando só, que faz tudo em sequência e pula o que já está pronto:
```
ssh -t root@SEU_IP 'sudo instalar-imersao'
```
Rode isso numa janela do terminal **fora** do agente (abra uma janela nova). É ali que você faz o login, cola os tokens e testa a chave. O teste da chave vem por último: depois dele o root não entra mais, e você passa a usar `ssh -t hermes@SEU_IP 'sudo instalar-imersao'`.

Deu certo se: a última linha diz **Tudo pronto** e chegaram três mensagens no Telegram.

Se usou o instalador (pela seção 5 ou pelo agente de terminal), pule para o **Passo 14 · O teste que importa**. Os passos 5 a 13 são o mesmo trabalho, à mão, para quem quer entender cada peça.

---

---

## Referência rápida

### Navegador e cofre
Navegador e cofre: veja o Manual do Dia 1, capítulo Ferramentas.

### Comandos do dia a dia (dentro da VPS, como `hermes`)
| Para quê | Comando |
|---|---|
| Ver se os agentes estão ligados | `systemctl status 'imersao-*'` |
| Reiniciar um agente depois de mudar algo | `sudo systemctl restart imersao-mkt-atendimento` |
| Ver o que aconteceu (erros) | `journalctl -u imersao-mkt-atendimento -n 50` |
| **Parar tudo na hora (emergência)** | `sudo systemctl stop 'imersao-*'` |
| Ligar de novo | `sudo systemctl start imersao-mkt-atendimento imersao-mkt-conteudo imersao-mkt-landing` |
| Conversar com um agente no terminal | `hermes -p mkt-conteudo` |
| Conferir o que o instalador já fez | `sudo instalar-imersao --listar` |

### Segurança: o que já está protegido e o que é com você
Já protegido:
- só a sua chave entra; senha e root direto estão desligados;
- firewall fechado, só o SSH aberto;
- vigia contra tentativa de invasão (fail2ban);
- atualizações de segurança automáticas (com reinício sozinho às 4h, quando preciso);
- os agentes rodam num usuário comum, não como administrador;
- cada bot só obedece ao seu número do Telegram;
- os tokens ficam em arquivos que só o usuário hermes lê.

Com você:
- **Aprovação:** o agente pede o seu ok antes de publicar ou mandar algo em seu nome. Não desligue isso.
- **Dinheiro:** cartão nunca com o agente. Se um dia precisar, cartão virtual com teto.
- **Senha de banco e de e-mail principal:** nunca com o agente.
- **Chave privada:** nunca sai do seu computador. Se vazar, gere outra e troque no painel.
- **Token vazou?** No @BotFather, `/revoke`, e rode `sudo instalar-imersao --refazer bots`.
- **Algo estranho?** `sudo systemctl stop 'imersao-*'` primeiro, pergunta depois.
- **Hermes Desktop conectado à VPS:** não clique em "Atualizar o Hermes remoto". Ele atualiza o Hermes da VPS e tira a máquina da versão fixa que o instalador deixou.

### Problemas comuns
1. **"Permission denied (publickey)"**: a chave pública não foi cadastrada, ou você entrou com o usuário errado. Lembre: depois do instalador, é `hermes@`, não `root@`.
2. **Fiquei trancado do lado de fora**: entre pelo navegador. No painel da Hostinger, na **Visão geral** da sua VPS, clique em **Console web** (canto superior direito, ao lado de **Reiniciar**).
3. **"command not found: hermes"**: rode `source ~/.bashrc` ou saia e entre de novo.
4. **O bot não responde**: token errado ou o mesmo token em dois agentes. `sudo instalar-imersao --refazer bots`.
5. **O agente diz que não consegue pensar**: o login do cérebro caiu. `sudo instalar-imersao --refazer cerebro`.
6. **A VPS reiniciou e os agentes não voltaram**: `sudo instalar-imersao --refazer servico`.
7. **Colei IP, senha ou token no chat**: troque o que vazou e avise o suporte da Imersão, no WhatsApp.

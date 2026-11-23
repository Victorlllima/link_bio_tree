# Noite 1 · O Hermes no seu computador
## Passo 0 · Instalar o Hermes Desktop
Resultado: o Hermes instalado no seu computador.

É **gratuito e oficial**: o app é da Nous Research, a empresa que criou o Hermes, com código aberto.

[[botao: Baixar o Hermes Desktop|https://hermes-agent.nousresearch.com/desktop]]

- Windows: precisa do Windows 10 ou 11. Na página, instale pela **Microsoft Store** ou clique em **Download .exe instead** e abra o arquivo baixado.
- Mac: precisa do macOS 12 ou mais novo. Baixe o arquivo `.dmg`, abra e arraste o Hermes para a pasta Aplicativos.
- Linux: não tem instalador. Na página, clique em **Install via terminal** e siga o comando que aparece lá.

Deu certo se: o app do Hermes abre no seu computador.

📌 Guarde isto agora: qual **conta de IA** você vai usar, a assinatura do **ChatGPT** ou a do **Claude**. É a mesma que você vai conectar na VPS na noite 2.

# Noite 2 · A VPS: seus 3 agentes ligados 24 horas

## O que você vai ter no fim
- Uma VPS sua, protegida, ligada 24 horas.
- O Hermes instalado nela, com o **Squad de 3 agentes**, cada um com o seu bot no Telegram:
  1. **Atendimento:** responde dúvidas com base nas respostas que você aprovou e passa para você o que não sabe.
  2. **Carrosséis:** cria carrosséis e legendas no tom da sua marca.
  3. **Landing pages:** monta páginas de captura e de venda.
- Os três respondem do seu celular mesmo com o seu computador desligado.

## Antes de começar, deixe por perto
- O computador (Windows ou Mac).
- O celular com o Telegram.
- Um cartão para comprar a VPS.
- A sua assinatura do **Claude** (Pro ou Max) **ou** do **ChatGPT** (Plus ou Pro). Não precisa de chave de API.
- Um gerenciador de senhas (ou um caderno guardado) para anotar o IP.

**Regra de ouro:** IP, senha, chave e token nunca vão para o chat do grupo, print público ou mensagem para alguém. Dúvida vai para o suporte da Imersão, no WhatsApp, sem esses dados.

---

## Passo 1 · Comprar a VPS
Resultado: uma VPS paga e ativa na Hostinger.

1. Entre pelo [link do Red]({{LINK_HOSTINGER}}): ele dá **20% de desconto** no plano de 12 meses.
2. Escolha o plano **KVM 2** (2 núcleos, 8 GB de memória). É o que segura os 3 agentes com folga. O KVM 1 é pequeno demais. [print 01]
3. No carrinho, o campo **Período** já vem em **24 meses**. Troque para **12 meses**. Nunca escolha 1 mês: o mensal não aceita o desconto, e subir de plano ou trocar de período depois sai a preço cheio. O plano longo tem 30 dias para pedir reembolso. [print 02]
4. **Backups automáticos diários:** deixe **desmarcado**. É pago à parte e a Hostinger já faz backup semanal grátis. [print 03]
5. Pague (dá para parcelar em até 12 vezes no cartão).

Deu certo se: o painel da Hostinger mostra a sua VPS.

📌 Guarde isto agora: o link do painel da Hostinger (`https://hpanel.hostinger.com`) e o e-mail da conta. Anote: na noite 2 ela entra na sua ficha da VPS.

## Passo 2 · Configurar a VPS no painel
Resultado: Ubuntu instalado, chave de acesso cadastrada e o IP anotado.

1. **Localização:** Brasil. [print 04]
2. **Sistema operacional:** em "SO simples", escolha **Ubuntu**, versão **Ubuntu 24.04 LTS**, e clique em Confirmar. Nada de painel de controle nem aplicativo. O instalador só funciona no Ubuntu. [print 05]
3. **Chave SSH:** a Hostinger pede aqui. Faça o **Passo 3** (criar a chave), cole a linha no campo "Conteúdo da chave SSH", dê um nome (ex.: meu-computador) e salve.
4. **Senha do root:** se pedir, crie uma forte e guarde. Ela é provisória: o instalador desliga a entrada por senha.
5. **Recursos adicionais:** deixe **Scanner Monarx** e **Gerenciador Docker** os dois **desmarcados** e clique em **Finalizar configuração**. O instalador já cuida da segurança e não usa Docker; dá para ligar depois no painel, se quiser. [print 08]
6. Espere o status "Em execução" e anote o **IP**. [prints 09 e 10]
Deu certo se: aparece um IP e o status em execução. [print 11]

📌 Guarde isto agora: o **IP** da VPS e o **nome do servidor** (começa com `srv`, aparece no painel). Pode ir num Google Docs: não é segredo. A **senha do root**, se você criou uma, vai só no gerenciador de senhas, nunca em documento.

## Passo 3 · Criar a sua chave de acesso (SSH)
Resultado: você tem uma chave para entrar na VPS sem senha.

A chave tem duas partes:
- a **pública** é a fechadura: vai para a VPS;
- a **privada** é a chave: fica só no seu computador e nunca sai dele.

**3.1 Abrir o terminal do seu computador**
- Windows: tecla Windows, digite **PowerShell**, Enter.
- Mac: Cmd + Espaço, digite **Terminal**, Enter.
- Linux: abra o Terminal.

**3.2 Criar a chave** (igual nos três; nas perguntas, só Enter)
```
ssh-keygen -t ed25519 -C "minha-vps"
```
Se aparecer "Overwrite (y/n)?", responda `n`: você já tem uma chave e pode usar essa. [print 06]

**3.3 Copiar a parte pública** (a linha que começa com `ssh-ed25519`)
- Windows: `Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub | Set-Clipboard` (já copia sozinho)
- Mac: `pbcopy < ~/.ssh/id_ed25519.pub` (já copia sozinho)
- Linux: `cat ~/.ssh/id_ed25519.pub`, selecione a linha e copie com Ctrl+Shift+C

Ela não é segredo.
**Erro comum:** colar a linha `SHA256:...` que o terminal mostra ao criar a chave. Ela é só a identificação da chave, e a Hostinger recusa ("Insira um formato de Chave SSH válido"). [print 07]

**3.4 Colar na Hostinger**
Cole a linha no campo da chave SSH (Passo 2, item 3). Com isso o instalador já acha a chave sozinho. Se pular, ele pede para você colar depois.

**3.5 Primeira entrada na VPS** (troque `SEU_IP` pelo IP do passo 2)
```
ssh root@SEU_IP
```
Na primeira vez ele pergunta se confia na máquina: digite `yes` e Enter. Se pedir senha, é a do root do passo 2.

Deu certo se: o terminal mostra algo como `root@...:~#`. Você está dentro da VPS.

---

## Passo 4 · O caminho rápido: o instalador pelo Console web (recomendado)
Resultado: tudo dos passos 5 a 13 feito por você, com uma linha.

**4.1 Abrir o Console web.** No painel da Hostinger, abra a sua VPS e clique no botão **Console web**. Abre um terminal da VPS no próprio navegador, já como root (a linha termina em `root@...:~#`).

**Atenção:** ao abrir, o Console web pode mostrar "New release '26.04.1 LTS' available" e sugerir `do-release-upgrade`. **Não rode esse comando.** O instalador é feito para o Ubuntu 24.04. [print 12]

**4.2 Colar o comando.** Copie o comando abaixo com o botão de copiar e cole no Console web com **Ctrl+Shift+V** (ou botão direito → Colar). Depois aperte Enter.

> **Atenção: no Console web, Ctrl+C NÃO copia.** Ele interrompe o instalador na hora. Para copiar, use **Ctrl+Shift+C** ou o botão direito → Copiar. Se apertou Ctrl+C sem querer, nada se perde: rode `sudo instalar-imersao` que ele continua de onde parou.
```
curl -fsSL https://redpro.com.br/instalar -o configurar-vps.sh && bash configurar-vps.sh
```
O comando já vem com a chave da sua turma. Ele só funciona copiado desta página: não mande para ninguém.

**Atenção:** o teste da chave (item 2) é **no terminal do SEU computador, NÃO na tela do Console web**.

O instalador mostra, em português, cada etapa, o que está fazendo e por quê. Antes de cada uma das 12 etapas ele para e mostra "aperte Enter para começar": leia o "Por quê" com calma e aperte Enter. Nas etapas que demoram (atualizar o sistema, instalar o Hermes e instalar os agentes) aparece uma barra com a porcentagem, por exemplo `⏳ [████████░░░░░░░░░░░░]  42% · instalando as dependências · 1 min 05 s`: enquanto o tempo andar, está tudo certo. Ele vai te pedir, nesta ordem:
1. **A sua chave:** se você cadastrou a chave no painel, ele pergunta "Usar essa mesma chave para o usuário hermes? [s/n]". Responda `s`. Só pede para colar a chave se não achou a do painel. [print 13]
2. **O teste da chave:** este passo é no terminal do **SEU COMPUTADOR, NÃO na tela do Console web** (Windows: PowerShell · Mac: Terminal). Deixe o Console web aberto, vá até o seu computador e entre com `ssh hermes@SEU_IP` (se você deu outro nome à chave no Passo 3, use `ssh -i ~/.ssh/NOME_DA_CHAVE hermes@SEU_IP`). Se entrou sem pedir senha, volte ao Console web e responda `s`. **Pediu senha? Não digite nada.** Volte ao Console web e responda `n`: nada é trancado, a senha continua ligada e você corrige com calma. Confira se a chave cadastrada na Hostinger é a deste computador e depois rode só esta etapa com `sudo instalar-imersao --so ssh`. (Se a linha onde você digita começa com `root@srv...`, você ainda está no Console web, não no seu computador.) Só depois disso ele tranca a senha. O Console web continua funcionando depois disso: ele não usa senha nem SSH.
3. **O cérebro:** `1` para Claude ou `2` para ChatGPT. Ele mostra um link. Selecione o link inteiro com o mouse, copie com **Ctrl+Shift+C** (ou botão direito → Copiar), abra numa aba nova do navegador e autorize. Se o link quebrar em várias linhas, copie todas, do `https` até o fim. No Claude, clique em Autorizar e depois em Copiar código; volte ao Console web e cole com o **botão direito → Colar** e aperte Enter. **Atenção: o código colado NÃO aparece na tela. É normal: aperte Enter e o Claude conecta.** As mensagens do login vêm do próprio Claude, em inglês ("Paste code here" = cole o código aqui). No ChatGPT, você digita no navegador o código curto que aparece no Console web.
4. **Os tokens dos 3 bots** (você criou os bots na noite 1 e guardou os tokens no seu gerenciador de senhas). A ordem é Atendimento → Carrosséis → Landing pages: o instalador mostra "Bot 1 de 3 · agente de ATENDIMENTO · cole o token que você guardou", depois CARROSSÉIS e LANDING PAGES. O token colado não aparece na tela, é assim mesmo: cole uma vez só e aperte Enter. Se o token estiver errado, o instalador avisa e pede de novo. Depois mande `/start` para o bot: o instalador mostra o nome de quem mandou e pergunta se é você, e só essa pessoa vai poder usar o agente.

Leva de 25 a 40 minutos, contando o login do cérebro e os tokens dos bots (só a parte automática fica em uns 15). Deixe a aba do Console web aberta até o fim. No fim, cada agente te manda um "oi" no Telegram e o instalador lista os 3 bots com o @ e o link t.me de cada um.

Deu certo se: a última linha diz **Tudo pronto** e chegaram três mensagens no Telegram. Em seguida, mande um oi para qualquer um dos 3 agentes: é o onboarding (Passo 15).

📌 Guarde isto agora: o **nome e o @ de cada bot** e a **conta de IA** em que você fez o login (o e-mail do Claude ou do ChatGPT). O **token de cada bot** vai só no gerenciador de senhas.

**Caiu a internet, fechou a aba, deu erro?** Abra o Console web de novo e rode `sudo instalar-imersao` (o instalador guarda uma cópia com esse nome). O que já ficou pronto é pulado; ele continua de onde parou. O mesmo comando funciona pelo seu terminal, entrando com `ssh hermes@SEU_IP`:
```
sudo instalar-imersao                      # continua de onde parou
sudo instalar-imersao --listar             # mostra o que já está pronto
sudo instalar-imersao --refazer telegram   # refaz uma etapa (ex.: trocar o token de um bot)
```

### Passo 4B · O mesmo instalador, pedido a um agente de terminal (opcional, no lugar do 4)
Se você usa um agente de IA no terminal do seu computador (Claude Code, Codex ou Gemini CLI), pode pedir a ele para rodar o instalador por você. Ele faz tudo o que não precisa de você e, no fim, te mostra os comandos dos passos que só você pode fazer.

**O que fica com você, e por quê:** entrar com a sua assinatura (Claude ou ChatGPT), colar o token de cada bot do Telegram e testar a sua chave antes de trancar a senha. Login, token e senha nunca vão para o chat de um agente. Esses passos você roda no **seu** terminal, com o comando que o instalador te entrega.

Antes, faça o **Passo 3.5** (a primeira entrada na VPS) uma vez no seu terminal, para o seu computador já conhecer a VPS.

**1. Abra o agente no terminal do seu computador:**
- Claude Code: digite `claude` e Enter.
- Codex: digite `codex` e Enter.
- Gemini CLI: digite `gemini` e Enter.

**2. Cole o pedido** (é o mesmo para os três). Troque `SEU_IP` pelo IP e `claude` por `chatgpt` se a sua assinatura for do ChatGPT:
```
Entre na minha VPS com "ssh root@SEU_IP" e rode o instalador da Imersão em modo agente, em segundo plano, guardando a saída num arquivo:
ssh root@SEU_IP 'curl -fsSL "COLE_AQUI_O_LINK_DO_PASSO_4.2" -o configurar-vps.sh && nohup bash configurar-vps.sh --agente --cerebro claude > instalar-agente.log 2>&1 &'
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

📌 Guarde isto agora: o **nome e o @ de cada bot** e a **conta de IA** em que você fez o login (o e-mail do Claude ou do ChatGPT). O **token de cada bot** vai só no gerenciador de senhas.

Se usou o instalador (pelo 4 ou pelo 4B), pule para o **Passo 14 · O teste que importa**. Os passos 5 a 13 são o mesmo trabalho, à mão, para quem quer entender cada peça.

---

# O caminho manual (os mesmos comandos do instalador)

Cole um bloco por vez, dentro da VPS, como root (o terminal que mostra `root@`), até o passo 9.

## Passo 5 · Atualizar o sistema e ligar as atualizações automáticas
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

## Passo 6 · Criar o usuário hermes com a sua chave
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

## Passo 7 · Firewall e fail2ban
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

## Passo 8 · Testar a chave ANTES de trancar a senha
Abra **outra janela** do terminal no seu computador (não feche a atual):
```
ssh hermes@SEU_IP
```
Só siga se entrou sem pedir senha. Se não entrou, pare e confira o passo 6: trancar agora deixaria você do lado de fora.

## Passo 9 · Trancar: só chave, sem senha e sem root direto
De volta à janela do root:
```
printf 'PasswordAuthentication no\nKbdInteractiveAuthentication no\nPermitRootLogin no\nPubkeyAuthentication yes\n' > /etc/ssh/sshd_config.d/00-imersao.conf
sshd -t && systemctl reload ssh
```
Por que um arquivo `00-` em `sshd_config.d`: o Ubuntu da Hostinger traz um arquivo próprio que religa a senha. O SSH obedece a primeira regra que lê, e o `00-` é lido primeiro.

Deu certo se: numa janela nova, `ssh root@SEU_IP` é recusado e `ssh hermes@SEU_IP` entra.

**Daqui em diante, entre sempre com `ssh hermes@SEU_IP`.** Os próximos passos são como hermes.

## Passo 10 · Instalar o Hermes v0.22.5
Por quê: a mesma versão testada na aula, para o seu funcionar igual ao do professor.
```
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/99fcd6944360925943688d30c39ec9a490ccdeb1/scripts/install.sh | bash -s -- --commit 99fcd6944360925943688d30c39ec9a490ccdeb1 --non-interactive --skip-computer-use
source ~/.bashrc
hermes --version
```
Leva cerca de 2 minutos (pode chegar a 10 se a internet da VPS estiver lenta). Deu certo se: aparece `v0.22.5`.

## Passo 11 · Conectar o cérebro
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

📌 Guarde isto agora: a **conta de IA** em que você fez o login (o e-mail do Claude ou do ChatGPT). Anote na sua ficha.

## Passo 12 · Instalar os 3 agentes
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

## Passo 13 · Um bot do Telegram para cada agente e ligado 24 horas
**13.1 Os tokens.** Você criou os 3 bots na noite 1 (Atendimento, Carrosséis e Landing pages): pegue os 3 tokens no seu gerenciador de senhas. **Nunca use o mesmo token em dois agentes.**

📌 Guarde isto agora: o **nome e o @ de cada bot** (na ficha) e o **token de cada um** (só no gerenciador de senhas, nunca em documento ou chat).

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

## Passo 14 · O teste que importa
1. **Desligue o seu computador.**
2. No celular, mande "oi" para cada um dos três bots.

Deu certo se: os três respondem. Mande o print para o suporte da Imersão, no WhatsApp, e escreva NO AR na noite 2.

## Passo 15 · Onboarding dos agentes
Abra o Telegram e mande um oi para **qualquer um** dos seus 3 agentes. Ele vai conversar com você e aprender sobre o seu negócio. Leva uns 10 minutos.

São 10 perguntas, uma por vez, cada uma com um exemplo de resposta (pode responder por áudio). Ele grava tudo na pasta `~/marca` e os outros dois agentes já ficam sabendo: ninguém repete as perguntas. Não mande senha nem token nessa conversa.

Deu certo se: ele termina com "Pronto! Os seus 3 agentes já sabem tudo do seu negócio." Quer refazer? Diga "refazer onboarding" para qualquer um deles.

---

## Ficha da minha VPS
Copie, cole num Google Docs ou nas suas notas e preencha. Aqui só vai o que **não é segredo**: senha do root e tokens dos bots ficam no gerenciador de senhas.
```ficha
FICHA DA MINHA VPS (RedPro AI Academy)
Painel da Hostinger [Passo 1]: https://hpanel.hostinger.com
E-mail da conta Hostinger [Passo 1]:
IP da VPS [Passo 2, painel]:
Nome do servidor, começa com srv [Passo 2, painel]:
Usuário de acesso [Passo 4]: hermes
Conta de IA do login, Claude ou ChatGPT, e-mail [Passo 4]:
Bot de atendimento, nome e @ [Passo 4]:
Bot de carrosséis, nome e @ [Passo 4]:
Bot de landing pages, nome e @ [Passo 4]:
Senha do root e tokens guardados em [seu gerenciador de senhas]:
```

## Comandos do dia a dia (dentro da VPS, como `hermes`)
| Para quê | Comando |
|---|---|
| Ver se os agentes estão ligados | `systemctl status 'imersao-*'` |
| Reiniciar um agente depois de mudar algo | `sudo systemctl restart imersao-mkt-atendimento` |
| Ver o que aconteceu (erros) | `journalctl -u imersao-mkt-atendimento -n 50` |
| **Parar tudo na hora (emergência)** | `sudo systemctl stop 'imersao-*'` |
| Ligar de novo | `sudo systemctl start imersao-mkt-atendimento imersao-mkt-conteudo imersao-mkt-landing` |
| Conversar com um agente no terminal | `hermes -p mkt-conteudo` |
| Conferir o que o instalador já fez | `sudo instalar-imersao --listar` |

## Segurança: o que já está protegido e o que é com você
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
- **Token vazou?** No @BotFather, `/revoke`, e rode `sudo instalar-imersao --refazer telegram`.
- **Algo estranho?** `sudo systemctl stop 'imersao-*'` primeiro, pergunta depois.

## Problemas comuns
1. **"Permission denied (publickey)"**: a chave pública não foi cadastrada, ou você entrou com o usuário errado. Lembre: depois do instalador, é `hermes@`, não `root@`.
2. **Fiquei trancado do lado de fora**: no painel da Hostinger há um console pelo navegador; entre por ele.
3. **"command not found: hermes"**: rode `source ~/.bashrc` ou saia e entre de novo.
4. **O bot não responde**: token errado ou o mesmo token em dois agentes. `sudo instalar-imersao --refazer telegram`.
5. **O agente diz que não consegue pensar**: o login do cérebro caiu. `sudo instalar-imersao --refazer cerebro`.
6. **A VPS reiniciou e os agentes não voltaram**: `sudo instalar-imersao --refazer servico`.
7. **Colei IP, senha ou token no chat**: troque o que vazou e avise o suporte da Imersão, no WhatsApp.

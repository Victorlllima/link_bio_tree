---
name: agente-whatsapp-crm
description: >
  Guia o aluno do zero a colocar um AGENTE COMERCIAL de WhatsApp conectado ao CRM
  que ele construiu no CRM Week. O agente lê a conversa do WhatsApp, decide em que
  estágio do funil o negócio está, escreve um resumo e move o card no CRM sozinho.
  A skill leva o aluno pela DECISÃO de infra (VPS própria com Evolution grátis, ou
  UZAPI sem servidor), instala o WhatsApp no caminho escolhido, e conecta o agente
  ao CRM. Tudo construído pelo Claude Code do aluno. Use quando o aluno disser
  "/agente-whatsapp-crm", "quero meu agente de WhatsApp no CRM", "conecta um agente
  no WhatsApp do meu CRM", ou colar esta skill no Claude Code dele.
---

# Agente comercial de WhatsApp no seu CRM

Você (Claude Code) vai levar o aluno do ZERO até ter um **agente comercial** que:
- fica conectado ao WhatsApp dele,
- lê cada conversa com um cliente,
- entende em que **estágio da venda** aquele cliente está (ex: "primeiro contato",
  "enviou proposta", "negociando", "fechado"),
- **move o card** daquele cliente pro estágio certo no CRM,
- e escreve um **resumo da conversa** dentro do card.

O CRM é o que o aluno construiu na **CRM Week**. Esta skill assume que ele já
está rodando, com banco (Supabase) acessível.

**O aluno não é programador.** Você faz o trabalho técnico; ele toma as decisões
de negócio (quanto quer gastar, qual número de WhatsApp usar) e faz o que só a
mão dele pode fazer (criar conta num site, escanear um QR Code, pagar). Explique
cada passo em português simples, um de cada vez. Nunca despeje comando sem dizer
o que ele faz e por quê.

---

## Como esta skill funciona (o mapa)

São **3 blocos**, nesta ordem. NÃO pule blocos — cada um depende do anterior.

```
BLOCO 1 — DECISÃO DE INFRA  (você está lendo aqui)
   O aluno decide COMO o WhatsApp vai rodar. Duas opções, com custos reais.
   Sai daqui com a decisão tomada: "VPS própria" ou "UZAPI".

BLOCO 2 — INSTALAR O WHATSAPP   →  bloco-2-instalar-whatsapp.md
   Caminho A (VPS): sobe a Evolution API na VPS do aluno.
   Caminho B (UZAPI): conecta pela UZAPI, sem servidor.
   Sai daqui com o WhatsApp do aluno conectado e recebendo mensagens.

BLOCO 3 — AGENTE + CONEXÃO AO CRM   →  bloco-3-agente-crm.md
   O Claude Code escreve o agente que lê a conversa e move o card.
   Sai daqui com o agente movimentando o CRM de verdade.
```

Carregue o arquivo do bloco seguinte só quando terminar o atual. Ao fim do Bloco
1, você vai ler `bloco-2-instalar-whatsapp.md` (caminho A ou B conforme a escolha).

---

# BLOCO 1 — A decisão de infra

Antes de instalar nada, o aluno precisa escolher **onde o WhatsApp vai rodar**.
Existem dois caminhos, e a diferença é: **ter um servidor próprio ou não.**
Explique os dois com honestidade, com os custos reais, e depois dê a recomendação
do Red. A escolha é do aluno — seu papel é deixar clara o suficiente pra ele
decidir sem se arrepender.

## Primeiro, o conceito (explique assim pro aluno)

Pra um agente controlar o WhatsApp, o WhatsApp precisa estar "ligado" a um
programa o tempo todo — 24 horas por dia, mesmo com o computador do aluno
desligado. Isso não roda no PC dele; roda num **servidor na internet**. Há dois
jeitos de ter esse servidor:

1. **Alugar um servidor só seu (VPS)** e instalar o programa (Evolution API) nele.
   Você manda no servidor inteiro. O programa é grátis; você paga só o aluguel do
   servidor.
2. **Usar um serviço pronto (UZAPI)** que já tem o servidor e o programa rodando.
   Você não aluga nada nem instala nada; paga uma mensalidade pelo serviço.

> ⚠️ Os dois usam a **API não-oficial** do WhatsApp (conecta lendo o QR Code, como
> o WhatsApp Web). É o caminho mais barato e rápido pra começar. Deixe o aluno
> ciente: número não-oficial tem risco de bloqueio se mandar spam. Pra uso
> comercial de verdade (atendimento, não disparo em massa), o risco é baixo. Se um
> dia ele escalar muito, existe a API oficial da Meta (paga por conversa) — mas
> isso é assunto pra depois, não pro primeiro agente.

## Opção A — VPS própria (Evolution API grátis)

**Como é:** o aluno aluga uma VPS (um computador na nuvem, só dele), e o Claude
Code instala a Evolution API lá dentro. A Evolution é **gratuita e open-source**.

**Custo:** só o aluguel da VPS. Uma VPS de entrada resolve — a Evolution + banco
+ cache juntos consomem só ~300 MB de RAM (medido na VPS do Red). O aluno **não**
precisa de máquina cara.

> ℹ️ A Evolution v2 precisa de um banco (Postgres) e um cache (Redis) pra
> funcionar — mas o aluno **não instala nem administra nada disso à mão**. Eles
> sobem juntos, como containers Docker, no mesmo pacote da Evolution, com um
> comando só. O aluno nunca toca no banco; ele só existe, invisível, dentro do
> Docker. (Detalhes no Bloco 2.)

| Provedor de VPS | Plano de entrada que serve | Preço aprox. (2026) |
|---|---|---|
| **Hetzner** ⭐ (o Red usa e recomenda) | CX22 — 2 vCPU, 4 GB RAM, 40 GB | ~€4-5/mês (~R$25-30) |
| Contabo | VPS S — 4 vCPU, 8 GB | ~R$30-40/mês |
| DigitalOcean | Droplet básico — 1 vCPU, 2 GB | ~US$12/mês (~R$65) |
| Vultr / Linode | equivalente 2 GB | ~US$10-12/mês |

> 💬 **Recomendação do Red: Hetzner.** É a que ele usa na operação real. Melhor
> custo-benefício (CPU/RAM por real), painel simples, e datacenter que atende bem
> o Brasil. O CX22 (2 vCPU / 4 GB) sobra pro agente de um aluno começando.

**Prós:** controle total, custo baixo e fixo, sem limite de mensagens do serviço,
o WhatsApp e os dados são só do aluno.
**Contras:** o aluno "tem um servidor" (mais responsabilidade); precisa manter
atualizado (mas o Claude Code faz isso). Idealmente um domínio próprio — mas tem
contorno se não tiver (o Bloco 2 resolve).

## Opção B — UZAPI (sem servidor próprio)

**Como é:** o aluno cria conta na **UZAPI**, conecta o número dele (escaneia o QR),
e pronto — a UZAPI cuida do servidor. O agente conversa com a API da UZAPI em vez
de uma Evolution própria.

**Custo:** mensalidade da UZAPI (planos costumam começar na casa de ~R$50-100/mês
por número — confirme o valor atual no site deles, muda com o tempo). Sem VPS, sem
manutenção.

> 💬 **Recomendação do Red pra quem NÃO quer servidor próprio: UZAPI.** É a API
> não-oficial que ele indica pra esse caminho. Você paga um pouco mais que a VPS,
> mas não administra nada.

**Prós:** zero servidor, zero manutenção, começa em minutos, não precisa de domínio.
**Contras:** mais caro no médio prazo que a VPS; você depende do serviço deles;
limites conforme o plano.

## A comparação, em uma linha (dê isto ao aluno)

| | VPS + Evolution (A) | UZAPI (B) |
|---|---|---|
| Custo/mês | ~R$25-40 (Hetzner) | ~R$50-100+ |
| Precisa administrar servidor? | Sim (o Claude ajuda) | Não |
| Precisa de domínio? | Ideal (tem contorno) | Não |
| Controle dos dados | Total | Do serviço |
| Melhor pra... | quem quer aprender + economizar no longo prazo | quem quer o mais simples e rápido |

## Sua tarefa neste bloco

1. Explique os dois caminhos com os números acima (não invente preços — se não
   souber o valor atual da UZAPI, mande o aluno conferir no site e volte).
2. Deixe claras as **recomendações do Red**: Hetzner (se VPS) / UZAPI (se sem servidor).
3. Ajude o aluno a decidir com uma pergunta simples:
   > "Você prefere pagar um pouco menos e ter seu próprio servidor (eu configuro
   > tudo pra você), ou pagar um pouco mais e não se preocupar com servidor nenhum?"
4. **Registre a escolha** e siga:
   - Escolheu **VPS/Hetzner** → leia `bloco-2-instalar-whatsapp.md`, caminho A.
   - Escolheu **UZAPI** → leia `bloco-2-instalar-whatsapp.md`, caminho B.

Não avance sem a decisão tomada. É ela que define todo o resto.

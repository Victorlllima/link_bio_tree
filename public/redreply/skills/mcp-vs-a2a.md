---
name: mcp-vs-a2a
description: |
  O guia que separa os dois protocolos que todo mundo confunde: MCP (agente para ferramenta) e
  A2A (agente para agente). O que cada um resolve, qual você já usa sem saber, o que dá pra
  fazer hoje e o que ainda não. Use quando disser "MCP ou A2A", "meus agentes não conversam",
  "como fazer um agente chamar outro".
---

# MCP dá mãos pro seu agente. A2A dá colegas.

Seu agente sabe usar ferramenta. Ele lê arquivo, chama API, mexe no banco. O que ele não sabe
é pedir ajuda para outro agente.

São dois encanamentos diferentes, e quase todo mundo instalou só o primeiro achando que tinha
os dois.

---

## A tabela que resolve a confusão

| | **MCP** | **A2A** |
|---|---|---|
| Conecta | Agente ↔ ferramenta e dado | Agente ↔ agente |
| Pergunta que responde | "Como meu agente lê meu banco?" | "Como meu agente pede pro outro fazer?" |
| Quem criou | Anthropic | Google |
| O outro lado é | Um recurso passivo (API, arquivo, banco) | Outro agente, com autonomia própria |
| Você já usa? | Quase certamente sim | Quase certamente não |

**Os dois estão sob a mesma fundação** desde 17 de agosto de 2026: o A2A entrou na Agentic AI
Foundation, da Linux Foundation, onde o MCP já estava. A fundação nasceu em 9 de dezembro de
2025 com menos de 40 membros e hoje passa de 250, incluindo Google, Microsoft, Amazon,
Anthropic, OpenAI, Bloomberg, Shopify e Block.

Ninguém padroniza protocolo de brinquedo.

---

## PARTE 1 — MCP: o que você já tem

O MCP é o padrão universal para conectar modelos a ferramentas, dados e aplicações. É o que
transforma um modelo que só fala num agente que faz.

Sem MCP, seu agente descreve o que faria. Com MCP, ele faz.

### O que o MCP resolve na prática

Você conecta uma vez e o agente ganha acesso permanente àquela capacidade:

- Ler e escrever nos arquivos do projeto
- Consultar seu banco de dados
- Chamar sua API interna
- Buscar no Drive, no Notion, no seu CRM
- Rodar comando no terminal

### O limite do MCP

O outro lado de uma conexão MCP é **passivo**. O banco não decide nada, a API não negocia, o
arquivo não tem opinião. Seu agente pede, o recurso responde.

Isso é exatamente o que você quer quando o outro lado é uma ferramenta. E é exatamente o que
atrapalha quando o outro lado deveria ser alguém capaz de resolver sozinho.

---

## PARTE 2 — A2A: o que falta

O A2A define como um agente **acha outro**, entrega uma tarefa e recebe o resultado de volta.
Mesmo que os dois tenham sido construídos por empresas diferentes, em frameworks diferentes,
por times que nunca se falaram.

### Como um agente acha o outro: o Agent Card

O A2A resolve descoberta com um documento JSON publicado pelo próprio agente, chamado
**Agent Card**. Ele declara:

- Identidade do agente
- Capacidades (suporta streaming? push notification?)
- Skills que ele sabe executar
- Endereço do serviço
- Requisitos de autenticação
- Esquemas de segurança aceitos

Seu agente lê o card do outro **antes** de mandar trabalho, e já sabe se aquele agente serve
para o que ele precisa. É currículo lido antes da contratação, não tentativa e erro.

### As operações que existem

A spec 1.0 define, entre outras:

| Operação | O que faz |
|---|---|
| `SendMessage` | Manda a tarefa e recebe resposta |
| `SendStreamingMessage` | Mesma coisa, com stream de eventos em tempo real |
| `GetTask` | Consulta o estado e os artefatos de uma tarefa |
| `ListTasks` | Lista tarefas com filtro |
| `CancelTask` | Cancela uma tarefa em andamento |
| `SubscribeToTask` | Assina atualizações de uma tarefa que já existe |
| `GetExtendedAgentCard` | Pega o card completo, com autenticação |

Repare no que a existência de `CancelTask` e `SubscribeToTask` significa: a tarefa **dura**.
Não é pergunta e resposta, é trabalho em andamento que você acompanha.

### Os estados de uma tarefa

Aqui está a diferença conceitual mais importante em relação a uma chamada de ferramenta:

```
SUBMITTED       → aceita, na fila
WORKING         → em execução
COMPLETED       → terminou com sucesso
FAILED          → terminou com erro
CANCELED        → você cancelou
REJECTED        → o agente recusou o serviço
INPUT_REQUIRED  → parou, precisa de informação sua
AUTH_REQUIRED   → parou, precisa de autenticação
```

Dois desses estados não existem no mundo do MCP.

**REJECTED**: o outro agente pode simplesmente recusar. Uma API não recusa por julgamento, ela
retorna erro. Um agente avalia se aquilo é serviço dele.

**INPUT_REQUIRED**: o trabalho pausa e pede informação, e depois continua de onde parou. É a
diferença entre uma função que falha e um colega que te liga perguntando uma coisa.

### Transporte

Três bindings, você escolhe:

- **JSON-RPC 2.0** sobre HTTP
- **gRPC** com Protocol Buffers
- **HTTP + JSON/REST**

Streaming vai por Server-Sent Events no HTTP, ou streaming nativo no gRPC.

### SDKs disponíveis

Python, JavaScript, Java, C#/.NET, Go e Rust. Todos em `github.com/a2aproject`.

---

## PARTE 3 — Onde isso muda o seu sistema

### Hoje, sem A2A, você é o carteiro

Você tem um agente que pesquisa e outro que escreve. O fluxo real é:

1. Roda o agente de pesquisa
2. Copia a saída
3. Cola na entrada do agente que escreve
4. Roda de novo
5. Confere o resultado

Com dois agentes, dá para ser o carteiro. É chato, mas funciona.

### Com cinco, você vira o gargalo

Cada par de agentes que precisa trocar informação passa por você. Cinco agentes têm dez pares
possíveis. Você não está orquestrando, está fazendo o transporte manual de dados entre
processos que poderiam se falar sozinhos.

É nesse ponto que quem sabe separar os dois protocolos monta time, e quem não sabe fica
orquestrando na unha.

### O teste de qual você precisa

> **O outro lado da conexão toma alguma decisão?**
>
> **Não** (banco, API, arquivo, planilha) → **MCP**
> **Sim** (avalia, recusa, pede mais informação, decide como fazer) → **A2A**

---

## PARTE 4 — O que dá pra fazer hoje, honestamente

Esta parte importa mais que o resto, porque é onde a maioria dos conteúdos sobre A2A mente
por omissão.

### O que já é real

- A spec está na **versão 1.0**, estável e publicada
- Os SDKs existem nas 6 linguagens e são open source
- A governança é neutra (Linux Foundation), com 250+ organizações
- Dá para construir um agente A2A hoje e outro time consegue integrar com ele

### O que ainda não é

- **Não existe um "app store" de agentes A2A** onde você pluga e usa. Descoberta funciona, mas
  você precisa saber o endereço do agente ou publicar o seu.
- **A maioria das ferramentas que você já usa não fala A2A ainda.** MCP tem anos de vantagem em
  adoção prática e ecossistema.
- **Não substitui o MCP.** Um agente A2A que não tem MCP não tem mãos, só tem com quem conversar.

### A ordem certa de aprender

1. **Primeiro MCP**, porque sem ferramenta o agente não faz nada
2. **Depois escopo e permissão**, porque agente com mãos e sem limite é o problema seguinte
3. **Só então A2A**, quando você já tem mais de um agente e está se cansando de ser o carteiro

Pular direto para A2A é montar organograma antes de ter funcionário.

---

## O resumo em uma frase

**MCP dá mãos pro seu agente. A2A dá colegas.** Você quase certamente tem o primeiro e quase
certamente não tem o segundo, e isso está tudo bem, até o dia em que você tiver cinco agentes
e perceber que virou o gargalo do próprio sistema.

---

## Fontes

- Spec do A2A: https://a2a-protocol.org/latest/specification/
- SDKs: https://github.com/a2aproject
- Formação da Agentic AI Foundation (Linux Foundation, 09/12/2025):
  https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation
- A2A entra na fundação (17/08/2026): cobertura Axios e Forbes

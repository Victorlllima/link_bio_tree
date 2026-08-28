---
name: auditoria-reversibilidade
description: |
  Mapeia toda ação que seus agentes executam, classifica cada uma por reversibilidade, e mostra
  quais estão rodando sem nenhuma verificação. Aplica o critério que separa demo de operação:
  ação reversível o agente faz sozinho, ação irreversível nunca sem segundo par de olhos.
  Use quando disser "audita meus agentes", "o que roda sem verificação", "/auditoria-reversibilidade".
---

# Auditoria de Reversibilidade — o que seus agentes fazem sem ninguém conferir

Seu agente funciona. A pergunta é outra: quando ele erra, você consegue desfazer?

Um agente que verifica o próprio trabalho carrega o mesmo viés que produziu o erro. Ele já
decidiu que aquilo estava certo quando escreveu. Pedir para ele revisar é pedir para ele
concordar consigo mesmo.

> Isto é **dívida técnica**, não falha: cada semana que passa, mais ações irreversíveis entram
> no sistema sem verificação, e mais caro fica separar o que precisa de gate do que não precisa.

---

## Como rodar

Dentro da pasta do projeto: `/auditoria-reversibilidade`
Ou peça: *"audita a reversibilidade das ações dos meus agentes"*.

---

## PASSO 1 — Mapear toda ação que o agente executa

Encontre tudo que o agente faz além de gerar texto. Procure por:

1. **Escrita em banco** — `INSERT`, `UPDATE`, `DELETE`, `upsert`, `.save()`, migrations
2. **Chamadas externas que mudam estado** — `POST`, `PUT`, `PATCH`, `DELETE` para qualquer API
3. **Comunicação com terceiros** — envio de e-mail, WhatsApp, SMS, DM, push
4. **Dinheiro** — cobrança, reembolso, alteração de plano, emissão de nota
5. **Arquivos** — escrever, sobrescrever, apagar, mover, upload
6. **Deploy e infra** — push, merge, deploy, restart, alteração de env var
7. **Permissão e acesso** — criar usuário, mudar role, revogar acesso

Para cada uma registre: **arquivo**, **linha**, **o que a ação faz**, **quem dispara**
(usuário, cron, webhook, outro agente) e **se existe alguma verificação antes**.

Ignore leitura pura (`SELECT`, `GET`, ler arquivo). Ler não quebra nada.

---

## PASSO 2 — Classificar cada ação

A pergunta que resolve é uma só: **esse erro você consegue desfazer?**

### 🟢 REVERSÍVEL — o agente roda sozinho
Dá para voltar atrás sem custo relevante e sem ninguém de fora perceber.

- Escrever rascunho, criar registro interno, gerar arquivo em pasta temporária
- Alterar dado que só a sua equipe vê
- Qualquer coisa com histórico/versionamento que permita rollback

**Critério:** se der errado, você corrige em minutos e ninguém além de você soube.

### 🟠 REVERSÍVEL COM CUSTO — precisa de log, não de gate
Dá para desfazer, mas alguém já viu ou já custou algo.

- Alterar dado de produção que aparece na tela do cliente
- Chamada paga a API externa (o dinheiro já saiu, mesmo desfazendo)
- Mudar configuração que afeta outros processos

**Critério:** dá para voltar, mas o estrago já aconteceu em algum grau. Exige log auditável
para você saber o que mudou e quando.

### 🔴 IRREVERSÍVEL — nunca sem segundo par de olhos
Depois que acontece, não tem volta.

- **Comunicação enviada** — e-mail, WhatsApp, DM, push. Mensagem entregue não se apaga
- **Dinheiro movimentado** — cobrança, reembolso, transferência
- **Dado de cliente exposto ou apagado** — vazamento, delete sem soft-delete
- **Deploy em produção** — inclusive rollback demora e o usuário já viu
- **Ação com terceiro** — postar publicamente, alterar dado em sistema de outro
- **Permissão concedida** — o acesso já foi usado antes de você revogar

**Critério:** se der errado, você não desfaz. Você gerencia a consequência.

---

## PASSO 3 — Cruzar com o que existe de verificação

Para cada ação irreversível encontrada, responda:

☐ Tem aprovação humana antes de executar?
☐ Tem um segundo agente conferindo, **com contexto separado** do que executou?
☐ Tem limite de escopo (quantidade, valor, destinatário) que impede estrago em massa?
☐ Tem log do que foi feito, com o suficiente para reconstruir a decisão?
☐ Tem modo de simulação (dry-run) para testar sem executar de verdade?

**Ação irreversível sem nenhum desses cinco é exposição direta.**

---

## PASSO 4 — O relatório

Entregue assim:

```
AÇÕES MAPEADAS: [n]
  🟢 Reversíveis: [n]
  🟠 Reversíveis com custo: [n]
  🔴 Irreversíveis: [n]

🔴 IRREVERSÍVEL SEM VERIFICAÇÃO — [n] ação(ões)
   [arquivo:linha] — [o que faz] — disparado por [quem]
   Consequência se errar: [concreta, não genérica]
   Correção sugerida: [gate humano / agente verificador / limite de escopo]

🟠 REVERSÍVEL COM CUSTO E SEM LOG — [n]
   [...]

🟢 OK — reversíveis, podem rodar sozinhas
   [...]
```

Ordene pelo que dói mais: irreversível sem verificação primeiro.

---

## A regra que fecha

Verificar custa. Dobra a chamada, dobra o token, e parece desperdício enquanto tudo funciona.
Por isso quase todo mundo corta essa etapa.

Até o dia em que o agente aprova o próprio erro e ninguém percebe por semanas.

**O agente que executa nunca deve ser o mesmo que verifica.** Se for o mesmo, não é verificação.
É confirmação.

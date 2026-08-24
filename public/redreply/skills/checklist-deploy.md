---
name: checklist-deploy
description: |
  Roda a verificação final antes de entregar um sistema para cliente. Confere o que acontece
  quando dá errado: erro tratado, log, backup, monitoramento, rollback, variáveis de ambiente.
  Os pontos que ninguém checa porque o sistema "está funcionando".
  Use quando disser "vou entregar pro cliente", "checklist de deploy", "/checklist-deploy".
---

# Checklist de Deploy — antes de colocar o nome na conta

A IA construiu. Você vai assinar embaixo.

Quando aquilo cair com cliente dentro, ninguém vai perguntar qual modelo você usou.

---

## Como rodar

Dentro da pasta do projeto: `/checklist-deploy`
Ou peça: *"roda o checklist antes de eu entregar isso"*.

---

## PASSO 1 — Onde isso vai rodar

Antes de verificar, entenda o destino:
1. **Ambiente** — Vercel, VPS, container, on-premise do cliente
2. **Quem opera depois** — você, o cliente, ninguém
3. **O que acontece se cair às 3h da manhã** — alguém é avisado?

A terceira pergunta define metade deste checklist.

---

## PASSO 2 — Os 12 pontos

#### 🔴 BLOQUEIA A ENTREGA

**1 · Erro sem tratamento em caminho crítico**
- `await` sem `try/catch` em pagamento, gravação, envio
- **Se ninguém arrumar:** o usuário vê tela branca e você descobre por reclamação

**2 · Erro devolvendo detalhe interno**
- `catch` que retorna `error.message`, `error.stack` ou o objeto cru
- **Se ninguém arrumar:** você entrega caminho de arquivo, estrutura e às vezes credencial

**3 · Sem backup do banco**
- Verifique se há rotina de backup e se alguém já testou restaurar
- **Se ninguém arrumar:** backup que nunca foi restaurado não é backup, é esperança

**4 · Variável de ambiente faltando em produção**
- Compare o que o código usa (`process.env.X`) com o que está declarado
- **Se ninguém arrumar:** funciona local, quebra no deploy — geralmente na frente do cliente

#### 🟠 CORRIJA ANTES

**5 · Sem log estruturado**
- `console.log` solto não serve para investigar incidente
- **Se ninguém arrumar:** o sistema cai e você não sabe por onde começar a olhar

**6 · Sem monitoramento ou alerta**
- Nenhum health check, nenhum aviso de erro
- **Se ninguém arrumar:** você descobre pela mensagem do cliente

**7 · Sem plano de rollback**
- Dá para voltar à versão anterior rápido?
- **Se ninguém arrumar:** deploy ruim vira madrugada de conserto

**8 · Migration sem caminho de volta**
- Alteração de schema sem `DOWN` e sem backup prévio
- **Se ninguém arrumar:** migration errada em produção não desfaz sozinha

**9 · Dependência de serviço externo sem plano B**
- O que acontece se a API de terceiro ficar fora?
- **Se ninguém arrumar:** a queda dele vira a sua queda

#### 🟡 VERIFIQUE

**10 · Sem página de erro própria**
- 404 e 500 mostrando tela padrão do framework

**11 · Timezone e formato de data**
- Servidor em UTC, cliente esperando horário local

**12 · Documentação mínima de operação**
- Como subir, como reiniciar, onde estão os logs, quem chamar
- Se quem opera depois não é você, isto deixa de ser opcional

---

## PASSO 3 — O laudo

```
CHECKLIST DE DEPLOY — <projeto>
Destino: <ambiente> · Opera depois: <quem>
Data: <data>

🔴 BLOQUEIA (N)
  [1] <ponto> — <arquivo:linha ou "ausente">
      Se ninguém arrumar: <consequência>
      Correção: <ação>

🟠 CORRIGIR ANTES (N)
🟡 VERIFICAR (N)

✅ PRONTO (N de 12)

────────────────────────────
VEREDITO: <PODE ENTREGAR | NÃO ENTREGUE AINDA>
SE CAIR ÀS 3H: <o que acontece hoje, em uma linha>
```

---

## Regras de execução

- **O veredito é binário.** Qualquer 🔴 aberto = NÃO ENTREGUE AINDA. Sem "quase pronto"
- **Ausência é achado.** Não encontrar rotina de backup não é "passou" — é 🔴, e o laudo deve
  dizer "ausente", não ficar em silêncio
- **A pergunta das 3h é obrigatória.** Se a resposta for "ninguém fica sabendo", isso vai no
  laudo com todas as letras
- **Não configure nada sozinha.** Esta skill verifica. Configurar monitoramento e backup envolve
  credencial e custo — decisão de quem opera

---

*Skill do @redpro.ia · A conta chega.*

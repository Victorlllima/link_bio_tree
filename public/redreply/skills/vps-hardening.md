---
name: vps-hardening
description: "Audita o hardening de uma VPS em dez checagens."
version: 0.1.0
author: Hermes
license: MIT
platforms: [linux]
metadata:
  hermes:
    tags: [Devops, Security, Vps, Auditoria]
---

# Auditoria de hardening de VPS

Percorre dez pontos de exposição de um servidor e devolve o estado de cada um,
com o comando que provou aquilo. Só leitura: nenhuma regra de firewall, config
de SSH ou container é alterada. Depende apenas do que já existe num Linux
comum, sem instalar nada.

## When to Use

- "audita a segurança da minha VPS"
- "essa VPS está exposta?"
- "roda o hardening check antes de eu subir o projeto"
- "meu agente vai rodar nessa máquina, ela está segura?"

## Prerequisites

Acesso de shell à máquina que será auditada, com `sudo` para ler
`sshd_config` efetivo e regras de firewall. Sem `sudo`, as checagens 1 e 2
voltam como "não verificável" em vez de passar.

Quando a VPS é remota, rode com o `terminal` já conectado nela (por SSH),
nunca a partir da máquina local, senão você audita o computador errado.

## How to Run

Invoque cada comando pelo `terminal` e leia a saída. Não use `--fix` de
ferramenta nenhuma, não edite arquivo, não reinicie serviço. A skill entrega
diagnóstico; quem muda é a pessoa.

## Quick Reference

| # | Checagem | Comando |
|---|---|---|
| 1 | Política do firewall | `sudo ufw status verbose` ou `sudo nft list ruleset` |
| 2 | SSH: senha e root | `sudo sshd -T \| grep -E 'permitrootlogin\|passwordauthentication'` |
| 3 | Renovação de TLS | `sudo certbot renew --dry-run` e `ls /etc/letsencrypt/renewal-hooks/deploy/` |
| 4 | Portas publicadas | `ss -ltnp` e `docker ps --format '{{.Names}} {{.Ports}}'` |
| 5 | Segredo no Git | `git log -p -S 'SECRET' -- . \| head` no repositório do projeto |
| 6 | Imagem fixada | `docker inspect --format '{{.Image}}' <container>` |
| 7 | Rate limit | `grep -r limit_req /etc/nginx/` |
| 8 | Autorização por objeto | revisão de código; sem comando |
| 9 | Log fora da máquina | `systemctl is-active rsyslog promtail vector filebeat` |
| 10 | Teste de restore | evidência do último restore feito |

## Procedure

1. **Firewall.** Rode `sudo ufw status verbose`. Procure `Default: deny (incoming)`.
   Se o ufw estiver inativo, rode `sudo nft list ruleset` e veja se existe policy
   drop na chain input. Firewall inativo e sem nftables é falha.

2. **SSH.** Rode `sudo sshd -T | grep -E 'permitrootlogin|passwordauthentication'`.
   O `sshd -T` mostra a config **efetiva**, que é o que vale; ler o
   `sshd_config` engana quando existe `Include` ou `Match`. Espere
   `permitrootlogin no` e `passwordauthentication no`.

3. **TLS.** Rode `sudo certbot renew --dry-run`. Depois liste
   `/etc/letsencrypt/renewal-hooks/deploy/`. Renovação que funciona sem hook de
   reload deixa o servidor entregando o certificado antigo até alguém recarregar.

4. **Portas.** Rode `ss -ltnp`. Toda linha em `0.0.0.0:` ou `[::]:` está exposta.
   Cruze com `docker ps --format '{{.Names}} {{.Ports}}'`: um mapeamento escrito
   `0.0.0.0:5432->5432/tcp` publica o banco na internet, enquanto
   `127.0.0.1:5432->5432/tcp` não.

5. **Segredo no Git.** No repositório do projeto, rode
   `git log -p -S 'SECRET' -- . | head -40`, trocando `SECRET` por um prefixo de
   chave real (`sk-`, `AKIA`, `-----BEGIN`). Achou em qualquer commit, a chave
   está comprometida mesmo que o arquivo de hoje esteja limpo.

6. **Imagem.** Para cada container, rode
   `docker inspect --format '{{.Config.Image}} {{.Image}}' <nome>`. Se o primeiro
   campo termina em `:latest`, o que roda hoje pode não ser o que você testou.

7. **Rate limit.** Rode `grep -r limit_req /etc/nginx/`. Sem nenhuma ocorrência,
   não existe limite de requisição. Confira também `systemctl is-active fail2ban`.

8. **Autorização.** Não tem comando. Escolha uma rota que devolve dado de
   usuário, troque o identificador na URL por outro que não seja seu e veja se o
   dado vem. Vindo, é IDOR.

9. **Log.** Rode `systemctl is-active rsyslog promtail vector filebeat`. Nenhum
   ativo significa log só local, que o invasor apaga junto com o rastro.

10. **Restore.** Pergunte a data do último restore testado. Sem data, não existe
    backup verificado, e o tempo de volta é desconhecido.

## Pitfalls

- `sshd_config` mente quando há `Include` ou bloco `Match`. Use sempre `sshd -T`.
- `ufw` inativo não quer dizer sem firewall: o provedor pode ter security group
  por fora, e aí a checagem 1 precisa ser feita no painel dele.
- Container em `network_mode: host` ignora o mapeamento de porta e escuta direto
  na interface do host. `docker ps` não mostra isso; confie no `ss -ltnp`.
- Auditar da máquina errada é o erro mais comum. Confirme o hostname antes.

## Verification

```
ss -ltnp | grep -E '0\.0\.0\.0|\[::\]' || echo "nada escutando em interface publica"
```

Uma auditoria que termina sem esse comando não terminou: ele é a prova final de
o que está aberto para a internet naquela máquina, independente do que a config
de cada serviço diga.

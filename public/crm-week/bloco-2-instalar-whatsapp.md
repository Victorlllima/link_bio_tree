# BLOCO 2 — Instalar o WhatsApp

O aluno já decidiu o caminho (Bloco 1). Agora você conecta o WhatsApp dele.
Siga **só o caminho escolhido**:

- Escolheu **VPS própria** → Caminho A (abaixo).
- Escolheu **UZAPI** → pule pro Caminho B (no fim deste arquivo).

Ao terminar qualquer um, o aluno tem o WhatsApp conectado e você vai pro
`bloco-3-agente-crm.md`.

---
---

# CAMINHO A — Evolution API na VPS do aluno

Você vai subir a Evolution (o programa que controla o WhatsApp) + o banco
(Postgres) + o cache (Redis) na VPS. Tudo em containers Docker: um comando sobe
os três, o aluno não configura banco nenhum à mão.

**PRIMEIRO, uma pergunta que define o caminho** — faça ao aluno antes de tudo:

> "Você tem um domínio próprio (tipo `seunegocio.com.br`) que a gente possa usar
> pro seu servidor? Ou prefere rodar sem domínio, direto pelo endereço de
> internet (IP) da máquina?"

- **TEM domínio** → Caminho A1 (com Traefik + HTTPS automático — igual à operação do Red).
- **NÃO tem / não quer** → Caminho A2 (sem Traefik, acesso por IP:porta — funciona igual pro agente).

Os dois entregam uma Evolution funcionando. A diferença é só o endereço final
(HTTPS com domínio vs. IP com porta) e um cadeado de segurança a mais no A1.

## Passo A.0 — Criar e preparar a VPS (comum aos dois)

1. **Criar a VPS.** Oriente o aluno a criar uma conta na **Hetzner**
   (console.hetzner.cloud) — recomendação do Red. Criar um servidor **CX22**
   (2 vCPU, 4 GB), imagem **Ubuntu 24.04**, no datacenter que ele preferir. Ele
   define uma senha de root ou chave SSH. **Anote o IP** que a Hetzner mostra.
   > Outras VPS (Contabo, DigitalOcean) funcionam igual — só muda o painel de
   > criação. O resto é idêntico.

2. **Entrar na VPS.** Do computador do aluno:
   ```
   ssh root@IP_DA_VPS
   ```
   (Ele digita a senha que definiu. Se usou chave SSH, entra direto.)

3. **Instalar o Docker** (é o motor que roda a Evolution):
   ```
   curl -fsSL https://get.docker.com | sh
   ```
   Confira: `docker --version` e `docker compose version` devem responder.

4. **Criar a pasta do projeto:**
   ```
   mkdir -p /opt/evolution && cd /opt/evolution
   ```

---

## Caminho A1 — COM domínio (Traefik + HTTPS)

### A1.1 — Apontar o domínio pro IP
Peça ao aluno pra ir no painel do domínio dele (Registro.br, Cloudflare, onde
comprou) e criar um registro **A** apontando um subdomínio pro IP da VPS:
```
Tipo: A   |   Nome: evo   |   Valor: IP_DA_VPS
```
Fica `evo.dominiodele.com.br`. Avise que a propagação leva de minutos a algumas
horas. Só siga quando `ping evo.dominiodele.com.br` responder o IP certo.

### A1.2 — Criar o `.env`
Gere senhas fortes (não reutilize as do Red). Crie `/opt/evolution/.env`:
```
# porta interna
SERVER_PORT=8080
SERVER_URL=https://evo.DOMINIODELE.com.br

# chave que protege a API — GERE uma aleatória forte e guarde
AUTHENTICATION_API_KEY=<gere_uma_chave_aleatoria_longa>

# banco (Postgres — sobe junto, o aluno não mexe)
DATABASE_ENABLED=true
DATABASE_PROVIDER=postgresql
DATABASE_CONNECTION_URI=postgresql://postgres:<SENHA_PG>@evolution-postgres:5432/evolution?schema=public
DATABASE_CONNECTION_CLIENT_NAME=evolution

# cache (Redis — sobe junto)
CACHE_REDIS_ENABLED=true
CACHE_REDIS_URI=redis://evolution-redis:6379/0
CACHE_REDIS_PREFIX_KEY=evolution
CACHE_LOCAL_ENABLED=false

# comportamento
LANGUAGE=pt-BR
CONFIG_SESSION_PHONE_CLIENT=RedPro
CONFIG_SESSION_PHONE_NAME=Chrome
QRCODE_LIMIT=30
DEL_INSTANCE=false

# variáveis que o Postgres container usa
POSTGRES_PASSWORD=<SENHA_PG>
POSTGRES_USER=postgres
POSTGRES_DB=evolution
```
Substitua `DOMINIODELE`, `<SENHA_PG>` e `AUTHENTICATION_API_KEY`. **Guarde a
AUTHENTICATION_API_KEY** — é ela que o agente vai usar pra falar com a Evolution.

### A1.3 — Criar o `docker-compose.yml` (com Traefik)
Crie `/opt/evolution/docker-compose.yml`:
```yaml
services:
  traefik:
    image: traefik:v3.1
    restart: always
    command:
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --entrypoints.web.http.redirections.entrypoint.to=websecure
      - --certificatesresolvers.le.acme.tlschallenge=true
      - --certificatesresolvers.le.acme.email=EMAIL_DO_ALUNO
      - --certificatesresolvers.le.acme.storage=/letsencrypt/acme.json
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik_le:/letsencrypt
    networks: [evolution-net]

  api:
    image: evoapicloud/evolution-api:latest
    restart: always
    depends_on: [redis, evolution-postgres]
    volumes:
      - evolution_instances:/evolution/instances
    env_file: [.env]
    networks: [evolution-net]
    labels:
      - traefik.enable=true
      - traefik.http.routers.evo.rule=Host(`evo.DOMINIODELE.com.br`)
      - traefik.http.routers.evo.entrypoints=websecure
      - traefik.http.routers.evo.tls.certresolver=le
      - traefik.http.services.evo.loadbalancer.server.port=8080

  redis:
    image: redis:7
    restart: always
    command: redis-server --port 6379 --appendonly yes
    volumes: [evolution_redis:/data]
    networks:
      evolution-net:
        aliases: [evolution-redis]

  evolution-postgres:
    image: postgres:15
    restart: always
    env_file: [.env]
    volumes: [evolution_pg:/var/lib/postgresql/data]
    networks:
      evolution-net:
        aliases: [evolution-postgres]

volumes:
  evolution_instances:
  evolution_redis:
  evolution_pg:
  traefik_le:

networks:
  evolution-net:
```
Troque `EMAIL_DO_ALUNO` e os dois `evo.DOMINIODELE.com.br`.

### A1.4 — Subir
```
cd /opt/evolution && docker compose up -d
```
Aguarde ~1 min. Teste: `curl https://evo.DOMINIODELE.com.br` deve responder um
JSON com `"version"`. Se der erro de certificado, espere mais um pouco (o
Let's Encrypt leva segundos a 1-2 min pra emitir). **Endereço final da Evolution:
`https://evo.DOMINIODELE.com.br`.**

---

## Caminho A2 — SEM domínio (IP:porta, sem Traefik)

Mais simples. A Evolution fica acessível por `http://IP_DA_VPS:8080`. Sem HTTPS —
o que é ok, porque o agente vai rodar na mesma rede/servidor e o acesso é
protegido pela AUTHENTICATION_API_KEY.

### A2.1 — Criar o `.env`
Igual ao A1.2, **mas** troque a linha do SERVER_URL:
```
SERVER_URL=http://IP_DA_VPS:8080
```
(o resto — banco, redis, chave — idêntico ao A1.2)

### A2.2 — Criar o `docker-compose.yml` (sem Traefik)
Crie `/opt/evolution/docker-compose.yml`:
```yaml
services:
  api:
    image: evoapicloud/evolution-api:latest
    restart: always
    depends_on: [redis, evolution-postgres]
    ports:
      - "8080:8080"
    volumes:
      - evolution_instances:/evolution/instances
    env_file: [.env]
    networks: [evolution-net]

  redis:
    image: redis:7
    restart: always
    command: redis-server --port 6379 --appendonly yes
    volumes: [evolution_redis:/data]
    networks:
      evolution-net:
        aliases: [evolution-redis]

  evolution-postgres:
    image: postgres:15
    restart: always
    env_file: [.env]
    volumes: [evolution_pg:/var/lib/postgresql/data]
    networks:
      evolution-net:
        aliases: [evolution-postgres]

volumes:
  evolution_instances:
  evolution_redis:
  evolution_pg:

networks:
  evolution-net:
```

> ⚠️ Segurança: como a porta 8080 fica aberta na internet, a
> AUTHENTICATION_API_KEY é a única proteção — **tem que ser forte**. No painel da
> Hetzner, opcionalmente crie um Firewall liberando só as portas 22 (SSH) e 8080.

### A2.3 — Subir
```
cd /opt/evolution && docker compose up -d
```
Teste: `curl http://IP_DA_VPS:8080` deve responder o JSON com `"version"`.
**Endereço final: `http://IP_DA_VPS:8080`.**

---

## Passo A.final — Conectar o número do WhatsApp (comum A1 e A2)

Agora o aluno pareia o celular dele com a Evolution.

1. Criar a instância (troque `<ENDERECO>` pelo endereço final e `<APIKEY>` pela
   AUTHENTICATION_API_KEY):
   ```
   curl -X POST "<ENDERECO>/instance/create" \
     -H "apikey: <APIKEY>" -H "Content-Type: application/json" \
     -d '{"instanceName":"comercial","integration":"WHATSAPP-BAILEYS","qrcode":true}'
   ```
   A resposta traz um QR Code (campo `base64`). Você pode abrir o **manager** no
   navegador (`<ENDERECO>/manager`) — é mais fácil pro aluno: ele loga com a
   apikey, cria/abre a instância `comercial` e vê o QR na tela.

2. **O aluno escaneia o QR** com o WhatsApp do número comercial:
   WhatsApp → Aparelhos conectados → Conectar aparelho → aponta pro QR.

3. Confirme que conectou:
   ```
   curl "<ENDERECO>/instance/connectionState/comercial" -H "apikey: <APIKEY>"
   ```
   Tem que responder `"state":"open"`. Aí o WhatsApp do aluno está no ar.

> ⚠️ Avise: esse número não pode ser o WhatsApp pessoal principal dele — use um
> número comercial dedicado. E não dispare mensagem em massa (risco de bloqueio);
> o agente é pra atender quem chama, não pra spam.

**Guarde pro Bloco 3:** o `<ENDERECO>`, a `<APIKEY>` e o nome da instância
(`comercial`). O agente vai precisar dos três.

Agora vá pro `bloco-3-agente-crm.md`.

---
---

# CAMINHO B — UZAPI (sem servidor próprio)

Bem mais curto: a UZAPI já tem o servidor rodando. O aluno só cria conta, conecta
o número e pega as credenciais.

1. **Criar conta na UZAPI** (uzapi.com.br — recomendação do Red pra quem não quer
   VPS). **Antes**, você (Claude Code) busca o preço atual dos planos no site da
   UZAPI e apresenta ao aluno em reais — não deixe ele descobrir sozinho, e não
   chute valor. Se não conseguir acessar o site, avise e peça pro aluno abrir
   uzapi.com.br e te dizer o valor do plano. Com o preço claro, ele escolhe o
   plano (costuma ser por número/mês) e cria a conta.

2. **Conectar o número:** no painel da UZAPI, ele cria uma instância/sessão e
   escaneia o QR Code com o WhatsApp comercial (WhatsApp → Aparelhos conectados →
   Conectar aparelho).

3. **Pegar as credenciais:** no painel, o aluno pega:
   - a **URL da API** da UZAPI (algo como `https://SEU-SUBDOMINIO.uzapi.com.br`),
   - o **token/apikey** da sessão dele.
   > Como a UZAPI muda detalhes com o tempo, se o painel estiver diferente, mande
   > o aluno procurar por "API", "token" ou "webhook" no menu, ou olhar a
   > documentação deles. O que você precisa: o endereço da API + o token.

4. **Anote os endpoints de envio e de webhook** da UZAPI (estão na doc deles). O
   Bloco 3 usa dois: um pra **receber** as mensagens (webhook) e um pra **enviar**
   resposta, se precisar.

> A UZAPI não usa a Evolution — a "linguagem" da API é um pouco diferente. No
> Bloco 3, ao montar o agente, use o formato de webhook e de envio da UZAPI
> (consulte a doc deles). A LÓGICA do agente é idêntica; só muda como ele recebe
> a mensagem e como responde.

**Guarde pro Bloco 3:** a URL da API da UZAPI e o token. Agora vá pro
`bloco-3-agente-crm.md`.

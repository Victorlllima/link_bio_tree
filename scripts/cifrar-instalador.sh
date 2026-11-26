#!/usr/bin/env bash
# Cifra o configurar-vps.sh e o pacote da Imersão para privado/instalador (rota protegida /instalar?k=CHAVE).
# Uso: scripts/cifrar-instalador.sh <configurar-vps.sh> <configurar-vps.tar.gz>
# A chave de cifra vem do cofre (redpro / INSTALADOR_CIFRA_KEY) e é a mesma da env da Vercel.
set -euo pipefail
cd "$(dirname "$0")/.."
[ $# -eq 2 ] || { echo "Uso: $0 <configurar-vps.sh> <configurar-vps.tar.gz>"; exit 1; }
grep -q '__IMERSAO_CHAVE__' "$1" || { echo "O configurar-vps.sh não tem o marcador __IMERSAO_CHAVE__."; exit 1; }
KEY=$(node ~/.claude/vault/vault-read.js --vault=redpro INSTALADOR_CIFRA_KEY)
mkdir -p privado/instalador
for par in "configurar-vps.sh:$1" "configurar-vps.tar.gz:$2"; do
  nome=${par%%:*}; orig=${par#*:}
  KEY="$KEY" node -e '
    const c=require("crypto"),fs=require("fs");
    const iv=c.randomBytes(12),k=Buffer.from(process.env.KEY,"hex");
    const e=c.createCipheriv("aes-256-gcm",k,iv);
    const d=Buffer.concat([e.update(fs.readFileSync(process.argv[1])),e.final()]);
    fs.writeFileSync(process.argv[2],Buffer.concat([iv,e.getAuthTag(),d]));' "$orig" "privado/instalador/$nome.enc"
  echo "  $nome  sha256 $(sha256sum "$orig" | cut -c1-16)…  →  privado/instalador/$nome.enc"
done

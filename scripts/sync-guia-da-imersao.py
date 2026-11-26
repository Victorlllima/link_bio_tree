#!/usr/bin/env python3
"""Puxa o Guia da Imersão (fonte: Rigel, imersao-arquiteto-qg/04-nossas-aulas/GUIA-DA-IMERSAO.md)
para a página /guia-da-imersao (ION, 26/11/2026).
Uso: python3 scripts/sync-guia-da-imersao.py [caminho-do-guia]
- Tira comentários HTML e marcadores [CONFERIR...].
- Prints: SÓ de guia-prints/ (versão borrada). Cada ![legenda](guia-prints/NN-x.png) vira [[print NN|legenda]]
  e a imagem vira privado/guia-da-imersao/prints/NN.webp (servida só depois da senha).
  Imagem de outra pasta (ex.: manual-prints/, que mostra IP) aborta o sync."""
import re, subprocess, sys
from pathlib import Path

FONTE = Path(sys.argv[1] if len(sys.argv) > 1 else
             "/home/redpro/Vibecoding/imersao-arquiteto-qg/04-nossas-aulas/GUIA-DA-IMERSAO.md")
RAIZ = Path(__file__).resolve().parent.parent / "privado/guia-da-imersao"
PRINTS = RAIZ / "prints"
PRINTS.mkdir(parents=True, exist_ok=True)

t = FONTE.read_text()
t = re.sub(r"<!--.*?-->", "", t, flags=re.S)
t = re.sub(r"\s*\*{0,2}\[CONFERIR[^\]]*\]\*{0,2}", "", t)

usados = set()
def img(m):
    alt, src = m.group(1), m.group(2)
    if not src.startswith("guia-prints/"):
        sys.exit(f"ERRO: imagem fora de guia-prints/: {src}")
    # NN-x.png -> "NN"; diaD-NN-x.png e diaD-desktop-NN-x.png -> "dD-NN" (Rigel, v10, 26/11)
    n = re.match(r"guia-prints/(?:dia(\d)-(?:desktop-)?)?(\d{2}[a-z]?)", src)
    if not n:
        sys.exit(f"ERRO: print sem número: {src}")
    num = f"d{n.group(1)}-{n.group(2)}" if n.group(1) else n.group(2)
    origem = FONTE.parent / src
    destino = PRINTS / f"{num}.webp"
    subprocess.run(["magick", str(origem), "-resize", "1600x1600>", "-quality", "82", str(destino)], check=True)
    usados.add(destino.name)
    return f"[[print {num}|{alt}]]"

t = re.sub(r"^!\[([^\]]*)\]\(([^)]+)\)\s*$", img, t, flags=re.M)
for velho in PRINTS.glob("*.webp"):
    if velho.name not in usados:
        velho.unlink()
(RAIZ / "guia.md").write_text(t)
print(f"ok: {len(t.split())} palavras, {len(usados)} prints -> {RAIZ}")

#!/usr/bin/env python3
"""Puxa o manual do aluno (fonte: ION, imersao-arquiteto-qg) para a página /configurar-vps.
Uso: python3 scripts/sync-configurar-vps.py [caminho-do-manual]
Tira nota interna, marcadores [CONFERIR...] e o H1 (vai no topo da página) e reposiciona os prints."""
import re, sys
from pathlib import Path

FONTE = Path(sys.argv[1] if len(sys.argv) > 1 else
             "/home/redpro/Vibecoding/imersao-arquiteto-qg/04-nossas-aulas/MANUAL-VPS-ALUNO.md")
DEST = Path(__file__).resolve().parent.parent / "privado/configurar-vps/manual.md"

t = FONTE.read_text()
t = re.sub(r"<!--.*?-->", "", t, flags=re.S)                     # nota interna
t = re.sub(r"^# .*\n", "", t, count=1, flags=re.M)               # H1
t = re.sub(r"\A(\s*(>.*)?\n)*\s*---\s*\n", "", t)                # cabeçalho em citação + 1º ---
t = re.sub(r"\s*\*{0,2}\[CONFERIR[^\]]*\]\*{0,2}", "", t)        # marcadores do ensaio
t = re.sub(r"\s*\((?:a|o) [A-Z][a-z]+ cresce a lista[^)]*\)", "", t)

# link do afiliado vem de variável de ambiente (IMERSAO_HOSTINGER_URL)
t = t.replace("Entre pelo link do Red", "Entre pelo [link do Red]({{LINK_HOSTINGER}})", 1)

# prints: cada um aparece uma vez, no ponto em que o aluno vê aquela tela
t = t.replace("[prints 04 e 05]", "[print 05]").replace(" [prints 06 e 07]", "")
t = re.sub(r'(\d\. Espere[^\n]*?)(\.)\s*$', r'\1\2 [prints 09 e 10]', t, count=1, flags=re.M)
t = re.sub(r'(Deu certo se: aparece um IP[^\n]*)$', r'\1 [print 11]', t, count=1, flags=re.M)
t = re.sub(r'(responda `n`[^\n]*)$', r'\1 [print 06]', t, count=1, flags=re.M)

proibido = [w for w in ("CONFERIR", "Amanda", "ION", "Rigel", "Orion", "IRIS", "<!--") if w in t]
if proibido:
    print("ATENÇÃO: o texto ainda cita", proibido)
nums = sorted(set(re.findall(r"\b(\d\d)\b", " ".join(re.findall(r"\[prints? [^\]]+\]", t)))))
print("prints citados:", nums)
DEST.write_text(t.lstrip())
print("ok ->", DEST)

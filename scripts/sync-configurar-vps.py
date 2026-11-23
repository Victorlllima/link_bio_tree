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

# ---- Console web, prints 12 e 13 (Rigel, 23/11) ----
def depois(padrao, extra, t, todas=False):
    """Acrescenta `extra` (linhas novas) depois da linha que casa com `padrao`."""
    r = re.compile(r'^(' + padrao + r'[^\n]*)$', re.M)
    if not r.search(t):
        print("AVISO: não achei a linha", padrao)
        return t
    return r.sub(lambda m: m.group(1) + "\n\n" + extra, t, count=0 if todas else 1)

if "do-release-upgrade" not in t:
    t = depois(r"\*\*4\.1 Abrir o Console web\.\*\*",
               "**Atenção:** ao abrir, o Console web pode mostrar \"New release '26.04.1 LTS' available\" e sugerir "
               "`do-release-upgrade`. **Não rode esse comando.** O instalador é feito para o Ubuntu 24.04. [print 12]", t)
t = re.sub(r"^1\. \*\*A sua chave pública\*\* \(só se não achou a do painel\)\.",
           "1. **A sua chave:** se você cadastrou a chave no painel, ele pergunta \"Usar essa mesma chave para o "
           "usuário hermes? [s/n]\". Responda `s`. Só pede para colar a chave se não achou a do painel. [print 13]",
           t, count=1, flags=re.M)
# 4B: o link com a chave já vem pronto no pedido
t = t.replace(", `COLE_AQUI_O_LINK_DO_PASSO_4.2` pelo endereço `https://redpro.com.br/instalar?k=...` do comando do 4.2, e", " e")

# ---- 📌 Guarde isto agora (Red, 23/11) ----
G = "📌 Guarde isto agora: "
t = depois(r"Deu certo se: o painel da Hostinger mostra a sua VPS",
           G + "o link do painel da Hostinger (`https://hpanel.hostinger.com`) e o e-mail da conta. Anote na sua [ficha da VPS](#ficha-da-minha-vps).", t)
t = depois(r"Deu certo se: aparece um IP",
           G + "o **IP** da VPS e o **nome do servidor** (começa com `srv`, aparece no painel). Pode ir num Google Docs: não é segredo. "
               "A **senha do root**, se você criou uma, vai só no gerenciador de senhas, nunca em documento.", t)
t = depois(r"Deu certo se: a última linha diz \*\*Tudo pronto\*\*",
           G + "o **nome e o @ de cada bot** e a **conta de IA** em que você fez o login (o e-mail do Claude ou do ChatGPT). "
               "O **token de cada bot** vai só no gerenciador de senhas.", t, todas=True)
t = re.sub(r"\n(## Passo 12 · )", "\n" + G + "a **conta de IA** em que você fez o login (o e-mail do Claude ou do ChatGPT). Anote na sua ficha.\n\n\\1", t, count=1)
t = depois(r"\*\*13\.1 Criar os bots\.\*\*",
           G + "o **nome e o @ de cada bot** (na ficha) e o **token de cada um** (só no gerenciador de senhas, nunca em documento ou chat).", t)

FICHA = """## Ficha da minha VPS
Copie, cole num Google Docs ou nas suas notas e preencha. Aqui só vai o que **não é segredo**: senha do root e tokens dos bots ficam no gerenciador de senhas.
```ficha
FICHA DA MINHA VPS (RedPro Academy)
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

"""
if "## Ficha da minha VPS" not in t:
    t = t.replace("## Comandos do dia a dia", FICHA + "## Comandos do dia a dia", 1)

proibido = [w for w in ("CONFERIR", "Amanda", "ION", "Rigel", "Orion", "IRIS", "<!--") if w in t]
if proibido:
    print("ATENÇÃO: o texto ainda cita", proibido)
nums = sorted(set(re.findall(r"\b(\d\d)\b", " ".join(re.findall(r"\[prints? [^\]]+\]", t)))))
print("prints citados:", nums)
DEST.write_text(t.lstrip())
print("ok ->", DEST)

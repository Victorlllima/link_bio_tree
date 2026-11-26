import { readFileSync } from "node:fs";
import path from "node:path";

/* Lê privado/guia-da-imersao/guia.md (gerado por scripts/sync-guia-da-imersao.py a partir do
   GUIA-DA-IMERSAO.md do Rigel) e transforma em blocos. Só roda no servidor, depois da senha.
   Títulos de nível 1 "# Dia N · ..." viram as âncoras #dia-N. "# SOUL" dentro de bloco de código
   não é título (o bloco de código é lido antes de tudo). */

export type Inline = string; // markdown curto: **negrito**, `código`, [link](url)

export type Item = { texto: Inline; marcar?: boolean; sub?: Inline[] };

export type Bloco =
  | { t: "dia"; id: string; num: string; texto: string }
  | { t: "h2"; id: string; texto: string }
  | { t: "h3"; id: string; texto: string }
  | { t: "sub"; texto: Inline }
  | { t: "p"; texto: Inline }
  | { t: "citacao"; linhas: Inline[] }
  | { t: "resultado"; texto: Inline }
  | { t: "ok"; texto: Inline }
  | { t: "alerta"; texto: Inline }
  | { t: "lista"; ordenada: boolean; itens: Item[] }
  | { t: "abas"; grupo: string; abas: { rotulo: string; texto: Inline }[] }
  | { t: "guarde"; texto: Inline }
  | { t: "codigo"; codigo: string; soul: boolean }
  | { t: "tabela"; cab: string[]; linhas: string[][] }
  | { t: "print"; num: string; legenda: string }
  | { t: "hr" };

export type Dia = { id: string; num: string; texto: string; secoes: { id: string; texto: string }[] };

const ABAS_SO = ["Windows", "Mac", "Linux"];
const ABAS_AGENTE = ["Claude Code", "Codex"];

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[`*]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

const RE_LI = /^(\d+\.|-) (.*)$/;
const RE_SUB = /^\s{2,}(?:\d+\.|-) (.*)$/;

export function lerGuia(): { blocos: Bloco[]; dias: Dia[] } {
  const md = readFileSync(path.join(process.cwd(), "privado", "guia-da-imersao", "guia.md"), "utf8");
  const L = md.split("\n");
  const blocos: Bloco[] = [];
  const dias: Dia[] = [];
  const usados = new Set<string>();
  const idUnico = (base: string) => {
    let id = base || "secao";
    for (let n = 2; usados.has(id); n++) id = `${base}-${n}`;
    usados.add(id);
    return id;
  };

  let i = 0;
  while (i < L.length) {
    const l = L[i];

    if (l.startsWith("```")) {
      const lang = l.slice(3).trim();
      const corpo: string[] = [];
      i++;
      while (i < L.length && !L[i].startsWith("```")) corpo.push(L[i++]);
      i++;
      const codigo = corpo.join("\n");
      blocos.push({ t: "codigo", codigo, soul: lang === "markdown" && codigo.startsWith("# SOUL") });
      continue;
    }

    if (!l.trim()) {
      i++;
      continue;
    }

    if (/^---+\s*$/.test(l)) {
      blocos.push({ t: "hr" });
      i++;
      continue;
    }

    const pr = l.match(/^\[\[print (\d{2})\|(.*)\]\]\s*$/);
    if (pr) {
      blocos.push({ t: "print", num: pr[1], legenda: pr[2] });
      i++;
      continue;
    }

    const h = l.match(/^(#{1,4}) (.*)$/);
    if (h) {
      const texto = h[2].trim();
      if (h[1] === "#") {
        const dia = texto.match(/^Dia (\d+) · (.*)$/);
        if (dia) {
          const id = idUnico(`dia-${dia[1]}`);
          blocos.push({ t: "dia", id, num: dia[1], texto: dia[2] });
          dias.push({ id, num: dia[1], texto: dia[2], secoes: [] });
        }
        // a capa ("# Guia da Imersão ...") vai no topo da página
      } else if (h[1] === "##") {
        const id = idUnico(slug(texto));
        blocos.push({ t: "h2", id, texto });
        dias.at(-1)?.secoes.push({ id, texto: texto.replace(/[`*]/g, "") });
      } else {
        blocos.push({ t: "h3", id: idUnico(slug(texto)), texto });
      }
      i++;
      continue;
    }

    if (l.startsWith("|")) {
      const linhas: string[][] = [];
      while (i < L.length && L[i].startsWith("|")) {
        const cel = L[i].split("|").slice(1, -1).map((c) => c.trim());
        if (!cel.every((c) => /^:?-+:?$/.test(c))) linhas.push(cel);
        i++;
      }
      blocos.push({ t: "tabela", cab: linhas[0] ?? [], linhas: linhas.slice(1) });
      continue;
    }

    if (l.startsWith(">")) {
      const linhas: string[] = [];
      while (i < L.length && L[i].startsWith(">")) {
        const x = L[i].replace(/^>\s?/, "").trim();
        if (x) linhas.push(x);
        i++;
      }
      blocos.push({ t: "citacao", linhas });
      continue;
    }

    const li = l.match(RE_LI);
    if (li) {
      const ordenada = li[1] !== "-";
      const itens: Item[] = [];
      while (i < L.length) {
        const sub = L[i].match(RE_SUB);
        if (sub && itens.length) {
          (itens.at(-1)!.sub ??= []).push(sub[1]);
          i++;
          continue;
        }
        const m = L[i].match(RE_LI);
        if (!m || (m[1] !== "-") !== ordenada) break;
        const caixa = m[2].match(/^\[[ x]\] (.*)$/);
        itens.push(caixa ? { texto: caixa[1], marcar: true } : { texto: m[2] });
        i++;
      }
      const rot = itens.map((it) => (it.sub ? null : it.texto.match(/^([^:]{2,20}):\s*(.*)$/)));
      const nomes = rot.map((r) => r?.[1].trim() ?? "");
      const ehSO = !ordenada && itens.length >= 2 && nomes.every((n) => ABAS_SO.includes(n));
      const ehAgente = !ordenada && itens.length >= 2 && nomes.every((n) => ABAS_AGENTE.includes(n));
      if (ehSO || ehAgente) {
        blocos.push({ t: "abas", grupo: ehSO ? "so" : "agente", abas: rot.map((r) => ({ rotulo: r![1].trim(), texto: r![2] })) });
      } else {
        blocos.push({ t: "lista", ordenada, itens });
      }
      continue;
    }

    const texto = l.trim();
    if (/^\*\*[^*]+\*\*$/.test(texto) || (/^\*\*\d+(\.\d+)? [^*]+\*\*/.test(texto) && texto.replace(/^\*\*[^*]+\*\*/, "").length < 90)) {
      blocos.push({ t: "sub", texto });
    } else if (texto.startsWith("📌 Guarde isto agora:")) {
      blocos.push({ t: "guarde", texto: texto.replace(/^📌 Guarde isto agora:\s*/, "") });
    } else if (texto.startsWith("Resultado:")) {
      blocos.push({ t: "resultado", texto: texto.replace(/^Resultado:\s*/, "") });
    } else if (texto.startsWith("Deu certo se:")) {
      blocos.push({ t: "ok", texto: texto.replace(/^Deu certo se:\s*/, "") });
    } else if (/^\*\*(Regra de ouro|Erro comum|Atenção|Importante|Cuidado)[^*]*\*\*/.test(texto)) {
      blocos.push({ t: "alerta", texto });
    } else {
      blocos.push({ t: "p", texto });
    }
    i++;
  }
  // a capa (título e "RedPro AI Academy") já está no topo da página: começa no Dia 1
  const inicio = blocos.findIndex((b) => b.t === "dia");
  return { blocos: inicio > 0 ? blocos.slice(inicio) : blocos, dias };
}

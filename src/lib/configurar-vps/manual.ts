import { readFileSync } from "node:fs";
import path from "node:path";

/* Lê privado/configurar-vps/manual.md (gerado por scripts/sync-configurar-vps.py a partir do
   manual do aluno) e transforma em blocos para a página. Só roda no servidor, depois da senha. */

export type Inline = string; // markdown curto: **negrito**, `código`, [link](url)

export type Bloco =
  | { t: "h1"; id: string; texto: string; rotulo: string }
  | { t: "botao"; texto: string; href: string }
  | { t: "passo"; id: string; num: string; texto: string }
  | { t: "h2"; id: string; texto: string }
  | { t: "h3"; id: string; texto: string }
  | { t: "sub"; texto: Inline } // linha só em negrito (ex.: **3.1 Abrir o terminal**)
  | { t: "p"; texto: Inline }
  | { t: "resultado"; texto: Inline }
  | { t: "ok"; texto: Inline }
  | { t: "alerta"; texto: Inline }
  | { t: "lista"; ordenada: boolean; itens: Inline[] }
  | { t: "abas"; grupo: string; abas: { rotulo: string; texto: Inline }[] }
  | { t: "guarde"; texto: Inline } // 📌 Guarde isto agora
  | { t: "codigo"; codigo: string; pedido: boolean; ficha?: boolean }
  | { t: "tabela"; cab: string[]; linhas: string[][] }
  | { t: "prints"; nums: string[] }
  | { t: "hr" };

export type Indice = { id: string; texto: string; num?: string }[];

const ABAS_SO = ["Windows", "Mac", "Linux"];
const ABAS_AGENTE = ["Claude Code", "Codex"];

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

const RE_PRINT = /\s*\[prints? ([0-9 e,]+)\]/g;

function tirarPrints(linha: string): { texto: string; nums: string[] } {
  const nums: string[] = [];
  const texto = linha.replace(RE_PRINT, (_m, g: string) => {
    nums.push(...(g.match(/\d{2}/g) ?? []));
    return "";
  });
  return { texto, nums };
}

export function lerManual(linkHostinger: string): { blocos: Bloco[]; indice: Indice } {
  let md = readFileSync(path.join(process.cwd(), "privado", "configurar-vps", "manual.md"), "utf8");
  md = linkHostinger
    ? md.replaceAll("{{LINK_HOSTINGER}}", linkHostinger)
    : md.replace(/\[([^\]]+)\]\(\{\{LINK_HOSTINGER\}\}\)/g, "$1");

  const L = md.split("\n");
  const blocos: Bloco[] = [];
  const indice: Indice = [];
  const jaMostrado = new Set<string>();
  let pendentes: string[] = [];

  const soltarPrints = () => {
    const nums = pendentes.filter((n) => !jaMostrado.has(n));
    nums.forEach((n) => jaMostrado.add(n));
    if (nums.length) blocos.push({ t: "prints", nums });
    pendentes = [];
  };
  const comPrints = (s: string) => {
    const r = tirarPrints(s);
    pendentes.push(...r.nums);
    return r.texto.trim();
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
      // bloco de texto corrido (pedido ao agente) vs. comando
      const pedido = lang === "pedido" || /^(Entre|Leia|Quero|Crie|Faça)\b/.test(codigo);
      blocos.push({ t: "codigo", codigo, pedido, ficha: lang === "ficha" });
      continue;
    }

    if (!l.trim()) {
      soltarPrints();
      i++;
      continue;
    }

    if (/^---+\s*$/.test(l)) {
      soltarPrints();
      blocos.push({ t: "hr" });
      i++;
      continue;
    }

    const h = l.match(/^(#{1,3}) (.*)$/);
    if (h) {
      soltarPrints();
      const texto = h[2].trim();
      const passo = texto.match(/^Passo (\w+) · (.*)$/);
      if (h[1] === "#") {
        const noite = texto.match(/^Noite (\d+) · (.*)$/);
        const rotulo = noite ? `Noite ${noite[1]}` : "Opcional";
        const tit = noite ? noite[2] : texto;
        blocos.push({ t: "h1", id: slug(texto), texto: tit, rotulo });
        indice.push({ id: slug(texto), texto: noite ? `${rotulo} · ${tit}` : texto });
      } else if (passo) {
        const id = `passo-${passo[1].toLowerCase()}`;
        blocos.push({ t: "passo", id, num: passo[1], texto: passo[2] });
        if (h[1] === "##") indice.push({ id, texto: passo[2], num: passo[1] });
      } else if (h[1] === "##") {
        const id = slug(texto);
        blocos.push({ t: "h2", id, texto });
        indice.push({ id, texto: texto.replace(/`/g, "") });
      } else {
        blocos.push({ t: "h3", id: slug(texto), texto });
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

    const li = l.match(/^(\d+\.|-) (.*)$/);
    if (li) {
      const ordenada = li[1] !== "-";
      const itens: string[] = [];
      while (i < L.length) {
        const m = L[i].match(/^(\d+\.|-) (.*)$/);
        if (!m || (m[1] !== "-") !== ordenada) break;
        itens.push(comPrints(m[2]));
        i++;
      }
      // Windows / Mac / Linux (ou os três agentes) viram abas
      const rot = itens.map((it) => it.match(/^([^:]{2,20}):\s*(.*)$/));
      const nomes = rot.map((r) => r?.[1].trim() ?? "");
      const ehSO = !ordenada && itens.length >= 2 && nomes.every((n) => ABAS_SO.includes(n));
      const ehAgente = !ordenada && itens.length >= 2 && nomes.every((n) => ABAS_AGENTE.includes(n));
      if (ehSO || ehAgente) {
        blocos.push({
          t: "abas",
          grupo: ehSO ? "so" : "agente",
          abas: rot.map((r) => ({ rotulo: r![1].trim(), texto: r![2] })),
        });
      } else {
        blocos.push({ t: "lista", ordenada, itens });
      }
      soltarPrints();
      continue;
    }

    const bt = l.match(/^\[\[botao: (.+)\|(https?:\/\/[^\]]+)\]\]$/);
    if (bt) {
      soltarPrints();
      blocos.push({ t: "botao", texto: bt[1].trim(), href: bt[2] });
      i++;
      continue;
    }

    const texto = comPrints(l.replace(/^>\s?/, "")); // citação vira parágrafo/alerta
    if (/^\*\*[^*]+\*\*$/.test(texto) || (/^\*\*\d+(\.\d+)? [^*]+\*\*/.test(texto) && texto.replace(/^\*\*[^*]+\*\*/, "").length < 90)) {
      blocos.push({ t: "sub", texto });
    } else if (texto.startsWith("📌 Guarde isto agora:")) {
      blocos.push({ t: "guarde", texto: texto.replace(/^📌 Guarde isto agora:\s*/, "") });
    } else if (texto.startsWith("Resultado:")) {
      blocos.push({ t: "resultado", texto: texto.replace(/^Resultado:\s*/, "") });
    } else if (texto.startsWith("Deu certo se:")) {
      blocos.push({ t: "ok", texto: texto.replace(/^Deu certo se:\s*/, "") });
    } else if (/^\*\*(Regra de ouro|Erro comum|Atenção)[^*]*\*\*/.test(texto)) {
      blocos.push({ t: "alerta", texto });
    } else {
      blocos.push({ t: "p", texto });
    }
    i++;
  }
  soltarPrints();
  return { blocos, indice };
}

export const LEGENDAS: Record<string, string> = {
  "01": "Planos de VPS da Hostinger: escolha o KVM 2.",
  "02": "Carrinho: troque o período de 24 para 12 meses.",
  "03": "Backup diário: deixe desmarcado.",
  "04": "Localização Brasil e a lista de sistemas.",
  "05": "Ubuntu 24.04 LTS e Confirmar.",
  "06": "A chave criada no terminal. Neste exemplo o nome do arquivo foi trocado; você pode só dar Enter.",
  "07": "O erro comum: a linha SHA256 colada no lugar da chave pública.",
  "08": "Recursos adicionais: os dois desmarcados.",
  "09": "A Hostinger configurando a VPS (cerca de 3 minutos).",
  "10": "VPS pronta: o comando de acesso mostra o seu IP (borrado aqui).",
  "11": "Painel da VPS em atividade, com o IP (borrado aqui).",
  "12": "Console web aberto. O aviso de \"New release 26.04\" aparece: não rode o do-release-upgrade.",
  "13": "Instalador nas etapas 1 a 3. Na pergunta da chave, responda s.",
};

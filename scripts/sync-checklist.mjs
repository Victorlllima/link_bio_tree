#!/usr/bin/env node
/**
 * sync-checklist.mjs
 * ------------------
 * Fonte de verdade: o checklist em Markdown (hub do projeto Starlight).
 * Este script parseia o .md e regenera SÓ o array `export const TASKS` do tasks.ts.
 * Tudo o mais no tasks.ts (tipos, FRENTES, DRIVE, FASES_TABARI) fica intacto.
 *
 * O progresso da Gleyce (concluído/responsável) vive no banco Supabase,
 * indexado por `id`. Enquanto os ids não mudam, o progresso é preservado.
 *
 * Uso:
 *   node scripts/sync-checklist.mjs [caminho-do-md]
 * Sem argumento, usa o path padrão abaixo.
 */

import fs from "node:fs";
import path from "node:path";

const DEFAULT_MD =
  "c:/Users/RedPro/Desktop/Projetos/Vibecoding/Starlight/Método Tabari/LPSG RedPro/CHECKLIST-OPERACIONAL.md";
const TASKS_TS = path.resolve(
  new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"),
  "../src/app/lpsg/tasks.ts"
);

const mdPath = process.argv[2] || DEFAULT_MD;

// ---- helpers ----
const RESP = new Set(["victor", "gleyce", "ambos"]);
const RECORR = new Set(["unica", "semanal"]);

function esc(s) {
  // escapa aspas duplas e barras invertidas para string TS
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function parseMarkdown(md) {
  const lines = md.split(/\r?\n/);
  const tasks = [];
  const tutoriais = {}; // id -> { titulo, passos: [] }
  let currentFrente = null;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // cabeçalho de frente: "## <emoji> <id> · <título>"
    const mFrente = line.match(/^##\s+\S+\s+([a-z0-9-]+)\s+·\s+.+$/);
    if (mFrente) {
      currentFrente = mFrente[1];
      i++;
      continue;
    }

    // bloco de tutorial: "### TUTORIAL: <id>"
    const mTut = line.match(/^###\s+TUTORIAL:\s+([a-z0-9-]+)\s*$/);
    if (mTut) {
      const tid = mTut[1];
      i++;
      // 1ª linha não-vazia = título
      while (i < lines.length && !lines[i].trim()) i++;
      const titulo = (lines[i] || "").trim();
      i++;
      const passos = [];
      while (i < lines.length) {
        const l = lines[i];
        const mp = l.match(/^-\s+(.*)$/);
        if (mp) {
          passos.push(mp[1].trim());
          i++;
        } else if (!l.trim()) {
          i++;
          break;
        } else if (l.startsWith("#")) {
          break;
        } else {
          i++;
        }
      }
      tutoriais[tid] = { titulo, passos };
      continue;
    }

    // linha de tarefa numa tabela: | id | resp | recorr | ⚠ | tarefa | detalhe |
    if (
      currentFrente &&
      line.startsWith("|") &&
      !/^\|\s*id\s*\|/.test(line) && // ignora header
      !/^\|[\s:|-]+\|$/.test(line) // ignora separador
    ) {
      const cells = line.split("|").slice(1, -1).map((c) => c.trim());
      if (cells.length >= 5) {
        const [id, resp, recorr, warn, label, detalhe = ""] = cells;
        if (id && RESP.has(resp) && RECORR.has(recorr)) {
          tasks.push({
            id,
            frente: currentFrente,
            sugestao: resp,
            recorrencia: recorr,
            pendencia: warn.toUpperCase() === "P",
            label,
            detalhe,
            ordem: null, // atribuída por frente abaixo
          });
        }
      }
    }
    i++;
  }

  // ordem sequencial por frente (na ordem em que aparecem)
  const contadorFrente = {};
  for (const t of tasks) {
    contadorFrente[t.frente] = (contadorFrente[t.frente] || 0) + 1;
    t.ordem = contadorFrente[t.frente];
  }

  return { tasks, tutoriais };
}

function taskToTs(t, tutoriais) {
  const parts = [`id: "${esc(t.id)}"`, `frente: "${esc(t.frente)}"`, `ordem: ${t.ordem}`, `sugestao: "${t.sugestao}"`];
  if (t.pendencia) parts.push("pendencia: true");
  parts.push(`recorrencia: "${t.recorrencia}"`);
  parts.push(`label: "${esc(t.label)}"`);
  if (t.detalhe) parts.push(`detalhe: "${esc(t.detalhe)}"`);
  const tut = tutoriais[t.id];
  if (tut) {
    const passos = tut.passos.map((p) => `        "${esc(p)}",`).join("\n");
    parts.push(
      `tutorial: {\n      titulo: "${esc(tut.titulo)}",\n      passos: [\n${passos}\n      ],\n    }`
    );
  }
  return `  { ${parts.join(", ")} },`;
}

function main() {
  if (!fs.existsSync(mdPath)) {
    console.error("❌ .md não encontrado:", mdPath);
    process.exit(1);
  }
  const md = fs.readFileSync(mdPath, "utf8");
  const { tasks, tutoriais } = parseMarkdown(md);

  if (!tasks.length) {
    console.error("❌ Nenhuma tarefa parseada — verifique o formato do .md.");
    process.exit(1);
  }

  // valida ids únicos
  const seen = new Set();
  for (const t of tasks) {
    if (seen.has(t.id)) {
      console.error(`❌ id duplicado: "${t.id}" — cada tarefa precisa de id único.`);
      process.exit(1);
    }
    seen.add(t.id);
  }

  const ts = fs.readFileSync(TASKS_TS, "utf8");
  const startMarker = "export const TASKS: Task[] = [";
  const startIdx = ts.indexOf(startMarker);
  if (startIdx === -1) {
    console.error("❌ Não achei 'export const TASKS' no tasks.ts");
    process.exit(1);
  }
  // fecha no primeiro "];" após o start
  const endIdx = ts.indexOf("\n];", startIdx);
  if (endIdx === -1) {
    console.error("❌ Não achei o fim do array TASKS.");
    process.exit(1);
  }

  const body = tasks.map((t) => taskToTs(t, tutoriais)).join("\n");
  const novo =
    ts.slice(0, startIdx) +
    startMarker +
    "\n" +
    body +
    "\n" +
    ts.slice(endIdx + 1); // +1 pula o \n; mantém "];"

  fs.writeFileSync(TASKS_TS, novo, "utf8");
  console.log(`✅ tasks.ts sincronizado: ${tasks.length} tarefas, ${Object.keys(tutoriais).length} tutoriais.`);
  console.log("   Rode: npx tsc --noEmit -p tsconfig.json  → depois git push.");
}

main();

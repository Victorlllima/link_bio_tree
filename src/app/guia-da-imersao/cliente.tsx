"use client";

import { useEffect, useState, type ReactNode } from "react";

/* Peças com clique do Guia da Imersão (vieram da /configurar-vps): copiar comando e abas por sistema/agente.
   A aba escolhida vale para a página inteira (escolheu Mac uma vez, todas as abas viram Mac). */

async function copiarTexto(texto: string) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = texto;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

export function BotaoCopiar({ texto, rotulo = "Copiar", mini = false }: { texto: string; rotulo?: string; mini?: boolean }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className={mini ? "cv-copiar cv-copiar-mini" : "cv-copiar"}
      aria-label={`${rotulo}: ${texto.slice(0, 40)}`}
      onClick={async () => {
        if (await copiarTexto(texto)) {
          setOk(true);
          setTimeout(() => setOk(false), 1600);
        }
      }}
    >
      {ok ? "Copiado ✓" : rotulo}
    </button>
  );
}

const EVENTO = "cv-aba";

function abaInicial(grupo: string, rotulos: string[]): string {
  if (typeof window === "undefined") return rotulos[0];
  try {
    const salva = localStorage.getItem(`cv-aba-${grupo}`);
    if (salva && rotulos.includes(salva)) return salva;
  } catch {}
  if (grupo === "so") {
    const ua = navigator.userAgent;
    if (/Mac OS X|Macintosh/.test(ua) && rotulos.includes("Mac")) return "Mac";
    if (/Linux/.test(ua) && !/Android/.test(ua) && rotulos.includes("Linux")) return "Linux";
    if (rotulos.includes("Windows")) return "Windows";
  }
  return rotulos[0];
}

export function Abas({ grupo, rotulos, paineis }: { grupo: string; rotulos: string[]; paineis: ReactNode[] }) {
  const [ativa, setAtiva] = useState(rotulos[0]);

  useEffect(() => {
    setAtiva(abaInicial(grupo, rotulos));
    const ouvir = (e: Event) => {
      const d = (e as CustomEvent<{ grupo: string; aba: string }>).detail;
      if (d.grupo === grupo && rotulos.includes(d.aba)) setAtiva(d.aba);
    };
    window.addEventListener(EVENTO, ouvir);
    return () => window.removeEventListener(EVENTO, ouvir);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grupo]);

  const escolher = (aba: string) => {
    setAtiva(aba);
    try {
      localStorage.setItem(`cv-aba-${grupo}`, aba);
    } catch {}
    window.dispatchEvent(new CustomEvent(EVENTO, { detail: { grupo, aba } }));
  };

  return (
    <div className="cv-abas">
      <div className="cv-abas-barra" role="tablist">
        {rotulos.map((r) => (
          <button
            key={r}
            type="button"
            role="tab"
            aria-selected={r === ativa}
            className={r === ativa ? "cv-aba cv-aba-on" : "cv-aba"}
            onClick={() => escolher(r)}
          >
            {r}
          </button>
        ))}
      </div>
      {rotulos.map((r, i) => (
        <div key={r} role="tabpanel" hidden={r !== ativa} className="cv-abas-painel">
          {paineis[i]}
        </div>
      ))}
    </div>
  );
}

// Abriu com #dia-2 (ou outra âncora): rola até lá depois que a página assentar (fontes e prints mexem no layout)
export function IrParaAncora() {
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const ir = () => document.getElementById(id)?.scrollIntoView({ block: "start" });
    ir();
    const t = setTimeout(ir, 350);
    document.fonts?.ready.then(ir).catch(() => {});
    return () => clearTimeout(t);
  }, []);
  return null;
}

// Tela de senha: leva a âncora do link (#dia-2) junto com a senha, porque o navegador não manda o # ao servidor
export function AncoraNoForm() {
  useEffect(() => {
    const campo = document.getElementById("gi-ancora") as HTMLInputElement | null;
    const por = () => {
      if (campo) campo.value = location.hash.slice(1).replace(/[^a-z0-9-]/gi, "");
    };
    por();
    campo?.form?.addEventListener("submit", por);
    window.addEventListener("hashchange", por);
    return () => {
      campo?.form?.removeEventListener("submit", por);
      window.removeEventListener("hashchange", por);
    };
  }, []);
  return null;
}

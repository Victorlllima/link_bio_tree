"use client";

import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   Countdown: 23/jul/2026 15h00 GMT-3 = 18h00 UTC
───────────────────────────────────────────── */
function useCountdown(targetISO: string) {
  const [diff, setDiff] = useState<number>(0);

  useEffect(() => {
    const target = new Date(targetISO).getTime();
    const tick = () => setDiff(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  const totalSeconds = Math.floor(diff / 1000);
  const days    = Math.floor(totalSeconds / 86400);
  const hours   = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, over: diff === 0 };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, "0");
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minWidth: "64px",
    }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontVariantNumeric: "tabular-nums",
        fontSize: "clamp(36px, 6vw, 56px)",
        fontWeight: 700,
        color: "#e8d5b7",
        lineHeight: 1,
        letterSpacing: "-0.03em",
      }}>
        {str}
      </span>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "10px",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "#a3a3a3",
        marginTop: "6px",
        opacity: 0.7,
      }}>
        {label}
      </span>
    </div>
  );
}

export function SharkCountdown() {
  const { days, hours, minutes, seconds, over } = useCountdown("2026-07-23T18:00:00Z");
  const sep = (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "clamp(28px, 5vw, 44px)",
      fontWeight: 300,
      color: "rgba(232,213,183,0.3)",
      lineHeight: 1,
      alignSelf: "flex-start",
      marginTop: "4px",
    }}>
      :
    </span>
  );

  if (over) {
    return (
      <p style={{
        fontFamily: "'Cormorant Garant', serif",
        fontSize: "clamp(22px, 4vw, 32px)",
        fontWeight: 700,
        color: "#e8d5b7",
        textAlign: "center",
        letterSpacing: "-0.02em",
      }}>
        O carrinho está aberto agora.
      </p>
    );
  }

  return (
    <div
      role="timer"
      aria-label="Tempo restante para abertura do carrinho"
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      <CountdownUnit value={days}    label="dias"     />
      {sep}
      <CountdownUnit value={hours}   label="horas"    />
      {sep}
      <CountdownUnit value={minutes} label="minutos"  />
      {sep}
      <CountdownUnit value={seconds} label="segundos" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main form
───────────────────────────────────────────── */
type FormState = "idle" | "loading" | "success" | "error";

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(232,213,183,0.2)",
  borderRadius: "8px",
  padding: "16px 20px",
  color: "#f5f5f5",
  fontSize: "16px",
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 400,
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s ease",
};

export default function SharkForm() {
  const [nome, setNome]   = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [erro, setErro]   = useState("");
  const successRef        = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!nome.trim()) {
      setErro("Informe seu nome para continuar.");
      return;
    }
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      setErro("Informe um e-mail válido.");
      return;
    }

    setState("loading");
    try {
      const res = await fetch("/api/shark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome:  nome.trim(),
          email: email.trim().toLowerCase(),
        }),
      });

      if (!res.ok) throw new Error("server_error");

      const data = await res.json();
      setState("success");
      (window as any).fbq?.("track", "Lead", { content_name: "SHARK Lista de Espera" }, { eventID: data.event_id });
      setTimeout(() => {
        successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    } catch {
      setState("error");
      setErro("Algo deu errado. Tente novamente.");
    }
  }

  /* ── Success state ── */
  if (state === "success") {
    return (
      <div
        ref={successRef}
        style={{ textAlign: "center", padding: "8px 0" }}
      >
        {/* Check icon */}
        <div style={{
          margin: "0 auto 20px",
          width: "56px", height: "56px",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid rgba(232,213,183,0.3)",
          borderRadius: "50%",
          background: "rgba(232,213,183,0.06)",
        }}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <circle cx="13" cy="13" r="12" stroke="#e8d5b7" strokeWidth="1.5" />
            <polyline
              points="7,13 11,17 19,9"
              stroke="#e8d5b7" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </div>

        <p style={{
          fontFamily: "'Cormorant Garant', serif",
          fontSize: "clamp(22px, 4vw, 28px)",
          fontWeight: 700,
          color: "#f5f5f5",
          letterSpacing: "-0.02em",
          marginBottom: "8px",
        }}>
          Você está na lista.
        </p>
        <p style={{
          color: "#a3a3a3",
          fontSize: "15px",
          fontWeight: 300,
          lineHeight: 1.6,
          marginBottom: "24px",
        }}>
          Vamos te avisar quando o carrinho abrir em{" "}
          <strong style={{ color: "#e8d5b7", fontWeight: 500 }}>23 de julho</strong>.
        </p>

        <div style={{
          width: "40px", height: "1px",
          background: "rgba(232,213,183,0.2)",
          margin: "0 auto 20px",
        }} />

        <p style={{
          color: "#a3a3a3",
          fontSize: "14px",
          fontWeight: 300,
          marginBottom: "14px",
        }}>
          Quer receber aviso também pelo WhatsApp?
        </p>

        <a
          href="https://wa.me/5561910889602"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(37,211,102,0.09)",
            border: "1px solid rgba(37,211,102,0.22)",
            color: "#4ade80",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: "15px",
            padding: "13px 28px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20.472 3.528A11.94 11.94 0 0 0 12 0C5.373 0 0 5.373 0 12c0 2.116.553 4.2 1.604 6.025L0 24l6.15-1.613A11.966 11.966 0 0 0 12 24c6.627 0 12-5.373 12-12 0-3.204-1.248-6.217-3.528-8.472Z"
              fill="#25D366"
            />
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.669.149-.198.297-.768.967-.941 1.166-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.457.13-.605.134-.133.298-.347.446-.521.149-.172.198-.296.298-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347Z"
              fill="white"
            />
          </svg>
          Entrar no grupo →
        </a>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "16px",
      }}>
        <input
          type="text"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          disabled={state === "loading"}
          style={inputStyle}
          onFocus={(e)  => { e.currentTarget.style.borderColor = "rgba(232,213,183,0.5)"; }}
          onBlur={(e)   => { e.currentTarget.style.borderColor = "rgba(232,213,183,0.2)"; }}
          autoComplete="given-name"
        />
        <input
          type="email"
          placeholder="Seu melhor e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === "loading"}
          style={inputStyle}
          onFocus={(e)  => { e.currentTarget.style.borderColor = "rgba(232,213,183,0.5)"; }}
          onBlur={(e)   => { e.currentTarget.style.borderColor = "rgba(232,213,183,0.2)"; }}
          autoComplete="email"
        />
      </div>

      {(state === "error" || erro) && (
        <p style={{
          color: "#ef4444",
          fontSize: "13px",
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: "12px",
          letterSpacing: "0.02em",
        }}>
          {erro || "Algo deu errado. Tente novamente."}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        style={{
          width: "100%",
          background: state === "loading" ? "rgba(232,213,183,0.4)" : "#e8d5b7",
          color: "#080808",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          fontSize: "17px",
          letterSpacing: "-0.01em",
          padding: "18px 32px",
          borderRadius: "8px",
          border: "none",
          cursor: state === "loading" ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {state === "loading" ? (
          <>
            <span style={{
              display: "inline-block",
              width: "16px",
              height: "16px",
              border: "2px solid rgba(8,8,8,0.3)",
              borderTopColor: "#080808",
              borderRadius: "50%",
              animation: "shark-spin 0.7s linear infinite",
              flexShrink: 0,
            }} />
            Entrando na lista...
          </>
        ) : (
          "Entrar na lista de espera"
        )}
      </button>

      <style>{`
        @keyframes shark-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}

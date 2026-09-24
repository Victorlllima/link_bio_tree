import type { ReactNode } from "react";

/**
 * A /squad carrega as mesmas fontes das capas dos módulos: Instrument Serif itálica
 * para o nome do módulo e Instrument Sans para o resto. É o que amarra a página à
 * arte que o aluno vê na área de membros.
 */
export default function SquadLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap"
                rel="stylesheet"
            />
            <style>{`
        .squad-root { font-family: 'Instrument Sans', ui-sans-serif; }
        .squad-serif { font-family: 'Instrument Serif', Georgia, serif; }
        .squad-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
      `}</style>
            {children}
        </>
    );
}

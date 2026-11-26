import { BASE } from "@/lib/demo-loja/loja";

export function Topo({ qtd }: { qtd: number }) {
  return (
    <>
      <p className="rc-faixa">Loja de demonstração da Imersão Arquiteto de Agentes. Só aceita cartão de teste.</p>
      <header className="rc-topo">
        <a href={BASE} className="rc-marca" aria-label="RedPro Commerce, início">
          <span className="rc-marca-ico" aria-hidden="true">R</span>
          <span>
            RedPro <b>Commerce</b>
          </span>
        </a>
        <a href={`${BASE}/carrinho`} className="rc-carrinho-link" id="ver-carrinho">
          Carrinho <span className="rc-badge">{qtd}</span>
        </a>
      </header>
    </>
  );
}

export function Rodape() {
  return (
    <footer className="rc-rodape">
      RedPro Commerce é uma loja fictícia, criada para a demonstração ao vivo da Imersão. Nenhuma compra é real e
      nenhum produto é entregue.
    </footer>
  );
}

export function Console() {
  // ilustração genérica (não é foto nem arte de marca)
  return (
    <svg viewBox="0 0 320 320" className="rc-ilus" role="img" aria-label="Ilustração de um console de videogame">
      <defs>
        <linearGradient id="rcg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#2a2d3a" />
          <stop offset="1" stopColor="#0d0e12" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="320" rx="28" fill="url(#rcg)" />
      <path d="M118 46c18-6 38-6 56 0l6 228c-22 6-46 6-68 0z" fill="#f2f2f4" />
      <path d="M150 50h20l4 222h-28z" fill="#15161b" />
      <path d="M182 52c16 4 28 12 34 24l-20 196c-6 2-12 3-18 4z" fill="#e6e7ea" />
      <path d="M112 52c-16 4-28 12-34 24l20 196c6 2 12 3 18 4z" fill="#e6e7ea" />
      <circle cx="160" cy="286" r="4" fill="#4458FF" />
    </svg>
  );
}

import Image from "next/image";

export const metadata = {
  title: "Matrícula Confirmada — RedPro AI Academy",
  robots: { index: false },
};

export default function ObrigadoPage() {
  return (
    <main className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-4 py-12">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(249,115,22,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative w-full max-w-md text-center">
        <div className="flex justify-center mb-10">
          <Image
            src="/logo-academy.png"
            alt="RedPro AI Academy"
            width={160}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>

        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-white font-bold text-2xl sm:text-3xl mb-3">
          Matrícula confirmada!
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          Bem-vindo à RedPro AI Academy.<br className="hidden sm:block" />
          Você vai receber um e-mail com os próximos passos em instantes.
        </p>

        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 text-left mb-8 backdrop-blur-sm">
          <p className="text-orange-500 text-xs font-semibold tracking-widest uppercase mb-4">
            O que acontece agora
          </p>
          <ul className="space-y-3">
            {[
              "Verifique seu e-mail — te enviamos o acesso",
              "Entre no grupo do WhatsApp pelo link no e-mail",
              "A Live de boas-vindas começa em breve — fique de olho",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-500 text-xs font-bold">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <a
          href="https://instagram.com/redpro.ia"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 text-black text-sm font-bold hover:bg-orange-400 active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20"
        >
          Seguir @redpro.ia no Instagram →
        </a>

        <p className="text-zinc-700 text-xs mt-8">
          Dúvidas? Fale no WhatsApp:{" "}
          <a href="https://wa.me/5561910896022" className="text-zinc-500 hover:text-orange-500 transition-colors underline underline-offset-2">
            (61) 9108-9602
          </a>
        </p>
      </div>
    </main>
  );
}

import Image from "next/image";

export const metadata = {
  title: "Ficha Recebida — RedPro AI Academy",
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
            width={640}
            height={192}
            className="h-48 w-auto object-contain"
            priority
          />
        </div>

        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-white font-bold text-2xl sm:text-3xl mb-3">
          Ficha recebida!
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          Obrigado por preencher. Agora pode fechar essa página<br className="hidden sm:block" />
          e continuar assistindo o curso de onde parou.
        </p>

        <a
          href="https://instagram.com/redpro.ia"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 text-black text-sm font-bold hover:bg-orange-400 active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20"
        >
          Seguir @redpro.ia no Instagram →
        </a>
      </div>
    </main>
  );
}

export function Footer() {
    return (
        <footer className="relative py-12 px-4 bg-black border-t border-white/5">
            <div className="max-w-7xl mx-auto text-center">
                <p className="text-neutral-500 text-sm">
                    © 2026{" "}
                    <a
                        href="https://redpro.com.br"
                        className="text-red-500 hover:text-red-400 transition-colors font-medium"
                    >
                        RedPro
                    </a>
                    . Todos os direitos reservados. Feito com 🦈 pelo Método S.H.A.R.K.
                </p>
            </div>
        </footer>
    );
}

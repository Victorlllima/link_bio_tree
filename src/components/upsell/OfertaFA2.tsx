import { mono } from "./fonts";
import base from "./oferta.module.css";
import s from "./jornada.module.css";
import PainelMeses from "./PainelMeses";
import Revela from "./Revela";
import { ENTRADA, FORMATO, JORNADA } from "./jornada";
import { MENTORIA, OFERTA_1 } from "./config";

// Oferta de upgrade para a FA² no obrigado do EA² (one-time offer, oferta Hotmart ioehae1s).
// Estrutura: promessa + painel (assinatura) · como é cada mês · jornada mês a mês e aula a aula ·
// o que entra · preço com âncora · garantia · botão.
const nb = (v: string) => v.replace(/ /g, "\u00a0");

export default function OfertaFA2({ checkout }: { checkout: string }) {
  return (
    <section className={s.oferta} aria-labelledby="oferta-fa2">
      <div className={`${s.oto} ${mono.className}`}>
        <i className={s.otoLed} />
        Oferta única · aparece só nesta página
      </div>

      <div className={s.miolo}>
        <span className={`${s.eyebrow} ${mono.className}`}>Upgrade · 6 meses ao vivo comigo</span>
        <h2 id="oferta-fa2" className={s.titulo}>
          Upgrade para a <em>Formação Arquiteto de Agentes</em>
        </h2>
        <p className={s.lead}>{MENTORIA.promessa}</p>
        <p className={s.ponte}>
          No EA² você recebe os agentes. Na FA² eu acompanho você colocando esses agentes para trabalhar em cada área da sua empresa, uma por mês, até a operação inteira rodar.
        </p>

        <PainelMeses areas={JORNADA.map(({ mes, curto }) => ({ mes, curto }))} />

        <h3 className={s.h3}>Como é cada mês</h3>
        <p className={s.sub}>Toda terça, das 15h às 18h, ao vivo comigo. São 4 aulas por mês, sempre no mesmo ritmo.</p>
        <div className={s.formato}>
          {FORMATO.map((f) => (
            <div key={f.quando} className={s.formatoCard}>
              <span className={`${s.formatoQuando} ${mono.className}`}>{f.quando}</span>
              <strong className={s.formatoTitulo}>{f.titulo}</strong>
              <p>{f.texto}</p>
              <ol className={s.passos}>
                {f.passos.map((p) => <li key={p}>{p}</li>)}
              </ol>
            </div>
          ))}
        </div>

        <h3 className={s.h3}>A jornada, mês a mês</h3>
        <p className={s.sub}>Cada mês cuida de uma área da sua empresa. Você termina o mês com ela rodando e com os números no painel.</p>
        <Revela>
          <ol className={s.trilha}>
            {JORNADA.map((m) => (
              <li key={m.mes} className={s.mes} data-revela>
                <div className={s.mesNo}><span className={mono.className}>{m.mes}</span></div>
                <div className={s.mesCorpo}>
                  <span className={`${s.mesRotulo} ${mono.className}`}>Mês {m.mes}</span>
                  <h4 className={s.mesArea}>{m.area}</h4>
                  {m.marco && <span className={`${s.marco} ${mono.className}`}>{m.marco}</span>}
                  <p className={s.entrega}><b>Você sai com:</b> {m.entrega}</p>
                  <ol className={s.aulas}>
                    {m.aulas.map((a) => (
                      <li key={a.n}>
                        <span className={`${s.aulaN} ${mono.className}`}>Aula {a.n}</span>
                        <div>
                          <strong>{a.titulo}</strong>
                          <p>{a.texto}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </li>
            ))}
          </ol>
        </Revela>

        <h3 className={s.h3}>No dia em que você entra</h3>
        <ul className={s.entrada}>
          {ENTRADA.map((e) => <li key={e}>{e}</li>)}
        </ul>
        <p className={s.sub}>Entrou no meio do ciclo? Você recebe as aulas do mês 1 gravadas e o seu painel já é instalado na entrada.</p>

        <h3 className={s.h3}>Tudo o que entra</h3>
        <ul className={base.itens}>
          {MENTORIA.itens.map((t) => <li key={t}>{t}</li>)}
        </ul>

        <div className={s.preco}>
          <span className={`${s.precoRotulo} ${mono.className}`}>Seu upgrade</span>
          <div className={s.precoComparo}>
            <div className={s.precoDe}>
              <span>FA² sozinha</span>
              <s>{nb(OFERTA_1.avulsa)}</s>
            </div>
            <div className={s.precoPor}>
              <span>Para você, agora</span>
              <strong>{nb(OFERTA_1.upgrade)}</strong>
            </div>
          </div>
          <span className={`${s.economia} ${mono.className}`}>Você economiza {nb(OFERTA_1.economia)}</span>
          <p className={s.precoTexto}>
            Você já pagou R$ 1.250 no EA². Com o upgrade, EA² e FA² saem por {nb(OFERTA_1.preco)} no total. Separados, custariam R$ 9.250.
          </p>
          <p className={s.precoTexto}>
            Esta condição existe só para quem acabou de comprar o EA². Fora desta página, a FA² custa {nb(OFERTA_1.avulsa)}.
          </p>
        </div>

        <div className={base.garantia}>
          <span className={`${base.pl} ${mono.className}`}>Garantia</span>
          <p>{MENTORIA.garantia}</p>
        </div>

        <a className={base.btn} href={checkout}>Sim, quero o upgrade para a FA²</a>
        <p className={base.aviso}>Se não for para você, sua vaga no EA² continua garantida. O resultado depende da sua execução e da sua aplicação.</p>
      </div>
    </section>
  );
}

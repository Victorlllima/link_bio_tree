import type { Lote } from "./lote";

/* ViewContent com event_id, InitiateCheckout no clique dos
   botões .im-acao (o sck sai da própria LP). Purchase e OrderBump vêm da CAPI (webhook), não daqui. */
export function pixelScriptImersao(l: Lote): string {
    return `
    (function () {
      var id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
      var base = { content_name: 'Imersao Arquiteto de Agentes', content_ids: ['imersao-A'],
                   content_type: 'product', value: ${l.preco}, currency: 'BRL',
                   content_category: 'variante-A' };
      var t = 0;
      (function view() {
        if (typeof fbq !== 'undefined') { fbq('track', 'ViewContent', base, { eventID: id }); return; }
        if (++t < 20) setTimeout(view, 250);
      })();
      function ligar() {
        var bs = document.querySelectorAll('.im-acao');
        for (var i = 0; i < bs.length; i++) {
          bs[i].addEventListener('click', function () {
            if (typeof fbq !== 'undefined') fbq('track', 'InitiateCheckout', base, { eventID: 'ic-' + id });
          });
        }
      }
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ligar);
      else ligar();
    })();
  `;
}

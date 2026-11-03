import type { Lote } from "./lote";

/* ViewContent com event_id, InitiateCheckout no clique e o sck por criativo carimbado nos
   botões .im-acao. Purchase e OrderBump vêm da CAPI (webhook), não daqui. */
export function pixelScriptImersao(l: Lote): string {
    return `
    (function () {
      var VAR = 'im-A';
      var id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
      var base = { content_name: 'Imersao Arquiteto de Agentes', content_ids: ['imersao-A'],
                   content_type: 'product', value: ${l.preco}, currency: 'BRL',
                   content_category: 'variante-A' };
      var t = 0;
      (function view() {
        if (typeof fbq !== 'undefined') { fbq('track', 'ViewContent', base, { eventID: id }); return; }
        if (++t < 20) setTimeout(view, 250);
      })();
      function marcarOrigem() {
        var q = new URLSearchParams(location.search);
        var c = q.get('utm_content') || q.get('sck') || q.get('fbclid');
        if (!c) return;
        var sck = (VAR + '-' + c).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 100);
        var bs = document.querySelectorAll('.im-acao');
        for (var i = 0; i < bs.length; i++) {
          var h = bs[i].getAttribute('href');
          if (!h || h.indexOf('hotmart') === -1 || h.indexOf('sck=') !== -1) continue;
          bs[i].setAttribute('href', h + '&sck=' + sck);
        }
      }
      function ligar() {
        marcarOrigem();
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

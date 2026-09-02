/* Gera os previews estáticos das LPs A-E em Starlight/HERMES/05-paginas/preview-html.
   Abre em file:// sem servidor e sem internet: CSS embutido, fontes e imagens
   em base64, scripts removidos (o que se vê é o ESTADO FINAL do movimento). */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');

const DEST = 'c:/Users/RedPro/Desktop/Projetos/Vibecoding/Starlight/HERMES/05-paginas/preview-html';
const BASE = 'http://localhost:3123';
const PAGES = [
  ['a', '/hermes-week',   'LP-A-trabalha-enquanto-dorme.html', 'LP A · MADRUGADA'],
  ['b', '/hermes-week/b', 'LP-B-quatro-chatbots.html',         'LP B · BENTO'],
  ['c', '/hermes-week/c', 'LP-C-categoria-que-ninguem-usa.html','LP C · DOCUMENTO'],
  ['d', '/hermes-week/d', 'LP-D-primeiro-degrau.html',         'LP D · ESCADA'],
  ['e', '/hermes-week/e', 'LP-E-trabalhou-no-feriado.html',    'LP E · CLARO'],
];

const buscar = async (p, url) =>
  p.evaluate(async (u) => {
    const r = await fetch(u);
    const b = await r.arrayBuffer();
    let s = ''; const v = new Uint8Array(b);
    for (let i = 0; i < v.length; i++) s += String.fromCharCode(v[i]);
    return { b64: btoa(s), tipo: r.headers.get('content-type') || '' };
  }, url);

(async () => {
  const b = await chromium.launch();
  for (const [id, rota, arq, rot] of PAGES) {
    const p = await b.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 1 });
    await p.goto(BASE + rota, { waitUntil: 'networkidle', timeout: 90000 });
    // rola tudo pra disparar reveals e lazy-load antes de congelar o DOM
    await p.evaluate(async () => {
      await new Promise((r) => { let y = 0; const i = setInterval(() => {
        window.scrollTo(0, y); y += 500;
        if (y > document.body.scrollHeight) { clearInterval(i); window.scrollTo(0, 0); r(); } }, 25); });
    });
    await p.waitForTimeout(1200);

    // 1. CSS externo -> <style> inline
    for (const href of await p.$$eval('link[rel="stylesheet"]', ls => ls.map(l => l.href))) {
      const { b64 } = await buscar(p, href);
      let css = Buffer.from(b64, 'base64').toString('utf8');
      // as fontes referenciadas pelo CSS viram base64 dentro do próprio CSS
      for (const u of [...new Set([...css.matchAll(/url\(([^)]+)\)/g)].map(m => m[1].replace(/["']/g, '')))]) {
        if (u.startsWith('data:')) continue;
        try {
          const abs = new URL(u, href).href;
          const { b64: fb, tipo } = await buscar(p, abs);
          css = css.split(u).join(`data:${tipo || 'font/woff2'};base64,${fb}`);
        } catch {}
      }
      await p.evaluate((c) => { const s = document.createElement('style'); s.textContent = c; document.head.appendChild(s); }, css);
      await p.evaluate((h) => { document.querySelectorAll(`link[href="${h}"]`).forEach(l => l.remove()); }, href);
    }
    // sobra de link[rel=stylesheet]: o CSS já foi embutido acima, e se ficar o
    // <link> o preview tenta buscar /_next/... no disco e falha em file://
    {
      await p.evaluate(() => document.querySelectorAll('link[rel="stylesheet"]').forEach(l => l.remove()));
    }

    // 2. imagens -> data URI (o preview roda offline, sem o otimizador do Next)
    const srcs = await p.$$eval('img', is => [...new Set(is.map(i => i.currentSrc || i.src))].filter(Boolean));
    for (const s of srcs) {
      if (s.startsWith('data:')) continue;
      try {
        const { b64, tipo } = await buscar(p, s);
        await p.evaluate(([o, d]) => {
          document.querySelectorAll('img').forEach(i => {
            if (i.currentSrc === o || i.src === o) { i.removeAttribute('srcset'); i.removeAttribute('loading'); i.src = d; }
          });
        }, [s, `data:${tipo || 'image/webp'};base64,${b64}`]);
      } catch {}
    }

    // 3. congela: fora scripts, fora preloads que apontam pro servidor
    await p.evaluate(() => {
      document.querySelectorAll('script,link[rel="preload"],link[rel="modulepreload"],link[rel="prefetch"],noscript').forEach(e => e.remove());
    });

    let html = await p.content();
    html = html.replace(/<head>/i, `<head>\n<!-- PREVIEW ESTÁTICO · ${rot}\n     Gerado da página real de ${rota}. CSS embutido, fontes e imagens em\n     base64: abre em file:// sem servidor e sem internet.\n     Os scripts foram removidos, então o que aparece aqui é o ESTADO FINAL.\n     O movimento de cada página está descrito no cabeçalho do componente. -->`);
    fs.writeFileSync(path.join(DEST, arq), html, 'utf8');
    const imgs = (html.match(/<img/g) || []).length;
    console.log(`${arq}  ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB · ${imgs} img`);
    await p.close();
  }
  await b.close();
})();

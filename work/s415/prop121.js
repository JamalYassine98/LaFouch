/* ESBOÇO 121 (site): (1) área de toque de 44 px nos botões e links pequenos, SEM mudar o desenho (a área cresce por fora, invisível,
   e para no meio do caminho até o vizinho); (2) "Últimas N unidades" passa a ficar sobre a foto, IGUAL ao catálogo (#grid .card .ph .ulin), e nome, cor e preço alinham na fileira. */
(() => {
  const st = document.createElement('style');
  st.textContent =
    ".lx44{--t:0px;--r:0px;--b:0px;--l:0px}" +
    ".lx44:not(.lxpos){position:relative}" +
    ".lx44:not(.lxb)::after,.lx44.lxb::before{content:'';position:absolute;top:calc(-1*var(--t));right:calc(-1*var(--r));bottom:calc(-1*var(--b));left:calc(-1*var(--l));}" +
    /* (2) selo sobre a foto, no canto de baixo à esquerda, numa pílula clara */
    "#home .hc:has(.hlin){position:relative}" +
    /* "Últimas N": vermelho como antes, SEM fundo, no canto de cima da foto (longe dos óculos), alinhado com o texto do cartão */
    "#home .hc .hlin,#grid .card .ph .ulin{position:absolute!important;z-index:3;display:inline-flex;align-items:center;gap:4px!important;margin:0!important;padding:0!important;background:none!important;box-shadow:none!important;border-radius:0!important;font:700 11.5px/1.25 Inter,system-ui,sans-serif!important;letter-spacing:.02em!important;text-transform:none!important;color:#c62828!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;align-items:flex-start!important;gap:4px!important}" +
    "#home .hc .hlin i,#grid .card .ph .ulin i{width:6px!important;height:6px!important;background:currentColor!important;position:relative;top:-1px;margin-top:calc((1.25em - 6px) / 2)!important}" +
    "#grid .card .ph .ulin{bottom:auto!important}" +
    /* peça: coração sem o círculo branco (igual ao catálogo), toque continua 46 px */
    ".pgm .big .dfav,.modal .big .dfav{background:none!important;box-shadow:none!important;color:#7d2a5a}" +
    ".modal .big .dfav svg{width:24px;height:24px;filter:drop-shadow(0 0 2px #fff) drop-shadow(0 0 2px #fff)}" +
    ".modal .big .dfav.on{background:none!important;color:var(--ac)}.modal .big .dfav.on svg{fill:currentColor}";
  document.head.appendChild(st);
  const toque = () => matchMedia('(pointer:coarse)').matches || innerWidth < 1100;
  const vis = (e) => { const r = e.getBoundingClientRect(); if (!r.width || !r.height) return false; for (let x = e; x && x !== document.body; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === 'none' || s.visibility === 'hidden') return false; } return true; };
  function selos() {
    const poe = (c, s, ph) => {
      const cr = c.getBoundingClientRect(), pr = ph.getBoundingClientRect(), z = cr.width / c.offsetWidth || 1;
      const tx = c.querySelector('.hn,.nm,.ref'); let esq = pr.left + 12;
      if (tx) { const w = document.createTreeWalker(tx, NodeFilter.SHOW_TEXT, { acceptNode: (n) => n.textContent.trim() ? 1 : 3 }); const n = w.nextNode();
        if (n) { const rg = document.createRange(); rg.setStart(n, 0); rg.setEnd(n, 1); esq = rg.getBoundingClientRect().left; } else esq = tx.getBoundingClientRect().left; }
      const base = s.offsetParent || c, br = base.getBoundingClientRect(), zb = br.width / base.offsetWidth || 1;
      const fav = c.querySelector('.fav'); const lim = fav ? fav.getBoundingClientRect().left - 6 : pr.right - 12;
      s.style.left = ((esq - br.left) / zb) + 'px'; s.style.top = ((pr.top - br.top) / zb + 16) + 'px';
      s.style.maxWidth = Math.max(40, (lim - esq) / zb) + 'px';
      const d = esq - s.getBoundingClientRect().left; if (Math.abs(d) > .5) s.style.left = (parseFloat(s.style.left) + d / zb) + 'px';
    };
    document.querySelectorAll('#home .hc').forEach((c) => { const s = c.querySelector('.hlin'), im = c.querySelector('.hci, img'); if (s && im) poe(c, s, im.closest('.hci') || im); });
    document.querySelectorAll('#grid .card').forEach((c) => { const s = c.querySelector('.ph .ulin'), ph = c.querySelector('.ph'); if (s && ph) poe(c, s, ph); });
  }
  function areas() {
    document.querySelectorAll('.lx44').forEach((e) => e.classList.remove('lx44', 'lxpos', 'lxb'));
    if (!toque()) return;
    const sel = 'a[href],button,[role=button],summary,input:not([type=hidden]),select,label[for]';
    const T = [...document.querySelectorAll(sel)].filter(vis).filter((e) => !e.closest('.lx-ignora'));
    const R = T.map((e) => e.getBoundingClientRect());
    // textos vizinhos (não clicáveis) também são respeitados: a área não cobre letra de outra coisa
    const TX = [...document.querySelectorAll('body *')].filter((x) => !x.closest(sel) && [...x.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && vis(x)).map((x) => x.getBoundingClientRect());
    const VZ = R.map((r, j) => [r, j]).concat(TX.map((r) => [r, -1]));
    T.forEach((e, i) => {
      const r = R[i], z = r.width / (e.offsetWidth || r.width) || 1;
      if (r.width >= 44 && r.height >= 44) return;
      const livre = (ps) => { const c = getComputedStyle(e, ps).content; return c === 'none' || c === 'normal'; };
      let usaB = false; if (!livre('::after')) { if (livre('::before')) usaB = true; else return; } // usa o pseudo que estiver livre
      let t = Math.max(0, (45 - r.height) / 2), b = t, l = Math.max(0, (45 - r.width) / 2), rr = l;
      VZ.forEach(([o, j]) => { // não invade o vizinho: para no meio do vão
        if (j === i || (j >= 0 && (T[j].contains(e) || e.contains(T[j])))) return;
        if (j < 0 && o.left >= r.left - .5 && o.right <= r.right + .5 && o.top >= r.top - .5 && o.bottom <= r.bottom + .5) return;
        const sobV = o.top < r.bottom + b && o.bottom > r.top - t, sobH = o.left < r.right + rr && o.right > r.left - l;
        if (sobV && o.left >= r.right - 1) rr = Math.min(rr, Math.max(0, (o.left - r.right) / 2));
        if (sobV && o.right <= r.left + 1) l = Math.min(l, Math.max(0, (r.left - o.right) / 2));
        if (sobH && o.top >= r.bottom - 1) b = Math.min(b, Math.max(0, (o.top - r.bottom) / 2));
        if (sobH && o.bottom <= r.top + 1) t = Math.min(t, Math.max(0, (r.top - o.bottom) / 2));
      });
      if (getComputedStyle(e).position !== 'static') e.classList.add('lxpos');
      e.classList.add('lx44'); if (usaB) e.classList.add('lxb');
      e.style.setProperty('--t', t / z + 'px'); e.style.setProperty('--b', b / z + 'px'); e.style.setProperty('--l', l / z + 'px'); e.style.setProperty('--r', rr / z + 'px');
    });
  }
  let tm = 0; const go = () => { clearTimeout(tm); tm = setTimeout(() => { selos(); areas(); }, 120); };
  new MutationObserver(go).observe(document.body, { childList: true, subtree: true });
  addEventListener('resize', go); addEventListener('load', go); go();
})();

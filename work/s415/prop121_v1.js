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
    "#home .hc .hlin{position:absolute;z-index:3;display:inline-flex;align-items:center;gap:6px;margin:0!important;padding:4px 9px 4px 8px;border-radius:999px;background:rgba(255,255,255,.92);box-shadow:0 1px 4px rgba(42,31,39,.10);font:600 11.5px/1.2 Inter,system-ui,sans-serif;letter-spacing:.01em;text-transform:none;color:#2a1f27;max-width:calc(100% - 16px)}" +
    "#home .hc .hlin i{width:6px;height:6px;background:#b5482a;animation:lfresp 2.6s ease-in-out infinite}" +
    "@media (prefers-reduced-motion:reduce){#home .hc .hlin i{animation:none}}";
  document.head.appendChild(st);
  const toque = () => matchMedia('(pointer:coarse)').matches || innerWidth < 1100;
  const vis = (e) => { const r = e.getBoundingClientRect(); if (!r.width || !r.height) return false; for (let x = e; x && x !== document.body; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === 'none' || s.visibility === 'hidden') return false; } return true; };
  function selos() {
    document.querySelectorAll('#home .hc').forEach((c) => {
      const s = c.querySelector('.hlin'), im = c.querySelector('.hci, img'); if (!s || !im) return;
      const cr = c.getBoundingClientRect(), ir = (im.closest('.hci') || im).getBoundingClientRect(), z = cr.width / c.offsetWidth || 1;
      s.style.left = ((ir.left - cr.left) / z + 8) + 'px'; s.style.top = ((ir.bottom - cr.top) / z - s.offsetHeight - 8) + 'px';
    });
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

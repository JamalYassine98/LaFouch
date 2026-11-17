() => {
  const out = [], W = innerWidth;
  const vis = e => { const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || +cs.opacity < 0.05) return false; let p = e; while (p) { if (p.hidden) return false; p = p.parentElement; } return true; };
  const els = [...document.querySelectorAll('button,a[href],[role=button],[data-act],label.sw,summary')].filter(vis);
  const seen = new Set();
  for (const e of els) {
    if (seen.has(e)) continue; seen.add(e);
    if (e.closest('#mainnav,.mainnav')) continue;
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e), tx = (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ');
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.25, pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const simples = e.children.length === 0 || [...e.children].every(c => /^(B|SPAN|I|SVG|svg|SMALL)$/.test(c.tagName) && !/block|flex|grid/.test(getComputedStyle(c).display));
    const prob = [];
    const nl = (e.innerText || '').trim().split('\n').length;
    if (simples && nl === 1 && tx && tx.split(' ').length <= 6) {
      // altura do texto
      const rg = document.createRange(); rg.selectNodeContents(e); const rs = [...rg.getClientRects()].filter(x => x.width > 1);
      const linhas = new Set(rs.map(x => Math.round(x.top))).size;
      if (linhas > 1) prob.push('quebra em ' + linhas + ' linhas');
    }
    if (e.scrollWidth > e.clientWidth + 2 && cs.overflowX !== 'visible' && cs.overflowX !== 'auto' && cs.overflowX !== 'scroll') prob.push('texto cortado');
    if (cs.textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth + 1) prob.push('reticências');
    if (r.right > W + 1 || r.left < -1) prob.push('sai da tela');
    if (r.height < 30 && tx && !e.closest('.trk')) prob.push('toque baixo ' + Math.round(r.height) + 'px');
    if (prob.length) out.push({ t: tx.slice(0, 50), c: (e.className && e.className.baseVal === undefined ? e.className : '').toString().slice(0, 40), a: e.dataset.act || '', p: prob, r: [Math.round(r.left), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height)] });
  }
  return out;
}

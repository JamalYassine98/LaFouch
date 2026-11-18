() => {
  // S416: tudo o que tem texto ou é bloco visível na tela (parado), com papel, tamanho real e bordas.
  const z = (e) => { let k = 1; for (let x = e; x; x = x.parentElement) k *= parseFloat(getComputedStyle(x).zoom) || 1; return k; };
  const vis = (e) => { const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return false; for (let x = e; x && x !== document.body; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < .05) return false; } const c = document.elementFromPoint(Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2)), Math.min(innerHeight - 1, Math.max(0, r.top + Math.min(r.height / 2, 20)))); return c && (c === e || e.contains(c) || c.contains(e)); };
  const raiz = document.querySelector('#layer .scrim.pg, #layer .scrim') || document.body;
  const out = { textos: [], blocos: [] };
  const papel = (e) => { const k = (e.className && e.className.baseVal === undefined ? e.className : '') + ' ' + (e.parentElement ? e.parentElement.className : ''); return (e.tagName + '.' + k.trim().split(/\s+/).slice(0, 3).join('.')).slice(0, 60); };
  [...raiz.querySelectorAll('*')].forEach((e) => {
    if (!vis(e)) return;
    const s = getComputedStyle(e), r = e.getBoundingClientRect();
    const temTexto = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (temTexto) {
      const t = [...e.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim())[0];
      const rg = document.createRange(); rg.selectNodeContents(t); const q = rg.getBoundingClientRect();
      out.textos.push({ txt: e.innerText.trim().split('\n')[0].slice(0, 40), papel: papel(e), px: Math.round(parseFloat(s.fontSize) * z(e) * 10) / 10, peso: +s.fontWeight, fam: s.fontFamily.split(',')[0].replace(/"/g, ''), x: Math.round(q.left), r: Math.round(q.right), y: Math.round(q.top), h: Math.round(q.height), cor: s.color });
    }
    const bg = s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.borderTopWidth !== '0px' || s.boxShadow !== 'none';
    if (bg && r.width > 40 && r.height > 24 && r.width < innerWidth - 2) out.blocos.push({ papel: papel(e), x: Math.round(r.left), r: Math.round(r.right), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), raio: s.borderRadius });
  });
  out.larg = innerWidth; out.alt = innerHeight;
  return out;
}

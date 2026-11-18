() => {
  const vis = (e) => { const r = e.getBoundingClientRect(); if (!r.width || !r.height || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return false; for (let x = e; x && x !== document.body; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; } return true; };
  const scope = document.querySelector('#layer .scrim.pg') || document;
  const T = [...scope.querySelectorAll('a[href],button,[role=button],summary,input:not([type=hidden]),select')].filter(vis);
  const dono = (x, y, e) => { if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) return false; const h = document.elementFromPoint(x, y); return h && (h === e || e.contains(h)); };
  const out = [];
  T.forEach((e) => {
    const r = e.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (!dono(cx, cy, e)) return; // coberto por outra coisa (não é alvo da tela agora)
    let L = 0, Rr = 0, U = 0, D = 0;
    while (L < 40 && dono(cx - r.width / 2 - L - 1, cy, e)) L++; while (Rr < 40 && dono(cx + r.width / 2 + Rr + 1, cy, e)) Rr++;
    while (U < 40 && dono(cx, cy - r.height / 2 - U - 1, e)) U++; while (D < 40 && dono(cx, cy + r.height / 2 + D + 1, e)) D++;
    const w = Math.round(r.width + L + Rr), h = Math.round(r.height + U + D);
    out.push({ x: Math.round(r.left - L), y: Math.round(r.top - U), n: ((e.innerText || e.getAttribute('aria-label') || e.className) + '').trim().split('\n')[0].slice(0, 20), w, h, vw: Math.round(r.width), vh: Math.round(r.height) });
  });
  const peq = out.filter((o) => o.w < 44 || o.h < 44), mto = out.filter((o) => o.w < 24 || o.h < 24);
  return { caixas: out, alvos: out.length, menor44: peq.length, menor24: mto.length, ex: peq.slice(0, 12).map((o) => o.n + ' ' + o.w + '×' + o.h) };
}

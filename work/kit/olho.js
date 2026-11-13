// OLHO DO DESIGNER (13/11/2026, dono: "quero esse designer agindo quase como uma IA").
// Regras GERAIS (não conhecem o site): valem para qualquer tela, aparelho e momento (parado, depois de rolar, com algo aberto).
// Cada regra nasceu de uma falha real que passou despercebida — ver docs/ATLAS-SITE.md ("O que o designer sabe").
// Devolve lista de {r: regra, n: quantos, ex: exemplos}.
(() => {
  const W = innerWidth, H = innerHeight, out = [];
  const cs = (e) => getComputedStyle(e);
  const naTela = (r) => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < H && r.right > 0 && r.left < W;
  const opac = (e) => { let o = 1; for (let x = e; x && x !== document.documentElement; x = x.parentElement) { const s = cs(x); if (s.visibility === 'hidden' || s.display === 'none') return 0; o *= +s.opacity; } return o; };
  const nome = (e) => ((e.innerText || e.getAttribute('aria-label') || e.alt || '').trim().split('\n')[0].slice(0, 26) || e.tagName.toLowerCase() + '.' + String(e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className).split(' ')[0]);
  const fixo = (e) => { for (let x = e; x && x !== document.body; x = x.parentElement) { const p = cs(x).position; if (p === 'fixed' || p === 'sticky') return x; } return null; };
  const rolaX = (e) => { for (let x = e.parentElement; x && x !== document.body; x = x.parentElement) { const o = cs(x).overflowX; if ((o === 'auto' || o === 'scroll' || o === 'hidden') && x.scrollWidth > x.clientWidth + 2 && x.clientWidth < W + 2 && x !== document.documentElement) return true; } return false; };
  // o que está de fato por cima num ponto (respeita camadas abertas)
  const topo = (x, y) => document.elementFromPoint(Math.max(1, Math.min(W - 1, x)), Math.max(1, Math.min(H - 1, y)));
  const alcanca = (e) => { const r = e.getBoundingClientRect(); const t = topo(r.left + r.width / 2, r.top + r.height / 2); return !!t && (t === e || e.contains(t) || t.contains(e)); };
  const clic = [...document.querySelectorAll('button,a[href],[role=button],input,select,textarea,summary')].filter((e) => { const r = e.getBoundingClientRect(); return naTela(r) && opac(e) > 0.05 && !e.closest('[aria-hidden=true],[inert]'); });
  const add = (r, l, f) => { if (l.length) out.push({ r, n: l.length, ex: [...new Set(l.slice(0, 12).map(f || nome))].slice(0, 4) }); };
  // 1 cortado na borda · 2 meio apagado · 3 página mais larga que a tela
  add('cortado', clic.filter((e) => { const r = e.getBoundingClientRect(); return (r.right > W + 3 || r.left < -3) && !rolaX(e) && (fixo(e) || alcanca(e)); }));
  add('apagado', clic.filter((e) => { const o = opac(e); return o < 0.95 && !e.disabled && alcanca(e); }));
  if (document.documentElement.scrollWidth > W + 3) out.push({ r: 'largura', n: document.documentElement.scrollWidth - W, ex: [] });
  // 4 clicável tampado por algo fixo/flutuante que não é ele (ex.: WhatsApp em cima de um link)
  const tamp = [];
  clic.forEach((e) => { const r = e.getBoundingClientRect(); if (r.top < 0 || r.bottom > H) return; const pts = [[r.left + r.width / 2, r.top + r.height / 2], [r.left + 3, r.top + 3], [r.right - 3, r.bottom - 3]]; for (const [x, y] of pts) { const t = topo(x, y); if (!t || t === e || e.contains(t) || t.contains(e)) continue; const f = fixo(t); if (!f || f.contains(e)) continue; const fr = f.getBoundingClientRect(); if (fr.width * fr.height > W * H * 0.35) continue; if (fr.width > W * 0.9 && (fr.top <= 1 || fr.bottom >= H - 1)) continue; /* conteúdo passando por baixo de uma barra fixa é normal */ tamp.push(nome(e) + ' ← ' + nome(t.closest('a,button') || f)); break; } });
  add('tampado', tamp, (x) => x);
  // 5 toque pequeno (celular/tablet): < 24 é falha; 24–39 é aviso
  if (matchMedia('(pointer:coarse)').matches || W < 1100) {
    const al = clic.filter((e) => alcanca(e) && !(cs(e).display === 'inline' && e.closest('p,li,small')));
    add('toque<24', al.filter((e) => { const r = e.getBoundingClientRect(); return Math.min(r.width, r.height) < 24; }));
    add('toque<40', al.filter((e) => { const r = e.getBoundingClientRect(); const m = Math.min(r.width, r.height); return m >= 24 && m < 40; }));
    // 6 alvos colados: centros a menos de 24 px (dedo acerta o vizinho)
    const cen = al.map((e) => { const r = e.getBoundingClientRect(); return [e, r.left + r.width / 2, r.top + r.height / 2, r]; }), col = [];
    for (let i = 0; i < cen.length; i++) for (let j = i + 1; j < cen.length; j++) { const a = cen[i], b = cen[j]; if (a[0].contains(b[0]) || b[0].contains(a[0])) continue; if (Math.hypot(a[1] - b[1], a[2] - b[2]) < 24) col.push(a[0]); }
    add('colados', col);
  }
  // 7 texto cortado com "…" · 8 letra < 11 px · 9 texto em cima de texto
  const fol = [...document.querySelectorAll('body *')].filter((e) => { if (e.closest('svg,script,style,[aria-hidden=true]')) return false; if (![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)) return false; const r = e.getBoundingClientRect(); return naTela(r) && opac(e) > 0.05 && alcanca(e); }).slice(0, 260);
  add('texto cortado', fol.filter((e) => e.scrollWidth > e.clientWidth + 1 && /hidden|clip/.test(cs(e).overflowX) && cs(e).display !== 'inline'));
  add('letra<11', fol.filter((e) => parseFloat(cs(e).fontSize) * (parseFloat(cs(document.body).zoom) || 1) < 10.9));
  const sob = []; const rs = fol.map((e) => [e, e.getBoundingClientRect()]);
  for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) { const [a, ra] = rs[i], [b, rb] = rs[j]; if (a.contains(b) || b.contains(a)) continue; const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left), h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top); if (w > 4 && h > 4 && w * h > 0.3 * Math.min(ra.width * ra.height, rb.width * rb.height)) sob.push(nome(a) + ' × ' + nome(b)); }
  add('texto sobre texto', sob, (x) => x);
  // 10 fileira torta: irmãos lado a lado (mesmo topo e mesma largura) cujo último texto termina em alturas diferentes
  const tort = [];
  document.querySelectorAll('body *').forEach((p) => { if (p.children.length < 2 || p.children.length > 60) return; const ks = [...p.children].filter((k) => { const r = k.getBoundingClientRect(); return naTela(r) && r.width > 80 && r.height > 80; }); if (ks.length < 2) return; const lin = {}; ks.forEach((k) => { const r = k.getBoundingClientRect(); const key = Math.round(r.top / 4) + ':' + Math.round(r.width / 4); (lin[key] = lin[key] || []).push(k); });
    Object.values(lin).forEach((g) => { if (g.length < 2) return; const fim = g.map((k) => { const ts = [...k.querySelectorAll('*')].filter((x) => [...x.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && x.getBoundingClientRect().height > 0); return ts.length ? Math.round(ts[ts.length - 1].getBoundingClientRect().bottom) : null; }).filter((v) => v !== null); if (fim.length > 1 && Math.max(...fim) - Math.min(...fim) > 3) tort.push(nome(g[0]) + ' (' + (Math.max(...fim) - Math.min(...fim)) + ' px)'); const hs = g.map((k) => Math.round(k.getBoundingClientRect().height)); if (Math.max(...hs) - Math.min(...hs) > 3) tort.push(nome(g[0]) + ' alturas ' + Math.min(...hs) + '–' + Math.max(...hs)); }); });
  add('fileira torta', tort, (x) => x);
  // 11 barra fixa grande demais (rouba a tela) · 12 imagem quebrada
  let fx = 0; document.querySelectorAll('body *').forEach((e) => { const s = cs(e); if ((s.position === 'fixed' || s.position === 'sticky') && opac(e) > 0.05) { const r = e.getBoundingClientRect(); if (naTela(r) && r.width > W * 0.9 && r.height < H * 0.6 && (r.top <= 1 || r.bottom >= H - 1)) fx += Math.min(r.bottom, H) - Math.max(r.top, 0); } });
  if (fx > H * 0.25) out.push({ r: 'barras fixas', n: Math.round(100 * fx / H), ex: [Math.round(fx) + ' px de ' + H] });
  add('imagem quebrada', [...document.images].filter((i) => i.complete && !i.naturalWidth && naTela(i.getBoundingClientRect())));
  return out;
})()

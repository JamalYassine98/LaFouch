() => {
  // S414: medidas dos esboços 120/122 num navegador de verdade (Android Chrome, Edge/Chrome do Windows, Safari).
  const R = (e) => e ? e.getBoundingClientRect() : null, n = (v) => v == null ? null : Math.round(v * 10) / 10;
  const top = document.querySelector('.top'), ev = document.getElementById('evbar'), s = document.querySelector('#layer .scrim.pg');
  const evOn = ev && getComputedStyle(ev).display !== 'none', rt = R(top), re = evOn ? R(ev) : null;
  const o = { tela: s ? (s.querySelector('.modal.pgm .big') ? 'peca' : 'painel') : 'inicio', larg: innerWidth, alt: innerHeight, dpr: devicePixelRatio,
    evento: document.documentElement.getAttribute('data-ev') || '' };
  o.faixa_cobre_topo = evOn ? Math.max(0, n(re.bottom - rt.top)) : 0;
  o.vao_topo_tela = s ? n(R(s).top - rt.bottom) : null;
  const svg = (q) => { const b = document.querySelector(q); return b ? (b.querySelector('svg') || b) : null; };
  o.menu = n(R(svg('#mnb')).left); o.carrinho_dir = n(R(svg('#bagbtn')).right);
  o.icones_fora = ['#mnb', '#sbtn', '#contabtn', '#bagbtn'].filter(q => { const r = R(document.querySelector(q)); return r && (r.right > innerWidth + 1 || r.left < -1); });
  if (s) {
    const b = s.querySelector('.pgbar'), m = s.querySelector('.modal.pgm .big');
    if (b) {
      const bk = b.querySelector('.pgback'); o.seta = bk ? n(R(bk.querySelector('svg') || bk).left) : null;
      const bl = (e) => { if (!e) return null; const p = document.createElement('span'); p.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline'; e.appendChild(p); const y = R(p).top; p.remove(); return y; };
      const a = bl(bk && (bk.querySelector('span') || bk)), c = bl(b.querySelector('.pgcr a,.pgcr span,.pgcr button') || b.querySelector('.pgcr'));
      o.base_dif = a != null && c != null ? n(a - c) : null;
    }
    if (m) { o.foto = n(R(m).left); const kids = [...s.querySelector('.modal.pgm').children].filter(e => e.offsetWidth).map(R); o.conteudo_dir = n(Math.max(...kids.map(x => x.right))); }
    const h = s.querySelector('h1,h2'); o.titulo_topo = h ? n(R(h).top) : null; o.topo_fim = n(rt.bottom);
  }
  o.rolagem_lateral = document.documentElement.scrollWidth > innerWidth + 1;
  return o;
}

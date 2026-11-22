  // ===== PÁGINAS — um componente só para as listas longas do app (esboço 52d, "implementar" do dono 22/11/2026 12:51) =====
  // 24 por página · "Anterior · 1 de 3 · Próxima" embaixo (dois botões grandes iguais; o que não anda fica apagado) ·
  // deslizar o dedo na lista troca de página · o app guarda a página de cada lista (volta à 1ª quando a lista muda).
  var PG_TAM = 24;
  function pgTodas() {
    try {
      return JSON.parse(localStorage.getItem('lf_pg') || '{}') || {};
    } catch (e) {
      return {};
    }
  }
  // identidade curta de uma lista (o que está nela, não a ordem) — mudou o filtro ou a busca, muda a identidade
  function pgSig(ids, extra) {
    var s = (extra || '') + '|' + ids.slice().sort().join('\n'),
      h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return ids.length + ':' + (h >>> 0).toString(36);
  }
  // em que página a lista está: {chave, sig, p, n, de, ate}
  function paginas(chave, total, sig) {
    var n = Math.max(1, Math.ceil(total / PG_TAM)),
      g = pgTodas()[chave],
      p = g && g.s === sig ? g.p | 0 : 0;
    p = Math.min(Math.max(0, p), n - 1);
    return { chave: chave, sig: sig, p: p, n: n, de: p * PG_TAM, ate: Math.min(total, (p + 1) * PG_TAM) };
  }
  function pgVai(pg, lista, d) {
    var p = pg.p + d;
    if (p < 0 || p >= pg.n) return;
    var o = pgTodas();
    o[pg.chave] = { s: pg.sig, p: p };
    try {
      localStorage.setItem('lf_pg', JSON.stringify(o));
    } catch (e) {}
    render();
    // a página nova começa do alto da lista
    var y = lista.getBoundingClientRect().top + (window.scrollY || 0) - 96;
    if ((window.scrollY || 0) > y) window.scrollTo(0, Math.max(0, y));
  }
  // a barra embaixo da lista (some com uma página só) + o deslizar na própria lista
  function paginador(pg, lista) {
    if (lista._pgBar && lista._pgBar.parentNode) lista._pgBar.remove();
    lista._pgBar = null;
    lista._pg = pg;
    if (!lista._pgSw) {
      lista._pgSw = 1;
      var t0 = null;
      lista.addEventListener('touchstart', function (e) {
        var t = e.touches[0];
        // a borda esquerda é do "arrastar para voltar"
        t0 = e.touches.length === 1 && t.clientX > 24 ? { x: t.clientX, y: t.clientY } : null;
      }, { passive: true });
      lista.addEventListener('touchend', function (e) {
        if (!t0 || !lista._pg || lista._pg.n < 2) return;
        var t = e.changedTouches[0], dx = t.clientX - t0.x, dy = t.clientY - t0.y;
        t0 = null;
        if (Math.abs(dx) >= 60 && Math.abs(dx) > Math.abs(dy) * 2) pgVai(lista._pg, lista, dx < 0 ? 1 : -1);
      }, { passive: true });
    }
    if (pg.n < 2) return null;
    var b = mk('nav', 'pgBar');
    b.setAttribute('aria-label', 'Páginas');
    var ant = btn('pgB', 'Anterior', function () { pgVai(pg, lista, -1); }),
      prx = btn('pgB', 'Próxima', function () { pgVai(pg, lista, 1); }),
      nn = mk('span', 'pgN', pg.p + 1 + ' de ' + pg.n);
    ant.disabled = pg.p === 0;
    prx.disabled = pg.p >= pg.n - 1;
    nn.setAttribute('aria-live', 'polite');
    b.appendChild(ant);
    b.appendChild(nn);
    b.appendChild(prx);
    lista.parentNode.insertBefore(b, lista.nextSibling);
    lista._pgBar = b;
    return b;
  }

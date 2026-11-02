  // ===== Fechamento do caixa: automático (depois das 17h, ou dias passados sem registro) e flexível (o dono fecha quando quiser). =====
  S.fechos = S.fechos || [];
  function fechoDia(k) {
    S.fechos = S.fechos || [];
    return S.fechos.filter(function (f) {
      return f.id === k;
    })[0];
  }
  function fechoCria(k, auto) {
    if (fechoDia(k)) return null;
    var st = dayStats(k),
      hoje = k === dayKey(Date.now());
    var f = { id: k, ts: Date.now(), auto: !!auto, n: st.n, vend: Math.round(st.vend), liv: Math.round(st.liv), ap: S.aparelho || '' };
    // o saldo só é conhecido de verdade no próprio dia; dia passado fechado depois fica sem saldo
    if (hoje) f.cash = { pyg: Math.round(S.cash.pyg || 0), brl: Math.round((S.cash.brl || 0) * 100) / 100, usd: Math.round((S.cash.usd || 0) * 100) / 100 };
    S.fechos.unshift(f);
    S.fechos.sort(function (a, b) {
      return a.id < b.id ? 1 : -1;
    });
    saveSoon();
    return f;
  }
  function fechoAuto() {
    var hoje = dayKey(Date.now()),
      dias = {};
    S.sales.forEach(function (s) {
      dias[dayKey(s.ts)] = 1;
    });
    Object.keys(dias).forEach(function (k) {
      if (k < hoje) fechoCria(k, true);
    });
    if (new Date().getHours() >= 17 && dias[hoje]) fechoCria(hoje, true);
  }
  function fechoHtml() {
    var hoje = dayKey(Date.now()),
      fh = fechoDia(hoje),
      h = '<section class="card col" style="gap:8px"><b>Fechamento do caixa</b>';
    if (fh) h += '<div class="hint">Hoje fechado' + (fh.auto ? ' automaticamente' : '') + ' · ' + fh.n + (fh.n === 1 ? ' venda' : ' vendas') + (fh.cash ? ' · Caixa ' + fmtM(fh.cash.pyg, 'pyg') + ' · ' + fmtM(fh.cash.brl, 'brl') + ' · ' + fmtM(fh.cash.usd, 'usd') : '') + '</div>';
    else h += '<div class="hint">Hoje ainda aberto. Fecha sozinho depois das 17h, ou feche agora se a loja fechou mais cedo.</div><button type="button" class="chip on" data-act="fechar">Fechar o dia agora</button>';
    S.fechos.filter(function (f) {
      return f.id !== hoje;
    }).slice(0, 5).forEach(function (f) {
      h += '<div class="hint">' + esc(f.id.split('-').reverse().join('/')) + ' · ' + f.n + (f.n === 1 ? ' venda' : ' vendas') + (f.cash ? ' · Caixa ' + fmtM(f.cash.pyg, 'pyg') : '') + '</div>';
    });
    return h + '</section>';
  }
  ACT.fechar = function () {
    fechoCria(dayKey(Date.now()), false);
    if (S.view === 'hist') render();
  };
  window.__fechoAuto = fechoAuto;
  window.__fechoHtml = fechoHtml;
  setTimeout(fechoAuto, 8000);
  setInterval(fechoAuto, 300000);

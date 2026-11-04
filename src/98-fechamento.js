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
    S.sales.forEach(function (x) {
      dias[dayKey(x.ts)] = 1;
    });
    // qualquer movimento de caixa (despesa, câmbio, compra, retirada...) também faz o dia contar, mesmo sem venda
    ['exp', 'cambios', 'compras', 'descartes', 'retiradas', 'melhUso', 'cpay', 'imprev', 'dlog', 'elog'].forEach(function (n) {
      (S[n] || []).forEach(function (x) {
        if (x && x.ts > 0) dias[dayKey(x.ts)] = 1;
      });
    });
    // dias de loja (seg–sáb) dos últimos 7 dias fecham mesmo sem nada ("0 vendas"); domingo só se teve movimento
    if (S.sales.length) {
      for (var i = 1; i <= 7; i++) {
        var d = new Date(Date.now() - i * 86400000);
        if (d.getDay() !== 0) dias[dayKey(d.getTime())] = 1;
      }
    }
    Object.keys(dias).forEach(function (k) {
      if (k < hoje) fechoCria(k, true);
    });
    if (new Date().getHours() >= 17 && (dias[hoje] || new Date().getDay() !== 0)) fechoCria(hoje, true);
  }
  function fechoHtml() {
    var hoje = dayKey(Date.now()),
      fh = fechoDia(hoje),
      h = '<section class="card col" style="gap:8px"><b>Fechamento do caixa</b>';
    if (fh) h += '<div class="hint">Hoje fechado' + (fh.auto ? ' automaticamente' : '') + ' · ' + fh.n + (fh.n === 1 ? ' venda' : ' vendas') + (fh.cash ? ' · Caixa ' + fmtM(fh.cash.pyg, 'pyg') + ' · ' + fmtM(fh.cash.brl, 'brl') + ' · ' + fmtM(fh.cash.usd, 'usd') : '') + '</div>';
    else h += '<div class="hint">Hoje ainda aberto. Fecha sozinho depois das 17h, ou feche agora se a loja fechou mais cedo.</div><button type="button" class="mini" data-act="fechar">Fechar o dia agora</button>';
    var pc0 = S.fechos.filter(function (f) {
      return !f.cc && f.cash;
    })[0];
    if (pc0) h += '<div class="hint">Falta conferir o caixa do fechamento de ' + esc(pc0.id.split('-').reverse().join('/')) + '.</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="chip on" data-act="view" data-id="caixa">Conferir o caixa</button><button type="button" class="chip" data-act="fechoadia">Adiar lembrete (2 h)</button></div>';
    S.fechos.filter(function (f) {
      return f.id !== hoje;
    }).slice(0, 5).forEach(function (f) {
      h += '<div class="hint">' + esc(f.id.split('-').reverse().join('/')) + ' · ' + f.n + (f.n === 1 ? ' venda' : ' vendas') + (f.cash ? ' · Caixa ' + fmtM(f.cash.pyg, 'pyg') : '') + '</div>';
    });
    return h + '</section>';
  }
  // Conferência do caixa ligada ao fechamento: marca o fechamento mais recente como conferido.
  window.__fechoCc = function (ok) {
    S.fechos = S.fechos || [];
    var f = S.fechos.filter(function (x) {
      return !x.cc;
    })[0];
    if (f) {
      f.cc = { ts: Date.now(), ok: !!ok };
      saveSoon();
    }
  };
  // Alerta do dia: conferir o caixa do fechamento, ou sugerir fechar quando a loja parou de vender (adiável).
  window.__fechoAlerta = function () {
    if (Date.now() < (S.fechoAdia || 0)) return null;
    S.fechos = S.fechos || [];
    var pend = S.fechos.filter(function (x) {
      return !x.cc && x.cash;
    })[0];
    if (pend) return { t: 'Conferir o caixa', s: 'Fechamento de ' + pend.id.split('-').reverse().join('/') + ' sem conferência', c: 'var(--warn)', urg: true, b: 'Conferir', act: 'view', id: 'caixa' };
    var hoje = dayKey(Date.now()),
      h = new Date().getHours(),
      vs = (S.sales || []).filter(function (x) {
        return dayKey(x.ts) === hoje && !x.estorno;
      });
    if (!fechoDia(hoje) && vs.length && h >= 14 && Date.now() - Math.max.apply(null, vs.map(function (x) { return x.ts; })) > 3600000)
      return { t: 'Fechar o dia?', s: 'Sem vendas há mais de 1 hora', c: 'var(--warn)', urg: false, b: 'Fechar', act: 'fechar', id: '' };
    return null;
  };
  ACT.fechoadia = function () {
    S.fechoAdia = Date.now() + 2 * 3600000;
    saveSoon();
    render();
  };
  ACT.fechar = function () {
    fechoCria(dayKey(Date.now()), false);
    if (S.view === 'hist') render();
  };
  window.__fechoAuto = fechoAuto;
  window.__fechoHtml = fechoHtml;
  setTimeout(fechoAuto, 8000);
  setInterval(fechoAuto, 300000);

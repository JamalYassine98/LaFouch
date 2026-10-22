  function MIX(t) {
    return t === 'mix' || (!!t && t === varId());
  }
  function LTIPOS() {
    return varId()
      ? TIPOS.slice()
      : TIPOS.concat([{ id: 'mix', label: 'Variados', full: 'Variados' }]);
  }
  function gTipoName(g) {
    var tp = tipoOf(g.tipo);
    return tp ? tp.full : MIX(g.tipo) ? 'Variados' : g.tipo;
  }
  function gTot(g) {
    return g.totalUsd != null ? g.totalUsd : (g.usd || 0) * g.qty;
  }
  function gOwn(g) {
    var q = g.ownQ || 0,
      c = g.ownC || 0;
    S.items.forEach(function (i) {
      if (i.lote === g.id && !i.bulk && i.custo != null) {
        q += i.qty;
        c += i.qty * i.custo;
      }
    });
    return { q: q, c: c };
  }
  function qStep(obj, key, lbl, min, ph) {
    var d = mk('div', '');
    d.appendChild(mk('div', 'lbl', lbl));
    var r = mk('div', 'sel');
    var i = mk('input', 'in');
    i.inputMode = 'numeric';
    i.placeholder = ph || '';
    i.value = obj[key] || '';
    i.setAttribute('aria-label', lbl);
    i.style.cssText = 'text-align:center;min-width:0';
    i.oninput = function () {
      obj[key] = i.value;
    };
    var st = function (dl) {
      var n = parseInt(String(i.value).replace(/\D/g, ''), 10) || 0;
      n = Math.max(min, n + dl);
      i.value = String(n);
      obj[key] = String(n);
      i.dispatchEvent(new Event('input', { bubbles: true }));
    };
    var m = btn('step', '−', function () {
      st(-1);
    });
    m.setAttribute('aria-label', 'Diminuir ' + lbl);
    var pl = btn('step', '+', function () {
      st(1);
    });
    pl.setAttribute('aria-label', 'Aumentar ' + lbl);
    r.appendChild(m);
    r.appendChild(i);
    r.appendChild(pl);
    d.appendChild(r);
    return d;
  }
  function popErr(t) {
    try {
      var e = $('popErr');
      if (!e) {
        e = document.createElement('div');
        e.id = 'popErr';
        e.setAttribute('role', 'alert');
        e.style.cssText =
          'position:fixed;left:50%;top:max(16px,env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:200;width:min(92vw,520px);background:var(--badbg);color:var(--bad);border:1px solid var(--bad);border-radius:12px;padding:14px 44px 14px 14px;font-size:14px;line-height:1.4;box-shadow:0 8px 28px rgba(0,0,0,.6)';
        var x = document.createElement('button');
        x.type = 'button';
        x.textContent = '×';
        x.setAttribute('aria-label', 'Fechar aviso');
        x.style.cssText =
          'position:absolute;right:8px;top:6px;width:32px;height:32px;border:0;background:transparent;font-size:22px;color:inherit';
        x.onclick = function () {
          e.hidden = true;
        };
        var sp = document.createElement('span');
        sp.id = 'popErrT';
        e.appendChild(sp);
        e.appendChild(x);
        document.body.appendChild(e);
      }
      $('popErrT').textContent = t;
      e.hidden = false;
      clearTimeout(popErr.t);
      popErr.t = setTimeout(function () {
        e.hidden = true;
      }, 7000);
    } catch (x) {}
  }
  function gCostErr(g, add, skip, per, qty) {
    if (!g || !(add > 0)) return '';
    var c = gOwn(g).c;
    if (per != null && qty >= grpFalta(g) && grpFalta(g) > 0) {
      var mu = gUnit(g);
      if (per + 0.005 < mu)
        return (
          'Você está detalhando todas as ' +
          grpFalta(g) +
          ' peças que faltam neste lote, e a média do que falta completar é ' +
          usd(mu) +
          ' por peça. Um custo de ' +
          usd(per) +
          ' deixaria parte do valor do lote sem destino. Use ' +
          usd(mu) +
          ' ou mais, ou deixe vazio para usar a média.'
        );
    }
    if (skip && skip.custo != null && skip.lote === g.id && !skip.bulk) c -= skip.qty * skip.custo;
    if (c + add > gTot(g) + (per != null && qty >= grpFalta(g) ? 0.005 * qty : 0.00001))
      return (
        'O custo desta peça passa do total do lote (' +
        usd(gTot(g)) +
        '): ' +
        usd(c) +
        ' já estão em peças com custo próprio e sobram ' +
        usd(Math.max(0, gTot(g) - c)) +
        '. Informe um custo menor ou deixe vazio para usar a média.'
      );
    return '';
  }
  function gUnit(g) {
    if (!(g.qty > 0)) return 0;
    var o = gOwn(g),
      n = g.qty - o.q;
    if (n <= 0) return gTot(g) / g.qty;
    return Math.max(0, (gTot(g) - o.c) / n);
  }
  function gPaid(g) {
    return (
      'Custo total ' +
      usd(gTot(g)) +
      ' · média ' +
      usd(gUnit(g)) +
      ' por peça' +
      (gOwn(g).q ? ' (já descontadas as peças com custo próprio)' : '') +
      (g.moeda && g.moeda !== 'usd'
        ? ' (' + fmtM(g.custoOrig, g.moeda) + ', câmbio do dia G$ ' + dots(g.rate || S.fx.pyg) + ')'
        : '')
    );
  }
  function effCusto(i) {
    if (i.custo != null) return i.custo;
    var g =
      i.lote &&
      S.grp.filter(function (x) {
        return x.id === i.lote;
      })[0];
    return g ? gUnit(g) : null;
  }
  function grpDet(g) {
    return sum(
      S.items.filter(function (i) {
        return i.lote === g.id && !i.bulk;
      })
    );
  }
  function syncBulk() {
    var ids = {};
    var vid = varId();
    if (vid)
      S.grp.forEach(function (g) {
        if (g.tipo === 'mix') g.tipo = vid;
      });
    S.grp.forEach(function (g) {
      ids[g.id] = 1;
    });
    if (
      S.items.some(function (i) {
        return i.bulk && !ids[i.lote];
      })
    )
      S.items = S.items.filter(function (i) {
        return !i.bulk || ids[i.lote];
      });
    var seen = {};
    S.grp.forEach(function (g) {
      var b = S.items.filter(function (i) {
          return i.bulk && i.lote === g.id;
        })[0],
        n = g.tipo !== 'mix' && tipoOf(g.tipo) ? grpFalta(g) : 0;
      if (!n) {
        if (b)
          S.items = S.items.filter(function (i) {
            return i !== b;
          });
        return;
      }
      var k = g.forn + '|' + g.tipo;
      seen[k] = (seen[k] || 0) + 1;
      var nm = 'Lote ' + g.forn + (seen[k] > 1 ? ' ' + seen[k] : '');
      if (!b) {
        b = {
          bulk: true,
          lote: g.id,
          tipo: g.tipo,
          grau: '',
          ref: nm,
          med: '',
          vr: '',
          fmt: 'Sem detalhe',
          cor: 'Sem detalhe',
          qty: n
        };
        S.items.push(b);
      } else {
        b.qty = n;
        b.tipo = g.tipo;
        b.ref = nm;
      }
    });
  }
  function grpTot(g) {
    return Math.max(0, g.qty - (g.sold || 0));
  }
  function grpFalta(g) {
    return Math.max(0, grpTot(g) - grpDet(g));
  }
  function openGrp(tipo) {
    var a = S.grp.filter(function (g) {
      return grpFalta(g) > 0;
    });
    return a
      .filter(function (g) {
        return g.tipo === tipo || MIX(g.tipo);
      })
      .concat(
        a.filter(function (g) {
          return !(g.tipo === tipo || MIX(g.tipo));
        })
      );
  }
  function gLabel(g) {
    return g.forn + ' · ' + usd(gUnit(g));
  }
  function pickG(tipo, sel) {
    var ops = openGrp(tipo);
    if (!ops.length || !sel || sel === 'none') return { g: null };
    var g = ops.filter(function (x) {
      return x.id === sel;
    })[0];
    return { g: g || null };
  }
  function gCap(g, qty) {
    return g && qty > grpFalta(g)
      ? 'O lote "' + gLabel(g) + '" só tem ' + grpFalta(g) + ' peça(s) para detalhar.'
      : '';
  }
  function loteChips(id, tipo, sel, setSel) {
    var bx = $(id + 'B'),
      ops = openGrp(tipo);
    if (!ops.length) {
      bx.hidden = true;
      return;
    }
    bx.hidden = false;
    var h = $(id);
    h.textContent = '';
    var cur = pickG(tipo, sel);
    h.appendChild(
      btn(
        'chip' + (!cur.g ? ' on' : ''),
        'Sem lote',
        function () {
          setSel('none');
          render();
        },
        !cur.g
      )
    );
    ops.forEach(function (g) {
      var on = !!(cur.g && cur.g.id === g.id);
      h.appendChild(
        btn(
          'chip' + (on ? ' on' : ''),
          gLabel(g) +
            (g.tipo === tipo || MIX(g.tipo) ? '' : ' · ' + ((tipoOf(g.tipo) || {}).label || '')) +
            ' · faltam ' +
            grpFalta(g),
          function () {
            setSel(g.id);
            render();
          },
          on
        )
      );
    });
  }

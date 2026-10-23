  // ===== Ações dos botões (data-act) e eventos globais. =====
  // Ações dos botões, por data-act.
  var ACT = {
    view: function (id) {
      setView(id);
    },
    per: function (id) {
      S.per = Number(id);
      renderDash();
    },
    fxnow: function () {
      fetchFx();
    },
    fxup: function () {
      setFx(
        S.fx.pyg * 1.03,
        S.fx.brl,
        'Simulação (demonstração)',
        false,
        'Cotação simulada para teste: dólar +3%.'
      );
    },
    fxdn: function () {
      setFx(
        S.fx.pyg * 0.97,
        S.fx.brl,
        'Simulação (demonstração)',
        false,
        'Cotação simulada para teste: dólar −3%.'
      );
    },
    opendia: function (id) {
      S.day = id;
      S.dayTab = id;
      S.view = 'dia';
      render();
      window.scrollTo(0, 0);
    },
    closedia: function () {
      S.dayTab = '';
      if (S.view === 'dia') S.view = 'hist';
      render();
      window.scrollTo(0, 0);
    },
    hback: function () {
      setView('hist');
    },
    dayprev: function () {
      var p = S.day.split('-'),
        d = new Date(+p[0], +p[1] - 1, +p[2] - 1);
      S.day = S.dayTab = dayKey(d.getTime());
      renderDay();
      renderNav();
    },
    daynext: function () {
      var p = S.day.split('-'),
        d = new Date(+p[0], +p[1] - 1, +p[2] + 1),
        k = dayKey(d.getTime());
      if (k <= dayKey(Date.now())) {
        S.day = S.dayTab = k;
        renderDay();
        renderNav();
      }
    },
    daytoday: function () {
      S.day = S.dayTab = dayKey(Date.now());
      renderDay();
      renderNav();
    },
    hopen: function (id) {
      S.hOpen = S.hOpen === id ? '' : id;
      renderDay();
    },
    estorno: function (id) {
      if (S.confEst !== id) {
        S.confEst = id;
        renderDay();
        return;
      }
      var s = S.sales.filter(function (x) {
        return x.id === id;
      })[0];
      s.estorno = true;
      S.confEst = '';
      var it = S.items.filter(function (x) {
        return (
          x.tipo === s.tipo &&
          x.ref === s.ref &&
          x.cor === s.cor &&
          x.grau === s.grau &&
          x.vr === s.vr &&
          (x.lote || '') ===
            (S.grp.some(function (g) {
              return g.id === s.lote;
            })
              ? s.lote
              : '')
        );
      })[0];
      S.cash[s.moeda] -= s.recebido - (s.taxaM || 0);
      estornoBrinde(s);
      if (it) {
        it.qty += s.qty;
        var eg =
          it.lote &&
          S.grp.filter(function (x) {
            return x.id === it.lote;
          })[0];
        if (eg) {
          eg.sold = Math.max(0, (eg.sold || 0) - s.qty);
          if (it.custo != null && !it.bulk) {
            eg.ownQ = Math.max(0, (eg.ownQ || 0) - s.qty);
            eg.ownC = Math.max(0, (eg.ownC || 0) - s.qty * it.custo);
          }
        }
      }
      render();
    },
    exppay: function (id) {
      var e = S.exp.filter(function (x) {
        return String(x.id) === id;
      })[0];
      if (!e) return;
      if (!e.paid) e.paid = {};
      var k = ymNow(),
        m = expMoeda(e);
      if (!S.cpay) S.cpay = [];
      if (e.paid[k]) {
        var pts = e.paid[k],
          pg = S.cpay.filter(function (x) {
            return x.id === e.id && x.ym === k;
          })[0],
          pm0 = (pg && pg.moeda) || 'pyg',
          pv0 = pg ? (pg.moeda && pg.orig != null ? pg.orig : pg.valor) : e.valor;
        S.cash[pm0] += pv0;
        desfazerPagamento(e, k, pts);
        delete e.paid[k];
        S.cxMsg = 'Pagamento de "' + e.nome + '" desfeito. ' + fmtM(pv0, pm0) + ' voltaram ao caixa.';
      } else {
        var need = expOrig(e);
        if ((S.cash[m] || 0) < need - 1e-9) {
          popErr(
            'Saldo em ' +
              m.toUpperCase() +
              ' insuficiente no caixa (' +
              fmtM(Math.max(0, S.cash[m] || 0), m) +
              ') para pagar ' +
              fmtM(need, m) +
              '. Corrija o saldo na aba Caixa ou troque moeda.'
          );
          return;
        }
        var t0 = Date.now();
        S.cash[m] -= need;
        e.paid[k] = t0;
        lancarPagamento(e, k, t0);
        S.cxMsg = 'Paguei "' + e.nome + '": ' + fmtM(need, m) + ' saíram do caixa.';
      }
      saveSoon();
      renderDesp();
      renderCaixa();
      renderDash();
    },
    expsave: function (id) {
      var e = S.exp.filter(function (x) {
          return String(x.id) === id;
        })[0],
        m = expMoeda(e),
        raw = m === 'pyg' ? toNum($('ev-' + id).value) : parseDec($('ev-' + id).value, m),
        v = m === 'pyg' ? raw : Math.round(raw * ratePyg(m));
      if (!raw) return;
      e.updYm = ymNow();
      if (m !== 'pyg') {
        e.rate0 = ratePyg(m);
        if (Math.abs(raw - expOrig(e)) < 1e-9) return renderDesp();
        e.orig = raw;
      } else if (v === e.valor) return renderDesp();
      if (v !== e.valor) {
        e.hist.push({ ts: Date.now(), de: e.valor, para: v });
        logDespesa('alt', { nome: e.nome, cat: e.cat, de: e.valor, para: v });
      }
      e.valor = v;
      renderDesp();
      renderDash();
    },
    exprm: function (id) {
      if (S.confRm !== Number(id)) {
        S.confRm = Number(id);
        renderDesp();
        return;
      }
      var rm = S.exp.filter(function (x) {
        return x.id === Number(id);
      })[0];
      if (rm) logDespesa('rem', { nome: rm.nome, cat: rm.cat, valor: rm.valor });
      S.exp = S.exp.filter(function (x) {
        return x.id !== Number(id);
      });
      S.confRm = '';
      renderDesp();
      renderDash();
    },
    expadd: function () {
      var n = cap1($('nName').value),
        m = $('nMoeda').value,
        raw = m === 'pyg' ? toNum($('nVal').value) : parseDec($('nVal').value, m),
        dia = Math.round(toNum($('nDia').value)) || 0;
      if (!n || !raw) {
        $('nH').textContent = 'Informe o nome e o valor.';
        return;
      }
      if (dia && (dia < 1 || dia > 31)) {
        $('nH').textContent = 'O dia de vencimento vai de 1 a 31.';
        return;
      }
      var v = m === 'pyg' ? raw : Math.round(raw * ratePyg(m)),
        ne = {
          id: S.nextExp++,
          nome: n,
          cat: $('nCat').value,
          tipo: $('nTipo').value,
          valor: v,
          hist: [],
          updYm: ymNow()
        };
      if (m !== 'pyg') {
        ne.moeda = m;
        ne.orig = raw;
        ne.rate0 = ratePyg(m);
      }
      if (dia) ne.dia = dia;
      S.exp.push(ne);
      logDespesa('novo', { nome: n, cat: $('nCat').value, tipo: $('nTipo').value, valor: v });
      renderDesp();
      renderDash();
    },
    trflip: function () {
      var t = S.tr;
      var d = t.de;
      t.de = t.para;
      t.para = d;
      t.edited = false;
      renderCaixa();
    },
    trocar: function () {
      var t = S.tr,
        v = parseDec(t.v, t.de),
        rec = parseDec(t.rec, t.para);
      if (t.de === t.para) {
        S.cxMsg = 'Escolha moedas diferentes.';
      } else if (!v || !rec) {
        S.cxMsg = 'Informe o valor que troca e o valor que recebe.';
      } else if (S.cash[t.de] < v) {
        S.cxMsg =
          'Saldo insuficiente em ' + MN[t.de] + ': você tem ' + fmtM(S.cash[t.de], t.de) + '.';
      } else {
        var dif = Math.round(rec * ratePyg(t.para) - v * ratePyg(t.de));
        S.cash[t.de] -= v;
        S.cash[t.para] += rec;
        S.cambios.unshift({
          ts: Date.now(),
          de: t.de,
          para: t.para,
          dado: v,
          rec: rec,
          difGs: dif
        });
        S.cxMsg = 'Troca registrada: ' + fmtM(v, t.de) + ' → ' + fmtM(rec, t.para) + '.';
        t.v = '';
        t.rec = '';
        t.edited = false;
      }
      renderCaixa();
      renderDash();
    },
    melhuso: function () {
      var v = parseDec($('muV').value, 'pyg'),
        d = $('muD').value.trim() || 'Melhoria da loja',
        r = reservas();
      if (!v) {
        S.cxMsg = 'Informe o valor em guaranis.';
      } else if (v > r.melh) {
        S.cxMsg = 'Saldo de melhorias insuficiente: há ' + gs(r.melh) + '.';
      } else if (v > S.cash.pyg) {
        S.cxMsg = 'Saldo insuficiente em guaranis em caixa.';
      } else {
        S.cash.pyg -= v;
        lancarMelhoria(d, v);
        S.cxMsg = 'Uso registrado: ' + gs(v) + ' em ' + d + '.';
      }
      renderCaixa();
    },
    ajustar: function () {
      S.cash = {
        pyg: parseDec($('ajP').value, 'pyg'),
        usd: parseDec($('ajU').value, 'usd'),
        brl: parseDec($('ajB').value, 'brl')
      };
      S.ini = {
        rep: parseDec($('ajR').value, 'usd'),
        colch: parseDec($('ajC').value, 'pyg'),
        melh: parseDec($('ajM').value, 'pyg')
      };
      S.cxMsg = 'Saldos salvos.';
      renderCaixa();
      renderDash();
    },
    resetall: function () {
      if (!S.confReset) {
        S.confReset = true;
        renderCaixa();
        return;
      }
      if (!S._resetAuth) {
        exigirAuth(function () {
          S._resetAuth = true;
          ACT.resetall();
        });
        return;
      }
      S._resetAuth = false;
      S.retiradas = [];
      S.confCx = [];
      S.items = [];
      S.sales = [];
      S.saleSeq = 0;
      S.imprev = [];
      S.dlog = [];
      S.elog = [];
      S.cambios = [];
      S.compras = [];
      S.melhUso = [];
      S.fotos = {};
      S.desc = {};
      S.pnome = {};
      S.cpay = [];
      S.appStart = Date.now();
      S.conf = {};
      S.pfaixa = {};
      S.contagens = [];
      S.exp = [];
      S.lotes = [];
      S.grp = [];
      S.cash = { pyg: 0, usd: 0, brl: 0 };
      S.ini = { rep: 0, colch: 0, melh: 0 };
      S.sold = 0;
      S.confReset = false;
      S.open = '';
      S.det = false;
      S.selItem = null;
      S.dayTab = '';
      S.view = 'dash';
      S.cxMsg =
        'Dados de exemplo apagados. Comece pelas Despesas, pelo saldo do Caixa e pelo Estoque.';
      render();
      window.scrollTo(0, 0);
    },
    impadd: function () {
      var d = $('impD').value.trim(),
        v = toNum($('impV').value);
      if (!d || !v) return;
      lancarImprevisto(d, v);
      renderDesp();
    }
  };
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]');
    if (!t) return;
    e.preventDefault();
    var f = ACT[t.getAttribute('data-act')];
    if (f) f(t.getAttribute('data-id'));
  });
  document.addEventListener('input', function (e) {
    var t = e.target,
      k = t.getAttribute && t.getAttribute('data-in');
    if (!k) return;
    if (k === 'exp') {
      var ex = S.exp.filter(function (x) {
          return String(x.id) === t.getAttribute('data-id');
        })[0],
        v = toNum(t.value),
        p = $('pv-' + ex.id);
      var mx = expMoeda(ex);
      if (mx !== 'pyg') v = Math.round(parseDec(t.value, mx) * ratePyg(mx));
      var nt = tm2(ex, v),
        old = totalMensal();
      p.textContent =
        v && v !== ex.valor
          ? 'Valor muda ' +
            sgn(v - ex.valor) +
            ' (' +
            (v >= ex.valor ? '+' : '−') +
            pc(Math.abs(v / ex.valor - 1)) +
            '). Total mensal: ' +
            gs(old) +
            ' → ' +
            gs(nt) +
            '. Cada peça passa a separar ' +
            gs(Math.round(nt / volumeEfetivo())) +
            ' (hoje ' +
            gs(contasPeca()) +
            ').'
          : 'Altere e veja o efeito antes de salvar.';
    }
    if (k === 'volume') {
      S.volume = Math.max(1, toNum(t.value));
      $('tmPeca').textContent = gs(contasPeca());
    }
    if (k === 'melh') {
      S.melhPeca = toNum(t.value);
    }

    if (k === 'day') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(t.value)) {
        S.day = S.dayTab = t.value;
        renderDay();
        renderNav();
      }
    }
    if (k === 'rec') {
      var rv = parseDec(t.value, S.moeda);
      S.rec = rv;
      S.recSig = S._sig;
      S._recv = rv;
      updateRec();
    }
    if (k === 'trDe' || k === 'trPara') {
      S.tr[k === 'trDe' ? 'de' : 'para'] = t.value;
      if (S.tr.de === S.tr.para)
        S.tr[k === 'trDe' ? 'para' : 'de'] = ['pyg', 'usd', 'brl'].filter(function (m) {
          return m !== t.value;
        })[0];
      S.tr.edited = false;
      renderCaixa();
    }
    if (k === 'trV') {
      S.tr.v = t.value;
      updateTr();
    }
    if (k === 'trRec') {
      S.tr.rec = t.value;
      S.tr.edited = true;
      updateTr();
    }
  });
  function tm2(e, v) {
    return totalMensal() - e.valor + v;
  }
  window.addEventListener('hashchange', function () {
    var v = location.hash.slice(1);
    if (
      VIEWS.some(function (x) {
        return x[0] === v;
      }) &&
      v !== S.view
    ) {
      S.view = v;
      render();
    }
  });
  if (
    VIEWS.some(function (x) {
      return x[0] === location.hash.slice(1);
    })
  )
    S.view = location.hash.slice(1);
  setTimeout(fetchFx, 1200);

  // ================= Moedas, Caixa =================
  var MN = { pyg: 'G$', usd: 'US$', brl: 'R$' };
  S.moeda = 'pyg';
  S.rec = null;
  S.recSig = '';
  S._sig = '';
  S._recv = 0;
  S._t = TIPOS[0];
  S._qty = 1;
  S.cash = { pyg: 1850000, usd: 320, brl: 1400 };
  S.ini = { rep: 180, colch: 150000, melh: 250000 };
  S.compras = [{ ts: tAgo(12), desc: 'Lote #3251 (parte paga)', usd: 100 }];
  S.melhUso = [{ ts: tAgo(8), desc: 'Tinta da fachada', valor: 15000 }];
  S.cambios = [{ ts: tAgo(7), de: 'pyg', para: 'usd', dado: 650000, rec: 100, difGs: -2500 }];
  S.tr = { de: 'pyg', para: 'usd', v: '300000', rec: '', edited: false };
  S.cxMsg = '';

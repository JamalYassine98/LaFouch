  // ===== Ações dos botões (data-act) e eventos globais. =====
  // Ações dos botões, por data-act.
  var ACT = {
    notifLimpa: function () {
      S.notifs = [];
      render();
    },
    inicioEd: function () {
      S.inicioEd = !S.inicioEd;
      render();
    },
    inicioReset: function () {
      S.inicioT = null;
      render();
    },
    inicioRm: function (id) {
      iniSalvar(
        iniLista().filter(function (x) {
          return x !== id;
        })
      );
    },
    inicioAdd: function (id) {
      var l = iniLista();
      l.push(id);
      iniSalvar(l);
    },
    inicioMv: function (v) {
      var p = v.split('|'),
        l = iniLista(),
        i = l.indexOf(p[0]),
        j = i + (+p[1] || 0);
      if (i < 0 || j < 0 || j >= l.length) return;
      var t = l[i];
      l[i] = l[j];
      l[j] = t;
      iniSalvar(l);
    },
    inicio: function (id) {
      inicioGo(id);
    },
    view: function (id) {
      setView(id);
    },
    per: function (id) {
      S.per = id;
      renderDash();
    },
    fxnow: function () {
      fetchFx();
    },
    fxper: function (id) {
      S.fxPer = Number(id) || 0;
      renderFx();
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
    daycal: function () {
      var i = $('dayIn');
      if (!i) return;
      try {
        i.showPicker();
      } catch (e) {
        i.focus();
        i.click();
      }
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
      if (S.view === 'hist') histLista();
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
      if (s.pags) {
        s.pags.forEach(function (l) {
          S.cash[l.moeda] -= l.v - (l.fee || 0);
        });
        (s.troco || []).forEach(function (l) {
          S.cash[l.moeda] += l.v;
        });
      } else S.cash[s.moeda] -= s.recebido - (s.taxaM || 0);
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
      S.trConf = false;
      render();
    },
    fxtrocar: function () {
      var linhas = [],
        ruim = '';
      trocarPlano().passos.forEach(function (x, i) {
        var ti = (S.trIn || {})[i] || {},
          v = parseDec(ti.v != null ? ti.v : String(x.sug), x.de),
          rec = parseDec(ti.rec != null ? ti.rec : String(x.rec), 'usd');
        if (!(v > 0) && !(rec > 0)) return;
        if (!(v > 0) || !(rec > 0)) ruim = 'Informe o que entregou e o que recebeu.';
        else if ((S.cash[x.de] || 0) < v - 0.005) ruim = 'Você não tem tudo isso em ' + x.de.toUpperCase() + ' no caixa.';
        else linhas.push({ tipo: x.tipo, de: x.de, v: v, rec: rec });
      });
      if (ruim) S.cxMsg = ruim;
      else {
        trocarRegistrar(linhas);
        S.trIn = {};
      }
      render();
    },
    fxdesfaz: function () {
      trocarDesfazer();
      render();
    },
    trocar: function () {
      // um só botão "Registrar troca": se nada foi digitado em "Outra troca", registra a sugestão de hoje
      if (!String(S.tr.v || '').trim() && !String(S.tr.rec || '').trim() && trocarPlano().passos.length) {
        ACT.fxtrocar();
        return;
      }
      var t = S.tr,
        v = parseDec(t.v, t.de),
        rec = parseDec(t.rec, t.para),
        r = trocarLivre(t.de, v, t.para, rec, S.trConf);
      S.cxMsg = r.msg;
      if (r.confirmar) S.trConf = true;
      else {
        S.trConf = false;
        if (r.ok) {
          t.v = '';
          t.rec = '';
          t.edited = false;
        }
      }
      render();
    },
    trdesfaz: function (id) {
      trocarDesfazer(id);
      render();
    },
    trusar: function (id) {
      var x = trocarPlano().passos[id];
      if (!x) return;
      S.tr = { de: x.de, para: 'usd', v: String(x.sug), rec: String(x.rec), edited: true };
      render();
    },
    melhuso: function () {
      var v = campoParaGs($('muV').value),
        d = $('muD').value.trim() || 'Melhoria da loja',
        r = reservas();
      if (!v) {
        S.cxMsg = 'Informe o valor usado.';
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
        colch: campoParaGs($('ajC').value),
        melh: campoParaGs($('ajM').value)
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
      S.descartes = [];
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
    impdel: function (id) {
      var x = S.imprev[+id];
      if (!x) return;
      if (S._impDel !== id) {
        S._impDel = id;
        S.cxMsg = '';
        var b = document.querySelector('[data-act="impdel"][data-id="' + id + '"]');
        if (b) {
          b.textContent = 'Remover?';
          b.style.cssText = 'opacity:1;width:auto;padding:0 10px;color:var(--bad)';
        }
        setTimeout(function () {
          if (S._impDel === id) {
            S._impDel = null;
            renderDesp();
          }
        }, 3500);
        return;
      }
      S._impDel = null;
      S.imprev.splice(+id, 1);
      for (var i = S.dlog.length - 1; i >= 0; i--) {
        var d = S.dlog[i];
        if (d.kind === 'imp' && d.ts === x.ts && d.valor === x.valor && d.desc === x.desc) {
          S.dlog.splice(i, 1);
          break;
        }
      }
      render();
    },
    impadd: function () {
      var d = $('impD').value.trim(),
        v = campoParaGs($('impV').value);
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
    if (k === 'trv' || k === 'trr') {
      var ix = t.getAttribute('data-id'),
        it = trocarPlano().passos[ix];
      S.trIn = S.trIn || {};
      S.trIn[ix] = { v: $('trv' + ix).value, rec: $('trr' + ix).value };
      if (it && $('trh' + ix)) $('trh' + ix).textContent = trocaCotacaoTxt(it.de, S.trIn[ix].v, S.trIn[ix].rec);
      return;
    }
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
      S.melhPeca = campoParaGs(t.value);
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
      S.trConf = false;
      render();
    }
    if (k === 'trV') {
      S.tr.v = t.value;
      S.trConf = false;
      updateTr();
    }
    if (k === 'trRec') {
      S.tr.rec = t.value;
      S.tr.edited = true;
      S.trConf = false;
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

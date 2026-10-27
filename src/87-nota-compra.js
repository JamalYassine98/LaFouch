  // ===== Chegou mercadoria: foto da nota → nota lida → entrada da compra por linha (proposta 8) =====
  var CP = null; // compra aberta: { ids: [lotes] }
  function cpFalta(ids) {
    return ids.reduce(function (a, id) {
      var g = S.grp.filter(function (x) {
        return x.id === id;
      })[0];
      return a + (g ? grpFalta(g) : 0);
    }, 0);
  }
  // 1) Chegou mercadoria: duas opções.
  function cpMenu() {
    fmSheet('Chegou mercadoria', 'Compra de fornecedor', function (bx, close) {
      var a = mk('button', 'fmCard sel'),
        t = mk('div', 'fmTx');
      a.id = 'cpFotoNota';
      var tb = mk('b', '');
      tb.innerHTML = NV_ICAM + '<span>Foto da nota</span>';
      tb.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:16px;line-height:1';
      t.appendChild(tb);
      t.appendChild(mk('span', '', 'O app lê as linhas: tipo, quantidade e custo.'));
      a.appendChild(t);
      a.onclick = function () {
        close();
        camOpen(
          function (f) {
            cpLeNota(f);
          },
          'Foto da nota da compra',
          { gallery: true, doc: true }
        );
      };
      var b = mk('button', 'fmCard sel'),
        t2 = mk('div', 'fmTx');
      b.id = 'cpMao';
      t2.appendChild(mk('b', '', 'Preencher à mão'));
      b.appendChild(t2);
      b.onclick = function () {
        close();
        S.addMode = 'lote';
        S.msg = '';
        render();
      };
      bx.appendChild(a);
      bx.appendChild(b);
      bx.appendChild(mk('div', 'fmDica w', 'Duas opções.'));
    });
  }
  function cpLeNota(f) {
    loadMsg(true, 'Lendo a nota', 75000);
    fmArquivo(f, function (cv) {
      loadTess()
        .then(function () {
          return window.Tesseract.recognize(cv, 'eng');
        })
        .then(
          function (r) {
            loadMsg(false);
            var txt = (r && r.data && r.data.text) || '',
              pp = parsePedido(txt),
              pr = parseLote(txt),
              rows = [];
            if (pp.rows.length >= 1)
              rows = pp.rows.map(function (x) {
                return { tipo: pr.tipo || S.tipo, qty: x.qty, usd: x.unit, nome: x.nome || '' };
              });
            else if (pr.qty)
              rows = [
                {
                  tipo: pr.tipo || S.tipo,
                  qty: pr.qty,
                  usd: pr.usd != null ? pr.usd : pr.total != null ? pr.total / pr.qty : 0,
                  nome: ''
                }
              ];
            cpNota({ forn: pr.forn || '', ped: pp.ped || '', rows: rows });
          },
          function () {
            loadMsg(false);
            lfToast('Não consegui ler a nota agora. Preencha à mão.');
            cpNota({ forn: '', ped: '', rows: [] });
          }
        );
    });
  }
  // 2) Nota lida: confira e dê entrada.
  function cpNota(N) {
    if (!N.rows.length) N.rows.push({ tipo: S.tipo, qty: 1, usd: 0, nome: '' });
    fmSheet('Nota lida', 'Confira antes de seguir', function (bx, close) {
      var corpo = mk('div', 'fmCorpo');
      bx.appendChild(corpo);
      function pinta() {
        corpo.innerHTML = '';
        var top = mk('div', 'fmBox'),
          l = mk('div', 'fmLn'),
          fi = document.createElement('input');
        fi.className = 'fmIn';
        fi.id = 'cpForn';
        fi.placeholder = 'Fornecedor';
        fi.value = N.forn;
        fi.oninput = function () {
          N.forn = fi.value;
        };
        l.appendChild(mk('span', '', 'Fornecedor'));
        l.appendChild(fi);
        top.appendChild(l);
        corpo.appendChild(top);
        var bl = mk('div', 'fmBox');
        bl.appendChild(mk('div', 'fmLbl', 'Linhas da compra'));
        N.rows.forEach(function (r, ix) {
          var ln = mk('div', 'cpLn'),
            tp = document.createElement('select');
          tp.className = 'fmIn';
          tipoAll()
            .filter(function (t) {
              return !t.simple;
            })
            .forEach(function (t) {
              var o = document.createElement('option');
              o.value = t.id;
              o.textContent = t.label;
              if (t.id === r.tipo) o.selected = true;
              tp.appendChild(o);
            });
          tp.onchange = function () {
            r.tipo = tp.value;
          };
          var q = document.createElement('input'),
            u = document.createElement('input');
          q.className = u.className = 'fmIn';
          q.inputMode = 'numeric';
          u.inputMode = 'decimal';
          q.value = r.qty;
          u.value = String(r.usd || '').replace('.', ',');
          q.setAttribute('aria-label', 'Peças');
          u.setAttribute('aria-label', 'US$ por peça');
          q.oninput = function () {
            r.qty = parseInt(q.value, 10) || 0;
            tot();
          };
          u.oninput = function () {
            r.usd = parseFloat(String(u.value).replace(',', '.')) || 0;
            tot();
          };
          var rm = mk('button', 'fmX', '✕');
          rm.onclick = function () {
            if (N.rows.length > 1) N.rows.splice(ix, 1);
            pinta();
          };
          ln.appendChild(tp);
          ln.appendChild(q);
          ln.appendChild(mk('span', 'fmSub', 'pç ×'));
          ln.appendChild(u);
          ln.appendChild(mk('span', 'fmSub', 'US$'));
          ln.appendChild(rm);
          bl.appendChild(ln);
        });
        var ad = mk('button', 'fmChip', '+ Outra linha');
        ad.onclick = function () {
          N.rows.push({ tipo: S.tipo, qty: 1, usd: 0, nome: '' });
          pinta();
        };
        bl.appendChild(ad);
        corpo.appendChild(bl);
        var tt = mk('div', 'fmSub', ''),
          tot = function () {
            var t = N.rows.reduce(function (a, r) {
              return a + r.qty * r.usd;
            }, 0);
            tt.textContent = 'Total ' + usd(t);
            tt.id = 'cpTotal';
          };
        tot();
        corpo.appendChild(tt);
        var ok = mk('button', 'fmBtn pri', 'Dar entrada nas peças');
        ok.id = 'cpDar';
        ok.onclick = function () {
          if (cpCria(N)) close();
        };
        corpo.appendChild(ok);
        var cb = mk('button', 'fmBtn', 'Corrigir a nota');
        cb.onclick = function () {
          close();
          S.lf = lfNew();
          S.lf.forn = N.forn;
          S.lf.rows = N.rows.map(function (r) {
            return { tipo: r.tipo, qty: String(r.qty), usd: String(r.usd).replace('.', ','), nome: r.nome, modo: 'peca' };
          });
          S.addMode = 'lote';
          render();
        };
        corpo.appendChild(cb);
        corpo.appendChild(mk('div', 'fmDica w', 'Total = soma das linhas (qtd × custo por peça).'));
      }
      pinta();
    });
  }
  // Cria os lotes da nota (um por linha) e abre a entrada da compra.
  function cpCria(N) {
    var fo = String(N.forn || '').trim().replace(/\s+/g, ' ');
    if (!fo) {
      popErr('Digite o nome do fornecedor.');
      return false;
    }
    for (var i = 0; i < N.rows.length; i++)
      if (!(N.rows[i].qty > 0) || !(N.rows[i].usd > 0)) {
        popErr('Confira a quantidade e o custo da linha ' + (i + 1) + '.');
        return false;
      }
    var FO = fo[0].toUpperCase() + fo.slice(1),
      pedId = N.rows.length > 1 || N.ped ? 'P' + Date.now().toString(36) : '',
      ids = [];
    N.rows.forEach(function (r, n) {
      var tot = Math.round(r.qty * r.usd * 10000) / 10000,
        g = {
          id: 'G' + Date.now().toString(36) + n,
          forn: FO,
          tipo: r.tipo,
          qty: r.qty,
          usd: tot / r.qty,
          totalUsd: tot,
          moeda: 'usd',
          custoOrig: tot,
          rate: Math.round(S.fx.pyg),
          sold: 0,
          ts: Date.now(),
          ped: N.ped || '',
          pedId: pedId,
          nome: r.nome || '',
          frete: 0
        };
      S.grp.push(g);
      lotCharge(g);
      ids.push(g.id);
    });
    S.addMode = 'menu';
    S.lf = lfNew();
    render();
    cpEntrada(ids);
    return true;
  }
  // 3) Entrada da compra: uma barra por linha.
  function cpEntrada(ids) {
    CP = { ids: ids };
    var gs = ids
      .map(function (id) {
        return S.grp.filter(function (x) {
          return x.id === id;
        })[0];
      })
      .filter(Boolean);
    var pcs = gs.reduce(function (a, g) {
      return a + g.qty;
    }, 0);
    fmSheet('Entrada da compra', pcs + ' peças · ' + gs.length + ' linha' + (gs.length > 1 ? 's' : ''), function (bx, close) {
      gs.forEach(function (g) {
        var reg = g.qty - grpFalta(g),
          c = mk('div', 'fmBox cpL');
        c.dataset.g = g.id;
        var hd = mk('div', 'fmLn');
        hd.style.border = '0';
        hd.appendChild(mk('b', '', (tipoOf(g.tipo) || {}).label || gTipoName(g)));
        var n = mk('b', '', reg + ' de ' + g.qty);
        if (reg >= g.qty) n.style.color = '#2fe08f';
        hd.appendChild(n);
        c.appendChild(hd);
        var bar = mk('div', 'cpBar'),
          fi = mk('i', '');
        fi.style.width = Math.round((reg / g.qty) * 100) + '%';
        bar.appendChild(fi);
        c.appendChild(bar);
        var ult = S.items.filter(function (i) {
          return i.lote === g.id && !i.bulk;
        });
        if (ult.length) {
          var u = ult[ult.length - 1];
          c.appendChild(
            mk('div', 'fmSub', u.ref + ' · ' + u.cor + ' · entrou ' + ult.reduce(function (a, i) { return a + i.qty; }, 0) + ' com custo ' + usd(gUnit(g)))
          );
        }
        if (grpFalta(g) > 0) {
          var r = mk('div', 'cpBt');
          [
            ['Ler haste', 'haste', 'pri'],
            ['Foto', 'foto', ''],
            [g.tipo === 'pre' || ult.length ? 'Detalhar depois' : 'À mão', g.tipo === 'pre' || ult.length ? 'depois' : 'mao', '']
          ].forEach(function (x) {
            var b = mk('button', 'fmBtn ' + x[2], x[0]);
            b.onclick = function () {
              close();
              if (x[1] === 'depois') {
                lfToast('As peças que faltam ficam sem detalhe, com o custo da linha.');
                return;
              }
              entGo(g, x[1]);
            };
            r.appendChild(b);
          });
          c.appendChild(r);
        }
        bx.appendChild(c);
      });
      var fl = cpFalta(ids);
      bx.appendChild(
        mk(
          'div',
          'fmDica w',
          fl > 0
            ? 'Cada linha tem própria barra. As que sobrarem entram sem detalhe, já com o custo da linha.'
            : 'Todas as peças da compra foram detalhadas.'
        )
      );
    });
  }
  // Volta para a compra depois de detalhar uma peça.
  function compraVolta() {
    if (!CP) return;
    var ids = CP.ids;
    if (cpFalta(ids) <= 0) {
      CP = null;
      return;
    }
    S.lotesView = false;
    setTimeout(function () {
      cpEntrada(ids);
    }, 250);
  }
  $('addToLote').onclick = function () {
    S.msg = '';
    cpMenu();
  };

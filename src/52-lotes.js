  // ===== Aba Lotes: lista, detalhe, formulário e leitura da nota. =====
  // Cartão de um lote (resumo e ações).
  function lotCard(g, opt) {
    var f = grpFalta(g),
      tot = grpTot(g),
      det = grpDet(g),
      tp = tipoOf(g.tipo),
      c = mk('section', 'card');
    c.style.borderLeft = '4px solid #00c8ff';
    var a = mk('div', '');
    a.style.cssText = 'display:flex;justify-content:space-between;align-items:flex-start;gap:10px';
    var ta = mk('div', '');
    ta.appendChild(
      mk('b', '', g.forn + (g.nome ? ' · ' + g.nome : '') + ' · ' + gTipoName(g) + ' · ' + g.qty + ' peças')
    );
    var pg = mk('div', 'hint', gPaid(g));
    pg.style.margin = '2px 0 0';
    ta.appendChild(pg);
    a.appendChild(ta);
    var ac = mk('div', '');
    ac.style.cssText = 'display:flex;align-items:center;gap:8px;flex:0 0 auto';
    var eg = btn(
      'tab' + (S.gEdit === g.id ? ' on' : ''),
      'Editar',
      function () {
        if (S.gEdit === g.id) {
          S.gEdit = '';
        } else {
          S.gEdit = g.id;
          S.gDist = '';
          S.gAdd = null;
          S.gDel = '';
          S.ge = {
            forn: g.forn,
            tipo: g.tipo,
            qty: String(g.qty),
            moeda: g.moeda || 'usd',
            usd: String(g.custoOrig != null ? g.custoOrig : gTot(g)).replace('.', ',')
          };
        }
        render();
      },
      S.gEdit === g.id
    );
    eg.style.cssText = 'min-height:34px;height:34px;padding:0 14px;font-size:14px';
    ac.appendChild(eg);
    var tr = mk('button', 'trash' + (S.gDel === g.id ? ' on' : ''));
    tr.type = 'button';
    tr.title = 'Remover lote';
    tr.setAttribute('aria-label', 'Remover lote');
    tr.setAttribute('aria-pressed', S.gDel === g.id);
    tr.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/><path d="M10 11v6M14 11v6"/></svg>';
    tr.onclick = function () {
      S.gDel = S.gDel === g.id ? '' : g.id;
      S.gEdit = '';
      render();
    };
    ac.appendChild(tr);
    a.appendChild(ac);
    c.appendChild(a);
    if (S.gEdit === g.id) {
      var E = S.ge,
        eb = mk('div', 'col');
      eb.style.cssText = 'gap:14px';
      var fin = function (lbl, key, mode) {
        var d = mk('div', '');
        d.appendChild(mk('div', 'lbl', lbl));
        var i = mk('input', 'in');
        i.value = E[key];
        if (mode) i.inputMode = mode;
        i.setAttribute('aria-label', lbl);
        i.oninput = function () {
          E[key] = i.value;
        };
        d.appendChild(i);
        return d;
      };
      eb.appendChild(fin('Fornecedor', 'forn'));
      var det0 = grpDet(g);
      var td = mk('div', '');
      td.appendChild(mk('div', 'lbl', 'Tipo de produto do lote'));
      var tn = mk('div', 'nav');
      var canT = function (x) {
        return !det0 || (MIX(x.id) && !MIX(g.tipo));
      };
      LTIPOS().forEach(function (x) {
        var b = btn(
          'chip' + (x.id === E.tipo ? ' on' : ''),
          x.label,
          function () {
            if (!canT(x)) return;
            E.tipo = x.id;
            render();
          },
          x.id === E.tipo
        );
        if (!canT(x) && x.id !== E.tipo) b.disabled = true;
        tn.appendChild(b);
      });
      td.appendChild(tn);
      if (det0)
        td.appendChild(
          mk(
            'div',
            'hint',
            'Já há peças detalhadas neste lote: o tipo só pode ser ampliado para Variados.'
          )
        );
      eb.appendChild(td);
      var mdv = mk('div', '');
      mdv.appendChild(mk('div', 'lbl', 'Moeda da compra'));
      var mnv = mk('div', 'nav');
      [
        ['usd', 'US$'],
        ['pyg', 'G$'],
        ['brl', 'R$']
      ].forEach(function (x) {
        mnv.appendChild(
          btn(
            'chip' + (E.moeda === x[0] ? ' on' : ''),
            x[1],
            function () {
              E.moeda = x[0];
              render();
            },
            E.moeda === x[0]
          )
        );
      });
      mdv.appendChild(mnv);
      if (
        E.moeda !== (g.moeda || 'usd') ||
        String(E.usd).replace('.', ',') !==
          String(g.custoOrig != null ? g.custoOrig : gTot(g)).replace('.', ',')
      )
        mdv.appendChild(
          mk(
            'div',
            'hint',
            'O custo será convertido para dólar pela cotação de hoje (US$ 1 = G$ ' +
              dots(S.fx.pyg) +
              ').'
          )
        );
      eb.appendChild(mdv);
      var two = mk('div', 'erow2');
      two.appendChild(qStep(E, 'qty', 'Quantidade de peças', Math.max(1, det0 + (g.sold || 0))));
      two.appendChild(
        fin(
          'Custo total do lote (' + { usd: 'US$', pyg: 'G$', brl: 'R$' }[E.moeda] + ')',
          'usd',
          'decimal'
        )
      );
      eb.appendChild(two);
      var min = det0 + (g.sold || 0);
      eb.appendChild(
        mk(
          'div',
          'hint',
          'A quantidade não pode ser menor que ' +
            min +
            ' (' +
            det0 +
            ' detalhadas' +
            (g.sold || 0 ? ' + ' + g.sold + ' vendidas' : '') +
            ').'
        )
      );
      var gx = mk('div', 'col');
      gx.style.cssText = 'gap:12px;padding:12px;border:1px dashed var(--line);border-radius:12px';
      if (!S.gAdd) {
        gx.appendChild(
          btn('chip add', '+ Adicionar outro tipo a esta compra', function () {
            S.gAdd = {
              tipo: MIX(g.tipo)
                ? S.tipo
                : (
                    TIPOS.filter(function (x) {
                      return x.id !== g.tipo;
                    })[0] || { id: S.tipo }
                  ).id,
              qty: '',
              usd: ''
            };
            render();
          })
        );
      } else {
        var X = S.gAdd,
          sy2 = { usd: 'US$', pyg: 'G$', brl: 'R$' }[g.moeda || 'usd'];
        gx.appendChild(mk('b', '', 'Outro tipo nesta compra (' + g.forn + ')'));
        var gt = mk('div', '');
        gt.appendChild(mk('div', 'lbl', 'Tipo de produto'));
        var gn = mk('div', 'nav');
        LTIPOS().forEach(function (x) {
          gn.appendChild(
            btn(
              'chip' + (x.id === X.tipo ? ' on' : ''),
              x.label,
              function () {
                X.tipo = x.id;
                render();
              },
              x.id === X.tipo
            )
          );
        });
        gt.appendChild(gn);
        gx.appendChild(gt);
        var g2 = mk('div', 'erow2');
        [
          ['Quantidade de peças', 'qty', 'numeric'],
          ['Custo total (' + sy2 + ')', 'usd', 'decimal']
        ].forEach(function (f) {
          var d = mk('div', '');
          d.appendChild(mk('div', 'lbl', f[0]));
          var i = mk('input', 'in');
          i.value = X[f[1]];
          i.inputMode = f[2];
          i.setAttribute('aria-label', f[0]);
          i.oninput = function () {
            X[f[1]] = i.value;
          };
          d.appendChild(i);
          g2.appendChild(d);
        });
        gx.appendChild(g2);
        var ge2 = mk('div', 'note n-bad');
        ge2.hidden = true;
        gx.appendChild(ge2);
        var gr2 = mk('div', '');
        gr2.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap';
        var gok = btn('go', 'Criar este lote', function () {
          var q = parseInt(String(X.qty).replace(/\D/g, ''), 10),
            u = pm(X.usd, g.moeda || 'usd');
          if (!(q > 0)) {
            ge2.hidden = false;
            ge2.textContent = 'Informe a quantidade de peças.';
            return;
          }
          if (!(u > 0) || String(X.usd).trim() === '') {
            ge2.hidden = false;
            ge2.textContent = 'Informe o custo total em ' + sy2 + '.';
            return;
          }
          var tu = Math.round(convUsd(u, g.moeda || 'usd') * 10000) / 10000;
          lotCharge(
            S.grp[
              S.grp.push({
                id: 'G' + Date.now().toString(36) + 'x',
                forn: g.forn,
                tipo: X.tipo === 'mix' ? ensureTipo('Variados') : X.tipo,
                qty: q,
                usd: tu / q,
                totalUsd: tu,
                moeda: g.moeda || 'usd',
                custoOrig: u,
                rate: Math.round(S.fx.pyg),
                sold: 0,
                ts: Date.now()
              }) - 1
            ]
          );
          S.gAdd = null;
          S.gEdit = '';
          S.msg = 'Novo lote criado: ' + q + ' peças de ' + g.forn + '.';
          render();
        });
        gok.style.cssText =
          'width:auto;margin:0;padding:0 18px;min-height:40px;height:40px;font-size:14px';
        gr2.appendChild(gok);
        gr2.appendChild(
          btn('mini', 'Cancelar', function () {
            S.gAdd = null;
            render();
          })
        );
        gx.appendChild(gr2);
      }
      eb.appendChild(gx);
      var er = mk('div', 'note n-bad');
      er.hidden = true;
      eb.appendChild(er);
      var rw = mk('div', '');
      rw.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap';
      var sv = btn('go', 'Salvar lote', function () {
        var q = parseInt(String(E.qty).replace(/\D/g, ''), 10),
          u = pm(E.usd, E.moeda),
          fo = String(E.forn || '')
            .trim()
            .replace(/\s+/g, ' '),
          bd = function (t) {
            popErr(t);
          };
        if (!fo) return bd('Digite o nome do fornecedor.');
        if (!(q > 0)) return bd('Informe a quantidade de peças.');
        if (q < min) return bd('A quantidade não pode ser menor que ' + min + '.');
        if (!(u > 0) || String(E.usd).trim() === '')
          return bd(
            'Informe o custo total do lote em ' +
              { usd: 'US$', pyg: 'G$', brl: 'R$' }[E.moeda] +
              '.'
          );
        var oldO = g.custoOrig != null ? g.custoOrig : gTot(g),
          oldM = g.moeda || 'usd',
          tot0 = gTot(g);
        if (!(E.moeda === oldM && u === oldO)) {
          tot0 = Math.round(convUsd(u, E.moeda) * 10000) / 10000;
          var oc0 = gOwn(g).c;
          if (tot0 + 0.00001 < oc0)
            return bd(
              'O total do lote não pode ficar abaixo de ' +
                usd(oc0) +
                ', que já estão em peças com custo próprio.'
            );
          g.moeda = E.moeda;
          g.custoOrig = u;
          g.rate = Math.round(S.fx.pyg);
        }
        g.forn = fo[0].toUpperCase() + fo.slice(1);
        g.qty = q;
        g.totalUsd = tot0;
        g.usd = tot0 / q;
        lotAdjust(g, oldM, oldO);
        if (canT({ id: E.tipo })) g.tipo = E.tipo === 'mix' ? ensureTipo('Variados') : E.tipo;
        S.gEdit = '';
        S.msg = 'Lote atualizado: ' + g.qty + ' peças de ' + gLabel(g) + '.';
        render();
      });
      sv.style.cssText =
        'width:auto;margin:0;padding:0 18px;min-height:40px;height:40px;font-size:14px';
      rw.appendChild(sv);
      rw.appendChild(
        btn('mini', 'Cancelar', function () {
          S.gEdit = '';
          render();
        })
      );
      eb.appendChild(rw);
      var mbx = $('lotModalBox');
      mbx.textContent = '';
      var mh = mk('div', 'mhead');
      var mt = mk('h2', '', 'Editar lote');
      mt.style.cssText = 'margin:0;font-size:18px';
      mh.appendChild(mt);
      mh.appendChild(
        btn('tab', 'Fechar', function () {
          S.gEdit = '';
          render();
        })
      );
      mbx.appendChild(mh);
      var sm = mk('div', 'hint', gLabel(g) + ' · ' + gTipoName(g));
      sm.style.margin = '0';
      mbx.appendChild(sm);
      mbx.appendChild(eb);
      $('lotModal').hidden = false;
    }

    if (MIX(g.tipo) && f > 0) {
      var db2 = btn('mini', 'Distribuir por tipo', function () {
        S.gDist = g.id;
        S.gEdit = '';
        S.gDel = '';
        var ft = TIPOS.filter(function (x) {
          return !MIX(x.id);
        })[0];
        S.dist = { rows: [{ tipo: ft ? ft.id : '', qty: '' }] };
        render();
      });
      db2.style.cssText =
        'margin-top:10px;align-self:flex-start;min-height:34px;height:34px;padding:0 12px;font-size:13px;background:var(--panel2);border:1px solid var(--line);color:var(--sub)';
      c.appendChild(db2);
    }
    if (S.gDist === g.id && S.dist) {
      var D = S.dist,
        db = mk('div', 'col');
      db.style.cssText = 'gap:14px';
      var fal = grpFalta(g),
        totD = function () {
          return D.rows.reduce(function (a, r) {
            return a + (parseInt(String(r.qty).replace(/\D/g, ''), 10) || 0);
          }, 0);
        };
      db.appendChild(
        mk(
          'div',
          'hint',
          'Este lote é Variados. Diga quantas peças são de cada tipo: elas saem do Variados e entram no estoque do tipo escolhido, com o mesmo custo médio (' +
            usd(gUnit(g)) +
            ' por peça). O que não for distribuído continua como Variados.'
        )
      );
      D.rows.forEach(function (r, ix) {
        var card = mk('div', 'col');
        card.style.cssText =
          'gap:12px;padding:12px;border:1px solid var(--line);border-radius:12px';
        var hd = mk('div', '');
        hd.style.cssText = 'display:flex;justify-content:space-between;align-items:center';
        hd.appendChild(mk('b', '', D.rows.length > 1 ? 'Tipo ' + (ix + 1) : 'Tipo'));
        if (D.rows.length > 1) {
          var tr3 = mk('button', 'trash');
          tr3.type = 'button';
          tr3.title = 'Remover esta linha';
          tr3.setAttribute('aria-label', 'Remover a linha ' + (ix + 1));
          tr3.innerHTML =
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/><path d="M10 11v6M14 11v6"/></svg>';
          tr3.onclick = function () {
            D.rows.splice(ix, 1);
            render();
          };
          hd.appendChild(tr3);
        }
        card.appendChild(hd);
        var tn3 = mk('div', 'nav');
        TIPOS.filter(function (x) {
          return !MIX(x.id);
        }).forEach(function (x) {
          tn3.appendChild(
            btn(
              'chip' + (x.id === r.tipo ? ' on' : ''),
              x.label,
              function () {
                r.tipo = x.id;
                render();
              },
              x.id === r.tipo
            )
          );
        });
        card.appendChild(tn3);
        newTipoUI(
          r,
          render,
          function (id) {
            r.tipo = id;
          },
          tn3,
          card
        );
        card.appendChild(qStep(r, 'qty', 'Quantidade de peças', 1, 'Ex.: 50'));
        db.appendChild(card);
      });
      db.appendChild(
        btn('chip add', '+ Adicionar outro tipo', function () {
          var u = TIPOS.filter(function (x) {
            return (
              !MIX(x.id) &&
              !D.rows.some(function (r) {
                return r.tipo === x.id;
              })
            );
          })[0];
          D.rows.push({ tipo: u ? u.id : '', qty: '' });
          render();
        })
      );
      var sm3 = mk('div', 'hint', ''),
        upd3 = function () {
          var t = totD();
          sm3.textContent =
            'Distribuídas ' +
            t +
            ' de ' +
            fal +
            ' · sobram ' +
            Math.max(0, fal - t) +
            ' como Variados.';
          sm3.style.color = t > fal ? 'var(--bad)' : 'var(--mute)';
        };
      upd3();
      db.appendChild(sm3);
      db.addEventListener('input', upd3);
      var rw3 = mk('div', '');
      rw3.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap';
      var ok3 = btn('go', 'Distribuir', function () {
        var rows = D.rows
          .map(function (r) {
            return { tipo: r.tipo, q: parseInt(String(r.qty).replace(/\D/g, ''), 10) || 0 };
          })
          .filter(function (r) {
            return r.q > 0;
          });
        if (!rows.length) return popErr('Informe a quantidade de pelo menos um tipo.');
        if (
          rows.some(function (r) {
            return !r.tipo;
          })
        )
          return popErr('Escolha o tipo de cada linha.');
        var n = rows.reduce(function (a, r) {
          return a + r.q;
        }, 0);
        if (n > grpFalta(g))
          return popErr(
            'O lote "' +
              gLabel(g) +
              '" só tem ' +
              grpFalta(g) +
              ' peça(s) sem detalhar para distribuir. Você informou ' +
              n +
              '.'
          );
        var avg = gUnit(g),
          T0 = gTot(g),
          oriO = g.custoOrig != null ? g.custoOrig : T0,
          k = 0;
        rows.forEach(function (r) {
          var sh = avg * r.q;
          S.grp.push({
            id: 'G' + Date.now().toString(36) + k++ + 'd',
            forn: g.forn,
            tipo: r.tipo,
            qty: r.q,
            usd: avg,
            totalUsd: sh,
            moeda: g.moeda || 'usd',
            custoOrig: T0 > 0 ? (oriO * sh) / T0 : 0,
            rate: g.rate,
            sold: 0,
            ts: Date.now() + k
          });
        });
        var T1 = Math.max(0, T0 - avg * n);
        g.qty -= n;
        g.totalUsd = T1;
        g.usd = g.qty > 0 ? T1 / g.qty : 0;
        g.custoOrig = T0 > 0 ? (oriO * T1) / T0 : 0;
        if (g.qty <= 0)
          S.grp = S.grp.filter(function (x) {
            return x !== g;
          });
        S.gDist = '';
        S.dist = null;
        S.msg =
          'Distribuídas ' +
          n +
          ' peças: ' +
          rows
            .map(function (r) {
              return r.q + ' ' + ((tipoOf(r.tipo) || {}).label || '');
            })
            .join(', ') +
          '.';
        render();
      });
      ok3.style.cssText =
        'width:auto;margin:0;padding:0 18px;min-height:40px;height:40px;font-size:14px';
      rw3.appendChild(ok3);
      rw3.appendChild(
        btn('mini', 'Cancelar', function () {
          S.gDist = '';
          S.dist = null;
          render();
        })
      );
      db.appendChild(rw3);
      var mb3 = $('lotModalBox');
      mb3.textContent = '';
      var mh3 = mk('div', 'mhead');
      var mt3 = mk('h2', '', 'Distribuir por tipo');
      mt3.style.cssText = 'margin:0;font-size:18px';
      mh3.appendChild(mt3);
      mh3.appendChild(
        btn('tab', 'Fechar', function () {
          S.gDist = '';
          S.dist = null;
          render();
        })
      );
      mb3.appendChild(mh3);
      var sh3 = mk('div', 'hint', gLabel(g) + ' · ' + fal + ' peças sem detalhar');
      sh3.style.margin = '0';
      mb3.appendChild(sh3);
      mb3.appendChild(db);
      $('lotModal').hidden = false;
    }
    var bar = mk('div', 'bar');
    bar.style.margin = '10px 0 8px';
    var bi = mk('i', '');
    bi.style.cssText =
      'background:#00c8ff;width:' + Math.min(100, tot ? (det / tot) * 100 : 0) + '%';
    bar.appendChild(bi);
    c.appendChild(bar);
    var recem = progAnim(g.id, det, tot, bar, bi);
    var r = mk('div', '');
    r.style.cssText =
      'display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:13px';
    r.appendChild(
      mk(
        'span',
        '',
        'Detalhado ' +
          det +
          ' de ' +
          tot +
          (g.sold || 0 ? ' (' + g.sold + ' já vendida' + (g.sold > 1 ? 's' : '') + ')' : '')
      )
    );
    var fl = mk('span', '', f > 0 ? 'Faltam detalhar ' + f : 'Completo');
    fl.style.color = f > 0 ? 'var(--warn)' : 'var(--ok)';
    if (recem) {
      fl.className = 'lfallok';
      fl.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5" pathLength="1"/></svg> Todas as peças detalhadas';
    }
    r.appendChild(fl);
    c.appendChild(r);
    if (opt && opt.view) {
      var vb = btn('mini', 'Ver peças (' + det + ')', function () {
        S.lotSel = g.id;
        S.lotPick = {};
        render();
        window.scrollTo(0, 0);
      });
      var vr = mk('div', '');
      vr.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-top:10px';
      vr.appendChild(vb);
      c.appendChild(vr);
    }
    if (S.gDel === g.id) {
      var z = mk('div', 'note n-bad');
      z.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:10px';
      z.appendChild(
        mk(
          'span',
          '',
          'Remover o lote "' +
            gLabel(g) +
            '"?' +
            (det
              ? ' As ' + det + ' peça(s) já detalhadas continuam no estoque, só ficam sem lote.'
              : ' Nenhuma peça foi detalhada ainda.') +
            (g.sold || 0 ? ' As vendas já feitas continuam no histórico.' : '')
        )
      );
      z.appendChild(
        btn('mini', 'Sim, remover', function () {
          lotRefund(g);
          S.items = S.items.filter(function (i) {
            return !(i.bulk && i.lote === g.id);
          });
          S.items.forEach(function (i) {
            if (i.lote === g.id) delete i.lote;
          });
          S.grp = S.grp.filter(function (x) {
            return x.id !== g.id;
          });
          S.gDel = '';
          S.gSel = '';
          S.lotSel = '';
          S.msg = 'Lote removido.';
          render();
        })
      );
      z.appendChild(
        btn('mini', 'Cancelar', function () {
          S.gDel = '';
          render();
        })
      );
      c.appendChild(z);
    }
    return c;
  }
  // Aba Lotes.
  function renderLotes() {
    var h = $('lotes');
    h.textContent = '';
    $('lotModal').hidden = true;
    if (S.lotesView) return;
    /* progresso dos lotes só aparece na aba Lotes */
  }

  // Preenche o modal de descrição das peças.
  function descModalFill() {
    var m = $('descModal');
    if (!S.descOpen) {
      m.hidden = true;
      return;
    }
    m.hidden = false;
    var box = $('descBox');
    box.textContent = '';
    var hd = mk('div', 'mhead');
    var h2 = mk('h2', '', 'Descrição das peças');
    h2.style.cssText = 'margin:0;font-size:18px';
    hd.appendChild(h2);
    hd.appendChild(
      btn('tab', 'Fechar', function () {
        S.descOpen = false;
        render();
      })
    );
    box.appendChild(hd);
    var picks = Object.keys(S.lotPick).filter(function (k) {
      return S.lotPick[k] && S.items[k];
    });
    if (!picks.length) {
      box.appendChild(mk('div', 'hint', 'Nenhuma peça selecionada.'));
      return;
    }
    picks.forEach(function (k) {
      var i = S.items[k],
        g = S.grp.filter(function (x) {
          return x.id === i.lote;
        })[0],
        tp = tipoOf(i.tipo),
        c = mk('div', 'col');
      c.style.cssText = 'gap:8px;padding:14px;border:1px solid var(--line);border-radius:12px';
      var ttl = mk(
        'b',
        '',
        i.ref +
          ' · ' +
          i.cor +
          (i.tipo === 'pre' ? ' · ' + i.grau : isSimple(i.tipo) ? '' : ' · ' + i.vr)
      );
      ttl.style.fontSize = '16px';
      c.appendChild(ttl);
      var dsc = S.desc[i.ref] != null ? S.desc[i.ref] : autoDesc(i.ref);
      var dt = mk('div', '', dsc || 'Sem descrição ainda.');
      dt.style.cssText = 'font-size:14px;line-height:1.45;' + (dsc ? '' : 'color:var(--mute)');
      c.appendChild(dt);
      var rows = [['Tipo', tp ? tp.full : i.tipo]];
      if (!isSimple(i.tipo)) {
        rows.push(['Formato', i.fmt || '—']);
        if (i.med) rows.push(['Medidas', i.med]);
        if (i.tipo === 'pre') rows.push(['Grau', i.grau]);
        else rows.push(['Variante', i.vr]);
      }
      rows.push(['Cor', i.cor]);
      rows.push(['Em estoque', i.qty + ' un.']);
      var cu = effCusto(i);
      rows.push([
        'Custo por peça',
        cu != null ? usd(cu) + (i.custo == null ? ' (média do lote)' : '') : 'sem custo detalhado'
      ]);
      if (g) rows.push(['Lote', gLabel(g)]);
      var tb = mk('div', '');
      tb.style.cssText = 'display:grid;grid-template-columns:auto 1fr;gap:4px 14px;font-size:13px';
      rows.forEach(function (r) {
        var a = mk('span', '', r[0]);
        a.style.color = 'var(--mute)';
        tb.appendChild(a);
        tb.appendChild(mk('span', '', r[1]));
      });
      c.appendChild(tb);
      box.appendChild(c);
    });
  }
  // Cabeçalho de um pedido com várias linhas (lotes).
  function pedHead(x, ms) {
    var q = 0,
      reg = 0,
      tot = 0;
    ms.forEach(function (g) {
      q += g.qty;
      reg += g.qty - grpFalta(g);
      tot += gTot(g);
    });
    var ok = reg >= q,
      c = mk('section', 'card');
    c.dataset.ped = x.pedId;
    c.style.borderLeft = '4px solid ' + (ok ? 'var(--ok)' : 'var(--warn)');
    var t = mk('div', '');
    t.style.cssText = 'display:flex;justify-content:space-between;gap:10px;align-items:flex-start';
    t.appendChild(mk('b', '', 'Compra ' + (x.ped ? '#' + x.ped + ' · ' : '') + x.forn));
    t.appendChild(mk('span', 'bdg', ok ? 'Completo' : 'Pendente'));
    c.appendChild(t);
    var fr = ms.reduce(function (a, g) {
      return a + (g.frete || 0);
    }, 0);
    c.appendChild(
      mk(
        'div',
        'hint',
        usd(tot) +
          ' no total' +
          (fr > 0 ? ' (com ' + usd(fr) + ' de frete)' : '') +
          ' · registradas ' +
          reg +
          ' de ' +
          q +
          ' peças · custo médio ' +
          usd(q ? tot / q : 0) +
          ' por peça'
      )
    );
    return c;
  }
  // Tela de lotes: lista, filtros e detalhe.
  // Entrada da compra: só ícones (haste e câmera) + "Detalhar depois".
  function entGo(g, how) {
    S.fromLot = g.id;
    S.addOpen = true;
    S.addMode = 'prod';
    S.photoFor = null;
    S.msg = '';
    S.gSel = g.id;
    if (!MIX(g.tipo)) S.tipo = g.tipo;
    render();
    if (how === 'haste') leitorGo();
    else if (how === 'mao') {
      if (typeof nvLimpaMed === 'function') nvLimpaMed();
      S.nStep = 1;
      render();
    } else $('btnFoto').onclick();
  }
  function entradaCompraRow(g, fl) {
    var w = mk('section', 'card');
    w.id = 'entCompra';
    w.style.cssText = 'display:flex;flex-direction:column;gap:10px;padding:12px';
    w.appendChild(mk('b', '', 'Dar entrada nas peças · faltam ' + fl));
    var r = mk('div', '');
    r.style.cssText = 'display:flex;gap:8px;align-items:center';
    var ih =
        '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9h18v6H3z"/><path d="M7 9v3M11 9v4M15 9v3M19 9v2"/></svg>',
      ic =
        '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
    var bh = btn('go', '', function () {
      entGo(g, 'haste');
    });
    bh.id = 'entHaste';
    bh.innerHTML = ih;
    bh.setAttribute('aria-label', 'Ler haste');
    bh.title = 'Ler haste';
    var bc = btn('tab', '', function () {
      entGo(g, 'foto');
    });
    bc.id = 'entFoto';
    bc.innerHTML = ic;
    bc.setAttribute('aria-label', 'Foto da peça ou etiqueta');
    bc.title = 'Foto da peça ou etiqueta';
    [bh, bc].forEach(function (b) {
      b.style.cssText += ';flex:1 1 0;width:auto;margin:0;min-height:52px;justify-content:center';
    });
    r.appendChild(bh);
    r.appendChild(bc);
    w.appendChild(r);
    var dl = btn('chip', 'Detalhar depois', function () {
      S.lotSel = '';
      S.lotPick = {};
      render();
    });
    dl.id = 'entDepois';
    dl.style.cssText += ';width:100%;justify-content:center';
    w.appendChild(dl);
    return w;
  }
  function renderLotView() {
    var on = !!S.lotesView,
      h = $('lotView');
    $('listCard').hidden = on || !$('detail').hidden;
    h.hidden = !on;
    h.textContent = '';
    if (on) {
      $('detail').hidden = true;
      var g =
        S.lotSel &&
        S.grp.filter(function (x) {
          return x.id === S.lotSel;
        })[0];
      if (!g) {
        S.lotSel = '';
        var t = mk('div', '');
        t.appendChild(mk('h2', '', 'Compras'));
        t.firstChild.style.cssText = 'margin:0;font-size:16px';
        var hh = mk(
          'div',
          'hint',
          'Todas as compras que você registrou. Toque em "Ver peças" para abrir uma e detalhar o que faltar.'
        );
        hh.style.margin = '2px 0 0';
        t.appendChild(hh);
        h.appendChild(t);
        if (!S.grp.length) {
          var nl = mk(
            'div',
            'note n-info',
            'Nenhuma compra ainda. Use "Adicionar" > "Chegou mercadoria" para registrar uma compra.'
          );
          h.appendChild(nl);
        }
        var dm = new Date(),
          inv = 0;
        S.grp.forEach(function (x) {
          var d = new Date(x.ts || 0);
          if (d.getFullYear() === dm.getFullYear() && d.getMonth() === dm.getMonth()) inv += gTot(x);
        });
        if (S.grp.length) hh.textContent += ' Investido neste mês: ' + usd(inv) + '.';
        var shown = {};
        S.grp
          .slice()
          .sort(function (a, b) {
            return (b.ts || 0) - (a.ts || 0);
          })
          .forEach(function (x) {
            if (x.pedId) {
              if (shown[x.pedId]) return;
              shown[x.pedId] = 1;
              var ms = S.grp.filter(function (y) {
                return y.pedId === x.pedId;
              });
              h.appendChild(pedHead(x, ms));
              ms.forEach(function (y) {
                h.appendChild(lotCard(y, { view: true }));
              });
              return;
            }
            h.appendChild(lotCard(x, { view: true }));
          });
      } else {
        var bk = btn('tab', '‹ Todos os lotes', function () {
          S.lotSel = '';
          S.lotPick = {};
          S.pEdit = -1;
          S.pDel = -1;
          render();
        });
        bk.style.alignSelf = 'flex-start';
        h.appendChild(bk);
        h.appendChild(lotCard(g));
        var its = [];
        S.items.forEach(function (i, ix) {
          if (i.lote === g.id && !i.bulk) its.push([i, ix]);
        });
        its.sort(function (a, b) {
          return a[0].ref < b[0].ref ? -1 : a[0].ref > b[0].ref ? 1 : 0;
        });
        var pt = mk('div', '');
        pt.appendChild(mk('div', 'lbl', 'Peças deste lote · toque para selecionar'));
        h.appendChild(pt);
        var fl = grpFalta(g);
        if (fl > 0) {
          h.appendChild(entradaCompraRow(g, fl));
        } else
          h.appendChild(mk('div', 'note n-ok', 'Todas as peças deste lote já foram detalhadas.'));
        if (!its.length)
          h.appendChild(
            mk(
              'div',
              'note n-info',
              'Ainda não há peças detalhadas neste lote. Toque no botão acima para adicionar.'
            )
          );
        var lst = mk('div', 'col');
        lst.style.gap = '8px';
        its.forEach(function (x) {
          var i = x[0],
            ix = x[1],
            on2 = !!S.lotPick[ix],
            r = btn(
              'pl' + (on2 ? ' on' : ''),
              '',
              function () {
                S.lotPick[ix] = !S.lotPick[ix];
                render();
              },
              on2
            );
          r.style.cssText =
            'text-align:left;width:100%;cursor:pointer;' +
            (on2 ? 'border-color:var(--accent);background:var(--panel2);' : '');
          r.setAttribute('aria-pressed', on2);
          r.appendChild(mk('span', '', on2 ? '☑' : '☐'));
          var lab = (i.tipo === 'pre' ? i.grau : isSimple(i.tipo) ? '' : i.vr) || '';
          r.appendChild(
            mk(
              'span',
              '',
              i.ref +
                (lab ? ' · ' + lab : '') +
                ' · ' +
                i.cor +
                (MIX(g.tipo) ? ' · ' + ((tipoOf(i.tipo) || {}).label || i.tipo) : '')
            )
          );
          r.appendChild(mk('b', '', i.qty + ' un.'));
          r.style.flex = '1';
          r.style.minWidth = '0';
          r.style.width = 'auto';
          var w = mk('div', '');
          w.style.cssText = 'display:flex;align-items:center;gap:6px';
          w.appendChild(r);
          var eb2 = btn('mini' + (S.pEdit === ix ? ' on' : ''), 'Editar', function () {
            if (S.pEdit === ix) {
              S.pEdit = -1;
            } else {
              S.pEdit = ix;
              S.pDel = -1;
              S.pe = {
                qty: String(i.qty),
                custo: i.custo != null ? String(i.custo).replace('.', ',') : ''
              };
            }
            render();
          });
          eb2.style.cssText =
            'min-height:34px;height:34px;padding:0 12px;font-size:13px;background:var(--panel2);border:1px solid var(--line);color:var(--sub);flex:0 0 auto';
          w.appendChild(eb2);
          var tb2 = mk('button', 'trash' + (S.pDel === ix ? ' on' : ''));
          tb2.type = 'button';
          tb2.title = 'Excluir esta peça';
          tb2.setAttribute('aria-label', 'Excluir ' + i.ref);
          tb2.innerHTML =
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/><path d="M10 11v6M14 11v6"/></svg>';
          tb2.onclick = function () {
            S.pDel = S.pDel === ix ? -1 : ix;
            S.pEdit = -1;
            render();
          };
          w.appendChild(tb2);
          lst.appendChild(w);
          if (S.pDel === ix) {
            var dz = mk('div', 'note n-bad');
            dz.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;align-items:center';
            dz.appendChild(
              mk(
                'span',
                '',
                'Excluir ' +
                  i.ref +
                  ' · ' +
                  i.cor +
                  ' (' +
                  i.qty +
                  ' un.)? As peças voltam para "faltam detalhar" deste lote.'
              )
            );
            dz.appendChild(
              btn('mini', 'Sim, excluir', function () {
                S.items = S.items.filter(function (y) {
                  return y !== i;
                });
                S.pDel = -1;
                S.lotPick = {};
                S.msg = 'Peça excluída do lote.';
                render();
              })
            );
            dz.appendChild(
              btn('mini', 'Cancelar', function () {
                S.pDel = -1;
                render();
              })
            );
            lst.appendChild(dz);
          }
          if (S.pEdit === ix) {
            var P2 = S.pe,
              ez = mk('div', 'col');
            ez.style.cssText =
              'gap:12px;padding:12px;border:1px solid var(--line);border-radius:12px';
            var qd = qStep(P2, 'qty', 'Quantidade', 1);
            var cd2 = mk('div', '');
            cd2.appendChild(mk('div', 'lbl', 'Custo desta peça (US$, vazio = média do lote)'));
            var ci2 = mk('input', 'in');
            ci2.inputMode = 'decimal';
            ci2.value = P2.custo;
            ci2.setAttribute('aria-label', 'Custo desta peça em US$');
            ci2.oninput = function () {
              P2.custo = ci2.value;
            };
            cd2.appendChild(ci2);
            var tw = mk('div', 'erow2');
            tw.appendChild(qd);
            tw.appendChild(cd2);
            ez.appendChild(tw);
            var rw2 = mk('div', '');
            rw2.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap';
            var sv2 = btn('go', 'Salvar', function () {
              var q = parseInt(String(P2.qty).replace(/\D/g, ''), 10);
              if (!(q >= 1)) return popErr('Informe a quantidade.');
              var d = q - i.qty;
              if (d > 0 && d > grpFalta(g))
                return popErr(
                  'O lote "' + gLabel(g) + '" só tem ' + grpFalta(g) + ' peça(s) para detalhar.'
                );
              var cr = String(P2.custo).trim().replace(',', '.'),
                cv = cr === '' ? null : parseFloat(cr);
              if (cv != null && !(cv >= 0))
                return popErr('Custo inválido. Use um número em US$ ou deixe vazio.');
              if (cv != null) {
                var ce4 = gCostErr(g, cv * q, i);
                if (ce4) return popErr(ce4);
              }
              i.qty = q;
              if (cv == null) delete i.custo;
              else i.custo = cv;
              S.pEdit = -1;
              S.msg = 'Peça atualizada.';
              render();
            });
            sv2.style.cssText =
              'width:auto;margin:0;padding:0 18px;min-height:38px;height:38px;font-size:14px';
            rw2.appendChild(sv2);
            rw2.appendChild(
              btn('mini', 'Cancelar', function () {
                S.pEdit = -1;
                render();
              })
            );
            ez.appendChild(rw2);
            lst.appendChild(ez);
          }
        });
        h.appendChild(lst);
        var np = Object.keys(S.lotPick).filter(function (k) {
          return S.lotPick[k] && S.items[k] && S.items[k].lote === g.id;
        }).length;
        if (np) {
          var bar = mk('div', 'note n-info');
          bar.style.cssText =
            'display:flex;flex-wrap:wrap;gap:10px;align-items:center;position:sticky;bottom:8px';
          bar.appendChild(
            mk('span', '', np + (np === 1 ? ' peça selecionada.' : ' peças selecionadas.'))
          );
          var vd = btn('go', 'Ver descrição', function () {
            S.descOpen = true;
            render();
          });
          vd.style.cssText =
            'width:auto;margin:0;padding:0 18px;min-height:38px;height:38px;font-size:14px';
          bar.appendChild(vd);
          bar.appendChild(
            btn('mini', 'Limpar', function () {
              S.lotPick = {};
              render();
            })
          );
          h.appendChild(bar);
        }
      }
    }
    descModalFill();
  }
  // Texto minúsculo e sem acentos.
  function noAcc(x) {
    try {
      return String(x).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    } catch (e) {
      return String(x).toLowerCase();
    }
  }
  // Texto de valor → número (aceita . e ,).
  function numAmt(x) {
    x = String(x)
      .replace(/[^\d.,]/g, '')
      .replace(/[.,]+$/, '');
    if (!x) return null;
    var d = x.indexOf('.') >= 0,
      c = x.indexOf(',') >= 0;
    if (d && c) {
      var lastD = x.lastIndexOf('.'),
        lastC = x.lastIndexOf(',');
      x = lastC > lastD ? x.replace(/\./g, '').replace(',', '.') : x.replace(/,/g, '');
    } else if (c) {
      x =
        (x.match(/,/g) || []).length > 1
          ? x.replace(/,/g, '')
          : /,\d{3}$/.test(x)
            ? null
            : x.replace(',', '.');
    } else if (d) {
      if ((x.match(/\./g) || []).length > 1) x = x.replace(/\./g, '');
      else if (/\.\d{3}$/.test(x)) x = null;
    }
    if (x == null) return null;
    var v = parseFloat(x);
    return isFinite(v) ? v : null;
  }
  // Interpreta o texto da nota: quantidades e valores do lote.
  function parseLote(t) {
    t = String(t || '');
    var q = {},
      m,
      U = '(?:pe[cç]as?|pie[sz]as?|pcs?|p[cç]s?|unid(?:ades?|ad)?|un|units?|pieces)';
    var re1 = new RegExp('(\\d{1,5})\\s*(?:x\\s*)?' + U + '\\b', 'gi'),
      re2 = new RegExp(
        '(?:total\\s+' + U + '|cant(?:idad|\\.)?|qtd|qty|quant(?:idade|ity)?)[\\s.:]*(\\d{1,5})\\b',
        'gi'
      );
    while ((m = re1.exec(t))) q[parseInt(m[1], 10)] = 1;
    while ((m = re2.exec(t))) q[parseInt(m[1], 10)] = 1;
    var qk = Object.keys(q).filter(function (k) {
        return +k > 0;
      }),
      qty = qk.length === 1 ? +qk[0] : null;
    var A = [],
      ra = /(G?)(?:US\s*)?\$\s*([\d.,]+)/gi;
    while ((m = ra.exec(t))) {
      if (m[1]) continue;
      var v = numAmt(m[2]);
      if (v != null && v > 0 && A.indexOf(v) < 0) A.push(v);
    }
    var usdv = null,
      total = null;
    if (qty) {
      var cands = [];
      A.forEach(function (u) {
        A.forEach(function (tt) {
          if (
            tt > u &&
            Math.abs(u * qty - tt) <= Math.max(0.011, tt * 0.004) &&
            !cands.some(function (c) {
              return c[0] === u && c[1] === tt;
            })
          )
            cands.push([u, tt]);
        });
      });
      if (cands.length === 1) {
        usdv = cands[0][0];
        total = cands[0][1];
      }
    }
    if (usdv == null) {
      var lab = [],
        rl =
          /(?:precio|pre[cç]o|price|custo|costo|unit(?:ario|ario)?)\s*(?:prom\w*|unit\w*|ahora|por\s*pe\w+|each)?[^\d$]{0,10}\$\s*([\d.,]+)/gi;
      while ((m = rl.exec(t))) {
        var v2 = numAmt(m[1]);
        if (v2 != null && v2 > 0 && lab.indexOf(v2) < 0) lab.push(v2);
      }
      if (lab.length === 1) usdv = lab[0];
    }
    var n = noAcc(t),
      isPre = /pre-?\s?graduad|pregraduad|lectura|reading/.test(n),
      isSol = /\bsolar(es)?\b|sunglass/.test(n),
      isArm = /armaz|armac|armaci|frames?\b/.test(n),
      tipo = null;
    if (isPre && !isSol) tipo = 'pre';
    else if (isSol && !isPre) tipo = 'solar';
    else if (isArm && !isPre && !isSol) tipo = 'sem';
    var fs = [];
    S.grp.forEach(function (g) {
      var k = noAcc(g.forn);
      if (k && n.indexOf(k) >= 0 && fs.indexOf(g.forn) < 0) fs.push(g.forn);
    });
    return { qty: qty, usd: usdv, total: total, tipo: tipo, forn: fs.length === 1 ? fs[0] : null };
  }
  window.__parseLote = parseLote;
  // Lê o print de um pedido do fornecedor: várias linhas "qtd × preço".
  function parsePedido(t) {
    var L = String(t || '').split(/\r?\n/),
      rows = [],
      nome = '',
      ped = '',
      m,
      mp = /(?:pedido|order|pedid)\s*(?:n[ºo°.]*)?\s*#?\s*(\d{3,})/i.exec(t) || /#\s*(\d{3,})/.exec(t);
    if (mp) ped = mp[1];
    var re = /(\d{1,5})\s*[x×*]\s*(?:US\s*)?\$?\s*(\d+(?:[.,]\d+)?)(?!\d)(.*)$/i;
    L.forEach(function (ln) {
      ln = ln.trim();
      if (!ln) return;
      m = re.exec(ln);
      if (m) {
        var q = parseInt(m[1], 10),
          u = numAmt(m[2]),
          tot = null,
          rest = m[3].match(/\$?\s*(\d+(?:[.,]\d+)?)/g);
        if (rest && rest.length) tot = numAmt(rest[rest.length - 1].replace(/[^\d.,]/g, ''));
        if (!(q > 0) || !(u > 0)) return;
        rows.push({
          nome: nome,
          qty: q,
          unit: u,
          total: tot,
          dup: tot != null && Math.abs(q * u - tot) > Math.max(0.011, tot * 0.004)
        });
        nome = '';
      } else if (/[A-Za-zÀ-ú]{3,}/.test(ln) && !/\$\s*\d/.test(ln)) nome = ln.replace(/\s+/g, ' ').slice(0, 40);
    });
    return { ped: ped, rows: rows };
  }
  window.__parsePedido = parsePedido;
  // Novo rascunho do formulário de lote.
  function lfNew() {
    return { forn: '', ped: '', frete: '', moeda: 'usd', rows: [{ tipo: '', qty: '', usd: '', nome: '', modo: 'total' }] };
  }
  // Formulário de novo lote.
  function renderLotForm() {
    var h = $('lotForm');
    h.textContent = '';
    if (S.addMode !== 'lote') return;
    var f = S.lf;
    if (!f.rows || !f.rows.length) f.rows = [{ tipo: '', qty: '', usd: '' }];
    if (!f.moeda) f.moeda = 'usd';
    f.rows.forEach(function (r) {
      if (!r.tipo || !(tipoOf(r.tipo) || r.tipo === 'mix')) r.tipo = S.tipo;
    });
    var box = mk('div', 'col');
    box.style.cssText = 'gap:16px';
    var mkIn = function (obj, lbl, key, ph, mode) {
      var d = mk('div', '');
      d.appendChild(mk('div', 'lbl', lbl));
      var i = mk('input', 'in');
      i.placeholder = ph;
      i.value = obj[key] || '';
      if (mode) i.inputMode = mode;
      i.oninput = function () {
        obj[key] = i.value;
      };
      i.setAttribute('aria-label', lbl);
      d.appendChild(i);
      return d;
    };
    var fdiv = mkIn(f, 'Fornecedor', 'forn', 'Ex.: Kazwini');
    var fin = fdiv.querySelector('input'),
      known = [];
    S.grp.forEach(function (g) {
      if (known.indexOf(g.forn) < 0) known.push(g.forn);
    });
    if (known.length) {
      var fn = mk('div', 'nav');
      fn.style.marginTop = '8px';
      known.forEach(function (k) {
        fn.appendChild(
          btn('chip', k, function () {
            f.forn = k;
            fin.value = k;
          })
        );
      });
      fdiv.appendChild(fn);
    }
    box.appendChild(fdiv);
    var md = mk('div', '');
    md.appendChild(mk('div', 'lbl', 'Moeda da compra'));
    var mn = mk('div', 'nav');
    [
      ['usd', 'US$'],
      ['pyg', 'G$'],
      ['brl', 'R$']
    ].forEach(function (x) {
      mn.appendChild(
        btn(
          'chip' + (f.moeda === x[0] ? ' on' : ''),
          x[1],
          function () {
            f.moeda = x[0];
            renderLotForm();
          },
          f.moeda === x[0]
        )
      );
    });
    md.appendChild(mn);
    if (f.moeda !== 'usd')
      md.appendChild(
        mk(
          'div',
          'hint',
          'Converte para dólar pela cotação de hoje (US$ 1 = G$ ' +
            dots(S.fx.pyg) +
            ') e entra no cálculo do custo de reposição e do colchão de segurança.'
        )
      );
    box.appendChild(md);
    var pf = mk('div', 'erow2');
    pf.appendChild(mkIn(f, 'Nº da compra (opcional)', 'ped', 'Ex.: 2682'));
    pf.appendChild(
      mkIn(
        f,
        'Frete e outras despesas (' + { usd: 'US$', pyg: 'G$', brl: 'R$' }[f.moeda] + ')',
        'frete',
        'Ex.: 30,00',
        'decimal'
      )
    );
    box.appendChild(pf);
    if (f.frete)
      box.appendChild(
        mk('div', 'hint', 'O frete é dividido entre as linhas na proporção do valor de cada uma e entra no custo das peças.')
      );
    f.rows.forEach(function (r, ix) {
      var card = mk('div', 'col');
      card.style.cssText = 'gap:14px;padding:14px;border:1px solid var(--line);border-radius:12px';
      var hd = mk('div', '');
      hd.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:8px';
      hd.appendChild(mk('b', '', f.rows.length > 1 ? 'Peças ' + (ix + 1) : 'Peças do lote'));
      if (f.rows.length > 1) {
        var tr = mk('button', 'trash');
        tr.type = 'button';
        tr.title = 'Remover esta linha';
        tr.setAttribute('aria-label', 'Remover a linha ' + (ix + 1));
        tr.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/><path d="M10 11v6M14 11v6"/></svg>';
        tr.onclick = function () {
          f.rows.splice(ix, 1);
          renderLotForm();
        };
        hd.appendChild(tr);
      }
      card.appendChild(hd);
      var td = mk('div', '');
      td.appendChild(mk('div', 'lbl', 'Tipo de produto'));
      var tn = mk('div', 'nav');
      LTIPOS().forEach(function (x) {
        tn.appendChild(
          btn(
            'chip' + (x.id === r.tipo ? ' on' : ''),
            x.label,
            function () {
              r.tipo = x.id;
              renderLotForm();
            },
            x.id === r.tipo
          )
        );
      });
      td.appendChild(tn);
      newTipoUI(
        r,
        renderLotForm,
        function (id) {
          r.tipo = id;
        },
        tn,
        td
      );
      card.appendChild(td);
      card.appendChild(mkIn(r, 'Nome ou código da linha (opcional)', 'nome', 'Ex.: Metal luxo ou R-2045'));
      if (r.dup) {
        var dn = mk('div', 'note n-warn', 'Conferir esta linha: quantidade × preço não bate com o total lido.');
        card.appendChild(dn);
      }
      var mo = mk('div', 'nav');
      [
        ['total', 'Preço do lote todo'],
        ['peca', 'Preço por peça']
      ].forEach(function (x) {
        mo.appendChild(
          btn(
            'chip' + ((r.modo || 'total') === x[0] ? ' on' : ''),
            x[1],
            function () {
              r.modo = x[0];
              renderLotForm();
            },
            (r.modo || 'total') === x[0]
          )
        );
      });
      card.appendChild(mo);
      var sym = { usd: 'US$', pyg: 'G$', brl: 'R$' }[f.moeda],
        two = mk('div', 'erow2');
      two.appendChild(qStep(r, 'qty', 'Quantidade de peças', 1, 'Ex.: 300'));
      var cd = mkIn(
        r,
        (r.modo === 'peca' ? 'Preço de cada peça (' : 'Custo total do lote (') + sym + ')',
        'usd',
        'Ex.: ' + (f.moeda === 'pyg' ? '1.240.000' : '200,00'),
        'decimal'
      );
      two.appendChild(cd);
      card.appendChild(two);
      var cv = mk('div', 'hint', '');
      cv.style.margin = '0';
      var upd = function () {
        var u = pm(r.usd, f.moeda),
          q = parseInt(String(r.qty).replace(/\D/g, ''), 10);
        if (!(u > 0)) {
          cv.textContent = '';
          return;
        }
        var tu = convUsd(r.modo === 'peca' && q > 0 ? u * q : u, f.moeda);
        cv.textContent =
          (f.moeda !== 'usd' ? '≈ ' + usd(tu) + ' no total. ' : '') +
          (q > 0
            ? 'Média: ' +
              usd(tu / q) +
              ' por peça (total ÷ quantidade). Serve de custo até você detalhar cada peça.'
            : '');
      };
      upd();
      card.querySelectorAll('input').forEach(function (x) {
        x.addEventListener('input', upd);
      });
      card.appendChild(cv);
      box.appendChild(card);
    });
    box.appendChild(
      btn('chip add', '+ Adicionar outro tipo', function () {
        var l = f.rows[f.rows.length - 1];
        f.rows.push({ tipo: l.tipo, qty: '', usd: '', nome: '', modo: l.modo || 'total' });
        renderLotForm();
      })
    );
    var er = mk('div', 'note n-bad');
    er.hidden = true;
    box.appendChild(er);
    var row = mk('div', '');
    row.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap';
    var ok = btn('go', 'Criar lote', function () {
      var fo = String(f.forn || '')
          .trim()
          .replace(/\s+/g, ' '),
        bad = function (t) {
          popErr(t);
        };
      if (!fo) return bad('Digite o nome do fornecedor.');
      var out = [];
      for (var k = 0; k < f.rows.length; k++) {
        var r = f.rows[k],
          q = parseInt(String(r.qty).replace(/\D/g, ''), 10),
          u = pm(r.usd, f.moeda),
          w = f.rows.length > 1 ? ' (linha ' + (k + 1) + ')' : '';
        if (!(q > 0)) return bad('Informe a quantidade de peças' + w + '.');
        if (!(u > 0))
          return bad(
            'Informe o preço total do lote em ' +
              { usd: 'US$', pyg: 'G$', brl: 'R$' }[f.moeda] +
              w +
              '.'
          );
        var uo = r.modo === 'peca' ? u * q : u,
          tu = Math.round(convUsd(uo, f.moeda) * 10000) / 10000;
        out.push({ tipo: r.tipo, novo: r.novo, qty: q, orig: uo, tot: tu, usd: tu / q, nome: String(r.nome || '').trim() });
      }
      var frO = pm(f.frete, f.moeda) || 0,
        sumT = out.reduce(function (a, o) {
          return a + o.tot;
        }, 0);
      if (frO > 0 && sumT > 0)
        out.forEach(function (o) {
          var sh = frO * (o.tot / sumT);
          o.frete = Math.round(convUsd(sh, f.moeda) * 10000) / 10000;
          o.orig += sh;
          o.tot = Math.round((o.tot + o.frete) * 10000) / 10000;
          o.usd = o.tot / o.qty;
        });
      var pedN = String(f.ped || '').trim(),
        pedId = out.length > 1 || pedN ? 'P' + Date.now().toString(36) : '';
      var FO = fo[0].toUpperCase() + fo.slice(1),
        gs = out.map(function (o, n) {
          return {
            id: 'G' + Date.now().toString(36) + n,
            forn: FO,
            tipo: String(o.novo || '').trim()
              ? ensureTipo(o.novo)
              : o.tipo === 'mix'
                ? ensureTipo('Variados')
                : o.tipo,
            qty: o.qty,
            usd: o.usd,
            totalUsd: o.tot,
            moeda: f.moeda,
            custoOrig: o.orig,
            rate: Math.round(S.fx.pyg),
            sold: 0,
            ts: Date.now(),
            ped: pedN,
            pedId: pedId,
            nome: o.nome,
            frete: o.frete || 0
          };
        });
      gs.forEach(function (g) {
        S.grp.push(g);
        lotCharge(g);
      });
      S.addMode = 'prod';
      S.lf = lfNew();
      if (gs[0].tipo !== 'mix') S.tipo = gs[0].tipo;
      S.todos = false;
      S.gSel = gs[0].id;
      $('lotMsg').textContent = '';
      S.msg =
        gs.length > 1
          ? gs.length +
            ' lotes criados de ' +
            FO +
            ': ' +
            gs
              .map(function (g) {
                return g.qty + ' peças por ' + usd(gTot(g));
              })
              .join(' · ') +
            '. Agora detalhe as peças (formato, grau, cor) abaixo.'
          : 'Lote criado: ' +
            gs[0].qty +
            ' peças de ' +
            gLabel(gs[0]) +
            '. Agora detalhe as peças (formato, grau, cor) abaixo.';
      render();
    });
    row.appendChild(ok);
    box.appendChild(row);
    h.appendChild(box);
  }
  // Lê a foto da nota de compra e preenche o lote.
  function readNota(file) {
    var m = $('lotMsg');
    m.style.color = 'var(--mute)';
    m.textContent = 'Lendo a nota…';
    var url = URL.createObjectURL(file),
      im = new Image();
    im.onload = function () {
      var sc = Math.min(1, 1800 / Math.max(im.naturalWidth, im.naturalHeight)),
        cv = document.createElement('canvas');
      cv.width = Math.round(im.naturalWidth * sc);
      cv.height = Math.round(im.naturalHeight * sc);
      cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
      URL.revokeObjectURL(url);
      loadTess()
        .then(function () {
          return window.Tesseract.recognize(cv, 'eng');
        })
        .then(
          function (r) {
            var txt = r && r.data && r.data.text,
              pp = parsePedido(txt);
            if (pp.rows.length >= 2) {
              var pr0 = parseLote(txt);
              S.lf.moeda = 'usd';
              if (pp.ped) S.lf.ped = pp.ped;
              if (pr0.forn) S.lf.forn = pr0.forn;
              S.lf.rows = pp.rows.map(function (x) {
                return {
                  tipo: pr0.tipo || S.tipo,
                  qty: String(x.qty),
                  usd: String(x.unit).replace('.', ','),
                  nome: x.nome,
                  modo: 'peca',
                  dup: x.dup
                };
              });
              render();
              var m2 = $('lotMsg'),
                nd = pp.rows.filter(function (x) {
                  return x.dup;
                }).length;
              m2.style.color = nd ? 'var(--warn)' : 'var(--ok)';
              m2.textContent =
                'Li ' +
                pp.rows.length +
                ' linhas da compra' +
                (nd ? ' (' + nd + ' para conferir, marcadas abaixo)' : '') +
                '. Confira cada linha antes de criar.';
              return;
            }
            var pr = parseLote(txt);
            if (!S.lf.rows || !S.lf.rows.length) S.lf.rows = [{ tipo: '', qty: '', usd: '' }];
            var r0 = S.lf.rows[0];
            if (pr.qty) r0.qty = String(pr.qty);
            var ptot =
              pr.total != null
                ? pr.total
                : pr.usd != null && pr.qty
                  ? Math.round(pr.usd * pr.qty * 100) / 100
                  : null;
            if (ptot != null) {
              S.lf.moeda = 'usd';
              r0.usd = String(ptot).replace('.', ',');
            }
            if (pr.tipo) r0.tipo = pr.tipo;
            if (pr.forn) S.lf.forn = pr.forn;
            var got = [];
            if (pr.qty) got.push(pr.qty + ' peças');
            if (ptot != null) got.push(usd(ptot) + ' no total');
            if (pr.tipo) {
              var tt = tipoOf(pr.tipo);
              if (tt) got.push(tt.full);
            }
            if (pr.forn) got.push(pr.forn);
            render();
            var mm = $('lotMsg');
            mm.style.color = got.length ? 'var(--ok)' : 'var(--warn)';
            mm.textContent = got.length
              ? 'Li na nota: ' +
                got.join(' e ') +
                '.' +
                (pr.qty && ptot != null && S.lf.forn
                  ? ''
                  : ' O que não ficou claro está em branco, preencha.') +
                ' Confira antes de criar.'
              : 'Não consegui ler a quantidade e o custo com segurança. Preencha à mão.';
          },
          function () {
            render();
            var mm = $('lotMsg');
            mm.style.color = 'var(--warn)';
            mm.textContent = 'Não consegui ler a nota neste aparelho agora. Preencha à mão.';
          }
        );
    };
    im.onerror = function () {
      m.textContent = 'Não consegui abrir essa foto.';
    };
    im.src = url;
  }
  $('btnLotFoto').onclick = function () {
    camOpen(
      function (f) {
        readNota(f);
      },
      'Foto da nota do lote',
      { gallery: true, doc: true }
    );
  };
  $('fileL').onchange = function (e) {
    var f = e.target.files && e.target.files[0];
    if (f) readNota(f);
  };

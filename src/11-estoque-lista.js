  // ===== Estoque: lista, filtros e cartões das peças. =====
  // Aba Estoque.
  function renderEstoque() {
    S.fmtF = 'all';
    var t = T(),
      isPre = S.tipo === 'pre',
      it = S.items;
    var ofT = S.todos
      ? it.filter(function (i) {
          return (
            TIPOS.some(function (x) {
              return x.id === i.tipo;
            }) &&
            (!(S.selSet && S.selSet.length) || S.selSet.indexOf(i.tipo) >= 0)
          );
        })
      : it.filter(function (i) {
          return i.tipo === S.tipo;
        });
    var kOf = function (i) {
      return S.todos ? i.tipo + '|' + i.ref : i.ref;
    };
    var q = S.q.trim().toLowerCase();
    var qm = mkMatch(q),
      flAll = ofT.filter(function (i) {
        return (
          fOk(i) &&
          (S.corF === 'all' || i.cor === S.corF) &&
          (!S.faixaF || (faixaOf(i.ref) || {}).id === S.faixaF) &&
          (!S.colF || attrOf(i.ref).colecao === S.colF) &&
          (!qm || qm(i))
        );
      });
    var REPO_MIN = 5,
      tk = {};
    flAll.forEach(function (i) {
      tk[kOf(i)] = (tk[kOf(i)] || 0) + i.qty;
    });
    /* "Repor": produtos que vendem e vão acabar logo (dias de estoque); sem histórico de venda, vale o corte antigo de 5 peças */
    var rpSet = {},
      vendeu = {};
    prodStats().forEach(function (m) {
      if (m.sold90 > 0) vendeu[m.key] = 1;
    });
    reposicao().forEach(function (m) {
      rpSet[m.key] = 1;
    });
    var lowSet = {};
    flAll.forEach(function (i) {
      var pk = i.tipo + '|' + i.ref;
      if (rpSet[pk] || (!vendeu[pk] && tk[kOf(i)] <= REPO_MIN)) lowSet[kOf(i)] = 1;
    });
    var lowK = Object.keys(lowSet);
    var fl = S.repo
      ? flAll.filter(function (i) {
          return lowK.indexOf(kOf(i)) >= 0;
        })
      : flAll;
    var lk = function (i) {
        return isPre ? i.ref : i.vr;
      };
    var dist = 0,
      falta = 0;
    var isV = false;

    $('crumb').textContent = isPre
      ? 'Grupo Pré-graduados › Grau › Formato › Referência'
      : 'Referência › Variante C1–C6 › Cor';
    var tb = $('tipos');
    tb.textContent = '';
    if (!S.delMode)
      tb.appendChild(
        btn(
          'tab' + (S.todos && !(S.selSet && S.selSet.length) ? ' on' : ''),
          'Todos os produtos · ' +
            sum(
              S.items.filter(function (i) {
                return TIPOS.some(function (x) {
                  return x.id === i.tipo;
                });
              })
            ),
          function () {
            S.lotesView = false;
            S.todos = true;
            S.selSet = [];
            S.fmtF = 'all';
            S.corF = 'all';
            S.q = '';
            S.open = '';
            S.det = false;
            S.selItem = null;
            S.msg = '';
            S.pdMode = false;
            S.pdRef = '';
            render();
          },
          !!S.todos && !(S.selSet && S.selSet.length)
        )
      );
    TIPOS.forEach(function (x) {
      if (
        !S.delMode &&
        tSel().indexOf(x.id) < 0 &&
        !S.items.some(function (i) {
          return i.tipo === x.id && i.qty > 0;
        })
      )
        return;
      var tbn = btn(
        'tab' +
          ((S.delMode ? x.id === S.delTipo : tSel().indexOf(x.id) >= 0) ? ' on' : '') +
          (S.delMode && !S.delTipo ? ' deltab' : ''),
        x.label +
          ' · ' +
          sum(
            S.items.filter(function (i) {
              return i.tipo === x.id;
            })
          ),
        function () {
          if (S.delMode) {
            S.delTipo = x.id;
            render();
            return;
          }
          var cs = S.multi ? tSel().slice() : [],
            k = cs.indexOf(x.id);
          if (!S.multi) {
            cs = [x.id];
          } else if (k >= 0) cs.splice(k, 1);
          else cs.push(x.id);
          S.lotesView = false;
          S.selSet = [];
          if (cs.length === 0) {
            S.todos = true;
          } else if (cs.length === 1) {
            S.todos = false;
            S.tipo = cs[0];
          } else {
            S.todos = true;
            S.selSet = cs;
          }
          var keepF = fSel().filter(function (f) {
            return S.items.some(function (i) {
              return i.fmt === f && i.qty > 0 && (cs.length === 0 || cs.indexOf(i.tipo) >= 0);
            });
          });
          S.fmtF = keepF.length ? keepF.join('|') : 'all';
          S.corF = 'all';
          S.q = '';
          S.open = '';
          S.det = false;
          S.selItem = null;
          S.qty = 1;
          S.mode = 'venda';
          S.msg = '';
          S.eRefV = '';
          S.delTipo = '';
          S.pdMode = false;
          S.pdRef = '';
          render();
        },
        tSel().indexOf(x.id) >= 0
      );
      tbn.dataset.k = x.id;
      tb.appendChild(tbn);
    });
    var od = S.tiposOrd || [];
    [].slice
      .call(tb.children)
      .filter(function (c) {
        return c.dataset && c.dataset.k;
      })
      .map(function (c, ix) {
        return [c, ix];
      })
      .sort(function (x, y) {
        var a = od.indexOf(x[0].dataset.k),
          b = od.indexOf(y[0].dataset.k);
        return (a < 0 ? 999 : a) - (b < 0 ? 999 : b) || x[1] - y[1];
      })
      .forEach(function (x) {
        tb.appendChild(x[0]);
      });
    tb.dataset.nosort = S.delMode ? '1' : '';
    makeSortable(tb, function (ks) {
      S.tiposOrd = reorderBy(
        TIPOS.map(function (t) {
          return t.id;
        }).concat(['__lotes']),
        ks
      );
      syncTipos();
      render();
    });
    var bm = $('btnMulti');
    bm.classList.toggle('on', !!S.multi);
    bm.setAttribute('aria-pressed', !!S.multi);
    bm.hidden = !!S.delMode || !!S.lotesView;
    var tr = $('btnTrash');
    tr.hidden = true;
    tr.classList.toggle('on', !!S.delMode);
    tr.setAttribute('aria-pressed', !!S.delMode);
    var dz = $('tipoDel');
    dz.textContent = '';
    dz.hidden = true;
    var endDel = function () {
      S.delMode = false;
      S.delTipo = '';
      render();
    };
    if (S.delMode && TIPOS.length < 2) S.delMode = false;
    if (S.delMode && !S.delTipo) {
      dz.hidden = false;
      dz.className = 'note n-info';
      dz.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:10px';
      dz.appendChild(mk('span', '', 'Modo excluir: toque no tipo que você quer apagar.'));
      dz.appendChild(btn('mini', 'Cancelar', endDel));
    }
    if (S.delMode && S.delTipo) {
      var dt = tipoOf(S.delTipo);
      if (!dt || TIPOS.indexOf(dt) < 0) {
        S.delTipo = '';
      } else {
        dz.hidden = false;
        var dst = sum(
          S.items.filter(function (i) {
            return i.tipo === dt.id;
          })
        );
        dz.className = 'note ' + (dst > 0 ? 'n-warn' : 'n-bad');
        dz.style.cssText =
          'display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:10px';
        if (dst > 0) {
          dz.appendChild(
            mk(
              'span',
              '',
              'Não dá para apagar "' +
                dt.label +
                '": ainda tem ' +
                dst +
                ' peça(s) em estoque. Venda ou ajuste antes.'
            )
          );
          dz.appendChild(
            btn('mini', 'Escolher outro', function () {
              S.delTipo = '';
              render();
            })
          );
          dz.appendChild(btn('mini', 'Cancelar', endDel));
        } else {
          dz.appendChild(
            mk('span', '', 'Apagar o tipo "' + dt.label + '"? Ele está vazio e sai da lista.')
          );
          dz.appendChild(
            btn('mini', 'Sim, apagar', function () {
              S.items = S.items.filter(function (i) {
                return i.tipo !== dt.id;
              });
              S.tiposDel.push(dt.id);
              S.delTipo = '';
              S.delMode = false;
              syncTipos();
              S.fmtF = 'all';
              S.corF = 'all';
              S.q = '';
              S.open = '';
              S.det = false;
              S.selItem = null;
              S.mode = 'venda';
              S.msg = 'Tipo "' + dt.label + '" apagado.';
              render();
            })
          );
          dz.appendChild(btn('mini', 'Cancelar', endDel));
        }
      }
    }
    $('tipoAdd').hidden = !S.addTipo;
    $('tipoSum').textContent =
      t.full +
      ' · ' +
      sum(ofT) +
      ' peça(s) em ' +
      new Set(
        ofT
          .filter(function (i) {
            return i.qty > 0;
          })
          .map(function (i) {
            return i.ref;
          })
      ).size +
      ' referência(s) em estoque.';
    var flowOn = !!(P || B),
      modalOn = !!(S.addOpen || flowOn);
    $('addModal').hidden = !modalOn;
    $('addMenu').hidden = flowOn;
    try {
      document.body.style.overflow = modalOn ? 'hidden' : '';
    } catch (e) {}
    var mt = $('mTipos');
    mt.textContent = '';
    TIPOS.forEach(function (x) {
      mt.appendChild(
        btn(
          'chip' + (x.id === S.tipo ? ' on' : ''),
          x.label,
          function () {
            S.tipo = x.id;
            S.fmtF = 'all';
            S.corF = 'all';
            S.q = '';
            S.open = '';
            S.det = false;
            S.selItem = null;
            S.qty = 1;
            S.msg = '';
            S.eRefV = '';
            S.pdMode = false;
            S.pdRef = '';
            S.delMode = false;
            S.delTipo = '';
            render();
          },
          x.id === S.tipo
        )
      );
    });
    mt.appendChild(
      btn('chip add', '+ Novo tipo', function () {
        S.nt = !S.nt;
        $('mTipoNew').textContent = '';
        render();
      })
    );
    mkTipoBox($('mTipoNew'));
    (function (m) {
      var e = $('emsg');
      if (/…\s*$/.test(m || '')) {
        if (e.dataset.busy !== m) {
          e.textContent = '';
          e.appendChild(busyEl(m));
          e.dataset.busy = m;
        }
      } else {
        e.dataset.busy = '';
        e.textContent = m || '';
      }
    })(S.msg);
    renderLotForm();
    var am = $('addModeB');
    am.textContent = '';
    [
      ['prod', 'Produto'],
      ['lote', 'Lote']
    ].forEach(function (x) {
      am.appendChild(
        btn(
          'tab' + (S.addMode === x[0] ? ' on' : ''),
          x[1],
          function () {
            S.addMode = x[0];
            S.msg = '';
            $('lotMsg').textContent = '';
            render();
          },
          S.addMode === x[0]
        )
      );
    });
    $('addPhotoB').hidden = S.addMode !== 'prod';
    $('addProdRest').hidden = S.addMode !== 'prod';
    $('addLoteB').hidden = S.addMode !== 'lote';
    renderLotes();
    renderLotView();
    loteChips('eLote', S.tipo, S.gSel, function (v) {
      S.gSel = v;
    });
    var pg0 = pickG(S.tipo, S.gSel);
    $('eCustoH').textContent = pg0.g
      ? 'Sem preencher, vale a média do lote: ' +
        usd(gUnit(pg0.g)) +
        ' por peça. Preencha só se esta peça custou diferente.'
      : 'Obrigatório: este produto não está em nenhum lote.';
    S._flAll = flAll;
    $('k1').textContent = sum(fl);
    $('k2').textContent = new Set(
      fl.map(function (i) {
        return i.ref;
      })
    ).size;
    var lpn = S.grp.filter(function (g) {
      return grpFalta(g) > 0;
    }).length;
    $('kLotN').textContent = lpn;
    $('kLot').setAttribute('aria-pressed', !!S.lotesView);
    $('kLot').style.outline = S.lotesView ? '2px solid var(--accent)' : '';

    var qOk = function (i) {
      return !qm || qm(i);
    };
    $('fmts').parentNode.hidden = true;
    var fc = $('fmts');
    fc.textContent = '';
    ['all'].concat(S.formats).forEach(function (f) {
      var n = sum(
        ofT.filter(function (i) {
          return qOk(i) && (S.corF === 'all' || i.cor === S.corF) && (f === 'all' || i.fmt === f);
        })
      );
      var onF = f === 'all' ? !fSel().length : fSel().indexOf(f) >= 0;
      if (
        f !== 'all' &&
        !onF &&
        !ofT.some(function (i) {
          return i.fmt === f;
        })
      )
        return;
      var b = btn(
        'chip' + (onF ? ' on' : ''),
        (f === 'all' ? 'Todos' : f) + ' · ' + n,
        function () {
          if (f === 'all') S.fmtF = 'all';
          else if (!S.multi) {
            S.fmtF = f;
          } else {
            var c = fSel(),
              k = c.indexOf(f);
            if (k >= 0) c.splice(k, 1);
            else c.push(f);
            S.fmtF = c.length ? c.join('|') : 'all';
          }
          S.open = '';
          S.det = false;
          S.selItem = null;
          S.qty = 1;
          S.msg = '';
          render();
        },
        onF
      );
      if (!n && !onF) b.style.opacity = '.55';
      if (f !== 'all') b.dataset.k = f;
      fc.appendChild(b);
    });
    makeSortable(fc, function (ks) {
      S.formats = reorderBy(S.formats, ks);
      render();
    });
    $('fmtAdd').hidden = !S.addFmt;
    var cc = $('cores');
    cc.textContent = '';
    var pickCor = function (c) {
      S.corF = c;
      S.open = '';
      S.det = false;
      S.selItem = null;
      S.qty = 1;
      S.msg = '';
      render();
    };
    var nAllCor = sum(
      ofT.filter(function (i) {
        return qOk(i) && fOk(i);
      })
    );
    cc.appendChild(
      btn(
        'chip' + (S.corF === 'all' ? ' on' : ''),
        'Todas · ' + nAllCor,
        function () {
          pickCor('all');
        },
        S.corF === 'all'
      )
    );
    Object.keys(S.palette).forEach(function (n) {
      var cnt = sum(
          ofT.filter(function (i) {
            return i.cor === n && qOk(i) && fOk(i);
          })
        ),
        on = S.corF === n,
        tot = sum(
          S.items.filter(function (i) {
            return i.cor === n;
          })
        );
      if (!S.manCor) {
        if (!cnt && !on) return;
        var b = btn(
          'chip' + (on ? ' on' : ''),
          '',
          function () {
            pickCor(n);
          },
          on
        );
        b.appendChild(dot(S.palette[n]));
        b.appendChild(document.createTextNode(n + ' · ' + cnt));
        b.dataset.k = n;
        cc.appendChild(b);
        return;
      }
      var w = mk('span', 'chip pal' + (on ? ' on' : ''));
      var pb = btn(
        'cb',
        '',
        function () {
          pickCor(n);
        },
        on
      );
      pb.appendChild(dot(S.palette[n]));
      pb.appendChild(document.createTextNode(n + ' · ' + tot + ' no total'));
      var x = btn('xb', '×', function () {
        delPal(n);
      });
      x.setAttribute('aria-label', 'Remover cor ' + n);
      w.appendChild(pb);
      w.appendChild(x);
      w.dataset.k = n;
      cc.appendChild(w);
    });
    makeSortable(cc, function (ks) {
      var o = reorderBy(Object.keys(S.palette), ks),
        np = {};
      o.forEach(function (k) {
        np[k] = S.palette[k];
      });
      S.palette = np;
      render();
    });
    if (!S.manCor && cc.children.length <= 1 && nAllCor === 0) {
      var em = mk('span', 'hint', 'Nenhuma peça com esses filtros.');
      em.style.margin = '0';
      cc.appendChild(em);
    }
    $('palMan').hidden = !S.manCor;
    $('btnManCor').textContent = S.manCor ? 'Concluir' : 'Gerenciar cores';
    $('btnManCor').setAttribute('aria-pressed', !!S.manCor);
    $('filtPanel').hidden = !S.filtOpen;
    $('btnFilt').setAttribute('aria-pressed', !!S.filtOpen);
    $('btnFilt').classList.toggle('on', !!S.filtOpen || !!S.sortO);
    var ff = $('fFaixas');
    ff.textContent = '';
    $('fFaixaB').hidden = !S.faixas.length;
    [{ id: '', nome: 'Todas' }].concat(S.faixas).forEach(function (x) {
      ff.appendChild(
        btn(
          'chip' + ((S.faixaF || '') === x.id ? ' on' : ''),
          x.nome,
          function () {
            S.faixaF = x.id;
            render();
          },
          (S.faixaF || '') === x.id
        )
      );
    });
    S.colF = '';
    $('fColB').hidden = true;
    var sc = $('sortChips');
    sc.textContent = '';
    [
      ['', 'Padrão'],
      ['az', 'A a Z'],
      ['za', 'Z a A']
    ].forEach(function (o) {
      sc.appendChild(
        btn(
          'chip' + ((S.sortO || '') === o[0] ? ' on' : ''),
          o[1],
          function () {
            S.sortO = o[0];
            render();
          },
          (S.sortO || '') === o[0]
        )
      );
    });
    var fs = $('fsum');
    fs.textContent = '';
    var act = [];
    if (S.fmtF !== 'all')
      act.push([
        'Formato: ' + fSel().join(', '),
        function () {
          S.fmtF = 'all';
        }
      ]);
    if (S.corF !== 'all')
      act.push([
        'Cor: ' + S.corF,
        function () {
          S.corF = 'all';
        }
      ]);
    if (S.repo)
      act.push([
        'Pede reposição',
        function () {
          S.repo = false;
        }
      ]);
    if (q)
      act.push([
        'Busca: ' + S.q.trim(),
        function () {
          S.q = '';
          $('q').value = '';
        }
      ]);
    if (!S.todos && !S.lotesView)
      act.unshift([
        t.label,
        function () {
          S.todos = true;
          S.selSet = [];
        }
      ]);
    else if (S.selSet && S.selSet.length)
      S.selSet.forEach(function (id) {
        var tt0 = TIPOS.filter(function (x) {
          return x.id === id;
        })[0];
        if (tt0)
          act.unshift([
            tt0.label,
            function () {
              S.selSet = S.selSet.filter(function (x) {
                return x !== id;
              });
              if (!S.selSet.length) S.todos = true;
              else if (S.selSet.length === 1) {
                S.todos = false;
                S.tipo = S.selSet[0];
                S.selSet = [];
              }
            }
          ]);
      });
    if (S.sortO)
      act.push([
        S.sortO === 'az' ? 'A a Z' : 'Z a A',
        function () {
          S.sortO = '';
        }
      ]);
    act.forEach(function (a) {
      var c = btn('chip on', a[0] + ' ×', function () {
        a[1]();
        S.open = '';
        S.det = false;
        S.selItem = null;
        S.qty = 1;
        S.msg = '';
        render();
      });
      c.style.cssText = 'min-height:24px;height:24px;padding:0 9px;font-size:11px;gap:4px';
      c.setAttribute('aria-label', 'Tirar filtro ' + a[0]);
      fs.appendChild(c);
    });
    fs.hidden = !act.length;

    var refs = Array.from(new Set(fl.map(kOf))).sort();
    if (S.sortO) {
      var rn = function (k) {
        return pn(k.indexOf('|') >= 0 ? k.slice(k.indexOf('|') + 1) : k);
      };
      refs.sort(function (a, b) {
        var c = rn(a).localeCompare(rn(b), 'pt', { numeric: true, sensitivity: 'base' });
        return S.sortO === 'za' ? -c : c;
      });
    }
    var openRef = refs.indexOf(S.open) >= 0 ? S.open : '';
    if (!openRef) S.det = false;
    var effRef = openRef || refs[0] || '';
    $('lt').textContent = S.todos ? 'Todos os produtos por referência' : t.full + ' por referência';
    $('lh').textContent = 'Toque num produto para abrir o catálogo dele, ver as cores e vender';
    var rows = $('rows');
    rows.textContent = '';
    Array.from(document.querySelectorAll('.xtipo')).forEach(function (n) {
      n.remove();
    });
    var gm = {},
      gOf = {},
      gDone = {};
    if (!S.pdMode)
      refs.forEach(function (r) {
        var rr0 = r.indexOf('|') >= 0 ? r.slice(r.indexOf('|') + 1) : r,
          nm = S.pnome && S.pnome[rr0];
        if (nm) {
          var k = nrm(nm).trim();
          (gm[k] = gm[k] || []).push(r);
        }
      });
    Object.keys(gm).forEach(function (k) {
      if (gm[k].length > 1)
        gm[k].forEach(function (r) {
          gOf[r] = k;
        });
    });
    var drill =
      S.nameOpen && gm[S.nameOpen] && gm[S.nameOpen].length > 1 ? S.nameOpen : gOf[openRef] || '';
    if (drill) {
      var hd = mk('div', '');
      hd.style.cssText = 'grid-column:1/-1;display:flex;align-items:center;gap:10px';
      var bk = btn('tab ibtn', '', function () {
        S.nameOpen = '';
        S.open = '';
        S.det = false;
        S.selItem = null;
        S.msg = '';
        render();
      });
      bk.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
      bk.setAttribute('aria-label', 'Voltar');
      bk.title = 'Voltar';
      var f00 = fl.filter(function (i) {
        return kOf(i) === gm[drill][0];
      })[0];
      hd.appendChild(bk);
      var ht = mk('b', '', S.pnome[f00.ref]);
      ht.style.fontSize = '17px';
      hd.appendChild(ht);
      var hs = mk('span', 'hint', gm[drill].length + ' modelos');
      hs.style.margin = '0';
      hd.appendChild(hs);
      rows.appendChild(hd);
    }
    refs.forEach(function (r) {
      var gk = gOf[r];
      if (drill) {
        if (gk !== drill) return;
      } else if (gk) {
        var gmem = gm[gk];
        if (!gDone[gk]) {
          gDone[gk] = 1;
          var f0 = fl.filter(function (i) {
              return kOf(i) === gmem[0];
            })[0],
            gtot = sum(
              flAll.filter(function (i) {
                return gmem.indexOf(kOf(i)) >= 0;
              })
            );
          var gc = btn(
            'pcard',
            '',
            function () {
              S.nameOpen = gk;
              S.open = '';
              S.det = false;
              S.selItem = null;
              render();
            },
            false
          );
          gc.appendChild(photoBox(photoOf(f0.ref), 'pbox'));
          gc.appendChild(mk('b', '', S.pnome[f0.ref]));
          gc.appendChild(mk('span', 's', gmem.length + ' modelos'));
          var gst = mk(
            'span',
            'cell ' + (gtot === 0 ? 'zero' : gtot <= 2 ? 'low' : ''),
            gtot === 0 ? 'Esgotado' : gtot + ' em estoque'
          );
          gst.style.alignSelf = 'flex-start';
          gc.appendChild(gst);
          rows.appendChild(gc);
        }
        return;
      }
      var ri = fl.filter(function (i) {
          return kOf(i) === r;
        }),
        tot = sum(
          flAll.filter(function (i) {
            return kOf(i) === r;
          })
        ),
        tt = S.todos ? tipoOf(ri[0].tipo) : t,
        rr = S.todos ? ri[0].ref : r;
      var card = btn(
        'pcard' +
          ((S.pdMode ? r === S.pdRef : r === openRef) ? ' on' : '') +
          (S.pdMode && !S.pdRef ? ' delcard' : ''),
        '',
        function () {
          if (S.selMode) {
            selAlterna(rr);
            return;
          }
          if (S.pdMode) {
            S.pdRef = S.pdRef === r ? '' : r;
            render();
            return;
          }
          if (r === openRef && S.det) {
            S.open = '';
            S.det = false;
            S.selItem = null;
            S.msg = '';
            render();
            return;
          }
          if (S.todos) {
            S.todos = false;
            S.lotesView = false;
            S.tipo = ri[0].tipo;
            S.fmtF = 'all';
            S.corF = 'all';
            S.q = '';
          }
          S.open = rr;
          S.det = true;
          S.selItem = null;
          S.detCor = '';
          S.detVr = null;
          S.qty = 1;
          S.msg = '';
          render();
          $('detail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        },
        r === openRef
      );
      card.style.position = 'relative';
      if (
        S.items.some(function (i) {
          return i.tipo === ri[0].tipo && i.ref === ri[0].ref && i.qty > 0 && effCusto(i) == null;
        })
      ) {
        var bg = mk('span', 'cbadge', '!');
        bg.title = 'Sem preço de custo detalhado';
        bg.setAttribute('role', 'img');
        bg.setAttribute('aria-label', 'Sem preço de custo detalhado');
        card.appendChild(bg);
      }
      card.appendChild(photoBox(photoOf(rr), 'pbox'));
      card.appendChild(mk('b', '', pn(rr)));
      var fxe = faixaOf(rr);
      if (fxe) {
        var fte = faixaTag(fxe);
        fte.style.alignSelf = 'flex-start';
        card.appendChild(fte);
      }
      if (S.pnome && S.pnome[rr]) {
        var cdl = mk('span', 's', 'Código ' + rr);
        if (gk) {
          cdl.style.cssText = 'font-size:10px;opacity:.55';
        }
        card.appendChild(cdl);
      }
      card.appendChild(
        mk(
          'span',
          's',
          tt.simple || S.todos
            ? tt.label + (tt.simple && ri[0].fmt && !ri[0].bulk ? ' · ' + ri[0].fmt : '')
            : ri[0].fmt + (ri[0].med ? ' · ' + ri[0].med : '')
        )
      );
      var stt = mk(
        'span',
        'cell ' + (tot === 0 ? 'zero' : tot <= 2 ? 'low' : ''),
        tot === 0 ? 'Esgotado' : tot + ' em estoque'
      );
      stt.style.alignSelf = 'flex-start';
      card.appendChild(stt);
      card.setAttribute('data-ref', rr);
      prodDecor(card, rr, ri[0].tipo);
      rows.appendChild(card);
    });
    var tp = $('btnTrashP');
    tp.hidden = !refs.length || !!S.todos;
    tp.classList.toggle('on', !!S.pdMode);
    tp.setAttribute('aria-pressed', !!S.pdMode);
    var pz = $('prodDel');
    pz.textContent = '';
    pz.hidden = true;
    var endPd = function () {
      S.pdMode = false;
      S.pdRef = '';
      render();
    };
    if (S.pdMode && !refs.length) S.pdMode = false;
    if (S.pdMode) {
      pz.hidden = false;
      pz.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:10px';
      if (!S.pdRef) {
        pz.className = 'note n-info';
        pz.appendChild(mk('span', '', 'Modo excluir: toque no produto que você quer apagar.'));
        pz.appendChild(btn('mini', 'Cancelar', endPd));
      } else {
        var pr = S.pdRef,
          pl = S.items.filter(function (i) {
            return i.tipo === S.tipo && i.ref === pr;
          }),
          pq = sum(pl);
        pz.className = 'note n-bad';
        if (!pl.length) {
          S.pdRef = '';
          pz.hidden = true;
        } else {
          pz.appendChild(
            mk(
              'span',
              '',
              'Excluir "' +
                pr +
                '"? Isso remove o produto, ' +
                pq +
                ' peça(s) em estoque e as fotos dele. As vendas já feitas continuam no histórico.' +
                ''
            )
          );
          pz.appendChild(
            btn('mini', 'Sim, excluir', function () {
              S.items = S.items.filter(function (i) {
                return !(i.tipo === S.tipo && i.ref === pr);
              });
              Object.keys(S.fotos).forEach(function (k) {
                if (
                  k.slice(0, k.indexOf('|')) === pr &&
                  !S.items.some(function (i) {
                    return i.ref === pr && k === i.ref + '|' + i.cor;
                  })
                )
                  delete S.fotos[k];
              });
              if (
                !S.items.some(function (i) {
                  return i.ref === pr;
                })
              )
                delete S.desc[pr];
              S.pdMode = false;
              S.pdRef = '';
              S.open = '';
              S.det = false;
              S.selItem = null;
              S.qty = 1;
              S.msg = 'Produto "' + pr + '" excluído.';
              render();
            })
          );
          pz.appendChild(btn('mini', 'Cancelar', endPd));
        }
      }
    }
    if (qm && !S.todos) {
      var oth = TIPOS.filter(function (x) {
        return x.id !== S.tipo;
      })
        .map(function (x) {
          return [
            x,
            S.items.filter(function (i) {
              return i.tipo === x.id && qm(i);
            })
          ];
        })
        .filter(function (a) {
          return a[1].length;
        });
      if (oth.length) {
        var ob = mk('div', 'note n-info');
        ob.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px';
        ob.appendChild(mk('span', '', 'Também encontrado em outros tipos:'));
        oth.forEach(function (a) {
          ob.appendChild(
            btn(
              'mini',
              a[0].label +
                ' (' +
                new Set(
                  a[1].map(function (i) {
                    return i.ref;
                  })
                ).size +
                ')',
              function () {
                S.todos = false;
                S.lotesView = false;
                S.tipo = a[0].id;
                S.fmtF = 'all';
                S.corF = 'all';
                S.open = '';
                S.det = false;
                S.selItem = null;
                S.qty = 1;
                S.mode = 'venda';
                S.msg = '';
                S.pdMode = false;
                S.delMode = false;
                render();
              }
            )
          );
        });
        rows.parentNode.insertBefore(ob, rows.nextSibling);
        ob.className += ' xtipo';
      }
    }
    if (!refs.length)
      rows.appendChild(
        mk('div', 'note n-warn', 'Nada com esse filtro. Tire um filtro ou dê entrada de estoque.')
      );

    var lines = fl.filter(function (i) {
      return i.ref === effRef;
    });
    if (isPre)
      lines.sort(function (a, b) {
        return parseFloat(a.grau) - parseFloat(b.grau);
      });
    var sel =
      lines.indexOf(S.selItem) >= 0
        ? S.selItem
        : lines.filter(function (i) {
            return i.qty > 0;
          })[0] || lines[0];
    var max = sel ? sel.qty : 0;
    var cap = isV
      ? Math.max(max, 1)
      : (function () {
          var gs = pickG(S.tipo, S.gSel).g;
          return gs ? Math.max(grpFalta(gs), 1) : 99;
        })();
    S.qty = Math.max(1, Math.min(S.qty, cap));
    var lineLabel = function (i) {
      return isPre ? i.grau + ' · ' + i.cor : t.simple ? i.cor : i.vr + ' ' + i.cor;
    };

    $('mV').className = 'tab' + (isV ? ' on' : '');
    $('mE').className = 'tab' + (isV ? '' : ' on');
    $('mV').setAttribute('aria-pressed', isV);
    $('mE').setAttribute('aria-pressed', !isV);
    $('pc').textContent = isV
      ? t.full + ' › ' + (effRef || '—') + ' › ' + (sel ? lineLabel(sel) : '—')
      : t.full + ' › nova entrada';
    $('vBox').hidden = !isV;
    $('eBox').hidden = isV;
    var vl = $('vLines');
    vl.textContent = '';
    lines.forEach(function (i) {
      var b = btn(
        'seg' + (i === sel ? ' on' : ''),
        '',
        function () {
          S.selItem = i;
          S.qty = 1;
          S.msg = '';
          render();
        },
        i === sel
      );
      var l = mk('span', '');
      l.style.cssText = 'display:inline-flex;align-items:center;gap:6px';
      var fk = S.fotos[i.ref + '|' + i.cor];
      if (fk) {
        var im = mk('img');
        im.src = fk;
        im.alt = 'Foto ' + i.ref;
        l.appendChild(im);
      }
      l.appendChild(dot(hexOf(i.cor)));
      l.appendChild(document.createTextNode(lineLabel(i)));
      b.appendChild(l);
      b.appendChild(
        mk(
          'span',
          'n',
          (isPre ? i.ref + ' · ' : i.fmt && !i.bulk ? i.fmt + ' · ' : '') + i.qty + ' disp.'
        )
      );
      vl.appendChild(b);
    });

    renderDetail(openRef);
    selBarra();
    var bsel = $('btnSelP');
    if (bsel) {
      bsel.hidden = !refs.length || !!S.todos;
      bsel.classList.toggle('on', !!S.selMode);
      bsel.setAttribute('aria-pressed', !!S.selMode);
    }
    $('listCard').hidden = !!S.lotesView || !$('detail').hidden;
    renderContagem();

    // entrada
    var ref = normRef($('eRef').value, t.simple);
    var known = ref
      ? S.items.filter(function (i) {
          return i.ref.toUpperCase() === ref && i.tipo === S.tipo;
        })[0]
      : null;
    S._other = ref
      ? S.items.filter(function (i) {
          return i.ref.toUpperCase() === ref && i.tipo !== S.tipo;
        })[0]
      : null;
    var fmtUsed = known ? known.fmt : S.formats.indexOf(S.eFmt) >= 0 ? S.eFmt : '';
    $('eRefH').textContent = known
      ? 'Já existe no estoque (' +
        S.items
          .filter(function (i) {
            return i.ref.toUpperCase() === ref && i.tipo === S.tipo;
          })
          .reduce(function (a, i) {
            return a + i.qty;
          }, 0) +
        ' un.). Formato ' +
        known.fmt +
        ' lembrado. Se a cor e a variante forem iguais, a quantidade é somada.'
      : '';
    try {
      updSim('eRef', 'eNome', 'eRefH', 'eSim', !ref || !!known || !!t.simple);
    } catch (eSm) {}
    $('eGrauB').hidden = !isPre;
    $('eVarB').hidden = !!t.simple;
    $('eVarL').textContent = isPre
      ? 'Classificação de cor (C1 a C6) · opcional'
      : 'Classificação de cor (C1 a C6)';
    $('eMedB').hidden = isPre || !!t.simple;
    $('eFmtB').hidden = false;
    $('eRefL').textContent = t.simple ? 'Nome ou código do item' : 'Código da haste';
    $('eNomeB').hidden = !!t.simple;
    $('eCorL').textContent = 'Cor';
    var gn = normGrau($('eGrau').value);
    $('eGrauH').textContent = $('eGrau').value
      ? gn
        ? 'Grau lido: ' + gn
        : 'Grau inválido. Use algo como +1.75, 175 ou 3.50.'
      : 'Digite como está gravado. O "+175" vira +1.75.';
    $('eGrauH').style.color = $('eGrau').value ? (gn ? 'var(--ok)' : 'var(--bad)') : 'var(--mute)';
    var ev = $('eVars');
    ev.textContent = '';
    addVarChips(ev, isPre ? S.eVarP : S.eVar, function (v) {
      if (isPre) S.eVarP = S.eVarP === v ? '' : v;
      else S.eVar = v;
      render();
    });
    var ef = $('eFmts');
    ef.textContent = '';
    fmtCat(fmtUsed).forEach(function (f) {
      ef.appendChild(
        btn(
          'chip' + (f === fmtUsed ? ' on' : ''),
          f,
          function () {
            S.eFmt = S.eFmt === f ? '' : f;
            render();
          },
          f === fmtUsed
        )
      );
    });
    ef.appendChild(
      btn('chip add', '+ Novo formato', function () {
        S.nf = S.nf === 'e' ? '' : 'e';
        S.nc = '';
        $('eFmtNew').textContent = '';
        render();
      })
    );
    newBox(
      $('eFmtNew'),
      'e',
      false,
      'Nome do formato (ex.: Oval)',
      fmtDone(function (n) {
        S.eFmt = n;
      })
    );
    $('eDot').style.background = hexOf($('eCor').value);

    $('qv').value = S.qty;
    var st = $('st');
    st.textContent = '';
    st.className = '';
    function note(c, tx) {
      st.className = 'note ' + c;
      st.textContent = tx;
    }
    var canSell = isV && sel && max > 0;
    if (isV) {
      if (!sel) note('n-warn', 'Escolha uma linha da lista, ou ajuste os filtros.');
      else if (max === 0) note('n-bad', 'Sem estoque dessa peça. Venda travada.');
      else if (S.qty >= max)
        note('n-warn', 'Limite: só há ' + max + ' dessa peça. Não dá para vender mais.');
      else note('n-ok', 'Disponível: pode vender até ' + max + ' un.');
    }
    $('go').textContent = isV ? 'Finalizar venda' : 'Registrar entrada';
    $('go').disabled = isV && !canSell;
    $('msg').textContent = S.msg || '';

    var ecc = $('eCorChips');
    ecc.textContent = '';
    Object.keys(S.palette)
      .filter(quickCor)
      .forEach(function (n) {
        var b = btn(
          'chip' + ($('eCor').value.toLowerCase() === n.toLowerCase() ? ' on' : ''),
          ' ' + n,
          function () {
            $('eCor').value = $('eCor').value.toLowerCase() === n.toLowerCase() ? '' : n;
            render();
          }
        );
        b.insertBefore(dot(S.palette[n]), b.firstChild);
        ecc.appendChild(b);
      });
    ecc.appendChild(
      btn('chip add', '+ Nova cor', function () {
        S.nc = S.nc === 'e' ? '' : 'e';
        S.nf = '';
        $('eCorNew').textContent = '';
        render();
      })
    );
    newBox(
      $('eCorNew'),
      'e',
      true,
      'Nome da cor (ex.: Azul marinho)',
      corDone(function (n) {
        $('eCor').value = n;
      })
    );
    renderPhoto();
    renderBatch();
    S._sel = sel;
    S._cap = cap;
    S._fmtUsed = fmtUsed;
    S._gn = gn;
    S._falta = falta;
    S._ref = ref;
    S._known = known;
  }


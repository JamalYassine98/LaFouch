  // ===== Estoque: tela de detalhe de um código. =====
  // Detalhe de um código: fotos, variações, edição e venda.
  function renderDetail(ref) {
    var det = $('detail'),
      wasHid = det.hidden,
      prevRef = det._ref;
    det.textContent = '';
    if (S.lotesView) {
      det.hidden = true;
      det._ref = '';
      return;
    }
    if (!S.det || !ref) {
      det.hidden = true;
      det._ref = '';
      if (!wasHid)
        setTimeout(function () {
          animEnter($('listCard'));
        }, 0);
      return;
    }
    det.hidden = false;
    if (wasHid || prevRef !== ref) animEnter(det);
    det._ref = ref;
    var all = S.items.filter(function (i) {
        return i.ref === ref && i.tipo === S.tipo;
      }),
      f = all[0];
    if (!f) {
      det.hidden = true;
      return;
    }
    var avail = all.filter(function (i) {
        return i.qty > 0;
      }),
      cores = Array.from(
        new Set(
          avail.map(function (i) {
            return i.cor;
          })
        )
      );
    var isVr = !isSimple(f.tipo) && !f.bulk,
      vrM = 6,
      selVr = '',
      vReq = f.tipo !== 'pre',
      vkey = function (i) {
        return i.vr || (vReq ? 'C1' : 'none');
      };
    var repCor = function (v) {
      var l = avail.filter(function (i) {
        return vkey(i) === v;
      });
      if (!l.length) return '';
      var w = l.filter(function (i) {
        return !!S.fotos[ref + '|' + i.cor];
      })[0];
      return (w || l[0]).cor;
    };
    if (isVr) {
      all.forEach(function (i) {
        var n = parseInt(String(i.vr || '').replace(/\D/g, ''), 10);
        if (n > vrM) vrM = n;
      });
      if (S.detVr && repCor(S.detVr)) selVr = S.detVr;
      else {
        var q0 =
          S.detCor &&
          avail.filter(function (i) {
            return i.cor === S.detCor;
          })[0];
        if (q0) selVr = vkey(q0);
        else {
          var wf =
            avail.filter(function (i) {
              return !!S.fotos[ref + '|' + i.cor];
            })[0] || avail[0];
          selVr = wf ? vkey(wf) : '';
        }
      }
      cores = [];
      for (var vk = 1; vk <= vrM; vk++) {
        var rc0 = repCor('C' + vk);
        if (rc0 && cores.indexOf(rc0) < 0) cores.push(rc0);
      }
      var rcn = repCor('none');
      if (rcn && cores.indexOf(rcn) < 0) cores.push(rcn);
      S.detCor = repCor(selVr) || '';
      S.detVr = selVr;
    }
    var gal = cores.filter(function (c) {
        return !!S.fotos[ref + '|' + c];
      }),
      cor = cores.indexOf(S.detCor) >= 0 ? S.detCor : gal[0] || cores[0] || f.cor,
      src = photoOf(ref, cor);
    var head = mk('div', '');
    head.style.cssText =
      'display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center';
    var hl = mk('div', '');
    hl.style.cssText = 'display:flex;align-items:center;gap:10px';
    var bk0 = btn('tab ibtn', '', function () {
      S.det = false;
      S.open = '';
      S.qEdit = false;
      S.qDraft = {};
      S.cDraft = {};
      S.selItem = null;
      S.msg = '';
      render();
      window.scrollTo(0, 0);
    });
    bk0.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
    bk0.setAttribute('aria-label', 'Voltar');
    bk0.title = 'Voltar';
    hl.appendChild(bk0);
    var h20 = mk('h2', '', 'Catálogo do produto');
    h20.style.cssText = 'margin:0;font-size:16px';
    hl.appendChild(h20);
    head.appendChild(hl);
    if (S.qEdRef !== ref) {
      S.qEdRef = ref;
      S.qEdit = false;
      S.qDraft = {};
      S.cDraft = {};
    }
    var hb = mk('div', '');
    hb.style.cssText = 'display:flex;gap:8px';
    var eb = btn(
      'tab ibtn' + (S.qEdit ? ' on' : ''),
      '',
      function () {
        S.qEdit = !S.qEdit;
        S.qDraft = {};
        S.cDraft = {};
        render();
      },
      !!S.qEdit
    );
    eb.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
    eb.setAttribute('aria-label', S.qEdit ? 'Sair da edição' : 'Editar');
    eb.title = S.qEdit ? 'Sair da edição' : 'Editar';
    hb.appendChild(eb);
    head.appendChild(hb);
    det.appendChild(head);
    var g = mk('div', 'detgrid'),
      left = mk('div', 'col'),
      right = mk('div', 'col');
    left.appendChild(photoBox(src, 'pbox'));
    if (gal.length > 1) {
      var gi = gal.indexOf(cor),
        go = function (d) {
          S.detCor = gal[(Math.max(gi, 0) + d + gal.length) % gal.length];
          S.detVr = null;
          render();
        };
      var nv = mk('div', '');
      nv.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px';
      nv.appendChild(
        btn('mini', '‹ Anterior', function () {
          go(-1);
        })
      );
      var cnt = mk('span', 'hint', (gi >= 0 ? gi + 1 : '–') + ' de ' + gal.length + ' fotos');
      cnt.style.margin = '0';
      nv.appendChild(cnt);
      nv.appendChild(
        btn('mini', 'Próxima ›', function () {
          go(1);
        })
      );
      left.appendChild(nv);
      var th = mk('div', '');
      th.style.cssText = 'display:flex;gap:6px;overflow-x:auto;padding:2px 0';
      gal.forEach(function (c) {
        var tb = btn(
          '',
          ' ',
          function () {
            S.detCor = c;
            S.detVr = null;
            render();
          },
          c === cor
        );
        tb.style.cssText =
          'flex:0 0 auto;width:56px;height:56px;padding:2px;border-radius:8px;background:#fff;border:2px solid ' +
          (c === cor ? '#a0457a' : 'transparent');
        tb.textContent = '';
        var ti = mk('img');
        ti.src = S.fotos[ref + '|' + c];
        ti.alt = c;
        ti.style.cssText = 'width:100%;height:100%;object-fit:contain';
        tb.appendChild(ti);
        tb.setAttribute('aria-label', 'Foto ' + c);
        th.appendChild(tb);
      });
      left.appendChild(th);
    }
    var pb = btn('mini', src ? 'Trocar foto' : 'Adicionar foto', function () {
      S.photoFor = { ref: ref, cor: cor };
      $('fileG').multiple = false;
      $('fileG').value = '';
      $('fileG').click();
    });
    left.appendChild(pb);
    if (!src) {
      var nh = mk(
        'div',
        'hint',
        gal.length
          ? 'Esta cor ainda não tem foto. Use as setas ou as miniaturas para ver as outras cores.'
          : 'Esta cor ainda não tem foto.'
      );
      nh.style.margin = '0';
      left.appendChild(nh);
    }
    var h = mk('div', '');
    h.appendChild(mk('div', '', pn(ref)));
    h.firstChild.style.cssText = 'font-size:24px;font-weight:800';
    if (S.pnome && S.pnome[ref]) {
      var cd0 = mk('div', 'hint', 'Código: ' + ref);
      cd0.style.margin = '2px 0 0';
      h.appendChild(cd0);
    }
    var sb = mk(
      'div',
      'crumb',
      T().full +
        (isSimple(f.tipo)
          ? f.fmt && !f.bulk
            ? ' · formato ' + f.fmt
            : ''
          : ' · formato ' + f.fmt + (f.med ? ' · ' + f.med : ''))
    );
    h.appendChild(sb);
    right.appendChild(h);
    if (S.qEdit && !f.bulk) {
      var nb = mk('div', 'col');
      nb.style.cssText = 'gap:8px;padding:12px;border:1px solid var(--line);border-radius:12px';
      var smp = isSimple(f.tipo),
        orig0 = (S.pnome && S.pnome[ref]) || '',
        nmi = null,
        nr = mk('div', '');
      if (!smp) {
        nb.appendChild(mk('div', 'lbl', 'Nome do produto'));
        nmi = mk('input', 'in');
        nmi.value = S.rnN != null && S.rnRef === ref ? S.rnN : orig0;
        nmi.placeholder = 'Ex.: Gatinho preto fosco';
        nmi.maxLength = 60;
        nmi.setAttribute('aria-label', 'Nome do produto');
        nb.appendChild(nmi);
      }
      nb.appendChild(mk('div', 'lbl', smp ? 'Nome do produto' : 'Código (o que fica na haste)'));
      var ni = mk('input', 'in');
      ni.value = S.rnV != null && S.rnRef === ref ? S.rnV : ref;
      ni.setAttribute('aria-label', smp ? 'Nome do produto' : 'Código');
      nb.appendChild(ni);
      var dirty = function () {
          return normRef(ni.value, smp) !== ref || (nmi && nmi.value.trim() !== orig0);
        },
        upd = function () {
          S.rnRef = ref;
          S.rnV = ni.value;
          if (nmi) S.rnN = nmi.value;
          nr.hidden = !dirty();
        };
      ni.oninput = upd;
      if (nmi) nmi.oninput = upd;
      nr.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap';
      nr.hidden = !dirty();
      var ns = btn('mini', 'Salvar', function () {
        var nn = normRef(ni.value, smp);
        if (!nn) return popErr(smp ? 'Digite o nome do produto.' : 'Digite o código da haste.');
        var nv0 = nmi ? nmi.value.trim() : '';
        if (nn === ref) {
          if (nmi) {
            if (nv0) setPN(ref, nv0);
            else if (S.pnome) delete S.pnome[ref];
          }
          S.rnV = null;
          S.rnN = null;
          S.rnRef = '';
          S.msg = 'Nome salvo.';
          render();
          return;
        }
        if (
          S.items.some(function (i) {
            return i.ref.toUpperCase() === nn.toUpperCase() && i.ref !== ref;
          })
        )
          return popErr('Já existe um produto chamado "' + nn + '". Escolha outro nome.');
        var tp = f.tipo;
        S.items.forEach(function (i) {
          if (i.tipo === tp && i.ref === ref && !i.bulk) i.ref = nn;
        });
        Object.keys(S.fotos).forEach(function (k) {
          if (k.slice(0, k.indexOf('|')) === ref) {
            var nk = nn + k.slice(k.indexOf('|'));
            S.fotos[nk] = S.fotos[k];
            delete S.fotos[k];
            try {
              if (IDBOK)
                idbDo('hq', 'readonly', function (o) {
                  return o.get(k);
                })
                  .then(function (v) {
                    if (v)
                      return idbDo('hq', 'readwrite', function (o2) {
                        return o2.put(v, nk);
                      });
                  })
                  .catch(function () {});
            } catch (e) {}
          }
        });
        if (S.desc[ref] != null) {
          S.desc[nn] = S.desc[ref];
          delete S.desc[ref];
        }
        if (S.pnome && S.pnome[ref]) {
          S.pnome[nn] = S.pnome[ref];
          delete S.pnome[ref];
        }
        if (nmi) {
          if (nv0) setPN(nn, nv0);
          else if (S.pnome) delete S.pnome[nn];
        }
        if (S.open === ref) S.open = nn;
        S.qEdRef = nn;
        S.cdRef = nn;
        S.rnV = null;
        S.rnN = null;
        S.rnRef = '';
        S.msg =
          (isSimple(f.tipo) ? 'Nome' : 'Código') + ' alterado de "' + ref + '" para "' + nn + '".';
        render();
      });
      nr.appendChild(ns);
      nr.appendChild(
        btn('mini', 'Cancelar', function () {
          S.rnV = null;
          S.rnN = null;
          S.rnRef = '';
          render();
        })
      );
      nb.appendChild(nr);
      right.appendChild(nb);
    }
    var dv = mk('div', '');
    dv.appendChild(mk('div', 'lbl', 'Descrição'));
    var ta = mk('textarea', 'in');
    ta.id = 'descTa';
    ta.setAttribute('aria-label', 'Descrição do produto');
    ta.value = S.desc[ref] != null ? S.desc[ref] : autoDesc(ref);
    ta.oninput = function () {
      S.desc[ref] = ta.value;
    };
    dv.appendChild(ta);
    right.appendChild(dv);
    if (S.cdRef !== ref) {
      S.cdRef = ref;
      S.cdMode = false;
      S.cdCor = '';
      S.qDraft = {};
      S.cDraft = {};
    }
    var cv = mk('div', '');
    var ch = mk('div', '');
    ch.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:8px';
    var cl = mk('div', 'lbl', isVr ? 'Classificação de cor (C1 a C6)' : 'Cores disponíveis');
    cl.style.margin = '0';
    ch.appendChild(cl);
    if (cores.length && !isVr) {
      var ctb = mk('button', 'trash' + (S.cdMode ? ' on' : ''));
      ctb.type = 'button';
      ctb.title = 'Excluir uma cor';
      ctb.setAttribute('aria-label', 'Excluir uma cor');
      ctb.setAttribute('aria-pressed', !!S.cdMode);
      ctb.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/><path d="M10 11v6M14 11v6"/></svg>';
      ctb.onclick = function () {
        if (S.cdMode) {
          S.cdMode = false;
          S.cdCor = '';
        } else {
          S.cdMode = true;
          S.cdCor = cor;
        }
        render();
      };
      ch.appendChild(ctb);
    }
    cv.appendChild(ch);
    var cn = mk('div', 'nav');
    cn.style.marginTop = '8px';
    if (!cores.length) cn.appendChild(mk('div', 'note n-bad', 'Nenhuma cor em estoque.'));
    if (isVr) {
      var vlist = [];
      for (var vk2 = 1; vk2 <= vrM; vk2++) vlist.push('C' + vk2);
      if (
        !vReq &&
        avail.some(function (i) {
          return vkey(i) === 'none';
        })
      )
        vlist.push('none');
      vlist.forEach(function (v) {
        var q = sum(
            avail.filter(function (i) {
              return vkey(i) === v;
            })
          ),
          rc = repCor(v),
          has = !!(rc && S.fotos[ref + '|' + rc]);
        var b = btn(
          'chip' + (v === selVr ? ' on' : ''),
          '',
          function () {
            S.detVr = v;
            S.detCor = rc;
            render();
          },
          v === selVr
        );
        b.appendChild(document.createTextNode((v === 'none' ? 'Sem C' : v) + ' · ' + q));
        if (!q) {
          b.disabled = true;
          b.style.opacity = '.4';
        } else if (!has) {
          var tg2 = mk('span', 'cell', 'sem foto');
          tg2.style.cssText = 'font-size:11px;padding:2px 8px';
          b.appendChild(tg2);
        }
        cn.appendChild(b);
      });
    }
    (isVr ? [] : cores).forEach(function (c) {
      var q = sum(
          avail.filter(function (i) {
            return i.cor === c;
          })
        ),
        has = !!S.fotos[ref + '|' + c];
      var b = btn(
        'chip' +
          ((S.cdMode ? c === S.cdCor : c === cor) ? ' on' : '') +
          (S.cdMode && !S.cdCor ? ' delchip' : ''),
        '',
        function () {
          if (S.cdMode) {
            S.cdCor = c;
            render();
            return;
          }
          S.detCor = c;
          render();
        },
        c === cor
      );
      b.appendChild(dot(hexOf(c)));
      b.appendChild(document.createTextNode(c + ' · ' + q));
      if (!has) {
        var tg = mk('span', 'cell', 'sem foto');
        tg.style.cssText = 'font-size:11px;padding:2px 8px';
        b.appendChild(tg);
      }
      cn.appendChild(b);
    });
    cv.appendChild(cn);
    if (S.cdMode) {
      var cz = mk('div', 'note n-info');
      cz.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:10px';
      var endC = function () {
        S.cdMode = false;
        S.cdCor = '';
        render();
      };
      if (!S.cdCor || cores.indexOf(S.cdCor) < 0) {
        cz.appendChild(
          mk('span', '', 'Modo excluir: toque na cor que você quer apagar deste produto.')
        );
        cz.appendChild(btn('mini', 'Cancelar', endC));
      } else {
        var xc = S.cdCor,
          xl = all.filter(function (i) {
            return i.cor === xc;
          }),
          xq = sum(xl),
          last =
            cores.length === 1 &&
            !all.some(function (i) {
              return i.cor !== xc;
            });
        cz.className = 'note n-bad';
        cz.appendChild(
          mk(
            'span',
            '',
            'Excluir a cor "' +
              xc +
              '" de ' +
              ref +
              '? Remove ' +
              xq +
              ' peça(s) em estoque e a foto dessa cor.' +
              (last ? ' Como é a única cor, o produto inteiro será excluído.' : '') +
              ' As vendas já feitas continuam no histórico.' +
              ''
          )
        );
        cz.appendChild(
          btn('mini', 'Sim, excluir', function () {
            S.items = S.items.filter(function (i) {
              return !(i.tipo === f.tipo && i.ref === ref && i.cor === xc);
            });
            delete S.fotos[ref + '|' + xc];
            if (
              !S.items.some(function (i) {
                return i.ref === ref;
              })
            )
              delete S.desc[ref];
            S.cdMode = false;
            S.cdCor = '';
            S.detCor = '';
            S.detVr = null;
            S.selItem = null;
            S.qty = 1;
            if (
              !S.items.some(function (i) {
                return i.ref === ref && i.tipo === f.tipo;
              })
            ) {
              S.open = '';
              S.det = false;
            }
            S.msg = 'Cor "' + xc + '" excluída de ' + ref + '.';
            render();
          })
        );
        cz.appendChild(
          btn('mini', 'Escolher outra', function () {
            S.cdCor = '';
            render();
          })
        );
        cz.appendChild(btn('mini', 'Cancelar', endC));
      }
      cv.appendChild(cz);
    }
    right.appendChild(cv);
    var pv = mk('div', '');
    pv.appendChild(
      mk(
        'div',
        'lbl',
        (f.tipo === 'pre' ? 'Graus' : isSimple(f.tipo) ? 'Itens' : 'Variantes') +
          (S.qEdit ? ' · editando o estoque' : ' · estoque')
      )
    );
    var pl = mk('div', 'col');
    pl.style.gap = '8px';
    all
      .slice()
      .sort(function (a, b) {
        return f.tipo === 'pre' ? parseFloat(a.grau) - parseFloat(b.grau) : a.vr < b.vr ? -1 : 1;
      })
      .forEach(function (i) {
        var r = mk('div', 'pl');
        r.appendChild(dot(hexOf(i.cor)));
        r.appendChild(
          mk(
            'span',
            '',
            (isSimple(f.tipo) ? '' : (f.tipo === 'pre' ? i.grau : i.vr) + ' · ') +
              i.cor +
              (effCusto(i) != null ? ' · custo ' + usd(effCusto(i)) : ' · sem custo')
          )
        );
        if (!i.qty) r.style.opacity = '.7';
        if (S.qDraft[S.items.indexOf(i)] != null || S.cDraft[S.items.indexOf(i)] != null)
          r.style.borderColor = 'var(--accent)';
        var qe = mk('span', 'qe');
        qe.style.cssText = 'display:flex;align-items:center;gap:6px;flex-wrap:wrap';
        var ix = S.items.indexOf(i),
          cur = S.qDraft[ix] != null ? S.qDraft[ix] : i.qty;
        var setQ = function (n) {
          n = Math.max(0, Math.min(99999, Math.floor(Number(n) || 0)));
          if (n === i.qty) delete S.qDraft[ix];
          else S.qDraft[ix] = n;
          render();
        };
        if (!S.qEdit || i.bulk) {
          qe.appendChild(mk('b', '', i.qty + ' un.'));
          var vb0 = btn('mini', 'Vender', function () {
            S.vTipo = 'all';
            S.vq = '';
            $('vq').value = '';
            S.vRef = i.tipo + '|' + i.ref;
            S.vSel = i;
            S.qty = 1;
            setView('vendas');
          });
          if (!i.qty) vb0.disabled = true;
          qe.appendChild(vb0);
          qe.style.justifyContent = 'space-between';
          qe.style.flexWrap = 'nowrap';
          r.appendChild(qe);
          pl.appendChild(r);
          return;
        }
        var mb = btn('step', '−', function () {
          setQ(cur - 1);
        });
        mb.setAttribute('aria-label', 'Diminuir estoque');
        mb.style.cssText = 'min-width:36px;min-height:36px;width:36px;height:36px;font-size:18px';
        var pb2 = btn('step', '+', function () {
          setQ(cur + 1);
        });
        pb2.setAttribute('aria-label', 'Aumentar estoque');
        pb2.style.cssText = mb.style.cssText;
        var qi = mk('input', 'in');
        qi.type = 'number';
        qi.min = '0';
        qi.inputMode = 'numeric';
        qi.value = cur;
        qi.setAttribute('aria-label', 'Quantidade em estoque');
        qi.style.cssText =
          'width:64px;min-height:36px;height:36px;padding:0 6px;text-align:center;font-weight:800';
        qi.onchange = function () {
          setQ(qi.value);
        };
        qi.onkeydown = function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            qi.blur();
          }
        };
        qe.appendChild(mb);
        qe.appendChild(qi);
        qe.appendChild(pb2);
        var ci = mk('input', 'in');
        ci.inputMode = 'decimal';
        ci.placeholder = 'custo US$';
        ci.setAttribute('aria-label', 'Custo por peça em US$');
        ci.value =
          S.cDraft[ix] != null
            ? S.cDraft[ix]
            : i.custo != null
              ? String(i.custo).replace('.', ',')
              : '';
        ci.style.cssText = 'width:96px;min-height:36px;height:36px;padding:0 8px;text-align:center';
        ci.onchange = function () {
          S.cDraft[ix] = ci.value;
          render();
        };
        qe.appendChild(ci);
        r.appendChild(qe);
        pl.appendChild(r);
      });
    pv.appendChild(pl);
    right.appendChild(pv);
    var dk = Object.keys(Object.assign({}, S.qDraft, S.cDraft));
    if (S.qEdit && dk.length) {
      var sv = mk('div', 'note n-info');
      sv.style.cssText =
        'display:flex;flex-wrap:wrap;gap:10px;align-items:center;position:sticky;bottom:8px';
      sv.appendChild(
        mk(
          'span',
          '',
          dk.length + (dk.length === 1 ? ' alteração não salva.' : ' alterações não salvas.')
        )
      );
      sv.appendChild(
        btn('go', 'Salvar', function () {
          var msgs = [];
          dk.forEach(function (k) {
            var it = S.items[k];
            if (!it) return;
            var n = S.qDraft[k] != null ? S.qDraft[k] : it.qty,
              d = n - it.qty;
            if (it.lote && d > 0) {
              var gg = S.grp.filter(function (x) {
                  return x.id === it.lote;
                })[0],
                fal = gg ? grpFalta(gg) : 0;
              if (gg && d > fal) {
                n = it.qty + fal;
                d = fal;
                msgs.push(
                  'O lote ' +
                    gLabel(gg) +
                    ' só tem ' +
                    fal +
                    ' peça(s) para detalhar: limitei ' +
                    it.cor +
                    '.'
                );
              }
            }
            it.qty = n;
            if (S.cDraft[k] != null) {
              var cr = String(S.cDraft[k]).trim().replace(',', '.');
              if (cr === '') delete it.custo;
              else {
                var cv = parseFloat(cr),
                  lg =
                    it.lote &&
                    S.grp.filter(function (x) {
                      return x.id === it.lote;
                    })[0],
                  ce3 = cv >= 0 && lg && !it.bulk ? gCostErr(lg, cv * it.qty, it) : '';
                if (ce3) msgs.push(it.cor + ': custo não alterado. ' + ce3);
                else if (cv >= 0) it.custo = cv;
                else msgs.push('Custo inválido em ' + it.cor + ': ignorei.');
              }
            }
          });
          S.qDraft = {};
          S.cDraft = {};
          S.qEdit = false;
          S.msg = 'Estoque salvo.' + (msgs.length ? ' ' + msgs.join(' ') : '');
          render();
        })
      );
      sv.lastChild.style.cssText =
        'width:auto;margin:0;padding:0 18px;min-height:38px;height:38px;font-size:14px';
      sv.appendChild(
        btn('mini', 'Descartar', function () {
          S.qDraft = {};
          S.cDraft = {};
          render();
        })
      );
      right.appendChild(sv);
    }
    g.appendChild(left);
    g.appendChild(right);
    det.appendChild(g);
  }

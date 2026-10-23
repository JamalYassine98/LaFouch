  // ===== Estoque: tela de detalhe de um código. =====
  // Chave estável de uma variante (linha) do produto.
  function rowKey(i) {
    return [
      i.cor,
      i.grau || '',
      i.vr || '',
      i.lote || '',
      i.fmt || '',
      i.med || '',
      i.bulk ? 1 : 0
    ].join('|');
  }
  // Rótulo curto da variante: grau ou classe de cor + cor.
  function rowLabel(i) {
    return (isSimple(i.tipo) ? '' : (i.tipo === 'pre' ? i.grau : i.vr) + ' · ') + i.cor;
  }
  // Detalhe de um código: fotos, cores, estoque, venda e janela de edição.
  // opt.venda = true: mesma tela, no modo venda (aba Vendas): sem edição nem custo; devolve a variante escolhida.
  function renderDetail(ref, opt) {
    opt = opt || {};
    var venda = !!opt.venda,
      det = opt.host || $('detail'),
      tipoId = venda ? opt.tipo : S.tipo,
      wasHid = det.hidden,
      prevRef = det._ref;
    det.textContent = '';
    if (venda) {
      if (!ref) {
        det.hidden = true;
        det._ref = '';
        return null;
      }
    } else if (S.lotesView) {
      det.hidden = true;
      det._ref = '';
      return;
    } else if (!S.det || !ref) {
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
        return i.ref === ref && i.tipo === tipoId;
      }),
      f = all[0];
    if (!f) {
      det.hidden = true;
      return null;
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
      cores = [];
      for (var vk = 1; vk <= vrM; vk++) {
        var rc0 = repCor('C' + vk);
        if (rc0 && cores.indexOf(rc0) < 0) cores.push(rc0);
      }
      var rcn = repCor('none');
      if (rcn && cores.indexOf(rcn) < 0) cores.push(rcn);
    }
    var rows = all.slice().sort(function (a, b) {
      return f.tipo === 'pre' ? parseFloat(a.grau) - parseFloat(b.grau) : a.vr < b.vr ? -1 : 1;
    });
    // variante selecionada: a escolhida antes, senão a da cor atual, senão a primeira com foto/estoque
    var sel = rows.filter(function (i) {
      return rowKey(i) === S.detRow;
    })[0];
    if (sel && S.detCor && sel.cor !== S.detCor) sel = null;
    if (venda && rows.indexOf(S.vSel) >= 0) sel = S.vSel;
    if (venda && sel && !(sel.qty > 0)) sel = null;
    if (!sel) {
      var pool = rows.filter(function (i) {
        return i.qty > 0;
      });
      sel =
        pool.filter(function (i) {
          return i.cor === S.detCor;
        })[0] ||
        pool.filter(function (i) {
          return !!S.fotos[ref + '|' + i.cor];
        })[0] ||
        pool[0] ||
        rows[0];
    }
    S.detRow = rowKey(sel);
    S.detCor = sel.cor;
    S.detVr = isVr ? vkey(sel) : null;
    var gal = cores.filter(function (c) {
        return !!S.fotos[ref + '|' + c];
      }),
      cor = sel.cor,
      src = photoOf(ref, cor);
    // escolhe a foto da cor atual (galeria ou câmera)
    function pickPhoto() {
      S.photoFor = { ref: ref, cor: cor };
      $('fileG').multiple = false;
      $('fileG').value = '';
      $('fileG').click();
    }
    var head = mk('div', '');
    head.style.cssText =
      'display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center';
    var hl = mk('div', '');
    hl.style.cssText = 'display:flex;align-items:center;gap:10px';
    var bk0 = btn('tab ibtn', '', function () {
      if (venda) {
        S.vRef = '';
        S.vSel = null;
        S.qty = 1;
        S.msg = '';
        render();
        window.scrollTo(0, 0);
        return;
      }
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
    var h20 = mk('h2', '', venda ? 'Vender' : 'Catálogo do produto');
    h20.style.cssText = 'margin:0;font-size:16px';
    hl.appendChild(h20);
    head.appendChild(hl);
    if (!venda && S.qEdRef !== ref) {
      S.qEdRef = ref;
      S.qEdit = false;
      S.qDraft = {};
      S.cDraft = {};
      S.dDraft = null;
      S.fDraft = null;
      S.fDel = false;
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
        S.dDraft = null;
        S.fDraft = null;
        S.fDel = false;
        S.cdMode = false;
        S.cdCor = '';
        render();
      },
      !!S.qEdit
    );
    eb.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
    eb.setAttribute('aria-label', S.qEdit ? 'Sair da edição' : 'Editar');
    eb.title = S.qEdit ? 'Sair da edição' : 'Editar';
    hb.appendChild(eb);
    if (!venda) head.appendChild(hb);
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
          S.detRow = null;
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
            S.detRow = null;
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
    if (!src && !venda) {
      left.appendChild(btn('mini', 'Adicionar foto', pickPhoto));
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
    var named = !!(S.pnome && S.pnome[ref]);
    h.appendChild(
      mk(
        'div',
        'crumb',
        (named ? ref + ' · ' : '') +
          (tipoOf(f.tipo) || T()).full +
          (isSimple(f.tipo)
            ? f.fmt && !f.bulk
              ? ' · formato ' + f.fmt
              : ''
            : ' · formato ' + f.fmt + (f.med ? ' · ' + f.med : ''))
      )
    );
    right.appendChild(h);
    var dtxt = S.desc[ref] != null ? String(S.desc[ref]).trim() : '';
    if (dtxt) {
      var dp = mk('div', '', dtxt);
      dp.style.cssText = 'font-size:14px;color:var(--sub);white-space:pre-wrap';
      right.appendChild(dp);
    }
    if (!venda && S.cdRef !== ref) {
      S.cdRef = ref;
      S.cdMode = false;
      S.cdCor = '';
      S.qDraft = {};
      S.cDraft = {};
    }
    var pv = mk('div', '');
    pv.appendChild(
      mk(
        'div',
        'lbl',
        (f.tipo === 'pre' ? 'Graus' : isSimple(f.tipo) ? 'Itens' : 'Cores') + ' · estoque'
      )
    );
    var pl = mk('div', 'col');
    pl.style.gap = '8px';
    // seleciona uma variante: define a foto mostrada e o que o botão Vender vende
    var choose = function (i) {
      if (venda) {
        if (!(i.qty > 0)) return;
        S.vSel = i;
        S.qty = 1;
        S.msg = '';
      }
      S.detRow = rowKey(i);
      S.detCor = i.cor;
      S.detVr = isVr ? vkey(i) : null;
      S.fDel = false;
      S.cdMode = false;
      S.cdCor = '';
      render();
    };
    rows.forEach(function (i) {
      var r = mk('div', 'pl pick' + (i === sel ? ' picked' : ''));
      r.tabIndex = 0;
      r.setAttribute('role', 'button');
      r.setAttribute('aria-pressed', i === sel);
      r.onclick = function () {
        choose(i);
      };
      r.onkeydown = function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          choose(i);
        }
      };
      r.appendChild(dot(hexOf(i.cor)));
      var tx = mk(
        'span',
        '',
        rowLabel(i) + (venda ? '' : effCusto(i) != null ? ' · custo ' + usd(effCusto(i)) : ' · sem custo')
      );
      if (!S.fotos[ref + '|' + i.cor] && !venda) {
        var tg = mk('span', 'cell', 'sem foto');
        tg.style.cssText = 'font-size:11px;padding:2px 8px;margin-left:8px';
        tx.appendChild(tg);
      }
      r.appendChild(tx);
      r.appendChild(mk('b', '', i.qty + ' un.'));
      if (!i.qty) r.style.opacity = venda ? '.45' : '.7';
      pl.appendChild(r);
    });
    pv.appendChild(pl);
    if (rows.length > 1) {
      var ht2 = mk(
        'div',
        'hint',
        f.tipo === 'pre'
          ? 'Toque num grau para escolher o que vender.'
          : 'Toque numa cor para ver a foto dela e vender.'
      );
      ht2.style.margin = '8px 0 0';
      pv.appendChild(ht2);
    }
    right.appendChild(pv);
    // um único botão Vender, para a variante selecionada
    var vbar = mk('div', 'vbar');
    var vbtn = btn('go', 'Vender ' + rowLabel(sel), function () {
      S.vTipo = 'all';
      S.vq = '';
      $('vq').value = '';
      S.vRef = sel.tipo + '|' + sel.ref;
      S.vSel = sel;
      S.qty = 1;
      setView('vendas');
    });
    if (!sel.qty) vbtn.disabled = true;
    vbar.appendChild(vbtn);
    if (!venda) right.appendChild(vbar);
    g.appendChild(left);
    g.appendChild(right);
    det.appendChild(g);
    if (venda) return sel.qty > 0 ? sel : null;
    if (S.qEdit) det.appendChild(editModal());

    // Janela Editar produto: nome, código, descrição, foto, estoque/custo e exclusão de cor.
    function editModal() {
      var smp = isSimple(f.tipo),
        orig0 = (S.pnome && S.pnome[ref]) || '',
        ov = mk('div', 'modal'),
        bx = mk('div', 'modal-box');
      ov.id = 'editModal';
      ov.setAttribute('role', 'dialog');
      ov.setAttribute('aria-modal', 'true');
      ov.setAttribute('aria-label', 'Editar produto');
      bx.style.maxWidth = '520px';
      var zerar = function () {
        S.qEdit = false;
        S.qDraft = {};
        S.cDraft = {};
        S.rnV = null;
        S.rnN = null;
        S.rnRef = '';
        S.dDraft = null;
        S.fDraft = null;
        S.fDel = false;
        S.cdMode = false;
        S.cdCor = '';
      };
      var fechar = function () {
        zerar();
        render();
      };
      ov.onclick = function (e) {
        if (e.target === ov) fechar();
      };
      var fld = function (label, el) {
        var d = mk('div', '');
        d.appendChild(mk('div', 'lbl', label));
        d.appendChild(el);
        return d;
      };
      var hd = mk('div', '');
      hd.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:8px';
      var ht = mk('h2', '', 'Editar produto');
      ht.style.cssText = 'margin:0;font-size:18px';
      hd.appendChild(ht);
      var xb = btn('tab ibtn', '✕', fechar);
      xb.setAttribute('aria-label', 'Fechar');
      hd.appendChild(xb);
      bx.appendChild(hd);
      // nome e código
      var nmi = null,
        ni = null;
      if (!f.bulk) {
        if (!smp) {
          nmi = mk('input', 'in');
          nmi.id = 'edNome';
          nmi.value = S.rnN != null && S.rnRef === ref ? S.rnN : orig0;
          nmi.placeholder = 'Ex.: Gatinho preto fosco';
          nmi.maxLength = 60;
          nmi.setAttribute('aria-label', 'Nome do produto');
          bx.appendChild(fld('Nome do produto', nmi));
        }
        ni = mk('input', 'in');
        ni.id = 'edCodigo';
        ni.value = S.rnV != null && S.rnRef === ref ? S.rnV : ref;
        ni.setAttribute('aria-label', smp ? 'Nome do produto' : 'Código');
        bx.appendChild(fld(smp ? 'Nome do produto' : 'Código (o que fica na haste)', ni));
        var guardar = function () {
          S.rnRef = ref;
          S.rnV = ni.value;
          if (nmi) S.rnN = nmi.value;
        };
        ni.oninput = guardar;
        if (nmi) nmi.oninput = guardar;
      }
      // descrição (só vale ao salvar)
      var ta = mk('textarea', 'in');
      ta.id = 'descTa';
      ta.rows = 3;
      ta.placeholder = 'Ex.: polarizado, mola flexível…';
      ta.setAttribute('aria-label', 'Descrição do produto');
      ta.value = S.dDraft != null ? S.dDraft : S.desc[ref] != null ? S.desc[ref] : '';
      ta.oninput = function () {
        S.dDraft = ta.value;
      };
      var df = fld('Descrição (opcional)', ta);
      var sg = btn('mini', 'Usar descrição sugerida', function () {
        S.dDraft = autoDesc(ref);
        render();
      });
      sg.style.cssText =
        'margin-top:8px;min-height:36px;background:var(--panel2);color:var(--sub);border:1px solid var(--line)';
      df.appendChild(sg);
      bx.appendChild(df);
      // faixa do produto (só vale ao salvar)
      if (!smp && !f.bulk && S.faixas.length) {
        var fcur = S.fDraft != null ? S.fDraft : (faixaOf(ref) || {}).id || '',
          fb = mk('div', 'nav');
        fb.id = 'edFaixas';
        [{ id: '', nome: 'Sem faixa' }].concat(S.faixas).forEach(function (x) {
          fb.appendChild(
            btn(
              'chip' + (fcur === x.id ? ' on' : ''),
              x.nome,
              function () {
                S.fDraft = x.id;
                render();
              },
              fcur === x.id
            )
          );
        });
        bx.appendChild(fld('Faixa', fb));
      }
      // foto da cor selecionada
      var ps = mk('div', '');
      ps.appendChild(mk('div', 'lbl', 'Foto · ' + cor));
      var pr = mk('div', '');
      pr.style.cssText = 'display:flex;gap:12px;align-items:center';
      var th0 = mk('div', '');
      th0.style.cssText =
        'width:96px;height:72px;flex:none;background:#fff;border-radius:10px;padding:2px;display:flex;align-items:center;justify-content:center;color:#64748b;font-size:11px;overflow:hidden';
      if (src) {
        var im0 = mk('img');
        im0.src = src;
        im0.alt = cor;
        im0.style.cssText = 'width:100%;height:100%;object-fit:contain';
        th0.appendChild(im0);
      } else th0.textContent = 'sem foto';
      pr.appendChild(th0);
      var pc = mk('div', 'col');
      pc.style.cssText = 'gap:8px;flex:1';
      pc.appendChild(btn('mini', src ? 'Trocar foto' : 'Adicionar foto', pickPhoto));
      if (src) {
        var xf = btn('mini', 'Excluir foto', function () {
          S.fDel = true;
          render();
        });
        xf.style.cssText =
          'background:transparent;color:var(--bad);border:1px solid rgba(239,68,68,.7)';
        pc.appendChild(xf);
      }
      pr.appendChild(pc);
      ps.appendChild(pr);
      if (S.fDel && src) {
        var fz = mk('div', 'note n-bad');
        fz.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:10px';
        fz.appendChild(
          mk(
            'span',
            '',
            'Excluir a foto da cor "' + cor + '"? Não dá para desfazer. O estoque não muda.'
          )
        );
        fz.appendChild(
          btn('mini', 'Sim, excluir', function () {
            delete S.fotos[ref + '|' + cor];
            S.fDel = false;
            S.msg = 'Foto da cor "' + cor + '" excluída.';
            render();
          })
        );
        fz.appendChild(
          btn('mini', 'Cancelar', function () {
            S.fDel = false;
            render();
          })
        );
        ps.appendChild(fz);
      }
      var ph = mk('div', 'hint', 'A foto vale para a cor toda. Para outra cor, toque nela abaixo.');
      ph.style.margin = '6px 0 0';
      ps.appendChild(ph);
      bx.appendChild(ps);
      // estoque e custo por variante
      var ev = mk('div', '');
      ev.appendChild(mk('div', 'lbl', 'Cores · quantidade e custo (US$)'));
      var el = mk('div', 'col');
      el.style.gap = '8px';
      rows.forEach(function (i) {
        if (i.bulk) return;
        var ix = S.items.indexOf(i),
          cur = S.qDraft[ix] != null ? S.qDraft[ix] : i.qty,
          r = mk('div', 'pl pick' + (i === sel ? ' picked' : ''));
        r.appendChild(dot(hexOf(i.cor)));
        var lb = mk('span', '', rowLabel(i));
        lb.style.cursor = 'pointer';
        lb.onclick = function () {
          choose(i);
        };
        r.appendChild(lb);
        if (S.qDraft[ix] != null || S.cDraft[ix] != null) r.style.borderColor = 'var(--accent)';
        var qe = mk('span', 'qe');
        qe.style.cssText = 'display:flex;align-items:center;gap:6px;flex-wrap:wrap;grid-column:1/-1';
        var setQ = function (n) {
          n = Math.max(0, Math.min(99999, Math.floor(Number(n) || 0)));
          if (n === i.qty) delete S.qDraft[ix];
          else S.qDraft[ix] = n;
          render();
        };
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
        el.appendChild(r);
      });
      ev.appendChild(el);
      bx.appendChild(ev);
      // excluir a cor selecionada (produtos sem classes C1–C6)
      if (!isVr && cores.length) {
        var dz = mk('div', '');
        if (!S.cdMode) {
          var db = btn('mini', 'Excluir a cor "' + cor + '"', function () {
            S.cdMode = true;
            S.cdCor = cor;
            render();
          });
          db.style.cssText =
            'background:transparent;color:var(--bad);border:1px solid rgba(239,68,68,.7)';
          dz.appendChild(db);
        } else {
          var xq = sum(
              all.filter(function (i) {
                return i.cor === cor;
              })
            ),
            last = cores.length === 1;
          var cz = mk('div', 'note n-bad');
          cz.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;align-items:center';
          cz.appendChild(
            mk(
              'span',
              '',
              'Excluir a cor "' +
                cor +
                '" de ' +
                ref +
                '? Remove ' +
                xq +
                ' peça(s) em estoque e a foto dessa cor.' +
                (last ? ' Como é a única cor, o produto inteiro será excluído.' : '') +
                ' As vendas já feitas continuam no histórico.'
            )
          );
          cz.appendChild(
            btn('mini', 'Sim, excluir', function () {
              S.items = S.items.filter(function (i) {
                return !(i.tipo === f.tipo && i.ref === ref && i.cor === cor);
              });
              delete S.fotos[ref + '|' + cor];
              if (
                !S.items.some(function (i) {
                  return i.ref === ref;
                })
              )
                delete S.desc[ref];
              zerar();
              S.detCor = '';
              S.detVr = null;
              S.detRow = null;
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
              S.msg = 'Cor "' + cor + '" excluída de ' + ref + '.';
              render();
            })
          );
          cz.appendChild(
            btn('mini', 'Cancelar', function () {
              S.cdMode = false;
              S.cdCor = '';
              render();
            })
          );
          dz.appendChild(cz);
        }
        bx.appendChild(dz);
      }
      // Cancelar / Salvar
      var ft = mk('div', '');
      ft.style.cssText = 'display:flex;gap:10px';
      var cb = btn('tab', 'Cancelar', fechar);
      cb.style.flex = '1';
      var sb2 = btn('tab on', 'Salvar', function () {
        var nn = ni ? normRef(ni.value, smp) : ref,
          nv0 = nmi ? nmi.value.trim() : '';
        if (!nn) return popErr(smp ? 'Digite o nome do produto.' : 'Digite o código da haste.');
        if (
          nn !== ref &&
          S.items.some(function (i) {
            return i.ref.toUpperCase() === nn.toUpperCase() && i.ref !== ref;
          })
        )
          return popErr('Já existe um produto chamado "' + nn + '". Escolha outro nome.');
        var dk = Object.keys(Object.assign({}, S.qDraft, S.cDraft)),
          partes = [],
          msgs = [];
        if (dk.length) {
          msgs = salvarEstoque(dk);
          partes.push('Estoque salvo.' + (msgs.length ? ' ' + msgs.join(' ') : ''));
        }
        if (S.dDraft != null) {
          if (S.dDraft !== (S.desc[ref] != null ? S.desc[ref] : '')) {
            S.desc[ref] = S.dDraft;
            partes.push('Descrição salva.');
          }
        }
        var rm = ni ? renomear(nn, nv0, !!nmi) : '';
        if (rm) partes.push(rm);
        if (S.fDraft != null) {
          if (S.fDraft) S.pfaixa[nn] = S.fDraft;
          else delete S.pfaixa[nn];
          partes.push('Faixa salva.');
        }
        zerar();
        S.msg = partes.join(' ') || 'Nada foi alterado.';
        render();
      });
      sb2.style.flex = '2';
      ft.appendChild(cb);
      ft.appendChild(sb2);
      bx.appendChild(ft);
      ov.appendChild(bx);
      return ov;
    }
    // Aplica no estoque as quantidades e custos digitados; devolve avisos.
    function salvarEstoque(dk) {
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
      return msgs;
    }
    // Troca o nome/código do produto (com fotos e descrição); devolve a mensagem, ou '' se nada mudou.
    function renomear(nn, nv0, temNome) {
      var smp = isSimple(f.tipo),
        orig0 = (S.pnome && S.pnome[ref]) || '';
      if (nn === ref) {
        if (temNome && nv0 !== orig0) {
          if (nv0) setPN(ref, nv0);
          else if (S.pnome) delete S.pnome[ref];
          return 'Nome salvo.';
        }
        return '';
      }
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
      if (S.pfaixa && S.pfaixa[ref]) {
        S.pfaixa[nn] = S.pfaixa[ref];
        delete S.pfaixa[ref];
      }
      if (S.desc[ref] != null) {
        S.desc[nn] = S.desc[ref];
        delete S.desc[ref];
      }
      if (S.pnome && S.pnome[ref]) {
        S.pnome[nn] = S.pnome[ref];
        delete S.pnome[ref];
      }
      if (temNome) {
        if (nv0) setPN(nn, nv0);
        else if (S.pnome) delete S.pnome[nn];
      }
      if (S.open === ref) S.open = nn;
      S.qEdRef = nn;
      S.cdRef = nn;
      S.rnV = null;
      S.rnN = null;
      S.rnRef = '';
      return (smp ? 'Nome' : 'Código') + ' alterado de "' + ref + '" para "' + nn + '".';
    }
  }

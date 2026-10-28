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
  // Mesma variante vinda de lotes diferentes: na venda aparece como uma só (o preço é igual).
  function sKey(i) {
    return [i.tipo, i.ref, i.cor, i.grau || '', i.vr || '', i.fmt || '', i.med || '', i.bulk ? 1 : 0].join('|');
  }
  function sibs(i) {
    var k = sKey(i);
    return S.items.filter(function (x) {
      return x.qty > 0 && sKey(x) === k;
    });
  }
  // Estoque somado das peças iguais (de todos os lotes).
  function gQty(i) {
    var l = sibs(i);
    return l.length
      ? l.reduce(function (n, x) {
          return n + x.qty;
        }, 0)
      : i.qty;
  }
  // A peça com mais estoque do grupo: é a que a venda usa primeiro.
  function gPrim(i) {
    var l = sibs(i).sort(function (a, b) {
      return b.qty - a.qty;
    });
    return l[0] || i;
  }
  // Rótulo curto da variante: grau ou classe de cor + cor.
  function rowLabel(i) {
    return (isSimple(i.tipo) ? '' : (i.tipo === 'pre' ? i.grau : i.vr) + (i.cor === 'Sem cor' ? '' : ' · ')) + (isSimple(i.tipo) || i.cor !== 'Sem cor' ? i.cor : '');
  }
  // Foto ampliada em tela cheia; tocar fecha.
  function zoomFoto(src) {
    var ov = mk('div', 'modal'),
      im = mk('img');
    ov.style.alignItems = 'center';
    ov.style.cursor = 'zoom-out';
    im.src = src;
    im.alt = 'Foto ampliada';
    im.style.cssText = 'max-width:100%;max-height:92vh;background:#fff;border-radius:12px;object-fit:contain';
    ov.appendChild(im);
    ov.onclick = function () {
      ov.remove();
    };
    document.body.appendChild(ov);
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
    if (venda) {
      var vistos = {};
      rows = rows.filter(function (i) {
        var k = sKey(i);
        if (vistos[k]) return false;
        vistos[k] = 1;
        return true;
      });
      rows = rows.map(function (i) {
        return gPrim(i);
      });
    }
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
      camOpen(
        function (f) {
          window.__GAL = false;
          $('file').onchange({ target: { files: [f] } });
        },
        'Foto da cor ' + cor,
        { gallery: true, tip: 'Ponha UMA peça inteira dentro do retângulo. Toque na tela para focar.' }
      );
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
    else {
      var bd = btn('tab ibtn dinBtn', '$', function () {
        splitAbre();
      });
      bd.id = 'btnDin';
      bd.setAttribute('aria-label', 'Para onde foi o dinheiro da venda');
      bd.title = 'Para onde foi o dinheiro da venda';
      head.appendChild(bd);
    }
    det.appendChild(head);
    var g = mk('div', 'detgrid'),
      left = mk('div', 'col'),
      right = mk('div', 'col');
    left.appendChild(photoBox(src, 'pbox'));
    // troca a cor mostrada; na venda escolhe também uma variante vendável dessa cor
    var pickCor = function (c) {
      S.detCor = c;
      S.detVr = null;
      S.detRow = null;
      if (venda) {
        var rr =
          rows.filter(function (i) {
            return i.cor === c && i.qty > 0 && sel && i.grau === sel.grau;
          })[0] ||
          rows.filter(function (i) {
            return i.cor === c && i.qty > 0;
          })[0];
        S.vSel = rr || null;
        S.qty = 1;
        S.msg = '';
      }
      render();
    };
    // gesto de arrastar na ficha (src/89-gestos-ficha.js): cores da foto atual
    S._gestoCor = venda ? null : { gal: gal.slice(), atual: cor, pick: pickCor };
    // armação/solar no estoque: mesma tela do catálogo de Vendas (pontinhos e cores em cartões)
    var cartoes = !venda && f.tipo !== 'pre' && !isSimple(f.tipo) && rows.length > 1;
    if (venda || gal.length > 1) {
      // foto grande com pontinhos: deslizar troca a cor, tocar amplia
      var pbv = photoBox(src, 'pbox');
      pbv.style.position = 'relative';
      if (gal.length > 1) {
        var dts = mk('div', '');
        dts.style.cssText =
          'position:absolute;bottom:8px;left:0;right:0;display:flex;gap:6px;justify-content:center';
        gal.forEach(function (c) {
          var d1 = mk('i', '');
          d1.style.cssText =
            'display:block;height:7px;border-radius:9px;background:' +
            (c === cor ? '#a0457a' : '#c8ccd4') +
            ';width:' +
            (c === cor ? '22px' : '7px');
          dts.appendChild(d1);
        });
        pbv.appendChild(dts);
        // setinhas sutis nas laterais (o dedo deslizando também troca)
        [-1, 1].forEach(function (d0) {
          var sb = mk('button', 'fseta', d0 < 0 ? '‹' : '›');
          sb.type = 'button';
          sb.setAttribute('aria-label', d0 < 0 ? 'Foto anterior' : 'Próxima foto');
          sb.style.cssText = (d0 < 0 ? 'left' : 'right') + ':2px';
          sb.onclick = function (e) {
            e.stopPropagation();
            pickCor(gal[(Math.max(gal.indexOf(cor), 0) + d0 + gal.length) % gal.length]);
          };
          pbv.appendChild(sb);
        });
        var tx0 = null;
        pbv.addEventListener(
          'touchstart',
          function (e) {
            tx0 = e.touches[0].clientX;
          },
          { passive: true }
        );
        pbv.addEventListener('touchend', function (e) {
          if (!venda) return; // no estoque quem trata o arrastar é o src/89-gestos-ficha.js
          if (tx0 == null) return;
          var dx = e.changedTouches[0].clientX - tx0;
          tx0 = null;
          if (Math.abs(dx) < 40) return;
          var g0 = gal.indexOf(cor);
          pickCor(gal[(Math.max(g0, 0) + (dx < 0 ? 1 : -1) + gal.length) % gal.length]);
        });
      }
      if (src) {
        pbv.style.cursor = 'zoom-in';
        pbv.onclick = function () {
          zoomFoto(src);
        };
      }
      left.removeChild(left.lastChild);
      left.appendChild(pbv);
    }
    if (!src && !venda) {
      var nh = mk(
        'div',
        'hint',
        gal.length
          ? 'Esta cor ainda não tem foto. Toque numa cor abaixo para ver as outras.'
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
        (!venda && numOf(ref) ? 'Nº ' + numOf(ref) + ' · ' : '') +
          (!venda && named ? ref + ' · ' : '') +
          (tipoOf(f.tipo) || T()).full +
          (isSimple(f.tipo)
            ? f.fmt && !f.bulk
              ? ' · formato ' + f.fmt
              : ''
            : ' · formato ' + f.fmt + (f.med ? ' · ' + f.med : ''))
      )
    );
    right.appendChild(h);
    if (venda) {
      var prv = tFor(sel).price;
      var hp = mk('div', '', prv ? gs(prv) : 'Preço livre');
      hp.style.cssText = 'font-size:26px;font-weight:800;color:var(--ok)';
      right.appendChild(hp);
    }
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
        (venda ? (f.tipo === 'pre' ? 'Grau' : 'Cor') : (f.tipo === 'pre' ? 'Graus' : isSimple(f.tipo) ? 'Itens' : 'Cores') + ' · estoque') + (f.tipo === 'pre' && rows.length > 1 && rows.every(function (x) { return x.cor === rows[0].cor; }) && rows[0].cor !== 'Sem cor' ? ' · ' + rows[0].cor : '')
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
    // pré-graduados da mesma cor: a cor aparece uma vez no título e as linhas mostram só o grau
    var corUnica =
      f.tipo === 'pre' &&
      rows.length > 1 &&
      rows.every(function (x) {
        return x.cor === rows[0].cor;
      });
    var nomeCor = function (c) {
      return c === 'Sem cor' ? 'Padrão' : c;
    };
    // cartões de cor: foto, nome e estoque (só na venda)
    var corCard = function (i, nm) {
      var on = i === sel,
        cb = btn('ccard' + (on ? ' on' : '') + (i.qty > 0 ? '' : ' off'), '', function () {
          choose(i);
        }, on);
      var fk = S.fotos[ref + '|' + i.cor];
      var im = mk('span', 'ci');
      if (fk) {
        var ig = mk('img');
        ig.src = fk;
        ig.alt = nomeCor(i.cor);
        im.appendChild(ig);
      } else im.style.background = hexOf(i.cor);
      cb.appendChild(im);
      cb.appendChild(mk('b', '', nm || nomeCor(i.cor)));
      cb.appendChild(mk('span', 'n', venda ? (gQty(i) > 0 ? gQty(i) + ' un.' : 'Esgotado') : i.qty + ' un.'));
      return cb;
    };
    var vPreMulti =
      venda &&
      f.tipo === 'pre' &&
      rows.some(function (x) {
        return x.cor !== rows[0].cor;
      });
    if ((venda && f.tipo !== 'pre') || cartoes) {
      // armação/solar: as cores são cartões com foto, nome e estoque
      if (rows.length > 1) {
        var cl = mk('div', 'ccards');
        rows.forEach(function (i) {
          var rep = !venda && rows.filter(function (x) { return x.cor === i.cor; }).length > 1;
          cl.appendChild(corCard(i, rep ? rowLabel(i) : undefined));
        });
        pl.appendChild(cl);
      }
    } else if (vPreMulti) {
      // pré-graduado em várias cores: primeiro o grau, depois a cor desse grau
      var graus = [];
      rows.forEach(function (i) {
        if (graus.indexOf(i.grau) < 0) graus.push(i.grau);
      });
      var gl0 = mk('div', 'ccards');
      graus.forEach(function (g0) {
        var rg = rows.filter(function (i) {
            return i.grau === g0;
          }),
          tq = rg.reduce(function (n, i) {
            return n + gQty(i);
          }, 0),
          gb = mk('div', 'pl pick' + (g0 === sel.grau ? ' picked' : ''));
        gb.tabIndex = 0;
        gb.setAttribute('role', 'button');
        gb.setAttribute('aria-pressed', g0 === sel.grau);
        gb.onclick = function () {
          var pick =
            rg.filter(function (i) {
              return i.qty > 0 && i.cor === sel.cor;
            })[0] ||
            rg.filter(function (i) {
              return i.qty > 0;
            })[0];
          if (pick) choose(pick);
        };
        gb.appendChild(mk('span', '', g0));
        gb.appendChild(mk('b', '', tq > 0 ? tq + ' un.' : 'Esgotado'));
        if (!tq) gb.style.opacity = '.45';
        gl0.appendChild(gb);
      });
      pl.appendChild(gl0);
      var cl2 = mk('div', 'ccards');
      rows
        .filter(function (i) {
          return i.grau === sel.grau;
        })
        .forEach(function (i) {
          cl2.appendChild(corCard(i));
        });
      var lbc = mk('div', 'lbl', 'Cor com ' + sel.grau);
      lbc.style.marginTop = '10px';
      pl.appendChild(lbc);
      pl.appendChild(cl2);
    } else
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
      var tx = mk(
        'span',
        '',
        venda ? (corUnica || f.tipo === 'pre' ? i.grau + (corUnica || i.cor === 'Sem cor' ? '' : ' · ' + i.cor) : nomeCor(i.cor)) : corUnica ? i.grau : rowLabel(i)
      );
      if (!S.fotos[ref + '|' + i.cor] && !venda) {
        var tg = mk('span', 'cell', 'sem foto');
        tg.style.cssText = 'font-size:11px;padding:2px 8px;margin-left:8px';
        tx.appendChild(tg);
      }
      r.appendChild(tx);
      var qv = venda ? gQty(i) : i.qty;
      r.appendChild(mk('b', '', qv > 0 || !venda ? qv + ' un.' : 'Esgotado'));
      if (!qv) r.style.opacity = venda ? '.45' : '.7';
      pl.appendChild(r);
    });
    pv.appendChild(pl);
    if (rows.length > 1 && !venda) {
      var ht2 = mk(
        'div',
        'hint',
        venda
          ? ''
          : f.tipo === 'pre'
            ? 'Toque num grau para escolher o que vender.'
            : 'Toque numa cor para ver a foto dela e vender.'
      );
      ht2.style.margin = '8px 0 0';
      pv.appendChild(ht2);
    }
    // Cores logo abaixo da descrição; depois Preço, Oferta e Liberar para o site
    right.appendChild(pv);
    if (!venda) right.appendChild(fichaExtra(ref, f.tipo));
    // (na ficha não há botão Vender: a venda é feita na aba Vendas)
    var vbar = mk('div', 'vbar');
    var vbtn = btn('go', 'Vender ' + rowLabel(sel), function () {
      S.vTipo = 'all';
      S.vGrau = '';
      S.vq = '';
      $('vq').value = '';
      S.vRef = sel.tipo + '|' + sel.ref;
      S.vSel = sel;
      S.qty = 1;
      setView('vendas');
    });
    if (!sel.qty) vbtn.disabled = true;
    vbar.appendChild(vbtn);
    g.appendChild(left);
    g.appendChild(right);
    det.appendChild(g);
    if (venda && sel.qty > 0) {
      // barra fixa: quantidade e botão Vender sempre à mão
      var vq = Math.max(1, Math.min(S.qty, gQty(sel))),
        ptv = tFor(sel).price,
        sb = mk('div', 'vbar vsale');
      var mn0 = btn('step', '−', function () {
        S.qty = Math.max(1, S.qty - 1);
        S.msg = '';
        render();
      });
      mn0.setAttribute('aria-label', 'Diminuir quantidade');
      var qn = mk('b', '', String(vq));
      qn.style.cssText = 'min-width:28px;text-align:center;font-size:20px';
      var pl0 = btn('step', '+', function () {
        S.qty = Math.min(gQty(sel), S.qty + 1);
        S.msg = '';
        render();
      });
      pl0.setAttribute('aria-label', 'Aumentar quantidade');
      var vb0 = btn('go', 'Vender' + (ptv ? ' · ' + gs(ptv * vq) : ''), function () {
        $('sCartAdd').click();
      });
      sb.appendChild(mn0);
      sb.appendChild(qn);
      sb.appendChild(pl0);
      sb.appendChild(vb0);
      det.appendChild(sb);
    }
    if (venda) return sel.qty > 0 ? sel : null;
    // a foto cresce e os cartões sobem quando a ficha de um produto novo abre
    if (S._fichaRef !== ref) {
      S._fichaRef = ref;
      if (!S._semAnimFicha && !(window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches)) {
        det.classList.add('fichaIn');
        clearTimeout(S._fichaT);
        S._fichaT = setTimeout(function () {
          det.classList.remove('fichaIn');
        }, 1100);
      }
      S._semAnimFicha = false;
    }
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
        S.ajAsk = false;
        S.ajMot = '';
        S.pdAsk = false;
        S.edStep = 1;
        S.edTipo = '';
      };
      var fechar = function () {
        zerar();
        render();
      };
      ov.onclick = function (e) {
        if (e.target === ov) fechar();
      };
      // Identificação com as mesmas listas do cadastro (Label Select)
      var edSel = function (key, rotulo, lista, valor, set) {
        var w = mk('div', ''),
          bt = mk('button', 'in nvf ' + (valor ? 'ok' : 'ph')),
          open = S.edPop === key;
        bt.type = 'button';
        bt.id = 'ed_' + key;
        w.appendChild(mk('div', 'lbl', rotulo));
        bt.appendChild(mk('span', '', valor || 'Escolher'));
        if (valor) bt.appendChild(mk('span', 'nvck', '✓'));
        bt.onclick = function () {
          S.edPop = open ? '' : key;
          render();
        };
        w.appendChild(bt);
        w._lista = null;
        if (open) {
          var p = mk('div', 'lsel'),
            cx = mk('div', 'lsBox'),
            q = document.createElement('input'),
            ul = mk('div', 'lsList');
          q.className = 'lsIn';
          q.placeholder = 'Buscar ' + rotulo.toLowerCase();
          q.autocomplete = 'off';
          cx.appendChild(mk('span', 'lsIc', '🔍'));
          cx.appendChild(q);
          var sa = mk('span', 'lsSeta', '▲');
          sa.onclick = function () {
            S.edPop = '';
            render();
          };
          cx.appendChild(sa);
          p.appendChild(cx);
          p.appendChild(ul);
          var pinta = function () {
            var t = q.value.trim().toLowerCase();
            ul.textContent = '';
            lista.forEach(function (v) {
              if (t && String(v).toLowerCase().indexOf(t) < 0) return;
              var c0 = mk('button', 'lsOpt' + (valor === v ? ' on' : ''), v);
              c0.type = 'button';
              c0.onclick = function () {
                set(valor === v ? '' : v);
                S.edPop = '';
                render();
              };
              ul.appendChild(c0);
            });
            if (!ul.firstChild) ul.appendChild(mk('div', 'lsVazio', 'Nada com esse nome'));
          };
          q.oninput = pinta;
          pinta();
          w._lista = p;
        }
        return w;
      };
      var edIdent = function (host, cur2, onCh) {
        host.textContent = '';
        var ch2 = function () {
          if (onCh) onCh();
        };
        var card = mk('div', 'card col');
        card.style.gap = '12px';
        host.appendChild(card);
        var fmL = FORMATOS.slice();
        if (cur2.formato && fmL.indexOf(cur2.formato) < 0) fmL.push(cur2.formato);
        var s1 = edSel('formato', 'Formato', fmL, cur2.formato || '', function (v) {
            cur2.formato = v;
            ch2();
          }),
          s2 = edSel('material', 'Material', MATERIAIS, cur2.material || '', function (v) {
            cur2.material = v;
            ch2();
          }),
          s3 = edSel('publico', 'Gênero', PUBLICOS, cur2.publico || '', function (v) {
            cur2.publico = v;
            ch2();
          });
        var r1 = mk('div', 'nvg2');
        r1.appendChild(s1);
        r1.appendChild(s2);
        card.appendChild(r1);
        [s1, s2].forEach(function (x) {
          if (x._lista) card.appendChild(x._lista);
        });
        card.appendChild(s3);
        if (s3._lista) card.appendChild(s3._lista);
        var pv2 = mk('div', 'hint', '');
        pv2.style.margin = '0';
        if (cur2.marca || cur2.material || cur2.publico) {
          var a0 = S.attr;
          S.attr = { __p: cur2 };
          pv2.textContent = 'Nome automático: ' + nomeAuto('__p');
          S.attr = a0;
        }
        card.appendChild(pv2);
      };
      var fld = function (label, el) {
        var d = mk('div', '');
        d.appendChild(mk('div', 'lbl', label));
        d.appendChild(el);
        return d;
      };
      // Editar produto em 4 etapas: 1 Modelo · 2 Cores e fotos · 3 Site · 4 Baixa (nada saiu, só foi separado)
      var cur = S.edStep === 2 ? 2 : 1,
        gA = mk('div', 'col'),
        gB = mk('div', 'col'),
        g = [null, gA, gB, gA, gB];
      gA.style.gap = gB.style.gap = '14px';
      var hd = mk('div', '');
      hd.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:8px';
      hd.style.alignItems = 'flex-start';
      var hl = mk('div', '');
      hl.style.cssText = 'display:flex;flex-direction:column;gap:10px;align-items:flex-start';
      var ht = mk('h2', '', 'Editar produto');
      ht.style.cssText = 'margin:0;font-size:18px';
      hl.appendChild(ht);
      hd.appendChild(hl);
      var xb = btn('tab', 'Fechar', fechar);
      xb.setAttribute('aria-label', 'Fechar');
      var hbtn = mk('div', '');
      hbtn.style.cssText = 'display:flex;gap:8px;align-items:center';
      if (!f.bulk) {
        var lx = btn('tab ibtn' + (S.pdAsk ? ' on' : ''), '', function () {
          S.pdAsk = !S.pdAsk;
          render();
        });
        lx.id = 'edLixeira';
        lx.innerHTML =
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6.5 7l1 13h9l1-13"/><path d="M10 11v6M14 11v6"/></svg>';
        lx.style.color = 'var(--bad)';
        lx.setAttribute('aria-label', 'Excluir o produto');
        lx.title = 'Excluir o produto';
        hbtn.appendChild(lx);
      }
      hbtn.appendChild(xb);
      hd.appendChild(hbtn);
      bx.appendChild(hd);
      var sub0 = mk('div', 'hint', ref + (orig0 ? ' · ' + orig0 : ''));
      sub0.style.margin = '-8px 0 0';
      bx.appendChild(sub0);
      // etapas livres: toque em qualquer uma, em qualquer ordem
      var etp = mk('div', 'edTabs');
      etp.id = 'edTabs';
      [
        [1, '1 · Modelo'],
        [2, '2 · Cores e fotos']
      ].forEach(function (t) {
        var tb = btn('chip' + (cur === t[0] ? ' on' : ''), t[1], function () {
          if (S.edStep !== t[0]) S._edDir = t[0] > (S.edStep === 2 ? 2 : 1) ? 1 : -1;
          S.edStep = t[0];
          render();
        }, cur === t[0]);
        tb.id = 'edTab' + t[0];
        etp.appendChild(tb);
      });
      bx.appendChild(etp);
      if (S.pdAsk && !f.bulk) {
        var todos = S.items.filter(function (i) {
            return i.ref === ref && !i.bulk;
          }),
          pq = sum(todos),
          pc2 = todos.reduce(function (a, i) {
            return a + (Number(effCusto(i)) || 0) * i.qty;
          }, 0),
          pz = mk('div', 'note n-bad');
        pz.id = 'edLixoAviso';
        pz.style.cssText = 'display:flex;flex-direction:column;gap:10px';
        pz.appendChild(
          mk(
            'span',
            '',
            'Excluir o produto ' + ref + ' inteiro? Remove ' + pq + ' peça(s) de todas as cores' + (pc2 > 0 ? ' (' + usd(pc2) + ' em custo)' : '') + ' e as fotos.' + (S.site && S.site[ref] ? ' Ele sai do site.' : '') + ' As vendas já feitas continuam no histórico.'
          )
        );
        var pr0 = mk('div', '');
        pr0.style.cssText = 'display:flex;gap:10px';
        var sim = btn('mini', 'Sim, excluir o produto', function () {
          var xr = exclusaoEstoque(todos, 'produto excluído');
          S.items = S.items.filter(function (i) {
            return !(i.ref === ref && !i.bulk);
          });
          Object.keys(S.fotos).forEach(function (k) {
            if (k.slice(0, k.indexOf('|')) === ref) delete S.fotos[k];
          });
          limpaRefExcluido(ref);
          delete S.desc[ref];
          zerar();
          S.detCor = '';
          S.detVr = null;
          S.detRow = null;
          S.selItem = null;
          S.qty = 1;
          S.open = '';
          S.det = false;
          S.msg = 'Produto ' + ref + ' excluído.' + (xr.n ? ' Saíram ' + xr.n + ' peça(s), ' + usd(xr.usd) + ' em custo, registradas no histórico.' : '');
          render();
        });
        sim.id = 'edLixoSim';
        var nao = btn('mini', 'Cancelar', function () {
          S.pdAsk = false;
          render();
        });
        pr0.appendChild(sim);
        pr0.appendChild(nao);
        pz.appendChild(pr0);
        bx.appendChild(pz);
      }
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
          g[1].appendChild(fld('Nome do produto', nmi));
        }
        ni = mk('input', 'in');
        ni.id = 'edCodigo';
        ni.value = S.rnV != null && S.rnRef === ref ? S.rnV : ref;
        ni.setAttribute('aria-label', smp ? 'Nome do produto' : 'Código');
        var tpL = TIPOS.filter(function (x) {
          return !!isSimple(x.id) === !!smp && (x.id === 'pre') === (f.tipo === 'pre');
        });
        var tpCur = S.edTipo || f.tipo,
          tpSel = null;
        if (!smp && tpL.length > 1) {
          tpSel = edSel(
            'tipo',
            'Tipo',
            tpL.map(function (x) {
              return x.label;
            }),
            (tipoOf(tpCur) || {}).label || '',
            function (v) {
              var x = tpL.filter(function (y) {
                return y.label === v;
              })[0];
              S.edTipo = x ? x.id : '';
            }
          );
        }
        var rcod = mk('div', 'nvg2');
        rcod.appendChild(fld(smp ? 'Nome do produto' : 'Código da haste', ni));
        if (tpSel) rcod.appendChild(tpSel);
        g[1].appendChild(rcod);
        if (tpSel && tpSel._lista) g[1].appendChild(tpSel._lista);
        var guardar = function () {
          S.rnRef = ref;
          S.rnV = ni.value;
          if (nmi) S.rnN = nmi.value;
        };
        ni.oninput = guardar;
        if (nmi) nmi.oninput = guardar;
      }
      if (!smp && !f.bulk) {
        var idh = mk('div', 'col'),
          idc = Object.assign({}, attrOf(ref));
        idh.id = 'edIdent';
        idh.style.gap = '12px';
        edIdent(idh, idc, function () {
          setAttr(ref, Object.assign({ marca: '', formato: '', material: '', publico: '', colecao: '' }, idc));
        });
        g[1].appendChild(idh);
        if (nmi && !nmi.value) nmi.placeholder = nomeAuto(ref) || nmi.placeholder;
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
      g[3].appendChild(df);
      // faixa do produto (só vale ao salvar)
      if (!smp && !f.bulk && S.faixas.length) {
        var fcur = S.fDraft != null ? S.fDraft : (faixaOf(ref) || {}).id || '',
          fb = mk('div', 'nav');
        fb.id = 'edFaixas';
        S.faixas.forEach(function (x) {
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
        g[3].appendChild(fld('Faixa', fb));
      }
      if (!f.bulk && !smp) g[4].appendChild(descarteBox(ref));
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
      var ecs = [];
      all.forEach(function (i) {
        if (!i.bulk && ecs.indexOf(i.cor) < 0) ecs.push(i.cor);
      });
      if (ecs.length > 1 || (ecs.length === 1 && !smp)) {
        var cl0 = mk('div', 'card col');
        cl0.style.gap = '8px';
        cl0.id = 'edCores';
        cl0.appendChild(mk('div', 'lbl', 'Cores do modelo · toque para editar'));
        ecs.forEach(function (cn) {
          var qn = all.reduce(function (a2, i) {
              return a2 + (i.cor === cn && !i.bulk ? i.qty : 0);
            }, 0),
            ft0 = S.fotos[ref + '|' + cn],
            rw = btn('nvcor' + (cn === cor ? ' picked' : ''), '', function () {
              var r0 = rows.filter(function (i) {
                return i.cor === cn;
              })[0];
              if (r0) choose(r0);
            });
          rw.setAttribute('aria-label', 'Editar a cor ' + cn);
          var th1 = mk('div', 'nvthm');
          if (ft0) {
            var im1 = document.createElement('img');
            im1.src = ft0;
            im1.alt = '';
            th1.appendChild(im1);
          } else th1.innerHTML = NV_ICAM;
          rw.appendChild(th1);
          var tx1 = mk('div', '');
          tx1.style.cssText = 'flex:1;min-width:0';
          tx1.appendChild(mk('b', '', cn));
          tx1.appendChild(mk('small', '', qn + (qn === 1 ? ' peça · ' : ' peças · ') + (ft0 ? 'foto ok' : 'sem foto')));
          rw.appendChild(tx1);
          rw.appendChild(mk('span', 'nvpl' + (ft0 ? '' : ' w'), ft0 ? 'pronta' : 'falta foto'));
          cl0.appendChild(rw);
        });
        g[2].appendChild(cl0);
      }
      g[2].appendChild(ps);
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
      g[2].appendChild(ev);
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
            xc = all
              .filter(function (i) {
                return i.cor === cor;
              })
              .reduce(function (a, i) {
                return a + (Number(effCusto(i)) || 0) * i.qty;
              }, 0),
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
                ' peça(s) em estoque' +
                (xc > 0 ? ' (' + usd(xc) + ' em custo)' : '') +
                ' e a foto dessa cor.' +
                (S.site && S.site[ref] ? ' O produto está no site: ele é atualizado.' : '') +
                (last ? ' Como é a única cor, o produto inteiro será excluído.' : '') +
                ' As vendas já feitas continuam no histórico.'
            )
          );
          cz.appendChild(
            btn('mini', 'Sim, excluir', function () {
              var xr = exclusaoEstoque(
                S.items.filter(function (i) {
                  return i.tipo === f.tipo && i.ref === ref && i.cor === cor;
                }),
                'cor excluída'
              );
              S.items = S.items.filter(function (i) {
                return !(i.tipo === f.tipo && i.ref === ref && i.cor === cor);
              });
              delete S.fotos[ref + '|' + cor];
              limpaRefExcluido(ref);
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
              S.msg = 'Cor "' + cor + '" excluída de ' + ref + '.' + (xr.n ? ' Saíram ' + xr.n + ' peça(s), ' + usd(xr.usd) + ' em custo, registradas no histórico.' : '');
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
        g[2].appendChild(dz);
      }
      if (!f.bulk) {
        var xz = mk('div', 'zcd');
        xz.style.cssText = 'display:flex;flex-direction:column;gap:8px;border-color:rgba(239,68,68,.5)';
        var xh = mk('div', 'lbl', 'Excluir produto');
        xh.style.color = 'var(--bad)';
        xz.appendChild(xh);
        xz.appendChild(mk('div', 'hint', 'Remove o modelo, as cores e as fotos. As vendas já feitas continuam no histórico.'));
        var xbt = btn('mini', 'Excluir este produto', function () {
          S.pdAsk = true;
          render();
          var av = $('edLixoAviso');
          if (av && av.scrollIntoView) av.scrollIntoView({ block: 'center' });
        });
        xbt.id = 'edExcluir';
        xbt.style.cssText = 'background:transparent;color:var(--bad);border:1px solid rgba(239,68,68,.7)';
        xz.appendChild(xbt);
        g[4].appendChild(xz);
      }
      if (S._edDir) {
        g[cur].style.animation = (S._edDir > 0 ? 'edEntraD' : 'edEntraE') + ' .32s cubic-bezier(.2,.8,.2,1) both';
        S._edDir = 0;
      }
      bx.appendChild(g[cur]);
      // Cancelar / Salvar
      var ft = mk('div', '');
      ft.style.cssText = 'display:flex;gap:10px';
      var salvar = function () {
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
        // peças a menos: pergunta se foi perda (vira prejuízo) ou só correção de erro
        var menos = dk.filter(function (k) {
          return S.items[k] && S.qDraft[k] != null && S.qDraft[k] < S.items[k].qty;
        });
        if (menos.length && !S.ajMot) {
          S.ajAsk = true;
          render();
          return;
        }
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
        if (S.edTipo && S.edTipo !== f.tipo) {
          if (
            S.items.some(function (i) {
              return i.ref === ref && i.tipo === S.edTipo;
            })
          )
            return popErr('Já existe ' + ref + ' nesse tipo.');
          S.items.forEach(function (i) {
            if (i.ref === ref && i.tipo === f.tipo) i.tipo = S.edTipo;
          });
          S.tipo = S.edTipo;
          partes.push('Tipo alterado.');
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
      };
      var sb2 = btn('go', 'Salvar alterações', salvar);
      sb2.id = 'edSalvar';
      sb2.style.cssText = 'flex:1;margin:0';
      if (S.ajAsk) {
        var aq = mk('div', 'note n-bad');
        aq.id = 'ajAsk';
        aq.style.cssText = 'display:flex;flex-direction:column;gap:8px';
        aq.appendChild(mk('span', '', 'Você diminuiu peças. O que aconteceu?'));
        aq.appendChild(
          btn('mini', 'Quebrou ou sumiu (vira prejuízo)', function () {
            S.ajMot = 'perda';
            S.ajAsk = false;
            salvar();
          })
        );
        aq.appendChild(
          btn('mini', 'Era erro de contagem (só corrige)', function () {
            S.ajMot = 'erro';
            S.ajAsk = false;
            salvar();
          })
        );
        bx.appendChild(aq);
      }
      ft.appendChild(sb2);
      ft.className = 'edFoot';
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
        if (d < 0 && S.ajMot === 'perda') descartar(it, -d, 'ajuste na edição');
        else if (d !== 0) ajusteEstoque(it, d, S.ajMot === 'erro' ? 'correção' : '');
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
      identMove(ref, nn);
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

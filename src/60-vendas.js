  // ===== Aba Vendas. =====
  // Animação 3: a pílula Varejo|Atacado desliza e os preços contam do valor antigo ao novo (280 ms).
  function mercAnim(de) {
    if (REDUCED || vMoeda() !== 'pyg') return;
    [].slice.call(document.querySelectorAll('#vRows .pcard[data-ref]')).forEach(function (c) {
      var e = c.querySelector('.vpreco'),
        ate = e ? parseInt(e.textContent.replace(/\D/g, ''), 10) || 0 : 0,
        ini = de.pr[c.dataset.ref];
      if (!e || !ini || ini === ate) return;
      var t0 = Date.now(),
        passo = function () {
          var f = Math.min(1, (Date.now() - t0) / 280);
          e.textContent = gs(Math.round(ini + (ate - ini) * f));
          if (f < 1 && e.isConnected) requestAnimationFrame(passo);
        };
      passo();
    });
  }
  // Trilho de escolha (Varejo | Atacado): marca o botão e desliza o marcador até ele.
  function trkMarca(trk, k) {
    var on = null;
    [].forEach.call(trk.querySelectorAll('.trkB'), function (b) {
      var sim = b.dataset.m === k;
      b.classList.toggle('on', sim);
      b.setAttribute('aria-pressed', String(sim));
      if (sim) on = b;
    });
    var th = trk.querySelector('.trkTh');
    if (!on || !th) return;
    var poe = function () {
      if (!on.offsetWidth) return;
      th.style.width = on.offsetWidth + 'px';
      th.style.transform = 'translateX(' + (on.offsetLeft - 3) + 'px)';
    };
    if (on.offsetWidth) poe();
    else requestAnimationFrame(poe);
  }
  // variante dentro da lista: chave e nome (cor + grau/medida/formato quando existirem)
  function varKey(x) {
    return [x.cor, x.grau, x.vr, x.fmt, x.med].join('|');
  }
  function varNome(x) {
    var p = [x.cor === 'Sem cor' ? 'Padrão' : x.cor];
    [x.grau, x.vr, x.fmt, x.med].forEach(function (v) {
      if (v && String(v) !== 'Sem cor') p.push(String(v));
    });
    return p.join(' · ');
  }
  // Moeda de exibição do Catálogo (só para olhar os preços; a venda continua em guarani).
  function vMoeda() {
    return S.vMoeda === 'usd' || S.vMoeda === 'brl' ? S.vMoeda : 'pyg';
  }
  function pvm(g) {
    var m = vMoeda();
    return m === 'pyg' ? gs(g) : fmtM(conv(g, 'pyg', m), m);
  }
  function renderMoedaBar() {
    var bx = $('vMoedaBar');
    if (!bx) return;
    bx.textContent = '';
    [['pyg', 'G$'], ['brl', 'R$'], ['usd', 'US$']].forEach(function (m) {
      var on = vMoeda() === m[0];
      bx.appendChild(btn('mtx' + (on ? ' on' : ''), m[1], function () {
        if (on) return;
        S.vMoeda = m[0];
        render();
      }, on));
    });
    var h = $('vMoedaHint');
    if (h) {
      var m2 = vMoeda();
      h.hidden = m2 === 'pyg';
      h.textContent = m2 === 'pyg' ? '' : 'Preços em ' + (m2 === 'usd' ? 'dólar' : 'real') + ' pelo câmbio da loja (' + fmtM(1, m2) + ' = ' + gs(Math.round(ratePyg(m2))) + '). A venda continua em guarani.';
    }
  }
  // Aba Vendas.
  function renderVendas() {
    renderCatV();
    if (S.cartOpen) {
      S.vRef = '';
      S.vSel = null;
    }
    if (S.view !== 'vendas') return;
    var qm = mkMatch(S.vq),
      all = S.items.filter(function (i) {
        return (
          i.qty > 0 &&
          TIPOS.some(function (x) {
            return x.id === i.tipo;
          }) &&
          (S.vTipo === 'all' || i.tipo === S.vTipo) &&
          (!S.vGrau || S.vTipo !== 'pre' || i.grau === S.vGrau) &&
          (!S.vFaixa || (faixaOf(i.ref) || {}).id === S.vFaixa) &&
          (!qm || qm(i))
        );
      });
    $('vFiltPanel').hidden = !S.vFilt;
    $('vBtnFilt').setAttribute('aria-pressed', !!S.vFilt);
    $('vBtnFilt').classList.toggle('on', !!S.vFilt || !!S.vFaixa || S.vTipo !== 'all' || !!S.vMais);
    // abas de tipo (sempre à vista) e fileira de graus nos pré-graduados
    var vtb = $('vTabs');
    vtb.textContent = '';
    vtb.appendChild(
      btn('chip' + (S.vTipo === 'all' && !S.vMais ? ' on' : ''), 'Todos', function () {
        S.vTipo = 'all';
        S.vMais = false;
        S.vGrau = '';
        S.vRef = '';
        S.vSel = null;
        render();
      }, S.vTipo === 'all' && !S.vMais)
    );
    vtb.appendChild(
      btn('chip' + (S.vMais ? ' on' : ''), 'Mais vendidos', function () {
        S.vMais = !S.vMais;
        S.vRef = '';
        S.vSel = null;
        render();
      }, !!S.vMais)
    );
    var ordTab = ['sem', 'solar', 'pre'];
    TIPOS.slice()
      .sort(function (a, b) {
        var ia = ordTab.indexOf(a.id),
          ib = ordTab.indexOf(b.id);
        return (ia < 0 ? 9 : ia) - (ib < 0 ? 9 : ib);
      })
      .forEach(function (x) {
      vtb.appendChild(
        btn(
          'chip' + (S.vTipo === x.id ? ' on' : ''),
          x.label,
          function () {
            S.vMais = false;
            S.vTipo = S.vTipo === x.id ? 'all' : x.id;
            S.vGrau = '';
            S.vRef = '';
            S.vSel = null;
            S.qty = 1;
            S.msg = '';
            render();
          },
          S.vTipo === x.id
        )
      );
    });
    var vgb = $('vGradesB'),
      vg = $('vGrades');
    vg.textContent = '';
    vgb.hidden = S.vTipo !== 'pre';
    if (S.vTipo === 'pre') {
      var gmap = {};
      S.items.forEach(function (i) {
        if (i.tipo !== 'pre' || !i.grau) return;
        var o = gmap[i.grau] || (gmap[i.grau] = { refs: {}, n: 0 });
        if (i.qty > 0 && !o.refs[i.ref]) {
          o.refs[i.ref] = 1;
          o.n++;
        }
      });
      Object.keys(gmap)
        .sort(function (a, b) {
          return parseFloat(a) - parseFloat(b);
        })
        .forEach(function (g0) {
          var o = gmap[g0],
            on = S.vGrau === g0,
            cb = btn(
              'chip' + (on ? ' on' : '') + (o.n ? '' : ' off'),
              '',
              function () {
                if (!o.n) return;
                S.vGrau = on ? '' : g0;
                S.vRef = '';
                S.vSel = null;
                S.qty = 1;
                render();
              },
              on
            );
          cb.appendChild(document.createTextNode(g0));
          cb.appendChild(mk('small', '', o.n ? String(o.n) : 'esgotado'));
          vg.appendChild(cb);
        });
    }
    var vf = $('vFaixas');
    vf.textContent = '';
    $('vFaixaB').hidden = !S.faixas.length;
    [{ id: '', nome: 'Todas' }].concat(S.faixas).forEach(function (x) {
      vf.appendChild(
        btn(
          'chip' + ((S.vFaixa || '') === x.id ? ' on' : ''),
          x.nome,
          function () {
            S.vFaixa = x.id;
            S.vRef = '';
            S.vSel = null;
            S.qty = 1;
            render();
          },
          (S.vFaixa || '') === x.id
        )
      );
    });
    var groups = {},
      order = [];
    all.forEach(function (i) {
      var k = i.tipo + '|' + i.ref;
      if (!groups[k]) {
        groups[k] = [];
        order.push(k);
      }
      groups[k].push(i);
    });
    order.sort();
    if (S.vMais) {
      var vend = {};
      S.sales.forEach(function (x) {
        if (!x.estorno && x.ref) vend[x.ref] = (vend[x.ref] || 0) + (x.qty || 1);
      });
      order.sort(function (a, b) {
        return (vend[b.split('|')[1]] || 0) - (vend[a.split('|')[1]] || 0);
      });
    }
    if (!groups[S.vRef]) {
      S.vRef = '';
      S.vSel = null;
    }
    var tb = $('vTabBar');
    if (tb) {
      var Ta = tabDe(S.tabAtiva);
      var atac = !tabDe(S.tabAtiva).pub;
      // Trilho Varejo | Atacado (hierarquia nível 3: escolha, cinza, nunca rosa). Os botões são criados uma vez;
      // a cada desenho só troca a marca e o marcador desliza (antes os botões eram refeitos e a animação falhava).
      var trk = tb.querySelector('.trk');
      if (!trk) {
        tb.textContent = '';
        trk = mk('div', 'trk');
        trk.setAttribute('role', 'group');
        trk.setAttribute('aria-label', 'Varejo ou Atacado');
        trk.appendChild(mk('i', 'trkTh'));
        [['v', 'Varejo'], ['a', 'Atacado']].forEach(function (m) {
          var b = btn('trkB', m[1], function () {
            var ehAtac = !tabDe(S.tabAtiva).pub;
            if ((m[0] === 'a') === ehAtac) return;
            // guarda os preços para a animação (os preços contam até o novo valor)
            var de = { pr: {} };
            [].slice.call(document.querySelectorAll('#vRows .pcard[data-ref]')).forEach(function (c) {
              var e = c.querySelector('.vpreco');
              if (e) de.pr[c.dataset.ref] = parseInt(e.textContent.replace(/\D/g, ''), 10) || 0;
            });
            S.tabAtiva = m[0] === 'a' ? (S._ultAtac && tabDe(S._ultAtac).on !== false ? S._ultAtac : 'a1') : 'pub';
            if (m[0] === 'v') S._ultAtac = S._ultAtacAtual;
            render();
            mercAnim(de);
          });
          b.dataset.m = m[0];
          trk.appendChild(b);
        });
        tb.appendChild(trk);
        tb.appendChild(mk('span', 'trkExtra'));
      }
      trkMarca(trk, atac ? 'a' : 'v');
      var ext = tb.querySelector('.trkExtra');
      ext.textContent = '';
      var pg0 = atacProg();
      if (pg0) ext.appendChild(pg0);
      if (atac) S._ultAtacAtual = S.tabAtiva;
      // linha de baixo da busca: Varejo = "N peças"; Atacado = chip da tabela
      var inf = $('vInfo');
      if (inf) {
        inf.textContent = '';
        if (atac) {
          // só no Atacado: a tabela em texto tocável (B2+)
          var tbtn = btn('tabtx tabchip', Ta.nome + ' ▾', function () { tabSheet(false); });
          inf.appendChild(tbtn);
        } else {
          inf.appendChild(mk('span', 'vpcs', all.reduce(function (a, i) { return a + (i.qty > 0 ? i.qty : 0); }, 0) + ' peças'));
        }
      }
      S._vVis = order.map(function (k) { return groups[k][0].ref; });
    }
    renderMoedaBar();
    var rows = $('vRows');
    rows.textContent = '';
    rows.classList.toggle('vlist', modoDe('v') === 'l');
    modoBtn($('vModo'), 'v');
    order.forEach(function (k) {
      var g = groups[k],
        f = g[0],
        tp = tipoOf(f.tipo),
        tot = sum(g);
      // lista: peça com várias cores em estoque se abre no lugar (cor sem estoque nem aparece)
      var vsL = g.filter(function (x) {
          return x.qty > 0 && gLivre(x) > 0;
        }),
        corU = {};
      vsL.forEach(function (x) {
        corU[x.cor] = (corU[x.cor] || 0) + 1;
      });
      var nCor = Object.keys(corU).length;
      // v420: lista no esboço B (aprovado 04/11): faixa única, quantidade à direita, cores abrem logo abaixo
      if (rows.classList.contains('vlist')) {
        vLinhaB(rows, k, g, f, vsL, nCor);
        return;
      }
      var multi = rows.classList.contains('vlist') && vsL.length >= 1,
        aberto = multi && S.vAb === k,
        selI = multi && ((S.vCor && S.vCor[k] && vsL.filter(function (x) { return varKey(x) === S.vCor[k]; })[0]) || vsL[0]);
      var card = btn(
        'pcard' + (k === S.vRef ? ' on' : '') + (aberto ? ' aberta' : ''),
        '',
        function (ev) {
          // grade: tocar na peça abre a vitrine direto (Toque A, aprovado 04/11/2026; a prévia/folha saiu)
          if (multi) {
            var mais = ev && ev.target && ev.target.closest && ev.target.closest('.vplus');
            if (mais && (aberto || vsL.length === 1)) {
              S._vsel = selI;
              S.qty = 1;
              window.__voaSrc = (card.parentNode && card.parentNode.querySelector('.vcores .vcor.on img')) || card.querySelector('img');
              $('sCartAdd').click();
              return;
            }
            S.vAb = aberto ? '' : k;
            render();
            return;
          }
          // "+" na lista: se a peça tem uma só variante com estoque, vai direto para o pedido
          if (ev && ev.target && ev.target.closest && ev.target.closest('.vplus')) {
            var vs = g.filter(function (x) {
                return x.qty > 0 && gLivre(x) > 0;
              }),
              ch = {};
            vs.forEach(function (x) {
              ch[[x.cor, x.grau, x.vr, x.fmt, x.med].join('|')] = 1;
            });
            if (vs.length && Object.keys(ch).length === 1) {
              S._vsel = vs[0];
              S.qty = 1;
              window.__voaSrc = card.querySelector('img');
              $('sCartAdd').click();
              return;
            }
          }
          if (S.vRef === k) {
            S.vRef = '';
            S.vSel = null;
            S.qty = 1;
            S.msg = '';
            render();
            return;
          }
          S.vRef = k;
          S.vSel = null;
          S.qty = 1;
          S.msg = '';
          S.detRow = null;
          S.detCor = '';
          render();
          window.scrollTo(0, 0);
        },
        k === S.vRef
      );
      card.dataset.ref = f.ref;
      card.appendChild(photoBox(aberto && selI ? photoOf(f.ref, selI.cor) || photoOf(f.ref) : photoOf(f.ref), 'pbox'));
      var nmB = mk('b', '', pn(f.ref));
      if (multi) {
        var sb = mk('small', 'vsub', aberto ? varNome(selI) + ' · ' + gLivre(selI) + ' un.' : (nCor > 1 ? nCor + ' cores' : vsL.length > 1 ? vsL.length + ' opções' : varNome(vsL[0])) + ' · ' + vsL.reduce(function (a, x) { return a + gLivre(x); }, 0) + ' un.');
        nmB.appendChild(sb);
      }
      card.appendChild(nmB);
      var pr0 = precoTab(f);
      if (pr0) {
        var pp = mk('b', 'vpreco', pvm(pr0));
        pp.style.color = 'var(--ok)';
        var pubP = atacModo() ? precoTab(f, 'pub') : 0;
        if (pubP > pr0) {
          var rs = mk('s', 'vriscado', pvm(pubP));
          card.appendChild(rs);
        }
        card.appendChild(pp);
      }
      var unico = vsL.length === 1 ? vsL[0] : null;
      if (atacModo() && rows.classList.contains('vlist') && unico) {
        var qa = atacQtd(unico);
        if (qa > 1 && pr0) nmB.appendChild(mk('small', 'vtotl', 'Total ' + pvm(qa * pr0)));
        card.appendChild(atacStep(unico));
      }
      else card.appendChild(mk('i', 'vplus', '+'));
      rows.appendChild(card);
      if (aberto) {
        var pn2 = mk('div', 'vcores');
        vsL.forEach(function (x) {
          var cb = btn('vcor' + (x === selI ? ' on' : ''), '', function () {
            if (!S.vCor) S.vCor = {};
            S.vCor[k] = varKey(x);
            render();
          }, x === selI);
          var th = mk('span', 'vci'),
            fk = S.fotos[f.ref + '|' + x.cor];
          if (fk) {
            var ig = mk('img');
            ig.src = fk;
            ig.alt = x.cor;
            th.appendChild(ig);
          } else th.style.background = hexOf(x.cor);
          cb.appendChild(th);
          cb.appendChild(mk('b', '', varNome(x)));
          cb.appendChild(mk('span', 'n', gLivre(x) + ' un.'));
          pn2.appendChild(cb);
        });
        pn2.appendChild(mk('div', 'vun', 'Toque no + para adicionar ' + (selI.cor === 'Sem cor' ? 'a peça' : 'a cor ' + selI.cor) + ' (' + gLivre(selI) + ' un. disponíveis)'));
        rows.appendChild(pn2);
      }
    });
    if (!order.length)
      rows.appendChild(
        mk(
          'div',
          'note n-warn',
          S.vq.trim() || S.vTipo !== 'all'
            ? 'Nenhuma peça em estoque com essa busca.'
            : 'Não há peças em estoque. Dê entrada na aba Estoque.'
        )
      );
    // produto aberto: a mesma tela do catálogo, em modo venda; a lista some
    $('vListCard').hidden = !!S.vRef;
    $('vSaleCard').hidden = true; // quantidade e botão Vender ficam na barra fixa do produto
    if (S.vRef && groups[S.vRef]) {
      var dsel = renderDetail(groups[S.vRef][0].ref, {
        venda: true,
        host: $('vDetail'),
        tipo: groups[S.vRef][0].tipo
      });
      if (dsel) S.vSel = dsel;
    } else renderDetail('', { venda: true, host: $('vDetail') });
    var lines = (groups[S.vRef] || []).slice();
    if (lines.length && lines[0].tipo === 'pre')
      lines.sort(function (a, b) {
        return parseFloat(a.grau) - parseFloat(b.grau);
      });
    var sel = lines.indexOf(S.vSel) >= 0 ? S.vSel : lines[0] || null;
    S.vSel = sel;
    var lineLabel = function (i) {
      return i.tipo === 'pre'
        ? i.grau + ' · ' + i.cor
        : isSimple(i.tipo)
          ? i.cor
          : i.vr + ' ' + i.cor;
    };
    $('vLinesB').hidden = true;
    var vl = $('sLines');
    vl.textContent = '';
    lines.forEach(function (i) {
      var b = btn(
        'seg' + (i === sel ? ' on' : ''),
        '',
        function () {
          S.vSel = i;
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
      l.appendChild(document.createTextNode(lineLabel(i)));
      b.appendChild(l);
      b.appendChild(
        mk(
          'span',
          'n',
          (i.tipo === 'pre' || !i.fmt || i.bulk ? '' : i.fmt + ' · ') + i.qty + ' disp.'
        )
      );
      vl.appendChild(b);
    });
    var t = sel ? tipoOf(sel.tipo) : null,
      max = sel ? gLivre(sel) : 0;
    S._vcap = Math.max(max, 1);
    S.qty = Math.max(1, Math.min(S.qty, S._vcap));
    S._vsel = sel;
    $('spc').textContent = sel
      ? t.full + ' › ' + sel.ref + ' › ' + lineLabel(sel)
      : 'Escolha uma peça na lista.';
    $('sqv').value = S.qty;
    var st = $('sst');
    st.textContent = '';
    st.className = '';
    function note(c, tx) {
      st.className = 'note ' + c;
      st.textContent = tx;
    }
    if (!sel) note('n-warn', 'Escolha uma peça para vender.');
    else if (max === 0) note('n-bad', sel && gQty(sel) > 0 ? 'Todas as peças estão reservadas por pedidos do site.' : 'Sem estoque dessa peça. Venda travada.');
    else if (S.qty >= max) note('n-warn', 'Limite: só há ' + max + ' dessa peça' + (sel && gQty(sel) > max ? ' (' + (gQty(sel) - max) + ' reservada(s) no site)' : '') + '.');
    else note('n-ok', 'Disponível: pode vender até ' + max + ' un.');
    $('sumB').hidden = !sel;
    if (sel) {
      S._t = tFor(sel);
      S._selKey = [sel.tipo, sel.ref, sel.cor, sel.grau, sel.vr].join('/');
      if (S._descKey !== S._selKey) {
        S._descKey = S._selKey;
        S.descTxt = '';
        if (!S.cart.length) {
          S.vBrinde = null;
          S.vMotivo = '';
        }
      }
      var pt = S._t.price,
        lista = pt * S.qty;
      var fxs = faixaOf(sel.ref);
      $('unit').textContent = pt
        ? 'Preço unit. ' + pvm(pt) + (fxs ? ' (faixa ' + fxs.nome + ')' : ' (exemplo)')
        : 'Preço livre: digite abaixo o valor recebido';
      $('tot').textContent = pt ? pvm(lista) : '';
      renderBrindeMotivo(sel);
    }
    $('vmsg').textContent = S.msg || '';
    carrinhoRender();
  }
  // Brinde e motivo do desconto da venda.
  function renderBrindeMotivo(sel) {
    var bl = brindesDisp().filter(function (x) {
      return x !== sel;
    });
    $('brB').hidden = !bl.length;
    var bc = $('brChips');
    bc.textContent = '';
    if (S.vBrinde && bl.indexOf(S.vBrinde) < 0) S.vBrinde = null;
    bc.appendChild(
      btn(
        'chip' + (!S.vBrinde ? ' on' : ''),
        'Sem brinde',
        function () {
          S.vBrinde = null;
          S.rec = null;
          render();
        },
        !S.vBrinde
      )
    );
    bl.forEach(function (x) {
      bc.appendChild(
        btn(
          'chip' + (S.vBrinde === x ? ' on' : ''),
          tipoOf(x.tipo).label + ' ' + x.ref + ' · ' + x.cor + ' · ' + usd(brindeUsd(x)),
          function () {
            S.vBrinde = x;
            S.rec = null;
            render();
          },
          S.vBrinde === x
        )
      );
    });
  }
  // Aviso de piso: mostra o lucro ou a perda e pede confirmação se estiver abaixo.
  function renderPiso() {
    var el = $('pisoSt'),
      v = cartPrevia();
    el.textContent = '';
    el.className = '';
    $('sgo').textContent = 'Finalizar venda';
    if (!v || !(v.eff > 0)) return;
    var bt = v.br ? ' (já contando o brinde)' : '';
    if (v.perde) {
      el.className = 'note n-bad';
      el.textContent =
        'Abaixo da trava: você perde ' + gs(v.travaTot - v.liq) + ' nesta venda' + bt + (v.tx ? ' (já descontada a taxa de ' + gs(v.tx) + ')' : '') + '.';
    } else if (v.abaixo) {
      el.className = 'note n-warn';
      el.textContent =
        'Abaixo do piso: piso ' +
        gs(v.pisoTot) +
        '. Lucro livre estimado ' +
        gs(v.c.livre) +
        bt +
        '.';
    } else {
      el.className = 'note n-ok';
      el.textContent =
        'Acima do piso. Lucro livre estimado: ' +
        gs(v.c.livre) +
        bt +
        (v.tx ? '. Taxa da ' + v.fm.nome.toLowerCase() + ': ' + gs(v.tx) + ' (já descontada)' : '') +
        '.';
    }
    if (v.abaixo) {
    }
  }
  // Vitrine (Toque A): deslizar para baixo no topo da tela fecha e volta para o catálogo.
  (function () {
    var d = $('vDetail'),
      y0 = null,
      dy = 0;
    if (!d) return;
    d.addEventListener('touchstart', function (e) {
      y0 = window.scrollY <= 4 && e.touches.length === 1 ? e.touches[0].clientY : null;
      dy = 0;
    }, { passive: true });
    d.addEventListener('touchmove', function (e) {
      if (y0 === null) return;
      dy = e.touches[0].clientY - y0;
      if (dy > 0 && !REDUCED) d.style.transform = 'translateY(' + Math.min(dy * 0.5, 120) + 'px)';
    }, { passive: true });
    var solta = function () {
      if (y0 === null) return;
      y0 = null;
      d.style.transition = 'transform .25s cubic-bezier(.4,0,.2,1)';
      d.style.transform = '';
      setTimeout(function () {
        d.style.transition = '';
      }, 260);
      if (dy > 110 && S.vRef) {
        S.vRef = '';
        S.vSel = null;
        S.qty = 1;
        render();
      }
    };
    d.addEventListener('touchend', solta);
    d.addEventListener('touchcancel', solta);
  })();
  $('vq').oninput = function (e) {
    S.vq = e.target.value;
    S.vGrau = S.vq.trim() ? '' : S.vGrau;
    S.vRef = '';
    S.vSel = null;
    S.qty = 1;
    render();
  };
  /* ===== ler o código impresso na haste (OCR no aparelho) ===== */

  // ===== Lista de vendas, esboço B (v420): foto · nome, cor e un., preço · à direita − N + (ou + no varejo) ou seta das cores =====
  function vLinhaDir(it, rowEl) {
    var n = atacQtd(it);
    if (!atacModo() && n === 0) {
      var pl = mk('i', 'vplus', '+');
      pl.setAttribute('role', 'button');
      pl.setAttribute('aria-label', 'Pôr no pedido');
      pl.addEventListener('click', function (ev) {
        ev.stopPropagation();
        S._vsel = it;
        S.qty = 1;
        window.__voaSrc = rowEl.querySelector('img');
        $('sCartAdd').click();
      });
      return pl;
    }
    var st = atacStep(it);
    if (n >= gLivre(it)) st.querySelector('.vs-p').classList.add('off');
    return st;
  }
  function vLinhaB(rows, k, g, f, vsL, nCor) {
    var pr0 = precoTab(f),
      pubP = atacModo() ? precoTab(f, 'pub') : 0,
      unico = vsL.length === 1 ? vsL[0] : null,
      aberto = !unico && S.vAb === k,
      noPed = vsL.reduce(function (a, x) {
        return a + atacQtd(x);
      }, 0),
      un = vsL.reduce(function (a, x) {
        return a + gLivre(x);
      }, 0);
    var card = btn('pcard vlb' + (aberto ? ' aberta' : '') + (noPed > 0 ? ' noped' : ''), '', function () {
      if (unico) return;
      S.vAb = aberto ? '' : k;
      render();
    });
    card.dataset.ref = f.ref;
    if (unico) card.dataset.vk = varKey(unico);
    card.appendChild(photoBox(unico ? photoOf(f.ref, unico.cor) || photoOf(f.ref) : photoOf(f.ref), 'pbox'));
    var tx = mk('span', 'vlTx');
    tx.appendChild(mk('b', 'vlNm', pn(f.ref)));
    tx.appendChild(mk('small', 'vsub', (unico ? varNome(unico) : nCor > 1 ? nCor + ' cores' : vsL.length + ' opções') + ' · ' + un + ' un.'));
    var pl = mk('span', 'vlPr');
    if (pr0) {
      var pp = mk('b', 'vpreco', pvm(pr0));
      pl.appendChild(pp);
      var nU = unico ? atacQtd(unico) : 0;
      if (unico && nU > 1) pl.appendChild(mk('small', 'vtotl', '· total ' + pvm(pr0 * nU).replace(/^[^\d]+/, '')));
      else if (pubP > pr0) pl.appendChild(mk('s', 'vriscado', pvm(pubP).replace(/^[^\d]+/, '')));
    }
    tx.appendChild(pl);
    card.appendChild(tx);
    if (unico) card.appendChild(vLinhaDir(unico, card));
    else {
      var ch = mk('span', 'vlCh');
      ch.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
      card.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      card.appendChild(ch);
    }
    rows.appendChild(card);
    if (aberto) {
      var sub = mk('div', 'vlSub');
      vsL.forEach(function (x) {
        var r = mk('div', 'vlRow' + (atacQtd(x) > 0 ? ' noped' : ''));
        r.dataset.vk = varKey(x);
        r.dataset.ref = f.ref;
        var fk = S.fotos[f.ref + '|' + x.cor],
          th = mk('span', 'vlFs');
        if (fk) {
          var ig = mk('img');
          ig.src = fk;
          ig.alt = x.cor;
          th.appendChild(ig);
        } else th.style.background = hexOf(x.cor);
        r.appendChild(th);
        var t2 = mk('span', 'vlTx');
        t2.appendChild(mk('b', 'vlNm', varNome(x)));
        t2.appendChild(mk('small', 'vsub', gLivre(x) + ' un.'));
        r.appendChild(t2);
        r.appendChild(vLinhaDir(x, r));
        sub.appendChild(r);
      });
      rows.appendChild(sub);
    }
  }

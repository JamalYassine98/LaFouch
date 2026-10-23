  // ===== Estoque: cadastro em lote a partir da foto e paleta de cores. =====
  // Exclui uma cor da paleta (verifica peças que a usam).
  function delPal(n) {
    var lines = S.items.filter(function (i) {
        return i.cor === n;
      }),
      stock = sum(lines);
    if (stock > 0) {
      var where = Array.from(
        new Set(
          lines
            .filter(function (i) {
              return i.qty > 0;
            })
            .map(function (i) {
              return TIPOS.filter(function (x) {
                return x.id === i.tipo;
              })[0].label;
            })
        )
      ).join(', ');
      $('palH').textContent =
        '"' +
        n +
        '" ainda tem ' +
        stock +
        ' peça(s) em estoque em: ' +
        where +
        '. O número ao lado da cor conta só o tipo aberto agora. Venda essas peças antes de apagar a cor.';
      return;
    }
    S.items = S.items.filter(function (i) {
      return i.cor !== n;
    });
    S.selItem = null;
    Object.keys(S.fotos).forEach(function (k) {
      if (k.slice(k.indexOf('|') + 1) === n) delete S.fotos[k];
    });
    delete S.palette[n];
    if (S.corF === n) S.corF = 'all';
    $('palH').textContent = 'Cor "' + n + '" removida.';
    render();
  }

  // ---- foto da peça
  var P = null;
  // ---- várias peças numa foto
  var B = null;
  // Abre o cadastro em lote com as peças detectadas na foto.
  function openBatch(boxes, full, meta, info) {
    var items = [],
      i = 0;
    info = info || {};
    var base = {
      ref:
        $('phRef').value.trim() || (info.referencia && String(info.referencia).toUpperCase()) || '',
      tipo:
        (P && P.tipo) ||
        (['sem', 'solar'].indexOf(info.tipo) >= 0 ? info.tipo : S.tipo === 'pre' ? 'sem' : S.tipo),
      fmt: (P && P.fmt) || '',
      med: $('phMed').value.trim()
    };
    if (!base.med && info.medidas) {
      var mm = String(info.medidas).match(/(\d{2})\D+(\d{2})\D+(\d{3})/);
      if (mm) base.med = mm[1] + '□' + mm[2] + '-' + mm[3];
    }
    if (!base.fmt && info.formato) {
      var fm = S.formats.filter(function (x) {
        return x.toLowerCase() === String(info.formato).toLowerCase();
      })[0];
      if (fm) base.fmt = fm;
    }
    P = null;
    B = {
      items: [],
      ref: base.ref,
      tipo: base.tipo,
      fmt: base.fmt,
      med: base.med,
      busy: boxes.length,
      total: boxes.length
    };
    render();
    (function next() {
      if (i >= boxes.length || !B) {
        if (B) {
          B.busy = 0;
          B.items = items;
          render();
        }
        return;
      }
      var b = boxes[i],
        m = (meta && meta[i]) || {},
        pw = 0.03,
        x0 = Math.max(0, b[0] - pw) * full.width,
        y0 = Math.max(0, b[1] - pw) * full.height,
        x1 = Math.min(1, b[2] + pw) * full.width,
        y1 = Math.min(1, b[3] + pw) * full.height,
        c = mkCanvas(x1 - x0, y1 - y0);
      c.getContext('2d').drawImage(full, x0, y0, x1 - x0, y1 - y0, 0, 0, c.width, c.height);
      var res;
      try {
        res = whiten(c);
      } catch (e) {
        res = { canvas: c };
      }
      var sk = skin(res.canvas, [128, 128, 128]),
        hx =
          '#' +
          sk
            .map(function (v) {
              return ('0' + Math.round(v).toString(16)).slice(-2);
            })
            .join(''),
        cor =
          m.cor && String(m.cor).toLowerCase() !== 'null'
            ? cap1(String(m.cor))
            : nearest(sk[0], sk[1], sk[2]),
        vr =
          m.variante && /^C\s?\d+$/i.test(m.variante)
            ? m.variante.toUpperCase().replace(/\s/g, '')
            : '',
        q = parseInt(m.qtd, 10);
      items.push({
        img: res.canvas.toDataURL('image/jpeg', 0.92),
        thumb: thumbOf(res.canvas),
        hex: hx,
        vr: vr,
        cor: cor,
        qty: q > 0 && q < 100 ? q : 1,
        on: true
      });
      i++;
      if (B) {
        B.busy = boxes.length - i;
        B.items = items.slice();
        renderBatch();
      }
      setTimeout(next, 10);
    })();
  }
  // Desenha o cartão do cadastro em lote.
  function renderBatch() {
    var c = $('batchCard');
    if (!B) {
      c.hidden = true;
      return;
    }
    c.hidden = false;
    $('bInfo').textContent = B.busy
      ? 'Separando as peças… faltam ' + B.busy + '.'
      : 'Separei ' +
        B.items.length +
        ' peças com fundo branco. Confira o código C, a cor e a quantidade de cada uma. Desmarque o que não quiser.';
    var act = document.activeElement && document.activeElement.id;
    if (act !== 'bRef' && $('bRef').value !== B.ref) $('bRef').value = B.ref;
    if (act !== 'bMed' && $('bMed').value !== B.med) $('bMed').value = B.med;
    var t = $('bTipos');
    t.textContent = '';
    TIPOS.filter(function (x) {
      return x.id !== 'pre' && !x.x;
    }).forEach(function (x) {
      t.appendChild(
        btn(
          'chip' + (x.id === B.tipo ? ' on' : ''),
          x.label,
          function () {
            B.tipo = x.id;
            renderBatch();
          },
          x.id === B.tipo
        )
      );
    });
    var known = B.ref
      ? S.items.filter(function (i) {
          return i.ref.toUpperCase() === B.ref.toUpperCase();
        })[0]
      : null;
    {
      var bpg = pickG(known ? known.tipo : B.tipo, B.g);
      $('bCustoH').textContent = bpg.g
        ? 'Sem preencher, vale a média do lote: ' + usd(gUnit(bpg.g)) + ' por peça.'
        : 'Obrigatório: estas peças não estão em nenhum lote.';
    }
    loteChips('bLote', known ? known.tipo : B.tipo, B.g, function (v) {
      B.g = v;
    });
    $('bFmtB').hidden = !!known;
    var fu = B.fmt && S.formats.indexOf(B.fmt) >= 0 ? B.fmt : '',
      f = $('bFmts');
    f.textContent = '';
    fmtCat(fu).forEach(function (x) {
      f.appendChild(
        btn(
          'chip' + (x === fu ? ' on' : ''),
          x,
          function () {
            B.fmt = B.fmt === x ? '' : x;
            renderBatch();
          },
          x === fu
        )
      );
    });
    var l = $('bList');
    if (l.dataset.n !== String(B.items.length) + '|' + (B.busy ? 1 : 0) || true) {
      l.textContent = '';
      B.items.forEach(function (it, ix) {
        var row = mk('div', 'card');
        row.style.cssText = 'display:flex;gap:10px;align-items:center;padding:8px;flex-wrap:wrap';
        var im = mk('img');
        im.src = it.img;
        im.alt = 'Peça ' + (ix + 1);
        im.style.cssText =
          'width:96px;height:96px;object-fit:contain;background:#fff;border-radius:8px';
        row.appendChild(im);
        var col = mk('div', 'col');
        col.style.cssText = 'flex:1;min-width:150px;gap:6px';
        var r1 = mk('div');
        r1.style.cssText = 'display:flex;gap:6px;align-items:center';
        var ck = mk('input');
        ck.type = 'checkbox';
        ck.checked = it.on;
        ck.setAttribute('aria-label', 'Incluir peça ' + (ix + 1));
        ck.onchange = function () {
          it.on = ck.checked;
        };
        var vi = mk('input', 'in');
        vi.value = it.vr;
        vi.placeholder = 'C1';
        vi.setAttribute('aria-label', 'Variante');
        vi.style.width = '70px';
        vi.oninput = function () {
          it.vr = vi.value.toUpperCase().replace(/\s/g, '');
        };
        var qi = mk('input', 'in');
        qi.type = 'number';
        qi.min = 1;
        qi.max = 99;
        qi.value = it.qty;
        qi.setAttribute('aria-label', 'Quantidade');
        qi.style.width = '70px';
        qi.oninput = function () {
          it.qty = Math.max(1, Math.min(99, parseInt(qi.value, 10) || 1));
        };
        r1.appendChild(ck);
        r1.appendChild(vi);
        var ql = mk('span', 'hint', 'qtd');
        r1.appendChild(qi);
        r1.appendChild(ql);
        var ci = mk('input', 'in');
        ci.value = it.cor;
        ci.placeholder = 'Cor';
        ci.setAttribute('aria-label', 'Cor');
        ci.oninput = function () {
          it.cor = cap1(ci.value);
        };
        col.appendChild(r1);
        col.appendChild(ci);
        row.appendChild(col);
        l.appendChild(row);
      });
    }
    $('bOk').disabled = !!B.busy;
    $('bErr').hidden = true;
  }
  $('bRef').oninput = function () {
    if (B) {
      B.ref = $('bRef').value.trim().toUpperCase();
      renderBatch();
    }
  };
  $('bMed').oninput = function () {
    if (B) B.med = $('bMed').value.trim();
  };
  $('bCancel').onclick = function () {
    B = null;
    render();
  };
  $('bOk').onclick = function () {
    if (!B || B.busy) return;
    var err = $('bErr');
    function bad(t) {
      err.hidden = false;
      err.textContent = t;
    }
    var ref = B.ref.toUpperCase(),
      on = B.items.filter(function (i) {
        return i.on;
      });
    if (!ref) return bad('Informe a referência.');
    if (!on.length) return bad('Marque pelo menos uma peça.');
    if (
      on.some(function (i) {
        return !i.cor;
      })
    )
      return bad('Falta a cor em alguma peça.');
    var known = S.items.filter(function (i) {
        return i.ref.toUpperCase() === ref;
      })[0],
      tipo = known ? known.tipo : B.tipo,
      fmt = known ? known.fmt : B.fmt && S.formats.indexOf(B.fmt) >= 0 ? B.fmt : '',
      novas = 0,
      seen = {};
    var bgr = pickG(tipo, B.g);
    if (bgr.err) return bad(bgr.err);
    var bgt = on.reduce(function (a, x) {
        return a + x.qty;
      }, 0),
      bgc = gCap(bgr.g, bgt);
    if (bgc) {
      popErr(bgc);
      return;
    }
    var bgid = bgr.g ? bgr.g.id : '';
    var bcv = String($('bCusto').value).trim(),
      bcu = bcv === '' ? null : parseFloat(bcv.replace(',', '.'));
    if (bcv !== '' && !(bcu >= 0)) return bad('Custo inválido. Use um número em US$.');
    if (!bgr.g && !(bcu > 0)) {
      popErr(
        'Informe o custo por peça em US$, ou escolha o lote de origem. Sem lote, o custo é obrigatório.'
      );
      return;
    }
    if (bgr.g && bcu != null) {
      var bce = gCostErr(bgr.g, bcu * bgt, null, bcu, bgt);
      if (bce) {
        popErr(bce);
        return;
      }
    }
    setPN(ref, $('bNome').value);
    $('bNome').value = '';
    on.forEach(function (it) {
      var vr = it.vr || 'C1',
        has = Object.keys(S.palette).some(function (k) {
          return k.toLowerCase() === it.cor.toLowerCase();
        });
      if (!has) {
        S.palette[it.cor] = it.hex;
        novas++;
      }
      var ex = S.items.filter(function (x) {
        return (
          x.tipo === tipo &&
          x.ref.toUpperCase() === ref &&
          x.cor.toLowerCase() === it.cor.toLowerCase() &&
          x.vr === vr &&
          (x.lote || '') === bgid
        );
      })[0];
      if (ex) {
        ex.qty += it.qty;
        if (ex.custo == null && bcu != null) ex.custo = bcu;
      } else
        S.items.push({
          custo: bcu == null ? undefined : bcu,
          lote: bgid || undefined,
          tipo: tipo,
          grau: '',
          ref: ref,
          med: known && known.med ? known.med : B.med,
          vr: vr,
          fmt: fmt,
          cor: it.cor,
          qty: it.qty
        });
      entradaEstoque(tipo, ref, it.cor, '', it.qty);
      var k = ref + '|' + it.cor;
      if (!seen[k]) {
        setFoto(k, it.thumb || it.img, it.img);
        seen[k] = 1;
      }
    });
    $('bCusto').value = '';
    S.msg =
      'Pronto: ' +
      on.length +
      ' peça(s) de ' +
      ref +
      ' adicionadas' +
      (known ? ' ao produto existente' : ' (produto novo)') +
      (novas ? ', ' + novas + ' cor(es) nova(s) na paleta' : '') +
      '.';
    if (S.fromLot) {
      S.todos = false;
      S.lotesView = true;
      S.lotSel = S.fromLot;
      S.lotPick = {};
      B = null;
      S.addOpen = false;
      S.fromLot = '';
      render();
      return;
    }
    ASNAP = null;
    S.todos = false;
    S.lotesView = false;
    S.tipo = tipo;
    S.fmtF = 'all';
    S.corF = 'all';
    S.q = '';
    S.open = ref;
    S.det = true;
    S.selItem = null;
    S.detCor = on[0].cor;
    S.detVr = null;
    S.mode = 'venda';
    S.qty = 1;
    B = null;
    S.addOpen = false;
    render();
    $('rows').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  $('phSplit').onclick = function () {
    if (P && P.pieces && P.full) openBatch(P.pieces, P.full, null, {});
  };

  // Cor da paleta mais próxima de um RGB.
  function nearest(r, g, b) {
    var best = '',
      bd = 1e9;
    Object.keys(S.palette).forEach(function (n) {
      var h = S.palette[n],
        R = parseInt(h.substr(1, 2), 16),
        G = parseInt(h.substr(3, 2), 16),
        B = parseInt(h.substr(5, 2), 16),
        d = (R - r) * (R - r) + (G - g) * (G - g) + (B - b) * (B - b);
      if (d < bd) {
        bd = d;
        best = n;
      }
    });
    return best;
  }
  $('btnFoto').onclick = function () {
    S.photoFor = null;
    camOpen(
      function (f, g) {
        S.photoFor = null;
        window.__GAL = !!(g && g.gallery);
        $('file').onchange({ target: { files: [f] } });
      },
      'Foto da peça',
      {
        gallery: true,
        tip: 'Ponha a peça inteira dentro do retângulo, de preferência sobre uma folha branca. Toque na tela para focar.'
      }
    );
  };
  // ---- foto: nitidez e fundo branco

  // ===== v465: trocar Armação ↔ Pré-graduado (aprovado 08/11/2026, esboço trocar_tipo.png) =====
  // Pré-graduado é contado por GRAU; armação, por COR. A folha pergunta o grau de cada cor (ou a cor de cada grau)
  // e muda as linhas do estoque sem perder peça nenhuma. No site o modelo passa para "De grau" (ou volta a Armação).
  var TT_GRAUS = (function () {
    var l = [];
    for (var g = 0.5; g <= 4.001; g += 0.25) l.push('+' + g.toFixed(2));
    return l;
  })();
  function ttGrausDe() {
    var vis = {};
    TT_GRAUS.forEach(function (g) {
      vis[g] = 1;
    });
    (S.items || []).forEach(function (i) {
      if (i.tipo === 'pre' && i.grau) vis[i.grau] = 1;
    });
    return Object.keys(vis).sort(function (a, b) {
      return parseFloat(a) - parseFloat(b);
    });
  }
  // grau escrito no código ou no nome (ex.: "+1.50", "1,75") vira a sugestão
  function ttGrauSug(ref) {
    var t = ref + ' ' + ((S.pnome && S.pnome[ref]) || ''),
      m = t.match(/([+-]?\d)[.,](\d{2})/);
    if (!m) return '+1.00';
    var g = '+' + Math.abs(parseFloat(m[1] + '.' + m[2])).toFixed(2);
    return TT_GRAUS.indexOf(g) >= 0 ? g : '+1.00';
  }
  S.tt = null;
  function tipoTrocaAbre(ref, de, para) {
    var rows = S.items.filter(function (i) {
      return i.ref === ref && i.tipo === de && i.qty > 0;
    });
    var grupos = [];
    if (para === 'pre') {
      // uma linha por cor (soma das peças daquela cor)
      var porCor = {};
      rows.forEach(function (i) {
        var c = i.cor || 'Sem cor';
        porCor[c] = (porCor[c] || 0) + i.qty;
      });
      Object.keys(porCor).forEach(function (c) {
        grupos.push({ k: c, n: porCor[c], partes: [{ g: ttGrauSug(ref), n: porCor[c] }] });
      });
    } else {
      // uma linha por grau (+ a cor que ele tinha)
      var porG = {};
      rows.forEach(function (i) {
        var k = (i.grau || 'sem grau') + '|' + (i.cor || 'Sem cor');
        porG[k] = (porG[k] || 0) + i.qty;
      });
      Object.keys(porG).forEach(function (k) {
        var pp = k.split('|');
        grupos.push({ k: k, grau: pp[0], cor: pp[1], n: porG[k], dest: pp[1] });
      });
    }
    S.tt = { ref: ref, de: de, para: para, g: grupos };
    ttDesenha();
  }
  function ttCores(ref) {
    var c = {};
    S.items.forEach(function (i) {
      if (i.ref === ref && i.cor) c[i.cor] = 1;
    });
    return Object.keys(c);
  }
  function ttSel(nome, val, ops) {
    return '<select class="ttSel" data-tt="' + nome + '">' + ops.map(function (o) {
      return '<option' + (o === val ? ' selected' : '') + '>' + esc(o) + '</option>';
    }).join('') + '</select>';
  }
  function ttDesenha() {
    var t = S.tt;
    if (!t) return;
    var h = '';
    if (t.para === 'pre') {
      var gs0 = ttGrausDe();
      h += '<h3 class="ttT">Mudar para Pré-graduado</h3><p class="ttP">Pré-graduado é contado por grau. Diga em qual grau estão as peças de cada cor. No site ele passa a aparecer em <b>De grau</b>.</p>';
      t.g.forEach(function (gr, gi) {
        gr.partes.forEach(function (pt, pi) {
          var resto = pi === 0 && gr.partes.length > 1;
          h += '<div class="ttR"><span>' + esc(gr.k) + '<small>' + (gr.partes.length > 1 ? (resto ? pt.n + ' peças' : '<input class="ttN" inputmode="numeric" data-tt="n:' + gi + ':' + pi + '" value="' + pt.n + '"> peças') : gr.n + ' peças') + '</small></span>' + ttSel('g:' + gi + ':' + pi, pt.g, gs0) + (pi > 0 ? '<button type="button" class="ttX" data-act="ttTira" data-id="' + gi + ':' + pi + '" aria-label="Tirar este grau">×</button>' : '') + '</div>';
        });
        if (gr.n > 1) h += '<button type="button" class="ttDiv" data-act="ttDivide" data-id="' + gi + '">' + (gr.partes.length > 1 ? '+ outro grau em ' + esc(gr.k) : 'Graus diferentes em ' + esc(gr.k) + '? Dividir por grau ›') + '</button>';
      });
    } else {
      var cs = ttCores(t.ref),
        tot = {};
      h += '<h3 class="ttT">Mudar para Armação</h3><p class="ttP">Armação é contada por cor, sem grau. As peças de cada grau passam para a cor que você escolher.</p>';
      t.g.forEach(function (gr, gi) {
        tot[gr.dest] = (tot[gr.dest] || 0) + gr.n;
        h += '<div class="ttR"><span>' + esc(gr.grau) + '<small>' + esc(gr.cor) + ' · ' + gr.n + ' peças</small></span>' + ttSel('c:' + gi, gr.dest, cs) + '</div>';
      });
      h += '<div class="ttFica">Fica: <b>' + Object.keys(tot).map(function (c) {
        return esc(c) + ' · ' + tot[c] + (tot[c] === 1 ? ' peça' : ' peças');
      }).join(' · ') + '</b></div>';
    }
    if (t.err) h += '<div class="ttErr">' + esc(t.err) + '</div>';
    h += '<button type="button" class="go ttOk" data-act="ttConfirma">Mudar para ' + (t.para === 'pre' ? 'Pré-graduado' : 'Armação') + '</button><button type="button" class="ttCan" data-act="ttCancela">Cancelar</button>';
    var o = lfaAbre('ttFolha', h);
    if (!o._tt) {
      o._tt = 1;
      o.addEventListener('change', ttLe);
      o.addEventListener('input', ttLe);
    }
  }
  function ttLe(e) {
    var t = S.tt,
      k = e.target && e.target.dataset && e.target.dataset.tt;
    if (!t || !k) return;
    var p = k.split(':');
    if (p[0] === 'g') t.g[+p[1]].partes[+p[2]].g = e.target.value;
    else if (p[0] === 'c') {
      t.g[+p[1]].dest = e.target.value;
      if (e.type === 'change') ttDesenha();
    } else if (p[0] === 'n') {
      var gr = t.g[+p[1]],
        v = Math.max(0, parseInt(e.target.value.replace(/\D/g, ''), 10) || 0);
      gr.partes[+p[2]].n = v;
      var outros = gr.partes.reduce(function (a, x, i) {
        return i > 0 ? a + x.n : a;
      }, 0);
      gr.partes[0].n = gr.n - outros;
      if (e.type === 'change') ttDesenha();
    }
  }
  ACT.ttDivide = function (id) {
    var gr = S.tt && S.tt.g[+id];
    if (!gr) return;
    var gs0 = ttGrausDe(),
      ult = gr.partes[gr.partes.length - 1].g,
      prox = gs0[Math.min(gs0.length - 1, gs0.indexOf(ult) + 1)] || ult;
    gr.partes.push({ g: prox, n: 1 });
    gr.partes[0].n = Math.max(0, gr.partes[0].n - 1);
    ttDesenha();
  };
  ACT.ttTira = function (id) {
    var p = String(id).split(':'),
      gr = S.tt && S.tt.g[+p[0]];
    if (!gr) return;
    var x = gr.partes.splice(+p[1], 1)[0];
    gr.partes[0].n += x ? x.n : 0;
    ttDesenha();
  };
  ACT.ttCancela = function () {
    S.tt = null;
    lfaFecha('ttFolha');
  };
  ACT.ttConfirma = function () {
    var t = S.tt;
    if (!t) return;
    t.err = '';
    if (t.para === 'pre') {
      var ruim = t.g.some(function (gr) {
        return gr.partes.some(function (pt) {
          return pt.n < 0;
        });
      });
      if (ruim) {
        t.err = 'A soma dos graus passou do total de peças da cor.';
        return ttDesenha();
      }
    }
    var ref = t.ref,
      velhas = S.items.filter(function (i) {
        return i.ref === ref && i.tipo === t.de;
      }),
      base = velhas[0] || {},
      novas = [];
    var poe = function (cor, grau, n) {
      if (!(n > 0)) return;
      var ja = novas.filter(function (x) {
        return x.cor === cor && x.grau === grau;
      })[0];
      if (ja) return (ja.qty += n);
      var molde = velhas.filter(function (i) {
        return i.cor === cor;
      })[0] || base;
      novas.push(Object.assign({}, molde, { tipo: t.para, ref: ref, cor: cor, grau: grau, qty: n }));
    };
    if (t.para === 'pre') {
      t.g.forEach(function (gr) {
        gr.partes.forEach(function (pt) {
          poe(gr.k, pt.g, pt.n);
        });
      });
    } else {
      t.g.forEach(function (gr) {
        poe(gr.dest, '', gr.n);
      });
    }
    // linhas sem estoque (zeradas) também mudam de tipo, para o modelo não ficar dividido
    velhas.forEach(function (i) {
      if (!(i.qty > 0) && !novas.some(function (x) {
        return x.cor === i.cor;
      })) novas.push(Object.assign({}, i, { tipo: t.para, grau: t.para === 'pre' ? i.grau || '' : '' }));
    });
    S.items = S.items.filter(function (i) {
      return !(i.ref === ref && i.tipo === t.de);
    }).concat(novas);
    S.elog.push({ ts: Date.now(), tipo: t.para, ref: ref, cor: '', grau: '', qty: 0, ajuste: true, motivo: 'Tipo: ' + (t.de === 'pre' ? 'Pré-graduado' : 'Armação') + ' → ' + (t.para === 'pre' ? 'Pré-graduado' : 'Armação') });
    if (S.site && S.site[ref] && typeof vitFila === 'function') vitFila(ref, 'upd');
    S.tipo = t.para;
    S.edTipo = '';
    S.tt = null;
    lfaFecha('ttFolha');
    S.msg = 'Tipo alterado para ' + (t.para === 'pre' ? 'Pré-graduado' : 'Armação') + '.';
    if (typeof saveSoon === 'function') saveSoon();
    render();
    if (typeof lfToast === 'function') lfToast(S.msg);
  };

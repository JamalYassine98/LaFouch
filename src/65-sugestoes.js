  /* ===== Sugestões ao digitar (no lugar da lista nativa do Android, que travava e aparecia torta) ===== */
  var SG = { box: null, inp: null, fn: null, usa: 'v', lista: [] };
  function sgNorm(t) {
    return String(t == null ? '' : t)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }
  function sgCaixa() {
    if (SG.box) return SG.box;
    var b = document.createElement('div');
    b.className = 'sgl';
    b.setAttribute('role', 'listbox');
    b.hidden = true;
    document.body.appendChild(b);
    // tocar numa sugestão preenche o campo sem tirar o foco antes da hora
    b.addEventListener('pointerdown', function (e) {
      var it = e.target.closest && e.target.closest('.sgi');
      if (!it) return;
      e.preventDefault();
      var o = SG.lista[+it.getAttribute('data-i')];
      if (!o || !SG.inp) return;
      var inp = SG.inp;
      inp.value = SG.usa === 'n' && o.n ? o.n : o.v;
      sgEsconde();
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      try {
        inp.blur();
      } catch (er) {}
    });
    window.addEventListener('resize', sgPosiciona);
    window.addEventListener('scroll', sgPosiciona, true);
    SG.box = b;
    return b;
  }
  function sgEsconde() {
    if (SG.box) SG.box.hidden = true;
  }
  function sgPosiciona() {
    var b = SG.box,
      i = SG.inp;
    if (!b || b.hidden || !i) return;
    var r = i.getBoundingClientRect(),
      vh = window.innerHeight,
      abaixo = vh - r.bottom,
      alto = Math.min(b.scrollHeight, 250);
    if (r.bottom < 0 || r.top > vh) return sgEsconde();
    b.style.left = Math.max(8, r.left) + 'px';
    b.style.width = Math.min(r.width, window.innerWidth - 16) + 'px';
    if (abaixo >= alto + 8 || abaixo >= r.top) {
      b.style.top = r.bottom + 4 + 'px';
      b.style.bottom = 'auto';
      b.style.maxHeight = Math.max(90, Math.min(250, abaixo - 12)) + 'px';
    } else {
      b.style.bottom = vh - r.top + 4 + 'px';
      b.style.top = 'auto';
      b.style.maxHeight = Math.max(90, Math.min(250, r.top - 12)) + 'px';
    }
  }
  function sgMostra(inp, fn, usa) {
    var l = [];
    try {
      l = fn(inp.value) || [];
    } catch (e) {}
    var b = sgCaixa();
    if (!l.length || document.activeElement !== inp) return sgEsconde();
    SG.inp = inp;
    SG.fn = fn;
    SG.usa = usa || 'v';
    SG.lista = l;
    b.innerHTML = l
      .map(function (o, i) {
        return '<div class="sgi" role="option" data-i="' + i + '"><b>' + esc(o.t) + '</b>' + (o.s ? '<small>' + esc(o.s) + '</small>' : '') + '</div>';
      })
      .join('');
    b.hidden = false;
    b.scrollTop = 0;
    sgPosiciona();
  }
  // Liga as sugestões a um campo de texto. fn(texto) devolve [{v, t, s, n}].
  function sugestao(inp, fn, usa) {
    if (!inp || inp._sg) return;
    inp._sg = 1;
    inp.setAttribute('autocomplete', 'off');
    inp.addEventListener('input', function () {
      sgMostra(inp, fn, usa);
    });
    inp.addEventListener('focus', function () {
      sgMostra(inp, fn, usa);
    });
    inp.addEventListener('blur', function () {
      setTimeout(function () {
        if (SG.inp === inp) sgEsconde();
      }, 180);
    });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') sgEsconde();
    });
  }
  // Modelos do estoque, um por código.
  function sgModelos() {
    var seen = {},
      out = [];
    S.items.forEach(function (i) {
      if (!i.ref || i.bulk || seen[i.ref]) return;
      seen[i.ref] = 1;
      var its = S.items.filter(function (x) {
          return x.ref === i.ref;
        }),
        t = tipoOf(i.tipo),
        nome = pn(i.ref),
        n = numOf(i.ref),
        cores = its
          .map(function (x) {
            return x.cor;
          })
          .join(' '),
        qtd = its.reduce(function (a, x) {
          return a + (x.qty > 0 ? x.qty : 0);
        }, 0);
      out.push({
        ref: i.ref,
        nome: nome,
        tipo: t && t.label ? t.label : '',
        qtd: qtd,
        hay: sgNorm([i.ref, nome, cores, identTxt(i.ref), (S.desc && S.desc[i.ref]) || '', t && t.label].join(' ')),
        cab: sgNorm([i.ref, nome, n ? '#' + n : ''].join(' '))
      });
    });
    return out;
  }
  // Sugestões de busca (catálogo e vendas): modelos e cores que combinam com o que foi digitado.
  function sugBusca(q) {
    var k = sgNorm(q).trim();
    if (!k) return [];
    var r = [];
    sgModelos().forEach(function (m) {
      var p = m.cab.indexOf(k) === 0 ? 0 : m.cab.indexOf(k) > 0 ? 1 : m.hay.indexOf(k) >= 0 ? 2 : -1;
      if (p < 0) return;
      r.push({ p: p, o: { v: m.ref, n: m.nome, t: m.nome, s: [m.ref !== m.nome ? m.ref : '', m.tipo, m.qtd + ' em estoque'].filter(Boolean).join(' · ') } });
    });
    r.sort(function (a, b) {
      return a.p - b.p || (a.o.t < b.o.t ? -1 : 1);
    });
    var out = r.slice(0, 6).map(function (x) {
      return x.o;
    });
    if (out.length < 8)
      Object.keys(S.palette || {})
        .filter(function (c) {
          return sgNorm(c).indexOf(k) === 0 && sgNorm(c) !== k;
        })
        .slice(0, 2)
        .forEach(function (c) {
          out.push({ v: c, t: c, s: 'cor' });
        });
    return out;
  }
  // Sugestões de código já existente.
  function sugCodigo(q) {
    var k = sgNorm(q).trim();
    if (!k) return [];
    return sgModelos()
      .filter(function (m) {
        return m.hay.indexOf(k) >= 0;
      })
      .sort(function (a, b) {
        return (a.cab.indexOf(k) === 0 ? 0 : 1) - (b.cab.indexOf(k) === 0 ? 0 : 1) || (a.ref < b.ref ? -1 : 1);
      })
      .slice(0, 7)
      .map(function (m) {
        return { v: m.ref, n: m.nome, t: m.ref, s: [m.nome !== m.ref ? m.nome : '', m.tipo].filter(Boolean).join(' · ') };
      });
  }
  function sugLista(arr) {
    return function (q) {
      var k = sgNorm(q).trim();
      return arr()
        .filter(function (v) {
          return sgNorm(v).indexOf(k) >= 0 && sgNorm(v) !== k;
        })
        .slice(0, 6)
        .map(function (v) {
          return { v: v, t: v };
        });
    };
  }
  sugestao($('eRef'), sugCodigo);
  sugestao($('phRef'), sugCodigo);
  sugestao($('q'), sugBusca);
  sugestao($('vq'), sugBusca);

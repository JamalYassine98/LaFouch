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
    // arrastar rola a lista; só um toque (click) escolhe a sugestão. O mousedown não tira o foco do campo.
    b.addEventListener('mousedown', function (e) {
      e.preventDefault();
    });
    b.addEventListener('click', function (e) {
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
      abaixo = vh - r.bottom;
    if (r.bottom < 0 || r.top > vh) return sgEsconde();
    // pouco espaço embaixo (teclado aberto): sobe o campo na tela, em vez de abrir a lista para cima
    if (abaixo < 220 && !SG.aj) {
      SG.aj = 1;
      var falta = Math.min(220 - abaixo, r.top - 70);
      if (falta > 4) {
        window.scrollBy(0, falta);
        r = i.getBoundingClientRect();
        abaixo = vh - r.bottom;
      }
    }
    b.style.left = Math.max(8, r.left) + 'px';
    b.style.width = Math.min(r.width, window.innerWidth - 16) + 'px';
    b.style.top = r.bottom + 4 + 'px';
    b.style.bottom = 'auto';
    b.style.maxHeight = Math.max(100, Math.min(260, abaixo - 12)) + 'px';
  }
  function sgMostra(inp, fn, usa) {
    var l = [];
    try {
      l = fn(inp.value) || [];
    } catch (e) {}
    var b = sgCaixa();
    if (!l.length || document.activeElement !== inp) return sgEsconde();
    if (SG.inp !== inp || b.hidden) SG.aj = 0;
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
        tipoId: i.tipo,
        fmt: String(i.fmt || '').toLowerCase(),
        pub: String(((attrOf(i.ref) || {}).publico) || '').toLowerCase(),
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
  function sugCodigo(q, filtra) {
    var k = sgNorm(q).trim();
    if (!k) return [];
    /* no Novo modelo: só some quem NÃO combina com o formato/gênero que você escolheu; o tipo apenas põe os do mesmo tipo na frente */
    var fT = filtra && S.tipo ? S.tipo : '',
      fF = filtra ? String(S.eFmt || '').toLowerCase() : '',
      fP = filtra ? String(S.ePub || '').toLowerCase() : '';
    return sgModelos()
      .filter(function (m) {
        return m.hay.indexOf(k) >= 0 && (!fF || !m.fmt || m.fmt === fF) && (!fP || !m.pub || m.pub === fP);
      })
      .sort(function (a, b) {
        return (
          (fT && a.tipoId === fT ? 0 : 1) - (fT && b.tipoId === fT ? 0 : 1) ||
          (a.cab.indexOf(k) === 0 ? 0 : 1) - (b.cab.indexOf(k) === 0 ? 0 : 1) ||
          (a.ref < b.ref ? -1 : 1)
        );
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
  sugestao($('eRef'), function (q) {
    return sugCodigo(q, true);
  });
  sugestao($('phRef'), sugCodigo);
  sugestao($('q'), sugBusca);
  sugestao($('vq'), sugBusca);

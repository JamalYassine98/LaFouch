  // ===== Estado global (S), tipos de peça, utilitários de DOM/texto e regras de dados (limpeza, lotes no caixa). =====
  // Tipos de peça base: preço de venda, reposição e custo (US$).
  var TIPOS = [
    {
      id: 'pre',
      label: 'Pré-graduados',
      full: 'Pré-graduados (leitura)',
      price: 25000,
      repUSD: 0.65,
      pago: 0.5
    },
    {
      id: 'sem',
      label: 'Armações',
      full: 'Armações sem grau',
      price: 45000,
      repUSD: 2.4,
      pago: 1.9
    },
    { id: 'solar', label: 'Solares', full: 'Óculos solares', price: 60000, repUSD: 3.0, pago: 2.4 }
  ];
  // Estado único do app; persistido por saveSoon().
  var S = {
    palette: {
      'Preto': '#1f1f1f',
      'Azul': '#2f5fb3',
      'Azul petróleo': '#1f5f6b',
      'Tartaruga': '#8a5a2b',
      'Vinho': '#7a1f3d',
      'Verde': '#2f7a4f',
      'Dourado': '#c9a227',
      'Bege translúcido': '#cdb89a',
      'Transparente': '#cfd8dc',
      'Cinza': '#8b9bb0',
      'Rosa': '#d98aa8',
      'Vermelho': '#b3262e',
      'Marrom': '#6b4423',
      'Prata': '#b8bcc4'
    },
    fotos: {},
    desc: {},
    open: '',
    det: false,
    selItem: null,
    detCor: '',
    photoFor: null,
    P: null,
    tipo: 'pre',
    todos: true,
    q: '',
    fmtF: 'all',
    corF: 'all',
    row: '',
    line: '',
    mode: 'venda',
    qty: 1,
    sold: 0,
    eFmt: '',
    eVar: 'C1',
    addFmt: false,
    tiposX: [],
    tiposDel: [],
    tiposOrd: [],
    pnome: {},
    attr: {},
    site: {},
    cad: {},
    memo: {},
    cadInit: false,
    num: {},
    numNext: 0,
    pnAuto: {},
    descAuto: {},
    colF: '',
    filtOpen: false,
    sortO: '',
    cpay: [],
    eVarP: '',
    nameOpen: '',
    addTipo: false,
    delTipo: '',
    delMode: false,
    pdMode: false,
    pdRef: '',
    cdMode: false,
    cdCor: '',
    cdRef: '',
    vq: '',
    vTipo: 'all',
    vGrau: '',
    vRef: '',
    vSel: null,
    addOpen: false,
    addMode: 'prod',
    lotesView: false,
    repoView: false,
    repQ: {},
    repMix: '',
    repLista: false,
    selSet: [],
    multi: false,
    lotSel: '',
    dpDel: '',
    gDist: '',
    dist: null,
    pEdit: -1,
    pDel: -1,
    pe: {},
    lotPick: {},
    descOpen: false,
    maxVar: 6,
    grp: [
      { id: 'G1', forn: 'Kazwini', tipo: 'pre', qty: 400, usd: 0.5, totalUsd: 200, sold: 0, ts: 0 }
    ],
    gSel: '',
    gEdit: '',
    ge: {},
    lotOpen: false,
    lf: { forn: '', moeda: 'usd', rows: [{ tipo: '', qty: '', usd: '' }] },
    gDel: '',
    qDraft: {},
    cDraft: {},
    qEdit: false,
    qEdRef: '',
    repo: false,
    nt: false,
    nf: '',
    nc: '',
    formats: ['Retangular', 'Quadrado', 'Hexagonal', 'Redondo', 'Gatinho', 'Aviador'],
    items: [
      ['pre', '+0.75', 'SP57765', '', '', 'Retangular', 'Preto', 4],
      ['pre', '+0.75', 'SP58110', '', '', 'Quadrado', 'Preto', 3],
      ['pre', '+1.00', 'SP57765', '', '', 'Retangular', 'Preto', 5],
      ['pre', '+1.00', 'SP60627', '', '', 'Hexagonal', 'Bege translúcido', 3],
      ['pre', '+1.25', 'SP58110', '', '', 'Quadrado', 'Preto', 2],
      ['pre', '+1.25', 'SP57765', '', '', 'Retangular', 'Preto', 6],
      ['pre', '+1.50', 'SP60627', '', '', 'Hexagonal', 'Bege translúcido', 4],
      ['pre', '+1.50', 'SP59002', '', '', 'Redondo', 'Tartaruga', 3],
      ['pre', '+1.75', 'SP57765', '', '', 'Retangular', 'Preto', 5],
      ['pre', '+1.75', 'SP59002', '', '', 'Redondo', 'Tartaruga', 0],
      ['pre', '+2.00', 'SP60627', '', '', 'Hexagonal', 'Bege translúcido', 2],
      ['pre', '+2.00', 'SP58110', '', '', 'Quadrado', 'Preto', 4],
      ['pre', '+2.50', 'SP59002', '', '', 'Redondo', 'Tartaruga', 3],
      ['pre', '+3.50', 'SP60627', '', '', 'Hexagonal', 'Bege translúcido', 1],
      ['sem', '', 'BR44118', '53□18-140', 'C1', 'Quadrado', 'Preto', 3],
      ['sem', '', 'BR44118', '53□18-140', 'C2', 'Quadrado', 'Bege translúcido', 4],
      ['sem', '', 'BR44118', '53□18-140', 'C3', 'Quadrado', 'Tartaruga', 2],
      ['sem', '', 'BR44120', '51□19-140', 'C1', 'Redondo', 'Preto', 5],
      ['sem', '', 'BR44120', '51□19-140', 'C4', 'Redondo', 'Azul petróleo', 3],
      ['sem', '', 'BR44133', '52□17-138', 'C2', 'Gatinho', 'Vinho', 2],
      ['sem', '', 'BR44133', '52□17-138', 'C5', 'Gatinho', 'Transparente', 3],
      ['solar', '', 'SL2201', '58□16-140', 'C1', 'Aviador', 'Preto', 6],
      ['solar', '', 'SL2201', '58□16-140', 'C6', 'Aviador', 'Dourado', 4],
      ['solar', '', 'SL2210', '55□18-145', 'C1', 'Gatinho', 'Preto', 3],
      ['solar', '', 'SL2210', '55□18-145', 'C3', 'Gatinho', 'Tartaruga', 5]
    ].map(function (a) {
      var o = {
        tipo: a[0],
        grau: a[1],
        ref: a[2],
        med: a[3],
        vr: a[4],
        fmt: a[5],
        cor: a[6],
        qty: a[7]
      };
      if (a[0] === 'pre') o.lote = 'G1';
      return o;
    })
  };

  var $ = function (id) {
    return document.getElementById(id);
  };
  var dots = function (n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  var sum = function (a) {
    return a.reduce(function (x, i) {
      return x + i.qty;
    }, 0);
  };
  // Cor da paleta (hex) pelo nome; cinza se desconhecida.
  function hexOf(n) {
    n = String(n || '')
      .trim()
      .toLowerCase();
    var k;
    for (k in S.palette) if (k.toLowerCase() === n) return S.palette[k];
    for (k in S.palette) if (n && n.indexOf(k.toLowerCase()) >= 0) return S.palette[k];
    return '#8b9bb0';
  }
  // Primeira letra maiúscula.
  function cap1(x) {
    x = x.trim();
    return x ? x[0].toUpperCase() + x.slice(1) : x;
  }
  // Normaliza o grau digitado.
  function normGrau(raw) {
    var t = String(raw || '')
      .replace(',', '.')
      .replace(/\s/g, '');
    if (!t) return '';
    if (t[0] === '+' || t[0] === '-') t = t.slice(1);
    if (/^\d{3}$/.test(t)) t = t[0] + '.' + t.slice(1);
    var n = parseFloat(t);
    if (isNaN(n) || n <= 0 || n >= 6) return '';
    return '+' + n.toFixed(2);
  }
  // Cria elemento DOM com classe e texto.
  function mk(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  // Cria botão com classe, texto e ação.
  function btn(cls, txt, fn, pressed) {
    var b = mk('button', cls, txt);
    b.type = 'button';
    if (pressed != null) b.setAttribute('aria-pressed', pressed);
    b.onclick = fn;
    return b;
  }
  // Bolinha colorida (amostra de cor).
  function dot(hex) {
    var d = mk('span', 'dot');
    d.style.background = hex;
    return d;
  }
  // Tipo de peça selecionado.
  function T() {
    return TIPOS.filter(function (t) {
      return t.id === S.tipo;
    })[0];
  }
  // Texto minúsculo e sem acentos, para busca.
  function nrm(v) {
    return String(v == null ? '' : v)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
  // Monta o filtro de busca por palavras.
  function mkMatch(q) {
    var toks = nrm(q).split(/\s+/).filter(Boolean);
    if (!toks.length) return null;
    var tk = toks.map(function (t) {
      return { a: t, b: t.replace(/[^a-z0-9]/g, '') };
    });
    return function (i) {
      var g = String(i.grau || ''),
        tl = tipoOf(i.tipo),
        t1 = nrm(
          [
            i.ref,
            i.cor,
            g,
            g.replace('.', ''),
            g.replace('.', ','),
            i.fmt,
            i.med,
            i.vr,
            tl ? tl.label : '',
            S.desc[i.ref] || '',
            (S.pnome && S.pnome[i.ref]) || '',
            identTxt(i.ref)
          ].join(' ')
        ),
        t2 = t1.replace(/[^a-z0-9]/g, '');
      return tk.every(function (t) {
        return t1.indexOf(t.a) >= 0 || (t.b && t2.indexOf(t.b) >= 0);
      });
    };
  }
  // O tipo usa referência simples (sem código de haste)?
  function isSimple(id) {
    var t = tipoAll().filter(function (x) {
      return x.id === id;
    })[0];
    return !!(t && t.simple);
  }
  // Normaliza o código de referência.
  function normRef(v, simple) {
    v = String(v || '');
    return simple
      ? v.trim().replace(/\s+/g, ' ').toUpperCase()
      : v.replace(/\s+/g, '').toUpperCase();
  }
  var TBASE = TIPOS.slice();
  // Tipos base + tipos criados.
  function tipoAll() {
    return TBASE.concat(S.tiposX || []);
  }

  /* arrastar para reordenar (mouse: arrastar; celular: segurar ~0,4s e arrastar) */
  function makeSortable(box, onDone) {
    box._sortDone = onDone;
    if (box._sortInit) return;
    box._sortInit = true;
    var st = null;
    function items() {
      return [].slice.call(box.children).filter(function (c) {
        return c.dataset && c.dataset.k != null;
      });
    }
    function begin() {
      st.on = true;
      var r0 = st.el.getBoundingClientRect();
      st.ox = st.x - r0.left;
      st.oy = st.y - r0.top;
      st.cx = st.x;
      st.cy = st.y;
      st.el.classList.add('dragging');
      box.classList.add('sorting');
      try {
        st.el.setPointerCapture(st.id);
      } catch (e) {}
      if (navigator.vibrate)
        try {
          navigator.vibrate(15);
        } catch (e) {}
      place();
      if (!REDUCED)
        try {
          st.el.animate(
            [
              { transform: 'translate(' + st.dx + 'px,' + st.dy + 'px) scale(1) rotate(0deg)' },
              {
                transform: 'translate(' + st.dx + 'px,' + st.dy + 'px) scale(1.16) rotate(-3deg)',
                offset: 0.7
              },
              {
                transform: 'translate(' + st.dx + 'px,' + st.dy + 'px) scale(1.12) rotate(-2.5deg)'
              }
            ],
            { duration: 200, easing: 'ease-out' }
          );
        } catch (e) {}
    }
    /* o botão acompanha o dedo: guarda onde ele deveria estar e aplica o deslocamento */
    function place() {
      var el = st.el;
      el.style.transform = 'none';
      var r = el.getBoundingClientRect();
      st.dx = st.cx - st.ox - r.left;
      st.dy = st.cy - st.oy - r.top;
      el.style.transform = 'translate(' + st.dx + 'px,' + st.dy + 'px) scale(1.12) rotate(-2.5deg)';
    }
    function end() {
      if (!st) return;
      clearTimeout(st.tm);
      var was = st.on,
        el = st.el;
      if (was) {
        var from = el.style.transform;
        el.style.transform = '';
        el.classList.remove('dragging');
        box.classList.remove('sorting');
        if (!REDUCED && from)
          try {
            var to = el.getBoundingClientRect(),
              ghost = from;
            el.animate(
              [
                { transform: ghost },
                { transform: 'translate(0,0) scale(.97) rotate(0deg)', offset: 0.65 },
                { transform: 'translate(0,0) scale(1) rotate(0deg)' }
              ],
              { duration: 260, easing: 'cubic-bezier(.3,1.4,.5,1)' }
            );
          } catch (e) {}
        var ks = items().map(function (c) {
          return c.dataset.k;
        });
        if (box._sortDone) box._sortDone(ks);
        box._noClick = Date.now();
      }
      st = null;
    }
    box.addEventListener('pointerdown', function (e) {
      if (e.button > 0 || box.dataset.nosort === '1') return;
      var el = e.target.closest ? e.target.closest('[data-k]') : null;
      if (!el || el.parentNode !== box) return;
      st = {
        el: el,
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        on: false,
        touch: e.pointerType !== 'mouse',
        tm: 0
      };
      if (st.touch)
        st.tm = setTimeout(function () {
          if (st && !st.on) begin();
        }, 380);
    });
    box.addEventListener('pointermove', function (e) {
      if (!st || e.pointerId !== st.id) return;
      var d = Math.abs(e.clientX - st.x) + Math.abs(e.clientY - st.y);
      if (!st.on) {
        if (!st.touch && d > 6) begin();
        else if (st.touch && d > 10) {
          clearTimeout(st.tm);
          st = null;
        }
        return;
      }
      e.preventDefault();
      var its = items(),
        el = st.el,
        hit = null;
      its.forEach(function (c) {
        if (c === el) return;
        var r = c.getBoundingClientRect();
        if (
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top - 4 &&
          e.clientY <= r.bottom + 4
        )
          hit = c;
      });
      st.cx = e.clientX;
      st.cy = e.clientY;
      if (hit) {
        var a = its.indexOf(el),
          b = its.indexOf(hit),
          pre = null;
        if (!REDUCED) {
          pre = its.map(function (c) {
            var r = c.getBoundingClientRect();
            return [c, r.left, r.top];
          });
        }
        if (a < b) box.insertBefore(el, hit.nextSibling);
        else box.insertBefore(el, hit);
        if (pre)
          pre.forEach(function (q) {
            if (q[0] === el) return;
            var r = q[0].getBoundingClientRect(),
              dx = q[1] - r.left,
              dy = q[2] - r.top;
            if (dx || dy)
              try {
                q[0].animate(
                  [{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }],
                  { duration: 180, easing: 'cubic-bezier(.2,.8,.2,1)' }
                );
              } catch (e) {}
          });
      }
      place();
    });
    box.addEventListener('pointerup', end);
    box.addEventListener('pointercancel', end);
    box.addEventListener(
      'touchmove',
      function (e) {
        if (st && st.on && e.cancelable) e.preventDefault();
      },
      { passive: false }
    );
    box.addEventListener('contextmenu', function (e) {
      if (e.target.closest && e.target.closest('[data-k]')) e.preventDefault();
    });
    box.addEventListener(
      'click',
      function (e) {
        if (box._noClick && Date.now() - box._noClick < 400) {
          e.stopPropagation();
          e.preventDefault();
          box._noClick = 0;
        }
      },
      true
    );
  }
  // Reordena um subconjunto mantendo as posições ocupadas.
  function reorderBy(arr, ks) {
    /* ks = nova ordem de um subconjunto de arr; ocupa as mesmas posições */ var pos = [];
    arr.forEach(function (v, i) {
      if (ks.indexOf(v) >= 0) pos.push(i);
    });
    var out = arr.slice();
    pos.forEach(function (p, j) {
      out[p] = ks[j];
    });
    return out;
  }
  // Nome amigável de um código (ou o próprio código).
  function pn(ref) {
    return (S.pnome && S.pnome[ref]) || pubNome(ref);
  }
  // Grava o nome amigável de um código.
  function setPN(ref, n) {
    n = String(n || '').trim();
    if (ref && n) {
      if (!S.pnome) S.pnome = {};
      S.pnome[ref] = n;
    }
  }
  function fmtCat(sel) {
    return S.formats.filter(function (f) {
      return (
        f === sel ||
        S.items.some(function (i) {
          return i.fmt === f;
        })
      );
    });
  }
  // Arredonda para 2 casas.
  function r2(n) {
    return Math.round(n * 100) / 100;
  }
  // Lança no caixa o pagamento de um lote.
  function lotCharge(g) {
    var cur = g.moeda || 'usd',
      amt = g.custoOrig != null ? g.custoOrig : g.totalUsd;
    if (!(amt > 0)) return;
    S.cash[cur] = r2((S.cash[cur] || 0) - amt);
    lancarCompra({
      ts: Date.now(),
      desc: g.forn + ' (' + g.qty + ' peças)',
      usd: g.totalUsd,
      lot: g.id,
      cur: cur,
      orig: amt
    });
    if (S.cash[cur] < 0)
      popErr(
        'Saldo em ' +
          { usd: 'dólares', pyg: 'guaranis', brl: 'reais' }[cur] +
          ' ficou negativo após registrar o lote. Corrija o saldo em "Corrigir saldos".'
      );
  }
  // Estorna do caixa o pagamento de um lote.
  function lotRefund(g) {
    var e = S.compras.filter(function (x) {
      return x.lot === g.id;
    })[0];
    if (!e) return;
    var rem = g.custoOrig != null ? g.custoOrig : e.orig,
      rf = Math.min(e.orig, rem);
    S.cash[e.cur] = r2((S.cash[e.cur] || 0) + rf);
    if (e.orig - rf <= 0.000001)
      S.compras = S.compras.filter(function (x) {
        return x !== e;
      });
    else {
      e.usd = (e.usd * (e.orig - rf)) / e.orig;
      e.orig -= rf;
    }
  }
  /* histórico de custo por lote: junta lotes antigos (S.lotes) com os lotes reais do estoque (S.grp), sem duplicar */
  function lotesHist() {
    var o = (S.lotes || []).map(function (l) {
      return { id: l.id, ts: l.ts, usd: l.usd, txt: l.txt };
    });
    (S.grp || []).forEach(function (g) {
      if (g.ts > 0 && g.qty > 0) {
        var u = gUnit(g);
        if (u > 0) o.push({ id: g.id, ts: g.ts, usd: u, txt: g.forn + (g.tipo ? '' : '') });
      }
    });
    o.sort(function (a, b) {
      return a.ts - b.ts;
    });
    return o;
  }
  /* junta linhas repetidas do estoque (mesmo código, grau, cor, variação, lote e custo): soma as peças */
  /* limpeza do banco: tira registros repetidos (mesmo conteúdo) e sobras sem uso. Roda ao abrir o app e é segura: só remove cópias idênticas. */
  function cleanDb() {
    var n = 0;
    function uniq(arr, kf) {
      var seen = {},
        o = [];
      (arr || []).forEach(function (x) {
        var k;
        try {
          k = kf(x);
        } catch (e) {
          k = null;
        }
        if (k === null || k === undefined) {
          o.push(x);
          return;
        }
        if (seen[k]) {
          n++;
          return;
        }
        seen[k] = 1;
        o.push(x);
      });
      return o;
    }
    var js = function (x) {
      return JSON.stringify(x);
    };
    ['dlog', 'elog', 'cambios', 'compras', 'melhUso', 'imprev', 'cpay'].forEach(function (k) {
      if (Array.isArray(S[k])) S[k] = uniq(S[k], js);
    });
    if (Array.isArray(S.sales))
      S.sales = uniq(S.sales, function (x) {
        return x.id ? String(x.id) : null;
      });
    if (Array.isArray(S.exp))
      S.exp = uniq(S.exp, function (x) {
        return x.id != null ? 'e' + x.id : null;
      });
    if (Array.isArray(S.grp))
      S.grp = uniq(S.grp, function (x) {
        return x.id ? String(x.id) : null;
      });
    if (Array.isArray(S.lotes)) {
      var gid = {};
      (S.grp || []).forEach(function (g) {
        gid[g.id] = 1;
      });
      S.lotes = uniq(S.lotes, function (x) {
        return x.id ? String(x.id) : null;
      });
      var l0 = S.lotes.length;
      S.lotes = S.lotes.filter(function (x) {
        return !gid[x.id];
      });
      n += l0 - S.lotes.length;
    }
    if (Array.isArray(S.fxHist)) {
      var fs = {};
      S.fxHist = S.fxHist.filter(function (x) {
        var k = js(x);
        if (fs[k]) {
          n++;
          return false;
        }
        fs[k] = 1;
        return true;
      });
    }
    /* nomes e descrições de código que não existem mais em lugar nenhum (nem estoque, nem venda) */
    try {
      var used = {};
      (S.items || []).forEach(function (i) {
        if (i.ref) used[i.ref] = 1;
      });
      (S.sales || []).forEach(function (v) {
        if (v.ref) used[v.ref] = 1;
      });
      (S.elog || []).forEach(function (v) {
        if (v.ref) used[v.ref] = 1;
      });
      ['pnome', 'desc'].forEach(function (k) {
        var o = S[k];
        if (!o) return;
        Object.keys(o).forEach(function (r) {
          if (!used[r]) {
            delete o[r];
            n++;
          } else if (!String(o[r] || '').trim()) {
            delete o[r];
            n++;
          }
        });
      });
    } catch (e) {}
    return n;
  }
  // Junta itens duplicados do estoque.
  function dedupeItems() {
    var seen = {},
      out = [],
      n = 0;
    (S.items || []).forEach(function (i) {
      var k = [
          i.tipo,
          i.ref,
          i.grau || '',
          i.cor || '',
          i.vr || '',
          i.lote || '',
          i.fmt || '',
          i.med || '',
          i.bulk ? 1 : 0,
          i.custo == null ? '' : i.custo
        ].join('|'),
        f = seen[k];
      if (f) {
        f.qty += i.qty;
        n++;
      } else {
        seen[k] = i;
        out.push(i);
      }
    });
    if (n) S.items = out;
    return n;
  }
  // Ajusta o caixa quando o custo do lote é editado.
  function lotAdjust(g, oM, oO) {
    var e = S.compras.filter(function (x) {
      return x.lot === g.id;
    })[0];
    if (!e) return;
    var cur = g.moeda || 'usd',
      amt = g.custoOrig != null ? g.custoOrig : g.totalUsd;
    if (cur === oM) {
      var d = amt - oO;
      S.cash[cur] = r2((S.cash[cur] || 0) - d);
      e.orig = Math.max(0, e.orig + d);
    } else {
      S.cash[oM] = r2((S.cash[oM] || 0) + Math.min(e.orig, oO));
      S.cash[cur] = r2((S.cash[cur] || 0) - amt);
      e.cur = cur;
      e.orig = amt;
    }
    e.usd = (e.usd || 0) + 0;
    e.desc = g.forn + ' (' + g.qty + ' peças)';
  }
  // Atualiza TIPOS (base + criados − removidos).
  function syncTipos() {
    TIPOS.length = 0;
    tipoAll().forEach(function (t) {
      if ((S.tiposDel || []).indexOf(t.id) < 0) TIPOS.push(t);
    });
    var od = S.tiposOrd || [];
    if (od.length)
      TIPOS.sort(function (a, b) {
        var x = od.indexOf(a.id),
          y = od.indexOf(b.id);
        return (x < 0 ? 999 : x) - (y < 0 ? 999 : y);
      });
    if (
      !TIPOS.some(function (t) {
        return t.id === S.tipo;
      })
    )
      S.tipo = TIPOS[0] ? TIPOS[0].id : 'sem';
  }
  // Define a mensagem de aviso.
  function say(t) {
    S.msg = t;
  }

  // Foto de um código (e cor).
  function photoOf(ref, cor) {
    var its = S.items.filter(function (i) {
      return i.ref === ref;
    });
    if (cor) return S.fotos[ref + '|' + cor] || '';
    var w =
      its.filter(function (i) {
        return i.qty > 0 && S.fotos[ref + '|' + i.cor];
      })[0] ||
      its.filter(function (i) {
        return S.fotos[ref + '|' + i.cor];
      })[0];
    return w ? S.fotos[ref + '|' + w.cor] : '';
  }
  // Quadro de foto (ou vazio).
  function photoBox(src, cls) {
    var d = mk('div', cls + (src ? '' : ' none'));
    if (!src) d.hidden = true;
    if (src) {
      var im = mk('img');
      im.src = src;
      im.alt = 'Foto do produto';
      d.appendChild(im);
    }
    return d;
  }
  // Descrição automática de um código.
  // Sugestão de descrição a partir da foto: tipo + cor que o app enxergou (o resto você completa).
  function descSugerida(tipo, cor) {
    var base = tipo === 'pre' ? 'Óculos de leitura' : tipo === 'solar' ? 'Óculos solar' : 'Armação',
      c = String(cor || '').trim();
    return base + (c && c !== 'Sem cor' ? ' ' + c.toLowerCase() : '') + '.';
  }
  function autoDesc(ref) {
    var its = S.items.filter(function (i) {
        return i.ref === ref;
      }),
      f = its[0];
    if (!f) return '';
    if (f.bulk)
      return (
        'Peças do lote ainda sem detalhar (' +
        (tipoOf(f.tipo) || { label: '' }).label +
        '). Dá para vender direto; detalhe formato, grau e cor quando quiser.'
      );
    var cores = Array.from(
      new Set(
        its
          .filter(function (i) {
            return i.qty > 0;
          })
          .map(function (i) {
            return i.cor;
          })
      )
    );
    if (f.tipo === 'pre') {
      var g = its
        .map(function (i) {
          return parseFloat(i.grau);
        })
        .sort(function (a, b) {
          return a - b;
        });
      return (
        'Óculos de leitura pré-graduado' +
        (f.fmt ? ', formato ' + f.fmt : '') +
        '. Graus de +' +
        g[0].toFixed(2) +
        ' a +' +
        g[g.length - 1].toFixed(2) +
        '.'
      );
    }
    if (isSimple(f.tipo)) {
      var cs = cores.filter(function (c) {
        return c !== 'Sem cor';
      });
      return (
        tipoOf(f.tipo).label +
        (cs.length ? '. ' + (cs.length === 1 ? 'Cor: ' : 'Cores: ') + cs.join(', ') + '.' : '.')
      );
    }
    return (
      (f.tipo === 'solar' ? 'Óculos solar' : 'Armação sem grau') +
      (f.fmt ? ', formato ' + f.fmt : '') +
      (f.med ? ', medidas ' + f.med : '') +
      '. ' +
      cores.length +
      (cores.length === 1 ? ' cor disponível.' : ' cores disponíveis.')
    );
  }
  var REDUCED = false;
  try {
    REDUCED = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (e) {}
  // Anima a entrada de um elemento.
  function animEnter(el) {
    if (REDUCED || !el) return;
    try {
      el.classList.remove('enter');
      void el.offsetWidth;
      el.classList.add('enter');
      el.addEventListener('animationend', function f() {
        el.classList.remove('enter');
        el.removeEventListener('animationend', f);
      });
      if (typeof animGraficos === 'function') animGraficos(el);
    } catch (e) {}
  }

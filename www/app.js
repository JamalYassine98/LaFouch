(function () {
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
  var FX = 6500,
    LOTE = 400;
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
    vRef: '',
    vSel: null,
    addOpen: false,
    addMode: 'prod',
    lotesView: false,
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
    if (src) {
      var im = mk('img');
      im.src = src;
      im.alt = 'Foto do produto';
      d.appendChild(im);
    } else d.textContent = 'Sem foto';
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
    } catch (e) {}
  }
  // ===== Movimentos: todo fato de dinheiro ou estoque é gravado por aqui (livro + histórico juntos). =====
  // Formato do registro do histórico (S.dlog) de uma compra de mercadoria.
  function dlogLote(x) {
    return { ts: x.ts, kind: 'lote', desc: x.desc, usd: x.usd };
  }
  // Formato do registro do histórico de um uso da caixa de melhorias.
  function dlogMelh(x) {
    return { ts: x.ts, kind: 'melh', desc: x.desc, valor: x.valor };
  }
  // Formato do registro do histórico de um gasto imprevisto.
  function dlogImp(x) {
    return { ts: x.ts, kind: 'imp', desc: x.desc, valor: x.valor };
  }
  // Compra de mercadoria: entra no livro de compras (S.compras) e no histórico.
  function lancarCompra(c) {
    S.compras.push(c);
    S.dlog.push(dlogLote(c));
  }
  // Uso da caixa de melhorias: livro (S.melhUso) e histórico.
  function lancarMelhoria(desc, valor) {
    var x = { ts: Date.now(), desc: desc, valor: valor };
    S.melhUso.push(x);
    S.dlog.push(dlogMelh(x));
  }
  // Gasto imprevisto: livro (S.imprev) e histórico.
  function lancarImprevisto(desc, valor) {
    var x = { ts: Date.now(), desc: desc, valor: valor };
    S.imprev.push(x);
    S.dlog.push(dlogImp(x));
  }
  // Conta mensal paga: livro de pagamentos (S.cpay) e histórico.
  function lancarPagamento(e, ym, ts) {
    S.cpay.push({
      ts: ts,
      id: e.id,
      ym: ym,
      nome: e.nome,
      valor: e.valor,
      cat: e.cat,
      moeda: expMoeda(e),
      orig: expOrig(e)
    });
    S.dlog.push({
      ts: ts,
      kind: 'pago',
      nome: e.nome,
      desc: e.nome + ' (' + CATS[e.cat] + ')',
      valor: e.valor,
      moeda: expMoeda(e),
      orig: expOrig(e)
    });
  }
  // Desfaz o pagamento de uma conta no mês: tira do livro e do histórico.
  function desfazerPagamento(e, ym, ts) {
    S.cpay = S.cpay.filter(function (x) {
      return !(x.id === e.id && x.ym === ym);
    });
    S.dlog = S.dlog.filter(function (x) {
      return !(x.kind === 'pago' && x.ts === ts && x.nome === e.nome);
    });
  }
  // Alteração, remoção ou criação de despesa fixa: só histórico.
  function logDespesa(kind, campos) {
    S.dlog.push(Object.assign({ ts: Date.now(), kind: kind }, campos));
  }
  // Entrada de peças no histórico do estoque (S.elog).
  function entradaEstoque(tipo, ref, cor, grau, qty) {
    S.elog.push({ ts: Date.now(), tipo: tipo, ref: ref, cor: cor, grau: grau, qty: qty });
  }
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
    return (isSimple(i.tipo) ? '' : (i.tipo === 'pre' ? i.grau : i.vr) + (i.cor === 'Sem cor' ? '' : ' · ')) + (isSimple(i.tipo) || i.cor !== 'Sem cor' ? i.cor : '');
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
        (numOf(ref) ? 'Nº ' + numOf(ref) + ' · ' : '') +
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
        (f.tipo === 'pre' ? 'Graus' : isSimple(f.tipo) ? 'Itens' : 'Cores') + ' · estoque' + (f.tipo === 'pre' && rows.length > 1 && rows.every(function (x) { return x.cor === rows[0].cor; }) && rows[0].cor !== 'Sem cor' ? ' · ' + rows[0].cor : '')
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
        (corUnica ? i.grau : rowLabel(i)) + (venda ? '' : effCusto(i) != null ? ' · custo ' + usd(effCusto(i)) : ' · sem custo')
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
      if (!smp && !f.bulk) {
        var idh = mk('div', 'col'),
          idc = Object.assign({}, attrOf(ref));
        idh.id = 'edIdent';
        idh.style.gap = '10px';
        identBox(idh, idc, function () {
          setAttr(ref, Object.assign({ marca: '', material: '', publico: '', colecao: '' }, idc));
        });
        bx.appendChild(idh);
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
      if (!f.bulk && !smp) bx.appendChild(descarteBox(ref));
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
    var rk = function (i) {
        return isPre ? i.grau : i.ref;
      },
      lk = function (i) {
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
    $('k3').textContent = lowK.length;
    var lpn = S.grp.filter(function (g) {
      return grpFalta(g) > 0;
    }).length;
    $('kLotN').textContent = lpn;
    $('kLot').setAttribute('aria-pressed', !!S.lotesView);
    $('kLot').style.outline = S.lotesView ? '2px solid var(--accent)' : '';
    $('kRepo').setAttribute('aria-pressed', !!S.repo);
    $('kRepo').style.outline = S.repo ? '2px solid var(--warn)' : '';
    $('k3h').textContent = 'produtos que vão acabar logo · toque para ver';

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
    var fc = $('fCols'),
      cl = colecoes();
    fc.textContent = '';
    $('fColB').hidden = !cl.length;
    ['']
      .concat(cl)
      .forEach(function (c) {
        fc.appendChild(
          btn(
            'chip' + ((S.colF || '') === c ? ' on' : ''),
            c || 'Todas',
            function () {
              S.colF = c;
              render();
            },
            (S.colF || '') === c
          )
        );
      });
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

  // ===== Estoque: painéis de filtro, lista de códigos e abertura/fechamento do cadastro. =====
  $('mV').onclick = function () {
    S.mode = 'venda';
    S.qty = 1;
    S.msg = '';
    render();
  };
  $('mE').onclick = function () {
    S.mode = 'entrada';
    S.qty = 1;
    S.msg = '';
    render();
  };
  // Campo numérico de quantidade (mín. 1).
  function qIn(id, get, set, cap) {
    var e = $(id);
    e.onchange = function () {
      var n = parseInt(String(e.value).replace(/\D/g, ''), 10);
      if (!(n >= 1)) n = 1;
      n = Math.min(n, cap());
      set(n);
      render();
    };
    e.onkeydown = function (ev) {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        e.blur();
      }
    };
    e.onfocus = function () {
      try {
        e.select();
      } catch (x) {}
    };
  }
  qIn(
    'qv',
    null,
    function (n) {
      S.qty = n;
      S.msg = '';
    },
    function () {
      return S._cap || 99999;
    }
  );
  qIn(
    'sqv',
    null,
    function (n) {
      S.qty = n;
      S.msg = '';
    },
    function () {
      return S._vcap || 1;
    }
  );
  qIn(
    'phQ',
    null,
    function (n) {
      if (P) P.qty = n;
    },
    function () {
      return 99999;
    }
  );
  $('mn').onclick = function () {
    S.qty = Math.max(1, S.qty - 1);
    S.msg = '';
    render();
  };
  $('pl').onclick = function () {
    S.qty = Math.max(1, Math.min(S._cap, S.qty + 1));
    S.msg = '';
    render();
  };
  $('q').oninput = function (e) {
    S.q = e.target.value;
    S.open = '';
    S.det = false;
    S.selItem = null;
    render();
  };
  ['eRef', 'eGrau', 'eCor'].forEach(function (id) {
    $(id).oninput = render;
  });
  /* sugestões de códigos que já existem + preencher sozinho quando o código digitado já está no estoque */
  var RL = document.createElement('datalist');
  RL.id = 'refList';
  document.body.appendChild(RL);
  $('eRef').setAttribute('list', 'refList');
  $('phRef').setAttribute('list', 'refList');
  $('eRef').setAttribute('autocomplete', 'off');
  $('phRef').setAttribute('autocomplete', 'off');
  var RLSIG = '';
  // Atualiza a lista de códigos (autocompletar).
  function refreshRefList() {
    var seen = {},
      arr = [];
    S.items.forEach(function (i) {
      if (i.ref && !seen[i.ref]) {
        seen[i.ref] = 1;
        arr.push(i);
      }
    });
    var sig =
      arr.length +
      '|' +
      arr
        .map(function (i) {
          return i.ref + ((S.pnome && S.pnome[i.ref]) || '');
        })
        .join(',');
    if (sig === RLSIG) return;
    RLSIG = sig;
    RL.textContent = '';
    arr
      .sort(function (x, y) {
        return x.ref < y.ref ? -1 : 1;
      })
      .forEach(function (i) {
        var o = document.createElement('option');
        o.value = i.ref;
        var t = tipoOf(i.tipo);
        o.label =
          (S.pnome && S.pnome[i.ref] ? S.pnome[i.ref] + ' · ' : '') + (t && t.label ? t.label : '');
        RL.appendChild(o);
      });
  }
  // Primeira peça do estoque com o código informado.
  function refItem(v) {
    v = normRef(v, false);
    return v
      ? S.items.filter(function (i) {
          return i.ref && i.ref.toUpperCase() === v;
        })[0]
      : null;
  }
  $('eRef').addEventListener('input', function () {
    var it = refItem(this.value),
      v = it ? it.ref.toUpperCase() : '';
    if (!it) {
      S.eRefFill = '';
      return;
    }
    if (v === S.eRefFill) return;
    S.eRefFill = v;
    fillAdd(
      Object.assign(refInfo(it.ref), {
        ref: it.ref,
        tipo: it.tipo,
        med: it.med,
        fmt: it.fmt,
        vr: it.vr,
        noscroll: 1
      })
    );
  });
  $('phRef').addEventListener('input', function () {
    var it = refItem(this.value);
    if (it) {
      var ri = refInfo(it.ref);
      if (it.med && !$('phMed').value.trim()) $('phMed').value = it.med;
      if (ri.nome && !$('phNome').value.trim()) $('phNome').value = ri.nome;
      if (ri.custo && !$('phCusto').value.trim()) $('phCusto').value = ri.custo;
      render();
    }
  });
  $('eMed').oninput = function () {};
  $('btnAddFmt').onclick = function () {
    var raw = $('newFmt').value.trim();
    if (!raw) return;
    var n = raw[0].toUpperCase() + raw.slice(1);
    if (
      S.formats.some(function (f) {
        return f.toLowerCase() === n.toLowerCase();
      })
    ) {
      S.msg = 'Esse formato já existe.';
      render();
      return;
    }
    S.formats.push(n);
    S.eFmt = n;
    $('newFmt').value = '';
    S.addFmt = false;
    S.msg = 'Formato "' + n + '" criado. Use-o numa entrada.';
    render();
  };
  $('go').onclick = function () {
    var t = T(),
      isPre = S.tipo === 'pre',
      qty = S.qty;
    var cor = $('eCor').value.trim() || 'Sem cor',
      ref = S._ref;
    if (!ref) {
      say('Informe a referência da peça.');
      render();
      return;
    }
    if (S._other && !S._known) {
      say(
        ref +
          ' já existe em ' +
          TIPOS.filter(function (x) {
            return x.id === S._other.tipo;
          })[0].full +
          '. Mude para essa aba para dar entrada, assim não vira produto novo.'
      );
      render();
      return;
    }
    if (!cor) {
      say('Informe a cor real da peça.');
      render();
      return;
    }
    if (isPre && !S._gn) {
      say('Informe um grau válido.');
      render();
      return;
    }
    var gr = pickG(S.tipo, S.gSel);
    if (gr.err) {
      say(gr.err);
      render();
      return;
    }
    var gcap = gCap(gr.g, qty);
    if (gcap) {
      popErr(gcap);
      return;
    }
    var gid = gr.g ? gr.g.id : '';
    var ccv = $('eCusto').value.trim(),
      cu = ccv === '' ? null : parseFloat(ccv.replace(',', '.')),
      noCost = cu == null && !gr.g;
    if (!gr.g && !(cu > 0)) {
      popErr(
        'Informe o custo por peça em US$, ou escolha o lote de origem. Sem lote, o custo é obrigatório.'
      );
      return;
    }
    if (ccv !== '' && !(cu >= 0)) {
      say('Custo inválido. Use um número em US$ (ex.: 0,50) ou deixe vazio.');
      render();
      return;
    }
    var corN = cor[0].toUpperCase() + cor.slice(1),
      pk = Object.keys(S.palette).filter(function (k) {
        return k.toLowerCase() === corN.toLowerCase();
      })[0];
    if (pk) corN = pk;
    if (
      !Object.keys(S.palette).some(function (k) {
        return k.toLowerCase() === corN.toLowerCase();
      })
    )
      S.palette[corN] = '#8b9bb0';
    var ex = S.items.filter(function (x) {
      return (
        x.tipo === S.tipo &&
        x.ref.toUpperCase() === ref &&
        (isPre
          ? x.grau === S._gn && (x.vr || '') === (S.eVarP || '')
          : x.vr === (t.simple ? '' : S.eVar)) &&
        x.cor.toLowerCase() === corN.toLowerCase() &&
        (x.lote || '') === gid &&
        (cu == null || x.custo == null || x.custo === cu)
      );
    })[0];
    if (gr.g && cu != null) {
      var ce = gCostErr(
        gr.g,
        ex && ex.custo == null ? cu * (ex.qty + qty) : cu * qty,
        null,
        cu,
        qty
      );
      if (ce) {
        popErr(ce);
        return;
      }
    }
    if (!t.simple) setPN(ref, $('eNome').value);
    $('eNome').value = '';
    var dd = $('eDescP').value.trim();
    if (dd && (!S.desc[ref] || !S._known)) S.desc[ref] = dd;
    $('eDescP').value = '';
    if (ex) {
      ex.qty += qty;
      if (ex.custo == null && cu != null) ex.custo = cu;
    } else
      S.items.push({
        custo: cu == null ? undefined : cu,
        lote: gid || undefined,
        tipo: S.tipo,
        grau: isPre ? S._gn : '',
        ref: ref,
        med:
          isPre || t.simple ? '' : S._known && S._known.med ? S._known.med : $('eMed').value.trim(),
        vr: t.simple ? '' : isPre ? S.eVarP || '' : S.eVar,
        fmt: S._fmtUsed || '',
        cor: corN,
        qty: qty
      });
    $('eCusto').value = '';
    if (S.eFaixa) S.pfaixa[ref] = S.eFaixa;
    S.eFaixa = '';
    entradaEstoque(S.tipo, ref, corN, isPre ? S._gn : '', qty);
    say(
      'Entrada registrada: +' +
        qty +
        ' × ' +
        ref +
        ' ' +
        corN +
        (isPre ? ' (' + S._gn + ')' : t.simple ? '' : ' (' + S.eVar + ')') +
        (noCost ? ' Atenção: este produto ainda está sem preço de custo detalhado.' : '')
    );
    S.qty = 1;
    render();
  };
  var FSNAP = null,
    FKEYS = [
      'todos',
      'tipo',
      'multi',
      'sortO',
      'fmtF',
      'corF',
      'q',
      'open',
      'det',
      'lotesView',
      'repo',
      'faixaF',
      'colF'
    ];
  // Fecha os filtros (cancelar restaura o estado).
  function filtClose(cancel) {
    if (cancel && FSNAP) {
      FKEYS.forEach(function (k) {
        S[k] = FSNAP[k];
      });
      S.selSet = FSNAP.selSet.slice();
      $('q').value = S.q || '';
    }
    FSNAP = null;
    S.filtOpen = false;
    render();
  }
  $('btnFilt').onclick = function () {
    if (S.filtOpen) {
      filtClose(true);
      return;
    }
    FSNAP = { selSet: (S.selSet || []).slice() };
    FKEYS.forEach(function (k) {
      FSNAP[k] = S[k];
    });
    S.filtOpen = true;
    render();
  };
  $('filtApply').onclick = function () {
    filtClose(false);
  };
  $('filtCancel').onclick = function () {
    filtClose(true);
  };
  $('filtPanel').addEventListener('click', function (e) {
    if (e.target === $('filtPanel')) filtClose(true);
  });
  var LSNAP = null;
  $('kLot').onclick = function () {
    if (S.lotesView) {
      S.lotesView = false;
      if (LSNAP) {
        S.todos = LSNAP.todos;
        S.tipo = LSNAP.tipo;
        S.selSet = LSNAP.selSet;
        S.fmtF = LSNAP.fmtF;
        S.corF = LSNAP.corF;
        S.q = LSNAP.q;
        LSNAP = null;
      } else S.todos = false;
      S.msg = '';
      render();
      return;
    }
    LSNAP = {
      todos: S.todos,
      tipo: S.tipo,
      selSet: (S.selSet || []).slice(),
      fmtF: S.fmtF,
      corF: S.corF,
      q: S.q
    };
    S.lotesView = true;
    S.repo = false;
    S.todos = false;
    S.lotSel = '';
    S.lotPick = {};
    S.det = false;
    S.open = '';
    S.msg = '';
    S.pdMode = false;
    render();
  };
  $('kRepo').onclick = function () {
    S.repo = !S.repo;
    if (S.repo) S.lotesView = false;
    S.open = '';
    S.det = false;
    S.selItem = null;
    S.msg = '';
    render();
    if (S.repo) {
      var l = $('rows');
      if (l) l.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  try {
    $('eMedB').parentNode.appendChild($('eGrauB'));
  } catch (e) {}
  $('btnAdd').onclick = function () {
    ASNAP = { selSet: (S.selSet || []).slice() };
    AKEYS.forEach(function (k) {
      ASNAP[k] = S[k];
    });
    $('eNome').value = '';
    S.gSel = '';
    S.addOpen = true;
    S.addMode = 'prod';
    S.photoFor = null;
    try {
      $('fbCk').checked = S.fundoBranco !== false;
    } catch (e) {}
    S.msg = '';
    render();
  };
  $('lotModal').addEventListener('mousedown', function (e) {
    if (e.target === $('lotModal')) {
      S.gEdit = '';
      S.gDist = '';
      render();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !$('lotModal').hidden) {
      S.gEdit = '';
      S.gDist = '';
      render();
    } else if (e.key === 'Escape' && !$('descModal').hidden) {
      S.descOpen = false;
      render();
    }
  });
  $('descModal').addEventListener('mousedown', function (e) {
    if (e.target === $('descModal')) {
      S.descOpen = false;
      render();
    }
  });
  var ASNAP = null,
    AKEYS = ['tipo', 'todos', 'fmtF', 'corF', 'q', 'open', 'det', 'selItem', 'lotesView'];
  // Fecha o cadastro (cancelar restaura o estado).
  function closeAdd() {
    if (ASNAP) {
      AKEYS.forEach(function (k) {
        S[k] = ASNAP[k];
      });
      S.selSet = ASNAP.selSet.slice();
      try {
        $('q').value = S.q || '';
      } catch (e) {}
      ASNAP = null;
    }
    S.fromLot = '';
    S.addOpen = false;
    P = null;
    B = null;
    Q = [];
    S.photoFor = null;
    render();
  }
  $('addClose').onclick = closeAdd;
  $('addModal').addEventListener('mousedown', function (e) {
    if (e.target === $('addModal')) closeAdd();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !$('addModal').hidden) closeAdd();
  });
  $('btnTrashP').onclick = function () {
    if (S.pdMode) {
      S.pdMode = false;
      S.pdRef = '';
      render();
      return;
    }
    var ok =
      S.open &&
      S.det &&
      S.items.some(function (i) {
        return i.tipo === S.tipo && i.ref === S.open && !i.bulk;
      });
    if (!ok) {
      S.msg = 'Toque em um produto e depois na lixeira para excluí-lo.';
      render();
      return;
    }
    S.pdMode = true;
    S.pdRef = S.open;
    S.msg = '';
    render();
  };
  $('btnMulti').onclick = function () {
    S.multi = !S.multi;
    if (!S.multi) {
      if (S.todos && S.selSet && S.selSet.length > 1) {
        S.todos = false;
        S.tipo = S.selSet[0];
        S.selSet = [];
        S.open = '';
        S.det = false;
      }
      var fs = fSel();
      if (fs.length > 1) S.fmtF = fs[0];
    }
    render();
  };
  $('btnTrash').onclick = function () {
    if (S.delMode) {
      S.delMode = false;
      S.delTipo = '';
      render();
      return;
    }
    if (
      S.todos ||
      S.lotesView ||
      !TIPOS.some(function (x) {
        return x.id === S.tipo;
      })
    ) {
      S.msg = 'Toque em um tipo e depois na lixeira para excluí-lo.';
      render();
      return;
    }
    S.delMode = true;
    S.delTipo = S.tipo;
    S.msg = '';
    render();
  };
  $('btnAddTipo').onclick = function () {
    var h = $('tipoH'),
      nm = $('tNome').value.trim().replace(/\s+/g, ' '),
      cu = parseFloat(String($('tCusto').value).replace(',', '.'));
    if (isNaN(cu) && !String($('tCusto').value).trim()) cu = 0;
    h.hidden = false;
    if (!nm) {
      h.textContent = 'Digite o nome do tipo.';
      return;
    }
    if (
      TIPOS.some(function (x) {
        return x.label.toLowerCase() === nm.toLowerCase();
      })
    ) {
      h.textContent = 'Já existe um tipo com esse nome.';
      return;
    }
    if (!(cu >= 0)) {
      h.textContent = 'Informe o custo de reposição em US$ (pode ser 0).';
      return;
    }
    var id = 'x' + Date.now().toString(36);
    nm = nm[0].toUpperCase() + nm.slice(1);
    S.tiposX.push({
      id: id,
      label: nm,
      full: nm,
      price: 0,
      repUSD: cu,
      pago: cu,
      x: true,
      simple: true
    });
    syncTipos();
    S.todos = false;
    S.lotesView = false;
    S.tipo = id;
    S.fmtF = 'all';
    S.corF = 'all';
    S.q = '';
    S.open = '';
    S.det = false;
    S.selItem = null;
    S.mode = 'venda';
    S.addTipo = false;
    $('tNome').value = '';
    $('tCusto').value = '';
    h.hidden = true;
    S.msg =
      'Tipo "' +
      nm +
      '" criado. O preço você define em cada venda. Use "Dar entrada" para cadastrar os itens.';
    render();
  };
  $('btnManCor').onclick = function () {
    S.manCor = !S.manCor;
    render();
  };
  $('palAdd').onclick = function () {
    var n = cap1($('palName').value);
    if (!n) {
      $('palH').textContent = 'Digite o nome da cor.';
      return;
    }
    if (
      Object.keys(S.palette).some(function (k) {
        return k.toLowerCase() === n.toLowerCase();
      })
    ) {
      $('palH').textContent = 'Essa cor já existe.';
      return;
    }
    S.palette[n] = $('palHex').value;
    $('palName').value = '';
    $('palH').textContent = 'Cor "' + n + '" adicionada.';
    render();
  };
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
        res = S.fundoBranco === false ? { canvas: c } : whiten(c);
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
  // ===== Imagem: canvas e recorte do objeto (modelo onnxruntime IS-Net/u2netp). =====
  // Cria um canvas com o tamanho dado.
  function mkCanvas(w, h) {
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w));
    c.height = Math.max(1, Math.round(h));
    return c;
  }
  // Reduz a imagem ao lado máximo informado.
  function fitCanvas(img, maxSide) {
    var w = img.naturalWidth || img.width,
      h = img.naturalHeight || img.height,
      sc = Math.min(1, maxSide / Math.max(w, h)),
      c = mkCanvas(w * sc, h * sc),
      g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(img, 0, 0, c.width, c.height);
    return c;
  }
  var EDGE_T = window.__EDGE || 26;
  // ---- recorte por modelo (qualquer fundo): IS-Net 512 (pesos int8) + U2Net-p, via onnxruntime-web
  var SEG = {
    ready: null,
    failed: false,
    tta: false,
    base: 'seg/',
    ort: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.3/dist/',
    parts: ['isnet_a.bin', 'isnet_b.bin', 'isnet_c.bin', 'isnet_d.bin'],
    small: 'u2netp.onnx',
    on: null
  };
  // Informa o andamento do carregamento do recorte.
  function segStatus(t) {
    if (SEG.on)
      try {
        SEG.on(t);
      } catch (e) {}
  }
  // Carrega o modelo de recorte uma única vez.
  function segLoad() {
    if (window.__segFn) return Promise.resolve({});
    if (SEG.ready) return SEG.ready;
    SEG.ready = new Promise(function (ok, no) {
      var go = function () {
        try {
          window.ort.env.wasm.wasmPaths = SEG.ort;
          window.ort.env.wasm.numThreads = 1;
          window.ort.env.wasm.proxy = false;
        } catch (e) {}
        var get = function (u) {
          return fetch(u).then(function (r) {
            if (!r.ok) throw new Error('http ' + r.status + ' ' + u);
            if (/\.txt$/.test(u))
              return r.text().then(function (t) {
                var bin = atob(t),
                  n = bin.length,
                  a = new Uint8Array(n),
                  i;
                for (i = 0; i < n; i++) a[i] = bin.charCodeAt(i);
                return a.buffer;
              });
            return r.arrayBuffer();
          });
        };
        segStatus('Baixando o modelo de recorte (só na primeira vez)…');
        Promise.all(
          SEG.parts
            .map(function (p) {
              return get(SEG.base + p);
            })
            .concat([get(SEG.base + SEG.small)])
        )
          .then(function (b) {
            var n = 0,
              i;
            for (i = 0; i < SEG.parts.length; i++) n += b[i].byteLength;
            var big = new Uint8Array(n),
              o = 0;
            for (i = 0; i < SEG.parts.length; i++) {
              big.set(new Uint8Array(b[i]), o);
              o += b[i].byteLength;
            }
            var opt = { executionProviders: ['wasm'], graphOptimizationLevel: 'all' };
            segStatus('Preparando o modelo…');
            var E = function (w) {
              return function (e) {
                throw new Error(
                  w + ': ' + ((e && e.message) || (typeof e === 'number' ? 'memória/erro ' + e : e))
                );
              };
            };
            return window.ort.InferenceSession.create(new Uint8Array(b[SEG.parts.length]), opt)
              .catch(E('modelo leve'))
              .then(function (ss) {
                return window.ort.InferenceSession.create(big, opt).then(
                  function (sb) {
                    return { big: sb, small: ss };
                  },
                  function (e) {
                    window.__bigErr = String((e && e.message) || e);
                    return { big: null, small: ss };
                  }
                );
              })
              .then(ok);
          })
          .catch(no);
      };
      if (window.ort) {
        go();
        return;
      }
      var ld = function (base, fail) {
        var s = document.createElement('script');
        s.src = base + 'ort.min.js';
        s.onload = function () {
          SEG.ort = base;
          go();
        };
        s.onerror = fail;
        document.head.appendChild(s);
      };
      ld('ort/', function () {
        ld('https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.3/dist/', function () {
          ld('https://unpkg.com/onnxruntime-web@1.17.3/dist/', function () {
            ld('https://cdnjs.cloudflare.com/ajax/libs/onnxruntime-web/1.17.3/', function () {
              no(new Error('motor ort não carregou'));
            });
          });
        });
      });
    }).catch(function (e) {
      SEG.ready = null;
      SEG.failed = true;
      throw e;
    });
    return SEG.ready;
  }
  // Canvas → tensor de entrada do modelo.
  function segTensor(cv, res, imnet) {
    var c = mkCanvas(res, res),
      g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(cv, 0, 0, res, res);
    var d = g.getImageData(0, 0, res, res).data,
      n = res * res,
      t = new Float32Array(3 * n),
      i,
      m = [0.485, 0.456, 0.406],
      s = [0.229, 0.224, 0.225];
    for (i = 0; i < n; i++)
      for (var k = 0; k < 3; k++) {
        var v = d[i * 4 + k] / 255;
        t[k * n + i] = imnet ? (v - m[k]) / s[k] : v - 0.5;
      }
    return t;
  }
  // Executa o modelo e devolve a máscara.
  function segRun(M, kind, res, cv) {
    var data = segTensor(cv, res, kind === 'small');
    var p = window.__segFn
      ? Promise.resolve(window.__segFn(kind, data, res))
      : (kind === 'big' && !M.big
          ? Promise.reject(new Error('sem modelo grande'))
          : M[kind === 'small' ? 'small' : 'big'].run(
              (function () {
                var o = {};
                o[kind === 'small' ? M.small.inputNames[0] : M.big.inputNames[0]] =
                  new window.ort.Tensor('float32', data, [1, 3, res, res]);
                return o;
              })()
            )
        ).then(
          function (o) {
            return o[kind === 'small' ? M.small.outputNames[0] : M.big.outputNames[0]].data;
          },
          function (e) {
            throw new Error(
              'rodar ' +
                kind +
                ': ' +
                ((e && e.message) || (typeof e === 'number' ? 'erro ' + e : e))
            );
          }
        );
    return p.then(function (o) {
      var n = res * res,
        a = new Float32Array(n),
        i,
        mn = 1e9,
        mx = -1e9;
      var sig = false;
      for (i = 0; i < n; i++) {
        if (o[i] < 0 || o[i] > 1) {
          sig = true;
          break;
        }
      }
      for (i = 0; i < n; i++) {
        var v = sig ? 1 / (1 + Math.exp(-o[i])) : o[i];
        a[i] = v;
        if (v < mn) mn = v;
        if (v > mx) mx = v;
      }
      var r = mx - mn + 1e-9;
      for (i = 0; i < n; i++) a[i] = (a[i] - mn) / r;
      return a;
    });
  }
  // caixa móvel (média) separável
  function segBox(src, w, h, r, dst, tmp) {
    var x,
      y,
      acc,
      k,
      inv = 1 / (2 * r + 1);
    tmp = tmp || new Float32Array(w * h);
    for (y = 0; y < h; y++) {
      var o = y * w;
      acc = 0;
      for (k = -r; k <= r; k++) acc += src[o + Math.min(w - 1, Math.max(0, k))];
      for (x = 0; x < w; x++) {
        tmp[o + x] = acc * inv;
        acc += src[o + Math.min(w - 1, x + r + 1)] - src[o + Math.max(0, x - r)];
      }
    }
    for (x = 0; x < w; x++) {
      acc = 0;
      for (k = -r; k <= r; k++) acc += tmp[Math.min(h - 1, Math.max(0, k)) * w + x];
      for (y = 0; y < h; y++) {
        dst[y * w + x] = acc * inv;
        acc += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x];
      }
    }
    return dst;
  }
  // Filtro guiado: refina as bordas pela imagem.
  function segGuided(I, p, w, h, r, eps) {
    var n = w * h,
      i,
      mI = new Float32Array(n),
      mp = new Float32Array(n),
      t = new Float32Array(n),
      t2 = new Float32Array(n),
      a = new Float32Array(n),
      b = new Float32Array(n),
      tmp = new Float32Array(n);
    segBox(I, w, h, r, mI, tmp);
    segBox(p, w, h, r, mp, tmp);
    for (i = 0; i < n; i++) t[i] = I[i] * p[i];
    segBox(t, w, h, r, t2, tmp); // E[Ip]
    for (i = 0; i < n; i++) t[i] = I[i] * I[i];
    segBox(t, w, h, r, a, tmp); // E[II]
    for (i = 0; i < n; i++) {
      var cov = t2[i] - mI[i] * mp[i],
        vr = a[i] - mI[i] * mI[i];
      var aa = cov / (vr + eps);
      b[i] = mp[i] - aa * mI[i];
      t[i] = aa;
    }
    segBox(t, w, h, r, a, tmp);
    segBox(b, w, h, r, t2, tmp);
    var o = new Float32Array(n);
    for (i = 0; i < n; i++) {
      var v = a[i] * I[i] + t2[i];
      o[i] = v < 0 ? 0 : v > 1 ? 1 : v;
    }
    return o;
  }
  // maior componente (4-conexa) de uma máscara booleana; devolve Uint8Array e área
  function segLargest(m, w, h, minFrac) {
    var n = w * h,
      lab = new Int32Array(n),
      q = new Int32Array(n),
      areas = [0],
      L = 0,
      i,
      qh,
      qt;
    for (i = 0; i < n; i++) {
      if (!m[i] || lab[i]) continue;
      L++;
      lab[i] = L;
      qh = 0;
      qt = 0;
      q[qt++] = i;
      var c = 0;
      while (qh < qt) {
        var p = q[qh++],
          x = p % w,
          y = (p / w) | 0;
        c++;
        if (x > 0 && m[p - 1] && !lab[p - 1]) {
          lab[p - 1] = L;
          q[qt++] = p - 1;
        }
        if (x < w - 1 && m[p + 1] && !lab[p + 1]) {
          lab[p + 1] = L;
          q[qt++] = p + 1;
        }
        if (y > 0 && m[p - w] && !lab[p - w]) {
          lab[p - w] = L;
          q[qt++] = p - w;
        }
        if (y < h - 1 && m[p + w] && !lab[p + w]) {
          lab[p + w] = L;
          q[qt++] = p + w;
        }
      }
      areas.push(c);
    }
    var best = 1,
      j;
    for (j = 2; j <= L; j++) if (areas[j] > areas[best]) best = j;
    var out = new Uint8Array(n),
      keep = [],
      thr = (minFrac || 0) * areas[best];
    for (j = 1; j <= L; j++) keep[j] = j === best || areas[j] >= thr;
    for (i = 0; i < n; i++) if (lab[i] && keep[lab[i]]) out[i] = 1;
    return out;
  }
  // Fecha buracos dentro da máscara.
  function segFill(m, w, h) {
    // fecha buracos: o que não é alcançado a partir da borda pelo "fora"
    var n = w * h,
      out = new Uint8Array(n),
      q = new Int32Array(n),
      qh = 0,
      qt = 0,
      i;
    for (i = 0; i < n; i++) out[i] = 1;
    var push = function (p) {
      if (!m[p] && out[p]) {
        out[p] = 0;
        q[qt++] = p;
      }
    };
    for (i = 0; i < w; i++) {
      push(i);
      push((h - 1) * w + i);
    }
    for (i = 0; i < h; i++) {
      push(i * w);
      push(i * w + w - 1);
    }
    while (qh < qt) {
      var p = q[qh++],
        x = p % w,
        y = (p / w) | 0;
      if (x > 0) push(p - 1);
      if (x < w - 1) push(p + 1);
      if (y > 0) push(p - w);
      if (y < h - 1) push(p + w);
    }
    return out;
  }
  // Percentis de um conjunto de valores.
  function segPct(arr, idx, pcts) {
    var v = new Float32Array(idx.length),
      i;
    for (i = 0; i < idx.length; i++) v[i] = arr[idx[i]];
    v.sort();
    return pcts.map(function (p) {
      return v[Math.min(v.length - 1, Math.floor((p / 100) * v.length))];
    });
  }
  // Dilata a máscara em r pixels.
  function segDilate(m, w, h, r) {
    var n = w * h,
      f = new Float32Array(n),
      o = new Float32Array(n),
      i;
    for (i = 0; i < n; i++) f[i] = m[i] ? 1 : 0;
    segBox(f, w, h, r, o);
    var u = new Uint8Array(n);
    for (i = 0; i < n; i++) u[i] = o[i] > 1e-4 ? 1 : 0;
    return u;
  }
  // recorte quadrado com bordas replicadas (bx0,by0 podem cair fora da imagem)
  function segCrop(full, bx0, by0, bs, cs) {
    var c = mkCanvas(cs, cs),
      g = c.getContext('2d'),
      k = cs / bs,
      W = full.width,
      H = full.height;
    g.imageSmoothingQuality = 'high';
    var x0 = Math.max(0, bx0),
      y0 = Math.max(0, by0),
      x1 = Math.min(W, bx0 + bs),
      y1 = Math.min(H, by0 + bs);
    if (x1 <= x0 || y1 <= y0) {
      g.fillStyle = '#808080';
      g.fillRect(0, 0, cs, cs);
      return c;
    }
    var dx0 = (x0 - bx0) * k,
      dy0 = (y0 - by0) * k,
      dx1 = (x1 - bx0) * k,
      dy1 = (y1 - by0) * k;
    // faixas de 1px esticadas (replicação de borda)
    if (dx0 > 0) g.drawImage(full, x0, y0, 1, y1 - y0, 0, dy0, dx0 + 1, dy1 - dy0);
    if (dx1 < cs) g.drawImage(full, x1 - 1, y0, 1, y1 - y0, dx1 - 1, dy0, cs - dx1 + 1, dy1 - dy0);
    if (dy0 > 0) g.drawImage(full, x0, y0, x1 - x0, 1, dx0, 0, dx1 - dx0, dy0 + 1);
    if (dy1 < cs) g.drawImage(full, x0, y1 - 1, x1 - x0, 1, dx0, dy1 - 1, dx1 - dx0, cs - dy1 + 1);
    if (dx0 > 0 && dy0 > 0) g.drawImage(full, x0, y0, 1, 1, 0, 0, dx0 + 1, dy0 + 1);
    if (dx1 < cs && dy0 > 0) g.drawImage(full, x1 - 1, y0, 1, 1, dx1 - 1, 0, cs - dx1 + 1, dy0 + 1);
    if (dx0 > 0 && dy1 < cs) g.drawImage(full, x0, y1 - 1, 1, 1, 0, dy1 - 1, dx0 + 1, cs - dy1 + 1);
    if (dx1 < cs && dy1 < cs)
      g.drawImage(full, x1 - 1, y1 - 1, 1, 1, dx1 - 1, dy1 - 1, cs - dx1 + 1, cs - dy1 + 1);
    g.drawImage(full, x0, y0, x1 - x0, y1 - y0, dx0, dy0, dx1 - dx0, dy1 - dy0);
    return c;
  }
  // o fundo é liso e claro? (então o recorte clássico já resolve)
  function bgIsPlain(full) {
    var sw = 160,
      sh = Math.max(8, Math.round((160 * full.height) / full.width)),
      c = mkCanvas(sw, sh),
      g = c.getContext('2d');
    g.drawImage(full, 0, 0, sw, sh);
    var d = g.getImageData(0, 0, sw, sh).data,
      ring = Math.max(3, Math.round(Math.min(sw, sh) * 0.04)),
      L = [],
      x,
      y,
      i;
    for (y = 0; y < sh; y++)
      for (x = 0; x < sw; x++) {
        if (x < ring || y < ring || x >= sw - ring || y >= sh - ring) {
          i = (y * sw + x) * 4;
          L.push(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
        }
      }
    var gr = 0,
      gn = 0,
      Y = function (p) {
        return 0.299 * d[p * 4] + 0.587 * d[p * 4 + 1] + 0.114 * d[p * 4 + 2];
      };
    for (y = 1; y < sh - 1; y++)
      for (x = 1; x < sw - 1; x++) {
        if (x < ring || y < ring || x >= sw - ring || y >= sh - ring) {
          i = y * sw + x;
          gr += Math.abs(Y(i + 1) - Y(i - 1)) + Math.abs(Y(i + sw) - Y(i - sw));
          gn++;
        }
      }
    gr = gn ? gr / gn : 0;
    L.sort(function (a, b) {
      return a - b;
    });
    var med = L[L.length >> 1],
      lo = L[Math.floor(L.length * 0.1)],
      hi = L[Math.floor(L.length * 0.9)];
    window.__bgStat = { med: med, span: hi - lo, grad: gr };
    return med >= 160 && gr < 18;
  }
  window.__bgIsPlain = bgIsPlain;
  window.__fitCanvas = fitCanvas;
  // Caixa envolvente da máscara.
  function segBBox(a, res) {
    var n = res * res,
      b = new Uint8Array(n),
      i;
    for (i = 0; i < n; i++) b[i] = a[i] > 0.5 ? 1 : 0;
    var m = segLargest(b, res, res, 0),
      x0 = 1e9,
      y0 = 1e9,
      x1 = -1,
      y1 = -1;
    for (i = 0; i < n; i++)
      if (m[i]) {
        var x = i % res,
          y = (i / res) | 0;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    if (x1 < 0) return null;
    return { x0: x0 / res, y0: y0 / res, x1: (x1 + 1) / res, y1: (y1 + 1) / res };
  }
  // A caixa tem tamanho plausível para um óculos?
  function segPlausible(bb, W, H) {
    if (!bb) return false;
    var w = (bb.x1 - bb.x0) * W,
      h = (bb.y1 - bb.y0) * H,
      ar = w / Math.max(1, h);
    return (bb.x1 - bb.x0) * (bb.y1 - bb.y0) > 0.04 && ar >= 1.5 && ar <= 4.6;
  }
  // Amplia a máscara para 512×512.
  function up512(a) {
    var o = new Float32Array(512 * 512),
      y,
      x,
      k = 319 / 511;
    for (y = 0; y < 512; y++) {
      var fy = y * k,
        y0 = fy | 0,
        y1 = Math.min(319, y0 + 1),
        wy = fy - y0;
      for (x = 0; x < 512; x++) {
        var fx = x * k,
          x0 = fx | 0,
          x1 = Math.min(319, x0 + 1),
          wx = fx - x0;
        o[y * 512 + x] =
          (a[y0 * 320 + x0] * (1 - wx) + a[y0 * 320 + x1] * wx) * (1 - wy) +
          (a[y1 * 320 + x0] * (1 - wx) + a[y1 * 320 + x1] * wx) * wy;
      }
    }
    return o;
  }
  /* o modelo pegou a prateleira junto (caixa alta/larga demais): procura só a armação, que é a parte com muito detalhe dentro da máscara */
  function devBBox(full, a1) {
    var res = 320,
      n = res * res,
      c = mkCanvas(res, res),
      g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(full, 0, 0, res, res);
    var d = g.getImageData(0, 0, res, res).data,
      i,
      x,
      y,
      R = [],
      G = [],
      B = [];
    for (y = Math.round(res * 0.25); y < Math.round(res * 0.75); y += 2)
      for (x = Math.round(res * 0.1); x < Math.round(res * 0.9); x += 2) {
        i = (y * res + x) * 4;
        R.push(d[i]);
        G.push(d[i + 1]);
        B.push(d[i + 2]);
      }
    var md = function (v) {
        v.sort(function (p, q) {
          return p - q;
        });
        return v[v.length >> 1];
      },
      mr = md(R),
      mg = md(G),
      mb = md(B);
    var f = new Float32Array(n),
      o = new Float32Array(n),
      tmp = new Float32Array(n),
      cnt = 0;
    for (i = 0; i < n; i++) {
      f[i] =
        Math.abs(d[i * 4] - mr) + Math.abs(d[i * 4 + 1] - mg) + Math.abs(d[i * 4 + 2] - mb) > 60
          ? 1
          : 0;
      cnt += f[i];
    }
    if (cnt < 60) return null;
    segBox(f, res, res, 3, o, tmp);
    var e = new Uint8Array(n);
    for (i = 0; i < n; i++) e[i] = o[i] > 0.999 ? 1 : 0;
    /* a peça (o que o cliente enquadrou) é a mancha que mais cobre o centro da foto */
    var lab = new Int32Array(n),
      q = new Int32Array(n),
      L = 0,
      cx0 = res / 2 - 45,
      cx1 = res / 2 + 45,
      cy0 = res / 2 - 30,
      cy1 = res / 2 + 30,
      best = null;
    for (i = 0; i < n; i++) {
      if (!e[i] || lab[i]) continue;
      L++;
      var qh = 0,
        qt = 0,
        x0 = 1e9,
        y0 = 1e9,
        x1 = -1,
        y1 = -1,
        ov = 0;
      q[qt++] = i;
      lab[i] = L;
      while (qh < qt) {
        var p = q[qh++],
          px = p % res,
          py = (p / res) | 0;
        if (px < x0) x0 = px;
        if (px > x1) x1 = px;
        if (py < y0) y0 = py;
        if (py > y1) y1 = py;
        if (px >= cx0 && px < cx1 && py >= cy0 && py < cy1) ov++;
        if (px > 0 && e[p - 1] && !lab[p - 1]) {
          lab[p - 1] = L;
          q[qt++] = p - 1;
        }
        if (px < res - 1 && e[p + 1] && !lab[p + 1]) {
          lab[p + 1] = L;
          q[qt++] = p + 1;
        }
        if (py > 0 && e[p - res] && !lab[p - res]) {
          lab[p - res] = L;
          q[qt++] = p - res;
        }
        if (py < res - 1 && e[p + res] && !lab[p + res]) {
          lab[p + res] = L;
          q[qt++] = p + res;
        }
      }
      if (ov > 0 && (!best || ov > best.ov)) best = { ov: ov, x0: x0, y0: y0, x1: x1, y1: y1 };
    }
    if (!best) return null;
    var bw = best.x1 - best.x0 + 1,
      bh = best.y1 - best.y0 + 1,
      mx = bw * 0.04 + 3,
      my = bh * 0.08 + 3;
    return {
      x0: Math.max(0, best.x0 - mx) / res,
      y0: Math.max(0, best.y0 - my) / res,
      x1: Math.min(res, best.x1 + 1 + mx) / res,
      y1: Math.min(res, best.y1 + 1 + my) / res,
      col: [mr, mg, mb]
    };
  }
  /* quando a prateleira entrou na máscara: mantém só o que difere da cor da prateleira (a armação), sem a linha fina da emenda e com as lentes preenchidas */
  function applySil(cr, a, col) {
    var r = 512,
      n = r * r,
      c = mkCanvas(r, r),
      g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(cr, 0, 0, r, r);
    var d = g.getImageData(0, 0, r, r).data,
      f = new Float32Array(n),
      i,
      cnt = 0;
    for (i = 0; i < n; i++) {
      f[i] =
        Math.abs(d[i * 4] - col[0]) +
          Math.abs(d[i * 4 + 1] - col[1]) +
          Math.abs(d[i * 4 + 2] - col[2]) >
        45
          ? 1
          : 0;
    }
    var o = new Float32Array(n),
      t = new Float32Array(n);
    segBox(f, r, r, 2, o, t);
    var e = new Uint8Array(n);
    for (i = 0; i < n; i++) e[i] = o[i] > 0.999 ? 1 : 0;
    var dl = segDilate(e, r, r, 7),
      out = new Uint8Array(n),
      q = new Int32Array(n),
      qh = 0,
      qt = 0,
      x,
      y;
    /* buracos (lentes): o que não é alcançável a partir da borda fica dentro */
    var seen = new Uint8Array(n);
    function push(p) {
      if (!dl[p] && !seen[p]) {
        seen[p] = 1;
        q[qt++] = p;
      }
    }
    for (x = 0; x < r; x++) {
      push(x);
      push((r - 1) * r + x);
    }
    for (y = 0; y < r; y++) {
      push(y * r);
      push(y * r + r - 1);
    }
    while (qh < qt) {
      var p = q[qh++],
        px = p % r,
        py = (p / r) | 0;
      if (px > 0) push(p - 1);
      if (px < r - 1) push(p + 1);
      if (py > 0) push(p - r);
      if (py < r - 1) push(p + r);
    }
    for (i = 0; i < n; i++) {
      out[i] = seen[i] ? 0 : 1;
      cnt += out[i];
    }
    if (cnt < n * 0.01 || cnt > n * 0.6) return a;
    var sm = new Float32Array(n),
      res = new Float32Array(n);
    for (i = 0; i < n; i++) sm[i] = out[i];
    segBox(sm, r, r, 1, res, t);
    var o2 = new Float32Array(n);
    for (i = 0; i < n; i++) o2[i] = a[i] * Math.min(1, res[i] * 1.5);
    return o2;
  }
  // Cor da superfície onde o óculos está apoiado.
  function shelfCol(full) {
    var res = 200,
      c = mkCanvas(res, res),
      g = c.getContext('2d');
    g.drawImage(full, 0, 0, res, res);
    var d = g.getImageData(0, 0, res, res).data,
      R = [],
      G = [],
      B = [],
      x,
      y,
      i;
    for (y = Math.round(res * 0.2); y < Math.round(res * 0.8); y += 2)
      for (x = Math.round(res * 0.05); x < Math.round(res * 0.95); x += 2) {
        i = (y * res + x) * 4;
        R.push(d[i]);
        G.push(d[i + 1]);
        B.push(d[i + 2]);
      }
    var md = function (v) {
      v.sort(function (p, q) {
        return p - q;
      });
      return v[v.length >> 1];
    };
    return [md(R), md(G), md(B)];
  }
  /* quanto da peça recortada ainda parece a prateleira (fração dos pixels não brancos): serve para recusar o recorte quando o fundo ficou junto */
  function shelfShare(cv, full) {
    var col = shelfCol(full),
      r = 400,
      n = r * r,
      c = mkCanvas(r, r),
      g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(cv, 0, 0, r, r);
    var d = g.getImageData(0, 0, r, r).data,
      lk = new Uint8Array(n),
      nw = 0,
      i,
      x,
      y;
    for (i = 0; i < n; i++) {
      var R = d[i * 4],
        G = d[i * 4 + 1],
        B = d[i * 4 + 2];
      if (R >= 245 && G >= 245 && B >= 245) continue;
      nw++;
      if (Math.abs(R - col[0]) + Math.abs(G - col[1]) + Math.abs(B - col[2]) < 45) lk[i] = 1;
    }
    if (!nw) return 0;
    var cnt = 0;
    for (y = 1; y < r - 1; y++)
      for (x = 1; x < r - 1; x++) {
        i = y * r + x;
        if (
          lk[i] &&
          lk[i - 1] &&
          lk[i + 1] &&
          lk[i - r] &&
          lk[i + r] &&
          lk[i - r - 1] &&
          lk[i - r + 1] &&
          lk[i + r - 1] &&
          lk[i + r + 1]
        )
          cnt++;
      }
    return cnt / nw;
  }
  var bp0 = true;
  // Fundo branco pelo modelo, sem cortar a armação.
  function modelWhiten(full) {
    return segLoad().then(function (M) {
      var W = full.width,
        H = full.height;
      segStatus('Achando a armação…');
      return segRun(M, 'small', 320, full)
        .then(function (a1) {
          var bb = segBBox(a1, 320);
          var bp = segPlausible(bb, W, H);
          bp0 = bp;
          window.__bbInfo = { bb: bb, bp: bp };
          try {
            var db = devBBox(full, a1);
            window.__devBB = db;
            if (
              db &&
              segPlausible(db, W, H) &&
              (window.__forceDev ||
                !bb ||
                (bb.x1 - bb.x0) * (bb.y1 - bb.y0) >
                  (db.x1 - db.x0) * (db.y1 - db.y0) * (bp ? 3 : 1.6))
            ) {
              db.dev = 1;
              return db;
            }
          } catch (eD) {
            window.__devErr = String(eD);
          }
          if (bp) return bb;
          if (!M.big) return bb;
          return segRun(M, 'big', 512, full).then(function (a0) {
            var b2 = segBBox(a0, 512);
            return segPlausible(b2, W, H) ? b2 : bb || b2;
          });
        })
        .then(function (bb) {
          if (!bb) throw new Error('vazio');
          var fx0 = bb.x0 * W,
            fx1 = bb.x1 * W,
            fy0 = bb.y0 * H,
            fy1 = bb.y1 * H,
            cx = (fx0 + fx1) / 2,
            cy = (fy0 + fy1) / 2,
            bs = Math.round(Math.max(fx1 - fx0, fy1 - fy0) * 1.2),
            bx0 = Math.round(cx - bs / 2),
            by0 = Math.round(cy - bs / 2);
          var S = 2000,
            cr = segCrop(full, bx0, by0, bs, S);
          segStatus('Recortando a armação…');
          return (M.big ? segRun(M, 'big', 512, cr) : segRun(M, 'small', 320, cr).then(up512))
            .then(function (a2) {
              if (!SEG.tta) return a2;
              var f = mkCanvas(S, S),
                fg = f.getContext('2d');
              fg.translate(S, 0);
              fg.scale(-1, 1);
              fg.drawImage(cr, 0, 0);
              return segRun(M, 'big', 512, f).then(function (b2) {
                var n = 512 * 512,
                  o = new Float32Array(n),
                  yy,
                  xx;
                for (yy = 0; yy < 512; yy++)
                  for (xx = 0; xx < 512; xx++)
                    o[yy * 512 + xx] = (a2[yy * 512 + xx] + b2[yy * 512 + 511 - xx]) / 2;
                return o;
              });
            })
            .then(function (a2) {
              try {
                var cv0 = 0,
                  nn0 = a2.length,
                  i0;
                for (i0 = 0; i0 < nn0; i0++) if (a2[i0] > 0.5) cv0++;
                window.__cover = cv0 / nn0;
                if (cv0 / nn0 > 0.8 && !window.__noRefuse) {
                  var RE2 = new Error('REFUSA');
                  RE2.refusa = 1;
                  throw RE2;
                }
              } catch (eR) {
                if (eR && eR.refusa) throw eR;
              }
              if (bb.dev && bb.col) {
                try {
                  a2 = applySil(cr, a2, bb.col);
                } catch (eS) {}
              }
              var res = compose(cr, a2, S);
              if (!window.__noRefuse) {
                var sh = 0;
                try {
                  sh = shelfShare(res.canvas, full);
                } catch (eSh) {
                  window.__shErr = String(eSh);
                }
                window.__share = sh;
                if (sh > 0.3 || (!bp0 && sh > 0.04)) {
                  var RE3 = new Error('REFUSA');
                  RE3.refusa = 1;
                  throw RE3;
                }
              }
              res.bbox = [
                Math.max(0, fx0 / W),
                Math.max(0, fy0 / H),
                Math.min(1, fx1 / W),
                Math.min(1, fy1 / H)
              ];
              return res;
            });
        });
    });
  }
  /* tira a emenda da estante (linha fina, reta e quase vertical) que o modelo confunde com a peça; a armação (grossa) fica */
  function segSeam(A, w) {
    var n = w * w,
      i,
      r = Math.max(4, Math.round(w * 0.012)),
      bm = new Float32Array(n),
      tmp = new Float32Array(n),
      e = new Float32Array(n),
      d = new Float32Array(n),
      er = new Float32Array(n);
    for (i = 0; i < n; i++) bm[i] = A[i] > 0.5 ? 1 : 0;
    segBox(bm, w, w, r, e, tmp);
    for (i = 0; i < n; i++) er[i] = e[i] > 0.999 ? 1 : 0;
    segBox(er, w, w, r, d, tmp);
    var thin = new Uint8Array(n),
      seen = new Uint8Array(n),
      rm = new Uint8Array(n),
      any = false;
    for (i = 0; i < n; i++) thin[i] = bm[i] && d[i] < 0.001 ? 1 : 0;
    for (i = 0; i < n; i++) {
      if (!thin[i] || seen[i]) continue;
      var cm = [i],
        x0 = w,
        x1 = 0,
        y0 = w,
        y1 = 0;
      seen[i] = 1;
      for (var k = 0; k < cm.length; k++) {
        var c = cm[k],
          cx = c % w,
          cy = (c / w) | 0;
        if (cx < x0) x0 = cx;
        if (cx > x1) x1 = cx;
        if (cy < y0) y0 = cy;
        if (cy > y1) y1 = cy;
        for (var yy = -1; yy <= 1; yy++)
          for (var xx = -1; xx <= 1; xx++) {
            var X = cx + xx,
              Y = cy + yy;
            if (X < 0 || Y < 0 || X >= w || Y >= w) continue;
            var q = Y * w + X;
            if (thin[q] && !seen[q]) {
              seen[q] = 1;
              cm.push(q);
            }
          }
      }
      var bw = x1 - x0 + 1,
        bh = y1 - y0 + 1;
      if (bh >= w * 0.07 && bh >= bw * 2.5 && bw <= w * 0.07) {
        any = true;
        for (k = 0; k < cm.length; k++) rm[cm[k]] = 1;
      }
    }
    if (!any) return A;
    var rd = segDilate(rm, w, w, 3),
      o = new Float32Array(A);
    for (i = 0; i < n; i++) if (rd[i]) o[i] = 0;
    return o;
  }
  // ===== Imagem: fundo branco sem cortar a armação. =====
  // Monta a imagem final: peça sobre fundo branco.
  function compose(cr, a512, S) {
    var w = 1000,
      n = w * w,
      i,
      x,
      y;
    // máscara do modelo -> w×w (bicúbico via canvas)
    var ac = mkCanvas(512, 512),
      ag = ac.getContext('2d'),
      aid = ag.createImageData(512, 512);
    for (i = 0; i < 512 * 512; i++) {
      var v = Math.round(a512[i] * 255);
      aid.data[i * 4] = v;
      aid.data[i * 4 + 1] = v;
      aid.data[i * 4 + 2] = v;
      aid.data[i * 4 + 3] = 255;
    }
    ag.putImageData(aid, 0, 0);
    var c1 = mkCanvas(w, w),
      g1 = c1.getContext('2d');
    g1.imageSmoothingQuality = 'high';
    g1.drawImage(ac, 0, 0, w, w);
    var ad = g1.getImageData(0, 0, w, w).data,
      A = new Float32Array(n);
    for (i = 0; i < n; i++) A[i] = ad[i * 4] / 255;
    if (!window.__NOSEAM)
      try {
        A = segSeam(A, w);
      } catch (e) {}
    // imagem do recorte em w×w
    var ic = mkCanvas(w, w),
      ig = ic.getContext('2d');
    ig.imageSmoothingQuality = 'high';
    ig.drawImage(cr, 0, 0, w, w);
    var id = ig.getImageData(0, 0, w, w).data,
      g = new Float32Array(n),
      cm = new Float32Array(n),
      R = new Float32Array(n);
    for (i = 0; i < n; i++) {
      var r = id[i * 4],
        gg = id[i * 4 + 1],
        b = id[i * 4 + 2];
      g[i] = (0.299 * r + 0.587 * gg + 0.114 * b) / 255;
      R[i] = (Math.max(r, gg, b) - Math.min(r, gg, b)) / 255;
    }
    var tmp = new Float32Array(n),
      Yb = new Float32Array(n);
    segBox(g, w, w, 2, Yb, tmp);
    segBox(R, w, w, 2, cm, tmp);
    // casco = maior comp. de A>.5, buracos fechados
    var hb = new Uint8Array(n);
    for (i = 0; i < n; i++) hb[i] = A[i] > 0.5 ? 1 : 0;
    var hull = segFill(segLargest(hb, w, w, 0.25), w, w);
    // descasca fundo ESCURO ligado ao exterior (sombra/couro), só se o anel ao redor é escuro
    var d3 = segDilate(hull, w, w, Math.round(w * 0.015)),
      d12 = segDilate(hull, w, w, Math.round(w * 0.06)),
      ringIdx = [];
    for (i = 0; i < n; i++) if (d12[i] && !d3[i]) ringIdx.push(i);
    if (ringIdx.length > 500 && window.__PEELON) {
      var py = segPct(Yb, ringIdx, [40]),
        pc = segPct(cm, ringIdx, [95]);
      if (py[0] < 0.35) {
        var Yt = Math.min(py[0] * 1.2, 0.33),
          Cth = pc[0] * 1.25 + 0.02,
          cand = new Uint8Array(n);
        for (i = 0; i < n; i++) cand[i] = hull[i] && Yb[i] < Yt && cm[i] < Cth ? 1 : 0;
        // proteção: se a própria armação é escura (faixa da borda quase toda "escura"), não descasca nada
        var hin = new Uint8Array(n),
          hb2 = segDilate(
            hull.map(function (v) {
              return v ? 0 : 1;
            }),
            w,
            w,
            Math.round(w * 0.035)
          ),
          bandN = 0,
          bandC = 0;
        for (i = 0; i < n; i++)
          if (hull[i] && hb2[i]) {
            bandN++;
            if (cand[i]) bandC++;
          }
        window.__PEEL = [bandC, bandN, py[0]];
        if (bandN > 200 && bandC / bandN < 0.5) {
          var dist = new Int16Array(n),
            q = new Int32Array(n),
            qh = 0,
            qt = 0,
            lim = Math.round(w * 0.06),
            peel = new Uint8Array(n);
          for (i = 0; i < n; i++) dist[i] = -1;
          for (i = 0; i < n; i++)
            if (hull[i]) {
              x = i % w;
              y = (i / w) | 0;
              if (
                (x > 0 && !hull[i - 1]) ||
                (x < w - 1 && !hull[i + 1]) ||
                (y > 0 && !hull[i - w]) ||
                (y < w - 1 && !hull[i + w]) ||
                x === 0 ||
                y === 0 ||
                x === w - 1 ||
                y === w - 1
              ) {
                if (cand[i]) {
                  dist[i] = 0;
                  q[qt++] = i;
                  peel[i] = 1;
                }
              }
            }
          while (qh < qt) {
            var p = q[qh++],
              dd = dist[p];
            if (dd >= lim) continue;
            x = p % w;
            y = (p / w) | 0;
            var nb = [
              x > 0 ? p - 1 : -1,
              x < w - 1 ? p + 1 : -1,
              y > 0 ? p - w : -1,
              y < w - 1 ? p + w : -1
            ];
            for (var k = 0; k < 4; k++) {
              var s = nb[k];
              if (s >= 0 && cand[s] && dist[s] < 0) {
                dist[s] = dd + 1;
                peel[s] = 1;
                q[qt++] = s;
              }
            }
          }
          var pd = segDilate(peel, w, w, 2);
          for (i = 0; i < n; i++) if (pd[i] && hull[i]) A[i] = 0;
        }
      }
    }
    // borda: curva + filtro guiado pela foto
    var A0 = new Float32Array(n);
    for (i = 0; i < n; i++) {
      var t = (A[i] - 0.52) / 0.16 + 0.5;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      A0[i] = t * t * (3 - 2 * t);
    }
    var Ag = segGuided(g, A0, w, w, 3, 2e-5);
    for (i = 0; i < n; i++) {
      var u = (Ag[i] - 0.35) / 0.3;
      u = u < 0 ? 0 : u > 1 ? 1 : u;
      Ag[i] = u * u * (3 - 2 * u);
    }
    // tira ilhas pequenas (restos de fundo), mantém peças grandes
    var bm = new Uint8Array(n);
    for (i = 0; i < n; i++) bm[i] = Ag[i] > 0.5 ? 1 : 0;
    var kp = segLargest(bm, w, w, 0.12),
      kd = segDilate(kp, w, w, 6);
    for (i = 0; i < n; i++) if (!kd[i]) Ag[i] = 0;
    // descontamina a cor da borda: puxa a cor de dentro para fora
    var cr_ = new Float32Array(n),
      cg_ = new Float32Array(n),
      cb_ = new Float32Array(n),
      wt = new Float32Array(n);
    for (i = 0; i < n; i++) {
      var c0 = Ag[i] > 0.97 ? 1 : 0;
      wt[i] = c0;
      cr_[i] = (id[i * 4] / 255) * c0;
      cg_[i] = (id[i * 4 + 1] / 255) * c0;
      cb_[i] = (id[i * 4 + 2] / 255) * c0;
    }
    var rs = [2, 3, 6, 12],
      er = new Float32Array(n),
      eg = new Float32Array(n),
      eb = new Float32Array(n),
      ew = new Float32Array(n),
      ri;
    for (ri = 0; ri < rs.length; ri++) {
      segBox(cr_, w, w, rs[ri], er, tmp);
      segBox(cg_, w, w, rs[ri], eg, tmp);
      segBox(cb_, w, w, rs[ri], eb, tmp);
      segBox(wt, w, w, rs[ri], ew, tmp);
      for (i = 0; i < n; i++)
        if (wt[i] < 0.5 && ew[i] > 0.02) {
          cr_[i] = er[i] / ew[i];
          cg_[i] = eg[i] / ew[i];
          cb_[i] = eb[i] / ew[i];
          wt[i] = 1;
        }
    }
    // composição final em S×S (miolo = pixels originais)
    var fc = mkCanvas(w, w),
      fg = fc.getContext('2d'),
      fd = fg.createImageData(w, w),
      ac2 = mkCanvas(w, w),
      ag2 = ac2.getContext('2d'),
      ad2 = ag2.createImageData(w, w);
    for (i = 0; i < n; i++) {
      var inner = Ag[i] > 0.97;
      fd.data[i * 4] = inner ? id[i * 4] : Math.round(cr_[i] * 255);
      fd.data[i * 4 + 1] = inner ? id[i * 4 + 1] : Math.round(cg_[i] * 255);
      fd.data[i * 4 + 2] = inner ? id[i * 4 + 2] : Math.round(cb_[i] * 255);
      fd.data[i * 4 + 3] = 255;
      var av = Math.round(Ag[i] * 255);
      ad2.data[i * 4] = av;
      ad2.data[i * 4 + 1] = av;
      ad2.data[i * 4 + 2] = av;
      ad2.data[i * 4 + 3] = 255;
    }
    fg.putImageData(fd, 0, 0);
    ag2.putImageData(ad2, 0, 0);
    var out = mkCanvas(S, S),
      og = out.getContext('2d');
    og.imageSmoothingQuality = 'high';
    var fcU = mkCanvas(S, S),
      acU = mkCanvas(S, S);
    [
      [fc, fcU],
      [ac2, acU]
    ].forEach(function (pr) {
      var gg = pr[1].getContext('2d');
      gg.imageSmoothingQuality = 'high';
      gg.drawImage(pr[0], 0, 0, S, S);
    });
    var crd = cr.getContext('2d').getImageData(0, 0, S, S).data,
      fU = fcU.getContext('2d').getImageData(0, 0, S, S).data,
      aU = acU.getContext('2d').getImageData(0, 0, S, S).data,
      od = og.createImageData(S, S),
      N2 = S * S;
    for (i = 0; i < N2; i++) {
      var al = aU[i * 4] / 255,
        o4 = i * 4;
      if (al >= 0.985) {
        od.data[o4] = crd[o4];
        od.data[o4 + 1] = crd[o4 + 1];
        od.data[o4 + 2] = crd[o4 + 2];
      } else if (al <= 0.004) {
        od.data[o4] = 255;
        od.data[o4 + 1] = 255;
        od.data[o4 + 2] = 255;
      } else {
        od.data[o4] = fU[o4] * al + 255 * (1 - al);
        od.data[o4 + 1] = fU[o4 + 1] * al + 255 * (1 - al);
        od.data[o4 + 2] = fU[o4 + 2] * al + 255 * (1 - al);
      }
      od.data[o4 + 3] = 255;
    }
    og.putImageData(od, 0, 0);
    return { canvas: out, pieces: [], model: true };
  }

  /* a borda da foto é uma folha lisa (false) ou outra coisa, como estante e balcão (true)? Conta rápida em miniatura, sem rodar o recorte */
  /* o fundo da foto já é branco liso? (borda toda quase branca e uniforme) */
  function whiteBg(full) {
    var sc = Math.min(1, 120 / Math.max(full.width, full.height)),
      w = Math.max(8, Math.round(full.width * sc)),
      h = Math.max(8, Math.round(full.height * sc)),
      c = mkCanvas(w, h),
      g = c.getContext('2d');
    g.drawImage(full, 0, 0, w, h);
    var d = g.getImageData(0, 0, w, h).data,
      ring = Math.max(2, Math.round(Math.min(w, h) * 0.03)),
      n = 0,
      ok = 0,
      x,
      y,
      i;
    for (y = 0; y < h; y++)
      for (x = 0; x < w; x++)
        if (x < ring || y < ring || x >= w - ring || y >= h - ring) {
          i = (y * w + x) * 4;
          n++;
          var mn = Math.min(d[i], d[i + 1], d[i + 2]),
            mx = Math.max(d[i], d[i + 1], d[i + 2]);
          if (mn >= 236 && mx - mn <= 14) ok++;
        }
    return n > 0 && ok / n >= 0.94;
  }
  /* fundo branco: só corta ao redor da peça e centra num quadrado branco, sem tirar fundo */
  function lightWhite(full) {
    var sc = Math.min(1, 300 / Math.max(full.width, full.height)),
      w = Math.max(8, Math.round(full.width * sc)),
      h = Math.max(8, Math.round(full.height * sc)),
      c = mkCanvas(w, h),
      g = c.getContext('2d');
    g.drawImage(full, 0, 0, w, h);
    var d = g.getImageData(0, 0, w, h).data,
      rows = new Int32Array(h),
      cols = new Int32Array(w),
      x,
      y,
      i;
    for (y = 0; y < h; y++)
      for (x = 0; x < w; x++) {
        i = (y * w + x) * 4;
        if (
          Math.min(d[i], d[i + 1], d[i + 2]) < 226 ||
          Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]) > 28
        ) {
          rows[y]++;
          cols[x]++;
        }
      }
    var y0 = 0,
      y1 = h - 1,
      x0 = 0,
      x1 = w - 1;
    while (y0 < h && rows[y0] < 2) y0++;
    while (y1 > 0 && rows[y1] < 2) y1--;
    while (x0 < w && cols[x0] < 2) x0++;
    while (x1 > 0 && cols[x1] < 2) x1--;
    if (y1 <= y0 || x1 <= x0) throw new Error('vazio');
    var bw = (x1 - x0 + 1) / w,
      bh = (y1 - y0 + 1) / h;
    if (bw * bh < 0.02) throw new Error('pequeno');
    var mg = 0.04,
      cx0 = Math.max(0, (x0 / w - mg * bw) * full.width),
      cy0 = Math.max(0, (y0 / h - mg * bh) * full.height),
      cx1 = Math.min(full.width, ((x1 + 1) / w + mg * bw) * full.width),
      cy1 = Math.min(full.height, ((y1 + 1) / h + mg * bh) * full.height),
      cw = cx1 - cx0,
      ch = cy1 - cy0,
      S2 = 2000,
      k = Math.min((S2 * 0.9) / cw, (S2 * 0.9) / ch, 1.6),
      dw = cw * k,
      dh = ch * k,
      out = mkCanvas(S2, S2),
      og = out.getContext('2d');
    og.fillStyle = '#fff';
    og.fillRect(0, 0, S2, S2);
    og.imageSmoothingQuality = 'high';
    og.drawImage(full, cx0, cy0, cw, ch, (S2 - dw) / 2, (S2 - dh) / 2, dw, dh);
    return { canvas: out, pieces: [], bbox: [x0 / w, y0 / h, (x1 + 1) / w, (y1 + 1) / h] };
  }
  // Detecta fundo de superfície/prateleira.
  function shelfLike(full) {
    var sc = Math.min(1, 120 / Math.max(full.width, full.height)),
      w = Math.max(8, Math.round(full.width * sc)),
      h = Math.max(8, Math.round(full.height * sc)),
      c = mkCanvas(w, h),
      g = c.getContext('2d');
    g.drawImage(full, 0, 0, w, h);
    var d = g.getImageData(0, 0, w, h).data,
      ring = Math.max(2, Math.round(Math.min(w, h) * 0.03)),
      R = [],
      G = [],
      B = [],
      P = [],
      x,
      y,
      i;
    for (y = 0; y < h; y++)
      for (x = 0; x < w; x++)
        if (x < ring || y < ring || x >= w - ring || y >= h - ring) {
          i = (y * w + x) * 4;
          R.push(d[i]);
          G.push(d[i + 1]);
          B.push(d[i + 2]);
          P.push(i);
        }
    var md = function (a) {
        a = a.slice().sort(function (p, q) {
          return p - q;
        });
        return a[a.length >> 1];
      },
      r0 = md(R),
      g0 = md(G),
      b0 = md(B),
      n = 0;
    P.forEach(function (i) {
      var a = d[i] - r0,
        b = d[i + 1] - g0,
        e = d[i + 2] - b0;
      if (Math.sqrt(a * a + b * b + e * e) + 2 * Math.max(0, Math.abs(a - e) - 16) < 38) n++;
    });
    return n / P.length < 0.8;
  }
  /* Plano B que NUNCA corta a armação: só corrige a iluminação do fundo (vira branco) e centraliza. Não recorta nada. */
  function flatWhite(full) {
    var W = full.width,
      H = full.height,
      k = Math.min(1, 2000 / Math.max(W, H)),
      w = Math.round(W * k),
      h = Math.round(H * k),
      c = mkCanvas(w, h),
      g = c.getContext('2d');
    g.drawImage(full, 0, 0, w, h);
    var lw = Math.max(40, Math.round((220 * w) / Math.max(w, h))),
      lh = Math.max(40, Math.round((220 * h) / Math.max(w, h))),
      sm = mkCanvas(lw, lh),
      sg = sm.getContext('2d');
    sg.drawImage(c, 0, 0, lw, lh);
    var d = sg.getImageData(0, 0, lw, lh).data,
      n = lw * lh,
      R = Math.round(Math.min(lw, lh) * 0.16),
      ch,
      i,
      x,
      y,
      j,
      mx = new Float32Array(n),
      t = new Float32Array(n),
      bg = new Uint8ClampedArray(n * 4);
    for (ch = 0; ch < 3; ch++) {
      for (y = 0; y < lh; y++)
        for (x = 0; x < lw; x++) {
          var m = 0,
            a = Math.max(0, x - R),
            b = Math.min(lw - 1, x + R);
          for (j = a; j <= b; j++) {
            var v = d[(y * lw + j) * 4 + ch];
            if (v > m) m = v;
          }
          t[y * lw + x] = m;
        }
      for (x = 0; x < lw; x++)
        for (y = 0; y < lh; y++) {
          var m2 = 0,
            a2 = Math.max(0, y - R),
            b2 = Math.min(lh - 1, y + R);
          for (j = a2; j <= b2; j++) {
            var v2 = t[j * lw + x];
            if (v2 > m2) m2 = v2;
          }
          mx[y * lw + x] = m2;
        }
      for (i = 0; i < n; i++) bg[i * 4 + ch] = mx[i];
    }
    for (i = 0; i < n; i++) bg[i * 4 + 3] = 255;
    var bc = mkCanvas(lw, lh);
    bc.getContext('2d').putImageData(new ImageData(bg, lw, lh), 0, 0);
    var bb = mkCanvas(w, h),
      bgx = bb.getContext('2d');
    bgx.filter = 'blur(' + Math.max(2, Math.round(w / 25)) + 'px)';
    bgx.drawImage(bc, 0, 0, w, h);
    var sd = g.getImageData(0, 0, w, h),
      bd = bgx.getImageData(0, 0, w, h).data,
      p = sd.data,
      N = w * h;
    for (i = 0; i < N; i++) {
      var o = i * 4,
        r = p[o],
        gg = p[o + 1],
        bl = p[o + 2],
        g1 = Math.min(1.9, Math.max(1, 250 / Math.max(60, bd[o]))),
        g2 = Math.min(1.9, Math.max(1, 250 / Math.max(60, bd[o + 1]))),
        g3 = Math.min(1.9, Math.max(1, 250 / Math.max(60, bd[o + 2])));
      r = Math.min(255, r * g1);
      gg = Math.min(255, gg * g2);
      bl = Math.min(255, bl * g3);
      if (r > 238 && gg > 238 && bl > 238) {
        r = gg = bl = 255;
      }
      p[o] = r;
      p[o + 1] = gg;
      p[o + 2] = bl;
    }
    g.putImageData(sd, 0, 0);
    return lightWhite(c);
  }
  // Fluxo principal do fundo branco: escolhe o método e recusa quando não é seguro.
  function whiten(full) {
    // variáveis compartilhadas entre as fases
    var W,
      H,
      sc,
      sw,
      sh,
      d,
      N,
      i,
      x,
      y,
      ring,
      br,
      bg,
      bb,
      dist,
      T,
      isBg,
      q,
      qh,
      qt,
      seed,
      grow,
      hull,
      fg,
      seen,
      comps,
      bx0,
      by0,
      bx1,
      by1,
      seamM,
      nb,
      m,
      pieces,
      fg2,
      insD,
      nearM,
      cx0,
      cy0,
      obD,
      hullIn,
      yEnd,
      kc,
      shm,
      devA,
      ma,
      fd,
      o,
      mp,
      o0,
      fm,
      zb,
      smB,
      owB,
      prB,
      kb,
      S2,
      sq,
      qg;
    // fases, em ordem
    lerFotoEMedirFundo();
    detectarModoEstante();
    limparRuidoEMesa();
    agruparPecas();
    reforcarContornoEstante();
    tirarPosteEPonte();
    mascaraNoTamanhoOriginal();
    achatarEmendaDaEstante();
    corOriginalDaArmacao();
    suavizarFundo();
    bordaEOpacidade();
    recortarECentralizar();
    nitidezFinal();
    return {
      canvas: sq,
      pieces: pieces,
      bbox: [bx0 / sw, by0 / sh, (bx1 + 1) / sw, (by1 + 1) / sh],
      bg: [br, bg, bb],
      hex:
        '#' +
        [br, bg, bb]
          .map(function (v) {
            return ('0' + v.toString(16)).slice(-2);
          })
          .join('')
    };

    // Reduz a foto, mede a cor do fundo pela moldura e prepara distâncias, sombra e sementes.
    function lerFotoEMedirFundo() {
      var sm, sg, R, G, B, med, shadow, step;
      ((W = full.width),
        (H = full.height),
        (sc = Math.min(1, 440 / Math.max(W, H))),
        (sw = Math.max(8, Math.round(W * sc))),
        (sh = Math.max(8, Math.round(H * sc))));
      ((sm = mkCanvas(sw, sh)), (sg = sm.getContext('2d')));
      sg.imageSmoothingQuality = 'high';
      sg.drawImage(full, 0, 0, sw, sh);
      ((d = sg.getImageData(0, 0, sw, sh).data), (N = sw * sh));
      // cor do fundo: mediana da moldura
      ((ring = Math.max(3, Math.round(Math.min(sw, sh) * 0.03))), (R = []), (G = []), (B = []));
      for (y = 0; y < sh; y++)
        for (x = 0; x < sw; x++) {
          if (x < ring || y < ring || x >= sw - ring || y >= sh - ring) {
            i = (y * sw + x) * 4;
            R.push(d[i]);
            G.push(d[i + 1]);
            B.push(d[i + 2]);
          }
        }
      ((med = function (a) {
        a.sort(function (p, q) {
          return p - q;
        });
        return a[a.length >> 1];
      }),
        (br = med(R)),
        (bg = med(G)),
        (bb = med(B)));
      dist = function (p) {
        var a = d[p * 4] - br,
          b = d[p * 4 + 1] - bg,
          c = d[p * 4 + 2] - bb;
        return Math.sqrt(a * a + b * b + c * c) + 2 * Math.max(0, Math.abs(a - c) - 16);
      };
      ((T = 38), (isBg = new Uint8Array(N)), (q = new Int32Array(N)), (qh = 0), (qt = 0));
      shadow = function (p) {
        var r = d[p * 4],
          g = d[p * 4 + 1],
          b = d[p * 4 + 2],
          kr = r / Math.max(1, br),
          kg = g / Math.max(1, bg),
          kb = b / Math.max(1, bb),
          k = (kr + kg + kb) / 3;
        return k > 0.6 && Math.max(Math.abs(kr - k), Math.abs(kg - k), Math.abs(kb - k)) < 0.035;
      };
      step = function (p, n) {
        return Math.max(
          Math.abs(d[p * 4] - d[n * 4]),
          Math.abs(d[p * 4 + 1] - d[n * 4 + 1]),
          Math.abs(d[p * 4 + 2] - d[n * 4 + 2])
        );
      };
      seed = function (p) {
        if (!isBg[p] && dist(p) < T) {
          isBg[p] = 1;
          q[qt++] = p;
        }
      };
      grow = function (p, n) {
        if (!isBg[n] && (dist(n) < T || (shadow(n) && step(p, n) < 9))) {
          isBg[n] = 1;
          q[qt++] = n;
        }
      };
      // modo estante: quando a borda da foto não é o fundo (vitrine, chão, reflexos), o fundo é a cor dominante da estante
      hull = null;
    }

    // Modo estante: quando a borda não é o fundo (vitrine, chão, reflexos), usa a cor dominante da estante.
    function detectarModoEstante() {
      var p, px, py;
      (function () {
        var nb = 0,
          tot = 0;
        for (y = 0; y < sh; y++)
          for (x = 0; x < sw; x++) {
            if (x < ring || y < ring || x >= sw - ring || y >= sh - ring) {
              tot++;
              if (dist(y * sw + x) < T) nb++;
            }
          }
        window.__bf = nb / tot;
        if (nb / tot >= 0.8) return;
        var h = {},
          bk = -1,
          bc = 0,
          x0 = Math.round(sw * 0.08),
          x1 = Math.round(sw * 0.92),
          y0 = Math.round(sh * 0.08),
          y1 = Math.round(sh * 0.92),
          p,
          k;
        for (y = y0; y < y1; y++)
          for (x = x0; x < x1; x++) {
            p = y * sw + x;
            k = (d[p * 4] >> 4) * 256 + (d[p * 4 + 1] >> 4) * 16 + (d[p * 4 + 2] >> 4);
            h[k] = (h[k] || 0) + 1;
            if (h[k] > bc) {
              bc = h[k];
              bk = k;
            }
          }
        var sr = 0,
          sg2 = 0,
          sb = 0,
          sn = 0;
        for (y = y0; y < y1; y++)
          for (x = x0; x < x1; x++) {
            p = y * sw + x;
            k = (d[p * 4] >> 4) * 256 + (d[p * 4 + 1] >> 4) * 16 + (d[p * 4 + 2] >> 4);
            if (k === bk) {
              sr += d[p * 4];
              sg2 += d[p * 4 + 1];
              sb += d[p * 4 + 2];
              sn++;
            }
          }
        if (!sn || (sr + sg2 + sb) / sn / 3 < 135) return;
        var ob = [br, bg, bb];
        br = Math.round(sr / sn);
        bg = Math.round(sg2 / sn);
        bb = Math.round(sb / sn);
        var st = new Uint8Array(N),
          lab = new Uint8Array(N),
          comps2 = [],
          maxC = 0,
          j;
        for (j = 0; j < N; j++) st[j] = dist(j) < T ? 1 : 0;
        for (j = 0; j < N; j++) {
          if (!st[j] || lab[j]) continue;
          var cm = [j];
          lab[j] = 1;
          for (var q = 0; q < cm.length; q++) {
            var c = cm[q],
              cx = c % sw,
              cy = (c / sw) | 0;
            if (cx > 0 && st[c - 1] && !lab[c - 1]) {
              lab[c - 1] = 1;
              cm.push(c - 1);
            }
            if (cx < sw - 1 && st[c + 1] && !lab[c + 1]) {
              lab[c + 1] = 1;
              cm.push(c + 1);
            }
            if (cy > 0 && st[c - sw] && !lab[c - sw]) {
              lab[c - sw] = 1;
              cm.push(c - sw);
            }
            if (cy < sh - 1 && st[c + sw] && !lab[c + sw]) {
              lab[c + sw] = 1;
              cm.push(c + sw);
            }
          }
          comps2.push(cm);
          if (cm.length > maxC) maxC = cm.length;
        }
        if (maxC < N * 0.12) {
          br = ob[0];
          bg = ob[1];
          bb = ob[2];
          return;
        }
        var mn = new Int32Array(sh).fill(sw),
          mx2 = new Int32Array(sh).fill(-1);
        comps2.forEach(function (cm) {
          if (cm.length < maxC * 0.1) return;
          cm.forEach(function (c) {
            var cy = (c / sw) | 0,
              cx = c % sw;
            if (cx < mn[cy]) mn[cy] = cx;
            if (cx > mx2[cy]) mx2[cy] = cx;
          });
        });
        (function () {
          var ws = [];
          for (var r0 = 0; r0 < sh; r0++) if (mx2[r0] >= mn[r0]) ws.push(mx2[r0] - mn[r0]);
          ws.sort(function (p, q) {
            return p - q;
          });
          var mw = ws.length ? ws[ws.length >> 1] : 0,
            okr = function (r0) {
              return mx2[r0] >= mn[r0] && mx2[r0] - mn[r0] >= mw * 0.6;
            };
          var gm = Math.round(sh * 0.1),
            last = -1;
          for (var yy = 0; yy < sh; yy++) {
            if (okr(yy)) last = yy;
            else if (last >= 0 && yy - last <= gm) {
              mn[yy] = mn[last];
              mx2[yy] = mx2[last];
            }
          }
          last = -1;
          for (var y3 = sh - 1; y3 >= 0; y3--) {
            if (okr(y3)) last = y3;
            else if (last >= 0 && last - y3 <= gm && !okr(y3)) {
              mn[y3] = mn[last];
              mx2[y3] = mx2[last];
            }
          }
        })();
        hull = new Uint8Array(N);
        var ep = Math.max(3, Math.round(sw * 0.014));
        for (y = 0; y < sh; y++) for (x = mn[y] + ep; x <= mx2[y] - ep; x++) hull[y * sw + x] = 1;
      })();
      {
        if (hull) T = window.__T || 26;
        if (hull) {
          for (i = 0; i < N; i++) {
            if (!hull[i]) {
              isBg[i] = 1;
              q[qt++] = i;
            } else seed(i);
          }
        } else {
          for (x = 0; x < sw; x++) {
            seed(x);
            seed((sh - 1) * sw + x);
          }
          for (y = 0; y < sh; y++) {
            seed(y * sw);
            seed(y * sw + sw - 1);
          }
        }
        while (qh < qt) {
          ((p = q[qh++]), (px = p % sw), (py = (p / sw) | 0));
          if (px > 0) grow(p, p - 1);
          if (px < sw - 1) grow(p, p + 1);
          if (py > 0) grow(p, p - sw);
          if (py < sh - 1) grow(p, p + sw);
        }
      }
    }

    // Mantém só os pedaços grandes do produto e remove linhas finas da mesa que cruzam a foto.
    function limparRuidoEMesa() {
      var seamHit;
      // áreas internas parecidas com o fundo (lentes transparentes)
      for (i = 0; i < N; i++) if (!isBg[i] && dist(i) < 32) isBg[i] = 1;
      // mantém só os pedaços grandes do produto (some texto, etiquetas e pontinhos)
      ((fg = new Uint8Array(N)),
        (seen = new Uint8Array(N)),
        (comps = []),
        (bx0 = sw),
        (by0 = sh),
        (bx1 = 0),
        (by1 = 0));
      for (i = 0; i < N; i++) fg[i] = isBg[i] ? 0 : 1;
      // remove linhas escuras finas e longas e retas (emendas da mesa) que cruzam a foto
      ((seamM = new Uint8Array(N)), (seamHit = false));
      [4, 6].forEach(function (R) {
        var dk = new Uint8Array(N);
        if (R === 6 && seamHit) {
          for (var y2 = 0; y2 < sh; y2++) {
            var x2 = 0;
            while (x2 < sw) {
              var i2 = y2 * sw + x2,
                r2 = d[i2 * 4],
                g2 = d[i2 * 4 + 1],
                b2 = d[i2 * 4 + 2];
              if (
                fg[i2] &&
                Math.max(r2, g2, b2) < 100 &&
                Math.max(r2, g2, b2) - Math.min(r2, g2, b2) < 22
              ) {
                var e2 = x2;
                while (e2 < sw) {
                  var q2 = y2 * sw + e2,
                    rr = d[q2 * 4],
                    gg = d[q2 * 4 + 1],
                    bb = d[q2 * 4 + 2];
                  if (
                    !(
                      fg[q2] &&
                      Math.max(rr, gg, bb) < 100 &&
                      Math.max(rr, gg, bb) - Math.min(rr, gg, bb) < 22
                    )
                  )
                    break;
                  e2++;
                }
                if (e2 - x2 < 14)
                  for (var z = x2 - 2; z < e2 + 2; z++)
                    if (z >= 0 && z < sw) {
                      fg[y2 * sw + z] = 0;
                    }
                x2 = e2;
              } else x2++;
            }
          }
        }
        for (var j = 0; j < N; j++) {
          var r = d[j * 4],
            g = d[j * 4 + 1],
            b = d[j * 4 + 2],
            mx = Math.max(r, g, b);
          if (fg[j] && mx < 150 && mx - Math.min(r, g, b) < 34) dk[j] = 1;
        }
        function mm(src, isMax) {
          var t = new Uint8Array(N),
            o = new Uint8Array(N),
            x,
            y,
            k,
            v;
          for (y = 0; y < sh; y++)
            for (x = 0; x < sw; x++) {
              v = isMax ? 0 : 1;
              for (k = -R; k <= R; k++) {
                var X = x + k;
                if (X < 0 || X >= sw) {
                  if (!isMax) v = 0;
                  continue;
                }
                var q = src[y * sw + X];
                if (isMax) {
                  if (q) {
                    v = 1;
                    break;
                  }
                } else if (!q) {
                  v = 0;
                  break;
                }
              }
              t[y * sw + x] = v;
            }
          for (y = 0; y < sh; y++)
            for (x = 0; x < sw; x++) {
              v = isMax ? 0 : 1;
              for (k = -R; k <= R; k++) {
                var Y = y + k;
                if (Y < 0 || Y >= sh) {
                  if (!isMax) v = 0;
                  continue;
                }
                var q2 = t[Y * sw + x];
                if (isMax) {
                  if (q2) {
                    v = 1;
                    break;
                  }
                } else if (!q2) {
                  v = 0;
                  break;
                }
              }
              o[y * sw + x] = v;
            }
          return o;
        }
        var op = mm(mm(dk, false), true),
          thin = new Uint8Array(N),
          sn = new Uint8Array(N),
          L = [];
        for (var j = 0; j < N; j++) thin[j] = dk[j] && !op[j] ? 1 : 0;
        for (var j = 0; j < N; j++) {
          if (!thin[j] || sn[j]) continue;
          var cm = [j],
            x0 = sw,
            x1 = 0,
            y0 = sh,
            y1 = 0;
          sn[j] = 1;
          for (var k = 0; k < cm.length; k++) {
            var c = cm[k],
              cx = c % sw,
              cy = (c / sw) | 0;
            if (cx < x0) x0 = cx;
            if (cx > x1) x1 = cx;
            if (cy < y0) y0 = cy;
            if (cy > y1) y1 = cy;
            for (var yy = -1; yy <= 1; yy++)
              for (var xx = -1; xx <= 1; xx++) {
                var X = cx + xx,
                  Y = cy + yy;
                if (X < 0 || Y < 0 || X >= sw || Y >= sh) continue;
                var n = Y * sw + X;
                if (thin[n] && !sn[n]) {
                  sn[n] = 1;
                  cm.push(n);
                }
              }
          }
          var w = x1 - x0 + 1,
            h = y1 - y0 + 1,
            len = Math.max(w, h);
          if (h > 0.1 * Math.max(sw, sh) && h > w * 4) {
            L.push(cm);
            seamHit = true;
          }
        }
        L.forEach(function (cm) {
          cm.forEach(function (c) {
            var cx = c % sw,
              cy = (c / sw) | 0;
            for (var yy = -2; yy <= 2; yy++)
              for (var xx = -2; xx <= 2; xx++) {
                var X = cx + xx,
                  Y = cy + yy;
                if (X < 0 || Y < 0 || X >= sw || Y >= sh) continue;
                var n = Y * sw + X,
                  r = d[n * 4],
                  g = d[n * 4 + 1],
                  b = d[n * 4 + 2];
                if (Math.max(r, g, b) - Math.min(r, g, b) < 34) {
                  fg[n] = 0;
                  seamM[n] = 1;
                }
              }
          });
        });
      });
    }

    // Agrupa os componentes e separa as peças.
    function agruparPecas() {
      var comp, k, c, cx, cy, maxA, bigC, cbb, bg0, bxs;
      for (i = 0; i < N; i++) {
        if (!fg[i] || seen[i]) continue;
        comp = [i];
        seen[i] = 1;
        for (k = 0; k < comp.length; k++) {
          ((c = comp[k]), (cx = c % sw), (cy = (c / sw) | 0), (nb = []));
          if (cx > 0) nb.push(c - 1);
          if (cx < sw - 1) nb.push(c + 1);
          if (cy > 0) nb.push(c - sw);
          if (cy < sh - 1) nb.push(c + sw);
          for (m = 0; m < nb.length; m++) {
            if (fg[nb[m]] && !seen[nb[m]]) {
              seen[nb[m]] = 1;
              comp.push(nb[m]);
            }
          }
        }
        comps.push(comp);
      }
      maxA = 0;
      comps.forEach(function (c) {
        if (c.length > maxA) maxA = c.length;
      });
      if (hull) {
        bigC = null;
        comps.forEach(function (c) {
          if (c.length === maxA) bigC = c;
        });
        ((cbb = function (c) {
          var a = sw,
            b = sh,
            e = 0,
            f = 0;
          for (var t = 0; t < c.length; t++) {
            var X = c[t] % sw,
              Y = (c[t] / sw) | 0;
            if (X < a) a = X;
            if (X > e) e = X;
            if (Y < b) b = Y;
            if (Y > f) f = Y;
          }
          return [a, b, e, f];
        }),
          (bg0 = cbb(bigC)));
        comps = comps.filter(function (c) {
          if (c === bigC || c.length < maxA * 0.15) return true;
          var touch = false;
          for (var t = 0; t < c.length && !touch; t++) {
            var X = c[t] % sw,
              Y = (c[t] / sw) | 0;
            [
              [3, 0],
              [-3, 0],
              [0, 3],
              [0, -3]
            ].forEach(function (o) {
              var X2 = X + o[0],
                Y2 = Y + o[1];
              if (X2 < 0 || Y2 < 0 || X2 >= sw || Y2 >= sh || !hull[Y2 * sw + X2]) touch = true;
            });
          }
          var b2 = cbb(c),
            far =
              (b2[0] > bg0[2] + sw * 0.18 ||
                b2[2] < bg0[0] - sw * 0.18 ||
                b2[1] > bg0[3] + sh * 0.18 ||
                b2[3] < bg0[1] - sh * 0.18) &&
              c.length < maxA * 0.4;
          if (touch || far) {
            for (var t = 0; t < c.length; t++) fg[c[t]] = 0;
            return false;
          }
          return true;
        });
      }
      comps.forEach(function (c) {
        if (c.length < maxA * 0.15) {
          for (var t = 0; t < c.length; t++) fg[c[t]] = 0;
        }
      });
      for (i = 0; i < N; i++)
        if (fg[i]) {
          x = i % sw;
          y = (i / sw) | 0;
          if (x < bx0) bx0 = x;
          if (x > bx1) bx1 = x;
          if (y < by0) by0 = y;
          if (y > by1) by1 = y;
        }
      if (bx1 <= bx0 || by1 <= by0) {
        bx0 = 0;
        by0 = 0;
        bx1 = sw - 1;
        by1 = sh - 1;
        for (i = 0; i < N; i++) fg[i] = 1;
      }
      bxs = [];
      comps.forEach(function (c) {
        if (c.length < maxA * 0.15) return;
        var a = sw,
          b = sh,
          e = 0,
          f = 0;
        for (var t = 0; t < c.length; t++) {
          var X = c[t] % sw,
            Y = (c[t] / sw) | 0;
          if (X < a) a = X;
          if (X > e) e = X;
          if (Y < b) b = Y;
          if (Y > f) f = Y;
        }
        bxs.push([a, b, e, f]);
      });
      (function () {
        var gap = Math.max(sw, sh) * 0.04,
          mg = true;
        while (mg) {
          mg = false;
          for (var u = 0; u < bxs.length && !mg; u++)
            for (var v = u + 1; v < bxs.length && !mg; v++) {
              var A = bxs[u],
                C = bxs[v];
              if (
                A[0] - gap <= C[2] &&
                C[0] - gap <= A[2] &&
                A[1] - gap <= C[3] &&
                C[1] - gap <= A[3]
              ) {
                bxs[u] = [
                  Math.min(A[0], C[0]),
                  Math.min(A[1], C[1]),
                  Math.max(A[2], C[2]),
                  Math.max(A[3], C[3])
                ];
                bxs.splice(v, 1);
                mg = true;
              }
            }
        }
      })();
      pieces = bxs
        .filter(function (b) {
          return (b[2] - b[0]) * (b[3] - b[1]) > sw * sh * 0.01;
        })
        .map(function (b) {
          return [b[0] / sw, b[1] / sh, (b[2] + 1) / sw, (b[3] + 1) / sh];
        })
        .sort(function (p, q) {
          return (p[1] + p[3]) / 2 - (q[1] + q[3]) / 2 || p[0] - q[0];
        });
    }

    // Estante: reforça a armação clara/translúcida pelo contraste e mantém só o que está dentro do contorno.
    function reforcarContornoEstante() {
      var Lm,
        Gm,
        E,
        qx,
        qy,
        ii,
        gx,
        gy,
        it,
        add2,
        jj,
        on,
        yy,
        xx,
        X,
        Y,
        rc,
        fgC,
        tc,
        l1,
        l2,
        rn,
        l3,
        l4,
        ob,
        qq,
        qt2,
        k2,
        c0,
        tcc,
        rcD,
        l9,
        l8,
        rr,
        t1,
        last,
        lastY;
      /* modo estante: a borda clara/translúcida da armação some no fundo claro; reforça pelas linhas de contraste ligadas ao que já foi achado */
      if (hull) {
        ((Lm = new Float32Array(N)), (Gm = new Float32Array(N)), (E = new Uint8Array(N)));
        for (i = 0; i < N; i++)
          Lm[i] = d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114;
        for (qy = 1; qy < sh - 1; qy++)
          for (qx = 1; qx < sw - 1; qx++) {
            ((ii = qy * sw + qx),
              (gx =
                Lm[ii - sw + 1] +
                2 * Lm[ii + 1] +
                Lm[ii + sw + 1] -
                (Lm[ii - sw - 1] + 2 * Lm[ii - 1] + Lm[ii + sw - 1])),
              (gy =
                Lm[ii + sw - 1] +
                2 * Lm[ii + sw] +
                Lm[ii + sw + 1] -
                (Lm[ii - sw - 1] + 2 * Lm[ii - sw] + Lm[ii - sw + 1])));
            if (hull[ii] && Math.sqrt(gx * gx + gy * gy) > EDGE_T) E[ii] = 1;
          }
        for (it = 0; it < 6; it++) {
          add2 = [];
          for (qy = 1; qy < sh - 1; qy++)
            for (qx = 1; qx < sw - 1; qx++) {
              jj = qy * sw + qx;
              if (
                E[jj] &&
                !fg[jj] &&
                (fg[jj - 1] ||
                  fg[jj + 1] ||
                  fg[jj - sw] ||
                  fg[jj + sw] ||
                  fg[jj - sw - 1] ||
                  fg[jj + sw + 1] ||
                  fg[jj - sw + 1] ||
                  fg[jj + sw - 1])
              )
                add2.push(jj);
            }
          if (!add2.length) break;
          add2.forEach(function (j3) {
            fg[j3] = 1;
          });
        }
      }
      // expande 2px para não comer a borda e suaviza
      fg2 = new Uint8Array(N);
      for (y = 0; y < sh; y++)
        for (x = 0; x < sw; x++) {
          on = 0;
          for (yy = -2; yy <= 2 && !on; yy++)
            for (xx = -2; xx <= 2; xx++) {
              ((X = x + xx), (Y = y + yy));
              if (X >= 0 && Y >= 0 && X < sw && Y < sh && fg[Y * sw + X]) {
                on = 1;
                break;
              }
            }
          fg2[y * sw + x] = on;
        }
      /* modo estante: só mantém o que está dentro do contorno da armação (com buracos das lentes preenchidos); o resto vira branco puro */
      insD = null;
      if (hull) {
        ((rc = Math.max(3, Math.round(sw * 0.011))),
          (fgC = new Uint8Array(N)),
          (tc = new Uint8Array(N)));
        for (y = 0; y < sh; y++) {
          l1 = -9999;
          for (x = 0; x < sw; x++) {
            if (fg2[y * sw + x]) l1 = x;
            if (x - l1 <= rc) tc[y * sw + x] = 1;
          }
          l1 = 9999;
          for (x = sw - 1; x >= 0; x--) {
            if (fg2[y * sw + x]) l1 = x;
            if (l1 - x <= rc) tc[y * sw + x] = 1;
          }
        }
        for (x = 0; x < sw; x++) {
          l2 = -9999;
          for (y = 0; y < sh; y++) {
            if (tc[y * sw + x]) l2 = y;
            if (y - l2 <= rc) fgC[y * sw + x] = 1;
          }
          l2 = 9999;
          for (y = sh - 1; y >= 0; y--) {
            if (tc[y * sw + x]) l2 = y;
            if (l2 - y <= rc) fgC[y * sw + x] = 1;
          }
        }
        ((rn = Math.max(5, Math.round(sw * 0.04))), (nearM = new Uint8Array(N)));
        tc = new Uint8Array(N);
        for (y = 0; y < sh; y++) {
          l3 = -9999;
          for (x = 0; x < sw; x++) {
            if (fg2[y * sw + x]) l3 = x;
            if (x - l3 <= rn) tc[y * sw + x] = 1;
          }
          l3 = 9999;
          for (x = sw - 1; x >= 0; x--) {
            if (fg2[y * sw + x]) l3 = x;
            if (l3 - x <= rn) tc[y * sw + x] = 1;
          }
        }
        for (x = 0; x < sw; x++) {
          l4 = -9999;
          for (y = 0; y < sh; y++) {
            if (tc[y * sw + x]) l4 = y;
            if (y - l4 <= rn) nearM[y * sw + x] = 1;
          }
          l4 = 9999;
          for (y = sh - 1; y >= 0; y--) {
            if (tc[y * sw + x]) l4 = y;
            if (l4 - y <= rn) nearM[y * sw + x] = 1;
          }
        }
        ((ob = new Uint8Array(N)), (qq = new Int32Array(N)), (qh = 0), (qt2 = 0));
        for (x = 0; x < sw; x++) {
          k2 = x;
          if (!fgC[k2] && !ob[k2]) {
            ob[k2] = 1;
            qq[qt2++] = k2;
          }
          k2 = (sh - 1) * sw + x;
          if (!fgC[k2] && !ob[k2]) {
            ob[k2] = 1;
            qq[qt2++] = k2;
          }
        }
        for (y = 0; y < sh; y++) {
          k2 = y * sw;
          if (!fgC[k2] && !ob[k2]) {
            ob[k2] = 1;
            qq[qt2++] = k2;
          }
          k2 = y * sw + sw - 1;
          if (!fgC[k2] && !ob[k2]) {
            ob[k2] = 1;
            qq[qt2++] = k2;
          }
        }
        while (qh < qt2) {
          ((c0 = qq[qh++]), (cx0 = c0 % sw), (cy0 = (c0 / sw) | 0));
          [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
          ].forEach(function (o) {
            var X = cx0 + o[0],
              Y = cy0 + o[1];
            if (X < 0 || Y < 0 || X >= sw || Y >= sh) return;
            var n2 = Y * sw + X;
            if (!fgC[n2] && !ob[n2]) {
              ob[n2] = 1;
              qq[qt2++] = n2;
            }
          });
        }
        ((obD = new Uint8Array(N)), (tcc = new Uint8Array(N)), (rcD = rc + 1));
        for (y = 0; y < sh; y++) {
          l9 = -9999;
          for (x = 0; x < sw; x++) {
            if (ob[y * sw + x]) l9 = x;
            if (x - l9 <= rcD) tcc[y * sw + x] = 1;
          }
          l9 = 9999;
          for (x = sw - 1; x >= 0; x--) {
            if (ob[y * sw + x]) l9 = x;
            if (l9 - x <= rcD) tcc[y * sw + x] = 1;
          }
        }
        for (x = 0; x < sw; x++) {
          l8 = -9999;
          for (y = 0; y < sh; y++) {
            if (tcc[y * sw + x]) l8 = y;
            if (y - l8 <= rcD) obD[y * sw + x] = 1;
          }
          l8 = 9999;
          for (y = sh - 1; y >= 0; y--) {
            if (tcc[y * sw + x]) l8 = y;
            if (l8 - y <= rcD) obD[y * sw + x] = 1;
          }
        }
        ((rr = Math.max(2, Math.round(sw * (window.__RR || 0.006)))), (t1 = new Uint8Array(N)));
        insD = new Uint8Array(N);
        for (y = 0; y < sh; y++) {
          last = -9999;
          for (x = 0; x < sw; x++) {
            if (!ob[y * sw + x]) last = x;
            if (x - last <= rr) t1[y * sw + x] = 1;
          }
          last = 9999;
          for (x = sw - 1; x >= 0; x--) {
            if (!ob[y * sw + x]) last = x;
            if (last - x <= rr) t1[y * sw + x] = 1;
          }
        }
        for (x = 0; x < sw; x++) {
          lastY = -9999;
          for (y = 0; y < sh; y++) {
            if (t1[y * sw + x]) lastY = y;
            if (y - lastY <= rr) insD[y * sw + x] = 1;
          }
          lastY = 9999;
          for (y = sh - 1; y >= 0; y--) {
            if (t1[y * sw + x]) lastY = y;
            if (lastY - y <= rr) insD[y * sw + x] = 1;
          }
        }
      }
    }

    // Estante: tira o poste escuro neutro da máscara, acima da ponte do nariz.
    function tirarPosteEPonte() {
      var he, hc0, hc1, yy5, xx5, r0, r1, yTop, mxs, cn, sr, q9, dx5, X5, j8;
      hullIn = null;
      if (hull) {
        hullIn = new Uint8Array(N);
        ((he = Math.max(4, Math.round(sw * 0.03))),
          (hc0 = new Int32Array(sw).fill(-1)),
          (hc1 = new Int32Array(sw).fill(-1)));
        for (yy5 = 0; yy5 < sh; yy5++)
          for (xx5 = 0; xx5 < sw; xx5++)
            if (hull[yy5 * sw + xx5]) {
              if (hc0[xx5] < 0) hc0[xx5] = yy5;
              hc1[xx5] = yy5;
            }
        for (yy5 = 0; yy5 < sh; yy5++) {
          ((r0 = -1), (r1 = -1));
          for (xx5 = 0; xx5 < sw; xx5++)
            if (hull[yy5 * sw + xx5]) {
              if (r0 < 0) r0 = xx5;
              r1 = xx5;
            }
          for (xx5 = 0; xx5 < sw; xx5++)
            if (
              hull[yy5 * sw + xx5] &&
              xx5 - r0 >= he &&
              r1 - xx5 >= he &&
              yy5 - hc0[xx5] >= he &&
              hc1[xx5] - yy5 >= he
            )
              hullIn[yy5 * sw + xx5] = 1;
        }
      }
      window.__SL = null;
      if (hull) {
        (function () {
          var n = 0,
            sx = 0,
            sy = 0,
            sxx = 0,
            sxy = 0;
          for (i = 0; i < N; i++)
            if (seamM[i]) {
              x = i % sw;
              y = (i / sw) | 0;
              n++;
              sx += x;
              sy += y;
              sxy += x * y;
              sxx += y * y;
            }
          if (n < 40) return;
          var den = n * sxx - sy * sy;
          if (Math.abs(den) < 1) return;
          var A = (n * sxy - sx * sy) / den,
            B2 = (sx - A * sy) / n;
          var ws = [];
          for (y = 0; y < sh; y++) {
            var cnt = 0;
            for (x = 0; x < sw; x++) if (seamM[y * sw + x]) cnt++;
            if (cnt >= 4) ws.push(cnt);
          }
          ws.sort(function (p2, q2) {
            return p2 - q2;
          });
          var hw = Math.max(4, Math.min(9, Math.ceil((ws.length ? ws[ws.length >> 1] : 10) / 2) + 2)),
            bgL = (br + bg + bb) / 3;
          window.__SL = [A, B2, hw];
          /* o poste da estante é neutro (cinza/preto) e mais escuro que o fundo; a armação tem cor, então fica de fora */
          for (y = 0; y < sh; y++) {
            var cx = Math.round(A * y + B2);
            for (x = cx - hw; x <= cx + hw; x++) {
              if (x < 0 || x >= sw) continue;
              var j2 = y * sw + x,
                r = d[j2 * 4],
                g = d[j2 * 4 + 1],
                b = d[j2 * 4 + 2],
                mx = Math.max(r, g, b),
                mn = Math.min(r, g, b),
                Lw = (r + g + b) / 3;
              if (hull[j2] && mx - mn < (window.__NC || 9) && Lw < bgL * (window.__ND || 0.86))
                seamM[j2] = 1;
            }
          }
          var cp = seamM.slice();
          for (y = 0; y < sh; y++)
            for (x = 0; x < sw; x++)
              if (cp[y * sw + x])
                for (var hx2 = -(window.__HD || 2); hx2 <= (window.__HD || 2); hx2++) {
                  var xx3 = x + hx2;
                  if (
                    xx3 >= 0 &&
                    xx3 < sw &&
                    hull[y * sw + xx3] &&
                    Math.abs(xx3 - Math.round(A * y + B2)) <= hw + 3
                  )
                    seamM[y * sw + xx3] = 1;
                }
        })();
      }
      /* acima da ponte (nariz) o poste escuro da estante (neutro) não é armação: tira da máscara até aparecer a cor da armação */
      if (hull && insD) {
        ((yTop = -1), (yEnd = -1), (mxs = 0));
        for (y = 0; y < sh && yTop < 0; y++)
          for (x = 0; x < sw; x++)
            if (seamM[y * sw + x] && (fg2[y * sw + x] || fg[y * sw + x])) {
              yTop = y;
              break;
            }
        if (yTop > 0) {
          for (y = yTop; y < sh && yEnd < 0; y++) {
            ((cn = 0), (sr = 0));
            for (x = 0; x < sw; x++)
              if (seamM[y * sw + x]) {
                q9 = (y * sw + x) * 4;
                sr += d[q9] - d[q9 + 2];
                cn++;
              }
            if (cn >= 3 && sr / cn >= (window.__WB || 6)) yEnd = y;
          }
          window.__YB = [yTop, yEnd, sh];
          if (yEnd > yTop && yEnd - yTop < sh * 0.12) {
            for (y = 0; y < yEnd; y++) {
              if (y < 0) continue;
              for (x = 0; x < sw; x++) {
                nb = 0;
                for (dx5 = -2; dx5 <= 2; dx5++) {
                  X5 = x + dx5;
                  if (X5 >= 0 && X5 < sw && seamM[y * sw + X5]) {
                    nb = 1;
                    break;
                  }
                }
                if (nb) {
                  j8 = y * sw + x;
                  fg[j8] = 0;
                  fg2[j8] = 0;
                  insD[j8] = 0;
                }
              }
            }
          }
        }
      }
    }

    // Leva a máscara para o tamanho original, com borda suave.
    function mascaraNoTamanhoOriginal() {
      var SL, cxb, kg, kd, shg, shd, mk2, mg, md, sa, big, bgc;
      if (hull && window.__SL && typeof yEnd === 'number' && yEnd > 0) {
        SL = window.__SL;
        for (y = yEnd; y < Math.min(sh, yEnd + Math.round(sh * (window.__BH || 0))); y++) {
          cxb = Math.round(SL[0] * y + SL[1]);
          for (x = cxb - SL[2]; x <= cxb + SL[2]; x++) {
            if (x >= 0 && x < sw && hull[y * sw + x] && fg2[y * sw + x]) seamM[y * sw + x] = 1;
          }
        }
      }
      ((kc = mkCanvas(sw, sh)), (kg = kc.getContext('2d')), (kd = kg.createImageData(sw, sh)));
      for (i = 0; i < N; i++) {
        kd.data[i * 4] = fg[i] ? 255 : 0;
        kd.data[i * 4 + 1] = !fg2[i] && insD && insD[i] && hullIn[i] && !obD[i] ? 255 : 0;
        kd.data[i * 4 + 3] = 255;
      }
      kg.putImageData(kd, 0, 0);
      ((shm = mkCanvas(sw, sh)), (shg = shm.getContext('2d')), (shd = shg.createImageData(sw, sh)));
      for (i = 0; i < N; i++) {
        shd.data[i * 4 + 3] = fg2[i] ? 255 : insD && insD[i] && hullIn[i] && !obD[i] ? 40 : 0;
      }
      shg.putImageData(shd, 0, 0);
      ((mk2 = mkCanvas(sw, sh)), (mg = mk2.getContext('2d')), (md = mg.createImageData(sw, sh)));
      for (i = 0; i < N; i++) {
        md.data[i * 4] = 255;
        md.data[i * 4 + 1] = 255;
        md.data[i * 4 + 2] = 255;
        sa = 0;
        x = i % sw;
        y = (i / sw) | 0;
        if (window.__NEWM) {
          if (insD && insD[i] && hullIn[i] && !obD[i]) sa = 255;
        } else if (
          hull &&
          hull[i] &&
          x >= bx0 - sw * 0.05 &&
          x <= bx1 + sw * 0.05 &&
          y >= by0 - sh * 0.05 &&
          y <= by1 + sh * 0.05
        )
          sa = 255;
        md.data[i * 4 + 3] = Math.max(fg2[i] ? 255 : 0, sa);
      }
      mg.putImageData(md, 0, 0);
      // máscara no tamanho original, com borda suave
      ((big = mkCanvas(W, H)), (bgc = big.getContext('2d')));
      bgc.imageSmoothingQuality = 'high';
      bgc.filter = 'blur(' + Math.max(1, Math.round(1.2 / sc)) + 'px)';
      bgc.drawImage(mk2, 0, 0, W, H);
      bgc.filter = 'none';
      ((devA = null),
        (ma = bgc.getImageData(0, 0, W, H).data),
        (fd = full.getContext('2d').getImageData(0, 0, W, H)),
        (o = fd.data));
    }

    // Estante: em vez de recortar, apaga a emenda e achata o fundo para branco, com a armação inteira.
    function achatarEmendaDaEstante() {
      var sc3,
        sg3,
        sd,
        m3,
        ok,
        mp1,
        mp2,
        d1,
        d2,
        mm2,
        mmg,
        mmd,
        u,
        mbig,
        mbg,
        sm3,
        smg,
        smd,
        on3,
        sb,
        sbg,
        sa3,
        q4,
        dvm,
        cc,
        dd,
        v,
        t3;
      if (hull) {
        // modo estante: em vez de recortar, apaga a emenda e "achata" o fundo para branco (a armação fica inteira)

        if (window.__DBG)
          window.__m = {
            sw: sw,
            sh: sh,
            hull: hull && Array.from(hull),
            fg: Array.from(fg),
            fg2: Array.from(fg2),
            ins: insD && Array.from(insD),
            seam: Array.from(seamM),
            near: insD && Array.from(nearM)
          };
        ((sc3 = mkCanvas(sw, sh)),
          (sg3 = sc3.getContext('2d')),
          (sd = sg3.createImageData(sw, sh)),
          (m3 = 0));
        for (i = 0; i < N; i++) {
          ok = hull[i] && dist(i) < 24 && !seamM[i] ? 1 : 0;
          sd.data[i * 4] = d[i * 4];
          sd.data[i * 4 + 1] = d[i * 4 + 1];
          sd.data[i * 4 + 2] = d[i * 4 + 2];
          sd.data[i * 4 + 3] = ok ? 255 : 0;
          m3 += ok;
        }
        sg3.putImageData(sd, 0, 0);
        ((mp1 = mkCanvas(sw, sh)), (mp2 = mkCanvas(sw, sh)));
        mp1.getContext('2d').filter = 'blur(10px)';
        mp1.getContext('2d').drawImage(sc3, 0, 0);
        mp2.getContext('2d').filter = 'blur(36px)';
        mp2.getContext('2d').drawImage(sc3, 0, 0);
        ((d1 = mp1.getContext('2d').getImageData(0, 0, sw, sh).data),
          (d2 = mp2.getContext('2d').getImageData(0, 0, sw, sh).data),
          (mm2 = mkCanvas(sw, sh)),
          (mmg = mm2.getContext('2d')),
          (mmd = mmg.createImageData(sw, sh)));
        for (i = 0; i < N; i++) {
          ((q = i * 4), (u = d1[q + 3] >= 40 ? d1 : d2[q + 3] >= 10 ? d2 : null));
          mmd.data[q] = u ? u[q] : br;
          mmd.data[q + 1] = u ? u[q + 1] : bg;
          mmd.data[q + 2] = u ? u[q + 2] : bb;
          mmd.data[q + 3] = 255;
        }
        mmg.putImageData(mmd, 0, 0);
        ((mbig = mkCanvas(W, H)), (mbg = mbig.getContext('2d')));
        mbg.imageSmoothingQuality = 'high';
        mbg.drawImage(mm2, 0, 0, W, H);
        mp = mbg.getImageData(0, 0, W, H).data;
        // emenda: preenche a faixa linha por linha com os vizinhos
        ((sm3 = mkCanvas(sw, sh)), (smg = sm3.getContext('2d')), (smd = smg.createImageData(sw, sh)));
        for (i = 0; i < N; i++) {
          on3 = 0;
          x = i % sw;
          y = (i / sw) | 0;
          if (seamM[i]) on3 = 1;
          smd.data[i * 4 + 3] = on3 ? 255 : 0;
        }
        smg.putImageData(smd, 0, 0);
        ((sb = mkCanvas(W, H)), (sbg = sb.getContext('2d')));
        sbg.imageSmoothingQuality = 'high';
        sbg.filter = 'blur(' + Math.max(1, Math.round(0.8 / sc)) + 'px)';
        sbg.drawImage(sm3, 0, 0, W, H);
        sa3 = sbg.getImageData(0, 0, W, H).data;
        /* emenda da estante: preenche a faixa com uma superfície suave calculada a partir dos vizinhos (esquerda, direita, cima e baixo) */
        (function () {
          var f = 4,
            mx0 = W,
            mx1 = -1,
            my0 = H,
            my1 = -1,
            xx,
            yy;
          for (yy = 0; yy < H; yy++)
            for (xx = 0; xx < W; xx++)
              if (sa3[(yy * W + xx) * 4 + 3] > 70) {
                if (xx < mx0) mx0 = xx;
                if (xx > mx1) mx1 = xx;
                if (yy < my0) my0 = yy;
                if (yy > my1) my1 = yy;
              }
          if (mx1 < 0) return;
          var padp = Math.round((14 * W) / 1600) + 8;
          mx0 = Math.max(0, mx0 - padp);
          mx1 = Math.min(W - 1, mx1 + padp);
          my0 = Math.max(0, my0 - 2);
          my1 = Math.min(H - 1, my1 + 2);
          var gw = Math.ceil((mx1 - mx0 + 1) / f),
            gh = Math.ceil((my1 - my0 + 1) / f),
            G = new Float32Array(gw * gh * 3),
            K = new Uint8Array(gw * gh),
            cnt = new Uint16Array(gw * gh),
            gx,
            gy,
            c5;
          for (yy = my0; yy <= my1; yy++) {
            gy = ((yy - my0) / f) | 0;
            for (xx = mx0; xx <= mx1; xx++) {
              gx = ((xx - mx0) / f) | 0;
              var gi = gy * gw + gx;
              if (sa3[(yy * W + xx) * 4 + 3] > 40) {
                K[gi] = 1;
                continue;
              }
            }
          }
          /* células "conhecidas" = sem nenhum pixel da emenda; guarda a média de cor */
          for (yy = my0; yy <= my1; yy++) {
            gy = ((yy - my0) / f) | 0;
            for (xx = mx0; xx <= mx1; xx++) {
              gx = ((xx - mx0) / f) | 0;
              var gj = gy * gw + gx;
              if (!K[gj]) {
                var q5 = (yy * W + xx) * 4;
                G[gj * 3] += o[q5];
                G[gj * 3 + 1] += o[q5 + 1];
                G[gj * 3 + 2] += o[q5 + 2];
                cnt[gj]++;
              }
            }
          }
          for (gy = 0; gy < gh; gy++)
            for (gx = 0; gx < gw; gx++) {
              var gk = gy * gw + gx;
              if (!K[gk] && cnt[gk]) {
                G[gk * 3] /= cnt[gk];
                G[gk * 3 + 1] /= cnt[gk];
                G[gk * 3 + 2] /= cnt[gk];
              } else if (!K[gk]) K[gk] = 1;
            }
          /* inicializa as células desconhecidas por interpolação horizontal na linha */
          for (gy = 0; gy < gh; gy++) {
            var l5 = -1;
            for (gx = 0; gx <= gw; gx++) {
              if (gx === gw || !K[gy * gw + gx]) {
                if (gx < gw && l5 === -2) continue;
              }
            }
            gx = 0;
            while (gx < gw) {
              if (K[gy * gw + gx]) {
                var ge = gx;
                while (ge < gw && K[gy * gw + ge]) ge++;
                var L5 = gx > 0 ? gx - 1 : -1,
                  R5 = ge < gw ? ge : -1;
                for (var zz = gx; zz < ge; zz++) {
                  var tt2 = L5 < 0 ? 1 : R5 < 0 ? 0 : (zz - L5) / (R5 - L5);
                  for (c5 = 0; c5 < 3; c5++) {
                    var lv =
                        L5 >= 0
                          ? G[(gy * gw + L5) * 3 + c5]
                          : R5 >= 0
                            ? G[(gy * gw + R5) * 3 + c5]
                            : 240,
                      rv = R5 >= 0 ? G[(gy * gw + R5) * 3 + c5] : lv;
                    G[(gy * gw + zz) * 3 + c5] = lv * (1 - tt2) + rv * tt2;
                  }
                }
                gx = ge;
              } else gx++;
            }
          }
          var unk = [];
          for (gy = 0; gy < gh; gy++)
            for (gx = 0; gx < gw; gx++) if (K[gy * gw + gx]) unk.push(gy * gw + gx);
          for (var itr = 0; itr < 500; itr++) {
            for (var ui = 0; ui < unk.length; ui++) {
              var ug = unk[ui],
                uy = (ug / gw) | 0,
                ux = ug % gw,
                up = uy > 0 ? ug - gw : ug,
                dn = uy < gh - 1 ? ug + gw : ug,
                lf = ux > 0 ? ug - 1 : ug,
                rt = ux < gw - 1 ? ug + 1 : ug;
              for (c5 = 0; c5 < 3; c5++)
                G[ug * 3 + c5] =
                  (G[up * 3 + c5] + G[dn * 3 + c5] + G[lf * 3 + c5] + G[rt * 3 + c5]) / 4;
            }
          }
          var D = mx1 - mx0 + 6,
            sgn = 1;
          function lumAt(x3, y3) {
            var q6 = (y3 * W + x3) * 4;
            return o[q6] * 0.299 + o[q6 + 1] * 0.587 + o[q6 + 2] * 0.114;
          }
          /* devolve o "grão" (alta frequência) de um ponto vizinho fora da emenda, para a faixa não ficar lisa demais */
          function texHP(x2, y2) {
            for (var t = 0; t < 2; t++) {
              var sx2 = x2 + (t ? -D : D);
              if (sx2 < 8 || sx2 >= W - 8 || y2 < 8 || y2 >= H - 8) continue;
              if (sa3[(y2 * W + sx2) * 4 + 3] > 40) continue;
              var c0 = lumAt(sx2, y2),
                m4 =
                  (lumAt(sx2 - 5, y2) +
                    lumAt(sx2 + 5, y2) +
                    lumAt(sx2, y2 - 5) +
                    lumAt(sx2, y2 + 5)) /
                  4,
                hp = c0 - m4;
              if (Math.abs(hp) < 9) return hp;
            }
            return 0;
          }
          for (yy = my0; yy <= my1; yy++)
            for (xx = mx0; xx <= mx1; xx++) {
              var al = sa3[(yy * W + xx) * 4 + 3];
              if (al <= 40) continue;
              var fx = (xx - mx0) / f - 0.5,
                fy = (yy - my0) / f - 0.5,
                x0 = Math.max(0, Math.min(gw - 1, Math.floor(fx))),
                y0 = Math.max(0, Math.min(gh - 1, Math.floor(fy))),
                x1 = Math.min(gw - 1, x0 + 1),
                y1 = Math.min(gh - 1, y0 + 1),
                ax = Math.max(0, Math.min(1, fx - x0)),
                ay = Math.max(0, Math.min(1, fy - y0)),
                qq = (yy * W + xx) * 4,
                w2 = Math.min(1, (al - 40) / 60),
                nz = texHP(xx, yy);
              for (c5 = 0; c5 < 3; c5++) {
                var v00 = G[(y0 * gw + x0) * 3 + c5],
                  v10 = G[(y0 * gw + x1) * 3 + c5],
                  v01 = G[(y1 * gw + x0) * 3 + c5],
                  v11 = G[(y1 * gw + x1) * 3 + c5],
                  vv = (v00 * (1 - ax) + v10 * ax) * (1 - ay) + (v01 * (1 - ax) + v11 * ax) * ay + nz;
                o[qq + c5] = o[qq + c5] * (1 - w2) + vv * w2;
              }
            }
        })();
        /* ponte do nariz: o poste da estante atravessa a armação; troca a faixa por uma mistura suave entre os dois lados (só nas linhas com armação dos dois lados) */
        (function () {
          var SL = window.__SL;
          window.__IP = [SL, typeof yEnd, yEnd, 0];
          window.__MS = 0;
          window.__YT = null;
          if (!SL || typeof yEnd !== 'number' || yEnd <= 0) return;
          var kx = W / sw,
            ky = H / sh;
          function av(yf, xf) {
            var r = 0,
              g = 0,
              b = 0,
              n = 0;
            for (var dx = -2; dx <= 2; dx++) {
              var X = xf + dx;
              if (X < 0 || X >= W) continue;
              var q = (yf * W + X) * 4;
              r += o[q];
              g += o[q + 1];
              b += o[q + 2];
              n++;
            }
            return [r / n, g / n, b / n];
          }
          for (var ys = yEnd; ys < sh; ys++) {
            var cxs = Math.round(SL[0] * ys + SL[1]),
              xl = cxs - SL[2] - 3,
              xr = cxs + SL[2] + 3;
            var okr = false;
            if (xl >= 0 && xr < sw && fg[ys * sw + xl] && fg[ys * sw + xr]) {
              var Ll =
                  (d[(ys * sw + xl) * 4] + d[(ys * sw + xl) * 4 + 1] + d[(ys * sw + xl) * 4 + 2]) / 3,
                Lr =
                  (d[(ys * sw + xr) * 4] + d[(ys * sw + xr) * 4 + 1] + d[(ys * sw + xr) * 4 + 2]) / 3,
                fc = 0,
                tot = 0;
              for (var xs2 = cxs - SL[2]; xs2 <= cxs + SL[2]; xs2++) {
                if (xs2 < 0 || xs2 >= sw) continue;
                tot++;
                if (fg[ys * sw + xs2]) fc++;
              }
              okr =
                Ll < ((br + bg + bb) / 3) * 0.7 &&
                Lr < ((br + bg + bb) / 3) * 0.7 &&
                tot > 0 &&
                fc / tot >= 0.3;
            }
            if (!okr) {
              window.__MS = (window.__MS || 0) + 1;
              if (window.__MS > 4 && window.__IP[3] > 6) break;
              if (ys > yEnd + Math.round(sh * 0.2)) break;
              continue;
            }
            window.__MS = 0;
            if (window.__IP[3] === 0) window.__YT = ys;
            window.__IP[3]++;
            var y0f = Math.round(ys * ky),
              y1f = Math.min(H, Math.round((ys + 1) * ky)),
              xlf = Math.round(xl * kx),
              xrf = Math.round(xr * kx);
            for (var yf = y0f; yf < y1f; yf++) {
              var Lc = av(yf, xlf),
                Rc = av(yf, xrf);
              for (var xf = xlf; xf <= xrf; xf++) {
                var t = (xf - xlf) / (xrf - xlf),
                  q = (yf * W + xf) * 4,
                  chr = Math.max(o[q], o[q + 1], o[q + 2]) - Math.min(o[q], o[q + 1], o[q + 2]),
                  wI = Math.max(0, Math.min(1, 1 - (chr - (window.__CK || 16)) / 20));
                o[q] = o[q] * (1 - wI) + (Lc[0] * (1 - t) + Rc[0] * t) * wI;
                o[q + 1] = o[q + 1] * (1 - wI) + (Lc[1] * (1 - t) + Rc[1] * t) * wI;
                o[q + 2] = o[q + 2] * (1 - wI) + (Lc[2] * (1 - t) + Rc[2] * t) * wI;
              }
            }
          }
        })();
        o0 = new Uint8ClampedArray(o);
        devA = new Uint8Array(W * H);
        for (i = 0; i < W * H; i++) {
          ((q4 = i * 4), (dvm = 0));
          for (cc = 0; cc < 3; cc++) {
            dd = (Math.abs(o[q4 + cc] - mp[q4 + cc]) * 255) / Math.max(40, mp[q4 + cc]);
            if (dd > dvm) dvm = dd;
          }
          devA[i] = dvm > 255 ? 255 : dvm;
          for (cc = 0; cc < 3; cc++) {
            v = (o[q4 + cc] * 255) / Math.max(40, mp[q4 + cc]);
            t3 = Math.max(0, Math.min(1, (v - 232) / 18));
            v = v * (1 - t3) + 255 * t3;
            o[q4 + cc] = Math.max(0, Math.min(255, Math.round(v)));
          }
        }
      }
    }

    // Mantém a armação na cor original: fundo é cinza mais escuro; a armação tem tom ou é bem mais escura.
    function corOriginalDaArmacao() {
      var kW,
        mS,
        mL,
        gc,
        gg,
        gd,
        gb,
        gbg,
        gv,
        nzc,
        nzg,
        nzd,
        nzb,
        nzbg,
        nzv,
        gate,
        bl,
        bw,
        yZ,
        zc,
        zg,
        zd,
        SL2,
        cz,
        j6,
        zb2,
        zbg;
      /* armação com a cor original: o que é "fundo" é cinza (mesma cor do fundo, só mais escuro); a armação tem tom marrom ou é bem mais escura */
      fm = null;
      if (hull && typeof o0 !== 'undefined' && o0 && typeof mp !== 'undefined' && !window.__NOFM) {
        try {
          kW = W / 1449;
          function matteOf(cdT, cdW, dkT, dkW, blr, thr) {
            var aA = mkCanvas(W, H),
              aG = aA.getContext('2d'),
              aD = aG.createImageData(W, H),
              ad = aD.data;
            for (var q = 0; q < W * H; q++) {
              var q4 = q * 4,
                Br = Math.max(40, mp[q4]),
                Bg2 = Math.max(40, mp[q4 + 1]),
                Bb = Math.max(40, mp[q4 + 2]),
                kr = o0[q4] / Br,
                kg2 = o0[q4 + 1] / Bg2,
                kb2 = o0[q4 + 2] / Bb,
                k = (kr + kg2 + kb2) / 3;
              if (k < 0.02) {
                ad[q4 + 3] = 255;
                continue;
              }
              var cd = Math.max(Math.abs(kr / k - 1), Math.abs(kg2 / k - 1), Math.abs(kb2 / k - 1)),
                a1 = Math.max(0, Math.min(1, (cd - cdT) / cdW)),
                a2 = Math.max(0, Math.min(1, (dkT - k) / dkW));
              ad[q4 + 3] = Math.round(255 * Math.max(a1, a2));
            }
            aG.putImageData(aD, 0, 0);
            var aB = mkCanvas(W, H),
              aBg = aB.getContext('2d');
            aBg.filter = 'blur(' + Math.max(2, Math.round(blr * kW)) + 'px)';
            aBg.drawImage(aA, 0, 0);
            var bd = aBg.getImageData(0, 0, W, H).data,
              out = new Uint8Array(W * H);
            for (q = 0; q < W * H; q++) {
              var tt = (bd[q * 4 + 3] / 255 - thr) / 0.3;
              out[q] = Math.round((tt < 0 ? 0 : tt > 1 ? 1 : tt) * 255);
            }
            return out;
          }
          ((mS = matteOf(
            window.__CD0 || 0.05,
            window.__CDW || 0.05,
            window.__DK || 0.6,
            window.__DKW || 0.12,
            4,
            0.3
          )),
            (mL = matteOf(
              window.__CL0 || 0.03,
              window.__CLW || 0.04,
              window.__DK || 0.6,
              window.__DKW || 0.12,
              4,
              0.3
            )));
          ((gc = mkCanvas(W, H)), (gg = gc.getContext('2d')), (gd = gg.createImageData(W, H)));
          for (q = 0; q < W * H; q++) gd.data[q * 4 + 3] = mS[q];
          gg.putImageData(gd, 0, 0);
          ((gb = mkCanvas(W, H)), (gbg = gb.getContext('2d')));
          gbg.filter = 'blur(' + Math.max(3, Math.round((window.__GR2 || 22) * kW)) + 'px)';
          gbg.drawImage(gc, 0, 0);
          gv = gbg.getImageData(0, 0, W, H).data;
          ((nzc = mkCanvas(sw, sh)),
            (nzg = nzc.getContext('2d')),
            (nzd = nzg.createImageData(sw, sh)));
          for (i = 0; i < N; i++) nzd.data[i * 4 + 3] = nearM[i] ? 255 : 0;
          nzg.putImageData(nzd, 0, 0);
          ((nzb = mkCanvas(W, H)), (nzbg = nzb.getContext('2d')));
          nzbg.filter = 'blur(' + Math.max(2, Math.round(3 * kW)) + 'px)';
          nzbg.drawImage(nzc, 0, 0, W, H);
          nzv = nzbg.getImageData(0, 0, W, H).data;
          fm = new Uint8Array(W * H);
          for (q = 0; q < W * H; q++) {
            gate = (gv[q * 4 + 3] / 255 - 0.06) / 0.1;
            gate = gate < 0 ? 0 : gate > 1 ? 1 : gate;
            m = Math.max(mS[q], mL[q] * gate);
            bl = o0[q * 4 + 2] - o0[q * 4];
            bw = bl <= 2 ? 1 : bl >= 10 ? 0 : 1 - (bl - 2) / 8;
            fm[q] = Math.round(m * bw * (nzv[q * 4 + 3] / 255));
          }
        } catch (e) {
          fm = null;
          window.__FME = String(e);
        }
      }
      zb = null;
      if (hull && window.__SL && typeof yEnd === 'number' && yEnd > 0) {
        yZ = window.__YT || yEnd;
        ((zc = mkCanvas(sw, sh)),
          (zg = zc.getContext('2d')),
          (zd = zg.createImageData(sw, sh)),
          (SL2 = window.__SL));
        for (y = 0; y < yZ; y++) {
          cz = Math.round(SL2[0] * y + SL2[1]);
          for (x = Math.max(0, cz - SL2[2]); x <= Math.min(sw - 1, cz + SL2[2]); x++) {
            j6 = y * sw + x;
            if (fg[j6] && d[j6 * 4] - d[j6 * 4 + 2] >= 14) continue;
            zd.data[j6 * 4 + 3] = 255;
          }
        }
        zg.putImageData(zd, 0, 0);
        ((zb2 = mkCanvas(W, H)), (zbg = zb2.getContext('2d')));
        zbg.filter = 'blur(' + Math.max(1, Math.round(1.5 / sc)) + 'px)';
        zbg.drawImage(zc, 0, 0, W, H);
        zb = zbg.getImageData(0, 0, W, H).data;
      }
    }

    // Troca a textura granulada da estante por uma versão suave, só fora da armação e das lentes.
    function suavizarFundo() {
      var bgLm0,
        oc,
        ocg,
        ocd,
        ow,
        owg,
        t1c,
        t1g,
        t1d,
        t1a,
        q3,
        t2c,
        t2g,
        pq,
        pqg,
        pqd,
        pc,
        pcg,
        kbig,
        kbg;
      /* fundo: troca a textura granulada da estante por uma versão suave (só nas áreas fora da armação e das lentes) */
      ((smB = null), (owB = null), (prB = null), (bgLm0 = (br + bg + bb) / 3));
      if (hull && insD && !window.__NOSM) {
        try {
          ((oc = mkCanvas(sw, sh)), (ocg = oc.getContext('2d')), (ocd = ocg.createImageData(sw, sh)));
          for (i = 0; i < N; i++) ocd.data[i * 4 + 3] = !insD[i] && !fg2[i] ? 255 : 0;
          ocg.putImageData(ocd, 0, 0);
          ((ow = mkCanvas(W, H)), (owg = ow.getContext('2d')));
          owg.filter = 'blur(' + Math.max(2, Math.round((window.__OB || 3) / sc)) + 'px)';
          owg.drawImage(oc, 0, 0, W, H);
          owg.filter = 'none';
          owB = owg.getImageData(0, 0, W, H).data;
          ((t1c = mkCanvas(W, H)),
            (t1g = t1c.getContext('2d')),
            (t1d = t1g.createImageData(W, H)),
            (t1a = t1d.data));
          for (q3 = 0; q3 < W * H; q3++) {
            t1a[q3 * 4] = o[q3 * 4];
            t1a[q3 * 4 + 1] = o[q3 * 4 + 1];
            t1a[q3 * 4 + 2] = o[q3 * 4 + 2];
            t1a[q3 * 4 + 3] = owB[q3 * 4 + 3] > 200 ? 255 : 0;
          }
          t1g.putImageData(t1d, 0, 0);
          ((t2c = mkCanvas(W, H)), (t2g = t2c.getContext('2d')));
          t2g.filter = 'blur(' + Math.max(2, Math.round((window.__SMB || 10) / sc)) + 'px)';
          t2g.drawImage(t1c, 0, 0);
          smB = t2g.getImageData(0, 0, W, H).data;
          window.__SMOK = 1;
          ((pq = mkCanvas(sw, sh)), (pqg = pq.getContext('2d')), (pqd = pqg.createImageData(sw, sh)));
          for (i = 0; i < N; i++)
            pqd.data[i * 4 + 3] =
              fg[i] && (d[i * 4] + d[i * 4 + 1] + d[i * 4 + 2]) / 3 < bgLm0 * 0.8 ? 255 : 0;
          pqg.putImageData(pqd, 0, 0);
          ((pc = mkCanvas(W, H)), (pcg = pc.getContext('2d')));
          pcg.filter = 'blur(' + Math.max(3, Math.round((window.__PX || 13) / sc)) + 'px)';
          pcg.drawImage(pq, 0, 0, W, H);
          prB = pcg.getImageData(0, 0, W, H).data;
        } catch (e) {
          window.__SMOK = String(e);
          smB = null;
        }
      }
      ((kbig = mkCanvas(W, H)), (kbg = kbig.getContext('2d')));
      kbg.imageSmoothingQuality = 'high';
      kbg.drawImage(kc, 0, 0, W, H);
      kb = kbg.getImageData(0, 0, W, H).data;
    }

    // Borda: só fica opaca onde a cor realmente difere do fundo.
    function bordaEOpacidade() {
      var a, wo, Lw2, tw, pr, kf, fv, fa, dvv, fr, A;
      for (i = 0; i < W * H; i++) {
        a = ma[i * 4 + 3];
        if (zb && zb[i * 4 + 3] > 100) a = 0;
        if (a < 8) {
          o[i * 4] = o[i * 4 + 1] = o[i * 4 + 2] = 255;
          o[i * 4 + 3] = 0;
          continue;
        }
        /* borda: só fica opaca onde a cor realmente difere do fundo (some o "brilho branco" em volta e deixa a sombra aparecer) */
        if (smB && owB[i * 4 + 3] > 0 && smB[i * 4 + 3] > 60) {
          wo = owB[i * 4 + 3] / 255;
          if (window.__SMDBG === 2) {
            o[i * 4] = smB[i * 4];
            o[i * 4 + 1] = smB[i * 4 + 1];
            o[i * 4 + 2] = smB[i * 4 + 2];
            o[i * 4 + 3] = 255;
            continue;
          }
          if (window.__SMDBG) {
            o[i * 4] = 255;
            o[i * 4 + 1] = 0;
            o[i * 4 + 2] = 0;
            o[i * 4 + 3] = 255;
            continue;
          }
          o[i * 4] = o[i * 4] * (1 - wo) + smB[i * 4] * wo;
          o[i * 4 + 1] = o[i * 4 + 1] * (1 - wo) + smB[i * 4 + 1] * wo;
          o[i * 4 + 2] = o[i * 4 + 2] * (1 - wo) + smB[i * 4 + 2] * wo;
          ((Lw2 = (o[i * 4] + o[i * 4 + 1] + o[i * 4 + 2]) / 3),
            (tw = Math.max(0, Math.min(1, (Lw2 - (window.__PW || 236)) / 14)) * wo));
          if (tw > 0) {
            o[i * 4] = o[i * 4] * (1 - tw) + 255 * tw;
            o[i * 4 + 1] = o[i * 4 + 1] * (1 - tw) + 255 * tw;
            o[i * 4 + 2] = o[i * 4 + 2] * (1 - tw) + 255 * tw;
          }
          if (prB) {
            ((pr = Math.max(0, Math.min(1, (prB[i * 4 + 3] / 255 - 0.03) / 0.25))),
              (kf = 1 - wo * (1 - pr)));
            o[i * 4] = 255 - (255 - o[i * 4]) * kf;
            o[i * 4 + 1] = 255 - (255 - o[i * 4 + 1]) * kf;
            o[i * 4 + 2] = 255 - (255 - o[i * 4 + 2]) * kf;
          }
        }
        if (window.__FMDBG && fm) {
          fv = fm[i];
          o[i * 4] = fv;
          o[i * 4 + 1] = fv;
          o[i * 4 + 2] = fv;
          o[i * 4 + 3] = 255;
          continue;
        }
        if (fm && fm[i] > 0) {
          fa = fm[i] / 255;
          o[i * 4] = o[i * 4] * (1 - fa) + o0[i * 4] * fa;
          o[i * 4 + 1] = o[i * 4 + 1] * (1 - fa) + o0[i * 4 + 1] * fa;
          o[i * 4 + 2] = o[i * 4 + 2] * (1 - fa) + o0[i * 4 + 2] * fa;
        }
        ((dvv = devA
          ? devA[i]
          : Math.max(
              Math.abs(o[i * 4] - br),
              Math.abs(o[i * 4 + 1] - bg),
              Math.abs(o[i * 4 + 2] - bb)
            )),
          (fr = 255),
          (A = Math.max(kb[i * 4], kb[i * 4 + 1], Math.min(a, fr))));
        if (A < 8) {
          o[i * 4] = o[i * 4 + 1] = o[i * 4 + 2] = 255;
          o[i * 4 + 3] = 0;
        } else o[i * 4 + 3] = A;
      }
    }

    // Recorta no produto e centraliza num quadrado branco, com sombra suave por baixo.
    function recortarECentralizar() {
      var out, pad, cx1, cy1, cw, ch, sc2, dw, dh;
      out = mkCanvas(W, H);
      out.getContext('2d').putImageData(fd, 0, 0);
      // recorta no produto e centraliza num quadrado branco
      ((pad = 0.1),
        (cx0 = Math.max(0, (bx0 / sw - pad) * W)),
        (cy0 = Math.max(0, (by0 / sh - pad) * H)),
        (cx1 = Math.min(W, ((bx1 + 1) / sw + pad) * W)),
        (cy1 = Math.min(H, ((by1 + 1) / sh + pad) * H)),
        (cw = cx1 - cx0),
        (ch = cy1 - cy0),
        (S2 = 2000),
        (sc2 = Math.min((S2 * 0.88) / cw, (S2 * 0.88) / ch, 2)),
        (dw = cw * sc2),
        (dh = ch * sc2));
      ((sq = mkCanvas(S2, S2)), (qg = sq.getContext('2d')));
      qg.fillStyle = '#fff';
      qg.fillRect(0, 0, S2, S2);
      qg.imageSmoothingQuality = 'high';
      /* sombra suave desenhada por baixo da armação (substitui a sombra suja da foto original) */
      (function () {
        if (!window.__SYN) return;
        try {
          [
            [0.022, 0.016, 0.3],
            [0.006, 0.004, 0.22]
          ].forEach(function (L) {
            var tc = mkCanvas(S2, S2),
              tg = tc.getContext('2d');
            tg.filter = 'blur(' + Math.max(1, Math.round(dw * L[0])) + 'px)';
            tg.drawImage(
              shm,
              (cx0 * sw) / W,
              (cy0 * sh) / H,
              (cw * sw) / W,
              (ch * sh) / H,
              (S2 - dw) / 2,
              (S2 - dh) / 2 + dw * L[1],
              dw,
              dh
            );
            tg.filter = 'none';
            tg.globalCompositeOperation = 'source-in';
            tg.fillStyle = '#2b2b2b';
            tg.fillRect(0, 0, S2, S2);
            qg.globalAlpha = L[2];
            qg.drawImage(tc, 0, 0);
            qg.globalAlpha = 1;
          });
        } catch (e) {
          qg.globalAlpha = 1;
        }
      })();
      qg.drawImage(out, cx0, cy0, cw, ch, (S2 - dw) / 2, (S2 - dh) / 2, dw, dh);
    }

    // Nitidez fina e clareza leve; o fundo branco não muda.
    function nitidezFinal() {
      (function () {
        try {
          var A = qg.getImageData(0, 0, S2, S2),
            a = A.data;
          function blurred(px) {
            var bl = mkCanvas(S2, S2),
              g2 = bl.getContext('2d');
            g2.filter = 'blur(' + px + 'px)';
            g2.drawImage(sq, 0, 0);
            return g2.getImageData(0, 0, S2, S2).data;
          }
          var B1 = blurred(1.2),
            B2 = blurred(7);
          /* nitidez fina (detalhes e texto) + clareza leve (contraste local); o fundo branco não muda */
          /* estante: reflexos e sombras claras e planas ficam com grão da superfície; suaviza só onde é claro e sem detalhe (borda, texto e armação ficam intactos) */
          if (hull && !window.__NOGR) {
            var B3 = blurred(window.__GR || 5),
              GLv = window.__GL || 200,
              GEv = window.__GE || 22,
              GAv = window.__GA === undefined ? 0.95 : window.__GA;
            for (var u2 = 0; u2 < a.length; u2 += 4) {
              var L0 = (a[u2] + a[u2 + 1] + a[u2 + 2]) / 3,
                LB = (B3[u2] + B3[u2 + 1] + B3[u2 + 2]) / 3,
                wl = Math.max(0, Math.min(1, (L0 - GLv) / 25)),
                dv = Math.abs(L0 - LB),
                we = Math.max(0, Math.min(1, 1 - (dv - GEv) / 16)),
                wm = wl * we * GAv;
              if (wm > 0) {
                a[u2] = a[u2] * (1 - wm) + B3[u2] * wm;
                a[u2 + 1] = a[u2 + 1] * (1 - wm) + B3[u2 + 1] * wm;
                a[u2 + 2] = a[u2 + 2] * (1 - wm) + B3[u2 + 2] * wm;
              }
            }
          }
          for (var u = 0; u < a.length; u += 4) {
            for (var c3 = 0; c3 < 3; c3++) {
              var o = a[u + c3],
                v = o + 0.75 * (o - B1[u + c3]) + 0.22 * (o - B2[u + c3]);
              a[u + c3] = v < 0 ? 0 : v > 255 ? 255 : v;
            }
          }
          qg.putImageData(A, 0, 0);
        } catch (e) {}
      })();
    }
  }

  // Canvas → JPEG.
  function toBlob(c, q) {
    return new Promise(function (res) {
      c.toBlob(res, 'image/jpeg', q || 0.9);
    });
  }
  // Cor típica da peça (ignora o fundo claro).
  function skin(c, fallback) {
    var g = c.getContext('2d'),
      d = g.getImageData(0, 0, c.width, c.height).data,
      R = [],
      G = [],
      B = [];
    for (var i = 0; i < d.length; i += 16) {
      if (d[i] > 238 && d[i + 1] > 238 && d[i + 2] > 238) continue;
      R.push(d[i]);
      G.push(d[i + 1]);
      B.push(d[i + 2]);
    }
    if (R.length < 30) return fallback;
    var m = function (a) {
      a.sort(function (x, y) {
        return x - y;
      });
      return a[a.length >> 1];
    };
    return [m(R), m(G), m(B)];
  }
  // leitura do código da etiqueta/haste
  // ===== Leitura do código da foto: OCR offline (Tesseract) e IA online. =====
  // Instrução enviada à IA para ler a etiqueta.
  function labelPrompt() {
    var pr =
      'Esta é a foto de um óculos (armação, solar ou pré-graduado). Se houver duas imagens, a primeira é um recorte ampliado da peça (use para ler textos pequenos, como o código impresso na lente ou na haste, ex. BR44118 53□18-140) e a segunda é a foto inteira. Leia SOMENTE o que estiver escrito na foto (etiqueta, haste, lente). Responda JSON com as chaves: referencia (código do modelo, ex. CX012, SP57765), medidas (ex. "56-18-140"), variante (C1 a C6 se houver), grau (apenas se for pré-graduado, ex. "+1.75"), material (ex. Alumínio), tipo ("pre","sem" ou "solar" pelo aspecto), formato (um de: ' +
      S.formats.join(', ') +
      '), cor (nome curto em português da cor da peça), extras (ex. Clip-on), pecas. Em pecas, se a foto mostrar VÁRIAS armações/óculos separados (2 ou mais), liste cada um como {caixa:[x0,y0,x1,y1] em milésimos da imagem (0 a 1000, caixa justa em volta SÓ daquela peça), variante (rótulo tipo C4 escrito perto da peça, ou null), cor (nome curto em português), qtd (número escrito ao lado do rótulo, só se existir, senão null)}; ignore logotipos e textos. Se houver só uma peça, pecas=[]. Use null quando não estiver visível. NÃO invente.';
  }
  // Leitura da etiqueta pela IA, quando disponível.
  function readSample(blobs) {
    return Promise.resolve()
      .then(function () {
        return window.claude.use('sample');
      })
      .then(function (sm) {
        if (!sm) throw { code: 'none' };
        return sm.limits().then(function (l) {
          if (!l || !l.images) throw { code: 'none' };
          var pr = labelPrompt();
          return sm.json(pr, { images: blobs, modelTier: 'default', cache: true });
        });
      });
  }

  var tessP = null,
    tessW = null;
  setTimeout(function () {
    try {
      var cn = navigator.connection;
      if (
        navigator.onLine &&
        !localStorage.getItem('lafouch_ocr_warm') &&
        !(cn && (cn.saveData || cn.type === 'cellular'))
      ) {
        getWorker().then(
          function () {
            localStorage.setItem('lafouch_ocr_warm', '1');
          },
          function () {}
        );
      }
    } catch (e) {}
  }, 8000);
  // Carrega o Tesseract (OCR) uma vez.
  function loadTess() {
    if (window.Tesseract) return Promise.resolve();
    if (tessP) return tessP;
    tessP = new Promise(function (ok, no) {
      function ld(src, fail, ms) {
        var s = document.createElement('script');
        s.src = src;
        s.onload = ok;
        s.onerror = fail;
        setTimeout(function () {
          if (!window.Tesseract) fail();
        }, ms);
        document.head.appendChild(s);
      }
      ld(
        'tess/ocr.js',
        function () {
          if (window.Tesseract) return;
          ld(
            'https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.1.1/tesseract.min.js',
            function () {
              tessP = null;
              no({ code: 'offline' });
            },
            9000
          );
        },
        4000
      );
    });
    return tessP;
  }
  var OCRDEAD = 0;
  // Worker do OCR (recriado se falhar).
  function getWorker() {
    if (tessW) return tessW;
    if (OCRDEAD && Date.now() - OCRDEAD < 90000) return Promise.reject({ code: 'dead' });
    tessW = loadTess()
      .then(function () {
        return window.Tesseract.createWorker('eng', 1, {});
      })
      .then(function (w) {
        return w
          .setParameters({
            tessedit_char_whitelist:
              'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.',
            tessedit_pageseg_mode: '11',
            user_defined_dpi: '300'
          })
          .then(function () {
            return w;
          });
      });
    tessW = Promise.race([
      tessW,
      new Promise(function (ok, no) {
        setTimeout(function () {
          no({ code: 'timeout' });
        }, 20000);
      })
    ]);
    tessW.catch(function () {
      tessW = null;
      OCRDEAD = Date.now();
    });
    return tessW;
  }
  /* prepara um recorte: cinza, contraste automático, ampliação */
  function prepTile(src, x, y, w, h, sc, bin) {
    var c = mkCanvas(Math.round(w * sc), Math.round(h * sc)),
      g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(src, x, y, w, h, 0, 0, c.width, c.height);
    var d = g.getImageData(0, 0, c.width, c.height),
      a = d.data,
      n = a.length / 4,
      hist = new Uint32Array(256),
      i,
      v;
    for (i = 0; i < n; i++) {
      v = (a[i * 4] * 0.299 + a[i * 4 + 1] * 0.587 + a[i * 4 + 2] * 0.114) | 0;
      a[i * 4] = v;
      hist[v]++;
    }
    var lo = 0,
      hi = 255,
      acc = 0,
      cut = n * 0.01;
    for (i = 0; i < 256; i++) {
      acc += hist[i];
      if (acc > cut) {
        lo = i;
        break;
      }
    }
    acc = 0;
    for (i = 255; i >= 0; i--) {
      acc += hist[i];
      if (acc > cut) {
        hi = i;
        break;
      }
    }
    var k = 255 / Math.max(20, hi - lo);
    for (i = 0; i < n; i++) {
      v = Math.max(0, Math.min(255, ((a[i * 4] - lo) * k) | 0));
      a[i * 4] = a[i * 4 + 1] = a[i * 4 + 2] = v;
      a[i * 4 + 3] = 255;
    }
    if (bin) {
      var W = c.width,
        H = c.height,
        g1 = new Uint8Array(n),
        g2 = new Uint8Array(n),
        r,
        q,
        t,
        u;
      for (i = 0; i < n; i++) g1[i] = a[i * 4];
      for (t = 0; t < 3; t++) {
        for (r = 0; r < H; r++)
          for (q = 0; q < W; q++) {
            var sm = 0,
              cn = 0;
            for (u = -1; u <= 1; u++) {
              var xx = q + u;
              if (xx >= 0 && xx < W) {
                sm += g1[r * W + xx];
                cn++;
              }
            }
            g2[r * W + q] = sm / cn;
          }
        for (r = 0; r < H; r++)
          for (q = 0; q < W; q++) {
            var sm2 = 0,
              cn2 = 0;
            for (u = -1; u <= 1; u++) {
              var yy = r + u;
              if (yy >= 0 && yy < H) {
                sm2 += g2[yy * W + q];
                cn2++;
              }
            }
            g1[r * W + q] = sm2 / cn2;
          }
      }
      var h2 = new Uint32Array(256);
      for (i = 0; i < n; i++) h2[g1[i]]++;
      var tot = n,
        sumA = 0,
        sumB = 0,
        wB = 0,
        mx = 0,
        thr = 128;
      for (i = 0; i < 256; i++) sumA += i * h2[i];
      for (i = 0; i < 256; i++) {
        wB += h2[i];
        if (!wB) continue;
        var wF = tot - wB;
        if (!wF) break;
        sumB += i * h2[i];
        var mB = sumB / wB,
          mF = (sumA - sumB) / wF,
          bt = wB * wF * (mB - mF) * (mB - mF);
        if (bt > mx) {
          mx = bt;
          thr = i;
        }
      }
      for (i = 0; i < n; i++) {
        v = g1[i] > thr ? 255 : 0;
        a[i * 4] = a[i * 4 + 1] = a[i * 4 + 2] = v;
      }
    }
    g.putImageData(d, 0, 0);
    return c;
  }
  /* lê números/letras e valida; só preenche quando tem certeza */
  var DIG = {
    O: '0',
    Q: '0',
    D: '0',
    I: '1',
    L: '1',
    l: '1',
    Z: '2',
    A: '4',
    S: '5',
    G: '6',
    B: '8'
  };
  // Corrige letras confundidas com dígitos.
  function fixDigits(t) {
    return t
      .split('')
      .map(function (ch) {
        return DIG[ch] || ch;
      })
      .join('');
  }
  var MEDRE = /(\d{2})\s?[0OoDQ]?\s?(\d{2})\s?[-–—.]?\s?(1[2-6]\d)/g;
  /* procura "REF  56□18-140": as medidas são o ponto de apoio para achar o código colado antes delas */
  function scanCodes(txts, acc) {
    acc = acc || { refs: {}, strict: {}, meds: {} };
    txts.forEach(function (T) {
      (acc.txts = acc.txts || []).push(T);
      T.split(/\n+/).forEach(function (line) {
        MEDRE.lastIndex = 0;
        var m;
        while ((m = MEDRE.exec(line))) {
          var lens = +m[1],
            br = +m[2],
            tp = +m[3];
          if (!(lens >= 38 && lens <= 66 && br >= 12 && br <= 26 && tp >= 120 && tp <= 160))
            continue;
          var k = m[1] + '□' + m[2] + '-' + m[3];
          acc.meds[k] = (acc.meds[k] || 0) + 1;
          var pre = line
              .slice(0, m.index)
              .replace(/[^A-Za-z0-9]+$/, '')
              .replace(/\s+/g, '')
              .slice(-9),
            r = pre.match(/([A-Z]{2,3}?)([0-9OQDILZASGB]{3,6})$/);
          if (r) {
            var dg = fixDigits(r[2]);
            if (/^\d{3,6}$/.test(dg)) {
              var ref = r[1] + dg;
              acc.refs[ref] = (acc.refs[ref] || 0) + 1;
              if (/^\d+$/.test(r[2])) acc.strict[ref] = (acc.strict[ref] || 0) + 1;
            }
          }
        }
      });
    });
    return acc;
  }
  // Os dois itens mais votados.
  function top2(o) {
    var k,
      a = [];
    for (k in o) a.push([k, o[k]]);
    a.sort(function (x, y) {
      return y[1] - x[1];
    });
    return a;
  }
  /* só confirma quando várias leituras independentes concordam; senão deixa em branco */
  function pickCodes(acc) {
    var rf = top2(acc.refs),
      st = top2(acc.strict),
      md = top2(acc.meds),
      best = rf[0] ? rf[0][0] : null,
      okRef =
        st[0] &&
        st[0][1] >= 3 &&
        st[0][1] >=
          2 *
            (rf.filter(function (x) {
              return x[0] !== st[0][0];
            })[0] || [0, 0])[1],
      okMed = md[0] && md[0][1] >= 3 && md[0][1] >= 2 * (md[1] || [0, 0])[1];
    return {
      ref: okRef ? st[0][0] : null,
      maybe: best,
      med: okMed ? md[0][0] : null,
      maybeMed: md[0] ? md[0][0] : null
    };
  }
  // Textos iguais ou com no máximo 1 erro?
  function lev1(a, b) {
    if (a === b) return true;
    var la = a.length,
      lb = b.length;
    if (Math.abs(la - lb) > 1) return false;
    var i = 0;
    while (i < la && i < lb && a[i] === b[i]) i++;
    if (la === lb) return a.slice(i + 1) === b.slice(i + 1);
    return la > lb ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
  }
  // Busca aproximada de um código no texto.
  function fuzzyHas(T, R) {
    var n = R.length,
      L,
      i;
    for (L = n - 1; L <= n + 1; L++)
      for (i = 0; i + L <= T.length; i++) if (lev1(T.substr(i, L), R)) return true;
    return false;
  }
  /* compara o que foi lido com as referências que já estão no catálogo (o mesmo modelo costuma entrar em várias cores) */
  function catMatch(txts) {
    var refs = {};
    S.items.forEach(function (it) {
      if (it.ref && String(it.ref).length >= 5) refs[String(it.ref).toUpperCase()] = 1;
    });
    var norm = (txts || []).map(function (t) {
        return t.toUpperCase().replace(/[^A-Z0-9]/g, '');
      }),
      votes = [];
    Object.keys(refs).forEach(function (R) {
      var c = 0;
      norm.forEach(function (T) {
        if (fuzzyHas(T, R)) c++;
      });
      if (c >= 2) votes.push([R, c]);
    });
    votes.sort(function (a, b) {
      return b[1] - a[1];
    });
    return votes.length && (votes.length === 1 || votes[0][1] >= 2 * votes[1][1])
      ? votes[0][0]
      : null;
  }
  // Lê o texto da foto com OCR offline.
  function readTess(canvas, prog) {
    return getWorker().then(function (w) {
      var W = canvas.width,
        H = canvas.height,
        acc = { refs: {}, strict: {}, meds: {} },
        hit = null,
        tiles = [],
        x,
        y,
        tw = Math.min(W, 900),
        th = Math.min(H, 600),
        sc1 = Math.min(2.5, 2600 / Math.max(W, H));
      tiles.push([0, 0, W, H, Math.min(2.5, 2600 / Math.max(W, H))]);
      for (y = 0; y < H; y += Math.floor(th * 0.6)) {
        for (x = 0; x < W; x += Math.floor(tw * 0.6)) {
          tiles.push([Math.min(x, W - tw), Math.min(y, H - th), tw, th, 2.5]);
          if (x + tw >= W) break;
        }
        if (y + th >= H) break;
      }
      var total = tiles.length + 12,
        done = 0;
      function tick() {
        done++;
        if (prog) prog(Math.min(done, total), total);
      }
      function setPsm(v) {
        return w.setParameters({ tessedit_pageseg_mode: String(v) });
      }
      function findHit(r, t) {
        var ws = (r.data.words || []).filter(function (q) {
          return /-\s?1[2-6]\d$/.test(q.text || '') && (q.text || '').length >= 6;
        });
        if (ws.length && !hit) {
          var q = ws[0].bbox;
          hit = {
            x: t[0] + q.x0 / t[4],
            y: t[1] + q.y0 / t[4],
            w: (q.x1 - q.x0) / t[4],
            h: (q.y1 - q.y0) / t[4],
            long: ws[0].text.length >= 12
          };
        }
      }
      /* etapa 1: varre a peça em blocos até achar a linha das medidas */
      function stage1(n) {
        if (n >= tiles.length || hit) return Promise.resolve();
        var t = tiles[n];
        tick();
        return w.recognize(prepTile(canvas, t[0], t[1], t[2], t[3], t[4])).then(function (r) {
          scanCodes([r.data.text], acc);
          findHit(r, t);
          return stage1(n + 1);
        });
      }
      /* etapa 2: recorta a linha em volta do código, amplia e lê de várias formas; os acertos repetidos viram "certeza" */
      function stage2() {
        if (!hit) return Promise.resolve();
        var jobs = [],
          pads = hit.long
            ? [
                [0.15, 0.1, 0.4, 0.4],
                [0.3, 0.15, 0.6, 0.6],
                [0.15, 0.1, 0.25, 0.25]
              ]
            : [
                [1.7, 0.15, 0.4, 0.4],
                [2.2, 0.2, 0.7, 0.7],
                [1.5, 0.1, 0.3, 0.3]
              ];
        pads.forEach(function (pd) {
          [
            [7, 1],
            [6, 1],
            [6, 0],
            [7, 0]
          ].forEach(function (v) {
            jobs.push([pd, 3, v[0], v[1]]);
          });
        });
        function run(n) {
          if (n >= jobs.length) return Promise.resolve();
          var jb = jobs[n],
            pd = jb[0],
            cx0 = Math.max(0, hit.x - hit.w * pd[0]),
            cx1 = Math.min(W, hit.x + hit.w * (1 + pd[1])),
            cy0 = Math.max(0, hit.y - hit.h * pd[2]),
            cy1 = Math.min(H, hit.y + hit.h * (1 + pd[3]));
          tick();
          return setPsm(jb[2])
            .then(function () {
              return w.recognize(prepTile(canvas, cx0, cy0, cx1 - cx0, cy1 - cy0, jb[1], jb[3]));
            })
            .then(function (r) {
              scanCodes([r.data.text], acc);
              var p = pickCodes(acc);
              if (p.ref && p.med) return;
              return run(n + 1);
            });
        }
        return run(0);
      }
      return setPsm(11)
        .then(function () {
          return stage1(0);
        })
        .then(stage2)
        .then(function () {
          var p = pickCodes(acc);
          return {
            referencia: p.ref,
            medidas: p.med,
            _maybe: p.maybe,
            _maybeMed: p.maybeMed,
            _cat: p.ref ? null : catMatch(acc.txts)
          };
        });
    });
  }
  /* app instalado: baixa o leitor uma vez (com internet) para depois funcionar offline */
  setTimeout(function () {
    try {
      if (navigator.onLine && navigator.serviceWorker && navigator.serviceWorker.controller)
        getWorker().catch(function () {});
    } catch (e) {}
  }, 6000);
  // Mostra o estado da leitura.
  function setRead(t, cls) {
    if (t && !/…\s*$/.test(t)) loadMsg(false);
    var e = $('phRead');
    e.hidden = !t;
    e.className = 'note ' + (cls || 'n-info');
    e.textContent = t || '';
  }
  // Aplica o resultado da leitura aos campos.
  function applyRead(r, tok, eng) {
    if (!P || P.tok !== tok || !r) return;
    var got = [];
    if (r.pecas && r.pecas.length >= 2 && P.full) {
      var bx = r.pecas.map(function (q) {
          return q && q.caixa && q.caixa.length === 4
            ? q.caixa.map(function (v) {
                return Math.max(0, Math.min(1, v / 1000));
              })
            : null;
        }),
        okb = bx.every(function (b) {
          return b && b[2] > b[0] + 0.02 && b[3] > b[1] + 0.02;
        });
      if (okb) {
        openBatch(bx, P.full, r.pecas, r);
        return;
      }
    }
    function nz(x) {
      return x != null && x !== '' && String(x).toLowerCase() !== 'null';
    }
    if (nz(r.referencia) && !$('phRef').value.trim()) {
      $('phRef').value = String(r.referencia).toUpperCase().replace(/\s/g, '');
      got.push('referência ' + $('phRef').value);
    }
    if (nz(r.medidas) && !$('phMed').value.trim()) {
      var mm = String(r.medidas).match(/(\d{2})\D+(\d{2})\D+(\d{3})/);
      if (mm) {
        $('phMed').value = mm[1] + '□' + mm[2] + '-' + mm[3];
        got.push('medidas ' + $('phMed').value);
      }
    }
    if (nz(r.variante) && /^C(?:1[0-2]|[1-9])$/i.test(r.variante)) {
      ensureVar(r.variante);
      P.vr = r.variante.toUpperCase();
      got.push(P.vr);
    }
    if (nz(r.grau) && !$('phGrau').value.trim()) {
      var gn = normGrau(r.grau);
      if (gn) {
        $('phGrau').value = gn;
        got.push('grau ' + gn);
      }
    }
    if (nz(r.tipo) && ['pre', 'sem', 'solar'].indexOf(r.tipo) >= 0 && !P.photoOnly) {
      P.tipo = r.tipo;
      got.push('tipo');
    }
    if (nz(r.formato)) {
      var fm = S.formats.filter(function (x) {
        return x.toLowerCase() === String(r.formato).toLowerCase();
      })[0];
      if (fm) {
        P.fmt = fm;
        got.push('formato ' + fm);
      }
    }
    if (nz(r.cor) && !P.corSet && !P.photoOnly) {
      /*cor lida pela IA só sugere se a paleta tiver igual*/ var cn = Object.keys(S.palette).filter(
        function (k) {
          return k.toLowerCase() === String(r.cor).toLowerCase();
        }
      )[0];
      if (cn) {
        $('phCor').value = cn;
        got.push('cor ' + cn);
      }
    }
    var nt = [r.extras, r.material].filter(nz).join(' · ');
    if (nt && !$('phNotas').value.trim()) {
      $('phNotas').value = nt;
      $('phDescP').value = ($('phDescP').value.trim() + ' ' + nt).trim();
      got.push(nt);
    }
    if (got.length)
      setRead(
        'Li na foto (' + (eng || '') + '): ' + got.join(', ') + '. Confira antes de confirmar.',
        'n-ok'
      );
    else
      setRead(
        'Não consegui ler um código nesta foto (' + (eng || '') + '). Digite a referência.',
        'n-warn'
      );
    render();
  }
  // Recorta a área da etiqueta para leitura.
  function cropForRead(img, bb) {
    var w = img.naturalWidth || img.width,
      h = img.naturalHeight || img.height,
      pd = 0.08,
      x0 = Math.max(0, (bb[0] - pd) * w),
      y0 = Math.max(0, (bb[1] - pd) * h),
      x1 = Math.min(w, (bb[2] + pd) * w),
      y1 = Math.min(h, (bb[3] + pd) * h),
      cw = x1 - x0,
      ch = y1 - y0,
      sc = Math.min(1, 2000 / Math.max(cw, ch)),
      c = mkCanvas(cw * sc, ch * sc),
      g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(img, x0, y0, cw, ch, 0, 0, c.width, c.height);
    return c;
  }
  // Lê o código da foto (IA online; senão OCR offline).
  function readPhoto(full, tok, img, bb) {
    setRead('Lendo o código da foto…', 'n-info');
    var crop = img && bb ? cropForRead(img, bb) : full,
      eng = 'Claude';
    Promise.all([toBlob(crop, 0.92), toBlob(full, 0.85)]).then(function (bl) {
      return readSample(crop === full ? [bl[0]] : bl).then(
        function (r) {
          applyRead(r, tok, 'Claude');
        },
        function () {
          return readTess(crop, function (i, n) {
            if (P && P.tok === tok)
              setRead('Lendo o código da foto… (' + i + '/' + n + ')', 'n-info');
          }).then(
            function (r) {
              applyRead(r, tok, 'leitura local');
              if (!r.referencia && r._cat && P && P.tok === tok && !$('phRef').value.trim()) {
                $('phRef').value = r._cat;
                render();
                setRead(
                  'Parece ' +
                    r._cat +
                    ' (já está no seu catálogo)' +
                    (r.medidas ? ', medidas ' + r.medidas : '') +
                    '. Confira na peça antes de confirmar.',
                  'n-ok'
                );
              } else if (!r.referencia && P && P.tok === tok && !$('phRef').value.trim())
                setRead(
                  (r.medidas
                    ? 'Li as medidas ' + r.medidas + ', mas não tenho certeza do código'
                    : 'Não tenho certeza do código') +
                    (r._maybe ? ' (parece ' + r._maybe + ', confira)' : '') +
                    '. Toque em "Foto de perto só do código" ou digite a referência.' +
                    httpsHint(),
                  'n-warn'
                );
            },
            function (e) {
              if (P && P.tok === tok)
                setRead(
                  e && (e.code === 'offline' || e.code === 'timeout')
                    ? 'Leitor de texto ainda não baixado. Abra o app uma vez com internet e tente de novo. Por enquanto, digite a referência.'
                    : 'Não consegui ler o código nesta foto. Digite a referência.',
                  'n-warn'
                );
            }
          );
        }
      );
    });
  }
  // ===== Fila de fotos e cartão da foto (cadastro de nova peça). =====
  $('phCodeBtn').onclick = function () {
    if (!P) return;
    var tok = P.tok;
    function put(x) {
      if (!P || P.tok !== tok) return;
      if (!x || !x.ref) {
        setRead(
          'Não detectei o código. Aproxime a haste, deixe o texto na faixa e tente de novo, ou digite a referência.' +
            (HERR ? ' (leitor: ' + HERR + ')' : '') +
            httpsHint(),
          'n-warn'
        );
        render();
        return;
      }
      $('phRef').value = x.ref;
      var got = [x.ref];
      if (x.med) {
        $('phMed').value = x.med;
        got.push(x.med);
      }
      {
        var ri = refInfo(x.ref);
        if (ri.nome && !$('phNome').value.trim()) {
          $('phNome').value = ri.nome;
          got.push('nome');
        }
        if (ri.custo && !$('phCusto').value.trim()) {
          $('phCusto').value = ri.custo;
          got.push('custo');
        }
      }
      if (/^C(?:1[0-2]|[1-9])$/.test(x.vr || '') && !P.photoOnly) {
        ensureVar(x.vr);
        P.vr = x.vr;
        got.push(x.vr);
      }
      setRead('Leitor: ' + got.join(' · ') + '. Confira antes de confirmar.', 'n-ok');
      render();
    }
    camOpen(function () {}, 'Leitor de código', {
      strip: true,
      gallery: true,
      live: put,
      liveFallback: function (f) {
        setRead('Lendo o código…', 'n-info');
        (window.createImageBitmap ? createImageBitmap(f) : Promise.reject())
          .then(function (bm) {
            var c = mkCanvas(bm.width, bm.height);
            c.getContext('2d').drawImage(bm, 0, 0);
            return preRead(c);
          })
          .catch(function () {
            return null;
          })
          .then(put);
      },
      tip: 'Aponte para o código da haste e deixe o texto dentro da faixa. A leitura é automática, sem tirar foto.'
    });
  };
  $('phCodeFile').onchange = function (e) {
    var f = e.target.files && e.target.files[0];
    if (!f || !P) return;
    var url = URL.createObjectURL(f),
      im = new Image(),
      tok = P.tok;
    im.onload = function () {
      try {
        $('phRef').value = '';
        var full = fitCanvas(im, 2200);
        readPhoto(full, tok, null, null, true);
      } catch (x) {
        setRead('Não consegui abrir esta foto.', 'n-warn');
      }
      URL.revokeObjectURL(url);
    };
    im.onerror = function () {
      setRead('Não consegui abrir esta foto.', 'n-warn');
    };
    im.src = url;
  };
  var Q = [];
  // Avança para a próxima foto da fila.
  function nextQ() {
    if (Q.length) {
      var nf = Q.shift();
      S.msg = Q.length
        ? 'Próxima foto da galeria. Depois dela faltam ' + Q.length + '.'
        : 'Última foto da galeria.';
      setTimeout(function () {
        $('file').onchange({ target: { files: [nf] } }, true);
      }, 50);
    }
  }
  $('file').onchange = function (e, keep) {
    var fl = e.target.files,
      f = fl && fl[0];
    if (!f) return;
    loadMsg(true);
    if (!keep) Q = Array.prototype.slice.call(fl, 1);
    var url = URL.createObjectURL(f),
      img = new Image();
    img.onload = function () {
      if (!img.__y) {
        img.__y = 1;
        setTimeout(img.onload, 40);
        return;
      }
      var GAL0 = !!window.__GAL,
        FB0 = S.fundoBranco === false;
      window.__GAL = false;
      var full;
      try {
        full = fitCanvas(img, 2600);
      } catch (e0) {
        full = fitCanvas(img, 1600);
      }
      var prePromise = null,
        rest = function () {
          var done = function (res) {
            loadMsg(false);
            S.msg = '';
            try {
              var sk = skin(res.canvas, [128, 128, 128]),
                hx =
                  '#' +
                  sk
                    .map(function (v) {
                      return ('0' + Math.round(v).toString(16)).slice(-2);
                    })
                    .join('');
              var tok = Date.now();
              P = {
                img: res.canvas.toDataURL('image/jpeg', 0.93),
                thumb: thumbOf(res.canvas),
                hex: hx,
                qty: 1,
                fmt: '',
                vr: 'C1',
                guess: nearest(sk[0], sk[1], sk[2]),
                photoOnly: !!S.photoFor,
                tok: tok,
                tipo: null,
                full: full,
                pieces: res.pieces || [],
                fb0: FB0
              };
              try {
                var oc0 = fitCanvas(img, 1800);
                P.oImg = oc0.toDataURL('image/jpeg', 0.93);
                P.oThumb = thumbOf(oc0);
                P.pImg = P.img;
                P.pThumb = P.thumb;
              } catch (eo) {}
              var rawMsg = '';
              if (!S.photoFor && !GAL0 && !FB0) {
                var cov = coverOf(res.canvas),
                  sh = sharpOf(full),
                  bb = res.bbox,
                  ar = bb ? (bb[2] - bb[0]) * (bb[3] - bb[1]) : null;
                if (
                  sh < 20 ||
                  cov < 0.015 ||
                  cov > 0.85 ||
                  (ar != null && (ar < 0.03 || ar > 0.92))
                ) {
                  var oc = fitCanvas(img, 1800);
                  P.img = oc.toDataURL('image/jpeg', 0.93);
                  P.thumb = thumbOf(oc);
                  P.raw = 1;
                  rawMsg =
                    sh < 20
                      ? 'A foto ficou desfocada, então mantive a original, sem ajuste de fundo. Refaça com mais luz e foco para ter a foto de catálogo.'
                      : 'Não reconheci uma armação inteira e nítida, então mantive a foto original, sem ajuste de fundo.';
                }
              }
              var pf0 = S.photoFor;
              S.photoFor = null;
              var fv = function (id) {
                  var e = $(id);
                  return e && e.value ? e.value.trim() : '';
                },
                fr0 = pf0 ? '' : fv('eRef');
              $('phRef').value = pf0 ? pf0.ref : fr0;
              $('phCor').value = pf0 ? pf0.cor : fr0 && fv('eCor') ? fv('eCor') : P.guess;
              $('phGrau').value = fr0 ? fv('eGrau') : '';
              $('phMed').value = fr0 ? fv('eMed') : '';
              $('phNotas').value = '';
              $('phDescP').value =
                pf0 || fr0 ? '' : descSugerida(P.tipo || S.tipo, P.guess);
              $('phNome').value = fr0 ? fv('eNome') : '';
              if ($('phCusto')) $('phCusto').value = fr0 ? fv('eCusto') : '';
              setRead('');
              if (fr0) {
                P.tipo = S.tipo;
                var ev = S.tipo === 'pre' ? S.eVarP : S.eVar;
                if (/^C(?:1[0-2]|[1-9])$/.test(ev || '')) P.vr = ev;
                if (S.eFmt) P.fmt = S.eFmt;
                setRead(
                  'Mantive os dados do leitor (' + fr0 + '). Confira antes de confirmar.',
                  'n-ok'
                );
              }
              S.photoOpen = true;
              render();
              $('photoCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
              if (!pf0 && !P.photoOnly && PRE0) {
                setRead('Lendo o código, as medidas e a cor C da foto…', 'n-info');
                prePromise.then(function (x) {
                  if (!P || P.tok !== tok) return;
                  if (x && (x.ref || x.med || x.vr)) applyPre(x, tok);
                  else if (!(OCRDEAD && Date.now() - OCRDEAD < 90000))
                    readPhoto(full, tok, img, res.bbox);
                  else
                    setRead(
                      'Não consegui ler o código nesta foto. Digite a referência.' + httpsHint(),
                      'n-warn'
                    );
                });
              }
              if (rawMsg) {
                S.msg = rawMsg;
                render();
              }
            } catch (err) {
              S.msg = 'Não consegui processar essa foto. Tente outra.';
              render();
            }
            URL.revokeObjectURL(url);
          };
          /* foto da galeria: entra como está. Fundo já branco: só enquadra, sem recorte nem IA */
          if (GAL0 || FB0) {
            S.msg = '';
            try {
              done({ canvas: fitCanvas(img, 1800), bbox: null, pieces: [] });
            } catch (e5) {
              S.msg = 'Não consegui processar essa foto. Tente outra.';
              render();
            }
            return;
          }
          var wh0 = false;
          try {
            wh0 = whiteBg(full);
          } catch (e4) {}
          if (wh0 && !window.__NOSEG) {
            S.msg = '';
            try {
              done(lightWhite(full));
              return;
            } catch (e6) {}
          }
          var classic = function () {
            var r;
            try {
              r = whiten(full);
            } catch (e1) {
              full = fitCanvas(img, 1600);
              r = whiten(full);
            }
            return r;
          };
          var plain = true;
          try {
            plain = bgIsPlain(full);
          } catch (e2) {}
          /* fundo "liso" mas que não é folha branca (estante, balcão): o recorte simples perde aros transparentes, então o modelo tem prioridade */
          var shelfy = false;
          if (plain && !window.__NOSEG) {
            try {
              shelfy = shelfLike(full);
            } catch (e3) {}
          }
          if (window.__NOSEG) {
            S.msg = 'Ajustando a foto de catálogo…';
            render();
            setTimeout(function () {
              try {
                done(classic());
              } catch (err) {
                S.msg = 'Não consegui processar essa foto. Tente outra.';
                render();
              }
            }, 40);
            return;
          }
          SEG.on = function (t) {
            S.msg = t;
            render();
          };
          S.msg = 'Recortando a armação…';
          render();
          modelWhiten(full).then(
            function (r) {
              SEG.on = null;
              S.msg = '';
              done(r);
              S.msg = shelfy
                ? 'Confira o recorte (lentes, bordas, pedaços do fundo) antes de confirmar.'
                : 'Atenção: o fundo desta foto não é liso e claro. Confira o recorte (lentes, bordas, pedaços do fundo). Para foto de catálogo, use uma folha branca ou cinza clara por baixo, principalmente em armação transparente.';
              render();
            },
            function (er) {
              SEG.on = null;
              window.__SEGERR = String((er && er.message) || er);
              try {
                var fb;
                try {
                  fb = flatWhite(full);
                } catch (e7) {
                  fb = classic();
                }
                done(fb);
                S.msg =
                  er && er.refusa
                    ? 'Não dá para gerar um fundo branco perfeito nesta foto: a armação é parecida com o fundo. Mantive a foto original, sem cortar nada. Para fundo branco, fotografe a peça sobre uma folha branca.'
                    : 'Não consegui recortar o fundo. Mantive a foto inteira, sem cortar a armação.' +
                      (er && er.refusa
                        ? ''
                        : /fetch|backend|wasm/i.test(String(window.__SEGERR))
                          ? ' A demo aberta dentro do Claude bloqueia o download do motor de recorte; no site hospedado ou no APK ele funciona.'
                          : ' Detalhe: ' + String(window.__SEGERR || '?').slice(0, 90) + '.');
                render();
                try {
                  setRead(S.msg, 'n-warn');
                } catch (e8) {}
              } catch (err) {
                S.msg = 'Não consegui processar essa foto. Tente outra.';
                render();
              }
            }
          );
        };
      var PRE0 = PRESET;
      PRESET = null;
      prePromise = Promise.resolve(PRE0);
      rest();
    };
    img.onerror = function () {
      loadMsg(false);
      S.msg = 'Não consegui abrir essa imagem. Tente outra foto.';
      render();
    };
    img.src = url;
  };
  $('fileG').onchange = $('file').onchange;
  ['phRef', 'phCor', 'phGrau', 'phMed', 'phNotas'].forEach(function (id) {
    $(id).oninput = function () {
      if (id === 'phCor' && P) P.corSet = 1;
      render();
    };
  });
  $('phCancel').onclick = function () {
    P = null;
    render();
    nextQ();
  };
  $('phMn').onclick = function () {
    if (P) {
      P.qty = Math.max(1, P.qty - 1);
      render();
    }
  };
  $('phPl').onclick = function () {
    if (P) {
      P.qty = Math.min(99, P.qty + 1);
      render();
    }
  };
  // Dados digitados no cartão da foto.
  function phInfo() {
    var sm0 = isSimple((P && P.tipo) || S.tipo),
      ref = normRef($('phRef').value, sm0),
      cor = cap1($('phCor').value) || 'Sem cor',
      known = ref
        ? S.items.filter(function (i) {
            return i.ref.toUpperCase() === ref;
          })[0]
        : null;
    var tipo = known ? known.tipo : (P && P.tipo) || S.tipo,
      same = known
        ? S.items.some(function (i) {
            return i.ref.toUpperCase() === ref && i.cor.toLowerCase() === cor.toLowerCase();
          })
        : false;
    return {
      ref: ref,
      cor: cor,
      known: known,
      tipo: tipo,
      same: same,
      isPre: tipo === 'pre',
      simple: isSimple(tipo)
    };
  }
  // Cartão da foto: prévia, leitura e cadastro.
  function syncFB() {
    var c = $('fbCk');
    if (c) c.checked = S.fundoBranco !== false;
  }
  $('fbCk').onchange = function () {
    S.fundoBranco = !!this.checked;
    saveSoon();
  };
  $('phOrig').onclick = function () {
    if (!P || !P.oImg) return;
    var usaO = P.img === P.oImg;
    P.img = usaO ? P.pImg : P.oImg;
    P.thumb = usaO ? P.pThumb : P.oThumb;
    P.raw = 0;
    render();
  };
  function renderPhoto() {
    syncFB();
    var card = $('photoCard');
    if (!P) {
      card.hidden = true;
      return;
    }
    card.hidden = false;
    try {
      var pi0 = phInfo();
      updSim('phRef', 'phNome', 'phRefH', 'phSim', !pi0.ref || !!pi0.known || pi0.simple);
    } catch (eP) {}
    var sp = $('phSplit'),
      np = P.pieces ? P.pieces.length : 0;
    sp.hidden = P.photoOnly || np < 2;
    if (!sp.hidden)
      sp.textContent = 'Esta foto tem ' + np + ' peças separadas. Separar em ' + np + ' fotos';
    var ex0 = null;
    try {
      var f00 = phInfo();
      if (!f00.simple && !f00.isPre && f00.ref && P.vr) {
        var kk = f00.ref + '|' + P.vr;
        ex0 = S.items.filter(function (i) {
          return i.ref.toUpperCase() === f00.ref && i.vr === P.vr && !i.bulk;
        })[0];
        if (P.corKey !== kk) {
          P.corKey = kk;
          if (ex0 && !P.corSet) $('phCor').value = ex0.cor;
        }
      }
    } catch (eC) {}
    var f = phInfo(),
      m = $('phMatch');
    var pi = $('phIdent');
    pi.hidden = !!P.photoOnly || f.simple;
    if (!pi.hidden) {
      if (P.idRef !== f.ref) {
        P.idRef = f.ref;
        P.id = Object.assign({}, attrOf(f.ref));
      }
      if (!pi.contains(document.activeElement)) identBox(pi, P.id, null);
    }
    $('phCorChips').hidden = true;
    $('phCorNew').hidden = true;
    $('phImg').src = P.img;
    var ob = $('phOrig');
    ob.hidden = !(P.oImg && P.pImg && P.oImg !== P.pImg);
    ob.textContent = P.img === P.oImg ? '↺ Voltar ao fundo branco automático' : '📷 Usar a foto original (sem ajuste)';
    {
      var pgc = pickG(f.tipo, P.g).g;
      if (pgc) P.qty = Math.max(1, Math.min(P.qty, Math.max(grpFalta(pgc), 1)));
    }
    $('phQ').value = P.qty;
    if (!f.ref) {
      m.className = 'note n-info';
      m.textContent = 'Digite a referência para o app comparar com o estoque.';
    } else if (f.known && f.same) {
      m.className = 'note n-ok';
      m.textContent =
        'Mesmo produto e mesma cor já cadastrados (' +
        f.ref +
        ' ' +
        f.cor +
        '). A foto entra no catálogo dele e a quantidade soma no estoque.';
    } else if (f.known) {
      m.className = 'note n-warn';
      m.textContent =
        'Produto já existe (' +
        f.ref +
        (f.simple ? '' : ', formato ' + f.known.fmt) +
        '). Esta é uma cor nova: "' +
        (f.cor || '?') +
        '" será adicionada a ele, com a foto.';
    } else {
      m.className = 'note n-info';
      m.textContent =
        'Produto novo. Será criado em ' +
        TIPOS.filter(function (t) {
          return t.id === f.tipo;
        })[0].full +
        ' com os dados abaixo e a foto.';
    }
    $('phDot').style.background = hexOf(f.cor) === '#8b9bb0' && f.cor ? P.hex : hexOf(f.cor);
    $('phCorH').textContent = ex0
      ? P.vr + ' deste modelo já é "' + ex0.cor + '". Altere só se for outra cor.'
      : 'Digite a cor deste ' + (P.vr || 'C') + ' (a cor muda de modelo para modelo). Sugestão da foto: ' + P.guess + '.';
    var cc = $('phCorChips');
    cc.textContent = '';
    Object.keys(S.palette)
      .filter(quickCor)
      .forEach(function (n) {
        var b = btn(
          'chip' + (n.toLowerCase() === f.cor.toLowerCase() ? ' on' : ''),
          ' ' + n,
          function () {
            $('phCor').value = f.cor.toLowerCase() === n.toLowerCase() ? '' : n;
            render();
          }
        );
        b.insertBefore(dot(S.palette[n]), b.firstChild);
        cc.appendChild(b);
      });
    cc.appendChild(
      btn('chip add', '+ Nova cor', function () {
        S.nc = S.nc === 'p' ? '' : 'p';
        S.nf = '';
        $('phCorNew').textContent = '';
        render();
      })
    );
    newBox(
      $('phCorNew'),
      'p',
      true,
      'Nome da cor (ex.: Azul marinho)',
      corDone(function (n) {
        $('phCor').value = n;
      })
    );
    $('phTipoB').hidden = !!f.known || !!P.photoOnly;
    var pt = $('phTipos');
    pt.textContent = '';
    TIPOS.forEach(function (t) {
      pt.appendChild(
        btn(
          'chip' + (t.id === f.tipo ? ' on' : ''),
          t.label,
          function () {
            P.tipo = t.id;
            render();
          },
          t.id === f.tipo
        )
      );
    });
    $('phNotB').hidden = !!f.known || !!P.photoOnly;
    $('phFmtB').hidden = !!f.known;
    var fu = P.fmt && S.formats.indexOf(P.fmt) >= 0 ? P.fmt : '';
    var pf = $('phFmts');
    pf.textContent = '';
    fmtCat(fu).forEach(function (x) {
      pf.appendChild(
        btn(
          'chip' + (x === fu ? ' on' : ''),
          x,
          function () {
            P.fmt = P.fmt === x ? '' : x;
            render();
          },
          x === fu
        )
      );
    });
    pf.appendChild(
      btn('chip add', '+ Novo formato', function () {
        S.nf = S.nf === 'p' ? '' : 'p';
        S.nc = '';
        $('phFmtNew').textContent = '';
        render();
      })
    );
    newBox(
      $('phFmtNew'),
      'p',
      false,
      'Nome do formato (ex.: Oval)',
      fmtDone(function (n) {
        P.fmt = n;
      })
    );
    $('phGrauB').hidden = !f.isPre;
    $('phVarB').hidden = f.isPre || f.simple;
    var gn = normGrau($('phGrau').value);
    $('phGrauH').textContent = $('phGrau').value
      ? gn
        ? 'Grau lido: ' + gn
        : 'Grau inválido. Use algo como +1.75, 175 ou 3.50.'
      : 'Digite como está gravado. O "+175" vira +1.75.';
    $('phGrauH').style.color = $('phGrau').value
      ? gn
        ? 'var(--ok)'
        : 'var(--bad)'
      : 'var(--mute)';
    var pv = $('phVars');
    pv.textContent = '';
    addVarChips(pv, P.vr, function (v) {
      P.vr = v;
      render();
    });
    var po = !!P.photoOnly;
    $('phQB').hidden = po;
    if (po) {
      $('phGrauB').hidden = true;
      $('phVarB').hidden = true;
      $('phFmtB').hidden = true;
      m.className = 'note n-info';
      m.textContent =
        'A foto será salva no catálogo de ' +
        (f.ref || '?') +
        ' ' +
        (f.cor || '') +
        '. O estoque não muda.';
    }
    loteChips('phLote', f.tipo, P.g, function (v) {
      P.g = v;
    });
    var pg1 = pickG(f.tipo, P.g);
    $('phCustoH').textContent = pg1.g
      ? 'Sem preencher, vale a média do lote: ' + usd(gUnit(pg1.g)) + ' por peça.'
      : 'Obrigatório: este produto não está em nenhum lote.';
    $('phCustoB').hidden = !!po;
    if (po) $('phLoteB').hidden = true;
    $('phOk').textContent = po ? 'Salvar foto' : 'Confirmar e adicionar';
    $('phErr').hidden = true;
  }
  $('phOk').onclick = function () {
    if (!P) return;
    var f = phInfo(),
      gn = normGrau($('phGrau').value),
      err = $('phErr');
    function bad(t) {
      err.hidden = false;
      err.textContent = t;
    }
    if (!f.ref) return bad('Informe a referência da peça.');
    if (P.photoOnly) {
      if (!f.cor) return bad('Informe a cor da foto.');
      setFoto(f.ref + '|' + f.cor, P.thumb || P.img, P.img);
      S.msg = 'Foto salva em ' + f.ref + ' ' + f.cor + '.';
      S.open = f.ref;
      S.det = true;
      S.detCor = f.cor;
      S.detVr = null;
      P = null;
      render();
      return;
    }
    if (!f.cor) return bad('Informe a cor real da peça.');
    if (f.isPre && !gn) return bad('Informe um grau válido.');
    var gr = pickG(f.tipo, P.g);
    if (gr.err) return bad(gr.err);
    var gcap = gCap(gr.g, P.qty);
    if (gcap) {
      popErr(gcap);
      return;
    }
    var gid = gr.g ? gr.g.id : '';
    var ccv = $('phCusto').value.trim(),
      cu = ccv === '' ? null : parseFloat(ccv.replace(',', '.')),
      noCost = cu == null && !gr.g;
    if (!gr.g && !(cu > 0)) {
      popErr(
        'Informe o custo por peça em US$, ou escolha o lote de origem. Sem lote, o custo é obrigatório.'
      );
      return;
    }
    if (ccv !== '' && !(cu >= 0))
      return bad('Custo inválido. Use um número em US$ (ex.: 0,50) ou deixe vazio.');
    var newCor = !Object.keys(S.palette).some(function (k) {
      return k.toLowerCase() === f.cor.toLowerCase();
    });
    if (newCor) S.palette[f.cor] = f.cor === 'Sem cor' ? '#9aa4b2' : P.hex;
    var fmt = f.known ? f.known.fmt : P.fmt && S.formats.indexOf(P.fmt) >= 0 ? P.fmt : '';
    var ex = S.items.filter(function (x) {
      return (
        x.tipo === f.tipo &&
        x.ref.toUpperCase() === f.ref &&
        x.cor.toLowerCase() === f.cor.toLowerCase() &&
        (f.isPre ? x.grau === gn : x.vr === (f.simple ? '' : P.vr)) &&
        (x.lote || '') === gid &&
        (cu == null || x.custo == null || x.custo === cu)
      );
    })[0];
    var med = f.simple ? '' : f.known && f.known.med ? f.known.med : $('phMed').value.trim();
    if (gr.g && cu != null) {
      var ce2 = gCostErr(
        gr.g,
        ex && ex.custo == null ? cu * (ex.qty + P.qty) : cu * P.qty,
        null,
        cu,
        P.qty
      );
      if (ce2) {
        popErr(ce2);
        return;
      }
    }
    if (!f.simple) setPN(f.ref, $('phNome').value);
    if (!f.simple && P.id) setAttr(f.ref, P.id);
    $('phNome').value = '';
    $('phCusto').value = '';
    if (ex) {
      ex.qty += P.qty;
      if (ex.custo == null && cu != null) ex.custo = cu;
    } else
      S.items.push({
        custo: cu == null ? undefined : cu,
        lote: gid || undefined,
        tipo: f.tipo,
        grau: f.isPre ? gn : '',
        ref: f.ref,
        med: f.isPre ? '' : med,
        vr: f.isPre || f.simple ? '' : P.vr,
        fmt: fmt,
        cor: f.cor,
        qty: P.qty
      });
    var nt = $('phDescP').value.trim() || $('phNotas').value.trim();
    if (nt && (!f.known || !S.desc[f.ref])) S.desc[f.ref] = nt;
    $('phDescP').value = '';
    entradaEstoque(f.tipo, f.ref, f.cor, f.isPre ? gn : '', P.qty);
    setFoto(f.ref + '|' + f.cor, P.thumb || P.img, P.img);
    var what = f.known
      ? f.same
        ? 'foto e estoque atualizados'
        : 'cor nova adicionada ao produto'
      : 'produto novo criado';
    S.msg =
      'Pronto: ' +
      f.ref +
      ' ' +
      f.cor +
      ' (' +
      what +
      (newCor ? ', cor nova na paleta' : '') +
      ').' +
      (noCost ? ' Atenção: este produto ainda está sem preço de custo detalhado.' : '');
    if (S.fromLot) {
      S.todos = false;
      S.lotesView = true;
      S.lotSel = S.fromLot;
      S.lotPick = {};
      P = null;
      S.addOpen = false;
      S.fromLot = '';
      render();
      nextQ();
      return;
    }
    ASNAP = null;
    S.todos = false;
    S.lotesView = false;
    S.tipo = f.tipo;
    S.fmtF = 'all';
    S.corF = 'all';
    S.q = '';
    S.open = f.ref;
    S.det = true;
    S.selItem = null;
    S.detCor = f.cor;
    S.detVr = null;
    S.mode = 'venda';
    S.qty = 1;
    P = null;
    S.addOpen = false;
    render();
    nextQ();
    $('rows').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  // ================= Negócio: câmbio, despesas, vendas =================
  // ===== Formatadores, constantes e cálculo/registro de vendas. =====
  var DAY = 86400000,
    now0 = Date.now();
  // Timestamp de d dias e h horas atrás.
  function tAgo(d, h) {
    return now0 - d * DAY - (h || 0) * 3600000;
  }
  // Mostra um valor (guardado em guaranis) na moeda principal escolhida em Ajustes.
  var gs = function (n) {
    var m = S.moedaP;
    if ((m === 'usd' || m === 'brl') && S.fx && S.fx.pyg > 0) {
      var r = m === 'usd' ? S.fx.pyg : S.fx.brl > 0 ? S.fx.pyg / S.fx.brl : 0;
      if (r > 0) return (m === 'usd' ? 'US$ ' : 'R$ ') + dots(Math.round(n / r));
    }
    return 'G$ ' + dots(n);
  };
  // Sempre em guaranis (para cotações e valores que são, por natureza, G$).
  function gsRaw(n) {
    return 'G$ ' + dots(n);
  }
  // Formata número conforme a moeda.
  function nf(v, m) {
    return m === 'pyg'
      ? dots(v)
      : v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  // Formata valor com símbolo da moeda.
  function fmtM(v, m) {
    return (m === 'pyg' ? 'G$ ' : m === 'usd' ? 'US$ ' : 'R$ ') + nf(v, m);
  }
  var usd = function (n) {
    return fmtM(n, 'usd');
  };
  // Dólar sem centavos (painéis e resumos: a loja não trabalha com centavos).
  var usd0 = function (n) {
    return 'US$ ' + dots(Math.round(n));
  };
  var fmtM0 = function (v, m) {
    return m === 'pyg' ? gsRaw(v) : (m === 'usd' ? 'US$ ' : 'R$ ') + dots(Math.round(v));
  };
  var pc = function (n) {
    return (n * 100).toFixed(1).replace('.', ',') + '%';
  };
  var fd = function (ts) {
    return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };
  var fh = function (ts) {
    return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  var esc = function (x) {
    return String(x).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  var toNum = function (v) {
    return Number(String(v).replace(/\D/g, '')) || 0;
  };
  var sgn = function (n) {
    return (n > 0 ? '+' : n < 0 ? '−' : '') + gs(Math.abs(n));
  };
  var CATS = {
    loja: 'Loja',
    casa: 'Casa',
    pessoal: 'Salário',
    profissional: 'Contador',
    imprev: 'Imprevistos'
  };
  var VIEWS = [
    ['inicio', 'Início'],
    ['dash', 'Dashboard'],
    ['estoque', 'Inventário'],
    ['vendas', 'Vendas'],
    ['caixa', 'Caixa'],
    ['desp', 'Despesas'],
    ['fx', 'Câmbio'],
    ['hist', 'Histórico'],
    ['ped', 'Pedidos'],
    ['notif', 'Notificações'],
    ['ajustes', 'Ajustes']
  ];

  S.view = 'inicio';
  S.hmode = 'lista';
  S.day = '';
  S.dayTab = '';
  S.elog = [];
  S.per = 'mes';
  S.perDe = '';
  S.perAte = '';
  S.volume = 350;
  S.melhPeca = 1000;
  S.janela = 90;
  S.hf = 'all';
  S.hq = '';
  S.hOpen = '';
  S.confEst = '';
  S.confRm = '';
  S.lotes = [
    { id: '#3140', ts: tAgo(60), usd: 0.46, txt: 'Pré-graduados' },
    { id: '#3251', ts: tAgo(19), usd: 0.5, txt: 'Pré-graduados' }
  ];
  S.exp = [
    {
      id: 1,
      nome: 'Aluguel da loja',
      cat: 'loja',
      tipo: 'fixa',
      valor: 900000,
      hist: [{ ts: tAgo(150), de: 850000, para: 900000 }]
    },
    {
      id: 2,
      nome: 'Luz',
      cat: 'loja',
      tipo: 'variavel',
      valor: 180000,
      hist: [{ ts: tAgo(40), de: 165000, para: 180000 }]
    },
    { id: 3, nome: 'Internet', cat: 'loja', tipo: 'fixa', valor: 120000, hist: [] },
    {
      id: 4,
      nome: 'Contador',
      cat: 'profissional',
      tipo: 'fixa',
      valor: 300000,
      hist: [{ ts: tAgo(70), de: 250000, para: 300000 }]
    },
    { id: 5, nome: 'Salário (retirada)', cat: 'pessoal', tipo: 'fixa', valor: 1500000, hist: [] },
    {
      id: 6,
      nome: 'Contas de casa',
      cat: 'casa',
      tipo: 'variavel',
      valor: 1000000,
      hist: [{ ts: tAgo(30), de: 1100000, para: 1000000 }]
    },
    { id: 7, nome: 'Provisão de imprevistos', cat: 'imprev', tipo: 'fixa', valor: 200000, hist: [] }
  ];
  S.nextExp = 8;
  S.imprev = [{ ts: tAgo(6), desc: 'Conserto da vitrine', valor: 60000 }];
  S.fxHist = [];
  for (var fi = 29; fi >= 0; fi--) {
    var fk = 29 - fi;
    S.fxHist.push({
      ts: tAgo(fi),
      pyg: Math.round(6280 + fk * 7 + 60 * Math.sin(fk / 3.1)),
      brl: Math.round((5.4 + 0.03 * Math.sin(fk / 4)) * 1000) / 1000
    });
  }
  S.fx = {
    pyg: S.fxHist[29].pyg,
    brl: S.fxHist[29].brl,
    ts: now0,
    live: false,
    src: 'Valor de exemplo',
    status: 'Ainda não buscou a cotação.'
  };
  S.fxNext = Date.now() + 5000;

  // Soma das despesas mensais.
  function totalMensal() {
    syncExpFx();
    return S.exp.reduce(function (a, e) {
      return a + e.valor;
    }, 0);
  }
  // Despesa mensal rateada por peça.
  function contasPeca() {
    return Math.round((totalMensal() + reservaCambioContas()) / Math.max(1, volumeEfetivo()));
  }
  // Tipo pelo id.
  function tipoOf(id) {
    return tipoAll().filter(function (x) {
      return x.id === id;
    })[0];
  }
  // Colchão cambial calculado pelo histórico do câmbio.
  function colchao() {
    var from = Date.now() - S.janela * DAY,
      h = S.fxHist.filter(function (p) {
        return p.ts >= from;
      }),
      fx = 0,
      i,
      j;
    for (i = 0; i < h.length; i++)
      for (j = i + 1; j < h.length; j++) fx = Math.max(fx, h[j].pyg / h[i].pyg - 1);
    var l = lotesHist().filter(function (x) {
        return x.ts >= from;
      }),
      cost = 0;
    for (i = 0; i < l.length; i++)
      for (j = i + 1; j < l.length; j++) cost = Math.max(cost, l[j].usd / l[i].usd - 1);
    var raw = (1 + fx) * (1 + cost) - 1;
    return {
      pct: Math.min(0.25, Math.max(0.05, raw)),
      fx: fx,
      cost: cost,
      raw: raw,
      janela: S.janela
    };
  }
  // Calcula a divisão da venda: reposição, contas e lucro.
  function calcSale(t, qty, fx, pct, cPeca, melhPeca, priceOv, extraUSD) {
    var price = priceOv != null ? priceOv : t.price * qty,
      repP = Math.round(t.repUSD * fx),
      ex = extraUSD > 0 ? Math.round(extraUSD * fx) : 0,
      rep = repP * qty + ex,
      contas = cPeca * qty,
      colch = Math.round(t.repUSD * fx * pct) * qty;
    var melh = Math.min(melhPeca * qty, Math.max(0, price - rep - contas - colch)),
      livre = price - rep - contas - colch - melh;
    return {
      price: price,
      rep: rep,
      repUSD: t.repUSD * qty + (extraUSD > 0 ? extraUSD : 0),
      contas: contas,
      colch: colch,
      melh: melh,
      livre: livre,
      trava: repP + cPeca
    };
  }
  // Descrição curta de uma venda.
  function descOf(x) {
    return x.qty + '× ' + x.ref + ' ' + (x.tipo === 'pre' ? x.grau : x.vr) + ' · ' + x.cor;
  }
  S.sales = [];
  S.saleSeq = 0;
  // Cria uma venda (usada nos dados de exemplo).
  function mkSale(ts, tipo, ref, cor, grau, vr, qty, fx, pct, cPeca, est) {
    var t = tipoOf(tipo),
      c = calcSale(t, qty, fx, pct, cPeca, 1000);
    var s = {
      id: 'V-' + ('000' + ++S.saleSeq).slice(-4),
      ts: ts,
      tipo: tipo,
      ref: ref,
      cor: cor,
      grau: grau,
      vr: vr,
      qty: qty,
      fx: fx,
      pct: pct,
      pago: t.pago * qty,
      cPeca: cPeca,
      estorno: !!est
    };
    for (var k in c) s[k] = c[k];
    s.moeda = 'pyg';
    s.recebido = s.price;
    s.rate = 1;
    return s;
  }
  [
    [0, 2, 'pre', 'SP57765', 'Preto', '+1.00', '', 2],
    [0, 5, 'sem', 'BR44118', 'Bege translúcido', '', 'C2', 1],
    [1, 3, 'pre', 'SP60627', 'Bege translúcido', '+1.50', '', 1],
    [2, 4, 'solar', 'SL2201', 'Preto', '', 'C1', 1],
    [3, 2, 'pre', 'SP58110', 'Preto', '+1.25', '', 3],
    [4, 6, 'sem', 'BR44120', 'Preto', '', 'C1', 1, true],
    [5, 3, 'pre', 'SP57765', 'Preto', '+1.75', '', 2],
    [6, 1, 'solar', 'SL2210', 'Tartaruga', '', 'C3', 1],
    [9, 2, 'pre', 'SP59002', 'Tartaruga', '+2.50', '', 1]
  ].forEach(function (a) {
    S.sales.unshift(
      mkSale(
        tAgo(a[0], a[1]),
        a[2],
        a[3],
        a[4],
        a[5],
        a[6],
        a[7],
        S.fxHist[29 - a[0]].pyg,
        0.12,
        11500,
        a[8]
      )
    );
  });
  S.sales.reverse();
  S.sales.sort(function (a, b) {
    return b.ts - a.ts;
  });
  // Registra a venda e movimenta estoque e caixa.
  function addSale(it, qty, pay) {
    var c = colchao(),
      cp = contasPeca(),
      pg = pay.pag || {},
      rate = pg.rate > 0 ? pg.rate : ratePyg(pay.moeda),
      linhas = [{ moeda: pay.moeda, v: pay.recebido, rate: rate }].concat(pg.extra || []),
      trocos = pg.troco || [],
      recGs = linhas.reduce(function (a, l) {
        return a + Math.round(l.v * l.rate);
      }, 0),
      trGs = trocos.reduce(function (a, l) {
        return a + Math.round(l.v * l.rate);
      }, 0),
      eff = recGs - trGs,
      s = mkSale(
        Date.now(),
        it.tipo,
        it.ref,
        it.cor,
        it.grau,
        it.vr,
        qty,
        S.fx.pyg,
        c.pct,
        cp,
        false
      );
    var tf = tFor(it),
      pp = pisoPeca(it),
      bu = pay.brinde ? pay.brinde.usd : 0,
      bg = Math.round(bu * S.fx.pyg),
      m = calcSale(tf, qty, S.fx.pyg, c.pct, cp, S.melhPeca, eff, bu);
    for (var k in m) s[k] = m[k];
    var fm = formaPorId(pay.forma),
      tx = taxaGs(recGs, fm),
      txM = taxaMoeda(pay.recebido, pay.moeda, fm);
    s.livre -= tx;
    s.forma = fm.id;
    s.taxa = tx;
    s.taxaM = txM;
    s.faixa = (faixaOf(it.ref) || {}).id || '';
    s.lista = tf.price * qty;
    s.abaixo = eff - tx < pp.piso * qty + bg;
    s.perde = eff - tx < pp.trava * qty + bg;
    if (pay.brinde) s.brinde = pay.brinde;
    if (pay.motivo) s.motivo = pay.motivo;
    s.moeda = pay.moeda;
    s.recebido = pay.recebido;
    s.rate = Math.round(rate);
    s.pags = linhas.map(function (l) {
      var fee = taxaMoeda(l.v, l.moeda, fm);
      S.cash[l.moeda] += l.v - fee;
      return { moeda: l.moeda, v: l.v, rate: l.rate, fee: fee };
    });
    s.troco = trocos.map(function (l) {
      S.cash[l.moeda] -= l.v;
      return { moeda: l.moeda, v: l.v, rate: l.rate };
    });
    s.lote = it.lote || '';
    S.sales.unshift(s);
    return s;
  }
  // Mostra como o valor da venda se divide.
  function showSplit(sale) {
    var parts = [
      [
        'Reposição da mercadoria',
        usd(sale.repUSD) + ' ao câmbio de hoje (US$ 1 = ' + gsRaw(S.fx.pyg) + '). Obrigatório.',
        sale.rep,
        '#00c8ff'
      ],
      [
        'Contas da loja e de casa',
        'Parte do mês coberta por esta venda. Obrigatório.',
        sale.contas,
        '#a2447c'
      ],
      [
        'Colchão de segurança',
        pc(sale.pct) + ' da reposição, pela alta recente do dólar e do custo.',
        sale.colch,
        '#ffc766'
      ],
      ['Caixa de melhorias', 'Meta flexível. Não trava a venda.', sale.melh, 'var(--info)'],
      ['Taxa da maquininha', 'Sai do seu lucro. Já descontada do que entra no caixa.', sale.taxa || 0, '#ff9d7a'],
      ['Lucro livre', 'O que sobra para você.', sale.livre, '#00ff88']
    ];
    $('splitCard').hidden = false;
    marcaOk($('splitCard'));
    vibrar(25);
    $('splitH').textContent =
      'Venda ' +
      sale.id +
      ': ' +
      descOf(sale) +
      ' por ' +
      gs(sale.price) +
      (sale.moeda !== 'pyg' ? ' (recebido ' + fmtM(sale.recebido, sale.moeda) + ')' : '');
    var bar = $('splitBar');
    bar.textContent = '';
    var rowsEl = $('splitRows');
    rowsEl.textContent = '';
    parts.forEach(function (p) {
      if (p[0] === 'Taxa da maquininha' && !p[2]) return;
      var i = mk('i');
      i.style.width = Math.max(0, (p[2] / sale.price) * 100) + '%';
      i.style.background = p[3];
      bar.appendChild(i);
      var r = mk('div', 'sl');
      var l = mk('span', '');
      var sp = mk('span', 'sp');
      sp.style.background = p[3];
      l.appendChild(sp);
      l.appendChild(document.createTextNode(p[0]));
      l.appendChild(mk('small', '', p[1]));
      r.appendChild(l);
      var vb = mk('b', '', gs(p[2]));
      r.appendChild(vb);
      if (p[0] === 'Lucro livre') contaSubindo(vb, p[2], gs, 800);
      rowsEl.appendChild(r);
    });
    var n = $('splitNote');
    n.className = 'note ' + (sale.livre >= 0 ? 'n-info' : 'n-bad');
    n.textContent =
      'Preço mínimo seguro (trava): ' +
      gs(sale.trava) +
      ' por peça. Você vendeu a ' +
      gs(sale.price / sale.qty) +
      ', ' +
      (sale.livre >= 0
        ? 'então o preço está seguro. Subir preço é a última sugestão do app.'
        : 'abaixo do seguro. Veja a aba Dashboard.') +
      ' Esta venda foi gravada no Histórico.';
    $('splitCard').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  // ===== Campos de valor seguem a moeda principal (Ajustes). Os dados continuam guardados em G$ (ou US$ onde já era). =====
  // Moeda principal escolhida.
  function mp() {
    return S.moedaP === 'usd' || S.moedaP === 'brl' ? S.moedaP : 'pyg';
  }
  // Símbolo da moeda principal.
  function mpSim() {
    return { pyg: 'G$', usd: 'US$', brl: 'R$' }[mp()];
  }
  // Teclado: números inteiros em guarani, decimais nas outras.
  function mpMode() {
    return mp() === 'pyg' ? 'numeric' : 'decimal';
  }
  // Valor em guaranis -> texto do campo na moeda principal.
  function gsParaCampo(v) {
    var m = mp();
    return m === 'pyg' ? dots(v) : inVal(v / ratePyg(m), m);
  }
  // Texto digitado na moeda principal -> guaranis.
  function campoParaGs(txt) {
    var m = mp();
    return m === 'pyg' ? Math.round(toNum(txt)) : Math.round(parseDec(txt, m) * ratePyg(m));
  }
  // Valor em dólares -> texto do campo (meta, tolerância).
  function usdParaCampo(u) {
    var m = mp();
    if (m === 'usd') return u ? String(u).replace('.', ',') : '';
    return u ? gsParaCampo(u * S.fx.pyg) : '';
  }
  // Texto digitado -> dólares.
  function campoParaUsd(txt) {
    var m = mp();
    if (m === 'usd') return Math.max(0, parseDec(txt, 'usd'));
    return Math.max(0, campoParaGs(txt) / S.fx.pyg);
  }
  // Desconto em guaranis dentro de uma lista de preços (modo % ou valor na moeda principal).
  function descontoGs(lista) {
    var pct = S.descMode === 'pct',
      g = pct ? Math.round((lista * Math.min(100, parseDec(S.descTxt, 'usd'))) / 100) : campoParaGs(S.descTxt);
    return Math.max(0, Math.min(lista, g));
  }
  // <option>s de moeda com a principal já escolhida.
  function opcoesMoeda() {
    return [['pyg', 'G$'], ['usd', 'US$'], ['brl', 'R$']]
      .map(function (o) {
        return '<option value="' + o[0] + '"' + (o[0] === mp() ? ' selected' : '') + '>' + o[1] + '</option>';
      })
      .join('');
  }
  // ===== Categorias, formatos, cores, variações (C1–C6) e criação de tipos. =====

  // ---------- navegação

  // Data URL → Blob.
  function dataToBlob(u, type) {
    return fetch(u)
      .then(function (r) {
        return r.blob();
      })
      .then(function (b) {
        if (!type || b.type === type) return b;
        return new Promise(function (ok, no) {
          var im = new Image();
          im.onload = function () {
            var c = document.createElement('canvas');
            c.width = im.naturalWidth;
            c.height = im.naturalHeight;
            c.getContext('2d').drawImage(im, 0, 0);
            c.toBlob(function (x) {
              x ? ok(x) : no();
            }, type);
          };
          im.onerror = no;
          im.src = u;
        });
      });
  }
  // Categorias em uso.
  function catList() {
    var seen = {},
      out = [];
    S.items.forEach(function (i) {
      if (
        i.qty <= 0 ||
        !TIPOS.some(function (x) {
          return x.id === i.tipo;
        }) ||
        (S.cvTipo && S.cvTipo !== 'all' && i.tipo !== S.cvTipo)
      )
        return;
      var k = i.ref + '|' + i.cor;
      if (!S.fotos[k] || seen[k]) return;
      seen[k] = 1;
      out.push({
        k: k,
        ref: i.ref,
        cor: i.cor,
        src: S.fotos[k],
        cap: pubNome(i.ref) + (i.cor && i.cor !== 'Sem cor' ? ' · ' + i.cor : '')
      });
    });
    return out;
  }
  // Tela de categorias por tipo.
  function renderCatV() {
    if (!S.cvTipo) S.cvTipo = 'all';
    if (!S.cvOff) S.cvOff = {};
    var ct = $('cvTipos');
    ct.textContent = '';
    [{ id: 'all', label: 'Todos' }].concat(TIPOS).forEach(function (x) {
      ct.appendChild(
        btn(
          'chip' + (S.cvTipo === x.id ? ' on' : ''),
          x.label,
          function () {
            S.cvTipo = x.id;
            render();
          },
          S.cvTipo === x.id
        )
      );
    });
    var L = catList(),
      g = $('cvGal');
    g.textContent = '';
    var n = 0;
    L.forEach(function (o) {
      var on = !S.cvOff[o.k];
      if (on) n++;
      var t = mk('div', 'gi');
      t.style.cssText =
        'cursor:pointer;position:relative;outline:' +
        (on ? '2px solid var(--accent)' : '2px solid transparent') +
        ';opacity:' +
        (on ? 1 : 0.45);
      t.setAttribute('role', 'button');
      t.setAttribute('aria-pressed', on);
      t.tabIndex = 0;
      var im = mk('img');
      im.src = o.src;
      im.alt = 'Foto ' + o.cap;
      t.appendChild(im);
      t.appendChild(mk('b', '', o.ref));
      t.appendChild(mk('span', '', o.cor));
      var tg = function () {
        S.cvOff[o.k] = on;
        render();
      };
      t.onclick = tg;
      t.onkeydown = function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          tg();
        }
      };
      g.appendChild(t);
    });
    $('cvSend').disabled = !n;
    $('cvSend').textContent = n
      ? 'Enviar ' + n + ' ' + (n === 1 ? 'imagem' : 'imagens')
      : 'Enviar imagens';
    $('cvH').textContent = L.length
      ? 'No celular abre o compartilhamento e você escolhe o WhatsApp. No computador, as imagens são copiadas (uma por vez) ou baixadas.'
      : 'Sem fotos de peças em estoque nesse tipo. Use "+ Adicionar produto" > "Tirar foto da peça".';
  }
  $('cvSend').onclick = function () {
    var m = $('cvMsg'),
      sel = catList().filter(function (o) {
        return !S.cvOff[o.k];
      });
    if (!sel.length) return;
    m.textContent = 'Preparando…';
    Promise.all(
      sel.map(function (o) {
        return dataToBlob(o.src, 'image/jpeg').then(function (b) {
          return new File(
            [b],
            (slugNome(pubNome(o.ref)) || 'modelo') + '-' + slugNome(o.cor) + '.jpg',
            { type: 'image/jpeg' }
          );
        });
      })
    )
      .then(function (files) {
        if (navigator.canShare && navigator.canShare({ files: files })) {
          return navigator.share({
            files: files,
            text:
              'La Fouch · Tudo em Óculos\n' +
              sel
                .map(function (o) {
                  return o.cap;
                })
                .join('\n')
          }).then(
            function () {
              m.textContent = 'Enviado para o compartilhamento.';
            },
            function (e) {
              m.textContent = e && e.name === 'AbortError' ? '' : 'Não foi possível compartilhar.';
            }
          );
        }
        var one = sel[0];
        if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
          return dataToBlob(one.src, 'image/png')
            .then(function (pb) {
              return navigator.clipboard.write([new ClipboardItem({ 'image/png': pb })]);
            })
            .then(
              function () {
                m.textContent =
                  'Copiada a imagem de ' +
                  one.cap +
                  '. Cole no WhatsApp Web (Ctrl+V).' +
                  (sel.length > 1 ? ' Para as outras, selecione uma por vez.' : '');
              },
              function () {
                m.textContent = 'Não consegui copiar aqui. Use o celular ou salve as imagens.';
              }
            );
        }
        m.textContent = 'Este navegador não copia imagens. Use o celular para enviar.';
      })
      .catch(function () {
        m.textContent = 'Não consegui preparar as imagens.';
      });
  };

  /* variações C1..Cn: se o leitor achar uma maior que as existentes (ex.: C8), cria automaticamente */
  function ensureVar(v) {
    var n = parseInt(String(v || '').replace(/\D/g, ''), 10);
    if (n > (S.maxVar || 6)) {
      S.maxVar = n;
      try {
        var d0 = JSON.parse(localStorage.getItem(SK) || '{}');
        d0.maxVar = n;
        localStorage.setItem(SK, JSON.stringify(d0));
      } catch (e) {}
    }
  }
  // Botões de variação de cor.
  function varChips(cur) {
    ensureVar(cur);
    var a = [],
      m = Math.max(6, S.maxVar || 6, parseInt(String(cur || '').replace(/\D/g, ''), 10) || 0),
      k;
    for (k = 1; k <= m; k++) a.push('C' + k);
    return a;
  }
  // Variações disponíveis.
  function varList() {
    var m = S.maxVar || 6;
    S.items.forEach(function (i) {
      var n = parseInt(String(i.vr || '').replace(/\D/g, ''), 10);
      if (n > m) m = n;
    });
    S.maxVar = m;
    var a = [];
    for (var k = 1; k <= m; k++) a.push('C' + k);
    return a;
  }
  // Adiciona os botões de variação a um contêiner.
  function addVarChips(host, cur, pick) {
    varList().forEach(function (v) {
      host.appendChild(
        btn(
          'chip' + (v === cur ? ' on' : ''),
          v,
          function () {
            pick(v);
          },
          v === cur
        )
      );
    });
    host.appendChild(
      btn('chip add', '+', function () {
        S.maxVar = varList().length + 1;
        try {
          var d0 = JSON.parse(localStorage.getItem(SK) || '{}');
          d0.maxVar = S.maxVar;
          localStorage.setItem(SK, JSON.stringify(d0));
        } catch (e) {}
        pick('C' + S.maxVar);
      })
    );
  }
  // Caixa para criar novo formato/cor.
  function newBox(host, flag, withColor, ph, done) {
    if (S.nf !== flag && S.nc !== flag) {
      host.textContent = '';
      return;
    }
    if (host.firstChild) return;
    var r = mk('div', 'newrow'),
      i = mk('input', 'in');
    i.placeholder = ph;
    i.setAttribute('aria-label', ph);
    r.appendChild(i);
    var c = null;
    if (withColor) {
      c = document.createElement('input');
      c.type = 'color';
      c.value = '#8b9bb0';
      c.setAttribute('aria-label', 'Cor da amostra');
      r.appendChild(c);
    }
    var go = function () {
      var raw = i.value.trim();
      if (!raw) return;
      done(raw[0].toUpperCase() + raw.slice(1), c && c.value);
    };
    r.appendChild(btn('mini', 'Adicionar', go));
    r.appendChild(
      btn('mini', 'Cancelar', function () {
        S.nf = '';
        S.nc = '';
        render();
      })
    );
    i.onkeydown = function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        go();
      }
    };
    host.appendChild(r);
    try {
      i.focus();
    } catch (e) {}
  }
  // Salva um formato novo.
  function fmtDone(setter) {
    return function (n) {
      var ex = S.formats.filter(function (f) {
        return f.toLowerCase() === n.toLowerCase();
      })[0];
      if (!ex) S.formats.push(n);
      setter(ex || n);
      S.nf = '';
      render();
    };
  }
  // Salva uma cor nova.
  function corDone(setter) {
    return function (n, hex) {
      var ex = Object.keys(S.palette).filter(function (k) {
        return k.toLowerCase() === n.toLowerCase();
      })[0];
      if (!ex) S.palette[n] = hex || '#8b9bb0';
      setter(ex || n);
      S.nc = '';
      render();
    };
  }
  // Caixa para criar um tipo.
  function mkTipoBox(host) {
    if (!S.nt) {
      host.textContent = '';
      return;
    }
    if (host.firstChild) return;
    var r = mk('div', 'newrow'),
      n = mk('input', 'in');
    n.placeholder = 'Nome do tipo (ex.: Estojos)';
    n.setAttribute('aria-label', 'Nome do tipo');
    var h = mk('div', 'hint');
    h.style.cssText = 'flex:1 1 100%;margin:0;color:var(--bad)';
    var go = function () {
      var nm = n.value.trim().replace(/\s+/g, ' '),
        cu = 0;
      if (!nm) {
        h.textContent = 'Digite o nome do tipo.';
        return;
      }
      if (
        TIPOS.some(function (x) {
          return x.label.toLowerCase() === nm.toLowerCase();
        })
      ) {
        h.textContent = 'Já existe um tipo com esse nome.';
        return;
      }
      if (!(cu >= 0)) {
        h.textContent = 'Custo inválido. Use um número em US$ ou deixe vazio.';
        return;
      }
      var id = 'x' + Date.now().toString(36);
      nm = nm[0].toUpperCase() + nm.slice(1);
      S.tiposX.push({
        id: id,
        label: nm,
        full: nm,
        price: 0,
        repUSD: cu,
        pago: cu,
        x: true,
        simple: true
      });
      syncTipos();
      S.nt = false;
      S.todos = false;
      S.lotesView = false;
      S.tipo = id;
      S.fmtF = 'all';
      S.corF = 'all';
      S.q = '';
      S.open = '';
      S.det = false;
      S.selItem = null;
      S.msg =
        'Tipo "' +
        nm +
        '" criado. O preço você define em cada venda. Agora cadastre os itens abaixo.';
      render();
    };
    r.appendChild(n);
    r.appendChild(btn('mini', 'Criar tipo', go));
    r.appendChild(
      btn('mini', 'Cancelar', function () {
        S.nt = false;
        render();
      })
    );
    r.appendChild(h);
    n.onkeydown = function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        go();
      }
    };
    host.appendChild(r);
    try {
      n.focus();
    } catch (e) {}
  }

  // Tipo com o custo efetivo da peça.
  function tFor(it) {
    var t = tipoOf(it.tipo),
      cu = effCusto(it),
      f = faixaOf(it.ref),
      pr = f && f.precos && f.precos[it.tipo],
      o = {};
    if (cu != null) {
      o.repUSD = cu;
      o.pago = cu;
    }
    if (pr > 0) o.price = pr;
    return Object.keys(o).length ? Object.assign({}, t, o) : t;
  }
  // Lê um valor digitado conforme a moeda.
  function pm(x, m) {
    var t = String(x == null ? '' : x)
      .trim()
      .replace(/\s/g, '');
    if (m === 'pyg') t = t.replace(/\./g, '').replace(',', '.');
    else {
      if (t.indexOf(',') >= 0 && t.indexOf('.') >= 0) t = t.replace(/\./g, '');
      t = t.replace(',', '.');
    }
    return parseFloat(t);
  }
  // Converte um valor para US$.
  function convUsd(c, m) {
    return (c * ratePyg(m)) / S.fx.pyg;
  }
  // Cria o tipo se ainda não existir.
  function ensureTipo(nm) {
    nm = String(nm || '')
      .trim()
      .replace(/\s+/g, ' ');
    if (!nm) return '';
    var f = TIPOS.filter(function (x) {
      return nrm(x.label) === nrm(nm);
    })[0];
    if (f) return f.id;
    var id = 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    nm = nm[0].toUpperCase() + nm.slice(1);
    S.tiposX.push({
      id: id,
      label: nm,
      full: nm,
      price: 0,
      repUSD: 0,
      pago: 0,
      x: true,
      simple: true
    });
    syncTipos();
    return id;
  }
  // Interface para criar novo tipo.
  function newTipoUI(st, rer, pick, nav, host) {
    if (!st.nt) {
      nav.appendChild(
        btn('chip add', '+ Novo tipo', function () {
          st.nt = true;
          st.ntv = '';
          rer();
        })
      );
      return;
    }
    var r = mk('div', 'newrow'),
      n = mk('input', 'in');
    n.placeholder = 'Nome do tipo (ex.: Estojos, Flanelas)';
    n.setAttribute('aria-label', 'Nome do novo tipo');
    n.value = st.ntv || '';
    n.oninput = function () {
      st.ntv = n.value;
    };
    var go = function () {
      var nm = String(n.value).trim();
      if (!nm) return popErr('Digite o nome do tipo.');
      var id = ensureTipo(nm);
      st.nt = false;
      st.ntv = '';
      pick(id);
      rer();
    };
    n.onkeydown = function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        go();
      }
    };
    r.appendChild(n);
    r.appendChild(btn('mini', 'Criar tipo', go));
    r.appendChild(
      btn('mini', 'Cancelar', function () {
        st.nt = false;
        rer();
      })
    );
    host.appendChild(r);
    try {
      setTimeout(function () {
        n.focus();
      }, 0);
    } catch (e) {}
  }
  function quickCor(n) {
    return ['azul petroleo', 'vinho', 'bege translucido'].indexOf(nrm(n)) < 0;
  }
  // A peça passa no filtro de formato?
  function fOk(i) {
    return S.fmtF === 'all' || String(S.fmtF).split('|').indexOf(i.fmt) >= 0;
  }
  // Formatos selecionados.
  function fSel() {
    return S.fmtF === 'all' ? [] : String(S.fmtF).split('|');
  }
  // Tipos selecionados.
  function tSel() {
    return S.todos ? S.selSet || [] : S.lotesView ? [] : [S.tipo];
  }
  // Id do tipo Variados.
  function varId() {
    var t = TIPOS.filter(function (x) {
      return nrm(x.label) === 'variados';
    })[0];
    return t ? t.id : '';
  }
  // ===== Lotes de compra: grupos, custos e seleção de lote. =====
  // É o tipo Variados?
  function MIX(t) {
    return t === 'mix' || (!!t && t === varId());
  }
  // Tipos disponíveis para lotes.
  function LTIPOS() {
    return varId()
      ? TIPOS.slice()
      : TIPOS.concat([{ id: 'mix', label: 'Variados', full: 'Variados' }]);
  }
  // Nome do tipo de um lote.
  function gTipoName(g) {
    var tp = tipoOf(g.tipo);
    return tp ? tp.full : MIX(g.tipo) ? 'Variados' : g.tipo;
  }
  // Custo total do lote.
  function gTot(g) {
    return g.totalUsd != null ? g.totalUsd : (g.usd || 0) * g.qty;
  }
  // Peças e custo já detalhados do lote.
  function gOwn(g) {
    var q = g.ownQ || 0,
      c = g.ownC || 0;
    S.items.forEach(function (i) {
      if (i.lote === g.id && !i.bulk && i.custo != null) {
        q += i.qty;
        c += i.qty * i.custo;
      }
    });
    return { q: q, c: c };
  }
  // Seletor numérico com + e −.
  function qStep(obj, key, lbl, min, ph) {
    var d = mk('div', '');
    d.appendChild(mk('div', 'lbl', lbl));
    var r = mk('div', 'sel');
    var i = mk('input', 'in');
    i.inputMode = 'numeric';
    i.placeholder = ph || '';
    i.value = obj[key] || '';
    i.setAttribute('aria-label', lbl);
    i.style.cssText = 'text-align:center;min-width:0';
    i.oninput = function () {
      obj[key] = i.value;
    };
    var st = function (dl) {
      var n = parseInt(String(i.value).replace(/\D/g, ''), 10) || 0;
      n = Math.max(min, n + dl);
      i.value = String(n);
      obj[key] = String(n);
      i.dispatchEvent(new Event('input', { bubbles: true }));
    };
    var m = btn('step', '−', function () {
      st(-1);
    });
    m.setAttribute('aria-label', 'Diminuir ' + lbl);
    var pl = btn('step', '+', function () {
      st(1);
    });
    pl.setAttribute('aria-label', 'Aumentar ' + lbl);
    r.appendChild(m);
    r.appendChild(i);
    r.appendChild(pl);
    d.appendChild(r);
    return d;
  }
  // Mostra um erro em aviso flutuante.
  function popErr(t) {
    try {
      var e = $('popErr');
      if (!e) {
        e = document.createElement('div');
        e.id = 'popErr';
        e.setAttribute('role', 'alert');
        e.style.cssText =
          'position:fixed;left:50%;top:max(16px,env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:200;width:min(92vw,520px);background:var(--badbg);color:var(--bad);border:1px solid var(--bad);border-radius:12px;padding:14px 44px 14px 14px;font-size:14px;line-height:1.4;box-shadow:0 8px 28px rgba(0,0,0,.6)';
        var x = document.createElement('button');
        x.type = 'button';
        x.textContent = '×';
        x.setAttribute('aria-label', 'Fechar aviso');
        x.style.cssText =
          'position:absolute;right:8px;top:6px;width:32px;height:32px;border:0;background:transparent;font-size:22px;color:inherit';
        x.onclick = function () {
          e.hidden = true;
        };
        var sp = document.createElement('span');
        sp.id = 'popErrT';
        e.appendChild(sp);
        e.appendChild(x);
        document.body.appendChild(e);
      }
      $('popErrT').textContent = t;
      e.hidden = false;
      clearTimeout(popErr.t);
      popErr.t = setTimeout(function () {
        e.hidden = true;
      }, 7000);
    } catch (x) {}
  }
  // Valida o custo informado contra o total do lote.
  function gCostErr(g, add, skip, per, qty) {
    if (!g || !(add > 0)) return '';
    var c = gOwn(g).c;
    if (per != null && qty >= grpFalta(g) && grpFalta(g) > 0) {
      var mu = gUnit(g);
      if (per + 0.005 < mu)
        return (
          'Você está detalhando todas as ' +
          grpFalta(g) +
          ' peças que faltam neste lote, e a média do que falta completar é ' +
          usd(mu) +
          ' por peça. Um custo de ' +
          usd(per) +
          ' deixaria parte do valor do lote sem destino. Use ' +
          usd(mu) +
          ' ou mais, ou deixe vazio para usar a média.'
        );
    }
    if (skip && skip.custo != null && skip.lote === g.id && !skip.bulk) c -= skip.qty * skip.custo;
    if (c + add > gTot(g) + (per != null && qty >= grpFalta(g) ? 0.005 * qty : 0.00001))
      return (
        'O custo desta peça passa do total do lote (' +
        usd(gTot(g)) +
        '): ' +
        usd(c) +
        ' já estão em peças com custo próprio e sobram ' +
        usd(Math.max(0, gTot(g) - c)) +
        '. Informe um custo menor ou deixe vazio para usar a média.'
      );
    return '';
  }
  // Custo unitário do lote.
  function gUnit(g) {
    if (!(g.qty > 0)) return 0;
    var o = gOwn(g),
      n = g.qty - o.q;
    if (n <= 0) return gTot(g) / g.qty;
    return Math.max(0, (gTot(g) - o.c) / n);
  }
  // Texto do valor pago do lote.
  function gPaid(g) {
    return (
      'Custo total ' +
      usd(gTot(g)) +
      ' · média ' +
      usd(gUnit(g)) +
      ' por peça' +
      (gOwn(g).q ? ' (já descontadas as peças com custo próprio)' : '') +
      (g.moeda && g.moeda !== 'usd'
        ? ' (' + fmtM(g.custoOrig, g.moeda) + ', câmbio do dia G$ ' + dots(g.rate || S.fx.pyg) + ')'
        : '')
    );
  }
  // Custo efetivo da peça (próprio ou do lote).
  function effCusto(i) {
    if (i.custo != null) return i.custo;
    var g =
      i.lote &&
      S.grp.filter(function (x) {
        return x.id === i.lote;
      })[0];
    return g ? gUnit(g) : null;
  }
  // Peças já detalhadas do lote.
  function grpDet(g) {
    return sum(
      S.items.filter(function (i) {
        return i.lote === g.id && !i.bulk;
      })
    );
  }
  // Sincroniza as peças a granel com os lotes.
  function syncBulk() {
    var ids = {};
    var vid = varId();
    if (vid)
      S.grp.forEach(function (g) {
        if (g.tipo === 'mix') g.tipo = vid;
      });
    S.grp.forEach(function (g) {
      ids[g.id] = 1;
    });
    if (
      S.items.some(function (i) {
        return i.bulk && !ids[i.lote];
      })
    )
      S.items = S.items.filter(function (i) {
        return !i.bulk || ids[i.lote];
      });
    var seen = {};
    S.grp.forEach(function (g) {
      var b = S.items.filter(function (i) {
          return i.bulk && i.lote === g.id;
        })[0],
        n = g.tipo !== 'mix' && tipoOf(g.tipo) ? grpFalta(g) : 0;
      if (!n) {
        if (b)
          S.items = S.items.filter(function (i) {
            return i !== b;
          });
        return;
      }
      var k = g.forn + '|' + g.tipo;
      seen[k] = (seen[k] || 0) + 1;
      var nm = 'Lote ' + g.forn + (seen[k] > 1 ? ' ' + seen[k] : '');
      if (!b) {
        b = {
          bulk: true,
          lote: g.id,
          tipo: g.tipo,
          grau: '',
          ref: nm,
          med: '',
          vr: '',
          fmt: 'Sem detalhe',
          cor: 'Sem detalhe',
          qty: n
        };
        S.items.push(b);
      } else {
        b.qty = n;
        b.tipo = g.tipo;
        b.ref = nm;
      }
    });
  }
  // Peças restantes do lote (total − vendidas).
  function grpTot(g) {
    return Math.max(0, g.qty - (g.sold || 0));
  }
  // Peças do lote ainda sem detalhar.
  function grpFalta(g) {
    return Math.max(0, grpTot(g) - grpDet(g));
  }
  // Lotes abertos de um tipo.
  function openGrp(tipo) {
    var a = S.grp.filter(function (g) {
      return grpFalta(g) > 0;
    });
    return a
      .filter(function (g) {
        return g.tipo === tipo || MIX(g.tipo);
      })
      .concat(
        a.filter(function (g) {
          return !(g.tipo === tipo || MIX(g.tipo));
        })
      );
  }
  // Rótulo do lote (fornecedor · custo).
  function gLabel(g) {
    return g.forn + ' · ' + usd(gUnit(g));
  }
  // Lote escolhido na seleção.
  function pickG(tipo, sel) {
    var ops = openGrp(tipo);
    if (!ops.length || !sel || sel === 'none') return { g: null };
    var g = ops.filter(function (x) {
      return x.id === sel;
    })[0];
    return { g: g || null };
  }
  // Aviso quando a quantidade excede o lote.
  function gCap(g, qty) {
    return g && qty > grpFalta(g)
      ? 'O lote "' + gLabel(g) + '" só tem ' + grpFalta(g) + ' peça(s) para detalhar.'
      : '';
  }
  // Botões para escolher o lote.
  function loteChips(id, tipo, sel, setSel) {
    var bx = $(id + 'B'),
      ops = openGrp(tipo);
    if (!ops.length) {
      bx.hidden = true;
      return;
    }
    bx.hidden = false;
    var h = $(id);
    h.textContent = '';
    var cur = pickG(tipo, sel);
    h.appendChild(
      btn(
        'chip' + (!cur.g ? ' on' : ''),
        'Sem lote',
        function () {
          setSel('none');
          render();
        },
        !cur.g
      )
    );
    ops.forEach(function (g) {
      var on = !!(cur.g && cur.g.id === g.id);
      h.appendChild(
        btn(
          'chip' + (on ? ' on' : ''),
          gLabel(g) +
            (g.tipo === tipo || MIX(g.tipo) ? '' : ' · ' + ((tipoOf(g.tipo) || {}).label || '')) +
            ' · faltam ' +
            grpFalta(g),
          function () {
            setSel(g.id);
            render();
          },
          on
        )
      );
    });
  }
  // ===== Aba Lotes: lista, detalhe, formulário e leitura da nota. =====
  // Cartão de um lote (resumo e ações).
  function lotCard(g, opt) {
    var f = grpFalta(g),
      tot = grpTot(g),
      det = grpDet(g),
      tp = tipoOf(g.tipo),
      c = mk('section', 'card');
    c.style.borderLeft = '4px solid #00c8ff';
    var a = mk('div', '');
    a.style.cssText = 'display:flex;justify-content:space-between;align-items:flex-start;gap:10px';
    var ta = mk('div', '');
    ta.appendChild(mk('b', '', g.forn + ' · ' + gTipoName(g) + ' · ' + g.qty + ' peças'));
    var pg = mk('div', 'hint', gPaid(g));
    pg.style.margin = '2px 0 0';
    ta.appendChild(pg);
    a.appendChild(ta);
    var ac = mk('div', '');
    ac.style.cssText = 'display:flex;align-items:center;gap:8px;flex:0 0 auto';
    var eg = btn(
      'tab' + (S.gEdit === g.id ? ' on' : ''),
      'Editar',
      function () {
        if (S.gEdit === g.id) {
          S.gEdit = '';
        } else {
          S.gEdit = g.id;
          S.gDist = '';
          S.gAdd = null;
          S.gDel = '';
          S.ge = {
            forn: g.forn,
            tipo: g.tipo,
            qty: String(g.qty),
            moeda: g.moeda || 'usd',
            usd: String(g.custoOrig != null ? g.custoOrig : gTot(g)).replace('.', ',')
          };
        }
        render();
      },
      S.gEdit === g.id
    );
    eg.style.cssText = 'min-height:34px;height:34px;padding:0 14px;font-size:14px';
    ac.appendChild(eg);
    var tr = mk('button', 'trash' + (S.gDel === g.id ? ' on' : ''));
    tr.type = 'button';
    tr.title = 'Remover lote';
    tr.setAttribute('aria-label', 'Remover lote');
    tr.setAttribute('aria-pressed', S.gDel === g.id);
    tr.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/><path d="M10 11v6M14 11v6"/></svg>';
    tr.onclick = function () {
      S.gDel = S.gDel === g.id ? '' : g.id;
      S.gEdit = '';
      render();
    };
    ac.appendChild(tr);
    a.appendChild(ac);
    c.appendChild(a);
    if (S.gEdit === g.id) {
      var E = S.ge,
        eb = mk('div', 'col');
      eb.style.cssText = 'gap:14px';
      var fin = function (lbl, key, mode) {
        var d = mk('div', '');
        d.appendChild(mk('div', 'lbl', lbl));
        var i = mk('input', 'in');
        i.value = E[key];
        if (mode) i.inputMode = mode;
        i.setAttribute('aria-label', lbl);
        i.oninput = function () {
          E[key] = i.value;
        };
        d.appendChild(i);
        return d;
      };
      eb.appendChild(fin('Fornecedor', 'forn'));
      var det0 = grpDet(g);
      var td = mk('div', '');
      td.appendChild(mk('div', 'lbl', 'Tipo de produto do lote'));
      var tn = mk('div', 'nav');
      var canT = function (x) {
        return !det0 || (MIX(x.id) && !MIX(g.tipo));
      };
      LTIPOS().forEach(function (x) {
        var b = btn(
          'chip' + (x.id === E.tipo ? ' on' : ''),
          x.label,
          function () {
            if (!canT(x)) return;
            E.tipo = x.id;
            render();
          },
          x.id === E.tipo
        );
        if (!canT(x) && x.id !== E.tipo) b.disabled = true;
        tn.appendChild(b);
      });
      td.appendChild(tn);
      if (det0)
        td.appendChild(
          mk(
            'div',
            'hint',
            'Já há peças detalhadas neste lote: o tipo só pode ser ampliado para Variados.'
          )
        );
      eb.appendChild(td);
      var mdv = mk('div', '');
      mdv.appendChild(mk('div', 'lbl', 'Moeda da compra'));
      var mnv = mk('div', 'nav');
      [
        ['usd', 'US$'],
        ['pyg', 'G$'],
        ['brl', 'R$']
      ].forEach(function (x) {
        mnv.appendChild(
          btn(
            'chip' + (E.moeda === x[0] ? ' on' : ''),
            x[1],
            function () {
              E.moeda = x[0];
              render();
            },
            E.moeda === x[0]
          )
        );
      });
      mdv.appendChild(mnv);
      if (
        E.moeda !== (g.moeda || 'usd') ||
        String(E.usd).replace('.', ',') !==
          String(g.custoOrig != null ? g.custoOrig : gTot(g)).replace('.', ',')
      )
        mdv.appendChild(
          mk(
            'div',
            'hint',
            'O custo será convertido para dólar pela cotação de hoje (US$ 1 = G$ ' +
              dots(S.fx.pyg) +
              ').'
          )
        );
      eb.appendChild(mdv);
      var two = mk('div', 'erow2');
      two.appendChild(qStep(E, 'qty', 'Quantidade de peças', Math.max(1, det0 + (g.sold || 0))));
      two.appendChild(
        fin(
          'Custo total do lote (' + { usd: 'US$', pyg: 'G$', brl: 'R$' }[E.moeda] + ')',
          'usd',
          'decimal'
        )
      );
      eb.appendChild(two);
      var min = det0 + (g.sold || 0);
      eb.appendChild(
        mk(
          'div',
          'hint',
          'A quantidade não pode ser menor que ' +
            min +
            ' (' +
            det0 +
            ' detalhadas' +
            (g.sold || 0 ? ' + ' + g.sold + ' vendidas' : '') +
            ').'
        )
      );
      var gx = mk('div', 'col');
      gx.style.cssText = 'gap:12px;padding:12px;border:1px dashed var(--line);border-radius:12px';
      if (!S.gAdd) {
        gx.appendChild(
          btn('chip add', '+ Adicionar outro tipo a esta compra', function () {
            S.gAdd = {
              tipo: MIX(g.tipo)
                ? S.tipo
                : (
                    TIPOS.filter(function (x) {
                      return x.id !== g.tipo;
                    })[0] || { id: S.tipo }
                  ).id,
              qty: '',
              usd: ''
            };
            render();
          })
        );
      } else {
        var X = S.gAdd,
          sy2 = { usd: 'US$', pyg: 'G$', brl: 'R$' }[g.moeda || 'usd'];
        gx.appendChild(mk('b', '', 'Outro tipo nesta compra (' + g.forn + ')'));
        var gt = mk('div', '');
        gt.appendChild(mk('div', 'lbl', 'Tipo de produto'));
        var gn = mk('div', 'nav');
        LTIPOS().forEach(function (x) {
          gn.appendChild(
            btn(
              'chip' + (x.id === X.tipo ? ' on' : ''),
              x.label,
              function () {
                X.tipo = x.id;
                render();
              },
              x.id === X.tipo
            )
          );
        });
        gt.appendChild(gn);
        gx.appendChild(gt);
        var g2 = mk('div', 'erow2');
        [
          ['Quantidade de peças', 'qty', 'numeric'],
          ['Custo total (' + sy2 + ')', 'usd', 'decimal']
        ].forEach(function (f) {
          var d = mk('div', '');
          d.appendChild(mk('div', 'lbl', f[0]));
          var i = mk('input', 'in');
          i.value = X[f[1]];
          i.inputMode = f[2];
          i.setAttribute('aria-label', f[0]);
          i.oninput = function () {
            X[f[1]] = i.value;
          };
          d.appendChild(i);
          g2.appendChild(d);
        });
        gx.appendChild(g2);
        var ge2 = mk('div', 'note n-bad');
        ge2.hidden = true;
        gx.appendChild(ge2);
        var gr2 = mk('div', '');
        gr2.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap';
        var gok = btn('go', 'Criar este lote', function () {
          var q = parseInt(String(X.qty).replace(/\D/g, ''), 10),
            u = pm(X.usd, g.moeda || 'usd');
          if (!(q > 0)) {
            ge2.hidden = false;
            ge2.textContent = 'Informe a quantidade de peças.';
            return;
          }
          if (!(u > 0) || String(X.usd).trim() === '') {
            ge2.hidden = false;
            ge2.textContent = 'Informe o custo total em ' + sy2 + '.';
            return;
          }
          var tu = Math.round(convUsd(u, g.moeda || 'usd') * 10000) / 10000;
          lotCharge(
            S.grp[
              S.grp.push({
                id: 'G' + Date.now().toString(36) + 'x',
                forn: g.forn,
                tipo: X.tipo === 'mix' ? ensureTipo('Variados') : X.tipo,
                qty: q,
                usd: tu / q,
                totalUsd: tu,
                moeda: g.moeda || 'usd',
                custoOrig: u,
                rate: Math.round(S.fx.pyg),
                sold: 0,
                ts: Date.now()
              }) - 1
            ]
          );
          S.gAdd = null;
          S.gEdit = '';
          S.msg = 'Novo lote criado: ' + q + ' peças de ' + g.forn + '.';
          render();
        });
        gok.style.cssText =
          'width:auto;margin:0;padding:0 18px;min-height:40px;height:40px;font-size:14px';
        gr2.appendChild(gok);
        gr2.appendChild(
          btn('mini', 'Cancelar', function () {
            S.gAdd = null;
            render();
          })
        );
        gx.appendChild(gr2);
      }
      eb.appendChild(gx);
      var er = mk('div', 'note n-bad');
      er.hidden = true;
      eb.appendChild(er);
      var rw = mk('div', '');
      rw.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap';
      var sv = btn('go', 'Salvar lote', function () {
        var q = parseInt(String(E.qty).replace(/\D/g, ''), 10),
          u = pm(E.usd, E.moeda),
          fo = String(E.forn || '')
            .trim()
            .replace(/\s+/g, ' '),
          bd = function (t) {
            popErr(t);
          };
        if (!fo) return bd('Digite o nome do fornecedor.');
        if (!(q > 0)) return bd('Informe a quantidade de peças.');
        if (q < min) return bd('A quantidade não pode ser menor que ' + min + '.');
        if (!(u > 0) || String(E.usd).trim() === '')
          return bd(
            'Informe o custo total do lote em ' +
              { usd: 'US$', pyg: 'G$', brl: 'R$' }[E.moeda] +
              '.'
          );
        var oldO = g.custoOrig != null ? g.custoOrig : gTot(g),
          oldM = g.moeda || 'usd',
          tot0 = gTot(g);
        if (!(E.moeda === oldM && u === oldO)) {
          tot0 = Math.round(convUsd(u, E.moeda) * 10000) / 10000;
          var oc0 = gOwn(g).c;
          if (tot0 + 0.00001 < oc0)
            return bd(
              'O total do lote não pode ficar abaixo de ' +
                usd(oc0) +
                ', que já estão em peças com custo próprio.'
            );
          g.moeda = E.moeda;
          g.custoOrig = u;
          g.rate = Math.round(S.fx.pyg);
        }
        g.forn = fo[0].toUpperCase() + fo.slice(1);
        g.qty = q;
        g.totalUsd = tot0;
        g.usd = tot0 / q;
        lotAdjust(g, oldM, oldO);
        if (canT({ id: E.tipo })) g.tipo = E.tipo === 'mix' ? ensureTipo('Variados') : E.tipo;
        S.gEdit = '';
        S.msg = 'Lote atualizado: ' + g.qty + ' peças de ' + gLabel(g) + '.';
        render();
      });
      sv.style.cssText =
        'width:auto;margin:0;padding:0 18px;min-height:40px;height:40px;font-size:14px';
      rw.appendChild(sv);
      rw.appendChild(
        btn('mini', 'Cancelar', function () {
          S.gEdit = '';
          render();
        })
      );
      eb.appendChild(rw);
      var mbx = $('lotModalBox');
      mbx.textContent = '';
      var mh = mk('div', 'mhead');
      var mt = mk('h2', '', 'Editar lote');
      mt.style.cssText = 'margin:0;font-size:18px';
      mh.appendChild(mt);
      mh.appendChild(
        btn('tab', 'Fechar', function () {
          S.gEdit = '';
          render();
        })
      );
      mbx.appendChild(mh);
      var sm = mk('div', 'hint', gLabel(g) + ' · ' + gTipoName(g));
      sm.style.margin = '0';
      mbx.appendChild(sm);
      mbx.appendChild(eb);
      $('lotModal').hidden = false;
    }

    if (MIX(g.tipo) && f > 0) {
      var db2 = btn('mini', 'Distribuir por tipo', function () {
        S.gDist = g.id;
        S.gEdit = '';
        S.gDel = '';
        var ft = TIPOS.filter(function (x) {
          return !MIX(x.id);
        })[0];
        S.dist = { rows: [{ tipo: ft ? ft.id : '', qty: '' }] };
        render();
      });
      db2.style.cssText =
        'margin-top:10px;align-self:flex-start;min-height:34px;height:34px;padding:0 12px;font-size:13px;background:var(--panel2);border:1px solid var(--line);color:var(--sub)';
      c.appendChild(db2);
    }
    if (S.gDist === g.id && S.dist) {
      var D = S.dist,
        db = mk('div', 'col');
      db.style.cssText = 'gap:14px';
      var fal = grpFalta(g),
        totD = function () {
          return D.rows.reduce(function (a, r) {
            return a + (parseInt(String(r.qty).replace(/\D/g, ''), 10) || 0);
          }, 0);
        };
      db.appendChild(
        mk(
          'div',
          'hint',
          'Este lote é Variados. Diga quantas peças são de cada tipo: elas saem do Variados e entram no estoque do tipo escolhido, com o mesmo custo médio (' +
            usd(gUnit(g)) +
            ' por peça). O que não for distribuído continua como Variados.'
        )
      );
      D.rows.forEach(function (r, ix) {
        var card = mk('div', 'col');
        card.style.cssText =
          'gap:12px;padding:12px;border:1px solid var(--line);border-radius:12px';
        var hd = mk('div', '');
        hd.style.cssText = 'display:flex;justify-content:space-between;align-items:center';
        hd.appendChild(mk('b', '', D.rows.length > 1 ? 'Tipo ' + (ix + 1) : 'Tipo'));
        if (D.rows.length > 1) {
          var tr3 = mk('button', 'trash');
          tr3.type = 'button';
          tr3.title = 'Remover esta linha';
          tr3.setAttribute('aria-label', 'Remover a linha ' + (ix + 1));
          tr3.innerHTML =
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/><path d="M10 11v6M14 11v6"/></svg>';
          tr3.onclick = function () {
            D.rows.splice(ix, 1);
            render();
          };
          hd.appendChild(tr3);
        }
        card.appendChild(hd);
        var tn3 = mk('div', 'nav');
        TIPOS.filter(function (x) {
          return !MIX(x.id);
        }).forEach(function (x) {
          tn3.appendChild(
            btn(
              'chip' + (x.id === r.tipo ? ' on' : ''),
              x.label,
              function () {
                r.tipo = x.id;
                render();
              },
              x.id === r.tipo
            )
          );
        });
        card.appendChild(tn3);
        newTipoUI(
          r,
          render,
          function (id) {
            r.tipo = id;
          },
          tn3,
          card
        );
        card.appendChild(qStep(r, 'qty', 'Quantidade de peças', 1, 'Ex.: 50'));
        db.appendChild(card);
      });
      db.appendChild(
        btn('chip add', '+ Adicionar outro tipo', function () {
          var u = TIPOS.filter(function (x) {
            return (
              !MIX(x.id) &&
              !D.rows.some(function (r) {
                return r.tipo === x.id;
              })
            );
          })[0];
          D.rows.push({ tipo: u ? u.id : '', qty: '' });
          render();
        })
      );
      var sm3 = mk('div', 'hint', ''),
        upd3 = function () {
          var t = totD();
          sm3.textContent =
            'Distribuídas ' +
            t +
            ' de ' +
            fal +
            ' · sobram ' +
            Math.max(0, fal - t) +
            ' como Variados.';
          sm3.style.color = t > fal ? 'var(--bad)' : 'var(--mute)';
        };
      upd3();
      db.appendChild(sm3);
      db.addEventListener('input', upd3);
      var rw3 = mk('div', '');
      rw3.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap';
      var ok3 = btn('go', 'Distribuir', function () {
        var rows = D.rows
          .map(function (r) {
            return { tipo: r.tipo, q: parseInt(String(r.qty).replace(/\D/g, ''), 10) || 0 };
          })
          .filter(function (r) {
            return r.q > 0;
          });
        if (!rows.length) return popErr('Informe a quantidade de pelo menos um tipo.');
        if (
          rows.some(function (r) {
            return !r.tipo;
          })
        )
          return popErr('Escolha o tipo de cada linha.');
        var n = rows.reduce(function (a, r) {
          return a + r.q;
        }, 0);
        if (n > grpFalta(g))
          return popErr(
            'O lote "' +
              gLabel(g) +
              '" só tem ' +
              grpFalta(g) +
              ' peça(s) sem detalhar para distribuir. Você informou ' +
              n +
              '.'
          );
        var avg = gUnit(g),
          T0 = gTot(g),
          oriO = g.custoOrig != null ? g.custoOrig : T0,
          k = 0;
        rows.forEach(function (r) {
          var sh = avg * r.q;
          S.grp.push({
            id: 'G' + Date.now().toString(36) + k++ + 'd',
            forn: g.forn,
            tipo: r.tipo,
            qty: r.q,
            usd: avg,
            totalUsd: sh,
            moeda: g.moeda || 'usd',
            custoOrig: T0 > 0 ? (oriO * sh) / T0 : 0,
            rate: g.rate,
            sold: 0,
            ts: Date.now() + k
          });
        });
        var T1 = Math.max(0, T0 - avg * n);
        g.qty -= n;
        g.totalUsd = T1;
        g.usd = g.qty > 0 ? T1 / g.qty : 0;
        g.custoOrig = T0 > 0 ? (oriO * T1) / T0 : 0;
        if (g.qty <= 0)
          S.grp = S.grp.filter(function (x) {
            return x !== g;
          });
        S.gDist = '';
        S.dist = null;
        S.msg =
          'Distribuídas ' +
          n +
          ' peças: ' +
          rows
            .map(function (r) {
              return r.q + ' ' + ((tipoOf(r.tipo) || {}).label || '');
            })
            .join(', ') +
          '.';
        render();
      });
      ok3.style.cssText =
        'width:auto;margin:0;padding:0 18px;min-height:40px;height:40px;font-size:14px';
      rw3.appendChild(ok3);
      rw3.appendChild(
        btn('mini', 'Cancelar', function () {
          S.gDist = '';
          S.dist = null;
          render();
        })
      );
      db.appendChild(rw3);
      var mb3 = $('lotModalBox');
      mb3.textContent = '';
      var mh3 = mk('div', 'mhead');
      var mt3 = mk('h2', '', 'Distribuir por tipo');
      mt3.style.cssText = 'margin:0;font-size:18px';
      mh3.appendChild(mt3);
      mh3.appendChild(
        btn('tab', 'Fechar', function () {
          S.gDist = '';
          S.dist = null;
          render();
        })
      );
      mb3.appendChild(mh3);
      var sh3 = mk('div', 'hint', gLabel(g) + ' · ' + fal + ' peças sem detalhar');
      sh3.style.margin = '0';
      mb3.appendChild(sh3);
      mb3.appendChild(db);
      $('lotModal').hidden = false;
    }
    var bar = mk('div', 'bar');
    bar.style.margin = '10px 0 8px';
    var bi = mk('i', '');
    bi.style.cssText =
      'background:#00c8ff;width:' + Math.min(100, tot ? (det / tot) * 100 : 0) + '%';
    bar.appendChild(bi);
    c.appendChild(bar);
    var r = mk('div', '');
    r.style.cssText =
      'display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:13px';
    r.appendChild(
      mk(
        'span',
        '',
        'Detalhado ' +
          det +
          ' de ' +
          tot +
          (g.sold || 0 ? ' (' + g.sold + ' já vendida' + (g.sold > 1 ? 's' : '') + ')' : '')
      )
    );
    var fl = mk('span', '', f > 0 ? 'Faltam detalhar ' + f : 'Completo');
    fl.style.color = f > 0 ? 'var(--warn)' : 'var(--ok)';
    r.appendChild(fl);
    c.appendChild(r);
    if (opt && opt.view) {
      var vb = btn('mini', 'Ver peças (' + det + ')', function () {
        S.lotSel = g.id;
        S.lotPick = {};
        render();
        window.scrollTo(0, 0);
      });
      var vr = mk('div', '');
      vr.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-top:10px';
      vr.appendChild(vb);
      if (f > 0)
        vr.appendChild(
          btn('mini', '+ Detalhar peças (' + f + ')', function () {
            S.fromLot = g.id;
            S.addOpen = true;
            S.addMode = 'prod';
            S.photoFor = null;
            S.msg = '';
            S.gSel = g.id;
            if (!MIX(g.tipo)) S.tipo = g.tipo;
            render();
          })
        );
      c.appendChild(vr);
    }
    if (S.gDel === g.id) {
      var z = mk('div', 'note n-bad');
      z.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:10px';
      z.appendChild(
        mk(
          'span',
          '',
          'Remover o lote "' +
            gLabel(g) +
            '"?' +
            (det
              ? ' As ' + det + ' peça(s) já detalhadas continuam no estoque, só ficam sem lote.'
              : ' Nenhuma peça foi detalhada ainda.') +
            (g.sold || 0 ? ' As vendas já feitas continuam no histórico.' : '')
        )
      );
      z.appendChild(
        btn('mini', 'Sim, remover', function () {
          lotRefund(g);
          S.items = S.items.filter(function (i) {
            return !(i.bulk && i.lote === g.id);
          });
          S.items.forEach(function (i) {
            if (i.lote === g.id) delete i.lote;
          });
          S.grp = S.grp.filter(function (x) {
            return x.id !== g.id;
          });
          S.gDel = '';
          S.gSel = '';
          S.lotSel = '';
          S.msg = 'Lote removido.';
          render();
        })
      );
      z.appendChild(
        btn('mini', 'Cancelar', function () {
          S.gDel = '';
          render();
        })
      );
      c.appendChild(z);
    }
    return c;
  }
  // Aba Lotes.
  function renderLotes() {
    var h = $('lotes');
    h.textContent = '';
    $('lotModal').hidden = true;
    if (S.lotesView) return;
    /* progresso dos lotes só aparece na aba Lotes */
  }

  // Preenche o modal de descrição das peças.
  function descModalFill() {
    var m = $('descModal');
    if (!S.descOpen) {
      m.hidden = true;
      return;
    }
    m.hidden = false;
    var box = $('descBox');
    box.textContent = '';
    var hd = mk('div', 'mhead');
    var h2 = mk('h2', '', 'Descrição das peças');
    h2.style.cssText = 'margin:0;font-size:18px';
    hd.appendChild(h2);
    hd.appendChild(
      btn('tab', 'Fechar', function () {
        S.descOpen = false;
        render();
      })
    );
    box.appendChild(hd);
    var picks = Object.keys(S.lotPick).filter(function (k) {
      return S.lotPick[k] && S.items[k];
    });
    if (!picks.length) {
      box.appendChild(mk('div', 'hint', 'Nenhuma peça selecionada.'));
      return;
    }
    picks.forEach(function (k) {
      var i = S.items[k],
        g = S.grp.filter(function (x) {
          return x.id === i.lote;
        })[0],
        tp = tipoOf(i.tipo),
        c = mk('div', 'col');
      c.style.cssText = 'gap:8px;padding:14px;border:1px solid var(--line);border-radius:12px';
      var ttl = mk(
        'b',
        '',
        i.ref +
          ' · ' +
          i.cor +
          (i.tipo === 'pre' ? ' · ' + i.grau : isSimple(i.tipo) ? '' : ' · ' + i.vr)
      );
      ttl.style.fontSize = '16px';
      c.appendChild(ttl);
      var dsc = S.desc[i.ref] != null ? S.desc[i.ref] : autoDesc(i.ref);
      var dt = mk('div', '', dsc || 'Sem descrição ainda.');
      dt.style.cssText = 'font-size:14px;line-height:1.45;' + (dsc ? '' : 'color:var(--mute)');
      c.appendChild(dt);
      var rows = [['Tipo', tp ? tp.full : i.tipo]];
      if (!isSimple(i.tipo)) {
        rows.push(['Formato', i.fmt || '—']);
        if (i.med) rows.push(['Medidas', i.med]);
        if (i.tipo === 'pre') rows.push(['Grau', i.grau]);
        else rows.push(['Variante', i.vr]);
      }
      rows.push(['Cor', i.cor]);
      rows.push(['Em estoque', i.qty + ' un.']);
      var cu = effCusto(i);
      rows.push([
        'Custo por peça',
        cu != null ? usd(cu) + (i.custo == null ? ' (média do lote)' : '') : 'sem custo detalhado'
      ]);
      if (g) rows.push(['Lote', gLabel(g)]);
      var tb = mk('div', '');
      tb.style.cssText = 'display:grid;grid-template-columns:auto 1fr;gap:4px 14px;font-size:13px';
      rows.forEach(function (r) {
        var a = mk('span', '', r[0]);
        a.style.color = 'var(--mute)';
        tb.appendChild(a);
        tb.appendChild(mk('span', '', r[1]));
      });
      c.appendChild(tb);
      box.appendChild(c);
    });
  }
  // Tela de lotes: lista, filtros e detalhe.
  function renderLotView() {
    var on = !!S.lotesView,
      h = $('lotView');
    $('listCard').hidden = on || !$('detail').hidden;
    h.hidden = !on;
    h.textContent = '';
    if (on) {
      $('detail').hidden = true;
      var g =
        S.lotSel &&
        S.grp.filter(function (x) {
          return x.id === S.lotSel;
        })[0];
      if (!g) {
        S.lotSel = '';
        var t = mk('div', '');
        t.appendChild(mk('h2', '', 'Lotes'));
        t.firstChild.style.cssText = 'margin:0;font-size:16px';
        var hh = mk(
          'div',
          'hint',
          'Todos os lotes que você adicionou. Toque em "Ver peças" para abrir um lote.'
        );
        hh.style.margin = '2px 0 0';
        t.appendChild(hh);
        h.appendChild(t);
        if (!S.grp.length) {
          var nl = mk(
            'div',
            'note n-info',
            'Nenhum lote ainda. Use "Adicionar" > "Lote" para registrar uma compra.'
          );
          h.appendChild(nl);
        }
        S.grp
          .slice()
          .sort(function (a, b) {
            return (b.ts || 0) - (a.ts || 0);
          })
          .forEach(function (x) {
            h.appendChild(lotCard(x, { view: true }));
          });
      } else {
        var bk = btn('tab', '‹ Todos os lotes', function () {
          S.lotSel = '';
          S.lotPick = {};
          S.pEdit = -1;
          S.pDel = -1;
          render();
        });
        bk.style.alignSelf = 'flex-start';
        h.appendChild(bk);
        h.appendChild(lotCard(g));
        var its = [];
        S.items.forEach(function (i, ix) {
          if (i.lote === g.id && !i.bulk) its.push([i, ix]);
        });
        its.sort(function (a, b) {
          return a[0].ref < b[0].ref ? -1 : a[0].ref > b[0].ref ? 1 : 0;
        });
        var pt = mk('div', '');
        pt.appendChild(mk('div', 'lbl', 'Peças deste lote · toque para selecionar'));
        h.appendChild(pt);
        var fl = grpFalta(g);
        if (fl > 0) {
          var db = btn('go', '+ Detalhar peças (' + fl + ')', function () {
            S.fromLot = g.id;
            S.addOpen = true;
            S.addMode = 'prod';
            S.photoFor = null;
            S.msg = '';
            S.gSel = g.id;
            if (!MIX(g.tipo)) S.tipo = g.tipo;
            render();
          });
          db.style.cssText =
            'width:auto;align-self:flex-start;margin:0;padding:0 18px;min-height:42px';
          h.appendChild(db);
        } else
          h.appendChild(mk('div', 'note n-ok', 'Todas as peças deste lote já foram detalhadas.'));
        if (!its.length)
          h.appendChild(
            mk(
              'div',
              'note n-info',
              'Ainda não há peças detalhadas neste lote. Toque no botão acima para adicionar.'
            )
          );
        var lst = mk('div', 'col');
        lst.style.gap = '8px';
        its.forEach(function (x) {
          var i = x[0],
            ix = x[1],
            on2 = !!S.lotPick[ix],
            r = btn(
              'pl' + (on2 ? ' on' : ''),
              '',
              function () {
                S.lotPick[ix] = !S.lotPick[ix];
                render();
              },
              on2
            );
          r.style.cssText =
            'text-align:left;width:100%;cursor:pointer;' +
            (on2 ? 'border-color:var(--accent);background:var(--panel2);' : '');
          r.setAttribute('aria-pressed', on2);
          r.appendChild(mk('span', '', on2 ? '☑' : '☐'));
          var lab = (i.tipo === 'pre' ? i.grau : isSimple(i.tipo) ? '' : i.vr) || '';
          r.appendChild(
            mk(
              'span',
              '',
              i.ref +
                (lab ? ' · ' + lab : '') +
                ' · ' +
                i.cor +
                (MIX(g.tipo) ? ' · ' + ((tipoOf(i.tipo) || {}).label || i.tipo) : '')
            )
          );
          r.appendChild(mk('b', '', i.qty + ' un.'));
          r.style.flex = '1';
          r.style.minWidth = '0';
          r.style.width = 'auto';
          var w = mk('div', '');
          w.style.cssText = 'display:flex;align-items:center;gap:6px';
          w.appendChild(r);
          var eb2 = btn('mini' + (S.pEdit === ix ? ' on' : ''), 'Editar', function () {
            if (S.pEdit === ix) {
              S.pEdit = -1;
            } else {
              S.pEdit = ix;
              S.pDel = -1;
              S.pe = {
                qty: String(i.qty),
                custo: i.custo != null ? String(i.custo).replace('.', ',') : ''
              };
            }
            render();
          });
          eb2.style.cssText =
            'min-height:34px;height:34px;padding:0 12px;font-size:13px;background:var(--panel2);border:1px solid var(--line);color:var(--sub);flex:0 0 auto';
          w.appendChild(eb2);
          var tb2 = mk('button', 'trash' + (S.pDel === ix ? ' on' : ''));
          tb2.type = 'button';
          tb2.title = 'Excluir esta peça';
          tb2.setAttribute('aria-label', 'Excluir ' + i.ref);
          tb2.innerHTML =
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/><path d="M10 11v6M14 11v6"/></svg>';
          tb2.onclick = function () {
            S.pDel = S.pDel === ix ? -1 : ix;
            S.pEdit = -1;
            render();
          };
          w.appendChild(tb2);
          lst.appendChild(w);
          if (S.pDel === ix) {
            var dz = mk('div', 'note n-bad');
            dz.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;align-items:center';
            dz.appendChild(
              mk(
                'span',
                '',
                'Excluir ' +
                  i.ref +
                  ' · ' +
                  i.cor +
                  ' (' +
                  i.qty +
                  ' un.)? As peças voltam para "faltam detalhar" deste lote.'
              )
            );
            dz.appendChild(
              btn('mini', 'Sim, excluir', function () {
                S.items = S.items.filter(function (y) {
                  return y !== i;
                });
                S.pDel = -1;
                S.lotPick = {};
                S.msg = 'Peça excluída do lote.';
                render();
              })
            );
            dz.appendChild(
              btn('mini', 'Cancelar', function () {
                S.pDel = -1;
                render();
              })
            );
            lst.appendChild(dz);
          }
          if (S.pEdit === ix) {
            var P2 = S.pe,
              ez = mk('div', 'col');
            ez.style.cssText =
              'gap:12px;padding:12px;border:1px solid var(--line);border-radius:12px';
            var qd = qStep(P2, 'qty', 'Quantidade', 1);
            var cd2 = mk('div', '');
            cd2.appendChild(mk('div', 'lbl', 'Custo desta peça (US$, vazio = média do lote)'));
            var ci2 = mk('input', 'in');
            ci2.inputMode = 'decimal';
            ci2.value = P2.custo;
            ci2.setAttribute('aria-label', 'Custo desta peça em US$');
            ci2.oninput = function () {
              P2.custo = ci2.value;
            };
            cd2.appendChild(ci2);
            var tw = mk('div', 'erow2');
            tw.appendChild(qd);
            tw.appendChild(cd2);
            ez.appendChild(tw);
            var rw2 = mk('div', '');
            rw2.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap';
            var sv2 = btn('go', 'Salvar', function () {
              var q = parseInt(String(P2.qty).replace(/\D/g, ''), 10);
              if (!(q >= 1)) return popErr('Informe a quantidade.');
              var d = q - i.qty;
              if (d > 0 && d > grpFalta(g))
                return popErr(
                  'O lote "' + gLabel(g) + '" só tem ' + grpFalta(g) + ' peça(s) para detalhar.'
                );
              var cr = String(P2.custo).trim().replace(',', '.'),
                cv = cr === '' ? null : parseFloat(cr);
              if (cv != null && !(cv >= 0))
                return popErr('Custo inválido. Use um número em US$ ou deixe vazio.');
              if (cv != null) {
                var ce4 = gCostErr(g, cv * q, i);
                if (ce4) return popErr(ce4);
              }
              i.qty = q;
              if (cv == null) delete i.custo;
              else i.custo = cv;
              S.pEdit = -1;
              S.msg = 'Peça atualizada.';
              render();
            });
            sv2.style.cssText =
              'width:auto;margin:0;padding:0 18px;min-height:38px;height:38px;font-size:14px';
            rw2.appendChild(sv2);
            rw2.appendChild(
              btn('mini', 'Cancelar', function () {
                S.pEdit = -1;
                render();
              })
            );
            ez.appendChild(rw2);
            lst.appendChild(ez);
          }
        });
        h.appendChild(lst);
        var np = Object.keys(S.lotPick).filter(function (k) {
          return S.lotPick[k] && S.items[k] && S.items[k].lote === g.id;
        }).length;
        if (np) {
          var bar = mk('div', 'note n-info');
          bar.style.cssText =
            'display:flex;flex-wrap:wrap;gap:10px;align-items:center;position:sticky;bottom:8px';
          bar.appendChild(
            mk('span', '', np + (np === 1 ? ' peça selecionada.' : ' peças selecionadas.'))
          );
          var vd = btn('go', 'Ver descrição', function () {
            S.descOpen = true;
            render();
          });
          vd.style.cssText =
            'width:auto;margin:0;padding:0 18px;min-height:38px;height:38px;font-size:14px';
          bar.appendChild(vd);
          bar.appendChild(
            btn('mini', 'Limpar', function () {
              S.lotPick = {};
              render();
            })
          );
          h.appendChild(bar);
        }
      }
    }
    descModalFill();
  }
  // Texto minúsculo e sem acentos.
  function noAcc(x) {
    try {
      return String(x).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    } catch (e) {
      return String(x).toLowerCase();
    }
  }
  // Texto de valor → número (aceita . e ,).
  function numAmt(x) {
    x = String(x)
      .replace(/[^\d.,]/g, '')
      .replace(/[.,]+$/, '');
    if (!x) return null;
    var d = x.indexOf('.') >= 0,
      c = x.indexOf(',') >= 0;
    if (d && c) {
      var lastD = x.lastIndexOf('.'),
        lastC = x.lastIndexOf(',');
      x = lastC > lastD ? x.replace(/\./g, '').replace(',', '.') : x.replace(/,/g, '');
    } else if (c) {
      x =
        (x.match(/,/g) || []).length > 1
          ? x.replace(/,/g, '')
          : /,\d{3}$/.test(x)
            ? null
            : x.replace(',', '.');
    } else if (d) {
      if ((x.match(/\./g) || []).length > 1) x = x.replace(/\./g, '');
      else if (/\.\d{3}$/.test(x)) x = null;
    }
    if (x == null) return null;
    var v = parseFloat(x);
    return isFinite(v) ? v : null;
  }
  // Interpreta o texto da nota: quantidades e valores do lote.
  function parseLote(t) {
    t = String(t || '');
    var q = {},
      m,
      U = '(?:pe[cç]as?|pie[sz]as?|pcs?|p[cç]s?|unid(?:ades?|ad)?|un|units?|pieces)';
    var re1 = new RegExp('(\\d{1,5})\\s*(?:x\\s*)?' + U + '\\b', 'gi'),
      re2 = new RegExp(
        '(?:total\\s+' + U + '|cant(?:idad|\\.)?|qtd|qty|quant(?:idade|ity)?)[\\s.:]*(\\d{1,5})\\b',
        'gi'
      );
    while ((m = re1.exec(t))) q[parseInt(m[1], 10)] = 1;
    while ((m = re2.exec(t))) q[parseInt(m[1], 10)] = 1;
    var qk = Object.keys(q).filter(function (k) {
        return +k > 0;
      }),
      qty = qk.length === 1 ? +qk[0] : null;
    var A = [],
      ra = /(G?)(?:US\s*)?\$\s*([\d.,]+)/gi;
    while ((m = ra.exec(t))) {
      if (m[1]) continue;
      var v = numAmt(m[2]);
      if (v != null && v > 0 && A.indexOf(v) < 0) A.push(v);
    }
    var usdv = null,
      total = null;
    if (qty) {
      var cands = [];
      A.forEach(function (u) {
        A.forEach(function (tt) {
          if (
            tt > u &&
            Math.abs(u * qty - tt) <= Math.max(0.011, tt * 0.004) &&
            !cands.some(function (c) {
              return c[0] === u && c[1] === tt;
            })
          )
            cands.push([u, tt]);
        });
      });
      if (cands.length === 1) {
        usdv = cands[0][0];
        total = cands[0][1];
      }
    }
    if (usdv == null) {
      var lab = [],
        rl =
          /(?:precio|pre[cç]o|price|custo|costo|unit(?:ario|ario)?)\s*(?:prom\w*|unit\w*|ahora|por\s*pe\w+|each)?[^\d$]{0,10}\$\s*([\d.,]+)/gi;
      while ((m = rl.exec(t))) {
        var v2 = numAmt(m[1]);
        if (v2 != null && v2 > 0 && lab.indexOf(v2) < 0) lab.push(v2);
      }
      if (lab.length === 1) usdv = lab[0];
    }
    var n = noAcc(t),
      isPre = /pre-?\s?graduad|pregraduad|lectura|reading/.test(n),
      isSol = /\bsolar(es)?\b|sunglass/.test(n),
      isArm = /armaz|armac|armaci|frames?\b/.test(n),
      tipo = null;
    if (isPre && !isSol) tipo = 'pre';
    else if (isSol && !isPre) tipo = 'solar';
    else if (isArm && !isPre && !isSol) tipo = 'sem';
    var fs = [];
    S.grp.forEach(function (g) {
      var k = noAcc(g.forn);
      if (k && n.indexOf(k) >= 0 && fs.indexOf(g.forn) < 0) fs.push(g.forn);
    });
    return { qty: qty, usd: usdv, total: total, tipo: tipo, forn: fs.length === 1 ? fs[0] : null };
  }
  window.__parseLote = parseLote;
  // Novo rascunho do formulário de lote.
  function lfNew() {
    return { forn: '', moeda: 'usd', rows: [{ tipo: '', qty: '', usd: '' }] };
  }
  // Formulário de novo lote.
  function renderLotForm() {
    var h = $('lotForm');
    h.textContent = '';
    if (S.addMode !== 'lote') return;
    var f = S.lf;
    if (!f.rows || !f.rows.length) f.rows = [{ tipo: '', qty: '', usd: '' }];
    if (!f.moeda) f.moeda = 'usd';
    f.rows.forEach(function (r) {
      if (!r.tipo || !(tipoOf(r.tipo) || r.tipo === 'mix')) r.tipo = S.tipo;
    });
    var box = mk('div', 'col');
    box.style.cssText = 'gap:16px';
    var mkIn = function (obj, lbl, key, ph, mode) {
      var d = mk('div', '');
      d.appendChild(mk('div', 'lbl', lbl));
      var i = mk('input', 'in');
      i.placeholder = ph;
      i.value = obj[key] || '';
      if (mode) i.inputMode = mode;
      i.oninput = function () {
        obj[key] = i.value;
      };
      i.setAttribute('aria-label', lbl);
      d.appendChild(i);
      return d;
    };
    var fdiv = mkIn(f, 'Fornecedor', 'forn', 'Ex.: Kazwini');
    var fin = fdiv.querySelector('input'),
      known = [];
    S.grp.forEach(function (g) {
      if (known.indexOf(g.forn) < 0) known.push(g.forn);
    });
    if (known.length) {
      var fn = mk('div', 'nav');
      fn.style.marginTop = '8px';
      known.forEach(function (k) {
        fn.appendChild(
          btn('chip', k, function () {
            f.forn = k;
            fin.value = k;
          })
        );
      });
      fdiv.appendChild(fn);
    }
    box.appendChild(fdiv);
    var md = mk('div', '');
    md.appendChild(mk('div', 'lbl', 'Moeda da compra'));
    var mn = mk('div', 'nav');
    [
      ['usd', 'US$'],
      ['pyg', 'G$'],
      ['brl', 'R$']
    ].forEach(function (x) {
      mn.appendChild(
        btn(
          'chip' + (f.moeda === x[0] ? ' on' : ''),
          x[1],
          function () {
            f.moeda = x[0];
            renderLotForm();
          },
          f.moeda === x[0]
        )
      );
    });
    md.appendChild(mn);
    if (f.moeda !== 'usd')
      md.appendChild(
        mk(
          'div',
          'hint',
          'Converte para dólar pela cotação de hoje (US$ 1 = G$ ' +
            dots(S.fx.pyg) +
            ') e entra no cálculo do custo de reposição e do colchão de segurança.'
        )
      );
    box.appendChild(md);
    f.rows.forEach(function (r, ix) {
      var card = mk('div', 'col');
      card.style.cssText = 'gap:14px;padding:14px;border:1px solid var(--line);border-radius:12px';
      var hd = mk('div', '');
      hd.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:8px';
      hd.appendChild(mk('b', '', f.rows.length > 1 ? 'Peças ' + (ix + 1) : 'Peças do lote'));
      if (f.rows.length > 1) {
        var tr = mk('button', 'trash');
        tr.type = 'button';
        tr.title = 'Remover esta linha';
        tr.setAttribute('aria-label', 'Remover a linha ' + (ix + 1));
        tr.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/><path d="M10 11v6M14 11v6"/></svg>';
        tr.onclick = function () {
          f.rows.splice(ix, 1);
          renderLotForm();
        };
        hd.appendChild(tr);
      }
      card.appendChild(hd);
      var td = mk('div', '');
      td.appendChild(mk('div', 'lbl', 'Tipo de produto'));
      var tn = mk('div', 'nav');
      LTIPOS().forEach(function (x) {
        tn.appendChild(
          btn(
            'chip' + (x.id === r.tipo ? ' on' : ''),
            x.label,
            function () {
              r.tipo = x.id;
              renderLotForm();
            },
            x.id === r.tipo
          )
        );
      });
      td.appendChild(tn);
      newTipoUI(
        r,
        renderLotForm,
        function (id) {
          r.tipo = id;
        },
        tn,
        td
      );
      card.appendChild(td);
      var sym = { usd: 'US$', pyg: 'G$', brl: 'R$' }[f.moeda],
        two = mk('div', 'erow2');
      two.appendChild(qStep(r, 'qty', 'Quantidade de peças', 1, 'Ex.: 300'));
      var cd = mkIn(
        r,
        'Custo total do lote (' + sym + ')',
        'usd',
        'Ex.: ' + (f.moeda === 'pyg' ? '1.240.000' : '200,00'),
        'decimal'
      );
      two.appendChild(cd);
      card.appendChild(two);
      var cv = mk('div', 'hint', '');
      cv.style.margin = '0';
      var upd = function () {
        var u = pm(r.usd, f.moeda),
          q = parseInt(String(r.qty).replace(/\D/g, ''), 10);
        if (!(u > 0)) {
          cv.textContent = '';
          return;
        }
        var tu = convUsd(u, f.moeda);
        cv.textContent =
          (f.moeda !== 'usd' ? '≈ ' + usd(tu) + ' no total. ' : '') +
          (q > 0
            ? 'Média: ' +
              usd(tu / q) +
              ' por peça (total ÷ quantidade). Serve de custo até você detalhar cada peça.'
            : '');
      };
      upd();
      card.querySelectorAll('input').forEach(function (x) {
        x.addEventListener('input', upd);
      });
      card.appendChild(cv);
      box.appendChild(card);
    });
    box.appendChild(
      btn('chip add', '+ Adicionar outro tipo', function () {
        var l = f.rows[f.rows.length - 1];
        f.rows.push({ tipo: l.tipo, qty: '', usd: '' });
        renderLotForm();
      })
    );
    var er = mk('div', 'note n-bad');
    er.hidden = true;
    box.appendChild(er);
    var row = mk('div', '');
    row.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap';
    var ok = btn('go', 'Criar lote', function () {
      var fo = String(f.forn || '')
          .trim()
          .replace(/\s+/g, ' '),
        bad = function (t) {
          popErr(t);
        };
      if (!fo) return bad('Digite o nome do fornecedor.');
      var out = [];
      for (var k = 0; k < f.rows.length; k++) {
        var r = f.rows[k],
          q = parseInt(String(r.qty).replace(/\D/g, ''), 10),
          u = pm(r.usd, f.moeda),
          w = f.rows.length > 1 ? ' (linha ' + (k + 1) + ')' : '';
        if (!(q > 0)) return bad('Informe a quantidade de peças' + w + '.');
        if (!(u > 0))
          return bad(
            'Informe o preço total do lote em ' +
              { usd: 'US$', pyg: 'G$', brl: 'R$' }[f.moeda] +
              w +
              '.'
          );
        var tu = Math.round(convUsd(u, f.moeda) * 10000) / 10000;
        out.push({ tipo: r.tipo, novo: r.novo, qty: q, orig: u, tot: tu, usd: tu / q });
      }
      var FO = fo[0].toUpperCase() + fo.slice(1),
        gs = out.map(function (o, n) {
          return {
            id: 'G' + Date.now().toString(36) + n,
            forn: FO,
            tipo: String(o.novo || '').trim()
              ? ensureTipo(o.novo)
              : o.tipo === 'mix'
                ? ensureTipo('Variados')
                : o.tipo,
            qty: o.qty,
            usd: o.usd,
            totalUsd: o.tot,
            moeda: f.moeda,
            custoOrig: o.orig,
            rate: Math.round(S.fx.pyg),
            sold: 0,
            ts: Date.now()
          };
        });
      gs.forEach(function (g) {
        S.grp.push(g);
        lotCharge(g);
      });
      S.addMode = 'prod';
      S.lf = lfNew();
      if (gs[0].tipo !== 'mix') S.tipo = gs[0].tipo;
      S.todos = false;
      S.gSel = gs[0].id;
      $('lotMsg').textContent = '';
      S.msg =
        gs.length > 1
          ? gs.length +
            ' lotes criados de ' +
            FO +
            ': ' +
            gs
              .map(function (g) {
                return g.qty + ' peças por ' + usd(gTot(g));
              })
              .join(' · ') +
            '. Agora detalhe as peças (formato, grau, cor) abaixo.'
          : 'Lote criado: ' +
            gs[0].qty +
            ' peças de ' +
            gLabel(gs[0]) +
            '. Agora detalhe as peças (formato, grau, cor) abaixo.';
      render();
    });
    row.appendChild(ok);
    box.appendChild(row);
    h.appendChild(box);
  }
  // Lê a foto da nota de compra e preenche o lote.
  function readNota(file) {
    var m = $('lotMsg');
    m.style.color = 'var(--mute)';
    m.textContent = 'Lendo a nota…';
    var url = URL.createObjectURL(file),
      im = new Image();
    im.onload = function () {
      var sc = Math.min(1, 1800 / Math.max(im.naturalWidth, im.naturalHeight)),
        cv = document.createElement('canvas');
      cv.width = Math.round(im.naturalWidth * sc);
      cv.height = Math.round(im.naturalHeight * sc);
      cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
      URL.revokeObjectURL(url);
      loadTess()
        .then(function () {
          return window.Tesseract.recognize(cv, 'eng');
        })
        .then(
          function (r) {
            var pr = parseLote(r && r.data && r.data.text);
            if (!S.lf.rows || !S.lf.rows.length) S.lf.rows = [{ tipo: '', qty: '', usd: '' }];
            var r0 = S.lf.rows[0];
            if (pr.qty) r0.qty = String(pr.qty);
            var ptot =
              pr.total != null
                ? pr.total
                : pr.usd != null && pr.qty
                  ? Math.round(pr.usd * pr.qty * 100) / 100
                  : null;
            if (ptot != null) {
              S.lf.moeda = 'usd';
              r0.usd = String(ptot).replace('.', ',');
            }
            if (pr.tipo) r0.tipo = pr.tipo;
            if (pr.forn) S.lf.forn = pr.forn;
            var got = [];
            if (pr.qty) got.push(pr.qty + ' peças');
            if (ptot != null) got.push(usd(ptot) + ' no total');
            if (pr.tipo) {
              var tt = tipoOf(pr.tipo);
              if (tt) got.push(tt.full);
            }
            if (pr.forn) got.push(pr.forn);
            render();
            var mm = $('lotMsg');
            mm.style.color = got.length ? 'var(--ok)' : 'var(--warn)';
            mm.textContent = got.length
              ? 'Li na nota: ' +
                got.join(' e ') +
                '.' +
                (pr.qty && ptot != null && S.lf.forn
                  ? ''
                  : ' O que não ficou claro está em branco, preencha.') +
                ' Confira antes de criar.'
              : 'Não consegui ler a quantidade e o custo com segurança. Preencha à mão.';
          },
          function () {
            render();
            var mm = $('lotMsg');
            mm.style.color = 'var(--warn)';
            mm.textContent = 'Não consegui ler a nota neste aparelho agora. Preencha à mão.';
          }
        );
    };
    im.onerror = function () {
      m.textContent = 'Não consegui abrir essa foto.';
    };
    im.src = url;
  }
  $('btnLotFoto').onclick = function () {
    camOpen(
      function (f) {
        readNota(f);
      },
      'Foto da nota do lote',
      { gallery: true }
    );
  };
  $('fileL').onchange = function (e) {
    var f = e.target.files && e.target.files[0];
    if (f) readNota(f);
  };
  // ===== Faixas de qualidade, piso de preço, brindes e sazonalidade. =====
  var FAIXA_CORES = ['#7fd8ff', '#ffc766', '#e08bc0', '#8be08f', '#b79cff', '#ff9d7a'];
  // Faixas criadas pelo dono: nome, margem mínima (% de lucro sobre o preço) e preço próprio por tipo (opcional).
  S.faixas = [
    { id: 'f1', nome: 'Econômico', margem: 30, precos: {} },
    { id: 'f2', nome: 'Intermediário', margem: 40, precos: {} },
    { id: 'f3', nome: 'Luxo', margem: 50, precos: {} }
  ];
  S.pfaixa = {}; // código do produto -> id da faixa
  S.metaUsd = 0; // meta mensal de lucro da loja toda (US$)
  S.sazon = {}; // só para testes: curva fixa por tipo. Em uso normal a curva é aprendida das vendas (sazonAprendida)
  S.appStart = Date.now();
  S.sugIgn = {}; // sugestão de margem ignorada: faixa -> mês (AAAA-MM)
  S.backupTs = 0;
  S.contagens = [];
  S.conf = {}; // última conferência de estoque por produto (tipo|código) -> data
  S.tolUsd = 0.5; // diferença de contagem tolerada (US$)
  S.volAuto = true; // peças por mês calculadas pelas vendas reais (quando há histórico)
  // Curva padrão: solares vendem mais no verão do Paraguai (outubro a março).
  var SAZON_PADRAO = { solar: [1.5, 1.4, 1.2, 1.0, 0.8, 0.6, 0.6, 0.7, 0.9, 1.1, 1.3, 1.5] };
  var MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  // Faixa de um produto pelo código.
  function faixaOf(ref) {
    var id = S.pfaixa && S.pfaixa[ref];
    return (
      (id &&
        S.faixas.filter(function (f) {
          return f.id === id;
        })[0]) ||
      null
    );
  }
  // Cor de uma faixa (pela ordem na lista).
  function faixaCor(f) {
    return FAIXA_CORES[Math.max(0, S.faixas.indexOf(f)) % FAIXA_CORES.length];
  }
  // Etiqueta colorida da faixa.
  function faixaTag(f) {
    var c = faixaCor(f),
      e = mk('span', 'ftag', f.nome);
    e.style.cssText =
      'font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;color:' +
      c +
      ';background:color-mix(in srgb,' +
      c +
      ' 16%,transparent)';
    return e;
  }
  // Arredonda para cima em múltiplos de 500 guaranis.
  function up500(v) {
    return Math.ceil(v / 500) * 500;
  }
  // Fator de venda do tipo em um mês (0 = janeiro). 1 = mês normal.
  // Aprendido sozinho com as vendas: cada mês do ano comparado com a média mensal do próprio tipo.
  // Com pouco histórico usa a curva padrão; conforme o histórico cresce (até 24 meses), pesa mais o que a loja realmente vendeu.
  function sazonAprendida(tipo) {
    var chave = S.sales.length + '|' + Math.floor(Date.now() / 10000),
      cache = (S._sazCache = S._sazCache && S._sazCache.k === chave ? S._sazCache : { k: chave, t: {} });
    if (cache.t[tipo]) return cache.t[tipo];
    var base = SAZON_PADRAO[tipo] || [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      hoje = new Date(),
      atual = hoje.getFullYear() * 12 + hoje.getMonth(),
      porMes = {},
      primeiro = null,
      n = 0;
    S.sales.forEach(function (s) {
      if (s.estorno || s.tipo !== tipo) return;
      var d = new Date(s.ts),
        k = d.getFullYear() * 12 + d.getMonth();
      if (k >= atual) return;
      porMes[k] = (porMes[k] || 0) + s.qty;
      n += s.qty;
      if (primeiro === null || k < primeiro) primeiro = k;
    });
    var out = base.slice(),
      meses = primeiro === null ? 0 : atual - primeiro;
    if (meses >= 6 && n >= 30) {
      var soma = 0,
        porIdx = [],
        cont = [];
      for (var k = primeiro; k < atual; k++) {
        var v = porMes[k] || 0,
          i = k % 12;
        soma += v;
        porIdx[i] = (porIdx[i] || 0) + v;
        cont[i] = (cont[i] || 0) + 1;
      }
      var media = soma / meses,
        conf = Math.min(1, meses / 24);
      if (media > 0)
        for (var m = 0; m < 12; m++)
          if (cont[m]) {
            var raw = porIdx[m] / cont[m] / media;
            out[m] = Math.max(0.4, Math.min(2.5, conf * raw + (1 - conf) * base[m]));
          }
    }
    cache.t[tipo] = out;
    return out;
  }
  function sazonFator(tipo, mes) {
    var c = (S.sazon && S.sazon[tipo]) || sazonAprendida(tipo);
    var v = c && Number(c[((mes % 12) + 12) % 12]);
    return v > 0 ? Math.round(v * 100) / 100 : 1;
  }
  // Preço de tabela e limites de uma peça: trava (sem prejuízo) e piso (com a margem mínima da faixa).
  function pisoPeca(it) {
    var t = tFor(it),
      fx = S.fx.pyg,
      rep = Math.round(t.repUSD * fx),
      cp = contasPeca(),
      col = Math.round(t.repUSD * fx * colchao().pct),
      f = faixaOf(it.ref),
      m = f ? Math.min(0.9, f.margem / 100) : 0,
      trava = rep + cp;
    return {
      lista: t.price,
      rep: rep,
      contas: cp,
      colch: col,
      trava: trava,
      piso: up500((trava + col) / (1 - m)),
      saida: up500(trava),
      margem: m
    };
  }
  // Brindes: peças de tipos simples (estojo, capinha…) com estoque.
  function brindesDisp() {
    return S.items.filter(function (i) {
      return i.qty > 0 && isSimple(i.tipo);
    });
  }
  // Custo em US$ de uma peça de brinde.
  function brindeUsd(it) {
    var c = effCusto(it),
      t = tipoOf(it.tipo);
    return c != null ? c : t ? t.repUSD || 0 : 0;
  }
  // Procura a peça de brinde gravada numa venda.
  function brindeItem(b) {
    return S.items.filter(function (x) {
      return (
        x.tipo === b.tipo &&
        x.ref === b.ref &&
        x.cor === b.cor &&
        (x.grau || '') === (b.grau || '') &&
        (x.vr || '') === (b.vr || '') &&
        (x.lote || '') === (b.lote || '')
      );
    })[0];
  }
  // Estorno da venda devolve o brinde ao estoque.
  function estornoBrinde(s) {
    if (!s.brinde) return;
    var it = brindeItem(s.brinde);
    if (it) it.qty += 1;
  }
  // Soma peças por pacote (entrada em pacotes): total de peças e custo por peça.
  function calcPacote(pecas, pacotes, custoPacote) {
    var n = Math.max(0, Math.round(pecas * pacotes));
    return { qty: n, custo: n > 0 && custoPacote > 0 ? (custoPacote * pacotes) / n : 0 };
  }

  // Campos extras do cadastro: faixa do produto e entrada por pacote.
  function renderAddExtras() {
    var fb = $('eFaixas');
    if (!fb) return;
    var ref = S._ref,
      cur = S.eFaixa || (ref && (faixaOf(ref) || {}).id) || '';
    $('eFaixaB').hidden = !S.faixas.length || isSimple(S.tipo);
    fb.textContent = '';
    S.faixas.forEach(function (x) {
      fb.appendChild(
        btn(
          'chip' + (cur === x.id ? ' on' : ''),
          x.nome,
          function () {
            S.eFaixa = S.eFaixa === x.id ? '' : x.id;
            render();
          },
          cur === x.id
        )
      );
    });
    var pc = $('pkChips');
    pc.textContent = '';
    [20, 24, 30].forEach(function (n) {
      pc.appendChild(
        btn(
          'chip' + (S.pkPecas === n ? ' on' : ''),
          String(n),
          function () {
            S.pkPecas = n;
            $('pkN').value = '';
            render();
          },
          S.pkPecas === n
        )
      );
    });
    var pk = pkCalc();
    $('pkH').hidden = !pk.qty;
    $('pkH').textContent = pk.qty
      ? pk.qty + ' peças no total' + (pk.custo ? ' · custo US$ ' + pk.custo.toFixed(2).replace('.', ',') + ' por peça' : '')
      : '';
    $('pkGo').disabled = !pk.qty;
  }
  // Lê os campos do pacote e calcula peças e custo por peça.
  function pkCalc() {
    var pecas = toNum($('pkN').value) || S.pkPecas || 0,
      q = toNum($('pkQ').value) || 1,
      c = parseFloat(String($('pkC').value).replace(',', '.')) || 0;
    return calcPacote(pecas, q, c);
  }
  ['pkN', 'pkQ', 'pkC'].forEach(function (id) {
    $(id).addEventListener('input', function () {
      if (id === 'pkN' && this.value) S.pkPecas = 0;
      renderAddExtras();
    });
  });
  $('pkGo').onclick = function () {
    var pk = pkCalc();
    if (!pk.qty) return;
    S.qty = pk.qty;
    if (pk.custo) $('eCusto').value = pk.custo.toFixed(4).replace(/0+$/, '').replace(/\.$/, '').replace('.', ',');
    S.msg = '';
    render();
  };

  // Média mensal real de peças vendidas (0 enquanto não há histórico suficiente).
  function volumeAuto() {
    var now = Date.now(),
      first = S.sales.reduce(function (a, s) {
        return Math.min(a, s.ts);
      }, S.appStart || now),
      hist = (now - Math.min(first, S.appStart || now)) / DAY;
    if (hist < 60) return 0;
    var win = Math.min(90, hist),
      units = 0;
    S.sales.forEach(function (s) {
      if (!s.estorno && now - s.ts <= win * DAY) units += s.qty;
    });
    return units >= 20 ? Math.round(units / (win / 30)) : 0;
  }
  // Peças por mês usadas para ratear as contas: real quando há histórico, senão o número manual.
  function volumeEfetivo() {
    var a = S.volAuto !== false ? volumeAuto() : 0;
    return a > 0 ? a : S.volume;
  }
  // ===== Análises: meta do mês, reposição, estoque parado, curva ABC, sugestão de margem e câmbio x piso. =====
  // Lucro livre de uma venda em US$ (ao câmbio da venda).
  function lucroUsd(s) {
    return s.livre / (s.fx || S.fx.pyg);
  }
  // Estatísticas por produto (tipo + código): estoque, vendas e lucro.
  function prodStats() {
    var now = Date.now(),
      map = {},
      order = [];
    S.items.forEach(function (i) {
      var t = tipoOf(i.tipo);
      if (!t) return;
      var k = i.tipo + '|' + i.ref;
      if (!map[k]) {
        map[k] = {
          key: k,
          tipo: i.tipo,
          ref: i.ref,
          it: i,
          stock: 0,
          costUsd: 0,
          cu: 0,
          sold30: 0,
          sold90: 0,
          adj30: 0,
          profit30: 0,
          profit90: 0,
          last: 0
        };
        order.push(k);
      }
      var m = map[k],
        c = effCusto(i);
      if (i.qty > 0 && (m.it.qty <= 0 || !m.stock)) m.it = i;
      m.stock += i.qty;
      m.costUsd += i.qty * (c != null ? c : t.repUSD || 0);
    });
    S.sales.forEach(function (s) {
      var m = map[s.tipo + '|' + s.ref];
      if (!m || s.estorno) return;
      var age = (now - s.ts) / DAY;
      if (age <= 90) {
        m.sold90 += s.qty;
        m.profit90 += lucroUsd(s);
      }
      if (age <= 30) {
        m.sold30 += s.qty;
        m.profit30 += lucroUsd(s);
        m.adj30 += s.qty / sazonFator(s.tipo, new Date(s.ts).getMonth());
      }
      if (s.ts > m.last) m.last = s.ts;
    });
    return order.map(function (k) {
      var m = map[k];
      m.cu = m.stock > 0 ? m.costUsd / m.stock : brindeUsd(m.it);
      return m;
    });
  }
  // Meta do mês: lucro até agora, por faixa, e dias restantes.
  function metaInfo() {
    var d = new Date(),
      ini = new Date(d.getFullYear(), d.getMonth(), 1).getTime(),
      dias = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(),
      tot = 0,
      por = {};
    S.sales.forEach(function (s) {
      if (s.estorno || s.ts < ini) return;
      var u = lucroUsd(s),
        k = s.faixa || '';
      tot += u;
      por[k] = (por[k] || 0) + u;
    });
    return { meta: S.metaUsd || 0, lucro: tot, por: por, restam: dias - d.getDate() + 1, dias: dias };
  }
  // Ritmo de venda esperado para os próximos 30 dias (já corrigido pela estação).
  function esperado30(m) {
    var f = sazonFator(m.tipo, new Date(Date.now() + 15 * DAY).getMonth());
    return m.adj30 * f;
  }
  // Produtos que mais dão lucro e estão acabando, com a quantidade sugerida para comprar.
  function reposicao() {
    return prodStats()
      .filter(function (m) {
        return m.sold30 > 0 && m.stock >= 0;
      })
      .map(function (m) {
        var e = esperado30(m),
          dias = e > 0 ? m.stock / (e / 30) : Infinity;
        m.dias = dias;
        m.comprar = Math.max(0, Math.ceil(e * 1.5 - m.stock));
        return m;
      })
      .filter(function (m) {
        return m.dias <= 21;
      })
      .sort(function (a, b) {
        return b.profit30 - a.profit30;
      });
  }
  // Estoque parado: sem venda há muito tempo (fora da baixa estação) com preço de saída sem prejuízo.
  function parados() {
    var now = Date.now(),
      mes = new Date().getMonth();
    return prodStats()
      .filter(function (m) {
        if (m.stock <= 0 || isSimple(m.tipo)) return false;
        var dias = (now - (m.last || S.appStart || now)) / DAY;
        m.diasParado = dias;
        return dias >= 60 && sazonFator(m.tipo, mes) >= 0.8;
      })
      .map(function (m) {
        m.pp = pisoPeca(m.it);
        return m;
      })
      .filter(function (m) {
        return m.pp.lista > 0 && m.pp.saida < m.pp.lista;
      })
      .sort(function (a, b) {
        return b.costUsd - a.costUsd;
      });
  }
  // Curva ABC pelo lucro dos últimos 90 dias.
  function curvaAbc() {
    var st = prodStats(),
      com = st
        .filter(function (m) {
          return m.profit90 > 0;
        })
        .sort(function (a, b) {
          return b.profit90 - a.profit90;
        }),
      tot = com.reduce(function (a, m) {
        return a + m.profit90;
      }, 0),
      acc = 0;
    com.forEach(function (m) {
      acc += m.profit90;
      m.abc = acc - m.profit90 < tot * 0.8 ? 'A' : acc - m.profit90 < tot * 0.95 ? 'B' : 'C';
    });
    var sem = st.filter(function (m) {
      return m.stock > 0 && m.sold90 === 0;
    });
    return { lista: com, total: tot, sem: sem };
  }
  // Produtos cujo preço de tabela ficou abaixo do piso com o câmbio de hoje.
  function abaixoDoPiso() {
    return prodStats()
      .map(function (m) {
        m.pp = pisoPeca(m.it);
        return m;
      })
      .filter(function (m) {
        return m.stock > 0 && !isSimple(m.tipo) && m.pp.lista > 0 && m.pp.lista < m.pp.piso;
      });
  }
  // Vendas abaixo da trava ou do piso nos últimos 30 dias, por motivo.
  function perdasPropositais() {
    var por = {},
      perda = 0,
      n = 0;
    periodSales(30).forEach(function (s) {
      if (!s.abaixo) return;
      n++;
      if (s.livre < 0) perda += s.livre;
      var k = s.motivo || 'Sem motivo';
      por[k] = (por[k] || 0) + s.livre;
    });
    return { n: n, perda: perda, por: por, total: sumBy(periodSales(30), 'livre') };
  }
  // Sugestão de margem por faixa: olha o giro, o estoque e as contas.
  function sugestoes() {
    var now = Date.now(),
      ym = new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
      oldest = S.sales.reduce(function (a, s) {
        return Math.min(a, s.ts);
      }, S.appStart || now),
      hist = (now - Math.min(oldest, S.appStart || now)) / DAY,
      st = prodStats(),
      meta = metaInfo(),
      contasOk = reservas().livre >= 0;
    return S.faixas.map(function (f) {
      var r = { faixa: f, de: f.margem, para: f.margem, acao: 'manter', motivo: '' };
      if (S.sugIgn[f.id] === ym) {
        r.acao = 'ignorada';
        return r;
      }
      var cur = 0,
        prev = 0,
        stock = 0,
        exp = 0;
      S.sales.forEach(function (s) {
        if (s.estorno || s.faixa !== f.id) return;
        var age = (now - s.ts) / DAY,
          adj = s.qty / sazonFator(s.tipo, new Date(s.ts).getMonth());
        if (age <= 30) cur += adj;
        else if (age <= 90) prev += adj / 2;
      });
      st.forEach(function (m) {
        if ((faixaOf(m.ref) || {}).id !== f.id) return;
        stock += m.stock;
        exp += esperado30(m);
      });
      var dias = exp > 0 ? stock / (exp / 30) : Infinity;
      if (hist < 60 || prev <= 0) {
        r.acao = 'sem-base';
        r.motivo = 'Ainda sem histórico suficiente (precisa de 2 meses de vendas desta faixa).';
        return r;
      }
      var ratio = cur / prev,
        pct = Math.round(ratio * 100);
      if (ratio >= 1.3 && dias <= 25) {
        r.acao = 'subir';
        r.para = Math.min(80, f.margem + 3);
        r.motivo =
          'Vendeu ' + pct + '% do ritmo normal e o estoque dura ~' + Math.round(dias) + ' dias. Há espaço para subir a margem.';
      } else if (ratio <= 0.7 && dias >= 60) {
        r.acao = 'descer';
        r.para = Math.max(10, f.margem - 3);
        r.motivo =
          'Vendeu só ' + pct + '% do ritmo normal e o estoque dura ~' + Math.min(999, Math.round(dias)) + ' dias. Baixar a margem dá mais giro.';
      } else {
        r.motivo =
          'Vendas em ' +
          pct +
          '% do ritmo normal' +
          (contasOk ? ', contas cobertas' : ', mas o caixa está abaixo do separado') +
          (meta.meta > 0
            ? meta.lucro >= meta.meta
              ? ' e meta cumprida.'
              : ', meta em ' + Math.round((meta.lucro / meta.meta) * 100) + '%.'
            : '.');
      }
      if (r.para === r.de) r.acao = 'manter';
      return r;
    });
  }
  // Linha simples de lista: título, apoio e valor à direita.
  function dxRow(titulo, apoio, dir, extra) {
    return (
      '<div class="sl"><span>' +
      titulo +
      '<small>' +
      apoio +
      '</small></span><b>' +
      (dir || '') +
      '</b>' +
      (extra || '') +
      '</div>'
    );
  }
  // Nome curto do produto para listas.
  function dxNome(m) {
    var f = faixaOf(m.ref),
      tp = tipoOf(m.tipo);
    return (
      esc(pn(m.ref)) +
      ' <span class="hint" style="display:inline;margin:0">' +
      esc(tp ? tp.label : '') +
      (f ? ' · ' + esc(f.nome) : '') +
      '</span>'
    );
  }
  // Blocos novos do Dashboard (HTML).
  function dashExtra() {
    var out = {},
      html = '',
      mi = metaInfo(),
      u0 = function (n) {
        return 'US$ ' + Math.round(n);
      };
    // meta
    html += '<section class="card col"><h2 style="margin:0;font-size:16px">Meta do mês</h2>';
    if (mi.meta > 0) {
      var p = Math.min(100, (mi.lucro / mi.meta) * 100);
      html +=
        '<div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-size:26px;color:var(--ok)">' +
        u0(mi.lucro) +
        '</b><span class="hint" style="margin:0">meta ' +
        u0(mi.meta) +
        '</span></div><div class="bar"><i style="width:' +
        p +
        '%;background:var(--ok)"></i></div><div class="hint" style="margin:0">' +
        (mi.lucro >= mi.meta
          ? 'Meta cumprida.'
          : 'Faltam ' + u0(mi.meta - mi.lucro) + ' · ' + mi.restam + ' dia(s) restantes.') +
        '</div>';
    } else
      html +=
        '<div class="hint" style="margin:0">Lucro livre no mês: <b>' +
        u0(mi.lucro) +
        '</b>. Defina a meta em <a href="#ajustes" data-act="view" data-id="ajustes" style="color:var(--accent-fg)">Ajustes</a>.</div>';
    html += '<div class="split">';
    S.faixas.forEach(function (f) {
      html += dxRow(
        '<span class="sp" style="background:' + faixaCor(f) + '"></span>' + esc(f.nome),
        'lucro livre no mês',
        u0(mi.por[f.id] || 0)
      );
    });
    if (mi.por['']) html += dxRow('Sem faixa', 'lucro livre no mês', u0(mi.por['']));
    html += '</div></section>';
    out.meta = html;
    html = '';
    // sugestões de margem
    var sg = sugestoes().filter(function (r) {
      return r.acao !== 'ignorada';
    });
    if (sg.length) {
      html +=
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Sugestão de margem</h2><div class="hint" style="margin:2px 0 0">Cada faixa é avaliada separada, pelo giro, estoque e contas. Você decide.</div></div><div class="split">';
      sg.forEach(function (r) {
        var ap =
          r.acao === 'subir' || r.acao === 'descer'
            ? '<div style="display:flex;gap:8px;margin-top:6px"><button class="chip on" data-act="sugap" data-id="' +
              r.faixa.id +
              '">Aplicar ' +
              r.para +
              '%</button><button class="chip" data-act="sugig" data-id="' +
              r.faixa.id +
              '">Ignorar</button></div>'
            : '';
        html +=
          '<div class="sl" style="flex-wrap:wrap"><span>' +
          esc(r.faixa.nome) +
          ' · margem ' +
          r.de +
          '%<small>' +
          esc(r.motivo) +
          '</small></span><b>' +
          (r.acao === 'subir' ? 'subir' : r.acao === 'descer' ? 'descer' : r.acao === 'sem-base' ? '—' : 'manter') +
          '</b>' +
          ap +
          '</div>';
      });
      html += '</div></section>';
    }
    out.sug = html;
    html = '';
    // repor primeiro + lista de compras
    var rp = reposicao().slice(0, 8);
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Repor primeiro</h2><div class="hint" style="margin:2px 0 0">Ordenado pelo lucro que o produto dá. Dias de estoque pelo ritmo de venda, corrigido pela estação.</div></div>';
    if (!rp.length) html += '<div class="note n-ok">Nada acabando nos próximos 21 dias.</div>';
    else {
      html += '<div class="split">';
      var totC = 0;
      rp.forEach(function (m) {
        totC += m.comprar * m.cu;
        html += dxRow(
          dxNome(m),
          'restam ~' + Math.round(m.dias) + ' dias · ' + m.stock + ' un. · comprar ~' + m.comprar,
          u0(m.profit30)
        );
      });
      html +=
        '</div><div class="note n-info">Lista de compras (cobre ~45 dias): custo estimado <b>' +
        usd0(totC) +
        '</b>.</div>';
    }
    html += '</section>';
    out.repor = html;
    html = '';
    // parados
    var pa = parados().slice(0, 8);
    if (pa.length) {
      html +=
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Estoque parado</h2><div class="hint" style="margin:2px 0 0">Sem venda há 60 dias ou mais (fora da baixa estação). Preço de saída = reposição + contas, sem prejuízo e sem meta de lucro.</div></div><div class="split">';
      pa.forEach(function (m) {
        html += dxRow(
          dxNome(m),
          Math.round(m.diasParado) + ' dias sem vender · ' + m.stock + ' un. · ' + usd0(m.costUsd) + ' parados',
          gs(m.pp.saida),
          '<button class="chip" data-act="saida" data-id="' + esc(m.key) + '">Vender com saída</button>'
        );
      });
      html += '</div></section>';
    }
    out.parados = html;
    html = '';
    // câmbio x piso
    var ab = abaixoDoPiso().slice(0, 8);
    if (ab.length) {
      html +=
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Preço abaixo do piso hoje</h2><div class="hint" style="margin:2px 0 0">Com o câmbio e as contas de hoje, o preço de tabela destes produtos não cobre o piso da faixa.</div></div><div class="split">';
      ab.forEach(function (m) {
        html += dxRow(dxNome(m), 'tabela ' + gs(m.pp.lista) + ' · piso ' + gs(m.pp.piso), gs(m.pp.lista - m.pp.piso));
      });
      html += '</div></section>';
    }
    out.abaixo = html;
    html = '';
    // perdas
    var pr = perdasPropositais();
    if (pr.n) {
      html +=
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Vendas abaixo do piso (30 dias)</h2><div class="hint" style="margin:2px 0 0">' +
        pr.n +
        ' venda(s). O resultado de tudo junto é o que importa: lucro livre total do período <b>' +
        gs(pr.total) +
        '</b>.</div></div><div class="split">';
      Object.keys(pr.por).forEach(function (k) {
        html += dxRow(esc(k), 'lucro livre dessas vendas', sgn(pr.por[k]));
      });
      html += '</div></section>';
    }
    out.perdasV = html;
    html = '';
    // perdas e sobras da contagem de estoque (30 dias)
    var ct = S.contagens.filter(function (x) {
      return Date.now() - x.ts <= 30 * DAY;
    });
    if (ct.length) {
      var perd = 0,
        sob = 0,
        porP = {};
      ct.forEach(function (x) {
        (x.itens || []).forEach(function (it) {
          if (it.usd < 0) {
            perd += it.usd;
            porP[it.ref] = (porP[it.ref] || 0) + it.usd;
          } else sob += it.usd;
        });
      });
      html +=
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Perdas e sobras de estoque (30 dias)</h2><div class="hint" style="margin:2px 0 0">Diferenças achadas nas contagens, em custo.</div></div><div class="split">' +
        dxRow('Faltaram', ct.length + ' contagem(ns)', usd0(Math.abs(perd))) +
        dxRow('Sobraram', 'peças a mais que o app', usd0(sob));
      Object.keys(porP)
        .sort(function (a, b) {
          return porP[a] - porP[b];
        })
        .slice(0, 5)
        .forEach(function (r) {
          html += dxRow(esc(pn(r)), 'mais perdido', usd0(Math.abs(porP[r])));
        });
      html += '</div></section>';
    }
    out.perdasC = html;
    html = '';
    // curva abc
    var ab2 = curvaAbc();
    if (ab2.lista.length || ab2.sem.length) {
      var nA = ab2.lista.filter(function (m) {
          return m.abc === 'A';
        }),
        nB = ab2.lista.filter(function (m) {
          return m.abc === 'B';
        }).length,
        nC = ab2.lista.filter(function (m) {
          return m.abc === 'C';
        }).length;
      html +=
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Curva ABC (90 dias)</h2><div class="hint" style="margin:2px 0 0">A: produtos que dão 80% do lucro · B: próximos 15% · C: o resto.</div></div><div class="split">' +
        dxRow('A', 'dão 80% do lucro', nA.length + ' produto(s)') +
        dxRow('B', 'próximos 15%', nB + ' produto(s)') +
        dxRow('C', 'últimos 5%', nC + ' produto(s)') +
        dxRow('Sem venda', 'têm estoque e não venderam em 90 dias', ab2.sem.length + ' produto(s)') +
        '</div>';
      if (nA.length) {
        html += '<div class="hint" style="margin:0">Campeões: ';
        html += nA
          .slice(0, 5)
          .map(function (m) {
            return esc(pn(m.ref)) + ' (' + u0(m.profit90) + ')';
          })
          .join(', ');
        html += '.</div>';
      }
      html += '</section>';
    }
    out.abc = html;
    return out;
  }
  // ===== Contas em várias moedas, vencimentos e avisos. =====
  // Moeda de uma despesa: pyg (padrão), usd ou brl.
  function expMoeda(e) {
    return e.moeda === 'usd' || e.moeda === 'brl' ? e.moeda : 'pyg';
  }
  // Valor da despesa na moeda original.
  function expOrig(e) {
    var m = expMoeda(e);
    if (m === 'pyg') return e.valor;
    return e.orig > 0 ? e.orig : e.valor / ratePyg(m);
  }
  // Atualiza o valor em guaranis das contas em moeda estrangeira, pelo câmbio de hoje.
  function syncExpFx() {
    S.exp.forEach(function (e) {
      var m = expMoeda(e);
      if (m !== 'pyg' && e.orig > 0) e.valor = Math.round(e.orig * ratePyg(m));
    });
  }
  // Texto do valor na moeda original ("US$ 120,00") e, se estrangeira, o equivalente em guaranis.
  function expTexto(e) {
    var m = expMoeda(e);
    return m === 'pyg' ? gs(e.valor) : fmtM(expOrig(e), m) + ' (' + gs(e.valor) + ')';
  }
  // Quanto as contas em moeda estrangeira mudaram só pelo câmbio desde que o valor foi informado.
  function efeitoCambio() {
    return Math.round(
      S.exp.reduce(function (a, e) {
        var m = expMoeda(e);
        if (m === 'pyg' || !(e.rate0 > 0)) return a;
        return a + expOrig(e) * (ratePyg(m) - e.rate0);
      }, 0)
    );
  }
  // Parte das contas em moeda estrangeira (em guaranis).
  function contasEstrangeiras() {
    return S.exp.reduce(function (a, e) {
      return a + (expMoeda(e) !== 'pyg' ? e.valor : 0);
    }, 0);
  }
  // Reserva extra por mês contra alta do câmbio nas contas em moeda estrangeira (usa o colchão cambial).
  function reservaCambioContas() {
    var f = contasEstrangeiras();
    return f > 0 ? Math.round(f * colchao().pct) : 0;
  }

  // Meio-dia de hoje (evita problemas de horário de verão ao somar dias).
  function hoje0() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12).getTime();
  }
  // Data de vencimento da despesa no mês (ano, mês 0-11); o dia é limitado ao último do mês.
  function vencEm(e, ano, mes) {
    var ult = new Date(ano, mes + 1, 0).getDate();
    return new Date(ano, mes, Math.min(Number(e.dia), ult), 12).getTime();
  }
  // Próximo vencimento: este mês se ainda não foi paga, senão o do mês seguinte.
  function proxVenc(e) {
    if (!(e.dia >= 1 && e.dia <= 31)) return null;
    var d = new Date(),
      pago = !!(e.paid && e.paid[ymNow()]),
      ts = pago ? vencEm(e, d.getFullYear(), d.getMonth() + 1) : vencEm(e, d.getFullYear(), d.getMonth());
    return { ts: ts, dias: Math.round((ts - hoje0()) / DAY), pago: pago };
  }
  // Contas que vencem em breve (ou já venceram) e ainda não foram pagas neste mês.
  function avisosVenc(janela) {
    var out = [];
    S.exp.forEach(function (e) {
      var v = proxVenc(e);
      if (!v || v.pago || v.dias > (janela || 7)) return;
      var m = expMoeda(e),
        need = expOrig(e),
        tem = m === 'pyg' ? S.cash.pyg : S.cash[m] || 0,
        ok = tem >= need - 1e-9,
        dica = '';
      if (!ok) {
        var faltaGs = (need - tem) * ratePyg(m),
          outras = ['pyg', 'usd', 'brl'].filter(function (x) {
            return x !== m && (S.cash[x] || 0) * ratePyg(x) >= faltaGs;
          })[0];
        dica = outras
          ? 'Falta ' + fmtM(need - tem, m) + ' em ' + m.toUpperCase() + '. Troque ' + fmtM(faltaGs / ratePyg(outras), outras) + ' por ' + m.toUpperCase() + ' na aba Caixa.'
          : 'Falta ' + fmtM(need - tem, m) + ' em ' + m.toUpperCase() + ' e o caixa não cobre nem trocando moedas.';
      }
      out.push({
        e: e,
        dias: v.dias,
        moeda: m,
        ok: ok,
        dica: dica,
        semValor: e.tipo === 'variavel' && e.updYm !== ymNow() && v.dias <= 7
      });
    });
    return out.sort(function (a, b) {
      return a.dias - b.dias;
    });
  }
  // Frase do prazo ("vence hoje", "venceu há 2 dias", "vence em 3 dias").
  function prazoTxt(d) {
    return d === 0
      ? 'vence hoje'
      : d < 0
      ? 'venceu há ' + -d + (d === -1 ? ' dia' : ' dias')
      : d === 1
      ? 'vence amanhã'
      : 'vence em ' + d + ' dias';
  }
  // Cartão de avisos de vencimento (vazio se não houver nada).
  function avisosHtml() {
    var av = avisosVenc(7);
    if (!av.length) return '';
    var h =
      '<section class="card col"><h2 style="margin:0;font-size:16px">Contas para pagar</h2><div class="split">';
    av.forEach(function (a) {
      var cor = a.dias < 0 ? 'var(--bad)' : a.dias <= 2 ? 'var(--warn)' : 'var(--sub)';
      h += dxRow(
        esc(a.e.nome),
        '<span style="color:' +
          cor +
          '">' +
          prazoTxt(a.dias) +
          '</span>' +
          (a.semValor ? ' · informe o valor desta fatura' : '') +
          (a.ok ? '' : ' · ' + esc(a.dica)),
        expTexto(a.e)
      );
    });
    return h + '</div></section>';
  }
  // ===== Finanças: resultado do mês, fluxo de caixa, retirada do dono, conferência de caixa, capital parado, dólar e preço perigoso. =====
  S.retiradas = []; // retiradas do dono: {ts, moeda, orig, valor, nota}
  S.confCx = []; // conferências do caixa: {ts, difs:{pyg,usd,brl}, ajustou}
  S.ccLemb = true; // lembrete semanal de conferir o caixa
  S.fluxoD = 30;
  var MESES_L = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var GRUPO_LOJA = { loja: 1, profissional: 1 },
    GRUPO_PESSOAL = { pessoal: 1, casa: 1 };

  // Guarda ou compartilha um arquivo de texto: no app usa o compartilhar do celular; no navegador baixa.
  function salvarArquivo(nome, txt, mime, feito, falha) {
    function plano() {
      try {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([txt], { type: mime }));
        a.download = nome;
        document.body.appendChild(a);
        a.click();
        a.remove();
        feito();
      } catch (e) {
        falha();
      }
    }
    var P = window.Capacitor && window.Capacitor.Plugins;
    if (P && P.Filesystem && P.Share) {
      P.Filesystem.writeFile({ path: nome, data: txt, directory: 'CACHE', encoding: 'utf8' })
        .then(function (r) {
          return P.Share.share({ title: nome, url: r.uri, dialogTitle: 'Guardar o arquivo' });
        })
        .then(feito)
        .catch(plano);
    } else plano();
  }

  // ---------- resultado do mês
  function limitesMes(ano, mes) {
    return [new Date(ano, mes, 1).getTime(), new Date(ano, mes + 1, 1).getTime()];
  }
  function noMes(ts, lim) {
    return ts >= lim[0] && ts < lim[1];
  }
  function somaCampo(lista, k, lim, filtro) {
    return lista.reduce(function (a, x) {
      return a + (noMes(x.ts, lim) && (!filtro || filtro(x)) ? x[k] || 0 : 0);
    }, 0);
  }
  // Resultado de um mês (mes de 0 a 11): vendas, custos, resultado da loja, retiradas e sobra.
  function resultadoMes(ano, mes) {
    var lim = limitesMes(ano, mes),
      vs = S.sales.filter(function (s) {
        return !s.estorno && noMes(s.ts, lim);
      }),
      r = { ano: ano, mes: mes };
    r.n = vs.length;
    r.pecas = sumBy(vs, 'qty');
    r.vendas = sumBy(vs, 'price');
    r.cmv = sumBy(vs, 'rep');
    r.taxas = vs.reduce(function (a, s) {
      return a + (s.taxa || 0);
    }, 0);
    r.lucroLivre = sumBy(vs, 'livre');
    var pg = S.cpay || [];
    r.contasLoja = somaCampo(pg, 'valor', lim, function (x) {
      return GRUPO_LOJA[x.cat];
    });
    r.contasPessoais = somaCampo(pg, 'valor', lim, function (x) {
      return GRUPO_PESSOAL[x.cat];
    });
    r.imprev = somaCampo(S.imprev, 'valor', lim);
    r.melh = somaCampo(S.melhUso, 'valor', lim);
    var perd = 0;
    (S.contagens || []).forEach(function (c) {
      if (!noMes(c.ts, lim)) return;
      (c.itens || []).forEach(function (it) {
        if (it.usd < 0) perd += -it.usd * S.fx.pyg;
      });
    });
    perd += somaCampo(S.descartes, 'valor', lim);
    r.perdas = Math.round(perd);
    r.retAvulsas = somaCampo(S.retiradas, 'valor', lim);
    r.retTotal = r.retAvulsas + r.contasPessoais;
    r.resultado = r.vendas - r.cmv - r.taxas - r.contasLoja - r.imprev - r.melh - r.perdas;
    r.sobra = r.resultado - r.retTotal;
    r.tem = r.n > 0 || r.contasLoja > 0 || r.retTotal > 0 || r.imprev > 0;
    return r;
  }
  var LINHAS_RES = [
    ['Vendas', 'vendas'],
    ['Custo de repor a mercadoria vendida', 'cmv'],
    ['Taxas de maquininha', 'taxas'],
    ['Contas da loja pagas', 'contasLoja'],
    ['Imprevistos', 'imprev'],
    ['Caixa de melhorias usada', 'melh'],
    ['Perdas de estoque (contagem e descarte)', 'perdas'],
    ['Resultado da loja', 'resultado', true],
    ['Retiradas do dono (inclui contas de casa e pessoais)', 'retTotal'],
    ['Sobra do mês', 'sobra', true]
  ];
  // Variação em texto: "+12%" ou "−5%".
  function varTxt(a, b) {
    if (!b) return '';
    var v = (a - b) / Math.abs(b);
    return ' (' + (v >= 0 ? '+' : '−') + Math.round(Math.abs(v) * 100) + '%)';
  }
  // Meses de comparação: atual, anterior e mesmo mês do ano passado.
  function resultadoComparado(ano, mes) {
    var pa = mes === 0 ? ano - 1 : ano,
      pm = mes === 0 ? 11 : mes - 1;
    return {
      a: resultadoMes(ano, mes),
      p: resultadoMes(pa, pm),
      y: resultadoMes(ano - 1, mes)
    };
  }
  function resultadoHtml() {
    var d = new Date(),
      c = resultadoComparado(d.getFullYear(), d.getMonth()),
      h =
        '<section class="card col"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><div><h2 style="margin:0;font-size:16px">Resultado de ' +
        MESES_L[d.getMonth()] +
        '</h2><div class="hint" style="margin:2px 0 0">Compara com ' +
        MESES_L[c.p.mes] +
        ' e com ' +
        MESES_L[c.y.mes] +
        ' de ' +
        c.y.ano +
        '.</div></div><button class="mini" data-act="resexp">Exportar</button></div><div class="split">';
    LINHAS_RES.forEach(function (l) {
      var k = l[1],
        ap =
          'mês passado ' +
          (c.p.tem ? gs(c.p[k]) + varTxt(c.a[k], c.p[k]) : 'sem dados') +
          ' · ' +
          MESES_L[c.y.mes].slice(0, 3) +
          '/' +
          String(c.y.ano).slice(2) +
          ' ' +
          (c.y.tem ? gs(c.y[k]) + varTxt(c.a[k], c.y[k]) : 'sem dados');
      h += l[2]
        ? '<div class="sl" style="border-top:1px solid var(--line);padding-top:10px"><span><b>' +
          l[0] +
          '</b><small>' +
          ap +
          '</small></span><b style="color:' +
          (c.a[k] >= 0 ? 'var(--ok)' : 'var(--bad)') +
          '">' +
          gs(c.a[k]) +
          '</b></div>'
        : dxRow(l[0], ap, gs(c.a[k]));
    });
    return h + '</div></section>';
  }
  // Texto CSV do resultado do mês e das vendas do mês.
  function resultadoCsv() {
    var d = new Date(),
      c = resultadoComparado(d.getFullYear(), d.getMonth()),
      q = function (v) {
        return '"' + String(v).replace(/"/g, '""') + '"';
      },
      out = [
        ['Linha', 'Este mês', 'Mês passado', 'Mesmo mês ano passado'].map(q).join(';')
      ];
    LINHAS_RES.forEach(function (l) {
      out.push([q(l[0]), c.a[l[1]], c.p[l[1]], c.y[l[1]]].join(';'));
    });
    out.push('');
    out.push(['Venda', 'Data', 'Produto', 'Peças', 'Preço G$', 'Pagamento', 'Taxa G$', 'Lucro livre G$'].map(q).join(';'));
    var lim = limitesMes(d.getFullYear(), d.getMonth());
    S.sales
      .filter(function (s) {
        return !s.estorno && noMes(s.ts, lim);
      })
      .forEach(function (s) {
        out.push(
          [
            q(s.id),
            q(new Date(s.ts).toLocaleDateString('pt-BR')),
            q(descOf(s)),
            s.qty,
            s.price,
            q(s.forma || 'din'),
            s.taxa || 0,
            s.livre
          ].join(';')
        );
      });
    return '﻿' + out.join('\r\n');
  }

  // ---------- fluxo de caixa projetado
  // Contas ainda não pagas que vencem nos próximos "dias" (cada uma na sua moeda).
  function contasNoPeriodo(dias) {
    var ini = hoje0(),
      fim = ini + dias * DAY,
      d = new Date(),
      out = [];
    S.exp.forEach(function (e) {
      if (e.cat === 'imprev') return;
      for (var i = 0; i < 5; i++) {
        var ano = d.getFullYear(),
          mes = d.getMonth() + i,
          ym = new Date(ano, mes, 1),
          k = ym.getFullYear() + '-' + ('0' + (ym.getMonth() + 1)).slice(-2),
          ts = vencEm({ dia: e.dia >= 1 ? e.dia : 31 }, ym.getFullYear(), ym.getMonth());
        if (e.paid && e.paid[k]) continue;
        if (i === 0 && ts < ini) ts = ini;
        if (ts <= fim && ts >= ini)
          out.push({ nome: e.nome, ts: ts, moeda: expMoeda(e), orig: expOrig(e), gs: e.valor, semDia: !(e.dia >= 1) });
      }
    });
    return out.sort(function (a, b) {
      return a.ts - b.ts;
    });
  }
  // Projeção do caixa para 30, 60 ou 90 dias, mantendo o ritmo de vendas dos últimos 30 dias.
  function fluxoCaixa(dias) {
    var now = Date.now(),
      first = S.sales.reduce(function (a, s) {
        return Math.min(a, s.ts);
      }, now),
      base = Math.max(7, Math.min(30, (now - Math.min(first, S.appStart || now)) / DAY)),
      v30 = S.sales.filter(function (s) {
        return !s.estorno && now - s.ts <= 30 * DAY;
      }),
      porDia = sumBy(v30, 'price') / base,
      entra = Math.round(porDia * dias),
      fracRep = sumBy(v30, 'price') > 0 ? sumBy(v30, 'rep') / sumBy(v30, 'price') : 0,
      repGs = Math.round(entra * fracRep),
      contas = contasNoPeriodo(dias),
      contasGs = contas.reduce(function (a, x) {
        return a + x.gs;
      }, 0),
      wal = Math.round(walletGs()),
      pm = { pyg: { need: 0 }, usd: { need: 0 }, brl: { need: 0 } };
    contas.forEach(function (x) {
      pm[x.moeda].need += x.orig;
    });
    ['pyg', 'usd', 'brl'].forEach(function (m) {
      pm[m].tem = S.cash[m] || 0;
    });
    return {
      dias: dias,
      porDia: Math.round(porDia),
      entra: entra,
      repGs: repGs,
      contas: contas,
      contasGs: contasGs,
      wal: wal,
      saldo: wal + entra - repGs - contasGs,
      semVender: wal - contasGs,
      pm: pm,
      base: Math.round(base)
    };
  }
  function fluxoHtml() {
    var dd = S.fluxoD || 30,
      f = fluxoCaixa(dd),
      h =
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Fluxo de caixa projetado</h2><div class="hint" style="margin:2px 0 0">Se o ritmo de vendas dos últimos ' +
        f.base +
        ' dias continuar (' +
        gs(f.porDia) +
        ' por dia).</div></div><div class="tabs" role="group" aria-label="Horizonte">' +
        [30, 60, 90]
          .map(function (n) {
            return (
              '<button class="tab' +
              (dd === n ? ' on' : '') +
              '" data-act="fluxod" data-id="' +
              n +
              '" aria-pressed="' +
              (dd === n) +
              '">' +
              n +
              ' dias</button>'
            );
          })
          .join('') +
        '</div><div class="split">';
    h += dxRow('Dinheiro hoje', 'carteira toda somada', gs(f.wal));
    h += dxRow('Entra das vendas', 'estimativa', '+' + gs(f.entra));
    h += dxRow('Sai para repor mercadoria', 'parte das vendas que volta ao estoque', '−' + gs(f.repGs));
    h += dxRow(
      'Sai em contas',
      f.contas.length + ' pagamento(s) até o dia ' + fd(hoje0() + dd * DAY),
      '−' + gs(f.contasGs)
    );
    h +=
      '<div class="sl" style="border-top:1px solid var(--line);padding-top:10px"><span><b>Saldo projetado em ' +
      dd +
      ' dias</b><small>sem vender nada: ' +
      gs(f.semVender) +
      '</small></span><b style="color:' +
      (f.saldo >= 0 ? 'var(--ok)' : 'var(--bad)') +
      '">' +
      gs(f.saldo) +
      '</b></div></div>';
    var falta = ['pyg', 'usd', 'brl'].filter(function (m) {
      return f.pm[m].need > f.pm[m].tem + 1e-9;
    });
    if (falta.length)
      h +=
        '<div class="note n-warn">' +
        falta
          .map(function (m) {
            return (
              'Contas em ' +
              m.toUpperCase() +
              ': precisa de ' +
              fmtM0(f.pm[m].need, m) +
              ' e tem ' +
              fmtM0(f.pm[m].tem, m) +
              '. Troque moeda na aba Caixa antes de vencer.'
            );
          })
          .join(' ') +
        '</div>';
    if (f.contas.length) {
      h += '<div class="split">';
      f.contas.slice(0, 6).forEach(function (x) {
        h += dxRow(
          esc(x.nome),
          (x.semDia ? 'sem dia definido (fim do mês)' : 'dia ' + fd(x.ts)),
          fmtM0(x.orig, x.moeda)
        );
      });
      h += '</div>';
    }
    return h + '</section>';
  }

  // ---------- retirada do dono e conferência do caixa
  function lucroLivreMes() {
    var d = new Date();
    return resultadoMes(d.getFullYear(), d.getMonth());
  }
  function retiradaHtml() {
    var r = lucroLivreMes(),
      h =
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Retirada do dono</h2><div class="hint" style="margin:2px 0 0">Dinheiro que você tira da loja para você. Sai do caixa na moeda escolhida.</div></div>';
    var pct = r.lucroLivre > 0 ? r.retTotal / r.lucroLivre : r.retTotal > 0 ? 9 : 0;
    h +=
      '<div class="note ' +
      (pct > 1 ? 'n-bad' : pct > 0.8 ? 'n-warn' : 'n-ok') +
      '">Neste mês: lucro livre <b>' +
      gs(r.lucroLivre) +
      '</b> · retiradas <b>' +
      gs(r.retTotal) +
      '</b> (inclui contas pessoais e de casa pagas)' +
      (pct > 1
        ? '. Você retirou mais do que a loja lucrou: o excedente saiu do dinheiro da reposição e das contas.'
        : '.') +
      '</div>';
    h +=
      '<div class="sel" style="flex-wrap:wrap"><select class="in" id="rtM" aria-label="Moeda da retirada" style="flex:1 1 90px;width:auto">' + opcoesMoeda() + '</select><input class="in" id="rtV" inputmode="decimal" placeholder="Valor" style="flex:1 1 110px;width:auto" aria-label="Valor da retirada"><input class="in" id="rtN" placeholder="Para quê (opcional)" style="flex:2 1 150px;width:auto" aria-label="Motivo da retirada"><button class="mini" data-act="rtgo">Retirar</button></div><div class="hint" id="rtH" role="status" style="margin:0">' +
      esc(S.rtMsg || '') +
      '</div>';
    S.retiradas.slice(0, 5).forEach(function (x) {
      h +=
        '<div class="sl"><span>' +
        esc(x.nota || 'Retirada') +
        '<small>' +
        fd(x.ts) +
        ' às ' +
        fh(x.ts) +
        ' · <a href="#" data-act="rtdes" data-id="' +
        x.ts +
        '" style="color:var(--accent-fg)">desfazer</a></small></span><b>' +
        fmtM(x.orig, x.moeda) +
        '</b></div>';
    });
    return h + '</section>';
  }
  // Dias desde a última conferência do caixa (Infinity se nunca).
  function ccDias() {
    var u = S.confCx.length ? S.confCx[S.confCx.length - 1].ts : 0;
    return u ? Math.floor((Date.now() - u) / DAY) : Infinity;
  }
  function ccHtml() {
    var dias = ccDias(),
      h =
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Conferir o caixa</h2><div class="hint" style="margin:2px 0 0">Conte o dinheiro que você tem e compare com o que o app calcula.' +
        (dias === Infinity ? ' Ainda não conferiu.' : ' Última conferência há ' + dias + ' dia(s).') +
        '</div></div>';
    if (!S.ccOpen) {
      return h + '<button class="mini" data-act="ccabrir">Conferir caixa</button></section>';
    }
    h += '<div class="sel" style="flex-wrap:wrap">';
    [
      ['ccP', 'Guaranis', 'pyg'],
      ['ccU', 'Dólares', 'usd'],
      ['ccB', 'Reais', 'brl']
    ].forEach(function (x) {
      h +=
        '<div style="flex:1 1 120px"><div class="lbl">' +
        x[1] +
        ' (app: ' +
        fmtM(S.cash[x[2]], x[2]) +
        ')</div><input class="in" id="' +
        x[0] +
        '" inputmode="decimal" value="' +
        (S.ccV && S.ccV[x[0]] != null ? S.ccV[x[0]] : inVal(S.cash[x[2]], x[2])) +
        '" aria-label="' +
        x[1] +
        ' contados"></div>';
    });
    h += '</div>';
    if (S.ccRes)
      h +=
        '<div class="note ' +
        (S.ccRes.ok ? 'n-ok' : 'n-warn') +
        '" role="status">' +
        esc(S.ccRes.txt) +
        '</div>';
    h += '<div class="sel" style="flex-wrap:wrap"><button class="mini" data-act="ccgo">Conferir</button>';
    if (S.ccRes && !S.ccRes.ok)
      h += '<button class="chip" data-act="ccadj">Ajustar o saldo do app para o que contei</button>';
    return h + '<button class="chip" data-act="ccfechar">Fechar</button></div></section>';
  }
  // Aviso de lembrete da conferência semanal (vazio se não precisa).
  function ccLembrete() {
    if (S.ccLemb === false) return '';
    var d = ccDias();
    if (d < 7) return '';
    return (
      '<div class="note n-warn">' +
      (d === Infinity ? 'Você ainda não conferiu o caixa.' : 'Faz ' + d + ' dias que você não confere o caixa.') +
      ' <a href="#caixa" data-act="view" data-id="caixa" style="color:var(--accent-fg)">Conferir agora</a></div>'
    );
  }

  // ---------- capital parado e retorno do estoque
  function capitalEstoque() {
    var st = prodStats().filter(function (m) {
        return m.stock > 0 && !isSimple(m.tipo);
      }),
      now = Date.now(),
      total = 0,
      parado = 0;
    st.forEach(function (m) {
      total += m.costUsd;
      if ((now - (m.last || S.appStart || now)) / DAY >= 60) parado += m.costUsd;
    });
    var lucro30 = S.sales
      .filter(function (s) {
        return !s.estorno && now - s.ts <= 30 * DAY;
      })
      .reduce(function (a, s) {
        return a + lucroUsd(s);
      }, 0);
    return {
      total: total,
      parado: parado,
      pct: total > 0 ? parado / total : 0,
      lucro30: lucro30,
      retorno: total > 0 ? lucro30 / total : 0
    };
  }
  function capitalHtml() {
    var c = capitalEstoque();
    if (!(c.total > 0)) return '';
    var u = function (n) {
      return 'US$ ' + n.toFixed(2).replace('.', ',');
    };
    return (
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Dinheiro no estoque</h2><div class="hint" style="margin:2px 0 0">Quanto do que você investiu está parado e quanto o estoque rende.</div></div><div class="split">' +
      dxRow('Investido em estoque', 'a custo, sem estojos e brindes', u(c.total)) +
      dxRow(
        'Parado há 60 dias ou mais',
        Math.round(c.pct * 100) + '% do investido',
        '<span style="color:' + (c.pct > 0.3 ? 'var(--warn)' : 'inherit') + '">' + u(c.parado) + '</span>'
      ) +
      dxRow(
        'Retorno do estoque (30 dias)',
        'cada US$ 1 investido rendeu ' + u(c.retorno) + ' de lucro livre',
        pc(c.retorno)
      ) +
      '</div></section>'
    );
  }

  // ---------- dólar favorável para comprar
  function dolarFavoravel() {
    var from = Date.now() - S.janela * DAY,
      h = S.fxHist.filter(function (p) {
        return p.ts >= from;
      });
    if (h.length < 5) return null;
    var vals = h.map(function (p) {
        return p.pyg;
      }),
      min = Math.min.apply(null, vals),
      max = Math.max.apply(null, vals),
      med =
        vals.reduce(function (a, b) {
          return a + b;
        }, 0) / vals.length,
      hj = S.fx.pyg,
      pos = max > min ? (hj - min) / (max - min) : 0.5;
    return {
      hoje: hj,
      min: min,
      max: max,
      media: Math.round(med),
      pos: pos,
      barato: pos <= 0.2 || hj <= med * 0.98,
      caro: pos >= 0.85 && hj >= med * 1.03,
      repUsd: reservas().rUSD
    };
  }
  function dolarHtml() {
    var d = dolarFavoravel();
    if (!d || (!d.barato && !d.caro)) return '';
    var dif = Math.round(Math.abs(d.hoje / d.media - 1) * 100);
    return d.barato
      ? '<div class="note n-ok">Dólar favorável para comprar: G$ ' +
          dots(d.hoje) +
          ' hoje, ' +
          dif +
          '% abaixo da média de ' +
          S.janela +
          ' dias (G$ ' +
          dots(d.media) +
          ', mínimo G$ ' +
          dots(d.min) +
          '). Você tem US$ ' +
          Math.round(d.repUsd) +
          ' separados para reposição; se precisar comprar dólar, é um bom momento.</div>'
      : '<div class="note n-warn">Dólar caro hoje: G$ ' +
          dots(d.hoje) +
          ', ' +
          dif +
          '% acima da média de ' +
          S.janela +
          ' dias (G$ ' +
          dots(d.media) +
          '). Se puder, adie a compra de dólar.</div>';
  }

  // ---------- preço que ficou perigoso
  // Produtos cujo preço de tabela não cobre mais o custo, as contas e o colchão com o câmbio de hoje.
  function precoPerigoso() {
    return abaixoDoPiso().filter(function (m) {
      return m.pp.lista < m.pp.trava + m.pp.colch;
    });
  }
  function perigosoHtml() {
    var l = precoPerigoso().slice(0, 6);
    if (!l.length) return '';
    var h =
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Preço ficou perigoso</h2><div class="hint" style="margin:2px 0 0">O preço de tabela já não cobre custo, contas e o colchão com o câmbio de hoje. Sugestão: subir para o piso da faixa.</div></div><div class="split">';
    l.forEach(function (m) {
      var f = faixaOf(m.ref),
        novo = m.pp.piso;
      h += dxRow(
        dxNome(m),
        'tabela ' + gs(m.pp.lista) + ' → sugerido ' + gs(novo) + (f ? '' : ' · defina uma faixa para ajustar por aqui'),
        f
          ? '<button class="mini" data-act="precoap" data-id="' +
              esc(m.key) +
              '">Aplicar</button>'
          : ''
      );
    });
    return h + '</div><div class="hint" style="margin:0">Aplicar muda o preço desse tipo para todos os produtos da mesma faixa.</div></section>';
  }

  // ---------- blocos do Dashboard (fora dos blocos de análise de produto)
  function dashFin() {
    return (
      ccLembrete() + dolarHtml() + backupLembrete() + resultadoHtml() + fluxoHtml() + capitalHtml() + perigosoHtml()
    );
  }
  // ===== Forma de pagamento da venda e taxas (maquininha, Pix). =====
  // Taxa em % sobre o valor recebido. Dinheiro e Pix não têm taxa; ajuste a maquininha em Ajustes.
  S.formas = [
    { id: 'din', nome: 'Dinheiro', taxa: 0 },
    { id: 'pix', nome: 'Pix', taxa: 0 },
    { id: 'deb', nome: 'Maquininha débito', taxa: 2 },
    { id: 'cre', nome: 'Maquininha crédito', taxa: 4 }
  ];
  S.forma = 'din';
  // Forma de pagamento escolhida na venda.
  function formaSel() {
    return (
      S.formas.filter(function (f) {
        return f.id === S.forma;
      })[0] || S.formas[0]
    );
  }
  // Forma pelo id (para vendas antigas sem forma: dinheiro).
  function formaPorId(id) {
    return (
      S.formas.filter(function (f) {
        return f.id === id;
      })[0] || { id: 'din', nome: 'Dinheiro', taxa: 0 }
    );
  }
  // Taxa em guaranis sobre o valor recebido (já em guaranis).
  function taxaGs(effGs, f) {
    f = f || formaSel();
    return f && f.taxa > 0 ? Math.round((effGs * f.taxa) / 100) : 0;
  }
  // Taxa na moeda em que o cliente pagou.
  function taxaMoeda(recebido, moeda, f) {
    var t = f && f.taxa > 0 ? (recebido * f.taxa) / 100 : 0;
    return moeda === 'pyg' ? Math.round(t) : Math.round(t * 100) / 100;
  }
  // Botões de forma de pagamento na tela de venda.
  function renderForma() {
    var box = $('formaChips');
    if (!box) return;
    box.textContent = '';
    var cur = formaSel();
    S.formas.forEach(function (f) {
      box.appendChild(
        btn(
          'chip' + (cur.id === f.id ? ' on' : ''),
          f.nome + (f.taxa > 0 ? ' · ' + String(f.taxa).replace('.', ',') + '%' : ''),
          function () {
            S.forma = f.id;
            render();
          },
          cur.id === f.id
        )
      );
    });
  }
  // ===== Segurança (PIN e biometria ao abrir) e cópias automáticas dos dados. =====
  S.pinHash = '';
  S.pinSalt = '';
  S.bioOn = false;
  S.lockMin = 5; // minutos fora do app antes de pedir de novo
  S.lockSens = true; // pedir também em ações sensíveis (restaurar, apagar tudo, retirada)
  var LOCK = { locked: false, modo: 'open', cb: null, tent: 0, bloq: 0, saiuEm: 0 };

  function pinAtivo() {
    return !!S.pinHash;
  }
  // Resumo do PIN com sal (SHA-256 quando o aparelho permite, senão um resumo simples).
  function hashPin(pin, salt) {
    var txt = 'lafouch|' + salt + '|' + pin;
    function simples() {
      var h = 5381,
        i;
      for (i = 0; i < txt.length; i++) h = ((h << 5) + h + txt.charCodeAt(i)) | 0;
      return 's' + (h >>> 0).toString(16);
    }
    try {
      if (window.crypto && window.crypto.subtle && window.TextEncoder)
        return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt)).then(function (b) {
          return Array.prototype.map
            .call(new Uint8Array(b), function (x) {
              return ('0' + x.toString(16)).slice(-2);
            })
            .join('');
        });
    } catch (e) {}
    return Promise.resolve(simples());
  }
  function novoSal() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  // ---------- biometria (plugin do Capacitor, só no app instalado)
  function bioPlugin() {
    var C = window.Capacitor,
      P = C && C.Plugins;
    if (P && P.BiometricAuth) return P.BiometricAuth;
    // sem o pacote do plugin no site, o Capacitor ainda liga o plugin nativo pelo nome
    try {
      if (C && C.registerPlugin && (!C.isPluginAvailable || C.isPluginAvailable('BiometricAuth')))
        return (bioPlugin._p = bioPlugin._p || C.registerPlugin('BiometricAuth'));
    } catch (e) {}
    return null;
  }
  function bioErro(e) {
    var m = e && (e.message || e.code);
    return m ? ' (' + String(m).slice(0, 80) + ')' : '';
  }
  // Pergunta ao aparelho se há digital ou rosto cadastrados (resultado guardado em S._bioOk).
  function bioChecar() {
    var b = bioPlugin();
    if (!b || !b.checkBiometry) {
      S._bioOk = false;
      return;
    }
    b.checkBiometry()
      .then(function (r) {
        S._bioOk = !!(r && r.isAvailable);
        S._bioWhy = r && !r.isAvailable ? r.reason || r.code || '' : '';
        renderAjustes();
      })
      .catch(function () {
        S._bioOk = false;
      });
  }
  function bioPedir(ok, falha) {
    var b = bioPlugin();
    if (!b) return falha();
    b.authenticate({
      reason: 'Abrir o La Fouch',
      cancelTitle: 'Usar o PIN',
      allowDeviceCredential: false,
      androidTitle: 'La Fouch',
      androidSubtitle: 'Confirme que é você'
    })
      .then(ok)
      .catch(function (e) {
        falha(e);
      });
  }

  // ---------- tela de bloqueio
  function lockMsg(t) {
    $('lockM').textContent = t || '';
  }
  function liberar() {
    LOCK.locked = false;
    LOCK.tent = 0;
    var ls = $('lockScr');
    if (REDUCED) ls.hidden = true;
    else {
      ls.classList.add('sai');
      setTimeout(function () {
        ls.hidden = true;
        ls.classList.remove('sai');
      }, 220);
    }
    $('lockPin').value = '';
    lockMsg('');
    var cb = LOCK.cb;
    LOCK.cb = null;
    if (cb) cb();
  }
  function mostrarLock(modo, cb) {
    LOCK.locked = true;
    LOCK.modo = modo;
    LOCK.cb = cb || null;
    $('lockScr').hidden = false;
    $('lockT').textContent = modo === 'open' ? 'La Fouch' : 'Confirme que é você';
    $('lockPin').value = '';
    lockMsg(modo === 'open' ? 'Digite o PIN para abrir.' : 'Digite o PIN para continuar.');
    $('lockCancel').hidden = modo === 'open';
    var bo = !!(S.bioOn && bioPlugin());
    $('lockBio').hidden = !bo;
    if (bo)
      bioPedir(liberar, function (e) {
        lockMsg('Não reconheceu. Use o PIN.' + bioErro(e));
      });
    else
      setTimeout(function () {
        try {
          $('lockPin').focus();
        } catch (e) {}
      }, 50);
  }
  function tentarPin() {
    if (Date.now() < LOCK.bloq) {
      lockMsg('Muitas tentativas. Espere ' + Math.ceil((LOCK.bloq - Date.now()) / 1000) + ' segundos.');
      return;
    }
    hashPin($('lockPin').value, S.pinSalt).then(function (h) {
      if (h === S.pinHash) return liberar();
      LOCK.tent++;
      $('lockPin').value = '';
      if (LOCK.tent >= 5) {
        LOCK.tent = 0;
        LOCK.bloq = Date.now() + 30000;
        lockMsg('Muitas tentativas. Espere 30 segundos.');
      } else lockMsg('PIN incorreto. Restam ' + (5 - LOCK.tent) + ' tentativa(s).');
    });
  }
  $('lockGo').onclick = tentarPin;
  $('lockPin').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') tentarPin();
  });
  $('lockBio').onclick = function () {
    bioPedir(liberar, function (e) {
      lockMsg('Não reconheceu. Use o PIN.' + bioErro(e));
    });
  };
  $('lockCancel').onclick = function () {
    LOCK.locked = false;
    LOCK.cb = null;
    $('lockScr').hidden = true;
  };
  // Ao abrir o app: pede o PIN se estiver ativo.
  function iniciarLock() {
    if (pinAtivo()) mostrarLock('open');
  }
  // Pede o PIN antes de uma ação sensível (se o PIN estiver ativo e a opção ligada).
  function exigirAuth(fn) {
    if (!pinAtivo() || S.lockSens === false) return fn();
    mostrarLock('confirm', fn);
  }
  document.addEventListener('visibilitychange', function () {
    if (!pinAtivo()) return;
    if (document.hidden) {
      if (!LOCK.locked) LOCK.saiuEm = Date.now();
      return;
    }
    var fora = LOCK.saiuEm ? Date.now() - LOCK.saiuEm : 0;
    if (!LOCK.locked && LOCK.saiuEm && fora >= Math.max(15000, (S.lockMin || 0) * 60000)) mostrarLock('open');
    autoBackup();
  });

  // ---------- cópias automáticas (uma por dia, guardadas no próprio app)
  var AB_DB = 'lafouch_bk',
    AB_MAX = 7;
  function abAbrir() {
    return new Promise(function (ok, no) {
      try {
        var r = indexedDB.open(AB_DB, 1);
        r.onupgradeneeded = function () {
          r.result.createObjectStore('c', { keyPath: 'dia' });
        };
        r.onsuccess = function () {
          ok(r.result);
        };
        r.onerror = function () {
          no(r.error);
        };
      } catch (e) {
        no(e);
      }
    });
  }
  function abTodas() {
    return abAbrir().then(function (db) {
      return new Promise(function (ok, no) {
        var q = db.transaction('c').objectStore('c').getAll();
        q.onsuccess = function () {
          ok(
            (q.result || []).sort(function (a, b) {
              return a.dia < b.dia ? 1 : -1;
            })
          );
        };
        q.onerror = function () {
          no(q.error);
        };
      });
    });
  }
  // Faz a cópia do dia (sem fotos, para ser leve) e apaga as mais antigas.
  function autoBackup(forcar) {
    var dia = dayKey(Date.now());
    if (!forcar && S._abDia === dia) return Promise.resolve();
    S._abDia = dia;
    var txt = backupDados(true);
    return abAbrir()
      .then(function (db) {
        return new Promise(function (ok, no) {
          var tx = db.transaction('c', 'readwrite'),
            st = tx.objectStore('c');
          st.put({ dia: dia, ts: Date.now(), kb: Math.round(txt.length / 1024), txt: txt });
          var q = st.getAllKeys();
          q.onsuccess = function () {
            q.result
              .sort()
              .reverse()
              .slice(AB_MAX)
              .forEach(function (k) {
                st.delete(k);
              });
          };
          tx.oncomplete = ok;
          tx.onerror = function () {
            no(tx.error);
          };
        });
      })
      .then(function () {
        S._abList = undefined;
        if (S.view === 'ajustes') render();
      })
      .catch(function () {
        S._abDia = '';
      });
  }
  function abCarregar() {
    if (S._abList !== undefined || S._abLoading) return;
    S._abLoading = true;
    abTodas()
      .then(function (l) {
        S._abList = l.map(function (x) {
          return { dia: x.dia, ts: x.ts, kb: x.kb };
        });
        S._abLoading = false;
        S._ajForce = true;
        renderAjustes();
      })
      .catch(function () {
        S._abList = [];
        S._abLoading = false;
      });
  }
  function abRestaurar(dia) {
    return abAbrir().then(function (db) {
      return new Promise(function (ok, no) {
        var q = db.transaction('c').objectStore('c').get(dia);
        q.onsuccess = function () {
          ok(q.result && q.result.txt);
        };
        q.onerror = function () {
          no(q.error);
        };
      });
    });
  }
  // Lembrete: quando foi o último backup guardado fora do app.
  function backupLembrete() {
    if (!S.sales.length) return '';
    var dias = S.backupTs ? Math.floor((Date.now() - S.backupTs) / DAY) : Infinity;
    if (dias < 7) return '';
    return (
      '<div class="note n-warn">' +
      (dias === Infinity ? 'Você ainda não guardou um backup fora do celular.' : 'Faz ' + dias + ' dias do último backup guardado fora do celular.') +
      ' <a href="#ajustes" data-act="view" data-id="ajustes" style="color:var(--accent-fg)">Fazer agora</a></div>'
    );
  }

  // ---------- partes da aba Ajustes: pagamento, segurança e cópias
  function ajustesFinHtml() {
    var h = '';
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Moeda principal</h2><div class="hint" style="margin:2px 0 0">Os totais, lucros e contas aparecem nesta moeda, convertidos pelo câmbio do dia. Os campos onde você digita valores também passam a usar esta moeda. As cotações continuam sempre em guaranis.</div></div><div class="nav" id="moedaPB">' +
      [['pyg', 'Guarani (G$)'], ['usd', 'Dólar (US$)'], ['brl', 'Real (R$)']]
        .map(function (m) {
          var on = (S.moedaP || 'pyg') === m[0];
          return '<button type="button" class="chip' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-act="moedap" data-id="' + m[0] + '">' + m[1] + '</button>';
        })
        .join('') +
      '</div></section>';
    // dados de exemplo
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Dados de exemplo</h2><div class="hint" style="margin:2px 0 0">Para testar: troca TUDO o que está no app por um exemplo de cerca de 14 meses (vendas, câmbio, contas pagas, compras) e fotos desenhadas.</div></div><button type="button" class="chip" data-act="exemplo">' +
      (S.exConf ? 'Toque de novo para confirmar: apaga os dados atuais' : 'Carregar exemplo de 14 meses') +
      '</button></section>';
    // formas de pagamento
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Formas de pagamento e taxas</h2><div class="hint" style="margin:2px 0 0">A taxa (%) sai do seu lucro quando a venda é paga por essa forma. Dinheiro e Pix ficam em 0%. Confira as taxas da sua maquininha.</div></div>';
    S.formas.forEach(function (f) {
      h +=
        '<div style="display:flex;gap:8px;align-items:center"><span style="flex:1 1 150px">' +
        esc(f.nome) +
        '</span><input class="in" inputmode="decimal" data-aj="ptaxa" data-id="' +
        f.id +
        '" value="' +
        String(f.taxa).replace('.', ',') +
        '" aria-label="Taxa de ' +
        esc(f.nome) +
        ' em porcentagem" style="max-width:100px"><span class="hint" style="margin:0">%</span></div>';
    });
    h += '</section>';
    // lembretes
    h +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Lembretes</h2><label style="display:flex;gap:10px;align-items:center"><input type="checkbox" data-aj="cclemb"' +
      (S.ccLemb !== false ? ' checked' : '') +
      '> Lembrar toda semana de conferir o caixa</label></section>';
    // segurança
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Segurança</h2><div class="hint" style="margin:2px 0 0">PIN para abrir o app' +
      (bioPlugin() ? ' e, se você quiser, digital ou rosto' : ' (digital e rosto funcionam no app instalado no celular)') +
      '.</div></div>';
    if (!pinAtivo() || S.pinNovo) {
      h +=
        '<div class="sel" style="flex-wrap:wrap"><input class="in" id="pin1" type="password" inputmode="numeric" maxlength="8" placeholder="Novo PIN (4 a 8 números)" autocomplete="off" style="flex:1 1 150px;width:auto" aria-label="Novo PIN"><input class="in" id="pin2" type="password" inputmode="numeric" maxlength="8" placeholder="Repita o PIN" autocomplete="off" style="flex:1 1 150px;width:auto" aria-label="Repita o PIN"><button class="mini" data-act="pinset">' +
        (pinAtivo() ? 'Trocar PIN' : 'Ativar PIN') +
        '</button></div><div class="hint" style="margin:0">Anote o PIN. Se esquecer, só reinstalando o app (e os dados voltam apenas pelo backup).</div>';
    } else {
      if (S._bioOk === undefined) bioChecar();
      h +=
        '<div class="note n-ok">PIN ativo.</div><div class="sel" style="flex-wrap:wrap"><div><div class="lbl">Pedir o PIN</div><select class="in" data-aj="lockmin" aria-label="Quando pedir o PIN" style="width:auto">' +
        [
          [0, 'Sempre que voltar ao app'],
          [1, 'Após 1 minuto fora'],
          [5, 'Após 5 minutos fora'],
          [15, 'Após 15 minutos fora']
        ]
          .map(function (o) {
            return '<option value="' + o[0] + '"' + (S.lockMin === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
          })
          .join('') +
        '</select></div></div>' +
        '<label style="display:flex;gap:10px;align-items:center"><input type="checkbox" data-aj="locksens"' +
        (S.lockSens !== false ? ' checked' : '') +
        '> Pedir também para restaurar backup, apagar tudo e registrar retirada</label>';
      if (!bioPlugin())
        h += '<div class="hint" style="margin:0">Digital ou rosto: o componente não foi encontrado neste app. Instale o APK novo (gerado depois desta versão).</div>';
      else
        h +=
          '<label style="display:flex;gap:10px;align-items:center"><input type="checkbox" data-aj="biotog"' +
          (S.bioOn ? ' checked' : '') +
          (S._bioOk === false ? ' disabled' : '') +
          '> Usar digital ou rosto' +
          (S._bioOk === false ? ' (cadastre uma digital ou rosto nas configurações do celular primeiro' + (S._bioWhy ? ': ' + esc(S._bioWhy) : '') + ')' : '') +
          '</label>';
      h +=
        '<div class="sel" style="flex-wrap:wrap"><button class="chip" data-act="pintroca">Trocar PIN</button><button class="chip" data-act="pinoff">' +
        (S.pinOffConf ? 'Confirmar: desativar PIN' : 'Desativar PIN') +
        '</button></div>';
    }
    h += '</section>';
    // cópias automáticas
    abCarregar();
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Cópias automáticas</h2><div class="hint" style="margin:2px 0 0">O app guarda uma cópia por dia dentro do próprio celular (últimas ' +
      AB_MAX +
      '), sem fotos. Protege contra erro, não contra perder o celular: para isso use o backup acima e guarde o arquivo fora.</div></div>';
    (S._abList || []).forEach(function (x) {
      h +=
        '<div class="sl"><span>' +
        esc(x.dia.split('-').reverse().join('/')) +
        '<small>' +
        fh(x.ts) +
        ' · ' +
        x.kb +
        ' KB</small></span><button class="chip" data-act="abrest" data-id="' +
        x.dia +
        '">' +
        (S.abConf === x.dia ? 'Confirmar: voltar para esta cópia' : 'Restaurar') +
        '</button></div>';
    });
    if (S._abList && !S._abList.length) h += '<div class="hint" style="margin:0">Nenhuma cópia ainda.</div>';
    h += '<div><button class="mini" data-act="abagora">Fazer cópia agora</button></div></section>';
    return h;
  }
  // ===== Aba Vendas. =====
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
          (!S.vFaixa || (faixaOf(i.ref) || {}).id === S.vFaixa) &&
          (!qm || qm(i))
        );
      });
    $('vFiltPanel').hidden = !S.vFilt;
    $('vBtnFilt').setAttribute('aria-pressed', !!S.vFilt);
    $('vBtnFilt').classList.toggle('on', !!S.vFilt || S.vTipo !== 'all' || !!S.vFaixa);
    var vt = $('vTipos');
    vt.textContent = '';
    [{ id: 'all', label: 'Todos' }].concat(TIPOS).forEach(function (x) {
      vt.appendChild(
        btn(
          'chip' + (S.vTipo === x.id ? ' on' : ''),
          x.label,
          function () {
            S.vTipo = x.id;
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
    if (!groups[S.vRef]) {
      S.vRef = '';
      S.vSel = null;
    }
    var rows = $('vRows');
    rows.textContent = '';
    order.forEach(function (k) {
      var g = groups[k],
        f = g[0],
        tp = tipoOf(f.tipo),
        tot = sum(g);
      var card = btn(
        'pcard' + (k === S.vRef ? ' on' : ''),
        '',
        function () {
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
      card.appendChild(photoBox(photoOf(f.ref), 'pbox'));
      card.appendChild(mk('b', '', pn(f.ref)));
      var fxa = faixaOf(f.ref);
      if (fxa) {
        var ft = faixaTag(fxa);
        ft.style.alignSelf = 'flex-start';
        card.appendChild(ft);
      }
      if (S.pnome && S.pnome[f.ref]) card.appendChild(mk('span', 's', 'Código ' + f.ref));
      card.appendChild(
        mk(
          'span',
          's',
          tp.label +
            (f.tipo === 'pre'
              ? ''
              : (f.fmt && !f.bulk ? ' · ' + f.fmt : '') +
                (!tp.simple && f.med ? ' · ' + f.med : ''))
        )
      );
      var stt = mk('span', 'cell ' + (tot <= 2 ? 'low' : ''), tot + ' em estoque');
      stt.style.alignSelf = 'flex-start';
      card.appendChild(stt);
      rows.appendChild(card);
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
    $('vSaleCard').hidden = !S.vRef;
    $('catV').hidden = !!S.vRef;
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
      l.appendChild(dot(hexOf(i.cor)));
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
      max = sel ? sel.qty : 0;
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
    else if (max === 0) note('n-bad', 'Sem estoque dessa peça. Venda travada.');
    else if (S.qty >= max) note('n-warn', 'Limite: só há ' + max + ' dessa peça.');
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
      S.descGs = 0; // desconto só existe no carrinho
      var fxs = faixaOf(sel.ref);
      $('unit').textContent = pt
        ? 'Preço unit. ' + gs(pt) + (fxs ? ' (faixa ' + fxs.nome + ')' : ' (exemplo)')
        : 'Preço livre: digite abaixo o valor recebido';
      $('tot').textContent = pt ? gs(lista - S.descGs) : '';
      renderDescBrinde(sel);
    }
    $('sgo').disabled = !sel || max <= 0;
    $('vmsg').textContent = S.msg || '';
    carrinhoRender();
  }
  // Desconto, brinde e motivo da venda.
  function renderDescBrinde(sel) {
    var dm = $('descModes');
    dm.textContent = '';
    [
      ['pyg', mpSim()],
      ['pct', '%']
    ].forEach(function (o) {
      dm.appendChild(
        btn(
          'chip' + ((S.descMode || 'pyg') === o[0] ? ' on' : ''),
          o[1],
          function () {
            S.descMode = o[0];
            S.descTxt = '';
            S.rec = null;
            render();
          },
          (S.descMode || 'pyg') === o[0]
        )
      );
    });
    if ($('descIn').value !== (S.descTxt || '')) $('descIn').value = S.descTxt || '';
    $('descH').textContent = S.descGs
      ? 'Desconto de ' + gs(S.descGs) + ' sobre o preço de tabela.'
      : '';
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
    var mc = $('motChips');
    mc.textContent = '';
    ['Isca ou combo', 'Liquidação', 'Cliente fiel', 'Outro'].forEach(function (m) {
      mc.appendChild(
        btn(
          'chip' + (S.vMotivo === m ? ' on' : ''),
          m,
          function () {
            S.vMotivo = S.vMotivo === m ? '' : m;
            render();
          },
          S.vMotivo === m
        )
      );
    });
  }
  // Prévia da venda: custo, trava, piso e lucro com o valor digitado.
  function vendaPrevia() {
    if (S.cartOpen) return cartPrevia();
    var sel = S._vsel,
      t = S._t;
    if (!sel || !t) return null;
    var q = Math.max(1, S.qty),
      pt = pagTotais(),
      eff = pt.liq,
      br = S.vBrinde && S.vBrinde.qty > 0 ? S.vBrinde : null,
      bu = br ? brindeUsd(br) : 0,
      bg = Math.round(bu * S.fx.pyg),
      pp = pisoPeca(sel),
      c = calcSale(t, q, S.fx.pyg, colchao().pct, contasPeca(), S.melhPeca, eff, bu),
      travaTot = pp.trava * q + bg,
      pisoTot = pp.piso * q + bg,
      fm = formaSel(),
      tx = taxaGs(pt.rec, fm),
      liq = eff - tx;
    c.livre -= tx;
    return {
      eff: eff,
      liq: liq,
      tx: tx,
      fm: fm,
      c: c,
      br: br,
      bu: bu,
      pp: pp,
      travaTot: travaTot,
      pisoTot: pisoTot,
      perde: liq < travaTot,
      abaixo: liq < pisoTot,
      key: [S._selKey, q, eff, S.moeda, fm.id, br ? br.ref + br.cor : ''].join('|')
    };
  }
  // Aviso de piso: mostra o lucro ou a perda e pede confirmação se estiver abaixo.
  function renderPiso() {
    var el = $('pisoSt'),
      v = (S._vp = vendaPrevia());
    el.textContent = '';
    el.className = '';
    $('motB').hidden = !(v && v.abaixo);
    $('sgo').textContent = 'Finalizar venda';
    if (!v || !(v.eff > 0)) return;
    var fx = S.cartOpen ? null : faixaOf(S._vsel.ref),
      bt = v.br ? ' (já contando o brinde)' : '';
    if (v.perde) {
      el.className = 'note n-bad';
      el.textContent =
        'Abaixo da trava: você perde ' + gs(v.travaTot - v.liq) + ' nesta venda' + bt + (v.tx ? ' (já descontada a taxa de ' + gs(v.tx) + ')' : '') + '.';
    } else if (v.abaixo) {
      el.className = 'note n-warn';
      el.textContent =
        'Abaixo do piso' +
        (fx ? ' da faixa ' + fx.nome + ' (margem mínima ' + fx.margem + '%)' : '') +
        ': piso ' +
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
      var ok = S.pisoConf === v.key;
      $('sgo').textContent = ok ? 'Vender mesmo assim' : 'Finalizar venda (abaixo do piso)';
      if (ok) el.textContent += ' Toque de novo para confirmar.';
    }
  }
  $('descIn').oninput = function (e) {
    S.descTxt = e.target.value;
    S.rec = null;
    render();
  };
  $('vq').oninput = function (e) {
    S.vq = e.target.value;
    S.vRef = '';
    S.vSel = null;
    S.qty = 1;
    render();
  };
  /* ===== ler o código impresso na haste (OCR no aparelho) ===== */
  // ===== Códigos parecidos e utilitários do leitor de haste. =====
  // Chave normalizada de um código (A–Z, 0–9).
  function hKey(t) {
    return String(t)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .replace(/[OQD]/g, '0')
      .replace(/[IL]/g, '1')
      .replace(/Z/g, '2')
      .replace(/S/g, '5')
      .replace(/G/g, '6')
      .replace(/B/g, '8');
  }
  /* códigos parecidos do mesmo grupo (ex.: PY-566 e PY-568): modelos diferentes que podem dividir o mesmo nome de produto */
  function simRefs(ref) {
    var out = [],
      seen = {};
    try {
      var r = String(ref || '')
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, ''),
        m = r.match(/^([A-Z]{2,3})(\d{3,6})$/);
      if (!m) return out;
      S.items.forEach(function (i) {
        if (!i.ref) return;
        var r2 = String(i.ref)
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, '');
        if (r2 === r) return;
        var m2 = r2.match(/^([A-Z]{2,3})(\d{3,6})$/);
        if (!m2 || m2[1] !== m[1] || m2[2].length !== m[2].length || lev(m2[2], m[2]) > 2) return;
        var nm = S.pnome && S.pnome[i.ref];
        if (!nm || seen[nm]) return;
        seen[nm] = 1;
        out.push({ ref: i.ref, nome: nm });
      });
    } catch (e) {}
    return out;
  }
  // Mostra o aviso de códigos parecidos.
  function updSim(refId, nomeId, afterId, boxId, skip) {
    var box = $(boxId);
    if (!box) {
      var af = $(afterId);
      if (!af || !af.parentNode) return;
      box = document.createElement('div');
      box.id = boxId;
      box.style.cssText = 'display:flex;flex-direction:column;gap:6px;margin:6px 0';
      af.parentNode.insertBefore(box, af.nextSibling);
    }
    var ref = $(refId) ? $(refId).value : '',
      key = skip ? '' : ref + '|' + ($(nomeId) ? $(nomeId).value : '');
    if (box.__k === key) return;
    box.__k = key;
    box.textContent = '';
    if (skip || !ref) return;
    var ss = simRefs(ref)
      .filter(function (x) {
        return !$(nomeId) || $(nomeId).value.trim() !== x.nome;
      })
      .slice(0, 2);
    if (!ss.length) return;
    ss.forEach(function (x) {
      var t = mk(
        'div',
        'hint',
        'Código parecido com ' +
          x.ref +
          ' (“' +
          x.nome +
          '”). Se for outro modelo do mesmo grupo, pode usar o mesmo nome de produto.'
      );
      t.style.color = 'var(--warn)';
      box.appendChild(t);
      var b = btn('chip', 'Usar o nome “' + x.nome + '”', function () {
        var ni = $(nomeId);
        if (ni) {
          ni.value = x.nome;
          try {
            ni.dispatchEvent(new Event('input', { bubbles: true }));
          } catch (e) {}
        }
        box.__k = '';
        box.textContent = '';
      });
      b.style.cssText += ';width:100%;justify-content:center;min-height:42px';
      box.appendChild(b);
    });
  }
  // Distância de Levenshtein.
  function lev(a, b) {
    var m = a.length,
      n = b.length,
      d = [],
      i,
      j;
    for (i = 0; i <= m; i++) {
      d[i] = [i];
    }
    for (j = 1; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++)
      for (j = 1; j <= n; j++)
        d[i][j] = Math.min(
          d[i - 1][j] + 1,
          d[i][j - 1] + 1,
          d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
    return d[m][n];
  }
  // Cruza o texto lido com os códigos de haste.
  function hMatch(texts) {
    var words = {},
      refs = {};
    texts.forEach(function (T) {
      T.split(/\n+/).forEach(function (line) {
        var k = hKey(line);
        if (k.length >= 3) words[k] = 1;
        line.split(/\s+/).forEach(function (w) {
          var q = hKey(w);
          if (q.length >= 3) words[q] = 1;
        });
      });
    });
    S.items.forEach(function (i) {
      if (i.ref) refs[i.ref] = hKey(i.ref);
    });
    var out = [],
      W = Object.keys(words);
    Object.keys(refs).forEach(function (r) {
      var k = refs[r];
      if (k.length < 3) return;
      var best = 0;
      W.forEach(function (w) {
        var sc = 0;
        if (w === k) sc = 10;
        else if (k.length >= 4 && w.indexOf(k) >= 0) sc = 9;
        else if (k.length >= 5) {
          for (var L = k.length - 1; L <= k.length + 1 && !sc; L++) {
            if (L === k.length) continue;
            for (var o = 0; o + L <= w.length; o++) {
              if (lev(w.substr(o, L), k) <= 1) {
                sc = 5;
                break;
              }
            }
          }
        }
        if (sc > best) best = sc;
      });
      if (best) out.push([r, best]);
    });
    out.sort(function (a, b) {
      return b[1] - a[1];
    });
    return out;
  }
  // Gira um canvas.
  function rotCv(src, deg) {
    if (!deg) return src;
    var w = src.width,
      h = src.height,
      sw = deg === 90 || deg === 270,
      c = mkCanvas(sw ? h : w, sw ? w : h),
      g = c.getContext('2d');
    g.translate(c.width / 2, c.height / 2);
    g.rotate((deg * Math.PI) / 180);
    g.drawImage(src, -w / 2, -h / 2);
    return c;
  }
  var HOV = null,
    HT = null;
  // Fecha o leitor de haste.
  function hasteClose() {
    if (HOV) {
      HOV.remove();
      HOV = null;
    }
  }

  /* ===== câmera própria: o que aparece na tela é exatamente o que é analisado ===== */
  // ===== Pagamento em várias moedas, câmbio manual e troco devolvido em outra moeda. =====
  S.pagMisto = false; // pagar com mais de uma moeda
  S.pagX = []; // linhas extras de recebimento: {m, v, r}
  S.trL = []; // linhas de troco devolvido: {m, v, r}
  S.rate1 = ''; // câmbio manual da primeira linha (G$ por 1 unidade)
  var MOEDAS3 = [
    ['pyg', 'G$'],
    ['brl', 'R$'],
    ['usd', 'US$']
  ];
  // Câmbio usado: o manual (se digitado) ou o de hoje.
  function rateDe(m, r) {
    return m === 'pyg' ? 1 : r > 0 ? r : fxLoja(m) || ratePyg(m);
  }
  // Cotação da loja: os preços são em dólar e o dólar da loja vale uma margem fixa a mais que o mercado (não editável).
  // Ex.: peça de US$ 15, mercado 5.900, loja 6.000: quem paga em guaranis entrega 90.000 e não 88.500.
  // O real fica pelo valor de mercado em guaranis, então R$ por US$ também sobe pela mesma margem.
  var FX_MARGEM = 0.025;
  // Arredondada para cima para ficar "redonda": dólar de 50 em 50 guaranis (5.885 vira 5.900), real por dólar de 0,10 em 0,10 (4,92 vira 5,00).
  var FX_TETO = 0.035;
  // Margem do dia: 2,5% de base. Se o dólar oscilou mais de 3% em 7 dias, a margem passa a ser a oscilação + 0,5%.
  // Alerta de subida: alta de 1% em 3 dias soma 0,5%; alta de 2% soma 1%. Nunca passa do teto de 3,5%.
  function fxMargemInfo() {
    var h = S.fxHist || [],
      now = Date.now(),
      D = 86400000,
      cur = S.fx && S.fx.pyg > 0 ? S.fx.pyg : 0,
      vals = h
        .filter(function (p) {
          return p.ts >= now - 7 * D && p.pyg > 0;
        })
        .map(function (p) {
          return p.pyg;
        });
    if (cur) vals.push(cur);
    var amp = vals.length > 1 ? (Math.max.apply(null, vals) - Math.min.apply(null, vals)) / Math.min.apply(null, vals) : 0,
      ref = 0,
      i;
    for (i = h.length - 1; i >= 0; i--)
      if (h[i].ts <= now - 3 * D) {
        ref = h[i].pyg;
        break;
      }
    var alta = ref && cur ? (cur - ref) / ref : 0,
      reativa = amp > 0.03 ? Math.max(FX_MARGEM, amp + 0.005) : FX_MARGEM,
      alerta = alta >= 0.02 ? 0.01 : alta >= 0.01 ? 0.005 : 0;
    return { m: Math.min(FX_TETO, reativa + alerta), amp: amp, alta: alta, reativa: reativa, alerta: alerta };
  }
  function fxUsdLoja() {
    return Math.ceil((ratePyg('usd') * (1 + fxMargemInfo().m)) / 50 - 1e-9) * 50;
  }
  function fxBrlPorUsd() {
    var b = S.fx && S.fx.brl > 0 ? S.fx.brl : 5;
    return Math.ceil(b * (1 + fxMargemInfo().m) * 10 - 1e-9) / 10;
  }
  function fxLoja(m) {
    return m === 'usd' ? fxUsdLoja() : m === 'brl' ? fxUsdLoja() / fxBrlPorUsd() : 0;
  }
  // Texto "câmbio da loja" ou "cotação de hoje" conforme o que está valendo.
  function fxOrigem(m) {
    return 'cotação da loja';
  }
  function numRate(txt) {
    return parseDec(txt, 'pyg');
  }
  // Totais do pagamento em guaranis: recebido, troco devolvido e líquido da venda.
  function pagTotais() {
    var m = S.moeda,
      l1 = Math.round((S._recv || 0) * rateDe(m, numRate(S.rate1))),
      ex = 0,
      tr = 0;
    (S.pagX || []).forEach(function (x) {
      ex += Math.round((parseDec(x.v, x.m) || 0) * rateDe(x.m, numRate(x.r)));
    });
    (S.trL || []).forEach(function (x) {
      tr += Math.round((parseDec(x.v, x.m) || 0) * rateDe(x.m, numRate(x.r)));
    });
    var rec = l1 + ex,
      due = S._dueGs || 0;
    return { rec: rec, troco: tr, liq: rec - tr, due: due, falta: Math.max(0, due - rec), devolver: Math.max(0, rec - due), pendente: Math.max(0, rec - due - tr) };
  }
  // Dados do pagamento para gravar a venda.
  function pagPayload() {
    var fx = function (x) {
      return { moeda: x.m, v: parseDec(x.v, x.m) || 0, rate: rateDe(x.m, numRate(x.r)) };
    };
    return {
      rate: rateDe(S.moeda, numRate(S.rate1)),
      extra: (S.pagX || []).map(fx).filter(function (x) {
        return x.v > 0;
      }),
      troco: (S.trL || []).map(fx).filter(function (x) {
        return x.v > 0;
      })
    };
  }
  function pagReset() {
    S.pagMisto = false;
    S.pagX = [];
    S.trL = [];
    S.rate1 = '';
    S.rec = null;
  }
  // Atualiza só os textos (sem refazer os campos, para não perder o foco).
  function pmTextos() {
    var t = pagTotais(),
      el = $('pmRes');
    if (!el) return;
    var partes = [];
    partes.push('A cobrar: ' + gs(t.due));
    partes.push('Recebido: ' + gs(t.rec));
    if (t.falta > 0) partes.push('Falta: ' + gs(t.falta));
    if (t.devolver > 0) partes.push('Troco a devolver: ' + gs(t.devolver));
    if (t.troco > 0) partes.push('Troco devolvido: ' + gs(t.troco));
    el.textContent = partes.join(' · ');
    var dif = t.troco - t.devolver;
    $('trH').textContent =
      t.devolver <= 0
        ? ''
        : t.troco === 0
        ? 'Escolha em que moeda devolveu o troco.'
        : Math.abs(dif) < 1
        ? 'Troco confere.'
        : dif > 0
        ? 'Você devolveu ' + gs(dif) + ' a mais que o troco.'
        : 'Faltam ' + gs(-dif) + ' de troco (ficam como lucro da venda).';
    $('trocoB').hidden = t.devolver <= 0 && !(S.trL || []).length;
    var warn = [];
    var need = {};
    (S.trL || []).forEach(function (x) {
      need[x.m] = (need[x.m] || 0) + (parseDec(x.v, x.m) || 0);
    });
    Object.keys(need).forEach(function (m) {
      var tem = (S.cash[m] || 0) + (m === S.moeda ? S._recv || 0 : 0);
      (S.pagX || []).forEach(function (x) {
        if (x.m === m) tem += parseDec(x.v, x.m) || 0;
      });
      if (need[m] > tem + 1e-9) warn.push('Você não tem ' + fmtM(need[m], m) + ' no caixa para esse troco.');
    });
    var w = $('trW');
    w.textContent = warn.join(' ');
    w.hidden = !warn.length;
  }
  function pmMudou() {
    pmTextos();
    updateRec();
  }
  // Uma linha de recebimento ou de troco.
  function pmLinha(x, i, lista, titulo) {
    var box = mk('div', 'card col');
    box.style.cssText = 'background:var(--panel2);padding:10px;gap:8px';
    var cab = mk('div', 'nav');
    MOEDAS3.forEach(function (o) {
      cab.appendChild(
        btn(
          'chip' + (x.m === o[0] ? ' on' : ''),
          o[1],
          function () {
            x.m = o[0];
            x.r = '';
            pmRender(true);
            pmMudou();
          },
          x.m === o[0]
        )
      );
    });
    box.appendChild(cab);
    var linha = mk('div', 'sel');
    var v = mk('input', 'in');
    v.setAttribute('inputmode', 'decimal');
    v.placeholder = titulo;
    v.setAttribute('aria-label', titulo + ' em ' + x.m.toUpperCase());
    v.value = x.v;
    v.style.cssText = 'flex:1 1 120px;width:auto';
    v.oninput = function () {
      x.v = v.value;
      pmMudou();
    };
    linha.appendChild(v);
    if (x.m !== 'pyg') {
      var r = mk('input', 'in');
      r.setAttribute('inputmode', 'numeric');
      r.placeholder = 'Câmbio ' + dots(Math.round(rateDe(x.m, 0)));
      r.setAttribute('aria-label', 'Câmbio de ' + x.m.toUpperCase() + ' em guaranis (opcional)');
      r.value = x.r || '';
      r.style.cssText = 'flex:1 1 110px;width:auto';
      r.oninput = function () {
        x.r = r.value;
        pmMudou();
      };
      linha.appendChild(r);
    }
    var rm = btn('trash', '✕', function () {
      lista.splice(i, 1);
      pmRender(true);
      pmMudou();
    });
    rm.setAttribute('aria-label', 'Remover esta linha');
    linha.appendChild(rm);
    box.appendChild(linha);
    return box;
  }
  // Desenha os campos de pagamento misto e de troco (não mexe se você está digitando neles).
  function pmRender(force) {
    var host = $('pagMixB');
    if (!host) return;
    var ae = document.activeElement;
    if (!force && ae && ae.tagName === 'INPUT' && host.contains(ae)) return pmTextos();
    // câmbio da primeira linha
    var m = S.moeda;
    $('rate1B').hidden = m === 'pyg';
    if (m === 'pyg') S.rate1 = '';
    $('rate1In').placeholder = 'Câmbio da loja: ' + dots(Math.round(rateDe(m, 0)));
    if ($('rate1In').value !== (S.rate1 || '')) $('rate1In').value = S.rate1 || '';
    // botão de pagar com mais de uma moeda
    var tg = $('pmTog');
    tg.textContent = S.pagMisto ? 'Pagamento em uma moeda só' : 'Pagar com mais de uma moeda';
    tg.setAttribute('aria-pressed', S.pagMisto);
    // linhas extras
    var ex = $('pmExtra');
    ex.textContent = '';
    ex.hidden = !S.pagMisto;
    if (S.pagMisto) {
      S.pagX.forEach(function (x, i) {
        ex.appendChild(pmLinha(x, i, S.pagX, 'Valor recebido'));
      });
      ex.appendChild(
        btn('chip add', '+ Outra moeda', function () {
          S.pagX.push({ m: S.moeda === 'pyg' ? 'brl' : 'pyg', v: '', r: '' });
          pmRender(true);
          pmMudou();
        })
      );
    }
    // troco
    var tr = $('trRows');
    tr.textContent = '';
    S.trL.forEach(function (x, i) {
      tr.appendChild(pmLinha(x, i, S.trL, 'Troco devolvido'));
    });
    var ch = $('trChips');
    ch.textContent = '';
    MOEDAS3.forEach(function (o) {
      ch.appendChild(
        btn('chip add', 'Devolvi em ' + o[1], function () {
          var t = pagTotais(),
            falta = Math.max(0, t.devolver - t.troco),
            rt = rateDe(o[0], 0),
            v = falta / rt;
          S.trL.push({ m: o[0], v: falta > 0 ? inVal(o[0] === 'pyg' ? Math.round(v) : Math.round(v * 100) / 100, o[0]) : '', r: '' });
          pmRender(true);
          pmMudou();
        })
      );
    });
    pmTextos();
  }
  $('pmTog').onclick = function () {
    S.pagMisto = !S.pagMisto;
    S.pagX = [];
    S.rec = null;
    render();
  };
  $('rate1In').addEventListener('input', function () {
    S.rate1 = this.value;
    S.rec = null;
    S._ratePend = true;
    render();
  });
  // ===== Descarte: peças quebradas ou imprestáveis saem do estoque e viram prejuízo. =====
  S.descartes = [];
  S.moedaP = 'pyg';
  // Dá baixa em n peças de um item. Custo = o que foi pago por peça (dólar) no câmbio de hoje.
  function descartar(item, n, motivo) {
    n = Math.floor(n);
    if (!item || !(n > 0) || n > item.qty) return null;
    var t = tipoOf(item.tipo),
      usdv = (t && t.pago ? t.pago : 0) * n,
      valor = Math.round(usdv * S.fx.pyg),
      ts = Date.now(),
      desc = n + '× ' + item.ref + ' ' + (item.grau || item.vr || '') + ' · ' + item.cor + (motivo ? ' (' + motivo + ')' : '');
    item.qty -= n;
    S.descartes.push({ ts: ts, ref: item.ref, cor: item.cor, qty: n, usd: usdv, valor: valor, motivo: motivo || '' });
    S.dlog.push({ ts: ts, kind: 'descarte', desc: desc, valor: valor, usd: usdv });
    S.elog.push({ ts: ts, tipo: item.tipo, ref: item.ref, cor: item.cor, grau: item.grau || '', qty: -n, descarte: true });
    return valor;
  }
  // Bloco "Dar baixa (descarte)" no detalhe do produto.
  function descarteBox(ref) {
    var its = S.items.filter(function (i) {
      return i.ref === ref && i.qty > 0;
    });
    var box = mk('div', 'col');
    box.id = 'descBox';
    box.appendChild(mk('div', 'lbl', 'Peça quebrada ou descartada'));
    if (!its.length) {
      box.appendChild(mk('div', 'hint', 'Sem peças em estoque para dar baixa.'));
      return box;
    }
    box.appendChild(mk('div', 'hint', 'A peça sai do estoque e o custo dela vira prejuízo no resultado do mês. Não dá para desfazer.'));
    var sel = mk('select', 'in');
    sel.id = 'dscItem';
    sel.setAttribute('aria-label', 'Qual variante');
    its.forEach(function (i, ix) {
      var o = mk('option', '', i.cor + (i.grau ? ' ' + i.grau : '') + ' · ' + i.qty + ' un.');
      o.value = String(ix);
      sel.appendChild(o);
    });
    var q = mk('input', 'in');
    q.id = 'dscQtd';
    q.inputMode = 'numeric';
    q.placeholder = 'Qtd.';
    q.value = '1';
    q.style.maxWidth = '80px';
    q.setAttribute('aria-label', 'Quantidade a descartar');
    var m = mk('input', 'in');
    m.id = 'dscMot';
    m.placeholder = 'Motivo (ex.: veio quebrada)';
    m.setAttribute('aria-label', 'Motivo');
    var msg = mk('div', 'hint');
    msg.id = 'dscMsg';
    msg.setAttribute('role', 'status');
    var go = btn('mini', 'Dar baixa', function () {
      var it = its[+sel.value],
        n = Math.floor(toNum(q.value));
      if (!(n > 0) || n > it.qty) {
        msg.textContent = 'Informe de 1 a ' + it.qty + ' peça(s).';
        return;
      }
      var v = descartar(it, n, m.value.trim());
      S.msg = 'Baixa feita: ' + n + ' peça(s), prejuízo de ' + gs(v) + '.';
      render();
    });
    go.style.cssText = 'background:transparent;color:var(--bad);border:1px solid rgba(239,68,68,.7)';
    var row = mk('div', 'sel');
    row.style.flexWrap = 'wrap';
    row.appendChild(sel);
    row.appendChild(q);
    box.appendChild(row);
    box.appendChild(m);
    box.appendChild(go);
    box.appendChild(msg);
    return box;
  }
  /* ===== Identidade do modelo: nº interno, marca/material/público/coleção, nome e descrição automáticos ===== */
  var MATERIAIS = ['Metal', 'Acetato', 'Plástico', 'TR90', 'Titânio', 'Nylon'],
    PUBLICOS = ['Feminino', 'Masculino', 'Infantil', 'Unissex'];
  function attrOf(ref) {
    return (S.attr && S.attr[ref]) || {};
  }
  function setAttr(ref, patch) {
    if (!S.attr) S.attr = {};
    var a = Object.assign({}, S.attr[ref] || {}, patch);
    Object.keys(a).forEach(function (k) {
      var v = String(a[k] == null ? '' : a[k]).trim();
      if (!v) delete a[k];
      else a[k] = v;
    });
    if (Object.keys(a).length) S.attr[ref] = a;
    else delete S.attr[ref];
  }
  /* número interno curto (1, 2, 3…), no lugar do código da haste para falar e achar o modelo */
  function numOf(ref) {
    return (S.num && S.num[ref]) || 0;
  }
  function baseNome(ref) {
    var f = S.items.filter(function (i) {
      return i.ref === ref;
    })[0];
    if (!f) return 'Armação';
    return f.tipo === 'pre' ? 'Óculos de leitura' : f.tipo === 'solar' ? 'Óculos solar' : 'Armação';
  }
  /* "Armação Gucci de metal feminino" */
  function nomeAuto(ref) {
    var a = attrOf(ref);
    if (!a.marca && !a.material && !a.publico) return '';
    return [
      baseNome(ref),
      a.marca,
      a.material ? 'de ' + a.material.toLowerCase() : '',
      a.publico ? a.publico.toLowerCase() : ''
    ]
      .filter(Boolean)
      .join(' ');
  }
  /* nome que o cliente vê: nunca o código da haste quando existe nome ou atributos */
  function pubNome(ref) {
    var n = (S.pnome && S.pnome[ref]) || nomeAuto(ref);
    if (n) return n;
    // sem nome e sem marca: o tipo (ou o material) e o número interno, ex.: "Acetato #12"
    var nm = numOf(ref),
      it0 = S.items.filter(function (i) {
        return i.ref === ref;
      })[0];
    if (!it0 || isSimple(it0.tipo)) return ref;
    return nm ? (attrOf(ref).material || baseNome(ref)) + ' #' + nm : ref;
  }
  function descAutoDe(ref, nome) {
    var seen = {},
      cs = [],
      med = '';
    S.items.forEach(function (i) {
      if (i.ref !== ref || i.bulk) return;
      if (i.med && !med) med = i.med;
      var k = i.vr || i.cor;
      if (seen[k]) return;
      seen[k] = 1;
      if (i.cor === 'Sem cor' && !i.vr) return;
      cs.push(i.vr ? i.vr + (i.cor === 'Sem cor' ? '' : ' ' + i.cor) : i.cor);
    });
    return nome + (cs.length ? '. Cores: ' + cs.join(', ') : '') + (med ? '. Medidas: ' + med : '') + '.';
  }
  function identSync() {
    if (!S.num) S.num = {};
    if (!S.pnAuto) S.pnAuto = {};
    if (!S.descAuto) S.descAuto = {};
    var seen = {};
    S.items.forEach(function (i) {
      if (!i.ref || i.bulk || seen[i.ref]) return;
      seen[i.ref] = 1;
      if (!S.num[i.ref]) S.num[i.ref] = S.numNext = (S.numNext || 0) + 1;
    });
    Object.keys(S.attr || {}).forEach(function (ref) {
      if (!seen[ref]) return;
      var auto = nomeAuto(ref);
      if (!auto) return;
      var cur = S.pnome && S.pnome[ref];
      if (!cur || S.pnAuto[ref] === cur) {
        if (!S.pnome) S.pnome = {};
        S.pnome[ref] = auto;
        S.pnAuto[ref] = auto;
        cur = auto;
      }
      var d = descAutoDe(ref, cur),
        dc = S.desc[ref];
      if (dc == null || dc === '' || S.descAuto[ref] === dc) {
        S.desc[ref] = d;
        S.descAuto[ref] = d;
      }
    });
  }
  function identMove(a, b) {
    ['attr', 'num', 'pnAuto', 'descAuto'].forEach(function (k) {
      if (S[k] && S[k][a] != null) {
        S[k][b] = S[k][a];
        delete S[k][a];
      }
    });
  }
  /* texto para a busca: nº, marca, material, público, coleção, nome */
  function identTxt(ref) {
    var a = attrOf(ref),
      n = numOf(ref);
    return [a.marca, a.material, a.publico, a.colecao, nomeAuto(ref), n ? '#' + n + ' n' + n : '']
      .filter(Boolean)
      .join(' ');
  }
  function colecoes() {
    var s = {};
    Object.keys(S.attr || {}).forEach(function (r) {
      var c = S.attr[r].colecao;
      if (c) s[c] = 1;
    });
    return Object.keys(s).sort();
  }
  function slugNome(t) {
    return String(t || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^\w-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  /* campos de identificação (cartão da foto e Editar produto): cur é o objeto editado */
  function identBox(host, cur, onCh) {
    host.textContent = '';
    var ch = function () {
      if (onCh) onCh();
    };
    host.appendChild(mk('div', 'lbl', 'Identificação do modelo'));
    var inp = function (key, ph, list) {
      var i = mk('input', 'in');
      i.placeholder = ph;
      i.value = cur[key] || '';
      i.setAttribute('aria-label', ph);
      if (list) i.setAttribute('list', list);
      i.oninput = function () {
        cur[key] = i.value;
        ch();
      };
      return i;
    };
    var chips = function (key, arr) {
      var w = mk('div', 'nav');
      arr.forEach(function (v) {
        var on = (cur[key] || '').toLowerCase() === v.toLowerCase();
        w.appendChild(
          btn(
            'chip' + (on ? ' on' : ''),
            v,
            function () {
              cur[key] = on ? '' : v;
              ch();
              identBox(host, cur, onCh);
            },
            on
          )
        );
      });
      return w;
    };
    var dl = mk('datalist', '');
    dl.id = 'dlIdent' + (host.id || '');
    var ms = {};
    Object.keys(S.attr || {}).forEach(function (r) {
      if (S.attr[r].marca) ms[S.attr[r].marca] = 1;
    });
    Object.keys(ms).forEach(function (m) {
      var o = mk('option', '');
      o.value = m;
      dl.appendChild(o);
    });
    var dc = mk('datalist', '');
    dc.id = dl.id + 'C';
    colecoes().forEach(function (m) {
      var o = mk('option', '');
      o.value = m;
      dc.appendChild(o);
    });
    host.appendChild(dl);
    host.appendChild(dc);
    host.appendChild(inp('marca', 'Marca (ex.: Gucci, Ray-Ban, Kazwini)', dl.id));
    host.appendChild(chips('material', MATERIAIS));
    host.appendChild(chips('publico', PUBLICOS));
    host.appendChild(inp('colecao', 'Coleção (ex.: Clássicos, Clip-on, Solares)', dc.id));
    var pv = mk('div', 'hint', '');
    pv.style.margin = '0';
    var up = function () {
      var t = cur.marca || cur.material || cur.publico ? 'Nome automático: ' : '';
      if (t) {
        var a = S.attr;
        S.attr = { __p: cur };
        var n = nomeAuto('__p');
        S.attr = a;
        t += n;
      }
      pv.textContent = t;
    };
    up();
    host.appendChild(pv);
  }
  // ===== Câmera do app (visor, galeria, lanterna, prévia) e plano B nativo. =====
  var CAMO = null,
    CAMS = null;
  // Fecha a câmera e libera o vídeo.
  function camClose() {
    if (CAMS) {
      try {
        CAMS.getTracks().forEach(function (t) {
          t.stop();
        });
      } catch (e) {}
      CAMS = null;
    }
    if (CAMO) {
      CAMO.remove();
      CAMO = null;
    }
  }
  // Arquivo de foto → imagem com orientação correta.
  function normFile(f) {
    return (
      window.createImageBitmap
        ? createImageBitmap(f, { imageOrientation: 'from-image' })
        : Promise.reject()
    )
      .then(function (bm) {
        var k = Math.min(1, 2600 / Math.max(bm.width, bm.height)),
          c = mkCanvas(Math.round(bm.width * k), Math.round(bm.height * k));
        c.getContext('2d').drawImage(bm, 0, 0, c.width, c.height);
        try {
          bm.close();
        } catch (e) {}
        return new Promise(function (ok) {
          c.toBlob(
            function (b) {
              ok(b ? new File([b], 'foto.jpg', { type: 'image/jpeg' }) : f);
            },
            'image/jpeg',
            0.9
          );
        });
      })
      .catch(function () {
        return f;
      });
  }
  // Nitidez (foco) de um quadro.
  function sharpOf(cv) {
    try {
      var w = 320,
        h = Math.max(1, Math.round((cv.height * w) / cv.width)),
        c = mkCanvas(w, h),
        g = c.getContext('2d');
      g.drawImage(cv, 0, 0, w, h);
      var d = g.getImageData(0, 0, w, h).data,
        gr = new Float32Array(w * h),
        i,
        x,
        y;
      for (i = 0; i < w * h; i++)
        gr[i] = d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114;
      var sm = 0,
        sq = 0,
        n = 0;
      for (y = 1; y < h - 1; y++)
        for (x = 1; x < w - 1; x++) {
          var l =
            4 * gr[y * w + x] -
            gr[y * w + x - 1] -
            gr[y * w + x + 1] -
            gr[(y - 1) * w + x] -
            gr[(y + 1) * w + x];
          sm += l;
          sq += l * l;
          n++;
        }
      return sq / n - (sm / n) * (sm / n);
    } catch (e) {
      return 999;
    }
  }
  var ARM = 0;
  // Detecta o retorno da câmera nativa.
  function armReturn(lbl) {
    ARM = Date.now();
    var f = function () {
        window.removeEventListener('focus', f);
        document.removeEventListener('visibilitychange', v);
        if (Date.now() - ARM < 600000) {
          loadMsg(true, lbl || 'Carregando foto');
          clearTimeout(armReturn._t);
          armReturn._t = setTimeout(function () {
            loadMsg(false);
          }, 45000);
        }
      },
      v = function () {
        if (!document.hidden) f();
      };
    window.addEventListener('focus', f);
    document.addEventListener('visibilitychange', v);
  }
  // Abre a câmera/galeria nativa do aparelho.
  function nativeInput(onFile, gal, lbl) {
    var i = document.createElement('input');
    i.type = 'file';
    i.accept = 'image/*';
    if (!gal) i.setAttribute('capture', 'environment');
    i.setAttribute('aria-hidden', 'true');
    i.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;font-size:0';
    i.addEventListener('click', function () {
      armReturn(lbl);
    });
    i.addEventListener('cancel', function () {
      loadMsg(false);
    });
    i.onchange = function () {
      var f = i.files && i.files[0];
      if (!f) {
        loadMsg(false);
        return;
      }
      clearTimeout(armReturn._t);
      loadMsg(true, lbl || 'Carregando foto');
      setTimeout(function () {
        normFile(f).then(onFile);
      }, 30);
      i.value = '';
    };
    return i;
  }
  // Plano B quando a câmera do app não abre.
  function camFallback(done, gal, lbl) {
    armNative();
    var ov = document.createElement('div');
    ov.style.cssText =
      'position:fixed;inset:0;z-index:330;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;padding:16px';
    var bx = document.createElement('div');
    bx.style.cssText =
      'background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px;width:min(94vw,420px);display:flex;flex-direction:column;gap:10px';
    var w = document.createElement('div');
    w.style.cssText = 'position:relative;display:flex';
    var ok = btn('mini', 'Abrir a câmera', function () {});
    ok.style.cssText += ';width:100%;margin:0';
    w.appendChild(ok);
    w.appendChild(
      nativeInput(
        function (f) {
          ov.remove();
          done(f);
        },
        false,
        lbl
      )
    );
    var ca = btn('chip', 'Cancelar', function () {
      ov.remove();
    });
    ca.style.cssText += ';width:100%;justify-content:center';
    bx.appendChild(w);
    if (HCAM) {
      var rh = mk(
        'div',
        'hint',
        'A câmera do app não abriu (' + HCAM + '). Use a do celular ou a galeria.'
      );
      bx.insertBefore(rh, w);
    }
    if (gal) {
      var w2 = document.createElement('div');
      w2.style.cssText = 'position:relative;display:flex';
      var g2 = btn('chip', 'Escolher da galeria', function () {});
      g2.style.cssText += ';width:100%;justify-content:center;min-height:46px';
      w2.appendChild(g2);
      w2.appendChild(
        nativeInput(
          function (f) {
            ov.remove();
            done(f, { gallery: true });
          },
          true,
          lbl
        )
      );
      bx.appendChild(w2);
    }
    bx.appendChild(ca);
    ov.appendChild(bx);
    document.body.appendChild(ov);
  }
  var NATIVE = false,
    HCAM = '';
  // Liga a captura nativa no botão do leitor.
  function armNative() {
    if (NATIVE) return;
    NATIVE = true;
    [
      [
        'btnLeitor',
        function (f) {
          leitorFromPhoto(f);
        }
      ]
    ].forEach(function (d) {
      var b = $(d[0]);
      if (!b || !b.parentNode) return;
      var w = document.createElement('div');
      w.style.cssText =
        'position:relative;display:flex;flex:' +
        (b.style.flex || '1 1 auto') +
        ';' +
        (b.style.width && b.style.flex ? 'width:' + b.style.width + ';' : 'width:100%;');
      b.parentNode.insertBefore(w, b);
      w.appendChild(b);
      b.style.flex = '1 1 auto';
      b.style.width = '100%';
      b.onclick = function () {};
      w.appendChild(nativeInput(d[1], false, d[0] === 'btnLeitor' ? 'Analisando código' : ''));
    });
  }
  // Abre a câmera do app (com plano B se falhar).
  function camOpen() {
    try {
      camOpen0.apply(null, arguments);
    } catch (e) {
      camClose();
      popErr('Erro ao abrir a câmera: ' + ((e && e.message) || e));
    }
  }
  var LIVEX = null;
  // Câmera do app: visor, disparo, galeria, lanterna e prévia.
  function camOpen0(done, title, opts) {
    opts = opts || {};
    LIVEX = null;
    camClose();
    if (opts.live || opts.liveFallback) {
      try {
        getWorker().catch(function () {});
      } catch (e) {}
    } /* aquece o leitor enquanto a câmera abre */
    var blocked = false;
    try {
      var fp = document.permissionsPolicy || document.featurePolicy;
      if (fp && fp.allowsFeature && !fp.allowsFeature('camera')) blocked = true;
    } catch (e) {}
    if (blocked || !(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      camFallback(opts.liveFallback || done, opts.gallery, opts.live ? 'Analisando código' : '');
      return;
    }
    var ov = document.createElement('div');
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', title || 'Câmera');
    ov.style.cssText =
      'position:fixed;inset:0;z-index:300;background:#000;display:flex;flex-direction:column;color:#fff';
    var top = document.createElement('div');
    top.style.cssText =
      'display:flex;justify-content:space-between;align-items:center;padding:max(10px,env(safe-area-inset-top,0px)) 14px 10px';
    top.appendChild(mk('b', '', title || 'Câmera'));
    var xb = btn('chip', '✕', function () {
      camClose();
    });
    xb.setAttribute('aria-label', 'Fechar');
    xb.style.cssText = 'min-height:40px;width:44px;padding:0;justify-content:center';
    var tr = document.createElement('div');
    tr.style.cssText = 'display:flex;gap:8px;align-items:center';
    if (opts.skip) {
      var sk = btn('chip', opts.skipTxt || 'Pular', function () {
        camClose();
        opts.skip();
      });
      sk.style.minHeight = '40px';
      tr.appendChild(sk);
    }
    tr.appendChild(xb);
    top.appendChild(tr);
    var stg = document.createElement('div');
    stg.style.cssText =
      'position:relative;flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden';
    var vid = document.createElement('video');
    vid.setAttribute('playsinline', '');
    vid.muted = true;
    vid.autoplay = true;
    vid.style.cssText = 'width:100%;height:100%;object-fit:contain;background:#000';
    var gd = document.createElement('div');
    gd.style.cssText =
      'position:absolute;left:50%;top:50%;width:' +
      (opts.strip ? '90%' : '84%') +
      ';height:' +
      (opts.strip ? '20%' : '50%') +
      ';max-width:' +
      (opts.strip ? '720px' : '560px') +
      ';transform:translate(-50%,-50%);border:2px solid rgba(255,255,255,.85);border-radius:14px;pointer-events:none';
    var ring = document.createElement('div');
    ring.style.cssText =
      'position:absolute;width:64px;height:64px;border:2px solid #ffd54a;border-radius:50%;opacity:0;transform:translate(-50%,-50%);pointer-events:none;transition:opacity .25s';
    var tip = mk(
      'div',
      '',
      '' + (opts.tip || 'Enquadre a peça dentro do retângulo. Toque na tela para focar.') + ''
    );
    tip.style.cssText =
      'position:absolute;left:0;right:0;bottom:8px;text-align:center;font-size:13px;color:#fff;text-shadow:0 1px 3px #000;padding:0 16px;pointer-events:none';
    stg.appendChild(vid);
    stg.appendChild(gd);
    stg.appendChild(ring);
    stg.appendChild(tip);
    var bar = document.createElement('div');
    bar.style.cssText =
      'display:flex;align-items:center;justify-content:center;gap:18px;padding:14px 14px max(18px,env(safe-area-inset-bottom,0px));flex-wrap:wrap';
    var pv = document.createElement('img');
    pv.style.cssText =
      'display:none;position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000';
    stg.appendChild(pv);
    CAMO = ov;
    ov.appendChild(top);
    ov.appendChild(stg);
    ov.appendChild(bar);
    document.body.appendChild(ov);
    var IGAL =
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.7"/><path d="M4 18l5.2-5.2a1.5 1.5 0 0 1 2.1 0L14 15.5l2-2a1.5 1.5 0 0 1 2.1 0L21 16.4"/></svg>';
    var ITOR = function (on) {
      return (
        '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><g transform="translate(2.2 4.6) scale(.8)"><path d="M6 2h12v5l-2 2v12.5a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 21.5V9L6 7z"/><path d="M12 11v4"/>' +
        (on ? '' : '<path d="M3.5 3.5l17 17"/>') +
        '</g>' +
        (on ? '<path d="M12 .9v2.6M6.2 2.2l1.6 2M17.8 2.2l-1.6 2"/>' : '') +
        '</svg>'
      );
    };
    var CIRC =
      'width:52px;height:52px;border-radius:50%;border:none;background:rgba(255,255,255,.18);color:#fff;display:inline-flex;align-items:center;justify-content:center;padding:0;cursor:pointer';
    function mkGal(icon) {
      var gl = btn('chip', icon ? '' : 'Galeria', function () {
        var gi = document.createElement('input');
        gi.type = 'file';
        gi.accept = 'image/*';
        gi.style.display = 'none';
        document.body.appendChild(gi);
        gi.onchange = function () {
          var f = gi.files && gi.files[0];
          gi.remove();
          if (f)
            normFile(f).then(function (nf) {
              camClose();
              (opts.liveFallback || done)(nf, { gallery: true });
            });
        };
        gi.click();
      });
      gl.style.minHeight = '44px';
      if (icon) {
        gl.innerHTML = IGAL;
        gl.style.cssText = CIRC;
        gl.setAttribute('aria-label', 'Galeria');
      }
      return gl;
    }
    var TOR0 = false;
    function buildBar(trk, caps) {
      bar.textContent = '';
      bar.style.cssText =
        'display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;padding:12px 22px max(18px,env(safe-area-inset-bottom,0px))';
      if (caps && caps.zoom) {
        var zr = document.createElement('input');
        zr.type = 'range';
        zr.min = caps.zoom.min;
        zr.max = Math.min(caps.zoom.max, caps.zoom.min * 5 || caps.zoom.max);
        zr.step = caps.zoom.step || 0.1;
        zr.value = caps.zoom.min;
        zr.style.cssText = 'grid-column:1/-1;width:100%;margin:0 0 6px';
        zr.setAttribute('aria-label', 'Zoom');
        zr.oninput = function () {
          try {
            trk.applyConstraints({ advanced: [{ zoom: +zr.value }] });
          } catch (e) {}
        };
        bar.appendChild(zr);
      }
      var lc0 = document.createElement('div');
      lc0.style.cssText = 'display:flex;justify-content:flex-start';
      if (opts.gallery) lc0.appendChild(mkGal(true));
      bar.appendChild(lc0);
      var sh = document.createElement('button');
      sh.type = 'button';
      sh.setAttribute('aria-label', 'Tirar foto');
      sh.style.cssText =
        'width:68px;height:68px;border-radius:50%;border:4px solid #fff;background:#fff;box-shadow:inset 0 0 0 4px #000;cursor:pointer;flex:0 0 auto';
      bar.appendChild(sh);
      var rc0 = document.createElement('div');
      rc0.style.cssText = 'display:flex;justify-content:flex-end';
      if (caps && caps.torch) {
        var tOn = TOR0,
          tb = document.createElement('button');
        tb.type = 'button';
        tb.style.cssText = CIRC;
        var tsync = function () {
          tb.innerHTML = ITOR(tOn);
          tb.style.background = tOn ? '#ffd54a' : 'rgba(255,255,255,.18)';
          tb.style.color = tOn ? '#000' : '#fff';
          tb.setAttribute('aria-label', tOn ? 'Lanterna ligada' : 'Lanterna desligada');
          tb.setAttribute('aria-pressed', tOn ? 'true' : 'false');
        };
        tsync();
        tb.onclick = function () {
          tOn = !tOn;
          TOR0 = tOn;
          try {
            trk.applyConstraints({ advanced: [{ torch: tOn }] });
          } catch (e) {}
          tsync();
        };
        rc0.appendChild(tb);
      }
      bar.appendChild(rc0);
      var HR = null,
        HRtry = false;
      sh.onclick = function () {
        if (!HRtry) flashCamera(stg);
        if (opts.live) {
          var lc = grabStrip();
          if (!lc) return;
          if (LIVEX) LIVEX();
          lc.toBlob(
            function (bl) {
              if (!bl) return;
              camClose();
              opts.liveFallback(new File([bl], 'foto.jpg', { type: 'image/jpeg' }));
            },
            'image/jpeg',
            0.95
          );
          return;
        }
        if (!HR && !HRtry && !opts.strip && window.ImageCapture && trk && !window.__noIC) {
          HRtry = true;
          sh.style.opacity = '.5';
          var done0 = false,
            fin = function (x) {
              if (done0) return;
              done0 = true;
              clearTimeout(tm);
              if (!x) window.__noIC = true;
              HR = x || null;
              sh.style.opacity = '';
              sh.onclick();
              HR = null;
              HRtry = false;
            },
            tm = setTimeout(function () {
              fin(null);
            }, 3500);
          try {
            new ImageCapture(trk)
              .takePhoto()
              .then(function (bl) {
                return createImageBitmap(bl, { imageOrientation: 'from-image' });
              })
              .then(
                function (bm) {
                  var k0 = Math.min(1, 2600 / Math.max(bm.width, bm.height)),
                    cc = mkCanvas(Math.round(bm.width * k0), Math.round(bm.height * k0));
                  cc.getContext('2d').drawImage(bm, 0, 0, cc.width, cc.height);
                  try {
                    bm.close();
                  } catch (e) {}
                  fin(cc);
                },
                function () {
                  fin(null);
                }
              );
          } catch (e) {
            fin(null);
          }
          return;
        }
        var src = HR || vid,
          w = HR ? HR.width : vid.videoWidth,
          h = HR ? HR.height : vid.videoHeight;
        if (!w || !h) return;
        var c = mkCanvas(w, h);
        c.getContext('2d').drawImage(src, 0, 0, w, h);
        if (opts.strip) {
          var sr = stg.getBoundingClientRect(),
            gr = gd.getBoundingClientRect(),
            SW = sr.width,
            SH = sr.height,
            k = Math.min(SW / w, SH / h),
            ox = (SW - w * k) / 2,
            oy = (SH - h * k) / 2,
            cx = Math.max(0, (gr.left - sr.left - ox) / k),
            cy = Math.max(0, (gr.top - sr.top - oy) / k),
            cw = Math.min(w - cx, gr.width / k),
            ch = Math.min(h - cy, gr.height / k);
          if (cw > 50 && ch > 20) {
            var c2 = mkCanvas(cw, ch);
            c2.getContext('2d').drawImage(c, cx, cy, cw, ch, 0, 0, cw, ch);
            c = c2;
          }
        }
        var sp = sharpOf(c);
        c.toBlob(
          function (bl) {
            if (!bl) return;
            var url = URL.createObjectURL(bl);
            pv.src = url;
            pv.style.display = 'block';
            gd.style.display = 'none';
            tip.style.display = 'none';
            vid.pause();
            bar.textContent = '';
            bar.style.cssText =
              'display:flex;align-items:center;justify-content:center;gap:18px;padding:14px 14px max(18px,env(safe-area-inset-bottom,0px));flex-wrap:wrap';
            var wm = mk(
              'div',
              '',
              sp < 25
                ? 'A foto parece desfocada. Refaça com mais luz e a peça mais firme.'
                : 'Confira se a peça está inteira e nítida.'
            );
            wm.style.cssText =
              'width:100%;text-align:center;font-size:14px;color:' + (sp < 25 ? '#ffc766' : '#fff');
            bar.appendChild(wm);
            bar.style.cssText =
              'display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px 10px;padding:12px 22px max(18px,env(safe-area-inset-bottom,0px))';
            wm.style.gridColumn = '1/-1';
            var IREF =
              '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3.5 4.5v4.8h4.8"/></svg>';
            var sp0 = document.createElement('div');
            bar.appendChild(sp0);
            var us = btn('mini', '', function () {
              var f = new File([bl], 'foto.jpg', { type: 'image/jpeg' });
              camClose();
              done(f);
            });
            us.innerHTML =
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg><span>Confirmar</span>';
            us.style.cssText =
              'height:56px;min-height:56px;padding:0 30px;border-radius:999px;border:none;background:var(--accent);color:#fff;font-weight:700;font-size:17px;display:inline-flex;align-items:center;gap:8px;cursor:pointer';
            us.setAttribute('aria-label', 'Confirmar foto');
            bar.appendChild(us);
            var re = document.createElement('button');
            re.type = 'button';
            re.setAttribute('aria-label', 'Refazer a foto');
            re.innerHTML = IREF;
            re.style.cssText = CIRC + ';justify-self:end';
            re.onclick = function () {
              URL.revokeObjectURL(url);
              pv.style.display = 'none';
              gd.style.display = '';
              tip.style.display = '';
              vid.play();
              buildBar(trk, caps);
            };
            bar.appendChild(re);
          },
          'image/jpeg',
          0.95
        );
      };
    }
    var TIP0 = tip.textContent;
    tip.textContent = 'Abrindo a câmera…';
    var gum = setTimeout(function () {
      if (CAMO && !CAMS) {
        camClose();
        camFallback(opts.liveFallback || done, opts.gallery, opts.live ? 'Analisando código' : '');
      }
    }, 25000);
    var gtry = 0,
      gumC = function () {
        return navigator.mediaDevices
          .getUserMedia({
            audio: false,
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              frameRate: { ideal: 30 }
            }
          })
          .catch(function (e) {
            if (CAMO && gtry++ < 2) {
              return new Promise(function (r) {
                setTimeout(r, 700 * gtry);
              }).then(function () {
                if (!CAMO) throw e;
                return gumC();
              });
            }
            throw e;
          });
      };
    gumC().then(
      function (st) {
        clearTimeout(gum);
        if (!CAMO) {
          st.getTracks().forEach(function (t) {
            t.stop();
          });
          return;
        }
        CAMS = st;
        tip.textContent = TIP0;
        vid.srcObject = st;
        var trk = st.getVideoTracks()[0],
          caps = {};
        try {
          caps = trk.getCapabilities ? trk.getCapabilities() : {};
        } catch (e) {}
        try {
          if (caps.focusMode && caps.focusMode.indexOf('continuous') >= 0)
            trk.applyConstraints({ advanced: [{ focusMode: 'continuous' }] });
        } catch (e) {}
        stg.addEventListener('click', function (ev) {
          var rc = stg.getBoundingClientRect(),
            x = ev.clientX - rc.left,
            y = ev.clientY - rc.top;
          ring.style.left = x + 'px';
          ring.style.top = y + 'px';
          ring.style.opacity = '1';
          setTimeout(function () {
            ring.style.opacity = '0';
          }, 700);
          try {
            if (caps.focusMode && caps.focusMode.indexOf('single-shot') >= 0) {
              var vr = vid.getBoundingClientRect();
              trk
                .applyConstraints({
                  advanced: [
                    {
                      focusMode: 'single-shot',
                      pointsOfInterest: [
                        {
                          x: Math.max(0, Math.min(1, (ev.clientX - vr.left) / vr.width)),
                          y: Math.max(0, Math.min(1, (ev.clientY - vr.top) / vr.height))
                        }
                      ]
                    }
                  ]
                })
                .then(
                  function () {
                    setTimeout(function () {
                      try {
                        if (caps.focusMode.indexOf('continuous') >= 0)
                          trk.applyConstraints({ advanced: [{ focusMode: 'continuous' }] });
                      } catch (e) {}
                    }, 1500);
                  },
                  function () {}
                );
            }
          } catch (e) {}
        });
        buildBar(trk, caps);
        if (opts.live) startLive();
      },
      function (e) {
        clearTimeout(gum);
        camClose();
        HCAM = (e && (e.name || e.message)) || '';
        camFallback(opts.liveFallback || done, opts.gallery, opts.live ? 'Analisando código' : '');
      }
    );
    function grabStrip() {
      var w = vid.videoWidth,
        h = vid.videoHeight;
      if (!w || !h) return null;
      var sr = stg.getBoundingClientRect(),
        gr = gd.getBoundingClientRect(),
        SW = sr.width,
        SH = sr.height,
        k = Math.min(SW / w, SH / h),
        ox = (SW - w * k) / 2,
        oy = (SH - h * k) / 2,
        cx = Math.max(0, (gr.left - sr.left - ox) / k),
        cy = Math.max(0, (gr.top - sr.top - oy) / k),
        cw = Math.min(w - cx, gr.width / k),
        ch = Math.min(h - cy, gr.height / k);
      if (cw < 50 || ch < 20) return null;
      var c = mkCanvas(cw, ch);
      c.getContext('2d').drawImage(vid, cx, cy, cw, ch, 0, 0, cw, ch);
      return c;
    }
    function startLive() {
      var texts = [],
        fr = 0,
        t0 = Date.now(),
        stopped = false,
        LW = null;
      LIVEX = function () {
        stopped = true;
        try {
          dw._stop();
        } catch (e) {}
      };
      var dw = busyEl('Analisando código'),
        dx = document.createElement('span');
      tip.textContent = '';
      tip.appendChild(dw);
      tip.appendChild(dx);
      var fin = function (v) {
        if (stopped) return;
        stopped = true;
        try {
          dw._stop();
        } catch (e) {}
        try {
          if (LW) LW.setParameters({ tessedit_pageseg_mode: '11' });
        } catch (e) {}
        if (!CAMO) return;
        camClose();
        opts.live(v);
      };
      getWorker()
        .then(function (w) {
          LW = w;
          return w.setParameters({ tessedit_pageseg_mode: '6' });
        })
        .then(
          function () {
            (function tick() {
              if (stopped || !CAMO) return;
              var sc = grabStrip();
              if (!sc) {
                setTimeout(tick, 200);
                return;
              }
              (function () {
                var est = 0;
                try {
                  est = skewOf(sc);
                } catch (e) {}
                var ang = fr % 2 === 0 ? est : [0, -9, 9][(fr >> 1) % 3];
                return LW.recognize(prepVar(ang ? rotateCanvas(sc, -ang) : sc, fr % 4));
              })().then(
                function (r) {
                  fr++;
                  texts.push(r.data.text || '');
                  var v = parseVote(texts);
                  dx.textContent = (v.ref ? ' · ' + v.ref : '') + (v.med ? ' · ' + v.med : '');
                  if (v.ref && v.nRef >= 2 && (v.nMed >= 2 || fr >= 8)) {
                    fin({ ref: v.ref, med: v.med, vr: v.vr });
                    return;
                  }
                  if (Date.now() - t0 > 30000) {
                    fin(
                      v.ref
                        ? { ref: v.ref, med: v.med, vr: v.vr }
                        : v.med || v.vr
                          ? { ref: '', med: v.med, vr: v.vr }
                          : null
                    );
                    return;
                  }
                  setTimeout(tick, 220);
                },
                function () {
                  setTimeout(tick, 400);
                }
              );
            })();
          },
          function (e) {
            HERR = (e && (e.code || e.message)) || String(e);
            fin(null);
          }
        );
    }
  }
  // ===== Leitor de código: diálogos e fluxo de cadastro por foto. =====
  var HADD = false,
    HMED = '',
    HVR = '',
    HERR = '';
  // Dica para abrir por https e liberar a câmera.
  function httpsHint() {
    return /^https?:$/.test(location.protocol)
      ? ''
      : ' Dica: você abriu o app pelo gerenciador de arquivos. Abra por um endereço https (ou instale o app), senão a câmera própria e o leitor de texto não funcionam.';
  }
  /* ===== Câmera em 2 passos: 1) lê o código da haste  2) foto da armação inteira ===== */
  var PRESET = null;

  /* ===== Leitor: aponta para o código da haste e mostra o produto ou sugere cadastrar ===== */
  function leitorDlg(build) {
    loadMsg(false);
    var o = $('leitorDlg');
    if (o) o.remove();
    var ov = document.createElement('div');
    ov.id = 'leitorDlg';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.style.cssText =
      'position:fixed;inset:0;z-index:320;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;padding:16px';
    var bx = document.createElement('div');
    bx.style.cssText =
      'background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px;width:min(94vw,440px);max-height:92vh;overflow:auto;display:flex;flex-direction:column;gap:10px';
    build(bx, function () {
      ov.remove();
    });
    ov.appendChild(bx);
    document.body.appendChild(ov);
  }
  var LM = null;
  // Aviso animado de carregamento.
  function loadMsg(on, txt, cap) {
    /* aviso animado padrão (mesmo do leitor) */
    try {
      if (LM && LM.parentNode) LM.parentNode.removeChild(LM);
      LM = null;
      clearTimeout(loadMsg._t);
      clearTimeout(armReturn._t);
      if (!on) return;
      var d = document.createElement('div');
      d.id = 'loadFoto';
      d.style.cssText =
        'position:fixed;left:0;right:0;top:calc(env(safe-area-inset-top,0px) + 70px);z-index:99999;display:flex;justify-content:center;pointer-events:none';
      var pl = document.createElement('div');
      pl.className = 'busyPill';
      pl.appendChild(busyEl(txt || 'Carregando foto'));
      d.appendChild(pl);
      document.body.appendChild(d);
      LM = d;
      loadMsg._t = setTimeout(function () {
        if (LM === d) loadMsg(false);
      }, cap || 20000);
    } catch (e) {}
  }
  // Nome e custo já conhecidos de um código.
  function refInfo(ref) {
    /* nome e custo já conhecidos de um código do estoque */
    var k = hKey(ref),
      its = S.items.filter(function (i) {
        return i.ref && hKey(i.ref) === k;
      }),
      r = {},
      i,
      c;
    if (S.pnome && S.pnome[its.length ? its[0].ref : ref])
      r.nome = S.pnome[its.length ? its[0].ref : ref];
    for (i = 0; i < its.length; i++) {
      c = Number(effCusto(its[i]));
      if (c > 0) {
        r.custo = String(Math.round(c * 10000) / 10000);
        break;
      }
    }
    return r;
  }
  // Leva os dados lidos para o cadastro.
  function fillAdd(o) {
    /* leva os dados lidos/conhecidos para o formulário de cadastro */
    if (o.tipo && o.tipo !== S.tipo) {
      S.tipo = o.tipo;
      S.fmtF = 'all';
      S.corF = 'all';
      S.q = '';
      S.open = '';
      S.det = false;
      S.selItem = null;
      S.qty = 1;
      S.eRefV = '';
    }
    $('eRef').value = o.ref || '';
    if (o.med) $('eMed').value = o.med;
    if (o.fmt) S.eFmt = o.fmt;
    if (o.cor) $('eCor').value = o.cor;
    if (o.vr && /^C(?:1[0-2]|[1-9])$/.test(o.vr)) {
      ensureVar(o.vr);
      if (S.tipo === 'pre') S.eVarP = o.vr;
      else S.eVar = o.vr;
    }
    S.msg = o.msg || '';
    render();
    try {
      if (o.nome && $('eNome')) $('eNome').value = o.nome;
      if (o.custo && $('eCusto')) $('eCusto').value = o.custo;
    } catch (e) {}
    if (!o.noscroll)
      try {
        $('eRef').scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (e) {}
  }
  // Mostra o resultado da leitura.
  function leitorResult(x) {
    loadMsg(false);
    if (!x || !x.ref) {
      leitorDlg(function (bx, close) {
        bx.appendChild(mk('b', '', 'Código não detectado'));
        var dbg = (window.__lastTexts || [])
          .join(' ')
          .replace(/[^A-Za-z0-9□\-\. ]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 110);
        bx.appendChild(
          mk(
            'div',
            'hint',
            'Não consegui ler o código' +
              (x && (x.med || x.vr)
                ? ' (só vi ' + [x.med, x.vr].filter(Boolean).join(' · ') + ')'
                : '') +
              '. Aproxime a haste, deixe o texto na faixa, com boa luz e sem reflexo, e toque na tela para focar.' +
              (HERR ? ' (leitor: ' + HERR + ')' : '') +
              httpsHint()
          )
        );
        if (dbg) {
          var dd = mk('div', 'hint', 'O leitor viu: ' + dbg);
          dd.style.opacity = '.7';
          bx.appendChild(dd);
          if (window.__lastPrep && window.__lastPrep.length) {
            var vb = btn('chip', 'Ver a imagem que o leitor analisou', function () {
              vb.remove();
              window.__lastPrep.slice(0, 3).forEach(function (cv) {
                try {
                  var im = document.createElement('img');
                  im.src = cv.toDataURL('image/jpeg', 0.6);
                  im.style.cssText =
                    'width:100%;border:1px solid var(--line);border-radius:8px;margin-top:6px';
                  bx.insertBefore(im, bx.children[bx.children.length - 2]);
                } catch (e) {}
              });
            });
            vb.style.cssText += ';width:100%;justify-content:center';
            bx.appendChild(vb);
          }
        }
        var a = btn('mini', 'Tentar de novo', function () {
          close();
          var wi =
            NATIVE &&
            $('btnLeitor') &&
            $('btnLeitor').parentNode &&
            $('btnLeitor').parentNode.querySelector('input[type=file]');
          if (wi) {
            wi.click();
            return;
          }
          leitorOpen();
        });
        a.style.width = '100%';
        var c2 = btn('chip', 'Cancelar', close);
        c2.style.cssText += ';width:100%;justify-content:center';
        bx.appendChild(a);
        bx.appendChild(c2);
      });
      return;
    }
    var key = hKey(x.ref),
      its = S.items.filter(function (i) {
        return i.ref && hKey(i.ref) === key;
      }),
      near = false;
    if (!its.length && key.length >= 5) {
      var cand = {};
      S.items.forEach(function (i) {
        if (i.ref) {
          var k2 = hKey(i.ref);
          if (
            k2.length !== key.length &&
            Math.abs(k2.length - key.length) <= 1 &&
            lev(k2, key) <= 1
          )
            cand[i.ref] = 1;
        }
      });
      var cs = Object.keys(cand);
      if (cs.length === 1) {
        its = S.items.filter(function (i) {
          return i.ref === cs[0];
        });
        near = true;
      }
    }
    if (its.length) {
      var f0 = its[0],
        tot = its.reduce(function (a, i) {
          return a + i.qty;
        }, 0),
        tp = tipoOf(f0.tipo);
      leitorDlg(function (bx, close) {
        bx.appendChild(mk('b', '', near ? 'Parece este produto' : 'Produto já cadastrado'));
        if (near) {
          var nt = mk(
            'div',
            'hint',
            'Li “' + x.ref + '”, mas o mais parecido do estoque é este. Confirme olhando a peça.'
          );
          nt.style.color = 'var(--warn)';
          bx.appendChild(nt);
        }
        var cd = document.createElement('div');
        cd.style.cssText = 'display:flex;gap:12px;align-items:flex-start';
        var pb = photoBox(photoOf(f0.ref), 'pbox');
        pb.style.cssText += ';width:110px;flex:0 0 110px';
        cd.appendChild(pb);
        var tx = document.createElement('div');
        tx.style.cssText = 'display:flex;flex-direction:column;gap:4px;min-width:0';
        tx.appendChild(mk('b', '', pn(f0.ref)));
        if (S.pnome && S.pnome[f0.ref]) tx.appendChild(mk('span', 's', 'Código ' + f0.ref));
        tx.appendChild(
          mk(
            'span',
            's',
            (tp ? tp.label : '') +
              (f0.fmt && !f0.bulk ? ' · ' + f0.fmt : '') +
              (f0.med ? ' · ' + f0.med : '')
          )
        );
        tx.appendChild(mk('span', 'cell', tot + ' em estoque'));
        cd.appendChild(tx);
        bx.appendChild(cd);
        var vs = document.createElement('div');
        vs.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap';
        its.forEach(function (i) {
          vs.appendChild(
            mk(
              'span',
              'chip',
              (i.cor || 'Sem cor') + (i.vr ? ' · ' + i.vr : '') + ' · ' + i.qty + ' un.'
            )
          );
        });
        bx.appendChild(vs);
        var ad = btn('mini', 'Adicionar', function () {
          close();
          fillAdd(
            Object.assign(refInfo(f0.ref), {
              tipo: f0.tipo,
              ref: f0.ref,
              med: f0.med,
              fmt: f0.fmt,
              cor: f0.cor,
              vr: f0.vr,
              msg: 'Produto já cadastrado: escolha a cor e a quantidade e toque em Adicionar.'
            })
          );
        });
        ad.style.width = '100%';
        var ca = btn('chip', 'Cancelar', close);
        ca.style.cssText += ';width:100%;justify-content:center';
        bx.appendChild(ad);
        bx.appendChild(ca);
      });
      return;
    }
    leitorDlg(function (bx, close) {
      bx.appendChild(mk('b', '', 'Código novo'));
      bx.appendChild(
        mk(
          'div',
          'hint',
          'Esse código não está no estoque. Quer cadastrar? Confira o que li e corrija se precisar.'
        )
      );
      var simL = simRefs(x.ref);
      simL.slice(0, 2).forEach(function (z) {
        var wn = mk(
          'div',
          'hint',
          'Código parecido com ' +
            z.ref +
            ' (“' +
            z.nome +
            '”). Se for outro modelo do mesmo grupo, cadastre com o mesmo nome de produto.'
        );
        wn.style.color = 'var(--warn)';
        bx.appendChild(wn);
      });
      function fld(l, v) {
        bx.appendChild(mk('div', 'lbl', l));
        var i = document.createElement('input');
        i.className = 'in';
        i.value = v || '';
        i.autocomplete = 'off';
        bx.appendChild(i);
        return i;
      }
      var fr = fld('Código', x.ref),
        fm = fld('Medidas', x.med),
        vr = x.vr || '';
      bx.appendChild(mk('div', 'lbl', 'Cor (C1 a C6)'));
      var cr = document.createElement('div');
      cr.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap';
      function drawC() {
        cr.textContent = '';
        varChips(vr).forEach(function (c) {
          cr.appendChild(
            btn(
              'chip' + (vr === c ? ' on' : ''),
              c,
              function () {
                vr = vr === c ? '' : c;
                drawC();
              },
              vr === c
            )
          );
        });
      }
      drawC();
      bx.appendChild(cr);
      var ad = btn('mini', 'Cadastrar produto', function () {
        close();
        fillAdd({
          ref: fr.value.trim().toUpperCase().replace(/\s+/g, ''),
          med: fm.value.trim(),
          vr: vr,
          msg: 'Código lido: confira os dados, escolha a quantidade e toque em Adicionar.'
        });
      });
      ad.style.width = '100%';
      simL.slice(0, 2).forEach(function (z) {
        var sb = btn('chip', 'Cadastrar com o nome “' + z.nome + '”', function () {
          close();
          fillAdd({
            ref: fr.value.trim().toUpperCase().replace(/\s+/g, ''),
            med: fm.value.trim(),
            vr: vr,
            nome: z.nome,
            msg: 'Mesmo nome de produto que ' + z.ref + ': confira os dados e toque em Adicionar.'
          });
        });
        sb.style.cssText += ';width:100%;justify-content:center;min-height:44px';
        bx.appendChild(sb);
      });
      var ca = btn('chip', 'Cancelar', close);
      ca.style.cssText += ';width:100%;justify-content:center';
      bx.appendChild(ad);
      bx.appendChild(ca);
    });
  }
  /* texto com pontinhos animados: "Analisando código." → ".." → "..." (para sozinho quando o elemento sai da tela) */
  function dotsText(prefix) {
    var w = document.createElement('span'),
      t = document.createElement('span'),
      d = document.createElement('span'),
      n = 0;
    t.textContent = prefix;
    d.textContent = '.';
    d.style.cssText = 'display:inline-block;min-width:1.2em;text-align:left';
    w.appendChild(t);
    w.appendChild(d);
    var iv = setInterval(function () {
      if (!w.isConnected && n > 1) {
        clearInterval(iv);
        return;
      }
      n++;
      d.textContent = ['.', '..', '...'][n % 3];
    }, 420);
    w._stop = function () {
      clearInterval(iv);
    };
    return w;
  }
  /* aviso de carregamento padrão do app: círculo girando + texto com pontinhos */
  function busyEl(prefix) {
    var w = document.createElement('span');
    w.className = 'busy';
    var dt = dotsText(String(prefix).replace(/[….]+\s*$/, ''));
    w.appendChild(dt);
    w._stop = dt._stop;
    w.setAttribute('role', 'status');
    return w;
  }
  // Lê o código de uma foto.
  function leitorFromPhoto(f) {
    loadMsg(true, 'Analisando código', 75000);
    (window.createImageBitmap
      ? createImageBitmap(f, { imageOrientation: 'from-image' })
      : Promise.reject()
    )
      .then(function (bm) {
        var c = mkCanvas(bm.width, bm.height);
        c.getContext('2d').drawImage(bm, 0, 0);
        return preRead(c, '11');
      })
      .catch(function () {
        return null;
      })
      .then(leitorResult);
  }
  // Abre a câmera do leitor de código.
  function leitorOpen() {
    camOpen(function () {}, 'Leitor de código', {
      strip: true,
      gallery: true,
      live: leitorResult,
      liveFallback: leitorFromPhoto,
      tip: 'Aponte para o código da haste e deixe o texto dentro da faixa. A leitura é automática, sem tirar foto.'
    });
  }
  $('btnLeitor').onclick = leitorOpen;
  try {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) armNative();
  } catch (e) {}
  // Aplica a leitura prévia ao cartão da foto.
  function applyPre(x, tok) {
    if (!P || P.tok !== tok || !x) return;
    var got = [];
    if (x.ref && !$('phRef').value.trim()) {
      $('phRef').value = x.ref;
      got.push(x.ref);
    }
    if (x.med && !$('phMed').value.trim()) {
      $('phMed').value = x.med;
      got.push(x.med);
    }
    if (/^C(?:1[0-2]|[1-9])$/.test(x.vr || '') && !P.photoOnly) {
      ensureVar(x.vr);
      P.vr = x.vr;
      got.push(x.vr);
    }
    if (got.length)
      setRead(
        'Li na foto: ' +
          got.join(' · ') +
          '.' +
          (x.ref
            ? ''
            : ' Não consegui o código: toque em "Foto de perto só do código" ou digite.') +
          ' Confira antes de confirmar.',
        x.ref ? 'n-ok' : 'n-warn'
      );
    render();
  }
  // Segundo passo: foto da peça após ler o código.
  function step2(pre) {
    PRESET = pre && (pre.ref || pre.med || pre.vr) ? pre : null;
    camOpen(
      function (f) {
        S.photoFor = null;
        $('file').onchange({ target: { files: [f] } });
      },
      '2/2 · Foto da armação inteira',
      {
        gallery: true,
        tip: 'Ponha a armação inteira sobre uma folha branca, dentro do retângulo. Toque na tela para focar.'
      }
    );
  }
  // Diálogo para confirmar o código lido.
  function codeDialog(res, note) {
    var ov = document.createElement('div');
    ov.id = 'codeDlg';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.style.cssText =
      'position:fixed;inset:0;z-index:320;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;padding:16px';
    var bx = document.createElement('div');
    bx.style.cssText =
      'background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px;width:min(94vw,440px);max-height:92vh;overflow:auto;display:flex;flex-direction:column;gap:10px';
    bx.appendChild(mk('b', '', '1/2 · Código lido'));
    var n = mk('div', 'hint', note);
    n.style.color = res && res.ref ? 'var(--ok)' : 'var(--warn)';
    bx.appendChild(n);
    function fld(l, v, ph) {
      bx.appendChild(mk('div', 'lbl', l));
      var i = document.createElement('input');
      i.className = 'in';
      i.value = v || '';
      i.placeholder = ph;
      i.autocomplete = 'off';
      bx.appendChild(i);
      return i;
    }
    var fr = fld('Código (o que fica na haste)', res && res.ref, 'Ex.: PY-566'),
      fm = fld('Medidas', res && res.med, 'Ex.: 55□19-142'),
      vr = (res && res.vr) || '';
    bx.appendChild(mk('div', 'lbl', 'Classificação de cor (opcional)'));
    var cr = document.createElement('div');
    cr.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap';
    function drawC() {
      cr.textContent = '';
      varChips(vr).forEach(function (c) {
        cr.appendChild(
          btn(
            'chip' + (vr === c ? ' on' : ''),
            c,
            function () {
              vr = vr === c ? '' : c;
              drawC();
            },
            vr === c
          )
        );
      });
    }
    drawC();
    bx.appendChild(cr);
    var go = btn('mini', 'Continuar: foto da armação inteira', function () {
      ov.remove();
      step2({
        ref: fr.value.trim().toUpperCase().replace(/\s+/g, ''),
        med: fm.value.trim(),
        vr: vr
      });
    });
    go.style.width = '100%';
    var re = btn('chip', 'Refazer a leitura', function () {
      ov.remove();
      smartAdd();
    });
    re.style.cssText += ';width:100%;justify-content:center';
    bx.appendChild(go);
    bx.appendChild(re);
    ov.appendChild(bx);
    document.body.appendChild(ov);
  }
  // Adicionar peça: foto → leitura → cadastro.
  function smartAdd() {
    camOpen(
      function (f) {
        var st = document.createElement('div');
        st.id = 'codeDlg';
        st.style.cssText =
          'position:fixed;inset:0;z-index:320;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px';
        st.textContent = 'Lendo o código…';
        document.body.appendChild(st);
        (window.createImageBitmap ? createImageBitmap(f) : Promise.reject())
          .then(function (bm) {
            var c = mkCanvas(bm.width, bm.height);
            c.getContext('2d').drawImage(bm, 0, 0);
            return preRead(c);
          })
          .catch(function () {
            return null;
          })
          .then(function (res) {
            st.remove();
            codeDialog(
              res,
              res && res.ref
                ? 'Confira e corrija se precisar.'
                : 'Não consegui ler o código' +
                    (HERR ? ' (o leitor não iniciou: ' + HERR + ')' : '') +
                    '. Digite abaixo, ou toque em Continuar para seguir só com a foto. O leitor precisa de internet na primeira vez.' +
                    httpsHint()
            );
          });
      },
      '1/2 · Código da haste',
      {
        strip: true,
        gallery: true,
        tip: 'Aproxime a haste e alinhe o texto dentro da faixa. Toque na tela para focar.',
        skip: function () {
          step2(null);
        },
        skipTxt: 'Pular leitura'
      }
    );
  }

  /* leitura tolerante: junta o texto sem espaços/quebras e procura CÓDIGO + medidas (o quadradinho pode virar 0, 4 ou sumir) */
  // ===== Leitor de haste: interpretação do texto lido (código, medida, variação). =====
  // Interpreta o texto corrido da haste.
  function flatParse(t) {
    var F = String(t)
        .toUpperCase()
        .replace(/[□▢▯]/g, '0')
        .replace(/[^A-Z0-9]/g, ''),
      m,
      re = /([A-Z]{2,3})([0-9OQDILZSGB]{3,5}?)(\d{2})[A-Z0]?(\d{2})(1[2-6]\d)(?:C(1[0-2]|[1-9]))?/g,
      best = null;
    var G = F.replace(/O/g, '0');
    while ((m = re.exec(G))) {
      var ln = +m[3],
        br = +m[4],
        tp = +m[5];
      if (ln >= 38 && ln <= 66 && br >= 12 && br <= 26 && /^\d+$/.test(m[2])) {
        best = {
          ref: m[1] + '-' + m[2],
          med: m[3] + '□' + m[4] + '-' + m[5],
          vr: m[6] ? 'C' + m[6] : ''
        };
        break;
      }
      re.lastIndex = m.index + 1;
    }
    if (!best) {
      re = /(\d{2})0?(\d{2})(1[2-6]\d)(?:C(1[0-2]|[1-9]))?/g;
      while ((m = re.exec(G))) {
        var l2 = +m[1],
          b2 = +m[2],
          t2 = +m[3];
        if (l2 >= 38 && l2 <= 66 && b2 >= 12 && b2 <= 26) {
          best = { ref: '', med: m[1] + '□' + m[2] + '-' + m[3], vr: m[4] ? 'C' + m[4] : '' };
          break;
        }
        re.lastIndex = m.index + 1;
      }
    }
    return best;
  }
  // Extrai código, medida e variação da haste.
  function parseHaste(texts) {
    var o = { ref: '', med: '', vr: '' };
    for (var a = 0; a < texts.length && !o.med; a++) {
      var ls = String(texts[a]).toUpperCase().split(/\n+/);
      for (var b = 0; b < ls.length; b++) {
        var L = ls[b].replace(/[□▢▯\[\]|]/g, '0').replace(/[‐‑–—]/g, '-'),
          m = L.match(
            /(?:([A-Z]{1,4}\s?-?\s?[0-9OQDILZSGB]{2,6}[A-Z]?)[.,:;]?\s+)?(\d{2})\s?(?:[0OQD][1IL]?)?\s?(\d{2})\s?[-.]?\s?(1[2-6]\d)(?!\d)(?:\s*(C\s?(?:1[0-2]|[1-9S]))(?!\d))?/
          );
        if (!m) continue;
        var ln = +m[2],
          br = +m[3],
          tp = +m[4];
        if (!(ln >= 38 && ln <= 66 && br >= 12 && br <= 26 && tp >= 120 && tp <= 160)) continue;
        o.med = m[2] + '□' + m[3] + '-' + m[4];
        if (m[1]) {
          var rf = m[1].replace(/\s+/g, ''),
            q = rf.match(/^([A-Z]{1,4})(-?)([0-9OQDILZSGB]{2,6})([A-Z]?)$/);
          if (q) {
            var dg = /^\d+$/.test(q[3]) ? q[3] : fixDigits(q[3]);
            if (/^\d+$/.test(dg)) o.ref = q[1] + q[2] + dg + q[4];
          }
        }
        if (!o.ref) {
          var pre = L.slice(0, m.index + (m[1] ? 0 : 0)),
            q2 = pre.match(/([A-Z]{1,4}-?[0-9OQDILZSGB]{2,6}[A-Z]?)[.,:;\s]*$/);
          if (q2) {
            var q3 = q2[1].match(/^([A-Z]{1,4})(-?)([0-9OQDILZSGB]{2,6})([A-Z]?)$/);
            if (q3) {
              var d3 = /^\d+$/.test(q3[3]) ? q3[3] : fixDigits(q3[3]);
              if (/^\d+$/.test(d3)) o.ref = q3[1] + q3[2] + d3 + q3[4];
            }
          }
        }
        if (m[5]) o.vr = 'C' + m[5].replace(/^C\s?/, '').replace('S', '5');
        else {
          var cm = L.match(/(?:^|[^A-Z])C\s?(1[0-2]|[1-9])(?!\d)/);
          if (cm) o.vr = 'C' + cm[1];
        }
        break;
      }
    }
    if (!o.med || !o.ref) {
      for (var fi = 0; fi < texts.length; fi++) {
        var fp = flatParse(texts[fi]);
        if (fp && (!o.med || fp.med === o.med)) {
          if (!o.med) o.med = fp.med;
          if (!o.ref && fp.ref) o.ref = fp.ref;
          if (!o.vr && fp.vr) o.vr = fp.vr;
          if (o.ref) break;
        }
      }
    }
    if (o.med && !o.ref) {
      texts.forEach(function (T) {
        String(T)
          .toUpperCase()
          .split(/[\s]+/)
          .forEach(function (w) {
            if (o.ref) return;
            var q = w.match(/^([A-Z]{1,4})(-?)([0-9OQDILZSGB]{2,6})([A-Z]?)$/);
            if (q && !/^C\d{1,2}$/.test(q[1] + q[3])) {
              var dg = /^\d+$/.test(q[3]) ? q[3] : fixDigits(q[3]);
              if (/^\d+$/.test(dg) && q[1] !== 'LA') o.ref = q[1] + q[2] + dg + q[4];
            }
          });
      });
    }
    if (o.ref) {
      var m3 = o.ref.match(/^([A-Z]{3,4})(-?\d.*)$/);
      if (m3) {
        var kn = { PY: 1, SP: 1, BR: 1, SL: 1, CX: 1 };
        try {
          (S.items || []).forEach(function (i) {
            var q = String(i.ref || '').match(/^[A-Z]{2}/);
            if (q) kn[q[0]] = 1;
          });
        } catch (e) {}
        var l2 = m3[1].slice(-2);
        if (kn[l2]) o.ref = l2 + m3[2];
      }
    }
    if (o.ref && /^[A-Z]-?\d/.test(o.ref)) {
      for (var f2 = 0; f2 < texts.length; f2++) {
        var p2 = flatParse(texts[f2]);
        if (
          p2 &&
          p2.ref &&
          p2.ref.replace(/^[A-Z]+-?/, '') === o.ref.replace(/^[A-Z]+-?/, '') &&
          p2.ref.replace(/-?\d.*$/, '').length >= 2
        ) {
          o.ref = p2.ref;
          break;
        }
      }
    }
    if (!o.vr) {
      for (var c = 0; c < texts.length && !o.vr; c++) {
        var cm2 = String(texts[c])
          .toUpperCase()
          .match(/(?:^|[^A-Z])C\s?(1[0-2]|[1-9])(?!\d)/);
        if (cm2) o.vr = 'C' + cm2[1];
      }
    }
    return o;
  }
  // Prefixo de código conhecido?
  function knownPre(p) {
    if (/^(PY|SP|BR|SL|CX)$/.test(p)) return true;
    try {
      return S.items.some(function (i) {
        return String(i.ref || '').indexOf(p) === 0 && /^[A-Z]{2}$/.test(p);
      });
    } catch (e) {
      return false;
    }
  }
  // Votação entre várias leituras.
  function parseVote(texts) {
    var tl = { ref: {}, med: {}, vr: {} },
      fr = 0;
    texts.forEach(function (t) {
      var o = parseHaste([t]);
      if (!(o.ref || o.med || o.vr)) return;
      fr++;
      ['ref', 'med', 'vr'].forEach(function (k) {
        if (o[k]) tl[k][o[k]] = (tl[k][o[k]] || 0) + 1;
      });
    });
    function top(m) {
      var b = '',
        n = 0;
      for (var k in m)
        if (m[k] > n) {
          b = k;
          n = m[k];
        }
      return [b, n];
    }
    /* agrupa por número do código: o OCR às vezes perde uma letra do prefixo (PY-568 → V-568); vale o prefixo de 2 letras */
    var grp = {},
      k;
    for (k in tl.ref) {
      var dg = k.replace(/^[A-Z]+-?/, ''),
        G = grp[dg] || (grp[dg] = { n: 0, best: '', sc: -1 });
      G.n += tl.ref[k];
      var pl = k.replace(/-?\d.*$/, '').length,
        kp = k.replace(/-?\d.*$/, ''),
        sc = (pl === 2 ? 100 : pl === 3 ? 50 : pl) + tl.ref[k] + (knownPre(kp) ? 200 : 0);
      if (sc > G.sc) {
        G.sc = sc;
        G.best = k;
      }
    }
    var ga = '',
      gn = 0;
    for (k in grp)
      if (grp[k].n > gn) {
        gn = grp[k].n;
        ga = grp[k].best;
      }
    var a = gn ? [ga, gn] : top(tl.ref),
      b = top(tl.med),
      c = top(tl.vr);
    return { ref: a[0], nRef: a[1], med: b[0], nMed: b[1], vr: c[0], nVr: c[1], frames: fr };
  }
  /* ===== leitor: inclinação do texto ===== */
  /* ângulo (graus, eixo y para baixo) da direção das linhas de texto/escuro: perfil de projeção sobre os pontos escuros */
  function skewOf(src) {
    var sc = Math.min(1, 380 / Math.max(src.width, src.height)),
      w = Math.max(16, Math.round(src.width * sc)),
      h = Math.max(16, Math.round(src.height * sc)),
      c = mkCanvas(w, h),
      g = c.getContext('2d');
    g.drawImage(src, 0, 0, w, h);
    var d = g.getImageData(0, 0, w, h).data,
      b = mkCanvas(w, h),
      bg = b.getContext('2d');
    bg.filter = 'blur(' + Math.max(3, Math.round(Math.min(w, h) / 28)) + 'px)';
    bg.drawImage(c, 0, 0);
    var m = bg.getImageData(0, 0, w, h).data,
      xs = [],
      ys = [],
      i,
      x,
      y;
    for (y = 1; y < h - 1; y += 1)
      for (x = 1; x < w - 1; x += 1) {
        i = (y * w + x) * 4;
        var L = d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11,
          M = m[i] * 0.3 + m[i + 1] * 0.59 + m[i + 2] * 0.11;
        if (M - L > 22) {
          xs.push(x);
          ys.push(y);
        }
      }
    var n = xs.length;
    if (n < 80) return 0;
    var st = Math.max(1, Math.floor(n / 12000)),
      best = 0,
      bs = -1,
      s0 = 0,
      a,
      k,
      diag = Math.ceil(Math.sqrt(w * w + h * h)) + 4,
      hist = new Float32Array(diag * 2 + 8);
    for (a = -40; a <= 40; a += 2) {
      var co = Math.cos((a * Math.PI) / 180),
        si = Math.sin((a * Math.PI) / 180);
      hist.fill(0);
      for (k = 0; k < n; k += st) {
        var yy = Math.round(ys[k] * co - xs[k] * si) + diag;
        hist[yy]++;
      }
      var sc2 = 0;
      for (k = 0; k < hist.length; k++) sc2 += hist[k] * hist[k];
      if (a === 0) s0 = sc2;
      if (sc2 > bs) {
        bs = sc2;
        best = a;
      }
    }
    return bs > s0 * 1.12 ? best : 0;
  }
  window.__prepVar = function (c, k) {
    return prepVar(c, k);
  };
  window.__getWorker = function () {
    return getWorker();
  };
  window.__rotateCanvas = function (c, d) {
    return rotateCanvas(c, d);
  };
  // Gira o canvas em graus.
  function rotateCanvas(src, deg) {
    if (!deg) return src;
    var r = (deg * Math.PI) / 180,
      co = Math.abs(Math.cos(r)),
      si = Math.abs(Math.sin(r)),
      W = src.width,
      H = src.height,
      nw = Math.round(W * co + H * si),
      nh = Math.round(W * si + H * co),
      c = mkCanvas(nw, nh),
      g = c.getContext('2d'),
      px = mkCanvas(1, 1),
      pg = px.getContext('2d');
    pg.drawImage(src, 0, 0, 1, 1);
    var q = pg.getImageData(0, 0, 1, 1).data;
    g.fillStyle = 'rgb(' + q[0] + ',' + q[1] + ',' + q[2] + ')';
    g.fillRect(0, 0, nw, nh);
    g.translate(nw / 2, nh / 2);
    g.rotate(r);
    g.drawImage(src, -W / 2, -H / 2);
    window.__skewOf = skewOf;
    return c;
  }
  // ===== Leitor de haste: pré-processamento da imagem para o OCR. =====
  // Variante pré-processada da imagem para o OCR.
  function prepVar(src, k, mw, mxs) {
    var W = src.width,
      H = src.height,
      sc = Math.max(0.4, Math.min(mxs || 2, (mw || 1300) / Math.max(W, H * 0.75))),
      c = mkCanvas(W * sc, H * sc),
      g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(src, 0, 0, c.width, c.height);
    var d = g.getImageData(0, 0, c.width, c.height),
      a = d.data,
      n = c.width * c.height,
      hist = new Uint32Array(256),
      i,
      v;
    for (i = 0; i < n; i++) {
      v = (a[i * 4] * 0.299 + a[i * 4 + 1] * 0.587 + a[i * 4 + 2] * 0.114) | 0;
      a[i * 4] = v;
      hist[v]++;
    }
    var lo = 0,
      hi = 255,
      acc = 0,
      cut = n * 0.01;
    for (i = 0; i < 256; i++) {
      acc += hist[i];
      if (acc > cut) {
        lo = i;
        break;
      }
    }
    acc = 0;
    for (i = 255; i >= 0; i--) {
      acc += hist[i];
      if (acc > cut) {
        hi = i;
        break;
      }
    }
    var kk = 255 / Math.max(20, hi - lo),
      gr = new Uint8Array(n);
    for (i = 0; i < n; i++) gr[i] = Math.max(0, Math.min(255, ((a[i * 4] - lo) * kk) | 0));
    var out = new Uint8Array(n),
      w = c.width,
      h = c.height;
    if (k === 4 || k === 5) {
      var ij = new Float64Array((w + 1) * (h + 1)),
        x2,
        y2,
        r2 = Math.max(9, Math.round(Math.min(w, h) * 0.03));
      for (y2 = 0; y2 < h; y2++) {
        var rs2 = 0;
        for (x2 = 0; x2 < w; x2++) {
          rs2 += gr[y2 * w + x2];
          ij[(y2 + 1) * (w + 1) + x2 + 1] = ij[y2 * (w + 1) + x2 + 1] + rs2;
        }
      }
      for (y2 = 0; y2 < h; y2++) {
        var ya = Math.max(0, y2 - r2),
          yb = Math.min(h, y2 + r2 + 1);
        for (x2 = 0; x2 < w; x2++) {
          var xa = Math.max(0, x2 - r2),
            xb = Math.min(w, x2 + r2 + 1),
            sm2 =
              ij[yb * (w + 1) + xb] -
              ij[ya * (w + 1) + xb] -
              ij[yb * (w + 1) + xa] +
              ij[ya * (w + 1) + xa],
            mn2 = sm2 / ((yb - ya) * (xb - xa)),
            df = gr[y2 * w + x2] - mn2;
          out[y2 * w + x2] = (k === 4 ? df > 9 : df < -9) ? 0 : 255;
        }
      }
    } else if (k === 1) {
      var ii = new Float64Array((w + 1) * (h + 1)),
        x,
        y,
        rr = Math.max(8, Math.round(h * 0.25));
      for (y = 0; y < h; y++) {
        var rs = 0;
        for (x = 0; x < w; x++) {
          rs += gr[y * w + x];
          ii[(y + 1) * (w + 1) + x + 1] = ii[y * (w + 1) + x + 1] + rs;
        }
      }
      for (y = 0; y < h; y++) {
        var y0 = Math.max(0, y - rr),
          y1 = Math.min(h, y + rr + 1);
        for (x = 0; x < w; x++) {
          var x0 = Math.max(0, x - rr),
            x1 = Math.min(w, x + rr + 1),
            sm =
              ii[y1 * (w + 1) + x1] -
              ii[y0 * (w + 1) + x1] -
              ii[y1 * (w + 1) + x0] +
              ii[y0 * (w + 1) + x0],
            mn = sm / ((y1 - y0) * (x1 - x0));
          out[y * w + x] = gr[y * w + x] > mn + 24 ? 0 : 255;
        }
      }
    } else if (k === 6) {
      for (i = 0; i < n; i++) out[i] = gr[i];
    } else if (k === 0) {
      for (i = 0; i < n; i++) out[i] = gr[i] > 128 ? 255 : 0;
    } else if (k === 3) {
      for (i = 0; i < n; i++) out[i] = gr[i] > 128 ? 0 : 255;
    } else {
      for (i = 0; i < n; i++) out[i] = 255 - gr[i];
    }
    for (i = 0; i < n; i++) {
      a[i * 4] = a[i * 4 + 1] = a[i * 4 + 2] = out[i];
      a[i * 4 + 3] = 255;
    }
    g.putImageData(d, 0, 0);
    return c;
  }
  /* 2ª etapa do leitor: acha o código na imagem e relê só a linha dele, ampliada (melhora muito as medidas) */
  function tsvWords(t) {
    var o = [];
    String(t || '')
      .split('\n')
      .forEach(function (l) {
        var c = l.split('\t');
        if (c[0] === '5' && c.length >= 12)
          o.push({ x: +c[6], y: +c[7], w: +c[8], h: +c[9], cf: +c[10], t: c.slice(11).join('\t') });
      });
    return o;
  }
  // Refina a leitura de uma linha.
  function refineLine(w, an, tight) {
    var sc = an.src.width / an.pv.width,
      wd = an.wd,
      h = wd.h * sc,
      x0 = Math.max(0, wd.x * sc - h * (tight ? 0.4 : 2)),
      x1 = Math.min(
        an.src.width,
        (wd.x + wd.w) * sc +
          (tight ? Math.max(h * 14, wd.w * sc * 3.2) : Math.max(h * 20, wd.w * sc * 4.5))
      ),
      y0 = Math.max(0, wd.y * sc - h * (tight ? 0.7 : 1.5)),
      y1 = Math.min(an.src.height, (wd.y + wd.h) * sc + h * (tight ? 0.7 : 1.5)),
      cw = Math.max(8, Math.round(x1 - x0)),
      ch = Math.max(8, Math.round(y1 - y0)),
      k = Math.min(4, Math.max(1, 75 / h)),
      c = mkCanvas(cw, ch),
      vs = tight
        ? [
            [4, 0],
            [5, 0],
            [0, 0],
            [1, 0]
          ]
        : [
            [6, 0],
            [2, 0],
            [6, -7],
            [6, 7],
            [6, -12],
            [6, 12]
          ],
      res = [],
      j = 0;
    c.getContext('2d').drawImage(an.src, x0, y0, cw, ch, 0, 0, cw, ch);
    window.__refCrop = c;
    return w.setParameters({ tessedit_pageseg_mode: '7' }).then(function () {
      function nx() {
        if (j >= vs.length) return res;
        var vj = vs[j++],
          pv = prepVar(vj[1] ? rotateCanvas(c, vj[1]) : c, vj[0], cw * k, 4);
        if (!window.__lastPrep) window.__lastPrep = [];
        if (window.__lastPrep.length < 5) window.__lastPrep.push(pv);
        return w.recognize(pv).then(function (r) {
          res.push(r.data.text || '');
          return nx();
        });
      }
      return nx();
    });
  }
  /* 3ª etapa: haste inclinada/sem contraste — tira linhas compridas, acha o ângulo do texto e relê as faixas mais "escritas" */
  function inkOf(c) {
    var d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data,
      n = c.width * c.height,
      o = new Uint8Array(n),
      i;
    for (i = 0; i < n; i++) o[i] = d[i * 4] < 128 ? 1 : 0;
    return o;
  }
  // Remove linhas longas da tinta.
  function dropRuns(o, w, h, L) {
    var y, x, s;
    for (y = 0; y < h; y++) {
      x = 0;
      while (x < w) {
        if (o[y * w + x]) {
          s = x;
          while (x < w && o[y * w + x]) x++;
          if (x - s > L) {
            for (var q = s; q < x; q++) o[y * w + q] = 0;
          }
        } else x++;
      }
    }
  }
  // Abertura morfológica da tinta.
  function openInk(o, w, h, r) {
    function pass(a, v) {
      var t = new Uint8Array(w * h),
        u = new Uint8Array(w * h),
        x,
        y,
        k;
      for (y = 0; y < h; y++)
        for (x = 0; x < w; x++) {
          var m = v;
          for (k = -r; k <= r; k++) {
            var xx = x + k;
            if (xx < 0 || xx >= w) {
              if (v) m = 0;
              continue;
            }
            if (v) {
              if (!a[y * w + xx]) {
                m = 0;
                break;
              }
            } else if (a[y * w + xx]) {
              m = 1;
              break;
            }
          }
          t[y * w + x] = m;
        }
      for (y = 0; y < h; y++)
        for (x = 0; x < w; x++) {
          var m2 = v;
          for (k = -r; k <= r; k++) {
            var yy = y + k;
            if (yy < 0 || yy >= h) {
              if (v) m2 = 0;
              continue;
            }
            if (v) {
              if (!t[yy * w + x]) {
                m2 = 0;
                break;
              }
            } else if (t[yy * w + x]) {
              m2 = 1;
              break;
            }
          }
          u[y * w + x] = m2;
        }
      return u;
    }
    return pass(pass(o, 1), 0);
  }
  // Abertura morfológica com reconstrução.
  function openRec(o, w, h, r, it) {
    var c = openInk(o, w, h, r),
      k,
      x,
      y;
    for (k = 0; k < it; k++) {
      var n = new Uint8Array(w * h);
      for (y = 1; y < h - 1; y++)
        for (x = 1; x < w - 1; x++) {
          var i = y * w + x;
          if (o[i] && (c[i] || c[i - 1] || c[i + 1] || c[i - w] || c[i + w])) n[i] = 1;
        }
      c = n;
    }
    return c;
  }
  // Componentes de caracteres da tinta.
  function charInk(o, w, h, hmin, hmax) {
    var lab = new Int32Array(w * h),
      st = new Int32Array(w * h),
      cs = [],
      i,
      n = 0,
      keep = new Uint8Array(w * h);
    for (i = 0; i < w * h; i++) {
      if (!o[i] || lab[i]) continue;
      n++;
      var sp = 0,
        x0 = 1e9,
        x1 = -1,
        y0 = 1e9,
        y1 = -1,
        cnt = 0,
        mem = [];
      st[sp++] = i;
      lab[i] = n;
      while (sp) {
        var p = st[--sp],
          px = p % w,
          py = (p / w) | 0;
        mem.push(p);
        cnt++;
        if (px < x0) x0 = px;
        if (px > x1) x1 = px;
        if (py < y0) y0 = py;
        if (py > y1) y1 = py;
        if (px > 0 && o[p - 1] && !lab[p - 1]) {
          lab[p - 1] = n;
          st[sp++] = p - 1;
        }
        if (px < w - 1 && o[p + 1] && !lab[p + 1]) {
          lab[p + 1] = n;
          st[sp++] = p + 1;
        }
        if (py > 0 && o[p - w] && !lab[p - w]) {
          lab[p - w] = n;
          st[sp++] = p - w;
        }
        if (py < h - 1 && o[p + w] && !lab[p + w]) {
          lab[p + w] = n;
          st[sp++] = p + w;
        }
      }
      var bw = x1 - x0 + 1,
        bh = y1 - y0 + 1;
      if (bh >= hmin && bh <= hmax && bw <= hmax * 1.3 && cnt / (bw * bh) > 0.18) {
        cs.push({ cy: (y0 + y1) / 2, cx: (x0 + x1) / 2, h: bh });
        for (var q = 0; q < mem.length; q++) keep[mem[q]] = 1;
      }
    }
    return { keep: keep, cs: cs };
  }
  // Histograma de linhas.
  function rowHist(cs, h) {
    var r = new Float64Array(h);
    cs.forEach(function (c) {
      var y = Math.round(c.cy);
      if (y >= 0 && y < h) r[y]++;
    });
    var o = new Float64Array(h),
      y,
      k,
      rad = 6;
    for (y = 0; y < h; y++) {
      var t = 0;
      for (k = -rad; k <= rad; k++) if (y + k >= 0 && y + k < h) t += r[y + k];
      o[y] = t;
    }
    return o;
  }
  // Endireita a faixa de texto.
  function deskewBand(src) {
    var bin = prepVar(src, 4, 1300),
      sm = mkCanvas(Math.round(bin.width / 2), Math.round(bin.height / 2)),
      g = sm.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(bin, 0, 0, sm.width, sm.height);
    g.fillStyle = '#fff';
    g.fillRect(0, 0, 3, 3);
    var best = null,
      th;
    function sc(deg) {
      var r = rotateCanvas(sm, deg),
        o = inkOf(r),
        w = r.width,
        h = r.height;
      o = openInk(o, w, h, 1);
      dropRuns(o, w, h, Math.round(w * 0.05));
      var ci = charInk(o, w, h, 7, 34),
        rh = rowHist(ci.cs, h),
        t = 0,
        y;
      for (y = 0; y < h; y++) t += rh[y] * rh[y];
      return t;
    }
    window.__sc = [];
    for (th = -18; th <= 18; th += 3) {
      var v = sc(th);
      window.__sc.push([th, Math.round(v)]);
      if (!best || v > best.v) best = { v: v, d: th };
    }
    var c0 = best.d;
    for (th = c0 - 2; th <= c0 + 2; th++) {
      if (th === c0) continue;
      var v2 = sc(th);
      if (v2 > best.v) best = { v: v2, d: th };
    }
    return { bin: bin, deg: best.d };
  }
  // Recortes das faixas de texto.
  function bandCrops(src) {
    var o = deskewBand(src),
      r = rotateCanvas(o.bin, o.deg),
      w = r.width,
      h = r.height,
      ink = inkOf(r);
    ink = openRec(ink, w, h, 2, 3);
    dropRuns(ink, w, h, Math.round(w * 0.05));
    var ci = charInk(ink, w, h, 14, 68),
      rh = rowHist(ci.cs, h),
      bh = Math.round(h * 0.06),
      y,
      crops = [],
      used = [];
    ink = ci.keep;
    for (var n = 0; n < 2; n++) {
      var by = -1,
        bv = 0;
      for (y = 0; y < h; y++) {
        if (
          used.some(function (u) {
            return Math.abs(u - y) < bh * 2;
          })
        )
          continue;
        if (rh[y] > bv) {
          bv = rh[y];
          by = y;
        }
      }
      if (by < 0 || bv < 4) break;
      used.push(by);
      var y0 = Math.max(0, by - bh),
        y1 = Math.min(h, by + bh),
        c = mkCanvas(w, y1 - y0),
        cg = c.getContext('2d'),
        dd = cg.createImageData(w, y1 - y0),
        i;
      for (i = 0; i < w * (y1 - y0); i++) {
        var vv = ink[y0 * w + i] ? 0 : 255;
        dd.data[i * 4] = dd.data[i * 4 + 1] = dd.data[i * 4 + 2] = vv;
        dd.data[i * 4 + 3] = 255;
      }
      cg.putImageData(dd, 0, 0);
      crops.push(c);
    }
    window.__bandDeg = o.deg;
    return crops;
  }
  window.__bandCropsFn = function (c) {
    return bandCrops(c);
  };
  // Pré-leitura da haste em várias variantes.
  function preRead(full, psm) {
    var old = HADD;
    HADD = true;
    psm = psm || '11';
    var texts = [],
      i = 0,
      est = 0,
      t0 = Date.now(),
      cs = null,
      cp = null,
      anchor = null;
    window.__lastPrep = [];
    try {
      est = skewOf(full);
    } catch (e) {}
    /* tentativas: no ângulo estimado, depois sem girar, depois varrendo ângulos */
    var plan = [
      [0, est],
      [1, est]
    ];
    if (est) {
      plan.push([0, 0], [1, 0]);
    }
    try {
      var bd = -deskewBand(full).deg;
      window.__bd = bd;
      if (Math.abs(bd - est) > 3 && Math.abs(bd) > 2) {
        plan.splice(2, 0, [4, bd], [0, bd], [1, bd], [5, bd]);
      }
    } catch (eb) {}
    plan.push([2, est], [3, est], [4, est], [5, est]);
    [9, -9, 18, -18, 27, -27].forEach(function (d) {
      plan.push([i % 2 ? 1 : 0, est + d]);
    });
    var job = getWorker()
      .then(function (w) {
        function step() {
          if (i >= plan.length || Date.now() - t0 > 24000) return;
          var pl = plan[i++];
          return w
            .setParameters({ tessedit_pageseg_mode: psm })
            .then(function () {
              var src = pl[1] ? rotateCanvas(full, -pl[1]) : full;
              var pv = prepVar(src, pl[0]);
              cs = src;
              cp = pv;
              if (!window.__lastPrep) window.__lastPrep = [];
              if (window.__lastPrep.length < 4) window.__lastPrep.push(pv);
              return w.recognize(pv, { tsv: true });
            })
            .then(function (r) {
              texts.push(r.data.text || '');
              try {
                (window.__words = window.__words || []).push(
                  tsvWords(r.data.tsv)
                    .filter(function (q) {
                      return q.t.length > 3;
                    })
                    .map(function (q) {
                      return q.t + '|' + Math.round(q.cf) + '|' + q.h;
                    })
                );
                tsvWords(r.data.tsv).forEach(function (wd) {
                  if (
                    /^[A-Z]{1,3}-?[0-9OQDILZSGB]{3,}/i.test(wd.t.toUpperCase()) &&
                    wd.h >= 8 &&
                    wd.h <= cp.height * 0.15 &&
                    (wd.cf > 25 || /^[A-Z]{2}-?\d{3}/.test(wd.t.toUpperCase()))
                  ) {
                    var sco =
                      wd.cf +
                      Math.min(30, wd.t.length * 3) +
                      (/^[A-Z]{2}-?\d{3}/.test(wd.t.toUpperCase()) ? 40 : 0);
                    if (!anchor || sco > anchor.sco) anchor = { sco: sco, src: cs, pv: cp, wd: wd };
                  }
                });
              } catch (e9) {}
              var v = parseVote(texts);
              if (v.nRef >= 2 && v.nMed >= 2) return;
              if (
                v.ref &&
                v.ref.length >= 5 &&
                v.med &&
                /^C(?:1[0-2]|[1-9])$/.test(v.vr || '') &&
                texts.length >= 1
              )
                return;
              return step();
            });
        }
        return step()
          .then(function () {
            var v0 = parseVote(texts);
            window.__anchor = anchor
              ? { t: anchor.wd.t, cf: anchor.wd.cf, h: anchor.wd.h, w: anchor.wd.w }
              : null;
            var p2 = Promise.resolve();
            if (
              anchor &&
              !(v0.nMed >= 2 && v0.ref && /^[A-Z]{2,3}-?\d{3,5}$/.test(v0.ref)) &&
              Date.now() - t0 < 24000
            )
              p2 = refineLine(w, anchor, true).then(
                function (rs) {
                  rs.forEach(function (t) {
                    texts.push(t);
                  });
                  var vq = parseVote(texts);
                  if (vq.ref && vq.med && /^[A-Z]{2,3}-?\d{3,5}$/.test(vq.ref)) return;
                  return refineLine(w, anchor, false).then(function (r2) {
                    r2.forEach(function (t) {
                      texts.push(t);
                    });
                  });
                },
                function (e) {
                  window.__refErr = String((e && e.message) || e);
                }
              );
            return p2;
          })
          .then(function () {
            try {
              w.setParameters({ tessedit_pageseg_mode: '11' });
            } catch (e) {}
            var v = parseVote(texts);
            window.__lastTexts = texts;
            var okRef = function (r) {
              var k = hKey(r);
              return (
                S.items.some(function (i) {
                  return i.ref && hKey(i.ref) === k;
                }) ||
                (knownPre(String(r).replace(/-?\d.*$/, '')) && /\d{3}/.test(r))
              );
            };
            if (v.ref && ((v.med && /^[A-Z]{2,3}-?\d{3,5}$/.test(v.ref)) || okRef(v.ref)))
              return { ref: v.ref, med: v.med, vr: v.vr };
            if (v.ref) v = { ref: '', med: v.med, vr: v.vr };
            var m = hFind(texts);
            if (
              m.length &&
              (m[0][1] >= 9 || m.length === 1) &&
              (((v.med || HMED) && /^[A-Z]{2,3}-?\d{3,5}$/.test(m[0][0])) || okRef(m[0][0]))
            )
              return { ref: m[0][0], med: v.med || HMED, vr: v.vr || HVR };
            return v.med || v.vr ? { ref: '', med: v.med, vr: v.vr } : null;
          });
      })
      .catch(function (e) {
        HERR = (e && (e.code || e.message)) || String(e);
        return null;
      });
    return Promise.race([
      job,
      new Promise(function (ok) {
        setTimeout(function () {
          ok(null);
        }, 32000);
      })
    ]).then(
      function (x) {
        HADD = old;
        return x;
      },
      function () {
        HADD = old;
        return null;
      }
    );
  }
  function coverOf(cv) {
    try {
      var w = 64,
        h = Math.max(1, Math.round((cv.height * w) / cv.width)),
        c = mkCanvas(w, h),
        g = c.getContext('2d');
      g.drawImage(cv, 0, 0, w, h);
      var d = g.getImageData(0, 0, w, h).data,
        n = 0,
        i;
      for (i = 0; i < w * h; i++) {
        if (d[i * 4] < 235 || d[i * 4 + 1] < 235 || d[i * 4 + 2] < 235) n++;
      }
      return n / (w * h);
    } catch (e) {
      return 0.3;
    }
  }
  // ===== Leitor de haste: busca no estoque e tela do leitor. =====
  var PRE = null;

  // Busca a haste lida no estoque.
  function hFind(texts) {
    if (!HADD) return hMatch(texts);
    var ph = parseHaste(texts);
    HVR = ph.vr;
    if (ph.ref) {
      HMED = ph.med;
      return [[ph.ref, 10]];
    }
    var acc = scanCodes(
        texts.map(function (t) {
          return t.replace(/[□▢▯\[\]]/g, '0');
        })
      ),
      out = [],
      seen = {};
    HMED = ph.med || '';
    var m = top2(acc.meds);
    if (m.length && !HMED) HMED = m[0][0];
    top2(acc.refs).forEach(function (x) {
      seen[x[0]] = 1;
      out.push([x[0], 9]);
    });
    texts.forEach(function (T) {
      T.split(/\s+/).forEach(function (w) {
        w = w.toUpperCase().replace(/[^A-Z0-9]/g, '');
        var q = w.match(/^([A-Z]{2,3}?)([0-9OQDILZASGB]{3,6})$/);
        if (q) {
          var dg = fixDigits(q[2]);
          if (/^\d{3,6}$/.test(dg) && !seen[q[1] + dg]) {
            seen[q[1] + dg] = 1;
            out.push([q[1] + dg, 6]);
          }
        }
      });
    });
    out = out.filter(function (x) {
      return !out.some(function (y) {
        return (
          y !== x &&
          y[0].length >= 5 &&
          x[0].length > y[0].length &&
          x[0].slice(-y[0].length) === y[0]
        );
      });
    });
    out.forEach(function (x) {
      if (x[1] < 9 && out.length === 1) x[1] = 9;
    });
    out.sort(function (a, b) {
      return b[1] - a[1];
    });
    return out;
  }
  // Leitor de haste: foto, leitura e resultado.
  function hasteOpen(inp, add) {
    hasteClose();
    HADD = !!add;
    var ov = document.createElement('div');
    ov.id = 'hasteOv';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', 'Ler código da haste');
    ov.style.cssText =
      'position:fixed;inset:0;z-index:150;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px';
    var bx = document.createElement('div');
    bx.style.cssText =
      'background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px;width:min(94vw,440px);max-height:90vh;overflow:auto;display:flex;flex-direction:column;gap:10px';
    var hd = document.createElement('div');
    hd.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:8px';
    hd.appendChild(mk('b', '', 'Ler código da haste'));
    var x = btn('chip', '✕', hasteClose);
    x.setAttribute('aria-label', 'Fechar');
    x.style.cssText = 'min-height:36px;width:40px;padding:0;justify-content:center';
    hd.appendChild(x);
    bx.appendChild(hd);
    bx.appendChild(
      mk(
        'div',
        'hint',
        'Fotografe a haste de perto, com boa luz, deixando o código em linha reta e sem reflexo. O app lê as letras e números e procura o produto.'
      )
    );
    var st = mk('div', 'hint', '');
    st.setAttribute('role', 'status');
    st.style.cssText = 'min-height:20px;color:var(--fg)';
    var rs = document.createElement('div');
    rs.style.cssText = 'display:flex;flex-direction:column;gap:8px';
    var man = document.createElement('div');
    man.style.cssText = 'display:flex;gap:8px;align-items:center';
    var mi = document.createElement('input');
    mi.className = 'in';
    mi.placeholder = 'Ou digite o código';
    mi.style.cssText = 'flex:1 1 auto;width:auto';
    mi.autocomplete = 'off';
    function apply(v) {
      inp.value = v;
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      if (HADD && HMED && !$('eMedB').hidden && !$('eMed').value.trim()) {
        $('eMed').value = HMED;
        $('eMed').dispatchEvent(new Event('input', { bubbles: true }));
      }
      hasteClose();
    }
    var mb = btn('mini', 'Buscar', function () {
      if (mi.value.trim()) apply(mi.value.trim());
    });
    man.appendChild(mi);
    man.appendChild(mb);
    var fi = document.createElement('input');
    fi.type = 'file';
    fi.accept = 'image/*';
    fi.setAttribute('capture', 'environment');
    fi.hidden = true;
    var tk = btn('mini', 'Tirar foto da haste', function () {
      camOpen(
        function (f) {
          try {
            var dt = new DataTransfer();
            dt.items.add(f);
            fi.files = dt.files;
            fi.onchange();
          } catch (e) {}
        },
        'Foto da haste',
        { gallery: true }
      );
    });
    tk.style.width = '100%';
    function showRes(list, raw) {
      rs.textContent = '';
      if (list.length) {
        rs.appendChild(mk('div', 'lbl', HADD ? 'Qual é o código?' : 'Qual é o produto?'));
        list.slice(0, 5).forEach(function (c) {
          var it = S.items.filter(function (i) {
              return i.ref === c[0];
            })[0],
            t =
              c[0] +
              (pn(c[0]) !== c[0] ? ' · ' + pn(c[0]) : '') +
              (it && it.cor ? ' · ' + it.cor : '');
          var b = btn('chip', t, function () {
            apply(c[0]);
          });
          b.style.cssText += ';justify-content:flex-start;width:100%';
          rs.appendChild(b);
        });
      } else {
        rs.appendChild(
          mk(
            'div',
            'hint',
            (HADD
              ? 'Não consegui achar um código nessa foto.'
              : 'Não achei nenhum código do seu estoque nessa foto.') +
              (raw ? ' Li: “' + raw + '”.' : '') +
              ' Tente de novo mais perto, com a haste reta, ou digite abaixo.'
          )
        );
      }
    }
    fi.onchange = function () {
      var f = fi.files && fi.files[0];
      if (!f) return;
      rs.textContent = '';
      tk.disabled = true;
      st.textContent = 'Preparando leitor…';
      var done = function () {
        tk.disabled = false;
      };
      createImageBitmap(f)
        .then(function (bm) {
          var cv = mkCanvas(bm.width, bm.height);
          cv.getContext('2d').drawImage(bm, 0, 0);
          var all = [],
            passes = [[0], [90], [270], [180]],
            pi = 0;
          return getWorker().then(function (w) {
            var step = function () {
              if (!HOV) return;
              if (pi >= passes.length) {
                return Promise.resolve();
              }
              var deg = passes[pi++][0],
                rc = rotCv(cv, deg),
                long = Math.max(rc.width, rc.height),
                sc = Math.min(2, 1700 / long);
              st.textContent = 'Lendo a foto… (' + pi + '/' + passes.length + ')';
              var a = prepTile(rc, 0, 0, rc.width, rc.height, sc, false);
              return w.recognize(a).then(function (r) {
                all.push(r.data.text || '');
                var m = hFind(all);
                if (m.length && m[0][1] >= 9) return;
                var b2 = prepTile(rc, 0, 0, rc.width, rc.height, sc, true);
                return w.recognize(b2).then(function (r2) {
                  all.push(r2.data.text || '');
                  var m2 = hFind(all);
                  if (m2.length && m2[0][1] >= 9) return;
                  return step();
                });
              });
            };
            return step().then(function () {
              return all;
            });
          });
        })
        .then(function (all) {
          if (!HOV) return;
          var m = hFind(all);
          st.textContent = '';
          done();
          if (m.length === 1 && (m[0][1] >= 9 || HADD)) {
            apply(m[0][0]);
            return;
          }
          showRes(m, all.join(' ').replace(/\s+/g, ' ').trim().slice(0, 60));
        })
        .catch(function (e) {
          st.textContent = '';
          done();
          rs.textContent = '';
          rs.appendChild(
            mk(
              'div',
              'hint',
              e && (e.code === 'offline' || e.code === 'timeout')
                ? 'O leitor de texto ainda não foi baixado neste aparelho. Conecte à internet uma vez e tente de novo; depois ele passa a funcionar sem internet. Enquanto isso, digite o código abaixo.'
                : 'Não consegui ler essa foto. Tente de novo ou digite o código abaixo.'
            )
          );
        });
    };
    bx.appendChild(tk);
    bx.appendChild(st);
    bx.appendChild(rs);
    bx.appendChild(man);
    bx.appendChild(fi);
    ov.appendChild(bx);
    ov.addEventListener('click', function (e) {
      if (e.target === ov) hasteClose();
    });
    document.body.appendChild(ov);
    HOV = ov;
    try {
      getWorker().catch(function () {});
    } catch (e) {}
  }
  (function () {
    var cam =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
    function mkCam(inp) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.title = 'Ler código da haste com a câmera';
      b.setAttribute('aria-label', 'Ler código da haste com a câmera');
      b.style.cssText = 'min-height:44px;width:48px;padding:0;justify-content:center;flex:0 0 auto';
      b.innerHTML = cam;
      b.onclick = function () {
        hasteOpen(inp);
      };
      return b;
    }
    var q = $('q'),
      bf = $('btnFilt');
    if (q && bf) bf.parentNode.insertBefore(mkCam(q), bf);
    var v = $('vq');
    if (v) {
      var w = document.createElement('div');
      w.style.cssText = 'display:flex;gap:8px;align-items:center;max-width:480px';
      v.parentNode.insertBefore(w, v);
      w.appendChild(v);
      v.style.flex = '1 1 auto';
      v.style.width = 'auto';
      w.appendChild(mkCam(v));
      var fb = mk('button', 'chip');
      fb.type = 'button';
      fb.id = 'vBtnFilt';
      fb.setAttribute('aria-label', 'Filtros');
      fb.title = 'Filtros';
      fb.style.cssText =
        'min-height:44px;width:48px;padding:0;justify-content:center;flex:0 0 auto';
      fb.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5h18l-7 8v6l-4 2v-8Z"/></svg>';
      fb.onclick = function () {
        S.vFilt = !S.vFilt;
        render();
      };
      w.appendChild(fb);
    }
  })();

  $('smn').onclick = function () {
    S.qty = Math.max(1, S.qty - 1);
    S.msg = '';
    render();
  };
  $('spl').onclick = function () {
    S.qty = Math.max(1, Math.min(S._vcap || 1, S.qty + 1));
    S.msg = '';
    render();
  };
  $('sgo').onclick = function () {
    if (S.cartOpen) return cartFinalizar();
    var sel = S._vsel,
      qty = S.qty;
    if (!sel || sel.qty <= 0) return;
    if (!(pagTotais().rec > 0)) {
      say('Informe o valor recebido.');
      render();
      return;
    }
    qty = Math.min(qty, sel.qty);
    var pv = vendaPrevia();
    if (pv && pv.abaixo && S.pisoConf !== pv.key) {
      S.pisoConf = pv.key;
      renderPiso();
      return;
    }
    var br = pv && pv.br;
    if (br) br.qty -= 1;
    sel.qty -= qty;
    var sg =
      sel.lote &&
      S.grp.filter(function (x) {
        return x.id === sel.lote;
      })[0];
    if (sg) {
      sg.sold = (sg.sold || 0) + qty;
      if (sel.custo != null && !sel.bulk) {
        sg.ownQ = (sg.ownQ || 0) + qty;
        sg.ownC = (sg.ownC || 0) + qty * sel.custo;
      }
    }
    var sale = addSale(sel, qty, {
      moeda: S.moeda,
      forma: S.forma,
      recebido: S._recv,
      pag: pagPayload(),
      brinde: br
        ? {
            tipo: br.tipo,
            ref: br.ref,
            cor: br.cor,
            grau: br.grau || '',
            vr: br.vr || '',
            lote: br.lote || '',
            usd: pv.bu
          }
        : null,
      motivo: pv && pv.abaixo ? S.vMotivo || '' : ''
    });
    S.pisoConf = '';
    S.forma = 'din';
    pagReset();
    S.descTxt = '';
    S.vBrinde = null;
    S.vMotivo = '';
    say('Venda registrada: ' + qty + ' × ' + sel.ref + ' ' + sel.cor);
    S.qty = 1;
    S.vSel = null;
    render();
    showSplit(sale);
  };
  // ===== Movimento: animações leves (opacidade e escala), desligadas se o aparelho pedir menos movimento. =====
  // Vibração curta (toque de confirmação), se o aparelho permitir.
  function vibrar(ms) {
    try {
      if (!REDUCED && navigator.vibrate) navigator.vibrate(ms);
    } catch (e) {}
  }
  // Anima um número de 0 até o valor (conta subindo).
  function contaSubindo(el, ate, fmt, ms) {
    if (REDUCED || !el || !(Math.abs(ate) > 0)) return;
    var t0 = performance.now();
    ms = ms || 700;
    function passo(t) {
      var k = Math.min(1, (t - t0) / ms),
        e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(Math.round(ate * e));
      if (k < 1) requestAnimationFrame(passo);
      else el.textContent = fmt(ate);
    }
    requestAnimationFrame(passo);
  }
  // Marca de "ok" que se desenha dentro de um cartão (venda concluída).
  function marcaOk(host) {
    if (!host) return;
    var velho = host.querySelector('.okck');
    if (velho) velho.remove();
    var d = document.createElement('div');
    d.className = 'okck';
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML =
      '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    host.style.position = 'relative';
    host.appendChild(d);
  }
  // Flash branco rápido sobre a imagem da câmera ao tirar a foto.
  function flashCamera(host) {
    if (!host) return;
    vibrar(18);
    if (REDUCED) return;
    var f = document.createElement('div');
    f.style.cssText = 'position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:5;animation:camflash .28s ease-out';
    host.appendChild(f);
    setTimeout(function () {
      f.remove();
    }, 320);
  }
  // Janelas e cartões que aparecem (atributo hidden removido) entram com movimento.
  (function () {
    if (REDUCED || !window.MutationObserver) return;
    var ok = /(^|\s)(card|modal|note)(\s|$)/;
    new MutationObserver(function (lista) {
      lista.forEach(function (m) {
        var el = m.target;
        if (m.oldValue === null || el.hidden || el.id === 'lockScr') return;
        if (/(^|\s)modal(\s|$)/.test(el.className) || el.id === 'filtPanel') {
          var bx = el.querySelector('.modal-box, #filtBox');
          el.classList.remove('fadein');
          void el.offsetWidth;
          el.classList.add('fadein');
          if (bx) {
            bx.classList.remove('popin');
            void bx.offsetWidth;
            bx.classList.add('popin');
          }
        } else if (/(^|\s)view(\s|$)/.test(el.className) || ok.test(el.className) || /^(detail|vDetail|vSaleCard|splitCard|contCard)$/.test(el.id)) animEnter(el);
      });
    }).observe(document.body, { attributes: true, attributeFilter: ['hidden'], attributeOldValue: true, subtree: true });
  })();

  // Pulso curto (ex.: carrinho recebeu uma peça).
  function pulsa(el) {
    if (REDUCED || !el) return;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  }
  // Mensagens de aviso entram com um leve movimento quando o texto muda.
  (function () {
    if (REDUCED || !window.MutationObserver) return;
    ['msg', 'vmsg', 'emsg', 'st', 'sst', 'lotMsg', 'phErr', 'bErr'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el._ult = el.textContent;
      new MutationObserver(function () {
        var t = el.textContent;
        if (t === el._ult) return;
        el._ult = t;
        if (!t) return;
        el.classList.remove('msgpop');
        void el.offsetWidth;
        el.classList.add('msgpop');
      }).observe(el, { childList: true, characterData: true, subtree: true });
    });
  })();
  // ===== Dashboard em abas (Resumo, Dinheiro, Giro, Preços), com "Atenção agora" e blocos que abrem ao toque. =====
  S.dTab = 'hoje';
  S.dfold = {};
  var DTABS = [
    ['hoje', 'Resumo'],
    ['din', 'Dinheiro'],
    ['giro', 'Giro'],
    ['prec', 'Preços']
  ];
  function dTabsHtml() {
    return (
      '<div class="tgrid g4" role="group" aria-label="Partes do Dashboard">' +
      DTABS.map(function (t) {
        return tileHtml('data-act="dtab" data-id="' + t[0] + '"', t[0], t[1], null, 'sm', S.dTab === t[0]);
      }).join('') +
      '</div>'
    );
  }
  // Bloco que abre ao toque: cabeçalho com resumo de uma linha e, aberto, o detalhe logo abaixo.
  function dFold(id, titulo, resumo, cor, corpo) {
    if (!corpo) return '';
    var ab = !!S.dfold[id];
    return (
      '<section class="card" style="padding:0"><button type="button" data-act="dfold" data-id="' +
      id +
      '" aria-expanded="' +
      ab +
      '" style="display:flex;justify-content:space-between;align-items:center;gap:8px;width:100%;text-align:left;background:none;border:0;padding:14px;color:inherit;min-height:48px"><span style="min-width:0"><b style="font-size:15px">' +
      titulo +
      '</b><span class="hint" style="display:block;margin:2px 0 0;color:' +
      (cor || 'var(--sub)') +
      '">' +
      resumo +
      '</span></span><span aria-hidden="true" style="font-size:20px;color:var(--mute)">' +
      (ab ? '⌃' : '⌄') +
      '</span></button></section>' +
      (ab ? corpo : '')
    );
  }
  // Itens do card "Atenção agora", por prioridade.
  function atencaoItens() {
    var it = [],
      u = function (n) {
        return 'US$ ' + Math.round(n);
      };
    avisosVenc(7).forEach(function (a) {
      it.push({
        t: a.e.nome,
        s: prazoTxt(a.dias) + (a.ok ? '' : ' · ' + a.dica),
        c: a.dias < 0 ? 'var(--bad)' : 'var(--warn)',
        b: 'Ver',
        act: 'view',
        id: 'desp'
      });
    });
    var cc = ccDias();
    if (S.ccLemb !== false && cc >= 7)
      it.push({
        t: 'Conferir o caixa',
        s: cc === Infinity ? 'ainda não conferiu' : 'faz ' + cc + ' dias',
        c: 'var(--warn)',
        b: 'Conferir',
        act: 'view',
        id: 'caixa'
      });
    var dv = dolarFavoravel();
    if (dv && (dv.barato || dv.caro))
      it.push({
        t: dv.barato ? 'Dólar barato hoje' : 'Dólar caro hoje',
        s: Math.round(Math.abs(dv.hoje / dv.media - 1) * 100) + '% ' + (dv.barato ? 'abaixo' : 'acima') + ' da média de ' + S.janela + ' dias',
        c: dv.barato ? 'var(--ok)' : 'var(--warn)',
        b: 'Ver',
        act: 'view',
        id: 'fx'
      });
    var pp = precoPerigoso().length;
    if (pp)
      it.push({
        t: 'Preço ficou perigoso',
        s: pp + ' produto(s) com preço que não cobre custo e contas',
        c: 'var(--bad)',
        b: 'Ver',
        act: 'dtab',
        id: 'prec'
      });
    var rp = reposicao().length;
    if (rp)
      it.push({
        t: 'Repor mercadoria',
        s: rp + ' produto(s) vão acabar logo',
        c: 'var(--warn)',
        b: 'Ver',
        act: 'dtab',
        id: 'giro'
      });
    var pa = parados().length;
    if (pa)
      it.push({
        t: 'Estoque parado',
        s: pa + ' produto(s) sem vender há 60 dias ou mais',
        c: 'var(--warn)',
        b: 'Ver',
        act: 'dtab',
        id: 'giro'
      });
    var dias = S.backupTs ? Math.floor((Date.now() - S.backupTs) / DAY) : Infinity;
    if (S.sales.length && dias >= 7)
      it.push({
        t: 'Backup',
        s: dias === Infinity ? 'ainda não guardou fora do celular' : 'faz ' + dias + ' dias do último',
        c: 'var(--warn)',
        b: 'Fazer',
        act: 'view',
        id: 'ajustes'
      });
    return it;
  }
  function atencaoHtml() {
    var l = atencaoItens(),
      mostrar = S.atTodos ? l : l.slice(0, 3);
    if (!l.length)
      return '<section class="card col" style="border-left:4px solid var(--ok)"><b style="font-size:15px">Atenção agora</b><div class="hint" style="margin:0">Tudo em ordem.</div></section>';
    var h =
      '<section class="card col atcard' + (S.atMin ? ' min' : '') + '" id="atCard" style="border-left:4px solid var(--warn)"><button type="button" class="atcab" data-act="atmin" aria-expanded="' + !S.atMin + '" aria-label="' + (S.atMin ? 'Mostrar' : 'Minimizar') + ' atenção agora"><b style="font-size:15px">Atenção agora</b><span style="display:flex;align-items:center;gap:10px"><span class="cell">' +
      l.length +
      '</span><svg class="atseta" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></span></button><div class="atbody"><div class="atin"><div class="split">';
    mostrar.forEach(function (x) {
      h += dxRow(
        esc(x.t),
        '<span style="color:' + x.c + '">' + esc(x.s) + '</span>',
        '<button class="mini" data-act="' + x.act + '" data-id="' + x.id + '">' + x.b + '</button>'
      );
    });
    h += '</div>';
    if (l.length > 3)
      h +=
        '<button class="chip" data-act="attodos">' +
        (S.atTodos ? 'Mostrar só os principais' : 'Ver mais ' + (l.length - 3) + ' aviso(s)') +
        '</button>';
    return h + '</div></div></section>';
  }
  // Conteúdo da aba escolhida. "o" traz os blocos já montados pelo renderDash.
  function dashCompose(o) {
    var t = S.dTab,
      h = '',
      u = function (n) {
        return 'US$ ' + Math.round(n);
      },
      kpi = function (l, v, ap, st) {
        return (
          '<div class="kpi"><div class="lbl">' + l + '</div><b style="' + (st || '') + '">' + v + '</b><div class="hint">' + ap + '</div></div>'
        );
      };
    if (t === 'hoje') {
      var x = dashExtra();
      h += atencaoHtml() + o.per + o.kp + x.meta;
      h += dFold('sep', 'Quanto separar do que vendeu', 'reposição, contas, colchão e lucro livre do período', 'var(--sub)', o.sep);
      return h;
    }
    if (t === 'din') {
      var r = reservas(),
        rm = resultadoMes(new Date().getFullYear(), new Date().getMonth()),
        fl = fluxoCaixa(S.fluxoD || 30),
        falta = ['pyg', 'usd', 'brl'].filter(function (m) {
          return fl.pm[m].need > fl.pm[m].tem + 1e-9;
        });
      h +=
        '<section class="kpis">' +
        kpi('Dinheiro hoje', gs(Math.round(r.wal)), 'carteira toda') +
        kpi('Livre para você', gs(Math.round(r.livre)), 'depois de reposição, contas e melhorias', 'color:' + (r.livre >= 0 ? 'var(--ok)' : 'var(--bad)')) +
        '</section>';
      h += dFold(
        'res',
        'Resultado do mês',
        'Resultado da loja ' + gs(rm.resultado) + ' · sobra ' + gs(rm.sobra),
        rm.sobra >= 0 ? 'var(--ok)' : 'var(--bad)',
        resultadoHtml()
      );
      h += dFold(
        'flx',
        'Fluxo de caixa projetado',
        'Saldo em ' + (S.fluxoD || 30) + ' dias ' + gs(fl.saldo) + (falta.length ? ' · contas em ' + falta.map(function (m) { return m.toUpperCase(); }).join(', ') + ' pedem troca' : ''),
        fl.saldo < 0 || falta.length ? 'var(--warn)' : 'var(--ok)',
        fluxoHtml()
      );
      var rt = resultadoMes(new Date().getFullYear(), new Date().getMonth());
      h +=
        '<section class="card" style="padding:14px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span><b style="font-size:15px">Retirada do dono</b><span class="hint" style="display:block;margin:2px 0 0">Neste mês: ' +
        gs(rt.retTotal) +
        ' retirados de ' +
        gs(rt.lucroLivre) +
        ' de lucro livre</span></span><button class="mini" data-act="view" data-id="caixa">Abrir</button></div></section>';
      var pmk = ymNow(),
        pays = (S.cpay || []).filter(function (x) {
          return x.ym === pmk;
        });
      h += dFold('dono', 'Quanto já tem dono', 'guardado ' + gs(Math.round(r.guard + r.melh)) + ' de ' + gs(Math.round(r.wal)), 'var(--sub)', donoHtml());
      h += dFold('pagas', 'Contas pagas neste mês', pays.length + ' conta(s) paga(s)', 'var(--sub)', contasPagasHtml());
      h += dFold('two', 'Reposição e contas (30 dias)', 'quanto falta para repor e quanto das contas já foi separado', 'var(--sub)', o.two);
      return h;
    }
    if (t === 'giro') {
      var ce = capitalEstoque(),
        x2 = dashExtra(),
        rp = reposicao(),
        pa = parados(),
        ct = S.contagens.filter(function (c) {
          return Date.now() - c.ts <= 30 * DAY;
        });
      h +=
        '<section class="kpis">' +
        kpi('No estoque', 'US$ ' + ce.total.toFixed(0), 'a custo, sem estojos') +
        kpi('Parado 60+ dias', 'US$ ' + ce.parado.toFixed(0), Math.round(ce.pct * 100) + '% do investido', 'color:' + (ce.pct > 0.3 ? 'var(--warn)' : 'inherit')) +
        '</section>';
      h += dFold('rep', 'Repor primeiro', rp.length ? rp.length + ' produto(s) vão acabar logo · lista de compras' : 'nada acabando nos próximos 21 dias', rp.length ? 'var(--warn)' : 'var(--ok)', x2.repor);
      h += dFold('par', 'Estoque parado', pa.length + ' produto(s) · sugestão de preço de saída', 'var(--warn)', x2.parados);
      h += dFold('ret', 'Retorno do estoque', 'cada US$ 1 investido rendeu US$ ' + ce.retorno.toFixed(2).replace('.', ',') + ' em 30 dias', 'var(--sub)', capitalHtml());
      h += dFold('abc', 'Curva ABC', 'quais produtos dão 80% do lucro (90 dias)', 'var(--sub)', x2.abc);
      h += dFold('pdc', 'Perdas e sobras (30 dias)', ct.length + ' contagem(ns) no período', 'var(--sub)', x2.perdasC);
      return h;
    }
    var x3 = dashExtra(),
      sg = sugestoes().filter(function (r) {
        return r.acao === 'subir' || r.acao === 'descer';
      }),
      ab = abaixoDoPiso().length,
      pg = precoPerigoso().length,
      pr = perdasPropositais();
    h += dFold('sug', 'Sugestão de margem', sg.length ? sg.length + ' faixa(s) com sugestão' : 'sem mudanças sugeridas', sg.length ? 'var(--warn)' : 'var(--ok)', x3.sug);
    h += dFold('pgo', 'Preço ficou perigoso', pg ? pg + ' produto(s)' : 'nenhum', pg ? 'var(--bad)' : 'var(--ok)', perigosoHtml());
    h += dFold('abp', 'Preço abaixo do piso', ab ? ab + ' produto(s) com o câmbio de hoje' : 'nenhum', ab ? 'var(--warn)' : 'var(--ok)', x3.abaixo);
    h += dFold('pdv', 'Vendas abaixo do piso (30 dias)', pr.n + ' venda(s)', 'var(--sub)', x3.perdasV);
    h += dFold('mar', 'Saúde da margem por tipo', 'preço atual contra a trava de segurança', 'var(--sub)', o.margem);
    return h;
  }

  // ---------- período das vendas (Hoje, Semana, Mês, 30 dias, Outro)
  function dataLocal(txt, fimDoDia) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(txt || '');
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3] + (fimDoDia ? 1 : 0)).getTime();
  }
  // Início e fim do período escolhido (a semana começa na segunda).
  function periodoAtual() {
    var d = new Date(),
      ano = d.getFullYear(),
      mes = d.getMonth(),
      dia = d.getDate(),
      fim = Date.now() + 1,
      ini,
      txt,
      p = S.per;
    if (p === 'hoje') {
      ini = new Date(ano, mes, dia).getTime();
      txt = 'hoje';
    } else if (p === 'semana') {
      ini = new Date(ano, mes, dia - ((d.getDay() + 6) % 7)).getTime();
      txt = 'de segunda (' + fd(ini) + ') até hoje';
    } else if (p === '30') {
      ini = Date.now() - 30 * DAY;
      txt = 'últimos 30 dias';
    } else if (p === 'custom' && dataLocal(S.perDe) != null && dataLocal(S.perAte) != null) {
      ini = dataLocal(S.perDe);
      fim = dataLocal(S.perAte, true);
      txt = 'de ' + fd(ini) + ' a ' + fd(fim - DAY);
    } else {
      ini = new Date(ano, mes, 1).getTime();
      txt = p === 'custom' ? 'escolha as duas datas (mostrando o mês)' : 'do dia 1 até hoje';
    }
    return { ini: ini, fim: fim, txt: txt };
  }
  function vendasPeriodo() {
    var r = periodoAtual();
    return S.sales.filter(function (s) {
      return !s.estorno && s.ts >= r.ini && s.ts < r.fim;
    });
  }
  function periodoHtml() {
    var r = periodoAtual(),
      op = [
        ['hoje', 'Hoje'],
        ['semana', 'Semana'],
        ['mes', 'Mês'],
        ['30', '30 dias'],
        ['custom', 'Outro']
      ],
      h =
        '<div class="col" style="gap:8px"><div class="hint" style="margin:0">Vendas de: ' +
        r.txt +
        '</div><div class="tgrid g5" role="group" aria-label="Período das vendas">' +
        op
          .map(function (o) {
            return tileHtml('data-act="per" data-id="' + o[0] + '"', 'p_' + o[0], o[1], null, 'sm', S.per === o[0]);
          })
          .join('') +
        '</div>';
    if (S.per === 'custom')
      h +=
        '<div class="sel" style="flex-wrap:wrap"><input class="in" type="date" data-pdat="de" value="' +
        esc(S.perDe) +
        '" aria-label="Data inicial" style="flex:1 1 140px;width:auto"><input class="in" type="date" data-pdat="ate" value="' +
        esc(S.perAte) +
        '" aria-label="Data final" style="flex:1 1 140px;width:auto"></div>';
    return h + '</div>';
  }
  /* ===== Início: botões em "azulejo" (ícone em cima do nome) e barra de navegação de baixo ===== */
  var ICO_D = {
    vendas: '<path d="M6 6h15l-2 9H8zM6 6L5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>',
    estoque: '<path d="M3 8l9-5 9 5v9l-9 5-9-5zM3 8l9 5 9-5M12 13v9"/>',
    caixa: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 15h2"/>',
    fx: '<path d="M7 7h12l-3-3M17 17H5l3 3"/>',
    desp: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"/>',
    hist: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2"/>',
    hoje: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
    din: '<circle cx="12" cy="12" r="9"/><path d="M14.5 9a2.5 2 0 0 0-5 .5c0 2.5 5 1.5 5 4a2.5 2 0 0 1-5 .5M12 6v2M12 16v2"/>',
    giro: '<path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5"/>',
    prec: '<path d="M3 12l9-9h8v8l-9 9z"/><circle cx="16" cy="8" r="1.2"/>',
    cat: '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>',
    ajustes: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.7a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2L10 21h4l.6-2.7a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z"/>',
    inicio: '<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
    p_hoje: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
    p_semana: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    p_mes: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h2M12 14h2M16 14h2M8 18h2M12 18h2"/>',
    p_30: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    p_custom: '<path d="M12 5v14M5 12h14"/>',
    hero: '<path d="M3 17l5-5 4 4 8-9"/><path d="M15 7h5v5"/>'
  };
  function ico(k, px) {
    px = px || 22;
    return (
      '<svg width="' + px + '" height="' + px + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICO_D[k] || '') +
      '</svg>'
    );
  }
  // Botão "azulejo": ícone em cima, nome embaixo, faixa opcional com um dado rápido.
  function tileHtml(attrs, k, nome, faixa, cls, on) {
    return (
      '<button type="button" class="tl' + (cls ? ' ' + cls : '') + (on ? ' on' : '') + '" ' + attrs + ' aria-pressed="' + !!on + '">' +
      '<span class="ti">' + ico(k, cls === 'sm' ? 20 : 24) + '</span><span class="tn">' + nome + '</span>' +
      (faixa ? '<span class="tp' + (faixa[1] ? ' ' + faixa[1] : '') + '">' + faixa[0] + '</span>' : '') +
      '</button>'
    );
  }
  function vendidoHoje() {
    var d0 = new Date();
    d0.setHours(0, 0, 0, 0);
    var t0 = d0.getTime(),
      n = 0,
      v = 0;
    S.sales.forEach(function (s) {
      if (!s.estorno && s.ts >= t0) {
        n++;
        v += s.price || 0;
      }
    });
    return { n: n, v: v };
  }
  ICO_D.novo = '<path d="M12 5v14M5 12h14"/><rect x="3" y="3" width="18" height="18" rx="4"/>';
  ICO_D.cont = '<path d="M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h9"/>';
  ICO_D.lotes = '<path d="M3 7l9-4 9 4-9 4zM3 12l9 4 9-4M3 17l9 4 9-4"/>';
  var INI_PADRAO = ['vendas', 'estoque', 'caixa', 'fx', 'desp', 'hist', 'hoje', 'din', 'giro', 'prec', 'cat', 'ajustes', 'ped', 'cont', 'lotes'];
  var INI_TODOS = INI_PADRAO.concat(['novo', 'notif']);
  function iniLista() {
    var l = Array.isArray(S.inicioT) ? S.inicioT : INI_PADRAO;
    return l.filter(function (id, i) {
      return INI_TODOS.indexOf(id) >= 0 && l.indexOf(id) === i;
    });
  }
  function iniDados() {
    var pecas = S.items.reduce(function (a, i) {
        return a + (i.qty > 0 ? i.qty : 0);
      }, 0),
      rep = 0,
      ct = S.cart ? S.cart.length : 0;
    try {
      rep = reposicao().length;
    } catch (e) {}
    return {
      vendas: ['Vendas', ct ? [ct + ' no carrinho', 'g'] : ['Carrinho vazio', '']],
      estoque: ['Inventário', [pecas + ' peças', rep ? 'w' : '']],
      caixa: ['Caixa', [gs(walletGs()), 'g']],
      fx: ['Câmbio', [gsRaw(Math.round(ratePyg('usd'))), '']],
      desp: ['Despesas', [gs(totalMensal()) + '/mês', 'w']],
      hist: ['Histórico', [S.sales.length + ' vendas', '']],
      hoje: ['Resumo', ['Painel', '']],
      din: ['Dinheiro', ['Reservas', 'g']],
      giro: ['Giro', [rep + ' a repor', rep ? 'w' : '']],
      prec: ['Preços', [(S.faixas || []).length + ' faixas', '']],
      cat: ['Catálogo', ['WhatsApp', '']],
      ajustes: ['Ajustes', ['Moeda ' + (MN[S.moedaP || 'pyg'] || 'G$'), '']],
      novo: ['Novo produto', ['Cadastrar', '']],
      cont: ['Contagem', ['Conferir estoque', '']],
      lotes: ['Lotes', ['Compras', '']],
      ped: ['Pedidos', [pedNovos() + ' novos', pedNovos() ? 'w' : '']],
      notif: ['Notificações', [notifContagem() + ' avisos', notifContagem() ? 'w' : '']]
    };
  }
  function renderInicio() {
    var el = $('v-inicio');
    if (!el || S.view !== 'inicio') return;
    var h = vendidoHoje(),
      D = iniDados(),
      L = iniLista(),
      ed = !!S.inicioEd;
    var grid = L.map(function (id, i) {
      var t = D[id];
      if (!ed) return tileHtml('data-act="inicio" data-id="' + id + '"', id, t[0], t[1], '', false);
      return (
        '<div class="twrap" data-k="' + id + '">' +
        tileHtml('disabled', id, t[0], t[1], '', false) +
        '<div class="tedit"><button type="button" data-act="inicioMv" data-id="' + id + '|-1" aria-label="Mover ' + t[0] + ' para trás"' + (i === 0 ? ' disabled' : '') + '>◀</button>' +
        '<button type="button" class="x" data-act="inicioRm" data-id="' + id + '" aria-label="Remover ' + t[0] + '">✕</button>' +
        '<button type="button" data-act="inicioMv" data-id="' + id + '|1" aria-label="Mover ' + t[0] + ' para frente"' + (i === L.length - 1 ? ' disabled' : '') + '>▶</button></div></div>'
      );
    }).join('');
    var livres = INI_TODOS.filter(function (id) {
      return L.indexOf(id) < 0;
    });
    var extra = '';
    if (ed && livres.length)
      extra =
        '<div class="lbl">Adicionar botão</div><div class="tgrid g4">' +
        livres
          .map(function (id) {
            return tileHtml('data-act="inicioAdd" data-id="' + id + '"', id, D[id][0], null, 'sm', false);
          })
          .join('') +
        '</div>';
    el.innerHTML =
      '<div class="hero" data-act="inicio" data-id="hoje" role="button" tabindex="0"><span class="hi">' + ico('hero', 26) + '</span><span><small>Vendido hoje · ' + h.n + ' venda(s)</small><b>' + gs(h.v) + '</b></span><span class="hg">›</span></div>' +
      '<div class="tgrid' + (ed ? ' editando' : '') + '">' + grid + '</div>' + extra +
      '<div class="sel" style="justify-content:center;gap:10px;flex-wrap:wrap">' +
      (ed
        ? '<button type="button" class="mini" data-act="inicioEd">Concluir</button><button type="button" class="chip" data-act="inicioReset">Restaurar padrão</button>'
        : '<button type="button" class="chip" data-act="inicioEd">✎ Personalizar botões</button>') +
      '</div>';
  }
  /* toque num azulejo da tela Início */
  function inicioGo(id) {
    if (id === 'hoje' || id === 'din' || id === 'giro' || id === 'prec') {
      S.dTab = id;
      setView('dash');
    } else if (id === 'cat') {
      setView('vendas');
    } else if (id === 'novo') {
      setView('estoque');
      $('btnAdd').click();
    } else if (id === 'cont') {
      setView('estoque');
      $('kCont').click();
    } else if (id === 'lotes') {
      S.lotesView = true;
      setView('estoque');
    } else setView(id);
  }
  /* barra de baixo: ícone em cima do nome */
  var NAVB = [
    ['inicio', 'Início'],
    ['vendas', 'Vendas'],
    ['estoque', 'Estoque'],
    ['caixa', 'Caixa'],
    ['ajustes', 'Ajustes']
  ];
  function iniSalvar(l) {
    S.inicioT = l;
    render();
  }
  /* ===== Notificações: o que precisa de atenção agora + registro dos alertas do dólar ===== */
  ICO_D.notif = '<path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16zM10 21h4"/>';
  S.notifs = [];
  S.fxMgUlt = 0;
  // Itens ao vivo: tudo que o Dashboard chama de "Atenção agora" + o estado da margem da loja.
  function notifAgora() {
    var l = [],
      mg = fxMargemInfo();
    if (mg.m > FX_MARGEM + 1e-9)
      l.push({
        t: 'Margem da loja em ' + pc(mg.m),
        s:
          (mg.reativa > FX_MARGEM + 1e-9 ? 'O dólar oscilou ' + pc(mg.amp) + ' em 7 dias. ' : '') +
          (mg.alerta ? 'Subiu ' + pc(mg.alta) + ' em 3 dias. ' : '') +
          'Dólar da loja: ' + gsRaw(fxLoja('usd')) + '.',
        c: 'var(--warn)',
        b: 'Ver',
        act: 'view',
        id: 'fx'
      });
    if (pedNovos())
      l.push({
        t: pedNovos() + (pedNovos() === 1 ? ' pedido novo' : ' pedidos novos'),
        s: 'Esperando você começar a separar.',
        c: 'var(--accent)',
        b: 'Ver',
        act: 'pedver',
        id: 'novo'
      });
    try {
      atencaoItens().forEach(function (i) {
        l.push(i);
      });
    } catch (e) {}
    return l;
  }
  // Registra no histórico quando a margem sobe ou volta ao normal.
  function notifVerifica() {
    var mg = fxMargemInfo(),
      alta = mg.m > FX_MARGEM + 1e-9 ? 1 : 0;
    if (alta === S.fxMgUlt) return;
    S.fxMgUlt = alta;
    S.notifs.unshift({
      ts: Date.now(),
      lida: false,
      t: alta ? 'Margem da loja subiu para ' + pc(mg.m) : 'Margem da loja voltou a ' + pc(FX_MARGEM),
      s: alta
        ? (mg.reativa > FX_MARGEM + 1e-9 ? 'O dólar oscilou ' + pc(mg.amp) + ' em 7 dias. ' : '') + (mg.alerta ? 'Subiu ' + pc(mg.alta) + ' em 3 dias. ' : '') + 'Dólar da loja: ' + gsRaw(fxLoja('usd')) + '.'
        : 'O dólar acalmou. Dólar da loja: ' + gsRaw(fxLoja('usd')) + '.'
    });
    S.notifs = S.notifs.slice(0, 60);
  }
  function notifContagem() {
    var n = 0;
    try {
      n = notifAgora().length;
    } catch (e) {}
    return n + S.notifs.filter(function (x) {
      return !x.lida;
    }).length;
  }
  function renderNotif() {
    var el = $('v-notif');
    if (!el || S.view !== 'notif') return;
    var ag = notifAgora(),
      h = '<div class="top"><div><h1>Notificações</h1><div class="crumb">O que precisa de atenção e os avisos do dólar</div></div></div>';
    h += '<div class="lbl">Agora</div>';
    h += ag.length
      ? ag
          .map(function (i) {
            return (
              '<section class="card" style="border-left:4px solid ' + i.c + ';display:flex;align-items:center;gap:10px;justify-content:space-between"><div><b style="font-size:15px">' + esc(i.t) + '</b><div class="hint" style="margin:2px 0 0">' + esc(i.s) + '</div></div>' +
              '<button type="button" class="mini" data-act="' + i.act + '" data-id="' + i.id + '">' + esc(i.b) + '</button></section>'
            );
          })
          .join('')
      : '<section class="card"><b>Tudo em ordem.</b><div class="hint" style="margin:2px 0 0">Nada precisa de atenção agora.</div></section>';
    h += '<div class="lbl">Avisos anteriores</div>';
    h += S.notifs.length
      ? S.notifs
          .map(function (x) {
            return '<section class="card"><b style="font-size:15px">' + esc(x.t) + '</b><div class="hint" style="margin:2px 0 0">' + esc(x.s) + '</div><div class="hint" style="margin:4px 0 0">' + fd(x.ts) + ' ' + fh(x.ts) + '</div></section>';
          })
          .join('') +
        '<div class="sel" style="justify-content:center"><button type="button" class="chip" data-act="notifLimpa">Limpar avisos anteriores</button></div>'
      : '<div class="hint">Nenhum aviso ainda. Quando a margem da loja subir ou voltar ao normal, ele aparece aqui.</div>';
    el.innerHTML = h;
    S.notifs.forEach(function (x) {
      x.lida = true;
    });
  }
  // ===== Navegação entre abas e Dashboard. =====
  // Troca de aba.
  function setView(v) {
    S.view = v;
    S.msg = '';
    try {
      history.replaceState(null, '', '#' + v);
    } catch (e) {}
    render();
    window.scrollTo(0, 0);
    animEnter($('v-' + v));
    if (v === 'inicio' && window.animInicio) window.animInicio();
  }
  // Navegação principal.
  function renderNav() {
    var n = $('mainnav'),
      sl = n.scrollLeft;
    n.textContent = '';
    var sn = $('sino'),
      nn = notifContagem();
    if (sn) sn.innerHTML = ico('notif', 24) + (nn ? '<i>' + nn + '</i>' : '');
    NAVB.forEach(function (v) {
      var b = btn('mn' + (S.view === v[0] ? ' on' : ''), '', function () {
        setView(v[0]);
      });
      b.innerHTML = '<span class="mi">' + ico(v[0], 22) + '</span><span>' + v[1] + '</span>';
      b.setAttribute('aria-label', v[1]);
      if (S.view === v[0]) b.setAttribute('aria-current', 'page');
      n.appendChild(b);
    });
    if (S.dayTab) {
      var w = mk('span', 'mn' + (S.view === 'dia' ? ' on' : ''));
      w.style.cssText = 'display:inline-flex;align-items:center;gap:4px;padding-right:4px';
      var b2 = btn('', 'Dia ' + fmtDay(S.dayTab).slice(0, 5), function () {
        setView('dia');
      });
      b2.style.cssText =
        'background:none;border:none;color:inherit;font:inherit;font-weight:600;min-height:44px;padding:0 8px 0 4px';
      if (S.view === 'dia') b2.setAttribute('aria-current', 'page');
      var x = btn('xb', '×', function () {
        ACT.closedia();
      });
      x.setAttribute('aria-label', 'Fechar a aba do dia');
      w.appendChild(b2);
      w.appendChild(x);
      n.appendChild(w);
    }
    VIEWS.forEach(function (v) {
      $('v-' + v[0]).hidden = S.view !== v[0];
    });
    $('v-dia').hidden = S.view !== 'dia';
    var on = n.querySelector('.mn.on');
    n.scrollLeft = sl;
    if (on) {
      var lo = on.offsetLeft,
        hi = lo + on.offsetWidth;
      if (lo < sl || hi > sl + n.clientWidth)
        n.scrollLeft = Math.max(0, lo - (n.clientWidth - on.offsetWidth) / 2);
    }
  }

  // ---------- dashboard
  function sumBy(a, k) {
    return a.reduce(function (x, s) {
      return x + s[k];
    }, 0);
  }
  // Vendas de um período.
  function periodSales(days) {
    var from = days === 0 ? new Date().setHours(0, 0, 0, 0) : Date.now() - days * DAY;
    return S.sales.filter(function (s) {
      return !s.estorno && s.ts >= from;
    });
  }
  // Aba Dashboard.
  function renderDash() {
    var el = $('v-dash'),
      ps = vendasPeriodo(),
      c = colchao();
    var tot = sumBy(ps, 'price'),
      pcs = sumBy(ps, 'qty'),
      rep = sumBy(ps, 'rep'),
      repU = sumBy(ps, 'repUSD'),
      con = sumBy(ps, 'contas'),
      col = sumBy(ps, 'colch'),
      mel = sumBy(ps, 'melh'),
      liv = sumBy(ps, 'livre');
    var sep = rep + con + col + mel;
    var need = repU * S.fx.pyg,
      gap = need - rep;
    var m30 = periodSales(30),
      con30 = sumBy(m30, 'contas'),
      tm = totalMensal(),
      cp = Math.min(100, (con30 / tm) * 100);
    var perHtml = periodoHtml();
    var html =
      '<div class="top"><div><h1>Dashboard</h1><div class="crumb">Quanto vendeu e quanto separar para manter a loja em ordem</div></div></div>' +
      dTabsHtml();
    var kpHtml =
      '<section class="kpis" aria-label="Resumo">' +
      '<div class="kpi"><div class="lbl">Vendido</div><b>' +
      gs(tot) +
      '</b><div class="hint">' +
      pcs +
      ' peça(s) em ' +
      ps.length +
      ' venda(s)</div></div>' +
      '<div class="kpi"><div class="lbl">Separar das vendas</div><b style="color:var(--warn)">' +
      gs(sep) +
      '</b><div class="hint">' +
      (tot ? pc(sep / tot) : '0%') +
      ' do vendido</div></div>' +
      '<div class="kpi"><div class="lbl">Lucro livre</div><b style="color:var(--ok)">' +
      gs(liv) +
      '</b><div class="hint">' +
      (tot ? pc(liv / tot) : '0%') +
      ' do vendido</div></div>' +
      '<div class="kpi"><div class="lbl">Dólar e real hoje</div><b>' +
      gsRaw(S.fx.pyg) +
      '</b><div class="hint" style="margin-top:2px">por US$ 1</div><b style="font-size:20px;display:block;margin-top:8px">' +
      gsRaw(Math.round(S.fx.pyg / S.fx.brl)) +
      '</b><div class="hint">por R$ 1 · <a href="#fx" data-act="view" data-id="fx" style="color:var(--accent-fg)">ver câmbio</a></div></div></section>';
    var head = html;
    html = '';
    var parts = [
      ['Reposição da mercadoria', usd0(repU) + ' guardados em dólar', rep, '#00c8ff'],
      ['Contas da loja e de casa', 'Obrigatório', con, '#a2447c'],
      [
        'Colchão de segurança',
        'Reserva contra alta do dólar e do custo (' + pc(c.pct) + ')',
        col,
        '#ffc766'
      ],
      ['Caixa de melhorias', 'Opcional, nunca trava venda', mel, 'var(--info)'],
      ['Lucro livre', 'Seu dinheiro', liv, '#00ff88']
    ];
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Quanto separar do que você vendeu</h2><div class="hint" style="margin:2px 0 0">Soma de todas as vendas do período, na ordem em que o dinheiro deve ser separado.</div></div>';
    html +=
      '<div class="bar">' +
      parts
        .map(function (p) {
          return (
            '<i style="width:' +
            (tot ? Math.max(0, (p[2] / tot) * 100) : 0) +
            '%;background:' +
            p[3] +
            '"></i>'
          );
        })
        .join('') +
      '</div><div class="split">' +
      parts
        .map(function (p, i) {
          return (
            '<div class="sl"><span><span class="sp" style="background:' +
            p[3] +
            '"></span>' +
            (i + 1) +
            '. ' +
            p[0] +
            '<small>' +
            p[1] +
            '</small></span><b>' +
            gs(p[2]) +
            '</b></div>'
          );
        })
        .join('') +
      '</div></section>';
    var secSep = html;
    html = '';
    html += '<div class="two">';
    html +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Reposição em dólar</h2><div style="font-size:14px">Guardado para repor: <b>' +
      usd0(repU) +
      '</b></div>' +
      '<div class="hint" style="margin:0">Separado nas vendas: ' +
      gs(rep) +
      ' · Custo de repor hoje: ' +
      gs(need) +
      '</div>' +
      '<div class="note ' +
      (gap > 0 ? 'n-warn' : 'n-ok') +
      '">' +
      (gap > 0
        ? 'O dólar subiu desde essas vendas. Faltam ' +
          gs(gap) +
          ' para repor. ' +
          (col >= gap
            ? 'O colchão acumulado (' + gs(col) + ') cobre.'
            : 'O colchão (' + gs(col) + ') não cobre tudo.')
        : 'Sobram ' + gs(-gap) + ' em relação ao custo de repor hoje.') +
      '</div></section>';
    html +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Contas dos últimos 30 dias</h2><div style="font-size:14px"><b>' +
      gs(con30) +
      '</b> separados de <b>' +
      gs(tm) +
      '</b> por mês</div>' +
      '<div class="bar"><i style="width:' +
      cp +
      '%;background:var(--accent)"></i></div><div class="hint" style="margin:0">' +
      Math.round(cp) +
      '% coberto. Vendidas ' +
      sumBy(m30, 'qty') +
      ' de ' +
      volumeEfetivo() +
      ' peças esperadas no mês. Cada peça separa ' +
      gs(contasPeca()) +
      ' para as contas. <a href="#desp" data-act="view" data-id="desp" style="color:var(--accent-fg)">Editar despesas</a></div></section>';
    html += '</div>';
    var secTwo = html;
    html = '';
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Saúde da margem</h2><div class="hint" style="margin:2px 0 0">Preço atual contra a trava: reposição de hoje mais a parte das contas de cada peça.</div></div><div style="overflow-x:auto"><table class="tb"><thead><tr><th>Tipo</th><th>Preço</th><th>Reposição hoje</th><th>Contas/peça</th><th>Trava</th><th>Folga</th><th>Situação</th></tr></thead><tbody>';
    var worst = null;
    TIPOS.forEach(function (t) {
      var rp = Math.round(t.repUSD * S.fx.pyg),
        cpz = contasPeca(),
        trava = rp + cpz;
      if (!t.price) {
        html +=
          '<tr><td>' +
          t.label +
          '</td><td>livre</td><td>' +
          gs(rp) +
          '</td><td>' +
          gs(cpz) +
          '</td><td>' +
          gs(trava) +
          '</td><td>definido na venda</td><td>—</td></tr>';
        return;
      }
      var fo = t.price - trava,
        fp = fo / t.price,
        st =
          fp >= 0.15
            ? ['Seguro', 'n-ok']
            : fp > 0
              ? ['Apertado', 'n-warn']
              : ['Subir preço', 'n-bad'];
      if (!worst && fp < 0.15) worst = { t: t, trava: trava, fp: fp };
      html +=
        '<tr><td>' +
        t.label +
        '</td><td>' +
        gs(t.price) +
        '</td><td>' +
        gs(rp) +
        '</td><td>' +
        gs(cpz) +
        '</td><td>' +
        gs(trava) +
        '</td><td>' +
        gs(fo) +
        ' · ' +
        pc(fp) +
        '</td><td><span class="note ' +
        st[1] +
        '" style="padding:3px 10px;display:inline-block;font-size:12px">' +
        st[0] +
        '</span></td></tr>';
    });
    html += '</tbody></table></div>';
    if (worst) {
      var minimo = Math.ceil(worst.trava / (1 - 0.15) / 1000) * 1000;
      html +=
        '<div class="note n-warn">Antes de subir o preço de ' +
        worst.t.label +
        ': revise as despesas, negocie o próximo lote e venda só acima da trava (' +
        gs(worst.trava) +
        '). Se mesmo assim a folga não voltar a 15%, o mínimo sugerido é ' +
        gs(minimo) +
        '.</div>';
    } else
      html +=
        '<div class="note n-ok">Todos os preços têm folga acima de 15% da trava. Nada a mexer. Subir preço é sempre a última sugestão do app.</div>';
    html += '</section>';
    el.innerHTML =
      head +
      '<div id="dtabBody">' +
      dashCompose({ per: perHtml, kp: kpHtml, sep: secSep, two: secTwo, margem: html }) +
      '</div>';
  }

  // ---------- câmbio
  // ===== Aba Câmbio: cotação, gráfico e atualização. =====
  // Gráfico de linha em SVG.
  function lineSvg(vals, labs, fmt) {
    var W = 640,
      H = 230,
      pl = 64,
      pr = 16,
      pt = 14,
      pb = 30,
      mn = Math.min.apply(null, vals),
      mx = Math.max.apply(null, vals),
      pad = (mx - mn) * 0.15 || 1;
    mn -= pad;
    mx += pad;
    var X = function (i) {
        return pl + (i * (W - pl - pr)) / (vals.length - 1);
      },
      Y = function (v) {
        return pt + ((mx - v) * (H - pt - pb)) / (mx - mn);
      };
    var g = '',
      i;
    for (i = 0; i < 4; i++) {
      var v = mn + ((mx - mn) * i) / 3,
        y = Y(v);
      g +=
        '<line x1="' +
        pl +
        '" x2="' +
        (W - pr) +
        '" y1="' +
        y +
        '" y2="' +
        y +
        '" style="stroke:var(--line)" stroke-width="1"/><text x="' +
        (pl - 8) +
        '" y="' +
        (y + 4) +
        '" text-anchor="end" font-size="11" style="fill:var(--mute)">' +
        fmt(v) +
        '</text>';
    }
    var pts = vals
      .map(function (v, i) {
        return X(i).toFixed(1) + ',' + Y(v).toFixed(1);
      })
      .join(' ');
    var xl = [0, Math.floor((vals.length - 1) / 2), vals.length - 1]
      .map(function (i) {
        return (
          '<text x="' +
          X(i) +
          '" y="' +
          (H - 8) +
          '" text-anchor="' +
          (i === 0 ? 'start' : i === vals.length - 1 ? 'end' : 'middle') +
          '" font-size="11" style="fill:var(--mute)">' +
          labs[i] +
          '</text>'
        );
      })
      .join('');
    var li = vals.length - 1;
    return (
      '<svg viewBox="0 0 ' +
      W +
      ' ' +
      H +
      '" style="width:100%;height:auto;display:block" role="img" aria-label="Gráfico do dólar nos últimos dias">' +
      g +
      '<polyline points="' +
      pts +
      '" fill="none" style="stroke:var(--accent-fg)" stroke-width="2.5" stroke-linejoin="round"/><circle cx="' +
      X(li) +
      '" cy="' +
      Y(vals[li]) +
      '" r="5" style="fill:var(--accent-fg)"/>' +
      xl +
      '</svg>'
    );
  }
  // Aba Câmbio.
  // Cartão da cotação da loja (só informa; a margem é fixa).
  function fxLojaHtml() {
    var u = Math.round(fxLoja('usd')),
      b = Math.round(fxLoja('brl')),
      f = S.fx,
      mg = fxMargemInfo();
    return (
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Cotação da loja</h2><div class="hint" style="margin:2px 0 0">Seus preços são em dólar, e o dólar da loja vale uma margem a mais que o mercado: ' + pc(FX_MARGEM) + ' de base, subindo até ' + pc(FX_TETO) + ' quando o dólar oscila ou esquenta. O app usa esta cotação ao receber dólar ou real, a menos que você digite outro câmbio no carrinho. Custos e contas continuam pela cotação do mercado.</div></div>' +
      '<div class="note ' + (mg.m > FX_MARGEM + 1e-9 ? 'n-warn' : 'n-ok') + '" role="status">Margem em uso: ' + pc(mg.m) + (mg.m > FX_MARGEM + 1e-9 ? '. ' + (mg.reativa > FX_MARGEM + 1e-9 ? 'O dólar oscilou ' + pc(mg.amp) + ' em 7 dias. ' : '') + (mg.alerta ? 'Alerta: subiu ' + pc(mg.alta) + ' em 3 dias. ' : '') + (mg.reativa + mg.alerta > FX_TETO + 1e-9 ? 'Limitada ao teto de ' + pc(FX_TETO) + '.' : '') : '. Dólar calmo, margem base.') + '</div>' +
      '<div class="kpis"><div class="kpi" style="background:var(--panel2)"><div class="lbl">US$ 1 vale</div><b>' + gsRaw(u) + '</b><div class="hint">mercado ' + gsRaw(f.pyg) + '</div></div>' +
      '<div class="kpi" style="background:var(--panel2)"><div class="lbl">R$ 1 vale</div><b>' + gsRaw(b) + '</b><div class="hint">mercado ' + gsRaw(Math.round(f.pyg / f.brl)) + '</div></div>' +
      '<div class="kpi" style="background:var(--panel2)"><div class="lbl">US$ 1 vale</div><b>R$ ' + fxBrlPorUsd().toFixed(2).replace('.', ',') + '</b><div class="hint">mercado R$ ' + f.brl.toFixed(2).replace('.', ',') + '</div></div></div></section>'
    );
  }
  function renderFx() {
    var el = $('v-fx'),
      f = S.fx,
      c = colchao(),
      h = S.fxHist,
      vals = h.map(function (p) {
        return p.pyg;
      }),
      first = vals[0],
      last = vals[vals.length - 1];
    var html =
      '<div class="top"><div><h1>Câmbio</h1><div class="crumb">Cotação do dólar e do real em guaranis</div></div><div class="tabs"><button class="mini" data-act="fxnow">Atualizar agora</button></div></div>';
    html +=
      '<section class="kpis"><div class="kpi"><div class="lbl">US$ 1 custa</div><b>' +
      gsRaw(f.pyg) +
      '</b><div class="hint">' +
      f.src +
      '</div></div>' +
      '<div class="kpi"><div class="lbl">R$ 1 custa</div><b>' +
      gsRaw(Math.round(f.pyg / f.brl)) +
      '</b><div class="hint">calculado do dólar</div></div>' +
      '<div class="kpi"><div class="lbl">US$ 1 custa</div><b>' +
      'R$ ' + f.brl.toFixed(2).replace('.', ',') +
      '</b><div class="hint">cotação do real</div></div>' +
      '<div class="kpi"><div class="lbl">Próxima busca em</div><b id="cd">--:--</b><div class="hint">automática a cada 3 minutos</div></div></section>';
    html +=
      '<div class="note ' +
      (f.live ? 'n-ok' : 'n-warn') +
      '" role="status">' +
      esc(f.status) +
      (f.ts ? ' Última atualização às ' + fh(f.ts) + '.' : '') +
      '</div>';
    html += fxLojaHtml();
    html +=
      '<section class="card col"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px"><div><h2 style="margin:0;font-size:16px">Dólar nos últimos ' +
      h.length +
      ' dias</h2><div class="hint" style="margin:2px 0 0">Guaranis por dólar. Mínimo ' +
      dots(Math.min.apply(null, vals)) +
      ' · Máximo ' +
      dots(Math.max.apply(null, vals)) +
      ' · Variação no período ' +
      (last >= first ? '+' : '−') +
      pc(Math.abs(last / first - 1)) +
      '</div></div>' +
      '<div class="nav"><button class="chip" data-act="fxup">Simular dólar +3%</button><button class="chip" data-act="fxdn">Simular dólar −3%</button></div></div>' +
      lineSvg(
        vals,
        h.map(function (p) {
          return fd(p.ts);
        }),
        function (v) {
          return dots(v);
        }
      ) +
      '<div class="hint" style="margin:0">Os botões de simulação existem só na demonstração, para você ver o colchão e a trava reagirem.</div></section>';
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Como o colchão de segurança é calculado</h2><div class="hint" style="margin:2px 0 0">Não é um percentual fixo. O app olha a pior alta recente do dólar e do custo da mercadoria.</div></div>' +
      '<div class="split"><div class="sl"><span>Maior alta do dólar em ' +
      c.janela +
      ' dias<small>menor cotação seguida de uma mais alta</small></span><b>' +
      pc(c.fx) +
      '</b></div>' +
      '<div class="sl"><span>Maior alta do custo entre lotes<small>custo em dólar de um lote para o seguinte</small></span><b>' +
      pc(c.cost) +
      '</b></div>' +
      '<div class="sl"><span>As duas altas juntas<small>(1 + dólar) × (1 + custo) − 1</small></span><b>' +
      pc(c.raw) +
      '</b></div>' +
      '<div class="sl"><span><b>Colchão aplicado</b><small>limitado entre 5% e 25%</small></span><b style="color:var(--warn)">' +
      pc(c.pct) +
      '</b></div></div>' +
      '<div class="note n-info">Em cada venda, o colchão é ' +
      pc(c.pct) +
      ' do custo de reposição daquela peça. Se o dólar ou o custo subirem mais, o percentual sobe sozinho.</div></section>';
    html +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Custo por lote</h2><div style="overflow-x:auto"><table class="tb"><thead><tr><th>Lote</th><th>Data</th><th>Grupo</th><th>Custo por peça</th><th>Variação</th></tr></thead><tbody>' +
      lotesHist()
        .map(function (l, i, A) {
          var p = i ? A[i - 1].usd : 0;
          return (
            '<tr><td>' +
            l.id +
            '</td><td>' +
            fd(l.ts) +
            '</td><td>' +
            l.txt +
            '</td><td>' +
            usd(l.usd) +
            '</td><td>' +
            (p ? (l.usd >= p ? '+' : '−') + pc(Math.abs(l.usd / p - 1)) : 'primeiro') +
            '</td></tr>'
          );
        })
        .join('') +
      '</tbody></table></div></section>';
    el.innerHTML = html;
    tickFx();
  }
  // Atualiza o contador do câmbio.
  function tickFx() {
    var cd = $('cd');
    if (cd) {
      var s = Math.max(0, Math.round((S.fxNext - Date.now()) / 1000));
      cd.textContent =
        String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    }
  }
  // Grava a cotação (histórico do dia) e redesenha.
  function setFx(pyg, brl, src, live, status) {
    var last = S.fxHist[S.fxHist.length - 1],
      pt = { ts: Date.now(), pyg: Math.round(pyg), brl: brl };
    if (new Date(last.ts).toDateString() === new Date().toDateString())
      S.fxHist[S.fxHist.length - 1] = pt;
    else S.fxHist.push(pt);
    S.fx = { pyg: Math.round(pyg), brl: brl, ts: Date.now(), live: live, src: src, status: status };
    S.fxNext = Date.now() + 180000;
    renderFx();
    renderDash();
    renderHist();
    renderDay();
  }
  // Busca a cotação online.
  function fetchFx() {
    S.fxNext = Date.now() + 180000;
    var fail = function () {
      S.fx.live = false;
      S.fx.status =
        'Esta demonstração não consegue consultar a cotação na internet. Usando valor de exemplo. No app instalado, ele busca sozinho a cada 3 minutos.';
      S.fx.src = 'Valor de exemplo';
      renderFx();
    };
    try {
      fetch('https://open.er-api.com/v6/latest/USD')
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          if (j && j.rates && j.rates.PYG && j.rates.BRL)
            setFx(
              j.rates.PYG,
              j.rates.BRL,
              'open.er-api.com, ao vivo',
              true,
              'Cotação ao vivo buscada automaticamente.'
            );
          else fail();
        })
        .catch(fail);
    } catch (e) {
      fail();
    }
  }
  setInterval(function () {
    tickFx();
    if (Date.now() >= S.fxNext) fetchFx();
  }, 1000);
  // ===== Aba Despesas. =====

  // ---------- despesas
  function ymNow() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);
  }
  // Cartão de uma despesa.
  function expCard(e) {
    var last = e.hist[e.hist.length - 1],
      paid = !!(e.paid && e.paid[ymNow()]);
    var h =
      '<div class="card col" style="background:var(--panel2);padding:14px"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:baseline"><div><b>' +
      esc(e.nome) +
      '</b> <span class="cell">' +
      (e.tipo === 'fixa' ? 'fixa' : 'variável') +
      '</span>' +
      (expMoeda(e) !== 'pyg'
        ? ' <span class="cell">' + (expMoeda(e) === 'usd' ? 'em dólar' : 'em real') + '</span>'
        : '') +
      '</div><div style="display:flex;align-items:center;gap:10px"><button type="button" data-act="exppay" data-id="' +
      e.id +
      '" aria-pressed="' +
      paid +
      '" title="' +
      (paid ? 'Toque para desfazer' : 'Marcar como paga neste mês') +
      '" style="min-height:34px;padding:0 14px;border-radius:999px;font-size:13px;background:' +
      (paid ? 'rgba(34,197,94,.2)' : 'transparent') +
      ';border:1px solid ' +
      (paid ? '#22c55e' : 'var(--line)') +
      ';color:' +
      (paid ? '#86efac' : 'var(--sub)') +
      '">' +
      (paid ? '✓ Pago' : 'Pagar') +
      '</button></div></div>';
    h +=
      '<div class="sel" style="flex-wrap:wrap"><input class="in" id="ev-' +
      e.id +
      '" inputmode="numeric" data-in="exp" data-id="' +
      e.id +
      '" value="' +
      (expMoeda(e) === 'pyg' ? dots(e.valor) : inVal(expOrig(e), expMoeda(e))) +
      '" aria-label="Novo valor de ' +
      esc(e.nome) +
      (expMoeda(e) === 'pyg' ? '' : ' em ' + (expMoeda(e) === 'usd' ? 'dólares' : 'reais')) +
      '" style="flex:1 1 160px;width:auto"><input class="in" data-exd="' +
      e.id +
      '" inputmode="numeric" maxlength="2" placeholder="Dia" value="' +
      (e.dia || '') +
      '" aria-label="Dia do vencimento de ' +
      esc(e.nome) +
      '" style="flex:0 0 64px;width:64px"><button class="mini" data-act="expsave" data-id="' +
      e.id +
      '">Salvar novo valor</button>' +
      '<button class="chip" data-act="exprm" data-id="' +
      e.id +
      '">' +
      (S.confRm === e.id ? 'Confirmar remoção' : 'Remover') +
      '</button></div>';
    h +=
      '<div class="hint" id="pv-' +
      e.id +
      '" style="margin:0">' +
      (expMoeda(e) !== 'pyg' ? 'Hoje: ' + expTexto(e) + '. ' : '') +
      (e.dia ? 'Vence todo dia ' + e.dia + '. ' : 'Sem dia de vencimento. ') +
      (e.tipo === 'variavel'
        ? 'Valor muda todo mês. Atualize quando a conta chegar.'
        : 'Altere e veja o efeito antes de salvar.') +
      '</div>';
    if (e.hist.length)
      h +=
        '<div class="hint" style="margin:0">Histórico: ' +
        e.hist
          .slice(-3)
          .reverse()
          .map(function (x) {
            return (
              fd(x.ts) +
              ' ' +
              gs(x.de) +
              ' → ' +
              gs(x.para) +
              ' (' +
              (x.para >= x.de ? '+' : '−') +
              pc(Math.abs(x.para / x.de - 1)) +
              ')'
            );
          })
          .join(' · ') +
        '</div>';
    return h + '</div>';
  }
  // Aba Despesas.
  function renderDesp() {
    var el = $('v-desp'),
      tm = totalMensal(),
      imp = S.exp
        .filter(function (e) {
          return e.cat === 'imprev';
        })
        .reduce(function (a, e) {
          return a + e.valor;
        }, 0),
      impMes = limitesMes(new Date().getFullYear(), new Date().getMonth()),
      impLista = S.imprev
        .map(function (x, i) {
          return { x: x, i: i };
        })
        .filter(function (o) {
          return noMes(o.x.ts, impMes);
        }),
      gasto = impLista.reduce(function (a, o) {
        return a + o.x.valor;
      }, 0);
    var html =
      '<div class="top"><div><h1>Despesas</h1><div class="crumb">Contas que o dinheiro das vendas precisa cobrir todo mês</div></div></div>';
    html +=
      '<section class="kpis"><div class="kpi"><div class="lbl">Total obrigatório por mês</div><b id="tmTot">' +
      gs(tm) +
      '</b></div>' +
      '<div class="kpi"><div class="lbl">Cada peça vendida separa</div><b id="tmPeca" style="color:var(--warn)">' +
      gs(contasPeca()) +
      '</b><div class="hint">para pagar as contas (rateio: ' +
      volumeEfetivo() +
      ' peças por mês, ajuste em Ajustes)</div></div></section>';
    var ec = efeitoCambio(),
      rc = reservaCambioContas();
    if (contasEstrangeiras() > 0)
      html +=
        '<div class="note ' +
        (ec > 0 ? 'n-warn' : 'n-ok') +
        '">Contas em dólar e real somam ' +
        gs(contasEstrangeiras()) +
        ' hoje. ' +
        (ec === 0
          ? 'O câmbio não mudou desde que você informou os valores.'
          : ec > 0
          ? 'Subiram ' + gs(ec) + ' só por causa do câmbio.'
          : 'Caíram ' + gs(-ec) + ' por causa do câmbio.') +
        ' Reserva contra alta do câmbio: ' +
        gs(rc) +
        ' por mês (' +
        pc(colchao().pct) +
        '), já dividida nas peças.</div>';
    html += avisosHtml();
    var cats = ['loja', 'casa', 'pessoal', 'profissional', 'imprev'];
    html +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Por grupo</h2><div class="bar">' +
      cats
        .map(function (c, i) {
          var v = S.exp
            .filter(function (e) {
              return e.cat === c;
            })
            .reduce(function (a, e) {
              return a + e.valor;
            }, 0);
          return (
            '<i style="width:' +
            (tm ? (v / tm) * 100 : 0) +
            '%;background:' +
            ['#00c8ff', '#a2447c', '#ffc766', 'var(--info)', '#00ff88'][i] +
            '"></i>'
          );
        })
        .join('') +
      '</div><div class="nav">' +
      cats
        .map(function (c, i) {
          var v = S.exp
            .filter(function (e) {
              return e.cat === c;
            })
            .reduce(function (a, e) {
              return a + e.valor;
            }, 0);
          if (!v) return '';
          return (
            '<span class="cell"><span class="sp" style="background:' +
            ['#00c8ff', '#a2447c', '#ffc766', 'var(--info)', '#00ff88'][i] +
            '"></span>' +
            CATS[c] +
            ' · ' +
            gs(v) +
            '</span>'
          );
        })
        .join('') +
      '</div></section>';
    cats.forEach(function (c) {
      var list = S.exp.filter(function (e) {
        return e.cat === c;
      });
      if (!list.length) return;
      html +=
        '<section class="col"><div class="lbl" style="margin:6px 0 0">' +
        CATS[c] +
        '</div>' +
        list.map(expCard).join('') +
        '</section>';
    });
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Imprevistos do mês</h2><div class="hint" style="margin:2px 0 0">A provisão de ' +
      gs(imp) +
      ' por mês é consumida pelos gastos inesperados que você registrar.</div></div>' +
      '<div class="bar"><i style="width:' +
      Math.min(100, imp ? (gasto / imp) * 100 : 0) +
      '%;background:' +
      (gasto > imp ? 'var(--bad)' : 'var(--warn)') +
      '"></i></div><div class="hint" style="margin:0">Gasto ' +
      gs(gasto) +
      ' de ' +
      gs(imp) +
      (gasto > imp
        ? '. Passou da provisão. Considere aumentá-la.'
        : '. Resta ' + gs(imp - gasto) + '.') +
      '</div>' +
      (impLista.length ? '' : '<div class="hint" style="margin:0">Nenhum imprevisto neste mês.</div>') +
      impLista
        .map(function (o) {
          var x = o.x;
          return (
            '<div class="sl" style="align-items:center"><span>' +
            esc(x.desc) +
            '<small>' +
            fd(x.ts) +
            '</small></span><span style="display:flex;align-items:center;gap:6px"><b>' +
            gs(x.valor) +
            '</b><button type="button" class="trash" data-act="impdel" data-id="' + o.i + '" aria-label="Remover imprevisto ' + esc(x.desc) + '" title="Remover" style="opacity:.8">✕</button></span></div>'
          );
        })
        .join('') +
      '<div class="hint" style="margin:0">A provisão começa do zero todo mês. Os imprevistos de meses anteriores ficam guardados no Histórico.</div>' +
      '<div class="sel" style="flex-wrap:wrap"><input class="in" id="impD" placeholder="O que aconteceu" style="flex:2 1 180px;width:auto" aria-label="Descrição do imprevisto"><input class="in" id="impV" inputmode="' + mpMode() + '" placeholder="Valor em ' + mpSim() + '" style="flex:1 1 120px;width:auto" aria-label="Valor do imprevisto"><button class="mini" data-act="impadd">Registrar imprevisto</button></div></section>';
    html +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Nova despesa</h2><div class="sel" style="flex-wrap:wrap"><input class="in" id="nName" placeholder="Nome (ex.: Água)" style="flex:2 1 160px;width:auto" aria-label="Nome da despesa"><select class="in" id="nCat" aria-label="Grupo" style="flex:1 1 130px;width:auto">' +
      cats
        .map(function (c) {
          return '<option value="' + c + '">' + CATS[c] + '</option>';
        })
        .join('') +
      '</select><select class="in" id="nTipo" aria-label="Tipo" style="flex:1 1 110px;width:auto"><option value="fixa">Fixa</option><option value="variavel">Variável</option></select><select class="in" id="nMoeda" aria-label="Moeda" style="flex:1 1 90px;width:auto">' + opcoesMoeda() + '</select><input class="in" id="nVal" inputmode="decimal" placeholder="Valor" style="flex:1 1 110px;width:auto" aria-label="Valor"><input class="in" id="nDia" inputmode="numeric" maxlength="2" placeholder="Dia do vencimento" style="flex:1 1 90px;width:auto" aria-label="Dia do vencimento"><button class="mini" data-act="expadd">Adicionar</button></div><div class="hint" id="nH" role="status"></div></section>';
    html +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Caixa de melhorias</h2><div class="hint" style="margin:0">Opcional. Não entra nas contas obrigatórias e nunca trava uma venda.</div><div class="sel"><input class="in" id="melhIn" inputmode="' + mpMode() + '" data-in="melh" value="' +
      gsParaCampo(S.melhPeca) +
      '" aria-label="Valor por peça para melhorias" style="max-width:180px"><span class="hint" style="margin:0">' + mpSim() + ' por peça vendida</span></div></section>';
    el.innerHTML = html;
  }

  // ---------- histórico
  // ===== Aba Histórico: dias, vendas e registros. =====
  // Totais de um dia.
  function dayStats(k) {
    var inDay = function (x) {
        return dayKey(x.ts) === k;
      },
      sales = S.sales.filter(inDay),
      ok = sales.filter(function (x) {
        return !x.estorno;
      }),
      dl = S.dlog.filter(inDay),
      fx = fxOfDay(k);
    var extra = dl
      .filter(function (x) {
        return x.kind === 'imp' || x.kind === 'melh';
      })
      .reduce(function (a, x) {
        return a + x.valor;
      }, 0);
    return {
      n: ok.length,
      est: sales.length - ok.length,
      vend: sumBy(ok, 'price'),
      liv: sumBy(ok, 'livre'),
      extra: extra,
      nd: dl.length,
      outros: S.cambios.filter(inDay).length + S.elog.filter(inDay).length,
      fx: fx
    };
  }
  // Aba Histórico (montada em 97-hist-busca.js).
  function renderHist() {
    histRender();
  }
  // ---------- por dia
  function dayKey(ts) {
    var d = new Date(ts);
    return (
      d.getFullYear() +
      '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + d.getDate()).slice(-2)
    );
  }
  // Fim de um dia.
  function dayEnd(k) {
    var p = k.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2], 23, 59, 59, 999).getTime();
  }
  // Formata um dia.
  function fmtDay(k) {
    var p = k.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }
  // Despesa mensal vigente em uma data.
  function monthlyAt(end) {
    var out = [];
    S.exp.forEach(function (e) {
      if (
        S.dlog.some(function (x) {
          return x.kind === 'novo' && x.nome === e.nome && x.ts > end;
        })
      )
        return;
      var v = e.valor;
      e.hist
        .slice()
        .reverse()
        .forEach(function (x) {
          if (x.ts > end) v = x.de;
        });
      out.push({ nome: e.nome, cat: e.cat, valor: v });
    });
    S.dlog
      .filter(function (x) {
        return x.kind === 'rem' && x.ts > end;
      })
      .forEach(function (x) {
        out.push({ nome: x.nome, cat: x.cat, valor: x.valor });
      });
    return out;
  }
  // Câmbio de um dia.
  function fxOfDay(k) {
    var end = dayEnd(k),
      ix = -1;
    S.fxHist.forEach(function (p, i) {
      if (p.ts <= end) ix = i;
    });
    if (ix < 0) return null;
    return {
      p: S.fxHist[ix],
      prev: ix > 0 ? S.fxHist[ix - 1] : null,
      exact: dayKey(S.fxHist[ix].ts) === k
    };
  }
  // Cartão de um registro de peça no histórico.
  function elogCard(x) {
    return (
      '<div class="card" style="padding:14px"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:center"><div><span class="cell">' +
      (x.descarte ? 'Descarte' : x.contagem ? 'Ajuste de contagem' : 'Entrada de estoque') +
      '</span><div style="margin-top:6px">' +
      (x.qty > 0 ? '+' : '') +
      x.qty +
      ' × ' +
      esc(x.ref) +
      ' · ' +
      esc(x.cor) +
      (x.grau ? ' · ' + esc(x.grau) : '') +
      '</div><div class="hint" style="margin:2px 0 0">' +
      fd(x.ts) +
      ' às ' +
      fh(x.ts) +
      '</div></div><b>' +
      (x.qty > 0 ? '+' : '') +
      x.qty +
      ' un.</b></div></div>'
    );
  }
  // Dias com movimento.
  function activeDays() {
    var m = {};
    function add(ts, k) {
      var d = dayKey(ts);
      m[d] = m[d] || { v: 0, d: 0, o: 0 };
      m[d][k]++;
    }
    S.sales.forEach(function (s) {
      add(s.ts, 'v');
    });
    S.dlog.forEach(function (x) {
      add(x.ts, 'd');
    });
    S.cambios.forEach(function (x) {
      add(x.ts, 'o');
    });
    S.elog.forEach(function (x) {
      add(x.ts, 'o');
    });
    return m;
  }
  // Detalhe de um dia.
  function renderDay() {
    var box = $('v-dia');
    if (!box) return;
    var k = S.day,
      inDay = function (x) {
        return dayKey(x.ts) === k;
      };
    var sales = S.sales.filter(inDay),
      ok = sales.filter(function (s) {
        return !s.estorno;
      }),
      dl = S.dlog.filter(inDay),
      tr = S.cambios.filter(inDay),
      el = S.elog.filter(inDay),
      fx = fxOfDay(k);
    var mAt = monthlyAt(dayEnd(k)),
      tm = mAt.reduce(function (a, e) {
        return a + e.valor;
      }, 0),
      rateio = Math.round(tm / 30),
      contasSep = sumBy(ok, 'contas'),
      cob = rateio ? contasSep / rateio : 0;
    var vend = sumBy(ok, 'price'),
      pcs = sumBy(ok, 'qty'),
      liv = sumBy(ok, 'livre');
    var extraG = dl
        .filter(function (x) {
          return x.kind === 'imp' || x.kind === 'melh';
        })
        .reduce(function (a, x) {
          return a + x.valor;
        }, 0),
      loteU = dl
        .filter(function (x) {
          return x.kind === 'lote';
        })
        .reduce(function (a, x) {
          return a + x.usd;
        }, 0);
    var today = dayKey(Date.now());
    var h =
      '<div class="top"><button class="chip" data-act="hback">‹ Voltar ao histórico</button><button class="chip" data-act="closedia">Fechar esta aba ×</button></div>' +
      '<section class="card col"><div class="sel" style="flex-wrap:wrap"><button class="chip" data-act="dayprev" aria-label="Dia anterior">‹ Anterior</button><input type="date" class="in" id="dayIn" data-in="day" value="' +
      k +
      '" max="' +
      today +
      '" aria-label="Escolher o dia" style="width:auto;flex:1 1 150px"><button class="chip" data-act="daynext" aria-label="Próximo dia"' +
      (k >= today ? ' disabled' : '') +
      '>Próximo ›</button><button class="chip" data-act="daytoday">Hoje</button></div></section>';
    h +=
      '<div><h2 style="margin:0;font-size:20px">' +
      (function (t) {
        return t.charAt(0).toUpperCase() + t.slice(1);
      })(
        new Date(dayEnd(k)).toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      ) +
      '</h2></div>';
    h +=
      '<section class="kpis"><div class="kpi"><div class="lbl">Vendido</div><b>' +
      gs(vend) +
      '</b><div class="hint">' +
      pcs +
      ' peça(s) em ' +
      ok.length +
      ' venda(s)</div></div>' +
      '<div class="kpi"><div class="lbl">Lucro livre</div><b style="color:var(--ok)">' +
      gs(liv) +
      '</b><div class="hint">depois de separar tudo</div></div>' +
      '<div class="kpi"><div class="lbl">Contas do dia</div><b style="color:var(--warn)">' +
      gs(rateio) +
      '</b><div class="hint">1/30 de ' +
      gs(tm) +
      ' por mês</div></div>' +
      '<div class="kpi"><div class="lbl">Gastos extras</div><b>' +
      gs(extraG) +
      '</b><div class="hint">' +
      (loteU ? '+ ' + usd(loteU) + ' em lote' : 'imprevistos e melhorias') +
      '</div></div></section>';
    h +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Câmbio do dia</h2>' +
      (fx
        ? '<div class="kpis"><div class="kpi" style="background:var(--panel2)"><div class="lbl">US$ 1 custa</div><b>' +
          gsRaw(fx.p.pyg) +
          '</b>' +
          (fx.prev
            ? '<div class="hint">' +
              (fx.p.pyg >= fx.prev.pyg ? '+' : '−') +
              pc(Math.abs(fx.p.pyg / fx.prev.pyg - 1)) +
              ' sobre o dia anterior</div>'
            : '') +
          '</div><div class="kpi" style="background:var(--panel2)"><div class="lbl">US$ 1 custa</div><b>R$ ' +
          fx.p.brl.toFixed(2).replace('.', ',') +
          '</b></div><div class="kpi" style="background:var(--panel2)"><div class="lbl">R$ 1 custa</div><b>' +
          gsRaw(Math.round(fx.p.pyg / fx.p.brl)) +
          '</b></div></div>' +
          (fx.exact
            ? ''
            : '<div class="hint" style="margin:0">Sem cotação guardada neste dia. Mostrando a última anterior (' +
              fd(fx.p.ts) +
              ').</div>')
        : '<div class="hint" style="margin:0">Sem cotação guardada até esta data.</div>') +
      '</section>';
    h +=
      '<section class="col"><div class="lbl" style="margin:6px 0 0">Vendas do dia</div>' +
      (sales.length
        ? sales.map(saleCard).join('')
        : '<div class="note n-info">Nenhuma venda neste dia.</div>') +
      '</section>';
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Despesas do dia</h2><div class="hint" style="margin:2px 0 0">As contas do mês entram divididas por 30. Os gastos extras entram no dia em que foram feitos.</div></div><div style="overflow-x:auto"><table class="tb"><thead><tr><th>Conta</th><th>Grupo</th><th>Por mês</th><th>Parte do dia</th></tr></thead><tbody>' +
      mAt
        .map(function (e) {
          return (
            '<tr><td>' +
            esc(e.nome) +
            '</td><td>' +
            CATS[e.cat] +
            '</td><td>' +
            gs(e.valor) +
            '</td><td>' +
            gs(Math.round(e.valor / 30)) +
            '</td></tr>'
          );
        })
        .join('') +
      '<tr><td><b>Total</b></td><td></td><td><b>' +
      gs(tm) +
      '</b></td><td><b>' +
      gs(rateio) +
      '</b></td></tr></tbody></table></div>' +
      '<div class="note ' +
      (ok.length ? (cob >= 1 ? 'n-ok' : 'n-warn') : 'n-info') +
      '">' +
      (ok.length
        ? 'As vendas do dia separaram ' +
          gs(contasSep) +
          ' para as contas, ' +
          Math.round(cob * 100) +
          '% da parte do dia (' +
          gs(rateio) +
          ').'
        : 'Sem vendas neste dia, nada foi separado para as contas.') +
      '</div>' +
      (dl.length
        ? '<div class="lbl">Gastos e mudanças registrados</div>' + dl.map(dlogCard).join('')
        : '<div class="hint" style="margin:0">Nenhum gasto extra ou mudança de despesa registrado neste dia.</div>') +
      '</section>';
    if (tr.length)
      h +=
        '<section class="card col"><h2 style="margin:0;font-size:16px">Trocas de moeda</h2>' +
        tr
          .map(function (x) {
            return (
              '<div class="sl"><span>' +
              fmtM(x.dado, x.de) +
              ' → ' +
              fmtM(x.rec, x.para) +
              '<small>' +
              fh(x.ts) +
              ' · ' +
              (x.difGs >= 0 ? '+' : '−') +
              gs(Math.abs(x.difGs)) +
              ' em relação ao câmbio do dia</small></span></div>'
            );
          })
          .join('') +
        '</section>';
    if (el.length)
      h +=
        '<section class="col"><div class="lbl" style="margin:6px 0 0">Entradas de estoque</div>' +
        el.map(elogCard).join('') +
        '</section>';
    h +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Fechamento do dia</h2><div class="split">' +
      [
        ['Vendido', gs(vend)],
        ['Reposição separada', gs(sumBy(ok, 'rep')) + ' (' + usd(sumBy(ok, 'repUSD')) + ')'],
        ['Contas separadas', gs(contasSep)],
        ['Colchão separado', gs(sumBy(ok, 'colch'))],
        ['Caixa de melhorias', gs(sumBy(ok, 'melh'))],
        ['Lucro livre', gs(liv)],
        ['Gastos extras (imprevistos e melhorias)', '−' + gs(extraG)],
        ['Lucro livre depois dos gastos extras', gs(liv - extraG)]
      ]
        .map(function (r, i) {
          return (
            '<div class="sl"' +
            (i === 7
              ? ' style="border-top:1px solid var(--line);padding-top:8px;font-weight:700"'
              : '') +
            '><span>' +
            r[0] +
            '</span><b>' +
            r[1] +
            '</b></div>'
          );
        })
        .join('') +
      '</div></section>';
    box.innerHTML = h;
  }
  // Rótulo e texto de um registro de despesa.
  function dlogInfo(x) {
    var L = {
        alt: 'Valor alterado',
        novo: 'Nova despesa',
        rem: 'Despesa removida',
        imp: 'Imprevisto',
        melh: 'Caixa de melhorias',
        lote: 'Compra de lote',
        pago: 'Conta paga',
        ret: 'Retirada do dono',
        descarte: 'Descarte (prejuízo)',
        confcx: 'Conferência do caixa'
      }[x.kind],
      t,
      a;
    if (x.kind === 'alt') {
      var d = x.para - x.de;
      t =
        x.nome +
        ' (' +
        CATS[x.cat] +
        '): ' +
        gs(x.de) +
        ' → ' +
        gs(x.para) +
        ' (' +
        (d >= 0 ? '+' : '−') +
        pc(Math.abs(x.para / x.de - 1)) +
        ')';
      a = sgn(d) + ' por mês';
    } else if (x.kind === 'novo') {
      t =
        x.nome + ' (' + CATS[x.cat] + ', ' + (x.tipo === 'fixa' ? 'fixa' : 'variável') + ') criada';
      a = gs(x.valor) + ' por mês';
    } else if (x.kind === 'rem') {
      t = x.nome + ' (' + CATS[x.cat] + ') removida. Valor era ' + gs(x.valor) + ' por mês';
      a = '−' + gs(x.valor) + ' por mês';
    } else if (x.kind === 'lote') {
      t = x.desc + ' pago em dólar';
      a = usd(x.usd);
    } else {
      t = x.desc;
      a = x.moeda && x.moeda !== 'pyg' && x.orig != null ? fmtM(x.orig, x.moeda) : gs(x.valor);
    }
    return { label: L, text: t, amount: a, search: (L + ' ' + t).toLowerCase() };
  }
  // Cartão de um registro de despesa.
  function dlogCard(x) {
    var i = dlogInfo(x);
    return (
      '<div class="card" style="padding:14px"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:center"><div style="min-width:0"><span class="cell">' +
      i.label +
      '</span><div style="margin-top:6px">' +
      esc(i.text) +
      '</div><div class="hint" style="margin:2px 0 0">' +
      fd(x.ts) +
      ' às ' +
      fh(x.ts) +
      '</div></div><b>' +
      esc(i.amount) +
      '</b></div></div>'
    );
  }
  // Cartão de uma venda no histórico.
  function saleCard(s) {
    var open = S.hOpen === s.id,
      dx = S.fx.pyg / s.fx - 1,
      h = '';
    h +=
      '<div class="card col" style="padding:14px;' +
      (s.estorno ? 'opacity:.7' : '') +
      '"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:center"><div><span class="cell">' + (s.carrinho ? 'Venda (carrinho)' : 'Venda') + '</span><div style="margin-top:6px"><b style="' +
      (s.estorno ? 'text-decoration:line-through' : '') +
      '">' +
      esc(descOf(s)) +
      '</b></div><div class="hint" style="margin:2px 0 0">' +
      s.id +
      ' · ' +
      fd(s.ts) +
      ' às ' +
      fh(s.ts) +
      ' · ' +
      tipoOf(s.tipo).label +
      (s.estorno ? ' · <span style="color:var(--bad)">Estornada</span>' : '') +
      '</div></div><b>' +
      gs(s.price) +
      '</b></div>';
    h +=
      '<div class="nav"><button class="chip" data-act="hopen" data-id="' +
      s.id +
      '" aria-expanded="' +
      open +
      '">' +
      (open ? 'Ocultar detalhes' : 'Ver detalhes') +
      '</button>' +
      (s.estorno
        ? ''
        : '<button class="chip" data-act="estorno" data-id="' +
          s.id +
          '">' +
          (S.confEst === s.id ? 'Confirmar estorno' : 'Estornar') +
          '</button>') +
      '</div>';
    if (open)
      h +=
        '<div class="split" style="border-top:1px solid var(--line);padding-top:10px">' +
        [
          [
            'Recebido',
            s.pags && s.pags.length
              ? s.pags
                  .map(function (l) {
                    return fmtM(l.v, l.moeda) + (l.moeda !== 'pyg' ? ' (câmbio ' + gsRaw(Math.round(l.rate)) + ')' : '');
                  })
                  .join(' + ')
              : fmtM(s.recebido, s.moeda) + (s.moeda !== 'pyg' ? ' (cotação ' + gsRaw(s.rate) + ')' : '')
          ],
          [
            'Troco devolvido',
            s.troco && s.troco.length
              ? s.troco
                  .map(function (l) {
                    return fmtM(l.v, l.moeda);
                  })
                  .join(' + ')
              : 'sem troco'
          ],
          ['Forma de pagamento', formaPorId(s.forma).nome + (s.taxa ? ' (taxa ' + gs(s.taxa) + ')' : '')],
          [
            'Câmbio no dia',
            gsRaw(s.fx) +
              ' por US$ (hoje ' +
              gsRaw(S.fx.pyg) +
              ', ' +
              (dx >= 0 ? '+' : '−') +
              pc(Math.abs(dx)) +
              ')'
          ],
          ['Custo pago', usd(s.pago)],
          ['Custo de reposição', usd(s.repUSD)],
          ['Reposição separada', gs(s.rep)],
          ['Contas separadas', gs(s.contas) + ' (' + gs(s.cPeca) + ' por peça)'],
          ['Colchão (' + pc(s.pct) + ')', gs(s.colch)],
          ['Caixa de melhorias', gs(s.melh)],
          ['Lucro livre', gs(s.livre)],
          ['Preço mínimo seguro na hora', gs(s.trava) + ' por peça']
        ]
          .map(function (r) {
            return (
              '<div class="sl"><span>' +
              r[0] +
              '</span><b style="text-align:right">' +
              r[1] +
              '</b></div>'
            );
          })
          .join('') +
        '</div>';
    return h + '</div>';
  }

  // ---------- eventos
  // ===== Ações dos botões (data-act) e eventos globais. =====
  // Ações dos botões, por data-act.
  var ACT = {
    atmin: function () {
      S.atMin = !S.atMin;
      var c = $('atCard');
      if (c) {
        c.classList.toggle('min', !!S.atMin);
        var b = c.querySelector('.atcab');
        b.setAttribute('aria-expanded', !S.atMin);
        b.setAttribute('aria-label', (S.atMin ? 'Mostrar' : 'Minimizar') + ' atenção agora');
      }
      saveSoon();
    },
    notifLimpa: function () {
      S.notifs = [];
      render();
    },
    inicioEd: function () {
      S.inicioEd = !S.inicioEd;
      render();
    },
    inicioReset: function () {
      S.inicioT = null;
      render();
    },
    inicioRm: function (id) {
      iniSalvar(
        iniLista().filter(function (x) {
          return x !== id;
        })
      );
    },
    inicioAdd: function (id) {
      var l = iniLista();
      l.push(id);
      iniSalvar(l);
    },
    inicioMv: function (v) {
      var p = v.split('|'),
        l = iniLista(),
        i = l.indexOf(p[0]),
        j = i + (+p[1] || 0);
      if (i < 0 || j < 0 || j >= l.length) return;
      var t = l[i];
      l[i] = l[j];
      l[j] = t;
      iniSalvar(l);
    },
    inicio: function (id) {
      inicioGo(id);
    },
    view: function (id) {
      setView(id);
    },
    per: function (id) {
      S.per = id;
      renderDash();
    },
    fxnow: function () {
      fetchFx();
    },
    fxup: function () {
      setFx(
        S.fx.pyg * 1.03,
        S.fx.brl,
        'Simulação (demonstração)',
        false,
        'Cotação simulada para teste: dólar +3%.'
      );
    },
    fxdn: function () {
      setFx(
        S.fx.pyg * 0.97,
        S.fx.brl,
        'Simulação (demonstração)',
        false,
        'Cotação simulada para teste: dólar −3%.'
      );
    },
    opendia: function (id) {
      S.day = id;
      S.dayTab = id;
      S.view = 'dia';
      render();
      window.scrollTo(0, 0);
    },
    closedia: function () {
      S.dayTab = '';
      if (S.view === 'dia') S.view = 'hist';
      render();
      window.scrollTo(0, 0);
    },
    hback: function () {
      setView('hist');
    },
    dayprev: function () {
      var p = S.day.split('-'),
        d = new Date(+p[0], +p[1] - 1, +p[2] - 1);
      S.day = S.dayTab = dayKey(d.getTime());
      renderDay();
      renderNav();
    },
    daynext: function () {
      var p = S.day.split('-'),
        d = new Date(+p[0], +p[1] - 1, +p[2] + 1),
        k = dayKey(d.getTime());
      if (k <= dayKey(Date.now())) {
        S.day = S.dayTab = k;
        renderDay();
        renderNav();
      }
    },
    daytoday: function () {
      S.day = S.dayTab = dayKey(Date.now());
      renderDay();
      renderNav();
    },
    hopen: function (id) {
      S.hOpen = S.hOpen === id ? '' : id;
      renderDay();
      if (S.view === 'hist') histLista();
    },
    estorno: function (id) {
      if (S.confEst !== id) {
        S.confEst = id;
        renderDay();
        return;
      }
      var s = S.sales.filter(function (x) {
        return x.id === id;
      })[0];
      s.estorno = true;
      S.confEst = '';
      var it = S.items.filter(function (x) {
        return (
          x.tipo === s.tipo &&
          x.ref === s.ref &&
          x.cor === s.cor &&
          x.grau === s.grau &&
          x.vr === s.vr &&
          (x.lote || '') ===
            (S.grp.some(function (g) {
              return g.id === s.lote;
            })
              ? s.lote
              : '')
        );
      })[0];
      if (s.pags) {
        s.pags.forEach(function (l) {
          S.cash[l.moeda] -= l.v - (l.fee || 0);
        });
        (s.troco || []).forEach(function (l) {
          S.cash[l.moeda] += l.v;
        });
      } else S.cash[s.moeda] -= s.recebido - (s.taxaM || 0);
      estornoBrinde(s);
      if (it) {
        it.qty += s.qty;
        var eg =
          it.lote &&
          S.grp.filter(function (x) {
            return x.id === it.lote;
          })[0];
        if (eg) {
          eg.sold = Math.max(0, (eg.sold || 0) - s.qty);
          if (it.custo != null && !it.bulk) {
            eg.ownQ = Math.max(0, (eg.ownQ || 0) - s.qty);
            eg.ownC = Math.max(0, (eg.ownC || 0) - s.qty * it.custo);
          }
        }
      }
      render();
    },
    exppay: function (id) {
      var e = S.exp.filter(function (x) {
        return String(x.id) === id;
      })[0];
      if (!e) return;
      if (!e.paid) e.paid = {};
      var k = ymNow(),
        m = expMoeda(e);
      if (!S.cpay) S.cpay = [];
      if (e.paid[k]) {
        var pts = e.paid[k],
          pg = S.cpay.filter(function (x) {
            return x.id === e.id && x.ym === k;
          })[0],
          pm0 = (pg && pg.moeda) || 'pyg',
          pv0 = pg ? (pg.moeda && pg.orig != null ? pg.orig : pg.valor) : e.valor;
        S.cash[pm0] += pv0;
        desfazerPagamento(e, k, pts);
        delete e.paid[k];
        S.cxMsg = 'Pagamento de "' + e.nome + '" desfeito. ' + fmtM(pv0, pm0) + ' voltaram ao caixa.';
      } else {
        var need = expOrig(e);
        if ((S.cash[m] || 0) < need - 1e-9) {
          popErr(
            'Saldo em ' +
              m.toUpperCase() +
              ' insuficiente no caixa (' +
              fmtM(Math.max(0, S.cash[m] || 0), m) +
              ') para pagar ' +
              fmtM(need, m) +
              '. Corrija o saldo na aba Caixa ou troque moeda.'
          );
          return;
        }
        var t0 = Date.now();
        S.cash[m] -= need;
        e.paid[k] = t0;
        lancarPagamento(e, k, t0);
        S.cxMsg = 'Paguei "' + e.nome + '": ' + fmtM(need, m) + ' saíram do caixa.';
      }
      saveSoon();
      renderDesp();
      renderCaixa();
      renderDash();
    },
    expsave: function (id) {
      var e = S.exp.filter(function (x) {
          return String(x.id) === id;
        })[0],
        m = expMoeda(e),
        raw = m === 'pyg' ? toNum($('ev-' + id).value) : parseDec($('ev-' + id).value, m),
        v = m === 'pyg' ? raw : Math.round(raw * ratePyg(m));
      if (!raw) return;
      e.updYm = ymNow();
      if (m !== 'pyg') {
        e.rate0 = ratePyg(m);
        if (Math.abs(raw - expOrig(e)) < 1e-9) return renderDesp();
        e.orig = raw;
      } else if (v === e.valor) return renderDesp();
      if (v !== e.valor) {
        e.hist.push({ ts: Date.now(), de: e.valor, para: v });
        logDespesa('alt', { nome: e.nome, cat: e.cat, de: e.valor, para: v });
      }
      e.valor = v;
      renderDesp();
      renderDash();
    },
    exprm: function (id) {
      if (S.confRm !== Number(id)) {
        S.confRm = Number(id);
        renderDesp();
        return;
      }
      var rm = S.exp.filter(function (x) {
        return x.id === Number(id);
      })[0];
      if (rm) logDespesa('rem', { nome: rm.nome, cat: rm.cat, valor: rm.valor });
      S.exp = S.exp.filter(function (x) {
        return x.id !== Number(id);
      });
      S.confRm = '';
      renderDesp();
      renderDash();
    },
    expadd: function () {
      var n = cap1($('nName').value),
        m = $('nMoeda').value,
        raw = m === 'pyg' ? toNum($('nVal').value) : parseDec($('nVal').value, m),
        dia = Math.round(toNum($('nDia').value)) || 0;
      if (!n || !raw) {
        $('nH').textContent = 'Informe o nome e o valor.';
        return;
      }
      if (dia && (dia < 1 || dia > 31)) {
        $('nH').textContent = 'O dia de vencimento vai de 1 a 31.';
        return;
      }
      var v = m === 'pyg' ? raw : Math.round(raw * ratePyg(m)),
        ne = {
          id: S.nextExp++,
          nome: n,
          cat: $('nCat').value,
          tipo: $('nTipo').value,
          valor: v,
          hist: [],
          updYm: ymNow()
        };
      if (m !== 'pyg') {
        ne.moeda = m;
        ne.orig = raw;
        ne.rate0 = ratePyg(m);
      }
      if (dia) ne.dia = dia;
      S.exp.push(ne);
      logDespesa('novo', { nome: n, cat: $('nCat').value, tipo: $('nTipo').value, valor: v });
      renderDesp();
      renderDash();
    },
    trflip: function () {
      var t = S.tr;
      var d = t.de;
      t.de = t.para;
      t.para = d;
      t.edited = false;
      renderCaixa();
    },
    trocar: function () {
      var t = S.tr,
        v = parseDec(t.v, t.de),
        rec = parseDec(t.rec, t.para);
      if (t.de === t.para) {
        S.cxMsg = 'Escolha moedas diferentes.';
      } else if (!v || !rec) {
        S.cxMsg = 'Informe o valor que troca e o valor que recebe.';
      } else if (S.cash[t.de] < v) {
        S.cxMsg =
          'Saldo insuficiente em ' + MN[t.de] + ': você tem ' + fmtM(S.cash[t.de], t.de) + '.';
      } else {
        var dif = Math.round(rec * ratePyg(t.para) - v * ratePyg(t.de));
        S.cash[t.de] -= v;
        S.cash[t.para] += rec;
        S.cambios.unshift({
          ts: Date.now(),
          de: t.de,
          para: t.para,
          dado: v,
          rec: rec,
          difGs: dif
        });
        S.cxMsg = 'Troca registrada: ' + fmtM(v, t.de) + ' → ' + fmtM(rec, t.para) + '.';
        t.v = '';
        t.rec = '';
        t.edited = false;
      }
      renderCaixa();
      renderDash();
    },
    melhuso: function () {
      var v = campoParaGs($('muV').value),
        d = $('muD').value.trim() || 'Melhoria da loja',
        r = reservas();
      if (!v) {
        S.cxMsg = 'Informe o valor usado.';
      } else if (v > r.melh) {
        S.cxMsg = 'Saldo de melhorias insuficiente: há ' + gs(r.melh) + '.';
      } else if (v > S.cash.pyg) {
        S.cxMsg = 'Saldo insuficiente em guaranis em caixa.';
      } else {
        S.cash.pyg -= v;
        lancarMelhoria(d, v);
        S.cxMsg = 'Uso registrado: ' + gs(v) + ' em ' + d + '.';
      }
      renderCaixa();
    },
    ajustar: function () {
      S.cash = {
        pyg: parseDec($('ajP').value, 'pyg'),
        usd: parseDec($('ajU').value, 'usd'),
        brl: parseDec($('ajB').value, 'brl')
      };
      S.ini = {
        rep: parseDec($('ajR').value, 'usd'),
        colch: campoParaGs($('ajC').value),
        melh: campoParaGs($('ajM').value)
      };
      S.cxMsg = 'Saldos salvos.';
      renderCaixa();
      renderDash();
    },
    resetall: function () {
      if (!S.confReset) {
        S.confReset = true;
        renderCaixa();
        return;
      }
      if (!S._resetAuth) {
        exigirAuth(function () {
          S._resetAuth = true;
          ACT.resetall();
        });
        return;
      }
      S._resetAuth = false;
      S.retiradas = [];
      S.descartes = [];
      S.confCx = [];
      S.items = [];
      S.sales = [];
      S.saleSeq = 0;
      S.imprev = [];
      S.dlog = [];
      S.elog = [];
      S.cambios = [];
      S.compras = [];
      S.melhUso = [];
      S.fotos = {};
      S.desc = {};
      S.pnome = {};
      S.cpay = [];
      S.appStart = Date.now();
      S.conf = {};
      S.pfaixa = {};
      S.contagens = [];
      S.exp = [];
      S.lotes = [];
      S.grp = [];
      S.cash = { pyg: 0, usd: 0, brl: 0 };
      S.ini = { rep: 0, colch: 0, melh: 0 };
      S.sold = 0;
      S.confReset = false;
      S.open = '';
      S.det = false;
      S.selItem = null;
      S.dayTab = '';
      S.view = 'dash';
      S.cxMsg =
        'Dados de exemplo apagados. Comece pelas Despesas, pelo saldo do Caixa e pelo Estoque.';
      render();
      window.scrollTo(0, 0);
    },
    impdel: function (id) {
      var x = S.imprev[+id];
      if (!x) return;
      if (S._impDel !== id) {
        S._impDel = id;
        S.cxMsg = '';
        var b = document.querySelector('[data-act="impdel"][data-id="' + id + '"]');
        if (b) {
          b.textContent = 'Remover?';
          b.style.cssText = 'opacity:1;width:auto;padding:0 10px;color:var(--bad)';
        }
        setTimeout(function () {
          if (S._impDel === id) {
            S._impDel = null;
            renderDesp();
          }
        }, 3500);
        return;
      }
      S._impDel = null;
      S.imprev.splice(+id, 1);
      for (var i = S.dlog.length - 1; i >= 0; i--) {
        var d = S.dlog[i];
        if (d.kind === 'imp' && d.ts === x.ts && d.valor === x.valor && d.desc === x.desc) {
          S.dlog.splice(i, 1);
          break;
        }
      }
      render();
    },
    impadd: function () {
      var d = $('impD').value.trim(),
        v = campoParaGs($('impV').value);
      if (!d || !v) return;
      lancarImprevisto(d, v);
      renderDesp();
    }
  };
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]');
    if (!t) return;
    e.preventDefault();
    var f = ACT[t.getAttribute('data-act')];
    if (f) f(t.getAttribute('data-id'));
  });
  document.addEventListener('input', function (e) {
    var t = e.target,
      k = t.getAttribute && t.getAttribute('data-in');
    if (!k) return;
    if (k === 'exp') {
      var ex = S.exp.filter(function (x) {
          return String(x.id) === t.getAttribute('data-id');
        })[0],
        v = toNum(t.value),
        p = $('pv-' + ex.id);
      var mx = expMoeda(ex);
      if (mx !== 'pyg') v = Math.round(parseDec(t.value, mx) * ratePyg(mx));
      var nt = tm2(ex, v),
        old = totalMensal();
      p.textContent =
        v && v !== ex.valor
          ? 'Valor muda ' +
            sgn(v - ex.valor) +
            ' (' +
            (v >= ex.valor ? '+' : '−') +
            pc(Math.abs(v / ex.valor - 1)) +
            '). Total mensal: ' +
            gs(old) +
            ' → ' +
            gs(nt) +
            '. Cada peça passa a separar ' +
            gs(Math.round(nt / volumeEfetivo())) +
            ' (hoje ' +
            gs(contasPeca()) +
            ').'
          : 'Altere e veja o efeito antes de salvar.';
    }
    if (k === 'volume') {
      S.volume = Math.max(1, toNum(t.value));
      $('tmPeca').textContent = gs(contasPeca());
    }
    if (k === 'melh') {
      S.melhPeca = campoParaGs(t.value);
    }

    if (k === 'day') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(t.value)) {
        S.day = S.dayTab = t.value;
        renderDay();
        renderNav();
      }
    }
    if (k === 'rec') {
      var rv = parseDec(t.value, S.moeda);
      S.rec = rv;
      S.recSig = S._sig;
      S._recv = rv;
      updateRec();
    }
    if (k === 'trDe' || k === 'trPara') {
      S.tr[k === 'trDe' ? 'de' : 'para'] = t.value;
      if (S.tr.de === S.tr.para)
        S.tr[k === 'trDe' ? 'para' : 'de'] = ['pyg', 'usd', 'brl'].filter(function (m) {
          return m !== t.value;
        })[0];
      S.tr.edited = false;
      renderCaixa();
    }
    if (k === 'trV') {
      S.tr.v = t.value;
      updateTr();
    }
    if (k === 'trRec') {
      S.tr.rec = t.value;
      S.tr.edited = true;
      updateTr();
    }
  });
  function tm2(e, v) {
    return totalMensal() - e.valor + v;
  }
  window.addEventListener('hashchange', function () {
    var v = location.hash.slice(1);
    if (
      VIEWS.some(function (x) {
        return x[0] === v;
      }) &&
      v !== S.view
    ) {
      S.view = v;
      render();
    }
  });
  if (
    VIEWS.some(function (x) {
      return x[0] === location.hash.slice(1);
    })
  )
    S.view = location.hash.slice(1);
  setTimeout(fetchFx, 1200);

  // ================= Moedas, Caixa =================
  var MN = { pyg: 'G$', usd: 'US$', brl: 'R$' };
  S.moeda = 'pyg';
  S.rec = null;
  S.recSig = '';
  S._sig = '';
  S._recv = 0;
  S._t = TIPOS[0];
  S._qty = 1;
  S.cash = { pyg: 1850000, usd: 320, brl: 1400 };
  S.ini = { rep: 180, colch: 150000, melh: 250000 };
  S.compras = [{ ts: tAgo(12), desc: 'Lote #3251 (parte paga)', usd: 100 }];
  S.melhUso = [{ ts: tAgo(8), desc: 'Tinta da fachada', valor: 15000 }];
  S.cambios = [{ ts: tAgo(7), de: 'pyg', para: 'usd', dado: 650000, rec: 100, difGs: -2500 }];
  S.tr = { de: 'pyg', para: 'usd', v: '300000', rec: '', edited: false };
  S.cxMsg = '';
  // ===== Aba Caixa: carteira, conversão de moedas e reservas. =====
  // Cotação de uma moeda em guaranis.
  function ratePyg(m) {
    return m === 'pyg' ? 1 : m === 'usd' ? S.fx.pyg : S.fx.pyg / S.fx.brl;
  }
  // Converte entre moedas.
  function conv(v, a, b) {
    return (v * ratePyg(a)) / ratePyg(b);
  }
  // Total da carteira em guaranis.
  function walletGs() {
    return S.cash.pyg + S.cash.usd * ratePyg('usd') + S.cash.brl * ratePyg('brl');
  }
  // Lê um número digitado.
  function parseDec(v, m) {
    var s = String(v).replace(/[^\d,.]/g, '');
    if (m === 'pyg') return Number(s.replace(/\D/g, '')) || 0;
    if (s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.');
    var n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  }
  // Formata um valor para campo.
  function inVal(v, m) {
    return m === 'pyg' ? dots(v) : (Math.round(v * 100) / 100).toFixed(2).replace('.', ',');
  }
  // Valores reservados (reposição, contas, lucro).
  function reservas() {
    var valid = S.sales.filter(function (s) {
      return !s.estorno;
    });
    var rUSD = Math.max(
      0,
      S.ini.rep +
        sumBy(valid, 'repUSD') -
        S.compras.reduce(function (a, x) {
          return a + x.usd;
        }, 0)
    );
    var colch = S.ini.colch + sumBy(valid, 'colch'),
      con = Math.max(
        0,
        sumBy(periodSales(30), 'contas') -
          (S.cpay || [])
            .filter(function (x) {
              return x.ts > Date.now() - 30 * 864e5;
            })
            .reduce(function (a, x) {
              return a + x.valor;
            }, 0)
      );
    var melh =
      S.ini.melh +
      sumBy(valid, 'melh') -
      S.melhUso.reduce(function (a, x) {
        return a + x.valor;
      }, 0);
    var repGs = rUSD * S.fx.pyg,
      guard = repGs + colch + con,
      wal = walletGs();
    return {
      rUSD: rUSD,
      repGs: repGs,
      colch: colch,
      con: con,
      melh: melh,
      guard: guard,
      wal: wal,
      livre: wal - guard - melh
    };
  }
  // Atualiza o recebimento ao digitar.
  function updateRec() {
    var m = S.moeda,
      t = S._t,
      q = S._qty,
      v = S._recv,
      pt = pagTotais(),
      eff = pt.liq,
      el = $('recH');
    if (!el) return;
    var trava = Math.round(t.repUSD * S.fx.pyg) + contasPeca(),
      per = q ? eff / q : 0,
      list = t.price * q,
      diff = eff - list;
    el.textContent =
      'Equivale a ' +
      gs(eff) +
      (m !== 'pyg'
        ? ' (' + (numRate(S.rate1) > 0 ? 'câmbio combinado' : fxOrigem(m)) + ': ' + MN[m] + ' 1 = ' + gsRaw(Math.round(rateDe(m, numRate(S.rate1)))) + ')'
        : '') +
      (t.price && Math.abs(diff) >= 1
        ? '. ' +
          (diff > 0 ? 'Acima' : 'Abaixo') +
          ' do preço de tabela em ' +
          gs(Math.abs(Math.round(diff))) +
          '.'
        : '.') +
      (per < trava ? ' Atenção: abaixo da trava de segurança (' + gs(trava) + ' por peça).' : '');
    el.style.color = per < trava ? 'var(--warn)' : 'var(--mute)';
    if (typeof renderPiso === 'function' && (S._vsel || S.cartOpen)) renderPiso();
  }
  // Calculadora de venda por moeda.
  function renderMoeda() {
    var t = S._t || T(),
      q = (S._qty = S.qty),
      m = S.moeda;
    if (S._pagKey !== S._selKey) {
      S._pagKey = S._selKey;
      pagReset();
    }
    var listGs = t.price * q - (S.descGs || 0);
    S._dueGs = listGs;
    var r1 = rateDe(m, numRate(S.rate1)),
      a = m === 'pyg' ? Math.round(listGs) : Math.round((listGs / r1) * 100) / 100;
    var bb = S.vBrinde ? S.vBrinde.ref + S.vBrinde.cor : '',
      sig = [t.id, S._selKey, q, m, Math.round(S.fx.pyg), S.descGs || 0, bb, S.rate1 || '', S.pagMisto ? 1 : 0].join('|');
    if (S.rec != null && S.recSig !== sig) S.rec = null;
    S._sig = sig;
    var v = S.rec != null ? S.rec : S.pagMisto ? 0 : a;
    S._recv = v;
    var mo = $('moedas');
    mo.textContent = '';
    [
      ['pyg', 'G$ Guarani'],
      ['brl', 'R$ Real'],
      ['usd', 'US$ Dólar']
    ].forEach(function (x) {
      mo.appendChild(
        btn(
          'chip' + (m === x[0] ? ' on' : ''),
          x[1],
          function () {
            S.moeda = x[0];
            S.rate1 = '';
            S.rec = null;
            render();
          },
          m === x[0]
        )
      );
    });
    renderForma();
    $('recIn').value = S.pagMisto && S.rec == null ? '' : inVal(v, m);
    pmRender();
    updateRec();
  }

  // ---------- caixa
  function trSel(id, val) {
    return (
      '<select class="in" id="' +
      id +
      '" data-in="' +
      id +
      '" aria-label="' +
      (id === 'trDe' ? 'Trocar de' : 'Receber em') +
      '" style="flex:1 1 130px;width:auto">' +
      ['pyg', 'usd', 'brl']
        .map(function (m) {
          return (
            '<option value="' +
            m +
            '"' +
            (m === val ? ' selected' : '') +
            '>' +
            { pyg: 'G$ Guarani', usd: 'US$ Dólar', brl: 'R$ Real' }[m] +
            '</option>'
          );
        })
        .join('') +
      '</select>'
    );
  }
  // O que já tem dono (reposição, colchão, contas, melhorias): usado no Dashboard.
  function donoHtml() {
    var r = reservas(),
      html = '';
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">O que já tem dono</h2><div class="hint" style="margin:2px 0 0">Valores acumulados pelas vendas, mais o saldo inicial que você informou.</div></div><div class="split">' +
      '<div class="sl"><span>Mercadoria (reposição)<small>' +
      usd(r.rUSD) +
      ' guardados. Custo de repor hoje: ' +
      gs(r.repGs) +
      '</small></span><b>' +
      gs(r.repGs) +
      '</b></div>' +
      '<div class="sl"><span>Colchão de segurança<small>reserva contra alta do dólar e do custo</small></span><b>' +
      gs(r.colch) +
      '</b></div>' +
      '<div class="sl"><span>Contas do mês<small>separado nos últimos 30 dias, de ' +
      gs(totalMensal()) +
      ' por mês</small></span><b>' +
      gs(r.con) +
      '</b></div>' +
      '<div class="sl"><span><b>Total guardado</b></span><b style="color:var(--warn)">' +
      gs(r.guard) +
      '</b></div>' +
      '<div class="sl" style="border-top:1px solid var(--line);padding-top:10px"><span>Caixa de melhorias da loja<small>opcional, não trava venda</small></span><b style="color:var(--info)">' +
      gs(r.melh) +
      '</b></div></div></section>';
    return html;
  }
  // Contas pagas no mês: usado no Dashboard.
  function contasPagasHtml() {
    var html = '';
    var pmk = ymNow(),
      pays = (S.cpay || [])
        .filter(function (x) {
          return x.ym === pmk;
        })
        .sort(function (a, b) {
          return b.ts - a.ts;
        }),
      ptot = pays.reduce(function (a, x) {
        return a + x.valor;
      }, 0);
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Contas pagas neste mês</h2><div class="hint" style="margin:2px 0 0">Cada vez que você toca em Pagar na aba Despesas, o valor sai dos guaranis em caixa e da reserva de contas.</div></div>' +
      (pays.length
        ? pays
            .map(function (x) {
              return (
                '<div class="sl"><span>' +
                esc(x.nome) +
                '<small>' +
                fd(x.ts) +
                ' às ' +
                fh(x.ts) +
                '</small></span><b>' +
                gs(x.valor) +
                '</b></div>'
              );
            })
            .join('') +
          '<div class="sl" style="border-top:1px solid var(--line);padding-top:10px"><span><b>Total pago</b></span><b>' +
          gs(ptot) +
          '</b></div>'
        : '<div class="hint" style="margin:0">Nenhuma conta paga neste mês ainda.</div>') +
      '</section>';
    return html;
  }
  // Aba Caixa.
  function renderCaixa() {
    var el = $('v-caixa'),
      r = reservas(),
      c = S.cash;
    var html =
      '<div class="top"><div><h1>Caixa</h1><div class="crumb">Quanto dinheiro existe, quanto já tem dono e quanto é seu</div></div></div>';
    if (S.cxMsg)
      html +=
        '<div class="note ' +
        (S.cxMsg.indexOf('Não') === 0 ||
        S.cxMsg.indexOf('Saldo') === 0 ||
        S.cxMsg.indexOf('Informe') === 0
          ? 'n-bad'
          : 'n-ok') +
        '" role="status">' +
        esc(S.cxMsg) +
        '</div>';
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Dinheiro no caixa agora</h2><div class="hint" style="margin:2px 0 0">O que você tem em mãos, em cada moeda.</div></div><div class="kpis">' +
      ['pyg', 'usd', 'brl']
        .map(function (m) {
          return (
            '<div class="kpi" style="background:var(--panel2)"><div class="lbl">' +
            { pyg: 'Guaranis', usd: 'Dólares', brl: 'Reais' }[m] +
            '</div><b style="font-size:24px">' +
            fmtM(c[m], m) +
            '</b><div class="hint">' +
            (m === 'pyg' ? 'moeda base' : '≈ ' + gsRaw(Math.round(c[m] * ratePyg(m)))) +
            '</div></div>'
          );
        })
        .join('') +
      '</div><div class="hint" style="margin:0">Total aproximado: <b>' +
      gs(Math.round(r.wal)) +
      '</b> ao câmbio de hoje. O que está livre e o que já tem dono ficam no <a href="#dash" data-act="view" data-id="dash" style="color:var(--accent-fg)">Dashboard</a>, aba Dinheiro.</div></section>';
    if (r.livre < 0)
      html +=
        '<div class="note n-bad">O dinheiro em caixa está abaixo do que deveria estar separado. Evite retiradas até repor.</div>';
    html += retiradaHtml() + ccHtml();
    var t = S.tr;
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Trocar moeda</h2><div class="hint" style="margin:2px 0 0">Registre a troca que você fez. Os saldos mudam nas duas moedas.</div></div>' +
      '<div class="sel" style="flex-wrap:wrap">' +
      trSel('trDe', t.de) +
      '<button class="chip" data-act="trflip" aria-label="Inverter as moedas">⇄ Inverter</button>' +
      trSel('trPara', t.para) +
      '</div>' +
      '<div class="sel" style="flex-wrap:wrap"><div style="flex:1 1 160px"><div class="lbl">Você troca (' +
      MN[t.de] +
      ')</div><input class="in" id="trV" inputmode="decimal" data-in="trV" value="' +
      esc(t.v) +
      '" aria-label="Valor a trocar"></div>' +
      '<div style="flex:1 1 160px"><div class="lbl">Você recebe (' +
      MN[t.para] +
      ')</div><input class="in" id="trRec" inputmode="decimal" data-in="trRec" value="' +
      esc(t.rec) +
      '" aria-label="Valor recebido na troca"></div></div>' +
      '<div class="hint" id="trPrev" role="status" style="margin:0"></div><button class="go" data-act="trocar">Registrar troca</button>' +
      (S.cambios.length
        ? '<div class="lbl" style="margin-top:6px">Últimas trocas</div>' +
          S.cambios
            .slice(0, 5)
            .map(function (x) {
              return (
                '<div class="sl"><span>' +
                fmtM(x.dado, x.de) +
                ' → ' +
                fmtM(x.rec, x.para) +
                '<small>' +
                fd(x.ts) +
                ' às ' +
                fh(x.ts) +
                ' · ' +
                (x.difGs >= 0 ? '+' : '−') +
                gs(Math.abs(x.difGs)) +
                ' em relação ao câmbio do dia</small></span></div>'
              );
            })
            .join('')
        : '') +
      '</section>';
    html +=
      '<div class="two">' +
      '<section class="card col"><h2 style="margin:0;font-size:16px">Usar a caixa de melhorias</h2><div class="hint" style="margin:0">Tira do saldo de melhorias e dos guaranis em caixa.</div>' +
      '<div class="sel" style="flex-wrap:wrap"><input class="in" id="muD" placeholder="No que usou" style="flex:2 1 150px;width:auto" aria-label="Descrição do uso"><input class="in" id="muV" inputmode="' + mpMode() + '" placeholder="' + mpSim() + '" style="flex:1 1 110px;width:auto" aria-label="Valor usado"><button class="mini" data-act="melhuso">Registrar</button></div>' +
      S.melhUso
        .slice(-3)
        .reverse()
        .map(function (x) {
          return (
            '<div class="sl"><span>' +
            esc(x.desc) +
            '<small>' +
            fd(x.ts) +
            '</small></span><b>' +
            gs(x.valor) +
            '</b></div>'
          );
        })
        .join('') +
      '</section></div>';
    html +=
      '<details class="card"' +
      (S.confReset ? ' open' : '') +
      '><summary style="cursor:pointer;font-weight:600">Corrigir saldos, saldo inicial e zerar o app</summary><div class="col" style="margin-top:12px"><div class="kpis">' +
      [
        ['ajP', 'Guaranis', inVal(c.pyg, 'pyg')],
        ['ajU', 'Dólares', inVal(c.usd, 'usd')],
        ['ajB', 'Reais', inVal(c.brl, 'brl')]
      ]
        .map(function (x) {
          return (
            '<div><div class="lbl">' +
            x[1] +
            '</div><input class="in" id="' +
            x[0] +
            '" inputmode="decimal" value="' +
            x[2] +
            '" aria-label="Saldo em ' +
            x[1] +
            '"></div>'
          );
        })
        .join('') +
      '</div>' +
      '<div class="lbl">Saldo inicial das reservas (antes de usar o app)</div><div class="kpis">' +
      [
        ['ajR', 'Mercadoria (US$)', inVal(S.ini.rep, 'usd')],
        ['ajC', 'Colchão (' + mpSim() + ')', gsParaCampo(S.ini.colch)],
        ['ajM', 'Melhorias (' + mpSim() + ')', gsParaCampo(S.ini.melh)]
      ]
        .map(function (x) {
          return (
            '<div><div class="lbl">' +
            x[1] +
            '</div><input class="in" id="' +
            x[0] +
            '" inputmode="decimal" value="' +
            x[2] +
            '" aria-label="' +
            x[1] +
            '"></div>'
          );
        })
        .join('') +
      '</div>' +
      '<button class="mini" data-act="ajustar" style="align-self:flex-start">Salvar saldos</button><div class="lbl" style="margin-top:8px">Começar do zero</div><div class="hint" style="margin:0">Apaga as peças, vendas, despesas e saldos de exemplo deste aparelho.</div><button class="chip" data-act="resetall" style="align-self:flex-start;color:var(--bad)">' +
      (S.confReset ? 'Confirmar: apagar tudo' : 'Apagar dados de exemplo') +
      '</button></div></details>';
    el.innerHTML = html;
    updateTr();
  }
  // Atualiza a transferência entre moedas.
  function updateTr() {
    var t = S.tr,
      v = parseDec(t.v, t.de),
      mkt = conv(v, t.de, t.para);
    if (!t.edited) {
      t.rec = v ? inVal(mkt, t.para) : '';
      var r = $('trRec');
      if (r) r.value = t.rec;
    }
    var rec = parseDec(t.rec, t.para),
      dif = rec * ratePyg(t.para) - v * ratePyg(t.de),
      p = $('trPrev');
    if (p)
      p.textContent = v
        ? 'Pelo câmbio de hoje: ' +
          fmtM(mkt, t.para) +
          '.' +
          (t.edited
            ? ' Você recebe ' +
              fmtM(rec, t.para) +
              ' (' +
              (dif >= 0 ? '+' : '−') +
              gs(Math.abs(Math.round(dif))) +
              ' em relação ao câmbio de hoje).'
            : '')
        : 'Digite o valor a trocar.';
  }

  S.dlog = [];
  S.elog = [
    { ts: tAgo(2, 3), tipo: 'pre', ref: 'SP58110', cor: 'Preto', grau: '+1.25', qty: 6 },
    { ts: tAgo(5, 2), tipo: 'sem', ref: 'BR44133', cor: 'Vinho', grau: '', qty: 4 },
    { ts: tAgo(0, 6), tipo: 'pre', ref: 'SP57765', cor: 'Preto', grau: '+0.75', qty: 4 }
  ];
  S.day = dayKey(Date.now());
  S.exp.forEach(function (e) {
    e.hist.forEach(function (x) {
      S.dlog.push({ ts: x.ts, kind: 'alt', nome: e.nome, cat: e.cat, de: x.de, para: x.para });
    });
  });
  S.imprev.forEach(function (x) {
    S.dlog.push(dlogImp(x));
  });
  S.melhUso.forEach(function (x) {
    S.dlog.push(dlogMelh(x));
  });
  S.compras.forEach(function (x) {
    S.dlog.push(dlogLote(x));
  });
  // ===== Pedidos: pedidos do catálogo online para a loja (por enquanto lançados à mão; o catálogo online ligará aqui). =====
  ICO_D.ped = '<path d="M6 3h12l2 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7zM4 7h16M9 11a3 3 0 0 0 6 0"/>';
  S.pedidos = [];
  S.pedNext = 1;
  S.pedF = 'novo';
  S.pedForm = null;
  var PED_ST = [
    ['novo', 'Novo', 'Começar a separar'],
    ['sep', 'Separando', 'Marcar pronto'],
    ['pronto', 'Pronto', 'Marcar entregue'],
    ['ent', 'Entregue', ''],
    ['canc', 'Cancelado', '']
  ];
  function pedNome(st) {
    for (var i = 0; i < PED_ST.length; i++) if (PED_ST[i][0] === st) return PED_ST[i][1];
    return st;
  }
  function pedNovos() {
    return S.pedidos.filter(function (p) {
      return p.st === 'novo';
    }).length;
  }
  function pedAbertos() {
    return S.pedidos.filter(function (p) {
      return p.st === 'novo' || p.st === 'sep' || p.st === 'pronto';
    }).length;
  }
  // Valor estimado pela tabela de preços (só das linhas que são modelos do estoque).
  function pedTotal(p) {
    var t = 0;
    p.itens.forEach(function (l) {
      var it = l.ref
        ? S.items.filter(function (i) {
            return i.ref === l.ref;
          })[0]
        : null;
      try {
        if (it) t += tFor(it).price * l.q;
      } catch (e) {}
    });
    return t;
  }
  function pedZap(p) {
    var d = String(p.tel || '').replace(/\D/g, '');
    if (!d) return '';
    if (d.charAt(0) === '0') d = '595' + d.slice(1);
    var tx = 'Olá' + (p.cli ? ', ' + p.cli : '') + '! Sobre o seu pedido nº ' + p.num + ' na La Fouch: ';
    return 'https://wa.me/' + d + '?text=' + encodeURIComponent(tx);
  }
  function pedLer() {
    var f = S.pedForm;
    if (!f || !$('pCli')) return;
    f.cli = $('pCli').value;
    f.tel = $('pTel').value;
    f.obs = $('pObs').value;
    f.ref = $('pRef').value;
    f.q = Math.max(1, Math.round(toNum($('pQtd').value)) || 1);
  }
  function pedLinhaDe(txt, q) {
    var t = String(txt || '').trim(),
      ref = '';
    S.items.some(function (i) {
      if (i.ref.toLowerCase() === t.toLowerCase() || pubNome(i.ref).toLowerCase() === t.toLowerCase()) {
        ref = i.ref;
        return true;
      }
    });
    return { t: ref ? pubNome(ref) : t, ref: ref, q: q };
  }
  function renderPedidos() {
    var el = $('v-ped');
    if (!el || S.view !== 'ped') return;
    var n = { novo: 0, sep: 0, pronto: 0, ent: 0, canc: 0 };
    S.pedidos.forEach(function (p) {
      n[p.st]++;
    });
    var fl = [
        ['novo', 'Novos', n.novo, n.novo ? 'w' : ''],
        ['sep', 'Separando', n.sep, ''],
        ['pronto', 'Prontos', n.pronto, ''],
        ['ent', 'Entregues', n.ent, ''],
        ['canc', 'Cancelados', n.canc, '']
      ],
      h = '<div class="top"><div><h1>Pedidos</h1><div class="crumb">Pedidos do catálogo online para a loja</div></div></div>';
    h += '<div class="tgrid g5" role="group" aria-label="Situação dos pedidos">';
    fl.forEach(function (f) {
      h += tileHtml('data-act="pedf" data-id="' + f[0] + '"', 'ped', f[1], [String(f[2]), f[3]], 'sm', S.pedF === f[0]);
    });
    h += '</div>';
    var f = S.pedForm;
    if (f) {
      h +=
        '<section class="card"><b>Novo pedido</b><div class="col" style="gap:8px;margin-top:8px">' +
        '<input class="in" id="pCli" placeholder="Nome do cliente" value="' + esc(f.cli || '') + '" autocomplete="off">' +
        '<input class="in" id="pTel" type="tel" inputmode="tel" placeholder="Telefone / WhatsApp" value="' + esc(f.tel || '') + '">' +
        '<div class="lbl" style="margin:4px 0 0">Itens</div>';
      f.itens.forEach(function (l, i) {
        h += '<div class="sl" style="display:flex;justify-content:space-between;gap:8px;align-items:center"><span>' + l.q + '× ' + esc(l.t) + '</span><button type="button" class="chip" data-act="pedlrm" data-id="' + i + '">Tirar</button></div>';
      });
      var refs = {};
      S.items.forEach(function (i) {
        refs[i.ref] = 1;
      });
      h +=
        '<div style="display:flex;gap:8px"><input class="in" id="pRef" list="pRefs" placeholder="Modelo ou produto" style="flex:1 1 auto;min-width:0" value="' + esc(f.ref || '') + '" autocomplete="off">' +
        '<input class="in" id="pQtd" type="number" min="1" inputmode="numeric" style="width:70px" value="' + (f.q || 1) + '"></div>' +
        '<datalist id="pRefs">' +
        Object.keys(refs)
          .map(function (r) {
            return '<option value="' + esc(r) + '" label="' + esc(pubNome(r)) + '">';
          })
          .join('') +
        '</datalist>' +
        '<button type="button" class="chip" data-act="pedladd">+ Adicionar item</button>' +
        '<input class="in" id="pObs" placeholder="Observação (opcional)" value="' + esc(f.obs || '') + '">' +
        '<div class="hint" id="pH" style="margin:0"></div>' +
        '<div style="display:flex;gap:8px"><button type="button" class="go" data-act="pedsave">Salvar pedido</button><button type="button" class="chip" data-act="pedcancel">Cancelar</button></div>' +
        '</div></section>';
    } else {
      h += '<div class="sel"><button type="button" class="go" data-act="pednovo">+ Novo pedido</button></div>';
    }
    var lista = S.pedidos
      .filter(function (p) {
        return p.st === S.pedF;
      })
      .sort(function (a, b) {
        return b.ts - a.ts;
      });
    if (!lista.length)
      h += '<div class="hint">' + (S.pedidos.length ? 'Nenhum pedido nesta situação.' : 'Nenhum pedido ainda. Quando o catálogo online estiver ligado, os pedidos dele aparecem aqui sozinhos; por enquanto você pode lançar um com “Novo pedido”.') + '</div>';
    lista.forEach(function (p) {
      var tot = pedTotal(p),
        z = pedZap(p),
        pr = PED_ST.filter(function (s) {
          return s[0] === p.st;
        })[0];
      h +=
        '<section class="card"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:15px">Pedido ' + p.num + (p.cli ? ' · ' + esc(p.cli) : '') + '</b><span class="hint" style="margin:0">' + fd(p.ts) + ' ' + fh(p.ts) + '</span></div>' +
        '<div style="margin-top:6px">' +
        p.itens
          .map(function (l) {
            return '<div class="sl">' + l.q + '× ' + esc(l.t) + '</div>';
          })
          .join('') +
        '</div>' +
        (p.obs ? '<div class="hint" style="margin:6px 0 0">' + esc(p.obs) + '</div>' : '') +
        (tot ? '<div class="hint" style="margin:6px 0 0">Valor pela tabela: <b>' + gs(tot) + '</b></div>' : '') +
        '<div class="sel" style="flex-wrap:wrap;margin-top:8px">' +
        (pr && pr[2] ? '<button type="button" class="mini" data-act="pedav" data-id="' + p.id + '">' + pr[2] + '</button>' : '') +
        (z ? '<a class="chip" href="' + z + '" target="_blank" rel="noopener">WhatsApp</a>' : '') +
        (p.st !== 'canc' && p.st !== 'ent' ? '<button type="button" class="chip" data-act="pedcanc" data-id="' + p.id + '">Cancelar pedido</button>' : '') +
        (p.st === 'canc' || p.st === 'ent' ? '<button type="button" class="chip" data-act="peddel" data-id="' + p.id + '">' + (S._pedDel === String(p.id) ? 'Remover?' : 'Remover') + '</button>' : '') +
        '</div></section>';
    });
    el.innerHTML = h;
  }
  ACT.pedf = function (id) {
    S.pedF = id;
    render();
  };
  ACT.pedver = function () {
    S.pedF = 'novo';
    setView('ped');
  };
  ACT.pednovo = function () {
    S.pedForm = { cli: '', tel: '', obs: '', ref: '', q: 1, itens: [] };
    render();
  };
  ACT.pedcancel = function () {
    S.pedForm = null;
    render();
  };
  ACT.pedladd = function () {
    pedLer();
    var f = S.pedForm;
    if (!f || !String(f.ref).trim()) {
      $('pH').textContent = 'Escreva o modelo ou produto.';
      return;
    }
    f.itens.push(pedLinhaDe(f.ref, f.q));
    f.ref = '';
    f.q = 1;
    render();
  };
  ACT.pedlrm = function (id) {
    pedLer();
    S.pedForm.itens.splice(+id, 1);
    render();
  };
  ACT.pedsave = function () {
    pedLer();
    var f = S.pedForm;
    if (f && String(f.ref).trim()) {
      f.itens.push(pedLinhaDe(f.ref, f.q));
      f.ref = '';
    }
    if (!f || !f.itens.length) {
      $('pH').textContent = 'Coloque pelo menos um item.';
      return;
    }
    S.pedidos.push({ id: S.pedNext, num: S.pedNext, ts: Date.now(), cli: cap1(f.cli.trim()), tel: f.tel.trim(), obs: f.obs.trim(), itens: f.itens, st: 'novo', orig: 'manual' });
    S.pedNext++;
    S.pedForm = null;
    S.pedF = 'novo';
    render();
    window.scrollTo(0, 0);
  };
  function pedAch(id) {
    return S.pedidos.filter(function (p) {
      return String(p.id) === String(id);
    })[0];
  }
  ACT.pedav = function (id) {
    var p = pedAch(id);
    if (!p) return;
    p.st = p.st === 'novo' ? 'sep' : p.st === 'sep' ? 'pronto' : 'ent';
    S.pedF = p.st;
    render();
  };
  ACT.pedcanc = function (id) {
    var p = pedAch(id);
    if (!p) return;
    p.st = 'canc';
    S.pedF = 'canc';
    render();
  };
  ACT.peddel = function (id) {
    if (S._pedDel !== String(id)) {
      S._pedDel = String(id);
      render();
      setTimeout(function () {
        if (S._pedDel === String(id)) {
          S._pedDel = null;
          render();
        }
      }, 3500);
      return;
    }
    S._pedDel = null;
    S.pedidos = S.pedidos.filter(function (p) {
      return String(p.id) !== String(id);
    });
    render();
  };
  // ===== Aba Ajustes: faixas, meta, contas e backup dos dados. =====
  // Gera o texto do backup (dados + fotos em miniatura).
  var SEM_BACKUP = ['pinHash', 'pinSalt', 'bioOn', 'lockMin', 'lockSens'];
  function backupDados(semFotos) {
    var d = {};
    PERSIST.forEach(function (k) {
      if (SEM_BACKUP.indexOf(k) < 0) d[k] = S[k];
    });
    if (!semFotos) d.fotos = S.fotos;
    return JSON.stringify({ app: 'lafouch', v: 1, ts: Date.now(), d: d });
  }
  // Restaura os dados a partir do texto do backup. Devolve '' se deu certo, ou a mensagem de erro.
  function restaurarDados(txt) {
    var o;
    try {
      o = JSON.parse(txt);
    } catch (e) {
      return 'Arquivo inválido: não é um backup do app.';
    }
    if (!o || o.app !== 'lafouch' || !o.d || !Array.isArray(o.d.items))
      return 'Arquivo inválido: não é um backup do app.';
    PERSIST.forEach(function (k) {
      if (o.d[k] !== undefined && SEM_BACKUP.indexOf(k) < 0) S[k] = o.d[k];
    });
    if (o.d.fotos && typeof o.d.fotos === 'object') S.fotos = o.d.fotos;
    try {
      dedupeItems();
    } catch (e) {}
    syncTipos();
    render();
    return '';
  }
  // Guarda/compartilha o backup: no app usa o compartilhar do celular; no navegador baixa o arquivo.
  function exportarBackup() {
    var txt = backupDados(),
      d = new Date(),
      nome =
        'lafouch-backup-' +
        d.getFullYear() +
        '-' +
        ('0' + (d.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + d.getDate()).slice(-2) +
        '.json';
    function feito() {
      S.backupTs = Date.now();
      S.ajMsg = 'Backup gerado (' + Math.round(txt.length / 1024) + ' KB).';
      S.bkText = '';
      render();
    }
    salvarArquivo(nome, txt, 'application/json', feito, function () {
      S.bkText = txt;
      S.ajMsg = 'Copie o texto abaixo e guarde onde quiser.';
      render();
    });
  }
  // Lê um número digitado (aceita vírgula).
  function numIn(v) {
    var n = parseFloat(String(v).replace(',', '.'));
    return isNaN(n) ? 0 : n;
  }
  // Monta a aba Ajustes.
  function renderAjustes() {
    var el = $('v-ajustes');
    if (S.view !== 'ajustes') return;
    var ae = document.activeElement;
    if (!S._ajForce && ae && ae.tagName === 'INPUT' && el.contains(ae)) return;
    S._ajForce = false;
    var h =
      '<div class="top"><div><h1>Ajustes</h1><div class="crumb">Faixas, meta do mês, contas e backup</div></div></div>';
    if (S.ajMsg) h += '<div class="note n-ok" role="status">' + esc(S.ajMsg) + '</div>';
    // meta
    h +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Meta do mês</h2><div><div class="lbl">Lucro livre desejado no mês, loja toda (' + mpSim() + ')</div><input class="in" inputmode="decimal" data-aj="meta" value="' +
      usdParaCampo(S.metaUsd) +
      '" placeholder="Ex.: ' + usdParaCampo(600) + '" style="max-width:220px"></div></section>';
    // faixas
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Faixas</h2><div class="hint" style="margin:2px 0 0">Você cria e nomeia. A margem é o lucro mínimo desejado sobre o preço de venda e define o piso. O preço próprio da faixa é opcional (vazio = preço do tipo).</div></div>';
    S.faixas.forEach(function (f) {
      var n = Object.keys(S.pfaixa).filter(function (k) {
        return S.pfaixa[k] === f.id;
      }).length;
      h +=
        '<div class="card col" style="background:var(--panel2);gap:10px"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="dot" style="background:' +
        faixaCor(f) +
        '"></span><input class="in" data-aj="fnome" data-id="' +
        f.id +
        '" value="' +
        esc(f.nome) +
        '" aria-label="Nome da faixa" style="flex:1 1 140px"><span class="hint" style="margin:0">' +
        n +
        ' produto(s)</span></div><div><div class="lbl">Margem mínima (%)</div><input class="in" inputmode="decimal" data-aj="fmarg" data-id="' +
        f.id +
        '" value="' +
        f.margem +
        '" style="max-width:140px"></div><details><summary class="hint" style="cursor:pointer">Preço próprio por tipo (' + mpSim() + ')</summary><div class="col" style="gap:8px;margin-top:8px">';
      tipoAll().forEach(function (t) {
        if (!t.price) return;
        h +=
          '<div style="display:flex;gap:8px;align-items:center"><span style="flex:1 1 140px">' +
          esc(t.label) +
          '</span><input class="in" inputmode="' + mpMode() + '" data-aj="fprec" data-id="' +
          f.id +
          '" data-tipo="' +
          t.id +
          '" value="' +
          (f.precos && f.precos[t.id] ? gsParaCampo(f.precos[t.id]) : '') +
          '" placeholder="' +
          gsParaCampo(t.price) +
          '" style="max-width:150px"></div>';
      });
      h +=
        '</div></details><div><button class="chip" data-act="fdel" data-id="' +
        f.id +
        '">' +
        (S.fDelConf === f.id ? 'Confirmar: remover faixa' : 'Remover faixa') +
        '</button></div></div>';
    });
    h +=
      '<div style="display:flex;gap:8px"><input class="in" id="fnew" placeholder="Nome da nova faixa" style="flex:1" maxlength="30"><button class="chip on" data-act="fadd">+ Nova faixa</button></div></section>';
    // rateio das contas e tolerância da contagem
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Contas e contagem</h2><div class="hint" style="margin:2px 0 0">As contas do mês (' +
      gs(totalMensal()) +
      ', cerca de US$ ' +
      Math.round(totalMensal() / S.fx.pyg) +
      ') já são separadas de cada venda: o lucro livre e a meta são o que sobra depois delas.</div></div>' +
      '<div><div class="lbl">Peças por mês para ratear as contas</div><input class="in" inputmode="numeric" data-aj="vol" value="' +
      S.volume +
      '" style="max-width:160px"><div class="hint">Em uso agora: <b>' +
      volumeEfetivo() +
      '</b> ' +
      (volumeAuto() > 0 && S.volAuto !== false ? '(calculado pelas suas vendas reais)' : '(número manual)') +
      '.</div><div style="margin-top:8px"><button class="chip' +
      (S.volAuto !== false ? ' on' : '') +
      '" data-act="volauto">Calcular pelas vendas reais</button></div><div class="hint">Com 2 meses de vendas (pelo menos 20 peças), o app passa a usar a média real.</div></div>' +
      '<div><div class="lbl">Diferença de contagem tolerada (' + mpSim() + ')</div><input class="in" inputmode="decimal" data-aj="tol" value="' +
      usdParaCampo(S.tolUsd) +
      '" style="max-width:160px"><div class="hint">Na contagem de estoque, diferenças até esse valor ficam marcadas como perda aceita.</div></div></section>';
    // backup
    var dias = S.backupTs ? Math.floor((Date.now() - S.backupTs) / DAY) : -1;
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Backup dos dados</h2><div class="hint" style="margin:2px 0 0">Os dados ficam só neste celular. Guarde uma cópia de vez em quando (e antes de trocar de aparelho).</div></div><div class="hint" style="margin:0">' +
      (dias < 0 ? 'Nenhum backup feito ainda.' : 'Último backup: ' + (dias === 0 ? 'hoje' : 'há ' + dias + ' dia(s)') + '.') +
      '</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="chip on" data-act="bkexp">Exportar backup</button><button class="chip" data-act="bkimp">Importar backup</button></div>' +
      (S.bkText
        ? '<textarea class="in" readonly rows="5" style="width:100%;font-size:12px">' + esc(S.bkText) + '</textarea>'
        : '') +
      '</section>';
    h += ajustesFinHtml();
    el.innerHTML = h;
  }
  // Recalcula e salva uma alteração feita na aba Ajustes.
  $('v-ajustes').addEventListener('change', function (e) {
    var t = e.target,
      k = t.getAttribute && t.getAttribute('data-aj');
    if (!k) return;
    var id = t.getAttribute('data-id'),
      f = S.faixas.filter(function (x) {
        return x.id === id;
      })[0];
    S._ajForce = true;
    S.ajMsg = '';
    if (k === 'meta') S.metaUsd = campoParaUsd(t.value);
    if (k === 'fnome' && f && t.value.trim()) f.nome = t.value.trim();
    if (k === 'fmarg' && f) f.margem = Math.max(0, Math.min(90, numIn(t.value)));
    if (k === 'fprec' && f) {
      var pr = campoParaGs(t.value);
      f.precos = f.precos || {};
      if (pr > 0) f.precos[t.getAttribute('data-tipo')] = pr;
      else delete f.precos[t.getAttribute('data-tipo')];
    }
    if (k === 'vol') S.volume = Math.max(1, toNum(t.value) || S.volume);
    if (k === 'tol') S.tolUsd = campoParaUsd(t.value);
    render();
  });
  $('v-ajustes').addEventListener('input', function (e) {
    if (e.target.id === 'fnew') S.fnewTxt = e.target.value;
  });
  S.fDelConf = '';
  S.ajMsg = '';
  S.bkText = '';
  // Importar backup: abre o seletor de arquivo (confirma antes de substituir).
  var bkFile = document.createElement('input');
  bkFile.type = 'file';
  bkFile.accept = '.json,application/json,text/plain';
  bkFile.hidden = true;
  document.body.appendChild(bkFile);
  bkFile.onchange = function () {
    var f = bkFile.files && bkFile.files[0];
    bkFile.value = '';
    if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      var er = restaurarDados(String(r.result));
      S.ajMsg = er || 'Backup restaurado. Os dados atuais foram substituídos.';
      S._ajForce = true;
      render();
    };
    r.readAsText(f);
  };
  // Ações da aba Ajustes e das análises do Dashboard.
  ACT.fadd = function () {
    var n = String(S.fnewTxt || ($('fnew') && $('fnew').value) || '').trim();
    if (!n) return;
    S.faixas.push({ id: 'f' + Date.now().toString(36), nome: n, margem: 40, precos: {} });
    S.fnewTxt = '';
    S._ajForce = true;
    render();
  };
  ACT.fdel = function (id) {
    if (S.fDelConf !== id) {
      S.fDelConf = id;
      S._ajForce = true;
      render();
      return;
    }
    S.faixas = S.faixas.filter(function (f) {
      return f.id !== id;
    });
    Object.keys(S.pfaixa).forEach(function (k) {
      if (S.pfaixa[k] === id) delete S.pfaixa[k];
    });
    S.fDelConf = '';
    S._ajForce = true;
    render();
  };
  ACT.bkexp = exportarBackup;
  ACT.bkimp = function () {
    if ((S.sales.length || S.items.length) && !S.bkImpConf) {
      S.bkImpConf = true;
      S.ajMsg = 'Importar substitui os dados deste aparelho. Toque de novo em Importar backup para continuar.';
      S._ajForce = true;
      render();
      return;
    }
    S.bkImpConf = false;
    exigirAuth(function () {
      bkFile.click();
    });
  };
  ACT.volauto = function () {
    S.volAuto = S.volAuto === false;
    S._ajForce = true;
    render();
  };
  ACT.sugap = function (id) {
    var r = sugestoes().filter(function (x) {
      return x.faixa.id === id;
    })[0];
    if (r && r.para !== r.de) r.faixa.margem = r.para;
    render();
  };
  ACT.sugig = function (id) {
    var d = new Date();
    S.sugIgn[id] = d.getFullYear() + '-' + (d.getMonth() + 1);
    render();
  };
  ACT.saida = function (key) {
    var m = prodStats().filter(function (x) {
      return x.key === key;
    })[0];
    if (!m) return;
    var it = S.items.filter(function (i) {
      return i.tipo + '|' + i.ref === key && i.qty > 0;
    })[0];
    if (!it) return;
    var pp = pisoPeca(it);
    S.vTipo = 'all';
    S.vq = '';
    $('vq').value = '';
    S.vFaixa = '';
    S.vRef = key;
    S.vSel = it;
    S.detRow = null;
    S.detCor = '';
    S.qty = 1;
    S._descKey = [it.tipo, it.ref, it.cor, it.grau, it.vr].join('/');
    S.descMode = 'pyg';
    S.descTxt = String(Math.max(0, pp.lista - pp.saida));
    S.vMotivo = 'Liquidação';
    S.rec = null;
    setView('vendas');
  };
  // ===== Contagem de estoque (aba Estoque): por produto, do mais valioso ao menos, com resumo em dinheiro. =====
  // Custo em US$ de uma peça (própria, do lote ou do tipo).
  function custoUn(i) {
    var c = effCusto(i);
    return c != null ? c : (tipoOf(i.tipo) || {}).repUSD || 0;
  }
  // Produtos da contagem: peças do filtro atual agrupadas por produto, mais valiosos primeiro.
  function contagemGrupos() {
    var map = {},
      ord = [];
    (S._flAll || []).forEach(function (i) {
      if (i.bulk || !tipoOf(i.tipo)) return;
      var k = i.tipo + '|' + i.ref;
      if (!map[k]) {
        map[k] = { key: k, ref: i.ref, tipo: i.tipo, itens: [], usd: 0 };
        ord.push(k);
      }
      map[k].itens.push(i);
      map[k].usd += i.qty * custoUn(i);
    });
    return ord
      .map(function (k) {
        return map[k];
      })
      .sort(function (a, b) {
        return b.usd - a.usd;
      });
  }
  // Valor contado de uma peça (o digitado, ou o do app se não mexeu).
  function contado(i) {
    var v = S.contVals[S.items.indexOf(i)];
    return v == null ? i.qty : v;
  }
  // Diferenças da contagem em andamento, com valor em custo (US$) e em preço de venda (G$).
  function contagemDifs() {
    var out = [];
    contagemGrupos().forEach(function (g) {
      g.itens.forEach(function (i) {
        var d = contado(i) - i.qty;
        if (!d) return;
        out.push({
          item: i,
          key: g.key,
          dif: d,
          usd: d * custoUn(i),
          gs: d * (tFor(i).price || 0)
        });
      });
    });
    return out;
  }
  // Dias desde a última conferência do produto (null = nunca).
  function diasConf(key) {
    var t = S.conf && S.conf[key];
    return t ? Math.floor((Date.now() - t) / DAY) : null;
  }
  // Tela de contagem (substitui a lista enquanto está aberta).
  function renderContagem() {
    var c = $('contCard');
    c.hidden = !S.cont;
    $('kCont').setAttribute('aria-pressed', !!S.cont);
    $('kCont').style.outline = S.cont ? '2px solid var(--accent)' : '';
    if (!S.cont) return;
    $('listCard').hidden = true;
    $('detail').hidden = true;
    c.textContent = '';
    var gr = contagemGrupos(),
      difs = contagemDifs(),
      tocados = {};
    difs.forEach(function (d) {
      tocados[d.key] = 1;
    });
    Object.keys(S.contOk).forEach(function (k) {
      tocados[k] = 1;
    });
    var nConf = gr.filter(function (g) {
        return tocados[g.key];
      }).length,
      corte = Math.max(1, Math.ceil(gr.length * 0.2)),
      velhos = gr.slice(0, corte).filter(function (g) {
        var d = diasConf(g.key);
        return d == null || d > 10;
      }).length;
    var hd = mk('div', '');
    hd.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:8px';
    var h2 = mk('h2', '', 'Contagem de estoque');
    h2.style.cssText = 'margin:0;font-size:16px';
    hd.appendChild(h2);
    hd.appendChild(
      btn('tab', 'Fechar', function () {
        S.cont = false;
        S.contSum = false;
        render();
      })
    );
    c.appendChild(hd);
    var hi = mk(
      'div',
      'hint',
      'Conta só o que está no filtro atual (tipo, faixa, busca). Os mais valiosos vêm primeiro. O que você não tocar não muda. ' +
        nConf +
        ' de ' +
        gr.length +
        ' produtos conferidos.' +
        (velhos ? ' ' + velhos + ' dos mais valiosos estão sem conferir há mais de 10 dias.' : '')
    );
    hi.style.margin = '0';
    c.appendChild(hi);
    if (S.contSum) return resumoContagem(c, difs);
    if (!gr.length) c.appendChild(mk('div', 'note n-warn', 'Nenhuma peça com esses filtros.'));
    gr.forEach(function (g) {
      var box = mk('div', 'card col');
      box.style.cssText = 'background:var(--panel2);gap:8px;padding:12px';
      var top = mk('div', '');
      top.style.cssText = 'display:flex;justify-content:space-between;gap:8px;align-items:center';
      var nm = mk('b', '', pn(g.ref));
      top.appendChild(nm);
      var f = faixaOf(g.ref);
      if (f) top.appendChild(faixaTag(f));
      top.appendChild(mk('span', 'hint', usd(g.usd) + ' em custo'));
      top.lastChild.style.cssText = 'margin:0 0 0 auto';
      box.appendChild(top);
      var dc = diasConf(g.key);
      var sub = mk(
        'div',
        'hint',
        dc == null ? 'Nunca conferido' : dc === 0 ? 'Conferido hoje' : 'Conferido há ' + dc + ' dia(s)'
      );
      sub.style.margin = '0';
      box.appendChild(sub);
      g.itens.forEach(function (i) {
        var row = mk('div', 'pl');
        row.style.gridTemplateColumns = 'minmax(0,1fr) auto';
        var v = contado(i),
          lb = mk('span', '', rowLabel(i) + ' · no app: ' + i.qty + ' · ' + usd(custoUn(i)));
        row.appendChild(lb);
        var ctl = mk('div', 'sel');
        var set = function (n) {
          S.contVals[S.items.indexOf(i)] = Math.max(0, n);
          render();
        };
        ctl.appendChild(
          btn('step', '−', function () {
            set(contado(i) - 1);
          })
        );
        var inp = mk('input', 'in');
        inp.inputMode = 'numeric';
        inp.value = v;
        inp.style.cssText =
          'width:64px;min-height:44px;text-align:center;font-weight:800;' +
          (v !== i.qty ? 'border-color:var(--warn)' : '');
        inp.setAttribute('aria-label', 'Contado: ' + rowLabel(i));
        inp.onchange = function () {
          set(toNum(inp.value));
        };
        ctl.appendChild(inp);
        ctl.appendChild(
          btn('step', '+', function () {
            set(contado(i) + 1);
          })
        );
        row.appendChild(ctl);
        box.appendChild(row);
      });
      var okb = btn(
        'chip' + (S.contOk[g.key] ? ' on' : ''),
        S.contOk[g.key] ? 'Conferido ✓' : 'Está tudo certo',
        function () {
          if (S.contOk[g.key]) delete S.contOk[g.key];
          else S.contOk[g.key] = 1;
          render();
        },
        !!S.contOk[g.key]
      );
      okb.style.alignSelf = 'flex-start';
      box.appendChild(okb);
      c.appendChild(box);
    });
    var rv = btn('go', difs.length ? 'Revisar ' + difs.length + ' diferença(s)' : 'Concluir conferência', function () {
      S.contSum = true;
      render();
      window.scrollTo(0, 0);
    });
    rv.disabled = !nConf;
    c.appendChild(rv);
  }
  // Resumo antes de aplicar: o que mudou, em custo e em preço de venda.
  function resumoContagem(c, difs) {
    var tu = 0,
      tg = 0,
      aceitas = 0;
    var box = mk('div', 'split');
    difs.forEach(function (d) {
      var ac = Math.abs(d.usd) <= (S.tolUsd || 0);
      if (ac) aceitas++;
      tu += d.usd;
      tg += d.gs;
      var r = mk('div', 'sl');
      var l = mk('span', '', pn(d.item.ref) + ' · ' + rowLabel(d.item));
      l.appendChild(
        mk(
          'small',
          '',
          'app ' + d.item.qty + ' → contado ' + contado(d.item) + (ac ? ' · dentro da tolerância' : '')
        )
      );
      r.appendChild(l);
      r.appendChild(mk('b', '', (d.dif > 0 ? '+' : '') + d.dif + ' · ' + usd(d.usd)));
      box.appendChild(r);
    });
    if (!difs.length) c.appendChild(mk('div', 'note n-ok', 'Tudo confere com o estoque do app.'));
    else {
      c.appendChild(box);
      c.appendChild(
        mk(
          'div',
          'note ' + (tu < 0 ? 'n-bad' : 'n-info'),
          'Total: ' +
            (tu < 0 ? 'faltam ' : 'sobram ') +
            usd(Math.abs(tu)) +
            ' em custo e ' +
            gs(Math.abs(tg)) +
            ' a preço de venda.' +
            (aceitas ? ' ' + aceitas + ' diferença(s) dentro da tolerância.' : '')
        )
      );
    }
    var bar = mk('div', '');
    bar.style.cssText = 'display:flex;gap:8px';
    var ap = btn('go', 'Aplicar e corrigir o estoque', function () {
      aplicarContagem(difs, tu, tg);
    });
    ap.style.flex = '1';
    bar.appendChild(ap);
    bar.appendChild(
      btn('tab', 'Voltar', function () {
        S.contSum = false;
        render();
      })
    );
    c.appendChild(bar);
  }
  // Aplica as diferenças: corrige o estoque, grava a conferência e o registro de perdas e sobras.
  function aplicarContagem(difs, tu, tg) {
    var ts = Date.now(),
      conf = {};
    difs.forEach(function (d) {
      conf[d.key] = 1;
    });
    Object.keys(S.contOk).forEach(function (k) {
      conf[k] = 1;
    });
    difs.forEach(function (d) {
      var i = d.item;
      S.elog.push({
        ts: ts,
        tipo: i.tipo,
        ref: i.ref,
        cor: i.cor,
        grau: i.grau || '',
        qty: d.dif,
        contagem: true
      });
      i.qty = contado(i);
    });
    Object.keys(conf).forEach(function (k) {
      S.conf[k] = ts;
    });
    S.contagens.push({
      ts: ts,
      difs: difs.length,
      valorUsd: tu,
      vendaGs: tg,
      itens: difs.map(function (d) {
        return { ref: d.item.ref, cor: d.item.cor, dif: d.dif, usd: d.usd };
      })
    });
    S.cont = false;
    S.contSum = false;
    S.contVals = {};
    S.contOk = {};
    S.msg = difs.length
      ? 'Contagem aplicada: ' + difs.length + ' diferença(s), ' + usd(Math.abs(tu)) + (tu < 0 ? ' a menos.' : ' a mais.')
      : 'Conferência registrada: o estoque confere.';
    render();
  }
  S.cont = false;
  S.contSum = false;
  S.contVals = {};
  S.contOk = {};
  // Tocar no cartão "Em estoque" abre/fecha a contagem.
  $('kCont').onclick = function () {
    S.cont = !S.cont;
    S.contSum = false;
    S.contVals = {};
    S.contOk = {};
    if (S.cont) {
      S.lotesView = false;
      S.repo = false;
      S.open = '';
      S.det = false;
      S.selItem = null;
    }
    render();
    window.scrollTo(0, 0);
  };
  // ===== Histórico: resumo por mês, busca, filtros, calendário e carregamento aos poucos. =====
  S.hq = '';
  S.hF = { tipo: '', forma: '', faixa: '', moeda: '', vmin: '', vmax: '' };
  S.hFopen = false;
  S.hDias = 30;
  S.hLim = 30;
  var HTIPOS = [
    ['venda', 'Venda'],
    ['estorno', 'Estorno'],
    ['pago', 'Conta paga'],
    ['ret', 'Retirada'],
    ['imp', 'Imprevisto'],
    ['melh', 'Melhorias'],
    ['lote', 'Compra de lote'],
    ['descarte', 'Descarte'],
    ['confcx', 'Conferência'],
    ['outro', 'Câmbio / estoque']
  ];
  // Há busca ou filtro ligado?
  function hFiltrando() {
    var f = S.hF;
    return !!(S.hq.trim() || f.tipo || f.forma || f.faixa || f.moeda || f.vmin || f.vmax);
  }
  // Todos os movimentos como itens pesquisáveis.
  function hItens() {
    var out = [];
    S.sales.forEach(function (s) {
      var ms = (s.pags && s.pags.length ? s.pags.map(function (p) { return p.moeda; }) : [s.moeda || 'pyg']);
      out.push({
        ts: s.ts,
        tipo: s.estorno ? 'estorno' : 'venda',
        txt: (descOf(s) + ' ' + s.id + ' ' + (s.ref || '')).toLowerCase(),
        forma: s.forma || '',
        faixa: s.faixa || '',
        moedas: ms,
        valor: s.price || 0,
        html: saleCard(s)
      });
    });
    S.dlog.forEach(function (x) {
      var i = dlogInfo(x);
      out.push({
        ts: x.ts,
        tipo: x.kind === 'descarte' ? 'descarte' : x.kind,
        txt: i.search,
        forma: '',
        faixa: '',
        moedas: x.moeda ? [x.moeda] : [],
        valor: x.valor || 0,
        html: dlogCard(x)
      });
    });
    S.elog.forEach(function (x) {
      out.push({
        ts: x.ts,
        tipo: 'outro',
        txt: ('entrada de estoque ' + x.ref + ' ' + (x.cor || '')).toLowerCase(),
        forma: '',
        faixa: '',
        moedas: [],
        valor: 0,
        html: elogCard(x)
      });
    });
    S.cambios.forEach(function (x) {
      out.push({
        ts: x.ts,
        tipo: 'outro',
        txt: 'troca de moeda câmbio',
        forma: '',
        faixa: '',
        moedas: [x.de, x.para],
        valor: 0,
        html:
          '<div class="card" style="padding:14px"><span class="cell">Troca de moeda</span><div style="margin-top:6px">' +
          fmtM(x.dado, x.de) + ' → ' + fmtM(x.rec, x.para) +
          '</div><div class="hint" style="margin:2px 0 0">' + fd(x.ts) + ' às ' + fh(x.ts) + '</div></div>'
      });
    });
    return out.sort(function (a, b) { return b.ts - a.ts; });
  }
  // Aplica busca e filtros.
  function hFiltrar(itens) {
    var f = S.hF,
      q = S.hq.trim().toLowerCase(),
      vmin = campoParaGs(f.vmin),
      vmax = campoParaGs(f.vmax);
    return itens.filter(function (it) {
      if (q && it.txt.indexOf(q) < 0) return false;
      if (f.tipo && it.tipo !== f.tipo) return false;
      if (f.forma && it.forma !== f.forma) return false;
      if (f.faixa && it.faixa !== f.faixa) return false;
      if (f.moeda && it.moedas.indexOf(f.moeda) < 0) return false;
      if (vmin && it.valor < vmin) return false;
      if (vmax && it.valor > vmax) return false;
      return true;
    });
  }
  function hChip(grp, val, nome) {
    var on = S.hF[grp] === val;
    return '<button type="button" class="chip' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-act="hfil" data-id="' + grp + '|' + val + '">' + esc(nome) + '</button>';
  }
  // Painel de filtros.
  function hFiltrosHtml() {
    var f = S.hF;
    var h = '<section class="card col" style="gap:10px"><div class="lbl">Tipo de movimento</div><div class="nav">';
    HTIPOS.forEach(function (t) { h += hChip('tipo', t[0], t[1]); });
    h += '</div><div class="lbl">Forma de pagamento</div><div class="nav">';
    S.formas.forEach(function (x) { h += hChip('forma', x.id, x.nome); });
    h += '</div><div class="lbl">Faixa</div><div class="nav">';
    (S.faixas || []).forEach(function (x) { h += hChip('faixa', x.id, x.nome || x.id); });
    h += '</div><div class="lbl">Moeda</div><div class="nav">' + hChip('moeda', 'pyg', 'G$') + hChip('moeda', 'usd', 'US$') + hChip('moeda', 'brl', 'R$');
    h += '</div><div class="lbl">Valor em ' + mpSim() + '</div><div class="sel"><input class="in" inputmode="' + mpMode() + '" data-in="hvmin" placeholder="De" value="' + esc(f.vmin) + '" aria-label="Valor mínimo" style="flex:1"><input class="in" inputmode="numeric" data-in="hvmax" placeholder="Até" value="' + esc(f.vmax) + '" aria-label="Valor máximo" style="flex:1"></div>';
    return h + '<button type="button" class="chip" data-act="hlimpar">Limpar tudo</button></section>';
  }
  var MES_NOME = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  // Cartão de um dia.
  function hDiaCard(k, today) {
    var st = dayStats(k),
      d = new Date(dayEnd(k)),
      wd = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    return (
      '<button class="pcard" data-act="opendia" data-id="' + k + '" aria-label="Abrir o dia ' + fmtDay(k) + '" style="gap:10px;padding:14px">' +
      '<span style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><b style="font-size:18px">' + fmtDay(k).slice(0, 5) + (k === today ? ' · hoje' : '') +
      '</b><span class="hint" style="margin:0;text-transform:capitalize">' + wd + '</span></span>' +
      '<span style="font-size:22px;font-weight:800;font-variant-numeric:tabular-nums">' + gs(st.vend) + '</span>' +
      '<span class="pills"><span class="cell">' + st.n + ' venda(s)' + (st.est ? ' · ' + st.est + ' estornada(s)' : '') + '</span>' +
      (st.extra || st.nd ? '<span class="cell low">' + (st.extra ? 'gastos ' + gs(st.extra) : st.nd + ' despesa(s)') + '</span>' : '') +
      (st.outros ? '<span class="cell">' + st.outros + ' outro(s)</span>' : '') + '</span>' +
      '<span class="hint" style="margin:0">' + (st.fx ? 'Dólar G$ ' + dots(st.fx.p.pyg) : 'Sem cotação') + ' · lucro livre ' + gs(st.liv) + '</span></button>'
    );
  }
  // Lista (dias com resumo por mês, ou resultados da busca).
  function hListaHtml() {
    var today = dayKey(Date.now());
    if (hFiltrando()) {
      var r = hFiltrar(hItens()),
        n = Math.min(r.length, S.hLim);
      var h = '<div class="hint" style="margin:0">' + r.length + ' resultado(s)</div><div class="col">';
      for (var i = 0; i < n; i++) h += '<div>' + r[i].html + '</div>';
      h += '</div>';
      if (r.length > n) h += '<button type="button" class="mini" data-act="hmais">Mostrar mais (' + (r.length - n) + ')</button>';
      if (!r.length) h = '<div class="note">Nada encontrado com esses filtros.</div>';
      return h;
    }
    var act = activeDays();
    act[today] = act[today] || { v: 0, d: 0, o: 0 };
    var keys = Object.keys(act).sort().reverse(),
      corte = dayKey(Date.now() - S.hDias * DAY),
      vis = keys.filter(function (k) { return k >= corte; }),
      html = '',
      mes = '';
    vis.forEach(function (k) {
      var ym = k.slice(0, 7);
      if (ym !== mes) {
        if (mes) html += '</div>';
        mes = ym;
        var tv = 0, tn = 0, tl = 0;
        keys.forEach(function (j) {
          if (j.slice(0, 7) !== ym) return;
          var s = dayStats(j);
          tv += s.vend; tn += s.n; tl += s.liv;
        });
        html +=
          '<div class="lbl" style="margin:14px 0 6px">' + cap1(MES_NOME[+ym.slice(5) - 1]) + ' de ' + ym.slice(0, 4) +
          '</div><div class="hint" style="margin:0 0 8px">Mês todo: ' + gs(tv) + ' em ' + tn + ' venda(s) · lucro livre ' + gs(tl) +
          '</div><div class="list" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">';
      }
      html += hDiaCard(k, today);
    });
    if (mes) html += '</div>';
    var mais = keys.length - vis.length;
    if (mais > 0)
      html += '<button type="button" class="mini" data-act="hmais" style="margin-top:12px">Carregar mais 30 dias (' + mais + ' dia(s) com movimento)</button>';
    return html;
  }
  // Redesenha só a lista (mantém o campo de busca com o foco).
  function histLista() {
    var b = $('hRes');
    if (b) b.innerHTML = hListaHtml();
  }
  // Aba Histórico.
  function histRender() {
    var el = $('v-hist');
    if (!el) return;
    var ativo = hFiltrando();
    el.innerHTML =
      '<div class="top"><div><h1>Histórico</h1><div class="crumb">Busque, filtre ou toque num dia para abrir tudo o que aconteceu nele.</div></div></div>' +
      '<section class="card col" style="gap:10px"><div class="sel"><input class="in" id="hq" type="search" data-in="hq" placeholder="Buscar produto ou conta" value="' + esc(S.hq) + '" aria-label="Buscar no histórico" style="flex:1">' +
      '<button type="button" class="chip" data-act="hcal" aria-label="Ir para uma data" title="Ir para uma data" style="min-width:44px">📅</button>' +
      '<button type="button" class="chip' + (S.hFopen || ativo ? ' on' : '') + '" data-act="hfopen" aria-expanded="' + !!S.hFopen + '">Filtros</button></div>' +
      '<input type="date" class="in" id="hDate" data-in="hdate" max="' + dayKey(Date.now()) + '" aria-label="Ir para o dia" hidden></section>' +
      (S.hFopen ? '<div id="hFil">' + hFiltrosHtml() + '</div>' : '') +
      '<div id="hRes">' + hListaHtml() + '</div>';
  }
  document.addEventListener('input', function (ev) {
    var t = ev.target,
      k = t.getAttribute && t.getAttribute('data-in');
    if (k === 'hq' || k === 'hvmin' || k === 'hvmax') {
      if (k === 'hq') S.hq = t.value;
      else S.hF[k === 'hvmin' ? 'vmin' : 'vmax'] = t.value.replace(/[^\d.,]/g, '');
      S.hLim = 30;
      histLista();
    }
  });
  document.addEventListener('change', function (ev) {
    var t = ev.target;
    if (t.getAttribute && t.getAttribute('data-in') === 'hdate' && t.value) ACT.opendia(t.value);
  });
  ACT.hfopen = function () {
    S.hFopen = !S.hFopen;
    histRender();
  };
  ACT.hfil = function (id) {
    var p = id.split('|');
    S.hF[p[0]] = S.hF[p[0]] === p[1] ? '' : p[1];
    S.hLim = 30;
    histRender();
  };
  ACT.hlimpar = function () {
    S.hq = '';
    S.hF = { tipo: '', forma: '', faixa: '', moeda: '', vmin: '', vmax: '' };
    S.hLim = 30;
    histRender();
  };
  ACT.hmais = function () {
    if (hFiltrando()) S.hLim += 30;
    else S.hDias += 30;
    histLista();
  };
  ACT.hcal = function () {
    var d = $('hDate');
    if (!d) return;
    d.hidden = false;
    if (d.showPicker) {
      try {
        d.showPicker();
        return;
      } catch (e) {}
    }
    d.focus();
  };
  // ===== Animações dos botões: ondinha, realce deslizante, cascata, contagem, ✓, segurar para apagar, sino e arrastar. =====
  (function () {
    function q(s, r) {
      return (r || document).querySelector(s);
    }
    // 1. Ondinha ao tocar nos botões.
    document.addEventListener(
      'pointerdown',
      function (e) {
        if (REDUCED) return;
        var t = e.target.closest && e.target.closest('.tl,.mn,.go,.mini,.chip,.tab');
        if (!t || t.disabled || t.closest('.twrap')) return;
        var r = t.getBoundingClientRect(),
          d = Math.max(r.width, r.height) * 1.6,
          s = document.createElement('span'),
          cl = getComputedStyle(t).position === 'static' ? 'ripc' : 'ripo';
        s.className = 'rip';
        s.setAttribute('aria-hidden', 'true');
        s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
        t.classList.add(cl);
        t.appendChild(s);
        setTimeout(function () {
          s.remove();
          if (!t.querySelector('.rip')) t.classList.remove(cl);
        }, 650);
      },
      true
    );
    // 2 e 3. Realce que desliza entre os botões (Dashboard e barra de baixo) + pulinho do ícone ao trocar.
    var POS = {};
    function desliza(cont, key, onSel, ic) {
      if (!cont) return;
      var on = q(onSel, cont),
        sl = q('.slider', cont);
      if (!on) {
        if (sl) sl.style.opacity = 0;
        cont.classList.remove('sl-ok');
        return;
      }
      var c = cont.getBoundingClientRect(),
        r = on.getBoundingClientRect();
      if (!r.width || !c.width) return;
      if (getComputedStyle(cont).position === 'static') cont.style.position = 'relative';
      if (!sl) {
        sl = document.createElement('div');
        sl.className = 'slider';
        sl.setAttribute('aria-hidden', 'true');
        cont.insertBefore(sl, cont.firstChild);
      }
      var to = { x: r.left - c.left, y: r.top - c.top },
        de = POS[key] || to,
        mudou = !!POS[key] && (de.x !== to.x || de.y !== to.y);
      sl.style.transition = 'none';
      sl.style.opacity = 1;
      sl.style.width = r.width + 'px';
      sl.style.height = r.height + 'px';
      sl.style.transform = 'translate(' + de.x + 'px,' + de.y + 'px)';
      void sl.offsetWidth;
      sl.style.transition = REDUCED ? 'none' : 'transform .38s cubic-bezier(.2,.8,.2,1)';
      sl.style.transform = 'translate(' + to.x + 'px,' + to.y + 'px)';
      cont.classList.add('sl-ok');
      POS[key] = to;
      var i = on.querySelector('.ti,.mi');
      if (i && mudou && !REDUCED) {
        i.style.animation = 'none';
        void i.offsetWidth;
        i.style.animation = (ic || 'pulinho') + ' .45s cubic-bezier(.2,.8,.2,1)';
      }
    }
    var agenda = 0;
    function desliza_tudo() {
      agenda = 0;
      var gs = document.querySelectorAll('#v-dash .tgrid');
      for (var i = 0; i < gs.length; i++) desliza(gs[i], 'dash' + i, '.tl.on', 'pulinho');
      desliza($('mainnav'), 'nav', '.mn.on', 'pulinhoN');
    }
    function pede() {
      if (!agenda) agenda = requestAnimationFrame(desliza_tudo);
    }
    if (window.MutationObserver) {
      var mo = new MutationObserver(pede);
      mo.observe($('mainnav'), { childList: true });
      mo.observe($('v-dash'), { childList: true, subtree: true });
    }
    window.addEventListener('resize', function () {
      POS = {};
      pede();
    });
    // 4 e 7. Início: botões entram em cascata e os números contam subindo.
    function contaNumeros(el) {
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT),
        n,
        l = [];
      while ((n = w.nextNode())) if (/\d/.test(n.nodeValue)) l.push(n);
      l.forEach(function (node) {
        var orig = node.nodeValue,
          t0 = performance.now();
        function passo(t) {
          var k = Math.min(1, (t - t0) / 900),
            e = 1 - Math.pow(1 - k, 3);
          node.nodeValue =
            k < 1
              ? orig.replace(/\d[\d.]*/g, function (m) {
                  return Math.round(parseInt(m.replace(/\./g, ''), 10) * e).toLocaleString('pt-BR');
                })
              : orig;
          if (k < 1) requestAnimationFrame(passo);
        }
        requestAnimationFrame(passo);
      });
    }
    window.animInicio = function () {
      var v = $('v-inicio');
      if (REDUCED || !v || S.inicioEd) return;
      v.classList.remove('cascata');
      void v.offsetWidth;
      v.querySelectorAll('.tl').forEach(function (t, i) {
        t.style.animationDelay = i * 55 + 'ms';
      });
      v.classList.add('cascata');
      contaNumeros(v);
      setTimeout(function () {
        v.classList.remove('cascata');
        v.querySelectorAll('.tl').forEach(function (t) {
          t.style.animationDelay = '';
        });
      }, 1300);
    };
    // 5. Botão de registrar mostra ✓ quando deu certo.
    var antes = 0;
    function total() {
      return (S.imprev ? S.imprev.length : 0) + (S.exp ? S.exp.length : 0);
    }
    document.addEventListener(
      'click',
      function (e) {
        var b = e.target.closest && e.target.closest('[data-act=impadd],[data-act=expadd]');
        if (!b) return;
        antes = total();
        var act = b.getAttribute('data-act');
        setTimeout(function () {
          if (total() <= antes || REDUCED) return;
          var n = q('[data-act=' + act + ']');
          if (!n) return;
          var tx = n.textContent;
          n.classList.add('okflash');
          n.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg> Registrado';
          vibrar(15);
          setTimeout(function () {
            n.classList.remove('okflash');
            n.textContent = tx;
          }, 1300);
        }, 40);
      },
      false
    );
    // 6. Segurar o ✕ de um imprevisto apaga (o toque simples continua pedindo confirmação).
    var hold = null,
      seguro = false;
    document.addEventListener(
      'pointerdown',
      function (e) {
        var b = e.target.closest && e.target.closest('[data-act=impdel]');
        if (!b || REDUCED) return;
        var id = b.getAttribute('data-id');
        b.classList.add('segura');
        hold = {
          b: b,
          x: e.clientX,
          y: e.clientY,
          t: setTimeout(function () {
            seguro = true;
            vibrar(30);
            hold = null;
            S._impDel = id;
            ACT.impdel(id);
            setTimeout(function () {
              seguro = false;
            }, 500);
          }, 900)
        };
      },
      true
    );
    function solta() {
      if (!hold) return;
      clearTimeout(hold.t);
      hold.b.classList.remove('segura');
      hold = null;
    }
    document.addEventListener('pointerup', solta, true);
    document.addEventListener('pointercancel', solta, true);
    document.addEventListener(
      'pointermove',
      function (e) {
        if (hold && Math.abs(e.clientX - hold.x) + Math.abs(e.clientY - hold.y) > 12) solta();
      },
      true
    );
    document.addEventListener(
      'click',
      function (e) {
        if (seguro && e.target.closest) {
          e.stopPropagation();
          e.preventDefault();
        }
      },
      true
    );
    // 8. Sino balança (de leve) quando chega aviso novo.
    var nAnt = null;
    if (window.MutationObserver && $('sino'))
      new MutationObserver(function () {
        var s = $('sino'),
          n = notifContagem();
        if (nAnt != null && n > nAnt && !REDUCED) {
          s.classList.remove('toca');
          void s.offsetWidth;
          s.classList.add('toca');
        }
        nAnt = n;
      }).observe($('sino'), { childList: true });
    // 9. Arrastar para reordenar os botões do Início (segurar um instante no celular).
    var dr = null;
    function rects() {
      var o = {};
      document.querySelectorAll('#v-inicio .twrap').forEach(function (w) {
        o[w.getAttribute('data-k')] = w.getBoundingClientRect();
      });
      return o;
    }
    function tw(id) {
      var l = document.querySelectorAll('#v-inicio .twrap');
      for (var i = 0; i < l.length; i++) if (l[i].getAttribute('data-k') === id) return l[i];
      return null;
    }
    document.addEventListener(
      'pointerdown',
      function (e) {
        if (!S.inicioEd) return;
        var w = e.target.closest && e.target.closest('.twrap');
        if (!w || e.target.closest('.tedit')) return;
        var r = w.getBoundingClientRect();
        dr = {
          id: w.getAttribute('data-k'),
          x0: e.clientX,
          y0: e.clientY,
          dx: e.clientX,
          dy: e.clientY,
          cx: r.left + r.width / 2,
          cy: r.top + r.height / 2,
          on: false
        };
        dr.t = setTimeout(
          function () {
            if (!dr) return;
            dr.on = true;
            document.body.classList.add('arrastando');
            var el = tw(dr.id);
            if (el) el.classList.add('arr');
            vibrar(15);
          },
          e.pointerType === 'mouse' ? 0 : 220
        );
      },
      true
    );
    document.addEventListener(
      'touchmove',
      function (e) {
        if (dr && dr.on && e.cancelable) e.preventDefault();
      },
      { passive: false }
    );
    document.addEventListener(
      'pointermove',
      function (e) {
        if (!dr) return;
        if (!dr.on) {
          if (Math.abs(e.clientX - dr.x0) + Math.abs(e.clientY - dr.y0) > 8) {
            clearTimeout(dr.t);
            if (e.pointerType === 'mouse') {
              dr.on = true;
              document.body.classList.add('arrastando');
              if (tw(dr.id)) tw(dr.id).classList.add('arr');
            } else dr = null;
          }
          if (!dr || !dr.on) return;
        }
        var el = tw(dr.id);
        if (!el) return;
        el.style.transform = 'translate(' + (e.clientX - dr.dx) + 'px,' + (e.clientY - dr.dy) + 'px) scale(1.08)';
        var alvo = null;
        document.querySelectorAll('#v-inicio .twrap').forEach(function (w) {
          if (w === el) return;
          var r = w.getBoundingClientRect();
          if (e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom) alvo = w.getAttribute('data-k');
        });
        if (!alvo) return;
        var l = iniLista(),
          i = l.indexOf(dr.id),
          j = l.indexOf(alvo),
          ant = rects();
        if (i < 0 || j < 0) return;
        l.splice(i, 1);
        l.splice(j, 0, dr.id);
        S.inicioT = l;
        render();
        document.querySelectorAll('#v-inicio .twrap').forEach(function (w2) {
          var k = w2.getAttribute('data-k'),
            r2 = w2.getBoundingClientRect(),
            a = ant[k];
          if (k === dr.id) {
            dr.cx = r2.left + r2.width / 2;
            dr.cy = r2.top + r2.height / 2;
            dr.dx = e.clientX;
            dr.dy = e.clientY;
            w2.classList.add('arr');
            w2.style.transform = 'scale(1.08)';
            return;
          }
          if (!a) return;
          w2.style.transition = 'none';
          w2.style.transform = 'translate(' + (a.left - r2.left) + 'px,' + (a.top - r2.top) + 'px)';
          void w2.offsetWidth;
          w2.style.transition = 'transform .3s cubic-bezier(.2,.8,.2,1)';
          w2.style.transform = '';
        });
      },
      true
    );
    function fimArrasta() {
      if (!dr) return;
      clearTimeout(dr.t);
      var id = dr.id;
      dr = null;
      document.body.classList.remove('arrastando');
      var el = tw(id);
      if (el) {
        el.style.transition = 'transform .25s cubic-bezier(.2,.8,.2,1)';
        el.style.transform = '';
        setTimeout(function () {
          el.classList.remove('arr');
          el.style.transition = '';
        }, 260);
      }
    }
    document.addEventListener('pointerup', fimArrasta, true);
    document.addEventListener('pointercancel', fimArrasta, true);
  })();
  // ===== Carrinho: várias peças numa venda só; o piso vale para o total, não para cada peça. =====
  S.cart = [];
  S.cartOpen = false;
  var cartSeq = 0;

  // Preço combinado de uma linha (padrão: tabela × quantidade).
  function cartLinhaPreco(l) {
    return l.preco != null ? l.preco : tFor(l.it).price * l.qty;
  }
  function cartSub() {
    return S.cart.reduce(function (a, l) {
      return a + cartLinhaPreco(l);
    }, 0);
  }
  function cartPecas() {
    return S.cart.reduce(function (a, l) {
      return a + l.qty;
    }, 0);
  }
  function cartDesc(l) {
    return l.qty + '× ' + l.it.ref + ' ' + (l.it.tipo === 'pre' ? l.it.grau : l.it.vr || '') + ' · ' + l.it.cor;
  }
  // Tira linhas sem estoque e ajusta quantidades que passaram do disponível.
  function cartLimpa() {
    S.cart = S.cart.filter(function (l) {
      if (l.it.qty <= 0) return false;
      l.qty = Math.min(l.qty, l.it.qty);
      return true;
    });
    if (!S.cart.length) S.cartOpen = false;
  }
  // Prévia do carrinho: piso, trava e lucro livre sobre o total.
  function cartPrevia() {
    var pt = pagTotais(),
      eff = pt.liq,
      br = S.vBrinde && S.vBrinde.qty > 0 ? S.vBrinde : null,
      bu = br ? brindeUsd(br) : 0,
      bg = Math.round(bu * S.fx.pyg),
      fm = formaSel(),
      tx = taxaGs(pt.rec, fm),
      sub = cartSub(),
      livre = 0,
      piso = 0,
      trava = 0,
      cp = contasPeca(),
      pct = colchao().pct;
    S.cart.forEach(function (l, i) {
      var w = sub > 0 ? cartLinhaPreco(l) / sub : 1 / S.cart.length,
        pp = pisoPeca(l.it);
      livre += calcSale(tFor(l.it), l.qty, S.fx.pyg, pct, cp, S.melhPeca, Math.round(eff * w), i === 0 ? bu : 0).livre;
      piso += pp.piso * l.qty;
      trava += pp.trava * l.qty;
    });
    livre -= tx;
    var liq = eff - tx;
    return {
      eff: eff,
      liq: liq,
      tx: tx,
      fm: fm,
      c: { livre: livre },
      br: br,
      bu: bu,
      pp: null,
      travaTot: trava + bg,
      pisoTot: piso + bg,
      perde: liq < trava + bg,
      abaixo: liq < piso + bg,
      key: ['cart', cartPecas(), eff, S.moeda, fm.id, br ? br.ref + br.cor : ''].join('|')
    };
  }
  // Painel do carrinho + faixa "Carrinho" na lista; liga a tela de pagamento ao total.
  function carrinhoRender() {
    var bar = $('cartBar'),
      card = $('cartCard');
    if (!bar) {
      var ref = $('vListCard');
      bar = mk('section', 'card');
      bar.id = 'cartBar';
      bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between';
      card = mk('section', 'card col');
      card.id = 'cartCard';
      card.setAttribute('aria-label', 'Carrinho');
      ref.parentNode.insertBefore(card, ref);
      ref.parentNode.insertBefore(bar, card);
    }
    cartLimpa();
    var emVendas = S.view === 'vendas';
    bar.hidden = !(emVendas && S.cart.length && !S.cartOpen);
    card.hidden = !(emVendas && S.cartOpen);
    if (!bar.hidden)
      bar.innerHTML =
        '<div style="display:flex;gap:4px;flex:0 0 auto">' + S.cart.slice(0, 4).map(function (l) { return cartFoto(l, 40); }).join('') + '</div><div style="flex:1 1 140px"><b>Carrinho: ' + cartPecas() + ' peça(s)</b><div class="hint" style="margin:2px 0 0">' + gs(cartSub()) + ' pela tabela dos preços combinados</div></div>' +
        '<button type="button" class="mini" data-act="cartopen">Abrir carrinho</button>';
    $('sCartAdd').hidden = S.cartOpen || !S._vsel;
    // venda de uma peça só escolhe e adiciona; pagamento e finalização ficam no carrinho
    $('descB').hidden = !S.cartOpen;
    $('payB').hidden = !S.cartOpen;
    $('sgo').hidden = !S.cartOpen;
    $('qtyB').hidden = !!S.cartOpen;
    if (!S.cartOpen || !emVendas) return;
    // modo carrinho: usa a tela de pagamento da venda com o total do carrinho
    $('vListCard').hidden = true;
    $('vDetail').hidden = true;
    $('vSaleCard').hidden = false;
    $('catV').hidden = true;
    $('spc').textContent = 'Carrinho com ' + S.cart.length + ' produto(s)';
    $('sst').textContent = '';
    $('sst').className = '';
    $('sumB').hidden = false;
    if (!card.contains(document.activeElement) || !document.activeElement.matches('input')) cartPainel(card);
    carrinhoSync();
  }
  // Miniatura da peça (foto do catálogo), ou um quadrado vazio se ainda não tem foto.
  function cartFoto(l, px) {
    var src = S.fotos[l.it.ref + '|' + l.it.cor],
      st = 'width:' + px + 'px;height:' + px + 'px;flex:0 0 ' + px + 'px;border-radius:10px;background:#fff;object-fit:contain;border:1px solid var(--line)';
    return src
      ? '<img src="' + src + '" alt="" style="' + st + '">'
      : '<span aria-hidden="true" style="' + st + ';display:inline-flex;align-items:center;justify-content:center;background:var(--panel2);color:var(--mute)"><svg width="' + Math.round(px * 0.6) + '" height="' + Math.round(px * 0.6) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.5" cy="14" r="3.5"/><circle cx="17.5" cy="14" r="3.5"/><path d="M10 14c.7-.8 3.3-.8 4 0M3 14l1-5M21 14l-1-5"/></svg></span>';
  }
  function cartPainel(card) {
    var h =
      '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><h2 style="margin:0;font-size:18px">Carrinho</h2><button type="button" class="chip" data-act="cartclose">+ Continuar escolhendo</button></div>' +
      '<div class="hint" style="margin:0">O piso é conferido sobre o total. Você pode mudar o preço de uma peça (desconto maior numa, menos em outra) e o app confere se o total ainda cobre tudo.</div><div class="split">';
    S.cart.forEach(function (l, i) {
      var pp = pisoPeca(l.it),
        tab = tFor(l.it).price * l.qty,
        v = cartLinhaPreco(l);
      h +=
        '<div class="sl" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">' + cartFoto(l, 56) + '<span style="flex:1 1 140px">' + esc(cartDesc(l)) +
        '<small>Tabela ' + gs(tab) + ' · piso ' + gs(pp.piso * l.qty) + '</small></span>' +
        '<span style="display:flex;gap:6px;align-items:center"><button type="button" class="step" style="min-height:36px;width:36px" data-act="cartmn" data-id="' + i + '" aria-label="Menos uma peça">−</button>' +
        '<button type="button" class="step" style="min-height:36px;width:36px" data-act="cartpl" data-id="' + i + '" aria-label="Mais uma peça">+</button></span>' +
        '<input class="in" inputmode="' + mpMode() + '" data-in="cartpreco" data-id="' + i + '" value="' + gsParaCampo(v) + '" aria-label="Preço combinado de ' + esc(cartDesc(l)) + ' em ' + mpSim() + '" style="flex:0 1 130px;width:130px">' +
        '<button type="button" class="chip" style="flex:0 0 40px;width:40px;padding:0;justify-content:center" data-act="cartrm" data-id="' + i + '" aria-label="Tirar do carrinho">×</button></div>';
    });
    h += '</div><div class="sum"><span class="hint" style="margin:0">Soma dos preços combinados</span><b id="cartSub">' + gs(cartSub()) + '</b></div>' +
      '<div><button type="button" class="chip" data-act="cartclear">Esvaziar carrinho</button></div>';
    card.innerHTML = h;
  }
  // Recalcula total, desconto, pagamento e aviso de piso (sem refazer o painel).
  function carrinhoSync() {
    var sub = cartSub();
    S.qty = 1;
    S._vsel = null;
    S._selKey = 'cart';
    S._t = { price: sub, id: 'cart:' + sub + ':' + S.cart.length };
    S.descGs = descontoGs(sub);
    var cs = $('cartSub');
    if (cs) cs.textContent = gs(sub);
    $('unit').textContent = 'Carrinho · ' + cartPecas() + ' peça(s)';
    $('tot').textContent = gs(sub - S.descGs);
    renderDescBrinde(null);
    renderMoeda();
    renderPiso();
    $('sgo').disabled = !S.cart.length;
  }
  // Reparte um valor em frações (soma exata; a última linha leva o resto).
  function cartParte(v, fr, dec) {
    var f = dec ? 100 : 1,
      out = [],
      acc = 0;
    fr.forEach(function (x, i) {
      var p = i === fr.length - 1 ? Math.round(v * f) / f - acc : Math.round(v * x * f) / f;
      p = Math.round(p * f) / f;
      acc += p;
      out.push(p);
    });
    return out;
  }
  function cartFinalizar() {
    cartLimpa();
    if (!S.cart.length) return;
    if (!(pagTotais().rec > 0)) {
      say('Informe o valor recebido.');
      render();
      return;
    }
    var pv = cartPrevia();
    if (pv.abaixo && S.pisoConf !== pv.key) {
      S.pisoConf = pv.key;
      renderPiso();
      return;
    }
    var sub = cartSub(),
      fr = S.cart.map(function (l) {
        return sub > 0 ? cartLinhaPreco(l) / sub : 1 / S.cart.length;
      }),
      pg = pagPayload(),
      m = S.moeda,
      dec = function (mm) {
        return mm !== 'pyg';
      },
      recs = cartParte(S._recv, fr, dec(m)),
      exs = (pg.extra || []).map(function (x) {
        return cartParte(x.v, fr, dec(x.moeda));
      }),
      trs = (pg.troco || []).map(function (x) {
        return cartParte(x.v, fr, dec(x.moeda));
      }),
      br = pv.br,
      cartId = 'C-' + Date.now() + '-' + ++cartSeq,
      vendas = [];
    if (br) br.qty -= 1;
    S.cart.forEach(function (l, i) {
      var it = l.it;
      it.qty -= l.qty;
      var sg =
        it.lote &&
        S.grp.filter(function (x) {
          return x.id === it.lote;
        })[0];
      if (sg) {
        sg.sold = (sg.sold || 0) + l.qty;
        if (it.custo != null && !it.bulk) {
          sg.ownQ = (sg.ownQ || 0) + l.qty;
          sg.ownC = (sg.ownC || 0) + l.qty * it.custo;
        }
      }
      var s = addSale(it, l.qty, {
        moeda: m,
        forma: S.forma,
        recebido: recs[i],
        pag: {
          rate: pg.rate,
          extra: (pg.extra || []).map(function (x, j) {
            return { moeda: x.moeda, v: exs[j][i], rate: x.rate };
          }).filter(function (x) {
            return x.v > 0;
          }),
          troco: (pg.troco || []).map(function (x, j) {
            return { moeda: x.moeda, v: trs[j][i], rate: x.rate };
          }).filter(function (x) {
            return x.v > 0;
          })
        },
        brinde:
          i === 0 && br
            ? { tipo: br.tipo, ref: br.ref, cor: br.cor, grau: br.grau || '', vr: br.vr || '', lote: br.lote || '', usd: pv.bu }
            : null,
        motivo: pv.abaixo ? S.vMotivo || '' : ''
      });
      s.carrinho = cartId;
      s.abaixo = pv.abaixo;
      s.perde = pv.perde;
      vendas.push(s);
    });
    // resumo único para a tela "para onde foi o dinheiro"
    var agg = { id: vendas.map(function (s) { return s.id; }).join(', '), moeda: m, recebido: S._recv, pct: vendas[0].pct, qty: 0 };
    ['price', 'rep', 'repUSD', 'contas', 'colch', 'melh', 'taxa', 'livre', 'trava'].forEach(function (k) {
      agg[k] = vendas.reduce(function (a, s) {
        return a + (s[k] || 0);
      }, 0);
    });
    vendas.forEach(function (s) {
      agg.qty += s.qty;
    });
    agg.ref = 'Carrinho';
    agg.cor = '';
    agg.tipo = 'x';
    agg.vr = '';
    var n = S.cart.length;
    S.cart = [];
    S.cartOpen = false;
    S.pisoConf = '';
    S.forma = 'din';
    pagReset();
    S.descTxt = '';
    S.vBrinde = null;
    S.vMotivo = '';
    S.rec = null;
    say('Venda registrada: carrinho com ' + n + ' produto(s)');
    render();
    showSplit(agg);
    $('splitH').textContent = 'Carrinho com ' + n + ' produto(s), ' + agg.qty + ' peça(s), por ' + gs(agg.price) + ' (vendas ' + agg.id + ')';
    $('splitNote').textContent =
      'Preço mínimo seguro (trava) do carrinho: ' + gs(agg.trava) + '. Vendido por ' + gs(agg.price) + ', ' + (agg.livre >= 0 ? 'então o preço está seguro.' : 'abaixo do seguro. Veja a aba Dashboard.') + ' Cada peça foi gravada no Histórico.';
  }
  // Botão "Adicionar ao carrinho".
  $('sCartAdd').onclick = function () {
    var sel = S._vsel;
    if (!sel || sel.qty <= 0) return;
    var q = Math.min(S.qty, sel.qty),
      ex = S.cart.filter(function (l) {
        return l.it === sel;
      })[0];
    if (ex) {
      var nq = Math.min(sel.qty, ex.qty + q);
      if (ex.preco != null) ex.preco = Math.round((ex.preco * nq) / ex.qty);
      ex.qty = nq;
    } else
      S.cart.push({ it: sel, qty: q, preco: null });
    S.vRef = '';
    S.vSel = null;
    S.qty = 1;
    S.rec = null;
    S.msg = 'Adicionado ao carrinho.';
    render();
    window.scrollTo(0, 0);
    setTimeout(function () {
      pulsa($('cartBar'));
    }, 60);
  };
  document.addEventListener('input', function (ev) {
    var t = ev.target;
    if (!t.getAttribute || t.getAttribute('data-in') !== 'cartpreco') return;
    var l = S.cart[+t.getAttribute('data-id')];
    if (!l) return;
    l.preco = campoParaGs(t.value);
    S.rec = null;
    carrinhoSync();
  });
  ACT.cartopen = function () {
    S.cartOpen = true;
    S.rec = null;
    render();
    window.scrollTo(0, 0);
  };
  ACT.cartclose = function () {
    S.cartOpen = false;
    render();
  };
  ACT.cartclear = function () {
    S.cart = [];
    S.cartOpen = false;
    render();
  };
  ACT.cartrm = function (id) {
    S.cart.splice(+id, 1);
    S.rec = null;
    render();
  };
  ACT.cartmn = function (id) {
    var l = S.cart[+id];
    if (!l) return;
    if (l.qty > 1) {
      if (l.preco != null) l.preco = Math.round((l.preco * (l.qty - 1)) / l.qty);
      l.qty--;
    }
    S.rec = null;
    render();
  };
  ACT.cartpl = function (id) {
    var l = S.cart[+id];
    if (!l || l.qty >= l.it.qty) return;
    if (l.preco != null) l.preco = Math.round((l.preco * (l.qty + 1)) / l.qty);
    l.qty++;
    S.rec = null;
    render();
  };
  // ===== Ações e eventos da parte financeira (contas, fluxo, retirada, conferência, taxas). =====
  // Dia de vencimento de uma despesa.
  document.addEventListener('change', function (ev) {
    var t = ev.target,
      id = t.getAttribute && t.getAttribute('data-exd');
    if (!id) return;
    var e = S.exp.filter(function (x) {
      return String(x.id) === id;
    })[0];
    if (!e) return;
    var d = Math.round(toNum(t.value)) || 0;
    if (d < 0 || d > 31) d = 0;
    if (d) e.dia = d;
    else delete e.dia;
    renderDesp();
    renderDash();
    saveSoon();
  });

  // Campos de contagem do caixa guardam o que foi digitado (a tela pode ser redesenhada).
  document.addEventListener('input', function (ev) {
    var t = ev.target;
    if (t.id && /^cc[PUB]$/.test(t.id)) {
      S.ccV = S.ccV || {};
      S.ccV[t.id] = t.value;
    }
  });
  // Ajustes novos: taxas, lembrete, bloqueio e biometria.
  document.addEventListener('change', function (ev) {
    var t = ev.target,
      k = t.getAttribute && t.getAttribute('data-aj');
    if (!k) return;
    var id = t.getAttribute('data-id');
    if (k === 'ptaxa') {
      var f = formaPorId(id);
      f.taxa = Math.max(0, Math.min(30, numIn(t.value)));
      if (f !== S.formas.filter(function (x) { return x.id === id; })[0]) return;
    } else if (k === 'cclemb') S.ccLemb = t.checked;
    else if (k === 'lockmin') S.lockMin = Math.max(0, parseInt(t.value, 10) || 0);
    else if (k === 'locksens') S.lockSens = t.checked;
    else if (k === 'biotog') {
      if (t.checked)
        bioPedir(
          function () {
            S.bioOn = true;
            S.ajMsg = 'Digital ou rosto ativado.';
            S._ajForce = true;
            render();
          },
          function (e) {
            S.bioOn = false;
            S.ajMsg = 'Não consegui confirmar a digital ou o rosto. Tente de novo.' + bioErro(e);
            S._ajForce = true;
            render();
          }
        );
      else S.bioOn = false;
    } else return;
    S._ajForce = true;
    render();
  });

  ACT.fluxod = function (id) {
    S.fluxoD = Number(id) || 30;
    renderDash();
  };
  ACT.resexp = function () {
    var d = new Date();
    salvarArquivo(
      'lafouch-resultado-' + d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '.csv',
      resultadoCsv(),
      'text/csv',
      function () {},
      function () {
        popErr('Não consegui gerar o arquivo neste aparelho.');
      }
    );
  };

  // ---------- retirada do dono
  ACT.rtgo = function () {
    var m = $('rtM').value,
      v = parseDec($('rtV').value, m),
      nota = $('rtN').value.trim();
    if (!(v > 0)) {
      S.rtMsg = 'Informe o valor da retirada.';
      return renderCaixa();
    }
    if ((S.cash[m] || 0) < v - 1e-9) {
      S.rtMsg = 'Saldo em ' + m.toUpperCase() + ' insuficiente (' + fmtM(Math.max(0, S.cash[m] || 0), m) + ').';
      return renderCaixa();
    }
    exigirAuth(function () {
      var ts = Date.now(),
        g = Math.round(v * ratePyg(m));
      S.cash[m] -= v;
      S.retiradas.unshift({ ts: ts, moeda: m, orig: v, valor: g, nota: nota });
      S.dlog.push({ ts: ts, kind: 'ret', desc: nota || 'Retirada do dono', valor: g, moeda: m, orig: v });
      S.rtMsg = 'Retirada registrada: ' + fmtM(v, m) + '.';
      saveSoon();
      renderCaixa();
      renderDash();
    });
  };
  ACT.rtdes = function (id) {
    var r = S.retiradas.filter(function (x) {
      return String(x.ts) === id;
    })[0];
    if (!r) return;
    S.cash[r.moeda] += r.orig;
    S.retiradas = S.retiradas.filter(function (x) {
      return x !== r;
    });
    S.dlog = S.dlog.filter(function (x) {
      return !(x.kind === 'ret' && x.ts === r.ts);
    });
    S.rtMsg = 'Retirada desfeita. ' + fmtM(r.orig, r.moeda) + ' voltaram ao caixa.';
    saveSoon();
    renderCaixa();
    renderDash();
  };

  // ---------- conferência do caixa
  ACT.ccabrir = function () {
    S.ccOpen = true;
    S.ccRes = null;
    S.ccV = {};
    renderCaixa();
  };
  ACT.ccfechar = function () {
    S.ccOpen = false;
    S.ccRes = null;
    renderCaixa();
  };
  ACT.ccgo = function () {
    var cont = {
        pyg: parseDec($('ccP').value, 'pyg'),
        usd: parseDec($('ccU').value, 'usd'),
        brl: parseDec($('ccB').value, 'brl')
      },
      difs = {},
      totUsd = 0;
    ['pyg', 'usd', 'brl'].forEach(function (m) {
      difs[m] = Math.round((cont[m] - (S.cash[m] || 0)) * 100) / 100;
      totUsd += (Math.abs(difs[m]) * ratePyg(m)) / S.fx.pyg;
    });
    var ok = totUsd <= (S.tolUsd || 0),
      partes = ['pyg', 'usd', 'brl']
        .filter(function (m) {
          return Math.abs(difs[m]) >= 0.005;
        })
        .map(function (m) {
          return (difs[m] > 0 ? '+' : '−') + fmtM(Math.abs(difs[m]), m);
        }),
      txt = ok
        ? 'O caixa confere' + (partes.length ? ' (diferença dentro da tolerância: ' + partes.join(', ') + ')' : '') + '.'
        : 'Diferença encontrada: ' + partes.join(', ') + ' (contado menos o que o app calcula).';
    var ts = Date.now();
    S.confCx.push({ ts: ts, difs: difs, ok: ok, ajustou: false });
    S.dlog.push({ ts: ts, kind: 'confcx', desc: txt, valor: Math.round(totUsd * S.fx.pyg) });
    S.ccRes = { ok: ok, txt: txt, cont: cont };
    saveSoon();
    renderCaixa();
    renderDash();
  };
  ACT.ccadj = function () {
    var r = S.ccRes;
    if (!r || r.ok) return;
    exigirAuth(function () {
      S.cash = { pyg: r.cont.pyg, usd: r.cont.usd, brl: r.cont.brl };
      var u = S.confCx[S.confCx.length - 1];
      if (u) u.ajustou = true;
      S.dlog.push({ ts: Date.now(), kind: 'confcx', desc: 'Saldo do app ajustado para o valor contado.', valor: 0 });
      S.ccRes = null;
      S.ccOpen = false;
      S.cxMsg = 'Saldos ajustados para o que você contou.';
      saveSoon();
      renderCaixa();
      renderDash();
    });
  };

  // ---------- preço perigoso: aplica o piso como preço da faixa para aquele tipo
  ACT.precoap = function (key) {
    var l = precoPerigoso(),
      m = l.filter(function (x) {
        return x.key === key;
      })[0];
    if (!m) return;
    var f = faixaOf(m.ref);
    if (!f) return;
    var novo = l
      .filter(function (x) {
        var xf = faixaOf(x.ref);
        return x.tipo === m.tipo && xf && xf.id === f.id;
      })
      .reduce(function (a, x) {
        return Math.max(a, x.pp.piso);
      }, 0);
    f.precos = f.precos || {};
    f.precos[m.tipo] = novo;
    saveSoon();
    render();
  };

  // ---------- PIN e cópias
  ACT.pinset = function () {
    var a = $('pin1').value,
      b = $('pin2').value;
    if (!/^\d{4,8}$/.test(a)) {
      S.ajMsg = 'O PIN deve ter de 4 a 8 números.';
    } else if (a !== b) {
      S.ajMsg = 'Os dois PINs não são iguais.';
    } else {
      var sal = novoSal();
      hashPin(a, sal).then(function (h) {
        S.pinSalt = sal;
        S.pinHash = h;
        S.pinNovo = false;
        S.ajMsg = 'PIN ativado. Ele será pedido ao abrir o app.';
        S._ajForce = true;
        saveSoon();
        render();
      });
      return;
    }
    S._ajForce = true;
    render();
  };
  ACT.pintroca = function () {
    exigirAuth(function () {
      S.pinNovo = true;
      S._ajForce = true;
      render();
    });
  };
  ACT.pinoff = function () {
    if (!S.pinOffConf) {
      S.pinOffConf = true;
      S._ajForce = true;
      render();
      return;
    }
    exigirAuth(function () {
      S.pinOffConf = false;
      S.pinHash = '';
      S.pinSalt = '';
      S.bioOn = false;
      S.ajMsg = 'PIN desativado.';
      S._ajForce = true;
      saveSoon();
      render();
    });
  };
  ACT.abagora = function () {
    autoBackup(true).then(function () {
      S.ajMsg = 'Cópia feita.';
      S._ajForce = true;
      render();
    });
  };
  ACT.abrest = function (dia) {
    if (S.abConf !== dia) {
      S.abConf = dia;
      S._ajForce = true;
      render();
      return;
    }
    exigirAuth(function () {
      abRestaurar(dia).then(function (txt) {
        var e = txt ? restaurarDados(txt) : 'Cópia não encontrada.';
        S.abConf = '';
        S.ajMsg = e || 'Cópia de ' + dia.split('-').reverse().join('/') + ' restaurada.';
        S._ajForce = true;
        saveSoon();
        render();
      });
    });
  };

  // ---------- Dados de exemplo (14 meses)
  ACT.exemplo = function () {
    if (!S.exConf) {
      S.exConf = true;
      S._ajForce = true;
      render();
      return;
    }
    exigirAuth(function () {
      S.exConf = false;
      exGerar();
      S._ajForce = true;
      saveFotos();
      saveSoon();
      render();
    });
  };
  // ---------- Moeda principal
  ACT.moedap = function (id) {
    S.moedaP = id === 'usd' || id === 'brl' ? id : 'pyg';
    S.descTxt = '';
    S.rec = null;
    S.hF.vmin = S.hF.vmax = '';
    S._ajForce = true;
    saveSoon();
    render();
  };
  // ---------- Dashboard em abas
  ACT.dtab = function (id) {
    S.dTab = id;
    renderDash();
    animEnter($('dtabBody'));
  };
  ACT.dfold = function (id) {
    S.dfold[id] = !S.dfold[id];
    renderDash();
    if (S.dfold[id]) {
      var b = document.querySelector('[data-act="dfold"][data-id="' + id + '"]'),
        sec = b && b.closest('section');
      animEnter(sec && sec.nextElementSibling);
    }
  };
  ACT.attodos = function () {
    S.atTodos = !S.atTodos;
    renderDash();
  };

  // Datas do período "Outro".
  document.addEventListener('change', function (ev) {
    var t = ev.target,
      k = t.getAttribute && t.getAttribute('data-pdat');
    if (!k) return;
    if (k === 'de') S.perDe = t.value;
    else S.perAte = t.value;
    renderDash();
  });
  // ===== Dados de exemplo: fotos desenhadas e cerca de 14 meses de histórico (para testar o app). =====
  // Números pseudo-aleatórios repetíveis (mesmo exemplo todas as vezes).
  function exRand(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // Foto de exemplo de um óculos (SVG em fundo branco): formato, cor da armação e tipo (solar escurece a lente).
  function exFoto(fmt, cor, tipo) {
    var c = hexOf(cor),
      solar = tipo === 'solar',
      id = 'g' + Math.abs((fmt + cor + tipo).split('').reduce(function (a, ch) { return (a * 31 + ch.charCodeAt(0)) | 0; }, 7)),
      lens = function (cx) {
        var w = 112,
          h = 84,
          x = cx - w / 2,
          y = 150 - h / 2;
        switch (fmt) {
          case 'Redondo':
            return '<circle cx="' + cx + '" cy="150" r="46"/>';
          case 'Quadrado':
            return '<rect x="' + (cx - 54) + '" y="' + (150 - 48) + '" width="108" height="96" rx="10"/>';
          case 'Hexagonal':
            return '<polygon points="' + [cx - 56, 150, cx - 28, 150 - 44, cx + 28, 150 - 44, cx + 56, 150, cx + 28, 150 + 44, cx - 28, 150 + 44].join(' ') + '"/>';
          case 'Gatinho': {
            var s = cx < 200 ? 1 : -1,
              X = function (dx) {
                return cx - s * dx;
              };
            return '<path d="M' + X(60) + ' 98 Q' + X(20) + ' 104 ' + X(-50) + ' 118 Q' + X(-62) + ' 134 ' + X(-52) + ' 154 Q' + X(-40) + ' 190 ' + cx + ' 190 Q' + X(46) + ' 188 ' + X(60) + ' 150 Z"/>';
          }
          case 'Aviador':
            return '<path d="M' + (cx - 58) + ' 112 Q' + cx + ' 98 ' + (cx + 58) + ' 112 Q' + (cx + 56) + ' 190 ' + (cx + 8) + ' 194 Q' + (cx - 56) + ' 190 ' + (cx - 58) + ' 112 Z"/>';
          default:
            return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="20"/>';
        }
      };
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><rect width="400" height="300" fill="#fff"/>' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + (solar ? '#2b2f36' : '#dff1fb') + '" stop-opacity="' + (solar ? '.92' : '.55') + '"/><stop offset="1" stop-color="' + (solar ? '#5b6370' : '#b9dcef') + '" stop-opacity="' + (solar ? '.88' : '.35') + '"/></linearGradient></defs>' +
      '<ellipse cx="200" cy="262" rx="150" ry="9" fill="#000" opacity=".07"/>' +
      '<g fill="url(#' + id + ')" stroke="' + c + '" stroke-width="8" stroke-linejoin="round">' + lens(125) + lens(275) + '</g>' +
      '<path d="M178 140 Q200 120 222 140" fill="none" stroke="' + c + '" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M66 138 L28 128 M334 138 L372 128" stroke="' + c + '" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M96 132 Q112 118 138 124" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55"/>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  // Uma foto por produto e cor do estoque.
  function exFotos(items) {
    var f = {};
    items.forEach(function (i) {
      var k = i.ref + '|' + i.cor;
      if (!f[k]) f[k] = exFoto(i.fmt || 'Retangular', i.cor, i.tipo);
    });
    return f;
  }
  var EX_BASE = null;
  // Gera cerca de 14 meses de vendas, câmbio, contas, compras e movimentos do dono.
  function exGerar() {
    if (!EX_BASE) EX_BASE = JSON.parse(JSON.stringify({ items: S.items, grp: S.grp }));
    var R = exRand(20260101),
      DIAS = 430,
      hoje = new Date();
    function dia(d, h) {
      return new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - d, h || 12, Math.floor(R() * 50)).getTime();
    }
    function pick(a) {
      return a[Math.floor(R() * a.length)];
    }
    S.items = JSON.parse(JSON.stringify(EX_BASE.items));
    S.grp = JSON.parse(JSON.stringify(EX_BASE.grp));
    // estoque novo, no sistema novo: modelos sem marca e sem nome, sem formato, com descrição escrita pelo dono
    [
      ['sem', '', 'YM7721', '54□17-142', 'C1', 'Redondo', 'Verde', 4],
      ['sem', '', 'YM7721', '54□17-142', 'C2', 'Redondo', 'Preto', 3],
      ['sem', '', 'YM7735', '50□20-138', 'C1', 'Gatinho', 'Tartaruga', 5],
      ['sem', '', 'YM7735', '50□20-138', 'C3', 'Gatinho', 'Azul', 2],
      ['sem', '', 'YM7790', '56□16-140', 'C2', 'Aviador', 'Dourado', 3],
      ['solar', '', 'YS8801', '58□17-140', 'C1', 'Aviador', 'Preto', 6],
      ['solar', '', 'YS8801', '58□17-140', 'C4', 'Aviador', 'Marrom', 3],
      ['solar', '', 'YS8815', '54□19-142', 'C2', 'Quadrado', 'Verde', 4],
      ['pre', '+1.00', 'SP61200', '', '', 'Redondo', 'Preto', 4],
      ['pre', '+1.50', 'SP61200', '', '', 'Redondo', 'Preto', 3],
      ['pre', '+2.00', 'SP61200', '', '', 'Redondo', 'Preto', 2],
      ['pre', '+2.50', 'SP61200', '', '', 'Redondo', 'Preto', 3]
    ].forEach(function (a) {
      var o = { tipo: a[0], grau: a[1], ref: a[2], med: a[3], vr: a[4], fmt: a[5], cor: a[6], qty: a[7] };
      if (a[0] === 'pre') o.lote = 'G1';
      else o.custo = a[0] === 'solar' ? 4.5 : 3.2;
      S.items.push(o);
    });
    S.fotos = exFotos(S.items);
    S.items.forEach(function (i) {
      i.fmt = '';
    });
    S.pfaixa = { SP57765: 'f1', SP58110: 'f2', SP60627: 'f2', SP59002: 'f3', BR44118: 'f1', BR44120: 'f2', BR44133: 'f3', SL2201: 'f2', SL2210: 'f3', YM7721: 'f1', YM7735: 'f2', YM7790: 'f3', YS8801: 'f2', YS8815: 'f1', SP61200: 'f1' };
    S.attr = {
      SP57765: { material: 'Acetato', publico: 'Unissex', colecao: 'Leitura' },
      SP58110: { marca: 'Kazwini', material: 'Acetato', publico: 'Masculino', colecao: 'Leitura' },
      SP60627: { material: 'Plástico', publico: 'Feminino', colecao: 'Leitura' },
      SP59002: { material: 'Acetato', publico: 'Unissex', colecao: 'Leitura' },
      BR44118: { marca: 'Gucci', material: 'Metal', publico: 'Feminino', colecao: 'Clássicos' },
      BR44120: { marca: 'Ray-Ban', material: 'Metal', publico: 'Masculino', colecao: 'Clássicos' },
      BR44133: { marca: 'Armani', material: 'Acetato', publico: 'Feminino', colecao: 'Clássicos' },
      SL2201: { marca: 'Ray-Ban', material: 'Metal', publico: 'Masculino', colecao: 'Solares' },
      SL2210: { marca: 'Kazwini', material: 'TR90', publico: 'Feminino', colecao: 'Solares' }
    };
    S.pnome = {};
    S.pnAuto = {};
    S.descAuto = {};
    S.desc = {
      SP57765: 'Leitura retangular preta, haste fina. Sai muito em graus baixos.',
      SP58110: 'Armação quadrada preta de acetato, leve e firme.',
      SP60627: 'Hexagonal bege translúcida, bonita no rosto feminino.',
      SP59002: 'Redonda tartaruga, estilo antigo. O +1.75 está esgotado.',
      BR44118: 'Quadrada de metal fino, pontes ajustáveis. Cores C1 preto, C2 bege, C3 tartaruga.',
      BR44120: 'Redonda clássica, haste fina de metal.',
      BR44133: 'Gatinho feminino, vinho e transparente.',
      SL2201: 'Aviador de metal, lente degradê. Preto ou dourado.',
      SL2210: 'Solar gatinho de TR90, leve para o dia a dia.',
      YM7721: 'Armação de acetato redonda, verde-garrafa e preta, haste larga.',
      YM7735: 'Gatinho de acetato, formato mais curto que o normal. Tartaruga e azul.',
      YM7790: 'Aviador dourado fino, ponte alta, formato fora do comum.',
      YS8801: 'Solar aviador grande, lente escura. Preto e marrom.',
      YS8815: 'Solar quadrado verde, lente degradê, haste grossa.',
      SP61200: 'Leitura redonda preta, acabamento fosco.'
    };
    S.num = {};
    S.numNext = 0;
    S.appStart = dia(DIAS, 8);
    // câmbio: 30 dias já existentes + o resto, em sequência suave
    var rec = S.fxHist.slice(),
      ant = [],
      n0 = rec.length,
      ruido = 0,
      ruidoB = 0;
    for (var d = DIAS; d > n0 - 1; d--) {
      var k = DIAS - d;
      ruido = ruido * 0.9 + (R() - 0.5) * 18;
      ruidoB = ruidoB * 0.9 + (R() - 0.5) * 0.02;
      ant.push({
        ts: dia(d, 10),
        pyg: Math.round(6040 + (k / (DIAS - n0)) * 230 + 90 * Math.sin(k / 37) + ruido),
        brl: Math.round((5.12 + (k / (DIAS - n0)) * 0.26 + 0.1 * Math.sin(k / 53) + ruidoB) * 1000) / 1000
      });
    }
    if (ant.length) {
      var off = rec[0].pyg - ant[ant.length - 1].pyg,
        offB = rec[0].brl - ant[ant.length - 1].brl;
      ant.forEach(function (p, i) {
        var w = (i + 1) / ant.length;
        p.pyg = Math.round(p.pyg + off * w * w);
        p.brl = Math.round((p.brl + offB * w * w) * 1000) / 1000;
      });
    }
    S.fxHist = ant.concat(rec);
    function fxDe(ts) {
      var v = S.fxHist[0];
      S.fxHist.forEach(function (p) {
        if (p.ts <= ts) v = p;
      });
      return v;
    }
    // vendas
    S.sales = [];
    S.saleSeq = 0;
    var porTipo = { pre: S.items.filter(function (i) { return i.tipo === 'pre'; }), sem: S.items.filter(function (i) { return i.tipo === 'sem'; }), solar: S.items.filter(function (i) { return i.tipo === 'solar'; }) },
      mesM = [1.2, 1.1, 1.0, 0.95, 1.25, 0.95, 0.8, 0.9, 1.0, 1.05, 1.15, 1.6],
      sem = [0.25, 1.0, 1.0, 1.0, 1.05, 1.25, 1.5],
      formasP = [['din', 0.52], ['pix', 0.2], ['deb', 0.16], ['cre', 0.12]];
    for (var dd = DIAS; dd >= 0; dd--) {
      var dt = new Date(dia(dd, 12)),
        tend = 0.8 + 0.3 * ((DIAS - dd) / DIAS),
        lam = 4.4 * mesM[dt.getMonth()] * sem[dt.getDay()] * tend,
        nv = 0,
        L = Math.exp(-lam),
        p = 1;
      do {
        nv++;
        p *= R();
      } while (p > L && nv < 12);
      nv--;
      for (var j = 0; j < nv; j++) {
        var ts = dia(dd, 9 + Math.floor(R() * 10)),
          wSolar = (SAZON_PADRAO.solar[dt.getMonth()] || 1) * 0.35,
          x = R() * (0.45 + 0.2 + wSolar),
          tipo = x < 0.45 ? 'pre' : x < 0.65 ? 'sem' : 'solar',
          it = pick(porTipo[tipo]),
          qty = R() < 0.84 ? 1 : R() < 0.75 ? 2 : 3,
          fxp = fxDe(ts),
          cPeca = Math.round(11500 * (0.82 + 0.18 * ((DIAS - dd) / DIAS))),
          s = mkSale(ts, it.tipo, it.ref, it.cor, it.grau, it.vr, qty, fxp.pyg, 0.12, cPeca, R() < 0.015),
          t = tipoOf(it.tipo),
          preco = t.price * qty;
        if (R() < 0.3) preco = Math.round((preco * (1 - (0.03 + R() * 0.1))) / 500) * 500;
        var c = calcSale(t, qty, fxp.pyg, 0.12, cPeca, S.melhPeca, preco);
        for (var kk in c) s[kk] = c[kk];
        var fm = formasP.reduce(function (a, f) { return a.v != null ? a : (a.r -= f[1]) <= 0 ? { v: f[0] } : a; }, { r: R() }).v || 'din',
          fo = S.formas.filter(function (f) { return f.id === fm; })[0] || S.formas[0],
          tx = Math.round((preco * fo.taxa) / 100),
          mo = R() < 0.12 ? 'brl' : R() < 0.07 ? 'usd' : 'pyg',
          rt = mo === 'pyg' ? 1 : Math.round(mo === 'usd' ? fxp.pyg * 1.025 : fxp.pyg / fxp.brl),
          rv = mo === 'pyg' ? preco : Math.round((preco / rt) * 100) / 100;
        if (mo !== 'pyg') fo = S.formas[0];
        if (mo !== 'pyg') tx = 0;
        s.livre -= tx;
        s.forma = fo.id;
        s.taxa = tx;
        s.taxaM = mo === 'pyg' ? tx : 0;
        s.faixa = S.pfaixa[it.ref] || '';
        s.lista = preco;
        s.abaixo = false;
        s.perde = false;
        s.moeda = mo;
        s.recebido = rv;
        s.rate = rt;
        s.pags = [{ moeda: mo, v: rv, rate: rt, fee: mo === 'pyg' ? tx : 0 }];
        s.troco = [];
        s.lote = it.lote || '';
        S.sales.push(s);
      }
    }
    S.sales.sort(function (a, b) { return b.ts - a.ts; });
    // contas pagas mês a mês
    var dias = { 1: 5, 2: 15, 3: 10, 4: 20, 5: 5, 6: 12, 7: 1 };
    S.cpay = [];
    S.dlog = [];
    S.exp.forEach(function (e) {
      e.dia = dias[e.id] || 10;
      e.paid = {};
      for (var m = 13; m >= 0; m--) {
        var base = new Date(hoje.getFullYear(), hoje.getMonth() - m, Math.min(e.dia, 28), 11),
          ym = base.getFullYear() + '-' + ('0' + (base.getMonth() + 1)).slice(-2);
        if (m === 0 && (e.dia > hoje.getDate() || e.tipo === 'variavel')) continue;
        var v = e.valor * (1 - 0.006 * m) * (e.tipo === 'variavel' ? 0.88 + R() * 0.24 : 1);
        v = Math.round(v / 1000) * 1000;
        var ts = base.getTime();
        e.paid[ym] = ts;
        S.cpay.push({ ts: ts, id: e.id, ym: ym, nome: e.nome, valor: v, cat: e.cat, moeda: 'pyg', orig: v });
        S.dlog.push({ ts: ts, kind: 'pago', nome: e.nome, desc: e.nome + ' (' + CATS[e.cat] + ')', valor: v, moeda: 'pyg', orig: v });
      }
    });
    S.exp.forEach(function (e) {
      e.hist.forEach(function (x) {
        S.dlog.push({ ts: x.ts, kind: 'alt', nome: e.nome, cat: e.cat, de: x.de, para: x.para });
      });
    });
    // retiradas do dono, imprevistos, melhorias
    S.retiradas = [];
    for (var m2 = 13; m2 >= 0; m2--) {
      var tr = dia(m2 * 30 + 3, 17),
        vr = Math.round((250000 + R() * 450000) / 10000) * 10000;
      S.retiradas.unshift({ ts: tr, moeda: 'pyg', orig: vr, valor: vr, nota: pick(['Retirada do mês', 'Compras de casa', 'Mercado', 'Escola']) });
      S.dlog.push({ ts: tr, kind: 'ret', desc: S.retiradas[0].nota, valor: vr, moeda: 'pyg', orig: vr });
    }
    S.imprev = [];
    [[390, 'Troca de lâmpadas', 90000], [310, 'Conserto do ar-condicionado', 380000], [220, 'Fechadura nova', 120000], [140, 'Vazamento no banheiro', 210000], [60, 'Impressora', 150000], [6, 'Conserto da vitrine', 60000]].forEach(function (a) {
      var x = { ts: dia(a[0], 15), desc: a[1], valor: a[2] };
      S.imprev.push(x);
      S.dlog.push(dlogImp(x));
    });
    S.melhUso = [];
    [[330, 'Vitrine iluminada', 80000], [190, 'Placa da loja', 120000], [8, 'Tinta da fachada', 15000]].forEach(function (a) {
      var x = { ts: dia(a[0], 16), desc: a[1], valor: a[2] };
      S.melhUso.push(x);
      S.dlog.push(dlogMelh(x));
    });
    // compras de lotes e entradas de estoque
    S.compras = [];
    S.lotes = [];
    S.elog = [];
    var lotes = [[410, 0.44, 400], [345, 0.45, 300], [280, 0.46, 400], [215, 0.47, 300], [150, 0.48, 400], [90, 0.49, 300], [60, 0.46, 400], [19, 0.5, 400]];
    lotes.forEach(function (l, i) {
      var tsl = dia(l[0], 10),
        usdv = Math.round(l[1] * l[2] * 100) / 100,
        c = { ts: tsl, desc: 'Lote #' + (3000 + i * 37) + ' pré-graduados', usd: usdv };
      S.compras.push(c);
      S.dlog.push(dlogLote(c));
      S.lotes.push({ id: '#' + (3000 + i * 37), ts: tsl, usd: l[1], txt: 'Pré-graduados' });
      var ref = pick(['SP57765', 'SP58110', 'SP60627', 'SP59002']),
        itx = S.items.filter(function (z) { return z.ref === ref; })[0];
      S.elog.push({ ts: tsl, tipo: 'pre', ref: ref, cor: itx.cor, grau: itx.grau, qty: 20 + Math.floor(R() * 15) });
    });
    S.elog.push({ ts: dia(2, 15), tipo: 'pre', ref: 'SP58110', cor: 'Preto', grau: '+1.25', qty: 6 }, { ts: dia(5, 14), tipo: 'sem', ref: 'BR44133', cor: 'Vinho', grau: '', qty: 4 });
    // trocas de moeda
    S.cambios = [];
    for (var q = 0; q < 12; q++) {
      var tq = dia(10 + q * 34, 13),
        fq = fxDe(tq),
        dado = Math.round((600000 + R() * 900000) / 50000) * 50000,
        para = R() < 0.7 ? 'usd' : 'brl',
        recq = para === 'usd' ? Math.round((dado / (fq.pyg * 1.01)) * 100) / 100 : Math.round((dado / ((fq.pyg / fq.brl) * 1.01)) * 100) / 100;
      S.cambios.push({ ts: tq, de: 'pyg', para: para, dado: dado, rec: recq, difGs: -Math.round(dado * 0.01) });
    }
    // contagens e descartes
    S.contagens = [];
    S.descartes = [];
    S.conf = {};
    [[200, 'SP57765', 'Preto', -2], [95, 'SP60627', 'Bege translúcido', -1], [40, 'BR44118', 'Preto', 1]].forEach(function (a) {
      var tsc = dia(a[0], 18),
        usdv = a[3] * 0.48;
      S.contagens.push({ ts: tsc, difs: 1, valorUsd: usdv, vendaGs: a[3] * 45000, itens: [{ ref: a[1], cor: a[2], dif: a[3], usd: usdv }] });
      S.elog.push({ ts: tsc, tipo: a[1].slice(0, 2) === 'BR' ? 'sem' : 'pre', ref: a[1], cor: a[2], grau: '', qty: a[3], contagem: true });
    });
    [[300, 'SP58110', 'Preto', 3, 'veio quebrada'], [125, 'SP57765', 'Preto', 2, 'lente riscada'], [30, 'SP59002', 'Tartaruga', 1, 'haste quebrada']].forEach(function (a) {
      var tsd = dia(a[0], 16),
        usdv = Math.round(a[3] * 0.48 * 100) / 100,
        val = Math.round(usdv * fxDe(tsd).pyg);
      S.descartes.push({ ts: tsd, ref: a[1], cor: a[2], qty: a[3], usd: usdv, valor: val, motivo: a[4] });
      S.dlog.push({ ts: tsd, kind: 'descarte', desc: a[3] + '× ' + a[1] + ' · ' + a[2] + ' (' + a[4] + ')', valor: val, usd: usdv });
      S.elog.push({ ts: tsd, tipo: 'pre', ref: a[1], cor: a[2], grau: '', qty: -a[3], descarte: true });
    });
    S.conf = { 'pre|SP57765': dia(20, 18), 'solar|SL2201': dia(45, 18) };
    S.day = dayKey(Date.now());
    S.hDias = 30;
    S.hq = '';
    return S.sales.length;
  }
  // Valores do exemplo de 14 meses ao abrir o app novo.
  exGerar();
  // ===== Render geral e persistência (localStorage + IndexedDB). =====
  // Redesenha o app e agenda o salvamento.
  function render() {
    try {
      refreshRefList();
    } catch (e) {}
    var sy = window.pageYOffset || 0;
    syncBulk();
    try {
      identSync();
    } catch (e) {}
    renderEstoque();
    renderAddExtras();
    renderVendas();
    renderNav();
    try {
      notifVerifica();
    } catch (e) {}
    renderInicio();
    renderPedidos();
    renderNotif();
    renderDash();
    renderCaixa();
    renderDesp();
    renderFx();
    renderHist();
    renderAjustes();
    renderDay();
    saveSoon();
    if ((window.pageYOffset || 0) !== sy) window.scrollTo(0, sy);
  }

  /* ---------- fotos: miniatura (catálogo) + original em alta (IndexedDB, bem mais espaço que o localStorage) */
  function thumbOf(cv) {
    var m = 900,
      sc = Math.min(1, m / Math.max(cv.width, cv.height)),
      c = mkCanvas(Math.round(cv.width * sc), Math.round(cv.height * sc)),
      g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.fillStyle = '#fff';
    g.fillRect(0, 0, c.width, c.height);
    g.drawImage(cv, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.88);
  }
  var IDBOK = false,
    FS = {},
    idbP = null;
  // Abre o IndexedDB das fotos.
  function idb() {
    if (idbP) return idbP;
    idbP = new Promise(function (ok, no) {
      try {
        var r = indexedDB.open('lafouch-fotos', 1);
        r.onupgradeneeded = function () {
          var d = r.result;
          d.createObjectStore('fotos');
          d.createObjectStore('hq');
        };
        r.onsuccess = function () {
          IDBOK = true;
          ok(r.result);
        };
        r.onerror = function () {
          no(r.error);
        };
        r.onblocked = function () {
          no('blocked');
        };
      } catch (e) {
        no(e);
      }
    });
    return idbP;
  }
  // Executa uma transação no IndexedDB.
  function idbDo(store, mode, fn) {
    return idb().then(function (d) {
      return new Promise(function (ok, no) {
        var t = d.transaction(store, mode),
          o = t.objectStore(store),
          res = fn(o);
        t.oncomplete = function () {
          ok(res && res.result);
        };
        t.onerror = function () {
          no(t.error);
        };
        t.onabort = function () {
          no(t.error);
        };
      });
    });
  }
  // Guarda a foto (miniatura + original).
  function setFoto(k, thumb, hq) {
    S.fotos[k] = thumb;
    if (hq && hq !== thumb)
      idbDo('hq', 'readwrite', function (o) {
        return o.put(hq, k);
      }).catch(function () {});
  }
  // Grava as fotos pendentes no IndexedDB.
  function saveFotos() {
    if (!IDBOK) return;
    var k;
    for (k in S.fotos)
      if (FS[k] !== S.fotos[k]) {
        (function (kk, v) {
          idbDo('fotos', 'readwrite', function (o) {
            return o.put(v, kk);
          })
            .then(function () {
              FS[kk] = v;
            })
            .catch(function () {});
        })(k, S.fotos[k]);
      }
    for (k in FS)
      if (!(k in S.fotos)) {
        (function (kk) {
          delete FS[kk];
          idbDo('fotos', 'readwrite', function (o) {
            return o.delete(kk);
          }).catch(function () {});
          idbDo('hq', 'readwrite', function (o) {
            return o.delete(kk);
          }).catch(function () {});
        })(k);
      }
  }
  // Carrega as fotos do IndexedDB.
  function loadFotos() {
    idb()
      .then(function (d) {
        return new Promise(function (ok, no) {
          var t = d.transaction('fotos', 'readonly'),
            o = t.objectStore('fotos'),
            c = o.openCursor(),
            got = {};
          c.onsuccess = function () {
            var cur = c.result;
            if (cur) {
              got[cur.key] = cur.value;
              cur.continue();
            }
          };
          t.oncomplete = function () {
            ok(got);
          };
          t.onerror = function () {
            no(t.error);
          };
        });
      })
      .then(function (got) {
        var k;
        for (k in got) {
          FS[k] = got[k];
          if (!S.fotos[k]) S.fotos[k] = got[k];
        }
        saveFotos();
        if (window.__DBG) window.__SF = Object.keys(S.fotos);
        render();
      })
      .catch(function () {});
  }
  var SK = 'lafouch_demo_v1',
    PERSIST = [
      'grp',
      'maxVar',
      'items',
      'sales',
      'saleSeq',
      'exp',
      'nextExp',
      'imprev',
      'dlog',
      'elog',
      'cambios',
      'compras',
      'melhUso',
      'cash',
      'ini',
      'palette',
      'formats',
      'desc',
      'volume',
      'melhPeca',
      'fxHist',
      'sold',
      'lotes',
      'tiposX',
      'tiposDel',
      'tiposOrd',
      'pnome',
      'cpay',
      'faixas',
      'pfaixa',
      'metaUsd',
      'appStart',
      'sugIgn',
      'backupTs',
      'contagens',
      'conf',
      'tolUsd',
      'volAuto',
      'retiradas',
      'descartes',
      'moedaP',
      'fundoBranco',
      'atMin',
      'notifs',
      'pedidos',
      'pedNext',
      'fxMgUlt',
      'inicioT',
      'attr',
      'num',
      'numNext',
      'pnAuto',
      'descAuto',
      'confCx',
      'ccLemb',
      'formas',
      'pinHash',
      'pinSalt',
      'bioOn',
      'lockMin',
      'lockSens'
    ];
  // Carrega o estado salvo.
  function loadSaved() {
    try {
      var j = localStorage.getItem(SK);
      if (!j) return;
      var d = JSON.parse(j);
      PERSIST.forEach(function (k) {
        if (d[k] !== undefined) S[k] = d[k];
      });
      if (d.grp === undefined) S.grp = [];
      try {
        dedupeItems();
      } catch (e) {}
      try {
        window.__cleanN = cleanDb();
      } catch (e) {
        window.__cleanErr = String(e);
      }
      if (d.fotos && typeof d.fotos === 'object') S.fotos = d.fotos;
      var lp = S.fxHist[S.fxHist.length - 1];
      if (lp) {
        S.fx.pyg = lp.pyg;
        S.fx.brl = lp.brl;
      }
    } catch (e) {}
  }
  var saveT = 0;
  // Agenda o salvamento (debounce).
  function saveSoon() {
    clearTimeout(saveT);
    saveT = setTimeout(function () {
      try {
        var d = {};
        PERSIST.forEach(function (k) {
          d[k] = S[k];
        });
        if (!IDBOK) d.fotos = S.fotos;
        localStorage.setItem(SK, JSON.stringify(d));
      } catch (e) {}
      saveFotos();
    }, 400);
  }
  loadSaved();
  iniciarLock();
  syncTipos();
  render();
  setTimeout(autoBackup, 4000);
  loadFotos();
  // Gancho de teste: expõe funções internas só quando a URL termina em #test (usado por tests/).
  if (/(^|[#&])test\b/.test(location.hash))
    window.__LF = {
      S: S, fxMargemInfo: fxMargemInfo, fxLoja: fxLoja, identSync: identSync, nomeAuto: nomeAuto, numOf: numOf, attrOf: attrOf, setAttr: setAttr, pubNome: pubNome, identTxt: identTxt, calcSale: calcSale, colchao: colchao, reservas: reservas, conv: conv, ratePyg: ratePyg,
      walletGs: walletGs, parseDec: parseDec, gUnit: gUnit, gOwn: gOwn, gTot: gTot, grpDet: grpDet,
      grpTot: grpTot, grpFalta: grpFalta, effCusto: effCusto, parseLote: parseLote, parseHaste: parseHaste,
      parseVote: parseVote, flatParse: flatParse, numAmt: numAmt, hKey: hKey, lev: lev, normRef: normRef,
      nrm: nrm, normGrau: normGrau, totalMensal: totalMensal, contasPeca: contasPeca, lotCharge: lotCharge,
      lotRefund: lotRefund, lotAdjust: lotAdjust, cleanDb: cleanDb, dedupeItems: dedupeItems, render: render,
      lotesHist: lotesHist, periodSales: periodSales, sumBy: sumBy, saveSoon: saveSoon, mkMatch: mkMatch,
      setView: setView, whiten: whiten, mkCanvas: mkCanvas, lancarCompra: lancarCompra,
      lancarMelhoria: lancarMelhoria, lancarImprevisto: lancarImprevisto, lancarPagamento: lancarPagamento,
      desfazerPagamento: desfazerPagamento, pisoPeca: pisoPeca, faixaOf: faixaOf, sazonFator: sazonFator, calcPacote: calcPacote, vendaPrevia: vendaPrevia, prodStats: prodStats, reposicao: reposicao, parados: parados, curvaAbc: curvaAbc, sugestoes: sugestoes, metaInfo: metaInfo, backupDados: backupDados, volumeAuto: volumeAuto, volumeEfetivo: volumeEfetivo, restaurarDados: restaurarDados, abaixoDoPiso: abaixoDoPiso, perdasPropositais: perdasPropositais, ACT: ACT, logDespesa: logDespesa, entradaEstoque: entradaEstoque, syncTipos: syncTipos, avisosVenc: avisosVenc, efeitoCambio: efeitoCambio, reservaCambioContas: reservaCambioContas, expOrig: expOrig, proxVenc: proxVenc, resultadoMes: resultadoMes, fluxoCaixa: fluxoCaixa, capitalEstoque: capitalEstoque, dolarFavoravel: dolarFavoravel, precoPerigoso: precoPerigoso, formaSel: formaSel, hashPin: hashPin, exigirAuth: exigirAuth, pinAtivo: pinAtivo, resultadoCsv: resultadoCsv, backupLembrete: backupLembrete, ccDias: ccDias, addSale: addSale, periodoAtual: periodoAtual, vendasPeriodo: vendasPeriodo, showSplit: showSplit, cartFinalizar: cartFinalizar, rateDe: rateDe, fxLoja: fxLoja, FX_MARGEM: FX_MARGEM, tFor: tFor, cartPrevia: cartPrevia, gs: gs, tipoOf: tipoOf, descartar: descartar
    };
})();

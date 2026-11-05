  // ===== Catálogo: busca na posição B + janela "Ajustes do catálogo" (v427, aprovado 04–05/11/2026) =====
  // Busca sozinha; embaixo "N peças · Varejo · G$" com os botões Ajustes e Compartilhar.
  // A janela junta Preço (Varejo/Atacado), Moeda, Ver como e os filtros (Tipo, Para quem, Preço até, Situação),
  // com ícones desenhados no mesmo estilo. Nada muda até "Ver N peças"; Cancelar, tocar fora ou arrastar desfaz.
  // Bolinha no botão de ajustes quando algo está diferente do normal.
  S.cjF = { tipos: [], pub: [], ate: 0, sit: [] }; // filtros aplicados
  var CJ_ICO = {
    solar: '<svg viewBox="0 0 20 20"><path class="k" d="M2 8h6.5l-.5 4a2 2 0 0 1-2 1.8H4.5a2 2 0 0 1-2-1.8zM11.5 8H18l-.5 4a2 2 0 0 1-2 1.8h-1.5a2 2 0 0 1-2-1.8z" fill="currentColor" stroke="currentColor" stroke-width="1"/><path d="M8.5 9h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    pre: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle class="k" cx="5.5" cy="10.5" r="3.6"/><circle class="k" cx="14.5" cy="10.5" r="3.6"/><path d="M9.1 10h1.8"/></svg>',
    sem: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"><rect class="k" x="1.8" y="7.5" width="7" height="6" rx="1.6"/><rect class="k" x="11.2" y="7.5" width="7" height="6" rx="1.6"/><path d="M8.8 9.3h2.4"/></svg>',
    F: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle class="k" cx="10" cy="7" r="4"/><path class="k" d="M10 11v7M7 15h6"/></svg>',
    M: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle class="k" cx="8" cy="12" r="4.2"/><path class="k" d="M11 9l6-6M12.5 3H17v4.5"/></svg>',
    U: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle class="k" cx="7" cy="8" r="2.6"/><circle class="k" cx="13.5" cy="8" r="2.6"/><path class="k" d="M2.5 16c.6-2.6 2.4-4 4.5-4s3.9 1.4 4.5 4M10 16c.6-2.6 2.2-4 3.5-4 2 0 3.8 1.4 4.3 4"/></svg>',
    moeda: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle class="k" cx="10" cy="10" r="7"/><path d="M10 6.5v7" stroke-linecap="round"/></svg>',
    of: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path class="k" d="M3 3h6.5L17 10.5 10.5 17 3 9.5z"/><circle cx="6.8" cy="6.8" r="1.2" fill="currentColor" stroke="none"/></svg>',
    nov: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path class="k" d="M10 2.5l1.8 4.7 4.7 1.8-4.7 1.8L10 15.5l-1.8-4.7L3.5 9l4.7-1.8z"/></svg>',
    enc: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path class="k" d="M5 2.5h10M5 17.5h10M6 2.5c0 4 3 5 4 7.5 1-2.5 4-3.5 4-7.5M6 17.5c0-4 3-5 4-7.5 1 2.5 4 3.5 4 7.5"/></svg>',
    mais: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path class="k" d="M3 15l4.5-4.5 3 3L17 7M12.5 7H17v4.5"/></svg>',
    aj: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2.2"/><circle cx="10" cy="17" r="2.2"/></svg>',
    sh: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.6-4M8.2 13.2l7.6 4"/></svg>'
  };
  var CJ_ATE = [50000, 100000, 150000, 'mais'];
  function cjPub(ref) {
    var p = (attrOf(ref) || {}).publico;
    return p === 'Feminino' ? 'F' : p === 'Masculino' ? 'M' : 'U';
  }
  function cjSit(ref, k) {
    if (k === 'of') {
      var pp = S.pprice && S.pprice[ref];
      return !!(pp && pp.ant > 0 && pp.novo > 0 && pp.ant > pp.novo);
    }
    if (k === 'nov') return Date.now() - paPrimEntrada(ref) <= 30 * DAY;
    if (k === 'enc') return encDias(ref) > 0;
    return true;
  }
  // A peça passa nos filtros novos (f = estado aplicado ou o rascunho da janela)?
  function cjOk(i, f) {
    f = f || S.cjF || {};
    if (f.tipos && f.tipos.length && f.tipos.indexOf(i.tipo) < 0) return false;
    if (f.pub && f.pub.length && f.pub.indexOf(cjPub(i.ref)) < 0) return false;
    if (f.ate) {
      var p = tFor(i).price || 0;
      if (f.ate === 'mais' ? p <= 150000 : p > f.ate) return false;
    }
    var sit = (f.sit || []).filter(function (k) {
      return k !== 'mais';
    });
    if (sit.length && !sit.some(function (k) {
        return cjSit(i.ref, k);
      }))
      return false;
    return true;
  }
  function cjPadrao() {
    var f = S.cjF || {};
    return tabDe(S.tabAtiva).pub && vMoeda() === 'pyg' && !(f.tipos || []).length && !(f.pub || []).length && !f.ate && !(f.sit || []).length && !S.vMais && !S.vGrau;
  }
  // Peças (soma das quantidades) que aparecem com um estado de filtros.
  function cjConta(f, grau) {
    var qm = mkMatch(S.vq);
    return S.items.reduce(function (a, i) {
      if (!(i.qty > 0) || !TIPOS.some(function (x) { return x.id === i.tipo; })) return a;
      if (grau && i.tipo === 'pre' && i.grau !== grau) return a;
      if (qm && !qm(i)) return a;
      return a + (cjOk(i, f) ? i.qty : 0);
    }, 0);
  }
  // ---- montagem da linha de baixo da busca (uma vez) ----
  function cjMonta() {
    var sub = document.querySelector('#vListCard .vsub'),
      tb = $('vTabBar');
    if (!sub || sub._cj) return;
    sub._cj = 1;
    if (tb && tb.parentNode) tb.parentNode.classList.add('cjOculta');
    var rs = document.createElement('span');
    rs.id = 'cjRs';
    rs.className = 'cjRs';
    sub.insertBefore(rs, sub.querySelector('.vdir'));
    var bx = document.createElement('div');
    bx.className = 'cjBx';
    bx.innerHTML = '<span id="cjExtra"></span><button type="button" class="ic0 cjIc" id="cjAj" aria-label="Ajustes do catálogo" title="Ajustes do catálogo">' + CJ_ICO.aj + '<span class="cjDot" id="cjDot"></span></button>' +
      '<button type="button" class="ic0 cjIc" id="cjSh" aria-label="Compartilhar" title="Compartilhar">' + CJ_ICO.sh + '</button>';
    sub.appendChild(bx);
    $('cjAj').onclick = cjAbre;
    $('cjSh').onclick = function () {
      shAbre({ tipo: 'catalogo' });
    };
  }
  // Depois de cada desenho do Catálogo: texto da linha, bolinha e o progresso do atacado.
  function cjDepois() {
    cjMonta();
    var rs = $('cjRs');
    if (!rs) return;
    var atac = !tabDe(S.tabAtiva).pub,
      m = { pyg: 'G$', brl: 'R$', usd: 'US$' }[vMoeda()];
    rs.textContent = (atac ? '' : ' · Varejo') + ' · ' + m;
    var d = $('cjDot');
    if (d) d.classList.toggle('in', !cjPadrao());
    var ex = document.querySelector('#vTabBar .trkExtra'),
      cx = $('cjExtra');
    if (ex && cx) {
      cx.textContent = '';
      while (ex.firstChild) cx.appendChild(ex.firstChild);
    }
    // o número da linha rola quando muda
    var pc = document.querySelector('#vInfo .vpcs');
    if (pc && !pc._odo) {
      var n = parseInt(pc.textContent, 10) || 0,
        prev = S._cjN;
      pc._odo = 1;
      pc.innerHTML = '<span class="cjOdo"><span>' + (prev != null && prev !== n ? prev : n) + '</span></span> peças';
      if (prev != null && prev !== n) lfOdo(pc.firstChild, n);
      S._cjN = n;
    }
  }
  // ---- janela ----
  function cjAbre() {
    var D = {
      atac: !tabDe(S.tabAtiva).pub,
      moeda: vMoeda(),
      modo: modoDe('v'),
      tipos: (S.cjF.tipos || []).slice(),
      pub: (S.cjF.pub || []).slice(),
      ate: S.cjF.ate || 0,
      sit: (S.cjF.sit || []).slice().concat(S.vMais ? ['mais'] : []),
      grau: S.vGrau || ''
    };
    var J = lfJanela({
      titulo: 'Ajustes do catálogo',
      cls: 'cjJn',
      extra: '<button type="button" class="cjLimpa" id="cjLimpa">Limpar</button>',
      monta: function (c, J) {
        var tiposL = [['solar', 'Solar'], ['pre', 'Grau'], ['sem', 'Armação']].filter(function (t) {
          return TIPOS.some(function (x) { return x.id === t[0]; });
        });
        TIPOS.forEach(function (x) {
          if (!tiposL.some(function (t) { return t[0] === x.id; })) tiposL.push([x.id, x.label]);
        });
        var mo = function (k) {
            return k === 'pyg' ? 'G$' : k === 'brl' ? 'R$' : 'US$';
          },
          ateTxt = function (v) {
            if (v === 'mais') return 'Mais';
            if (D.moeda === 'pyg') return v / 1000 + ' mil';
            return mo(D.moeda) + ' ' + Math.round(v / ratePyg(D.moeda));
          },
          chip = function (g, v, txt, ico) {
            return '<button type="button" class="chip cjC" data-g="' + g + '" data-v="' + v + '">' + (ico || '') + '<span>' + esc(txt) + '</span></button>';
          };
        c.innerHTML =
          '<div class="cjG2"><div><div class="lbl">Preço</div><div class="trk" id="cjTP"><span class="trkTh"></span><button type="button" class="trkB" data-m="v">Varejo</button><button type="button" class="trkB" data-m="a">Atacado</button></div></div>' +
          '<div><div class="lbl">Moeda</div><div class="trk" id="cjTM"><span class="trkTh"></span><button type="button" class="trkB" data-m="pyg">G$</button><button type="button" class="trkB" data-m="brl">R$</button><button type="button" class="trkB" data-m="usd">US$</button></div></div></div>' +
          '<div class="hint cjMh" id="cjMh"></div>' +
          '<div class="cjVc"><div class="lbl" style="margin:0">Ver como</div><div class="cjVd">' + chip('sit', 'mais', 'Mais vendidos', CJ_ICO.mais) + '<div class="trk cjTV" id="cjTV"><span class="trkTh"></span><button type="button" class="trkB" data-m="g" aria-label="Cartões"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg></button><button type="button" class="trkB" data-m="l" aria-label="Lista"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg></button></div></div></div>' +
          '<div class="lbl">Tipo</div><div class="cjR cjR' + Math.min(4, tiposL.length) + '">' + tiposL.map(function (t) { return chip('tipos', t[0], t[1], CJ_ICO[t[0]]); }).join('') + '</div>' +
          '<div id="cjGr"></div>' +
          '<div class="lbl">Para quem</div><div class="cjR cjR3">' + chip('pub', 'F', 'Feminino', CJ_ICO.F) + chip('pub', 'M', 'Masculino', CJ_ICO.M) + chip('pub', 'U', 'Unissex', CJ_ICO.U) + '</div>' +
          '<div class="lbl">Preço até</div><div class="cjR cjR4" id="cjAte">' + CJ_ATE.map(function (v, i) { return chip('ate', v, ateTxt(v), i === 0 ? CJ_ICO.moeda : ''); }).join('') + '</div>' +
          '<div class="lbl">Situação</div><div class="cjR cjR3">' + chip('sit', 'of', 'Oferta', CJ_ICO.of) + chip('sit', 'nov', 'Novidade', CJ_ICO.nov) + chip('sit', 'enc', 'Encalhada', CJ_ICO.enc) + '</div>' +
          '<div class="cjFt"><button type="button" class="go cjVer" id="cjVer">Ver <span class="cjOdo" id="cjN"><span>0</span></span> peças</button><button type="button" class="mini cjSec" id="cjCanc">Cancelar</button></div>';
        var pinta = function (primeira) {
          trkMarca($('cjTP'), D.atac ? 'a' : 'v');
          trkMarca($('cjTM'), D.moeda);
          trkMarca($('cjTV'), D.modo);
          [].forEach.call(c.querySelectorAll('.cjC'), function (b) {
            var g = b.dataset.g,
              v = g === 'ate' ? (b.dataset.v === 'mais' ? 'mais' : +b.dataset.v) : b.dataset.v,
              on = g === 'ate' ? D.ate === v : D[g].indexOf(v) >= 0;
            if (b.classList.contains('on') !== on) b.classList.toggle('on', on);
          });
          [].forEach.call(c.querySelectorAll('#cjAte .cjC span'), function (s, i) {
            s.textContent = ateTxt(CJ_ATE[i]);
          });
          var mh = $('cjMh');
          mh.textContent = D.moeda === 'pyg' ? '' : 'Câmbio da loja: ' + mo(D.moeda) + ' 1 = ' + gs(Math.round(ratePyg(D.moeda))) + ' · a venda continua em guarani';
          mh.hidden = D.moeda === 'pyg';
          // graus: só quando "Grau" está marcado (o que já existia no app continua)
          var gr = $('cjGr'),
            soPre = D.tipos.length === 1 && D.tipos[0] === 'pre';
          if (!soPre) D.grau = '';
          var gs0 = {};
          if (soPre)
            S.items.forEach(function (i) {
              if (i.tipo === 'pre' && i.grau && i.qty > 0) gs0[i.grau] = 1;
            });
          var gl = Object.keys(gs0).sort(function (a, b) {
            return parseFloat(a) - parseFloat(b);
          });
          gr.innerHTML = soPre && gl.length ? '<div class="lbl">Grau</div><div class="cjGrau">' + gl.map(function (g) { return '<button type="button" class="chip cjGc' + (D.grau === g ? ' on' : '') + '" data-gr="' + esc(g) + '">' + esc(g) + '</button>'; }).join('') + '</div>' : '';
          var n = cjConta({ tipos: D.tipos, pub: D.pub, ate: D.ate, sit: D.sit }, D.grau);
          if (primeira) $('cjN').innerHTML = '<span>' + n + '</span>';
          else lfOdo($('cjN'), n);
        };
        c.addEventListener('click', function (e) {
          var b = e.target.closest('button');
          if (!b) return;
          if (b.classList.contains('trkB')) {
            var t = b.parentNode.id;
            if (t === 'cjTP') D.atac = b.dataset.m === 'a';
            else if (t === 'cjTM') D.moeda = b.dataset.m;
            else if (t === 'cjTV') D.modo = b.dataset.m;
            pinta();
            return;
          }
          if (b.classList.contains('cjC')) {
            var g = b.dataset.g;
            if (g === 'ate') {
              var v = b.dataset.v === 'mais' ? 'mais' : +b.dataset.v;
              D.ate = D.ate === v ? 0 : v;
            } else {
              var i = D[g].indexOf(b.dataset.v);
              if (i >= 0) D[g].splice(i, 1);
              else D[g].push(b.dataset.v);
            }
            pinta();
            return;
          }
          if (b.dataset.gr != null) {
            D.grau = D.grau === b.dataset.gr ? '' : b.dataset.gr;
            pinta();
            return;
          }
          if (b.id === 'cjCanc') J.fecha();
          if (b.id === 'cjVer') {
            cjAplica(D);
            setTimeout(J.fecha, 120);
          }
        });
        setTimeout(function () {
          pinta(true);
        }, 0);
        J._pinta = pinta;
      }
    });
    $('cjLimpa').onclick = function () {
      D.tipos = [];
      D.pub = [];
      D.ate = 0;
      D.sit = [];
      D.grau = '';
      D.atac = false;
      D.moeda = 'pyg';
      J._pinta();
    };
  }
  function cjAplica(D) {
    var era = !tabDe(S.tabAtiva).pub;
    if (D.atac !== era) {
      if (D.atac) S.tabAtiva = S._ultAtac && tabDe(S._ultAtac).on !== false ? S._ultAtac : 'a1';
      else {
        S._ultAtac = S._ultAtacAtual;
        S.tabAtiva = 'pub';
      }
    }
    S.vMoeda = D.moeda;
    if (!S.vModo) S.vModo = {};
    S.vModo.v = D.modo;
    S.cjF = {
      tipos: D.tipos.slice(),
      pub: D.pub.slice(),
      ate: D.ate,
      sit: D.sit.filter(function (k) {
        return k !== 'mais';
      })
    };
    S.vMais = D.sit.indexOf('mais') >= 0;
    S.vTipo = 'all';
    S.vGrau = D.grau || '';
    S.vRef = '';
    S.vSel = null;
    saveSoon();
    render();
  }

  // ===== Produtos: preço (antigo → novo) e canais (site, WhatsApp, loja) em cada produto, avisos de piso e aplicação em grupo. =====
  S.pprice = {}; // código do produto -> { novo, ant } (guaranis). Vazio = vale o preço do tipo.
  S.pcanal = {}; // código do produto -> { site, wpp, loja } (true/false). Sem registro: só a loja.
  S.selMode = false; // selecionando produtos para aplicar preço em grupo
  S.selP = []; // códigos selecionados
  var CANAIS = [
    ['site', '🌐', 'Site', 'lafouch.com'],
    ['wpp', '💬', 'Catálogo WhatsApp', 'lista pronta para enviar'],
    ['loja', '🏪', 'Venda na loja', 'aparece no Caixa']
  ];
  function canalDe(ref) {
    var c = (S.pcanal && S.pcanal[ref]) || {};
    return { site: !!c.site, wpp: !!c.wpp, loja: c.loja !== false };
  }
  function canalSet(ref, k, v) {
    var c = canalDe(ref);
    c[k] = !!v;
    S.pcanal[ref] = c;
  }
  function itemDoRef(ref, tipo) {
    var l = S.items.filter(function (i) {
      return i.ref === ref && (!tipo || i.tipo === tipo);
    });
    return (
      l.filter(function (i) {
        return i.qty > 0;
      })[0] ||
      l[0] ||
      null
    );
  }
  function estoqueDoRef(ref, tipo) {
    return S.items.reduce(function (n, i) {
      return n + (i.ref === ref && (!tipo || i.tipo === tipo) ? i.qty : 0);
    }, 0);
  }
  // Situação do preço de um produto frente à trava e ao piso: 'r' prejuízo, 'w' abaixo do piso, 'o' ok, '' sem dados.
  function pisoDoRef(ref, tipo, precoTeste) {
    var it = itemDoRef(ref, tipo);
    if (!it) return null;
    var pp, p;
    try {
      pp = pisoPeca(it);
      p = precoTeste != null ? precoTeste : tFor(it).price;
    } catch (e) {
      return null;
    }
    if (!(pp.trava > 0) || !(p > 0) || !(pp.piso > 0)) return { st: '', pp: pp, p: p };
    return { st: p < pp.trava ? 'r' : p < pp.piso ? 'w' : 'o', pp: pp, p: p };
  }
  function precoAtual(ref, tipo) {
    var it = itemDoRef(ref, tipo);
    return it ? tFor(it).price : 0;
  }
  var ST_TXT = { o: 'ok', w: 'abaixo do piso', r: 'prejuízo' };

  // Enfeita o cartão de um produto na lista: preço antigo → novo, selos dos canais e aviso de piso.
  function prodDecor(card, ref, tipo) {
    var pr = S.pprice[ref] || {},
      atual = precoAtual(ref, tipo),
      ps = pisoDoRef(ref, tipo),
      cn = canalDe(ref);
    var sel = card.querySelector('.pbox');
    var ch = mk('div', 'zch');
    CANAIS.forEach(function (c) {
      var i = mk('i', cn[c[0]] ? '' : 'off', c[1]);
      i.setAttribute('role', 'button');
      i.setAttribute('aria-label', c[2] + (cn[c[0]] ? ': ligado' : ': desligado'));
      i.onclick = function (e) {
        e.stopPropagation();
        canalSet(ref, c[0], !cn[c[0]]);
        saveSoon();
        render();
      };
      ch.appendChild(i);
    });
    card.appendChild(ch);
    if (atual > 0) {
      var p = mk('div', 'zp');
      p.innerHTML =
        (pr.ant > atual ? '<s>' + gs(pr.ant) + '</s>' : '') + '<span' + (pr.ant > atual ? ' class="of"' : '') + '>' + gs(atual) + '</span>';
      var anchor = card.querySelector('.cell');
      card.insertBefore(p, anchor || null);
    }
    if (ps && ps.st) {
      var b = mk('span', 'zbd ' + ps.st, ps.st === 'o' ? '✓ ok' : ps.st === 'w' ? '⚠ piso ' + gsRaw(ps.pp.piso) : 'custo ' + gsRaw(ps.pp.trava));
      card.appendChild(b);
    }
    if (S.selMode) {
      var on = S.selP.indexOf(ref) >= 0;
      card.classList.toggle('zsel', on);
      if (on) card.appendChild(mk('span', 'zck', '✓'));
    }
  }

  // Cartões “Preço” e “Onde aparece” na ficha do produto.
  function fichaExtra(ref, tipo) {
    var wrap = mk('div', 'col');
    wrap.style.gap = '10px';
    var pr = S.pprice[ref] || {},
      atual = precoAtual(ref, tipo),
      ps = pisoDoRef(ref, tipo),
      cn = canalDe(ref),
      est = estoqueDoRef(ref, tipo);
    var c1 = mk('div', 'zcd');
    c1.appendChild(mk('div', 'lbl', 'Preço'));
    var row = mk('div', '');
    row.style.cssText = 'display:flex;gap:10px';
    function campo(rot, val, key, foco) {
      var d = mk('div', '');
      d.style.flex = '1';
      d.appendChild(mk('div', 'zlb', rot));
      var inp = mk('input', 'in' + (foco ? ' zfoco' : ''));
      inp.setAttribute('inputmode', mpMode());
      inp.value = val > 0 ? gsParaCampo(val) : '';
      inp.placeholder = key === 'ant' ? 'opcional' : gsParaCampo(atual);
      inp.setAttribute('aria-label', rot);
      inp.onchange = function () {
        var v = campoParaGs(inp.value),
          o = S.pprice[ref] || {};
        if (key === 'novo') {
          if (v > 0) o.novo = v;
          else delete o.novo;
        } else if (v > 0) o.ant = v;
        else delete o.ant;
        if (o.novo || o.ant) S.pprice[ref] = o;
        else delete S.pprice[ref];
        saveSoon();
        render();
      };
      d.appendChild(inp);
      return d;
    }
    row.appendChild(campo('PREÇO ANTIGO', pr.ant, 'ant', false));
    row.appendChild(campo('PREÇO NOVO', pr.novo || atual, 'novo', true));
    c1.appendChild(row);
    if (pr.ant > atual && atual > 0) {
      var eco = mk('div', 'zeco', 'Economia de ' + Math.round((1 - atual / pr.ant) * 100) + '% · aparece riscado no site');
      c1.appendChild(eco);
    }
    if (ps && ps.st) {
      var linha = mk('div', '');
      linha.style.marginTop = '8px';
      linha.appendChild(
        mk('span', 'zbd ' + ps.st, ps.st === 'o' ? '✓ acima do piso (' + gs(ps.pp.piso) + ')' : ps.st === 'w' ? '⚠ abaixo do piso (' + gs(ps.pp.piso) + ')' : 'custo ' + gs(ps.pp.trava) + ': dá prejuízo')
      );
      c1.appendChild(linha);
      if (ps.st !== 'o') {
        var bt = btn('chip', 'Usar o piso (' + gs(ps.pp.piso) + ')', function () {
          var o = S.pprice[ref] || {};
          if (!o.ant && atual > ps.pp.piso) o.ant = atual;
          o.novo = ps.pp.piso;
          S.pprice[ref] = o;
          saveSoon();
          render();
        });
        bt.style.marginTop = '8px';
        c1.appendChild(bt);
      }
    }
    wrap.appendChild(c1);
    var c2 = mk('div', 'zcd');
    c2.appendChild(mk('div', 'lbl', 'Onde aparece'));
    CANAIS.forEach(function (c) {
      var l = mk('div', 'zl');
      var t = mk('span', '', c[1] + ' ' + c[2]);
      var sm = mk('small', '', c[0] === 'site' && cn.site && est === 0 ? 'sem estoque: aparece como Esgotado' : c[3]);
      t.appendChild(sm);
      l.appendChild(t);
      var sw = btn('zsw' + (cn[c[0]] ? ' on' : ''), '', function () {
        canalSet(ref, c[0], !cn[c[0]]);
        saveSoon();
        render();
      });
      sw.setAttribute('role', 'switch');
      sw.setAttribute('aria-checked', cn[c[0]] ? 'true' : 'false');
      sw.setAttribute('aria-label', c[2]);
      l.appendChild(sw);
      c2.appendChild(l);
    });
    wrap.appendChild(c2);
    return wrap;
  }

  // ---------- seleção em grupo
  function selAlterna(ref) {
    var i = S.selP.indexOf(ref);
    if (i >= 0) S.selP.splice(i, 1);
    else S.selP.push(ref);
    render();
  }
  function selBarra() {
    var b = $('selBar');
    if (!S.selMode || S.view !== 'estoque') {
      if (b) b.remove();
      return;
    }
    if (!b) {
      b = mk('div', '');
      b.id = 'selBar';
      document.body.appendChild(b);
    }
    b.textContent = '';
    b.appendChild(mk('b', '', S.selP.length ? S.selP.length + ' selecionado(s)' : 'Toque nos produtos'));
    var todos = btn('chip', 'Todos da lista', function () {
      var seen = {};
      Array.from(document.querySelectorAll('#rows .pcard[data-ref]')).forEach(function (c) {
        seen[c.getAttribute('data-ref')] = 1;
      });
      S.selP = Object.keys(seen);
      render();
    });
    b.appendChild(todos);
    var ap = btn('mini', 'Preço e canais…', function () {
      if (S.selP.length) selDialogo();
    });
    ap.disabled = !S.selP.length;
    b.appendChild(ap);
    b.appendChild(
      btn('chip', 'Sair', function () {
        S.selMode = false;
        S.selP = [];
        render();
      })
    );
  }
  function selAplica(refs, novo, ant, site, wpp, modo) {
    var n = 0,
      aj = 0;
    refs.forEach(function (ref) {
      var o = S.pprice[ref] || {},
        cur = precoAtual(ref),
        alvo = novo > 0 ? novo : 0;
      if (alvo > 0) {
        var ps = pisoDoRef(ref, null, alvo);
        if (modo === 'reajustar' && ps && ps.st && ps.st !== 'o') {
          alvo = ps.pp.piso;
          aj++;
        }
        if (ant > 0) o.ant = ant;
        else if (!o.ant && cur > alvo) o.ant = cur;
        o.novo = alvo;
        S.pprice[ref] = o;
        n++;
      }
      if (site !== '') canalSet(ref, 'site', site === '1');
      if (wpp !== '') canalSet(ref, 'wpp', wpp === '1');
    });
    S.selMode = false;
    S.selP = [];
    S.msg = n ? n + ' produto(s) atualizados' + (aj ? ' · ' + aj + ' ajustado(s) ao piso' : '') : 'Canais atualizados';
    saveSoon();
    render();
  }
  function selDialogo() {
    var refs = S.selP.slice(),
      ov = mk('div', 'modal'),
      bx = mk('div', 'modal-box');
    bx.style.maxWidth = '460px';
    ov.appendChild(bx);
    function fecha() {
      ov.remove();
    }
    function tela1() {
      bx.textContent = '';
      bx.appendChild(mk('b', '', 'Aplicar em ' + refs.length + ' produto(s)'));
      var r = mk('div', '');
      r.style.cssText = 'display:flex;gap:10px';
      function cp(rot, ph) {
        var d = mk('div', '');
        d.style.flex = '1';
        d.appendChild(mk('div', 'zlb', rot));
        var i = mk('input', 'in');
        i.setAttribute('inputmode', mpMode());
        i.placeholder = ph;
        i.setAttribute('aria-label', rot);
        d.appendChild(i);
        r.appendChild(d);
        return i;
      }
      var iAnt = cp('PREÇO ANTIGO', 'opcional'),
        iNovo = cp('PREÇO NOVO', 'não mudar');
      bx.appendChild(r);
      function sel(rot) {
        var d = mk('div', '');
        d.appendChild(mk('div', 'zlb', rot));
        var s = mk('select', 'in');
        [['', 'Não mudar'], ['1', 'Mostrar'], ['0', 'Tirar']].forEach(function (o) {
          var op = mk('option', '', o[1]);
          op.value = o[0];
          s.appendChild(op);
        });
        s.setAttribute('aria-label', rot);
        d.appendChild(s);
        bx.appendChild(d);
        return s;
      }
      var sSite = sel('SITE'),
        sWpp = sel('CATÁLOGO WHATSAPP');
      var go = btn('mini', 'Aplicar', function () {
        var novo = campoParaGs(iNovo.value) || 0,
          ant = campoParaGs(iAnt.value) || 0,
          ruins = [];
        if (novo > 0)
          refs.forEach(function (ref) {
            var ps = pisoDoRef(ref, null, novo);
            if (ps && ps.st && ps.st !== 'o') ruins.push([ref, ps]);
          });
        if (!ruins.length) {
          fecha();
          selAplica(refs, novo, ant, sSite.value, sWpp.value, 'direto');
          return;
        }
        tela2(novo, ant, sSite.value, sWpp.value, ruins);
      });
      var cc = btn('chip', 'Cancelar', fecha);
      var ln = mk('div', '');
      ln.style.cssText = 'display:flex;gap:8px;justify-content:flex-end';
      ln.appendChild(cc);
      ln.appendChild(go);
      bx.appendChild(ln);
    }
    function tela2(novo, ant, site, wpp, ruins) {
      bx.textContent = '';
      bx.appendChild(mk('b', '', 'Aplicar ' + gs(novo) + ' em ' + refs.length + ' produto(s)'));
      var h = mk('div', 'zcd');
      h.appendChild(mk('div', 'zalerta', '⚠ ' + ruins.length + ' ficam abaixo do piso'));
      ruins.forEach(function (x) {
        var l = mk('div', 'zl');
        l.appendChild(mk('span', '', (S.pnome && S.pnome[x[0]]) || x[0]));
        l.appendChild(mk('b', x[1].st === 'r' ? 'zr' : 'zw', (x[1].st === 'r' ? 'custo ' + gsRaw(x[1].pp.trava) : 'piso ' + gsRaw(x[1].pp.piso))));
        h.appendChild(l);
      });
      bx.appendChild(h);
      var b1 = btn('mini', 'Reajustar', function () {
        fecha();
        selAplica(refs, novo, ant, site, wpp, 'reajustar');
      });
      var b2 = btn('chip', 'Aplicar mesmo assim', function () {
        fecha();
        selAplica(refs, novo, ant, site, wpp, 'direto');
      });
      var b3 = btn('chip', 'Cancelar', fecha);
      var nota = mk('div', 'hint', 'Reajustar: só os que ficariam abaixo do piso sobem para o piso de cada um; os outros ficam com o preço digitado.');
      bx.appendChild(nota);
      [b1, b2, b3].forEach(function (b) {
        b.style.width = '100%';
        bx.appendChild(b);
      });
    }
    tela1();
    ov.onclick = function (e) {
      if (e.target === ov) fecha();
    };
    document.body.appendChild(ov);
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('#btnSelP');
    if (!t) return;
    S.selMode = !S.selMode;
    S.selP = [];
    if (S.selMode) {
      S.pdMode = false;
      S.det = false;
      S.open = '';
    }
    render();
  });

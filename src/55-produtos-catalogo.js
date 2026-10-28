  // ===== Produtos: preço (antigo → novo) e canais (site, WhatsApp, loja) em cada produto, avisos de piso e aplicação em grupo. =====
  S.pprice = {}; // código do produto -> { novo, ant } (guaranis). Vazio = vale o preço do tipo.
  S.pcanal = {}; // código do produto -> { site, wpp, loja } (true/false). Sem registro: só a loja.
  S.selMode = false; // selecionando produtos para aplicar preço em grupo
  S.selP = []; // códigos selecionados
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
      // vale o pior caso: a cor/grau com estoque de maior custo (a mesma etiqueta vale para todas)
      S.items.forEach(function (x) {
        if (x.ref !== ref || (tipo && x.tipo !== tipo) || x.bulk || !(x.qty > 0)) return;
        var q = pisoPeca(x);
        if (q.trava > pp.trava) {
          pp = q;
          pp.corPior = x.cor + (x.grau ? ' ' + x.grau : '');
        }
      });
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

  // Enfeita o cartão de um produto na lista: preço antigo → novo, selos dos canais e aviso de piso.
  function prodDecor(card, ref, tipo) {
    var pr = S.pprice[ref] || {},
      atual = precoAtual(ref, tipo),
      ps = pisoDoRef(ref, tipo),
      cn = canalDe(ref);
    var sel = card.querySelector('.pbox');
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
    // Cartão Preço: um campo digitável, o botão Oferta e o texto de situação (piso/trava)
    var emOf0 = pr.ant > atual && atual > 0,
      normal = emOf0 ? pr.ant : atual;
    var c1 = mk('div', 'zcd');
    c1.id = 'precoCard';
    c1.appendChild(mk('div', 'lbl', 'Preço'));
    var pin = mk('input', 'in zfoco');
    pin.id = 'pvPreco';
    pin.setAttribute('inputmode', mpMode());
    pin.setAttribute('aria-label', 'Preço do produto');
    pin.value = normal > 0 ? gsParaCampo(normal) : '';
    pin.placeholder = 'Preço';
    pin.onchange = function () {
      var v = campoParaGs(pin.value),
        o = S.pprice[ref] || {};
      if (emOf0) {
        if (v > o.novo) o.ant = v;
      } else if (v > 0) o.novo = v;
      else delete o.novo;
      if (o.novo || o.ant) S.pprice[ref] = o;
      else delete S.pprice[ref];
      saveSoon();
      render();
    };
    c1.appendChild(pin);
    var ob = btn('ofAbreBtn' + (emOf0 ? ' on' : ''), emOf0 ? '% Em oferta · ' + gs(atual) + ' (−' + Math.round((1 - atual / pr.ant) * 100) + '%)' : '% Oferta', function () {
      S.ofOpen = ref;
      render();
    });
    ob.id = 'ofAbre';
    ob.disabled = !(atual > 0);
    c1.appendChild(ob);
    var vTxt = ofertaTexto(ref, atual, ps);
    if (vTxt) {
      var sl = mk('div', 'ofSt ' + vTxt.cl, '');
      sl.id = 'pvSt';
      sl.innerHTML = vTxt.html;
      c1.appendChild(sl);
    }
    wrap.appendChild(c1);
    if (S.ofOpen === ref) wrap.appendChild(ofertaModal(ref, atual, pr, ps));
    // "Liberar para o site" fica logo abaixo, alinhado com os outros cartões
    var sz = mk('div', 'zcd');
    sz.appendChild(siteSwitch(ref));
    wrap.appendChild(sz);
    return wrap;
  }
  // Texto curto da situação do preço frente ao piso e à trava (usado no cartão Preço e na janela Oferta)
  function ofertaTexto(ref, v, ps) {
    var pp = ps && ps.pp ? ps.pp : {},
      piso = pp.piso > 0 ? Math.ceil(pp.piso / 1000) * 1000 : 0,
      trava = pp.trava > 0 ? pp.trava : 0;
    if (!(v > 0)) return null;
    if (!trava || !piso) return { cl: 'o', html: '<div class="ofTx">Sem custo cadastrado: não dá para avisar piso e trava.</div>' };
    var r = pisoDoRef(ref, null, v),
      s2 = r ? r.st : '';
    if (s2 === 'r') return { cl: 'r', html: '<div class="ofHd">Prejuízo · abaixo da trava (' + gs(trava) + ')</div>' };
    if (s2 === 'w') return { cl: 'w', html: '<div class="ofHd">Atenção · abaixo do piso (' + gs(piso) + ')</div>' };
    return { cl: 'o', html: '<div class="ofRow"><span class="ofTag">' + (v <= piso ? 'Na margem' : 'Acima do piso') + '</span><b>lucro ' + gs(v - trava) + ' por peça</b></div>' };
  }

  // ---------- oferta: o Inventário manda; o app avisa piso/trava e publica no catálogo e no site
  function ofertaFim(ref) {
    var o = S.pprice[ref];
    if (!o || !(o.ant > 0)) return;
    o.novo = o.ant;
    delete o.ant;
    delete o.ate;
    if (!o.novo) delete S.pprice[ref];
    saveSoon();
  }
  // Oferta com data final já vencida volta ao preço anterior sozinha (só o dono vê a data; o cliente vê "em oferta").
  function ofertaManut() {
    var ch = false;
    Object.keys(S.pprice || {}).forEach(function (ref) {
      var o = S.pprice[ref];
      if (o && o.ate > 0 && Date.now() > o.ate) {
        ofertaFim(ref);
        ch = true;
      }
    });
    return ch;
  }
  function ofertaModal(ref, atual, pr, ps) {
    var ov = mk('div', 'modal'),
      c = mk('div', 'modal-box ofModal');
    ov.id = 'ofModal';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', 'Oferta');
    ov.appendChild(c);
    c.id = 'ofCard';
    c.style.maxWidth = '460px';
    var fecha = function () {
      S.ofOpen = null;
      render();
    };
    ov.onclick = function (e) {
      if (e.target === ov) fecha();
    };
    var emOf = pr.ant > atual && atual > 0;
    c.appendChild(mk('div', 'lbl', 'Oferta'));
    if (!(atual > 0)) {
      c.appendChild(mk('div', 'hint', 'Defina o preço do produto para poder fazer uma oferta.'));
      return ov;
    }
    var base = emOf ? pr.ant : atual,
      pp = ps && ps.pp ? ps.pp : {},
      piso = pp.piso > 0 ? Math.ceil(pp.piso / 1000) * 1000 : 0,
      trava = pp.trava > 0 ? pp.trava : 0,
      cur = emOf ? atual : Math.round((base * 0.9) / 1000) * 1000;
    var box = mk('div', 'ofBox');
    var l1 = mk('div', 'ofRow');
    l1.appendChild(mk('span', '', 'Preço normal'));
    l1.appendChild(mk('b', '', gs(base)));
    box.appendChild(l1);
    box.appendChild(mk('div', 'ofLb', 'Preço da oferta'));
    var inp = mk('input', 'in ofIn');
    inp.id = 'ofPreco';
    inp.type = 'text';
    inp.inputMode = 'numeric';
    inp.setAttribute('aria-label', 'Preço da oferta');
    inp.value = gs(cur);
    box.appendChild(inp);
    var dsc = mk('div', 'ofDsc', '');
    box.appendChild(dsc);
    c.appendChild(box);
    var chs = mk('div', 'ofChips');
    [5, 10, 15, 20, 25, 30].forEach(function (pc) {
      var cb = btn('chip ofPc', '−' + pc + '%', function () {
        var de = lerV(),
          para = Math.round((base * (1 - pc / 100)) / 1000) * 1000,
          t0 = performance.now();
        // o preço da oferta "conta" do valor de antes até o novo
        if (!de || (window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches)) {
          inp.value = gs(para);
          pinta();
          return;
        }
        (function passo(t) {
          var k = Math.min(1, (t - t0) / 520),
            e = 1 - Math.pow(1 - k, 3);
          inp.value = gs(Math.round(de + (para - de) * e));
          if (k < 1) requestAnimationFrame(passo);
          else pinta();
        })(t0);
        pinta();
      });
      cb.setAttribute('data-pc', pc);
      chs.appendChild(cb);
    });
    c.appendChild(chs);
    var st = mk('div', 'ofSt');
    st.id = 'ofSt';
    c.appendChild(st);
    var ok = btn('go', 'Confirmar oferta', function () {
      var v = lerV();
      if (ok.getAttribute('data-ajusta')) {
        inp.value = gs(piso);
        pinta();
        return;
      }
      if (!(v > 0) || v >= base) return;
      var o = S.pprice[ref] || {};
      o.ant = base;
      o.novo = v;
      S.pprice[ref] = o;
      S.ofOpen = null;
      saveSoon();
      render();
    });
    ok.id = 'ofOk';
    ok.className = 'go ofOk';
    function lerV() {
      return parseInt(String(inp.value).replace(/\D/g, ''), 10) || 0;
    }
    function pinta() {
      var v = lerV(),
        r = v > 0 ? pisoDoRef(ref, null, v) : null,
        s2 = r ? r.st : '',
        pct = v > 0 ? Math.round((1 - v / base) * 100) : 0;
      dsc.textContent = v >= base ? 'A oferta precisa ficar abaixo do preço normal.' : 'Desconto de ' + pct + '%.';
      st.className = 'ofSt ' + (s2 === 'r' ? 'r' : s2 === 'w' ? 'w' : 'o');
      var h = '';
      if (!trava || !piso) h = '<div class="ofTx">Sem custo cadastrado: não dá para avisar piso e trava.</div>';
      else if (s2 === 'r')
        h =
          '<div class="ofHd">Prejuízo · abaixo da trava</div><div class="ofRow"><span>Trava</span><b>' + gs(trava) + '</b></div><div class="ofTx">Esta oferta não cobre a reposição nem as contas. Perda de ' + gs(trava - v) + ' por peça.</div>';
      else if (s2 === 'w')
        h =
          '<div class="ofHd">Atenção · abaixo do piso</div><div class="ofRow"><span>Piso (sua margem)</span><b>' + gs(piso) + '</b></div><div class="ofRow"><span>Trava</span><b>' + gs(trava) + '</b></div><div class="ofTx">Cobre a reposição e as contas, mas fica ' + gs(piso - v) + ' abaixo da margem. Lucro: ' + gs(v - trava) + '.</div>';
      else h = '<div class="ofRow"><span class="ofTag">' + (v <= piso ? 'Na margem' : 'Acima do piso') + '</span><b>lucro ' + gs(v - trava) + ' por peça</b></div>';
      st.innerHTML = h;
      if (s2 === 'r' && piso && piso < base) {
        ok.textContent = 'Ajustar para preço seguro (' + gs(piso) + ')';
        ok.setAttribute('data-ajusta', '1');
      } else {
        ok.textContent = emOf ? 'Atualizar oferta' : 'Confirmar oferta';
        ok.removeAttribute('data-ajusta');
      }
      ok.disabled = !(v > 0) || v >= base;
      Array.prototype.forEach.call(chs.children, function (x) {
        var pc2 = +x.getAttribute('data-pc');
        x.classList.toggle('on', v > 0 && Math.round((base * (1 - pc2 / 100)) / 1000) * 1000 === v);
      });
    }
    inp.addEventListener('input', function () {
      var v = lerV();
      inp.value = v ? gs(v) : '';
      pinta();
    });
    inp.addEventListener('focus', function () {
      try {
        inp.select();
      } catch (e) {}
    });
    pinta();
    c.appendChild(ok);
    var cn2 = btn('chip ofCancel', 'Cancelar', fecha);
    cn2.id = 'ofCancel';
    if (emOf) {
      c.appendChild(mk('div', 'note n-ok', 'Em oferta no app e no site.'));
      var lb = mk('div', 'zlb', 'TERMINA EM (OPCIONAL · SÓ VOCÊ VÊ)');
      lb.style.marginTop = '10px';
      c.appendChild(lb);
      var di = mk('input', 'in');
      di.type = 'date';
      di.id = 'ofAte';
      di.setAttribute('aria-label', 'Data em que a oferta termina');
      if (pr.ate > 0) {
        var d0 = new Date(pr.ate);
        di.value = d0.getFullYear() + '-' + ('0' + (d0.getMonth() + 1)).slice(-2) + '-' + ('0' + d0.getDate()).slice(-2);
      }
      di.onchange = function () {
        var o = S.pprice[ref] || {};
        if (di.value) {
          var p = di.value.split('-');
          o.ate = new Date(+p[0], +p[1] - 1, +p[2], 23, 59, 59).getTime();
        } else delete o.ate;
        S.pprice[ref] = o;
        saveSoon();
        render();
      };
      c.appendChild(di);
      var fim = btn('chip', 'Encerrar oferta (voltar a ' + gs(pr.ant) + ')', function () {
        ofertaFim(ref);
        S.ofOpen = null;
        render();
      });
      fim.id = 'ofFim';
      fim.style.marginTop = '10px';
      c.appendChild(fim);
    }
    c.appendChild(cn2);
    return ov;
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
    var ap = btn('mini', 'Preço…', function () {
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
          selAplica(refs, novo, ant, '', '', 'direto');
          return;
        }
        tela2(novo, ant, '', '', ruins);
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

  // ---------- Catálogo: uma barra de abas com ícone (Vendas · WhatsApp · Site), igual em todas as telas
  function uniIr(qual) {
    S.catOpen = qual === 'w';
    S.repoView = false;
    setView(qual === 's' ? 'onl' : 'vendas');
  }
  function uniOn() {
    return S.view === 'vendas' ? (S.catOpen ? 'w' : 'v') : S.view === 'onl' ? 's' : '';
  }
  var CAT_ICO = {
    v: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 11.5a2 2 0 0 0 2 1.5h7.6a2 2 0 0 0 2-1.5L21 7H6"/>',
    w: '<path stroke-width="1.8" d="M12 2.6a9.4 9.4 0 0 0-8.1 14.2L2.6 21.4l4.9-1.3A9.4 9.4 0 1 0 12 2.6z"/><path fill="currentColor" stroke-width="1.6" transform="translate(6.5 6.3) scale(.46)" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    s: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>'
  };
  function uniAbasFill() {
    ['uniV', 'uniS', 'uniW'].forEach(function (id) {
      var h = $(id);
      if (!h) return;
      var on = uniOn();
      if (h.getAttribute('data-k') === on && h.firstChild) return;
      h.setAttribute('data-k', on);
      h.textContent = '';
      h.className = 'catbar3';
      [['v', 'Vendas'], ['w', 'WhatsApp'], ['s', 'Site']].forEach(function (t) {
        var b = btn('cb3' + (on === t[0] ? ' on' : ''), '', function () {
          uniIr(t[0]);
        }, on === t[0]);
        b.innerHTML =
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          CAT_ICO[t[0]] + '</svg><span>' + t[1] + '</span>';
        h.appendChild(b);
      });
    });
  }

  // ===== Folha da peça (grade de vendas): foto, cores, quantidade e Vender. Subir abre a vitrine; descer fecha. =====
  var _fo = null; // { k, g, it, qty }
  function folhaVars(g) {
    return g.filter(function (x) {
      return x.qty > 0 && gLivre(x) > 0;
    });
  }
  function folhaHtml() {
    var o = _fo,
      it = o.it,
      p = precoTab(it),
      vs = folhaVars(o.g),
      cores = {};
    vs.forEach(function (x) {
      cores[x.cor] = x;
    });
    var ch = Object.keys(cores)
      .map(function (c) {
        var fk = S.fotos[it.ref + '|' + c];
        return '<button type="button" class="vcor' + (c === it.cor ? ' on' : '') + '" data-act="folhacor" data-id="' + esc(c) + '"><span class="vci"' + (fk ? '' : ' style="background:' + hexOf(c) + '"') + '>' + (fk ? '<img alt="" src="' + fk + '">' : '') + '</span><b>' + esc(c === 'Sem cor' ? 'Padrão' : c) + '</b><span class="n">' + gLivre(cores[c]) + ' un.</span></button>';
      })
      .join('');
    var foto = photoOf(it.ref, it.cor) || photoOf(it.ref);
    return (
      '<div class="folha-puxa" aria-hidden="true"></div>' +
      '<div class="folha-top"><div class="folha-img">' + (foto ? '<img alt="" src="' + foto + '">' : '') + '</div><div style="min-width:0"><b class="folha-nm">' + esc(pn(it.ref)) + '</b><div class="hint" style="margin:2px 0">' + esc(it.ref) + (it.cor && it.cor !== 'Sem cor' ? ' · ' + esc(it.cor) : '') + '</div>' + (p ? '<div class="folha-pr">' + pvm(p) + '</div>' : '') + '</div></div>' +
      (Object.keys(cores).length > 1 ? '<div class="vcores" style="margin:10px 0">' + ch + '</div>' : '') +
      '<div class="folha-q"><span class="vstep"><span class="vs-b" role="button" tabindex="0" data-act="folhaq" data-id="-1" aria-label="Menos">−</span><span class="vs-n" id="folhaN">' + o.qty + '</span><span class="vs-b" role="button" tabindex="0" data-act="folhaq" data-id="1" aria-label="Mais">+</span></span><span class="hint" style="margin:0">' + gLivre(it) + ' un. disponíveis</span></div>' +
      '<button type="button" class="btn go" data-act="folhavender" style="width:100%;margin-top:10px">Vender' + (p ? ' · ' + pvm(p * o.qty) : '') + '</button>' +
      '<div class="hint" style="text-align:center;margin:8px 0 0">Deslize para cima para ver a vitrine</div>'
    );
  }
  function folhaDesenha() {
    var antes = lfaSlot('lfa-folha'),
      ov = lfaAbre('lfa-folha', folhaHtml());
    ov.classList.add('lfa-folha');
    if (antes) ov.classList.add('ja'); // já estava aberta: não reinicia a animação
    document.body.classList.add('folhaAberta');
    if (!ov._fora) {
      ov._fora = 1;
    }
    var sh = ov.querySelector('.lfa-sh');
    if (sh && !sh._gest) {
      sh._gest = 1;
    }
    folhaGestos(ov);
  }
  function folhaGestos(ov) {
    var sh = ov.querySelector('.lfa-sh'),
      y0 = 0,
      x0 = 0,
      t0 = 0,
      dy = 0,
      on = false,
      eixo = '';
    if (!sh) return;
    // tocar fora da folha fecha (desce)
    ov.addEventListener('click', function (e) {
      if (e.target === ov) folhaFecha();
    });
    // fundo escuro nunca rola a página
    ov.addEventListener('touchmove', function (e) {
      if (e.target === ov) e.preventDefault();
    }, { passive: false });
    sh.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1 || e.target.closest('input,textarea')) return;
      y0 = e.touches[0].clientY;
      x0 = e.touches[0].clientX;
      t0 = Date.now();
      dy = 0;
      eixo = '';
      on = true;
      sh.style.animation = 'none';
      sh.style.transition = 'none';
    }, { passive: true });
    sh.addEventListener('touchmove', function (e) {
      if (!on) return;
      var y = e.touches[0].clientY - y0,
        x = e.touches[0].clientX - x0;
      if (!eixo && (Math.abs(x) > 8 || Math.abs(y) > 8)) eixo = Math.abs(y) >= Math.abs(x) ? 'y' : 'x';
      if (eixo !== 'y') return;
      if (e.cancelable) e.preventDefault();
      dy = y;
      // descer acompanha o dedo; subir tem resistência
      var ty = y > 0 ? y : -Math.min(90, Math.pow(-y, 0.8) * 2.2);
      sh.style.transform = 'translate3d(0,' + Math.round(ty) + 'px,0)';
      ov.style.background = 'rgba(0,0,0,' + (0.62 * (1 - Math.min(1, Math.max(0, y) / 420))).toFixed(3) + ')';
    }, { passive: false });
    function solta() {
      if (!on) return;
      on = false;
      if (eixo !== 'y') {
        sh.style.transition = '';
        return;
      }
      var v = dy / Math.max(1, Date.now() - t0); // px/ms
      ov.style.background = '';
      if (dy < -50 || v < -0.5) {
        sh.style.transition = 'transform .2s cubic-bezier(.4,0,.2,1)';
        sh.style.transform = 'translate3d(0,-40px,0)';
        setTimeout(folhaVitrine, REDUCED ? 0 : 140);
      } else if (dy > 110 || v > 0.6) {
        sh.style.transition = 'transform .24s cubic-bezier(.4,0,.2,1)';
        sh.style.transform = 'translate3d(0,105%,0)';
        ov.style.transition = 'background .24s';
        ov.style.background = 'rgba(0,0,0,0)';
        setTimeout(folhaFecha, REDUCED ? 0 : 200);
      } else {
        sh.style.transition = 'transform .3s var(--mola,cubic-bezier(.2,1.25,.35,1))';
        sh.style.transform = '';
      }
    }
    sh.addEventListener('touchend', solta);
    sh.addEventListener('touchcancel', solta);
  }
  function folhaAbre(k, g) {
    var vs = folhaVars(g);
    if (!vs.length) return false;
    _fo = { k: k, g: g, it: vs[0], qty: 1 };
    folhaDesenha();
    return true;
  }
  function folhaFecha() {
    _fo = null;
    document.body.classList.remove('folhaAberta');
    lfaFecha('lfa-folha');
  }
  function folhaVitrine() {
    if (!_fo) return;
    var k = _fo.k;
    folhaFecha();
    S.vRef = k;
    S.vSel = null;
    S.qty = 1;
    S.msg = '';
    S.detRow = null;
    S.detCor = '';
    render();
    window.scrollTo(0, 0);
  }
  ACT.folhacor = function (c) {
    if (!_fo) return;
    var v = folhaVars(_fo.g).filter(function (x) {
      return x.cor === c;
    })[0];
    if (v) {
      _fo.it = v;
      _fo.qty = Math.min(_fo.qty, gLivre(v));
      folhaDesenha();
    }
  };
  ACT.folhaq = function (d) {
    if (!_fo) return;
    var antes = _fo.qty;
    _fo.qty = Math.max(1, Math.min(gLivre(_fo.it), _fo.qty + (+d || 0)));
    if (_fo.qty === antes) return;
    // atualiza no lugar: o número rola e o preço conta, sem redesenhar a folha
    var n = $('folhaN'),
      bt = document.querySelector('#lfa-folha [data-act="folhavender"]'),
      p = precoTab(_fo.it),
      alvo = p * _fo.qty,
      de = p * antes;
    if (n) {
      n.textContent = _fo.qty;
      if (!REDUCED && n.animate) n.animate([{ transform: 'translateY(' + (_fo.qty > antes ? 14 : -14) + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 280, easing: 'cubic-bezier(.4,0,.2,1)' });
    }
    if (bt && p) {
      var t0 = Date.now(),
        dur = REDUCED ? 0 : 280,
        passo = function () {
          var f = dur ? Math.min(1, (Date.now() - t0) / dur) : 1;
          bt.textContent = 'Vender · ' + pvm(de + (alvo - de) * f);
          if (f < 1) requestAnimationFrame(passo);
        };
      passo();
    }
  };
  ACT.folhavender = function () {
    if (!_fo) return;
    var it = _fo.it,
      q = _fo.qty,
      img = document.querySelector('#lfa-folha .folha-img img');
    folhaFecha();
    S._vsel = it;
    S.qty = q;
    window.__voaSrc = img;
    $('sCartAdd').click();
  };
  window.__folha = { abre: folhaAbre, vitrine: folhaVitrine, fecha: folhaFecha };

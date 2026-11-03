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
      '<div class="folha-top"><div class="folha-img">' + (foto ? '<img alt="" src="' + foto + '">' : '') + '</div><div style="min-width:0"><b class="folha-nm">' + esc(pn(it.ref)) + '</b><div class="hint" style="margin:2px 0">' + esc(it.ref) + (it.cor && it.cor !== 'Sem cor' ? ' · ' + esc(it.cor) : '') + '</div>' + (p ? '<div class="folha-pr">' + gs(p) + '</div>' : '') + '</div></div>' +
      (Object.keys(cores).length > 1 ? '<div class="vcores" style="margin:10px 0">' + ch + '</div>' : '') +
      '<div class="folha-q"><span class="vstep"><span class="vs-b" role="button" tabindex="0" data-act="folhaq" data-id="-1" aria-label="Menos">−</span><span class="vs-n" id="folhaN">' + o.qty + '</span><span class="vs-b" role="button" tabindex="0" data-act="folhaq" data-id="1" aria-label="Mais">+</span></span><span class="hint" style="margin:0">' + gLivre(it) + ' un. disponíveis</span></div>' +
      '<button type="button" class="btn" data-act="folhavender" style="width:100%;margin-top:10px">Vender' + (p ? ' · ' + gs(p * o.qty) : '') + '</button>' +
      '<div class="hint" style="text-align:center;margin:8px 0 0">Deslize para cima para ver a vitrine</div>'
    );
  }
  function folhaDesenha() {
    var ov = lfaAbre('lfa-folha', folhaHtml());
    ov.classList.add('lfa-folha');
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
      dy = 0,
      on = false;
    ov.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      y0 = e.touches[0].clientY;
      x0 = e.touches[0].clientX;
      dy = 0;
      on = true;
    }, { passive: true });
    ov.addEventListener('touchmove', function (e) {
      if (!on) return;
      var y = e.touches[0].clientY - y0,
        x = e.touches[0].clientX - x0;
      if (Math.abs(x) > Math.abs(y)) {
        on = false;
        return;
      }
      dy = y;
      if (y > 0 && sh) {
        sh.style.transition = 'none';
        sh.style.transform = 'translateY(' + Math.round(y * 0.8) + 'px)';
      }
    }, { passive: true });
    ov.addEventListener('touchend', function () {
      if (!on) return;
      on = false;
      if (sh) {
        sh.style.transition = 'transform .22s';
        sh.style.transform = '';
      }
      if (dy < -60) folhaVitrine();
      else if (dy > 90) folhaFecha();
    });
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
    _fo.qty = Math.max(1, Math.min(gLivre(_fo.it), _fo.qty + (+d || 0)));
    folhaDesenha();
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

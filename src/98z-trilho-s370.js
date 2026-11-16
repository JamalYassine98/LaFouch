  // ===== S370 (16/11/2026) — lote 8: trilho que ARRASTA (regra do dono, 15/11/2026) =====
  // Todo seletor em trilho (.trk com a pílula .trkTh e os botões .trkB) aceita o dedo (ou o mouse) arrastando a pílula,
  // além do toque. Ao soltar, vale o botão mais perto (o mesmo clique de sempre, então cada tela continua igual).
  // A pílula anda só com transform. Ainda NÃO cobertos: abas em linha (.lfAbas) e as pílulas do site.
  (function () {
    var D = null, sup = 0;
    // trilhos (.trk/.trkTh/.trkB) e barras com pílula permanente (#eTabs: .lfPill/.chip)
    // (as abas em linha do Inventário rolam para o lado com o dedo: ficam só com o toque, senão o arrasto brigaria com a rolagem)
    var TIPOS = [{ box: '.trk', th: '.trkTh', b: '.trkB', dx: -3 }];
    function botoes(trk, t) {
      return [].filter.call(trk.querySelectorAll(t.b), function (b) { return b.offsetWidth > 0 && !b.disabled; });
    }
    function poe(d, x) { d.th.style.transform = 'translate(' + x + 'px,' + d.ty + 'px)'; }
    document.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      if (S.modoCli || !e.target.closest) return;
      var t = null, trk = null;
      TIPOS.forEach(function (x) { if (!trk) { var k = e.target.closest(x.box); if (k && k.querySelector(x.th)) { trk = k; t = x; } } });
      if (!trk) return;
      var L = botoes(trk, t);
      if (L.length < 2) return;
      var on = L.filter(function (b) { return b.classList.contains('on'); })[0] || L[0];
      D = { t: t, trk: trk, th: trk.querySelector(t.th), L: L, x0: e.clientX, y0: e.clientY, base: on.offsetLeft + t.dx, ty: t.dx ? 0 : on.offsetTop, w: on.offsetWidth, ativo: false, id: e.pointerId };
    }, true);
    document.addEventListener('pointermove', function (e) {
      if (!D || e.pointerId !== D.id) return;
      var dx = e.clientX - D.x0, dy = e.clientY - D.y0;
      if (!D.ativo) {
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { D = null; return; } // é rolagem da tela
        if (Math.abs(dx) < 7) return;
        D.ativo = true;
        D.th.style.transition = 'none';
        D.th.getAnimations && D.th.getAnimations().forEach(function (a) { a.cancel(); });
        D.trk.classList.add('trkArr');
      }
      var min = D.L[0].offsetLeft + D.t.dx, ult = D.L[D.L.length - 1], max = ult.offsetLeft + D.t.dx + ult.offsetWidth - D.w,
        x = Math.max(min, Math.min(max, D.base + dx));
      if (D.t.dx) D.th.style.transform = 'translateX(' + x + 'px)';
      else poe(D, x);
      e.preventDefault();
    }, true);
    function fim(e) {
      if (!D) return;
      var d = D;
      D = null;
      if (!d.ativo) return;
      sup = Date.now();
      d.trk.classList.remove('trkArr');
      d.th.style.transition = '';
      var m = /translate(?:X)?\(([-\d.]+)px/.exec(d.th.style.transform || ''),
        cx = (m ? +m[1] : d.base) - d.t.dx + d.w / 2,
        best = d.L[0], bd = 1e9;
      d.L.forEach(function (b) {
        var c = b.offsetLeft + b.offsetWidth / 2, k = Math.abs(c - cx);
        if (k < bd) { bd = k; best = b; }
      });
      if (best.classList.contains('on')) {
        if (d.t.dx) { d.th.style.transform = 'translateX(' + (best.offsetLeft - 3) + 'px)'; d.th.style.width = best.offsetWidth + 'px'; }
        else poe(d, best.offsetLeft);
      } else best.click();
      try { vibrar(8); } catch (x) {}
    }
    document.addEventListener('pointerup', fim, true);
    document.addEventListener('pointercancel', function () { if (D && D.ativo) { D.trk.classList.remove('trkArr'); D.th.style.transition = ''; var on = D.L.filter(function (b) { return b.classList.contains('on'); })[0]; if (on) { if (D.t.dx) D.th.style.transform = 'translateX(' + (on.offsetLeft - 3) + 'px)'; else poe(D, on.offsetLeft); } } D = null; }, true);
    // o clique que o navegador manda depois de arrastar não pode escolher outra opção
    document.addEventListener('click', function (e) {
      if (Date.now() - sup < 350 && e.isTrusted && e.target.closest && e.target.closest('.trk,.lfPillOn')) { e.stopPropagation(); e.preventDefault(); }
    }, true);
  })();

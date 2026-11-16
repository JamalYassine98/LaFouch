  // ===== S370 (16/11/2026) — lote 8: trilho que ARRASTA (regra do dono, 15/11/2026) =====
  // Todo seletor em trilho (.trk com a pílula .trkTh e os botões .trkB) aceita o dedo (ou o mouse) arrastando a pílula,
  // além do toque. Ao soltar, vale o botão mais perto (o mesmo clique de sempre, então cada tela continua igual).
  // A pílula anda só com transform. Ainda NÃO cobertos: abas em linha (.lfAbas) e as pílulas do site.
  (function () {
    var D = null, sup = 0;
    function botoes(trk) {
      return [].filter.call(trk.querySelectorAll('.trkB'), function (b) { return b.offsetWidth > 0 && !b.disabled; });
    }
    document.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      var trk = e.target.closest && e.target.closest('.trk');
      if (!trk || !trk.querySelector('.trkTh') || S.modoCli) return;
      var L = botoes(trk);
      if (L.length < 2) return;
      var on = trk.querySelector('.trkB.on') || L[0];
      D = { trk: trk, th: trk.querySelector('.trkTh'), L: L, x0: e.clientX, y0: e.clientY, base: on.offsetLeft - 3, w: on.offsetWidth, ativo: false, id: e.pointerId };
    }, true);
    document.addEventListener('pointermove', function (e) {
      if (!D || e.pointerId !== D.id) return;
      var dx = e.clientX - D.x0, dy = e.clientY - D.y0;
      if (!D.ativo) {
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { D = null; return; } // é rolagem da tela
        if (Math.abs(dx) < 7) return;
        D.ativo = true;
        D.th.style.transition = 'width .2s var(--lux-in,cubic-bezier(.16,1,.3,1))';
        D.trk.classList.add('trkArr');
      }
      var min = D.L[0].offsetLeft - 3, ult = D.L[D.L.length - 1], max = ult.offsetLeft - 3 + ult.offsetWidth - D.w,
        x = Math.max(min, Math.min(max, D.base + dx));
      D.th.style.transform = 'translateX(' + x + 'px)';
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
      var m = /translateX\(([-\d.]+)px\)/.exec(d.th.style.transform || ''),
        cx = (m ? +m[1] : d.base) + 3 + d.w / 2,
        best = d.L[0], bd = 1e9;
      d.L.forEach(function (b) {
        var c = b.offsetLeft + b.offsetWidth / 2, k = Math.abs(c - cx);
        if (k < bd) { bd = k; best = b; }
      });
      if (best.classList.contains('on')) {
        d.th.style.transform = 'translateX(' + (best.offsetLeft - 3) + 'px)';
        d.th.style.width = best.offsetWidth + 'px';
      } else best.click();
      try { vibrar(8); } catch (x) {}
    }
    document.addEventListener('pointerup', fim, true);
    document.addEventListener('pointercancel', function () { if (D && D.ativo) { D.trk.classList.remove('trkArr'); D.th.style.transition = ''; var on = D.trk.querySelector('.trkB.on'); if (on) D.th.style.transform = 'translateX(' + (on.offsetLeft - 3) + 'px)'; } D = null; }, true);
    // o clique que o navegador manda depois de arrastar não pode escolher outra opção
    document.addEventListener('click', function (e) {
      if (Date.now() - sup < 350 && e.isTrusted && e.target.closest && e.target.closest('.trk')) { e.stopPropagation(); e.preventDefault(); }
    }, true);
  })();

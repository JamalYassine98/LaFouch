  // ===== Sistema de botões (v407): ícones, aviso com Desfazer e confirmação no próprio botão. =====
  // Aviso com "Desfazer" (4,5 s). fn roda se a pessoa tocar em Desfazer.
  function lfDesfazer(msg, fn, ms) {
    var e = $('lfDesf');
    if (!e) {
      e = document.createElement('div');
      e.id = 'lfDesf';
      e.setAttribute('role', 'status');
      e.innerHTML = '<span></span><button type="button">Desfazer</button>';
      document.body.appendChild(e);
      e.lastChild.onclick = function () {
        var f = lfDesfazer.fn;
        lfDesfazer.fn = null;
        e.classList.remove('on');
        if (f) f();
      };
    }
    e.firstChild.textContent = msg;
    lfDesfazer.fn = fn;
    e.classList.remove('on');
    void e.offsetWidth;
    e.classList.add('on');
    clearTimeout(lfDesfazer.t);
    lfDesfazer.t = setTimeout(function () {
      e.classList.remove('on');
      lfDesfazer.fn = null;
    }, ms || 4500);
  }
  (function () {
    var w = $('vWa');
    if (w) w.innerHTML = ICO.wa;
  })();
  // Caixa: tocar fora do menu fecha; a gaveta fecha deslizando no risco.
  document.addEventListener('click', function (e) {
    if (S.cxMenu && S.view === 'caixa' && !(e.target.closest && e.target.closest('.cxMenu,#cxIc'))) {
      S.cxMenu = false;
      renderCaixa();
    }
  });
  (function () {
    var y0 = 0,
      dy = 0,
      sh = null;
    document.addEventListener(
      'touchstart',
      function (e) {
        var p = e.target.closest && e.target.closest('.cxPuxa');
        sh = p ? p.parentNode : null;
        if (sh) {
          y0 = e.touches[0].clientY;
          dy = 0;
        }
      },
      { passive: true }
    );
    document.addEventListener(
      'touchmove',
      function (e) {
        if (!sh) return;
        dy = e.touches[0].clientY - y0;
        if (dy > 0) {
          sh.style.animation = 'none';
          sh.style.transition = 'none';
          sh.style.transform = 'translateY(' + Math.round(dy * 0.8) + 'px)';
        }
      },
      { passive: true }
    );
    document.addEventListener('touchend', function () {
      if (!sh) return;
      var s = sh;
      sh = null;
      if (dy > 80) ACT.cxfecha();
      else {
        s.style.transition = 'transform .22s';
        s.style.transform = '';
      }
    });
  })();

  // ===== Troca de aba: o conteúdo novo sempre entra animado (Inventário, Catálogo, Histórico...). =====
  (function () {
    var BARRAS = '#eTabs, .tabs, .mpill';
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('#eTabs button, .tabs button.tab, .mpill button');
      if (!b || REDUCED) return;
      var barra = b.closest(BARRAS) || b,
        view = b.closest('.view');
      if (!view) return;
      var bs = [].slice.call(barra.querySelectorAll('button')),
        i = bs.indexOf(b),
        dir = i < 0 ? 1 : i === 0 ? -1 : 1;
      requestAnimationFrame(function () {
        [].slice.call(view.children).forEach(function (c, n) {
          if (c.hidden || c.contains(barra) || c === barra || !c.animate) return;
          c.animate(
            [
              { opacity: 0, transform: 'translate3d(' + 18 * dir + 'px,0,0)' },
              { opacity: 1, transform: 'none' }
            ],
            { duration: 280, delay: Math.min(n, 4) * 25, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }
          );
        });
      });
    });
  })();

  // ===== Barras de abas/segmentos: UMA animação só — a pílula desliza do botão antigo para o novo. =====
  (function () {
    var ULT = {};
    // S370 (lote 8, regra lógica da pílula aprovada 15/11): UMA pílula permanente por barra (nunca criada e apagada a cada troca),
    // medida sempre do botão escolhido, andando só com transform (deslocar + esticar); o botão escolhido não tem fundo próprio.
    function pilula(box) {
      var on = box.querySelector(':scope > .on');
      if (!on || !on.offsetWidth) return;
      var id = box.id,
        r = { l: on.offsetLeft, t: on.offsetTop, w: on.offsetWidth, h: on.offsetHeight },
        a = ULT[id],
        pl = box.querySelector(':scope > .lfPill');
      ULT[id] = r;
      if (!pl) {
        pl = document.createElement('div');
        pl.className = 'lfPill';
        pl.setAttribute('aria-hidden', 'true');
      }
      if (box.firstChild !== pl) box.insertBefore(pl, box.firstChild);
      box.classList.add('lfPillOn');
      pl.style.cssText = 'left:0;top:0;width:' + r.w + 'px;height:' + r.h + 'px;transform-origin:0 0;transform:translate(' + r.l + 'px,' + r.t + 'px)';
      if (!a || REDUCED || (a.l === r.l && a.t === r.t && a.w === r.w) || !pl.animate) return;
      pl.animate([{ transform: 'translate(' + a.l + 'px,' + a.t + 'px) scaleX(' + (a.w / r.w).toFixed(4) + ')' }, { transform: 'translate(' + r.l + 'px,' + r.t + 'px)' }], { duration: 300, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
    ['eTabs'].forEach(function (id) {
      var box = document.getElementById(id);
      if (!box) return;
      new MutationObserver(function (m) {
        if (m.some(function (x) { return [].some.call(x.addedNodes, function (n) { return n.classList && !n.classList.contains('lfPill'); }); })) pilula(box);
      }).observe(box, { childList: true });
    });
  })();

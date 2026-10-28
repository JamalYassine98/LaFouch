  // ===== Gestos na ficha do produto (Inventário): arrastar a ficha troca de produto; arrastar a foto troca de cor. =====
  (function () {
    var det = $('detail');
    if (!det) return;
    var X0 = 0,
      Y0 = 0,
      T0 = 0,
      modo = '',
      alvo = null,
      dx = 0,
      vivo = false;
    function rolavel(el) {
      // dentro de uma lista que rola de lado (cores em cartões etc.) o arrastar é dela
      while (el && el !== det) {
        if (el.scrollWidth > el.clientWidth + 2) {
          var ov = getComputedStyle(el).overflowX;
          if (ov === 'auto' || ov === 'scroll') return true;
        }
        el = el.parentNode;
      }
      return false;
    }
    function refs() {
      return Array.prototype.map.call(document.querySelectorAll('#rows .pcard[data-ref]'), function (c) {
        return c.getAttribute('data-ref');
      });
    }
    function podeIr(dir) {
      if (modo === 'cor') {
        var g = (S._gestoCor && S._gestoCor.gal) || [];
        if (g.length < 2) return false;
        var i = g.indexOf(S._gestoCor.atual);
        return dir > 0 ? i < g.length - 1 : i > 0;
      }
      var r = refs(),
        k = r.indexOf(S.open);
      return k >= 0 && (dir > 0 ? k < r.length - 1 : k > 0);
    }
    function vai(dir) {
      if (modo === 'cor') {
        var g = S._gestoCor.gal,
          i = g.indexOf(S._gestoCor.atual);
        S._gestoCor.pick(g[i + dir]);
        return;
      }
      var r = refs(),
        k = r.indexOf(S.open);
      S.open = r[k + dir];
      S._semAnimFicha = true;
      S.det = true;
      S.selItem = null;
      S.detCor = '';
      S.detVr = null;
      S.detRow = null;
      S.qty = 1;
      S.msg = '';
      render();
    }
    function limpa(el, anim) {
      if (!el) return;
      el.style.transition = anim ? 'transform .26s cubic-bezier(.2,.8,.2,1),opacity .26s' : 'none';
      el.style.transform = '';
      el.style.opacity = '';
    }
    det.addEventListener(
      'touchstart',
      function (e) {
        modo = '';
        vivo = false;
        if (S.view !== 'estoque' || !S.det || e.touches.length !== 1) return;
        var t = e.target;
        if (t.closest && t.closest('input,textarea,select,.modal,#editModal,#ofModal,button.fseta')) return;
        if (rolavel(t)) return;
        X0 = e.touches[0].clientX;
        Y0 = e.touches[0].clientY;
        T0 = Date.now();
        dx = 0;
        modo = t.closest && t.closest('.pbox') ? 'cor' : 'prod';
        alvo = modo === 'cor' ? t.closest('.pbox') : det;
      },
      { passive: true }
    );
    det.addEventListener(
      'touchmove',
      function (e) {
        if (!modo) return;
        var x = e.touches[0].clientX - X0,
          y = e.touches[0].clientY - Y0;
        if (!vivo) {
          if (Math.abs(x) < 10 && Math.abs(y) < 10) return;
          if (Math.abs(x) < Math.abs(y) * 1.5) {
            modo = ''; // era rolagem
            return;
          }
          vivo = true;
        }
        dx = x;
        // a folha acompanha o dedo; nas pontas ela resiste (elástico)
        var f = podeIr(x < 0 ? 1 : -1) ? 1 : 0.28;
        alvo.style.transition = 'none';
        alvo.style.transform = 'translateX(' + Math.round(x * f) + 'px)';
        alvo.style.opacity = String(1 - Math.min(0.35, (Math.abs(x) * f) / 600));
      },
      { passive: true }
    );
    function fim() {
      if (!modo || !vivo) {
        modo = '';
        return;
      }
      var dir = dx < 0 ? 1 : -1,
        rapido = Math.abs(dx) / Math.max(1, Date.now() - T0) > 0.5,
        passa = (Math.abs(dx) > (alvo.offsetWidth || 300) * 0.3 || (rapido && Math.abs(dx) > 40)) && podeIr(dir),
        el = alvo,
        m = modo;
      modo = '';
      vivo = false;
      if (!passa) {
        limpa(el, true);
        return;
      }
      var out = dir > 0 ? '-110%' : '110%',
        inn = dir > 0 ? '110%' : '-110%';
      el.style.transition = 'transform .2s ease-in,opacity .2s';
      el.style.transform = 'translateX(' + out + ')';
      el.style.opacity = '0';
      setTimeout(function () {
        modo = m;
        vai(dir);
        modo = '';
        var novo = m === 'cor' ? document.querySelector('#detail .pbox') : det;
        if (!novo) return;
        novo.style.transition = 'none';
        novo.style.transform = 'translateX(' + inn + ')';
        novo.style.opacity = '0';
        void novo.offsetWidth;
        limpa(novo, true);
      }, 190);
    }
    det.addEventListener('touchend', fim);
    det.addEventListener('touchcancel', function () {
      if (alvo) limpa(alvo, true);
      modo = '';
      vivo = false;
    });
  })();

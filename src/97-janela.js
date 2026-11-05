  // ===== Janela de baixo (v427, animações novas aprovadas 05/11/2026) =====
  // Sobe com mola; arrastar pela alça ou pelo topo acompanha o dedo (o fundo clareia junto):
  // soltar depois de 1/3 da altura (ou num gesto rápido) fecha, senão volta. Tocar fora fecha.
  // Fica fora das abas (no <body>), então o redesenho do app não a apaga.
  function lfJanela(o) {
    var bk = document.createElement('div'),
      jn = document.createElement('div');
    bk.className = 'ljBk';
    jn.className = 'ljJn' + (o.cls ? ' ' + o.cls : '');
    jn.setAttribute('role', 'dialog');
    jn.setAttribute('aria-modal', 'true');
    if (o.titulo) jn.setAttribute('aria-label', o.titulo);
    jn.innerHTML = '<div class="ljPuxa" aria-hidden="true"></div>' + (o.titulo ? '<div class="ljHd"><b>' + esc(o.titulo) + '</b>' + (o.extra || '') + '</div>' : '') + '<div class="ljCorpo"></div>';
    document.body.appendChild(bk);
    document.body.appendChild(jn);
    var corpo = jn.querySelector('.ljCorpo'),
      aberta = true,
      H = function () {
        return jn.offsetHeight || 400;
      },
      pos = function (y, anim) {
        jn.classList.toggle('anim', !!anim);
        bk.classList.toggle('anim', !!anim);
        jn.style.transform = 'translateY(' + y + 'px)';
        bk.style.opacity = String(0.5 * Math.max(0, 1 - y / H()));
      };
    var api = {
      jn: jn,
      corpo: corpo,
      fecha: function () {
        if (!aberta) return;
        aberta = false;
        pos(H() + 30, !REDUCED);
        bk.style.pointerEvents = 'none';
        setTimeout(function () {
          bk.remove();
          jn.remove();
        }, REDUCED ? 0 : 380);
        if (o.aoFechar) o.aoFechar();
      }
    };
    if (o.monta) o.monta(corpo, api);
    pos(H() + 30, false);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        pos(0, !REDUCED);
      });
    });
    bk.onclick = api.fecha;
    // arrastar para baixo: só pela alça e pelo título (o resto da janela rola normal)
    var y0 = null,
      dy = 0,
      t0 = 0;
    jn.addEventListener('pointerdown', function (e) {
      if (!e.target.closest('.ljPuxa,.ljHd') || e.target.closest('button,a,input')) return;
      y0 = e.clientY;
      dy = 0;
      t0 = Date.now();
      try {
        jn.setPointerCapture(e.pointerId);
      } catch (er) {}
    });
    jn.addEventListener('pointermove', function (e) {
      if (y0 == null) return;
      dy = e.clientY - y0;
      pos(dy > 0 ? dy : dy * 0.15, false);
    });
    var solta = function () {
      if (y0 == null) return;
      var v = dy / Math.max(1, Date.now() - t0);
      y0 = null;
      if (dy > H() / 3 || v > 0.6) api.fecha();
      else pos(0, !REDUCED);
    };
    jn.addEventListener('pointerup', solta);
    jn.addEventListener('pointercancel', solta);
    return api;
  }
  // Número que rola como contador quando muda (animação nova).
  function lfOdo(el, n) {
    if (!el) return;
    var txt = String(n),
      cur = el.lastElementChild;
    if (!cur) {
      el.innerHTML = '<span>' + txt + '</span>';
      return;
    }
    if (cur.textContent === txt) return;
    if (REDUCED) {
      el.innerHTML = '<span>' + txt + '</span>';
      return;
    }
    var up = parseFloat(cur.textContent.replace(/\./g, '')) < n,
      nv = document.createElement('span');
    nv.textContent = txt;
    nv.style.cssText = 'position:absolute;left:0;top:0;transform:translateY(' + (up ? 100 : -100) + '%)';
    el.appendChild(nv);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        cur.style.transform = 'translateY(' + (up ? -100 : 100) + '%)';
        nv.style.transform = 'translateY(0)';
      });
    });
    setTimeout(function () {
      if (cur.parentNode) cur.remove();
      nv.style.position = 'relative';
    }, 380);
  }

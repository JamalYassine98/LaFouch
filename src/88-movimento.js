  // ===== Movimento: animações leves (opacidade e escala), desligadas se o aparelho pedir menos movimento. =====
  // Vibração curta (toque de confirmação), se o aparelho permitir.
  function vibrar(ms) {
    try {
      if (!REDUCED && navigator.vibrate) navigator.vibrate(ms);
    } catch (e) {}
  }
  // Anima um número de 0 até o valor (conta subindo).
  function contaSubindo(el, ate, fmt, ms) {
    if (REDUCED || !el || !(Math.abs(ate) > 0)) return;
    var t0 = performance.now();
    ms = ms || 700;
    function passo(t) {
      var k = Math.min(1, (t - t0) / ms),
        e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(Math.round(ate * e));
      if (k < 1) requestAnimationFrame(passo);
      else el.textContent = fmt(ate);
    }
    requestAnimationFrame(passo);
  }
  // Marca de "ok" que se desenha dentro de um cartão (venda concluída).
  function marcaOk(host) {
    if (!host) return;
    var velho = host.querySelector('.okck');
    if (velho) velho.remove();
    var d = document.createElement('div');
    d.className = 'okck';
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML =
      '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    host.style.position = 'relative';
    host.appendChild(d);
  }
  // Flash branco rápido sobre a imagem da câmera ao tirar a foto.
  function flashCamera(host) {
    if (!host) return;
    vibrar(18);
    if (REDUCED) return;
    var f = document.createElement('div');
    f.style.cssText = 'position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:5;animation:camflash .28s ease-out';
    host.appendChild(f);
    setTimeout(function () {
      f.remove();
    }, 320);
  }
  // Janelas e cartões que aparecem (atributo hidden removido) entram com movimento.
  (function () {
    if (REDUCED || !window.MutationObserver) return;
    var ok = /(^|\s)(card|modal|note)(\s|$)/;
    new MutationObserver(function (lista) {
      lista.forEach(function (m) {
        var el = m.target;
        if (m.oldValue === null || el.hidden || el.id === 'lockScr') return;
        if (/(^|\s)modal(\s|$)/.test(el.className)) {
          var bx = el.querySelector('.modal-box');
          el.classList.remove('fadein');
          void el.offsetWidth;
          el.classList.add('fadein');
          if (bx) {
            bx.classList.remove('popin');
            void bx.offsetWidth;
            bx.classList.add('popin');
          }
        } else if (ok.test(el.className) || /^(detail|vDetail|vSaleCard|splitCard|contCard)$/.test(el.id)) animEnter(el);
      });
    }).observe(document.body, { attributes: true, attributeFilter: ['hidden'], attributeOldValue: true, subtree: true });
  })();

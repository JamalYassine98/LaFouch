  // ===== v469 (aprovado 08/11): trava única de rolagem =====
  // Qualquer janela aberta (foto ampliada, Editar produto, folhas, janelas) trava a tela de baixo; ao fechar, volta
  // exatamente onde estava. Vale para todas as janelas, inclusive as futuras. O modo cliente continua com a trava dele.
  (function () {
    var SEL = '.modal,.lfa-ov:not(.sai),.ljBk,.lfEspia:not(.sai)',
      y = 0,
      on = false,
      pend = false;
    function aberta() {
      var l = document.querySelectorAll(SEL);
      for (var i = 0; i < l.length; i++) if (l[i].getClientRects().length) return true;
      return false;
    }
    function aplica() {
      pend = false;
      var de = document.documentElement;
      if (de.classList.contains('mcTrava')) return;
      var q = aberta();
      if (q === on) return;
      on = q;
      if (q) {
        y = window.scrollY || de.scrollTop || 0;
        de.classList.add('lfTrava');
        document.body.style.top = -y + 'px';
      } else {
        de.classList.remove('lfTrava');
        document.body.style.top = '';
        // devolve na hora (o app usa rolagem suave, que deixava a tela parar no meio do caminho)
        try {
          window.scrollTo({ top: y, left: 0, behavior: 'instant' });
        } catch (e) {
          window.scrollTo(0, y);
        }
      }
    }
    function agenda() {
      if (pend) return;
      pend = true;
      requestAnimationFrame(aplica);
    }
    new MutationObserver(agenda).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
    window.__lfTravaAplica = aplica;
  })();

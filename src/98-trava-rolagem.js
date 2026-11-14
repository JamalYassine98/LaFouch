  // ===== v469 (aprovado 08/11): trava única de rolagem =====
  // Qualquer janela aberta (foto ampliada, Editar produto, folhas, janelas) trava a tela de baixo; ao fechar, volta
  // exatamente onde estava. Vale para todas as janelas, inclusive as futuras. O modo cliente continua com a trava dele.
  (function () {
    // S257 (aprovado 14/11/2026): entram a tela do PIN, Filtros e ordem, a janela do Câmbio e o menu do Caixa, que não travavam;
    // e QUALQUER camada fixa que cubra metade da tela ou mais (filha direta do body), para as janelas futuras.
    var SEL = '.modal,.lfa-ov:not(.sai),.ljBk,.lfEspia:not(.sai),#lockScr:not([hidden]),#filtPanel,.fjBk,.cxMenu,.estOv,#estCam',
      y = 0,
      on = false,
      pend = false;
    function aberta() {
      var l = document.querySelectorAll(SEL);
      for (var i = 0; i < l.length; i++) if (l[i].getClientRects().length) return true;
      var f = document.body.children, A = window.innerWidth * window.innerHeight * 0.5;
      for (var j = 0; j < f.length; j++) {
        var e = f[j];
        if (e.classList.contains('wrap') || e.tagName === 'SCRIPT' || e.tagName === 'STYLE' || e.id === 'lfIntro' || !e.getClientRects().length) continue;
        var r = e.getBoundingClientRect();
        if (r.width * r.height < A) continue;
        var cs = getComputedStyle(e);
        if (cs.position === 'fixed' && cs.visibility !== 'hidden' && cs.pointerEvents !== 'none' && +cs.opacity > 0.05) return true;
      }
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

  // S187 (aprovado 12/11/2026): cada peça aberta (Catálogo e Inventário) vira 1 passo do voltar.
  // Antes: abrir uma peça no Catálogo não criava passo; o voltar do celular saía para o Início (rolagem 1400 → 0,
  // animação cortada) e a peça continuava marcada. Agora: voltar fecha a peça e a lista volta na mesma rolagem.
  (function () {
    var ultY = 0, aberto0 = '', ign = 0;
    function aberto() {
      if (S.view === 'vendas' && S.vRef) return 'v:' + S.vRef;
      if (S.view === 'estoque' && S.det && S.open) return 'e:' + S.open;
      return '';
    }
    function fecha() {
      if (S.view === 'vendas') { S.vRef = ''; S.vSel = null; S.qty = 1; S.msg = ''; }
      else if (S.view === 'estoque') { S.det = false; S.open = null; S.selItem = null; S.msg = ''; }
    }
    function passo(k) {
      if (history.state && history.state.lfp === k) return;
      S._volY = ultY;
      try { history.pushState({ lfp: k, v: S.view }, '', '#' + S.view); } catch (e) {}
    }
    // a lista guarda a rolagem enquanto nenhuma peça está aberta
    window.addEventListener('scroll', function () { if (!aberto()) ultY = window.scrollY || 0; }, { passive: true });
    // toda abertura de peça (Catálogo e Inventário, com ou sem animação) passa por prodTopo
    var _pt = window.prodTopo;
    if (typeof _pt === 'function') window.prodTopo = function () { var k = aberto(); if (k && !window.__navVolta) passo(k); return _pt.apply(this, arguments); };
    var _r = render;
    render = function () {
      // o estado muda ANTES do render (S.vRef = …; render()): compara com o que estava aberto no render anterior
      var antes = aberto0;
      if (!antes && !aberto()) ultY = window.scrollY || 0;
      var r = _r.apply(this, arguments);
      var agora = aberto();
      if (agora && agora !== antes && !window.__navVolta) passo(agora);
      else if (!agora && antes && !window.__navVolta && history.state && history.state.lfp) {
        // fechou por um botão da tela: tira o passo que sobrou, sem mexer em nada
        ign++;
        try { history.back(); } catch (e) { ign--; }
        var y = S._volY;
        if (y != null) requestAnimationFrame(function () { window.scrollTo({ top: y, left: 0, behavior: 'instant' }); });
      }
      aberto0 = agora;
      return r;
    };
    window.addEventListener('popstate', function (e) {
      if (ign) { ign--; e.stopImmediatePropagation(); return; }
      var st = e.state || {};
      if (aberto() && !st.lfp && (location.hash.slice(1) || 'inicio') === S.view) {
        e.stopImmediatePropagation();
        var y = S._volY;
        window.__navVolta = true;
        try { fecha(); render(); } finally { window.__navVolta = false; }
        if (y != null) requestAnimationFrame(function () { window.scrollTo({ top: y, left: 0, behavior: 'instant' }); });
      }
    }, true);
  })();

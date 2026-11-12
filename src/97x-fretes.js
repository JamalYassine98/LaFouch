  // ===== S192 (aprovado 12/11/2026): transportadoras do Delivery do site =====
  // O dono põe o preço de cada uma (G$) e pode desligar a que não está atendendo. Vai para config/site.fretes
  // ({pya:{p,off}, bolt, tiemsa, mcg}); sem preço o site mostra "pago na entrega". Quando as contas da PedidosYa/Bolt
  // forem ligadas, o preço automático entra no mesmo campo.
  var FRT = [['pya', 'PedidosYa Envíos', 'em até 60 min'], ['bolt', 'Bolt Envío', 'em até 60 min'], ['tiemsa', 'Tiemsa', '1 a 2 dias úteis'], ['mcg', 'MCGroup', '1 a 2 dias úteis']];
  S.fretes = S.fretes || {};
  function fretesCard() {
    return (
      '<section class="card col" id="fretesCard" style="gap:10px"><div><b>Transportadoras do Delivery</b><div class="hint" style="margin:2px 0 0">Preço que o cliente vê no site (vazio = pago na entrega). Desligue a que não está atendendo.</div></div>' +
      FRT.map(function (t) {
        var f = S.fretes[t[0]] || {};
        return (
          '<div class="sl" style="gap:10px;align-items:center"><span>' + t[1] + '<small>' + t[2] + '</small></span><span style="display:flex;gap:8px;align-items:center">' +
          '<input class="in frtP" data-id="' + t[0] + '" inputmode="numeric" placeholder="G$" value="' + (f.p ? String(f.p).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '') + '" style="width:110px;text-align:right" aria-label="Preço ' + t[1] + '">' +
          '<button type="button" class="nfTg' + (f.off ? '' : ' on') + '" data-act="frtTg" data-id="' + t[0] + '" role="switch" aria-checked="' + !f.off + '" aria-label="' + t[1] + ' ligada"><i></i></button></span></div>'
        );
      }).join('') +
      '<button type="button" class="go" data-act="frtSalva">Salvar no site</button></section>'
    );
  }
  ACT.frtTg = function (id) {
    var f = (S.fretes[id] = S.fretes[id] || {});
    f.off = !f.off;
    var b = document.querySelector('[data-act=frtTg][data-id="' + id + '"]');
    if (b) { b.classList.toggle('on', !f.off); b.setAttribute('aria-checked', String(!f.off)); }
    saveSoon();
  };
  ACT.frtSalva = function () {
    document.querySelectorAll('#fretesCard .frtP').forEach(function (i) {
      var id = i.getAttribute('data-id'), v = parseInt(String(i.value).replace(/\D/g, ''), 10) || 0, f = (S.fretes[id] = S.fretes[id] || {});
      f.p = v > 0 && v < 5000000 ? v : 0;
    });
    saveSoon();
    var o = {};
    FRT.forEach(function (t) { var f = S.fretes[t[0]] || {}; o[t[0]] = { p: f.p || 0, off: !!f.off }; });
    if (typeof vitApi !== 'function') { lfToast('Salvo neste aparelho'); return; }
    vitApi('PATCH', 'config/site?updateMask.fieldPaths=fretes', vBody({ fretes: o }))
      .then(function () { lfToast('✓ Fretes no site'); })
      .catch(function () { lfToast('Salvo aqui; vai para o site quando houver internet'); S.fretesPend = 1; saveSoon(); });
  };

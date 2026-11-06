  // ===== DIAGNÓSTICO TEMPORÁRIO do envio ao site (v447, 06/11/2026) =====
  // O dono aprovou mostrar o motivo do erro e TIRAR DEPOIS ("tem que tirar essa bagunça").
  // Para remover: apagar este arquivo, a chamada diagSiteRender() em 96-loja-online.js e o S._vitErr em vitSync.
  function diagSiteRender(el) {
    var d = $('vitDiag');
    if (!d) {
      d = mk('section', 'card');
      d.id = 'vitDiag';
      d.style.cssText = 'padding:12px 14px;margin:0 0 10px;font-size:13px;line-height:1.45';
      var sb = $('siteBox');
      el.insertBefore(d, sb);
    }
    var refs = {},
      pub = 0,
      fila = 0,
      ficha = 0,
      semNuvem = !S.nuvem || !S.nuvem.rt;
    (S.items || []).forEach(function (i) {
      if (!i.bulk) refs[i.ref] = 1;
    });
    Object.keys(refs).forEach(function (r) {
      if (S.site && S.site[r]) {
        if (S.vitPend && S.vitPend[r]) fila++;
        else pub++;
      } else if (!siteCheck(r).ok) ficha++;
    });
    var e = S._vitErr,
      h =
        '<b>Diagnóstico do site (temporário)</b><div>Peças no site: <b>' + pub + '</b> publicadas · <b>' + fila + '</b> esperando envio' +
        (ficha ? ' · ' + ficha + ' fora (falta foto em alguma cor ou estoque)' : '') + '</div>' +
        (semNuvem ? '<div style="color:var(--warn)">Nuvem sem login neste aparelho.</div>' : '') +
        (e ? '<div style="color:var(--warn)">Último erro (' + fh(e.ts) + ', ' + esc(e.ref) + '): ' + esc(e.msg) + '</div>' : fila ? '<div>Sem erro registrado ainda (o envio tenta de 1 em 1 minuto).</div>' : '');
    if (d.innerHTML !== h) d.innerHTML = h;
  }

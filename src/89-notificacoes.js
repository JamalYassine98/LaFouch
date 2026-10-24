  /* ===== Notificações: o que precisa de atenção agora + registro dos alertas do dólar ===== */
  ICO_D.notif = '<path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16zM10 21h4"/>';
  S.notifs = [];
  S.fxMgUlt = 0;
  // Itens ao vivo: tudo que o Dashboard chama de "Atenção agora" + o estado da margem da loja.
  // Avisos (sino e aba) só quando a margem passa de 1%: acima da base por pouco não merece alerta.
  var FX_AVISO = 0.01 - 1e-9;
  function fxMgTxt() {
    var a = fxMargemInfo('pyg'),
      b = fxMargemInfo('brl'),
      t = [];
    if (a.m > FX_AVISO) t.push('O dólar está ' + pc(a.acima) + ' acima da menor cotação de ' + FX_JANELA + ' dias');
    if (b.m > FX_AVISO) t.push('O real por dólar está ' + pc(b.acima) + ' acima da menor cotação de ' + FX_JANELA + ' dias');
    return t.length ? t.join('. ') + '. ' : '';
  }
  // Avisos que pedem você agora (o resto fica em "Para acompanhar").
  function urgente(i) {
    return i.c === 'var(--bad)' || i.id === 'novo' || i.id === 'fx' || i.urg === true;
  }
  function notifAgora() {
    var l = [],
      mg = fxMargemInfo('pyg'),
      mb = fxMargemInfo('brl'),
      mx = Math.max(mg.m, mb.m);
    if (mx > FX_AVISO)
      l.push({
        t: 'Margem da loja em ' + pc(mx),
        s: fxMgTxt() + 'Dólar da loja: ' + gsRaw(fxLoja('usd')) + '.',
        c: 'var(--warn)',
        b: 'Ver',
        act: 'view',
        id: 'fx'
      });
    var dv = dolarFavoravel(),
      tp = trocarPlano();
    if (dv && dv.barato && tp.passos.length)
      l.push({
        t: 'Bom momento para trocar dólar',
        s: 'O dólar está em ' + gsRaw(dv.hoje) + ', perto do mínimo dos últimos ' + S.janela + ' dias.' + (tp.needRep > 0.004 ? ' Reposição pendente: ' + usd(tp.needRep) + '.' : ''),
        c: 'var(--ok)',
        b: 'Trocar',
        act: 'view',
        id: 'fx'
      });
    if (pedNovos())
      l.push({
        t: pedNovos() + (pedNovos() === 1 ? ' pedido novo' : ' pedidos novos'),
        s: 'Esperando você começar a separar' + (pedUltimo() ? ' · último às ' + fh(pedUltimo()) : '') + '.',
        c: 'var(--accent)',
        b: 'Ver',
        act: 'pedver',
        id: 'novo'
      });
    try {
      atencaoItens().forEach(function (i) {
        l.push(i);
      });
    } catch (e) {}
    return l;
  }
  // Registra no histórico quando a margem sobe ou volta ao normal.
  function notifVerifica() {
    var mx = Math.max(fxMargemInfo('pyg').m, fxMargemInfo('brl').m),
      alta = mx > FX_AVISO ? 1 : 0;
    var dv = dolarFavoravel(),
      bar = dv && dv.barato && trocarPlano().passos.length ? 1 : 0;
    if (bar !== S.fxBaratoUlt) {
      S.fxBaratoUlt = bar;
      if (bar)
        S.notifs.unshift({ ts: Date.now(), lida: false, t: 'Dólar barato: bom momento para trocar', s: 'Dólar em ' + gsRaw(dv.hoje) + ', perto do mínimo dos últimos ' + S.janela + ' dias.' });
      S.notifs = S.notifs.filter(function (x) {
      return Date.now() - x.ts < 60 * DAY;
    }).slice(0, 60);
    }
    if (alta === S.fxMgUlt) return;
    S.fxMgUlt = alta;
    S.notifs.unshift({
      ts: Date.now(),
      lida: false,
      t: alta ? 'Margem da loja subiu para ' + pc(mx) : 'Margem da loja voltou a ' + pc(FX_MARGEM),
      s: alta ? fxMgTxt() + 'Dólar da loja: ' + gsRaw(fxLoja('usd')) + '.' : 'O dólar acalmou. Dólar da loja: ' + gsRaw(fxLoja('usd')) + '.'
    });
    S.notifs = S.notifs.filter(function (x) {
      return Date.now() - x.ts < 60 * DAY;
    }).slice(0, 60);
  }
  function notifContagem() {
    var n = 0;
    try {
      n = notifAgora().length;
    } catch (e) {}
    return n + S.notifs.filter(function (x) {
      return !x.lida;
    }).length;
  }
  function renderNotif() {
    var el = $('v-notif');
    if (!el || S.view !== 'notif') return;
    var ag = notifAgora(),
      h = '<div class="top"><div><h1>Notificações</h1><div class="crumb">O que precisa de atenção e os avisos do dólar</div></div></div>';
    function cartao(i) {
      return (
        '<section class="card" style="border-left:4px solid ' + i.c + ';display:flex;align-items:center;gap:10px;justify-content:space-between"><div><b style="font-size:15px">' + esc(i.t) + '</b><div class="hint" style="margin:2px 0 0">' + esc(i.s) + '</div></div>' +
        '<button type="button" class="mini" data-act="' + i.act + '" data-id="' + i.id + '">' + esc(i.b) + '</button></section>'
      );
    }
    var urg = ag.filter(urgente),
      acomp = ag.filter(function (i) {
        return !urgente(i);
      });
    h += '<div class="lbl" style="color:' + (urg.length ? 'var(--bad)' : 'var(--mute)') + '">Precisa de você agora · ' + urg.length + '</div>';
    h += urg.length ? urg.map(cartao).join('') : '<section class="card"><b>Tudo em ordem.</b><div class="hint" style="margin:2px 0 0">Nada urgente agora.</div></section>';
    if (acomp.length) h += '<div class="lbl">Para acompanhar · ' + acomp.length + '</div>' + acomp.map(cartao).join('');
    h += '<div class="lbl">Histórico</div>';
    h += S.notifs.length
      ? S.notifs
          .map(function (x) {
            return '<section class="card"><b style="font-size:15px">' + esc(x.t) + '</b><div class="hint" style="margin:2px 0 0">' + esc(x.s) + '</div><div class="hint" style="margin:4px 0 0">' + fd(x.ts) + ' ' + fh(x.ts) + '</div></section>';
          })
          .join('') +
        '<div class="sel" style="justify-content:center"><button type="button" class="chip" data-act="notifLimpa">Limpar histórico</button></div>'
      : '<div class="hint">Nenhum aviso ainda. Quando a margem ou o dólar mudarem, o registro aparece aqui.</div>';
    el.innerHTML = h;
    S.notifs.forEach(function (x) {
      x.lida = true;
    });
  }

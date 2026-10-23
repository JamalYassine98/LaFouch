  /* ===== Notificações: o que precisa de atenção agora + registro dos alertas do dólar ===== */
  ICO_D.notif = '<path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16zM10 21h4"/>';
  S.notifs = [];
  S.fxMgUlt = 0;
  // Itens ao vivo: tudo que o Dashboard chama de "Atenção agora" + o estado da margem da loja.
  function notifAgora() {
    var l = [],
      mg = fxMargemInfo();
    if (mg.m > FX_MARGEM + 1e-9)
      l.push({
        t: 'Margem da loja em ' + pc(mg.m),
        s:
          (mg.reativa > FX_MARGEM + 1e-9 ? 'O dólar oscilou ' + pc(mg.amp) + ' em 7 dias. ' : '') +
          (mg.alerta ? 'Subiu ' + pc(mg.alta) + ' em 3 dias. ' : '') +
          'Dólar da loja: ' + gsRaw(fxLoja('usd')) + '.',
        c: 'var(--warn)',
        b: 'Ver',
        act: 'view',
        id: 'fx'
      });
    if (pedNovos())
      l.push({
        t: pedNovos() + (pedNovos() === 1 ? ' pedido novo' : ' pedidos novos'),
        s: 'Esperando você começar a separar.',
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
    var mg = fxMargemInfo(),
      alta = mg.m > FX_MARGEM + 1e-9 ? 1 : 0;
    if (alta === S.fxMgUlt) return;
    S.fxMgUlt = alta;
    S.notifs.unshift({
      ts: Date.now(),
      lida: false,
      t: alta ? 'Margem da loja subiu para ' + pc(mg.m) : 'Margem da loja voltou a ' + pc(FX_MARGEM),
      s: alta
        ? (mg.reativa > FX_MARGEM + 1e-9 ? 'O dólar oscilou ' + pc(mg.amp) + ' em 7 dias. ' : '') + (mg.alerta ? 'Subiu ' + pc(mg.alta) + ' em 3 dias. ' : '') + 'Dólar da loja: ' + gsRaw(fxLoja('usd')) + '.'
        : 'O dólar acalmou. Dólar da loja: ' + gsRaw(fxLoja('usd')) + '.'
    });
    S.notifs = S.notifs.slice(0, 60);
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
    h += '<div class="lbl">Agora</div>';
    h += ag.length
      ? ag
          .map(function (i) {
            return (
              '<section class="card" style="border-left:4px solid ' + i.c + ';display:flex;align-items:center;gap:10px;justify-content:space-between"><div><b style="font-size:15px">' + esc(i.t) + '</b><div class="hint" style="margin:2px 0 0">' + esc(i.s) + '</div></div>' +
              '<button type="button" class="mini" data-act="' + i.act + '" data-id="' + i.id + '">' + esc(i.b) + '</button></section>'
            );
          })
          .join('')
      : '<section class="card"><b>Tudo em ordem.</b><div class="hint" style="margin:2px 0 0">Nada precisa de atenção agora.</div></section>';
    h += '<div class="lbl">Avisos anteriores</div>';
    h += S.notifs.length
      ? S.notifs
          .map(function (x) {
            return '<section class="card"><b style="font-size:15px">' + esc(x.t) + '</b><div class="hint" style="margin:2px 0 0">' + esc(x.s) + '</div><div class="hint" style="margin:4px 0 0">' + fd(x.ts) + ' ' + fh(x.ts) + '</div></section>';
          })
          .join('') +
        '<div class="sel" style="justify-content:center"><button type="button" class="chip" data-act="notifLimpa">Limpar avisos anteriores</button></div>'
      : '<div class="hint">Nenhum aviso ainda. Quando a margem da loja subir ou voltar ao normal, ele aparece aqui.</div>';
    el.innerHTML = h;
    S.notifs.forEach(function (x) {
      x.lida = true;
    });
  }

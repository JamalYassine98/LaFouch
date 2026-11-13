  // ===== S189 (aprovado 12/11/2026): GUARDIÃO DO APP =====
  // Confere os dados no próprio aparelho, sem internet e sem mandar nada para fora (ao abrir, 08:00, ao fechar o caixa e
  // depois de sincronizar = sempre que o Início é desenhado). No Início: 1 cartão só com o que precisa do dono + botão;
  // tudo certo = 1 linha verde. Tocar abre todas as conferências por assunto; cada aviso explica a conta e leva à tela
  // que resolve. "Silenciar 7 dias" por aviso. Separado do porteiro (que testa o app antes de cada versão).
  S.guardMudo = S.guardMudo || {};
  var GUARD_H = 36e5;
  function guardPedidos() { return (S.pedidos || []).filter(function (p) { return p && !p.teste && p.st !== 'canc'; }); }
  function guardChecks() {
    var ag = Date.now(), L = [];
    var add = function (g, k, t, n, o) { L.push(Object.assign({ g: g, k: k, t: t, n: n, ok: !n }, o || {})); };
    // Dinheiro
    var cc = typeof ccDias === 'function' ? ccDias() : 0, fal = window.__fechoAlerta && window.__fechoAlerta();
    add('Dinheiro', 'caixa', 'Caixa conferido', fal ? 1 : cc >= 7 ? 1 : 0, { tp: fal ? 'Caixa de hoje não bate' : 'Conferir o caixa', s: fal ? fal.s || 'o caixa de hoje não bate' : cc === Infinity ? 'ainda não conferiu' : cc >= 7 ? 'faz ' + cc + ' dias' : '', b: 'Conferir', act: 'view', id: 'caixa', urg: !!fal });
    var venc = typeof avisosVenc === 'function' ? avisosVenc(3) : [];
    add('Dinheiro', 'contas', 'Contas vencendo em 3 dias', venc.length, { s: venc.slice(0, 2).map(function (a) { return a.e.nome; }).join(', '), b: 'Ver', act: 'view', id: 'desp' });
    var fxTs = (S.fx && S.fx.ts) || 0, fxH = fxTs ? Math.floor((ag - fxTs) / GUARD_H) : 999;
    add('Dinheiro', 'cambio', 'Câmbio atualizado', fxH > 24 ? 1 : 0, { tp: 'Câmbio velho', s: fxH > 24 ? (fxTs ? 'há ' + Math.floor(fxH / 24) + ' dia(s)' : 'nunca atualizado') : 'há ' + fxH + ' h', b: 'Atualizar', act: 'view', id: 'fx' });
    // Estoque e preço
    var it = S.items || [];
    var neg = it.filter(function (x) { return x.qty < 0; });
    add('Estoque e preço', 'neg', 'Estoque negativo', neg.length, { s: neg.slice(0, 3).map(function (x) { return x.ref; }).join(', '), b: 'Ver', act: 'view', id: 'estoque', urg: neg.length > 0 });
    var semC = it.filter(function (x) { return x.qty > 0 && !(+x.custo > 0) && !(+x.usd > 0); });
    var rs = {}; semC.forEach(function (x) { rs[x.ref] = 1; });
    add('Estoque e preço', 'custo', 'Peça sem custo (lucro errado)', Object.keys(rs).length, { s: Object.keys(rs).slice(0, 3).join(', '), b: 'Ver', act: 'view', id: 'estoque' });
    var ab = (S.sales || []).filter(function (s) { return !s.estorno && s.ts > ag - 7 * 24 * GUARD_H && s.livre < 0 && !s.motivo && !s.brinde; });
    add('Estoque e preço', 'piso', 'Venda abaixo do piso sem motivo', ab.length, { s: ab.length ? 'últimos 7 dias' : '', b: 'Ver', act: 'view', id: 'hist' });
    var sf = typeof fotoPendModelos === 'function' ? fotoPendModelos() : 0;
    add('Estoque e preço', 'foto', 'Peça publicada sem foto', sf, { b: 'Fotografar', act: 'semfoto' });
    // Site e pedidos
    var P = guardPedidos();
    var pns = P.filter(function (p) { return p.pg === 'pago' && p.st === 'novo' && ag - (p.tokTs || p.ts || ag) > 2 * GUARD_H; });
    add('Site e pedidos', 'sep', 'Pedido pago não separado (+2 h)', pns.length, { s: pns.slice(0, 2).map(function (p) { return '#' + (p.num || p.id); }).join(', '), b: 'Separar', act: 'view', id: 'ped', urg: pns.length > 0 });
    var pix = P.filter(function (p) { return p.pg !== 'pago' && p.pag === 'pix' && !p.comp && ag - (p.ts || ag) > 15 * 60000 && ag - (p.ts || ag) < 48 * GUARD_H; });
    add('Site e pedidos', 'pix', 'PIX esperando há mais de 15 min', pix.length, { s: pix.length ? 'sem confirmação do e-mail do Nubank' : '', b: 'Ver', act: 'view', id: 'ped' });
    var itau = P.filter(function (p) { return p.pg !== 'pago' && p.comp && !p.recus; });
    add('Site e pedidos', 'itau', 'Comprovante aguardando conferência', itau.length, { s: itau.slice(0, 2).map(function (p) { return '#' + (p.num || p.id); }).join(', '), b: 'Conferir', act: 'view', id: 'ped', urg: itau.length > 0 });
    var ata = typeof ataTrocasEstranhas === 'function' ? ataTrocasEstranhas() : [];
    if (typeof ataTrocasEstranhas === 'function') add('Site e pedidos', 'ata', 'Conta atacadista trocando muito de aparelho', ata.length, { s: ata.slice(0, 2).map(function (a) { return a.nome; }).join(', '), b: 'Ver', act: 'view', id: 'clientes' });
    // Aparelhos e cópias
    var sy = typeof syncVisivel === 'function' && syncVisivel() && typeof syncEstadoTxt === 'function' ? syncEstadoTxt() : null;
    if (sy) add('Aparelhos e cópias', 'sync', 'Sincronização', sy[0] === 'bad' ? 1 : 0, { tp: 'Sincronização com erro', s: sy[1], b: 'Ver', act: 'view', id: 'ajustes' });
    var bkd = S.backupTs ? Math.floor((ag - S.backupTs) / (24 * GUARD_H)) : -1;
    add('Aparelhos e cópias', 'bk', 'Cópia de segurança', bkd < 0 || bkd > 7 ? 1 : 0, { tp: 'Fazer cópia de segurança', s: bkd < 0 ? 'nenhuma cópia' : 'há ' + bkd + ' dia(s)', b: 'Fazer', act: 'view', id: 'ajustes' });
    var semDet = (S.grp || []).reduce(function (a, g) { return a + (typeof grpFalta === 'function' ? grpFalta(g) : 0); }, 0);
    add('Aparelhos e cópias', 'lote', 'Lote sem detalhe', semDet, { b: 'Completar', act: 'inicio', id: 'lotes' });
    L.forEach(function (c) { var m = S.guardMudo[c.k]; if (!c.ok && m && m > ag) c.mudo = true; });
    S.guardTs = ag;
    return L;
  }
  function guardIco() { return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>'; }
  // cartão do Início
  function guardInicioHtml() {
    var L = guardChecks(), pr = L.filter(function (c) { return !c.ok && !c.mudo; }).sort(function (a, b) { return (b.urg ? 1 : 0) - (a.urg ? 1 : 0); });
    var hr = fh(S.guardTs);
    if (!pr.length) return '<section class="card guardOk noconta" data-act="guardAbre" role="button" tabindex="0">' + guardIco() + '<span><b>Tudo certo</b> · conferido ' + hr + '</span></section>';
    return (
      '<section class="card guardC noconta"><div class="guardT" data-act="guardAbre" role="button" tabindex="0">' + guardIco() + '<b>Guardião · ' + pr.length + (pr.length === 1 ? ' coisa' : ' coisas') + ' para olhar</b></div>' +
      pr.slice(0, 3).map(function (c) {
        return '<div class="guardL"><span><b>' + esc(c.tp || c.t) + (c.n > 1 ? ' · ' + c.n : '') + '</b>' + (c.s ? '<small>' + esc(c.s) + '</small>' : '') + '</span><button type="button" class="gBtn" data-act="' + c.act + '" data-id="' + esc(c.id || '') + '">' + esc(c.b || 'Ver') + '</button></div>';
      }).join('') +
      (pr.length > 3 ? '<button type="button" class="gLink" data-act="guardAbre">Ver todas (' + pr.length + ')</button>' : '') +
      '</section>'
    );
  }
  // todas as conferências por assunto
  ACT.guardAbre = function () {
    lfJanela({
      titulo: 'Guardião',
      monta: function (c) {
        var L = guardChecks(), G = {};
        L.forEach(function (x) { (G[x.g] = G[x.g] || []).push(x); });
        c.innerHTML = '<div class="col" style="gap:12px;padding:0 16px 16px"><div class="hint" style="margin:0">conferido hoje ' + fh(S.guardTs) + ' · ' + L.length + ' conferências · no próprio aparelho, sem internet</div>' +
          Object.keys(G).map(function (g) {
            return '<section class="card col" style="gap:0"><div class="lbl">' + g.toUpperCase() + '</div>' + G[g].map(function (x) {
              var st = x.ok ? '<b style="color:var(--ok)">✓' + (x.s && /^há /.test(x.s) ? ' ' + esc(x.s) : '') + '</b>' : '<b style="color:' + (x.urg ? 'var(--bad)' : 'var(--warn)') + '">' + (x.n > 1 || x.k === 'neg' ? x.n : '!') + '</b>';
              return '<div class="sl guardI"><span>' + esc(x.ok ? x.t : x.tp || x.t) + (!x.ok && x.s ? '<small>' + esc(x.s) + '</small>' : '') + '</span><span style="display:flex;gap:6px;align-items:center">' + st +
                (!x.ok ? '<button type="button" class="gBtn" data-act="' + x.act + '" data-id="' + esc(x.id || '') + '">' + esc(x.b || 'Ver') + '</button>' + (x.mudo ? '<small class="mu">silenciado</small>' : '<button type="button" class="gMudo" data-act="guardMudo" data-id="' + x.k + '" aria-label="Silenciar 7 dias">silenciar</button>') : '') + '</span></div>';
            }).join('') + '</section>';
          }).join('') + '</div>';
      }
    });
  };
  ACT.guardMudo = function (k) {
    S.guardMudo[k] = Date.now() + 7 * 24 * GUARD_H;
    saveSoon();
    lfToast('Silenciado por 7 dias');
    ACT.guardAbre();
  };
  // urgentes também tocam o sino
  var _atGuard = atencaoItens;
  atencaoItens = function () {
    var it = _atGuard.apply(this, arguments);
    try {
      guardChecks().forEach(function (c) {
        if (!c.ok && c.urg && !c.mudo && !it.some(function (x) { return x.t === c.t; })) it.push({ t: 'Guardião: ' + (c.tp || c.t), s: c.s || '', c: 'var(--bad)', urg: true, b: c.b || 'Ver', act: c.act, id: c.id || '' });
      });
    } catch (e) {}
    return it;
  };

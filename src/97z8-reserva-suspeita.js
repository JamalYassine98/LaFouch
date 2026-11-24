  // ===== 74r v3 (aprovado 23/11 08:05): Reserva suspeita em PEDIDOS e no sino (Titan) =====
  // A nuvem (functions/suspeita.js) grava suspeitas/<pedido> quando uma reserva parece abuso (5+ peças iguais sem pagar, ou
  // 3+ reservas abertas da mesma rede na mesma hora). O app lê (susBusca), mostra a 1ª linha vermelha nas Pendências (guardChecks,
  // src/97w-guardiao.js) e o pedido no topo de Pedidos; "Ver" abre a janela de confirmação (lfConfirma com linhas) com
  // "Cancelar e soltar as peças" — o MESMO cancelamento do pedido (pedCancela) — e apaga o aviso da nuvem depois de resolver.
  S.suspeitas = {}; // pedido (sid da reserva) → o que a nuvem gravou
  function susBusca() {
    if (typeof nvApi !== 'function' || !S.nuvem || !S.nuvem.rt || susBusca.on || Date.now() - (susBusca.ts || 0) < 60000) return;
    susBusca.on = 1;
    susBusca.ts = Date.now();
    nvApi('GET', 'suspeitas?pageSize=100').then(function (j) {
      var o = {};
      (j.documents || []).forEach(function (d) {
        var f = {};
        Object.keys(d.fields || {}).forEach(function (k) { f[k] = pedFv(d.fields[k]); });
        o[d.name.split('/').pop()] = f;
      });
      var mudou = JSON.stringify(o) !== JSON.stringify(S.suspeitas);
      S.suspeitas = o;
      if (mudou) render();
    }, function () {}).then(function () { susBusca.on = 0; });
  }
  // as que ainda valem: o pedido está no app, não foi pago nem cancelado e a reserva não soltou
  function susAbertas() {
    var ag = Date.now();
    return Object.keys(S.suspeitas || {}).map(function (pid) {
      var o = S.suspeitas[pid], p = (S.pedidos || []).filter(function (x) { return x.sid === pid; })[0];
      if (!o || !p || p.pg === 'pago' || p.st === 'canc' || (o.exp > 0 && o.exp <= ag)) return null;
      return { pid: pid, o: o, p: p };
    }).filter(Boolean).sort(function (a, b) { return (b.o.ts || 0) - (a.o.ts || 0); });
  }
  function susMin(ms) { var m = Math.max(1, Math.round(ms / 60000)); return m < 60 ? m + ' min' : Math.round(m / 60) + ' h'; }
  function susMotivo(o) {
    var M = o.motivos || [];
    return M.indexOf('iguais') >= 0 ? o.iguais + ' peças iguais sem pagar' : cntPl((o.abertas || []).length, 'reserva aberta', 'reservas abertas') + ' da mesma rede';
  }
  function susSub(x) { return susMotivo(x.o) + (x.o.exp > 0 ? ' · solta sozinha em ' + susMin(x.o.exp - Date.now()) : ''); }
  // Pedidos: o pedido suspeito no topo, em vermelho
  function susPedidosHtml() {
    var L = susAbertas();
    return L.length ? '<section class="nvLista susL">' + L.map(function (x) {
      return '<button type="button" class="nvL" data-act="susAbre" data-id="' + esc(x.pid) + '"><span class="nvTx"><b>Pedido ' + esc(x.p.num) + ' · reserva suspeita</b><small>' + esc(susSub(x)) + '</small></span><i aria-hidden="true">›</i></button>';
    }).join('') + '</section>' : '';
  }
  ACT.susAbre = function (pid) {
    var x = susAbertas().filter(function (y) { return y.pid === pid; })[0];
    if (!x) return lfToast('Essa reserva já foi resolvida', 'ok');
    var it = (x.o.itens || []).slice().sort(function (a, b) { return (b.q || 0) - (a.q || 0); })[0], ag = Date.now();
    lfConfirma({
      k: 'sus' + pid, t: 'Reserva suspeita',
      linhas: [['Pedido', x.p.num + ' · site'], ['Peças', it ? it.q + ' × ' + pn(it.ref) : cntPl(pedQtd(x.p), 'peça', 'peças')],
        ['Por quê', (x.o.motivos || []).indexOf('iguais') >= 0 ? x.o.iguais + ' iguais, sem pagar' : cntPl((x.o.abertas || []).length, 'reserva', 'reservas') + ' da mesma rede', 'r'],
        ['Reservada', 'há ' + susMin(ag - (x.o.ts || x.p.ts || ag)) + (x.o.exp > 0 ? ' · solta em ' + susMin(x.o.exp - ag) : '')]],
      b: 'Cancelar e soltar as peças',
      fn: function () { pedCancela(x.p); susResolve(pid); }
    });
  };
  // resolvido: apaga o aviso na nuvem (as regras deixam o dono apagar) e aqui
  function susResolve(pid) {
    delete S.suspeitas[pid];
    if (typeof nvApi === 'function' && S.nuvem && S.nuvem.rt) nvApi('DELETE', 'suspeitas/' + encodeURIComponent(pid)).catch(function () {});
    render();
  }
  aposRender(function () { if (S.view === 'ped' || S.view === 'notif' || S.view === 'inicio') susBusca(); });

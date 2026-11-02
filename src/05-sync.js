  // ===== Sincronização entre aparelhos: MOTOR PURO (sem rede, sem tela). DESLIGADO até o dono ligar. =====
  // Ideia: nada de "cópia do estado". Cada aparelho compara o que tinha na última sincronização (snap) com o que tem agora
  // e gera MOVIMENTOS: estoque e caixa viajam como diferença (+2, -1), nunca como valor final; vendas e listas só crescem.
  // Cada movimento tem um id único (<aparelho>-<contador>): aplicar o mesmo movimento duas vezes não muda nada.
  // Assim dois aparelhos vendendo ao mesmo tempo somam; nada é sobrescrito nem perdido (estoque pode ficar -1, e o app avisa).
  // Só entram listas que SÓ CRESCEM e têm id próprio. As outras (despesas, câmbios, compras, descartes...) entram uma a uma,
  // depois de conferir que o app nunca edita uma linha antiga (editar apareceria como linha nova duplicada).
  var SYNC_LISTAS = { sales: 'id' };
  function syncChave(i) {
    return [i.tipo, i.ref, i.grau || '', i.cor || '', i.vr || '', i.lote || '', i.fmt || '', i.med || '', i.bulk ? 1 : 0, i.custo == null ? '' : i.custo].join('|');
  }
  function syncHash(o) {
    var s = JSON.stringify(o),
      h = 7,
      i;
    for (i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return 'h' + h.toString(36) + s.length.toString(36);
  }
  function syncIdLinha(lista, e) {
    var campo = SYNC_LISTAS[lista];
    return campo && e && e[campo] != null ? String(e[campo]) : syncHash(e);
  }
  // Foto do estado que interessa à sincronização.
  function syncSnap(St) {
    var sn = { q: {}, cash: { pyg: +St.cash.pyg || 0, usd: +St.cash.usd || 0, brl: +St.cash.brl || 0 }, l: {} };
    (St.items || []).forEach(function (i) {
      if (i.bulk) return; // lotes a granel são derivados dos grupos e ainda não sincronizam (cada aparelho os recria sozinho)
      var k = syncChave(i);
      sn.q[k] = (sn.q[k] || 0) + (+i.qty || 0);
    });
    Object.keys(SYNC_LISTAS).forEach(function (n) {
      var m = {};
      (St[n] || []).forEach(function (e) {
        m[syncIdLinha(n, e)] = 1;
      });
      sn.l[n] = m;
    });
    return sn;
  }
  // Compara a foto anterior com o estado de agora. Devolve os movimentos novos e a foto nova.
  function syncDiff(snap, St, ap, seq) {
    var ops = [],
      now = Date.now(),
      cur = syncSnap(St),
      def = {},
      prox = function () {
        return ap + '-' + ++seq;
      };
    (St.items || []).forEach(function (i) {
      if (!i.bulk) def[syncChave(i)] = i;
    });
    Object.keys(cur.q).forEach(function (k) {
      var d = cur.q[k] - (snap.q[k] || 0);
      if (!d && k in snap.q) return;
      var o = { i: prox(), a: ap, ts: now, k: 'q', c: k, d: d };
      if (!(k in snap.q)) o.def = def[k]; // item novo: leva a ficha junto
      ops.push(o);
    });
    Object.keys(snap.q).forEach(function (k) {
      if (k in cur.q) return;
      if (snap.q[k]) ops.push({ i: prox(), a: ap, ts: now, k: 'q', c: k, d: -snap.q[k] });
    });
    ['pyg', 'usd', 'brl'].forEach(function (m) {
      var d = cur.cash[m] - snap.cash[m];
      if (d) ops.push({ i: prox(), a: ap, ts: now, k: 'cash', m: m, d: d });
    });
    Object.keys(SYNC_LISTAS).forEach(function (n) {
      (St[n] || []).forEach(function (e) {
        var id = syncIdLinha(n, e);
        if (!snap.l[n][id]) ops.push({ i: prox(), a: ap, ts: e && e.ts ? e.ts : now, k: 'add', l: n, e: e });
      });
    });
    return { ops: ops, snap: cur, seq: seq };
  }
  // Aplica movimentos de OUTROS aparelhos. `feitos` = mapa de ids já aplicados (mexido aqui dentro).
  // Atualiza também a foto, para esses movimentos não voltarem como se fossem do próprio aparelho.
  function syncAplica(St, snap, ops, feitos) {
    var n = 0,
      neg = [];
    ops.sort(function (a, b) {
      return a.ts - b.ts || (a.i < b.i ? -1 : 1);
    });
    ops.forEach(function (o) {
      if (!o || !o.i || feitos[o.i]) return;
      feitos[o.i] = o.ts || 1;
      n++;
      if (o.k === 'q') {
        var it = (St.items || []).filter(function (i) {
          return syncChave(i) === o.c;
        })[0];
        if (!it) {
          if (!o.def) return; // movimento de peça que este aparelho nunca viu e sem ficha: fica para a próxima rodada
          it = JSON.parse(JSON.stringify(o.def));
          it.qty = 0;
          St.items.push(it);
        }
        it.qty = (+it.qty || 0) + o.d;
        snap.q[o.c] = (snap.q[o.c] || 0) + o.d;
        if (it.qty < 0) neg.push(o.c);
      } else if (o.k === 'cash') {
        St.cash[o.m] = (+St.cash[o.m] || 0) + o.d;
        snap.cash[o.m] += o.d;
      } else if (o.k === 'add' && SYNC_LISTAS[o.l] !== undefined) {
        var id = syncIdLinha(o.l, o.e);
        if (snap.l[o.l][id]) return;
        snap.l[o.l][id] = 1;
        if (!St[o.l]) St[o.l] = [];
        St[o.l].unshift(o.e);
        St[o.l].sort(function (a, b) {
          return ((b && b.ts) || 0) - ((a && a.ts) || 0);
        });
      }
    });
    return { n: n, neg: neg };
  }
  if (/#test/.test(location.hash)) window.__sync = { snap: syncSnap, diff: syncDiff, aplica: syncAplica, chave: syncChave };

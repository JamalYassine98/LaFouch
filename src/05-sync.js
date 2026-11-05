  // ===== Sincronização entre aparelhos: MOTOR PURO (sem rede, sem tela). DESLIGADO até o dono ligar. =====
  // Ideia: nada de "cópia do estado". Cada aparelho compara o que tinha na última sincronização (snap) com o que tem agora
  // e gera MOVIMENTOS: estoque e caixa viajam como diferença (+2, -1), nunca como valor final; vendas e listas só crescem.
  // Cada movimento tem um id único (<aparelho>-<contador>): aplicar o mesmo movimento duas vezes não muda nada.
  // Assim dois aparelhos vendendo ao mesmo tempo somam; nada é sobrescrito nem perdido (estoque pode ficar -1, e o app avisa).
  // Listas do app. Cada linha é identificada pelo id (vendas) ou pelo conteúdo (as outras). Linha nova = movimento "add";
  // linha que sumiu = movimento "rem"; linha editada = rem da antiga + add da nova.
  var SYNC_LISTAS = { sales: 'id', exp: 0, cambios: 0, compras: 0, descartes: 0, retiradas: 0, melhUso: 0, cpay: 0, imprev: 0, dlog: 0, elog: 0, fechos: 'id', brindes: 0 };
  // Configurações (valor inteiro; vale a última alteração). Nada que seja de um aparelho só (PIN, biometria, tema, bloqueio, avisos).
  var SYNC_CFG = ['faixas', 'pfaixa', 'linhaFix', 'pTrava', 'pAuto', 'pprice', 'metaUsd', 'metaDia', 'diasLoja', 'colchUsd', 'tolUsd', 'volume', 'formas', 'notaCidade', 'cat2', 'tiposX', 'tiposDel', 'tiposOrd', 'pnome', 'desc', 'attr', 'faixaAuto', 'ini', 'site', 'fxc', 'lm', 'objetivos', 'metaHist', 'trocaPlan'];
  // Listas com cadastro que se edita (clientes): cada linha tem id; vale a última alteração de cada uma.
  // skip = campos pesados (fotos) que não viajam por aqui; ficam em cada aparelho.
  var SYNC_PUT = { clientes: { k: 'id', skip: [] }, pedidos: { k: 'id', skip: ['comp', 'qr'] }, espera: { k: 'id', skip: [] } };
  function syncLeve(n, e) {
    var o = {};
    Object.keys(e).forEach(function (k) {
      if (SYNC_PUT[n].skip.indexOf(k) < 0) o[k] = e[k];
    });
    return o;
  }
  var SYNC_REM_MAX = 10; // apagar muita coisa de uma vez (ex.: restaurar cópia) não se espalha sozinho
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
    var sn = { put: {}, cfg: {}, q: {}, cash: { pyg: +St.cash.pyg || 0, usd: +St.cash.usd || 0, brl: +St.cash.brl || 0 }, l: {} };
    (St.items || []).forEach(function (i) {
      if (i.bulk) return; // lotes a granel são derivados dos grupos e ainda não sincronizam (cada aparelho os recria sozinho)
      var k = syncChave(i);
      sn.q[k] = (sn.q[k] || 0) + (+i.qty || 0);
    });
    SYNC_CFG.forEach(function (k) {
      if (St[k] !== undefined) sn.cfg[k] = syncHash(St[k]);
    });
    Object.keys(SYNC_PUT).forEach(function (n) {
      var m = {};
      (St[n] || []).forEach(function (e) {
        m[String(e[SYNC_PUT[n].k])] = syncHash(syncLeve(n, e));
      });
      sn.put[n] = m;
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
    var rems = [];
    Object.keys(SYNC_LISTAS).forEach(function (n) {
      (St[n] || []).forEach(function (e) {
        var id = syncIdLinha(n, e);
        if (!snap.l[n][id]) ops.push({ i: prox(), a: ap, ts: e && e.ts ? e.ts : now, k: 'add', l: n, e: e });
      });
      Object.keys(snap.l[n] || {}).forEach(function (id) {
        if (!cur.l[n][id]) rems.push({ l: n, h: id });
      });
    });
    Object.keys(SYNC_PUT).forEach(function (n) {
      var campo = SYNC_PUT[n].k,
        antes = (snap.put && snap.put[n]) || {},
        agora = cur.put[n];
      (St[n] || []).forEach(function (e) {
        var id = String(e[campo]);
        if (antes[id] !== agora[id]) {
          ops.push({ i: prox(), a: ap, ts: now, k: 'put', l: n, id: id, e: syncLeve(n, e) });
          if (!St.syncPutTs) St.syncPutTs = {};
          St.syncPutTs[n + ':' + id] = now;
        }
      });
      Object.keys(antes).forEach(function (id) {
        if (!(id in agora)) {
          ops.push({ i: prox(), a: ap, ts: now, k: 'del', l: n, id: id });
          if (!St.syncPutTs) St.syncPutTs = {};
          St.syncPutTs[n + ':' + id] = now;
        }
      });
    });
    var aviso = '';
    if (rems.length > SYNC_REM_MAX) aviso = 'Apagou ' + rems.length + ' registros de uma vez neste aparelho. Isso NÃO foi enviado aos outros (proteção contra restauração ou limpeza por engano).';
    else
      rems.forEach(function (r) {
        ops.push({ i: prox(), a: ap, ts: now, k: 'rem', l: r.l, h: r.h });
      });
    SYNC_CFG.forEach(function (k) {
      if (cur.cfg[k] !== undefined && snap.cfg && cur.cfg[k] !== snap.cfg[k]) {
        ops.push({ i: prox(), a: ap, ts: now, k: 'cfg', n: k, v: St[k] });
        if (!St.syncCfgTs) St.syncCfgTs = {};
        St.syncCfgTs[k] = now; // quando EU mudei: se outro aparelho mudou depois, o dele vale
      }
    });
    return { ops: ops, snap: cur, seq: seq, aviso: aviso };
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
      } else if (o.k === 'rem' && SYNC_LISTAS[o.l] !== undefined) {
        var L = St[o.l] || [];
        for (var x = 0; x < L.length; x++)
          if (syncIdLinha(o.l, L[x]) === o.h) {
            L.splice(x, 1);
            break;
          }
        if (snap.l[o.l]) delete snap.l[o.l][o.h];
      } else if ((o.k === 'put' || o.k === 'del') && SYNC_PUT[o.l]) {
        if (!St.syncPutTs) St.syncPutTs = {};
        var pk = o.l + ':' + o.id,
          campo2 = SYNC_PUT[o.l].k,
          lista = St[o.l] || (St[o.l] = []),
          pos = -1;
        if (o.ts < (St.syncPutTs[pk] || 0)) return; // alterei depois: a minha vale
        lista.forEach(function (y, ix) {
          if (String(y[campo2]) === String(o.id)) pos = ix;
        });
        if (o.k === 'del') {
          if (pos >= 0) lista.splice(pos, 1);
          if (snap.put && snap.put[o.l]) delete snap.put[o.l][o.id];
        } else {
          var ne = Object.assign({}, o.e);
          if (pos >= 0) {
            SYNC_PUT[o.l].skip.forEach(function (c) {
              if (lista[pos][c] !== undefined) ne[c] = lista[pos][c]; // a foto que já tenho continua comigo
            });
            lista[pos] = ne;
          } else lista.push(ne);
          if (!snap.put) snap.put = {};
          if (!snap.put[o.l]) snap.put[o.l] = {};
          snap.put[o.l][o.id] = syncHash(syncLeve(o.l, ne));
        }
        St.syncPutTs[pk] = o.ts;
      } else if (o.k === 'cfg' && SYNC_CFG.indexOf(o.n) >= 0) {
        if (!St.syncCfgTs) St.syncCfgTs = {};
        if (o.ts >= (St.syncCfgTs[o.n] || 0)) {
          St[o.n] = o.v;
          St.syncCfgTs[o.n] = o.ts;
          if (!snap.cfg) snap.cfg = {};
          snap.cfg[o.n] = syncHash(o.v);
        }
      } else if (o.k === 'add' && SYNC_LISTAS[o.l] !== undefined) {
        var id = syncIdLinha(o.l, o.e);
        if (snap.l[o.l][id]) return;
        if ((St[o.l] || []).some(function (y) {
          return syncIdLinha(o.l, y) === id;
        })) {
          snap.l[o.l][id] = 1; // já tenho exatamente esta linha
          return;
        }
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

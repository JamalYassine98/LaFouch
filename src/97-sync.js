  // ===== Sincronização entre aparelhos: transporte (nuvem) em cima do motor de src/05-sync.js. DESLIGADO por padrão (S.syncOn). =====
  // Coleção `mov` no Firestore: um documento por movimento, id = id do movimento, campos a (aparelho), ts, p (JSON do movimento).
  // Ciclo: 1) baixa movimentos dos outros e aplica  2) compara com a última foto e gera movimentos novos  3) envia a fila.
  // A fila (S.syncOut) é gravada no aparelho: sem internet nada se perde, e tudo é enviado quando voltar.
  // LIMITE ATUAL: todos os aparelhos precisam partir da MESMA base (mesma cópia de segurança) no momento de ligar. A migração guiada é a etapa seguinte.
  var SYNC_INFO = { estado: 'off', ts: 0, pend: 0, msg: '', neg: [] };
  var syncBusy = false,
    syncP = null,
    syncT = 0;
  function syncLiga(base) {
    if (!S.aparelho) S.aparelho = 'AP' + Math.random().toString(36).slice(2, 6).toUpperCase();
    S.syncSnap = syncSnap(S);
    S.syncSeq = S.syncSeq || 0;
    S.syncFeitos = S.syncFeitos || {};
    S.syncOut = S.syncOut || [];
    S.syncCur = base ? +base : Date.now();
    S.syncOn = true;
    saveSoon();
    syncAgenda(true);
  }
  function syncDesliga() {
    S.syncOn = false;
    SYNC_INFO.estado = 'off';
    saveSoon();
  }
  function syncAgenda(ja) {
    clearTimeout(syncT);
    syncT = setTimeout(syncCiclo, ja ? 0 : 3000);
  }
  function syncQuery(corpo) {
    return nvToken().then(function (t) {
      return fetch(nvDb().replace(/\/$/, '') + ':runQuery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t },
        body: JSON.stringify(corpo)
      }).then(nvJson);
    });
  }
  function syncBaixa() {
    var vistos = 0,
      ops = [],
      cur = S.syncCur,
      max = cur;
    function pagina(desde) {
      return syncQuery({
        structuredQuery: {
          from: [{ collectionId: 'mov' }],
          where: { fieldFilter: { field: { fieldPath: 'ts' }, op: 'GREATER_THAN_OR_EQUAL', value: { integerValue: String(Math.max(0, desde - 120000)) } } },
          orderBy: [{ field: { fieldPath: 'ts' }, direction: 'ASCENDING' }],
          limit: 300
        }
      }).then(function (rs) {
        var docs = (rs || []).filter(function (r) {
          return r.document;
        });
        docs.forEach(function (r) {
          var f = r.document.fields || {},
            ts = +((f.ts || {}).integerValue || 0);
          if (ts > max) max = ts;
          try {
            var o = JSON.parse((f.p || {}).stringValue || 'null');
            if (o && o.a !== S.aparelho) ops.push(o);
          } catch (e) {}
          vistos++;
        });
        if (docs.length >= 300 && max > desde) return pagina(max);
      });
    }
    return pagina(cur).then(function () {
      return { ops: ops, max: max };
    });
  }
  function syncEnvia() {
    var fila = S.syncOut || [];
    return fila.reduce(function (p, o) {
      return p.then(function () {
        var campos = { a: { stringValue: o.a }, ts: { integerValue: String(o.ts) }, p: { stringValue: JSON.stringify(o) } };
        return nvToken()
          .then(function (t) {
            return fetch(nvDb() + 'mov?documentId=' + encodeURIComponent(o.i), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t },
              body: JSON.stringify({ fields: campos })
            });
          })
          .then(function (r) {
            if (!r.ok && r.status !== 409) throw new Error('http ' + r.status); // 409 = já estava lá
            S.syncOut = S.syncOut.filter(function (x) {
              return x.i !== o.i;
            });
          });
      });
    }, Promise.resolve());
  }
  function syncCiclo() {
    if (!S.syncOn) return Promise.resolve();
    if (syncBusy) return syncP; // já tem um ciclo rodando: quem pediu espera esse terminar
    if (!S.nuvem || !S.nuvem.rt || navigator.onLine === false) {
      SYNC_INFO.estado = 'sem';
      SYNC_INFO.pend = (S.syncOut || []).length;
      return Promise.resolve();
    }
    syncBusy = true;
    SYNC_INFO.estado = 'env';
    var mudou = false;
    syncP = syncBaixa()
      .then(function (r) {
        // recebe primeiro, depois envia: aparelho que ficou muito tempo fora só se atualiza e não atropela ninguém
        var ap = syncAplica(S, S.syncSnap, r.ops, S.syncFeitos);
        if (ap.n) mudou = true;
        SYNC_INFO.neg = ap.neg;
        if (r.max > S.syncCur) S.syncCur = r.max;
        var d = syncDiff(S.syncSnap, S, S.aparelho, S.syncSeq);
        S.syncSnap = d.snap;
        S.syncSeq = d.seq;
        d.ops.forEach(function (o) {
          S.syncFeitos[o.i] = o.ts;
          S.syncOut.push(o);
        });
        return syncEnvia();
      })
      .then(function () {
        SYNC_INFO.estado = 'ok';
        SYNC_INFO.msg = '';
      })
      .catch(function (e) {
        SYNC_INFO.estado = 'erro';
        SYNC_INFO.msg = (e && e.message) || 'falhou';
      })
      .then(function () {
        syncBusy = false;
        SYNC_INFO.ts = Date.now();
        SYNC_INFO.pend = (S.syncOut || []).length;
        var corte = Date.now() - 7 * 86400000;
        Object.keys(S.syncFeitos).forEach(function (k) {
          if (S.syncFeitos[k] < corte) delete S.syncFeitos[k];
        });
        saveSoon();
        if (mudou) render();
      });
    return syncP;
  }
  setInterval(function () {
    if (S.syncOn && !document.hidden) syncCiclo();
  }, 20000);
  document.addEventListener('visibilitychange', function () {
    if (S.syncOn && !document.hidden) syncAgenda(true);
  });
  window.addEventListener('online', function () {
    if (S.syncOn) syncAgenda(true);
  });
  if (/#test/.test(location.hash)) window.__syncApp = { liga: syncLiga, desliga: syncDesliga, ciclo: syncCiclo, info: SYNC_INFO };

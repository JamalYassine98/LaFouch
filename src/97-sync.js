  // ===== Sincronização entre aparelhos: transporte (nuvem) em cima do motor de src/05-sync.js. DESLIGADO por padrão (S.syncOn). =====
  // Coleção `mov` no Firestore: um documento por movimento, id = id do movimento, campos a (aparelho), ts, p (JSON do movimento).
  // Ciclo: 1) baixa movimentos dos outros e aplica  2) compara com a última foto e gera movimentos novos  3) envia a fila.
  // A fila (S.syncOut) é gravada no aparelho: sem internet nada se perde, e tudo é enviado quando voltar.
  // LIMITE ATUAL: todos os aparelhos precisam partir da MESMA base (mesma cópia de segurança) no momento de ligar. A migração guiada é a etapa seguinte.
  var syncVelho = false;
  var SYNC_VER = 3; // sobe quando o formato da sincronização muda; o dono pode exigir versão mínima (config/site.syncMin)
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
    // ids de cliente: cada aparelho conta a partir de uma faixa própria, para dois aparelhos nunca criarem o mesmo número
    var faixa = 1000000 + Math.floor(Math.random() * 8000000);
    if ((S.cliNext || 0) < faixa) S.cliNext = faixa;
    // pedidos antigos (id 1, 2, 3...) ganham id único, para não colidir com os de outro aparelho
    (S.pedidos || []).forEach(function (p) {
      if (typeof p.id === 'number') {
        var novo = 'p' + (p.sid || S.aparelho.slice(2) + '-' + p.id);
        if (S.pedSel === p.id) S.pedSel = novo;
        if (S.pedTok === p.id) S.pedTok = novo;
        p.id = novo;
      }
    });
    S.syncCur = base ? +base : Date.now();
    S.syncOn = true;
    saveSoon();
    syncAgenda(true);
  }
  // ---- histórico por aparelho: nome de quem registrou cada venda; vendas feitas sem internet para revisar
  function apNome(ap) {
    if (!ap) return '';
    if (ap === S.aparelho) return S.aparNome || 'Este aparelho';
    var x = (S._syncAps || []).filter(function (y) {
      return y.ap === ap;
    })[0];
    return (x && x.nome) || ap;
  }
  function vendaApHtml(s) {
    if (!s || !s.ap) return '';
    var h = ' · <span style="color:var(--accent-fg);font-weight:700">' + esc(apNome(s.ap)) + '</span>';
    if (s.off) {
      var st = vendaRevStatus(s);
      h += ' · <span style="color:var(' + (st === 'conferir' ? '--warn' : '--ok') + ');font-weight:700">🕓 sem internet' + (st === 'conferir' ? ' · conferir' : ' · conferida ✓') + '</span>';
    }
    return h;
  }
  // Venda feita sem internet: "conferir" se a peça ficou com estoque negativo e ninguém revisou; senão está conferida.
  function vendaRevStatus(s) {
    if (s.rev) return 'ok';
    var neg = (S.items || []).some(function (i) {
      return i.ref === s.ref && String(i.cor || '').toLowerCase() === String(s.cor || '').toLowerCase() && i.qty < 0;
    });
    return neg ? 'conferir' : 'ok';
  }
  function vendasRevisar() {
    return (S.sales || []).filter(function (s) {
      return s.off && !s.estorno && vendaRevStatus(s) === 'conferir';
    });
  }
  function revBannerHtml() {
    var n = vendasRevisar().length;
    return n ? '<div class="note n-warn" style="margin:0 0 10px"><b>⚠️ ' + n + (n === 1 ? ' venda feita sem internet precisa' : ' vendas feitas sem internet precisam') + ' de conferência.</b> <button type="button" class="pdLink" data-act="revabrir">Revisar ›</button></div>' : '';
  }
  function revJanelaHtml() {
    if (!S._revAberta) return '';
    var l = vendasRevisar();
    var h = '<div class="pdOv" role="dialog" aria-modal="true" aria-label="Revisar vendas" data-act="revfechar"><div class="pdSh" style="max-height:84vh;overflow:auto"><div class="pdAl"></div><b style="font-size:19px">Revisar vendas</b><div class="hint" style="margin:2px 0 10px">Vendas feitas sem internet que o estoque não confirmou.</div>';
    if (!l.length) h += '<div class="hint">Nada para revisar. 👍</div>';
    l.slice(0, 20).forEach(function (s) {
      h += '<div class="card col" style="padding:12px;margin-bottom:10px"><b>' + esc(descOf(s)) + '</b><div class="hint" style="margin:2px 0">' + esc(apNome(s.ap)) + ' · ' + fh(s.ts) + ' · ' + gs(s.price) + '</div>' +
        '<div class="note n-warn" style="margin:6px 0">O estoque dessa peça ficou negativo: outra venda da mesma peça foi feita em outro aparelho.</div>' +
        '<button type="button" class="btn" data-act="revok" data-id="' + esc(s.id) + '" style="width:100%;margin-bottom:6px">Está certo (a peça existe)</button>' +
        '<button type="button" class="btn" data-act="revfalta" data-id="' + esc(s.id) + '" style="width:100%;background:transparent;color:var(--accent-fg);border:1.5px solid var(--accent)">Faltou a peça (tratar com a cliente)</button></div>';
    });
    return h + '<button type="button" class="btn" data-act="revfechar" style="width:100%;margin-top:6px">Fechar</button></div></div>';
  }
  ACT.syncver = function (ap) {
    atvAbre(ap);
  };
  ACT.revabrir = function () {
    S._revAberta = true;
    render();
  };
  ACT.revfechar = function () {
    S._revAberta = false;
    render();
  };
  function revMarca(id, v) {
    var s = (S.sales || []).filter(function (x) {
      return x.id === id;
    })[0];
    if (s) {
      s.rev = v;
      saveSoon();
    }
    render();
  }
  ACT.revok = function (id) {
    revMarca(id, 'ok');
  };
  ACT.revfalta = function (id) {
    revMarca(id, 'falta');
  };
  window.__syncOffline = function () {
    return navigator.onLine === false || SYNC_INFO.estado === 'sem' || SYNC_INFO.estado === 'erro';
  };
  window.__vendaApHtml = vendaApHtml;
  window.__revBannerHtml = revBannerHtml;
  window.__revJanelaHtml = revJanelaHtml;
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
  // ---- aparelhos: cada aparelho se registra em backups/zap-<código>; o dono pode desconectar qualquer um (rev = true)
  var syncRegT = 0,
    syncRevT = 0;
  function syncReg(forca) {
    if (!S.syncOn || !S.aparelho || (!forca && Date.now() - syncRegT < 300000)) return Promise.resolve();
    syncRegT = Date.now();
    return nvApi(
      'PATCH',
      'backups/zap-' + S.aparelho + '?updateMask.fieldPaths=nome&updateMask.fieldPaths=ts&updateMask.fieldPaths=ap&updateMask.fieldPaths=st&updateMask.fieldPaths=cod',
      JSON.stringify({ fields: { nome: nvStr(S.aparNome || ''), ts: { integerValue: String(Date.now()) }, ap: nvStr(S.aparelho), st: nvStr('ok'), cod: nvStr('') } })
    ).catch(function () {
      syncRegT = 0;
    });
  }
  // devolve true se o dono desconectou ESTE aparelho (e já desliga a sincronização aqui)
  function syncRevogado() {
    if (Date.now() - syncRevT < 60000) return Promise.resolve(false);
    syncRevT = Date.now();
    return nvApi('GET', 'backups/zap-' + S.aparelho)
      .then(function (d) {
        if (d && d.fields && d.fields.rev && d.fields.rev.booleanValue) {
          syncDesliga();
          S.syncMsg = 'Este aparelho foi desconectado pelo dono. Nada foi apagado aqui; para voltar, entre de novo na sincronização.';
          S.syncTom = 'bad';
          return true;
        }
        return false;
      })
      .catch(function () {
        return false;
      })
      .then(function (rev) {
        if (rev) return rev;
        return nvApi('GET', 'config/site')
          .then(function (d) {
            var m = d && d.fields && d.fields.syncMin ? +(d.fields.syncMin.integerValue || 0) : 0;
            syncVelho = m > SYNC_VER;
          })
          .catch(function () {})
          .then(function () {
            return false;
          });
      });
  }
  function syncListaAp() {
    return nvApi('GET', 'backups?pageSize=300&mask.fieldPaths=ap&mask.fieldPaths=nome&mask.fieldPaths=ts&mask.fieldPaths=rev&mask.fieldPaths=st&mask.fieldPaths=cod').then(function (j) {
      S._syncAps = (j.documents || [])
        .filter(function (d) {
          return /\/zap-/.test(d.name) && d.fields;
        })
        .map(function (d) {
          var f = d.fields;
          return { ap: (f.ap || {}).stringValue || d.name.split('zap-').pop(), nome: (f.nome || {}).stringValue || '', ts: +((f.ts || {}).integerValue || 0), rev: !!(f.rev || {}).booleanValue, st: (f.st || {}).stringValue || 'ok', cod: (f.cod || {}).stringValue || '' };
        })
        .sort(function (a, b) {
          return b.ts - a.ts;
        });
      S._ajForce = true;
      if (S.view === 'ajustes') render();
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
    syncP = syncRevogado()
      .then(function (rev) {
        if (rev) throw new Error('desconectado');
        if (syncVelho) throw new Error('Atualize o app para continuar sincronizando (versão antiga).');
        return syncReg();
      })
      .then(syncBaixa)
      .then(function (r) {
        // recebe primeiro, depois envia: aparelho que ficou muito tempo fora só se atualiza e não atropela ninguém
        var ap = syncAplica(S, S.syncSnap, r.ops, S.syncFeitos);
        S._atvRem = r.ops;
        if (ap.n) {
          mudou = true;
          if (window.__fxAdota) window.__fxAdota();
        }
        SYNC_INFO.neg = ap.neg;
        if (r.max > S.syncCur) S.syncCur = r.max;
        var d = syncDiff(S.syncSnap, S, S.aparelho, S.syncSeq);
        S.syncSnap = d.snap;
        SYNC_INFO.aviso = d.aviso || '';
        S.syncSeq = d.seq;
        d.ops.forEach(function (o) {
          S.syncFeitos[o.i] = o.ts;
          S.syncOut.push(o);
        });
        try {
          atvCiclo(S._atvRem, d.ops);
        } catch (e) {}
        S._atvRem = null;
        return syncEnvia();
      })
      .then(function () {
        SYNC_INFO.estado = 'ok';
        SYNC_INFO.msg = '';
      })
      .catch(function (e) {
        if (e && e.message === 'desconectado') {
          SYNC_INFO.estado = 'off';
          return;
        }
        SYNC_INFO.estado = 'erro';
        SYNC_INFO.msg = /fetch|network|sem-login/i.test((e && e.message) || '') ? 'sem conexão com a nuvem' : (e && e.message) || 'falhou';
      })
      .then(function () {
        syncBusy = false;
        SYNC_INFO.ts = Date.now();
        SYNC_INFO.pend = (S.syncOut || []).length;
        apPoll();
        var corte = Date.now() - 7 * 86400000;
        Object.keys(S.syncFeitos).forEach(function (k) {
          if (S.syncFeitos[k] < corte) delete S.syncFeitos[k];
        });
        saveSoon();
        if (mudou) render();
        else if (S.view === 'ajustes') {
          S._ajForce = true;
          render();
        }
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
  if (/#test/.test(location.hash)) window.__syncApp = { zeraRev: function () { syncRevT = 0; }, lista: syncListaAp, reg: syncReg, base: syncCriaBase, entra: syncEntra, totais: syncTotais, card: syncCard, liga: syncLiga, desliga: syncDesliga, ciclo: syncCiclo, info: SYNC_INFO };
  // ---- tela em Ajustes (só aparece no ambiente de teste ou depois de ligada; a loja real espera a migração guiada)
  function syncVisivel() {
    return !!S.syncOn || NV_TESTE;
  }
  function syncEstadoTxt() {
    var i = SYNC_INFO,
      n = (S.syncOut || []).length;
    if (!S.syncOn) return ['off', 'Desligada', 'Este aparelho não está sincronizando.'];
    if (i.estado === 'sem') return ['warn', 'Sem internet', n ? n + (n === 1 ? ' movimento guardado' : ' movimentos guardados') + '. Enviam sozinhos quando a internet voltar.' : 'Nada a enviar. Atualiza sozinha quando a internet voltar.'];
    if (i.estado === 'erro') return ['bad', 'Não consegui sincronizar', (i.msg || 'erro') + (n ? ' · ' + n + ' guardados neste aparelho.' : '') + ' Tento de novo sozinho.'];
    if (i.estado === 'env') return ['info', 'Sincronizando…', n ? n + ' para enviar' : 'Conferindo a nuvem'];
    return ['ok', 'Sincronizado', i.ts ? 'Última conferência às ' + fh(i.ts) : 'Ligada neste aparelho'];
  }
  // ---- migração guiada: o aparelho principal grava a BASE na nuvem; os outros entram a partir dela
  var SYNC_BASE = 'zbase-sync';
  function syncTotais() {
    var q = 0;
    (S.items || []).forEach(function (i) {
      if (!i.bulk) q += +i.qty || 0;
    });
    return { itens: q, pyg: Math.round(S.cash.pyg || 0), usd: Math.round((S.cash.usd || 0) * 100) / 100, brl: Math.round((S.cash.brl || 0) * 100) / 100, vendas: (S.sales || []).length };
  }
  function syncMsg(t, tom) {
    S.syncMsg = t;
    S.syncTom = tom || '';
    S._ajForce = true;
    if (S.view === 'ajustes') render();
  }
  function syncCriaBase() {
    if (!S.nuvem || !S.nuvem.rt) return syncMsg('Entre na nuvem primeiro (mais abaixo, em Backup → Nuvem).', 'bad');
    // foto do estado e cópia no MESMO instante: o que o outro aparelho baixar é exatamente o ponto de partida
    var txt = backupDados(true),
      t0 = Date.now(),
      tot = syncTotais();
    syncLiga(t0);
    syncMsg('Enviando a base para a nuvem…', 'info');
    return nvPack(txt)
      .then(function (p) {
        var n = Math.max(1, Math.ceil(p.s.length / NV_PARTE)),
          job = Promise.resolve(),
          i;
        for (i = 0; i < n; i++)
          (function (k) {
            job = job.then(function () {
              return nvApi('PATCH', 'backups/' + SYNC_BASE + '_p' + k, JSON.stringify({ fields: { d: nvStr(p.s.slice(k * NV_PARTE, (k + 1) * NV_PARTE)) } }));
            });
          })(i);
        return job.then(function () {
          return nvApi(
            'PATCH',
            'backups/' + SYNC_BASE,
            JSON.stringify({
              fields: {
                ts: { integerValue: String(t0) },
                partes: { integerValue: String(n) },
                gz: { booleanValue: p.gz },
                ap: nvStr(S.aparelho),
                tot: nvStr(JSON.stringify(tot))
              }
            })
          );
        });
      })
      .then(function () {
        syncMsg('Base enviada. Agora, no outro aparelho, toque em "Entrar na sincronização".', 'ok');
      })
      .catch(function (e) {
        syncDesliga();
        syncMsg('Não consegui enviar a base (' + ((e && e.message) || 'erro') + '). A sincronização ficou desligada; tente de novo.', 'bad');
      });
  }
  function syncEntra() {
    return apPedeEntrada(syncEntra2); // primeiro o dono aprova; depois baixa a base
  }
  function syncEntra2() {
    if (!S.nuvem || !S.nuvem.rt) return Promise.resolve(syncMsg('Entre na nuvem primeiro (mais abaixo, em Backup → Nuvem).', 'bad'));
    syncMsg('Baixando a base…', 'info');
    return nvApi('GET', 'backups/' + SYNC_BASE)
      .then(function (m) {
        var f = m.fields,
          n = +f.partes.integerValue,
          gz = !!f.gz.booleanValue,
          t0 = +f.ts.integerValue,
          tot = JSON.parse(f.tot.stringValue),
          out = [],
          job = Promise.resolve(),
          k;
        for (k = 0; k < n; k++)
          (function (kk) {
            job = job.then(function () {
              return nvApi('GET', 'backups/' + SYNC_BASE + '_p' + kk).then(function (d) {
                out[kk] = d.fields.d.stringValue;
              });
            });
          })(k);
        return job
          .then(function () {
            return nvUnpack(gz, out.join(''));
          })
          .then(function (txt) {
            try {
              localStorage.setItem('lafouch_antes_sync', backupDados(true)); // rede de segurança: como este aparelho estava antes
            } catch (e) {}
            var er = restaurarDados(txt);
            if (er) throw new Error(er);
            var agora = syncTotais(),
              dif = Object.keys(tot).filter(function (k2) {
                return Math.abs(agora[k2] - tot[k2]) > 0.001;
              });
            syncLiga(t0);
            syncMsg(
              dif.length
                ? 'Entrou, mas os totais não bateram (' + dif.join(', ') + '). Não use este aparelho para vender e me avise.'
                : 'Entrou. Conferi: estoque ' + agora.itens + ' peças, ' + agora.vendas + ' vendas e o caixa estão iguais ao aparelho principal.',
              dif.length ? 'bad' : 'ok'
            );
          });
      })
      .catch(function (e) {
        syncMsg('Não consegui entrar (' + ((e && e.message) || 'erro') + '). Nada foi ligado neste aparelho.', 'bad');
      });
  }
  function syncCard() {
    if (!syncVisivel()) return '';
    var e = syncEstadoTxt(),
      cls = e[0] === 'ok' ? 'n-ok' : e[0] === 'warn' ? 'n-warn' : e[0] === 'bad' ? 'n-bad' : 'n-info',
      h = '<section class="card col" id="syncCard"><h2 style="margin:0;font-size:16px">Sincronização entre aparelhos</h2>';
    h += '<div class="note ' + cls + '" role="status"><b>' + e[1] + '</b><div style="margin-top:2px">' + esc(e[2]) + '</div></div>';
    if (SYNC_INFO.aviso) h += '<div class="note n-warn">' + esc(SYNC_INFO.aviso) + '</div>';
    if (S.syncMsg) h += '<div class="note ' + (S.syncTom === 'ok' ? 'n-ok' : S.syncTom === 'bad' ? 'n-bad' : 'n-info') + '" role="status">' + esc(S.syncMsg) + '</div>';
    if (S.syncOn) {
      h += '<div class="hint" style="margin:0">Este aparelho: <b>' + esc(S.aparelho) + '</b></div>';
      var neg = (SYNC_INFO.neg || []).concat(
        (S.items || [])
          .filter(function (i) {
            return !i.bulk && i.qty < 0;
          })
          .map(function (i) {
            return syncChave(i);
          })
      );
      var vistos = {},
        linhas = [];
      neg.forEach(function (k) {
        if (vistos[k]) return;
        vistos[k] = 1;
        var it = S.items.filter(function (i) {
          return syncChave(i) === k;
        })[0];
        if (it && it.qty < 0) linhas.push('<div class="ln" style="display:flex;justify-content:space-between;gap:8px"><span>' + esc(it.ref) + (it.cor ? ' · ' + esc(it.cor) : '') + '</span><b style="color:var(--bad)">' + it.qty + '</b></div>');
      });
      if (linhas.length)
        h += '<div class="note n-bad"><b>Conferir estoque</b><div style="margin:4px 0">Dois aparelhos venderam a mesma peça. As vendas foram guardadas, mas o estoque ficou negativo. Confira qual peça saiu e corrija a contagem.</div>' + linhas.join('') + '</div>';
      h += apPendHtml();
      h += '<div><div class="lbl">Nome deste aparelho</div><input class="in" data-aj="synome" value="' + esc(S.aparNome || '') + '" placeholder="Ex.: Celular do dono" maxlength="30" autocomplete="off"></div>';
      var aps = (S._syncAps || []).filter(function (x) {
        return x.ap !== S.aparelho;
      });
      if (aps.length) {
        h += '<div class="lbl" style="margin-top:6px">Outros aparelhos</div>';
        aps.forEach(function (x) {
          var fl = S._apFlash === x.ap ? ' lfa-fl lfa-slr' : '';
          if (fl) S._apFlash = '';
          h += '<div class="ln' + fl + '" style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span>' + esc(x.nome || x.ap) + '<br><small style="color:var(--mut)">' + (x.rev ? 'desconectado' : x.st === 'pend' ? 'aguardando aprovação' : 'visto ' + fd(x.ts) + ' ' + fh(x.ts)) + '</small></span>' +
            '<button type="button" class="mini" data-act="syncver" data-id="' + esc(x.ap) + '">Ver o que fez</button>' +
            (x.rev ? '' : '<button type="button" class="mini" data-act="syncdesc" data-id="' + esc(x.ap) + '">' + (S._syncDesc === x.ap ? 'Confirmar' : 'Desconectar') + '</button>') + '</div>' +
            '';
        });
      }
      h += '<button type="button" class="mini" data-act="syncver" data-id="">Atividade de todos os aparelhos</button>';
      h += '<button type="button" class="mini" data-act="fotolixabre">Fotos apagadas</button>';
      h += '<button type="button" class="mini" data-act="syncagora">Sincronizar agora</button>';
      h += '<button type="button" class="mini" data-act="syncdesl" style="background:var(--card2,#2a303b)">' + (S._syncDel ? 'Desligar? Toque de novo' : 'Desligar neste aparelho') + '</button>';
    } else {
      h +=
        '<div class="hint" style="margin:0">Ambiente de teste. Os aparelhos trocam estoque, caixa e vendas. Comece pelo aparelho principal (o que tem os dados certos); depois entre com os outros.</div>' +
        '<button type="button" class="mini" data-act="syncbase">' + (S._syncC === 'base' ? 'Confirmar: este é o principal' : 'Este é o aparelho principal') + '</button>' +
        '<button type="button" class="mini" data-act="syncentra" style="background:var(--card2,#2a303b)">' + (S._syncC === 'entra' ? 'Confirmar: trocar os dados deste aparelho' : 'Entrar na sincronização (outro aparelho)') + '</button>';
    }
    return h + '</section>';
  }
  function syncConf(qual) {
    if (S._syncC !== qual) {
      S._syncC = qual;
      S._ajForce = true;
      render();
      setTimeout(function () {
        if (S._syncC === qual) {
          S._syncC = '';
          S._ajForce = true;
          if (S.view === 'ajustes') render();
        }
      }, 4000);
      return false;
    }
    S._syncC = '';
    return true;
  }
  ACT.syncbase = function () {
    if (syncConf('base')) syncCriaBase();
  };
  ACT.syncentra = function () {
    if (syncConf('entra')) syncEntra();
  };
  ACT.syncdesc = function (ap) {
    if (!/^AP[A-Z0-9]{2,8}$/.test(ap || '')) return;
    if (S._syncDesc !== ap) {
      S._syncDesc = ap;
      S._ajForce = true;
      render();
      setTimeout(function () {
        if (S._syncDesc === ap) {
          S._syncDesc = '';
          S._ajForce = true;
          if (S.view === 'ajustes') render();
        }
      }, 4000);
      return;
    }
    S._syncDesc = '';
    nvApi('PATCH', 'backups/zap-' + ap + '?updateMask.fieldPaths=rev', JSON.stringify({ fields: { rev: { booleanValue: true } } }))
      .then(syncListaAp)
      .catch(function () {
        syncMsg('Não consegui desconectar agora (sem internet?). Tente de novo.', 'bad');
      });
  };
  ACT.syncagora = function () {
    syncListaAp().catch(function () {});
    syncAgenda(true);
    SYNC_INFO.estado = 'env';
    render();
  };
  ACT.syncdesl = function () {
    if (!S._syncDel) {
      S._syncDel = 1;
      S._ajForce = true;
      render();
      setTimeout(function () {
        S._syncDel = 0;
        S._ajForce = true;
        if (S.view === 'ajustes') render();
      }, 3500);
      return;
    }
    S._syncDel = 0;
    syncDesliga();
    S._ajForce = true;
    render();
  };

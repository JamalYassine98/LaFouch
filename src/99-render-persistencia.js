  // ===== Render geral e persistência (localStorage + IndexedDB). =====
  // Redesenha o app e agenda o salvamento.
  function render() {
    try {
      refreshRefList();
    } catch (e) {}
    var sy = window.pageYOffset || 0;
    syncBulk();
    try {
      identSync();
    } catch (e) {}
    renderEstoque();
    renderEstoqueAbas();
    renderAddExtras();
    renderVendas();
    renderNav();
    try {
      notifVerifica();
    } catch (e) {}
    renderInicio();
    renderPedidos();
    renderLojaOnline();
    uniAbasFill();
    renderClientes();
    pagCliRender();
    renderNotif();
    renderDash();
    renderCaixa();
    renderDesp();
    renderFx();
    renderHist();
    renderAjustes();
    renderDay();
    saveSoon();
    if ((window.pageYOffset || 0) !== sy) window.scrollTo(0, sy);
  }

  /* ---------- fotos: miniatura (catálogo) + original em alta (IndexedDB, bem mais espaço que o localStorage) */
  function thumbOf(cv) {
    var m = 900,
      sc = Math.min(1, m / Math.max(cv.width, cv.height)),
      c = mkCanvas(Math.round(cv.width * sc), Math.round(cv.height * sc)),
      g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.fillStyle = '#fff';
    g.fillRect(0, 0, c.width, c.height);
    g.drawImage(cv, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.88);
  }
  var IDBOK = false,
    FS = {},
    idbP = null;
  // Abre o IndexedDB das fotos.
  function idb() {
    if (idbP) return idbP;
    idbP = new Promise(function (ok, no) {
      try {
        var r = indexedDB.open('lafouch-fotos', 1);
        r.onupgradeneeded = function () {
          var d = r.result;
          d.createObjectStore('fotos');
          d.createObjectStore('hq');
        };
        r.onsuccess = function () {
          IDBOK = true;
          ok(r.result);
        };
        r.onerror = function () {
          no(r.error);
        };
        r.onblocked = function () {
          no('blocked');
        };
      } catch (e) {
        no(e);
      }
    });
    return idbP;
  }
  // Executa uma transação no IndexedDB.
  function idbDo(store, mode, fn) {
    return idb().then(function (d) {
      return new Promise(function (ok, no) {
        var t = d.transaction(store, mode),
          o = t.objectStore(store),
          res = fn(o);
        t.oncomplete = function () {
          ok(res && res.result);
        };
        t.onerror = function () {
          no(t.error);
        };
        t.onabort = function () {
          no(t.error);
        };
      });
    });
  }
  // Guarda a foto (miniatura + original).
  function setFoto(k, thumb, hq) {
    S.fotos[k] = thumb;
    if (hq && hq !== thumb)
      idbDo('hq', 'readwrite', function (o) {
        return o.put(hq, k);
      }).catch(function () {});
  }
  // Grava as fotos pendentes no IndexedDB.
  function saveFotos() {
    if (!IDBOK) return;
    var k;
    for (k in S.fotos)
      if (FS[k] !== S.fotos[k]) {
        (function (kk, v) {
          idbDo('fotos', 'readwrite', function (o) {
            return o.put(v, kk);
          })
            .then(function () {
              FS[kk] = v;
            })
            .catch(function () {});
        })(k, S.fotos[k]);
      }
    for (k in FS)
      if (!(k in S.fotos)) {
        (function (kk) {
          delete FS[kk];
          idbDo('fotos', 'readwrite', function (o) {
            return o.delete(kk);
          }).catch(function () {});
          idbDo('hq', 'readwrite', function (o) {
            return o.delete(kk);
          }).catch(function () {});
        })(k);
      }
  }
  // Carrega as fotos do IndexedDB.
  function loadFotos() {
    idb()
      .then(function (d) {
        return new Promise(function (ok, no) {
          var t = d.transaction('fotos', 'readonly'),
            o = t.objectStore('fotos'),
            c = o.openCursor(),
            got = {};
          c.onsuccess = function () {
            var cur = c.result;
            if (cur) {
              got[cur.key] = cur.value;
              cur.continue();
            }
          };
          t.oncomplete = function () {
            ok(got);
          };
          t.onerror = function () {
            no(t.error);
          };
        });
      })
      .then(function (got) {
        var k;
        for (k in got) {
          FS[k] = got[k];
          if (!S.fotos[k]) S.fotos[k] = got[k];
        }
        saveFotos();
        if (window.__DBG) window.__SF = Object.keys(S.fotos);
        render();
      })
      .catch(function () {});
  }
  var SK = 'lafouch_demo_v1',
    PERSIST = [
      'uniao1',
      'nuvem',
      'pprice',
      'pcanal',
      'vitrine',
      'vitDias',
      'esgDesde',
      'vitPend',
      'vitAv',
      'metaDia',
      'diasLoja',
      'rateio',
      'faixaAuto',
      'vModo',
      'novoEm',
      'novoBase',
      'cat2',
      'cvCfg',
      'grp',
      'clientes',
      'cliNext',
      'inicioCli',
      'inicioOnl',
      'notaCidade',
      'maxVar',
      'items',
      'sales',
      'saleSeq',
      'exp',
      'nextExp',
      'imprev',
      'dlog',
      'elog',
      'cambios',
      'compras',
      'melhUso',
      'cash',
      'ini',
      'palette',
      'formats',
      'desc',
      'volume',
      'melhPeca',
      'fxHist',
      'fxPer',
      'colchUsd',
      'repQuitUsd',
      'colchUsos',
      'fxBaratoUlt',
      'sold',
      'lotes',
      'tiposX',
      'tiposDel',
      'tiposOrd',
      'pnome',
      'cpay',
      'faixas',
      'pfaixa',
      'metaUsd',
      'appStart',
      'sugIgn',
      'backupTs',
      'contagens',
      'conf',
      'tolUsd',
      'volAuto',
      'retiradas',
      'descartes',
      'totM',
      'fundoBranco',
      'notifs',
      'pedidos',
      'pedNext',
      'fxMgUlt',
      'inicioT',
      'barra',
      'attr',
      'num',
      'numNext',
      'pnAuto',
      'descAuto',
      'confCx',
      'ccLemb',
      'formas',
      'pinHash',
      'pinSalt',
      'bioOn',
      'lockMin',
      'lockSens'
    ];
  // Carrega o estado salvo.
  function loadSaved() {
    try {
      var j = localStorage.getItem(SK);
      if (!j) return;
      var d = JSON.parse(j);
      PERSIST.forEach(function (k) {
        if (d[k] !== undefined) S[k] = d[k];
      });
      if (d.grp === undefined) S.grp = [];
      try {
        dedupeItems();
      } catch (e) {}
      try {
        window.__cleanN = cleanDb();
      } catch (e) {
        window.__cleanErr = String(e);
      }
      if (d.fotos && typeof d.fotos === 'object') S.fotos = d.fotos;
      var lp = S.fxHist[S.fxHist.length - 1];
      if (lp) {
        S.fx.pyg = lp.pyg;
        S.fx.brl = lp.brl;
      }
    } catch (e) {}
  }
  var saveT = 0;
  // Agenda o salvamento (debounce).
  function saveSoon() {
    clearTimeout(saveT);
    saveT = setTimeout(function () {
      try {
        var d = {};
        PERSIST.forEach(function (k) {
          d[k] = S[k];
        });
        if (!IDBOK) d.fotos = S.fotos;
        localStorage.setItem(SK, JSON.stringify(d));
      } catch (e) {}
      saveFotos();
    }, 400);
  }
  var haviaSalvo = false;
  try {
    haviaSalvo = !!localStorage.getItem(SK);
  } catch (e) {}
  loadSaved();
  // app recém-instalado (nada salvo): abre limpo, com os modelos do catálogo. O modo de teste (#test) mantém o exemplo.
  if (!haviaSalvo && !/#test/.test(location.hash)) primeiroUso();
  iniciarLock();
  syncTipos();
  render();
  loadFotos();
  // Gancho de teste: expõe funções internas só quando a URL termina em #test (usado por tests/).
  if (/(^|[#&])test\b/.test(location.hash))
    window.__LF = {
      nvPack: nvPack, nvUnpack: nvUnpack,
      S: S, fxMargemInfo: fxMargemInfo, fxLoja: fxLoja, identSync: identSync, nomeAuto: nomeAuto, numOf: numOf, attrOf: attrOf, setAttr: setAttr, pubNome: pubNome, identTxt: identTxt, calcSale: calcSale, colchao: colchao, reservas: reservas, conv: conv, ratePyg: ratePyg,
      walletGs: walletGs, parseDec: parseDec, gUnit: gUnit, gOwn: gOwn, gTot: gTot, grpDet: grpDet,
      grpTot: grpTot, grpFalta: grpFalta, effCusto: effCusto, parseLote: parseLote, parsePedido: parsePedido, parseHaste: parseHaste,
      parseVote: parseVote, flatParse: flatParse, numAmt: numAmt, hKey: hKey, lev: lev, normRef: normRef,
      nrm: nrm, normGrau: normGrau, totalMensal: totalMensal, contasPeca: contasPeca, lotCharge: lotCharge,
      lotRefund: lotRefund, lotAdjust: lotAdjust, cleanDb: cleanDb, dedupeItems: dedupeItems, render: render,
      lotesHist: lotesHist, periodSales: periodSales, sumBy: sumBy, saveSoon: saveSoon, mkMatch: mkMatch,
      setView: setView, whiten: whiten, mkCanvas: mkCanvas, lancarCompra: lancarCompra,
      lancarMelhoria: lancarMelhoria, lancarImprevisto: lancarImprevisto, lancarPagamento: lancarPagamento,
      desfazerPagamento: desfazerPagamento, hashPinAntigo: hashPinAntigo, confereHash: confereHash, pisoPeca: pisoPeca, faixaOf: faixaOf, contasPeca: contasPeca, volTipos: volTipos, vitConfere: vitConfere, nvDestaque: nvDestaque, fillAdd: fillAdd, sazonFator: sazonFator, calcPacote: calcPacote, prodStats: prodStats, reposicao: reposicao, parados: parados, curvaAbc: curvaAbc, sugestoes: sugestoes, metaInfo: metaInfo, backupDados: backupDados, volumeAuto: volumeAuto, volumeEfetivo: volumeEfetivo, restaurarDados: restaurarDados, abaixoDoPiso: abaixoDoPiso, perdasPropositais: perdasPropositais, ACT: ACT, logDespesa: logDespesa, entradaEstoque: entradaEstoque, syncTipos: syncTipos, avisosVenc: avisosVenc, efeitoCambio: efeitoCambio, reservaCambioContas: reservaCambioContas, expOrig: expOrig, proxVenc: proxVenc, resultadoMes: resultadoMes, fluxoCaixa: fluxoCaixa, capitalEstoque: capitalEstoque, dolarFavoravel: dolarFavoravel, cotacaoPar: cotacaoPar, primeiroUso: primeiroUso, precoPerigoso: precoPerigoso, formaSel: formaSel, hashPin: hashPin, exigirAuth: exigirAuth, pinAtivo: pinAtivo, resultadoCsv: resultadoCsv, ccDias: ccDias, addSale: addSale, periodoAtual: periodoAtual, vendasPeriodo: vendasPeriodo, showSplit: showSplit, cartFinalizar: cartFinalizar, totFmt: totFmt, rFmt: rFmt, livre3: livre3, trocarPlano: trocarPlano, trocarRegistrar: trocarRegistrar, trocarDesfazer: trocarDesfazer, trocarLivre: trocarLivre, fonteDolar: fonteDolar, separacaoMoedas: separacaoMoedas, rateDe: rateDe, fxLoja: fxLoja, FX_MARGEM: FX_MARGEM, tFor: tFor, cartPrevia: cartPrevia, gs: gs, tipoOf: tipoOf, descartar: descartar
    };

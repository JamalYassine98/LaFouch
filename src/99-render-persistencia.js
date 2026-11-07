  // ===== Render geral e persistência (localStorage + IndexedDB). =====
  // Redesenha o app e agenda o salvamento.
  var RENDER_TICK = 0;
  function render() {
    RENDER_TICK++;
    try {
      ppSync();
    } catch (e) {}
    try {
      refreshRefList();
    } catch (e) {}
    var sy = window.pageYOffset || 0,
      msc = ovScrollGet();
    syncBulk();
    try {
      identSync();
    } catch (e) {}
    renderEstoque();
    renderEstoqueAbas();
    renderAddExtras();
    renderVendas();
    if (S.view === 'vendas') cjDepois();
    if (S.ebSel || $('ebBar')) ebDecora();
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
    // 'instant' porque o CSS tem scroll-behavior:smooth: sem isso a tela descia ao topo (render recria a página) e voltava rolando.
    if ((window.pageYOffset || 0) !== sy) window.scrollTo({ top: sy, left: 0, behavior: 'instant' });
    ovScrollSet(msc);
  }
  // Janelas e telas por cima (editar produto, carrinho, lote…) são recriadas a cada render: guarda e devolve a rolagem delas, para a tela não pular para o topo.
  var OVSEL = '.modal:not([hidden]),.catov:not([hidden]),[role=dialog]:not([hidden])';
  function ovChave(m) {
    return m.id || m.getAttribute('aria-label') || '';
  }
  function ovScrollGet() {
    var l = [];
    try {
      Array.prototype.forEach.call(document.querySelectorAll(OVSEL), function (m) {
        var b = m.querySelector('.modal-box'),
          k = ovChave(m);
        if (k && (m.scrollTop || (b && b.scrollTop))) l.push([k, m.scrollTop, b ? b.scrollTop : 0]);
      });
    } catch (e) {}
    return l;
  }
  function ovScrollSet(l) {
    if (!l || !l.length) return;
    try {
      var ms = document.querySelectorAll(OVSEL);
      l.forEach(function (x) {
        Array.prototype.forEach.call(ms, function (m) {
          if (ovChave(m) !== x[0]) return;
          var b = m.querySelector('.modal-box');
          if (x[1] && m.scrollTop !== x[1]) m.scrollTop = x[1];
          if (x[2] && b && b.scrollTop !== x[2]) b.scrollTop = x[2];
        });
      });
    } catch (e) {}
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
        var r = indexedDB.open('lafouch-fotos', 2);
        r.onupgradeneeded = function () {
          var d = r.result;
          // v437+: 'estado' guarda as listas grandes (vendas…), sem o limite de ~5 MB do localStorage
          ['fotos', 'hq', 'estado'].forEach(function (n) {
            if (!d.objectStoreNames.contains(n)) d.createObjectStore(n);
          });
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
    if (S._pendLig && typeof pendDepoisDeSalvar === 'function') {
      try {
        pendDepoisDeSalvar(k);
      } catch (e) {}
    }
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
      'rascunho',
      'uniao1',
      'nuvem',
      'pprice',
      'pcanal',
      'vitrine',
      'vitDias',
      'esgDesde',
      'vitPend',
      'vitFoto',
      'cad',
      'memo',
      'cadInit',
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
      'inicioMkt',
      'inicioEst',
      'estMont',
      'estPerfil',
      'fotoNota',
      'estPend',
      'mkt',
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
      'matX',
      'brindes',
      'desc',
      'volume',
      'melhPeca',
      'fxHist',
      'lm',
      'objetivos',
      'metaHist',
      'cxAv',
      'siteOf',
      'siteFora',
      'lcQtd',
      'lcPed',
      'vit',
      'fpOk',
      'siteAutoLote',
      'superEv',
      'encAv',
      'fxPer',
      'fxAvisos',
      'siteFx',
      'tabelas',
      'tabAtiva',
      'fxReal',
      'fxc',
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
      'linhaFix',
      'pAuto',
      'pTrava',
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
      'notifs',
      'pedidos',
      'pedNext',
      'baixaAuto', 'baixaAutoV', 'fechos', 'fechoAdia', 'espera',
      'resPend',
      'resOrf',
      'pixAuto',
      'pixLog',
      'syncOn',
      'syncPend',
      'atv',
      'atvPp',
      'fotosH',
      'fotosV',
      'fotosRest',
      'aparelho',
      'syncSnap',
      'syncSeq',
      'syncFeitos',
      'syncOut',
      'syncCur',
      'aparNome',
      'syncCfgTs',
      'syncPutTs',
      'fxMgUlt',
      'inicioT',
      'barra',
      'grupos',
      'attr',
      'site',
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
      'avisos',
      'lockMin',
      'lockSens',
      'arqRes',
      'arqAte',
      'arqVolta',
      'arqDia',
      'adAba',
      'giros',
      'giroPend',
      'giroSite',
      'giroIni',
      'vistas',
      'vistasTs'
    ];
  // Carrega o estado salvo.
  function loadSaved() {
    try {
      var j = localStorage.getItem(SK);
      if (!j) return;
      var d = JSON.parse(j);
      LS_TS = +d._ts || 0;
      LS_BIGIDB = !!d._bigIdb;
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
  // ===== Salvamento seguro (v438) =====
  // As listas grandes (vendas, base da sincronização, históricos) vão para o IndexedDB ('estado'/'big'), que não tem o
  // limite de ~5 MB do localStorage. O resto continua no localStorage. Se algum salvamento falhar, aparece um aviso grande
  // (antes o erro era engolido e o app parava de salvar sem avisar).
  var BIG = ['sales', 'syncSnap', 'elog', 'dlog', 'fechos', 'cpay'],
    LS_TS = 0,
    LS_BIGIDB = false,
    BIG_PRONTO = false, // só grava as listas grandes no IndexedDB depois de ter lido o que já estava lá
    BIG_IDB = false; // o IndexedDB está guardando as listas grandes
  function estadoCarrega() {
    return idbDo('estado', 'readonly', function (o) {
      return o.get('big');
    }).then(
      function (rec) {
        if (rec && rec.d && (LS_BIGIDB || (+rec.ts || 0) >= LS_TS)) {
          BIG.forEach(function (k) {
            if (rec.d[k] !== undefined) S[k] = rec.d[k];
          });
          BIG_IDB = true;
        }
        BIG_PRONTO = true;
      },
      function () {
        BIG_PRONTO = true;
      }
    );
  }
  function salvoAviso(ok) {
    var b = document.getElementById('lfSalvoErr');
    if (ok) {
      if (b) b.remove();
      return;
    }
    if (b) return;
    b = document.createElement('div');
    b.id = 'lfSalvoErr';
    b.className = 'lfSalvoErr';
    b.setAttribute('role', 'alert');
    b.innerHTML = '<b>Não consegui salvar os últimos dados neste aparelho</b><span>Não feche o app. Faça uma cópia em Ajustes › Nuvem e me avise.</span><button type="button" class="mini" id="lfSalvoTenta">Tentar de novo</button>';
    document.body.appendChild(b);
    b.querySelector('#lfSalvoTenta').onclick = function () {
      salvarAgora();
    };
  }
  function salvarAgora() {
    var d = {},
      okLs = true,
      grandes = BIG_PRONTO && IDBOK;
    // ainda não leu o IndexedDB e as listas grandes estão lá: NUNCA grava listas grandes (vazias) por cima
    var semGrandes = grandes || (!BIG_PRONTO && LS_BIGIDB);
    PERSIST.forEach(function (k) {
      if (!(semGrandes && BIG.indexOf(k) >= 0)) d[k] = S[k];
    });
    if (!IDBOK) d.fotos = S.fotos;
    d._ts = Date.now();
    if (!grandes && semGrandes) d._bigIdb = 1;
    var falhou = function () {
      // IndexedDB falhou: tenta tudo no localStorage (como antes)
      if (!BIG_PRONTO) return salvoAviso(false);
      var d2 = {};
      PERSIST.forEach(function (k) {
        d2[k] = S[k];
      });
      d2._ts = Date.now();
      try {
        localStorage.setItem(SK, JSON.stringify(d2));
        BIG_IDB = false;
        salvoAviso(true);
      } catch (e) {
        salvoAviso(false);
      }
    };
    if (grandes) {
      var big = {};
      BIG.forEach(function (k) {
        if (PERSIST.indexOf(k) >= 0) big[k] = S[k];
      });
      d._bigIdb = 1;
      idbDo('estado', 'readwrite', function (o) {
        return o.put({ ts: d._ts, d: big }, 'big');
      }).then(function () {
        BIG_IDB = true;
        try {
          localStorage.setItem(SK, JSON.stringify(d));
          salvoAviso(true);
        } catch (e) {
          salvoAviso(false);
        }
      }, falhou);
    } else {
      try {
        localStorage.setItem(SK, JSON.stringify(d));
        salvoAviso(true);
      } catch (e) {
        okLs = false;
        salvoAviso(false);
      }
    }
    return okLs;
  }
  // Agenda o salvamento (debounce).
  function saveSoon() {
    clearTimeout(saveT);
    saveT = setTimeout(function () {
      salvarAgora();
      saveFotos();
      try {
        if (S.syncOn) syncAgenda();
      } catch (e) {}
    }, 400);
  }
  var haviaSalvo = false;
  try {
    haviaSalvo = !!localStorage.getItem(SK);
  } catch (e) {}
  loadSaved();
  // v438: espera o IndexedDB entregar as listas grandes antes de abrir o app (limite de 1,5 s; se demorar, abre assim mesmo
  // e NÃO grava as listas grandes até ler o que estava lá).
  function lfBoot() {
    if (lfBoot.f) return;
    lfBoot.f = 1;
  // app recém-instalado (nada salvo): abre limpo, com os modelos do catálogo. O modo de teste (#test) mantém o exemplo.
  if (!haviaSalvo && !/#test/.test(location.hash)) primeiroUso();
  iniciarLock();
  syncTipos();
  render();
  loadFotos();
  // Gancho de teste: expõe funções internas só quando a URL termina em #test (usado por tests/).
  if (/(^|[#&])test\b/.test(location.hash))
    window.__LF = {
      barMoedas: barMoedas,
      pixRecebido: pixRecebido, ofertaFim: ofertaFim, siteMaisVendidas: function () { MV_CACHE.ts = 0; return siteMaisVendidas(); }, compLeTexto: compLeTexto, fichaLinhas: fichaLinhas, impBytes: impBytes,
      animGraficos: animGraficos, progAnim: progAnim, obturadorVoa: obturadorVoa, leitorVisor: leitorVisor, siteFx: siteFx, lfToast: lfToast, brTotais: brTotais, linhaDe: linhaDe, atdDesceu: atdDesceu, cartLeve2: cartLeve2, paPlano: paPlano, paRevisa: paRevisa, paDesfaz: paDesfaz, paFraca: paFraca, paParado: paParado, atdViu: atdViu, atdFim: atdFim, parecidas: parecidas, lmLer: lmLer, metaCardHtml: metaCardHtml, metaMes: metaMes, metaCalc: metaCalc, objPlano: objPlano, objExtra: objExtra, melhPecaAuto: melhPecaAuto, fxVeredito: fxVeredito, fxSerie: fxSerie, fxAbaHtml: fxAbaHtml, fxRepo: fxRepo, siteOfRevisa: siteOfRevisa, siteOfPct: siteOfPct, sitePrecoOferta: sitePrecoOferta, encalhadas: encalhadas, lmUsdLoja: lmUsdLoja, siteFxConfere: siteFxConfere, fxDaCasa: fxDaCasa, siteQueda: siteQueda, lmGrava: lmGrava, gsDeUsd: gsDeUsd, fpProcessa: fpProcessa, camOpen: camOpen, fpResultado: fpResultado, fpChaves: fpChaves, lcLista: lcLista, vitSugestao: vitSugestao, estProcessa: estProcessa, estFila: estFila, estResultado: estResultado, estAbre: estAbre, estDepoisFoto: estDepoisFoto, estDestino: estDestino, estTutorial: estTutorial, mkLegenda: mkLegenda, mkFatos: mkFatos, mkPlano: mkPlano, mkDatas: mkDatas, mkPascoa: mkPascoa,
      nvPack: nvPack, nvUnpack: nvUnpack, fotoPend: fotoPend, fotoPendModelos: fotoPendModelos, fotosFila: fotosFila, fmSigDe: fmSigDe, fmScore: fmScore, fmRank: fmRank, cpMenu: cpMenu, cpNota: cpNota, cpCria: cpCria, cpEntrada: cpEntrada, fmAnalisa: fmAnalisa, fmPecas: fmPecas, fmParecido: fmParecido, fmNaoAchei: fmNaoAchei, fmLeEtiqueta: fmLeEtiqueta,
      S: S, vitDocBody: vitDocBody, giroSiteFila: giroSiteFila, giroGv: giroGv, giroComprime: giroComprime, resSolta: resSolta, resOrfas: resOrfas, resEstSet: function (o) { RES_EST = o; }, vistasNaoVendidas: vistasNaoVendidas, mcInicio: mcInicio, mcSair: mcSair, mcAplica: mcAplica, cfSelos: cfSelos, renderDeNovo: renderDeNovo, setFoto: setFoto, lcPedResumoHtml: lcPedResumoHtml, lcComprarNovo: lcComprarNovo, lcForn: lcForn, arqRoda: arqRoda, arqVolta: arqVolta, arqCorte: arqCorte, arqCopia: arqCopia, salvarAgora: salvarAgora, envFolha: window.__envFolha, siteFxConfere: siteFxConfere, sitePreco: sitePreco, precoTab: precoTab, tabSugestao: tabSugestao, tabAplicaCarrinho: tabAplicaCarrinho, tabMensagem: tabMensagem, pedCliente: pedCliente, cliAchar: cliAchar, fxMargemInfo: fxMargemInfo, fxLoja: fxLoja, identSync: identSync, nomeAuto: nomeAuto, numOf: numOf, attrOf: attrOf, setAttr: setAttr, pubNome: pubNome, identTxt: identTxt, calcSale: calcSale, colchao: colchao, reservas: reservas, conv: conv, ratePyg: ratePyg,
      walletGs: walletGs, parseDec: parseDec, gUnit: gUnit, gOwn: gOwn, gTot: gTot, grpDet: grpDet,
      grpTot: grpTot, grpFalta: grpFalta, effCusto: effCusto, parseLote: parseLote, parsePedido: parsePedido, parseHaste: parseHaste,
      parseVote: parseVote, flatParse: flatParse, numAmt: numAmt, hKey: hKey, lev: lev, normRef: normRef,
      nrm: nrm, normGrau: normGrau, totalMensal: totalMensal, contasPeca: contasPeca, lotCharge: lotCharge,
      lotRefund: lotRefund, lotAdjust: lotAdjust, cleanDb: cleanDb, dedupeItems: dedupeItems, render: render,
      lotesHist: lotesHist, periodSales: periodSales, sumBy: sumBy, saveSoon: saveSoon, mkMatch: mkMatch,
      setView: setView, mkCanvas: mkCanvas, lancarCompra: lancarCompra,
      lancarMelhoria: lancarMelhoria, lancarImprevisto: lancarImprevisto, lancarPagamento: lancarPagamento,
      desfazerPagamento: desfazerPagamento, hashPinAntigo: hashPinAntigo, confereHash: confereHash, pisoPeca: pisoPeca, faixaOf: faixaOf, contasPeca: contasPeca, volTipos: volTipos, nvDestaque: nvDestaque, vitProduto: vitProduto, ofertaManut: ofertaManut, ofertaFim: ofertaFim, vitConfere: vitConfere, siteAviso: siteAviso, siteSet: siteSet, vitSync: vitSync, fillAdd: fillAdd, sazonFator: sazonFator, calcPacote: calcPacote, prodStats: prodStats, reposicao: reposicao, parados: parados, curvaAbc: curvaAbc, sugestoes: sugestoes, metaInfo: metaInfo, backupDados: backupDados, volumeAuto: volumeAuto, volumeEfetivo: volumeEfetivo, restaurarDados: restaurarDados, abaixoDoPiso: abaixoDoPiso, perdasPropositais: perdasPropositais, ACT: ACT, logDespesa: logDespesa, entradaEstoque: entradaEstoque, syncTipos: syncTipos, avisosVenc: avisosVenc, efeitoCambio: efeitoCambio, reservaCambioContas: reservaCambioContas, expOrig: expOrig, proxVenc: proxVenc, resultadoMes: resultadoMes, fluxoCaixa: fluxoCaixa, capitalEstoque: capitalEstoque, dolarFavoravel: dolarFavoravel, cotacaoPar: cotacaoPar, primeiroUso: primeiroUso, precoPerigoso: precoPerigoso, formaSel: formaSel, hashPin: hashPin, exigirAuth: exigirAuth, pinAtivo: pinAtivo, resultadoCsv: resultadoCsv, ccDias: ccDias, addSale: addSale, periodoAtual: periodoAtual, vendasPeriodo: vendasPeriodo, showSplit: showSplit, cartFinalizar: cartFinalizar, totFmt: totFmt, rFmt: rFmt, livre3: livre3, trocarPlano: trocarPlano, trocarRegistrar: trocarRegistrar, trocarDesfazer: trocarDesfazer, trocarLivre: trocarLivre, fonteDolar: fonteDolar, separacaoMoedas: separacaoMoedas, rateDe: rateDe, fxLoja: fxLoja, FX_MARGEM: FX_MARGEM, tFor: tFor, cartPrevia: cartPrevia, gs: gs, tipoOf: tipoOf, descartar: descartar, ajusteEstoque: ajusteEstoque, exclusaoEstoque: exclusaoEstoque, limpaRefExcluido: limpaRefExcluido, refAuto: refAuto, pisoDoRef: pisoDoRef, siteCheck: siteCheck, quickOpen: quickOpen, quickGo: quickGo, simRank: simRank, imgSig: imgSig, lfEntrada: lfEntrada, cloneDe: cloneDe, rascunhoGuardar: rascunhoGuardar, warpDoc: warpDoc
    };
  }
  var lfBootT = setTimeout(lfBoot, 1500);
  estadoCarrega().then(function () {
    clearTimeout(lfBootT);
    try {
      arqLe().catch(function () {});
    } catch (e) {}
    if (lfBoot.f) {
      render();
      return;
    }
    lfBoot();
  });

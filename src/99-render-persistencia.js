  function render() {
    try {
      refreshRefList();
    } catch (e) {}
    var sy = window.pageYOffset || 0;
    syncBulk();
    renderEstoque();
    renderVendas();
    renderNav();
    renderDash();
    renderCaixa();
    renderDesp();
    renderFx();
    renderHist();
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
  function setFoto(k, thumb, hq) {
    S.fotos[k] = thumb;
    if (hq && hq !== thumb)
      idbDo('hq', 'readwrite', function (o) {
        return o.put(hq, k);
      }).catch(function () {});
  }
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
      'grp',
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
      'sold',
      'lotes',
      'tiposX',
      'tiposDel',
      'tiposOrd',
      'pnome',
      'cpay'
    ];
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
  loadSaved();
  syncTipos();
  render();
  loadFotos();

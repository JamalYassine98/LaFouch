  // ===== Leitura do código da foto: OCR offline (Tesseract) e IA online. =====
  // Instrução enviada à IA para ler a etiqueta.
  function labelPrompt() {
    var pr =
      'Esta é a foto de um óculos (armação, solar ou pré-graduado). Se houver duas imagens, a primeira é um recorte ampliado da peça (use para ler textos pequenos, como o código impresso na lente ou na haste, ex. BR44118 53□18-140) e a segunda é a foto inteira. Leia SOMENTE o que estiver escrito na foto (etiqueta, haste, lente). Responda JSON com as chaves: referencia (código do modelo, ex. CX012, SP57765), medidas (ex. "56-18-140"), variante (C1 a C6 se houver), grau (apenas se for pré-graduado, ex. "+1.75"), material (ex. Alumínio), tipo ("pre","sem" ou "solar" pelo aspecto), formato (um de: ' +
      S.formats.join(', ') +
      '), cor (nome curto em português da cor da peça), extras (ex. Clip-on), pecas. Em pecas, se a foto mostrar VÁRIAS armações/óculos separados (2 ou mais), liste cada um como {caixa:[x0,y0,x1,y1] em milésimos da imagem (0 a 1000, caixa justa em volta SÓ daquela peça), variante (rótulo tipo C4 escrito perto da peça, ou null), cor (nome curto em português), qtd (número escrito ao lado do rótulo, só se existir, senão null)}; ignore logotipos e textos. Se houver só uma peça, pecas=[]. Use null quando não estiver visível. NÃO invente.';
  }
  // Leitura da etiqueta pela IA, quando disponível.
  function readSample(blobs) {
    return Promise.resolve()
      .then(function () {
        return window.claude.use('sample');
      })
      .then(function (sm) {
        if (!sm) throw { code: 'none' };
        return sm.limits().then(function (l) {
          if (!l || !l.images) throw { code: 'none' };
          var pr = labelPrompt();
          return sm.json(pr, { images: blobs, modelTier: 'default', cache: true });
        });
      });
  }

  var tessP = null,
    tessW = null;
  setTimeout(function () {
    try {
      var cn = navigator.connection;
      if (
        navigator.onLine &&
        !localStorage.getItem('lafouch_ocr_warm') &&
        !(cn && (cn.saveData || cn.type === 'cellular'))
      ) {
        getWorker().then(
          function () {
            localStorage.setItem('lafouch_ocr_warm', '1');
          },
          function () {}
        );
      }
    } catch (e) {}
  }, 8000);
  // Carrega o Tesseract (OCR) uma vez.
  function loadTess() {
    if (window.Tesseract) return Promise.resolve();
    if (tessP) return tessP;
    tessP = new Promise(function (ok, no) {
      function ld(src, fail, ms) {
        var s = document.createElement('script');
        s.src = src;
        s.onload = ok;
        s.onerror = fail;
        setTimeout(function () {
          if (!window.Tesseract) fail();
        }, ms);
        document.head.appendChild(s);
      }
      ld(
        'tess/ocr.js',
        function () {
          if (window.Tesseract) return;
          ld(
            'https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.1.1/tesseract.min.js',
            function () {
              tessP = null;
              no({ code: 'offline' });
            },
            9000
          );
        },
        4000
      );
    });
    return tessP;
  }
  var OCRDEAD = 0;
  // Worker do OCR (recriado se falhar).
  function getWorker() {
    if (tessW) return tessW;
    if (OCRDEAD && Date.now() - OCRDEAD < 90000) return Promise.reject({ code: 'dead' });
    tessW = loadTess()
      .then(function () {
        return window.Tesseract.createWorker('eng', 1, {});
      })
      .then(function (w) {
        return w
          .setParameters({
            tessedit_char_whitelist:
              'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.',
            tessedit_pageseg_mode: '11',
            user_defined_dpi: '300'
          })
          .then(function () {
            return w;
          });
      });
    tessW = Promise.race([
      tessW,
      new Promise(function (ok, no) {
        setTimeout(function () {
          no({ code: 'timeout' });
        }, 20000);
      })
    ]);
    tessW.catch(function () {
      tessW = null;
      OCRDEAD = Date.now();
    });
    return tessW;
  }
  /* prepara um recorte: cinza, contraste automático, ampliação */
  function prepTile(src, x, y, w, h, sc, bin) {
    var c = mkCanvas(Math.round(w * sc), Math.round(h * sc)),
      g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(src, x, y, w, h, 0, 0, c.width, c.height);
    var d = g.getImageData(0, 0, c.width, c.height),
      a = d.data,
      n = a.length / 4,
      hist = new Uint32Array(256),
      i,
      v;
    for (i = 0; i < n; i++) {
      v = (a[i * 4] * 0.299 + a[i * 4 + 1] * 0.587 + a[i * 4 + 2] * 0.114) | 0;
      a[i * 4] = v;
      hist[v]++;
    }
    var lo = 0,
      hi = 255,
      acc = 0,
      cut = n * 0.01;
    for (i = 0; i < 256; i++) {
      acc += hist[i];
      if (acc > cut) {
        lo = i;
        break;
      }
    }
    acc = 0;
    for (i = 255; i >= 0; i--) {
      acc += hist[i];
      if (acc > cut) {
        hi = i;
        break;
      }
    }
    var k = 255 / Math.max(20, hi - lo);
    for (i = 0; i < n; i++) {
      v = Math.max(0, Math.min(255, ((a[i * 4] - lo) * k) | 0));
      a[i * 4] = a[i * 4 + 1] = a[i * 4 + 2] = v;
      a[i * 4 + 3] = 255;
    }
    if (bin) {
      var W = c.width,
        H = c.height,
        g1 = new Uint8Array(n),
        g2 = new Uint8Array(n),
        r,
        q,
        t,
        u;
      for (i = 0; i < n; i++) g1[i] = a[i * 4];
      for (t = 0; t < 3; t++) {
        for (r = 0; r < H; r++)
          for (q = 0; q < W; q++) {
            var sm = 0,
              cn = 0;
            for (u = -1; u <= 1; u++) {
              var xx = q + u;
              if (xx >= 0 && xx < W) {
                sm += g1[r * W + xx];
                cn++;
              }
            }
            g2[r * W + q] = sm / cn;
          }
        for (r = 0; r < H; r++)
          for (q = 0; q < W; q++) {
            var sm2 = 0,
              cn2 = 0;
            for (u = -1; u <= 1; u++) {
              var yy = r + u;
              if (yy >= 0 && yy < H) {
                sm2 += g2[yy * W + q];
                cn2++;
              }
            }
            g1[r * W + q] = sm2 / cn2;
          }
      }
      var h2 = new Uint32Array(256);
      for (i = 0; i < n; i++) h2[g1[i]]++;
      var tot = n,
        sumA = 0,
        sumB = 0,
        wB = 0,
        mx = 0,
        thr = 128;
      for (i = 0; i < 256; i++) sumA += i * h2[i];
      for (i = 0; i < 256; i++) {
        wB += h2[i];
        if (!wB) continue;
        var wF = tot - wB;
        if (!wF) break;
        sumB += i * h2[i];
        var mB = sumB / wB,
          mF = (sumA - sumB) / wF,
          bt = wB * wF * (mB - mF) * (mB - mF);
        if (bt > mx) {
          mx = bt;
          thr = i;
        }
      }
      for (i = 0; i < n; i++) {
        v = g1[i] > thr ? 255 : 0;
        a[i * 4] = a[i * 4 + 1] = a[i * 4 + 2] = v;
      }
    }
    g.putImageData(d, 0, 0);
    return c;
  }
  /* lê números/letras e valida; só preenche quando tem certeza */
  var DIG = {
    O: '0',
    Q: '0',
    D: '0',
    I: '1',
    L: '1',
    l: '1',
    Z: '2',
    A: '4',
    S: '5',
    G: '6',
    B: '8'
  };
  // Corrige letras confundidas com dígitos.
  function fixDigits(t) {
    return t
      .split('')
      .map(function (ch) {
        return DIG[ch] || ch;
      })
      .join('');
  }
  var MEDRE = /(\d{2})\s?[0OoDQ]?\s?(\d{2})\s?[-–—.]?\s?(1[2-6]\d)/g;
  /* procura "REF  56□18-140": as medidas são o ponto de apoio para achar o código colado antes delas */
  function scanCodes(txts, acc) {
    acc = acc || { refs: {}, strict: {}, meds: {} };
    txts.forEach(function (T) {
      (acc.txts = acc.txts || []).push(T);
      T.split(/\n+/).forEach(function (line) {
        MEDRE.lastIndex = 0;
        var m;
        while ((m = MEDRE.exec(line))) {
          var lens = +m[1],
            br = +m[2],
            tp = +m[3];
          if (!(lens >= 38 && lens <= 66 && br >= 12 && br <= 26 && tp >= 120 && tp <= 160))
            continue;
          var k = m[1] + '□' + m[2] + '-' + m[3];
          acc.meds[k] = (acc.meds[k] || 0) + 1;
          var pre = line
              .slice(0, m.index)
              .replace(/[^A-Za-z0-9]+$/, '')
              .replace(/\s+/g, '')
              .slice(-9),
            r = pre.match(/([A-Z]{2,3}?)([0-9OQDILZASGB]{3,6})$/);
          if (r) {
            var dg = fixDigits(r[2]);
            if (/^\d{3,6}$/.test(dg)) {
              var ref = r[1] + dg;
              acc.refs[ref] = (acc.refs[ref] || 0) + 1;
              if (/^\d+$/.test(r[2])) acc.strict[ref] = (acc.strict[ref] || 0) + 1;
            }
          }
        }
      });
    });
    return acc;
  }
  // Os dois itens mais votados.
  function top2(o) {
    var k,
      a = [];
    for (k in o) a.push([k, o[k]]);
    a.sort(function (x, y) {
      return y[1] - x[1];
    });
    return a;
  }
  /* só confirma quando várias leituras independentes concordam; senão deixa em branco */
  function pickCodes(acc) {
    var rf = top2(acc.refs),
      st = top2(acc.strict),
      md = top2(acc.meds),
      best = rf[0] ? rf[0][0] : null,
      okRef =
        st[0] &&
        st[0][1] >= 3 &&
        st[0][1] >=
          2 *
            (rf.filter(function (x) {
              return x[0] !== st[0][0];
            })[0] || [0, 0])[1],
      okMed = md[0] && md[0][1] >= 3 && md[0][1] >= 2 * (md[1] || [0, 0])[1];
    return {
      ref: okRef ? st[0][0] : null,
      maybe: best,
      med: okMed ? md[0][0] : null,
      maybeMed: md[0] ? md[0][0] : null
    };
  }
  // Textos iguais ou com no máximo 1 erro?
  function lev1(a, b) {
    if (a === b) return true;
    var la = a.length,
      lb = b.length;
    if (Math.abs(la - lb) > 1) return false;
    var i = 0;
    while (i < la && i < lb && a[i] === b[i]) i++;
    if (la === lb) return a.slice(i + 1) === b.slice(i + 1);
    return la > lb ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
  }
  // Busca aproximada de um código no texto.
  function fuzzyHas(T, R) {
    var n = R.length,
      L,
      i;
    for (L = n - 1; L <= n + 1; L++)
      for (i = 0; i + L <= T.length; i++) if (lev1(T.substr(i, L), R)) return true;
    return false;
  }
  /* compara o que foi lido com as referências que já estão no catálogo (o mesmo modelo costuma entrar em várias cores) */
  function catMatch(txts) {
    var refs = {};
    S.items.forEach(function (it) {
      if (it.ref && String(it.ref).length >= 5) refs[String(it.ref).toUpperCase()] = 1;
    });
    var norm = (txts || []).map(function (t) {
        return t.toUpperCase().replace(/[^A-Z0-9]/g, '');
      }),
      votes = [];
    Object.keys(refs).forEach(function (R) {
      var c = 0;
      norm.forEach(function (T) {
        if (fuzzyHas(T, R)) c++;
      });
      if (c >= 2) votes.push([R, c]);
    });
    votes.sort(function (a, b) {
      return b[1] - a[1];
    });
    return votes.length && (votes.length === 1 || votes[0][1] >= 2 * votes[1][1])
      ? votes[0][0]
      : null;
  }
  // Lê o texto da foto com OCR offline.
  function readTess(canvas, prog) {
    return getWorker().then(function (w) {
      var W = canvas.width,
        H = canvas.height,
        acc = { refs: {}, strict: {}, meds: {} },
        hit = null,
        tiles = [],
        x,
        y,
        tw = Math.min(W, 900),
        th = Math.min(H, 600),
        sc1 = Math.min(2.5, 2600 / Math.max(W, H));
      tiles.push([0, 0, W, H, Math.min(2.5, 2600 / Math.max(W, H))]);
      for (y = 0; y < H; y += Math.floor(th * 0.6)) {
        for (x = 0; x < W; x += Math.floor(tw * 0.6)) {
          tiles.push([Math.min(x, W - tw), Math.min(y, H - th), tw, th, 2.5]);
          if (x + tw >= W) break;
        }
        if (y + th >= H) break;
      }
      var total = tiles.length + 12,
        done = 0;
      function tick() {
        done++;
        if (prog) prog(Math.min(done, total), total);
      }
      function setPsm(v) {
        return w.setParameters({ tessedit_pageseg_mode: String(v) });
      }
      function findHit(r, t) {
        var ws = (r.data.words || []).filter(function (q) {
          return /-\s?1[2-6]\d$/.test(q.text || '') && (q.text || '').length >= 6;
        });
        if (ws.length && !hit) {
          var q = ws[0].bbox;
          hit = {
            x: t[0] + q.x0 / t[4],
            y: t[1] + q.y0 / t[4],
            w: (q.x1 - q.x0) / t[4],
            h: (q.y1 - q.y0) / t[4],
            long: ws[0].text.length >= 12
          };
        }
      }
      /* etapa 1: varre a peça em blocos até achar a linha das medidas */
      function stage1(n) {
        if (n >= tiles.length || hit) return Promise.resolve();
        var t = tiles[n];
        tick();
        return w.recognize(prepTile(canvas, t[0], t[1], t[2], t[3], t[4])).then(function (r) {
          scanCodes([r.data.text], acc);
          findHit(r, t);
          return stage1(n + 1);
        });
      }
      /* etapa 2: recorta a linha em volta do código, amplia e lê de várias formas; os acertos repetidos viram "certeza" */
      function stage2() {
        if (!hit) return Promise.resolve();
        var jobs = [],
          pads = hit.long
            ? [
                [0.15, 0.1, 0.4, 0.4],
                [0.3, 0.15, 0.6, 0.6],
                [0.15, 0.1, 0.25, 0.25]
              ]
            : [
                [1.7, 0.15, 0.4, 0.4],
                [2.2, 0.2, 0.7, 0.7],
                [1.5, 0.1, 0.3, 0.3]
              ];
        pads.forEach(function (pd) {
          [
            [7, 1],
            [6, 1],
            [6, 0],
            [7, 0]
          ].forEach(function (v) {
            jobs.push([pd, 3, v[0], v[1]]);
          });
        });
        function run(n) {
          if (n >= jobs.length) return Promise.resolve();
          var jb = jobs[n],
            pd = jb[0],
            cx0 = Math.max(0, hit.x - hit.w * pd[0]),
            cx1 = Math.min(W, hit.x + hit.w * (1 + pd[1])),
            cy0 = Math.max(0, hit.y - hit.h * pd[2]),
            cy1 = Math.min(H, hit.y + hit.h * (1 + pd[3]));
          tick();
          return setPsm(jb[2])
            .then(function () {
              return w.recognize(prepTile(canvas, cx0, cy0, cx1 - cx0, cy1 - cy0, jb[1], jb[3]));
            })
            .then(function (r) {
              scanCodes([r.data.text], acc);
              var p = pickCodes(acc);
              if (p.ref && p.med) return;
              return run(n + 1);
            });
        }
        return run(0);
      }
      return setPsm(11)
        .then(function () {
          return stage1(0);
        })
        .then(stage2)
        .then(function () {
          var p = pickCodes(acc);
          return {
            referencia: p.ref,
            medidas: p.med,
            _maybe: p.maybe,
            _maybeMed: p.maybeMed,
            _cat: p.ref ? null : catMatch(acc.txts)
          };
        });
    });
  }
  /* app instalado: baixa o leitor uma vez (com internet) para depois funcionar offline */
  setTimeout(function () {
    try {
      if (navigator.onLine && navigator.serviceWorker && navigator.serviceWorker.controller)
        getWorker().catch(function () {});
    } catch (e) {}
  }, 6000);
  // Mostra o estado da leitura.
  function setRead(t, cls) {
    if (t && !/…\s*$/.test(t)) loadMsg(false);
    var e = $('phRead');
    e.hidden = !t;
    e.className = 'note ' + (cls || 'n-info');
    e.textContent = t || '';
  }
  // Aplica o resultado da leitura aos campos.
  function applyRead(r, tok, eng) {
    if (!P || P.tok !== tok || !r) return;
    var got = [];
    if (r.pecas && r.pecas.length >= 2 && P.full) {
      var bx = r.pecas.map(function (q) {
          return q && q.caixa && q.caixa.length === 4
            ? q.caixa.map(function (v) {
                return Math.max(0, Math.min(1, v / 1000));
              })
            : null;
        }),
        okb = bx.every(function (b) {
          return b && b[2] > b[0] + 0.02 && b[3] > b[1] + 0.02;
        });
      if (okb) {
        openBatch(bx, P.full, r.pecas, r);
        return;
      }
    }
    function nz(x) {
      return x != null && x !== '' && String(x).toLowerCase() !== 'null';
    }
    if (nz(r.referencia) && !$('phRef').value.trim()) {
      $('phRef').value = String(r.referencia).toUpperCase().replace(/\s/g, '');
      got.push('referência ' + $('phRef').value);
    }
    if (nz(r.medidas) && !$('phMed').value.trim()) {
      var mm = String(r.medidas).match(/(\d{2})\D+(\d{2})\D+(\d{3})/);
      if (mm) {
        $('phMed').value = mm[1] + '□' + mm[2] + '-' + mm[3];
        got.push('medidas ' + $('phMed').value);
      }
    }
    if (nz(r.variante) && /^C(?:1[0-2]|[1-9])$/i.test(r.variante)) {
      ensureVar(r.variante);
      P.vr = r.variante.toUpperCase();
      got.push(P.vr);
    }
    if (nz(r.grau) && !$('phGrau').value.trim()) {
      var gn = normGrau(r.grau);
      if (gn) {
        $('phGrau').value = gn;
        got.push('grau ' + gn);
      }
    }
    if (nz(r.tipo) && ['pre', 'sem', 'solar'].indexOf(r.tipo) >= 0 && !P.photoOnly) {
      P.tipo = r.tipo;
      got.push('tipo');
    }
    if (nz(r.formato)) {
      var fm = S.formats.filter(function (x) {
        return x.toLowerCase() === String(r.formato).toLowerCase();
      })[0];
      if (fm) {
        P.fmt = fm;
        got.push('formato ' + fm);
      }
    }
    if (nz(r.cor) && !P.corSet && !P.photoOnly) {
      /*cor lida pela IA só sugere se a paleta tiver igual*/ var cn = Object.keys(S.palette).filter(
        function (k) {
          return k.toLowerCase() === String(r.cor).toLowerCase();
        }
      )[0];
      if (cn) {
        $('phCor').value = cn;
        got.push('cor ' + cn);
      }
    }
    var nt = [r.extras, r.material].filter(nz).join(' · ');
    if (nt && !$('phNotas').value.trim()) {
      $('phNotas').value = nt;
      $('phDescP').value = ($('phDescP').value.trim() + ' ' + nt).trim();
      got.push(nt);
    }
    if (got.length)
      setRead(
        'Li na foto (' + (eng || '') + '): ' + got.join(', ') + '. Confira antes de confirmar.',
        'n-ok'
      );
    else
      setRead(
        'Não consegui ler um código nesta foto (' + (eng || '') + '). Digite a referência.',
        'n-warn'
      );
    render();
  }
  // Recorta a área da etiqueta para leitura.
  function cropForRead(img, bb) {
    var w = img.naturalWidth || img.width,
      h = img.naturalHeight || img.height,
      pd = 0.08,
      x0 = Math.max(0, (bb[0] - pd) * w),
      y0 = Math.max(0, (bb[1] - pd) * h),
      x1 = Math.min(w, (bb[2] + pd) * w),
      y1 = Math.min(h, (bb[3] + pd) * h),
      cw = x1 - x0,
      ch = y1 - y0,
      sc = Math.min(1, 2000 / Math.max(cw, ch)),
      c = mkCanvas(cw * sc, ch * sc),
      g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(img, x0, y0, cw, ch, 0, 0, c.width, c.height);
    return c;
  }
  // Lê o código da foto (IA online; senão OCR offline).
  function readPhoto(full, tok, img, bb) {
    setRead('Lendo o código da foto…', 'n-info');
    var crop = img && bb ? cropForRead(img, bb) : full,
      eng = 'Claude';
    Promise.all([toBlob(crop, 0.92), toBlob(full, 0.85)]).then(function (bl) {
      return readSample(crop === full ? [bl[0]] : bl).then(
        function (r) {
          applyRead(r, tok, 'Claude');
        },
        function () {
          return readTess(crop, function (i, n) {
            if (P && P.tok === tok)
              setRead('Lendo o código da foto… (' + i + '/' + n + ')', 'n-info');
          }).then(
            function (r) {
              applyRead(r, tok, 'leitura local');
              if (!r.referencia && r._cat && P && P.tok === tok && !$('phRef').value.trim()) {
                $('phRef').value = r._cat;
                render();
                setRead(
                  'Parece ' +
                    r._cat +
                    ' (já está no seu catálogo)' +
                    (r.medidas ? ', medidas ' + r.medidas : '') +
                    '. Confira na peça antes de confirmar.',
                  'n-ok'
                );
              } else if (!r.referencia && P && P.tok === tok && !$('phRef').value.trim())
                setRead(
                  (r.medidas
                    ? 'Li as medidas ' + r.medidas + ', mas não tenho certeza do código'
                    : 'Não tenho certeza do código') +
                    (r._maybe ? ' (parece ' + r._maybe + ', confira)' : '') +
                    '. Toque em "Foto de perto só do código" ou digite a referência.' +
                    httpsHint(),
                  'n-warn'
                );
            },
            function (e) {
              if (P && P.tok === tok)
                setRead(
                  e && (e.code === 'offline' || e.code === 'timeout')
                    ? 'Leitor de texto ainda não baixado. Abra o app uma vez com internet e tente de novo. Por enquanto, digite a referência.'
                    : 'Não consegui ler o código nesta foto. Digite a referência.',
                  'n-warn'
                );
            }
          );
        }
      );
    });
  }

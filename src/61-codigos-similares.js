  // ===== Códigos parecidos e utilitários do leitor de haste. =====
  // Chave normalizada de um código (A–Z, 0–9).
  function hKey(t) {
    return String(t)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .replace(/[OQD]/g, '0')
      .replace(/[IL]/g, '1')
      .replace(/Z/g, '2')
      .replace(/S/g, '5')
      .replace(/G/g, '6')
      .replace(/B/g, '8');
  }
  /* códigos parecidos do mesmo grupo (ex.: PY-566 e PY-568): modelos diferentes que podem dividir o mesmo nome de produto */
  function simRefs(ref) {
    var out = [],
      seen = {};
    try {
      var r = String(ref || '')
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, ''),
        m = r.match(/^([A-Z]{2,3})(\d{3,6})$/);
      if (!m) return out;
      S.items.forEach(function (i) {
        if (!i.ref) return;
        var r2 = String(i.ref)
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, '');
        if (r2 === r) return;
        var m2 = r2.match(/^([A-Z]{2,3})(\d{3,6})$/);
        if (!m2 || m2[1] !== m[1] || m2[2].length !== m[2].length || lev(m2[2], m[2]) > 2) return;
        var nm = S.pnome && S.pnome[i.ref];
        if (!nm || seen[nm]) return;
        seen[nm] = 1;
        out.push({ ref: i.ref, nome: nm });
      });
    } catch (e) {}
    return out;
  }
  // Mostra o aviso de códigos parecidos.
  function updSim(refId, nomeId, afterId, boxId, skip) {
    var box = $(boxId);
    if (!box) {
      var af = $(afterId);
      if (!af || !af.parentNode) return;
      box = document.createElement('div');
      box.id = boxId;
      box.style.cssText = 'display:flex;flex-direction:column;gap:6px;margin:6px 0';
      af.parentNode.insertBefore(box, af.nextSibling);
    }
    var ref = $(refId) ? $(refId).value : '',
      key = skip ? '' : ref + '|' + ($(nomeId) ? $(nomeId).value : '');
    if (box.__k === key) return;
    box.__k = key;
    box.textContent = '';
    if (skip || !ref) return;
    var ss = simRefs(ref)
      .filter(function (x) {
        return !$(nomeId) || $(nomeId).value.trim() !== x.nome;
      })
      .slice(0, 2);
    if (!ss.length) return;
    ss.forEach(function (x) {
      var t = mk(
        'div',
        'hint',
        'Código parecido com ' +
          x.ref +
          ' (“' +
          x.nome +
          '”). Se for outro modelo do mesmo grupo, pode usar o mesmo nome de produto.'
      );
      t.style.color = 'var(--warn)';
      box.appendChild(t);
      var b = btn('chip', 'Usar o nome “' + x.nome + '”', function () {
        var ni = $(nomeId);
        if (ni) {
          ni.value = x.nome;
          try {
            ni.dispatchEvent(new Event('input', { bubbles: true }));
          } catch (e) {}
        }
        box.__k = '';
        box.textContent = '';
      });
      b.style.cssText += ';width:100%;justify-content:center;min-height:42px';
      box.appendChild(b);
    });
  }
  // Distância de Levenshtein.
  function lev(a, b) {
    var m = a.length,
      n = b.length,
      d = [],
      i,
      j;
    for (i = 0; i <= m; i++) {
      d[i] = [i];
    }
    for (j = 1; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++)
      for (j = 1; j <= n; j++)
        d[i][j] = Math.min(
          d[i - 1][j] + 1,
          d[i][j - 1] + 1,
          d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
    return d[m][n];
  }
  // Cruza o texto lido com os códigos de haste.
  function hMatch(texts) {
    var words = {},
      refs = {};
    texts.forEach(function (T) {
      T.split(/\n+/).forEach(function (line) {
        var k = hKey(line);
        if (k.length >= 3) words[k] = 1;
        line.split(/\s+/).forEach(function (w) {
          var q = hKey(w);
          if (q.length >= 3) words[q] = 1;
        });
      });
    });
    S.items.forEach(function (i) {
      if (i.ref) refs[i.ref] = hKey(i.ref);
    });
    var out = [],
      W = Object.keys(words);
    Object.keys(refs).forEach(function (r) {
      var k = refs[r];
      if (k.length < 3) return;
      var best = 0;
      W.forEach(function (w) {
        var sc = 0;
        if (w === k) sc = 10;
        else if (k.length >= 4 && w.indexOf(k) >= 0) sc = 9;
        else if (k.length >= 5) {
          for (var L = k.length - 1; L <= k.length + 1 && !sc; L++) {
            if (L === k.length) continue;
            for (var o = 0; o + L <= w.length; o++) {
              if (lev(w.substr(o, L), k) <= 1) {
                sc = 5;
                break;
              }
            }
          }
        }
        if (sc > best) best = sc;
      });
      if (best) out.push([r, best]);
    });
    out.sort(function (a, b) {
      return b[1] - a[1];
    });
    return out;
  }
  // Gira um canvas.
  function rotCv(src, deg) {
    if (!deg) return src;
    var w = src.width,
      h = src.height,
      sw = deg === 90 || deg === 270,
      c = mkCanvas(sw ? h : w, sw ? w : h),
      g = c.getContext('2d');
    g.translate(c.width / 2, c.height / 2);
    g.rotate((deg * Math.PI) / 180);
    g.drawImage(src, -w / 2, -h / 2);
    return c;
  }
  var HOV = null,
    HT = null;
  // Fecha o leitor de haste.
  function hasteClose() {
    if (HOV) {
      HOV.remove();
      HOV = null;
    }
  }

  /* ===== câmera própria: o que aparece na tela é exatamente o que é analisado ===== */

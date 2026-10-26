  // ===== Leitor de haste: busca no estoque e tela do leitor. =====
  // Busca a haste lida no estoque.
  function hFind(texts) {
    if (!HADD) return hMatch(texts);
    var ph = parseHaste(texts);
    HVR = ph.vr;
    if (ph.ref) {
      HMED = ph.med;
      return [[ph.ref, 10]];
    }
    var acc = scanCodes(
        texts.map(function (t) {
          return t.replace(/[□▢▯\[\]]/g, '0');
        })
      ),
      out = [],
      seen = {};
    HMED = ph.med || '';
    var m = top2(acc.meds);
    if (m.length && !HMED) HMED = m[0][0];
    top2(acc.refs).forEach(function (x) {
      seen[x[0]] = 1;
      out.push([x[0], 9]);
    });
    texts.forEach(function (T) {
      T.split(/\s+/).forEach(function (w) {
        w = w.toUpperCase().replace(/[^A-Z0-9]/g, '');
        var q = w.match(/^([A-Z]{2,3}?)([0-9OQDILZASGB]{3,6})$/);
        if (q) {
          var dg = fixDigits(q[2]);
          if (/^\d{3,6}$/.test(dg) && !seen[q[1] + dg]) {
            seen[q[1] + dg] = 1;
            out.push([q[1] + dg, 6]);
          }
        }
      });
    });
    out = out.filter(function (x) {
      return !out.some(function (y) {
        return (
          y !== x &&
          y[0].length >= 5 &&
          x[0].length > y[0].length &&
          x[0].slice(-y[0].length) === y[0]
        );
      });
    });
    out.forEach(function (x) {
      if (x[1] < 9 && out.length === 1) x[1] = 9;
    });
    out.sort(function (a, b) {
      return b[1] - a[1];
    });
    return out;
  }
  // Leitor de haste: foto, leitura e resultado.
  function hasteOpen(inp, add) {
    hasteClose();
    HADD = !!add;
    var ov = document.createElement('div');
    ov.id = 'hasteOv';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', 'Ler código da haste');
    ov.style.cssText =
      'position:fixed;inset:0;z-index:150;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px';
    var bx = document.createElement('div');
    bx.style.cssText =
      'background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px;width:min(94vw,440px);max-height:90vh;overflow:auto;display:flex;flex-direction:column;gap:10px';
    var hd = document.createElement('div');
    hd.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:8px';
    hd.appendChild(mk('b', '', 'Ler código da haste'));
    var x = btn('chip', '✕', hasteClose);
    x.setAttribute('aria-label', 'Fechar');
    x.style.cssText = 'min-height:36px;width:40px;padding:0;justify-content:center';
    hd.appendChild(x);
    bx.appendChild(hd);
    bx.appendChild(
      mk(
        'div',
        'hint',
        'Fotografe a haste de perto, com boa luz, deixando o código em linha reta e sem reflexo. O app lê as letras e números e procura o produto.'
      )
    );
    var st = mk('div', 'hint', '');
    st.setAttribute('role', 'status');
    st.style.cssText = 'min-height:20px;color:var(--fg)';
    var rs = document.createElement('div');
    rs.style.cssText = 'display:flex;flex-direction:column;gap:8px';
    var man = document.createElement('div');
    man.style.cssText = 'display:flex;gap:8px;align-items:center';
    var mi = document.createElement('input');
    mi.className = 'in';
    mi.placeholder = 'Ou digite o código';
    mi.style.cssText = 'flex:1 1 auto;width:auto';
    mi.autocomplete = 'off';
    function apply(v) {
      inp.value = v;
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      if (HADD && HMED && !$('eMedB').hidden && !$('eMed').value.trim()) {
        $('eMed').value = HMED;
        $('eMed').dispatchEvent(new Event('input', { bubbles: true }));
      }
      hasteClose();
    }
    var mb = btn('mini', 'Buscar', function () {
      if (mi.value.trim()) apply(mi.value.trim());
    });
    man.appendChild(mi);
    man.appendChild(mb);
    var fi = document.createElement('input');
    fi.type = 'file';
    fi.accept = 'image/*';
    fi.setAttribute('capture', 'environment');
    fi.hidden = true;
    var tk = btn('mini', 'Tirar foto da haste', function () {
      camOpen(
        function (f) {
          try {
            var dt = new DataTransfer();
            dt.items.add(f);
            fi.files = dt.files;
            fi.onchange();
          } catch (e) {}
        },
        'Foto da haste',
        { gallery: true }
      );
    });
    tk.style.width = '100%';
    function showRes(list, raw) {
      rs.textContent = '';
      if (list.length) {
        rs.appendChild(mk('div', 'lbl', HADD ? 'Qual é o código?' : 'Qual é o produto?'));
        list.slice(0, 5).forEach(function (c) {
          var it = S.items.filter(function (i) {
              return i.ref === c[0];
            })[0],
            t =
              c[0] +
              (pn(c[0]) !== c[0] ? ' · ' + pn(c[0]) : '') +
              (it && it.cor ? ' · ' + it.cor : '');
          var b = btn('chip', t, function () {
            apply(c[0]);
          });
          b.style.cssText += ';justify-content:flex-start;width:100%';
          rs.appendChild(b);
        });
      } else {
        rs.appendChild(
          mk(
            'div',
            'hint',
            (HADD
              ? 'Não consegui achar um código nessa foto.'
              : 'Não achei nenhum código do seu estoque nessa foto.') +
              (raw ? ' Li: “' + raw + '”.' : '') +
              ' Tente de novo mais perto, com a haste reta, ou digite abaixo.'
          )
        );
      }
    }
    fi.onchange = function () {
      var f = fi.files && fi.files[0];
      if (!f) return;
      rs.textContent = '';
      tk.disabled = true;
      st.textContent = 'Preparando leitor…';
      var done = function () {
        tk.disabled = false;
      };
      createImageBitmap(f)
        .then(function (bm) {
          var cv = mkCanvas(bm.width, bm.height);
          cv.getContext('2d').drawImage(bm, 0, 0);
          var all = [],
            passes = [[0], [90], [270], [180]],
            pi = 0;
          return getWorker().then(function (w) {
            var step = function () {
              if (!HOV) return;
              if (pi >= passes.length) {
                return Promise.resolve();
              }
              var deg = passes[pi++][0],
                rc = rotCv(cv, deg),
                long = Math.max(rc.width, rc.height),
                sc = Math.min(2, 1700 / long);
              st.textContent = 'Lendo a foto… (' + pi + '/' + passes.length + ')';
              var a = prepTile(rc, 0, 0, rc.width, rc.height, sc, false);
              return w.recognize(a).then(function (r) {
                all.push(r.data.text || '');
                var m = hFind(all);
                if (m.length && m[0][1] >= 9) return;
                var b2 = prepTile(rc, 0, 0, rc.width, rc.height, sc, true);
                return w.recognize(b2).then(function (r2) {
                  all.push(r2.data.text || '');
                  var m2 = hFind(all);
                  if (m2.length && m2[0][1] >= 9) return;
                  return step();
                });
              });
            };
            return step().then(function () {
              return all;
            });
          });
        })
        .then(function (all) {
          if (!HOV) return;
          var m = hFind(all);
          st.textContent = '';
          done();
          if (m.length === 1 && (m[0][1] >= 9 || HADD)) {
            apply(m[0][0]);
            return;
          }
          showRes(m, all.join(' ').replace(/\s+/g, ' ').trim().slice(0, 60));
        })
        .catch(function (e) {
          st.textContent = '';
          done();
          rs.textContent = '';
          rs.appendChild(
            mk(
              'div',
              'hint',
              e && (e.code === 'offline' || e.code === 'timeout')
                ? 'O leitor de texto ainda não foi baixado neste aparelho. Conecte à internet uma vez e tente de novo; depois ele passa a funcionar sem internet. Enquanto isso, digite o código abaixo.'
                : 'Não consegui ler essa foto. Tente de novo ou digite o código abaixo.'
            )
          );
        });
    };
    bx.appendChild(tk);
    bx.appendChild(st);
    bx.appendChild(rs);
    bx.appendChild(man);
    bx.appendChild(fi);
    ov.appendChild(bx);
    ov.addEventListener('click', function (e) {
      if (e.target === ov) hasteClose();
    });
    document.body.appendChild(ov);
    HOV = ov;
    try {
      getWorker().catch(function () {});
    } catch (e) {}
  }
  (function () {
    var cam =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
    function mkCam(inp) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.title = 'Ler código da haste com a câmera';
      b.setAttribute('aria-label', 'Ler código da haste com a câmera');
      b.style.cssText = 'min-height:44px;width:48px;padding:0;justify-content:center;flex:0 0 auto';
      b.innerHTML = cam;
      b.onclick = function () {
        hasteOpen(inp);
      };
      return b;
    }
    var q = $('q'),
      bf = $('btnFilt');
    if (q && bf) bf.parentNode.insertBefore(mkCam(q), bf);
    var v = $('vq');
    if (v) {
      var w = document.createElement('div');
      w.style.cssText = 'display:flex;gap:8px;align-items:center;max-width:540px;width:100%';
      v.parentNode.insertBefore(w, v);
      w.appendChild(v);
      v.style.flex = '1 1 0';
      v.style.width = 'auto';
      v.style.minWidth = '0';
      v.style.maxWidth = 'none';
      w.appendChild(mkCam(v));
      var fb = mk('button', 'chip');
      fb.type = 'button';
      fb.id = 'vBtnFilt';
      fb.setAttribute('aria-label', 'Filtros');
      fb.title = 'Filtros';
      fb.style.cssText =
        'min-height:44px;width:48px;padding:0;justify-content:center;flex:0 0 auto';
      fb.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5h18l-7 8v6l-4 2v-8Z"/></svg>';
      fb.onclick = function () {
        S.vFilt = !S.vFilt;
        render();
      };
      w.appendChild(fb);
      var mb = mk('button', 'chip modebtn');
      mb.type = 'button';
      mb.id = 'vModo';
      w.appendChild(mb);
    }
  })();

  $('smn').onclick = function () {
    S.qty = Math.max(1, S.qty - 1);
    S.msg = '';
    render();
  };
  $('spl').onclick = function () {
    S.qty = Math.max(1, Math.min(S._vcap || 1, S.qty + 1));
    S.msg = '';
    render();
  };
  $('sgo').onclick = cartFinalizar;

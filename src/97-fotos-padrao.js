  // ===== Guia da câmera + fotos no padrão SEM SOMBRA (v429, aprovado 05/11/2026) =====
  // Câmera de produto (opts.peca): contorno tracejado do óculos de FRENTE com hastes abertas, etiqueta
  // "Frente · hastes abertas" e conferência ao vivo (Luz boa · Fundo branco · Dentro do guia · Reto).
  // Depois da foto: "Foto aprovada" (já no padrão: fundo branco limpo, sem sombra, peça centralizada, mesmo
  // tamanho, cor e brilho iguais, endireitada, sem pontinhos) ou "Vamos tirar de novo?" com o motivo e como
  // resolver ("Usar mesmo assim" mantém a foto como foi tirada). 3/4 opcional. Ajustes › Fotos: padronizar em lote.
  var FP_W = 1200,
    FP_H = 900;
  var FP_MOT = {
    fundo: { t: 'O fundo não está branco', como: 'Use a caixa de luz ou uma folha branca atrás e embaixo da peça.' },
    degrade: { t: 'Fundo com sombra ou degradê', como: 'Acenda as duas luzes dos lados e afaste a peça do fundo.' },
    borda: { t: 'A peça está encostando na borda', como: 'Afaste o celular ou ponha a peça inteira dentro do contorno.' },
    pequena: { t: 'A peça ficou pequena', como: 'Aproxime o celular até a peça preencher o contorno.' },
    manchas: { t: "Manchas no fundo (marca d'água ou sujeira)", como: 'Limpe o fundo ou use uma foto sem marca.' },
    nada: { t: 'Não achei a peça', como: 'Ponha o óculos de frente, com as hastes abertas, no centro do contorno.' },
    escura: { t: 'Foto escura', como: 'Acenda a luz da caixa ou vá para perto da janela (sem sol direto).' },
    desfocada: { t: 'A foto ficou desfocada', como: 'Toque na peça para focar e segure o celular firme (ou use o tripé).' }
  };
  // Analisa e padroniza. Devolve { av: [códigos], cv: canvas 1200×900 no padrão }.
  function fpProcessa(src) {
    var w0 = src.naturalWidth || src.width,
      h0 = src.naturalHeight || src.height,
      k = Math.min(1, 1400 / Math.max(w0, h0)),
      W = Math.max(8, Math.round(w0 * k)),
      H = Math.max(8, Math.round(h0 * k)),
      c = mkCanvas(W, H),
      g = c.getContext('2d', { willReadFrequently: true });
    g.fillStyle = '#fff';
    g.fillRect(0, 0, W, H);
    g.drawImage(src, 0, 0, W, H);
    var im = g.getImageData(0, 0, W, H),
      a = im.data,
      N = W * H,
      av = [],
      i,
      x,
      y;
    // 1) fundo pelas bordas (média por canal)
    var f = [0, 0, 0],
      nb = 0,
      soma = function (p) {
        f[0] += a[p];
        f[1] += a[p + 1];
        f[2] += a[p + 2];
        nb++;
      };
    for (x = 0; x < W; x++) {
      soma(x * 4);
      soma(((H - 1) * W + x) * 4);
    }
    for (y = 0; y < H; y++) {
      soma(y * W * 4);
      soma((y * W + W - 1) * 4);
    }
    f = f.map(function (v) {
      return v / nb;
    });
    var lum = 0;
    for (i = 0; i < N; i++) lum += a[i * 4] * 0.3 + a[i * 4 + 1] * 0.59 + a[i * 4 + 2] * 0.11;
    lum /= N;
    if (lum < 95) av.push('escura');
    if (Math.min.apply(null, f) < 170 || Math.max.apply(null, f) - Math.min.apply(null, f) > 32) av.push('fundo');
    // 2) branco do fundo = 255 (equilibra cor e brilho de todas as fotos)
    var kr = 255 / Math.max(f[0], 1),
      kg = 255 / Math.max(f[1], 1),
      kb = 255 / Math.max(f[2], 1);
    var d = new Float32Array(N);
    for (i = 0; i < N; i++) {
      var p = i * 4,
        r = Math.min(255, a[p] * kr),
        gg = Math.min(255, a[p + 1] * kg),
        b = Math.min(255, a[p + 2] * kb);
      a[p] = r;
      a[p + 1] = gg;
      a[p + 2] = b;
      d[i] = (255 - Math.min(r, gg, b)) / 255;
    }
    // cantos: degradê ou sombra de estúdio
    var kc = Math.max(4, Math.floor(Math.min(W, H) / 12)),
      canto = function (x0, y0) {
        var s = 0;
        for (var yy = y0; yy < y0 + kc; yy++) for (var xx = x0; xx < x0 + kc; xx++) s += d[yy * W + xx];
        return (s / (kc * kc)) * 255;
      },
      cs = [canto(0, 0), canto(W - kc, 0), canto(0, H - kc), canto(W - kc, H - kc)];
    if (Math.max.apply(null, cs) - Math.min.apply(null, cs) > 18) av.push('degrade');
    // 3) a peça: componentes numa grade 1/4 (o que for minúsculo e solto é poeira)
    var s = 4,
      GW = Math.ceil(W / s),
      GH = Math.ceil(H / s),
      G = new Uint8Array(GW * GH);
    for (y = 0; y < H; y++)
      for (x = 0; x < W; x++)
        if (d[y * W + x] > 0.25) G[((y / s) | 0) * GW + ((x / s) | 0)] = 1;
    var lab = new Int32Array(GW * GH),
      comps = [],
      st = [];
    for (i = 0; i < GW * GH; i++) {
      if (!G[i] || lab[i]) continue;
      var id = comps.length + 1,
        cp = { id: id, n: 0, x0: 1e9, y0: 1e9, x1: -1, y1: -1 };
      lab[i] = id;
      st.push(i);
      while (st.length) {
        var q = st.pop(),
          qx = q % GW,
          qy = (q / GW) | 0;
        cp.n++;
        if (qx < cp.x0) cp.x0 = qx;
        if (qx > cp.x1) cp.x1 = qx;
        if (qy < cp.y0) cp.y0 = qy;
        if (qy > cp.y1) cp.y1 = qy;
        for (var dy = -1; dy <= 1; dy++)
          for (var dx = -1; dx <= 1; dx++) {
            var nx = qx + dx,
              ny = qy + dy;
            if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) continue;
            var nq = ny * GW + nx;
            if (G[nq] && !lab[nq]) {
              lab[nq] = id;
              st.push(nq);
            }
          }
      }
      comps.push(cp);
    }
    var maior = comps.reduce(function (m, cc) {
      return Math.max(m, cc.n);
    }, 0);
    if (!maior) {
      av.push('nada');
      return { av: av, cv: null };
    }
    var fica = {},
      bx = { x0: 1e9, y0: 1e9, x1: -1, y1: -1 };
    comps.forEach(function (cc) {
      if (cc.n < maior * 0.02) return;
      fica[cc.id] = 1;
      bx.x0 = Math.min(bx.x0, cc.x0);
      bx.y0 = Math.min(bx.y0, cc.y0);
      bx.x1 = Math.max(bx.x1, cc.x1);
      bx.y1 = Math.max(bx.y1, cc.y1);
    });
    var X0 = bx.x0 * s,
      Y0 = bx.y0 * s,
      X1 = Math.min(W - 1, bx.x1 * s + s - 1),
      Y1 = Math.min(H - 1, bx.y1 * s + s - 1);
    if (X0 <= 2 || Y0 <= 2 || X1 >= W - 3 || Y1 >= H - 3) av.push('borda');
    if (((X1 - X0) * (Y1 - Y0)) / N < 0.08) av.push('pequena');
    // manchas longe da peça
    var my = Math.round((Y1 - Y0) * 0.15),
      mx = Math.round((X1 - X0) * 0.06),
      lon = 0,
      sujo = 0;
    for (y = 0; y < H; y += 2)
      for (x = 0; x < W; x += 2) {
        if (x > X0 - mx && x < X1 + mx && y > Y0 - my && y < Y1 + my + (Y1 - Y0) * 0.6) continue; // embaixo da peça: a sombra dela (some no padrão)
        lon++;
        if (d[y * W + x] > 0.08) sujo++;
      }
    if (lon && sujo / lon > 0.01) av.push('manchas');
    // 4) sem sombra: o que é quase branco vira branco; poeira (componentes soltos) some
    for (y = 0; y < H; y++)
      for (x = 0; x < W; x++) {
        var j = y * W + x,
          pp = j * 4,
          l2 = lab[((y / s) | 0) * GW + ((x / s) | 0)],
          dj = d[j],
          fr = dj <= 0.07 ? 0 : dj >= 0.17 ? 1 : (dj - 0.07) / 0.1;
        if (x < X0 || x > X1 || y < Y0 || y > Y1 || (l2 && !fica[l2] && dj > 0.25)) fr = 0;
        a[pp] = 255 - (255 - a[pp]) * fr;
        a[pp + 1] = 255 - (255 - a[pp + 1]) * fr;
        a[pp + 2] = 255 - (255 - a[pp + 2]) * fr;
      }
    g.putImageData(im, 0, 0);
    // 5) endireitar pelo eixo principal da peça (só inclinação pequena: 0,8° a 10°)
    var m00 = 0,
      m10 = 0,
      m01 = 0;
    for (y = Y0; y <= Y1; y += 2)
      for (x = X0; x <= X1; x += 2)
        if (d[y * W + x] > 0.25) {
          m00++;
          m10 += x;
          m01 += y;
        }
    var ang = 0;
    if (m00 > 50) {
      var cx = m10 / m00,
        cy = m01 / m00,
        u20 = 0,
        u02 = 0,
        u11 = 0;
      for (y = Y0; y <= Y1; y += 2)
        for (x = X0; x <= X1; x += 2)
          if (d[y * W + x] > 0.25) {
            u20 += (x - cx) * (x - cx);
            u02 += (y - cy) * (y - cy);
            u11 += (x - cx) * (y - cy);
          }
      ang = 0.5 * Math.atan2(2 * u11, u20 - u02);
      if (Math.abs(ang) < (0.8 * Math.PI) / 180 || Math.abs(ang) > (5 * Math.PI) / 180) ang = 0;
    }
    // 6) monta no padrão: 1200×900, fundo branco, peça centralizada com o mesmo tamanho
    var pw = X1 - X0 + 1,
      ph = Y1 - Y0 + 1,
      out = mkCanvas(FP_W, FP_H),
      o = out.getContext('2d'),
      esca = Math.min((FP_W * 0.8) / pw, (FP_H * 0.62) / ph);
    o.fillStyle = '#fff';
    o.fillRect(0, 0, FP_W, FP_H);
    o.imageSmoothingQuality = 'high';
    o.save();
    o.translate(FP_W / 2, FP_H / 2);
    if (ang) o.rotate(-ang);
    o.drawImage(c, X0, Y0, pw, ph, (-pw * esca) / 2, (-ph * esca) / 2, pw * esca, ph * esca);
    o.restore();
    try {
      if (sharpOf(c) < 25) av.push('desfocada');
    } catch (e) {}
    return { av: av, cv: out, ang: ang };
  }
  function fpArqImg(f) {
    return new Promise(function (ok, no) {
      var u = URL.createObjectURL(f),
        im = new Image();
      im.onload = function () {
        ok(im);
      };
      im.onerror = no;
      im.src = u;
    });
  }
  function fpCvArq(cv) {
    return new Promise(function (ok) {
      cv.toBlob(
        function (b) {
          ok(new File([b], 'foto.jpg', { type: 'image/jpeg' }));
        },
        'image/jpeg',
        0.92
      );
    });
  }
  // ---- câmera: contorno + conferência ao vivo ----
  var FP_OCULOS =
    '<svg viewBox="0 0 200 80" preserveAspectRatio="xMidYMid meet" style="position:absolute;inset:6% 4%;width:92%;height:88%;overflow:visible" fill="none" stroke="#fff" stroke-width="2.2" stroke-dasharray="7 6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 22c-8 0-14 2-16 5"/><path d="M182 22c8 0 14 2 16 5"/><path d="M22 20h56c6 0 9 4 9 10l-3 22c-2 12-10 18-24 18H46c-14 0-22-6-24-18l-3-22c0-6 2-10 3-10z"/><path d="M178 20h-56c-6 0-9 4-9 10l3 22c2 12 10 18 24 18h14c14 0 22-6 24-18l3-22c0-6-2-10-3-10z"/><path d="M87 26c4-4 22-4 26 0"/></svg>';
  function fpGuia(stg, gd, vid, tip, opts) {
    gd.style.border = '0';
    gd.style.height = '42%';
    gd.innerHTML = FP_OCULOS + '<span class="fpEt">' + (opts.fp34 ? '3/4 · hastes abertas · 2 de 2' : 'Frente · hastes abertas' + (opts.peca && opts.peca !== true ? ' · 1 de 2' : '')) + '</span>';
    tip.style.bottom = '54px';
    tip.textContent = opts.fp34 ? 'Gire a peça uns 30–45° e fotografe de novo, hastes abertas.' : 'Óculos de FRENTE, hastes abertas, câmera na altura das lentes.';
    var ch = document.createElement('div');
    ch.className = 'fpCh';
    var L = [
      ['luz', 'Luz boa'],
      ['fundo', 'Fundo branco'],
      ['dentro', 'Dentro do guia'],
      ['reto', 'Reto']
    ];
    ch.innerHTML = L.map(function (l) {
      return '<span data-k="' + l[0] + '"><i></i>' + l[1] + '</span>';
    }).join('');
    stg.appendChild(ch);
    var gama = null,
      ori = function (e) {
        if (e && e.gamma != null) gama = e.gamma;
      };
    try {
      window.addEventListener('deviceorientation', ori);
    } catch (e) {}
    var cv = document.createElement('canvas'),
      T = setInterval(function () {
        if (!stg.isConnected) {
          clearInterval(T);
          window.removeEventListener('deviceorientation', ori);
          return;
        }
        var vw = vid.videoWidth,
          vh = vid.videoHeight;
        if (!vw || !vh || vid.paused) return;
        var Wd = 120,
          Hd = Math.max(16, Math.round((Wd * vh) / vw));
        cv.width = Wd;
        cv.height = Hd;
        var x2 = cv.getContext('2d', { willReadFrequently: true });
        x2.drawImage(vid, 0, 0, Wd, Hd);
        var dd = x2.getImageData(0, 0, Wd, Hd).data,
          sr = stg.getBoundingClientRect(),
          gr = gd.getBoundingClientRect(),
          kk = Math.min(sr.width / vw, sr.height / vh),
          ox = (sr.width - vw * kk) / 2,
          oy = (sr.height - vh * kk) / 2,
          gx0 = (((gr.left - sr.left - ox) / kk) * Wd) / vw,
          gy0 = (((gr.top - sr.top - oy) / kk) * Hd) / vh,
          gx1 = gx0 + ((gr.width / kk) * Wd) / vw,
          gy1 = gy0 + ((gr.height / kk) * Hd) / vh,
          lum = 0,
          fb = [0, 0, 0],
          nf = 0,
          bb = [1e9, 1e9, -1, -1],
          i,
          x,
          y;
        for (i = 0; i < Wd * Hd; i++) lum += dd[i * 4] * 0.3 + dd[i * 4 + 1] * 0.59 + dd[i * 4 + 2] * 0.11;
        lum /= Wd * Hd;
        for (y = Math.max(0, gy0 | 0); y < Math.min(Hd, gy1); y++)
          for (x = Math.max(0, gx0 | 0); x < Math.min(Wd, gx1); x++) {
            var p = (y * Wd + x) * 4;
            if (x < gx0 + 3 || x > gx1 - 4 || y < gy0 + 3 || y > gy1 - 4) {
              fb[0] += dd[p];
              fb[1] += dd[p + 1];
              fb[2] += dd[p + 2];
              nf++;
            }
          }
        if (nf) fb = fb.map(function (v) { return v / nf; });
        var fbm = Math.min(fb[0], fb[1], fb[2]),
          okFundo = nf > 0 && fbm > 165 && Math.max(fb[0], fb[1], fb[2]) - fbm < 32,
          lmx = 0,
          lmy = 0,
          rmx = 0,
          rmy = 0,
          ln = 0,
          rn = 0;
        for (y = 0; y < Hd; y++)
          for (x = 0; x < Wd; x++) {
            var q = (y * Wd + x) * 4,
              dv = fbm - Math.min(dd[q], dd[q + 1], dd[q + 2]);
            if (dv > 55) {
              if (x < bb[0]) bb[0] = x;
              if (y < bb[1]) bb[1] = y;
              if (x > bb[2]) bb[2] = x;
              if (y > bb[3]) bb[3] = y;
              if (x < (gx0 + gx1) / 2) {
                lmy += y;
                ln++;
              } else {
                rmy += y;
                rn++;
              }
            }
          }
        var temP = bb[2] > 0,
          okDentro = temP && bb[0] > gx0 + 1 && bb[2] < gx1 - 1 && bb[1] > gy0 + 1 && bb[3] < gy1 - 1 && bb[2] - bb[0] > (gx1 - gx0) * 0.45,
          okReto = gama != null ? Math.abs(gama) < 6 : ln > 5 && rn > 5 && Math.abs(lmy / ln - rmy / rn) < Hd * 0.04;
        var st = { luz: lum > 110, fundo: okFundo, dentro: okDentro, reto: okReto };
        [].forEach.call(ch.children, function (sp) {
          sp.classList.toggle('ok', !!st[sp.dataset.k]);
        });
        gd.classList.toggle('fpOk', st.luz && st.fundo && st.dentro && st.reto);
      }, 450);
  }
  // ---- depois da foto ----
  function fpResultado(f, d0, reabre, opts) {
    loadMsg(true, 'Conferindo a foto');
    fpArqImg(f)
      .then(function (im) {
        var R = fpProcessa(im);
        loadMsg(false);
        var ok = !R.av.length && R.cv,
          k34 = typeof opts.peca === 'string' && !opts.fp34 ? opts.peca : '';
        lfJanela({
          titulo: ok ? 'Foto aprovada' : 'Vamos tirar de novo?',
          cls: 'fpJn',
          monta: function (c, J) {
            var m = R.av[0] && FP_MOT[R.av[0]];
            c.innerHTML =
              (ok
                ? '<div class="fpPv"><div class="fpPc" style="background:#f4f1f4"><img id="fpI1" alt=""></div><div class="fpPc" style="background:#5a1d40"><img id="fpI2" alt=""></div></div>' +
                  '<div class="fpLs">' + ['Fundo branco, sem sombra', 'Peça inteira e centralizada', 'Nítida', 'Sem marcas'].map(function (t) { return '<span class="ok"><i></i>' + t + '</span>'; }).join('') + '</div>'
                : '<div class="fpPv"><div class="fpPc" style="background:#f4f1f4"><img id="fpI0" alt=""></div></div><div class="fpMot"><b>' + esc(m ? m.t : 'Foto fora do padrão') + '</b><div>' + esc(m ? m.como : '') + '</div>' +
                  (R.av.length > 1 ? '<small>Também: ' + R.av.slice(1).map(function (x) { return FP_MOT[x].t.toLowerCase(); }).join(' · ') + '</small>' : '') + '</div>') +
              '<button type="button" class="go" id="fpA">' + (ok ? 'Usar esta foto' : 'Tirar de novo') + '</button>' +
              (ok ? (k34 ? '<button type="button" class="mini" id="fpB" style="width:100%">Agora a de 3/4 (opcional)</button>' : '') : '<button type="button" class="mini" id="fpB" style="width:100%">Usar mesmo assim</button>');
            if (ok) {
              var u = R.cv.toDataURL('image/jpeg', 0.85);
              $('fpI1').src = u;
              $('fpI2').src = u;
            } else $('fpI0').src = URL.createObjectURL(f);
            var usa = function (depois) {
              J.fecha();
              fpCvArq(R.cv).then(function (nf) {
                d0(nf, { padrao: true });
                if (depois) setTimeout(depois, 600);
              });
            };
            $('fpA').onclick = function () {
              if (ok) return usa();
              J.fecha();
              reabre();
            };
            var b = $('fpB');
            if (b)
              b.onclick = function () {
                if (!ok) {
                  J.fecha();
                  return d0(f);
                }
                usa(function () {
                  fpFoto34(k34);
                });
              };
          }
        });
      })
      .catch(function () {
        loadMsg(false);
        d0(f);
      });
  }
  // 3/4 opcional: fica guardada junto da cor (ref|cor|34), no mesmo padrão.
  function fpFoto34(k) {
    camOpen(
      function (f2) {
        fpArqImg(f2).then(function (im) {
          var R = estProcessa(im),
            cv = R.cv || fitCanvas(im, 1800);
          setFoto(k + '|34', thumbOf(cv), cv.toDataURL('image/jpeg', 0.92));
          saveSoon();
          lfToast('Foto 3/4 guardada');
          render();
        });
      },
      'Foto 3/4',
      { gallery: true, peca: true, fp34: true, fpSem: true }
    );
  }
  // ---- lote: padronizar as fotos que já existem ----
  function fpChaves() {
    return Object.keys(S.fotos || {}).filter(function (k) {
      var p = k.split('|');
      return p.length === 2 && S.fotos[k] && itemDoRef(p[0]) && !(S.fpOk && S.fpOk[k]);
    });
  }
  function fpAjHtml() {
    var n = fpChaves().length;
    return (
      '<div class="col" style="gap:8px"><div class="hint" style="margin:0">Só o fundo vira branco (255); a armação não é alterada. Peça no centro, formato 3:2, sem esticar. As fotos novas saem do Estúdio.</div>' +
      (n ? '<button type="button" class="go" data-act="fpLote">Padronizar ' + n + (n === 1 ? ' foto' : ' fotos') + '</button>' : '<div class="note n-ok">Todas as fotos já estão no padrão.</div>') +
      '</div>'
    );
  }
  ACT.fpLote = function () {
    var ks = fpChaves(),
      feitos = 0,
      fora = 0,
      antes = {};
    if (!ks.length) return;
    loadMsg(true, 'Padronizando 0 de ' + ks.length);
    var vai = function (i) {
      if (i >= ks.length) {
        loadMsg(false);
        saveSoon();
        render();
        var J = lfJanela({
          titulo: 'Fotos padronizadas',
          monta: function (c, J2) {
            c.innerHTML = '<div class="hint" style="margin:0 0 10px">' + feitos + ' no padrão' + (fora ? ' · ' + fora + ' ficaram como estavam (foto fora do padrão: tire de novo com o guia da câmera)' : '') + '.</div><button type="button" class="go" id="fpOk">Pronto</button><button type="button" class="mini" id="fpDesf" style="width:100%">Desfazer</button>';
            $('fpOk').onclick = function () {
              J2.fecha();
            };
            $('fpDesf').onclick = function () {
              Object.keys(antes).forEach(function (k) {
                setFoto(k, antes[k].t, antes[k].h);
                delete S.fpOk[k];
              });
              saveSoon();
              J2.fecha();
              lfToast('Fotos voltaram como eram');
              render();
            };
          }
        });
        return;
      }
      var k = ks[i];
      loadMsg(true, 'Padronizando ' + (i + 1) + ' de ' + ks.length);
      fpHq(k)
        .then(function (src) {
          return new Promise(function (ok) {
            var im = new Image();
            im.onload = function () {
              ok(im);
            };
            im.onerror = function () {
              ok(null);
            };
            im.src = src;
          }).then(function (im) {
            if (!im) return;
            var R = estProcessa(im);
            if (!R.cv || R.n < 60) {
              fora++;
              return;
            }
            antes[k] = { t: S.fotos[k], h: src };
            setFoto(k, thumbOf(R.cv), R.cv.toDataURL('image/jpeg', 0.92));
            (S.fpOk = S.fpOk || {})[k] = Date.now();
            S.fotoNota[k] = { n: R.n, mot: R.mot, ts: Date.now() };
            feitos++;
          });
        })
        .catch(function () {
          fora++;
        })
        .then(function () {
          setTimeout(function () {
            vai(i + 1);
          }, 0);
        });
    };
    vai(0);
  };
  // Foto em alta da chave (IndexedDB 'hq'); sem ela, a miniatura.
  function fpHq(k) {
    return idbDo('hq', 'readonly', function (o) {
      return o.get(k);
    })
      .then(function (v) {
        return v || S.fotos[k];
      })
      .catch(function () {
        return S.fotos[k];
      });
  }
  // v462 (07/11): "Padronizar em lote" saiu de Ajustes e fica na Fila de fotos do Estúdio (fpAjHtml).

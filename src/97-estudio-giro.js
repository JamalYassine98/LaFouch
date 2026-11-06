  // ===== Estúdio: um giro, três fotos (v442, aprovado 05/11/2026) =====
  // Filma uma volta da peça no prato; o app guarda quadros a cada 0,25 s e depois você só confirma, numa régua,
  // o quadro da FRENTE (o app já sugere o mais simétrico) e o da 3/4. Saem frente + 3/4 (com a luz de estúdio) + o vídeo do giro.
  function estGiroSug(sigs) {
    // frente sugerida: o quadro mais simétrico (esquerda × direita) no miolo da imagem
    var best = 0,
      bv = -1;
    sigs.forEach(function (s, i) {
      if (s > bv) {
        bv = s;
        best = i;
      }
    });
    return best;
  }
  function estGiroSim(cv) {
    var w = 96,
      h = 54,
      c = mkCanvas(w, h),
      g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(cv, 0, 0, w, h);
    var d = g.getImageData(0, 0, w, h).data,
      s = 0,
      n = 0;
    for (var y = Math.round(h * 0.25); y < h * 0.75; y++)
      for (var x = 0; x < w / 2; x++) {
        var a = (y * w + x) * 4,
          b = (y * w + (w - 1 - x)) * 4;
        s += Math.abs(d[a] - d[b]) + Math.abs(d[a + 1] - d[b + 1]) + Math.abs(d[a + 2] - d[b + 2]);
        n++;
      }
    return -s / (n || 1);
  }
  function estGiro(ctx) {
    ctx = ctx || {};
    if (!(navigator.mediaDevices && window.MediaRecorder)) return lfToast('Este aparelho não grava vídeo pelo app');
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } } })
      .then(function (s) {
        var ov = document.createElement('div');
        ov.className = 'estCam';
        ov.innerHTML = '<div class="ecVf" style="top:0;bottom:0"><video autoplay playsinline muted></video><div class="ecTag">Comece com a peça de frente · ligue o prato · 12 s</div></div>';
        document.body.appendChild(ov);
        var v = ov.querySelector('video');
        v.srcObject = s;
        var tipos = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm'],
          mt = tipos.filter(function (t) { return MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t); })[0] || '',
          rec = new MediaRecorder(s, mt ? { mimeType: mt, videoBitsPerSecond: 5000000 } : undefined),
          ch = [],
          Q = [],
          cap = mkCanvas(16, 16);
        rec.ondataavailable = function (e) {
          if (e.data && e.data.size) ch.push(e.data);
        };
        var pega = setInterval(function () {
          if (!v.videoWidth) return;
          cap.width = v.videoWidth;
          cap.height = v.videoHeight;
          cap.getContext('2d').drawImage(v, 0, 0);
          var sim = estGiroSim(cap),
            i = Q.length;
          Q.push({ sim: sim, b: null, t: thumbOf(cap) });
          cap.toBlob(function (bl) {
            if (Q[i]) Q[i].b = bl;
          }, 'image/jpeg', 0.92);
        }, 250);
        rec.onstop = function () {
          clearInterval(pega);
          s.getTracks().forEach(function (t) { t.stop(); });
          ov.remove();
          var video = new Blob(ch, { type: mt || 'video/webm' });
          setTimeout(function () {
            estGiroEscolhe(ctx, Q, video);
          }, 300);
        };
        rec.start(500);
        var n = 12,
          tg = ov.querySelector('.ecTag'),
          iv = setInterval(function () {
            n--;
            tg.textContent = 'Gravando · ' + n + ' s';
            if (n <= 0) {
              clearInterval(iv);
              rec.stop();
            }
          }, 1000);
      })
      .catch(function () {
        lfToast('Não consegui abrir a câmera');
      });
  }
  // Escolha dos quadros: régua com a sugestão da frente; depois a 3/4.
  function estGiroEscolhe(ctx, Q, video) {
    Q = Q.filter(function (q) {
      return q.b;
    });
    if (Q.length < 4) return lfToast('O giro ficou curto demais');
    var ix = estGiroSug(Q.map(function (q) { return q.sim; })),
      passo = 'frente',
      esc = {},
      ov = document.createElement('div');
    ov.className = 'estOv';
    ov.id = 'estGiro';
    document.body.appendChild(ov);
    var pinta = function () {
      ov.innerHTML =
        '<div class="estHd"><h1 style="font-size:22px">' + (passo === 'frente' ? 'Qual é a frente?' : 'E a 3/4?') + '</h1><button type="button" class="estX" data-g="x" aria-label="Fechar">×</button></div><div class="estBody">' +
        '<div class="estImg"><img id="egImg" src="' + Q[ix].t + '" alt=""></div>' +
        '<input type="range" id="egR" min="0" max="' + (Q.length - 1) + '" value="' + ix + '" aria-label="Quadro do giro" style="width:100%">' +
        '<div class="hint" style="margin:0">' + (passo === 'frente' ? 'Já deixei no quadro mais de frente. Arraste se precisar.' : 'Arraste até a peça ficar meio de lado (3/4).') + '</div>' +
        '<button type="button" class="go" data-g="ok">Usar como ' + (passo === 'frente' ? 'frente' : '3/4') + '</button></div>';
      ov.querySelector('#egR').oninput = function () {
        ix = +this.value;
        ov.querySelector('#egImg').src = Q[ix].t;
      };
    };
    pinta();
    ov.onclick = function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.g === 'x') return ov.remove();
      if (b.dataset.g !== 'ok') return;
      esc[passo] = Q[ix].b;
      if (passo === 'frente') {
        passo = '34';
        ix = Math.min(Q.length - 1, ix + Math.max(2, Math.round(Q.length / 8)));
        return pinta();
      }
      ov.remove();
      loadMsg(true, 'Aplicando a luz de estúdio');
      var abre = function (bl) {
        return new Promise(function (ok, no) {
          var u = URL.createObjectURL(bl),
            im = new Image();
          im.onload = function () {
            ok(im);
            URL.revokeObjectURL(u);
          };
          im.onerror = no;
          im.src = u;
        });
      };
      Promise.all([abre(esc.frente), abre(esc['34'])]).then(function (ims) {
        var R1 = estProcessa(ims[0]),
          R2 = estProcessa(ims[1]);
        loadMsg(false);
        if (!R1.cv) return lfToast('Não achei a peça no quadro da frente');
        if (ctx.k) {
          estGrava(ctx.k, 'frente', R1);
          if (R2.cv) estGrava(ctx.k, '34', R2);
          estGiroGuarda(ctx.k, video);
          lfToast('Frente, 3/4 e giro salvos');
          render();
          if (ctx.fim) ctx.fim();
          return;
        }
        // antes de cadastrar: "De qual peça é?" (a frente e a 3/4 vão juntas; o giro também)
        var c2 = { nova: true, fotos: { frente: R1 }, fim: ctx.fim, giro: video };
        if (R2.cv) c2.fotos['34'] = R2;
        estDestino(c2, ctx.fim);
      }, function () {
        loadMsg(false);
        lfToast('Não consegui abrir os quadros do giro');
      });
    };
  }
  // O vídeo do giro fica no aparelho (IndexedDB) para o Marketing (Status) e o site.
  function estGiroGuarda(k, video) {
    if (!video) return Promise.resolve();
    S.giros = S.giros || {};
    S.giros[k.split('|')[0]] = { k: k, ts: Date.now(), tipo: video.type };
    saveSoon();
    return idbDo('hq', 'readwrite', function (o) {
      return o.put(video, 'giro|' + k.split('|')[0]);
    }).then(function () {
      giroSiteFila(k.split('|')[0]); // vai sozinho para o site
    }).catch(function () {});
  }
  function estGiroLe(ref) {
    return idbDo('hq', 'readonly', function (o) {
      return o.get('giro|' + ref);
    }).catch(function () {
      return null;
    });
  }

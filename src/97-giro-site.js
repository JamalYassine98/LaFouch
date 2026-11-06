  // ===== Giro 360° no site (v446, aprovado 06/11/2026) =====
  // Depois de gravar o giro no Estúdio, o vídeo vai sozinho para o site: o app comprime (até 1280 px, ~1,6 Mbps)
  // e manda para a função "midia" do Firebase, que guarda no GitHub (repositório catalogo) com a chave que fica
  // SÓ no Firebase. Sem internet, sem login ou com a função ainda não configurada, fica na fila e tenta de novo.
  // O site recebe o endereço no campo gv de produtos/<ref> e mostra o botão "360°" na página da peça.
  S.giroPend = {}; // ref -> quando entrou na fila
  S.giroSite = {}; // ref -> { p: caminho no site, v: versão }
  var GS_BUSY = false,
    GS_ESPERA = 0;
  function giroUrl() {
    return 'https://southamerica-east1-' + nvCfg().p + '.cloudfunctions.net/midia';
  }
  function giroArq(ref) {
    return String(ref).replace(/[^A-Za-z0-9_.-]/g, '_').slice(0, 60) || 'peca';
  }
  function giroSiteFila(ref) {
    if (!ref) return;
    S.giroPend = S.giroPend || {};
    S.giroPend[ref] = Date.now();
    GS_ESPERA = 0;
    saveSoon();
    setTimeout(giroCiclo, 1500);
  }
  function giroB64(b) {
    return new Promise(function (ok, no) {
      var r = new FileReader();
      r.onload = function () {
        ok(String(r.result).split(',')[1] || '');
      };
      r.onerror = no;
      r.readAsDataURL(b);
    });
  }
  // Recomprime o vídeo do giro para o site (leve para o celular da cliente). Se não der, manda o original.
  function giroComprime(blob) {
    if (!window.MediaRecorder || !blob || blob.size <= 3000000) return Promise.resolve(blob);
    return new Promise(function (ok) {
      var v = document.createElement('video'),
        u = URL.createObjectURL(blob),
        fim = false,
        rec = null,
        acabou = function (b) {
          if (fim) return;
          fim = true;
          try { URL.revokeObjectURL(u); } catch (e) {}
          ok(b && b.size > 50000 ? b : blob);
        };
      v.muted = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.src = u;
      setTimeout(function () {
        if (rec && rec.state === 'recording') rec.stop();
        else acabou(null);
      }, 45000);
      v.onerror = function () {
        acabou(null);
      };
      v.onloadedmetadata = function () {
        var W = v.videoWidth,
          H = v.videoHeight,
          k = Math.min(1, 1280 / Math.max(W, H || 1)),
          c = mkCanvas(Math.max(2, Math.round((W * k) / 2) * 2), Math.max(2, Math.round((H * k) / 2) * 2)),
          x = c.getContext('2d');
        if (!c.captureStream) return acabou(null);
        var tipos = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'],
          mt = tipos.filter(function (t) { return MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t); })[0] || '',
          ch = [];
        try {
          rec = new MediaRecorder(c.captureStream(30), mt ? { mimeType: mt, videoBitsPerSecond: 1600000 } : { videoBitsPerSecond: 1600000 });
        } catch (e) {
          return acabou(null);
        }
        rec.ondataavailable = function (e) {
          if (e.data && e.data.size) ch.push(e.data);
        };
        rec.onstop = function () {
          acabou(new Blob(ch, { type: (rec.mimeType || mt || 'video/webm').split(';')[0] }));
        };
        var desenha = function () {
          if (fim || v.ended) return;
          x.drawImage(v, 0, 0, c.width, c.height);
          if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(desenha);
          else requestAnimationFrame(desenha);
        };
        v.onended = function () {
          x.drawImage(v, 0, 0, c.width, c.height);
          setTimeout(function () {
            if (rec.state === 'recording') rec.stop();
          }, 120);
        };
        rec.start(500);
        var pr = v.play();
        if (pr && pr.then) pr.then(desenha, function () { rec.stop(); });
        else desenha();
      };
    });
  }
  function giroChama(corpo) {
    return nvToken()
      .then(function (t) {
        return fetch(giroUrl(), { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t }, body: JSON.stringify(corpo) });
      })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (!r.ok || !j.ok) throw { motivo: j.motivo || 'http-' + r.status };
          return j;
        });
      });
  }
  function giroEnvia(ref) {
    return estGiroLe(ref).then(function (b) {
      if (!b) {
        delete S.giroPend[ref];
        saveSoon();
        return;
      }
      return giroComprime(b).then(function (z) {
        var ext = /mp4/.test(z.type) ? 'mp4' : 'webm',
          path = 'media/giro/' + giroArq(ref) + '.' + ext,
          antes = S.giroSite[ref] && S.giroSite[ref].p;
        return giroB64(z).then(function (b64) {
          return giroChama({ acao: 'put', path: path, b64: b64, msg: 'Giro 360°: ' + ref }).then(function () {
            if (antes && antes !== path) giroChama({ acao: 'del', path: antes }).catch(function () {});
            S.giroSite[ref] = { p: path, v: Date.now() };
            delete S.giroPend[ref];
            if (S.site && S.site[ref]) vitFila(ref, 'upd');
            saveSoon();
            lfToast('Giro de ' + pn(ref) + ' enviado: aparece no site em cerca de 1 minuto');
          });
        });
      });
    });
  }
  // Uma peça por vez, com o app aberto (a compressão precisa da tela ligada).
  function giroCiclo() {
    if (/(^|[#&])test\b/.test(location.hash) || GS_BUSY || document.hidden || navigator.onLine === false) return;
    if (!S.nuvem || !S.nuvem.rt || Date.now() < GS_ESPERA) return;
    var ref = Object.keys(S.giroPend || {})[0];
    if (!ref) return;
    GS_BUSY = true;
    giroEnvia(ref)
      .catch(function (e) {
        // função ainda não configurada ou sem permissão: tenta de novo daqui a 1 h; outros erros, em 5 min
        GS_ESPERA = Date.now() + (e && /sem-config|sem-permissao|app-/.test(e.motivo || '') ? 3600000 : 300000);
      })
      .then(function () {
        GS_BUSY = false;
        if (Object.keys(S.giroPend || {}).length && Date.now() >= GS_ESPERA) setTimeout(giroCiclo, 3000);
      });
  }
  // Giros gravados antes desta versão também vão para o site (uma vez).
  setTimeout(function () {
    if (S.giroIni || /(^|[#&])test\b/.test(location.hash)) return;
    S.giroIni = 1;
    Object.keys(S.giros || {}).forEach(function (ref) {
      if (!S.giroSite[ref]) S.giroPend[ref] = S.giroPend[ref] || Date.now();
    });
    saveSoon();
  }, 15000);
  setInterval(giroCiclo, 120000);
  setTimeout(giroCiclo, 25000);
  // endereço do giro publicado (campo gv do produto no site)
  function giroGv(ref) {
    var g = S.giroSite && S.giroSite[ref];
    return g && g.p ? g.p + '?v=' + g.v : '';
  }

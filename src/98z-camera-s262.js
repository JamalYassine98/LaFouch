  // ===== S370 (16/11/2026) — S262 (câmera do Estúdio automática; aprovada 14/11, esboço work/s262) =====
  // Na tela ficam 6 coisas: fechar, a etiqueta da peça, a moldura, UMA frase do que fazer, o disparo e a Galeria.
  // Os controles técnicos (Medir fundo, 2 s, Peaking, gráfico de luz, ISO/velocidade/branco/foco/exposição, lente) não são
  // apagados: ficam em "Controles manuais" (ícone no canto). O app continua medindo e ajustando sozinho como antes.
  var C262_FRASE = {
    fundo: 'Falta luz: acenda a luz da caixa',
    dist: 'Aproxime ou afaste até a peça caber na moldura',
    foco: 'Segure firme: a peça ainda não está nítida',
    reto: 'Deixe o celular reto'
  };
  var C262_ICO = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>';
  function c262Monta(ov) {
    if (!ov || ov._c262) return;
    ov._c262 = 1;
    var tag = ov.querySelector('.ecTag'), medir = !!(tag && /Medir fundo/.test(tag.textContent || ''));
    ov.classList.add('ecSimples');
    if (medir) ov.classList.add('ecMedir');
    var top = ov.querySelector('.ecTop');
    if (top && !top.querySelector('.ecMan')) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ecPill ecMan';
      b.setAttribute('aria-label', 'Controles manuais');
      b.innerHTML = C262_ICO;
      b.onclick = function (e) { e.stopPropagation(); c262Manual(ov); };
      top.appendChild(b);
    }
    var vf = ov.querySelector('.ecVf');
    if (vf && !vf.querySelector('.ecFrase')) {
      var f = document.createElement('div');
      f.className = 'ecFrase';
      f.setAttribute('role', 'status');
      f.innerHTML = '<i></i><span>Abrindo a câmera…</span>';
      vf.appendChild(f);
    }
    var tik = setInterval(function () {
      if (!document.body.contains(ov)) return clearInterval(tik);
      c262Frase(ov);
    }, 300);
    cam149Monta(ov); // 149cam: desenho deitado / em pé (98z-camera-t149cam.js)
  }
  function c262Frase(ov) {
    var f = ov.querySelector('.ecFrase'), ch = ov.querySelector('#ecChips');
    if (!f || !ch) return;
    var falta = null;
    ['fundo', 'dist', 'foco', 'reto'].forEach(function (k) {
      var s = ch.querySelector('[data-k="' + k + '"]');
      if (!falta && s && !s.classList.contains('ok')) falta = k;
    });
    var txt = ov.classList.contains('ecMedir') ? 'Aponte só para a cartolina e toque em Medir fundo' : falta ? C262_FRASE[falta] : 'Tudo certo · pode fotografar';
    if (f.lastChild.textContent !== txt) f.lastChild.textContent = txt;
    f.classList.toggle('ok', !falta && !ov.classList.contains('ecMedir'));
    var gd = ov.querySelector('.ecGd');
    if (gd) gd.classList.toggle('ok262', !falta);
  }
  function c262Manual(ov) {
    var on = function (id) { var e = ov.querySelector('#' + id); return !!(e && (e.classList.contains('on') || e.getAttribute('aria-pressed') === 'true')); },
      L = [
        ['c262Medir', 'Medir o fundo', 'automático na primeira peça'],
        ['c262T2', 'Espera de 2 s antes da foto', on('ecT2') ? 'ligada' : 'desligada'],
        ['c262Pk', 'Contorno do que está nítido', on('ecPk') ? 'ligado' : 'desligado'],
        ['c262Hist', 'Gráfico de luz', ov.classList.contains('ecVerHist') ? 'na tela' : 'escondido'],
        ['c262Pro', 'Sensibilidade, velocidade, branco, foco, exposição', ov.classList.contains('ecVerPro') ? 'na tela' : 'automáticos'],
        ['c262Lente', 'Lente 1× ou 2×', ov.classList.contains('ecVerLente') ? 'na tela' : 'automática']
      ];
    var o = lfaAbre('c262Sh', '<div class="c262T"><b>Controles manuais</b><small>O app cuida de tudo sozinho. Mexa só se quiser.</small></div>' +
      L.map(function (x) { return '<button type="button" class="c262L" data-act="' + x[0] + '"><span>' + x[1] + '</span><small>' + x[2] + '</small><i aria-hidden="true">›</i></button>'; }).join(''));
    if (o) o.style.zIndex = '380';
  }
  function c262Ov() { return document.getElementById('estCam'); }
  function c262Clica(id) { var ov = c262Ov(), e = ov && ov.querySelector('#' + id); if (e) e.click(); }
  ACT.c262Medir = function () { lfaFecha('c262Sh'); c262Clica('ecFundo'); };
  ACT.c262T2 = function () { c262Clica('ecT2'); var ov = c262Ov(); if (ov) c262Manual(ov); };
  ACT.c262Pk = function () { c262Clica('ecPk'); var ov = c262Ov(); if (ov) c262Manual(ov); };
  ['Hist', 'Pro', 'Lente'].forEach(function (k) {
    ACT['c262' + k] = function () { var ov = c262Ov(); if (!ov) return; ov.classList.toggle('ecVer' + k); c262Manual(ov); };
  });
  if (window.MutationObserver)
    new MutationObserver(function (m) {
      m.forEach(function (x) { [].forEach.call(x.addedNodes, function (n) { if (n.id === 'estCam') c262Monta(n); }); });
    }).observe(document.body, { childList: true });
  // ===== S370 — S263 (tutorial novo do Estúdio; aprovado 14/11, esboço work/s263): quatro passos e "Se o app pedir" numa tela =====
  var S263_ICO = {
    prep: '<path d="M4 10h16v8H4zM8 10V8M12 10V6M16 10V8M6 4l1 2M18 4l-1 2"/>',
    peca: '<rect x="3" y="7" width="7" height="5" rx="2"/><rect x="14" y="7" width="7" height="5" rx="2"/><path d="M10 9.5h4M4 17c3-2 13-2 16 0"/>',
    giro: '<path d="M5 15c0 2 3 3 7 3s7-1 7-3-3-3-7-3-7 1-7 3zM12 12V7M8 5a4 4 0 0 1 8 0"/><path d="M16 3v2h-2"/>',
    ok: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>'
  };
  estTutorial = function () {
    var P = [
      ['prep', '1 · Prepare', 'Acenda a luz da caixa', 'Celular no tripé, de frente para o prato.'],
      ['peca', '2 · A peça', 'Ponha a peça no meio do prato', 'De frente para a câmera, hastes abertas.'],
      ['giro', '3 · O giro', 'Ligue o prato e toque em Começar', 'O app grava, confere e fecha sozinho.'],
      ['ok', '4 · Pronto', 'Confira e toque em Salvar', 'Fotos, giro e vídeo vão para a peça e para o site.']
    ],
      Q = [['“Falta luz”', 'acenda ou aproxime a luz da caixa'], ['“Afaste um pouco”', 'a peça está saindo do quadro'], ['“Prato rápido demais”', 'diminua a velocidade do prato'], ['“Deixe o prato vazio”', 'ele está medindo o fundo, 2 segundos']];
    lfJanela({
      titulo: 'Como fotografar',
      cls: 'estGuiaJn estTut263',
      monta: function (c) {
        c.innerHTML = '<p class="t263S">Quatro passos. O resto o app faz sozinho.</p>' +
          P.map(function (x) {
            return '<div class="t263P"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + S263_ICO[x[0]] + '</svg><div><small>' + x[1] + '</small><b>' + x[2] + '</b><span>' + x[3] + '</span></div></div>';
          }).join('') +
          '<div class="lbl t263L">Se o app pedir</div>' + Q.map(function (x) { return '<div class="t263Q"><b>' + x[0] + '</b><span>' + x[1] + '</span></div>'; }).join('');
      }
    });
  };

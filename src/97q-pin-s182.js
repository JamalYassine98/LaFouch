  // ===== S182 (aprovado 12/11/2026, jeito 1): tela de PIN com o teclado da La Fouch =====
  // O teclado numérico fica sempre na tela (sem o teclado do celular); bolinhas mostram quantos números já foram;
  // ao completar o PIN entra sozinho (sem botão Entrar). O botão roxo da digital abre a janela da biometria SÓ quando tocado.
  // 5 PINs errados = espera 30 s (regra de sempre, em tentarPin).
  (function () {
    var scr = $('lockScr'), inp = $('lockPin');
    if (!scr || !inp || $('pinKb')) return;
    var BIO = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 11v3M8.5 8.5A5 5 0 0 1 17 12v1.5M7 12c0 3 .5 5 1.5 7M12 7a5 5 0 0 0-5 5M16.5 17c-.3 1.2-.8 2.3-1.5 3.3M12 17.5c0 1-.3 2.2-.8 3"/><path d="M5.2 8A8 8 0 0 1 19.6 9.5"/></svg>';
    var w = document.createElement('div');
    w.id = 'pinKb';
    w.innerHTML = '<div class="pkDots" id="pkDots" aria-hidden="true"></div><div class="pkGrid">' +
      [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) { return '<button type="button" data-k="' + n + '">' + n + '</button>'; }).join('') +
      '<button type="button" class="pkBio" data-k="bio" aria-label="Usar a digital">' + BIO + '</button><button type="button" data-k="0">0</button><button type="button" class="pkDel" data-k="del" aria-label="Apagar">⌫</button></div>';
    inp.parentNode.insertBefore(w, inp);
    inp.classList.add('pkHid');
    inp.setAttribute('inputmode', 'none'); // o teclado do celular não abre
    var pinta = function () {
      var n = S.pinN || 4, v = inp.value.length, k = Math.max(n, v);
      $('pkDots').innerHTML = new Array(k + 1).join('.').split('').map(function (_, i) { return '<i class="' + (i < v ? 'on' : '') + '"></i>'; }).join('');
      $('lockGo').hidden = true; // PIN v2: sem botão Entrar — entra sozinho
      var b = w.querySelector('.pkBio');
      b.style.visibility = $('lockBio').hidden ? 'hidden' : 'visible';
    };
    w.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var k = b.getAttribute('data-k');
      if (k === 'bio') { $('lockBio').click(); return; }
      if (k === 'del') inp.value = inp.value.slice(0, -1);
      else if (inp.value.length < 8) inp.value += k;
      if (navigator.vibrate) try { navigator.vibrate(8); } catch (er) {}
      pinta();
      clearTimeout(w._t);
      if (S.pinN && inp.value.length === S.pinN) w._t = setTimeout(function () { $('lockGo').click(); setTimeout(pinta, 250); }, 120);
      else if (!S.pinN && inp.value.length === 4) { var v4 = inp.value; confereHash(v4).then(function (ok) { if (ok && inp.value === v4) { $('lockGo').click(); setTimeout(pinta, 250); } }); }
      else if (!S.pinN && inp.value.length > 4) w._t = setTimeout(function () { $('lockGo').click(); setTimeout(pinta, 250); }, 1200); // PIN antigo de outro tamanho: entra depois de uma pausa
    });
    // a cada abertura da tela: zera e redesenha (o mostrarLock já limpa o valor)
    new MutationObserver(function () { if (!scr.hidden) { inp.value = ''; pinta(); } }).observe(scr, { attributes: true, attributeFilter: ['hidden'] });
    $('lockBio').classList.add('pkHid');
    pinta();
  })();

  // ===== 149cam (aprovado 19/11/2026 18:39; "implementar" 19:25 — item 15 da Fila, parte 1) — desenho da câmera do Estúdio =====
  // Esboços: work/estudio-camera/esboco_camera_deitado.jpg e esboco_camera_empe.jpg.
  // Deitado: a câmera ocupa a altura inteira; à esquerda (fora da imagem) o ×, a etiqueta da peça e o aviso; à direita ajustes, disparo e Galeria.
  // Em pé: × e ajustes em cima, a etiqueta logo abaixo, a imagem 3:4, o aviso embaixo da imagem, o disparo no centro e a Galeria à direita.
  // As barras antigas (.ecTop/.ecBot) continuam no HTML só como "gaveta" dos controles manuais (escondidos, acionados pelo menu de ajustes).
  // Muda sozinho quando o celular gira. Regras de CSS: bloco "CÂMERA DO ESTÚDIO (149cam)" no fim do style.css.
  function cam149Monta(ov) {
    if (!ov || ov._c149) return;
    ov._c149 = 1;
    ov.classList.add('ecP');
    var P = {};
    ['ecL', 'ecR', 'ecT', 'ecTg', 'ecM', 'ecB'].forEach(function (c) {
      var d = document.createElement('div');
      d.className = 'ecPainel ' + c;
      ov.appendChild(d);
      P[c] = d;
    });
    var esp = document.createElement('span');
    esp.className = 'ecEsp';
    var arruma = function () {
      if (!document.body.contains(ov)) return;
      var d = innerWidth > innerHeight,
        q = function (s) {
          return ov.querySelector(s);
        },
        x = q('[data-c=x]:not(.ecPronto)'),
        man = q('.ecMan'),
        fundo = ov.classList.contains('ecMedir') ? q('#ecFundo') : null,
        tag = q('.ecTag'),
        fr = q('.ecFrase'),
        sh = q('.ecSh,.ecPronto'),
        gal = q('.ecGal'),
        poe = function (pai, els) {
          els.forEach(function (e) {
            if (e && e.parentNode !== pai) pai.appendChild(e);
            else if (e) pai.appendChild(e); // mantém a ordem
          });
        };
      ov.classList.toggle('ecPD', d);
      ov.classList.toggle('ecPE', !d);
      if (d) {
        poe(P.ecL, [x, tag, fr]);
        poe(P.ecR, [man, fundo, sh, gal]);
      } else {
        poe(P.ecT, [x, fundo, man]);
        poe(P.ecTg, [tag]);
        poe(P.ecM, [fr]);
        poe(P.ecB, [esp, sh, gal]);
      }
    };
    arruma();
    var ro = function () {
      if (!document.body.contains(ov)) return removeEventListener('resize', ro);
      arruma();
    };
    addEventListener('resize', ro);
    // o "Pronto" do Medir fundo troca o disparo depois de montado: arruma de novo quando a barra de baixo antiga ganha algo
    var bot = ov.querySelector('.ecBot');
    if (bot && window.MutationObserver)
      new MutationObserver(function () {
        arruma();
      }).observe(bot, { childList: true });
  }

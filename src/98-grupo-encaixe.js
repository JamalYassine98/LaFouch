  // ===== Grupos da barra: animação de ENCAIXE (v443, aprovada 05/11/2026 — docs/esbocos/grupo-encaixe-anim.html) =====
  // Juntar: os dois ícones viram peças de quebra-cabeça (o de baixo com o dente, o arrastado com o encaixe), deslizam
  // acelerando e encaixam com um clique (tremor curto + linha que acende na emenda). Ao criar o grupo, as peças encaixadas
  // encolhem juntas e viram o ícone do grupo. Desfazer: o grupo vira as 2 peças encaixadas, dá um tranco, desencaixam,
  // se afastam e cada uma volta ao seu lugar na barra.
  var ENC_PL = 'M2,2 H40 V14 a6,6 0 0 1 0,12 V38 H2 Z',
    ENC_PR = 'M0,2 H38 V38 H0 V26 a6,6 0 0 0 0,-12 Z',
    ENC = null;
  function encPeca(id, lado) {
    var e = document.createElement('div');
    e.className = 'encP';
    e.innerHTML =
      '<svg viewBox="0 0 48 40" width="48" height="40" aria-hidden="true"><path d="' + (lado === 'L' ? ENC_PL : ENC_PR) + '" fill="var(--tbg,#2a1a26)" stroke="var(--accent,#a2447c)" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
      '<span class="encI" style="left:' + (lado === 'L' ? 10 : 13) + 'px">' + ico(id, 22) + '</span>';
    return e;
  }
  function encOv() {
    var o = document.createElement('div');
    o.className = 'encOv';
    document.body.appendChild(o);
    return o;
  }
  function encPos(e, x, y) {
    e.style.left = x - 24 + 'px';
    e.style.top = y - 20 + 'px';
  }
  function encBtn(id) {
    return $('mainnav').querySelector('.mn[data-id="' + id + '"]');
  }
  function encCentro(r) {
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 - 8 };
  }
  // juntar: rA = botão de baixo (fica à esquerda), rB = onde o arrastado foi solto
  function encJunta(aId, bId, rA, rB, done) {
    if (REDUCED || !rA || !rB) return done();
    encFim();
    var ov = encOv(),
      L = encPeca(aId, 'L'),
      R = encPeca(bId, 'R'),
      c = encCentro(rA),
      cb = encCentro(rB);
    ov.appendChild(L);
    ov.appendChild(R);
    encPos(L, c.x, c.y);
    encPos(R, cb.x, cb.y);
    var ba = encBtn(aId);
    if (ba) ba.classList.add('encEsc');
    // 1) viram peças (0,2 s)  2) deslizam acelerando e encaixam (0,45 s)  3) clique: tremor + emenda acesa
    L.animate([{ opacity: 0, transform: 'scale(.7)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 200, fill: 'forwards' });
    R.animate([{ opacity: 0, transform: 'scale(.7)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 200, fill: 'forwards' });
    setTimeout(function () {
      L.animate([{ transform: 'translate(0,0) rotate(0deg)' }, { transform: 'translate(' + -21 + 'px,-4px) rotate(-6deg)', offset: 0.35 }, { transform: 'translate(-21px,0) rotate(0deg)' }], { duration: 450, easing: 'cubic-bezier(.55,0,1,.45)', fill: 'forwards' });
      R.animate([{ transform: 'translate(0,0) rotate(6deg)' }, { transform: 'translate(' + (c.x + 18 - cb.x) + 'px,' + (c.y - cb.y) + 'px) rotate(0deg)' }], { duration: 450, easing: 'cubic-bezier(.55,0,1,.45)', fill: 'forwards' });
    }, 200);
    setTimeout(function () {
      // clique
      [L, R].forEach(function (p, i) {
        p.animate([{ marginLeft: '0px' }, { marginLeft: (i ? -2.2 : 2.2) + 'px' }, { marginLeft: (i ? 1.4 : -1.4) + 'px' }, { marginLeft: '0px' }], { duration: 200 });
      });
      var em = document.createElement('i');
      em.className = 'encEm';
      em.style.left = c.x - 2 + 'px';
      em.style.top = c.y - 17 + 'px';
      ov.appendChild(em);
      em.animate([{ opacity: 1, transform: 'scaleY(.8)' }, { opacity: 0, transform: 'scaleY(1.25)' }], { duration: 450, fill: 'forwards' });
      try {
        vibrar(15);
      } catch (e) {}
    }, 650);
    ENC = { ov: ov, L: L, R: R, c: c, a: aId };
    setTimeout(function () {
      // fixa as peças encaixadas no lugar (as próximas animações partem daqui)
      [L, R].forEach(function (p) {
        p.getAnimations().forEach(function (an) {
          an.cancel();
        });
        p.style.opacity = '1';
      });
      encPos(L, c.x - 21, c.y);
      encPos(R, c.x + 18, c.y);
      done();
    }, 900);
  }
  // criou: as peças encaixadas encolhem juntas e viram o ícone do grupo
  function encCria(gid) {
    if (!ENC) return false;
    var E = ENC,
      b = encBtn(gid);
    ENC = null;
    if (!b) return encLimpa(E);
    var r = b.getBoundingClientRect(),
      t = encCentro(r),
      mi = b.querySelector('.mi');
    if (mi) mi.style.opacity = '0';
    var dx = t.x - E.c.x,
      dy = t.y - E.c.y;
    E.L.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: 'translate(' + (dx + 9) + 'px,' + dy + 'px) scale(.55)', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
    E.R.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: 'translate(' + (dx - 9) + 'px,' + dy + 'px) scale(.55)', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
    if (mi) mi.animate([{ opacity: 0, transform: 'scale(.8)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 300, delay: 260, fill: 'forwards' });
    setTimeout(function () {
      if (mi) mi.style.opacity = '';
      encLimpa(E);
    }, 700);
    return true;
  }
  // cancelou o "Novo grupo": desencaixam e somem
  function encCancela() {
    if (!ENC) return;
    var E = ENC;
    ENC = null;
    E.L.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: 'translate(-30px,0) rotate(-8deg)', opacity: 0 }], { duration: 300, fill: 'forwards' });
    E.R.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: 'translate(30px,0) rotate(8deg)', opacity: 0 }], { duration: 300, fill: 'forwards' });
    setTimeout(function () {
      encLimpa(E);
    }, 320);
  }
  function encLimpa(E) {
    if (E && E.ov) E.ov.remove();
    [].forEach.call(document.querySelectorAll('.encEsc'), function (x) {
      x.classList.remove('encEsc');
    });
    return false;
  }
  function encFim() {
    if (ENC) encLimpa(ENC);
    ENC = null;
  }
  // desfazer: itens do grupo, de onde o grupo estava (r0); chamar DEPOIS do redesenho (os botões já voltaram à barra)
  function encDesfaz(itens, r0) {
    if (REDUCED || !r0 || !itens || itens.length < 2) return;
    var a = itens[0],
      b = itens[1],
      ba = encBtn(a),
      bb = encBtn(b);
    if (!ba || !bb) return;
    var ov = encOv(),
      L = encPeca(a, 'L'),
      R = encPeca(b, 'R'),
      c = encCentro(r0);
    ov.appendChild(L);
    ov.appendChild(R);
    encPos(L, c.x - 21, c.y);
    encPos(R, c.x + 18, c.y);
    var ta = encCentro(ba.getBoundingClientRect()),
      tb = encCentro(bb.getBoundingClientRect());
    [ba, bb].forEach(function (x) {
      x.classList.add('encEsc');
    });
    // tranco
    [L, R].forEach(function (p, i) {
      p.animate([{ marginLeft: '0px' }, { marginLeft: (i ? -2 : 2) + 'px' }, { marginLeft: '0px' }], { duration: 150 });
    });
    // desencaixam e se afastam (0,3 s) e voltam para a barra (0,7 s)
    var vai = function (p, dx0, t, x0, rot) {
      p.animate(
        [
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          { transform: 'translate(' + dx0 + 'px,0) rotate(' + rot + 'deg)', opacity: 1, offset: 0.3 },
          { transform: 'translate(' + (t.x - x0) + 'px,' + (t.y - c.y) + 'px) rotate(0deg)', opacity: 1, offset: 0.85 },
          { transform: 'translate(' + (t.x - x0) + 'px,' + (t.y - c.y) + 'px) rotate(0deg)', opacity: 0 }
        ],
        { duration: 1000, delay: 150, easing: 'cubic-bezier(.3,0,.2,1)', fill: 'forwards' }
      );
    };
    vai(L, -26, ta, c.x - 21, -8);
    vai(R, 26, tb, c.x + 18, 8);
    setTimeout(function () {
      encLimpa({ ov: ov });
      [ba, bb].forEach(function (x) {
        var mi = x.querySelector('.mi');
        if (mi) mi.animate([{ opacity: 0, transform: 'scale(.85)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 220 });
      });
    }, 1080);
  }

  // ===== Animações novas: leitor (procura/achou), obturador da foto, gráficos, progresso, liberar p/ site, venda confirmada. =====
  // Visor do leitor: cantos, grade de pontos, laser varrendo. achou() mostra o código aparecendo letra a letra.
  function leitorVisor(gd, stg) {
    gd.style.border = 'none';
    gd.style.borderRadius = '18px';
    gd.style.boxShadow = '0 0 0 200vmax rgba(0,0,0,.5)';
    gd.classList.add('lfv');
    var cs = [];
    ['tl', 'tr', 'bl', 'br'].forEach(function (p) {
      var c = document.createElement('i');
      c.className = 'lfc ' + p;
      gd.appendChild(c);
      cs.push(c);
    });
    var gr = document.createElement('i');
    gr.className = 'lfg';
    gd.appendChild(gr);
    var lz = document.createElement('i');
    lz.className = 'lfl';
    gd.appendChild(lz);
    return {
      achou: function (v, cb) {
        lz.remove();
        gd.classList.add('ok');
        var fl = document.createElement('div');
        fl.className = 'lffl';
        stg.appendChild(fl);
        var rg = document.createElement('div');
        rg.className = 'lfrg';
        stg.appendChild(rg);
        var cod = document.createElement('div');
        cod.className = 'lfcod';
        var big = document.createElement('div');
        big.className = 'lfbig';
        String(v.ref || '')
          .split('')
          .forEach(function (ch, i) {
            var s = document.createElement('span');
            s.textContent = ch;
            s.style.animationDelay = i * 55 + 'ms';
            big.appendChild(s);
          });
        cod.appendChild(big);
        if (v.med) {
          var md = document.createElement('div');
          md.className = 'lfmed';
          md.textContent = v.med;
          md.style.animationDelay = String(v.ref || '').length * 55 + 120 + 'ms';
          cod.appendChild(md);
        }
        stg.appendChild(cod);
        vibrar(30);
        setTimeout(cb, Math.min(1500, 700 + String(v.ref || '').length * 55 + (v.med ? 250 : 0)));
      }
    };
  }
  // Foto tirada: a imagem encolhe da câmera até o quadro do cartão, o fundo vira branco da esquerda para a direita e aparece o ✓.
  function obturadorVoa(o, dst) {
    var tgt = $('phImg');
    if (REDUCED || !o || !tgt || Date.now() - o.t > 20000) return;
    tgt.style.visibility = 'hidden';
    var box = document.createElement('div'),
      a = new Image(),
      b = dst ? new Image() : null,
      ok = document.createElement('i'),
      vivo = true,
      fim = function () {
        if (!vivo) return;
        vivo = false;
        box.remove();
        tgt.style.visibility = '';
      };
    setTimeout(fim, 3500);
    box.className = 'lfbox';
    box.style.cssText = 'position:fixed;z-index:310;overflow:hidden;pointer-events:none;background:#fff;left:' + o.rect.l + 'px;top:' + o.rect.t + 'px;width:' + o.rect.w + 'px;height:' + o.rect.h + 'px';
    a.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover';
    a.src = o.src;
    box.appendChild(a);
    if (b) {
      b.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;clip-path:inset(0 100% 0 0)';
      b.src = dst;
      box.appendChild(b);
    }
    ok.className = 'lfok';
    ok.textContent = '✓';
    box.appendChild(ok);
    document.body.appendChild(box);
    var t0 = performance.now(),
      D = 700;
    (function passo(t) {
      if (!vivo) return;
      var k = Math.min(1, (t - t0) / D),
        e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2,
        r = tgt.getBoundingClientRect();
      box.style.left = o.rect.l + (r.left - o.rect.l) * e + 'px';
      box.style.top = o.rect.t + (r.top - o.rect.t) * e + 'px';
      box.style.width = o.rect.w + (r.width - o.rect.w) * e + 'px';
      box.style.height = o.rect.h + (r.height - o.rect.h) * e + 'px';
      box.style.borderRadius = 12 * e + 'px';
      if (k < 1) return requestAnimationFrame(passo);
      var fecha = function () {
        ok.classList.add('on');
        setTimeout(fim, 650);
      };
      if (b && b.animate) {
        var an = b.animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { duration: 800, easing: 'ease-in-out', fill: 'forwards' });
        an.onfinish = fecha;
      } else fecha();
    })(t0);
  }
  // Gráficos: a linha se desenha, os pontos aparecem, as barras crescem em sequência e os números contam.
  function animGraficos(root) {
    if (REDUCED || !root || !root.querySelectorAll || !root.animate) return;
    var ease = 'cubic-bezier(.4,0,.2,1)';
    Array.prototype.forEach.call(root.querySelectorAll('svg polyline'), function (pl) {
      try {
        var len = pl.getTotalLength();
        if (!len) return;
        pl.animate([{ strokeDasharray: len + 'px', strokeDashoffset: len + 'px' }, { strokeDasharray: len + 'px', strokeDashoffset: '0px' }], { duration: 1400, easing: ease });
        Array.prototype.forEach.call(pl.parentNode.querySelectorAll('circle'), function (c) {
          c.style.transformBox = 'fill-box';
          c.style.transformOrigin = 'center';
          c.animate([{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 420, delay: 1100, easing: 'cubic-bezier(.2,1.8,.3,1)', fill: 'backwards' });
        });
      } catch (e) {}
    });
    Array.prototype.forEach.call(root.querySelectorAll('.bar:not(.lfp) i'), function (b, i) {
      b.style.transformOrigin = 'left center';
      b.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 800, delay: 120 + (i % 8) * 90, easing: 'cubic-bezier(.2,.9,.25,1)', fill: 'backwards' });
    });
    if (window.contaNumeros)
      Array.prototype.forEach.call(root.querySelectorAll('.kpi b'), function (n) {
        try {
          window.contaNumeros(n);
        } catch (e) {}
      });
  }
  // Barra de progresso da compra: enche com brilho quando o número de peças detalhadas muda; ao completar fica verde e mostra o ✓.
  var PROGV = {};
  function progAnim(id, det, tot, bar, bi) {
    var prev = PROGV[id],
      pct = Math.min(100, tot ? (det / tot) * 100 : 0),
      fim = tot > 0 && det >= tot;
    PROGV[id] = det;
    bar.classList.add('lfp');
    if (fim) bar.classList.add('done');
    if (REDUCED || prev == null || prev === det) return false;
    var de = Math.min(100, tot ? (prev / tot) * 100 : 0);
    bi.style.width = de + '%';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        bi.style.transition = 'width .7s cubic-bezier(.3,.8,.3,1)';
        bi.style.width = pct + '%';
        if (pct > de) {
          bi.classList.add('sh');
          setTimeout(function () {
            bi.classList.remove('sh');
          }, 1000);
        }
      });
    });
    return fim && prev < tot;
  }
  // Liberar para o site: onda no botão e cartão de prévia subindo. Vários seguidos viram "N liberados". Nunca bloqueia o toque.
  var SITEFX = { n: 0, t: 0, tm: 0 };
  function siteFx(ref) {
    if (REDUCED) return;
    try {
      var b = $('edSiteBtn');
      if (b) {
        b.classList.remove('lfwave');
        void b.offsetWidth;
        b.classList.add('lfwave');
      }
      var agora = Date.now();
      SITEFX.n = agora - SITEFX.t < 8000 ? SITEFX.n + 1 : 1;
      SITEFX.t = agora;
      var cs = siteCores(ref),
        foto = '';
      for (var i = 0; i < cs.length && !foto; i++) foto = S.fotos[ref + '|' + cs[i].cor] || '';
      var card = $('lfSitePv');
      if (!card) {
        card = document.createElement('div');
        card.id = 'lfSitePv';
        card.setAttribute('role', 'status');
        document.body.appendChild(card);
      }
      var multi = SITEFX.n > 1;
      card.innerHTML =
        (foto && !multi ? '<img alt="" src="' + foto + '">' : '<span class="ph">🌐</span>') +
        '<div><b>' + esc(multi ? SITEFX.n + ' produtos liberados' : pubNome(ref)) + '</b><div class="lv"><i></i>No ar no site</div></div>';
      card.classList.remove('on');
      void card.offsetWidth;
      card.classList.add('on');
      clearTimeout(SITEFX.tm);
      SITEFX.tm = setTimeout(function () {
        card.classList.remove('on');
      }, 2800);
    } catch (e) {}
  }
  // Aviso curto na parte de baixo (não bloqueia o toque).
  function lfToast(t) {
    var e = $('lfToast');
    if (!e) {
      e = document.createElement('div');
      e.id = 'lfToast';
      e.setAttribute('role', 'status');
      document.body.appendChild(e);
    }
    e.textContent = t;
    e.classList.remove('on');
    if (REDUCED) {
      e.classList.add('on');
    } else {
      void e.offsetWidth;
      e.classList.add('on');
    }
    clearTimeout(lfToast.t);
    lfToast.t = setTimeout(function () {
      e.classList.remove('on');
    }, 2300);
  }

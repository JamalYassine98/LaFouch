  // ===== Animações dos botões: ondinha, realce deslizante, cascata, contagem, ✓, segurar para apagar, sino e arrastar. =====
  (function () {
    function q(s, r) {
      return (r || document).querySelector(s);
    }
    // 1. Ondinha ao tocar nos botões.
    document.addEventListener(
      'pointerdown',
      function (e) {
        if (REDUCED) return;
        var t = e.target.closest && e.target.closest('.tl,.mn,.go,.mini,.chip,.tab');
        if (!t || t.disabled || t.closest('.twrap')) return;
        var r = t.getBoundingClientRect(),
          d = Math.max(r.width, r.height) * 1.6,
          s = document.createElement('span'),
          cl = getComputedStyle(t).position === 'static' ? 'ripc' : 'ripo';
        s.className = 'rip';
        s.setAttribute('aria-hidden', 'true');
        s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
        t.classList.add(cl);
        t.appendChild(s);
        setTimeout(function () {
          s.remove();
          if (!t.querySelector('.rip')) t.classList.remove(cl);
        }, 650);
      },
      true
    );
    // 2 e 3. Realce que desliza entre os botões (Dashboard e barra de baixo) + pulinho do ícone ao trocar.
    var POS = {};
    function desliza(cont, key, onSel, ic) {
      if (!cont) return;
      var on = q(onSel, cont),
        sl = q('.slider', cont);
      if (!on) {
        if (sl) sl.style.opacity = 0;
        cont.classList.remove('sl-ok');
        return;
      }
      var c = cont.getBoundingClientRect(),
        r = on.getBoundingClientRect();
      if (!r.width || !c.width) return;
      if (getComputedStyle(cont).position === 'static') cont.style.position = 'relative';
      if (!sl) {
        sl = document.createElement('div');
        sl.className = 'slider';
        sl.setAttribute('aria-hidden', 'true');
        cont.insertBefore(sl, cont.firstChild);
      }
      var to = { x: r.left - c.left, y: r.top - c.top },
        de = POS[key] || to,
        mudou = !!POS[key] && (de.x !== to.x || de.y !== to.y);
      sl.style.transition = 'none';
      sl.style.opacity = 1;
      sl.style.width = r.width + 'px';
      sl.style.height = r.height + 'px';
      sl.style.transform = 'translate(' + de.x + 'px,' + de.y + 'px)';
      void sl.offsetWidth;
      sl.style.transition = REDUCED ? 'none' : 'transform .38s cubic-bezier(.2,.8,.2,1)';
      sl.style.transform = 'translate(' + to.x + 'px,' + to.y + 'px)';
      cont.classList.add('sl-ok');
      POS[key] = to;
      var i = on.querySelector('.ti,.mi');
      if (i && mudou && !REDUCED) {
        i.style.animation = 'none';
        void i.offsetWidth;
        i.style.animation = (ic || 'pulinho') + ' .45s cubic-bezier(.2,.8,.2,1)';
      }
    }
    var agenda = 0;
    function desliza_tudo() {
      agenda = 0;
      var gs = document.querySelectorAll('#v-dash .tgrid');
      for (var i = 0; i < gs.length; i++) desliza(gs[i], 'dash' + i, '.tl.on', 'pulinho');
      desliza($('mainnav'), 'nav', '.mn.on', 'pulinhoN');
    }
    function pede() {
      if (!agenda) agenda = requestAnimationFrame(desliza_tudo);
    }
    if (window.MutationObserver) {
      var mo = new MutationObserver(pede);
      mo.observe($('mainnav'), { childList: true });
      mo.observe($('v-dash'), { childList: true, subtree: true });
    }
    window.addEventListener('resize', function () {
      POS = {};
      pede();
    });
    // 4 e 7. Início: botões entram em cascata e os números contam subindo.
    function contaNumeros(el) {
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT),
        n,
        l = [];
      while ((n = w.nextNode())) if (/\d/.test(n.nodeValue)) l.push(n);
      l.forEach(function (node) {
        var orig = node.nodeValue,
          t0 = performance.now();
        function passo(t) {
          var k = Math.min(1, (t - t0) / 900),
            e = 1 - Math.pow(1 - k, 3);
          node.nodeValue =
            k < 1
              ? orig.replace(/\d[\d.]*/g, function (m) {
                  return Math.round(parseInt(m.replace(/\./g, ''), 10) * e).toLocaleString('pt-BR');
                })
              : orig;
          if (k < 1) requestAnimationFrame(passo);
        }
        requestAnimationFrame(passo);
      });
    }
    window.animInicio = function () {
      var v = $('v-inicio');
      if (REDUCED || !v || S.inicioEd) return;
      v.classList.remove('cascata');
      void v.offsetWidth;
      v.querySelectorAll('.tl').forEach(function (t, i) {
        t.style.animationDelay = i * 55 + 'ms';
      });
      v.classList.add('cascata');
      contaNumeros(v);
      setTimeout(function () {
        v.classList.remove('cascata');
        v.querySelectorAll('.tl').forEach(function (t) {
          t.style.animationDelay = '';
        });
      }, 1300);
    };
    // 5. Botão de registrar mostra ✓ quando deu certo.
    var antes = 0;
    function total() {
      return (S.imprev ? S.imprev.length : 0) + (S.exp ? S.exp.length : 0);
    }
    document.addEventListener(
      'click',
      function (e) {
        var b = e.target.closest && e.target.closest('[data-act=impadd],[data-act=expadd]');
        if (!b) return;
        antes = total();
        var act = b.getAttribute('data-act');
        setTimeout(function () {
          if (total() <= antes || REDUCED) return;
          var n = q('[data-act=' + act + ']');
          if (!n) return;
          var tx = n.textContent;
          n.classList.add('okflash');
          n.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg> Registrado';
          vibrar(15);
          setTimeout(function () {
            n.classList.remove('okflash');
            n.textContent = tx;
          }, 1300);
        }, 40);
      },
      false
    );
    // 6. Segurar o ✕ de um imprevisto apaga (o toque simples continua pedindo confirmação).
    var hold = null,
      seguro = false;
    document.addEventListener(
      'pointerdown',
      function (e) {
        var b = e.target.closest && e.target.closest('[data-act=impdel]');
        if (!b || REDUCED) return;
        var id = b.getAttribute('data-id');
        b.classList.add('segura');
        hold = {
          b: b,
          x: e.clientX,
          y: e.clientY,
          t: setTimeout(function () {
            seguro = true;
            vibrar(30);
            hold = null;
            S._impDel = id;
            ACT.impdel(id);
            setTimeout(function () {
              seguro = false;
            }, 500);
          }, 900)
        };
      },
      true
    );
    function solta() {
      if (!hold) return;
      clearTimeout(hold.t);
      hold.b.classList.remove('segura');
      hold = null;
    }
    document.addEventListener('pointerup', solta, true);
    document.addEventListener('pointercancel', solta, true);
    document.addEventListener(
      'pointermove',
      function (e) {
        if (hold && Math.abs(e.clientX - hold.x) + Math.abs(e.clientY - hold.y) > 12) solta();
      },
      true
    );
    document.addEventListener(
      'click',
      function (e) {
        if (seguro && e.target.closest) {
          e.stopPropagation();
          e.preventDefault();
        }
      },
      true
    );
    // 8. Sino balança (de leve) quando chega aviso novo.
    var nAnt = null;
    if (window.MutationObserver && $('sino'))
      new MutationObserver(function () {
        var s = $('sino'),
          n = notifContagem();
        if (nAnt != null && n > nAnt && !REDUCED) {
          s.classList.remove('toca');
          void s.offsetWidth;
          s.classList.add('toca');
        }
        nAnt = n;
      }).observe($('sino'), { childList: true });
    // 9. Arrastar para reordenar os botões do Início (segurar um instante no celular).
    var dr = null;
    function rects() {
      var o = {};
      document.querySelectorAll('#v-inicio .twrap').forEach(function (w) {
        o[w.getAttribute('data-k')] = w.getBoundingClientRect();
      });
      return o;
    }
    function tw(id) {
      var l = document.querySelectorAll('#v-inicio .twrap');
      for (var i = 0; i < l.length; i++) if (l[i].getAttribute('data-k') === id) return l[i];
      return null;
    }
    document.addEventListener(
      'pointerdown',
      function (e) {
        if (!S.inicioEd) return;
        var w = e.target.closest && e.target.closest('.twrap');
        if (!w || e.target.closest('.tedit')) return;
        var r = w.getBoundingClientRect();
        dr = {
          id: w.getAttribute('data-k'),
          x0: e.clientX,
          y0: e.clientY,
          dx: e.clientX,
          dy: e.clientY,
          cx: r.left + r.width / 2,
          cy: r.top + r.height / 2,
          on: false
        };
        dr.t = setTimeout(
          function () {
            if (!dr) return;
            dr.on = true;
            document.body.classList.add('arrastando');
            var el = tw(dr.id);
            if (el) el.classList.add('arr');
            vibrar(15);
          },
          e.pointerType === 'mouse' ? 0 : 220
        );
      },
      true
    );
    document.addEventListener(
      'touchmove',
      function (e) {
        if (dr && dr.on && e.cancelable) e.preventDefault();
      },
      { passive: false }
    );
    document.addEventListener(
      'pointermove',
      function (e) {
        if (!dr) return;
        if (!dr.on) {
          if (Math.abs(e.clientX - dr.x0) + Math.abs(e.clientY - dr.y0) > 8) {
            clearTimeout(dr.t);
            if (e.pointerType === 'mouse') {
              dr.on = true;
              document.body.classList.add('arrastando');
              if (tw(dr.id)) tw(dr.id).classList.add('arr');
            } else dr = null;
          }
          if (!dr || !dr.on) return;
        }
        var el = tw(dr.id);
        if (!el) return;
        el.style.transform = 'translate(' + (e.clientX - dr.dx) + 'px,' + (e.clientY - dr.dy) + 'px) scale(1.08)';
        var alvo = null;
        document.querySelectorAll('#v-inicio .twrap').forEach(function (w) {
          if (w === el) return;
          var r = w.getBoundingClientRect();
          if (e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom) alvo = w.getAttribute('data-k');
        });
        if (!alvo) return;
        var l = iniLista(),
          i = l.indexOf(dr.id),
          j = l.indexOf(alvo),
          ant = rects();
        if (i < 0 || j < 0) return;
        l.splice(i, 1);
        l.splice(j, 0, dr.id);
        S.inicioT = l;
        render();
        document.querySelectorAll('#v-inicio .twrap').forEach(function (w2) {
          var k = w2.getAttribute('data-k'),
            r2 = w2.getBoundingClientRect(),
            a = ant[k];
          if (k === dr.id) {
            dr.cx = r2.left + r2.width / 2;
            dr.cy = r2.top + r2.height / 2;
            dr.dx = e.clientX;
            dr.dy = e.clientY;
            w2.classList.add('arr');
            w2.style.transform = 'scale(1.08)';
            return;
          }
          if (!a) return;
          w2.style.transition = 'none';
          w2.style.transform = 'translate(' + (a.left - r2.left) + 'px,' + (a.top - r2.top) + 'px)';
          void w2.offsetWidth;
          w2.style.transition = 'transform .3s cubic-bezier(.2,.8,.2,1)';
          w2.style.transform = '';
        });
      },
      true
    );
    function fimArrasta() {
      if (!dr) return;
      clearTimeout(dr.t);
      var id = dr.id;
      dr = null;
      document.body.classList.remove('arrastando');
      var el = tw(id);
      if (el) {
        el.style.transition = 'transform .25s cubic-bezier(.2,.8,.2,1)';
        el.style.transform = '';
        setTimeout(function () {
          el.classList.remove('arr');
          el.style.transition = '';
        }, 260);
      }
    }
    document.addEventListener('pointerup', fimArrasta, true);
    document.addEventListener('pointercancel', fimArrasta, true);
  })();

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
      if (!on.offsetWidth || !cont.offsetWidth) return;
      if (getComputedStyle(cont).position === 'static') cont.style.position = 'relative';
      // medidas em unidades do próprio layout (funcionam também com o zoom das telas grandes)
      var r = { width: on.offsetWidth, height: on.offsetHeight, left: on.offsetLeft, top: on.offsetTop },
        c = { left: 0, top: 0 };
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
    window.contaNumeros = contaNumeros;
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
    // 9. Arrastar para reordenar os botões do Início: o botão segue o dedo por qualquer lugar,
    // os outros abrem espaço no encaixe mais perto (sem redesenhar a tela enquanto arrasta) e tudo se encaixa ao soltar.
    var dr = null;
    function pgX() {
      return window.pageXOffset || 0;
    }
    function pgY() {
      return window.pageYOffset || 0;
    }
    function wraps() {
      return [].slice.call(document.querySelectorAll('#v-inicio .twrap'));
    }
    function desloc(el, a, b, extra) {
      el.style.transform = a === b && !extra ? '' : 'translate(' + (b.l - a.l) + 'px,' + (b.t - a.t) + 'px)' + (extra || '');
    }
    function iniLigar() {
      if (!dr || dr.on) return;
      var ws = wraps(),
        sx = pgX(),
        sy = pgY();
      dr.ws = ws;
      dr.ids = ws.map(function (w) {
        return w.getAttribute('data-k');
      });
      dr.slots = ws.map(function (w) {
        var r = w.getBoundingClientRect();
        return { l: r.left + sx, t: r.top + sy, w: r.width, h: r.height };
      });
      dr.i = dr.ids.indexOf(dr.id);
      if (dr.i < 0) {
        dr = null;
        return;
      }
      dr.j = dr.i;
      dr.ord = dr.ids.slice();
      dr.gx = dr.cx + sx - dr.slots[dr.i].l;
      dr.gy = dr.cy + sy - dr.slots[dr.i].t;
      dr.on = true;
      document.body.classList.add('arrastando');
      ws.forEach(function (w) {
        w.style.willChange = 'transform';
        w.style.transition = w === dr.w ? 'none' : 'transform .28s cubic-bezier(.2,.8,.2,1)';
      });
      dr.w.classList.add('arr');
      vibrar(15);
      quadro();
      requestAnimationFrame(laco);
    }
    // posição do botão arrastado e dos vizinhos
    function quadro() {
      if (!dr || !dr.on) return;
      var px = dr.cx + pgX(),
        py = dr.cy + pgY(),
        s0 = dr.slots[dr.i];
      dr.w.style.transform = 'translate(' + (px - dr.gx - s0.l) + 'px,' + (py - dr.gy - s0.t) + 'px) scale(1.08)';
      var best = 0,
        bd = Infinity;
      dr.slots.forEach(function (q, k) {
        var dx = q.l + q.w / 2 - px,
          dy = q.t + q.h / 2 - py,
          d = dx * dx + dy * dy;
        if (d < bd) {
          bd = d;
          best = k;
        }
      });
      if (best === dr.j) return;
      dr.j = best;
      vibrar(8);
      var ord = dr.ids.slice();
      ord.splice(dr.i, 1);
      ord.splice(best, 0, dr.id);
      dr.ord = ord;
      ord.forEach(function (id, k) {
        if (id === dr.id) return;
        var oi = dr.ids.indexOf(id);
        desloc(dr.ws[oi], dr.slots[oi], dr.slots[k]);
      });
    }
    // rola a tela sozinha quando o botão chega perto da borda de cima ou de baixo
    function laco() {
      if (!dr || !dr.on) return;
      var topo = 110,
        base = window.innerHeight - 140,
        v = 0;
      if (dr.cy < topo) v = -Math.ceil((topo - dr.cy) / 5);
      else if (dr.cy > base) v = Math.ceil((dr.cy - base) / 5);
      if (v) {
        window.scrollBy(0, v);
        quadro();
      }
      requestAnimationFrame(laco);
    }
    function limpaArrasta() {
      (dr && dr.ws ? dr.ws : wraps()).forEach(function (w) {
        w.style.transform = '';
        w.style.transition = '';
        w.style.willChange = '';
        w.classList.remove('arr');
      });
      document.body.classList.remove('arrastando');
    }
    document.addEventListener(
      'pointerdown',
      function (e) {
        if (!S.inicioEd) return;
        var w = e.target.closest && e.target.closest('.twrap');
        if (!w || e.target.closest('.tedit')) return;
        dr = { w: w, id: w.getAttribute('data-k'), x0: e.clientX, y0: e.clientY, cx: e.clientX, cy: e.clientY, on: false };
        dr.t = setTimeout(iniLigar, e.pointerType === 'mouse' ? 99999 : 220);
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
        dr.cx = e.clientX;
        dr.cy = e.clientY;
        if (!dr.on) {
          if (Math.abs(e.clientX - dr.x0) + Math.abs(e.clientY - dr.y0) > 8) {
            clearTimeout(dr.t);
            if (e.pointerType === 'mouse') {
              dr.cx = dr.x0;
              dr.cy = dr.y0;
              iniLigar();
              if (dr) {
                dr.cx = e.clientX;
                dr.cy = e.clientY;
              }
            } else dr = null;
          }
          if (!dr || !dr.on) return;
        }
        quadro();
      },
      true
    );
    function fimArrasta(ev) {
      if (!dr) return;
      clearTimeout(dr.t);
      var d = dr;
      dr = null;
      if (!d.on) return;
      var mudou = ev && ev.type === 'pointerup' && d.j !== d.i;
      if (!mudou) {
        d.w.style.transition = 'transform .25s cubic-bezier(.2,.8,.2,1)';
        d.ws.forEach(function (w) {
          w.style.transform = '';
        });
        setTimeout(function () {
          dr = d;
          limpaArrasta();
          dr = null;
        }, 270);
        return;
      }
      // encaixa o botão no lugar escolhido; depois grava a nova ordem e redesenha já nas posições finais
      d.w.style.transition = 'transform .22s cubic-bezier(.2,.8,.2,1)';
      desloc(d.w, d.slots[d.i], d.slots[d.j]);
      setTimeout(function () {
        var ws = d.ws;
        ws.forEach(function (w) {
          w.style.transition = 'none';
        });
        var l = iniLista(),
          vis = d.ord;
        // mantém na lista os botões que não estão na tela (ocultos) onde estavam
        S.inicioT = vis.concat(
          l.filter(function (id) {
            return vis.indexOf(id) < 0;
          })
        );
        dr = d;
        limpaArrasta();
        dr = null;
        render();
      }, 240);
    }
    document.addEventListener('pointerup', fimArrasta, true);
    document.addEventListener('pointercancel', fimArrasta, true);
  })();

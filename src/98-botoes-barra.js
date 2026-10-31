  // ===== Acesso rápido: arrastar um botão do Início para a barra de baixo (máx. 5, "Início" fixo) e de volta. =====
  (function () {
    var dg = null,
      chip = null,
      chipT = 0,
      soltouEm = 0;
    function barEl() {
      return $('mainnav');
    }
    function slots() {
      return [].slice.call(barEl().querySelectorAll('.mn'));
    }
    function dica(t, ms) {
      if (!chip) {
        chip = document.createElement('div');
        chip.id = 'qchip';
        chip.setAttribute('role', 'status');
        document.body.appendChild(chip);
      }
      chip.textContent = t;
      chip.classList.add('on');
      clearTimeout(chipT);
      if (ms) chipT = setTimeout(function () {
        chip.classList.remove('on');
      }, ms);
    }
    function dicaOff() {
      clearTimeout(chipT);
      if (chip) chip.classList.remove('on');
    }
    // Depois de arrastar, o "clique" que o navegador dispara ao soltar não pode abrir a tela.
    window.__barraSegurou = function () {
      return Date.now() - soltouEm < 450;
    };
    document.addEventListener(
      'click',
      function (e) {
        if (Date.now() - soltouEm < 450 && e.target.closest && e.target.closest('#v-inicio .tl,#mainnav .mn')) {
          e.stopPropagation();
          e.preventDefault();
        }
      },
      true
    );
    function sobre(x, y) {
      var b = barEl().getBoundingClientRect();
      if (y < b.top - 36 || y > b.bottom + 40) return { zona: y < b.top ? 'fora' : 'fora', k: -1 };
      var l = slots(),
        k = -1;
      l.forEach(function (s, i) {
        var r = s.getBoundingClientRect();
        if (x >= r.left - 2 && x <= r.right + 2) k = i;
      });
      return { zona: 'barra', k: k };
    }
    function quadro() {
      if (!dg || !dg.on) return;
      var g = dg.g;
      g.style.left = dg.cx - dg.gw / 2 + 'px';
      g.style.top = dg.cy - dg.gh / 2 + 'px';
      var o = sobre(dg.cx, dg.cy),
        l = slots();
      l.forEach(function (s, i) {
        s.classList.toggle('qt', o.zona === 'barra' && i === o.k && i > 0);
      });
      var B = barraLista();
      // segurar sobre outro botão da barra por um instante = juntar
      var kk = dg.deBarra && !grpGet(dg.id) && o.zona === 'barra' && o.k > 0 && B[o.k - 1] !== dg.id ? o.k : -1;
      if (kk !== dg.hk) {
        clearTimeout(dg.ht);
        dg.hk = kk;
        dg.junta = -1;
        if (kk > 0)
          dg.ht = setTimeout(function () {
            if (dg && dg.hk === kk) {
              dg.junta = kk;
              vibrar(12);
              quadro();
            }
          }, 650);
      }
      l.forEach(function (s, i) {
        s.classList.toggle('qj', dg.junta > 0 && i === dg.junta);
      });
      if (dg.junta > 0) {
        var al = B[dg.junta - 1];
        dica(grpGet(al) ? 'Solte para juntar ao grupo ' + barraNome(al) : 'Solte para juntar com ' + barraNome(al));
      } else if (!dg.deBarra && o.zona === 'barra' && o.k > 0 && grpGet(B[o.k - 1])) {
        dica('Solte para adicionar ao grupo ' + barraNome(B[o.k - 1]));
      } else if (dg.deBarra) {
        dica(o.zona === 'barra' ? (o.k > 0 ? 'Solte para trocar de lugar · segure para juntar' : 'Arraste para fora para tirar da barra') : 'Solte aqui para tirar da barra');
      } else if (B.length < BARRA_MAX) {
        dica(o.zona === 'barra' ? 'Solte para adicionar à barra' : 'Arraste até a barra de baixo · ' + (B.length + 1) + '/5');
      } else {
        dica(o.zona === 'barra' ? (o.k > 0 ? 'Solte para trocar por este' : 'O Início fica sempre na barra') : 'Barra cheia (5/5) · solte sobre um botão para trocar');
      }
      dg.o = o;
    }
    function inicia() {
      if (!dg || dg.on) return;
      var src = dg.el,
        r = src.getBoundingClientRect(),
        g = src.cloneNode(true);
      g.classList.add('qghost');
      g.removeAttribute('data-act');
      g.style.cssText = 'left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px';
      document.body.appendChild(g);
      dg.g = g;
      dg.gw = r.width;
      dg.gh = r.height;
      dg.on = true;
      src.classList.add('qorig');
      document.body.classList.add('arrastaBarra');
      barEl().classList.add('qd');
      vibrar(15);
      quadro();
    }
    document.addEventListener(
      'pointerdown',
      function (e) {
        if (S.inicioEd || S.view === 'dia') return;
        var el = e.target.closest && e.target.closest('#v-inicio .tl[data-act="inicio"],#mainnav .mn');
        if (!el) return;
        var id = el.getAttribute('data-id');
        if (!id || id === 'inicio') return;
        dg = { el: el, id: id, deBarra: el.classList.contains('mn'), x0: e.clientX, y0: e.clientY, cx: e.clientX, cy: e.clientY, on: false, mouse: e.pointerType === 'mouse' };
        // dedo: segurar um instante; mouse: basta puxar
        if (!dg.mouse) dg.t = setTimeout(inicia, 380);
      },
      true
    );
    document.addEventListener(
      'touchmove',
      function (e) {
        if (dg && dg.on && e.cancelable) e.preventDefault();
      },
      { passive: false }
    );
    document.addEventListener(
      'pointermove',
      function (e) {
        if (!dg) return;
        dg.cx = e.clientX;
        dg.cy = e.clientY;
        if (!dg.on) {
          var d = Math.abs(e.clientX - dg.x0) + Math.abs(e.clientY - dg.y0);
          if (dg.mouse && d > 8) inicia();
          else if (!dg.mouse && d > 10) {
            clearTimeout(dg.t);
            dg = null;
          }
          return;
        }
        quadro();
      },
      true
    );
    function pop(id) {
      if (REDUCED) return;
      var b = barEl().querySelector('.mn[data-id="' + id + '"]');
      if (b && b.animate) b.animate([{ transform: 'scale(.6)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 520, easing: 'ease-out' });
    }
    function popTile(id) {
      if (REDUCED) return;
      var t = document.querySelector('#v-inicio .tl[data-id="' + id + '"]');
      if (t && t.animate) t.animate([{ transform: 'scale(.5)', opacity: 0 }, { transform: 'scale(1.08)', opacity: 1 }, { transform: 'scale(1)', opacity: 1 }], { duration: 650, easing: 'ease-out' });
    }
    function limpa() {
      if (!dg) return;
      if (dg.g) dg.g.remove();
      if (dg.el) dg.el.classList.remove('qorig');
      slots().forEach(function (s) {
        s.classList.remove('qt');
        s.classList.remove('qj');
      });
      barEl().classList.remove('qd');
      document.body.classList.remove('arrastaBarra');
    }
    function fim(ev) {
      if (!dg) return;
      clearTimeout(dg.t);
      clearTimeout(dg.ht);
      var d = dg;
      if (!d.on) {
        dg = null;
        return;
      }
      soltouEm = Date.now();
      var o = ev && ev.type === 'pointerup' ? sobre(d.cx, d.cy) : { zona: 'cancel', k: -1 };
      var B = barraLista().slice(),
        nome = barraNome(d.id),
        volta = false,
        pr = '',
        pt = '',
        msg = '';
      var pend = null,
        alvoG = o.zona === 'barra' && o.k > 0 ? B[o.k - 1] : null;
      if (d.deBarra && grpGet(d.id) && Math.abs(d.cx - d.x0) + Math.abs(d.cy - d.y0) < 14 && ev && ev.type === 'pointerup') {
        // segurou o grupo sem mexer: gerenciar
        volta = true;
        pend = ['ger', d.id];
      } else if (d.deBarra && d.junta > 0 && d.junta === o.k && alvoG && alvoG !== d.id) {
        if (grpGet(alvoG)) {
          B.splice(B.indexOf(d.id), 1);
          grpAdd(alvoG, d.id);
          B = barraLista().slice();
          pr = alvoG;
          msg = nome + ' entrou no grupo ' + barraNome(alvoG);
        } else {
          volta = true;
          pend = ['novo', alvoG, d.id];
        }
      } else if (!d.deBarra && alvoG && grpGet(alvoG)) {
        if (grpAdd(alvoG, d.id)) {
          B = barraLista().slice();
          pr = alvoG;
          msg = nome + ' entrou no grupo ' + barraNome(alvoG);
        } else volta = true;
      } else if (!d.deBarra) {
        if (o.zona === 'barra') {
          if (B.length < BARRA_MAX) {
            B.push(d.id);
            pr = d.id;
            msg = nome + ' entrou na barra · ' + (B.length + 1) + '/5';
          } else if (o.k > 0) {
            var sai = B[o.k - 1];
            B[o.k - 1] = d.id;
            barraDevolve(sai);
            pr = d.id;
            pt = sai;
            msg = nome + ' entrou na barra, ' + BARRA_NOME[sai] + ' voltou para o Início';
          } else {
            volta = true;
            msg = 'Barra cheia: solte sobre um botão para trocar';
          }
        } else volta = true;
      } else {
        var i = B.indexOf(d.id);
        if (grpGet(d.id) && o.zona === 'fora') {
          grpDesfaz(d.id);
          B = barraLista().slice();
          msg = 'Grupo desfeito: os botões voltaram';
        } else if (o.zona === 'barra' && o.k > 0 && o.k - 1 !== i) {
          B.splice(i, 1);
          B.splice(o.k - 1, 0, d.id);
          pr = d.id;
          msg = 'Botão de lugar trocado';
        } else if (o.zona === 'fora') {
          B.splice(i, 1);
          barraDevolve(d.id);
          pt = d.id;
          msg = nome + ' voltou para o Início';
        } else volta = true;
      }
      var g = d.g,
        fecha = function () {
          limpa();
          dg = null;
          if (pend && pend[0] === 'ger') grpGerirAbre(pend[1]);
          else if (pend && pend[0] === 'novo') grpNovoAbre(pend[1], pend[2]);
        };
      if (volta) {
        if (g && !REDUCED) {
          var r = d.el.getBoundingClientRect();
          g.style.transition = 'all .25s cubic-bezier(.2,.8,.2,1)';
          g.style.left = r.left + 'px';
          g.style.top = r.top + 'px';
          setTimeout(fecha, 260);
        } else fecha();
        if (msg) dica(msg, 2200);
        else dicaOff();
        return;
      }
      S.barra = B;
      if (g && !REDUCED && o.zona === 'barra' && o.k >= 0) {
        var sr = slots()[o.k] ? slots()[o.k].getBoundingClientRect() : null;
        if (sr) {
          g.style.transition = 'all .3s cubic-bezier(.2,.8,.2,1)';
          g.style.left = sr.left + 'px';
          g.style.top = sr.top + 'px';
          g.style.width = sr.width + 'px';
          g.style.height = sr.height + 'px';
          g.style.opacity = '0';
        }
      }
      setTimeout(function () {
        fecha();
        render();
        if (pr) pop(pr);
        if (pt) popTile(pt);
        vibrar(20);
      }, REDUCED ? 0 : 280);
      dica(msg, 2400);
    }
    document.addEventListener('pointerup', fim, true);
    document.addEventListener('pointercancel', fim, true);
  })();

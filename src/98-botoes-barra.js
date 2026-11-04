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
    function lixoEl() {
      var e = $('inLixo');
      if (!e) {
        e = document.createElement('div');
        e.id = 'inLixo';
        e.setAttribute('aria-hidden', 'true');
        e.innerHTML = '<span class="tp"></span><span class="cx">' + ICO.lixo + '</span>';
        document.body.appendChild(e);
      }
      return e;
    }
    function sobre(x, y) {
      if (dg && !dg.deBarra && dg.on) {
        var lr = lixoEl().getBoundingClientRect();
        if (x >= lr.left - 24 && x <= lr.right + 24 && y >= lr.top - 24 && y <= lr.bottom + 24) return { zona: 'lixo', k: -1 };
      }
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
    // botão do Início sob o dedo (para trocar de lugar)
    function tileSob(x, y) {
      var t = null;
      [].slice.call(document.querySelectorAll('#v-inicio .tl[data-act="inicio"]')).forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (el !== dg.el && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) t = el;
      });
      return t;
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
      if (!dg.deBarra) {
        lixoEl().classList.toggle('perto', o.zona === 'lixo');
        var ts = o.zona === 'fora' ? tileSob(dg.cx, dg.cy) : null;
        [].slice.call(document.querySelectorAll('#v-inicio .tl.troca')).forEach(function (el) {
          if (el !== ts) el.classList.remove('troca');
        });
        if (ts) ts.classList.add('troca');
        dg.troca = ts;
      }
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
      } else if (!dg.deBarra && o.zona === 'lixo') {
        dica('Solte para ocultar este botão');
      } else if (!dg.deBarra && dg.troca) {
        dica('Solte para trocar de lugar');
      } else if (dg.deBarra) {
        dica(o.zona === 'barra' ? (o.k > 0 ? 'Solte para trocar de lugar · segure para juntar' : 'Arraste para fora para tirar da barra') : 'Solte aqui para tirar da barra');
      } else if (B.length < BARRA_MAX) {
        dica(o.zona === 'barra' ? 'Solte aqui para fixar · ' + (B.length + 1) + '/5' : 'Arraste até a barra para fixar · ou até a lixeira para ocultar');
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
      if (!dg.deBarra) lixoEl().classList.add('on');
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
      var lx = $('inLixo');
      if (lx) lx.classList.remove('on', 'perto');
      [].slice.call(document.querySelectorAll('#v-inicio .tl.troca')).forEach(function (el) {
        el.classList.remove('troca');
      });
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
      var oculta = false,
        troca = '',
        pend = null,
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
      } else if (!d.deBarra && o.zona === 'lixo') {
        oculta = true;
      } else if (!d.deBarra && o.zona === 'fora' && d.troca) {
        troca = d.troca.getAttribute('data-id');
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
      if (oculta || troca) {
        var L0 = iniLista().slice(),
          i0 = L0.indexOf(d.id);
        if (oculta) {
          L0.splice(i0, 1);
          S.inicioT = L0;
          S.inicioFant = false;
          var lr2 = lixoEl().getBoundingClientRect();
          if (g && !REDUCED) {
            g.style.transition = 'all .3s cubic-bezier(.4,0,.2,1)';
            g.style.left = lr2.left + lr2.width / 2 - d.gw / 2 + 'px';
            g.style.top = lr2.top + lr2.height / 2 - d.gh / 2 + 'px';
            g.style.transform = 'scale(.05)';
            g.style.opacity = '0';
          }
          setTimeout(function () {
            fecha();
            render();
            vibrar(20);
            lfDesfazer('"' + nome + '" ocultado do Início', function () {
              var l2 = iniLista().slice();
              l2.splice(Math.min(i0, l2.length), 0, d.id);
              S.inicioT = l2;
              render();
              popTile(d.id);
            });
          }, REDUCED ? 0 : 300);
        } else {
          var j0 = L0.indexOf(troca);
          if (i0 >= 0 && j0 >= 0) {
            L0[i0] = troca;
            L0[j0] = d.id;
            S.inicioT = L0;
          }
          setTimeout(function () {
            fecha();
            render();
            popTile(d.id);
            popTile(troca);
            vibrar(20);
          }, REDUCED ? 0 : 120);
          dicaOff();
        }
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
    // rede de segurança: se o navegador perder o "soltar" (rolagem, menu de pressionar, app em segundo plano), nada fica preso na tela
    function solta(ev) {
      if (dg && dg.on) fim({ type: 'cancel' });
      else if (dg && !dg.on) {
        clearTimeout(dg.t);
        dg = null;
      }
      if (!dg) {
        dicaOff();
        limpa2();
      }
    }
    function limpa2() {
      var g = document.querySelector('.qghost');
      if (g) g.remove();
      document.body.classList.remove('arrastaBarra');
      [].slice.call(document.querySelectorAll('.qorig')).forEach(function (el) {
        el.classList.remove('qorig');
      });
      var lx = $('inLixo');
      if (lx) lx.classList.remove('on', 'perto');
    }
    ['touchend', 'touchcancel'].forEach(function (t) {
      document.addEventListener(t, solta, true);
    });
    // pressionar e segurar não pode abrir menu do navegador nem selecionar texto
    document.addEventListener('contextmenu', function (e) {
      if (dg || (e.target.closest && e.target.closest('#v-inicio .tl,#mainnav .mn'))) e.preventDefault();
    }, true);
    window.addEventListener('blur', solta);
    document.addEventListener('visibilitychange', solta);
    // chip sem arraste ativo some sozinho
    setInterval(function () {
      if (chip && chip.classList.contains('on') && !(dg && dg.on)) {
        dicaOff();
        limpa2();
      }
    }, 800);
  })();
  // Início: segurar no fundo (logo, cartão de cima, espaço vazio) mostra os botões ocultos; tocar num volta, tocar fora fecha.
  (function () {
    var ht = 0,
      x0 = 0,
      y0 = 0,
      abriuEm = 0,
      anel = null;
    function noFundo(t) {
      if (!t || !t.closest) return false;
      if (t.closest('#mainnav,#lfDesf,#inLixo,.tl,button,input,select,textarea,a,.card,[data-act]:not(.hero)')) return false;
      return !!t.closest('#v-inicio,.logo-top,.wrap');
    }
    function limpaAnel() {
      if (anel) {
        anel.remove();
        anel = null;
      }
    }
    document.addEventListener(
      'pointerdown',
      function (e) {
        if (S.view !== 'inicio' || (S.inicioEd) || !noFundo(e.target)) return;
        x0 = e.clientX;
        y0 = e.clientY;
        clearTimeout(ht);
        limpaAnel();
        if (!REDUCED) {
          anel = document.createElement('div');
          anel.className = 'fantAnel';
          anel.style.left = x0 + 'px';
          anel.style.top = y0 + 'px';
          document.body.appendChild(anel);
        }
        ht = setTimeout(function () {
          limpaAnel();
          if (S.inicioFant) return;
          var B = grpPlana(),
            L = iniLista(),
            n = INI_TODOS.filter(function (id) {
              return L.indexOf(id) < 0 && B.indexOf(id) < 0;
            }).length;
          abriuEm = Date.now();
          vibrar(15);
          if (!n) {
            lfToast('Nenhum botão oculto');
            return;
          }
          S.inicioFant = true;
          render();
          var g = document.querySelector('#v-inicio .tl.fant');
          if (g && g.scrollIntoView) g.scrollIntoView({ block: 'center', behavior: REDUCED ? 'auto' : 'smooth' });
        }, 500);
      },
      true
    );
    function solta() {
      clearTimeout(ht);
      limpaAnel();
    }
    document.addEventListener('pointerup', solta, true);
    document.addEventListener('pointercancel', solta, true);
    document.addEventListener(
      'pointermove',
      function (e) {
        if (ht && Math.abs(e.clientX - x0) + Math.abs(e.clientY - y0) > 12) solta();
      },
      true
    );
    // tocar fora dos fantasmas fecha (o toque logo após abrir é ignorado)
    document.addEventListener(
      'click',
      function (e) {
        if (!S.inicioFant) return;
        if (Date.now() - abriuEm < 700) {
          e.stopPropagation();
          e.preventDefault();
          return;
        }
        if (e.target.closest && e.target.closest('.tl.fant,[data-act="inicioReset"]')) return;
        S.inicioFant = false;
        render();
      },
      true
    );
  })();

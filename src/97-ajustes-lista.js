  // ===== Ajustes minimalista (v419, esboço aprovado 04/11/2026) =====
  // Um grupo só: cada seção é uma linha (ícone em pastilha cinza, título, resumo, seta) que abre no lugar,
  // uma aberta por vez. Segurar a linha (0,4 s) levanta e arrasta para mudar a ordem; soltar assenta com mola
  // e mostra "Ordem salva · Desfazer" por 4 s. A ordem é de cada aparelho (localStorage), como o Tema.
  var AJ_SVG = function (d) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  };
  var AJ_ICO = {
    imp: AJ_SVG('<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>'),
    tema: AJ_SVG('<path d="M12 21a9 9 0 1 1 9-9c0 2.5-2 3.5-4 3.5h-2a2 2 0 0 0-1.5 3.3c.4.5.5 1 .5 1.4 0 .5-.9.8-2 .8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7.5" r="1"/><circle cx="15" cy="7.5" r="1"/>'),
    seg: AJ_SVG('<path d="M12 11v3M8.5 8.5A5 5 0 0 1 17 12v1.5M7 12c0 3 .5 5 1.5 7M12 7a5 5 0 0 0-5 5M16.5 17c-.3 1.2-.8 2.3-1.5 3.3M12 17.5c0 1-.3 2.2-.8 3"/><path d="M5.2 8A8 8 0 0 1 19.6 9.5"/>'),
    ped: AJ_SVG('<circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
    av: AJ_SVG('<path d="M10 5a2 2 0 1 1 4 0 7 7 0 0 1 4 6v3l2 3H4l2-3v-3a7 7 0 0 1 4-6"/><path d="M9 17v1a3 3 0 0 0 6 0v-1"/>'),
    sync: AJ_SVG('<path d="M7 10h14l-4-4M17 14H3l4 4"/>'),
    upd: AJ_SVG('<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12"/>'),
    bk: AJ_SVG('<path d="M6.7 18A4.5 4.5 0 0 1 6 9a6 6 0 0 1 11.7 1.5A4 4 0 0 1 17 18H6.7z"/>')
  };
  var AJ_SETA = AJ_SVG('<path d="M9 6l6 6-6 6"/>'),
    AJ_ALCA = AJ_SVG('<path d="M5 9h14M5 15h14"/>'),
    AJ_PADRAO = ['imp', 'tema', 'seg', 'ped', 'av', 'sync', 'upd', 'bk'];
  function ajOrdem() {
    var o = [];
    try {
      o = JSON.parse(localStorage.getItem('lf_ajOrd') || '[]') || [];
    } catch (e) {}
    AJ_PADRAO.forEach(function (k) {
      if (o.indexOf(k) < 0) o.splice(Math.min(AJ_PADRAO.indexOf(k), o.length), 0, k);
    });
    return o.filter(function (k) {
      return AJ_PADRAO.indexOf(k) >= 0;
    });
  }
  function ajSalvaOrdem(o) {
    try {
      localStorage.setItem('lf_ajOrd', JSON.stringify(o));
    } catch (e) {}
  }
  // Monta o grupo. secs = { chave: { t: título, r: resumo, al: pede atenção, h: conteúdo } }
  function ajListaHtml(secs) {
    var ab = S.ajAberta || '';
    return (
      '<div class="ajGrp" id="ajGrp">' +
      ajOrdem()
        .filter(function (k) {
          return secs[k] && secs[k].h;
        })
        .map(function (k) {
          var s = secs[k],
            on = ab === k || !!S._rtudo; // testes antigos: tudo aberto
          return (
            '<div class="ajS' + (on ? ' on' : '') + '" data-k="' + k + '">' +
            '<button type="button" class="ajR" aria-expanded="' + (on ? 'true' : 'false') + '"><span class="ajIc">' + AJ_ICO[k] + '</span><b>' + esc(s.t) + '</b>' +
            '<span class="ajRes' + (s.al ? ' al' : '') + '">' + (s.al ? '<i class="ajPt"></i>' : '') + esc(s.r || '') + '</span><span class="ajCh">' + AJ_SETA + '</span><span class="ajAl">' + AJ_ALCA + '</span></button>' +
            '<div class="ajB"><div class="ajBi">' + s.h + '</div></div></div>'
          );
        })
        .join('') +
      '</div><div class="ajVer">Versão ' + esc(APP_NOME) + '</div>'
    );
  }
  // Abre/fecha no lugar (sem redesenhar a aba): a seta gira e o conteúdo desliza.
  function ajToca(s) {
    var g = $('ajGrp'),
      abre = !s.classList.contains('on');
    [].forEach.call(g.querySelectorAll('.ajS.on'), function (x) {
      x.classList.remove('on');
      x.firstChild.setAttribute('aria-expanded', 'false');
    });
    if (abre) {
      s.classList.add('on');
      s.firstChild.setAttribute('aria-expanded', 'true');
    }
    S.ajAberta = abre ? s.dataset.k : '';
  }
  // Toque rápido abre; segurar 0,4 s levanta e arrasta.
  function ajGestos() {
    var g = $('ajGrp');
    if (!g || g._ok) return;
    g._ok = 1;
    var st = null;
    g.addEventListener('pointerdown', function (e) {
      var r = e.target.closest('.ajR');
      if (!r || (e.pointerType === 'mouse' && e.button !== 0)) return;
      var s = r.parentNode;
      st = { s: s, r: r, y0: e.clientY, x0: e.clientX, id: e.pointerId, arr: false, t: 0 };
      r.classList.add('ajSeg');
      st.t = setTimeout(function () {
        if (st) ajLevanta(st);
      }, 400);
    });
    g.addEventListener('pointermove', function (e) {
      if (!st || e.pointerId !== st.id) return;
      if (!st.arr) {
        if (Math.abs(e.clientY - st.y0) > 8 || Math.abs(e.clientX - st.x0) > 8) ajCancela();
        return;
      }
      e.preventDefault();
      ajMove(st, e.clientY);
    });
    var fim = function (e) {
      if (!st || (e && e.pointerId !== st.id)) return;
      var era = st;
      clearTimeout(era.t);
      era.r.classList.remove('ajSeg');
      st = null;
      if (era.arr) ajSolta(era);
      else if (e && e.type === 'pointerup') ajToca(era.s);
    };
    var ajCancela = function () {
      if (!st) return;
      clearTimeout(st.t);
      st.r.classList.remove('ajSeg');
      st = null;
    };
    g.addEventListener('pointerup', fim);
    g.addEventListener('pointercancel', function (e) {
      if (st && st.arr) return fim(e);
      ajCancela();
    });
    // enquanto arrasta, a página não rola
    g.addEventListener('touchmove', function (e) {
      if (st && st.arr && e.cancelable) e.preventDefault();
    }, { passive: false });
    g.addEventListener('contextmenu', function (e) {
      if (e.target.closest('.ajR')) e.preventDefault();
    });
    // teclado: Enter/Espaço abre
    g.addEventListener('keydown', function (e) {
      var r = e.target.closest('.ajR');
      if (r && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        ajToca(r.parentNode);
      }
    });
  }
  function ajLevanta(st) {
    var g = $('ajGrp');
    st.arr = true;
    st.r.classList.remove('ajSeg');
    try {
      st.r.setPointerCapture(st.id);
    } catch (e) {}
    vibrar(15);
    // a aberta fecha; as setas viram alça
    [].forEach.call(g.querySelectorAll('.ajS.on'), function (x) {
      x.classList.remove('on');
    });
    S.ajAberta = '';
    g.classList.add('arr');
    st.lista = [].slice.call(g.querySelectorAll('.ajS'));
    st.ix = st.lista.indexOf(st.s);
    st.alvo = st.ix;
    // espera a seção fechar para medir as alturas
    setTimeout(function () {
      if (!st.arr) return;
      st.h = st.lista.map(function (x) {
        return x.offsetHeight;
      });
      st.top = st.lista.map(function (x) {
        return x.offsetTop;
      });
      st.yBase = st.y0;
      st.s.classList.add('ajLev');
    }, REDUCED ? 0 : 200);
  }
  function ajMove(st, y) {
    if (!st.h) return;
    var dy = y - st.yBase,
      hs = st.h[st.ix],
      meio = st.top[st.ix] + hs / 2 + dy;
    // nova posição = quantas linhas ficam acima do meio da que está sendo arrastada
    var abaixo = 0;
    st.lista.forEach(function (x, i) {
      if (i !== st.ix && meio > st.top[i] + st.h[i] / 2) abaixo++;
    });
    var alvo = abaixo;
    st.alvo = alvo;
    st.s.style.transform = 'translate3d(0,' + dy + 'px,0) scale(1.03)';
    st.lista.forEach(function (x, i) {
      if (i === st.ix) return;
      var off = 0;
      if (st.ix < alvo && i > st.ix && i <= alvo) off = -hs;
      if (st.ix > alvo && i < st.ix && i >= alvo) off = hs;
      x.style.transform = off ? 'translate3d(0,' + off + 'px,0)' : '';
    });
  }
  function ajSolta(st) {
    var g = $('ajGrp'),
      antes = ajOrdem(),
      ks = st.lista.map(function (x) {
        return x.dataset.k;
      }),
      k = ks.splice(st.ix, 1)[0];
    ks.splice(st.alvo == null ? st.ix : st.alvo, 0, k);
    // posição antes (para a mola)
    var pos = {};
    st.lista.forEach(function (x) {
      pos[x.dataset.k] = x.getBoundingClientRect().top;
      x.style.transition = 'none';
      x.style.transform = '';
    });
    st.s.classList.remove('ajLev');
    ks.forEach(function (kk) {
      var el = g.querySelector('.ajS[data-k="' + kk + '"]');
      if (el) g.appendChild(el);
    });
    g.classList.remove('arr');
    // ordem completa (as seções escondidas neste aparelho ficam onde estavam)
    var nova = ks.slice();
    antes.forEach(function (x, i) {
      if (nova.indexOf(x) < 0) nova.splice(Math.min(i, nova.length), 0, x);
    });
    var mudou = nova.join() !== antes.join();
    ajSalvaOrdem(nova);
    // mola: cada linha sai de onde estava e assenta no lugar novo
    [].forEach.call(g.querySelectorAll('.ajS'), function (x) {
      var d = (pos[x.dataset.k] || 0) - x.getBoundingClientRect().top;
      if (!d || REDUCED || !x.animate) return;
      x.animate([{ transform: 'translate3d(0,' + d + 'px,0)' + (x === st.s ? ' scale(1.03)' : '') }, { transform: 'none' }], { duration: x === st.s ? 420 : 300, easing: x === st.s ? 'cubic-bezier(.2,1.35,.35,1)' : 'cubic-bezier(.2,.8,.2,1)' });
    });
    setTimeout(function () {
      st.lista.forEach(function (x) {
        x.style.transition = '';
      });
    }, 30);
    if (mudou)
      lfDesfazer(
        'Ordem salva',
        function () {
          ajSalvaOrdem(antes);
          S._ajForce = true;
          render();
        },
        4000
      );
  }

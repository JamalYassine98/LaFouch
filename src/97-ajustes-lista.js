  // ===== Ajustes minimalista (v419, esboço aprovado 04/11/2026) =====
  // Cada seção é uma linha (ícone, título, resumo, seta) que abre no lugar, uma aberta por vez.
  // Ajustes organizado (aprovado 20/11 15:53) + 149i (linhas sem cartão): as linhas vêm em 3 blocos com título — a tabela AJ_BLOCOS
  // (chave → bloco) é o único lugar que diz onde cada configuração mora. Segurar a linha (0,4 s) levanta e arrasta para mudar a ordem
  // DENTRO do bloco; soltar assenta com mola e mostra "Ordem salva · Desfazer" por 4 s. A ordem é de cada aparelho (localStorage), como o Tema.
  var AJ_SVG = function (d) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  };
  var AJ_ICO = {
    imp: AJ_SVG('<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>'),
    pa: AJ_SVG('<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>'),
    tema: AJ_SVG('<path d="M12 21a9 9 0 1 1 9-9c0 2.5-2 3.5-4 3.5h-2a2 2 0 0 0-1.5 3.3c.4.5.5 1 .5 1.4 0 .5-.9.8-2 .8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7.5" r="1"/><circle cx="15" cy="7.5" r="1"/>'),
    seg: AJ_SVG('<path d="M12 11v3M8.5 8.5A5 5 0 0 1 17 12v1.5M7 12c0 3 .5 5 1.5 7M12 7a5 5 0 0 0-5 5M16.5 17c-.3 1.2-.8 2.3-1.5 3.3M12 17.5c0 1-.3 2.2-.8 3"/><path d="M5.2 8A8 8 0 0 1 19.6 9.5"/>'),
    site: AJ_SVG('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
    ped: AJ_SVG('<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>'), // sacola: o globo fica só no Site
    pauto: AJ_SVG('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'),
    marca: AJ_SVG('<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/>'),
    av: AJ_SVG('<path d="M10 5a2 2 0 1 1 4 0 7 7 0 0 1 4 6v3l2 3H4l2-3v-3a7 7 0 0 1 4-6"/><path d="M9 17v1a3 3 0 0 0 6 0v-1"/>'),
    sync: AJ_SVG('<path d="M7 10h14l-4-4M17 14H3l4 4"/>'),
    upd: AJ_SVG('<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12"/>'),
    bk: AJ_SVG('<path d="M6.7 18A4.5 4.5 0 0 1 6 9a6 6 0 0 1 11.7 1.5A4 4 0 0 1 17 18H6.7z"/>')
  };
  var AJ_SETA = AJ_SVG('<path d="M9 6l6 6-6 6"/>'),
    AJ_ALCA = AJ_SVG('<path d="M5 9h14M5 15h14"/>'),
    // 149p (aprovado 19/11 16:30): a linha Preços vem depois de Site e abre no lugar, com o interruptor do preço automático e "Contas, taxas e meta"
    AJ_BLOCOS = [
      ['Loja', ['marca', 'site', 'ped', 'pa', 'pauto']],
      ['Contas ligadas', ['bk', 'sync']],
      ['Este aparelho', ['imp', 'tema', 'seg', 'av', 'upd']]
    ],
    AJ_PADRAO = AJ_BLOCOS.reduce(function (a, b) { return a.concat(b[1]); }, []);
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
  // Monta o grupo. secs = { chave: { t: título, r: resumo, al: pede atenção, h: conteúdo } } — a linha que abre no lugar (⌄).
  // Linha que NÃO abre no lugar diz para onde vai: { vai: 'ação' } = outra tela (›, ex.: Site) · { vai: 'ação', tarefa: true } = janela de baixo, sem seta (ex.: Marca).
  function ajListaHtml(secs) {
    var ab = S.ajAberta || '';
    var ord = ajOrdem();
    return (
      '<div class="ajGrp" id="ajGrp">' +
      AJ_BLOCOS.map(function (bl) {
        var ls = ord.filter(function (k) { return bl[1].indexOf(k) >= 0 && secs[k] && (secs[k].h || secs[k].vai); });
        if (!ls.length) return '';
        return '<div class="ajBl"><div class="ajBt">' + bl[0] + '</div>' + ls.map(function (k) {
          var s = secs[k],
            on = ab === k || !!S._rtudo; // testes antigos: tudo aberto
          return (
            '<div class="ajS' + (on && s.h ? ' on' : '') + (s.tarefa ? ' ajT' : '') + '" data-k="' + k + '"' + (s.vai ? ' data-vai="' + s.vai + '"' : '') + '>' +
            '<button type="button" class="ajR"' + (s.h ? ' aria-expanded="' + (on ? 'true' : 'false') + '"' : '') + '><span class="ajIc">' + AJ_ICO[k] + '</span><b>' + esc(s.t) + '</b>' +
            '<span class="ajRes' + (s.al ? ' al' : '') + '">' + (s.al ? '<i class="ajPt"></i>' : '') + esc(s.r || '') + '</span><span class="ajCh">' + AJ_SETA + '</span><span class="ajAl">' + AJ_ALCA + '</span></button>' +
            (s.h ? '<div class="ajB"><div class="ajBi">' + s.h + '</div></div>' : '') + '</div>'
          );
        }).join('') + '</div>';
      }).join('') +
      '</div><div class="ajVer">Versão ' + esc(APP_NOME) + '</div>'
    );
  }
  // L4: nenhuma linha de Ajustes quebra em 2 — nome, resumo e as linhas de dentro (.nvxL) ficam numa linha só; se não cabem, a letra do grupo diminui
  function ajCabe() {
    var g = $('ajGrp');
    if (!g) return;
    lfCabe(g, function () {
      return [].some.call(g.querySelectorAll('.ajR b, .ajRes, .nvxL span, .nvxL small'), function (e) { return e.scrollWidth > e.clientWidth + 1; });
    });
  }
  // Abre/fecha no lugar (sem redesenhar a aba): a seta gira e o conteúdo desliza.
  function ajToca(s) {
    if (s.dataset.vai) return ACT[s.dataset.vai](); // outra tela (Site) ou janela de baixo (Marca): não abre no lugar
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
      // v465: o anel só aparece se o dedo ficar parado um instante (rolar a tela não dispara mais a animação)
      var st0 = st;
      st.ta = setTimeout(function () {
        if (st === st0 && !st0.arr) r.classList.add('ajSeg');
      }, 150);
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
      clearTimeout(era.ta);
      era.r.classList.remove('ajSeg');
      st = null;
      if (era.arr) ajSolta(era);
      else if (e && e.type === 'pointerup') ajToca(era.s);
    };
    var ajCancela = function () {
      if (!st) return;
      clearTimeout(st.t);
      clearTimeout(st.ta);
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
    st.lista = [].slice.call(st.s.parentNode.querySelectorAll('.ajS')); // só as linhas do mesmo bloco
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
    var bloco = st.s.parentNode;
    ks.forEach(function (kk) {
      var el = bloco.querySelector('.ajS[data-k="' + kk + '"]');
      if (el) bloco.appendChild(el);
    });
    g.classList.remove('arr');
    // ordem completa: as linhas deste bloco trocam de lugar entre si; as dos outros blocos (e as escondidas neste aparelho) ficam onde estavam
    var fila = ks.slice(),
      nova = antes.map(function (x) { return ks.indexOf(x) >= 0 ? fila.shift() : x; });
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

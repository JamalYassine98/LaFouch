  // ===== S185 (aprovado 12/11/2026): uma tela só para compartilhar =====
  // Dentro do "Enviar bonito": PARA QUEM (Cliente varejo | Lojista atacado) e O QUE MANDAR:
  //  cliente → Link com foto (1 peça: lafouch.com/p/CÓDIGO.html; várias: lafouch.com/s/REF.REF~Nome = "Separado para vos"),
  //            Cartões (os de sempre) ou Capa de status (4 peças + link);
  //  lojista → Catálogo PDF (tabela de atacado escolhida, por categoria, cores com quantidade, graus, mínimo, validade)
  //            ou Planilha (CSV). Tudo feito no próprio app, sem internet; mensagem pronta e editável.
  function s185Sel(E) {
    var refs = E.refs || E.pecas.map(function (p) { return p.ref; }), nm = E.cli && E.cli.nome ? String(E.cli.nome).split(' ')[0] : '';
    if (refs.length === 1) return S.site && S.site[refs[0]] ? 'https://lafouch.com/p/' + encodeURIComponent(refs[0]) + '.html' : 'https://lafouch.com/?ref=' + encodeURIComponent(refs[0]);
    return 'https://lafouch.com/s/' + refs.slice(0, 12).map(encodeURIComponent).join('.') + (nm ? '~' + encodeURIComponent(nm.normalize('NFD').replace(/[̀-ͯ]/g, '')) : '');
  }
  function s185Msg(E, modo) {
    var es = typeof ebEs === 'function' && ebEs(E.cli), nm = E.cli && E.cli.nome ? String(E.cli.nome).split(' ')[0] : '', n = E.pecas.length;
    if (modo === 'pdf' || modo === 'plan') return es ? '¡Hola' + (nm ? ' ' + nm : '') + '! Te paso nuestra lista mayorista 👓 Cualquier duda, escribime.' : 'Oi' + (nm ? ' ' + nm : '') + '! Segue a nossa lista de atacado 👓 Qualquer dúvida, é só chamar.';
    if (n === 1) return (es ? '¡Hola' + (nm ? ' ' + nm : '') + '! Te separé este modelo 😊 ' : 'Oi' + (nm ? ' ' + nm : '') + '! Separei este modelo para você 😊 ') + s185Sel(E);
    return (es ? (nm ? nm + ', te' : 'Te') + ' armé una selección 👓 ' : (nm ? nm + ', montei' : 'Montei') + ' uma seleção para você 👓 ') + s185Sel(E);
  }
  function s185Liga(E, J, app) {
    var tx = $('ebTx');
    if (!tx || $('s185')) return;
    E.para = 'cli';
    E.modo = 'link';
    E.tab = (S.tabelas || []).filter(function (t) { return t.on !== false && /^a/.test(t.id); })[0];
    E.tab = E.tab ? E.tab.id : 'opt';
    var w = document.createElement('div');
    w.id = 's185';
    w.className = 's185';
    tx.parentNode.insertBefore(w, $('ebTr'));
    var pinta = function () {
      var M = E.para === 'cli' ? [['link', '🔗 Link com foto', E.pecas.length > 1 ? 'várias: seleção' : '1 peça: prévia'], ['cart', '🖼️ Cartões', 'post ou story'], ['capa', '📣 Capa de status', 'até 4 peças + link']] : [['pdf', '📄 Catálogo PDF', 'tabela de atacado'], ['plan', '📊 Planilha', 'para o lojista']];
      if (!M.some(function (m) { return m[0] === E.modo; })) E.modo = M[0][0];
      w.innerHTML =
        '<div class="lbl">TIPO DE ENVIO</div><div class="s185Seg"><button type="button" data-p="cli" class="' + (E.para === 'cli' ? 'on' : '') + '">Cliente (varejo)</button><button type="button" data-p="loj" class="' + (E.para === 'loj' ? 'on' : '') + '">Lojista (atacado)</button></div>' +
        '<div class="lbl">O QUE MANDAR</div><div class="s185G">' + M.map(function (m) { return '<button type="button" data-m="' + m[0] + '" class="' + (E.modo === m[0] ? 'on' : '') + '"><b>' + m[1] + '</b><small>' + m[2] + '</small></button>'; }).join('') + '</div>' +
        (E.para === 'loj' ? '<div class="lbl">TABELA</div><select class="in" id="s185Tab">' + tabLista().filter(function (t) { return !t.pub; }).map(function (t) { return '<option value="' + t.id + '"' + (t.id === E.tab ? ' selected' : '') + '>' + esc(t.nome) + '</option>'; }).join('') + '</select>' : '');
      var cartao = E.modo === 'cart';
      ['ebTr', 'ebEst'].forEach(function (id) { var x = $(id); if (x) x.hidden = !cartao; });
      var dica = document.querySelector('.ebJn .ebDica');
      if (dica) dica.hidden = !cartao;
      tx.value = cartao ? (typeof ebMsg === 'function' ? ebMsg(E.cli, E.pecas.length) : tx.value) : s185Msg(E, E.modo);
    };
    w.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.p) { E.para = b.dataset.p; E.modo = E.para === 'cli' ? 'link' : 'pdf'; }
      if (b.dataset.m) E.modo = b.dataset.m;
      pinta();
    });
    w.addEventListener('change', function (e) { if (e.target.id === 's185Tab') E.tab = e.target.value; });
    // quando escolhe o cliente, a mensagem acompanha
    var pa = $('ebLista');
    document.addEventListener('click', function f(e) { if (!document.body.contains(w)) { document.removeEventListener('click', f, true); return; } if (e.target.closest && e.target.closest('#ebLista')) setTimeout(pinta, 50); }, true);
    // o botão Enviar faz o envio do modo escolhido (Cartões = o envio de sempre)
    var go = function (ap, e) {
      if (E.modo === 'cart') return;
      e.preventDefault();
      e.stopImmediatePropagation();
      s185Envia(E, J, ap || app);
    };
    $('ebEnv').addEventListener('click', function (e) { go(app, e); }, true);
    $('ebOutro').addEventListener('click', function (e) { go({ id: 'mais', nome: 'Mais' }, e); }, true);
    pinta();
  }
  function s185Manda(ap, txt, cvs, arqs) {
    var P = typeof shPlug === 'function' ? shPlug() : null;
    if (ap && ap.pkg && typeof shGuardaUlt === 'function') shGuardaUlt(ap.id);
    if (P) return P.send({ pkg: (ap && ap.pkg) || '', text: txt, files: (cvs || []).map(shB64) });
    if (arqs && arqs.length && navigator.share && navigator.canShare && navigator.canShare({ files: arqs })) return navigator.share({ files: arqs, text: txt }).catch(function () {});
    if (!arqs || !arqs.length) { window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank'); return Promise.resolve(); }
    arqs.forEach(function (f) { var a = document.createElement('a'); a.href = URL.createObjectURL(f); a.download = f.name; a.click(); });
    return Promise.resolve();
  }
  function s185Envia(E, J, ap) {
    var txt = $('ebTx').value, refs = E.pecas.map(function (p) { return p.ref; });
    if (E.cli) { E.cli.env = (E.cli.env || []).concat([{ ts: Date.now(), refs: refs, modo: E.modo }]); saveSoon(); }
    if (E.modo === 'link') { J.fecha(); s185Manda(ap, txt); return; }
    if (E.modo === 'capa') {
      Promise.all(E.pecas.slice(0, 4).map(function (p) { return envImg(p.foto); })).then(function (ims) {
        var cv = s185Capa(E, ims);
        return envBlob(cv).then(function (b) { J.fecha(); return s185Manda(ap, txt, [cv], [new File([b], 'lafouch-selecao.jpg', { type: 'image/jpeg' })]); });
      });
      return;
    }
    var L = s185Linhas(E);
    if (E.modo === 'plan') {
      var csv = ['Código;Nome;Categoria;Cor;Quantidade;Graus;Preço US$;Preço G$;Mínimo'].concat(L.map(function (r) { return [r.ref, r.nome, r.cat, r.cor, r.q, r.graus, r.usd, r.gs, r.min].join(';'); })).join('\n');
      var f = new File(['﻿' + csv], 'lafouch-atacado.csv', { type: 'text/csv' });
      J.fecha();
      s185Manda(ap, txt, null, [f]);
      return;
    }
    // PDF: página de impressão (o "Salvar como PDF" do celular gera o arquivo)
    var T = tabDe(E.tab), val = new Date(Date.now() + 30 * DAY), G = {};
    L.forEach(function (r) { (G[r.cat] = G[r.cat] || []).push(r); });
    var h = '<div class="s185pdf"><div class="s185ph"><b>LA FOUCH</b><span>Catálogo mayorista · ' + esc(T.nome) + ' · válido hasta ' + fd(val.getTime()) + '</span></div>' +
      Object.keys(G).map(function (c) {
        return '<h3>' + esc(c.toUpperCase()) + '</h3>' + G[c].map(function (r) {
          return '<div class="s185pr"><img src="' + (photoOf(r.ref) || '') + '" alt=""><div><b>' + esc(r.ref) + ' · ' + esc(r.nome) + '</b><small>' + esc(r.cor + ' ' + r.q) + (r.graus ? ' · ' + esc(r.graus) : '') + '</small></div><div class="s185pv"><b>US$ ' + r.usd + '</b><small>' + (r.min ? 'mín. ' + r.min : '') + '</small></div></div>';
        }).join('');
      }).join('') + '<p class="s185pf">WhatsApp +595 983 642 241 · Galería Jebai Center, Ciudad del Este · precios sin impuestos · envío a convenir</p></div>';
    var pb = $('s185Print');
    if (!pb) { pb = document.createElement('div'); pb.id = 's185Print'; document.body.appendChild(pb); }
    pb.innerHTML = h;
    J.fecha();
    document.body.classList.add('s185imp');
    setTimeout(function () { try { window.print(); } catch (e) {} setTimeout(function () { document.body.classList.remove('s185imp'); }, 800); }, 150);
  }
  // linhas do catálogo do lojista: cada cor com quantidade, graus com estoque, preço da tabela
  function s185Linhas(E) {
    var T = tabDe(E.tab), out = [], cat = { grau: 'Lectura', solar: 'Sol', armacao: 'Armazones' };
    E.pecas.forEach(function (p) {
      var its = (S.items || []).filter(function (x) { return x.ref === p.ref && x.qty > 0; });
      if (!its.length) return;
      var porCor = {};
      its.forEach(function (x) { var k = x.cor || ''; (porCor[k] = porCor[k] || []).push(x); });
      Object.keys(porCor).forEach(function (cor) {
        var L = porCor[cor], q = L.reduce(function (a, x) { return a + x.qty; }, 0), gs0 = precoTab(L[0], T.id),
          gr = L.filter(function (x) { return x.grau; }).map(function (x) { return x.grau; }).filter(function (g, i, a) { return a.indexOf(g) === i; }).join(' ');
        out.push({ ref: p.ref, nome: p.nome, cat: cat[L[0].tipo] || cat[(typeof tFor === 'function' && tFor(L[0]).cat) || ''] || 'Otros', cor: cor, q: q, graus: gr, gs: gs0, usd: S.fx && S.fx.pyg ? (gs0 / S.fx.pyg).toFixed(2).replace('.', ',') : '', min: T.min ? Math.ceil(T.min / Math.max(1, gs0 / (S.fx.pyg || 1))) : 0 });
      });
    });
    return out;
  }
  // capa de status (1080 × 1920): até 4 peças, título e link
  function s185Capa(E, ims) {
    var cv = document.createElement('canvas');
    cv.width = 1080; cv.height = 1920;
    var x = cv.getContext('2d'), es = typeof ebEs === 'function' && ebEs(E.cli);
    x.fillStyle = '#111'; x.fillRect(0, 0, 1080, 1920);
    x.fillStyle = '#fff'; x.font = '600 44px Georgia, serif'; x.fillText('LA FOUCH', 80, 150);
    x.font = '600 26px Inter, Arial'; x.fillStyle = '#bbb'; x.textAlign = 'right'; x.fillText(es ? 'SELECCIÓN LA FOUCH' : 'SELEÇÃO LA FOUCH', 1000, 150); x.textAlign = 'left';
    var W = 440, H = 440;
    ims.slice(0, 4).forEach(function (im, k) {
      var cx = 80 + (k % 2) * (W + 40), cy = 240 + Math.floor(k / 2) * (H + 40);
      x.fillStyle = '#fff'; if (x.roundRect) { x.beginPath(); x.roundRect(cx, cy, W, H, 34); x.fill(); } else x.fillRect(cx, cy, W, H);
      if (im && im.width) { var s = Math.min((W - 60) / im.width, (H - 60) / im.height); x.drawImage(im, cx + (W - im.width * s) / 2, cy + (H - im.height * s) / 2, im.width * s, im.height * s); }
    });
    var n = E.pecas.length, min = Math.min.apply(null, E.pecas.map(function (p) { return p.preco || 9e15; }));
    x.fillStyle = '#fff'; x.font = '600 70px Georgia, serif';
    x.fillText(n + (es ? (n === 1 ? ' modelo' : ' modelos') : n === 1 ? ' modelo' : ' modelos'), 80, 1290);
    x.font = '400 36px Inter, Arial'; x.fillStyle = '#ddd';
    if (min < 9e15) x.fillText((es ? 'desde ' : 'a partir de ') + gs(min) + (es ? ' · retiro hoy en CDE' : ' · retirada hoje em CDE'), 80, 1350);
    x.font = '600 38px Inter, Arial'; x.fillStyle = '#e8b6d2';
    x.fillText(s185Sel(E).replace(/^https:\/\//, ''), 80, 1760);
    x.font = '400 30px Inter, Arial'; x.fillStyle = '#aaa'; x.fillText('Galería Jebai Center · Ciudad del Este', 80, 1810);
    return cv;
  }

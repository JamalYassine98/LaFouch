  // ===== S370 (16/11/2026) — esboços 23 e 27 (aprovados 15/11/2026): tela ATACADO do próprio app =====
  // Antes: o atalho Atacado abria o painel do site; os lotes ficavam em Clientes › Lotes; o envio a lojista no Compartilhar do Catálogo.
  // Agora: uma tela do app com 4 abas — Mensagens (pedidos de orçamento do site + pedidos das contas), Lojistas (contas),
  // Lotes e Tabela (enviar catálogo a um lojista, ver a tabela como o lojista vê, editar as tabelas). "+ Novo acesso" ao lado do título.
  // A estrutura é criada aqui (app.js), nunca só no index.html (o aparelho pode estar com o index antigo).
  if (!$('v-ata')) {
    var _va = document.createElement('div');
    _va.id = 'v-ata';
    _va.className = 'view';
    _va.hidden = true;
    var _vc = $('v-clientes');
    if (_vc && _vc.parentNode) _vc.parentNode.insertBefore(_va, _vc.nextSibling);
    else document.querySelector('.wrap') && document.querySelector('.wrap').appendChild(_va);
  }
  if (!VIEWS.some(function (v) { return v[0] === 'ata'; })) VIEWS.push(['ata', 'Atacado']);
  S.ataAba = S.ataAba || 'msg';
  var ATA_ABAS = [['msg', 'Mensagens'], ['loj', 'Lojistas'], ['lot', 'Lotes'], ['tab', 'Tabela']];
  // mensagens de atacado que chegaram pelo site (a mesma lista do painel › Mensagens, só as de atacado)
  function ataMsgBusca() {
    if (ataMsgBusca.on || !S.nuvem || !S.nuvem.rt || navigator.onLine === false || typeof nvToken !== 'function') return;
    ataMsgBusca.on = 1;
    nvToken().then(function (t) {
      return fetch('https://southamerica-east1-' + nvCfg().p + '.cloudfunctions.net/mensagem', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t }, body: JSON.stringify({ acao: 'lista', n: 200 }) }).then(function (r) { return r.json(); });
    }).then(function (j) {
      ataMsgBusca.on = 0;
      if (!j || !j.ok) { S._ataMsgErr = 1; return; }
      S._ataMsgErr = 0;
      S.ataMsgs = (j.itens || []).filter(function (m) { return m && m.tipo === 'atacado'; }).slice(0, 100);
      S._ataMsgTs = Date.now();
      if (S.view === 'ata') renderAtacado();
    }, function () { ataMsgBusca.on = 0; S._ataMsgErr = 1; if (S.view === 'ata') renderAtacado(); });
  }
  function ataHa(ts) {
    var m = Math.max(0, Math.round((Date.now() - (+ts || 0)) / 60000));
    if (m < 60) return 'há ' + Math.max(1, m) + ' min';
    var h = Math.round(m / 60);
    if (h < 24) return 'há ' + h + ' h';
    var d = Math.round(h / 24);
    return d === 1 ? 'ontem' : 'há ' + d + ' dias';
  }
  function ataLinha(act, id, tit, sub, n) {
    return '<button type="button" class="ataL" data-act="' + act + '" data-id="' + esc(String(id)) + '"><span><b>' + esc(tit) + '</b><small>' + esc(sub) + '</small></span>' + (n ? '<em>' + n + '</em>' : '') + '<i aria-hidden="true">›</i></button>';
  }
  function ataMsgItens() {
    var o = [];
    (S.ataMsgs || []).forEach(function (m) {
      o.push({ k: 'm', id: m.id, ts: m.ts || 0, tit: m.nome || 'Lojista', sub: (m.qtd ? 'Quer ' + m.qtd + (/\d$/.test(m.qtd) ? ' peças' : '') : 'Pediu orçamento') + (m.procura && m.procura.length ? ' · ' + m.procura.join(', ') : '') + ' · ' + ataHa(m.ts), novo: (m.est || 'novo') === 'novo' });
    });
    Object.keys(S.ataPeds || {}).forEach(function (k) {
      // avisos das contas de atacado (pedido confirmado, aviso de volta, aparelho novo…), gravados pela função atacado
      var p = S.ataPeds[k] || {},
        c = (S.ataContas || {})[p.conta] || {},
        d = String(p.d || 'Pedido de atacado');
      o.push({ k: 'p', id: k, ts: +p.ts || 0, tit: c.nome || p.nome || 'Lojista', sub: d.charAt(0).toUpperCase() + d.slice(1) + ' · ' + ataHa(p.ts), novo: !p.visto });
    });
    return o.sort(function (a, b) { return b.ts - a.ts; });
  }
  function ataCorpo() {
    var a = S.ataAba, h = '';
    if (a === 'msg') {
      var L = ataMsgItens();
      if (!S._ataMsgTs || Date.now() - S._ataMsgTs > 120000) ataMsgBusca();
      var sel = ataPC() ? (S.ataMsgs || []).filter(function (m) { return m.id === S._ataSel; })[0] || (S.ataMsgs || [])[0] : null;
      h = L.length
        ? '<section class="card ataLs">' + L.map(function (x) { return ataLinha(x.k === 'm' ? 'ataMsgAbre' : 'ataPedAbre', x.id, x.tit, x.sub, x.novo ? 1 : 0).replace('class="ataL"', 'class="ataL' + (sel && sel.id === x.id ? ' on' : '') + '"'); }).join('') + '</section>'
        : '<div class="ataVz">' + (S._ataMsgErr && !(S.ataMsgs || []).length ? 'Sem conexão com a nuvem agora. As mensagens de lojistas aparecem aqui quando o app estiver conectado.' : 'Nenhuma mensagem de lojista ainda.') + '</div>';
      h += '<p class="ataNt">Mensagens e pedidos de lojistas que chegam pelo site.</p>';
      if (sel) h = '<div class="ataDuo"><div>' + h + '</div><div class="ataDet"><h2>' + esc(sel.nome || 'Lojista') + '</h2>' + ataMsgDetHtml(sel) + '</div></div>';
    } else if (a === 'loj') {
      var C = Object.keys(S.ataContas || {}).map(function (k) { return S.ataContas[k]; }).filter(function (c) { return c && !c.cancelada; });
      h = C.length
        ? '<section class="card ataLs">' + C.map(function (c) {
            var ap = (c.aparelhos || []).length;
            return ataLinha('ataLojAbre', c.id, c.nome || 'Lojista', (c.pausada ? 'Pausada · ' : '') + 'Tabela ' + tabDe(c.tab).nome + ' · ' + ap + (ap === 1 ? ' aparelho' : ' aparelhos'), 0);
          }).join('') + '</section>'
        : '<div class="ataVz">Nenhum lojista com acesso ainda. Toque em “+ Novo acesso” para criar o primeiro.</div>';
      // S418 (113c): as contas canceladas ficam num bloco que abre no lugar
      var X = Object.keys(S.ataContas || {}).map(function (k) { return S.ataContas[k]; }).filter(function (c) { return c && c.cancelada; });
      if (X.length)
        h += '<section class="card ataLs" style="margin-top:12px"><button type="button" class="ataL ata418C' + (S._ataCanc ? ' on' : '') + '" data-act="ataCancAb" aria-expanded="' + !!S._ataCanc + '"><span><b>Canceladas</b><small>' + X.length + (X.length === 1 ? ' conta' : ' contas') + ' · não entram mais</small></span><i aria-hidden="true">⌄</i></button>' +
          (S._ataCanc ? X.map(function (c) { return ataLinha('ataLojAbre', c.id, c.nome || 'Lojista', 'cancelada' + (c.cancEm ? ' em ' + fd(c.cancEm) : '') + ' · ver a conta', 0); }).join('') : '') + '</section>';
      h += '<p class="ataNt">Cada lojista compra pelo link da conta dele, com a tabela e o mínimo do atacado.</p>';
    } else if (a === 'lot') {
      var T = Object.keys(S.ataLotes || {}).map(function (k) { return S.ataLotes[k]; }).filter(Boolean).sort(function (x, y) { return (y.ts || 0) - (x.ts || 0); });
      h = T.length
        ? '<section class="card ataLs">' + T.map(function (L) {
            var n = (L.contas || []).length, st = ataLoteSt(L), d = L.ate ? Math.ceil((L.ate - Date.now()) / DAY) : 0;
            return ataLinha('ataLoteAbre', L.id, L.nome || 'Lote', (st === 'Ativo' ? 'Aberto' : st) + ' · ' + n + (n === 1 ? ' loja' : ' lojas') + (st === 'Ativo' && d > 0 ? ' · vence em ' + d + (d === 1 ? ' dia' : ' dias') : ''), 0);
          }).join('') + '</section>'
        : '<div class="ataVz">Nenhum lote ainda.</div>';
      h += '<button type="button" class="lkTx ataMais" data-act="ataLoteNovo">+ Criar lote</button>';
    } else {
      h = '<section class="card ataLs">' +
        ataLinha('ataEnvLoj', '', 'Enviar catálogo a um lojista', 'Abre o Compartilhar já em Lojista (catálogo PDF ou planilha)', 0) +
        ataLinha('ataVerTab', '', 'Ver a tabela de atacado', 'Os preços como o lojista vê', 0) +
        ataLinha('tabedit', '', 'Editar tabelas', 'Margem, mínimo e frete de cada tabela', 0) +
        '</section><p class="ataNt">O lojista compra pelo link da conta dele, com o mínimo do atacado.</p>';
    }
    return h;
  }
  function renderAtacado() {
    var el = $('v-ata');
    if (!el || S.view !== 'ata') return;
    var tabs = '<div class="s185Seg lfAbas ataTabs" id="ataTabs" role="tablist">' + ATA_ABAS.map(function (t) {
      var nn = t[0] === 'msg' ? ataMsgItens().filter(function (x) { return x.novo; }).length : 0;
      return '<button type="button" role="tab" data-act="ataAba" data-id="' + t[0] + '" class="' + (S.ataAba === t[0] ? 'on' : '') + '" aria-selected="' + (S.ataAba === t[0]) + '">' + t[1] + (nn ? ' <b class="ataBd">' + nn + '</b>' : '') + '</button>';
    }).join('') + '</div>';
    el.innerHTML = '<div class="top"><div><h1>Atacado</h1><div class="crumb">Lojistas, lotes e pedidos em quantidade.</div></div><button type="button" class="pgAc" data-act="ataNovo">+ Novo acesso</button></div>' + tabs + '<div id="ataCorpo">' + ataCorpo() + '</div>';
    if (window.lfLinhaAbas) window.lfLinhaAbas('ataTabs', '.on');
  }
  var _render23 = render;
  render = function () {
    var r = _render23.apply(this, arguments);
    try { renderAtacado(); } catch (e) {}
    return r;
  };
  ACT.ataAba = function (id) {
    if (S.ataAba === id) return;
    S.ataAba = id;
    renderAtacado();
    var c = $('ataCorpo');
    if (c && typeof animEnter === 'function') animEnter(c);
  };
  ACT.ataCancAb = function () {
    S._ataCanc = !S._ataCanc;
    render();
  };
  ACT.ataLojAbre = function (id) { if (typeof ataJanela === 'function') ataJanela(id); };
  function ataPC() { return window.innerWidth >= 1024; }
  function ataMsgDetHtml(m) {
    var tel = String(m.tel || '').replace(/\D/g, '');
    return '<section class="card col" style="gap:0">' +
          [['Quantidade', m.qtd], ['Procura', (m.procura || []).join(', ')], ['País', m.pais], ['Telefone', m.tel], ['E-mail', m.email], ['Código', m.cod], ['Viu no site', (m.vistos || []).join(', ')], ['Favoritos', (m.favs || []).join(', ')], ['Chegou', ataHa(m.ts)]]
            .filter(function (r) { return r[1]; }).map(function (r) { return '<div class="sl"><span>' + r[0] + '</span><b>' + esc(String(r[1])) + '</b></div>'; }).join('') +
          '</section>' +
          (tel ? '<a class="go" style="display:flex;justify-content:center;text-decoration:none" href="https://wa.me/' + tel + '" target="_blank" rel="noopener">Responder no WhatsApp</a>' : '') +
          '<button type="button" class="lkTx" data-act="ataNovo" style="display:block;margin:12px auto 0">Criar acesso para este lojista ›</button>';
  }
  ACT.ataMsgAbre = function (id) {
    var m = (S.ataMsgs || []).filter(function (x) { return x.id === id; })[0];
    if (!m) return;
    // esboço 30: no computador a mensagem abre ao lado da lista
    if (ataPC()) { S._ataSel = id; return renderAtacado(); }
    lfJanela({ titulo: m.nome || 'Lojista', monta: function (box) { box.innerHTML = ataMsgDetHtml(m); } });
  };
  ACT.ataPedAbre = function (id) {
    var p = (S.ataPeds || {})[id];
    if (!p) return;
    p.visto = true;
    saveSoon();
    if (p.lote && typeof ataLoteJanela === 'function' && S.ataLotes[p.lote]) return ataLoteJanela(p.lote);
    if (p.conta && typeof ataJanela === 'function' && S.ataContas[p.conta]) return ataJanela(p.conta);
    renderAtacado();
  };
  function ataRefsEstoque() {
    var v = {};
    (S.items || []).forEach(function (it) { if (it.qty > 0 && !it.bulk && !(S.ataPub && S.ataPub[it.ref] === false)) v[it.ref] = 1; });
    return Object.keys(v);
  }
  ACT.ataEnvLoj = function () {
    var r = ataRefsEstoque();
    if (!r.length) return lfToast('Sem peças em estoque para mandar.');
    S._s185Para = 'loj';
    ebAbre(r);
  };
  ACT.ataVerTab = function () {
    var tabs = tabLista().filter(function (t) { return !t.pub && t.on !== false; });
    if (!tabs.length) return lfToast('Nenhuma tabela de atacado ativa.');
    var E = { tab: tabs[0].id, pecas: ataRefsEstoque().map(function (r) { return { ref: r, nome: pn(r) }; }) };
    lfJanela({
      titulo: 'Tabela de atacado',
      monta: function (box) {
        var pinta = function () {
          var L = s185Linhas(E), T = tabDe(E.tab);
          box.innerHTML =
            '<select class="in" id="ataTbSel" aria-label="Tabela">' + tabs.map(function (t) { return '<option value="' + t.id + '"' + (t.id === E.tab ? ' selected' : '') + '>' + esc(t.nome) + '</option>'; }).join('') + '</select>' +
            '<p class="ataNt">' + (T.min ? 'Mínimo do pedido: US$ ' + T.min + ' · ' : '') + L.length + ' linhas · como o lojista vê</p>' +
            '<section class="card ataLs">' + L.slice(0, 300).map(function (r) {
              return '<div class="ataTb"><span><b>' + esc(r.ref + ' · ' + r.nome) + '</b><small>' + esc((r.cor ? r.cor + ' · ' : '') + r.q + (r.q === 1 ? ' peça' : ' peças') + (r.graus ? ' · ' + r.graus : '')) + '</small></span><b>US$ ' + esc(String(r.usd)) + '</b></div>';
            }).join('') + '</section>';
          $('ataTbSel').onchange = function () { E.tab = this.value; pinta(); };
        };
        pinta();
      }
    });
  };

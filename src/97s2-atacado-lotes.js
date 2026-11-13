  // ===== S206 (aprovado 13/11/2026): LOTES de atacado =====
  // O dono cria um lote (peças escolhidas e/ou um filtro: "todos os acetatos", "todas as armações"), escolhe para quais contas
  // vai, a moeda inicial e a validade. O preço fica congelado (US$) até a validade; peças novas que entram no filtro aparecem
  // sozinhas no site. Vários lotes podem ter as mesmas peças: o estoque é ao vivo e quem confirma primeiro leva (o site separa
  // 30 min por peça ao tocar "+"). O link só existe depois de salvar. Cancelado ou vencido → no site aparece "Lote finalizado".
  S.ataLotes = S.ataLotes || {};
  function ataLoteId() { return 'L' + Date.now().toString(36).slice(-5) + Math.random().toString(36).slice(2, 5); }
  function ataLoteLink(L, cid) { return 'https://lafouch.com/atacado?c=' + encodeURIComponent(cid) + '&l=' + encodeURIComponent(L.id); }
  function ataLoteSt(L) { var ag = Date.now(); return L.cancelado ? 'Cancelado' : L.ate && L.ate < ag ? 'Vencido' : 'Ativo'; }
  // peças que o filtro pega agora (para o dono ver a contagem e congelar o preço de cada uma)
  function ataLoteRefs(L) {
    var P = ataPrecos(L.tab || 'a1'), out = {};
    if (!P) return out;
    Object.keys(P.itens).forEach(function (r) {
      var it = P.itens[r], f = L.filtro;
      if (f && (!f.tipo || it.tipo === f.tipo) && (!f.mat || String(it.mat || '').toLowerCase() === String(f.mat).toLowerCase())) out[r] = it;
      if (L.itens && L.itens[r]) out[r] = it;
    });
    return out;
  }
  function ataLoteGrava(L) {
    S.ataLotes[L.id] = L;
    saveSoon();
    if (typeof nvApi !== 'function' || !S.nuvem || !S.nuvem.rt) return Promise.resolve(false);
    var o = {};
    ['nome', 'tab', 'ate', 'contas', 'moeda', 'filtro', 'itens', 'cancelado', 'ts'].forEach(function (k) { if (L[k] !== undefined) o[k] = L[k]; });
    return nvApi('PATCH', 'atacadoLotes/' + encodeURIComponent(L.id), vBody(o)).then(function () { return true; }, function () { return false; });
  }
  // situação do lote: confirmados (pedidos com este lote), montando (separações dentro dos 30 min), avisos "avise-me"
  function ataLoteSituacao(L) {
    var conf = Object.keys(S.ataPeds || {}).map(function (k) { return S.ataPeds[k]; }).filter(function (p) { return p && p.lote === L.id; });
    if (typeof nvApi !== 'function' || !S.nuvem || !S.nuvem.rt) return Promise.resolve({ conf: conf, mont: [] });
    return nvApi('GET', 'atacadoSep?pageSize=100').then(function (j) {
      var ag = Date.now(), mont = (j.documents || []).map(function (d) { return ataFv(d.fields); }).filter(function (x) { return x && x.l === L.id && x.ini > ag - 30 * 60000 && Object.keys(x.itens || {}).length; });
      return { conf: conf, mont: mont };
    }, function () { return { conf: conf, mont: [] }; });
  }
  // guardião: lote que vence amanhã
  function ataLotesVencendo() { var ag = Date.now(); return Object.keys(S.ataLotes).map(function (k) { return S.ataLotes[k]; }).filter(function (L) { return L && !L.cancelado && L.ate > ag && L.ate - ag < DAY; }); }
  function ataContasAtivas() { var ag = Date.now(); return Object.keys(S.ataContas || {}).map(function (k) { return S.ataContas[k]; }).filter(function (c) { return c && !c.cancelada && !c.pausada && !(c.tipo === 'visita' && c.fim < ag); }); }
  var ATA_MOEDAS = [['usd', 'US$'], ['gs', 'Gs.'], ['brl', 'R$']];
  function ataLotesHtml() {
    var L = Object.keys(S.ataLotes).map(function (k) { return S.ataLotes[k]; }).sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
    return '<div class="col" style="gap:12px;padding:0 16px 16px">' +
      '<button type="button" class="go" data-act="ataLoteNovo">+ Criar lote</button>' +
      (L.length ? '<section class="card col" style="gap:0"><div class="lbl">LOTES · ' + L.length + '</div>' + L.map(function (x) {
        var st = ataLoteSt(x), n = Object.keys(ataLoteRefs(x)).length;
        return '<button type="button" class="sl ataLn" data-act="ataLoteAbre" data-id="' + esc(x.id) + '"><span><b>' + esc(x.nome || 'Lote') + '</b><small>' + n + ' modelos · ' + (x.contas || []).length + ' loja(s) · até ' + fd(x.ate) + '</small></span><em class="ataSt ' + (st === 'Ativo' ? 'ok' : 'off') + '">' + st + '</em></button>';
      }).join('') + '</section>' : '<div class="hint" style="text-align:center">Nenhum lote ainda. Um lote é um catálogo preparado: você escolhe as peças (ou "todos os acetatos"), para quem vai e até quando o preço vale.</div>') + '</div>';
  }
  ACT.ataLotes = function () { lfJanela({ titulo: 'Lotes de atacado', monta: function (box) { box.innerHTML = ataLotesHtml(); } }); };
  // criar / editar
  function ataLoteForm(L) {
    var novo = !L;
    L = L || { id: '', nome: '', tab: ((tabLista().filter(function (t) { return !t.pub && /^a/.test(t.id); })[0] || {}).id) || 'a1', ate: Date.now() + 7 * DAY, contas: [], moeda: 'usd', filtro: null, itens: {}, cancelado: false };
    lfJanela({
      titulo: novo ? 'Novo lote' : 'Editar lote',
      monta: function (box) {
        var cs = ataContasAtivas(), f = L.filtro || {}, dias = Math.max(1, Math.round((L.ate - Date.now()) / DAY));
        box.innerHTML = '<div class="col" style="gap:10px;padding:0 16px 16px">' +
          '<input class="in" id="ltNm" placeholder="Nome (ex.: Acetatos novembro)" value="' + esc(L.nome) + '">' +
          '<div class="lbl">TABELA DE PREÇO</div><select class="in" id="ltTab">' + tabLista().filter(function (t) { return !t.pub; }).map(function (t) { return '<option value="' + t.id + '"' + (t.id === L.tab ? ' selected' : '') + '>' + esc(t.nome) + '</option>'; }).join('') + '</select>' +
          '<div class="lbl">PEÇAS POR FILTRO (ENTRAM SOZINHAS AS NOVAS)</div>' +
          '<div class="ataRw2"><select class="in" id="ltTp"><option value="">Sem filtro</option><option value="armacao"' + (f.tipo === 'armacao' ? ' selected' : '') + '>Todas as armações</option><option value="sol"' + (f.tipo === 'sol' ? ' selected' : '') + '>Todos os óculos de sol</option><option value="leitura"' + (f.tipo === 'leitura' ? ' selected' : '') + '>Todos os de leitura</option><option value="*"' + (f.tipo === '' && f.mat ? ' selected' : '') + '>Todos os tipos</option></select>' +
          '<input class="in" id="ltMat" placeholder="Material (ex.: Acetato)" value="' + esc(f.mat || '') + '"></div>' +
          '<div class="lbl">E/OU PEÇAS ESCOLHIDAS · CÓDIGO=QUANTIDADE</div>' +
          '<textarea class="in" id="ltIt" rows="3" placeholder="AC1050, SL2210=6 (vazio = só o filtro)">' + esc(Object.keys(L.itens || {}).map(function (r) { var q = L.itens[r].q || {}, n = Object.keys(q).reduce(function (a, k) { return a + (+q[k] || 0); }, 0); return n ? r + '=' + n : r; }).join(', ')) + '</textarea>' +
          '<div class="lbl">PARA QUAIS LOJAS</div>' + (cs.length ? cs.map(function (c) { return '<label class="sl"><span>' + esc(c.nome) + '<small>' + (c.tipo === 'visita' ? 'visitante' : 'cliente') + '</small></span><input type="checkbox" class="ltC" value="' + esc(c.id) + '"' + ((L.contas || []).indexOf(c.id) >= 0 ? ' checked' : '') + '></label>'; }).join('') : '<div class="hint">Nenhuma conta ativa. Crie em Clientes › Conta Atacadista.</div>') +
          '<div class="lbl">MOEDA QUE ELES VEEM PRIMEIRO (PODEM TROCAR)</div><div class="ataRw">' + ATA_MOEDAS.map(function (m) { return '<button type="button" class="mini' + (L.moeda === m[0] ? '' : ' ghost') + '" data-mo="' + m[0] + '">' + m[1] + '</button>'; }).join('') + '</div>' +
          '<div class="sl"><span>Preço vale por</span><span style="display:flex;gap:6px;align-items:center"><button type="button" class="gMudo" id="ltD-">−</button><b id="ltD">' + dias + '</b> dias<button type="button" class="gMudo" id="ltD+">+</button></span></div>' +
          '<div class="hint" id="ltCt" style="margin:0;text-align:center"></div>' +
          '<button type="button" class="go" id="ltOk">' + (novo ? 'Salvar lote' : 'Salvar mudanças') + '</button></div>';
        var mo = L.moeda;
        box.querySelectorAll('[data-mo]').forEach(function (b) { b.onclick = function () { mo = b.getAttribute('data-mo'); box.querySelectorAll('[data-mo]').forEach(function (x) { x.classList.toggle('ghost', x !== b); }); }; });
        $('ltD-').onclick = function () { dias = Math.max(1, dias - 1); $('ltD').textContent = dias; };
        $('ltD+').onclick = function () { dias = Math.min(60, dias + 1); $('ltD').textContent = dias; };
        var le = function () {
          var tp = $('ltTp').value, mat = $('ltMat').value.trim(), itens = {}, ruins = [];
          var x = { tab: $('ltTab').value, filtro: tp || mat ? { tipo: tp === '*' ? '' : tp, mat: mat } : null, itens: itens };
          var P = ataPrecos(x.tab) || { itens: {} };
          $('ltIt').value.split(/[,\n]+/).map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (s) {
            var p = s.split('='), r = p[0].trim().toUpperCase(), n = +p[1] || 0, it = P.itens[r];
            if (!it) { ruins.push(r); return; }
            var q = {};
            if (n) { var rest = n; (it.cores || []).forEach(function (c) { var t = Math.min(rest, c[1]); if (t > 0) { q[c[0]] = t; rest -= t; } }); }
            itens[r] = { usd: it.usd, q: q };
          });
          // congela o preço de tudo que o filtro pega agora; peças novas entram com o preço do dia em que entrarem
          Object.keys(ataLoteRefs(x)).forEach(function (r) { if (!itens[r]) itens[r] = { usd: P.itens[r].usd, q: {} }; });
          return { x: x, ruins: ruins, n: Object.keys(itens).length };
        };
        var conta = function () { var r = le(); $('ltCt').textContent = r.n + ' modelos no lote' + (r.ruins.length ? ' · não achei: ' + r.ruins.join(', ') : ''); };
        ['ltTp', 'ltMat', 'ltIt', 'ltTab'].forEach(function (id) { $(id).oninput = conta; $(id).onchange = conta; });
        conta();
        $('ltOk').onclick = function () {
          var r = le(), contas = [].slice.call(box.querySelectorAll('.ltC:checked')).map(function (c) { return c.value; });
          if (!r.n) { lfToast('O lote está vazio: escolha um filtro ou peças'); return; }
          if (!contas.length) { lfToast('Escolha pelo menos uma loja'); return; }
          if (r.ruins.length) { lfToast('Código não encontrado: ' + r.ruins.join(', ')); return; }
          var o = Object.assign({}, L, r.x, { id: L.id || ataLoteId(), nome: $('ltNm').value.trim() || 'Lote ' + fd(Date.now()), contas: contas, moeda: mo, ate: Date.now() + dias * DAY, cancelado: false, ts: Date.now() });
          ataPublica(o.tab);
          ataLoteGrava(o).then(function (ok) { lfToast(ok ? (novo ? '✓ Lote salvo. Agora dá para enviar o link' : '✓ Lote atualizado (as lojas veem na hora)') : 'Salvo aqui; vai para a nuvem quando conectar'); ataLoteJanela(o.id); });
        };
      }
    });
  }
  ACT.ataLoteNovo = function () { ataLoteForm(null); };
  ACT.ataLoteEdita = function (id) { if (S.ataLotes[id]) ataLoteForm(Object.assign({}, S.ataLotes[id])); };
  ACT.ataLoteCanc = function (id) {
    var L = S.ataLotes[id];
    if (!L || !window.confirm('Encerrar o lote? O link passa a mostrar "Lote finalizado". As peças separadas voltam para o estoque.')) return;
    L.cancelado = true; ataLoteGrava(L); lfToast('Lote encerrado'); ataLoteJanela(id);
  };
  ACT.ataLoteEnvia = function (v) {
    var p = String(v).split('|'), L = S.ataLotes[p[0]], c = S.ataContas[p[1]];
    if (!L || !c) return;
    var es = !/^\+?55/.test(String(c.tel || '').replace(/\s/g, '')), nm = String(c.nome).split(' ')[0];
    var tx = (es ? '¡Hola ' + nm + '! Te preparé un lote en La Fouch: ' + L.nome + '. Precio garantizado hasta el ' + fd(L.ate) + '. Quien confirma primero se lo lleva: ' : 'Olá ' + nm + '! Preparei um lote para você na La Fouch: ' + L.nome + '. Preço garantido até ' + fd(L.ate) + '. Quem confirma primeiro leva: ') + ataLoteLink(L, c.id);
    window.open('https://wa.me/' + String(c.tel || '').replace(/\D/g, '') + '?text=' + encodeURIComponent(tx), '_blank');
  };
  ACT.ataLoteAbre = function (id) { ataLoteJanela(id); };
  function ataLoteJanela(id) {
    var L = S.ataLotes[id];
    if (!L) return;
    lfJanela({
      titulo: L.nome || 'Lote',
      monta: function (box) {
        var st = ataLoteSt(L), refs = ataLoteRefs(L), ativo = st === 'Ativo';
        var pinta = function (si) {
          box.innerHTML = '<div class="col" style="gap:12px;padding:0 16px 16px">' +
            '<section class="card col" style="gap:0"><div class="lbl">' + st.toUpperCase() + ' · VALE ATÉ ' + fd(L.ate) + '</div>' +
            '<div class="sl"><span>Modelos</span><b>' + Object.keys(refs).length + '</b></div>' +
            (L.filtro ? '<div class="sl"><span>Filtro</span><b>' + esc(({ armacao: 'Armações', sol: 'Sol', leitura: 'Leitura' }[L.filtro.tipo] || 'Todos') + (L.filtro.mat ? ' · ' + L.filtro.mat : '')) + '</b></div>' : '') +
            '<div class="sl"><span>Moeda inicial</span><b>' + (ATA_MOEDAS.filter(function (m) { return m[0] === L.moeda; })[0] || ATA_MOEDAS[0])[1] + '</b></div></section>' +
            '<section class="card col" style="gap:0"><div class="lbl">COMO ESTÁ</div>' +
            '<div class="sl"><span>✅ Confirmados</span><b>' + (si ? si.conf.length : '…') + '</b></div>' +
            '<div class="sl"><span>🧺 Montando agora (30 min)</span><b>' + (si ? si.mont.length : '…') + '</b></div>' +
            '<div class="sl"><span>⛔ Esgotaram</span><b>' + Object.keys(refs).filter(function (r) { return !(refs[r].cores || []).some(function (c) { return c[1] > 0; }); }).length + '</b></div></section>' +
            '<section class="card col" style="gap:0"><div class="lbl">ENVIAR O LINK</div>' + (L.contas || []).map(function (cid) { var c = S.ataContas[cid]; return c ? '<div class="sl"><span>' + esc(c.nome) + '</span>' + (ativo ? '<button type="button" class="gBtn" data-act="ataLoteEnvia" data-id="' + esc(L.id + '|' + cid) + '">WhatsApp</button>' : '<b>—</b>') + '</div>' : ''; }).join('') + '</section>' +
            '<div class="ataRw"><button type="button" class="mini ghost" data-act="ataLoteEdita" data-id="' + esc(L.id) + '">Editar</button>' + (ativo ? '<button type="button" class="mini ghost ataRm" data-act="ataLoteCanc" data-id="' + esc(L.id) + '">Encerrar lote</button>' : '') + '</div></div>';
        };
        pinta(null);
        ataLoteSituacao(L).then(function (si) { if (document.body.contains(box)) pinta(si); });
      }
    });
  }

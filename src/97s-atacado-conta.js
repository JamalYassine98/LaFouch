  // ===== S191 v2 (aprovado 12/11/2026): Conta Atacadista/Mayorista (Clientes) =====
  // Conta ASSOCIADA (cliente da loja): não vence, 3 aparelhos (editável), "Cliente pode trocar aparelho" (o dono é avisado;
  // +2 trocas em 30 dias = cartão "Bloquear trocas"), Pausar (some o catálogo, nada é apagado), Cancelar (apaga o acesso).
  // CONVITE de visitante: 3 dias, 3 aparelhos, o cliente não remove aparelho; quantos convites ativos = controlado pelo dono.
  // O site mostra o catálogo pela função "atacado" (preço da tabela + marca d'água); o pedido chega em Pedidos › Atacado.
  S.ataContas = S.ataContas || {}; // id → conta (espelho local)
  S.ataConvMax = S.ataConvMax || 5; // convites de visitante ativos ao mesmo tempo
  var ATA_DIAS = 3;
  function ataId() { return 'A' + Date.now().toString(36).slice(-6) + Math.random().toString(36).slice(2, 6); }
  function ataLink(c) { return 'https://lafouch.com/atacado?c=' + encodeURIComponent(c.id); }
  function ataFv(f) { var o = {}; Object.keys(f || {}).forEach(function (k) { o[k] = pedFv(f[k]); }); return o; }
  function ataGrava(c, campos) {
    S.ataContas[c.id] = c;
    saveSoon();
    if (typeof nvApi !== 'function' || !S.nuvem || !S.nuvem.rt) return Promise.resolve(false);
    var o = {};
    (campos || ['nome', 'email', 'tel', 'tipo', 'tab', 'dispMax', 'trocaOk', 'pausada', 'cancelada', 'fim', 'refs', 'cliId', 'ts', 'moeda']).forEach(function (k) { if (c[k] !== undefined) o[k] = c[k]; });
    var m = Object.keys(o).map(function (k) { return 'updateMask.fieldPaths=' + k; }).join('&');
    return nvApi('PATCH', 'atacadoContas/' + encodeURIComponent(c.id) + '?' + m, vBody(o)).then(function () { return true; }, function () { return false; });
  }
  // lê da nuvem os aparelhos e as trocas (o site é quem escreve)
  function ataLe(id) {
    if (typeof nvApi !== 'function' || !S.nuvem || !S.nuvem.rt) return Promise.resolve(S.ataContas[id]);
    return nvApi('GET', 'atacadoContas/' + encodeURIComponent(id)).then(function (j) {
      if (j && j.fields) { var o = ataFv(j.fields); delete o.codH; S.ataContas[id] = Object.assign({}, S.ataContas[id] || {}, o, { id: id }); saveSoon(); }
      return S.ataContas[id];
    }, function () { return S.ataContas[id]; });
  }
  // preços do atacado de cada tabela (só a função lê; o site público nunca vê)
  function ataPrecos(tab) {
    var T = tabDe(tab), itens = {}, fx = (S.fx && S.fx.pyg) || 0;
    if (!fx || !T || T.pub) return null;
    var refs = {};
    (S.items || []).forEach(function (it) { if (it.qty > 0 && !(S.ataPub && S.ataPub[it.ref] === false)) (refs[it.ref] = refs[it.ref] || []).push(it); });
    Object.keys(refs).forEach(function (ref) {
      var L = refs[ref], p = precoTab(L[0], T.id), cs = {};
      L.forEach(function (x) { cs[x.cor || ''] = (cs[x.cor || ''] || 0) + x.qty; });
      var a = (typeof attrOf === 'function' && attrOf(ref)) || {};
      itens[ref] = { usd: Math.round((p / fx) * 100) / 100, gs: p, nome: pn(ref), tipo: L[0].tipo || '', mat: a.material || '', cores: Object.keys(cs).map(function (k) { return [k, cs[k]]; }), foto: S.site && S.site[ref] ? 'p/' + ref + '.jpg' : '' };
    });
    return { nome: T.nome, min: T.min ? Math.round((T.min / fx) * 100) / 100 : 0, ts: Date.now(), itens: itens };
  }
  function ataPublica(tab) {
    var P = ataPrecos(tab);
    if (!P || typeof nvApi !== 'function' || !S.nuvem || !S.nuvem.rt) return Promise.resolve(false);
    return nvApi('PATCH', 'atacadoPrecos/' + encodeURIComponent(tab), vBody(P)).then(function () { return true; }, function () { return false; });
  }
  function ataTrocas30(c) { var ag = Date.now(); return (c.trocas || []).filter(function (t) { return ag - t < 30 * DAY; }).length; }
  // guardião (S189): contas com trocas estranhas
  function ataTrocasEstranhas() {
    return Object.keys(S.ataContas || {}).map(function (k) { return S.ataContas[k]; }).filter(function (c) { return c && !c.cancelada && c.trocaOk !== false && ataTrocas30(c) > 2; });
  }
  function ataConvAtivos() { var ag = Date.now(); return Object.keys(S.ataContas).filter(function (k) { var c = S.ataContas[k]; return c.tipo === 'visita' && !c.cancelada && c.fim > ag; }).length; }
  function ataTgl(on, act, id) { return '<button type="button" class="nfTg' + (on ? ' on' : '') + '" data-act="' + act + '" data-id="' + esc(id) + '" role="switch" aria-checked="' + !!on + '"><i></i></button>'; }
  function ataContaHtml(c) {
    var ag = Date.now(), st = c.cancelada ? 'Cancelada' : c.pausada ? 'Pausada' : c.tipo === 'visita' && c.fim < ag ? 'Vencida' : 'Ativa', ap = c.aparelhos || [], tr = ataTrocas30(c);
    var ini = String(c.nome || '?').split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
    return '<div class="col" style="gap:12px;padding:0 16px 16px">' +
      '<section class="card ataTopo"><span class="ataAv">' + esc(ini) + '</span><div><b>' + esc(c.nome) + '</b><small>' + (c.tipo === 'visita' ? 'Visitante · ' : 'Cliente associado · ') + '<b style="color:' + (st === 'Ativa' ? 'var(--ok)' : 'var(--warn)') + '">' + st + '</b>' + (c.tipo === 'visita' ? ' · vence ' + fd(c.fim) : ' · não vence') + ' · ' + esc(tabDe(c.tab).nome) + '</small></div></section>' +
      '<section class="card col" style="gap:0"><div class="lbl">APARELHOS · ' + ap.length + ' DE ' + (c.dispMax || 3) + '</div>' +
      (ap.length ? ap.map(function (a) { return '<div class="sl"><span>' + esc(a.nome || 'Aparelho') + '<small>último uso ' + (a.ult ? fd(a.ult) + ' ' + fh(a.ult) : '—') + '</small></span><button type="button" class="gMudo" data-act="ataApRm" data-id="' + esc(c.id + '|' + a.id) + '">Remover</button></div>'; }).join('') : '<div class="hint" style="margin:6px 0">Ainda não entrou de nenhum aparelho.</div>') +
      '<div class="sl"><span>Limite de aparelhos</span><span style="display:flex;gap:6px;align-items:center"><button type="button" class="gMudo" data-act="ataLim" data-id="' + esc(c.id) + '|-1">−</button><b>' + (c.dispMax || 3) + '</b><button type="button" class="gMudo" data-act="ataLim" data-id="' + esc(c.id) + '|1">+</button></span></div></section>' +
      (tr > 2 && c.trocaOk !== false ? '<section class="card col ataAl"><b>Trocou de aparelho ' + tr + ' vezes em 30 dias</b><small>Pode ser que esteja repassando o acesso.</small><button type="button" class="gBtn" data-act="ataTroca" data-id="' + esc(c.id) + '" style="align-self:flex-start">Bloquear trocas</button></section>' : '') +
      '<section class="card col" style="gap:0"><div class="lbl">O QUE CADA BOTÃO FAZ</div>' +
      (c.tipo !== 'visita' ? '<div class="sl"><span><b>Cliente pode trocar aparelho</b><small>Desligado: ele não troca mais sozinho</small></span>' + ataTgl(c.trocaOk !== false, 'ataTroca', c.id) + '</div>' : '<div class="sl"><span><b>Cliente remove aparelho</b><small>Visitante nunca remove</small></span><b>Não</b></div>') +
      '<div class="sl"><span><b>Pausar</b><small>Some o catálogo. Nada é apagado. Volta com 1 toque</small></span><button type="button" class="gBtn" data-act="ataPausa" data-id="' + esc(c.id) + '">' + (c.pausada ? 'Voltar' : 'Pausar') + '</button></div>' +
      '<div class="sl"><span><b>Cancelar conta</b><small>Apaga o acesso. Para voltar, novo convite</small></span><button type="button" class="gBtn ataRm" data-act="ataCanc" data-id="' + esc(c.id) + '">Cancelar</button></div></section>' +
      '<section class="card col" style="gap:0"><div class="lbl">MOEDA QUE ELE VÊ PRIMEIRO (ELE PODE TROCAR)</div><div class="ataRw" style="padding:8px 0">' + [['usd', 'US$'], ['gs', 'Gs.'], ['brl', 'R$']].map(function (m) { return '<button type="button" class="mini' + ((c.moeda || 'usd') === m[0] ? '' : ' ghost') + '" data-act="ataMoeda" data-id="' + esc(c.id + '|' + m[0]) + '">' + m[1] + '</button>'; }).join('') + '</div></section>' +
      '<button type="button" class="mini ghost" data-act="ataLotes" style="align-self:center">📦 Lotes de atacado</button>' +
      '<button type="button" class="go" data-act="ataEnvia" data-id="' + esc(c.id) + '">Enviar convite pelo WhatsApp</button></div>';
  }
  function ataJanela(id) {
    var c = S.ataContas[id];
    if (!c) return;
    lfJanela({ titulo: 'Conta Atacadista/Mayorista', monta: function (box) { box.innerHTML = ataContaHtml(c); ataLe(id).then(function (n) { if (n && document.body.contains(box)) box.innerHTML = ataContaHtml(n); }); } });
  }
  // ficha do cliente → criar ou abrir a conta associada
  ACT.ataConta = function (cliId) {
    var cli = (S.clientes || []).filter(function (x) { return String(x.id) === String(cliId); })[0];
    if (!cli) return;
    var c = Object.keys(S.ataContas).map(function (k) { return S.ataContas[k]; }).filter(function (x) { return String(x.cliId) === String(cli.id) && !x.cancelada; })[0];
    if (!c) {
      if (!cli.email) { lfToast('Falta o e-mail do cliente (o código de entrada vai para ele)'); return; }
      var tab = (tabLista().filter(function (t) { return !t.pub && /^a/.test(t.id); })[0] || {}).id || 'opt';
      c = { id: ataId(), nome: cli.nome || 'Cliente', email: String(cli.email).toLowerCase(), tel: cli.tel || '', tipo: 'assoc', tab: tab, dispMax: 3, trocaOk: true, pausada: false, cancelada: false, cliId: String(cli.id), ts: Date.now() };
      ataGrava(c).then(function (ok) { lfToast(ok ? '✓ Conta atacadista criada' : 'Criada aqui; vai para a nuvem quando conectar'); });
      ataPublica(c.tab);
    }
    ataJanela(c.id);
  };
  // novo acesso de visitante (convite de 3 dias)
  ACT.ataNovo = function () {
    if (ataConvAtivos() >= S.ataConvMax) { lfToast('Limite de ' + S.ataConvMax + ' convites ativos. Cancele um ou aumente o limite.'); return; }
    lfJanela({
      titulo: 'Novo acesso atacado',
      monta: function (box) {
        box.innerHTML = '<div class="col" style="gap:10px;padding:0 16px 16px"><div class="lbl">VISITANTE · AINDA NÃO É CLIENTE · VENCE EM ' + ATA_DIAS + ' DIAS</div>' +
          '<input class="in" id="ataNm" placeholder="Nome (ex.: Óptica Sol · Pedro)"><input class="in" id="ataTel" inputmode="tel" placeholder="WhatsApp"><input class="in" id="ataEm" inputmode="email" placeholder="E-mail (recebe o código para entrar)">' +
          '<select class="in" id="ataTab">' + tabLista().filter(function (t) { return !t.pub; }).map(function (t) { return '<option value="' + t.id + '">' + esc(t.nome) + '</option>'; }).join('') + '</select>' +
          '<input class="in" id="ataRefs" placeholder="O que vê: códigos separados por vírgula (vazio = tudo)" value="' + esc((S.ebSel || []).join(', ')) + '">' +
          '<div class="sl"><span>Aparelhos</span><b>3</b></div><div class="sl"><span>Dura</span><b>' + ATA_DIAS + ' dias (até ' + fd(Date.now() + ATA_DIAS * DAY) + ')</b></div><div class="sl"><span>Cliente remove aparelho</span><b>Não</b></div>' +
          '<div class="hint" style="margin:0">Convites ativos: ' + ataConvAtivos() + ' de ' + S.ataConvMax + '</div>' +
          '<button type="button" class="go" id="ataOk">Enviar convite</button></div>';
        $('ataOk').onclick = function () {
          var nm = $('ataNm').value.trim(), em = $('ataEm').value.trim().toLowerCase();
          if (!nm || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(em)) { lfToast('Preencha o nome e um e-mail válido'); return; }
          var refs = $('ataRefs').value.split(/[,\s]+/).map(function (r) { return r.trim().toUpperCase(); }).filter(Boolean);
          var c = { id: ataId(), nome: nm, email: em, tel: $('ataTel').value.trim(), tipo: 'visita', tab: $('ataTab').value, dispMax: 3, trocaOk: false, pausada: false, cancelada: false, fim: Date.now() + ATA_DIAS * DAY, refs: refs, ts: Date.now() };
          ataGrava(c);
          ataPublica(c.tab);
          ACT.ataEnvia(c.id);
        };
      }
    });
  };
  ACT.ataEnvia = function (id) {
    var c = S.ataContas[id];
    if (!c) return;
    var es = !/^\+?55/.test(String(c.tel || '').replace(/\s/g, ''));
    var tx = (es ? '¡Hola ' + String(c.nome).split(' ')[0] + '! La Fouch liberó el catálogo mayorista para vos' + (c.tipo === 'visita' ? ' (vale ' + ATA_DIAS + ' días)' : '') + '. Entrá con tu e-mail: ' : 'Olá ' + String(c.nome).split(' ')[0] + '! A La Fouch liberou o catálogo de atacado para você' + (c.tipo === 'visita' ? ' (vale ' + ATA_DIAS + ' dias)' : '') + '. Entre com o seu e-mail: ') + ataLink(c);
    var d = String(c.tel || '').replace(/\D/g, '');
    window.open('https://wa.me/' + d + '?text=' + encodeURIComponent(tx), '_blank');
  };
  function ataMuda(id, o, msg) { var c = S.ataContas[id]; if (!c) return; Object.assign(c, o); ataGrava(c, Object.keys(o)); if (msg) lfToast(msg); ataJanela(id); }
  ACT.ataMoeda = function (v) { var p = String(v).split('|'); ataMuda(p[0], { moeda: p[1] }); };
  ACT.ataTroca = function (id) { var c = S.ataContas[id]; if (c) ataMuda(id, { trocaOk: c.trocaOk === false }, c.trocaOk === false ? 'Trocas liberadas' : 'Trocas bloqueadas'); };
  ACT.ataPausa = function (id) { var c = S.ataContas[id]; if (c) ataMuda(id, { pausada: !c.pausada }, c.pausada ? 'Catálogo de volta' : 'Pausada: o catálogo sumiu'); };
  ACT.ataCanc = function (id) { if (!window.confirm('Cancelar a conta? O acesso é apagado; para voltar, só com novo convite.')) return; ataMuda(id, { cancelada: true }, 'Conta cancelada'); };
  ACT.ataLim = function (v) { var p = String(v).split('|'), c = S.ataContas[p[0]]; if (c) ataMuda(p[0], { dispMax: Math.max(1, Math.min(10, (c.dispMax || 3) + +p[1])) }); };
  ACT.ataApRm = function (v) {
    var p = String(v).split('|'), c = S.ataContas[p[0]];
    if (!c) return;
    c.aparelhos = (c.aparelhos || []).filter(function (a) { return a.id !== p[1]; });
    ataGrava(c, ['aparelhos']);
    ataJanela(p[0]);
  };
  // pedidos do atacado (site) → avisos + lista; lidos junto com a sincronização de pedidos
  function ataPedidosBusca() {
    if (typeof nvApi !== 'function' || !S.nuvem || !S.nuvem.rt) return Promise.resolve(0);
    return nvApi('GET', 'atacadoPedidos?pageSize=50').then(function (j) {
      var novos = 0;
      S.ataPeds = S.ataPeds || {};
      (j.documents || []).forEach(function (d) { var id = d.name.split('/').pop(); if (!S.ataPeds[id]) { S.ataPeds[id] = ataFv(d.fields); novos++; } });
      if (novos) { saveSoon(); lfToast('🧾 ' + novos + ' pedido(s) de atacado'); }
      return novos;
    }, function () { return 0; });
  }
  setTimeout(function () { ataPedidosBusca(); Object.keys(S.ataContas || {}).slice(0, 20).forEach(function (k) { ataLe(k); }); }, 8000);

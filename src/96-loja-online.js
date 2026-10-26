  // ===== Aba Site: a vitrine do lafouch.com. O dono escolhe o que vai; esgotado nunca entra e sai sozinho depois de N dias. =====
  var LOJA_URL = 'https://lafouch.com/admin.html';
  var MODO_ICO = {
    lista: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    grade: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'
  };
  function modoDe(aba) {
    return (S.vModo && S.vModo[aba]) || 'g';
  }
  // Botão da lupa: mostra o modo PARA ONDE vai trocar (em grade mostra "lista" e vice-versa).
  function modoBtn(btnEl, aba) {
    var m = modoDe(aba);
    btnEl.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (m === 'g' ? MODO_ICO.lista : MODO_ICO.grade) + '</svg>';
    btnEl.setAttribute('aria-label', m === 'g' ? 'Mostrar em lista' : 'Mostrar em catálogo');
    btnEl.onclick = function () {
      if (!S.vModo) S.vModo = {};
      S.vModo[aba] = m === 'g' ? 'l' : 'g';
      saveSoon();
      render();
    };
  }
  function vitRefs() {
    return Array.isArray(S.vitrine) ? S.vitrine : (S.vitrine = []);
  }
  function vitDias() {
    return S.vitDias > 0 ? S.vitDias : 14;
  }
  function vitInfo(ref) {
    var it = itemDoRef(ref),
      est = estoqueDoRef(ref);
    return { it: it, est: est, tipo: it ? it.tipo : '', nome: pubNome(ref), preco: it ? precoAtual(ref, it.tipo) : 0, foto: photoOf(ref) };
  }
  // Esgotado nunca é publicado; o que já está no ar e esgota fica "Esgotado" por N dias e sai sozinho.
  function vitManutencao() {
    var l = vitRefs(),
      ch = false;
    if (!S.esgDesde) S.esgDesde = {};
    l.slice().forEach(function (ref) {
      var est = estoqueDoRef(ref);
      if (est > 0) {
        if (S.esgDesde[ref]) {
          delete S.esgDesde[ref];
          ch = true;
        }
        return;
      }
      if (!S.esgDesde[ref]) {
        S.esgDesde[ref] = Date.now();
        ch = true;
      } else if (Date.now() - S.esgDesde[ref] > vitDias() * 864e5) {
        S.vitrine = vitRefs().filter(function (r) {
          return r !== ref;
        });
        delete S.esgDesde[ref];
        vitFila(ref, 'del');
        ch = true;
      }
    });
    if (ch) saveSoon();
  }
  // ---- publicar no site (Firestore, pelo login da Nuvem)
  function vTf(v) {
    if (v === null || v === undefined) return { nullValue: null };
    if (typeof v === 'string') return { stringValue: v };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    if (Array.isArray(v)) return { arrayValue: { values: v.map(vTf) } };
    var f = {};
    Object.keys(v).forEach(function (k) {
      f[k] = vTf(v[k]);
    });
    return { mapValue: { fields: f } };
  }
  function vBody(o) {
    var f = {};
    Object.keys(o).forEach(function (k) {
      f[k] = vTf(o[k]);
    });
    return JSON.stringify({ fields: f });
  }
  function vitProduto(ref) {
    var v = vitInfo(ref),
      a = attrOf(ref),
      pp = S.pprice && S.pprice[ref],
      ord = vitRefs().indexOf(ref) + 1,
      solar = v.tipo === 'solar';
    return {
      ref: ref,
      nome: v.nome,
      tipo: solar ? 'solar' : v.tipo === 'pre' ? 'grau' : 'armacao',
      n: v.preco || 0,
      de: pp && pp.ant > v.preco ? pp.ant : 0,
      aviso: v.est === 1 ? 'Última unidade' : '',
      tag: solar ? 'SOLAR' : 'ARMAÇÃO',
      mat: a.material || 'Acetato',
      gen: a.publico === 'Masculino' ? 'm' : a.publico === 'Feminino' ? 'f' : 'u',
      cor: '#2a2d33',
      cores: ['#2a2d33'],
      raio: 14,
      med: [52, 19, 145],
      rosto: ['oval'],
      rank: 0,
      oculto: false,
      fv: Math.floor(Date.now() / 1000),
      ord: ord,
      uv: solar
    };
  }
  function vitFila(ref, op) {
    if (!S.vitPend) S.vitPend = {};
    S.vitPend[ref] = op;
    saveSoon();
  }
  function vitSync() {
    var pend = S.vitPend || {},
      refs = Object.keys(pend);
    if (!refs.length || !S.nuvem || !S.nuvem.rt || navigator.onLine === false || vitSync.busy || Date.now() - (vitSync.fail || 0) < 60000) return Promise.resolve();
    vitSync.busy = true;
    return refs
      .reduce(function (p, ref) {
        return p.then(function () {
          var op = pend[ref];
          if (op === 'del')
            return nvApi('DELETE', 'produtos/' + ref).then(function () {
              return nvApi('DELETE', 'fotos/' + ref).catch(function () {});
            });
          var o = vitProduto(ref),
            f = vitInfo(ref).foto;
          return (f ? nvApi('PATCH', 'fotos/' + ref, vBody({ d: f })) : Promise.resolve()).then(function () {
            return nvApi('PATCH', 'produtos/' + ref, vBody(o));
          });
        }).then(function () {
          delete S.vitPend[ref];
          saveSoon();
        }, function () {});
      }, Promise.resolve())
      .then(function () {
        vitSync.busy = false;
        if (Object.keys(S.vitPend || {}).length) vitSync.fail = Date.now();
        S.vitMsg = Object.keys(S.vitPend || {}).length ? 'Alguns itens ainda não subiram. Tento de novo quando houver internet.' : 'Vitrine publicada no site.';
        if (S.view === 'onl') render();
      });
  }
  // Aba Site: o painel completo ocupa a tela; o botão de tela cheia fica dentro do painel, ao lado de "Cliente"
  window.addEventListener('message', function (e) {
    var f = $('lojaFrame');
    if (!f || e.source !== f.contentWindow || !e.data || typeof e.data.lfFull !== 'boolean') return;
    S.siteFull = e.data.lfFull;
    render();
  });
  function renderLojaOnline() {
    var el = $('v-onl');
    if (!el || S.view !== 'onl') return;
    vitManutencao();
    if (!el.getAttribute('data-sk')) {
      el.setAttribute('data-sk', '1');
      el.textContent = '';
      var host = mk('div', 'catbar3');
      host.id = 'uniS';
      el.appendChild(host);
      var sb = mk('div', 'sbox');
      sb.id = 'siteBox';
      var fr = mk('iframe');
      fr.id = 'lojaFrame';
      fr.title = 'Painel da loja online';
      fr.allow = 'clipboard-write';
      sb.appendChild(fr);
      var off = mk('section', 'card');
      off.id = 'siteOff';
      off.style.cssText = 'text-align:center;padding:22px';
      off.innerHTML = '<b style="font-size:17px">Sem internet</b><p style="color:var(--mu);margin:8px 0 14px">O painel do site só abre com internet, porque os dados ficam na nuvem.</p>';
      off.appendChild(btn('mini', 'Tentar de novo', function () {
        $('lojaFrame').src = LOJA_URL;
        render();
      }));
      sb.appendChild(off);
      el.appendChild(sb);
    }
    var l = vitRefs(),
      no = l.filter(function (r) {
        return estoqueDoRef(r) > 0;
      }).length;
    var online = navigator.onLine !== false;
    $('siteOff').hidden = online;
    $('lojaFrame').hidden = !online;
    if (online && !$('lojaFrame').getAttribute('src')) $('lojaFrame').src = LOJA_URL;
    $('siteBox').classList.toggle('full', !!S.siteFull);
    uniAbasFill();
    vitSync();
  }
  window.addEventListener('online', function () {
    if (S.view === 'onl') render();
  });
  ACT.lojaRecarregar = function () {
    render();
  };

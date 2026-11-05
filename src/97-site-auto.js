  // ===== Site automático + chave "No site" (v427, aprovado 04/11/2026) =====
  // O produto completo (foto em todas as cores, custo, estoque e nome) entra no site sozinho, com a descrição
  // feita pelo app quando não tiver uma. Aviso no sino com "Desfazer". Desligar a chave tira do site e o app
  // NUNCA coloca de novo sozinho (S.siteFora); ligar de novo é sempre do dono.
  S.siteFora = {}; // ref -> quando o dono tirou do site
  S.siteAutoLote = {}; // id -> [refs] que entraram juntos (para desfazer pelo sino)
  function siteAutoPronto(ref) {
    if (siteOn(ref) || (S.siteFora && S.siteFora[ref])) return false;
    var it = itemDoRef(ref);
    if (!it || it.bulk || isSimple(it.tipo) || !(effCusto(it) > 0)) return false;
    if (!String(pn(ref) || '').trim()) return false;
    return siteCheck(ref).ok;
  }
  function siteAutoRevisa() {
    if (!S.site) S.site = {};
    var vis = {},
      novos = [];
    (S.items || []).forEach(function (i) {
      if (vis[i.ref]) return;
      vis[i.ref] = 1;
      if (siteAutoPronto(i.ref)) novos.push(i.ref);
    });
    if (!novos.length) return [];
    novos.forEach(function (ref) {
      if (!S.desc) S.desc = {};
      if (!S.desc[ref] || !String(S.desc[ref]).trim()) {
        try {
          S.desc[ref] = descAutoDe(ref, pn(ref));
        } catch (e) {}
      }
      siteSet(ref, true);
    });
    var id = 'sa' + Date.now().toString(36);
    S.siteAutoLote[id] = novos.slice();
    (S.notifs = S.notifs || []).unshift({
      ts: Date.now(),
      lida: false,
      t: novos.length === 1 ? '1 peça entrou no site' : novos.length + ' peças entraram no site',
      s: novos.slice(0, 4).map(pn).join(', ') + (novos.length > 4 ? '…' : '') + ' · descrição pronta',
      acts: [{ act: 'siteAutoVer', id: id, b: 'Ver' }, { act: 'siteAutoDesf', id: id, b: 'Desfazer' }]
    });
    saveSoon();
    return novos;
  }
  ACT.siteAutoDesf = function (id) {
    var l = (S.siteAutoLote || {})[id] || [];
    l.forEach(function (ref) {
      siteSet(ref, false);
      S.siteFora[ref] = Date.now();
    });
    delete S.siteAutoLote[id];
    S.notifs = (S.notifs || []).filter(function (x) {
      return !(x.acts && x.acts[0] && x.acts[0].id === id);
    });
    saveSoon();
    lfToast(l.length === 1 ? 'Peça tirada do site' : l.length + ' peças tiradas do site');
    render();
  };
  ACT.siteAutoVer = function (id) {
    var l = (S.siteAutoLote || {})[id] || [];
    if (!l.length) return;
    S.view = 'estoque';
    S.q = l.length === 1 ? l[0] : '';
    render();
  };
  // Chave "No site" (no lugar do botão "Liberar para o site")
  function siteChave(ref) {
    var w = mk('div', 'card col siteChave'),
      on = siteOn(ref),
      ck = siteCheck(ref),
      fora = S.siteFora && S.siteFora[ref];
    w.id = 'edSite';
    var lin = mk('div', 'scLin'),
      tx = mk('div', 'scTx');
    tx.appendChild(mk('b', '', 'No site'));
    tx.appendChild(
      mk(
        'div',
        'hint',
        on
          ? 'aparece no catálogo online · ' + ck.cores.length + (ck.cores.length === 1 ? ' cor' : ' cores')
          : fora
            ? 'fora do site por você'
            : !ck.cores.length
              ? 'cadastre ao menos uma cor'
              : ck.sem
                ? 'sem peças em estoque'
                : ck.falta.length
                  ? 'falta foto da cor ' + ck.falta.map(function (c) { return c.cor; }).join(', ')
                  : 'entra sozinho quando estiver completo'
      )
    );
    lin.appendChild(tx);
    var sw = mk('button', 'scSw' + (on ? ' on' : ''));
    sw.type = 'button';
    sw.setAttribute('role', 'switch');
    sw.setAttribute('aria-checked', String(on));
    sw.setAttribute('aria-label', 'No site');
    sw.id = 'edSiteBtn';
    sw.onclick = function () {
      if (on) {
        siteSet(ref, false);
        S.siteFora[ref] = Date.now();
        saveSoon();
        render();
        return;
      }
      if (!ck.ok) {
        lfToast(ck.sem ? 'Sem peças em estoque' : ck.falta.length ? 'Falta foto da cor ' + ck.falta[0].cor : 'Cadastre ao menos uma cor');
        return;
      }
      delete S.siteFora[ref];
      siteSet(ref, true);
      render();
      siteFx(ref);
      siteOnda();
    };
    lin.appendChild(sw);
    w.appendChild(lin);
    var h = mk('div', 'hint', on ? 'Desligar tira do site; o app não coloca de novo sozinho.' : fora ? 'O app não coloca de novo sozinho. Ligue quando quiser.' : '');
    h.style.margin = '0';
    if (h.textContent) w.appendChild(h);
    if (on && ck.falta.length) {
      var a = mk('div', 'hint', 'Atenção: falta foto em ' + ck.falta.map(function (c) { return c.cor; }).join(', ') + '. Essa cor não aparece no site até ter foto.');
      a.style.margin = '0';
      w.appendChild(a);
    }
    return w;
  }
  if (!/#test/.test(location.hash)) {
    setTimeout(function () {
      if (siteAutoRevisa().length) render();
    }, 15000);
    setInterval(function () {
      if (siteAutoRevisa().length) render();
    }, 5 * 60000);
  }

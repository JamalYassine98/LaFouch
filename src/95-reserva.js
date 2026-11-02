  // ===== Reserva de peças do site (10 min) + baixa automática na entrega. =====
  // O app (dono) fala com a função "reserva" na nuvem; quem decide hora e estoque é sempre o servidor.
  // Tudo é opcional: se a função estiver desligada ou sem internet, o app segue como antes.
  function resUrl() {
    return 'https://southamerica-east1-' + nvCfg().p + '.cloudfunctions.net/reserva';
  }
  var RES_EST = {}; // estoque/<ref> baixado da nuvem (só reservas vivas)
  function resItensDe(p) {
    return (p.itens || [])
      .filter(function (l) {
        return l && l.ref;
      })
      .map(function (l) {
        return { ref: l.ref, cor: l.cor || '', q: l.q || 1 };
      });
  }
  function resRefsDe(p) {
    var m = {};
    resItensDe(p).forEach(function (i) {
      m[i.ref] = 1;
    });
    return Object.keys(m);
  }
  // Chama a função como dono. Devolve a resposta, ou null se estiver fora do ar/desligada.
  function resApi(acao, p, extra) {
    if (!p || !p.sid || !S.nuvem || !S.nuvem.rt) return Promise.resolve(null);
    var corpo = { acao: acao, pedido: p.sid };
    if (acao === 'pagar') corpo.itens = resItensDe(p);
    else corpo.refs = resRefsDe(p);
    if (!(corpo.itens || corpo.refs).length) return Promise.resolve(null);
    return nvToken()
      .then(function (t) {
        return fetch(resUrl(), { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t }, body: JSON.stringify(corpo) });
      })
      .then(function (r) {
        if (r.status >= 500 || r.status === 404) return null;
        return r.json().catch(function () {
          return null;
        });
      })
      .catch(function () {
        return null;
      });
  }
  // Pagamento confirmado: a peça fica segura. Se a reserva venceu e a peça já foi para outra pessoa, avisa o dono.
  function resPagar(p) {
    return resApi('pagar', p).then(function (r) {
      if (r && r.ok === false && r.motivo === 'expirou') {
        p.resAlerta = 'A reserva venceu e a peça já saiu para outra cliente. Resolva com a cliente (devolver o valor ou separar outra peça).';
        saveSoon();
        render();
        say('Atenção: ' + p.resAlerta);
      }
      return r;
    });
  }
  function resRecusar(p) {
    return resApi('recusar', p);
  }
  function resLibera(p) {
    return resApi('liberar', p);
  }
  // ---- liberar só depois que o site já recebeu o estoque novo (senão a peça volta ao ar por um instante)
  function resFlush() {
    var pend = S.resPend || {},
      ks = Object.keys(pend);
    if (!ks.length || !S.nuvem || !S.nuvem.rt || navigator.onLine === false) return;
    ks.forEach(function (sid) {
      var e = pend[sid],
        espera = e.refs.some(function (r) {
          return S.vitPend && S.vitPend[r];
        });
      if (espera && Date.now() - e.t < 15 * 60000) {
        vitSync();
        return;
      }
      resApi('liberar', { sid: sid, itens: e.refs.map(function (r) { return { ref: r }; }) }).then(function (r) {
        if (r === null) return; // tenta de novo no próximo ciclo
        delete S.resPend[sid];
        saveSoon();
      });
    });
  }
  setInterval(resFlush, 20000);
  setTimeout(resFlush, 8000);
  // ---- baixa automática: tira do estoque e registra a venda (venda de loja física NÃO entra aqui)
  function resItemInv(l) {
    var cor = String(l.cor || '').toLowerCase();
    return S.items.filter(function (i) {
      return i.ref === l.ref && !i.bulk && i.qty > 0 && (!cor || String(i.cor || '').toLowerCase() === cor);
    });
  }
  function pedBaixa(p) {
    if (p.baixa || p.orig !== 'site') return;
    var refs = resRefsDe(p),
      pend = function () {
        if (!refs.length) return;
        if (!S.resPend) S.resPend = {};
        S.resPend[p.sid] = { refs: refs, t: Date.now() };
      };
    if (!S.baixaAuto || p.teste) {
      pend(); // mesmo sem baixa automática, a reserva do pedido entregue é liberada
      resFlush();
      return;
    }
    var soma = (p.itens || []).reduce(function (a, l) {
        return a + (l.preco || 0) * (l.q || 1);
      }, 0),
      tot = pedTotal(p) || soma,
      vendas = [],
      falhas = [];
    (p.itens || []).forEach(function (l) {
      if (!l.ref) {
        falhas.push((l.t || 'Item') + ': sem código, registre à mão');
        return;
      }
      var falta = l.q || 1,
        preco = l.preco > 0 ? l.preco * falta : soma > 0 ? 0 : Math.round(tot / Math.max(1, (p.itens || []).length)),
        total = falta;
      resItemInv(l).forEach(function (it) {
        if (falta <= 0) return;
        var q = Math.min(it.qty, falta),
          rec = Math.round((preco * q) / total);
        falta -= q;
        it.qty -= q;
        var sg =
          it.lote &&
          S.grp.filter(function (x) {
            return x.id === it.lote;
          })[0];
        if (sg) {
          sg.sold = (sg.sold || 0) + q;
          if (it.custo != null && !it.bulk) {
            sg.ownQ = (sg.ownQ || 0) + q;
            sg.ownC = (sg.ownC || 0) + q * it.custo;
          }
        }
        var s = addSale(it, q, { moeda: 'pyg', forma: 'din', recebido: rec, pag: {} });
        S.cash.pyg -= rec; // o pagamento do site entra no banco, não na gaveta da loja
        s.site = p.num;
        s.orig = 'site';
        if (p.cliId) s.cliId = p.cliId;
        vendas.push(s.id);
        if (S.site && S.site[l.ref]) vitFila(l.ref, 'upd');
      });
      if (falta > 0) falhas.push(l.ref + (l.cor ? ' · ' + l.cor : '') + ': faltaram ' + falta + ' peça(s) no estoque, registre à mão');
    });
    p.baixa = { ts: Date.now(), vendas: vendas, falhas: falhas };
    pend();
    saveSoon();
    resFlush();
    say(
      falhas.length
        ? 'Entregue. Atenção: ' + falhas.join('; ')
        : 'Entregue. Estoque baixado e ' + (vendas.length === 1 ? 'venda ' : 'vendas ') + vendas.join(', ') + ' registrada' + (vendas.length === 1 ? '' : 's') + '.'
    );
  }
  ACT.pedbaixa = function () {
    S.baixaAuto = !S.baixaAuto;
    saveSoon();
    render();
    say(S.baixaAuto ? 'Baixa automática ligada: ao entregar um pedido do site, o estoque baixa e a venda é registrada.' : 'Baixa automática desligada: registre a venda à mão.');
  };
  // ---- reservas vivas na nuvem (para mostrar no app)
  function resBusca() {
    if (!S.nuvem || !S.nuvem.rt) return Promise.resolve();
    return nvApi('GET', 'estoque?pageSize=300')
      .then(function (j) {
        var o = {};
        (j.documents || []).forEach(function (d) {
          var ref = d.name.split('/').pop(),
            res = {},
            m = ((d.fields || {}).res || {}).mapValue;
          Object.keys(((m || {}).fields) || {}).forEach(function (k) {
            var f = m.fields[k].mapValue.fields || {};
            res[k] = { pid: (f.pid || {}).stringValue, cor: (f.cor || {}).stringValue || '', q: +((f.q || {}).integerValue || 0), exp: +((f.exp || {}).integerValue || 0), pago: !!(f.pago || {}).booleanValue };
          });
          o[ref] = res;
        });
        RES_EST = o;
        RES_T = Date.now();
      })
      .catch(function () {});
  }
  // Antes de fechar uma venda no balcão: confere de novo as reservas do site (no máximo 2,5 s de espera).
  var RES_T = 0;
  function resFresco() {
    if (!S.nuvem || !S.nuvem.rt || navigator.onLine === false || Date.now() - RES_T < 15000) return null;
    RES_T = Date.now();
    return Promise.race([resBusca(), new Promise(function (ok) { setTimeout(ok, 2500); })]);
  }
  // Disponível para vender no balcão = físico − peças seguradas pelo site (pagas ou dentro do prazo).
  function gLivre(i) {
    return Math.max(0, gQty(i) - resDoRef(i.ref, i.cor));
  }
  // Baixa automática vem LIGADA de fábrica (dono, 02/11); quem ainda não decidiu passa a ficar ligado uma única vez.
  setTimeout(function () {
    if (!S.baixaAutoV) {
      S.baixaAutoV = 2;
      S.baixaAuto = true;
      saveSoon();
    }
  }, 3000);
  window.__gLivre = gLivre;
  // quantas peças de ref (e cor, se informada) estão seguradas agora
  function resDoRef(ref, cor) {
    var r = RES_EST[ref],
      agora = Date.now(),
      c = String(cor == null ? '' : cor).toLowerCase(),
      n = 0;
    if (!r) return 0;
    Object.keys(r).forEach(function (k) {
      var x = r[k];
      if ((x.pago || x.exp > agora) && (cor == null || String(x.cor || '').toLowerCase() === c)) n += x.q;
    });
    return n;
  }
  // tempo que falta para o pedido pagar (ms), ou 0
  function resRestaDe(p) {
    var r = RES_EST[(resItensDe(p)[0] || {}).ref],
      x = r && Object.keys(r).map(function (k) { return r[k]; }).filter(function (y) { return y.pid === p.sid; })[0];
    return x && !x.pago && x.exp > Date.now() ? x.exp - Date.now() : 0;
  }

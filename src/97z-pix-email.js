  // ===== S197 (aprovado 12/11/2026): PIX automático pelo E-MAIL do Nubank (robô do Gmail + função "pix") =====
  // Não depende da notificação do celular. O app só:
  //  1) pedido do site: vê que o robô confirmou (reservasTok/{id}.pixAuto — só o dono e o servidor leem; S1/S2 parte 3, item 21) e fecha o pedido como pago, sem mudar a tela;
  //  2) venda da loja (Venda · PIX em reais): registra a espera (pixEspera/L…) com o valor; quando o robô confirma, marca a venda;
  //  3) PIX sem par (valor que não bateu com nada ou bateu com 2): guarda em S.pixSemPar para o guardião avisar.
  S.pixEsp = S.pixEsp || {}; // chave do carrinho → { ts, brl, ok }
  S.pixSemPar = S.pixSemPar || [];
  var PIXM_H = 2 * 3600000;
  function pxFv(v) {
    if (!v) return null;
    if ('stringValue' in v) return v.stringValue;
    if ('integerValue' in v) return +v.integerValue;
    if ('doubleValue' in v) return +v.doubleValue;
    if ('booleanValue' in v) return v.booleanValue;
    if ('mapValue' in v) { var o = {}; Object.keys((v.mapValue || {}).fields || {}).forEach(function (k) { o[k] = pxFv(v.mapValue.fields[k]); }); return o; }
    return null;
  }
  // vendas da loja pagas por PIX em reais: uma espera por carrinho (valor total recebido)
  function pixEspVarre() {
    var ag = {}, ag0 = Date.now() - PIXM_H;
    (S.sales || []).slice(0, 40).forEach(function (s) {
      // Nubank = transferência em reais; Banco Familiar (13/11) = transferência em guaranis
      if (s.forma !== 'pix' || (s.moeda !== 'brl' && s.moeda !== 'pyg') || !(+s.ts >= ag0)) return;
      var k = String(s.carrinho || s.id).replace(/[^A-Za-z0-9-]/g, '') + (s.moeda === 'pyg' ? 'G' : '');
      if (!k) return;
      ag[k] = (ag[k] || 0) + (+s.recebido || 0);
    });
    Object.keys(ag).forEach(function (k) {
      if (S.pixEsp[k] || !(ag[k] > 0)) return;
      var gs0 = /G$/.test(k), o = gs0 ? { ts: Date.now(), gs: Math.round(ag[k]), banco: 'itau', ok: 0 } : { ts: Date.now(), brl: Math.round(ag[k] * 100) / 100, ok: 0 };
      S.pixEsp[k] = o;
      if (S.nuvem && S.nuvem.rt)
        nvApi('PATCH', 'pixEspera/L' + k, JSON.stringify({ fields: gs0 ? { tipo: { stringValue: 'loja' }, banco: { stringValue: 'itau' }, gs: { integerValue: String(o.gs) }, ts: { integerValue: String(o.ts) } } : { tipo: { stringValue: 'loja' }, brl: { doubleValue: o.brl }, ts: { integerValue: String(o.ts) } } })).catch(function () { o.sync = 0; });
      saveSoon();
    });
  }
  var _pxT = 0;
  function pixEmailCheca(forca) {
    if (!S.nuvem || !S.nuvem.rt) return Promise.resolve(0);
    if (!forca && Date.now() - _pxT < 55000) return Promise.resolve(0);
    _pxT = Date.now();
    var tarefas = [];
    (S.pedidos || []).filter(function (p) {
      return p.orig === 'site' && (p.pag === 'pix' || p.pag === 'alias') && (p.pg === 'pagar' || p.pg === 'comp') && p.st !== 'canc' && p.sid;
    }).slice(0, 15).forEach(function (p) {
      tarefas.push(nvApi('GET', 'reservasTok/' + encodeURIComponent(p.sid)).then(function (j) {
        var pa = j && j.fields && j.fields.pixAuto ? pxFv(j.fields.pixAuto) : null;
        if (!pa || p.pg === 'pago') return;
        p.pgAuto = { ts: pa.ts || Date.now(), txt: pa.banco === 'itau' || pa.banco === 'familiar' ? 'Transferência confirmada pelo e-mail do Banco Familiar · Gs. ' + String(Math.round(+pa.valor || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : 'PIX confirmado pelo e-mail do Nubank · R$ ' + (+pa.valor || 0).toFixed(2).replace('.', ',') };
        var sel = S.pedSel, y = window.scrollY;
        ACT.pedpago(p.id); // sem o dono tocar: não muda a tela em que ele está
        S.pedSel = sel;
        window.scrollTo(0, y);
        lfToast('PIX recebido: pedido ' + (p.cod || '') + ' confirmado sozinho', 'ok');
        saveSoon();
      }).catch(function () {}));
    });
    Object.keys(S.pixEsp).forEach(function (k) {
      var o = S.pixEsp[k];
      if (o.ok || Date.now() - o.ts > PIXM_H) return;
      tarefas.push(nvApi('GET', 'pixEspera/L' + k).then(function (j) {
        var ok = j && j.fields && j.fields.ok ? pxFv(j.fields.ok) : null;
        if (!ok) return;
        o.ok = ok.ts || Date.now();
        lfToast(o.banco === 'itau' ? 'Transferência Banco Familiar da venda confirmada · Gs. ' + String(o.gs).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : 'PIX da venda confirmado · R$ ' + o.brl.toFixed(2).replace('.', ','), 'ok');
        saveSoon();
      }).catch(function () {}));
    });
    tarefas.push(nvApi('GET', 'pixSemPar?pageSize=20').then(function (j) {
      S.pixSemPar = (j.documents || []).map(function (d) {
        var f = {};
        Object.keys(d.fields || {}).forEach(function (x) { f[x] = pxFv(d.fields[x]); });
        // 39: o que a nuvem gravou — moeda/banco/pagador, o motivo (sem-pedido | empate | sem-peca), o pedido (sem-peca) e se o dono já ligou
        return { id: d.name.split('/').pop(), valor: +f.valor || 0, ts: +f.ts || 0, n: +f.candidatos || 0, moeda: f.moeda || 'brl', banco: f.banco || '', de: f.de || '', motivo: f.motivo || 'sem-pedido', pedido: f.id || '', ligado: !!f.ligado };
      });
    }).catch(function () {}));
    return Promise.all(tarefas);
  }
  setInterval(function () { try { pixEspVarre(); pixEmailCheca(); } catch (e) {} }, 20000);

  // ===== 39 · preço exato (aprovado 21/11/2026 07:51): PIX ou transferência que a nuvem não conseguiu ligar sozinha =====
  // Cada documento de pixSemPar ainda não ligado é uma linha do Guardião nas Pendências (pixSemParItens → atencaoItens).
  // O texto sai do motivo numa tabela só. "Ligar ›" abre a janela de baixo com os pedidos a pagar; ligar é da nuvem
  // (reserva {acao:'ligar'}): o app nunca grava o "pago" direto.
  var PIX_MOTIVO = {
    'sem-pedido': function () { return 'não bate com nenhum pedido aberto'; },
    empate: function (x) { return 'bate com ' + Math.max(2, x.n) + ' pedidos do mesmo valor'; },
    'sem-peca': function () { return 'pagou, mas a peça já foi vendida'; }
  };
  function pixVal(moeda, v) { return moeda === 'brl' ? 'R$ ' + (+v || 0).toFixed(2).replace('.', ',') : 'Gs. ' + String(Math.round(+v || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function pixNome(x) { return (x.moeda === 'brl' ? 'PIX de ' : 'Transferência de ') + pixVal(x.moeda, x.valor); }
  function pixHora(ts) { return (dayKey(ts) === dayKey(Date.now()) ? 'hoje ' : fd(ts) + ' ') + fh(ts); }
  function pixBanco(x) { return x.moeda === 'brl' ? 'Nubank' : 'Banco Familiar'; }
  function pixPedNum(sid) {
    var p = (S.pedidos || []).filter(function (q) { return q.sid === sid; })[0];
    return p ? String(p.num) : String(sid || '').slice(0, 5).toUpperCase();
  }
  function pixAbertos() { return (S.pixSemPar || []).filter(function (x) { return !x.ligado; }); }
  function pixSemParItens() {
    return pixAbertos().map(function (x) {
      var sp = x.motivo === 'sem-peca';
      return { t: pixNome(x) + (sp ? ' · pedido ' + pixPedNum(x.pedido) : ' sem pedido'), s: (PIX_MOTIVO[x.motivo] || PIX_MOTIVO['sem-pedido'])(x) + ' · ' + pixHora(x.ts),
        c: 'var(--bad)', urg: true, b: sp ? 'Ver pedido' : 'Ligar', act: sp ? 'pixVerPed' : 'pixLigar', id: x.id };
    });
  }
  // os pedidos do site que ainda esperam pagamento (os mesmos que o app confere em pixEmailCheca) e o valor de cada um na moeda do pagamento
  function pixPedidosAPagar() {
    return (S.pedidos || []).filter(function (p) {
      return p.orig === 'site' && (p.pag === 'pix' || p.pag === 'alias') && (p.pg === 'pagar' || p.pg === 'comp') && p.st !== 'canc' && p.sid;
    }).map(function (p) { var m = p.pag === 'pix' ? 'brl' : 'pyg'; return { p: p, moeda: m, valor: m === 'brl' ? +p.brl || 0 : pedTotal(p) }; });
  }
  ACT.pixVerPed = function (id) {
    var x = pixAbertos().filter(function (q) { return q.id === id; })[0], p = x && (S.pedidos || []).filter(function (q) { return q.sid === x.pedido; })[0];
    if (p) S.pedSel = p.id;
    setView('ped');
  };
  ACT.pixLigar = function (id) {
    var x = pixAbertos().filter(function (q) { return q.id === id; })[0];
    if (!x) return;
    var L = pixPedidosAPagar(), igual = function (o) { return o.moeda === x.moeda && Math.abs(o.valor - x.valor) < 0.005; },
      mesmos = L.filter(igual), outros = L.filter(function (o) { return !igual(o); }), sel = mesmos.length ? mesmos[0].p.sid : '';
    lfJanela({
      titulo: 'Ligar a um pedido',
      cls: 'pxJn',
      monta: function (c, api) {
        var linha = function (o) {
          return '<button type="button" class="pxL" role="radio" aria-checked="' + (o.p.sid === sel) + '" data-sid="' + esc(o.p.sid) + '"><i class="pxR" aria-hidden="true"></i><span class="pxT"><b>Pedido ' + esc(String(o.p.num)) + (o.p.cli ? ' · ' + esc(o.p.cli) : '') + '</b><small>pedido de ' + pixHora(o.p.ts) + '</small></span><b class="pxV">' + pixVal(o.moeda, o.valor) + '</b></button>';
        }, desenha = function () {
          var num = sel ? pixPedNum(sel) : '';
          c.innerHTML = '<div class="pxO">' + (x.moeda === 'brl' ? 'PIX de ' : 'Transferência de ') + '<b>' + pixVal(x.moeda, x.valor) + '</b> · ' + pixHora(x.ts) + ' · ' + pixBanco(x) + (x.de ? ' · ' + esc(x.de) : '') + '</div>' +
            (mesmos.length ? '<div class="lbl">PEDIDOS A PAGAR · MESMO VALOR</div><div role="radiogroup">' + mesmos.map(linha).join('') + '</div>' : '') +
            (outros.length ? '<div class="lbl">' + (mesmos.length ? 'OUTROS PEDIDOS A PAGAR' : 'PEDIDOS A PAGAR') + '</div><div role="radiogroup">' + outros.map(linha).join('') + '</div>' : '') +
            (L.length ? '<button type="button" class="go pxOk"' + (sel ? '' : ' disabled') + '>' + (sel ? 'Ligar ao pedido ' + esc(num) : 'Escolha o pedido') + '</button>'
              : '<div class="hint" style="text-align:center;margin:16px 0">Nenhum pedido do site esperando pagamento agora.</div>');
          [].forEach.call(c.querySelectorAll('.pxL'), function (b) { b.onclick = function () { sel = b.getAttribute('data-sid'); desenha(); }; });
          var ok = c.querySelector('.pxOk');
          if (ok) ok.onclick = function () {
            if (!sel || ok.disabled) return;
            ok.disabled = true;
            ok.textContent = 'Ligando…';
            resChama({ acao: 'ligar', pix: x.id, pedido: sel }).then(function (j) {
              if (!j || !j.ok) { lfToast('Não consegui ligar agora. Confira a internet e tente de novo.', 'erro'); return desenha(); }
              x.ligado = true; // some das Pendências já; a nuvem marcou o pixSemPar e o "pago" chega pela conferência de sempre
              lfToast('✓ ' + pixNome(x) + ' ligado ao pedido ' + pixPedNum(sel), 'ok');
              api.fecha();
              saveSoon();
              render();
              pixEmailCheca(true);
            });
          };
        };
        desenha();
      }
    });
  };

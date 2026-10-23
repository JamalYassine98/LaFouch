  // ===== Descarte: peças quebradas ou imprestáveis saem do estoque e viram prejuízo. =====
  S.descartes = [];
  S.moedaP = 'pyg';
  // Dá baixa em n peças de um item. Custo = o que foi pago por peça (dólar) no câmbio de hoje.
  function descartar(item, n, motivo) {
    n = Math.floor(n);
    if (!item || !(n > 0) || n > item.qty) return null;
    var t = tipoOf(item.tipo),
      usdv = (t && t.pago ? t.pago : 0) * n,
      valor = Math.round(usdv * S.fx.pyg),
      ts = Date.now(),
      desc = n + '× ' + item.ref + ' ' + (item.grau || item.vr || '') + ' · ' + item.cor + (motivo ? ' (' + motivo + ')' : '');
    item.qty -= n;
    S.descartes.push({ ts: ts, ref: item.ref, cor: item.cor, qty: n, usd: usdv, valor: valor, motivo: motivo || '' });
    S.dlog.push({ ts: ts, kind: 'descarte', desc: desc, valor: valor, usd: usdv });
    S.elog.push({ ts: ts, tipo: item.tipo, ref: item.ref, cor: item.cor, grau: item.grau || '', qty: -n, descarte: true });
    return valor;
  }
  // Bloco "Dar baixa (descarte)" no detalhe do produto.
  function descarteBox(ref) {
    var its = S.items.filter(function (i) {
      return i.ref === ref && i.qty > 0;
    });
    var box = mk('div', 'col');
    box.id = 'descBox';
    box.appendChild(mk('div', 'lbl', 'Peça quebrada ou descartada'));
    if (!its.length) {
      box.appendChild(mk('div', 'hint', 'Sem peças em estoque para dar baixa.'));
      return box;
    }
    box.appendChild(mk('div', 'hint', 'A peça sai do estoque e o custo dela vira prejuízo no resultado do mês. Não dá para desfazer.'));
    var sel = mk('select', 'in');
    sel.id = 'dscItem';
    sel.setAttribute('aria-label', 'Qual variante');
    its.forEach(function (i, ix) {
      var o = mk('option', '', i.cor + (i.grau ? ' ' + i.grau : '') + ' · ' + i.qty + ' un.');
      o.value = String(ix);
      sel.appendChild(o);
    });
    var q = mk('input', 'in');
    q.id = 'dscQtd';
    q.inputMode = 'numeric';
    q.placeholder = 'Qtd.';
    q.value = '1';
    q.style.maxWidth = '80px';
    q.setAttribute('aria-label', 'Quantidade a descartar');
    var m = mk('input', 'in');
    m.id = 'dscMot';
    m.placeholder = 'Motivo (ex.: veio quebrada)';
    m.setAttribute('aria-label', 'Motivo');
    var msg = mk('div', 'hint');
    msg.id = 'dscMsg';
    msg.setAttribute('role', 'status');
    var go = btn('mini', 'Dar baixa', function () {
      var it = its[+sel.value],
        n = Math.floor(toNum(q.value));
      if (!(n > 0) || n > it.qty) {
        msg.textContent = 'Informe de 1 a ' + it.qty + ' peça(s).';
        return;
      }
      var v = descartar(it, n, m.value.trim());
      S.msg = 'Baixa feita: ' + n + ' peça(s), prejuízo de ' + gs(v) + '.';
      render();
    });
    go.style.cssText = 'background:transparent;color:var(--bad);border:1px solid rgba(239,68,68,.7)';
    var row = mk('div', 'sel');
    row.style.flexWrap = 'wrap';
    row.appendChild(sel);
    row.appendChild(q);
    box.appendChild(row);
    box.appendChild(m);
    box.appendChild(go);
    box.appendChild(msg);
    return box;
  }

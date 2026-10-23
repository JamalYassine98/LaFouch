  // ===== Pagamento em várias moedas, câmbio manual e troco devolvido em outra moeda. =====
  S.pagMisto = false; // pagar com mais de uma moeda
  S.pagX = []; // linhas extras de recebimento: {m, v, r}
  S.trL = []; // linhas de troco devolvido: {m, v, r}
  S.rate1 = ''; // câmbio manual da primeira linha (G$ por 1 unidade)
  var MOEDAS3 = [
    ['pyg', 'G$'],
    ['brl', 'R$'],
    ['usd', 'US$']
  ];
  // Câmbio usado: o manual (se digitado) ou o de hoje.
  function rateDe(m, r) {
    return m === 'pyg' ? 1 : r > 0 ? r : ratePyg(m);
  }
  function numRate(txt) {
    return parseDec(txt, 'pyg');
  }
  // Totais do pagamento em guaranis: recebido, troco devolvido e líquido da venda.
  function pagTotais() {
    var m = S.moeda,
      l1 = Math.round((S._recv || 0) * rateDe(m, numRate(S.rate1))),
      ex = 0,
      tr = 0;
    (S.pagX || []).forEach(function (x) {
      ex += Math.round((parseDec(x.v, x.m) || 0) * rateDe(x.m, numRate(x.r)));
    });
    (S.trL || []).forEach(function (x) {
      tr += Math.round((parseDec(x.v, x.m) || 0) * rateDe(x.m, numRate(x.r)));
    });
    var rec = l1 + ex,
      due = S._dueGs || 0;
    return { rec: rec, troco: tr, liq: rec - tr, due: due, falta: Math.max(0, due - rec), devolver: Math.max(0, rec - due), pendente: Math.max(0, rec - due - tr) };
  }
  // Dados do pagamento para gravar a venda.
  function pagPayload() {
    var fx = function (x) {
      return { moeda: x.m, v: parseDec(x.v, x.m) || 0, rate: rateDe(x.m, numRate(x.r)) };
    };
    return {
      rate: rateDe(S.moeda, numRate(S.rate1)),
      extra: (S.pagX || []).map(fx).filter(function (x) {
        return x.v > 0;
      }),
      troco: (S.trL || []).map(fx).filter(function (x) {
        return x.v > 0;
      })
    };
  }
  function pagReset() {
    S.pagMisto = false;
    S.pagX = [];
    S.trL = [];
    S.rate1 = '';
    S.rec = null;
  }
  // Atualiza só os textos (sem refazer os campos, para não perder o foco).
  function pmTextos() {
    var t = pagTotais(),
      el = $('pmRes');
    if (!el) return;
    var partes = [];
    partes.push('A cobrar: ' + gs(t.due));
    partes.push('Recebido: ' + gs(t.rec));
    if (t.falta > 0) partes.push('Falta: ' + gs(t.falta));
    if (t.devolver > 0) partes.push('Troco a devolver: ' + gs(t.devolver));
    if (t.troco > 0) partes.push('Troco devolvido: ' + gs(t.troco));
    el.textContent = partes.join(' · ');
    var dif = t.troco - t.devolver;
    $('trH').textContent =
      t.devolver <= 0
        ? ''
        : t.troco === 0
        ? 'Escolha em que moeda devolveu o troco.'
        : Math.abs(dif) < 1
        ? 'Troco confere.'
        : dif > 0
        ? 'Você devolveu ' + gs(dif) + ' a mais que o troco.'
        : 'Faltam ' + gs(-dif) + ' de troco (ficam como lucro da venda).';
    $('trocoB').hidden = t.devolver <= 0 && !(S.trL || []).length;
    var warn = [];
    var need = {};
    (S.trL || []).forEach(function (x) {
      need[x.m] = (need[x.m] || 0) + (parseDec(x.v, x.m) || 0);
    });
    Object.keys(need).forEach(function (m) {
      var tem = (S.cash[m] || 0) + (m === S.moeda ? S._recv || 0 : 0);
      (S.pagX || []).forEach(function (x) {
        if (x.m === m) tem += parseDec(x.v, x.m) || 0;
      });
      if (need[m] > tem + 1e-9) warn.push('Você não tem ' + fmtM(need[m], m) + ' no caixa para esse troco.');
    });
    var w = $('trW');
    w.textContent = warn.join(' ');
    w.hidden = !warn.length;
  }
  function pmMudou() {
    pmTextos();
    updateRec();
  }
  // Uma linha de recebimento ou de troco.
  function pmLinha(x, i, lista, titulo) {
    var box = mk('div', 'card col');
    box.style.cssText = 'background:var(--panel2);padding:10px;gap:8px';
    var cab = mk('div', 'nav');
    MOEDAS3.forEach(function (o) {
      cab.appendChild(
        btn(
          'chip' + (x.m === o[0] ? ' on' : ''),
          o[1],
          function () {
            x.m = o[0];
            x.r = '';
            pmRender(true);
            pmMudou();
          },
          x.m === o[0]
        )
      );
    });
    box.appendChild(cab);
    var linha = mk('div', 'sel');
    var v = mk('input', 'in');
    v.setAttribute('inputmode', 'decimal');
    v.placeholder = titulo;
    v.setAttribute('aria-label', titulo + ' em ' + x.m.toUpperCase());
    v.value = x.v;
    v.style.cssText = 'flex:1 1 120px;width:auto';
    v.oninput = function () {
      x.v = v.value;
      pmMudou();
    };
    linha.appendChild(v);
    if (x.m !== 'pyg') {
      var r = mk('input', 'in');
      r.setAttribute('inputmode', 'numeric');
      r.placeholder = 'Câmbio ' + dots(Math.round(ratePyg(x.m)));
      r.setAttribute('aria-label', 'Câmbio de ' + x.m.toUpperCase() + ' em guaranis (opcional)');
      r.value = x.r || '';
      r.style.cssText = 'flex:1 1 110px;width:auto';
      r.oninput = function () {
        x.r = r.value;
        pmMudou();
      };
      linha.appendChild(r);
    }
    var rm = btn('trash', '✕', function () {
      lista.splice(i, 1);
      pmRender(true);
      pmMudou();
    });
    rm.setAttribute('aria-label', 'Remover esta linha');
    linha.appendChild(rm);
    box.appendChild(linha);
    return box;
  }
  // Desenha os campos de pagamento misto e de troco (não mexe se você está digitando neles).
  function pmRender(force) {
    var host = $('pagMixB');
    if (!host) return;
    var ae = document.activeElement;
    if (!force && ae && ae.tagName === 'INPUT' && host.contains(ae)) return pmTextos();
    // câmbio da primeira linha
    var m = S.moeda;
    $('rate1B').hidden = m === 'pyg';
    if (m === 'pyg') S.rate1 = '';
    $('rate1In').placeholder = 'Câmbio de hoje: ' + dots(Math.round(ratePyg(m)));
    if ($('rate1In').value !== (S.rate1 || '')) $('rate1In').value = S.rate1 || '';
    // botão de pagar com mais de uma moeda
    var tg = $('pmTog');
    tg.textContent = S.pagMisto ? 'Pagamento em uma moeda só' : 'Pagar com mais de uma moeda';
    tg.setAttribute('aria-pressed', S.pagMisto);
    // linhas extras
    var ex = $('pmExtra');
    ex.textContent = '';
    ex.hidden = !S.pagMisto;
    if (S.pagMisto) {
      S.pagX.forEach(function (x, i) {
        ex.appendChild(pmLinha(x, i, S.pagX, 'Valor recebido'));
      });
      ex.appendChild(
        btn('chip add', '+ Outra moeda', function () {
          S.pagX.push({ m: S.moeda === 'pyg' ? 'brl' : 'pyg', v: '', r: '' });
          pmRender(true);
          pmMudou();
        })
      );
    }
    // troco
    var tr = $('trRows');
    tr.textContent = '';
    S.trL.forEach(function (x, i) {
      tr.appendChild(pmLinha(x, i, S.trL, 'Troco devolvido'));
    });
    var ch = $('trChips');
    ch.textContent = '';
    MOEDAS3.forEach(function (o) {
      ch.appendChild(
        btn('chip add', 'Devolvi em ' + o[1], function () {
          var t = pagTotais(),
            falta = Math.max(0, t.devolver - t.troco),
            rt = rateDe(o[0], 0),
            v = falta / rt;
          S.trL.push({ m: o[0], v: falta > 0 ? inVal(o[0] === 'pyg' ? Math.round(v) : Math.round(v * 100) / 100, o[0]) : '', r: '' });
          pmRender(true);
          pmMudou();
        })
      );
    });
    pmTextos();
  }
  $('pmTog').onclick = function () {
    S.pagMisto = !S.pagMisto;
    S.pagX = [];
    S.rec = null;
    render();
  };
  $('rate1In').addEventListener('input', function () {
    S.rate1 = this.value;
    S.rec = null;
    S._ratePend = true;
    render();
  });

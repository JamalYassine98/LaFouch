  // ===== Forma de pagamento da venda e taxas (maquininha, Pix). =====
  // Taxa em % sobre o valor recebido. Dinheiro e Pix não têm taxa; ajuste a maquininha em Ajustes.
  S.formas = [
    { id: 'din', nome: 'Dinheiro', taxa: 0 },
    { id: 'pix', nome: 'Pix', taxa: 0 },
    { id: 'deb', nome: 'Maquininha débito', taxa: 2 },
    { id: 'cre', nome: 'Maquininha crédito', taxa: 4 }
  ];
  S.forma = 'din';
  // Forma de pagamento escolhida na venda.
  function formaSel() {
    return (
      S.formas.filter(function (f) {
        return f.id === S.forma;
      })[0] || S.formas[0]
    );
  }
  // Forma pelo id (para vendas antigas sem forma: dinheiro).
  function formaPorId(id) {
    return (
      S.formas.filter(function (f) {
        return f.id === id;
      })[0] || { id: 'din', nome: 'Dinheiro', taxa: 0 }
    );
  }
  // Taxa em guaranis sobre o valor recebido (já em guaranis).
  function taxaGs(effGs, f) {
    f = f || formaSel();
    return f && f.taxa > 0 ? Math.round((effGs * f.taxa) / 100) : 0;
  }
  // Taxa na moeda em que o cliente pagou.
  function taxaMoeda(recebido, moeda, f) {
    var t = f && f.taxa > 0 ? (recebido * f.taxa) / 100 : 0;
    return moeda === 'pyg' ? Math.round(t) : Math.round(t * 100) / 100;
  }
  // Botões de forma de pagamento na tela de venda.
  // S366: a estrutura do Pagamento de luxo é garantida aqui (não depende do index.html do aparelho, que pode ser o antigo)
  function pagLuxArruma() {
    var f = $('formaChips'), m = $('moedas'), cli = $('cliPickB'), mix = $('pagMixB'), go = $('sgo');
    if (f) { f.className = 'trk'; if (!$('formaTx')) { var tx = document.createElement('div'); tx.className = 'hint esHt'; tx.id = 'formaTx'; tx.hidden = true; f.parentNode.appendChild(tx); } }
    if (m) { m.className = 'trk'; m.setAttribute('role', 'group'); m.setAttribute('aria-label', 'Moeda recebida'); }
    if (cli && mix && mix.parentNode && cli.nextElementSibling !== mix) mix.parentNode.insertBefore(cli, mix);
    if (go && !$('pagMais')) { var b = document.createElement('button'); b.type = 'button'; b.className = 'esMais'; b.id = 'pagMais'; b.setAttribute('data-act', 'cartclose'); b.hidden = !(S.view === 'vendas' && S.cartOpen && S.cartStep !== 'ped'); b.textContent = '+ Adicionar outra peça ao pedido'; go.parentNode.insertBefore(b, go.nextSibling); }
  }
  function renderForma() {
    var box = $('formaChips');
    if (!box) return;
    // S365 (esboço 39): um trilho só; o nome curto no trilho e a taxa da maquininha embaixo, só quando ela é a escolhida
    pagLuxArruma();
    box.textContent = '';
    var cur = formaSel(), th = document.createElement('span');
    th.className = 'trkTh';
    box.appendChild(th);
    S.formas.forEach(function (f) {
      var curto = String(f.nome).replace(/^maquininha\s+/i, ''), b;
      curto = curto.charAt(0).toUpperCase() + curto.slice(1);
      b = btn('trkB' + (cur.id === f.id ? ' on' : ''), curto, function () {
        S.forma = f.id;
        render();
      }, cur.id === f.id);
      b.dataset.m = f.id;
      b.setAttribute('aria-label', f.nome + (f.taxa > 0 ? ', taxa de ' + String(f.taxa).replace('.', ',') + '%' : ''));
      box.appendChild(b);
    });
    trkMarca(box, cur.id);
    var tx = $('formaTx');
    if (tx) {
      tx.hidden = !(cur.taxa > 0);
      tx.textContent = cur.taxa > 0 ? cur.nome + ': taxa de ' + String(cur.taxa).replace('.', ',') + '%' : '';
    }
  }

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
  function renderForma() {
    var box = $('formaChips');
    if (!box) return;
    box.textContent = '';
    var cur = formaSel();
    S.formas.forEach(function (f) {
      box.appendChild(
        btn(
          'chip' + (cur.id === f.id ? ' on' : ''),
          f.nome + (f.taxa > 0 ? ' · ' + String(f.taxa).replace('.', ',') + '%' : ''),
          function () {
            S.forma = f.id;
            render();
          },
          cur.id === f.id
        )
      );
    });
  }

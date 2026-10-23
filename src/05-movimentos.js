  // ===== Movimentos: todo fato de dinheiro ou estoque é gravado por aqui (livro + histórico juntos). =====
  // Formato do registro do histórico (S.dlog) de uma compra de mercadoria.
  function dlogLote(x) {
    return { ts: x.ts, kind: 'lote', desc: x.desc, usd: x.usd };
  }
  // Formato do registro do histórico de um uso da caixa de melhorias.
  function dlogMelh(x) {
    return { ts: x.ts, kind: 'melh', desc: x.desc, valor: x.valor };
  }
  // Formato do registro do histórico de um gasto imprevisto.
  function dlogImp(x) {
    return { ts: x.ts, kind: 'imp', desc: x.desc, valor: x.valor };
  }
  // Compra de mercadoria: entra no livro de compras (S.compras) e no histórico.
  function lancarCompra(c) {
    S.compras.push(c);
    S.dlog.push(dlogLote(c));
  }
  // Uso da caixa de melhorias: livro (S.melhUso) e histórico.
  function lancarMelhoria(desc, valor) {
    var x = { ts: Date.now(), desc: desc, valor: valor };
    S.melhUso.push(x);
    S.dlog.push(dlogMelh(x));
  }
  // Gasto imprevisto: livro (S.imprev) e histórico.
  function lancarImprevisto(desc, valor) {
    var x = { ts: Date.now(), desc: desc, valor: valor };
    S.imprev.push(x);
    S.dlog.push(dlogImp(x));
  }
  // Conta mensal paga: livro de pagamentos (S.cpay) e histórico.
  function lancarPagamento(e, ym, ts) {
    S.cpay.push({ ts: ts, id: e.id, ym: ym, nome: e.nome, valor: e.valor, cat: e.cat });
    S.dlog.push({
      ts: ts,
      kind: 'pago',
      nome: e.nome,
      desc: e.nome + ' (' + CATS[e.cat] + ')',
      valor: e.valor
    });
  }
  // Desfaz o pagamento de uma conta no mês: tira do livro e do histórico.
  function desfazerPagamento(e, ym, ts) {
    S.cpay = S.cpay.filter(function (x) {
      return !(x.id === e.id && x.ym === ym);
    });
    S.dlog = S.dlog.filter(function (x) {
      return !(x.kind === 'pago' && x.ts === ts && x.nome === e.nome);
    });
  }
  // Alteração, remoção ou criação de despesa fixa: só histórico.
  function logDespesa(kind, campos) {
    S.dlog.push(Object.assign({ ts: Date.now(), kind: kind }, campos));
  }
  // Entrada de peças no histórico do estoque (S.elog).
  function entradaEstoque(tipo, ref, cor, grau, qty) {
    S.elog.push({ ts: Date.now(), tipo: tipo, ref: ref, cor: cor, grau: grau, qty: qty });
  }

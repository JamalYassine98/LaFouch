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
    S.cpay.push({
      ts: ts,
      id: e.id,
      ym: ym,
      nome: e.nome,
      valor: e.valor,
      cat: e.cat,
      moeda: expMoeda(e),
      orig: expOrig(e)
    });
    S.dlog.push({
      ts: ts,
      kind: 'pago',
      nome: e.nome,
      desc: e.nome + ' (' + CATS[e.cat] + ')',
      valor: e.valor,
      moeda: expMoeda(e),
      orig: expOrig(e)
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
    // peças novas chegando renovam o aviso "Chegou esta semana" do modelo
    if (qty > 0) {
      if (!S.cad) S.cad = {};
      S.cad[ref] = Date.now();
    }
  }
  // Ajuste manual de quantidade (Editar produto): fica no histórico do estoque, com ou sem perda.
  function ajusteEstoque(it, d, motivo) {
    S.elog.push({ ts: Date.now(), tipo: it.tipo, ref: it.ref, cor: it.cor, grau: it.grau || '', qty: d, ajuste: true, motivo: motivo || '' });
  }
  // Exclusão de peças (cor ou produto): grava o que saiu e quanto valia em custo.
  function exclusaoEstoque(its, motivo) {
    var ts = Date.now(),
      usdv = 0,
      n = 0;
    its.forEach(function (i) {
      if (!(i.qty > 0)) return;
      var c = Number(effCusto(i)) || 0;
      usdv += c * i.qty;
      n += i.qty;
      S.elog.push({ ts: ts, tipo: i.tipo, ref: i.ref, cor: i.cor, grau: i.grau || '', qty: -i.qty, exclusao: true, motivo: motivo || '' });
    });
    return { n: n, usd: usdv };
  }
  // Depois de excluir peças: se o modelo não tem mais nada, sai do site e da oferta; se ainda tem, o site é atualizado.
  function limpaRefExcluido(ref) {
    var resta = S.items.some(function (i) {
      return i.ref === ref;
    });
    if (!resta) {
      if (S.site && S.site[ref]) siteSet(ref, false);
      if (S.pprice) delete S.pprice[ref];
      if (S.pcanal) delete S.pcanal[ref];
    } else if (S.site && S.site[ref] && typeof vitFila === 'function') vitFila(ref, 'upd');
  }
  // Código automático para peça sem código na haste (ex.: PG-013), em sequência por tipo.
  function refAuto(tipo) {
    var pre = tipo === 'pre' ? 'PG' : tipo === 'solar' ? 'SL' : 'AR',
      re = new RegExp('^' + pre + '-(\\d+)$'),
      mx = 0;
    S.items.forEach(function (i) {
      var m = re.exec(String(i.ref || '').toUpperCase());
      if (m) mx = Math.max(mx, parseInt(m[1], 10));
    });
    return pre + '-' + String(mx + 1).padStart(3, '0');
  }

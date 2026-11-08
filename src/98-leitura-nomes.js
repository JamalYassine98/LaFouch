  // ===== v472 (aprovado 08/11/2026): para o cliente, "grau" é "Leitura" =====
  // Nomes "Óculos de grau…" passam a "Óculos de leitura…" (no app e, pela fila, no site). Roda ao abrir e a cada
  // salvamento (pega também nomes vindos da nuvem ou de um backup). Não mexe em vendas nem no histórico.
  function leitNome(n) {
    return typeof n === 'string' ? n.replace(/^[ÓO]culos de grau(?=\s|$)/i, 'Óculos de leitura') : n;
  }
  function leitMigra() {
    var m = 0;
    if (!S.pnome) return 0;
    Object.keys(S.pnome).forEach(function (r) {
      var v = leitNome(S.pnome[r]);
      if (v === S.pnome[r]) return;
      S.pnome[r] = v;
      m++;
      if (S.site && S.site[r] && typeof vitFila === 'function') vitFila(r, 'upd');
    });
    if (m && typeof saveSoon === 'function') saveSoon();
    return m;
  }

  // ===== Arquivo das vendas antigas (v438, aprovado 05/11/2026) =====
  // Vendas de mais de 12 meses saem da lista do dia a dia (o app fica leve para sempre) e viram um RESUMO POR MÊS.
  // A venda completa fica guardada no aparelho (IndexedDB 'estado'/'arquivo') e entra na cópia da nuvem;
  // no Histórico, "Trazer de volta" devolve o mês inteiro para a lista.
  // Guarda o mês atual + os 12 meses anteriores completos (o "mesmo mês do ano passado" continua na lista).
  S.arqRes = {}; // 'AAAA-MM' -> {n, v, l, q:{tipo: qtd}}
  S.arqAte = 0; // vendas antes disto estão no arquivo
  var ARQ = null; // vendas arquivadas (carregadas sob demanda)
  function arqCorte(agora) {
    var d = new Date(agora || Date.now());
    return new Date(d.getFullYear(), d.getMonth() - 12, 1).getTime();
  }
  function arqMes(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);
  }
  function arqLe() {
    if (ARQ) return Promise.resolve(ARQ);
    return idbDo('estado', 'readonly', function (o) {
      return o.get('arquivo');
    }).then(function (v) {
      ARQ = Array.isArray(v) ? v : [];
      return ARQ;
    });
  }
  function arqGrava(lista) {
    return idbDo('estado', 'readwrite', function (o) {
      return o.put(lista, 'arquivo');
    }).then(function () {
      ARQ = lista;
    });
  }
  function arqSoma(res, s) {
    var m = arqMes(s.ts),
      r = (res[m] = res[m] || { n: 0, v: 0, l: 0, q: {} });
    if (s.estorno) return;
    r.n++;
    r.v += +s.price || 0;
    r.l += +s.livre || 0;
    r.q[s.tipo] = (r.q[s.tipo] || 0) + (+s.qty || 0);
  }
  // Move as vendas antigas para o arquivo. Só roda com o IndexedDB pronto (nunca perde venda: grava o arquivo ANTES de tirar).
  function arqRoda(agora) {
    if (!IDBOK || !BIG_PRONTO) return Promise.resolve(0);
    var corte = arqCorte(agora),
      voltou = S.arqVolta || {},
      velhas = (S.sales || []).filter(function (s) {
        return s.ts < corte && !voltou[arqMes(s.ts)];
      });
    if (!velhas.length) return Promise.resolve(0);
    return arqLe().then(function (A) {
      var tem = {};
      A.forEach(function (s) {
        tem[s.id] = 1;
      });
      var novo = A.slice();
      velhas.forEach(function (s) {
        if (s.id == null || !tem[s.id]) novo.push(s);
      });
      return arqGrava(novo).then(function () {
        var fora = {};
        velhas.forEach(function (s) {
          fora[s.id] = 1;
          if (s.id == null || !tem[s.id]) arqSoma(S.arqRes, s);
        });
        S.sales = S.sales.filter(function (s) {
          return !fora[s.id];
        });
        S.arqAte = Math.max(S.arqAte || 0, corte);
        // a sincronização não pode achar que as vendas foram apagadas
        try {
          if (S.syncSnap && S.syncSnap.l && S.syncSnap.l.sales)
            Object.keys(fora).forEach(function (id) {
              delete S.syncSnap.l.sales[id];
            });
        } catch (e) {}
        saveSoon();
        return velhas.length;
      });
    });
  }
  // Devolve um mês do arquivo para a lista do dia a dia.
  function arqVolta(mes) {
    return arqLe().then(function (A) {
      var vem = A.filter(function (s) {
          return arqMes(s.ts) === mes;
        }),
        tem = {};
      if (!vem.length) return 0;
      S.sales.forEach(function (s) {
        tem[s.id] = 1;
      });
      vem.forEach(function (s) {
        if (!tem[s.id]) S.sales.push(s);
      });
      S.sales.sort(function (a, b) {
        return b.ts - a.ts;
      });
      // o mês volta para a lista e sai do resumo; o arquivo continua com a cópia (não roda de novo enquanto ele estiver aqui)
      delete S.arqRes[mes];
      S.arqVolta = S.arqVolta || {};
      S.arqVolta[mes] = Date.now();
      try {
        if (S.syncSnap && S.syncSnap.l && S.syncSnap.l.sales)
          vem.forEach(function (s) {
            S.syncSnap.l.sales[s.id] = 1;
          });
      } catch (e) {}
      saveSoon();
      return vem.length;
    });
  }
  // Quantidade vendida por tipo e mês que já está no arquivo (para a estação do ano continuar aprendendo).
  function arqQtdMes(tipo) {
    var o = {};
    Object.keys(S.arqRes || {}).forEach(function (m) {
      var q = (S.arqRes[m].q || {})[tipo];
      if (q) {
        var p = m.split('-');
        o[+p[0] * 12 + (+p[1] - 1)] = q;
      }
    });
    return o;
  }
  // Cartão no Histórico.
  function arqHtml() {
    var ms = Object.keys(S.arqRes || {}).sort().reverse();
    if (!ms.length) return '';
    var nomes = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return (
      '<section class="card col arqCard"><div><b>Vendas arquivadas</b><div class="hint" style="margin:2px 0 0">Mais de 12 meses. Resumo por mês; a venda completa está guardada e pode voltar.</div></div>' +
      ms
        .map(function (m) {
          var r = S.arqRes[m],
            p = m.split('-');
          return '<div class="sl"><span>' + nomes[+p[1] - 1] + '/' + p[0] + '<small>' + r.n + (r.n === 1 ? ' venda' : ' vendas') + ' · ' + gs(r.v) + ' · lucro ' + gs(r.l) + '</small></span><button type="button" class="mini" data-act="arqVolta" data-id="' + m + '">Trazer de volta</button></div>';
        })
        .join('') +
      '</section>'
    );
  }
  ACT.arqVolta = function (m) {
    arqVolta(m).then(function (n) {
      lfToast(n ? n + ' vendas voltaram para o Histórico' : 'Nada para trazer de volta');
      render();
    });
  };
  // Roda sozinho 1× por dia (fora do modo de teste), depois que o app abriu.
  function arqAuto() {
    if (/(^|[#&])test\b/.test(location.hash)) return;
    var hoje = new Date().toDateString();
    if (S.arqDia === hoje) return;
    arqRoda().then(function (n) {
      S.arqDia = hoje;
      if (n) render();
    }, function () {});
  }
  setTimeout(arqAuto, 20000);
  setInterval(arqAuto, 6 * 3600000);
  // Cópia de segurança: devolve o arquivo já carregado; ao restaurar uma cópia, junta o arquivo dela.
  function arqCopia() {
    return ARQ;
  }
  function arqRestaura(lista) {
    if (!Array.isArray(lista) || !lista.length) return Promise.resolve();
    return arqLe().then(function (A) {
      var tem = {},
        novo = A.slice();
      A.forEach(function (s) {
        tem[s.id] = 1;
      });
      lista.forEach(function (s) {
        if (!tem[s.id]) novo.push(s);
      });
      return arqGrava(novo);
    });
  }

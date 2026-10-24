  // ===== Contas em várias moedas, vencimentos e avisos. =====
  // Moeda de uma despesa: pyg (padrão), usd ou brl.
  function expMoeda(e) {
    return e.moeda === 'usd' || e.moeda === 'brl' ? e.moeda : 'pyg';
  }
  // Valor da despesa na moeda original.
  function expOrig(e) {
    var m = expMoeda(e);
    if (m === 'pyg') return e.valor;
    return e.orig > 0 ? e.orig : e.valor / ratePyg(m);
  }
  // Atualiza o valor em guaranis das contas em moeda estrangeira, pelo câmbio de hoje.
  function syncExpFx() {
    S.exp.forEach(function (e) {
      var m = expMoeda(e);
      if (m !== 'pyg' && e.orig > 0) e.valor = Math.round(e.orig * ratePyg(m));
    });
  }
  // Texto do valor na moeda original ("US$ 120,00") e, se estrangeira, o equivalente em guaranis.
  function expTexto(e) {
    var m = expMoeda(e);
    return m === 'pyg' ? gs(e.valor) : fmtM(expOrig(e), m) + ' (' + gs(e.valor) + ')';
  }
  // Quanto as contas em moeda estrangeira mudaram só pelo câmbio desde que o valor foi informado.
  function efeitoCambio() {
    return Math.round(
      S.exp.reduce(function (a, e) {
        var m = expMoeda(e);
        if (m === 'pyg' || !(e.rate0 > 0)) return a;
        return a + expOrig(e) * (ratePyg(m) - e.rate0);
      }, 0)
    );
  }
  // Parte das contas em moeda estrangeira (em guaranis).
  function contasEstrangeiras() {
    return S.exp.reduce(function (a, e) {
      return a + (expMoeda(e) !== 'pyg' ? e.valor : 0);
    }, 0);
  }
  // Reserva extra por mês contra alta do câmbio nas contas em moeda estrangeira (usa o colchão cambial).
  function reservaCambioContas() {
    var f = contasEstrangeiras();
    return f > 0 ? Math.round(f * colchao().pct) : 0;
  }

  // Meio-dia de hoje (evita problemas de horário de verão ao somar dias).
  function hoje0() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12).getTime();
  }
  // Data de vencimento da despesa no mês (ano, mês 0-11); o dia é limitado ao último do mês.
  function vencEm(e, ano, mes) {
    var ult = new Date(ano, mes + 1, 0).getDate();
    return new Date(ano, mes, Math.min(Number(e.dia), ult), 12).getTime();
  }
  // Próximo vencimento: este mês se ainda não foi paga, senão o do mês seguinte.
  function proxVenc(e) {
    if (!(e.dia >= 1 && e.dia <= 31)) return null;
    var d = new Date(),
      pago = !!(e.paid && e.paid[ymNow()]),
      ts = pago ? vencEm(e, d.getFullYear(), d.getMonth() + 1) : vencEm(e, d.getFullYear(), d.getMonth());
    return { ts: ts, dias: Math.round((ts - hoje0()) / DAY), pago: pago };
  }
  // Plano para cobrir uma falta na moeda m: primeiro as outras moedas do caixa (o que não é reserva),
  // depois vender dólar, com o valor por moeda. Mostra a falta se o caixa não cobre.
  function faltaPlano(m, falta) {
    var faltaGs = falta * ratePyg(m),
      passos = [],
      resta = faltaGs,
      ord = ['pyg', 'brl', 'usd'].filter(function (x) {
        return x !== m;
      });
    ord.forEach(function (x) {
      if (resta <= 0.5) return;
      var disp = Math.max(0, S.cash[x] || 0) * ratePyg(x),
        uso = Math.min(disp, resta);
      if (uso > 0.5) {
        passos.push({ de: x, v: uso / ratePyg(x), gs: uso });
        resta -= uso;
      }
    });
    var cobre = resta <= 0.5,
      txt = 'Falta ' + fmtM(falta, m) + '. ';
    if (cobre)
      txt +=
        'Troque ' +
        passos
          .map(function (p) {
            return fmtM(p.v, p.de);
          })
          .join(' + ') +
        ' por ' + m.toUpperCase() + (passos.some(function (p) { return p.de === 'usd'; }) ? ' (vender dólar mexe nas reservas: confira na aba Câmbio)' : ' na aba Câmbio') + '.';
    else
      txt += 'O caixa só cobre ' + gs(Math.round(faltaGs - resta)) + ' ao câmbio de hoje e ainda faltam ' + gs(Math.round(resta)) + '.';
    return { passos: passos, cobre: cobre, resta: resta, txt: txt };
  }
  // Contas que vencem em breve (ou já venceram) e ainda não foram pagas neste mês.
  function avisosVenc(janela) {
    var out = [];
    S.exp.forEach(function (e) {
      var v = proxVenc(e);
      if (!v || v.pago || v.dias > (janela || 7)) return;
      var m = expMoeda(e),
        need = expOrig(e),
        tem = m === 'pyg' ? S.cash.pyg : S.cash[m] || 0,
        ok = tem >= need - 1e-9,
        dica = '';
      if (!ok) {
        var pl = faltaPlano(m, need - tem);
        dica = pl.txt;
      }
      out.push({
        e: e,
        dias: v.dias,
        moeda: m,
        ok: ok,
        dica: dica,
        urgente: !ok && v.dias <= 2,
        semValor: e.tipo === 'variavel' && e.updYm !== ymNow() && v.dias <= 7
      });
    });
    return out.sort(function (a, b) {
      return a.dias - b.dias;
    });
  }
  // Frase do prazo ("vence hoje", "venceu há 2 dias", "vence em 3 dias").
  function prazoTxt(d) {
    return d === 0
      ? 'vence hoje'
      : d < 0
      ? 'venceu há ' + -d + (d === -1 ? ' dia' : ' dias')
      : d === 1
      ? 'vence amanhã'
      : 'vence em ' + d + ' dias';
  }
  // Cartão de avisos de vencimento (vazio se não houver nada).
  function avisosHtml() {
    var av = avisosVenc(7);
    if (!av.length) return '';
    var h =
      '<section class="card col"><h2 style="margin:0;font-size:16px">Contas para pagar</h2><div class="split">';
    av.forEach(function (a) {
      var cor = a.dias < 0 ? 'var(--bad)' : a.dias <= 2 ? 'var(--warn)' : 'var(--sub)';
      h += dxRow(
        esc(a.e.nome),
        '<span style="color:' +
          cor +
          '">' +
          prazoTxt(a.dias) +
          '</span>' +
          (a.semValor ? ' · informe o valor desta fatura' : '') +
          (a.urgente ? ' · <b style="color:var(--bad)">URGENTE</b>' : '') +
          (a.ok ? '' : ' · ' + esc(a.dica)),
        expTexto(a.e)
      );
    });
    return h + '</div></section>';
  }

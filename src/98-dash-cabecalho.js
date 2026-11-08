  // ===== v465: cabeçalho do Dashboard com 2 botões só (aprovado 08/11, esboço esbocos_todos.png) =====
  // "Resumo ⌄" abre a folha VER (as 4 partes) e "Este mês ⌄" (só texto) abre a folha PERÍODO, com as datas de verdade.
  var DT_FRASE = { hoje: 'Quanto vendeu e quanto separar', din: 'Caixa, contas e reserva', giro: 'O que vende e o que está parado', prec: 'Margem e preço por tipo' };
  var PER_OP = [
    ['hoje', 'Hoje'],
    ['semana', 'Esta semana'],
    ['mes', 'Este mês'],
    ['30', 'Últimos 30 dias']
  ];
  function dDia(ts, ano) {
    return new Date(ts).toLocaleDateString('pt-BR', ano ? { day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'long' });
  }
  function dFaixa(a, b) {
    var da = new Date(a),
      db = new Date(b);
    if (da.toDateString() === db.toDateString()) return dDia(a);
    if (da.getMonth() === db.getMonth() && da.getFullYear() === db.getFullYear()) return da.getDate() + ' a ' + dDia(b);
    return dDia(a) + ' a ' + dDia(b);
  }
  function perDatas(p) {
    var d = new Date(),
      hj = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    if (p === 'hoje') return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    if (p === 'semana') return dFaixa(new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7)).getTime(), hj);
    if (p === '30') return dFaixa(hj - 29 * DAY, hj);
    if (p === 'custom') {
      var a = dataLocal(S.perDe),
        b = dataLocal(S.perAte);
      return a != null && b != null ? dFaixa(a, b) : 'de um dia até outro';
    }
    return dFaixa(new Date(d.getFullYear(), d.getMonth(), 1).getTime(), hj);
  }
  function perRotulo() {
    var o = PER_OP.filter(function (x) {
      return x[0] === S.per;
    })[0];
    return o ? o[1] : S.per === 'custom' ? 'Datas' : 'Este mês';
  }
  function dHeadHtml() {
    var t = DTABS.filter(function (x) {
        return x[0] === S.dTab;
      })[0] || DTABS[0],
      resumo = S.dTab === 'hoje',
      cam = 'US$ 1 = ' + gsRaw(Math.round(S.fx.pyg)) + (lmOk() ? ' na casa' : ''),
      h =
        '<div class="dHd"><button type="button" class="dHdT" data-act="dVer" aria-haspopup="dialog">' + t[1] + ' <i aria-hidden="true">⌄</i></button>' +
        (resumo ? '<button type="button" class="dHdP" data-act="dPer" aria-haspopup="dialog">' + perRotulo() + ' <i aria-hidden="true">⌄</i></button>' : '') +
        '</div><div class="dHdS">' + (resumo ? esc(perDatas(S.per)) + ' · ' : esc(DT_FRASE[t[0]]) + ' · ') + cam + '</div>';
    if (resumo && S.per === 'custom')
      h +=
        '<div class="sel dHdD" style="flex-wrap:wrap"><input class="in" type="date" data-pdat="de" value="' + esc(S.perDe) + '" aria-label="Data inicial" style="flex:1 1 140px;width:auto"><input class="in" type="date" data-pdat="ate" value="' + esc(S.perAte) + '" aria-label="Data final" style="flex:1 1 140px;width:auto"></div>';
    return h;
  }
  function dOpHtml(act, id, nome, sub, on, seta) {
    return '<button type="button" class="dOp' + (on ? ' on' : '') + '" data-act="' + act + '" data-id="' + id + '"' + (on ? ' aria-current="true"' : '') + '><span><b>' + nome + '</b><small>' + sub + '</small></span><i aria-hidden="true">' + (on ? '✓' : seta ? '›' : '') + '</i></button>';
  }
  ACT.dVer = function () {
    lfaAbre('dFolha', '<div class="dFt"><span>VER</span><button type="button" class="dFx" data-act="dFecha" aria-label="Fechar">×</button></div>' + DTABS.map(function (t) {
      return dOpHtml('dVerEsc', t[0], t[1], DT_FRASE[t[0]], S.dTab === t[0], true);
    }).join(''));
  };
  ACT.dPer = function () {
    lfaAbre('dFolha', '<div class="dFt"><span>PERÍODO</span><button type="button" class="dFx" data-act="dFecha" aria-label="Fechar">×</button></div>' + PER_OP.map(function (o) {
      return dOpHtml('dPerEsc', o[0], o[1], perDatas(o[0]), S.per === o[0], false);
    }).join('') + dOpHtml('dPerEsc', 'custom', 'Escolher datas', S.per === 'custom' ? perDatas('custom') : 'de um dia até outro', S.per === 'custom', true));
  };
  ACT.dFecha = function () {
    lfaFecha('dFolha');
  };
  ACT.dVerEsc = function (id) {
    lfaFecha('dFolha');
    if (S.dTab === id) return;
    S.dTab = id;
    renderDash();
    animEnter($('dtabBody'));
  };
  ACT.dPerEsc = function (id) {
    lfaFecha('dFolha');
    S.per = id;
    renderDash();
  };

  // ===== v465: cabeçalho do Dashboard com 2 botões só (aprovado 08/11, esboço esbocos_todos.png) =====
  // "Resumo ⌄" abre a folha VER (as 4 partes) e "Este mês ⌄" (só texto) abre a folha PERÍODO, com as datas de verdade.
  var DT_FRASE = { hoje: 'Vendido, lucro livre e meta', din: 'Caixa, contas e reserva', giro: 'O que vende e o que está parado', prec: 'Margem e preço por tipo', onl: 'Como o site está indo' };
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
        '<div class="dHd"><h1 class="dHdT">' + t[1] + '</h1>' + // 149t: título de verdade, não botão
        (resumo ? '<button type="button" class="dHdP' + lkCls(true) + '" data-act="dPer" aria-haspopup="dialog">' + perRotulo() + ' <i aria-hidden="true">⌄</i></button>' : '') +
        '</div><div class="dHdS">' + (resumo ? esc(perDatas(S.per)) : esc(DT_FRASE[t[0]])) + '</div>'; // S362: a linha "US$ 1 = …" saiu do topo (o câmbio mora na tela Câmbio)
    if (resumo && S.per === 'custom')
      h +=
        '<section class="cxSaldo dHdD"><div class="cxLb">Período</div><label class="cxL dD418"><span>De</span><input class="in" type="date" data-pdat="de" value="' + esc(S.perDe) + '" aria-label="Data inicial"></label><label class="cxL dD418"><span>Até</span><input class="in" type="date" data-pdat="ate" value="' + esc(S.perAte) + '" aria-label="Data final"></label></section>';
    return h;
  }
  function dOpHtml(act, id, nome, sub, on, seta) {
    return '<button type="button" class="dOp' + (on ? ' on' : '') + '" data-act="' + act + '" data-id="' + id + '"' + (on ? ' aria-current="true"' : '') + '><span><b>' + nome + '</b><small>' + sub + '</small></span><i aria-hidden="true">' + (on ? '✓' : seta ? '›' : '') + '</i></button>';
  }
  // A folha "VER" do título do Dashboard (uma ação só): família → as telas dela; senão as abas do Dashboard + Histórico
  // e, num grupo comum, as outras telas do grupo e "Gerenciar grupo".
  ACT.dVer = function () {
    var g = grpGet(S._gAt);
    if (g && g.fam) return lfaAbre('dFolha', grpVerHtml(g));
    var onde = d48Hoje() ? 'hoje' : S.view === 'hist' ? 'hist' : S.dTab;
    lfaAbre('dFolha', '<div class="dFt"><span>VER</span></div>' + DTABS.map(function (t) {
      return dOpHtml('dVerEsc', t[0], t[1], DT_FRASE[t[0]], onde === t[0], true);
    }).join('') + dOpHtml('dVerEsc', 'hist', 'Histórico', 'Os dias anteriores, um a um', onde === 'hist', true));
    var o = $('dFolha'),
      sh = o && o.querySelector('.lfa-sh');
    if (!g || !sh) return;
    var DASH = ['hoje', 'din', 'giro', 'prec', 'hist'],
      fora = g.itens.filter(function (t) { return DASH.indexOf(t) < 0; }),
      h = fora.map(function (t) { return dOpHtml('grpVerEsc', t, BARRA_NOME[t] || t, GRP_FRASE[t] || '', false, true); }).join('');
    sh.insertAdjacentHTML('beforeend', h + dOpHtml('grpGerirV', g.id, 'Gerenciar grupo', 'Nome e telas de "' + esc(g.nome) + '"', false, true));
  };
  ACT.dPer = function () {
    var per = d48Hoje() ? 'hoje' : S.per;
    lfaAbre('dFolha', '<div class="dFt"><span>PERÍODO</span></div>' + PER_OP.map(function (o) {
      return dOpHtml('dPerEsc', o[0], o[1], perDatas(o[0]), per === o[0], false);
    }).join('') + dOpHtml('dPerEsc', 'custom', 'Escolher datas', per === 'custom' ? perDatas('custom') : 'de um dia até outro', per === 'custom', true));
  };
  ACT.dFecha = function () {
    lfaFecha('dFolha');
  };
  ACT.dVerEsc = function (id) {
    if (window.__barraSegurou && window.__barraSegurou()) return; // soltar um arraste da barra em cima da folha não escolhe
    lfaFecha('dFolha');
    if (id === 'hist') return setView('hist');
    if (id === 'hoje' && (S.per === 'hoje' || d48Hoje())) { S.per = 'hoje'; S.day = dayKey(Date.now()); return setView('dia'); }
    if (S.view === 'dash' && S.dTab === id) return;
    S.dTab = id;
    if (S.view !== 'dash') return setView('dash');
    renderDash();
    animEnter($('dtabBody'));
  };
  ACT.dPerEsc = function (id) {
    lfaFecha('dFolha');
    S.per = id;
    if (id === 'hoje') { S.day = dayKey(Date.now()); return setView('dia'); }
    S.dTab = 'hoje';
    if (S.view !== 'dash') return setView('dash');
    renderDash();
  };

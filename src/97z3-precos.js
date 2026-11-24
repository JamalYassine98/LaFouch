  // ===== Preços = o escritório do Titan (54 + 46b · COMO-FAZER-TITAN passo 3; dono 23/11 "faça tudo em partes") =====
  // UMA função desenha a tela, de cima para baixo: "O Titan decide hoje · N" (uma linha por assunto; some com 0) e os
  // SETORES em linhas ›: Regras · Ofertas · Atacado · Ferramentas · Histórico. Cada setor é uma tela própria com "‹ Preços"
  // (a pilha da navegação: chave 'ti:<setor>', src/99c-navegacao-s435.js); o preço automático liga no ⏻ do título (46b).
  // Saíram no mesmo passo: os 4 números (moram em Resultados › Dashboard do mês, 52e), a dobra "N preços para corrigir"
  // (virou tela própria), as linhas das tabelas de atacado (vão para o setor Atacado) e a janela Regras (virou o setor).
  var CNT_VER = {}; // assunto do preço automático aberto no "ver um por um" (oferta | fim), no setor Ofertas
  function cntPl(n, um, muitos) { return n + ' ' + (n === 1 ? um : muitos); }
  function cntLinha(tit, sub, fim, cls) { return '<div class="cntL' + (cls ? ' ' + cls : '') + '"><div><b>' + esc(tit) + '</b><small>' + esc(sub || '') + '</small></div>' + (fim || '') + '</div>'; }
  if (!ICO_D.oferta) ICO_D.oferta = '<path d="M19 5L5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>';
  if (!ICO_D.tag) ICO_D.tag = '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>';
  if (!ICO_D.dia) ICO_D.dia = '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>';
  // ---------- os setores: UMA tabela (chave, título, frase de baixo do título, ícone) ----------
  var TI_SET = {
    regras: ['Regras', 'O que cada preço precisa cobrir', 'regras'],
    ofertas: ['Ofertas', 'Descontos que o ' + LF_TITAN + ' confere', 'oferta', 'ofNova'], // 4o campo: a ação do + redondo na linha do título
    atacado: ['Atacado', '', 'ata'],
    ferr: ['Ferramentas', '', 'calc'],
    hist: ['Histórico', 'O que mudou de preço, quando e por quê', 'hist'],
    corr: ['Preços para corrigir', '', 'tag']
  };
  Object.keys(TI_SET).forEach(function (k) { BARRA_NOME['ti:' + k] = TI_SET[k][0]; });
  S.tiSet = '';
  function tiSetor() { return S.view === 'dash' && S.dTab === 'prec' && TI_SET[S.tiSet] ? S.tiSet : ''; }
  // abre um setor (ou a própria Preços, com k vazio): a pilha da navegação põe o "‹ Preços"
  function tiAbre(k) {
    S.tiSet = TI_SET[k] ? k : '';
    S.dTab = 'prec';
    if (S.view === 'dash') { render(); window.scrollTo(0, 0); } else setView('dash');
  }
  ACT.tiAbre = function (k) { tiAbre(k); };
  function tiLinha(act, id, icoK, tit, sub, subCor) {
    return '<button type="button" class="nvL" data-act="' + act + '" data-id="' + esc(id || '') + '"><span class="nvIc">' + ico(icoK, 22) + '</span><span class="nvTx"><b>' + esc(tit) + '</b>' +
      (sub ? '<small' + (subCor ? ' style="color:' + subCor + '"' : '') + '>' + esc(sub) + '</small>' : '') + '</span><i aria-hidden="true">›</i></button>';
  }
  // ---------- "O Titan decide hoje": uma linha por assunto (o mesmo cálculo serve a tela e a linha do Início) ----------
  function titanDecide() {
    var R = [], L = typeof invPrecosAcorrigir === 'function' ? invPrecosAcorrigir() : [];
    if (L.length) {
      var nS = L.filter(function (x) { return x.pb && x.pb.sug > 0; }).length, semC = L.filter(function (x) { return x.pb && x.pb.k === 'c'; }).length;
      R.push(['tiAbre', 'corr', 'tag', cntPl(L.length, 'preço para corrigir', 'preços para corrigir'),
        [nS ? nS + ' com sugestão' : '', L.length - nS ? (L.length - nS) + (semC === L.length - nS ? ' sem custo' : ' sem sugestão') : ''].filter(Boolean).join(' · '), 'var(--warn)']);
    }
    cntDecisoes().forEach(function (x) {
      if (x.t === 'tema') R.push(['temaVer', '', 'dia', x.tit, x.sub]);
      if (x.t === 'pa') R.push(['tiAbre', 'ofertas', 'oferta', x.kind === 'oferta' ? 'Pôr ' + cntPl(x.n, 'peça em oferta', 'peças em oferta') : cntPl(x.n, 'peça volta ao preço', 'peças voltam ao preço'), x.itens[0].mot.split(' · ')[0]]);
    });
    var d = new Date();
    if (d.getDate() <= 5) {
      var pm = new Date(d.getFullYear(), d.getMonth() - 1, 1), t = lrMes(pm.getFullYear(), pm.getMonth());
      if (t.qty) R.push(['cntFech', '', 'hoje', 'Fechamento de ' + pm.toLocaleDateString('pt-BR', { month: 'long' }), 'lucro real ' + gs(t.lucro) + ' · ' + cntPl(t.qty, 'peça', 'peças')]);
    }
    return R;
  }
  // as linhas das tabelas de atacado com margem baixa (o mesmo cálculo de cntDecisoes)
  function tiTabBaixas() { return cntDecisoes().filter(function (x) { return x.t === 'tab'; }); }
  function tiOfertasNoAr() {
    var vis = {};
    return (S.items || []).filter(function (it) {
      var o = S.pprice[it.ref];
      if (vis[it.ref] || !(it.qty > 0) || !o || !(o.ant > 0)) return false;
      vis[it.ref] = 1;
      return true;
    });
  }
  function precosTelaHtml() {
    var k = tiSetor();
    if (k) return '<div class="cnt lx tiS" data-ti="' + k + '">' + TI_TELA[k]() + '</div>';
    var D = titanDecide(), T = tabLista().filter(function (x) { return !x.pub; }), tb = tiTabBaixas(), no = tiOfertasNoAr().length,
      nb = tb.reduce(function (a, x) { return Math.max(a, x.n); }, 0),
      SET = [
        ['regras', 'contas, taxas, meta e cotação da loja'],
        ['ofertas', (no ? no + ' no ar' : 'nenhuma no ar') + ' · automático ' + (S.pAuto && S.pAuto.on ? 'ligado' : 'desligado')],
        ['atacado', cntPl(T.length, 'tabela', 'tabelas') + (nb ? ' · ' + cntPl(nb, 'peça', 'peças') + ' abaixo de 10%' : '')],
        ['ferr', 'calculadora de preço · e se…?'],
        ['hist', 'o que mudou, quando e por quê']
      ];
    return '<div class="cnt lx">' +
      (D.length ? '<div class="lbl tiLb">O ' + esc(LF_TITAN).toUpperCase() + ' DECIDE HOJE · ' + D.length + '</div><section class="nvLista tiD" aria-label="O ' + esc(LF_TITAN) + ' decide hoje">' +
        D.map(function (x) { return tiLinha(x[0], x[1], x[2], x[3], x[4], x[5]); }).join('') + '</section>' : '') +
      '<div class="lbl tiLb">SETORES</div><section class="nvLista tiSe" aria-label="Setores de Preços">' +
      SET.map(function (s) { return tiLinha('tiAbre', s[0], TI_SET[s[0]][2], TI_SET[s[0]][0], s[1]); }).join('') + '</section></div>';
  }
  // ---------- as telas dos setores (cada uma mostra o que já existia; o desenho de cada uma vem nos passos 62–67) ----------
  var CNT_PA = { oferta: ['Pôr ', 'peça em oferta', 'peças em oferta', 'Oferta '], fim: ['', 'peça volta ao preço', 'peças voltam ao preço', 'Volta ao preço '] };
  function cntDecisaoHtml(x) {
    var P = CNT_PA[x.kind], ab = !!CNT_VER[x.kind];
    return cntLinha(P[0] + cntPl(x.n, P[1], P[2]), x.itens[0].mot.split(' · ')[0], '<button type="button" class="lxT" data-act="cntVer" data-id="' + x.kind + '" aria-expanded="' + ab + '">ver um por um</button>') +
      (ab ? x.itens.map(function (m) {
        var id = esc(m.ref + '|' + m.kind);
        return '<div class="cntL cntPc"><div><b>' + esc(P[3] + m.ref) + '</b><small>' + esc(m.mot) + '</small></div><em>' + gs(m.para) + '</em>' +
          '<span class="cntUm"><button type="button" class="mini" data-act="cntAceita" data-id="' + id + '">Aceitar</button><button type="button" class="mini ghost" data-act="cntIgnora" data-id="' + id + '">Agora não</button></span></div>';
      }).join('') : '');
  }
  var TI_TELA = {
    corr: function () { return '<div class="pcNaTela">' + pcCorpo(true) + '</div>'; },
    regras: regrasHtml,
    ofertas: ofertasHtml,
    atacado: function () {
      var B = {};
      tiTabBaixas().forEach(function (x) { B[x.tab.id] = x; });
      return '<section class="nvLista">' + tabLista().filter(function (T) { return !T.pub; }).map(function (T) {
        var b = B[T.id];
        return tiLinha('tabsheet', T.id, 'ata', T.nome + ' · ' + Math.round(+T.m || 0) + '%', b ? cntPl(b.n, 'peça', 'peças') + ' abaixo de 10% · a menor está em ' + b.min + '%' : 'todas as peças com margem boa', b ? 'var(--warn)' : '');
      }).join('') + '</section>';
    },
    ferr: function () {
      return '<section class="nvLista" aria-label="Ferramentas de preço">' + tiLinha('cntCalc', '', 'calc', 'Calculadora de preço', 'quanto cobrar pelo custo e pelo lote') +
        tiLinha('cntEse', '', 'ese', 'E se…?', 'dólar, contas, desconto ou meta: o que muda') + '</section>';
    },
    hist: function () { var h = precosAutoHtml(); return h ? '<div class="cntAuto">' + h + '</div>' : '<div class="hint tiVz">Nenhuma mudança de preço guardada ainda.</div>'; }
  };
  // ---------- setor Regras (62): tudo o que o preço cobre, num lugar só ----------
  // Cada venda cobre (contas, taxas, IVA, colchão) · Dólar da loja · O Titan aprende com você · Seu objetivo. As linhas ⌄ só
  // mostram (dFold); "Contas do mês ›" leva a Despesas. Saíram no mesmo passo: "Contas e contagem" + "Divisão das contas"
  // (precosCfgHtml), a barra da meta (paMetaHtml), o cartão "Formas de pagamento e taxas" (pagamentoHtml) e, do Câmbio,
  // "Preços no site" e "Como o app te protege" (as janelas viraram as dobras da cotação e do colchão).
  function regrasTaxas() {
    var F = (S.formas || []).filter(function (f) { return +f.taxa > 0; });
    return F.length ? F.map(function (f) { return f.nome.replace(/^Maquininha\s+/i, '') + ' ' + String(f.taxa).replace('.', ',') + '%'; }).join(' · ') : 'sem taxa';
  }
  function regrasHtml() {
    var nC = (S.exp || []).length, c = colchao(), L = S.siteFx, loja = fxUsdLoja(), casa = lmOk() ? S.lm.usd.v : 0, lm = paLucroMes(), vol = volumeEfetivo(), apr = aprendeFator() >= 1,
      taxas = '<div class="col rgTx">' + (S.formas || []).map(function (f) {
        return '<label class="cxL"><span>' + esc(f.nome) + '</span><span class="pc66"><input class="in" inputmode="decimal" data-aj="ptaxa" data-id="' + f.id + '" value="' + String(f.taxa).replace('.', ',') +
          '" aria-label="Taxa de ' + esc(f.nome) + ' em porcentagem"><i aria-hidden="true">%</i></span></label>';
      }).join('') + '<p class="hint">A taxa sai do seu lucro quando a venda é paga por essa forma. Dinheiro e Pix ficam em 0%.</p></div>';
    return '<div class="lbl tiLb">CADA VENDA COBRE</div><section class="nvLista">' + tiLinha('view', 'desp', 'desp', 'Contas do mês', gs(totalMensal()) + ' · ' + cntPl(nC, 'conta', 'contas') + ' · em Dinheiro') + '</section>' +
      dFold('rgTx', 'Taxas da maquininha', regrasTaxas(), '', taxas) +
      dFold('rgIva', 'IVA · 10%', 'incluído no preço · em guaranis', '', '<p class="hint">O IVA já está dentro do preço: de G$ 110.000, G$ 10.000 são do imposto (preço ÷ 11). A conta é sempre em guaranis.</p>') +
      dFold('rgCo', 'Colchão · ' + pc(c.pct), 'reserva da mercadoria · amortece', '', colchaoHtml()) +
      '<div class="lbl tiLb">DÓLAR DA LOJA</div>' +
      dFold('rgFx', 'Cotação nos preços · ' + gsRaw(L && L.usd ? L.usd : loja), 'travada' + (casa ? ' · venda da casa ' + gsRaw(Math.round(casa)) : ''), '', siteFxHtml()) +
      '<div class="lbl tiLb">O ' + esc(LF_TITAN).toUpperCase() + ' APRENDE COM VOCÊ</div>' +
      dFold('rgVol', 'Vendas por mês · ' + vol, 'pelas vendas reais, sem digitar', '', '<p class="hint">O ' + esc(LF_TITAN) + ' conta as vendas reais dos últimos dias; você não digita nada. As contas do mês se dividem por essas vendas, e peça mais cara carrega mais.</p>') +
      dFold('rgJei', 'Seu jeito de cobrar · ' + (apr ? 'aprendido' : 'aprendendo'), 'aprende com cada correção', '', '<p class="hint">Cada preço que você corrige ou cobra ensina o ' + esc(LF_TITAN) + ' a pôr o preço do seu jeito' + (apr ? '.' : ': ainda está juntando ' + nDias(Math.max(0, 30 - aprendeDias())) + ' de vendas.') + '</p>') +
      '<div class="lbl tiLb">SEU OBJETIVO</div><div class="cxL rgMeta"><span>Meta de lucro do mês<small>não muda os preços</small></span><b>' + (lm.metaG > 0 ? gs(lm.metaG) : '—') + '</b></div>';
  }
  // ---------- setor Ofertas (63): o que está no ar, os cupons (só mostram) e como o Titan decide ----------
  // O "+" do título abre a janela Oferta (ofertaJanela, a mesma da ficha) com "escolher a peça" antes.
  function ofertasHtml() {
    var D = cntDecisoes().filter(function (x) { return x.t === 'pa'; }), nAc = D.reduce(function (a, x) { return a + x.n; }, 0), O = tiOfertasNoAr(), dsc = cntDescontosTxt(),
      vis = {}, fol = [], sem = 0, t = null;
    (S.items || []).forEach(function (it) {
      if (vis[it.ref] || !(it.qty > 0) || it.bulk || isSimple(it.tipo)) return;
      vis[it.ref] = 1;
      var n = ppNormal(S.pprice[it.ref]) || tFor(it).price;
      if (!titanEstado(it.ref, n).piso) return;
      var f = titanFolga(it.ref, n);
      fol.push(f);
      if (!f) sem++;
    });
    try { t = typeof temaAtual === 'function' ? temaAtual() : null; } catch (e) {}
    var fMin = fol.length ? Math.min.apply(null, fol) : 0, nT = t && typeof temaSugestao === 'function' ? temaSugestao(t).n : 0;
    return (D.length ? '<section class="card col cntD"><div class="lbl">O ' + esc(LF_TITAN).toUpperCase() + ' SUGERE · ' + nAc + '</div>' + D.map(cntDecisaoHtml).join('') +
        '<div class="cntB"><button type="button" class="go" data-act="cntTudo">' + (nAc === 1 ? 'Aceitar o preço' : 'Aceitar os ' + nAc + ' preços') + '</button></div></section>' : '') +
      '<div class="lbl tiLb">OFERTAS NO AR · ' + O.length + '</div>' +
      (O.length ? '<section class="nvLista">' + O.map(function (it) {
        var o = S.pprice[it.ref], de = deHonesto(it.ref);
        return tiLinha('ofAbre', it.ref, 'oferta', pn(it.ref), gs(tFor(it).price) + ' · ' + (de ? 'de ' + gs(o.ant) : 'sem "de"') + (o.ate ? ' · até ' + fd(o.ate) : ''));
      }).join('') + '</section>' : lfVazioHtml(ICO_D.cup, 'Nenhuma oferta no ar', 'Quando uma peça parar de girar, o ' + LF_TITAN + ' sugere a oferta aqui e você aceita.')) +
      '<div class="lbl tiLb">CUPONS</div>' +
      dFold('ofFol', 'Folga de hoje · até ' + fMin + '%', sem ? cntPl(sem, 'preço sem folga', 'preços sem folga') : 'todos os preços com folga', sem ? 'var(--warn)' : '',
        '<p class="hint">É o maior desconto que deixa todas as peças na sua margem hoje. A janela Oferta mostra a folga de cada peça e avisa quando o desconto passa dela.</p>') +
      '<section class="nvLista">' + (t ? tiLinha('temaVer', '', 'dia', t.nome, 'evento · ' + (nT ? cntPl(nT, 'peça entra', 'peças entram') : 'nenhuma peça entra ainda')) : '') +
      tiLinha('cupAbre', '', 'cup', 'Cartões dos clientes', 'os cupons moram em Clientes › Cartões') + '</section>' +
      '<div class="lbl tiLb">COMO O ' + esc(LF_TITAN).toUpperCase() + ' DECIDE</div>' +
      dFold('ofPar', 'Peça parada', 'a partir de 60 dias sem vender', '', '<p class="hint">Com o preço automático ligado, a peça parada ganha oferta em degraus (60 dias −5%, 75 −10%, 90 −15%, 120 = a margem mínima) e volta ao preço quando vende de novo. Nunca abaixo do mínimo.</p>') +
      dFold('ofDe', 'De/por honesto', 'o "de" é um preço que já vendeu', '', '<p class="hint">O preço riscado ("de") só aparece se foi o preço da peça por 30 dias ou mais e vendeu nesse preço. Fora disso a oferta mostra só o preço dela, no app, no site e nos posts.</p>') +
      (dsc ? '<section class="card cntQ">' + esc(dsc) + '</section>' : '');
  }
  // "+" de Ofertas: escolher a peça e abrir a MESMA janela Oferta
  ACT.ofNova = function () {
    var vis = {}, L = (S.items || []).filter(function (it) {
      if (vis[it.ref] || !(it.qty > 0) || it.bulk || isSimple(it.tipo) || !(tFor(it).price > 0)) return false;
      vis[it.ref] = 1;
      return !(S.pprice[it.ref] && S.pprice[it.ref].ant > S.pprice[it.ref].novo);
    });
    if (!L.length) return lfToast('Nenhuma peça com preço para pôr em oferta', 'atencao');
    OF_ESC = lfJanela({ titulo: 'Escolher a peça', cls: 'escJn', monta: function (c) {
      c.innerHTML = '<section class="nvLista">' + L.map(function (it) { return tiLinha('ofNovaPeca', it.ref, 'oferta', pn(it.ref), it.ref + ' · ' + gs(tFor(it).price)); }).join('') + '</section>';
    } });
  };
  ACT.ofAbre = function (ref) { ofertaJanela(ref); }; // a janela Oferta (src/55-produtos-catalogo.js): ficha, Ofertas no ar e o "+"
  var OF_ESC = null;
  ACT.ofNovaPeca = function (ref) { if (OF_ESC) OF_ESC.fecha(true); OF_ESC = null; ofertaJanela(ref); };
  // o colchão (era a janela "Como o app te protege" do Câmbio): agora a dobra Colchão das Regras
  function colchaoHtml() {
    var c = colchao(),
      casa = lmOk() ? S.lm.usd.v : fxHoje('usd'),
      loja = fxUsdLoja(),
      L = S.siteFx,
      lt = lotesHist().slice(-6),
      mxl = Math.max.apply(
        null,
        lt.map(function (l) {
          return l.usd;
        }).concat([0.01])
      ),
      ul = lt.length > 1 ? lt[lt.length - 1].usd / lt[lt.length - 2].usd - 1 : 0;
    return (
      (typeof colchaoSaldoHtml === 'function' ? '<div class="fjColch">' + colchaoSaldoHtml() + '</div>' : '') + // S366: o saldo do colchão saiu do Dashboard e mora aqui
      '<div class="fjB"><span class="lbl">Cotação da loja</span><div>Casa <b>' + dots(Math.round(casa)) + '</b> → loja <b>' + dots(loja) + '</b> <span class="hint" style="display:inline;margin:0">(+1%, de 50 em 50)</span></div></div>' +
      '<div class="fjB"><span class="lbl fjBl">Colchão de cada venda <b>' + pc(c.pct) + '</b></span><span class="fxBar"><i style="width:' + Math.round(((c.pct - 0.05) / 0.2) * 100) + '%;background:var(--accent)"></i></span><div class="hint fjMm" style="margin:0"><span>mín 5%</span><span>máx 25%</span></div>' +
      '<div class="hint" style="margin:0">Pior alta do dólar em ' + c.janela + ' dias (+' + pc(c.fx) + ') e alta do custo entre lotes (+' + pc(c.cost) + '). Separado em cada venda para repor mais caro se precisar.</div></div>' +
      (lt.length
        ? '<div class="fjB"><span class="lbl">Custo por lote</span><div class="fjLotes">' + lt.map(function (l, i) {
            return '<i title="' + esc(l.txt || '') + '" style="height:' + Math.max(12, Math.round((l.usd / mxl) * 100)) + '%' + (i === lt.length - 1 ? ';background:var(--accent)' : '') + '"></i>';
          }).join('') + '</div><div class="hint" style="margin:0">' + (lt.length > 1 ? 'Último lote saiu ' + pc(Math.abs(ul)) + (ul >= 0 ? ' mais caro' : ' mais barato') + ' em dólar que o anterior.' : 'Um lote registrado até agora.') + '</div></div>'
        : '') +
      '<div class="fjB"><span class="lbl">Preços do site</span><div class="hint" style="margin:0">Cotação da loja + 2% de folga' + (L && L.usd ? ' (' + gsRaw(L.usd) + ')' : '') + ', travada: só muda quando a loja passar dela. Se o dólar cair muito, o app faz ofertas no site.</div></div>'
    );
  }
  function cntItem(id) {
    var p = String(id).split('|'), g = cntDecisoes().filter(function (x) { return x.t === 'pa' && x.kind === p[1]; })[0];
    return g ? g.itens.filter(function (m) { return m.ref === p[0]; })[0] : null;
  }
  ACT.cntVer = function (k) { CNT_VER[k] = !CNT_VER[k]; lfRedesenha(); };
  ACT.cntAceita = function (id) { var m = cntItem(id); if (!m) return; paAplica(m); saveSoon(); lfToast('' + CNT_PA[m.kind][3] + m.ref + ' → ' + gs(m.para), 'ok'); render(); };
  ACT.cntIgnora = function (id) { var m = cntItem(id); if (!m) return; S.pAuto.ign = S.pAuto.ign || {}; S.pAuto.ign[m.ref + '|oferta'] = Date.now(); saveSoon(); render(); };
  // "Aceitar os N preços" aceita exatamente o que o setor mostra (ofertas e voltas); os que sobem moram nos "preços para corrigir"
  ACT.cntTudo = function () {
    var n = 0;
    cntDecisoes().forEach(function (x) { if (x.t === 'pa') x.itens.forEach(function (m) { paAplica(m); n++; }); });
    if (S.pAuto) S.pAuto.ult = Date.now();
    saveSoon(); lfToast('' + cntPl(n, 'preço ajustado', 'preços ajustados') + ' · dá para desfazer em Preços › Histórico', 'ok'); render();
  };

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
    ofertas: ['Ofertas', '', 'oferta'],
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
    regras: function () { return paMetaHtml() + precosCfgHtml() + pagamentoHtml(); },
    ofertas: function () {
      var D = cntDecisoes().filter(function (x) { return x.t === 'pa'; }), nAc = D.reduce(function (a, x) { return a + x.n; }, 0), O = tiOfertasNoAr(), dsc = cntDescontosTxt(new Date().getMonth());
      return (D.length ? '<section class="card col cntD"><div class="lbl">O ' + esc(LF_TITAN).toUpperCase() + ' SUGERE · ' + nAc + '</div>' + D.map(cntDecisaoHtml).join('') +
          '<div class="cntB"><button type="button" class="go" data-act="cntTudo">' + (nAc === 1 ? 'Aceitar o preço' : 'Aceitar os ' + nAc + ' preços') + '</button></div></section>' : '') +
        '<div class="lbl tiLb">OFERTAS NO AR · ' + O.length + '</div>' +
        (O.length ? '<section class="nvLista">' + O.map(function (it) {
          var o = S.pprice[it.ref], p = tFor(it).price;
          return tiLinha('tiPeca', it.ref, 'oferta', pn(it.ref), (o.ate ? 'até ' + fData(o.ate) + ' · ' : '') + gs(p));
        }).join('') + '</section>' : '<div class="hint tiVz">Nenhuma peça em oferta agora.</div>') +
        (dsc ? '<section class="card cntQ">' + esc(dsc) + '</section>' : '');
    },
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
  function fData(ts) { var d = new Date(ts); return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2); }
  ACT.tiPeca = function (ref) { if (typeof fnAbreEstoque === 'function') fnAbreEstoque(ref); };
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

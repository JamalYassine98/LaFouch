  // ===== Faixas de qualidade, piso de preço, brindes e sazonalidade. =====
  var FAIXA_CORES = ['#7fd8ff', '#ffc766', '#e08bc0', '#8be08f', '#b79cff', '#ff9d7a'];
  // Faixas criadas pelo dono: nome, margem mínima (% de lucro sobre o preço) e preço próprio por tipo (opcional).
  S.faixas = [
    { id: 'f1', nome: 'Econômico', margem: 30, precos: {} },
    { id: 'f2', nome: 'Intermediário', margem: 40, precos: {} },
    { id: 'f3', nome: 'Luxo', margem: 50, precos: {} }
  ];
  S.pfaixa = {}; // código do produto -> id da faixa
  S.metaUsd = 0; // meta mensal de lucro da loja toda (US$)
  S.sazon = {}; // só para testes: curva fixa por tipo. Em uso normal a curva é aprendida das vendas (sazonAprendida)
  S.appStart = Date.now();
  S.sugIgn = {}; // sugestão de margem ignorada: faixa -> mês (AAAA-MM)
  S.backupTs = 0;
  S.contagens = [];
  S.conf = {}; // última conferência de estoque por produto (tipo|código) -> data
  S.tolUsd = 0.5; // diferença de contagem tolerada (US$)
  S.volAuto = true; // peças por mês calculadas pelas vendas reais (quando há histórico)
  // Curva padrão: solares vendem mais no verão do Paraguai (outubro a março).
  var SAZON_PADRAO = { solar: [1.5, 1.4, 1.2, 1.0, 0.8, 0.6, 0.6, 0.7, 0.9, 1.1, 1.3, 1.5] };
  // Faixa de um produto pelo código.
  function faixaOf(ref) {
    var id = S.pfaixa && S.pfaixa[ref];
    return (
      (id &&
        S.faixas.filter(function (f) {
          return f.id === id;
        })[0]) ||
      null
    );
  }
  // Cor de uma faixa (pela ordem na lista).
  function faixaCor(f) {
    return FAIXA_CORES[Math.max(0, S.faixas.indexOf(f)) % FAIXA_CORES.length];
  }
  // Etiqueta colorida da faixa.
  function faixaTag(f) {
    var c = faixaCor(f),
      e = mk('span', 'ftag', f.nome);
    e.style.cssText =
      'font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;color:' +
      c +
      ';background:color-mix(in srgb,' +
      c +
      ' 16%,transparent)';
    return e;
  }
  // Arredonda para cima em múltiplos de 500 guaranis.
  function up500(v) {
    return Math.ceil(v / 500) * 500;
  }
  // Fator de venda do tipo em um mês (0 = janeiro). 1 = mês normal.
  // Aprendido sozinho com as vendas: cada mês do ano comparado com a média mensal do próprio tipo.
  // Com pouco histórico usa a curva padrão; conforme o histórico cresce (até 24 meses), pesa mais o que a loja realmente vendeu.
  function sazonAprendida(tipo) {
    var chave = S.sales.length + '|' + Math.floor(Date.now() / 10000),
      cache = (S._sazCache = S._sazCache && S._sazCache.k === chave ? S._sazCache : { k: chave, t: {} });
    if (cache.t[tipo]) return cache.t[tipo];
    var base = SAZON_PADRAO[tipo] || [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      hoje = new Date(),
      atual = hoje.getFullYear() * 12 + hoje.getMonth(),
      porMes = {},
      primeiro = null,
      n = 0;
    S.sales.forEach(function (s) {
      if (s.estorno || s.tipo !== tipo) return;
      var d = new Date(s.ts),
        k = d.getFullYear() * 12 + d.getMonth();
      if (k >= atual) return;
      porMes[k] = (porMes[k] || 0) + s.qty;
      n += s.qty;
      if (primeiro === null || k < primeiro) primeiro = k;
    });
    var out = base.slice(),
      meses = primeiro === null ? 0 : atual - primeiro;
    if (meses >= 6 && n >= 30) {
      var soma = 0,
        porIdx = [],
        cont = [];
      for (var k = primeiro; k < atual; k++) {
        var v = porMes[k] || 0,
          i = k % 12;
        soma += v;
        porIdx[i] = (porIdx[i] || 0) + v;
        cont[i] = (cont[i] || 0) + 1;
      }
      var media = soma / meses,
        conf = Math.min(1, meses / 24);
      if (media > 0)
        for (var m = 0; m < 12; m++)
          if (cont[m]) {
            var raw = porIdx[m] / cont[m] / media;
            out[m] = Math.max(0.4, Math.min(2.5, conf * raw + (1 - conf) * base[m]));
          }
    }
    cache.t[tipo] = out;
    return out;
  }
  function sazonFator(tipo, mes) {
    var c = (S.sazon && S.sazon[tipo]) || sazonAprendida(tipo);
    var v = c && Number(c[((mes % 12) + 12) % 12]);
    return v > 0 ? Math.round(v * 100) / 100 : 1;
  }
  // Preço de tabela e limites de uma peça: trava (sem prejuízo) e piso (com a margem mínima da faixa).
  function pisoPeca(it) {
    var t = tFor(it),
      fx = S.fx.pyg,
      rep = Math.round(t.repUSD * fx),
      cp = contasPeca(),
      col = Math.round(t.repUSD * fx * colchao().pct),
      f = faixaOf(it.ref),
      m = f ? Math.min(0.9, f.margem / 100) : 0,
      trava = rep + cp;
    return {
      lista: t.price,
      rep: rep,
      contas: cp,
      colch: col,
      trava: trava,
      piso: up500((trava + col) / (1 - m)),
      saida: up500(trava),
      margem: m
    };
  }
  // Brindes: peças de tipos simples (estojo, capinha…) com estoque.
  function brindesDisp() {
    return S.items.filter(function (i) {
      return i.qty > 0 && isSimple(i.tipo);
    });
  }
  // Custo em US$ de uma peça de brinde.
  function brindeUsd(it) {
    var c = effCusto(it),
      t = tipoOf(it.tipo);
    return c != null ? c : t ? t.repUSD || 0 : 0;
  }
  // Procura a peça de brinde gravada numa venda.
  function brindeItem(b) {
    return S.items.filter(function (x) {
      return (
        x.tipo === b.tipo &&
        x.ref === b.ref &&
        x.cor === b.cor &&
        (x.grau || '') === (b.grau || '') &&
        (x.vr || '') === (b.vr || '') &&
        (x.lote || '') === (b.lote || '')
      );
    })[0];
  }
  // Estorno da venda devolve o brinde ao estoque.
  function estornoBrinde(s) {
    if (!s.brinde) return;
    var it = brindeItem(s.brinde);
    if (it) it.qty += 1;
  }
  // Soma peças por pacote (entrada em pacotes): total de peças e custo por peça.
  function calcPacote(pecas, pacotes, custoPacote) {
    var n = Math.max(0, Math.round(pecas * pacotes));
    return { qty: n, custo: n > 0 && custoPacote > 0 ? (custoPacote * pacotes) / n : 0 };
  }

  // Campos extras do cadastro: faixa do produto e entrada por pacote.
  function renderAddExtras() {
    var fb = $('eFaixas');
    if (!fb) return;
    var ref = S._ref,
      cur = S.eFaixa || (ref && (faixaOf(ref) || {}).id) || '';
    $('eFaixaB').hidden = !S.faixas.length || isSimple(S.tipo);
    fb.textContent = '';
    S.faixas.forEach(function (x) {
      fb.appendChild(
        btn(
          'chip' + (cur === x.id ? ' on' : ''),
          x.nome,
          function () {
            S.eFaixa = S.eFaixa === x.id ? '' : x.id;
            render();
          },
          cur === x.id
        )
      );
    });
    var pc = $('pkChips');
    pc.textContent = '';
    [20, 24, 30].forEach(function (n) {
      pc.appendChild(
        btn(
          'chip' + (S.pkPecas === n ? ' on' : ''),
          String(n),
          function () {
            S.pkPecas = n;
            $('pkN').value = '';
            render();
          },
          S.pkPecas === n
        )
      );
    });
    var pk = pkCalc();
    $('pkH').hidden = !pk.qty;
    $('pkH').textContent = pk.qty
      ? pk.qty + ' peças no total' + (pk.custo ? ' · custo US$ ' + pk.custo.toFixed(2).replace('.', ',') + ' por peça' : '')
      : '';
    $('pkGo').disabled = !pk.qty;
  }
  // Lê os campos do pacote e calcula peças e custo por peça.
  function pkCalc() {
    var pecas = toNum($('pkN').value) || S.pkPecas || 0,
      q = toNum($('pkQ').value) || 1,
      c = parseFloat(String($('pkC').value).replace(',', '.')) || 0;
    return calcPacote(pecas, q, c);
  }
  ['pkN', 'pkQ', 'pkC'].forEach(function (id) {
    $(id).addEventListener('input', function () {
      if (id === 'pkN' && this.value) S.pkPecas = 0;
      renderAddExtras();
    });
  });
  $('pkGo').onclick = function () {
    var pk = pkCalc();
    if (!pk.qty) return;
    S.qty = pk.qty;
    if (pk.custo) $('eCusto').value = pk.custo.toFixed(4).replace(/0+$/, '').replace(/\.$/, '').replace('.', ',');
    S.msg = '';
    render();
  };

  // Média mensal real de peças vendidas (0 enquanto não há histórico suficiente).
  function volumeAuto() {
    var now = Date.now(),
      first = S.sales.reduce(function (a, s) {
        return Math.min(a, s.ts);
      }, S.appStart || now),
      hist = (now - Math.min(first, S.appStart || now)) / DAY;
    if (hist < 60) return 0;
    var win = Math.min(90, hist),
      units = 0;
    S.sales.forEach(function (s) {
      if (!s.estorno && now - s.ts <= win * DAY) units += s.qty;
    });
    return units >= 20 ? Math.round(units / (win / 30)) : 0;
  }
  // Peças por mês usadas para ratear as contas: real quando há histórico, senão o número manual.
  function volumeEfetivo() {
    var a = S.volAuto !== false ? volumeAuto() : 0;
    return a > 0 ? a : S.volume;
  }

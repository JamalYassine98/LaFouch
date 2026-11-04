  // ===== Brindes (v417): compra de estojos, flanelas, sacolas e cartões entra como DESPESA, sem estoque. =====
  // O app aprende sozinho quanto cada óculos vendido "gasta" de brinde (pelas compras seguintes)
  // e diz quanto separar de cada venda para recomprar. Valores sempre lançados pelo dono.
  S.brindes = [];
  var BR = { nome: '', qtd: '', unit: '', moeda: 'pyg' };
  var BR_SIMB = { pyg: 'G$', brl: 'R$', usd: 'US$' };
  function brNum(v) {
    return parseFloat(String(v || '').replace(/\./g, '').replace(',', '.')) || 0;
  }
  function brNumDec(v) {
    var t = String(v || '').trim();
    // "0,15" e "1.250,50" (vírgula decimal) ou "0.15"
    if (t.indexOf(',') >= 0) return parseFloat(t.replace(/\./g, '').replace(',', '.')) || 0;
    return parseFloat(t) || 0;
  }
  function brChave(n) {
    return String(n || '').trim().toLowerCase();
  }
  // Óculos vendidos (peças, sem estornos) entre dois momentos.
  function brVendidos(de, ate) {
    return (S.sales || []).reduce(function (a, s) {
      return a + (!s.estorno && s.ts >= de && s.ts < ate ? +s.qty || 0 : 0);
    }, 0);
  }
  // Por brinde: preço por unidade (última compra), quanto sai por óculos (aprendido) e quanto já está guardado.
  function brResumo() {
    var g = {},
      ord = [];
    (S.brindes || []).forEach(function (c) {
      var k = brChave(c.nome);
      if (!g[k]) {
        g[k] = [];
        ord.push(k);
      }
      g[k].push(c);
    });
    var agora = Date.now();
    return ord.map(function (k) {
      var cs = g[k].slice().sort(function (a, b) {
          return a.ts - b.ts;
        }),
        ult = cs[cs.length - 1],
        unit = ult.qtd > 0 ? ult.valor / ult.qtd : 0,
        porOc = 1;
      // a partir da 2ª compra: unidades compradas antes da última ÷ óculos vendidos nesse tempo
      if (cs.length > 1) {
        var un = cs.slice(0, -1).reduce(function (a, c) {
            return a + (+c.qtd || 0);
          }, 0),
          oc = brVendidos(cs[0].ts, ult.ts);
        if (oc > 0) porOc = Math.max(0.05, Math.min(5, un / oc));
      }
      var porVenda = unit * porOc,
        guardado = brVendidos(ult.ts, agora) * porVenda;
      return { nome: ult.nome, unit: unit, porOc: porOc, porVenda: porVenda, guardado: guardado, compras: cs.length };
    });
  }
  // Totais em guaranis: quanto separar por venda (óculos) e quanto já está guardado.
  function brTotais() {
    var r = brResumo();
    return {
      porVenda: r.reduce(function (a, x) {
        return a + x.porVenda;
      }, 0),
      guardado: r.reduce(function (a, x) {
        return a + x.guardado;
      }, 0),
      itens: r
    };
  }
  // Valor em guaranis da compra (câmbio do dia).
  function brValorGs(total, m) {
    return m === 'pyg' ? total : Math.round(total * ratePyg(m));
  }
  function brTotal() {
    return Math.round(brNum(BR.qtd) * brNumDec(BR.unit) * 100) / 100;
  }
  function brTotalTxt() {
    var t = brTotal();
    return t > 0 ? BR_SIMB[BR.moeda] + ' ' + nf(t, BR.moeda) : '';
  }
  // Formulário "Compra de brindes" (Tipo = Outro no cadastro).
  function brCompraForm(host) {
    if (!host) return;
    if (!host.dataset.ok) {
      host.dataset.ok = '1';
      host.innerHTML =
        '<div class="card col" style="gap:12px">' +
        '<div><div class="lbl">O que comprou</div><input class="in" id="brNome" placeholder="Ex.: Estojo, flanela, sacola, cartão" autocomplete="off" maxlength="40"><div class="nav" id="brSug" style="margin-top:8px"></div></div>' +
        '<div class="nvg2"><div><div class="lbl">Quantidade</div><input class="in" id="brQtd" inputmode="numeric" placeholder="Ex.: 1000" autocomplete="off"></div>' +
        '<div><div class="lbl">Preço por unidade</div><input class="in" id="brUnit" inputmode="decimal" placeholder="Ex.: 0,10" autocomplete="off"></div></div>' +
        '<div><div class="lbl">Moeda</div><div class="trk" id="brMoeda"><span class="trkTh"></span><button type="button" class="trkB" data-m="pyg">G$</button><button type="button" class="trkB" data-m="brl">R$</button><button type="button" class="trkB" data-m="usd">US$</button></div></div>' +
        '<div class="brTot"><span>Total</span><b id="brTotal">—</b></div>' +
        '</div>' +
        '<div class="brSep" id="brSep"></div>' +
        '<button type="button" class="btn go" id="brLanca" style="width:100%">Lançar compra</button>';
      var pega = function () {
        BR.nome = $('brNome').value;
        BR.qtd = $('brQtd').value;
        BR.unit = $('brUnit').value;
        brPinta();
      };
      ['brNome', 'brQtd', 'brUnit'].forEach(function (id) {
        $(id).oninput = pega;
      });
      $('brQtd').addEventListener('input', function () {
        var e = $('brQtd');
        e.value = e.value.replace(/\D/g, '');
      });
      $('brMoeda').onclick = function (e) {
        var b = e.target.closest('.trkB');
        if (!b) return;
        BR.moeda = b.dataset.m;
        brPinta();
      };
      $('brSug').onclick = function (e) {
        var b = e.target.closest('[data-n]');
        if (!b) return;
        var c = brUltima(b.dataset.n);
        $('brNome').value = BR.nome = c.nome;
        if (c) {
          BR.moeda = c.moeda || 'pyg';
          if (!$('brUnit').value) $('brUnit').value = BR.unit = String(c.unit).replace('.', ',');
        }
        brPinta();
      };
      $('brLanca').onclick = brLancar;
    }
    $('brNome').value = BR.nome;
    $('brQtd').value = BR.qtd;
    $('brUnit').value = BR.unit;
    brPinta();
  }
  function brUltima(nome) {
    var k = brChave(nome),
      l = (S.brindes || []).filter(function (c) {
        return brChave(c.nome) === k;
      });
    return l[l.length - 1] || null;
  }
  function brPinta() {
    trkPoe($('brMoeda'), BR.moeda);
    var tt = $('brTotal');
    if (tt) tt.textContent = brTotalTxt() || '—';
    var bl = $('brLanca');
    if (bl) bl.textContent = brTotal() > 0 ? 'Lançar compra · ' + brTotalTxt() : 'Lançar compra';
    var sg = $('brSug');
    if (sg) {
      var vistos = {},
        h = '';
      (S.brindes || [])
        .slice()
        .reverse()
        .forEach(function (c) {
          var k = brChave(c.nome);
          if (vistos[k]) return;
          vistos[k] = 1;
          h += '<button type="button" class="chip' + (brChave(BR.nome) === k ? ' on' : '') + '" data-n="' + esc(c.nome) + '">' + esc(c.nome) + '</button>';
        });
      sg.innerHTML = h;
      sg.hidden = !h;
    }
    var sp = $('brSep');
    if (sp) {
      var t = brTotais();
      sp.innerHTML = t.itens.length ? 'Brindes: separar <b>' + gs(Math.round(t.porVenda)) + '</b> por venda · guardado <b>' + gs(Math.round(t.guardado)) + '</b>' : '';
      sp.hidden = !t.itens.length;
    }
  }
  function brLancar() {
    var nome = String(BR.nome || '').trim(),
      q = brNum(BR.qtd),
      u = brNumDec(BR.unit);
    if (!nome) {
      popErr('Diga o que comprou.');
      guiaMarca('brNome');
      return;
    }
    if (!(q > 0)) {
      popErr('Informe a quantidade.');
      guiaMarca('brQtd');
      return;
    }
    if (!(u > 0)) {
      popErr('Informe o preço por unidade.');
      guiaMarca('brUnit');
      return;
    }
    nome = nome[0].toUpperCase() + nome.slice(1);
    var tot = Math.round(q * u * 100) / 100,
      c = { ts: Date.now(), nome: nome, qtd: q, unit: u, moeda: BR.moeda, total: tot, valor: brValorGs(tot, BR.moeda) };
    S.brindes.push(c);
    // aparece no histórico como gasto extra (despesa), sem estoque
    S.dlog.push({ ts: c.ts, kind: 'imp', desc: 'Compra de brindes: ' + q + ' ' + nome.toLowerCase() + ' (' + BR_SIMB[c.moeda] + ' ' + nf(tot, c.moeda) + ')', valor: c.valor, brinde: 1 });
    BR.qtd = '';
    BR.unit = '';
    BR.nome = '';
    vibrar(20);
    lfToast('✓ Compra de brindes lançada · ' + BR_SIMB[c.moeda] + ' ' + nf(tot, c.moeda));
    S.nOutro = false;
    closeAdd();
  }
  // Brindes comprados no mês (em guaranis), para o resultado da loja.
  function brNoMes(lim) {
    return (S.brindes || []).reduce(function (a, c) {
      return a + (noMes(c.ts, lim) ? c.valor || 0 : 0);
    }, 0);
  }

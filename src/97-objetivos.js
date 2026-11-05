  // ===== Meta automática + Objetivos da loja (v425, aprovado 04/11/2026) =====
  // META: uma só, automática, sem campo nem botão. Fica fixa no mês: é calculada no 1º uso do mês com as vendas
  // ANTERIORES a ele — média dos últimos 3 meses, corrigida pela época do ano, e limitada pelo que o estoque consegue dar.
  // Sem 14 dias de vendas antes do mês, usa o ritmo de até agora (e vai firmando).
  // OBJETIVOS: a antiga caixa de melhorias. Cada objetivo tem nome, quanto custa e "quero até" (mês).
  // O dinheiro enche um por vez, na ordem (segurar para reordenar). Cada venda guarda um valor automático
  // (o que os objetivos com data pedem, até metade do lucro da peça) e metade do que passar da meta vai para eles.
  S.objetivos = []; // [{id, nome, custo (G$), ate 'AAAA-MM' ou '', ts, usado}]
  S.metaHist = {}; // 'AAAA-M' -> meta do mês em US$ (congelada)
  var OBJ = { nome: '', custo: '', ate: '' };
  function ymDe(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '-' + (d.getMonth() + 1);
  }
  function inicioMes(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  }
  // Meta (US$) calculada com as vendas até "ate" (exclusive).
  function metaCalc(ate, mes) {
    var vs = (S.sales || []).filter(function (s) {
      return !s.estorno && s.ts < ate;
    });
    if (!vs.length) return 0;
    var primeiro = vs.reduce(function (a, s) {
        return Math.min(a, s.ts);
      }, ate),
      hist = (ate - Math.min(primeiro, S.appStart || primeiro)) / DAY;
    if (hist < 14) return 0;
    var jan = Math.min(90, hist),
      soma = 0;
    vs.forEach(function (s) {
      if (ate - s.ts > jan * DAY) return;
      var f0 = sazonFator(s.tipo, new Date(s.ts).getMonth()) || 1;
      soma += lucroUsd(s) * ((sazonFator(s.tipo, mes) || 1) / f0);
    });
    var d = new Date(ate),
      dias = new Date(d.getFullYear(), mes + 1, 0).getDate(),
      meta = (soma / jan) * dias;
    // o estoque limita: não dá para pedir mais que ~60% do lucro de tudo o que está na prateleira
    var pot = 0;
    try {
      prodStats().forEach(function (m) {
        var t = tFor(m.it),
          u = t && t.price > 0 ? t.price / (S.fx.pyg || 1) - (m.cu || 0) : 0;
        if (u > 0 && m.stock > 0) pot += u * m.stock;
      });
    } catch (e) {}
    if (pot > 0) meta = Math.min(meta, pot * 0.6);
    return meta > 0 ? Math.ceil(meta / 10) * 10 : 0;
  }
  // Meta do mês atual (US$): congelada no 1º uso do mês; sem base anterior, usa o ritmo de até agora.
  function metaMes() {
    var d = new Date(),
      k = ymDe(d.getTime());
    if (!S.metaHist) S.metaHist = {};
    if (S.metaHist[k] > 0) return S.metaHist[k];
    var m = metaCalc(inicioMes(d), d.getMonth());
    if (m > 0) {
      S.metaHist[k] = m;
      saveSoon();
      return m;
    }
    return metaCalc(Date.now() + 1, d.getMonth());
  }
  // Lucro livre (US$) de um mês 'AAAA-M'.
  function lucroDoMes(k) {
    return (S.sales || []).reduce(function (a, s) {
      return a + (!s.estorno && ymDe(s.ts) === k ? lucroUsd(s) : 0);
    }, 0);
  }
  // Metade do que passou da meta, em todos os meses com meta (G$).
  function objExtra() {
    var t = 0;
    Object.keys(S.metaHist || {}).forEach(function (k) {
      var m = S.metaHist[k];
      if (m > 0) t += Math.max(0, lucroDoMes(k) - m) / 2;
    });
    return Math.round(t * (S.fx.pyg || 0));
  }
  // Peças vendidas por dia (últimos 30 dias; sem histórico, o volume do mês ÷ 30).
  function pecasDia() {
    var lim = Date.now() - 30 * DAY,
      n = 0,
      ini = Date.now();
    (S.sales || []).forEach(function (s) {
      if (s.estorno) return;
      ini = Math.min(ini, s.ts);
      if (s.ts >= lim) n += +s.qty || 0;
    });
    var dias = Math.max(7, Math.min(30, (Date.now() - ini) / DAY));
    if (n > 0) return n / dias;
    var v = volumeEfetivo();
    return v > 0 ? v / 30 : 0;
  }
  // Lucro de cada peça antes do objetivo (média de 30 dias, G$).
  function lucroPeca() {
    var lim = Date.now() - 30 * DAY,
      q = 0,
      l = 0;
    (S.sales || []).forEach(function (s) {
      if (s.estorno || s.ts < lim) return;
      q += +s.qty || 0;
      l += (s.livre || 0) + (s.melh || 0);
    });
    return q > 0 ? l / q : 0;
  }
  function objFimMes(ate) {
    var p = String(ate || '').split('-');
    return p.length === 2 ? new Date(+p[0], +p[1], 0, 23, 59).getTime() : 0;
  }
  var MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  function mesTxt(ts) {
    var d = new Date(ts);
    return MESES[d.getMonth()] + (d.getFullYear() !== new Date().getFullYear() ? '/' + String(d.getFullYear()).slice(2) : '');
  }
  // Situação dos objetivos: guardado total, quanto cada um tem, quanto cada venda guarda e se cabe.
  function objPlano() {
    var r = reservas(),
      tot = Math.max(0, r.melh),
      resta = tot,
      pd = pecasDia(),
      lp = lucroPeca(),
      teto = lp > 0 ? lp / 2 : 0,
      acum = 0,
      porVenda = 0,
      lista = (S.objetivos || []).filter(function (o) {
        return !o.usado;
      });
    var itens = lista.map(function (o) {
      var tem = Math.min(o.custo, resta);
      resta -= tem;
      var falta = o.custo - tem;
      acum += falta;
      var fim = objFimMes(o.ate),
        dias = fim ? Math.max(1, (fim - Date.now()) / DAY) : 0,
        pecas = pd * dias,
        pede = fim && falta > 0 ? (pecas > 0 ? acum / pecas : Infinity) : 0,
        cabe = !pede || (teto > 0 && pede <= teto),
        sug = 0;
      if (pede) porVenda = Math.max(porVenda, Math.min(pede, teto || pede));
      // mês em que cabe (guardando no máximo metade do lucro da peça)
      if (!cabe && teto > 0 && pd > 0) sug = Date.now() + (acum / teto / pd) * DAY;
      // previsão de quando fica pronto no ritmo de hoje
      return { o: o, tem: tem, falta: falta, pct: o.custo > 0 ? tem / o.custo : 0, pronto: falta <= 0, pede: pede, cabe: cabe, sug: sug, fim: fim };
    });
    if (porVenda > 0) porVenda = Math.ceil(porVenda / 500) * 500;
    var gpd = porVenda * pd;
    itens.forEach(function (x, i) {
      var antes = itens.slice(0, i + 1).reduce(function (a, y) {
        return a + y.falta;
      }, 0);
      x.prev = !x.pronto && gpd > 0 ? Date.now() + (antes / gpd) * DAY : 0;
    });
    return { total: tot, porVenda: porVenda, itens: itens, usados: (S.objetivos || []).filter(function (o) {
      return o.usado;
    }) };
  }
  // Quanto cada venda guarda para os objetivos (G$ por peça). Sem objetivo com data, vale o valor antigo.
  function melhPecaAuto() {
    var temData = (S.objetivos || []).some(function (o) {
      return !o.usado && o.ate;
    });
    if (!temData) return S.melhPeca;
    var p = S._objPV;
    if (!p || Date.now() - p.ts > 60000 || p.n !== S.sales.length) {
      p = S._objPV = { ts: Date.now(), n: S.sales.length, v: objPlano().porVenda };
    }
    return p.v;
  }
  // ---- Cartão da meta no Resumo ----
  function metaCardHtml() {
    var mi = metaInfo(),
      fx = S.fx.pyg || 0,
      lucro = Math.round(mi.lucro * fx),
      meta = Math.round(mi.meta * fx),
      d = new Date(),
      dia = d.getDate(),
      h = '<section class="card col mtCard"><div class="paMt"><span class="hint" style="margin:0">Meta do mês</span><span class="hint" style="margin:0">' + (meta > 0 ? 'meta ' + gs(Math.ceil(meta / 1000) * 1000) : 'aprendendo') + '</span></div><b class="paBig">' + gs(lucro) + '</b>';
    if (!(meta > 0)) return h + '<div class="hint" style="margin:0">A meta aparece sozinha com 14 dias de vendas (média dos últimos meses + época do ano + estoque).</div></section>';
    var p = Math.max(0, Math.min(100, (lucro / meta) * 100)),
      hoje = Math.min(100, (dia / mi.dias) * 100),
      proj = dia > 0 ? Math.round((lucro / dia) * mi.dias) : 0,
      lp = lucroPeca(),
      falta = meta - lucro,
      pdia = falta > 0 && lp > 0 ? falta / lp / mi.restam : 0;
    h += '<div class="mtBar"><i style="width:' + p + '%"></i><s style="left:' + hoje + '%" title="onde devia estar hoje"></s></div>';
    if (lucro >= meta) {
      h += '<div class="hint" style="margin:0;color:var(--ok)">Meta batida! O que passar dela, metade vai para os Objetivos: <b>+' + gs(Math.round((lucro - meta) / 2)) + '</b></div>';
    } else {
      h +=
        '<div class="hint" style="margin:0">' +
        (lucro >= (meta * dia) / mi.dias ? 'Adiantado' : 'Atrasado') +
        ' · no ritmo de hoje fecha o mês em <b>' + gs(proj) + '</b></div>' +
        (pdia > 0 ? '<div class="hint" style="margin:0">Para chegar lá: <b>~' + String(Math.round(pdia * 10) / 10).replace('.', ',') + ' peças por dia</b> até o fim do mês</div>' : '') +
        '<div class="hint" style="margin:0">Passou da meta → metade vai para os Objetivos da loja</div>';
    }
    return h + '</section>';
  }
  // ---- Objetivos no Caixa ----
  function objCardHtml() {
    var pl = objPlano(),
      h = '<section class="card col obCard"><div class="paMt"><h2 style="margin:0;font-size:16px">Objetivos da loja</h2><span class="hint" style="margin:0">guardado <b>' + gs(Math.round(pl.total)) + '</b></span></div>';
    if (!pl.itens.length) {
      h += '<div class="hint" style="margin:0">Diga o que quer para a loja (reforma, vitrine, ar-condicionado…). Cada venda guarda um pouco e metade do que passar da meta vai para cá.</div>';
    } else {
      h +=
        '<div class="hint" style="margin:0">Cada venda guarda <b>' + gs(melhPecaAuto()) + '</b> · enche um por vez, na ordem (segure para mudar)</div><div class="obLista" id="obLista">';
      pl.itens.forEach(function (x) {
        var o = x.o,
          st = '';
        if (x.pronto) st = '<span style="color:var(--ok)">Pronto!</span>';
        else if (x.fim && !x.cabe) st = '<span style="color:var(--warn)">Até ' + mesTxt(x.fim) + ' não cabe (pediria ' + gs(Math.ceil(x.pede / 500) * 500) + ' por venda)' + (x.sug ? ' · dá até ' + mesTxt(x.sug) : '') + '</span>';
        else if (x.fim) st = 'quero até ' + mesTxt(x.fim) + (x.prev ? ' · no ritmo: ' + mesTxt(x.prev) : '');
        else st = x.prev ? 'no ritmo: ' + mesTxt(x.prev) : 'sem data';
        h +=
          '<div class="obIt" data-id="' + o.id + '"><div class="obL"><b>' + esc(o.nome) + '</b><span>' + gs(Math.round(x.tem)) + ' de ' + gs(o.custo) + '</span></div>' +
          '<div class="mtBar"><i style="width:' + Math.round(x.pct * 100) + '%"></i></div>' +
          '<div class="obS"><small>' + st + '</small>' +
          (x.pronto ? '<button type="button" class="btn go obUsar" data-act="obUsar" data-id="' + o.id + '">Usar</button>' : '<button type="button" class="obX" data-act="obDel" data-id="' + o.id + '" aria-label="Remover objetivo">×</button>') +
          '</div></div>';
      });
      h += '</div>';
    }
    h += '<button type="button" class="obNovo" data-act="cxabre" data-id="mel">+ Novo objetivo</button></section>';
    return h;
  }
  function objFormHtml() {
    var d = new Date(),
      ops = '<option value="">Sem data</option>';
    for (var i = 1; i <= 24; i++) {
      var m = new Date(d.getFullYear(), d.getMonth() + i, 1),
        v = m.getFullYear() + '-' + (m.getMonth() + 1);
      ops += '<option value="' + v + '"' + (OBJ.ate === v ? ' selected' : '') + '>' + MESES[m.getMonth()] + ' ' + m.getFullYear() + '</option>';
    }
    return (
      '<section class="card col"><h2 style="margin:0;font-size:16px">Novo objetivo</h2>' +
      '<div><div class="lbl">O que quer para a loja</div><input class="in" id="obNome" placeholder="Ex.: Reforma da vitrine" maxlength="40" autocomplete="off" value="' + esc(OBJ.nome) + '"></div>' +
      '<div class="nvg2"><div><div class="lbl">Quanto custa</div><input class="in" id="obCusto" inputmode="numeric" placeholder="G$" autocomplete="off" value="' + esc(OBJ.custo) + '"></div>' +
      '<div><div class="lbl">Quero até</div><select class="in" id="obAte">' + ops + '</select></div></div>' +
      '<button type="button" class="btn go" data-act="obAdd" style="width:100%">Guardar objetivo</button></section>'
    );
  }
  ACT.obAdd = function () {
    var nome = ($('obNome').value || '').trim(),
      custo = campoParaGs($('obCusto').value),
      ate = $('obAte').value;
    if (!nome) {
      popErr('Diga o que quer para a loja.');
      guiaMarca('obNome');
      return;
    }
    if (!(custo > 0)) {
      popErr('Informe quanto custa.');
      guiaMarca('obCusto');
      return;
    }
    S.objetivos.push({ id: 'o' + Date.now().toString(36), nome: nome[0].toUpperCase() + nome.slice(1), custo: custo, ate: ate, ts: Date.now() });
    OBJ = { nome: '', custo: '', ate: '' };
    S._objPV = null;
    S.cxAcao = '';
    vibrar(20);
    lfToast('✓ Objetivo guardado');
    saveSoon();
    renderCaixa();
  };
  ACT.obDel = function (id) {
    var i = S.objetivos.findIndex(function (o) {
      return o.id === id;
    });
    if (i < 0) return;
    var o = S.objetivos.splice(i, 1)[0];
    S._objPV = null;
    saveSoon();
    renderCaixa();
    lfDesfazer('Objetivo removido', function () {
      S.objetivos.splice(i, 0, o);
      S._objPV = null;
      saveSoon();
      renderCaixa();
    }, 5000);
  };
  ACT.obUsar = function (id) {
    var o = S.objetivos.filter(function (x) {
      return x.id === id;
    })[0];
    if (!o) return;
    if (o.custo > S.cash.pyg) {
      S.cxMsg = 'Saldo insuficiente em guaranis em caixa (troque antes no Câmbio).';
      renderCaixa();
      return;
    }
    S.cash.pyg -= o.custo;
    lancarMelhoria(o.nome, o.custo);
    o.usado = Date.now();
    S._objPV = null;
    S.cxMsg = 'Objetivo realizado: ' + o.nome + ' · ' + gs(o.custo) + '.';
    saveSoon();
    renderCaixa();
  };
  // Segurar 0,4 s levanta o objetivo; arrastar muda a ordem.
  function objGestos() {
    var g = $('obLista');
    if (!g || g._ok) return;
    g._ok = 1;
    var st = null;
    g.addEventListener('pointerdown', function (e) {
      var it = e.target.closest('.obIt');
      if (!it || e.target.closest('button')) return;
      st = { it: it, y0: e.clientY, id: e.pointerId, arr: false };
      st.t = setTimeout(function () {
        if (!st) return;
        st.arr = true;
        it.classList.add('obLev');
        vibrar(15);
        try {
          g.setPointerCapture(st.id);
        } catch (er) {}
      }, 400);
    });
    g.addEventListener('pointermove', function (e) {
      if (!st || e.pointerId !== st.id) return;
      if (!st.arr) {
        if (Math.abs(e.clientY - st.y0) > 8) {
          clearTimeout(st.t);
          st = null;
        }
        return;
      }
      e.preventDefault();
      var irmaos = [].slice.call(g.querySelectorAll('.obIt'));
      irmaos.forEach(function (x) {
        if (x === st.it) return;
        var r = x.getBoundingClientRect(),
          meio = r.top + r.height / 2,
          ri = st.it.getBoundingClientRect();
        if (e.clientY < meio && ri.top > r.top) g.insertBefore(st.it, x);
        else if (e.clientY > meio && ri.top < r.top) g.insertBefore(st.it, x.nextSibling);
      });
    });
    var fim = function (e) {
      if (!st || (e && e.pointerId !== st.id)) return;
      clearTimeout(st.t);
      var era = st;
      st = null;
      if (!era.arr) return;
      era.it.classList.remove('obLev');
      var ids = [].map.call(g.querySelectorAll('.obIt'), function (x) {
          return x.dataset.id;
        }),
        antes = S.objetivos.slice(),
        usados = antes.filter(function (o) {
          return o.usado;
        }),
        nova = ids
          .map(function (id) {
            return antes.filter(function (o) {
              return o.id === id;
            })[0];
          })
          .filter(Boolean)
          .concat(usados);
      if (nova.map(function (o) { return o.id; }).join() === antes.map(function (o) { return o.id; }).join()) return;
      S.objetivos = nova;
      S._objPV = null;
      saveSoon();
      renderCaixa();
      lfDesfazer('Ordem salva', function () {
        S.objetivos = antes;
        S._objPV = null;
        saveSoon();
        renderCaixa();
      }, 4000);
    };
    g.addEventListener('pointerup', fim);
    g.addEventListener('pointercancel', fim);
  }

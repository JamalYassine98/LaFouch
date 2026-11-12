  // ===== S172 C e D (aprovados 11/11/2026): o que o site pediu (Reposição) e "Semana do site" (Início) =====
  // Os números vêm do Analisador do painel (contagens anônimas), lidos com o login da nuvem do app; guardados por 12 h.
  S.siteAn = null; // {d7:{ts, j}, d30:{ts, j}}
  function siteAn(dias) {
    var k = 'd' + dias,
      c = S.siteAn && S.siteAn[k];
    if (c && Date.now() - c.ts < 12 * 3600000) return c.j;
    if (!S.nuvem || !S.nuvem.rt || siteAn['p' + k]) return c ? c.j : null;
    siteAn['p' + k] = 1;
    nvToken()
      .then(function (t) {
        return fetch('https://southamerica-east1-' + nvCfg().p + '.cloudfunctions.net/analise', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t }, body: JSON.stringify({ acao: 'resumo', dias: dias }) });
      })
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        if (!j || !j.ok) return;
        S.siteAn = S.siteAn || {};
        S.siteAn[k] = { ts: Date.now(), j: j };
        saveSoon();
        render();
      })
      .catch(function () {})
      .then(function () {
        siteAn['p' + k] = 0;
      });
    return c ? c.j : null;
  }
  // Quantas pessoas o teste do Mochi deu esse grau (30 dias). g = '+1.50'
  function sitePedeGrau(g) {
    var j = S.siteAn && S.siteAn.d30 && S.siteAn.d30.j;
    if (!j) return 0;
    var x = (j.mochiGraus || []).filter(function (y) {
      return y[0] === g;
    })[0];
    return x ? x[1] : 0;
  }
  var SITE_PEDE_MIN = 20; // a partir de 20 pessoas no teste, o grau esgotado/baixo ganha 2 pacotes
  function siteEstoqueRef(ref) {
    return S.items.reduce(function (a, i) {
      return a + (i.ref === ref ? i.qty || 0 : 0);
    }, 0);
  }
  // Bloco "O que o site pediu (30 dias)" na aba Reposição
  function sitePediuEl() {
    var j = siteAn(30),
      box = mk('div', 'repSite');
    box.appendChild(mk('div', 'lbl', '🆕 O que o site pediu (30 dias)'));
    if (!j) {
      box.appendChild(mk('div', 'hint', S.nuvem && S.nuvem.rt ? 'Buscando os números do site…' : 'Entre na nuvem (Ajustes › Nuvem) para ver o que o site pediu.'));
      return box;
    }
    var linhas = [];
    (j.mochiGraus || []).slice(0, 4).forEach(function (x) {
      linhas.push(['Teste do Mochi deu ' + x[0].replace('.', ','), x[1] + (x[1] === 1 ? ' pessoa' : ' pessoas')]);
    });
    (j.pecas || [])
      .filter(function (x) {
        return S.items.some(function (i) {
          return i.ref === x[0];
        }) && siteEstoqueRef(x[0]) <= 0;
      })
      .slice(0, 3)
      .forEach(function (x) {
        linhas.push(['Esgotado e visitado: ' + pn(x[0]), x[1] + ' vistas']);
      });
    (j.semResultado || []).slice(0, 3).forEach(function (x) {
      linhas.push(['Buscado sem resultado: “' + x[0] + '”', x[1] + (x[1] === 1 ? ' busca' : ' buscas')]);
    });
    if (!linhas.length) box.appendChild(mk('div', 'hint', 'Nada pedido pelo site nos últimos 30 dias.'));
    linhas.forEach(function (l) {
      var r = mk('div', 'sl');
      r.appendChild(mk('span', '', l[0]));
      r.appendChild(mk('b', '', l[1]));
      box.appendChild(r);
    });
    var tot = grauTotais(),
      dica = graus16().filter(function (g) {
        return tot[g] <= 3 && sitePedeGrau(g) >= SITE_PEDE_MIN && !(S.repQ && S.repQ[g] != null);
      })[0];
    if (dica)
      box.appendChild(mk('div', 'hint', '💡 ' + dica.replace('.', ',') + (tot[dica] <= 0 ? ' acabou' : ' está baixo') + ' e ' + sitePedeGrau(dica) + ' pessoas deram ' + dica.replace('.', ',') + ' no teste → sugerido 2 pacotes.'));
    return box;
  }
  // ---- D: cartão "Semana do site" no Início (aparece na segunda; some quando você toca em ×) ----
  function semanaChave() {
    var d = new Date(),
      seg = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7));
    return seg.getFullYear() + '-' + (seg.getMonth() + 1) + '-' + seg.getDate();
  }
  function semanaDados() {
    var j = siteAn(7),
      m = siteAn(30);
    if (!j) return null;
    var dias = (m && m.dias) || {},
      ag = Date.now(),
      a = 0,
      b = 0;
    Object.keys(dias).forEach(function (k) {
      var t = new Date(k + 'T12:00:00').getTime(),
        d = (ag - t) / DAY;
      if (d < 7) a += dias[k];
      else if (d < 14) b += dias[k];
    });
    return {
      vis: j.visitas,
      var: b > 0 ? Math.round(((a - b) / b) * 100) : null,
      ped: j.pedidos,
      car: j.carrinho,
      mochi: j.mochi,
      top: j.pecas && j.pecas[0] ? j.pecas[0][0] : '',
      par: Math.max(0, (j.checkout || 0) - (j.pedidos || 0)),
      ini: ag - 7 * DAY,
      fim: ag
    };
  }
  // Tema do site agora ou o próximo (as mesmas datas do calendário do painel; Halloween fica fora, como no padrão)
  function semanaTema() {
    var ag = Date.now(),
      L = [];
    [new Date().getFullYear(), new Date().getFullYear() + 1].forEach(function (y) {
      var d = function (M, D, f) {
          return new Date(y, M - 1, D, f ? 23 : 0, f ? 59 : 0).getTime();
        },
        n1 = new Date(y, 10, 1),
        bf = 1 + ((4 - n1.getDay() + 7) % 7) + 21 + 1,
        j1 = new Date(y, 5, 1),
        p2 = 1 + ((7 - j1.getDay()) % 7) + 7;
      if (y === 2026) L.push(['Black Friday CDE', d(11, 19), d(11, 22, 1)]);
      L.push(['Black Friday', d(11, bf), d(11, bf, 1)], ['Natal', d(12, 1), d(12, 25, 1)], ['Ano Novo', d(12, 26), d(12, 31, 1)], ['Dia das Mães', d(5, 1), d(5, 15, 1)], ['Dia dos Pais', d(6, 1), d(6, p2, 1)]);
    });
    var at = L.filter(function (x) {
      return x[1] <= ag && ag <= x[2];
    })[0];
    if (at) return at[0] + ' (ativo)';
    var px = L.filter(function (x) {
      return x[1] > ag;
    }).sort(function (a, b) {
      return a[1] - b[1];
    })[0];
    return px ? '— (' + px[0] + ' em ' + Math.ceil((px[1] - ag) / DAY) + ' dias)' : '—';
  }
  function semanaTexto(x) {
    var f = function (t) {
      var d = new Date(t);
      return d.getDate() + '/' + (d.getMonth() + 1);
    };
    return 'Semana do site · ' + f(x.ini) + '–' + f(x.fim) + '\n' + x.vis + ' visitas' + (x.var != null ? ' (' + (x.var >= 0 ? '+' : '') + x.var + '%)' : '') + '\n' + x.ped + ' pedidos · ' + x.car + ' carrinhos · ' + x.mochi + ' testes do Mochi' + (x.top ? '\nMais vista: ' + x.top : '') + '\nCarrinhos parados: ' + x.par + '\nTema: ' + semanaTema();
  }
  function semanaSiteHtml() {
    var seg = new Date().getDay() === 1;
    if (S.semSiteX === semanaChave() || (!seg && S.semSiteV !== semanaChave())) return '';
    var x = semanaDados();
    if (!x) return '';
    S.semSiteV = semanaChave();
    var f = function (t) {
      var d = new Date(t);
      return d.getDate() + '/' + (d.getMonth() + 1);
    };
    return (
      '<section class="card semSite"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b>📊 Semana do site · ' + f(x.ini) + '–' + f(x.fim) + '</b><button type="button" class="mini ghost" data-act="semsite" data-id="x" aria-label="Fechar">×</button></div>' +
      '<div class="semG"><div><b>' + x.vis + '</b><small>visitas' + (x.var != null ? ' (' + (x.var >= 0 ? '+' : '') + x.var + '%)' : '') + '</small></div><div><b>' + x.ped + '</b><small>pedidos</small></div><div><b>' + x.car + '</b><small>carrinhos</small></div><div><b>' + x.mochi + '</b><small>testes do Mochi</small></div></div>' +
      (x.top ? '<div class="sl"><span>🔥 Mais vista</span><b>' + esc(x.top) + '</b></div>' : '') +
      '<div class="sl"><span>🛒 Carrinhos parados</span><b>' + x.par + '</b></div>' +
      '<div class="sl"><span>🎄 Tema ativo</span><b>' + esc(semanaTema()) + '</b></div>' +
      '<div style="display:flex;gap:8px;margin-top:8px"><button type="button" class="mini" data-act="semsite" data-id="ver">Ver no Analisador ›</button><button type="button" class="mini ghost" data-act="semsite" data-id="copiar">Copiar relatório</button></div></section>'
    );
  }
  ACT.semsite = function (id) {
    if (id === 'x') {
      S.semSiteX = semanaChave();
      saveSoon();
      render();
    } else if (id === 'ver') onlPainel('anl');
    else if (id === 'copiar') {
      var x = semanaDados();
      if (!x) return;
      try {
        navigator.clipboard.writeText(semanaTexto(x)).then(function () {
          lfToast('✓ Relatório copiado');
        });
      } catch (e) {}
    }
  };

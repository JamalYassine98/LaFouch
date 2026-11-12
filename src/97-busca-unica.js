  // ===== Busca única no Início (v441, aprovado 05/11/2026) =====
  // Um campo só acha qualquer coisa: peça, cliente, venda, pedido do site ou despesa. Fica no lugar da faixa
  // "N avisos urgentes" (os avisos continuam no sino). Toque num resultado abre a tela certa.
  S._buQ = '';
  var BU_LUPA = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';
  function buscaHtml() {
    return (
      '<div class="buBox"><label class="buIn">' + BU_LUPA +
      '<input id="buQ" type="search" autocomplete="off" enterkeyhint="search" placeholder="Buscar peça, cliente, venda, pedido…" aria-label="Buscar em todo o app" value="' + esc(S._buQ || '') + '"></label>' +
      '<div id="buRes" role="listbox">' + buResHtml(S._buQ || '') + '</div></div>'
    );
  }
  function buTem(txt, q) {
    return nrm(String(txt || '')).indexOf(q) >= 0;
  }
  function buDinheiro(q) {
    var d = String(q).replace(/[^\d]/g, '');
    return d.length >= 3 ? +d : 0;
  }
  function buBusca(q0) {
    var q = nrm(String(q0 || '').trim());
    if (q.length < 2) return null;
    var R = { fun: buFuncoes(q), pec: [], cli: [], ven: [], ped: [], desp: [] },
      vis = {};
    // peças (código, nome, cor)
    (S.items || []).forEach(function (i) {
      if (i.bulk || vis[i.tipo + '|' + i.ref] || R.pec.length >= 5) return;
      if (buTem(i.ref, q) || buTem(pn(i.ref), q) || buTem(i.cor, q)) {
        vis[i.tipo + '|' + i.ref] = 1;
        var est = S.items.reduce(function (a, x) {
          return a + (x.ref === i.ref && x.tipo === i.tipo && x.qty > 0 ? x.qty : 0);
        }, 0);
        R.pec.push({ id: 'pec:' + i.tipo + '|' + i.ref, t: pn(i.ref), s: i.ref + ' · ' + est + (est === 1 ? ' peça' : ' peças'), f: photoOf(i.ref) });
      }
    });
    // clientes (nome, telefone, documento, e-mail)
    (S.clientes || []).forEach(function (c) {
      if (R.cli.length >= 4) return;
      if (buTem(c.nome, q) || buTem(c.tel, q) || buTem(c.ruc, q) || buTem(c.email, q))
        R.cli.push({ id: 'cli:' + c.id, t: c.nome || 'Cliente', s: [c.tel, c.ruc].filter(Boolean).join(' · ') });
    });
    // pedidos do site (cliente, número, token)
    (S.pedidos || []).forEach(function (p) {
      if (R.ped.length >= 4) return;
      if (buTem(p.cli, q) || buTem(p.num, q) || buTem(p.tok, q))
        R.ped.push({ id: 'ped:' + p.id, t: 'Pedido ' + (p.num || '') + (p.cli ? ' · ' + p.cli : ''), s: p.total ? gs(p.total) : '' });
    });
    // vendas (peça ou valor)
    var dv = buDinheiro(q0);
    (S.sales || []).some(function (s) {
      if (R.ven.length >= 4) return true;
      if (buTem(s.ref, q) || buTem(pn(s.ref), q) || (dv && Math.abs((+s.price || 0) - dv) < 1)) {
        var d = new Date(s.ts);
        R.ven.push({ id: 'ven:' + dayKey(s.ts), t: pn(s.ref) + (s.qty > 1 ? ' ×' + s.qty : ''), s: ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear() + ' · ' + gs(s.price) + (s.estorno ? ' · estornada' : '') });
      }
      return false;
    });
    // despesas
    (S.exp || []).forEach(function (e) {
      if (R.desp.length >= 3) return;
      if (buTem(e.nome, q) || buTem(e.cat, q)) R.desp.push({ id: 'desp:' + e.id, t: e.nome, s: gs(e.valor) + (e.dia ? ' · dia ' + e.dia : '') });
    });
    return R;
  }
  // Navegação 3 (aprovado 11/11/2026): a busca única também acha FUNÇÕES do app (telas, abas, ajustes) e leva até elas.
  // [id, nome, onde fica, palavras que também acham]
  var BU_FUN = [
    ['vendas', 'Catálogo (vender)', 'Barra › Catálogo', 'venda vender cobrar balcao carrinho'],
    ['estoque', 'Inventário', 'Barra › Inventário', 'estoque pecas produtos cadastro'],
    ['repo', 'Reposição', 'Inventário › Reposição', 'repor comprar lista de compra pacotes grau leitura o que o site pediu'],
    ['lotes', 'Fornecedores e lotes', 'Inventário › Fornecedores', 'compra lote fornecedor kazwini'],
    ['novo', 'Cadastrar peça nova', 'Inventário › +', 'novo cadastrar adicionar entrada'],
    ['cont', 'Contagem do estoque', 'Inventário › Contagem', 'contar conferir inventario'],
    ['caixa', 'Caixa', 'Barra › Caixa', 'dinheiro gaveta fechar caixa sangria'],
    ['fx', 'Câmbio', 'Início › Câmbio', 'dolar cotacao real guarani troca moeda'],
    ['desp', 'Despesas', 'Início › Despesas', 'gasto conta aluguel luz salario'],
    ['hist', 'Histórico de vendas', 'Início › Histórico', 'vendas antigas dia estorno'],
    ['hoje', 'Resumo do dia', 'Números › Resumo', 'hoje vendido relatorio'],
    ['din', 'Dinheiro e lucro', 'Números › Dinheiro', 'lucro margem financas descontos cupons'],
    ['giro', 'Giro do estoque', 'Números › Giro', 'giro parado vitrine da semana lista de compras'],
    ['parado', 'Estoque parado (vender com saída)', 'Números › Giro › Estoque parado', 'parado encalhado liquidacao saida vender com saida oferta'],
    ['prec', 'Preços e faixas', 'Números › Preços', 'preco faixa piso margem tabela'],
    ['cli', 'Clientes', 'Início › Clientes', 'cliente cadastro telefone'],
    ['ped', 'Pedidos do site', 'Início › Pedidos', 'pedido site reserva pix'],
    ['onl', 'Loja online (painel do site)', 'Início › Loja', 'site painel lafouch.com vitrine destaque'],
    ['msg', 'Mensagens do site', 'Loja › Mensagens', 'contato email mensagem'],
    ['anl', 'Analisador do site', 'Loja › Analisador', 'visitas analise relatorio semana do site'],
    ['tem', 'Temática do site', 'Loja › Temática', 'tema natal black friday maes pais calendario'],
    ['ata', 'Atacado', 'Loja › Atacado', 'atacado lojista revenda mayorista'],
    ['mkt', 'Marketing', 'Início › Marketing', 'divulgar video post instagram'],
    ['est', 'Estúdio de fotos', 'Início › Estúdio', 'foto fundo branco camera 360'],
    ['notif', 'Avisos', 'Sino', 'aviso notificacao alerta'],
    ['ajustes', 'Ajustes', 'Barra › Ajustes', 'configuracao nuvem backup impressora avisos de pedidos senha tema escuro']
  ];
  function buFuncoes(q) {
    var out = [];
    BU_FUN.forEach(function (f) {
      if (out.length >= 4) return;
      var txt = nrm(f[1] + ' ' + f[3]);
      var ok = txt.indexOf(q) >= 0 || q.split(/\s+/).every(function (w) {
        return w.length >= 2 && txt.indexOf(w) >= 0;
      });
      if (ok) out.push({ id: 'fun:' + f[0], t: f[1], s: f[2] });
    });
    return out;
  }
  function buResHtml(q) {
    var R = buBusca(q);
    if (!R) return '';
    var G = [['fun', 'Funções'], ['pec', 'Peças'], ['cli', 'Clientes'], ['ven', 'Vendas'], ['ped', 'Pedidos do site'], ['desp', 'Despesas']],
      h = '',
      n = 0;
    G.forEach(function (g) {
      var l = R[g[0]];
      if (!l.length) return;
      n += l.length;
      h +=
        '<div class="buG">' + g[1] + '</div>' +
        l.map(function (r) {
          return (
            '<button type="button" class="buR" role="option" data-act="buVai" data-id="' + esc(r.id) + '">' +
            (g[0] === 'pec' ? '<span class="buTh">' + (r.f ? '<img src="' + esc(r.f) + '" alt="">' : '') + '</span>' : '') +
            '<span class="buT"><b>' + esc(r.t) + '</b>' + (r.s ? '<small>' + esc(r.s) + '</small>' : '') + '</span><span class="buSe">›</span></button>'
          );
        }).join('');
    });
    return n ? '<div class="buLista">' + h + '</div>' : '<div class="buNada">Nada encontrado para "' + esc(q) + '"</div>';
  }
  document.addEventListener('input', function (ev) {
    if (!ev.target || ev.target.id !== 'buQ') return;
    S._buQ = ev.target.value;
    var r = document.getElementById('buRes');
    if (r) r.innerHTML = buResHtml(S._buQ);
  });
  // abre depois que o toque termina (outros ouvintes do toque fechariam a ficha aberta)
  ACT.buVai = function (id) {
    setTimeout(function () {
      buVai(id);
    }, 0);
  };
  function buVai(id) {
    var p = String(id).split(':'),
      k = p[0],
      v = p.slice(1).join(':');
    S._buQ = '';
    if (k === 'pec') {
      var q = v.split('|');
      S.tipo = q[0];
      S.open = S.todos ? q[0] + '|' + q.slice(1).join('|') : q.slice(1).join('|');
      S.det = true;
      S.lotesView = false;
      setView('estoque');
    } else if (k === 'cli') {
      S.cliSel = +v;
      setView('clientes');
    } else if (k === 'ped') {
      S.pedSel = v;
      setView('ped');
    } else if (k === 'ven') {
      setView('hist');
      if (ACT.opendia) ACT.opendia(v);
    } else if (k === 'desp') setView('desp');
    else if (k === 'fun') {
      if (v === 'repo') {
        S.repoView = true;
        S.lotesView = false;
        setView('estoque');
      } else if (v === 'parado') {
        S.dTab = 'giro';
        S.dfold = S.dfold || {};
        S.dfold.par = true;
        setView('dash');
      } else inicioGo(v);
    }
    window.scrollTo(0, 0);
  }

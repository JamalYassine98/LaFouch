  // ===== Clientes: quem compra de você (nome, telefone, RUC/CI), ligado aos pedidos online. =====
  ICO_D.cli = '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20c0-2.8-1.7-4.8-4-5.6"/>';
  S.clientes = [];
  S.cliNext = 1;
  S.cliQ = '';
  S.cliSel = null; // null = só a lista; 'novo' = cadastro; número = ficha aberta
  var cliDig = function (x) {
    return String(x || '').replace(/\D/g, '');
  };
  var cliNorm = function (x) {
    return String(x || '').trim().toLowerCase();
  };
  // Acha um cliente pelo telefone, pelo RUC/CI ou pelo nome (nesta ordem).
  function cliAchar(nome, tel, ruc, ignorar) {
    var t = cliDig(tel),
      r = cliDig(ruc),
      n = cliNorm(nome),
      lista = S.clientes.filter(function (c) {
        return c.id !== ignorar;
      }),
      pick = function (f) {
        return lista.filter(f)[0] || null;
      };
    return (
      (t.length >= 6 && pick(function (c) { return cliDig(c.tel) === t; })) ||
      (r.length >= 3 && pick(function (c) { return cliDig(c.ruc) === r; })) ||
      (n && !t && !r && pick(function (c) { return cliNorm(c.nome) === n; })) ||
      null
    );
  }
  // Cria ou atualiza o cliente a partir de um pedido.
  function cliGarantir(nome, tel, ruc) {
    if (!String(nome || '').trim() && !cliDig(tel)) return null;
    var c = cliAchar(nome, tel, ruc);
    if (!c) {
      c = { id: S.cliNext++, nome: cap1(String(nome || '').trim()), tel: String(tel || '').trim(), ruc: String(ruc || '').trim(), obs: '', ts: Date.now() };
      S.clientes.push(c);
    } else {
      if (!c.nome && nome) c.nome = cap1(String(nome).trim());
      if (!c.tel && tel) c.tel = String(tel).trim();
    }
    return c;
  }
  // Liga ao cadastro os pedidos que ainda não estão ligados (pedidos novos e antigos).
  function cliSync() {
    S.pedidos.forEach(function (p) {
      if (p.cliId !== undefined) return;
      var c = cliGarantir(p.cli, p.tel, '');
      p.cliId = c ? c.id : 0;
    });
  }
  function cliPedidos(c) {
    return S.pedidos.filter(function (p) {
      return p.cliId === c.id;
    });
  }
  function cliUltimo(c) {
    return cliPedidos(c).reduce(function (a, p) {
      return p.ts > a ? p.ts : a;
    }, c.ts || 0);
  }
  function cliZap(c) {
    var d = cliDig(c.tel);
    if (!d) return '';
    if (d.charAt(0) === '0') d = '595' + d.slice(1);
    return 'https://wa.me/' + d + '?text=' + encodeURIComponent('Olá' + (c.nome ? ', ' + c.nome : '') + '! Aqui é da La Fouch. ');
  }
  function cliAtual() {
    return S.clientes.filter(function (c) {
      return c.id === S.cliSel;
    })[0];
  }
  function cliLista() {
    var q = cliNorm(S.cliQ),
      qd = cliDig(S.cliQ);
    return S.clientes
      .filter(function (c) {
        if (!q) return true;
        return cliNorm(c.nome).indexOf(q) >= 0 || (qd && (cliDig(c.tel).indexOf(qd) >= 0 || cliDig(c.ruc).indexOf(qd) >= 0));
      })
      .sort(function (a, b) {
        return cliUltimo(b) - cliUltimo(a);
      });
  }
  function cliListaHtml() {
    var l = cliLista();
    if (!l.length)
      return '<div class="hint">' + (S.clientes.length ? 'Nenhum cliente com essa busca.' : 'Nenhum cliente ainda. Eles entram sozinhos quando você salva um pedido online, ou toque em "+ Novo cliente".') + '</div>';
    return l
      .map(function (c) {
        var ps = cliPedidos(c),
          tot = ps.reduce(function (a, p) {
            return a + (p.st === 'canc' ? 0 : pedTotal(p));
          }, 0),
          u = cliUltimo(c);
        return (
          '<button type="button" class="card col" data-act="cliab" data-id="' + c.id + '" style="text-align:left;font:inherit;color:inherit;cursor:pointer;gap:2px">' +
          '<b style="font-size:15px">' + esc(c.nome || 'Sem nome') + '</b>' +
          '<span class="hint" style="margin:0">' + esc([c.tel, c.ruc ? 'RUC/CI ' + c.ruc : ''].filter(Boolean).join(' · ') || 'sem telefone') + '</span>' +
          '<span class="hint" style="margin:0">' + ps.length + (ps.length === 1 ? ' pedido' : ' pedidos') + (tot ? ' · ' + gs(tot) + ' pela tabela' : '') + ' · última ' + fd(u) + '</span></button>'
        );
      })
      .join('');
  }
  var CLI_WA = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.5z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1.2-1.6-2-1-.9.7c-.9-.4-1.8-1.3-2.2-2.2l.7-.9-1-2z"/></svg>';
  // Compras feitas no balcão ligadas ao cliente (uma linha por venda/pedido).
  function cliComprasHtml(c) {
    if (!c.id) return '';
    var g = {},
      ord = [];
    S.sales.forEach(function (x) {
      if (x.cliId !== c.id || x.estorno) return;
      var k = x.carrinho || x.id;
      if (!g[k]) {
        g[k] = { ts: x.ts, qty: 0, tot: 0, t: [] };
        ord.push(g[k]);
      }
      g[k].qty += x.qty;
      g[k].tot += x.price || 0;
      g[k].t.push(x.qty + '× ' + esc(x.ref || ''));
    });
    if (!ord.length) return '';
    return (
      '<div class="lbl" style="margin-top:6px">Compras</div>' +
      ord
        .sort(function (a, b) { return b.ts - a.ts; })
        .map(function (v) {
          return '<div class="sl"><span>' + fd(v.ts) + '<small>' + v.t.join(', ') + '</small></span><b>' + gs(v.tot) + '</b></div>';
        })
        .join('')
    );
  }
  function renderClientes() {
    cliSync();
    var el = $('v-clientes');
    if (!el || S.view !== 'clientes') return;
    var h = '<div class="top"><div><h1>Clientes</h1><div class="crumb">Quem compra de você, com telefone e RUC</div></div>' +
      '<div class="tabs"><button class="mini" data-act="clinovo">+ Novo cliente</button></div></div>';
    var c = S.cliSel === 'novo' ? { id: 0, nome: '', tel: '', ruc: '', obs: '' } : cliAtual();
    if (c) {
      var ps = c.id ? cliPedidos(c) : [],
        z = c.id ? cliZap(c) : '';
      h +=
        '<section class="card col" style="gap:12px"><div style="display:flex;align-items:center;justify-content:space-between"><b style="font-size:17px">' + (c.id ? 'Ficha do cliente' : 'Novo cliente') + '</b>' +
        '<button type="button" class="chip" data-act="clifecha" aria-label="' + (c.id ? 'Fechar' : 'Cancelar') + '" style="min-height:40px;width:40px;padding:0;justify-content:center;font-size:20px">×</button></div>' +
        '<input class="in" id="cNome" placeholder="Nome" value="' + esc(c.nome) + '" autocomplete="off">' +
        '<input class="in" id="cTel" type="tel" inputmode="tel" placeholder="Telefone / WhatsApp" value="' + esc(c.tel) + '">' +
        '<input class="in" id="cRuc" inputmode="text" placeholder="RUC ou CI (para a nota fiscal)" value="' + esc(c.ruc) + '" autocomplete="off">' +
        (c.id && !String(c.ruc || '').trim() ? '<div class="note n-warn"><b>Sem RUC</b></div>' : '') +
        '<input class="in" id="cObs" placeholder="Observação (opcional)" value="' + esc(c.obs || '') + '">' +
        '<div class="hint" id="cH" style="margin:0"></div>' +
        '<div class="col" style="gap:12px;margin-top:6px"><button type="button" class="go" data-act="clisave">Salvar</button>' +
        (z ? '<a class="chip" href="' + z + '" target="_blank" rel="noopener" style="color:#25d366;width:100%;min-height:48px;justify-content:center;text-decoration:none;display:flex;align-items:center">' + CLI_WA + '<span style="margin-left:8px">Conversar no WhatsApp</span></a>' : '') +
        (c.id ? '<div style="border-top:1px solid var(--line);margin-top:6px"></div><button type="button" data-act="clidel" style="color:#ff7b7b;background:transparent;border:0;min-height:44px;width:100%;font:inherit;cursor:pointer">' + (S._cliDel === c.id ? 'Remover mesmo?' : 'Remover') + '</button>' : '') +
        '</div>' +
        (ps.length
          ? '<div class="lbl" style="margin-top:6px">Pedidos</div>' +
            ps
              .slice()
              .sort(function (a, b) { return b.ts - a.ts; })
              .map(function (p) {
                var tot = pedTotal(p);
                return '<div class="sl"><span>Pedido ' + p.num + ' · ' + fd(p.ts) + '<small>' + p.itens.map(function (l) { return l.q + '× ' + esc(l.t); }).join(', ') + '</small></span><b>' + (tot ? gs(tot) : '') + '</b></div>';
              })
              .join('')
          : '') +
        cliComprasHtml(c) +
        '</section>';
    }
    h += '<input class="in" id="cliQ" placeholder="Buscar por nome, telefone ou RUC" value="' + esc(S.cliQ) + '" autocomplete="off" aria-label="Buscar cliente">';
    h += '<div class="col" id="cliList" style="gap:10px">' + cliListaHtml() + '</div>';
    el.innerHTML = h;
  }
  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'cliQ') {
      S.cliQ = e.target.value;
      var l = $('cliList');
      if (l) l.innerHTML = cliListaHtml();
    }
  });
  ACT.clinovo = function () {
    S.cliSel = 'novo';
    S._cliDel = 0;
    render();
    window.scrollTo(0, 0);
  };
  ACT.cliab = function (id) {
    S.cliSel = +id;
    S._cliDel = 0;
    render();
    window.scrollTo(0, 0);
  };
  ACT.clifecha = function () {
    S.cliSel = null;
    S._cliDel = 0;
    render();
  };
  ACT.clisave = function () {
    var nome = $('cNome').value.trim(),
      tel = $('cTel').value.trim(),
      ruc = $('cRuc').value.trim(),
      obs = $('cObs').value.trim(),
      cur = S.cliSel === 'novo' ? null : cliAtual();
    if (!nome && !cliDig(tel)) {
      $('cH').textContent = 'Escreva o nome ou o telefone.';
      return;
    }
    var dup = cliAchar(nome, tel, ruc, cur ? cur.id : 0);
    if (dup) {
      $('cH').textContent = 'Já existe um cliente com esse telefone ou RUC: ' + (dup.nome || dup.tel) + '.';
      return;
    }
    if (cur) {
      cur.nome = cap1(nome);
      cur.tel = tel;
      cur.ruc = ruc;
      cur.obs = obs;
    } else {
      S.clientes.push({ id: S.cliNext++, nome: cap1(nome), tel: tel, ruc: ruc, obs: obs, ts: Date.now() });
    }
    S.cliSel = null;
    render();
    window.scrollTo(0, 0);
  };
  ACT.clidel = function () {
    var c = cliAtual();
    if (!c) return;
    if (S._cliDel !== c.id) {
      S._cliDel = c.id;
      render();
      return;
    }
    S.pedidos.forEach(function (p) {
      if (p.cliId === c.id) p.cliId = 0;
    });
    S.clientes = S.clientes.filter(function (x) {
      return x.id !== c.id;
    });
    S._cliDel = 0;
    S.cliSel = null;
    render();
  };

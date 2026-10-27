  // ===== Pedidos: pedidos do catálogo online (site) chegam sozinhos da nuvem; o cliente é cadastrado na hora. =====
  ICO_D.ped = '<path d="M6 6h15l-2 9H8zM6 6L5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>';
  S.pedidos = [];
  S.pedNext = 1;
  S.pedF = 'novo';
  S.pedSel = null;
  S.pedProd = null;
  var PED_ST = [
    ['novo', 'Novo', 'Começar a separar'],
    ['sep', 'Separando', 'Marcar pronto'],
    ['pronto', 'Pronto', 'Marcar entregue'],
    ['ent', 'Entregue', ''],
    ['canc', 'Cancelado', '']
  ];
  function pedNovos() {
    return S.pedidos.filter(function (p) {
      return p.st === 'novo';
    }).length;
  }
  // Hora do pedido novo mais recente.
  function pedUltimo() {
    return S.pedidos.reduce(function (a, p) {
      return p.st === 'novo' && p.ts > a ? p.ts : a;
    }, 0);
  }
  // Valor estimado pela tabela de preços (só das linhas que são modelos do estoque).
  function pedTotal(p) {
    var t = 0;
    p.itens.forEach(function (l) {
      if (l.preco > 0) {
        t += l.preco * l.q;
        return;
      }
      var it = l.ref
        ? S.items.filter(function (i) {
            return i.ref === l.ref;
          })[0]
        : null;
      try {
        if (it) t += tFor(it).price * l.q;
      } catch (e) {}
    });
    return t;
  }
  function pedZap(p) {
    var d = String(p.tel || '').replace(/\D/g, '');
    if (!d) return '';
    if (d.charAt(0) === '0') d = '595' + d.slice(1);
    var tx = 'Olá' + (p.cli ? ', ' + p.cli : '') + '! Sobre o seu pedido nº ' + p.num + ' na La Fouch: ';
    return 'https://wa.me/' + d + '?text=' + encodeURIComponent(tx);
  }
  // ---------- chegada automática: lê os pedidos do site na nuvem, entra na lista e cadastra o cliente ----------
  function pedFv(v) {
    if (!v) return null;
    if ('stringValue' in v) return v.stringValue;
    if ('integerValue' in v) return +v.integerValue;
    if ('doubleValue' in v) return v.doubleValue;
    if ('booleanValue' in v) return v.booleanValue;
    if ('arrayValue' in v) return (v.arrayValue.values || []).map(pedFv);
    if ('mapValue' in v) {
      var o = {},
        f = v.mapValue.fields || {};
      Object.keys(f).forEach(function (k) {
        o[k] = pedFv(f[k]);
      });
      return o;
    }
    return null;
  }
  function pedTxt(v, n) {
    return String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n || 80);
  }
  // Pedido da nuvem → pedido do app (texto limitado e quantidades limpas, pois qualquer pessoa pode escrever lá).
  function pedDoSite(sid, f) {
    var itens = (Array.isArray(f.itens) ? f.itens : []).slice(0, 30).map(function (l) {
      l = l || {};
      return { t: pedTxt(l.nome, 80), ref: pedTxt(l.ref, 30), q: Math.max(1, Math.min(99, Math.round(+l.q) || 1)), cor: pedTxt(l.cor, 30), preco: Math.max(0, Math.round(+l.preco) || 0) };
    });
    itens = itens.filter(function (l) {
      return l.t || l.ref;
    });
    var nome = pedTxt(f.nome, 60),
      tel = pedTxt(f.tel, 24);
    if (!itens.length || !nome) return null;
    var ts = +f.ts > 0 && +f.ts <= Date.now() + 3600000 ? +f.ts : Date.now();
    return { sid: sid, ts: ts, cli: cap1(nome), tel: tel, obs: f.rosto ? 'Formato do rosto: ' + pedTxt(f.rosto, 20) : '', itens: itens, st: 'novo', orig: 'site', cod: pedTxt(f.cod, 8), ate: +f.ate > 0 ? +f.ate : 0, pais: pedTxt(f.pais, 2) };
  }
  // Acha o cliente pelo telefone (ou nome) e, se não existe, cadastra. Devolve o cliente e se foi criado agora.
  function pedCliente(p) {
    var c = cliAchar(p.cli, p.tel, '', 0);
    if (c) return { c: c, novo: false };
    c = { id: S.cliNext++, nome: p.cli, tel: p.tel, ruc: '', obs: 'Veio pelo site', ts: Date.now() };
    S.clientes.push(c);
    return { c: c, novo: true };
  }
  var PED_INFO = { ts: 0, err: '' };
  function pedSync() {
    if (!S.nuvem || !S.nuvem.rt) {
      PED_INFO = { ts: Date.now(), err: 'Sem login na nuvem. Entre em Ajustes → Nuvem para receber os pedidos do site.' };
      return Promise.resolve(0);
    }
    // uma busca que travou (rede ruim, app em segundo plano) não pode bloquear as próximas
    if (S._pedSync && Date.now() - (S._pedT || 0) < 30000) return Promise.resolve(0);
    S._pedSync = true;
    S._pedT = Date.now();
    return nvApi('GET', 'pedidos?pageSize=100')
      .then(function (j) {
        var docs = j.documents || [],
          apagar = [],
          novos = 0;
        docs.forEach(function (d) {
          var sid = d.name.split('/').pop(),
            f = {};
          Object.keys(d.fields || {}).forEach(function (k) {
            f[k] = pedFv(d.fields[k]);
          });
          if (
            S.pedidos.some(function (p) {
              return p.sid === sid;
            })
          ) {
            apagar.push(sid);
            return;
          }
          if (novos >= 30) return;
          var p = pedDoSite(sid, f);
          if (!p) {
            apagar.push(sid);
            return;
          }
          var r = pedCliente(p);
          p.id = S.pedNext;
          p.num = S.pedNext++;
          p.cliId = r.c.id;
          p.cliNovo = r.novo;
          S.pedidos.push(p);
          apagar.push(sid);
          novos++;
        });
        if (novos) {
          S.pedF = 'novo';
          render();
        }
        // só apaga da nuvem depois que o app já gravou o pedido
        if (apagar.length)
          setTimeout(function () {
            apagar.forEach(function (sid) {
              nvApi('DELETE', 'pedidos/' + encodeURIComponent(sid)).catch(function () {});
            });
          }, novos ? 5000 : 0);
        return novos;
      })
      .catch(function (e) {
        PED_INFO = { ts: Date.now(), err: (e && e.status ? e.status + ' · ' : '') + ((e && e.message) || 'falhou') };
        return 0;
      })
      .then(function (n) {
        S._pedSync = false;
        if (!PED_INFO.err || PED_INFO.ts < S._pedT) PED_INFO = { ts: Date.now(), err: '' };
        if (S.view === 'ped') render();
        return n;
      });
  }
  window.__pedSync = pedSync;
  window.__pedDoSite = pedDoSite;
  setTimeout(pedSync, 6000);
  setInterval(pedSync, 120000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) pedSync();
  });
  function pedAch(id) {
    return S.pedidos.filter(function (p) {
      return String(p.id) === String(id);
    })[0];
  }
  function pedCliDe(p) {
    return p.cliId
      ? S.clientes.filter(function (c) {
          return c.id === p.cliId;
        })[0]
      : null;
  }
  function pedAcoes(p) {
    var z = pedZap(p),
      pr = PED_ST.filter(function (s) {
        return s[0] === p.st;
      })[0];
    return (
      '<div class="sel" style="flex-wrap:wrap;margin-top:8px">' +
      (pr && pr[2] ? '<button type="button" class="mini" data-act="pedav" data-id="' + p.id + '">' + pr[2] + '</button>' : '') +
      (z ? '<a class="chip" href="' + z + '" target="_blank" rel="noopener">WhatsApp</a>' : '') +
      (p.orig === 'site' && p.cod && !p.conf && p.st === 'novo' ? '<button type="button" class="mini" data-act="pedconf" data-id="' + p.id + '">✓ Confirmar reserva</button>' : '') +
      (p.st !== 'canc' && p.st !== 'ent' ? '<button type="button" class="chip" data-act="pedcanc" data-id="' + p.id + '">Cancelar pedido</button>' : '') +
      (p.st === 'canc' || p.st === 'ent' ? '<button type="button" class="chip" data-act="peddel" data-id="' + p.id + '">' + (S._pedDel === String(p.id) ? 'Remover?' : 'Remover') + '</button>' : '') +
      '</div>'
    );
  }
  function pedMini(l) {
    var src = l.ref ? photoOf(l.ref) : '';
    return src
      ? '<img src="' + src + '" alt="" style="width:56px;height:56px;border-radius:12px;object-fit:cover;background:#fff;flex:none">'
      : '<span style="width:56px;height:56px;border-radius:12px;background:var(--line);display:grid;place-items:center;flex:none;font-size:11px;opacity:.7">Sem foto</span>';
  }
  function pedStLabel(p) {
    return PED_ST.filter(function (s) {
      return s[0] === p.st;
    })[0][1];
  }
  function pedDetalhe(p) {
    var c = pedCliDe(p),
      n = c ? cliPedidos(c).length : 0,
      z = pedZap(p),
      tot = pedTotal(p),
      h = '<div class="top"><div><h1>Pedido ' + p.num + '</h1><div class="crumb">' + pedStLabel(p) + ' · ' + fd(p.ts) + ' ' + fh(p.ts) + (p.orig === 'site' ? ' · Site' : '') + '</div></div></div>';
    h += '<div class="sel"><button type="button" class="chip" data-act="pedfecha">‹ Pedidos</button></div>';
    h +=
      '<section class="card"><div class="lbl" style="margin:0">Cliente</div><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;margin-top:4px"><b style="font-size:18px">' +
      esc(p.cli || 'Sem nome') +
      '</b>' +
      (p.cliNovo ? '<span class="hint" style="margin:0;color:#f1b6d8">Cadastrado agora</span>' : c ? '<span class="hint" style="margin:0;color:#4ccf8a">Cliente cadastrado</span>' : '') +
      '</div>' +
      (p.tel ? '<div style="margin-top:6px">' + esc(p.tel) + '</div>' : '') +
      (c ? '<div class="hint" style="margin:4px 0 0">' + (n <= 1 ? '1º pedido na La Fouch' : n + 'º pedido na La Fouch') + '</div>' : '') +
      (p.obs ? '<div class="hint" style="margin:4px 0 0">' + esc(p.obs) + '</div>' : '') +
      '<div class="sel" style="flex-wrap:wrap;margin-top:10px">' +
      (z ? '<a class="chip" href="' + z + '" target="_blank" rel="noopener">WhatsApp</a>' : '') +
      (c ? '<button type="button" class="chip" data-act="pedcli" data-id="' + c.id + '">Ficha do cliente</button>' : '') +
      '</div></section>';
    h += '<div class="lbl">Peças do pedido</div>';
    p.itens.forEach(function (l, i) {
      h +=
        '<button type="button" class="card" data-act="pedprod" data-id="' + i + '" style="display:flex;gap:12px;align-items:center;text-align:left;font:inherit;color:inherit;width:100%;cursor:pointer">' +
        pedMini(l) +
        '<span style="flex:1;min-width:0"><b>' + esc(l.t || l.ref) + '</b><span class="hint" style="display:block;margin:2px 0 0">' + esc(l.ref || '') + (l.cor ? ' · ' + esc(l.cor) : '') + '</span><span style="display:block;margin-top:4px">' + l.q + '×' + (l.preco ? ' <b>' + gs(l.preco) + '</b>' : '') + '</span></span><span style="opacity:.5;font-size:20px">›</span></button>';
    });
    h += '<div style="display:flex;justify-content:space-between;align-items:baseline;margin:12px 2px"><span class="hint" style="margin:0">Total</span><b style="font-size:22px">' + (tot ? gs(tot) : '—') + '</b></div>';
    h += pedAcoes(p);
    return h;
  }
  function pedJanelaProd(p) {
    var l = p.itens[S.pedProd];
    if (!l) return '';
    var ref = l.ref,
      its = ref
        ? S.items.filter(function (i) {
            return i.ref === ref;
          })
        : [],
      est = its.reduce(function (a, i) {
        return a + (i.qty > 0 ? i.qty : 0);
      }, 0),
      at = ref ? attrOf(ref) : {},
      src = ref ? photoOf(ref) : '',
      nome = ref && its.length ? pubNome(ref) : l.t;
    return (
      '<div class="modal" role="dialog" aria-modal="true" aria-label="Peça do pedido"><div class="modal-box">' +
      '<div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:18px">' + esc(nome) + '</b><button type="button" class="x" data-act="pedprodx" aria-label="Fechar">×</button></div>' +
      (src ? '<div style="background:#fff;border-radius:14px;padding:8px;text-align:center"><img src="' + src + '" alt="" style="max-width:100%;max-height:240px"></div>' : '') +
      '<div class="hint" style="margin:0">' + esc(ref || '') + (l.cor ? ' · ' + esc(l.cor) : '') + '</div>' +
      '<div class="tgrid g2">' +
      '<div class="card"><div class="lbl" style="margin:0">Neste pedido</div><b>' + l.q + (l.q === 1 ? ' peça' : ' peças') + '</b></div>' +
      '<div class="card"><div class="lbl" style="margin:0">No estoque</div><b>' + (its.length ? est + (est === 1 ? ' peça' : ' peças') : 'Fora do inventário') + '</b></div>' +
      (l.preco ? '<div class="card"><div class="lbl" style="margin:0">Preço no pedido</div><b>' + gs(l.preco) + '</b></div>' : '') +
      (at.material ? '<div class="card"><div class="lbl" style="margin:0">Material</div><b>' + esc(at.material) + '</b></div>' : '') +
      (at.publico ? '<div class="card"><div class="lbl" style="margin:0">Público</div><b>' + esc(at.publico) + '</b></div>' : '') +
      '</div>' +
      (ref && its.length && est < l.q ? '<div class="hint" style="margin:0;color:#e0a21c">Estoque menor que o pedido.</div>' : '') +
      '<button type="button" class="go" data-act="pedprodx">Fechar</button></div></div>'
    );
  }
  function renderPedidos() {
    var el = $('v-ped');
    if (!el || S.view !== 'ped') return;
    var sel = S.pedSel != null ? pedAch(S.pedSel) : null;
    if (S.pedSel != null && !sel) S.pedSel = null;
    if (sel) {
      el.innerHTML = pedDetalhe(sel) + (S.pedProd != null ? pedJanelaProd(sel) : '');
      return;
    }
    var n = { novo: 0, sep: 0, pronto: 0, ent: 0, canc: 0 };
    S.pedidos.forEach(function (p) {
      n[p.st]++;
    });
    var fl = [
        ['novo', 'Novos', n.novo, n.novo ? 'w' : ''],
        ['sep', 'Separando', n.sep, ''],
        ['pronto', 'Prontos', n.pronto, ''],
        ['ent', 'Entregues', n.ent, ''],
        ['canc', 'Cancelados', n.canc, '']
      ],
      h = '<div class="top"><div><h1>Pedidos online</h1><div class="crumb">Pedidos do catálogo online para a loja</div></div></div>';
    h += '<div class="tgrid g5" role="group" aria-label="Situação dos pedidos">';
    fl.forEach(function (f) {
      h += tileHtml('data-act="pedf" data-id="' + f[0] + '"', 'ped', f[1], [String(f[2]), f[3]], 'sm', S.pedF === f[0]);
    });
    h += '</div><div class="hint">Os pedidos chegam sozinhos do site, e o cliente é cadastrado na hora.</div>';
    h +=
      '<div class="hint" style="display:flex;align-items:center;justify-content:space-between;gap:8px;' + (PED_INFO.err ? 'color:var(--bad)' : '') + '"><span>' +
      (PED_INFO.ts ? (PED_INFO.err ? 'Não consegui buscar os pedidos: ' + esc(PED_INFO.err) : 'Última busca às ' + fh(PED_INFO.ts) + '.') : 'Buscando pedidos…') +
      '</span><button type="button" class="mini" data-act="pedver">Verificar agora</button></div>';
    var lista = S.pedidos
      .filter(function (p) {
        return p.st === S.pedF;
      })
      .sort(function (a, b) {
        return b.ts - a.ts;
      });
    if (!lista.length) h += '<div class="hint">' + (S.pedidos.length ? 'Nenhum pedido nesta situação.' : 'Nenhum pedido ainda. Quando um cliente fizer um pedido no site, ele aparece aqui sozinho.') + '</div>';
    lista.forEach(function (p) {
      var tot = pedTotal(p),
        c = pedCliDe(p);
      h +=
        '<section class="card"><div data-act="pedab" data-id="' + p.id + '" style="cursor:pointer"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:15px">Pedido ' + p.num + (p.cli ? ' · ' + esc(p.cli) : '') + (p.orig === 'site' ? ' <span class="hint" style="margin:0;font-size:10px;letter-spacing:.08em;border:1px solid var(--line);border-radius:6px;padding:1px 5px">SITE</span>' : '') + '</b><span class="hint" style="margin:0">' + fd(p.ts) + ' ' + fh(p.ts) + '</span></div>' +
        '<div style="margin-top:6px">' +
        p.itens
          .map(function (l) {
            return '<div class="sl">' + l.q + '× ' + esc(l.t) + '</div>';
          })
          .join('') +
        '</div>' +
        (p.orig === 'site' && p.cod ? '<div class="hint" style="margin:6px 0 0;color:' + (p.conf ? '#4ccf8a' : '#e6c27a') + '">' + (p.conf ? '✓ Reserva confirmada · código ' + esc(p.cod) : '⏳ Aguardando a mensagem do cliente · código ' + esc(p.cod) + (p.ate ? ' · reserva até ' + fh(p.ate) : '')) + '</div>' : '') +
        (c ? '<div class="hint" style="margin:6px 0 0;color:' + (p.cliNovo ? '#f1b6d8' : '#4ccf8a') + '">' + (p.cliNovo ? '✦ Cliente novo, cadastrado automaticamente' : '✓ Cliente cadastrado') + '</div>' : '') +
        (tot ? '<div class="hint" style="margin:6px 0 0">Total: <b>' + gs(tot) + '</b></div>' : '') +
        '<div class="hint" style="margin:6px 0 0;text-align:right">Toque para abrir ›</div></div>' +
        pedAcoes(p) +
        '</section>';
    });
    el.innerHTML = h;
  }
  ACT.pedf = function (id) {
    S.pedF = id;
    render();
  };
  // Confirma a reserva: grava reservas/<id> no Firebase; o site do cliente lê e mostra "Reserva confirmada".
  ACT.pedconf = function (id) {
    var p = pedAch(id);
    if (!p || !p.sid) return;
    p.conf = true;
    render();
    nvApi('PATCH', 'reservas/' + encodeURIComponent(p.sid), JSON.stringify({ fields: { ok: { booleanValue: true }, ts: { integerValue: String(Date.now()) } } }))
      .then(function () {
        say('Reserva confirmada. O cliente já vê no site.');
      })
      .catch(function () {
        say('Marcada aqui, mas não consegui avisar o site (sem internet ou sem permissão no Firebase).');
      });
  };
  ACT.pedver = function () {
    S.pedF = 'novo';
    S.pedSel = null;
    S.pedProd = null;
    setView('ped');
    pedSync();
  };
  ACT.pedab = function (id) {
    S.pedSel = id;
    S.pedProd = null;
    render();
    window.scrollTo(0, 0);
  };
  ACT.pedfecha = function () {
    S.pedSel = null;
    S.pedProd = null;
    render();
  };
  ACT.pedprod = function (i) {
    S.pedProd = +i;
    render();
  };
  ACT.pedprodx = function () {
    S.pedProd = null;
    render();
  };
  ACT.pedcli = function (id) {
    S.cliSel = +id;
    S._cliDel = 0;
    setView('cli');
    window.scrollTo(0, 0);
  };
  ACT.pedav = function (id) {
    var p = pedAch(id);
    if (!p) return;
    p.st = p.st === 'novo' ? 'sep' : p.st === 'sep' ? 'pronto' : 'ent';
    S.pedF = p.st;
    render();
  };
  ACT.pedcanc = function (id) {
    var p = pedAch(id);
    if (!p) return;
    p.st = 'canc';
    S.pedF = 'canc';
    render();
  };
  ACT.peddel = function (id) {
    if (S._pedDel !== String(id)) {
      S._pedDel = String(id);
      render();
      setTimeout(function () {
        if (S._pedDel === String(id)) {
          S._pedDel = null;
          render();
        }
      }, 3500);
      return;
    }
    S._pedDel = null;
    S.pedSel = null;
    S.pedProd = null;
    S.pedidos = S.pedidos.filter(function (p) {
      return String(p.id) !== String(id);
    });
    render();
  };

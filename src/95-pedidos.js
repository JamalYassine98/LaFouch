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
    if (p.total > 0) return p.total;
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
    var pag = f.pag === 'pix' || f.pag === 'alias' ? f.pag : '',
      nac = f.nac === 'py' || f.nac === 'br' || f.nac === 'ar' ? f.nac : '';
    return {
      sid: sid, ts: ts, cli: cap1(nome), tel: tel, itens: itens, st: 'novo', orig: 'site', cod: pedTxt(f.cod, 8), pais: pedTxt(f.pais, 2),
      nac: nac, doc: pedTxt(f.doc, 20), nasc: pedTxt(f.nasc, 10), email: pedTxt(f.email, 80), cidade: pedTxt(f.cidade, 60), end: pedTxt(f.end, 120),
      ent: f.ent === 'delivery' ? 'delivery' : 'loja', endE: pedTxt(f.endE, 160), refE: pedTxt(f.refE, 120),
      pag: pag, pg: pag ? 'pagar' : '', total: Math.max(0, Math.round(+f.total) || 0), brl: pedTxt(f.brl, 12), teste: f.teste === true
    };
  }
  // Acha o cliente pelo telefone (ou nome) e, se não existe, cadastra. Devolve o cliente e se foi criado agora.
  function pedCliente(p) {
    var c = cliAchar(p.cli, p.tel, p.doc, 0);
    if (c) {
      if (!c.ruc && p.doc) c.ruc = p.doc;
      return { c: c, novo: false };
    }
    c = { id: S.cliNext++, nome: p.cli, tel: p.tel, ruc: p.doc, obs: 'Veio pelo site', ts: Date.now(), nac: p.nac, nasc: p.nasc, email: p.email, cidade: p.cidade, end: p.end };
    if (p.teste) c.teste = true;
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
          novos = 0,
          comps = 0;
        docs = docs.map(function (d) {
          var f = {};
          Object.keys(d.fields || {}).forEach(function (k) {
            f[k] = pedFv(d.fields[k]);
          });
          return { sid: d.name.split('/').pop(), f: f };
        });
        // pedidos primeiro, comprovantes depois (o comprovante procura o pedido pelo código)
        docs.sort(function (a, b) {
          return (a.f.tipo === 'comp' ? 1 : 0) - (b.f.tipo === 'comp' ? 1 : 0);
        });
        docs.forEach(function (d) {
          var sid = d.sid,
            f = d.f;
          if (f.tipo === 'comp') {
            var q = S.pedidos.filter(function (x) {
              return x.sid === pedTxt(f.ref, 40);
            })[0];
            if (q && typeof f.img === 'string' && f.img.indexOf('data:image/') === 0 && f.img.length < 900000) {
              q.comp = f.img;
              q.pg = 'comp';
              q.recus = false;
              q.compTs = +f.ts > 0 ? +f.ts : Date.now();
              comps++;
              apagar.push(sid);
            } else if (!q && Date.now() - (+f.ts || 0) > 3 * 86400000) apagar.push(sid);
            return;
          }
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
        if (novos || comps) {
          S.pedF = 'novo';
          render();
        }
        // só apaga da nuvem depois que o app já gravou o pedido
        if (apagar.length)
          setTimeout(function () {
            apagar.forEach(function (sid) {
              nvApi('DELETE', 'pedidos/' + encodeURIComponent(sid)).catch(function () {});
            });
          }, novos || comps ? 5000 : 0);
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
  // ---------- visual dos pedidos: ícones, token de entrega e peças ----------
  var PD_ZAP =
    '<svg class="pdZap" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.2 0 4.26.86 5.82 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.26-8.24zM8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.39 1.01 2.56.12.16 1.75 2.67 4.23 3.74 2.07.9 2.49.72 2.94.68.45-.04 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28-.25-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.77.96-.14.17-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.43h-.47z"/></svg>';
  var PD_OCULOS =
    '<svg viewBox="0 0 60 28" width="70%" fill="none" aria-hidden="true"><path d="M3 8c0-2 1-3 4-3h14c4 0 6 3 6 8 0 6-3 9-8 9H12c-5 0-9-3-9-14zM57 8c0-2-1-3-4-3H39c-4 0-6 3-6 8 0 6 3 9 8 9h8c5 0 9-3 9-14zM27 11q3-3 6 0" stroke="#3a2c3f" stroke-width="3.2" stroke-linecap="round"/></svg>';
  var PD_AB = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  // Token do pedido: LF- + 4 letras/números (sem 0, 1, O, I, L para não confundir). Fica ligado ao nome da cliente.
  function pedTokGera(p) {
    if (p.tok) return p.tok;
    var a = new Uint8Array(4),
      s = '',
      i;
    try {
      crypto.getRandomValues(a);
    } catch (e) {
      for (i = 0; i < 4; i++) a[i] = Math.floor(Math.random() * 256);
    }
    for (i = 0; i < 4; i++) s += PD_AB.charAt(a[i] % PD_AB.length);
    p.tok = 'LF-' + s;
    p.tokNome = p.cli || '';
    p.tokTs = Date.now();
    return p.tok;
  }
  function pedTokZap(p) {
    var d = String(p.tel || '').replace(/\D/g, '');
    if (!d) return '';
    if (d.charAt(0) === '0') d = '595' + d.slice(1);
    var tx =
      'Olá' + (p.cli ? ', ' + p.cli : '') + '! Seu pedido nº ' + p.num + ' está reservado na La Fouch ✓\n' +
      p.itens.reduce(function (a, l) {
        return a + l.q;
      }, 0) + ' peça(s)' + (pedTotal(p) ? ' · ' + gs(pedTotal(p)) : '') + '\n\n' +
      'Seu token de retirada: *' + p.tok + '*\n' +
      'Mostre este token na loja para receber suas peças. Não passe a outra pessoa.';
    return 'https://wa.me/' + d + '?text=' + encodeURIComponent(tx);
  }
  function pedPeqImg(l, cls) {
    var src = l.ref ? photoOf(l.ref) : '';
    return '<span class="pdIm ' + (cls || '') + '">' + (src ? '<img src="' + src + '" alt="">' : PD_OCULOS) + '</span>';
  }
  function pedQtd(p) {
    return p.itens.reduce(function (a, l) {
      return a + l.q;
    }, 0);
  }
  function pedEstado(p) {
    if (p.st === 'canc') return ['Cancelado', 'bad'];
    if (p.st === 'ent') return ['✓ Entregue', 'ok'];
    if (p.st === 'pronto') return ['Pronto para retirar', 'ok'];
    if (p.st === 'sep') return ['Separando', 'ac'];
    if (p.pg === 'pagar') return [p.recus ? 'Pagamento recusado' : '💳 Aguardando pagamento', 'w'];
    if (p.pg === 'comp') return ['🧾 Conferir comprovante', 'w'];
    if (p.pg === 'pago') return ['✓ Pago', 'ok'];
    return ['Novo', 'ac'];
  }
  // Aguardando o pagamento (ainda não dá para separar).
  function pedPagando(p) {
    return p.st === 'novo' && (p.pg === 'pagar' || p.pg === 'comp');
  }
  function pedAcoes(p, lista) {
    var z = pedZap(p),
      pr = PED_ST.filter(function (s) {
        return s[0] === p.st;
      })[0],
      h = '<div class="pdBtns">';
    if (pedPagando(p)) {
      if (lista) h += '<button type="button" class="pdB1" data-act="pedab" data-id="' + p.id + '">' + (p.pg === 'comp' ? 'Conferir comprovante' : 'Ver pedido') + '</button>';
      else if (p.pg === 'comp') h += '<button type="button" class="pdB1" data-act="pedpago" data-id="' + p.id + '">✓ Confirmar pagamento</button><button type="button" class="pdB2 txt" data-act="pedrecus" data-id="' + p.id + '">Recusar</button>';
      else {
        if (p.pag === 'alias') h += '<button type="button" class="pdB1" data-act="pedqr" data-id="' + p.id + '">' + (p.qr ? 'Trocar QR do Itaú' : 'Anexar QR do Itaú') + '</button>';
        h += '<button type="button" class="' + (p.pag === 'alias' ? 'pdB2 txt' : 'pdB1') + '" data-act="pedpago" data-id="' + p.id + '">' + (p.pag === 'alias' ? 'Marcar como pago' : '✓ Confirmar pagamento') + '</button>';
      }
    } else if (pr && pr[2]) h += '<button type="button" class="pdB1" data-act="pedav" data-id="' + p.id + '">' + pr[2] + '</button>';
    else if (p.st === 'canc' || p.st === 'ent')
      h += '<button type="button" class="pdB2 txt" data-act="peddel" data-id="' + p.id + '">' + (S._pedDel === String(p.id) ? 'Remover?' : 'Remover') + '</button>';
    if (z) h += '<a class="pdB2" href="' + z + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + PD_ZAP + '</a>';
    h += '</div>';
    if (!lista && p.st !== 'canc' && p.st !== 'ent')
      h += '<button type="button" class="pdCanc" data-act="pedcanc" data-id="' + p.id + '">Cancelar pedido</button>';
    return h;
  }
  function pedStLabel(p) {
    return PED_ST.filter(function (s) {
      return s[0] === p.st;
    })[0][1];
  }
  function pedPassos(p) {
    var ix = { novo: 0, sep: 1, pronto: 2, ent: 3 }[p.st],
      cur = ix === 0 && p.pg === 'pago' ? 1 : ix,
      nomes = [p.pg ? 'Pagamento' : 'Reserva', 'Separando', 'Pronto', 'Entregue'],
      h = '<div class="pdStep" style="--w:' + (p.st === 'ent' ? 100 : cur * 33.3) + '">';
    nomes.forEach(function (n, i) {
      var d = p.st === 'ent' ? true : i < cur,
        c = !d && i === cur;
      h += '<div class="' + (d ? 'd' : c ? 'c' : '') + '"><i>' + (d ? '✓' : i + 1) + '</i>' + n + '</div>';
    });
    return h + '</div>';
  }
  var PED_NAC = { py: '🇵🇾 Paraguaio · RUC', br: '🇧🇷 Brasileiro · CPF', ar: '🇦🇷 Argentino · DNI' };
  // Pagamento e entrega do pedido do site.
  function pedPagto(p) {
    if (!p.pag && p.ent !== 'delivery') return '';
    var est = pedEstado(p),
      h = '<section class="pdCd"><div class="pdLb">Pagamento</div><div class="pdLin"><div style="flex:1;min-width:0"><b>' +
        (p.pag === 'pix' ? 'PIX' + (p.brl ? ' · R$ ' + esc(p.brl) : '') : p.pag === 'alias' ? 'Itaú (alias)' : 'Sem pagamento online') +
        '</b><div class="pdMt">' + (pedTotal(p) ? gs(pedTotal(p)) : '') + '</div></div>' + (p.pg ? '<span class="pdPill ' + est[1] + '">' + est[0] + '</span>' : '') + '</div>';
    if (p.pg === 'pagar' && p.pag === 'alias')
      h += '<div class="pdMt" style="margin-top:6px">' + (p.qr ? 'QR anexado. O cliente já vê no site.' : 'Gere o QR no app do Itaú (valor do pedido, “QR sin vencimiento” ligado) e anexe aqui.') + '</div>';
    if (p.pag === 'alias' && p.qr) h += '<img src="' + p.qr + '" alt="QR do Itaú" style="display:block;max-width:180px;margin:8px auto 0;border-radius:10px;background:#fff">';
    if (p.comp) h += '<div class="pdMt" style="margin-top:10px">Comprovante enviado' + (p.compTs ? ' às ' + fh(p.compTs) : '') + '</div><img src="' + p.comp + '" alt="Comprovante" style="display:block;max-width:100%;max-height:420px;margin:6px auto 0;border-radius:10px">';
    h += '</section><section class="pdCd"><div class="pdLb">Entrega</div><b>' + (p.ent === 'delivery' ? 'Delivery (transportadora)' : 'Retirada na loja') + '</b>';
    if (p.ent === 'delivery') h += '<div class="pdMt">' + esc(p.endE || '') + (p.refE ? ' · ' + esc(p.refE) : '') + '</div><div class="pdMt">Combine o frete com a cliente no WhatsApp.</div>';
    return h + '</section>';
  }
  function pedDetalhe(p) {
    var c = pedCliDe(p),
      n = c ? cliPedidos(c).length : 0,
      z = pedZap(p),
      tz = p.tok ? pedTokZap(p) : '',
      tot = pedTotal(p),
      est = pedEstado(p),
      h = '<div class="top"><div><h1>Pedido ' + p.num + '</h1><div class="crumb">' + esc(p.cli || 'Sem nome') + ' · ' + fd(p.ts) + ' ' + fh(p.ts) + (p.orig === 'site' ? ' · Site' : '') + (p.teste ? ' · TESTE' : '') + '</div></div></div>';
    h += '<div class="sel"><button type="button" class="chip" data-act="pedfecha">‹ Pedidos</button></div>';
    if (p.st === 'canc') h += '<div class="pdAviso bad">Pedido cancelado.' + (p.tok ? ' O token ' + esc(p.tok) + ' não vale mais.' : '') + '</div>';
    else h += pedPassos(p);
    if (p.tok && p.st !== 'canc') {
      h +=
        '<div class="pdTok ' + (p.st === 'ent' ? 'usado' : '') + '"><div class="pdLb">Token de entrega · ' + esc(p.tokNome || p.cli || '') + '</div>' +
        '<div class="pdTn">' + esc(p.tok) + '</div>' +
        '<div class="pdSub">' + (p.st === 'ent' ? 'Token usado na entrega.' : 'Só quem tem este token retira as peças. Vale para o pedido ' + p.num + '.') + '</div></div>';
      if (p.st !== 'ent')
        h +=
          '<div class="pdBtns" style="margin:0 0 12px">' +
          (tz ? '<a class="pdB3" href="' + tz + '" target="_blank" rel="noopener">' + PD_ZAP + ' Enviar token à cliente</a>' : '') +
          '<button type="button" class="pdB2" data-act="pedcopia" data-id="' + p.id + '" aria-label="Copiar token">⧉</button></div>';
    }
    h +=
      '<section class="pdCd"><div class="pdLb">Cliente</div><div class="pdLin"><span class="pdAv">' + esc((p.cli || '?').charAt(0).toUpperCase()) + '</span><div><b>' +
      esc(p.cli || 'Sem nome') + '</b><div class="pdMt">' + (p.tel ? esc(p.tel) : 'Sem telefone') +
      (c ? ' · ' + (n <= 1 ? '1º pedido na La Fouch' : n + 'º pedido na La Fouch') : '') + '</div></div>' +
      (p.cliNovo ? '<span class="pdPill ac">Nova</span>' : c ? '<span class="pdPill ok">Cadastrada</span>' : '') + '</div>' +
      (p.nac ? '<div class="pdMt" style="margin-top:6px">' + PED_NAC[p.nac] + (p.doc ? ' ' + esc(p.doc) : '') + (p.nasc ? ' · nasc. ' + esc(p.nasc) : '') + '</div>' : '') +
      (p.cidade || p.email || p.end ? '<div class="pdMt">' + esc([p.cidade, p.email, p.end].filter(Boolean).join(' · ')) + '</div>' : '') +
      (c ? '<div class="sel" style="margin-top:10px"><button type="button" class="chip" data-act="pedcli" data-id="' + c.id + '">Ficha do cliente</button></div>' : '') +
      '</section>';
    h += pedPagto(p);
    h += '<section class="pdCd"><div class="pdLb">Peças do pedido</div>';
    p.itens.forEach(function (l, i) {
      h +=
        '<button type="button" class="pdRow" data-act="pedprod" data-id="' + i + '">' + pedPeqImg(l, 'g') +
        '<span style="flex:1;min-width:0"><b>' + esc(l.t || l.ref) + '</b><span class="pdMt" style="display:block">' + esc(l.ref || '') + (l.cor ? ' · ' + esc(l.cor) : '') + ' · ' + l.q + '×</span></span>' +
        (l.preco ? '<b>' + gs(l.preco * l.q) + '</b>' : '') + '</button>';
    });
    h += '<div class="pdTot"><span class="pdMt">Total</span><b>' + (tot ? gs(tot) : '—') + '</b></div></section>';
    h += pedAcoes(p, false);
    return h;
  }
  // Janela de conferência do token (entrega).
  function pedJanelaTok(p) {
    return (
      '<div class="pdOv" role="dialog" aria-modal="true" aria-label="Conferir o token"><div class="pdSh"><div class="pdAl"></div>' +
      '<b style="font-size:20px">Conferir o token</b><div class="pdMt" style="margin-top:4px">Peça o token a ' + esc(p.cli || 'cliente') + ' e digite aqui para entregar o pedido ' + p.num + '.</div>' +
      '<label class="pdKey" id="pdKey"><span class="pdPre">LF-</span><b></b><b></b><b></b><b></b>' +
      '<input id="pdTokIn" maxlength="7" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Token"></label>' +
      '<div class="pdErro" id="pdErro" aria-live="polite"></div>' +
      '<div class="pdBtns" style="margin-top:14px"><button type="button" class="pdB2 txt" data-act="pedtokx" style="flex:none;width:110px">Voltar</button>' +
      '<button type="button" class="pdB1" id="pdEnt" data-act="pedentrega" data-id="' + p.id + '" disabled>Entregar</button></div></div></div>'
    );
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
      el.innerHTML = pedDetalhe(sel) + (S.pedProd != null ? pedJanelaProd(sel) : '') + (S.pedTok != null && String(S.pedTok) === String(sel.id) ? pedJanelaTok(sel) : '');
      if (S.pedTok != null)
        setTimeout(function () {
          var i = $('pdTokIn');
          if (i && document.activeElement !== i) i.focus();
        }, 60);
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
      h =
        '<div class="top"><div><h1>Pedidos online</h1><div class="crumb">' +
        (PED_INFO.ts ? (PED_INFO.err ? '<span style="color:var(--bad)">Não consegui buscar os pedidos: ' + esc(PED_INFO.err) + '</span>' : 'Última busca às ' + fh(PED_INFO.ts)) : 'Buscando pedidos…') +
        ' · <button type="button" class="pdLink" data-act="pedver">Verificar agora</button>' +
        (S.pedidos.some(function (p) { return p.teste; }) ? ' · <button type="button" class="pdLink" data-act="pedteste">' + (S._pedTst ? 'Apagar os testes? Toque de novo' : 'Apagar pedidos de teste') + '</button>' : '') +
        '</div></div></div>';
    h += '<div class="pdSeg" role="group" aria-label="Situação dos pedidos">';
    fl.forEach(function (f) {
      h +=
        '<button type="button" class="' + (S.pedF === f[0] ? 'on ' : '') + (f[3] || '') + '" data-act="pedf" data-id="' + f[0] + '" aria-pressed="' + (S.pedF === f[0]) + '">' + f[1] + (f[2] ? ' <b>' + f[2] + '</b>' : '') + '</button>';
    });
    h += '</div>';
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
        est = pedEstado(p),
        q = pedQtd(p);
      h +=
        '<section class="pdCard"><div data-act="pedab" data-id="' + p.id + '" style="cursor:pointer"><div class="pdLin"><span class="pdAv">' + esc((p.cli || '?').charAt(0).toUpperCase()) + '</span>' +
        '<div style="min-width:0;flex:1"><div class="pdNm">' + esc(p.cli || 'Sem nome') + '</div><div class="pdMt">Pedido ' + p.num + ' · ' + fd(p.ts) + ' ' + fh(p.ts) + (p.orig === 'site' ? ' · Site' : '') + (p.teste ? ' · <b>TESTE</b>' : '') + (p.ent === 'delivery' ? ' · Delivery' : '') + '</div></div>' +
        '<span class="pdPill ' + est[1] + '">' + est[0] + '</span></div>' +
        '<div class="pdTh">' +
        p.itens
          .slice(0, 3)
          .map(function (l) {
            return pedPeqImg(l, '');
          })
          .join('') +
        (p.itens.length > 3 ? '<span class="pdMais">+' + (p.itens.length - 3) + '</span>' : '') +
        '<span class="pdTt"><small>' + q + (q === 1 ? ' peça' : ' peças') + '</small><b>' + (tot ? gs(tot) : '—') + '</b></span></div>' +
        (p.tok && p.st !== 'canc' && p.st !== 'ent' ? '<div class="pdCod">Token <b>' + esc(p.tok) + '</b></div>' : '') +
        '</div>' +
        pedAcoes(p, true) +
        '</section>';
    });
    el.innerHTML = h;
  }
  ACT.pedf = function (id) {
    S.pedF = id;
    render();
  };
  // Avisa o site do cliente: grava só os campos pedidos em reservas/<id>.
  function pedReserva(p, campos) {
    var f = {},
      m = Object.keys(campos)
        .map(function (k) {
          f[k] = typeof campos[k] === 'boolean' ? { booleanValue: campos[k] } : { stringValue: String(campos[k]) };
          return 'updateMask.fieldPaths=' + k;
        })
        .join('&');
    return nvApi('PATCH', 'reservas/' + encodeURIComponent(p.sid) + '?' + m, JSON.stringify({ fields: f }));
  }
  function pedFalhaSite() {
    say('Marcado aqui, mas não consegui avisar o site (sem internet ou sem permissão no Firebase).');
  }
  // Pagamento confirmado: gera o token e o site da cliente mostra "Pagamento confirmado".
  ACT.pedpago = function (id) {
    var p = pedAch(id);
    if (!p || !p.sid) return;
    p.pg = 'pago';
    p.recus = false;
    pedTokGera(p);
    S.pedSel = p.id;
    render();
    window.scrollTo(0, 0);
    pedReserva(p, { pago: true, tok: p.tok })
      .then(function () {
        say('Pagamento confirmado. O cliente já vê no site.');
      })
      .catch(pedFalhaSite);
  };
  // Comprovante recusado: volta a aguardar o pagamento e o site pede outro comprovante.
  ACT.pedrecus = function (id) {
    var p = pedAch(id);
    if (!p || !p.sid) return;
    p.pg = 'pagar';
    p.recus = true;
    p.comp = '';
    render();
    pedReserva(p, { recusado: true })
      .then(function () {
        say('Comprovante recusado. O cliente vai enviar outro.');
      })
      .catch(pedFalhaSite);
  };
  // Foto do QR gerado no app do Itaú → JPEG pequeno → o site da cliente mostra no pagamento.
  function pedImg(file) {
    return normFile(file)
      .then(function (f) {
        return createImageBitmap(f);
      })
      .then(function (bm) {
        var k = Math.min(1, 900 / Math.max(bm.width, bm.height)),
          c = mkCanvas(Math.round(bm.width * k), Math.round(bm.height * k));
        c.getContext('2d').drawImage(bm, 0, 0, c.width, c.height);
        return c.toDataURL('image/jpeg', 0.8);
      });
  }
  ACT.pedqr = function (id) {
    var p = pedAch(id),
      i = document.createElement('input');
    if (!p || !p.sid) return;
    i.type = 'file';
    i.accept = 'image/*';
    i.onchange = function () {
      var f = i.files && i.files[0];
      if (!f) return;
      pedImg(f)
        .then(function (d) {
          p.qr = d;
          render();
          return pedReserva(p, { qr: d });
        })
        .then(function () {
          say('QR anexado. O cliente já vê no site.');
        })
        .catch(function () {
          say('Não consegui enviar o QR ao site. Tente de novo.');
        });
    };
    i.click();
  };
  // Apaga os pedidos de teste (e os clientes que só existem por causa deles).
  ACT.pedteste = function () {
    if (!S._pedTst) {
      S._pedTst = true;
      render();
      setTimeout(function () {
        S._pedTst = false;
        render();
      }, 3500);
      return;
    }
    S._pedTst = false;
    S.pedidos = S.pedidos.filter(function (p) {
      return !p.teste;
    });
    S.clientes = S.clientes.filter(function (c) {
      return !c.teste || cliPedidos(c).length;
    });
    S.pedSel = null;
    render();
    say('Pedidos de teste apagados.');
  };
  // Copia o token do pedido.
  ACT.pedcopia = function (id) {
    var p = pedAch(id);
    if (!p || !p.tok) return;
    try {
      navigator.clipboard.writeText(p.tok).then(
        function () {
          say('Token ' + p.tok + ' copiado.');
        },
        function () {
          say('Token: ' + p.tok);
        }
      );
    } catch (e) {
      say('Token: ' + p.tok);
    }
  };
  // Fecha a janela do token sem entregar.
  ACT.pedtokx = function () {
    S.pedTok = null;
    render();
  };
  // Entrega: só fecha o pedido se o token digitado for o do pedido.
  ACT.pedentrega = function (id) {
    var p = pedAch(id),
      i = $('pdTokIn');
    if (!p || p.st === 'canc' || !i) return;
    var v = String(i.value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (v.indexOf('LF') === 0 && v.length > 4) v = v.slice(2);
    if (p.tok && v === p.tok.slice(3)) {
      p.st = 'ent';
      p.entTs = Date.now();
      p.comp = '';
      p.qr = '';
      S.pedTok = null;
      S.pedF = 'ent';
      render();
      say('Token conferido. Pedido entregue.');
    } else {
      var k = $('pdKey'),
        er = $('pdErro');
      if (er) er.textContent = 'Este token não é o do pedido ' + p.num + '. Confira com a cliente.';
      if (k) {
        k.classList.remove('erra');
        void k.offsetWidth;
        k.classList.add('erra');
      }
      vibrar(40);
    }
  };
  document.addEventListener('input', function (e) {
    if (!e.target || e.target.id !== 'pdTokIn') return;
    var v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (v.indexOf('LF') === 0 && v.length > 4) v = v.slice(2);
    v = v.slice(0, 4);
    var bx = document.querySelectorAll('#pdKey b'),
      k;
    for (k = 0; k < 4; k++) {
      bx[k].textContent = v.charAt(k);
      bx[k].className = k < v.length ? 'f' : k === v.length ? 'a' : '';
    }
    var b = $('pdEnt');
    if (b) b.disabled = v.length < 4;
    var er = $('pdErro');
    if (er) er.textContent = '';
  });
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
    S.pedTok = null;
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
    if (p.st === 'pronto') {
      if (p.tok) {
        S.pedSel = p.id;
        S.pedTok = p.id;
        render();
        return;
      }
      p.st = 'ent';
    } else {
      if (p.st === 'novo') pedTokGera(p);
      p.st = p.st === 'novo' ? 'sep' : 'pronto';
    }
    S.pedF = p.st;
    render();
  };
  ACT.pedcanc = function (id) {
    var p = pedAch(id);
    if (!p) return;
    p.st = 'canc';
    S.pedTok = null;
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

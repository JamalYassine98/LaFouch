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
  // Telefone comparável: sem pontuação, sem +595 e sem o 0 do começo (0981 555 111 = +595 981 555 111).
  var cliTel = function (x) {
    var d = cliDig(x);
    if (d.indexOf('595') === 0 && d.length > 9) d = d.slice(3);
    return d.replace(/^0+/, '');
  };
  // Nacionalidade: paraguaio (documento = RUC) ou estrangeiro (documento = CI/CPF, nunca nota fiscal).
  // O documento fica sempre em c.ruc; o que diz se é RUC é c.nac. Do site vêm 'br'/'ar' (estrangeiros); do balcão, 'py' ou 'ex'.
  var cliEstr = function (c) {
    return !!c && (c.nac === 'ex' || c.nac === 'br' || c.nac === 'ar');
  };
  var cliDocLbl = function (c) {
    return cliEstr(c) ? 'CI/CPF' : 'RUC';
  };
  var CLI_DOC = { py: ['RUC', '80012345-6'], ex: ['CI/CPF', 'Número do documento'] };
  // Seletor Paraguaio | Estrangeiro + campo do documento, que troca de nome sozinho (pre = prefixo dos ids).
  function cliDocHtml(pre, c) {
    var n = cliEstr(c) ? 'ex' : 'py',
      d = CLI_DOC[n],
      b = function (k, t) {
        return '<button type="button" class="cb3' + (k === n ? ' on' : '') + '" data-act="clinac" data-id="' + pre + '|' + k + '">' + t + '</button>';
      };
    return (
      '<div class="catbar3 cliNac" id="' + pre + 'Nac" data-nac="' + n + '" role="group" aria-label="Nacionalidade">' + b('py', 'Paraguaio') + b('ex', 'Estrangeiro') + '</div>' +
      '<div class="docF"><span class="docL" id="' + pre + 'DocL">' + d[0] + '</span><input class="in" id="' + pre + 'Ruc" placeholder="' + d[1] + '" value="' + esc((c && c.ruc) || '') + '" autocomplete="off" aria-labelledby="' + pre + 'DocL"></div>'
    );
  }
  // Troca no lugar (sem redesenhar a tela): pílula, nome do campo e exemplo.
  ACT.clinac = function (arg) {
    var p = String(arg).split('|'),
      box = $(p[0] + 'Nac'),
      l = $(p[0] + 'DocL'),
      inp = $(p[0] + 'Ruc'),
      d = CLI_DOC[p[1]];
    if (!box || !d || box.dataset.nac === p[1]) return;
    box.dataset.nac = p[1];
    box.querySelectorAll('.cb3').forEach(function (x) {
      x.classList.toggle('on', x.getAttribute('data-id') === arg);
    });
    if (l) {
      l.classList.add('swap');
      setTimeout(function () {
        l.textContent = d[0];
        l.classList.remove('swap');
      }, REDUCED ? 0 : 160);
    }
    if (inp) inp.placeholder = d[1];
  };
  // Nacionalidade escolhida no formulário; estrangeiro do site mantém 'br'/'ar'.
  function cliNacLida(pre, cur) {
    var box = $(pre + 'Nac'),
      n = box ? box.dataset.nac : 'py';
    if (n === 'ex') return cliEstr(cur) ? cur.nac : 'ex';
    return 'py';
  }
  // Acha um cliente pelo telefone, pelo RUC/CI, pelo e-mail ou pelo nome (nesta ordem).
  function cliAchar(nome, tel, ruc, ignorar, email) {
    var t = cliTel(tel),
      em = cliNorm(email),
      r = cliDig(ruc),
      n = cliNorm(nome),
      lista = S.clientes.filter(function (c) {
        return c.id !== ignorar;
      }),
      pick = function (f) {
        return lista.filter(f)[0] || null;
      };
    return (
      (t.length >= 6 && pick(function (c) { return cliTel(c.tel) === t; })) ||
      (em.indexOf('@') > 0 && pick(function (c) { return cliNorm(c.email) === em; })) ||
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
        return cliNorm(c.nome).indexOf(q) >= 0 || cliNorm(c.email).indexOf(q) >= 0 || (qd && (cliDig(c.tel).indexOf(qd) >= 0 || cliDig(c.ruc).indexOf(qd) >= 0));
      })
      .sort(function (a, b) {
        return cliUltimo(b) - cliUltimo(a);
      });
  }
  // Selos da lista: origem, novo (48 h) e fiel (3 compras ou mais, no site e no balcão).
  function cliCompras(c, ps) {
    var n = ps.filter(function (p) { return p.st !== 'canc'; }).length,
      v = {};
    S.sales.forEach(function (x) {
      if (x.cliId === c.id && !x.estorno) v[x.carrinho || x.id] = 1;
    });
    return n + Object.keys(v).length;
  }
  function cliEtiquetas(c, ps) {
    var h = '';
    if (c.auto && Date.now() - (c.ts || 0) < 48 * 3600000) h += ' <span class="pdPill ac" style="font-size:10px">NOVO</span>';
    h += ' <span class="pdPill" style="font-size:10px">' + (c.orig === 'site' || ps.length ? 'SITE' : 'BALCÃO') + '</span>';
    if (cliCompras(c, ps) >= 3) h += ' <span class="pdPill ok" style="font-size:10px">FIEL</span>';
    if (c.dup) h += ' <span class="pdPill warn" style="font-size:10px">DUPLICADO?</span>';
    return h;
  }
  function cliListaHtml() {
    var l = cliLista();
    if (!l.length)
      return S.clientes.length ? '<div class="hint">Nenhum cliente com essa busca.</div>' : lfVazioHtml('<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>', 'Nenhum cliente ainda', 'Eles entram sozinhos quando você salva um pedido online, ou toque em “+ Novo cliente”.');
    return l
      .map(function (c) {
        var ps = cliPedidos(c),
          tot = ps.reduce(function (a, p) {
            return a + (p.st === 'canc' ? 0 : pedTotal(p));
          }, 0),
          u = cliUltimo(c),
          et = cliEtiquetas(c, ps);
        return (
          '<button type="button" class="card col" data-act="cliab" data-id="' + c.id + '" style="text-align:left;font:inherit;color:inherit;cursor:pointer;gap:2px">' +
          '<b style="font-size:15px">' + esc(c.nome || 'Sem nome') + et + '</b>' +
          '<span class="hint" style="margin:0">' + esc([c.tel, c.email, c.ruc ? cliDocLbl(c) + ' ' + c.ruc : ''].filter(Boolean).join(' · ') || 'sem telefone') + '</span>' +
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
    var h = '<div class="top"><div><h1>Clientes</h1><div class="crumb">Quem compra de você, com telefone e documento</div></div>' +
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
        '<input class="in" id="cEmail" type="email" inputmode="email" placeholder="E-mail (opcional, para avisos)" value="' + esc(c.email || '') + '" autocomplete="off">' +
        cliDocHtml('c', c) +
        '<select class="in selAl" id="cTab" aria-label="Tabela de preço do cliente"><option value="">Tabela de preço: padrão (Público)</option>' + tabLista().filter(function (T) { return !T.pub; }).map(function (T) { return '<option value="' + T.id + '"' + (c.tab === T.id ? ' selected' : '') + '>' + esc(T.nome) + '</option>'; }).join('') + '</select>' +
        cliDupHtml(c) +
        '<input class="in" id="cObs" placeholder="Observação (opcional)" value="' + esc(c.obs || '') + '">' +
        '<div class="hint" id="cH" style="margin:0"></div>' +
        '<div class="col" style="gap:12px;margin-top:6px"><button type="button" class="go" data-act="clisave">Salvar</button>' +
        (c.id && (z || c.email) ? '<button type="button" class="go" data-act="cliavisa">Avisar cliente</button>' : '') +
        (c.id && c.aviso ? '<div class="hint" style="margin:0">Último aviso: ' + esc(c.aviso.canal) + ' · ' + esc(c.aviso.modelo) + ' · ' + fd(c.aviso.ts) + ' ' + fh(c.aviso.ts) + '</div>' : '') +
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
    // com o Novo cliente ou a ficha aberta, a busca e a lista ficam escondidas (voltam ao Salvar ou ×)
    if (!c) {
      h += '<input class="in" id="cliQ" placeholder="Buscar por nome, telefone ou documento" value="' + esc(S.cliQ) + '" autocomplete="off" aria-label="Buscar cliente">';
      h += '<div class="col" id="cliList" style="gap:10px">' + cliListaHtml() + '</div>';
    }
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
      email = $('cEmail') ? $('cEmail').value.trim() : '',
      obs = $('cObs').value.trim(),
      tabc = $('cTab') ? $('cTab').value : '',
      cur = S.cliSel === 'novo' ? null : cliAtual();
    if (!nome && !cliDig(tel)) {
      $('cH').textContent = 'Escreva o nome ou o telefone.';
      return;
    }
    var dup = cliAchar(nome, tel, ruc, cur ? cur.id : 0, email);
    if (dup) {
      $('cH').textContent = 'Já existe um cliente com esse telefone ou documento: ' + (dup.nome || dup.tel) + '.';
      return;
    }
    var nac = cliNacLida('c', cur);
    if (cur) {
      cur.nome = cap1(nome);
      cur.tel = tel;
      cur.ruc = ruc;
      cur.nac = nac;
      cur.email = email;
      cur.obs = obs;
      cur.tab = tabc;
    } else {
      S.clientes.push({ id: S.cliNext++, nome: cap1(nome), tel: tel, ruc: ruc, nac: nac, email: email, obs: obs, ts: Date.now(), orig: 'balcao', tab: tabc });
    }
    S.cliSel = null;
    render();
    window.scrollTo(0, 0);
  };
  // Possível duplicado: o pedido criou um cliente parecido com outro. Juntar ou manter separados.
  function cliDupHtml(c) {
    var o = c.dup && S.clientes.filter(function (x) { return x.id === c.dup; })[0];
    if (!o) return '';
    return '<div class="note n-warn"><b>Possível duplicado</b><br>' + esc(c.nome || 'Este cliente') + ' parece igual a ' + esc(o.nome || o.tel || 'outro cadastro') + '.<div style="display:flex;gap:8px;margin-top:8px"><button type="button" class="mini" data-act="clijuntar">Juntar</button><button type="button" class="mini ghost" data-act="climanter">Manter separados</button></div></div>';
  }
  ACT.clijuntar = function () {
    var c = cliAtual(),
      o = c && S.clientes.filter(function (x) { return x.id === c.dup; })[0];
    if (!c || !o) return;
    ['nome', 'tel', 'ruc', 'email', 'cidade', 'end', 'nasc', 'nac'].forEach(function (k) {
      if (!o[k] && c[k]) o[k] = c[k];
    });
    S.pedidos.forEach(function (p) { if (p.cliId === c.id) p.cliId = o.id; });
    S.sales.forEach(function (x) { if (x.cliId === c.id) x.cliId = o.id; });
    S.clientes = S.clientes.filter(function (x) { return x.id !== c.id; });
    S.cliSel = o.id;
    delete o.dup;
    lfaToast('<b>Clientes juntados</b><br>' + esc(o.nome || ''));
    render();
  };
  ACT.climanter = function () {
    var c = cliAtual();
    if (!c) return;
    delete c.dup;
    render();
  };
  // Avisar cliente: modelo pronto, por WhatsApp ou e-mail (abre o app de mensagens/e-mail já preenchido).
  var CLI_MOD = [
    ['sep', 'Separado', 'Seu pedido está separado', 'separamos as suas peças. Pode retirar na La Fouch (Ciudad del Este) quando quiser.'],
    ['pro', 'Pronto', 'Seu pedido está pronto', 'o seu pedido está pronto para retirada na La Fouch (Ciudad del Este).'],
    ['che', 'Chegou', 'Chegou o que você procurava', 'chegou o produto que você procurava. Quer que eu separe para você?']
  ];
  function cliMsg(c, m) {
    var nome = (c.nome || '').split(' ')[0];
    return 'Oi' + (nome ? ' ' + nome : '') + ', ' + m[3] + ' Qualquer dúvida, é só responder. La Fouch · Tudo em Óculos';
  }
  function cliAvisoSheet() {
    var c = cliAtual();
    if (!c) return;
    var z = cliDig(c.tel).length >= 6,
      e = String(c.email || '').indexOf('@') > 0,
      canal = S._avCanal && ((S._avCanal === 'zap' && z) || (S._avCanal === 'mail' && e)) ? S._avCanal : z ? 'zap' : 'mail',
      mi = S._avMod >= 0 && S._avMod < CLI_MOD.length ? S._avMod : 0,
      m = CLI_MOD[mi],
      txt = cliMsg(c, m);
    S._avCanal = canal;
    S._avMod = mi;
    var h =
      '<div style="padding:4px 2px"><h2 style="margin:0 0 10px;font-size:18px">Avisar ' + esc(c.nome || 'cliente') + '</h2>' +
      '<div class="chips" style="display:flex;gap:6px;margin-bottom:8px">' +
      '<button type="button" class="chip' + (canal === 'zap' ? ' on' : '') + '" data-act="clicanal" data-id="zap"' + (z ? '' : ' disabled') + '>WhatsApp</button>' +
      '<button type="button" class="chip' + (canal === 'mail' ? ' on' : '') + '" data-act="clicanal" data-id="mail"' + (e ? '' : ' disabled') + '>E-mail</button></div>' +
      '<div class="chips" style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">' +
      CLI_MOD.map(function (x, i) { return '<button type="button" class="chip' + (i === mi ? ' on' : '') + '" data-act="climod" data-id="' + i + '">' + x[1] + '</button>'; }).join('') + '</div>' +
      (canal === 'mail' ? '<div class="hint" style="margin:0 0 4px"><b>Assunto:</b> ' + esc(m[2]) + '</div>' : '') +
      '<div class="note" style="white-space:pre-wrap">' + esc(txt) + '</div>' +
      '<div style="display:flex;gap:8px;margin-top:12px"><button type="button" class="go" data-act="cliabrir">Abrir ' + (canal === 'zap' ? 'WhatsApp' : 'e-mail') + '</button><button type="button" class="mini ghost" data-act="cliavfecha">Fechar</button></div></div>';
    lfaAbre('cliAvSh', h);
  }
  ACT.cliavisa = function () { cliAvisoSheet(); };
  ACT.clicanal = function (id) { S._avCanal = id; cliAvisoSheet(); };
  ACT.climod = function (id) { S._avMod = +id; cliAvisoSheet(); };
  ACT.cliavfecha = function () { lfaFecha('cliAvSh'); };
  ACT.cliabrir = function () {
    var c = cliAtual();
    if (!c) return;
    var m = CLI_MOD[S._avMod || 0],
      txt = cliMsg(c, m),
      url;
    if (S._avCanal === 'mail') url = 'mailto:' + encodeURIComponent(c.email) + '?subject=' + encodeURIComponent(m[2]) + '&body=' + encodeURIComponent(txt);
    else {
      var d = cliDig(c.tel);
      if (d.charAt(0) === '0') d = '595' + d.slice(1);
      url = 'https://wa.me/' + d + '?text=' + encodeURIComponent(txt);
    }
    c.aviso = { canal: S._avCanal === 'mail' ? 'E-mail' : 'WhatsApp', modelo: m[1], ts: Date.now() };
    saveSoon();
    lfaFecha('cliAvSh');
    window.open(url, '_blank');
    render();
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

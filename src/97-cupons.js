  // ===== Cupons e cartões virtuais (S174 v1+v2+v3, aprovados 11/11/2026) =====
  // O mesmo código vale no site e no caixa; tudo é conferido no Firebase (função "cupom").
  // Caixa: campo "Código de desconto" no pedido (nunca abaixo do piso) e, depois da venda, "Entregar cartão" (WhatsApp ou QR).
  // Clientes › Cartões: tipos, teto do mês, o que o app fez sozinho, proteções, VIP, cupom do evento (simulação + post/story).
  S.cupFila = []; // chamadas que falharam (sem internet): tenta de novo sozinho
  S.cupTipos = {}; // código → tipo (para os relatórios)
  S.cupLista = null; // {ts, j}
  var CUP_N = { bv: 'Boas-vindas', px: 'Próxima compra', am: 'Indique uma amiga', vip: 'Cliente VIP', fiel: 'Cliente fiel', ev: 'Cupom do evento' };
  var CUP_IC = { bv: '✉️', px: '🎟️', am: '👭', vip: '⭐', fiel: '💜', ev: '🎄' };
  function cupApi(b) {
    return nvToken().then(function (t) {
      return fetch('https://southamerica-east1-' + nvCfg().p + '.cloudfunctions.net/cupom', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t }, body: JSON.stringify(b) }).then(function (r) {
        return r.json();
      });
    });
  }
  function cupFilaPoe(b) {
    S.cupFila = (S.cupFila || []).concat([{ b: b, ts: Date.now() }]).slice(-200);
    saveSoon();
  }
  function cupFilaRoda() {
    if (!S.cupFila || !S.cupFila.length || !S.nuvem || !S.nuvem.rt || navigator.onLine === false || cupFilaRoda.on) return;
    cupFilaRoda.on = 1;
    var x = S.cupFila[0];
    cupApi(x.b)
      .then(function (j) {
        if (j && (j.ok || j.motivo)) {
          S.cupFila.shift();
          saveSoon();
        }
      })
      .catch(function () {})
      .then(function () {
        cupFilaRoda.on = 0;
      });
  }
  setInterval(cupFilaRoda, 60000);
  // pedido do site pago → os códigos do pedido ficam usados e o cartão "Próxima compra" passa a valer; cancelado → solta
  function cupPedido(p, acao) {
    if (!p || p.orig !== 'site' || !p.sid) return;
    var b = { acao: acao, pid: p.sid };
    if (!S.nuvem || !S.nuvem.rt) return cupFilaPoe(b);
    cupApi(b).catch(function () {
      cupFilaPoe(b);
    });
  }
  function cupTipoDe(cod) {
    return S.cupTipos[cod] || (/^LF-/.test(cod) ? 'px' : 'ev');
  }
  // ---------- caixa ----------
  S.cartCup = null; // {cod, pct, tipo, desc, lim}
  function cupCaixaHtml() {
    if (S.cartCup)
      return (
        '<div class="sl cupCx"><span>🎟️ ' + esc(S.cartCup.cod) + ' · ' + esc(CUP_N[S.cartCup.tipo] || 'Código') + ' −' + S.cartCup.pct + '%' +
        (S.cartCup.lim ? '<small>' + S.cartCup.lim + ' peça(s) sem cupom (furaria o piso)</small>' : '<small>✓ válido · nunca abaixo do piso</small>') +
        '</span><span style="display:flex;gap:6px;align-items:center"><b>− ' + gs(S.cartCup.desc) + '</b><button type="button" class="chip" data-act="cupCxX" aria-label="Tirar o código" style="min-height:36px;width:36px;padding:0;justify-content:center">×</button></span></div>'
      );
    return '<div class="cupCxR"><input class="in" id="cupCxIn" placeholder="🎟️ Código de desconto (LF-XXXX)" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Código de desconto"><button type="button" class="mini" data-act="cupCx">Aplicar</button></div>';
  }
  function cupCaixaAplica(c, primeira) {
    var tot = 0,
      lim = 0;
    S.cart.forEach(function (l) {
      if (l._cupBase == null) l._cupBase = l.preco != null ? l.preco : null;
      var base = l._cupBase != null ? l._cupBase : precoTab(l.it, l.tab || S.tabAtiva) * l.qty,
        pp = pisoPeca(l.it),
        d = Math.round((base * c.pct) / 100 / 500) * 500,
        mx = Math.max(0, base - pp.piso * l.qty);
      // S194: cupom sempre cheio; se furar o piso, a peça fica fora (sem cupom), igual à OFERTA no site
      if (d > mx) {
        d = 0;
        lim++;
      }
      l.preco = base - d;
      l._cupD = d;
      tot += d;
    });
    S.cartCup = { cod: c.cod, pct: c.pct, tipo: c.tipo, desc: tot, lim: lim };
    S.cupTipos[c.cod] = c.tipo;
    if (lim && primeira) cupAvisoLocal('✂️ Peça sem cupom (furaria o piso)', c.cod + ' · ' + lim + ' peça(s)');
    saveSoon();
  }
  ACT.cupCx = function () {
    var i = $('cupCxIn'),
      cod = String((i && i.value) || '').trim();
    if (!cod) return;
    var cli = S.vCli ? cliPorId(S.vCli) : null;
    lfToast('Conferindo o código…', 1500);
    cupApi({ acao: 'ver', cod: cod, tel: cli ? cli.tel : '', email: cli ? cli.email || '' : '' })
      .then(function (j) {
        if (!j || !j.ok) return popErr(cupMotivo(j && j.motivo, j && j.cupom));
        cupCaixaAplica(j.cupom, true);
        render();
      })
      .catch(function () {
        popErr('Sem internet para conferir o código. Confira de novo quando a internet voltar.');
      });
  };
  ACT.cupCxX = function () {
    S.cart.forEach(function (l) {
      if (l._cupD != null) {
        if (l._cupBase != null) l.preco = l._cupBase;
        else delete l.preco;
      }
      delete l._cupBase;
      delete l._cupD;
    });
    S.cartCup = null;
    render();
  };
  function cupMotivo(m, c) {
    return {
      nao: 'Código não encontrado.', usado: 'Este código já foi usado.', vencido: 'Este código venceu.', cancelado: 'Este código foi cancelado.', ja: 'Este cliente já usou ' + ((c && c.cod) || 'este código') + '.',
      esgotado: 'O cupom acabou (limite total).', outro: 'Código pessoal de outro telefone.', trava: 'Código travado por 24 h (tentativas com telefones diferentes).', proprio: 'É o código de amiga do próprio cliente.',
      cliente: 'Este código é só para quem nunca comprou.', cedo: 'Este código ainda não começou a valer.', pendente: 'Este cartão ainda espera o pagamento do pedido.', espera: 'Muitas tentativas erradas. Tente em 1 hora.'
    }[m] || 'Não deu para conferir o código.';
  }
  // chamado pelo carrinho depois de registrar as vendas
  function cupCaixaFim(vendas, cartId, cli, linhas) {
    var c = S.cartCup;
    if (!c) return;
    var total = 0;
    linhas.forEach(function (l, i) {
      var d = l._cupD || 0;
      total += (l.preco || 0) + d;
      if (vendas[i] && d > 0) vendas[i].cup = { cod: c.cod, desc: d };
    });
    var b = { acao: 'caixa', cod: c.cod, pid: 'loja:' + cartId, tel: cli ? cli.tel || '' : '', email: cli ? cli.email || '' : '', total: total, desc: c.desc };
    cupApi(b)
      .then(function (j) {
        if (j && !j.ok && j.motivo) cupAvisoLocal('⚠️ Código conferido depois', c.cod + ': ' + cupMotivo(j.motivo, j.cupom));
      })
      .catch(function () {
        cupFilaPoe(b);
      });
    S.cartCup = null;
  }
  // depois da venda: entregar o cartão "Próxima compra" (WhatsApp normal ou QR na tela)
  function cupEntregaOferta(cli) {
    setTimeout(function () {
      lfJanela({
        titulo: 'Cartão do cliente',
        monta: function (c, J) {
          c.innerHTML = '<div class="col" style="gap:10px;padding:0 16px 16px"><div class="hint" style="margin:0">10% na próxima compra · vale na loja e em lafouch.com · 1 uso</div><button type="button" class="go" id="cupEnt">🎟️ Entregar cartão "Próxima compra"' + (cli && cli.nome ? ' a ' + esc(cli.nome) : '') + '</button></div>';
          $('cupEnt').onclick = function () {
            this.disabled = true;
            cupApi({ acao: 'emitir', tipo: 'px', pct: 10, tel: cli ? cli.tel || '' : '', email: cli ? cli.email || '' : '', nome: cli ? cli.nome || '' : '' })
              .then(function (j) {
                if (!j || !j.ok) {
                  c.innerHTML = '<div class="hint" style="padding:0 16px 16px">' + (j && j.motivo === 'pausa' ? '⏸️ Teto do mês atingido: cartões novos voltam no mês que vem.' : 'Não deu para criar o cartão agora.') + '</div>';
                  return;
                }
                S.cupTipos[j.cod] = 'px';
                cupCartaoMostra(c, j.cupom, cli);
              })
              .catch(function () {
                c.innerHTML = '<div class="hint" style="padding:0 16px 16px">Sem internet: entregue o cartão quando a internet voltar (Clientes › Cartões).</div>';
              });
          };
        }
      });
    }, 700);
  }
  function cupLink(cod) {
    return 'https://lafouch.com/t/' + encodeURIComponent(cod);
  }
  function cupCartaoMostra(c, cp, cli) {
    var z = cli && cli.tel ? cliZap(cli) : '',
      txt = '🎟️ ' + (cp.pct || 10) + '% na próxima compra na La Fouch · código ' + cp.cod + ' · ' + cupLink(cp.cod);
    c.innerHTML =
      '<div class="col" style="gap:10px;padding:0 16px 16px"><div class="cupCard"><small>LA FOUCH</small><b>' + cp.pct + '% ' + (cp.tipo === 'vip' ? 'sempre (VIP)' : cp.tipo === 'am' ? 'para a amiga' : 'na próxima compra') + '</b><code>' + esc(cp.cod) + '</code><i>' + (cp.fim ? 'vale até ' + fd(cp.fim) + ' · ' : '') + 'na loja e em lafouch.com</i></div>' +
      (z ? '<button type="button" class="go" id="cupZap">Enviar pelo WhatsApp</button><div class="hint" style="margin:0">Abre o WhatsApp normal com a mensagem e o link do cartão (' + esc(cupLink(cp.cod).replace('https://', '')) + '). Sem custo.</div>' : '') +
      '<div class="cupQr" id="cupQr"></div><div class="hint" style="margin:0;text-align:center">' + (z ? 'Ou mostre o QR para ela ler' : 'Sem telefone: mostre o QR para ela ler') + '</div></div>';
    try {
      $('cupQr').innerHTML = window.LFqr ? window.LFqr.svg(cupLink(cp.cod)) : '';
    } catch (e) {}
    var b = $('cupZap');
    if (b)
      b.onclick = function () {
        window.open(z.split('?')[0] + '?text=' + encodeURIComponent(txt), '_blank');
      };
  }
  // ---------- Clientes › Cartões ----------
  function cupCarrega(cb) {
    cupApi({ acao: 'lista' })
      .then(function (j) {
        if (!j || !j.ok) throw 0;
        S.cupLista = { ts: Date.now(), j: j };
        (j.cupons || []).forEach(function (c) {
          S.cupTipos[c.cod] = c.tipo;
        });
        saveSoon();
        cb(j);
      })
      .catch(function () {
        cb(S.cupLista ? S.cupLista.j : null, true);
      });
  }
  function cupAvisoLocal(t, d) {
    S.cupAvL = (S.cupAvL || []).concat([{ ts: Date.now(), t: t, d: d }]).slice(-30);
  }
  ACT.cupAbre = function () {
    lfJanela({
      titulo: 'Cartões de desconto',
      monta: function (c, J) {
        c.innerHTML = '<div class="hint" style="padding:0 16px 16px">Carregando…</div>';
        cupCarrega(function (j, off) {
          if (!j) {
            c.innerHTML = '<div class="hint" style="padding:0 16px 16px">Entre na nuvem (Ajustes › Nuvem) e conecte à internet para ver os cartões.</div>';
            return;
          }
          cupDesenha(c, j, off);
        });
      }
    });
  };
  function cupDesenha(c, j, off) {
    var T = j.tipos || {},
      t = j.teto || { usado: 0, teto: 500000 },
      pc = 0,
      tp = function (k, d) {
        var x = T[k] || { gerados: 0, usados: 0 };
        return '<div class="sl"><span>' + CUP_IC[k] + ' <b>' + CUP_N[k] + '</b><small>' + d + '</small></span><b>' + x.usados + ' de ' + x.gerados + '</b></div>';
      };
    var av = (j.avisos || [])
      .map(function (a) {
        var ic = a.t === 'trava' ? '🔒' : a.t === 'esgotado' ? '🎄' : a.t === 'pausa' ? '⏸️' : 'ℹ️';
        return '<div class="sl"><span>' + ic + ' ' + esc(a.cod ? a.cod + ' · ' : '') + esc(a.d || '') + '<small>' + fd(a.ts) + '</small></span>' + (a.t === 'trava' && a.cod ? '<button type="button" class="mini ghost" data-cupdes="' + esc(a.cod) + '">Desfazer</button>' : '') + '</div>';
      })
      .concat((S.cupAvL || []).slice().reverse().map(function (a) {
        return '<div class="sl"><span>' + esc(a.t) + '<small>' + esc(a.d) + ' · ' + fd(a.ts) + '</small></span></div>';
      }))
      .slice(0, 12)
      .join('');
    var ev = cupTemaProx();
    c.innerHTML =
      '<div class="col cupJ" style="gap:12px;padding:0 16px 16px">' + (off ? '<div class="hint" style="margin:0">Sem internet: números da última vez.</div>' : '') +
      '<div class="lbl">Tipos</div>' + tp('bv', '5% automático ao se inscrever · 30 dias') + tp('px', '10% · vem com a compra paga e no caixa') + tp('am', '10% + 10%: a amiga usa e quem indicou ganha outro') + tp('fiel', '10% sozinho a cada 3 compras pagas · 1 uso') + tp('ev', 'um código para todos, 1 vez por pessoa') +
      /* S194: sem teto do mês; mostra só quanto os cupons deram no mês */'<div class="lbl">Descontos de cupons no mês</div><div class="hint" style="margin:0">' + gs(t.usado || 0) + '</div>' +
      '<div class="lbl">O que o app fez sozinho</div>' + (av || '<div class="hint" style="margin:0">Nada por enquanto.</div>') +
      '<div class="lbl">Cupom do evento</div>' +
      (ev ? '<div class="hint" style="margin:0">' + ev.ic + ' ' + ev.nome + (ev.dias > 0 ? ' começa em ' + ev.dias + ' dias' : ' está acontecendo') + ' · sugerido:</div>' : '') +
      '<div class="cupEv"><input class="in" id="cevCod" value="' + esc(ev ? ev.cod : '') + '" placeholder="Código (ex.: NAVIDAD10)" autocapitalize="characters"><input class="in" id="cevPct" inputmode="numeric" value="10" aria-label="Desconto %"><input class="in" id="cevMax" inputmode="numeric" value="50" aria-label="Limite total"></div>' +
      '<div class="hint" style="margin:0" id="cevSim"></div>' +
      '<button type="button" class="go" id="cevOk">Publicar e baixar post + story</button>' +
      '<div class="lbl">Proteções (sempre ligadas)</div><div class="hint" style="margin:0;line-height:1.6">✓ Boas-vindas: 1 por e-mail e 1 por telefone, só para quem nunca comprou<br>✓ Código pessoal fica preso ao telefone do 1º uso<br>✓ Cupom do evento: 1 vez por pessoa e até o limite total<br>✓ Amiga: prêmio só depois de pago + 7 dias, até 5 por mês<br>✓ Nunca abaixo do piso · 1 código por compra · vale o maior desconto<br>✓ Teto do mês: ao chegar, pausa códigos novos (os entregues valem)<br>✓ Muitas tentativas erradas: o código trava sozinho por 24 h<br>✓ Percentual que não cabe no estoque: o app não deixa criar e sugere outro</div>' +
      '<div class="lbl">Códigos ativos</div>' + (j.cupons || []).filter(function (x) { return x.estado === 'ok' && x.tipo !== 'bv'; }).slice(0, 20).map(function (x) {
        return '<div class="sl"><span>' + CUP_IC[x.tipo] + ' ' + esc(x.cod) + ' · ' + x.pct + '%<small>' + esc(x.nome || x.tel || x.email || CUP_N[x.tipo]) + (x.fim ? ' · até ' + fd(x.fim) : '') + (x.tipo === 'ev' ? ' · ' + x.usos + ' de ' + x.max : '') + '</small></span><button type="button" class="mini ghost" data-cupcan="' + esc(x.cod) + '">Cancelar</button></div>';
      }).join('') +
      '</div>';
    var sim = function () {
      var p = parseInt($('cevPct').value, 10) || 0,
        mx = parseInt($('cevMax').value, 10) || 0,
        r = cupSimula(p),
        ok = r.cabe >= 0.8;
      $('cevSim').innerHTML = p > 0 ? 'Simulação no estoque de hoje: cabe inteiro em <b>' + Math.round(r.cabe * 100) + '%</b> dos modelos · ' + r.lim + ' limitados pelo piso · ' + r.of + ' em oferta (não vale) · ' + mx + ' usos ≈ ' + gs(Math.round(mx * r.desc)) + ' de desconto' + (mx * r.desc > (t.teto - t.usado) ? ' (passa do teto do mês)' : ' (cabe no teto do mês)') + (ok ? ' ✓' : ' · ⚠️ com ' + p + '% cabe em pouco: use ' + r.sug + '%') : '';
      $('cevOk').disabled = !(p > 0 && ok && mx > 0);
    };
    $('cevPct').oninput = sim;
    $('cevMax').oninput = sim;
    sim();
    $('cevOk').onclick = function () {
      var p = parseInt($('cevPct').value, 10),
        mx = parseInt($('cevMax').value, 10),
        cod = $('cevCod').value.trim().toUpperCase();
      this.disabled = true;
      cupApi({ acao: 'emitir', tipo: 'ev', cod: cod, pct: p, max: mx, ini: ev ? ev.ini : Date.now(), fim: ev ? ev.fim : Date.now() + 14 * DAY, tema: ev ? ev.tema : '' })
        .then(function (r) {
          if (!r || !r.ok) return popErr(r && r.motivo === 'existe' ? 'Esse código já existe. Escolha outro.' : 'Não deu para criar o cupom.');
          S.cupTipos[r.cod] = 'ev';
          lfToast('✓ Cupom ' + r.cod + ' publicado', 2500);
          cupArte(r.cod, p, mx, ev);
          ACT.cupAbre();
        })
        .catch(function () {
          popErr('Sem internet para publicar o cupom.');
        });
    };
    c.onclick = function (e) {
      var d = e.target.closest('[data-cupdes],[data-cupcan]');
      if (!d) return;
      var cod = d.getAttribute('data-cupdes') || d.getAttribute('data-cupcan'),
        ac = d.hasAttribute('data-cupdes') ? 'destrava' : 'cancelar';
      d.disabled = true;
      cupApi({ acao: ac, cod: cod })
        .then(function () {
          lfToast(ac === 'destrava' ? '✓ ' + cod + ' destravado' : '✓ ' + cod + ' cancelado', 2000);
          cupCarrega(function (j2) {
            if (j2) cupDesenha(c, j2);
          });
        })
        .catch(function () {
          popErr('Sem internet.');
        });
    };
  }
  // Simulação: % que cabe inteiro sem furar o piso nas peças do site (as mesmas contas do site)
  function cupSimula(p) {
    var refs = Object.keys(S.site || {}),
      n = 0,
      cabe = 0,
      lim = 0,
      of = 0,
      soma = 0,
      cnt = {};
    refs.forEach(function (ref) {
      var v = vitInfo(ref);
      if (!v || !(v.preco > 0)) return;
      var pp = S.pprice && S.pprice[ref],
        it = { tipo: v.tipo },
        o = sitePrecoOferta(ref, v.preco || 0, pp && pp.ant > v.preco ? pp.ant : 0, v.tipo);
      n++;
      if (o.de > o.n) {
        of++;
        return;
      }
      var m = siteCupMax(ref, it.tipo, o.n);
      [5, 10, 15].forEach(function (x) {
        if (m >= x) cnt[x] = (cnt[x] || 0) + 1;
      });
      if (m >= p) cabe++;
      else if (m > 0) lim++;
      soma += (o.n * Math.min(p, m)) / 100;
    });
    var base = Math.max(1, n - of),
      sug = [15, 10, 5].filter(function (x) {
        return (cnt[x] || 0) / base >= 0.9;
      })[0] || 5;
    return { n: n, cabe: n ? cabe / base : 0, lim: lim, of: of, desc: base ? soma / base : 0, sug: sug };
  }
  // Próximo tema do calendário (as mesmas datas do painel) para sugerir o cupom do evento
  function cupTemaProx() {
    var ag = Date.now(),
      y = new Date().getFullYear(),
      L = [];
    [y, y + 1].forEach(function (a) {
      var d = function (M, D, f) {
          return new Date(a, M - 1, D, f ? 23 : 0, f ? 59 : 0).getTime();
        },
        n1 = new Date(a, 10, 1),
        bf = 1 + ((4 - n1.getDay() + 7) % 7) + 21 + 1,
        j1 = new Date(a, 5, 1),
        p2 = 1 + ((7 - j1.getDay()) % 7) + 7;
      L.push({ tema: 'bf', nome: 'Black Friday', ic: '🖤', cod: 'BLACK10', ini: d(11, bf), fim: d(11, bf + 3, 1) });
      L.push({ tema: 'natal', nome: 'Natal', ic: '🎄', cod: 'NAVIDAD10', ini: d(12, 1), fim: d(12, 25, 1) });
      L.push({ tema: 'anonovo', nome: 'Ano Novo', ic: '🥂', cod: 'ANONUEVO10', ini: d(12, 26), fim: d(12, 31, 1) });
      L.push({ tema: 'maes', nome: 'Dia das Mães', ic: '💐', cod: 'MAMA10', ini: d(5, 1), fim: d(5, 15, 1) });
      L.push({ tema: 'pais', nome: 'Dia dos Pais', ic: '👔', cod: 'PAPA10', ini: d(6, 1), fim: d(6, p2, 1) });
    });
    var x = L.filter(function (e) {
      return e.fim >= ag;
    }).sort(function (a, b) {
      return a.ini - b.ini;
    })[0];
    if (!x) return null;
    x.dias = Math.max(0, Math.ceil((x.ini - ag) / DAY));
    return x;
  }
  // Post quadrado (1080×1080) e story (1080×1920) no estilo do tema, com o Mochi temático
  var CUP_ARTE = {
    natal: ['#f7e9ef', '#1f5a3a', '#b3202f', 'Regalá estilo esta Navidad'], bf: ['#f4f1f3', '#141014', '#a44a7e', 'Black Friday La Fouch'], anonovo: ['#f6efe4', '#2a2140', '#b38a2e', 'Empezá el año con estilo'],
    maes: ['#f9e8ee', '#7a2e55', '#c2577f', 'Para la mamá más linda'], pais: ['#eef0f4', '#1e2a3a', '#a77b2d', 'Para el papá con estilo'], '': ['#f7e9ef', '#2b1a2a', '#a44a7e', 'Un regalo para vos']
  };
  function cupArte(cod, pct, mx, ev) {
    var tema = ev ? ev.tema : '',
      A = CUP_ARTE[tema] || CUP_ARTE[''],
      img = new Image(),
      fimTxt = ev ? new Date(ev.fim).getDate() + '/' + (new Date(ev.fim).getMonth() + 1) : '';
    img.crossOrigin = 'anonymous';
    var faz = function (ok) {
      [['post', 1080, 1080], ['story', 1080, 1920]].forEach(function (f) {
        var cv = document.createElement('canvas'),
          W = f[1],
          H = f[2],
          x = cv.getContext('2d');
        cv.width = W;
        cv.height = H;
        x.fillStyle = A[0];
        x.fillRect(0, 0, W, H);
        if (ok) {
          var sw = 560, sh = 630, s = f[0] === 'post' ? 0.95 : 1.55, dw = sw * s, dh = sh * s;
          x.drawImage(img, 640, 0, sw, sh, W - dw + (f[0] === 'post' ? 30 : -10), H - dh - (f[0] === 'post' ? 0 : 60), dw, dh);
        }
        var y = f[0] === 'post' ? 120 : 220;
        x.fillStyle = A[1];
        x.font = '600 34px Georgia, serif';
        x.fillText('LA FOUCH', 80, y);
        x.font = '700 ' + (f[0] === 'post' ? 64 : 84) + 'px Georgia, serif';
        var lines = A[3].split(' '), l1 = '', ls = [];
        lines.forEach(function (w) {
          if ((l1 + ' ' + w).trim().length > (f[0] === 'post' ? 16 : 14)) {
            ls.push(l1.trim());
            l1 = w;
          } else l1 += ' ' + w;
        });
        ls.push(l1.trim());
        ls.forEach(function (t, i) {
          x.fillText(t, 80, y + 110 + i * (f[0] === 'post' ? 76 : 100));
        });
        var cy = y + 140 + ls.length * (f[0] === 'post' ? 76 : 100);
        x.fillStyle = A[2];
        x.fillRect(80, cy, f[0] === 'post' ? 520 : 640, f[0] === 'post' ? 120 : 150);
        x.fillStyle = '#fff';
        x.font = '700 ' + (f[0] === 'post' ? 64 : 80) + 'px monospace';
        x.fillText(cod, 110, cy + (f[0] === 'post' ? 82 : 102));
        x.fillStyle = A[1];
        x.font = '500 ' + (f[0] === 'post' ? 30 : 40) + 'px Arial, sans-serif';
        x.fillText(pct + '% en tu compra', 80, cy + (f[0] === 'post' ? 180 : 230));
        x.fillText('primeras ' + mx + ' personas' + (fimTxt ? ' · hasta el ' + fimTxt : ''), 80, cy + (f[0] === 'post' ? 225 : 290));
        x.fillText('1 uso por persona', 80, cy + (f[0] === 'post' ? 270 : 350));
        x.font = '700 ' + (f[0] === 'post' ? 36 : 48) + 'px Arial, sans-serif';
        x.fillText('lafouch.com', 80, H - (f[0] === 'post' ? 70 : 140));
        try {
          var a = document.createElement('a');
          a.href = cv.toDataURL('image/png');
          a.download = cod + '-' + f[0] + '.png';
          document.body.appendChild(a);
          a.click();
          a.remove();
        } catch (e) {}
      });
    };
    img.onload = function () {
      faz(true);
    };
    img.onerror = function () {
      faz(false);
    };
    img.src = 'https://lafouch.com/og/mochi-' + (tema && tema !== 'halloween' ? tema + '-' : '') + 'es.jpg';
  }
  // VIP: na ficha do cliente
  ACT.cupVip = function (id) {
    var cli = cliPorId(+id);
    if (!cli) return;
    lfJanela({
      titulo: 'Cartão VIP',
      monta: function (c) {
        c.innerHTML = '<div class="hint" style="padding:0 16px 16px">Criando o cartão de ' + esc(cli.nome || 'cliente') + '…</div>';
        cupApi({ acao: 'emitir', tipo: 'vip', pct: 15, tel: cli.tel || '', email: cli.email || '', nome: cli.nome || '' })
          .then(function (j) {
            if (!j || !j.ok) throw 0;
            S.cupTipos[j.cod] = 'vip';
            cupCartaoMostra(c, j.cupom, cli);
          })
          .catch(function () {
            c.innerHTML = '<div class="hint" style="padding:0 16px 16px">Não deu para criar agora (precisa de internet e da nuvem conectada).</div>';
          });
      }
    });
  };
  // Finanças › "Cada cartão valeu a pena?" (mês atual; o valor das vendas já vem com o desconto)
  function cupValeuHtml() {
    var d = new Date(),
      ini = new Date(d.getFullYear(), d.getMonth(), 1).getTime(),
      T = {};
    S.sales.forEach(function (s) {
      if (s.estorno || s.ts < ini || !s.cup) return;
      var k = cupTipoDe(s.cup.cod),
        t = (T[k] = T[k] || { lucro: 0, desc: 0, n: 0 });
      t.lucro += (s.livre || 0) + (s.cup.desc || 0);
      t.desc += s.cup.desc || 0;
      t.n++;
    });
    var ks = Object.keys(T);
    if (!ks.length) return '';
    return (
      '<section class="card col"><h2 style="margin:0;font-size:16px">Cada cartão valeu a pena?</h2><div class="hint" style="margin:0">Lucro das vendas com código − desconto = lucro líquido (' + MESES_L[d.getMonth()] + ').</div>' +
      ks.map(function (k) {
        var t = T[k], liq = t.lucro - t.desc;
        return '<div class="sl"><span>' + (CUP_IC[k] || '') + ' ' + (CUP_N[k] || k) + '<small>' + t.n + ' venda(s) · lucro ' + gs(t.lucro) + ' · desconto −' + gs(t.desc) + (liq < 0 ? ' · ⚠️ lucro negativo: baixe o %' : '') + '</small></span><b style="color:' + (liq >= 0 ? 'var(--ok)' : 'var(--bad)') + '">' + gs(liq) + '</b></div>';
      }).join('') + '</section>'
    );
  }

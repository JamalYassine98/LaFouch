  // ===== S265 + decisão do dono de 14/11/2026: VOLTAR NO TEMPO — cada mudança de produto fica guardada no aparelho =====
  // O que é guardado, por código (ref): custo e dólar de cada linha, nome/descrição, preço escrito à mão (S.pprice),
  // estoque total e se a foto mudou. A cada salvamento o estado é comparado com o anterior e a diferença vira uma linha.
  // PODE VOLTAR: custo/dólar, nome/descrição e preço escrito à mão. NÃO volta por aqui: estoque (só por estorno ou ajuste
  // registrado) e fotos (ficam 30 dias na Lixeira de fotos). Restaurar muda só aquela peça e também vira uma linha (dá para desfazer).
  // Degraus de tempo: hoje cada mudança; até 7 dias uma por dia; até 31 dias uma por semana; depois uma por mês; nada além de 12 meses.
  // Fica no IndexedDB do aparelho (loja "estado", chave "vt"); não entra no backup nem na sincronização.
  var VT = { ok: false, log: [], ant: null, t: null };
  var VT_NOME = { custo: 'custo', nome: 'nome', preco: 'preço', estoque: 'estoque', foto: 'foto' };
  function vtFoto(ref) {
    var n = 0, t = 0;
    try { Object.keys(S.fotos || {}).forEach(function (k) { if (k === ref || k.indexOf(ref + '|') === 0) { n++; t += String(S.fotos[k] || '').length; } }); } catch (e) {}
    return n + ':' + t;
  }
  function vtEstado() {
    var m = {};
    (S.items || []).forEach(function (i) {
      if (!i || !i.ref) return;
      var e = m[i.ref] || (m[i.ref] = { c: {}, q: 0 });
      e.c[(i.cor || '') + '|' + (i.grau || '')] = [i.custo == null ? null : +i.custo, i.usd == null ? null : +i.usd];
      e.q += +i.qty || 0;
    });
    Object.keys(m).forEach(function (r) {
      var e = m[r];
      e.n = (S.pnome && S.pnome[r]) || '';
      e.p = S.pprice && S.pprice[r] ? JSON.parse(JSON.stringify(S.pprice[r])) : null; // o objeto inteiro, como o app guarda (tem a base em dólar)
      e.f = vtFoto(r);
    });
    return m;
  }
  function vtIgual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
  // o preço à mão é guardado em dólar (nu/au) e o guarani é recalculado pelo câmbio: só conta como mudança se a BASE mudar
  function vtBaseP(p) { return p ? (p.nu != null || p.au != null ? [p.nu || 0, p.au || 0] : [p.novo || 0, p.ant || 0]) : null; }
  // compara o estado de agora com o anterior e guarda as diferenças
  function vtRegistra() {
    if (!VT.ok) return 0;
    var ag = vtEstado(), an = VT.ant, novos = 0, ts = Date.now();
    if (an) {
      var venda = (S.sales || []).some(function (s) { return s && ts - (s.ts || 0) < 15000; });
      Object.keys(ag).forEach(function (r) {
        var x = an[r], y = ag[r];
        if (!x) return; // peça nova: não há "antes"
        [['custo', x.c, y.c], ['nome', x.n, y.n], ['preco', x.p, y.p], ['estoque', x.q, y.q], ['foto', x.f, y.f]].forEach(function (k) {
          if (k[0] === 'preco' ? vtIgual(vtBaseP(k[1]), vtBaseP(k[2])) : vtIgual(k[1], k[2])) return;
          if (k[0] === 'nome' && !k[1]) return; // primeira vez que a peça ganha nome (o app nomeia sozinho ao abrir): não há o que desfazer
          VT.log.push({ ts: ts, ref: r, k: k[0], de: k[1], para: k[2], v: k[0] === 'estoque' && venda && k[2] < k[1] ? 1 : 0 });
          novos++;
        });
      });
    }
    VT.ant = ag;
    if (novos || !an) { vtDegraus(); vtGuarda(); }
    return novos;
  }
  function vtBalde(ts, ag) {
    var d = new Date(ts), dias = (ag - ts) / DAY;
    if (dayKey(ts) === dayKey(ag)) return '';
    if (dias <= 7) return 'd' + dayKey(ts);
    if (dias <= 31) { var s = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay()); return 's' + dayKey(s.getTime()); }
    return 'm' + d.getFullYear() + '-' + (d.getMonth() + 1);
  }
  // junta as mudanças antigas: em cada degrau fica uma linha por peça e por campo (o "antes" mais velho e o "depois" mais novo)
  function vtDegraus() {
    var ag = Date.now(), fica = [], G = {};
    VT.log.forEach(function (e) {
      if (ag - e.ts > 366 * DAY) return;
      var b = vtBalde(e.ts, ag);
      if (!b) { delete e.b; return fica.push(e); }
      var c = b + '|' + e.ref + '|' + e.k, g = G[c];
      if (!g) { g = G[c] = { ts: e.ts, ref: e.ref, k: e.k, de: e.de, para: e.para, v: e.v, b: b, n: e.n || 1, t0: e.ts }; fica.push(g); return; }
      if (e.ts < g.t0) { g.t0 = e.ts; g.de = e.de; }
      if (e.ts >= g.ts) { g.ts = e.ts; g.para = e.para; }
      g.v = g.v || e.v;
      g.n += e.n || 1;
    });
    fica.forEach(function (e) { delete e.t0; });
    VT.log = fica.sort(function (a, b) { return a.ts - b.ts; }).slice(-3000);
  }
  function vtGuarda() {
    clearTimeout(VT.t);
    VT.t = setTimeout(function () {
      try { idbDo('estado', 'readwrite', function (o) { return o.put({ log: VT.log, ant: VT.ant }, 'vt'); }).catch(function () {}); } catch (e) {}
    }, 600);
  }
  try {
    idbDo('estado', 'readonly', function (o) { return o.get('vt'); }).then(function (r) {
      if (r && Array.isArray(r.log)) { VT.log = r.log; VT.ant = r.ant || null; }
      VT.ok = true;
      vtRegistra();
    }, function () { VT.ok = true; });
  } catch (e) { VT.ok = true; }
  var _svVT = salvarAgora;
  salvarAgora = function () {
    var r = _svVT.apply(this, arguments);
    try { vtRegistra(); } catch (e) {}
    return r;
  };

  // ---------- como cada valor aparece ----------
  function vtTxt(k, v) {
    if (k === 'nome') return v ? String(v) : 'sem nome';
    if (k === 'preco') return v && (v.gn || v.novo) ? gs(v.gn || v.novo) : 'sem preço à mão';
    if (k === 'estoque') return String(v);
    if (k === 'foto') return String(v).split(':')[0] + ' foto(s)';
    var vs = Object.keys(v || {}).map(function (c) { return v[c][0] || v[c][1]; }).filter(function (x) { return x > 0; });
    if (!vs.length) return 'sem custo';
    var mn = Math.min.apply(null, vs), mx = Math.max.apply(null, vs), f = function (x) { return 'US$ ' + String(Math.round(x * 100) / 100).replace('.', ','); };
    return mn === mx ? f(mn) : f(mn) + ' a ' + f(mx);
  }
  function vtAtual(e) { var a = vtEstado()[e.ref]; return a ? (e.k === 'custo' ? a.c : e.k === 'nome' ? a.n : e.k === 'preco' ? a.p : e.k === 'estoque' ? a.q : a.f) : null; }
  function vtPode(e) { return e.k === 'custo' || e.k === 'nome' || e.k === 'preco'; }
  function vtLinha(e, i) {
    return '<button type="button" class="vtL" data-vt="' + i + '"><span><b>' + esc(e.ref) + ' · ' + VT_NOME[e.k] + '</b><small>' + (e.b ? fd(e.ts) : fh(e.ts)) + ' · ' + esc(vtTxt(e.k, e.de)) + ' → ' + esc(vtTxt(e.k, e.para)) + (e.v ? ' (venda)' : '') + '</small></span><i>›</i></button>';
  }
  ACT.vtAbre = function () {
    try { vtRegistra(); } catch (e) {}
    lfJanela({
      titulo: 'Voltar no tempo',
      cls: 'vtJn',
      monta: function (c) {
        var lista = function () {
          var ag = Date.now(), L = VT.log.map(function (e, i) { return [e, i]; }).reverse(), sec = [['', 'Hoje · cada mudança'], ['d', 'Últimos 7 dias · uma por dia'], ['s', 'Este mês · uma por semana'], ['m', 'Mais antigo · uma por mês']];
          var h = '<p class="vtN">Cada mudança de produto fica guardada neste aparelho. Toque numa para ver e desfazer só ela.</p>';
          if (!L.length) h += '<p class="vtN">Ainda não há mudanças guardadas. Elas começam a ser anotadas a partir de agora.</p>';
          sec.forEach(function (s) {
            var it = L.filter(function (x) { return (x[0].b || '').charAt(0) === s[0]; });
            if (!it.length) return;
            h += '<div class="lbl vtS">' + s[1] + '</div>' + it.slice(0, 60).map(function (x) { return vtLinha(x[0], x[1]); }).join('');
          });
          c.innerHTML = '<div class="vtC">' + h + '</div>';
        };
        var uma = function (i) {
          var e = VT.log[i];
          if (!e) return lista();
          var at = vtAtual(e), igual = e.k === 'preco' ? vtIgual(vtBaseP(at), vtBaseP(e.de)) : vtIgual(at, e.de);
          c.innerHTML = '<div class="vtC"><button type="button" class="gBtn vtV" data-vt="x">‹ Todas as mudanças</button><h3 class="vtT">' + esc(pn(e.ref)) + '</h3><p class="vtN">' + esc(e.ref) + ' · ' + VT_NOME[e.k] + ' · mudou em ' + fd(e.ts) + ' às ' + fh(e.ts) + (e.n > 1 ? ' (' + e.n + ' mudanças juntas)' : '') + '</p>' +
            '<div class="vtG"><span class="lbl">Antes</span><span class="lbl">Depois</span><span class="lbl">Agora</span><b>' + esc(vtTxt(e.k, e.de)) + '</b><b>' + esc(vtTxt(e.k, e.para)) + '</b><b>' + esc(at == null ? 'peça apagada' : vtTxt(e.k, at)) + '</b></div>' +
            (at == null ? '<p class="vtN">Esta peça não existe mais no estoque.</p>'
              : e.k === 'estoque' ? '<p class="vtN">O estoque não volta por aqui, para a contagem não quebrar. ' + (e.v ? 'Para desfazer uma venda, estorne-a no Histórico.' : 'Para corrigir, ajuste o estoque na ficha da peça.') + '</p>'
              : e.k === 'foto' ? '<p class="vtN">Fotos apagadas ficam 30 dias na Lixeira de fotos (Estúdio). Recupere por lá.</p>'
              : igual ? '<p class="vtN">Esta peça já está como era antes desta mudança.</p>'
              : '<button type="button" class="vtB" data-vt="r' + i + '">Restaurar só esta peça</button><p class="vtN">Volta o ' + VT_NOME[e.k] + ' para ' + esc(vtTxt(e.k, e.de)) + '. As outras peças, as vendas e o caixa não mudam. A restauração também fica guardada aqui e pode ser desfeita.</p>') + '</div>';
        };
        c.onclick = function (ev) {
          var b = ev.target.closest('[data-vt]');
          if (!b) return;
          var v = b.getAttribute('data-vt');
          if (v === 'x') return lista();
          if (v.charAt(0) === 'r') { vtRestaura(+v.slice(1)); return lista(); }
          uma(+v);
        };
        lista();
      }
    });
  };
  // põe de volta o valor de antes, só nessa peça e só nesse campo
  function vtRestaura(i) {
    var e = VT.log[i];
    if (!e || !vtPode(e)) return false;
    if (e.k === 'nome') {
      if (e.de) setPN(e.ref, e.de);
      else if (S.pnome) delete S.pnome[e.ref];
    } else if (e.k === 'preco') {
      if (!S.pprice) S.pprice = {};
      if (e.de) S.pprice[e.ref] = JSON.parse(JSON.stringify(e.de));
      else delete S.pprice[e.ref];
    } else {
      (S.items || []).forEach(function (it) {
        if (it.ref !== e.ref) return;
        var a = e.de[(it.cor || '') + '|' + (it.grau || '')];
        if (!a) return;
        if (a[0] == null) delete it.custo; else it.custo = a[0];
        if (a[1] == null) delete it.usd; else it.usd = a[1];
      });
    }
    salvarAgora();
    render();
    lfToast('Restaurado: ' + e.ref + ' · ' + VT_NOME[e.k]);
    return true;
  }
  // entrada em Ajustes › Cópias e nuvem
  var _bhVT = backupHtml;
  backupHtml = function () {
    var h = _bhVT.apply(this, arguments);
    return h.replace('<section class="card col">', '<section class="card col"><button type="button" class="vtE" data-act="vtAbre"><span><b>Voltar no tempo</b><small>mudanças de produto guardadas neste aparelho</small></span><i>›</i></button>');
  };
  window.__vt = { registra: vtRegistra, log: function () { return VT.log; }, restaura: vtRestaura, pronto: function () { return VT.ok; } };

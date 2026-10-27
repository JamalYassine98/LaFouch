  // ===== Aba Ajustes: faixas, meta, contas e backup dos dados. =====
  // Gera o texto do backup (dados + fotos em miniatura).
  var SEM_BACKUP = ['pinHash', 'pinSalt', 'bioOn', 'lockMin', 'lockSens', 'nuvem'];
  function backupDados(semFotos) {
    var d = {};
    PERSIST.forEach(function (k) {
      if (SEM_BACKUP.indexOf(k) < 0) d[k] = S[k];
    });
    if (!semFotos) d.fotos = S.fotos;
    return JSON.stringify({ app: 'lafouch', v: 1, ts: Date.now(), d: d });
  }
  // Restaura os dados a partir do texto do backup. Devolve '' se deu certo, ou a mensagem de erro.
  function restaurarDados(txt) {
    var o;
    try {
      o = JSON.parse(txt);
    } catch (e) {
      return 'Arquivo inválido: não é um backup do app.';
    }
    if (!o || o.app !== 'lafouch' || !o.d || !Array.isArray(o.d.items))
      return 'Arquivo inválido: não é um backup do app.';
    // Tudo ou nada: guarda o estado atual e, se algo falhar no meio, volta exatamente como estava.
    var snap = {};
    PERSIST.forEach(function (k) {
      snap[k] = S[k];
    });
    snap.fotos = S.fotos;
    try {
      PERSIST.forEach(function (k) {
        if (o.d[k] !== undefined && SEM_BACKUP.indexOf(k) < 0) S[k] = o.d[k];
      });
      if (o.d.fotos && typeof o.d.fotos === 'object') {
        /* o backup não apaga as fotos que já estão neste aparelho: elas só saem se o modelo não existir mais */
        var refs = {},
          nf = {},
          kf;
        S.items.forEach(function (i) {
          if (i.ref) refs[i.ref] = 1;
        });
        for (kf in snap.fotos) if (refs[kf.slice(0, kf.indexOf('|'))] && snap.fotos[kf]) nf[kf] = snap.fotos[kf];
        for (kf in o.d.fotos) if (o.d.fotos[kf]) nf[kf] = o.d.fotos[kf];
        S.fotos = nf;
      }
      dedupeItems();
      syncTipos();
      render();
    } catch (e) {
      Object.keys(snap).forEach(function (k) {
        S[k] = snap[k];
      });
      try {
        render();
      } catch (e2) {}
      return 'O arquivo tem dados que o app não conseguiu ler.';
    }
    return '';
  }
  // Guarda/compartilha o backup: no app usa o compartilhar do celular; no navegador baixa o arquivo.
  function exportarBackup() {
    var txt = backupDados(),
      d = new Date(),
      nome =
        'lafouch-backup-' +
        d.getFullYear() +
        '-' +
        ('0' + (d.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + d.getDate()).slice(-2) +
        '.json';
    function feito() {
      S.backupTs = Date.now();
      S.ajMsg = 'Backup gerado (' + Math.round(txt.length / 1024) + ' KB).';
      S.bkText = '';
      render();
    }
    salvarArquivo(nome, txt, 'application/json', feito, function () {
      S.bkText = txt;
      S.ajMsg = 'Copie o texto abaixo e guarde onde quiser.';
      render();
    });
  }
  // Lê um número digitado (aceita vírgula).
  function numIn(v) {
    var n = parseFloat(String(v).replace(',', '.'));
    return isNaN(n) ? 0 : n;
  }
  // Meta mínima de vendas por dia, rateio das contas e faixa automática.
  function precosMetaHtml() {
    var h = '<div class="col" style="border-top:1px solid var(--line);padding-top:12px"><div><div class="lbl">Meta mínima de vendas por dia, por tipo</div><div class="hint" style="margin:0">Um palpite seu basta. Serve para dividir as contas desde o primeiro dia; conforme as vendas reais aparecem, o app passa a usá-las.</div></div>';
    tipoAll().forEach(function (t) {
      if (t.simple) return;
      h +=
        '<div style="display:flex;gap:8px;align-items:center"><span style="flex:1 1 150px">' +
        esc(t.label) +
        '</span><input class="in" inputmode="decimal" data-aj="mdia" data-tipo="' +
        esc(t.id) +
        '" value="' +
        (S.metaDia[t.id] > 0 ? String(S.metaDia[t.id]).replace('.', ',') : '') +
        '" placeholder="0" aria-label="Peças por dia de ' +
        esc(t.label) +
        '" style="max-width:90px"><span class="hint" style="margin:0">por dia</span></div>';
    });
    h +=
      '<div style="display:flex;gap:8px;align-items:center"><span style="flex:1 1 150px">Dias de loja aberta por mês</span><input class="in" inputmode="numeric" data-aj="dias" value="' +
      (S.diasLoja || 26) +
      '" style="max-width:90px"></div>';
    h +=
      '<div><div class="lbl">Como dividir as contas entre as peças</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="chip' +
      (S.rateio !== 'custo' ? ' on' : '') +
      '" data-act="ratsel" data-id="peca">Igual por peça</button><button class="chip' +
      (S.rateio === 'custo' ? ' on' : '') +
      '" data-act="ratsel" data-id="custo">Proporcional ao custo</button></div><div class="hint">' +
      (S.rateio === 'custo'
        ? 'Peça mais cara carrega mais das contas do mês; peça barata, menos. A soma continua sendo as contas do mês.'
        : 'Toda peça carrega o mesmo valor das contas, seja barata ou cara.') +
      '</div></div>';
    var fa = S.faixaAuto || { on: false, lim: [4, 10] };
    h +=
      '<div><div class="lbl">Faixa automática pelo custo</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="chip' +
      (fa.on ? ' on' : '') +
      '" data-act="faixaauto">' +
      (fa.on ? 'Ligada' : 'Desligada') +
      '</button></div><div class="hint">Peça sem faixa escolhida entra na faixa pelo custo de reposição. A faixa que você escolher à mão sempre vale mais.</div>';
    if (fa.on)
      S.faixas.slice(0, -1).forEach(function (f, i) {
        h +=
          '<div style="display:flex;gap:8px;align-items:center;margin-top:6px"><span style="flex:1 1 150px">' +
          esc(f.nome) +
          ': custo até US$</span><input class="in" inputmode="decimal" data-aj="flim" data-i="' +
          i +
          '" value="' +
          String((fa.lim || [])[i] != null ? fa.lim[i] : '').replace('.', ',') +
          '" style="max-width:90px"></div>';
      });
    h += '</div></div>';
    return h;
  }
  // Preços e finanças (Dashboard › Preços): meta, faixas e rateio das contas. Os campos usam data-aj e valem em qualquer tela.
  function precosCfgHtml() {
    var h = '';
    // meta
    h +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Meta do mês</h2><div><div class="lbl">Lucro livre desejado no mês, loja toda (US$)</div><input class="in" inputmode="decimal" data-aj="meta" value="' +
      usdParaCampo(S.metaUsd) +
      '" placeholder="Ex.: ' + usdParaCampo(600) + '" style="max-width:220px"></div></section>';
    // faixas
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Faixas</h2><div class="hint" style="margin:2px 0 0">Você cria e nomeia. A margem é o lucro mínimo desejado sobre o preço de venda e define o piso. O preço de cada produto é definido no próprio produto (aba Produtos).</div></div>';
    S.faixas.forEach(function (f) {
      var n = Object.keys(S.pfaixa).filter(function (k) {
        return S.pfaixa[k] === f.id;
      }).length;
      h +=
        '<div class="card col" style="background:var(--panel2);gap:10px"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="dot" style="background:' +
        faixaCor(f) +
        '"></span><input class="in" data-aj="fnome" data-id="' +
        f.id +
        '" value="' +
        esc(f.nome) +
        '" aria-label="Nome da faixa" style="flex:1 1 140px"><span class="hint" style="margin:0">' +
        n +
        ' produto(s)</span></div><div><div class="lbl">Margem mínima (%)</div><input class="in" inputmode="decimal" data-aj="fmarg" data-id="' +
        f.id +
        '" value="' +
        f.margem +
        '" style="max-width:140px"></div>';
      h +=
        '<div><button class="chip" data-act="fdel" data-id="' +
        f.id +
        '">' +
        (S.fDelConf === f.id ? 'Confirmar: remover faixa' : 'Remover faixa') +
        '</button></div></div>';
    });
    h +=
      '<div style="display:flex;gap:8px"><input class="in" id="fnew" placeholder="Nome da nova faixa" style="flex:1" maxlength="30"><button class="chip on" data-act="fadd">+ Nova faixa</button></div></section>';
    // rateio das contas e tolerância da contagem
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Contas e contagem</h2><div class="hint" style="margin:2px 0 0">As contas do mês (' +
      gs(totalMensal()) +
      ', cerca de US$ ' +
      Math.round(totalMensal() / S.fx.pyg) +
      ') já são separadas de cada venda: o lucro livre e a meta são o que sobra depois delas.</div></div>' +
      '<div><div class="lbl">Peças por mês para ratear as contas</div><input class="in" inputmode="numeric" data-aj="vol" value="' +
      S.volume +
      '" style="max-width:160px"><div class="hint">Em uso agora: <b>' +
      volumeEfetivo() +
      '</b> ' +
      (volumeAuto() > 0 && S.volAuto !== false ? '(calculado pelas suas vendas reais)' : '(número manual)') +
      '.</div><div style="margin-top:8px"><button class="chip' +
      (S.volAuto !== false ? ' on' : '') +
      '" data-act="volauto">Calcular pelas vendas reais</button></div><div class="hint">Com 2 meses de vendas (pelo menos 20 peças), o app passa a usar a média real.</div></div>' +
      precosMetaHtml() +
      '</section>';
    return h;
  }
  // Monta a aba Ajustes.
  function renderAjustes() {
    var el = $('v-ajustes');
    if (S.view !== 'ajustes') return;
    var ae = document.activeElement;
    if (!S._ajForce && ae && ae.tagName === 'INPUT' && el.contains(ae)) return;
    S._ajForce = false;
    var h =
      '<div class="top"><div><h1>Ajustes</h1><div class="crumb">Nota fiscal, lembretes, segurança e cópias</div></div></div>';
    if (S.ajMsg) h += '<div class="note n-ok" role="status">' + esc(S.ajMsg) + '</div>';
    // cidade da nota fiscal
    h +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Nota fiscal</h2><div><div class="lbl">Cidade que sai na nota</div><input class="in" data-aj="cidade" value="' +
      esc(S.notaCidade || 'CDE') +
      '" placeholder="CDE" style="max-width:220px" autocomplete="off"></div></section>';
    // backup (arquivo manual + cópias automáticas)
    // Backup é a última seção; a Nuvem fica dentro dele
    h += ajustesFinHtml();
    var nv = nvCard()
      .replace('<section class="card col">', '<div class="col" style="border-top:1px solid var(--line);padding-top:12px">')
      .replace(/<\/section>$/, '</div>');
    h += backupHtml().replace(/<\/section>$/, nv + '</section>');
    el.innerHTML = h;
  }
  // Recalcula e salva uma alteração feita na aba Ajustes.
  document.addEventListener('change', function (e) {
    var t = e.target,
      k = t.getAttribute && t.getAttribute('data-aj');
    if (!k) return;
    var id = t.getAttribute('data-id'),
      f = S.faixas.filter(function (x) {
        return x.id === id;
      })[0];
    S._ajForce = true;
    S.ajMsg = '';
    if (k === 'meta') S.metaUsd = campoParaUsd(t.value);
    if (k === 'cidade') S.notaCidade = t.value.trim().toUpperCase() || 'CDE';
    if (k === 'fnome' && f && t.value.trim()) f.nome = t.value.trim();
    if (k === 'fmarg' && f) f.margem = Math.max(0, Math.min(90, numIn(t.value)));
    if (k === 'fprec' && f) {
      var pr = campoParaGs(t.value);
      f.precos = f.precos || {};
      if (pr > 0) f.precos[t.getAttribute('data-tipo')] = pr;
      else delete f.precos[t.getAttribute('data-tipo')];
    }
    if (k === 'vol') S.volume = Math.max(1, toNum(t.value) || S.volume);
    if (k === 'tol') S.tolUsd = campoParaUsd(t.value);
    if (k === 'mdia') {
      var tv = Math.max(0, numIn(t.value) || 0);
      if (tv > 0) S.metaDia[t.getAttribute('data-tipo')] = tv;
      else delete S.metaDia[t.getAttribute('data-tipo')];
    }
    if (k === 'dias') S.diasLoja = Math.max(1, Math.min(31, Math.round(numIn(t.value)) || 26));
    if (k === 'flim') {
      if (!S.faixaAuto) S.faixaAuto = { on: true, lim: [4, 10] };
      S.faixaAuto.lim = (S.faixaAuto.lim || []).slice();
      S.faixaAuto.lim[+t.getAttribute('data-i')] = Math.max(0, numIn(t.value) || 0);
    }
    render();
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'fnew') S.fnewTxt = e.target.value;
  });
  S.fDelConf = '';
  S.ajMsg = '';
  S.bkText = '';
  // Importar backup: abre o seletor de arquivo (confirma antes de substituir).
  var bkFile = document.createElement('input');
  bkFile.type = 'file';
  bkFile.accept = '.json,application/json,text/plain';
  bkFile.hidden = true;
  document.body.appendChild(bkFile);
  bkFile.onchange = function () {
    var f = bkFile.files && bkFile.files[0];
    bkFile.value = '';
    if (!f) return;
    impTela('load');
    var t0 = Date.now(),
      r = new FileReader(),
      fim = function (er) {
        // o carregamento fica pelo menos um instante na tela, para não piscar
        setTimeout(function () {
          if (er) impTela('erro', er);
          else {
            S.ajMsg = 'Backup restaurado. Os dados atuais foram substituídos.';
            S._ajForce = true;
            render();
            impTela('ok');
          }
        }, Math.max(0, 900 - (Date.now() - t0)));
      };
    r.onload = function () {
      fim(restaurarDados(String(r.result)));
    };
    r.onerror = function () {
      fim('Não consegui ler o arquivo.');
    };
    r.readAsText(f);
  };
  // Janela de importação: carregando, sucesso (com resumo) ou falha (nada é alterado).
  var IMP_CK = '<svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  function impTela(modo, msg) {
    var o = $('impOv');
    if (!o) {
      o = document.createElement('div');
      o.id = 'impOv';
      o.setAttribute('role', 'alertdialog');
      o.setAttribute('aria-live', 'polite');
      document.body.appendChild(o);
    }
    var h;
    if (modo === 'load')
      h = '<div class="ic"><div class="sp"></div></div><h3>Importando backup…</h3><p>Lendo o arquivo e conferindo os dados.</p><div class="pb"><s></s></div>';
    else if (modo === 'ok')
      h =
        '<div class="ic ok"><u></u>' + IMP_CK + '<path pathLength="1" d="M4.5 12.8l4.8 4.9L19.5 7"/></svg></div><h3>Backup importado</h3><p>Tudo certo. Os dados deste aparelho foram substituídos.</p><div class="rs"><span>' +
        S.items.length + ' modelos</span><span>' + Object.keys(S.fotos || {}).length + ' fotos</span><span>' + S.sales.length + ' vendas</span></div><button type="button" data-impfecha>Pronto</button>';
    else
      h =
        '<div class="ic er"><u></u>' + IMP_CK + '<path pathLength="1" d="M6 6l12 12"/><path pathLength="1" d="M18 6L6 18"/></svg></div><h3>Não foi possível importar</h3><p>' + esc(msg || 'O arquivo não é um backup do LaFouch.') + ' <b>Nada foi alterado</b> nos seus dados.</p><button type="button" data-impfecha>Entendi</button>';
    o.innerHTML = '<div class="bx">' + h + '</div>';
    o.hidden = false;
    var b = o.querySelector('[data-impfecha]');
    if (b) {
      b.onclick = function () {
        o.hidden = true;
        o.innerHTML = '';
      };
      b.focus();
    }
  }
  // Ações da aba Ajustes e das análises do Dashboard.
  ACT.fadd = function () {
    var n = String(S.fnewTxt || ($('fnew') && $('fnew').value) || '').trim();
    if (!n) return;
    S.faixas.push({ id: 'f' + Date.now().toString(36), nome: n, margem: 40, precos: {} });
    S.fnewTxt = '';
    S._ajForce = true;
    render();
  };
  ACT.fdel = function (id) {
    if (S.fDelConf !== id) {
      S.fDelConf = id;
      S._ajForce = true;
      render();
      return;
    }
    S.faixas = S.faixas.filter(function (f) {
      return f.id !== id;
    });
    Object.keys(S.pfaixa).forEach(function (k) {
      if (S.pfaixa[k] === id) delete S.pfaixa[k];
    });
    S.fDelConf = '';
    S._ajForce = true;
    render();
  };
  ACT.bkexp = exportarBackup;
  ACT.bkimp = function () {
    if ((S.sales.length || S.items.length) && !S.bkImpConf) {
      S.bkImpConf = true;
      S.ajMsg = 'Importar substitui os dados deste aparelho. Toque de novo em Importar backup para continuar.';
      S._ajForce = true;
      render();
      return;
    }
    S.bkImpConf = false;
    exigirAuth(function () {
      bkFile.click();
    });
  };
  ACT.ratsel = function (id) {
    S.rateio = id === 'custo' ? 'custo' : 'peca';
    S._ajForce = true;
    saveSoon();
    render();
  };
  ACT.faixaauto = function () {
    if (!S.faixaAuto) S.faixaAuto = { on: false, lim: [4, 10] };
    S.faixaAuto.on = !S.faixaAuto.on;
    S._ajForce = true;
    saveSoon();
    render();
  };
  ACT.volauto = function () {
    S.volAuto = S.volAuto === false;
    S._ajForce = true;
    render();
  };
  ACT.sugap = function (id) {
    var r = sugestoes().filter(function (x) {
      return x.faixa.id === id;
    })[0];
    if (r && r.para !== r.de) r.faixa.margem = r.para;
    render();
  };
  ACT.sugig = function (id) {
    var d = new Date();
    S.sugIgn[id] = d.getFullYear() + '-' + (d.getMonth() + 1);
    render();
  };
  ACT.saida = function (key) {
    var m = prodStats().filter(function (x) {
      return x.key === key;
    })[0];
    if (!m) return;
    var it = S.items.filter(function (i) {
      return i.tipo + '|' + i.ref === key && i.qty > 0;
    })[0];
    if (!it) return;
    var pp = pisoPeca(it);
    S.vTipo = 'all';
    S.vq = '';
    $('vq').value = '';
    S.vFaixa = '';
    S.vRef = key;
    S.vSel = it;
    S.detRow = null;
    S.detCor = '';
    S.qty = 1;
    S._descKey = [it.tipo, it.ref, it.cor, it.grau, it.vr].join('/');
    S.descMode = 'pyg';
    S.descTxt = String(Math.max(0, pp.lista - pp.saida));
    S.vMotivo = 'Liquidação';
    S.rec = null;
    setView('vendas');
  };

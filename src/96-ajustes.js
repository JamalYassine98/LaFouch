  // ===== Aba Ajustes: faixas, meta, sazonalidade, contas e backup dos dados. =====
  // Gera o texto do backup (dados + fotos em miniatura).
  var SEM_BACKUP = ['pinHash', 'pinSalt', 'bioOn', 'lockMin', 'lockSens'];
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
    PERSIST.forEach(function (k) {
      if (o.d[k] !== undefined && SEM_BACKUP.indexOf(k) < 0) S[k] = o.d[k];
    });
    if (o.d.fotos && typeof o.d.fotos === 'object') S.fotos = o.d.fotos;
    try {
      dedupeItems();
    } catch (e) {}
    syncTipos();
    render();
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
  // Monta a aba Ajustes.
  function renderAjustes() {
    var el = $('v-ajustes');
    if (S.view !== 'ajustes') return;
    var ae = document.activeElement;
    if (!S._ajForce && ae && ae.tagName === 'INPUT' && el.contains(ae)) return;
    S._ajForce = false;
    var h =
      '<div class="top"><div><h1>Ajustes</h1><div class="crumb">Faixas, meta do mês, estações do ano, contas e backup</div></div></div>';
    if (S.ajMsg) h += '<div class="note n-ok" role="status">' + esc(S.ajMsg) + '</div>';
    // meta
    h +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Meta do mês</h2><div><div class="lbl">Lucro livre desejado no mês, loja toda (' + mpSim() + ')</div><input class="in" inputmode="decimal" data-aj="meta" value="' +
      usdParaCampo(S.metaUsd) +
      '" placeholder="Ex.: ' + usdParaCampo(600) + '" style="max-width:220px"></div></section>';
    // faixas
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Faixas</h2><div class="hint" style="margin:2px 0 0">Você cria e nomeia. A margem é o lucro mínimo desejado sobre o preço de venda e define o piso. O preço próprio da faixa é opcional (vazio = preço do tipo).</div></div>';
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
        '" style="max-width:140px"></div><details><summary class="hint" style="cursor:pointer">Preço próprio por tipo (' + mpSim() + ')</summary><div class="col" style="gap:8px;margin-top:8px">';
      tipoAll().forEach(function (t) {
        if (!t.price) return;
        h +=
          '<div style="display:flex;gap:8px;align-items:center"><span style="flex:1 1 140px">' +
          esc(t.label) +
          '</span><input class="in" inputmode="' + mpMode() + '" data-aj="fprec" data-id="' +
          f.id +
          '" data-tipo="' +
          t.id +
          '" value="' +
          (f.precos && f.precos[t.id] ? gsParaCampo(f.precos[t.id]) : '') +
          '" placeholder="' +
          gsParaCampo(t.price) +
          '" style="max-width:150px"></div>';
      });
      h +=
        '</div></details><div><button class="chip" data-act="fdel" data-id="' +
        f.id +
        '">' +
        (S.fDelConf === f.id ? 'Confirmar: remover faixa' : 'Remover faixa') +
        '</button></div></div>';
    });
    h +=
      '<div style="display:flex;gap:8px"><input class="in" id="fnew" placeholder="Nome da nova faixa" style="flex:1" maxlength="30"><button class="chip on" data-act="fadd">+ Nova faixa</button></div></section>';
    // sazonalidade
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Estações do ano</h2><div class="hint" style="margin:2px 0 0">Quanto cada tipo vende em cada mês, em relação a um mês normal (1 = normal, 1,5 = 50% mais). Usado nos alertas de reposição, estoque parado e sugestão de margem.</div></div>';
    tipoAll().forEach(function (t) {
      h +=
        '<details><summary style="cursor:pointer;font-weight:600">' +
        esc(t.label) +
        '</summary><div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:8px">';
      for (var m = 0; m < 12; m++)
        h +=
          '<div><div class="hint" style="margin:0">' +
          MESES[m] +
          '</div><input class="in" inputmode="decimal" data-aj="saz" data-tipo="' +
          t.id +
          '" data-m="' +
          m +
          '" value="' +
          String(sazonFator(t.id, m)).replace('.', ',') +
          '" style="min-height:40px;padding:0 8px"></div>';
      h += '</div></details>';
    });
    h += '</section>';
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
      '<div><div class="lbl">Diferença de contagem tolerada (' + mpSim() + ')</div><input class="in" inputmode="decimal" data-aj="tol" value="' +
      usdParaCampo(S.tolUsd) +
      '" style="max-width:160px"><div class="hint">Na contagem de estoque, diferenças até esse valor ficam marcadas como perda aceita.</div></div></section>';
    // backup
    var dias = S.backupTs ? Math.floor((Date.now() - S.backupTs) / DAY) : -1;
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Backup dos dados</h2><div class="hint" style="margin:2px 0 0">Os dados ficam só neste celular. Guarde uma cópia de vez em quando (e antes de trocar de aparelho).</div></div><div class="hint" style="margin:0">' +
      (dias < 0 ? 'Nenhum backup feito ainda.' : 'Último backup: ' + (dias === 0 ? 'hoje' : 'há ' + dias + ' dia(s)') + '.') +
      '</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="chip on" data-act="bkexp">Exportar backup</button><button class="chip" data-act="bkimp">Importar backup</button></div>' +
      (S.bkText
        ? '<textarea class="in" readonly rows="5" style="width:100%;font-size:12px">' + esc(S.bkText) + '</textarea>'
        : '') +
      '</section>';
    h += ajustesFinHtml();
    el.innerHTML = h;
  }
  // Recalcula e salva uma alteração feita na aba Ajustes.
  $('v-ajustes').addEventListener('change', function (e) {
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
    if (k === 'fnome' && f && t.value.trim()) f.nome = t.value.trim();
    if (k === 'fmarg' && f) f.margem = Math.max(0, Math.min(90, numIn(t.value)));
    if (k === 'fprec' && f) {
      var pr = campoParaGs(t.value);
      f.precos = f.precos || {};
      if (pr > 0) f.precos[t.getAttribute('data-tipo')] = pr;
      else delete f.precos[t.getAttribute('data-tipo')];
    }
    if (k === 'saz') {
      var tp = t.getAttribute('data-tipo'),
        mm = +t.getAttribute('data-m'),
        cur = [];
      for (var i = 0; i < 12; i++) cur.push(sazonFator(tp, i));
      var nv = numIn(t.value);
      cur[mm] = nv > 0 ? nv : 1;
      S.sazon[tp] = cur;
    }
    if (k === 'vol') S.volume = Math.max(1, toNum(t.value) || S.volume);
    if (k === 'tol') S.tolUsd = campoParaUsd(t.value);
    render();
  });
  $('v-ajustes').addEventListener('input', function (e) {
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
    var r = new FileReader();
    r.onload = function () {
      var er = restaurarDados(String(r.result));
      S.ajMsg = er || 'Backup restaurado. Os dados atuais foram substituídos.';
      S._ajForce = true;
      render();
    };
    r.readAsText(f);
  };
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

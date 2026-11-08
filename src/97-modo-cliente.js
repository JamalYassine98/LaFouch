  // ===== Modo cliente — iPad da loja (v444, aprovado 05/11/2026) =====
  // O aparelho mostra SÓ o Catálogo de vendas (todas as peças à venda), só com o preço de VAREJO.
  // Sem custo, lucro, piso, venda, caixa, barra de baixo ou Ajustes. Ao abrir uma peça, o catálogo fica atrás desfocado
  // (o cliente não vê os ajustes) e deslizar passa para a próxima; o catálogo se arruma pelo que ele olha, sem se mexer na tela.
  // Parado 2 minutos: volta ao início, sem o histórico do cliente anterior.
  // v462 (07/11): liga pelo botão de tablet no topo do Catálogo (sem precisar de PIN); sai segurando o logo 5 s
  // (gesto escondido) + PIN/biometria se estiverem ligados.
  // Fica ligado só neste aparelho (localStorage lf_modoCli).
  S.modoCli = false;
  var MC_IDLE = 120000,
    mcT = 0;
  function mcLigado() {
    try {
      return localStorage.getItem('lf_modoCli') === '1';
    } catch (e) {
      return false;
    }
  }
  // segurar o logo do topo (1,5 s) pede o PIN para sair
  function mcTopo() {
    var lg = document.querySelector('.logo-top .brand');
    if (!lg || lg._mc) return;
    lg._mc = 1;
    var pt = 0;
    var solta = function () {
      clearTimeout(pt);
      lg.classList.remove('mcSeg');
    };
    lg.addEventListener('pointerdown', function () {
      if (!S.modoCli) return;
      lg.classList.add('mcSeg');
      pt = setTimeout(function () {
        solta();
        mcSair();
      }, 5000);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (n) {
      lg.addEventListener(n, solta);
    });
    lg.addEventListener('contextmenu', function (e) {
      if (S.modoCli) e.preventDefault();
    });
  }
  function mcAplica() {
    S.modoCli = mcLigado();
    document.body.classList.toggle('modoCli', S.modoCli);
    if (!S.modoCli) {
      document.body.classList.remove('mcAberto');
      return;
    }
    mcTopo();
    S.tabAtiva = 'pub';
    S.cart = S.cart || [];
    if (S.view !== 'vendas') setView('vendas');
    mcAcorda();
  }
  function mcLiga() {
    try {
      localStorage.setItem('lf_modoCli', '1');
    } catch (e) {}
    atdFim();
    S.vRef = '';
    mcAplica();
    render();
  }
  function mcSair() {
    var sai = function () {
      try {
        localStorage.removeItem('lf_modoCli');
      } catch (e) {}
      S.modoCli = false;
      document.body.classList.remove('modoCli', 'mcAberto');
      clearTimeout(mcT);
      render();
      lfToast('Modo cliente desligado · app normal');
    };
    if (pinAtivo() || S.bioOn) mostrarLock('confirm', sai);
    else sai();
  }
  // botão de tablet no topo do Catálogo (só fora do modo cliente)
  function mcBotao() {
    var tp = document.querySelector('#v-vendas > .top');
    if (!tp || tp.querySelector('.mcBtn')) return;
    tp.insertAdjacentHTML('beforeend', '<button type="button" class="ic mcBtn" data-act="mcLiga" aria-label="Modo cliente (iPad da loja)" title="Modo cliente"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M10 18h4"/></svg></button>');
  }
  // parado 2 min: volta ao início para o próximo cliente
  function mcInicio() {
    if (!S.modoCli) return;
    atdFim();
    S.vRef = '';
    S.vAb = '';
    S.vq = '';
    S.vTipo = 'all';
    var q = $('vq');
    if (q) q.value = '';
    [].forEach.call(document.querySelectorAll('.folha,.ljJn,.ljBk'), function (e) {
      if (e.classList.contains('ljJn') || e.classList.contains('ljBk')) e.remove();
    });
    if (S.view !== 'vendas') S.view = 'vendas';
    render();
    window.scrollTo(0, 0);
  }
  function mcAcorda() {
    clearTimeout(mcT);
    if (S.modoCli) mcT = setTimeout(mcInicio, MC_IDLE);
  }
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (n) {
    document.addEventListener(n, function () {
      if (S.modoCli) mcAcorda();
    }, { passive: true, capture: true });
  });
  ACT.mcLiga = mcLiga;
  // Ajustes › Modo cliente
  function mcAjHtml() {
    return (
      '<div class="hint" style="margin:0 0 8px">Para o iPad da loja: o aparelho mostra só o catálogo, com o preço de varejo. Sem custo, lucro, venda nem Ajustes. Parado 2 minutos, volta ao início. Para sair: segure o logo e digite o PIN.</div>' +
      (pinAtivo() ? '' : '<div class="note n-warn" style="margin:0 0 8px">Crie um PIN em Segurança antes: só o PIN tira do modo cliente.</div>') +
      '<button type="button" class="go" data-act="mcLiga" style="width:100%"' + (pinAtivo() ? '' : ' disabled') + '>Ligar neste aparelho</button>'
    );
  }
  setTimeout(function () {
    mcBotao();
    mcAplica();
  }, 0);

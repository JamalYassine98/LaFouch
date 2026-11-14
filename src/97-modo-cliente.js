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
  // segurar o logo do topo 5 s sai do modo cliente. v463 (07/11): no Android o toque longo na imagem cancelava o gesto
  // (pointercancel); agora escuta o documento, ignora o cancelamento e as imagens não recebem o toque.
  // Reserva: tocar no logo 7 vezes seguidas (em até 4 s) também sai.
  var mcPt = 0,
    mcTaps = [];
  function mcNoLogo(e) {
    return !!(S.modoCli && e.target && e.target.closest && e.target.closest('.logo-top .brand'));
  }
  function mcSolta() {
    clearTimeout(mcPt);
    mcPt = 0;
    var lg = document.querySelector('.logo-top .brand');
    if (lg) lg.classList.remove('mcSeg');
  }
  function mcComeca(e) {
    if (!mcNoLogo(e) || mcPt) return;
    var lg = document.querySelector('.logo-top .brand');
    if (lg) lg.classList.add('mcSeg');
    var ag = Date.now();
    mcTaps = mcTaps.filter(function (t) {
      return ag - t < 4000;
    });
    mcTaps.push(ag);
    if (mcTaps.length >= 7) {
      mcTaps = [];
      mcSolta();
      mcSair();
      return;
    }
    mcPt = setTimeout(function () {
      mcSolta();
      mcSair();
    }, 5000);
  }
  document.addEventListener('touchstart', mcComeca, { passive: true, capture: true });
  document.addEventListener('mousedown', mcComeca, true);
  ['touchend', 'mouseup'].forEach(function (n) {
    document.addEventListener(n, function () {
      if (mcPt) mcSolta();
    }, true);
  });
  document.addEventListener('contextmenu', function (e) {
    if (mcNoLogo(e)) e.preventDefault();
  }, true);
  function mcTopo() {}
  function mcAplica() {
    S.modoCli = mcLigado();
    document.body.classList.toggle('modoCli', S.modoCli);
    if (!S.modoCli) {
      mcTrava(false);
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
      mcTrava(false);
      document.body.classList.remove('modoCli');
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
  setTimeout(function () {
    mcBotao();
    mcAplica();
  }, 0);
  // v465: produto aberto no modo cliente = a página de trás fica TRAVADA (mesma regra do site, html.ppop):
  // só a janela do produto rola, sem "vazar" para o catálogo; ao fechar, o catálogo volta para onde estava.
  var mcY = 0;
  function mcTrava(on) {
    var de = document.documentElement,
      era = document.body.classList.contains('mcAberto');
    if (on === era) return;
    if (on) {
      mcY = window.scrollY || de.scrollTop || 0;
      document.body.classList.add('mcAberto');
      de.classList.add('mcTrava');
      document.body.style.top = -mcY + 'px';
    } else {
      document.body.classList.remove('mcAberto');
      de.classList.remove('mcTrava');
      document.body.style.top = '';
      window.scrollTo(0, mcY);
    }
  }

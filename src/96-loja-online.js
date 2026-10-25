  // ===== Loja online: o painel do catálogo (lafouch.com) dentro do app, para editar preços, ofertas, fotos e ligar/desligar o site. =====
  var LOJA_URL = 'https://lafouch.com/admin.html';
  function renderLojaOnline() {
    var el = $('v-onl');
    if (!el || S.view !== 'onl') return;
    // o quadro é criado uma vez só: render() redesenha tudo e fecharia o painel no meio da edição
    if (el.getAttribute('data-ok') === '1' && el.querySelector('iframe')) return;
    if (navigator.onLine === false) {
      el.removeAttribute('data-ok');
      el.innerHTML =
        '<div class="nav uniTabs" id="uniS" role="group" aria-label="Seções de produtos" style="margin:4px 0 8px"></div>' +
        '<section class="card" style="text-align:center;padding:22px"><b style="font-size:17px">Sem internet</b>' +
        '<p style="color:var(--mu);margin:8px 0 14px">A loja online só abre com internet, porque os dados ficam na nuvem.</p>' +
        '<button type="button" class="mini" data-act="lojaRecarregar">Tentar de novo</button></section>';
      return;
    }
    el.setAttribute('data-ok', '1');
    el.innerHTML =
      '<div class="nav uniTabs" id="uniS" role="group" aria-label="Seções de produtos" style="margin:4px 0 8px"></div>' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin:0 0 8px;flex-wrap:wrap">' +
      '<b style="font-size:17px">Loja online</b>' +
      '<a class="chip" href="' + LOJA_URL + '" target="_blank" rel="noopener">Abrir em tela cheia</a></div>' +
      '<iframe id="lojaFrame" title="Painel da loja online" src="' + LOJA_URL + '" style="width:100%;height:calc(100vh - 190px);min-height:520px;border:1px solid var(--ln);border-radius:16px;background:#fff" allow="clipboard-write"></iframe>';
  }
  window.addEventListener('online', function () {
    if (S.view === 'onl') render();
  });
  ACT.lojaRecarregar = function () {
    var el = $('v-onl');
    if (el) el.removeAttribute('data-ok');
    render();
  };

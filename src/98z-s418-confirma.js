  // ===== S418 (18/11/2026, esboços 110c e 111 aprovados 17/11): regras de confirmação pela consequência =====
  // B = mexe com cliente/site/nuvem/dinheiro ou não tem volta → UMA janela de confirmação (lfConfirma).
  // A = volta fácil e só mexe neste aparelho → faz na hora + "Desfazer".
  // Somem: "tocar de novo", a caixa cinza do navegador e a pergunta dupla.
  // o.k = chave da ação: chamar a mesma ação de novo com a janela aberta confirma (compatível com quem chamava 2×).
  var cfAtual = null;
  function lfConfirma(o) {
    if (o.k && cfAtual && cfAtual.k === o.k) {
      var f = cfAtual;
      cfAtual = null;
      f.api.fecha();
      o.fn();
      return;
    }
    var j = lfJanela({
      titulo: o.t,
      cls: 'lfCf',
      aoFechar: function () {
        if (cfAtual && cfAtual.api === j) cfAtual = null;
      },
      monta: function (c, api) {
        c.innerHTML =
          '<div class="cf418">' +
          (o.q ? '<div class="cf418Q"><span>' + esc(o.q) + (o.d ? '<small>' + esc(o.d) + '</small>' : '') + '</span>' + (o.v ? '<b>' + esc(o.v) + '</b>' : '') + '</div>' : '') +
          '<p class="cf418F">' + (o.nv ? '<b>Não tem volta.</b> ' : '') + esc(o.f || '') + '</p>' +
          '<button type="button" class="cf418B">' + esc(o.b) + '</button>' +
          '<button type="button" class="cf418V">Voltar</button></div>';
        c.querySelector('.cf418B').onclick = function () {
          cfAtual = null;
          api.fecha();
          o.fn();
        };
        c.querySelector('.cf418V').onclick = api.fecha;
      }
    });
    cfAtual = { k: o.k, api: j };
    return j;
  }
  window.__lfConfirma = lfConfirma;
  function copia(v) {
    return JSON.parse(JSON.stringify(v == null ? null : v));
  }
  // S418 (125c): moeda da retirada por toque (no lugar da lista do navegador)
  ACT.rtMoe = function (m) {
    if (!/^(pyg|usd|brl)$/.test(m)) return;
    S.rtMoe = m;
    var i = $('rtM');
    if (i) i.value = m;
    document.querySelectorAll('[data-act=rtMoe]').forEach(function (b) {
      var on = b.getAttribute('data-id') === m;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
    });
  };

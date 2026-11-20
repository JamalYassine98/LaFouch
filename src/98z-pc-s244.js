  // ===== S370 (16/11/2026) — item 7 de 13/11 (aprovado 14/11 00:08; esboços work/s244) =====
  // Computador (≥ 1024 px): a ação da página fica AO LADO do título (não no canto); o Inventário usa a largura toda —
  // os dois números sobem para a linha das abas e a busca ocupa a largura inteira. O celular não muda.
  function pcLarga() {
    var v = $('v-estoque'), k = $('kpisE'), t = $('eTabs');
    if (!v || !k || !t) return;
    var on = window.innerWidth >= 1024 && S.view === 'estoque',
      w = $('eLinha'),
      q = $('q'),
      bx = q && q.closest('div[style*="max-width"]');
    if (on) {
      if (!w) {
        w = document.createElement('div');
        w.id = 'eLinha';
        t.parentNode.insertBefore(w, t);
      }
      if (t.parentNode !== w) w.appendChild(t);
      if (k.parentNode !== w) w.appendChild(k);
      v.classList.add('pcLarga');
      if (bx) bx.classList.add('pcBusca');
    } else if (w) {
      w.parentNode.insertBefore(t, w);
      var mn = v.querySelector(':scope > .main');
      if (mn) mn.parentNode.insertBefore(k, mn);
      else t.parentNode.insertBefore(k, t.nextSibling);
      w.remove();
      v.classList.remove('pcLarga');
      if (bx) bx.classList.remove('pcBusca');
    }
  }
  aposRender(pcLarga);
  window.addEventListener('resize', function () { try { pcLarga(); } catch (e) {} });
  // ===== S370 · item 17 de 13/11 (aprovado 14/11 00:19): o que aparecia SECO entra suave (filtros do Histórico, "+ Novo cliente") =====
  var _cln17 = ACT.clinovo;
  ACT.clinovo = function () {
    var r = _cln17.apply(this, arguments);
    var c = document.querySelector('#v-clientes #cNome');
    if (c && c.closest('section')) animEnter(c.closest('section'));
    return r;
  };
  // ===== S370 · item 18 de 13/11: o desenho da tela vazia acontece UMA vez por tela (não a cada redesenho / "Verificar agora") =====
  var VAZ18 = {};
  function vazio18() {
    [].forEach.call(document.querySelectorAll('.view .lfVazio'), function (e) {
      var v = e.closest('.view'), k = v ? v.id : '';
      if (!k) return;
      if (VAZ18[k] && !e.classList.contains('lfVazioJa')) e.classList.add('lfVazioJa');
      if (!v.hidden) VAZ18[k] = 1;
    });
  }
  aposRender(vazio18);
  // ===== S370 · item 11 de 13/11 (aprovado 14/11 00:08; esboço work/s241/s241_celular_claro_nuvem.jpg): CÓPIAS E NUVEM ENXUTA =====
  // Com a nuvem conectada: o estado ("Tudo salvo · há N min · N aparelhos") e 4 linhas que abrem o resto —
  // Voltar no tempo · Lixeira · Aparelhos · Arquivo de backup. Sem nuvem continua como antes (é preciso o formulário de entrar).
  function nvHa(ts) {
    if (!ts) return 'sem cópia ainda';
    var m = Math.max(0, Math.round((Date.now() - ts) / 60000));
    return m < 1 ? 'agora' : m < 60 ? 'há ' + m + ' min' : m < 1440 ? 'há ' + Math.round(m / 60) + ' h' : 'há ' + Math.round(m / 1440) + (Math.round(m / 1440) === 1 ? ' dia' : ' dias');
  }
  function nvLinha(act, t, v) {
    return '<button type="button" class="nvxL" data-act="' + act + '"><span>' + t + '</span><small>' + esc(v) + '</small><i aria-hidden="true">›</i></button>';
  }
  function nuvemEnxutaHtml() {
    var ts = S.nuvem.ts || 0, rec = ts && Date.now() - ts < 2 * 3600e3,
      ap = (S._syncAps || []).filter(function (x) { return x.ap; }).length,
      lx = typeof fotoLixeira === 'function' ? fotoLixeira().length : 0,
      vt = (S.elog || []).length ? (S.elog[S.elog.length - 1] || {}).ts : 0,
      est = rec ? 'Tudo salvo' : ts ? 'Cópia antiga' : 'Ainda sem cópia';
    var h = '<section class="card col nvx">' +
      '<button type="button" class="nvxE" data-act="nvxNuvem"><i class="' + (rec ? 'ok' : 'w') + '" aria-hidden="true"></i><span><b>' + est + '</b><small>' + nvHa(ts) + (ap ? ' · ' + ap + (ap === 1 ? ' aparelho' : ' aparelhos') : '') + '</small></span></button>' +
      nvLinha('vtAbre', 'Voltar no tempo', vt ? new Date(vt).toLocaleDateString('pt-BR') + ', ' + fh(vt) : 'abrir') +
      nvLinha('fotolixabre', 'Lixeira', lx + (lx === 1 ? ' item' : ' itens')) +
      nvLinha('nvxAps', 'Aparelhos', ap ? String(ap) : 'ver') +
      nvLinha('nvxArq', 'Arquivo de backup', 'exportar ou importar') + '</section>';
    return { t: 'Cópias e nuvem', r: est, al: !rec, h: h };
  }
  function nvxJanela(tit, html) { lfJanela({ titulo: tit, monta: function (box) { box.innerHTML = html; } }); }
  ACT.nvxNuvem = function () { nvxJanela('Nuvem', nvCard()); };
  ACT.nvxAps = function () { nvxJanela('Aparelhos', typeof apCardHtml === 'function' && apCardHtml() ? apCardHtml() : '<div class="hint">Só este aparelho.</div>'); };
  ACT.nvxArq = function () { nvxJanela('Arquivo de backup', backupHtml()); };

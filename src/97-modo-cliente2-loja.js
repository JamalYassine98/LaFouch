  // ===== S181 (aprovado 12/11/2026): MODO LOJA — o catálogo do modo cliente é o próprio site =====
  // O app leva uma cópia do site (www/loja/, copiada pelo build.js) e abre loja.html?loja=1&nosync numa tela cheia.
  // Funciona sem internet: o app manda TODO o inventário com estoque (preço de varejo, com as ofertas do site, fotos do app)
  // por postMessage. "Comprar" vira "Quero este"; o cliente junta as peças em "Meu pedido" e toca "Chamar um vendedor":
  // o tablet apita, o celular do vendedor recebe o aviso (função avisarChama) e as peças entram no carrinho do app.
  // Sair: segurar o logo 5 s (ou 7 toques) → PIN/biometria. Parado 2 min: o site volta ao início e o Meu pedido some.
  var ML = { fr: null, ped: [], ok: false, t: 0 };
  function mlDocs() {
    var refs = {};
    (S.items || []).forEach(function (it) { if (it && it.ref && it.qty > 0) refs[it.ref] = 1; });
    return Object.keys(refs).map(function (ref) {
      try {
        var u = vitProduto(ref);
        if (!(u.n > 0)) return null;
        var b = vitDocBody(ref, u), f = vitFotos(ref).filter(Boolean);
        delete b.fv;
        b.ref = ref;
        if (f[0]) b.foto = f[0];
        if (f.length) b.fc = f;
        return { name: 'produtos/' + ref, fields: JSON.parse(vBody(b)).fields };
      } catch (e) { return null; }
    }).filter(Boolean);
  }
  function mlPosta(o) { try { if (ML.fr && ML.fr.contentWindow) ML.fr.contentWindow.postMessage(Object.assign({ lfLoja: 1 }, o), '*'); } catch (e) {} }
  function mlManda() { mlPosta({ t: 'dados', docs: mlDocs(), cfg: { ativo: true } }); }
  function mlNorm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim(); }
  // peças do Meu pedido → carrinho do app (sem passar do estoque; junta com o que já está lá)
  function mlCarrinho(itens) {
    S.cart = S.cart || [];
    var n = 0;
    (itens || []).forEach(function (x) {
      var q = Math.max(1, +x.q || 1);
      // a cor vem pelo índice (o site traduz o nome da cor; o índice é o mesmo das fotos do app)
      var vc = null;
      try { vc = x.ci != null ? (vitCores(x.ref)[+x.ci] || {}).cor : null; } catch (e) {}
      var cor = vc != null ? vc : x.cor;
      (S.items || []).filter(function (it) {
        return it.ref === x.ref && it.qty > 0 && (cor == null || cor === '' || mlNorm(it.cor) === mlNorm(cor)) && (!x.grau || String(it.grau) === String(x.grau) || parseFloat(it.grau) === parseFloat(x.grau));
      }).forEach(function (it) {
        if (q <= 0) return;
        var ex = S.cart.filter(function (l) { return l.it === it; })[0], ja = ex ? ex.qty : 0, take = Math.min(q, it.qty - ja);
        if (take <= 0) return;
        if (ex) ex.qty += take; else S.cart.push({ it: it, qty: take, tab: 'pub', preco: null });
        q -= take; n += take;
      });
    });
    saveSoon();
    return n;
  }
  function mlChama(itens) {
    var n = mlCarrinho(itens);
    try { if (typeof avTocar === 'function') avTocar('sino'); } catch (e) {}
    try { if (navigator.vibrate) navigator.vibrate([200, 100, 200]); } catch (e) {}
    lfToast('🛎️ Cliente chamando · ' + n + (n === 1 ? ' peça' : ' peças') + ' no carrinho');
    if (typeof nvApi === 'function' && S.nuvem && S.nuvem.rt) {
      var id = 'c' + Date.now().toString(36);
      nvApi('POST', 'lojaChama?documentId=' + id, JSON.stringify({ fields: { n: { integerValue: String(n) }, ts: { integerValue: String(Date.now()) }, de: { stringValue: (typeof PUSH !== 'undefined' && PUSH.tok) || '' } } })).catch(function () {});
    }
  }
  function mlLimpa() { ML.ped = []; mlPosta({ t: 'limpa' }); }
  // a cópia do site (www/loja/) só chega com um APK novo; a atualização automática traz só app.js/style.css.
  // Sem a cópia, fica o modo cliente antigo (catálogo do app) em vez de uma tela em branco.
  var mlTem = null;
  function mlConfere() {
    if (mlTem !== null) return Promise.resolve(mlTem);
    return fetch('loja/loja.html', { cache: 'no-store' }).then(function (r) { mlTem = !!(r && r.ok); return mlTem; }, function () { mlTem = false; return false; });
  }
  function mlAbre() {
    if (document.getElementById('mlWrap')) return;
    if (mlTem !== true) { mlConfere().then(function (ok) { if (ok && S.modoCli && mcLigado()) mlAbre(); }); return; }
    var w = document.createElement('div');
    w.id = 'mlWrap';
    w.innerHTML = '<iframe id="mlFr" title="Catálogo da loja" src="loja/loja.html?loja=1&nosync" allow="autoplay"></iframe>' +
      '<div class="logo-top mlHot" aria-hidden="true"><span class="brand"><svg class="mlAnel" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17"/></svg></span></div>';
    document.body.appendChild(w);
    ML.fr = w.querySelector('iframe');
    document.documentElement.classList.add('mlOn');
  }
  function mlFecha() {
    var w = document.getElementById('mlWrap');
    if (w) w.remove();
    ML.fr = null; ML.ok = false; ML.ped = [];
    document.documentElement.classList.remove('mlOn');
  }
  window.addEventListener('message', function (e) {
    var d = e.data || {};
    if (!d.lfLoja || !ML.fr || e.source !== ML.fr.contentWindow) return;
    if (typeof mcAcorda === 'function') mcAcorda();
    if (d.t === 'pronto') { ML.ok = true; mlManda(); }
    else if (d.t === 'pedido') ML.ped = (d.itens || []).slice(0, 40);
    else if (d.t === 'chama') mlChama((d.itens || []).slice(0, 40));
  });
  // toques dentro do site não chegam ao app: o site avisa (postMessage) e o app conta como atividade; sem aviso por 2 min = limpa
  setInterval(function () {
    var on = !!S.modoCli && mcLigado();
    if (on && !document.getElementById('mlWrap')) mlAbre();
    if (!on && document.getElementById('mlWrap')) mlFecha();
  }, 600);
  // estoque mudou (venda no outro aparelho, sync): manda de novo, no máximo a cada 30 s
  setInterval(function () { if (ML.ok && document.getElementById('mlWrap') && !document.hidden) mlManda(); }, 30000);
  var _mcInicio = mcInicio;
  mcInicio = function () { _mcInicio(); if (document.getElementById('mlWrap')) mlLimpa(); };

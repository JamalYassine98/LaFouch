/* S428 esboço MENU NO ESTILO APPLE (dono 18/11 22:08: "pq o nosso não é profissional assim?").
   - O menu ocupa a tela toda, abaixo do topo (o topo continua à vista); o ☰ vira × no mesmo lugar e fecha (acessível: "Fechar menu").
   - Sai o cabeçalho "MENU ×", saem os títulos de seção, os fios e as caixas; os grupos se separam por espaço (24/32 px).
   - Itens de compra grandes (letra do título, 26 px); ferramentas e ajuda menores (17 px, mesma família); "›" discreto (sai daqui).
   - Feminino · Masculino · Unissex viram 3 links de texto numa linha (a mesma função de hoje).
   - Cartão da conta como aprovado (A); a faixa da temática fica embaixo do menu (aprovado/enviado). Entra com um esmaecer de 0,25 s. */
(function(){
  var css=''+
  'html body .top{transition:none}html.lfap body .top{z-index:60!important}html.lfap body #evbar{z-index:30!important}'+
  'html body #drw.lfap.lfap.lfap .dsc{display:none!important}'+
  'html body #drw.lfap.lfap.lfap .dpn{top:var(--hth,73px)!important;bottom:0!important;left:0!important;right:0!important;width:auto!important;border:0!important;transform:none!important;opacity:0;transition:opacity .25s cubic-bezier(.2,.8,.2,1)!important;padding:8px 16px calc(32px + env(safe-area-inset-bottom,0px))!important}'+
  'html body #drw.lfap.lfap.lfap.on .dpn{opacity:1}'+
  'html body #drw.lfap.lfap.lfap .dhd{display:none!important}'+
  'html body #drw.lfap.lfap.lfap .dnv{padding:0!important;margin:0!important}'+
  'html body #drw.lfap.lfap.lfap .dnv>.dacc{margin:16px 0 24px!important}'+
  'html body #drw.lfap.lfap.lfap .dnv>small.dgl{display:block!important;visibility:hidden;height:16px!important;margin:0!important;padding:0!important;font-size:0!important}'+
  'html body #drw.lfap.lfap.lfap .dnv>a:not(.dacc){border:0!important;box-shadow:none!important;padding:12px 0!important;min-height:44px;display:flex!important;align-items:center;justify-content:space-between;font-family:var(--display),Georgia,serif!important;font-weight:500!important;font-size:17px!important;letter-spacing:0!important}'+
  'html body #drw.lfap.lfap.lfap .dnv>a[data-mf^="tipo:"]{font-size:26px!important;font-weight:600!important;padding:8px 0!important;letter-spacing:-.01em!important}'+
  'html body #drw.lfap.lfap.lfap .dnv>a:not(.dacc):after{opacity:.45}'+
  'html body #drw.lfap.lfap.lfap .dnv>.dch{display:flex!important;gap:24px;border:0!important;margin:8px 0 8px!important;padding:0!important;grid-template-columns:none!important}'+
  'html body #drw.lfap.lfap.lfap .dnv>.dch a{border:0!important;padding:12px 0!important;min-height:44px;display:flex!important;align-items:center;font:500 15px var(--body),Inter,system-ui,sans-serif!important;color:var(--mu)!important;background:none!important}'+
  'html body #drw.lfap.lfap.lfap #dset.dset{border:0!important;margin:24px 0 0!important;padding:0!important}html body #drw.lfap.lfap.lfap #dset.dset>button{border:0!important;padding-left:0!important;padding-right:0!important;margin-left:0!important;margin-right:0!important}'+
  'html body #drw.lfap.lfap.lfap .dct{border:0!important;margin-top:32px!important;padding-left:0!important;padding-right:0!important}'+
  '#mnb .lfx{display:none}html.lfap #mnb .lfx{display:block}html.lfap #mnb .lfh{display:none}';
  var s=document.createElement('style');s.textContent=css;document.head.appendChild(s);
  function prep(){var d=document.getElementById('drw'),m=document.getElementById('mnb');if(!d||!m)return;d.classList.add('lfap');
    if(!m.querySelector('.lfx')){var sv=m.querySelector('svg');if(sv){sv.classList.add('lfh');var x=document.createElementNS('http://www.w3.org/2000/svg','svg');x.setAttribute('class','lfx');x.setAttribute('width','22');x.setAttribute('height','22');x.setAttribute('viewBox','0 0 24 24');x.setAttribute('fill','none');x.setAttribute('stroke','currentColor');x.setAttribute('stroke-width','2');x.setAttribute('stroke-linecap','round');x.setAttribute('aria-hidden','true');x.innerHTML='<path d="M6 6l12 12M18 6L6 18"/>';m.appendChild(x)}}
    var on=d.classList.contains('on');document.documentElement.classList.toggle('lfap',on);m.setAttribute('aria-label',on?'Fechar menu':'Menu');m.setAttribute('aria-expanded',on?'true':'false')}
  document.addEventListener('click',function(e){var m=e.target.closest&&e.target.closest('#mnb'),d=document.getElementById('drw');
    if(m&&d&&d.classList.contains('on')){e.preventDefault();e.stopImmediatePropagation();var c=d.querySelector('[data-dclose]');if(c)c.click()}},true);
  var t=0;new MutationObserver(function(){if(t)return;t=requestAnimationFrame(function(){t=0;prep()})}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});prep();
})();

/* S428 esboço MENU COM A CARA DA LA FOUCH (dono 18/11 23:45: "ta parecido demais com a apple"). Mantém o funcionamento aprovado
   (tela toda, mesma animação nos 3, × no canto) e troca a aparência pela identidade da loja:
   - fundo rosado da marca (vinho a 6% sobre o fundo) nas 3 folhas + fio fino vinho logo abaixo do ×;
   - categorias na serifada da marca com a segunda palavra em itálico (como o "Óculos de sol hexagonal" do início);
   - × dentro de um círculo de fio fino (como o ícone da conta aprovado), em vinho;
   - escudo LF pequeno no fim da folha, como assinatura, acima do endereço. */
(function(){
  var css='@media (max-width:1099px){'+
    'html body #drw.lfap.lfap.lfap.lfap .dpn,html body #sov .sopn,html.v5 body #layer .scrim.pg.lfct{background:color-mix(in srgb,var(--ac) 6%,var(--bg))!important}'+
    '#lfx3b{color:var(--ac)!important}#lfx3b:before{content:"";position:absolute;inset:2px;border:1px solid color-mix(in srgb,var(--ac) 40%,transparent);border-radius:50%}'+
    '#lfx3t{position:fixed;left:0;right:0;top:0;height:calc(61px + env(safe-area-inset-top,0px));background:color-mix(in srgb,var(--ac) 6%,var(--bg));z-index:10080;display:none}html.lfo #lfx3t{display:block;animation:lfsh .28s cubic-bezier(.2,.8,.2,1) both}'+
    '#lfx3l{position:fixed;left:16px;right:16px;top:calc(60px + env(safe-area-inset-top,0px));height:1px;background:color-mix(in srgb,var(--ac) 30%,transparent);z-index:10085;display:none}'+
    'html.lfo #lfx3l{display:block;animation:lfsh .28s cubic-bezier(.2,.8,.2,1) both}'+
    'html body #drw.lfap.lfap.lfap.lfap .dnv>a[data-mf^="tipo:"]{font-weight:500!important}html body #drw.lfap.lfap.lfap.lfap .dnv>a[data-mf^="tipo:"] i{font-style:italic;font-weight:400}'+
    'html body #drw.lfap.lfap.lfap.lfap .lfesc{display:block;width:40px;height:40px;margin:32px auto 16px;mix-blend-mode:multiply;opacity:.85}'+
  '}';
  var s=document.createElement('style');s.textContent=css;document.head.appendChild(s);
  var l=document.createElement('div');l.id='lfx3l';l.setAttribute('aria-hidden','true');document.body.appendChild(l);
  var tb=document.createElement('div');tb.id='lfx3t';tb.setAttribute('aria-hidden','true');document.body.appendChild(tb);/* faixa do × fica opaca: o conteúdo rola por baixo dela, não por baixo do × */
  var N={'tipo:solar':'Óculos de <i>sol</i>','tipo:grau':'Óculos de <i>leitura</i>','tipo:armacao':'Armações de <i>grau</i>','tipo:of':'<i>Ofertas</i>'};
  function aj(){var n=document.querySelector('#drw .dnv');if(!n)return;
    Object.keys(N).forEach(function(k){var a=n.querySelector(':scope>a[data-mf="'+k+'"]');if(a&&a.getAttribute('data-lfn')!=='1'){a.innerHTML='<lf-n>'+N[k]+'</lf-n>';a.setAttribute('data-lfn','1')}});
    var d=document.querySelector('#drw .dct');if(d&&!d.querySelector('.lfesc')){var i=document.createElement('img');i.className='lfesc';i.src='/favicon-96.png';i.alt='';d.insertBefore(i,d.firstChild)}}
  var t=0;new MutationObserver(function(){if(t)return;t=requestAnimationFrame(function(){t=0;aj()})}).observe(document.body,{subtree:true,childList:true});aj();
})();

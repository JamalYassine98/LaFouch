/* PINTURA (só no esboço) · IDEIAS 12c · "a vitrine da data" (dono 23/11 15:11: "bonito, mas do jeito que tá ou é muito seco, ou não é luxuoso").
   O meio-termo das maisons: a loja continua branca e na cor da marca; a DATA ganha UM lugar rico, a foto da campanha:
   - a foto vira uma VITRINE: fundo profundo na cor da data (como veludo), com um desenho de linhas finas douradas da data
     (estrelas no Natal, flores nas Mães, risca de giz nos Pais, bolhas no Ano Novo, risca dourada na BF, luas no Halloween);
   - a peça aparece dentro de um ARCO branco (o desenho das vitrines de joalheria), girando devagar como no 06d;
   - o Mochi com o chapéu da data (o aprovado em 10–11/11) fica pequeno no canto da vitrine;
   - o texto, o botão (família 09, cor da marca) e a seleção ficam embaixo, no branco — a identidade não muda.
   Uma regra só: cada data declara só a cor de fundo (2 tons) e o desenho; o resto é igual. */
(function(){
 var D={
  natal:{a:'#5e1420',b:'#9a2636',m:'estrela'}, maes:{a:'#7a2b4b',b:'#b4557c',m:'flor'}, pais:{a:'#16233b',b:'#2e4770',m:'risca'},
  anonovo:{a:'#5b4824',b:'#9c8048',m:'bolha'}, bf:{a:'#0b0b0b',b:'#2b2b2b',m:'risca'}, halloween:{a:'#26132f',b:'#53305f',m:'lua'}};
 var OURO='rgba(214,186,122,.55)';
 function mot(m){var s='';
  if(m==='estrela'){[[18,22,5],[78,14,3.5],[60,40,2.6],[30,62,3],[88,70,4.5],[12,86,2.4],[52,90,3.4]].forEach(function(p){var x=p[0],y=p[1],r=p[2];
    s+='<path d="M'+x+' '+(y-r)+' Q'+(x+r*.18)+' '+(y-r*.18)+' '+(x+r)+' '+y+' Q'+(x+r*.18)+' '+(y+r*.18)+' '+x+' '+(y+r)+' Q'+(x-r*.18)+' '+(y+r*.18)+' '+(x-r)+' '+y+' Q'+(x-r*.18)+' '+(y-r*.18)+' '+x+' '+(y-r)+'Z" fill="'+OURO+'"/>'})}
  if(m==='flor'){[[16,20],[84,26],[22,80],[80,84],[50,10]].forEach(function(p){for(var k=0;k<5;k++)s+='<ellipse cx="'+p[0]+'" cy="'+(p[1]-3.2)+'" rx="1.7" ry="3.2" fill="none" stroke="'+OURO+'" stroke-width=".5" transform="rotate('+(k*72)+' '+p[0]+' '+p[1]+')"/>';s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r=".9" fill="'+OURO+'"/>'})}
  if(m==='risca'){for(var i=-100;i<200;i+=7)s+='<path d="M'+i+' 0 L'+(i+100)+' 100" stroke="'+OURO+'" stroke-width=".22" opacity=".7"/>'}
  if(m==='bolha'){[[14,80,2.6],[24,60,1.6],[18,36,1],[84,78,3],[78,52,1.8],[88,30,1.1],[70,16,.8],[30,14,.9]].forEach(function(p){s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+p[2]+'" fill="none" stroke="'+OURO+'" stroke-width=".45"/>'})}
  if(m==='lua'){[[18,20,5],[84,72,4],[80,18,2.6],[16,82,3]].forEach(function(p){var x=p[0],y=p[1],r=p[2];s+='<path d="M'+(x+r*.3)+' '+(y-r)+' A'+r+' '+r+' 0 1 0 '+(x+r*.3)+' '+(y+r)+' A'+(r*.78)+' '+(r*.78)+' 0 1 1 '+(x+r*.3)+' '+(y-r)+'Z" fill="'+OURO+'"/>'})}
  return 'url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">'+s+'</svg>')+'")'}
 var st=document.createElement('style');st.id='pinta12c';
 st.textContent=
  '.lfcamp{border:0!important;background:transparent!important;border-radius:0!important;margin:16px 16px 8px!important;overflow:visible!important}'+
  '.lfcamp .ft{aspect-ratio:auto!important;height:420px;border-radius:20px;background:var(--vt2)!important;background-image:var(--vtm),radial-gradient(120% 90% at 50% 30%,var(--vt2) 0%,var(--vt1) 100%)!important;background-size:100% 100%,100% 100%!important}'+
  /* o arco branco: a vitrine */
  '.lfcamp .ft .arco{position:absolute;left:50%;top:44px;width:230px;height:300px;transform:translateX(-50%);background:#fff;border-radius:115px 115px 18px 18px;overflow:hidden;box-shadow:0 0 0 1px rgba(214,186,122,.55),0 0 0 7px var(--vt1),0 0 0 8px rgba(214,186,122,.35)}'+
  '.lfcamp .ft .arco .sl{background-size:94%!important}'+
  '.lfcamp .ft .vmo{position:absolute;right:14px;bottom:10px;width:84px;height:72px;pointer-events:none}'+
  '.lfcamp .ft .vmo svg{width:100%;height:100%}'+
  '.lfcamp .tx{padding:24px 24px 8px!important;text-align:center}.lfcamp .tx .sel{justify-content:center}'+
  '.lfcamp h2{font-size:32px!important}.lfcamp .k{letter-spacing:.2em!important}';
 (document.head||document.documentElement).appendChild(st);
 function monta(){var c=document.querySelector('#home .lfcamp');if(!c||c.dataset.v12c)return;var ev=(document.documentElement.getAttribute('data-ev')||'').replace(/-[nd]$/,'');var d=D[ev];if(!d)return;
  c.dataset.v12c=1;c.style.setProperty('--vt1',d.a);c.style.setProperty('--vt2',d.b);c.style.setProperty('--vtm',mot(d.m));
  var ft=c.querySelector('.ft');var ar=document.createElement('div');ar.className='arco';[].slice.call(ft.querySelectorAll('.sl')).forEach(function(s){ar.appendChild(s)});ft.appendChild(ar);
  (function poe(n){var f=window.__lfMochiSvg;/* nas Mães e Pais o chapéu desce depois: espera o site (mesmo caminho do site, com os braços) */
   if(typeof f!=='function'){if(n<40)setTimeout(function(){poe(n+1)},250);return}
   var m=document.createElement('div');m.className='vmo';m.setAttribute('data-mochi','');m.innerHTML=f();ft.appendChild(m);
   if(window.__lfMochiArms)window.__lfMochiArms(m.querySelector('svg'),{face:'feliz'})})(0)}
 new MutationObserver(monta).observe(document.documentElement,{childList:true,subtree:true});monta();
})();

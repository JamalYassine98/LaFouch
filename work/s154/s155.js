/* S154 esboço: catálogo sem as bolinhas; linha de opções de gênero + "Filtros e ordem ›" */
(function(){
var css=document.createElement('style');css.textContent=
'#ftog,#fbtn,#vtog{display:none!important}'+
'.s54{display:flex;align-items:center;gap:8px;overflow-x:auto;scrollbar-width:none;margin:2px 0 14px;padding:2px 0}.s54::-webkit-scrollbar{display:none}'+
'.s54{gap:22px!important}.s54 button{flex:none;position:relative;height:32px;padding:0;border:0;background:none;color:#7a6772;font:500 15px var(--body);transition:color .2s}.s54 button:after{content:"";position:absolute;left:0;right:0;bottom:2px;height:1.5px;background:#8d3a69;transform:scaleX(0);transition:transform .25s}.s54 button.on{color:#2a1f27}.s54 button.on:after{transform:scaleX(1)}.s54 button.hv{color:#8d3a69}'+
'.s54 a{flex:none;margin-left:auto;padding:0 4px 0 12px;color:#8d3a69;font:500 14px var(--body);text-decoration:none;white-space:nowrap}.s54 a i{font-style:normal;display:inline-block;transition:transform .25s}.s54 a.hv i{transform:translateX(4px)}';
document.head.appendChild(css);
window.__s54=function(sel,hv){var ms=document.querySelector('#vscr .mobsearch');if(!ms)return 'sem';var o=document.querySelector('.s54');if(o)o.remove();document.querySelectorAll('.s54m').forEach(function(x){x.remove()});o=document.createElement('div');o.className='s54';
 var G=[['','Todos'],['f','Feminino'],['m','Masculino'],['u','Unissex']];
 o.innerHTML=G.map(function(g){return '<button data-g="'+g[0]+'" class="'+(g[0]===sel?'on':(hv===g[0]?'hv':''))+'">'+g[1]+'</button>'}).join('')+'<a href="#" class="'+(hv==='link'?'hv':'')+'">Filtros <i>›</i></a>';
 ms.insertAdjacentElement('afterend',o);
 o.querySelectorAll('button').forEach(function(b){b.onclick=function(){var t=document.querySelector('.fpn [data-fgn="'+b.dataset.g+'"]');if(t)t.click();window.__s54(b.dataset.g)}});
 var lk=o.querySelector('a');lk.onclick=function(e){e.preventDefault();var f=document.getElementById('fbtn');f&&f.click()};
 if(innerWidth<700){var a=lk,v=document.querySelector('#vscr .mobsearch');if(v){a.style.cssText='margin-left:auto;align-self:flex-end;padding:0 0 6px;color:#8d3a69;font:500 14px var(--body);text-decoration:none;white-space:nowrap';a.classList.add('s54m');v.appendChild(a)}}
 return 'ok'};
})();

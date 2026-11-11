/* S152 esboço: ações da peça */
(function(){
var FAV='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
var CMP='<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>';
var SHR='<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/></svg>';
var css=document.createElement('style');css.textContent=
'.pgacts{display:none!important}'+
'.s52a{display:flex;align-items:center;gap:22px;margin:10px 0 4px}.s52a a{display:inline-flex;align-items:center;gap:7px;color:#5f4d59;font:500 14px var(--body);text-decoration:none;transition:color .2s}.s52a a.hv{color:#8d3a69}.s52a .sp{width:1px;height:14px;background:#e2d3dc}'+
'.s52f{position:relative;border:0!important;background:none!important;box-shadow:none!important;width:auto!important;color:#2a1f27;display:flex;align-items:center;padding:4px}.s52f b{position:absolute;top:-3px;right:-7px;min-width:17px;height:17px;border-radius:99px;background:#8d3a69;color:#fff;font:700 10px/17px var(--body);text-align:center}'+
'.s52t{white-space:nowrap;position:fixed;left:50%;transform:translateX(-50%);bottom:110px;z-index:9999;display:flex;align-items:center;gap:14px;background:#2a1f27;color:#fff;border-radius:999px;padding:12px 20px;font:500 14px var(--body);box-shadow:0 10px 30px rgba(0,0,0,.2)}.s52t a{color:#f2c6dc;text-decoration:none;font-weight:600}';
document.head.appendChild(css);
window.__s52=function(toast){
  /* lista no cabeçalho, ao lado da sacola */
  var bag=document.getElementById('bagbtn');if(bag&&!document.querySelector('.s52f')){var f=document.createElement('button');f.className='ib s52f';f.setAttribute('aria-label','Meus favoritos');f.innerHTML=FAV+'<b>1</b>';bag.parentNode.insertBefore(f,bag);var o=getComputedStyle(bag).order;f.style.order=o;var sb=document.getElementById('sbtn');if(sb&&getComputedStyle(sb).display!=='none'){sb.parentNode.insertBefore(f,bag)}}
  /* linha discreta abaixo do preço */
  document.querySelectorAll('#layer .s52a').forEach(function(e){e.remove()});
  var pr=[...document.querySelectorAll('#layer *')].find(function(e){return /^(R\$|Gs\.)\s?[\d.]+$/.test((e.textContent||'').trim())&&e.children.length===0&&e.getBoundingClientRect().height>20});
  if(pr){var r=document.createElement('div');r.className='s52a';r.innerHTML='<a href="#">'+CMP+'Comparar</a><span class="sp"></span><a href="#" class="hv">'+SHR+'Compartilhar</a>';(pr.closest('div')||pr).insertAdjacentElement('afterend',r)}
  /* coração da foto já salvo + aviso */
  var fv=document.querySelector('#layer .dfav');if(fv&&toast){fv.style.color='#8d3a69';var p=fv.querySelector('path');if(p)p.setAttribute('fill','#8d3a69')}
  document.querySelectorAll('.s52t').forEach(function(e){e.remove()});
  if(toast){var t=document.createElement('div');t.className='s52t';t.innerHTML='Salvo nos favoritos <a href="#">Ver lista ›</a>';document.body.appendChild(t)}
};
})();

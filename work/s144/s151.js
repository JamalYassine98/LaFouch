/* S151: atalhos de categoria na busca vazia (substituem os chips de palavra) */
(function(){
var css=document.createElement('style');css.textContent=
'#sov .s51{padding:4px 18px 18px}#sov .s51 small{display:block;font:700 11px var(--body);letter-spacing:.14em;color:#8d3a69;margin:0 0 6px}'+
'#sov .s51 a{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-top:1px solid #efe3ea;color:#2a1f27;font:400 17px var(--display,Georgia,serif);text-decoration:none}#sov .s51 a:first-of-type{border-top:0}'+
'#sov .s51 a i{font-style:normal;color:#8d3a69;font:500 15px var(--body);transition:transform .25s}#sov .s51 a.hv i,#sov .s51 a:hover i{transform:translateX(4px)}#sov .s51 a.of{color:#8d3a69}#sov .s51 a.at{margin-top:6px;border-top:1px solid #e2d3dc}'+
'@media (min-width:1100px){#sov .sopn{width:min(640px,92vw)!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;top:90px!important}}';
document.head.appendChild(css);
window.__s51=function(hv){var r=document.getElementById('sores');if(!r)return;r.querySelector('.sohint')&&(r.querySelector('.sohint').textContent='Busque pelo nome ou pelo código da peça.');
 var c=r.querySelector('.sochips');if(c)c.remove();var o=r.querySelector('.s51');if(o)o.remove();o=document.createElement('div');o.className='s51';
 o.innerHTML='<small>OU VEJA POR CATEGORIA</small><a href="#">Solar<i>›</i></a><a href="#" class="'+(hv?'hv':'')+'">Leitura<i>›</i></a><a href="#">Armações<i>›</i></a><a href="#" class="of">Ofertas<i>›</i></a><a href="#" class="at">Atacado<i>›</i></a>';r.appendChild(o)};
})();

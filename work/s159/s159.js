/* S159 esboço: resumo "Seus dados" e "Entrega" com Editar na tela de Pagamento */
(function(){
var css=document.createElement('style');css.textContent=
'.s59{margin:22px 0 6px;border-top:1px solid #efe3ea}.s59 .r{display:grid;grid-template-columns:1fr auto;gap:4px 16px;align-items:start;padding:16px 2px;border-bottom:1px solid #efe3ea}'+
'.s59 small{grid-column:1;font:700 11px var(--body);letter-spacing:.14em;color:#8d3a69;text-transform:uppercase}.s59 .v{grid-column:1;font:400 15px/1.5 var(--body);color:#2a1f27}.s59 .v span{display:block;color:#5f4d59;font-size:14px}'+
'.s59 a{grid-column:2;grid-row:1 / span 2;align-self:center;color:#8d3a69;font:500 14px var(--body);text-decoration:none}.s59 a i{font-style:normal;display:inline-block;transition:transform .25s}.s59 a:hover i,.s59 a.hv i{transform:translateX(3px)}'+
'.s59t{margin:0 0 4px;font:400 20px var(--display,Georgia,serif);color:#2a1f27;padding-top:16px}';
document.head.appendChild(css);
window.__s59=function(){var lab=[...document.querySelectorAll('.cartp *')].find(function(e){return e.children.length===0&&/Transfer.ncia Ita/.test(e.textContent)});if(!lab)return 'sem';
 var bx=lab;while(bx.parentElement&&bx.getBoundingClientRect().width<300)bx=bx.parentElement;while(bx.parentElement&&bx.parentElement.getBoundingClientRect().height<170)bx=bx.parentElement;
 var o=document.querySelector('.s59');if(o)o.remove();o=document.createElement('div');o.className='s59';
 o.innerHTML='<div class="s59t">Confira antes de pagar</div><div class="r"><small>Seus dados</small><div class="v">Mariana Souza<span>mariana.souza@gmail.com · +55 45 99812-3344</span></div><a href="#">Editar <i>›</i></a></div>'+
 '<div class="r"><small>Entrega</small><div class="v">Retirada na loja<span>Galeria Jebai Center, 3º piso · seg. a sáb., 7h30–15h</span></div><a href="#">Editar <i>›</i></a></div>';
 bx.insertAdjacentElement('afterend',o);return 'ok'};
})();

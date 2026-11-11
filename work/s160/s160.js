/* S160 esboço: ícones de linha, Pix, "Confira" acima da forma de pagamento, tela de erro corrigida */
(function(){
var L='fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
var IC={
 loja:'<svg width="26" height="26" viewBox="0 0 24 24" '+L+'><path d="M4 10v10h16V10"/><path d="M3 10l1.6-5h14.8L21 10"/><path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M10 20v-5h4v5"/></svg>',
 delivery:'<svg width="26" height="26" viewBox="0 0 24 24" '+L+'><path d="M3 7.5l9-4.5 9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5l9 4.5 9-4.5M12 12v9"/><path d="M7.5 5.2l9 4.6"/></svg>',
 alias:'<svg width="26" height="26" viewBox="0 0 24 24" '+L+'><path d="M3 9l9-5 9 5"/><path d="M5 9v8M9.5 9v8M14.5 9v8M19 9v8"/><path d="M3 20h18"/></svg>',
 pix:'<svg width="26" height="26" viewBox="0 0 24 24"><g fill="#32BCAD"><rect x="9.6" y="2.2" width="4.8" height="4.8" rx="1.3" transform="rotate(45 12 4.6)"/><rect x="9.6" y="17" width="4.8" height="4.8" rx="1.3" transform="rotate(45 12 19.4)"/><rect x="2.2" y="9.6" width="4.8" height="4.8" rx="1.3" transform="rotate(45 4.6 12)"/><rect x="17" y="9.6" width="4.8" height="4.8" rx="1.3" transform="rotate(45 19.4 12)"/></g></svg>'
};
var css=document.createElement('style');css.textContent=
'.cartp .cfo>span.s60i{display:grid;place-items:center;width:44px;height:44px;border-radius:12px;background:#fff;border:1px solid #efe3ea;color:#8d3a69;font-size:0}'+
'.s59{margin:0 0 18px!important;border-top:0!important}.s59 .s59t{padding-top:0!important}'+
'#pkok .s60c{margin-top:18px;color:#a3929c;font:400 12px var(--body)}';
document.head.appendChild(css);
window.__s60=function(){document.querySelectorAll('.cartp .cfo').forEach(function(b){var k=b.dataset.ent||b.dataset.v;var sp=b.querySelector('span');if(sp&&IC[k]){sp.innerHTML=IC[k];sp.className='s60i'}});
 if(window.__s59&&document.querySelector('.cartp [data-v="pix"]')){window.__s59();var o=document.querySelector('.s59'),cl=document.querySelector('.cartp .cl');if(o&&cl)cl.insertBefore(o,cl.firstChild)}return 'ok'};
window.__s60erro=function(){var o=document.createElement('div');o.id='pkok';o.setAttribute('role','dialog');document.body.appendChild(o);
 o.innerHTML='<div class="pkl"></div><h2 style="animation-delay:0s">Quase lá!</h2><div class="pkt"><span>Não deu para enviar o pedido agora. Tente de novo ou fale com a loja pelo WhatsApp.</span></div><div class="pkb"><a class="pkw" href="#">Enviar pelo WhatsApp</a><button type="button">Tentar de novo</button></div><div class="s60c">código do erro: 403 · 11/11 05:44</div>'};
})();

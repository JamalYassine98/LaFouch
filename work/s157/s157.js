/* S157 esboço PC: filtros e carrinho deslizam pela direita; idioma no centro */
(function(){
var css=document.createElement('style');css.textContent='.h49{z-index:1!important}@media (min-width:1100px){'+
'#fsh .fsc{background:rgba(42,31,39,.28)!important}'+
'#fsh .fpn{left:auto!important;right:0!important;top:0!important;bottom:0!important;width:420px!important;max-width:none!important;height:100vh!important;max-height:none!important;border-radius:0!important;padding:28px 28px!important;transform:none!important;box-shadow:-20px 0 60px rgba(0,0,0,.12)!important;overflow:auto;animation:s57r .28s cubic-bezier(.2,.8,.2,1)}'+
'#fsh .fpn .gr{display:none!important}#fsh .fpn h4{font:400 26px var(--display,Georgia,serif)!important;margin:0 0 18px!important}'+
'}'+
'@keyframes s57r{from{transform:translateX(40px);opacity:0}to{transform:none;opacity:1}}@keyframes s57c{from{transform:translate(-50%,-46%);opacity:0}to{transform:translate(-50%,-50%);opacity:1}}'+
'.s57x{position:absolute;top:24px;right:24px;border:0;background:none;font-size:22px;color:#2a1f27;line-height:1}'+
'.s57bg{position:fixed;inset:0;z-index:2000;background:rgba(42,31,39,.28)}'+
'.s57d{position:fixed;top:0;right:0;bottom:0;width:420px;z-index:2001;background:#fbf7fa;box-shadow:-20px 0 60px rgba(0,0,0,.12);padding:28px;font-family:var(--body);color:#2a1f27;animation:s57r .28s cubic-bezier(.2,.8,.2,1);display:flex;flex-direction:column}'+
'.s57d h3{font:400 26px var(--display,Georgia,serif);margin:0 0 14px}'+
'.s57d .tb{display:flex;gap:26px;border-bottom:1px solid #efe3ea;margin-bottom:18px}.s57d .tb a{position:relative;padding:10px 0;font:500 15px var(--body);color:#7a6772;text-decoration:none}.s57d .tb a.on{color:#2a1f27}.s57d .tb a.on:after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1.5px;background:#8d3a69}.s57d .tb small{font:600 12px var(--body);color:#8d3a69;margin-left:4px}'+
'.s57d .it{display:grid;grid-template-columns:76px 1fr;gap:14px;align-items:center;padding:14px 0;border-bottom:1px solid #efe3ea}.s57d .it img{width:76px;height:76px;object-fit:contain;background:#fff;border:1px solid #efe3ea;border-radius:12px}.s57d .it small{display:block;font:500 12px var(--body);color:#7a6772}.s57d .it b{display:block;font:400 16px var(--display,Georgia,serif)}.s57d .it em{font:600 14px var(--body);font-style:normal}'+
'.s57d .qt{display:flex;align-items:center;gap:12px;margin-top:6px;font:500 14px var(--body)}.s57d .qt span{width:26px;height:26px;border:1px solid #e2d3dc;border-radius:99px;display:grid;place-items:center}'+
'.s57d .ft{margin-top:auto;border-top:1px solid #efe3ea;padding-top:16px}.s57d .tt{display:flex;justify-content:space-between;font:600 16px var(--body);margin-bottom:14px}.s57d .cb{width:100%;height:50px;border:0;border-radius:999px;background:#8d3a69;color:#fff;font:500 16px var(--body)}.s57d .cc{display:block;text-align:center;margin-top:12px;color:#5f4d59;font:400 14px var(--body)}'+
'.s57c{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2001;width:440px;background:#fbf7fa;border-radius:22px;box-shadow:0 30px 80px rgba(0,0,0,.18);padding:30px;font-family:var(--body);color:#2a1f27;animation:s57c .25s ease}'+
'.s57c h3{font:400 24px var(--display,Georgia,serif);margin:0 0 4px}.s57c p{margin:0 0 18px;color:#7a6772;font-size:14px}.s57c small{display:block;font:700 11px var(--body);letter-spacing:.14em;color:#8d3a69;margin:14px 0 8px}'+
'.s57c .op{display:grid;grid-template-columns:1fr 1fr;gap:10px}.s57c .op button{height:48px;border:1px solid #e2d3dc;border-radius:14px;background:#fff;font:500 15px var(--body);color:#2a1f27}.s57c .op button.on{border-color:#8d3a69;color:#8d3a69;box-shadow:inset 0 0 0 1px #8d3a69}'+
'.s57c .ok{width:100%;height:48px;margin-top:22px;border:1px solid #8d3a69;border-radius:999px;background:none;color:#8d3a69;font:500 15px var(--body)}';
document.head.appendChild(css);
window.__s57x=function(){var f=document.querySelector('#fsh .fpn');if(f&&!f.querySelector('.s57x')){var x=document.createElement('button');x.className='s57x';x.textContent='×';f.appendChild(x)}};
window.__s57cart=function(it){var bg=document.createElement('div');bg.className='s57bg';document.body.appendChild(bg);var d=document.createElement('aside');d.className='s57d';
 d.innerHTML='<button class="s57x">×</button><h3>Carrinho</h3><div class="tb"><a class="on">Carrinho <small>1</small></a><a>Favoritos <small>1</small></a></div>'+
 '<div class="it"><img src="'+it.img+'"><div><small>'+it.ref+'</small><b>'+it.nome+'</b><em>'+it.pr+'</em><div class="qt"><span>−</span>1<span>+</span></div></div></div>'+
 '<div class="ft"><div class="tt"><span>Total</span><span>'+it.pr+'</span></div><button class="cb">Finalizar pedido</button><a class="cc">Continuar comprando</a></div>';document.body.appendChild(d)};
window.__s57lang=function(){var bg=document.createElement('div');bg.className='s57bg';document.body.appendChild(bg);var d=document.createElement('div');d.className='s57c';
 d.innerHTML='<h3>Idioma e moeda</h3><p>Escolha como prefere ver o site e os preços.</p><small>IDIOMA</small><div class="op"><button class="on">Português</button><button>Español</button></div><small>MOEDA</small><div class="op"><button class="on">R$ · Real</button><button>Gs. · Guaraní</button></div><button class="ok">Pronto</button>';document.body.appendChild(d)};
})();

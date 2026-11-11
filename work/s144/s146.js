/* S145 esboço (só na cópia): ordem do Início, Atacado com 1 óculos, Novidades no fim, botões num padrão só */
(function(){
var css=document.createElement('style');css.textContent=
/* S146: um único botão de destaque por bloco, leve; o resto vira link de texto com › */
'html.v5 body #hdst .p1,html.v5 body .s44a .bt{height:44px!important;padding:0 24px!important;border-radius:999px!important;font:500 15px var(--body)!important;letter-spacing:0!important;background:#8d3a69!important;color:#fff!important;border:0!important;display:inline-flex!important;align-items:center!important;box-shadow:none!important}'+
'html.v5 body #hdst .p2{height:44px!important;padding:0 6px!important;border:0!important;background:none!important;color:#8d3a69!important;font:500 15px var(--body)!important;display:inline-flex!important;align-items:center!important;box-shadow:none!important}'+
/* atacado com 1 óculos */
'.s44a .card .im.um{grid-template-columns:1fr!important;place-items:center;padding:8px 26px}.s44a .card .im.um img{width:52%!important;max-width:none!important;max-height:none!important}'+
/* Novidades no fim: faixa com brilho B; no PC em 2 colunas */
'html.v5 body .hnews.hn2{background:radial-gradient(closest-side ellipse at 50% 50%,color-mix(in srgb,#a2447c 4%,transparent) 0%,transparent 100%)!important}'+
'';
document.head.appendChild(css);
window.__s45=function(){
  document.querySelectorAll('#hdst .p2').forEach(function(e){if(!/›/.test(e.textContent))e.textContent=e.textContent.trim()+' ›'});
  var home=document.getElementById('home');
  var g=document.querySelectorAll('#home .hgu');var at=g[0],gu=g[1];
  var hl=document.getElementById('hloj'),hg=document.getElementById('hguia'),nw=home.querySelector('.hnews.hn2'),ft=home.querySelector('.lfft');
  /* atacado: 1 óculos */
  var im=at&&at.querySelector('.im');if(im){var f=im.querySelector('img');im.innerHTML='';im.appendChild(f);im.classList.add('um')}
  /* Comece por aqui = 3 cartões */
  if(hg){var t=hg.querySelector('h2,h3,b,span')||hg;(hg.querySelector('h2')||hg.firstElementChild||hg).textContent='Comece por aqui'}
  if(gu){var bs=gu.querySelectorAll('button');if(bs[3])bs[3].remove();
    var T=[['TESTE DE LEITURA','Descubra seu grau em 1 min',''],['ESTILO','A armação ideal para o seu rosto',''],['AJUDA','Tire suas dúvidas','Pagamento, entrega e troca']];
    gu.querySelectorAll('button').forEach(function(b,i){var x=T[i];b.querySelector('small').textContent=x[0];b.querySelector('b').textContent=x[1];var s=b.querySelector('.gsub');if(s){if(x[2])s.textContent=x[2];else s.remove()}else if(x[2]){s=document.createElement('em');s.className='gsub';s.textContent=x[2];b.querySelector('.gt').appendChild(s)}});
    if(innerWidth>=1100)gu.style.setProperty('grid-template-columns','repeat(3,1fr)','important')}
  /* nova ordem: ... Novidades(grade) → Comece por aqui → Atacado → Novidades e ofertas → rodapé */
  [hg,gu,hl,at,nw].forEach(function(e){if(e)home.insertBefore(e,ft)});
  if(nw){var line=document.createElement('div');line.style.cssText='height:28px';home.insertBefore(line,nw)}
};
})();

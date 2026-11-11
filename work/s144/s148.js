/* S147 esboço: 3 opções de botão minimalista com cor ao passar o mouse + cartão do Atacado com foto quadrada */
(function(){
var css=document.createElement('style');css.id='s147';document.head.appendChild(css);
var base='html.v5 body #hdst .p1,html.v5 body .s44a .bt{transition:background .25s,color .25s,border-color .25s!important;cursor:pointer}';
var A0='html.v5 body #hdst .p1,html.v5 body .s44a .bt{height:44px!important;padding:0 24px!important;border-radius:999px!important;font:500 15px var(--body)!important;background:transparent!important;color:#8d3a69!important;border:1px solid #8d3a69!important;box-shadow:none!important;display:inline-flex!important;align-items:center!important;gap:8px}';
var HF='html.v5 body #hdst .p1.hv,html.v5 body .s44a .bt.hv,html.v5 body #hdst .p1:hover,html.v5 body .s44a .bt:hover{background:#8d3a69!important;color:#fff!important}';
var OP={
 D:A0+HF+'html.v5 body #hdst .p1 i,html.v5 body .s44a .bt i{font-style:normal;display:inline-block;transition:transform .25s}html.v5 body #hdst .p1.hv i,html.v5 body .s44a .bt.hv i{transform:translateX(4px)}',
 E:A0+HF+'html.v5 body #hdst .p1,html.v5 body .s44a .bt{border-radius:8px!important}',
 F:A0+HF+'html.v5 body #hdst .p1,html.v5 body .s44a .bt{font:600 12.5px var(--body)!important;letter-spacing:.14em!important;text-transform:uppercase;height:46px!important;padding:0 28px!important}',
 G:A0+HF+'html.v5 body #hdst .p1,html.v5 body .s44a .bt{background:color-mix(in srgb,#8d3a69 7%,transparent)!important;border-color:transparent!important}html.v5 body #hdst .p1.hv,html.v5 body .s44a .bt.hv{border-color:#8d3a69!important}',
 A:'html.v5 body #hdst .p1,html.v5 body .s44a .bt{height:44px!important;padding:0 24px!important;border-radius:999px!important;font:500 15px var(--body)!important;background:transparent!important;color:#8d3a69!important;border:1px solid #8d3a69!important;box-shadow:none!important;display:inline-flex!important;align-items:center!important}'+
   'html.v5 body #hdst .p1.hv,html.v5 body .s44a .bt.hv,html.v5 body #hdst .p1:hover,html.v5 body .s44a .bt:hover{background:#8d3a69!important;color:#fff!important}',
 B:'html.v5 body #hdst .p1,html.v5 body .s44a .bt{height:44px!important;padding:0 24px!important;border-radius:999px!important;font:500 15px var(--body)!important;background:#8d3a69!important;color:#fff!important;border:0!important;box-shadow:none!important;display:inline-flex!important;align-items:center!important}'+
   'html.v5 body #hdst .p1.hv,html.v5 body .s44a .bt.hv,html.v5 body #hdst .p1:hover,html.v5 body .s44a .bt:hover{background:#b4528a!important}',
 C:'html.v5 body #hdst .p1,html.v5 body .s44a .bt{height:auto!important;padding:4px 0!important;border-radius:0!important;font:500 16px var(--body)!important;background:none!important;color:#2a1f27!important;border:0!important;border-bottom:1.5px solid #8d3a69!important;box-shadow:none!important;display:inline-flex!important;align-items:center!important}'+
   'html.v5 body #hdst .p1.hv,html.v5 body .s44a .bt.hv,html.v5 body #hdst .p1:hover,html.v5 body .s44a .bt:hover{color:#8d3a69!important;border-bottom-width:2.5px!important}'
};
var ATA='@media (min-width:1100px){html.v5 body .s44a .card{grid-template-columns:360px 1fr!important;align-items:stretch}html.v5 body .s44a .card .tx{order:2;padding:44px 56px!important}html.v5 body .s44a .card .im.um{order:1;padding:36px!important;aspect-ratio:1/1;display:grid!important;place-items:center;background:linear-gradient(135deg,color-mix(in srgb,#a2447c 6%,#fff),#fff)!important}html.v5 body .s44a .card .im.um img{width:100%!important;height:100%!important;object-fit:contain!important;transform:none!important;mix-blend-mode:multiply}}';
window.__s47=function(o,hv){document.querySelectorAll('#hdst .p1').forEach(function(b){b.textContent='Ver modelo'});if(o==='D')document.querySelectorAll('#hdst .p1,.s44a .bt').forEach(function(b){if(!b.querySelector('i')){b.textContent=b.textContent.replace(/ ›$/,'');var i=document.createElement('i');i.textContent='→';b.appendChild(i)}});css.textContent=base+OP[o]+ATA;document.querySelectorAll('#hdst .p1,.s44a .bt').forEach(function(b){b.classList.toggle('hv',!!hv)});
  if(o==='C')document.querySelectorAll('#hdst .p1,.s44a .bt').forEach(function(b){if(!/›/.test(b.textContent))b.textContent=b.textContent.trim()+' ›'})};
})();

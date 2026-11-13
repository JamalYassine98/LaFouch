# S226 · APP: passo 1 da simplificação (topo compacto, toque 44+, letra 12+, botão diz o que abre) + computador com a lógica do site
# (grupo MOUSE a partir de 1100 px: menu ao lado com todos os destinos, conteúdo no centro com largura máxima; o zoom de tela grande que já existe continua).
CSS = """
/* 1 · topo compacto em todo aparelho */
.wrap{padding-top:10px!important}
.top.logo-top{min-height:0!important;height:auto!important;margin-bottom:10px!important}
.top.logo-top .brand,.top.logo-top .brand img{height:52px!important;width:auto!important}
.top.logo-top #sino{top:3px!important}
/* 2 · todo toque com 44 px ou mais */
.view button,.view a[href],.view .chip,.view [data-act]:not(div):not(section):not(li){min-height:44px}
.view button:not(.kpi):not(.pcard):not(.card){min-width:44px}
.view a[data-act],.view span[data-act],.view a[href]{display:inline-flex;align-items:center}
/* 3 · computador (mouse): menu ao lado, conteúdo usa a largura */
@media (min-width:1100px) and (hover:hover) and (pointer:fine){
 body{--rail:232px}
 .wrap{max-width:none!important;margin:0 0 0 var(--rail)!important;padding:22px max(40px,calc((100vw/var(--lfz,1) - var(--rail) - 1320px)/2)) 40px!important}
 #mainnav{left:0!important;top:0!important;bottom:0!important;right:auto!important;transform:none!important;width:var(--rail)!important;flex-direction:column!important;justify-content:flex-start!important;align-items:stretch!important;gap:4px!important;border-radius:0!important;border:0!important;border-right:1px solid var(--line)!important;box-shadow:none!important;padding:112px 12px 16px!important}
 #mainnav .mn{flex:0 0 auto!important;flex-direction:row!important;justify-content:flex-start!important;align-items:center!important;gap:12px!important;height:46px!important;width:100%!important;padding:0 14px!important;border-radius:12px!important}
 #mainnav .mn>span:last-child{font-size:15px!important;line-height:1!important}
 #mainnav .mn .mi{margin:0!important;flex:0 0 22px}
 #mainnav .mn.on{background:color-mix(in srgb,var(--ac,#8d3a69) 10%,transparent)}
 #mainnav .lfsep{height:1px;background:var(--line);margin:8px 6px;flex:0 0 1px}
 #mainnav .lfesp{flex:1 1 auto}
 .top.logo-top{position:fixed!important;left:0;top:0;width:var(--rail);z-index:41;padding:24px 0 0!important;margin:0!important;pointer-events:none}
 .top.logo-top .brand,.top.logo-top .brand img{height:64px!important}
 .top.logo-top .brand{margin:0 auto}
 .top.logo-top #sino{position:fixed!important;right:calc(32px/var(--lfz,1));top:calc(20px/var(--lfz,1))!important;left:auto!important;pointer-events:auto}
 .view>.top{padding-right:70px}
}
"""
IC = {'Pedidos':'M6 7h12l-1 13H7L6 7zm3 0a3 3 0 0 1 6 0','Clientes':'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0','Histórico':'M12 7v5l3 2M21 12a9 9 0 1 1-3-6.7','Números':'M4 20V10m6 10V4m6 16v-7m4 7H2','Despesas':'M6 3h12v18l-3-2-3 2-3-2-3 2V3zm3 5h6m-6 4h6','Câmbio':'M4 8h14l-3-3m5 11H6l3 3'}
JS = r"""(()=>{const IC=__IC__;const H=document.documentElement;
 function run(){
  try{H.style.setProperty('--lfz',getComputedStyle(H).zoom||1)}catch(_){}
  /* botão diz o que abre */
  document.querySelectorAll('.view button, .view a').forEach(b=>{if(b.__n)return;const t=b.textContent.trim();if(t!=='Ver')return;b.__n=1;const c=(b.closest('li,.card,.row,div')||b.parentElement);const s=(c&&c.textContent||'').toLowerCase();
   b.textContent=/conta/.test(s)?'Ver contas':/sem custo|peça/.test(s)?'Ver peças':/preço/.test(s)?'Ver preços':/margem/.test(s)?'Ver margem':/dólar|câmbio/.test(s)?'Ver câmbio':/pedido/.test(s)?'Ver pedidos':'Abrir'});
  /* letra de 12 px no mínimo */
  document.querySelectorAll('.view *').forEach(e=>{if(e.__f||!e.firstChild)return;if(![].some.call(e.childNodes,n=>n.nodeType===3&&n.textContent.trim()))return;e.__f=1;if(parseFloat(getComputedStyle(e).fontSize)<12)e.style.setProperty('font-size','12px','important')});
  /* computador: o menu ao lado mostra todos os destinos */
  const nav=document.querySelector('#mainnav');if(nav&&matchMedia('(min-width:1100px) and (hover:hover) and (pointer:fine)').matches&&!nav.querySelector('.lfsep')){const mn=[...nav.querySelectorAll('.mn')],aj=mn[mn.length-1],sep=document.createElement('i');sep.className='lfsep';nav.insertBefore(sep,aj);
   Object.keys(IC).forEach(k=>{const b=document.createElement('button');b.className='mn';b.type='button';b.innerHTML='<span class="mi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="'+IC[k]+'"/></svg></span><span>'+k+'</span>';nav.insertBefore(b,aj)});
   const e=document.createElement('i');e.className='lfesp';nav.insertBefore(e,aj)}
 }
 run();setInterval(run,400)})()""".replace('__IC__', __import__('json').dumps(IC, ensure_ascii=False))

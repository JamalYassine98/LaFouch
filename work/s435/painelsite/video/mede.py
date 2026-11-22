import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/kit');sys.argv=sys.argv[:1];import kit
from playwright.sync_api import sync_playwright
kit.prep_site();kit.serve(kit.SITE,kit.PS)
INST=r"""(()=>{const t0=performance.now();window.__log=[];const L=m=>__log.push(Math.round(performance.now()-t0)+'ms '+m);
document.addEventListener('DOMContentLoaded',()=>{const st=document.getElementById('home')||document.body;
 new MutationObserver(ms=>ms.forEach(m=>{if(m.type==='attributes')L('attr '+m.attributeName+'='+(st.getAttribute(m.attributeName)||'').slice(0,40));else {const a=[...m.addedNodes].map(n=>n.id||n.className||n.nodeName).join(',').slice(0,60);const r=[...m.removedNodes].map(n=>n.id||n.className||n.nodeName).join(',').slice(0,60);if(/hd|img|IMG/.test(a+r))L('troca em '+(m.target.id||m.target.className)+' +['+a+'] -['+r+']')}})).observe(st,{attributes:false,childList:true,subtree:true});
 const amostra=()=>{const S=st;const im=[...document.querySelectorAll('#hdst img')].filter(e=>e.getBoundingClientRect().width>50);L((S===st?'':'STAGE NOVO ')+im.map(e=>{let o=1,x=e;while(x&&x!==document.body){o*=+getComputedStyle(x).opacity;x=x.parentElement}return (e.className||e.tagName).slice(0,14)+' op='+o.toFixed(2)+' an='+getComputedStyle(e).animationName+(e.tagName=='IMG'?' ok='+e.complete+'/'+e.naturalWidth:'')}).join(' | '))};
 let n=0;const iv=setInterval(()=>{amostra();if(++n>40)clearInterval(iv)},75)})})()"""
with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox']);c=b.new_context(viewport={'width':390,'height':844})
  c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
  c.add_init_script("localStorage.setItem('lf_cfg',%r)"%json.dumps({'ativo':True,'dmodo':'slide','slide':'SL2210,SL2250,SL2255,GR3340','sanim':'fade','efx':'cascata,resp'}))
  c.add_init_script(INST)
  pg=c.new_page();pg.goto('http://localhost:%d/?kit=1'%kit.PS);pg.wait_for_timeout(4000)
  print('\n'.join(pg.evaluate("__log")));b.close()

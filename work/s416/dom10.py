import sys,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  for k in ['trocas','troca']:
    b,pg,w=ap.abre(pw,'inicio',True);pg.evaluate("()=>__LF.setView('fx')");w(1000);pg.evaluate("k=>__LF.ACT.fjAbre(k)",k);w(1200)
    print('==',k,pg.evaluate("()=>{const j=[...document.querySelectorAll('*')].filter(x=>/^(Últimas trocas|Registrar troca)$/.test((x.textContent||'').trim())&&x.children.length==0).map(x=>{let p=x;for(let i=0;i<6&&p.parentElement&&p.parentElement!=document.body;i++){p=p.parentElement;if(getComputedStyle(p).position=='fixed')break}return p}).pop();return j?j.outerHTML.replace(/<svg.*?<\\/svg>/g,'').replace(/<option[^>]*>[^<]*<\\/option>/g,'<o/>').slice(0,3800):'-'}"))
    b.close()

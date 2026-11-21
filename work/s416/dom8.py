import sys,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    b,pg,w=ap.abre(pw,'inicio',True);pg.evaluate("()=>__LF.setView('caixa')");w(1200)
    for k in ['ret','mel','conf']:
      pg.evaluate("k=>{const b=document.querySelector('[data-act=cxabre][data-id='+k+']');b?b.click():0}",k);w(1000)
      print('==',k,pg.evaluate("()=>[...document.querySelectorAll('.cxAcao')].map(a=>a.dataset.k+':'+a.outerHTML.replace(/<svg.*?<\\/svg>/g,'').slice(0,2200)).join('\\n##\\n')"))
      break
    print(pg.evaluate("()=>[...document.querySelectorAll('[data-act=cxabre]')].map(b=>b.dataset.id+' '+b.innerText).join(' | ')"))
    b.close()

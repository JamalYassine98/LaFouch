import sys,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
D=dict(C)
with sync_playwright() as pw:
    b,pg,w=ap.abre(pw,'inicio',True)
    for p in D['caixa-conferir']: pg.evaluate(p);w(1100)
    print(pg.evaluate("()=>{const a=[...document.querySelectorAll('.cxAcao')].filter(x=>x.getBoundingClientRect().top<window.innerHeight&&getComputedStyle(x).visibility!='hidden');return a.map(x=>x.dataset.k+' '+x.className+':'+x.outerHTML.replace(/<svg.*?<\\/svg>/g,'').slice(0,2500)).join('\\n##')}"))
    b.close()

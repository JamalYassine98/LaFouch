import sys,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
D=dict(C)
with sync_playwright() as pw:
    b,pg,w=ap.abre(pw,'inicio',True)
    for p in D['caixa-conferir']: pg.evaluate(p);w(1100)
    print(pg.evaluate("()=>{const e=[...document.querySelectorAll('*')].filter(x=>/^Conferir o caixa$/.test((x.textContent||'').trim()));const t=e.pop();let p=t;for(let i=0;i<4;i++)p=p.parentElement;return p.className+' / '+p.parentElement.className+' / '+p.outerHTML.replace(/<svg.*?<\\/svg>/g,'').slice(0,2500)}"))
    b.close()

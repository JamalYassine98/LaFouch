import sys,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
D=dict(C)
from playwright.sync_api import sync_playwright
def L(h): return re.sub(r'data:image[^"]*','IMG',re.sub(r'<svg.*?</svg>','<svg/>',h))
with sync_playwright() as pw:
    b,pg,w=ap.abre(pw,'inicio',True)
    for p in D['inventario-novo']: pg.evaluate(p);w(1100)
    w(1500);print(L(pg.evaluate("()=>{const m=document.getElementById('addModal');return m?m.outerHTML:[...document.querySelectorAll('[role=dialog]')].map(x=>x.id+x.className).join(',')}"))[:3200]);b.close()

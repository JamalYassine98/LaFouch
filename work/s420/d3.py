import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
D=dict(C)
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    b,pg,w=ap.abre(pw,'inicio',True)
    for p in D['inventario-novo']: pg.evaluate(p);w(1100)
    print(pg.evaluate("()=>{const e=[...document.querySelectorAll('button')].find(x=>/Ler haste/.test(x.getAttribute('aria-label')||x.innerText)&&x.getBoundingClientRect().height);return e.className+' | '+e.parentElement.className+' | '+e.closest('[id]').id}"))
    b.close()
with sync_playwright() as pw:
    b,pg,w=ap.abre(pw,'inicio',True)
    for p in D['inventario-novo']: pg.evaluate(p);w(1100)
    pg.add_style_tag(content='#addModal .adTiles .adTile{flex-direction:row!important;min-height:52px!important}');w(300)
    print(pg.evaluate("()=>{const e=document.getElementById('btnLeitor');const c=getComputedStyle(e);return [c.flexDirection,c.minHeight,e.getBoundingClientRect().height, !!e.closest('#addModal')]}"))
    b.close()

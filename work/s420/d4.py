import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
D=dict(C)
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    b,pg,w=ap.abre(pw,'inicio',True)
    for p in D['inventario-novo']: pg.evaluate(p);w(1100)
    pg.add_style_tag(content='#btnLeitor{outline:5px solid red!important;min-height:52px!important;flex-direction:row!important}');w(300)
    print(pg.evaluate("()=>{const e=document.getElementById('btnLeitor');const c=getComputedStyle(e);return [e.getAttribute('style'),c.outlineColor,c.flexDirection,c.minHeight,document.querySelectorAll('#btnLeitor').length,[...document.styleSheets].length]}"))
    b.close()

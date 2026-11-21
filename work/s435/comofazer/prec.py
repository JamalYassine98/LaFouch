import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
O='/home/claude/lafouch/work/s435/comofazer/'
with sync_playwright() as pw:
  for base in (False,True):
    b,pg,w=ap.abre(pw,'inicio',True,'celular',base=base)
    pg.evaluate("()=>window.__LF.inicioGo('prec')");w(1500)
    pg.add_style_tag(content='#nvBar{display:none!important}')
    pg.screenshot(path=O+('prec_prop' if base else 'prec_hoje')+'.png',full_page=True)
    if not base: open(O+'prec_hoje.html','w').write(pg.evaluate("document.getElementById('v-dash').innerHTML"))
    else: open(O+'prec_prop.html','w').write(pg.evaluate("document.getElementById('v-dash').innerHTML"))
    b.close()

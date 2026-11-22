import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  for v in ['mkt','cup']:
    b,pg,w=ap.abre(pw,v,True,'celular',base=True);w(800)
    pg.add_style_tag(content='#mainnav{display:none!important}')
    pg.screenshot(path='hoje_%s.png'%v,full_page=True);b.close()
  b,pg,w=ap.abre(pw,'ajustes',True,'celular',base=True);w(800)
  pg.evaluate("()=>{const e=[...document.querySelectorAll('button,a,div')].find(x=>x.textContent.trim().startsWith('Marca')&&x.offsetParent);e&&e.click()}");w(900)
  pg.screenshot(path='hoje_marca.png');b.close()

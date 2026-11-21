import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
O='/home/claude/lafouch/work/s435/ajpecas/'
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=False)
  pg.click('#mainnav .mn[data-id="ajustes"]');w(900)
  pg.screenshot(path=O+'aj_full.png',full_page=True)
  print(pg.evaluate("[...document.querySelectorAll('#v-ajustes button, #v-ajustes summary, #v-ajustes [role=button]')].filter(e=>e.offsetParent).map(e=>e.className+'|'+e.textContent.trim().replace(/\\s+/g,' ').slice(0,50))"))
  b.close()

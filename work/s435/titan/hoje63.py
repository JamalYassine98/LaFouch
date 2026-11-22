import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'ajustes',True,'celular',base=False);w(800)
  pg.get_by_text('Preços',exact=True).first.click();w(900)
  pg.click('[data-act="paTog"]');w(1200)
  pg.add_style_tag(content='#mainnav,#nvBar{display:none!important}')
  e=pg.query_selector('.paPrev');e and e.scroll_into_view_if_needed();w(400)
  pg.screenshot(path='h63_auto.png',full_page=True)
  print(pg.evaluate("()=>{const e=document.querySelector('.paPrev');return e?e.innerText:'-'}"))
  b.close()

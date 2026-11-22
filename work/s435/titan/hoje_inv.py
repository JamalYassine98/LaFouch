import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=False);w(900)
  pg.screenshot(path='hi0_lista.png')
  cs=pg.query_selector_all('.pcard');print('cards',len(cs))
  cs[1].click();w(1500)
  cs=pg.query_selector_all('.pcard');print('cards2',len(cs));cs[0].click();w(1800)
  pg.add_style_tag(content='#mainnav,#nvBar{display:none!important}')
  pg.screenshot(path='hi1_ficha.png',full_page=True)
  e=pg.query_selector('#ofAbre');print('ofAbre',bool(e))
  if e: e.scroll_into_view_if_needed();e.click();w(1200);pg.screenshot(path='hi2_oferta.png')
  b.close()

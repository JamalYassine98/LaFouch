# Hoje (app real, SEM os aprovados simulados — no kit eles duplicam a linha Preços dos Ajustes): Ajustes › Preços › Contas, taxas e meta; Câmbio.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'ajustes',True,'celular',base=False);w(800)
  pg.get_by_text('Preços',exact=True).first.click();w(900)
  e=pg.query_selector('[data-act="dfold"][data-id="cfg"]');e.scroll_into_view_if_needed();e.click();w(2000)
  pg.add_style_tag(content='#mainnav,#nvBar{display:none!important}')
  pg.screenshot(path='h_ajustes_precos.png',full_page=True)
  pg.evaluate("()=>__LF.setView('fx')");w(1500)
  pg.screenshot(path='h_cambio.png',full_page=True)
  b.close()

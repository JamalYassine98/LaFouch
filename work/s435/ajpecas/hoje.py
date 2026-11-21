import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,json
from playwright.sync_api import sync_playwright
O='/home/claude/lafouch/work/s435/ajpecas/'
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=False)
  print(pg.evaluate("[...document.querySelectorAll('#mainnav .mn')].map(x=>x.dataset.id+':'+x.textContent.trim())"))
  pg.screenshot(path=O+'h_inicio.png')
  pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  print('pecas1',pg.evaluate("[window.__LF.S.view,window.__LF.S.nvP]"))
  pg.screenshot(path=O+'h_pecas.png')
  # o grupo pelo Início
  pg.click('#mainnav .mn[data-id="inicio"]');w(800)
  print(pg.evaluate("[...document.querySelectorAll('#v-inicio [data-act]')].slice(0,30).map(x=>x.dataset.act+':'+(x.dataset.id||'')+':'+x.textContent.trim().slice(0,30))"))
  b.close()

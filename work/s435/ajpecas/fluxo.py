import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
O='/home/claude/lafouch/work/s435/ajpecas/'
def info(pg,t):
  print(t,pg.evaluate("[window.__LF.S.view,JSON.stringify(window.__LF.S.nvP),[...document.querySelectorAll('.nvL')].map(x=>getComputedStyle(x).textAlign+'/'+x.closest('[id]').id).join(',')]"))
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=False)
  pg.click('#mainnav .mn[data-id="g:pecas"]');w(700);info(pg,'aba')
  pg.click('.nvL[data-id="estoque"]');w(900);info(pg,'inv')
  pg.click('#mainnav .mn[data-id="g:pecas"]');w(900);info(pg,'aba de novo');pg.screenshot(path=O+'f1.png')
  pg.click('.nvL[data-id="est"]');w(1200);info(pg,'est')
  pg.screenshot(path=O+'f_est.png')
  pg.click('#mainnav .mn[data-id="g:pecas"]');w(900);info(pg,'aba3');pg.screenshot(path=O+'f2.png')
  pg.click('#mainnav .mn[data-id="ajustes"]');w(900);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900);info(pg,'volta de ajustes');pg.screenshot(path=O+'f3.png')
  b.close()

import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(800)
  print(pg.evaluate("()=>[...document.querySelectorAll('#v-inicio [data-id]')].filter(x=>x.querySelector('svg')).map(x=>x.dataset.id+':'+x.innerText.trim().slice(0,15))"))
  b.close()

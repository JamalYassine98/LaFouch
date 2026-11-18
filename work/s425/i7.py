import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'fx',True);w(1200)
  print(pg.evaluate("()=>[...document.querySelectorAll('#v-fx button,#v-fx [data-act]')].filter(x=>x.getBoundingClientRect().height).map(x=>(x.dataset.act||'')+':'+(x.innerText||x.getAttribute('aria-label')||'').trim().slice(0,30)+'@'+Math.round(x.getBoundingClientRect().top))"))
  pg.screenshot(path='/tmp/s425/fx.png',full_page=True);b.close()

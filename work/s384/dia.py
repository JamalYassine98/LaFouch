import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  pg.evaluate("()=>__LF.setView('hist')");w(900)
  r=pg.evaluate("()=>{const e=[...document.querySelectorAll('#v-hist *')].find(x=>/^16\\/11/.test(x.innerText||'')&&x.getBoundingClientRect().height<90&&x.getBoundingClientRect().height>40);if(!e)return null;const t=e.closest('[data-act]');t&&t.click();return (t?t.dataset.act:'-')+'|'+e.tagName}");print(r);w(1500)
  print(pg.evaluate("()=>[...document.querySelectorAll('.view')].filter(v=>!v.hidden&&v.offsetHeight).map(v=>v.id)"))
  pg.screenshot(path='/tmp/s384/hist-dia.png')

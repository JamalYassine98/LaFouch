import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',False)
  print(pg.evaluate("()=>{const S=__LF.S;return {tz:Intl.DateTimeFormat().resolvedOptions().timeZone,hoje:new Date().toString(),vendas:(S.sales||S.vendas||[]).length}}"))
  pg.evaluate("()=>__LF.setView('hist')");w(900)
  print(pg.evaluate("()=>document.querySelector('#v-hist').innerText.slice(0,200)"))
  b.close()

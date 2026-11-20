import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'mkt',True,'celular',base=True)
  pg.screenshot(path='/home/claude/lafouch/work/semp/hoje_mkt.png',full_page=True)
  print(pg.evaluate("()=>document.getElementById('v-mkt')?.innerText.slice(0,1500)"))
  pg.evaluate("()=>{window.__LF.setView('inicio')}");w(600);pg.evaluate("()=>ACT.guardAbre&&ACT.guardAbre()") if pg.evaluate("()=>typeof ACT!=='undefined'") else None
  w(900);pg.screenshot(path='/home/claude/lafouch/work/semp/hoje_guard.png')
  b.close()

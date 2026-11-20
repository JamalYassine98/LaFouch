import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'notif',True,'celular',base=True)
  pg.screenshot(path='/home/claude/lafouch/work/semp/hoje_notif.png',full_page=True)
  print(pg.evaluate("()=>document.getElementById('v-notif').innerText.slice(0,1500)"))
  print(pg.evaluate("()=>{const v=document.getElementById('v-notif');return [...v.querySelectorAll('*')].filter(e=>e.className&&typeof e.className=='string').slice(0,40).map(e=>e.tagName+'.'+e.className.replace(/ /g,'.')+' :: '+(e.innerText||'').slice(0,40).replace(/\\n/g,' / ')).join('\\n')}"))
  b.close()

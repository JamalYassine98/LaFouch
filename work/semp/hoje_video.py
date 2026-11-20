import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'mkt',True,'celular',base=True)
  pg.locator('#v-mkt button[data-cria=video]').first.click();w(1500)
  pg.screenshot(path='/home/claude/lafouch/work/semp/hoje_video.png')
  print(pg.evaluate("()=>{const j=[...document.querySelectorAll('.mkCrJn')].pop();return j?j.innerText.slice(0,900)+'\\n'+j.className+' '+Math.round(j.getBoundingClientRect().top)+' '+j.scrollHeight:'sem'}"))
  print(pg.evaluate("()=>{const j=[...document.querySelectorAll('.mkCrJn')].pop();return [...j.querySelectorAll('*')].filter(e=>e.className&&typeof e.className=='string').slice(0,30).map(e=>e.tagName+'.'+e.className.replace(/ /g,'.')+(e.id?'#'+e.id:'')).join(' ')}"))
  b.close()

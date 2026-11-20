import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  for t in ['marketing','pendencias','guardiao','inicio']:
    try:
      b,pg,w=ap.abre(pw,t,True,'celular',base=True)
      pg.screenshot(path='/home/claude/lafouch/work/semp/hoje_%s.png'%t,full_page=True)
      print(t,pg.evaluate("()=>document.querySelector('.view.on,.view.active,[id^=v-]:not([hidden])')?.id"),pg.evaluate("()=>document.body.innerText.slice(0,600)").replace('\n',' | ')[:600]);b.close()
    except Exception as e: print(t,'ERRO',str(e)[:100])

import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
 for esc in (True,False):
  b,pg,w=ap.abre(pw,'inicio',esc);er=[];pg.on('pageerror',lambda e:er.append(str(e)))
  pg.evaluate("()=>__LF.setView('fx')");w(1200);pg.evaluate("()=>scrollTo(0,300)");w(400);pg.screenshot(path='/tmp/s418/fx%d.png'%esc)
  pg.evaluate("()=>document.querySelector('.fx418P').click()");w(1000)
  pg.evaluate("()=>document.querySelector('[data-act=trMoe][data-id=\"de|usd\"]').click()");w(700)
  print(esc,pg.evaluate("()=>[__LF.S.tr.de,__LF.S.tr.para,!!document.querySelector('.fjJn.in')]"))
  pg.screenshot(path='/tmp/s418/fxt%d.png'%esc);print(er);b.close()

import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
C=[('hoje',"()=>__LF.inicioGo('hoje')"),('sem',"()=>{__LF.S.per='semana';__LF.S.dTab='hoje';__LF.setView('dash')}"),('dat',"()=>{__LF.S.per='custom';__LF.S.perDe='2026-11-01';__LF.S.perAte='2026-11-10';__LF.S.dTab='hoje';__LF.setView('dash')}"),('dia',"()=>{__LF.setView('hist');setTimeout(()=>document.querySelector('[data-act=opendia][data-id=\"2026-11-16\"]').click(),700)}"),('vaz',"()=>{__LF.setView('hist');setTimeout(()=>document.querySelector('[data-act=opendia][data-id=\"2026-11-15\"]').click(),700)}"),('giro',"()=>__LF.inicioGo('giro')")]
import os
with sync_playwright() as pw:
 for esc in (True,False):
  for n,js in C:
   if os.environ.get('SO') and n not in os.environ['SO']: continue
   b,pg,w=ap.abre(pw,'inicio',esc);er=[];pg.on('pageerror',lambda e:er.append(str(e)))
   pg.evaluate(js);w(1800);pg.screenshot(path='/tmp/s418/%s%d.png'%(n,esc));pg.evaluate("()=>scrollTo(0,600)");w(400);pg.screenshot(path='/tmp/s418/%s%db.png'%(n,esc))
   if er: print(n,er)
   b.close()

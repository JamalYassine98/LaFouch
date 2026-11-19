import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
exec(open('t1.py').read().split('E_=[]')[0].split('from playwright.sync_api import sync_playwright')[1])
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True,base=False);w(600)
  pg.on('console',lambda m:print('C',m.text) if 'POP' in m.text else None)
  pg.evaluate("()=>{window.addEventListener('popstate',e=>console.log('POP cap '+JSON.stringify(e.state)+' '+location.hash),true);window.addEventListener('popstate',e=>console.log('POP bub '+location.hash))}")
  tap(pg,"#mainnav .mn[data-id='g:din']")
  print(pg.evaluate("()=>[history.length,location.hash,__LF.S.view]"))
  pg.evaluate("()=>history.back()");w(800)
  print(pg.evaluate("()=>[history.length,location.hash,__LF.S.view,window.__nv435.pilha()]"))
  b.close()

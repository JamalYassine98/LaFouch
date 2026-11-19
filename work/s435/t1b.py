import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
def tap(pg,sel):
  r=pg.evaluate("s=>{const e=[...document.querySelectorAll(s)].find(x=>x.getBoundingClientRect().height);if(!e)return null;e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}",sel)
  if not r: print('SEM',sel);return
  pg.mouse.click(*r);pg.wait_for_timeout(700)
E_=[]
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True,base=False);pg.evaluate("()=>{window.__pops=[];}");pg.on('pageerror',lambda e:E_.append(str(e)));w(600)
  st=lambda n:(pg.screenshot(path='/tmp/s435_%s.png'%n),print(n,pg.evaluate("()=>[__LF.S.view,__LF.S.nvG,window.__nv435.pilha().join('>'),location.hash]")))
  pg.on('console',lambda m:print('C',m.text) if 'POP' in m.text else None)
  
  tap(pg,"#mainnav .mn[data-id='g:din']");st('1idx')
  tap(pg,"#v-grp .nvL[data-id=caixa]");st('2cx')
  pg.evaluate("()=>window.scrollTo(0,400)");w(400);st('3rol')
  pg.evaluate("()=>window.scrollTo(0,0)");w(300)
  tap(pg,"[data-act=cxReservas]");st('4res')
  tap(pg,".nvVs");st('5volta')
  tap(pg,"#mainnav .mn[data-id=vendas]");st('6ven')
  tap(pg,"#mainnav .mn[data-id='g:din']");st('7lembra')
  tap(pg,"#mainnav .mn[data-id='g:din']");st('8denovo');print(pg.evaluate('()=>[history.length,JSON.stringify(history.state),window.__nvDbg]'))
  pg.evaluate("()=>history.back()");w(800);st('9back')
  pg.evaluate("()=>history.back()");w(800);st('10back')
  pg.evaluate("()=>history.back()");w(900);st('11back')
  print('DBG',pg.evaluate('()=>window.__nvDbg'));print('ERROS',E_[:5]);b.close()

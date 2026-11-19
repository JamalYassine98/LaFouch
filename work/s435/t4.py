import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
exec(open('t1.py').read().split('E_=[]')[0].split('from playwright.sync_api import sync_playwright')[1])
E_=[]
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True,base=False);pg.on('pageerror',lambda e:E_.append(str(e)));w(600)
  tap(pg,"#v-inicio .tl[data-id='g:res']");print(pg.evaluate("()=>[__LF.S.view,__LF.S.nvG,__nv435.pilha().join('>')]"));pg.screenshot(path='/tmp/t4a.png')
  tap(pg,"#v-grp .nvL[data-id=hist]");print(pg.evaluate("()=>[__LF.S.view,__nv435.pilha().join('>')]"));pg.screenshot(path='/tmp/t4b.png')
  pg.evaluate("()=>__nvVoltarAndroid()");w(700);print(pg.evaluate("()=>[__LF.S.view,__nv435.pilha().join('>')]"))
  tap(pg,"#mainnav .mn[data-id='g:din']");tap(pg,"#v-grp .nvL[data-id=caixa]");pg.screenshot(path='/tmp/t4c.png')
  pg.evaluate("()=>__LF.ACT.cxmenu&&0");tap(pg,"#mainnav .mn[data-id=inicio]");pg.evaluate("()=>__nvVoltarAndroid()");w(700);pg.screenshot(path='/tmp/t4d.png')
  print('ERROS',E_)
  b.close()

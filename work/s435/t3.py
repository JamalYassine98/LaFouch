import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
exec(open('t1.py').read().split('E_=[]')[0].split('from playwright.sync_api import sync_playwright')[1])
E_=[]
with sync_playwright() as pw:
  for esc in (True,False):
    b,pg,w=ap.abre(pw,'inicio',esc,base=False);pg.on('pageerror',lambda e:E_.append(str(e)));w(600);n='e' if esc else 'c'
    tap(pg,"#mainnav .mn[data-id='g:din']");pg.screenshot(path='/tmp/s435_%s_idx.png'%n)
    tap(pg,"#v-grp .nvL[data-id=caixa]");pg.screenshot(path='/tmp/s435_%s_cx.png'%n)
    pg.evaluate("()=>__LF.inicioGo('hoje')");w(800);pg.screenshot(path='/tmp/s435_%s_ds.png'%n)
    pg.evaluate("()=>window.scrollTo(0,500)");w(500);pg.screenshot(path='/tmp/s435_%s_dsr.png'%n)
    pg.evaluate("()=>window.scrollTo(0,0)");w(300)
    tap(pg,".dHdP");pg.screenshot(path='/tmp/s435_%s_per.png'%n)
    b.close()
  b,pg,w=ap.abre(pw,'caixa',True,base=False);w(400);pg.evaluate("()=>__LF.ACT.grpGerir('g:din')");w(800);pg.screenshot(path='/tmp/s435_grp.png');b.close()
  for a in ('tablet','pc'):
    b,pg,w=ap.abre(pw,'caixa',True,ap=a,base=False);pg.on('pageerror',lambda e:E_.append(str(e)));w(900);pg.screenshot(path='/tmp/s435_%s.png'%a)
    pg.evaluate("()=>__LF.inicioGo('hoje')");w(800);pg.screenshot(path='/tmp/s435_%s_ds.png'%a);b.close()
print('ERROS',E_[:5])

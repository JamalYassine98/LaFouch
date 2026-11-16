import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from comum import olho
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    for esc in (True,False):
        b,pg,w=ap.abre(pw,'estoque',esc);er=[];pg.on('pageerror',lambda e:er.append(str(e)));w(1500)
        print('aviso',pg.evaluate("()=>(document.querySelector('#invFix')||{}).innerText"));pg.evaluate("()=>document.querySelector('#invFix').click()");w(1500)
        print(pg.evaluate("()=>({v:window.__LF.S.view,t:window.__LF.S.dTab,n:document.querySelectorAll('#v-dash .pcNaTela .pcLi').length,tit:[...document.querySelectorAll('#v-dash .dfold,#v-dash [data-act=dfold]')].map(e=>e.innerText.replace(/\\n/g,' ')).filter(t=>/corrigir/.test(t))[0]})"),sorted(olho(pg))[:6],er)
        pg.screenshot(path='/tmp/gt/pc_%d.png'%esc)
        pg.evaluate("()=>window.__LF.inicioGo('hoje')");w(1200);pg.evaluate("()=>[...document.querySelectorAll('#v-dia .famRec')].find(e=>/Despesas do dia/.test(e.innerText)).click()");w(900);print('despesas do dia →',pg.evaluate("()=>window.__LF.S.view"))
        b.close()

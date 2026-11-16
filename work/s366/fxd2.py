import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from comum import olho
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    for esc in (True,False):
        b,pg,w=ap.abre(pw,'dash',esc);er=[];pg.on('pageerror',lambda e:er.append(str(e)));w(1500)
        print('dash linhas',pg.evaluate("()=>[...document.querySelectorAll('.esLs>.esLn')].map(e=>e.innerText.split('\\n')[0])"))
        pg.evaluate("()=>window.__LF.inicioGo('hoje')");w(1200);print('hoje tem câmbio do dia:',pg.evaluate("()=>/Câmbio do dia/.test(document.getElementById('v-dia').innerText)"))
        pg.evaluate("()=>window.__LF.setView('fx')");w(900);pg.evaluate("()=>document.querySelector('[data-act=fjAbre][data-id=prot]').click()");w(1300)
        print('câmbio › protege:',pg.evaluate("()=>document.querySelector('.fjJn').innerText.replace(/\\n/g,' / ').slice(0,230)"),sorted(olho(pg))[:5],er);pg.screenshot(path='/tmp/gt/prot_%d.png'%esc);b.close()

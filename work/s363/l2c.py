import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from comum import olho
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    for esc in (True,False):
        b,pg,w=ap.abre(pw,'dash',esc);er=[];pg.on('pageerror',lambda e:er.append(str(e)));w(2000)
        print('linhas',pg.evaluate("()=>[...document.querySelectorAll('.esLs>.esLn')].map(e=>e.innerText.split('\\n')[0])"))
        pg.evaluate("()=>document.querySelector('.esLn[data-id=res]').click()");w(700);pg.evaluate("()=>document.querySelector('.esLn[data-id=res]').scrollIntoView({block:'start'})");w(300);pg.screenshot(path='/tmp/gt/res_%d.png'%esc)
        print('res aberto',pg.evaluate("()=>document.querySelector('.esRes').innerText.replace(/\\n/g,' / ').slice(0,260)"),sorted(olho(pg))[:6])
        pg.evaluate("()=>{const L=window.__LF;L.S.dTab='din';L.setView('dash')}");w(1200);print('reservas',pg.evaluate("()=>{const t=document.getElementById('dtabBody').innerText;return [/Seu mês/.test(t),/Detalhes do mês/.test(t),/Lucro real do mês/.test(t),document.scrollingElement.scrollHeight]}"))
        pg.evaluate("()=>window.__LF.setView('hist')");w(1000);print('hist',pg.evaluate("()=>/Fechamento do caixa/.test(document.getElementById('v-hist').innerText)"))
        pg.evaluate("()=>window.__LF.inicioGo('hoje')");w(1200);print('hoje',pg.evaluate("()=>/Fechamento do caixa/.test(document.getElementById('v-dia').innerText)"),sorted(olho(pg))[:6])
        pg.evaluate("()=>window.__LF.setView('ajustes')");w(1000);print('aj',pg.evaluate("()=>document.querySelector('.ajS[data-k=pa] .ajRes').innerText"));pg.tap('.ajS[data-k=pa] .ajR');w(1200);print('  →',pg.evaluate("()=>[window.__LF.S.view,window.__LF.S.dTab]"),er)
        b.close()

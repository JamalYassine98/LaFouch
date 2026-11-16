import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from comum import olho
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    for esc in (True,False):
        b,pg,w=ap.abre(pw,'vendas',esc);er=[];pg.on('pageerror',lambda e:er.append(str(e)))
        pg.evaluate("()=>document.querySelector('#vRows .pcard[data-ref]').click()");w(1000);pg.evaluate("()=>document.getElementById('sCartAdd').click()");w(700);pg.evaluate("()=>document.querySelector('[data-act=cartopen]').click()");w(900)
        print(pg.evaluate("()=>document.getElementById('cartCard').innerText.replace(/\\n/g,' / ').slice(0,420)"),sorted(olho(pg))[:6],er);pg.screenshot(path='/tmp/gt/ped_%d.png'%esc)
        b.close()

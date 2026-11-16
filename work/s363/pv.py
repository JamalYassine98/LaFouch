import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from comum import olho
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    b,pg,w=ap.abre(pw,'inicio',True);er=[];pg.on('pageerror',lambda e:er.append(str(e)));pg.evaluate("()=>{const L=window.__LF;L.S.dTab='din';L.S.dfold.paraonde=true;L.setView('dash')}");w(1500)
    print(pg.evaluate("()=>{const c=[...document.querySelectorAll('#dtabBody section')].find(s=>/Livre para você/i.test(s.innerText));return c.innerText.replace(/\\n/g,' / ').slice(-330)}"),sorted(olho(pg))[:5],er)
    pg.evaluate("()=>document.querySelector('#dtabBody .slVai').scrollIntoView({block:'center'})");w(300);pg.screenshot(path='/tmp/gt/pv.png');b.close()

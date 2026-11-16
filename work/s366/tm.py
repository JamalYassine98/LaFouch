import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    b,pg,w=ap.abre(pw,'inicio',True);er=[];pg.on('pageerror',lambda e:er.append(str(e)))
    pg.evaluate("()=>{const L=window.__LF;L.S.dTab='prec';L.setView('dash')}");w(1500)
    print('contador:',pg.evaluate("()=>(document.body.innerText.match(/Black Friday[^\\n]*(\\n[^\\n]*){0,2}/)||[''])[0].replace(/\\n/g,' / ')"))
    pg.evaluate("()=>window.__LF.ACT.temaVer()");w(1300);print('janela:',pg.evaluate("()=>document.querySelector('.ljJn').innerText.replace(/\\n/g,' / ').slice(0,500)"),er)
    pg.evaluate("()=>{const L=window.__LF;L.S.sales.forEach(s=>{s.ts=Date.now()-5*864e5})}");pg.keyboard.press('Escape');w(600);pg.evaluate("()=>window.__LF.ACT.temaVer()");w(1300);print('sem paradas:',pg.evaluate("()=>document.querySelector('.ljJn').innerText.replace(/\\n/g,' / ').slice(0,420)"),er)
    pg.screenshot(path='/tmp/gt/tema.png');b.close()

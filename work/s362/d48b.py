import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    for m in ('brl|111.5','pyg|575000'):
        b,pg,w=ap.abre(pw,'dash',True);er=[];pg.on('pageerror',lambda e:er.append(str(e)));w(1500)
        if m=='brl|111.5': print('lucro',pg.evaluate("()=>document.querySelectorAll('#dtabBody .kpis .kpi>b')[1].innerText"))
        pg.evaluate("m=>window.__LF.ACT.d48Troca(m)",m);w(1800)
        print(m,pg.evaluate("()=>[...document.querySelectorAll('.fjJn input')].map(i=>i.value)"),er);b.close()
    for ap_ in ('tablet','pc'):
        b,pg,w=ap.abre(pw,'dash',True,ap_);w(2000);pg.screenshot(path='/tmp/gt/d48_%s.png'%ap_)
        print(ap_,pg.evaluate("()=>({cols:getComputedStyle(document.querySelector('#dtabBody .kpis')).gridTemplateColumns,sai:[...document.querySelectorAll('#dtabBody .kpi>b')].filter(b=>b.scrollWidth>b.parentElement.clientWidth).length})"));b.close()

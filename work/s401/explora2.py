import sys;sys.path.insert(0,'/home/claude/lafouch/work/s395');sys.path.insert(0,'/home/claude/lafouch/work/s349')
import comum2
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    b,pg,w=comum2.site(pw)
    pg.evaluate("()=>document.querySelector('#grid .card .open, .card .open, .hc .open, [data-ref]').click()");w(1400)
    pg.evaluate("()=>{const x=[...document.querySelectorAll('#layer button')].find(e=>/Comprar/i.test(e.innerText||''));x&&x.click()}");w(1300)
    pg.evaluate("()=>{const x=[...document.querySelectorAll('button,a')].filter(e=>e.getBoundingClientRect().width>0).find(e=>/^Finalizar compra$/i.test((e.innerText||'').trim()));if(x)x.click();else document.querySelector('#bagbtn').click()}");w(1500)
    print(pg.evaluate("()=>{const p=document.querySelector('#layer .panel');return p.innerHTML.replace(/<svg.*?<\\/svg>/g,'').replace(/src=\"[^\"]*\"/g,'').slice(0,3800)}"));pg.screenshot(path='/tmp/s401/cart.png');b.close()

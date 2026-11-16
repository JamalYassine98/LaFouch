import sys;sys.path.insert(0,'/home/claude/lafouch/work/s395');import comum2
from playwright.sync_api import sync_playwright
BT="()=>[...document.querySelectorAll('#layer button,#layer a.btn,#layer label,#layer [data-cta]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>(e.getAttribute('data-cta')||e.id||e.className).toString().slice(0,18)+':'+(e.innerText||'').trim().slice(0,26)).slice(0,30)"
with sync_playwright() as pw:
    b,pg,w=comum2.site(pw)
    pg.evaluate("()=>document.querySelector('#grid .card .open, .card .open, .hc .open, [data-ref]').click()");w(1500);print('1',pg.evaluate(BT))
    pg.evaluate("()=>{const x=[...document.querySelectorAll('#layer button')].find(e=>/Comprar|Adicionar|carrinho|sacola/i.test(e.innerText||''));x&&x.click()}");w(1500);print('2',pg.evaluate(BT))
    print('topo',pg.evaluate("()=>[...document.querySelectorAll('.top button,.top a,[data-bag]')].map(e=>(e.id||e.className||'')+'|'+[...e.attributes].map(a=>a.name).filter(n=>n.startsWith('data-')).join(',')).slice(0,12)"))
    pg.evaluate("()=>{const x=document.querySelector('[data-bag]')||document.querySelector('#bagbtn')||[...document.querySelectorAll('.top button')].pop();x&&x.click()}");w(1500);print('3',pg.evaluate(BT))
    for k in range(4):
        r=pg.evaluate("()=>{const x=[...document.querySelectorAll('#layer button')].filter(e=>e.getBoundingClientRect().width>0).find(e=>/Continuar|Finalizar|Ir para|Pagamento|Próximo|Confirmar/i.test(e.innerText||''));if(x){const t=x.innerText;x.click();return t}return null}");w(1400);print('passo',k,r,pg.evaluate(BT)[:16])
    pg.screenshot(path='/tmp/s395/e2.png');b.close()

exec(open('ver.py').read().split("if __name__")[0])
with sync_playwright() as pw:
    b,pg,log=abre(pw)
    pg.evaluate("()=>document.querySelector('#home .exs [data-exc]').click()");pg.wait_for_timeout(1500)
    print(pg.evaluate("()=>[typeof window.__lfExc, document.querySelector('#grid .card [data-open]')&&document.querySelector('#grid .card [data-open]').outerHTML.slice(0,120)]"))
    pg.evaluate("()=>document.querySelector('#grid .card [data-open]').click()");pg.wait_for_timeout(1500)
    print(pg.evaluate("()=>[...document.querySelectorAll('#layer button')].map(e=>(e.innerText||'').trim()+'|'+[...e.attributes].map(a=>a.name).join(',')).filter(x=>/Compr|carrinho|Adicion/i.test(x)).slice(0,5)"))
    b.close()

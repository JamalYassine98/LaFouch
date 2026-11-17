src=open('ver.py').read().split("if __name__")[0]
exec(src.replace("localStorage.setItem('lf_lang','pt')","localStorage.setItem('lf_lang',window.__L||'es')"))
import sys
with sync_playwright() as pw:
  for W,H,nm in ((390,844,'cel'),(820,1180,'tab'),(1440,900,'pc')):
    b,pg,log=abre(pw,W=W,H=H)
    pg.evaluate("()=>{const h=document.querySelector('#home .exs');h&&h.scrollIntoView({block:'start'});window.scrollBy(0,-140)}");pg.wait_for_timeout(400);pg.screenshot(path=T+'M_%s_home.png'%nm)
    pg.evaluate("()=>{const a=document.querySelector('#home .exs [data-exc]');a&&a.click()}");pg.wait_for_timeout(1800);pg.screenshot(path=T+'M_%s_aba.png'%nm)
    print(nm,'aba:',pg.evaluate("()=>(document.querySelector('#vitrine .exh')||{innerText:''}).innerText.replace(/\\n/g,' | ').slice(0,140)"))
    pg.evaluate("()=>document.querySelector('#grid .card [data-open]').click()");pg.wait_for_timeout(1500)
    pg.evaluate("()=>{const x=[...document.querySelectorAll('#layer button')].find(e=>/Comprar/i.test(e.innerText||''));x&&x.click()}");pg.wait_for_timeout(1300)
    if not pg.evaluate("()=>/carrito/i.test((document.querySelector('#layer')||{innerText:''}).innerText.slice(0,40))"):pg.evaluate("()=>document.querySelector('#bagbtn').click()");pg.wait_for_timeout(1300);pg.screenshot(path=T+'M_%s_cart.png'%nm)
    t=pg.evaluate("()=>(document.querySelector('#layer')||{innerText:''}).innerText")
    import re;print(nm,'cart:',re.sub(r'\s+',' ',t)[:400])
    pg.evaluate("()=>{const b=document.querySelector('#layer [data-cartroca]');b&&b.click()}");pg.wait_for_timeout(900);pg.screenshot(path=T+'M_%s_sheet.png'%nm)
    print(nm,'sheet:',pg.evaluate("()=>{const s=document.querySelector('.sh');return s?s.innerText.replace(/\\n/g,' | ').slice(0,300):null}"))
    print('erros',[x for x in log if 'ERR_FAILED' not in x][:5]);b.close()

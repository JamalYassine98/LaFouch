exec(open('ver.py').read().split("if __name__")[0])
import json as J
with sync_playwright() as pw:
    b,pg,log=abre(pw)
    pg.evaluate("()=>{const c=JSON.parse(localStorage.getItem('lf_conta'));c.nac='py';c.doc='';localStorage.setItem('lf_conta',JSON.stringify(c))}")
    pg.evaluate("document.querySelector('#contabtn').click()");pg.wait_for_timeout(1200)
    q="()=>{const d=[...document.querySelectorAll('#layer [id$=dt]')].find(x=>x.querySelector('[data-doct]'));if(!d)return null;const p=d.id.slice(0,-2),i=document.getElementById(p+'d'),l=document.querySelector('label[for='+p+'d]');return [d.id,d.hidden,l&&l.textContent,i&&i.placeholder]}"
    print('cédula',pg.evaluate(q))
    pg.evaluate("()=>{const b=document.querySelector('#layer [data-doct=ruc]');b&&b.click()}");pg.wait_for_timeout(400)
    print('ruc',pg.evaluate(q))
    pg.evaluate("()=>{const b=document.querySelector('#layer [data-doct=ruc]');b&&b.scrollIntoView({block:'center'})}");pg.screenshot(path=T+'L_perfil_ruc.png')
    print('erros',[x for x in log if 'ERR_FAILED' not in x][:5]);b.close()

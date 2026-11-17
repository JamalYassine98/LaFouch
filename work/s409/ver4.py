exec(open('ver.py').read().split("if __name__")[0])
with sync_playwright() as pw:
    b,pg,log=abre(pw)
    pg.evaluate("()=>{const t=[...document.querySelectorAll('[data-cta=conta]')];return t.length}")
    pg.evaluate("()=>localStorage.removeItem('lf_conta')")
    pg.evaluate("(document.querySelector('#contabtn')||{click(){}}).click()");pg.wait_for_timeout(900)
    n=pg.evaluate("()=>{const t=[...document.querySelectorAll('#layer [data-cta=conta]')].filter(e=>e.offsetParent);if(t[0])t[0].click();return t.length}");print('botões',n,pg.evaluate("()=>(document.querySelector('#layer')||{innerText:'?'}).innerText.slice(0,300)"));pg.wait_for_timeout(1200)
    print('cadastro',pg.evaluate("()=>[!!document.querySelector('[id$=dt].cfdt,#cfdt,#mpdt,[id$="dt"]'),document.querySelector('[id$=dt].cfdt,#cfdt,#mpdt,[id$="dt"]')&&document.querySelector('[id$=dt].cfdt,#cfdt,#mpdt,[id$="dt"]').hidden,(document.querySelector('#cfdt')||{}).innerText]"))
    # força Paraguai
    pg.evaluate("()=>{const s=[...document.querySelectorAll('#layer select')].find(x=>[...x.options].some(o=>o.value==='py'));if(s){s.value='py';s.dispatchEvent(new Event('change',{bubbles:true}))}}");pg.wait_for_timeout(500)
    print('py',pg.evaluate("()=>{const d=document.querySelector('[id$=dt].cfdt,#cfdt,#mpdt,[id$="dt"]');return d?[d.hidden,d.innerText.slice(0,120)]:null}"))
    pg.evaluate("()=>{const d=document.querySelector('[id$=dt].cfdt,#cfdt,#mpdt,[id$="dt"]');d&&d.scrollIntoView({block:'center'})}");pg.screenshot(path=T+'L_cadastro.png')
    # troca para RUC
    r=pg.evaluate("()=>{const d=document.querySelector('[id$=dt].cfdt,#cfdt,#mpdt,[id$="dt"]');if(!d)return null;const b=[...d.querySelectorAll('button,[data-cftp],label')].find(x=>/RUC/.test(x.textContent));if(b)b.click();return b?b.outerHTML.slice(0,120):'sem'}");print('ruc btn',r);pg.wait_for_timeout(400)
    print('ruc',pg.evaluate("()=>{const d=document.querySelector('[id$=dt].cfdt,#cfdt,#mpdt,[id$="dt"]');const i=d&&d.querySelector('input');return i?[i.placeholder,(document.getElementById('cfdl')||{}).textContent]:null}"))
    pg.screenshot(path=T+'L2_ruc.png');print('erros',[x for x in log if 'ERR_FAILED' not in x][:5]);b.close()

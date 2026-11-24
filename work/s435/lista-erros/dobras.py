# abre cada dobra ⌄ de uma tela (uma por vez) e fotografa + mede
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap,mede as M
from playwright.sync_api import sync_playwright
src=open('fotos.py').read();exec(src[src.index('NUV='):src.index('T=[')])
TELAS={'Ajustes':('ajustes',None),'Regras':('inicio',setor('regras')),'Ofertas':('inicio',setor('ofertas')),'Ferramentas':('inicio',setor('ferr'))}
LIST="()=>[...document.querySelectorAll('.view:not([hidden]) *')].filter(e=>e.children.length<=6&&/⌄|▾/.test(e.textContent)===false&&e.getBoundingClientRect().height>=40&&e.getBoundingClientRect().height<90&&e.querySelector('svg:last-child, i:last-child')&&/(^|\\s)(ajS|ajR|dob|nvL|ln|row)/.test(e.className)).length"
CHEV="()=>{const v=document.querySelector('.view:not([hidden])');return [...v.querySelectorAll('button,[data-act],summary,[role=button]')].filter(e=>{const r=e.getBoundingClientRect();if(!r.height)return false;const t=e.innerHTML;return /chev|⌄|dob|ajR|data-dob|aria-expanded/.test(t+e.outerHTML.slice(0,200))&&!/›/.test(e.textContent)}).map((e,i)=>i)}"
R={}
with sync_playwright() as pw:
  for nome,(v,js) in TELAS.items():
    b,pg,w=ap.abre(pw,v,True,'celular',base=False);w(700);pg.evaluate(NUV);pg.evaluate("()=>__LF.setView(__LF.S.view)");w(400)
    if js:pg.evaluate(js);w(1200)
    n=len(pg.evaluate(CHEV));b.close();print(nome,'dobras',n)
    for i in range(n):
      for esc in (True,):
        b,pg,w=ap.abre(pw,v,esc,'celular',base=False);w(700);pg.evaluate(NUV);pg.evaluate("()=>__LF.setView(__LF.S.view)");w(400)
        if js:pg.evaluate(js);w(1200)
        t=pg.evaluate("(i)=>{const v=document.querySelector('.view:not([hidden])');const L=[...v.querySelectorAll('button,[data-act],summary,[role=button]')].filter(e=>{const r=e.getBoundingClientRect();if(!r.height)return false;return /chev|⌄|dob|ajR|data-dob|aria-expanded/.test(e.innerHTML+e.outerHTML.slice(0,200))&&!/›/.test(e.textContent)});const e=L[i];e.scrollIntoView({block:'start'});scrollBy(0,-120);e.setAttribute('data-esb','1');return e.textContent.trim().replace(/\\s+/g,' ').slice(0,30)}",i);w(300);pg.locator('[data-esb]').first.click();w(1000)
        a,_=M.percorre(pg,None);R['%s ⌄ %s'%(nome,t)]=[(k[0],x.get('d','')[:110]) for k,x in a.items()]
        pg.screenshot(path='dob_%s_%02d.png'%(nome,i));b.close()
json.dump(R,open('dobras.json','w'),ensure_ascii=False,indent=1)
for k,v in R.items():print(k,'|',len(v),v[:4])

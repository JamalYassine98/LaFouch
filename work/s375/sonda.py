import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
AJ="""k=>{const L=window.__LF;L.setView('ajustes');setTimeout(()=>{const s=document.querySelector('#ajGrp .ajS[data-k='+k+'] .ajR');s&&s.click()},400)}"""
CASES=[
 ('sync','syncdesl',"()=>{const S=window.__LF.S;S.nuvem={email:'loja@x.com',rt:'r',ts:Date.now(),cot:'',dst:''};S.syncOn=true}","sync"),
 ('nuvem','nvSair',"()=>{const S=window.__LF.S;S.nuvem={email:'loja@x.com',rt:'r',ts:Date.now(),cot:'',dst:''}}","bk"),
 ('sairtodos','apSairAbre',"()=>{const S=window.__LF.S;S.nuvem={email:'loja@x.com',rt:'r',ts:Date.now(),cot:'',dst:''};S.syncOn=true}","sync"),
 ('pin','pinoff',"()=>{const S=window.__LF.S;S.pin=S.pin||'1234';S.bioOn=false}","seg"),
 ('bk','bkimp',"()=>{}","bk"),
]
with sync_playwright() as pw:
  for nome,act,st,k in CASES:
    b,pg,w=ap.abre(pw,'inicio',False);w(500)
    try:
      pg.evaluate(st);pg.evaluate(AJ,k);w(1500)
      r=pg.evaluate("a=>{const e=document.querySelector('[data-act='+a+']');return e?[e.textContent.trim().slice(0,50),e.offsetParent!==null]:null}",act)
    except Exception as e: r='ERR '+str(e)[:80]
    print(nome,act,r,pg.evaluate("()=>[...document.querySelectorAll('#ajGrp .ajS')].map(s=>s.dataset.k).join(',')"))
    b.close()

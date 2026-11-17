import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',False);w(500)
  pg.route('**/*googleapis.com/**',lambda r:r.fulfill(status=200,body='{"documents":[]}',content_type='application/json'))
  pg.evaluate("()=>{const S=window.__LF.S;S.nuvem={email:'loja@x.com',rt:'r',ts:Date.now(),cot:'',dst:''};S.syncOn=true;S.pinHash='x';S.bioOn=false}")
  for k in ('seg','sync','bk'):
    pg.evaluate("k=>{const L=window.__LF;L.setView('ajustes');setTimeout(()=>{const s=document.querySelector('#ajGrp .ajS[data-k='+k+']:not(.on) .ajR');s&&s.click()},300)}",k);w(1200)
    print(k,pg.evaluate("()=>[...document.querySelectorAll('#v-ajustes [data-act]')].filter(e=>e.offsetParent).map(e=>e.dataset.act+':'+e.textContent.trim().slice(0,30)).join(' | ')"))
  b.close()

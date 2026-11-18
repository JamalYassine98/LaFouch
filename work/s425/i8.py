import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
LM="()=>{const S=__LF.S;S.lm={usd:{v:6487,c:6420},brl:{v:1196,c:1180},eur:{v:7100,c:7000},arb:{v:5.43,c:5.38},ts:Date.now(),hora:'15:00',fonte:'Sucursal Jebai'};__LF.setView('inicio');__LF.setView('fx');return 1}"
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(500);print(pg.evaluate(LM));w(1200)
  print(pg.evaluate("""()=>{const h=document.querySelector('#v-fx h1');const b=document.querySelector('.fxModo');if(!b)return 'sem botão';const r=document.createRange();r.selectNodeContents(h);const q=[...r.getClientRects()][0];const bq=b.getBoundingClientRect();const cs=getComputedStyle(b);return {titulo:(q.top+q.bottom)/2,botao:(bq.top+bq.bottom)/2,dir:bq.right,txt:b.innerText,h:bq.height,w:bq.width,rad:cs.borderRadius,bd:cs.border}}"""))
  pg.screenshot(path='/tmp/s425/fxc.png');b.close()

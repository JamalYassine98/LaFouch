import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
LM="()=>{const S=__LF.S;S.lm={usd:{v:6487,c:6420},brl:{v:1196,c:1180},eur:{v:7100,c:7000},arb:{v:5.43,c:5.38},ts:Date.now(),hora:'15:00'};return 1}"
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  for x in [LM]+dict(C)['cambio-troca']:
    try: pg.evaluate(x)
    except Exception: pass
    w(900)
  print(pg.evaluate("""()=>{const i=[...document.querySelectorAll('input')].filter(x=>x.getBoundingClientRect().height)[0];let o=[];let p=i;for(let k=0;k<4&&p;k++){const c=getComputedStyle(p);const r=p.getBoundingClientRect();o.push(p.tagName+'.'+p.className+' bb:'+c.borderBottom+' pr:'+c.paddingRight+' w'+Math.round(r.width)+' R'+Math.round(r.right)+' bgimg:'+c.backgroundImage.slice(0,30)+' sh:'+c.boxShadow.slice(0,40));p=p.parentElement}return o}"""));b.close()

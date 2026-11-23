import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
def shot(pg,sel,out,pad=60):
  pg.evaluate("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getBoundingClientRect().width);e&&e.scrollIntoView({block:'center'})}",sel);pg.wait_for_timeout(500)
  r=pg.evaluate("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getBoundingClientRect().width);if(!e)return null;const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height,e.className,e.innerHTML.slice(0,300)]}",sel)
  print(out,r)
  if r: pg.screenshot(path=out,clip={'x':0,'y':max(0,r[1]-pad),'width':390,'height':r[3]+pad*2})
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'ajustes',True,'celular',base=True);w(900);shot(pg,'.tmseg','r_tema.png');b.close()
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=True);w(900);pg.evaluate("()=>document.getElementById('btnFilt').click()");w(700);shot(pg,'#sortChips','r_ordem.png',90);b.close()
  b,pg,w=ap.abre(pw,'caixa',True,'celular',base=True);w(900)
  print(pg.evaluate("()=>[...document.querySelectorAll('summary,button,.shT,[data-sh]')].filter(e=>/Retirada/.test(e.textContent)).map(e=>e.tagName+'|'+e.className+'|'+e.textContent.trim().slice(0,40))"))
  pg.evaluate("()=>{const e=[...document.querySelectorAll('summary,button,[data-sh],details')].find(e=>/Retirada do dono/.test(e.textContent)&&e.getBoundingClientRect().width);if(e){if(e.tagName=='DETAILS')e.open=true;else e.click()}}");w(800)
  shot(pg,'.sg418','r_retirada.png');b.close()

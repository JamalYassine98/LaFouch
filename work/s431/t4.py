import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  for t in ['catalogo-carrinho','catalogo-pagamento']:
    b,pg,w=ap.abre(pw,'inicio',True);w(300)
    for x in dict(C)[t]:
      try: pg.evaluate(x)
      except Exception: pass
      w(900)
    print(t,pg.evaluate("""()=>{const v=document.getElementById('v-vendas');const h=v.querySelector('h1');let o=[];let p=h;for(let k=0;k<3;k++){o.push(p.tagName+'.'+p.className+'#'+p.id+' :: '+p.outerHTML.slice(0,200));p=p.parentElement}const hd=document.querySelector('#pagHead,.c54Hd');o.push('HD '+(hd&&hd.outerHTML.slice(0,400)));return o}"""));b.close()

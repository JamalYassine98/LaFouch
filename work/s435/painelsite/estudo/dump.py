import sys;sys.path.insert(0,'/home/claude/lafouch/work/kit');import painel
from playwright.sync_api import sync_playwright
from PIL import Image
O='/home/claude/lafouch/work/s435/painelsite/estudo/'
with sync_playwright() as pw:
  b,pg,w,log=painel.abre(pw,True,390,844)
  for v in ['vit','prod','msg','tem','anl','cfg']:
    painel.vai(pg,v);w(800)
    pg.evaluate("()=>{document.querySelectorAll('details').forEach(d=>d.open=true)}");w(300)
    t=pg.evaluate("()=>document.body.innerText")
    open(O+'txt_'+v+'.txt','w').write(t)
    h=pg.evaluate("document.scrollingElement.scrollHeight");fot=[];y=0
    while y<h and len(fot)<6:
      pg.evaluate(f"scrollTo(0,{y})");w(250);pg.screenshot(path='/tmp/d.png');fot.append(Image.open('/tmp/d.png').copy());y+=700
    W=sum(f.width for f in fot)+20*(len(fot)-1);im=Image.new('RGB',(W,fot[0].height));x=0
    for f in fot: im.paste(f,(x,0));x+=f.width+20
    im.save(O+'p_'+v+'.jpg',quality=70);print(v,h,len(t))
  # um produto aberto
  painel.vai(pg,'prod');w(600);pg.evaluate("()=>{const r=document.querySelector('#v_prod .row, .prow, [data-ref]');r&&r.click()}");w(1200)
  open(O+'txt_prod_aberto.txt','w').write(pg.evaluate("()=>document.body.innerText"));pg.screenshot(path=O+'p_prod_aberto.png',full_page=True)
  b.close()

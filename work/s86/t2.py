from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
import io
G=[('ajusta',5.0),('tapinha',3.6),('limpa',11.1),('pensando',2.2),('joinha',1.5),('palminha',2.4),('bocejo',2.4),('espreguica',2.4),('danca',2.4),('tchau',1.8),('comemora',1.8),('pezinhos',1.8)]
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=3)
  errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
  pg.goto('http://localhost:8771/');pg.wait_for_timeout(2000);pg.evaluate("localStorage.setItem('lf_gzmudo','1')")
  pg.evaluate("document.querySelector('[data-gzopen]').click()");pg.wait_for_timeout(3500)
  pg.evaluate("clearTimeout(__LFGZ.Z.ti);__LFGZ.Z.m.ocioso=false;__LFGZ.Z.m.pos(120,300)")
  for nome,dur in G:
    n=12;tiles=[]
    pg.evaluate(f"__LFGZ.Z.m.gesto('{nome}')")
    for i in range(n):
      pg.wait_for_timeout(int(dur*1000/n))
      r=pg.evaluate("(()=>{const r=document.querySelector('#gw .mochi').getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()");tiles.append(Image.open(io.BytesIO(pg.screenshot(clip={'x':r[0]-30,'y':r[1]-25,'width':r[2]+60,'height':r[3]+40}))).convert('RGB').resize((int((r[2]+60)*1.6),int((r[3]+40)*1.6))))
    pg.wait_for_timeout(500)
    w,h=tiles[0].size;sh=Image.new('RGB',(w*6+60,h*2+40),'white')
    for i,t in enumerate(tiles):sh.paste(t,((i%6)*w+((i%6)*10),(i//6)*h+20))
    ImageDraw.Draw(sh).text((4,2),nome,fill='black');sh.save(f'/tmp/g_{nome}.png')
  print('erros',errs)

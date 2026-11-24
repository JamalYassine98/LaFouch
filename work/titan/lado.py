# TITAN · teste do gabarito: app REAL (hoje) ao lado do último esboço APROVADO de cada tela, para o olho (regra 18)
import sys,os
ARGV=sys.argv[:]
sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));import indice
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O=os.path.join(os.path.dirname(os.path.abspath(__file__)),'gabarito');os.makedirs(O,exist_ok=True)
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',34)
so=ARGV[1].split(',') if len(ARGV)>1 else None
with sync_playwright() as pw:
  for nome,v,passos,esb,img,impl in indice.TELAS:
    if so and nome not in so:continue
    b,pg,w=ap.abre(pw,v,True,'celular',base=False);w(900)
    for js in passos:
      try:pg.evaluate(js)
      except Exception:pass
      w(1300)
    pg.screenshot(path='/tmp/ld.png');b.close()
    r=Image.open('/tmp/ld.png').convert('RGB');a=Image.open(img).convert('RGB')
    H=1600;r=r.resize((r.width*H//r.height,H));a=a.resize((a.width*H//a.height,H))
    o=Image.new('RGB',(r.width+a.width+60,H+80),(30,30,36));d=ImageDraw.Draw(o)
    d.text((20,20),'APP HOJE · '+nome,font=F,fill=(240,240,240));d.text((r.width+40,20),'APROVADO · esboço '+esb,font=F,fill=(240,240,240))
    o.paste(r,(20,70));o.paste(a,(r.width+40,70));f=os.path.join(O,'lado_%s.jpg'%nome.replace(' ','_').replace('(','').replace(')',''))
    o.save(f,quality=80);print('ok',nome)

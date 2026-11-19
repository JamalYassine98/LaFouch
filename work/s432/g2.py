import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import olho,novos
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
from PIL import Image
T='/tmp/s432/';A2=open('/home/claude/lafouch/work/verif/alin2.js').read();CSS=open('luxo.css').read();JS=open('luxo.js').read()
t=os.environ['TELA'];esc=os.environ.get('ESC','1')=='1';ps=dict(C).get(t)
with sync_playwright() as pw:
  fs=[];KS=[];oo=[]
  for v in ('',open('campoA.css').read(),open('campoB.css').read()):
    b,pg,w=ap.abre(pw,'inicio',esc);w(300)
    for x in ps:
      try: pg.evaluate(x)
      except Exception: pass
      w(900)
    pg.add_style_tag(content=CSS);pg.evaluate(JS)
    if v: pg.add_style_tag(content=v)
    w(500);oo.append(olho(pg));KS.append(set((x['r'],x['ex'][0]) for x in pg.evaluate(A2)))
    fp=T+'c_%s_%d_%d.png'%(t,esc,len(fs));pg.screenshot(path=fp);fs.append(fp);b.close()
  for i in (1,2): print(i,'alin novos',sorted(KS[i]-KS[0]),'olho',novos(oo[0],oo[i]))
  ims=[Image.open(f) for f in fs];W,H=ims[0].size
  o=Image.new('RGB',(W*3+80,H+90),'white')
  from PIL import ImageDraw,ImageFont
  d=ImageDraw.Draw(o);f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',36)
  for i,(im,l) in enumerate(zip(ims,['Proposta 143 (só linha)','A · fundo leve + linha','B · linha mais clara'])):
    o.paste(im,(i*(W+40),90));d.text((i*(W+40)+10,25),l,fill='black',font=f)
  o.save('/home/claude/lafouch/work/s432/144-campo-%s-%s.jpg'%(t,'escuro' if esc else 'claro'),quality=88)

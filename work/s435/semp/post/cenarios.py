# Esboço 74 (S435, 22/11 16:55) — o mesmo giro real (BR44118) em 4 CENÁRIOS com luz própria, pelo estudo parte 2
# (work/s435/semp/ESTUDO-VIDEO-LUXO-22-11.md): 1 revelação pela luz · 2 giro herói com reflexo · 3 macro com luz por trás · 4 pedra clara
# com sombra de janela + logo. O branco da gravação sai (a peça é recortada); as lentes transparentes deixam o cenário aparecer.
# Cores tiradas da própria peça (acetato rosado-acinzentado). Sem frase. Sem som. Os cenários são desenhados em código (não há foto de cenário).
import subprocess,os,glob
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageFilter,ImageChops
W,H,FPS=1080,1920,30
F=sorted(glob.glob('/tmp/gv/f_*.jpg'));N=len(F)
JO=lambda s,w='300':ImageFont.truetype('/tmp/fnt/jost-%s.ttf'%w,s)
ease=lambda t:0 if t<=0 else 1 if t>=1 else t*t*(3-2*t)
rng=np.random.default_rng(7)
def ruido(esc,sig):
  r=rng.random((H//esc+2,W//esc+2));im=Image.fromarray((r*255).astype('uint8')).resize((W,H),Image.BICUBIC).filter(ImageFilter.GaussianBlur(sig))
  return np.asarray(im).astype(float)/255
_c={}
def peca(i):
  """quadro do giro com o branco virando transparente (lente clara fica translúcida)"""
  i=int(max(0,min(N-1,i)))
  if i in _c:return _c[i]
  if len(_c)>30:_c.clear()
  a=np.asarray(Image.open(F[i]).convert('RGB')).astype(float);d=255-a.min(axis=2)
  al=np.clip((d-14)/40,0,1);al=np.asarray(Image.fromarray((al*255).astype('uint8')).filter(ImageFilter.GaussianBlur(.8))).astype(float)/255;im=Image.fromarray(a.astype('uint8')).convert('RGBA');im.putalpha(Image.fromarray((al*255).astype('uint8')))
  _c[i]=im;return im
def poe(base,img,cx,cy,larg,ref=None,sombra=None):
  r=larg/img.width;im=img.resize((int(img.width*r),int(img.height*r)),Image.LANCZOS);x=int(cx-im.width/2);y=int(cy-im.height/2)
  if sombra:
    s=Image.new('RGBA',base.size);sa=im.split()[3].point(lambda v:int(v*sombra[1]));sh=Image.new('RGBA',im.size,sombra[0]+(0,));sh.putalpha(sa)
    s.alpha_composite(sh,(x+sombra[2],y+sombra[3]));base.alpha_composite(s.filter(ImageFilter.GaussianBlur(sombra[4])))
  if ref:  # reflexo na superfície: a peça invertida, sumindo para baixo
    rf=im.transpose(Image.FLIP_TOP_BOTTOM);g=np.linspace(ref,0,rf.height)[:,None]*np.ones((1,rf.width))
    a=np.asarray(rf.split()[3]).astype(float)*g;rf.putalpha(Image.fromarray(a.astype('uint8')));base.alpha_composite(rf.filter(ImageFilter.GaussianBlur(2)),(x,int(cy+im.height*.36)))
  base.alpha_composite(im,(x,y));return (x,y,im)
def cor(c):return np.array(c,float)
# --- cenários (tons da peça: rosado-acinzentado; a pedra é off-white quente) ---
yy,xx=np.mgrid[0:H,0:W]
def fundo_escuro():
  t=np.clip(np.sqrt(((xx-W*.5)/W)**2+((yy-H*.45)/H*1.4)**2)/.7,0,1)[...,None]
  c=cor([58,48,47])*(1-t)+cor([18,15,15])*t+ (ruido(3,1.2)[...,None]-.5)*6
  return Image.fromarray(np.clip(c,0,255).astype('uint8')).convert('RGBA')
def fundo_estudio():  # parede clara que vira chão (curva), tons da peça
  t=np.clip((yy-H*.20)/(H*.55),0,1)[...,None];c=cor([236,229,226])*(1-t)+cor([214,203,199])*t
  c=c+(ruido(2,1.0)[...,None]-.5)*3;return Image.fromarray(np.clip(c,0,255).astype('uint8')).convert('RGBA')
def fundo_pedra():  # pedra clara lisa: tom quente, grão fino e 3 veios longos muito fracos
  t=np.clip((yy/H),0,1)[...,None];base=cor([222,213,203])*(1-t)+cor([205,195,185])*t+(ruido(1,.6)[...,None]-.5)*4+(ruido(60,80)[...,None]-.5)*6
  im=Image.fromarray(np.clip(base,0,255).astype('uint8')).convert('RGBA');v=Image.new('L',(W,H),0);d=ImageDraw.Draw(v)
  for x0,y0,x1,y1,w in [(-100,300,1200,700,3),(-200,1250,1300,1500,2),(100,1700,1200,1950,2)]:d.line([(x0,y0),(x1,y1)],fill=255,width=w)
  v=v.filter(ImageFilter.GaussianBlur(3));sh=Image.new('RGBA',(W,H),(150,135,125,0));sh.putalpha(v.point(lambda q:int(q*.35)));im.alpha_composite(sh);return im
ESC,EST,PED=fundo_escuro(),fundo_estudio(),fundo_pedra()
def janela(t):  # sombra de janela que anda devagar
  m=Image.new('L',(W,H),0);d=ImageDraw.Draw(m);dx=int(-120+90*t)
  for k in range(3):
    x0=dx+k*380;d.polygon([(x0,0),(x0+260,0),(x0+260+520,H),(x0+520,H)],fill=255)
  d.rectangle([0,int(H*.43),W,int(H*.43)+46],fill=0);return m.filter(ImageFilter.GaussianBlur(38))
lg0=Image.open('/home/claude/lafouch/www/logo-app.png').convert('RGBA')
def logo(c,larg):
  al=lg0.split()[3];im=Image.new('RGBA',lg0.size,c+(255,));im.putalpha(al);return im.resize((larg,int(larg*lg0.height/lg0.width)),Image.LANCZOS)
def esp(d,xy,txt,f,c,e):
  ws=[d.textlength(ch,font=f) for ch in txt];x=xy[0]-(sum(ws)+e*(len(txt)-1))/2
  for ch,w in zip(txt,ws):d.text((x,xy[1]),ch,font=f,fill=c);x+=w+e
TOM=(120,104,101)
# --- tomadas ---
def S1(t):  # revelação pela luz: a peça de frente no escuro, uma faixa de luz passa e fica uma luz suave
  b=ESC.copy();poe(b,peca(0),W/2,H*.47,W*1.05,sombra=((0,0,0),.55,0,26,22))
  k=ease(t/2.6);m=Image.new('L',(W,H),0);d=ImageDraw.Draw(m);x=-500+k*(W+900)
  d.polygon([(x,0),(x+260,0),(x-240,H),(x-500,H)],fill=255);m=m.filter(ImageFilter.GaussianBlur(70))
  base=Image.eval(b.convert('RGB'),lambda v:int(v*(.22+.78*ease((t-1.4)/1.4))));luz=Image.eval(b.convert('RGB'),lambda v:min(255,int(v*1.25)))
  return Image.composite(luz,base,m)
def S2(t):  # giro herói: estúdio claro, a peça gira devagar sobre superfície que reflete
  b=EST.copy();poe(b,peca(t*FPS*1.45),W/2,H*.44,W*.95,ref=.30);return b.convert('RGB')
def S3(t):  # macro com luz por trás: o acetato acende contra o escuro
  b=ESC.copy();p=peca(250+t*FPS*.9);r=W*2.6/p.width;cx=W*(.62-.05*t);cy=H*.47
  pm=p.resize((int(p.width*r),int(p.height*r)),Image.LANCZOS);x=int(cx-pm.width*.30);y=int(cy-pm.height*.42)
  gl=Image.new('RGBA',pm.size,(255,214,196,0));gl.putalpha(pm.split()[3].point(lambda v:int(v*.45) if v>120 else 0));halo=Image.new('RGBA',b.size);halo.alpha_composite(gl,(x,y))
  b.alpha_composite(halo.filter(ImageFilter.GaussianBlur(28)));b.alpha_composite(pm,(x,y));return b.convert('RGB')
def S4(t):  # pedra clara com sombra de janela; a peça deitada de frente; logo e código no tom da peça
  b=PED.copy();sm=janela(t);esc=Image.new('RGBA',(W,H),(60,48,44,255));esc.putalpha(sm.point(lambda v:int(v*.20)));b.alpha_composite(esc)
  poe(b,peca(0),W/2,H*.40,W*.88,sombra=((40,30,28),.55,12,34,16))
  l=Image.new('RGBA',(W,H));d=ImageDraw.Draw(l);esp(d,(W/2,H*.60),'BR44118  ·  ACETATO',JO(30),TOM+(255,),7)
  k=ease((t-.6)/.9);l.putalpha(l.split()[3].point(lambda v:int(v*k)));b.alpha_composite(l)
  lg=logo(TOM,190);k2=ease((t-1.1)/.9);lg.putalpha(lg.split()[3].point(lambda v:int(v*k2)));b.alpha_composite(lg,(int(W/2-95),int(H*.72)));return b.convert('RGB')
CENAS=[(S1,3.0),(S2,5.5),(S3,3.0),(S4,3.5)]
def render(saida):
  ant=None;arqs=[]
  for n,(fn,dur) in enumerate(CENAS):
    tmp='/tmp/cz_c%d.tmp.mp4'%n;p=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s','%dx%d'%(W,H),'-r',str(FPS),'-i','-','-c:v','libx264','-crf','18','-preset','veryfast','-pix_fmt','yuv420p',tmp],stdin=subprocess.PIPE)
    nf=int(dur*FPS)
    for i in range(nf):
      f=fn(i/FPS)
      if ant is not None and i<15:f=Image.blend(ant,f,ease((i+1)/15))
      p.stdin.write(f.tobytes());last=f
    p.stdin.close();p.wait();assert p.returncode==0;os.replace(tmp,'/tmp/cz_c%d.mp4'%n);arqs.append('/tmp/cz_c%d.mp4'%n);ant=last
  open('/tmp/cz_lista.txt','w').write(''.join("file '%s'\n"%a for a in arqs))
  subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i','/tmp/cz_lista.txt','-c','copy',saida],check=True);print('ok',saida)
if __name__=='__main__':
  import sys
  if 'quadros' in sys.argv:
    q=[S1(.9),S1(2.8),S2(3.0),S3(1.5),S4(3.0)];S=Image.new('RGB',(5*360+6*16,640+32),(17,20,26))
    for i,f in enumerate(q):S.paste(f.resize((360,640)),(16+i*376,16))
    S.save('/tmp/cz_quadros.jpg',quality=88);print('ok quadros')
  else: render('/home/claude/lafouch/work/s435/semp/esboco_74_cenarios_BR44118.mp4')

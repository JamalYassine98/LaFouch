# Esboço 73 (S435, 22/11 16:45) — vídeo de status/Reels pelo ESTUDO de luxo (work/s435/semp/ESTUDO-VIDEO-LUXO-22-11.md), com o GIRO real
# do teste do dono (catalogo/teste-giro/giro.mp4: a peça BR44118 de acetato, como está gravado na própria lente). Sem frase inventada,
# sem cor do app: o fundo é o branco da própria gravação; o texto final é só o código e o material (gravados na peça) + o logo em tom da peça.
# Câmera lenta = quadros intermediários (ffmpeg minterpolate, 30→90 qps) tocados a 30 qps. 4 tomadas, corte com dissolução curta.
import subprocess,os,glob
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageFilter
W,H,FPS=1080,1920,30
F=sorted(glob.glob('/tmp/gv/f_*.jpg'));N=len(F)
JO=lambda s,w='300':ImageFont.truetype('/tmp/fnt/jost-%s.ttf'%w,s)
_c={}
def fr(i):
  i=int(max(0,min(N-1,i)))
  if i not in _c:
    if len(_c)>40:_c.clear()
    _c[i]=Image.open(F[i]).convert('RGB')
  return _c[i]
a=np.asarray(fr(0));BG=tuple(int(v) for v in np.median(np.concatenate([a[:40].reshape(-1,3),a[-40:].reshape(-1,3)]),axis=0))
def cena(img,esc,cx=.5,cy=.5,oy=0.0):
  """a imagem da câmera escalada, com o centro (cx,cy da imagem) no meio do quadro; bordas fundidas no fundo"""
  w,h=img.size;s=W*esc/w;im=img.resize((int(w*s),int(h*s)),Image.LANCZOS)
  c=Image.new('RGB',(W,H),BG);x=int(W/2-cx*im.width);y=int(H/2+oy*H-cy*im.height)
  m=Image.new('L',im.size,0);d=ImageDraw.Draw(m);b=int(min(im.size)*.08);d.rectangle([b,b,im.width-b,im.height-b],fill=255);m=m.filter(ImageFilter.GaussianBlur(b*.6))
  c.paste(im,(x,y),m);return c
lg0=Image.open('/home/claude/lafouch/www/logo-app.png').convert('RGBA')
def logo(cor,larg):
  al=lg0.split()[3];c=Image.new('RGBA',lg0.size,cor+(255,));c.putalpha(al);return c.resize((larg,int(larg*lg0.height/lg0.width)),Image.LANCZOS)
ease=lambda t:0 if t<=0 else 1 if t>=1 else t*t*(3-2*t)
# tom da peça para o texto: a mediana dos pixels escuros do quadro de frente
px=a.reshape(-1,3);TOM=tuple(int(v*.78) for v in np.median(px[px.sum(1)<560],axis=0))
def A(t):  # 0–2,5 s: bem de perto, a dobradiça/haste devagar (de lado)
  return cena(fr(250+t*FPS*1.0),2.9,cx=.30+.04*t,cy=.40)
def B(t):  # 2,5–9 s: o giro em câmera lenta, de frente para o lado
  return cena(fr(t*FPS*1.5),1.0,oy=-.02)
def C(t):  # 9–12 s: a ponte e o acetato de frente, aproximando devagar
  return cena(fr(N-1-t*FPS*0.8),1.8+.15*ease(t/3),cx=.5,cy=.42)
def D(t):  # 12–15 s: a peça de frente, pequena; o logo e o código no tom da peça
  c=cena(fr(0),.92+.03*ease(t/3),oy=-.06).convert('RGBA')
  l=Image.new('RGBA',(W,H));d=ImageDraw.Draw(l);txt='BR44118  ·  ACETATO';f=JO(30);esp=7
  ws=[d.textlength(ch,font=f) for ch in txt];x=W/2-(sum(ws)+esp*(len(txt)-1))/2
  for ch,w in zip(txt,ws):d.text((x,H*.62),ch,font=f,fill=TOM+(255,));x+=w+esp
  k=ease((t-.5)/.9);l.putalpha(l.split()[3].point(lambda v:int(v*k)));c.alpha_composite(l)
  lg=logo(TOM,200);k2=ease((t-1.0)/.9);lg.putalpha(lg.split()[3].point(lambda v:int(v*k2)));c.alpha_composite(lg,(int(W/2-100),int(H*.74)));return c
CENAS=[(A,2.5),(B,6.5),(C,3.0),(D,3.0)]
def render(saida):
  ant=None;arqs=[]
  for n,(fn,dur) in enumerate(CENAS):
    tmp='/tmp/gv_c%d.tmp.mp4'%n;p=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s','%dx%d'%(W,H),'-r',str(FPS),'-i','-','-c:v','libx264','-crf','18','-preset','veryfast','-pix_fmt','yuv420p',tmp],stdin=subprocess.PIPE)
    nf=int(dur*FPS)
    for i in range(nf):
      f=fn(i/FPS).convert('RGB')
      if ant is not None and i<15:f=Image.blend(ant,f,ease((i+1)/15))
      p.stdin.write(f.tobytes());last=f
    p.stdin.close();p.wait();assert p.returncode==0
    os.replace(tmp,'/tmp/gv_c%d.mp4'%n);arqs.append('/tmp/gv_c%d.mp4'%n);ant=last
  open('/tmp/gv_lista.txt','w').write(''.join("file '%s'\n"%a for a in arqs))
  subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i','/tmp/gv_lista.txt','-c','copy',saida],check=True);print('ok',saida)
if __name__=='__main__':
  import sys
  if 'quadros' in sys.argv:
    q=[A(1.2),B(1.0),B(5.5),C(2.0),D(2.6)];S=Image.new('RGB',(5*360+6*16,640+32),(17,20,26))
    for i,f in enumerate(q):S.paste(f.convert('RGB').resize((360,640)),(16+i*376,16))
    S.save('/tmp/gv_quadros.jpg',quality=88);print('ok quadros',N,BG,TOM)
  else: render('/home/claude/lafouch/work/s435/semp/esboco_73_status_giro_BR44118.mp4')

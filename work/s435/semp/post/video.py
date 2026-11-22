# Comercial de 15 s (9:16, 1080×1920, 30 fps) do SL2305 com a foto real do catálogo — roteiro do Semp em 5 partes (aprovado 20/11 como ideia):
# gancho 0–1,5 · a peça 1,5–5 · detalhe 5–8 · por que comprar 8–12 · preço e fechamento 12–15. Sem som (trilha livre fica para depois).
import subprocess,os,math
from base import *
W,H,FPS=1080,1920,30
VINHO_C=np.array([92,48,68]);VINHO_E=np.array([22,11,17])
def fundo_noite(cy=.42):
  y,x=np.mgrid[0:H,0:W];r=np.sqrt(((x-W/2)/W)**2+((y-H*cy)/H*1.6)**2);t=np.clip(r/0.6,0,1)[...,None]
  return Image.fromarray((VINHO_C*(1-t)+VINHO_E*t).astype('uint8')).convert('RGBA')
FN=fundo_noite();CLARO=Image.new('RGBA',(W,H),(244,240,235,255))
ease=lambda t:0 if t<=0 else 1 if t>=1 else t*t*(3-2*t)
def alfa(img,a):
  if a>=1:return img
  im=img.copy();im.putalpha(im.split()[3].point(lambda v:int(v*a)));return im
def texto(b,xy,txt,f,cor,a=1,esp=0,centro=True):
  l=Image.new('RGBA',b.size);d=ImageDraw.Draw(l)
  if esp:espacado(d,xy,txt,f,cor+(255,),esp,centro)
  else:
    w=d.textlength(txt,font=f);d.text((xy[0]-(w/2 if centro else 0),xy[1]),txt,font=f,fill=cor+(255,))
  b.alpha_composite(alfa(l,a))
def g1(t):  # gancho: uma linha dourada corre e 'Chegou.'
  b=FN.copy();d=ImageDraw.Draw(b);k=ease(t/0.8);d.line([(W/2-260*k,H*.5),(W/2+260*k,H*.5)],fill=(196,160,96),width=2)
  texto(b,(W/2,H*.5-150),'Chegou.',FR(120,'300i'),(244,232,220),ease((t-.5)/.8));return b
def g2(t):  # a peça entra devagar, com um brilho que passa
  b=FN.copy();s=.90+.08*ease(t/3.5);poe(b,PECA,W/2,H*.44,W*.82*s,(0,0,0,int(150*ease(t/.8))))
  texto(b,(W/2,H*.70),CURTO,FR(46),(240,228,218),ease((t-1.6)/.8),10);return b
def g3(t):  # detalhe: de perto, do aro para a ponte dourada
  b=CLARO.copy();k=ease(t/3);cx=W*(.95-.45*k);poe(b,PECA,cx,H*.42,W*3.0)
  g=Image.new('RGBA',(W,H));gd=ImageDraw.Draw(g)
  for i in range(int(H*.5),H):gd.line([(0,i),(W,i)],fill=(22,12,16,int(225*((i-H*.5)/(H*.5))**1.2)))
  b.alpha_composite(g);texto(b,(80,H*.74),'Dourado onde',FR(92),(246,238,230),ease((t-.6)/.8),centro=False)
  texto(b,(80,H*.74+104),'importa.',FR(92,'300i'),(246,238,230),ease((t-1.0)/.8),centro=False);return b
def g4(t):  # por que comprar: 3 linhas, uma de cada vez
  b=CLARO.copy();poe(b,PECA,W/2,H*.30,W*.70,(60,40,30,60))
  for i,l in enumerate(('Aviador','Metal e acetato','Proteção UV')):
    texto(b,(W/2,H*.52+i*120),l,FR(64),(42,34,38),ease((t-.3-i*.8)/.7))
  return b
def g5(t):  # preço e fechamento
  b=CLARO.copy();poe(b,PECA,W/2,H*.36,W*.80,(60,40,30,70));d=ImageDraw.Draw(b)
  texto(b,(W/2,H*.60),CURTO,FR(44),(42,34,38),ease(t/.6),11)
  a=ease((t-.4)/.6);d.line([(W/2-34*a,H*.645),(W/2+34*a,H*.645)],fill=(185,165,150),width=2)
  texto(b,(W/2,H*.665),PRECO,JO(36),(125,111,104),ease((t-.6)/.6),6)
  texto(b,(W/2,H*.715),'Galería Jebai · Ciudad del Este',JO(28),(150,136,128),ease((t-1.0)/.6),2)
  lg=logo((150,128,118,255),220);b.alpha_composite(alfa(lg,ease((t-1.2)/.6)),(int(W/2-110),int(H*.80)));return b
CENAS=[(g1,1.5),(g2,3.5),(g3,3.0),(g4,4.0),(g5,3.0)]
def render():
  ant=None;arqs=[]
  for n,(fn,dur) in enumerate(CENAS):
    tmp='c%d.tmp.mp4'%n;p=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s','%dx%d'%(W,H),'-r',str(FPS),'-i','-','-c:v','libx264','-crf','18','-preset','veryfast','-pix_fmt','yuv420p',tmp],stdin=subprocess.PIPE)
    nf=int(dur*FPS)
    for i in range(nf):
      f=fn(i/FPS).convert('RGB')
      if ant is not None and i<10:f=Image.blend(ant,f,(i+1)/10)   # cruzamento dentro do arquivo da cena
      p.stdin.write(f.tobytes())
      if i==nf-1:last=f
    p.stdin.close();p.wait()
    if p.returncode==0:os.replace(tmp,'c%d.mp4'%n);arqs.append('c%d.mp4'%n)
    ant=last
  open('lista.txt','w').write(''.join("file '%s'\n"%a for a in arqs))
  subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i','lista.txt','-c','copy','../esboco_72d_comercial_SL2305.mp4'],check=True);print('ok video')
if __name__=='__main__':
  import sys
  if 'quadros' in sys.argv:
    q=[g1(1.4),g2(2.0),g3(2.6),g4(3.5),g5(2.5)];S=Image.new('RGB',(5*360+6*20,640+40),(17,20,26))
    for i,f in enumerate(q):S.paste(f.convert('RGB').resize((360,640)),(20+i*380,20))
    S.save('/tmp/quadros.jpg',quality=88);print('ok quadros')
  else: render()

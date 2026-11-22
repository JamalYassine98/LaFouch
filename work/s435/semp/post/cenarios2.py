# Esboço 74b (S435, 22/11 17:05) — dono 16:52: cor do produto alterada, reflexo estranho, borda 'serrilhada' como recorte de PNG.
# CAUSA: recortar uma peça clara e translúcida de um vídeo de 960 px com fundo branco não dá borda limpa; nos cenários escuros a borda
# branca aparece e a peça fica meio transparente (muda a cor). JEITO NATURAL: não recortar. Os pixels da peça ficam INTACTOS; só o
# fundo branco é trocado por cenários CLAROS (creme, pedra clara), perto do branco, onde a transição não aparece. A luz (faixa,
# sombra de janela) cai igual na peça e no fundo, como luz de verdade. Sem reflexo. Cenário escuro só gravando no fundo preto.
import subprocess,os,glob
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageFilter
W,H,FPS=1080,1920,30
F=sorted(glob.glob('/tmp/gv/f_*.jpg'));N=len(F)
JO=lambda s,w='300':ImageFont.truetype('/tmp/fnt/jost-%s.ttf'%w,s)
ease=lambda t:0 if t<=0 else 1 if t>=1 else t*t*(3-2*t)
yy,xx=np.mgrid[0:H,0:W].astype(float)
rng=np.random.default_rng(3)
def grao(a):return (np.asarray(Image.fromarray((rng.random((H,W))*255).astype('uint8')).filter(ImageFilter.GaussianBlur(.6))).astype(float)/255-.5)*a
CREME=np.clip(np.stack([np.full((H,W),v) for v in (240,234,228)],-1)-((yy/H)**1.6*14)[...,None]+grao(3)[...,None],0,255)
PEDRA=np.clip(np.stack([np.full((H,W),v) for v in (226,218,209)],-1)-((yy/H)*14)[...,None]+grao(4)[...,None],0,255)
def quadro_peca(i,larg,cx,cy,fundo):
  """a imagem da câmera, sem recorte: o fundo branco vira o cenário pela máscara macia; a peça mantém os pixels"""
  i=int(max(0,min(N-1,i)));im=Image.open(F[i]).convert('RGB');r=larg/im.width;im=im.resize((int(im.width*r),int(im.height*r)),Image.LANCZOS)
  a=np.asarray(im).astype(float);d=255-a.min(axis=2);m=np.clip((d-3)/14,0,1);m=np.asarray(Image.fromarray((m*255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.2))).astype(float)/255
  out=fundo.copy();x=int(cx-im.width/2);y=int(cy-im.height/2);x0,y0=max(0,x),max(0,y);x1,y1=min(W,x+im.width),min(H,y+im.height)
  sa=a[y0-y:y1-y,x0-x:x1-x];sm=m[y0-y:y1-y,x0-x:x1-x,None];reg=out[y0:y1,x0:x1]
  out[y0:y1,x0:x1]=sa*sm+reg*(1-sm)*(sa/255.0)   # onde é fundo, o cenário herda a sombra suave que já existe na gravação
  return out,(m,x,y)
def contato(out,mx,cy,larg,forca=.10):  # sombra de contato macia sob a peça (sem reflexo)
  s=np.exp(-(((xx-mx)/(larg*.42))**2+((yy-cy)/(26))**2));return out*(1-forca*s[...,None])
def luz(out,mask,minimo):  # a luz cai igual na peça e no fundo
  return out*(minimo+(1-minimo)*mask[...,None])
def faixa(t):
  x=-700+ease(t/2.8)*(W+1400);d=(xx-x)+(yy-H*.5)*.55;return np.clip(1-np.abs(d)/420,0,1)**1.5
def janela(t):
  m=Image.new('L',(W,H),255);dd=ImageDraw.Draw(m);dx=int(-160+70*t)
  for k in range(3):
    x0=dx+k*400;dd.polygon([(x0,0),(x0+90,0),(x0+90+560,H),(x0+560,H)],fill=0)
  dd.rectangle([0,int(H*.47),W,int(H*.47)+60],fill=0);return np.asarray(m.filter(ImageFilter.GaussianBlur(46))).astype(float)/255
lg0=Image.open('/home/claude/lafouch/www/logo-app.png').convert('RGBA')
TOM=(128,112,108)
def texto_logo(img,k1,k2,y):
  b=img.convert('RGBA');l=Image.new('RGBA',(W,H));d=ImageDraw.Draw(l);f=JO(30);txt='BR44118  ·  ACETATO';e=7
  ws=[d.textlength(ch,font=f) for ch in txt];x=W/2-(sum(ws)+e*(len(txt)-1))/2
  for ch,w in zip(txt,ws):d.text((x,y),ch,font=f,fill=TOM+(255,));x+=w+e
  l.putalpha(l.split()[3].point(lambda v:int(v*k1)));b.alpha_composite(l)
  al=lg0.split()[3];lg=Image.new('RGBA',lg0.size,TOM+(255,));lg.putalpha(al);lg=lg.resize((190,int(190*lg0.height/lg0.width)),Image.LANCZOS)
  lg.putalpha(lg.split()[3].point(lambda v:int(v*k2)));b.alpha_composite(lg,(int(W/2-95),int(y+H*.11)));return b.convert('RGB')
im8=lambda a:Image.fromarray(np.clip(a,0,255).astype('uint8'))
def S1(t):  # revelação: creme na meia-luz; uma faixa de luz passa e a cena acende
  o,_=quadro_peca(0,W*1.05,W/2,H*.47,CREME);o=contato(o,W/2,H*.47+190,W*1.05)
  m=np.maximum(faixa(t),ease((t-1.6)/1.2));return im8(luz(o,m,.80))
def S2(t):  # giro herói no creme, devagar, com sombra de contato
  o,_=quadro_peca(t*FPS*1.45,W*1.0,W/2,H*.46,CREME);return im8(contato(o,W/2,H*.46+185,W*.9))
def S3(t):  # de perto: a haste e a frente, com luz lateral de janela
  o,_=quadro_peca(250+t*FPS*.9,W*2.4,W*(.70-.05*t),H*.48,CREME);lado=np.clip((xx/W)*1.2,0,1)
  return im8(luz(o,lado*.6+.4,.80))
def S4(t):  # pedra clara com a sombra da janela andando; código e logo
  o,_=quadro_peca(0,W*.88,W/2,H*.40,PEDRA);o=contato(o,W/2,H*.40+160,W*.88,.12);o=luz(o,janela(t),.80)
  return texto_logo(im8(o),ease((t-.6)/.9),ease((t-1.1)/.9),H*.60)
CENAS=[(S1,3.0),(S2,5.5),(S3,3.0),(S4,3.5)]
def render(saida):
  ant=None;arqs=[]
  for n,(fn,dur) in enumerate(CENAS):
    tmp='/tmp/cy_c%d.tmp.mp4'%n;p=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s','%dx%d'%(W,H),'-r',str(FPS),'-i','-','-c:v','libx264','-crf','16','-preset','veryfast','-pix_fmt','yuv420p',tmp],stdin=subprocess.PIPE)
    nf=int(dur*FPS)
    for i in range(nf):
      f=fn(i/FPS)
      if ant is not None and i<15:f=Image.blend(ant,f,ease((i+1)/15))
      p.stdin.write(f.tobytes());last=f
    p.stdin.close();p.wait();assert p.returncode==0;os.replace(tmp,'/tmp/cy_c%d.mp4'%n);arqs.append('/tmp/cy_c%d.mp4'%n);ant=last
  open('/tmp/cy_lista.txt','w').write(''.join("file '%s'\n"%a for a in arqs))
  subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i','/tmp/cy_lista.txt','-c','copy',saida],check=True);print('ok',saida)
if __name__=='__main__':
  import sys
  if 'quadros' in sys.argv:
    q=[S1(.8),S1(2.9),S2(3.0),S3(1.5),S4(3.0)];S=Image.new('RGB',(5*360+6*16,640+32),(17,20,26))
    for i,f in enumerate(q):S.paste(f.resize((360,640)),(16+i*376,16))
    S.save('/tmp/cy_quadros.jpg',quality=88);S2(3.0).crop((150,650,930,1150)).save('/tmp/cy_borda.png');print('ok quadros')
  else: render('/home/claude/lafouch/work/s435/semp/esboco_74b_cenarios_claros_BR44118.mp4')

# Peças de desenho do post e do vídeo (S435 22/11): foto REAL do catálogo do dono (SL2305 · Óculos de sol LaFouch aviador · G$ 176.000,
# catalogo/dados/f/SL2305_862548204.jpg), logo real (www/logo-app.png), letra da marca (Fraunces) + Jost para o texto pequeno.
from PIL import Image,ImageDraw,ImageFont,ImageFilter,ImageChops
import numpy as np
FOTO='/home/claude/catalogo/dados/f/SL2305_862548204.jpg'
LOGO='/home/claude/lafouch/www/logo-app.png'
FR=lambda s,w='300':ImageFont.truetype('/tmp/fnt/fr-%s.ttf'%w,s)
JO=lambda s,w='300':ImageFont.truetype('/tmp/fnt/jost-%s.ttf'%w,s)
NOME='ÓCULOS DE SOL LAFOUCH AVIADOR';CURTO='AVIADOR LAFOUCH';PRECO='G$ 176.000';MAT='Metal e acetato · proteção UV'
def recorte():
  a=np.asarray(Image.open(FOTO).convert('RGB')).astype(float)
  d=255-a.min(axis=2)                     # quão longe do branco
  al=np.clip((d-34)/30,0,1)                # borda macia
  al=Image.fromarray((al*255).astype('uint8')).filter(ImageFilter.GaussianBlur(.6))
  im=Image.open(FOTO).convert('RGBA');im.putalpha(al);bb=al.getbbox();return im.crop(bb)
PECA=recorte()
def logo(cor,larg):
  l=Image.open(LOGO).convert('RGBA');a=l.split()[3];c=Image.new('RGBA',l.size,cor);c.putalpha(a)
  return c.resize((larg,int(larg*l.height/l.width)),Image.LANCZOS)
def espacado(d,xy,txt,f,cor,esp,centro=True):
  ws=[d.textlength(ch,font=f) for ch in txt];tot=sum(ws)+esp*(len(txt)-1);x,y=xy
  if centro:x-=tot/2
  for ch,w in zip(txt,ws):d.text((x,y),ch,font=f,fill=cor);x+=w+esp
  return tot
def poe(base,img,cx,cy,larg,sombra=None):
  r=larg/img.width;im=img.resize((int(img.width*r),int(img.height*r)),Image.LANCZOS)
  if sombra:
    s=Image.new('RGBA',base.size,(0,0,0,0));sh=Image.new('RGBA',(int(im.width*.8),int(im.height*.10)),sombra)
    s.paste(sh,(int(cx-sh.width/2),int(cy+im.height*.48)));s=s.filter(ImageFilter.GaussianBlur(im.width*.05));base.alpha_composite(s)
  base.alpha_composite(im,(int(cx-im.width/2),int(cy-im.height/2)))

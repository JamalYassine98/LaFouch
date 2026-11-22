# Esboço 76c (S435, 22/11 18:05) — LIMPO E ELEGANTE (dono 17:48: 'estamos exagerando nos detalhes'). Estudo de 8 posts da @made.glasses:
# quase todo post é UMA imagem com UMA ideia — foto da peça (na mão, num prato, no rosto) SEM texto ou com uma linha só; a informação
# (material, medidas, UV, cores, site) fica na LEGENDA do post, não na imagem. A ficha com detalhes era a exceção.
# LaFouch: off-white quente, a peça grande, o nome pequeno, o escudo LF bem pequeno. Carrossel: 1 a peça · 2 um detalhe sem texto.
from identidade import *
def peca():
  b=Image.new('RGB',(W,H),BG);d=ImageDraw.Draw(b)
  c=no_fundo(FOTO.crop((50,80,870,480)));p=c.resize((940,int(940*c.height/c.width)),Image.LANCZOS);b.paste(p,(70,int(H*.44-p.height/2)))
  esp(d,(W/2,int(H*.74)),'AVIADOR',FR(40),TX,9)
  e=escudo(VI,40);b.paste(e,(int(W/2-e.width/2),H-110),e);return b
def detalhe():  # a ponte dourada de perto, sangrando nas bordas (a foto do Estúdio de detalhe deixa isto nítido)
  from PIL import ImageFilter
  c=no_fundo(FOTO.crop((300,95,600,470)));return c.resize((W,H),Image.LANCZOS).filter(ImageFilter.UnsharpMask(2,60,2))
LEGENDA='''Aviador LaFouch. Metal e acetato, preto e dourado.
52-21-145 · proteção UV.
—
Aviador LaFouch. Metal y acetato, negro y dorado.
52-21-145 · protección UV.
lafouch.com'''
if __name__=='__main__':
  a=peca();b2=detalhe()
  a.save('post76c_peca.jpg',quality=93);b2.save('post76c_detalhe.jpg',quality=93)
  g=40;S=Image.new('RGB',(g+3*(540+g),675+150),(17,20,26));dd=ImageDraw.Draw(S)
  for k,(t,im) in enumerate([('1 · a peça',a),('2 · um detalhe, sem texto',b2)]):
    x=g+k*(540+g);dd.text((x,30),t,font=JO(30,'400'),fill=(235,235,240));S.paste(im.resize((540,675)),(x,100))
  x=g+2*(540+g);dd.text((x,30),'a legenda do post (PT · ES)',font=JO(30,'400'),fill=(235,235,240))
  y=110
  for ln in LEGENDA.split('\n'):dd.text((x,y),ln,font=JO(24,'300'),fill=(215,215,222));y+=40
  dd.text((x,y+20),'material, medidas, UV e site\nficam aqui, não na imagem',font=JO(22,'300'),fill=(140,150,165),spacing=8)
  S.save('../esboco_76c_post_limpo.jpg',quality=90);print('ok')

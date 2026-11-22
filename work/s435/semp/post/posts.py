from base import *
W,H=1080,1350
def editorial():
  b=Image.new('RGBA',(W,H),(244,240,235,255));poe(b,PECA,W/2,H*.40,W*.74,(60,40,30,70));d=ImageDraw.Draw(b)
  espacado(d,(W/2,H*.665),CURTO,FR(34),(42,34,38),9);d.line([(W/2-28,H*.715),(W/2+28,H*.715)],fill=(185,165,150),width=2)
  espacado(d,(W/2,H*.735),PRECO,JO(26),(125,111,104),5);lg=logo((150,128,118,255),150);b.alpha_composite(lg,(int(W/2-75),int(H*.86)));return b
def noite():
  y,x=np.mgrid[0:H,0:W];r=np.sqrt(((x-W/2)/W)**2+((y-H*.40)/H*1.25)**2);t=np.clip(r/0.55,0,1)[...,None]
  c=(np.array([92,48,68])*(1-t)+np.array([24,12,18])*t).astype('uint8');b=Image.fromarray(c).convert('RGBA')
  poe(b,PECA,W/2,H*.40,W*.74,(0,0,0,150));d=ImageDraw.Draw(b)
  espacado(d,(W/2,H*.665),CURTO,FR(34),(240,228,218),9);d.line([(W/2-28,H*.715),(W/2+28,H*.715)],fill=(170,135,150),width=2)
  espacado(d,(W/2,H*.735),PRECO,JO(26),(205,182,192),5);lg=logo((205,170,185,255),150);b.alpha_composite(lg,(int(W/2-75),int(H*.86)));return b
def detalhe():
  b=Image.new('RGBA',(W,H),(236,231,225,255));poe(b,PECA,W*.5,H*.36,W*2.3)
  g=Image.new('RGBA',(W,H));gd=ImageDraw.Draw(g)
  for i in range(H):
    t=max(0,(i-H*.5)/(H*.5));gd.line([(0,i),(W,i)],fill=(22,12,16,int(215*t**1.2)))
  b.alpha_composite(g);d=ImageDraw.Draw(b)
  d.text((72,H*.70),'Dourado onde',font=FR(74),fill=(246,238,230));d.text((72,H*.70+84),'importa.',font=FR(74,'300i'),fill=(246,238,230))
  espacado(d,(72,H*.88),CURTO+'  ·  '+PRECO,JO(24),(226,212,202),4,False);lg=logo((226,205,195,255),110);b.alpha_composite(lg,(W-72-110,int(H*.86)));return b
if __name__=='__main__':
  P=[editorial(),noite(),detalhe()]
  for n,p in zip(('editorial','noite','detalhe'),P):p.convert('RGB').save('post_%s.jpg'%n,quality=92)
  g=40;S=Image.new('RGB',(g+3*(540+g),40+675+g+60),(17,20,26));dd=ImageDraw.Draw(S)
  for i,(n,p) in enumerate(zip(('Editorial','Noite','Detalhe'),P)):
    x=g+i*(540+g);dd.text((x,20),n,font=JO(30,'400'),fill=(235,235,240));S.paste(p.convert('RGB').resize((540,675)),(x,80))
  S.save('../esboco_72d_estilos_post_foto_real.jpg',quality=90);print('ok')

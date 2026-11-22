# Esboço 76 (S435, 22/11 17:40) — post FICHA + carrossel com PANORAMA no estilo da referência do dono (@made.glasses, post Évora),
# montados sozinhos pelo app a partir da foto do catálogo e do CADASTRO (sem frase inventada). Peça real: SL2305 · Óculos de sol LaFouch
# aviador · "Solar aviador preto e dourado" · Metal e acetato · 52-21-145 · UV · cor: Preto (catalogo/dados/inicio.json).
# Só existe 1 foto (de frente, 900 px): os 4 detalhes são recortes dela e o panorama usa a mesma foto. Com as fotos do Estúdio
# (ângulo + 3 detalhes) cada recorte vira uma foto própria, mais nítida.
from PIL import Image,ImageDraw,ImageFont,ImageFilter,ImageOps
FOTO='/home/claude/catalogo/dados/f/SL2305_862548204.jpg'
LOGO='/home/claude/lafouch/www/logo-app.png'
FR=lambda s,w='300':ImageFont.truetype('/tmp/fnt/fr-%s.ttf'%w,s)
JO=lambda s,w='300':ImageFont.truetype('/tmp/fnt/jost-%s.ttf'%w,s)
W,H=1080,1350;BR=(255,255,255);TX=(38,34,36);MU=(128,122,124);LN=(200,196,196)
foto=Image.open(FOTO).convert('RGB')
def esp(d,xy,t,f,c,e,ancora='m'):
  ws=[d.textlength(ch,font=f) for ch in t];tot=sum(ws)+e*(len(t)-1);x=xy[0]-(tot/2 if ancora=='m' else tot if ancora=='r' else 0)
  for ch,w in zip(t,ws):d.text((x,xy[1]),ch,font=f,fill=c);x+=w+e
def cabeca(d):
  esp(d,(72,64),'LA FOUCH',JO(22),MU,5,'l');esp(d,(W-72,64),'ÓCULOS',JO(22),MU,5,'r');d.line([(W/2-150,77),(W/2+150,77)],fill=LN,width=2)
def logo(img,cx,y,larg,cor=TX):
  l=Image.open(LOGO).convert('RGBA');al=l.split()[3];c=Image.new('RGBA',l.size,cor+(255,));c.putalpha(al)
  c=c.resize((larg,int(larg*l.height/l.width)),Image.LANCZOS);img.paste(c,(int(cx-larg/2),int(y)),c)
def detalhe(box,lado):
  cr=foto.crop(box).resize((lado,lado),Image.LANCZOS);m=Image.new('L',(lado,lado),0);ImageDraw.Draw(m).rounded_rectangle([0,0,lado-1,lado-1],28,fill=255)
  return cr,m
def ficha():
  b=Image.new('RGB',(W,H),BR);d=ImageDraw.Draw(b);cabeca(d)
  f=FR(92);t='AVIADOR';w=d.textlength(t,font=f);esp(d,(W/2,150),t,f,TX,10)
  c=foto.crop((50,80,870,480));p=c.resize((960,int(960*c.height/c.width)),Image.LANCZOS);b.paste(p,(60,330))
  # 4 detalhes recortados da mesma foto (com as fotos do Estúdio, cada um é foto própria)
  boxes=[(745,165,865,285),(390,165,510,285),(190,245,350,405),(95,95,225,225)]
  legs=['Metal e acetato','Preto e dourado','Proteção UV','52-21-145']
  lado=210;g=(W-2*72-4*lado)//3;y=930
  for k,(bx,lg) in enumerate(zip(boxes,legs)):
    x=72+k*(lado+g);cr,m=detalhe(bx,lado);b.paste(cr,(x,y),m);d.rounded_rectangle([x,y,x+lado-1,y+lado-1],28,outline=(226,222,222),width=2)
    fz=JO(22);tw=d.textlength(lg,font=fz);d.text((x+lado/2-tw/2,y+lado+16),lg,font=fz,fill=MU)
  logo(b,W/2,1225,120);return b
def panorama():
  P=Image.new('RGB',(2*W,H),BR);big=foto.resize((int(900*2.5),int(600*2.5)),Image.LANCZOS)
  P.paste(big,(int(W-big.width/2),int(H*.50-big.height/2)))
  d=ImageDraw.Draw(P);cabeca(d)
  esp(d,(W/2,H-250),'Disponível em preto.',JO(36,'400'),TX,1);esp(d,(W/2,H-196),'LAFOUCH.COM',JO(22),MU,5)
  d2=ImageDraw.Draw(P);esp(d2,(W+W-72,64),'ÓCULOS',JO(22),MU,5,'r');esp(d2,(W+72,64),'LA FOUCH',JO(22),MU,5,'l');d2.line([(W+W/2-150,77),(W+W/2+150,77)],fill=LN,width=2)
  return P.crop((0,0,W,H)),P.crop((W,0,2*W,H))
if __name__=='__main__':
  a=ficha();p2,p3=panorama()
  for n,im in (('1_ficha',a),('2_panorama',p2),('3_panorama',p3)):im.save('post76_%s.jpg'%n,quality=93)
  g=40;S=Image.new('RGB',(g+3*(540+g),675+140),(17,20,26));dd=ImageDraw.Draw(S)
  for k,(t,im) in enumerate([('1 · ficha',a),('2 · ângulo + cores',p2),('3 · continua',p3)]):
    x=g+k*(540+g);dd.text((x,30),t,font=JO(30,'400'),fill=(235,235,240));S.paste(im.resize((540,675)),(x,100))
  S.save('../esboco_76_post_ficha_carrossel.jpg',quality=90);print('ok')

# Esboço 76b (S435, 22/11 17:50) — posts com IDENTIDADE LaFouch (dono 17:39: Madë só inspiração; gostou da proposta):
# escudo LF pequeno no canto (no lugar do cabeçalho) · um toque de vinho da marca (#8d3a69) só no nome/linha · fundo off-white quente ·
# legendas em PT e ES (do cadastro) · e a MONTAGEM DE TODAS AS CORES para o WhatsApp.
# Ficha/panorama: foto real do catálogo (SL2305). Montagem de cores: TESTE DE LAYOUT com a folha do fornecedor que o dono mandou
# (TR251140, 8 cores) — só para ver o desenho; NÃO publicar (é foto e marca do fornecedor). No app real, sai das fotos de cada cor do Estúdio.
from PIL import Image,ImageDraw,ImageFont,ImageChops
import numpy as np
FR=lambda s,w='300':ImageFont.truetype('/tmp/fnt/fr-%s.ttf'%w,s)
JO=lambda s,w='300':ImageFont.truetype('/tmp/fnt/jost-%s.ttf'%w,s)
W,H=1080,1350;BG=(247,243,238);TX=(40,34,36);MU=(132,124,122);VI=(141,58,105);LN=(214,206,200)
LOGO=Image.open('/home/claude/lafouch/www/logo-app.png').convert('RGBA')
def escudo(cor,alt):
  s=LOGO.crop((0,0,720,233));a=s.split()[3];bb=a.getbbox();s=s.crop(bb);c=Image.new('RGBA',s.size,cor+(255,));c.putalpha(s.split()[3])
  return c.resize((int(alt*s.width/s.height),alt),Image.LANCZOS)
def logo(cor,larg):
  c=Image.new('RGBA',LOGO.size,cor+(255,));c.putalpha(LOGO.split()[3]);return c.resize((larg,int(larg*LOGO.height/LOGO.width)),Image.LANCZOS)
def no_fundo(foto):  # foto de fundo branco "assentada" no off-white (multiplicar: o branco vira o fundo, a peça fica igual)
  f=foto.convert('RGB');bg=Image.new('RGB',f.size,BG);return ImageChops.multiply(f,bg)
def esp(d,xy,t,f,c,e,a='m'):
  ws=[d.textlength(ch,font=f) for ch in t];tot=sum(ws)+e*(len(t)-1);x=xy[0]-(tot/2 if a=='m' else tot if a=='r' else 0)
  for ch,w in zip(t,ws):d.text((x,xy[1]),ch,font=f,fill=c);x+=w+e
def canto(b):
  e=escudo(VI,58);b.paste(e,(W-72-e.width,56),e)
FOTO=Image.open('/home/claude/catalogo/dados/f/SL2305_862548204.jpg').convert('RGB')
def ficha():
  b=Image.new('RGB',(W,H),BG);d=ImageDraw.Draw(b);canto(b)
  esp(d,(72,74),'SL2305',JO(22),MU,5,'l')
  esp(d,(W/2,170),'AVIADOR',FR(92),TX,10);d.line([(W/2-40,292),(W/2+40,292)],fill=VI,width=3)
  c=no_fundo(FOTO.crop((50,80,870,480)));p=c.resize((960,int(960*c.height/c.width)),Image.LANCZOS);b.paste(p,(60,345))
  boxes=[(745,165,865,285),(390,165,510,285),(95,95,225,225)]
  legs=[('Metal e acetato','Metal y acetato'),('Preto e dourado','Negro y dorado'),('52-21-145','52-21-145')]
  lado=250;g=(W-2*72-3*lado)//2;y=900
  # dono 17:45: 'Proteção UV' mais discreto → sai do quadrinho (era um quadrado preto da lente) e vira uma linha pequena
  esp(d,(W/2,1252),'Proteção UV  ·  Protección UV',JO(19),MU,2)
  for k,(bx,(pt,es)) in enumerate(zip(boxes,legs)):
    x=72+k*(lado+g);cr=no_fundo(FOTO.crop(bx)).resize((lado,lado),Image.LANCZOS);m=Image.new('L',(lado,lado),0);ImageDraw.Draw(m).rounded_rectangle([0,0,lado-1,lado-1],26,fill=255)
    b.paste(cr,(x,y),m);d.rounded_rectangle([x,y,x+lado-1,y+lado-1],26,outline=LN,width=2)
    for j,(t,cor) in enumerate(((pt,TX),(es,MU)) if es!=pt else ((pt,TX),)):f=JO(21);tw=d.textlength(t,font=f);d.text((x+lado/2-tw/2,y+lado+14+j*28),t,font=f,fill=cor)
  esp(d,(W/2,1292),'LAFOUCH.COM',JO(19),MU,6);return b
def panorama():
  P=Image.new('RGB',(2*W,H),BG);big=no_fundo(FOTO).resize((2250,1500),Image.LANCZOS);P.paste(big,(int(W-big.width/2),int(H*.48-big.height/2)))
  d=ImageDraw.Draw(P);esp(d,(W/2,H-262),'Disponível em preto.',FR(44),TX,1);esp(d,(W/2,H-196),'Disponible en negro.',FR(34,'300i'),MU,1)
  a=P.crop((0,0,W,H));c=P.crop((W,0,2*W,H));canto(a);canto(c);return a,c
def cores():
  sh=Image.open('/home/claude/lafouch/work/s435/semp/referencias/dono_TR251140_paquete10.jpg').convert('RGB')
  cols=[(10,600),(615,1215)];rows=[(45,300),(320,575),(575,850),(855,1140)]
  nomes=[('Azul','Azul'),('Cinza cristal','Gris cristal'),('Cinza','Gris'),('Preto','Negro'),('Preto brilho','Negro brillo'),('Cristal','Cristal'),('Marrom','Marrón'),('Azul escuro','Azul oscuro')]
  b=Image.new('RGB',(W,H),BG);d=ImageDraw.Draw(b);canto(b);esp(d,(72,74),'TR251140',JO(22),MU,5,'l')
  esp(d,(W/2,150),'8 CORES',FR(64),TX,8);esp(d,(W/2,236),'8 colores',FR(30,'300i'),MU,1);d.line([(W/2-40,290),(W/2+40,290)],fill=VI,width=3)
  cw,ch=440,180;gx=(W-2*cw)//3;y0=320
  for k in range(8):
    r,c=k//2,k%2;x0,x1=cols[c];yy0,yy1=rows[r];cr=no_fundo(sh.crop((x0,yy0,x1,yy1)));cr.thumbnail((cw,ch),Image.LANCZOS)
    x=gx+c*(cw+gx)+(cw-cr.width)//2;y=y0+r*(ch+50);b.paste(cr,(x,y))
    pt,es=nomes[k];f=JO(22);t=pt+('  ·  '+es if es!=pt else '');tw=d.textlength(t,font=f);d.text((gx+c*(cw+gx)+cw/2-tw/2,y+ch+4),t,font=f,fill=MU)
  esp(d,(W/2,1268),'G$ 000.000  ·  LAFOUCH.COM',JO(20),MU,6);return b
if __name__=='__main__':
  a=ficha();p2,p3=panorama();c=cores()
  g=40;S=Image.new('RGB',(g+4*(540+g),675+140),(17,20,26));dd=ImageDraw.Draw(S)
  for k,(t,im) in enumerate([('1 · ficha',a),('2 · continua',p2),('3 · continua',p3),('WhatsApp · todas as cores',c)]):
    x=g+k*(540+g);dd.text((x,30),t,font=JO(30,'400'),fill=(235,235,240));S.paste(im.resize((540,675)),(x,100))
  S.save('../esboco_76b_posts_identidade_lafouch.jpg',quality=90)
  for n,im in (('ficha',a),('pan2',p2),('pan3',p3),('cores',c)):im.save('post76b_%s.jpg'%n,quality=93)
  print('ok')

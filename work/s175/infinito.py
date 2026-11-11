# ESBOÇO S175: efeito fundo infinito (sombra de contato / reflexo) sem tocar nos pixels da armação
import numpy as np, sys
from PIL import Image, ImageFilter, ImageDraw, ImageFont
def mascara(a):
    d=255-a.min(2)                       # quanto o pixel se afasta do branco
    m=(d>12).astype(np.uint8)*255
    return Image.fromarray(m).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(3))
def efeito(path,modo):
    im=Image.open(path).convert('RGB'); W,H=im.size
    C=Image.new('RGB',(W,int(H*1.25)),(255,255,255)); a=np.array(im).astype(int)
    m=mascara(a); ma=np.array(m)>0
    ys=np.where(ma.any(1))[0]; y1=ys.max(); xs=np.where(ma.any(0))[0]; x0,x1=xs.min(),xs.max()
    base=np.array(C).astype(float)
    if modo in ('sombra','reflexo'):
        # sombra de contato: silhueta achatada debaixo da armação, bem desfocada
        sh=m.resize((W,max(2,int(H*0.06))),Image.BILINEAR)
        S=Image.new('L',C.size,0); S.paste(sh,(0,y1-int(H*0.035)))
        S=S.filter(ImageFilter.GaussianBlur(H*0.018))
        el=Image.new('L',C.size,0); ImageDraw.Draw(el).ellipse((x0+ (x1-x0)*0.06,y1-H*0.01,x1-(x1-x0)*0.06,y1+H*0.035),fill=255); el=el.filter(ImageFilter.GaussianBlur(H*0.03))
        s=np.maximum(np.array(S)/255*0.22,np.array(el)/255*0.14)
        base=base*(1-s[...,None])+np.array([235,232,234])*s[...,None]*0+base*0  # placeholder replaced below
        base=np.array(C).astype(float)*(1-s[...,None]*0.85)
    if modo=='reflexo':
        fl=Image.fromarray(a.astype(np.uint8)).transpose(Image.FLIP_TOP_BOTTOM).crop((0,H-y1-1,W,H-y1-1+int(H*0.25)))
        fm=m.transpose(Image.FLIP_TOP_BOTTOM).crop((0,H-y1-1,W,H-y1-1+int(H*0.25)))
        g=np.linspace(0.16,0,fl.size[1])[:,None]
        al=(np.array(fm)/255*g)
        reg=base[y1+2:y1+2+fl.size[1]]
        n=reg.shape[0]; f=np.array(fl).astype(float)[:n]; al=al[:n]
        base[y1+2:y1+2+n]=reg*(1-al[...,None])+f*al[...,None]
    out=base.copy(); out[:H][ma]=a[ma]   # a armação fica com os pixels originais
    return Image.fromarray(np.clip(out,0,255).astype(np.uint8))
fotos=sys.argv[1:]
rows=[]
for p in fotos:
    ims=[efeito(p,m) for m in ('atual','sombra','reflexo')]
    w,h=ims[0].size; r=Image.new('RGB',(w*3+40,h),(255,255,255))
    for i,x in enumerate(ims): r.paste(x,(i*(w+20),0))
    rows.append(r.resize((1500,int(r.height*1500/r.width)),Image.LANCZOS))
W=max(r.width for r in rows); sheet=Image.new('RGB',(W,sum(r.height+30 for r in rows)+60),(239,233,236))
d=ImageDraw.Draw(sheet)
try: fn=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',26)
except: fn=None
cw=rows[0].width//3
for i,t in enumerate(['Hoje (fundo 255)','Sombra de contato','Sombra + reflexo leve']): d.text((i*cw+20,16),t,fill=(90,42,70),font=fn)
y=60
for r in rows: sheet.paste(r,(0,y)); y+=r.height+30
sheet.save('s175_infinito.jpg',quality=90)

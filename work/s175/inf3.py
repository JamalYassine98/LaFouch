import numpy as np, cv2
from inf2 import mask_frame, infinito
from PIL import Image, ImageDraw, ImageFont
def sombra(img255,refl=False,degrade=False):
    img=img255.astype(np.float32); m=mask_frame(img,np.full_like(img,255)); H,W=m.shape
    ys,xs=np.where(m>0); y0,y1=ys.min(),ys.max(); x0,x1=xs.min(),xs.max(); fh=y1-y0
    C=np.full((int(H*1.15),W,3),255,np.float32); C[:H]=img
    if degrade:  # fundo infinito em degradê: chão levemente mais escuro que o fundo, sem linha
        yy=np.arange(C.shape[0])[:,None]; g=1/(1+np.exp(-(yy-(y1-fh*0.15))/(fh*0.25)))
        C=C*(1-0.035*g[...,None])
    sh=np.zeros(C.shape[:2],np.float32); low=np.full(W,-1)
    for x in range(x0,x1+1):
        c=np.where(m[:,x]>0)[0]
        if len(c): low[x]=c.max()
    for x in range(x0,x1+1):
        if low[x]>0 and low[x]>y1-fh*0.06:   # só onde a armação encosta na mesa
            cv2.circle(sh,(x,int(low[x]+fh*0.015)),max(2,int(fh*0.02)),1,-1)
    sh=cv2.GaussianBlur(sh,(0,0),fh*0.03)
    el=np.zeros_like(sh); cv2.ellipse(el,((x0+x1)//2,int(y1+fh*0.03)),(int((x1-x0)*0.44),int(fh*0.05)),0,0,360,1,-1); el=cv2.GaussianBlur(el,(0,0),fh*0.07)
    s=np.clip(sh*0.30+el*0.12,0,0.4)[...,None]
    C=C*(1-s)
    if refl:
        L=int(fh*0.6); fr=img[y1-L:y1+1][::-1]; fm=m[y1-L:y1+1][::-1].astype(np.float32)
        g=np.linspace(0.13,0,fr.shape[0])[:,None]; a=(fm*g)[...,None]; n=min(fr.shape[0],C.shape[0]-y1-4)
        C[y1+4:y1+4+n]=C[y1+4:y1+4+n]*(1-a[:n])+fr[:n]*a[:n]
    k=cv2.GaussianBlur(m.astype(np.float32),(0,0),1)[...,None]; C[:H]=C[:H]*(1-k)+img*k
    return np.clip(C,0,255).astype(np.uint8)
a=cv2.imread('in/app255.jpg')
V=[('Hoje no app (fundo 255)',a),('A · Sombra de contato',sombra(a)),('B · Sombra + reflexo leve',sombra(a,True)),('C · Infinito em degradê (redes)',sombra(a,False,True))]
b2=cv2.imread('in/bruta2.jpg'); nat,_=infinito(b2,0.2,1.0)
V+= [('Foto bruta (sua)',b2),('D · Da bruta: luz de estúdio + infinito',nat)]
fn=ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-SemiBold.otf',30)
cells=[]
for t,im in V:
    p=Image.fromarray(cv2.cvtColor(im,cv2.COLOR_BGR2RGB)); p.thumbnail((900,700),Image.LANCZOS)
    c=Image.new('RGB',(920,760),(239,233,236)); c.paste(p,((920-p.width)//2,60)); ImageDraw.Draw(c).text((20,14),t,fill=(90,42,70),font=fn); cells.append(c)
S=Image.new('RGB',(920*2,760*3),(239,233,236))
for i,c in enumerate(cells): S.paste(c,((i%2)*920,(i//2)*760))
S.save('s175_infinito_v2.jpg',quality=90)
for n,(t,im) in zip('0ABCxD',V):
    if n not in '0x': cv2.imwrite('inf_%s.jpg'%n,im,[cv2.IMWRITE_JPEG_QUALITY,95])

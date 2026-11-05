# Recorte automático para fotos de óculos em fundo branco:
# alfa por "desmultiplicar o branco" (sombras e lentes claras viram transparência real), recorte justo, centralização e checagens.
import sys, numpy as np
from PIL import Image, ImageFilter
def processa(src, dst, alvo=1400):
    im=Image.open(src)
    if im.mode in ('RGBA','LA','P'):  # foto com transparência: põe sobre branco antes (senão o transparente vira preto)
        im=im.convert('RGBA'); b=Image.new('RGBA',im.size,(255,255,255,255)); b.alpha_composite(im); im=b
    im=im.convert('RGB')
    w,h=im.size
    if max(w,h)<alvo:  # amplia fotos pequenas antes de recortar (bordas mais limpas)
        f=alvo/max(w,h); im=im.resize((round(w*f),round(h*f)),Image.LANCZOS)
    a=np.asarray(im).astype(np.float32)
    # 1. o fundo precisa ser branco: confere as bordas
    bord=np.concatenate([a[0],a[-1],a[:,0],a[:,-1]])
    fundo=bord.mean(0)
    aviso=[]
    if fundo.min()<235: aviso.append('fundo não é branco (média %s)'%fundo.round())
    # fundo uniforme? compara os 4 cantos (degradê ou sombra de estúdio estragam o recorte)
    k=max(4,min(a.shape[:2])//12)
    cant=[a[:k,:k].mean(),a[:k,-k:].mean(),a[-k:,:k].mean(),a[-k:,-k:].mean()]
    if max(cant)-min(cant)>10: aviso.append('fundo com degradê ou sombra (cantos de %d a %d)'%(min(cant),max(cant)))
    a=np.clip(a*(255/np.maximum(fundo,1)),0,255)  # normaliza o branco do fundo para 255
    # 2. alfa = quanto o pixel se afasta do branco, com curva (armação escura = opaca; lente clara = translúcida)
    d=(255-a.min(2))/255
    d0=d.copy()
    d=np.where(d<0.025,0,d)  # ruído do fundo
    # alfa exato nas partes claras (sombra e lente viram transparência escura de verdade); armação escura fica opaca
    al=np.where(d<0.35,d,np.clip(0.35+(d-0.35)/0.25*0.65,0,1))
    # 3. cor sem o branco por trás (usa o alfa exato para não clarear sombras)
    rgb=255-(255-a)/np.maximum(al[...,None],1e-3)
    rgb=np.clip(rgb,0,255)
    # 4. recorte justo
    m=al>0.25  # caixa só pelo que é peça de verdade (marca d'água e sujeira clara ficam de fora)
    ys,xs=np.where(m)
    if len(xs)==0: raise SystemExit('nada encontrado')
    y0,y1,x0,x1=ys.min(),ys.max(),xs.min(),xs.max()
    cobre=(x1-x0)*(y1-y0)/(a.shape[0]*a.shape[1])
    # manchas claras longe da peça (marca d'água, sujeira): mede no 'd' cru, fora de uma margem em volta da peça (a sombra da própria peça fica dentro)
    my=int((y1-y0)*.15); mx=int((x1-x0)*.06)
    longe=np.ones(d.shape,bool); longe[max(0,y0-my):y1+my,max(0,x0-mx):x1+mx]=False
    if longe.any() and ((d0>0.012)&longe).sum()/longe.sum()>0.01: aviso.append("manchas fora da peça (marca d'água ou sujeira no fundo)")
    if x0<=1 or y0<=1 or x1>=a.shape[1]-2 or y1>=a.shape[0]-2: aviso.append('peça encostando na borda da foto')
    if cobre<0.08: aviso.append('peça pequena demais na foto')
    out=np.dstack([rgb,al*255]).astype(np.uint8)[y0:y1+1,x0:x1+1]
    img=Image.fromarray(out,'RGBA')
    pad=int(max(img.size)*0.04)
    can=Image.new('RGBA',(img.width+2*pad,img.height+2*pad),(0,0,0,0)); can.paste(img,(pad,pad))
    can.save(dst)
    return can.size, aviso
if __name__=='__main__':
    for s,d in zip(sys.argv[1::2],sys.argv[2::2]):
        print(d,*processa(s,d))

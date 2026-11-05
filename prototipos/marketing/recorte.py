# Recorte automático para fotos de óculos em fundo branco:
# alfa por "desmultiplicar o branco" (sombras e lentes claras viram transparência real), recorte justo, centralização e checagens.
import sys, numpy as np
from PIL import Image, ImageFilter
def processa(src, dst, alvo=1400):
    im=Image.open(src).convert('RGB')
    w,h=im.size
    if max(w,h)<alvo:  # amplia fotos pequenas antes de recortar (bordas mais limpas)
        f=alvo/max(w,h); im=im.resize((round(w*f),round(h*f)),Image.LANCZOS)
    a=np.asarray(im).astype(np.float32)
    # 1. o fundo precisa ser branco: confere as bordas
    bord=np.concatenate([a[0],a[-1],a[:,0],a[:,-1]])
    fundo=bord.mean(0)
    aviso=[]
    if fundo.min()<235: aviso.append('fundo não é branco (média %s)'%fundo.round())
    a=np.clip(a*(255/np.maximum(fundo,1)),0,255)  # normaliza o branco do fundo para 255
    # 2. alfa = quanto o pixel se afasta do branco, com curva (armação escura = opaca; lente clara = translúcida)
    d=(255-a.min(2))/255
    d=np.where(d<0.025,0,d)  # ruído do fundo
    # alfa exato nas partes claras (sombra e lente viram transparência escura de verdade); armação escura fica opaca
    al=np.where(d<0.35,d,np.clip(0.35+(d-0.35)/0.25*0.65,0,1))
    # 3. cor sem o branco por trás (usa o alfa exato para não clarear sombras)
    rgb=255-(255-a)/np.maximum(al[...,None],1e-3)
    rgb=np.clip(rgb,0,255)
    # 4. recorte justo
    m=al>0.08
    ys,xs=np.where(m)
    if len(xs)==0: raise SystemExit('nada encontrado')
    y0,y1,x0,x1=ys.min(),ys.max(),xs.min(),xs.max()
    cobre=(x1-x0)*(y1-y0)/(a.shape[0]*a.shape[1])
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

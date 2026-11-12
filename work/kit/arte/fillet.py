import sys
from PIL import Image,ImageFilter,ImageChops
import numpy as np
def fillet(src,dst,r=9,borda=(232,195,214)):
    im=Image.open(src).convert('RGBA');a=np.array(im);al=a[...,3]>200
    m=Image.fromarray((al*255).astype('uint8'))
    k=2*r+1
    closed=np.array(m.filter(ImageFilter.MaxFilter(k)).filter(ImageFilter.MinFilter(k)))>127
    novo=closed&~al
    # não preencher longe do corpo: só cantos pequenos
    out=a.copy()
    # cor: média dos vizinhos opacos (raio r) — usa blur ponderado
    rgb=a[...,:3].astype(float)*al[...,None];w=al.astype(float)
    from PIL import Image as I
    def blur(x):return np.array(I.fromarray(np.clip(x,0,255).astype('uint8')).filter(ImageFilter.GaussianBlur(r))).astype(float)
    num=np.stack([blur(rgb[...,c]) for c in range(3)],-1);den=blur(w*255)/255+1e-6
    cor=num/den[...,None]
    out[novo,:3]=cor[novo].astype('uint8');out[novo,3]=255
    # contorno no novo limite
    sil=closed;edge=sil&~(np.array(Image.fromarray((sil*255).astype('uint8')).filter(ImageFilter.MinFilter(5)))>127)
    ed=edge&(np.array(Image.fromarray((novo*255).astype('uint8')).filter(ImageFilter.MaxFilter(7)))>127)
    out[ed,:3]=borda;out[ed,3]=255
    Image.fromarray(out).save(dst);return int(novo.sum())
if __name__=='__main__':print(fillet(sys.argv[1],sys.argv[2],int(sys.argv[3]) if len(sys.argv)>3 else 9))

# S175 v2: fundo infinito com as fotos do dono
import numpy as np, cv2
def mask_frame(img,bg):
    d=np.abs(img.astype(np.float32)-bg).max(2)
    m=(d>18).astype(np.uint8)
    m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((15,15),np.uint8))
    n,lab,stt,_=cv2.connectedComponentsWithStats(m)
    keep=np.zeros_like(m)
    for i in range(1,n):
        if stt[i,4]>m.size*0.002: keep[lab==i]=1
    return cv2.dilate(keep,np.ones((7,7),np.uint8))
def luz(img,m,k=0.12):
    # luz do fundo: borra a foto sem a armação (preenche a armação com o entorno)
    h,w=img.shape[:2]; s=0.25
    sm=cv2.resize(img,(int(w*s),int(h*s)),interpolation=cv2.INTER_AREA).astype(np.float32)
    mm=cv2.resize(m,(int(w*s),int(h*s)),interpolation=cv2.INTER_NEAREST)
    inp=cv2.inpaint(sm.astype(np.uint8),mm*255,15,cv2.INPAINT_TELEA).astype(np.float32)
    r=int(max(h,w)*s*k)|1
    bl=cv2.GaussianBlur(inp,(r,r),0)
    return cv2.resize(bl,(w,h),interpolation=cv2.INTER_CUBIC)
def infinito(img,sombra_alt=0.16,forca=1.0):
    img=img.astype(np.float32)
    bg0=cv2.GaussianBlur(img,(0,0),40)
    m=mask_frame(img,bg0)
    L=luz(img,m,0.10)
    flat=np.clip(img/np.maximum(L,1)*255,0,255)          # luz de estúdio (flat-field)
    # sombra real: o que ficou escuro logo abaixo da armação é mantido; o resto do fundo vira 255
    ys,xs=np.where(m>0); y0,y1=ys.min(),ys.max(); x0,x1=xs.min(),xs.max(); H=img.shape[0]
    zona=np.zeros(img.shape[:2],np.float32)
    cv2.ellipse(zona,((x0+x1)//2,int(y1-0.02*(y1-y0))),(int((x1-x0)*0.56),int((y1-y0)*sombra_alt+10)),0,0,360,1,-1)
    zona=cv2.GaussianBlur(zona,(0,0),(y1-y0)*0.08+3)
    lum=flat.mean(2,keepdims=True)
    som=np.clip((255-lum)/255,0,1)*zona[...,None]*forca
    out=255-som*255
    out=np.repeat(out,3,2) if out.shape[2]==1 else out
    mm=cv2.GaussianBlur(m.astype(np.float32),(0,0),1.2)[...,None]
    return np.clip(flat*mm+out*(1-mm),0,255).astype(np.uint8),(x0,y0,x1,y1)
def sombra_sintetica(img255,refl=False):
    img=img255.astype(np.float32); bg0=np.full_like(img,255)
    m=mask_frame(img,bg0); ys,xs=np.where(m>0); y1=ys.max(); y0=ys.min(); x0,x1=xs.min(),xs.max(); H,W=m.shape
    C=np.full((int(H*1.18),W,3),255,np.float32); C[:H]=img
    sh=np.zeros(C.shape[:2],np.float32)
    flat=cv2.resize(m[y0:y1+1].astype(np.float32),(W,max(3,int((y1-y0)*0.10))))
    yy=y1-int((y1-y0)*0.03); sh[yy:yy+flat.shape[0],:]=np.maximum(sh[yy:yy+flat.shape[0],:],flat[:,:W])
    sh=cv2.GaussianBlur(sh,(0,0),(y1-y0)*0.035)
    el=np.zeros_like(sh); cv2.ellipse(el,((x0+x1)//2,y1+int((y1-y0)*0.02)),(int((x1-x0)*0.47),int((y1-y0)*0.06)),0,0,360,1,-1); el=cv2.GaussianBlur(el,(0,0),(y1-y0)*0.06)
    s=np.maximum(sh*0.20,el*0.16)[...,None]
    C=C*(1-s*0.9)
    if refl:
        L=int((y1-y0)*0.55); fr=img[y1-L:y1+1][::-1]; fm=m[y1-L:y1+1][::-1].astype(np.float32)
        g=np.linspace(0.20,0,fr.shape[0])[:,None]; a=(fm*g)[...,None]
        n=min(fr.shape[0],C.shape[0]-y1-3); reg=C[y1+3:y1+3+n]
        C[y1+3:y1+3+n]=reg*(1-a[:n])+fr[:n]*a[:n]
    mk=np.zeros(C.shape[:2],np.float32); mk[:H]=cv2.GaussianBlur(m.astype(np.float32),(0,0),1)
    k=mk[:H][...,None]; C[:H]=C[:H]*(1-k)+img*k
    return np.clip(C,0,255).astype(np.uint8)
def crop32(img,box,pad=0.16):
    x0,y0,x1,y1=box; w=x1-x0; cx=(x0+x1)/2; cy=(y0+y1)/2+ (y1-y0)*0.08
    W=w*(1+2*pad); Hh=W*2/3; H,Wi=img.shape[:2]
    a=int(max(0,cx-W/2)); b=int(max(0,cy-Hh/2)); return img[b:int(min(H,b+Hh)),a:int(min(Wi,a+W))]
if __name__=='__main__':
    b=cv2.imread('in/bruta.jpg')
    v1,box=infinito(b,0.16,1.0); v1c=crop32(v1,box); cv2.imwrite('inf_bruta_natural.jpg',v1c,[cv2.IMWRITE_JPEG_QUALITY,93])
    cv2.imwrite('inf_bruta_orig.jpg',crop32(b,box),[cv2.IMWRITE_JPEG_QUALITY,93])
    a=cv2.imread('in/app255.jpg')
    cv2.imwrite('inf_app_sombra.jpg',sombra_sintetica(a,False),[cv2.IMWRITE_JPEG_QUALITY,93])
    cv2.imwrite('inf_app_reflexo.jpg',sombra_sintetica(a,True),[cv2.IMWRITE_JPEG_QUALITY,93])
    b2=cv2.imread('in/bruta2.jpg'); v2,box2=infinito(b2,0.2,1.0); cv2.imwrite('inf_bruta2_natural.jpg',v2,[cv2.IMWRITE_JPEG_QUALITY,93])
    print('ok',box)

import numpy as np, cv2
from scipy.interpolate import RBFInterpolator
im=cv2.imread('ref.png'); H,W=im.shape[:2]
def face(cx,sym=1):
    # (origem, destino) no lado esquerdo; o direito é espelhado em torno de cx
    fixed=[(cx,250),(cx-40,262),(cx+40,262),(cx,300),(cx,330),(cx-30,335),(cx+30,335),(cx-98,250),(cx-98,290),(cx,120),(cx-110,150),(cx-60,440),(cx-30,438)]
    mv=[((cx-91,340),(cx-93,336)),((cx-75,360),(cx-82,352)),((cx-63,370),(cx-72,362)),((cx-40,390),(cx-50,382)),((cx-22,400),(cx-30,392)),((cx,403),(cx,394))]
    src=[];dst=[]
    for p in fixed:
        for q in {p,(2*cx-p[0],p[1])}: src.append(q);dst.append(q)
    for a,b in mv:
        src.append(a);dst.append(b)
        if a[0]!=cx: src.append((2*cx-a[0],a[1]));dst.append((2*cx-b[0],b[1]))
    return src,dst
S=[];D=[]
for cx in (290,625):
    s,d=face(cx);S+=s;D+=d
# cantos da imagem fixos
for p in [(0,0),(W-1,0),(0,H-1),(W-1,H-1),(W//2,0),(W//2,H-1),(460,300)]:S.append(p);D.append(p)
S=np.array(S,float);D=np.array(D,float)
f=RBFInterpolator(D,S-D,kernel='thin_plate_spline',smoothing=0.5)  # destino -> deslocamento até a origem
yy,xx=np.mgrid[0:H,0:W]; P=np.c_[xx.ravel(),yy.ravel()].astype(float)
off=f(P); mx=(P[:,0]+off[:,0]).reshape(H,W).astype(np.float32); my=(P[:,1]+off[:,1]).reshape(H,W).astype(np.float32)
out=cv2.remap(im,mx,my,cv2.INTER_CUBIC,borderMode=cv2.BORDER_REPLICATE)
cv2.imwrite('redondo_v1.png',out)
cv2.imwrite('lado.png',np.hstack([im,np.full((H,20,3),255,np.uint8),out]))

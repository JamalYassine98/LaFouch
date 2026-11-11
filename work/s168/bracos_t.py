import numpy as np
from PIL import Image, ImageDraw
T=['natal','anonovo','maes','pais','bf','halloween']
def A(t): return np.array(Image.open('/tmp/b8/og_t_%s.png'%t).convert('RGBA'))
ref=A('pais')[380:600,60:767,3]>128
OUT=(232,195,214,255)
def offset(a):
  m=a[...,3]>128; h,w=m.shape; best=None
  def sc(dy,dx):
    y0,x0=380+dy,60+dx
    if y0<0 or x0<0 or y0+220>h or x0+707>w: return 1e9
    return (m[y0:y0+220,x0:x0+707]^ref).sum()
  for dy in range(-260,300,2):
    for dx in range(-40,200,2):
      s=sc(dy,dx)
      if best is None or s<best[0]: best=(s,dy,dx)
  s,dy,dx=best
  for yy in range(dy-2,dy+3):
    for xx in range(dx-2,dx+3):
      s2=sc(yy,xx)
      if s2<s: s,dy,dx=s2,yy,xx
  return dy,dx,s
def bez(p0,c1,c2,p3,n=400):
  t=np.linspace(0,1,n)[:,None]
  P=[np.array(p,float) for p in (p0,c1,c2,p3)]
  return (1-t)**3*P[0]+3*(1-t)**2*t*P[1]+3*(1-t)*t**2*P[2]+t**3*P[3]
K=8
for t in T:
  a=A(t); dy,dx,s=(0,0,0) if t=='pais' else offset(a)
  pele=tuple(int(v) for v in a[420+dy,128+dx][:3])+(255,)
  im=Image.fromarray(a); big=im.resize((im.width*K,im.height*K),Image.NEAREST)
  d=ImageDraw.Draw(big)
  S=lambda x,y:((x+dx)*K,(y+dy)*K)
  # braço levantado: fecha o V da ponta com a cor do contorno
  d.polygon([S(654,309.5),S(670,310.5),S(657.5,318.5),S(654,318.5)],fill=OUT)
  # braço baixo: contorno contínuo corpo -> braço (sem o degrau)
  C=bez((128.5,388),(128.5,410),(108.5,445),(105.2,470),3000)
  SY=[388,400,410,418,425,437,445,461,477,493]; SX=[128.5,129,133,139,144,149,152,158,164,176]
  PB=np.polyfit(SY,SX,3,w=[20,4,1,1,1,1,1,1,1,1])
  b=np.array(big); o=b.copy()
  for Y in range(int((388+dy)*K),int((493+dy)*K)):
    y=Y/K-dy
    cb=np.polyval(PB,y); hb=3.3
    ab=1.0 if y<470 else max(0,1-(y-470)/23)
    if y<=470:
      ca=C[np.argmin(abs(C[:,1]-y)),0]; ha=3.5-1.3*(y-388)/82
    else: ca=None
    Xr=int((cb+hb+4+dx)*K); pel=o[Y,Xr].astype(float)
    for X in range(int((95+dx)*K),int((cb+hb+dx)*K)+1):
      x=X/K-dx
      if ca is not None and x<ca-ha: b[Y,X]=(0,0,0,0); continue
      if ca is not None and x<=ca+ha: b[Y,X]=OUT; continue
      if x>=cb-hb:
        base=o[Y,X].astype(float)
        if ca is not None and (base[3]<200 or base[1]<218): base=pel
        b[Y,X]=(np.array(OUT,float)*ab+base*(1-ab)).astype('uint8'); continue
      if ca is not None and (o[Y,X][3]<200 or o[Y,X][1]<218): b[Y,X]=pel
  out=Image.fromarray(b).resize(im.size,Image.BOX)
  out.save('/tmp/b8/og_t_%s_b.png'%t); print(t,dy,dx,s)

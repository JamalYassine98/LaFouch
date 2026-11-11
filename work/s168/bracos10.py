# S169: junções dos braços nos Mochis temáticos, mesma técnica da v7 (captura sem máscara + V fechado + curva tangente)
import numpy as np
from PIL import Image, ImageDraw
T=['natal','anonovo','maes','pais','bf','halloween']
def A(t): return np.array(Image.open('/tmp/b8/og_r_%s.png'%t).convert('RGBA'))
REF=A('pais')[380:600,60:767,3]>128
OUT=(232,195,214,255)
def offset(a):
  m=a[...,3]>128; h,w=m.shape
  def sc(dy,dx):
    y0,x0=380+dy,60+dx
    if y0<0 or x0<0 or y0+220>h or x0+707>w: return 10**9
    return int((m[y0:y0+220,x0:x0+707]^REF).sum())
  best=min((sc(dy,dx),dy,dx) for dy in range(-260,300,2) for dx in range(-40,200,2))
  return min((sc(y,x),y,x) for y in range(best[1]-2,best[1]+3) for x in range(best[2]-2,best[2]+3))
def bez(p0,c1,c2,p3,n=3000):
  t=np.linspace(0,1,n)[:,None]; P=[np.array(p,float) for p in (p0,c1,c2,p3)]
  return (1-t)**3*P[0]+3*(1-t)**2*t*P[1]+3*(1-t)*t**2*P[2]+t**3*P[3]
K=8
for t in T:
  a=A(t); s,dy,dx=(0,0,0) if t=='pais' else offset(a)
  im=Image.fromarray(a); big=im.resize((im.width*K,im.height*K),Image.NEAREST)
  S=lambda x,y:((x+dx)*K,(y+dy)*K)
  # braço levantado: fecha o V na ponta de baixo
  ImageDraw.Draw(big).polygon([S(636.5,470.5),S(645.5,470),S(640,476.8),S(635.5,476.8)],fill=OUT)
  # braço relaxado: contorno do braço sai tangente do contorno do corpo (sem a aba)
  C=bez((131,384),(131,404),(115.3,426),(112.5,440))
  b=np.array(big); o=b.copy()
  for Y in range(int((384+dy)*K),int((440+dy)*K)):
    y=Y/K-dy
    cx=C[np.argmin(abs(C[:,1]-y)),0]; hw=4.0+0.8*(y-384)/56
    pel=o[int((419+dy)*K),int((126+dx)*K)] if y<419 else None
    for X in range(int((100+dx)*K),int((127+dx)*K)):
      x=X/K-dx
      if x<cx-hw: b[Y,X]=(0,0,0,0)
      elif x<=cx+hw: b[Y,X]=OUT
      elif pel is not None: b[Y,X]=pel
  Image.fromarray(b).resize(im.size,Image.BOX).save('/tmp/b8/og_t_%s_b.png'%t); print(t,dy,dx,s)

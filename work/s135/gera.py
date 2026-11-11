import math,json
def bz(p0,p1,p2,p3,t):
  u=1-t;return tuple(u**3*a+3*u*u*t*b+3*u*t*t*c+t**3*d for a,b,c,d in zip(p0,p1,p2,p3))
def bzd(p0,p1,p2,p3,t):
  u=1-t;return tuple(3*u*u*(b-a)+6*u*t*(c-b)+3*t*t*(d-c) for a,b,c,d in zip(p0,p1,p2,p3))
L=[(14,84),(14,58),(25,30),(60,30)];R=[(60,30),(95,30),(106,58),(106,84)]
def pt(s,off):  # s in [-1,1] ; -1 left side at y84, 0 top, 1 right
  seg,t=(L,1+s) if s<0 else (R,s)
  x,y=bz(*seg,t);dx,dy=bzd(*seg,t);n=math.hypot(dx,dy);nx,ny=-dy/n,dx/n
  # inward normal: for clockwise path (left seg goes up), choose pointing to center (60,84)
  if (60-x)*nx+(84-y)*ny<0:nx,ny=-nx,-ny
  return x+nx*off,y+ny*off,math.degrees(math.atan2(dy,dx))
# heart
def heart(cx,cy,s,sx=None):
  sx=sx or s
  P=[]
  for i in range(120):
    t=i/120*2*math.pi
    x=16*math.sin(t)**3;y=13*math.cos(t)-5*math.cos(2*t)-2*math.cos(3*t)-math.cos(4*t)
    P.append((cx+x*sx,cy-y*s))
  return P
def inside(P,x,y):
  c=False;j=len(P)-1
  for i in range(len(P)):
    xi,yi=P[i];xj,yj=P[j]
    if (yi>y)!=(yj>y) and x<(xj-xi)*(y-yi)/(yj-yi)+xi:c=not c
    j=i
  return c
def ok(P,ex,ey,m):
  for k in range(72):
    a=k/72*2*math.pi
    if not inside(P,ex+(6.6+m)*math.cos(a),ey+(7.8+m)*math.sin(a)):return False
  return True
best=None
for s in [x/100 for x in range(70,130,2)]:
 for sx in [x/100 for x in range(70,95)]:
  for dy in [x/10 for x in range(-40,61,2)]:
    P=heart(45,83+dy,s,sx)
    if ok(P,45,83,2.0) and max(p[0] for p in P)<58.8:
      a=s*sx
      if best is None or a<best[0]:best=(a,s,sx,dy)
print(best)
_,s,sx,dy=best
def hp(cx):
  P=heart(cx,83+dy,s,sx);return 'M'+' L'.join(f'{x:.2f} {y:.2f}' for x,y in P)+'Z'
P=heart(45,83+dy,s,sx);print('ytop',min(p[1] for p in P),'ybot',max(p[1] for p in P),'xmax',max(p[0] for p in P))
band=[pt(-0.62+i*1.24/40,4.5) for i in range(41)]
json.dump({'h45':hp(45),'h75':hp(75),'band':band,'xr':max(p[0] for p in P)},open('geo.json','w'))

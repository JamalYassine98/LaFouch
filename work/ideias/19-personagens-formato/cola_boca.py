from PIL import Image, ImageChops
import numpy as np
r=Image.open('objetivo-dono-quadrado-card.jpg').convert('L')
P={'h':r.crop((250,297,330,358)),'m':r.crop((575,294,672,356))}
from PIL import ImageFilter
for k in ['h']:
    q=P[k].resize((P[k].width*4,P[k].height*4),Image.LANCZOS).point(lambda v: 0 if v<165 else (255 if v>215 else int((v-165)*5.1)))
    P[k]=q.filter(ImageFilter.GaussianBlur(1.2)).resize(P[k].size,Image.LANCZOS)  # traço limpo, preto como o resto do desenho
# mulher: só níveis (o lábio de baixo é um traço curvo com meio-tom; limiar duro o partia em dois)
P['m']=P['m'].point(lambda v: 0 if v<70 else (255 if v>225 else int((v-70)*255/155)))
g=Image.open('flow-grade/grade-original.jpg').convert('L'); a=np.asarray(g)<128; out=g.copy()
paineis=[(43,299),(460,725),(879,1142)]; log=[]
def larg(row): 
    xs=np.where(row)[0]; return int(xs.max()-xs.min()) if len(xs) else 0
for (y0,y1) in paineis:
  for x0 in [0,448]:
    for k,cx in [('h',x0+123),('m',x0+323)]:
      band=a[:,cx-14:cx+14].any(1)
      runs=[];st=None
      for yy in range(y0+110,min(y1,y0+225)):
        if band[yy] and st is None: st=yy
        if not band[yy] and st is not None: runs.append((st,yy-1)); st=None
      cand=[r for r in runs if r[0]<y0+185]
      longo=max(cand,key=lambda r:r[1]-r[0]) if cand else None
      lim=longo[1] if longo and longo[1]-longo[0]>=5 else y0+160
      fe=[r for r in runs if r[0]>lim and r[1]-r[0]<=6][:3]       # nariz + 2 traços da boca
      top,bot=fe[0][0],fe[-1][1]; bot=max(bot,top+36)   # apaga até abaixo do lábio de baixo (a mulher tem 4 traços)
      mw=max(larg(a[yy,cx-34:cx+34]) for yy in range(top,bot+1))
      out.paste(255,(cx-32,top-2,cx+33,bot+3))
      p=P[k]; esc=max(mw,46)/(p.width*0.92); pp=p.resize((int(p.width*esc),int(p.height*esc)),Image.LANCZOS)
      left=int(cx-pp.width/2); reg=out.crop((left,top-1,left+pp.width,top-1+pp.height)); out.paste(ImageChops.darker(reg,pp),(left,top-1))
      log.append((y0,x0,k,top,bot,mw,len(fe)))
print(log)
out.save('flow-grade/grade-bocas-referencia.png')
nomes=['oval','redondo','quadrado','alongado','coracao','diamante'];kk=0
A=np.asarray(out)<200
for (y0,y1) in paineis:
  for (xa,xb) in [(0,448),(448,896)]:
    sub=A[y0:y1,xa:xb]; ys,xs=np.where(sub)
    out.crop((xs.min()+xa-16,ys.min()+y0-16,xs.max()+xa+16,ys.max()+y0+16)).convert('RGB').save(f'flow-grade/{nomes[kk]}-final.png'); kk+=1
out.crop((0,40,448,300)).resize((896,520)).save('/tmp/zoom.png')

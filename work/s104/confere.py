# confere pixel a pixel: (1) nenhum pixel da cabeça fica visível acima da borda de baixo do chapéu; (2) folga entre chapéu e óculos
import sys,io;sys.path.insert(0,'.');from t104 import *
import numpy as np;from PIL import Image
from playwright.sync_api import sync_playwright
S=8;W,H=132*S,110*S
def masc(pg,s):
  pg.set_content(f'<html><body style="margin:0;background:transparent"><div style="width:{W}px;height:{H}px">{s}</div></body></html>');pg.wait_for_timeout(80)
  a=np.array(Image.open(io.BytesIO(pg.screenshot(omit_background=True,clip={'x':0,'y':0,'width':W,'height':H}))))[:,:,3]>40;return a
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':W,'height':H})
  for t in TEMAS:
    C=masc(pg,monta(t,'cab'));F=masc(pg,monta(t,'fr'));O=masc(pg,monta(t,'oc'))
    cols=np.where(F.any(0))[0];bot=np.full(W,-1)
    for x in cols:bot[x]=np.where(F[:,x])[0].max()
    xl,xr=cols.min(),cols.max();edge=min(bot[xl],bot[xr])
    vaz=0
    for x in range(W):
      lim=bot[x] if bot[x]>=0 else edge
      col=C[:lim,x]&~F[:lim,x];vaz+=int(col.sum())
    # folga chapéu-óculos (em unidades do desenho)
    fy,fx=np.where(F);oy,ox=np.where(O)
    from scipy.spatial import cKDTree
    d=cKDTree(np.c_[fy,fx]).query(np.c_[oy,ox])[0].min()/S
    print(f"{t['nome']}: pixels da cabeça para fora do chapéu = {vaz} | menor folga chapéu↔óculos = {d:.1f} unid ({d*0.86:.1f} px no celular)")
    if vaz:
      L=np.zeros_like(C)
      for x in range(W):
        lim=bot[x] if bot[x]>=0 else edge;L[:lim,x]=C[:lim,x]&~F[:lim,x]
      ys,xs=np.where(L);print('   onde (unid):',sorted(set((int(x/S)-6,int(y/S)+24) for y,x in zip(ys,xs)))[:30])

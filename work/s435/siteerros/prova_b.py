from hoje import *
import mede as M
FIX='.pgm .buy{z-index:auto!important}'
with sync_playwright() as pw:
  for w,h in ((386,858),(844,390),(768,1024)):
    for fx in (0,1):
      b,pg=abre(pw,w,h,True,'Peça')
      if fx: pg.add_style_tag(content=FIX);pg.wait_for_timeout(300)
      a,_=M.percorre(pg,None);print(w,h,'prop' if fx else 'hoje',[(k[0],v['d'][:70]) for k,v in a.items()]);b.close()

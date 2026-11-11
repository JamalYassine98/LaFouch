# captura celular (390) e PC (1280) da home por tema: python3 cap.py <prefixo> [temas]
import sys
from playwright.sync_api import sync_playwright
P=sys.argv[1]; T=(sys.argv[2] if len(sys.argv)>2 else 'natal,anonovo,maes,pais,bf,halloween').split(',')
with sync_playwright() as p:
  b=p.chromium.launch()
  for t in T:
    for nm,vp,dsf in (('cel',{'width':390,'height':1700},2),('pc',{'width':1280,'height':1500},1)):
      pg=b.new_page(viewport=vp,device_scale_factor=dsf)
      pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
      pg.add_init_script("localStorage.setItem('lf_gzmudo','1');localStorage.setItem('lf_ck','1')")
      pg.goto('http://localhost:8170/?evp='+t); pg.wait_for_timeout(3500)
      pg.evaluate("try{document.querySelectorAll('#ckb,.ckb,#lfck').forEach(e=>e.remove())}catch(e){}")
      pg.screenshot(path='%s_%s_%s.png'%(P,t,nm)); pg.close()
  b.close()

import os;PF=os.environ.get('PF','')
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
  b=p.chromium.launch()
  for nm,vp,dsf in (('cel',{'width':390,'height':844},2),('pc',{'width':1366,'height':800},1)):
    pg=b.new_page(viewport=vp,device_scale_factor=dsf)
    pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
    pg.add_init_script("localStorage.setItem('lf_gzmudo','1');localStorage.setItem('lf_ck','1')")
    pg.goto('http://localhost:8176/');pg.wait_for_timeout(3500)
    pg.screenshot(path=PF+'home_%s.png'%nm,full_page=False)
    pg.goto('http://localhost:8176/?ref=SL2250');pg.wait_for_timeout(3000)
    pg.screenshot(path=PF+'prod_%s.png'%nm,full_page=False)
    pg.goto('http://localhost:8176/?r=lentes-de-sol');pg.wait_for_timeout(3000)
    pg.screenshot(path=PF+'cat_%s.png'%nm,full_page=False)
    pg.close()
  b.close()

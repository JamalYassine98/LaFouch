from playwright.sync_api import sync_playwright
T=['natal','anonovo','maes','pais','bf','halloween']
with sync_playwright() as p:
  b=p.chromium.launch()
  for t in T:
    for nm,vp,dsf in (('cel',{'width':390,'height':1500},2),('pc',{'width':1280,'height':1100},1)):
      pg=b.new_page(viewport=vp,device_scale_factor=dsf)
      pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
      pg.add_init_script("localStorage.setItem('lf_gzmudo','1');localStorage.setItem('lf_ck','1')")
      pg.goto('http://localhost:8170/?evp='+t); pg.wait_for_timeout(3000)
      pg.get_by_text('Ver todos').first.click(); pg.wait_for_timeout(2500)
      pg.screenshot(path='cat_%s_%s.png'%(t,nm)); pg.close()
  b.close()

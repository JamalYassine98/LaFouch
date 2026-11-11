import os,glob,shutil
from playwright.sync_api import sync_playwright
T=['natal','anonovo','maes','pais','bf','halloween']
with sync_playwright() as p:
  b=p.chromium.launch()
  for t in T:
    d='/tmp/v170_'+t; shutil.rmtree(d,True)
    cx=b.new_context(viewport={'width':390,'height':640},device_scale_factor=2,record_video_dir=d,record_video_size={'width':390,'height':640})
    pg=cx.new_page(); pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
    pg.add_init_script("localStorage.setItem('lf_gzmudo','1');localStorage.setItem('lf_ck','1')")
    pg.goto('http://localhost:8170/?evp='+t); pg.wait_for_timeout(9000); cx.close()
  b.close()

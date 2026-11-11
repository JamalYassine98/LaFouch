import sys,os,subprocess,shutil
from playwright.sync_api import sync_playwright
v=int(sys.argv[1]); fps=30; d='/tmp/vf%d'%v; shutil.rmtree(d,True); os.makedirs(d)
with sync_playwright() as p:
  b=p.chromium.launch();pg=b.new_page(viewport={'width':1080,'height':1920})
  pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
  pg.goto('http://localhost:8170/s171/vid.html?v=%d'%v);pg.wait_for_timeout(1500)
  dur=pg.evaluate('R.dur');n=int(dur*fps)
  for i in range(n):
    pg.evaluate('R(%f)'%(i/fps));pg.screenshot(path='%s/%05d.jpg'%(d,i),type='jpeg',quality=92)
  b.close()
print(n)

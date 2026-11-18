import sys,time,subprocess
from playwright.sync_api import sync_playwright
srv=subprocess.Popen([sys.executable,'-m','http.server','8970','-d','pagina'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W,H in [(390,844),(1280,900)]:
      c=b.new_context(viewport={'width':W,'height':H},is_mobile=W<700,has_touch=W<700,device_scale_factor=2)
      c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
      pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)));pg.goto('http://localhost:8970/');pg.wait_for_timeout(1500)
      pg.screenshot(path='pg_%d_a.png'%W,full_page=False)
      pg.locator('[data-w="1440"]').click();pg.wait_for_timeout(300);pg.locator('[data-t="catalogo"]').click();pg.wait_for_timeout(800)
      pg.locator('[data-l="T13"]').click();pg.wait_for_timeout(300)
      pg.screenshot(path='pg_%d_f.png'%W)
      pg.locator('#junta').click(force=True);pg.wait_for_timeout(300);pg.locator('.item textarea').first.fill('maior');pg.wait_for_timeout(200)
      pg.screenshot(path='pg_%d_b.png'%W)
      print(W,'erros',er,'marcadores',pg.locator('.mk').count(),'msg',pg.evaluate("()=>document.querySelector('#abre').textContent"))
      c.close()
finally: srv.terminate()

from playwright.sync_api import sync_playwright
import sys,time
W,H=int(sys.argv[1]),int(sys.argv[2]);pre=sys.argv[3]
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':W,'height':H},device_scale_factor=2)
  errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
  pg.goto('http://localhost:8771/');pg.wait_for_timeout(2500)
  pg.evaluate("localStorage.setItem('lf_gzmudo','1')")
  pg.evaluate("document.querySelector('[data-gzopen]').click()");pg.wait_for_timeout(2500);pg.screenshot(path=f'/tmp/{pre}_1intro.png')
  pg.wait_for_timeout(5000);pg.screenshot(path=f'/tmp/{pre}_2chama.png')
  pg.click('#gw [data-gz=comeca]');pg.wait_for_timeout(6500);pg.screenshot(path=f'/tmp/{pre}_3teste.png')
  for i in range(3):
    pg.click('#gw [data-gz=sim]');pg.wait_for_timeout(2600)
  pg.screenshot(path=f'/tmp/{pre}_4desceu.png')
  pg.click('#gw [data-gz=nao]');pg.wait_for_timeout(1500);pg.screenshot(path=f'/tmp/{pre}_5lente_voa.png');pg.wait_for_timeout(3000);pg.screenshot(path=f'/tmp/{pre}_6lente.png')
  for i in range(6):
    pg.click('#gw [data-gz=sim]');pg.wait_for_timeout(2600)
  pg.screenshot(path=f'/tmp/{pre}_7.png')
  print(pg.evaluate("JSON.stringify({fase:__LFGZ.Z.fase,g:__LFGZ.Z.g,at:__LFGZ.Z.at,desce:__LFGZ.Z.desce})"))
  for i in range(4):
    if pg.evaluate("__LFGZ.Z.fase")!='teste':break
    pg.click('#gw [data-gz=sim]');pg.wait_for_timeout(3500);print(pg.evaluate("JSON.stringify({fase:__LFGZ.Z.fase,g:__LFGZ.Z.g,at:__LFGZ.Z.at})"))
  if pg.evaluate("__LFGZ.Z.fase")=='teste':pg.click('#gw [data-gz=nao]');pg.wait_for_timeout(4000)
  pg.screenshot(path=f'/tmp/{pre}_8res.png');print(pg.evaluate("JSON.stringify({fase:__LFGZ.Z.fase,G:__LFGZ.Z.G})"))
  print('ERROS',errs[:8])

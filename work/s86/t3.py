from playwright.sync_api import sync_playwright
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  c=b.new_context(locale='pt-BR',viewport={'width':390,'height':844},device_scale_factor=2);pg=c.new_page()
  aud=[];pg.on('request',lambda r:'/media/voz/' in r.url and aud.append(r.url.split('/')[-1]))
  errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
  pg.goto('http://localhost:8771/');pg.wait_for_timeout(2500);print('lang',pg.evaluate('LFI.lang'))
  pg.evaluate("document.querySelector('[data-gzopen]').click()");pg.wait_for_timeout(1200)
  log=[]
  for i in range(14):
    pg.wait_for_timeout(500);log.append(pg.evaluate("(()=>{const Z=__LFGZ.Z;return Z.falando?1:0})()"))
  print('falando (intro, a cada 0,5 s):',log)
  pg.wait_for_timeout(3000);pg.screenshot(path='/tmp/c_chama.png')
  pg.click('#gw [data-gz=comeca]');pg.wait_for_timeout(9000)
  t=[pg.evaluate("[document.querySelector('#gzbt').className,__LFGZ.Z.falando]") for _ in range(1)];print('na pergunta:',t)
  pg.click('#gw [data-gz=sim]');print('tocou durante a fala? pend=',pg.evaluate('__LFGZ.Z.pend'));pg.wait_for_timeout(5000)
  print('at',pg.evaluate('__LFGZ.Z.at'))
  print('áudios pedidos:',aud);print('erros',errs)

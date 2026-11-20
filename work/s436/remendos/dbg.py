import sys,subprocess,time
from playwright.sync_api import sync_playwright
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
srv=[subprocess.Popen([sys.executable,'-m','http.server',str(p),'-d',d],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL) for p,d in ((8821,'/home/claude/lafouch/www'),(8822,'/tmp/lfc/www'))];time.sleep(1)
JS=sys.argv[2]
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for porta in (8821,8822):
      c=b.new_context(viewport={'width':1366,'height':768},locale='pt-BR',color_scheme='light',service_workers='block')
      c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
      c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
      pg=c.new_page();pg.goto('http://localhost:%d/index.html#test'%porta);pg.wait_for_function('window.__LF');pg.wait_for_timeout(900)
      for p in dict(C)[sys.argv[1]]:
        pg.evaluate(p);pg.wait_for_timeout(650)
      print(porta,pg.evaluate(JS))
    b.close()
finally: [s.kill() for s in srv]

# confere se uma diferença é ruído: abre a MESMA pasta várias vezes e mostra se a peça muda sozinha
import sys,subprocess,time
from playwright.sync_api import sync_playwright
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
W,H=(820,1180) if sys.argv[3]=='tablet' else (390,844)
srv=subprocess.Popen([sys.executable,'-m','http.server','8831','-d',sys.argv[1]],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for k in range(6):
      c=b.new_context(viewport={'width':W,'height':H},is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark',service_workers='block')
      c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
      c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
      pg=c.new_page();pg.goto('http://localhost:8831/index.html#test');pg.wait_for_function('window.__LF');pg.wait_for_timeout(900)
      for p in dict(C)[sys.argv[2]]:
        pg.evaluate(p);pg.wait_for_timeout(650)
      print(k,pg.evaluate(sys.argv[4]));c.close()
    b.close()
finally: srv.kill()

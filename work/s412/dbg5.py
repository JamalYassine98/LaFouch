exec(open('e112.py').read())
srv=subprocess.Popen([sys.executable,'-m','http.server','8921','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
src=open('e112.py').read()
try:
  with sync_playwright() as pw:
    for prop in (False,True):
      res=[]
      for dy in range(0,1300,50):
        b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
        c=b.new_context(viewport={'width':768,'height':1024},has_touch=True,service_workers='block')
        c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        c.add_init_script("localStorage.setItem('lf_cfg',%r);sessionStorage.setItem('lf_ni','1');"%cfg('natal')+("addEventListener('DOMContentLoaded',()=>{%s})"%PROP if prop else ''))
        pg=c.new_page();pg.goto('http://localhost:8921/');pg.wait_for_timeout(2000)
        pg.evaluate(PRE['peca']);pg.wait_for_timeout(500);pg.locator('#home .hc').first.tap();pg.wait_for_timeout(1300)
        pg.evaluate("(d)=>{const p=document.querySelector('#layer .scrim.pg');p.scrollTop=d}",dy);pg.wait_for_timeout(400)
        o=[x for x in pg.evaluate(OLHO) if x['r']=='tampado'];res.append((dy,[e for x in o for e in x['ex']]));b.close()
      print('prop' if prop else 'hoje',[r for r in res if r[1]])
finally: srv.terminate()

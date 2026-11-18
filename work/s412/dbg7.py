exec(open('e112.py').read())
srv=subprocess.Popen([sys.executable,'-m','http.server','8921','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    for W,H in [(390,844),(768,1024),(1024,1366),(1440,900)]:
      for tela in ['peca','carrinho']:
        b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
        c=b.new_context(viewport={'width':W,'height':H},has_touch=W<1100,service_workers='block')
        c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        c.add_init_script("sessionStorage.setItem('lf_ni','1');")
        pg=c.new_page();pg.goto('http://localhost:8921/');pg.wait_for_timeout(2000)
        if tela=='peca': pg.evaluate(PRE['peca']);pg.wait_for_timeout(400)
        el=pg.locator(ACOES[tela]).first;bx=el.bounding_box();(pg.touchscreen.tap if W<1100 else pg.mouse.click)(bx['x']+bx['width']/2,bx['y']+min(bx['height']/2,60));pg.wait_for_timeout(1300)
        print(W,tela,pg.evaluate("()=>{const t=document.querySelector('.top').getBoundingClientRect(),s=document.querySelector('#layer .scrim.pg').getBoundingClientRect();return {top_fim:Math.round(t.bottom*10)/10,scrim_ini:Math.round(s.top*10)/10,hth:getComputedStyle(document.documentElement).getPropertyValue('--hth'),z:getComputedStyle(document.documentElement).getPropertyValue('--z')}}"));b.close()
finally: srv.terminate()

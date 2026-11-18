exec(open('e112.py').read())
srv=subprocess.Popen([sys.executable,'-m','http.server','8921','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
        b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
        c=b.new_context(viewport={'width':768,'height':1024},has_touch=True,service_workers='block')
        c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        pg=c.new_page();pg.goto('http://localhost:8921/');pg.wait_for_timeout(2000)
        print(pg.evaluate("()=>{const t=document.querySelector('.top');return {html:getComputedStyle(document.documentElement).zoom,body:getComputedStyle(document.body).zoom,wrap:getComputedStyle(document.querySelector('.wrap')).zoom,top:getComputedStyle(t).zoom,rectH:t.getBoundingClientRect().height,cssH:getComputedStyle(t).height,gw:getComputedStyle(document.getElementById('gw')||document.body).zoom}}"))
        b.close()
finally: srv.terminate()

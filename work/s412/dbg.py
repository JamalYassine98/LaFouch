exec(open('e112.py').read())
srv=subprocess.Popen([sys.executable,'-m','http.server','8921','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':768,'height':1024},device_scale_factor=1,has_touch=True,service_workers='block')
    c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    c.add_init_script("localStorage.setItem('lf_cfg',%r);sessionStorage.setItem('lf_ni','1');addEventListener('DOMContentLoaded',()=>{%s})"%(cfg('natal'),PROP))
    pg=c.new_page();pg.goto('http://localhost:8921/');pg.wait_for_timeout(2500)
    pg.locator('#bagbtn').tap();pg.wait_for_timeout(1500)
    print(pg.evaluate("""()=>{const s=document.querySelector('#layer .scrim.pg'),t=document.querySelector('.top'),h=s.querySelector('h2');const cs=getComputedStyle;
    const ch=[];let x=h;while(x&&x!==s){ch.push(x.tagName+'.'+x.className+' pt'+cs(x).paddingTop+' mt'+cs(x).marginTop+' z'+cs(x).zoom);x=x.parentElement}
    return {evh:document.documentElement.style.getPropertyValue('--evh'),scrimTop:cs(s).top,scrimRect:s.getBoundingClientRect().top,sPt:cs(s).paddingTop,topZoom:cs(t).zoom,topTop:cs(t).top,ch:ch}}"""))
    b.close()
finally: srv.terminate()

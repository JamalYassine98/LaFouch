exec(open('e112.py').read())
srv=subprocess.Popen([sys.executable,'-m','http.server','8921','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    for prop in (False,True):
      b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
      c=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,service_workers='block')
      c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
      c.add_init_script("localStorage.setItem('lf_cfg',%r);sessionStorage.setItem('lf_ni','1');"%cfg('natal')+("addEventListener('DOMContentLoaded',()=>{%s})"%PROP if prop else ''))
      pg=c.new_page();pg.goto('http://localhost:8921/');pg.wait_for_timeout(2500)
      q="()=>Math.round(document.querySelector('#hdst').getBoundingClientRect().top)"
      a=pg.evaluate(q);pg.locator('#bagbtn').tap();pg.wait_for_timeout(1500);bb=pg.evaluate(q)
      pg.evaluate("()=>{window.__t=[];const t0=performance.now();(function f(){__t.push([Math.round(performance.now()-t0),Math.round(document.querySelector('#hdst').getBoundingClientRect().top),!!document.querySelector('#layer .scrim.pg')]);if(performance.now()-t0<900)requestAnimationFrame(f)})()}")
      print(pg.evaluate("()=>[...document.querySelectorAll('#layer .scrim.pg button,#layer .scrim.pg a')].filter(e=>e.offsetWidth).map(e=>e.className+':'+e.innerText.slice(0,20))"));pg.keyboard.press('Escape');pg.wait_for_timeout(1200)
      tr=pg.evaluate("()=>__t");seen=[];[seen.append(x) for x in tr if not seen or x[1:]!=seen[-1][1:]]
      print('prop' if prop else 'hoje','antes',a,'aberto',bb,'fechando',seen[:8]);b.close()
finally: srv.terminate()

from playwright.sync_api import sync_playwright
J1=r"""(()=>{let e=document.elementFromPoint(195,330);let o=[];while(e&&o.length<6){const r=e.getBoundingClientRect();o.push(e.tagName+'.'+e.className+' '+Math.round(r.top)+'/'+Math.round(r.height));e=e.parentElement}return o.join(' || ')})()"""
J2=r"""(()=>{const f=document.querySelector('.lfft');return f?f.outerHTML.replace(/<svg[\s\S]*?<\/svg>/g,'').slice(0,1400):''})()"""
J3=r"""(()=>{const h=document.querySelector('#home .hd');const r=h.getBoundingClientRect();const g=document.querySelector('#home .hgrid, #home .hn, #home [class*=nov]');return [Math.round(r.height), g?g.className+' '+getComputedStyle(g).gridTemplateColumns:'']})()"""
with sync_playwright() as p:
  b=p.chromium.launch();pg=b.new_page(viewport={'width':390,'height':844})
  pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
  pg.add_init_script("localStorage.setItem('lf_gzmudo','1')")
  pg.goto('http://localhost:8176/?ref=GR3350');pg.wait_for_timeout(3000);print(pg.evaluate(J1))
  pg.goto('http://localhost:8176/');pg.wait_for_timeout(3000);print(pg.evaluate(J2))
  pg2=b.new_page(viewport={'width':1366,'height':800});pg2.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
  pg2.goto('http://localhost:8176/');pg2.wait_for_timeout(3000);print(pg2.evaluate(J3))
  print(pg2.evaluate(r"""[...document.querySelectorAll('#home section, #home > *')].map(s=>s.tagName+'.'+s.className+'#'+s.id+':'+Math.round(s.getBoundingClientRect().height)).join(' | ')"""))
  b.close()

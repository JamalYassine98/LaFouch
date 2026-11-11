from playwright.sync_api import sync_playwright
J=r"""(()=>{let f=document.elementFromPoint(250,168);while(f&&f.getBoundingClientRect().width<350)f=f.parentElement;window.__F=f;let e=f.parentElement,o=[];while(e){const s=getComputedStyle(e);if(/(auto|scroll|hidden)/.test(s.overflowY+s.overflow))o.push(e.tagName+'.'+e.className+'#'+e.id+' oy:'+s.overflowY+' st:'+e.scrollTop);e=e.parentElement}return [f.tagName+'.'+f.className+'#'+f.id,getComputedStyle(f).position,Math.round(f.getBoundingClientRect().top),o.join(' | ')]})()"""
with sync_playwright() as p:
  b=p.chromium.launch();pg=b.new_page(viewport={'width':390,'height':844})
  pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
  pg.add_init_script("localStorage.setItem('lf_gzmudo','1')")
  pg.goto('http://localhost:8176/?r=lentes-de-sol');pg.wait_for_timeout(3000)
  print(pg.evaluate(J));pg.evaluate("document.querySelectorAll('#grid .card')[5].scrollIntoView()");pg.wait_for_timeout(800);print(pg.evaluate("Math.round(__F.getBoundingClientRect().top)"))
  b.close()

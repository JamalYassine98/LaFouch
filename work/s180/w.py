from playwright.sync_api import sync_playwright
with sync_playwright() as p:
  b=p.chromium.launch();x=b.new_page(viewport={'width':390,'height':844})
  x.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
  x.add_init_script("localStorage.setItem('lf_gzmudo','1')")
  x.goto('http://localhost:8180/?ref=SL2250');x.wait_for_timeout(3500)
  print(x.evaluate("""(()=>{const w=document.querySelector('a.wa'),s=getComputedStyle(w);return [w.getAttribute('style'),s.animationName,s.scale,s.translate,s.bottom,s.right,s.transform,document.documentElement.className,getComputedStyle(document.documentElement).getPropertyValue('--buyh'),[...document.styleSheets].length]})()"""))
  b.close()

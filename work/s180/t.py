from playwright.sync_api import sync_playwright
with sync_playwright() as p:
  b=p.chromium.launch(); errs=[]
  def pg(w,h,lang='es'):
    x=b.new_page(viewport={'width':w,'height':h},device_scale_factor=1);x.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
    x.on('pageerror',lambda e:errs.append(str(e)))
    x.add_init_script("localStorage.setItem('lf_gzmudo','1');localStorage.setItem('lf_ck','1');localStorage.setItem('lf_lang','%s')"%lang);return x
  for t,l in (('','es'),('natal','es'),('maes','pt'),('halloween','es'),('bf','pt')):
    x=pg(390,844,l);x.goto('http://localhost:8180/?evp='+t if t else 'http://localhost:8180/');x.wait_for_timeout(3500);x.screenshot(path='h_%s_%s.png'%(t or 'nada',l))
    x.goto('http://localhost:8180/?r=lentes-de-sol'+('&evp='+t if t else ''));x.wait_for_timeout(3500);x.screenshot(path='c_%s_%s.png'%(t or 'nada',l));x.close()
  x=pg(390,844);x.goto('http://localhost:8180/?ref=SL2250');x.wait_for_timeout(3500);x.screenshot(path='p_es.png')
  x=pg(390,844,'pt');x.goto('http://localhost:8180/?ref=SL2250');x.wait_for_timeout(3500);x.screenshot(path='p_pt.png')
  print('erros:',errs[:5])
  b.close()

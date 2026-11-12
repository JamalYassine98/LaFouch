from playwright.sync_api import sync_playwright
with sync_playwright() as p:
  b=p.chromium.launch()
  def pgn(w,h,d=2,init=''):
    pg=b.new_page(viewport={'width':w,'height':h},device_scale_factor=d);pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
    pg.add_init_script("localStorage.setItem('lf_gzmudo','1');localStorage.setItem('lf_ck','1');"+init);return pg
  pg=pgn(390,844);pg.goto('http://localhost:8178/?ref=SL2250');pg.wait_for_timeout(3500);pg.screenshot(path='a_prod_cel.png')
  pg=pgn(390,844);pg.goto('http://localhost:8178/?r=lentes-de-sol');pg.wait_for_timeout(3000);pg.evaluate("document.querySelectorAll('#grid .card')[5].scrollIntoView()");pg.wait_for_timeout(1200);pg.screenshot(path='a_sticky_cel.png')
  pg=pgn(390,844,2,'window.__vazio=1');pg.goto('http://localhost:8178/?r=lentes-de-sol');pg.wait_for_timeout(2500);pg.evaluate("document.getElementById('grid').innerHTML=''");pg.screenshot(path='a_skel_cel.png')
  pg=pgn(1366,800,1);pg.goto('http://localhost:8178/');pg.wait_for_timeout(3500);pg.screenshot(path='a_home_pc.png')
  pg=pgn(390,844);pg.goto('http://localhost:8178/');pg.wait_for_timeout(3000);pg.evaluate("document.querySelector('.lfft').scrollIntoView()");pg.wait_for_timeout(1500);pg.screenshot(path='a_foot_cel.png')
  b.close()

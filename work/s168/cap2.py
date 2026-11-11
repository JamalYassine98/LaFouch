from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':900,'height':1100},device_scale_factor=3)
    pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
    pg.add_init_script("localStorage.setItem('lf_gzmudo','1')")
    pg.goto('http://localhost:8160/');pg.wait_for_timeout(2500);pg.evaluate("window.__lfGzAbre()");pg.wait_for_timeout(9000)
    for i in range(8):
        r=pg.evaluate("""(()=>{const m=__LFGZ.Z.m.el;const keep=new Set();let e=m;while(e){keep.add(e);e=e.parentElement}
          const st=document.getElementById('xx')||document.head.appendChild(Object.assign(document.createElement('style'),{id:'xx'}));
          st.textContent='html,body,#gw,#gzstg{background:transparent!important}';
          document.querySelectorAll('body *').forEach(x=>{if(keep.has(x)||m.contains(x))return;if([...keep].some(k=>x.contains(k)))return;x.style.visibility='hidden'});
          document.querySelectorAll('body *').forEach(x=>{if(keep.has(x))x.style.visibility=''});
          const R=m.getBoundingClientRect();return [R.left,R.top,R.width,R.height]})()""")
        x,y,w,h=r;pad=w*.45
        pg.wait_for_timeout(600)
        pg.screenshot(path=f'n{i}.png',omit_background=True,clip={'x':max(0,x-pad),'y':max(0,y-pad*.6),'width':w+2*pad,'height':h+pad*1.2})
    b.close()

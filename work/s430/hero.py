exec(open('cap.py').read().split('with sync_playwright() as p:')[0])
with sync_playwright() as p:
    b=p.chromium.launch()
    for W,H in [(386,858),(768,1024),(1440,900)]:
        c=b.new_context(viewport={'width':W,'height':H},is_mobile=W<1000,has_touch=W<1000)
        c.route('**/js/lf-site.js*',lambda r:(lambda resp:r.fulfill(response=resp,body=resp.text().replace('function manut(){','function manut(){CFG.ativo=true;',1)))(r.fetch()))
        c.add_init_script(INIT);pg=c.new_page();pg.goto('https://lafouch.com/?cliente=1',wait_until='load');pg.wait_for_timeout(6000)
        print(W,H,pg.evaluate("()=>{const e=document.querySelector('#home .hdi');if(!e)return '-';let o=[];for(let x=e,i=0;x&&i<4;x=x.parentElement,i++){const r=x.getBoundingClientRect();o.push((x.className||x.tagName).toString().slice(0,18)+' '+Math.round(r.width)+'x'+Math.round(r.height)+' ('+(r.width/r.height).toFixed(2)+') fit:'+getComputedStyle(x).objectFit)}return o}"))
        pg.screenshot(path=f'hero_{W}.png');c.close()
    b.close()

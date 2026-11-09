from playwright.sync_api import sync_playwright
INIT="""(()=>{window.__an=[];const o=Element.prototype.animate;Element.prototype.animate=function(k,t){try{window.__an.push([Math.round(performance.now()),(this.id||this.className||this.tagName).toString().slice(0,30),typeof t==='object'?t.duration:t])}catch(_){}return o.apply(this,arguments)};
 window.__mut=[];new MutationObserver(m=>m.forEach(x=>{if(x.target.id==='home'||x.target.closest&&x.target.closest('#home')&&x.type==='childList'&&x.addedNodes.length>2)window.__mut.push([Math.round(performance.now()),x.target.id||x.target.className])})).observe(document,{childList:true,subtree:true})})()"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR');ctx.add_init_script(INIT)
    pg=ctx.new_page();pg.goto('http://localhost:8768/');pg.wait_for_timeout(3000)
    pg.evaluate("()=>{localStorage.setItem('lf_lastv',JSON.stringify({r:'BR44140',t:Date.now()-36e5}));localStorage.setItem('lf_uact',String(Date.now()-40*6e4));sessionStorage.clear()}")
    pg.reload();pg.wait_for_timeout(3500)
    a=pg.evaluate("window.__an");m=pg.evaluate("window.__mut")
    from collections import Counter
    c=Counter(x[1] for x in a);print('animações',len(a));[print('  ',k,v) for k,v in c.most_common(12)]
    print('home redesenhado',m[:12])
    print([x for x in a if x[0]<3000][:40])

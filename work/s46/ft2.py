from playwright.sync_api import sync_playwright
J="""()=>{window.__l=[];var t0=performance.now();var f=()=>{[...document.querySelectorAll('img.lfq0')].forEach(i=>{var r=i.getBoundingClientRect();if(r.width>0&&r.bottom>0&&r.top<innerHeight){var k=(i.closest('[id]')||{}).id+' '+(i.getAttribute('src')||'').slice(-40)+' ok:'+(i.dataset.lfqok||'')+' t:'+Math.round(performance.now()-t0);if(window.__l.length<30)window.__l.push(k)}});requestAnimationFrame(f)};f()}"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for run in range(3):
        ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,locale='pt-BR');pg=ctx.new_page()
        pg.goto('http://localhost:8768/?sim=2');pg.wait_for_timeout(3500)
        pg.reload();pg.evaluate(J);pg.wait_for_timeout(1500)
        print('run',run);[print('  ',x) for x in pg.evaluate("window.__l")]
        ctx.close()

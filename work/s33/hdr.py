from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for fix in (0,1):
      for y in (700,1800,3000):
        ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR');pg=ctx.new_page()
        cdp=ctx.new_cdp_session(pg);cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
        pg.goto('http://localhost:8768/');pg.wait_for_timeout(1800)
        if fix: pg.add_style_tag(content='html{scroll-behavior:auto!important}')
        pg.mouse.wheel(0,y);pg.wait_for_timeout(1200)
        pg.evaluate("document.querySelector('a[href=\"#rosto\"]').click()");pg.wait_for_timeout(1500)
        r=pg.evaluate("[Math.round(scrollY),Math.round(document.querySelector('.top').getBoundingClientRect().bottom)]")
        pg.evaluate("document.querySelector('#rosto [data-vback]').click()");pg.wait_for_timeout(1500)
        r2=pg.evaluate("Math.round(scrollY)")
        print('fix' if fix else 'hoje',y,'rosto: scrollY/topo',r,'| voltou y',r2);pg.screenshot(path='hdr_%d_%d.png'%(fix,y));ctx.close()

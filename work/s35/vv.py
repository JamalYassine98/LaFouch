from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR');pg=ctx.new_page()
    pg.goto('http://localhost:8768/');pg.wait_for_timeout(800)
    pg.evaluate("()=>{localStorage.setItem('lf_lastv',JSON.stringify({r:'GR3340',t:Date.now()-36e5}));localStorage.setItem('lf_uact',String(Date.now()-40*6e4));sessionStorage.clear()}")
    pg.reload();pg.wait_for_timeout(2500);a=pg.evaluate("!!document.querySelector('#home .hlv')")
    pg.reload();pg.wait_for_timeout(2500);b2=pg.evaluate("!!document.querySelector('#home .hlv')")
    pg.reload();pg.wait_for_timeout(2500);c=pg.evaluate("!!document.querySelector('#home .hlv')")
    pg.evaluate("document.querySelector('#home .hlv').click()");pg.wait_for_timeout(1500);pg.go_back();pg.wait_for_timeout(1000)
    pg.reload();pg.wait_for_timeout(2500);d=pg.evaluate("!!document.querySelector('#home .hlv')")
    print('visita nova',a,'| atualizar',b2,'| atualizar de novo',c,'| depois de tocar + atualizar',d)

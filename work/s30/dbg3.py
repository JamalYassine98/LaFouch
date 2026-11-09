from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR')
    pg.goto('http://localhost:8767/?logo2=1');pg.wait_for_timeout(2500)
    pg.evaluate("window.scrollTo(0,600)");pg.wait_for_timeout(500)
    pg.evaluate("document.querySelector(\"[data-open='GR3340']\").click()");pg.wait_for_timeout(1500)
    print(pg.evaluate("[scrollY,document.documentElement.className,getComputedStyle(document.documentElement).overflow,getComputedStyle(document.body).overflow,getComputedStyle(document.documentElement).scrollBehavior]"))
    pg.locator('.top .logo').first.tap();pg.wait_for_timeout(1500)
    print(pg.evaluate("[scrollY,document.documentElement.className,getComputedStyle(document.documentElement).overflow,getComputedStyle(document.body).overflow]"))
    print(pg.evaluate("(()=>{scrollTo({top:0,behavior:'instant'});var a=scrollY;return new Promise(r=>setTimeout(()=>r([a,scrollY,document.documentElement.scrollHeight,innerHeight]),600))})()"))

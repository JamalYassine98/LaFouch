from playwright.sync_api import sync_playwright
FIXBUY="@media (max-width:860px){html.lite body .pgm .buy{background:var(--bg)!important}}"
A="""html.lfpg #cmpbar{bottom:calc(var(--bh) + 10px)!important;left:16px!important;right:auto!important}"""
B="""html.lfpg #cmpbar{left:0!important;right:0!important;bottom:var(--bh)!important;border-radius:0!important;background:var(--bg)!important;color:var(--tx)!important;box-shadow:none!important;border-top:1px solid var(--ln);padding:6px 12px 6px 16px!important;font-size:14px!important;justify-content:space-between}
html.lfpg #cmpbar button{min-height:34px!important;font-size:14px!important}
html.lfpg #cmpbar .cl{color:var(--tx)!important;opacity:.6}"""
def run(b,ref,css,out,scroll,cmp=True):
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
    pg.goto('http://localhost:8766/'); pg.wait_for_timeout(2500)
    pg.evaluate("r=>document.querySelector('[data-open=\"'+r+'\"]').click()",ref); pg.wait_for_timeout(1600)
    if cmp: pg.evaluate("document.querySelector('.pgacts [data-cmp]').click()"); pg.wait_for_timeout(3800)
    if css: pg.add_style_tag(content=css)
    pg.evaluate("()=>{document.documentElement.classList.add('lfpg');var b=document.querySelector('.pgm .buy');document.documentElement.style.setProperty('--bh',b.getBoundingClientRect().height+'px')}")
    pg.evaluate("y=>{document.querySelector('#layer .scrim').scrollTop=y}",scroll); pg.wait_for_timeout(600)
    pg.screenshot(path=out); pg.close()
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    run(b,'GR3340',FIXBUY,'buy_depois.png',520,False)
    run(b,'SL2255',FIXBUY,'cmp_hoje2.png',380)
    run(b,'SL2255',FIXBUY+A,'cmp_A.png',380)
    run(b,'SL2255',FIXBUY+B,'cmp_B.png',380)

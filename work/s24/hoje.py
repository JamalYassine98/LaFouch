from playwright.sync_api import sync_playwright
def nova(b):
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
    pg.goto('http://localhost:8766/'); pg.wait_for_timeout(3000); return pg
def abre(pg,ref):
    pg.evaluate("r=>document.querySelector('[data-open=\"'+r+'\"]').click()",ref); pg.wait_for_timeout(1500)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    pg=nova(b); abre(pg,'SL2255')
    print(pg.evaluate("()=>[...document.querySelectorAll('.pgacts button')].map(b=>b.outerHTML.slice(0,160))"))
    pg.evaluate("()=>document.querySelector('.pgacts [data-cmp]').click()"); pg.wait_for_timeout(600)
    pg.evaluate("()=>{var s=document.querySelector('#layer .scrim');s.scrollTop=380}"); pg.wait_for_timeout(500)
    pg.screenshot(path='s24/cmp_hoje.png')
    pg=nova(b); abre(pg,'GR3340')
    pg.evaluate("()=>{var s=document.querySelector('#layer .scrim');s.scrollTop=520}"); pg.wait_for_timeout(500)
    pg.screenshot(path='s24/buy_hoje.png')
    print(pg.evaluate("()=>getComputedStyle(document.querySelector('.pgm .buy')).backgroundColor"))

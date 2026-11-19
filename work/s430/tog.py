exec(open('cap.py').read().split('with sync_playwright() as p:')[0])
with sync_playwright() as p:
    b=p.chromium.launch();c=ctx(b);pg=c.new_page()
    pg.goto('https://lafouch.com/?cliente=1&r=armazones',wait_until='load');pg.wait_for_selector('#grid .card .open',timeout=40000);pg.wait_for_timeout(1500)
    pg.evaluate("()=>document.querySelector('#grid .card .open').click()");pg.wait_for_timeout(2500)
    st=lambda:pg.evaluate("()=>{var b=document.querySelector('#layer [data-cmp]');return [b.className, (window.st?1:0)]}")
    for i in range(3):
        pg.locator('#layer [data-cmp]').first.tap();pg.wait_for_timeout(900);print(i,st())
    b.close()

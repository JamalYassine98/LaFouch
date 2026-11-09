from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for u in ('?sim=1',):
        pg=b.new_page(viewport={'width':390,'height':844},is_mobile=True,locale='pt-BR');pg.goto('http://localhost:8768/'+u);pg.wait_for_timeout(1000)
        pg.evaluate("window.__i=document.querySelector('#home .hdi img, #home img');window.__h=document.getElementById('home').innerHTML.length;window.__c=[...document.querySelectorAll('#home .hc')][0]")
        pg.wait_for_timeout(1500)
        print(u,pg.evaluate("[window.__i===document.querySelector('#home .hdi img, #home img'), window.__c===[...document.querySelectorAll('#home .hc')][0], document.querySelector('#home .hc .hp').textContent, document.querySelectorAll('#home img.lfq0').length]"))

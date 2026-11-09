from playwright.sync_api import sync_playwright
exec(open('s46/nav.py').read().split('CEN=')[0])
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR');pg.on('pageerror',lambda e:print('ERR',e))
    pg.goto('http://localhost:8768/');pg.wait_for_timeout(2300)
    pg.evaluate(M);pg.wait_for_timeout(700);pg.evaluate(item('Leitura'));pg.wait_for_timeout(1500)
    pg.evaluate("document.getElementById('gzf').click()");pg.wait_for_timeout(1200);print('faixa:',pg.evaluate(W),pg.evaluate("document.querySelector('#gw .gzbk').innerText"))
    pg.evaluate("document.querySelector('#gw .gzbk').click()");pg.wait_for_timeout(1000);print('‹ :',pg.evaluate(W))
    pg.go_back();pg.wait_for_timeout(1000);print('voltar:',pg.evaluate(W))
    # menu screen: tocar no ‹ Início
    pg.evaluate("document.querySelector('a[href=\"#vitrine\"]')&&0");pg.evaluate(M);pg.wait_for_timeout(700);pg.evaluate(item('Atacado'));pg.wait_for_timeout(1500)
    pg.evaluate("document.querySelector('.sec.pop [data-vback]').click()");pg.wait_for_timeout(1000);print('Atacado ‹ :',pg.evaluate(W),pg.evaluate('history.length'))

from playwright.sync_api import sync_playwright
exec(open('s46/nav.py').read().split('CEN=')[0])
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for url in ['/?r=atacado','/?r=catalogo','/?r=formato','/?ref=GR3340']:
        pg=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR');pg.on('pageerror',lambda e:print('ERR',e))
        pg.goto('http://localhost:8768'+url);pg.wait_for_timeout(3000);print('##',url,'→',pg.evaluate(W))
        pg.evaluate("(document.querySelector('.sec.pop [data-vback]')||{click(){}}).click()");pg.wait_for_timeout(1000);print('  toque ‹ →',pg.evaluate(W))
        pg2=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR');pg2.goto('http://localhost:8768'+url);pg2.wait_for_timeout(3000)
        for k in range(3):
            try: pg2.go_back(timeout=2500);pg2.wait_for_timeout(1000)
            except Exception as e: print('  voltar: SAIU');break
            if not pg2.url.startswith('http'):print('  voltar %d: SAIU DO SITE'%(k+1));break
            print('  voltar %d:'%(k+1),pg2.evaluate(W))

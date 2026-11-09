from playwright.sync_api import sync_playwright
src=open('s46/peca.py').read()
INIT=src.split('pg.add_init_script(')[1].split(')\n')[0]
S="location.pathname+' st:'+JSON.stringify(history.state)+' len:'+history.length+' pop:'+((document.querySelector('.sec.pop')||{}).id||'')"
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR')
    pg.add_init_script(eval(INIT))
    pg.on('console',lambda m:print('  ',m.text[:200]) if m.text[:4] in('POP ','PUSH','REPL','BACK') else None)
    pg.goto('http://localhost:8768/?ref=GR3340');pg.wait_for_timeout(3500);print(pg.evaluate(S))
    for k in range(2):
        print('>>BACK');pg.go_back(timeout=2500);pg.wait_for_timeout(1300);print(pg.evaluate(S))

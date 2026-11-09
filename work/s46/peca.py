from playwright.sync_api import sync_playwright
exec(open('s46/nav.py').read().split('CEN=')[0])
S="location.pathname+' st:'+JSON.stringify(history.state)+' len:'+history.length+' pop:'+((document.querySelector('.sec.pop')||{}).id||'')+' drw:'+document.getElementById('drw').classList.contains('on')"
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR')
    pg.on('pageerror',lambda e:print('ERR',e))
    pg.add_init_script("addEventListener('popstate',e=>console.log('POP '+JSON.stringify(e.state)));const _p=history.pushState;history.pushState=function(s){console.log('PUSH '+JSON.stringify(s));return _p.apply(this,arguments)};const _r=history.replaceState;history.replaceState=function(s){console.log('REPL '+JSON.stringify(s));return _r.apply(this,arguments)};const _b=history.back;history.back=function(){console.log('BACK '+new Error().stack.split('\\n')[2]);return _b.apply(this,arguments)}")
    pg.on('console',lambda m:print('  ',m.text[:200]) if m.text[:4] in('POP ','PUSH','REPL','BACK') else None)
    pg.goto('http://localhost:8768/');pg.wait_for_timeout(2300)
    for a in ["document.querySelector(\"[data-open='GR3340']\").click()",M,item('Atacado')]:
        print('>>',a[:50]);pg.evaluate(a);pg.wait_for_timeout(1300);print(pg.evaluate(S))
    if 1:
     for k in range(3):
        print('>> BACK');pg.go_back(timeout=2500);pg.wait_for_timeout(1000);print(pg.evaluate(S))

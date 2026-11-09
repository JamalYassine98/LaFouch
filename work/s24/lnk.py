from playwright.sync_api import sync_playwright
W=open('s24/voltar.py').read().split('WHERE=')[1].split('\ndef nova')[0]
WHERE=eval(W)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR')
    pg.goto('http://localhost:8768/?ref=GR3340');pg.wait_for_timeout(3500)
    print('entrou',pg.evaluate(WHERE),pg.evaluate('history.length'))
    pg.go_back();pg.wait_for_timeout(1500);print('voltar1',pg.evaluate(WHERE))
    try:
        pg.go_back(timeout=3000);pg.wait_for_timeout(1000);print('voltar2',pg.evaluate(WHERE))
    except Exception as e: print('voltar2 sai',str(e)[:60])
    # drawer -> catálogo -> voltar
    pg=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR')
    pg.goto('http://localhost:8768/');pg.wait_for_timeout(2500)
    pg.evaluate("document.querySelector('[data-dopen],#mbtn,.bar [aria-label*=enu]').click()");pg.wait_for_timeout(900)
    print('menu',pg.evaluate("[...document.querySelectorAll('#drw nav a')].map(a=>a.textContent.trim()+'='+a.getAttribute('href')).slice(0,6).join(' | ')"))
    pg.evaluate("[...document.querySelectorAll('#drw nav a')].find(a=>/vitrine|catalogo|grau/.test(a.getAttribute('href')||'')).click()");pg.wait_for_timeout(1500)
    print('menu→cat',pg.evaluate(WHERE))
    pg.go_back();pg.wait_for_timeout(1500);print('voltar',pg.evaluate(WHERE))
    try: pg.go_back(timeout=2500);pg.wait_for_timeout(800);print('voltar2',pg.evaluate(WHERE))
    except Exception as e: print('voltar2 sai')
    # favoritos folha -> peça -> voltar
    pg=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR')
    pg.add_init_script("localStorage.setItem('lf_fav',JSON.stringify({GR3340:1,SL2255:1}))")
    pg.goto('http://localhost:8768/');pg.wait_for_timeout(2500)
    pg.evaluate("document.querySelector(\"[data-open='GR3340']\").click()");pg.wait_for_timeout(1500)
    pg.evaluate("document.querySelector('[data-pgfav]').click()");pg.wait_for_timeout(900)
    pg.evaluate("document.querySelector('#fvs [data-fsopen=\"SL2255\"]').click()");pg.wait_for_timeout(1800)
    print('fav→peça',pg.evaluate(WHERE))
    pg.go_back();pg.wait_for_timeout(1500);print('voltar',pg.evaluate(WHERE))
    pg.go_back();pg.wait_for_timeout(1500);print('voltar2',pg.evaluate(WHERE))

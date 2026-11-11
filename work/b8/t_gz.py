import sys,json
from playwright.sync_api import sync_playwright
LANG=sys.argv[1] if len(sys.argv)>1 else 'pt'
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=document-user-activation-required'])  # política de som padrão (sem toque = som bloqueado)
    c=b.new_context(viewport={'width':390,'height':844},locale='es-PY' if LANG=='es' else 'pt-BR',has_touch=True,is_mobile=True)
    c.add_init_script("localStorage.setItem('lf_lang','%s');(function(){var P=HTMLMediaElement.prototype.play;window.__au=[];var SP=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=function(u){window.__au.push([Math.round(performance.now()),'VOZ DO CELULAR: '+u.text.slice(0,40)]);return SP(u)};HTMLMediaElement.prototype.play=function(){var s=this.src.split('/').pop();var r=P.call(this);window.__au.push([Math.round(performance.now()),s,'play']);if(r&&r.catch)r.catch(function(e){window.__au.push([Math.round(performance.now()),s,'BLOQUEADO '+e.name])});return r}})()"%LANG)
    pg=c.new_page()
    import time
    def rt(r):
        u=r.request.url
        if 'localhost' not in u: return r.abort()
        if 'lista.json' in u or '/media/voz/' in u: time.sleep(1.2)
        r.continue_()
    pg.route('**/*',rt)
    pg.goto('http://localhost:8160/');pg.wait_for_timeout(2500)
    pg.tap('#home [data-gzopen]') if pg.locator('#home [data-gzopen]').count() else pg.evaluate("window.__lfGzAbre()")
    for i in range(4):
        pg.wait_for_timeout(120);pg.screenshot(path='/home/claude/lafouch/work/b8/gz_a%d.png'%i)
    pg.wait_for_timeout(6000)
    print('1a vez, sons:',pg.evaluate("window.__au.slice(0,6)"))
    print('url:',pg.url)
    pg.goto('http://localhost:8160/descubra-o-grau.html');
    for i in range(8):
        pg.wait_for_timeout(150);pg.screenshot(path='/home/claude/lafouch/work/b8/gz_r%d.png'%i)
    pg.wait_for_timeout(6000)
    print('depois de atualizar, sons:',pg.evaluate("window.__au.slice(0,8)"))
    print('balão:',pg.evaluate("(document.getElementById('gzbal')||{}).innerText||''")[:200])
    b.close()

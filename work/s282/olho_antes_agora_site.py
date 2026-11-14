import subprocess, sys, time
from playwright.sync_api import sync_playwright
from PIL import Image
OLHO = open('/home/claude/lafouch/work/kit/olho.js').read(); ims = []
for nome, pasta, porta in (('antes', '/tmp/kitsite', 8811), ('agora', '/tmp/site_novo', 8812)):
    srv = None
    if porta == 8812: srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8812', '-d', pasta], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
    else: subprocess.run('bash /tmp/srv.sh >/dev/null 2>&1', shell=True)
    try:
        with sync_playwright() as pw:
            b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
            for W, H in ((390, 844), (820, 1180), (1366, 768), (2560, 1440)):
                c = b.new_context(viewport={'width': W, 'height': H}, is_mobile=W < 700, has_touch=W < 1100, service_workers='block', locale='es-PY'); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
                pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:100])); pg.goto('http://localhost:%d/?r=tienda' % porta); pg.wait_for_selector('#grid .card .fav', timeout=30000, state='attached'); pg.wait_for_timeout(2500)
                o = {x['r']: x['n'] for x in pg.evaluate(OLHO) if x['r'] not in ('elástico na borda',)}
                inf = pg.evaluate("(()=>{const f=document.querySelector('#grid .card .fav'),r=f.getBoundingClientRect(),s=getComputedStyle(f),u=document.querySelector('#grid .card .ulin'),ur=u&&u.getBoundingClientRect(),pe=u&&u.closest('.card').querySelector('.ph'),ph=pe?pe.getBoundingClientRect():{left:0,top:0,bottom:0};return ['fav '+Math.round(r.width)+'x'+Math.round(r.height)+' fundo '+s.backgroundColor, document.querySelectorAll('#grid .card .ulin').length+' etiquetas'+(u?' · dentro da foto: '+(ur.left>=ph.left&&ur.bottom<=ph.bottom+1&&ur.top>=ph.top)+' · '+u.textContent+' '+Math.round(ur.width)+'x'+Math.round(ur.height):'')]})()")
                if nome == 'agora' and W in (390, 1366):
                    pg.evaluate("(()=>{const u=document.querySelector('#grid .card .ulin');(u||document.querySelector('#grid .card')).scrollIntoView({block:'center'})})()"); pg.wait_for_timeout(400); pg.screenshot(path='/tmp/s282.png'); ims.append(Image.open('/tmp/s282.png').convert('RGB'))
                if nome == 'agora' and W == 390:
                    pg.evaluate("scrollTo(0,0)"); pg.wait_for_timeout(300); pg.evaluate("document.querySelectorAll('#grid .card .fav')[0].click()"); pg.wait_for_timeout(40)
                    print('  favoritar 1º:', pg.evaluate("(()=>{const as=document.getAnimations().filter(a=>a.effect.getComputedTiming().iterations!==Infinity&&a.effect.target&&(a.effect.target.closest('.favfly,#bagbtn,#ftog')));return as.length+' animações, fim em '+Math.round(Math.max(...as.map(a=>{const t=a.effect.getComputedTiming();return t.delay+t.duration})))+' ms · voando: '+document.querySelectorAll('.favfly').length})()")); pg.wait_for_timeout(1300)
                    pg.evaluate("document.querySelectorAll('#grid .card .fav')[1].click()"); pg.wait_for_timeout(40); print('  favoritar 2º:', pg.evaluate("document.querySelectorAll('.favfly').length")); pg.wait_for_timeout(1300)
                    print('  depois: sobras', pg.evaluate("document.querySelectorAll('.favfly,.favgh').length"), '· contador', pg.evaluate("(()=>{const f=document.querySelector('#ftog');return f?(f.hidden?'escondido':f.textContent.trim().slice(0,20)):'sem'})()"), '· ligados', pg.evaluate("document.querySelectorAll('#grid .card .fav.on').length"))
                    pg.evaluate("document.querySelectorAll('#grid .card .fav')[0].click()"); pg.wait_for_timeout(1600); pg.evaluate("document.querySelectorAll('#grid .card .fav')[1].click()"); pg.wait_for_timeout(1600); print('  desfavoritar os dois: ligados', pg.evaluate("document.querySelectorAll('#grid .card .fav.on').length"), 'sobras', pg.evaluate("document.querySelectorAll('.favfly,.favgh').length"))
                print(nome, W, o, inf, er[:2], flush=True); c.close()
    finally:
        if srv: srv.terminate()
B = Image.new('RGB', (390 + 1366 + 10, 844), 'white'); x = 0
for im in ims: B.paste(im, (x, 0)); x += im.width + 10
B = B.resize((B.width * 2 // 3, B.height * 2 // 3)); B.save('/tmp/s282.jpg', quality=80)

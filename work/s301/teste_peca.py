import subprocess, sys, time
from playwright.sync_api import sync_playwright
OLHO = open('/home/claude/lafouch/work/kit/olho.js').read()
subprocess.run('bash /tmp/srv.sh >/dev/null 2>&1', shell=True)
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8812', '-d', '/tmp/site_novo'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
EST = "(()=>{const b=document.querySelector('#layer .pgm .big');if(!b)return null;const v=b.querySelector('video.ggv'),p=b.querySelector('.ggp'),im=b.querySelector('img.pf');return {gg:b.classList.contains('gg'),t:v?+v.currentTime.toFixed(3):null,pil:p?[p.textContent,p.classList.contains('on'),p.classList.contains('dica')]:null,pontos:[...b.querySelectorAll('.ggd i')].map(i=>i.classList.contains('on')?1:0).join(''),zm:b.classList.contains('zm'),img:im?getComputedStyle(im).visibility:null,g360:!!b.querySelector('.g360'),zh:b.querySelector('.zh')?getComputedStyle(b.querySelector('.zh')).display:null}})()"
try:
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
        for W, H in ((390, 844), (820, 1180), (1366, 768), (2560, 1440)):
            R = {}
            for nome, url in (('antes', 'http://localhost:8811/?ref=SL2300'), ('agora sem giro', 'http://localhost:8812/?ref=SL2300'), ('agora com giro', 'http://localhost:8812/?ref=SL2300&ggteste=1')):
                c = b.new_context(viewport={'width': W, 'height': H}, is_mobile=W < 700, has_touch=W < 1100, service_workers='block', locale='es-PY'); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
                c.add_init_script("sessionStorage.setItem('ggteste','1')") if 'ggteste' in url else None; pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:120])); pg.goto(url.split('?')[0]); pg.wait_for_timeout(3000); pg.evaluate("(()=>{const a=document.querySelector('#grid [data-open], [data-open]');a&&a.click()})()"); pg.wait_for_timeout(3200)
                o = {x['r']: x['n'] for x in pg.evaluate(OLHO) if x['r'] != 'elástico na borda'}; e0 = pg.evaluate(EST); R[nome] = (o, e0)
                if nome == 'agora com giro':
                    r = pg.evaluate("(()=>{const r=document.querySelector('#layer .pgm .big').getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()"); cx = r[0] + r[2] / 2; cy = r[1] + r[3] / 2
                    pg.mouse.move(cx + 80, cy); pg.mouse.down()
                    for k in range(30): pg.mouse.move(cx + 80 - k * 5, cy); pg.wait_for_timeout(16)
                    pg.mouse.up(); pg.wait_for_timeout(1600); e1 = pg.evaluate(EST)
                    if W in (390, 1366): pg.screenshot(path='/tmp/s301_%d.png' % W)
                    pg.click('#layer .pgm .big .ggp'); pg.wait_for_timeout(900); e2 = pg.evaluate(EST)
                    pg.mouse.click(cx, cy - 20); pg.wait_for_timeout(600); e3 = pg.evaluate(EST); pg.mouse.click(cx, cy - 20); pg.wait_for_timeout(600); e4 = pg.evaluate(EST)
                    print(W, 'aberta', e0, '\n   girada', e1, '\n   vista inicial', e2, '\n   toque amplia', e3['zm'], '· toque de novo', e4['zm'], '· erros', er[:2], flush=True)
                else: print(W, nome, e0, 'erros', er[:1], flush=True)
                c.close()
            print(W, 'olho antes', R['antes'][0], '· sem giro', R['agora sem giro'][0], '· com giro', R['agora com giro'][0], flush=True)
finally: srv.terminate()

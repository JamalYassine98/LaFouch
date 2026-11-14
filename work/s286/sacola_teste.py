import subprocess, sys, time
from playwright.sync_api import sync_playwright
OLHO = open('/home/claude/lafouch/work/kit/olho.js').read()
subprocess.run('bash /tmp/srv.sh >/dev/null 2>&1', shell=True)
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8812', '-d', '/tmp/site_novo'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
POS = "(()=>{const p=document.querySelector('#layer .scrim.pg');if(!p)return null;const r=p.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height),getComputedStyle(p).transform,document.documentElement.scrollWidth-innerWidth]})()"
try:
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
        for W, H in ((390, 844), (820, 1180), (1366, 768), (2560, 1440)):
            R = {}
            for nome, porta in (('antes', 8811), ('agora', 8812)):
                c = b.new_context(viewport={'width': W, 'height': H}, is_mobile=W < 700, has_touch=W < 1100, service_workers='block', locale='es-PY'); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
                pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:100])); pg.goto('http://localhost:%d/' % porta); pg.wait_for_timeout(2800)
                pg.evaluate("document.querySelector('#bagbtn').click()"); pg.wait_for_timeout(150); meio = pg.evaluate(POS); pg.wait_for_timeout(800)
                o = {x['r']: x['n'] for x in pg.evaluate(OLHO) if x['r'] != 'elástico na borda'}; R[nome] = (pg.evaluate(POS), o)
                if nome == 'agora':
                    if W in (390, 1366): pg.screenshot(path='/tmp/s286b_%d.png' % W)
                    trava = pg.evaluate("document.documentElement.classList.contains('lock')")
                    pg.keyboard.press('Escape'); pg.wait_for_timeout(120)
                    sai = pg.evaluate("(()=>{const g=document.querySelector('#lfGhost .scrim');if(!g)return null;const r=g.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),getComputedStyle(g).opacity,document.documentElement.scrollWidth-innerWidth]})()"); pg.wait_for_timeout(500)
                    fim = pg.evaluate("[!!document.querySelector('#lfGhost'), document.querySelector('#layer').innerHTML.length, document.documentElement.classList.contains('lock'), location.hash]")
                    pg.evaluate("document.querySelector('#bagbtn').click()"); pg.wait_for_timeout(90); pg.keyboard.press('Escape'); pg.wait_for_timeout(60); pg.evaluate("document.querySelector('#bagbtn').click()"); pg.wait_for_timeout(900)
                    rap = pg.evaluate(POS)
                    pg.go_back(); pg.wait_for_timeout(700); volta = pg.evaluate("[document.querySelector('#layer').innerHTML.length, !!document.querySelector('#lfGhost'), document.documentElement.classList.contains('lock')]")
                    print(W, '150 ms da entrada', meio, '· trava', trava, '· 120 ms da saída (x, y, opac, sobra lateral)', sai, '· fim (fantasma, camada, trava, hash)', fim, '· abre-fecha-abre', rap, '· voltar do celular', volta, 'erros', er[:2], flush=True)
                c.close()
            print(W, 'antes', R['antes'][0], 'agora', R['agora'][0], '· olho antes', R['antes'][1], 'agora', R['agora'][1], flush=True)
finally: srv.terminate()

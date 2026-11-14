import subprocess, sys, time
from playwright.sync_api import sync_playwright
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8841', '-d', '/tmp/cf'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
try:
    with sync_playwright() as pw:
        for nome in ('cam_g8', 'cam_v'):
            b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-video-capture=/tmp/cf/%s.mjpeg' % nome])
            c = b.new_context(viewport={'width': 915, 'height': 412}, is_mobile=True, has_touch=True, permissions=['camera']); pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:120]))
            pg.goto('http://localhost:8841/pg/conferir.html?t=4'); pg.wait_for_timeout(400); pg.click('#go'); pg.wait_for_timeout(4000); seq = []
            for k in range(24):
                seq.append(pg.evaluate("(()=>{const r=window.__conf.r,m=window.__conf.m;return [r.itens.filter(i=>i.ok===false).map(i=>i.id).join('+')||'ok', m.peca?+((m.peca.x1-m.peca.x0)/640).toFixed(3):null]})()")); pg.wait_for_timeout(500)
            tro = sum(1 for a, b2 in zip(seq, seq[1:]) if a[0] != b2[0]); ls = [s[1] for s in seq if s[1]]
            print(nome, 'em 12 s: veredito mudou', tro, 'vezes ·', sorted(set(s[0] for s in seq)), '· largura medida min/máx', min(ls), max(ls), '· frase:', pg.evaluate("document.getElementById('fr').textContent"))
            g = pg.evaluate("(()=>{const q=s=>{const r=document.querySelector(s).getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom)]};return {cam:q('#cam'),lista:q('#it'),barra:q('#bar'),frase:q('#fr'),tela:[innerWidth,innerHeight]}})()"); print('  lugares:', g, 'erros', er[:2])
            pg.screenshot(path='/tmp/cf/est_%s.png' % nome); c.close(); b.close()
finally: srv.terminate()

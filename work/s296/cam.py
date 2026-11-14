import subprocess, sys, time
from playwright.sync_api import sync_playwright
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8841', '-d', '/tmp/cf'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
try:
    with sync_playwright() as pw:
        for nome in ('cam_v', 'cam_d'):
            b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-video-capture=/tmp/cf/%s.mjpeg' % nome])
            for W, H in ((844, 390), (390, 844)):
                c = b.new_context(viewport={'width': W, 'height': H}, is_mobile=True, has_touch=True, permissions=['camera']); pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:120]))
                pg.goto('http://localhost:8841/pg/conferir.html'); pg.wait_for_timeout(500); pg.click('#go'); pg.wait_for_timeout(4500)
                print(nome, W, pg.evaluate("(()=>{const r=window.__conf&&window.__conf.r;return r?[r.frase,r.itens.filter(i=>i.ok!==true).map(i=>i.id+(i.ok===null?'?':'x')).join(' '),document.getElementById('v').videoWidth]:'sem medida'})()"), 'sobra lateral', pg.evaluate("document.documentElement.scrollWidth-innerWidth"), 'erros', er[:2])
                pg.screenshot(path='/tmp/cf/tela_%s_%d.png' % (nome, W)); c.close()
            b.close()
finally: srv.terminate()

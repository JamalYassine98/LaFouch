import subprocess, sys, time
from playwright.sync_api import sync_playwright
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8841', '-d', '/tmp/cf'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
try:
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-video-capture=/tmp/cf/cam_v.mjpeg'])
        for W, H in ((844, 390), (390, 844)):
            c = b.new_context(viewport={'width': W, 'height': H}, is_mobile=True, has_touch=True, permissions=['camera'], accept_downloads=True); pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:120]))
            pg.goto('http://localhost:8841/pg/conferir.html?t=4'); pg.wait_for_timeout(400); pg.click('#go'); pg.wait_for_timeout(3500)
            print(W, 'antes:', pg.evaluate("[document.getElementById('gr').textContent, window.__conf&&window.__conf.r.frase]"))
            pg.click('#gr'); pg.wait_for_timeout(1500); print('  gravando:', pg.evaluate("[document.getElementById('pt').textContent, document.getElementById('fr').textContent, document.getElementById('pa').hidden]")); pg.screenshot(path='/tmp/cf/grav_%d.png' % W)
            pg.wait_for_timeout(4500); print('  fim:', pg.evaluate("[window.__grav, document.getElementById('tm').textContent, document.getElementById('sv').hidden, document.getElementById('fr').textContent]"))
            with pg.expect_download() as d: pg.click('#sv')
            p = d.value.path(); print('  baixado:', d.value.suggested_filename, subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name,width,height,avg_frame_rate:format=duration', '-of', 'default=nw=1', str(p)], capture_output=True, text=True).stdout.replace('\n', ' '))
            pg.click('#dn'); pg.wait_for_timeout(1200); print('  de novo:', pg.evaluate("[document.getElementById('gr').hidden, window.__conf&&window.__conf.r.frase]"), 'sobra lateral', pg.evaluate("document.documentElement.scrollWidth-innerWidth"), 'erros', er[:2]); c.close()
finally: srv.terminate()

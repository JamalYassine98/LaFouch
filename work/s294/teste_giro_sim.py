import subprocess, sys, time
from playwright.sync_api import sync_playwright
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8831', '-d', '/tmp/gt'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
try:
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
        for W, H, mob in ((390, 844, True), (1366, 768, False)):
            c = b.new_context(viewport={'width': W, 'height': H}, is_mobile=mob, has_touch=mob, device_scale_factor=2 if mob else 1)
            pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:120])); pg.goto('http://localhost:8831/'); pg.wait_for_timeout(2600)
            print(W, 'aberto', pg.evaluate("window.__giro.estado()"), pg.evaluate("document.getElementById('tA').textContent"), pg.evaluate("document.getElementById('v').currentSrc.split('/').pop()"))
            r = pg.evaluate("(()=>{const r=document.getElementById('pal').getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()"); cx = r[0] + r[2] / 2; cy = r[1] + r[3] / 2
            pg.mouse.move(cx + 100, cy); pg.mouse.down()
            for k in range(40): pg.mouse.move(cx + 100 - k * 6, cy); pg.wait_for_timeout(16)
            pg.mouse.up(); pg.wait_for_timeout(1500)
            print('  depois de arrastar', pg.evaluate("window.__giro.estado()"), '· fps', pg.evaluate("document.getElementById('tF').textContent"), '· atraso', pg.evaluate("document.getElementById('tL').textContent"), '· pílula', pg.evaluate("[document.getElementById('pil').textContent, document.getElementById('pil').classList.contains('on')]"))
            pg.screenshot(path='/tmp/gt_%d_b.png' % W)
            pg.click('#pil'); pg.wait_for_timeout(900); print('  vista inicial', pg.evaluate("window.__giro.estado()"))
            pg.click('#mA'); pg.wait_for_timeout(15000); print('  modo 2', pg.evaluate("document.getElementById('tD').textContent"), pg.evaluate("window.__giro.estado()"))
            pg.mouse.move(cx + 100, cy); pg.mouse.down()
            for k in range(40): pg.mouse.move(cx + 100 - k * 6, cy); pg.wait_for_timeout(16)
            pg.mouse.up(); pg.wait_for_timeout(1200)
            print('  modo 2 arrastado · fps', pg.evaluate("document.getElementById('tF').textContent"), '· atraso', pg.evaluate("document.getElementById('tL').textContent"), 'rolagem lateral', pg.evaluate("document.documentElement.scrollWidth-innerWidth"), 'erros', er[:2])
            pg.screenshot(path='/tmp/gt_%d_a.png' % W, full_page=True); c.close()
finally: srv.terminate()

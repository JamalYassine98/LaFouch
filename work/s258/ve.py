# S258 · Estúdio: fotos das telas (Estúdio, ajuda, câmera com câmera falsa, giro) para estudar o desenho.  python3 ve.py
import os, subprocess, sys, time
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
from PIL import Image
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8881', '-d', A + '../../www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'])
    c = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, service_workers='block', permissions=['camera']); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg = c.new_page(); pg.on('dialog', lambda d: d.dismiss()); erros = []; pg.on('pageerror', lambda e: erros.append(str(e)[:100])); pg.goto('http://localhost:8881/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(900)
    pg.evaluate("()=>{const t=[...document.querySelectorAll('#v-inicio .tl')].find(e=>/Estúdio/.test(e.innerText));t.click()}"); pg.wait_for_timeout(1200); pg.screenshot(path='/tmp/est1.png')
    txt = lambda: pg.evaluate("()=>{const o=document.querySelector('.estOv');return o?[...o.querySelectorAll('button,[data-e]')].filter(e=>e.getClientRects().length).map(e=>(e.dataset.e||'')+':'+(e.innerText||e.getAttribute('aria-label')||'').trim().replace(/\\s+/g,' ').slice(0,26)).join(' | '):'sem estOv'}")
    print('ESTÚDIO:', txt()); print('texto:', pg.evaluate("()=>(document.querySelector('.estOv')||{}).innerText").replace('\n', ' / ')[:700])
    pg.evaluate("()=>document.querySelector('.estOv [data-e=ajuda]').click()"); pg.wait_for_timeout(900); pg.screenshot(path='/tmp/est2.png'); print('AJUDA:', pg.evaluate("()=>[...document.querySelectorAll('button')].filter(e=>e.getClientRects().length&&e.getBoundingClientRect().top>0).map(e=>(e.innerText||e.getAttribute('aria-label')||'').trim().replace(/\\s+/g,' ').slice(0,28)).slice(0,30).join(' | ')")[:900])
    pg.keyboard.press('Escape'); pg.wait_for_timeout(500)
    pg.evaluate("()=>{const o=document.querySelector('.estOv');const b=[...o.querySelectorAll('button')].find(e=>/fotograf|nova peça|começar|sessão/i.test(e.innerText));b&&b.click()}"); pg.wait_for_timeout(2500); pg.screenshot(path='/tmp/est3.png')
    print('CÂMERA:', pg.evaluate("()=>[...document.querySelectorAll('button')].filter(e=>e.getClientRects().length).map(e=>(e.innerText||e.getAttribute('aria-label')||'').trim().replace(/\\s+/g,' ').slice(0,22)).slice(0,40).join(' | ')")[:900]); print('erros', erros)
    ims = [Image.open('/tmp/est%d.png' % i) for i in (1, 2, 3)]; J = Image.new('RGB', (1170, 844))
    for i, x in enumerate(ims): J.paste(x.resize((390, 844)), (390 * i, 0))
    J.save('/tmp/est.jpg', quality=82)
finally: srv.terminate()

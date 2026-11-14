import subprocess, sys, time
from playwright.sync_api import sync_playwright
from PIL import Image
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8881', '-d', '/home/claude/lafouch/www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1); ims = []
OLHO = open('/home/claude/lafouch/work/kit/olho.js').read()
try:
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'])
        for sc in ('light', 'dark'):
            c = b.new_context(viewport={'width': 390, 'height': 844}, color_scheme=sc, is_mobile=True, has_touch=True, service_workers='block', permissions=['camera']); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
            pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:90])); pg.goto('http://localhost:8881/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(700)
            def foto(): pg.screenshot(path='/tmp/s270.png'); ims.append(Image.open('/tmp/s270.png').convert('RGB'))
            T = lambda: pg.evaluate("(()=>{const b=[...document.querySelectorAll('.fnBar')].find(x=>x.getBoundingClientRect().width);return b?[b.dataset.modo,[...b.querySelectorAll('.fnTabs button')].map(x=>x.textContent).join('/'),[...b.querySelectorAll('.fnLk')].map(x=>x.textContent).join(' | '),!!document.querySelector('.fnFab')]:'sem barra'})()")
            pg.evaluate("window.__LF.setView('vendas')"); pg.wait_for_timeout(900); pg.evaluate("window.scrollTo(0,900)"); pg.wait_for_timeout(300); pg.evaluate("document.querySelector('#vRows .pcard[data-ref=SL2201]').click()"); pg.wait_for_timeout(1200); print(sc, 'CATÁLOGO›peça', T(), 'view', pg.evaluate("window.__LF.S.view")); o1 = {x['r']: x['n'] for x in pg.evaluate(OLHO)}; foto()
            pg.evaluate("[...document.querySelectorAll('.fnLk')].find(x=>x.getBoundingClientRect().width).click()"); pg.wait_for_timeout(1200); print(sc, 'depois de Ver a ficha', T(), 'view', pg.evaluate("window.__LF.S.view"), 'ref', pg.evaluate("[...document.querySelectorAll('.fnBar')].find(x=>x.getBoundingClientRect().width).dataset.ref")); o2 = {x['r']: x['n'] for x in pg.evaluate(OLHO)}; foto()
            pg.evaluate("[...document.querySelectorAll('.fnTabs button[data-id=his]')].find(x=>x.getBoundingClientRect().width).click()"); pg.wait_for_timeout(500); print(sc, 'aba Histórico', T())
            pg.go_back(); pg.wait_for_timeout(1000); print(sc, 'voltar →', pg.evaluate("window.__LF.S.view"), T(), 'rolagem', pg.evaluate("Math.round(scrollY)")); pg.evaluate("(()=>{const l=[...document.querySelectorAll('.fnLk')].find(x=>/Ver a ficha/.test(x.textContent)&&x.getBoundingClientRect().width);if(l)l.click()})()"); pg.wait_for_timeout(1200)
            pg.evaluate("window.__LF.abreRefEst&&0"); pg.evaluate("(()=>{const l=[...document.querySelectorAll('.fnLk')].find(x=>/Ver a ficha/.test(x.textContent)&&x.getBoundingClientRect().width);if(l)l.click()})()"); pg.wait_for_timeout(1200)
            pg.evaluate("[...document.querySelectorAll('.fnLk')].find(x=>/Vender/.test(x.textContent)&&x.getBoundingClientRect().width).click()"); pg.wait_for_timeout(1200); print(sc, 'Vender no Catálogo →', pg.evaluate("window.__LF.S.view"), T())
            pg.evaluate("window.__LF.abreRefEst&&0"); pg.evaluate("(()=>{const l=[...document.querySelectorAll('.fnLk')].find(x=>/Ver a ficha/.test(x.textContent)&&x.getBoundingClientRect().width);if(l)l.click()})()"); pg.wait_for_timeout(1200)
            pg.evaluate("[...document.querySelectorAll('.fnLk')].find(x=>/Fotografar/.test(x.textContent)&&x.getBoundingClientRect().width).click()"); pg.wait_for_timeout(2000); print(sc, 'Fotografar →', pg.evaluate("(()=>{const c=document.querySelector('#estCam');return c?'câmera aberta: '+(c.textContent||'').replace(/\\s+/g,' ').trim().slice(0,60):'sem câmera · '+([...document.querySelectorAll('.toast,.lfToast')].map(e=>e.textContent).join('|')||'sem aviso')})()")); foto()
            pg.evaluate("(()=>{const x=document.querySelector('#estCam [data-d=x],#estCam .ecX,#estCam button[aria-label*=Fechar]');if(x)x.click()})()"); pg.wait_for_timeout(700)
            pg.evaluate("window.__LF.estAbre()"); pg.wait_for_timeout(1000); print(sc, 'fila', pg.evaluate("[document.querySelectorAll('.estRw').length,document.querySelectorAll('.estFi').length,Math.round(document.querySelector('.estFi').getBoundingClientRect().height)]")); foto()
            pg.evaluate("document.querySelector('.estFi').click()"); pg.wait_for_timeout(1200); print(sc, 'Ficha da fila →', pg.evaluate("window.__LF.S.view"), T(), 'estúdio aberto?', pg.evaluate("!!document.querySelector('.estOv')"))
            pg.evaluate("window.__LF.setView('inicio')"); pg.wait_for_timeout(700); print(sc, 'barra', pg.evaluate("[...document.querySelectorAll('#mainnav .mn')].map(b=>b.textContent.trim()).join(' | ')"), '· atalhos', pg.evaluate("[...document.querySelectorAll('#v-inicio .tl')].map(e=>e.textContent.replace(/\\s+/g,' ').trim().slice(0,22)).slice(3,7).join(' | ')"))
            print(sc, 'erros JS', er[:3], 'olho catálogo', o1, 'olho inventário', o2); c.close()
finally: srv.terminate()
B = Image.new('RGB', (4 * 400, 2 * 854), 'white')
for i, im in enumerate(ims): B.paste(im, ((i % 4) * 400, (i // 4) * 854))
B.save('/tmp/s270.jpg', quality=78)

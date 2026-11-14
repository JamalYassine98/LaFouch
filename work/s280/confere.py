import subprocess, sys, time
from playwright.sync_api import sync_playwright
from PIL import Image
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8892', '-d', '/home/claude/lafouch/www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1); ims = []
try:
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
        for sc in ('light', 'dark'):
            c = b.new_context(viewport={'width': 390, 'height': 844}, color_scheme=sc, is_mobile=True, has_touch=True, service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
            pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:100])); pg.goto('http://localhost:8892/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(700)
            print(sc, 'exporta loadMsg:', pg.evaluate("typeof window.__LF.loadMsg"), '· inputs de arquivo:', pg.evaluate("document.querySelectorAll('input[type=file]').length"))
            pg.evaluate("window.__LF.setView('estoque')"); pg.wait_for_timeout(800); pg.evaluate("document.querySelector('#btnAdd').click()"); pg.wait_for_timeout(800)
            n = pg.evaluate("[...document.querySelectorAll('#addModal input[type=file], input[type=file]')].map(i=>(i.parentElement.id||i.parentElement.className)+':'+(i.getAttribute('capture')||'gal')).join(' | ')"); print('  inputs:', n[:200])
            pg.evaluate("window.__LF.loadMsg(true,'Lendo o código',30000)"); pg.wait_for_timeout(500)
            print('  cartão:', pg.evaluate("(()=>{const d=document.querySelector('#loadFoto');return d?d.className+' · '+d.textContent+' · cancelar visível: '+!d.querySelector('.lcX').hidden+' · origem '+d.firstChild.style.transformOrigin:'não abriu'})()")); pg.screenshot(path='/tmp/s280.png'); ims.append(Image.open('/tmp/s280.png').convert('RGB'))
            pg.evaluate("window.__LF.loadMsg(true,'Lendo as medidas…',30000)"); pg.wait_for_timeout(4200); print('  aos 4,7 s:', pg.evaluate("(()=>{const d=document.querySelector('#loadFoto');return d?d.textContent+' · cancelar visível: '+!d.querySelector('.lcX').hidden+' · cartões: '+document.querySelectorAll('.lcCard').length:'já fechou'})()")); pg.screenshot(path='/tmp/s280.png'); ims.append(Image.open('/tmp/s280.png').convert('RGB'))
            pg.evaluate("(()=>{const x=document.querySelector('#loadFoto .lcX');if(x)x.click()})()"); pg.wait_for_timeout(500); print('  depois de Cancelar: cartão', pg.evaluate("!!document.querySelector('#loadFoto')"), '· tok', pg.evaluate("window.__LF.loadMsg.tok"))
            pg.keyboard.press('Escape'); pg.evaluate("(()=>{const x=document.querySelector('#addClose');if(x)x.click()})()"); pg.wait_for_timeout(400)
            pg.evaluate("()=>{window.__LF.S.inicioEd=true;window.__LF.setView('estoque');window.__LF.setView('inicio')}"); pg.wait_for_timeout(900); pg.evaluate("scrollTo(0,300)"); pg.wait_for_timeout(300)
            print('  editar:', pg.evaluate("(()=>{const t=document.querySelector('#v-inicio .twrap .tl');if(!t)return 'sem twrap';const s=getComputedStyle(t);return s.animationName+' '+s.transform+' '+s.opacity+' · rodando sem fim: '+document.getAnimations().filter(a=>a.effect&&a.effect.getComputedTiming().iterations===Infinity&&a.effect.target&&a.effect.target.closest&&a.effect.target.closest('#v-inicio')).length})()")); pg.screenshot(path='/tmp/s280.png'); ims.append(Image.open('/tmp/s280.png').convert('RGB'))
            print(sc, 'erros', er[:2]); c.close()
finally: srv.terminate()
B = Image.new('RGB', (400 * len(ims), 854), 'white')
for i, im in enumerate(ims): B.paste(im, (i * 400, 0))
B = B.resize((B.width // 2, B.height // 2)); B.save('/tmp/s280.jpg', quality=82)

# S253 · fluxo de cadastro: + Adicionar → ler haste (câmera falsa) e → foto (arquivo). Fotos de cada estado + o que se mexe.  python3 fluxo.py
import os, subprocess, sys, time, json, glob
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
AN = "()=>{const o={};document.getAnimations().forEach(a=>{const c=a.effect&&a.effect.getComputedTiming();if(!c)return;const t=a.effect.target;if(!t||!t.getClientRects().length)return;const k=(a.animationName||'tr')+' '+t.tagName.toLowerCase()+'.'+String(t.className.baseVal??t.className).split(' ')[0]+' '+Math.round(c.duration)+'ms'+(c.iterations===Infinity?' SEMFIM':'');o[k]=(o[k]||0)+1});return o}"
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8851', '-d', A + '../../www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
img = sorted(glob.glob(A + '../atlas/img/*.jpg') + glob.glob(A + '../atlas/img/*.png'))[0]
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'])
    def novo():
        c = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, service_workers='block', permissions=['camera']); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        pg = c.new_page(); pg.on('dialog', lambda d: d.dismiss()); pg.goto('http://localhost:8851/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(900); pg.evaluate("window.__LF.setView('estoque')"); pg.wait_for_timeout(1000); return c, pg
    c, pg = novo(); pg.evaluate("document.querySelector('#btnAdd').click()"); pg.wait_for_timeout(900); pg.screenshot(path=A + 'f1_adicionar.png')
    print('ADICIONAR botões:', pg.evaluate("()=>[...document.querySelectorAll('#addModal button,#addModal input[type=file],#addModal label')].filter(e=>e.getClientRects().length||e.type==='file').map(e=>e.tagName+'#'+e.id+' '+(e.getAttribute('aria-label')||e.innerText||e.accept||'').trim().slice(0,30)).join(' | ')"))
    pg.evaluate("document.querySelector('#btnLeitor').click()")
    for i, t in enumerate((250, 900, 2500)):
        pg.wait_for_timeout(t); pg.screenshot(path=A + 'f2_leitor_%d.png' % i); print('LEITOR +%dms' % t, json.dumps(pg.evaluate(AN), ensure_ascii=False)[:600])
    print('LEITOR dom:', pg.evaluate("()=>[...document.body.children].filter(e=>e.getClientRects().length&&getComputedStyle(e).position==='fixed').map(e=>e.tagName+'#'+e.id+'.'+String(e.className).slice(0,30)).join(' | ')"))
    c.close()
    c, pg = novo(); pg.evaluate("document.querySelector('#btnAdd').click()"); pg.wait_for_timeout(900)
    fi = pg.evaluate("()=>[...document.querySelectorAll('input[type=file]')].map((e,i)=>i+':'+e.id+':'+e.accept+':'+(e.closest('[id]')||{}).id).join(' | ')"); print('ARQUIVOS:', fi)
    alvo = pg.evaluate("()=>{const l=[...document.querySelectorAll('input[type=file]')];return 'fileL'}"); print('uso:', alvo)
    if alvo:
        pg.set_input_files('#' + alvo, img)
        for i, t in enumerate((200, 800, 2500)):
            pg.wait_for_timeout(t); pg.screenshot(path=A + 'f3_carregando_%d.png' % i); print('CARREGANDO +%dms' % t, json.dumps(pg.evaluate(AN), ensure_ascii=False)[:500], '|', pg.evaluate("()=>{const e=document.querySelector('#loadFoto');return e?e.innerText:'sem #loadFoto'}"))
    c.close()
finally: srv.terminate()

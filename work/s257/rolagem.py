# S257 · rolagem atrás das janelas: com cada janela/tela cheia aberta, a página de trás rola? E depois de fechar, a página voltou a rolar?  python3 rolagem.py
import os, subprocess, sys, time, json
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
OLHO = open(A + '../kit/olho.js').read()
subprocess.run('bash /tmp/srv.sh >/dev/null 2>&1', shell=True)
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8871', '-d', A + '../../www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
EST = "()=>({y:Math.round(scrollY),alt:document.documentElement.scrollHeight,tela:innerHeight,body:getComputedStyle(document.body).overflowY,html:getComputedStyle(document.documentElement).overflowY})"
R = []
def mede(pg, nome, abre, fecha=None, onde=(195, 420)):
    try:
        pg.evaluate("scrollTo(0,0)"); pg.wait_for_timeout(150); abre(pg); pg.wait_for_timeout(900); a = pg.evaluate(EST)
        pg.mouse.move(*onde); pg.mouse.wheel(0, 500); pg.wait_for_timeout(500); b_ = pg.evaluate(EST); olho = sum(x['n'] for x in pg.evaluate(OLHO))
        rola_atras = b_['y'] != a['y']; pg.evaluate("scrollTo(0,0)")
        if fecha: fecha(pg)
        else: pg.keyboard.press('Escape')
        pg.wait_for_timeout(700); c0 = pg.evaluate(EST); pg.mouse.wheel(0, 500); pg.wait_for_timeout(500); c1 = pg.evaluate(EST); preso = (c1['y'] == c0['y']) and c0['alt'] > c0['tela'] + 40
        R.append((nome, a['alt'], a['tela'], a['body'], rola_atras, preso, olho)); print('%-34s página %5d px · tela %d · body:%s · ROLA ATRÁS: %-3s · PRESA DEPOIS: %-3s · olho.js achou %d' % (nome, a['alt'], a['tela'], a['body'], 'SIM' if rola_atras else 'não', 'SIM' if preso else 'não', olho), flush=True)
    except Exception as e: print(nome, 'ERRO', str(e)[:90])
ev = lambda js: (lambda pg: pg.evaluate(js))
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'])
    def app(v):
        c = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, service_workers='block', permissions=['camera']); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        pg = c.new_page(); pg.on('dialog', lambda d: d.dismiss()); pg.goto('http://localhost:8871/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(800); pg.evaluate("v=>window.__LF.setView(v)", v); pg.wait_for_timeout(1000); return c, pg
    print('== APP'); CL = lambda k: ev("(()=>{const e=[...document.querySelectorAll('[data-act=\"%s\"],#%s')].find(e=>e.getClientRects().length);e&&e.click()})()" % (k, k))
    c, pg = app('inicio'); mede(pg, 'Tela do PIN (bloqueio)', ev("document.getElementById('lockScr').hidden=false"), ev("document.getElementById('lockScr').hidden=true")); mede(pg, 'Guardião (janela)', CL('guardAbre')); c.close()
    c, pg = app('estoque'); mede(pg, '+ Adicionar', CL('btnAdd'), CL('addClose')); mede(pg, 'Filtros e ordem', CL('btnFilt')); mede(pg, 'Preços para corrigir', CL('pcAbre')); mede(pg, 'Leitor (câmera)', ev("document.querySelector('#btnAdd').click();setTimeout(()=>document.querySelector('#btnLeitor').click(),500)")); c.close()
    c, pg = app('caixa'); mede(pg, '+ Novo objetivo', CL('cxabre'), CL('cxfecha')); mede(pg, 'Menu do caixa', CL('cxmenu')); c.close()
    c, pg = app('clientes'); mede(pg, 'Acesso atacado', CL('ataNovo')); mede(pg, 'Cartões', CL('cupAbre')); c.close()
    c, pg = app('dash'); mede(pg, 'Números · período', CL('dPer'), CL('dFecha')); c.close()
    c, pg = app('fx'); mede(pg, 'Câmbio · janela do dólar', CL('fjAbre'), CL('fjFecha')); c.close()
    c, pg = app('vendas'); mede(pg, 'Compartilhar catálogo', CL('cjSh')); mede(pg, 'Ajustes do catálogo', CL('cjAj')); c.close()
    print('== SITE')
    def site(url):
        c = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, locale='es-PY', service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        pg = c.new_page(); pg.goto('http://localhost:8811' + url); pg.wait_for_timeout(2600); return c, pg
    c, pg = site('/'); mede(pg, 'Menu', ev("document.querySelector('#mnb').click()")); mede(pg, 'Busca', ev("document.querySelector('#sbtn').click()")); mede(pg, 'Sacola', ev("document.querySelector('#bagbtn').click()")); mede(pg, 'Minha conta / entrar', ev("document.querySelector('#contabtn').click()")); mede(pg, 'Mochi', ev("document.querySelector('#mnb').click();setTimeout(()=>document.querySelector('[data-gzopen]').click(),900)"), ev("history.back()")); c.close()
    c, pg = site('/?r=tienda'); mede(pg, 'Filtros do catálogo', ev("(document.querySelector('#ftog')||{click(){}}).click()")); c.close()
finally: srv.terminate()
json.dump(R, open(A + 'rolagem.json', 'w'), ensure_ascii=False)

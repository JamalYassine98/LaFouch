import subprocess, sys, time
from playwright.sync_api import sync_playwright
from PIL import Image
OLHO = open('/home/claude/lafouch/work/kit/olho.js').read(); ims = {}
for nome, pasta in (('antes', '/tmp/www_old/www'), ('agora', '/home/claude/lafouch/www')):
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8888', '-d', pasta], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
    try:
        with sync_playwright() as pw:
            b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
            for W, H, sc in ((390, 844, 'light'), (390, 844, 'dark'), (820, 1180, 'light'), (1366, 768, 'light'), (2560, 1440, 'dark')):
                c = b.new_context(viewport={'width': W, 'height': H}, color_scheme=sc, is_mobile=W < 700, has_touch=W < 1100, service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
                pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:100])); pg.goto('http://localhost:8888/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(600); o = {}
                for v in ('caixa', 'dia'):
                    pg.evaluate("v=>window.__LF.setView(v)", v); pg.wait_for_timeout(1100); o[v] = ({x['r']: x['n'] for x in pg.evaluate(OLHO)}, pg.evaluate("document.documentElement.scrollWidth>innerWidth+1"), pg.evaluate("v=>Math.round(document.querySelector('#v-'+v).getBoundingClientRect().height)", v))
                    if nome == 'agora' and (W, sc) in ((390, 'light'), (1366, 'light'), (820, 'light'), (390, 'dark')):
                        pg.screenshot(path='/tmp/s275.png', full_page=(W == 390)); ims[v, W, sc] = Image.open('/tmp/s275.png').convert('RGB')
                if nome == 'agora' and W == 390 and sc == 'light':
                    T = lambda v: pg.evaluate("v=>[...document.querySelectorAll('#v-'+v+' .famS, #v-'+v+' .famV, #v-'+v+' .top h1')].map(e=>e.textContent).join(' | ')", v)
                    print('  DINHEIRO:', (pg.evaluate("window.__LF.setView('caixa')"), pg.wait_for_timeout(900), T('caixa'))[2])
                    pg.evaluate("document.querySelector('#v-caixa .famV[data-act=famAbre]').click()"); pg.wait_for_timeout(700); print('  ver todos os movimentos → escondidos:', pg.evaluate("document.querySelectorAll('#v-caixa .famOc').length"), 'botão some:', pg.evaluate("!document.querySelector('#v-caixa .famV[data-act=famAbre]')"))
                    pg.evaluate("[...document.querySelectorAll('#v-caixa .famV')].find(b=>/despesas/.test(b.textContent)).click()"); pg.wait_for_timeout(800); print('  ver despesas →', pg.evaluate("window.__LF.S.view")); pg.go_back(); pg.wait_for_timeout(800); print('  voltar →', pg.evaluate("window.__LF.S.view"))
                    pg.evaluate("window.__LF.inicioGo('hoje')"); pg.wait_for_timeout(1000); print('  atalho Dashboard →', pg.evaluate("window.__LF.S.view"), T('dia'))
                    print('  recolhidos:', pg.evaluate("[...document.querySelectorAll('#v-dia .famRec')].map(e=>e.firstElementChild.textContent.trim().slice(0,20)+' h'+Math.round(e.getBoundingClientRect().height)).join(' | ')"))
                    pg.evaluate("document.querySelector('#v-dia .famRec').click()"); pg.wait_for_timeout(700); print('  abrir recolhido → restam', pg.evaluate("document.querySelectorAll('#v-dia .famRec').length"))
                    pg.evaluate("[...document.querySelectorAll('#v-dia .famV')].find(b=>/números/.test(b.textContent)).click()"); pg.wait_for_timeout(800); print('  ver números →', pg.evaluate("window.__LF.S.view+' '+window.__LF.S.dTab"))
                    pg.evaluate("window.__LF.setView('inicio')"); pg.wait_for_timeout(600); print('  barra:', pg.evaluate("[...document.querySelectorAll('#mainnav .mn')].map(b=>b.textContent.trim()).join(' | ')"))
                print(nome, W, sc, o, er[:2], flush=True); c.close()
    finally: srv.terminate(); time.sleep(.5)
def junta(ks, arq, esc=1.0):
    xs = [ims[k] for k in ks if k in ims]; xs = [x.resize((int(x.width * esc), int(x.height * esc))) for x in xs]; B = Image.new('RGB', (sum(x.width for x in xs) + 10 * len(xs), max(x.height for x in xs)), 'white'); x0 = 0
    for x in xs: B.paste(x, (x0, 0)); x0 += x.width + 10
    B.save(arq, quality=75); print(arq, B.size)
junta([('caixa', 390, 'light'), ('dia', 390, 'light'), ('caixa', 390, 'dark')], '/tmp/s275_cel.jpg', .5)
junta([('caixa', 1366, 'light'), ('dia', 1366, 'light')], '/tmp/s275_pc.jpg', .6)
junta([('caixa', 820, 'light'), ('dia', 820, 'light')], '/tmp/s275_tab.jpg', .5)

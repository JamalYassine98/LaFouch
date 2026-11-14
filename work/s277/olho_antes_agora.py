import subprocess, sys, time
from playwright.sync_api import sync_playwright
from PIL import Image
OLHO = open('/home/claude/lafouch/work/kit/olho.js').read(); ims = []
G = "(()=>{const S=window.__LF.S;S.grupos=[{id:'g:a',nome:'Balcão',itens:['vendas','caixa']},{id:'g:b',nome:'Pedidos e clientes',itens:['ped','cli']}];S.barra=['g:a','estoque','g:b','ajustes'];window.__LF.setView('vendas')})()"
for nome, pasta in (('antes', '/tmp/www_old/www'), ('agora', '/home/claude/lafouch/www')):
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8890', '-d', pasta], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
    try:
        with sync_playwright() as pw:
            b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
            for W, H, sc in ((390, 844, 'light'), (390, 844, 'dark'), (820, 1180, 'light'), (1366, 768, 'light'), (2560, 1440, 'dark')):
                c = b.new_context(viewport={'width': W, 'height': H}, color_scheme=sc, is_mobile=W < 700, has_touch=W < 1100, service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
                pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:100])); pg.goto('http://localhost:8890/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(600); pg.evaluate(G); pg.wait_for_timeout(1000); o = {}
                for v in ('vendas', 'caixa', 'ped'):
                    pg.evaluate("v=>window.__LF.setView(v)", v); pg.wait_for_timeout(900); o[v] = ({x['r']: x['n'] for x in pg.evaluate(OLHO)}, pg.evaluate("document.documentElement.scrollWidth>innerWidth+1"))
                    if nome == 'agora' and W == 390 and v != 'ped': pg.screenshot(path='/tmp/s277.png', clip={'x': 0, 'y': 0, 'width': 390, 'height': 330}); ims.append(Image.open('/tmp/s277.png').convert('RGB'))
                if nome == 'agora' and (W, sc) == (390, 'light'):
                    pg.evaluate("document.querySelector('#grpTabs .gmais').click()"); pg.wait_for_timeout(700); pg.screenshot(path='/tmp/s277.png'); ims.append(Image.open('/tmp/s277.png').convert('RGB'))
                    pg.evaluate("[...document.querySelectorAll('#grpM [data-act=grpPoe]')].find(b=>/Clientes|Mensagens/.test(b.textContent)).click()"); pg.wait_for_timeout(600); print('  +1 tela → nome', pg.evaluate("document.querySelector('#grpNome').value"), '· telas', pg.evaluate("window.__LF.S.grupos[1].itens.join(',')"))
                    pg.evaluate("document.querySelector('#grpM [data-act=grpFecha], #grpM [data-act=grpSalva]').click()"); pg.wait_for_timeout(500)
                    pg.evaluate("(()=>{const S=window.__LF.S;S.grupos.push({id:'g:c',nome:window.__LF.grpNomeSugerido('caixa','desp')||'Caixa e Despesas',itens:['caixa','desp']});})()")
                    print('  toque', pg.evaluate("[...document.querySelectorAll('#grpTabs button')].map(b=>{const r=b.getBoundingClientRect();return b.textContent.trim().slice(0,10)+' '+Math.round(r.width)+'x'+Math.round(r.height)}).join(' | ')"))
                print(nome, W, sc, o, er[:2], flush=True); c.close()
    finally: srv.terminate(); time.sleep(.5)
B = Image.new('RGB', (400 * 3, 330 * 2 + 10), 'white')
for i, im in enumerate([x for x in ims if x.height == 330][:4]): B.paste(im, ((i % 2) * 400, (i // 2) * 340))
jan = [x for x in ims if x.height > 330]
if jan: B.paste(jan[0].resize((312, 675)), (820, 0))
B.save('/tmp/s277.jpg', quality=80)

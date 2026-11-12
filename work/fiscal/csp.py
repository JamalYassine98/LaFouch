# Prova da política de segurança (CSP, 12/11/2026): abre as telas principais SEM pular a política e falha
# se o navegador bloquear alguma coisa do próprio site (as outras provas rodam com bypass_csp porque usam eval).
# uso: python3 csp.py <porta>  → JSON [{nome, ok, d}]
import sys, json
from playwright.sync_api import sync_playwright
P = sys.argv[1]; U = f'http://localhost:{P}'; R = []
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'])
    c = b.new_context(viewport={'width': 390, 'height': 844}, permissions=['camera'])
    c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    c.add_init_script("window.__csp=[];document.addEventListener('securitypolicyviolation',function(e){window.__csp.push(e.violatedDirective+' '+(e.blockedURI||'')+' '+(e.sourceFile||'').split('/').pop()+':'+e.lineNumber)})")
    pg = c.new_page()
    def tela(nome, rota, acao=None):
        try:
            pg.goto(U + rota); pg.wait_for_timeout(2200)
            if acao: acao(); pg.wait_for_timeout(1500)
            v = pg.evaluate('() => window.__csp')
            R.append({'nome': 'CSP · ' + nome, 'ok': not v, 'd': '; '.join(v[:4]) if v else 'nada bloqueado'})
        except Exception as e: R.append({'nome': 'CSP · ' + nome, 'ok': False, 'd': str(e)[:120]})
    tela('Início', '/')
    tela('Peça e carrinho', '/?ref=SL2210', lambda: pg.evaluate("() => { const b = document.querySelector('[data-addm]'); b && b.click() }"))
    tela('Busca', '/', lambda: (pg.click('#sbtn'), pg.fill('#q5', 'aviador')))
    tela('Atacado', '/?r=atacado')
    tela('Painel', '/admin.html')
    def consulta():
        pg.evaluate("() => { const b = document.querySelector('[data-gzopen]'); b && b.click() }"); pg.wait_for_timeout(1500)
        pg.evaluate("() => { const b = document.querySelector('#gw [data-gz=comeca]'); b && b.click() }")
        for i in range(30):
            pg.wait_for_timeout(1500)
            pg.evaluate("() => { const b = document.querySelector('#gw [data-gz=camsim]'); b && b.click() }")
            if pg.evaluate("() => window.__LFGZ && __LFGZ.Z.fase") == 'teste': break
        if pg.evaluate("() => window.__LFGZ && __LFGZ.Z.fase") != 'teste': R.append({'nome': 'CSP · consulta com câmera chega ao quadro', 'ok': False, 'd': 'fase ' + str(pg.evaluate("() => window.__LFGZ && __LFGZ.Z.fase"))})
    tela('Consulta com câmera (MediaPipe)', '/', consulta)
    b.close()
print(json.dumps(R, ensure_ascii=False))

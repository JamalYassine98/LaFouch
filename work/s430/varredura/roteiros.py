"""Roteiros fundos para a varredura de código morto (regra 12d): fluxos que as provas do porteiro não percorrem —
mapa, câmera do rosto (com câmera de mentira), consulta do grau, atacado (nuvem imitada), conta/perfil, avaliação, pedidos.
Em cada começo, toca em tudo o que aparecer na janela aberta, em várias rodadas. Anota as funções do lf-site.js que rodaram.
uso: roteiros.py URL saida.json"""
import sys, json, re
from playwright.sync_api import sync_playwright
URL, OUT = sys.argv[1].rstrip('/') + '/', sys.argv[2]
CONTA = {'nome': 'Maria González', 'email': 'maria@exemplo.com', 'tel': '+595 983 000 000', 'pais': 'py', 'nac': 'py', 'doc': '1234567', 'ends': [{'nome': 'Casa', 'cidade': 'Ciudad del Este', 'dep': 'Alto Paraná', 'end': 'Calle Los Lapachos 123', 'ref': 'portón verde'}]}
AUTH = {'uid': 'kit', 'idToken': 'kit', 'refresh': 'kit', 'exp': 9e15, 'ev': True, 'email': 'maria@exemplo.com'}
PED = [{'id': 'PEDT1', 'cod': 'A1B2', 'tel': '+595983000000', 'est': 'pago', 'tok': 'LF-T', 'ts': 1795000000000, 'total': 95000, 'brl': 95, 'pag': 'pix', 'ent': 'loja', 'itens': [{'ref': 'GR3340', 'nome': 'Armação', 'q': 1, 'cor': ''}]},
       {'id': 'PEDT2', 'cod': 'C3D4', 'tel': '+595983000000', 'est': 'pagar', 'ts': 1795000000000, 'total': 95000, 'brl': 95, 'pag': 'alias', 'ent': 'delivery', 'itens': [{'ref': 'GR3340', 'nome': 'Armação', 'q': 1, 'cor': ''}]}]
def init(logada):
    s = "try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');"
    if logada: s += "localStorage.setItem('lf_conta',%s);localStorage.setItem('lf_auth',%s);localStorage.setItem('lf_ped',%s);" % tuple(json.dumps(json.dumps(x)) for x in (CONTA, AUTH, PED))
    return s + "}catch(e){}"
COB = {}
import os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'testes')); from base import INIT as BASE_INIT  # câmera e rosto de mentira (os mesmos das provas)
def nuvem(r):
    nome = r.request.url.split('cloudfunctions.net/')[1].split('?')[0]
    try: j = json.loads(r.request.post_data or '{}')
    except Exception: j = {}
    a = j.get('acao')
    if nome == 'atacado':
        if a in ('pedir', 'codigo', 'entrar'): return r.fulfill(json={'ok': True})
        if a == 'confirma': return r.fulfill(json={'ok': True, 'tok': 'T'})
        if a == 'catalogo': return r.fulfill(json={'ok': True, 'conta': {'nome': 'Óptica Teste', 'email': 'otica@exemplo.com'}, 'minimo': 10, 'tabela': 'A', 'itens': [{'ref': 'GR3340', 'nome': 'Armação', 'preco': 50000, 'est': 9, 'tipo': 'armacao', 'cores': ['Preto'], 'qs': [9]}, {'ref': 'SL2250', 'nome': 'Solar', 'preco': 60000, 'est': 5, 'tipo': 'solar', 'cores': ['Dourado'], 'qs': [5]}]})
        return r.fulfill(json={'ok': True, 'aparelhos': [], 'pedidos': []})
    if nome == 'avaliacao': return r.fulfill(json={'ok': True, 'n': 2, 'media': 4.5, 'dist': [0, 0, 0, 1, 1], 'pode': True, 'L': [{'nome': 'Ana', 'n': 5, 'txt': 'Ótimo', 'ts': 1795000000000}]})
    if nome == 'cupom': return r.fulfill(json={'ok': True, 'cupons': [{'cod': 'ABC123', 'pct': 10, 'tipo': 'pe', 'estado': 'ok', 'fim': 9e15}], 'vip': 0, 'refs': []})
    if nome == 'reserva': return r.fulfill(json={'ok': True, 'tok': 'LF-T', 'exp': 9e15, 'agora': 0})
    return r.fulfill(json={'ok': True})
TOCA = """(feitos)=>{let R=[...document.querySelectorAll('#layer, #sov, #mapw, .modal, #drw.on, #gw, .sec.pop, #dlgb, #cad, #pkok')].filter(e=>e.getBoundingClientRect().height>40&&e.querySelector('button,a,input'));if(!R.length)R=[document.querySelector('main')||document.body];
 const L=[];R.forEach(r=>r.querySelectorAll('button,a,[data-cta],[role=button],input[type=checkbox],input[type=radio],summary,label[for],select').forEach(e=>{const b=e.getBoundingClientRect();if(!b.width||!b.height)return;
  const h=e.getAttribute('href')||'';if(/wa\\.me|whatsapp|mailto:|tel:|^https?:\\/\\/(?!localhost)/.test(h))return;if(e.hasAttribute('data-close')||/sair|excluir|exc2?$/i.test(e.getAttribute('data-cta')||''))return;
  const k=(e.id||'')+'|'+(e.getAttribute('data-cta')||'')+'|'+e.className+'|'+e.textContent.trim().slice(0,18);if(feitos.includes(k)||L.some(x=>x[0]===k))return;e.setAttribute('data-vr2',L.length);L.push([k])}));return L.map(x=>x[0])}"""
def roteiro(b, nome, logada, w, h, mob, abre, rodadas=4, por_rodada=22, qs='', mov=False):
    c = b.new_context(bypass_csp=True, viewport={'width': w, 'height': h}, is_mobile=mob, has_touch=mob, reduced_motion=('no-preference' if mov else 'reduce'), permissions=['camera', 'geolocation'], geolocation={'latitude': -25.51, 'longitude': -54.61})
    c.add_init_script(init(logada)); c.add_init_script('if(/^http/.test(location.protocol)){' + BASE_INIT + '}'); c.route('**cloudfunctions.net/**', nuvem)
    c.route('**identitytoolkit**', lambda r: r.fulfill(json={'users': [{'emailVerified': True, 'email': 'maria@exemplo.com'}]}))
    pg = c.new_page(); cdp = c.new_cdp_session(pg); cdp.send('Profiler.enable'); cdp.send('Profiler.startPreciseCoverage', {'callCount': True, 'detailed': False})
    def colhe():
        try:
            for sc in cdp.send('Profiler.takePreciseCoverage')['result']:
                if 'lf-site.js' not in sc['url']: continue
                for f in sc['functions']:
                    r = f['ranges'][0]; k = '%s|%d|%d' % (f['functionName'], r['startOffset'], r['endOffset']); COB[k] = COB.get(k, 0) or (1 if r['count'] > 0 else 0)
        except Exception: pass
    pg.on('request', lambda rq: colhe() if rq.is_navigation_request() and rq.frame == pg.main_frame else None)
    n = 0
    try:
        pg.goto(URL + qs, wait_until='load'); pg.wait_for_timeout(3500); abre(pg); pg.wait_for_timeout(1500); feitos = []; ini = pg.url
        for _ in range(rodadas):
            try: alvos = pg.evaluate(TOCA, feitos)
            except Exception: break
            if not alvos: break
            for i, k in enumerate(alvos[:por_rodada]):
                feitos.append(k)
                try:
                    e = pg.query_selector(f'[data-vr2="{i}"]')
                    if e and e.is_visible(): e.click(timeout=900, force=True); n += 1; pg.wait_for_timeout(450)
                    for cx in pg.query_selector_all('#layer input:not([type=checkbox]):not([type=radio]):not([type=file]), #layer textarea, .sec.pop input:not([type=checkbox]):not([type=radio]):not([type=file]), .sec.pop textarea, #dlgb input')[:8]:
                        try:
                            if cx.is_visible() and not cx.input_value(): cx.fill('teste 123', timeout=400)
                        except Exception: pass
                except Exception: pass
            colhe()
    except Exception as ex: print('  (roteiro parou:', str(ex).split('\n')[0][:80], ')')
    colhe(); c.close(); print(nome, w, '·', n, 'toques · funções executadas até agora:', sum(COB.values()), 'de', len(COB), flush=True)
js_click = lambda sel: (lambda pg: pg.evaluate("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.offsetParent)||document.querySelector(s);e&&e.click()}", sel))
def hash_(h): return lambda pg: (pg.click('#mnb'), pg.wait_for_timeout(700), pg.evaluate("h=>{const e=document.querySelector('#drw a[href=\"'+h+'\"]');e&&e.click()}", h), pg.wait_for_timeout(1500))
def peca(pg):
    pg.evaluate("()=>{const a=[...document.querySelectorAll('a[data-mf^=\"tipo:\"]')].find(e=>e.offsetParent);a&&a.click()}"); pg.wait_for_timeout(1500)
    pg.evaluate("()=>{const e=document.querySelector('#grid .card .open');e&&e.click()}"); pg.wait_for_timeout(1800)
def aba(a): return lambda pg: (pg.click('#contabtn'), pg.wait_for_timeout(1300), js_click('[data-cta=mcaba][data-a=%s]' % a)(pg), pg.wait_for_timeout(900))
def pedido(qual): return lambda pg: (aba('peds')(pg), js_click('[data-cta=ped][data-id=%s]' % qual)(pg), pg.wait_for_timeout(1500))
def camera_rosto(pg):
    hash_('#rosto')(pg); js_click('#rosto [data-fa]')(pg); pg.wait_for_timeout(1200); js_click('#layer [data-facam]')(pg); pg.wait_for_timeout(3500)
def coracoes(pg):
    peca_cat(pg)
    for i in range(4): pg.evaluate("i=>{const e=[...document.querySelectorAll('#grid [data-fav]')].filter(e=>e.offsetParent)[i%3];e&&e.click()}", i); pg.wait_for_timeout(900)
def peca_cat(pg): pg.evaluate("()=>{const a=[...document.querySelectorAll('a[data-mf^=\"tipo:\"]')].find(e=>e.offsetParent);a&&a.click()}"); pg.wait_for_timeout(1500)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'])
    for w, h, mob in ((390, 844, True), (1440, 900, False)):
        roteiro(b, 'mapa (Como chegar)', False, w, h, mob, lambda pg: (pg.evaluate("()=>scrollTo(0,document.documentElement.scrollHeight)"), pg.wait_for_timeout(600), js_click('[data-map],[data-cta=mapa],.lfft a[href*="map"],button[data-como]')(pg), pg.evaluate("()=>{const e=[...document.querySelectorAll('a,button')].find(x=>/Como chegar/.test(x.textContent));e&&e.click()}")))
        roteiro(b, 'rosto / formato (câmera de mentira)', False, w, h, mob, hash_('#rosto'), rodadas=5)
        roteiro(b, 'consulta do grau', False, w, h, mob, js_click('[data-gzopen]'), rodadas=6)
        roteiro(b, 'atacado', False, w, h, mob, hash_('#atacado'), rodadas=6)
        roteiro(b, 'como comprar / ajuda', False, w, h, mob, hash_('#como'), rodadas=4)
        roteiro(b, 'minha conta (logada)', True, w, h, mob, lambda pg: (pg.click('#contabtn'), pg.wait_for_timeout(1000)), rodadas=6)
        for a in ('perfil', 'ends', 'cart', 'peds'): roteiro(b, 'conta › ' + a, True, w, h, mob, aba(a), rodadas=5)
        roteiro(b, 'pedido a pagar (tela de pagamento)', True, w, h, mob, pedido('PEDT2'), rodadas=5)
        roteiro(b, 'pedido pago (recibo)', True, w, h, mob, pedido('PEDT1'), rodadas=5)
        roteiro(b, 'câmera do rosto por dentro (rosto de mentira)', False, w, h, mob, camera_rosto, rodadas=6)
        roteiro(b, 'portal do atacado', False, w, h, mob, lambda pg: pg.wait_for_timeout(2500), rodadas=7, qs='?c=TESTE123')
        roteiro(b, 'separado para você', False, w, h, mob, lambda pg: pg.wait_for_timeout(2500), rodadas=3, qs='?s=SL2250.GR3340.AC1050&n=Maria')
        roteiro(b, 'corações com movimento', False, w, h, mob, coracoes, rodadas=2, mov=True)
        roteiro(b, 'peça logada (avaliação, comparar, compartilhar)', True, w, h, mob, peca, rodadas=5)
        roteiro(b, 'carrinho logada até o pagamento', True, w, h, mob, lambda pg: (peca(pg), js_click('#layer [data-addm]')(pg), pg.wait_for_timeout(1200)), rodadas=7)
        roteiro(b, 'busca', False, w, h, mob, lambda pg: (pg.click('#sbtn'), pg.wait_for_timeout(500), pg.fill('#q5', 'arma'), pg.wait_for_timeout(600)), rodadas=3)
    b.close()
json.dump(COB, open(OUT, 'w')); print('FIM', sum(COB.values()), 'de', len(COB))

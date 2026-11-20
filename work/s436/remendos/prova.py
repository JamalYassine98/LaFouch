# S436 (20/11/2026) — PROVA de que uma limpeza não muda nenhuma tela: abre as telas do app (tools/teste-android/telas.py)
# em duas pastas www (A = como está hoje, B = depois da limpeza) e compara peça por peça com o comparador do app.
# A é aberta duas vezes: o que muda entre as duas aberturas de A é ruído (relógio, sorteio) e não conta.
#   python3 prova.py <wwwA> <wwwB> <celular|tablet|pc> <escuro|claro> <saida.json> [portaA portaB]
import sys, os, json, subprocess, time
sys.path.insert(0, '/home/claude/lafouch/tools/teste-android'); sys.path.insert(0, '/home/claude/lafouch/work/s436')
from telas import C
import compara_app as cmp
from playwright.sync_api import sync_playwright
A, B, AP, TEMA, SAI = sys.argv[1:6]; PA, PB = (int(sys.argv[6]), int(sys.argv[7])) if len(sys.argv) > 7 else (8811, 8812)
TAM = {'celular': (390, 844, True, 2), 'tablet': (820, 1180, True, 1), 'pc': (1366, 768, False, 1)}
srv = [subprocess.Popen([sys.executable, '-m', 'http.server', str(p), '-d', d], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL) for p, d in ((PA, A), (PB, B))]
time.sleep(1.2)
def tela(b, porta, passos):
    W, H, TQ, dpr = TAM[AP]
    c = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=dpr, is_mobile=TQ, has_touch=TQ, locale='pt-BR', color_scheme='dark' if TEMA == 'escuro' else 'light', service_workers='block')
    c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
    pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:120]))
    pg.goto('http://localhost:%d/index.html#test' % porta); pg.wait_for_function('window.__LF', timeout=15000); pg.wait_for_timeout(900)
    for p in passos:
        try: pg.evaluate(p)
        except Exception as e: er.append('passo: ' + str(e)[:80])
        pg.wait_for_timeout(650)
    pg.evaluate("()=>scrollTo({top:0,behavior:'instant'})"); pg.wait_for_timeout(350)
    col = cmp.coleta(pg); c.close(); return col, er
R = {}
try:
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
        for nome, passos in [('inicio', [])] + list(C):
            a1, e1 = tela(b, PA, passos); b1, e2 = tela(b, PB, passos); a2, _ = tela(b, PA, passos)
            D = [d for d in cmp.difere(a1, b1, a2) if 'já existia' not in d['q'] and 'igual à de Hoje' not in d['q']]
            if D:  # confirma: só conta a diferença que aparece de novo numa 2ª abertura de B (o resto é ruído de tempo)
                b2, _ = tela(b, PB, passos); a3, _ = tela(b, PA, passos)
                D2 = set(d['q'] + d['o'] for d in cmp.difere(a3, b2, a1)); D = [d for d in D if d['q'] + d['o'] in D2]
            R[nome] = {'pecas': len(a1), 'dif': cmp.texto(D), 'errosA': e1, 'errosB': e2}
            print(nome, len(a1), len(D), flush=True)
        b.close()
finally:
    [s.kill() for s in srv]
json.dump(R, open(SAI, 'w'), ensure_ascii=False, indent=1)
print('TELAS', len(R), '| com diferença', sum(1 for v in R.values() if v['dif']), '| erros só na B', sum(1 for v in R.values() if v['errosB'] != v['errosA']))

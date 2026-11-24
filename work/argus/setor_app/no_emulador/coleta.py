# ARGUS · setor App · coleta dentro do WebView do APK (Android emulado), pelo adb + CDP: para cada planta guardada, abre a tela com a
# loja de teste do Argus e o relógio parado, e guarda as peças (o mesmo COLETA da planta e do medidor) e o print real do Android.
import os, sys, json, re, time, subprocess, urllib.request, glob
B = os.path.dirname(os.path.abspath(__file__)); ARG = os.path.dirname(os.path.dirname(B)); sys.path.insert(0, os.path.join(ARG, 'motor'))
import websocket, loja
OUT, TEMA, LETRA = sys.argv[1], sys.argv[2], sys.argv[3]; os.makedirs(OUT, exist_ok=True)
P_SRC = open(os.path.join(ARG, 'motor', 'planta.py')).read(); F_SRC = open(os.path.join(ARG, 'motor', 'familia.py')).read()
COLETA_P = re.search(r'COLETA = r"""(.*?)"""', P_SRC, re.S).group(1); COLETA_F = re.search(r'COLETA = r"""(.*?)"""', F_SRC, re.S).group(1)
TITULO = eval(re.search(r'^TITULO = (".*?")  #', P_SRC, re.M).group(1))
def adb(*a): return subprocess.run(['adb'] + list(a), capture_output=True, text=True).stdout
def conecta():
    for i in range(30):
        pid = adb('shell', 'pidof', 'com.lafouch.app').strip().split(' ')[0]
        socks = re.findall(r'@(webview_devtools_remote_(\d+))', adb('shell', 'cat', '/proc/net/unix'))
        m = [a for a, b in socks if b == pid] or [a for a, b in socks]
        if m: break
        time.sleep(2)
    adb('forward', 'tcp:9222', 'localabstract:' + m[0])
    for i in range(30):
        try:
            ps = [p for p in json.load(urllib.request.urlopen('http://127.0.0.1:9222/json')) if p.get('type') == 'page']
            if ps: return websocket.create_connection(ps[0]['webSocketDebuggerUrl'], timeout=30, suppress_origin=True)
        except Exception: pass
        time.sleep(2)
ws = conecta(); N = [0]
def cdp(m, **p):
    N[0] += 1; ws.send(json.dumps({'id': N[0], 'method': m, 'params': p}))
    while True:
        r = json.loads(ws.recv())
        if r.get('id') == N[0]: return r
def ev(js, arg=None):
    expr = '(' + js + ')(' + (json.dumps(arg) if arg is not None else '') + ')'
    r = cdp('Runtime.evaluate', expression=expr, returnByValue=True, awaitPromise=True)
    if 'exceptionDetails' in r.get('result', {}): return {'_erro': str(r['result']['exceptionDetails'])[:200]}
    return r.get('result', {}).get('result', {}).get('value')
def espera(js, t=25):
    for i in range(t * 4):
        try:
            if ev(js): return True
        except Exception: pass
        time.sleep(.25)
# relógio parado (o mesmo do simulador) e sem a tela de novidades
import datetime
T0 = int(datetime.datetime.fromisoformat(loja.DATA).timestamp() * 1000)
RELOGIO = "(()=>{const R=Date,N=R.now(),O=%d-N;class D extends R{constructor(...a){a.length?super(...a):super(R.now()+O)}static now(){return R.now()+O}};window.Date=D;try{sessionStorage.setItem('lf_ni','1')}catch(e){}})()" % T0
cdp('Page.enable'); cdp('Page.addScriptToEvaluateOnNewDocument', source=RELOGIO)
base = ev("()=>location.href.split('#')[0].split('?')[0]")
plantas = [json.load(open(f)) for f in sorted(glob.glob(os.path.join(os.environ.get('ARGUS_PLANTAS') or os.path.join(ARG, 'plantas', 'app'), '*.json')))] or [{'id': 'inicio', 'tela': 'Início', 'passos': [], 'cenario': 'normal'}]
info = {'tema': TEMA, 'letra': LETRA, 'tela_css': ev("()=>[innerWidth,innerHeight,screen.width,screen.height,devicePixelRatio]"), 'ua': ev("()=>navigator.userAgent")}
json.dump(info, open(os.path.join(OUT, 'info-%s-%s.json' % (TEMA, LETRA)), 'w'))
for pl in plantas:
    d = loja.cenario(pl.get('cenario') or 'normal')
    cdp('Page.navigate', url=base + '?a=%d#test' % N[0]); time.sleep(3); espera("()=>!!window.__LF")
    ev(loja.POE, [loja.CHAVE, d['ls'], d['big']])
    cdp('Page.navigate', url=base + '?b=%d#test' % N[0]); time.sleep(3); espera("()=>!!window.__LF"); time.sleep(1.5)
    for js in pl['passos']: ev(js); time.sleep(1.2)
    time.sleep(1)
    r = {'id': pl['id'], 'tela': pl['tela'], 'titulo': ev(TITULO), 'pecas': ev(COLETA_P), 'familia': ev(COLETA_F)}
    nome = '%s-%s-%s' % (pl['id'], TEMA, LETRA)
    json.dump(r, open(os.path.join(OUT, nome + '.json'), 'w'), ensure_ascii=False)
    open(os.path.join(OUT, nome + '.png'), 'wb').write(subprocess.run(['adb', 'exec-out', 'screencap', '-p'], capture_output=True).stdout)
    print('ok', nome, flush=True)

# ARGUS · setor App · roda DENTRO do Android emulado (GitHub), ligado ao WebView do APK pelo adb + CDP.
# Usa os MESMOS códigos do simulador (motor/js/: base, relógio, planta, família, tempo) e a mesma loja de teste.
# Para cada planta: abre a tela com a loja e o relógio parado, guarda as peças e o print real do Android; na letra 1× mede também
# o tempo com a loja cheia (abrir e cada toque), porque no celular o app é mais lento que no simulador de PC.
import os, sys, json, re, time, subprocess, urllib.request, glob, datetime
B = os.path.dirname(os.path.abspath(__file__)); ARG = os.path.dirname(os.path.dirname(B)); sys.path.insert(0, os.path.join(ARG, 'motor'))
import websocket, loja, perigo, dedo, tempo
from js import js
OUT, TEMA, LETRA = sys.argv[1], sys.argv[2], sys.argv[3]; os.makedirs(OUT, exist_ok=True)
def adb(*a): return subprocess.run(['adb'] + list(a), capture_output=True, text=True).stdout
def conecta():
    m = []
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
            if ps: return websocket.create_connection(ps[0]['webSocketDebuggerUrl'], timeout=60, suppress_origin=True)
        except Exception: pass
        time.sleep(2)
ws = conecta(); N = [0]
def cdp(m, **p):
    N[0] += 1; ws.send(json.dumps({'id': N[0], 'method': m, 'params': p}))
    while True:
        r = json.loads(ws.recv())
        if r.get('id') == N[0]: return r
def ev(code, arg=None):
    r = cdp('Runtime.evaluate', expression='(' + code + ')(' + (json.dumps(arg) if arg is not None else '') + ')', returnByValue=True, awaitPromise=True)
    if 'exceptionDetails' in r.get('result', {}): return {'_erro': str(r['result']['exceptionDetails'])[:200]}
    return r.get('result', {}).get('result', {}).get('value')
def espera(code, t=40):
    for i in range(t * 4):
        try:
            if ev(code) is True: return True
        except Exception: pass
        time.sleep(.25)
    return False
MAO = dedo.Mao(ev, lambda m, p: cdp(m, **p))   # o dedo de verdade no WebView do APK (motor/dedo.py)
T0 = int(datetime.datetime.fromisoformat(loja.DATA).timestamp() * 1000)
cdp('Page.enable')
# sem internet de fora, como no simulador (o simulador recusa tudo que não é o próprio app): senão o app busca a cotação de verdade e os números mudam
cdp('Network.enable'); cdp('Network.setBlockedURLs', urls=['*://*.*/*'])   # 'localhost' (o app) não tem ponto no nome e continua passando
for s in (js('base'), js('relogio').replace('__T0__', str(T0))): cdp('Page.addScriptToEvaluateOnNewDocument', source=s)
base = ev("()=>location.href.split('#')[0].split('?')[0]")
def abre(cen, passos):
    d = loja.cenario(cen); cdp('Page.navigate', url=base + '?a=%d#test' % N[0]); time.sleep(3); espera("()=>!!window.__LF")
    ev(loja.POE, [loja.CHAVE, d['ls'], d['big']]); t = time.time()
    cdp('Page.navigate', url=base + '?b=%d#test' % N[0]); time.sleep(1); espera("()=>!!window.__LF&&!!window.__argus"); ms = int((time.time() - t) * 1000); time.sleep(1.5)
    for p in passos: ev(p); time.sleep(1.2)
    time.sleep(1); return ms
pasta = os.environ.get('ARGUS_PLANTAS') or os.path.join(ARG, 'plantas', 'app')
plantas = [json.load(open(f)) for f in sorted(glob.glob(os.path.join(pasta, '*.json')))] or [{'id': 'inicio', 'tela': 'Início', 'passos': [], 'cenario': 'normal'}]
json.dump({'tema': TEMA, 'letra': LETRA, 'tela_css': ev("()=>[innerWidth,innerHeight,screen.width,screen.height,devicePixelRatio]"), 'ua': ev("()=>navigator.userAgent")},
          open(os.path.join(OUT, 'info-%s-%s.json' % (TEMA, LETRA)), 'w'))
for pl in plantas:
    abre(pl.get('cenario') or 'normal', pl['passos'])
    r = {'id': pl['id'], 'tela': pl['tela'], 'titulo': ev("()=>window.__argus.titulo()"), 'pecas': ev(js('planta')), 'familia': ev(js('familia')), 'versao': ev(js('versao'))}
    if LETRA == '1.0' and TEMA == 'escuro':   # tempo no Android, com a loja cheia
        r['tempo'] = {'abrir_ms': abre('cheio', pl['passos']), 'toques': [], 'sozinha': tempo.muda_sozinha(MAO)}
        toc = ev(js('tocaveis')) or []
        for t in toc:
            if perigo.perigoso(t): continue
            abre('cheio', pl['passos']); r['tempo']['toques'].append((t['nome'], tempo.toque_ms(MAO, t['i'])))
    nome = '%s-%s-%s' % (pl['id'], TEMA, LETRA)
    json.dump(r, open(os.path.join(OUT, nome + '.json'), 'w'), ensure_ascii=False)
    open(os.path.join(OUT, nome + '.png'), 'wb').write(subprocess.run(['adb', 'exec-out', 'screencap', '-p'], capture_output=True).stdout)
    print('ok', nome, flush=True)

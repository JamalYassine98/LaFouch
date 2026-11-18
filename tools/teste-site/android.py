# S414: roda os casos no Chrome de verdade dentro de um Android emulado (GitHub). Liga pelo adb no Chrome (CDP),
# toca com toque de tela (Input.dispatchTouchEvent) e tira o print REAL do Android (screencap, com a barra do Chrome).
# uso: python3 android.py <saida> <rotulo da letra do Android, ex fonte100>
import os, subprocess, time, sys, re, json, urllib.request
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from casos import CASOS, init_js
import websocket
OUT, ROT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
MED = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'medidas.js'), encoding='utf-8').read()
def adb(*a): return subprocess.run(['adb'] + list(a), capture_output=True, text=True).stdout
def cap(n): open(os.path.join(OUT, n + '.png'), 'wb').write(subprocess.run(['adb', 'exec-out', 'screencap', '-p'], capture_output=True).stdout)
for i in range(60):
    if 'chrome_devtools_remote' in adb('shell', 'cat', '/proc/net/unix'): break
    time.sleep(2)
adb('forward', 'tcp:9223', 'localabstract:chrome_devtools_remote')
ps = []
for i in range(40):
    try:
        ps = [p for p in json.load(urllib.request.urlopen('http://127.0.0.1:9223/json')) if p.get('type') == 'page']
        if ps: break
    except Exception: pass
    time.sleep(2)
assert ps, 'Chrome sem depuração'
pg = [p for p in ps if '127.0.0.1:800' in p.get('url', '')] or ps
ws = websocket.create_connection(pg[0]['webSocketDebuggerUrl'], timeout=90, suppress_origin=True); N = [0]
def cdp(m, **p):
    N[0] += 1; ws.send(json.dumps({'id': N[0], 'method': m, 'params': p}))
    while True:
        r = json.loads(ws.recv())
        if r.get('id') == N[0]: return r
def ev(js):
    r = cdp('Runtime.evaluate', expression='(' + js + ')()', returnByValue=True, awaitPromise=True)
    return r.get('result', {}).get('result', {}).get('value')
def toque(x, y):
    cdp('Input.dispatchTouchEvent', type='touchStart', touchPoints=[{'x': x, 'y': y}]); time.sleep(.08)
    cdp('Input.dispatchTouchEvent', type='touchEnd', touchPoints=[])
cdp('Network.enable')
cdp('Network.setBlockedURLs', urls=['*firestore.googleapis.com*', '*identitytoolkit*', '*securetoken*', '*firebaseinstallations*', '*google-analytics*', '*googletagmanager*', '*recaptcha*'])
cdp('Network.setCacheDisabled', cacheDisabled=True)
info = ev("()=>({ua:navigator.userAgent,w:innerWidth,h:innerHeight,dpr:devicePixelRatio})"); print('aparelho', info, flush=True)
res = []
for nome, tema, letra, alvo in CASOS:
    for v in ('hoje', 'prop'):
        try:
            cdp('Page.navigate', url='http://127.0.0.1:%d/' % (8000 if v == 'hoje' else 8001)); time.sleep(3)
            ev("()=>{%s;return 1}" % init_js(tema, letra)); cdp('Page.reload', ignoreCache=True); time.sleep(4)
            if alvo:
                if alvo == '#home .hc': ev("()=>{document.querySelector('#home .hc').scrollIntoView({block:'center'});return 1}"); time.sleep(.8)
                p = ev("()=>{const r=document.querySelector(%s).getBoundingClientRect();return [r.left+r.width/2,r.top+Math.min(r.height/2,60)]}" % json.dumps(alvo))
                toque(p[0], p[1]); time.sleep(2.2)
            m = ev(MED) or {}; m.update(caso=nome, versao=v, motor='android-chrome', fonte_android=ROT, aparelho=info)
            cap('android-%s-%s-%s' % (ROT, nome, v))
        except Exception as e:
            m = dict(caso=nome, versao=v, motor='android-chrome', fonte_android=ROT, falhou=str(e)[:200])
        print(json.dumps(m, ensure_ascii=False), flush=True); res.append(m)
json.dump(res, open(os.path.join(OUT, 'android-%s-medidas.json' % ROT), 'w'), ensure_ascii=False, indent=1)

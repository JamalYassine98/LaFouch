# S385: roda no GitHub (Android emulado). Liga no WebView do app pelo adb (CDP puro), abre cada tela e tira o print REAL do Android (screencap).
import os,subprocess,time,sys,re,json,urllib.request
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from telas import C
C=[c for c in C if c[0] not in ('marketing-post',)]  # S385: no emulador do GitHub o Post do Marketing derruba o Android (sempre); fica de fora até investigar
PT=os.environ.get('PARTE','')
if PT: a,b=[int(x) for x in PT.split('/')];C=C[(a-1)*len(C)//b:a*len(C)//b]
import websocket
OUT=sys.argv[1];os.makedirs(OUT,exist_ok=True);TEMA=sys.argv[2]
def adb(*a): return subprocess.run(['adb']+list(a),capture_output=True,text=True).stdout
def cap(n): open(os.path.join(OUT,'%s-%s.png'%(TEMA,n)),'wb').write(subprocess.run(['adb','exec-out','screencap','-p'],capture_output=True).stdout)
def conecta():
  global ws
  sock=None
  for i in range(20):
    pid=adb('shell','pidof','com.lafouch.app').strip().split(' ')[0]
    u=adb('shell','cat','/proc/net/unix');todos=re.findall(r'@(webview_devtools_remote_(\d+))',u)
    m=[a for a,b in todos if b==pid] or [a for a,b in sorted(todos,key=lambda x:-int(x[1]))]
    if not pid and i%5==4: subprocess.run(['adb','shell','am','start','-n','com.lafouch.app/.MainActivity'],capture_output=True)
    if i%10==0: print('procura socket pid=%r achados=%r'%(pid,todos),flush=True)
    if m: sock=m[0];break
    time.sleep(2)
  assert sock,'WebView do app sem depuracao'
  adb('forward','tcp:9222','localabstract:'+sock)
  for i in range(30):
    try:
      ps=[p for p in json.load(urllib.request.urlopen('http://127.0.0.1:9222/json')) if p.get('type')=='page'];
      if ps: break
    except Exception: pass
    time.sleep(2)
  ws=websocket.create_connection(ps[0]['webSocketDebuggerUrl'],timeout=20,suppress_origin=True)
  return ws
N=[0];ws=conecta()
def cdp(m,**p):
  N[0]+=1;ws.send(json.dumps({'id':N[0],'method':m,'params':p}))
  while True:
    r=json.loads(ws.recv())
    if r.get('id')==N[0]: return r
def ev(js):
  r=cdp('Runtime.evaluate',expression='('+js+')()',returnByValue=True,awaitPromise=True)
  if 'exceptionDetails' in r.get('result',{}): return 'ERR'
  return r.get('result',{}).get('result',{}).get('value')
def espera(js,t=25):
  for i in range(t*4):
    try:
      if ev(js): return True
    except Exception: pass
    time.sleep(.25)
  return False
base=ev("()=>location.href.split('#')[0]")
K=[0];ORIG=ev("()=>location.origin")
log=open(os.path.join(OUT,'%s-log.txt'%TEMA),'w')
for nome,passos in C:
  try:
    cdp('Storage.clearDataForOrigin',origin=ORIG,storageTypes='all')
    ev("()=>{try{sessionStorage.clear();sessionStorage.setItem('lf_ni','1')}catch(e){};return 1}")
    K[0]+=1;cdp('Page.navigate',url=base+'?r=%d#test'%K[0]);time.sleep(2)
    espera("()=>!!window.__LF");time.sleep(1.5)
    ok=[]
    for p in passos:
      ok.append(ev(p));time.sleep(1.3)
    time.sleep(.5);cap(nome);log.write('%s %s\n'%(nome,ok));log.flush();print(nome,ok,flush=True)
  except Exception as e:
    log.write('%s FALHOU %s\n'%(nome,e));print(nome,'FALHOU',e,flush=True)
    try: subprocess.run(['adb','shell','am','start','-n','com.lafouch.app/.MainActivity']);time.sleep(10);conecta()
    except BaseException as e2: log.write('reconexao falhou %s — parei aqui\n'%e2);break
info=ev("()=>({ua:navigator.userAgent,data:new Date(2026,10,17).toLocaleDateString(),lang:navigator.language,w:innerWidth,h:innerHeight,dpr:devicePixelRatio,escuro:matchMedia('(prefers-color-scheme: dark)').matches})")
log.write('INFO %s\n'%info);print(info)

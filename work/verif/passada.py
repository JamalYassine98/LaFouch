# PASSADA COMPLETA (ordem do dono 18/11/2026 22:59): grava a MEMÓRIA DAS TELAS.
# Modo MODO=atual (app real, base=False) ou MODO=aprov (app + todos os aprovados, base=True).
# Por tela: aparência de cada botão/campo (escuro e claro), alinhamento (alin2), olho, foto,
# e cada botão tocado 3x (toque, toque de novo, toque depois de voltar) + erros de JS.
# Grava inv/<MODO>/<tela>.json  (atualizar só a tela que mudou: SO=tela1,tela2)
import sys,json,os,re,time;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit')
import kit,base_app
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
H='/home/claude/lafouch/work/verif/';src=open(H+'botoes.py').read()
LISTA=re.search(r'LISTA=r"""(.*?)"""',src,re.S).group(1).replace("const jan=[...document.querySelectorAll('.ljJn,.modal-box')].filter(vis).pop();","const jan=[...document.querySelectorAll('.ljJn,.modal-box,body *')].filter(x=>{if(!vis(x))return false;const c=getComputedStyle(x);if(c.position!='fixed')return false;const r=x.getBoundingClientRect();return r.height>160&&r.width>innerWidth*0.8&&!x.closest('nav')&&x.querySelector('button,input')}).pop();").replace("!e.closest('nav.bnav,#bnav,.bnav')","!e.closest('nav')");ESTADO=re.search(r'ESTADO=r"""(.*?)"""',src,re.S).group(1)
EXTRA=eval(re.search(r'^EXTRA=(\[.*\])$',open(H+'estilos.py').read(),re.M).group(1))
LOOK=re.search(r'J=r"""(.*?)"""',open(H+'estilos.py').read(),re.S).group(1)
LM="()=>{const S=__LF.S;S.lm={usd:{v:6487,c:6420},brl:{v:1196,c:1180},eur:{v:7100,c:7000},arb:{v:5.43,c:5.38},ts:Date.now(),hora:'15:00'};return 1}"
A2=open(H+'alin2.js').read();OLHO=open('/home/claude/lafouch/work/kit/olho.js').read()
CAMPOS=r"""()=>[...document.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=hidden]):not([type=file]),select,textarea')].filter(i=>{const r=i.getBoundingClientRect();return r.width>20&&r.height>10&&getComputedStyle(i).visibility!='hidden'}).map(i=>{const c=getComputedStyle(i),r=i.getBoundingClientRect(),pc=getComputedStyle(i.parentElement);const fundo=c.backgroundColor!='rgba(0, 0, 0, 0)';const caixa=fundo||parseFloat(c.borderTopWidth)>0;
 const lab=(i.closest('label,.row,.fld,div')||i.parentElement).innerText.trim().split('\n')[0].slice(0,30);
 return {tag:i.tagName,tipo:i.type||'',ph:(i.placeholder||'').slice(0,30),lab,cara:caixa?(parseFloat(c.borderTopLeftRadius)>=10?'caixa redonda':'caixa'):((parseFloat(c.borderBottomWidth)>0||parseFloat(pc.borderBottomWidth)>0)?'linha':'sem nada'),fundo,w:Math.round(r.width),h:Math.round(r.height),x:Math.round(r.x),alinh:c.textAlign,fs:c.fontSize}})"""
MODO=os.environ.get('MODO','atual');BASE=MODO=='aprov'
OUT=H+'inv/%s/'%MODO;os.makedirs(OUT+'img',exist_ok=True)
L=C+[e for e in EXTRA if e[0] not in dict(C)]
if os.environ.get('SO'): L=[t for t in L if t[0] in os.environ['SO'].split(',')]
P,N=[int(x) for x in os.environ.get('PARTE','0/1').split('/')];import zlib;L=[t for t in L if zlib.crc32((t[1][0] if t[1] else '').encode())%N==P]
def ctx(br,escuro):
  c=br.new_context(bypass_csp=True,viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark' if escuro else 'light',service_workers='block')
  c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') or r.request.url.startswith('http://127.') else r.abort())
  c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
  if BASE: c.add_init_script(base_app.script())
  return c
ERR=[];VISTOS={}
def abre(pg,ps):
  global CT
  if CT is not None:
    try: CT[0].close()
    except Exception: pass
  c=ctx(BR,True);pg=c.new_page();er=ERR;pg.on('pageerror',lambda e:er.append(str(e)[:100]));CT=[c]
  pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(500);pg.evaluate(LM)
  for p in ps:
    try: pg.evaluate(p)
    except Exception: pass
    pg.wait_for_timeout(550)
  pg.wait_for_timeout(250);return pg
CT=None
def abre2(pg,ps):
  pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(500);pg.evaluate(LM)
  for p in ps:
    try: pg.evaluate(p)
    except Exception: pass
    pg.wait_for_timeout(550)
  pg.wait_for_timeout(250)
ACHA="(b)=>{const L=[...document.querySelectorAll('button,[role=button],a[href],[data-act]')].filter(e=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);return r.width>2&&r.height>2&&c.visibility!='hidden'&&+c.opacity>0.05});return L.find(e=>(e.dataset.act||'')==b.act&&(e.dataset.id||'')==b.id&&(e.innerText||e.getAttribute('aria-label')||e.title||'').trim().replace(/\\s+/g,' ').slice(0,40)==b.txt)||null}"
def toca(pg,b,e0):
  el=pg.evaluate_handle(ACHA,b)
  if not pg.evaluate("e=>!!e",el): return ['sumiu'],None
  pre=pg.evaluate("(e)=>[e.getAttribute('aria-pressed'),e.getAttribute('aria-expanded'),e.className,e.innerText]",el)
  try:
    pg.evaluate("(e)=>e.scrollIntoView({block:'center',behavior:'instant'})",el);pg.wait_for_timeout(200)
    if not pg.evaluate("e=>e.isConnected",el): el=pg.evaluate_handle(ACHA,b)
    bx=pg.evaluate("(e)=>{const r=e.getBoundingClientRect();const x=r.x+r.width/2,y=r.y+r.height/2;const h=document.elementFromPoint(x,y);return [x,y,!!h&&(h===e||e.contains(h))]}",el)
    if bx[2]: pg.mouse.click(bx[0],bx[1])   # toque de verdade, onde o dedo tocaria
    else: pg.evaluate("(e)=>{const r=e.getBoundingClientRect(),o={bubbles:true,cancelable:true,clientX:r.x+r.width/2,clientY:r.y+r.height/2,pointerId:1,pointerType:'touch',isPrimary:true,button:0};e.dispatchEvent(new PointerEvent('pointerdown',o));e.dispatchEvent(new MouseEvent('mousedown',o));e.dispatchEvent(new PointerEvent('pointerup',o));e.dispatchEvent(new MouseEvent('mouseup',o));e.click()}",el)   # coberto/fora da tela: toque simulado completo
  except Exception:
    pg.evaluate("(e)=>e.click()",el)
  pg.wait_for_timeout(650)
  e1=pg.evaluate(ESTADO);pos=pg.evaluate("(e)=>e&&e.isConnected?[e.getAttribute('aria-pressed'),e.getAttribute('aria-expanded'),e.className,e.innerText]:null",el)
  ef=[]
  if e1['view']!=e0['view']: ef.append('leva → '+e1['view'])
  nj=[x for x in e1['jan'] if x not in e0['jan']]
  if nj: ef.append('abre janela "'+nj[0]+'"')
  if len(e1['jan'])>len(e0['jan'])+1: ef.append('DUAS JANELAS')
  if e1['cf']: ef.append('pede confirmação')
  if e1['toast']: ef.append('aviso: '+e1['toast'][0])
  if pre and pos and (pre[0]!=pos[0] or pre[1]!=pos[1] or (('on' in (pre[2] or '').split())!=('on' in (pos[2] or '').split()))): ef.append('alterna')
  if not ef and abs(e1['len']-e0['len'])>3: ef.append('muda a tela')
  return ef or ['nada visível'],e1
kit.serve(os.path.join(kit.RAIZ,'www'),kit.PA)
with sync_playwright() as pw:
  br=BR=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
  for nome,ps in L:
    t0=time.time();R={'tela':nome,'modo':MODO,'quando':time.strftime('%d/%m %H:%M'),'passos':ps}
    for escuro in (True,False):
      c=ctx(br,escuro);pg=c.new_page();er=[];pg.on('pageerror',lambda e,er=er:er.append(str(e)[:100]))
      abre2(pg,ps);k='escuro' if escuro else 'claro'
      R[k]={'botoes':pg.evaluate(LOOK),'campos':pg.evaluate(CAMPOS),'alin':pg.evaluate(A2),'olho':pg.evaluate(OLHO) or [],'erros_js':list(er),
            'rola_vazio':pg.evaluate("()=>{const m=document.scrollingElement;return m.scrollHeight-innerHeight}")}
      pg.screenshot(path=OUT+'img/%s-%s.jpg'%(nome,k),type='jpeg',quality=70,full_page=True)
      if escuro:
        bs=pg.evaluate(LISTA);e0=pg.evaluate(ESTADO);R['vista']=e0['view'];toq=[];sujo=False
        for b in bs[:45]:
          kk=(R['vista'],b['act'],b['id'],re.sub(r'\d+','#',b['txt']))
          if kk in VISTOS and not os.environ.get('TUDO'): toq.append(dict(b,igual_a=VISTOS[kk]));continue
          VISTOS[kk]=nome
          ERR.clear()
          try:
            if sujo: pg=abre(None,ps);e0=pg.evaluate(ESTADO)
            ef1,e1=toca(pg,b,e0);ef2=['—']
            if e1 is not None: ef2,_=toca(pg,b,e1)   # toque de novo, sem voltar
            pg=abre(None,ps);e0=pg.evaluate(ESTADO);ef3,_=toca(pg,b,e0);sujo=True
            bug=[]
            if ef3!=ef1: bug.append('3º toque diferente do 1º')
            if any('DUAS' in x for x in ef1+ef2+ef3): bug.append('abre duas janelas')
            if ERR: bug.append('erro JS: '+ERR[0])
            toq.append(dict(b,efeito=ef1,de_novo=ef2,bug=bug))
          except Exception as ex: toq.append(dict(b,efeito=['erro: '+str(ex)[:60]],bug=['falhou ao tocar']));sujo=True
        R['toques']=toq
      c.close()
    R['seg']=round(time.time()-t0)
    json.dump(R,open(OUT+nome+'.json','w'),ensure_ascii=False,indent=0);print(nome,len(R.get('toques',[])),R['seg'],'s',flush=True)
  br.close()

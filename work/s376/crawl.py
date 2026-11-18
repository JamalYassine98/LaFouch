# S377: anda pelo app SÓ pelo que aparece na tela (a partir do Início e da barra), tocando com o dedo, até 4 níveis.
# Em cada tela nova: mede os botões (btn.js + olho), anota erros, e no fim junta a cobertura (quais funções rodaram).
import sys,os,json,time,hashlib;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,kit
from playwright.sync_api import sync_playwright
W=int(os.environ.get('W','0'));NW=int(os.environ.get('NW','1'));PROF=int(os.environ.get('PROF','4'));CAP=int(os.environ.get('CAP','260'));DEV=os.environ.get('DEV','celular')
BTN=open('btn.js').read();OLHO=open('/home/claude/lafouch/work/kit/olho.js').read()
src=open('audita.py').read();exec(src[src.index('PNG='):src.index('ABRE=')])  # RICO
LISTA=r"""()=>{const vis=e=>{const r=e.getBoundingClientRect();if(r.width<4||r.height<4||r.bottom<0||r.top>document.documentElement.scrollHeight)return false;let p=e;while(p){if(p.hidden)return false;const cs=getComputedStyle(p);if(cs.display=='none'||cs.visibility=='hidden'||+cs.opacity<0.05)return false;p=p.parentElement}return true};
 const ovs=[...document.querySelectorAll('.ljJn,.lfa-sh,.modal,.cxAcao,#filtBox,.fjJn,#lfDesf.on')].filter(o=>{const r=o.getBoundingClientRect();return r.height>40&&vis(o)});
 const raiz=ovs.length?ovs[ovs.length-1]:document.body;
 const els=[...raiz.querySelectorAll('button,a[href],[role=button],[data-act],summary,label.sw,input[type=checkbox]')].filter(vis).filter(e=>ovs.length||!e.closest('.ljJn,.lfa-sh,.modal'));
 const out=[];const ks=new Set();for(const e of els){if(e.disabled)continue;const t=(e.innerText||e.getAttribute('aria-label')||e.title||e.value||'').trim().replace(/\s+/g,' ').slice(0,40);const k=t.replace(/\d+/g,'#')+'|'+(e.dataset.act||'')+'|'+e.tagName;if(ks.has(k))continue;ks.add(k);out.push(k)}
 const tit=(ovs.length?(ovs[ovs.length-1].querySelector('b,h2,h3')||{}).textContent:'')||'';return {ks:out,sig:(window.__LF.S.view||'')+'|'+tit.trim().slice(0,30)+'|'+(document.querySelector('.view:not([hidden]) h1')||{textContent:''}).textContent.trim().slice(0,30)}}"""
TOCA=r"""(k)=>{const vis=e=>{const r=e.getBoundingClientRect();if(r.width<4||r.height<4)return false;let p=e;while(p){if(p.hidden)return false;const cs=getComputedStyle(p);if(cs.display=='none'||cs.visibility=='hidden'||+cs.opacity<0.05)return false;p=p.parentElement}return true};
 const ovs=[...document.querySelectorAll('.ljJn,.lfa-sh,.modal,.cxAcao,#filtBox,.fjJn,#lfDesf.on')].filter(o=>{const r=o.getBoundingClientRect();return r.height>40&&vis(o)});const raiz=ovs.length?ovs[ovs.length-1]:document.body;
 const e=[...raiz.querySelectorAll('button,a[href],[role=button],[data-act],summary,label.sw,input[type=checkbox]')].filter(vis).find(e=>{const t=(e.innerText||e.getAttribute('aria-label')||e.title||e.value||'').trim().replace(/\s+/g,' ').slice(0,40);return t.replace(/\d+/g,'#')+'|'+(e.dataset.act||'')+'|'+e.tagName===k});
 if(!e)return null;e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();const x=r.left+r.width/2,y=r.top+r.height/2;const h=document.elementFromPoint(x,y);return {x,y,ok:!!h&&(h===e||e.contains(h)||h.contains(e)),quem:h?(h.innerText||h.getAttribute('aria-label')||h.className||'').toString().trim().slice(0,40):''}}"""
STUB="()=>{window.open=()=>({closed:false,focus(){},close(){}});window.print=()=>{};try{navigator.share=()=>Promise.resolve();navigator.canShare=()=>true}catch(e){};try{navigator.mediaDevices.getUserMedia=()=>Promise.reject(new Error('sem camera no teste'))}catch(e){};HTMLInputElement.prototype.click=function(){};window.alert=()=>{};window.confirm=()=>true;window.prompt=()=>''}"
COV=set();estados={};achados=[];
def nova(b):
  Wd,H,TQ,dpr=ap.TAM[DEV]
  c=b.new_context(bypass_csp=True,viewport={'width':Wd,'height':H},device_scale_factor=1,is_mobile=TQ,has_touch=TQ,locale='pt-BR',color_scheme='light',service_workers='block')
  c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else (r.fulfill(status=200,body='{"documents":[]}',content_type='application/json') if 'googleapis' in r.request.url else r.abort()))
  c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");pg=c.new_page();pg.on('popup',lambda p:p.close());pg.on('dialog',lambda d:d.dismiss())
  cdp=c.new_cdp_session(pg);cdp.send('Profiler.enable');cdp.send('Profiler.startPreciseCoverage',{'callCount':True,'detailed':False})
  pg.erros=[];pg.on('pageerror',lambda e:pg.erros.append(str(e)[:160]))
  pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(600)
  pg.evaluate(RICO);pg.evaluate(STUB);pg.evaluate("()=>window.__LF.render&&window.__LF.render()");pg.wait_for_timeout(500)
  return c,pg,cdp
def fecha(c,cdp):
  try:
    r=cdp.send('Profiler.takePreciseCoverage')
    for sc in r['result']:
      if sc['url'].endswith('/app.js'):
        for fn in sc['functions']:
          if fn['ranges'][0]['count']>0: COV.add(fn['ranges'][0]['startOffset'])
  except Exception: pass
  c.close()
def toca(pg,k):
  a=pg.evaluate(TOCA,k)
  if not a: return None
  pg.wait_for_timeout(120);(pg.mouse.click if DEV=='pc' else pg.touchscreen.tap)(a['x'],a['y']);pg.wait_for_timeout(650);return a
fila=[[]];vis=set();n=0;t0=time.time()
with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
  while fila and n<CAP:
    cam=fila.pop(0)
    if len(cam)==1 and (int(hashlib.md5(cam[0].encode()).hexdigest(),16)%NW)!=W: continue
    if len(cam)>=1 and W and len(cam)==0: continue
    c,pg,cdp=nova(b);ok=True;erro0=0
    for i,k in enumerate(cam):
      erro0=len(pg.erros);a=toca(pg,k)
      if a is None: ok=False;break
      if i==len(cam)-1:
        if not a['ok']: achados.append(dict(tipo='toque cai em outro',cam=cam,quem=a['quem']))
        if len(pg.erros)>erro0: achados.append(dict(tipo='erro',cam=cam,erro=pg.erros[erro0]))
    if not ok: fecha(c,cdp);continue
    L=pg.evaluate(LISTA);sig=L['sig']+'|'+hashlib.md5('§'.join(sorted(L['ks'])).encode()).hexdigest()[:8]
    n+=1
    if sig in vis: fecha(c,cdp);continue
    vis.add(sig)
    try: bt=pg.evaluate(BTN);ol=pg.evaluate(OLHO) or []
    except Exception: bt=[];ol=[]
    estados[sig]=dict(cam=cam,btn=bt,olho=ol)
    if len(cam)<PROF:
      for k in L['ks']: fila.append(cam+[k])
    fecha(c,cdp)
    if n%20==0:
      print(W,'telas',len(vis),'toques',n,'fila',len(fila),int(time.time()-t0),'s',flush=True)
      json.dump(dict(cov=sorted(COV),estados=estados,achados=achados),open('crawl_%s_%d.json'%(DEV,W),'w'),ensure_ascii=False)
  b.close()
json.dump(dict(cov=sorted(COV),estados=estados,achados=achados),open('crawl_%s_%d.json'%(DEV,W),'w'),ensure_ascii=False)
print('FIM',W,'telas',len(vis),'toques',n,int(time.time()-t0),'s')

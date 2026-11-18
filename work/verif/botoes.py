# Inventário de FUNÇÃO dos botões: toca cada botão visível de cada tela (página nova a cada toque) e anota o efeito.
import sys,json,os,time;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,base_app,kit
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
LM="()=>{const S=__LF.S;S.lm={usd:{v:6487,c:6420},brl:{v:1196,c:1180},eur:{v:7100,c:7000},arb:{v:5.43,c:5.38},ts:Date.now(),hora:'15:00'};return 1}"
EXTRA=[('cambio',["()=>__LF.setView('fx')"]),('clientes',["()=>__LF.setView('clientes')"]),('atacado',["()=>__LF.inicioGo('ata')"]),('inicio',[]),('vender',["()=>__LF.setView('venda')"]),('ajustes',["()=>__LF.setView('ajustes')"])]
PARTE=os.environ.get('PARTE','1/1');a,bb=[int(x) for x in PARTE.split('/')]
TELAS=(C+EXTRA)[(a-1)*len(C+EXTRA)//bb:a*len(C+EXTRA)//bb]
LISTA=r"""()=>{const vis=e=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);return r.width>2&&r.height>2&&c.visibility!='hidden'&&+c.opacity>0.05};
 const jan=[...document.querySelectorAll('.ljJn,.modal-box')].filter(vis).pop();
 return [...document.querySelectorAll('button,[role=button],a[href],[data-act]')].filter(e=>vis(e)&&!e.closest('nav.bnav,#bnav,.bnav')&&(!jan||jan.contains(e))).map((e,i)=>({i,act:e.dataset.act||'',id:e.dataset.id||'',txt:(e.innerText||e.getAttribute('aria-label')||e.title||'').trim().replace(/\s+/g,' ').slice(0,40),tag:e.tagName}))}"""
ESTADO=r"""()=>{const vis=e=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);return r.width>2&&r.height>2&&c.visibility!='hidden'&&+c.opacity>0.05};
 const j=[...document.querySelectorAll('body *')].filter(x=>{if(!vis(x))return false;const c=getComputedStyle(x);if(c.position!='fixed')return false;const r=x.getBoundingClientRect();return r.height>160&&r.width>innerWidth*0.8&&!x.closest('nav,.bnav')&&x.innerText.trim().length>10}).map(x=>x.innerText.trim().split('\n')[0].slice(0,40));
 const cf=!!document.querySelector('.cf418,.lfCf');const toast=[...document.querySelectorAll('.toast,.lfToast,[class*=toast],[class*=Desf]')].filter(vis).map(x=>x.innerText.trim().slice(0,40));
 return {view:__LF.S.view,hash:location.hash,jan:j,cf,toast,len:document.body.innerText.length,txt:document.body.innerText.slice(0,4000)}}"""
def ctx(br):
  c=br.new_context(bypass_csp=True,viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark',service_workers='block')
  c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') or r.request.url.startswith('http://127.') else r.abort())
  c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.add_init_script(base_app.script())
  return c
def abre(br,ps):
  c=ctx(br);pg=c.new_page();pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(700)
  pg.evaluate(LM)
  for p in ps:
    try: pg.evaluate(p)
    except Exception: pass
    pg.wait_for_timeout(700)
  pg.wait_for_timeout(300);return c,pg
R={}
with sync_playwright() as pw:
  br=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
  for nome,ps in TELAS:
    c,pg=abre(br,ps);bs=pg.evaluate(LISTA);e0=pg.evaluate(ESTADO);c.close();res=[]
    for b in bs[:40]:
      c,pg=abre(br,ps)
      try:
        el=pg.evaluate_handle("(b)=>{const L=[...document.querySelectorAll('button,[role=button],a[href],[data-act]')].filter(e=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);return r.width>2&&r.height>2&&c.visibility!='hidden'&&+c.opacity>0.05});return L.find(e=>(e.dataset.act||'')==b.act&&(e.dataset.id||'')==b.id&&(e.innerText||e.getAttribute('aria-label')||e.title||'').trim().replace(/\\s+/g,' ').slice(0,40)==b.txt)||null}",b)
        pre=pg.evaluate("(e)=>e?[e.getAttribute('aria-pressed'),e.getAttribute('aria-expanded'),e.className,e.innerText]:null",el)
        pg.evaluate("(e)=>{if(e){e.scrollIntoView({block:'center'});e.click()}}",el);pg.wait_for_timeout(900)
        e1=pg.evaluate(ESTADO)
        pos=pg.evaluate("(e)=>e&&e.isConnected?[e.getAttribute('aria-pressed'),e.getAttribute('aria-expanded'),e.className,e.innerText]:null",el)
        ef=[]
        if e1['view']!=e0['view']: ef.append('leva → '+e1['view'])
        nj=[x for x in e1['jan'] if x not in e0['jan']]
        if nj: ef.append('abre janela "'+nj[0]+'"')
        if e1['cf']: ef.append('pede confirmação')
        if e1['toast']: ef.append('aviso: '+e1['toast'][0])
        if pre and pos and (pre[0]!=pos[0] or pre[1]!=pos[1] or (('on' in (pre[2] or '').split())!=('on' in (pos[2] or '').split()))): ef.append('alterna')
        if not ef and abs(e1['len']-e0['len'])>3: ef.append('muda a tela (%+d letras)'%(e1['len']-e0['len']))
        if not ef: ef.append('nada visível')
      except Exception as ex: ef=['erro: '+str(ex)[:60]]
      res.append(dict(b,efeito=ef));c.close()
    R[nome]=res;print(nome,len(res),flush=True)
  br.close()
json.dump(R,open('/tmp/verif/botoes_%s.json'%PARTE.replace('/','de'),'w'),ensure_ascii=False,indent=0)

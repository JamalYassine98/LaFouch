# S376b: toca em TODOS os botões de cada tela (dedo de verdade, no centro do botão) e anota o que aconteceu.
# Se o toque abre uma janela, mede e toca também os botões de dentro dela (1 nível). Sem efeito / erro / toque cai em outro elemento = suspeito.
import sys,os,json,time;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,kit
from playwright.sync_api import sync_playwright
exec(open('audita.py').read().split('res={}')[0].split("BTN=open")[0])  # imports
src=open('audita.py').read();exec(src[src.index('BTN='):src.index('res={}')])
LISTA=r"""(raiz)=>{const R=raiz?document.querySelector(raiz):document;const vis=e=>{const r=e.getBoundingClientRect();if(r.width<4||r.height<4)return false;let p=e;while(p){if(p.hidden||getComputedStyle(p).display=='none')return false;p=p.parentElement}const cs=getComputedStyle(e);return cs.visibility!='hidden'&&+cs.opacity>0.05};
 const ov=document.querySelector('.ljJn,.lfa-sh.on,.lfa-sh.show,.modal:not([hidden]),.cxAcao.on,#filtBox:not([hidden])');
 const base=raiz?R:(ov&&!raiz?null:R);
 const els=[...(R||document).querySelectorAll('button,a[href],[role=button],[data-act],summary,label.sw,.chip,.tl')].filter(vis).filter(e=>!e.closest('#mainnav,.mainnav')&&!(raiz==null&&e.closest('.ljJn,.lfa-sh,.modal,#lfDesf,.lfa-toast')));
 const vistos=new Set(),out=[];for(const e of els){if([...vistos].some(v=>v.contains(e)))continue;vistos.add(e);const t=(e.innerText||e.getAttribute('aria-label')||e.title||'').trim().replace(/\s+/g,' ').slice(0,45);const k=t+'|'+(e.dataset.act||'');if(out.some(o=>o.k===k)){continue}out.push({k,t,a:e.dataset.act||'',i:out.length});e.setAttribute('data-q376',out.length-1)}return out}"""
MARCA=r"""()=>{const H=x=>{let h=0;for(let i=0;i<x.length;i++)h=(h*31+x.charCodeAt(i))|0;return h};const st=()=>{try{return H(JSON.stringify(window.__LF.S,(k,v)=>typeof v==='string'&&v.length>300?v.length:v))}catch(e){return 0}};window.__t0=H(document.body.innerText);window.__s0=st();window.__mut=0;if(!window.__mo){window.__mo=new MutationObserver(m=>{window.__mut+=m.length});window.__mo.observe(document.body,{subtree:true,childList:true,attributes:true,characterData:true})}window.__v0=window.__LF.S.view;window.__y0=scrollY;window.__f0=document.activeElement;window.open=()=>({});window.print=()=>{};try{navigator.share=()=>Promise.resolve()}catch(e){};HTMLInputElement.prototype.showPicker=()=>{};return 1}"""
ALVO=r"""(i)=>{const e=document.querySelector('[data-q376="'+i+'"]');if(!e)return null;e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();const x=r.left+r.width/2,y=r.top+r.height/2;const h=document.elementFromPoint(x,y);const ok=h&&(h===e||e.contains(h)||h.contains(e));return {x,y,ok,quem:h?(h.innerText||h.className||h.tagName).toString().trim().slice(0,40):''}}"""
EFEITO=r"""()=>{const H=x=>{let h=0;for(let i=0;i<x.length;i++)h=(h*31+x.charCodeAt(i))|0;return h};const st=()=>{try{return H(JSON.stringify(window.__LF.S,(k,v)=>typeof v==='string'&&v.length>300?v.length:v))}catch(e){return 0}};const ov=[...document.querySelectorAll('.ljJn,.lfa-sh,.modal,.cxAcao,#filtBox,.fjJn')].find(o=>{const r=o.getBoundingClientRect();return r.height>40&&r.bottom>0&&r.top<innerHeight&&getComputedStyle(o).display!='none'&&getComputedStyle(o).visibility!='hidden'&&!o.hidden});return {txt:H(document.body.innerText)!==window.__t0,est:st()!==window.__s0,v:window.__LF.S.view!==window.__v0,y:Math.abs(scrollY-window.__y0)>20,foco:document.activeElement!==window.__f0&&document.activeElement!==document.body,ov:ov?(ov.className.toString().slice(0,30)):'' ,ovSel:ov?(ov.id?'#'+ov.id:'.'+ov.className.toString().split(' ')[0]):''}}"""
FILE=os.environ.get('OUT','clica.json');ONLY=os.environ.get('SO')
res=[]
def nova(b,esc,dev='celular'):
  W,H,TQ,dpr=ap.TAM[dev]
  c=b.new_context(bypass_csp=True,viewport={'width':W,'height':H},device_scale_factor=1,is_mobile=TQ,has_touch=TQ,locale='pt-BR',color_scheme='dark' if esc else 'light',service_workers='block')
  c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else (r.fulfill(status=200,body='{"documents":[]}',content_type='application/json') if 'googleapis' in r.request.url else r.abort()))
  c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");pg=c.new_page()
  pg.on('popup',lambda p:p.close())
  pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(700)
  return c,pg
def cena(pg,js,abre):
  pg.evaluate(RICO);pg.evaluate(js);pg.wait_for_timeout(1300)
  if abre: pg.evaluate(ABRE);pg.wait_for_timeout(700)
with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
  for nome,js,abre in CENAS:
    if ONLY and nome not in ONLY.split(','): continue
    t0=time.time()
    c,pg=nova(b,False);erros=[];pg.on('pageerror',lambda e:erros.append(str(e)[:140]))
    cena(pg,js,abre);lista=pg.evaluate(LISTA,None)
    pg.evaluate(MARCA);pg.wait_for_timeout(850);ruido=pg.evaluate(EFEITO);c.close()
    for it in lista[:45]:
      c,pg=nova(b,False);erros=[];pg.on('pageerror',lambda e:erros.append(str(e)[:140]))
      try:
        cena(pg,js,abre);l2=pg.evaluate(LISTA,None);idx=[x['i'] for x in l2 if x['k']==it['k']]
        if not idx: c.close();continue
        a=pg.evaluate(ALVO,idx[0]);pg.wait_for_timeout(150);pg.evaluate(MARCA)
        if not a: c.close();continue
        pg.touchscreen.tap(a['x'],a['y']);pg.wait_for_timeout(700)
        ef=pg.evaluate(EFEITO);sub=[]
        if ef['ov']:
          # mede e toca os botões de dentro da janela (visual)
          sb=pg.evaluate("(s)=>{const o=document.querySelector(s);return o?1:0}",ef['ovSel'])
          vb=pg.evaluate(BTN) or []
          sub=[x for x in vb if True]
        res.append(dict(ruido=ruido.get('txt'),cena=nome,botao=it['t'],act=it['a'],caiu_em=None if a['ok'] else a['quem'],efeito=ef,erros=erros[:2],janela_btn=sub[:12]))
      except Exception as e:
        res.append(dict(ruido=ruido.get('txt'),cena=nome,botao=it['t'],act=it['a'],falha=str(e)[:120],erros=erros[:2]))
      c.close()
    print(nome,len(lista),'botões',int(time.time()-t0),'s',flush=True)
    json.dump(res,open(FILE,'w'),ensure_ascii=False,indent=0)
  b.close()

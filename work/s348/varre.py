# S348: varre o app REAL (dados de teste): em cada tela toca cada botão; se subir uma folha/janela, tenta fechar (1) arrastando a alça
# para baixo, (2) tocando fora, (3) Esc no PC. Só leitura do resultado; dados de teste. Uso: varre.py celular|tablet|pc
import sys,json,os;alvo=sys.argv[1];sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
from playwright.sync_api import sync_playwright
kit.serve(os.path.join(kit.RAIZ,'www'),kit.PA)
TAM={'celular':(390,844,True),'tablet':(820,1180,True),'pc':(1366,768,False)}[alvo];W,H,TQ=TAM
TELAS=['inicio','vendas','estoque','caixa','desp','fx','clientes','ped','onl','dash','hist','ajustes','dia','notif']
CAND="""()=>{const v=[...document.querySelectorAll('.view')].find(e=>e.offsetParent)||document.body;const o=[];[...document.querySelectorAll('button,[data-act],[role=button],summary,.pcard[data-ref]')].forEach((e,i)=>{if(!e.offsetParent||e.closest('#mainnav')||e.disabled)return;const r=e.getBoundingClientRect();if(r.width<8||r.height<8)return;const t=((e.getAttribute('aria-label')||e.innerText||e.getAttribute('data-act')||'')+'').replace(/\\s+/g,' ').trim().slice(0,38);const k=(e.getAttribute('data-act')||'')+'|'+t.replace(/[0-9.,]+/g,'#');if(/mcLiga|modo cliente|modo loja|sair|logout|apag|exclu|zerar|restaur|backup|export|import|imprim|instalar|apkgo|bio|sincron/i.test(k))return;if(o.some(x=>x.k===k))return;if(e.classList.contains('pcard')&&o.filter(x=>x.pc).length>=2)return;e.setAttribute('data-vz',o.length);o.push({k,t,pc:e.classList.contains('pcard')})});return o}"""
MARCA="""()=>{document.querySelectorAll('[data-vz]').forEach(e=>e.removeAttribute('data-vz'));let n=0;const vis=[];[...document.querySelectorAll('button,[data-act],[role=button],summary,.pcard[data-ref]')].forEach(e=>{if(!e.offsetParent||e.closest('#mainnav')||e.disabled)return;const r=e.getBoundingClientRect();if(r.width<8||r.height<8)return;const t=((e.getAttribute('aria-label')||e.innerText||e.getAttribute('data-act')||'')+'').replace(/\\s+/g,' ').trim().slice(0,38);const k=(e.getAttribute('data-act')||'')+'|'+t.replace(/[0-9.,]+/g,'#');if(vis.includes(k))return;vis.push(k);e.setAttribute('data-vz',k)})}"""
ACHA="""()=>{const c=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);if(s.position!=='fixed'&&s.position!=='absolute')return false;if(s.display==='none'||s.visibility==='hidden'||+s.opacity<.5)return false;const r=e.getBoundingClientRect();if(r.width<260||r.height<140)return false;if(e.id==='mainnav'||e.closest('#mainnav')||e.classList.contains('view'))return false;const z=+s.zIndex||0;if(z<20)return false;const rad=parseFloat(s.borderTopLeftRadius)||0;return rad>=10&&r.top>=-2&&r.bottom<=innerHeight+40});
 const f=c.sort((a,b)=>(+getComputedStyle(b).zIndex||0)-(+getComputedStyle(a).zIndex||0)||a.getBoundingClientRect().height-b.getBoundingClientRect().height)[0];if(!f)return null;document.querySelectorAll('[data-fl]').forEach(e=>e.removeAttribute('data-fl'));f.setAttribute('data-fl','1');const r=f.getBoundingClientRect();
 const al=[...f.querySelectorAll('*')].find(e=>{const q=e.getBoundingClientRect();return q.width>=28&&q.width<=80&&q.height>=3&&q.height<=8&&q.top-r.top<26});
 return {id:(f.id?'#'+f.id:'.'+(f.className+'').trim().split(/\\s+/).slice(0,2).join('.')),topo:Math.round(r.top),esq:Math.round(r.left),larg:Math.round(r.width),alt:Math.round(r.height),embaixo:r.bottom>=innerHeight-24,alca:!!al,titulo:((f.querySelector('h1,h2,h3,.ljHd b,.cg-tt,b')||{}).innerText||'').replace(/\\s+/g,' ').slice(0,34)}}"""
ABERTA="()=>{const f=document.querySelector('[data-fl]');if(!f||!f.isConnected)return false;const r=f.getBoundingClientRect(),s=getComputedStyle(f);return r.height>100&&r.top<innerHeight-60&&r.bottom>60&&s.display!=='none'&&s.visibility!=='hidden'&&+s.opacity>.3}"
R={};
B=[None];C=[None]
def novo(pw):
    if not B[0]: B[0]=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
    if C[0]:
        try: C[0].close()
        except Exception: pass
    b=B[0];c=C[0]=b.new_context(bypass_csp=True,viewport={'width':W,'height':H},device_scale_factor=1,is_mobile=TQ,has_touch=TQ,locale='pt-BR',color_scheme='dark',service_workers='block')
    c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') or r.request.url.startswith('http://127.') else r.abort())
    c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");pg=c.new_page();pg.set_default_timeout(9000);return pg
def vai(pw,tela):
    pg=novo(pw);pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(800)
    if tela!='inicio': pg.evaluate("t=>window.__LF.setView(t)",tela);pg.wait_for_timeout(700)
    return pg
def arrasta(pg,x,y0):
    if TQ:
        cdp=pg.context.new_cdp_session(pg)
        cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y0}]})
        for k in range(1,9): cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y0+k*40}]});pg.wait_for_timeout(30)
        cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
    else:
        pg.mouse.move(x,y0);pg.mouse.down()
        for k in range(1,9): pg.mouse.move(x,y0+k*40);pg.wait_for_timeout(30)
        pg.mouse.up()
    pg.wait_for_timeout(800)
def reabre(pw,tela,k):
    pg=vai(pw,tela);pg.evaluate(MARCA)
    e=pg.query_selector('[data-vz="%s"]'%k.replace('\\','\\\\').replace('"','\\"'))
    if not e: return pg,None
    try: e.click(timeout=1500)
    except Exception: return pg,None
    pg.wait_for_timeout(1100);return pg,pg.evaluate(ACHA)
with sync_playwright() as pw:
    for tela in TELAS:
        try: pg=vai(pw,tela);cs=pg.evaluate(CAND)
        except Exception as e: print(tela,'ERRO',str(e)[:80]);continue
        print('#',tela,len(cs),flush=True)
        for c in cs[:40]:
            print(' >',c['k'][:50],flush=True)
            try:
                pg,f=reabre(pw,tela,c['k'])
                if not f: continue
                ch=f['id']+' · '+f['titulo']
                if ch in R: continue
                r={'tela':tela,'botao':c['t'],'folha':f['id'],'titulo':f['titulo'],'embaixo':f['embaixo'],'alca':f['alca'],'alt':f['alt']}
                arrasta(pg,f['esq']+f['larg']//2,f['topo']+10);r['arrastar']=not pg.evaluate(ABERTA)
                pg,f2=reabre(pw,tela,c['k'])
                if f2:
                    x,y=(f2['esq']+f2['larg']//2,f2['topo']-40) if f2['topo']>70 else (max(6,f2['esq']-30),H//2)
                    if f2['topo']<=70 and f2['esq']<=40: r['fora']=None
                    else:
                        (pg.touchscreen.tap(x,y) if TQ else pg.mouse.click(x,y));pg.wait_for_timeout(800);r['fora']=not pg.evaluate(ABERTA)
                if not TQ:
                    pg,f3=reabre(pw,tela,c['k'])
                    if f3: pg.keyboard.press('Escape');pg.wait_for_timeout(700);r['esc']=not pg.evaluate(ABERTA)
                R[ch]=r;print(json.dumps(r,ensure_ascii=False),flush=True)
            except Exception as e: print(tela,c['t'],'ERRO',str(e)[:90],flush=True)
    B[0].close()
json.dump(list(R.values()),open('/home/claude/lafouch/work/s348/varre-%s.json'%alvo,'w'),ensure_ascii=False,indent=0)
print('FIM',len(R))

# S330: estudo das animações do SITE em uso (cópia do kit, celular): o que realmente roda em cada passo — duração, curva, o que mexe, quique, sem fim, "reduzir movimento", cópias do painel (fantasma). Só leitura.
import sys,os,json,collections,re;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
from playwright.sync_api import sync_playwright
kit.prep_site();kit.serve(kit.SITE,kit.PS)
COLHE="""()=>document.getAnimations().map(a=>{const e=a.effect,t=e&&e.getComputedTiming?e.getComputedTiming():{},el=e&&e.target;let kf=[];try{kf=e.getKeyframes()}catch(_){}
  const props=[...new Set(kf.flatMap(k=>Object.keys(k)).filter(k=>!['offset','easing','composite','computedOffset'].includes(k)))];
  const nome=el?(el.id?'#'+el.id:el.tagName.toLowerCase()+(el.classList&&el.classList.length?'.'+[...el.classList].slice(0,2).join('.'):'')):'?';
  const r=el&&el.getBoundingClientRect?el.getBoundingClientRect():{width:0,height:0,top:9e9};const vis=r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0;
  return {n:a.animationName||(a.transitionProperty?'transição:'+a.transitionProperty:'script'),el:nome,dur:Math.round(t.duration||0),it:t.iterations===Infinity?'sem fim':t.iterations,curva:(t.easing||''),curvasKf:[...new Set(kf.map(k=>k.easing).filter(Boolean))].slice(0,3),props,vis,estado:a.playState}})"""
COPIAS="""(ms)=>new Promise(ok=>{const t0=performance.now();let mx=0,q=0,pior=0,u=t0;const f=t=>{const d=t-u;u=t;if(d>pior)pior=d;const n=[...document.querySelectorAll('#layer .panel,#layer .modal,#lfGhost .panel,#lfGhost .modal,.lfGhost .panel')].filter(e=>e.getBoundingClientRect().width>0).length;if(n>mx)mx=n;if(n>=2)q++;if(t-t0<ms)requestAnimationFrame(f);else ok({max:mx,quadros2:q,pior:Math.round(pior)})};requestAnimationFrame(f)})"""
LUXO=('cubic-bezier(0.16, 1, 0.3, 1)','cubic-bezier(0.4, 0, 0.2, 1)')
LAYOUT=('width','height','top','left','right','bottom','marginTop','marginLeft','margin','padding','maxHeight','maxWidth','fontSize','inset','gap','borderWidth','letterSpacing')
def quica(c):
    m=re.match(r'cubic-bezier\(([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+)\)',c or '')
    return bool(m and (float(m.group(2))>1.02 or float(m.group(4))>1.02 or float(m.group(2))<-0.02))
def roda(pw,reduz=False):
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
    c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR',reduced_motion='reduce' if reduz else 'no-preference')
    c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    c.add_init_script("localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_conta',%r);localStorage.setItem('lf_auth',%r);try{sessionStorage.setItem('lf_ni','1')}catch(e){}"%(kit.CONTA,kit.AUTH))
    pg=c.new_page();w=pg.wait_for_timeout;R=[]
    def passo(nome,acao):
        try:
            pg.evaluate("ms=>{window.__cp=("+COPIAS+")(ms)}",1500);acao();w(70);a=pg.evaluate(COLHE);w(1700);fim=pg.evaluate(COLHE);cp=pg.evaluate("()=>window.__cp||null") or {'max':0,'quadros2':0,'pior':0}
            R.append({'passo':nome,'ini':a,'fim':[x for x in fim if x['estado']=='running' and x['vis']],'copias':cp})
        except Exception as e: R.append({'passo':nome,'erro':str(e)[:140]})
    J=lambda js:(lambda:pg.evaluate(js))
    passo('abrir o site',lambda:pg.goto('http://localhost:8811/?kit=1'));w(800)
    passo('rolar a página',J("window.scrollTo({top:900,behavior:'smooth'})"))
    passo('voltar ao topo',J("window.scrollTo({top:0,behavior:'smooth'})"))
    passo('abrir o menu',J("document.querySelector('#mnb').click()"))
    passo('fechar o menu',J("(document.querySelector('#drw [data-dclose]')||document.querySelector('#mnb')).click()"))
    passo('abrir a busca',J("document.querySelector('#sbtn').click()"))
    passo('fechar a busca',lambda:pg.go_back())
    passo('abrir uma peça',J("document.querySelector('[data-open]').click()"))
    passo('favoritar na peça',J("(document.querySelector('#layer [data-fav]')||{click(){}}).click()"))
    passo('Comprar (vai para a sacola)',J("([...document.querySelectorAll('#layer button')].find(b=>b.offsetParent&&/Comprar/.test(b.innerText))||{click(){}}).click()"))
    passo('fechar a peça (voltar)',lambda:pg.go_back())
    passo('abrir a sacola',J("document.querySelector('#bagbtn').click()"))
    passo('sacola: mais uma unidade',J("(document.querySelector('#layer [data-inc]')||{click(){}}).click()"))
    passo('fechar a sacola (voltar)',lambda:pg.go_back())
    passo('abrir Minha conta',J("document.querySelector('#contabtn').click()"))
    passo('conta: aba Endereços',J("[...document.querySelectorAll('#layer .mct button')][1].click()"))
    passo('conta: aba Pedidos',J("[...document.querySelectorAll('#layer .mct button')][2].click()"))
    passo('conta aberta → menu → Minha conta',lambda:(pg.evaluate("document.querySelector('#mnb').click()"),w(700),pg.evaluate("()=>{const x=[...document.querySelectorAll('a,button')].filter(e=>e.offsetParent&&/Minha conta/i.test(e.innerText)&&!e.closest('.top'));(x[0]||{click(){}}).click()}")))
    passo('conta aberta → sacola',J("document.querySelector('#bagbtn').click()"))
    passo('sacola aberta → menu → Minha conta',lambda:(pg.evaluate("document.querySelector('#mnb').click()"),w(700),pg.evaluate("()=>{const x=[...document.querySelectorAll('a,button')].filter(e=>e.offsetParent&&/Minha conta/i.test(e.innerText)&&!e.closest('.top'));(x[0]||{click(){}}).click()}")))
    passo('fechar tudo (logo)',J("document.querySelector('.top .logo').click()"))
    passo('abrir o catálogo (categoria do menu)',lambda:(pg.evaluate("document.querySelector('#mnb').click()"),w(700),pg.evaluate("()=>{const x=document.querySelector('#drw [data-navcat]');x&&x.click()}")))
    passo('catálogo: abrir Filtros',J("(document.querySelector('.lfgf,[data-filt],#filtbtn')||{click(){}}).click()"))
    passo('catálogo: fechar Filtros',lambda:pg.go_back())
    b.close();return R
with sync_playwright() as pw:
    N=roda(pw);RD=roda(pw,True)
json.dump({'normal':N,'reduzir':RD},open('/home/claude/lafouch/work/s330/site_medido.json','w'),ensure_ascii=False)
P=collections.defaultdict(list)
for p in N:
    if 'erro' in p: P['passo que não rodou'].append((p['passo'],p['erro']));continue
    for a in p['ini']:
        if not a['vis']: continue
        ch=a['n']+' em '+a['el'];cs=[a['curva']]+a['curvasKf']
        if a['it']=='sem fim': P['não acaba nunca'].append((p['passo'],ch,a['dur']))
        if a['dur']>700 and a['it']!='sem fim': P['longa (mais de 0,7 s)'].append((p['passo'],ch,a['dur']))
        if any(x in a['props'] for x in LAYOUT): P['mexe em tamanho/posição'].append((p['passo'],ch,[x for x in a['props'] if x in LAYOUT]))
        if any(quica(c) for c in cs): P['quica'].append((p['passo'],ch,[c for c in cs if quica(c)][0]))
        if a['dur']>=120 and a['it']!='sem fim' and not any(c in LUXO for c in cs): P['fora da curva de luxo'].append((p['passo'],ch,cs[0] if cs[0]!='linear' else (cs[1] if len(cs)>1 else 'linear')))
    for a in p['fim']:
        if a['it']!='sem fim': P['ainda rodando 1,7 s depois'].append((p['passo'],a['n']+' em '+a['el'],a['dur']))
    if p['copias']['max']>=2: P['CÓPIAS do painel ao mesmo tempo (fantasma)'].append((p['passo'],p['copias']))
    if p['copias']['pior']>50: P['quadro travado (simulador)'].append((p['passo'],p['copias']['pior']))
for p in RD:
    if 'erro' in p: continue
    r=[a for a in p['ini'] if a['vis'] and a['dur']>60]
    if r: P['ignora "reduzir movimento"'].append((p['passo'],len(r),sorted(set(a['n']+' em '+a['el'] for a in r))[:6]))
json.dump(P,open('/home/claude/lafouch/work/s330/site_problemas.json','w'),ensure_ascii=False)
tot=sum(len([a for a in p.get('ini',[]) if a['vis']]) for p in N);print('passos',len(N),'animações vistas',tot)
for k,v in P.items():
    print('\n##',k,len(v))
    for x in v[:14]: print('  ',str(x)[:230])

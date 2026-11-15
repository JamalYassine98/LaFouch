# S322: estudo das animações do app EM USO (não só no código): abre cada tela e as interações comuns no simulador e anota o que realmente roda —
# duração, curva, o que mexe, se não acaba nunca, se quica, se briga com outra, se respeita "reduzir movimento", e quadros perdidos. Só leitura.
import sys,os,json,collections;sys.path.insert(0,'/home/claude/lafouch/work/s321');import base,kit
from playwright.sync_api import sync_playwright
T='/tmp/s322/'
COLHE="""()=>document.getAnimations().map(a=>{const e=a.effect,t=e&&e.getComputedTiming?e.getComputedTiming():{},el=e&&e.target;let kf=[];try{kf=e.getKeyframes()}catch(_){}
  const props=[...new Set(kf.flatMap(k=>Object.keys(k)).filter(k=>!['offset','easing','composite','computedOffset'].includes(k)))];
  const nome=el?(el.id?'#'+el.id:el.tagName.toLowerCase()+(el.classList.length?'.'+[...el.classList].slice(0,2).join('.'):'')):'?';
  const r=el&&el.getBoundingClientRect?el.getBoundingClientRect():{width:0,height:0,top:9e9};const vis=r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0;
  return {n:a.animationName||('transição:'+(a.transitionProperty||'')),el:nome,dur:Math.round(t.duration||0),atraso:Math.round(t.delay||0),it:t.iterations===Infinity?'sem fim':t.iterations,curva:(t.easing||''),curvasKf:[...new Set(kf.map(k=>k.easing).filter(Boolean))].slice(0,3),props,vis,estado:a.playState}})"""
QUADROS="""(ms)=>new Promise(ok=>{const t0=performance.now();let u=t0,n=0,l=0,pior=0;const f=t=>{const d=t-u;u=t;n++;if(d>34)l++;if(d>pior)pior=d;if(t-t0<ms)requestAnimationFrame(f);else ok({quadros:n,perdidos:l,pior:Math.round(pior)})};requestAnimationFrame(f)})"""
VISTAS=['inicio','vendas','estoque','ped','clientes','caixa','hist','dash','ajustes','fx','desp']
LUXO=('cubic-bezier(0.16, 1, 0.3, 1)','cubic-bezier(0.4, 0, 0.2, 1)')
LAYOUT=('width','height','top','left','right','bottom','margin','padding','maxHeight','maxWidth','fontSize','inset','gap','borderWidth','letterSpacing')
def quica(c):
    import re
    m=re.match(r'cubic-bezier\(([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+)\)',c or '')
    return bool(m and (float(m.group(2))>1.02 or float(m.group(4))>1.02 or float(m.group(2))<-0.02))
def roda(pw,reduz=False):
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
    c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark',reduced_motion='reduce' if reduz else 'no-preference')
    c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");pg=c.new_page();w=pg.wait_for_timeout
    pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);w(1500)
    R=[]
    def passo(nome,acao):
        try:
            acao();w(70);a=pg.evaluate(COLHE);q=pg.evaluate(QUADROS,900);w(1600);fim=pg.evaluate(COLHE)
            R.append({'passo':nome,'ini':a,'quadros':q,'fim':[x for x in fim if x['estado']=='running']})
        except Exception as e: R.append({'passo':nome,'erro':str(e)[:120]})
    for v in VISTAS: passo('tela '+v,lambda v=v:pg.evaluate("t=>window.__LF.setView(t)",v))
    passo('voltar ao início',lambda:pg.evaluate("window.__LF.setView('inicio')"))
    pg.evaluate("window.__LF.setView('estoque')");w(900)
    passo('inventário: trocar de aba (Fornecedores)',lambda:pg.click('#eTabL'))
    passo('inventário: voltar à aba Produtos',lambda:pg.click('#eTabP'))
    passo('inventário: abrir uma peça',lambda:pg.evaluate("()=>{const c=[...document.querySelectorAll('#v-estoque .pcard')];(c[1]||c[0]).click()}"))
    passo('inventário: fechar a peça (voltar)',lambda:pg.go_back())
    pg.evaluate("window.__LF.setView('vendas')");w(900)
    passo('catálogo: abrir uma peça',lambda:pg.evaluate("()=>{const c=[...document.querySelectorAll('#v-vendas .pcard')];(c[1]||c[0]).click()}"))
    passo('catálogo: voltar',lambda:pg.go_back())
    passo('catálogo: tocar em Compartilhar (barra de seleção)',lambda:pg.click('#cjSh'))
    pg.evaluate("()=>{[...document.querySelectorAll('#v-vendas .pcard')].slice(1,2).forEach(x=>x.click())}");w(500)
    passo('compartilhar: abrir a janela',lambda:pg.evaluate("()=>{const g=document.querySelector('.ebGo');g&&g.click()}"))
    passo('compartilhar: trocar Cliente → Lojista',lambda:pg.evaluate("()=>{const x=document.querySelector('.s185Seg [data-p=loj]');x&&x.click()}"))
    passo('compartilhar: fechar a janela',lambda:pg.go_back())
    pg.evaluate("window.__LF.setView('ped')");w(900)
    passo('pedidos: trocar para Feitos',lambda:pg.evaluate("()=>{const x=document.querySelector('.pdSeg [data-id=ent]');x&&x.click()}"))
    pg.evaluate("window.__LF.setView('inicio')");w(900)
    passo('início: abrir o sino (avisos)',lambda:pg.evaluate("()=>{const x=document.querySelector('[aria-label*=viso],[aria-label*=otific],#btnSino,.sino');x&&x.click()}"))
    passo('início: fechar o sino',lambda:pg.go_back())
    passo('início: tocar na busca',lambda:pg.evaluate("()=>{const x=document.querySelector('#v-inicio input, .fnBusca input, input[type=search]');x&&x.focus()}"))
    b.close();return R
with sync_playwright() as pw:
    N=roda(pw);RD=roda(pw,True)
json.dump({'normal':N,'reduzir':RD},open('/home/claude/lafouch/work/s322/medido.json','w'),ensure_ascii=False,indent=0)
# resumo dos problemas
P=collections.defaultdict(list)
for p in N:
    if 'erro' in p: P['passo que não rodou'].append(p['passo']+' ('+p['erro']+')');continue
    for a in p['ini']:
        if not a['vis']: continue
        chave=a['n']+' em '+a['el']
        if a['it']=='sem fim': P['não acaba nunca'].append((p['passo'],chave,a['dur']))
        if a['dur']>700 and a['it']!='sem fim': P['longa (mais de 0,7 s)'].append((p['passo'],chave,a['dur']))
        if 0<a['dur']<90: P['curta demais (menos de 0,09 s)'].append((p['passo'],chave,a['dur']))
        if any(x in a['props'] for x in LAYOUT): P['mexe em tamanho/posição (trava em celular fraco)'].append((p['passo'],chave,[x for x in a['props'] if x in LAYOUT]))
        cs=[a['curva']]+a['curvasKf']
        if any(quica(c) for c in cs): P['quica (passa do ponto e volta)'].append((p['passo'],chave,[c for c in cs if quica(c)][0]))
        if a['dur']>=120 and a['it']!='sem fim' and not any(c in LUXO for c in cs): P['fora da curva de luxo'].append((p['passo'],chave,cs[0] if cs[0]!='linear' else (cs[1] if len(cs)>1 else 'linear')))
    els=collections.Counter(a['el'] for a in p['ini'] if a['vis'] and not a['n'].startswith('transição'))
    for e,n in els.items():
        if n>=2: P['duas ou mais animações no mesmo elemento ao mesmo tempo'].append((p['passo'],e,[a['n'] for a in p['ini'] if a['el']==e and a['vis']][:4]))
    if p['quadros']['perdidos']>=3: P['quadros perdidos no simulador'].append((p['passo'],p['quadros']))
for p in RD:
    if 'erro' in p: continue
    r=[a for a in p['ini'] if a['vis'] and a['dur']>60]
    if r: P['ignora "reduzir movimento"'].append((p['passo'],len(r),sorted(set(a['n'] for a in r))[:5]))
json.dump({k:v for k,v in P.items()},open('/home/claude/lafouch/work/s322/problemas.json','w'),ensure_ascii=False,indent=0)
tot=sum(len([a for a in p.get('ini',[]) if a['vis']]) for p in N)
print('passos',len(N),'animações vistas rodando',tot)
for k,v in P.items():
    print('\n##',k,len(v))
    for x in v[:9]: print('  ',str(x)[:210])

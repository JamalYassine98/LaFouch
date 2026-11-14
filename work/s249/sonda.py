# S249 · sonda funda: toca em cada controle visível de cada tela (app e site) e mede o que se mexe ao abrir e ao fechar.  python3 sonda.py
import json,subprocess,sys,time,os
A=os.path.dirname(os.path.abspath(__file__))+'/'
from playwright.sync_api import sync_playwright
MARK="()=>{window.__old=new Set(document.getAnimations())}"
AN="""()=>{let fim=0,n=0,lay=0;const nomes={};document.getAnimations().forEach(a=>{if(window.__old&&window.__old.has(a))return;const c=a.effect&&a.effect.getComputedTiming();if(!c||!c.duration||c.iterations===Infinity)return;n++;fim=Math.max(fim,c.delay+c.duration);const ps=[...new Set(a.effect.getKeyframes().flatMap(k=>Object.keys(k)))];if(ps.some(p=>/^(width|height|left|right|top|bottom|margin|padding|maxHeight|fontSize)/.test(p)))lay++;const k=a.animationName||('tr:'+ps.filter(p=>!/offset|easing|composite/.test(p)).join('+'));nomes[k]=(nomes[k]||0)+1});return {n,fim:Math.round(fim),lay,nomes}}"""
SEMFIM="""()=>{const o={};document.getAnimations().forEach(a=>{const c=a.effect&&a.effect.getComputedTiming();if(c&&c.iterations===Infinity){const t=a.effect.target;if(!t||!t.getClientRects().length)return;const k=(a.animationName||'js')+' '+t.tagName.toLowerCase()+'.'+String(t.className.baseVal??t.className).split(' ')[0];o[k]=(o[k]||0)+1}});return o}"""
ABERTO="""()=>[...document.querySelectorAll('.modal,.sheet,dialog,[role=dialog],.scrim,.dsc,.dsc2,.sosc,.ov,.pop,.menu,.drop')].filter(e=>{const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&+s.opacity>0.05&&e.getClientRects().length&&e.getBoundingClientRect().width>40}).map(e=>e.tagName.toLowerCase()+(e.id?'#'+e.id:'.'+String(e.className).split(' ')[0])).join(',')"""
ALVOS="""(sel)=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>8&&r.height>8&&r.top>=0&&r.bottom<=innerHeight&&getComputedStyle(e).visibility!=='hidden'};const seen=new Set(),out=[];document.querySelectorAll(sel).forEach((e,i)=>{if(!vis(e))return;const k=(e.dataset.act||e.dataset.a||e.dataset.cta||e.id||String(e.className).split(' ')[0]||e.tagName)+'';if(seen.has(k))return;seen.add(k);e.setAttribute('data-s249',k);out.push([k,(e.innerText||e.getAttribute('aria-label')||e.title||'').trim().replace(/\\s+/g,' ').slice(0,28)])});return out.slice(0,16)}"""
rt=lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
R=[]
def testa(pg,tela,sel,repoe,pular=()):
    repoe(pg);alvos=pg.evaluate(ALVOS,sel)
    for k,txt in alvos:
        if any(p in k.lower() or p in txt.lower() for p in pular): continue
        try:
            repoe(pg);pg.evaluate(ALVOS,sel);a0=pg.evaluate(ABERTO);pg.evaluate(MARK)
            pg.evaluate("k=>{const e=document.querySelector('[data-s249=\"'+CSS.escape(k)+'\"]');e&&e.click()}",k);pg.wait_for_timeout(45);ab=pg.evaluate(AN);pg.wait_for_timeout(min(1500,ab['fim'])+250);a1=pg.evaluate(ABERTO)
            fe=None
            if a1!=a0:
                pg.evaluate(MARK);pg.keyboard.press('Escape');pg.wait_for_timeout(45);fe=pg.evaluate(AN);pg.wait_for_timeout(min(1200,fe['fim'])+200);fe['fechou']=pg.evaluate(ABERTO)==a0
            R.append({'tela':tela,'k':k,'txt':txt,'abre':ab,'abriu':a1 if a1!=a0 else '','fecha':fe})
        except Exception as e: R.append({'tela':tela,'k':k,'txt':txt,'erro':str(e)[:100]})
subprocess.run('bash /tmp/srv.sh >/dev/null 2>&1',shell=True)
srv=subprocess.Popen([sys.executable,'-m','http.server','8837','-d',A+'../../www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True);time.sleep(1)
SF={}
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    def novo(loc=None):
        c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='block',**({'locale':loc} if loc else {}));c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.route('**/*',rt);pg=c.new_page();pg.on('dialog',lambda d:d.dismiss());return c,pg
    # APP
    for v in ['inicio','estoque','vendas','caixa','ped','clientes','hist','dash','dia','fx','desp','notif','ajustes']:
        c,pg=novo();pg.goto('http://localhost:8837/index.html#test');pg.wait_for_function('window.__LF');pg.wait_for_timeout(900)
        def repoe(pg,v=v):
            pg.keyboard.press('Escape');pg.evaluate("v=>{document.querySelectorAll('.modal').forEach(m=>{m.style.display='none'});if(window.__LF.S&&window.__LF.S.view!==v||!document.querySelector('#v-'+v+':not([hidden])'))window.__LF.setView(v)}",v);pg.wait_for_timeout(350);pg.evaluate("document.querySelectorAll('.modal').forEach(m=>{m.style.display=''})")
        pg.evaluate("v=>window.__LF.setView(v)",v);pg.wait_for_timeout(1300);SF['app '+v]=pg.evaluate(SEMFIM)
        testa(pg,'app '+v,'#v-%s [data-act],#v-%s button,#v-%s .pcard,#v-%s .chip'%(v,v,v,v),repoe,pular=('sair','apagar','excluir','logout','reset','zerar','limpar','mn'))
        c.close()
    # SITE
    for nome,url,loc in (('site início','/','es-PY'),('site catálogo','/?r=tienda','es-PY')):
        c,pg=novo(loc);pg.goto('http://localhost:8811'+url);pg.wait_for_timeout(2800)
        def repoe(pg,url=url):
            pg.keyboard.press('Escape');pg.wait_for_timeout(250)
            if pg.evaluate("location.pathname+location.search")!=url: pg.goto('http://localhost:8811'+url);pg.wait_for_timeout(2300)
            pg.evaluate("scrollTo(0,0)")
        SF[nome]=pg.evaluate(SEMFIM)
        testa(pg,nome,'header button,header a,.top button,.top a,[data-a],[data-cta],#grid .card,.fav,a.wa,#bagbtn,#contabtn,#mnb',repoe,pular=('wa',))
        c.close()
    # SITE · peça aberta e sacola
    c,pg=novo('es-PY');pg.goto('http://localhost:8811/?r=tienda');pg.wait_for_selector('#grid .card');pg.wait_for_timeout(2500);pg.evaluate(MARK);pg.evaluate("document.querySelector('#grid .card').click()");pg.wait_for_timeout(45);R.append({'tela':'site catálogo','k':'ABRIR PEÇA 45ms','txt':'','abre':pg.evaluate(AN),'abriu':'','fecha':None});pg.wait_for_timeout(250);R.append({'tela':'site catálogo','k':'ABRIR PEÇA 300ms','txt':'','abre':pg.evaluate(AN),'abriu':'','fecha':None});pg.wait_for_timeout(1500)
    U=pg.evaluate("location.pathname+location.search+location.hash");SF['site peça']=pg.evaluate(SEMFIM)
    def repoe(pg):
        pg.keyboard.press('Escape');pg.wait_for_timeout(250)
        if pg.evaluate("location.pathname+location.search+location.hash")!=U: pg.goto('http://localhost:8811'+U);pg.wait_for_timeout(2500)
    testa(pg,'site peça','.det button,.det a,.det [data-a],.det [data-cta],.det img,#bagbtn',repoe,pular=('wa','whats'))
    c.close()
    # temáticas: animações sem fim paradas no Início
    for ev in ['natal','halloween','bf','anonovo-d','anonovo-n','maes','pais']:
        c,pg=novo('es-PY');pg.goto('http://localhost:8811/');pg.wait_for_timeout(2400);pg.evaluate("e=>document.documentElement.setAttribute('data-ev',e)",ev);pg.wait_for_timeout(900);SF['site tema '+ev]=pg.evaluate(SEMFIM);c.close()
finally: srv.terminate()
json.dump({'toques':R,'semfim':SF},open(A+'sonda.json','w'),ensure_ascii=False,indent=1)
print(len(R),'toques')

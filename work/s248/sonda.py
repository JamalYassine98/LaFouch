# S248 · sonda: o que se mexe em cada toque (site e app). Lista animações novas 45 ms depois da ação.  python3 sonda.py
import json,subprocess,sys,time,os
A=os.path.dirname(os.path.abspath(__file__))+'/'
from playwright.sync_api import sync_playwright
MARK="()=>{window.__old=new Set(document.getAnimations())}"
AN="""()=>{const o={};document.getAnimations().forEach(a=>{if(window.__old&&window.__old.has(a))return;const c=a.effect&&a.effect.getComputedTiming();if(!c||!c.duration)return;const t=a.effect.target;const kf=a.effect.getKeyframes();const props=[...new Set(kf.flatMap(k=>Object.keys(k)))].filter(p=>!['offset','easing','composite','computedOffset'].includes(p)).join('+');const k=(a.animationName||('tr:'+a.transitionProperty)||'js')+' | '+(t?(t.tagName.toLowerCase()+(t.id?'#'+t.id:'')+'.'+String(t.className.baseVal??t.className).split(' ').slice(0,2).join('.')):'?')+' | '+Math.round(c.duration)+'ms'+(c.iterations===Infinity?' SEMFIM':'')+' | '+props;o[k]=o[k]||{n:0,dl:0};o[k].n++;o[k].dl=Math.max(o[k].dl,Math.round(c.delay))});return o}"""
rt=lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
R={}
def passo(pg,nome,ac,esp=45,depois=900):
    try:
        pg.evaluate(MARK);ac(pg);pg.wait_for_timeout(esp);R[nome]=pg.evaluate(AN);pg.wait_for_timeout(depois)
    except Exception as e: R[nome]={'ERRO':str(e)[:120]}
subprocess.run('bash /tmp/srv.sh >/dev/null 2>&1',shell=True)
srv=subprocess.Popen([sys.executable,'-m','http.server','8836','-d',A+'../../www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True);time.sleep(1)
ev=lambda js:(lambda pg:pg.evaluate(js))
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='es-PY',service_workers='block');c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.route('**/*',rt)
    pg=c.new_page();pg.goto('http://localhost:8811/');pg.wait_for_timeout(2800)
    R['SITE início parado (sem fim)']={k:v for k,v in pg.evaluate("()=>{window.__old=null}") or {}}
    R['SITE início parado (sem fim)']={k:v for k,v in pg.evaluate(AN).items() if 'SEMFIM' in k}
    passo(pg,'SITE abrir menu',ev("document.querySelector('#mnb').click()"));passo(pg,'SITE fechar menu',lambda pg:pg.keyboard.press('Escape'))
    passo(pg,'SITE abrir busca',ev("(document.querySelector('#sbtn,[data-a=busca],.hsb,#srchb')||{click(){}}).click()"));pg.keyboard.press('Escape');pg.wait_for_timeout(500)
    passo(pg,'SITE rolar 600',ev("scrollTo(0,600)"));passo(pg,'SITE voltar ao topo',ev("scrollTo(0,0)"))
    pg.goto('http://localhost:8811/?r=tienda');pg.wait_for_selector('#grid .card');pg.wait_for_timeout(2600)
    passo(pg,'SITE favoritar',ev("document.querySelector('#grid .card .fav').click()"))
    passo(pg,'SITE abrir filtros',ev("(document.querySelector('#fbtn,.fbtn,[data-a=filtros],#filb')||{click(){}}).click()"));pg.keyboard.press('Escape');pg.wait_for_timeout(600)
    passo(pg,'SITE abrir peça',ev("document.querySelector('#grid .card').click()"),depois=1600)
    passo(pg,'SITE pôr na sacola',ev("(document.querySelector('.det .btn, .det [data-a=add], #addb, .dadd')||{click(){}}).click()"),depois=1500)
    passo(pg,'SITE abrir sacola',ev("document.querySelector('#bagbtn').click()"),depois=1300);passo(pg,'SITE fechar sacola',lambda pg:pg.keyboard.press('Escape'))
    passo(pg,'SITE voltar da peça',lambda pg:pg.go_back(),depois=1500)
    R['SITE botões']=pg.evaluate("()=>[...document.querySelectorAll('header button,header a,.mobsearch button')].filter(e=>e.offsetParent).map(e=>e.id||e.className).join(' , ')")
    c.close()
    c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='block');c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.route('**/*',rt)
    pg=c.new_page();pg.goto('http://localhost:8836/index.html#test');pg.wait_for_function('window.__LF');pg.wait_for_timeout(1200)
    for v in ['estoque','vendas','ped','clientes','hist','dash','dia','fx','desp','onl','notif','ajustes','inicio']:
        passo(pg,'APP → '+v,lambda pg,v=v:pg.evaluate("v=>window.__LF.setView(v)",v),depois=800)
        R['APP parado '+v]={k:x for k,x in pg.evaluate("()=>{window.__old=null}") or {}};R['APP parado '+v]={k:x for k,x in pg.evaluate(AN).items() if 'SEMFIM' in k}
    passo(pg,'APP sino',ev("document.querySelector('#sino').click()"));pg.keyboard.press('Escape');pg.wait_for_timeout(500);pg.evaluate("window.__LF.setView('estoque')");pg.wait_for_timeout(900)
    passo(pg,'APP Inventário trocar aba',ev("(document.querySelectorAll('#eTabs button, #eTabs .chip, #eTabs [data-act]')[1]||{click(){}}).click()"))
    passo(pg,'APP abrir ficha',ev("(document.querySelector('#rows .pcard')||{click(){}}).click()"),depois=1200);R['APP ficha aberta?']=pg.evaluate("()=>[...document.querySelectorAll('dialog[open],.sheet.on,.modal.on,.ov.on,[role=dialog]')].filter(e=>e.offsetParent||e.open).map(e=>e.tagName+'#'+e.id+'.'+e.className).join(' , ')")
    passo(pg,'APP fechar ficha',lambda pg:pg.keyboard.press('Escape'))
    passo(pg,'APP + Adicionar',ev("document.querySelector('#btnAdd').click()"),depois=1200);R['APP adicionar aberto?']=pg.evaluate("()=>[...document.querySelectorAll('dialog[open],.sheet.on,.modal.on,.ov.on,[role=dialog]')].filter(e=>e.offsetParent||e.open).map(e=>e.tagName+'#'+e.id+'.'+e.className).join(' , ')")
    pg.keyboard.press('Escape');pg.wait_for_timeout(600);pg.evaluate("window.__LF.setView('ajustes')");pg.wait_for_timeout(900)
    passo(pg,'APP Ajustes abrir seção',ev("document.querySelector('button.ajR').click()"),depois=1000)
    pg.evaluate("window.__LF.setView('vendas')");pg.wait_for_timeout(900)
    passo(pg,'APP Catálogo tocar peça',ev("(document.querySelector('#v-vendas .pcard, #v-vendas [data-act][data-id], #v-vendas .card')||{click(){}}).click()"),depois=1000)
    c.close()
finally: srv.terminate()
json.dump(R,open(A+'sonda.json','w'),ensure_ascii=False,indent=1)
for k,v in R.items():
    print('##',k)
    if isinstance(v,str): print('   ',v[:300]);continue
    for a,x in sorted(v.items(),key=lambda z:-z[1]['n'] if isinstance(z[1],dict) else 0)[:9]: print('   ',(str(x['n'])+'× ' if isinstance(x,dict) else '')+a[:150]+(' atraso até %dms'%x['dl'] if isinstance(x,dict) and x['dl'] else ''))

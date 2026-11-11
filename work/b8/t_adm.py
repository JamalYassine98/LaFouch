import json,time,sys
from playwright.sync_api import sync_playwright
W=int(sys.argv[1]) if len(sys.argv)>1 else 390
def fv(v):
    if isinstance(v,bool):return {'booleanValue':v}
    if isinstance(v,int):return {'integerValue':str(v)}
    if isinstance(v,str):return {'stringValue':v}
    if isinstance(v,dict):return {'mapValue':{'fields':{k:fv(x) for k,x in v.items()}}}
    if isinstance(v,list):return {'arrayValue':{'values':[fv(x) for x in v]}}
    return {'nullValue':None}
CFG={'ativo':True,'cal':{}}
PRODS=[{'ref':'SL2210','nome':'Óculos de sol hexagonal','n':150000,'lib':True,'fv':1},{'ref':'GR3340','nome':'Armação quadrada','n':120000,'lib':True,'fv':1,'est':0}]
now=int(time.time()*1000)
MSGS=[{'id':'abc123xyz','tipo':'contato','nome':'Ana Souza','email':'ana@x.com','tel':'+55 45 99999-1111','msg':'Vocês têm o modelo gatinho em preto?','ts':now-3600e3,'est':'novo'},
 {'id':'def456uvw','tipo':'atacado','cod':'A-1234','pais':'Brasil','qtd':'50 peças','procura':['Solar','Leitura'],'ts':now-7200e3,'est':'novo'},
 {'id':'ghi789rst','tipo':'contato','nome':'Luis Gómez','email':'luis@y.com','tel':'0983 111222','msg':'Hola, ¿hacen envíos a Asunción?','lang':'es','ts':now-86400e3,'est':'respondido'}]
AN={'ok':True,'visitas':128,'cel':101,'pc':27,'pt':80,'es':48,'vistas':540,'carrinho':37,'favoritos':22,'checkout':9,'pedidos':4,'mochi':31,'rosto':12,'atacado':3,'eventos':{'bf':20},'dias':{'2026-11-10':40,'2026-11-09':30,'2026-11-11':58},
 'pecas':[['SL2210',90],['GR3340',44],['BR44140',30]],'carts':[['SL2210',12]],'favs':[['SL2210',8]],'buscas':[['gatinho',7],['aviador',4]],'semResultado':[['gatinho',7]],'vistasSemCarrinho':[['GR3340',44],['BR44140',30]]}
saved=[]
J={'content-type':'application/json'}
def route(r):
    u=r.request.url;m=r.request.method
    if 'firestore' in u:
        if m=='PATCH':
            saved.append((u.split('documents/')[1].split('?')[0],r.request.post_data[:200]))
            b=json.loads(r.request.post_data)
            return r.fulfill(status=200,body=json.dumps({'name':'x','fields':b.get('fields',{})}),headers=J)
        if 'config/site' in u:return r.fulfill(status=200,body=json.dumps({'name':'config/site','fields':{k:fv(v) for k,v in CFG.items()}}),headers=J)
        if '/produtos' in u:return r.fulfill(status=200,body=json.dumps({'documents':[{'name':'p/'+p['ref'],'fields':{k:fv(v) for k,v in p.items()}} for p in PRODS]}),headers=J)
        return r.fulfill(status=404,body='{}')
    if 'cloudfunctions' in u:
        b=json.loads(r.request.post_data or '{}')
        if '/mensagem' in u:
            if b.get('acao')=='estado':saved.append(('estado',json.dumps(b)));return r.fulfill(status=200,body='{"ok":true}',headers=J)
            return r.fulfill(status=200,body=json.dumps({'ok':True,'itens':MSGS}),headers=J)
        if '/analise' in u:return r.fulfill(status=200,body=json.dumps(AN),headers=J)
        if '/novidades' in u:return r.fulfill(status=200,body=json.dumps({'ok':True,'itens':[{'email':'a@b.c'}]*5}),headers=J)
        return r.fulfill(status=200,body='{"ok":true,"lista":[]}',headers=J)
    if 'securetoken' in u:return r.fulfill(status=200,body=json.dumps({'id_token':'t.e30.s','refresh_token':'rt'}),headers=J)
    if 'localhost' in u:return r.continue_()
    return r.abort()
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':W,'height':860},device_scale_factor=2)
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.route('**/*',route)
    pg.add_init_script("localStorage.setItem('lf_rt','x')")
    pg.goto('http://localhost:8160/admin.html');pg.wait_for_timeout(2500)
    def shot(n):pg.screenshot(path='/home/claude/lafouch/work/b8/%s_%d.png'%(n,W))
    pg.click('.bn [data-v="tem"]');pg.wait_for_timeout(900);shot('tem')
    print('chip lefts:',pg.evaluate("Array.from(document.querySelectorAll('#temb .ch')).map(c=>Math.round(c.getBoundingClientRect().left)+':'+Math.round(c.getBoundingClientRect().width))"))
    pg.click('[data-tpg="cal"]');pg.wait_for_timeout(900);shot('cal')
    pg.set_viewport_size({'width':W,'height':2400});pg.wait_for_timeout(300);shot('calL');pg.set_viewport_size({'width':W,'height':860})
    pg.click('[data-tpg=""]');pg.wait_for_timeout(500)
    pg.click('#temb [data-cal="bf"]');pg.wait_for_timeout(600)
    print('chip bf:',pg.inner_text('#temb [data-cal="bf"]'))
    pg.click('[data-nova][data-na]');pg.wait_for_timeout(600)
    print('nova some:',pg.query_selector('[data-nova]') is None)
    pg.click('.bn [data-v="msg"]');pg.wait_for_timeout(900);shot('msg')
    print('badge:',pg.inner_text('#mbd'))
    pg.click('[data-mid="abc123xyz"] [data-mest="respondido"]');pg.wait_for_timeout(400);print('badge2:',pg.inner_text('#mbd'),pg.is_hidden('#mbd'))
    pg.click('.bn [data-v="anl"]');pg.wait_for_timeout(1200);shot('anl')
    pg.evaluate("document.getElementById('v_anl').scrollTop=99999");pg.wait_for_timeout(500);shot('anl2')
    pg.click('[data-anver="pecas"]');pg.wait_for_timeout(800);shot('anlver')
    pg.evaluate("document.querySelector('#sh [data-shx]').click()");pg.wait_for_timeout(500)
    pg.click('.bn [data-v="cfg"]');pg.wait_for_timeout(700);shot('cfg')
    print('nav:',pg.evaluate("Array.from(document.querySelectorAll('.bn button')).map(b=>[b.textContent.trim(),Math.round(b.getBoundingClientRect().width),b.scrollWidth>b.clientWidth+1])"))
    print('saved:',saved)
    print('errs:',errs)
    b.close()

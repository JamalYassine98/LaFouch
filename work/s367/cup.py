import sys,subprocess,time,json
from playwright.sync_api import sync_playwright
sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
srv=subprocess.Popen(['python3','-m','http.server','8766'],cwd='/home/claude/catalogo',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
CUP={'cod':'LF-AB12','pct':10,'tipo':'px','estado':'ok','fim':1800000000000}
def fn(r):
    try: b=json.loads(r.request.post_data or '{}')
    except Exception: b={}
    if b.get('acao')=='meus': return r.fulfill(json={'ok':True,'cupons':[CUP,{'cod':'LF-ZZ99','pct':10,'tipo':'px','estado':'usado','usado':True}]})
    if b.get('acao')=='ver': return r.fulfill(json={'ok':True,'cupom':CUP})
    return r.fulfill(json={'ok':True})
try:
    with sync_playwright() as pw:
        b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
        for lang,vp in (('pt',(390,844)),('es',(390,844)),('pt',(1366,768))):
            c=b.new_context(viewport={'width':vp[0],'height':vp[1]},service_workers='block',has_touch=vp[0]<500,is_mobile=vp[0]<500)
            c.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
            import re as _re;c.route(_re.compile(r'cloudfunctions\.net'),fn)
            pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)));pg.goto('http://localhost:8766/404.html')
            pg.evaluate("l=>{localStorage.setItem('lf_auth',JSON.stringify({idToken:'t',email:'cliente@exemplo.com',localId:'u1',refreshToken:'r',exp:Date.now()+3e6}));localStorage.setItem('lf_conta',JSON.stringify({nome:'Cliente Teste',email:'cliente@exemplo.com',tel:'0981000000',ends:[],via:'senha'}));localStorage.setItem('lf_lang',l)}",lang)
            pg.goto('http://localhost:8766/index.html?conta=1&nosync');time.sleep(5)
            tem=pg.evaluate("()=>!!document.querySelector('#layer [data-cta=mcaba][data-a=cart]')")
            if not tem: print(lang,vp,'não abriu Minha conta:',pg.evaluate("()=>document.getElementById('layer').innerText.slice(0,200)"),er);c.close();continue
            pg.evaluate("()=>document.querySelector('#layer [data-cta=mcaba][data-a=cart]').click()");time.sleep(2)
            l1=pg.evaluate("()=>[...document.querySelectorAll('#mtj .mtc')].map(m=>m.innerText.replace(/\\n/g,' / ').slice(0,110)+' ['+(m.querySelectorAll('[data-cupperg]').length)+']')")
            pg.evaluate("()=>document.querySelector('#mtj [data-cupperg][role=button]').click()");time.sleep(.8)
            ov=pg.evaluate("()=>{const o=document.getElementById('cpov');if(!o)return null;const bs=[...o.querySelectorAll('button')].map(b=>{const r=b.getBoundingClientRect();return b.innerText+' '+Math.round(r.width)+'x'+Math.round(r.height)});return [o.innerText.replace(/\\n/g,' / ').slice(0,200),bs]}")
            pg.screenshot(path='/tmp/sv/cup_%s_%d.png'%(lang,vp[0]))
            pg.evaluate("()=>document.querySelector('#cpov [data-cupsim]').click()");time.sleep(1.5)
            fim=pg.evaluate("()=>({cupom:JSON.parse(localStorage.getItem('lf_cup')||'null'),camada:document.getElementById('layer').innerHTML.length,pergunta:!!document.getElementById('cpov'),vitrineTopo:Math.round(document.getElementById('vitrine').getBoundingClientRect().top)})")
            print(lang,vp,l1,'\n  pergunta:',ov,'\n  depois:',fim,er,flush=True);c.close()
        b.close()
finally: srv.kill()

# ESBOÇO 112: faixa da temática cobrindo o topo nas telas que abrem por cima (carrinho, conta, peça).
import sys,json,time,subprocess,os
from playwright.sync_api import sync_playwright
T='/home/claude/lafouch/work/s412/';OLHO=open('/home/claude/lafouch/work/kit/olho.js').read();PROP=open(T+'prop112.js').read()
CONTA=json.dumps({'nome':'Maria González','email':'maria@exemplo.com','tel':'+595 983 000 000','ends':[]})
AUTH=json.dumps({'uid':'kit','idToken':'kit','refresh':'kit','exp':9e15,'ev':True,'email':'maria@exemplo.com'})
def cfg(t):return json.dumps({"ativo":True,"evento":{"tema":t,"ini":0,"fim":0}})
ACOES={'carrinho':'#bagbtn','conta':'#contabtn','peca':'#home .hc'}
PRE={'peca':"()=>{const e=document.querySelector('#home .hc');e.scrollIntoView({block:'center'})}"}
def caso(pw,tela,W,H,tema='natal',prop=False,zoom=None,logado=False,shot=None,rola=True):
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':W,'height':H},device_scale_factor=2,is_mobile=W<700,has_touch=W<1100,locale='pt-BR',service_workers='block')
    c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    ini="localStorage.setItem('lf_cfg',%r);sessionStorage.setItem('lf_ni','1');"%cfg(tema)
    if zoom is not None: ini+="localStorage.setItem('lf_zoom','%s');"%zoom
    if logado: ini+="localStorage.setItem('lf_conta',%r);localStorage.setItem('lf_auth',%r);"%(CONTA,AUTH)
    c.add_init_script(ini)
    if prop: c.add_init_script("addEventListener('DOMContentLoaded',()=>{"+PROP+"})")
    pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:150]))
    pg.goto('http://localhost:8921/');pg.wait_for_timeout(2500)
    if tela in PRE: pg.evaluate(PRE[tela]);pg.wait_for_timeout(600)
    el=pg.locator(ACOES[tela]).first;bx=el.bounding_box()
    if W<1100: pg.touchscreen.tap(bx['x']+bx['width']/2,bx['y']+min(bx['height']/2,60))
    else: pg.mouse.click(bx['x']+bx['width']/2,bx['y']+min(bx['height']/2,60))
    pg.wait_for_timeout(1500)
    m=pg.evaluate("""()=>{const t=document.querySelector('.top').getBoundingClientRect(),e=document.getElementById('evbar');const er=e?e.getBoundingClientRect():null;
      const ev=e&&getComputedStyle(e).display!=='none';const cob=ev?Math.max(0,Math.round(er.bottom-t.top)):0;
      const pgs=document.querySelector('#layer .scrim.pg');let primeiro=null;if(pgs){const k=[...pgs.querySelectorAll('h1,h2,h3,p,button,input')].filter(x=>x.offsetWidth&&x.getBoundingClientRect().height>0)[0];if(k)primeiro=[k.tagName,(k.innerText||'').slice(0,20),Math.round(k.getBoundingClientRect().top)]}
      return {evbar:ev?[Math.round(er.top),Math.round(er.bottom)]:null,top:[Math.round(t.top),Math.round(t.bottom)],cobre:cob,primeiro:primeiro,cabecalho_fim:Math.round(t.bottom),gap:pgs?Math.round((pgs.getBoundingClientRect().top-t.bottom)*10)/10:null}}""")
    if os.environ.get('DBG'): print(pg.evaluate("()=>[34,33.5,35].map(y=>y+': '+document.elementsFromPoint(40,y).slice(0,4).map(e=>e.tagName+'#'+e.id+'.'+e.className+' bg'+getComputedStyle(e).backgroundColor+' '+JSON.stringify(e.getBoundingClientRect().toJSON?[Math.round(e.getBoundingClientRect().top*10)/10,Math.round(e.getBoundingClientRect().bottom*10)/10]:0)).join(' | '))"))
    o1=pg.evaluate(OLHO)
    if shot: pg.screenshot(path=shot)
    o2=[]
    if rola:
        pg.evaluate("()=>{const p=document.querySelector('#layer .scrim.pg');p&&p.scrollBy(0,400)}");pg.wait_for_timeout(500)
        m['depois_rolar']=pg.evaluate("()=>{const t=document.querySelector('.top').getBoundingClientRect(),e=document.getElementById('evbar');return e&&getComputedStyle(e).display!=='none'?Math.round(e.getBoundingClientRect().bottom-t.top):0}")
        o2=pg.evaluate(OLHO)
    b.close();return m,o1,o2,er

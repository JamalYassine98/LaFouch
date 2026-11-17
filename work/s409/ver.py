# S409 · confere o site implementado (cópia do kit) com respostas de mentira do servidor: cartões, Exclusivo, carrinho, folha, Minha conta
import sys,json;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');sys.path.insert(0,'/home/claude/lafouch/work/s349');import kit,comum
kit.prep_site();kit.serve(kit.SITE,kit.PS)
from playwright.sync_api import sync_playwright
T='/tmp/s409/';import os;os.makedirs(T,exist_ok=True)
F=1810000000000
MEUS={'ok':True,'guardados':0,'indicacoes':2,'escada':{'deg':2,'feitas':1,'tot':3},'vip':0,'nome':'María González','cupons':[{'cod':'LF-7K2M','tipo':'px','pct':10,'estado':'ok','fim':F,'usado':False,'nome':'María González','max':1},{'cod':'LF-9V3T','tipo':'px','pct':15,'estado':'ok','fim':F+9e9,'usado':False,'nome':'María González','max':1},{'cod':'AMIGA-1','tipo':'am','pct':10,'estado':'ok','fim':F,'usado':False}]}
def abre(pw,meus=MEUS,ev='',W=390,H=844):
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
    c=b.new_context(bypass_csp=True,viewport={'width':W,'height':H},device_scale_factor=2,is_mobile=W<700,has_touch=W<700,locale='pt-BR')
    log=[]
    def rota(r):
        u=r.request.url
        if u.startswith('http://localhost'): return r.continue_()
        H2={'access-control-allow-origin':'*'}
        if 'cloudfunctions.net/cupom' in u:
            bd=json.loads(r.request.post_data or '{}');a=bd.get('acao')
            if a=='meus': return r.fulfill(status=200,content_type='application/json',headers=H2,body=json.dumps(meus))
            if a=='presentes': return r.fulfill(status=200,content_type='application/json',headers=H2,body=json.dumps({'ok':True,'lim':100000,'refs':['SL2210','KIT3C','SL2255']}))
            return r.fulfill(status=200,content_type='application/json',headers=H2,body='{"ok":true}')
        if 'firestore.googleapis.com' in u and r.request.method=='POST': return r.fulfill(status=200,content_type='application/json',body='{}')
        return r.abort()
    c.route('**/*',rota)
    c.add_init_script("(()=>{localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_conta',%r);localStorage.setItem('lf_auth',%r);try{sessionStorage.setItem('lf_ni','1')}catch(e){};%s})()"%(kit.CONTA,kit.AUTH,("document.documentElement.setAttribute('data-ev','%s')"%ev) if ev else ''))
    pg=c.new_page();pg.on('console',lambda m: log.append(m.type+': '+m.text) if m.type in ('error',) else None);pg.on('pageerror',lambda e: log.append('PAGEERROR '+str(e)))
    pg.goto('http://localhost:8811/?kit=1');pg.wait_for_timeout(2500)
    if ev: pg.evaluate("(e)=>document.documentElement.setAttribute('data-ev',e)",ev);pg.wait_for_timeout(400)
    pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;transition:none!important}')
    return b,pg,log
if __name__=='__main__':
    with sync_playwright() as pw:
        b,pg,log=abre(pw)
        print('cards',pg.evaluate("()=>JSON.stringify((window.__lfCards&&1)||0)"),pg.evaluate("()=>!!document.querySelector('#home .exs')"))
        pg.evaluate("()=>{const h=document.querySelector('#home .exs');h&&h.scrollIntoView({block:'start'});window.scrollBy(0,-140)}");pg.wait_for_timeout(400);pg.screenshot(path=T+'1home.png')
        pg.evaluate("()=>document.querySelector('#home .exs [data-exc]').click()");pg.wait_for_timeout(1500);pg.screenshot(path=T+'2aba.png')
        print('exc grid',pg.evaluate("()=>[document.querySelectorAll('#grid .card').length,!!document.querySelector('#vitrine .exh'),(document.querySelector('#grid .card .pr')||{}).innerHTML]"))
        print('\n'.join(log[:12]));b.close()

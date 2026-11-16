# S374: prova da linha de diagnóstico — prévia do painel (cliente=1) e administrador, site DESLIGADO, nuvem fingida; o "app" muda os produtos no meio.
import sys,subprocess,time,json
from playwright.sync_api import sync_playwright
srv=subprocess.Popen(['python3','-m','http.server','8881','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    for cliente in (True,False):
        b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);c=b.new_context(viewport={'width':430,'height':900},service_workers='block');est={'pv':1794800000000,'docs':[],'c':0,'p':0}
        def fs(r):
            u=r.request.url
            if 'config/site' in u: est['c']+=1
            if '/produtos' in u: est['p']+=1
            if 'config/site' in u: return r.fulfill(json={'name':'x/config/site','fields':{'ativo':{'booleanValue':False},'pv':{'integerValue':str(est['pv'])}}})
            if '/produtos' in u: return r.fulfill(json={'documents':est['docs']})
            return r.fulfill(json={})
        c.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort());c.route('**/firestore.googleapis.com/**',fs);c.route('**/securetoken.googleapis.com/**',lambda r:r.fulfill(json={'id_token':'t','refresh_token':'x'}))
        pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:160]));pg.goto('http://localhost:8881/404.html');pg.evaluate("()=>{localStorage.setItem('lf_rt','x')}")
        c.route('**/__pai.html',lambda r:r.fulfill(body='<body style="margin:0"><iframe id=f style="width:420px;height:860px;border:0" src="/index.html?p=1'+('&cliente=1' if cliente else '')+'"></iframe>',content_type='text/html'))
        pg.goto('http://localhost:8881/__pai.html');pg.wait_for_timeout(7000);f=[x for x in pg.frames if x!=pg.main_frame][0]
        L="()=>[...document.querySelectorAll('.lfdg')].map(e=>e.parentElement.id+': '+e.textContent)"
        print('cliente' if cliente else 'administrador','| 1:',f.evaluate(L))
        nomes=f.evaluate("()=>[...document.querySelectorAll('[data-open]')].map(e=>e.getAttribute('data-open')).filter((v,i,a)=>v&&a.indexOf(v)===i).slice(0,6)")
        est['docs']=[{'name':'p/d/produtos/'+r,'fields':{'nome':{'stringValue':'PECA '+r},'tipo':{'stringValue':'sem'},'n':{'integerValue':'100000'},'est':{'integerValue':'5'},'lib':{'booleanValue':True}}} for r in nomes];est['pv']=int(time.time()*1000);print('   hidden',f.evaluate('()=>[document.hidden,document.visibilityState]'));pg.wait_for_timeout(45000)
        print('   2:',f.evaluate(L),'| erros',er,'| leituras config',est['c'],'produtos',est['p']);pg.screenshot(path='/tmp/gt/dg_%d.png'%cliente,clip={'x':0,'y':0,'width':420,'height':860});b.close()
finally: srv.terminate()

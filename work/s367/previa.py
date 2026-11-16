# Reproduz a prévia do painel: site dentro de um iframe, dono logado, Firestore fingido. Compara site LIGADO × DESLIGADO quando o app muda produtos.
import sys,subprocess,time,json
from playwright.sync_api import sync_playwright
sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
srv=subprocess.Popen(['python3','-m','http.server','8766'],cwd='/home/claude/catalogo',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
def roda(pw,ativo,cliente):
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox']);c=b.new_context(viewport={'width':1200,'height':900},service_workers='block')
    est={'pv':1,'docs':None,'n':0}
    def fs(r):
        u=r.request.url
        if 'config/site' in u: return r.fulfill(json={'name':'x/config/site','fields':{'ativo':{'booleanValue':ativo},'pv':{'integerValue':str(est['pv'])}}})
        if '/produtos' in u:
            est['n']+=1
            return r.fulfill(json={'documents':est['docs'] or []})
        return r.fulfill(json={})
    c.route('**/firestore.googleapis.com/**',fs)
    c.route('**/securetoken.googleapis.com/**',lambda r:r.fulfill(json={'id_token':'t','refresh_token':'x'}))
    c.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
    c.route('**/firestore.googleapis.com/**',fs);c.route('**/securetoken.googleapis.com/**',lambda r:r.fulfill(json={'id_token':'t','refresh_token':'x'}))
    pg=c.new_page();pg.goto('http://localhost:8766/404.html');pg.evaluate("()=>{localStorage.setItem('lf_rt','x')}")
    # 1ª carga: sem documentos → o site fica com os produtos embutidos; pego os nomes e monto os documentos
    c.route('**/__pai.html',lambda r:r.fulfill(body='<iframe id=f style="width:1100px;height:800px" src="/index.html?p=1'+('&cliente=1' if cliente else '')+'"></iframe>',content_type='text/html'))
    pg.goto('http://localhost:8766/__pai.html');time.sleep(6)
    print('quadros',[x.url for x in pg.frames],pg.url,flush=True)
    f=[x for x in pg.frames if x!=pg.main_frame][0]
    nomes=f.evaluate("()=>[...document.querySelectorAll('[data-open]')].map(e=>e.getAttribute('data-open')).filter((v,i,a)=>v&&a.indexOf(v)===i).slice(0,6)")
    est['docs']=[{'name':'p/d/produtos/'+r,'fields':{'nome':{'stringValue':'PECA '+r},'tipo':{'stringValue':'sem'},'n':{'integerValue':'100000'},'est':{'integerValue':'5'},'lib':{'booleanValue':True}}} for r in nomes]
    est['pv']=2;time.sleep(26)
    a=f.evaluate("()=>[...document.querySelectorAll('[data-open]')].map(e=>e.getAttribute('data-open')).filter((v,i,a)=>v&&a.indexOf(v)===i).length")
    t1=f.evaluate("()=>document.body.innerText.includes('PECA ')")
    # o app exclui uma peça e renomeia outra
    est['docs']=est['docs'][1:];est['docs'][0]['fields']['nome']['stringValue']='MUDOU AGORA';est['pv']=3;time.sleep(26)
    bq=f.evaluate("()=>[...document.querySelectorAll('[data-open]')].map(e=>e.getAttribute('data-open')).filter((v,i,a)=>v&&a.indexOf(v)===i).length")
    t2=f.evaluate("()=>document.body.innerText.includes('MUDOU AGORA')")
    man=f.evaluate("()=>[!!document.getElementById('manut'),!!document.getElementById('admb'),!!document.getElementById('prvb'),!!document.getElementById('prevld')]")
    print('ativo=%s cliente=%s · refs iniciais %d · depois dos docs %d (nome novo %s) · depois de excluir/renomear %d (viu a mudança %s) · leituras de produtos %d · [manut,admb,prvb,prevld]=%s'%(ativo,cliente,len(nomes),a,t1,bq,t2,est['n'],man),flush=True)
    b.close()
try:
    with sync_playwright() as pw:
        for ativo in (True,False):
            for cli in (False,True): roda(pw,ativo,cli)
finally: srv.kill()

# Kit do PAINEL do site (catalogo/admin.html) — S340, 15/11/2026.
# Abre o painel REAL no simulador sem senha e sem internet: sessão de mentira no navegador e respostas de mentira no lugar do Google
# (login, banco de dados, funções). Dados de exemplo: produtos da cópia do site. Nada é gravado em lugar nenhum de verdade.
# Uso: import painel; b,pg,w,log = painel.abre(pw, escuro=True, W=390, H=844)   ·   painel.vai(pg,'msg')
import os,re,json,sys,time
sys.path.insert(0,os.path.dirname(__file__));sys.argv=sys.argv[:1];import kit
SITE='/home/claude/catalogo';PORTA=8813;TELAS=['vit','prod','msg','tem','anl','cfg']
_ok=[False]
def _serve():
    if not _ok[0]: kit.serve(SITE,PORTA);_ok[0]=True
def _tf(v):
    if v is None: return {'nullValue':None}
    if isinstance(v,bool): return {'booleanValue':v}
    if isinstance(v,int): return {'integerValue':str(v)}
    if isinstance(v,float): return {'doubleValue':v}
    if isinstance(v,str): return {'stringValue':v}
    if isinstance(v,list): return {'arrayValue':{'values':[_tf(x) for x in v]}}
    return {'mapValue':{'fields':{k:_tf(x) for k,x in v.items()}}}
def doc(caminho,o): return {'name':'projects/p/databases/(default)/documents/'+caminho,'fields':{k:_tf(v) for k,v in o.items()}}
def produtos():
    out=[];nomes=[('Solar hexagonal','sol','Metal'),('Leitura retangular','lei','Acetato'),('Armação redonda','arm','Metal'),('Solar aviador','sol','Metal'),('Leitura gatinho','lei','Acetato'),('Armação quadrada','arm','Acetato')]
    for i in range(18):
        n,t,m=nomes[i%6];ref='KT%03d'%(i+1)
        out.append(doc('produtos/'+ref,{'ref':ref,'nome':n+' '+str(i+1),'tipo':t,'mat':m,'n':20+5*(i%7),'est':[0,1,2,5,9][i%5],'ord':i,'oculto':i%9==8,'fv':1 if i%4 else 0,'cores':[{'n':'Preto','q':2},{'n':'Dourado','q':1}],'aviso':'Esgotado' if i%5==0 else ''}))
    return out
def abre(pw,escuro=True,W=390,H=844,extra=None):
    _serve();log=[]
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
    c=b.new_context(viewport={'width':W,'height':H},device_scale_factor=2 if W<900 else 1,is_mobile=W<900,has_touch=W<900,color_scheme='dark' if escuro else 'light')
    agora=int(time.time()*1000)
    dados={'config/site':doc('config/site',{'ativo':True,'cordem':'eq','aviso':'','dst':{'modo':'fotos'}}),
      'mensagens':[doc('mensagens/m1',{'tipo':'contato','nome':'Ana Teste','msg':'Vocês têm estojo?','ts':agora-3600000,'lida':False}),doc('mensagens/m2',{'tipo':'atacado','nome':'Óptica Sol','msg':'Quero 20 peças','ts':agora-7200000,'lida':False,'qtd':20})]}
    def rota(r):
        u=r.request.url;m=r.request.method
        if u.startswith('http://localhost'): return r.continue_()
        log.append((m,u.split('?')[0][-70:]))
        if 'securetoken' in u or 'identitytoolkit' in u: return r.fulfill(json={'id_token':'t','idToken':'t','refresh_token':'r','refreshToken':'r','expires_in':'3600','users':[{'email':'teste@exemplo.com'}]})
        if 'firestore.googleapis.com' in u:
            cam=u.split('/documents/')[1].split('?')[0] if '/documents/' in u else ''
            if m!='GET': return r.fulfill(json={})
            if cam=='config/site': return r.fulfill(json=dados['config/site'])
            if cam=='produtos': return r.fulfill(json={'documents':produtos()})
            if cam in dados and isinstance(dados[cam],list): return r.fulfill(json={'documents':dados[cam]})
            if '/' in cam: return r.fulfill(status=404,json={})
            return r.fulfill(json={'documents':[]})
        if 'cloudfunctions.net' in u: return r.fulfill(json={'ok':True,'lista':[],'itens':[],'aparelhos':[],'dias':[]})
        if 'api.github.com' in u: return r.fulfill(json={})
        return r.abort()
    c.route('**/*',rota)
    c.add_init_script("try{localStorage.setItem('lf_rt','teste');localStorage.setItem('lf_ini',String(Date.now()))}catch(e){}"+(extra or ''))
    pg=c.new_page();pg.erros=[];pg.on('pageerror',lambda e:pg.erros.append((str(e)+' @ '+(getattr(e,'stack','') or '').replace('\n',' | '))[:330]))
    pg.goto('http://localhost:%d/admin.html'%PORTA);pg.wait_for_timeout(3500)
    return b,pg,pg.wait_for_timeout,log
def vai(pg,v):
    pg.evaluate("v=>{const b=document.querySelector('[data-v=\"'+v+'\"]');if(b)b.click();else if(typeof go==='function')go(v)}",v);pg.wait_for_timeout(1200)

# S374: app REAL com o painel do site REAL dentro (lafouch.com/admin.html servido da cópia local ../catalogo, Google de mentira como no work/kit/painel.py).
import sys,os,time,mimetypes;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap,painel
SITE='/home/claude/catalogo'
def abre(pw,escuro=True):
    b,pg,w=ap.abre(pw,'inicio',escuro);c=pg.context;agora=int(time.time()*1000)
    dados={'config/site':painel.doc('config/site',{'ativo':True,'cordem':'eq','aviso':'','dst':{'modo':'fotos'}}),
      'mensagens':[painel.doc('mensagens/m1',{'tipo':'contato','nome':'Ana Teste','msg':'Vocês têm estojo?','ts':agora-3600000,'lida':False}),painel.doc('mensagens/m2',{'tipo':'atacado','nome':'Óptica Sol','msg':'Quero 20 peças','ts':agora-7200000,'lida':False,'qtd':20})]}
    def rota(r):
        u=r.request.url;m=r.request.method
        if u.startswith('https://lafouch.com/'):
            p=u.split('https://lafouch.com/')[1].split('?')[0].split('#')[0] or 'index.html';f=os.path.join(SITE,p)
            if os.path.isfile(f): return r.fulfill(path=f,headers={'content-type':mimetypes.guess_type(f)[0] or 'text/html'})
            return r.fulfill(status=404,body='')
        if 'securetoken' in u or 'identitytoolkit' in u: return r.fulfill(json={'id_token':'t','idToken':'t','refresh_token':'r','refreshToken':'r','expires_in':'3600','users':[{'email':'teste@exemplo.com'}]})
        if 'firestore.googleapis.com' in u:
            cam=u.split('/documents/')[1].split('?')[0] if '/documents/' in u else ''
            if m!='GET': return r.fulfill(json={})
            if cam=='config/site': return r.fulfill(json=dados['config/site'])
            if cam=='produtos': return r.fulfill(json={'documents':painel.produtos()})
            if cam in dados and isinstance(dados[cam],list): return r.fulfill(json={'documents':dados[cam]})
            if '/' in cam: return r.fulfill(status=404,json={})
            return r.fulfill(json={'documents':[]})
        if 'cloudfunctions.net' in u: return r.fulfill(json={'ok':True,'lista':[],'itens':[],'aparelhos':[],'dias':[]})
        if u.startswith('http://localhost') or u.startswith('http://127.'): return r.continue_()
        return r.abort()
    c.unroute('**/*');c.route('**/*',rota)
    pg.evaluate("()=>{const S=window.__LF.S;S.nuvem=S.nuvem||{};S.nuvem.rt='rt-teste-'+'x'.repeat(30);S.nuvem.email='teste@exemplo.com'}")
    return b,pg,w
def frame(pg):
    for f in pg.frames:
        if 'admin.html' in f.url: return f

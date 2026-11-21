# S435 · abre o APP real com o PAINEL do site real dentro (catalogo/admin.html servido no lugar de lafouch.com, dados de mentira do kit painel)
import sys,os,time,mimetypes;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap,kit,painel,base_app
SITE='/home/claude/catalogo'
def abre(pw,escuro=True,W=390,H=844,extra=''):
  b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
  c=b.new_context(bypass_csp=True,viewport={'width':W,'height':H},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark' if escuro else 'light',service_workers='block')
  agora=int(time.time()*1000);d=painel.doc
  cfg=d('config/site',{'ativo':True,'cordem':'eq','aviso':'','dst':{'modo':'fotos'}})
  msgs=[d('mensagens/m1',{'tipo':'contato','nome':'Ana Teste','msg':'Vocês têm estojo?','ts':agora-3600000,'lida':False}),d('mensagens/m2',{'tipo':'atacado','nome':'Óptica Sol','msg':'Quero 20 peças','ts':agora-7200000,'lida':False,'qtd':20})]
  def rota(r):
    u=r.request.url;m=r.request.method
    if u.startswith('http://localhost') or u.startswith('http://127.'): return r.continue_()
    if u.startswith('https://lafouch.com/'):
      p=u.split('lafouch.com/')[1].split('?')[0].split('#')[0] or 'index.html';f=os.path.join(SITE,p)
      if os.path.isfile(f): return r.fulfill(path=f,content_type=mimetypes.guess_type(f)[0] or 'text/html')
      return r.fulfill(status=404,body='')
    if 'securetoken' in u or 'identitytoolkit' in u: return r.fulfill(json={'id_token':'t','idToken':'t','refresh_token':'r','refreshToken':'r','expires_in':'3600','users':[{'email':'teste@exemplo.com'}]})
    if 'firestore.googleapis.com' in u:
      cam=u.split('/documents/')[1].split('?')[0] if '/documents/' in u else ''
      if m!='GET': return r.fulfill(json={})
      if cam=='config/site': return r.fulfill(json=cfg)
      if cam=='produtos': return r.fulfill(json={'documents':painel.produtos()})
      if cam=='mensagens': return r.fulfill(json={'documents':msgs})
      if '/' in cam: return r.fulfill(status=404,json={})
      return r.fulfill(json={'documents':[]})
    if 'cloudfunctions.net' in u: return r.fulfill(json={'ok':True,'lista':[],'itens':[],'aparelhos':[],'dias':[]})
    return r.abort()
  c.route('**/*',rota)
  c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
  c.add_init_script("try{if(location.host=='lafouch.com'){localStorage.setItem('lf_rt','teste');localStorage.setItem('lf_ini',String(Date.now()))}}catch(e){}"+extra)
  c.add_init_script("if(location.host!='lafouch.com'){"+base_app.script()+"}")
  pg=c.new_page();pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(1000)
  return b,pg,pg.wait_for_timeout

# Conferência itens 09/20 (SITE) e 21 (APP) — pedido do dono 20/11 12:26. Site: Hoje = ef883de × Proposta = main publicado.
# Sem internet no teste: as respostas da nuvem são simuladas e toda chamada é anotada (para ver QUEM o site chama).
import sys,json,time;sys.path.insert(0,'/home/claude/lafouch/work/kit')
import kit
from playwright.sync_api import sync_playwright
O='/home/claude/lafouch/work/conf0920/'
AGORA=int(time.time()*1000)
def rota(chamadas,versao):
  def r(route):
    u=route.request.url;m=route.request.method;b=route.request.post_data or ''
    if u.startswith('http://localhost'): return route.continue_()
    chamadas.append((m,u.split('?')[0].replace('https://',''),b[:160]))
    if 'cloudfunctions.net/conta' in u:
      j=json.loads(b or '{}')
      if j.get('senha')=='errada': return route.fulfill(status=200,content_type='application/json',body=json.dumps({'ok':False,'motivo':'login'}))
      return route.fulfill(status=200,content_type='application/json',body=json.dumps({'ok':True,'localId':'u2','idToken':'tk','refreshToken':'rf','expiresIn':'3600','email':'joao@teste.com','displayName':'João'}))
    if 'cloudfunctions.net/reserva' in u:
      return route.fulfill(status=200,content_type='application/json',body=json.dumps({'ok':True,'tok':'LF-4821'}))
    if 'identitytoolkit' in u and 'signInWithPassword' in u:
      j=json.loads(b or '{}')
      if j.get('password')=='errada': return route.fulfill(status=400,content_type='application/json',body=json.dumps({'error':{'message':'INVALID_LOGIN_CREDENTIALS'}}))
      return route.fulfill(status=200,content_type='application/json',body=json.dumps({'localId':'u2','idToken':'tk','refreshToken':'rf','expiresIn':'3600','email':'joao@teste.com','displayName':'João'}))
    if 'firestore.googleapis.com' in u and '/usuarios/joaoteste' in u:
      return route.fulfill(status=200,content_type='application/json',body=json.dumps({'fields':{'email':{'stringValue':'joao@teste.com'}}}))
    if 'firestore.googleapis.com' in u and '/reservas/P1' in u:
      return route.fulfill(status=200,content_type='application/json',body=json.dumps({'fields':{'pago':{'booleanValue':True},'tok':{'stringValue':'LF-VELHO'}}}))
    return route.abort()
  return r
def abre(pw,porta,ini=''):
  b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
  c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2,reduced_motion='reduce')
  c.add_init_script("try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');%s}catch(e){}"%ini)
  ch=[];c.route('**/*',rota(ch,porta))
  pg=c.new_page();pg.goto('http://localhost:%d/?cliente=1'%porta,wait_until='load');pg.wait_for_timeout(4000)
  return b,pg,ch
def login(pw,porta,senha,nome):
  b,pg,ch=abre(pw,porta);ch.clear()
  pg.evaluate("()=>{const x=document.createElement('button');x.dataset.cta='entrar';document.body.appendChild(x);x.click()}");pg.wait_for_timeout(1200)
  pg.screenshot(path=O+'%s_tela.png'%nome)
  pg.fill('#aul','joaoteste');pg.fill('#aup',senha);pg.wait_for_timeout(200)
  pg.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(x=>/^iniciar sessão$/i.test(x.textContent.trim()));b&&b.click()}");pg.wait_for_timeout(2500)
  msg=pg.evaluate("()=>[...document.querySelectorAll('.toast,#toast,[role=status],[role=alert],.cferr,#cferr,.dlgerr')].filter(e=>e.offsetParent!==null||e.getBoundingClientRect().height).map(e=>e.innerText.trim()).filter(Boolean).join(' | ')")
  pg.screenshot(path=O+'%s_depois.png'%nome)
  logou=pg.evaluate("()=>!!localStorage.getItem('lf_auth')")
  b.close();return {'chamadas':[c[1]+' '+c[2][:70] for c in ch if 'googleapis.com/v1/projects' in c[1] or 'cloudfunctions' in c[1] or 'identitytoolkit' in c[1]],'mensagem':msg,'entrou':logou}
def token(pw,porta,nome):
  ini="localStorage.setItem('lf_auth',JSON.stringify({uid:'u2',idToken:'tk',refreshToken:'rf',exp:%d,email:'joao@teste.com'}));localStorage.setItem('lf_conta',JSON.stringify({nome:'João Teste',email:'joao@teste.com',tel:'+595981000000'}));localStorage.setItem('lf_ped',JSON.stringify([{id:'P1',cod:'1001',est:'pagar',ts:%d,tel:'+595981000000',tot:60000,itens:[{n:'Óculos solar #13',q:1}]}]))"%(AGORA+36e5*5,AGORA)
  b,pg,ch=abre(pw,porta,ini);ch.clear()
  pg.evaluate("()=>{const x=document.createElement('button');x.dataset.cta='minha';document.body.appendChild(x);x.click()}");pg.wait_for_timeout(1500)
  pg.evaluate("()=>{const t=[...document.querySelectorAll('#layer button,#layer [role=tab]')].find(x=>/pedidos/i.test(x.textContent));t&&t.click()}");pg.wait_for_timeout(9500)
  pg.evaluate("()=>{const t=[...document.querySelectorAll('#layer button,#layer [role=tab]')].find(x=>/pedidos/i.test(x.textContent));t&&t.click()}");pg.wait_for_timeout(2500)
  linha=pg.evaluate("()=>{const e=document.querySelector('#layer .cfp');return e?e.innerText.replace(/\\n/g,' · '):'sem linha de pedido'}")
  pg.screenshot(path=O+'%s.png'%nome)
  b.close();return {'chamadas':[c[1]+' '+c[2][:90] for c in ch if 'googleapis.com/v1/projects' in c[1] or 'cloudfunctions' in c[1]],'pedido':linha}
R={}
with sync_playwright() as pw:
  for porta,v in ((8851,'hoje'),(8852,'prop')):
    R[v]={'login_certo':login(pw,porta,'certa123','login_certo_'+v),'login_errado':login(pw,porta,'errada','login_errado_'+v),'token':token(pw,porta,'token_'+v)}
json.dump(R,open(O+'resultado.json','w'),ensure_ascii=False,indent=1)
for v in R:
  print('=====',v)
  for k,x in R[v].items(): print(' ',k,json.dumps(x,ensure_ascii=False)[:600])

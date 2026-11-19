# Prova: com o site DESLIGADO, o cartão do interruptor some do painel (regex só aceita "está no ar")
import os,mimetypes,sys;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
from playwright.sync_api import sync_playwright
CAT='/home/claude/catalogo'
def rota(r):
  u=r.request.url
  if u.startswith('https://lafouch.com/'):
    p=u.split('https://lafouch.com/',1)[1].split('?')[0] or 'index.html';f=os.path.join(CAT,p)
    if os.path.isfile(f): return r.fulfill(status=200,body=open(f,'rb').read(),content_type=mimetypes.guess_type(f)[0] or 'text/plain')
    return r.fulfill(status=404,body=b'')
  return r.abort()
with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox']);c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark')
  c.route('**/*',rota);pg=c.new_page();pg.goto('https://lafouch.com/admin.html?aba=cfg&app=2');pg.wait_for_timeout(1500)
  for estado in ('O site está no ar','O site está fora do ar'):
    r=pg.evaluate("""(t)=>{document.getElementById('v_cfg').hidden=false;document.getElementById('onl').textContent=t;dispatchEvent(new Event('resize'));const c=document.getElementById('c_cfg');return {hidden:c.hidden,classe:c.className,linhas:[...document.querySelectorAll('.p207l.cfg .lin b')].map(x=>x.textContent).slice(0,3)}}""",estado)
    print(estado,'->',r)
  b.close()

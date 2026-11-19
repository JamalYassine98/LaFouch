# Reproduz o painel do site dentro do app (lafouch.com servido do catalogo local; nuvem bloqueada)
import sys,os,mimetypes;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit,base_app
kit.serve(os.path.join(kit.RAIZ,'www'),kit.PA)
from playwright.sync_api import sync_playwright
CAT='/home/claude/catalogo'
def rota(r):
  u=r.request.url
  if u.startswith('http://localhost') or u.startswith('http://127.'): return r.continue_()
  if u.startswith('https://lafouch.com/'):
    p=u.split('https://lafouch.com/',1)[1].split('?')[0].split('#')[0] or 'index.html'
    f=os.path.join(CAT,p)
    if os.path.isfile(f): return r.fulfill(status=200,body=open(f,'rb').read(),content_type=mimetypes.guess_type(f)[0] or 'application/octet-stream')
    return r.fulfill(status=404,body=b'')
  LOG.append('BLOQ '+u[:120]);return r.abort()
LOG=[]
with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
  c=b.new_context(bypass_csp=True,viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark',service_workers='block')
  c.route('**/*',rota);c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
  pg=c.new_page()
  pg.on('console',lambda m: LOG.append('CONSOLE %s %s'%(m.type,m.text[:200])))
  pg.on('pageerror',lambda e: LOG.append('ERRO '+str(e)[:300]))
  pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(1000)
  pg.evaluate("()=>__LF.setView('ajustes')");pg.wait_for_timeout(600)
  pg.locator('.ajS[data-k=site] .ajR').first.tap();pg.wait_for_timeout(5000);print('view',pg.evaluate("()=>__LF.S.view"));pg.screenshot(path='/tmp/sp2.png')
  pg.screenshot(path='/tmp/sp1.png')
  fr=[f for f in pg.frames if 'lafouch.com' in f.url]
  print('frames',[f.url for f in pg.frames])
  if fr:
    f=fr[0];print(f.evaluate("()=>document.body.innerText.slice(0,800)"))
  for l in LOG[:40]: print(l)
  b.close()

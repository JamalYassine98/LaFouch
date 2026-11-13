import json,sys
from playwright.sync_api import sync_playwright
out=sys.argv[1];inj=sys.argv[2] if len(sys.argv)>2 else None;lote='--lote' in sys.argv
S=open('/tmp/kitsite/js/lf-site.js').read()
import re
L=re.findall(r"\{ref:'([A-Z0-9]+)',[^}]*?nome:'([^']*)',tipo:'(\w+)',n:(\d+)[^}]*?foto:'([^']*)'",S)
it=[{'ref':r,'nome':n,'tipo':t,'mat':'Acetato','usd':round(int(p)*0.55/7300,2),'gs':int(int(p)*0.55),'cores':[['Negro',12],['Tortuga',4]] if i%2 else [['Transparente',8]],'foto':f.lstrip('/')} for i,(r,n,t,p,f) in enumerate(L[:10])]
if lote: it=it[:4]
M={'ok':True,'conta':{'nome':'Óptica Visión','tipo':'associada','aparelhos':[],'trocas':True},'tabela':'Tabla A1','minimo':150,'ts':0,'itens':it}
def rota(r):
    u=r.request.url
    if u.startswith('http://localhost'): return r.continue_()
    if 'atacado' in u: return r.fulfill(status=200,content_type='application/json',body=json.dumps(M))
    return r.abort()
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
  c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='es-PY',service_workers='block')
  c.add_init_script("localStorage.setItem('lf_lang','es');localStorage.setItem('lf_at_OPV1',JSON.stringify('kit'));localStorage.setItem('lf_atdev',JSON.stringify('dkit'));sessionStorage.setItem('lf_ni','1')")
  c.route('**/*',rota);pg=c.new_page();pg.on('pageerror',lambda e:print('ERRO',e));pg.on('console',lambda m:print('LOG',m.text) if m.type=='error' else None);pg.goto('http://localhost:8811/?c=OPV1'+('&l=L7' if lote else ''));pg.wait_for_timeout(3000)
  if inj:
    try: pg.evaluate(open(inj).read())
    except Exception as e: print('ERRO INJ',str(e)[:300])
    pg.wait_for_timeout(600)
  for x in pg.evaluate(open('/home/claude/lafouch/work/kit/centro.js').read()): print('DESIGNER:',x)
  for x in pg.evaluate(open('/home/claude/lafouch/work/kit/sobre.js').read()): print('DESIGNER:',x)
  pg.screenshot(path=out)

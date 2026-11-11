import sys,json
from playwright.sync_api import sync_playwright
P=int(sys.argv[1]) if len(sys.argv)>1 else 8773
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'])
  c=b.new_context(locale='pt-BR',viewport={'width':390,'height':844},device_scale_factor=2,has_touch=True,is_mobile=True,permissions=['camera'])
  pg=c.new_page();E=[];pg.on('pageerror',lambda e:E.append(str(e)))
  pg.goto('about:blank');pg.goto(f'http://localhost:{P}/');pg.wait_for_timeout(2500)
  st=lambda:pg.evaluate("({gw:!!document.querySelector('#gw'),gzon:document.documentElement.classList.contains('gzon'),ppop:document.documentElement.classList.contains('ppop'),lock:document.documentElement.classList.contains('lock'),y:scrollY,hl:history.length,i:(history.state||{}).__i,lfo:(history.state||{}).lfo})")
  R={}
  def consulta():pg.evaluate("window.__lfGzAbre()");pg.wait_for_timeout(1800)
  # 1) logo direto da início
  consulta();R['aberta']=st();pg.click('.top .logo',force=True);pg.wait_for_timeout(1500);R['logo_inicio']=st()
  # 2) a partir do catálogo → consulta → logo
  pg.click('#mnb');pg.wait_for_timeout(600);pg.click('#drw a[data-mf="tipo:grau"]');pg.wait_for_timeout(1500);consulta();pg.click('.top .logo',force=True);pg.wait_for_timeout(1800);R['logo_do_catalogo']=st()
  # 3) voltar do celular fecha a consulta
  consulta();pg.go_back();pg.wait_for_timeout(1200);R['voltar']=st()
  # 4) Esc
  consulta();pg.keyboard.press('Escape');pg.wait_for_timeout(1200);R['esc']=st()
  R['erros']=E;print(json.dumps(R,ensure_ascii=False,indent=0))

import sys,time,json;sys.path.insert(0,'/home/claude/lafouch/work/testes')
from playwright.sync_api import sync_playwright
P=int(sys.argv[1]) if len(sys.argv)>1 else 8773
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
  c=b.new_context(locale='pt-BR',viewport={'width':390,'height':844},device_scale_factor=2,has_touch=True,is_mobile=True)
  pg=c.new_page();E=[];pg.on('pageerror',lambda e:E.append(str(e)))
  pg.goto(f'http://localhost:{P}/');pg.wait_for_timeout(2500)
  R={}
  # vai para Solar pelo menu
  pg.click('#mnb');pg.wait_for_timeout(600);pg.click('#drw a[data-mf="tipo:solar"]');pg.wait_for_timeout(1500)
  R['secao']=pg.evaluate("(document.querySelector('#vitrine h1,#vitrine h2,.vtit')||{}).textContent")
  pg.click('#sbtn');pg.wait_for_timeout(600);pg.fill('#q5','Óculos de');pg.wait_for_timeout(500)
  R['sugestoes_bloco']=pg.evaluate("!!document.querySelector('#sores .srh')&&[...document.querySelectorAll('#sores .srh')].map(x=>x.textContent)")
  # simula teclado: viewport menor
  pg.set_viewport_size({'width':390,'height':500});pg.wait_for_timeout(500)
  R['lista_fim_acima_teclado']=pg.evaluate("(()=>{const r=document.querySelector('#sores').getBoundingClientRect();return [Math.round(r.bottom),innerHeight]})()")
  s0=pg.evaluate("document.querySelector('#sores').scrollTop")
  cdp=c.new_cdp_session(pg)
  def arrasta(x,y0,y1,n=8):
    cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y0}]})
    for i in range(1,n+1):cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y0+(y1-y0)*i/n}]});time.sleep(.016)
    cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
  arrasta(200,400,150);pg.wait_for_timeout(500)
  R['rolou_com_dedo']=[s0,pg.evaluate("document.querySelector('#sores').scrollTop")]
  pg.set_viewport_size({'width':390,'height':844});pg.wait_for_timeout(300)
  # Enter com nome parcial → catálogo inteiro
  pg.fill('#q5','leitura');pg.keyboard.press('Enter');pg.wait_for_timeout(1500)
  R['enter_parcial']=pg.evaluate("[document.querySelectorAll('#grid [data-open]').length, (document.querySelector('#resultado')||{}).textContent]")
  # volta à Solar e busca o nome inteiro → abre o produto direto
  pg.click('#mnb');pg.wait_for_timeout(600);pg.click('#drw a[data-mf="tipo:solar"]');pg.wait_for_timeout(1500)
  pg.click('#sbtn');pg.wait_for_timeout(600);pg.fill('#q5','Óculos de leitura transparente');pg.keyboard.press('Enter');pg.wait_for_timeout(1800)
  R['enter_nome_inteiro']=pg.evaluate("[location.pathname,(document.querySelector('#layer h1,#layer .pnm,#layer h2')||{}).textContent]")
  pg.screenshot(path='/home/claude/lafouch/work/s110/produto.png')
  R['erros']=E
  print(json.dumps(R,ensure_ascii=False,indent=1))

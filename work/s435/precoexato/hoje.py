import sys,json,time;sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
from playwright.sync_api import sync_playwright
O='/home/claude/lafouch/work/s435/precoexato/'
AG=int(time.time()*1000)
def abre(pw,pag,esc=True):
  b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
  c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2,reduced_motion='reduce',color_scheme='dark' if esc else 'light')
  ped=[{'id':'P1','cod':'K7Q2','est':'pagar','ts':AG,'tel':'+595981000000','total':250000,'brl':178.53 if pag=='pix' else 0,'pagar':249963 if pag=='alias' else 0,'uq':37,'ent':'loja','pag':pag,'rx':AG+30*60000,'rd':0,'itens':[{'ref':'BR44118','nome':'Óculos solar redondo','q':1}]}]
  ini="localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_auth',JSON.stringify({uid:'u2',idToken:'tk',refreshToken:'rf',exp:%d,email:'joao@teste.com'}));localStorage.setItem('lf_conta',JSON.stringify({nome:'João Teste',email:'joao@teste.com',tel:'+595981000000',doc:'1234567'}));localStorage.setItem('lf_ped',JSON.stringify(%s))"%(AG+36e5*5,json.dumps(ped))
  c.add_init_script("try{sessionStorage.setItem('lf_ni','1');%s}catch(e){}"%ini)
  c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.fulfill(status=200,content_type='application/json',body='{}'))
  pg=c.new_page();pg.goto('http://localhost:8861/?cliente=1',wait_until='load');pg.wait_for_timeout(4000)
  return b,pg
with sync_playwright() as pw:
  for pag in ('pix','alias'):
    b,pg=abre(pw,pag)
    pg.evaluate("()=>{const x=document.createElement('button');x.dataset.cta='minha';document.body.appendChild(x);x.click()}");pg.wait_for_timeout(1500)
    pg.evaluate("()=>{const t=[...document.querySelectorAll('#layer button,#layer [role=tab]')].find(x=>/pedidos/i.test(x.textContent));t&&t.click()}");pg.wait_for_timeout(2500)
    print(pag,pg.evaluate("()=>[...document.querySelectorAll('#layer button,#layer a')].map(x=>x.textContent.trim()).filter(Boolean).slice(0,30)"))
    pg.evaluate("()=>{const t=[...document.querySelectorAll('#layer button,#layer a')].find(x=>/^Pedido K7Q2/.test(x.textContent.trim()));t&&t.click()}");pg.wait_for_timeout(2500)
    pg.screenshot(path=O+'h_%s.png'%pag,full_page=False)
    print(pg.evaluate("()=>document.querySelector('#layer')?document.querySelector('#layer').innerText.slice(0,500):''"))
    b.close()

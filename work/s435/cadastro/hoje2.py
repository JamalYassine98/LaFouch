import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
O='/home/claude/lafouch/work/s435/cadastro/'
def abre(pw,H=844):
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=True)
  pg.set_viewport_size({'width':390,'height':H})
  pg.evaluate("()=>{const b=document.querySelector('button[aria-label=\"Adicionar\"]');b&&b.click()}");w(1500)
  return b,pg,w
def clica(pg,txt):
  return pg.evaluate("t=>{const b=[...document.querySelectorAll('button,[role=button],label,summary')].filter(x=>x.getBoundingClientRect().height).reverse().find(x=>x.textContent.trim().startsWith(t));if(b){b.click();return b.tagName}return false}",txt)
with sync_playwright() as pw:
  b,pg,w=abre(pw,1500);clica(pg,'Preencher à mão');w(1500);clica(pg,'MAIS DETALHES');clica(pg,'Mais detalhes');w(800)
  pg.screenshot(path=O+'h_mao_alto.png')
  pg.fill('input[placeholder^="Ex.: SL2250"]','TS1234') if pg.query_selector('input[placeholder^="Ex.: SL2250"]') else None
  pg.evaluate("()=>{const i=[...document.querySelectorAll('input')].find(x=>/0,50/.test(x.placeholder));if(i){i.value='4,5';i.dispatchEvent(new Event('input',{bubbles:true}))}}");w(400)
  print('cont',clica(pg,'Continuar'));w(1800)
  pg.screenshot(path=O+'h_mao_passo2.png')
  print(pg.evaluate("()=>{const d=[...document.querySelectorAll('.ljJn,[role=dialog],.modal-box')].filter(e=>e.getBoundingClientRect().height).pop();return d?d.innerText.replace(/\\n+/g,' | ').slice(0,1200):''}"))
  b.close()
  for nome,txt in [('chegou','Chegou mercadoria'),('foto','Foto'),('haste','Ler haste')]:
    b,pg,w=abre(pw);print(nome,clica(pg,txt));w(3000)
    pg.screenshot(path=O+'h_%s.png'%nome)
    print(pg.evaluate("()=>document.body.innerText.replace(/\\n+/g,' | ').slice(0,400)"))
    b.close()

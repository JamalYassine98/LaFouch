import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
O='/home/claude/lafouch/work/s435/cadastro/'
def abre(pw):
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=True)
  pg.evaluate("()=>{const b=document.querySelector('button[aria-label=\"Adicionar\"]');b&&b.click()}");w(1500)
  return b,pg,w
def clica(pg,txt):
  return pg.evaluate("t=>{const b=[...document.querySelectorAll('button,[role=button]')].filter(x=>x.getBoundingClientRect().height).find(x=>x.textContent.trim().startsWith(t));if(b){b.click();return true}return false}",txt)
with sync_playwright() as pw:
  for nome,txt in [('mao','Preencher à mão'),('chegou','Chegou mercadoria'),('de_novo','BR44118')]:
    b,pg,w=abre(pw);print(nome,clica(pg,txt));w(1800)
    pg.screenshot(path=O+'h_%s_1.png'%nome)
    pg.screenshot(path=O+'h_%s_full.png'%nome,full_page=True)
    print(pg.evaluate("()=>{const d=[...document.querySelectorAll('.ljJn,[role=dialog],.modal-box')].filter(e=>e.getBoundingClientRect().height).pop();return d?d.innerText.replace(/\\n+/g,' | ').slice(0,900):document.body.innerText.slice(0,300)}"))
    b.close()

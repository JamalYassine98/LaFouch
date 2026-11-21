import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
O='/home/claude/lafouch/work/s435/cadastro/'
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=True)
  pg.evaluate("()=>{const b=document.querySelector('button[aria-label=\"Adicionar\"]');b&&b.click()}");w(1500)
  pg.screenshot(path=O+'h_add.png')
  pg.evaluate("()=>document.getElementById('addToMan').click()");w(1500)
  pg.screenshot(path=O+'h_p1.png')
  pg.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Armação'&&x.getBoundingClientRect().height);b&&b.click()}");w(800)
  pg.screenshot(path=O+'h_p1b.png')
  pg.fill('#eRef','TS1234');w(300);pg.fill('#eCusto','4,5');w(300)
  pg.evaluate("()=>{const S=__LF.S;S._fmtUsed='Redondo';S.eMat='Metal';S.ePub='Feminino';document.getElementById('nvNext').click()}");w(1500)
  pg.screenshot(path=O+'h_p2.png')
  print(pg.evaluate("()=>{const d=[...document.querySelectorAll('.ljJn,[role=dialog],.modal-box,#addModal')].filter(e=>e.getBoundingClientRect().height).pop();return d?d.id+'|'+d.className+'|'+d.innerText.replace(/\\n+/g,' | ').slice(0,800):''}"))
  b.close()

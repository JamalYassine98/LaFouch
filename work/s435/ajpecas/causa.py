import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
O='/home/claude/lafouch/work/s435/ajpecas/'
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=False)
  pg.click('#mainnav .mn[data-id="g:pecas"]');w(700)
  pg.click('.nvL[data-id="estoque"]');w(900)
  pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.screenshot(path=O+'f1.png')
  print(pg.evaluate("""()=>{const e=document.querySelector('.nvL');const o=[];for(const s of document.styleSheets){let r;try{r=s.cssRules}catch(x){continue}for(const c of r){if(c.selectorText&&e.matches(c.selectorText)&&/text-align|color|justify|flex-direction/.test(c.cssText))o.push(c.cssText.slice(0,220))}}
   return [document.body.className,document.documentElement.className,document.getElementById('v-grp').className,o]}"""))
  b.close()

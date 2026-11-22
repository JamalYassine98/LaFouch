import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=False);w(600)
  pg.evaluate("()=>{const b=document.createElement('button');b.dataset.act='cntCalc';b.id='x66';document.body.appendChild(b)}");pg.click('#x66');w(1200)
  pg.fill('#ccU','5');pg.dispatch_event('#ccU','input');w(800)
  print('CALC',pg.evaluate("()=>document.getElementById('ccR').innerText"))
  pg.screenshot(path='h66_calc.png')
  pg.keyboard.press('Escape');w(800)
  pg.evaluate("()=>{const b=document.createElement('button');b.dataset.act='cntEse';b.id='x67';document.body.appendChild(b)}");pg.click('#x67');w(1200)
  pg.fill('#eseV','7000');pg.dispatch_event('#eseV','input');w(600)
  print('ESE',pg.evaluate("()=>document.getElementById('eseR').innerText"))
  pg.screenshot(path='h66_ese.png')
  b.close()

import asyncio,io
from PIL import Image
from playwright.async_api import async_playwright
async def full(pg,W,H,nome):
    total=await pg.evaluate("document.documentElement.scrollHeight");fr=[];y=0
    for i in range(16):
      await pg.evaluate(f"window.scrollTo(0,{y})");await pg.wait_for_timeout(500);sy=await pg.evaluate("scrollY")
      if fr and fr[-1][0]==sy:break
      fr.append((sy,Image.open(io.BytesIO(await pg.screenshot()))))
      if i==0:await pg.evaluate("document.querySelector('.top').style.visibility='hidden';var w=document.querySelector('.wa');if(w)w.style.visibility='hidden'")
      if sy+H>=total-2:break
      y+=H
    o=Image.new('RGB',(W,fr[-1][0]+H),'white')
    for sy,im in fr:o.paste(im,(0,sy))
    o.save(nome)
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for W,H in [(390,844),(1440,900),(2560,1440)]:
      pg=await b.new_page(viewport={'width':W,'height':H});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.add_init_script("window.setInterval=(f,t)=>0")
      await pg.goto('http://localhost:8150/');await pg.evaluate("localStorage.setItem('lf_lang','pt')");await pg.goto('http://localhost:8150/');await pg.wait_for_timeout(2200)
      print(W,'zoom',await pg.evaluate("document.body.style.zoom"),'home w',await pg.evaluate("Math.round(document.getElementById('home').getBoundingClientRect().width)"),'zl',await pg.evaluate("document.documentElement.classList.contains('zl')"))
      await pg.screenshot(path=f'h_{W}.png')
      await full(pg,W,H,f'hf_{W}.png')
      await pg.evaluate("window.scrollTo(0,0);document.querySelector('.top').style.visibility=''");await pg.wait_for_timeout(300)
      await pg.evaluate("document.getElementById('sbtn').click()");await pg.wait_for_timeout(700);await pg.screenshot(path=f'busca_{W}.png')
      print('erros',errs);await pg.close()
    await b.close()
asyncio.run(m())

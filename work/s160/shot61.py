import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for W,H in [(390,844),(1440,900)]:
      pg=await b.new_page(viewport={'width':W,'height':H})
      await pg.add_init_script("window.setInterval=(f,t)=>0")
      await pg.goto('http://localhost:8143/');await pg.evaluate("""localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_cart',JSON.stringify({c:{SL2210:1},o:{}}));localStorage.setItem('lf_conta',JSON.stringify({nome:'Mariana Souza',email:'mariana.souza@gmail.com',tel:'+55 45 99812-3344',nac:'br',doc:'123'}))""");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
      if W>1000:
        for f in ['s144/s144.js','s144/s149.js']:
          await pg.add_script_tag(path='/home/claude/lafouch/work/'+f)
        await pg.evaluate("window.__s44();window.__s49('D');document.querySelector('.h49 .mn span').remove()")
      for f in ['s159/s159.js','s160/s161.js']:
        await pg.add_script_tag(path='/home/claude/lafouch/work/'+f)
      await pg.evaluate("document.getElementById('bagbtn').click()");await pg.wait_for_timeout(800)
      await pg.evaluate("window.__simStep('ent')");await pg.wait_for_timeout(600);await pg.evaluate("window.__s60()");await pg.wait_for_timeout(300)
      await pg.screenshot(path=f'hoje_ent_{W}.png' if False else f'S161_entrega_{W}.png')
      await pg.evaluate("window.__simStep('pag')");await pg.wait_for_timeout(600);await pg.evaluate("window.__s60()");await pg.wait_for_timeout(300)
      await pg.screenshot(path=f'S161_pagamento_{W}.png')
      if W<1000:
        await pg.evaluate("window.__s60erro()");await pg.wait_for_timeout(2500);await pg.screenshot(path='S161_erro_390.png')
      await pg.close()
    await b.close()
asyncio.run(m())

import asyncio,time
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    pg=await b.new_page(viewport={'width':390,'height':844})
    await pg.goto('http://localhost:8150/');await pg.wait_for_timeout(1500)
    print(await pg.evaluate("[window.__pkCod(new Error('http 403')),window.__pkCod(new TypeError('Failed to fetch')),window.__pkCod({name:'AbortError'})]"))
    t=time.time();print(await pg.evaluate("window.__pkE2()"),round(time.time()-t,1),'s')
    await pg.close()
    for W,H in [(390,844),(1440,900)]:
      pg=await b.new_page(viewport={'width':W,'height':H})
      await pg.goto('http://localhost:8150/');await pg.evaluate("""localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_cart',JSON.stringify({c:{SL2210:1,SL2250:2},o:{}}));localStorage.setItem('lf_conta',JSON.stringify({nome:'Mariana Souza',email:'mariana.souza@gmail.com',tel:'+55 45 99812-3344',nac:'br',doc:'123'}))""");await pg.goto('http://localhost:8150/');await pg.wait_for_timeout(1800)
      await pg.mouse.click(5,400)
      await pg.evaluate("document.getElementById('bagbtn').click()");await pg.wait_for_timeout(900);await pg.screenshot(path=f'cart_{W}.png')
      await pg.evaluate("window.__simStep('ent')");await pg.wait_for_timeout(700);await pg.screenshot(path=f'ent_{W}.png')
      await pg.evaluate("window.__simStep('pag')");await pg.wait_for_timeout(700);await pg.screenshot(path=f'pag_{W}.png')
      await pg.evaluate("document.querySelector('#layer [data-close], #layer .x').click()");await pg.wait_for_timeout(500)
      await pg.evaluate("document.querySelector('#contabtn').click()");await pg.wait_for_timeout(250);await pg.screenshot(path=f'conta_meio_{W}.png');await pg.wait_for_timeout(900);await pg.screenshot(path=f'conta_{W}.png')
      await pg.close()
    await b.close()
asyncio.run(m())

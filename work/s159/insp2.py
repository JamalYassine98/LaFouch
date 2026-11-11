import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for W,H in [(390,844),(1440,900)]:
      pg=await b.new_page(viewport={'width':W,'height':H})
      await pg.add_init_script("window.setInterval=(f,t)=>0")
      await pg.goto('http://localhost:8143/');await pg.evaluate("""localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_cart',JSON.stringify({c:{SL2210:1},o:{}}));localStorage.setItem('lf_conta',JSON.stringify({nome:'Mariana Souza',email:'mariana.souza@gmail.com',zap:'+55 45 99812-3344',tel:'+55 45 99812-3344',nac:'BR',doc:'123.456.789-09'}))""");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
      await pg.evaluate("document.getElementById('bagbtn').click()");await pg.wait_for_timeout(800)
      await pg.evaluate("window.__simStep&&window.__simStep('pag')");await pg.wait_for_timeout(900)
      await pg.screenshot(path=f'pag_hoje_{W}.png',full_page=True)
      print(W,await pg.evaluate("document.querySelector('.cartp')&&document.querySelector('.cartp').innerText.slice(0,800)"))
      await pg.close()
    await b.close()
asyncio.run(m())

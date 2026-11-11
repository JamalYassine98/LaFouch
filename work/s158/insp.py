import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900})
    await pg.add_init_script("window.setInterval=(f,t)=>0")
    await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_cart',JSON.stringify({c:{SL2210:1,SL2250:1},o:{}}))");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
    await pg.click('#bagbtn');await pg.wait_for_timeout(900);await pg.screenshot(path='cart.png')
    print(await pg.evaluate("document.querySelector('.cartp').innerHTML.slice(0,3500)"))
    await b.close()
asyncio.run(m())

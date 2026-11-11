import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
    await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2500)
    print(await pg.evaluate("""(()=>{const e=document.querySelector('.hnews.hn2');e.style.setProperty('background','radial-gradient(circle,red,blue)','important');window.__e=e;return getComputedStyle(e).backgroundImage})()"""))
    await pg.wait_for_timeout(800)
    print(await pg.evaluate("""[window.__e.isConnected,getComputedStyle(document.querySelector('.hnews.hn2')).backgroundImage, getComputedStyle(document.querySelector('.hnews.hn2'),'::before').backgroundImage]"""))
    await b.close()
asyncio.run(m())

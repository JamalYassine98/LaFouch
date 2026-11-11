import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900})
    await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
    print(await pg.evaluate("""[...document.querySelectorAll('#hdst a,#hdst button,.hnews .nwb')].filter(e=>e.offsetWidth>60).map(e=>{const c=getComputedStyle(e);return [e.textContent.trim().slice(0,20),e.className,c.height,c.borderRadius,c.backgroundColor,c.color,c.fontSize,c.fontWeight,c.padding,c.border]})"""))
    await b.close()
asyncio.run(m())

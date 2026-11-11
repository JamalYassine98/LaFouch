import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900})
    await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
    print(await pg.evaluate("""[...document.querySelectorAll('.top .bar > *')].map(e=>[e.tagName,e.id,e.className,(e.getAttribute('aria-label')||e.textContent).trim().slice(0,30),getComputedStyle(e).display,Math.round(e.getBoundingClientRect().width)])"""))
    await b.close()
asyncio.run(m())

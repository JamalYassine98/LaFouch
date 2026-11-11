import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900})
    await pg.goto('http://localhost:8150/');await pg.wait_for_timeout(2000)
    print(await pg.evaluate("""[...document.querySelectorAll('.top .bar > *')].filter(e=>e.offsetWidth).map(e=>{const c=getComputedStyle(e);return [e.id||e.className,c.position,c.order,Math.round(e.getBoundingClientRect().left)]})"""))
    print(await pg.evaluate("(()=>{const g=document.querySelector('.hcom .gi.mo');return g?[g.innerHTML.length,typeof MOCHI_SVG]:'sem'})()"))
    await b.close()
asyncio.run(m())

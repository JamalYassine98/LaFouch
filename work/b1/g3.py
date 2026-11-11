import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    await pg.goto('http://localhost:8150/');await pg.wait_for_timeout(2500)
    print(await pg.evaluate("(()=>{const g=document.querySelector('[data-mochi]');return g?[g.innerHTML.length,g.getBoundingClientRect().height,(g.querySelector('svg')||{}).outerHTML&&g.querySelector('svg').getBoundingClientRect().height]:'sem'})()"))
    print(errs[:5])
    await b.close()
asyncio.run(m())

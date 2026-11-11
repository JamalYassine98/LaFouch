import asyncio,sys
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1000,'height':400},device_scale_factor=2)
    pg.on('console',lambda m:print(m.text)); pg.on('pageerror',lambda e:print('ERR',e))
    await pg.goto('file:///home/claude/lafouch/work/s135/p.html');await pg.wait_for_timeout(800)
    await pg.screenshot(path='S135.png',full_page=True);await b.close()
asyncio.run(m())

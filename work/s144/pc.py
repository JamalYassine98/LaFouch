import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for W,H in [(1440,900),(2560,1440)]:
      pg=await b.new_page(viewport={'width':W,'height':H})
      await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2500)
      await pg.screenshot(path=f'/home/claude/lafouch/work/s144/inicio_{W}.png',full_page=True)
      await pg.close()
    await b.close()
asyncio.run(m())

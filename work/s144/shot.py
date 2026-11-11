import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for W,H in [(1440,900),(2560,1440)]:
      for mod in (0,1):
        pg=await b.new_page(viewport={'width':W,'height':H})
        await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2200)
        if mod:
          await pg.add_script_tag(path='/home/claude/lafouch/work/s144/s144.js');await pg.evaluate("window.__s44()");await pg.wait_for_timeout(800)
        await pg.screenshot(path=f'/home/claude/lafouch/work/s144/{"novo" if mod else "hoje"}_{W}.png')
        for y in range(0,9000,500):
          await pg.evaluate(f"window.scrollTo(0,{y})");await pg.wait_for_timeout(150)
        await pg.evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');window.scrollTo(0,0)");await pg.wait_for_timeout(1200)
        await pg.screenshot(path=f'/home/claude/lafouch/work/s144/{"novo" if mod else "hoje"}_{W}_full.png',full_page=True)
        await pg.close()
    await b.close()
asyncio.run(m())

import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    for n in ['a','b']:
      await pg.goto(f'file:///home/claude/lafouch/work/s134/{n}.html')
      await pg.add_style_tag(content='html,body,#wrap,#main{height:auto!important;overflow:visible!important}.bn{position:static!important}.page{padding-bottom:16px!important}')
      await pg.screenshot(path=f'{n}.png',full_page=True)
    await b.close()
asyncio.run(m())

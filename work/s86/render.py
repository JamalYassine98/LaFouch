import sys,os,asyncio
from playwright.async_api import async_playwright
html,out,fps=sys.argv[1],sys.argv[2],30
async def main():
  os.makedirs(out,exist_ok=True)
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':600,'height':520},device_scale_factor=2)
    await pg.goto('file://'+os.path.abspath(html)); dur=await pg.evaluate('DUR'); n=int(dur*fps)
    for i in range(n+1):
      await pg.evaluate(f'R({i/fps})'); await pg.screenshot(path=f'{out}/f{i:04d}.png')
    await b.close(); print(n+1,'quadros')
asyncio.run(main())

import asyncio,json
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page()
    await pg.goto('file:///home/claude/lafouch/work/s136/p.html');await pg.wait_for_timeout(800)
    d=await pg.evaluate("JSON.stringify({maes:TEMA_M.maesE,pais:TEMA_M.paisH90})")
    open('mp.json','w').write(d);j=json.loads(d);print({k:{x:len(v[x]) for x in v} for k,v in j.items()})
    await b.close()
asyncio.run(m())

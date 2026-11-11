import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
    await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
    await pg.click('#sbtn');await pg.wait_for_timeout(800)
    print(await pg.evaluate("""(()=>{const e=document.activeElement;let p=e,o=[];for(let i=0;i<6&&p;i++){o.push(p.tagName+'#'+p.id+'.'+p.className);p=p.parentElement}return o})()"""))
    await pg.screenshot(path='/home/claude/lafouch/work/s144/sr_hoje.png')
    await b.close()
asyncio.run(m())

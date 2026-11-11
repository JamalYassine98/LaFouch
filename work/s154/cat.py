import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
    await pg.add_init_script("window.setInterval=(f,t)=>0")
    await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_fav','{\"SL2210\":1}')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
    await pg.evaluate("document.querySelector('#home .hcat a,#home .hcat button').click()");await pg.wait_for_timeout(1500)
    await pg.screenshot(path='cat_hoje_390.png')
    print(await pg.evaluate("""(()=>{const e=document.elementFromPoint(300,110);let r=e;for(let i=0;i<4;i++)r=r.parentElement;return r.outerHTML.slice(0,2200)})()"""))
    await b.close()
asyncio.run(m())

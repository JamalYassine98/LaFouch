import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
    await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_fav','{\"SL2220\":1}')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
    await pg.click('#bagbtn');await pg.wait_for_timeout(900)
    await pg.screenshot(path='bag_hoje.png')
    print(await pg.evaluate("""(()=>{const e=[...document.querySelectorAll('aside,[role=dialog],.drw,#cart,#bag')].filter(x=>x.offsetWidth>0);return e.map(x=>x.tagName+'#'+x.id+'.'+x.className+' '+x.innerHTML.slice(0,900))})()"""))
    await b.close()
asyncio.run(m())

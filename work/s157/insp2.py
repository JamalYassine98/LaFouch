import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900})
    await pg.add_init_script("window.setInterval=(f,t)=>0")
    await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
    await pg.evaluate("document.querySelector('#home .hcat a,#home .hcat button').click()");await pg.wait_for_timeout(1300)
    await pg.click('#fbtn');await pg.wait_for_timeout(700)
    print(await pg.evaluate("document.getElementById('fsh').outerHTML.slice(0,300)"))
    print(await pg.evaluate("[...document.getElementById('fsh').children].map(e=>e.className+' '+JSON.stringify(e.getBoundingClientRect()))"))
    print(await pg.evaluate("[...document.getElementById('drw').children].map(e=>e.tagName+'.'+e.className)"))
    await b.close()
asyncio.run(m())

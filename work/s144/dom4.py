import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900})
    await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
    await pg.add_script_tag(path='s144.js');await pg.evaluate("window.__s44()")
    print(await pg.evaluate("""(()=>{const h=document.getElementById('home'),c=getComputedStyle(h);const k=h.firstElementChild,kc=getComputedStyle(k);const lg=document.querySelector('.top .logo'),lc=getComputedStyle(lg);const s=getComputedStyle(document.querySelector('.top .search'));
    return [h.getBoundingClientRect().width,c.width,c.maxWidth,c.zoom,k.getBoundingClientRect().width,kc.maxWidth,lc.position,lc.left,s.display,document.documentElement.style.zoom]})()"""))
    await b.close()
asyncio.run(m())

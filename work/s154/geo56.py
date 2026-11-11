import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
    await pg.add_init_script("window.setInterval=(f,t)=>0")
    await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
    await pg.evaluate("document.querySelector('#home .hcat a,#home .hcat button').click()");await pg.wait_for_timeout(1500)
    await pg.add_script_tag(path='s156.js');await pg.evaluate("window.__s54('')")
    print(await pg.evaluate("""(()=>{const r=s=>{const e=document.querySelector(s);if(!e)return s+':-';const b=e.getBoundingClientRect();return s+': x'+Math.round(b.left)+' r'+Math.round(b.right)+' top'+Math.round(b.top)+' cy'+Math.round(b.top+b.height/2)};return [r('#vscr .vback'),r('#vtitT'),r('.s54 a'),r('.s54'),r('.s54 button'),r('#grid > *')]})()"""))
    await b.close()
asyncio.run(m())

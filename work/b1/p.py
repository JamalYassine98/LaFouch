import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
    await pg.goto('http://localhost:8150/');await pg.evaluate("localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_fav','{\"SL2250\":1}')");await pg.goto('http://localhost:8150/');await pg.wait_for_timeout(1800)
    await pg.evaluate("document.querySelector('#home .hg [data-open]').click()");await pg.wait_for_timeout(1300)
    print(await pg.evaluate("""(()=>{const e=[...document.querySelectorAll('#layer *')].find(x=>x.children.length<5&&/^SL\\d+/.test(x.textContent.trim())&&x.getBoundingClientRect().height<40&&x.getBoundingClientRect().top>300);return e?e.outerHTML.slice(0,600)+' | parent: '+e.parentElement.className:'-'})()"""))
    print(await pg.evaluate("document.querySelector('#layer .dfav').outerHTML.slice(0,400)"))
    print(await pg.evaluate("document.querySelector('#layer .pbr')?document.querySelector('#layer .pbr').outerHTML.slice(0,300):'sem pbr'"))
    await b.close()
asyncio.run(m())

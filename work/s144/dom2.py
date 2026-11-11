import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900})
    await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
    r=await pg.evaluate("""(()=>{const g=[...document.querySelectorAll('#home .hgu')].map(x=>x.outerHTML.slice(0,700));const wa=document.querySelector('.wa');
    return {g,wa:wa&&(wa.className+' '+getComputedStyle(wa).right+' '+getComputedStyle(wa).bottom),nav:getComputedStyle(document.querySelector('.nav')).display,srch:getComputedStyle(document.querySelector('.search')).display,wrap:getComputedStyle(document.querySelector('.top .wrap')).maxWidth,hg:getComputedStyle(document.querySelector('#home .hg')).gridTemplateColumns}})()""")
    for k,v in r.items():print(k,v if k!='g' else '\n---\n'.join(v))
    await b.close()
asyncio.run(m())

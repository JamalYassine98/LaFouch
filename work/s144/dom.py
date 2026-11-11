import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900})
    await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
    print(await pg.evaluate("""(()=>{const out=[];const hd=document.elementFromPoint(720,20);let e=hd;while(e&&e!==document.body){out.push(e.tagName+'#'+e.id+'.'+[...e.classList].join('.'));e=e.parentElement}
    const home=document.getElementById('home');const kids=[...home.children].map(c=>c.tagName+'#'+c.id+'.'+[...c.classList].join('.')+' w'+Math.round(c.getBoundingClientRect().width)+' h'+Math.round(c.getBoundingClientRect().height));
    const top=document.querySelector('.top,header');return {hd:out,kids,top:top&&top.outerHTML.slice(0,1500)}})()"""))
    await b.close()
asyncio.run(m())

import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900})
    await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
    print(await pg.evaluate("""(()=>{let e=document.getElementById('home'),o=[];while(e){const c=getComputedStyle(e);o.push(e.tagName+'#'+e.id+'.'+[...e.classList].join('.')+' mw='+c.maxWidth+' w='+Math.round(e.getBoundingClientRect().width)+' pad='+c.paddingLeft);e=e.parentElement}
    let t=document.querySelector('.top .bar'),u=[];while(t){const c=getComputedStyle(t);u.push(t.className+' mw='+c.maxWidth+' w='+Math.round(t.getBoundingClientRect().width)+' disp='+c.display);t=t.parentElement}return o.concat(['--'],u)})()"""))
    await b.close()
asyncio.run(m())

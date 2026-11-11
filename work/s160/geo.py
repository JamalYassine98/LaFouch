import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
    await pg.add_init_script("window.setInterval=(f,t)=>0")
    await pg.goto('http://localhost:8143/');await pg.evaluate("""localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_cart',JSON.stringify({c:{SL2210:1},o:{}}));localStorage.setItem('lf_conta',JSON.stringify({nome:'M',email:'m@g.com',tel:'1',nac:'br',doc:'1'}))""");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
    await pg.evaluate("document.getElementById('bagbtn').click()");await pg.wait_for_timeout(800)
    await pg.evaluate("window.__simStep('ent')");await pg.wait_for_timeout(500)
    print(await pg.evaluate("(()=>{const b=document.querySelector('.cartp .cfo');const c=getComputedStyle(b);const s=getComputedStyle(b.querySelector('span'));return [c.display,c.gridTemplateColumns,c.columnGap,c.paddingLeft,s.position,s.left,s.width,s.marginRight,getComputedStyle(b.querySelector('b')).paddingLeft]})()"))
    await b.close()
asyncio.run(m())

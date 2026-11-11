import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900})
    await pg.add_init_script("window.setInterval=(f,t)=>0")
    await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
    async def info(n):
      print(n,await pg.evaluate("""[...document.querySelectorAll('body *')].filter(e=>{const c=getComputedStyle(e);return (c.position=='fixed')&&e.offsetWidth>200&&e.offsetHeight>150&&c.visibility!='hidden'&&c.display!='none'&&+c.opacity>0}).map(e=>{const r=e.getBoundingClientRect();return e.tagName+'#'+e.id+'.'+e.className.toString().slice(0,40)+' '+[r.left,r.top,r.width,r.height].map(Math.round)})"""))
    await pg.click('#mnb');await pg.wait_for_timeout(700);await info('menu');await pg.screenshot(path='menu_hoje.png');await pg.keyboard.press('Escape');await pg.wait_for_timeout(600)
    await pg.evaluate("document.querySelector('#home .hcat a,#home .hcat button').click()");await pg.wait_for_timeout(1300)
    await pg.click('#fbtn');await pg.wait_for_timeout(700);await info('filtro');await pg.screenshot(path='filtro_hoje.png');await pg.keyboard.press('Escape');await pg.wait_for_timeout(600)
    await pg.click('#bagbtn');await pg.wait_for_timeout(700);await info('cart');await pg.screenshot(path='cart_hoje.png')
    await b.close()
asyncio.run(m())

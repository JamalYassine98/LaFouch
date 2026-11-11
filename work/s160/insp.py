import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
    await pg.add_init_script("window.setInterval=(f,t)=>0")
    await pg.goto('http://localhost:8143/');await pg.evaluate("""localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_cart',JSON.stringify({c:{SL2210:1},o:{}}));localStorage.setItem('lf_conta',JSON.stringify({nome:'Mariana Souza',email:'mariana.souza@gmail.com',tel:'+55 45 99812-3344',nac:'br',doc:'123'}))""");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
    await pg.evaluate("document.getElementById('bagbtn').click()");await pg.wait_for_timeout(800)
    for s in ['ent','pag']:
      await pg.evaluate(f"window.__simStep('{s}')");await pg.wait_for_timeout(700)
      print(s,await pg.evaluate("document.querySelector('.cartp .cl').outerHTML.slice(0,1800)"))
    await b.close()
asyncio.run(m())

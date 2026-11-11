import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    async def pg0():
      pg=await b.new_page(viewport={'width':1440,'height':900})
      await pg.add_init_script("window.setInterval=(f,t)=>0")
      await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
      for f in ['s144/s144.js','s144/s146.js','s144/s148.js','s144/s149.js','s157/s157.js']:
        await pg.add_script_tag(path='/home/claude/lafouch/work/'+f)
      await pg.evaluate("window.__s44();window.__s45();window.__s47('A',0);window.__s49('D');document.querySelector('.h49 .mn span').remove()")
      return pg
    pg=await pg0()
    await pg.evaluate("document.querySelector('#home .hcat a,#home .hcat button').click()");await pg.wait_for_timeout(1300)
    await pg.add_script_tag(path='/home/claude/lafouch/work/s154/s156.js');await pg.evaluate("window.__s54('')")
    await pg.evaluate("document.getElementById('fbtn').click()");await pg.wait_for_timeout(800);await pg.evaluate("window.__s57x()")
    await pg.screenshot(path='S157_filtros.png');await pg.close()
    pg=await pg0()
    it=await pg.evaluate("(()=>{const im=document.querySelector('#home .hg img');return {img:im.getAttribute('src'),ref:'SL2210',nome:'Óculos de sol hexagonal',pr:'R$ 95'}})()")
    await pg.evaluate("i=>window.__s57cart(i)",it);await pg.wait_for_timeout(500);await pg.screenshot(path='S157_carrinho.png');await pg.close()
    pg=await pg0()
    await pg.evaluate("window.__s57lang()");await pg.wait_for_timeout(500);await pg.screenshot(path='S157_idioma.png');await pg.close()
    pg=await pg0()
    await pg.evaluate("document.getElementById('mnb').click()");await pg.wait_for_timeout(800);await pg.screenshot(path='S157_menu.png');await pg.close()
    await b.close()
asyncio.run(m())

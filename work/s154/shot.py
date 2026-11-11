import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for W,H in [(390,844),(1440,900)]:
      pg=await b.new_page(viewport={'width':W,'height':H})
      await pg.add_init_script("window.setInterval=(f,t)=>0")
      await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_fav','{\"SL2210\":1}')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
      if W>1000:
        for f in ['s144/s144.js','s144/s149.js']:
          await pg.add_script_tag(path='/home/claude/lafouch/work/'+f)
        await pg.evaluate("window.__s44();window.__s49('D');document.querySelector('.h49 .mn span').remove()")
      await pg.evaluate("document.querySelector('#home .hcat a,#home .hcat button').click()");await pg.wait_for_timeout(1500)
      await pg.screenshot(path=f'hoje_{W}.png')
      await pg.add_script_tag(path='/home/claude/lafouch/work/s154/s154.js')
      print(await pg.evaluate("window.__s54('', 'link')"))
      await pg.wait_for_timeout(300);await pg.screenshot(path=f'S154_{W}_todos.png')
      await pg.click('.s54 [data-g="f"]');await pg.wait_for_timeout(900)
      await pg.screenshot(path=f'S154_{W}_fem.png')
      await pg.close()
    await b.close()
asyncio.run(m())

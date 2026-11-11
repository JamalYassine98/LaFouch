import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for W,H in [(390,844),(1440,900)]:
      pg=await b.new_page(viewport={'width':W,'height':H})
      await pg.add_init_script("window.setInterval=(f,t)=>0")
      await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_fav','{\"SL2220\":1}')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
      if W>1000:
        for f in ['s144/s144.js','s144/s149.js']:
          await pg.add_script_tag(path='/home/claude/lafouch/work/'+f)
        await pg.evaluate("window.__s44();window.__s49('D');document.querySelector('.h49 .mn span').remove()")
      await pg.screenshot(path=f'_x.png')
      await pg.evaluate("document.querySelector('#home .hg [data-ref],#home .hg .c,#home .hg button,#home .hg a').click()");await pg.wait_for_timeout(1500)
      await pg.screenshot(path=f'hoje_{W}.png')
      await pg.add_script_tag(path='/home/claude/lafouch/work/s152/s152.js');await pg.evaluate("window.__s52(0)")
      if W>1000:
        await pg.evaluate("(()=>{const h=document.querySelector('.h49 .ic:last-child');const f=document.createElement('button');f.className='s52f';f.innerHTML=document.querySelector('.s52f').innerHTML;h.insertBefore(f,h.lastElementChild);document.querySelectorAll('.top .s52f').forEach(e=>e.remove())})()")
      await pg.evaluate("window.__s52(1)");await pg.evaluate("document.querySelectorAll('.top .s52f').length>1&&document.querySelector('.top .s52f').remove()")
      if W>1000: await pg.evaluate("document.querySelectorAll('.top .s52f').forEach(e=>e.remove())")
      await pg.wait_for_timeout(500)
      await pg.screenshot(path=f'S152_{W}.png')
      await pg.evaluate("document.querySelectorAll('.s52t').forEach(e=>e.remove());window.scrollTo(0,260)");await pg.wait_for_timeout(300)
      await pg.screenshot(path=f'S152_{W}_b.png')
      await pg.close()
    await b.close()
asyncio.run(m())

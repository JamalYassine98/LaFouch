import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for W,H in [(390,844),(1440,900)]:
      pg=await b.new_page(viewport={'width':W,'height':H})
      await pg.add_init_script("window.setInterval=(f,t)=>0")
      await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2200)
      if W>1000:
        for f,fn in [('s144.js','__s44'),('s146.js','__s45'),('s148.js',None),('s149.js',None)]:
          await pg.add_script_tag(path='/home/claude/lafouch/work/s144/'+f)
          if fn: await pg.evaluate(f"window.{fn}()")
        await pg.evaluate("window.__s47('A',0);window.__s49('D');document.querySelector('.h49 .mn span').remove();document.querySelectorAll('#hdst .p2').forEach(e=>{if(!/›/.test(e.textContent))e.textContent=e.textContent.trim()+' ›'})")
        await pg.screenshot(path='S151_topo_pc.png',clip={'x':0,'y':0,'width':1440,'height':300})
        await pg.evaluate("document.getElementById('sbtn').click()")
      else:
        await pg.click('#sbtn')
      await pg.wait_for_timeout(700)
      await pg.add_script_tag(path='/home/claude/lafouch/work/s144/s151.js');await pg.evaluate("window.__s51(1)");await pg.wait_for_timeout(400)
      await pg.screenshot(path=f'S151_busca_{W}.png')
      await pg.close()
    await b.close()
asyncio.run(m())

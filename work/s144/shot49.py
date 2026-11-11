import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    pg=await b.new_page(viewport={'width':1440,'height':900})
    await pg.add_init_script("window.setInterval=(f,t)=>0")
    await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2200)
    for f,fn in [('s144.js','__s44'),('s146.js','__s45'),('s148.js',None),('s149.js',None)]:
      await pg.add_script_tag(path='/home/claude/lafouch/work/s144/'+f)
      if fn: await pg.evaluate(f"window.{fn}()")
    await pg.evaluate("window.__s47('A',0);document.querySelectorAll('#hdst .p2').forEach(e=>{if(!/›/.test(e.textContent))e.textContent=e.textContent.trim()+' ›'})")
    for o in 'AB':
      await pg.evaluate(f"window.__s49('{o}');window.scrollTo(0,0)");await pg.wait_for_timeout(500)
      await pg.screenshot(path=f'h{o}.png',clip={'x':0,'y':0,'width':1440,'height':560})
    await pg.evaluate("window.__s49('C');window.scrollTo(0,1150)");await pg.wait_for_timeout(700)
    await pg.screenshot(path='hC.png',clip={'x':0,'y':0,'width':1440,'height':560})
    await b.close()
asyncio.run(m())

import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    pg=await b.new_page(viewport={'width':1440,'height':900})
    await pg.add_init_script("window.setInterval=(f,t)=>0");await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2200)
    for f,fn in [('s144.js','__s44'),('s146.js','__s45'),('s148.js',None)]:
      await pg.add_script_tag(path='/home/claude/lafouch/work/s144/'+f)
      if fn: await pg.evaluate(f"window.{fn}()")
    await pg.evaluate("document.querySelectorAll('#hdst .sli,#hdst [class*=dot]').forEach(()=>{})")
    for o in 'ADEFG':
      for hv in (0,1):
        await pg.evaluate(f"window.__s47('{o}',{hv})");await pg.evaluate("window.scrollTo(0,0)");await pg.wait_for_timeout(500)
        await pg.evaluate(f"(()=>{{document.querySelectorAll('#hdst .p2').forEach(e=>{{if(!/›/.test(e.textContent))e.textContent=e.textContent.trim()+' ›'}});window.__s47('{o}',{hv})}})()");await pg.wait_for_timeout(60)
        el=await pg.query_selector('#hdst .p1');bb=await el.bounding_box()
        await pg.screenshot(path=f'c{o}{hv}.png',clip={'x':bb['x']-30,'y':bb['y']-150,'width':520,'height':260})
    await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2200)
    for f,fn in [('s144.js','__s44'),('s146.js','__s45'),('s148.js',None)]:
      await pg.add_script_tag(path='/home/claude/lafouch/work/s144/'+f)
      if fn: await pg.evaluate(f"window.{fn}()")
    await pg.evaluate("window.__s47('A',0)");await pg.evaluate("document.querySelector('.s44a').scrollIntoView({block:'center'})");await pg.wait_for_timeout(600)
    await pg.screenshot(path='ata48.png')
    await b.close()
asyncio.run(m())

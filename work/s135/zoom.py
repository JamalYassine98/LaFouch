import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1000,'height':400},device_scale_factor=2)
    pg.on('pageerror',lambda e:print('ERR',e))
    await pg.goto('file:///home/claude/lafouch/work/s135/p.html');await pg.wait_for_timeout(500)
    r=await pg.evaluate('''()=>{const e=document.querySelectorAll('.lfcL')[0];const s=e.ownerSVGElement,pt=s.createSVGPoint();let bad=0;for(let k=0;k<72;k++){const a=k/72*2*Math.PI;pt.x=45+7.2*Math.cos(a);pt.y=83+8.4*Math.sin(a);if(!e.isPointInFill(pt))bad++}return bad}''')
    print('fora:',r)
    await pg.screenshot(path='S135d.png',full_page=True)
    el=(await pg.query_selector_all('.c'))[2]
    await el.screenshot(path='m1.png');await b.close()
asyncio.run(m())

import asyncio
from playwright.async_api import async_playwright
V=[('A+ (antes) · 7%',7,72,0),('B · 4%',4,100,1),('C · 2,5%',2.5,100,1)]
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,locale='pt-BR')
    await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2500)
    ok=await pg.evaluate("!!document.querySelector('.hnews.hn2')");print('faixa',ok)
    for i,(n,pc,fim,cs) in enumerate(V):
      await pg.evaluate("([pc,fim,cs])=>{const e=document.querySelector('.hnews.hn2');e.style.setProperty('background',cs?'radial-gradient(closest-side ellipse at 50% 50%,color-mix(in srgb,#a2447c '+pc+'%,transparent) 0%,transparent 100%)':'radial-gradient(120% 90% at 50% 50%,color-mix(in srgb,#a2447c '+pc+'%,#fbf7fa) 0%,#fbf7fa '+fim+'%)','important');e.scrollIntoView({block:'center'})}",[pc,fim,cs])
      await pg.wait_for_timeout(700)
      bb=await pg.evaluate("(()=>{const r=document.querySelector('.hnews.hn2').getBoundingClientRect();return [r.top,r.height]})()")
      t=max(0,bb[0]-120);await pg.screenshot(path=f'v{i}.png',clip={'x':0,'y':t,'width':390,'height':min(844-t,bb[1]+240)})
    await b.close()
asyncio.run(m())

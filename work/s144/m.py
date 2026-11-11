import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for W,H in [(1280,800),(1440,900),(1920,1080),(2560,1440)]:
      pg=await b.new_page(viewport={'width':W,'height':H})
      await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
      r=await pg.evaluate("""(()=>{const sw=document.documentElement.scrollWidth;let wide=[];document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>innerWidth+2&&r.width>0)wide.push((e.id||e.className||e.tagName).toString().slice(0,40)+':'+Math.round(r.right))});
      const h=document.querySelector('header,.top,#hd');const home=document.getElementById('home');
      return {sw,wide:wide.slice(0,6),home:home&&Math.round(home.getBoundingClientRect().width),hdr:h&&Math.round(h.getBoundingClientRect().width)}})()""")
      print(W,r);await pg.close()
    await b.close()
asyncio.run(m())

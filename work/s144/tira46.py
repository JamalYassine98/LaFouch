import asyncio,io
from PIL import Image
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for W,H in [(1440,900),(390,844)]:
      for mod in (1,):
        pg=await b.new_page(viewport={'width':W,'height':H})
        await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2200)
        await pg.evaluate("document.querySelectorAll('.hd .sli,.hd *').forEach(()=>{})")
        if mod:
          await pg.add_script_tag(path='/home/claude/lafouch/work/s144/s144.js');await pg.evaluate("window.__s44()");await pg.add_script_tag(path='/home/claude/lafouch/work/s144/s146.js');await pg.evaluate("window.__s45()");await pg.wait_for_timeout(600)
        total=await pg.evaluate("document.documentElement.scrollHeight");frames=[];y=0;i=0
        while True:
          await pg.evaluate(f"window.scrollTo(0,{y})");await pg.wait_for_timeout(900)
          sy=await pg.evaluate("scrollY")
          png=await pg.screenshot();im=Image.open(io.BytesIO(png))
          frames.append((sy,im)) if not (frames and frames[-1][0]==sy) else None
          if i==0: await pg.evaluate("document.querySelector('.top').style.visibility='hidden';var w=document.querySelector('.wa');if(w)w.style.visibility='hidden'")
          i+=1
          if sy+H>=total-2 or (len(frames)>1 and frames[-2][0]==sy) or i>14:break
          y+=H-0
        out=Image.new('RGB',(W,frames[-1][0]+H),'white')
        for sy,im in frames: out.paste(im,(0,sy))
        out.save(f's146_{W}.png');await pg.close()
    await b.close()
asyncio.run(m())

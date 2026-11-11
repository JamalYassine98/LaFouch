import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for W,H in [(390,844),(1440,900)]:
      pg=await b.new_page(viewport={'width':W,'height':H})
      await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
      await pg.evaluate("document.querySelector('#home .hg [data-ref],#home .hg .c,#home .hg button,#home .hg a').click()");await pg.wait_for_timeout(1500)
      await pg.screenshot(path=f'/home/claude/lafouch/work/s152/peca_{W}.png')
      print(W,await pg.evaluate("""[...document.querySelectorAll('button,a')].filter(e=>{const r=e.getBoundingClientRect();return r.top<200&&r.bottom>0&&r.width>0&&getComputedStyle(e).visibility!='hidden'}).map(e=>[(e.getAttribute('aria-label')||e.textContent).trim().slice(0,25),e.id,e.className.toString().slice(0,30),Math.round(e.getBoundingClientRect().top),Math.round(e.getBoundingClientRect().left)])"""))
      await pg.close()
    await b.close()
asyncio.run(m())

import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for tema in ['maes','pais']:
      pg=await b.new_page(viewport={'width':390,'height':844});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:8150/');await pg.evaluate(f"localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_cfg',JSON.stringify({{evento:{{tema:'{tema}'}}}}))");await pg.goto('http://localhost:8150/');await pg.wait_for_timeout(2500)
      print(tema,await pg.evaluate("document.documentElement.getAttribute('data-ev')"),await pg.evaluate("(document.getElementById('evbar')||{}).textContent"))
      await pg.evaluate("document.querySelector('[data-mochi]').scrollIntoView({block:'center'})");await pg.wait_for_timeout(500)
      el=await pg.query_selector('[data-mochi]');await el.screenshot(path=f'mochi_{tema}.png')
      await pg.evaluate("document.querySelector('[data-gzopen]').click()");await pg.wait_for_timeout(3500);await pg.screenshot(path=f'gz_{tema}.png')
      print('erros',errs);await pg.close()
    await b.close()
asyncio.run(m())

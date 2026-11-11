import asyncio,urllib.parse
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for W,H,lg in [(390,844,'pt'),(1440,900,'es')]:
      pg=await b.new_page(viewport={'width':W,'height':H});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:8150/');await pg.evaluate(f"localStorage.setItem('lf_lang','{lg}')");await pg.goto('http://localhost:8150/');await pg.wait_for_timeout(2000)
      await pg.evaluate("document.querySelector('.hata [data-gpan=atacado]').click()");await pg.wait_for_timeout(1200)
      await pg.fill('#aq','50 peças');await pg.evaluate("document.querySelector('[data-atp=Solar]').click();document.querySelector('[data-atp=\"Armações\"]').click()");await pg.wait_for_timeout(300)
      await pg.screenshot(path=f'ata_{W}.png')
      h=await pg.evaluate("document.getElementById('lojista').href");print(W,urllib.parse.unquote(h.split('text=')[1]))
      print('erros',errs);await pg.close()
    await b.close()
asyncio.run(m())

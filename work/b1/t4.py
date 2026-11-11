import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for W,H in [(390,844),(1440,900)]:
      pg=await b.new_page(viewport={'width':W,'height':H});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:8150/');await pg.evaluate("localStorage.setItem('lf_lang','pt')");await pg.goto('http://localhost:8150/');await pg.wait_for_timeout(1800)
      await pg.evaluate("document.querySelector('#home .hcat a,#home .hcat button').click()");await pg.wait_for_timeout(1300)
      n0=await pg.evaluate("document.querySelectorAll('#grid .card').length")
      await pg.evaluate("document.querySelector('#lfgen [data-gen=f]').click()");await pg.wait_for_timeout(800)
      n1=await pg.evaluate("document.querySelectorAll('#grid .card').length")
      await pg.screenshot(path=f'cat_{W}.png')
      print(W,n0,'->',n1,await pg.evaluate("document.querySelector('#lfgen .on').textContent"))
      await pg.evaluate("document.querySelector('[data-lffil]').click()");await pg.wait_for_timeout(800)
      print(W,'filtro aberto',await pg.evaluate("document.getElementById('fsh')&&document.getElementById('fsh').classList.contains('on')"))
      print(await pg.evaluate("""(()=>{const a=[...document.querySelectorAll('#lfgen button, #lfgen a')].map(e=>{const r=e.getBoundingClientRect();return Math.round(r.top+r.height/2)});return a})()"""))
      print('erros',errs);await pg.close()
    await b.close()
asyncio.run(m())

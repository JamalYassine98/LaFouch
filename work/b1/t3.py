import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for W,H in [(390,844),(1440,900)]:
      pg=await b.new_page(viewport={'width':W,'height':H});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:8150/');await pg.evaluate("localStorage.setItem('lf_lang','pt');localStorage.removeItem('lf_fav');localStorage.setItem('lf_cart',JSON.stringify({c:{SL2250:1},o:{}}))");await pg.goto('http://localhost:8150/');await pg.wait_for_timeout(1800)
      await pg.mouse.click(3,500)
      await pg.evaluate("document.querySelector('#home .hg [data-open]').click()");await pg.wait_for_timeout(1300)
      await pg.evaluate("document.querySelector('#layer .dfav').click()");await pg.wait_for_timeout(500)
      await pg.screenshot(path=f'peca_{W}.png')
      print(W,'toast',await pg.evaluate("[...document.querySelectorAll('.toast')].map(t=>t.innerText)"))
      print(W,'pbr',await pg.evaluate("!!document.querySelector('#layer .pbr')"),'pgacts visivel',await pg.evaluate("[...document.querySelectorAll('.pgacts,#ftogp')].some(e=>e.offsetWidth>0)"))
      await pg.evaluate("[...document.querySelectorAll('.toast button[data-bag]')].pop().click()");await pg.wait_for_timeout(1000)
      await pg.screenshot(path=f'favs_{W}.png')
      await pg.evaluate("document.querySelector('[data-favcart]').click()");await pg.wait_for_timeout(900)
      await pg.screenshot(path=f'cart2_{W}.png')
      print(W,'no carrinho',await pg.evaluate("Object.keys(JSON.parse(localStorage.getItem('lf_cart')).c)"))
      # trilha
      await pg.evaluate("document.querySelector('#layer [data-close],#layer .x').click()");await pg.wait_for_timeout(600)
      await pg.evaluate("document.querySelector('#home .hg [data-open]').click()");await pg.wait_for_timeout(1300)
      await pg.evaluate("document.querySelector('[data-crumb]:not([data-crumb=todos])').click()");await pg.wait_for_timeout(1300)
      print(W,'trilha ->',await pg.evaluate("(document.getElementById('vtitT')||{}).textContent"),await pg.evaluate("document.querySelectorAll('#grid .card').length"))
      print('erros',errs);await pg.close()
    await b.close()
asyncio.run(m())

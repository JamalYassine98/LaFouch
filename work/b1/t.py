import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for W,H,lg in [(390,844,'pt'),(1440,900,'es')]:
      pg=await b.new_page(viewport={'width':W,'height':H})
      errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:8150/');await pg.evaluate(f"""localStorage.setItem('lf_lang','{lg}');localStorage.setItem('lf_cart',JSON.stringify({{c:{{SL2210:1,SL2250:1}},o:{{}}}}));localStorage.setItem('lf_conta',JSON.stringify({{nome:'Mariana Souza',email:'mariana.souza@gmail.com',tel:'+55 45 99812-3344',nac:'br',doc:'123'}}))""");await pg.goto('http://localhost:8150/');await pg.wait_for_timeout(2000)
      await pg.evaluate("document.getElementById('bagbtn').click()");await pg.wait_for_timeout(900)
      await pg.screenshot(path=f'cart_{W}.png')
      await pg.evaluate("document.querySelector('#layer .cartp .crl[data-rm=\"SL2250\"]').click()");await pg.wait_for_timeout(900)
      n=await pg.evaluate("document.querySelectorAll('#layer .cartp .ci').length");print(W,'itens depois de remover',n)
      await pg.evaluate("window.__simStep('ent')");await pg.wait_for_timeout(700);await pg.screenshot(path=f'ent_{W}.png')
      await pg.evaluate("window.__simStep('pag')");await pg.wait_for_timeout(700);await pg.screenshot(path=f'pag_{W}.png')
      print(W,await pg.evaluate("document.querySelector('#layer .cartp .cl').innerText.slice(0,400)"))
      await pg.evaluate("document.querySelector('[data-v=pix]').click()");await pg.wait_for_timeout(400)
      await pg.evaluate("document.querySelector('[data-send]')&&document.querySelector('[data-send]').click()");await pg.wait_for_timeout(14000)
      await pg.screenshot(path=f'erro_{W}.png')
      print(W,'erro tela:',await pg.evaluate("(document.getElementById('pkok')||{}).innerText||'-'"))
      print('erros js',errs)
      await pg.close()
    await b.close()
asyncio.run(m())

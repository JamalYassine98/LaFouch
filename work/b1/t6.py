import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for W,H in [(390,844),(1440,900)]:
      pg=await b.new_page(viewport={'width':W,'height':H});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.add_init_script("window.setInterval=(f,t)=>0")
      await pg.goto('http://localhost:8150/');await pg.evaluate("localStorage.setItem('lf_lang','pt')");await pg.goto('http://localhost:8150/');await pg.wait_for_timeout(2000)
      await pg.evaluate("document.getElementById('mnb').click()");await pg.wait_for_timeout(700)
      await pg.screenshot(path=f'menu_{W}.png')
      print(W,'menu ajuda:',await pg.evaluate("[...document.querySelectorAll('#drw [data-ajp]')].map(a=>a.textContent)"))
      await pg.evaluate("document.querySelector('#drw [data-ajp=comprar]').click()");await pg.wait_for_timeout(1200)
      await pg.screenshot(path=f'comprar_{W}.png');print(W,'drawer aberto?',await pg.evaluate("document.getElementById('drw').classList.contains('on')"))
      await pg.go_back();await pg.wait_for_timeout(800);print(W,'voltar ->',await pg.evaluate("(document.querySelector('#como .ajw')||{}).getAttribute&&document.querySelector('#como .ajw').getAttribute('data-ajpg')"),await pg.evaluate("document.getElementById('como').classList.contains('pop')"))
      await pg.screenshot(path=f'ajuda_{W}.png')
      for pgn in ['duvidas','dicas']:
        await pg.evaluate(f"document.querySelector('#como [data-ajp={pgn}]').click()");await pg.wait_for_timeout(900);await pg.screenshot(path=f'{pgn}_{W}.png')
        if pgn=='duvidas': await pg.go_back();await pg.wait_for_timeout(700)
      await pg.evaluate("document.querySelector('#como [data-ajp=\"art-tipos\"]').click()");await pg.wait_for_timeout(900);await pg.screenshot(path=f'tipos_{W}.png',full_page=True)
      await pg.go_back();await pg.wait_for_timeout(600)
      await pg.evaluate("document.querySelector('#como [data-ajp=\"art-limpar\"]').click()");await pg.wait_for_timeout(900);await pg.screenshot(path=f'limpar_{W}.png',full_page=True)
      await pg.evaluate("document.querySelector('#como .ajvc').click()");await pg.wait_for_timeout(1200);print(W,'leitura e armações:',await pg.evaluate("(document.getElementById('vtitT')||{}).textContent"),await pg.evaluate("document.querySelectorAll('#grid .card').length"))
      await pg.go_back();await pg.wait_for_timeout(800)
      await pg.goto('http://localhost:8150/');await pg.wait_for_timeout(1800)
      await pg.evaluate("document.querySelector('.lfft [data-ajp=contato]').click()");await pg.wait_for_timeout(1000);await pg.screenshot(path=f'contato_{W}.png')
      await pg.evaluate("document.getElementById('ctok').click()");await pg.wait_for_timeout(300);print(W,'erro form:',await pg.evaluate("document.getElementById('cterr').textContent"))
      await pg.fill('#ctn','Ana Souza');await pg.fill('#cte','ana@gmail.com');await pg.fill('#ctt','+55 45 99812 3344');await pg.fill('#ctm','Quero saber de um modelo')
      await pg.evaluate("document.getElementById('ctok').click()");await pg.wait_for_timeout(11500);print(W,'envio (sem servidor no simulador):',await pg.evaluate("document.getElementById('cterr').textContent"))
      print(W,'rodape ajuda:',await pg.evaluate("[...document.querySelectorAll('.lfft [data-ajp]')].map(a=>a.textContent)"),'contato col:',await pg.evaluate("/Contato/.test(document.querySelector('.lfft').innerText)"))
      print('erros',errs);await pg.close()
    await b.close()
asyncio.run(m())

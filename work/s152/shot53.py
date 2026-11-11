import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for W,H in [(390,844),(1440,900)]:
      pg=await b.new_page(viewport={'width':W,'height':H})
      await pg.add_init_script("window.setInterval=(f,t)=>0")
      await pg.goto('http://localhost:8143/');await pg.evaluate("localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_fav','{\"SL2210\":1}')");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(2000)
      if W>1000:
        for f in ['s144/s144.js','s144/s149.js']:
          await pg.add_script_tag(path='/home/claude/lafouch/work/'+f)
        await pg.evaluate("window.__s44();window.__s49('D');document.querySelector('.h49 .mn span').remove()")
      it=await pg.evaluate("""(()=>{const c=document.querySelector('#home .hg .c,#home .hg [data-ref]')||document.querySelector('#home .hg > *');const im=c.querySelector('img');return {img:im?im.getAttribute('src'):'',ref:'SL2210',nome:'Óculos de sol hexagonal',pr:(document.documentElement.innerText.match(/R\\$ ?95/)||['R$ 95'])[0]}})()""")
      await pg.evaluate("document.querySelector('#home .hg [data-ref],#home .hg .c,#home .hg button,#home .hg a').click()");await pg.wait_for_timeout(1500)
      for f in ['s152/s152.js','s152/s153.js']:
        await pg.add_script_tag(path='/home/claude/lafouch/work/'+f)
      await pg.evaluate("window.__s52(1);document.querySelectorAll('.s52f').forEach(e=>e.remove());document.querySelector('.s52t').innerHTML='Salvo nos favoritos <a href=\"#\">Ver no carrinho ›</a>'")
      print(await pg.evaluate(f"window.__s53peca({1 if W>1000 else 0})"));await pg.wait_for_timeout(400)
      await pg.screenshot(path=f'S153_peca_{W}.png')
      await pg.evaluate("document.getElementById('bagbtn').click()");await pg.wait_for_timeout(900)
      await pg.evaluate("i=>window.__s53cart(i)",it);await pg.wait_for_timeout(400)
      await pg.screenshot(path=f'S153_fav_{W}.png')
      await pg.close()
    await b.close()
asyncio.run(m())

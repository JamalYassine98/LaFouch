import asyncio
from playwright.async_api import async_playwright
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
    await pg.goto('http://localhost:8150/');await pg.evaluate("""localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_cart',JSON.stringify({c:{SL2210:1},o:{}}));localStorage.setItem('lf_conta',JSON.stringify({nome:'M S',email:'m@g.com',tel:'1',nac:'br',doc:'1'}))""");await pg.goto('http://localhost:8150/');await pg.wait_for_timeout(1800)
    await pg.evaluate("document.getElementById('bagbtn').click()");await pg.wait_for_timeout(700);await pg.evaluate("window.__simStep('ent')");await pg.wait_for_timeout(500)
    print(await pg.evaluate("""(()=>{const b=document.querySelector('.cartp .cfo');const r=[...document.styleSheets].flatMap(s=>{try{return [...s.cssRules]}catch(e){return []}}).filter(r=>r.selectorText&&b.matches(r.selectorText)&&/grid-template-columns/.test(r.cssText)).map(r=>r.selectorText+' => '+r.style.gridTemplateColumns);
    const x=document.querySelector('.cartp .cph .cfx');const cx=getComputedStyle(x);return {cols:getComputedStyle(b).gridTemplateColumns,rules:r,focus:document.activeElement===x,fv:x.matches(':focus-visible'),border:cx.border,outline:cx.outline}})()"""))
    await b.close()
asyncio.run(m())

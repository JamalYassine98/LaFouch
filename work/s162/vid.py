import asyncio
from playwright.async_api import async_playwright
async def run(b,W,H,nome):
    ctx=await b.new_context(viewport={'width':W,'height':H},record_video_dir='v_'+nome,record_video_size={'width':W,'height':H})
    pg=await ctx.new_page()
    await pg.add_init_script("window.setInterval=(f,t)=>0")
    await pg.goto('http://localhost:8143/');await pg.evaluate("""localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_cart',JSON.stringify({c:{SL2210:1},o:{}}));localStorage.setItem('lf_conta',JSON.stringify({nome:'Mariana Souza',email:'mariana.souza@gmail.com',tel:'+55 45 99812-3344',nac:'br',doc:'123'}))""");await pg.goto('http://localhost:8143/');await pg.wait_for_timeout(1500)
    fs=['s159/s159.js','s160/s161.js']
    if W>1000: fs=['s144/s144.js','s144/s149.js']+fs
    for f in fs: await pg.add_script_tag(path='/home/claude/lafouch/work/'+f)
    if W>1000: await pg.evaluate("window.__s44();window.__s49('D');document.querySelector('.h49 .mn span').remove()")
    await pg.evaluate("document.getElementById('bagbtn').click()");await pg.wait_for_timeout(900)
    await pg.add_script_tag(path='/home/claude/lafouch/work/s162/s162.js');await pg.wait_for_timeout(300)
    async def clica(sel):
      e=await pg.query_selector(sel);bb=await e.bounding_box();await pg.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2,steps=15);await pg.wait_for_timeout(250);await pg.mouse.click(bb['x']+bb['width']/2,bb['y']+bb['height']/2)
    await pg.wait_for_timeout(800)
    await pg.evaluate("window.__simStep('ent')");await pg.wait_for_timeout(1600)
    await clica('.cartp [data-cta="irpag"]');await pg.wait_for_timeout(400)
    if not await pg.evaluate("/Forma de pagamento/.test(document.querySelector('.cartp .cl').textContent)"):
      await pg.evaluate("window.__simStep('pag')")
    await pg.wait_for_timeout(1800)
    await pg.evaluate("window.__simStep('ent')");await pg.wait_for_timeout(1600)
    await pg.evaluate("window.__simStep('pag')");await pg.wait_for_timeout(1600)
    await ctx.close()
async def m():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    await run(b,390,844,'cel');await run(b,1440,900,'pc')
    await b.close()
asyncio.run(m())

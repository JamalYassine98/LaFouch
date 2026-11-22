import asyncio, subprocess, sys
sys.path.insert(0, 'work/kit'); import sim
from playwright.async_api import async_playwright
MAIS = """() => { const L = window.__LF, S = L.S; const base = S.items.filter(i => i.qty > 0 && !i.bulk)[0];
  for (let k = 0; k < 40; k++) S.items.push(Object.assign({}, base, { ref: 'ZX' + (100 + k), qty: 3 })); S.todos = true; L.setView('estoque'); }"""
async def main():
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8799', '-d', 'www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); await asyncio.sleep(1)
    try:
        async with async_playwright() as pw:
            b = await sim.navegador(pw)
            c = await sim.contexto(b, 1366, 900, toque=False, escuro=True, sem_trabalhador=True); pg = await c.new_page()
            await pg.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
            await pg.goto('http://localhost:8799/#test'); await pg.wait_for_function('() => window.__LF && window.__LF.S', timeout=20000)
            await pg.evaluate(MAIS); await pg.wait_for_timeout(600); await pg.evaluate("() => window.scrollTo(0, 1e6)"); await pg.wait_for_timeout(400)
            await pg.screenshot(path='work/s436/65b/pc_fim.png')
            await pg.click('#invFim [data-act=invParSob]'); await pg.wait_for_timeout(600); await pg.screenshot(path='work/s436/65b/pc_parsob.png')
            await c.close()
            c = await sim.contexto(b, 390, 844, toque=True, escuro=True, sem_trabalhador=True); pg = await c.new_page()
            await pg.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
            await pg.goto('http://localhost:8799/#test'); await pg.wait_for_function('() => window.__LF && window.__LF.S', timeout=20000)
            await pg.click('#mainnav .mn[data-id=estoque], #mainnav .mn:nth-child(3)'); await pg.wait_for_timeout(700)
            print(await pg.evaluate("() => [S0 = window.__LF.S.view, [...document.querySelectorAll('.nvLista')].map(l => l.getAttribute('data-cabe'))]"))
            await pg.screenshot(path='work/s436/65b/grp.png')
            await c.close(); await b.close()
    finally: srv.kill()
asyncio.run(main())

# 66 parte 2: Compras com estrela e fracasso; janela "No lugar de"
import asyncio, subprocess, sys
sys.path.insert(0, 'work/kit'); import sim
from playwright.async_api import async_playwright
D = 'work/s436/66b/'
async def main():
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8799', '-d', 'www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); await asyncio.sleep(1)
    try:
        async with async_playwright() as pw:
            b = await sim.navegador(pw)
            for esc in (True, False):
                nm = 'esc' if esc else 'cla'
                c = await sim.contexto(b, 390, 844, toque=True, escuro=esc, sem_trabalhador=True); pg = await c.new_page()
                pg.on('pageerror', lambda e: print('ERRO', e))
                await pg.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
                await pg.goto('http://localhost:8799/#test'); await pg.wait_for_function('() => window.__LF && window.__LF.S', timeout=20000)
                await pg.evaluate("() => window.__LF.inicioGo('comp')"); await pg.wait_for_timeout(800)
                await pg.screenshot(path=D + nm + '_compras.png')
                await pg.evaluate("() => { const v = window.__LF.cpVagas().find(v => v.cls === 'fracasso' && v.alts.length); document.querySelector('#v-comp .cpL[data-id=\"' + v.k + '\"]').click(); }"); await pg.wait_for_timeout(700)
                await pg.screenshot(path=D + nm + '_nolugar.png')
                await c.close()
            await b.close()
    finally: srv.kill()
asyncio.run(main())

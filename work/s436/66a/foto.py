# 66 parte 1: Peças com Compras, a tela Compras, a vaga, Fechei com, Ninguém tinha, Pedir, Fornecedores
import asyncio, subprocess, sys, json
sys.path.insert(0, 'work/kit'); import sim
from playwright.async_api import async_playwright
D = 'work/s436/66a/'
async def main():
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8799', '-d', 'www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); await asyncio.sleep(1)
    try:
        async with async_playwright() as pw:
            b = await sim.navegador(pw)
            for esc in (True, False):
                nm = 'esc' if esc else 'cla'
                c = await sim.contexto(b, 390, 844, toque=True, escuro=esc, sem_trabalhador=True); pg = await c.new_page()
                erros = []; pg.on('pageerror', lambda e: erros.append(str(e)))
                await pg.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
                await pg.goto('http://localhost:8799/#test'); await pg.wait_for_function('() => window.__LF && window.__LF.S', timeout=20000)
                await pg.evaluate("() => window.__LF.inicioGo('g:pecas')"); await pg.wait_for_timeout(700)
                await pg.screenshot(path=D + nm + '_pecas.png')
                await pg.click('#v-grp .nvL[data-id=comp]'); await pg.wait_for_timeout(800)
                print(nm, await pg.evaluate("() => document.getElementById('v-comp').innerText.slice(0, 600)"))
                await pg.screenshot(path=D + nm + '_compras.png', full_page=True)
                await pg.click('#v-comp .cpL'); await pg.wait_for_timeout(700)
                await pg.screenshot(path=D + nm + '_vaga.png')
                await pg.click('.cpJn [data-cp=fech]'); await pg.wait_for_timeout(700)
                await pg.fill('#cpCu', '3,80'); await pg.press('#cpCu', 'Tab'); await pg.wait_for_timeout(300)
                await pg.screenshot(path=D + nm + '_fechei.png')
                await pg.click('.cpJn [data-cp=salva]'); await pg.wait_for_timeout(700)
                await pg.evaluate("() => document.querySelectorAll('#v-comp .cpL')[1] && document.querySelectorAll('#v-comp .cpL')[1].click()"); await pg.wait_for_timeout(700)
                await pg.click('.cpJn [data-cp=nin]'); await pg.wait_for_timeout(700)
                await pg.screenshot(path=D + nm + '_ninguem.png')
                await pg.click('.cpJn [data-ok]'); await pg.wait_for_timeout(700)
                await pg.screenshot(path=D + nm + '_compras2.png', full_page=True)
                await pg.evaluate("() => { window.open = () => null; navigator.share = null; }")
                await pg.click('.cpPedir'); await pg.wait_for_timeout(700)
                await pg.screenshot(path=D + nm + '_pedir.png')
                await pg.keyboard.press('Escape'); await pg.wait_for_timeout(300)
                await pg.evaluate("() => document.querySelector('.ljBk') && document.querySelector('.ljBk').click()"); await pg.wait_for_timeout(500)
                await pg.click('#v-comp [data-act=cpForn]'); await pg.wait_for_timeout(800)
                await pg.screenshot(path=D + nm + '_forn.png')
                print('erros', erros)
                await c.close()
            await b.close()
    finally: srv.kill()
asyncio.run(main())

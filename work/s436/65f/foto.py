# 65f: Dashboard do mês › Detalhes com Desempenho do mês ⌄ e Curva ABC ⌄
import asyncio, subprocess, sys, json
sys.path.insert(0, 'work/kit'); import sim
from playwright.async_api import async_playwright
D = 'work/s436/65f/'
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
                await pg.evaluate("() => window.__LF.inicioGo('din')"); await pg.wait_for_timeout(300)
                await pg.evaluate("() => { const L = window.__LF; L.S.dTab = 'hoje'; L.setView('dash'); }"); await pg.wait_for_timeout(900)
                print(await pg.evaluate("() => [...document.querySelectorAll('#v-dash .esLs > .esLn')].map(b => b.innerText.replace(/\\s+/g,' '))"))
                await pg.evaluate("() => { window.__LF.ACT.d48Abre('des'); }"); await pg.wait_for_timeout(500)
                await pg.evaluate("() => { const e = document.querySelector('[data-act=d48Abre][data-id=des]'); e && window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 140); }"); await pg.wait_for_timeout(300)
                await pg.screenshot(path=D + nm + '_des.png')
                await pg.evaluate("() => { window.__LF.ACT.d48Abre('des'); window.__LF.ACT.d48Abre('abc'); }"); await pg.wait_for_timeout(500)
                await pg.evaluate("() => { const e = document.querySelector('[data-act=d48Abre][data-id=abc]'); e && window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 240); }"); await pg.wait_for_timeout(300)
                await pg.screenshot(path=D + nm + '_abc.png')
                print('erros', erros)
                await c.close()
            await b.close()
    finally: srv.kill()
asyncio.run(main())

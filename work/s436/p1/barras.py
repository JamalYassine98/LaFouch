# Parte 1 · 80 barras: Retirada, Câmbio (troca), Clientes (novo), Tema, Filtros (Ordem/Faixa), Impressora — celular escuro e claro
import asyncio, subprocess, sys
sys.path.insert(0, 'work/kit'); import sim
from playwright.async_api import async_playwright
D = 'work/s436/p1/'
async def corta(pg, sel, nome):
    r = await pg.evaluate("s => { const e = [...document.querySelectorAll(s)].find(e => e.getBoundingClientRect().width); if (!e) return null; e.scrollIntoView({block:'center'}); const r = e.getBoundingClientRect(); return [r.y, r.height]; }", sel)
    if not r: print('sem', sel); return
    await pg.wait_for_timeout(300)
    r = await pg.evaluate("s => { const e = [...document.querySelectorAll(s)].find(e => e.getBoundingClientRect().width); const r = e.getBoundingClientRect(); return [r.y, r.height]; }", sel)
    await pg.screenshot(path=D + nome + '.png', clip={'x': 0, 'y': max(0, r[0] - 60), 'width': 390, 'height': r[1] + 120})
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
                L = "window.__LF"
                await pg.evaluate("() => { const L = window.__LF; L.S.cxMenu = 'ret'; L.setView('caixa'); }"); await pg.wait_for_timeout(700)
                await pg.evaluate("() => { const b = [...document.querySelectorAll('#v-caixa button')].find(x => /Retirar|Retirada/.test(x.textContent)); b && b.click(); }"); await pg.wait_for_timeout(700)
                await corta(pg, '[aria-label="Moeda da retirada"]', nm + '_retirada')
                await pg.evaluate("() => window.__LF.setView('fx')"); await pg.wait_for_timeout(700)
                await pg.evaluate("() => { const b = [...document.querySelectorAll('#v-fx button')].find(x => /Registrar troca/.test(x.textContent)); b && b.click(); }"); await pg.wait_for_timeout(800)
                await corta(pg, '.tr418', nm + '_cambio')
                await pg.evaluate("() => window.__LF.setView('ajustes')"); await pg.wait_for_timeout(600)
                await pg.evaluate("() => { const b = document.querySelector('.ajS[data-k=\"tema\"] .ajR'); b && b.click(); }"); await pg.wait_for_timeout(700)
                await corta(pg, '.tmTrk', nm + '_tema')
                await pg.evaluate("() => { window.__LF.setView('estoque'); }"); await pg.wait_for_timeout(500)
                await pg.evaluate("() => document.getElementById('btnFilt').click()"); await pg.wait_for_timeout(700)
                await corta(pg, '#sortChips', nm + '_filtros')
                await pg.keyboard.press('Escape'); await pg.wait_for_timeout(300)
                await pg.evaluate("() => { window.__LF.setView('clientes'); }"); await pg.wait_for_timeout(500)
                await pg.evaluate("() => { const b = [...document.querySelectorAll('#v-clientes button')].find(x => /Novo|novo|Adicionar/.test(x.getAttribute('aria-label') || x.textContent)); b && b.click(); }"); await pg.wait_for_timeout(700)
                await corta(pg, '.cliNac', nm + '_cliente')
                await c.close()
            await b.close()
    finally: srv.kill()
asyncio.run(main())

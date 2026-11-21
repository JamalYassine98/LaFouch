# fotos depois do 37c: Cópias e nuvem (linhas .nvxL) e índice do grupo ("Gerenciar grupo ›"), claro e escuro
import asyncio, subprocess, sys
sys.path.insert(0, 'work/kit'); import sim
from playwright.async_api import async_playwright
async def main():
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8799', '-d', 'www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); await asyncio.sleep(1)
    try:
        async with async_playwright() as pw:
            b = await sim.navegador(pw)
            for esc in (True, False):
                n = 'escuro' if esc else 'claro'
                c = await sim.contexto(b, 390, 844, toque=True, escuro=esc, sem_trabalhador=True); pg = await c.new_page()
                await pg.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
                await pg.goto('http://localhost:8799/#test'); await pg.wait_for_timeout(1500)
                await pg.context.route(__import__('re').compile(r'googleapis'), lambda r: r.fulfill(json={}))
                await pg.evaluate("() => { const L = window.__LF, S = L.S; S.nuvem.rt = 'x'; S.nuvem.email = 'a@b.c'; S.nvLista = [{id: '2026-11-08', kb: 900}]; S.ajAberta = 'bk'; L.setView('ajustes'); S._ajForce = true; L.render(); }"); await pg.wait_for_timeout(600)
                r = await pg.evaluate("""async () => { const w = ms => new Promise(r => setTimeout(r, ms)); const e = document.querySelector('#v-ajustes .nvxL');
                  if (e) e.scrollIntoView({block: 'center'}); await w(300);
                  return [...document.querySelectorAll('#v-ajustes .nvxL')].map(x => [x.className, Math.round(x.getBoundingClientRect().height), getComputedStyle(x).color, x.textContent.trim().slice(0, 30)]); }""")
                print(n, r); await pg.screenshot(path='work/s436/37c/nuvem_%s.png' % n)
                await pg.evaluate("() => { window.__LF.setView('inicio'); }"); await pg.wait_for_timeout(400)
                await pg.locator('#mainnav .mn[data-id="g:pecas"]').click(); await pg.wait_for_timeout(700)
                print(await pg.evaluate("() => { const e = document.querySelector('#v-grp .nvGer'); return e && [e.className, getComputedStyle(e).color, getComputedStyle(e).fontSize]; }"))
                await pg.screenshot(path='work/s436/37c/grupo_%s.png' % n); await c.close()
            await b.close()
    finally: srv.kill()
asyncio.run(main())

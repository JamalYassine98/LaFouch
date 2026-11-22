# 65b/65c: páginas, fim da lista e Parados e sobrando — celular 390, escuro e claro
import asyncio, subprocess, sys, json
sys.path.insert(0, 'work/kit'); import sim
from playwright.async_api import async_playwright
D = 'work/s436/65b/'
MAIS = """() => { const L = window.__LF, S = L.S; const base = S.items.filter(i => i.qty > 0 && !i.bulk)[0];
  for (let k = 0; k < 40; k++) { const n = Object.assign({}, base, { ref: 'ZX' + (100 + k), qty: 2 + (k % 5) }); S.items.push(n); }
  L.render(); return S.items.length; }"""
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
                await pg.evaluate("() => { window.__LF.S.todos = true; window.__LF.setView('estoque') }"); await pg.wait_for_timeout(500)
                print(await pg.evaluate(MAIS)); await pg.wait_for_timeout(500)
                info = await pg.evaluate("""() => ({ cards: document.querySelectorAll('#rows .pcard').length, bar: (document.querySelector('.pgBar')||{}).innerText,
                   fim: (document.getElementById('invFim')||{}).innerText })""")
                print(nm, json.dumps(info, ensure_ascii=False))
                await pg.evaluate("() => window.scrollTo(0, 1e6)"); await pg.wait_for_timeout(400)
                await pg.screenshot(path=D + nm + '_fim.png')
                await pg.click('.pgBar .pgB:last-child'); await pg.wait_for_timeout(600)
                print('pág 2:', await pg.evaluate("() => [document.querySelectorAll('#rows .pcard').length, document.querySelector('.pgN').textContent, scrollY]"))
                await pg.goto('http://localhost:8799/#test'); await pg.wait_for_function('() => window.__LF && window.__LF.S', timeout=20000)
                await pg.evaluate("() => { window.__LF.S.todos = true; window.__LF.setView('estoque') }"); await pg.evaluate(MAIS); await pg.wait_for_timeout(400)
                print('depois de recarregar:', await pg.evaluate("() => (document.querySelector('.pgN')||{}).textContent"))
                await pg.click('#invFim .nvL[data-act=invParSob]'); await pg.wait_for_timeout(700)
                await pg.screenshot(path=D + nm + '_parsob.png')
                await pg.evaluate("() => window.scrollTo(0, 1e6)"); await pg.wait_for_timeout(400); await pg.screenshot(path=D + nm + '_parsob_fim.png')
                print('parsob:', await pg.evaluate("() => document.getElementById('v-parsob').innerText.slice(0,400)"))
                print('erros', erros)
                await c.close()
            await b.close()
    finally: srv.kill()
asyncio.run(main())

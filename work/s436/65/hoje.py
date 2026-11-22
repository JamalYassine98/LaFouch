# Inventário hoje (antes do item 65): topo, fim da lista e filtros — celular 390, escuro
import asyncio, subprocess, sys, json
NOME = sys.argv[1] if len(sys.argv) > 1 else 'hoje'
sys.path.insert(0, 'work/kit'); import sim
from playwright.async_api import async_playwright
async def main():
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8799', '-d', 'www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); await asyncio.sleep(1)
    try:
        async with async_playwright() as pw:
            b = await sim.navegador(pw)
            c = await sim.contexto(b, 390, 844, toque=True, escuro=True, sem_trabalhador=True); pg = await c.new_page()
            await pg.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
            await pg.goto('http://localhost:8799/#test'); await pg.wait_for_timeout(1500)
            await pg.evaluate("() => window.__LF.setView('estoque')"); await pg.wait_for_timeout(800)
            await pg.screenshot(path='work/s436/65/'+NOME+'_topo.png')
            print(json.dumps(await pg.evaluate("""() => { const v = document.getElementById('v-estoque');
              return { n: v.querySelectorAll('.pcard').length, crumb: (document.getElementById('crumb') || {}).textContent, ids: [...v.querySelectorAll('[id]')].map(e => e.id + ':' + e.tagName + (e.hidden ? ':h' : '')).slice(0, 80),
                txt: v.innerText.slice(0, 900) }; }"""), ensure_ascii=False, indent=0)[:4000])
            await pg.evaluate("() => window.scrollTo(0, 1e6)"); await pg.wait_for_timeout(500)
            await pg.screenshot(path='work/s436/65/'+NOME+'_fim.png')
            await c.close(); await b.close()
    finally: srv.kill()
asyncio.run(main())

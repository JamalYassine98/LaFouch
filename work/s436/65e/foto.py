# 65e: filtros (Faixa que cabe + bloco Site), Atacado › Mensagens vazio (balão B) e Parados sem título de tipo
import asyncio, subprocess, sys, json
sys.path.insert(0, 'work/kit'); import sim
from playwright.async_api import async_playwright
D = 'work/s436/65e/'
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
                print(await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
                  L.setView('estoque'); await w(300); document.getElementById('btnFilt').click(); await w(600);
                  const ff = document.getElementById('fFaixas');
                  return JSON.stringify({ faixas: (S.faixas||[]).map(f => f.nome), cabe: ff && ff.getAttribute('data-cabe'), fora: [...ff.children].filter(x => x.scrollWidth > x.clientWidth + 1).map(x => x.textContent),
                    site: (document.getElementById('fSite')||{}).innerText }); }"""))
                await pg.evaluate("() => document.getElementById('fSite').scrollIntoView({block:'end'})"); await pg.wait_for_timeout(400)
                await pg.screenshot(path=D + nm + '_filtros.png')
                await pg.keyboard.press('Escape'); await pg.wait_for_timeout(300)
                await pg.evaluate("() => { const L = window.__LF, S = L.S; S.ataMsgs = []; S.ataPeds = {}; S._ataMsgTs = Date.now(); S._ataMsgErr = 0; S.ataAba = 'msg'; L.setView('ata'); }"); await pg.wait_for_timeout(1800)
                await pg.screenshot(path=D + nm + '_atacado.png')
                await pg.evaluate("() => window.__LF.setView('parsob')"); await pg.wait_for_timeout(600)
                await pg.screenshot(path=D + nm + '_parsob.png')
                print('erros', erros)
                await c.close()
            await b.close()
    finally: srv.kill()
asyncio.run(main())

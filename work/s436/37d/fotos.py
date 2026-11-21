# Ajustes em 3 blocos: fotos (fechado e com Cópias e nuvem aberta), claro e escuro, e medida de quebra de linha (L4) nas 3 letras
import asyncio, subprocess, sys, re, json
sys.path.insert(0, 'work/kit'); import sim
from playwright.async_api import async_playwright
MEDE = """() => { const R = []; document.querySelectorAll('#v-ajustes .ajR b, #v-ajustes .ajR .ajRes, #v-ajustes .nvxL span, #v-ajustes .nvxL small').forEach(e => { if (!e.getClientRects().length) return;
  const lh = parseFloat(getComputedStyle(e).lineHeight) || parseFloat(getComputedStyle(e).fontSize) * 1.3; if (e.getBoundingClientRect().height > lh * 1.6 || e.scrollWidth > e.clientWidth + 1) R.push(e.textContent.trim().slice(0, 30)); }); return [document.getElementById('ajGrp').getAttribute('data-cabe'), R]; }"""
async def main():
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8799', '-d', 'www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); await asyncio.sleep(1)
    try:
        async with async_playwright() as pw:
            b = await sim.navegador(pw)
            for W, Z in ((360, 1), (390, 1), (360, 1.3), (390, 1.3)):
              for esc in (True, False):
                n = ('escuro' if esc else 'claro') + ('' if W == 390 else '_%d' % W) + ('' if Z == 1 else '_letra13')
                c = await sim.contexto(b, W, 844, toque=True, escuro=esc, sem_trabalhador=True); pg = await c.new_page()
                await pg.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
                await pg.route(re.compile(r'googleapis'), lambda r: r.fulfill(json={}))
                await pg.goto('http://localhost:8799/#test'); await pg.wait_for_timeout(1500)
                if Z != 1: await pg.add_style_tag(content='#ajGrp .ajR b,#ajGrp .ajRes,#ajGrp .nvxL span,#ajGrp .nvxL small,#ajGrp .nvxE b,#ajGrp .nvxE small,.ajBt{zoom:%s}' % Z)
                await pg.evaluate("() => { const L = window.__LF, S = L.S; S.ajAberta = ''; L.setView('ajustes'); S._ajForce = true; L.render(); }"); await pg.wait_for_timeout(600)
                q = [await pg.evaluate(MEDE)]
                await pg.screenshot(path='work/s436/37d/ajustes_%s.png' % n, full_page=True)
                await pg.evaluate("() => { const L = window.__LF, S = L.S; S.nuvem.rt = 'x'; S.nuvem.email = 'a@b.c'; S.nvLista = [{id: '2026-11-08', kb: 900}]; S.backupTs = Date.now(); S.ajAberta = 'bk'; S._ajForce = true; L.render(); }"); await pg.wait_for_timeout(700)
                await pg.evaluate("() => document.querySelector('.ajS[data-k=bk]').scrollIntoView({block: 'start'})"); await pg.wait_for_timeout(300)
                q.append(await pg.evaluate(MEDE))
                await pg.screenshot(path='work/s436/37d/nuvem_%s.png' % n)
                print(n, 'quebra em 2 linhas:', q); await c.close()
            await b.close()
    finally: srv.kill()
asyncio.run(main())

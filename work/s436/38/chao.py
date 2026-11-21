# parte B: o aviso nunca cruza a barra nem o botão da janela aberta — 390, 820 e 1366; fotos no 390
import asyncio, subprocess, sys, json
sys.path.insert(0, 'work/kit'); import sim
from playwright.async_api import async_playwright
JS = """async (foto) => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
  const cruza = (a, b) => !!a && !!b && a.height > 0 && b.height > 0 && !(a.bottom <= b.top || a.top >= b.bottom || a.right <= b.left || a.left >= b.right);
  const t = () => document.getElementById('lfToast').getBoundingClientRect(), nav = () => document.getElementById('mainnav').getBoundingClientRect();
  L.setView('desp'); await w(400); L.lfToast('Despesa guardada', 'ok'); await w(700);
  R.barra = [cruza(t(), nav()), Math.round(nav().top - t().bottom), Math.round(innerHeight - t().bottom), getComputedStyle(document.documentElement).getPropertyValue('--chao')];
  await foto('barra');
  L.setView('ajustes'); await w(400); L.ACT.ajMarca(); await w(700); L.lfToast('Preencha o nome', 'atencao'); await w(700);
  const bt = document.querySelector('.ljJn [data-marca=salva]').getBoundingClientRect();
  R.janela = [cruza(t(), bt), Math.round(bt.top - t().bottom)]; await foto('janela');
  document.querySelector('.ljJn [data-marca=salva]').click(); await w(60); L.lfToast('✓ Salvo', 'ok'); await w(900);
  R.depois = [cruza(t(), nav()), Math.round(innerHeight - t().bottom)];
  L.estAbre(); await w(500); L.lfToast('Fotos guardadas', 'ok'); await w(700); R.estudio = Math.round(innerHeight - t().bottom); await foto('estudio');
  return R; }"""
async def main():
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8799', '-d', 'www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); await asyncio.sleep(1)
    try:
        async with async_playwright() as pw:
            b = await sim.navegador(pw)
            for W, H in ((390, 844), (820, 1180), (1366, 768)):
                c = await sim.contexto(b, W, H, toque=W < 1000, escuro=True, sem_trabalhador=True); pg = await c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)))
                await pg.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
                async def foto(n, pg=pg, W=W):
                    if W == 390: await pg.screenshot(path='work/s436/38/chao_%s.png' % n)
                await pg.expose_function('__foto', foto)
                await pg.goto('http://localhost:8799/#test'); await pg.wait_for_timeout(1500)
                print(W, json.dumps(await pg.evaluate(JS.replace('async (foto) =>', 'async () =>').replace('{ const L', '{ const foto = window.__foto; const L', 1)), ensure_ascii=False), er)
                await c.close()
            await b.close()
    finally: srv.kill()
asyncio.run(main())

# mede, em toda tela com botão redondo no título, o centro do botão contra o centro do h1 (regra L2, achado do dono 22/11 13:09)
import asyncio, subprocess, sys, json
sys.path.insert(0, 'work/kit'); import sim
from playwright.async_api import async_playwright
JS = """async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = [];
  const vs = [...document.querySelectorAll('.view')].map(v => v.id.replace('v-', ''));
  for (const v of vs) { try { L.setView(v); } catch (e) { continue; } await w(350);
    const el = document.getElementById('v-' + v); if (!el || el.hidden) continue;
    const top = el.querySelector(':scope > .top'), h = top && top.querySelector('h1'); if (!h) continue;
    const bs = [...top.querySelectorAll('button')].filter(b => { const r = b.getBoundingClientRect(), s = getComputedStyle(b); return r.width && Math.abs(r.width - r.height) < 3 && s.borderRadius.indexOf('50%') >= 0 || (r.width && Math.abs(r.width - r.height) < 3 && parseFloat(s.borderRadius) >= r.width / 2 - 1); });
    const hr = h.getBoundingClientRect();
    bs.forEach(b => { const r = b.getBoundingClientRect(); R.push([v, b.id || b.className.slice(0, 20) || b.getAttribute('aria-label'), Math.round((r.top + r.bottom) / 2 - (hr.top + hr.bottom) / 2), Math.round(hr.top) + '-' + Math.round(hr.bottom), Math.round(r.top) + '-' + Math.round(r.bottom)]); }); }
  return R; }"""
async def main():
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8799', '-d', sys.argv[1] if len(sys.argv) > 1 else 'www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); await asyncio.sleep(1)
    try:
        async with async_playwright() as pw:
            b = await sim.navegador(pw)
            for W in (390, 1366):
                c = await sim.contexto(b, W, 844, toque=W < 1000, escuro=True, sem_trabalhador=True); pg = await c.new_page()
                await pg.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
                await pg.goto('http://localhost:8799/#test'); await pg.wait_for_timeout(1500)
                for x in await pg.evaluate(JS): print(W, x)
                await c.close()
            await b.close()
    finally: srv.kill()
asyncio.run(main())

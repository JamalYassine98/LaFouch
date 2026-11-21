# mede a cor real dos ícones de linha de lista (Início, índice de cada grupo, Dashboard), claro e escuro
import asyncio, subprocess, sys, json
sys.path.insert(0, 'work/kit'); import sim
from playwright.async_api import async_playwright
JS = """async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
  const cor = e => getComputedStyle(e).color, mute = (() => { const d = document.createElement('i'); d.style.color = 'var(--mute)'; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; })();
  const junta = (nome, sel) => { const m = {}; document.querySelectorAll(sel).forEach(e => { if (!e.getClientRects().length) return; const c = cor(e) === mute ? 'mute' : cor(e); m[c] = (m[c] || 0) + 1; }); R[nome] = m; };
  L.setView('inicio'); await w(500); junta('inicio .tl .ti', '#v-inicio .tl .ti'); junta('inicio .hero .hi', '#v-inicio .hero .hi'); junta('inicio svg', '#v-inicio .tl svg, #v-inicio .hero svg');
  R.heroBg = [...document.querySelectorAll('#v-inicio .hero .hi')].map(e => getComputedStyle(e).backgroundColor);
  for (const g of (S.grupos || [])) { L.setView('inicio'); await w(250); const t = document.querySelector('#v-inicio .tl[data-id="' + g.id + '"]'); if (!t) continue; t.click(); await w(500); junta(g.id + ' (' + S.view + ') .nvIc', '#v-' + S.view + ' .nvIc'); junta(g.id + ' svg nas linhas', '#v-grp .nvL svg'); }
  R.mute = mute; return R; }"""
async def main():
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8799', '-d', 'www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    await asyncio.sleep(1)
    try:
        async with async_playwright() as pw:
            b = await sim.navegador(pw)
            for esc in (True, False):
                c = await sim.contexto(b, 390, 844, toque=True, escuro=esc, sem_trabalhador=True); pg = await c.new_page()
                await pg.goto('http://localhost:8799/#test'); await pg.wait_for_timeout(1500)
                await pg.evaluate("t => { const S = window.__LF.S; S.tema = t; window.__LF.render && window.__LF.render(); }", 'escuro' if esc else 'claro')
                print('ESCURO' if esc else 'CLARO', json.dumps(await pg.evaluate(JS), ensure_ascii=False, indent=1))
                await pg.evaluate("() => window.__LF.setView('inicio')"); await pg.wait_for_timeout(600)
                await pg.screenshot(path='work/s436/37b/inicio_%s.png' % ('escuro' if esc else 'claro'))
                await c.close()
            await b.close()
    finally: srv.kill()
asyncio.run(main())

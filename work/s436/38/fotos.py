# os 4 tipos do aviso curto, claro e escuro (recorte do fundo da tela)
import asyncio, subprocess, sys
sys.path.insert(0, 'work/kit'); import sim
from playwright.async_api import async_playwright
from PIL import Image
T = [('ok', '✓ Venda registrada'), ('atencao', 'Preencha o nome e um e-mail válido'), ('erro', 'Não deu para verificar agora'), ('andamento', 'Conferindo o código…')]
async def main():
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8799', '-d', 'www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); await asyncio.sleep(1)
    try:
        async with async_playwright() as pw:
            b = await sim.navegador(pw)
            for esc in (True, False):
                c = await sim.contexto(b, 390, 844, toque=True, escuro=esc, sem_trabalhador=True); pg = await c.new_page()
                await pg.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
                await pg.goto('http://localhost:8799/#test'); await pg.wait_for_timeout(1500)
                ims = []
                for tp, tx in T:
                    await pg.evaluate("a => window.__LF.lfToast(a[1], a[0])", [tp, tx]); await pg.wait_for_timeout(800)
                    f = '/tmp/t38_%s.png' % tp; await pg.screenshot(path=f); ims.append(Image.open(f).crop((0, 700, 390, 844)))
                S = Image.new('RGB', (390, 144 * 4 + 12)); [S.paste(im, (0, i * 148)) for i, im in enumerate(ims)]
                S.save('work/s436/38/tipos_%s.png' % ('escuro' if esc else 'claro')); await c.close()
            await b.close()
    finally: srv.kill()
asyncio.run(main())

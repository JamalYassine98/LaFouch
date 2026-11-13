# S216 (13/11/2026): padrão único de colunas em 2 grupos (TOQUE = celular/tablet/notebook virado tablet · MOUSE = notebook/computador) + Mochi (QR no computador, sem câmera).
# Esboço realista: site real (cópia local), só injeta o que muda. Um arquivo por tela. Roda o olho do designer no hoje e na proposta.
import sys, textwrap
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
OUT = '/home/claude/lafouch/work/s216/'; OLHO = open('/home/claude/lafouch/work/kit/olho.js').read()
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
TOQUE = """
#home{padding-inline:0!important}
@media (max-width:559px){html body #home .hg,html body #vscr #grid{grid-template-columns:repeat(2,1fr)!important;gap:12px!important}}
@media (min-width:560px) and (max-width:1099px){html body #home .hg,html body #vscr #grid{grid-template-columns:repeat(3,1fr)!important;gap:14px!important}}
@media (min-width:1100px){html body #home .hg,html body #vscr #grid{grid-template-columns:repeat(4,1fr)!important;gap:16px!important}#vscr>*,#home{max-width:min(1320px,92vw)!important;margin-inline:auto!important}}
#lfgen button,#lfgen .lfgf,.vback{min-height:44px!important;display:inline-flex!important;align-items:center!important}
"""
MOUSE = """
#vscr>*{max-width:min(1320px,92vw)!important;margin-inline:auto!important}
html body #vscr #grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:18px!important;width:100%!important}
"""
VIT = "()=>{const e=document.querySelector('.hsh');e&&e.scrollIntoView()}"
QR = """async()=>{if(!window.LFqr){await new Promise(ok=>{const s=document.createElement('script');s.src='lfx/qr.js';s.onload=ok;document.head.appendChild(s)})}
 const g=document.querySelector('#gw'),b=g.querySelector('.gzgo');if(!b||g.querySelector('.lxqr'))return;
 const bal=g.querySelector('.gzbal');if(bal)bal.textContent='Este test sale mejor en el celular. Escaneá el código, o seguimos acá si preferís.';
 const d=document.createElement('div');d.className='lxqr';d.innerHTML='<span class="q">'+window.LFqr.svg('https://lafouch.com/?r=descubri-tu-graduacion')+'</span><span class="t"><b>Mejor en el celular</b><small>Se hace sosteniendo la pantalla a 30 cm. Apuntá la cámara del celular al código y seguí ahí.</small><small class="m">También podés hacerlo en esta computadora: tocá Empezar.</small></span>';
 b.insertAdjacentElement('afterend',d)}"""
QRC = ".lxqr{display:flex;gap:18px;align-items:center;margin-top:18px;padding:16px 18px;border:1px solid var(--ln,#efe3ea);border-radius:18px;background:#fff}.lxqr .q{flex:none;width:112px;height:112px}.lxqr .q svg{width:100%;height:100%;display:block}.lxqr .t{display:flex;flex-direction:column;gap:6px}.lxqr b{font:600 16px var(--display),Georgia,serif;color:var(--tx,#2a1f27)}.lxqr small{font:400 13.5px var(--body),Inter,sans-serif;color:var(--mu,#6b5a66);line-height:1.45}.lxqr small.m{color:var(--ac,#8d3a69)}"
FALA = lambda de, para: "()=>{document.querySelectorAll('#gw *').forEach(e=>{if(e.children.length===0&&e.textContent.includes('%s'))e.textContent=e.textContent.replace('%s','%s')})}" % (de, de, para)
# nome: (título, explicação, W, H, toque, url, [ações antes], css, js depois, câmera falsa?, [ações só na proposta])
C = {
 '1_celular_inicio': ('Celular · Início', 'Grupo TOQUE. Hoje o Início tem margem de 31 px e o catálogo de 15: cartões de tamanhos diferentes. Proposta: a mesma margem (15) e o mesmo cartão nas duas telas.', 390, 844, 1, '', [VIT], TOQUE, None, 0),
 '2_tablet_inicio': ('Tablet em pé · Início', 'Grupo TOQUE. Hoje o Início usa 4 colunas apertadas (133 px) e o catálogo 3. Proposta: 3 colunas nas duas telas, mesma margem.', 768, 1024, 1, '', [VIT], TOQUE, None, 0),
 '3_tablet_catalogo': ('Tablet em pé · Catálogo', 'Grupo TOQUE. O catálogo já usa 3 colunas: quase não muda; só ganha altura de toque de 44 px nas abas e no Filtros.', 768, 1024, 1, '?r=armazones', [], TOQUE, None, 0),
 '4_notebook_mouse': ('Notebook com mouse · Catálogo', 'Grupo MOUSE. Hoje o catálogo encosta nas bordas (margem 16) e o Início tem margem de 55. Proposta: o catálogo usa a mesma coluna de conteúdo do Início.', 1366, 768, 0, '?r=armazones', [], MOUSE, None, 0),
 '5_monitor': ('Computador 1920 · Catálogo', 'Grupo MOUSE. Hoje o Início mostra 4 colunas no centro e o catálogo 6 colunas de ponta a ponta. Proposta: 4 colunas no centro nas duas telas.', 1920, 1080, 0, '?r=armazones', [], MOUSE, None, 0),
 '6_notebook_tablet': ('Notebook virado tablet (toque) · Catálogo', 'O site percebe que o dedo virou o comando principal e passa para o grupo TOQUE: mesma coluna de conteúdo, abas e Filtros com 44 px de altura, sem efeitos de passar o mouse.', 1366, 768, 1, '?r=armazones', [], TOQUE, None, 0),
 '7_mochi_pc': ('Computador · teste da Mochi (início)', 'Em computador ou notebook a Mochi avisa que o teste sai melhor no celular e mostra o código QR. Quem quiser continua no computador pelo mesmo botão Empezar.', 1366, 768, 0, '?r=descubri-tu-graduacion', [], QRC, QR, 0),
 '8_mochi_pc_fala': ('Computador · teste da Mochi (distância)', 'Hoje, no computador, a Mochi manda "segurar o celular a 30 cm". Proposta: no computador ela fala da tela, não do celular (na fala e no título).', 1366, 768, 0, '?r=descubri-tu-graduacion', ["()=>document.querySelector('.gzgo').click()", 5200], '', "()=>{document.querySelectorAll('#gw *').forEach(e=>{if(e.children.length===0){e.textContent=e.textContent.replace('sostené el celular a 30 centímetros','ponete a 30 centímetros de la pantalla').replace('sostené el celular a 30 cm','ponete a 30 cm de la pantalla')}})}", 1),
 '9_mochi_sem_camera': ('Celular sem câmera · teste da Mochi', 'Hoje, mesmo sem nenhuma câmera no aparelho, a Mochi pergunta "¿Puedo usar la cámara?". Proposta: se não há câmera, ela nem pergunta e vai direto ao passo dos 30 cm.', 390, 844, 1, '?r=descubri-tu-graduacion', ["()=>document.querySelector('.gzgo').click()", 4200], '', "()=>{const b=document.querySelector('#gw .gzgo.o');b&&b.click();return new Promise(ok=>setTimeout(()=>{const f=document.querySelector('#gw .gzbal');if(f)f.textContent='Hacé como yo: sacate los lentes y sostené el celular a 30 centímetros, un palmo.';ok()},2600))}", 0),
}
def shot(pw, W, H, toque, url, acoes, css, js, cam, out):
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'] + (['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] if cam else []))
    mob = bool(toque) and W < 900
    c = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2 if W < 900 else 1, is_mobile=mob, has_touch=bool(toque), locale='es-PY', service_workers='block')
    c.add_init_script("sessionStorage.setItem('lf_ni','1')"); c.route('**/*', rota); pg = c.new_page()
    pg.goto('http://localhost:8811/' + url); pg.wait_for_timeout(3200)
    if css: pg.add_style_tag(content=css); pg.wait_for_timeout(300)
    for a in acoes:
        if isinstance(a, int): pg.wait_for_timeout(a)
        else: pg.evaluate(a); pg.wait_for_timeout(1300)
    if js: pg.evaluate(js); pg.wait_for_timeout(500)
    o = pg.evaluate(OLHO); pg.screenshot(path=out); b.close(); return {x['r']: x['n'] for x in o}
def junta(k, tit, sub, a, b2):
    a = Image.open(a).convert('RGB'); b2 = Image.open(b2).convert('RGB')
    if a.width > a.height:
        a = a.resize((1400, int(a.height * 1400 / a.width))); b2 = b2.resize((1400, int(b2.height * 1400 / b2.width)))
        bw, bh = 1400, a.height * 2 + 120; pos = [(a, 0, 50, 'HOJE', '#b42318'), (b2, 0, a.height + 110, 'PROPOSTA', '#1f8a4c')]
    else:
        hh = 1100; a = a.resize((int(a.width * hh / a.height), hh)); b2 = b2.resize((int(b2.width * hh / b2.height), hh))
        bw, bh = a.width * 2 + 50, hh + 50; pos = [(a, 0, 50, 'HOJE', '#b42318'), (b2, a.width + 50, 50, 'PROPOSTA', '#1f8a4c')]
    lin = textwrap.wrap(sub, 74); Wt = max(1100, bw + 80); Ht = 150 + 36 * len(lin) + bh
    B = Image.new('RGB', (Wt, Ht), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 30), tit, font=F(42, 1), fill='#2a1a28')
    for m, ln in enumerate(lin): d.text((40, 90 + m * 36), ln, font=F(27), fill='#5b4a56')
    y = 100 + 36 * len(lin)
    for im, dx, dy, t, cc in pos: d.text((40 + dx, y + dy), t, font=F(28, 1), fill=cc); B.paste(im, (40 + dx, y + dy + 40))
    B.save(OUT + 's216_%s.jpg' % k, quality=86)
with sync_playwright() as pw:
    for k in (sys.argv[1:] or list(C)):
        tit, sub, W, H, tq, url, ac, css, js, cam = C[k]
        h = shot(pw, W, H, tq, url, ac, '', None, cam, '/tmp/s216a.png'); p = shot(pw, W, H, tq, url, ac, css, js, cam, '/tmp/s216b.png')
        junta(k, tit, sub, '/tmp/s216a.png', '/tmp/s216b.png')
        nov = {r: (h.get(r, 0), n) for r, n in p.items() if n > h.get(r, 0)}; mel = {r: (n, p.get(r, 0)) for r, n in h.items() if p.get(r, 0) < n}
        print(k, '| piorou:', nov, '| melhorou:', mel, flush=True)

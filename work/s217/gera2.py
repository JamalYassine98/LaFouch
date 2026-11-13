# S217 (13/11/2026): esboços pedidos pelo dono — monitor 4×6 colunas, Mochi apontando para o QR (quadros), transição notebook→tablet (quadros), tablet corrigido.
import sys, textwrap, os
A = os.path.dirname(os.path.abspath(__file__)) + '/'; sys.path.insert(0, A)
from padrao import TOQUE, MOUSE
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
def pag(pw, W, H, tq, url):
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    c = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2 if W < 900 else 1, is_mobile=bool(tq) and W < 900, has_touch=bool(tq), locale='es-PY', service_workers='block')
    c.add_init_script("sessionStorage.setItem('lf_ni','1')"); c.route('**/*', rota); pg = c.new_page(); pg.goto('http://localhost:8811/' + url); pg.wait_for_timeout(3400); return b, pg
def folha(nome, tit, sub, pecas, lado):
    # pecas: [(rótulo, cor, imagem)] ; lado=True lado a lado, False empilhado
    gap = 40
    if lado: Wt = sum(p[2].width for p in pecas) + gap * (len(pecas) - 1) + 80; Hc = max(p[2].height for p in pecas) + 50
    else: Wt = max(p[2].width for p in pecas) + 80; Hc = sum(p[2].height + 60 for p in pecas)
    Hc += 40
    Wt = max(Wt, 1100); lin = textwrap.wrap(sub, int((Wt - 80) / 15.2)); B = Image.new('RGB', (Wt, 150 + 36 * len(lin) + Hc), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 30), tit, font=F(42, 1), fill='#2a1a28')
    for m, ln in enumerate(lin): d.text((40, 90 + m * 36), ln, font=F(27), fill='#5b4a56')
    x, y = 40, 110 + 36 * len(lin)
    for rot, cor, im in pecas:
        d.text((x, y), rot, font=F(27, 1), fill=cor); B.paste(im, (x, y + 40))
        if lado: x += im.width + gap
        else: y += im.height + 60
    B.save(A + 's217_%s.jpg' % nome, quality=86); print('ok', nome, flush=True)
def red(p, w): im = Image.open(p).convert('RGB'); return im.resize((w, int(im.height * w / im.width)))
QRC = ".lxqr{display:flex;gap:18px;align-items:center;margin-top:18px;padding:16px 18px;border:1px solid var(--ln,#efe3ea);border-radius:18px;background:#fff;opacity:0;transform:translateY(12px);transition:opacity .48s cubic-bezier(.2,.8,.2,1),transform .48s cubic-bezier(.2,.8,.2,1)}.lxqr.m{opacity:.45;transform:translateY(6px)}.lxqr.on{opacity:1;transform:none}.lxqr .q{flex:none;width:112px;height:112px}.lxqr .q svg{width:100%;height:100%;display:block}.lxqr .t{display:flex;flex-direction:column;gap:6px}.lxqr b{font:600 16px var(--display),Georgia,serif;color:var(--tx,#2a1f27)}.lxqr small{font:400 13.5px var(--body),Inter,sans-serif;color:var(--mu,#6b5a66);line-height:1.45}.lxqr small.m2{color:var(--ac,#8d3a69)}"
QR = """async()=>{if(!window.LFqr){await new Promise(ok=>{const s=document.createElement('script');s.src='lfx/qr.js';s.onload=ok;document.head.appendChild(s)})}
 const g=document.querySelector('#gw'),b=g.querySelector('.gzgo');const d=document.createElement('div');d.className='lxqr';d.innerHTML='<span class="q">'+window.LFqr.svg('https://lafouch.com/?r=descubri-tu-graduacion')+'</span><span class="t"><b>Mejor en el celular</b><small>Apuntá la cámara del celular a este código y seguí ahí.</small><small class="m2">O tocá Empezar para hacerlo en esta computadora.</small></span>';b.insertAdjacentElement('afterend',d)}"""
def so(k): return not sys.argv[1:] or k in sys.argv[1:]
with sync_playwright() as pw:
    for k, W, H, tit, sub in (('1_monitor_1920', 1920, 1080, 'Computador 1920 · Catálogo completo', 'Decisão 1. HOJE: 6 colunas de ponta a ponta (o Início usa 4 no centro). PROPOSTA: 4 colunas no centro, igual ao Início — cartão maior, menos peças por tela.'), ('2_monitor_2560', 2560, 1440, 'Monitor 2K (2560) · Catálogo completo', 'A mesma decisão no monitor maior.')):
        if not so(k): continue
        b, pg = pag(pw, W, H, 0, '?r=tienda'); pg.screenshot(path='/tmp/a.png'); pg.add_style_tag(content=MOUSE); pg.wait_for_timeout(700); pg.screenshot(path='/tmp/b.png'); b.close()
        folha(k, tit, sub, [('HOJE · 6 colunas', '#b42318', red('/tmp/a.png', 1400)), ('PROPOSTA · 4 colunas no centro', '#1f8a4c', red('/tmp/b.png', 1400))], False)
    if so('3_tablet_inicio'):
        b, pg = pag(pw, 768, 1024, 1, ''); V = "()=>{const e=document.querySelector('.hsh');e&&e.scrollIntoView()}"; pg.evaluate(V); pg.wait_for_timeout(1300); pg.screenshot(path='/tmp/a.png'); pg.add_style_tag(content=TOQUE); pg.wait_for_timeout(500); pg.evaluate(V); pg.wait_for_timeout(1300); pg.screenshot(path='/tmp/b.png'); b.close()
        folha('3_tablet_inicio', 'Tablet em pé · Início (corrigido)', 'Grupo TOQUE: 3 colunas como no catálogo. Corrigida a falha do esboço anterior: a vitrine mostra 6 peças (2 fileiras cheias), sem fileira pela metade.', [('HOJE', '#b42318', red('/tmp/a.png', 620)), ('PROPOSTA', '#1f8a4c', red('/tmp/b.png', 620))], True)
    if so('4_mochi_qr'):
        b, pg = pag(pw, 1366, 768, 0, '?r=descubri-tu-graduacion'); pg.wait_for_timeout(1500); clip = {'x': 395, 'y': 78, 'width': 590, 'height': 690}
        pg.add_style_tag(content=QRC); pg.screenshot(path='/tmp/f1.png', clip=clip); pg.evaluate(QR)
        r = pg.evaluate("()=>{const q=document.querySelector('.lxqr .q').getBoundingClientRect();return [q.left+q.width/2,q.top+q.height/2]}")
        pg.evaluate("()=>{const m=window.__LFGZ.Z.m;m.paraGesto&&m.paraGesto();m.ocioso=false;m.vara(1);m.mira(118,26,300);document.querySelector('.lxqr').classList.add('m');const f=document.querySelector('#gw .gzbal');if(f)f.textContent='Este test sale mejor en el celular…'}"); pg.evaluate("p=>window.__LFGZ.Z.m.olhaPara(p[0],p[1])", r); pg.wait_for_timeout(700); pg.screenshot(path='/tmp/f2.png', clip=clip)
        pg.evaluate("()=>{const m=window.__LFGZ.Z.m;m.mira(128,44,400);m.cara&&m.cara('f');document.querySelector('.lxqr').classList.replace('m','on');const f=document.querySelector('#gw .gzbal');if(f)f.textContent='Este test sale mejor en el celular. Apuntá la cámara a este código… o seguimos acá, como prefieras.'}"); pg.evaluate("p=>window.__LFGZ.Z.m.olhaPara(p[0],p[1])", r); pg.wait_for_timeout(1100); pg.screenshot(path='/tmp/f3.png', clip=clip); b.close()
        folha('4_mochi_qr', 'Computador · Mochi aponta e fala (3 quadros)', 'Em computador ou notebook: 1) tela normal · 2) a Mochi vira a varinha e olha para baixo enquanto o código surge devagar (0,48 s, sobe 12 px) · 3) ela aponta o código e fala. O botão Empezar continua valendo para fazer no computador.', [('1 · antes', '#5b4a56', red('/tmp/f1.png', 590)), ('2 · surgindo', '#8d3a69', red('/tmp/f2.png', 590)), ('3 · apontando e falando', '#1f8a4c', red('/tmp/f3.png', 590))], True)
    if so('5_transicao'):
        b, pg = pag(pw, 1366, 768, 0, '?r=armazones'); clip = {'x': 30, 'y': 78, 'width': 720, 'height': 300}; pg.add_style_tag(content=MOUSE); pg.wait_for_timeout(600); pg.screenshot(path='/tmp/f1.png', clip=clip)
        pg.add_style_tag(content="#lfgen button,#lfgen .lfgf,.vback{min-height:34px!important;display:inline-flex!important;align-items:center!important}"); pg.wait_for_timeout(400); pg.screenshot(path='/tmp/f2.png', clip=clip)
        pg.add_style_tag(content=TOQUE); pg.wait_for_timeout(700); pg.screenshot(path='/tmp/f3.png', clip=clip); b.close()
        folha('5_transicao', 'Notebook → modo tablet (3 quadros)', 'Ao dobrar o teclado o site passa do grupo MOUSE para o TOQUE sem recarregar e sem pulo: as colunas e a posição ficam iguais; só as áreas de toque crescem devagar (0,32 s) até 44 px.', [('1 · com mouse', '#5b4a56', red('/tmp/f1.png', 720)), ('2 · no meio (0,16 s)', '#8d3a69', red('/tmp/f2.png', 720)), ('3 · modo tablet', '#1f8a4c', red('/tmp/f3.png', 720))], False)

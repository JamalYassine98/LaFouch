# S209 (13/11/2026): esboços dos padrões de e-commerce — um arquivo por ideia, "Hoje × Proposta", no site real (cópia isolada).
import sys
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
OUT = '/home/claude/lafouch/work/s211/'
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
ABRE = "()=>document.querySelector('#grid .card .open').click()"
PRETO = ".card .pr,.hc .hp,#layer .det .pr,#layer .det .dp .pr,.hstage .hp,.hdst .hp,#layer .pof b{color:#1d1418!important}#layer .pof em{background:#8d3a69!important;color:#fff!important}"
LF = open(OUT+'lf.css').read(); NV = open(OUT+'nav.js').read().strip()
SUB = 'Mesma LaFouch (vinho, letra serifada, cartões arredondados, fundo rosado), com mais ar e menos ruído: fios finos no lugar de sombras, preço preto, um só tipo de botão, categorias à vista no PC. Filtros como hoje.'
VIT = "()=>{const e=document.querySelector('.hsh');e&&e.scrollIntoView()}"
IDEIAS = {
 'lf_pc': ('Luxo com identidade · PC', SUB, LF, NV, [('PC · Início (topo)', '', 1440, 900, None, None), ('PC · Início (vitrine)', '', 1440, 900, VIT, None), ('PC · Catálogo', '?r=armazones', 1440, 900, None, None), ('PC · peça', '?r=armazones', 1440, 900, ABRE, None)]),
 'lf_celular': ('Luxo com identidade · celular', SUB, LF, NV, [('Celular · Início', '', 390, 844, None, None), ('Celular · Novidades', '', 390, 844, VIT, None), ('Celular · Catálogo', '?r=armazones', 390, 844, None, None), ('Celular · peça', '?r=armazones', 390, 844, ABRE, None)]),
}
def shot(pw, url, W, H, css, js, acao, out):
    mob = W < 700
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    c = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2 if mob else 1, is_mobile=mob, has_touch=mob, locale='es-PY', service_workers='block')
    c.add_init_script("sessionStorage.setItem('lf_ni','1')"); c.route('**/*', rota); pg = c.new_page()
    pg.goto('http://localhost:8811/' + url); pg.wait_for_timeout(3000)
    if css: pg.add_style_tag(content=css)
    if js: pg.evaluate(js)
    if acao: pg.evaluate(acao); pg.wait_for_timeout(1600)
    if css: pg.add_style_tag(content=css)
    if js: pg.evaluate(js)
    pg.wait_for_timeout(500); pg.screenshot(path=out); b.close()
def faz(k):
    tit, sub, css, js, P = IDEIAS[k]
    with sync_playwright() as pw:
        cols = []
        for i, (rot, url, W, H, acao, _) in enumerate(P):
            a, b2 = '/tmp/s209_%s_%da.png' % (k, i), '/tmp/s209_%s_%db.png' % (k, i)
            shot(pw, url, W, H, '', '', acao, a); shot(pw, url, W, H, css, js, acao, b2)
            cols.append((rot, Image.open(a).convert('RGB'), Image.open(b2).convert('RGB')))
    # cada tela vira um bloco: celular = Hoje | Proposta lado a lado; PC = Hoje em cima, Proposta embaixo
    blocos = []
    for r, a, b2 in cols:
        if a.width > a.height:
            a = a.resize((1400, int(a.height * 1400 / a.width))); b2 = b2.resize((1400, int(b2.height * 1400 / b2.width)))
            bw, bh = 1400, a.height * 2 + 120; pos = [(a, 0, 50, 'HOJE', '#b42318'), (b2, 0, a.height + 110, 'PROPOSTA', '#1f8a4c')]
        else:
            hh = 1100; a = a.resize((int(a.width * hh / a.height), hh)); b2 = b2.resize((int(b2.width * hh / b2.height), hh))
            bw, bh = a.width * 2 + 50, hh + 50; pos = [(a, 0, 50, 'HOJE', '#b42318'), (b2, a.width + 50, 50, 'PROPOSTA', '#1f8a4c')]
        blocos.append((r, bw, bh, pos))
    # 13/11 (dono): um arquivo por tela, para dar para ler no celular
    import textwrap
    for n, (r, bw, bh, pos) in enumerate(blocos, 1):
        lin = textwrap.wrap(sub, 70)
        Wt = max(1100, bw + 80); Ht = 200 + 36 * len(lin) + bh
        B = Image.new('RGB', (Wt, Ht), '#ece6ea'); d = ImageDraw.Draw(B)
        d.text((40, 30), tit + ' · ' + str(n) + '/' + str(len(blocos)), font=F(44, 1), fill='#2a1a28')
        for m, ln in enumerate(lin): d.text((40, 92 + m * 36), ln, font=F(28), fill='#5b4a56')
        y = 110 + 36 * len(lin)
        d.text((40, y), r, font=F(34, 1), fill='#8d3a69')
        for im, dx, dy, t, c in pos:
            d.text((40 + dx, y + dy), t, font=F(28, 1), fill=c); B.paste(im, (40 + dx, y + dy + 40))
        B.save(OUT + '%s_%d.jpg' % (k, n), quality=86)
    print('ok', k)
if __name__ == '__main__':
    for k in (sys.argv[1:] or list(IDEIAS)): faz(k)

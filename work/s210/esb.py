# S209 (13/11/2026): esboços dos padrões de e-commerce — um arquivo por ideia, "Hoje × Proposta", no site real (cópia isolada).
import sys
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
OUT = '/home/claude/lafouch/work/s210/'
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
ABRE = "()=>document.querySelector('#grid .card .open').click()"
PRETO = ".card .pr,.hc .hp,#layer .det .pr,#layer .det .dp .pr,.hstage .hp,.hdst .hp,#layer .pof b{color:#1d1418!important}#layer .pof em{background:#8d3a69!important;color:#fff!important}"
LX = open('/home/claude/lafouch/work/s210/luxo.css').read()
NAV = open('/home/claude/lafouch/work/s210/nav.js').read().strip()
IDEIAS = {
 'luxo_pc': ('Esboço de luxo · PC', 'Menos ruído e mais ar: categorias visíveis numa linha fina (só 4), cartões sem moldura, foto em fundo neutro, preço preto, selos numa linha, WhatsApp discreto.', LX, NAV,
   [('PC · Início (topo)', '', 1440, 900, None, None), ('PC · Início (vitrine)', '', 1440, 900, "()=>{const e=document.querySelector('.hsh');e&&e.scrollIntoView()}", None), ('PC · Catálogo', '?r=armazones', 1440, 900, None, None), ('PC · peça', '?r=armazones', 1440, 900, ABRE, None)]),
 'luxo_celular': ('Esboço de luxo · celular', 'O mesmo padrão no celular: ☰ continua, cartões sem moldura, preço preto, selos numa linha fina, Comprar sóbrio (fica no lugar, sem acompanhar a rolagem).', LX, NAV,
   [('Celular · Início', '', 390, 844, None, None), ('Celular · Novidades', '', 390, 844, "()=>{const e=document.querySelector('.hsh');e&&e.scrollIntoView()}", None), ('Celular · Catálogo', '?r=armazones', 390, 844, None, None), ('Celular · peça', '?r=armazones', 390, 844, ABRE + ";", None)]),

 'filtros': ('Filtros sem repetir', 'Cada filtro num lugar só. PC: a linha de cima escolhe o tipo (sublinhado = onde você está), a linha do título escolhe o gênero, e no canto fica só Ordenar. Celular: sem a linha de cima, a caixa Filtrar mantém Tipo e Ordenar e tira o Gênero (já está à vista).', LX + open(OUT+'fil.css').read(), open(OUT+'fil.js').read().strip(),
   [('PC · Catálogo', '?r=armazones', 1440, 900, None, None), ('Celular · caixa Filtrar', '?r=armazones', 390, 844, "()=>document.querySelector('.lfgf').click()", None)]),

 'filtros2': ('Filtros numa linha só + Destaque', 'Filtros: tudo numa linha, com o mesmo estilo (gênero à esquerda; Formato, Filtrar e Ordenar à direita no PC). Logo abaixo, o que está filtrado com ✕ para tirar. A caixa Filtrar tem TODOS os filtros (inclusive os que estão à vista) e o Formato com desenho. Destaque: Ver modelo igual ao Comprar (preto) e Ver catálogo como link fino, para não ter dois tipos de botão no site.', LX + open(OUT+'fil2.css').read(), open(OUT+'fil2.js').read().strip(),
   [('PC · Catálogo', '?r=armazones', 1440, 900, None, None), ('PC · Início (Destaque)', '', 1440, 900, None, None), ('Celular · Catálogo', '?r=armazones', 390, 844, None, None), ('Celular · caixa Filtrar', '?r=armazones', 390, 844, "()=>{document.querySelector('.lfgf').click();setTimeout(()=>{const b=document.querySelector('#fsh [data-fgn=\"f\"]');b&&b.click()},400)}", None), ('Celular · Início (Destaque)', '', 390, 844, None, None)]),
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

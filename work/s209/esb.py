# S209 (13/11/2026): esboços dos padrões de e-commerce — um arquivo por ideia, "Hoje × Proposta", no site real (cópia isolada).
import sys
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
OUT = '/home/claude/lafouch/work/s209/'
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
ABRE = "()=>document.querySelector('#grid .card .open').click()"
PRETO = ".card .pr,.hc .hp,#layer .det .pr,#layer .det .dp .pr,.hstage .hp,.hdst .hp,#layer .pof b{color:#1d1418!important}#layer .pof em{background:#8d3a69!important;color:#fff!important}"
IDEIAS = {
 '2_menu_pc': ('Menu de categorias no PC', 'Como Dior e óticas grandes: as categorias ficam visíveis no topo, na mesma linha do logo (o topo não cresce). No celular continua o ☰.',
   ".lfnav{position:absolute;left:170px;top:50%;transform:translateY(-50%);display:flex;gap:30px;z-index:5}.lfnav a{font:500 13px Inter,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#2a1a28;text-decoration:none;padding:8px 0;border-bottom:2px solid transparent}.lfnav a.on{border-color:#8d3a69;color:#8d3a69}.lfnav a.of{color:#b42318}.lfnav2{left:auto;right:270px}",
   "()=>{const t=document.querySelector('.top');if(!t||document.querySelector('.lfnav'))return;if(getComputedStyle(t).position==='static')t.style.position='relative';const n=document.createElement('nav');n.className='lfnav';n.innerHTML=['Solar','De lectura','Armazones','Ofertas'].map((x,i)=>'<a href=\\'#\\' class=\\''+(i===2?'on':i===3?'of':'')+'\\'>'+x+'</a>').join('');t.appendChild(n);const m=document.createElement('nav');m.className='lfnav lfnav2';m.innerHTML='<a href=\\'#\\'>Para revender</a>';t.appendChild(m)}",
   [('PC · Início', '', 1440, 420, None, None), ('PC · Catálogo', '?r=armazones', 1440, 420, None, None)]),
 '4_whatsapp': ('WhatsApp sem tampar nada', 'Botão menor (52 px); some enquanto a pessoa rola a tela e volta quando ela para; some na página da peça (o foco é o Comprar); a página ganha espaço embaixo para ele não cobrir o último cartão.',
   ".wa{width:52px!important;height:52px!important}html.onprod .wa,html:has(#layer .pgm) .wa{display:none!important}main{padding-bottom:84px}",
   "", [('Celular · Início', '', 390, 844, None, None), ('Celular · peça', '?r=armazones', 390, 844, ABRE, None)]),
 '5_preco_preto': ('Preço em preto em todo o site', 'Um só estilo de preço: preto, negrito. Oferta = preço antigo riscado + selo −N% na cor da marca. Verde só para "ok/confirmado".',
   PRETO, "", [('Celular · catálogo', '?r=armazones', 390, 844, None, None), ('Celular · peça', '?r=armazones', 390, 844, ABRE, None), ('PC · Início', '', 1440, 900, "()=>scrollTo(0,900)", None)]),
 '6a_alinha_vaga': ('Preços alinhados · A: vaga reservada', 'Todo cartão guarda o espaço da linha "Últimas": nomes e preços ficam na mesma altura na fileira inteira.',
   ".hc:not(:has(.hlin)) .hn{margin-top:31px}", "", [('Celular · Início (Novidades)', '', 390, 844, "()=>{const e=document.querySelector('.hlin');e&&e.scrollIntoView({block:'center'})}", None), ('PC · Início', '', 1440, 900, "()=>{const e=document.querySelector('.hlin');e&&e.scrollIntoView({block:'center'})}", None)]),
 '6b_alinha_fundo': ('Preços alinhados · B: preço no pé do cartão', 'O preço desce para o pé do cartão; só o nome muda de altura quando tem "Últimas".',
   ".hc{display:flex!important;flex-direction:column}.hc .hp{margin-top:auto!important}", "", [('Celular · Início (Novidades)', '', 390, 844, "()=>{const e=document.querySelector('.hlin');e&&e.scrollIntoView({block:'center'})}", None), ('PC · Início', '', 1440, 900, "()=>{const e=document.querySelector('.hlin');e&&e.scrollIntoView({block:'center'})}", None)]),
 '7_caminho': ('Caminho no topo da peça', 'Celular: só "‹ Armazones" inteiro (sem o caminho cortado). PC: uma linha só, "Inicio › Armazones › AC1050", sem o voltar repetido.',
   "@media (max-width:899px){.pgbar .pgcr{display:none!important}.pgbar .pgback span{max-width:none!important;overflow:visible!important}}@media (min-width:900px){.pgbar .pgback{display:none!important}.pgbar .pgcr{font-size:13px}}",
   "", [('Celular · peça', '?r=armazones', 390, 300, ABRE, None), ('PC · peça', '?r=armazones', 1440, 300, ABRE, None)]),
 '9_letra': ('Letra mínima sem ficar gigante', 'Só o que está abaixo do mínimo sobe para 11 px (celular) / 12 px (PC). Todo o resto fica igual — nada aumenta além disso.',
   ".sel1.nv{font-size:11px!important;text-transform:none!important;letter-spacing:.02em!important}@media (min-width:900px){.hlb,.hatt small,.ulin,.sel1.nv,.med span{font-size:12px!important}}", "",
   [('Celular · catálogo', '?r=armazones', 390, 520, None, None), ('PC · peça (medidas)', '?r=armazones', 1440, 900, ABRE, None)]),
 '10_toque': ('Área de toque maior sem mudar o visual', 'O desenho continua igual; a área que o dedo alcança cresce por fora (até 44 px). Em rosa: a área nova de toque (só no esboço).',
   ".lftap{position:relative}.lftap::after{content:'';position:absolute;inset:-8px -6px;border-radius:10px;background:rgba(214,51,132,.14);outline:1px dashed rgba(214,51,132,.6)}",
   "()=>{const g=document.querySelector('.lfgf');const L=[...document.querySelectorAll('.navb,.vback,.lfgf,.lfgen button,.pgcr button,.fbtn,.hdots button,.hdot')].concat(g?[...g.parentElement.querySelectorAll('button')]:[]);L.forEach(e=>e.classList.add('lftap'))}",
   [('Celular · catálogo (filtros)', '?r=armazones', 390, 400, None, None), ('Celular · Início (bolinhas)', '', 390, 620, None, None)]),
 '11_selos': ('Selos de confiança visíveis', 'Delivery · Pago seguro · Retiro viram uma faixa clara com ícone de 20 px e texto de 13 px — o argumento de venda aparece de verdade.',
   ".htr{display:grid!important;grid-template-columns:repeat(3,1fr);gap:8px;background:#fff;border:1px solid #eadde5;border-radius:16px;padding:12px 10px!important;margin:12px 0!important}.htr span{display:flex!important;flex-direction:column;align-items:center;gap:4px;font-size:12px!important;color:#5b4a56!important;text-align:center;line-height:1.25}.htr b{font-size:13px!important;color:#2a1a28!important}.htr svg{width:20px!important;height:20px!important;color:#8d3a69}@media (min-width:900px){.htr{grid-template-columns:repeat(3,auto);justify-content:center;gap:48px}.htr span{flex-direction:row;gap:8px;font-size:13px!important}}",
   "", [('Celular · Início', '', 390, 760, None, None), ('PC · Início', '', 1440, 780, None, None)]),
 '13_densidade': ('Mais peças por tela no catálogo (cuidado)', 'Foto 5:4 em vez de 1:1 e respiro menor: cada fileira fica ~35 px mais baixa (cabe 1 fileira a mais a cada 3 telas). Os óculos ficam do mesmo tamanho: a foto só perde o branco de cima e de baixo.',
   "#grid .ph{aspect-ratio:5/4!important}#grid .ph img{object-fit:cover!important;width:100%!important;height:100%!important}#grid .card .info{padding-top:6px!important}#grid{gap:10px!important}", "",
   [('Celular · catálogo', '?r=armazones', 390, 844, None, None)]),
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
    Wt = max(1500, max(b[1] for b in blocos) + 80); Ht = 190 + sum(b[2] + 90 for b in blocos)
    B = Image.new('RGB', (Wt, Ht), '#ece6ea'); d = ImageDraw.Draw(B)
    d.text((40, 30), 'S209 · ' + tit, font=F(50, 1), fill='#2a1a28')
    import textwrap
    for n, ln in enumerate(textwrap.wrap(sub, 95)): d.text((40, 100 + n * 36), ln, font=F(28), fill='#5b4a56')
    y = 190 + 36 * max(0, len(textwrap.wrap(sub, 95)) - 1)
    for r, bw, bh, pos in blocos:
        d.text((40, y), r, font=F(32, 1), fill='#2a1a28')
        for im, dx, dy, t, c in pos:
            d.text((40 + dx, y + dy - 6), t, font=F(26, 1), fill=c); B.paste(im, (40 + dx, y + dy + 30))
        y += bh + 90
    B.save(OUT + k + '.jpg', quality=86)
    print('ok', k)
if __name__ == '__main__':
    for k in (sys.argv[1:] or list(IDEIAS)): faz(k)

"""IDEIAS 09r · o Comprar fosco × acetinado (a partir do 09o P1 em tons mais suaves (a partir do 09n "menos é mais"): só a palavra, sem costura, ícone ou preço; antes: 09m a cor do logo suavizada (contraste conferido ≥ 4,5); antes: 09l N3: a delicadeza do N2 com a cor do logo cheia (assinatura, como o azul Tiffany); antes: 09j N refinado com o estudo das marcas de luxo com cor própria (Rare Beauty, Cartier, Tiffany, Van Cleef), na cor do logo #7c486c (a partir do 09g), na página da peça REAL (pacote aprovado /tmp/a8k :8762, sem evento).
Cada proposta é um CSS curto aplicado na mesma tela; recorta a linha de compra (quantidade + Comprar). Saída: esboco-09r-fosco-acetinado.jpg"""
import os, sys
sys.path.insert(0, '/home/claude/lafouch/work/ideias/09-botoes')
src = open('/home/claude/lafouch/work/ideias/09-botoes/scan.py').read().split('JS = r')[0].replace("'http://localhost:8751'", "'http://localhost:8762'")
exec(src)
from PIL import Image, ImageDraw, ImageFont
B = 'html body:not(#_a):not(#_b) .bb.p'
LIMPA = 'html body .wa,html body #wa,html body .waf,html body [class*=wafl]{visibility:hidden!important}' + B + '{box-shadow:none!important;transform:none!important}' + B + ' .shn{display:none!important}'
def m(bg, fg):
    return LIMPA + B + '{background:%s!important;color:%s!important;font:500 13px Inter,system-ui,sans-serif!important;letter-spacing:.18em!important;text-transform:uppercase!important;padding:0 24px!important;justify-content:center!important;box-shadow:none!important;border:0!important}' % (bg, fg) + B + ' em,' + B + ' small{display:none!important}'
P = [
 ('Fosco (como está)', 'cor do logo suave chapada (#7f5773)', m('#7f5773','#fff')),
 ('Acetinado', 'a mesma cor clareando bem de leve no meio, como cetim; sem reflexo', m('radial-gradient(130% 220% at 50% 35%,#8d6683 0%,#7f5773 52%,#73506a 100%)','#fff')),
 ('Acetinado mais leve', 'metade do efeito: quase fosco, com um respiro no centro', m('radial-gradient(130% 220% at 50% 40%,#86607c 0%,#7f5773 55%,#79546f 100%)','#fff')),
 ('Acetinado · ao tocar', 'escurece de leve, o cetim continua', m('radial-gradient(130% 220% at 50% 35%,#7b5a73 0%,#6f4a65 52%,#64435c 100%)','#fff')),
]
tela = [t for t in RS.TELAS if t['nome'] == 'Peça'][0]
cortes = []
with sync_playwright() as pw:
    b = sim.navegador(pw)
    c = sim.contexto(b, 390, 844, toque=True, movimento=False, csp_livre=False, camera=True)
    c.add_init_script(C.INIT); c.add_init_script(DATA); fontes(c)
    # o config real está com ativo:false (site em manutenção agora); no esboço, a loja aberta e sem evento
    c.route('**/documents/config/site**', lambda r, q=None: r.fulfill(status=200, content_type='application/json', body='{"name":"x/config/site","fields":{"ativo":{"booleanValue":true}}}'))
    pg = c.new_page()
    for _ in range(4):
        RS.vai(pg, URL, tela); pg.wait_for_timeout(1500)
        if pg.query_selector('.bb.p'): break
        print('catálogo não carregou, de novo')
    pg.evaluate("()=>document.querySelector('.bb.p').scrollIntoView({block:'center'})"); pg.wait_for_timeout(500)
    for i, (n, d, css) in enumerate(P):
        pg.evaluate("()=>{const m=document.querySelector('.bb.p small');if(m&&!m.dataset.o)m.dataset.o=m.textContent;if(m)m.textContent=m.dataset.o}")
        if i>=0: pg.evaluate("()=>{const m=document.querySelector('.bb.p small');if(m)m.textContent=m.dataset.o.replace(/^\\s*·\\s*/,'')}")
        pg.evaluate("c=>{let s=document.getElementById('v9g');if(!s){s=document.createElement('style');s.id='v9g';document.head.appendChild(s)}s.textContent=c}", css); pg.wait_for_timeout(300)
        r = pg.evaluate("()=>{const e=document.querySelector('.buy').getBoundingClientRect();return [e.left,e.top,e.right,e.bottom]}")
        fn = '/tmp/c9r_%d.png' % i; pg.screenshot(path=fn, clip={'x': 0, 'y': r[1] - 110, 'width': 390, 'height': r[3] - r[1] + 150}); cortes.append(fn)
    b.close()
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; f1, f2 = ImageFont.truetype(F.replace('.ttf', '-Bold.ttf'), 24), ImageFont.truetype(F, 17)
ims = [Image.open(x).convert('RGB') for x in cortes]; w, h = ims[0].size; S = 2
cols = 2; rows = 2; g = 28
W = Image.new('RGB', (cols * (w + g) + g, 80 + rows * (h + 130)), 'white'); dr = ImageDraw.Draw(W)
dr.text((g, 18), 'Comprar · fosco × acetinado (peça real, celular)', font=f1, fill='#141414')
for i, im in enumerate(ims):
    x = g + (i % cols) * (w + g); y = 70 + (i // cols) * (h + 130)
    dr.text((x, y), P[i][0], font=f1, fill='#7c486c')
    import textwrap; dr.text((x, y + 30), '\n'.join(textwrap.wrap(P[i][1], 40)), font=f2, fill='#6b6763')
    W.paste(im, (x, y + 112)); dr.rectangle([x - 1, y + 111, x + w, y + 112 + h], outline='#ddd')
W.save('esboco-09r-fosco-acetinado.jpg', quality=90); print(W.size)

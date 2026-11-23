"""IDEIAS 11 · formato de luxo do botão (pílula, reto, quase reto, lente, finos) sobre a cor oficial acetinada (:8763); base: 09r (a partir do 09o P1 em tons mais suaves (a partir do 09n "menos é mais"): só a palavra, sem costura, ícone ou preço; antes: 09m a cor do logo suavizada (contraste conferido ≥ 4,5); antes: 09l N3: a delicadeza do N2 com a cor do logo cheia (assinatura, como o azul Tiffany); antes: 09j N refinado com o estudo das marcas de luxo com cor própria (Rare Beauty, Cartier, Tiffany, Van Cleef), na cor do logo #7c486c (a partir do 09g), na página da peça REAL (pacote aprovado /tmp/a8k :8763, sem evento).
Cada proposta é um CSS curto aplicado na mesma tela; recorta a linha de compra (quantidade + Comprar). Saída: esboco-11-formato.jpg"""
import os, sys
sys.path.insert(0, '/home/claude/lafouch/work/ideias/09-botoes')
src = open('/home/claude/lafouch/work/ideias/09-botoes/scan.py').read().split('JS = r')[0].replace("'http://localhost:8751'", "'http://localhost:8763'")
exec(src)
from PIL import Image, ImageDraw, ImageFont
B = 'html body:not(#_a):not(#_b) .bb.p'
LIMPA = 'html body .wa,html body #wa,html body .waf,html body [class*=wafl]{visibility:hidden!important}' + B + '{box-shadow:none!important;transform:none!important}' + B + ' .shn{display:none!important}'
R = 'html body:not(#_a):not(#_b) '
def f(rad, h=48, ls='.18em', fs=13, extra=''):
    return ('html body .wa{visibility:hidden!important}' + R + '.bb.p{border-radius:%s!important;height:%dpx!important;min-height:%dpx!important;letter-spacing:%s!important;font-size:%dpx!important;%s}' % (rad, h, h, ls, fs, extra)
            + R + '.buyrow .mq{border-radius:%s!important;height:%dpx!important}' % (rad, h) + R + '.buyrow .mq button{border-radius:%s!important}' % rad)
P = [
 ('A · Pílula (como está)', 'redonda nas pontas; a da família aprovada', f('999px')),
 ('B · Reto', 'canto vivo, como Cartier, Chanel e LOEWE: o mais "joalheria"', f('0')),
 ('C · Quase reto', 'canto de 3 px, como a Bottega: firme, mas não corta', f('3px')),
 ('D · Lente', 'canto de 14 px, o desenho de uma lente de óculos: o nosso', f('14px')),
 ('E · Pílula fina', 'pílula mais baixa (44 px) e mais espaçada: mais leve e elegante', f('999px', 44, '.22em', 12)),
 ('F · Lente fina', 'a lente (12 px no botão mais baixo), mais baixa e espaçada', f('12px', 44, '.22em', 12)),
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
        pass
        pg.evaluate("c=>{let s=document.getElementById('v9g');if(!s){s=document.createElement('style');s.id='v9g';document.head.appendChild(s)}s.textContent=c}", css); pg.wait_for_timeout(300)
        r = pg.evaluate("()=>{const e=document.querySelector('.buy').getBoundingClientRect();return [e.left,e.top,e.right,e.bottom]}")
        fn = '/tmp/c11_%d.png' % i; pg.screenshot(path=fn, clip={'x': 0, 'y': r[1] - 110, 'width': 390, 'height': r[3] - r[1] + 150}); cortes.append(fn)
    b.close()
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; f1, f2 = ImageFont.truetype(F.replace('.ttf', '-Bold.ttf'), 24), ImageFont.truetype(F, 17)
ims = [Image.open(x).convert('RGB') for x in cortes]; w, h = ims[0].size; S = 2
cols = 3; rows = 2; g = 28
W = Image.new('RGB', (cols * (w + g) + g, 80 + rows * (h + 130)), 'white'); dr = ImageDraw.Draw(W)
dr.text((g, 18), 'Formato do botão · cor oficial acetinada (peça real, celular)', font=f1, fill='#141414')
for i, im in enumerate(ims):
    x = g + (i % cols) * (w + g); y = 70 + (i // cols) * (h + 130)
    dr.text((x, y), P[i][0], font=f1, fill='#7c486c')
    import textwrap; dr.text((x, y + 30), '\n'.join(textwrap.wrap(P[i][1], 40)), font=f2, fill='#6b6763')
    W.paste(im, (x, y + 112)); dr.rectangle([x - 1, y + 111, x + w, y + 112 + h], outline='#ddd')
W.save('esboco-11-formato.jpg', quality=90); print(W.size)

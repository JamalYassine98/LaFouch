"""IDEIAS 10 · a cor oficial (CMYK C47 M91 Y29 K8 ≈ #943d6f) acetinada nas telas reais (Hoje :8762 × Proposta :8763); base: 09 parte 2 "como fica no final": as telas reais, celular 390, sem evento, Hoje (:8750 pacote aprovado) × Proposta (:8751 + botões v3).
Foto limpa de cada tela (sem as caixas do comparador), rolada até os botões. Saída: esboco-09d-telas-*.jpg"""
import os
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scan.py')).read().split('JS = r')[0]
exec(src)
from PIL import Image, ImageDraw, ImageFont
TELAS = [('Peça', '.bb.p'), ('Aviso adicionado', None), ('Carrinho', '.cartp .cs-b'), ('Entrar', None), ('Minha conta', '.bsair'),
         ('Aviso de cancelar', None), ('Formato do rosto', None), ('Comparar', None), ('Mapa', None), ('Início', '.p1'), ('Atacado', None), ('Pagar pedido', '[data-pgc2]')]
fotos = {}
with sync_playwright() as pw:
    b = sim.navegador(pw)
    for nome, alvo in TELAS:
        tela = [t for t in RS.TELAS if t['nome'] == nome][0]
        for lado, url in (('hoje', 'http://localhost:8762'), ('prop', 'http://localhost:8763')):
            c = sim.contexto(b, 390, 844, toque=True, movimento=False, csp_livre=False, camera=True)
            c.add_init_script(C.INIT); c.add_init_script(DATA)
            if tela.get('logada'): c.add_init_script(RS.LOGADA)
            c.route('**cloudfunctions.net/**', lambda r, q=None: r.fulfill(status=200, content_type='application/json', body=RS.NUVEM))
            c.route('**identitytoolkit**', lambda r, q=None: r.fulfill(status=200, content_type='application/json', body='{"users":[{"emailVerified":true,"email":"maria@exemplo.com"}]}'))
            fontes(c); pg = c.new_page(); RS.vai(pg, url, tela); pg.wait_for_timeout(900)
            if alvo:
                pg.evaluate("s=>{const e=document.querySelector(s);if(e)e.scrollIntoView({block:'center'})}", alvo); pg.wait_for_timeout(400)
            fn = '/tmp/f10_%s_%s.png' % (nome.replace(' ', '_'), lado); pg.screenshot(path=fn); fotos[(nome, lado)] = fn; c.close()
        print(nome)
    b.close()
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
f1, f2 = ImageFont.truetype(F.replace('.ttf', '-Bold.ttf'), 26), ImageFont.truetype(F, 20)
def prancha(lista, saida, titulo):
    w, h, g = 390, 844, 24; cols = 3; par = 2 * w + 12
    linhas = (len(lista) + cols - 1) // cols
    W = Image.new('RGB', (cols * par + (cols + 1) * g, 90 + linhas * (h + 60) + g), 'white'); d = ImageDraw.Draw(W)
    d.text((g, 20), titulo, font=f1, fill='#141414'); d.text((g, 56), 'Celular · sem evento · cada par: Hoje (esq.) × Proposta (dir.)', font=f2, fill='#6b6763')
    for i, nome in enumerate(lista):
        x = g + (i % cols) * (par + g); y = 90 + (i // cols) * (h + 60)
        d.text((x, y + 8), nome + '  ·  Hoje', font=f2, fill='#6b6763'); d.text((x + w + 12, y + 8), 'Proposta', font=f2, fill='#8d3a69')
        W.paste(Image.open(fotos[(nome, 'hoje')]).convert('RGB'), (x, y + 40)); W.paste(Image.open(fotos[(nome, 'prop')]).convert('RGB'), (x + w + 12, y + 40))
        d.rectangle([x - 1, y + 39, x + w, y + 40 + h], outline='#ddd'); d.rectangle([x + w + 11, y + 39, x + par, y + 40 + h], outline='#8d3a69', width=2)
    W.save(saida, quality=86); print(saida, W.size)
N = [t[0] for t in TELAS]
prancha(N[:6], '../10-cores/esboco-10-telas-compra-conta.jpg', 'Cor oficial da marca, acetinada (1/2) · comprar e conta')
prancha(N[6:], '../10-cores/esboco-10-telas-descobrir.jpg', 'Cor oficial da marca, acetinada (2/2) · descobrir, mapa, atacado, pagar')

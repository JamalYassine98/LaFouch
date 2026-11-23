"""IDEIAS 09f · a proposta única "Pílula La Fouch" (a partir do 09e) de identidade dos botões, nas telas reais (celular, sem evento).
Linhas: Hoje (:8750) · A vinho liso (:8752) · B degradê só no dinheiro (:8753) · C degradê em todo principal (:8754).
Saída: esboco-09f-pilula-la-fouch.jpg"""
import os
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scan.py')).read().split('JS = r')[0]
exec(src)
from PIL import Image, ImageDraw, ImageFont
TELAS = [('Peça', '.bb.p'), ('Aviso adicionado', None), ('Carrinho', '.cartp .cs-b'), ('Entrar', None), ('Formato do rosto', None), ('Atacado', None), ('Início', '.p1'), ('Comparar', None)]
LIN = [('Hoje', 'http://localhost:8750', '#6b6763'), ('Proposta · Pílula La Fouch', 'http://localhost:8755', '#8d3a69')]
fotos = {}
with sync_playwright() as pw:
    b = sim.navegador(pw)
    for nome, alvo in TELAS:
        tela = [t for t in RS.TELAS if t['nome'] == nome][0]
        for i, (_, url, _) in enumerate(LIN):
            c = sim.contexto(b, 390, 844, toque=True, movimento=False, csp_livre=False, camera=True)
            c.add_init_script(C.INIT); c.add_init_script(DATA)
            if tela.get('logada'): c.add_init_script(RS.LOGADA)
            c.route('**cloudfunctions.net/**', lambda r, q=None: r.fulfill(status=200, content_type='application/json', body=RS.NUVEM))
            c.route('**identitytoolkit**', lambda r, q=None: r.fulfill(status=200, content_type='application/json', body='{"users":[{"emailVerified":true,"email":"maria@exemplo.com"}]}'))
            fontes(c); pg = c.new_page(); RS.vai(pg, url, tela); pg.wait_for_timeout(900)
            if alvo: pg.evaluate("s=>{const e=document.querySelector(s);if(e)e.scrollIntoView({block:'center'})}", alvo); pg.wait_for_timeout(400)
            fn = '/tmp/f9f_%s_%d.png' % (nome.replace(' ', '_'), i); pg.screenshot(path=fn); fotos[(nome, i)] = fn; c.close()
        print(nome)
    b.close()
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
f1, f2 = ImageFont.truetype(F.replace('.ttf', '-Bold.ttf'), 30), ImageFont.truetype(F, 22)
w, h, g = 390, 844, 20
W = Image.new('RGB', (g + len(TELAS) * (w + g), 110 + len(LIN) * (h + 56)), 'white'); d = ImageDraw.Draw(W)
d.text((g, 20), 'Botões · Pílula La Fouch — a marca fala pela letra; o vinho só no que leva ao dinheiro', font=f1, fill='#141414')
d.text((g, 62), 'Celular · sem evento · vinho: Comprar, Prosseguir, Finalizar, Abrir a câmera, Solicitar orçamento · Sair da conta, Excluir e Cancelar pedido como aprovados', font=f2, fill='#6b6763')
for j, (rot, _, cor) in enumerate(LIN):
    y = 110 + j * (h + 56); d.text((g, y + 10), rot, font=f1, fill=cor)
    for i, (nome, _) in enumerate(TELAS):
        x = g + i * (w + g)
        if j == 0: d.text((x + 260 - len(nome) * 6, y + 18), nome, font=f2, fill='#6b6763')
        W.paste(Image.open(fotos[(nome, j)]).convert('RGB'), (x, y + 50)); d.rectangle([x - 1, y + 49, x + w, y + 50 + h], outline=cor if j else '#ddd', width=2 if j else 1)
W.save('esboco-09f-pilula-la-fouch.jpg', quality=85); print(W.size)

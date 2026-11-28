"""Esboço anotado do Início com TODOS os pontos aprovados (dono 28/11 06:22): cada ponto aponta para o bloco a que se refere.
uso: python3 anota.py saida_prefixo   (PC: LF_PC=1440x900)"""
import os, sys, textwrap
AQ = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, AQ)
import roda
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont

PONTOS = [  # (seletor, título, texto)
 ('#lfxcapa', 'CAPA — revista de UMA peça', 'Cobre a tela inteira. A foto acompanha a peça que vende (a modelo usa exatamente aquela peça; o toque leva a ela). Não troca sozinha: muda quando o cliente desliza ou quando muda o produto da campanha. Nome do Semp + frase.'),
 ('.lfx-fers', 'FAIXA COLADA NA CAPA — ferramentas', 'Grudada na capa: sem vão, mesma largura (o choque vem da divisão, não da cor). Tinta escura continua o véu da foto. Ferramenta = ação: ícone fino aprovado + nome com › . Provador: a câmera lê o rosto e mostra primeiro o que combina. Ícones sempre os mesmos.'),
 ('.lfx-fers .htr', 'SERVIÇOS — 2º andar da faixa', 'Serviço é informação, não ferramenta: texto pequeno, sem ícone e sem › . Rótulo na cor do texto (vinho só em ação).'),
 ('.lfx-gen', 'FEMININO | MASCULINO — GUIA', 'Foto FIXA: nunca troca de modelo (guia não está ligado a produto). Sem título de seção; o nome com › diz que leva a outra tela. PC: retratos 4:5 centrados.'),
 ('.hg.lfx-grande', 'ACABOU DE CHEGAR — vitrine (função)', 'Cada peça numa folha branca. Nome do Semp + "Cor · preço" (cor em uma palavra: Rosé, Ônix, Cristal…). Sem descrição técnica. Bolinhas de cor só com 2+ cores. A foto acompanha a peça; a lista muda quando chegam peças.'),
 ('.lfx-visto', 'PEÇA NO MODELO — revista (Lucien)', 'Retrato e peça na MESMA folha (nunca duas imagens soltas). Nome + frase do Semp + "Âmbar · preço". Sem legenda "Ele usa…", sem botão: a folha é o link. Se a peça mudar, muda a foto.'),
 ('.lfx-rev', 'PARA CADA USO — GUIA', 'Foto FIXA (leva a categorias, não a uma peça). Bloco ainda NÃO revisado com o dono; fotos provisórias.'),
 ('.hg.lfx-grade', 'OS MAIS PEDIDOS — vitrine', 'Mesma família do cartão de peça (folha, nome do Semp, "Cor · preço"). A foto acompanha a peça.'),
 ('.lfx-mov', 'COMO FICA NO ROSTO — ligado à peça', 'Vídeo de cada peça (do Semp): muda junto com a peça.'),
 ('.lfx-loj', 'PARA LOJISTAS — GUIA', 'Imagem FIXA. Cartão de campanha, um título, linha curta/longa, botão contornado.'),
 ('section.hnews', 'NEWSLETTER', 'Sem degradê, espaços 48, sem itálico de enfeite.'),
 ('.lfft', 'RODAPÉ', 'A Ajuda já mora aqui (Dúvidas frequentes · Dicas e cuidados · Entre em contato). "Como chegar ›" na cor oficial #943D6F.'),
 ('a.wa', 'WHATSAPP', 'Sempre no MESMO lugar e tamanho em todas as páginas (canto de baixo à direita, 16 da borda). Nunca some ao rolar. Espaço no fim da página para não tampar nada.'),
]
GERAL = ['Cor oficial #943D6F num lugar só · espaços só 8/16/24/32/48 · Fraunces nos nomes, Inter no texto.',
         'Revista no CONTEÚDO (capa, peça no modelo); FUNÇÃO clara no resto (vitrine, guias, ferramentas, serviços).',
         'Todas as fotos são provisórias: as definitivas vêm do Semp (Flow).']

out = sys.argv[1]; PC = bool(os.environ.get('LF_PC'))
with sync_playwright() as pw:
    b, pg = roda.abre(pw); pg.evaluate(open(os.path.join(AQ, 'proposta.js')).read()); pg.evaluate(roda.FORCA); pg.wait_for_timeout(800)
    for yy in range(0, 12000, 400): pg.evaluate(f'scrollTo(0,{yy})'); pg.wait_for_timeout(60)   # carrega as fotos preguiçosas
    pg.wait_for_timeout(600); pg.evaluate('scrollTo(0,0)'); pg.wait_for_timeout(400)
    # marcadores DENTRO da página (cores únicas, quadrados sem serrilhado): se a foto da página inteira mexer o layout, eles se movem junto com o bloco
    for i, (sel, t, x) in enumerate(PONTOS):
        pg.evaluate(f"""(()=>{{const e=[...document.querySelectorAll('{sel}')].find(x=>x.offsetParent!==null||getComputedStyle(x).position=='fixed');if(!e)return;
          if(getComputedStyle(e).position=='static')e.style.position='relative';
          const m=document.createElement('i');m.style.cssText='position:absolute;left:6px;top:6px;width:16px;height:16px;z-index:2147483647;background:rgb(255,0,{40+i*12});display:block';e.appendChild(m)}})()""")
    pg.wait_for_timeout(300)
    pg.screenshot(path='/tmp/_anota.png', full_page=True); b.close()
import numpy as np
_a = np.asarray(Image.open('/tmp/_anota.png').convert('RGB')).astype(int)
_k0 = _a.shape[1] / (1440 if PC else 390)
rects = []
for i in range(len(PONTOS)):
    m = (_a[:, :, 0] == 255) & (_a[:, :, 1] == 0) & (_a[:, :, 2] == 40 + i * 12)
    ys, xs = np.nonzero(m)
    rects.append([xs.min() / _k0 - 6, ys.min() / _k0 - 6, 0, 0] if len(xs) else None)
shot = Image.open('/tmp/_anota.png').convert('RGB'); k = shot.width / (1440 if PC else 390)
esc = 0.5 if PC else 1.0
shot = shot.resize((int(shot.width * esc), int(shot.height * esc))); k *= esc
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
ft = ImageFont.truetype(FB, 26); fx = ImageFont.truetype(F, 22); fn = ImageFont.truetype(FB, 24)
COLW = 820; PAD = 48; W = shot.width + PAD * 2 + COLW + PAD; HEAD = 220
# caixas de texto
caixas = []
for (s, t, x), r in zip(PONTOS, rects):
    if not r: continue
    ay = int(r[1] * k) + 24
    linhas = textwrap.wrap(x, 62); h = 36 + 30 * len(linhas) + 24
    caixas.append([ay, h, t, linhas, r])
caixas.sort(key=lambda c: c[0])
y = PAD + HEAD
for c in caixas:
    c.append(max(c[0] - 16, y)); y = c[-1] + c[1] + 16
H = max(shot.height + PAD * 2 + HEAD, y + PAD)
o = Image.new('RGB', (W, H), '#ece6ea'); d = ImageDraw.Draw(o)
d.text((PAD, 40), ('PC 1440' if PC else 'Celular 390') + ' — Início: o que foi aprovado e o que eu entendi', fill='#2a1f27', font=ft)
for j, g in enumerate(GERAL): d.text((PAD, 96 + 34 * j), '• ' + g, fill='#6b5a66', font=fx)
o.paste(shot, (PAD, PAD + HEAD))
X0 = PAD * 2 + shot.width
for i, (ay, h, t, linhas, r, by) in enumerate(caixas, 1):
    ex = PAD + int(r[0] * k); ey = PAD + HEAD + int(r[1] * k)
    # marcador no bloco
    d.ellipse((ex + 4, ey + 4, ex + 44, ey + 44), fill='#943d6f'); d.text((ex + 24, ey + 24), str(i), fill='#fff', font=fn, anchor='mm')
    # linha até a caixa
    d.line((ex + 44, ey + 24, X0 - 8, ey + 24), fill='#943d6f', width=2); d.line((X0 - 8, ey + 24, X0, by + 24), fill='#943d6f', width=2)
    d.rounded_rectangle((X0, by, X0 + COLW, by + h), 12, fill='#fff', outline='#d9c6d1')
    d.text((X0 + 20, by + 14), f'{i}. {t}', fill='#943d6f', font=ft)
    for j, l in enumerate(linhas): d.text((X0 + 20, by + 50 + 30 * j), l, fill='#2a1f27', font=fx)
o.save(out + '.jpg', quality=85)
# rodapé de regras gerais num arquivo à parte é desnecessário: vão no topo da coluna
print(o.size)

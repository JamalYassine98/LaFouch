# ARGUS · Parte 6 · o MAPA das telas do app para o dono escolher o próximo lote de plantas.
# O explorador acha cada lugar do app (as 5 abas e o que abre a partir delas, com o dedo); para cada um: a foto de hoje e o estado
# da planta (pendente no lote 1 · sem planta). O dono diz, por tela: "planta = hoje" (não há aprovado diferente) ou qual aprovado
# falta nela (aí a planta sai do esboço consolidado). Nada vira planta sem a resposta dele.
import os, sys, json, math
A = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, os.path.join(A, 'motor'))
import explorador, planta, abrir, sim
from PIL import Image, ImageDraw, ImageFont
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 22); FB = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 24)
SAIDA = os.path.join(A, 'plantas', 'lotes')
def roda(profundidade=1, max_toques=160):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        X = explorador.explora(pw, profundidade=profundidade, max_toques=max_toques, cobertura=False)
        M = explorador.mapa(X['lugares'], planta.P_APP); nav = sim.navegador(pw); fotos = []
        for k, (nome, v) in enumerate(X['lugares'].items()):
            b, pg = abrir.abre(pw, navegador=nav, tema='escuro'); explorador.anda(pg, v['caminho']); pg.evaluate('()=>window.__argus.parar()')
            f = '/tmp/argus_mapa_%03d.png' % k; pg.screenshot(path=f); b.close(); fotos.append((nome, M[nome][1], f, v['nivel']))
        nav.close()
    json.dump([(n, e, nv) for n, e, _, nv in fotos], open(os.path.join(SAIDA, 'mapa_app.json'), 'w'), ensure_ascii=False, indent=1)
    return fotos
def folhas(fotos, por=12):
    """Folhas de 12 telas (4 × 3), cada uma com número, nome e estado da planta."""
    out = []
    for p in range(math.ceil(len(fotos) / por)):
        G = fotos[p * por:(p + 1) * por]; tw, th = 360, 780; W = 4 * (tw + 30) + 30; H = math.ceil(len(G) / 4) * (th + 110) + 30
        o = Image.new('RGB', (W, H), (24, 26, 32)); d = ImageDraw.Draw(o)
        for k, (nome, est, f, nv) in enumerate(G):
            x = 30 + (k % 4) * (tw + 30); y = 30 + (k // 4) * (th + 110); n = p * por + k + 1
            im = Image.open(f).convert('RGB'); im = im.resize((tw, int(im.height * tw / im.width))).crop((0, 0, tw, th)); o.paste(im, (x, y + 76))
            d.text((x, y), '%d · %s' % (n, nome[:30]), font=FB, fill=(235, 235, 240))
            cor = (120, 200, 140) if est == 'aprovada' else (229, 138, 176) if est == 'pendente' else (240, 200, 90)
            d.text((x, y + 36), 'planta: %s' % est, font=F, fill=cor)
        f = os.path.join(SAIDA, 'mapa_app_%d.jpg' % (p + 1)); o.save(f, quality=80); out.append(f)
    return out
if __name__ == '__main__':
    print('\n'.join(folhas(roda())))

# ARGUS · prova da Parte 0 (chão firme): (1) a loja de teste é do Argus e o relógio está parado; (2) cada cenário monta a loja certa;
# (3) a MESMA tela aberta duas vezes sai igual, pixel por pixel, em aparelhos e temas diferentes — o que mudar é ruído e é apontado.
import os, sys, json
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor'))
import abrir, loja, aparelhos
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
OUT = '/tmp/argus_p0'; os.makedirs(OUT, exist_ok=True)
TELAS = [('Início', []), ('Preços › Regras', __import__('planta').precos('regras')),
         ('Fornecedores', ["()=>__LF.inicioGo('lotes')"])]
R = []
def ok(nome, cond, d=''): R.append((nome, bool(cond), d)); print(('ok    ' if cond else 'FALHA ') + nome + (' · ' + d if d else ''))
with sync_playwright() as pw:
    if not os.path.exists(loja.arquivo('normal')):
        b, pg = abrir.abre(pw, cenario=None); pg.wait_for_timeout(800); d = loja.grava_normal(pg); b.close()
        print('loja de teste "normal" gravada: %d linhas de peças · %d vendas' % loja.conta(d))
    # (1) relógio e loja
    b, pg = abrir.abre(pw)
    agora = pg.evaluate('()=>new Date().toISOString()')
    ok('relógio parado em 24/11/2026 15:00', agora.startswith('2026-11-24T18:00'), agora)
    sorte = pg.evaluate('()=>[Math.random(),Math.random()]'); b.close(); b, pg = abrir.abre(pw)
    ok('sorteio parado (a mesma sequência em toda abertura)', sorte == pg.evaluate('()=>[Math.random(),Math.random()]') and len(set(sorte)) == 2, '%.4f · %.4f' % tuple(sorte))
    n = pg.evaluate('()=>({i:__LF.S.items.length,s:(__LF.S.sales||[]).length})'); ni, ns = loja.conta(loja.cenario('normal'))
    ok('o app abriu com a loja do Argus', n['i'] == ni and n['s'] == ns, '%d peças · %d vendas (loja: %d · %d)' % (n['i'], n['s'], ni, ns))
    b.close()
    # (2) cenários
    for cen, quer in (('vazio', lambda i, s: i == 0 and s == 0), ('cheio', lambda i, s: (i, s) == loja.conta(loja.cenario('cheio')))):
        b, pg = abrir.abre(pw, cenario=cen); n = pg.evaluate('()=>({i:__LF.S.items.length,s:(__LF.S.sales||[]).length})'); b.close()
        ok('cenário %s monta a loja certa' % cen, quer(n['i'], n['s']), '%d peças · %d vendas' % (n['i'], n['s']))
    # (3) mesma tela duas vezes
    for ap in (aparelhos.DONO, 'celular 320', 'PC 1440'):
        for tema in ('escuro', 'claro'):
            for nome, passos in TELAS:
                fotos = []
                for vez in (1, 2):
                    b, pg = abrir.abre(pw, aparelho=ap, tema=tema)
                    for js in passos: pg.evaluate(js); pg.wait_for_timeout(900)
                    pg.wait_for_timeout(600); f = '%s/%s_%s_%s_%d.png' % (OUT, ap.replace(' ', ''), tema, nome.replace(' ', '').replace('›', ''), vez)
                    pg.screenshot(path=f, full_page=True); fotos.append(f); b.close()
                a, c = Image.open(fotos[0]).convert('RGB'), Image.open(fotos[1]).convert('RGB')
                if a.size != c.size: ok('igual 2× · %s · %s · %s' % (ap, tema, nome), False, 'tamanhos %s × %s' % (a.size, c.size)); continue
                bb = ImageChops.difference(a, c).getbbox()
                ok('igual 2× · %s · %s · %s' % (ap, tema, nome), bb is None, 'ruído em %s' % (bb,) if bb else '')
    # autoprova: a mesma comparação TEM de acusar uma diferença de 1 ponto plantada de propósito
    fotos = []
    for vez in (1, 2):
        b, pg = abrir.abre(pw); pg.wait_for_timeout(600)
        if vez == 2: pg.evaluate("()=>{const d=document.createElement('div');d.style.cssText='position:fixed;left:200px;top:400px;width:1px;height:1px;background:#f00;z-index:99999';document.body.appendChild(d)}")
        f = '%s/autoprova_%d.png' % (OUT, vez); pg.screenshot(path=f); fotos.append(f); b.close()
    bb = ImageChops.difference(Image.open(fotos[0]).convert('RGB'), Image.open(fotos[1]).convert('RGB')).getbbox()
    ok('autoprova: a comparação pega 1 ponto mudado de propósito', bb is not None, 'achou em %s' % (bb,) if bb else 'NÃO viu')
json.dump(R, open(OUT + '/resultado.json', 'w'), ensure_ascii=False, indent=1)
print('\n%d de %d ok' % (sum(1 for x in R if x[1]), len(R)))

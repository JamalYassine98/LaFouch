"""Comparador Hoje × Proposta (CLAUDE.md regra 11).

Uso:  python3 compara.py URL_HOJE URL_PROPOSTA [pasta_saida]

O que faz, em cada aparelho (celular, celular com letra 1,2×, tablet, PC) e em cada tela (Início, Catálogo, Peça):
  1. Abre Hoje ANTES e DEPOIS da Proposta. O que muda entre as duas aberturas de Hoje é ruído (relógio,
     contagem, sorteio) e é ignorado — sem lista fixa de exceções.
  2. Reconhece cada peça da tela pelo que ela É (etiqueta + texto + ordem), não pelo nome no código:
     renomear uma classe não vira "sumiu/apareceu"; a troca de classe aparece como "mudou".
  3. Lista toda diferença entre Hoje e Proposta:
       mudou de lugar ou tamanho (em relação à caixa-mãe: uma mudança não arrasta a tela inteira),
       mudou cor/fundo/letra/classe, apareceu, sumiu.
  4. Procura falhas na Proposta e diz se são NOVAS ou se já existiam Hoje — pelo medidor único (work/kit/mede.js:
       sobreposto, cortado, fora da tela, página larga, janela fora da tela, coberto, quebrou a linha, encosta na foto),
       rolando tudo o que rola (a página, o catálogo em #vscr, a peça na camada aberta).
  5. Gera um relatório (relatorio.json + texto) e uma imagem por tela com diferença (a faixa da tela onde ela está): Hoje × Proposta,
     com as diferenças marcadas (vermelho = falha nova, laranja = diferença).
"""
import sys, os, json
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
import sys as _s, os as _o; _s.path.insert(0, _o.path.join(_o.path.dirname(_o.path.abspath(__file__)), '..', '..', 'kit')); import sim, mede as M   # UM simulador e UM medidor (work/kit)

INIT = "try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')}catch(e){}"
LETRA = "document.addEventListener('DOMContentLoaded',()=>{document.documentElement.style.fontSize='120%'});"
APAR = [  # nome, largura, altura, celular, letra 1,2×
    ('celular', 386, 858, True, False),
    ('celular letra 1,2×', 386, 858, True, True),
    ('tablet', 768, 1024, True, False),
    ('PC', 1440, 900, False, False),
]
# as telas vêm do ROTEIRO ÚNICO (roteiro_site.py): plano das ferramentas, parte 1 (dono 22/11)
_s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__))); import roteiro_site as RS
TELAS = RS.TELAS
if _o.environ.get('CMP_SO_TRES'): TELAS = TELAS[:3]   # modo antigo (só Início, Catálogo e Peça)
if _o.environ.get('CMP_TELAS'): TELAS = [t for t in TELAS if t['nome'] in _o.environ['CMP_TELAS'].split(',')]   # só algumas (conferir um esboço)

def abre(b, url, ap, tela, foto=None):
    nome, w, h, mob, letra = ap
    c = sim.contexto(b, w, h, toque=mob, movimento=False, csp_livre=False, camera=True)
    c.add_init_script(INIT)
    if letra:
        c.add_init_script(LETRA)
    if tela.get('logada'):
        c.add_init_script(RS.LOGADA)
    c.route('**cloudfunctions.net/**', lambda r, q=None: r.fulfill(status=200, content_type='application/json', body=RS.NUVEM))
    c.route('**identitytoolkit**', lambda r, q=None: r.fulfill(status=200, content_type='application/json', body='{"users":[{"emailVerified":true,"email":"maria@exemplo.com"}]}'))
    pg = c.new_page()
    RS.vai(pg, url, tela)
    # rola tudo o que rola (a página, o catálogo em #vscr, a peça na camada) — o mesmo percurso do medidor
    fotos = []
    def parada(pg, k, y, r):
        if not foto: return
        fn = '%s_%d.png' % (foto[:-4], len(fotos))
        pg.screenshot(path=fn)
        fotos.append((fn, {e['id']: (e['rx'] - r['sx'], e['ry'] - r['sy'], e['rw'], e['rh']) for e in r['L']}))
    achados, onde = M.percorre(pg, parada)
    L = M.mede(pg)['L']   # as peças com tudo no começo (é por elas que Hoje e Proposta se comparam)
    c.close()
    return {'L': L, 'achados': achados, 'fotos': fotos, 'alto_janela': h, 'largura': w}


def falhas(T):
    """falhas da tela (os achados do medidor), cada uma com a sua identidade (para dizer se já existia Hoje)"""
    por = {e['id']: e for e in T['L']}
    F = {}
    for (regra, ids), a in T['achados'].items():
        F[(regra,) + ids] = tuple(por.get(i, {'id': i, 'nome': i}) for i in ids) or ({'id': '', 'nome': a['d']},)
    return F


def difs(H, P, ruido):
    h = {e['id']: e for e in H}
    q = {e['id']: e for e in P}
    out = []
    for k, e in q.items():
        if k not in h and k not in ruido:
            out.append(('apareceu', e['nome'], '', e, None))
    for k, e in h.items():
        if k not in q and k not in ruido:
            out.append(('sumiu', e['nome'], '', None, e))
    for k in h.keys() & q.keys():
        a, b = h[k], q[k]
        d = []
        for m, nm in (('x', 'esq'), ('y', 'topo'), ('w', 'larg'), ('h', 'alt')):
            if abs(a[m] - b[m]) > 1 and (k, m) not in ruido:
                d.append('%s %.0f→%.0f' % (nm, a[m], b[m]))
        for m in ('cor', 'fundo', 'letra', 'cls'):
            if a[m] != b[m] and (k, m) not in ruido:
                d.append('%s %s→%s' % ('classe' if m == 'cls' else m, a[m] or '—', b[m] or '—'))
        if d:
            out.append(('mudou', b['nome'], ', '.join(d), b, a))
    return out


def ruido_de(H1, H2):
    """o que muda entre duas aberturas de Hoje é ruído"""
    a = {e['id']: e for e in H1}
    b = {e['id']: e for e in H2}
    R = set(a.keys() ^ b.keys())
    for k in a.keys() & b.keys():
        for m in ('x', 'y', 'w', 'h'):
            if abs(a[k][m] - b[k][m]) > 1:
                R.add((k, m))
        for m in ('cor', 'fundo', 'letra', 'cls'):
            if a[k][m] != b[k][m]:
                R.add((k, m))
    return R


def faixa(T, marcas):
    """a foto da parada onde mais peças marcadas aparecem, e as marcas na posição daquela foto"""
    if not T['fotos']:
        return None, []
    def vistas(F):
        return [(F[1][e['id']], cor) for e, cor in marcas if e.get('id') in F[1] and -10 < F[1][e['id']][1] < T['alto_janela'] - 10 and F[1][e['id']][2] > 0]
    F = max(T['fotos'], key=lambda F: len(vistas(F)))
    return F[0], vistas(F)


def imagem(TH, TP, marcas_h, marcas_p, titulo, saida):
    fh, mh = faixa(TH, marcas_h or marcas_p)
    if not marcas_h:
        mh = []
    fp, mp = faixa(TP, marcas_p or marcas_h)
    if not marcas_p:
        mp = []
    if not fh or not fp:
        return
    f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
    def pinta(fn, M):
        I = Image.open(fn).convert('RGB')
        d = ImageDraw.Draw(I)
        for (x, y, w, h), cor in M:
            d.rectangle([x - 3, y - 3, x + w + 3, y + h + 3], outline=cor, width=4)
        return I
    a, b = pinta(fh, mh), pinta(fp, mp)
    W = a.width + b.width + 24
    H = max(a.height, b.height) + 44
    out = Image.new('RGB', (W, H), 'white')
    d = ImageDraw.Draw(out)
    d.text((8, 10), 'Hoje · ' + titulo, fill='black', font=f)
    d.text((a.width + 32, 10), 'Proposta · ' + titulo, fill='black', font=f)
    out.paste(a, (0, 44))
    out.paste(b, (a.width + 24, 44))
    if out.width > 1600:
        out = out.resize((1600, int(out.height * 1600 / out.width)))
    out.save(saida, quality=82)


def main():
    uh, up = sys.argv[1], sys.argv[2]
    pasta = sys.argv[3] if len(sys.argv) > 3 else 'saida'
    os.makedirs(pasta, exist_ok=True)
    rel = []
    VERM, LAR = (220, 20, 60), (245, 140, 0)
    with sync_playwright() as p:
        b = sim.navegador(p)
        for ap in APAR:
            for tela in TELAS:
                if tela.get('ap') == 'cp' and ap[0] not in ('celular', 'PC'): continue
                tag = (ap[0] + '_' + tela['nome']).replace(' ', '_').replace(',', '')
                fh, fp = os.path.join(pasta, tag + '_hoje.png'), os.path.join(pasta, tag + '_prop.png')
                H1 = abre(b, uh, ap, tela, fh)
                P = abre(b, up, ap, tela, fp)
                H2 = abre(b, uh, ap, tela)
                R = ruido_de(H1['L'], H2['L'])
                D = difs(H1['L'], P['L'], R)
                FH, FP = falhas(H1), falhas(P)
                novas = [k for k in FP if k not in FH]
                velhas = [k for k in FP if k in FH]
                rel.append({'aparelho': ap[0], 'tela': tela['nome'],
                            'falhas_novas': [[k[0]] + [e['nome'] for e in FP[k]] for k in novas],
                            'falhas_que_ja_existiam': [[k[0]] + [e['nome'] for e in FP[k]] for k in velhas],
                            'diferencas': [[t, n, d] for t, n, d, _, _ in D],
                            'ruido_ignorado': len(R)})
                if novas or D:
                    # na Proposta: falha nova em vermelho e diferença em laranja; em Hoje: a mesma peça onde ela estava
                    mp = [(e, VERM) for k in novas for e in FP[k]] + [(e, LAR) for t, n, d, e, _ in D if e]
                    mh = [(e, LAR) for t, n, d, _, e in D if e]
                    imagem(H1, P, mh, mp, ap[0] + ' · ' + tela['nome'], os.path.join(pasta, tag + '.jpg'))
                for T in (H1, P):
                    for fn, _ in T['fotos']:
                        os.remove(fn)
        b.close()
    json.dump(rel, open(os.path.join(pasta, 'relatorio.json'), 'w'), ensure_ascii=False, indent=1)
    tot = sum(len(r['falhas_novas']) for r in rel)
    print('RESULTADO:', 'REPROVADO — %d falha(s) nova(s)' % tot if tot else 'sem falha nova')
    for r in rel:
        print('== %s · %s — %d falha(s) nova(s), %d diferença(s), %d já existia(m), %d ruído(s) ignorado(s)' % (
            r['aparelho'], r['tela'], len(r['falhas_novas']), len(r['diferencas']),
            len(r['falhas_que_ja_existiam']), r['ruido_ignorado']))
        for f in r['falhas_novas']:
            print('   FALHA NOVA:', f[0], '|', '  ×  '.join(x[:60] for x in f[1:]))
        for t, n, d in r['diferencas'][:40]:
            print('   ', t, '|', n[:80], '|', d[:120])


if __name__ == '__main__':
    main()

# ARGUS · o comparador (Parte 2): o app × a PLANTA aprovada, peça por peça, pelo que APARECE na tela (não pelo nome do código).
# Medida exata, escrita só aqui (um lugar só): posição e tamanho ±1 px; cor, fundo, borda, raio e letra iguais; ícone com o mesmo desenho.
# Ruído: o app é aberto DUAS vezes; o que muda sozinho entre as duas aberturas não é escondido — vira "não conferido (muda sozinho)".
# Deslocamento em cascata: se tudo dali para baixo desce N px, aparece UMA vez ("a partir de X, tudo desce N px").
import os, sys
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor'))
import planta, aparelhos
TOL = 1.0   # px
CAMPOS = ('cor', 'fundo', 'borda', 'raio', 'letra')
def _nome(p):
    if p['tipo'] == 'icone': return 'ícone'
    return '“%s”' % (p['texto'][:40] or p['tipo'])
def _par(pl, ap):
    """Junta cada peça da planta com a peça do app que é a MESMA coisa: mesmo tipo e mesmo texto (ícone: mesmo desenho), a mais perto."""
    livres = list(range(len(ap))); pares = []; faltam = []
    for i, p in enumerate(pl):
        ch = (lambda q: q['tipo'] == p['tipo'] and (q.get('icone', {}).get('geo') == p.get('icone', {}).get('geo') if p['tipo'] == 'icone' else q['texto'] == p['texto']))
        cand = [j for j in livres if ch(ap[j])]
        if not cand and p['tipo'] == 'icone':   # ícone com outro desenho no mesmo lugar = ícone diferente (não falta)
            cand = [j for j in livres if ap[j]['tipo'] == 'icone' and abs(ap[j]['caixa'][0] - p['caixa'][0]) < 8 and abs(ap[j]['caixa'][1] - p['caixa'][1]) < 8]
        if not cand: faltam.append(p); continue
        j = min(cand, key=lambda j: abs(ap[j]['caixa'][0] - p['caixa'][0]) + abs(ap[j]['caixa'][1] - p['caixa'][1]))
        livres.remove(j); pares.append((p, ap[j]))
    return pares, faltam, [ap[j] for j in livres]
def compara(pl_pecas, app_pecas, ruido=()):
    """Devolve a lista de diferenças [(peça, o que, planta, app, onde)] — vazia = igual à planta. onde = a caixa [x, y, l, a] da peça
    no app (na planta, se ela falta no app): o relatório marca ali."""
    D = []; pares, faltam, sobram = _par(pl_pecas, app_pecas)
    rz = set(ruido)
    for p in faltam: D.append((_nome(p), 'falta (está na planta, não está no app)', p['caixa'], None, p['caixa']))
    for q in sobram: D.append((_nome(q), 'sobra (está no app, não está na planta)', None, q['caixa'], q['caixa']))
    desl = []
    for p, q in pares:
        if (p['tipo'], p['texto'], tuple(p['caixa'])) in rz: D.append((_nome(p), 'não conferido (muda sozinho no app)', None, None, q['caixa'])); continue
        dx, dy = q['caixa'][0] - p['caixa'][0], q['caixa'][1] - p['caixa'][1]
        dw, dh = q['caixa'][2] - p['caixa'][2], q['caixa'][3] - p['caixa'][3]
        if abs(dw) > TOL or abs(dh) > TOL: D.append((_nome(p), 'tamanho', p['caixa'][2:], q['caixa'][2:], q['caixa']))
        if abs(dx) > TOL or abs(dy) > TOL: desl.append((p['caixa'][1], _nome(p), round(dx, 1), round(dy, 1), q['caixa']))
        for c in CAMPOS:
            if p.get(c) != q.get(c): D.append((_nome(p), c, p.get(c), q.get(c), q['caixa']))
        if p['tipo'] == 'icone':
            if p['icone']['geo'] != q['icone']['geo']: D.append((_nome(p), 'desenho do ícone diferente', None, None, q['caixa']))
            if p['icone']['traco'] != q['icone']['traco'] or p['icone']['cor'] != q['icone']['cor']: D.append((_nome(p), 'traço/cor do ícone', (p['icone']['traco'], p['icone']['cor']), (q['icone']['traco'], q['icone']['cor']), q['caixa']))
    # cascata: peças em ordem de cima para baixo; um mesmo (dx,dy) que continua até o fim vira UMA diferença
    desl.sort(); k = 0
    while k < len(desl):
        y0, nm, dx, dy, cx = desl[k]; j = k
        while j + 1 < len(desl) and (desl[j + 1][2], desl[j + 1][3]) == (dx, dy): j += 1
        if j > k: D.append((nm, 'a partir daqui, %d peças deslocadas %+.1f px (lado) %+.1f px (altura)' % (j - k + 1, dx, dy), None, None, cx))
        else: D.append((nm, 'posição %+.1f px (lado) %+.1f px (altura)' % (dx, dy), None, None, cx))
        k = j + 1
    return D
def ruido(a, b):
    """Peças que mudam entre duas aberturas do app (devia ser nenhuma: relógio e loja são fixos)."""
    pares, faltam, sobram = _par(a, b)
    rz = [(p['tipo'], p['texto'], tuple(p['caixa'])) for p, q in pares if p != q] + [(p['tipo'], p['texto'], tuple(p['caixa'])) for p in faltam]
    return rz
def mesma_versao(pecas, de, para):
    """A versão do app é DADO, não desenho: o número da versão gravado na planta vira o da versão conferida (a planta não
    precisa ser regravada a cada publicação; uma versão errada na tela continua aparecendo como diferença)."""
    if not de or not para or de == para: return pecas
    return [dict(p, texto=p['texto'].replace(de, para)) if p.get('texto') and de in p['texto'] else p for p in pecas]
def confere(pw, pl, porta=None, temas=None):
    """Abre o app (2× por tema, para achar ruído) e compara com a planta. Devolve {tema: [diferenças]}."""
    out = {}
    for tema in (temas or list(pl['temas'])):
        tela = planta.tela_de(pl)
        L = []
        for vez in (1, 2):
            b, pg = planta._abre_tela(pw, tela, tema, porta); L.append(pg.evaluate(planta.COLETA)); v = pg.evaluate(planta.VERSAO); b.close()
        out[tema] = compara(mesma_versao(pl['temas'][tema]['pecas'], pl.get('versao_app'), v), L[0], ruido(L[0], L[1]))
    return out

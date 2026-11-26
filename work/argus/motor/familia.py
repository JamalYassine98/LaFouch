# ARGUS · o medidor de família (Parte 4) — UM só, com as regras 13–17 do CLAUDE.md, que valem para app e site:
#  L1 um eixo por bloco · L2 mesma linha (ícone e texto pelo centro) · L3 espaços só 8/16/24/32/48 · L4 o texto cabe (não quebra nem corta)
#  · toque ≥ 44 px · "+" de adicionar redondo · mesma função = mesma aparência (família inteira, em TODAS as telas)
#  · números (G$ 25.000 · US$ 3,79 · 18/11) · cores só da paleta oficial · poucos tamanhos de letra · ícones com um traço só
#  · movimento: uma curva e um tempo, e nada se mexe com "reduzir movimento" · mesmo verbo para a mesma ação · tela vazia = ícone + frase + explicação
# Mede o que APARECE (o desenho visível, 1 px). Cada achado diz a regra, a tela e a peça.
import re, collections
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from js import js
COLETA = js('familia')   # motor/js/familia.js (o mesmo no Android emulado)
CONTRASTE = 4.5; CONTRASTE_GRANDE = 3.0   # texto legível sobre o fundo (aprovado pelo dono 24/11 21:24; limites do padrão WCAG AA)
def _rgba(c):
    m = re.match(r'rgba?\(([\d.]+), ([\d.]+), ([\d.]+)(?:, ([\d.]+))?\)', c or '')
    return (float(m.group(1)), float(m.group(2)), float(m.group(3)), float(m.group(4)) if m.group(4) else 1.0) if m else None
def _lum(r, g, b):
    f = lambda v: (v / 255) / 12.92 if v / 255 <= 0.03928 else (((v / 255) + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
def contraste(cor, atras, opac=1.0):
    a, f = _rgba(cor), _rgba(atras)
    if not a or not f: return None
    al = a[3] * (opac if opac is not None else 1)
    r, g, b = [a[k] * al + f[k] * (1 - al) for k in range(3)]   # a cor do texto misturada com o fundo, como o olho vê
    l1, l2 = sorted((_lum(r, g, b), _lum(*f[:3])), reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)
VERBOS = [('Salvar', 'Guardar', 'Gravar'), ('Apagar', 'Excluir', 'Remover', 'Deletar'), ('Adicionar', 'Novo', 'Nova', 'Criar', 'Cadastrar'), ('Voltar', 'Retornar'), ('Editar', 'Alterar', 'Mudar')]
ESP = (0, 8, 16, 24, 32, 48)
def _cor_ok(c, pal):
    if c in pal: return True
    m = re.match(r'rgba?\((\d+), (\d+), (\d+)', c or '')
    return bool(m) and any(p.startswith('rgb(%s, %s, %s' % m.groups()) or p.startswith('rgba(%s, %s, %s' % m.groups()) for p in pal)
def mede_tela(nome, d, reduzido=False):
    """Regras de UMA tela. d = COLETA. Devolve [(regra, tela, peça, detalhe)]."""
    A = []; ad = lambda r, p, x='': A.append((r, nome, p, x))
    pal = set(d['paleta']) | {'rgb(255, 255, 255)', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 0)'}
    for p in d['pecas']:
        if p.get('icone'): continue
        if p['corta']: ad('L4 texto cortado', p['t'])
        if p['fora']: ad('L4 sai da tela', p['t'])
        if p['linhas'] > 1 and (p['titulo'] or p['secao'] or p.get('umalinha')): ad('L4 texto quebrou a linha', p['t'], '%d linhas' % p['linhas'])
        for m in re.finditer(r'G\$ ?(\d[\d.,]*)', p['t']):
            v = m.group(1)
            if (re.search(r'\d{4,}', v) and '.' not in v) or ',' in v: ad('número fora do padrão (G$ 25.000)', p['t'], m.group(0))
        for m in re.finditer(r'(US|R)\$ ?(\d[\d.,]*)', p['t']):
            if re.search(r'\.\d{2}$', m.group(2)): ad('número fora do padrão (US$ 3,79)', p['t'], m.group(0))
        if re.search(r'\b\d{4}-\d{2}-\d{2}\b', p['t']): ad('data fora do padrão (18/11)', p['t'])
        if not _cor_ok(p['cor'], pal): ad('cor fora da paleta oficial', p['t'], p['cor'])
        k = contraste(p['cor'], p.get('atras'), p.get('opac'))
        if k is not None:
            grande = float(p['fs'][:-2]) >= 24 or (float(p['fs'][:-2]) >= 18.66 and int(p['fw']) >= 700)
            if k < (CONTRASTE_GRANDE if grande else CONTRASTE): ad('texto pouco legível sobre o fundo (contraste)', p['t'], '%.2f:1 (mínimo %.1f:1)' % (k, CONTRASTE_GRANDE if grande else CONTRASTE))
    for l in d['linhas']:
        if l['h'] < 43.5: ad('toque menor que 44 px', l['t'], '%.0f px' % l['h'])
        if l['ic'] and l['tx']:
            ci = l['ic'][1] + l['ic'][3] / 2; ct = l['y'] + l['h'] / 2
            if abs(ci - ct) > 2: ad('L2 ícone fora do centro da linha', l['t'], '%.1f px' % (ci - ct))
    eixos = collections.defaultdict(list)
    for l in d['linhas']:
        if l['tx'] and l['pai']: eixos[(l['pai'], bool(l['ic']))].append((l['tx'][0], l['t']))
    for k, L in eixos.items():
        xs = collections.Counter(round(x) for x, _ in L)
        if len(L) > 1 and len(xs) > 1:
            base = xs.most_common(1)[0][0]
            for x, t in L:
                if abs(x - base) > 1: ad('L1 fora do eixo do bloco', t, '%+.0f px' % (x - base))
    for b in d['botoes'] + d['linhas']:
        t = b['txt']
        if re.match(r'^\+\s*\S', t) or (t == '+' and b['raio'] < b['h'] / 2 - 1): ad('"+" de adicionar não é o redondo', t, '%.0f×%.0f, cantos %.0f' % (b['w'], b['h'], b['raio']))
        if b in d['botoes'] and b['h'] < 43.5 and b['w'] < 43.5 and t: ad('toque menor que 44 px', t, '%.0f×%.0f' % (b['w'], b['h']))
    Z = d.get('zoom') or 1   # tela grande: o app aumenta tudo (zoom 1,15 / 1,3 …); o espaço se mede na medida do desenho
    for fim_ant, ini, nm in d['secoes']:
        g = round((ini - fim_ant) / Z)
        if g > 0 and min(abs(g - e) for e in ESP) > 1: ad('L3 espaço fora de 8/16/24/32/48', nm, '%d px' % g)
    for x in d.get('atravessa') or []: ad('texto aparece através de outro (camada sem fundo ou textos encavalados)', '“%s” por cima de “%s”' % (x['cima'], x['baixo']))
    if reduzido:
        for k in sorted({(x[0], x[1], x[2]) for x in d['trans']}): ad('mexe com "reduzir movimento" ligado', '%s %s' % (k[0], k[1]), k[2])
    for v in d['vazios']:
        if v.get('solto'): ad('tela vazia sem ícone + frase + explicação', v['solto'])
        elif not (v['ic'] and v['b'] and v['s']): ad('tela vazia incompleta', '')
    return A
def familia_inteira(telas):
    """Regra 13: mesma função = mesma aparência em TODAS as telas. telas = {nome: COLETA}. Devolve achados."""
    A = []; fam = collections.defaultdict(collections.Counter); onde = collections.defaultdict(dict)
    for nome, d in telas.items():
        for p in d['pecas']:
            if p.get('icone'): fam['ícone (traço)'][p['traco']] += 1; onde['ícone (traço)'].setdefault(p['traco'], nome); continue
            k = 'título da tela' if p['titulo'] else 'rótulo de seção' if p['secao'] else None
            if k: s = (p['fs'], p['fw'], p['ff'], p['ls'], p['tt']); fam[k][s] += 1; onde[k].setdefault(s, '%s · %s' % (nome, p['t']))
        for l in d['linhas']:
            if l['tx']: s = (l['tx'][4], l['tx'][5]); fam['título de linha'][s] += 1; onde['título de linha'].setdefault(s, '%s · %s' % (nome, l['t']))
            fam['altura de linha'][round(l['h'])] += 1; onde['altura de linha'].setdefault(round(l['h']), '%s · %s' % (nome, l['t']))
        for b in d['botoes']:
            if b['txt'] == '+' or re.match(r'^\+', b['txt']): s = (round(b['w']), round(b['h']), round(b['raio'])); fam['botão +'][s] += 1; onde['botão +'].setdefault(s, '%s · %s' % (nome, b['txt']))
        for t, f in [(x[0], x[1]) for x in d['trans']]: fam['movimento (tempo e curva)'][(t, f)] += 1; onde['movimento (tempo e curva)'].setdefault((t, f), nome)
        for e in d.get('estados', []):   # regra 17: o mesmo estado (aviso de baixo, erro, sem internet, carregando) igual em todo lugar
            k = 'estado: ' + ('aviso de baixo' if 'lfToast' in e['tipo'] or e['embaixo'] else e['tipo'])
            s = (e['fs'], e['fundo'], e['raio'], e['pos']); fam[k][s] += 1; onde[k].setdefault(s, '%s · %s' % (nome, e['t']))
    for k, c in fam.items():
        if len(c) > 1:
            base = c.most_common(1)[0][0]
            for s, n in c.items():
                if s != base: A.append(('família: %s com jeito diferente' % k, onde[k][s], str(s), 'o comum é %s' % (base,)))
    verbos = collections.defaultdict(set)
    for nome, d in telas.items():
        for b in d['botoes'] + d['linhas']:
            w = re.sub(r'^[+\s]+', '', b['txt']).split(' ')[0].capitalize()
            for g in VERBOS:
                if w in g: verbos[g].add((w, nome))
    for g, s in verbos.items():
        ws = {w for w, _ in s}
        if len(ws) > 1: A.append(('verbos diferentes para a mesma ação', ', '.join(sorted(ws)), '; '.join('%s em %s' % x for x in sorted(s)[:4]), ''))
    tam = collections.Counter(p['fs'] for d in telas.values() for p in d['pecas'] if not p.get('icone'))
    raros = [f for f, n in tam.items() if n <= 2]
    if raros: A.append(('tamanho de letra usado só 1–2 vezes no app', ', '.join(sorted(raros)), 'tamanhos em uso: %d' % len(tam), ''))
    return A

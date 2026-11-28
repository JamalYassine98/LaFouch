# ARGUS · TRAVAS DE LIMPEZA (FASE 1 · 28/11/2026, dono liberou 08:31; work/esboco/modular/PLANO-MODULAR.md "Regras que o Argus passa a travar").
# Mede o código como está e compara com a FOTO de hoje (limpeza_base.json): nada pode PIORAR. O que melhorar aperta a foto sozinho
# (catraca: só desce). Nenhuma tela é aberta — é leitura do código, rápida.
#  1. função/ação definida 2×        (a de baixo apaga a de cima em silêncio = remendo)
#  2. "!important" só pode cair
#  3. arquivo novo só dentro de família (src/familias|nucleo|estilo|cerebro|atualiza/…) e sem nome de sessão/versão (s374, v641)
#  4. cor/espaço solto (fora dos tokens) só pode cair  (cor #hex / px fora do :root)
#  5. UMA REGRA SÓ POR ASSUNTO: (a) o mesmo seletor de CSS escrito em mais de um bloco; (b) a mesma frase da tela escrita em 2+
#     arquivos; (c) assuntos com nome (ASSUNTOS) definidos em mais de um arquivo — ex.: "Últimas unidades" (limite 3 no
#     96-loja-online.js e 2 no 97-marketing.js) e o .ulin escrito 3× no www/loja/loja.html.
import os, re, json, glob, collections
R = '/home/claude/lafouch'; BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'limpeza_base.json')
PASTAS_FAMILIA = ('familias', 'nucleo', 'estilo', 'cerebro', 'atualiza')
CSS = ['www/style.css', 'www/loja/loja.html']
ASSUNTOS = {   # assunto → expressão que acha ONDE ele é decidido (no texto ou no limite). Um assunto = um arquivo só.
    'ultimas-unidades': r'[ÚúUu]LTIM[AO]S?\b[^\n]{0,20}UNIDAD|[Úú]ltim[ao]s?\b[^\n]{0,20}unidad|f\.ult\b',
}
def _js():
    return sorted(p for p in glob.glob(os.path.join(R, 'src', '**', '*.js'), recursive=True))
def _rel(p): return os.path.relpath(p, R)
def _css_textos():
    T = {}
    for f in CSS:
        p = os.path.join(R, f)
        if not os.path.exists(p): continue
        t = open(p, encoding='utf-8').read()
        if f.endswith('.html'): t = '\n'.join(re.findall(r'<style[^>]*>(.*?)</style>', t, re.S))
        T[f] = t
    return T
def _sem_root(t): return re.sub(r':root\s*\{[^}]*\}', '', t)
def mede():
    js = _js(); M = {}
    # 1 definidas 2×: função no começo da linha (global) e ACT.x / window.x = …
    defs = collections.defaultdict(list)
    for p in js:
        for k, l in enumerate(open(p, encoding='utf-8'), 1):
            for n in re.findall(r'^function\s+([A-Za-z_$][\w$]*)\s*\(', l) + re.findall(r'\b((?:ACT|window)\.[A-Za-z_$][\w$]*)\s*=\s*(?:function|\(|async|[A-Za-z_$][\w$]*\s*=>)', l):
                defs[n].append('%s:%d' % (_rel(p), k))
    M['duplas'] = {n: v for n, v in sorted(defs.items()) if len(v) > 1}
    # 2 !important · 4 cor/px soltos
    T = _css_textos()
    M['important'] = {f: t.count('!important') for f, t in T.items()}
    M['soltos'] = {f: len(re.findall(r'#[0-9a-fA-F]{3,8}\b', _sem_root(t))) + len(re.findall(r'(?<![\w.-])\d+(?:\.\d+)?px\b', _sem_root(t))) for f, t in T.items()}
    # 3 arquivos
    M['arquivos'] = sorted(_rel(p) for p in js)
    # 5a seletor em mais de um bloco (fora de @media: cada bloco conta; o mesmo seletor numa @media é variação, não cópia)
    sel = {}
    for f, t in T.items():
        t2 = re.sub(r'/\*.*?\*/', '', t, flags=re.S); t2 = re.sub(r'@(media|supports|container)[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}', '', t2)
        c = collections.Counter(s.strip() for bloco in re.findall(r'([^{}]+)\{[^{}]*\}', t2) for s in bloco.split(',') if s.strip() and not s.strip().startswith('@'))
        sel[f] = {s: n for s, n in sorted(c.items()) if n > 1}
    M['seletores'] = sel
    # 5b a mesma frase da tela (aspas, 3+ palavras com letras) em 2+ arquivos
    fr = collections.defaultdict(set)
    for p in js:
        for s in re.findall(r"'([^'\n]{12,80})'|\"([^\"\n]{12,80})\"", open(p, encoding='utf-8').read()):
            s = (s[0] or s[1]).strip()
            if len(re.findall(r'[A-Za-zÀ-ú]{2,}', s)) >= 3 and not re.search(r'[<>{}=;()\[\]/\\]|https?:|\.\w{2,4}$|\d+px|serif', s): fr[s].add(_rel(p))
    M['frases'] = {s: sorted(v) for s, v in sorted(fr.items()) if len(v) > 1}
    # 5c assuntos com nome
    M['assuntos'] = {a: sorted({_rel(p) for p in js if re.search(rx, open(p, encoding='utf-8').read())}) for a, rx in ASSUNTOS.items()}
    M['assuntos_css'] = {s: sum(len(re.findall(r'(?:^|[}\s,])' + re.escape(s) + r'\s*\{', t)) for t in T.values()) for s in ('.ulin',)}
    return M
def compara(M, B):
    """Lista o que PIOROU em relação à foto B (cada item = uma frase para o relatório)."""
    P = []
    for n, v in M['duplas'].items():
        if len(v) > len(B['duplas'].get(n, [v[0]])): P.append('definida %d× (era %d×): %s — %s' % (len(v), len(B['duplas'].get(n, [1])), n, ', '.join(v)))
    for k, rot in (('important', '"!important"'), ('soltos', 'cor/px fora dos tokens')):
        for f, n in M[k].items():
            if n > B[k].get(f, 0): P.append('%s subiu em %s: %d → %d' % (rot, f, B[k].get(f, 0), n))
    for a in sorted(set(M['arquivos']) - set(B['arquivos'])):
        partes = a.split(os.sep)
        if len(partes) < 3 or partes[1] not in PASTAS_FAMILIA: P.append('arquivo novo fora de família: %s (vai em src/familias/<família>/ ou nucleo/estilo/cerebro/atualiza)' % a)
        if re.search(r'(?<![a-z])[sv]\d{3}(?!\d)', os.path.basename(a)): P.append('nome de sessão/versão no arquivo: %s' % a)
    for f, d in M['seletores'].items():
        for s, n in d.items():
            if n > B['seletores'].get(f, {}).get(s, 1): P.append('seletor %s escrito em %d blocos em %s (era %d)' % (s, n, f, B['seletores'].get(f, {}).get(s, 1)))
    for s, v in M['frases'].items():
        if len(v) > len(B['frases'].get(s, [v[0]])): P.append('a mesma frase em %d arquivos: "%s" — %s' % (len(v), s[:50], ', '.join(v)))
    for a, v in M['assuntos'].items():
        if len(v) > len(B['assuntos'].get(a, [None])): P.append('assunto "%s" decidido em %d arquivos (era %d): %s' % (a, len(v), len(B['assuntos'].get(a, [1])), ', '.join(v)))
    for s, n in M['assuntos_css'].items():
        if n > B['assuntos_css'].get(s, 1): P.append('%s escrito %d× no CSS (era %d)' % (s, n, B['assuntos_css'].get(s, 1)))
    return P
def resumo(M):
    return {'definidas 2×': len(M['duplas']), '!important': sum(M['important'].values()), 'cor/px soltos': sum(M['soltos'].values()),
            'seletores repetidos': sum(len(d) for d in M['seletores'].values()), 'frases em 2+ arquivos': len(M['frases']),
            'assuntos em 2+ arquivos': sum(1 for v in M['assuntos'].values() if len(v) > 1), '.ulin no CSS': M['assuntos_css'].get('.ulin', 0)}
def foto(M=None):
    M = M or mede(); json.dump(M, open(BASE, 'w'), ensure_ascii=False, indent=1); return M
def confere(aperta=True):
    """(pioras, resumo de hoje, melhorou?) — se nada piorou e algo melhorou, a foto desce sozinha (catraca)."""
    M = mede()
    if not os.path.exists(BASE): foto(M); return [], resumo(M), False
    B = json.load(open(BASE)); P = compara(M, B)
    rb, rm = resumo(B), resumo(M); melhor = any(rm[k] < rb[k] for k in rm)
    if aperta and not P and melhor: foto(M)
    return P, rm, melhor
if __name__ == '__main__':
    import sys
    if sys.argv[1:] == ['foto']: M = foto(); print('foto de hoje gravada:', resumo(M))
    else:
        P, r, m = confere(aperta=False); print(r); print('\n'.join(P) or 'nada piorou')

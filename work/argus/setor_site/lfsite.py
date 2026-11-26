# ARGUS · setor SITE · o chão (Parte 7a): abrir o site lafouch.com no simulador do motor, com a loja de teste do site.
# · O site não tem build: o que está no repositório catalogo num commit é o que vai ao ar — a cópia é esse commit (git archive).
# · A loja de teste entra pelo caminho de verdade do site: o retrato da loja (/dados/inicio.json) e as respostas da nuvem
#   (Firestore: produtos e config/site). Escritas na nuvem (pedidos, contas) e as funções da nuvem ficam cortadas aqui; cada
#   etapa que precisa delas (cupom, carrinho, conta) responde por elas na Parte 7c.
# · Modos do site (dono 24/11): só claro · TODAS as temáticas e também SEM temática (o normal) · letra do Android 1× · 1,1× · 1,2× ·
#   PT e ES (o idioma vem do aparelho, como para um cliente de verdade).
import os, sys, json, copy, subprocess, shutil
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor'))
import abrir, aparelhos, esboco, loja
CAT = '/home/claude/catalogo'
BASE_1A_PLANTA = 'ef883de'   # o site original de 19/11 (antes de quebrar em 20/11): base da 1ª planta do site (SITE 24/11 21:06)
LOJA = os.path.join(A, 'dados', 'site_loja_normal.json')   # retrato da loja do site (formato do /dados/inicio.json), congelado
# temática → como o site a escolhe (config/site.evento): sem = nenhuma; bf-quase = a semana antes da Black Friday (classe bfq);
# anonovo de dia e de noite pela hora (o relógio do teste anda: a noite é às 21:00).
TEMATICAS = {'sem': None, 'natal': {'tema': 'natal'}, 'anonovo-d': {'tema': 'anonovo'}, 'anonovo-n': {'tema': 'anonovo'},
             'maes': {'tema': 'maes'}, 'pais': {'tema': 'pais'}, 'halloween': {'tema': 'halloween'}, 'bf': {'tema': 'bf'},
             'bf-quase': {'tema': 'bf', 'quase': True}}
LINGUAS = {'pt': 'pt-BR', 'es': 'es-PY'}
assert list(TEMATICAS) == aparelhos.MODOS['site']['tematica'] and list(LINGUAS) == aparelhos.MODOS['site']['lingua']   # uma lista só (aparelhos.MODOS)
# As letras que o site baixa do Google (Inter e Fraunces): servidas daqui, como o celular as recebe. A Fraunces 500 não está
# disponível nesta máquina (sem internet para baixar): a 500 usa a 600 — os títulos em Fraunces 500 saem um pouco mais grossos que no ar.
_L = os.path.join(A, 'motor', 'letras', 'site'); _I = '/usr/share/fonts/opentype/inter/'
LETRAS = {'inter-400.otf': _I + 'Inter-Regular.otf', 'inter-500.otf': _I + 'Inter-Medium.otf', 'inter-600.otf': _I + 'Inter-SemiBold.otf',
          'inter-700.otf': _I + 'Inter-Bold.otf', 'inter-800.otf': _I + 'Inter-ExtraBold.otf', 'fraunces-600.woff2': os.path.join(_L, 'fraunces-latin-600-normal.woff2')}
LETRAS_CSS = ''.join("@font-face{font-family:'%s';font-weight:%d;font-style:normal;font-display:swap;src:url(https://argus.letras/%s)}" % (fam, w, f)
                     for fam, w, f in [('Inter', w, 'inter-%d.otf' % w) for w in (400, 500, 600, 700, 800)] + [('Fraunces', 500, 'fraunces-600.woff2'), ('Fraunces', 600, 'fraunces-600.woff2')])
_SITE = {}
def monta(commit):
    """A cópia do site num commit do catalogo (sem build), uma vez por commit."""
    c = '/tmp/argus_site_' + commit[:12]
    if not os.path.exists(os.path.join(c, 'index.html')):
        shutil.rmtree(c, ignore_errors=True); os.makedirs(c)
        if subprocess.run(['git', '-C', CAT, 'cat-file', '-e', commit + '^{commit}'], capture_output=True).returncode:   # o catalogo daqui é raso:
            subprocess.run(['git', '-C', CAT, 'fetch', '-q', '--deepen=1000', 'origin', 'main'], capture_output=True)  # busca a história (só lê)
        ar = subprocess.run(['git', '-C', CAT, 'archive', commit], capture_output=True)
        if ar.returncode: raise SystemExit('git archive do catalogo falhou: ' + ar.stderr.decode()[:200])
        subprocess.run(['tar', '-x', '-C', c], input=ar.stdout, check=True)
    return c
def serve(pasta, porta): return esboco.serve(pasta, porta, servidor=os.path.join(A, 'setor_site', 'servidor.py'))   # como o GitHub Pages
def commit_de(ref='HEAD'): return subprocess.run(['git', '-C', CAT, 'rev-parse', ref], capture_output=True, text=True).stdout.strip()
def porta_hoje():
    """O site de hoje = o commit atual do catalogo (o que vai subir), servido uma vez por rodada."""
    if not _SITE: _SITE['porta'] = serve(monta(commit_de()), 8813)
    return _SITE['porta']
def _ms(d): return int(__import__('datetime').datetime.fromisoformat(d).timestamp() * 1000)
def cenario(nome='normal', tematica='sem', data=loja.DATA):
    """A loja do site: 'normal' (o retrato), 'vazio' (nenhuma peça), 'cheio' (as peças repetidas até passar de 100),
    'nomes_longos' (nomes e descrições compridos). A temática entra como no config/site.evento, valendo na data do teste."""
    d = json.load(open(LOJA))
    if nome == 'vazio': d['docs'] = []
    elif nome == 'cheio':
        base = d['docs']; d['docs'] = []
        for k in range(7):
            for x in base:
                y = copy.deepcopy(x); y['name'] = y.get('name', 'p') + '-%d' % k
                if k: y['fields']['ref'] = {'stringValue': y['fields'].get('ref', {}).get('stringValue', '') + 'X%d' % k}
                d['docs'].append(y)
    elif nome == 'nomes_longos':
        for x in d['docs']:
            f = x['fields']
            for k in ('nome', 'desc'):
                if k in f and 'stringValue' in f[k]: f[k]['stringValue'] = (f[k]['stringValue'] + ' ') * 3
    elif nome != 'normal': raise SystemExit('cenário do site não existe: ' + nome)
    ev = TEMATICAS[tematica]; t = _ms(data); dia = 86400000
    if ev is None: d['cfg']['fields']['evento'] = {'nullValue': None}
    else:
        ini, fim = (t + 3 * dia, t + 10 * dia) if ev.get('quase') else (t - dia, t + 7 * dia)
        m = {'tema': {'stringValue': ev['tema']}, 'ini': {'integerValue': str(ini)}, 'fim': {'integerValue': str(fim)}}
        if ev.get('quase'): m['aq'] = {'integerValue': str(t - dia)}
        d['cfg']['fields']['evento'] = {'mapValue': {'fields': m}}
    return d
def abre(pw, aparelho=aparelhos.DONO, tematica='sem', lingua='pt', cenario_='normal', letra=1.0, rota='', data=None, porta=None, navegador=None, reduzir_movimento=None, scripts=(), nuvem=None, logada=False):
    """O SITE (só claro). rota = o que vem depois de "/" (ex.: 'catalogo', 'p/AC1050'). data = a hora do teste (anonovo-n: 21:00).
    nuvem = a nuvem de teste (setor_site/nuvem.py) que responde pelas funções e anota o que o site mandou · logada = a cliente já entrou."""
    assert tematica in TEMATICAS, 'temática %s não existe' % tematica
    assert letra in aparelhos.MODOS['site']['letra'], 'letra %s não existe no site' % letra
    if data is None: data = loja.DATA.replace('T15:', 'T21:') if tematica == 'anonovo-n' else loja.DATA
    if porta is None: porta = porta_hoje()
    if logada: import nuvem as _n; scripts = tuple(scripts) + (_n.LOGADA,)
    f, c, pg = abrir.pagina(pw, aparelho, navegador, escuro=False, lingua=LINGUAS[lingua], reduzir_movimento=reduzir_movimento, scripts=scripts, data=data, letra=letra)
    d = cenario(cenario_, tematica, data); docs = {'documents': d['docs']}; cfg = dict(d['cfg'], name='config/site')
    c.route('**/dados/inicio.json*', lambda r: r.fulfill(status=200, content_type='application/json', body=json.dumps(d)))
    def nuvem_loja(r):   # Firestore: só as leituras da loja; escrever na nuvem fica cortado (as etapas da Parte 7c respondem por elas)
        u = r.request.url
        if r.request.method == 'GET' and '/documents/produtos' in u: return r.fulfill(status=200, content_type='application/json', body=json.dumps(docs))
        if r.request.method == 'GET' and '/documents/config/site' in u: return r.fulfill(status=200, content_type='application/json', body=json.dumps(cfg))
        r.abort()
    c.route('**firestore.googleapis.com/**', nuvem_loja)
    if nuvem is not None: nuvem.liga(c)
    c.route('**fonts.googleapis.com/css2*', lambda r: r.fulfill(status=200, content_type='text/css', body=LETRAS_CSS))   # as letras que o site baixa,
    c.route('https://argus.letras/**', lambda r: r.fulfill(status=200, path=LETRAS[r.request.url.rsplit('/', 1)[1]]))     # servidas daqui (sem internet)
    pg.goto('http://localhost:%d/%s' % (porta, rota)); pg.wait_for_load_state('load'); pg.wait_for_timeout(1500); abrir.mundo_parado(pg)
    return f, pg

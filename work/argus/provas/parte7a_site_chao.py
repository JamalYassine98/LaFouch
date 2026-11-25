# ARGUS · prova da Parte 7a (o chão do setor Site): a cópia é o commit do catalogo; a loja de teste entra pelo caminho de verdade
# do site; cada temática, idioma, letra e cenário aparece como deve; a internet de fora fica cortada; a mesma tela sai igual duas vezes.
import os, sys, json, subprocess
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor')); sys.path.insert(0, os.path.join(A, 'setor_site'))
import lfsite, aparelhos, loja
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
OUT = '/tmp/argus_p7a'; os.makedirs(OUT, exist_ok=True); R = []
def ok(nome, cond, d=''): R.append((nome, bool(cond), d)); print(('ok    ' if cond else 'FALHA ') + nome + (' · ' + d if d else ''))
ESTADO = "()=>({fx:document.querySelectorAll('[data-lfvivo] i').length,ev:document.documentElement.getAttribute('data-ev'),bfq:document.documentElement.classList.contains('bfq'),cards:document.querySelectorAll('.card').length,lang:document.documentElement.lang,txt:document.body.innerText})"
LETRAS = "()=>[...document.querySelectorAll('.card *')].filter(e=>e.children.length==0&&e.textContent.trim()).slice(0,4).map(e=>parseFloat(getComputedStyle(e).fontSize))"
with sync_playwright() as pw:
    # (1) a cópia é o commit do catalogo
    c = lfsite.commit_de(); pasta = lfsite.monta(c)
    git = subprocess.run(['git', '-C', lfsite.CAT, 'show', c + ':index.html'], capture_output=True).stdout
    ok('a cópia do site é o commit %s do catalogo (sem build)' % c[:9], open(os.path.join(pasta, 'index.html'), 'rb').read() == git)
    # (2) a loja entra pelo caminho de verdade; o relógio está parado; nada sai para a internet
    b, pg = lfsite.abre(pw); e = pg.evaluate(ESTADO); n = len(json.load(open(lfsite.LOJA))['docs'])
    ok('o site abriu com a loja do Argus (retrato da loja)', e['cards'] == n, '%d peças (loja: %d)' % (e['cards'], n))
    ok('relógio parado em 24/11/2026 15:00', pg.evaluate('()=>new Date().toISOString()').startswith('2026-11-24T18:00'))
    pg.evaluate("()=>scrollTo(0,document.body.scrollHeight)"); pg.wait_for_timeout(1500)
    fora = pg.context._argus_fora; ok('a internet de fora fica cortada (nada sai do simulador)', len(fora) > 0, '%d pedidos para fora barrados (ex.: %s)' % (len(fora), fora[0][:50] if fora else ''))
    ok('o site é só claro (o aparelho diz claro)', pg.evaluate("()=>matchMedia('(prefers-color-scheme: light)').matches")); b.close()
    # (3) cada temática acende o tema certo, e "sem" não acende nenhum
    for tm in aparelhos.MODOS['site']['tematica']:
        b, pg = lfsite.abre(pw, tematica=tm); e = pg.evaluate(ESTADO); b.close()
        quer = (None, False) if tm == 'sem' else ((None, True) if tm == 'bf-quase' else (tm, False))
        ok('temática %s' % tm, (e['ev'], e['bfq']) == quer and (quer[0] is not None or e['fx'] == 0), 'data-ev=%s · bfq=%s · enfeites vivos %d' % (e['ev'], e['bfq'], e['fx']))
    # (4) PT e ES vêm do aparelho, como para um cliente
    for lg, palavra in (('pt', 'Compre'), ('es', 'Comprá')):
        b, pg = lfsite.abre(pw, lingua=lg); e = pg.evaluate(ESTADO); b.close()
        ok('idioma %s (aparelho %s)' % (lg, lfsite.LINGUAS[lg]), palavra in e['txt'] and e['lang'] == lfsite.LINGUAS[lg], e['lang'])
    # (5) a letra do Android: 1,1× e 1,2× aumentam as letras na mesma proporção
    base = None
    for lt in aparelhos.MODOS['site']['letra']:
        b, pg = lfsite.abre(pw, letra=lt); L = pg.evaluate(LETRAS); b.close()
        if base is None: base = L
        ok('letra %s×' % lt, L and all(abs(x - y * lt) < 0.2 for x, y in zip(L, base)), ' · '.join('%.1f' % x for x in L))
    # (6) cenários
    for cen, quer in (('vazio', lambda k: k == 0), ('cheio', lambda k: k > 100), ('nomes_longos', lambda k: k == n)):
        b, pg = lfsite.abre(pw, cenario_=cen, aparelho='PC 1440'); k = pg.evaluate(ESTADO)['cards']; b.close()
        ok('cenário %s' % cen, quer(k), '%d peças' % k)
    # (7) a mesma tela duas vezes sai igual, pixel por pixel (celular do dono, PC e uma temática)
    for ap, tm in ((aparelhos.DONO, 'sem'), ('PC 1920', 'natal')):
        F = []
        for vez in (1, 2):
            b, pg = lfsite.abre(pw, aparelho=ap, tematica=tm); pg.wait_for_timeout(1500); pg.evaluate("()=>{window.__argus.parar();document.querySelectorAll('[data-lfvivo]').forEach(e=>e.style.visibility='hidden')}"); f = '%s/igual_%s_%d.png' % (OUT, tm, vez); pg.screenshot(path=f); F.append(f); b.close()
        bb = ImageChops.difference(Image.open(F[0]).convert('RGB'), Image.open(F[1]).convert('RGB')).getbbox()
        ok('igual 2× · %s · %s' % (ap, tm), bb is None, 'diferença em %s' % (bb,) if bb else '')
    # (8) as letras: o site baixa as suas (Inter e Fraunces) e elas chegam em todo aparelho, sem internet
    for ap in (aparelhos.DONO, 'PC 1440'):
        b, pg = lfsite.abre(pw, aparelho=ap); s_ = pg.context.new_cdp_session(pg); s_.send('DOM.enable'); s_.send('CSS.enable')
        nd = s_.send('DOM.querySelectorAll', {'nodeId': s_.send('DOM.getDocument', {'depth': -1})['root']['nodeId'], 'selector': 'body *'})['nodeIds']
        fams = {x['familyName'].split(' ')[0] for f in (s_.send('CSS.getPlatformFontsForNode', {'nodeId': k})['fonts'] for k in nd) for x in f if x.get('isCustomFont')}; b.close()
        ok('letras do site chegam · %s: %s' % (ap, ', '.join(sorted(fams))), {'Inter', 'Fraunces'} <= fams)
    # (9) o que não existe no site é recusado (escuro, letra do app)
    try: lfsite.abre(pw, letra=1.15); ok('letra do app (1,15×) recusada no site', False)
    except AssertionError: ok('letra do app (1,15×) recusada no site', True)
json.dump(R, open(OUT + '/resultado.json', 'w'), ensure_ascii=False, indent=1)
print('\n%d de %d ok' % (sum(1 for x in R if x[1]), len(R)))

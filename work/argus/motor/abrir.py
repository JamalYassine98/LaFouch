# ARGUS · a porta para abrir o app (e, na Parte 7, o site). Tudo passa por work/kit/sim.py (um simulador só).
# Antes de o app carregar entram: a base comum do Argus (js/base.js) e o relógio parado (js/relogio.js) — os mesmos do Android emulado.
# A loja de teste entra pelo armazenamento do app (o caminho de verdade de um usuário).
import os, sys, json, datetime
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); R = os.path.dirname(os.path.dirname(A))
sys.path.insert(0, os.path.join(R, 'work', 'kit')); sys.path.insert(0, os.path.join(A, 'motor'))
_argv = sys.argv[:]; import kit; sys.argv[:] = _argv      # kit lê sys.argv ao importar
import sim, aparelhos, loja
from js import js
def relogio(data=loja.DATA): return js('relogio').replace('__T0__', str(int(datetime.datetime.fromisoformat(data).timestamp() * 1000)))
_NAVS = {}; _HOJE = {}
def porta_hoje():
    """porta=None = o app de hoje: montado do código do commit atual (motor/esboco.py: hoje), servido uma vez por rodada."""
    import esboco
    www = esboco.hoje()
    if www not in _HOJE: _HOJE.clear(); _HOJE[www] = esboco.serve(www, kit.PA)
    return _HOJE[www]
def navegador_de(pw, letras):
    """Um navegador aberto por tipo de letras (o do PC e o do Android), reaproveitado enquanto o Playwright estiver aberto."""
    k = (id(pw), letras)
    if k not in _NAVS or not _NAVS[k].is_connected(): _NAVS[k] = sim.navegador(pw, letras=letras)
    return _NAVS[k]
def abre(pw, aparelho=aparelhos.DONO, tema='escuro', cenario='normal', sem_internet=False, data=loja.DATA, porta=None, navegador=None, antes=None, reduzir_movimento=None, scripts=(), letra=1.0):
    """porta=None → o app de hoje (montado do código do commit atual); porta=N → uma cópia servida em N (ex.: a cópia de um esboço).
    navegador = um navegador já aberto (para abrir muitas vezes depressa); aí o que volta para fechar é só a aba (contexto).
    scripts = códigos que entram antes do app (ex.: a biometria do setor App).
    letra = a letra do celular (1,15 · 1,3 no app; 1,1 · 1,2 no site): entra logo depois do style.css, antes de o app desenhar."""
    assert tema in aparelhos.MODOS['app']['tema'], 'tema %s não existe no app' % tema
    W, H, dpr, toque = aparelhos.FAIXA[aparelho]
    if porta is None: porta = porta_hoje()
    letras = 'android' if toque else None   # tela de celular = as letras do Android (aprovado 25/11 10:07)
    if navegador is not None and getattr(navegador, '_letras', None) != letras: navegador = navegador_de(pw, letras)
    b = navegador or sim.navegador(pw, letras=letras)
    c = sim.contexto(b, W, H, toque=toque, dpr=dpr, lingua='pt-BR', escuro=(tema == 'escuro'), sem_trabalhador=True, fuso=aparelhos.FUSO,
                     movimento=None if reduzir_movimento is None else (not reduzir_movimento))
    c.route('**/*', lambda r: r.continue_() if r.request.url.startswith(('http://localhost', 'http://127.')) else r.abort())
    for s in (js('base'), relogio(data)) + tuple(scripts): c.add_init_script(s)
    if letra != 1.0:
        def com_letra(r):   # o index.html do app, com a letra grande logo depois do style.css (o resto do app não muda)
            resp = r.fetch(); h = resp.text(); k = h.find('>', h.find('rel="stylesheet"')) + 1
            r.fulfill(response=resp, body=h[:k] + '<script>(' + js('letra') + ')(' + repr(float(letra)) + ')</script>' + h[k:])
        c.route('**/index.html*', com_letra)
    pg = c.new_page()
    if letras == 'android': c.new_cdp_session(pg).send('Page.setFontFamilies', {'fontFamilies': {'standard': 'Roboto'}})   # a letra-padrão do Android
    if antes: antes(pg)   # ex.: ligar a cobertura do código ANTES de o app carregar
    if cenario is not None:
        d = cenario if isinstance(cenario, dict) else loja.cenario(cenario)   # um cenário pelo nome, ou uma loja já pronta ({'ls','big'})
        pg.goto('http://localhost:%d/version.json' % porta); pg.evaluate(loja.POE, [loja.CHAVE, d['ls'], d['big']])
    pg.goto('http://localhost:%d/index.html#test' % porta)
    pg.wait_for_function('window.__LF', timeout=20000); pg.wait_for_timeout(1200)
    if sem_internet:
        c.set_offline(True); pg.evaluate("()=>window.dispatchEvent(new Event('offline'))"); pg.wait_for_timeout(400)
    return (c if navegador else b), pg

# ARGUS · a porta para abrir o app e o site (pagina: o que é comum; abre: o app; setor_site/site.py: o site). Tudo passa por work/kit/sim.py (um simulador só).
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
    if not _HOJE: _HOJE['porta'] = esboco.serve(esboco.hoje(), kit.PA)   # o commit de quando a rodada começou: um commit novo no meio não muda o que se confere
    return _HOJE['porta']
def navegador_de(pw, letras):
    """Um navegador aberto por tipo de letras (o do PC e o do Android), reaproveitado enquanto o Playwright estiver aberto."""
    k = (id(pw), letras)
    if k not in _NAVS or not _NAVS[k].is_connected(): _NAVS[k] = sim.navegador(pw, letras=letras)
    return _NAVS[k]
def pagina(pw, aparelho, navegador=None, escuro=None, lingua='pt-BR', reduzir_movimento=None, scripts=(), data=loja.DATA, letra=1.0):
    """A aba do simulador, igual para o app e o site: o aparelho (com as letras do Android no celular), a internet de fora cortada,
    a base do Argus e o relógio parado antes da página, e a letra grande do celular logo antes do fim do <head> (depois de todo o CSS
    da página, antes de ela desenhar). Devolve (o que fechar, contexto, página)."""
    W, H, dpr, toque = aparelhos.FAIXA[aparelho]
    letras = 'android' if toque else None   # tela de celular = as letras do Android (aprovado 25/11 10:07)
    if navegador is not None and getattr(navegador, '_letras', None) != letras: navegador = navegador_de(pw, letras)
    b = navegador or sim.navegador(pw, letras=letras)
    c = sim.contexto(b, W, H, toque=toque, dpr=dpr, lingua=lingua, escuro=escuro, sem_trabalhador=True, fuso=aparelhos.FUSO,
                     movimento=None if reduzir_movimento is None else (not reduzir_movimento))
    c._argus_fora = []   # o que tentou sair para a internet (cortado aqui): (endereço, tipo) — tipo 'document' = a página tentou ir para fora
    c.route('**/*', lambda r: r.continue_() if r.request.url.startswith(('http://localhost', 'http://127.')) else (c._argus_fora.append((r.request.url, r.request.resource_type)), r.abort()))
    for s in (js('base'), relogio(data)) + tuple(scripts): c.add_init_script(s)
    if letra != 1.0:
        def com_letra(r):
            if r.request.resource_type != 'document': return r.fallback()
            resp = r.fetch(); h = resp.text()
            k = h.find('</head>') if '</head>' in h else h.find('<body') if '<body' in h else h.find('>', h.rfind('rel="stylesheet"')) + 1 if 'rel="stylesheet"' in h else -1
            if k <= 0: return r.fulfill(response=resp)   # não é página (ex.: version.json)   ↑ o fim do <head>: a tag, o começo do corpo, ou (o app não escreve as duas) depois da última folha de estilo
            r.fulfill(response=resp, body=h[:k] + '<script>(' + js('letra') + ')(' + repr(float(letra)) + ')</script>' + h[k:])
        c.route('http://localhost*/**', com_letra)
    pg = c.new_page()
    if letras == 'android': c.new_cdp_session(pg).send('Page.setFontFamilies', {'fontFamilies': {'standard': 'Roboto'}})   # a letra-padrão do Android
    return (c if navegador else b), c, pg
def mundo_parado(pg):
    """Confere que o que o Argus põe antes da página entrou (a base, o relógio e o sorteio): se um deles quebrar, a rodada para aqui
    — nunca segue conferindo num mundo que anda."""
    f = pg.evaluate("()=>[!!window.__argus,!!window.__argusRelogio,!!window.__argusSorte]")
    if not all(f): raise SystemExit('o mundo parado do Argus não entrou na página (base, relógio, sorteio = %s)' % f)
def abre(pw, aparelho=aparelhos.DONO, tema='escuro', cenario='normal', sem_internet=False, data=loja.DATA, porta=None, navegador=None, antes=None, reduzir_movimento=None, scripts=(), letra=1.0):
    """O APP. porta=None → o app de hoje (montado do código do commit atual); porta=N → uma cópia servida em N (ex.: a cópia de um esboço).
    navegador = um navegador já aberto (para abrir muitas vezes depressa); aí o que volta para fechar é só a aba (contexto).
    scripts = códigos que entram antes do app (ex.: a biometria do setor App). letra = a letra do celular (1,15 · 1,3 no app)."""
    assert tema in aparelhos.MODOS['app']['tema'], 'tema %s não existe no app' % tema
    if porta is None: porta = porta_hoje()
    f, c, pg = pagina(pw, aparelho, navegador, escuro=(tema == 'escuro'), reduzir_movimento=reduzir_movimento, scripts=scripts, data=data, letra=letra)
    if antes: antes(pg)   # ex.: ligar a cobertura do código ANTES de o app carregar
    if cenario is not None:
        d = cenario if isinstance(cenario, dict) else loja.cenario(cenario)   # um cenário pelo nome, ou uma loja já pronta ({'ls','big'})
        pg.goto('http://localhost:%d/version.json' % porta); pg.evaluate(loja.POE, [loja.CHAVE, d['ls'], d['big']])
    pg.goto('http://localhost:%d/index.html#test' % porta)
    pg.wait_for_function('window.__LF', timeout=20000); pg.wait_for_timeout(1200); mundo_parado(pg)
    if sem_internet:
        c.set_offline(True); pg.evaluate("()=>window.dispatchEvent(new Event('offline'))"); pg.wait_for_timeout(400)
    return f, pg

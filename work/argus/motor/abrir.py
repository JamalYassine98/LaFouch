# ARGUS · a porta para abrir o app (e, na Parte 7, o site). Tudo passa por work/kit/sim.py (um simulador só).
# abre(pw, aparelho, tema, cenario, sem_internet) → (navegador, página): relógio parado, loja de teste do Argus, sem rede de fora.
import os, sys, json
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); R = os.path.dirname(os.path.dirname(A))
sys.path.insert(0, os.path.join(R, 'work', 'kit')); sys.path.insert(0, os.path.join(A, 'motor'))
_argv = sys.argv[:]; import kit; sys.argv[:] = _argv      # kit lê sys.argv ao importar
import sim, aparelhos, loja
import datetime
def abre(pw, aparelho=aparelhos.DONO, tema='escuro', cenario='normal', sem_internet=False, data=loja.DATA, porta=None, navegador=None, antes=None, reduzir_movimento=None):
    """porta=None → o app de hoje (www/ do repositório); porta=N → uma cópia servida em N (ex.: a cópia de um esboço).
    navegador = um navegador já aberto (para abrir muitas vezes depressa); aí o que volta para fechar é só a aba (contexto)."""
    assert tema in aparelhos.MODOS['app']['tema'], 'tema %s não existe no app' % tema
    W, H, dpr, toque = aparelhos.FAIXA[aparelho]
    if porta is None: kit.serve(os.path.join(R, 'www'), kit.PA); porta = kit.PA
    b = navegador or sim.navegador(pw)
    c = sim.contexto(b, W, H, toque=toque, dpr=dpr, lingua='pt-BR', escuro=(tema == 'escuro'), sem_trabalhador=True,
                     movimento=None if reduzir_movimento is None else (not reduzir_movimento))
    c.route('**/*', lambda r: r.continue_() if r.request.url.startswith(('http://localhost', 'http://127.')) else r.abort())
    c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
    pg = c.new_page()
    if antes: antes(pg)   # ex.: ligar a cobertura do código ANTES de o app carregar
    pg.clock.install(time=datetime.datetime.fromisoformat(data))
    if cenario is not None:   # a loja do Argus entra pelo caminho de verdade (o armazenamento do app), numa página vazia da mesma origem
        d = loja.cenario(cenario)
        pg.goto('http://localhost:%d/version.json' % porta); pg.evaluate(loja.POE, [loja.CHAVE, d['ls'], d['big']])
    pg.goto('http://localhost:%d/index.html#test' % porta)
    pg.wait_for_function('window.__LF', timeout=15000); pg.wait_for_timeout(1200)
    if sem_internet:
        c.set_offline(True); pg.evaluate("()=>window.dispatchEvent(new Event('offline'))"); pg.wait_for_timeout(400)
    return (c if navegador else b), pg

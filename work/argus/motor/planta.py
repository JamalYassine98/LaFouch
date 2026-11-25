# ARGUS · a PLANTA de uma tela (Parte 1). A planta é o que o dono aprovou, guardado por dentro:
#  · as peças que APARECEM (texto, caixa, letra, cor, fundo, borda, desenho do ícone) — pelo que se vê, não pelo nome do código;
#  · nos modos de cor do setor (app: claro e escuro; site: as temáticas e sem temática); os dados (cenário), o relógio, o caminho
#    até a tela (no site, também o endereço) e o nome dela;
#  · as LIGAÇÕES: o que cada toque faz (sai para · abre a janela de baixo · abre o menu · abre ali · troca a escolha · mostra aviso ·
#    nada) — gravado com o DEDO de verdade (motor/dedo.py).
# Planta só vale com a linha de aprovação na lista viva (docs/FALTA-APROVAR-15-11.md). Ajuste aprovado → a anterior vai para
# work/obsoletos/argus-plantas/ (só a última aprovada vale).
import os, sys, json, re, time, shutil
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); R = os.path.dirname(os.path.dirname(A)); sys.path.insert(0, os.path.join(A, 'motor'))
import abrir, loja, aparelhos
P_APP = os.path.join(A, 'plantas', 'app'); P_SITE = os.path.join(A, 'plantas', 'site'); OBS = os.path.join(R, 'work', 'obsoletos', 'argus-plantas'); LISTA = os.path.join(R, 'docs', 'FALTA-APROVAR-15-11.md')
from js import js
COLETA = js('planta')                                   # as peças que aparecem (motor/js/planta.js)
TITULO = "()=>window.__argus.titulo()"                  # nome da tela = título + a tela em que o app diz estar (o Início não tem título)
TOCAVEIS = js('tocaveis')
VERSAO = js('versao')   # a versão do app (dado, não desenho)
import perigo, dedo
def precos(k):
    """O caminho até um setor de Preços (regras, ofertas, atacado, ferr, hist): um lugar só para todas as provas e plantas."""
    return ["()=>__LF.inicioGo('prec')", "()=>document.querySelector('[data-act=tiAbre][data-id=%s]').click()" % k]
# Um setor = como abrir a tela e quais são os seus modos de cor. tema_base = o modo em que as ligações são tocadas.
def _site(): sys.path.insert(0, os.path.join(A, 'setor_site')); import lfsite; return lfsite
SETORES = {'app': {'temas': aparelhos.MODOS['app']['tema'], 'tema_base': 'escuro', 'pasta': 'P_APP'},
           'site': {'temas': aparelhos.MODOS['site']['tematica'], 'tema_base': 'sem', 'pasta': 'P_SITE'}}   # pasta: o nome da variável (as provas a trocam)
def setor(t): return SETORES[t.get('setor', 'app')]
def tela_de(pl):
    """A tela guardada numa planta: o nome, o caminho, os dados (e no site, o setor e o endereço) — um lugar só para quem confere."""
    return {k: pl[k] for k in ('setor', 'rota') if k in pl} | {'nome': pl['tela'], 'passos': pl['passos'], 'cenario': pl['cenario']}
def _abre_tela(pw, tela, tema, porta, aparelho=aparelhos.DONO, navegador=None, **kw):
    if tela.get('setor') == 'site':
        b, pg = _site().abre(pw, aparelho=aparelho, tematica=tema, cenario_=tela['cenario'], rota=tela.get('rota', ''), porta=porta, navegador=navegador, **kw)
    else: b, pg = abrir.abre(pw, aparelho=aparelho, tema=tema, cenario=tela['cenario'], porta=porta, navegador=navegador, **kw)
    for p in tela['passos']: pg.evaluate(p); pg.wait_for_timeout(1000)
    pg.wait_for_timeout(500); return b, pg
def ligacoes(pw, tela, porta):
    """Toca com o dedo em cada botão da tela (reabrindo a tela antes de cada toque) e anota o que acontece."""
    import sim; nav = sim.navegador(pw)
    tb = setor(tela)['tema_base']; b, pg = _abre_tela(pw, tela, tb, porta, navegador=nav); tit0 = pg.evaluate(TITULO); L = pg.evaluate(TOCAVEIS); b.close(); out = []
    for t in L:
        if perigo.perigoso(t): out.append(dict(t, faz='não tocado (perigo)')); continue
        b, pg = _abre_tela(pw, tela, tb, porta, navegador=nav)
        out.append(dict(t, faz=dedo.faz(pg, t['i']))); b.close()
    nav.close(); return tit0, out
def grava(pw, id_, tela, porta=None, aprovacao=None, com_ligacoes=True, temas=None):
    """tela = {'nome', 'passos', 'cenario'} (+ no site: 'setor': 'site', 'rota') · porta = cópia de esboço (None = o de hoje) ·
    aprovacao = trecho da linha na lista viva."""
    pl = {'id': id_, 'tela': tela['nome'], 'passos': tela['passos'], 'cenario': tela['cenario'], 'data': loja.DATA,
          'aparelho': aparelhos.DONO, 'aprovacao': aprovacao, 'temas': {}} | {k: tela[k] for k in ('setor', 'rota') if k in tela}
    for tema in (temas or setor(tela)['temas']):   # temas = só alguns modos (as provas, para andar depressa); a planta de verdade leva todos
        b, pg = _abre_tela(pw, tela, tema, porta)
        pl['temas'][tema] = {'titulo': pg.evaluate(TITULO), 'pecas': pg.evaluate(COLETA)}; pl['versao_app'] = pg.evaluate(VERSAO)
        f = '/tmp/argus_foto_%s_%s.jpg' % (id_, tema); pg.evaluate('()=>window.__argus.parar()'); pg.screenshot(path='/tmp/_pl.png', full_page=True); b.close()
        from PIL import Image; Image.open('/tmp/_pl.png').convert('RGB').save(f, quality=82)
        pl['temas'][tema]['_foto'] = f   # a foto fica de lado até salva(): só entra no lugar depois que a planta anterior saiu
    if com_ligacoes: pl['titulo'], pl['ligacoes'] = ligacoes(pw, tela, porta)
    return pl
def pasta(pl): return globals()[setor(pl)['pasta']]
def caminho(pl): return os.path.join(pasta(pl), pl['id'] + '.json')
def salva(pl):
    """Guarda a planta; se já existe uma com o mesmo id, a anterior vai para work/obsoletos (só a última vale)."""
    os.makedirs(pasta(pl), exist_ok=True)
    if os.path.exists(caminho(pl)): substitui(pl)
    pl = json.loads(json.dumps(pl))
    for tema, t in pl['temas'].items():
        f = t.pop('_foto', None)
        if f and os.path.exists(f): shutil.copy(f, os.path.join(pasta(pl), '%s_%s.jpg' % (pl['id'], tema)))
        t['foto'] = '%s_%s.jpg' % (pl['id'], tema)
    json.dump(pl, open(caminho(pl), 'w'), ensure_ascii=False, indent=1)
def substitui(pl):
    id_ = pl['id']; d = os.path.join(OBS, '%s_%s' % (id_, time.strftime('%Y%m%d-%H%M%S'))); os.makedirs(d, exist_ok=True)
    for f in os.listdir(pasta(pl)):
        if f == id_ + '.json' or f.startswith(id_ + '_'): shutil.move(os.path.join(pasta(pl), f), os.path.join(d, f))
    return d
def valida(pl):
    """'aprovada' só com o trecho da aprovação achado na lista viva; sem aprovação = 'pendente' (não trava nem libera nada)."""
    if not pl.get('aprovacao'): return 'pendente'
    return 'aprovada' if pl['aprovacao'] in open(LISTA, encoding='utf-8').read() else 'INVÁLIDA (aprovação não está na lista viva)'

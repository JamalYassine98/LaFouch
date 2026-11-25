# ARGUS · a PLANTA de uma tela (Parte 1). A planta é o que o dono aprovou, guardado por dentro:
#  · as peças que APARECEM (texto, caixa, letra, cor, fundo, borda, desenho do ícone) — pelo que se vê, não pelo nome do código;
#  · nos dois temas do app; os dados (cenário), o relógio, o caminho até a tela e o nome dela;
#  · as LIGAÇÕES: o que cada toque faz (sai para outra tela, abre ali, abre a janela de baixo, nada) — gravado tocando de verdade.
# Planta só vale com a linha de aprovação na lista viva (docs/FALTA-APROVAR-15-11.md). Ajuste aprovado → a anterior vai para
# work/obsoletos/argus-plantas/ (só a última aprovada vale).
import os, sys, json, re, time, shutil
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); R = os.path.dirname(os.path.dirname(A)); sys.path.insert(0, os.path.join(A, 'motor'))
import abrir, loja, aparelhos
P_APP = os.path.join(A, 'plantas', 'app'); OBS = os.path.join(R, 'work', 'obsoletos', 'argus-plantas'); LISTA = os.path.join(R, 'docs', 'FALTA-APROVAR-15-11.md')
from js import js
COLETA = js('planta')                                   # as peças que aparecem (motor/js/planta.js)
TITULO = "()=>window.__argus.titulo()"                  # nome da tela = título + a tela em que o app diz estar (o Início não tem título)
TOCAVEIS = js('tocaveis'); TOCA = "(i)=>window.__argus.tocar(i)"; DEPOIS = "()=>window.__argus.depois()"
import perigo
def _abre_tela(pw, tela, tema, porta, aparelho=aparelhos.DONO, navegador=None, **kw):
    b, pg = abrir.abre(pw, aparelho=aparelho, tema=tema, cenario=tela['cenario'], porta=porta, navegador=navegador, **kw)
    for p in tela['passos']: pg.evaluate(p); pg.wait_for_timeout(1000)
    pg.wait_for_timeout(500); return b, pg
def ligacoes(pw, tela, porta):
    """Toca de verdade em cada botão da tela (reabrindo a tela antes de cada toque) e anota o que acontece."""
    import sim; nav = sim.navegador(pw)
    b, pg = _abre_tela(pw, tela, 'escuro', porta, navegador=nav); tit0 = pg.evaluate(TITULO); L = pg.evaluate(TOCAVEIS); b.close(); out = []
    for t in L:
        if perigo.perigoso(t): out.append(dict(t, faz='não tocado (perigo)')); continue
        b, pg = _abre_tela(pw, tela, 'escuro', porta, navegador=nav)
        if not pg.evaluate(TOCA, t['i']): b.close(); out.append(dict(t, faz='não achado')); continue
        pg.wait_for_timeout(1000); d = pg.evaluate(DEPOIS); tit = pg.evaluate(TITULO); b.close()
        if tit and tit != tit0: faz = 'sai para: ' + tit
        elif d['janela'] is not None: faz = 'abre a janela de baixo: ' + d['janela']
        elif d['dh'] > 8: faz = 'abre ali'
        else: faz = 'nada'
        out.append(dict(t, faz=faz))
    nav.close(); return tit0, out
def grava(pw, id_, tela, porta=None, aprovacao=None, com_ligacoes=True):
    """tela = {'nome', 'passos', 'cenario'} · porta = cópia de esboço (None = app de hoje) · aprovacao = trecho da linha na lista viva."""
    os.makedirs(P_APP, exist_ok=True)
    pl = {'id': id_, 'tela': tela['nome'], 'passos': tela['passos'], 'cenario': tela['cenario'], 'data': loja.DATA,
          'aparelho': aparelhos.DONO, 'aprovacao': aprovacao, 'temas': {}}
    for tema in aparelhos.MODOS['app']['tema']:
        b, pg = _abre_tela(pw, tela, tema, porta)
        pl['temas'][tema] = {'titulo': pg.evaluate(TITULO), 'pecas': pg.evaluate(COLETA)}
        f = '/tmp/argus_foto_%s_%s.jpg' % (id_, tema); pg.screenshot(path='/tmp/_pl.png', full_page=True); b.close()
        from PIL import Image; Image.open('/tmp/_pl.png').convert('RGB').save(f, quality=82)
        pl['temas'][tema]['_foto'] = f   # a foto fica de lado até salva(): só entra no lugar depois que a planta anterior saiu
    if com_ligacoes: pl['titulo'], pl['ligacoes'] = ligacoes(pw, tela, porta)
    return pl
def caminho(id_): return os.path.join(P_APP, id_ + '.json')
def salva(pl):
    """Guarda a planta; se já existe uma com o mesmo id, a anterior vai para work/obsoletos (só a última vale)."""
    os.makedirs(P_APP, exist_ok=True)
    if os.path.exists(caminho(pl['id'])): substitui(pl['id'])
    pl = json.loads(json.dumps(pl))
    for tema, t in pl['temas'].items():
        f = t.pop('_foto', None)
        if f and os.path.exists(f): shutil.copy(f, os.path.join(P_APP, '%s_%s.jpg' % (pl['id'], tema)))
        t['foto'] = '%s_%s.jpg' % (pl['id'], tema)
    json.dump(pl, open(caminho(pl['id']), 'w'), ensure_ascii=False, indent=1)
def substitui(id_):
    d = os.path.join(OBS, '%s_%s' % (id_, time.strftime('%Y%m%d-%H%M%S'))); os.makedirs(d, exist_ok=True)
    for f in os.listdir(P_APP):
        if f == id_ + '.json' or f.startswith(id_ + '_'): shutil.move(os.path.join(P_APP, f), os.path.join(d, f))
    return d
def valida(pl):
    """'aprovada' só com o trecho da aprovação achado na lista viva; sem aprovação = 'pendente' (não trava nem libera nada)."""
    if not pl.get('aprovacao'): return 'pendente'
    return 'aprovada' if pl['aprovacao'] in open(LISTA, encoding='utf-8').read() else 'INVÁLIDA (aprovação não está na lista viva)'

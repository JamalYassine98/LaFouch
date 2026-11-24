# ARGUS · autoprova de TODA rodada: antes de acreditar no resultado, o Argus prova que ainda enxerga.
#  1 estragos numa cópia de uma planta (o comparador tem de ver cada um) · 2 defeitos plantados numa tela de verdade (o medidor tem
#  de ver cada um) · 3 uma versão ANTIGA do app, com erros que o dono já achou, tem de ser reprovada nesses erros.
# Se qualquer coisa não for vista, a rodada não vale (nada publica).
import os, sys, copy
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor'))
import compara, familia, abrir, esboco, planta, toques
VERSAO_ANTIGA = '93f8886a1'   # APP v641 (24/11): erros conhecidos abaixo
ERROS_ANTIGOS = [   # (tela, passos, regra que TEM de aparecer)
    ('Despesas', ["()=>__LF.inicioGo('desp')"], '"+" de adicionar não é o redondo'),
    ('Caixa', ["()=>__LF.inicioGo('caixa')"], '"+" de adicionar não é o redondo'),
]
REG = ["()=>__LF.inicioGo('prec')", "()=>document.querySelector('[data-act=tiAbre][data-id=regras]').click()"]
PLANTA_DEF = r"""()=>{const V=document.querySelector('.view:not([hidden])')||document.body;const col=V.querySelector('.cnt')||V;
 const L=[...V.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().width>=innerWidth*0.6);
 L[0].style.setProperty('min-height','40px','important');L[0].style.setProperty('height','40px','important');L[0].style.overflow='hidden';
 const add=h=>{const d=document.createElement('div');d.innerHTML=h;col.appendChild(d.firstElementChild)};
 add('<p class="hint">Total: G$ 25000</p>');add('<button type="button" class="btn" style="width:100%;min-height:48px">+ Nova conta</button>');return 1}"""
def roda(pw, nav=None, antiga=True):
    """Devolve (ok, [(o que foi provado, visto?)])."""
    R = []
    # 1 comparador
    b, pg = abrir.abre(pw, navegador=nav)
    for js in REG: pg.evaluate(js); pg.wait_for_timeout(1000)
    app = pg.evaluate(planta.COLETA); d0 = pg.evaluate(familia.COLETA); a0 = {(x[0], x[2]) for x in familia.mede_tela('t', d0)}
    pg.evaluate(PLANTA_DEF); pg.wait_for_timeout(400); d1 = pg.evaluate(familia.COLETA); b.close()
    txt = [i for i, p in enumerate(app) if p['tipo'] == 'texto' and p['texto'] and not p['fixo']]; ic = [i for i, p in enumerate(app) if p['tipo'] == 'icone']; k = txt[len(txt) // 2]
    for nome, f, esp in [('peça fora do lugar', lambda pl: pl[k]['caixa'].__setitem__(0, pl[k]['caixa'][0] + 2), 'posição'),
                         ('cor trocada', lambda pl: pl[k].__setitem__('cor', 'rgb(1, 2, 3)'), 'cor'),
                         ('peça a menos no app', lambda pl: pl.append(dict(copy.deepcopy(pl[k]), texto='Peça da planta', caixa=[10, 10, 50, 20])), 'falta'),
                         ('ícone com outro desenho', lambda pl: pl[ic[0]]['icone'].__setitem__('geo', pl[ic[0]]['icone']['geo'] + '|circle:cx=1'), 'desenho do ícone')]:
        pl = copy.deepcopy(app); f(pl); R.append(('comparador vê: ' + nome, any(esp in x[1] for x in compara.compara(pl, app))))
    # 2 medidor
    a1 = [x for x in familia.mede_tela('t', d1) if (x[0], x[2]) not in a0]
    for esp in ('toque menor que 44 px', 'número fora do padrão', '"+" de adicionar não é o redondo'):
        R.append(('medidor vê: ' + esp, any(esp in x[0] for x in a1)))
    # 3 versão antiga
    if antiga:
        www = esboco.prepara('_versao_antiga', base=VERSAO_ANTIGA); porta = esboco.serve(www, 8839)
        for tela, passos, regra in ERROS_ANTIGOS:
            b, pg = abrir.abre(pw, navegador=nav, porta=porta)
            for js in passos: pg.evaluate(js); pg.wait_for_timeout(1000)
            d = pg.evaluate(familia.COLETA); b.close()
            R.append(('versão antiga (v641) reprovada em %s: %s' % (tela, regra), any(regra in x[0] for x in familia.mede_tela(tela, d))))
    return all(v for _, v in R), R

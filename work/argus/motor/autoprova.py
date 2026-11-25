# ARGUS · autoprova de TODA rodada: antes de acreditar no resultado, o Argus prova que ainda enxerga.
#  1 estragos numa cópia de uma planta (o comparador tem de ver cada um) · 2 defeitos plantados numa tela de verdade (o medidor tem
#  de ver cada um) · 3 uma versão ANTIGA do app, com erros que o dono já achou, tem de ser reprovada nesses erros ·
#  4 o DEDO e o retrato (25/11): linha que só abre com o dedo, aba que troca, menu solto, botão que não faz nada · 5 a letra grande
#  deixa o app descer a letra quando não cabe.
# Se qualquer coisa não for vista, a rodada não vale (nada publica).
import os, sys, copy
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor'))
import compara, familia, abrir, esboco, planta, toques
VERSAO_ANTIGA = '93f8886a1'   # APP v641 (24/11): erros conhecidos abaixo
ERROS_ANTIGOS = [   # (tela, passos, regra que TEM de aparecer)
    ('Despesas', ["()=>__LF.inicioGo('desp')"], '"+" de adicionar não é o redondo'),
    ('Caixa', ["()=>__LF.inicioGo('caixa')"], '"+" de adicionar não é o redondo'),
]
REG = __import__('planta').precos('regras')
PLANTA_DEF = r"""()=>{const V=document.querySelector('.view:not([hidden])')||document.body;const col=V.querySelector('.cnt')||V;
 const L=[...V.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().width>=innerWidth*0.6);
 L[0].style.setProperty('min-height','40px','important');L[0].style.setProperty('height','40px','important');L[0].style.overflow='hidden';
 const add=h=>{const d=document.createElement('div');d.innerHTML=h;col.appendChild(d.firstElementChild)};
 add('<p class="hint">Total: G$ 25000</p>');add('<button type="button" class="btn" style="width:100%;min-height:48px">+ Nova conta</button>');
 add('<p class="argusCt">Texto quase invisível</p>');const ct=col.lastElementChild;ct.style.setProperty('color',getComputedStyle(document.body).backgroundColor,'important');ct.style.setProperty('opacity','0.9','important');return 1}"""
LARGA = "()=>{for(const e of [document.documentElement,document.body])e.style.setProperty('overflow-x','visible','important');const d=document.createElement('div');d.style.cssText='width:'+(innerWidth+300)+'px;height:10px';document.body.appendChild(d);return 1}"
PLANTA_TOQUE = r"""()=>{const V=document.querySelector('.view:not([hidden])')||document.body;const col=V.querySelector('.cnt')||V;const d=document.createElement('div');d.id='agTeste';
 d.innerHTML='<button type="button" id="agDedo" aria-expanded="false" style="min-height:48px">Argus abre com o dedo</button><p id="agDedoC" hidden>Conteúdo que só o dedo abre</p>'+
 '<div><button type="button" class="agAba on" aria-pressed="true" style="min-height:48px">Argus aba 1</button><button type="button" class="agAba" aria-pressed="false" style="min-height:48px">Argus aba 2</button></div>'+
 '<div style="position:relative"><button type="button" id="agMenu" style="min-height:48px">Argus menu</button><div id="agMenuC" hidden style="position:absolute;left:0;top:50px;width:200px;padding:8px;background:#333;z-index:9"><button type="button" style="min-height:44px">Argus item 1</button><button type="button" style="min-height:44px">Argus item 2</button></div></div>'+
 '<button type="button" id="agNada" style="min-height:48px">Argus não faz nada</button>';col.appendChild(d);
 const b=d.querySelector('#agDedo');b.addEventListener('pointerup',()=>{const c=d.querySelector('#agDedoC');c.hidden=!c.hidden;b.setAttribute('aria-expanded',String(!c.hidden))});   // só o dedo (sem clique)
 d.querySelectorAll('.agAba').forEach(a=>a.addEventListener('click',()=>d.querySelectorAll('.agAba').forEach(x=>{x.classList.toggle('on',x===a);x.setAttribute('aria-pressed',String(x===a))})));
 d.querySelector('#agMenu').addEventListener('click',()=>{d.querySelector('#agMenuC').hidden=false});return 1}"""
ESPERA_TOQUE = [('Argus abre com o dedo', 'abre ali'), ('Argus aba 2', 'troca a escolha'), ('Argus menu', 'abre o menu')]
LETRA_CABE = "()=>{const l=document.querySelector('.nvLista'),b=l&&l.querySelector('.nvTx b');if(!b)return null;const f0=parseFloat(getComputedStyle(b).fontSize);l.setAttribute('data-cabe','2');return [f0,parseFloat(getComputedStyle(b).fontSize)]}"
def roda(pw, nav=None, antiga=True):
    """Devolve (ok, [(o que foi provado, visto?)])."""
    R = []; proprio = nav is None
    if proprio: nav = __import__('sim').navegador(pw)
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
    for esp in ('toque menor que 44 px', 'número fora do padrão', '"+" de adicionar não é o redondo', 'texto pouco legível'):
        R.append(('medidor vê: ' + esp, any(esp in x[0] for x in a1)))
    # gestos: uma peça larga demais faz a tela rolar de lado — tem de ser visto
    tela = {'nome': 'Regras', 'passos': REG + [LARGA], 'cenario': 'normal'}
    R.append(('gestos vê: tela que rola de lado', any('rola de lado' in p[1] for p in toques.gestos(pw, nav, tela, None, []))))
    # 4 o dedo e o retrato
    tela = {'nome': 'Regras', 'passos': REG + [PLANTA_TOQUE], 'cenario': 'normal'}; _, lig = planta.ligacoes(pw, tela, None); faz = {l['nome']: l['faz'] for l in lig}
    for nome, esp in ESPERA_TOQUE: R.append(('o dedo vê: "%s" → %s' % (nome, esp), faz.get(nome, '').startswith(esp)))
    nada = [l for l in lig if l['nome'] == 'Argus não faz nada']
    R.append(('toques vê: botão que não faz nada', bool(nada) and any('não faz nada' in p[1] for p in toques.regras(pw, nav, tela, None, nada[0], ''))))
    # 5 a letra grande deixa o app descer a letra (o 2º degrau de "não cabe" das listas: 14,5 px × 1,3)
    b, pg = abrir.abre(pw, navegador=nav, letra=1.3); pg.evaluate("()=>window.__argus.aba(2)"); pg.wait_for_timeout(900); fs = pg.evaluate(LETRA_CABE); b.close()
    R.append(('letra 1,3×: o app ainda desce a letra quando não cabe', bool(fs) and abs(fs[0] - 16 * 1.3) < 0.3 and abs(fs[1] - 14.5 * 1.3) < 0.3))
    # 3 versão antiga
    if antiga:
        www = esboco.prepara('_versao_antiga', base=VERSAO_ANTIGA); porta = esboco.serve(www, 8839)
        for tela, passos, regra in ERROS_ANTIGOS:
            b, pg = abrir.abre(pw, navegador=nav, porta=porta)
            for js in passos: pg.evaluate(js); pg.wait_for_timeout(1000)
            d = pg.evaluate(familia.COLETA); b.close()
            R.append(('versão antiga (v641) reprovada em %s: %s' % (tela, regra), any(regra in x[0] for x in familia.mede_tela(tela, d))))
    if proprio: nav.close()
    return all(v for _, v in R), R

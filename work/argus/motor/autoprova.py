# ARGUS · autoprova de TODA rodada: antes de acreditar no resultado, o Argus prova que ainda enxerga.
#  1 estragos numa cópia de uma planta (o comparador tem de ver cada um) · 2 defeitos plantados numa tela de verdade (o medidor tem
#  de ver cada um) · 3 uma versão ANTIGA do app, com erros que o dono já achou, tem de ser reprovada nesses erros ·
#  4 o DEDO e o retrato (25/11): linha que só abre com o dedo, aba que troca, menu solto, botão que não faz nada, camada sem fundo
#  (o texto de baixo aparece através: o defeito do site em 25/11) · 5 a letra grande
#  deixa o app descer a letra quando não cabe.
# Se qualquer coisa não for vista, a rodada não vale (nada publica).
import os, sys, copy
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor'))
import compara, familia, abrir, esboco, planta, toques, tempo
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
 add('<p class="argusCt">Texto quase invisível</p>');const ct=col.lastElementChild;ct.style.setProperty('color',getComputedStyle(document.body).backgroundColor,'important');ct.style.setProperty('opacity','0.9','important');
 add('<div style="position:fixed;left:0;right:0;top:40vh;z-index:70;padding:0 24px"><p style="font-size:18px">Argus camada sem fundo por cima</p></div>');return 1}"""
LARGA = "()=>{for(const e of [document.documentElement,document.body])e.style.setProperty('overflow-x','visible','important');const d=document.createElement('div');d.style.cssText='width:'+(innerWidth+300)+'px;height:10px';document.body.appendChild(d);return 1}"
PLANTA_TOQUE = r"""()=>{const V=document.querySelector('.view:not([hidden])')||document.body;const col=V.querySelector('.cnt')||V;const d=document.createElement('div');d.id='agTeste';
 d.innerHTML='<button type="button" id="agDedo" aria-expanded="false" style="min-height:48px">Argus abre com o dedo</button><p id="agDedoC" hidden>Conteúdo que só o dedo abre</p>'+
 '<div><button type="button" class="agAba on" aria-pressed="true" style="min-height:48px">Argus aba 1</button><button type="button" class="agAba" aria-pressed="false" style="min-height:48px">Argus aba 2</button></div>'+
 '<div style="position:relative"><button type="button" id="agMenu" style="min-height:48px">Argus menu</button><div id="agMenuC" hidden style="position:absolute;left:0;top:50px;width:200px;padding:8px;background:#333;z-index:9"><button type="button" style="min-height:44px">Argus item 1</button><button type="button" style="min-height:44px">Argus item 2</button></div></div>'+
 '<button type="button" id="agNada" style="min-height:48px">Argus não faz nada</button>';col.appendChild(d);
 const b=d.querySelector('#agDedo');b.addEventListener('pointerup',()=>{const c=d.querySelector('#agDedoC');c.hidden=!c.hidden;b.setAttribute('aria-expanded',String(!c.hidden))});   // só o dedo (sem clique)
 d.querySelectorAll('.agAba').forEach(a=>a.addEventListener('click',()=>d.querySelectorAll('.agAba').forEach(x=>{x.classList.toggle('on',x===a);x.setAttribute('aria-pressed',String(x===a))})));
 d.querySelector('#agMenu').addEventListener('click',()=>{d.querySelector('#agMenuC').hidden=false});return 1}"""
PLANTA_SINAL = r"""()=>{const V=document.querySelector('.view:not([hidden])')||document.body;const col=V.querySelector('.cnt')||V;const d=document.createElement('div');d.id='agSinal';
 const jan=()=>{const j=document.createElement('div');j.style.cssText='position:fixed;left:0;right:0;bottom:0;height:45vh;background:#222;z-index:50';j.innerHTML='<h2>Janela de teste</h2><button type="button" style="min-height:48px">Salvar</button>';document.body.appendChild(j)};
 d.innerHTML='<button type="button" id="agSeta" style="min-height:48px">Argus seta ›</button><button type="button" id="agDobra" style="min-height:48px">Argus dobra ⌄</button>'+
  '<button type="button" id="agTransp" style="min-height:48px">Argus abre sem fundo</button><button type="button" id="agCima" style="min-height:48px">Argus por cima</button><button type="button" id="agMais" style="min-height:48px;min-width:48px">+</button>'+
  '<div class="lfAbas">'+[1,2,3,4].map(k=>'<button type="button" class="agA'+(k==1?' on':'')+'" aria-pressed="'+(k==1)+'" style="min-height:48px">Argus vista '+k+'</button>').join('')+'</div>';col.appendChild(d);
 d.querySelector('#agTransp').addEventListener('click',()=>{const c=document.createElement('div');c.style.cssText='position:fixed;left:0;right:0;top:0;bottom:0;z-index:65;padding:120px 24px';c.innerHTML='<h2>Argus camada transparente</h2><p>Argus texto da camada por cima de tudo</p>'.repeat(6);document.body.appendChild(c)});
 d.querySelector('#agSeta').addEventListener('click',jan);d.querySelector('#agDobra').addEventListener('click',jan);
 d.querySelector('#agCima').addEventListener('click',()=>{const c=document.createElement('div');c.style.cssText='position:fixed;inset:0;background:#111;z-index:60';c.innerHTML='<h2>Tela por cima</h2><button type="button">×</button>';document.body.appendChild(c)});
 d.querySelectorAll('.agA').forEach(a=>a.addEventListener('click',()=>d.querySelectorAll('.agA').forEach(x=>{x.classList.toggle('on',x===a);x.setAttribute('aria-pressed',String(x===a))})));return 1}"""
ESPERA_SINAL = [('Argus abre sem fundo', 'aparece através'), ('Argus seta ›', 'promete outra tela'), ('Argus dobra ⌄', 'abre ali, mas'), ('Argus por cima', 'não existe tela por cima'), ('+', '"+" redondo')]
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
    for esp in ('toque menor que 44 px', 'número fora do padrão', '"+" de adicionar não é o redondo', 'texto pouco legível', 'texto aparece através'):
        R.append(('medidor vê: ' + esp, any(esp in x[0] for x in a1)))
    # gestos: uma peça larga demais faz a tela rolar de lado — tem de ser visto
    tela = {'nome': 'Regras', 'passos': REG + [LARGA], 'cenario': 'normal'}
    R.append(('gestos vê: tela que rola de lado', any('rola de lado' in p[1] for p in toques.gestos(pw, nav, tela, None, []))))
    # 4 o dedo e o retrato
    tela = {'nome': 'Regras', 'passos': REG + [PLANTA_TOQUE], 'cenario': 'normal'}; _, lig = planta.ligacoes(pw, tela, None); faz = {l['nome']: l['faz'] for l in lig}
    for nome, esp in ESPERA_TOQUE: R.append(('o dedo vê: "%s" → %s' % (nome, esp), faz.get(nome, '').startswith(esp)))
    nada = [l for l in lig if l['nome'] == 'Argus não faz nada']
    R.append(('toques vê: botão que não faz nada', bool(nada) and any('não faz nada' in p[1] for p in toques.regras(pw, nav, tela, None, nada[0], ''))))
    # 4b o sinal bate com o destino (regras 15 e 16) e as abas
    tela = {'nome': 'Regras', 'passos': REG + [PLANTA_SINAL], 'cenario': 'normal'}; _, lig = planta.ligacoes(pw, tela, None)
    for nome, esp in ESPERA_SINAL:
        l = [x for x in lig if x['nome'] == nome]
        R.append(('regras veem: "%s" → %s' % (nome, esp), bool(l) and any(esp in p[1] for p in toques.regras(pw, nav, tela, None, l[0], ''))))
    R.append(('regras veem: 4 abas (a regra é 2–3)', any('4 abas' in p[1] for p in toques.abas(lig, {}))))
    # 4c as letras do Android nas telas de celular (Roboto); o PC fica com as de sempre
    fontes = []
    for ap in (abrir.aparelhos.DONO, 'PC 1440'):
        b, pg = abrir.abre(pw, navegador=nav, aparelho=ap); pg.evaluate("()=>window.__argus.aba(2)"); pg.wait_for_timeout(700); c = pg.context.new_cdp_session(pg); c.send('DOM.enable'); c.send('CSS.enable')
        n = c.send('DOM.querySelectorAll', {'nodeId': c.send('DOM.getDocument', {'depth': -1})['root']['nodeId'], 'selector': '.nvTx small'})['nodeIds']
        fontes.append(c.send('CSS.getPlatformFontsForNode', {'nodeId': n[0]})['fonts'][0]['familyName'] if n else ''); b.close()
    R.append(('letras: celular desenha com a Roboto, o PC não · %s / %s' % tuple(fontes), fontes[0] == 'Roboto' and fontes[1] != 'Roboto'))
    # 5 a letra grande deixa o app descer a letra (o 2º degrau de "não cabe" das listas: 14,5 px × 1,3)
    b, pg = abrir.abre(pw, navegador=nav, letra=1.3); pg.evaluate("()=>window.__argus.aba(2)"); pg.wait_for_timeout(900); fs = pg.evaluate(LETRA_CABE); b.close()
    R.append(('letra 1,3×: o app ainda desce a letra quando não cabe', bool(fs) and abs(fs[0] - 16 * 1.3) < 0.3 and abs(fs[1] - 14.5 * 1.3) < 0.3))
    # 6 laço: a tela parada que muda sozinha sem parar tem de ser vista
    b, pg = abrir.abre(pw, navegador=nav); pg.goto(pg.url.split('index.html')[0] + 'version.json'); pg.wait_for_function('window.__argus')   # página quieta (sem o app)
    q = tempo.muda_sozinha(pg)
    pg.evaluate("()=>{const d=document.createElement('i');document.body.appendChild(d);const f=()=>{d.classList.add('x');requestAnimationFrame(f)};f();return 1}"); r_ = tempo.muda_sozinha(pg); b.close()
    R.append(('tempo vê: tela que muda sozinha sem parar (laço) · quieta %d, com laço %d' % (q, r_), q <= tempo.SOZINHA_MAX < r_))
    # 3 versão antiga
    if antiga:
        www = esboco.prepara('_versao_antiga', base=VERSAO_ANTIGA); porta = esboco.serve(www, 8839)
        for tela, passos, regra in ERROS_ANTIGOS:
            b, pg = abrir.abre(pw, navegador=nav, porta=porta)
            for js in passos: pg.evaluate(js); pg.wait_for_timeout(1000)
            d = pg.evaluate(familia.COLETA); b.close()
            R.append(('versão antiga (v641) reprovada em %s: %s' % (tela, regra), any(regra in x[0] for x in familia.mede_tela(tela, d))))
    if proprio: nav.close()
    import subprocess   # trava 26/11: o status rodado num ramo (a porta anota no fim) nunca publica o ramo no main
    R.append(('status no ramo não publica o ramo', subprocess.run(['python3', os.path.join(os.path.dirname(os.path.dirname(A)), 'tools', 'prova_status_ramo.py')], capture_output=True).returncode == 0))
    import limpeza   # trava 28/11: cada tipo de piora da limpeza é pego
    M = limpeza.mede(); B = copy.deepcopy(M); f = next(iter(M['important']))
    M['duplas']['ACT.provaArgus'] = ['src/a.js:1', 'src/b.js:2']; M['important'][f] += 1; M['arquivos'].append('src/98z-s999.js')
    M['assuntos']['ultimas-unidades'].append('src/x.js'); M['assuntos_css']['.ulin'] += 1; M['frases']['Frase de prova do Argus'] = ['src/a.js', 'src/b.js']
    P = limpeza.compara(M, B)
    R.append(('limpeza pega as 6 pioras plantadas', len(P) >= 7 and limpeza.compara(B, B) == []))
    return all(v for _, v in R), R

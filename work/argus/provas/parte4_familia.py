# ARGUS · prova da Parte 4 (o medidor de família):
#  1 autoprova: 14 defeitos plantados de propósito em Preços › Regras (um de cada regra) — cada um tem de aparecer, e só depois de plantado
#  2 roda o medidor nos lugares achados pelo explorador (Parte 3), nos dois temas, mais "reduzir movimento", e lista os achados do app
import os, sys, json
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor'))
import abrir, familia, explorador, sim
from playwright.sync_api import sync_playwright
R = []
def ok(nome, cond, d=''): R.append((nome, bool(cond), d)); print(('ok    ' if cond else 'FALHA ') + nome + (' · ' + d if d else ''), flush=True)
REG = __import__('planta').precos('regras')
PLANTA = r"""()=>{const V=document.querySelector('.view:not([hidden])')||document.body;const col=V.querySelector('.cnt')||V;
 const L=[...V.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().width>=innerWidth*0.6);
 const c=L[0];c.style.setProperty('min-height','40px','important');c.style.setProperty('height','40px','important');c.style.overflow='hidden';           // toque < 44
 const s=c.querySelector('svg');if(s){s.style.position='relative';s.style.top='5px'}                                                                     // L2
 const t2=L[1].querySelector('b');t2.style.position='relative';t2.style.left='3px';                                                                         // L1
 const t3=L[2].querySelector('b');t3.style.setProperty('display','inline-block','important');t3.style.setProperty('width','22px','important');t3.style.setProperty('white-space','normal','important');                                                                    // L4 quebra
 const k=[...col.children].filter(x=>x.getBoundingClientRect().height>0);{const g=k[3].getBoundingClientRect().top-k[2].getBoundingClientRect().bottom;const m=parseFloat(getComputedStyle(k[3]).marginTop)||0;k[3].style.setProperty('margin-top',(m+20-g)+'px','important');k[3].classList.add('argusL3')}   // espaço de 20 px (fora de 8/16/24/32/48)                                                       // L3
 const add=(h)=>{const d=document.createElement('div');d.innerHTML=h;col.appendChild(d.firstElementChild)};
 add('<p class="hint">Total: G$ 25000</p>');                                                                                                                // número
 add('<p style="color:#123456">Texto com cor de fora</p>');                                                                                               // cor
 add('<button type="button" class="btn" style="width:100%;min-height:48px">+ Nova conta</button>');                                                        // "+"
 add('<div><button type="button" class="mini">Guardar</button></div>');add('<div><button type="button" class="mini">Salvar</button></div>');               // verbos
 add('<section><p>Nenhum item por aqui</p></section>');                                                                                                                         // vazio
 add('<h1>Outro título</h1>');const h=col.lastElementChild;h.style.setProperty('font-size','40px','important');h.style.setProperty('font-family','serif','important');                                                                                    // família
 add('<div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/></svg></div>');col.lastElementChild.querySelector('svg').style.setProperty('stroke-width','3px','important');  // ícone
 add('<div class="argusMov">movimento de teste</div>');col.lastElementChild.style.setProperty('transition','opacity 0.43s ease-in','important');                                                                            // movimento
 add('<div><button type="button" style="width:30px;height:30px;padding:0">ok</button></div>');                                                             // toque pequeno
 window.scrollTo(0,0);return 1}"""
ESPERA = ['toque menor que 44 px', 'L2 ícone fora do centro', 'L1 fora do eixo', 'L4 texto quebrou', 'L3 espaço fora', 'número fora do padrão (G$', 'cor fora da paleta',
          '"+" de adicionar não é o redondo', 'verbos diferentes', 'tela vazia sem ícone', 'família: título da tela', 'família: ícone (traço)', 'família: movimento', 'mexe com "reduzir movimento"']
def mede(pg, nome, red=False):
    d = pg.evaluate(familia.COLETA); return d, familia.mede_tela(nome, d, red)
with sync_playwright() as pw:
    nav = sim.navegador(pw)
    def regras(plantar, red=False):
        b, pg = abrir.abre(pw, navegador=nav, reduzir_movimento=red)
        for js in REG: pg.evaluate(js); pg.wait_for_timeout(1000)
        if plantar: pg.evaluate(PLANTA); pg.wait_for_timeout(500)
        d, a = mede(pg, 'Regras', red); b.close(); return d, a + familia.familia_inteira({'Regras': d})
    d0, a0 = regras(False); d1, a1 = regras(True); dr0, ar0 = regras(False, red=True); dr, ar = regras(True, red=True)
    a0 = a0 + ar0   # o que já existe no app (com e sem "reduzir movimento") não conta como defeito plantado
    chave = lambda x: (x[0], x[2])
    b0 = {chave(x) for x in a0}
    for e in ESPERA:   # o defeito plantado tem de aparecer como achado NOVO (regra + peça que não existiam antes de plantar)
        hit = [x for x in a1 + ar if e in x[0] and chave(x) not in b0 and (e != 'L3 espaço fora' or 'argusL3' in str(x[2]))]
        ok('autoprova pega: ' + e, bool(hit), (str(hit[0][2])[:50] + (' · ' + str(hit[0][3])[:50] if len(hit[0]) > 3 and hit[0][3] else '')) if hit else 'NÃO viu')
    if os.environ.get('ARGUS_SO_AUTOPROVA'): print('(os lugares do explorador não rodaram de novo nesta rodada)'); raise SystemExit
    # 2 nos lugares do explorador
    E = json.load(open(os.path.join(A, 'provas', 'parte3_explorador_24-11.json')))
    lug = [(n, v['caminho']) for n, v in E['lugares'].items()][:40]
    T = {}; ACH = []
    for tema in ('escuro', 'claro'):
        for n, cam in lug:
            b, pg = abrir.abre(pw, navegador=nav, tema=tema)
            explorador.anda(pg, cam)
            d, a = mede(pg, '%s (%s)' % (n, tema)); b.close(); ACH += a
            if tema == 'escuro': T[n] = d
    b, pg = abrir.abre(pw, navegador=nav, reduzir_movimento=True); d, a = mede(pg, 'Início (reduzir movimento)', True); b.close(); ACH += a
    ACH += familia.familia_inteira(T)
    nav.close()
    ok('medidor rodou em %d lugares × 2 temas + "reduzir movimento"' % len(lug), len(T) == len(lug), '%d achados do app' % len(ACH))
    json.dump([list(x) for x in ACH], open('/tmp/argus_p4_achados.json', 'w'), ensure_ascii=False, indent=1)
    import collections
    print('\nACHADOS DO APP por regra (não são falha da prova):')
    for r, n in collections.Counter(x[0] for x in ACH).most_common(): print('  %4d  %s' % (n, r))
print('\n%d de %d ok' % (sum(1 for x in R if x[1]), len(R)))

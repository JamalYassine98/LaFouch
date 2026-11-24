# ARGUS · os toques (Parte 3). Confere se cada botão faz o que a planta aprovada diz (as LIGAÇÕES) e as regras de toque do motor
# (CLAUDE.md 15–16, valem para app e site): › sai para outra tela e o voltar traz de volta ao MESMO ponto · ⌄ abre ali e fecha no
# 2º toque, e toques rápidos não deixam pela metade · a janela de baixo não tem × nem "Fechar", fecha com Esc, tocando fora e
# arrastando para baixo, e pergunta "Sair sem salvar?" se algo mudou. Nunca toca em botão de perigo (planta.PERIGO_*).
import os, sys
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor'))
import planta, sim
ALT = r"""(i)=>{const vis=e=>{const r=e.getBoundingClientRect();if(r.width<2||r.height<2)return false;for(let p=e;p&&p.nodeType==1;p=p.parentElement){const c=getComputedStyle(p);if(c.display=='none'||c.visibility=='hidden'||+c.opacity==0)return false}return true};
 const L=[...document.querySelectorAll('button,a[href],[data-act],[role=button],summary,input[type=checkbox],select')].filter(e=>vis(e)&&!e.closest('nav,#mainnav,#nvBar,aside')&&!(e.parentElement&&e.parentElement.closest('button,a[href],[data-act],[role=button]')));
 const e=L[i];if(!e)return -1;const B=e.closest('section,details,li')||e.parentElement;return Math.round(B.getBoundingClientRect().height)}"""
VOLTA = r"""()=>{const b=[...document.querySelectorAll('button,a,[data-act]')].find(e=>{const r=e.getBoundingClientRect();return r.width>2&&r.top<280&&/^‹|^voltar/i.test((e.getAttribute('aria-label')||e.textContent||'').trim())});if(b){b.click();return 'botão ‹'}history.back();return 'voltar do aparelho'}"""
JANELA = r"""()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2&&getComputedStyle(e).visibility!='hidden'&&getComputedStyle(e).display!='none'};
 const fx=[...document.querySelectorAll('body *')].filter(x=>getComputedStyle(x).position=='fixed'&&vis(x)&&!x.closest('nav,#mainnav,#nvBar'));
 const j=fx.filter(x=>{const r=x.getBoundingClientRect();return r.bottom>=innerHeight-2&&r.width>=innerWidth*0.6&&r.height>=innerHeight*0.2}).pop();
 if(!j)return null;const r=j.getBoundingClientRect();
 const bts=[...j.querySelectorAll('button,[role=button],a')].filter(vis).map(b=>(b.getAttribute('aria-label')||b.textContent||'').replace(/\s+/g,' ').trim());
 return {top:r.top,fechar:bts.filter(t=>/^(×|✕|x|fechar)$/i.test(t)),salvar:bts.some(t=>/^salvar$/i.test(t)),campo:!!j.querySelector('input:not([type=checkbox]):not([type=hidden]),textarea')}}"""
SAIR_SEM = r"""()=>/sair sem salvar/i.test(document.body.innerText)"""
def _passa(pg, passos):
    for js in passos: pg.evaluate(js); pg.wait_for_timeout(1000)
def _abre(pw, nav, tela, porta, extra=()):
    b, pg = planta._abre_tela(pw, tela, 'escuro', porta, navegador=nav)
    for i in extra:
        pg.evaluate(planta.TOCA, i); pg.wait_for_timeout(1000)
    return b, pg
def confere(pw, pl, porta=None):
    """Grava as ligações do app e compara com as da planta; depois roda as regras de toque. Devolve a lista de problemas."""
    tela = {'nome': pl['tela'], 'passos': pl['passos'], 'cenario': pl['cenario']}
    tit0, lig = planta.ligacoes(pw, tela, porta)
    P = []
    def chaves(L):   # o botão é reconhecido pelo que APARECE (o nome), e pela ordem quando o nome se repete — nunca pelo nome do código
        vistos = {}; out = {}
        for l in L:
            n = l['nome']; vistos[n] = vistos.get(n, 0) + 1; out[('', '', n if vistos[n] == 1 else '%s (%dª)' % (n, vistos[n]))] = l['faz']
        return out
    app = chaves(lig); pla = chaves(pl.get('ligacoes') or [])
    for k, faz in pla.items():
        if k not in app: P.append(('botão "%s"' % k[2][:40], 'falta no app (a planta tem: %s)' % faz))
        elif app[k] != faz: P.append(('botão "%s"' % k[2][:40], 'faz "%s"; a planta diz "%s"' % (app[k], faz)))
    for k, faz in app.items():
        if k not in pla: P.append(('botão "%s"' % k[2][:40], 'sobra no app (faz: %s)' % faz))
    nav = sim.navegador(pw)
    try:
        for l in lig: P += regras(pw, nav, tela, porta, l, tit0)
    finally: nav.close()
    return P
def regras(pw, nav, tela, porta, l, tit0):
    """As regras de toque do motor para UM botão, pelo que ele faz."""
    P = []; nome = 'botão "%s"' % l['nome'][:40]; faz = l['faz']
    if faz.startswith('sai para') and not __import__('re').match(r'^(‹|voltar)', l['nome'].strip(), __import__('re').I):   # o próprio botão de voltar não se confere voltando de novo
        b, pg = _abre(pw, nav, tela, porta); pg.evaluate(planta.TOCA, l['i']); y0 = pg.evaluate('()=>scrollY')   # TOCA rola até o botão: é o ponto de onde se saiu
        pg.wait_for_timeout(1000); como = pg.evaluate(VOLTA); pg.wait_for_timeout(1100)
        t = pg.evaluate(planta.TITULO); y1 = pg.evaluate('()=>scrollY'); b.close()
        if t != tit0: P.append((nome, 'o voltar (%s) foi para "%s", não para "%s"' % (como, t, tit0)))
        elif abs(y1 - y0) > 60: P.append((nome, 'o voltar não volta ao mesmo ponto (rolagem %d → %d)' % (y0, y1)))
    elif faz == 'abre ali':
        b, pg = _abre(pw, nav, tela, porta); h0 = pg.evaluate(ALT, l['i'])
        pg.evaluate(planta.TOCA, l['i']); pg.wait_for_timeout(900); h1 = pg.evaluate(ALT, l['i'])
        pg.evaluate(planta.TOCA, l['i']); pg.wait_for_timeout(900); h2 = pg.evaluate(ALT, l['i'])
        if abs(h2 - h0) > 4: P.append((nome, 'abre ali mas não fecha no 2º toque (%d → %d → %d px)' % (h0, h1, h2)))
        for _ in range(3): pg.evaluate(planta.TOCA, l['i']); pg.wait_for_timeout(120)
        pg.wait_for_timeout(900); h3 = pg.evaluate(ALT, l['i']); pg.evaluate(planta.TOCA, l['i']); pg.wait_for_timeout(900); h4 = pg.evaluate(ALT, l['i']); b.close()
        if min(abs(h3 - h0), abs(h3 - h1)) > 4: P.append((nome, 'toques rápidos deixam pela metade (%d px)' % h3))
        elif abs(h4 - h3) < 4: P.append((nome, 'depois de toques rápidos o botão para de responder'))
    elif faz.startswith('abre a janela de baixo'):
        b, pg = _abre(pw, nav, tela, porta, [l['i']]); j = pg.evaluate(JANELA)
        if not j: b.close(); P.append((nome, 'a janela não ficou aberta para conferir')); return P
        if j['fechar']: P.append((nome, 'a janela tem %s (a regra é fechar arrastando, tocando fora ou com Esc)' % ', '.join('"%s"' % x for x in j['fechar'])))
        pg.keyboard.press('Escape'); pg.wait_for_timeout(700)
        if pg.evaluate(JANELA): P.append((nome, 'a janela não fecha com Esc'))
        b.close(); b, pg = _abre(pw, nav, tela, porta, [l['i']]); j = pg.evaluate(JANELA)
        if j:
            pg.mouse.click(pg.viewport_size['width'] / 2, max(8, j['top'] / 2)); pg.wait_for_timeout(700)
            if pg.evaluate(JANELA): P.append((nome, 'a janela não fecha tocando fora'))
        b.close(); b, pg = _abre(pw, nav, tela, porta, [l['i']]); j = pg.evaluate(JANELA)
        if j:
            x = pg.viewport_size['width'] / 2; y = j['top'] + 10
            pg.mouse.move(x, y); pg.mouse.down(); pg.mouse.move(x, y + 150, steps=6); pg.mouse.move(x, y + 320, steps=6); pg.mouse.up(); pg.wait_for_timeout(800)
            if pg.evaluate(JANELA): P.append((nome, 'a janela não fecha arrastando para baixo'))
        b.close()
        if j and j['campo']:
            b, pg = _abre(pw, nav, tela, porta, [l['i']])
            campo = pg.query_selector('input:not([type=checkbox]):not([type=hidden]):not([readonly]),textarea')
            if campo and campo.is_visible():
                campo.click(); campo.type('x'); pg.keyboard.press('Escape'); pg.wait_for_timeout(700)
                if not pg.evaluate(SAIR_SEM) and not pg.evaluate(JANELA): P.append((nome, 'mudou um campo e a janela fechou sem perguntar "Sair sem salvar?"'))
            b.close()
    return P

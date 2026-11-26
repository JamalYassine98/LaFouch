# ARGUS · setor SITE · CONSERTOS que não podem voltar (PLANTAS, 26/11, pedido do dono: "só quero me certificar de que os bugs estão corrigidos").
# Cada bug do site corrigido depois de 19/11 que ainda não tinha prova no Argus ganha uma aqui, pelo FUNCIONAMENTO (não pelo desenho), então
# vale também para o design novo. Cada prova foi vista reprovando: na versão de antes do conserto (commit do catalogo anotado) ou, quando a
# falha antiga não se repete no simulador, com o estrago plantado (setor_site/estragos.py). Devolve [(nome, estado, detalhe)] como etapas.py.
# Já tinham prova antes (não se repetem aqui): versão da página = version.json (recarregar na 1ª abertura, df019e5) · pedido tenta de novo
# sozinho (88f34d3) · camadas com fundo (17f3e97).
import os, sys
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor')); sys.path.insert(0, os.path.join(A, 'setor_site'))
import lfsite, aparelhos
from etapas import OK, ACH, NC, toca, peca
def _abre(pw, nav, rota='', extra=(), **kw):
    sc = tuple(kw.pop('scripts', ())) + tuple(extra)
    return lfsite.abre(pw, navegador=nav, rota=rota, scripts=sc, **kw)
ESTADO = "()=>({url:location.pathname+location.search,layer:[...document.querySelectorAll('#layer>*')].map(e=>e.className).join('|'),fpn:[...document.querySelectorAll('.fpn')].some(e=>window.__argus.vis(e))})"
# ---------- 1 Esc = voltar (d4ab681, 20/11): os Filtros fecham com Esc e ficam no catálogo; Esc no carrinho aberto por cima volta à tela de antes ----------
# reprova em 4e9622f: Esc nos Filtros levava ao Início com o painel aberto; Esc no carrinho (aberto da conta) ia ao Início
def esc(pw, nav, **kw):
    out = []; b, pg = _abre(pw, nav, 'catalogo', **kw)
    try:
        f = pg.evaluate("()=>{const e=[...document.querySelectorAll('[data-lffil]')].find(e=>window.__argus.vis(e));if(e)e.setAttribute('data-argus-f','1');return !!e}")
        if not f or not toca(pg, '[data-argus-f]', 1200) or not pg.evaluate(ESTADO)['fpn']: out.append(('Esc fecha os Filtros e fica no catálogo', NC, 'não deu para abrir os Filtros'))
        else:
            pg.keyboard.press('Escape'); pg.wait_for_timeout(1000); s = pg.evaluate(ESTADO)
            out.append(('Esc fecha os Filtros e fica no catálogo', OK if not s['fpn'] and s['url'] == '/catalogo' else ACH, '%s%s' % (s['url'], ' · Filtros ainda abertos' if s['fpn'] else '')))
    finally: b.close()
    b, pg = _abre(pw, nav, **kw)
    try:
        if not (toca(pg, '#contabtn', 1500) and toca(pg, '#bagbtn', 1500)) or pg.evaluate(ESTADO)['url'] != '/carrinho':
            out.append(('Esc no carrinho volta à tela de antes (conta)', NC, 'não deu para abrir conta → carrinho'))
        else:
            pg.keyboard.press('Escape'); pg.wait_for_timeout(1200); s = pg.evaluate(ESTADO)
            out.append(('Esc no carrinho volta à tela de antes (conta)', OK if s['url'] == '/conta' and 'acc' in s['layer'] else ACH, 'foi para %s' % s['url']))
    finally: b.close()
    return out
# ---------- 2 janela solta aparece na tela (66daaf2, 21/11): "Abrir a câmera" do formato abre a janela fixa por cima, com fundo ----------
# reprova em 4b96bd1: a janela ficava no fim da página (y 4006), transparente, fora da vista
JANELA = """()=>{const s=[...document.querySelectorAll('.scrim')].find(e=>e.offsetWidth>0);if(!s)return null;const m=s.querySelector('.modal')||s,r=m.getBoundingClientRect(),cs=getComputedStyle(s),
fundo=getComputedStyle(m).backgroundColor;return {fixa:cs.position==='fixed',dentro:r.top>=-1&&r.bottom<=innerHeight+1&&r.height>40,fundo:!/rgba\\(\\d+, \\d+, \\d+, 0\\)|transparent/.test(fundo),y:Math.round(r.top)}}"""
def janela(pw, nav, **kw):
    b, pg = _abre(pw, nav, 'formato', **kw)
    try:
        pg.context.grant_permissions(['camera'])
        if not toca(pg, '.rzg', 2500): return [('janela da câmera do formato aparece na tela', NC, 'não achei "Abrir a câmera"')]
        j = pg.evaluate(JANELA)
        if not j: return [('janela da câmera do formato aparece na tela', ACH, 'nenhuma janela abriu')]
        ruim = [t for t, k in (('não fica fixa', 'fixa'), ('fora da tela (y %d)' % j['y'], 'dentro'), ('sem fundo', 'fundo')) if not j[k]]
        return [('janela da câmera do formato aparece na tela', ACH if ruim else OK, ', '.join(ruim))]
    finally: b.close()
# ---------- 3 o Destaque não pisca ao abrir (c6c8a56, 22/11): a 1ª foto que aparece fica, sem sumir nem trocar pela enquadrada ----------
# reprova em 17fc91b (antes do c6c8a56): aparecia a foto crua (GR3340_….jpg), sumia ~120 ms e voltava enquadrada. Olha só os primeiros 5 s (antes da 1ª troca de peça).
GRAVA = """(()=>{const L=window.__argusDst=[];const t0=performance.now();function op(e){let o=1;for(;e&&e.id!=='hdst';e=e.parentElement){const s=getComputedStyle(e);o*=+s.opacity;if(s.visibility==='hidden'||s.display==='none')return 0}return o}
function f(){const t=performance.now()-t0,H=document.getElementById('hdst');if(H){const v=[...H.querySelectorAll('img')].filter(i=>{const r=i.getBoundingClientRect();return r.width>20&&r.height>20&&i.complete&&i.naturalWidth>0&&op(i)>0.05}).map(i=>i.currentSrc||i.src);L.push([Math.round(t),v.join(' ')])}if(t<5000)requestAnimationFrame(f)}requestAnimationFrame(f)})()"""
def destaque(pw, nav, **kw):
    out = []
    for tm in ('sem', 'natal'):
        b, pg = _abre(pw, nav, extra=(GRAVA,), tematica=tm, **kw)
        try:
            pg.wait_for_timeout(4000); L = pg.evaluate('window.__argusDst||[]'); seq = []
            for t, v in L:
                if not seq or seq[-1][1] != v: seq.append((t, v))
            while seq and not seq[0][1]: seq.pop(0)
            if not seq: out.append(('Destaque não pisca ao abrir · %s' % tm, NC, 'a foto do Destaque não apareceu')); continue
            out.append(('Destaque não pisca ao abrir · %s' % tm, OK if len(seq) == 1 else ACH,
                        ' → '.join(('%d ms: %s' % (t, v.split('/')[-1][:24] or 'nenhuma foto')) for t, v in seq[:4])))
        finally: b.close()
    return out
# ---------- 4 a peça aberta por link direto tem foto (080cba4, 20/11) ----------
# a versão antiga lia as fotos de outro lugar (fotos/ do Firestore), então só o estrago prova esta conferência
def link(pw, nav, **kw):
    ref = lfsite.json.load(open(lfsite.LOJA))['docs'][0]['fields']['ref']['stringValue']
    b, pg = _abre(pw, nav, 'p/' + ref, **kw)
    try:
        pg.wait_for_timeout(2500)
        r = pg.evaluate("r=>{const m=document.querySelector('#layer .modal');if(!m)return null;const i=[...m.querySelectorAll('img')].find(i=>(i.currentSrc||i.src).includes(r));return i?{ok:i.complete&&i.naturalWidth>0&&window.__argus.vis(i)}:{ok:false}}", ref)
        return [('peça por link direto (/p/%s) abre com a foto' % ref, NC if r is None else OK if r['ok'] else ACH, '' if r else 'a peça não abriu')]
    finally: b.close()
# ---------- 5 todo cartão do "Comece por aqui" tem desenho (df28b35, 22/11: o do teste de leitura ficava vazio no PC), PT/ES × celular/PC ----------
# a falha antiga (2ª pintura com a nuvem de verdade) não se repete no simulador: o estrago prova esta conferência
CARTOES = """()=>[...document.querySelectorAll('#home button')].filter(c=>c.querySelector('.gt')&&c.offsetWidth>0).map(c=>{const d=[...c.querySelectorAll('svg')].some(v=>v.getBoundingClientRect().width>40&&v.querySelectorAll('path,ellipse,circle,use').length>5&&window.__argus.vis(v))||[...c.querySelectorAll('img')].some(i=>i.complete&&i.naturalWidth>0&&window.__argus.vis(i));return [(c.querySelector('.gt').innerText||'').replace(/\\s+/g,' ').trim().slice(0,30),d]})"""
def cartoes(pw, nav, **kw):
    out = []
    for ap, lg in ((aparelhos.DONO, 'pt'), (aparelhos.DONO, 'es'), ('PC 1440', 'pt'), ('PC 1440', 'es')):
        b, pg = _abre(pw, nav, aparelho=ap, lingua=lg, **kw)
        try:
            for y in range(0, 12000, 600): pg.evaluate('y=>scrollTo(0,y)', y); pg.wait_for_timeout(80)
            pg.wait_for_timeout(800); C = pg.evaluate(CARTOES); nome = 'cartões do "Comece por aqui" têm desenho · %s · %s' % ('celular' if ap == aparelhos.DONO else 'PC', lg.upper())
            out.append((nome, NC if not C else OK if all(d for _, d in C) else ACH, ', '.join('%s vazio' % n for n, d in C if not d) or ('%d cartões' % len(C) if C else 'nenhum cartão achado')))
        finally: b.close()
    return out
# (nome da conferência na porta, função) — entram no fim de etapas.TODAS; os estragos de cada uma em setor_site/estragos.py
NOMES = [('conserto: Esc = voltar', esc), ('conserto: janela solta', janela), ('conserto: Destaque sem piscar', destaque),
         ('conserto: peça por link direto', link), ('conserto: cartões do Comece por aqui', cartoes)]
TODAS = [f for _, f in NOMES]

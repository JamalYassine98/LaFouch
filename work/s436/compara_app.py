# S436 (20/11/2026): comparador Hoje × Proposta para o APP (CLAUDE.md regra 11) — mesma ideia do comparador do site
# (work/s430/comparador/compara.py): abre Hoje duas vezes (o que muda entre as duas é ruído), reconhece cada peça da tela
# pelo que ela é (etiqueta + texto + ordem) e lista TODA diferença: apareceu, sumiu, mudou cor/letra, mudou de lugar/tamanho.
# Também procura falhas na Proposta (texto cortado, fora da tela) e diz se são novas.
#   coleta(pg)                  → lista de peças visíveis da tela
#   difere(hoje, prop, ruido)   → lista de diferenças (dicionários)
#   texto(difs)                 → relatório em linhas
import difflib

COLETA = r"""()=>{
const W=innerWidth,out=[];
const oculto=e=>{for(let x=e;x&&x.nodeType===1;x=x.parentElement){const k=getComputedStyle(x);if(k.display==='none'||k.visibility==='hidden'||+k.opacity===0)return true}return false};
const tx=e=>[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).filter(Boolean).join(' ').replace(/\s+/g,' ');
document.querySelectorAll('body *').forEach(e=>{
  if(/^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT|PATH|G|CIRCLE|RECT|LINE|POLYLINE|POLYGON|DEFS|USE)$/i.test(e.tagName))return;
  const t=tx(e),folha=!e.children.length,ctl=/^(BUTTON|INPUT|SELECT|TEXTAREA|IMG|svg|A)$/i.test(e.tagName);
  if(!t&&!ctl&&!folha)return;
  const r=e.getBoundingClientRect();if(r.width<1||r.height<1)return;if(oculto(e))return;
  const k=getComputedStyle(e);
  out.push({tag:e.tagName.toLowerCase(),t:t||(e.getAttribute('aria-label')||e.getAttribute('placeholder')||e.value||''),cls:(e.className&&e.className.baseVal!==undefined?e.className.baseVal:e.className)||'',id:e.id||'',
    x:Math.round(r.left),y:Math.round(r.top+scrollY),w:Math.round(r.width),h:Math.round(r.height),
    cor:k.color,fundo:k.backgroundColor,letra:k.fontSize+'/'+k.fontWeight+'/'+k.fontFamily.split(',')[0],borda:k.borderTopWidth+' '+k.borderTopColor+' '+k.borderRadius,
    nl:(t&&folha)?Math.max(1,Math.round((r.height-parseFloat(k.paddingTop)-parseFloat(k.paddingBottom))/(parseFloat(k.lineHeight)||parseFloat(k.fontSize)*1.2))):1,
    corta:(e.scrollWidth>e.clientWidth+1&&k.overflowX!=='visible'&&!!t&&k.whiteSpace==='nowrap')||false,fora:r.right>W+1||r.left<-1});
});
return out}"""

def coleta(pg):
    return pg.evaluate(COLETA)

def _ch(e):
    return e['tag'] + '|' + e['t']

def _ruido(a, b):
    """índices (em a) das peças que mudam sozinhas entre duas aberturas de Hoje"""
    sm = difflib.SequenceMatcher(None, [_ch(e) for e in a], [_ch(e) for e in b], autojunk=False)
    bons = set()
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            for k in range(i2 - i1):
                if all(a[i1 + k][c] == b[j1 + k][c] for c in ('x', 'y', 'w', 'h', 'cor', 'fundo', 'letra')): bons.add(i1 + k)
    return set(range(len(a))) - bons

def difere(hoje, prop, hoje2=None):
    ruido = _ruido(hoje, hoje2) if hoje2 is not None else set()
    sm = difflib.SequenceMatcher(None, [_ch(e) for e in hoje], [_ch(e) for e in prop], autojunk=False)
    D = []
    nome = lambda e: '<%s%s> "%s"' % (e['tag'], ('#' + e['id']) if e['id'] else ('.' + e['cls'].split()[0]) if e['cls'] else '', e['t'][:50])
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            for k in range(i2 - i1):
                a, b = hoje[i1 + k], prop[j1 + k]
                if i1 + k in ruido: continue
                m = []
                if (a['x'], a['w'], a['h']) != (b['x'], b['w'], b['h']): m.append('lugar/tamanho x%d w%d h%d → x%d w%d h%d' % (a['x'], a['w'], a['h'], b['x'], b['w'], b['h']))
                for c, n in (('cor', 'cor'), ('fundo', 'fundo'), ('letra', 'letra'), ('borda', 'borda'), ('cls', 'classe')):
                    if a[c] != b[c]: m.append('%s %s → %s' % (n, a[c], b[c]))
                if m: D.append({'q': 'mudou', 'o': nome(b), 'd': '; '.join(m), 'y': b['y']})
                elif a['y'] != b['y']: D.append({'q': 'desceu' if b['y'] > a['y'] else 'subiu', 'o': nome(b), 'd': '%+d px' % (b['y'] - a['y']), 'dy': b['y'] - a['y'], 'y': b['y']})
        else:
            for a in hoje[i1:i2]:
                if hoje.index(a) not in ruido: D.append({'q': 'sumiu', 'o': nome(a), 'd': '', 'y': a['y']})
            for b in prop[j1:j2]: D.append({'q': 'apareceu', 'o': nome(b), 'd': 'cor %s · letra %s · x%d y%d w%d h%d' % (b['cor'], b['letra'], b['x'], b['y'], b['w'], b['h']), 'y': b['y']})
    # falhas da Proposta: novas ou já existiam
    velhas = set(_ch(e) for e in hoje if e['corta'] or e['fora'])
    quebraHoje = set((e['tag'], e['cls'], e['x'], e['w']) for e in hoje if e['nl'] > 1)
    for b in prop:
        if b['corta'] or b['fora']:
            D.append({'q': 'FALHA NOVA' if _ch(b) not in velhas else 'falha que já existia', 'o': nome(b), 'd': 'texto cortado' if b['corta'] else 'fora da tela', 'y': b['y']})
        if b['nl'] > 1 and _ch(b) not in set(_ch(e) for e in hoje if e['nl'] > 1):
            D.append({'q': 'FALHA NOVA' if (b['tag'], b['cls'], b['x'], b['w']) not in quebraHoje else 'quebra igual à de Hoje', 'o': nome(b), 'd': 'texto quebra em %d linhas (largura %d px)' % (b['nl'], b['w']), 'y': b['y']})
    return D

def texto(D):
    L = []
    mov = [d for d in D if d['q'] in ('desceu', 'subiu')]
    for d in D:
        if d['q'] in ('desceu', 'subiu'): continue
        L.append('%-20s %s%s' % (d['q'], d['o'], (' — ' + d['d']) if d['d'] else ''))
    if mov:
        por = {}
        for d in mov: por.setdefault(d['dy'], []).append(d)
        for dy, v in sorted(por.items()): L.append('%-20s %d peças abaixo de y=%d andaram %+d px (consequência de uma linha a mais/a menos acima)' % ('empurrado', len(v), min(x['y'] for x in v) - dy, dy))
    return L

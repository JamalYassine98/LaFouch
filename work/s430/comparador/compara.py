"""Comparador Hoje × Proposta (CLAUDE.md regra 11).

Uso:  python3 compara.py URL_HOJE URL_PROPOSTA [pasta_saida]

O que faz, em cada aparelho (celular, celular com letra 1,2×, tablet, PC) e em cada tela (Início, Catálogo, Peça):
  1. Abre Hoje ANTES e DEPOIS da Proposta. O que muda entre as duas aberturas de Hoje é ruído (relógio,
     contagem, sorteio) e é ignorado — sem lista fixa de exceções.
  2. Reconhece cada peça da tela pelo que ela É (etiqueta + texto + ordem), não pelo nome no código:
     renomear uma classe não vira "sumiu/apareceu"; a troca de classe aparece como "mudou".
  3. Lista toda diferença entre Hoje e Proposta:
       mudou de lugar ou tamanho (em relação à caixa-mãe: uma mudança não arrasta a tela inteira),
       mudou cor/fundo/letra/classe, apareceu, sumiu.
  4. Procura falhas na Proposta e diz se são NOVAS ou se já existiam Hoje:
       sobreposição (duas coisas de ler, com texto, uma em cima da outra na mesma camada de rolagem;
       texto em cima de foto e o topo fixo passando por cima do conteúdo são desenho, não falha),
       texto cortado (o texto não cabe na caixa),
       fora da tela (passa da borda do aparelho).
  5. Gera um relatório (relatorio.json + texto) e uma imagem por tela com diferença (a faixa da tela onde ela está): Hoje × Proposta,
     com as diferenças marcadas (vermelho = falha nova, laranja = diferença).
"""
import sys, os, json
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
import sys as _s, os as _o; _s.path.insert(0, _o.path.join(_o.path.dirname(_o.path.abspath(__file__)), '..', '..', 'kit')); import sim

INIT = "try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')}catch(e){}"
LETRA = "document.addEventListener('DOMContentLoaded',()=>{document.documentElement.style.fontSize='120%'});"
APAR = [  # nome, largura, altura, celular, letra 1,2×
    ('celular', 386, 858, True, False),
    ('celular letra 1,2×', 386, 858, True, True),
    ('tablet', 768, 1024, True, False),
    ('PC', 1440, 900, False, False),
]
# as telas vêm do ROTEIRO ÚNICO (roteiro_site.py): plano das ferramentas, parte 1 (dono 22/11)
_s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__))); import roteiro_site as RS
TELAS = RS.TELAS
if _o.environ.get('CMP_SO_TRES'): TELAS = TELAS[:3]   # modo antigo (só Início, Catálogo e Peça)
if _o.environ.get('CMP_TELAS'): TELAS = [t for t in TELAS if t['nome'] in _o.environ['CMP_TELAS'].split(',')]   # só algumas (conferir um esboço)

COLETA = r"""()=>{
const z=parseFloat(getComputedStyle(document.body).zoom)||1,W=innerWidth;
// para ver o que está por cima de verdade, todo elemento responde ao toque durante a coleta
const st=document.createElement('style');st.textContent='*{pointer-events:auto!important}';document.head.appendChild(st);
const oculto=e=>{for(let x=e;x;x=x.parentElement){const k=getComputedStyle(x);if(k.display==='none'||k.visibility==='hidden'||+k.opacity===0)return true}return false};
const caixa=e=>{const r=e.getBoundingClientRect();return r.width>=1&&r.height>=1&&!oculto(e)?r:null};
const texto=e=>[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).filter(Boolean).join(' ').replace(/\s+/g,' ').slice(0,40);
const fixoDe=e=>{for(let x=e;x&&x!==document.body;x=x.parentElement){const p=getComputedStyle(x).position;if(p==='fixed'||p==='sticky')return x}return null};
const dentroDeSvg=e=>!!(e.parentElement&&e.parentElement.closest('svg'));
// recorte: a caixa visível de verdade (o que sai de um carrossel ou de uma caixa com rolagem não aparece)
const recorte=e=>{let L=-1e9,T=-1e9,R=1e9,B=1e9;for(let x=e.parentElement;x&&x!==document.body;x=x.parentElement){const k=getComputedStyle(x);if(k.overflowX!=='visible'||k.overflowY!=='visible'){const r=x.getBoundingClientRect();if(k.overflowX!=='visible'){L=Math.max(L,r.left);R=Math.min(R,r.right)}if(k.overflowY!=='visible'){T=Math.max(T,r.top);B=Math.min(B,r.bottom)}}}return {L,T,R,B}};
const out=[],cont={},M=new Map();
for(const e of document.querySelectorAll('body *')){
  if(/^(SCRIPT|STYLE|LINK|META|BR|NOSCRIPT|TEMPLATE)$/.test(e.tagName))continue;
  const r=caixa(e);if(!r)continue;
  let p=e.parentElement,pr=null;while(p&&!(pr=caixa(p)))p=p.parentElement;
  const t=texto(e),tag=e.tagName.toLowerCase();
  const id=tag+'|'+t+'|'+(e.getAttribute('aria-label')||'')+'|'+(e.getAttribute('data-open')||e.getAttribute('data-fav')||'');
  cont[id]=(cont[id]||0)+1;
  const c=getComputedStyle(e),folha=!dentroDeSvg(e)&&(!!t||/^(IMG|SVG|CANVAS|VIDEO|INPUT|SELECT|TEXTAREA)$/i.test(e.tagName));
  let cortado=false;
  if(t&&c.overflow!=='visible'&&(e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+2))cortado=true;
  if(t&&c.textOverflow==='ellipsis'&&e.scrollWidth>e.clientWidth+1)cortado=true;
  const k=recorte(e),fora=folha&&Math.min(r.right,k.R)>W+1&&k.R>W+1||folha&&Math.max(r.left,k.L)<-1&&k.L<-1;
  const o={id:id+'#'+cont[id],nome:tag+(e.id?'#'+e.id:'')+[...e.classList].slice(0,3).map(x=>'.'+x).join('')+(t?' "'+t.slice(0,30)+'"':''),
    cls:[...e.classList].sort().join(' '),
    x:(r.left-(pr?pr.left:0))/z,y:(r.top-(pr?pr.top:0))/z,w:r.width/z,h:r.height/z,
    rx:r.left+scrollX,ry:r.top+scrollY,rw:r.width,rh:r.height,
    folha,cortado,fora,cor:c.color,fundo:c.backgroundColor,letra:c.fontSize+' '+c.fontWeight};
  out.push(o);if(folha&&t)M.set(e,{o,fixo:!!fixoDe(e)})}
// sobreposição = duas coisas DE LER (com texto) se cobrindo, na mesma camada de rolagem
// (texto em cima de foto é desenho; o topo fixo passando por cima do conteúdo ao rolar é desenho;
//  um embaixo de uma janela não conta: ele nem aparece na pilha do que está desenhado ali; um dentro do outro não conta)
const F=[...M.keys()],sob=[];
for(let i=0;i<F.length;i++)for(let j=i+1;j<F.length;j++){const a=F[i],b=F[j];if(a.contains(b)||b.contains(a)||M.get(a).fixo!==M.get(b).fixo)continue;
  const A=a.getBoundingClientRect(),B=b.getBoundingClientRect(),L=Math.max(A.left,B.left),R=Math.min(A.right,B.right),T=Math.max(A.top,B.top),D=Math.min(A.bottom,B.bottom);
  if(R-L<1||D-T<1)continue;const x=(L+R)/2,y=(T+D)/2;
  const pilha=document.elementsFromPoint(Math.min(Math.max(x,0),innerWidth-1),Math.min(Math.max(y,0),innerHeight-1));
  const ia=pilha.findIndex(n=>n===a||a.contains(n)),ib=pilha.findIndex(n=>n===b||b.contains(n));
  if(!(x>=0&&y>=0&&x<innerWidth&&y<innerHeight&&ia>=0&&ib>=0))continue;
  // entre os dois, uma camada com fundo (janela, cartão por cima) esconde o de baixo: aí não é sobreposição que se vê
  const cima=ia<ib?a:b,baixo=ia<ib?b:a;let tampa=false;for(let k=Math.min(ia,ib)+1;k<Math.max(ia,ib);k++){const n=pilha[k];
    // o fundo de quem contém o de baixo é o chão dele; já o fundo de uma caixa que só contém o de cima (a janela) tampa o de baixo
    if(n.contains(baixo)||cima.contains(n)||baixo.contains(n))continue;
    const bg=getComputedStyle(n).backgroundColor,m=bg.match(/rgba?\(([^)]+)\)/),al=m?(m[1].split(',')[3]===undefined?1:+m[1].split(',')[3]):0;if(al>.5||n.tagName==='IMG'){tampa=true;break}}
  if(!tampa)sob.push([M.get(a).o.id,M.get(b).o.id])}
st.remove();
return {L:out,sob}}"""


def abre(b, url, ap, tela, foto=None):
    nome, w, h, mob, letra = ap
    c = sim.contexto(b, w, h, toque=mob, movimento=False, csp_livre=False, camera=True)
    c.add_init_script(INIT)
    if letra:
        c.add_init_script(LETRA)
    if tela.get('logada'):
        c.add_init_script(RS.LOGADA)
    c.route('**cloudfunctions.net/**', lambda r, q=None: r.fulfill(status=200, content_type='application/json', body=RS.NUVEM))
    c.route('**identitytoolkit**', lambda r, q=None: r.fulfill(status=200, content_type='application/json', body='{"users":[{"emailVerified":true,"email":"maria@exemplo.com"}]}'))
    pg = c.new_page()
    pg.goto(url + tela['q'], wait_until='load')
    pg.wait_for_timeout(5500)
    for k, v in tela['passos']:
        if k == 'toca': pg.evaluate("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.offsetParent)||document.querySelector(s);e&&e.click()}", v)
        elif k == 'menu': pg.evaluate("h=>{document.querySelector('#mnb').click();setTimeout(()=>{const e=document.querySelector('#drw a[href=\"'+h+'\"]');e&&e.click()},700)}", v); pg.wait_for_timeout(700)
        elif k == 'js': pg.evaluate(v)
        elif k == 'escreve': pg.keyboard.type(v)
        pg.wait_for_timeout(v if k == 'espera' else 1500)
    # fotos por faixa (sem "página inteira": esticar a janela muda a escala do site e mexe na tela)
    L, S, fotos = [], set(), []
    alto = pg.evaluate("document.documentElement.scrollHeight")
    y = 0
    while True:
        pg.evaluate("y=>scrollTo(0,y)", y)
        pg.wait_for_timeout(150)
        r = pg.evaluate(COLETA)
        if foto:
            fn = '%s_%d.png' % (foto[:-4], len(fotos))
            pg.screenshot(path=fn)
            fotos.append((pg.evaluate("scrollY"), fn))
        if not L:
            L = r['L']
        S |= {tuple(sorted(x)) for x in r['sob']}
        y += h - 100
        if y >= alto - 50 or y > 12000:
            break
    pg.evaluate("scrollTo(0,0)")
    pg.wait_for_timeout(150)
    L = pg.evaluate(COLETA)['L']
    for e in L:
        e['sob'] = 0
    L = {'L': L, 'sob': S, 'fotos': fotos, 'alto_janela': h}
    c.close()
    return L


def falhas(T):
    """falhas da tela, cada uma com a sua identidade (para dizer se já existia Hoje)"""
    F = {}
    L = T['L']
    por = {e['id']: e for e in L}
    for a, b in T['sob']:
        if a in por and b in por:
            F[('sobreposição', a, b)] = (por[a], por[b])
    for e in L:
        if e['cortado']:
            F[('texto cortado', e['id'])] = (e,)
        if e['fora']:
            F[('fora da tela', e['id'])] = (e,)
    return F


def difs(H, P, ruido):
    h = {e['id']: e for e in H}
    q = {e['id']: e for e in P}
    out = []
    for k, e in q.items():
        if k not in h and k not in ruido:
            out.append(('apareceu', e['nome'], '', e, None))
    for k, e in h.items():
        if k not in q and k not in ruido:
            out.append(('sumiu', e['nome'], '', None, e))
    for k in h.keys() & q.keys():
        a, b = h[k], q[k]
        d = []
        for m, nm in (('x', 'esq'), ('y', 'topo'), ('w', 'larg'), ('h', 'alt')):
            if abs(a[m] - b[m]) > 1 and (k, m) not in ruido:
                d.append('%s %.0f→%.0f' % (nm, a[m], b[m]))
        for m in ('cor', 'fundo', 'letra', 'cls'):
            if a[m] != b[m] and (k, m) not in ruido:
                d.append('%s %s→%s' % ('classe' if m == 'cls' else m, a[m] or '—', b[m] or '—'))
        if d:
            out.append(('mudou', b['nome'], ', '.join(d), b, a))
    return out


def ruido_de(H1, H2):
    """o que muda entre duas aberturas de Hoje é ruído"""
    a = {e['id']: e for e in H1}
    b = {e['id']: e for e in H2}
    R = set(a.keys() ^ b.keys())
    for k in a.keys() & b.keys():
        for m in ('x', 'y', 'w', 'h'):
            if abs(a[k][m] - b[k][m]) > 1:
                R.add((k, m))
        for m in ('cor', 'fundo', 'letra', 'cls'):
            if a[k][m] != b[k][m]:
                R.add((k, m))
    return R


def faixa(T, marcas):
    """a foto da faixa onde está a primeira marca, e as marcas na posição dessa foto"""
    if not T['fotos']:
        return None, []
    alvo = min(m[0]['ry'] for m in marcas) if marcas else 0
    y, fn = min(T['fotos'], key=lambda f: abs((f[0] + T['alto_janela'] / 3) - alvo))
    return (y, fn), [(dict(c, ry=c['ry'] - y), cor) for c, cor in marcas]


def imagem(TH, TP, marcas_h, marcas_p, titulo, saida):
    fh, mh = faixa(TH, marcas_h or marcas_p)
    if not marcas_h:
        mh = []
    fp, mp = faixa(TP, marcas_p or marcas_h)
    if not marcas_p:
        mp = []
    if not fh or not fp:
        return
    f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
    def pinta(fn, M):
        I = Image.open(fn).convert('RGB')
        d = ImageDraw.Draw(I)
        for c, cor in M:
            d.rectangle([c['rx'] - 3, c['ry'] - 3, c['rx'] + c['rw'] + 3, c['ry'] + c['rh'] + 3], outline=cor, width=4)
        return I
    a, b = pinta(fh[1], mh), pinta(fp[1], mp)
    W = a.width + b.width + 24
    H = max(a.height, b.height) + 44
    out = Image.new('RGB', (W, H), 'white')
    d = ImageDraw.Draw(out)
    d.text((8, 10), 'Hoje · ' + titulo, fill='black', font=f)
    d.text((a.width + 32, 10), 'Proposta · ' + titulo, fill='black', font=f)
    out.paste(a, (0, 44))
    out.paste(b, (a.width + 24, 44))
    if out.width > 1600:
        out = out.resize((1600, int(out.height * 1600 / out.width)))
    out.save(saida, quality=82)


def main():
    uh, up = sys.argv[1], sys.argv[2]
    pasta = sys.argv[3] if len(sys.argv) > 3 else 'saida'
    os.makedirs(pasta, exist_ok=True)
    rel = []
    VERM, LAR = (220, 20, 60), (245, 140, 0)
    with sync_playwright() as p:
        b = sim.navegador(p)
        for ap in APAR:
            for tela in TELAS:
                if tela.get('ap') == 'cp' and ap[0] not in ('celular', 'PC'): continue
                tag = (ap[0] + '_' + tela['nome']).replace(' ', '_').replace(',', '')
                fh, fp = os.path.join(pasta, tag + '_hoje.png'), os.path.join(pasta, tag + '_prop.png')
                H1 = abre(b, uh, ap, tela, fh)
                P = abre(b, up, ap, tela, fp)
                H2 = abre(b, uh, ap, tela)
                R = ruido_de(H1['L'], H2['L'])
                D = difs(H1['L'], P['L'], R)
                FH, FP = falhas(H1), falhas(P)
                novas = [k for k in FP if k not in FH]
                velhas = [k for k in FP if k in FH]
                rel.append({'aparelho': ap[0], 'tela': tela['nome'],
                            'falhas_novas': [[k[0]] + [e['nome'] for e in FP[k]] for k in novas],
                            'falhas_que_ja_existiam': [[k[0]] + [e['nome'] for e in FP[k]] for k in velhas],
                            'diferencas': [[t, n, d] for t, n, d, _, _ in D],
                            'ruido_ignorado': len(R)})
                if novas or D:
                    # na Proposta: falha nova em vermelho e diferença em laranja; em Hoje: a mesma peça onde ela estava
                    mp = [(e, VERM) for k in novas for e in FP[k]] + [(e, LAR) for t, n, d, e, _ in D if e]
                    mh = [(e, LAR) for t, n, d, _, e in D if e]
                    imagem(H1, P, mh, mp, ap[0] + ' · ' + tela['nome'], os.path.join(pasta, tag + '.jpg'))
                for T in (H1, P):
                    for _, fn in T['fotos']:
                        os.remove(fn)
        b.close()
    json.dump(rel, open(os.path.join(pasta, 'relatorio.json'), 'w'), ensure_ascii=False, indent=1)
    tot = sum(len(r['falhas_novas']) for r in rel)
    print('RESULTADO:', 'REPROVADO — %d falha(s) nova(s)' % tot if tot else 'sem falha nova')
    for r in rel:
        print('== %s · %s — %d falha(s) nova(s), %d diferença(s), %d já existia(m), %d ruído(s) ignorado(s)' % (
            r['aparelho'], r['tela'], len(r['falhas_novas']), len(r['diferencas']),
            len(r['falhas_que_ja_existiam']), r['ruido_ignorado']))
        for f in r['falhas_novas']:
            print('   FALHA NOVA:', f[0], '|', '  ×  '.join(x[:60] for x in f[1:]))
        for t, n, d in r['diferencas'][:40]:
            print('   ', t, '|', n[:80], '|', d[:120])


if __name__ == '__main__':
    main()

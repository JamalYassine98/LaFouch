"""Comparador Hoje × Proposta (regra 11). Uso: compara.py URL_HOJE URL_PROPOSTA [saida.json]
Lista toda diferença visível entre as duas versões, em celular/tablet/PC, em cada tela:
  - peça que mudou de lugar ou de tamanho (medida em relação à caixa-mãe, para uma mudança não arrastar a lista inteira)
  - peça que mudou de cor, letra ou visibilidade
  - peça que apareceu ou sumiu
  - sobreposição NOVA (duas coisas visíveis uma em cima da outra que hoje não se cobrem)
"""
import sys,json
from playwright.sync_api import sync_playwright
INIT="try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')}catch(e){}"
APAR=[('celular',386,858,True),('tablet',768,1024,True),('PC',1440,900,False)]
TELAS=[('Início','/?cliente=1'),('Catálogo','/?cliente=1&r=armazones')]
COLETA=r"""()=>{
const z=parseFloat(getComputedStyle(document.body).zoom)||1,sx=scrollX,sy=scrollY;
const vis=e=>{const r=e.getBoundingClientRect();if(r.width<1||r.height<1)return null;const c=getComputedStyle(e);if(c.visibility==='hidden'||+c.opacity===0)return null;for(let x=e;x;x=x.parentElement){const k=getComputedStyle(x);if(k.display==='none'||+k.opacity===0)return null}return r};
const nome=e=>{const t=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').slice(0,28);return e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+[...e.classList].filter(c=>!/^(on|us|lx|in|vis|ani)/.test(c)).slice(0,3).map(c=>'.'+c).join('')+(t?' "'+t+'"':'')};
const out=[],cont={};
for(const e of document.querySelectorAll('body *')){if(/^(SCRIPT|STYLE|LINK|META|BR|NOSCRIPT)$/.test(e.tagName))continue;const r=vis(e);if(!r)continue;
 let p=e.parentElement,pr=null;while(p&&!(pr=vis(p)))p=p.parentElement;
 let k=nome(e),pk=p?nome(p):'';const base=pk+' > '+k;cont[base]=(cont[base]||0)+1;
 const c=getComputedStyle(e),txt=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
 out.push({k:base+' #'+cont[base],n:k,x:(r.left-(pr?pr.left:0))/z,y:(r.top-(pr?pr.top:0))/z,w:r.width/z,h:r.height/z,
  ax:(r.left)/z+sx,ay:(r.top)/z+sy,folha:txt||/^(IMG|SVG|CANVAS|VIDEO|INPUT|BUTTON)$/.test(e.tagName),
  cor:c.color,fundo:c.backgroundColor,letra:c.fontSize+' '+c.fontWeight})}
return out}"""
def cobre(a,b):
    return a['ax']<b['ax']+b['w']-1 and b['ax']<a['ax']+a['w']-1 and a['ay']<b['ay']+b['h']-1 and b['ay']<a['ay']+a['h']-1
def sobre(L):
    F=[e for e in L if e['folha']];S=set()
    for i in range(len(F)):
        for j in range(i+1,len(F)):
            a,b=F[i],F[j]
            if cobre(a,b):
                # dentro um do outro (texto dentro do botão) não conta
                ai=a['ax']>=b['ax']-.5 and a['ay']>=b['ay']-.5 and a['ax']+a['w']<=b['ax']+b['w']+.5 and a['ay']+a['h']<=b['ay']+b['h']+.5
                bi=b['ax']>=a['ax']-.5 and b['ay']>=a['ay']-.5 and b['ax']+b['w']<=a['ax']+a['w']+.5 and b['ay']+b['h']<=a['ay']+a['h']+.5
                if not(ai or bi): S.add(tuple(sorted((a['k'],b['k']))))
    return S
def roda(url):
    R={}
    with sync_playwright() as p:
        b=p.chromium.launch()
        for an,w,h,mob in APAR:
            for tn,path in TELAS:
                c=b.new_context(viewport={'width':w,'height':h},is_mobile=mob,has_touch=mob,reduced_motion='reduce');c.add_init_script(INIT);pg=c.new_page()
                pg.goto(url+path,wait_until='load');pg.wait_for_timeout(5500)
                R[(an,tn)]=pg.evaluate(COLETA);c.close()
        b.close()
    return R
H,P=roda(sys.argv[1]),roda(sys.argv[2])
rel=[]
for chave in H:
    h={e['k']:e for e in H[chave]};q={e['k']:e for e in P[chave]};lin=[]
    for k in q:
        if k not in h: lin.append(('apareceu',q[k]['n'],''))
    for k in h:
        if k not in q: lin.append(('sumiu',h[k]['n'],''))
    for k in h:
        if k in q:
            a,b=h[k],q[k];d=[]
            for m in 'xywh':
                if abs(a[m]-b[m])>1: d.append('%s %.0f→%.0f'%({'x':'esq','y':'topo','w':'larg','h':'alt'}[m],a[m],b[m]))
            for m in ('cor','fundo','letra'):
                if a[m]!=b[m]: d.append('%s %s→%s'%(m,a[m],b[m]))
            if d: lin.append(('mudou',a['n'],', '.join(d)))
    sh,sp=sobre(H[chave]),sobre(P[chave])
    for a,b in sorted(sp-sh): lin.append(('SOBREPOSIÇÃO NOVA',a.split(' > ')[-1]+'  ×  '+b.split(' > ')[-1],''))
    rel.append({'aparelho':chave[0],'tela':chave[1],'difs':lin})
json.dump(rel,open(sys.argv[3] if len(sys.argv)>3 else 'difs.json','w'),ensure_ascii=False,indent=1)
for r in rel:
    print('==',r['aparelho'],'·',r['tela'],'·',len(r['difs']),'diferença(s)')
    for t,n,d in r['difs'][:60]: print('  ',t,'|',n[:110],'|',d[:140])

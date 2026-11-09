"""Detector de colisões: em cada tela, com texto normal / grande / muito grande, acha textos, botões e fotos que se encostam
(um por cima do outro) e marca de vermelho na foto."""
from playwright.sync_api import sync_playwright
import sys,json
DET=r"""(mark)=>{
 const OK='.top,.colm,#bal,.toast,.buy,.pgbar,#cmpbar,.gzhd,.mochi';
 const permitido=o=>{for(let x=o;x;x=x.parentElement){if(x.matches&&x.matches(OK))return true;const p=getComputedStyle(x).position;if((p==='fixed'||p==='sticky')&&!x.matches('.wa,[class*=wa],a[href*="wa.me"],#wa,.wfab')){/* barras fixas (compra, topo da peça) por cima do que rola: normal */return 'fixo'}}return false};
 const nome=e=>{const t=(e.innerText||e.alt||e.getAttribute('aria-label')||e.className||e.tagName).toString().trim().replace(/\s+/g,' ');return t.slice(0,30)};
 const fixoDe=e=>{for(let x=e;x&&x!==document.body;x=x.parentElement){const p=getComputedStyle(x).position;if(p==='fixed'||p==='sticky')return x}return null};
 const out=[],vis=new Set();
 document.querySelectorAll('body *').forEach(e=>{if(e.closest('svg,.colm'))return;
   if(![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>1))return;
   let cl=false;for(let x=e.parentElement;x&&x!==document.body;x=x.parentElement){const cs=getComputedStyle(x);if(cs.overflow!=='visible'||cs.overflowY!=='visible'){const rr=x.getBoundingClientRect();const er=e.getBoundingClientRect();if(er.bottom<=rr.top+2||er.top>=rr.bottom-2||er.right<=rr.left+2||er.left>=rr.right-2){cl=true;break}}}if(cl)return;
   const g=document.createRange();g.selectNodeContents(e);const rs=[...g.getClientRects()].filter(r=>r.width>3&&r.height>3);
   rs.forEach(r=>{if(r.bottom<0||r.top>innerHeight||r.right<0||r.left>innerWidth)return;
     const pts=[[.15,.5],[.5,.5],[.85,.5]];let tap=null;
     for(const [fx,fy] of pts){const x=r.left+r.width*fx,y=r.top+r.height*fy;if(x<0||y<0||x>innerWidth||y>innerHeight)continue;const t=document.elementFromPoint(x,y);if(!t)continue;
       if(t===e||e.contains(t)||t.contains(e))continue;
       /* por cima dele há outra coisa */
       const pe=permitido(t);const fe=fixoDe(e);if(pe==='fixo'&&!fe)continue;if(pe===true)continue;
       if(getComputedStyle(t).pointerEvents==='none')continue;if(t.tagName==='IMG'||t.closest('svg')||t.closest('.ph,.gi,.stage,.big'))continue;
       tap=t;break}
     if(tap){const k=nome(e)+' × '+nome(tap);if(!vis.has(k)){vis.add(k);out.push({a:nome(e),b:nome(tap),r:[r.left,r.top,r.width,r.height]})}}})});
 /* o que não pode quebrar em 2 linhas (etiquetas, voltar, comprar) */
 document.querySelectorAll('.ph .tg,.card .stk,.pgback span,#layer .bb.p span,.gzhd .gzbk span,.vback span').forEach(e=>{const r=e.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>innerHeight)return;const g=document.createRange();g.selectNodeContents(e);const ls=new Set([...g.getClientRects()].filter(x=>x.width>2).map(x=>Math.round(x.top)));if(ls.size>1)out.push({a:'QUEBROU: '+nome(e),b:'2 linhas',r:[r.left,r.top,r.width,r.height]})});
 if(mark){document.querySelectorAll('.colm').forEach(x=>x.remove());out.forEach(o=>{const d=document.createElement('div');d.className='colm';d.style.cssText=`position:fixed;left:${o.r[0]-3}px;top:${o.r[1]-3}px;width:${o.r[2]+6}px;height:${o.r[3]+6}px;border:3px solid #e00;border-radius:6px;z-index:2147483647;pointer-events:none;background:#f003`;document.body.appendChild(d)})}
 return out}"""
FONTE="""(()=>{const k=[1,1.3,1.5][%d];if(k===1)return;window.__lfK=k;
 const ap=()=>{const L=[...document.querySelectorAll('body, body *')].filter(e=>!e.__fk);const v=L.map(e=>parseFloat(getComputedStyle(e).fontSize));L.forEach((e,i)=>{e.__fk=1;e.style.setProperty('font-size',(v[i]*k)+'px','important')})};
 const go=()=>{ap();new MutationObserver(()=>{clearTimeout(window.__fkT);window.__fkT=setTimeout(ap,30)}).observe(document.body,{subtree:true,childList:true})};
 if(document.readyState==='loading')addEventListener('DOMContentLoaded',()=>setTimeout(go,50));else go()})()"""
M="document.querySelector('[data-dopen],#mbtn,.bar [aria-label*=enu]').click()"
TELAS=[
 ('inicio',[]),
 ('inicio_meio',["scrollTo(0,700)"]),
 ('catalogo',["document.querySelector('a[href=\"#vitrine\"]').click()"]),
 ('novidades',["(document.querySelector('[data-navcat=\"nov\"],a[href*=\"nov\"]')||document.querySelector('a[href=\"#vitrine\"]')).click()"]),
 ('peca',["document.querySelector(\"[data-open='AC1050']\").click()"]),
 ('peca_rola',["document.querySelector(\"[data-open='AC1050']\").click()","(document.querySelector('#layer .pg,#layer .scrim')||document.scrollingElement).scrollBy(0,500)"]),
 ('grau',[M,"[...document.querySelectorAll('#drw [data-gzopen]')][0].click()"]),
 ('guia',[M,"[...document.querySelectorAll('#drw nav a')].find(a=>/Como comprar|Ajuda/.test(a.textContent)).click()","(document.querySelector('[data-aj=\"ajGuia\"],[data-ajk=\"guia\"]')||{click(){}}).click()"]),
]
def run(base,larg,zooms,tag):
    res={}
    with sync_playwright() as p:
        b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
        for z in zooms:
            for nome,acts in TELAS:
                pg=b.new_page(viewport={'width':larg,'height':800},is_mobile=True,has_touch=True,locale='pt-BR',device_scale_factor=2)
                pg.add_init_script(FONTE%(z[0],));pg.add_init_script("try{localStorage.setItem('lf_zoom','%d')}catch(e){}"%z[1])
                pg.goto(base);pg.wait_for_timeout(2600)
                for a in acts:
                    try: pg.evaluate(a)
                    except Exception as e: pass
                    pg.wait_for_timeout(1300)
                pg.wait_for_timeout(1600)
                c=pg.evaluate(DET,True)
                res['%s f%d s%d %dpx'%(nome,z[0],z[1],larg)]=c
                pg.screenshot(path='/home/claude/lafouch-projeto/work/s57/%s_%s_f%d_s%d_%d.png'%(tag,nome,z[0],z[1],larg))
                pg.close()
    return res
if __name__=='__main__':
    base=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8768/'
    tag=sys.argv[2] if len(sys.argv)>2 else 'hoje'
    tot=0
    for larg in [320,360,390,430]:
        r=run(base,larg,[(0,0),(1,0),(2,0),(0,1),(0,2)],tag)
        for k,v in r.items():
            tot+=len(v)
            print('%-22s %2d colisões'%(k,len(v))+('' if not v else ' → '+' | '.join(sorted(set(o['a']+' × '+o['b'] for o in v))[:5])))
    print('TOTAL',tot)

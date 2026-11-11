# Captura o Mochi acenando em alta resolução, com a boca "ω" (a do esboço 1) e os braços encaixados no corpo
# (sem o contorno do corpo passando por cima de onde o braço sai). Só na cópia de teste.
from playwright.sync_api import sync_playwright
JS = """(()=>{const m=__LFGZ.Z.m;try{m.vara(0)}catch(e){}try{m.paraGesto()}catch(e){}m.ocioso=false;try{m.acena(8)}catch(e){}})()"""
FIX = """(()=>{
  window.requestAnimationFrame=function(){return 0};  /* congela a pose */
  const el=__LFGZ.Z.m.el,svg=el.querySelector('svg'),r=el.querySelector('g.resp'),NS='http://www.w3.org/2000/svg';
  const q=s=>r.querySelector(s);window.__cp=[...svg.querySelectorAll('[clip-path],[mask]')].map(x=>x.tagName+'.'+(x.getAttribute('class')||'')+' '+(x.getAttribute('clip-path')||x.getAttribute('mask')));svg.querySelectorAll('[clip-path]').forEach(x=>{if(!x.closest('defs')&&!x.closest('g.olhos')&&!x.closest('g.ocl'))x.removeAttribute('clip-path')});window.__vb=svg.getAttribute('viewBox')+' '+svg.getAttribute('width')+'x'+svg.getAttribute('height');{let e=svg;while(e&&e!==document.body){e.style.setProperty('overflow','visible','important');e.style.setProperty('contain','none','important');e.style.setProperty('clip-path','none','important');e=e.parentElement}}svg.style.overflow='visible';el.style.setProperty('translate','140px 160px','important');
  /* boca: a "ω" fechada sorrindo */
  ['g.bO','g.bF','g.bH','g.bY','g.olhos','g.olhosZ'].forEach(s=>{const g=q(s);if(g){g.style.setProperty('display','none','important')}});['g.bW','g.olhosF'].forEach(s=>{const g=q(s);if(g){g.style.setProperty('opacity','1','important');g.style.setProperty('display','inline','important')}});
  /* braços de trás: tira o contorno do corpo só onde o braço sai (fica uma silhueta só) */
  const corpo=[...r.querySelectorAll(':scope > path')].find(p=>(p.getAttribute('fill')||'').indexOf('lfmb')>=0);
  const defs=svg.querySelector('defs'),mk=document.createElementNS(NS,'mask');mk.id='lfxm';mk.setAttribute('maskUnits','userSpaceOnUse');
  const bg=document.createElementNS(NS,'rect');bg.setAttribute('x',-500);bg.setAttribute('y',-500);bg.setAttribute('width',1200);bg.setAttribute('height',1200);bg.setAttribute('fill','#fff');mk.appendChild(bg);
  const cb=corpo.cloneNode();cb.setAttribute('fill','#000');cb.setAttribute('stroke','#fff');cb.setAttribute('stroke-width','3.2');mk.appendChild(cb);defs.appendChild(mk);
  const wrap=document.createElementNS(NS,'g');wrap.setAttribute('mask','url(#lfxm)');
  ['g.aBe','g.aBd'].forEach(s=>{const a=q(s);if(!a||getComputedStyle(a).display==='none'||+getComputedStyle(a).opacity===0)return;
    const g=document.createElementNS(NS,'g');g.setAttribute('transform',a.getAttribute('transform')||'');if(a.style.transform)g.style.transform=a.style.transform;
    const p=a.querySelector('path.p').cloneNode();p.setAttribute('stroke','none');g.appendChild(p);
    const h=a.querySelector('path.h');if(h)g.appendChild(h.cloneNode());wrap.appendChild(g)});
  corpo.parentNode.insertBefore(wrap,corpo.nextSibling.nextSibling.nextSibling);
  const bw=q('g.bW');const nb=document.createElementNS(NS,'g');nb.setAttribute('transform',bw.getAttribute('transform')||'');nb.appendChild(bw.querySelector('path').cloneNode());r.appendChild(nb);return [!!corpo,wrap.childNodes.length,bw.outerHTML.slice(0,300),[...document.querySelectorAll('*')].filter(x=>x.contains(svg)).map(x=>x.tagName+'.'+x.className+':'+getComputedStyle(x).overflow+'/'+getComputedStyle(x).clipPath).join(' | ')]})()"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1000, 'height': 1300}, device_scale_factor=6)
    pg.route('**/*', lambda r: r.continue_() if 'localhost' in r.request.url else r.abort())
    pg.add_init_script("localStorage.setItem('lf_gzmudo','1')")
    pg.goto('http://localhost:8160/'); pg.wait_for_timeout(2500); pg.evaluate("window.__lfGzAbre()"); pg.wait_for_timeout(9000)
    pg.evaluate(JS); import os; pg.wait_for_timeout(int(os.environ.get('T','590')))   # mesmo instante do quadro aprovado (braço no alto)
    pg.evaluate(FIX);print(pg.evaluate('[window.__cp,window.__vb]'))
    r = pg.evaluate("""(()=>{const m=__LFGZ.Z.m.el;const keep=new Set();let e=m;while(e){keep.add(e);e=e.parentElement}
      const st=document.head.appendChild(Object.assign(document.createElement('style'),{textContent:'html,body,#gw,#gzstg{background:transparent!important}'}));
      document.querySelectorAll('body *').forEach(x=>{if(keep.has(x)||m.contains(x))return;if([...keep].some(k=>x.contains(k)))return;x.style.visibility='hidden'});
      const R=m.getBoundingClientRect();return [R.left,R.top,R.width,R.height]})()""")
    x, y, w, h = r; pad = w * .7
    pg.wait_for_timeout(300)
    pg.screenshot(path='mochi_hd.png', omit_background=True, clip={'x': max(0, x - pad), 'y': max(0, y - pad), 'width': w + 2 * pad, 'height': h + pad * 1.6})
    b.close()

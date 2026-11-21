import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
M=r"""()=>{const vis=el=>{let L=1e9,T=1e9,R=-1e9,B=-1e9;const add=q=>{if(q.width<.5&&q.height<.5)return;L=Math.min(L,q.left);T=Math.min(T,q.top);R=Math.max(R,q.right);B=Math.max(B,q.bottom)};
 const go=n=>{if(n.nodeType==3){if(n.textContent.trim()){const r=document.createRange();r.selectNodeContents(n);[...r.getClientRects()].forEach(add)}return}if(n.nodeType!=1)return;const c=getComputedStyle(n);if(c.display=='none')return;if(/^(path|circle|line|rect|polyline)$/.test(n.tagName)){add(n.getBoundingClientRect());return}n.childNodes.forEach(go)};go(el);return {l:+L.toFixed(1),r:+R.toFixed(1),t:+T.toFixed(1),b:+B.toFixed(1),c:+((T+B)/2).toFixed(1)}};
 const v=document.querySelector('.view:not([hidden]),#v-'+(window.__LF&&__LF.S.view));const o={};
 const h=[...document.querySelectorAll('h1,h2')].filter(x=>x.getBoundingClientRect().height&&x.getBoundingClientRect().top<200)[0];
 if(h){const t=document.createRange();t.selectNodeContents(h);const q=[...t.getClientRects()][0];o.titulo={c:+((q.top+q.bottom)/2).toFixed(1),base:+q.bottom.toFixed(1),l:+q.left.toFixed(1)};
  const bt=[...document.querySelectorAll('button')].filter(x=>{const r=x.getBoundingClientRect();return r.height&&Math.abs(r.top-q.top)<40&&r.left>200})[0];if(bt){const r=bt.getBoundingClientRect();o.acao={txt:bt.textContent.trim()||bt.getAttribute('aria-label'),centroDesenho:vis(bt).c,direitaDesenho:vis(bt).r,direitaCaixa:r.right}}}
 const sec=document.querySelector('#v-ata .ataLs');if(sec){const cs=getComputedStyle(sec);const q=sec.getBoundingClientRect();o.margem=[q.left+parseFloat(cs.paddingLeft),q.right-parseFloat(cs.paddingRight)];o.linhas=[...sec.children].map(x=>{const vv=vis(x);return [x.textContent.trim().slice(0,18),vv.l,vv.r]})}
 const wr=document.querySelector('.wrap');const wq=wr.getBoundingClientRect();const wc=getComputedStyle(wr);o.wrap=[wq.left+parseFloat(wc.paddingLeft),wq.right-parseFloat(wc.paddingRight)];
 o.dicas=[...document.querySelectorAll('#v-ata .hint,#v-ata p,#v-ata .vz,#v-ata [class*=vazio],#v-ata [class*=empty]')].filter(x=>x.getBoundingClientRect().height).map(x=>[x.textContent.trim().slice(0,20),vis(x).l,getComputedStyle(x).textAlign]);
 return o}"""
CAS=[('clientes',["()=>__LF.setView('clientes')"]),('novo',["()=>__LF.setView('clientes')","()=>document.querySelector('[data-act=clinovo]').click()"]),('msg',["()=>__LF.inicioGo('ata')","()=>__LF.ACT.ataAba('msg')"]),('tab',["()=>__LF.inicioGo('ata')","()=>__LF.ACT.ataAba('tab')"])]
with sync_playwright() as pw:
  for n,ps in CAS:
    b,pg,w=ap.abre(pw,'inicio',True);w(300)
    for p in ps: pg.evaluate(p);w(1000)
    print(n,pg.evaluate(M));b.close()

import sys;sys.path.insert(0,'/home/claude/gz');from base import *
from t5 import espera,clica,ate_teste
JS=r"""(i)=>{const Z=__LFGZ.Z,L=__LFGZ.L,m=Z.m,k=L.k;clearTimeout(Z.tq);m.ocioso=false;m.paraGesto();
 const f=document.getElementById('gzfita'),j=document.getElementById('gzjan');
 const T=[['Bom dia!',17],['A casa é azul.',14.3],['O café está pronto.',12.4]];
 if(!f.dataset.s){f.dataset.s=1;f.style.transition='none';f.style.top='0';f.innerHTML=T.map((t,n)=>`<div class="gzl s99" id="x${n}" style="position:absolute;left:0;right:0;top:${(L.wh*[.2,.5,.8][n]).toFixed(0)}px;transform:translateY(-50%);font-size:${t[1]}px"><span>${t[0]}</span></div>`).join('');
  const st=document.createElement('style');st.textContent='#gw .gzl.s99{transition:opacity .35s,background .35s;border-radius:10px;padding:4px 8px;margin:0 6px;white-space:nowrap}#gw .gzl.s99.dim{opacity:.28}#gw .gzl.s99.on{background:#c46a9c26;box-shadow:0 0 0 3px #c46a9c1a}';document.head.appendChild(st);
  m.pos(L.wl+14-199*k,L.mid-70*k)}
 [0,1,2].forEach(n=>{const e=document.getElementById('x'+n);e.classList.toggle('on',n===i);e.classList.toggle('dim',n!==i)});
 const sp=document.getElementById('x'+i).querySelector('span'),S=document.getElementById('gzstg').getBoundingClientRect(),R=sp.getBoundingClientRect();
 const tx=R.left-S.left-5,ty=R.top-S.top+R.height*.55;/* ponta do dedo: logo antes da 1ª letra, na altura do meio das letras */
 const ux=(tx-m.x)/k-6,uy=(ty-m.y)/k+24,Dx=ux-98,Dy=uy-92,r=Math.sqrt(Dx*Dx+Dy*Dy-3.2*3.2),a=(Math.atan2(Dy,Dx)-Math.atan2(-3.2,r))*180/Math.PI,len=r-60.7;
 m.vara(1);m.bracos(35,a);const h=m.el.querySelector('.haste'),g=m.el.querySelector('.luva');h.setAttribute('d',`M36.7 0 H${(36.7+len).toFixed(2)}`);g.setAttribute('transform',`translate(${(36.7+len).toFixed(2)} 0) scale(.75)`);m.len=len;
 return [tx,ty,a,len]}"""
ERR=r"""(p)=>{const S=document.getElementById('gzstg').getBoundingClientRect(),d=__LFGZ.Z.m.el.querySelector('.luva .dedo').getBoundingClientRect();
 /* ponta do dedo = canto do retângulo do dedo na direção em que ele aponta */
 const a=p[2]*Math.PI/180,cx=d.left+d.width/2-S.left,cy=d.top+d.height/2-S.top,hw=10*.75*__LFGZ.L.k;return [Math.round((cx+Math.cos(a)*hw-p[0])*10)/10,Math.round((cy+Math.sin(a)*hw-p[1])*10)/10]}"""
with sync_playwright() as p:
  b,pg,errs=abre(p,perm=False,ls={'t_perm':'granted'})
  pg.goto('http://localhost:8771/?r=descubra-o-grau');pg.wait_for_timeout(1500);pg.click('#gw [data-gz=comeca]');ate_teste(pg);pg.wait_for_timeout(4500)
  pg.evaluate("__LFGZ.Z.fase='x';speechSynthesis.cancel()")
  for i in range(3):
    r=pg.evaluate(JS,i);pg.wait_for_timeout(1400);e=pg.evaluate(ERR,r)
    print(i,'ângulo %.0f°, haste %.0f'%(r[2],r[3]),'erro da ponta (px):',e)
    pg.screenshot(path=f'/tmp/p99_{i}.png',clip={'x':0,'y':150,'width':390,'height':420})

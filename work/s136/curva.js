// S139: o chapéu "abraça" a cabeça como os outros temas: a base acompanha a curva da cabeça (laterais mais baixas)
function curvaTema(t,K,DY){DY=DY||0;
 const NS='http://www.w3.org/2000/svg',sv=document.createElementNS(NS,'svg');sv.setAttribute('viewBox','-40 -40 200 200');sv.style.cssText='position:absolute;left:-9999px;width:400px;height:400px';
 sv.innerHTML=t;document.body.appendChild(sv);
 const B=(x,y)=>[x,y+DY+K*Math.pow((x-60)/46,2)];
 const R=sv.getScreenCTM().inverse();
 sv.querySelectorAll('path,ellipse,circle,rect').forEach(el=>{
  if(el.closest('defs')&&!el.closest('clipPath'))return;
  const L=el.getTotalLength(),n=Math.max(24,Math.min(240,Math.round(L*3))),m=el.getScreenCTM(),M=R.multiply(m);
  const closed=el.tagName!=='path'||/z\s*$/i.test(el.getAttribute('d'));
  let d='';for(let i=0;i<=n;i++){const p=el.getPointAtLength(L*i/n),q=new DOMPoint(p.x,p.y).matrixTransform(M),[x,y]=B(q.x,q.y);d+=(i?' L':'M')+x.toFixed(2)+' '+y.toFixed(2)}
  if(closed)d+='Z';
  const np=document.createElementNS(NS,'path');for(const a of el.attributes){if(!['d','cx','cy','r','rx','ry','x','y','width','height','transform'].includes(a.name))np.setAttribute(a.name,a.value)}
  np.setAttribute('d',d);el.replaceWith(np)});
 sv.querySelectorAll('g[transform]').forEach(g=>g.removeAttribute('transform'));
 const out=sv.innerHTML;sv.remove();return out}
function curvaCorte(y0,K){let d='M-40 '+(y0+K*Math.pow(100/46,2)).toFixed(2);for(let x=-40;x<=160;x+=4)d+=' L'+x+' '+(y0+K*Math.pow((x-60)/46,2)).toFixed(2);return d+' L160 200 L-40 200 Z'}
['maesS','paisB'].forEach(k=>{const t=TEMA_M[k],K=3.2,DY=5,c=Object.assign({},t);
 c.fr=curvaTema(t.fr,K,DY);c.tr=curvaTema(t.tr,K,DY);c.corte=curvaCorte((k==='paisB'?53:54)+DY,K);TEMA_M[k+'C']=c});

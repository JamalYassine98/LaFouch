// S140: a copa do chapéu tem que ser mais larga que a cabeça na base (a cabeça entra no chapéu), senão parece que aperta.
// Alarga só a copa (e o que está nela: fita, flor, pena), mais na base e nada no topo. A aba não muda.
function encaixe(t,sTop,sBase,yTop,yBase){
 const NS='http://www.w3.org/2000/svg',sv=document.createElementNS(NS,'svg');sv.setAttribute('viewBox','-40 -40 200 200');sv.style.cssText='position:absolute;left:-9999px;width:400px;height:400px';
 sv.innerHTML=t;document.body.appendChild(sv);
 const S=y=>{const u=Math.max(0,Math.min(1,(y-yTop)/(yBase-yTop)));return sTop+(sBase-sTop)*u};
 const R=sv.getScreenCTM().inverse();
 sv.querySelectorAll('path,ellipse,circle,rect').forEach(el=>{
  if(el.closest('defs')&&!el.closest('clipPath'))return;
  const m=R.multiply(el.getScreenCTM()),bb=el.getBBox(),top=new DOMPoint(bb.x,bb.y).matrixTransform(m).y;
  if(top>=50.5&&!el.closest('clipPath'))return;
  const L=el.getTotalLength(),n=Math.max(24,Math.min(240,Math.round(L*3)));
  const closed=el.tagName!=='path'||/z\s*$/i.test(el.getAttribute('d'));
  let d='';for(let i=0;i<=n;i++){const p=el.getPointAtLength(L*i/n),q=new DOMPoint(p.x,p.y).matrixTransform(m),x=60+(q.x-60)*S(q.y);d+=(i?' L':'M')+x.toFixed(2)+' '+q.y.toFixed(2)}
  if(closed)d+='Z';
  const np=document.createElementNS(NS,'path');for(const a of el.attributes){if(!['d','cx','cy','r','rx','ry','x','y','width','height','transform'].includes(a.name))np.setAttribute(a.name,a.value)}
  if(el.parentNode.closest&&el.parentNode.closest('g[transform]')){/* mantém a aba transformada: só assa quem mudou */}
  np.setAttribute('d',d);np.setAttribute('data-assado','1');el.replaceWith(np)});
 // tira o transform dos grupos e "assa" quem ficou sem assar
 sv.querySelectorAll('g[transform]').forEach(g=>{const m=R.multiply(g.getScreenCTM());g.querySelectorAll('path:not([data-assado]),ellipse,circle,rect').forEach(el=>{if(el.closest('defs')&&!el.closest('clipPath'))return;
   const L=el.getTotalLength(),n=Math.max(24,Math.min(240,Math.round(L*3))),mm=R.multiply(el.getScreenCTM());const closed=el.tagName!=='path'||/z\s*$/i.test(el.getAttribute('d'));
   let d='';for(let i=0;i<=n;i++){const p=el.getPointAtLength(L*i/n),q=new DOMPoint(p.x,p.y).matrixTransform(mm);d+=(i?' L':'M')+q.x.toFixed(2)+' '+q.y.toFixed(2)}if(closed)d+='Z';
   const np=document.createElementNS(NS,'path');for(const a of el.attributes){if(!['d','cx','cy','r','rx','ry','x','y','width','height','transform'].includes(a.name))np.setAttribute(a.name,a.value)}np.setAttribute('d',d);el.replaceWith(np)})});
 sv.querySelectorAll('g[transform]').forEach(g=>g.removeAttribute('transform'));
 sv.querySelectorAll('[data-assado]').forEach(e=>e.removeAttribute('data-assado'));
 const out=sv.innerHTML;sv.remove();return out}
TEMA_M.maesE=Object.assign({},TEMA_M.maesS,{fr:encaixe(TEMA_M.maesS.fr,1.0,1.105,23,50)});
TEMA_M.paisE=Object.assign({},TEMA_M.paisB,{fr:encaixe(TEMA_M.paisB.fr,1.0,1.145,14,50)});

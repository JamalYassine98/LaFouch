()=>{const R=[];const vis=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'};
const grupos=new Set();document.querySelectorAll('button,a.btn').forEach(b=>{if(!vis(b))return;if(b.closest('nav,header,.top,.bn,.pgbar,.bar'))return;grupos.add(b.parentElement)});
grupos.forEach(g=>{const bs=[...g.children].filter(c=>vis(c)&&c.matches('button,a.btn'));if(!bs.length)return;
 const s=getComputedStyle(g),r=g.getBoundingClientRect(),L=r.left+parseFloat(s.paddingLeft),Rr=r.right-parseFloat(s.paddingRight);
 const lin={};bs.forEach(b=>{const k=Math.round(b.getBoundingClientRect().top/6);(lin[k]=lin[k]||[]).push(b.getBoundingClientRect())});
 Object.values(lin).forEach(l=>{const a=Math.min(...l.map(x=>x.left)),z=Math.max(...l.map(x=>x.right));const e=a-L,d=Rr-z;if(Rr-L-(z-a)>12&&Math.abs(e-d)>8)R.push((g.id||g.className||g.tagName)+': '+l.length+' botão(ões) '+(e<d?'encostados à esquerda':'à direita')+' ('+Math.round(e)+'px × '+Math.round(d)+'px)')})});
return R}

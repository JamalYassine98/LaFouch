// ARGUS · as peças que APARECEM numa tela (para a planta e o comparador): texto, caixa, letra, cor, fundo, borda, cantos, desenho do ícone
()=>{const A=window.__argus,sx=scrollX,sy=scrollY,out=[],n1=v=>Math.round(v*10)/10;
 const geo=s=>[...s.querySelectorAll('path,circle,rect,line,polyline,polygon,ellipse')].map(x=>x.tagName.toLowerCase()+':'+['d','cx','cy','r','rx','ry','x','y','x1','y1','x2','y2','width','height','points'].filter(a=>x.hasAttribute(a)).map(a=>a+'='+x.getAttribute(a).replace(/-?\d*\.?\d+/g,m=>String(n1(+m)))).join(',')).join('|');
 for(const e of document.querySelectorAll('body *')){
  if(e.closest('[data-argus]'))continue;const tag=e.tagName.toLowerCase();if(tag==='script'||tag==='style')continue;if(e.closest('svg')&&tag!=='svg')continue;if(!A.vis(e))continue;
  const c=getComputedStyle(e),r=e.getBoundingClientRect(),t=tag==='svg'?'':A.own(e);
  const fundo=A.transp(c.backgroundColor)?'':c.backgroundColor,borda=parseFloat(c.borderTopWidth)||parseFloat(c.borderBottomWidth)?c.borderTopWidth+' '+c.borderTopColor+' / '+c.borderBottomWidth+' '+c.borderBottomColor:'';
  if(!t&&tag!=='svg'&&!fundo&&!borda&&!(tag==='input'||tag==='textarea'||tag==='img'))continue;
  const p={tipo:tag==='svg'?'icone':t?'texto':(tag==='input'||tag==='textarea')?'campo':tag==='img'?'imagem':'caixa',texto:t||(tag==='input'||tag==='textarea'?(e.placeholder||e.value||''):''),
   caixa:[n1(r.left+sx),n1(r.top+sy),n1(r.width),n1(r.height)],cor:c.color,fundo,borda,raio:c.borderRadius!=='0px'?c.borderRadius:'',
   letra:t||tag==='input'?[c.fontSize,c.fontWeight,c.fontFamily.split(',')[0].replace(/["']/g,'').trim(),c.letterSpacing,c.textTransform]:null,fixo:/fixed|sticky/.test(c.position)||!!e.closest('nav')};
  if(tag==='svg')p.icone={geo:geo(e),traco:c.strokeWidth,cor:c.stroke!=='none'?c.stroke:c.color};
  out.push(p)}
 return out}

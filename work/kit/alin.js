// Prova de alinhamento (regra de 18/11/2026): mede pelo DESENHO VISÍVEL (texto e traço do ícone), não pela caixa de toque.
// Entrada: [[seletorDoBloco, seletorDasLinhas, nome], ...]. Saída: lista de falhas {r, ex}.
(blocos)=>{
  const vis=el=>{let L=1e9,T=1e9,R=-1e9,B=-1e9,ok=0;
    const add=q=>{if(q.width<0.5&&q.height<0.5)return;ok=1;L=Math.min(L,q.left);T=Math.min(T,q.top);R=Math.max(R,q.right);B=Math.max(B,q.bottom)};
    const SH={path:1,circle:1,rect:1,line:1,polyline:1,polygon:1,ellipse:1,INPUT:1,IMG:1,SELECT:1};
    const go=n=>{if(n.nodeType==3){if(n.textContent.trim()){const r=document.createRange();r.selectNodeContents(n);[...r.getClientRects()].forEach(add)}return}
      if(n.nodeType!=1)return;const cs=getComputedStyle(n);if(cs.display=='none'||cs.visibility=='hidden'||+cs.opacity==0)return;
      if(SH[n.tagName]){add(n.getBoundingClientRect());return}
      ['::before','::after'].forEach(()=>0);n.childNodes.forEach(go)};
    go(el);
    if(!ok)return null;
    // centro da 1ª linha de texto (regra 2 compara a linha, não o bloco de 2 linhas)
    let c1=null;const tw=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let t;
    while((t=tw.nextNode())){if(!t.textContent.trim())continue;const pe=t.parentElement;const cz=getComputedStyle(pe);if(cz.display=='none'||cz.visibility=='hidden')continue;const r=document.createRange();r.selectNodeContents(t);const q=[...r.getClientRects()].filter(x=>x.width>0.5)[0];if(q){c1=(q.top+q.bottom)/2;break}}
    return {l:L,t:T,r:R,b:B,c:c1==null?(T+B)/2:c1}};
  const out=[];const f=x=>Math.round(x*10)/10;
  for(const [bs,rs,nome] of blocos){
    for(const bl of document.querySelectorAll(bs)){const bq=bl.getBoundingClientRect();if(!bq.height)continue;
      const cs=getComputedStyle(bl);const cL=bq.left+parseFloat(cs.paddingLeft)+parseFloat(cs.borderLeftWidth),cR=bq.right-parseFloat(cs.paddingRight)-parseFloat(cs.borderRightWidth);
      const rows=[...bl.querySelectorAll(rs)].filter(x=>x.getBoundingClientRect().height);
      const lefts=[],rights=[];const mid=(cL+cR)/2;
      rows.forEach((row,i)=>{const kids=[...row.children].map(vis).filter(Boolean);const v=vis(row);if(!v)return;
        if(Math.abs((v.l+v.r)/2-mid)>1.5||v.l-cL<=1)lefts.push([v.l,row]);
        if(kids.length>1){rights.push([v.r,row]);const cs2=kids.map(k=>k.c);const d=Math.max(...cs2)-Math.min(...cs2);if(d>1)out.push({r:nome+': centro vertical da linha',ex:[(row.textContent.trim().slice(0,30))+' Δ'+f(d)+'px']})}});
      lefts.forEach(([x,row])=>{if(Math.abs(x-cL)>1)out.push({r:nome+': coluna da esquerda',ex:[row.textContent.trim().slice(0,30)+' Δ'+f(x-cL)+'px']})});
      rights.forEach(([x,row])=>{if(Math.abs(x-cR)>1)out.push({r:nome+': coluna da direita',ex:[row.textContent.trim().slice(0,30)+' Δ'+f(x-cR)+'px']})});
    }}
  return out}

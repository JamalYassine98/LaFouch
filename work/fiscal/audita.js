/* Fiscal: confere a tela atual (só a parte visível) e devolve a lista de problemas. Não muda nada no site. */
(()=>{const W=innerWidth,H=innerHeight,out=[];
 const vis=e=>{if(!e||!e.getClientRects().length)return false;let x=e;while(x&&x.nodeType===1){const c=getComputedStyle(x);if(c.display==='none'||c.visibility==='hidden'||+c.opacity<.05)return false;x=x.parentElement}return true};
 const nome=e=>{let s=e.tagName.toLowerCase();if(e.id)s+='#'+e.id;const c=String(e.className&&e.className.baseVal!=null?e.className.baseVal:e.className||'').trim().split(/\s+/).filter(Boolean).slice(0,2);if(c.length)s+='.'+c.join('.');const t=(e.innerText||e.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,40);return s+(t?' “'+t+'”':'')};
 const rolaX=e=>{let x=e.parentElement;while(x&&x!==document.body){const c=getComputedStyle(x);if((c.overflowX==='auto'||c.overflowX==='scroll')&&x.scrollWidth>x.clientWidth+2)return true;x=x.parentElement}return false};
 const fixo=e=>{let x=e;while(x&&x!==document.body){const p=getComputedStyle(x).position;if(p==='fixed'||p==='sticky')return true;x=x.parentElement}return false};
 const r2=r=>[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)];
 const noTopo=(e,r)=>{for(const [fx,fy] of [[.5,.5],[.15,.5],[.85,.5]]){const x=Math.min(W-1,Math.max(0,r.left+r.width*fx)),y=Math.min(H-1,Math.max(0,r.top+r.height*fy)),t=document.elementFromPoint(x,y);if(t&&(t===e||e.contains(t)||t.contains(e)))return true}return false};
 const camada=t=>{for(let x=t;x&&x!==document.body;x=x.parentElement){const c=getComputedStyle(x);if((c.position==='fixed'||c.position==='sticky')&&area(x)>.4)return x}return null};
 const area=e=>{const r=e.getBoundingClientRect();return Math.max(0,Math.min(r.right,W)-Math.max(r.left,0))*Math.max(0,Math.min(r.bottom,H)-Math.max(r.top,0))/(W*H)};
 // 1) página rola de lado
 const sw=document.documentElement.scrollWidth;if(sw>W+1)out.push({t:'pagina_larga',d:'a página rola para o lado ('+sw+' px numa tela de '+W+')'});
 // nós de texto visíveis na tela
 const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.textContent.trim().length>1?1:2});const tx=[];let n;
 while(n=tw.nextNode()){const e=n.parentElement;if(!e||e.closest('script,style,noscript,svg'))continue;const rg=document.createRange();rg.selectNodeContents(n);const rs=[...rg.getClientRects()].filter(r=>r.width>1&&r.height>1&&r.bottom>0&&r.top<H&&r.right>0&&r.left<W);if(!rs.length||!vis(e))continue;tx.push({e,rs,txt:n.textContent.trim().slice(0,40),top:rs.some(r=>noTopo(e,r))})}
 // 2) texto para fora da tela / 3) texto coberto por outra coisa / 4) texto em cima de texto
 tx.forEach(o=>{o.rs.forEach(r=>{if((r.right>W+1||r.left<-1)&&!rolaX(o.e)&&o.top)out.push({t:'fora_da_tela',d:nome(o.e)+' sai da tela',r:r2(r)});
   const cx=Math.min(W-1,Math.max(0,r.left+r.width/2)),cy=Math.min(H-1,Math.max(0,r.top+r.height/2)),top=document.elementFromPoint(cx,cy);
   if(top&&top!==o.e&&!o.e.contains(top)&&!top.contains(o.e)){const tc=getComputedStyle(top);if((+tc.opacity>.05&&tc.pointerEvents!=='none'||top.closest('svg'))&&area(top)<.25&&!camada(top)&&o.top!==false)out.push({t:fixo(top)?'sob_fixo':'coberto',d:'“'+o.txt+'” coberto por '+nome(top),r:r2(r)})}})});
 for(let i=0;i<tx.length;i++)for(let j=i+1;j<tx.length;j++){const a=tx[i],b=tx[j];if(!a.top||!b.top||a.e===b.e||a.e.contains(b.e)||b.e.contains(a.e))continue;
   for(const ra of a.rs)for(const rb of b.rs){const ix=Math.min(ra.right,rb.right)-Math.max(ra.left,rb.left),iy=Math.min(ra.bottom,rb.bottom)-Math.max(ra.top,rb.top);
     if(ix>2&&iy>2){out.push({t:'texto_sobre_texto',d:'“'+a.txt+'” em cima de “'+b.txt+'”',r:r2({left:Math.max(ra.left,rb.left),top:Math.max(ra.top,rb.top),width:ix,height:iy})});break}}}
 // 5) texto cortado dentro da caixa (sem "…" de propósito)
 [...document.querySelectorAll('body *')].forEach(e=>{if(!e.firstChild||!vis(e))return;const r=e.getBoundingClientRect();if(r.bottom<0||r.top>H||r.width<4)return;const c=getComputedStyle(e);
   const hx=(c.overflowX==='hidden'||c.overflow==='hidden'||c.overflowX==='clip')&&e.scrollWidth>e.clientWidth+2,hy=(c.overflowY==='hidden'||c.overflow==='hidden')&&e.scrollHeight>e.clientHeight+3&&c.webkitLineClamp==='none'&&!/scroll|auto/.test(c.overflowY);
   const temTexto=[...e.childNodes].some(x=>x.nodeType===3&&x.textContent.trim().length>1);if(!temTexto||!noTopo(e,{left:Math.max(0,r.left),top:Math.max(0,r.top),width:Math.min(W,r.right)-Math.max(0,r.left),height:Math.min(H,r.bottom)-Math.max(0,r.top)}))return;
   if(hx&&c.textOverflow!=='ellipsis')out.push({t:'texto_cortado',d:nome(e)+' tem texto cortado na largura',r:r2(r)});
   else if(hx)out.push({t:'reticencias',d:nome(e)+' corta com “…”',r:r2(r)});
   if(hy)out.push({t:'texto_cortado',d:nome(e)+' tem texto cortado na altura',r:r2(r)})});
 // 6) botões pequenos demais para o dedo
 [...document.querySelectorAll('button,a[href],[role=button],input,select')].forEach(e=>{if(!vis(e))return;const r=e.getBoundingClientRect();if(r.bottom<0||r.top>H||r.width<1)return;
   if(e.tagName==='A'&&e.closest('p,li')&&getComputedStyle(e).display==='inline')return;if(!noTopo(e,r))return;if(r.width<36||r.height<36)out.push({t:'botao_pequeno',d:nome(e)+' ('+Math.round(r.width)+'×'+Math.round(r.height)+' px)',r:r2(r)})});
 // 7) botão escondido atrás de outra coisa
 [...document.querySelectorAll('button,a[href],input')].forEach(e=>{if(!vis(e))return;const r=e.getBoundingClientRect();if(r.width<4||r.height<4||r.bottom<0||r.top>H||r.right<0||r.left>W)return;
   const cx=Math.min(W-1,Math.max(0,r.left+r.width/2)),cy=Math.min(H-1,Math.max(0,r.top+r.height/2)),top=document.elementFromPoint(cx,cy);if(top&&top!==e&&!e.contains(top)&&!top.contains(e)){const tc=getComputedStyle(top);if(tc.pointerEvents!=='none'&&area(top)<.25&&!(camada(top)&&camada(top)!==camada(e)))out.push({t:fixo(top)&&!fixo(e)?'sob_fixo':'botao_coberto',d:nome(e)+' coberto por '+nome(top),r:r2(r)})}});
 // tira repetidos
 const vis2=new Set();return out.filter(x=>{const k=x.t+x.d;if(vis2.has(k))return false;vis2.add(k);return true})})()

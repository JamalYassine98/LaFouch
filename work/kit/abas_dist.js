// Fundamento 9: distância da linha das abas até o 1º desenho visível abaixo dela (texto, ícone, campo), em cada barra de abas da tela.
()=>{const out=[];const bars=[...new Set([...document.querySelectorAll('.lfAbas,[role=tablist],.s185Seg,[class*=Abas],[class*=abas],[class*=Tabs],[class*=tabs]'),...[...document.querySelectorAll('.lfLinha')].map(x=>x.parentElement)])].filter(b=>b.querySelectorAll('button,[role=tab],a').length>=2).filter(b=>{const r=b.getBoundingClientRect();return r.height>10&&r.bottom>0&&r.top<innerHeight});
 const seen=new Set();
 for(const b of bars){if([...seen].some(s=>s.contains(b)))continue;seen.add(b);const br=b.getBoundingClientRect();const bot=br.bottom;let best=1e9,quem='';
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);let n;
  while((n=w.nextNode())){if(b.contains(n))continue;let rs=[];
   if(n.nodeType==3){if(!n.textContent.trim())continue;const pe=n.parentElement;const c=getComputedStyle(pe);if(c.visibility=='hidden'||+c.opacity==0)continue;const r=document.createRange();r.selectNodeContents(n);rs=[...r.getClientRects()]}
   else if(/^(path|circle|rect|line|polyline|INPUT|IMG|SELECT)$/.test(n.tagName)){rs=[n.getBoundingClientRect()]}
   else {const c=getComputedStyle(n);const bg=c.backgroundColor;const vis=(bg&&!/rgba\(0, 0, 0, 0\)|transparent/.test(bg))||parseFloat(c.borderTopWidth)>0;if(vis&&c.display!='none'&&n!==document.body&&!n.contains(b)){const q=n.getBoundingClientRect();if(q.height<innerHeight*0.9)rs=[q]}}
   for(const q of rs){if(q.width<1&&q.height<1)continue;if(q.top>=bot-0.5&&q.left<br.right&&q.right>br.left&&q.top-bot<best){best=q.top-bot;quem=(n.textContent||n.tagName).trim().slice(0,24)}}}
  out.push({abas:[...b.querySelectorAll('button,[role=tab]')].map(x=>x.textContent.trim()).filter(Boolean).slice(0,4).join('/'),dist:Math.round(best),primeiro:quem})}
 return out}

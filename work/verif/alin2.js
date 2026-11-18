// Prova de alinhamento automática (v2): acha sozinha as LINHAS (flex com itens nas pontas) e mede pelo desenho visível.
()=>{const W=innerWidth,H=innerHeight,cs=e=>getComputedStyle(e);const out=[];
 const vis=el=>{let L=1e9,T=1e9,R=-1e9,B=-1e9,ok=0,fs=0,tb=null,lin=0;const add=(q,f)=>{if(q.width<.5&&q.height<.5)return;ok=1;L=Math.min(L,q.left);T=Math.min(T,q.top);R=Math.max(R,q.right);B=Math.max(B,q.bottom)};
  const go=n=>{if(n.nodeType==3){if(n.textContent.trim()){const r=document.createRange();r.selectNodeContents(n);const rs=[...r.getClientRects()].filter(q=>q.width>.5);rs.forEach(add);lin+=rs.length;if(rs[0]&&tb==null){const f=parseFloat(cs(n.parentElement).fontSize);fs=f;tb=rs[0].bottom-0.21*f}}return}
   if(n.nodeType!=1)return;const c=cs(n);if(c.display=='none'||c.visibility=='hidden'||+c.opacity<.05)return;
   if(/^(path|circle|line|rect|polyline|polygon|ellipse|INPUT|IMG|SELECT)$/i.test(n.tagName)){add(n.getBoundingClientRect());return}
   if((n!==el||n.tagName=='BUTTON')&&(c.backgroundColor!='rgba(0, 0, 0, 0)'||parseFloat(c.borderTopWidth)>0||(c.boxShadow&&c.boxShadow!='none'))&&n.getBoundingClientRect().height<80){add(n.getBoundingClientRect())}
   n.childNodes.forEach(go)};go(el);return ok?{l:L,r:R,t:T,b:B,c:(T+B)/2,base:tb,fs,soTexto:lin==1&&!el.querySelector('svg,input,select,button,img')&&!(cs(el).backgroundColor!='rgba(0, 0, 0, 0)')&&!(cs(el).boxShadow&&cs(el).boxShadow!='none')}:null};
 const ref=e=>{const j=e.closest('.ljCorpo')||e.closest('.ljJn,.modal-box')||e.closest('.wrap')||document.body;const c=cs(j),q=j.getBoundingClientRect();return [q.left+parseFloat(c.paddingLeft)+parseFloat(c.borderLeftWidth),q.right-parseFloat(c.paddingRight)-parseFloat(c.borderRightWidth)]};
 const nome=e=>(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,34);
 const jan=[...document.querySelectorAll('.ljJn,.modal-box,[aria-modal=true]')].filter(d=>{const r=d.getBoundingClientRect();return r.height>40&&cs(d).display!='none'&&cs(d).visibility!='hidden'}).pop();
 const linhas=[...document.querySelectorAll('body *')].filter(e=>{if(jan&&!jan.contains(e))return false;const c=cs(e);if(c.display!='flex'||c.flexDirection.startsWith('column'))return false;if(!/space-between|flex-end/.test(c.justifyContent)&&!e.matches('.cxL,.sl,.pr418,.rw77,.lv418N'))return false;const r=e.getBoundingClientRect();if(r.width<W*0.5||r.height<14||r.bottom<0||r.top>H)return false;if(e.closest('nav,.bnav,[role=tablist],.lfAbas'))return false;return [...e.children].filter(k=>vis(k)).length>=2});
 for(const e of linhas){const ks=[...e.children].map(k=>[k,vis(k)]).filter(x=>x[1]);const [L,R]=ref(e);const a=ks[0][1],z=ks[ks.length-1][1];
  if(Math.abs(z.r-R)>1&&z.r<R+1&&R-z.r<40)out.push({r:'1 coluna da direita',ex:[nome(e),'Δ'+(z.r-R).toFixed(1)+'px']});
  if(Math.abs(a.l-L)>1&&a.l-L<40&&a.l>L-1)out.push({r:'3 coluna da esquerda',ex:[nome(e),'Δ'+(a.l-L).toFixed(1)+'px']});
  const tx=ks.filter(x=>x[1].soTexto&&x[1].base!=null),ot=ks.filter(x=>!x[1].soTexto);
  if(tx.length>=2){const fsz=new Set(tx.map(x=>x[1].fs));const bs=tx.map(x=>x[1].base);const d=Math.max(...bs)-Math.min(...bs);if(fsz.size>1&&d>1.5)out.push({r:'7 linha de base',ex:[nome(e),'Δ'+d.toFixed(1)+'px']})}
  if(ks.length>=2){const h=e.querySelector('h1,h2');let rc;if(h){const r=document.createRange();r.selectNodeContents(h);const q=[...r.getClientRects()][0];rc=q?(q.top+q.bottom)/2:null}else rc=a.c;
   if(rc!=null)for(const [k,v] of ks.slice(1)){if(tx.length>=2&&v.soTexto)continue;const d=Math.abs(v.c-rc);if(d>1)out.push({r:'2 centro vertical',ex:[nome(e),'Δ'+d.toFixed(1)+'px']})}}
 }
 return out}

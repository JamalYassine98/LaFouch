// ARGUS · o que o medidor de família precisa de UMA tela (regras 13–17): textos, linhas, botões, movimento, telas vazias,
// paleta oficial (lida do CSS do próprio app), espaços entre blocos, estados (avisos, erros, carregando) e o fundo atrás de cada texto (contraste)
()=>{const A=window.__argus,vw=innerWidth,sy=scrollY;
 const out={pecas:[],linhas:[],botoes:[],trans:[],vazios:[],paleta:[],secoes:[],estados:[],zoom:parseFloat(getComputedStyle(document.documentElement).zoom)||1};
 const rs=getComputedStyle(document.documentElement),nomes=new Set();for(let i=0;i<rs.length;i++)if(rs[i].startsWith('--'))nomes.add(rs[i]);
 for(const sh of document.styleSheets){let rr;try{rr=sh.cssRules}catch(e){continue}for(const r of rr||[]){for(const m of (r.cssText||'').matchAll(/(--[\w-]+)\s*:/g))nomes.add(m[1])}}
 for(const k of nomes){const v=rs.getPropertyValue(k).trim();if(/^#|^rgb|^hsl/.test(v))out.paleta.push(A.rgb(v))}
 const pagina=[document.body,document.documentElement].map(x=>getComputedStyle(x).backgroundColor).find(c=>!A.transp(c))||'rgb(255, 255, 255)';
 const atras=e=>{for(let p=e;p&&p.nodeType===1;p=p.parentElement){const b=getComputedStyle(p).backgroundColor;if(!A.transp(b))return b}return pagina};
 const ehToque=e=>e.matches('button,a[href],[data-act],[role=button],input:not([type=hidden]),select')&&!(e.parentElement&&e.parentElement.closest('button,a[href],[role=button]'));
 for(const e of document.querySelectorAll('body *')){
  if(e.closest('[data-argus]'))continue;const tag=e.tagName.toLowerCase();if(e.closest('svg')&&tag!=='svg')continue;if(!A.vis(e))continue;
  const c=getComputedStyle(e),r=e.getBoundingClientRect(),t=A.own(e);
  if(c.transitionDuration&&c.transitionDuration.split(',').some(d=>parseFloat(d)>0.01))out.trans.push([c.transitionDuration,c.transitionTimingFunction,(e.className&&e.className.baseVal===undefined?String(e.className):'').slice(0,30)]);
  if(t){const rg=document.createRange(),tops=new Set();for(const n of e.childNodes)if(n.nodeType===3&&n.textContent.trim()){rg.selectNodeContents(n);for(const q of rg.getClientRects())if(q.width>0.5)tops.add(Math.round(q.top))}
   const b=e.closest('button,[role=button],a[href]');
   out.pecas.push({t:t.slice(0,80),x:r.left,y:r.top+sy,w:r.width,h:r.height,fs:c.fontSize,fw:c.fontWeight,ff:c.fontFamily.split(',')[0].replace(/["']/g,''),cor:c.color,ls:c.letterSpacing,tt:c.textTransform,
    linhas:Math.max(1,tops.size),corta:(e.scrollWidth>e.clientWidth+1&&/(hidden|clip)/.test(c.overflow+c.overflowX))||(c.textOverflow==='ellipsis'&&e.scrollWidth>e.clientWidth+1),fora:r.right>vw+1||r.left<-1,tag,
    umalinha:tag==='h1'||(!!b&&(b.getBoundingClientRect().width>=vw*0.6||b.getBoundingClientRect().height<56)),secao:tag!=='button'&&parseFloat(c.fontSize)<=13&&c.textTransform==='uppercase'&&parseFloat(c.letterSpacing)>0.5,titulo:tag==='h1',
    atras:atras(e),opac:+c.opacity})}
  if(ehToque(e)&&!A.nav(e)){const tx=A.nome(e),svg=e.querySelector('svg'),sr=svg&&A.vis(svg)?svg.getBoundingClientRect():null,tit=[...e.querySelectorAll('b,strong,span,div')].find(x=>A.own(x)&&A.vis(x)),tr=tit?tit.getBoundingClientRect():null;
   (r.width>=vw*0.6?out.linhas:out.botoes).push({t:tx,x:r.left,y:r.top+sy,w:r.width,h:r.height,raio:parseFloat(c.borderTopLeftRadius)||0,borda:parseFloat(c.borderTopWidth)||0,fundo:c.backgroundColor,
    ic:sr?[sr.left,sr.top+sy,sr.width,sr.height,getComputedStyle(svg).strokeWidth]:null,tx:tr?[tr.left,tr.top+sy,tr.width,tr.height,getComputedStyle(tit).fontSize,getComputedStyle(tit).fontWeight]:null,
    pai:(()=>{for(let q=e.parentElement;q&&q!==document.body;q=q.parentElement){if([...q.querySelectorAll('button,a[href],[data-act],[role=button]')].filter(x=>A.vis(x)&&x.getBoundingClientRect().width>=vw*0.6).length>=2){q.__argusId=q.__argusId||('b'+Math.random().toString(36).slice(2,8));return q.__argusId}}return ''})(),txt:tx})}
  if(tag==='svg'&&r.width>=16&&!A.nav(e))out.pecas.push({t:'',icone:1,x:r.left,y:r.top+sy,w:r.width,h:r.height,traco:c.strokeWidth});
  // estados (regra 17: carregando, erro, sem internet, salvo iguais em todo lugar): avisos e faixas do app
  if(e.matches('#lfToast,[role=alert],[role=status],.lfSalvoErr,.toast,[class*=aviso],[class*=offline],[class*=semNet],[class*=carreg],[class*=spinner]')&&!e.parentElement.closest('[role=alert],[role=status],.toast'))
   out.estados.push({tipo:(e.getAttribute('role')||e.className||tag).toString().slice(0,30),t:A.txt(e).slice(0,60),fs:c.fontSize,cor:c.color,fundo:c.backgroundColor,raio:c.borderRadius,pos:c.position,embaixo:r.bottom>=innerHeight-120})
 }
 for(const v of document.querySelectorAll('.lfVazio'))if(A.vis(v))out.vazios.push({ic:!!v.querySelector('svg'),b:!!v.querySelector('b'),s:!!v.querySelector('span')});
 for(const e of document.querySelectorAll('body *')){if(!A.vis(e)||e.closest('.lfVazio,#mainnav,nav,button,a,[data-act],[role=button],label'))continue;const t=A.own(e);
  if(!/^(Nenhum|Nenhuma|Nada)\b/.test(t)||t.length>=90||t.includes(' · '))continue;   // tela vazia é a FRASE solta, não o resumo de uma linha
  const sec=e.parentElement&&e.parentElement.closest('section,.view,.cnt');if(!(sec&&[...sec.querySelectorAll('button,[data-act]')].some(x=>A.vis(x)&&x.getBoundingClientRect().width>=vw*0.6)))out.vazios.push({solto:t.slice(0,60)})}
 // L3: espaço entre BLOCOS que vêm um embaixo do outro (mesma margem esquerda)
 const V=document.querySelector('.view:not([hidden])')||document.body,BLOCO='section,div,ul,ol,li,p,h1,h2,h3,form,fieldset,details,table,button,a';
 const v2=e=>{const r=e.getBoundingClientRect();return r.width>1&&r.height>1&&getComputedStyle(e).display!=='none'};
 for(const q of [V,...V.querySelectorAll('*')]){if(q.closest('svg,#mainnav,nav,button,a,[data-act],[role=button]'))continue;if(q.getBoundingClientRect().width<vw*0.6)continue;
  const k=[...q.children].filter(e=>v2(e)&&e.matches(BLOCO)&&e.getBoundingClientRect().height>=24);if(k.length<2)continue;
  const R=k.map(e=>e.getBoundingClientRect());let pilha=true;for(let i=1;i<R.length;i++)if(R[i].top<R[i-1].bottom-1||Math.abs(R[i].left-R[0].left)>2){pilha=false;break}
  if(!pilha)continue;for(let i=1;i<R.length;i++)out.secoes.push([R[i-1].bottom+sy,R[i].top+sy,(k[i].className&&k[i].className.baseVal===undefined?String(k[i].className):k[i].tagName).slice(0,24)||k[i].tagName])}
 out.atravessa=A.atravessa();   // texto que aparece através de outro (camada sem fundo ou encavalado)
 return out}

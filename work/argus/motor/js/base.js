// ARGUS · base comum (UM lugar só). Entra ANTES do app em toda página que o Argus abre (simulador e Android emulado).
// Todas as medidas usam estas funções: o que é visível, o texto próprio de uma peça, o que se pode tocar, a linha de uma peça,
// o nome da tela, a janela de baixo. Mudou aqui, mudou em todas as ferramentas.
(()=>{if(window.__argus)return;
const A={};
// enfeite vivo da página (data-lfvivo: neve, pétalas da temática — regra do próprio site: só existe na página viva) não é peça da tela
A.vis=e=>{if(!e||e.nodeType!==1||e.closest('[data-lfvivo]'))return false;const r=e.getBoundingClientRect();if(r.width<1||r.height<1)return false;for(let p=e;p&&p.nodeType===1;p=p.parentElement){const c=getComputedStyle(p);if(c.display==='none'||c.visibility==='hidden'||+c.opacity===0)return false}return true};
A.own=e=>[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').replace(/\s+/g,' ').trim();
A.txt=e=>(e.innerText||e.textContent||'').replace(/\s+/g,' ').trim();
A.nome=e=>(e.getAttribute('aria-label')||A.txt(e)||e.value||'').replace(/\s+/g,' ').trim().slice(0,60);
A.transp=c=>!c||c==='transparent'||/rgba\(.*,\s*0\)$/.test(c);
A.rgb=v=>{const i=document.createElement('i');document.body.appendChild(i);i.style.color=v;const c=getComputedStyle(i).color;i.remove();return c};
A.TOC='button,a[href],[data-act],[role=button],summary,input[type=checkbox],select';
A.nav=e=>!!e.closest('nav,#mainnav,#nvBar,aside');
// o que se pode tocar na tela (sem a barra de abas; um botão dentro de outro conta uma vez)
A.tocaveis=()=>[...document.querySelectorAll(A.TOC)].filter(e=>A.vis(e)&&!A.nav(e)&&!(e.parentElement&&e.parentElement.closest('button,a[href],[data-act],[role=button]')));
// a linha de uma peça: o maior bloco em volta dela que ainda é uma linha (até 110 px de altura)
A.linha=e=>{let p=e,best=e;for(let i=0;i<8&&p.parentElement;i++){p=p.parentElement;if(p.getBoundingClientRect().height>110)break;best=p}return best};
A.bloco=e=>e.closest('section,details,li')||e.parentElement;
A.titulo=()=>{const h=[...document.querySelectorAll('h1')].find(e=>A.vis(e));if(!window.__LF)return decodeURIComponent(location.pathname+location.search);   // no site, a tela é o endereço (o título do destaque muda sozinho)
 const v=(__LF.S&&__LF.S.view)||'';return (h?A.txt(h):'')+' ['+v+']'};
A.fixos=()=>[...document.querySelectorAll('body *')].filter(x=>getComputedStyle(x).position==='fixed'&&A.vis(x)&&!A.nav(x)&&!x.closest('[data-argus]'));
// a janela de baixo aberta (presa embaixo, larga e alta), ou null
// a janela de baixo é o PAINEL preso embaixo; se o que está preso é a tela inteira (o fundo escurecido), o painel é o de dentro dele
A.painel=x=>{const r=x.getBoundingClientRect();return r.bottom>=innerHeight-2&&r.width>=innerWidth*0.6&&r.height>=innerHeight*0.2};
// TELA POR CIMA: uma camada presa, opaca, que cobre a tela inteira (regra 16: não existe — ou é tela com "‹", ou janela de baixo)
A.opaca=x=>{const m=/rgba?\(([^)]+)\)/.exec(getComputedStyle(x).backgroundColor);if(!m)return false;const v=m[1].split(',').map(parseFloat);return v.length<4||v[3]>=0.9};
// TEXTO QUE ATRAVESSA (25/11: o site ficou com as camadas transparentes — as cores base sumiram do :root e o menu e a peça abriam
// por cima da tela sem fundo): dois textos visíveis no mesmo lugar, e nada com fundo entre o de cima e o de baixo = o de baixo
// aparece através do de cima. Pega camada sem fundo e textos encavalados na mesma camada. Só o que está na tela agora.
A.atravessa=()=>{const T=[];
 // a caixa do TEXTO (as letras), não a do elemento: um botão de 44 px com a palavra no meio não "encosta" no título de baixo (26/11)
 const letras=e=>{let L=1e9,Tp=1e9,R=-1e9,B=-1e9;for(const n of e.childNodes){if(n.nodeType!==3||!n.textContent.trim())continue;const g=document.createRange();g.selectNodeContents(n);for(const q of g.getClientRects()){if(q.width<1||q.height<1)continue;L=Math.min(L,q.left);Tp=Math.min(Tp,q.top);R=Math.max(R,q.right);B=Math.max(B,q.bottom)}}
  return R>L?{left:L,top:Tp,right:R,bottom:B,width:R-L,height:B-Tp}:null};
 for(const e of document.querySelectorAll('body *')){if(!A.own(e)||!A.vis(e)||e.closest('svg,[data-argus]'))continue;const r=letras(e);if(!r)continue;
  if(r.bottom<=0||r.top>=innerHeight||r.right<=0||r.left>=innerWidth)continue;T.push([e,r])}
 const fundo=x=>{const c=getComputedStyle(x);return A.opaca(x)||(c.backgroundImage&&c.backgroundImage!=='none'&&!/^url\(.*\.svg/.test(c.backgroundImage))||c.backdropFilter&&c.backdropFilter!=='none'};
 const out=[],vistos=new Set();
 for(let i=0;i<T.length;i++)for(let j=i+1;j<T.length;j++){const [a,ra]=T[i],[b,rb]=T[j];if(a.contains(b)||b.contains(a))continue;
  const L=Math.max(ra.left,rb.left),R=Math.min(ra.right,rb.right),C=Math.max(ra.top,rb.top),B=Math.min(ra.bottom,rb.bottom);if(R-L<3||B-C<3)continue;
  const ar=(R-L)*(B-C);if(ar<40||ar<0.25*Math.min(ra.width*ra.height,rb.width*rb.height))continue;
  const x=Math.min(innerWidth-1,Math.max(0,(L+R)/2)),y=Math.min(innerHeight-1,Math.max(0,(C+B)/2)),S=document.elementsFromPoint(x,y);
  const ia=S.findIndex(n=>n===a||a.contains(n)),ib=S.findIndex(n=>n===b||b.contains(n));
  let cima=a,baixo=b,ic=ia,ix=ib;if(ia<0&&ib<0)continue;if(ia<0||(ib>=0&&ib<ia)){cima=b;baixo=a;ic=ib;ix=ia}
  if(ix<0)ix=S.length;   // o de baixo nem é achado pelo dedo: confere tudo que está por cima
  if(S.slice(0,ix).some(n=>!n.contains(baixo)&&!baixo.contains(n)&&fundo(n)))continue;   // algo com fundo cobre o de baixo
  const k=A.txt(cima).slice(0,30)+' × '+A.txt(baixo).slice(0,30);if(!vistos.has(k)){vistos.add(k);out.push({cima:A.txt(cima).slice(0,40),baixo:A.txt(baixo).slice(0,40),caixa:[L,C+scrollY,R-L,B-C]})}}
 return out.slice(0,20)};
A.porCima=()=>A.fixos().filter(x=>{const r=x.getBoundingClientRect();return r.top<=5&&r.height>=innerHeight*0.9&&r.width>=innerWidth*0.9&&A.opaca(x)&&!(window.__LF&&x.closest('.view'))}).map(x=>{const t=[...x.querySelectorAll('h1,h2,h3,b')].find(A.vis);return t?A.txt(t).slice(0,60):'(sem título)'});
// O SINAL de um botão: "›" (sai para outra tela) ou "⌄"/"⌃" (abre ali) — pelo texto ou pelo desenho da setinha como aparece na tela
// o botão de voltar: "‹" (texto ou setinha) ou o nome "voltar"
A.voltar=e=>A.sinal(e)==='‹'||/^voltar/i.test((e.getAttribute('aria-label')||e.textContent||'').trim());
A.sinal=e=>{const t=A.txt(e);if(/^\s*‹/.test(t))return '‹';if(/›\s*$/.test(t))return '›';if(/[⌄∨]\s*$/.test(t))return '⌄';
 const ps=[e,...e.querySelectorAll('*')].flatMap(x=>[getComputedStyle(x,'::after').content,getComputedStyle(x,'::before').content]).join('');   // setinha desenhada pelo CSS
 if(/›/.test(ps))return '›';if(/[⌄∨]/.test(ps)||(e.hasAttribute('aria-expanded')&&!e.hasAttribute('aria-haspopup')&&t.length>2))return '⌄';   // aria-expanded numa linha com texto = é uma dobra (o botão de menu, só ícone, não)
 const r=e.getBoundingClientRect();
 for(const p of [...e.querySelectorAll('svg path,svg polyline')].reverse()){const s=p.closest('svg'),q=s.getBoundingClientRect();if(!A.vis(s)||q.width>28)continue;const fim=q.left>=r.left+r.width*0.6,ini=q.right<=r.left+r.width*0.4+28;if(!fim&&!ini)continue;   // a setinha fica no fim (› ⌄) ou no começo (‹)
  if(p.tagName==='path'&&((p.getAttribute('d')||'').match(/[Mm]/g)||[]).length!==1)continue;let L=0;try{L=p.getTotalLength()}catch(x){};if(!L)continue;
  const M=p.getScreenCTM(),pt=k=>{const a=p.getPointAtLength(L*k);return {x:a.x*M.a+a.y*M.c+M.e,y:a.x*M.b+a.y*M.d+M.f}},a=pt(0),m=pt(.5),b=pt(1),dx=m.x-(a.x+b.x)/2,dy=m.y-(a.y+b.y)/2;
  if(dx>2&&Math.abs(dx)>Math.abs(dy)*2&&fim)return '›';if(dx<-2&&Math.abs(dx)>Math.abs(dy)*2&&ini)return '‹';if(Math.abs(dy)>2&&Math.abs(dy)>Math.abs(dx)*2)return dy>0?'⌄':'⌃'}
 return ''};
A.janela=()=>{const pc=A.fixos().filter(x=>{const r=x.getBoundingClientRect();return r.top<=5&&r.height>=innerHeight*0.9&&A.opaca(x)});let j=A.fixos().filter(x=>A.painel(x)&&!pc.some(o=>o===x||o.contains(x))).pop();if(!j)return null;
 let tipo='baixo';
 if(j.getBoundingClientRect().top<5){const d=[...j.querySelectorAll('*')].filter(x=>A.vis(x)&&A.painel(x)&&x.getBoundingClientRect().top>=5);
  if(d.length)j=d.sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top)[0];
  else{const c=[...j.children].filter(x=>A.vis(x)&&x.getBoundingClientRect().width>=innerWidth*0.6).sort((a,b)=>b.getBoundingClientRect().height-a.getBoundingClientRect().height)[0];if(c){j=c;tipo='meio'}}}   // caixa solta no meio da tela: não é a janela de baixo
 const r=j.getBoundingClientRect(),bts=[...j.querySelectorAll('button,[role=button],a')].filter(A.vis).map(A.nome);
// volta = a camada tem "‹ voltar" em cima: é outra TELA (regra 16: lugar), não a janela de baixo (tarefa)
 const volta=[...j.querySelectorAll('button,a,[data-act]')].some(e=>A.vis(e)&&e.getBoundingClientRect().top<r.top+140&&A.voltar(e));
 return {el:j,tipo,volta,top:r.top,titulo:A.txt(j.querySelector('h1,h2,h3,b')||j).slice(0,60),fechar:bts.filter(t=>/^(×|✕|x|fechar)$/i.test(t)),salvar:bts.some(t=>/^salvar$/i.test(t)),campo:!!j.querySelector('input:not([type=checkbox]):not([type=hidden]),textarea')}};
// O TOQUE (motor/dedo.py põe o dedo): A.alvo rola até o botão, tira o RETRATO de antes e diz onde pôr o dedo (o meio do botão).
// Se no meio do botão há outra coisa por cima, é ela que o dedo pega — como no celular: volta {coberto}.
A.alvo=i=>{const e=A.tocaveis()[i];if(!e)return null;e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();
 const x=Math.min(innerWidth-2,Math.max(1,r.left+r.width/2)),y=Math.min(innerHeight-2,Math.max(1,r.top+r.height/2)),h=document.elementFromPoint(x,y);
 window.__argusAntes=A.retrato();window.__argusAntes.alvo=A.estado(e);const sy=scrollY;
 const toque=navigator.maxTouchPoints>0;if(h&&h!==e&&!e.contains(h))return {coberto:A.nome(h)||h.tagName.toLowerCase(),x,y,toque,sy};return {x,y,toque,sy}};   // sy = a rolagem de onde se toca
// estado de um botão que se vê (escolhido, aberto, marcado)
A.estado=e=>['aria-pressed','aria-selected','aria-expanded','aria-checked'].map(a=>e.getAttribute(a)||'').join(',')+(e.classList.contains('on')?',on':'')+(e.checked?',marcado':'');
// caixas soltas por cima da tela que têm botões (menus), fora a janela de baixo e a barra de abas
A.flutuantes=()=>{const L=[...document.querySelectorAll('body *')].filter(x=>{const c=getComputedStyle(x);if(c.position!=='fixed'&&c.position!=='absolute')return false;if(!A.vis(x)||A.nav(x)||A.painel(x)||x.closest('[data-argus]'))return false;
 const r=x.getBoundingClientRect();return r.width>=80&&r.height>=40&&r.width<innerWidth*0.95&&[...x.querySelectorAll(A.TOC)].some(A.vis)});return L.filter(x=>!L.some(o=>o!==x&&o.contains(x)))};
// o RETRATO da tela: nome, estados dos botões, caixas soltas, janela e os textos que se veem
A.retrato=()=>{const vist={},est={};for(const e of [...document.querySelectorAll(A.TOC+',[role=tab]')].filter(A.vis)){const n=A.nome(e);vist[n]=(vist[n]||0)+1;est[n+'#'+vist[n]]=A.estado(e)}
 const fx=A.fixos(),tx={};for(const e of document.querySelectorAll('body *')){if(!A.vis(e)||A.nav(e))continue;const t=A.own(e);if(t)tx[t]=fx.some(f=>f.contains(e))}   // tx[texto] = está numa camada presa (aviso)
 const j=A.janela();return {tit:A.titulo(),est,flut:A.flutuantes().map(A.txt),jan:j&&!j.volta?j.titulo:null,tela:j&&j.volta?j.titulo:null,janTop:j?j.top:0,cima:A.porCima(),tx}};
// O QUE O TOQUE FEZ: o retrato de agora contra o de antes do toque
A.depois=()=>{const a=window.__argusAntes;if(!a)return 'não achado';const d=A.retrato();
 // janela de baixo deixa a tela de trás à vista em cima; o que sobe cobrindo tudo e troca o endereço é outra tela
 if(d.jan!==null&&d.jan!==a.jan&&d.janTop>innerHeight*0.08)return 'abre a janela de baixo: '+d.jan;   // (antes do endereço: no site, abrir a peça também troca o endereço)
 const m=d.flut.filter(t=>!a.flut.includes(t));if(m.length)return 'abre o menu: '+m[0].slice(0,50);
 if(d.tit!==a.tit)return 'sai para: '+d.tit;
 const pc=d.cima.filter(t=>!a.cima.includes(t));if(pc.length)return 'abre tela por cima: '+pc[0];   // camada opaca que cobre tudo sem trocar de tela
 if(d.jan!==null&&d.jan!==a.jan)return 'abre tela por cima: '+d.jan;
 const mud=Object.keys(d.est).filter(k=>k in a.est&&a.est[k]!==d.est[k]);
 if(mud.some(k=>a.est[k].split(',')[2]!==d.est[k].split(',')[2]))return 'abre ali';
 if(mud.length)return 'troca a escolha';
 const novos=Object.keys(d.tx).filter(t=>!(t in a.tx));
 if(novos.length&&novos.every(t=>d.tx[t]))return 'mostra aviso: '+novos[0].slice(0,50);
 if(novos.length)return 'abre ali';
 const ae=(a.alvo||'').split(',');if(ae[0]==='true'||ae[1]==='true'||ae[4]==='on')return 'já é a escolha';   // tocar na aba que já está escolhida não muda nada, e está certo
 return 'nada'};
// tempo de um toque: A.vigia antes do dedo; A.parou espera a tela parar de mudar (150 ms sem mudança, no máximo 15 s) e dá os ms
// PARAR AS ANIMAÇÕES para medir e fotografar: a que acaba vai para o fim (o estado de quem olha a tela), a que repete sem fim
// (zoom lento do destaque, brilho) fica no começo — assim a mesma tela sai igual toda vez
A.parar=()=>{for(const a of document.getAnimations()){try{const t=a.effect&&a.effect.getComputedTiming();if(t&&t.iterations===Infinity){a.pause();a.currentTime=0}else a.finish()}catch(e){}}return 1};
A.vigia=()=>{const st={t0:performance.now()};st.ult=st.t0;st.mo=new MutationObserver(()=>{st.ult=performance.now()});st.mo.observe(document.body,{childList:true,subtree:true,attributes:true,characterData:true});window.__argusVigia=st;return 1};
// a tela parada muda sozinha? quantas mudanças em ms milissegundos sem ninguém tocar (laço que nunca para = bateria e lentidão)
A.sozinha=ms=>new Promise(res=>{let n=0;const mo=new MutationObserver(L=>{n+=L.length});mo.observe(document.body,{childList:true,subtree:true,attributes:true,characterData:true});setTimeout(()=>{mo.disconnect();res(n)},ms)});
A.parou=()=>new Promise(res=>{const st=window.__argusVigia;if(!st)return res(-1);const fim=()=>{const n=performance.now();if(n-st.ult>=150||n-st.t0>15000){st.mo.disconnect();res(Math.round(st.ult-st.t0))}else setTimeout(fim,30)};setTimeout(fim,30)});
// Passo de planta por NOME (estável: não depende da posição na lista; 28/11, plantas do lote 2). k = qual das iguais (0 = primeira).
A.chaveNome=n=>(n||'').replace(/\d[\d.,]*/g,'#');   // números mudam com os dados (vendas, G$): o passo guarda o nome sem eles
A.tocaNome=(n,k=0)=>{const c=A.chaveNome(n),e=A.tocaveis().filter(x=>A.chaveNome(A.nome(x))===c)[k];if(!e)return false;e.scrollIntoView({block:'center',behavior:'instant'});e.click();return true};
A.altura=i=>{const e=A.tocaveis()[i];if(!e)return -1;return Math.round(A.bloco(e).getBoundingClientRect().height)};
A.aba=k=>{const b=[...document.querySelectorAll('#mainnav .mn')][k];if(!b)return 0;b.click();return 1};
A.nAbas=()=>document.querySelectorAll('#mainnav .mn').length;
A.sairSemSalvar=()=>/sair sem salvar/i.test(document.body.innerText);
A.janelaInfo=()=>{const j=A.janela();if(!j)return null;const o=Object.assign({},j);delete o.el;return o};
window.__argus=A})();

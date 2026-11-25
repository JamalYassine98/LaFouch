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
A.titulo=()=>{const h=[...document.querySelectorAll('h1')].find(e=>A.vis(e));const v=(window.__LF&&__LF.S&&__LF.S.view)||'';return (h?A.txt(h):'')+' ['+v+']'};
A.fixos=()=>[...document.querySelectorAll('body *')].filter(x=>getComputedStyle(x).position==='fixed'&&A.vis(x)&&!A.nav(x)&&!x.closest('[data-argus]'));
// a janela de baixo aberta (presa embaixo, larga e alta), ou null
// a janela de baixo é o PAINEL preso embaixo; se o que está preso é a tela inteira (o fundo escurecido), o painel é o de dentro dele
A.painel=x=>{const r=x.getBoundingClientRect();return r.bottom>=innerHeight-2&&r.width>=innerWidth*0.6&&r.height>=innerHeight*0.2};
// TELA POR CIMA: uma camada presa, opaca, que cobre a tela inteira (regra 16: não existe — ou é tela com "‹", ou janela de baixo)
A.opaca=x=>{const m=/rgba?\(([^)]+)\)/.exec(getComputedStyle(x).backgroundColor);if(!m)return false;const v=m[1].split(',').map(parseFloat);return v.length<4||v[3]>=0.9};
A.porCima=()=>A.fixos().filter(x=>{const r=x.getBoundingClientRect();return r.top<=5&&r.height>=innerHeight*0.9&&r.width>=innerWidth*0.9&&A.opaca(x)&&!(window.__LF&&x.closest('.view'))}).map(x=>{const t=[...x.querySelectorAll('h1,h2,h3,b')].find(A.vis);return t?A.txt(t).slice(0,60):'(sem título)'});
// O SINAL de um botão: "›" (sai para outra tela) ou "⌄"/"⌃" (abre ali) — pelo texto ou pelo desenho da setinha como aparece na tela
A.sinal=e=>{const t=A.txt(e);if(/›\s*$/.test(t))return '›';if(/[⌄∨]\s*$/.test(t))return '⌄';const r=e.getBoundingClientRect();
 for(const p of [...e.querySelectorAll('svg path,svg polyline')].reverse()){const s=p.closest('svg'),q=s.getBoundingClientRect();if(!A.vis(s)||q.width>28||q.left<r.left+r.width*0.6)continue;
  if(p.tagName==='path'&&((p.getAttribute('d')||'').match(/[Mm]/g)||[]).length!==1)continue;let L=0;try{L=p.getTotalLength()}catch(x){};if(!L)continue;
  const M=p.getScreenCTM(),pt=k=>{const a=p.getPointAtLength(L*k);return {x:a.x*M.a+a.y*M.c+M.e,y:a.x*M.b+a.y*M.d+M.f}},a=pt(0),m=pt(.5),b=pt(1),dx=m.x-(a.x+b.x)/2,dy=m.y-(a.y+b.y)/2;
  if(dx>2&&Math.abs(dx)>Math.abs(dy)*2)return '›';if(Math.abs(dy)>2&&Math.abs(dy)>Math.abs(dx)*2)return dy>0?'⌄':'⌃'}
 return ''};
A.janela=()=>{const pc=A.fixos().filter(x=>{const r=x.getBoundingClientRect();return r.top<=5&&r.height>=innerHeight*0.9&&A.opaca(x)});let j=A.fixos().filter(x=>A.painel(x)&&!pc.some(o=>o===x||o.contains(x))).pop();if(!j)return null;
 let tipo='baixo';
 if(j.getBoundingClientRect().top<5){const d=[...j.querySelectorAll('*')].filter(x=>A.vis(x)&&A.painel(x)&&x.getBoundingClientRect().top>=5);
  if(d.length)j=d.sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top)[0];
  else{const c=[...j.children].filter(x=>A.vis(x)&&x.getBoundingClientRect().width>=innerWidth*0.6).sort((a,b)=>b.getBoundingClientRect().height-a.getBoundingClientRect().height)[0];if(c){j=c;tipo='meio'}}}   // caixa solta no meio da tela: não é a janela de baixo
 const r=j.getBoundingClientRect(),bts=[...j.querySelectorAll('button,[role=button],a')].filter(A.vis).map(A.nome);
 return {el:j,tipo,top:r.top,titulo:A.txt(j.querySelector('h1,h2,h3,b')||j).slice(0,60),fechar:bts.filter(t=>/^(×|✕|x|fechar)$/i.test(t)),salvar:bts.some(t=>/^salvar$/i.test(t)),campo:!!j.querySelector('input:not([type=checkbox]):not([type=hidden]),textarea')}};
// O TOQUE (motor/dedo.py põe o dedo): A.alvo rola até o botão, tira o RETRATO de antes e diz onde pôr o dedo (o meio do botão).
// Se no meio do botão há outra coisa por cima, é ela que o dedo pega — como no celular: volta {coberto}.
A.alvo=i=>{const e=A.tocaveis()[i];if(!e)return null;e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();
 const x=Math.min(innerWidth-2,Math.max(1,r.left+r.width/2)),y=Math.min(innerHeight-2,Math.max(1,r.top+r.height/2)),h=document.elementFromPoint(x,y);
 window.__argusAntes=A.retrato();window.__argusAntes.alvo=A.estado(e);
 const toque=navigator.maxTouchPoints>0;if(h&&h!==e&&!e.contains(h))return {coberto:A.nome(h)||h.tagName.toLowerCase(),x,y,toque};return {x,y,toque}};
// estado de um botão que se vê (escolhido, aberto, marcado)
A.estado=e=>['aria-pressed','aria-selected','aria-expanded','aria-checked'].map(a=>e.getAttribute(a)||'').join(',')+(e.classList.contains('on')?',on':'')+(e.checked?',marcado':'');
// caixas soltas por cima da tela que têm botões (menus), fora a janela de baixo e a barra de abas
A.flutuantes=()=>{const L=[...document.querySelectorAll('body *')].filter(x=>{const c=getComputedStyle(x);if(c.position!=='fixed'&&c.position!=='absolute')return false;if(!A.vis(x)||A.nav(x)||A.painel(x)||x.closest('[data-argus]'))return false;
 const r=x.getBoundingClientRect();return r.width>=80&&r.height>=40&&r.width<innerWidth*0.95&&[...x.querySelectorAll(A.TOC)].some(A.vis)});return L.filter(x=>!L.some(o=>o!==x&&o.contains(x)))};
// o RETRATO da tela: nome, estados dos botões, caixas soltas, janela e os textos que se veem
A.retrato=()=>{const vist={},est={};for(const e of [...document.querySelectorAll(A.TOC+',[role=tab]')].filter(A.vis)){const n=A.nome(e);vist[n]=(vist[n]||0)+1;est[n+'#'+vist[n]]=A.estado(e)}
 const fx=A.fixos(),tx={};for(const e of document.querySelectorAll('body *')){if(!A.vis(e)||A.nav(e))continue;const t=A.own(e);if(t)tx[t]=fx.some(f=>f.contains(e))}   // tx[texto] = está numa camada presa (aviso)
 const j=A.janela();return {tit:A.titulo(),est,flut:A.flutuantes().map(A.txt),jan:j?j.titulo:null,cima:A.porCima(),tx}};
// O QUE O TOQUE FEZ: o retrato de agora contra o de antes do toque
A.depois=()=>{const a=window.__argusAntes;if(!a)return 'não achado';const d=A.retrato();
 const pc=d.cima.filter(t=>!a.cima.includes(t));if(pc.length)return 'abre tela por cima: '+pc[0];
 if(d.tit!==a.tit)return 'sai para: '+d.tit;
 if(d.jan!==null&&d.jan!==a.jan)return 'abre a janela de baixo: '+d.jan;
 const m=d.flut.filter(t=>!a.flut.includes(t));if(m.length)return 'abre o menu: '+m[0].slice(0,50);
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
A.altura=i=>{const e=A.tocaveis()[i];if(!e)return -1;return Math.round(A.bloco(e).getBoundingClientRect().height)};
A.aba=k=>{const b=[...document.querySelectorAll('#mainnav .mn')][k];if(!b)return 0;b.click();return 1};
A.nAbas=()=>document.querySelectorAll('#mainnav .mn').length;
A.sairSemSalvar=()=>/sair sem salvar/i.test(document.body.innerText);
A.janelaInfo=()=>{const j=A.janela();if(!j)return null;const o=Object.assign({},j);delete o.el;return o};
window.__argus=A})();

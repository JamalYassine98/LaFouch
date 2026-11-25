// ARGUS · base comum (UM lugar só). Entra ANTES do app em toda página que o Argus abre (simulador e Android emulado).
// Todas as medidas usam estas funções: o que é visível, o texto próprio de uma peça, o que se pode tocar, a linha de uma peça,
// o nome da tela, a janela de baixo. Mudou aqui, mudou em todas as ferramentas.
(()=>{if(window.__argus)return;
const A={};
A.vis=e=>{if(!e||e.nodeType!==1)return false;const r=e.getBoundingClientRect();if(r.width<1||r.height<1)return false;for(let p=e;p&&p.nodeType===1;p=p.parentElement){const c=getComputedStyle(p);if(c.display==='none'||c.visibility==='hidden'||+c.opacity===0)return false}return true};
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
A.janela=()=>{let j=A.fixos().filter(A.painel).pop();if(!j)return null;
 let tipo='baixo';
 if(j.getBoundingClientRect().top<5){const d=[...j.querySelectorAll('*')].filter(x=>A.vis(x)&&A.painel(x)&&x.getBoundingClientRect().top>=5);
  if(d.length)j=d.sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top)[0];
  else{const c=[...j.children].filter(x=>A.vis(x)&&x.getBoundingClientRect().width>=innerWidth*0.6).sort((a,b)=>b.getBoundingClientRect().height-a.getBoundingClientRect().height)[0];if(c){j=c;tipo='meio'}}}   // caixa solta no meio da tela: não é a janela de baixo
 const r=j.getBoundingClientRect(),bts=[...j.querySelectorAll('button,[role=button],a')].filter(A.vis).map(A.nome);
 return {el:j,tipo,top:r.top,titulo:A.txt(j.querySelector('h1,h2,h3,b')||j).slice(0,60),fechar:bts.filter(t=>/^(×|✕|x|fechar)$/i.test(t)),salvar:bts.some(t=>/^salvar$/i.test(t)),campo:!!j.querySelector('input:not([type=checkbox]):not([type=hidden]),textarea')}};
A.tocar=i=>{const e=A.tocaveis()[i];if(!e)return null;e.scrollIntoView({block:'center',behavior:'instant'});window.__argusAntes={h:document.documentElement.scrollHeight,fixos:A.fixos().length,y:scrollY};e.click();return 1};
A.depois=()=>{const a=window.__argusAntes||{};const j=A.janela();return {dh:document.documentElement.scrollHeight-(a.h||0),janela:(A.fixos().length>(a.fixos||0)&&j)?j.titulo:null}};
A.altura=i=>{const e=A.tocaveis()[i];if(!e)return -1;return Math.round(A.bloco(e).getBoundingClientRect().height)};
A.aba=k=>{const b=[...document.querySelectorAll('#mainnav .mn')][k];if(!b)return 0;b.click();return 1};
A.nAbas=()=>document.querySelectorAll('#mainnav .mn').length;
A.sairSemSalvar=()=>/sair sem salvar/i.test(document.body.innerText);
A.janelaInfo=()=>{const j=A.janela();if(!j)return null;const o=Object.assign({},j);delete o.el;return o};
window.__argus=A})();

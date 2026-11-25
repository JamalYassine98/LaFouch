// ARGUS · o voltar: onde está o botão de voltar do topo da tela que se vê (base.js: A.voltar), para o dedo tocar (motor/dedo.py), ou null
()=>{const A=window.__argus,b=[...document.querySelectorAll('button,a,[data-act]')].find(e=>A.vis(e)&&e.getBoundingClientRect().top+scrollY<280&&A.voltar(e));if(!b)return null;
 b.scrollIntoView({block:'center',behavior:'instant'});const r=b.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,toque:navigator.maxTouchPoints>0}}

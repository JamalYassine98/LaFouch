// ARGUS · o voltar: onde está o botão "‹ …" do topo da tela que se vê (o dedo toca nele: motor/dedo.py), ou null (aí vale o voltar do aparelho)
()=>{const A=window.__argus,b=[...document.querySelectorAll('button,a,[data-act]')].find(e=>{if(!A.vis(e))return false;const r=e.getBoundingClientRect();return r.top+scrollY<280&&/^‹|^voltar/i.test((e.getAttribute('aria-label')||e.textContent||'').trim())});if(!b)return null;
 b.scrollIntoView({block:'center',behavior:'instant'});const r=b.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,toque:navigator.maxTouchPoints>0}}
